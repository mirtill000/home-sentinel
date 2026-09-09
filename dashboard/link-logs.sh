#!/usr/bin/env bash
# Crea, in questa cartella, symlink verso i log JSON Lines scritti dal
# daemon (di default in /var/log/home-sentinel/), così i percorsi di
# default della dashboard (lan_discovery.jsonl, wifi_probes.jsonl,
# ble_discovery.jsonl, fingerprint_discovery.jsonl, alerts_detection.jsonl,
# wifi_traffic.jsonl, wifi_networks.jsonl, dhcp_leases.jsonl,
# trend_daily.jsonl, os_fingerprint.jsonl, dhcp_events.jsonl,
# ble_identity_links.jsonl, ble_presence.jsonl, deep_port_scan.jsonl,
# handshake_captures.jsonl, wifi_presence.jsonl, daemon_config.jsonl,
# ipv6_neighbors.jsonl, exposure_audit.jsonl, heartbeat.jsonl)
# funzionano subito quando la si serve da qui (es. python3 -m http.server),
# senza toccare Impostazioni né passare parametri via URL.
#
# dhcp_leases/trend_daily/os_fingerprint/dhcp_events sono prodotti dai moduli
# opzionali di discovery avanzata (--dhcp-discovery, --os-fingerprint,
# --dhcp-lease-source) e dal trend rollup (attivo di default salvo
# --no-trend-rollup); ble_identity_links dai suggerimenti di collegamento
# identità BLE (attivi di default insieme a --ble, salvo
# --no-ble-identity-linking); ble_presence/wifi_presence dal tracking
# presenza/assenza (--ble-home-macs / --wifi-home-macs, stesso principio su
# entrambe le radio); deep_port_scan dal deep port scan opzionale
# (--deep-port-scan); handshake_captures dalla cattura passiva degli
# handshake WPA/WPA2 (--capture-handshakes, richiede --home-ssid) — i
# file .pcap veri e propri restano nella cartella --handshake-pcap-dir,
# solo i metadati JSONL sono pensati per la dashboard; daemon_config dallo
# snapshot di configurazione scritto una tantum ad ogni avvio (interfacce,
# MAC "di casa", quali moduli sono davvero attivi — serve al denominatore
# corretto del KPI Presence e al pannello "Salute del sistema" in
# Dashboard); ipv6_neighbors dalla discovery IPv6 (--ipv6-discovery);
# exposure_audit dall'audit dei port forwarding del router via UPnP
# (--exposure-audit); heartbeat dalla prova di vita del daemon, riscritta
# (non appesa) ogni --heartbeat-interval secondi — serve alla dashboard per
# distinguere "rete tranquilla" da "daemon fermo". Finché il modulo relativo
# non è attivo sul daemon, il file resta semplicemente assente.
#
# Oltre a questo elenco noto, una seconda passata collega ANCHE qualunque altro *.jsonl già
# presente in SRC_DIR ma non nella lista sopra (segnalato con "NEW"): copre il caso di un modulo
# aggiunto al daemon il cui log sia stato dimenticato qui — quella lista serve solo a poter creare
# il symlink anche PRIMA che il file esista (con il messaggio "non ancora presente"), per un file
# che già esiste basta il nome.
#
# Uso:
#   ./link-logs.sh [directory log sorgente]
# Default directory sorgente: /var/log/home-sentinel
#
# Rilancialo pure in futuro: sovrascrive senza chiedere conferma i
# symlink già presenti (ln -sf), non tocca altri file.

set -euo pipefail

SRC_DIR="${1:-/var/log/home-sentinel}"
DEST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

FILES=(lan_discovery.jsonl wifi_probes.jsonl ble_discovery.jsonl fingerprint_discovery.jsonl alerts_detection.jsonl wifi_traffic.jsonl wifi_networks.jsonl dhcp_leases.jsonl trend_daily.jsonl os_fingerprint.jsonl dhcp_events.jsonl ble_identity_links.jsonl ble_presence.jsonl deep_port_scan.jsonl handshake_captures.jsonl wifi_presence.jsonl daemon_config.jsonl ipv6_neighbors.jsonl exposure_audit.jsonl heartbeat.jsonl)

for f in "${FILES[@]}"; do
  src="$SRC_DIR/$f"
  dest="$DEST_DIR/$f"
  ln -sf "$src" "$dest"
  if [ -e "$src" ]; then
    echo "OK   $f -> $src"
  else
    echo "..   $f -> $src (non ancora presente: verrà servito appena il modulo relativo scrive la prima riga)"
  fi
done

# Seconda passata: qualunque altro .jsonl già scritto in SRC_DIR ma non nell'elenco sopra — un
# modulo nuovo il cui log non è ancora stato aggiunto a FILES (la lista sopra esiste solo per
# poter creare il symlink ANCHE prima che il file esista, con il messaggio "non ancora presente";
# per un file che già esiste basta il nome). Senza questa passata, dimenticare di aggiornare FILES
# per un nuovo modulo farebbe sparire silenziosamente il suo log dalla dashboard servita da qui,
# esattamente il tipo di disallineamento capitato altrove nel progetto (es. MODULE_META).
shopt -s nullglob
for src in "$SRC_DIR"/*.jsonl; do
  f="$(basename "$src")"
  if [[ ! " ${FILES[*]} " == *" $f "* ]]; then
    ln -sf "$src" "$DEST_DIR/$f"
    echo "NEW  $f -> $src (non nell'elenco noto di questo script — aggiungilo a FILES qui sopra se è un modulo stabile)"
  fi
done
shopt -u nullglob

echo
echo "Fatto. Servi questa cartella con:"
echo "  cd \"$DEST_DIR\" && python3 -m http.server 8080"
