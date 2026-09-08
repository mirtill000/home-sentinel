# Home Sentinel

Daemon Python per la discovery continua dei dispositivi sulla rete locale
(ARP scan + hostname + vendor + port scan), l'ascolto passivo dei probe
request WiFi (richiede un adattatore WiFi esterno capace di monitor mode:
il WiFi onboard del Raspberry Pi 3 non lo supporta bene) e lo scan passivo
dei device BLE nei dintorni (qui invece basta il Bluetooth 4.1 LE onboard
del Pi 3, nessun adattatore esterno necessario).

Oltre alla discovery, include moduli opzionali di detection: fingerprinting
del *tipo* di device (mDNS/SSDP/NetBIOS/banner, non solo vendor da MAC OUI),
una baseline comportamentale per device con rilevamento anomalie (nuove
porte aperte su un device già noto), rilevamento di possibili attacchi di
rete (ARP spoofing, rogue DHCP, evil twin WiFi, deauth/disassoc flood WiFi)
e una stima del traffico WiFi per device. Vedi "Moduli di detection" sotto.

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

Solo discovery LAN — la subnet da scansionare viene dedotta automaticamente
dall'indirizzo IPv4 (e relativa netmask) dell'interfaccia di rete, ottenuto
via DHCP o configurato staticamente non fa differenza, quindi non va
indicata esplicitamente:

```bash
sudo python3 home_sentinel.py
```

Con anche il monitor probe WiFi su un'interfaccia già in monitor mode
(o con `--auto-monitor` per provare a impostarla automaticamente) e lo
scan BLE sull'adattatore Bluetooth di sistema:

```bash
sudo python3 home_sentinel.py \
    --wifi-iface wlan1 \
    --auto-monitor \
    --ble
```

Va eseguito come root (necessario per ARP scan, sniffing 802.11 raw e,
tipicamente, per lo scan BLE via BlueZ).

Per il rilevamento automatico della subnet, con più interfacce di rete
disponibili (es. sia `eth0` sia `wlan0`) indica quella giusta con
`--lan-iface`: senza, viene usata l'interfaccia della rotta di default.
Nei rari casi limite in cui il rilevamento automatico non basta (VLAN o
più subnet sulla stessa interfaccia), puoi comunque forzare la subnet
esplicitamente con il campo `"subnet"` del file di configurazione
(`--config`, vedi sotto).

### File di configurazione (`--config`)

`--config /percorso/config.json` legge da un file JSON opzionale
impostazioni comuni che altrimenti andrebbero ripetute da riga di comando —
per ora, soprattutto, l'elenco dei device "di casa" con un alias o il nome
della persona a cui sono associati (vedi `config.example.json` come punto
di partenza):

```json
{
  "devices": [
    {
      "name": "Marco",
      "wifi_mac": "aa:bb:cc:dd:ee:01",
      "ble_mac": "11:22:33:44:55:01",
      "owner": "Marco Rossi",
      "room": "Studio",
      "type": "Smartphone",
      "tags": ["personale", "mobile"],
      "notes": "iPhone 14"
    },
    { "name": "Sonia", "wifi_mac": "aa:bb:cc:dd:ee:02" }
  ]
}
```

I MAC WiFi/BLE elencati qui si **sommano** a quelli eventualmente passati
con `--wifi-home-macs`/`--ble-home-macs` (stesso tracking presenza/assenza,
vedi sotto), non li sostituiscono — puoi usare solo il file, solo i flag, o
entrambi insieme. Gli alias vengono scritti anche in `daemon_config.jsonl`
(campo `device_aliases`), da cui la dashboard li legge automaticamente per
mostrare subito il nome della persona invece del solo MAC/hostname, su
qualunque browser la si apra — senza dover reimpostare l'etichetta a mano
per ognuno (un'etichetta impostata localmente dalla dashboard stessa
continua comunque a valere, e ha sempre la precedenza su quella del file).
Un parametro passato esplicitamente da riga di comando ha sempre la
precedenza sul valore corrispondente nel file di configurazione.

I campi `owner`, `room`, `type`, `tags` e `notes` sono **puramente
descrittivi**: non cambiano nulla nel comportamento del daemon, viaggiano
fino alla dashboard (campo `device_inventory` di `daemon_config.jsonl`) e lì
diventano la **scheda del device**, visibile nel suo profilo. A differenza
delle etichette impostate dalla dashboard — che restano nel `localStorage`
di quel singolo browser — questi valgono ovunque si apra l'app; un campo
compilato a mano nella dashboard ha comunque la precedenza su quello del
file, per lo stesso device.

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

**Host visti da nmap ma non da Home Sentinel**: la causa più comune è la
richiesta ARP broadcast che apre ogni ciclo di scan — fa rispondere quasi
simultaneamente tutti gli host attivi sulla subnet, e su una rete WiFi
(mezzo condiviso) questo produce facilmente collisioni tra le risposte,
perse senza essere ritrasmesse (a differenza di nmap, che di norma spazia
le richieste nel tempo). Per compensare, ogni ciclo rimanda la richiesta
solo agli host ancora senza risposta, fino a `--arp-retries` volte in più
(default 2; 0 per disabilitare) — chi risponde al primo giro non viene
ri-interrogato, quindi il costo aggiuntivo resta contenuto quando la rete è
già stabile. `--arp-timeout` (default 2s) regola l'attesa per ogni giro:
alzalo se hai molti device che rispondono lentamente (risparmio energetico
WiFi, reti particolarmente affollate). Se dopo aver alzato entrambi
continuano a mancare host visti da nmap, verifica che la subnet rilevata
automaticamente (vedi il log di avvio, o `subnet` in `daemon_config.jsonl`)
copra l'intero range DHCP effettivo e che `--lan-iface` sia la stessa
interfaccia di rete del segmento in cui si trovano quegli host (l'ARP non
attraversa router/VLAN diverse) — nei rari casi in cui il rilevamento
automatico prende la subnet sbagliata (es. più subnet sulla stessa
interfaccia), forzala esplicitamente con `"subnet"` nel file di
configurazione (`--config`).

Se anche con `--arp-retries` più alto restano host mancanti, sono
disponibili due fallback opzionali (disattivati di default: costano tempo
extra ad ogni ciclo, quindi solo chi ne ha bisogno li attiva), provati solo
sulle IP della subnet ancora senza risposta dopo l'ARP — mai sull'intera
subnet, per non appesantire ogni ciclo quando la rete è già a posto:

- **`--icmp-fallback`** — un ping ICMP diretto (non broadcast) a ogni IP
  mancante. Copre il caso limite di un host che perde/ignora la richiesta
  ARP anche dopo i retry (raro sulla stessa subnet — bridge o proxy-ARP non
  standard) ma non un firewall che blocca solo l'ARP: se un host non
  risponde all'ARP è quasi sempre perché non è raggiungibile affatto, non
  perché "l'ARP è bloccato ma il ping no". **Non è il sostituto dell'ARP**:
  il contrario è più comune — un firewall che blocca l'ICMP (Windows lo fa
  di default, molti IoT pure) ma non tocca l'ARP, quindi da solo l'ICMP
  scoprirebbe *meno* host, non di più.
- **`--tcp-fallback`** — ultima risorsa per gli host ancora muti dopo ARP e
  ICMP: un SYN TCP a `--tcp-fallback-ports` (default `80,443,22,445,3389`).
  Un host con firewall che blocca il ping ma non il TCP (di nuovo, il caso
  Windows) risponde comunque con un SYN-ACK (porta aperta) o un RST (porta
  chiusa) — la risposta in sé, quale che sia, basta a confermarne la
  presenza; un SYN-ACK ricevuto viene chiuso subito con un RST per non
  lasciare connessioni a metà sull'host remoto.

Entrambi i fallback dicono solo "quali IP sono vive": il MAC — la chiave
con cui ogni device è tracciato nel resto del sistema — viene comunque
recuperato con un ultimo ARP diretto e mirato solo a quelle IP (a
differenza della richiesta broadcast del giro principale, qui è unicast
verso poche IP già confermate raggiungibili, quindi con altissima
probabilità di successo). `--fallback-timeout` (default 1.5s) regola
l'attesa di entrambi.

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

**`ble_discovery.jsonl`**: `{timestamp, mac, name, rssi, tx_power, manufacturer_ids, service_uuids, device_type}`
Una riga per ogni advertisement BLE ricevuto durante lo scan (passivo di
default, `--ble-active` per uno scan attivo — richiede scan response ai
device, spesso più informazioni ma rende il Pi stesso più visibile via
radio). `name` è la stringa pubblicizzata dal device (vuota se non
presente), `manufacturer_ids` un array di company ID Bluetooth SIG (es.
`76` = Apple), `service_uuids` un array di UUID dei servizi GATT annunciati.
`tx_power` è `null` se il device non lo include nell'advertisement.
`device_type` è una classificazione euristica (es. "Wearable/fitness",
"Auricolari Apple (AirPods)", "Possibile tracker (...)" — vedi "Moduli di
detection BLE" sotto), stringa vuota se non riconosciuto.

**`ble_identity_links.jsonl`** (attivo di default insieme a `--ble`, `--no-ble-identity-linking` per disabilitarlo):
`{timestamp, mac_old, mac_new, signature_name}`
Suggerimenti (mai collegamenti applicati automaticamente) di continuità
d'identità quando la stessa "firma" pubblicitaria (nome + manufacturer +
service UUID) ricompare su un nuovo MAC entro `--ble-identity-rotation-window-s`
(default 1200s = 20 min) dalla sparizione del precedente — il pattern
tipico di una rotazione di indirizzo BLE privato risolvibile (RPA). La
dashboard li mostra come suggerimento scartabile nel profilo device,
stesso principio della "Group by identity" lato LAN/WiFi.

**`ble_presence.jsonl`** (`--ble-home-macs`, o la sezione `devices` del file di configurazione, vedi `--config` sopra — opzionale):
`{timestamp, mac, event, duration_s}`
Un evento per ogni transizione presente/assente di un MAC BLE "di casa"
(es. lo smartphone di un componente della famiglia): `event` è `"arrived"`
o `"left"` (con `duration_s` la durata della presenza appena conclusa,
assente su `"arrived"`). Un MAC è considerato assente dopo
`--ble-presence-away-timeout-s` (default 300s) senza nuovi advertisement.

**`wifi_presence.jsonl`** (`--wifi-home-macs`, opzionale): stesso formato di
`ble_presence.jsonl` sopra, condividono la stessa implementazione
(`PresenceTracker` in `sentinel_presence.py`), ma qui la presenza viene
dedotta da **due fonti indipendenti**, che si sommano invece di competere:

- l'ARP scan di `LanDiscoveryService` (funziona anche senza `--wifi-iface`):
  un MAC "di casa" trovato online sulla LAN è di per sé presente — anzi è
  il segnale più affidabile per un device già connesso, perché una volta
  associato a una rete molti device (in particolare iOS) smettono di
  mandare probe request per quella rete, quindi il solo probe-based
  tracking non li vedrebbe mai arrivare;
- i probe request catturati da `WifiProbeMonitor`, se `--wifi-iface` è
  attivo: utile per un device non ancora connesso (es. appena rientrato in
  zona, ma non ancora associato).

Un MAC è considerato assente dopo `--wifi-presence-away-timeout-s`
(default 300s, come il BLE) senza segnali da **nessuna** delle due fonti.

**`daemon_config.jsonl`**:
`{timestamp, subnet, lan_iface, wifi_iface, ble_home_macs, wifi_home_macs, home_ssids, device_aliases, modules}`
Una riga scritta una sola volta ad ogni avvio del daemon, snapshot della
configurazione effettiva: la subnet rilevata automaticamente (o forzata via
`--config`), le interfacce in uso, l'elenco completo dei MAC "di casa"
configurati via `--ble-home-macs`/`--wifi-home-macs` e/o la sezione
`devices` del file di configurazione, gli alias assegnati a ciascun MAC
(`device_aliases`, mappa mac -> nome, usata dalla dashboard come vedi
sopra), gli SSID di casa (`--home-ssid`) e un oggetto `modules` con un booleano per ciascun
modulo opzionale (`fingerprint`, `os_fingerprint`, `dhcp_discovery`,
`detect_rogue_dhcp`, `dhcp_lease_source`, `deep_port_scan`,
`arp_detection`, `trend_rollup`, `ble`, `ble_tracker_detection`,
`ble_identity_linking`, `ble_evil_twin`, `wifi_networks`, `wifi_traffic`,
`evil_twin`, `deauth_detection`, `capture_handshakes`) che indica se è
realmente attivo con la configurazione corrente. Non c'è un endpoint di
stato dedicato: senza questo file la dashboard può solo dedurre lo stato
di un modulo dai dati già caricati, il che è ambiguo — un log assente può
voler dire sia "modulo spento sul daemon" sia "dashboard non ancora
collegata al file giusto" (vedi `dashboard/link-logs.sh`). Il pannello
"Salute del sistema" in Dashboard e il denominatore del KPI Presence
(altrimenti sottostimato per un MAC appena aggiunto alla config o mai più
visto online) usano entrambi questo file come fonte di verità. Lo stesso
elenco di moduli, in forma leggibile, viene anche loggato una volta ad ogni
avvio (`journalctl -u home-sentinel` con systemd) come riepilogo unico,
invece di doverlo ricostruire dai singoli warning sparsi nel resto del log.

**`heartbeat.jsonl`**: `{timestamp, started_at, uptime_s, interval_s, pid, threads, subnet, lan_iface, wifi_iface}`
Prova di vita del daemon, **riscritta** (scrittura atomica su file
temporaneo + rename, non appesa) ogni `--heartbeat-interval` secondi
(default 30, `0` per disabilitarla): interessa solo l'ultimo battito, quindi
il file resta di una riga e non ha bisogno di rotazione. Serve alla
dashboard per distinguere **"rete tranquilla" da "daemon fermo"**: leggendo
file statici via HTTP, un daemon spento continuerebbe a servire gli stessi
JSONL e tutto sembrerebbe a posto finché non si nota che il timestamp più
recente non avanza più. Il pallino di stato in alto a destra passa a
"Daemon stale" quando l'ultimo battito è più vecchio di tre intervalli.

**`ipv6_neighbors.jsonl`** (con `--ipv6-discovery`): `{timestamp, mac, ipv6, scope, state}`
Indirizzi IPv6 osservati per MAC, letti dalla neighbor table del kernel
(`ip -6 neighbor`, il corrispettivo NDP dell'ARP). Non si sonda nulla: la
tabella è popolata dal traffico IPv6 che il Pi vede comunque passare. Le
voci senza `lladdr` o in stato `FAILED`/`INCOMPLETE` sono scartate (sono
risoluzioni non riuscite, non device). `scope` distingue `link-local`
(`fe80::/10`, presente su ogni interfaccia IPv6 e poco significativo) da
`global` — quest'ultimo indica un device davvero raggiungibile fuori dalla
sua sottorete. La chiave resta il MAC: non nascono device separati, gli
indirizzi si affiancano a quelli IPv4 già noti nel profilo del device.

**`exposure_audit.jsonl`** (con `--exposure-audit`): `{timestamp, external_port, internal_port, internal_ip, protocol, description, enabled, router}`
Port forwarding attivi sul router, letti via UPnP/IGD. Vedi "Moduli di
detection" sotto.

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

**`handshake_captures.jsonl`** (`--capture-handshakes`, opzionale, richiede `--home-ssid`):
`{timestamp, ssid, bssid, sta_mac, frame_count, messages, pcap_path}`
Una riga per ogni handshake EAPOL (WPA/WPA2) catturato passivamente per una
rete elencata in `--home-ssid` — solo metadati, il file `.pcap` vero e
proprio (percorso in `pcap_path`) va in `--handshake-pcap-dir` e non
contiene mai la password in chiaro, solo il materiale crittografico
dell'handshake per un tentativo di audit offline con aircrack-ng/hashcat.
`messages` è l'elenco dei messaggi 1-4 del 4-way handshake classificati
dai flag del frame EAPOL-Key: una cattura viene salvata solo se contiene
una coppia realmente utilizzabile per un tentativo di cracking — messaggio
2 (SNonce + MIC) insieme al messaggio 1 o 3 (ANonce), es. `[1, 2]` — non
sul semplice numero di frame raccolti, che da solo non garantisce una
coppia valida (tipicamente capita con un client che ritrasmette più volte
lo stesso messaggio senza completare l'handshake). `frame_count` resta il
totale dei frame EAPOL raccolti per quella sessione (bssid + MAC
stazione), anche quelli non classificabili o duplicati. Il `.pcap` include
sempre, come primo frame, l'ultimo beacon visto per quel BSSID: senza,
strumenti come aircrack-ng non hanno modo di risalire all'ESSID dal solo
traffico EAPOL e lo richiedono a mano ad ogni tentativo (opzione `-e`).
Vedi "Moduli di detection" sotto per come e quando scatta la cattura.

**`deep_port_scan.jsonl`** (`--deep-port-scan`, opzionale):
`{timestamp, mac, ip, open_ports, new_ports}`
Una riga per ogni deep port scan eseguito (una volta ogni
`--deep-port-scan-interval` per device, default una settimana — non ad
ogni ciclo). `open_ports` è l'elenco completo trovato su `--deep-ports`
(default tutte le 65535 porte TCP), `new_ports` il sottoinsieme non già
noto dall'ultimo port scan normale (`--ports`) — quello che il deep scan
ha aggiunto rispetto a quanto già visibile. Le porte in `new_ports`
vengono unite all'elenco porte del device (colonna "Open ports" in
dashboard) e possono far scattare l'alert "nuova porta" dell'anomaly
detector come qualunque altra porta nuova.

**`dhcp_events.jsonl`** (`--dhcp-discovery`, indipendente da `--detect-rogue-dhcp`
ma sullo stesso sniff loop DHCP su `--dhcp-iface`):
`{timestamp, event, mac, hostname, requested_ip}`
Una riga per ogni DHCPDISCOVER/DHCPREQUEST osservato passivamente
(`event=discover|request`). `hostname` è quello dichiarato dal client
(opzione DHCP 12, spesso vuota se il client non la invia). Alimenta anche
`lan_discovery.jsonl` (priorità sull'hostname, vedi sopra) e la rescan LAN
immediata su un MAC nuovo.

**`os_fingerprint.jsonl`** (`--os-fingerprint`):
`{timestamp, mac, ip, ttl, window, os_guess}`
Una riga per MAC (non più di una ogni `--os-fingerprint-interval` secondi,
default 300s), da pacchetti TCP con flag SYN (SYN o SYN-ACK) — sia dallo
sniffing passivo su `--lan-iface` (inclusi i SYN-ACK di risposta al port
scan attivo già in corso), sia dalla sonda attiva immediata sui device
appena scoperti (un singolo SYN TCP, vedi "Moduli di discovery avanzata"
più sotto per i dettagli — `--no-os-fingerprint-active-probe` per
disabilitarla).
`os_guess` è un'**euristica grezza** sul solo TTL IP (vedi
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
a posteriori. Ogni alert porta con sé anche il campo **`home_occupied`**:
`true`/`false` se il tracking presenza è configurato (c'era qualcuno in casa
quando è successo?), `null` se il daemon non può saperlo — vedi
`--presence-aware-alerts` sotto.

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
- **Esposizione verso Internet** (`--exposure-audit`, opzionale):
  interroga periodicamente il router via UPnP/IGD (SSDP in multicast +
  SOAP, tutto in sola lettura sulla LAN: non chiama mai
  `AddPortMapping`/`DeletePortMapping`) ed elenca i **port forwarding
  attivi** su `exposure_audit.jsonl`. Un forwarding verso una porta a
  rischio (Telnet, RDP, SMB, VNC, FTP) genera un alert: il port scan
  interno dice cosa è aperto *dentro* la LAN, questo è l'unico modulo che
  guarda cosa è raggiungibile *da fuori* — spesso forwarding creati
  automaticamente da console, NAS o client torrent senza che nessuno lo
  sappia. Se l'UPnP è disabilitato sul router non trova nulla e non è un
  errore: è anzi la notizia migliore. `--exposure-audit-interval` regola
  la frequenza (default 1h).
- **Device WiFi ricorrenti sconosciuti** (`--wifi-recurrence-detection`,
  opzionale, richiede `--wifi-iface`): l'equivalente WiFi del rilevamento
  tracker BLE. Il criterio però deve essere diverso: un tracker BLE si
  riconosce perché *resta* vicino a lungo, mentre sul WiFi la
  randomizzazione dei MAC fa sì che chi passa ogni giorno si presenti quasi
  sempre con un indirizzo nuovo — cercare una presenza continuativa non
  troverebbe nulla. Si cerca invece il **ritorno** su più giorni distinti
  (`--wifi-recurrence-days`, default 3): i MAC che sopravvivono nel tempo
  sono proprio quelli non randomizzati, e uno stabile che ricompare giorno
  dopo giorno vicino a casa senza mai connettersi alla rete è il segnale che
  interessa. I MAC di casa e quelli già visti sulla LAN sono esclusi.
- **Severità consapevole della presenza** (`--presence-aware-alerts`,
  opzionale, richiede almeno un MAC "di casa"): lo stesso evento non vale
  uguale a tutte le ore. Con questo flag ogni alert generato mentre in casa
  non c'è nessuno sale di un gradino di severità (`low` → `medium` → `high`
  → `critical`) e riporta `details.escalated_reason = "home_empty"`. È il
  primo uso combinato di due moduli che prima convivevano senza parlarsi:
  la dashboard mostra questi alert con un tag "Home empty" e permette di
  filtrarli.
- **Rogue DHCP** (`--detect-rogue-dhcp`, opzionale): sniffing passivo di
  DHCPOFFER/DHCPACK sull'interfaccia LAN; se non si specifica
  `--dhcp-trusted-servers` impara il primo server osservato come fidato e
  segnala ogni server diverso visto in seguito.
- **Evil twin WiFi** (`--home-ssid`, richiede `--wifi-iface` già attivo):
  osserva i beacon 802.11 catturati durante il channel hopping e segnala
  un SSID monitorato trasmesso da un BSSID mai visto prima.
- **Cattura handshake WPA/WPA2** (`--capture-handshakes`, opzionale,
  richiede `--home-ssid` già configurato): non è un detector — non genera
  alert — ma un audit tool per verificare la robustezza della propria
  password WiFi. Ascolta passivamente i frame EAPOL del 4-way handshake
  per le reti elencate in `--home-ssid` (nessun frame viene mai inviato,
  a differenza di un attacco che forzerebbe la riconnessione dei client
  con un deauth attivo — qui si aspetta un handshake che avviene comunque,
  es. un client che si riconnette dopo essere stato fuori portata) e
  salva un file `.pcap` per ogni handshake raccolto, pronto per un
  tentativo di cracking offline con un dizionario tramite aircrack-ng o
  hashcat. **Scoping deliberato**: cattura solo per le reti in
  `--home-ssid`, mai indiscriminatamente per le reti dei vicini
  rilevate — un handshake completo, a differenza di un beacon o un
  probe, è materiale sufficiente per un tentativo di cracking della
  password di quella rete specifica, quindi va raccolto solo per reti
  che l'operatore è autorizzato a testare. Vedi `handshake_captures.jsonl`
  sopra per il formato dei metadati, `--handshake-window-s` e
  `--handshake-min-frames` per la sensibilità della cattura di handshake
  parziali (meno di 4 messaggi, comunque spesso utilizzabili — ma solo se
  contengono una coppia realmente sfruttabile, vedi sopra). Il `.pcap`
  include già il beacon della rete, quindi basta puntarci aircrack-ng
  senza specificare l'ESSID a mano:
  ```bash
  aircrack-ng -w dizionario.txt /var/log/home-sentinel/handshakes/home_....pcap
  ```
  **Canale "incollato" alla rete di casa**: un 4-way handshake dura in
  genere meno di un secondo (e un flood di deauth può esaurirsi in pochi
  frame), troppo poco perché il normale hopping round-robin su tutti i
  canali (`--wifi-channels`, default 13 canali a `--wifi-hop-interval`
  0.5s l'uno, ~1/13 del tempo per canale) riesca a catturarlo in tempi
  ragionevoli. Con `--capture-handshakes` o il deauth detector attivi
  (quest'ultimo di default) *e* `--home-ssid` configurato, una volta
  appreso il canale della rete di casa dal suo beacon, lo sniffer vi resta
  sintonizzato per la maggior parte del tempo (con solo un giro occasionale
  sugli altri canali, per non perdere del tutto le altre funzionalità
  passive di scoperta reti/evil twin su altri BSSID), aumentando di molto
  la probabilità di essere sul canale giusto quando un client si
  (ri)associa o quando la propria rete subisce un flood di deauth. È un
  trade-off deliberato: riduce leggermente la copertura full-spectrum per
  l'evil twin detection sulle altre reti — disattivabile con
  `--no-home-channel-priority` per chi preferisce il vecchio hopping
  uniforme.
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
- **Tracker BLE (anti-stalking)** (attivo di default insieme a `--ble`,
  `--no-ble-tracker-detection` per disabilitarlo): riconosce nell'advertisement
  i pattern pubblici noti di Apple Find My (AirTag e accessori "separati dal
  proprietario"), Tile e Samsung SmartTag; segnala un alert se un tracker
  resta nei paraggi per più di `--ble-tracker-window-hours` (default 3h) di
  presenza continuativa — possibile tracker lasciato addosso o nei bagagli,
  non solo un device di casa. `--ble-trusted-macs` esclude i propri tracker
  (es. il tuo AirTag) dall'alert. Euristica basata su formati pubblici noti,
  non un'identificazione garantita al 100%.
- **Evil twin/spoofing BLE** (`--ble-watch-names`, opzionale): come l'evil
  twin WiFi ma per BLE — segnala un nome BLE monitorato (es. una serratura
  smart) trasmesso da un MAC nuovo/inatteso rispetto a quelli già noti per
  quel nome.

## Moduli di discovery avanzata

- **Discovery IPv6** (`--ipv6-discovery`, opzionale): affianca allo scan ARP
  IPv4 la lettura passiva della neighbor table IPv6 del kernel. Molte reti
  domestiche sono ormai dual-stack e un device può essere pienamente attivo
  in IPv6 mentre risponde poco o nulla in IPv4; gli indirizzi trovati sono
  associati al MAC già noto, non creano device separati (vedi
  `ipv6_neighbors.jsonl` sopra).

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
- **OS fingerprint** (`--os-fingerprint`, opzionale): euristica grezza sul
  sistema operativo dal TTL IP dei pacchetti TCP SYN/SYN-ACK. Due fonti:
  ascolto passivo di quelli già visibili su `--lan-iface` (inclusi i
  SYN-ACK di risposta al port scan attivo già in corso), più — attiva di
  default insieme al flag, `--no-os-fingerprint-active-probe` per
  disabilitarla — una sonda attiva immediata alla prima scoperta di un
  device: un singolo SYN TCP su `--os-fingerprint-active-probe-port`
  (default 80), che produce un OS guess sia se la porta è aperta (risposta
  SYN-ACK, poi chiusa con un RST di cortesia) sia se è chiusa (risposta
  RST diretta, TTL comunque valido). Senza la sonda attiva, un device con
  tutte le porte filtrate (comune su molti smartphone/IoT) potrebbe non
  produrre mai un OS guess col solo ascolto passivo. Onestamente
  etichettata come euristica, non un'identificazione certa — vedi
  `os_fingerprint.jsonl` sopra per i dettagli e i limiti.
- **Cross-check lease DHCP del router** (`--dhcp-lease-source`, opzionale):
  confronta periodicamente la tabella lease del router (dnsmasq.leases o un
  JSON generico, vedi `dhcp_leases.jsonl` sopra) con l'ultimo ciclo di ARP
  scan, per rilevare device presenti nelle lease ma silenziosi sull'ARP
  scan (spenti, addormentati, o firewallati contro ARP non richiesti — non
  necessariamente un problema, solo un dato in più).
- **Classificazione tipo device BLE** (sempre attiva insieme a `--ble`,
  nessun flag dedicato): euristica su nome/manufacturer/service UUID
  dell'advertisement, scrive il campo `device_type` su `ble_discovery.jsonl`
  (vedi sopra) — stesso principio del fingerprinting LAN, ma senza sonde
  aggiuntive: usa solo i dati già ricevuti passivamente.
- **Suggerimenti identità BLE per rotazione indirizzo** (attivo di default
  insieme a `--ble`, `--no-ble-identity-linking` per disabilitarlo, vedi
  `ble_identity_links.jsonl` sopra): non è un detector di sicurezza, solo un
  suggerimento di continuità d'identità mai applicato automaticamente.
- **Tracking presenza/assenza BLE** (`--ble-home-macs`, opzionale, vedi
  `ble_presence.jsonl` sopra): utile per un segnale "casa occupata/vuota" a
  valle (automazioni, riduzione rumore alert quando la casa è occupata),
  non è un detector di sicurezza.
- **Tracking presenza/assenza WiFi** (`--wifi-home-macs`, opzionale, vedi
  `wifi_presence.jsonl` sopra): stesso principio del tracking BLE, alimentato
  sia dall'ARP scan (device già connesso alla LAN — funziona anche senza
  `--wifi-iface`) sia, se attivo, dai probe request catturati da
  `--wifi-iface` — condividono lo stesso `PresenceTracker`
  (`sentinel_presence.py`), quindi anche lo stesso limite: è solo
  presenza/assenza dei MAC esplicitamente elencati, non identità
  cross-radio (un telefono con MAC BLE e MAC WiFi diversi conta come due
  device "di casa" distinti se entrambi configurati).
- **Deep port scan** (`--deep-port-scan`, opzionale, vedi `deep_port_scan.jsonl`
  sopra): un secondo port scan periodico su un elenco molto più ampio di
  `--ports` (default `--deep-ports 1-65535`, tutte le porte TCP) ma molto
  meno frequente (`--deep-port-scan-interval`, default una settimana) per
  device, per non perdere un servizio su una porta non standard senza dover
  rallentare il port scan normale (che resta sulle porte comuni, ad ogni
  `--port-scan-interval`). Le eventuali porte trovate solo dal deep scan
  vengono unite all'elenco porte del device (colonna "Open ports" in
  dashboard) e, se `--fingerprint` è attivo, rifanno scattare il banner
  grabbing su di esse — stessa infrastruttura del fingerprinting LAN, solo
  con un elenco porte più ampio. Alla prima comparsa di un device (o al
  riavvio del daemon, che non ricorda l'ultimo deep scan tra un riavvio e
  l'altro) il primo deep scan viene rimandato di un intervallo intero,
  invece di scattare subito: altrimenti ogni device nuovo o un semplice
  riavvio del servizio scatenerebbe una scansione pesante e sequenziale su
  tutti i device già noti.

## Dashboard

`dashboard/` è una web app statica (HTML/CSS/JS, senza dipendenze esterne,
utilizzabile offline) con 12 sezioni, tutte basate sui dati reali dei log
LAN, WiFi, BLE e, se i moduli opzionali sono attivi sul daemon, fingerprint
e alert di detection. **Dashboard è la home** (sottotitolo "Local network
overview"): è la prima voce del menu laterale e la pagina che si apre di
default (`dashboard/` senza `#/...` nell'URL). L'ordine delle voci è
Dashboard, Network Discovery, WiFi, BLE, Timeline, Scans, Alerts, Trend,
What changed, Settings, Export, Help.

Alcune cose valgono in **tutta** l'app, ed è quello che la tiene insieme:

- **Una sola finestra temporale.** Il selettore in alto (24 ore / 7 giorni /
  30 giorni / tutto lo storico) vale per KPI, grafici, vista Nearby e
  confronto fra periodi: un numero visto su una pagina copre sempre lo
  stesso periodo di un numero visto su un'altra. Viene ricordato tra un
  refresh e l'altro.
- **Ogni entità ha un profilo.** Device LAN, WiFi e BLE (`#/device/<mac>`) e
  reti WiFi adiacenti (`#/network/<bssid>`): ovunque compaia un MAC o un
  BSSID è un link al suo profilo, e il pulsante "indietro" riporta da dove
  si è arrivati, non sempre a Network Discovery.
- **Ogni device ha un nome e una scheda.** Nome, "fidato", proprietario,
  stanza, tipo, tag e note; nome e scheda arrivano anche dal file di
  configurazione del daemon (`--config`) e valgono così su ogni browser,
  mentre un valore impostato localmente ha la precedenza. Marcare come
  fidato funziona su tutte e tre le radio, non solo sulla LAN.
- **Ogni numero porta alla sua lista.** I KPI sono cliccabili: aprono la
  vista filtrata che li compone.
- **Ricerca globale** con **Ctrl+K** (⌘K su Mac) su pagine, device (LAN,
  WiFi e BLE, cercabili anche per nome assegnato), reti WiFi, SSID
  richiesti e avvisi.
- **Esportabile da dove si guarda**: le tabelle grandi hanno i pulsanti
  CSV/JSON nell'intestazione ed esportano esattamente le righe filtrate;
  la pagina Export copre comunque ogni sorgente caricata.
- **Stato onesto in alto a destra**: dice sia se i log sono raggiungibili
  dal browser, sia se il daemon che li scrive è ancora vivo (heartbeat).
- **Installabile** come app (manifest + service worker): si apre in una
  finestra propria e parte anche col Pi irraggiungibile, spiegando cosa non
  va invece di mostrare l'errore del browser. I dati non vengono mai serviti
  dalla cache — solo l'app — quindi non c'è modo di guardare dati vecchi
  credendoli freschi.

Ogni tabella ha un selettore "righe per pagina" (50/100/200/500/tutte) e uno
scorrimento pagine. Il menu laterale è collassabile (pulsante in fondo,
stato ricordato tra le sessioni) per lasciare più spazio alle pagine con
tabelle larghe.

Per i file JSONL oltre 4MB (tipicamente `wifi_probes.jsonl`, il più
"rumoroso"), la dashboard scarica solo la coda più recente via **HTTP
Range** invece dell'intero file — dato che i log sono append-only e in
ordine cronologico, la coda è esattamente "i dati più recenti". Richiede
che il server statico supporti le richieste Range (**nginx**: sì di
default; il semplice `python3 -m http.server` no — in quel caso si
ripiega in automatico sul download completo, senza errori, solo senza il
vantaggio di velocità). Quando succede, un avviso compare nella pagina
interessata e nell'elenco delle sorgenti in Impostazioni.

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

## API di query locale (`--api`)

La dashboard è una pagina statica che legge i JSONL via HTTP e, per non
bloccare il browser su file da decine di MB, ne scarica solo la coda più
recente. Funziona, ma taglia lo storico proprio dove servirebbe intero
(Trend su 30 giorni, ricerche su tutta la cronologia, confronto fra
periodi). `--api` risolve il problema alla radice: lo specchio SQLite ha già
tutta la storia indicizzata, questa API la rende interrogabile.

```bash
sudo python3 home_sentinel.py --api --api-host 0.0.0.0
```

Endpoint (tutti `GET`, tutti in sola lettura):

| Endpoint | Cosa restituisce |
| --- | --- |
| `/api/health` | stato del servizio e ultimo heartbeat del daemon |
| `/api/tables` | tabelle disponibili, numero di righe e intervallo temporale coperto |
| `/api/query?table=…` | righe filtrate: `since`/`until`, uguaglianza su una colonna dell'allowlist, `limit`/`offset`/`order` |
| `/api/daily?table=…` | conteggi per giorno, opzionalmente raggruppati per una colonna (`group_by`) |

Progettata per essere noiosa e sicura: connessione aperta in `mode=ro`
(nessun endpoint scrive), **nessun SQL arriva dall'esterno** — tabella,
filtri e ordinamento si scelgono da un'allowlist e i valori passano sempre
come parametri, quindi un nome fuori elenco è un `400` e non c'è modo di
iniettare query — e solo stdlib, nessuna dipendenza in più sul Pi.

**Non ha autenticazione**, esattamente come la cartella `dashboard/` servita
con `python3 -m http.server`: è pensata per la LAN di casa, e per questo il
default di `--api-host` è `127.0.0.1`. Aprendola alla LAN
(`--api-host 0.0.0.0`) vale la pena restringere anche
`--api-allow-origin` all'origine della propria dashboard, invece del `*` di
default. Nella dashboard, l'indirizzo si imposta in **Impostazioni → Query
API**.

## Report periodico via email

`send_report.py` è uno script standalone, separato dal daemon continuo:
pensato per girare periodicamente (es. una volta a settimana) tramite un
timer systemd o cron, invia un digest via email con nuovi dispositivi, alert
per tipo/severità, top device per traffico WiFi stimato nel periodo e un
riepilogo di presenza BLE/WiFi (arrivi e tempo totale a casa nel periodo,
per ciascun MAC configurato con `--ble-home-macs`/`--wifi-home-macs` —
sezione omessa se non ci sono MAC "di casa" configurati, o se il database
è di una versione del daemon precedente a questa feature). Legge
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
# adatta percorsi/destinatari in home-sentinel-report.service
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
