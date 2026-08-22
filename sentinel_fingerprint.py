"""Fingerprinting dei device LAN oltre al solo vendor da MAC OUI.

Incrocia quattro fonti leggere, tutte via socket UDP/TCP standard (nessuna
dipendenza aggiuntiva oltre scapy, già richiesto dal resto del daemon):

  - mDNS: query "_services._dns-sd._udp.local" via multicast, con match sui
    tipi di servizio noti nella risposta grezza (Chromecast, AirPlay,
    HomeKit, stampanti IPP, SMB, ecc.).
  - SSDP/UPnP: M-SEARCH multicast, con parsing degli header HTTP-like della
    risposta (SERVER, ST, USN, LOCATION).
  - NetBIOS (NBSTAT su UDP/137): nome NetBIOS del device, tipico di PC/server
    Windows o storage SMB legacy.
  - Banner grabbing sulle porte già trovate aperte dal port scan: primi byte
    inviati dal servizio alla connessione (SSH/FTP/Telnet) o header "Server:"
    di una richiesta HTTP HEAD minimale.

Ognuna delle quattro è opzionale e fallisce silenziosamente (timeout breve,
nessuna eccezione propagata): un device che non risponde a una sonda non deve
far fallire l'intero fingerprint, solo lasciare quel campo vuoto. Va quindi
inteso come un insieme di indizi euristici per classificare il *tipo* di
device, non come identificazione certa.
"""

from __future__ import annotations

import socket
import struct
import time

KNOWN_MDNS_SERVICE_TOKENS = [
    "_googlecast._tcp", "_airplay._tcp", "_raop._tcp", "_homekit._tcp", "_hap._tcp",
    "_ipp._tcp", "_ipps._tcp", "_printer._tcp", "_pdl-datastream._tcp",
    "_smb._tcp", "_afpovertcp._tcp", "_ssh._tcp", "_sftp-ssh._tcp",
    "_http._tcp", "_https._tcp", "_workstation._tcp", "_spotify-connect._tcp",
    "_sonos._tcp", "_matter._tcp", "_hue._tcp", "_esphomelib._tcp",
    "_amzn-wplay._tcp", "_nvstream._tcp", "_googlezone._tcp",
]

HTTP_PORTS = {80, 443, 8080, 8443, 5000}


def mdns_probe(ip: str, timeout: float = 1.5) -> list[str]:
    """Interroga mDNS per i tipi di servizio pubblicizzati da `ip`.

    Parsing "a occhio" sui byte grezzi della risposta invece di decodificare
    i record DNS: più robusto alle differenze tra implementazioni mDNS dei
    device reali, sufficiente per un match euristico sui token noti.
    """
    try:
        from scapy.all import DNS, DNSQR
    except Exception:
        return []

    query = DNS(rd=1, qd=DNSQR(qname="_services._dns-sd._udp.local.", qtype="PTR", qclass="IN"))
    found: list[str] = []
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        sock.sendto(bytes(query), ("224.0.0.251", 5353))
        deadline = time.time() + timeout
        while True:
            remaining = deadline - time.time()
            if remaining <= 0:
                break
            sock.settimeout(remaining)
            try:
                data, addr = sock.recvfrom(4096)
            except (socket.timeout, OSError):
                break
            if addr[0] != ip:
                continue
            text = data.decode("latin-1", errors="ignore")
            for token in KNOWN_MDNS_SERVICE_TOKENS:
                if token in text and token not in found:
                    found.append(token)
    except OSError:
        pass
    finally:
        sock.close()
    return found


def ssdp_probe(ip: str, timeout: float = 1.5) -> dict:
    """M-SEARCH SSDP/UPnP; ritorna gli header noti della risposta di `ip`."""
    msg = (
        "M-SEARCH * HTTP/1.1\r\n"
        "HOST: 239.255.255.250:1900\r\n"
        'MAN: "ssdp:discover"\r\n'
        "MX: 1\r\n"
        "ST: ssdp:all\r\n\r\n"
    ).encode("ascii")
    info: dict[str, str] = {}
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        sock.sendto(msg, ("239.255.255.250", 1900))
        deadline = time.time() + timeout
        while True:
            remaining = deadline - time.time()
            if remaining <= 0:
                break
            sock.settimeout(remaining)
            try:
                data, addr = sock.recvfrom(4096)
            except (socket.timeout, OSError):
                break
            if addr[0] != ip:
                continue
            text = data.decode("utf-8", errors="ignore")
            for line in text.split("\r\n"):
                key, sep, value = line.partition(":")
                if not sep:
                    continue
                key = key.strip().upper()
                if key in ("SERVER", "ST", "USN", "LOCATION") and key not in info:
                    info[key] = value.strip()
    except OSError:
        pass
    finally:
        sock.close()
    return info


def _encode_netbios_name(name: str, suffix: int = 0x00, pad: bytes = b" ") -> bytes:
    """Codifica NetBIOS "first level" (RFC 1002 §4.1): un byte -> due nibble + 'A'."""
    raw = name.encode("ascii", errors="replace")[:15]
    raw = raw + pad * (15 - len(raw))
    raw += bytes([suffix])
    encoded = bytearray()
    for byte in raw:
        encoded.append(0x41 + (byte >> 4))
        encoded.append(0x41 + (byte & 0x0F))
    return bytes(encoded)


def netbios_probe(ip: str, timeout: float = 1.0) -> str:
    """Query NBSTAT (wildcard "*") su UDP/137; ritorna il primo nome NetBIOS unico trovato."""
    name_field = _encode_netbios_name("*", pad=b"\x00")
    header = struct.pack(">HHHHHH", 0x1337, 0x0000, 1, 0, 0, 0)
    question = bytes([len(name_field)]) + name_field + b"\x00" + struct.pack(">HH", 0x21, 0x01)
    query = header + question

    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.settimeout(timeout)
    try:
        sock.sendto(query, (ip, 137))
        data, _ = sock.recvfrom(2048)
    except (OSError, socket.timeout):
        return ""
    finally:
        sock.close()

    try:
        num_names = data[56]
        offset = 57
        for _ in range(num_names):
            raw_name = data[offset:offset + 15].decode("ascii", errors="ignore").strip()
            name_suffix = data[offset + 15]
            flags = int.from_bytes(data[offset + 16:offset + 18], "big")
            is_group = bool(flags & 0x8000)
            if raw_name and name_suffix == 0x00 and not is_group:
                return raw_name
            offset += 18
    except (IndexError, struct.error):
        pass
    return ""


def grab_banner(ip: str, port: int, timeout: float = 1.0) -> str:
    """Primi byte inviati dal servizio (SSH/FTP/Telnet) o header Server: (HTTP).

    Nota: sulle porte TLS (443/8443) non viene fatto l'handshake TLS, quindi
    tipicamente non produce risultati — limitazione nota, non un bug.
    """
    try:
        with socket.create_connection((ip, port), timeout=timeout) as sock:
            sock.settimeout(timeout)
            if port in HTTP_PORTS:
                try:
                    sock.sendall(f"HEAD / HTTP/1.0\r\nHost: {ip}\r\n\r\n".encode("ascii"))
                except OSError:
                    return ""
            try:
                data = sock.recv(512)
            except OSError:
                return ""
    except OSError:
        return ""

    if not data:
        return ""
    text = data.decode("latin-1", errors="ignore")
    if port in HTTP_PORTS:
        for line in text.split("\r\n"):
            if line.lower().startswith("server:"):
                return line.split(":", 1)[1].strip()
        return ""
    stripped = text.strip()
    return stripped.splitlines()[0][:120] if stripped else ""


def classify_device(
    services: list[str], ssdp_info: dict, netbios_name: str, banners: dict[str, str],
    open_ports: list[int], vendor: str,
) -> str:
    """Euristica di classificazione: dal più specifico al più generico."""
    services_blob = " ".join(services).lower()
    ssdp_blob = " ".join(ssdp_info.values()).lower() if ssdp_info else ""
    banner_blob = " ".join(banners.values()).lower()
    vendor_blob = (vendor or "").lower()

    def has(*needles: str) -> bool:
        haystacks = (services_blob, ssdp_blob, banner_blob)
        return any(needle in haystack for needle in needles for haystack in haystacks)

    if has("googlecast"):
        return "Google Cast / Chromecast"
    if has("airplay", "raop"):
        return "Apple TV / AirPlay"
    if has("homekit", "_hap", "hap._tcp"):
        return "Dispositivo HomeKit"
    if has("hue"):
        return "Hue Bridge / smart lighting"
    if has("sonos"):
        return "Sonos speaker"
    if has("ipp", "printer", "pdl-datastream") or 631 in open_ports or 9100 in open_ports:
        return "Stampante"
    if has("mediaserver", "camera", "urn:schemas-upnp-org:device:mediaserver"):
        return "Telecamera IP / Media server"
    if netbios_name or 445 in open_ports or 139 in open_ports:
        return "PC/Server Windows (SMB)"
    if "raspberry pi" in vendor_blob:
        return "Raspberry Pi"
    if "apple" in vendor_blob:
        return "Dispositivo Apple"
    if 22 in open_ports and ("openssh" in banner_blob or has("_ssh._tcp", "_sftp-ssh._tcp")):
        return "Server/dispositivo Linux (SSH)"
    if 80 in open_ports or 8080 in open_ports or has("_http._tcp"):
        return "Dispositivo con interfaccia web (IoT?)"
    if not services and not ssdp_info and not open_ports and not netbios_name:
        return "Sconosciuto"
    return "Dispositivo generico"


def fingerprint_device(ip: str, open_ports: list[int], vendor: str = "") -> dict:
    """Esegue tutte le sonde e ritorna un fingerprint pronto da loggare."""
    services = mdns_probe(ip)
    ssdp_info = ssdp_probe(ip)
    netbios_name = netbios_probe(ip)
    banners = {}
    for port in open_ports:
        banner = grab_banner(ip, port)
        if banner:
            banners[str(port)] = banner

    device_type = classify_device(services, ssdp_info, netbios_name, banners, open_ports, vendor)
    return {
        "device_type": device_type,
        "services": services,
        "ssdp": ssdp_info,
        "netbios_name": netbios_name,
        "banners": banners,
    }
