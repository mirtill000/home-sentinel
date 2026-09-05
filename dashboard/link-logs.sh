#!/usr/bin/env bash
# Crea, in questa cartella, symlink verso i log JSON Lines scritti dal
# daemon (di default in /var/log/home-sentinel/), così i percorsi di
# default della dashboard (lan_discovery.jsonl, wifi_probes.jsonl,
# ble_discovery.jsonl, fingerprint_discovery.jsonl, alerts_detection.jsonl,
# wifi_traffic.jsonl, wifi_networks.jsonl, dhcp_leases.jsonl,
# trend_daily.jsonl, os_fingerprint.jsonl, dhcp_events.jsonl,
# ble_identity_links.jsonl, ble_presence.jsonl) funzionano subito quando la
# si serve da qui (es. python3 -m http.server), senza toccare Impostazioni
# né passare parametri via URL.
#
# dhcp_leases/trend_daily/os_fingerprint/dhcp_events sono prodotti dai moduli
# opzionali di discovery avanzata (--dhcp-discovery, --os-fingerprint,
# --dhcp-lease-source) e dal trend rollup (attivo di default salvo
# --no-trend-rollup); ble_identity_links dai suggerimenti di collegamento
# identità BLE (attivi di default insieme a --ble, salvo
# --no-ble-identity-linking); ble_presence dal tracking presenza/assenza
# BLE (--ble-home-macs). Finché il modulo relativo non è attivo sul daemon,
# il file resta semplicemente assente.
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

FILES=(lan_discovery.jsonl wifi_probes.jsonl ble_discovery.jsonl fingerprint_discovery.jsonl alerts_detection.jsonl wifi_traffic.jsonl wifi_networks.jsonl dhcp_leases.jsonl trend_daily.jsonl os_fingerprint.jsonl dhcp_events.jsonl ble_identity_links.jsonl ble_presence.jsonl)

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

echo
echo "Fatto. Servi questa cartella con:"
echo "  cd \"$DEST_DIR\" && python3 -m http.server 8080"
