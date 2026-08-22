"""Detection: baseline comportamentale + anomalie, rogue DHCP, evil twin WiFi.

Tre rilevatori indipendenti, tutti opzionali e tutti passano dagli stessi
alert via `AlertManager` (JSON Lines + specchio SQLite + log a livello
WARNING). Il conflitto ARP/IP invece resta dentro `LanDiscoveryService` in
home_sentinel.py, perché ha bisogno dello stato "online/offline" già tenuto
lì per evitare falsi positivi sulle normali riassegnazioni DHCP.

  - AnomalyDetector: baseline per MAC (istogramma di presenza per ora del
    giorno + insieme di porte note), persistita su SQLite se disponibile.
    Segnala presenza in un orario mai osservato prima e nuove porte aperte
    su un device già noto.
  - RogueDhcpDetector: sniffing passivo di DHCPOFFER/DHCPACK; se non è
    configurata una lista di server fidati impara il primo osservato,
    segnala ogni server successivo diverso.
  - EvilTwinDetector: osserva i beacon 802.11 catturati dal WiFi probe
    monitor (stesso adattatore in monitor mode) e segnala un SSID
    "di casa" trasmesso da un BSSID mai visto prima.
"""

from __future__ import annotations

import logging
import threading
from datetime import datetime, timezone

LOG = logging.getLogger("home_sentinel")


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class AlertManager:
    def __init__(self, log, store=None):
        self.log = log
        self.store = store

    def emit(self, severity: str, type_: str, message: str, mac: str | None = None,
              ip: str | None = None, details: dict | None = None) -> None:
        alert = {
            "timestamp": _now_iso(),
            "severity": severity,
            "type": type_,
            "mac": mac,
            "ip": ip,
            "message": message,
            "details": details or {},
        }
        self.log.write(alert)
        if self.store:
            self.store.insert_alert(alert)
        LOG.warning("[ALERT %s] %s: %s", severity.upper(), type_, message)


class AnomalyDetector:
    """Baseline comportamentale per device (orario tipico + porte note)."""

    MIN_OBSERVATIONS_FOR_HOUR_CHECK = 50

    def __init__(self, alert_manager: AlertManager, store=None):
        self.alert_manager = alert_manager
        self.store = store
        self.baselines: dict[str, dict] = store.load_baselines() if store else {}

    def observe(self, mac: str, ip: str, hostname: str, vendor: str, open_ports: list[int]) -> None:
        now = datetime.now(timezone.utc)
        hour = now.hour
        baseline = self.baselines.get(mac)

        if baseline is None:
            baseline = {
                "first_seen": _now_iso(),
                "hour_histogram": [0] * 24,
                "known_ports": [],
                "observations": 0,
            }
            self.baselines[mac] = baseline
        else:
            if (baseline["observations"] >= self.MIN_OBSERVATIONS_FOR_HOUR_CHECK
                    and baseline["hour_histogram"][hour] == 0):
                self.alert_manager.emit(
                    "medium", "orario_insolito",
                    f"Device {mac} ({hostname or ip}) attivo in un orario mai osservato prima ({hour}:00)",
                    mac=mac, ip=ip, details={"hour": hour},
                )
            known_ports = set(baseline["known_ports"])
            new_ports = sorted(set(open_ports) - known_ports)
            if new_ports and known_ports:
                self.alert_manager.emit(
                    "high", "nuova_porta",
                    f"Nuova porta aperta su device noto {mac} ({hostname or ip}): {new_ports}",
                    mac=mac, ip=ip, details={"new_ports": new_ports, "known_ports": sorted(known_ports)},
                )

        baseline["hour_histogram"][hour] += 1
        baseline["known_ports"] = sorted(set(baseline["known_ports"]) | set(open_ports))
        baseline["observations"] += 1
        baseline["updated_at"] = _now_iso()
        if self.store:
            self.store.upsert_baseline(mac, baseline)


class RogueDhcpDetector:
    """Sniffing passivo di DHCPOFFER/DHCPACK per rilevare server DHCP non attesi."""

    def __init__(self, iface: str | None, trusted_servers: set[str], alert_manager: AlertManager,
                 stop_event: threading.Event):
        self.iface = iface
        self.trusted_servers = set(trusted_servers)
        self.alert_manager = alert_manager
        self.stop_event = stop_event
        self._learned_first = bool(self.trusted_servers)

    def _handle_packet(self, pkt) -> None:
        try:
            from scapy.all import DHCP, Ether, IP
        except Exception:
            return
        if not pkt.haslayer(DHCP):
            return

        msg_type = None
        for opt in pkt[DHCP].options:
            if isinstance(opt, tuple) and opt[0] == "message-type":
                msg_type = opt[1]
                break
        if msg_type not in (2, 5):  # DHCPOFFER, DHCPACK
            return

        server_ip = pkt[IP].src if pkt.haslayer(IP) else None
        if not server_ip or server_ip in self.trusted_servers:
            return

        if not self._learned_first:
            self.trusted_servers.add(server_ip)
            self._learned_first = True
            LOG.info("Rogue DHCP detector: appreso %s come server DHCP fidato (primo osservato)", server_ip)
            return

        mac = pkt[Ether].src.lower() if pkt.haslayer(Ether) else None
        self.alert_manager.emit(
            "high", "possibile_rogue_dhcp",
            f"Risposta DHCP da un server non atteso: {server_ip} (mac {mac})",
            ip=server_ip, mac=mac, details={"trusted_servers": sorted(self.trusted_servers)},
        )

    def run(self) -> None:
        try:
            from scapy.all import sniff
        except ImportError:
            LOG.error("scapy non disponibile: rogue DHCP detector non avviato")
            return

        LOG.info("Rogue DHCP detector avviato%s", f" su {self.iface}" if self.iface else "")
        try:
            while not self.stop_event.is_set():
                sniff(
                    iface=self.iface, filter="udp and (port 67 or port 68)",
                    prn=self._handle_packet, store=False, timeout=1,
                )
        except Exception:
            LOG.exception("Rogue DHCP detector terminato con errore")


class EvilTwinDetector:
    """Segnala un SSID "di casa" trasmesso da un BSSID nuovo/inatteso."""

    def __init__(self, watched_ssids: set[str], alert_manager: AlertManager):
        self.watched_ssids = watched_ssids
        self.alert_manager = alert_manager
        self.known_bssids: dict[str, set[str]] = {}

    def observe_beacon(self, ssid: str, bssid: str) -> None:
        if not ssid or ssid not in self.watched_ssids or not bssid:
            return
        bssid = bssid.lower()
        bssids = self.known_bssids.setdefault(ssid, set())
        if bssids and bssid not in bssids:
            self.alert_manager.emit(
                "high", "possibile_evil_twin",
                f"SSID '{ssid}' trasmesso da un BSSID nuovo/inatteso {bssid} (finora noti: {sorted(bssids)})",
                details={"ssid": ssid, "bssid_nuovo": bssid, "bssid_noti": sorted(bssids)},
            )
        bssids.add(bssid)
