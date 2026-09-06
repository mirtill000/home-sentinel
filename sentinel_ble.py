"""Detection e classificazione avanzate sugli advertisement BLE.

Tutte le funzioni/classi qui operano solo sui dati già presenti in un
advertisement passivo (nome, manufacturer data, service UUID, RSSI) — nessuna
connessione GATT attiva. Passano dagli stessi alert via `AlertManager` (vedi
sentinel_detection.py) quando generano una segnalazione.

  - classify_ble_device: euristica di classificazione del tipo di device
    (wearable, audio, tracker, ...) da manufacturer data/service UUID/nome.
    Non è un'identificazione certa, solo un indizio per l'inventario.
  - BleTrackerWatchdog: rileva un tracker BLE (AirTag/Find My/Tile) che
    resta nei paraggi più a lungo di una soglia configurabile — possibile
    caso di stalking/pedinamento, non solo un device di casa dimenticato.
  - BleIdentityLinker: euristica di continuità d'identità quando un device
    ruota il proprio indirizzo BLE (RPA — resolvable private address):
    stessa "firma" pubblicitaria (nome + manufacturer/service UUID) vista su
    un nuovo MAC subito dopo che il vecchio è sparito. Genera solo un
    *suggerimento*, mai un collegamento automatico: la fusione resta sempre
    una scelta esplicita in dashboard, stesso principio della "Group by
    identity" lato LAN/WiFi.
  - BleEvilTwinDetector: come EvilTwinDetector ma per BLE — segnala un nome
    "di casa" (es. una serratura smart) trasmesso da un MAC nuovo/inatteso.

Il tracking presenza/assenza (--ble-home-macs) usa il PresenceTracker generico di
sentinel_presence.py, condiviso con l'equivalente lato WiFi (--wifi-home-macs) — non è più
definito qui perché la logica non ha nulla di BLE-specifico.
"""

from __future__ import annotations

import time
from datetime import datetime, timezone

LOG_NAME = "home_sentinel"

# Company ID Bluetooth SIG usati dalle euristiche sotto (bluetooth.com/specifications/assigned-numbers).
COMPANY_APPLE = 76
COMPANY_SAMSUNG = 117

# Service UUID a 16 bit (forma estesa a 128 bit come restituita da bleak) usati da alcuni
# tracker per l'advertising in background — non è un registro esaustivo, solo i più diffusi.
UUID_TILE = "0000feed-0000-1000-8000-00805f9b34fb"  # assegnato a "Tile, Inc."
UUID_SAMSUNG_SMARTTHINGS = "0000fd5a-0000-1000-8000-00805f9b34fb"  # Samsung SmartThings/SmartTag

# Service UUID a 16 bit generici per la classificazione (non tracker) del device.
UUID_HEART_RATE = "0000180d-0000-1000-8000-00805f9b34fb"
UUID_FITNESS_MACHINE = "00001826-0000-1000-8000-00805f9b34fb"
UUID_HID = "00001812-0000-1000-8000-00805f9b34fb"
UUID_LE_AUDIO = "00001853-0000-1000-8000-00805f9b34fb"


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def _apple_type_byte(manufacturer_data: dict[int, bytes]) -> int | None:
    data = manufacturer_data.get(COMPANY_APPLE)
    if not data:
        return None
    return data[0]


def detect_tracker_kind(name: str, manufacturer_data: dict[int, bytes], service_uuids: list[str]) -> str | None:
    """Ritorna un'etichetta se l'advertisement corrisponde al pattern noto di un
    tracker BLE (AirTag/accessorio Find My separato dal proprietario, Tile,
    Samsung SmartTag), altrimenti None. Euristica basata su formati pubblici
    noti, non un'identificazione garantita al 100%."""
    apple_type = _apple_type_byte(manufacturer_data)
    if apple_type == 0x12:
        return "Apple Find My (accessorio separato dal proprietario, es. AirTag)"
    uuids = {u.lower() for u in service_uuids}
    if UUID_TILE in uuids:
        return "Tile tracker"
    if UUID_SAMSUNG_SMARTTHINGS in uuids and manufacturer_data.get(COMPANY_SAMSUNG):
        return "Samsung SmartTag (probabile)"
    return None


def classify_ble_device(name: str, manufacturer_data: dict[int, bytes], service_uuids: list[str]) -> str:
    """Euristica di classificazione del tipo di device per l'inventario BLE
    (colonna 'Device type' in dashboard). Non un'identificazione certa: più
    modelli condividono lo stesso service UUID o produttore."""
    tracker_kind = detect_tracker_kind(name, manufacturer_data, service_uuids)
    if tracker_kind:
        return f"Possibile tracker ({tracker_kind})"

    uuids = {u.lower() for u in service_uuids}
    name_lower = (name or "").lower()

    if UUID_HEART_RATE in uuids or UUID_FITNESS_MACHINE in uuids:
        return "Wearable/fitness"
    if UUID_HID in uuids:
        return "Periferica input (tastiera/mouse)"
    if UUID_LE_AUDIO in uuids:
        return "Audio (LE Audio)"

    apple_type = _apple_type_byte(manufacturer_data)
    if apple_type is not None:
        if apple_type == 0x07 or "airpods" in name_lower:
            return "Auricolari Apple (AirPods)"
        if apple_type == 0x02:
            return "iBeacon"
        return "Dispositivo Apple"

    if manufacturer_data.get(COMPANY_SAMSUNG):
        return "Dispositivo Samsung"

    return ""


def _ble_signature(name: str, manufacturer_ids: list[int], service_uuids: list[str]) -> tuple | None:
    """Firma pubblicitaria di un device per l'euristica di continuità
    d'identità (BleIdentityLinker). Richiede un nome, oppure sia
    manufacturer che service UUID non vuoti insieme: un solo segnale debole
    (es. solo un manufacturer ID comune come Apple, condiviso da milioni di
    device) darebbe troppi falsi positivi di "stesso device"."""
    name = (name or "").strip()
    mids = tuple(sorted(manufacturer_ids or []))
    uuids = tuple(sorted(u.lower() for u in (service_uuids or [])))
    if not name and not (mids and uuids):
        return None
    return (name, mids, uuids)


class BleTrackerWatchdog:
    """Segnala un tracker BLE (AirTag/Find My/Tile/SmartTag) rilevato che
    resta nei paraggi più a lungo della soglia configurata — possibile
    tracker non autorizzato lasciato addosso o nei bagagli (anti-stalking),
    non solo un device di casa dimenticato in giro."""

    def __init__(self, alert_manager, trusted_macs: set[str], window_seconds: float,
                 cooldown_seconds: float = 3600.0):
        self.alert_manager = alert_manager
        self.trusted_macs = {m.lower() for m in trusted_macs}
        self.window_seconds = window_seconds
        self.cooldown_seconds = cooldown_seconds
        self._first_seen: dict[str, float] = {}
        self._last_seen: dict[str, float] = {}
        self._last_alert: dict[str, float] = {}

    def observe(self, mac: str, tracker_kind: str | None, now: float | None = None) -> None:
        if not tracker_kind or mac in self.trusted_macs:
            # Non è (o non sembra essere) un tracker, o è in whitelist (es. il
            # proprio AirTag): niente da tracciare per questo MAC.
            self._first_seen.pop(mac, None)
            self._last_seen.pop(mac, None)
            return

        now = now if now is not None else time.time()
        first_seen = self._first_seen.get(mac)
        last_seen = self._last_seen.get(mac)
        # Un buco di oltre il doppio della finestra tra due avvistamenti è
        # trattato come "nuovo passaggio", non come continuazione dello
        # stesso: evita che un tracker visto una volta al mese accumuli
        # artificialmente presenza nel tempo.
        if first_seen is None or (last_seen is not None and (now - last_seen) > self.window_seconds * 2):
            self._first_seen[mac] = now
        self._last_seen[mac] = now

        presence = now - self._first_seen[mac]
        if presence < self.window_seconds:
            return
        last_alert = self._last_alert.get(mac, 0.0)
        if (now - last_alert) < self.cooldown_seconds:
            return
        self._last_alert[mac] = now

        self.alert_manager.emit(
            "high", "possibile_tracker_ble",
            f"Tracker BLE ({tracker_kind}) presente da oltre {presence / 3600:.1f}h: mac {mac}. "
            "Se è tuo, aggiungilo a --ble-trusted-macs per non essere più segnalato.",
            mac=mac, details={"tracker_kind": tracker_kind, "presence_hours": round(presence / 3600, 1)},
        )


class BleIdentityLinker:
    """Suggerisce (non applica mai automaticamente) un collegamento di
    identità quando la stessa "firma" pubblicitaria ricompare su un MAC
    diverso poco dopo la sparizione del precedente — il pattern tipico di
    una rotazione di indirizzo BLE privato risolvibile (RPA)."""

    def __init__(self, rotation_window_seconds: float = 1200.0):
        self.rotation_window_seconds = rotation_window_seconds
        self._by_signature: dict[tuple, tuple[str, float]] = {}

    def observe(self, mac: str, name: str, manufacturer_ids: list[int], service_uuids: list[str],
                now: float | None = None) -> dict | None:
        signature = _ble_signature(name, manufacturer_ids, service_uuids)
        if signature is None:
            return None
        now = now if now is not None else time.time()

        previous = self._by_signature.get(signature)
        link = None
        if previous is not None:
            prev_mac, prev_ts = previous
            if prev_mac != mac and (now - prev_ts) <= self.rotation_window_seconds:
                link = {
                    "timestamp": _now_iso(),
                    "mac_old": prev_mac,
                    "mac_new": mac,
                    "signature_name": signature[0],
                }
        self._by_signature[signature] = (mac, now)
        return link


class BleEvilTwinDetector:
    """Segnala un nome BLE "di casa" (es. una serratura smart) trasmesso da
    un MAC nuovo/inatteso — stesso principio di EvilTwinDetector per il WiFi."""

    def __init__(self, watched_names: set[str], alert_manager):
        self.watched_names = watched_names
        self.alert_manager = alert_manager
        self.known_macs: dict[str, set[str]] = {}

    def observe(self, name: str, mac: str) -> None:
        if not name or name not in self.watched_names or not mac:
            return
        mac = mac.lower()
        macs = self.known_macs.setdefault(name, set())
        if macs and mac not in macs:
            self.alert_manager.emit(
                "high", "possibile_ble_spoofing",
                f"Nome BLE '{name}' trasmesso da un MAC nuovo/inatteso {mac} (finora noti: {sorted(macs)})",
                mac=mac, details={"name": name, "mac_nuovo": mac, "mac_noti": sorted(macs)},
            )
        macs.add(mac)
