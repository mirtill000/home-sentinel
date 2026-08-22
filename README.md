# Home Sentinel

Daemon Python per la discovery continua dei dispositivi sulla rete locale
(ARP scan + hostname + vendor + port scan), l'ascolto passivo dei probe
request WiFi (richiede un adattatore WiFi esterno capace di monitor mode:
il WiFi onboard del Raspberry Pi 3 non lo supporta bene) e lo scan passivo
dei device BLE nei dintorni (qui invece basta il Bluetooth 4.1 LE onboard
del Pi 3, nessun adattatore esterno necessario).

Ogni evento viene appeso in tempo reale a file **JSON Lines** separati
(un oggetto JSON per riga, uno per modulo), senza bisogno di un database.

## Installazione

```bash
sudo apt install python3-pip iw iproute2 bluetooth
pip install -r requirements.txt
```

`iw` e `iproute2` sono necessari solo se si usa `--wifi-iface`; `bluetooth`
(BlueZ) solo se si usa `--ble` — su Raspberry Pi OS è già preinstallato.
`bleak` (in `requirements.txt`) serve solo per `--ble`: se non ti interessa
il modulo BLE puoi anche non installarlo, il resto del daemon funziona lo
stesso.

## Uso

Solo discovery LAN:

```bash
sudo python3 home_sentinel.py --subnet 192.168.1.0/24
```

Con anche il monitor probe WiFi su un'interfaccia già in monitor mode
(o con `--auto-monitor` per provare a impostarla automaticamente) e lo
scan BLE sull'adattatore Bluetooth di sistema:

```bash
sudo python3 home_sentinel.py \
    --subnet 192.168.1.0/24 \
    --wifi-iface wlan1 \
    --auto-monitor \
    --ble
```

Va eseguito come root (necessario per ARP scan, sniffing 802.11 raw e,
tipicamente, per lo scan BLE via BlueZ).

## Output

Tutti e tre i file sono **JSON Lines**: un oggetto JSON per riga, senza
header. Una riga troncata da una scrittura interrotta (crash, spegnimento
improvviso) viene semplicemente ignorata da un parser JSONL a valle, con la
stessa resilienza di un CSV con l'ultima riga incompleta.

Di default scrivono tutti in **`/var/log/home-sentinel/`**
(`--lan-log`/`--probe-log`/`--ble-log` per un percorso diverso); la directory
viene creata automaticamente al primo avvio se non esiste già (il daemon
gira come root).

**`lan_discovery.jsonl`**: `{timestamp, status, ip, mac, hostname, vendor, open_ports}`
Una riga per ogni device visto ad ogni ciclo di scan (`status=new|online`),
più una riga `status=offline` la prima volta che un device smette di
rispondere. `open_ports` è un array di interi (es. `[22, 80]`), non una
stringa.

**`probe_discovery.jsonl`**: `{timestamp, mac, vendor, ssid, rssi, channel}`
Una riga per ogni probe request 802.11 catturato durante il channel
hopping. `rssi` è un numero, oppure `null` se il radiotap non lo riporta.

**`ble_discovery.jsonl`**: `{timestamp, mac, name, rssi, tx_power, manufacturer_ids, service_uuids}`
Una riga per ogni advertisement BLE ricevuto durante lo scan passivo.
`name` è la stringa pubblicizzata dal device (vuota se non presente),
`manufacturer_ids` un array di company ID Bluetooth SIG (es. `76` = Apple),
`service_uuids` un array di UUID dei servizi GATT annunciati. `tx_power`
è `null` se il device non lo include nell'advertisement.

## Dashboard

`dashboard/` è una web app statica (HTML/CSS/JS, senza dipendenze esterne,
utilizzabile offline) con 10 sezioni, tutte basate sui dati reali dei log
LAN, WiFi e BLE:

- **Dashboard** — KPI (host attivi, probe WiFi 24h, dispositivi nuovi),
  widget "Dispositivi nei dintorni" (euristica su segnale forte + presenza
  ripetuta, incrociando probe WiFi e BLE), distribuzione per vendor e per
  stato, attività di rete 24h, tabella host.
- **Host** — elenco completo dei dispositivi LAN con dettaglio e cronologia
  delle rilevazioni per singolo MAC.
- **Mappa rete** — topologia schematica (a stella) attorno al gateway
  configurato in Impostazioni.
- **Scansioni** — cronologia dei cicli di discovery LAN ricostruita dal log.
- **WiFi** — KPI (probe 24h, MAC distinti, % con SSID, RSSI medio, vendor
  noti), attività oraria, top vendor (da OUI del MAC), widget di
  correlazione MAC/vendor/SSID cercati, elenco probe grezzi.
- **BLE** — KPI (advertisement 24h, MAC distinti, % con nome, RSSI medio,
  manufacturer noti), attività oraria, top manufacturer (da company ID
  Bluetooth SIG), elenco advertisement grezzi.
- **Avvisi** — nuovi dispositivi e porte potenzialmente a rischio (telnet,
  RDP, SMB, VNC, FTP) aperte sui device correnti; nessun dato è inventato.
- **Impostazioni** — sorgenti dati JSON Lines (URL o file locale), tema
  (Chiaro/Scuro/Sistema), intervallo di auto-refresh (1/5/15/30/60s o
  disattivato), etichetta del gateway usata in Mappa rete.
- **Esporta** — scarica dispositivi LAN, log completo, probe WiFi, scan BLE
  o avvisi in CSV o JSON.
- **Aiuto** — guida rapida e limiti noti.

Per usarla, servi la cartella `dashboard/` con un server statico qualsiasi.
Dato che il daemon scrive i log in `/var/log/home-sentinel/` (fuori dalla
cartella servita), il modo più semplice è linkarli dentro `dashboard/` con
lo script incluso, così i percorsi di default funzionano subito senza
toccare Impostazioni né passare parametri via URL:

```bash
cd dashboard
./link-logs.sh              # crea i symlink da /var/log/home-sentinel/
python3 -m http.server 8080
# poi apri http://<ip-del-pi>:8080/
```

Rilancia `./link-logs.sh` in futuro se serve (es. dopo aver abilitato un
modulo che prima non scriveva ancora); è idempotente, sovrascrive solo i
symlink che gestisce lui. Accetta anche una directory sorgente diversa da
`/var/log/home-sentinel` come primo argomento.

In alternativa apri `dashboard/index.html` direttamente come file locale e
carica i log dai campi "carica file locale" in Impostazioni (il fetch via
URL richiede invece un server, per via delle restrizioni CORS su `file://`).
I percorsi sono configurabili anche via query string, es.
`?lan=/log/lan_discovery.jsonl&wifi=/log/probe_discovery.jsonl`.

Il daemon attuale misura solo presenza e porte aperte, non traffico di rete:
la dashboard non mostra quindi metriche di banda.

## Note

- I MAC nei probe request WiFi sono spesso randomizzati dai dispositivi
  moderni (iOS 14+/Android 10+) quando non sono associati a una rete; lo
  stesso vale per gli indirizzi BLE (private random address), che tipicamente
  ruotano ogni 10-15 minuti. Entrambi i moduli vanno intesi come indicatore
  di attività/presenza nei dintorni, non come identificatore univoco
  affidabile di un dispositivo specifico nel tempo.
- I log generati contengono dati potenzialmente identificativi (MAC, IP,
  hostname) di dispositivi propri e altrui: non sono versionati (vedi
  `.gitignore`) e vanno trattati/conservati di conseguenza.
- Per l'esecuzione continua si consiglia systemd (vedi
  `systemd/home-sentinel.service`) piuttosto che una demonizzazione manuale.
