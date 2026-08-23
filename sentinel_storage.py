"""Storage SQLite per query storiche/aggregate sui dati raccolti da Home Sentinel.

Affianca (non sostituisce) i log JSON Lines: i JSONL restano il log grezzo
d'archivio (append-only, resiliente a scritture interrotte), SQLite abilita
query indicizzate — storico per device, filtri, aggregazioni — senza dover
riparsare file da milioni di righe ad ogni consultazione.

Un solo file .db con quattro tabelle "evento" (una per modulo di discovery),
più due tabelle di supporto per fingerprint dei device e alert di sicurezza,
e una per la baseline comportamentale usata dall'anomaly detector.
"""

from __future__ import annotations

import json
import sqlite3
import threading
from pathlib import Path

SCHEMA = """
CREATE TABLE IF NOT EXISTS lan_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    status TEXT NOT NULL,
    ip TEXT NOT NULL,
    mac TEXT NOT NULL,
    hostname TEXT,
    vendor TEXT,
    open_ports TEXT
);
CREATE INDEX IF NOT EXISTS idx_lan_mac ON lan_events(mac);
CREATE INDEX IF NOT EXISTS idx_lan_ts ON lan_events(timestamp);

CREATE TABLE IF NOT EXISTS probe_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    mac TEXT NOT NULL,
    vendor TEXT,
    ssid TEXT,
    rssi INTEGER,
    channel INTEGER
);
CREATE INDEX IF NOT EXISTS idx_probe_mac ON probe_events(mac);
CREATE INDEX IF NOT EXISTS idx_probe_ts ON probe_events(timestamp);

CREATE TABLE IF NOT EXISTS ble_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    mac TEXT NOT NULL,
    name TEXT,
    rssi INTEGER,
    tx_power INTEGER,
    manufacturer_ids TEXT,
    service_uuids TEXT
);
CREATE INDEX IF NOT EXISTS idx_ble_mac ON ble_events(mac);
CREATE INDEX IF NOT EXISTS idx_ble_ts ON ble_events(timestamp);

CREATE TABLE IF NOT EXISTS fingerprints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    mac TEXT NOT NULL,
    ip TEXT NOT NULL,
    device_type TEXT,
    services TEXT,
    ssdp TEXT,
    netbios_name TEXT,
    banners TEXT
);
CREATE INDEX IF NOT EXISTS idx_fp_mac ON fingerprints(mac);
CREATE INDEX IF NOT EXISTS idx_fp_ts ON fingerprints(timestamp);

CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    severity TEXT NOT NULL,
    type TEXT NOT NULL,
    mac TEXT,
    ip TEXT,
    message TEXT NOT NULL,
    details TEXT
);
CREATE INDEX IF NOT EXISTS idx_alerts_ts ON alerts(timestamp);
CREATE INDEX IF NOT EXISTS idx_alerts_type ON alerts(type);

CREATE TABLE IF NOT EXISTS device_baseline (
    mac TEXT PRIMARY KEY,
    first_seen TEXT NOT NULL,
    known_ports TEXT NOT NULL,
    observations INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL
);
"""


class SqliteStore:
    """Wrapper sqlite3 thread-safe (un lock, connessione condivisa in WAL)."""

    def __init__(self, path: Path):
        path.parent.mkdir(parents=True, exist_ok=True)
        self._lock = threading.Lock()
        self._conn = sqlite3.connect(str(path), check_same_thread=False)
        self._conn.execute("PRAGMA journal_mode=WAL")
        self._conn.execute("PRAGMA synchronous=NORMAL")
        self._conn.executescript(SCHEMA)
        self._migrate_drop_hour_histogram()
        self._conn.commit()

    def _migrate_drop_hour_histogram(self) -> None:
        """Rimuove la colonna hour_histogram da un database creato da una
        versione precedente (rilevamento "orario insolito", rimosso).

        Necessario perché CREATE TABLE IF NOT EXISTS non altera una tabella
        già esistente: senza questa migrazione, un .db creato prima di
        questa modifica continuerebbe ad avere la colonna NOT NULL e ogni
        INSERT (che ora non la valorizza più) fallirebbe.
        """
        cols = [row[1] for row in self._conn.execute("PRAGMA table_info(device_baseline)").fetchall()]
        if "hour_histogram" not in cols:
            return
        try:
            self._conn.execute("ALTER TABLE device_baseline DROP COLUMN hour_histogram")
        except sqlite3.OperationalError:
            # sqlite3 troppo vecchio per DROP COLUMN (< 3.35): ricrea la tabella
            self._conn.execute("ALTER TABLE device_baseline RENAME TO device_baseline_old")
            self._conn.executescript(SCHEMA)
            self._conn.execute(
                "INSERT INTO device_baseline (mac, first_seen, known_ports, observations, updated_at) "
                "SELECT mac, first_seen, known_ports, observations, updated_at FROM device_baseline_old"
            )
            self._conn.execute("DROP TABLE device_baseline_old")

    def insert_lan_event(self, row: dict) -> None:
        with self._lock:
            self._conn.execute(
                "INSERT INTO lan_events (timestamp, status, ip, mac, hostname, vendor, open_ports) "
                "VALUES (?, ?, ?, ?, ?, ?, ?)",
                (
                    row["timestamp"], row["status"], row["ip"], row["mac"],
                    row.get("hostname", ""), row.get("vendor", ""),
                    json.dumps(row.get("open_ports", [])),
                ),
            )
            self._conn.commit()

    def insert_probe_event(self, row: dict) -> None:
        with self._lock:
            self._conn.execute(
                "INSERT INTO probe_events (timestamp, mac, vendor, ssid, rssi, channel) "
                "VALUES (?, ?, ?, ?, ?, ?)",
                (row["timestamp"], row["mac"], row.get("vendor", ""), row.get("ssid", ""),
                 row.get("rssi"), row.get("channel")),
            )
            self._conn.commit()

    def insert_ble_event(self, row: dict) -> None:
        with self._lock:
            self._conn.execute(
                "INSERT INTO ble_events (timestamp, mac, name, rssi, tx_power, manufacturer_ids, service_uuids) "
                "VALUES (?, ?, ?, ?, ?, ?, ?)",
                (
                    row["timestamp"], row["mac"], row.get("name", ""), row.get("rssi"), row.get("tx_power"),
                    json.dumps(row.get("manufacturer_ids", [])), json.dumps(row.get("service_uuids", [])),
                ),
            )
            self._conn.commit()

    def insert_fingerprint(self, row: dict) -> None:
        with self._lock:
            self._conn.execute(
                "INSERT INTO fingerprints (timestamp, mac, ip, device_type, services, ssdp, netbios_name, banners) "
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                (
                    row["timestamp"], row["mac"], row["ip"], row.get("device_type", ""),
                    json.dumps(row.get("services", [])), json.dumps(row.get("ssdp", {})),
                    row.get("netbios_name", ""), json.dumps(row.get("banners", {})),
                ),
            )
            self._conn.commit()

    def insert_alert(self, row: dict) -> None:
        with self._lock:
            self._conn.execute(
                "INSERT INTO alerts (timestamp, severity, type, mac, ip, message, details) "
                "VALUES (?, ?, ?, ?, ?, ?, ?)",
                (
                    row["timestamp"], row["severity"], row["type"], row.get("mac"), row.get("ip"),
                    row["message"], json.dumps(row.get("details", {})),
                ),
            )
            self._conn.commit()

    def load_baselines(self) -> dict[str, dict]:
        with self._lock:
            cur = self._conn.execute(
                "SELECT mac, first_seen, known_ports, observations, updated_at FROM device_baseline"
            )
            rows = cur.fetchall()
        baselines = {}
        for mac, first_seen, known_ports, observations, updated_at in rows:
            baselines[mac] = {
                "first_seen": first_seen,
                "known_ports": json.loads(known_ports),
                "observations": observations,
                "updated_at": updated_at,
            }
        return baselines

    def upsert_baseline(self, mac: str, baseline: dict) -> None:
        with self._lock:
            self._conn.execute(
                "INSERT INTO device_baseline (mac, first_seen, known_ports, observations, updated_at) "
                "VALUES (?, ?, ?, ?, ?) "
                "ON CONFLICT(mac) DO UPDATE SET "
                "known_ports=excluded.known_ports, "
                "observations=excluded.observations, updated_at=excluded.updated_at",
                (
                    mac, baseline["first_seen"],
                    json.dumps(baseline["known_ports"]), baseline["observations"], baseline["updated_at"],
                ),
            )
            self._conn.commit()

    def close(self) -> None:
        with self._lock:
            self._conn.close()
