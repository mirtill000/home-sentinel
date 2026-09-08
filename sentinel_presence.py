"""Tracking presenza/assenza generico per un insieme di MAC "di casa".

Tecnologia-agnostico: usato sia per i MAC BLE (--ble-home-macs, es. gli smartphone del nucleo
familiare via advertisement passivo) sia per i MAC WiFi (--wifi-home-macs, via probe request
catturati dal monitor WiFi) — la logica di presenza/assenza è identica in entrambi i casi, solo
la sorgente degli eventi "observe" cambia (BleScanMonitor vs WifiProbeMonitor in home_sentinel.py).

Un timeout (non solo l'assenza dall'ultimo evento) serve perché entrambe le sorgenti sono
passive: senza un "tick" periodico (sweep) non sapremmo mai quando un device è sparito, solo
quando ricompare.
"""

from __future__ import annotations

import threading
import time
from datetime import datetime, timezone


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


class PresenceTracker:
    """Transizioni presente/assente per un insieme di MAC "di casa"."""

    def __init__(self, home_macs: set[str], away_timeout_seconds: float = 300.0):
        self.home_macs = {m.lower() for m in home_macs}
        self.away_timeout_seconds = away_timeout_seconds
        self._state: dict[str, dict] = {}  # mac -> {"home": bool, "last_seen": float, "since": float}
        self._lock = threading.Lock()

    def observe(self, mac: str, now: float | None = None) -> dict | None:
        mac = mac.lower()
        if mac not in self.home_macs:
            return None
        now = now if now is not None else time.time()
        with self._lock:
            entry = self._state.get(mac)
            event = None
            if entry is None or not entry["home"]:
                event = {"timestamp": _now_iso(), "mac": mac, "event": "arrived"}
                self._state[mac] = {"home": True, "last_seen": now, "since": now}
            else:
                entry["last_seen"] = now
            return event

    def macs_home(self, now: float | None = None) -> set[str]:
        """MAC attualmente presenti, senza generare né consumare eventi (a differenza di
        observe/sweep, questa è una semplice lettura). Il timeout è applicato anche qui: un MAC
        silenzioso da più di away_timeout_seconds non risulta a casa nemmeno se lo sweep
        periodico non è ancora passato a registrarne l'uscita."""
        now = now if now is not None else time.time()
        with self._lock:
            return {
                mac for mac, entry in self._state.items()
                if entry["home"] and (now - entry["last_seen"]) <= self.away_timeout_seconds
            }

    def sweep(self, now: float | None = None) -> list[dict]:
        """Da chiamare periodicamente (es. ogni secondo, dallo stesso loop di scan/sniff): rileva
        le uscite di casa (timeout senza nuovi eventi)."""
        now = now if now is not None else time.time()
        events = []
        with self._lock:
            for mac, entry in self._state.items():
                if entry["home"] and (now - entry["last_seen"]) > self.away_timeout_seconds:
                    duration = entry["last_seen"] - entry["since"]
                    events.append({
                        "timestamp": _now_iso(), "mac": mac, "event": "left",
                        "duration_s": round(duration, 1),
                    })
                    entry["home"] = False
        return events


class HomeOccupancy:
    """Vista aggregata su più PresenceTracker (WiFi + BLE): "c'è qualcuno in casa?".

    Serve ai consumatori che devono decidere qualcosa in base all'occupazione — oggi la severità
    degli alert (--presence-aware-alerts) — senza doversi occupare di quale radio abbia visto
    chi: un device configurato su entrambe le radio conta una volta sola, e basta un solo MAC
    presente su una qualsiasi delle due perché la casa risulti occupata.
    """

    def __init__(self, trackers: list[PresenceTracker | None]):
        self.trackers = [t for t in trackers if t is not None]

    @property
    def configured(self) -> bool:
        """True solo se almeno un MAC "di casa" è stato configurato: senza, l'occupazione non è
        sconosciuta *per ora*, è proprio un'informazione che il daemon non può avere."""
        return any(t.home_macs for t in self.trackers)

    def macs_home(self, now: float | None = None) -> set[str]:
        macs: set[str] = set()
        for tracker in self.trackers:
            macs |= tracker.macs_home(now)
        return macs

    def occupied(self, now: float | None = None) -> bool | None:
        """True (qualcuno in casa), False (casa vuota) o None se il tracking presenza non è
        configurato — tre stati distinti, perché "non lo so" non va confuso con "non c'è nessuno":
        è esattamente la distinzione su cui si regge l'escalation degli alert a casa vuota."""
        if not self.configured:
            return None
        return bool(self.macs_home(now))
