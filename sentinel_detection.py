"""Detection: baseline comportamentale + anomalie, rogue DHCP, evil twin WiFi.

Tre rilevatori indipendenti, tutti opzionali e tutti passano dagli stessi
alert via `AlertManager` (JSON Lines + specchio SQLite + log a livello
WARNING). Il conflitto ARP/IP invece resta dentro `LanDiscoveryService` in
home_sentinel.py, perché ha bisogno dello stato "online/offline" già tenuto
lì per evitare falsi positivi sulle normali riassegnazioni DHCP.

  - AnomalyDetector: baseline per MAC (insieme di porte note), persistita
    su SQLite se disponibile. Segnala nuove porte aperte su un device già
    noto.
  - RogueDhcpDetector: sniffing passivo di DHCPOFFER/DHCPACK; se non è
    configurata una lista di server fidati impara il primo osservato,
    segnala ogni server successivo diverso. Sullo stesso sniff loop osserva
    anche i DHCPDISCOVER/DHCPREQUEST dei client (facoltativo, indipendente
    dal rilevamento rogue): MAC ed hostname dichiarato (opzione 12), utili
    alla LAN discovery per un hostname più affidabile del reverse DNS e per
    accorciare la latenza di rilevamento di un device nuovo.
  - EvilTwinDetector: osserva i beacon 802.11 catturati dal WiFi probe
    monitor (stesso adattatore in monitor mode) e segnala un SSID
    "di casa" trasmesso da un BSSID mai visto prima.
  - DeauthFloodDetector: osserva i frame di deauthentication/disassociation
    802.11 catturati dallo stesso monitor; un frame isolato è normale
    (disconnessione legittima), un burst nella stessa finestra temporale è
    il pattern tipico di un attacco deauth/disassoc flood.
"""

from __future__ import annotations

import logging
import threading
import time
from datetime import datetime, timedelta, timezone

LOG = logging.getLogger("home_sentinel")


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


# Scala di severità, dalla meno alla più grave. "critical" esiste solo come esito
# dell'escalation a casa vuota (--presence-aware-alerts): i rilevatori emettono al massimo "high".
SEVERITY_ORDER = ("low", "medium", "high", "critical")


def escalate_severity(severity: str) -> str:
    """Un gradino più su nella scala, saturando in cima (e lasciando invariata una severità
    sconosciuta, invece di inventarne una)."""
    if severity not in SEVERITY_ORDER:
        return severity
    return SEVERITY_ORDER[min(SEVERITY_ORDER.index(severity) + 1, len(SEVERITY_ORDER) - 1)]


class AlertManager:
    """Imbuto unico di ogni alert del daemon (JSON Lines + specchio SQLite + log WARNING).

    Essendo l'unico punto di passaggio, è anche il posto giusto per il contesto trasversale a
    tutti i rilevatori: ogni alert porta con sé `home_occupied` (qualcuno era in casa quando è
    successo?) e, con --presence-aware-alerts, viene alzato di un gradino di severità se la casa
    era vuota — lo stesso evento vale di più quando non c'è nessuno a spiegarlo.
    """

    def __init__(self, log, store=None):
        self.log = log
        self.store = store
        self.occupancy = None
        self.escalate_when_empty = False

    def set_occupancy(self, occupancy, escalate_when_empty: bool = False) -> None:
        """Collega la vista di occupazione (sentinel_presence.HomeOccupancy). Separato dal
        costruttore perché i PresenceTracker nascono dopo l'AlertManager in main()."""
        self.occupancy = occupancy
        self.escalate_when_empty = escalate_when_empty

    def emit(self, severity: str, type_: str, message: str, mac: str | None = None,
              ip: str | None = None, details: dict | None = None) -> None:
        details = dict(details or {})
        home_occupied = self.occupancy.occupied() if self.occupancy is not None else None
        if self.escalate_when_empty and home_occupied is False:
            escalated = escalate_severity(severity)
            if escalated != severity:
                details["escalated_from"] = severity
            details["escalated_reason"] = "home_empty"
            severity = escalated

        alert = {
            "timestamp": _now_iso(),
            "severity": severity,
            "type": type_,
            "mac": mac,
            "ip": ip,
            "message": message,
            "home_occupied": home_occupied,
            "details": details,
        }
        self.log.write(alert)
        if self.store:
            self.store.insert_alert(alert)
        LOG.warning("[ALERT %s] %s: %s", severity.upper(), type_, message)


class AnomalyDetector:
    """Baseline comportamentale per device (porte note)."""

    def __init__(self, alert_manager: AlertManager, store=None):
        self.alert_manager = alert_manager
        self.store = store
        self.baselines: dict[str, dict] = store.load_baselines() if store else {}

    def observe(self, mac: str, ip: str, hostname: str, vendor: str, open_ports: list[int]) -> None:
        baseline = self.baselines.get(mac)

        if baseline is None:
            baseline = {
                "first_seen": _now_iso(),
                "known_ports": [],
                "observations": 0,
            }
            self.baselines[mac] = baseline
        else:
            known_ports = set(baseline["known_ports"])
            new_ports = sorted(set(open_ports) - known_ports)
            if new_ports and known_ports:
                self.alert_manager.emit(
                    "high", "nuova_porta",
                    f"Nuova porta aperta su device noto {mac} ({hostname or ip}): {new_ports}",
                    mac=mac, ip=ip, details={"new_ports": new_ports, "known_ports": sorted(known_ports)},
                )

        baseline["known_ports"] = sorted(set(baseline["known_ports"]) | set(open_ports))
        baseline["observations"] += 1
        baseline["updated_at"] = _now_iso()
        if self.store:
            self.store.upsert_baseline(mac, baseline)


class RogueDhcpDetector:
    """Sniffing passivo DHCP: rileva server non attesi (rogue) e, se configurato,
    osserva i DHCPDISCOVER/DHCPREQUEST dei client per la LAN discovery.

    Un solo sniff loop condiviso per entrambe le funzioni (evita di aprire
    due socket raw sullo stesso adattatore per lo stesso traffico): il
    rilevamento rogue è invariato, la parte client-discovery è puramente
    additiva e non richiede `--detect-rogue-dhcp` per funzionare.
    """

    def __init__(self, iface: str | None, trusted_servers: set[str], alert_manager: AlertManager,
                 stop_event: threading.Event, discovery_log=None, sqlite_store=None, on_client_event=None):
        self.iface = iface
        self.trusted_servers = set(trusted_servers)
        self.alert_manager = alert_manager
        self.stop_event = stop_event
        self.discovery_log = discovery_log
        self.sqlite_store = sqlite_store
        self.on_client_event = on_client_event
        self._learned_first = bool(self.trusted_servers)

    def _handle_packet(self, pkt) -> None:
        try:
            from scapy.all import DHCP, Ether, IP
        except Exception:
            return
        if not pkt.haslayer(DHCP):
            return

        msg_type = None
        hostname = ""
        requested_ip = None
        for opt in pkt[DHCP].options:
            if not isinstance(opt, tuple):
                continue
            if opt[0] == "message-type":
                msg_type = opt[1]
            elif opt[0] == "hostname":
                try:
                    hostname = opt[1].decode(errors="ignore") if isinstance(opt[1], bytes) else str(opt[1])
                except Exception:
                    hostname = ""
            elif opt[0] == "requested_addr":
                requested_ip = opt[1]

        if msg_type in (1, 3):  # DHCPDISCOVER, DHCPREQUEST
            if self.discovery_log is not None or self.on_client_event is not None:
                self._handle_client_event(pkt, msg_type, hostname, requested_ip)
            return
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

    def _handle_client_event(self, pkt, msg_type: int, hostname: str, requested_ip: str | None) -> None:
        try:
            from scapy.all import Ether
        except Exception:
            return
        mac = pkt[Ether].src.lower() if pkt.haslayer(Ether) else None
        if not mac:
            return

        if self.discovery_log is not None:
            row = {
                "timestamp": _now_iso(),
                "event": "discover" if msg_type == 1 else "request",
                "mac": mac,
                "hostname": hostname,
                "requested_ip": requested_ip,
            }
            self.discovery_log.write(row)
            if self.sqlite_store:
                self.sqlite_store.insert_dhcp_event(row)

        if self.on_client_event is not None:
            self.on_client_event(mac, hostname)

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


class DeauthFloodDetector:
    """Rileva burst di frame deauth/disassoc 802.11 (attacco deauth/disassoc flood).

    Un frame isolato è normale (un device che si disconnette/rinnova
    l'associazione); il segnale d'attacco è il *tasso*: molti frame in una
    finestra breve. Un cooldown evita di spammare un alert per ogni singolo
    frame durante un flood prolungato.
    """

    def __init__(self, alert_manager: AlertManager, window_seconds: float = 10.0,
                 threshold: int = 10, cooldown_seconds: float = 60.0):
        self.alert_manager = alert_manager
        self.window_seconds = window_seconds
        self.threshold = threshold
        self.cooldown_seconds = cooldown_seconds
        self._events: list[float] = []
        self._last_alert_ts = 0.0

    def observe(self, kind: str, source_mac: str, dest_mac: str, reason_code: int | None) -> None:
        now = time.time()
        self._events.append(now)
        cutoff = now - self.window_seconds
        self._events = [t for t in self._events if t >= cutoff]

        if len(self._events) < self.threshold:
            return
        if (now - self._last_alert_ts) < self.cooldown_seconds:
            return
        self._last_alert_ts = now

        count = len(self._events)
        self.alert_manager.emit(
            "high", "possibile_deauth_flood",
            f"Rilevati {count} frame {kind} 802.11 in {self.window_seconds:.0f}s "
            f"(ultimo: {source_mac or '?'} -> {dest_mac or '?'}, reason={reason_code}): "
            "possibile attacco deauth/disassoc",
            mac=source_mac or None,
            details={"count": count, "window_s": self.window_seconds, "kind": kind, "reason_code": reason_code},
        )


class WifiRecurrenceDetector:
    """Device WiFi sconosciuti che ricompaiono nei dintorni in giorni distinti.

    È l'equivalente WiFi del rilevamento tracker BLE, ma il criterio deve essere diverso: un
    tracker BLE si riconosce perché *resta* vicino a lungo, mentre sul WiFi la randomizzazione
    dei MAC (iOS 14+/Android 10+) fa sì che un device che passa ogni giorno si presenti quasi
    sempre con un indirizzo nuovo. Cercare una presenza continuativa qui non troverebbe nulla;
    cercare un *ritorno* su più giorni distinti invece sì, perché i MAC che sopravvivono nel
    tempo sono proprio quelli non randomizzati — e un MAC stabile che ricompare giorno dopo
    giorno vicino a casa, senza mai connettersi alla rete, è il segnale che interessa.

    Falsi positivi attesi e accettati: il vicino di casa, o un device di casa non ancora
    dichiarato in --wifi-home-macs. Per questo l'alert è informativo e i MAC noti (di casa o già
    visti sulla LAN) sono esclusi tramite `known_macs_provider`.
    """

    def __init__(self, alert_manager: AlertManager, min_days: int = 3,
                 known_macs_provider=None, history_days: int = 14):
        self.alert_manager = alert_manager
        self.min_days = max(2, min_days)
        self.known_macs_provider = known_macs_provider
        self.history_days = history_days
        self._days_by_mac: dict[str, set[str]] = {}
        self._alerted: set[str] = set()

    def _is_known(self, mac: str) -> bool:
        if self.known_macs_provider is None:
            return False
        try:
            return mac in self.known_macs_provider()
        except Exception:  # un provider rotto non deve zittire il rilevatore
            LOG.debug("known_macs_provider fallito", exc_info=True)
            return False

    def observe(self, mac: str, rssi: int | None = None, now: float | None = None) -> None:
        mac = (mac or "").lower()
        if not mac or mac in self._alerted or self._is_known(mac):
            return

        moment = datetime.fromtimestamp(now, timezone.utc) if now is not None else datetime.now(timezone.utc)
        day = moment.date().isoformat()
        days = self._days_by_mac.setdefault(mac, set())
        if day in days:
            return
        days.add(day)

        # Finestra scorrevole: solo i giorni recenti contano, altrimenti un MAC visto una volta
        # ogni sei mesi finirebbe comunque per accumulare abbastanza giorni da far scattare l'alert.
        cutoff = (moment.date() - timedelta(days=self.history_days)).isoformat()
        days = {d for d in days if d >= cutoff}
        self._days_by_mac[mac] = days

        if len(days) < self.min_days:
            return
        self._alerted.add(mac)
        self.alert_manager.emit(
            "medium", "wifi_ricorrente",
            f"Device WiFi sconosciuto {mac} rilevato nei dintorni in {len(days)} giorni distinti "
            f"(ultimi {self.history_days} giorni) senza mai connettersi alla rete",
            mac=mac,
            details={"days": sorted(days), "distinct_days": len(days), "last_rssi": rssi},
        )
