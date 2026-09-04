#!/usr/bin/env python3
"""Home Sentinel: discovery continua della LAN + monitor dei probe request WiFi/BLE.

Tre moduli indipendenti, ciascuno in un proprio thread:
  - LanDiscoveryService: ARP scan periodico della subnet, con hostname
    (reverse DNS, con fallback a NetBIOS quando manca il PTR), vendor (da
    MAC OUI) e port scan; scrive ogni evento su JSON Lines.
  - WifiProbeMonitor (opzionale): sniffing passivo dei probe request 802.11
    su un'interfaccia in monitor mode, con channel hopping; scrive ogni
    probe catturato su un secondo file JSON Lines. Osserva anche i beacon
    — loggati su un quarto file JSON Lines come reti WiFi realmente
    presenti (BSSID/SSID/canale/RSSI), oltre che usati per il rilevamento
    evil twin — i frame deauth/disassoc (possibile attacco flood) e stima
    il traffico per device dai frame dati catturati, tutto sullo stesso
    adattatore in monitor mode, senza sonde aggiuntive.
  - BleScanMonitor (opzionale): scan passivo degli advertisement BLE nei
    dintorni via l'adattatore Bluetooth locale (BlueZ) — a differenza del
    probe WiFi non serve un adattatore esterno: il Bluetooth 4.1 LE onboard
    del Raspberry Pi 3 basta; scrive su un terzo file JSON Lines.

Richiede privilegi di root (ARP scan e sniffing 802.11 usano socket raw;
lo scan BLE via BlueZ tipicamente richiede root o la capability
cap_net_admin sull'adattatore).
Pensato per girare sotto systemd (vedi systemd/home-sentinel.service)
piuttosto che auto-demonizzarsi con un doppio fork.
"""

from __future__ import annotations

import argparse
import asyncio
import json
import logging
import os
import signal
import socket
import subprocess
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path

try:
    from scapy.all import ARP, Ether, conf, sniff, srp
    from scapy.layers.dot11 import Dot11, Dot11Beacon, Dot11Deauth, Dot11Disas, Dot11Elt, Dot11ProbeReq
except ImportError as exc:  # pragma: no cover
    raise SystemExit(
        "scapy non è installato. Installa le dipendenze con: pip install -r requirements.txt"
    ) from exc

from sentinel_detection import (
    AlertManager,
    AnomalyDetector,
    DeauthFloodDetector,
    EvilTwinDetector,
    RogueDhcpDetector,
)
from sentinel_fingerprint import fingerprint_device, netbios_probe
from sentinel_storage import SqliteStore

LOG = logging.getLogger("home_sentinel")

# 50 porte "alte" (>1024) comuni per servizi self-hosted/home-lab/IoT tipici
# su una rete domestica (NAS, home automation, media server, dev/db) — le
# porte 1-1024 ("well-known") non hanno bisogno di essere elencate qui, sono
# già tutte incluse in DEFAULT_PORTS sotto.
COMMON_HIGH_PORTS = [
    1433, 1521, 1723, 1883, 2049, 2375, 2376, 3000, 3001, 3306,
    4443, 4444, 5000, 5001, 5432, 5601, 5900, 5901, 6379, 6667,
    6881, 7000, 7070, 8006, 8008, 8009, 8080, 8081, 8088, 8096,
    8123, 8181, 8443, 8500, 8880, 8883, 8888, 9000, 9001, 9042,
    9090, 9091, 9100, 9200, 9300, 9443, 10000, 11211, 27017, 32400,
]
DEFAULT_PORTS = sorted(set(range(1, 1025)) | set(COMMON_HIGH_PORTS))


# --------------------------------------------------------------------------
# Utility
# --------------------------------------------------------------------------

def get_vendor(mac: str) -> str:
    """Vendor da OUI del MAC, usando il DB manuf incluso in scapy."""
    try:
        return conf.manufdb._get_manuf(mac) or ""
    except Exception:
        return ""


def resolve_hostname(ip: str, timeout: float = 1.0) -> str:
    old_timeout = socket.getdefaulttimeout()
    socket.setdefaulttimeout(timeout)
    try:
        return socket.gethostbyaddr(ip)[0]
    except (socket.herror, socket.gaierror, socket.timeout, OSError):
        return ""
    finally:
        socket.setdefaulttimeout(old_timeout)


def scan_ports(ip: str, ports: list[int], timeout: float = 0.5) -> list[int]:
    def check(port: int):
        try:
            with socket.create_connection((ip, port), timeout=timeout):
                return port
        except OSError:
            return None

    open_ports = []
    # Con liste da ~1000 porte (default: 1-1024 + porte alte comuni) un tetto
    # di 32 thread renderebbe lo scan di un device lento (decine di secondi
    # su porte filtrate che vanno in timeout); 128 thread — comunque solo
    # I/O in attesa, non CPU-bound — lo riportano a pochi secondi anche su
    # un Raspberry Pi 3.
    with ThreadPoolExecutor(max_workers=min(128, len(ports)) or 1) as ex:
        for result in ex.map(check, ports):
            if result:
                open_ports.append(result)
    return sorted(open_ports)


def arp_scan(subnet: str, iface: str | None, timeout: float = 2.0) -> list[tuple[str, str]]:
    packet = Ether(dst="ff:ff:ff:ff:ff:ff") / ARP(pdst=subnet)
    kwargs = {"timeout": timeout, "verbose": False}
    if iface:
        kwargs["iface"] = iface
    answered, _ = srp(packet, **kwargs)
    return [(received.psrc, received.hwsrc) for _, received in answered]


class JsonlLogger:
    """Writer JSON Lines thread-safe, append-only, con flush ad ogni riga.

    Un oggetto JSON per riga, senza header: ogni riga è autodescrittiva e
    una riga troncata da una scrittura interrotta (crash, spegnimento
    improvviso) viene semplicemente ignorata da un parser JSONL a valle,
    esattamente come un CSV con l'ultima riga incompleta.

    Con `max_bytes` impostato, il file viene ruotato in stile logrotate
    quando supera quella soglia: `<nome>.jsonl` -> `<nome>.1.jsonl` -> ... ->
    `<nome>.<backup_count>.jsonl` (che viene eliminato). Il file "vivo" resta
    sempre allo stesso path, quindi eventuali symlink verso di esso (es.
    quelli creati da dashboard/link-logs.sh) restano validi dopo la
    rotazione: puntano al percorso, non all'inode, e vedono subito il nuovo
    file più piccolo. Necessario perché i probe WiFi in particolare possono
    accumulare svariati MB al giorno su una rete affollata, senza questo
    limite crescerebbero indefinitamente.
    """

    def __init__(self, path: Path, max_bytes: int | None = None, backup_count: int = 3):
        self.path = path
        self.max_bytes = max_bytes
        self.backup_count = backup_count
        self._lock = threading.Lock()
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._file = open(self.path, "a", encoding="utf-8")

    def write(self, row: dict) -> None:
        with self._lock:
            self._file.write(json.dumps(row, ensure_ascii=False))
            self._file.write("\n")
            self._file.flush()
            if self.max_bytes and self._file.tell() >= self.max_bytes:
                self._rotate()

    def _rotate(self) -> None:
        self._file.close()
        if self.backup_count > 0:
            for i in range(self.backup_count - 1, 0, -1):
                src = self.path.with_suffix(f".{i}{self.path.suffix}")
                dst = self.path.with_suffix(f".{i + 1}{self.path.suffix}")
                if src.exists():
                    src.replace(dst)
            self.path.replace(self.path.with_suffix(f".1{self.path.suffix}"))
        else:
            self.path.unlink(missing_ok=True)
        LOG.info("Ruotato %s (limite %d byte raggiunto)", self.path, self.max_bytes)
        self._file = open(self.path, "a", encoding="utf-8")

    def close(self) -> None:
        with self._lock:
            self._file.close()


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# --------------------------------------------------------------------------
# LAN discovery
# --------------------------------------------------------------------------

@dataclass
class DeviceState:
    ip: str
    hostname: str
    vendor: str
    last_seen: float
    online: bool = True


class LanDiscoveryService:
    def __init__(
        self,
        subnet: str,
        iface: str | None,
        interval: float,
        ports: list[int],
        port_scan_interval: float,
        log: JsonlLogger,
        stop_event: threading.Event,
        sqlite_store: SqliteStore | None = None,
        anomaly_detector: AnomalyDetector | None = None,
        alert_manager: AlertManager | None = None,
        arp_detection_enabled: bool = True,
        fingerprint_log: JsonlLogger | None = None,
    ):
        self.subnet = subnet
        self.iface = iface
        self.interval = interval
        self.ports = ports
        self.port_scan_interval = port_scan_interval
        self.log = log
        self.stop_event = stop_event
        self.sqlite_store = sqlite_store
        self.anomaly_detector = anomaly_detector
        self.alert_manager = alert_manager
        self.arp_detection_enabled = arp_detection_enabled
        self.fingerprint_log = fingerprint_log
        self.devices: dict[str, DeviceState] = {}
        self._last_port_scan: dict[str, float] = {}
        self._ip_owner: dict[str, str] = {}

    def run(self) -> None:
        LOG.info("LAN discovery avviato su %s (intervallo=%ss)", self.subnet, self.interval)
        while not self.stop_event.is_set():
            cycle_start = time.time()
            try:
                self._do_cycle()
            except Exception:
                LOG.exception("Ciclo di LAN discovery fallito")
            elapsed = time.time() - cycle_start
            self.stop_event.wait(max(0.0, self.interval - elapsed))

    def _do_cycle(self) -> None:
        found = arp_scan(self.subnet, self.iface)
        now = time.time()
        seen_macs = set()

        for ip, mac in found:
            mac = mac.lower()
            seen_macs.add(mac)

            if self.arp_detection_enabled:
                self._check_arp_conflict(ip, mac)
            self._ip_owner[ip] = mac

            state = self.devices.get(mac)
            is_new = state is None

            hostname = state.hostname if state else ""
            vendor = state.vendor if state else ""
            if is_new or not hostname:
                hostname = resolve_hostname(ip)
                if not hostname:
                    # Molti device (specie IoT/stampanti) non hanno un PTR DNS ma
                    # rispondono comunque a una query NetBIOS: un secondo metodo di
                    # discovery a costo contenuto (un pacchetto UDP, timeout breve)
                    # per popolare l'hostname quando il primo fallisce.
                    hostname = netbios_probe(ip)
            if is_new or not vendor:
                vendor = get_vendor(mac)

            do_port_scan = is_new or (now - self._last_port_scan.get(mac, 0.0) >= self.port_scan_interval)
            open_ports: list[int] = []
            if do_port_scan:
                open_ports = scan_ports(ip, self.ports)
                self._last_port_scan[mac] = now
                if self.fingerprint_log is not None:
                    self._fingerprint_and_log(ip, mac, open_ports, vendor)

            self.devices[mac] = DeviceState(ip=ip, hostname=hostname, vendor=vendor, last_seen=now, online=True)
            self._write("new" if is_new else "online", ip, mac, hostname, vendor, open_ports)

            if self.anomaly_detector is not None:
                self.anomaly_detector.observe(mac, ip, hostname, vendor, open_ports)

        for mac, state in list(self.devices.items()):
            if mac not in seen_macs and state.online:
                state.online = False
                self._write("offline", state.ip, mac, state.hostname, state.vendor, [])

    def _check_arp_conflict(self, ip: str, mac: str) -> None:
        """Segnala solo un conflitto reale: due MAC diversi, entrambi online, che rivendicano lo stesso IP.

        Una semplice riassegnazione DHCP (il vecchio device va offline, poi
        un altro device prende quell'IP) non genera alert: qui si controlla
        esplicitamente che il MAC precedente risulti *ancora* online,
        condizione tipica di ARP spoofing/poisoning, non di normale
        turnover DHCP.
        """
        prev_mac = self._ip_owner.get(ip)
        if not prev_mac or prev_mac == mac:
            return
        prev_state = self.devices.get(prev_mac)
        if prev_state and prev_state.online and self.alert_manager is not None:
            self.alert_manager.emit(
                "high", "possibile_arp_spoofing",
                f"L'IP {ip} è rivendicato sia da {prev_mac} che da {mac} mentre entrambi risultano online: "
                "possibile ARP spoofing/poisoning",
                ip=ip, mac=mac, details={"mac_precedente": prev_mac, "mac_nuovo": mac},
            )

    def _fingerprint_and_log(self, ip: str, mac: str, open_ports: list[int], vendor: str) -> None:
        try:
            result = fingerprint_device(ip, open_ports, vendor)
        except Exception:
            LOG.exception("Fingerprint fallito per %s", ip)
            return
        row = {"timestamp": now_iso(), "mac": mac, "ip": ip, **result}
        self.fingerprint_log.write(row)
        if self.sqlite_store:
            self.sqlite_store.insert_fingerprint(row)
        LOG.debug("Fingerprint ip=%s mac=%s type=%s services=%s", ip, mac, result["device_type"], result["services"])

    def _write(self, status: str, ip: str, mac: str, hostname: str, vendor: str, open_ports: list[int]) -> None:
        row = {
            "timestamp": now_iso(),
            "status": status,
            "ip": ip,
            "mac": mac,
            "hostname": hostname,
            "vendor": vendor,
            "open_ports": open_ports,
        }
        self.log.write(row)
        if self.sqlite_store:
            self.sqlite_store.insert_lan_event(row)
        LOG.debug("LAN %s ip=%s mac=%s host=%s", status, ip, mac, hostname)


# --------------------------------------------------------------------------
# WiFi probe monitor
# --------------------------------------------------------------------------

class WifiProbeMonitor:
    def __init__(
        self,
        iface: str,
        channels: list[int],
        hop_interval: float,
        log: JsonlLogger,
        stop_event: threading.Event,
        auto_monitor: bool = False,
        sqlite_store: SqliteStore | None = None,
        evil_twin_detector: EvilTwinDetector | None = None,
        deauth_detector: DeauthFloodDetector | None = None,
        traffic_log: JsonlLogger | None = None,
        traffic_flush_interval: float = 60.0,
        networks_log: JsonlLogger | None = None,
        networks_log_interval: float = 30.0,
    ):
        self.iface = iface
        self.channels = channels
        self.hop_interval = hop_interval
        self.log = log
        self.stop_event = stop_event
        self.auto_monitor = auto_monitor
        self.sqlite_store = sqlite_store
        self.evil_twin_detector = evil_twin_detector
        self.deauth_detector = deauth_detector
        self.traffic_log = traffic_log
        self.traffic_flush_interval = traffic_flush_interval
        self.networks_log = networks_log
        self.networks_log_interval = networks_log_interval
        self._current_channel = channels[0]
        self._traffic_lock = threading.Lock()
        self._traffic_counters: dict[str, dict[str, int]] = {}
        self._networks_last_logged: dict[str, float] = {}

    def _setup_monitor_mode(self) -> None:
        for cmd in (
            ["ip", "link", "set", self.iface, "down"],
            ["iw", "dev", self.iface, "set", "type", "monitor"],
            ["ip", "link", "set", self.iface, "up"],
        ):
            subprocess.run(cmd, check=True, capture_output=True, text=True)

    def _set_channel(self, channel: int) -> None:
        subprocess.run(
            ["iw", "dev", self.iface, "set", "channel", str(channel)],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        self._current_channel = channel

    def _hop_loop(self) -> None:
        idx = 0
        while not self.stop_event.is_set():
            channel = self.channels[idx % len(self.channels)]
            try:
                self._set_channel(channel)
            except subprocess.CalledProcessError:
                LOG.warning("Impossibile impostare il canale %s su %s", channel, self.iface)
            idx += 1
            self.stop_event.wait(self.hop_interval)

    def _handle_packet(self, pkt) -> None:
        if self.deauth_detector is not None and (pkt.haslayer(Dot11Deauth) or pkt.haslayer(Dot11Disas)):
            self._handle_deauth(pkt)

        if (self.evil_twin_detector is not None or self.networks_log is not None) and pkt.haslayer(Dot11Beacon):
            self._handle_beacon(pkt)

        if self.traffic_log is not None and pkt.haslayer(Dot11) and pkt.type == 2:
            self._handle_data_frame(pkt)

        if not pkt.haslayer(Dot11ProbeReq):
            return
        mac = pkt.addr2
        if not mac:
            return
        mac = mac.lower()

        ssid = ""
        elt = pkt.getlayer(Dot11Elt)
        if elt is not None and elt.ID == 0:
            try:
                ssid = elt.info.decode(errors="ignore")
            except Exception:
                ssid = ""

        rssi = pkt.dBm_AntSignal if hasattr(pkt, "dBm_AntSignal") else None

        row = {
            "timestamp": now_iso(),
            "mac": mac,
            "vendor": get_vendor(mac),
            "ssid": ssid,
            "rssi": rssi,
            "channel": self._current_channel,
        }
        self.log.write(row)
        if self.sqlite_store:
            self.sqlite_store.insert_probe_event(row)
        LOG.debug("WiFi probe mac=%s ssid=%r rssi=%s ch=%s", mac, ssid, rssi, self._current_channel)

    def _handle_beacon(self, pkt) -> None:
        bssid = pkt.addr2
        ssid = None
        channel = None
        elt = pkt.getlayer(Dot11Elt)
        while elt is not None:
            if elt.ID == 0 and ssid is None:
                try:
                    ssid = elt.info.decode(errors="ignore")
                except Exception:
                    ssid = ""
            elif elt.ID == 3 and channel is None and elt.info:
                # Elemento "DS Parameter Set": un byte col canale dichiarato
                # dall'AP stesso, indipendente dal canale su cui lo sniffer si
                # trova in quel momento (più affidabile del solo hopping).
                try:
                    channel = int(elt.info[0])
                except Exception:
                    channel = None
            elt = elt.payload.getlayer(Dot11Elt)
        if ssid is None:
            return

        if self.evil_twin_detector is not None:
            self.evil_twin_detector.observe_beacon(ssid, bssid or "")

        if self.networks_log is not None and bssid:
            self._log_network(bssid.lower(), ssid, channel, pkt)

    def _log_network(self, bssid: str, ssid: str, channel: int | None, pkt) -> None:
        """Logga una rete WiFi realmente rilevata (dal beacon del suo AP), non più di una volta ogni `networks_log_interval` secondi per BSSID.

        A differenza del canale mostrato per un probe request (quello dello
        sniffer, non della rete), qui il canale è reale: o dichiarato
        dall'AP stesso nel beacon (DS Parameter Set), o — quando assente —
        quello su cui lo sniffer si trovava mentre ascoltava quel beacon,
        comunque affidabile perché un beacon si riceve solo restando
        sintonizzati sul canale dell'AP che lo trasmette.
        """
        now = time.time()
        last = self._networks_last_logged.get(bssid, 0.0)
        if now - last < self.networks_log_interval:
            return
        self._networks_last_logged[bssid] = now

        rssi = pkt.dBm_AntSignal if hasattr(pkt, "dBm_AntSignal") else None
        row = {
            "timestamp": now_iso(),
            "bssid": bssid,
            "ssid": ssid,
            "vendor": get_vendor(bssid),
            "rssi": rssi,
            "channel": channel if channel is not None else self._current_channel,
        }
        self.networks_log.write(row)
        if self.sqlite_store:
            self.sqlite_store.insert_wifi_network(row)
        LOG.debug("WiFi network bssid=%s ssid=%r channel=%s rssi=%s", bssid, ssid, row["channel"], rssi)

    def _handle_deauth(self, pkt) -> None:
        kind = "deauth" if pkt.haslayer(Dot11Deauth) else "disassoc"
        reason_code = None
        try:
            layer = pkt[Dot11Deauth] if kind == "deauth" else pkt[Dot11Disas]
            reason_code = int(layer.reason)
        except Exception:
            pass
        source = (pkt.addr2 or "").lower()
        dest = (pkt.addr1 or "").lower()
        self.deauth_detector.observe(kind, source, dest, reason_code)

    def _handle_data_frame(self, pkt) -> None:
        # Stima grezza del traffico per MAC: conta byte/frame dei frame dati
        # visti durante il channel hopping. Il payload resta illeggibile se
        # la rete è cifrata (WPA2/3), ma lunghezza e header 802.11 restano
        # visibili anche così — sufficiente per un indicatore relativo di
        # "chi genera più traffico", non per una banda esatta (si vede solo
        # una frazione dei frame, quella catturata durante la sosta su quel
        # canale).
        mac = (pkt.addr2 or "").lower()
        if not mac:
            return
        with self._traffic_lock:
            entry = self._traffic_counters.setdefault(mac, {"bytes": 0, "frames": 0})
            entry["bytes"] += len(pkt)
            entry["frames"] += 1

    def _flush_traffic(self) -> None:
        with self._traffic_lock:
            counters = self._traffic_counters
            self._traffic_counters = {}
        if not counters:
            return
        ts = now_iso()
        for mac, stats in counters.items():
            row = {
                "timestamp": ts, "mac": mac,
                "bytes": stats["bytes"], "frames": stats["frames"],
                "interval_s": self.traffic_flush_interval,
            }
            self.traffic_log.write(row)
            if self.sqlite_store:
                self.sqlite_store.insert_wifi_traffic(row)

    def _traffic_flush_loop(self) -> None:
        while not self.stop_event.is_set():
            self.stop_event.wait(self.traffic_flush_interval)
            self._flush_traffic()

    def run(self) -> None:
        if self.auto_monitor:
            try:
                self._setup_monitor_mode()
            except subprocess.CalledProcessError as exc:
                LOG.error(
                    "Impostazione automatica della monitor mode fallita su %s "
                    "(comando: %s): %s. Un errore comune è NetworkManager/"
                    "wpa_supplicant che gestisce ancora l'interfaccia: verifica con "
                    "'nmcli device status' e imposta l'interfaccia come unmanaged, "
                    "oppure esegui manualmente 'iw dev %s set type monitor'.",
                    self.iface,
                    " ".join(exc.cmd),
                    (exc.stderr or "").strip() or "nessun output su stderr",
                    self.iface,
                )

        hop_thread = threading.Thread(target=self._hop_loop, daemon=True, name="wifi-channel-hop")
        hop_thread.start()

        traffic_thread = None
        if self.traffic_log is not None:
            traffic_thread = threading.Thread(
                target=self._traffic_flush_loop, daemon=True, name="wifi-traffic-flush",
            )
            traffic_thread.start()

        LOG.info("WiFi probe monitor avviato su %s", self.iface)
        try:
            while not self.stop_event.is_set():
                sniff(iface=self.iface, prn=self._handle_packet, store=False, timeout=1)
        except Exception:
            LOG.exception("WiFi probe monitor terminato con errore")
        finally:
            hop_thread.join(timeout=2)
            if traffic_thread:
                self._flush_traffic()  # scrive gli eventuali contatori residui prima di uscire
                traffic_thread.join(timeout=2)


# --------------------------------------------------------------------------
# BLE scan monitor
# --------------------------------------------------------------------------

class BleScanMonitor:
    """Scan passivo degli advertisement BLE nei dintorni via BlueZ.

    A differenza del probe monitor WiFi non serve un adattatore esterno né
    una modalità speciale: il Bluetooth 4.1 LE onboard del Raspberry Pi 3
    è sufficiente. Usa bleak (import posticipato, così il resto del daemon
    funziona anche senza bleak installato se BLE non è abilitato).
    """

    def __init__(
        self,
        log: JsonlLogger,
        stop_event: threading.Event,
        adapter: str | None = None,
        sqlite_store: SqliteStore | None = None,
    ):
        self.log = log
        self.stop_event = stop_event
        self.adapter = adapter
        self.sqlite_store = sqlite_store

    def _handle_detection(self, device, advertisement_data) -> None:
        row = {
            "timestamp": now_iso(),
            "mac": device.address.lower(),
            "name": advertisement_data.local_name or device.name or "",
            "rssi": advertisement_data.rssi,
            "tx_power": advertisement_data.tx_power,
            "manufacturer_ids": sorted(advertisement_data.manufacturer_data.keys()),
            "service_uuids": list(advertisement_data.service_uuids),
        }
        self.log.write(row)
        if self.sqlite_store:
            self.sqlite_store.insert_ble_event(row)
        LOG.debug("BLE device mac=%s name=%r rssi=%s", row["mac"], row["name"], row["rssi"])

    async def _run_async(self) -> None:
        try:
            from bleak import BleakScanner
        except ImportError as exc:
            raise SystemExit(
                "bleak non è installato. Installa le dipendenze con: pip install -r requirements.txt"
            ) from exc

        kwargs = {}
        if self.adapter:
            kwargs["bluez"] = {"adapter": self.adapter}

        LOG.info("BLE scan monitor avviato%s", f" su {self.adapter}" if self.adapter else "")
        scanner = BleakScanner(detection_callback=self._handle_detection, **kwargs)
        await scanner.start()
        try:
            while not self.stop_event.is_set():
                await asyncio.sleep(1)
        finally:
            try:
                await scanner.stop()
            except Exception:
                # BlueZ a volte risponde "Operation already in progress" allo
                # stop se uno scan/discovery era già in corso su un altro
                # client D-Bus sullo stesso adattatore: non è un errore del
                # daemon, quindi lo logghiamo a debug invece che come ERROR
                # con traceback ad ogni spegnimento pulito.
                LOG.debug("Errore (ignorato) durante lo stop dello scanner BLE", exc_info=True)

    def run(self) -> None:
        try:
            asyncio.run(self._run_async())
        except Exception:
            LOG.exception("BLE scan monitor terminato con errore")


# --------------------------------------------------------------------------
# Entry point
# --------------------------------------------------------------------------

def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Home Sentinel - discovery LAN + monitor probe WiFi")
    p.add_argument("--subnet", required=True, help="Subnet CIDR da scansionare, es. 192.168.1.0/24")
    p.add_argument("--lan-iface", default=None, help="Interfaccia per lo scan ARP (default: routing automatico)")
    p.add_argument("--interval", type=float, default=60.0, help="Intervallo tra i cicli di scan LAN (s)")
    p.add_argument(
        "--ports",
        default=",".join(str(port) for port in DEFAULT_PORTS),
        help=(
            "Porte da controllare, separate da virgola (default: le porte 1-1024 "
            "più ~50 porte \"alte\" comuni per servizi self-hosted/home-lab/IoT, "
            "es. 8080, 8123, 9100, 32400 — elenco completo in COMMON_HIGH_PORTS "
            "dentro home_sentinel.py)"
        ),
    )
    p.add_argument(
        "--port-scan-interval",
        type=float,
        default=3600.0,
        help="Intervallo minimo tra due port-scan dello stesso device (s)",
    )
    p.add_argument(
        "--lan-log",
        default="/var/log/home-sentinel/lan_discovery.jsonl",
        help="Percorso file JSON Lines output LAN discovery",
    )

    p.add_argument(
        "--wifi-iface",
        default=None,
        help="Interfaccia WiFi in monitor mode per il probe sniffing (omettere per disabilitare)",
    )
    p.add_argument(
        "--probe-log",
        default="/var/log/home-sentinel/wifi_probes.jsonl",
        help="Percorso file JSON Lines output probe WiFi",
    )
    p.add_argument(
        "--wifi-channels",
        default="1,2,3,4,5,6,7,8,9,10,11,12,13",
        help="Canali WiFi su cui fare hopping, separati da virgola",
    )
    p.add_argument("--wifi-hop-interval", type=float, default=0.5, help="Secondi di permanenza per canale")
    p.add_argument(
        "--auto-monitor",
        action="store_true",
        help="Prova a impostare automaticamente --wifi-iface in monitor mode",
    )

    p.add_argument(
        "--ble",
        action="store_true",
        help="Abilita lo scan passivo dei device BLE nei dintorni via l'adattatore Bluetooth locale",
    )
    p.add_argument(
        "--ble-adapter",
        default=None,
        help="Adattatore Bluetooth da usare per lo scan BLE, es. hci0 (default: adattatore di sistema)",
    )
    p.add_argument(
        "--ble-log",
        default="/var/log/home-sentinel/ble_discovery.jsonl",
        help="Percorso file JSON Lines output scan BLE",
    )

    p.add_argument(
        "--db",
        default="/var/log/home-sentinel/home-sentinel.db",
        help="Percorso database SQLite (specchio indicizzato dei log JSON Lines, per query storiche)",
    )
    p.add_argument("--no-db", action="store_true", help="Disabilita lo specchio SQLite")

    p.add_argument(
        "--fingerprint",
        action="store_true",
        help="Abilita il fingerprinting dei device LAN (mDNS/SSDP/NetBIOS/banner) su ogni port scan",
    )
    p.add_argument(
        "--fingerprint-log",
        default="/var/log/home-sentinel/fingerprint_discovery.jsonl",
        help="Percorso file JSON Lines output fingerprint device",
    )

    p.add_argument(
        "--alerts-log",
        default="/var/log/home-sentinel/alerts_detection.jsonl",
        help="Percorso file JSON Lines degli alert generati dai rilevatori (anomalie, ARP, DHCP, evil twin)",
    )
    p.add_argument(
        "--no-anomaly-detection",
        action="store_true",
        help="Disabilita la baseline comportamentale per device (porte note)",
    )
    p.add_argument(
        "--no-arp-detection",
        action="store_true",
        help="Disabilita il rilevamento di conflitti IP/MAC (possibile ARP spoofing) durante lo scan LAN",
    )

    p.add_argument(
        "--detect-rogue-dhcp",
        action="store_true",
        help="Abilita lo sniffing passivo DHCP per rilevare server DHCP non attesi (possibile rogue DHCP)",
    )
    p.add_argument(
        "--dhcp-trusted-servers",
        default="",
        help="IP dei server DHCP fidati, separati da virgola (default: impara il primo osservato)",
    )
    p.add_argument(
        "--dhcp-iface",
        default=None,
        help="Interfaccia su cui sniffare il traffico DHCP (default: stessa di --lan-iface)",
    )

    p.add_argument(
        "--home-ssid",
        default="",
        help="SSID di casa da monitorare per possibili evil twin, separati da virgola "
        "(richiede --wifi-iface; ogni BSSID nuovo per un SSID monitorato genera un alert)",
    )

    p.add_argument(
        "--no-deauth-detection",
        action="store_true",
        help="Disabilita il rilevamento di burst di frame deauth/disassoc 802.11 (richiede --wifi-iface)",
    )
    p.add_argument(
        "--deauth-window-seconds",
        type=float,
        default=10.0,
        help="Finestra temporale (s) su cui contare i frame deauth/disassoc per rilevare un burst",
    )
    p.add_argument(
        "--deauth-threshold",
        type=int,
        default=10,
        help="Numero minimo di frame deauth/disassoc nella finestra per generare un alert",
    )

    p.add_argument(
        "--no-wifi-traffic",
        action="store_true",
        help="Disabilita la stima del traffico WiFi per device (richiede --wifi-iface)",
    )
    p.add_argument(
        "--wifi-traffic-log",
        default="/var/log/home-sentinel/wifi_traffic.jsonl",
        help="Percorso file JSON Lines della stima di traffico WiFi per device",
    )
    p.add_argument(
        "--wifi-traffic-interval",
        type=float,
        default=60.0,
        help="Intervallo (s) di aggregazione dei contatori di traffico WiFi prima di scriverli su log",
    )

    p.add_argument(
        "--no-wifi-networks",
        action="store_true",
        help="Disabilita il log delle reti WiFi realmente rilevate dai beacon (richiede --wifi-iface)",
    )
    p.add_argument(
        "--wifi-networks-log",
        default="/var/log/home-sentinel/wifi_networks.jsonl",
        help="Percorso file JSON Lines delle reti WiFi rilevate (BSSID/SSID/canale/RSSI, da beacon 802.11)",
    )
    p.add_argument(
        "--wifi-networks-interval",
        type=float,
        default=30.0,
        help="Intervallo minimo (s) tra due righe di log per lo stesso BSSID",
    )

    p.add_argument(
        "--max-log-size-mb",
        type=float,
        default=20.0,
        help="Dimensione massima (MB) di ciascun file JSONL prima della rotazione stile logrotate "
        "(0 = disabilita la rotazione, i file crescono senza limite)",
    )
    p.add_argument(
        "--log-backup-count",
        type=int,
        default=3,
        help="Numero di file ruotati da conservare per ciascun log (es. wifi_probes.1.jsonl, .2.jsonl, ...)",
    )

    p.add_argument("--log-level", default="INFO")
    return p.parse_args()


def main() -> None:
    args = parse_args()
    logging.basicConfig(level=args.log_level, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")

    if os.geteuid() != 0:
        LOG.warning("Processo non in esecuzione come root: ARP scan e sniffing WiFi potrebbero fallire")

    stop_event = threading.Event()

    def handle_signal(signum, _frame):
        LOG.info("Ricevuto segnale %s, arresto in corso...", signum)
        stop_event.set()

    signal.signal(signal.SIGTERM, handle_signal)
    signal.signal(signal.SIGINT, handle_signal)

    max_log_bytes = int(args.max_log_size_mb * 1024 * 1024) if args.max_log_size_mb > 0 else None

    def make_logger(path: str) -> JsonlLogger:
        return JsonlLogger(Path(path), max_bytes=max_log_bytes, backup_count=args.log_backup_count)

    sqlite_store = None if args.no_db else SqliteStore(Path(args.db))

    alerts_log = make_logger(args.alerts_log)
    alert_manager = AlertManager(alerts_log, sqlite_store)

    anomaly_detector = None if args.no_anomaly_detection else AnomalyDetector(alert_manager, sqlite_store)

    fingerprint_log = None
    if args.fingerprint:
        fingerprint_log = make_logger(args.fingerprint_log)

    lan_log = make_logger(args.lan_log)
    ports = [int(port) for port in args.ports.split(",") if port.strip()]
    lan_service = LanDiscoveryService(
        subnet=args.subnet,
        iface=args.lan_iface,
        interval=args.interval,
        ports=ports,
        port_scan_interval=args.port_scan_interval,
        log=lan_log,
        stop_event=stop_event,
        sqlite_store=sqlite_store,
        anomaly_detector=anomaly_detector,
        alert_manager=alert_manager,
        arp_detection_enabled=not args.no_arp_detection,
        fingerprint_log=fingerprint_log,
    )
    threads = [threading.Thread(target=lan_service.run, name="lan-discovery", daemon=True)]

    home_ssids = {s.strip() for s in args.home_ssid.split(",") if s.strip()}

    probe_log = None
    wifi_traffic_log = None
    wifi_networks_log = None
    if args.wifi_iface:
        probe_log = make_logger(args.probe_log)
        channels = [int(ch) for ch in args.wifi_channels.split(",") if ch.strip()]
        evil_twin_detector = EvilTwinDetector(home_ssids, alert_manager) if home_ssids else None
        deauth_detector = None if args.no_deauth_detection else DeauthFloodDetector(
            alert_manager, window_seconds=args.deauth_window_seconds, threshold=args.deauth_threshold,
        )
        if not args.no_wifi_traffic:
            wifi_traffic_log = make_logger(args.wifi_traffic_log)
        if not args.no_wifi_networks:
            wifi_networks_log = make_logger(args.wifi_networks_log)
        wifi_service = WifiProbeMonitor(
            iface=args.wifi_iface,
            channels=channels,
            hop_interval=args.wifi_hop_interval,
            log=probe_log,
            stop_event=stop_event,
            auto_monitor=args.auto_monitor,
            sqlite_store=sqlite_store,
            evil_twin_detector=evil_twin_detector,
            deauth_detector=deauth_detector,
            traffic_log=wifi_traffic_log,
            traffic_flush_interval=args.wifi_traffic_interval,
            networks_log=wifi_networks_log,
            networks_log_interval=args.wifi_networks_interval,
        )
        threads.append(threading.Thread(target=wifi_service.run, name="wifi-probe-monitor", daemon=True))
    else:
        LOG.info("Nessuna --wifi-iface indicata: modulo probe monitor disabilitato")
        if home_ssids:
            LOG.warning("--home-ssid richiede --wifi-iface: rilevamento evil twin disabilitato")

    ble_log = None
    if args.ble:
        ble_log = make_logger(args.ble_log)
        ble_service = BleScanMonitor(
            log=ble_log, stop_event=stop_event, adapter=args.ble_adapter, sqlite_store=sqlite_store,
        )
        threads.append(threading.Thread(target=ble_service.run, name="ble-scan", daemon=True))
    else:
        LOG.info("Nessun --ble indicato: modulo scan BLE disabilitato")

    if args.detect_rogue_dhcp:
        trusted_servers = {s.strip() for s in args.dhcp_trusted_servers.split(",") if s.strip()}
        dhcp_detector = RogueDhcpDetector(
            iface=args.dhcp_iface or args.lan_iface,
            trusted_servers=trusted_servers,
            alert_manager=alert_manager,
            stop_event=stop_event,
        )
        threads.append(threading.Thread(target=dhcp_detector.run, name="rogue-dhcp-detector", daemon=True))

    for t in threads:
        t.start()

    try:
        while not stop_event.is_set():
            stop_event.wait(1)
    finally:
        stop_event.set()
        for t in threads:
            t.join(timeout=5)
        lan_log.close()
        if probe_log:
            probe_log.close()
        if wifi_traffic_log:
            wifi_traffic_log.close()
        if wifi_networks_log:
            wifi_networks_log.close()
        if ble_log:
            ble_log.close()
        if fingerprint_log:
            fingerprint_log.close()
        alerts_log.close()
        if sqlite_store:
            sqlite_store.close()
        LOG.info("Home Sentinel arrestato")


if __name__ == "__main__":
    main()
