"""Cattura passiva del 4-way handshake EAPOL (WPA/WPA2) per audit della propria rete WiFi.

Serve a verificare la robustezza della password della propria rete con strumenti standard
di audit offline (aircrack-ng, hashcat, ecc.): il file .pcap prodotto non contiene la password
in chiaro, solo il materiale crittografico dell'handshake necessario per un tentativo di
cracking con un dizionario — esattamente ciò che questi strumenti si aspettano in input.

Nessun frame viene mai inviato: è ascolto passivo di handshake che avvengono comunque durante
il normale funzionamento della rete (un client che si (ri)associa dopo essere stato fuori
portata, un roaming, una riconnessione dopo lo standby). Non c'è alcuna funzione di deauth
attiva per "forzare" un handshake: costringere client altrui a riconnettersi disturberebbe
sessioni in corso (videochiamate, streaming) di chiunque sia collegato in quel momento, un
prezzo che questo modulo non impone mai di sua iniziativa.

Scoping deliberato alle sole reti elencate in --home-ssid (lo stesso elenco già usato per il
rilevamento evil twin): a differenza di beacon/probe/deauth — già catturati passivamente per
qualunque rete nei dintorni, necessari per le altre funzionalità di discovery — un handshake
completo è materiale sufficiente per un tentativo di cracking offline della password di quella
rete, quindi non va raccolto indiscriminatamente per le reti dei vicini.
"""

from __future__ import annotations

import logging
import re
import time
from datetime import datetime, timezone
from pathlib import Path

LOG = logging.getLogger("home_sentinel")


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _sanitize_filename_part(value: str) -> str:
    return re.sub(r"[^A-Za-z0-9_-]", "_", value) or "unknown"


def classify_eapol_message(pkt) -> int | None:
    """Numero (1-4) del messaggio nel 4-way handshake WPA/WPA2, dai flag del frame EAPOL-Key
    (key_ack/has_key_mic/install/secure — la stessa logica usata da aircrack-ng/Wireshark).
    None se il frame non è un EAPOL-Key pairwise riconoscibile (es. group key handshake, o un
    frame perso/malformato) — non blocca la cattura, serve solo come indicazione informativa."""
    from scapy.layers.eap import EAPOL_KEY

    key = pkt.getlayer(EAPOL_KEY)
    if key is None or not key.key_type:  # key_type=0 è il group key handshake, non ci interessa
        return None

    ack, mic, install, secure = bool(key.key_ack), bool(key.has_key_mic), bool(key.install), bool(key.secure)
    if ack and not mic:
        return 1
    if not ack and mic and not install and not secure:
        return 2
    if ack and mic and install:
        return 3
    if not ack and mic and secure:
        return 4
    return None


def _extract_bssid_sta(pkt) -> tuple[str, str]:
    """BSSID e MAC della stazione da un frame 802.11, dai bit to-DS/from-DS dell'header
    (stessa convenzione standard usata da aircrack-ng per riconoscere i due lati dello scambio)."""
    to_ds = int(pkt.FCfield) & 0x1
    from_ds = int(pkt.FCfield) & 0x2
    if to_ds and not from_ds:
        return pkt.addr1 or "", pkt.addr2 or ""  # STA -> AP
    if from_ds and not to_ds:
        return pkt.addr2 or "", pkt.addr1 or ""  # AP -> STA
    return pkt.addr3 or "", pkt.addr2 or ""  # ad-hoc/WDS: raro in questo contesto, fallback


class HandshakeCapture:
    """Accumula i frame EAPOL per coppia (bssid, mac stazione) e salva un .pcap quando ne ha
    raccolti abbastanza da essere utili per un tentativo di audit offline."""

    def __init__(
        self,
        watched_ssids: set[str],
        pcap_dir: Path,
        log,
        sqlite_store=None,
        window_seconds: float = 2.0,
        min_frames: int = 2,
    ):
        self.watched_ssids = watched_ssids
        self.pcap_dir = pcap_dir
        self.log = log
        self.sqlite_store = sqlite_store
        self.window_seconds = window_seconds
        self.min_frames = min_frames
        self._known_bssids: dict[str, str] = {}  # bssid -> ssid, dai beacon delle reti "di casa"
        self._sessions: dict[tuple[str, str], dict] = {}

    def observe_beacon(self, ssid: str, bssid: str) -> None:
        if ssid in self.watched_ssids and bssid:
            self._known_bssids[bssid.lower()] = ssid

    def observe_eapol(self, pkt) -> None:
        bssid, sta = _extract_bssid_sta(pkt)
        if not bssid or not sta:
            return
        bssid, sta = bssid.lower(), sta.lower()
        ssid = self._known_bssids.get(bssid)
        if ssid is None:
            return  # non è una delle reti "di casa" monitorate: nessuna cattura

        now = time.time()
        key = (bssid, sta)
        session = self._sessions.get(key)
        if session is None:
            session = {"frames": [], "messages": set(), "first_ts": now, "last_ts": now}
            self._sessions[key] = session
        session["frames"].append(pkt)
        session["last_ts"] = now
        msg_no = classify_eapol_message(pkt)
        if msg_no:
            session["messages"].add(msg_no)

        # Handshake completo (tutti e 4 i messaggi visti, o 4 frame comunque raccolti anche
        # se qualcuno non è stato classificato): non serve aspettare oltre.
        if len(session["frames"]) >= 4:
            self._flush(ssid, bssid, sta, session)
            del self._sessions[key]

    def sweep(self) -> None:
        """Da chiamare periodicamente (ogni ciclo di sniff, ~1s): salva le sessioni rimaste
        ferme per --handshake-window-s con abbastanza frame da valere la pena — senza questo,
        una cattura di soli 2-3 messaggi (comunque utile per un tentativo di audit offline)
        resterebbe in memoria per sempre se il quarto messaggio non arriva mai."""
        now = time.time()
        for key, session in list(self._sessions.items()):
            if len(session["frames"]) < self.min_frames:
                continue
            if (now - session["last_ts"]) < self.window_seconds:
                continue
            bssid, sta = key
            ssid = self._known_bssids.get(bssid, "")
            self._flush(ssid, bssid, sta, session)
            del self._sessions[key]

    def _flush(self, ssid: str, bssid: str, sta: str, session: dict) -> None:
        from scapy.utils import wrpcap

        self.pcap_dir.mkdir(parents=True, exist_ok=True)
        ts_label = _now_iso().replace(":", "-").replace("+00-00", "Z")
        filename = f"{_sanitize_filename_part(ssid)}_{bssid.replace(':', '')}_{ts_label}.pcap"
        path = self.pcap_dir / filename
        try:
            wrpcap(str(path), session["frames"])
        except OSError:
            LOG.exception("Impossibile scrivere il pcap dell'handshake in %s", path)
            return

        row = {
            "timestamp": _now_iso(),
            "ssid": ssid,
            "bssid": bssid,
            "sta_mac": sta,
            "frame_count": len(session["frames"]),
            "messages": sorted(session["messages"]),
            "pcap_path": str(path),
        }
        self.log.write(row)
        if self.sqlite_store:
            self.sqlite_store.insert_handshake_capture(row)
        LOG.info(
            "Handshake EAPOL catturato ssid=%r bssid=%s sta=%s frame=%d messaggi=%s -> %s",
            ssid, bssid, sta, row["frame_count"], row["messages"], path,
        )
