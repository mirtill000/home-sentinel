#!/usr/bin/env bash
# Crea, in questa cartella, symlink verso i log JSON Lines scritti dal
# daemon (di default in /var/log/home-sentinel/), così i percorsi di
# default della dashboard (lan_discovery.jsonl, probe_discovery.jsonl,
# ble_discovery.jsonl) funzionano subito quando la si serve da qui
# (es. python3 -m http.server), senza toccare Impostazioni né passare
# parametri via URL.
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

FILES=(lan_discovery.jsonl probe_discovery.jsonl ble_discovery.jsonl)

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
