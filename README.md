# Home Sentinel

Daemon Python per la discovery continua dei dispositivi sulla rete locale
(ARP scan + hostname + vendor + port scan), l'ascolto passivo dei probe
request WiFi (richiede un adattatore WiFi esterno capace di monitor mode:
il WiFi onboard del Raspberry Pi 3 non lo supporta bene) e lo scan passivo
dei device BLE nei dintorni (qui invece basta il Bluetooth 4.1 LE onboard
del Pi 3, nessun adattatore esterno necessario).

Oltre alla discovery, include moduli opzionali di detection: fingerprinting
del *tipo* di device (mDNS/SSDP/NetBIOS/banner, non solo vendor da MAC OUI),
una baseline comportamentale per device con rilevamento anomalie (orari
insoliti, nuove porte aperte), e rilevamento di possibili attacchi di rete
(ARP spoofing, rogue DHCP, evil twin WiFi). Vedi "Moduli di detection" sotto.

Ogni evento viene appeso in tempo reale a file **JSON Lines** separati
(un oggetto JSON per riga, uno per modulo). Non serve un database per far
girare il daemon, ma è disponibile uno specchio **SQLite** opzionale (attivo
di default) per query storiche/aggregate senza dover riparsare i JSONL.

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
stringa. `hostname` viene risolto via reverse DNS e, se il device non ha un
PTR (comune per molti IoT/stampanti), con un secondo tentativo via query
NetBIOS diretta al device — resta comunque vuoto se nessuno dei due
risponde.

Il port scan (`--ports`) di default copre le porte **1-1024** ("well-known")
più **50 porte "alte"** comuni per servizi self-hosted/home-lab/IoT tipici
di una rete domestica (NAS, home automation, media server, dev/db — es.
`8080`, `8123` Home Assistant, `9100` stampanti di rete, `32400` Plex;
elenco completo in `COMMON_HIGH_PORTS` dentro `home_sentinel.py`), per un
totale di 1074 porte per device. Uno scan così ampio viene rifatto per lo
stesso device solo ogni ora (`--port-scan-interval`, default 3600s) per non
saturare la rete; un device appena scoperto viene invece scansionato subito,
indipendentemente dall'intervallo. Passa un elenco custom via `--ports` per
restringere o ampliare l'insieme.

**`wifi_probes.jsonl`**: `{timestamp, mac, vendor, ssid, rssi, channel}`
Una riga per ogni probe request 802.11 catturato durante il channel
hopping. `rssi` è un numero, oppure `null` se il radiotap non lo riporta.

**`ble_discovery.jsonl`**: `{timestamp, mac, name, rssi, tx_power, manufacturer_ids, service_uuids}`
Una riga per ogni advertisement BLE ricevuto durante lo scan passivo.
`name` è la stringa pubblicizzata dal device (vuota se non presente),
`manufacturer_ids` un array di company ID Bluetooth SIG (es. `76` = Apple),
`service_uuids` un array di UUID dei servizi GATT annunciati. `tx_power`
è `null` se il device non lo include nell'advertisement.

**`fingerprint_discovery.jsonl`** (con `--fingerprint`):
`{timestamp, mac, ip, device_type, services, ssdp, netbios_name, banners}`
Una riga per ogni fingerprint eseguito su un device LAN (alla prima
rilevazione e ad ogni port scan periodico). `device_type` è una
classificazione euristica (es. "Stampante", "Google Cast / Chromecast",
"PC/Server Windows (SMB)"); `services` i tipi di servizio mDNS trovati,
`ssdp` gli header SSDP/UPnP di risposta, `banners` i banner raccolti sulle
porte aperte (chiave = porta).

**`alerts_detection.jsonl`**:
`{timestamp, severity, type, mac, ip, message, details}`
Una riga per ogni alert generato dai moduli di detection (vedi sotto).
`severity` è `low`/`medium`/`high`, `type` un codice macchina (es.
`possibile_arp_spoofing`, `nuova_porta`,
`possibile_rogue_dhcp`, `possibile_evil_twin`).

## Moduli di detection

Tutti scrivono su `alerts_detection.jsonl` (e, se attivo, sullo specchio
SQLite) invece che sulla console soltanto, così restano consultabili anche
a posteriori:

- **Anomaly detection** (attivo di default, `--no-anomaly-detection` per
  disabilitarlo): costruisce per ogni MAC una baseline delle porte
  normalmente aperte; segnala nuove porte aperte su un device già noto. La
  baseline è persistita su SQLite e sopravvive ai riavvii del daemon.
- **Rilevamento conflitti ARP/IP** (attivo di default,
  `--no-arp-detection` per disabilitarlo): segnala quando due MAC diversi,
  entrambi risultanti online, rivendicano lo stesso IP nello stesso ciclo
  di scan — indicatore tipico di ARP spoofing/poisoning. Una normale
  riassegnazione DHCP (il vecchio device va offline prima che l'IP venga
  riassegnato) non genera alert.
- **Rogue DHCP** (`--detect-rogue-dhcp`, opzionale): sniffing passivo di
  DHCPOFFER/DHCPACK sull'interfaccia LAN; se non si specifica
  `--dhcp-trusted-servers` impara il primo server osservato come fidato e
  segnala ogni server diverso visto in seguito.
- **Evil twin WiFi** (`--home-ssid`, richiede `--wifi-iface` già attivo):
  osserva i beacon 802.11 catturati durante il channel hopping e segnala
  un SSID monitorato trasmesso da un BSSID mai visto prima.
- **Fingerprinting device** (`--fingerprint`, opzionale): esegue mDNS,
  SSDP/UPnP, query NetBIOS e banner grabbing sulle porte aperte di ogni
  device LAN per classificarne il tipo, oltre al solo vendor da MAC OUI.
  Genera traffico di rete aggiuntivo (sonde attive), per questo è opt-in;
  gira solo alla prima rilevazione di un device e ad ogni port scan
  periodico, non ad ogni ciclo.

## Dashboard

`dashboard/` è una web app statica (HTML/CSS/JS, senza dipendenze esterne,
utilizzabile offline) con 11 sezioni, tutte basate sui dati reali dei log
LAN, WiFi, BLE e, se i moduli opzionali sono attivi sul daemon, fingerprint
e alert di detection. In qualsiasi punto della dashboard, **Ctrl+K** (⌘K su
Mac) apre una ricerca globale su pagine, dispositivi e avvisi; ogni tabella
ha un selettore "righe per pagina" (50/100/200/500/tutte) e uno scorrimento
pagine:

- **Dashboard** — KPI (host attivi, probe WiFi 24h, dispositivi nuovi,
  alert attivi), distribuzione per rischio e ultimi avvisi, widget
  "Dispositivi nei dintorni" (card compatte con segnale a barre e presenza
  ripetuta, incrociando probe WiFi e BLE — niente più MAC in primo piano,
  poco utile per un device esterno), tabella host, distribuzione per
  vendor/stato, attività di rete 24h.
- **Host** — elenco completo dei dispositivi LAN, con tipo di device (se
  `--fingerprint` è attivo) e punteggio di rischio 0-100 (euristica su porte
  esposte e alert collegati); il nome host apre il **profilo completo** del
  dispositivo (cronologia LAN, probe WiFi, advertisement BLE, alert e
  fingerprint riuniti in un'unica vista).
- **Scansioni** — cronologia dei cicli di discovery LAN ricostruita dal log.
- **Timeline** — feed cronologico unificato degli eventi notevoli (nuovi
  device, offline, alert, fingerprint), filtrabile per categoria.
- **WiFi** — KPI (probe 24h, MAC distinti, % con SSID, RSSI medio, vendor
  noti), attività oraria, distribuzione per canale, top vendor, dispositivi
  che cercano una rete specifica (aggregato), log probe grezzo.
- **BLE** — KPI (advertisement 24h, MAC distinti, % con nome, RSSI medio,
  manufacturer noti), attività oraria, top manufacturer, **top 10
  dispositivi più ricorrenti** (per numero di avvistamenti), log
  advertisement grezzo.
- **Avvisi** — nuovi dispositivi e porte potenzialmente a rischio (telnet,
  RDP, SMB, VNC, FTP) aperte sui device correnti, calcolati dalla dashboard
  stessa; più gli alert generati dai moduli di detection del daemon
  (`alerts_detection.jsonl`, se presente) — ARP spoofing, rogue DHCP, evil
  twin WiFi, anomalie comportamentali. Filtrabili per tipologia e stato, con
  combinazioni di filtri salvabili come preset. Nessun dato è inventato.
- **Trend** — andamento di nuovi dispositivi e alert negli ultimi 7/30
  giorni (grafici giornalieri + variazione % vs periodo precedente),
  calcolato lato browser sulla cronologia già caricata dai JSONL.
- **Impostazioni** — pannello di stato dei moduli daemon (dedotto dai dati
  effettivamente caricati: attivo / nessun dato / non rilevato), sorgenti
  dati JSON Lines (URL o file locale), tema (Chiaro/Scuro/Sistema),
  intervallo di auto-refresh (1/5/15/30/60s o disattivato).
- **Esporta** — scarica dispositivi LAN, log completo, probe WiFi, scan
  BLE, fingerprint device o avvisi in CSV o JSON.
- **Aiuto** — guida rapida e limiti noti.

**"Mappa rete" è momentaneamente nascosta dalla navigazione**: su una rete
piatta a singolo segmento la topologia a stella non aggiunge informazione
reale rispetto alla tabella Host. Il codice resta nel repository (non è
stato cancellato) — va reinserita nell'array `ROUTES` di `dashboard/app.js`
per riabilitarla quando avrà senso (subnet/VLAN multiple).

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
`?lan=/log/lan_discovery.jsonl&wifi=/log/wifi_probes.jsonl`.

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
