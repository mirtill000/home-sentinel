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
import ipaddress
import json
import logging
import os
import signal
import socket
import subprocess
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path

try:
    from scapy.all import ARP, ICMP, IP, TCP, Ether, conf, send, sniff, sr, srp
    from scapy.layers.dot11 import Dot11, Dot11Beacon, Dot11Deauth, Dot11Disas, Dot11Elt, Dot11ProbeReq
    from scapy.layers.eap import EAPOL
except ImportError as exc:  # pragma: no cover
    raise SystemExit(
        "scapy non è installato. Installa le dipendenze con: pip install -r requirements.txt"
    ) from exc

from sentinel_ble import (
    BleEvilTwinDetector,
    BleIdentityLinker,
    BleTrackerWatchdog,
    classify_ble_device,
    detect_tracker_kind,
)
from sentinel_detection import (
    AlertManager,
    AnomalyDetector,
    DeauthFloodDetector,
    EvilTwinDetector,
    RogueDhcpDetector,
)
from sentinel_dhcp_leases import fetch_dhcp_leases
from sentinel_fingerprint import fingerprint_device, netbios_probe
from sentinel_handshake import HandshakeCapture
from sentinel_presence import PresenceTracker
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

# Range di default per il deep port scan opzionale (--deep-port-scan): tutte le porte TCP, non solo
# 1-1024 + le porte "alte" comuni di DEFAULT_PORTS — per non perdere un servizio su una porta non
# standard, al costo di uno scan molto più lungo per questo si esegue una volta ogni
# --deep-port-scan-interval (default una settimana), non ad ogni ciclo di port scan normale.
DEFAULT_DEEP_PORTS = "1-65535"


def parse_port_spec(spec: str) -> list[int]:
    """Elenco porte da una stringa comma-separated che ammette anche range "start-end"
    (es. "22,80,8000-8100"): a differenza del semplice comma-split usato per --ports,
    serve per esprimere in modo compatto un intervallo enorme come le 65535 porte TCP
    del deep port scan senza doverle elencare una per una."""
    ports: set[int] = set()
    for token in spec.split(","):
        token = token.strip()
        if not token:
            continue
        if "-" in token:
            start, end = token.split("-", 1)
            ports.update(range(int(start), int(end) + 1))
        else:
            ports.add(int(token))
    return sorted(ports)


# --------------------------------------------------------------------------
# Utility
# --------------------------------------------------------------------------

def get_vendor(mac: str) -> str:
    """Vendor da OUI del MAC, usando il DB manuf incluso in scapy."""
    try:
        return conf.manufdb._get_manuf(mac) or ""
    except Exception:
        return ""


_WPA1_VENDOR_IE_PREFIX = bytes([0x00, 0x50, 0xF2, 0x01])  # OUI Microsoft (00:50:F2), tipo 1 = WPA


def classify_wifi_security(pkt) -> str:
    """Classifica la sicurezza di una rete WiFi dal suo beacon, per il filtro "Open/WEP/WPA..."
    della dashboard: 'open' se il bit Privacy della Capability Info è a 0 (nessuna cifratura);
    altrimenti 'wpa2_wpa3' se è presente l'IE RSN (ID 48 — stesso formato per WPA2 e WPA3, che si
    distinguerebbero solo analizzando le AKM suite, non necessario qui); 'wpa' se è presente il
    vecchio IE vendor-specific WPA1 (ID 221, OUI Microsoft 00:50:F2 tipo 1) senza RSN; altrimenti
    'wep' (Privacy attivo ma nessun IE RSN/WPA — cifratura legacy). 'unknown' se il pacchetto non
    ha un layer Beacon valido (non dovrebbe succedere, chiamata solo da _handle_beacon)."""
    beacon = pkt.getlayer(Dot11Beacon)
    if beacon is None:
        return "unknown"
    try:
        if "privacy" not in beacon.cap:
            return "open"
    except Exception:
        return "unknown"

    has_rsn = False
    has_wpa1 = False
    elt = pkt.getlayer(Dot11Elt)
    while elt is not None:
        if elt.ID == 48:
            has_rsn = True
        elif elt.ID == 221 and bytes(elt.info)[:4] == _WPA1_VENDOR_IE_PREFIX:
            has_wpa1 = True
        elt = elt.payload.getlayer(Dot11Elt)
    if has_rsn:
        return "wpa2_wpa3"
    if has_wpa1:
        return "wpa"
    return "wep"


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


def arp_scan(subnet: str, iface: str | None, timeout: float = 2.0, retries: int = 2, inter: float = 0.002) -> list[tuple[str, str]]:
    """Scansione ARP della subnet, con retry sugli host che non hanno risposto.

    Un unico giro di richieste ARP broadcast fa rispondere quasi simultaneamente tutti gli host
    attivi sulla subnet: su una rete WiFi (mezzo condiviso, contention-based) questo produce
    facilmente collisioni tra le risposte — un host può quindi risultare "assente" per un intero
    ciclo pur essendo online e raggiungibile, disallineando il risultato da quello di tool come
    nmap (che di norma spaziano le richieste nel tempo). `retry` usa il meccanismo nativo di
    scapy per rimandare solo le richieste rimaste senza risposta, fino a `retries` volte in più:
    chi risponde al primo giro non viene ri-interrogato. `inter` introduce un piccolo ritardo tra
    l'invio di una richiesta e la successiva, per ridurre la probabilità che più host rispondano
    nello stesso istante fin dal primo giro.
    """
    packet = Ether(dst="ff:ff:ff:ff:ff:ff") / ARP(pdst=subnet)
    kwargs = {"timeout": timeout, "retry": retries, "inter": inter, "verbose": False}
    if iface:
        kwargs["iface"] = iface
    answered, _ = srp(packet, **kwargs)
    found: dict[str, str] = {}
    for _, received in answered:
        found[received.psrc] = received.hwsrc
    return list(found.items())


def icmp_sweep(ips: list[str], iface: str | None, timeout: float = 1.5) -> list[str]:
    """Ping sweep di fallback (--icmp-fallback): prova un ICMP echo request diretto alle sole IP
    che l'ARP scan non ha trovato, per gli host che rispondono a ping ma per qualche motivo hanno
    perso o ignorato la richiesta ARP broadcast anche dopo i retry di arp_scan (raro sulla stessa
    subnet — bridge/proxy-ARP non standard, o un'altra collisione sfortunata). Non sostituisce
    l'ARP scan come metodo primario: un host con firewall che blocca ICMP (Windows di default,
    molti IoT) non risponderebbe qui pur essendo raggiungibile — per questo resta un fallback
    opzionale, provato solo sulle IP ancora mancanti. Ritorna solo le IP vive: il MAC va risolto
    a parte con un ARP diretto (vedi _do_cycle), non ricavabile in modo affidabile da qui.
    """
    if not ips:
        return []
    packets = [IP(dst=ip) / ICMP() for ip in ips]
    kwargs = {"timeout": timeout, "verbose": False}
    if iface:
        kwargs["iface"] = iface
    answered, _ = sr(packets, **kwargs)
    return list({received[IP].src for _, received in answered})


def tcp_syn_sweep(ips: list[str], ports: list[int], iface: str | None, timeout: float = 1.5) -> list[str]:
    """Ultimo fallback (--tcp-fallback): un SYN TCP a poche porte comuni per le IP non trovate né
    da ARP né da ICMP — utile per host con firewall che blocca il ping ma non il traffico TCP
    (es. Windows blocca ICMP echo di default ma risponde comunque con SYN-ACK o RST a una porta
    aperta o chiusa: basta una risposta qualsiasi a confermare che l'host è vivo, la porta in sé
    non conta qui). Un SYN-ACK ricevuto viene chiuso subito con un RST, per non lasciare
    connessioni a metà sull'host remoto — qui non passiamo mai dallo stack TCP del sistema
    operativo (i pacchetti sono creati a mano con scapy), quindi tocca a noi chiuderle
    esplicitamente invece di lasciare che il kernel lo faccia da solo.
    """
    if not ips or not ports:
        return []
    packets = [IP(dst=ip) / TCP(dport=port, flags="S") for ip in ips for port in ports]
    kwargs = {"timeout": timeout, "verbose": False}
    if iface:
        kwargs["iface"] = iface
    answered, _ = sr(packets, **kwargs)
    alive: set[str] = set()
    for sent, received in answered:
        if not received.haslayer(TCP):
            continue
        alive.add(received[IP].src)
        if received[TCP].flags & 0x12 == 0x12:  # SYN-ACK: porta aperta, chiudi con un RST
            rst = IP(dst=received[IP].src) / TCP(
                sport=sent[TCP].sport, dport=sent[TCP].dport,
                seq=received[TCP].ack, flags="R",
            )
            send_kwargs = {"verbose": False}
            if iface:
                send_kwargs["iface"] = iface
            send(rst, **send_kwargs)
    return list(alive)


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
    open_ports: list[int] = field(default_factory=list)


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
        dhcp_lease_source: str = "",
        dhcp_lease_format: str = "auto",
        dhcp_lease_poll_interval: float = 300.0,
        dhcp_leases_log: JsonlLogger | None = None,
        arp_timeout: float = 2.0,
        arp_retries: int = 2,
        icmp_fallback: bool = False,
        tcp_fallback: bool = False,
        tcp_fallback_ports: list[int] | None = None,
        fallback_timeout: float = 1.5,
        deep_ports: list[int] | None = None,
        deep_port_scan_interval: float = 604800.0,
        deep_scan_log: JsonlLogger | None = None,
        os_fingerprint_monitor: "OsFingerprintMonitor | None" = None,
    ):
        self.subnet = subnet
        self.iface = iface
        self.interval = interval
        self.ports = ports
        self.port_scan_interval = port_scan_interval
        self.deep_ports = deep_ports
        self.deep_port_scan_interval = deep_port_scan_interval
        self.deep_scan_log = deep_scan_log
        self.os_fingerprint_monitor = os_fingerprint_monitor
        self.arp_timeout = arp_timeout
        self.arp_retries = arp_retries
        self.icmp_fallback = icmp_fallback
        self.tcp_fallback = tcp_fallback
        self.tcp_fallback_ports = tcp_fallback_ports or [80, 443, 22, 445, 3389]
        self.fallback_timeout = fallback_timeout
        self.log = log
        self.stop_event = stop_event
        self.sqlite_store = sqlite_store
        self.anomaly_detector = anomaly_detector
        self.alert_manager = alert_manager
        self.arp_detection_enabled = arp_detection_enabled
        self.fingerprint_log = fingerprint_log
        self.dhcp_lease_source = dhcp_lease_source
        self.dhcp_lease_format = dhcp_lease_format
        self.dhcp_lease_poll_interval = dhcp_lease_poll_interval
        self.dhcp_leases_log = dhcp_leases_log
        self.devices: dict[str, DeviceState] = {}
        self._last_port_scan: dict[str, float] = {}
        self._last_deep_port_scan: dict[str, float] = {}
        self._ip_owner: dict[str, str] = {}
        self._dhcp_hostnames: dict[str, str] = {}
        self._dhcp_lock = threading.Lock()
        self._rescan_now = threading.Event()
        self._last_lease_poll = 0.0
        if self.sqlite_store is not None:
            self._hydrate_from_store()

    def _hydrate_from_store(self) -> None:
        """Ripristina lo stato noto (hostname/vendor/porte aperte) dall'ultima riga vista per ogni
        MAC nello specchio SQLite, così un riavvio del daemon non fa apparire ogni device come "mai
        visto prima": senza, la colonna porte aperte in dashboard resterebbe vuota finché non arriva
        un nuovo port scan (--port-scan-interval, di norma fino a un'ora) anche per device già noti da
        tempo. Non scrive nulla sui log: popola solo lo stato in memoria, il primo ciclo di scan dopo
        il riavvio produce comunque i suoi eventi normalmente (compreso un nuovo port scan immediato
        per ogni device: _last_port_scan non viene ripristinato, perché una riga lan_events non
        distingue "in questo ciclo è girato un port scan" da "qui si riporta solo l'ultimo elenco
        noto", quindi non c'è un timestamp dell'ultima scansione reale da recuperare in modo
        affidabile).
        """
        now = time.time()
        for mac, info in self.sqlite_store.load_latest_lan_state().items():
            self.devices[mac] = DeviceState(
                ip=info["ip"], hostname=info["hostname"], vendor=info["vendor"],
                last_seen=now, online=(info["status"] != "offline"), open_ports=info["open_ports"],
            )
            self._ip_owner[info["ip"]] = mac
        if self.devices:
            LOG.info("LAN discovery: ripristinati %d device noti dallo specchio SQLite", len(self.devices))

    def note_dhcp_client(self, mac: str, hostname: str) -> None:
        """Callback per il DHCP discovery monitor (DHCPDISCOVER/DHCPREQUEST osservati passivamente).

        L'hostname dichiarato dal client via DHCP (opzione 12) è spesso più
        affidabile e immediato del reverse DNS (non dipende da una
        registrazione dinamica lato router) o del NetBIOS: ha priorità su
        entrambi quando risolviamo l'hostname di un device. Un MAC mai visto
        prima innesca anche una rescan immediata invece di aspettare il
        prossimo ciclo periodico, per accorciare la latenza di rilevamento di
        un device davvero nuovo (una DHCPREQUEST di rinnovo su un MAC già
        noto non la innesca, per non scatenare uno scan ad ogni rinnovo).
        """
        mac = mac.lower()
        if hostname:
            with self._dhcp_lock:
                self._dhcp_hostnames[mac] = hostname
        if mac not in self.devices:
            self._rescan_now.set()

    def run(self) -> None:
        LOG.info("LAN discovery avviato su %s (intervallo=%ss)", self.subnet, self.interval)
        while not self.stop_event.is_set():
            cycle_start = time.time()
            try:
                self._do_cycle()
            except Exception:
                LOG.exception("Ciclo di LAN discovery fallito")
            elapsed = time.time() - cycle_start
            self._wait_for_next_cycle(max(0.0, self.interval - elapsed))

    def _wait_for_next_cycle(self, remaining: float) -> None:
        """Come `stop_event.wait(remaining)`, ma si sveglia anche prima se `_rescan_now` viene impostato
        (device nuovo visto via DHCP, vedi `note_dhcp_client`) — poll a grana fine (0.5s) perché
        `threading.Event.wait` non supporta nativamente l'attesa su più eventi contemporaneamente."""
        deadline = time.time() + remaining
        while not self.stop_event.is_set() and not self._rescan_now.is_set():
            if time.time() >= deadline:
                return
            time.sleep(min(0.5, max(0.0, deadline - time.time())))
        self._rescan_now.clear()

    def _fallback_discovery(self, arp_found_ips: set[str]) -> list[tuple[str, str]]:
        """Cascata di fallback (--icmp-fallback, --tcp-fallback) per gli host che l'ARP scan
        (coi suoi retry) non ha trovato: prova prima un ping ICMP, poi — per chi resta muto
        anche a quello — un SYN TCP a poche porte comuni, entrambi solo sulle IP mancanti (mai
        sull'intera subnet, per non appesantire ogni ciclo). Queste due sonde dicono solo "quali
        IP sono vive", non il loro MAC: per chi risulta vivo si chiude con un ultimo ARP diretto
        e mirato (a differenza della richiesta broadcast del giro principale, qui è unicast verso
        poche IP specifiche già confermate raggiungibili, quindi con altissima probabilità di
        successo) per recuperare il MAC — la vera chiave con cui ogni device è tracciato nel
        resto del sistema (risk score, nome personalizzato, identità collegate...). Se anche
        questo fallisse (mai osservato: un host raggiungibile via IP su un segmento locale è per
        forza risolvibile via ARP, altrimenti scapy stesso non avrebbe potuto instradargli i
        pacchetti ICMP/TCP) quell'host viene semplicemente scartato, senza errori.
        """
        missing = [
            str(ip) for ip in ipaddress.ip_network(self.subnet, strict=False).hosts()
            if str(ip) not in arp_found_ips
        ]
        if not missing:
            return []

        alive: set[str] = set()
        if self.icmp_fallback:
            alive.update(icmp_sweep(missing, self.iface, timeout=self.fallback_timeout))
        if self.tcp_fallback:
            still_missing = [ip for ip in missing if ip not in alive]
            alive.update(tcp_syn_sweep(still_missing, self.tcp_fallback_ports, self.iface, timeout=self.fallback_timeout))
        if not alive:
            return []

        resolved = arp_scan(list(alive), self.iface, timeout=self.arp_timeout, retries=1)
        if len(resolved) < len(alive):
            LOG.debug("Fallback discovery: %d IP vive ma non risolte via ARP (%s)", len(alive) - len(resolved), sorted(alive - {ip for ip, _ in resolved}))
        return resolved

    def _do_cycle(self) -> None:
        found = arp_scan(self.subnet, self.iface, timeout=self.arp_timeout, retries=self.arp_retries)
        if self.icmp_fallback or self.tcp_fallback:
            found = found + self._fallback_discovery({ip for ip, _ in found})
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

            if is_new and self.os_fingerprint_monitor is not None:
                # Sonda subito il device appena scoperto invece di aspettare che generi da solo
                # traffico TCP osservabile passivamente: senza, un device con tutte le porte
                # filtrate (comune su molti smartphone/IoT) non produrrebbe mai un OS guess.
                self.os_fingerprint_monitor.active_probe(ip, mac)

            hostname = state.hostname if state else ""
            vendor = state.vendor if state else ""
            if is_new or not hostname:
                # Priorità: hostname dichiarato via DHCP (se osservato passivamente,
                # vedi note_dhcp_client) > reverse DNS > NetBIOS. Il DHCP è spesso il
                # più affidabile: dichiarato dal client stesso, non dipende da una
                # registrazione dinamica lato router come il reverse DNS.
                with self._dhcp_lock:
                    hostname = self._dhcp_hostnames.get(mac, "")
                if not hostname:
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
            # Fuori dai cicli di port scan (una volta ogni --port-scan-interval, non ogni ciclo ARP)
            # si riporta l'ultimo elenco noto invece di scrivere [] — altrimenti ogni riga "online" tra
            # una scansione e la successiva sovrascriverebbe silenziosamente il dato reale con uno vuoto,
            # e "l'ultima riga per MAC" (come la calcola la dashboard) mostrerebbe quasi sempre nessuna
            # porta anche su un device con porte aperte scansionate un attimo prima. Stessa logica già
            # usata sopra per hostname/vendor: si riporta il valore noto finché non se ne trova uno nuovo.
            open_ports: list[int] = state.open_ports if state else []
            if do_port_scan:
                open_ports = scan_ports(ip, self.ports)
                self._last_port_scan[mac] = now
                if self.fingerprint_log is not None:
                    mdns_name = self._fingerprint_and_log(ip, mac, open_ports, vendor)
                    if mdns_name and not hostname:
                        hostname = mdns_name

            if self.deep_ports is not None:
                open_ports = self._maybe_deep_scan(ip, mac, vendor, open_ports, now)

            self.devices[mac] = DeviceState(
                ip=ip, hostname=hostname, vendor=vendor, last_seen=now, online=True, open_ports=open_ports,
            )
            self._write("new" if is_new else "online", ip, mac, hostname, vendor, open_ports)

            if self.anomaly_detector is not None:
                self.anomaly_detector.observe(mac, ip, hostname, vendor, open_ports)

        for mac, state in list(self.devices.items()):
            if mac not in seen_macs and state.online:
                state.online = False
                self._write("offline", state.ip, mac, state.hostname, state.vendor, [])

        if self.dhcp_lease_source and (now - self._last_lease_poll >= self.dhcp_lease_poll_interval):
            self._last_lease_poll = now
            self._cross_check_leases(seen_macs)

    def _cross_check_leases(self, seen_macs: set[str]) -> None:
        """Confronta la tabella lease del router con i MAC che hanno risposto all'ARP scan in questo ciclo.

        Un device presente nelle lease ma silenzioso sull'ARP scan non è
        necessariamente un problema (può essere spento/addormentato, o
        firewallato contro ARP non richiesti): è solo un dato in più, loggato
        con `arp_confirmed=False`, non un alert — a differenza dei rilevatori
        di sicurezza veri e propri di sentinel_detection.py.
        """
        leases = fetch_dhcp_leases(self.dhcp_lease_source, self.dhcp_lease_format)
        if not leases:
            return
        ts = now_iso()
        for lease in leases:
            mac = lease["mac"]
            row = {
                "timestamp": ts,
                "mac": mac,
                "ip": lease.get("ip", ""),
                "hostname": lease.get("hostname", ""),
                "arp_confirmed": mac in seen_macs,
            }
            if self.dhcp_leases_log is not None:
                self.dhcp_leases_log.write(row)
            if self.sqlite_store:
                self.sqlite_store.insert_dhcp_lease(row)
        LOG.debug("Cross-check lease DHCP: %d lease, %d non confermate su ARP",
                   len(leases), sum(1 for lease in leases if lease["mac"] not in seen_macs))

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

    def _maybe_deep_scan(self, ip: str, mac: str, vendor: str, open_ports: list[int], now: float) -> list[int]:
        """Deep port scan opzionale (--deep-port-scan): scansiona --deep-ports (default tutte le
        65535 porte TCP) invece del solo elenco --ports usato dal port scan normale, ma una volta
        ogni --deep-port-scan-interval (default una settimana) per device, non ad ogni ciclo — è
        un'operazione molto più lenta, va tenuta rara.

        La prima volta che si vede un MAC in questo metodo (device nuovo, o riavvio del daemon: lo
        stato in memoria di _last_deep_port_scan non sopravvive a un riavvio) si registra solo il
        timestamp di baseline, senza scansionare subito: altrimenti ogni device nuovo o un semplice
        riavvio del servizio scatenerebbe una scansione pesante e sequenziale su tutti i device già
        noti, molto più invasiva del "nuovo port scan immediato" già accettato per --ports.

        Ritorna l'elenco porte aggiornato (unione con quelle già trovate dallo scan normale, se il
        deep scan gira in questo ciclo), da riportare così com'è altrimenti.
        """
        last_deep = self._last_deep_port_scan.get(mac)
        if last_deep is None:
            self._last_deep_port_scan[mac] = now
            return open_ports
        if now - last_deep < self.deep_port_scan_interval:
            return open_ports

        self._last_deep_port_scan[mac] = now
        deep_open_ports = scan_ports(ip, self.deep_ports)
        new_ports = sorted(set(deep_open_ports) - set(open_ports))
        merged_ports = sorted(set(open_ports) | set(deep_open_ports))

        if self.deep_scan_log is not None:
            row = {
                "timestamp": now_iso(), "mac": mac, "ip": ip,
                "open_ports": deep_open_ports, "new_ports": new_ports,
            }
            self.deep_scan_log.write(row)
            if self.sqlite_store:
                self.sqlite_store.insert_deep_port_scan(row)
        LOG.info(
            "Deep port scan ip=%s mac=%s porte_totali=%d nuove_rispetto_al_normale=%s",
            ip, mac, len(deep_open_ports), new_ports,
        )

        # Rifà il fingerprint (banner grabbing incluso) sull'elenco completo solo se il deep scan ha
        # trovato porte in più: altrimenti sarebbe un fingerprint ridondante identico all'ultimo già
        # fatto dal port scan normale.
        if new_ports and self.fingerprint_log is not None:
            self._fingerprint_and_log(ip, mac, merged_ports, vendor)

        return merged_ports

    def _fingerprint_and_log(self, ip: str, mac: str, open_ports: list[int], vendor: str) -> str:
        """Esegue il fingerprint e lo logga; ritorna il nome mDNS del device (stringa vuota se non trovato/fallito),
        così _do_cycle può usarlo per completare l'hostname quando reverse DNS/NetBIOS non hanno dato nulla."""
        try:
            result = fingerprint_device(ip, open_ports, vendor)
        except Exception:
            LOG.exception("Fingerprint fallito per %s", ip)
            return ""
        row = {"timestamp": now_iso(), "mac": mac, "ip": ip, **result}
        self.fingerprint_log.write(row)
        if self.sqlite_store:
            self.sqlite_store.insert_fingerprint(row)
        LOG.debug("Fingerprint ip=%s mac=%s type=%s services=%s", ip, mac, result["device_type"], result["services"])
        return result.get("mdns_name") or ""

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
        handshake_capture: HandshakeCapture | None = None,
        presence_tracker: PresenceTracker | None = None,
        presence_log: JsonlLogger | None = None,
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
        self.handshake_capture = handshake_capture
        self.presence_tracker = presence_tracker
        self.presence_log = presence_log
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

        if self.handshake_capture is not None and pkt.haslayer(EAPOL):
            self.handshake_capture.observe_eapol(pkt)

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

        if self.presence_tracker is not None and self.presence_log is not None:
            event = self.presence_tracker.observe(mac)
            if event is not None:
                self._write_presence_event(event)

    def _write_presence_event(self, event: dict) -> None:
        self.presence_log.write(event)
        if self.sqlite_store:
            self.sqlite_store.insert_wifi_presence(event)
        LOG.info("WiFi presence: %s %s", event["mac"], event["event"])

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
        if self.handshake_capture is not None:
            self.handshake_capture.observe_beacon(ssid, bssid or "")

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
            "security": classify_wifi_security(pkt),
        }
        self.networks_log.write(row)
        if self.sqlite_store:
            self.sqlite_store.insert_wifi_network(row)
        LOG.debug("WiFi network bssid=%s ssid=%r channel=%s rssi=%s security=%s", bssid, ssid, row["channel"], rssi, row["security"])

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
                if self.handshake_capture is not None:
                    self.handshake_capture.sweep()
                if self.presence_tracker is not None and self.presence_log is not None:
                    for event in self.presence_tracker.sweep():
                        self._write_presence_event(event)
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
        active_scan: bool = False,
        tracker_watchdog: BleTrackerWatchdog | None = None,
        identity_linker: BleIdentityLinker | None = None,
        identity_log: JsonlLogger | None = None,
        evil_twin_detector: BleEvilTwinDetector | None = None,
        presence_tracker: PresenceTracker | None = None,
        presence_log: JsonlLogger | None = None,
    ):
        self.log = log
        self.stop_event = stop_event
        self.adapter = adapter
        self.sqlite_store = sqlite_store
        self.active_scan = active_scan
        self.tracker_watchdog = tracker_watchdog
        self.identity_linker = identity_linker
        self.identity_log = identity_log
        self.evil_twin_detector = evil_twin_detector
        self.presence_tracker = presence_tracker
        self.presence_log = presence_log

    def _handle_detection(self, device, advertisement_data) -> None:
        mac = device.address.lower()
        name = advertisement_data.local_name or device.name or ""
        manufacturer_data = advertisement_data.manufacturer_data
        manufacturer_ids = sorted(manufacturer_data.keys())
        service_uuids = list(advertisement_data.service_uuids)

        row = {
            "timestamp": now_iso(),
            "mac": mac,
            "name": name,
            "rssi": advertisement_data.rssi,
            "tx_power": advertisement_data.tx_power,
            "manufacturer_ids": manufacturer_ids,
            "service_uuids": service_uuids,
            "device_type": classify_ble_device(name, manufacturer_data, service_uuids),
        }
        self.log.write(row)
        if self.sqlite_store:
            self.sqlite_store.insert_ble_event(row)
        LOG.debug("BLE device mac=%s name=%r rssi=%s type=%s", mac, name, row["rssi"], row["device_type"])

        if self.tracker_watchdog is not None:
            tracker_kind = detect_tracker_kind(name, manufacturer_data, service_uuids)
            self.tracker_watchdog.observe(mac, tracker_kind)

        if self.identity_linker is not None and self.identity_log is not None:
            link = self.identity_linker.observe(mac, name, manufacturer_ids, service_uuids)
            if link is not None:
                self.identity_log.write(link)
                if self.sqlite_store:
                    self.sqlite_store.insert_ble_identity_link(link)
                LOG.info(
                    "BLE: possibile stesso device su nuovo MAC (rotazione indirizzo) %s -> %s",
                    link["mac_old"], link["mac_new"],
                )

        if self.evil_twin_detector is not None:
            self.evil_twin_detector.observe(name, mac)

        if self.presence_tracker is not None and self.presence_log is not None:
            event = self.presence_tracker.observe(mac)
            if event is not None:
                self._write_presence_event(event)

    def _write_presence_event(self, event: dict) -> None:
        self.presence_log.write(event)
        if self.sqlite_store:
            self.sqlite_store.insert_ble_presence(event)
        LOG.info("BLE presence: %s %s", event["mac"], event["event"])

    async def _run_async(self) -> None:
        try:
            from bleak import BleakScanner
        except ImportError as exc:
            raise SystemExit(
                "bleak non è installato. Installa le dipendenze con: pip install -r requirements.txt"
            ) from exc

        kwargs = {"scanning_mode": "active" if self.active_scan else "passive"}
        if self.adapter:
            kwargs["bluez"] = {"adapter": self.adapter}

        LOG.info(
            "BLE scan monitor avviato%s (scan %s)",
            f" su {self.adapter}" if self.adapter else "", "attivo" if self.active_scan else "passivo",
        )
        scanner = BleakScanner(detection_callback=self._handle_detection, **kwargs)
        await scanner.start()
        try:
            while not self.stop_event.is_set():
                await asyncio.sleep(1)
                if self.presence_tracker is not None and self.presence_log is not None:
                    for event in self.presence_tracker.sweep():
                        self._write_presence_event(event)
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
# OS fingerprinting passivo
# --------------------------------------------------------------------------

# TTL iniziale tipico dei principali stack IP: sulla stessa subnet L2 (nessun
# router nel mezzo che lo decrementa) il TTL osservato coincide con quello di
# partenza del device, quindi è un indizio ragionevole — ma resta un'euristica
# grezza, non un'identificazione: più sistemi operativi condividono lo stesso
# valore (64 è il default sia di Linux sia di macOS/Android/iOS moderni).
TTL_OS_BUCKETS = [
    (64, "Linux / Android / macOS / iOS (typical initial TTL 64)"),
    (128, "Windows (typical initial TTL 128)"),
    (255, "Network appliance or legacy Unix (typical initial TTL 255)"),
]


def guess_os_from_ttl(ttl: int | None) -> str:
    if ttl is None:
        return ""
    for value, label in TTL_OS_BUCKETS:
        if ttl <= value:
            return label
    return f"TTL {ttl} (outside the known buckets)"


class OsFingerprintMonitor:
    """Sniffing passivo di pacchetti TCP con flag SYN (SYN o SYN-ACK) su `--lan-iface`, più una
    sonda attiva opzionale (default: attiva) per i device appena scoperti.

    Non è un p0f completo (nessun database di firme dello stack TCP/IP):
    osserva solo il TTL IP e la window size TCP di pacchetti che il device
    manda comunque — inclusi i SYN-ACK di risposta al port scan attivo già
    in corso — e ne ricava un'euristica grezza (vedi `guess_os_from_ttl`),
    onestamente etichettata come tale. La window size viene salvata per
    riferimento ma non entra nell'euristica: dipende troppo da window
    scaling/configurazioni custom per essere un indizio affidabile senza un
    vero database di firme, che qui non c'è.

    Il solo ascolto passivo lascia scoperti i device con tutte le porte
    filtrate (comune su molti smartphone/IoT moderni): senza traffico TCP di
    loro iniziativa da osservare, non producono mai un OS guess, anche se
    restano online per settimane. `active_probe` (chiamata da
    LanDiscoveryService alla prima scoperta di un MAC) chiude questo buco
    inviando un singolo SYN TCP e leggendo il TTL dalla risposta — che sia
    un SYN-ACK (porta aperta) o un RST (porta chiusa, ma la risposta arriva
    comunque dallo stack IP del device, TTL incluso): un singolo pacchetto,
    nessuna differenza pratica rispetto al traffico che un port scan normale
    genera già verso lo stesso device.
    """

    def __init__(
        self,
        iface: str | None,
        log: JsonlLogger,
        stop_event: threading.Event,
        sqlite_store: SqliteStore | None = None,
        interval: float = 300.0,
        active_probe_enabled: bool = True,
        active_probe_port: int = 80,
        active_probe_timeout: float = 1.0,
    ):
        self.iface = iface
        self.log = log
        self.stop_event = stop_event
        self.sqlite_store = sqlite_store
        self.interval = interval
        self.active_probe_enabled = active_probe_enabled
        self.active_probe_port = active_probe_port
        self.active_probe_timeout = active_probe_timeout
        self._last_logged: dict[str, float] = {}

    def _log_result(self, mac: str, ip: str, ttl: int | None, window: int | None) -> None:
        now = time.time()
        if now - self._last_logged.get(mac, 0.0) < self.interval:
            return
        self._last_logged[mac] = now

        row = {
            "timestamp": now_iso(),
            "mac": mac,
            "ip": ip,
            "ttl": ttl,
            "window": window,
            "os_guess": guess_os_from_ttl(ttl),
        }
        self.log.write(row)
        if self.sqlite_store:
            self.sqlite_store.insert_os_fingerprint(row)
        LOG.debug("OS fingerprint mac=%s ip=%s ttl=%s window=%s guess=%s",
                   mac, ip, ttl, window, row["os_guess"])

    def _handle_packet(self, pkt) -> None:
        try:
            from scapy.all import Ether, IP, TCP
        except Exception:
            return
        if not (pkt.haslayer(Ether) and pkt.haslayer(IP) and pkt.haslayer(TCP)):
            return
        mac = (pkt[Ether].src or "").lower()
        if not mac:
            return
        self._log_result(mac, pkt[IP].src, pkt[IP].ttl, pkt[TCP].window)

    def active_probe(self, ip: str, mac: str) -> None:
        """Un singolo SYN TCP verso `ip` per un OS guess immediato, invece di aspettare che il
        device generi da solo traffico TCP osservabile. Rispetta lo stesso `interval` del
        passivo (niente sonda se già fingerprintato di recente, magari proprio dal passivo).
        Fallisce silenziosamente se non arriva risposta (es. firewall che droppa i SYN non
        richiesti): non è un errore, solo un device che stavolta non produce un OS guess.
        """
        if not self.active_probe_enabled:
            return
        mac = mac.lower()
        if time.time() - self._last_logged.get(mac, 0.0) < self.interval:
            return
        try:
            from scapy.all import IP, TCP, send, sr1
            reply = sr1(
                IP(dst=ip) / TCP(dport=self.active_probe_port, flags="S"),
                timeout=self.active_probe_timeout, verbose=0, retry=0,
            )
        except Exception:
            LOG.debug("OS fingerprint attivo fallito per %s", ip, exc_info=True)
            return
        if reply is None or not reply.haslayer(IP) or not reply.haslayer(TCP):
            return

        if reply[TCP].flags & 0x12 == 0x12:  # SYN+ACK: porta aperta, chiudiamo puliti con un RST
            try:
                send(
                    IP(dst=ip) / TCP(dport=self.active_probe_port, flags="R", seq=reply[TCP].ack),
                    verbose=0,
                )
            except Exception:
                pass

        self._log_result(mac, ip, reply[IP].ttl, reply[TCP].window)

    def run(self) -> None:
        try:
            from scapy.all import sniff
        except ImportError:
            LOG.error("scapy non disponibile: OS fingerprint monitor non avviato")
            return

        LOG.info("OS fingerprint monitor avviato%s", f" su {self.iface}" if self.iface else "")
        try:
            while not self.stop_event.is_set():
                sniff(
                    iface=self.iface, filter="tcp[13] & 2 != 0",
                    prn=self._handle_packet, store=False, timeout=1,
                )
        except Exception:
            LOG.exception("OS fingerprint monitor terminato con errore")


# --------------------------------------------------------------------------
# Rollup giornaliero per il Trend della dashboard
# --------------------------------------------------------------------------

class TrendRollupService:
    """Ricalcola periodicamente conteggi giornalieri (nuovi device, alert) dallo specchio SQLite
    e ne appende su JSONL solo le righe cambiate rispetto all'ultimo giro.

    Perché serve: la dashboard scarica solo la coda dei JSONL grezzi oltre una certa dimensione
    (TAIL_FETCH_BYTES lato dashboard) e il daemon li ruota oltre --max-log-size-mb — su una rete
    affollata (specie wifi_probes.jsonl) il "Trend" a 30 giorni può quindi risultare incompleto ben
    prima che i dati siano davvero scomparsi: esistono ancora, solo non nella coda scaricata. Questo
    rollup attinge invece all'intero storico indicizzato in SQLite, e il file che produce resta
    piccolo (poche righe al giorno, non un evento per probe) anche su mesi di storico.

    Un giorno passato, una volta scritto, non cambia più (i conteggi sono definitivi): solo "oggi"
    viene riscritto ai giri successivi finché il conteggio continua a crescere. Il file resta
    append-only come tutti gli altri log del daemon: la dashboard prende l'ultima riga per data
    (l'ordine cronologico del file garantisce che sia quella più aggiornata).
    """

    def __init__(self, sqlite_store: SqliteStore, log: JsonlLogger, stop_event: threading.Event,
                 interval: float = 3600.0):
        self.sqlite_store = sqlite_store
        self.log = log
        self.stop_event = stop_event
        self.interval = interval
        self._last_written: dict[str, tuple[int, int]] = {}

    def _compute_and_write(self) -> None:
        for day, counts in self.sqlite_store.daily_counts().items():
            if self._last_written.get(day) == counts:
                continue
            self._last_written[day] = counts
            self.log.write({"date": day, "new_devices": counts[0], "alerts": counts[1]})

    def run(self) -> None:
        LOG.info("Trend rollup avviato (intervallo=%ss)", self.interval)
        while not self.stop_event.is_set():
            try:
                self._compute_and_write()
            except Exception:
                LOG.exception("Rollup trend giornaliero fallito")
            self.stop_event.wait(self.interval)


# --------------------------------------------------------------------------
# Entry point
# --------------------------------------------------------------------------

def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Home Sentinel - discovery LAN + monitor probe WiFi")
    p.add_argument("--subnet", required=True, help="Subnet CIDR da scansionare, es. 192.168.1.0/24")
    p.add_argument("--lan-iface", default=None, help="Interfaccia per lo scan ARP (default: routing automatico)")
    p.add_argument("--interval", type=float, default=60.0, help="Intervallo tra i cicli di scan LAN (s)")
    p.add_argument("--arp-timeout", type=float, default=2.0, help="Attesa risposte per ogni giro di scan ARP (s)")
    p.add_argument(
        "--arp-retries", type=int, default=2,
        help="Rimanda la richiesta ARP solo agli host che non hanno ancora risposto, fino a N volte in più "
             "(compensa risposte perse per collisione su reti WiFi affollate — vedi nmap che trova host mancati "
             "dallo scan; 0 per disabilitare)",
    )
    p.add_argument(
        "--icmp-fallback", action="store_true",
        help="Se un host resta senza risposta anche dopo tutti i retry ARP, prova un ping ICMP diretto prima di "
             "considerarlo assente (fallback opzionale, non sostituisce l'ARP: un host con firewall che blocca "
             "ICMP — es. Windows di default — non risponderebbe comunque)",
    )
    p.add_argument(
        "--tcp-fallback", action="store_true",
        help="Ultimo fallback per gli host ancora senza risposta dopo ARP e (se attivo) ICMP: prova un SYN TCP a "
             "--tcp-fallback-ports, utile per host con firewall che blocca il ping ma non il TCP",
    )
    p.add_argument(
        "--tcp-fallback-ports", default="80,443,22,445,3389",
        help="Porte usate da --tcp-fallback, separate da virgola (default: 80,443,22,445,3389)",
    )
    p.add_argument(
        "--fallback-timeout", type=float, default=1.5,
        help="Attesa risposte per i fallback ICMP/TCP (s)",
    )
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
        "--deep-port-scan",
        action="store_true",
        help="Abilita un secondo port scan periodico più ampio (default: tutte le 65535 porte TCP, "
        "vedi --deep-ports) ma molto meno frequente (--deep-port-scan-interval) del port scan "
        "normale, per non perdere servizi su porte non standard",
    )
    p.add_argument(
        "--deep-ports",
        default=DEFAULT_DEEP_PORTS,
        help="Porte per il deep port scan, stesso formato di --ports più i range 'start-end' "
        "(default: tutte, 1-65535)",
    )
    p.add_argument(
        "--deep-port-scan-interval",
        type=float,
        default=604800.0,
        help="Intervallo minimo tra due deep port-scan dello stesso device (s, default una settimana)",
    )
    p.add_argument(
        "--deep-scan-log",
        default="/var/log/home-sentinel/deep_port_scan.jsonl",
        help="Percorso file JSON Lines degli esiti del deep port scan",
    )
    p.add_argument(
        "--lan-log",
        default="/var/log/home-sentinel/lan_discovery.jsonl",
        help="Percorso file JSON Lines output LAN discovery",
    )
    p.add_argument(
        "--dhcp-lease-source",
        default="",
        help="Percorso locale o URL http(s) della tabella lease DHCP del router, per il cross-check con "
        "l'ARP scan (vuoto = disabilitato; vedi README per i formati supportati)",
    )
    p.add_argument(
        "--dhcp-lease-format",
        choices=["auto", "dnsmasq", "json"],
        default="auto",
        help="Formato di --dhcp-lease-source: 'dnsmasq' (dnsmasq.leases nativo), 'json' (array generico, "
        "vedi README), 'auto' (indovina dal contenuto)",
    )
    p.add_argument(
        "--dhcp-lease-poll-interval",
        type=float,
        default=300.0,
        help="Intervallo minimo (s) tra due letture di --dhcp-lease-source",
    )
    p.add_argument(
        "--dhcp-leases-log",
        default="/var/log/home-sentinel/dhcp_leases.jsonl",
        help="Percorso file JSON Lines del cross-check lease DHCP / ARP scan (richiede --dhcp-lease-source)",
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
        "--ble-active",
        action="store_true",
        help="Scan BLE attivo invece di passivo: richiede scan response ai device, rivelando spesso più "
        "informazioni (nome completo, altri UUID) ma rendendo il Pi stesso più visibile via radio",
    )
    p.add_argument(
        "--no-ble-tracker-detection",
        action="store_true",
        help="Disabilita l'alert su tracker BLE (AirTag/Find My/Tile/SmartTag) presenti da troppo tempo "
        "(attivo di default insieme a --ble)",
    )
    p.add_argument(
        "--ble-trusted-macs",
        default="",
        help="MAC BLE esclusi dall'alert tracker (es. il proprio AirTag), separati da virgola",
    )
    p.add_argument(
        "--ble-tracker-window-hours",
        type=float,
        default=3.0,
        help="Ore di presenza continuativa di un tracker BLE oltre le quali scatta l'alert",
    )
    p.add_argument(
        "--no-ble-identity-linking",
        action="store_true",
        help="Disabilita i suggerimenti di collegamento identità per rotazione di indirizzo BLE (RPA) "
        "(attivo di default insieme a --ble)",
    )
    p.add_argument(
        "--ble-identity-log",
        default="/var/log/home-sentinel/ble_identity_links.jsonl",
        help="Percorso file JSON Lines dei suggerimenti di collegamento identità BLE",
    )
    p.add_argument(
        "--ble-identity-rotation-window-s",
        type=float,
        default=1200.0,
        help="Finestra massima (secondi) tra la sparizione di un MAC e la comparsa di uno nuovo con "
        "la stessa firma pubblicitaria perché siano suggeriti come lo stesso device",
    )
    p.add_argument(
        "--ble-watch-names",
        default="",
        help="Nomi BLE 'di casa' da monitorare per possibile spoofing/clone (es. una serratura smart), "
        "separati da virgola",
    )
    p.add_argument(
        "--ble-home-macs",
        default="",
        help="MAC BLE 'di casa' (es. gli smartphone del nucleo familiare) per il tracking presenza/assenza, "
        "separati da virgola",
    )
    p.add_argument(
        "--ble-presence-log",
        default="/var/log/home-sentinel/ble_presence.jsonl",
        help="Percorso file JSON Lines degli eventi di presenza/assenza BLE",
    )
    p.add_argument(
        "--ble-presence-away-timeout-s",
        type=float,
        default=300.0,
        help="Secondi senza advertisement da un MAC 'di casa' prima di considerarlo assente",
    )

    p.add_argument(
        "--db",
        default="/var/log/home-sentinel/home-sentinel.db",
        help="Percorso database SQLite (specchio indicizzato dei log JSON Lines, per query storiche)",
    )
    p.add_argument("--no-db", action="store_true", help="Disabilita lo specchio SQLite")

    p.add_argument(
        "--no-trend-rollup",
        action="store_true",
        help="Disabilita il rollup giornaliero per il Trend della dashboard (richiede lo specchio "
        "SQLite, quindi non ha effetto se combinato con --no-db)",
    )
    p.add_argument(
        "--trend-rollup-log",
        default="/var/log/home-sentinel/trend_daily.jsonl",
        help="Percorso file JSON Lines del rollup giornaliero (nuovi device, alert)",
    )
    p.add_argument(
        "--trend-rollup-interval",
        type=float,
        default=3600.0,
        help="Intervallo (s) di ricalcolo del rollup giornaliero dallo specchio SQLite",
    )

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
        "--os-fingerprint",
        action="store_true",
        help="Abilita l'euristica del sistema operativo (da TTL/window size dei pacchetti TCP "
        "SYN/SYN-ACK): passiva sul traffico già visibile su --lan-iface, più una sonda attiva "
        "immediata sui device appena scoperti (vedi --no-os-fingerprint-active-probe)",
    )
    p.add_argument(
        "--os-fingerprint-log",
        default="/var/log/home-sentinel/os_fingerprint.jsonl",
        help="Percorso file JSON Lines output euristica OS",
    )
    p.add_argument(
        "--os-fingerprint-interval",
        type=float,
        default=300.0,
        help="Intervallo minimo (s) tra due righe di log per lo stesso MAC (vale sia per il "
        "passivo sia per la sonda attiva)",
    )
    p.add_argument(
        "--no-os-fingerprint-active-probe",
        action="store_true",
        help="Disabilita la sonda attiva sui device appena scoperti (un singolo SYN TCP): resta "
        "solo l'ascolto passivo, che per device con tutte le porte filtrate potrebbe non produrre "
        "mai un OS guess",
    )
    p.add_argument(
        "--os-fingerprint-active-probe-port",
        type=int,
        default=80,
        help="Porta usata dalla sonda attiva (funziona sia se aperta, risposta SYN-ACK, sia se "
        "chiusa, risposta RST: il TTL nella risposta è valido in entrambi i casi)",
    )
    p.add_argument(
        "--os-fingerprint-active-probe-timeout",
        type=float,
        default=1.0,
        help="Attesa (s) della risposta alla sonda attiva prima di rinunciare per quel device",
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
        "--dhcp-discovery",
        action="store_true",
        help="Osserva passivamente i DHCPDISCOVER/DHCPREQUEST dei client (stesso sniff loop di "
        "--detect-rogue-dhcp, indipendente da esso) per un hostname più affidabile del reverse DNS "
        "e una rescan LAN immediata quando compare un MAC mai visto",
    )
    p.add_argument(
        "--dhcp-events-log",
        default="/var/log/home-sentinel/dhcp_events.jsonl",
        help="Percorso file JSON Lines degli eventi DHCP client osservati (richiede --dhcp-discovery)",
    )

    p.add_argument(
        "--home-ssid",
        default="",
        help="SSID di casa da monitorare per possibili evil twin, separati da virgola "
        "(richiede --wifi-iface; ogni BSSID nuovo per un SSID monitorato genera un alert)",
    )
    p.add_argument(
        "--capture-handshakes",
        action="store_true",
        help="Cattura passivamente il 4-way handshake EAPOL (WPA/WPA2) delle reti elencate in "
        "--home-ssid, per un audit offline della robustezza della propria password con "
        "aircrack-ng/hashcat (richiede --wifi-iface e --home-ssid; nessun frame viene mai "
        "inviato, solo ascolto passivo di handshake che avvengono comunque)",
    )
    p.add_argument(
        "--handshake-pcap-dir",
        default="/var/log/home-sentinel/handshakes",
        help="Cartella dove salvare i file .pcap degli handshake catturati",
    )
    p.add_argument(
        "--handshake-log",
        default="/var/log/home-sentinel/handshake_captures.jsonl",
        help="Percorso file JSON Lines degli eventi di cattura handshake (metadati, non il pcap)",
    )
    p.add_argument(
        "--handshake-window-s",
        type=float,
        default=2.0,
        help="Secondi di inattività su una coppia AP/stazione prima di salvare l'handshake "
        "parziale raccolto finora (se ha già raggiunto --handshake-min-frames)",
    )
    p.add_argument(
        "--handshake-min-frames",
        type=int,
        default=2,
        help="Numero minimo di frame EAPOL per considerare la cattura utile a un tentativo di "
        "audit offline (di norma servono almeno i messaggi 1 e 2 del 4-way handshake)",
    )
    p.add_argument(
        "--wifi-home-macs",
        default="",
        help="MAC WiFi 'di casa' (es. gli smartphone del nucleo familiare) per il tracking "
        "presenza/assenza via probe request, separati da virgola — stesso principio di "
        "--ble-home-macs ma sul lato WiFi",
    )
    p.add_argument(
        "--wifi-presence-log",
        default="/var/log/home-sentinel/wifi_presence.jsonl",
        help="Percorso file JSON Lines degli eventi di presenza/assenza WiFi",
    )
    p.add_argument(
        "--wifi-presence-away-timeout-s",
        type=float,
        default=300.0,
        help="Secondi senza probe request da un MAC 'di casa' prima di considerarlo assente "
        "(stesso default del BLE — i probe WiFi possono comunque essere meno frequenti e "
        "prevedibili dei suoi advertisement, specie con MAC randomization e probing ridotto "
        "per privacy: alzalo se noti falsi 'left')",
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
    tcp_fallback_ports = [int(port) for port in args.tcp_fallback_ports.split(",") if port.strip()]
    dhcp_leases_log = make_logger(args.dhcp_leases_log) if args.dhcp_lease_source else None
    deep_ports = parse_port_spec(args.deep_ports) if args.deep_port_scan else None
    deep_scan_log = make_logger(args.deep_scan_log) if args.deep_port_scan else None

    # Costruito qui (prima di LanDiscoveryService, non nella sua posizione "naturale" più in basso
    # insieme agli altri moduli opzionali) perché quest'ultimo ne ha bisogno subito: gli passa una
    # sonda attiva sul MAC appena scoperto invece di aspettare che il device generi traffico TCP di
    # sua iniziativa (vedi active_probe più sotto).
    os_fingerprint_service = None
    os_fingerprint_log = None
    if args.os_fingerprint:
        os_fingerprint_log = make_logger(args.os_fingerprint_log)
        os_fingerprint_service = OsFingerprintMonitor(
            iface=args.lan_iface,
            log=os_fingerprint_log,
            stop_event=stop_event,
            sqlite_store=sqlite_store,
            interval=args.os_fingerprint_interval,
            active_probe_enabled=not args.no_os_fingerprint_active_probe,
            active_probe_port=args.os_fingerprint_active_probe_port,
            active_probe_timeout=args.os_fingerprint_active_probe_timeout,
        )

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
        dhcp_lease_source=args.dhcp_lease_source,
        dhcp_lease_format=args.dhcp_lease_format,
        dhcp_lease_poll_interval=args.dhcp_lease_poll_interval,
        dhcp_leases_log=dhcp_leases_log,
        arp_timeout=args.arp_timeout,
        arp_retries=args.arp_retries,
        icmp_fallback=args.icmp_fallback,
        tcp_fallback=args.tcp_fallback,
        tcp_fallback_ports=tcp_fallback_ports,
        fallback_timeout=args.fallback_timeout,
        deep_ports=deep_ports,
        deep_port_scan_interval=args.deep_port_scan_interval,
        deep_scan_log=deep_scan_log,
        os_fingerprint_monitor=os_fingerprint_service,
    )
    threads: list[threading.Thread] = [threading.Thread(target=lan_service.run, name="lan-discovery", daemon=True)]
    if os_fingerprint_service is not None:
        threads.append(threading.Thread(target=os_fingerprint_service.run, name="os-fingerprint", daemon=True))

    trend_rollup_log = None
    if sqlite_store is not None and not args.no_trend_rollup:
        trend_rollup_log = make_logger(args.trend_rollup_log)
        trend_rollup_service = TrendRollupService(
            sqlite_store=sqlite_store, log=trend_rollup_log, stop_event=stop_event,
            interval=args.trend_rollup_interval,
        )
        threads.append(threading.Thread(target=trend_rollup_service.run, name="trend-rollup", daemon=True))
    elif args.no_db and not args.no_trend_rollup:
        LOG.info("--no-db attivo: rollup trend giornaliero disabilitato (richiede lo specchio SQLite)")

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
        handshake_capture = None
        if args.capture_handshakes:
            if home_ssids:
                handshake_capture = HandshakeCapture(
                    watched_ssids=home_ssids,
                    pcap_dir=Path(args.handshake_pcap_dir),
                    log=make_logger(args.handshake_log),
                    sqlite_store=sqlite_store,
                    window_seconds=args.handshake_window_s,
                    min_frames=args.handshake_min_frames,
                )
            else:
                LOG.warning("--capture-handshakes richiede --home-ssid: cattura handshake disabilitata")

        wifi_home_macs = {m.strip().lower() for m in args.wifi_home_macs.split(",") if m.strip()}
        wifi_presence_tracker = None
        wifi_presence_log = None
        if wifi_home_macs:
            wifi_presence_tracker = PresenceTracker(
                home_macs=wifi_home_macs, away_timeout_seconds=args.wifi_presence_away_timeout_s,
            )
            wifi_presence_log = make_logger(args.wifi_presence_log)

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
            handshake_capture=handshake_capture,
            presence_tracker=wifi_presence_tracker, presence_log=wifi_presence_log,
        )
        threads.append(threading.Thread(target=wifi_service.run, name="wifi-probe-monitor", daemon=True))
    else:
        LOG.info("Nessuna --wifi-iface indicata: modulo probe monitor disabilitato")
        if home_ssids:
            LOG.warning("--home-ssid richiede --wifi-iface: rilevamento evil twin disabilitato")
        if args.capture_handshakes:
            LOG.warning("--capture-handshakes richiede --wifi-iface: cattura handshake disabilitata")

    ble_log = None
    if args.ble:
        ble_log = make_logger(args.ble_log)

        ble_tracker_watchdog = None
        if not args.no_ble_tracker_detection:
            ble_trusted_macs = {m.strip().lower() for m in args.ble_trusted_macs.split(",") if m.strip()}
            ble_tracker_watchdog = BleTrackerWatchdog(
                alert_manager=alert_manager, trusted_macs=ble_trusted_macs,
                window_seconds=args.ble_tracker_window_hours * 3600.0,
            )

        ble_identity_linker = None
        ble_identity_log = None
        if not args.no_ble_identity_linking:
            ble_identity_linker = BleIdentityLinker(rotation_window_seconds=args.ble_identity_rotation_window_s)
            ble_identity_log = make_logger(args.ble_identity_log)

        ble_watch_names = {s.strip() for s in args.ble_watch_names.split(",") if s.strip()}
        ble_evil_twin_detector = BleEvilTwinDetector(ble_watch_names, alert_manager) if ble_watch_names else None

        ble_home_macs = {m.strip().lower() for m in args.ble_home_macs.split(",") if m.strip()}
        ble_presence_tracker = None
        ble_presence_log = None
        if ble_home_macs:
            ble_presence_tracker = PresenceTracker(
                home_macs=ble_home_macs, away_timeout_seconds=args.ble_presence_away_timeout_s,
            )
            ble_presence_log = make_logger(args.ble_presence_log)

        ble_service = BleScanMonitor(
            log=ble_log, stop_event=stop_event, adapter=args.ble_adapter, sqlite_store=sqlite_store,
            active_scan=args.ble_active,
            tracker_watchdog=ble_tracker_watchdog,
            identity_linker=ble_identity_linker, identity_log=ble_identity_log,
            evil_twin_detector=ble_evil_twin_detector,
            presence_tracker=ble_presence_tracker, presence_log=ble_presence_log,
        )
        threads.append(threading.Thread(target=ble_service.run, name="ble-scan", daemon=True))
    else:
        LOG.info("Nessun --ble indicato: modulo scan BLE disabilitato")

    dhcp_events_log = None
    if args.detect_rogue_dhcp or args.dhcp_discovery:
        trusted_servers = {s.strip() for s in args.dhcp_trusted_servers.split(",") if s.strip()}
        if args.dhcp_discovery:
            dhcp_events_log = make_logger(args.dhcp_events_log)
        dhcp_detector = RogueDhcpDetector(
            iface=args.dhcp_iface or args.lan_iface,
            trusted_servers=trusted_servers,
            alert_manager=alert_manager,
            stop_event=stop_event,
            discovery_log=dhcp_events_log,
            sqlite_store=sqlite_store,
            on_client_event=lan_service.note_dhcp_client if args.dhcp_discovery else None,
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
        if dhcp_events_log:
            dhcp_events_log.close()
        if os_fingerprint_log:
            os_fingerprint_log.close()
        if dhcp_leases_log:
            dhcp_leases_log.close()
        if trend_rollup_log:
            trend_rollup_log.close()
        alerts_log.close()
        if sqlite_store:
            sqlite_store.close()
        LOG.info("Home Sentinel arrestato")


if __name__ == "__main__":
    main()
