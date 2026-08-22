# Home Sentinel

Daemon Python per la discovery continua dei dispositivi sulla rete locale
(ARP scan + hostname + vendor + port scan) e per l'ascolto passivo dei
probe request WiFi dei dispositivi nelle vicinanze (richiede un adattatore
WiFi esterno capace di monitor mode: il WiFi onboard del Raspberry Pi 3
non lo supporta bene).

Ogni evento viene appeso in tempo reale a due file CSV separati, senza
bisogno di un database.

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

**`lan_discovery.csv`**: `timestamp, status, ip, mac, hostname, vendor, open_ports`
Una riga per ogni device visto ad ogni ciclo di scan (`status=new|online`),
più una riga `status=offline` la prima volta che un device smette di
rispondere. `open_ports` è una lista separata da `;`.

**`wifi_probes.csv`**: `timestamp, mac, vendor, ssid, rssi, channel`
Una riga per ogni probe request 802.11 catturato durante il channel
hopping.

## Dashboard

`dashboard/` è una web app statica (HTML/CSS/JS, senza dipendenze esterne,
utilizzabile offline) con 8 sezioni, tutte basate sui dati reali dei due CSV:

- **Dashboard** — KPI (host attivi, probe WiFi 24h, dispositivi nuovi, avvisi
  attivi), distribuzione per vendor e per stato, attività di rete 24h, tabella
  host.
- **Host** — elenco completo dei dispositivi LAN con dettaglio e cronologia
  delle rilevazioni per singolo MAC.
- **Mappa rete** — topologia schematica (a stella) attorno al gateway
  configurato in Impostazioni.
- **Scansioni** — cronologia dei cicli di discovery LAN ricostruita dal CSV,
  più il log grezzo dei probe WiFi.
- **Avvisi** — nuovi dispositivi e porte potenzialmente a rischio (telnet,
  RDP, SMB, VNC, FTP) aperte sui device correnti; nessun dato è inventato.
- **Impostazioni** — sorgenti CSV (URL o file locale), informazioni di rete
  mostrate in sidebar, tema.
- **Esporta** — scarica dispositivi LAN, log completo, probe WiFi o avvisi
  in CSV/JSON.
- **Aiuto** — guida rapida e limiti noti.

Per usarla, servi la cartella `dashboard/` (o copia/linka i CSV al suo
interno) con un server statico qualsiasi:

```bash
cd dashboard
python3 -m http.server 8080
# poi apri http://<ip-del-pi>:8080/
```

In alternativa apri `dashboard/index.html` direttamente come file locale e
carica i CSV dai campi "carica file locale" in Impostazioni (il fetch via
URL richiede invece un server, per via delle restrizioni CORS su `file://`).
I percorsi dei CSV sono configurabili anche via query string, es.
`?lan=/log/lan_discovery.csv&wifi=/log/wifi_probes.csv`.

Il daemon attuale misura solo presenza e porte aperte, non traffico di rete:
la dashboard non mostra quindi metriche di banda.

## Note

- I MAC nei probe request sono spesso randomizzati dai dispositivi moderni
  (iOS 14+/Android 10+) quando non sono associati a una rete: il modulo
  WiFi va inteso come indicatore di attività/presenza nei dintorni, non
  come identificatore univoco affidabile.
- I CSV generati contengono dati potenzialmente identificativi (MAC, IP,
  hostname) di dispositivi propri e altrui: non sono versionati (vedi
  `.gitignore`) e vanno trattati/conservati di conseguenza.
- Per l'esecuzione continua si consiglia systemd (vedi
  `systemd/home-sentinel.service`) piuttosto che una demonizzazione manuale.
