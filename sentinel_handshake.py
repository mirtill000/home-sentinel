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


def _has_crackable_pair(messages: set[int]) -> bool:
    """Vero solo se i messaggi già raccolti bastano davvero a un tentativo di cracking offline:
    serve l'ANonce (portato da M1, e ripetuto da M3) insieme a SNonce+MIC (presenti solo in M2)
    — è la coppia minima che aircrack-ng/hashcat usano per verificare una password candidata.
    Un M3+M4 da soli, o più copie ritrasmesse dello stesso messaggio (frequenti su un client che
    fatica a rispondere), non bastano: senza questo controllo il modulo poteva salvare un .pcap
    che aircrack-ng avrebbe comunque rifiutato con "0 handshake"."""
    return 2 in messages and (1 in messages or 3 in messages)


class HandshakeCapture:
    """Accumula i frame EAPOL per coppia (bssid, mac stazione) e salva un .pcap quando ne ha
    raccolti abbastanza da essere utili per un tentativo di audit offline."""

    # Tetto ai frame accumulati per una singola coppia (bssid, stazione) prima di forzare una
    # decisione (salvare se comunque utile, altrimenti scartare): senza, un client che continua a
    # ritentare senza mai completare l'handshake (es. password sbagliata su un dispositivo ospite,
    # o frame persi ripetutamente) terrebbe la sessione in memoria all'infinito.
    _MAX_SESSION_FRAMES = 20

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
        self._beacons: dict[str, object] = {}  # bssid -> ultimo pacchetto beacon visto
        self._sessions: dict[tuple[str, str], dict] = {}

    def observe_beacon(self, ssid: str, bssid: str, pkt=None) -> None:
        if ssid in self.watched_ssids and bssid:
            bssid = bssid.lower()
            self._known_bssids[bssid] = ssid
            # Il beacon vero e proprio (non solo ssid/bssid come stringhe) serve a _flush per
            # scrivere l'ESSID nel .pcap: senza un frame che lo dichiari, aircrack-ng non riesce
            # ad associarlo al BSSID e ad ogni tentativo di audit richiede di ripeterlo a mano
            # con -e. Parametro opzionale per restare compatibile con chi chiama solo con le
            # stringhe (es. i test).
            if pkt is not None:
                self._beacons[bssid] = pkt

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

        # Handshake completo e inequivocabile (tutti e quattro i messaggi classificati, non solo
        # 4 frame qualunque): flushare su un semplice conteggio bastava a produrre un .pcap con
        # 4 ritrasmissioni dello stesso messaggio, che aircrack-ng legge ma scarta come "0
        # handshake" — vedi _has_crackable_pair.
        if {1, 2, 3, 4} <= session["messages"]:
            self._flush(ssid, bssid, sta, session)
            del self._sessions[key]
        elif len(session["frames"]) >= self._MAX_SESSION_FRAMES:
            # Troppi frame per essere solo le normali ritrasmissioni di un handshake ancora in
            # corso (es. un client che continua a riprovare senza completarlo mai): salva se
            # quello raccolto finora basta comunque a un tentativo di cracking, altrimenti scarta
            # invece di continuare ad accumulare senza limite.
            if _has_crackable_pair(session["messages"]):
                self._flush(ssid, bssid, sta, session)
            del self._sessions[key]

    def sweep(self) -> None:
        """Da chiamare periodicamente (ogni ciclo di sniff, ~1s): decide delle sessioni rimaste
        ferme per --handshake-window-s — salvate se contengono una coppia di messaggi
        effettivamente utilizzabile per un tentativo di cracking (vedi _has_crackable_pair),
        scartate altrimenti. Sempre rimosse dalla memoria dopo il timeout, riuscita o no: senza,
        un handshake mai completato (password sbagliata su un dispositivo ospite, frame persi)
        vi resterebbe per sempre."""
        now = time.time()
        for key, session in list(self._sessions.items()):
            if (now - session["last_ts"]) < self.window_seconds:
                continue
            bssid, sta = key
            if len(session["frames"]) >= self.min_frames and _has_crackable_pair(session["messages"]):
                ssid = self._known_bssids.get(bssid, "")
                self._flush(ssid, bssid, sta, session)
            del self._sessions[key]

    def _flush(self, ssid: str, bssid: str, sta: str, session: dict) -> None:
        from scapy.utils import wrpcap

        self.pcap_dir.mkdir(parents=True, exist_ok=True)
        ts_label = _now_iso().replace(":", "-").replace("+00-00", "Z")
        filename = f"{_sanitize_filename_part(ssid)}_{bssid.replace(':', '')}_{ts_label}.pcap"
        path = self.pcap_dir / filename
        # Il beacon per primo nel file: è l'unico frame che dichiara l'ESSID, senza il quale
        # aircrack-ng mostra la colonna ESSID vuota e richiede -e ad ogni tentativo di audit
        # invece di riconoscere subito la rete dal .pcap. Assente solo se non ne è mai stato
        # visto uno per questo BSSID (raro: bastano pochi secondi di sniff sul canale giusto).
        beacon = self._beacons.get(bssid)
        frames = ([beacon] if beacon is not None else []) + session["frames"]
        try:
            wrpcap(str(path), frames)
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
