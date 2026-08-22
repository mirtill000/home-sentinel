#!/usr/bin/env python3
"""Home Sentinel: discovery continua della LAN + monitor dei probe request WiFi.

Due moduli indipendenti, ciascuno in un proprio thread:
  - LanDiscoveryService: ARP scan periodico della subnet, con hostname,
    vendor (da MAC OUI) e port scan; scrive ogni evento su JSON Lines.
  - WifiProbeMonitor (opzionale): sniffing passivo dei probe request 802.11
    su un'interfaccia in monitor mode, con channel hopping; scrive ogni
    probe catturato su un secondo file JSON Lines.

Richiede privilegi di root (ARP scan e sniffing 802.11 usano socket raw).
Pensato per girare sotto systemd (vedi systemd/home-sentinel.service)
piuttosto che auto-demonizzarsi con un doppio fork.
"""

from __future__ import annotations

import argparse
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
    from scapy.layers.dot11 import Dot11Elt, Dot11ProbeReq
except ImportError as exc:  # pragma: no cover
    raise SystemExit(
        "scapy non è installato. Installa le dipendenze con: pip install -r requirements.txt"
    ) from exc

LOG = logging.getLogger("home_sentinel")

DEFAULT_PORTS = [21, 22, 23, 25, 53, 80, 139, 443, 445, 3389, 5000, 8080, 8443]


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
    with ThreadPoolExecutor(max_workers=min(32, len(ports)) or 1) as ex:
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
    """

    def __init__(self, path: Path):
        self.path = path
        self._lock = threading.Lock()
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._file = open(self.path, "a", encoding="utf-8")

    def write(self, row: dict) -> None:
        with self._lock:
            self._file.write(json.dumps(row, ensure_ascii=False))
            self._file.write("\n")
            self._file.flush()

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
    ):
        self.subnet = subnet
        self.iface = iface
        self.interval = interval
        self.ports = ports
        self.port_scan_interval = port_scan_interval
        self.log = log
        self.stop_event = stop_event
        self.devices: dict[str, DeviceState] = {}
        self._last_port_scan: dict[str, float] = {}

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
            state = self.devices.get(mac)
            is_new = state is None

            hostname = state.hostname if state else ""
            vendor = state.vendor if state else ""
            if is_new or not hostname:
                hostname = resolve_hostname(ip)
            if is_new or not vendor:
                vendor = get_vendor(mac)

            do_port_scan = is_new or (now - self._last_port_scan.get(mac, 0.0) >= self.port_scan_interval)
            open_ports: list[int] = []
            if do_port_scan:
                open_ports = scan_ports(ip, self.ports)
                self._last_port_scan[mac] = now

            self.devices[mac] = DeviceState(ip=ip, hostname=hostname, vendor=vendor, last_seen=now, online=True)
            self._write("new" if is_new else "online", ip, mac, hostname, vendor, open_ports)

        for mac, state in list(self.devices.items()):
            if mac not in seen_macs and state.online:
                state.online = False
                self._write("offline", state.ip, mac, state.hostname, state.vendor, [])

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
    ):
        self.iface = iface
        self.channels = channels
        self.hop_interval = hop_interval
        self.log = log
        self.stop_event = stop_event
        self.auto_monitor = auto_monitor
        self._current_channel = channels[0]

    def _setup_monitor_mode(self) -> None:
        for cmd in (
            ["ip", "link", "set", self.iface, "down"],
            ["iw", "dev", self.iface, "set", "type", "monitor"],
            ["ip", "link", "set", self.iface, "up"],
        ):
            subprocess.run(cmd, check=True)

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
        LOG.debug("WiFi probe mac=%s ssid=%r rssi=%s ch=%s", mac, ssid, rssi, self._current_channel)

    def run(self) -> None:
        if self.auto_monitor:
            try:
                self._setup_monitor_mode()
            except subprocess.CalledProcessError:
                LOG.error(
                    "Impostazione automatica della monitor mode fallita su %s: "
                    "verifica manualmente l'interfaccia (iw dev %s set type monitor)",
                    self.iface,
                    self.iface,
                )

        hop_thread = threading.Thread(target=self._hop_loop, daemon=True, name="wifi-channel-hop")
        hop_thread.start()

        LOG.info("WiFi probe monitor avviato su %s", self.iface)
        try:
            while not self.stop_event.is_set():
                sniff(iface=self.iface, prn=self._handle_packet, store=False, timeout=1)
        except Exception:
            LOG.exception("WiFi probe monitor terminato con errore")
        finally:
            hop_thread.join(timeout=2)


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
        help="Porte da controllare, separate da virgola",
    )
    p.add_argument(
        "--port-scan-interval",
        type=float,
        default=3600.0,
        help="Intervallo minimo tra due port-scan dello stesso device (s)",
    )
    p.add_argument("--lan-log", default="lan_discovery.jsonl", help="Percorso file JSON Lines output LAN discovery")

    p.add_argument(
        "--wifi-iface",
        default=None,
        help="Interfaccia WiFi in monitor mode per il probe sniffing (omettere per disabilitare)",
    )
    p.add_argument("--wifi-log", default="wifi_probes.jsonl", help="Percorso file JSON Lines output probe WiFi")
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

    lan_log = JsonlLogger(Path(args.lan_log))
    ports = [int(port) for port in args.ports.split(",") if port.strip()]
    lan_service = LanDiscoveryService(
        subnet=args.subnet,
        iface=args.lan_iface,
        interval=args.interval,
        ports=ports,
        port_scan_interval=args.port_scan_interval,
        log=lan_log,
        stop_event=stop_event,
    )
    threads = [threading.Thread(target=lan_service.run, name="lan-discovery", daemon=True)]

    wifi_log = None
    if args.wifi_iface:
        wifi_log = JsonlLogger(Path(args.wifi_log))
        channels = [int(ch) for ch in args.wifi_channels.split(",") if ch.strip()]
        wifi_service = WifiProbeMonitor(
            iface=args.wifi_iface,
            channels=channels,
            hop_interval=args.wifi_hop_interval,
            log=wifi_log,
            stop_event=stop_event,
            auto_monitor=args.auto_monitor,
        )
        threads.append(threading.Thread(target=wifi_service.run, name="wifi-probe-monitor", daemon=True))
    else:
        LOG.info("Nessuna --wifi-iface indicata: modulo probe monitor disabilitato")

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
        if wifi_log:
            wifi_log.close()
        LOG.info("Home Sentinel arrestato")


if __name__ == "__main__":
    main()
