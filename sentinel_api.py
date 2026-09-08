"""API HTTP locale in sola lettura sullo specchio SQLite del daemon.

Perché esiste: la dashboard è una pagina statica che legge i JSONL via HTTP, e per non bloccare
il browser su file da decine di MB ne scarica solo la coda più recente (TAIL_FETCH_BYTES in
app.js). Funziona, ma taglia lo storico proprio dove servirebbe intero — Trend su 30 giorni,
ricerche su tutta la cronologia, confronto fra periodi. Il rollup giornaliero nasceva come
tampone per un caso singolo; questa API risolve il problema alla radice: SQLite ha già tutta la
storia indicizzata, basta poterla interrogare.

Progettata per essere noiosa e sicura:
  - **sola lettura**: la connessione è aperta in `mode=ro`, nessun endpoint scrive;
  - **niente SQL dall'esterno**: il client sceglie tabella, filtri e ordinamento da una allowlist
    (TABLES qui sotto); qualunque nome fuori elenco è un 400. Non si costruisce mai SQL con
    stringhe arrivate dalla rete, i valori passano sempre come parametri;
  - **stdlib**: http.server + sqlite3, nessuna dipendenza in più su un Raspberry Pi.

Non ha autenticazione: è pensata per la LAN di casa, esattamente come la cartella `dashboard/`
servita da `python3 -m http.server`. Chi la espone oltre la LAN se ne assume il rischio (vedi
README) — per questo il default di `--api-host` resta 127.0.0.1.
"""

from __future__ import annotations

import json
import logging
import sqlite3
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

LOG = logging.getLogger("home_sentinel")

# Allowlist delle tabelle interrogabili: nome -> colonne filtrabili/ordinabili. Le tabelle non
# elencate (device_baseline, che è stato interno del rilevatore anomalie) restano invisibili.
TABLES: dict[str, tuple[str, ...]] = {
    "lan_events": ("timestamp", "status", "ip", "mac", "hostname", "vendor"),
    "probe_events": ("timestamp", "mac", "vendor", "ssid", "rssi", "channel"),
    "ble_events": ("timestamp", "mac", "name", "rssi", "device_type"),
    "ble_identity_links": ("timestamp", "mac_old", "mac_new", "signature_name"),
    "ble_presence": ("timestamp", "mac", "event"),
    "wifi_presence": ("timestamp", "mac", "event"),
    "fingerprints": ("timestamp", "mac", "ip", "device_type"),
    "alerts": ("timestamp", "severity", "type", "mac", "ip", "home_occupied"),
    "wifi_traffic": ("timestamp", "mac"),
    "wifi_networks": ("timestamp", "bssid", "ssid", "channel", "security"),
    "dhcp_events": ("timestamp", "mac", "hostname"),
    "os_fingerprints": ("timestamp", "mac", "os_guess"),
    "deep_port_scans": ("timestamp", "mac", "ip"),
    "handshake_captures": ("timestamp", "ssid", "bssid", "sta_mac"),
    "dhcp_leases": ("timestamp", "mac", "ip"),
    "ipv6_neighbors": ("timestamp", "mac", "ipv6", "scope", "state"),
    "exposure_audit": ("timestamp", "internal_ip", "internal_port", "external_port", "protocol"),
}

DEFAULT_LIMIT = 500
MAX_LIMIT = 20000


class ReadOnlyStore:
    """Connessione sqlite3 in sola lettura, condivisa fra i thread del server."""

    def __init__(self, db_path: Path):
        self.db_path = db_path
        self._lock = threading.Lock()
        # mode=ro: il file non viene mai creato né modificato da qui, nemmeno per sbaglio. Se il
        # daemon gira con WAL (lo fa), le letture non bloccano le sue scritture.
        self._conn = sqlite3.connect(f"file:{db_path}?mode=ro", uri=True, check_same_thread=False)
        self._conn.row_factory = sqlite3.Row

    def _select(self, sql: str, params: tuple) -> list[dict]:
        with self._lock:
            return [dict(row) for row in self._conn.execute(sql, params).fetchall()]

    def tables(self) -> list[dict]:
        present = {
            row["name"] for row in self._select("SELECT name FROM sqlite_master WHERE type='table'", ())
        }
        out = []
        for table in TABLES:
            if table not in present:
                continue  # tabella non ancora creata da questa versione del daemon
            count = self._select(f"SELECT COUNT(*) AS n FROM {table}", ())[0]["n"]
            oldest = self._select(f"SELECT MIN(timestamp) AS t FROM {table}", ())[0]["t"]
            newest = self._select(f"SELECT MAX(timestamp) AS t FROM {table}", ())[0]["t"]
            out.append({"table": table, "rows": count, "oldest": oldest, "newest": newest,
                        "filterable": list(TABLES[table])})
        return out

    def query(self, table: str, filters: dict[str, str], since: str | None, until: str | None,
              limit: int, offset: int, order: str) -> list[dict]:
        """SELECT con filtri di uguaglianza + intervallo temporale. `table`, i nomi di colonna e
        la direzione di ordinamento sono già stati validati contro l'allowlist dal chiamante:
        qui nell'SQL finiscono solo identificatori noti, mai valori dell'utente."""
        clauses, params = [], []
        for column, value in filters.items():
            clauses.append(f"{column} = ?")
            params.append(value)
        if since:
            clauses.append("timestamp >= ?")
            params.append(since)
        if until:
            clauses.append("timestamp <= ?")
            params.append(until)
        where = f" WHERE {' AND '.join(clauses)}" if clauses else ""
        sql = f"SELECT * FROM {table}{where} ORDER BY timestamp {order} LIMIT ? OFFSET ?"
        return self._select(sql, (*params, limit, offset))

    def daily_counts(self, table: str, since: str | None, column: str | None) -> list[dict]:
        """Conteggi per giorno (e opzionalmente per valore di `column`): l'aggregazione che una
        dashboard statica dovrebbe altrimenti ricalcolare in JavaScript su tutte le righe."""
        clauses, params = [], []
        if since:
            clauses.append("timestamp >= ?")
            params.append(since)
        where = f" WHERE {' AND '.join(clauses)}" if clauses else ""
        group_extra = f", {column}" if column else ""
        sql = (
            f"SELECT substr(timestamp, 1, 10) AS day{group_extra}, COUNT(*) AS count "
            f"FROM {table}{where} GROUP BY day{group_extra} ORDER BY day"
        )
        return self._select(sql, tuple(params))


class _Handler(BaseHTTPRequestHandler):
    server_version = "HomeSentinelAPI/1.0"
    store: ReadOnlyStore = None  # iniettati da serve() sulla sottoclasse
    allow_origin: str = "*"
    heartbeat_path: Path | None = None

    def log_message(self, fmt, *args):  # il default stampa su stderr, qui passa dal logger comune
        LOG.debug("API %s - %s", self.address_string(), fmt % args)

    def _send(self, status: int, payload: dict | list) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", self.allow_origin)
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self) -> None:  # preflight CORS della dashboard servita da un'altra porta
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", self.allow_origin)
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.end_headers()

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        params = {k: v[0] for k, v in parse_qs(parsed.query).items()}
        try:
            if parsed.path == "/api/health":
                self._send(200, self._health())
            elif parsed.path == "/api/tables":
                self._send(200, {"tables": self.store.tables()})
            elif parsed.path == "/api/query":
                self._send(200, self._query(params))
            elif parsed.path == "/api/daily":
                self._send(200, self._daily(params))
            else:
                self._send(404, {"error": "unknown endpoint",
                                 "endpoints": ["/api/health", "/api/tables", "/api/query", "/api/daily"]})
        except ValueError as exc:  # richiesta malformata: colpa del client, non del server
            self._send(400, {"error": str(exc)})
        except sqlite3.Error as exc:
            LOG.exception("Query API fallita")
            self._send(500, {"error": f"database error: {exc}"})

    def _health(self) -> dict:
        heartbeat = None
        if self.heartbeat_path and self.heartbeat_path.is_file():
            try:
                heartbeat = json.loads(self.heartbeat_path.read_text().strip().splitlines()[-1])
            except (OSError, ValueError, IndexError):
                heartbeat = None
        return {"ok": True, "db": str(self.store.db_path), "heartbeat": heartbeat}

    def _table_param(self, params: dict) -> str:
        table = params.get("table", "")
        if table not in TABLES:
            raise ValueError(f"unknown table '{table}' (allowed: {', '.join(sorted(TABLES))})")
        return table

    def _query(self, params: dict) -> dict:
        table = self._table_param(params)
        allowed = TABLES[table]
        filters = {k: v for k, v in params.items() if k in allowed and k != "timestamp"}

        try:
            limit = min(int(params.get("limit", DEFAULT_LIMIT)), MAX_LIMIT)
            offset = max(int(params.get("offset", 0)), 0)
        except ValueError:
            raise ValueError("limit/offset must be integers") from None
        order = "DESC" if params.get("order", "desc").lower() != "asc" else "ASC"

        rows = self.store.query(table, filters, params.get("since"), params.get("until"),
                                limit, offset, order)
        return {"table": table, "count": len(rows), "limit": limit, "offset": offset, "rows": rows}

    def _daily(self, params: dict) -> dict:
        table = self._table_param(params)
        column = params.get("group_by")
        if column and column not in TABLES[table]:
            raise ValueError(f"cannot group '{table}' by '{column}'")
        rows = self.store.daily_counts(table, params.get("since"), column)
        return {"table": table, "group_by": column, "rows": rows}


def serve(db_path: Path, host: str, port: int, stop_event: threading.Event,
          allow_origin: str = "*", heartbeat_path: Path | None = None) -> None:
    """Avvia il server finché stop_event non viene alzato (pensato per girare in un thread)."""
    if not db_path.is_file():
        LOG.warning("API non avviata: database %s non ancora presente", db_path)
        return

    handler = type("_BoundHandler", (_Handler,), {
        "store": ReadOnlyStore(db_path),
        "allow_origin": allow_origin,
        "heartbeat_path": heartbeat_path,
    })
    httpd = ThreadingHTTPServer((host, port), handler)
    httpd.daemon_threads = True
    LOG.info("API di query avviata su http://%s:%s (sola lettura su %s)", host, port, db_path)

    # serve_forever() blocca: lo si ferma da un thread di guardia quando arriva lo stop_event,
    # così il daemon resta con un unico meccanismo di arresto per tutti i suoi servizi.
    def wait_and_close() -> None:
        stop_event.wait()
        httpd.shutdown()

    threading.Thread(target=wait_and_close, name="api-stop-watch", daemon=True).start()
    try:
        httpd.serve_forever()
    finally:
        httpd.server_close()
