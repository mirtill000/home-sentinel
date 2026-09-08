"""Audit dell'esposizione verso Internet: port forwarding attivi sul router, via UPnP/IGD.

Il port scan interno del daemon dice quali porte sono aperte *sulla LAN*; non dice affatto cosa
sia raggiungibile *da fuori*, che è il rischio vero — una telecamera con la porta 80 aperta in
LAN è una cosa, la stessa telecamera con un forwarding 80 -> Internet è un'altra. Quasi tutti i
router domestici espongono i propri port forwarding via UPnP IGD (spesso creati automaticamente
da console, NAS e client torrent senza che nessuno lo sappia): questo modulo li elenca.

Due passi, entrambi solo verso la LAN e solo in lettura:
  1. discovery SSDP (M-SEARCH multicast su 239.255.255.250:1900) per trovare l'InternetGateway
     e la URL della sua descrizione XML;
  2. lettura della descrizione per individuare il control URL del servizio WANIPConnection /
     WANPPPConnection, poi chiamate SOAP GetGenericPortMappingEntry con indice crescente finché
     il router risponde con un errore (è il modo standard di enumerare: non esiste una "lista").

Nessuna scrittura: non chiama mai AddPortMapping/DeletePortMapping. Solo stdlib.
"""

from __future__ import annotations

import logging
import socket
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

LOG = logging.getLogger("home_sentinel")

SSDP_ADDR = "239.255.255.250"
SSDP_PORT = 1900
# I router espongono l'IGD con versione 1 o 2 del device type: le cerchiamo entrambe, più la
# ricerca generica "ssdp:all" come rete di sicurezza per i firmware che non rispondono ai target
# specifici (succede, soprattutto su router di operatore con stack UPnP semplificati).
SSDP_TARGETS = (
    "urn:schemas-upnp-org:device:InternetGatewayDevice:1",
    "urn:schemas-upnp-org:device:InternetGatewayDevice:2",
)
WAN_SERVICE_TYPES = (
    "urn:schemas-upnp-org:service:WANIPConnection:1",
    "urn:schemas-upnp-org:service:WANIPConnection:2",
    "urn:schemas-upnp-org:service:WANPPPConnection:1",
)
UPNP_NS = "{urn:schemas-upnp-org:device-1-0}"
SOAP_NS = "{http://schemas.xmlsoap.org/soap/envelope/}"

# Limite di sicurezza all'enumerazione: un router normale ha una manciata di mapping, e senza un
# tetto un firmware che risponde sempre "ok" (ne esistono) terrebbe il ciclo in piedi all'infinito.
MAX_MAPPINGS = 200


def discover_igd_locations(timeout: float = 3.0) -> list[str]:
    """URL di descrizione (header LOCATION) degli InternetGatewayDevice che rispondono all'SSDP."""
    locations: list[str] = []
    for target in SSDP_TARGETS:
        request = (
            "M-SEARCH * HTTP/1.1\r\n"
            f"HOST: {SSDP_ADDR}:{SSDP_PORT}\r\n"
            'MAN: "ssdp:discover"\r\n'
            "MX: 2\r\n"
            f"ST: {target}\r\n\r\n"
        ).encode()
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        sock.settimeout(timeout)
        try:
            sock.sendto(request, (SSDP_ADDR, SSDP_PORT))
            while True:
                try:
                    data, _ = sock.recvfrom(65507)
                except socket.timeout:
                    break
                for line in data.decode(errors="replace").splitlines():
                    if line.lower().startswith("location:"):
                        location = line.split(":", 1)[1].strip()
                        if location and location not in locations:
                            locations.append(location)
        except OSError as exc:
            LOG.debug("SSDP discovery fallita per %s: %s", target, exc)
        finally:
            sock.close()
    return locations


def _find_wan_control_url(description_xml: str, base_url: str) -> tuple[str | None, str | None]:
    """Control URL e service type del servizio WAN*Connection dentro la descrizione del device.

    La descrizione è un albero di device annidati (IGD -> WANDevice -> WANConnectionDevice), per
    questo si cerca ricorsivamente su tutti i <service> invece che a una profondità fissa.
    """
    try:
        root = ET.fromstring(description_xml)
    except ET.ParseError as exc:
        LOG.debug("Descrizione UPnP non parsabile: %s", exc)
        return None, None

    for service in root.iter(f"{UPNP_NS}service"):
        service_type = (service.findtext(f"{UPNP_NS}serviceType") or "").strip()
        control_url = (service.findtext(f"{UPNP_NS}controlURL") or "").strip()
        if service_type in WAN_SERVICE_TYPES and control_url:
            return urllib.parse.urljoin(base_url, control_url), service_type
    return None, None


def _soap_call(control_url: str, service_type: str, action: str, args: dict, timeout: float) -> str | None:
    body = "".join(f"<{k}>{v}</{k}>" for k, v in args.items())
    envelope = (
        '<?xml version="1.0"?>'
        '<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" '
        's:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">'
        f'<s:Body><u:{action} xmlns:u="{service_type}">{body}</u:{action}></s:Body>'
        "</s:Envelope>"
    ).encode()
    request = urllib.request.Request(
        control_url, data=envelope,
        headers={
            "Content-Type": 'text/xml; charset="utf-8"',
            "SOAPAction": f'"{service_type}#{action}"',
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            return response.read().decode(errors="replace")
    except urllib.error.HTTPError:
        # Fine dell'enumerazione: il router risponde 500 SpecifiedArrayIndexInvalid quando
        # l'indice supera l'ultimo mapping. È il modo previsto dallo standard per dire "basta".
        return None
    except (urllib.error.URLError, OSError, ValueError) as exc:
        LOG.debug("Chiamata SOAP %s fallita: %s", action, exc)
        return None


def _parse_mapping(xml_text: str) -> dict | None:
    try:
        root = ET.fromstring(xml_text)
    except ET.ParseError:
        return None
    body = root.find(f"{SOAP_NS}Body")
    if body is None or len(body) == 0:
        return None
    fields = {child.tag.split("}")[-1]: (child.text or "") for child in body[0]}
    if not fields.get("NewInternalClient"):
        return None
    return {
        "external_port": int(fields.get("NewExternalPort") or 0) or None,
        "internal_port": int(fields.get("NewInternalPort") or 0) or None,
        "internal_ip": fields.get("NewInternalClient") or None,
        "protocol": (fields.get("NewProtocol") or "").upper() or None,
        "description": fields.get("NewPortMappingDescription") or "",
        "enabled": fields.get("NewEnabled", "1") not in ("0", "false", "False"),
    }


def list_port_mappings(timeout: float = 3.0) -> tuple[list[dict], str | None]:
    """Port forwarding attivi sul router e URL del router che ha risposto.

    Ritorna una lista vuota (non un errore) quando l'UPnP è disabilitato o il router non lo
    espone: è una condizione normalissima, e per l'utente è anzi la notizia migliore.
    """
    for location in discover_igd_locations(timeout):
        try:
            with urllib.request.urlopen(location, timeout=timeout) as response:
                description = response.read().decode(errors="replace")
        except (urllib.error.URLError, OSError) as exc:
            LOG.debug("Descrizione UPnP non scaricabile da %s: %s", location, exc)
            continue

        control_url, service_type = _find_wan_control_url(description, location)
        if not control_url:
            continue

        mappings: list[dict] = []
        for index in range(MAX_MAPPINGS):
            xml_text = _soap_call(
                control_url, service_type, "GetGenericPortMappingEntry",
                {"NewPortMappingIndex": index}, timeout,
            )
            if xml_text is None:
                break
            mapping = _parse_mapping(xml_text)
            if mapping is None:
                break
            mappings.append(mapping)
        return mappings, location

    return [], None
