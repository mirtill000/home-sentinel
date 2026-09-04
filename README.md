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
insoliti, nuove porte aperte), rilevamento di possibili attacchi di rete
(ARP spoofing, rogue DHCP, evil twin WiFi, deauth/disassoc flood WiFi) e una
stima del traffico WiFi per device. Vedi "Moduli di detection" sotto.

Ogni evento viene appeso in tempo reale a file **JSON Lines** separati
(un oggetto JSON per riga, uno per modulo). Non serve un database per far
girare il daemon, ma è disponibile uno specchio **SQLite** opzionale (attivo
di default) per query storiche/aggregate senza dover riparsare i JSONL —
e, se attivo, anche per ripristinare lo stato noto di ogni device
(hostname, vendor, porte aperte) all'avvio: senza, un riavvio del daemon
farebbe ripartire ogni device "da zero", con la colonna porte aperte
vuota in dashboard finché non arriva un nuovo port scan.

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

Ogni file viene **ruotato in stile logrotate** una volta superati
**20MB** (`--max-log-size-mb`, `0` per disabilitare) — il file corrente
diventa `<nome>.1.jsonl`, quello più vecchio `<nome>.2.jsonl` e così via
fino a `--log-backup-count` (default 3) copie conservate, poi la più
vecchia viene eliminata. Il file "vivo" resta sempre allo stesso percorso,
quindi i symlink creati da `dashboard/link-logs.sh` restano validi dopo
ogni rotazione. `wifi_probes.jsonl` in particolare — il log più "rumoroso", un probe WiFi
per ogni dispositivo nei dintorni — può arrivare a diversi MB al giorno su
una rete affollata: la rotazione evita che cresca senza limite.

**`lan_discovery.jsonl`**: `{timestamp, status, ip, mac, hostname, vendor, open_ports}`
Una riga per ogni device visto ad ogni ciclo di scan (`status=new|online`),
più una riga `status=offline` la prima volta che un device smette di
rispondere (qui `open_ports` è sempre `[]`: un device che non risponde non
ha una porta "attualmente aperta" da riportare). `open_ports` è un array
di interi (es. `[22, 80]`), non una stringa: riporta l'esito dell'ultimo
port scan effettivamente eseguito per quel device, non necessariamente di
*questo* ciclo — il port scan gira una volta ogni `--port-scan-interval`
(default 3600s), molto meno spesso del ciclo di scan LAN (`--interval`,
default 60s), quindi ogni riga `new`/`online` riporta l'ultimo elenco noto
finché non ne arriva uno più recente, esattamente come già fa per
`hostname`/`vendor`. Questo stato noto sopravvive anche a un riavvio del
daemon (se lo specchio SQLite è attivo, di default lo è): all'avvio
`LanDiscoveryService` ripristina hostname/vendor/porte dall'ultima riga
vista per ogni MAC, così un device già noto non appare come "mai visto
prima" e la dashboard non perde temporaneamente i dati già disponibili —
il port scan riparte comunque subito per ogni device (l'ultimo istante di
scan reale non è recuperabile in modo affidabile dal solo storico), ma nel
frattempo la colonna porte in dashboard mostra già l'ultimo elenco noto
invece di restare vuota. `hostname` viene risolto in ordine di priorità da: (1) l'hostname
dichiarato via DHCP se osservato passivamente (`--dhcp-discovery`, vedi
sotto — spesso il più affidabile, dichiarato dal client stesso); (2) reverse
DNS; (3) query NetBIOS diretta al device; (4) il nome mDNS del device se
`--fingerprint` è attivo e ha trovato qualcosa in quel ciclo di port scan
(vedi `fingerprint_discovery.jsonl` sotto) — resta vuoto se nessuna delle
quattro fonti dà risultato.

Il ciclo di scan normalmente segue `--interval` (default 60s), ma con
`--dhcp-discovery` attivo un MAC mai visto prima innesca una rescan
immediata invece di aspettare il prossimo ciclo, per accorciare la latenza
di rilevamento di un device davvero nuovo.

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
`{timestamp, mac, ip, device_type, services, ssdp, netbios_name, mdns_name, banners}`
Una riga per ogni fingerprint eseguito su un device LAN (alla prima
rilevazione e ad ogni port scan periodico). `device_type` è una
classificazione euristica in inglese, per coerenza con la dashboard che la
mostra così com'è (es. "Printer", "Google Cast / Chromecast",
"Windows PC/server (SMB)"); `services` i tipi di servizio mDNS trovati,
`ssdp` gli header SSDP/UPnP di risposta, `mdns_name` il nome "amichevole"
del device se trovato via mDNS (es. "Cucina Alexa" — richiede fino a due
query mDNS, vedi `sentinel_fingerprint.py`), `banners` i banner raccolti
sulle porte aperte (chiave = porta).

**`dhcp_events.jsonl`** (`--dhcp-discovery`, indipendente da `--detect-rogue-dhcp`
ma sullo stesso sniff loop DHCP su `--dhcp-iface`):
`{timestamp, event, mac, hostname, requested_ip}`
Una riga per ogni DHCPDISCOVER/DHCPREQUEST osservato passivamente
(`event=discover|request`). `hostname` è quello dichiarato dal client
(opzione DHCP 12, spesso vuota se il client non la invia). Alimenta anche
`lan_discovery.jsonl` (priorità sull'hostname, vedi sopra) e la rescan LAN
immediata su un MAC nuovo.

**`os_fingerprint.jsonl`** (`--os-fingerprint`, sniffing passivo su `--lan-iface`):
`{timestamp, mac, ip, ttl, window, os_guess}`
Una riga per MAC (non più di una ogni `--os-fingerprint-interval` secondi,
default 300s), da pacchetti TCP con flag SYN (SYN o SYN-ACK) — inclusi i
SYN-ACK di risposta al port scan attivo già in corso, nessuna sonda
aggiuntiva. `os_guess` è un'**euristica grezza** sul solo TTL IP (vedi
`guess_os_from_ttl` in `home_sentinel.py`): sulla stessa subnet L2 il TTL
osservato coincide con quello di partenza del device (nessun router nel
mezzo lo decrementa), ma più sistemi condividono lo stesso valore iniziale
(64 è il default sia di Linux sia di macOS/Android/iOS), quindi resta un
indizio, non un'identificazione certa — non è un p0f completo, nessun
database di firme. `window` è salvato per riferimento ma non entra
nell'euristica (troppo sensibile a window scaling/configurazioni custom).

**`dhcp_leases.jsonl`** (`--dhcp-lease-source`):
`{timestamp, mac, ip, hostname, arp_confirmed}`
Cross-check periodico (`--dhcp-lease-poll-interval`, default 300s) tra la
tabella lease del router e l'ultimo ciclo di ARP scan: una riga per lease,
con `arp_confirmed=false` se quel MAC non ha risposto all'ARP scan più
recente (può essere spento/addormentato/firewallato, non necessariamente
un problema — vedi il modulo di detection più sotto per cosa invece *è*
un alert). Non esiste un'API universale per leggere le lease di un router
qualsiasi: `--dhcp-lease-source` accetta un path locale o un URL http(s),
`--dhcp-lease-format` il formato — `dnsmasq` (il formato nativo
`dnsmasq.leases`, usato da molti router OpenWrt/pfSense/Pi-hole, o dal
Pi stesso se ci gira dnsmasq), `json` (un array generico
`[{"mac": ..., "ip": ..., "hostname": ...}, ...]`, per router che non
espongono dnsmasq.leases — un piccolo script/cron lato router, se
supportato, può convertire le proprie lease in questo formato e
pubblicarle su un file letto dal Pi via rete o URL), `auto` (default,
indovina dal contenuto).

**`trend_daily.jsonl`** (attivo di default se lo specchio SQLite lo è,
`--no-trend-rollup` per disabilitarlo): `{date, new_devices, alerts}`
Conteggi giornalieri (nuovi device, alert) ricalcolati ogni
`--trend-rollup-interval` secondi (default 3600) dall'intero storico in
SQLite, non dai soli JSONL grezzi. Esiste per un motivo preciso: oltre una
certa dimensione la dashboard scarica solo la coda dei JSONL
(`TAIL_FETCH_BYTES` lato dashboard) e il daemon li ruota oltre
`--max-log-size-mb` — su una rete affollata (`wifi_probes.jsonl` in
particolare) il grafico "Trend" a 30 giorni può quindi risultare
incompleto ben prima che quei dati siano davvero scomparsi, solo non più
nella coda scaricata. Una riga per data per ogni giro in cui il conteggio
di quel giorno è cambiato (un giorno passato, una volta scritto, non
cambia più: solo "oggi" viene riscritto finché il conteggio cresce) — la
dashboard prende l'ultima riga per data, il file resta piccolo (poche
righe al giorno) anche su mesi di storico.

**`alerts_detection.jsonl`**:
`{timestamp, severity, type, mac, ip, message, details}`
Una riga per ogni alert generato dai moduli di detection (vedi sotto).
`severity` è `low`/`medium`/`high`, `type` un codice macchina (es.
`possibile_arp_spoofing`, `nuova_porta`,
`possibile_rogue_dhcp`, `possibile_evil_twin`, `possibile_deauth_flood`).

**`wifi_traffic.jsonl`** (con `--wifi-iface`, salvo `--no-wifi-traffic`):
`{timestamp, mac, bytes, frames, interval_s}`
Una riga per device per ogni intervallo di aggregazione (`--wifi-traffic-interval`,
default 60s): somma dei byte e conteggio dei frame dati 802.11 (`addr2` come
mittente) catturati durante il channel hopping in quell'intervallo. È una
**stima relativa**, non banda reale: il Pi non è il gateway, quindi vede solo
i frame transitati sul canale su cui si trovava in quel momento durante
l'hopping, non tutto il traffico del device. Utile per confrontare device tra
loro (chi trasmette di più), non per misurare Mbps effettivi.

**`wifi_networks.jsonl`** (con `--wifi-iface`, salvo `--no-wifi-networks`):
`{timestamp, bssid, ssid, vendor, rssi, channel, security}`
Una riga per rete WiFi realmente rilevata, non più di una ogni
`--wifi-networks-interval` secondi per BSSID (default 30s, per non
saturare il log: un AP trasmette beacon più volte al secondo). A
differenza del `channel` in `wifi_probes.jsonl` (quello dello sniffer, non
della rete), qui è reale: dichiarato dall'AP stesso nel beacon (DS
Parameter Set) o, in sua assenza, quello su cui lo sniffer si trovava
mentre lo riceveva — comunque affidabile, perché un beacon si riceve solo
restando sintonizzati sul canale dell'AP che lo trasmette (a differenza
di un probe request, che non contiene alcuna informazione sul canale
della rete cercata). `security` è la classificazione del tipo di
sicurezza dal beacon stesso — `open` (bit Privacy della Capability Info a
0, nessuna cifratura), `wep` (Privacy attivo ma nessun IE RSN/WPA —
cifratura legacy), `wpa` (IE vendor-specific WPA1), `wpa2_wpa3` (IE RSN —
WPA2 e WPA3 condividono lo stesso formato di IE, distinguerli richiederebbe
analizzare le AKM suite, non fatto perché non necessario per il filtro
Open/cifrata della dashboard) — usata dal filtro "Security" della tabella
"Adjacent networks".

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
- **Log reti WiFi adiacenti** (attivo di default quando `--wifi-iface` è in
  uso, `--no-wifi-networks` per disabilitarlo): non è un vero e proprio
  detector di sicurezza, ma usa la stessa cattura beacon dell'evil twin
  (indipendentemente da `--home-ssid`) per loggare su `wifi_networks.jsonl`
  ogni rete WiFi realmente rilevata nei dintorni — la pagina "Dashboard"
  la mostra come categoria distinta dagli "SSID cercati" (che non
  sono reti realmente presenti, solo richieste dai client).
- **Fingerprinting device** (`--fingerprint`, opzionale): esegue mDNS,
  SSDP/UPnP, query NetBIOS e banner grabbing sulle porte aperte di ogni
  device LAN per classificarne il tipo, oltre al solo vendor da MAC OUI.
  Genera traffico di rete aggiuntivo (sonde attive), per questo è opt-in;
  gira solo alla prima rilevazione di un device e ad ogni port scan
  periodico, non ad ogni ciclo.
- **Deauth/disassoc flood WiFi** (attivo di default quando `--wifi-iface` è
  in uso, `--no-deauth-detection` per disabilitarlo): conta i frame 802.11
  di tipo deauthentication/disassociation catturati durante il channel
  hopping e segnala un possibile attacco quando ne osserva più di
  `--deauth-threshold` (default 10) in una finestra di `--deauth-window-seconds`
  (default 10s) — un singolo frame deauth è normale (disconnessione
  legittima), un burst no. Un cooldown di 60s tra un alert e il successivo
  evita di saturare il log durante un flood prolungato.
- **Stima traffico WiFi per device** (attiva di default quando
  `--wifi-iface` è in uso, `--no-wifi-traffic` per disabilitarla): somma la
  lunghezza dei frame dati 802.11 catturati per MAC mittente durante il
  channel hopping, aggregata ogni `--wifi-traffic-interval` secondi (default
  60) su `wifi_traffic.jsonl` e, se attivo, sullo specchio SQLite. È una
  stima relativa (vedi sopra), non una misura di banda reale.

## Moduli di discovery avanzata

A differenza dei moduli sopra, questi non generano alert (non sono
detector di sicurezza): arricchiscono la sola discovery — hostname più
affidabili, latenza minore su un device nuovo, un'euristica sul sistema
operativo, un cross-check con una fonte esterna al Pi:

- **DHCP client discovery** (`--dhcp-discovery`, opzionale, indipendente da
  `--detect-rogue-dhcp` ma sullo stesso sniff loop DHCP): osserva
  passivamente i DHCPDISCOVER/DHCPREQUEST dei client su `--dhcp-iface` per
  un hostname (opzione DHCP 12) spesso più affidabile del reverse DNS —
  dichiarato dal client stesso, non dipende da una registrazione dinamica
  lato router — e per una rescan LAN immediata quando compare un MAC mai
  visto, invece di aspettare il prossimo ciclo di `--interval`. Vedi
  `dhcp_events.jsonl` sopra.
- **OS fingerprint passivo** (`--os-fingerprint`, opzionale): euristica
  grezza sul sistema operativo dal TTL IP dei pacchetti TCP SYN/SYN-ACK già
  visibili su `--lan-iface` (inclusi i SYN-ACK di risposta al port scan
  attivo già in corso), nessuna sonda aggiuntiva. Onestamente etichettata
  come euristica, non un'identificazione certa — vedi `os_fingerprint.jsonl`
  sopra per i dettagli e i limiti.
- **Cross-check lease DHCP del router** (`--dhcp-lease-source`, opzionale):
  confronta periodicamente la tabella lease del router (dnsmasq.leases o un
  JSON generico, vedi `dhcp_leases.jsonl` sopra) con l'ultimo ciclo di ARP
  scan, per rilevare device presenti nelle lease ma silenziosi sull'ARP
  scan (spenti, addormentati, o firewallati contro ARP non richiesti — non
  necessariamente un problema, solo un dato in più).

## Dashboard

`dashboard/` è una web app statica (HTML/CSS/JS, senza dipendenze esterne,
utilizzabile offline) con 11 sezioni, tutte basate sui dati reali dei log
LAN, WiFi, BLE e, se i moduli opzionali sono attivi sul daemon, fingerprint
e alert di detection. **Dashboard è la home** (sottotitolo "Local network
overview"): è la prima voce del menu laterale e la pagina che si apre di
default (`dashboard/` senza `#/...` nell'URL). In cima, prima della
casetta isometrica, il KPI "host attivi"; più
giù, tra i pannelli sotto la mappa, un riepilogo compatto della pagina
Host (host totali/attivi/offline, distribuzione del rischio) con un
pulsante per aprire l'elenco completo. In qualsiasi punto della dashboard, **Ctrl+K**
(⌘K su Mac) apre una ricerca globale su pagine, dispositivi e avvisi; ogni
tabella ha un selettore "righe per pagina" (50/100/200/500/tutte) e uno
scorrimento pagine. Il menu laterale è collassabile (pulsante in fondo,
stato ricordato tra le sessioni) per lasciare più spazio alle pagine con
tabelle larghe, come Host; l'ordine delle voci è Dashboard, Host, WiFi,
BLE, Timeline, Scans, poi Avvisi/Trend/Impostazioni/Esporta/Aiuto.

Per i file JSONL oltre 4MB (tipicamente `wifi_probes.jsonl`, il più
"rumoroso"), la dashboard scarica solo la coda più recente via **HTTP
Range** invece dell'intero file — dato che i log sono append-only e in
ordine cronologico, la coda è esattamente "i dati più recenti". Richiede
che il server statico supporti le richieste Range (**nginx**: sì di
default; il semplice `python3 -m http.server` no — in quel caso si
ripiega in automatico sul download completo, senza errori, solo senza il
vantaggio di velocità). Quando succede, un avviso compare nella pagina
interessata e nel pannello "Stato moduli" in Impostazioni.

- **Host** — riga KPI (host totali, nuovi dispositivi, a rischio
  alto/critico), poi l'elenco completo dei dispositivi LAN, con tipo
  di device (se `--fingerprint` è attivo) e punteggio di rischio 0-100
  (euristica su porte esposte e alert collegati). Filtri per stato, tipo,
  vendor, livello di rischio, fidato/non fidato e presenza di porte aperte,
  più un interruttore **"Stale only"** per isolare i device offline da oltre
  30 giorni (evidenziati anche in tabella, attenuati con un badge "Stale").
  Il pulsante **"Columns"** aggiunge colonne opzionali — OS guess, nome
  mDNS, stato ARP (silenzioso sull'ultimo scan pur presente nella tabella
  lease del router), Uptime % e traffico WiFi stimato nelle ultime 24h —
  nascoste di default per non affollare la tabella. **"Group by identity"**
  unisce in un'unica riga i MAC collegati come stesso device fisico (con un
  chip "+N" sul MAC canonico). Le combinazioni di filtri sono salvabili come
  preset (come già per gli Avvisi); le caselle di selezione permettono di
  contrassegnare come fidati o esportare in CSV più host insieme. Il nome
  host apre il **profilo completo** del dispositivo (cronologia LAN, probe
  WiFi, advertisement BLE, alert e fingerprint riuniti in un'unica vista,
  più — se le relative fonti dati sono disponibili — nome mDNS ed euristica
  del sistema operativo, e un badge se il device compare nella tabella
  lease del router ma non risponde all'ultimo ARP scan). Da qui, o dal menu
  azioni di una riga, puoi assegnare un **nome personalizzato** a un device
  e contrassegnarlo come **fidato**: riduce il punteggio di rischio e la
  severità degli alert collegati (di un livello), senza nasconderli. Dal
  profilo del device puoi anche collegare **più MAC alla stessa identità
  fisica** ("stesso device come"), utile per un device con interfacce WiFi
  ed Ethernet separate o
  con MAC randomizzati: nome e stato "fidato" si condividono tra i MAC
  collegati; se un altro MAC ha lo stesso hostname e non è ancora
  collegato, un suggerimento scartabile propone l'unione (mai automatica).
  Sempre nel profilo, la sezione **Uptime** ricostruisce le sessioni
  online/offline del device dalle transizioni di stato già presenti nel
  log LAN (nessun dato nuovo raccolto, solo un modo diverso di guardare
  quello già scritto). Tutti questi dati sono salvati solo nel browser
  (`localStorage`), non richiedono modifiche al daemon.
- **Scansioni** — cronologia dei cicli di discovery LAN ricostruita dal log.
- **Timeline** — feed cronologico unificato degli eventi notevoli (nuovi
  device, offline, alert, fingerprint), filtrabile per categoria.
- **WiFi** — attività oraria e distribuzione per canale in cima, poi tre
  tabelle (tutte ricercabili e paginate, su tutta la cronologia caricata):
  **"SSID cercati"** — un riepilogo per nome di rete richiesto nei probe
  (non un elenco di reti fisicamente presenti, vedi sotto); click su una
  riga per vedere il dettaglio dei device che hanno richiesto quell'SSID
  (MAC, vendor, numero di probe, segnale medio, ultimo avvistamento) —
  **"Nearby WiFi devices"** — un riepilogo per MAC dei device esterni
  rilevati via probe (non presenti sulla LAN) — e **"Adjacent networks"**
  — le reti WiFi genuinamente rilevate dai loro beacon, filtrabili per
  **tipo di sicurezza** (Open/WEP/WPA/WPA2-WPA3, classificato dal daemon
  dal beacon stesso — richiede `--wifi-iface`) e per **banda** (2.4 vs
  5 GHz, dal canale). I pulsanti "View all" delle tre categorie
  corrispondenti nella Dashboard rimandano qui mostrando **solo** quella
  tabella (non l'intera pagina WiFi) — un banner in cima permette di
  tornare alla vista completa. In fondo, il log probe grezzo per l'analisi
  riga per riga. Il traffico WiFi stimato per device (se
  `wifi_traffic.jsonl` è disponibile — indicatore relativo, non banda
  esatta) non è mostrato qui: è una colonna opzionale della pagina Host,
  e resta comunque nell'export CSV e nel report email periodico.
- **BLE** — KPI (advertisement 24h, MAC distinti, % con nome, RSSI medio,
  manufacturer noti), attività oraria, poi la tabella **"Dispositivi
  BLE"** — un riepilogo per MAC con nome, manufacturer, segnale e
  avvistamenti, ricercabile e paginata — e in fondo il log advertisement
  grezzo.
- **Dashboard** (ex "Nearby"/"Dintorni", è la home) — in cima il KPI
  "host attivi" (vedi sopra), poi la casetta isometrica grande (si adatta
  alla larghezza della card) e centrata, con riquadri collegati da linee
  guida per SSID cercati nei probe, reti WiFi adiacenti realmente rilevate,
  dispositivi WiFi e Bluetooth visti nelle ultime 24h (più vicini = segnale
  medio più forte — vista puramente illustrativa, non una mappa reale né
  una distanza fisica). La casetta mostra sempre fino a 10 riquadri in
  totale, distribuiti tra le sole categorie attive nei filtri in alto
  (nascondere una categoria ridistribuisce i suoi posti alle altre, invece
  di un numero fisso per categoria). Sotto la casetta, in una griglia (non
  più ai lati, per non rimpicciolire la mappa): stato della scansione, un
  riepilogo della pagina Host (host totali/attivi/offline, distribuzione
  del rischio) e pannelli con un'anteprima per categoria — ciascuno mostra
  le prime righe con un pulsante **"View all"** che porta alla pagina
  corrispondente (Host, WiFi o BLE) con l'elenco completo, ricercabile e
  con tutti i dettagli, invece di espandersi sul posto — per le tre
  categorie WiFi, la pagina mostra solo quella tabella (non l'intera
  pagina WiFi). Filtri per categoria in alto (nascondono la categoria
  ovunque compaia), click su un riquadro o una
  riga per aprire il profilo del device (dove disponibile). Importante: gli "SSID cercati" sono le reti *salvate* sui
  device nei dintorni (dal probe request), non le reti WiFi fisicamente
  presenti in zona — un telefono chiede di decine di reti note
  indipendentemente da dove si trova davvero, e il canale non è mai
  mostrato perché nel probe request non esiste un canale reale della rete
  cercata (solo quello del proprio sniffer al momento della cattura). Le
  **"Reti WiFi adiacenti"** sono invece un dato genuino: catturate dal
  beacon che ogni access point trasmette autonomamente (non richiede un
  probe di un client), con BSSID/SSID/canale reali — il canale è quello
  dichiarato dall'AP nel beacon stesso (DS Parameter Set) o, in sua
  assenza, quello su cui lo sniffer si trovava mentre lo riceveva
  (comunque affidabile, a differenza del caso probe, perché un beacon si
  riceve solo restando sintonizzati sul canale dell'AP che lo trasmette).
  Nuovo quarto file di log opzionale, `wifi_networks.jsonl` (CLI:
  `--wifi-networks-log`, `--wifi-networks-interval` per il throttling per
  BSSID — default 30s, `--no-wifi-networks` per disabilitare).
- **Avvisi** — nuovi dispositivi e porte potenzialmente a rischio (telnet,
  RDP, SMB, VNC, FTP) aperte sui device correnti, calcolati dalla dashboard
  stessa; più gli alert generati dai moduli di detection del daemon
  (`alerts_detection.jsonl`, se presente) — ARP spoofing, rogue DHCP, evil
  twin WiFi, possibile deauth/disassoc flood, anomalie comportamentali.
  Filtrabili per tipologia e stato, con combinazioni di filtri salvabili
  come preset. Gli alert collegati a un device contrassegnato come fidato
  vengono mostrati con severità ridotta di un livello. Nessun dato è
  inventato.
- **Trend** — andamento di nuovi dispositivi e alert negli ultimi 7/30
  giorni (grafici giornalieri + variazione % vs periodo precedente). Usa il
  rollup giornaliero del daemon (`trend_daily.jsonl`, vedi sopra) quando
  disponibile — accurato sull'intero periodo indipendentemente da quanto
  sono cresciuti i log grezzi — altrimenti ricade sul calcolo lato browser
  dalla cronologia già caricata dai JSONL (limitata dal troncamento "solo
  coda" oltre una certa dimensione, vedi sopra).
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

Il daemon misura presenza e porte aperte per tutti i device, e per il WiFi
anche una stima relativa di traffico (vedi `wifi_traffic.jsonl` sopra) — non
è comunque una misura di banda reale, dato che il Pi non è il gateway.

## Report periodico via email

`send_report.py` è uno script standalone, separato dal daemon continuo:
pensato per girare periodicamente (es. una volta a settimana) tramite un
timer systemd o cron, invia un digest via email con nuovi dispositivi, alert
per tipo/severità e top device per traffico WiFi stimato nel periodo. Legge
sempre dallo specchio **SQLite** del daemon (`--db`, stesso path passato a
`home_sentinel.py`), non dai JSONL — che possono essere già stati ruotati o
solo parzialmente scaricati dalla dashboard — quindi richiede che il daemon
giri senza `--no-db`.

Uso minimo (richiede un server SMTP; con `--dry-run` stampa il report su
stdout invece di inviarlo, utile per testare senza configurare nulla):

```bash
python3 send_report.py \
    --smtp-host smtp.example.com --smtp-port 587 --use-tls \
    --smtp-user me@example.com --from-addr home-sentinel@example.com \
    --to-addr me@example.com
```

La password SMTP **non va mai passata in chiaro sulla riga di comando**: si
legge da una variabile d'ambiente (`--smtp-password-env`, default
`HOME_SENTINEL_SMTP_PASSWORD`). Per l'esecuzione schedulata, `systemd/home-sentinel-report.service`
(`Type=oneshot`) e `systemd/home-sentinel-report.timer` (default: ogni lunedì
alle 8:00, `OnCalendar`) forniscono un template pronto — la password va in un
file separato referenziato da `EnvironmentFile` (es.
`/etc/home-sentinel/report.env`, permessi `chmod 600`, mai nel file di unit
né sulla riga di comando, per non finire in chiaro in `ps`/`systemctl
status`):

```bash
sudo cp systemd/home-sentinel-report.service systemd/home-sentinel-report.timer /etc/systemd/system/
sudo mkdir -p /etc/home-sentinel
echo "HOME_SENTINEL_SMTP_PASSWORD=..." | sudo tee /etc/home-sentinel/report.env
sudo chmod 600 /etc/home-sentinel/report.env
# adatta subnet/percorsi/destinatari in home-sentinel-report.service
sudo systemctl daemon-reload
sudo systemctl enable --now home-sentinel-report.timer
```

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
- Nomi personalizzati e stato "fidato" assegnati dalla dashboard vivono solo
  nel `localStorage` del browser usato: non sono condivisi tra browser/device
  diversi e non vengono inviati al daemon.
- Per l'esecuzione continua si consiglia systemd (vedi
  `systemd/home-sentinel.service`) piuttosto che una demonizzazione manuale.
