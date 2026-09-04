"""Cross-check con la tabella DHCP lease del router/DHCP server.

Non esiste un'API universale per leggere le lease di un router qualsiasi:
questo modulo supporta due formati concreti, letti da un file locale o da
un URL http(s):

  - "dnsmasq": il formato nativo di `dnsmasq.leases` (una riga per lease:
    "<scadenza-epoch> <mac> <ip> <hostname> <client-id>") — usato da molti
    router OpenWrt/pfSense/Pi-hole, e da dnsmasq stesso se gira sul Pi.
  - "json": un array JSON generico `[{"mac": ..., "ip": ..., "hostname": ...}, ...]`
    — per router/DHCP server che non espongono dnsmasq.leases: un piccolo
    script/cron lato router (se il router lo supporta) può convertire le
    proprie lease in questo formato e pubblicarle su un file che il Pi
    legge via rete (NFS, scp periodico, ecc.) o via URL.

Con "auto" (default) si prova prima a interpretare la sorgente come JSON
(riconoscibile dal primo carattere non vuoto) e in caso contrario come
dnsmasq. Nessuna delle due funzioni pubbliche solleva eccezioni verso il
chiamante: una sorgente lease irraggiungibile o mal formata è un'assenza
temporanea di dato, non un errore che deve far fallire il ciclo di LAN
discovery.
"""

from __future__ import annotations

import json
import urllib.request


def _read_source(source: str, timeout: float = 5.0) -> str:
    if source.startswith("http://") or source.startswith("https://"):
        with urllib.request.urlopen(source, timeout=timeout) as resp:  # noqa: S310 (URL passata esplicitamente dall'utente via CLI)
            return resp.read().decode("utf-8", errors="ignore")
    with open(source, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()


def _parse_dnsmasq(text: str) -> list[dict]:
    leases = []
    for line in text.splitlines():
        parts = line.split()
        if len(parts) < 4:
            continue
        _expiry, mac, ip, hostname = parts[0], parts[1], parts[2], parts[3]
        if mac.count(":") != 5:
            continue  # riga che non è una lease IPv4 standard (es. lease6, commenti)
        leases.append({
            "mac": mac.lower(),
            "ip": ip,
            "hostname": "" if hostname == "*" else hostname,
        })
    return leases


def _parse_json(text: str) -> list[dict]:
    data = json.loads(text)
    if not isinstance(data, list):
        return []
    leases = []
    for entry in data:
        if not isinstance(entry, dict):
            continue
        mac = str(entry.get("mac", "")).strip().lower()
        if not mac:
            continue
        leases.append({
            "mac": mac,
            "ip": str(entry.get("ip", "")).strip(),
            "hostname": str(entry.get("hostname", "")).strip(),
        })
    return leases


def fetch_dhcp_leases(source: str, fmt: str = "auto") -> list[dict]:
    """Legge e normalizza le lease DHCP da `source` (path locale o URL http/https).

    Ritorna `[{"mac", "ip", "hostname"}, ...]`, oppure `[]` se la sorgente
    non è raggiungibile o il formato non è riconosciuto.
    """
    try:
        text = _read_source(source)
    except Exception:
        return []

    if fmt == "dnsmasq":
        return _parse_dnsmasq(text)
    if fmt == "json":
        try:
            return _parse_json(text)
        except Exception:
            return []

    stripped = text.strip()
    if stripped[:1] in ("[", "{"):
        try:
            return _parse_json(text)
        except Exception:
            return []
    return _parse_dnsmasq(text)
