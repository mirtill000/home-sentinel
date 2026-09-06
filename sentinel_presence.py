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
