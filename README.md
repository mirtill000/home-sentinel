# Home Sentinel

Daemon Python per la discovery continua dei dispositivi sulla rete locale
(ARP scan + hostname + vendor + port scan) e per l'ascolto passivo dei
probe request WiFi dei dispositivi nelle vicinanze (richiede un adattatore
WiFi esterno capace di monitor mode: il WiFi onboard del Raspberry Pi 3
non lo supporta bene).

Ogni evento viene appeso in tempo reale a due file **JSON Lines** separati
(un oggetto JSON per riga), senza bisogno di un database.

## Installazione

```bash
sudo apt install python3-pip iw iproute2
pip install -r requirements.txt
```

`iw` e `iproute2` sono necessari solo se si usa `--wifi-iface`.

## Uso

Discovery LAN, senza probe WiFi:

```bash
sudo python3 home_sentinel.py --subnet 192.168.1.0/24
```

Con anche il monitor probe WiFi su un'interfaccia già in monitor mode
(o con `--auto-monitor` per provare a impostarla automaticamente):

```bash
sudo python3 home_sentinel.py \
    --subnet 192.168.1.0/24 \
    --wifi-iface wlan1 \
    --auto-monitor
```

Va eseguito come root (necessario per ARP scan e sniffing 802.11 raw).

## Output

Entrambi i file sono **JSON Lines**: un oggetto JSON per riga, senza header.
Una riga troncata da una scrittura interrotta (crash, spegnimento improvviso)
viene semplicemente ignorata da un parser JSONL a valle, con la stessa
resilienza di un CSV con l'ultima riga incompleta.

**`lan_discovery.jsonl`**: `{timestamp, status, ip, mac, hostname, vendor, open_ports}`
Una riga per ogni device visto ad ogni ciclo di scan (`status=new|online`),
più una riga `status=offline` la prima volta che un device smette di
rispondere. `open_ports` è un array di interi (es. `[22, 80]`), non una
stringa.

**`wifi_probes.jsonl`**: `{timestamp, mac, vendor, ssid, rssi, channel}`
Una riga per ogni probe request 802.11 catturato durante il channel
hopping. `rssi` è un numero, oppure `null` se il radiotap non lo riporta.

## Dashboard

`dashboard/` è una web app statica (HTML/CSS/JS, senza dipendenze esterne,
utilizzabile offline) con 8 sezioni, tutte basate sui dati reali dei due log
JSON Lines:

- **Dashboard** — KPI (host attivi, probe WiFi 24h, dispositivi nuovi, avvisi
  attivi), distribuzione per vendor e per stato, attività di rete 24h, tabella
  host.
- **Host** — elenco completo dei dispositivi LAN con dettaglio e cronologia
  delle rilevazioni per singolo MAC.
- **Mappa rete** — topologia schematica (a stella) attorno al gateway
  configurato in Impostazioni.
- **Scansioni** — cronologia dei cicli di discovery LAN ricostruita dal log,
  più il log grezzo dei probe WiFi.
- **Avvisi** — nuovi dispositivi e porte potenzialmente a rischio (telnet,
  RDP, SMB, VNC, FTP) aperte sui device correnti; nessun dato è inventato.
- **Impostazioni** — sorgenti dati JSON Lines (URL o file locale), tema
  (Chiaro/Scuro/Sistema), intervallo di auto-refresh (1/5/15/30/60s o
  disattivato), informazioni di rete mostrate in sidebar.
- **Esporta** — scarica dispositivi LAN, log completo, probe WiFi o avvisi
  in CSV o JSON.
- **Aiuto** — guida rapida e limiti noti.

Per usarla, servi la cartella `dashboard/` (o copia/linka i file `.jsonl` al
suo interno) con un server statico qualsiasi:

```bash
cd dashboard
python3 -m http.server 8080
# poi apri http://<ip-del-pi>:8080/
```

In alternativa apri `dashboard/index.html` direttamente come file locale e
carica i log dai campi "carica file locale" in Impostazioni (il fetch via
URL richiede invece un server, per via delle restrizioni CORS su `file://`).
I percorsi sono configurabili anche via query string, es.
`?lan=/log/lan_discovery.jsonl&wifi=/log/wifi_probes.jsonl`.

Il daemon attuale misura solo presenza e porte aperte, non traffico di rete:
la dashboard non mostra quindi metriche di banda.

## Note

- I MAC nei probe request sono spesso randomizzati dai dispositivi moderni
  (iOS 14+/Android 10+) quando non sono associati a una rete: il modulo
  WiFi va inteso come indicatore di attività/presenza nei dintorni, non
  come identificatore univoco affidabile.
- I log generati contengono dati potenzialmente identificativi (MAC, IP,
  hostname) di dispositivi propri e altrui: non sono versionati (vedi
  `.gitignore`) e vanno trattati/conservati di conseguenza.
- Per l'esecuzione continua si consiglia systemd (vedi
  `systemd/home-sentinel.service`) piuttosto che una demonizzazione manuale.
