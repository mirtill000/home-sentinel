"use strict";

/* ---------------------------------------------------------------------- *
 * Icons (minimal inline SVG, stroke-based)
 * ---------------------------------------------------------------------- */

const ICON_PATHS = {
  grid: `<rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/>`,
  monitor: `<rect x="3" y="4" width="18" height="13" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>`,
  network: `<circle cx="12" cy="5" r="2.2"/><circle cx="5" cy="19" r="2.2"/><circle cx="19" cy="19" r="2.2"/><line x1="12" y1="7.2" x2="6" y2="17"/><line x1="12" y1="7.2" x2="18" y2="17"/><line x1="7" y1="19" x2="17" y2="19"/>`,
  radar: `<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/><line x1="12" y1="12" x2="18.5" y2="6.5"/>`,
  bell: `<path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M9.5 19a2.5 2.5 0 0 0 5 0"/>`,
  sliders: `<line x1="4" y1="6" x2="20" y2="6"/><circle cx="9" cy="6" r="2.2" fill="currentColor" stroke="none"/><line x1="4" y1="12" x2="20" y2="12"/><circle cx="16" cy="12" r="2.2" fill="currentColor" stroke="none"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="12" cy="18" r="2.2" fill="currentColor" stroke="none"/>`,
  download: `<path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/>`,
  help: `<circle cx="12" cy="12" r="9"/><path d="M9.3 9.2a2.7 2.7 0 1 1 3.9 2.4c-1 .5-1.6 1-1.6 2.3"/><circle cx="12" cy="17.2" r="0.9" fill="currentColor" stroke="none"/>`,
  refresh: `<path d="M4 4v5h5"/><path d="M20 20v-5h-5"/><path d="M5.5 9a7 7 0 0 1 12-3.5L20 8"/><path d="M18.5 15a7 7 0 0 1-12 3.5L4 16"/>`,
  search: `<circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.2" y2="16.2"/>`,
  kebab: `<circle cx="12" cy="5" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="19" r="1.3" fill="currentColor" stroke="none"/>`,
  x: `<line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/>`,
  sun: `<circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4.5"/><line x1="12" y1="19.5" x2="12" y2="22"/><line x1="2" y1="12" x2="4.5" y2="12"/><line x1="19.5" y1="12" x2="22" y2="12"/><line x1="4.9" y1="4.9" x2="6.6" y2="6.6"/><line x1="17.4" y1="17.4" x2="19.1" y2="19.1"/><line x1="4.9" y1="19.1" x2="6.6" y2="17.4"/><line x1="17.4" y1="6.6" x2="19.1" y2="4.9"/>`,
  moon: `<path d="M20 14.2A8.2 8.2 0 1 1 9.8 4a6.6 6.6 0 0 0 10.2 10.2z" fill="currentColor" stroke="none"/>`,
  wifi: `<path d="M3 8.5a15 15 0 0 1 18 0"/><path d="M6.2 12.2a10.5 10.5 0 0 1 11.6 0"/><path d="M9.5 15.8a5.8 5.8 0 0 1 5 0"/><circle cx="12" cy="19" r="1.1" fill="currentColor" stroke="none"/>`,
  users: `<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><line x1="18.5" y1="8" x2="18.5" y2="14"/><line x1="15.5" y1="11" x2="21.5" y2="11"/>`,
  "alert-triangle": `<path d="M12 4 2.5 20h19L12 4z"/><line x1="12" y1="10" x2="12" y2="15"/><circle cx="12" cy="17.7" r="0.9" fill="currentColor" stroke="none"/>`,
  copy: `<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>`,
  eye: `<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>`,
  bluetooth: `<path d="M8 8l8 8-4 4V4l4 4-8 8"/>`,
  shield: `<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/><path d="M9 12l2 2 4-4.5"/>`,
  server: `<rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/><circle cx="7" cy="7" r="0.9" fill="currentColor" stroke="none"/><circle cx="7" cy="17" r="0.9" fill="currentColor" stroke="none"/>`,
  "arrow-left": `<path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/>`,
  "trending-up": `<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>`,
  clock: `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>`,
  "chevron-left": `<path d="M15 6l-6 6 6 6"/>`,
  "chevron-right": `<path d="M9 6l6 6-6 6"/>`,
  layers: `<path d="M12 3 2.5 8 12 13l9.5-5L12 3z"/><path d="M2.5 13 12 18l9.5-5"/><path d="M2.5 18 12 23l9.5-5"/>`,
  home: `<path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v10h12V10"/><path d="M10 20v-6h4v6"/>`,
  menu: `<line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/>`,
  edit: `<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>`,
};

function ICON(name) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICON_PATHS[name] || ""}</svg>`;
}

/* ---------------------------------------------------------------------- *
 * Settings (persisted in localStorage)
 * ---------------------------------------------------------------------- */

/**
 * Registro unico delle sorgenti dati del daemon: un'unica riga per file JSONL, da cui derivano
 * il caricamento, lo stato delle sorgenti in Impostazioni, i campi URL configurabili e le card
 * di Esporta. Prima ognuna di queste quattro cose aveva il proprio elenco scritto a mano, e ad
 * ogni modulo nuovo se ne aggiornava una dimenticandone un'altra (era il caso di presence, deep
 * scan e handshake, esportabili da nessuna parte pur essendo caricati).
 *
 *   key        chiave in state.sourceStatus e suffisso di stato
 *   rows       proprietà di `state` in cui finiscono le righe
 *   file       nome file di default sotto la cartella dei log
 *   label      etichetta leggibile (Impostazioni, Esporta, messaggi d'errore)
 *   required   true solo per le sorgenti sempre presenti: un errore lì è un errore visibile,
 *              sulle altre è la normalità (modulo opzionale non attivo sul daemon)
 *   fileKey    proprietà di `state` per il file locale caricato a mano (solo LAN/WiFi/BLE)
 *   exportName nome del file scaricato da Esporta (omesso = non esportabile: solo daemon_config
 *              e heartbeat, che sono stato corrente e non serie storiche)
 */
const DATA_SOURCES = [
  { key: "lan", rows: "lanRows", file: "lan_discovery.jsonl", label: "LAN discovery", required: true, fileKey: "lanFile", exportName: "lan_discovery_log" },
  { key: "wifi", rows: "wifiRows", file: "wifi_probes.jsonl", label: "WiFi probes", fileKey: "wifiFile", exportName: "wifi_probes" },
  { key: "ble", rows: "bleRows", file: "ble_discovery.jsonl", label: "BLE scan", fileKey: "bleFile", exportName: "ble_discovery" },
  { key: "alerts", rows: "alertsRows", file: "alerts_detection.jsonl", label: "Detection alerts", exportName: "alerts_detection" },
  { key: "fingerprint", rows: "fingerprintRows", file: "fingerprint_discovery.jsonl", label: "Device fingerprints", exportName: "fingerprint_discovery" },
  { key: "wifiTraffic", rows: "wifiTrafficRows", file: "wifi_traffic.jsonl", label: "Estimated WiFi traffic", exportName: "wifi_traffic" },
  { key: "wifiNetworks", rows: "wifiNetworksRows", file: "wifi_networks.jsonl", label: "Adjacent WiFi networks", exportName: "wifi_networks" },
  { key: "dhcpEvents", rows: "dhcpEventsRows", file: "dhcp_events.jsonl", label: "DHCP client discovery", exportName: "dhcp_events" },
  { key: "osFingerprint", rows: "osFingerprintRows", file: "os_fingerprint.jsonl", label: "OS fingerprint", exportName: "os_fingerprint" },
  { key: "dhcpLeases", rows: "dhcpLeasesRows", file: "dhcp_leases.jsonl", label: "DHCP lease cross-check", exportName: "dhcp_leases" },
  { key: "trendDaily", rows: "trendDailyRows", file: "trend_daily.jsonl", label: "Daily trend rollup", exportName: "trend_daily" },
  { key: "bleIdentityLinks", rows: "bleIdentityLinksRows", file: "ble_identity_links.jsonl", label: "BLE identity links", exportName: "ble_identity_links" },
  { key: "blePresence", rows: "blePresenceRows", file: "ble_presence.jsonl", label: "BLE presence", exportName: "ble_presence" },
  { key: "wifiPresence", rows: "wifiPresenceRows", file: "wifi_presence.jsonl", label: "WiFi presence", exportName: "wifi_presence" },
  { key: "deepScan", rows: "deepScanRows", file: "deep_port_scan.jsonl", label: "Deep port scan", exportName: "deep_port_scan" },
  { key: "handshake", rows: "handshakeRows", file: "handshake_captures.jsonl", label: "Handshake captures", exportName: "handshake_captures" },
  { key: "ipv6", rows: "ipv6Rows", file: "ipv6_neighbors.jsonl", label: "IPv6 neighbours", exportName: "ipv6_neighbors" },
  { key: "exposure", rows: "exposureRows", file: "exposure_audit.jsonl", label: "Internet exposure (UPnP)", exportName: "exposure_audit" },
  { key: "daemonConfig", rows: "daemonConfigRows", file: "daemon_config.jsonl", label: "Daemon config snapshot" },
  { key: "heartbeat", rows: "heartbeatRows", file: "heartbeat.jsonl", label: "Daemon heartbeat" },
];

const sourceByKey = Object.fromEntries(DATA_SOURCES.map((s) => [s.key, s]));
/** Chiave di impostazione dell'URL per una sorgente (stessa forma storica: hs.lanUrl, hs.bleUrl…). */
function sourceSettingKey(source) { return `${source.key}Url`; }

const SETTINGS_KEYS = {
  refreshMs: "hs.refreshMs", theme: "hs.theme",
  density: "hs.density",
  logBase: "hs.logBase",
  apiUrl: "hs.apiUrl",
  netLabel: "hs.net.label", netGateway: "hs.net.gateway",
  ...Object.fromEntries(DATA_SOURCES.map((s) => [sourceSettingKey(s), `hs.${sourceSettingKey(s)}`])),
};
const SETTINGS_DEFAULTS = {
  refreshMs: "30000", theme: "dark",
  density: "comfortable",
  // Cartella base da cui vengono serviti i log: nella pratica tutte le sorgenti stanno insieme
  // (dashboard/link-logs.sh le linka lì), quindi impostarla una volta sola evita di riscrivere
  // venti URL. Un singolo campo per sorgente resta disponibile per i casi misti.
  logBase: "",
  apiUrl: "",
  netLabel: "", netGateway: "",
  ...Object.fromEntries(DATA_SOURCES.map((s) => [sourceSettingKey(s), s.file])),
};

/** URL effettivo di una sorgente: l'eventuale override per-sorgente, altrimenti la cartella base
 * (se impostata) più il nome file di default. */
function sourceUrl(source) {
  const override = getSetting(sourceSettingKey(source));
  if (override && override !== source.file) return override;
  const base = (getSetting("logBase") || "").trim();
  if (!base) return source.file;
  return `${base.replace(/\/+$/, "")}/${source.file}`;
}

function getSetting(key) {
  const raw = localStorage.getItem(SETTINGS_KEYS[key]);
  return raw === null ? SETTINGS_DEFAULTS[key] : raw;
}
function setSetting(key, value) {
  localStorage.setItem(SETTINGS_KEYS[key], value);
}

/** Piccolo stato di UI persistito tra un refresh di pagina e l'altro (tab WiFi/BLE aperto, filtro
 * Timeline...) — a differenza di getSetting/setSetting non è pensato per campi mostrati in
 * Impostazioni, solo per "l'ultima cosa che l'utente stava guardando" su ricarica completa (un
 * semplice cambio di route/tab nella stessa sessione già persiste da solo, essendo solo `state`). */
const UI_STATE_KEY = "hs.uiState";
function loadPersistedUiState() {
  try { return JSON.parse(localStorage.getItem(UI_STATE_KEY) || "{}"); } catch { return {}; }
}
function savePersistedUiState(patch) {
  try { localStorage.setItem(UI_STATE_KEY, JSON.stringify({ ...loadPersistedUiState(), ...patch })); } catch { /* storage non disponibile (es. modalità privata): degrada silenziosamente a non persistere */ }
}

const DISMISSED_KEY = "hs.alerts.dismissed";
const RISK_PORTS = { 21: "FTP", 23: "Telnet", 445: "SMB", 3389: "RDP", 5900: "VNC" };

/** Company ID Bluetooth SIG più comuni (elenco parziale e curato, non il
 * registro completo — vedi bluetooth.com/specifications/assigned-numbers).
 * Un ID non presente qui viene mostrato come "ID 0x...". */
const BLE_COMPANY_IDS = {
  6: "Microsoft",
  15: "Broadcom",
  76: "Apple",
  89: "Nordic Semiconductor",
  117: "Samsung Electronics",
  224: "Google",
};
function bleCompanyLabel(id) {
  return BLE_COMPANY_IDS[id] || `ID 0x${Number(id).toString(16).padStart(4, "0")}`;
}

/* ---------------------------------------------------------------------- *
 * State
 * ---------------------------------------------------------------------- */

const state = {
  // Un array vuoto per ogni sorgente del registro (lanRows, wifiRows, …, heartbeatRows): così
  // aggiungere una sorgente resta una riga sola in DATA_SOURCES, senza doversi ricordare di
  // dichiarare anche qui il suo array.
  ...Object.fromEntries(DATA_SOURCES.map((s) => [s.rows, []])),
  lanFile: null,
  wifiFile: null,
  bleFile: null,
  lanSort: { key: "last_seen", dir: -1 },
  wifiSort: { key: "timestamp", dir: -1 },
  bleSort: { key: "timestamp", dir: -1 },
  route: "dashboard",
  refreshTimer: null,
  lastFetchOk: null,
  initialLoadDone: false,
  openMenuMac: null,
  expandedMac: null,
  alertsFilter: "active",
  alertsTypeFilter: "all",
  alertsSeverityFilter: "all",
  alertsHomeEmptyOnly: false,
  dismissedAlerts: new Set(JSON.parse(localStorage.getItem(DISMISSED_KEY) || "[]")),
  sourceStatus: {},
  cmdkOpen: false,
  deviceProfileMac: null,
  timelineKindFilter: loadPersistedUiState().timelineKindFilter || "all",
  timeRange: loadPersistedUiState().timeRange || "24h",
  radarFilters: { network: true, probe: true, ap: true, ble: true },
  hostFilters: { type: "all", vendor: "all", risk: "all", trust: "all", ports: "all" },
  hostStaleOnly: false,
  hostGroupByIdentity: false,
  hostSelectedMacs: new Set(),
  wifiSsidExpanded: null,
  wifiApFilters: { security: "all", band: "all" },
  wifiTab: loadPersistedUiState().wifiTab || "overview",
  bleTab: loadPersistedUiState().bleTab || "overview",
  pageScrollTarget: null,
  networkProfileBssid: null,
  profileOrigin: null,
  pagination: {},
};

/* ---------------------------------------------------------------------- *
 * JSON Lines parsing & loading
 * ---------------------------------------------------------------------- */

/**
 * Un oggetto JSON per riga. Una riga vuota è ignorata; una riga malformata
 * (tipicamente l'ultima, troncata da una scrittura interrotta sul daemon)
 * viene scartata invece di far fallire l'intero caricamento.
 */
function parseJsonl(text) {
  const rows = [];
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      rows.push(JSON.parse(trimmed));
    } catch {
      // riga incompleta/corrotta (es. scrittura interrotta a metà): la saltiamo
    }
  }
  return rows;
}

/**
 * Oltre questa soglia, fetchJsonl scarica solo la coda più recente del file
 * (via HTTP Range) invece dell'intero contenuto. I log JSONL sono
 * append-only e in ordine cronologico, quindi la coda è esattamente "i dati
 * più recenti" — utile perché un log come i probe WiFi (il più "rumoroso")
 * può arrivare a svariati MB anche con la rotazione lato daemon attiva
 * (--max-log-size-mb, default 20MB) prima che scatti.
 */
const TAIL_FETCH_BYTES = 4 * 1024 * 1024;

/**
 * Scarica e parsa un file JSONL. Ritorna { rows, truncated, totalBytes }:
 * `truncated` è true se è stata scaricata solo la coda (file più grande di
 * TAIL_FETCH_BYTES) — la dashboard lo segnala invece di far finta che i
 * dati siano completi. Il fetch "solo coda" richiede che il server statico
 * supporti le richieste HTTP Range (nginx: sì di default; il semplice
 * `python3 -m http.server` no — in quel caso si ripiega in automatico sul
 * download completo, senza errori).
 */
async function fetchJsonl(url) {
  try {
    const headRes = await fetch(url, { method: "HEAD", cache: "no-store" });
    if (headRes.ok) {
      const totalBytes = Number(headRes.headers.get("content-length"));
      if (totalBytes > TAIL_FETCH_BYTES) {
        const rangeRes = await fetch(url, {
          cache: "no-store",
          headers: { Range: `bytes=-${TAIL_FETCH_BYTES}` },
        });
        if (rangeRes.status === 206) {
          const lines = (await rangeRes.text()).split("\n");
          lines.shift(); // la prima riga del blocco è quasi certamente tagliata a metà: si scarta a priori
          return { rows: parseJsonl(lines.join("\n")), truncated: true, totalBytes };
        }
        // il server non supporta Range (status diverso da 206): si continua sotto col fetch completo
      }
    }
  } catch {
    // HEAD/Range falliti (CORS, server che non li implementa, file://…): si ripiega sul fetch completo
  }
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return { rows: parseJsonl(await res.text()), truncated: false, totalBytes: null };
}

function readJsonlFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(parseJsonl(String(reader.result)));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

let loadInFlight = false;

async function loadAll() {
  if (loadInFlight) return; // avoid overlapping fetches when the refresh interval is shorter than a load cycle
  loadInFlight = true;
  try {
    await loadAllOnce();
  } finally {
    loadInFlight = false;
  }
}

async function loadAllOnce() {
  hideError();
  const errors = [];

  // Un unico ciclo sul registro DATA_SOURCES al posto di venti blocchi try/catch identici: le
  // sorgenti opzionali che non esistono (modulo spento sul daemon) restano un caso normale e
  // silenzioso, solo quelle `required` risalgono come errore visibile all'utente.
  for (const source of DATA_SOURCES) {
    try {
      const localFile = source.fileKey ? state[source.fileKey] : null;
      if (localFile) {
        state[source.rows] = await readJsonlFile(localFile);
        state.sourceStatus[source.key] = { ok: true, count: state[source.rows].length, truncated: false };
      } else {
        const r = await fetchJsonl(sourceUrl(source));
        state[source.rows] = r.rows;
        state.sourceStatus[source.key] = { ok: true, count: r.rows.length, truncated: r.truncated, totalBytes: r.totalBytes };
      }
    } catch (err) {
      if (source.required) errors.push(`${source.label}: ${err.message}`);
      state[source.rows] = state[source.rows] || [];
      state.sourceStatus[source.key] = { ok: false, count: 0, truncated: false };
    }
  }
  try {
    const r = await fetchJsonl(getSetting("wifiNetworksUrl"));
    state.wifiNetworksRows = r.rows;
    state.sourceStatus.wifiNetworks = { ok: true, count: r.rows.length, truncated: r.truncated, totalBytes: r.totalBytes };
  } catch {
    state.wifiNetworksRows = state.wifiNetworksRows || [];
    state.sourceStatus.wifiNetworks = { ok: false, count: 0, truncated: false };
  }
  try {
    const r = await fetchJsonl(getSetting("dhcpEventsUrl"));
    state.dhcpEventsRows = r.rows;
    state.sourceStatus.dhcpEvents = { ok: true, count: r.rows.length, truncated: r.truncated, totalBytes: r.totalBytes };
  } catch {
    state.dhcpEventsRows = state.dhcpEventsRows || [];
    state.sourceStatus.dhcpEvents = { ok: false, count: 0, truncated: false };
  }
  try {
    const r = await fetchJsonl(getSetting("osFingerprintUrl"));
    state.osFingerprintRows = r.rows;
    state.sourceStatus.osFingerprint = { ok: true, count: r.rows.length, truncated: r.truncated, totalBytes: r.totalBytes };
  } catch {
    state.osFingerprintRows = state.osFingerprintRows || [];
    state.sourceStatus.osFingerprint = { ok: false, count: 0, truncated: false };
  }
  try {
    const r = await fetchJsonl(getSetting("dhcpLeasesUrl"));
    state.dhcpLeasesRows = r.rows;
    state.sourceStatus.dhcpLeases = { ok: true, count: r.rows.length, truncated: r.truncated, totalBytes: r.totalBytes };
  } catch {
    state.dhcpLeasesRows = state.dhcpLeasesRows || [];
    state.sourceStatus.dhcpLeases = { ok: false, count: 0, truncated: false };
  }
  try {
    const r = await fetchJsonl(getSetting("trendDailyUrl"));
    state.trendDailyRows = r.rows;
    state.sourceStatus.trendDaily = { ok: true, count: r.rows.length, truncated: r.truncated, totalBytes: r.totalBytes };
  } catch {
    state.trendDailyRows = state.trendDailyRows || [];
    state.sourceStatus.trendDaily = { ok: false, count: 0, truncated: false };
  }
  try {
    const r = await fetchJsonl(getSetting("bleIdentityLinksUrl"));
    state.bleIdentityLinksRows = r.rows;
    state.sourceStatus.bleIdentityLinks = { ok: true, count: r.rows.length, truncated: r.truncated, totalBytes: r.totalBytes };
  } catch {
    state.bleIdentityLinksRows = state.bleIdentityLinksRows || [];
    state.sourceStatus.bleIdentityLinks = { ok: false, count: 0, truncated: false };
  }
  try {
    const r = await fetchJsonl(getSetting("blePresenceUrl"));
    state.blePresenceRows = r.rows;
    state.sourceStatus.blePresence = { ok: true, count: r.rows.length, truncated: r.truncated, totalBytes: r.totalBytes };
  } catch {
    state.blePresenceRows = state.blePresenceRows || [];
    state.sourceStatus.blePresence = { ok: false, count: 0, truncated: false };
  }
  try {
    const r = await fetchJsonl(getSetting("deepScanUrl"));
    state.deepScanRows = r.rows;
    state.sourceStatus.deepScan = { ok: true, count: r.rows.length, truncated: r.truncated, totalBytes: r.totalBytes };
  } catch {
    state.deepScanRows = state.deepScanRows || [];
    state.sourceStatus.deepScan = { ok: false, count: 0, truncated: false };
  }
  try {
    const r = await fetchJsonl(getSetting("handshakeUrl"));
    state.handshakeRows = r.rows;
    state.sourceStatus.handshake = { ok: true, count: r.rows.length, truncated: r.truncated, totalBytes: r.totalBytes };
  } catch {
    state.handshakeRows = state.handshakeRows || [];
    state.sourceStatus.handshake = { ok: false, count: 0, truncated: false };
  }
  try {
    const r = await fetchJsonl(getSetting("wifiPresenceUrl"));
    state.wifiPresenceRows = r.rows;
    state.sourceStatus.wifiPresence = { ok: true, count: r.rows.length, truncated: r.truncated, totalBytes: r.totalBytes };
  } catch {
    state.wifiPresenceRows = state.wifiPresenceRows || [];
    state.sourceStatus.wifiPresence = { ok: false, count: 0, truncated: false };
  }
  try {
    const r = await fetchJsonl(getSetting("daemonConfigUrl"));
    state.daemonConfigRows = r.rows;
    state.sourceStatus.daemonConfig = { ok: true, count: r.rows.length, truncated: r.truncated, totalBytes: r.totalBytes };
  } catch {
    state.daemonConfigRows = state.daemonConfigRows || [];
    state.sourceStatus.daemonConfig = { ok: false, count: 0, truncated: false };
  }

  state.lastFetchOk = errors.length === 0;
  if (errors.length) showError(errors.join(" — "));
  document.getElementById("last-updated").textContent = new Date().toLocaleTimeString("en-GB");

  updateStatusPill();
  checkAlertNotifications();
  state.initialLoadDone = true;
  renderCurrentRoute();
}

function showError(msg) {
  const el = document.getElementById("error-banner");
  el.textContent = `Unable to load data. ${msg}`;
  el.classList.remove("hidden");
}
function hideError() {
  document.getElementById("error-banner").classList.add("hidden");
}

/* ---------------------------------------------------------------------- *
 * Shared helpers
 * ---------------------------------------------------------------------- */

function escapeHtml(value) {
  if (value === undefined || value === null) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseTs(value) {
  const t = typeof value === "number" ? value : Date.parse(value);
  return Number.isNaN(t) ? null : t;
}

function formatTs(value) {
  const ts = parseTs(value);
  if (ts === null) return escapeHtml(value);
  return new Date(ts).toLocaleString("en-GB");
}

function formatPorts(ports) {
  return Array.isArray(ports) && ports.length ? escapeHtml(ports.join(", ")) : "";
}

/**
 * Finestra temporale unica per tutta l'app. Prima ogni vista aveva la sua, hardcoded: 24h quasi
 * ovunque, 7/30 giorni solo nel Trend, "tutto lo storico caricato" altrove — e ognuna lo
 * dichiarava con parole sue ("last 24h", "all time", "across all loaded history"), lasciando
 * all'utente il compito di ricordarsi quale numero stesse guardando su quale periodo.
 */
const TIME_RANGES = [
  { id: "24h", label: "Last 24 hours", short: "24h", hours: 24 },
  { id: "7d", label: "Last 7 days", short: "7 days", hours: 24 * 7 },
  { id: "30d", label: "Last 30 days", short: "30 days", hours: 24 * 30 },
  { id: "all", label: "All loaded history", short: "all history", hours: null },
];

function currentRange() {
  return TIME_RANGES.find((r) => r.id === state.timeRange) || TIME_RANGES[0];
}
/** Etichetta breve da usare nei sottotitoli delle card, al posto dei vari "last 24h" scritti a mano. */
function rangeLabel() { return currentRange().short; }
/** Giorni coperti dalla finestra, per le viste giornaliere (Trend): almeno 7, perché un grafico
 * per giorno su 24 ore sarebbe una barra sola. */
function rangeDays() {
  const hours = currentRange().hours;
  return hours ? Math.max(7, Math.round(hours / 24)) : 30;
}

function withinRange(ts) {
  if (ts === null) return false;
  const hours = currentRange().hours;
  return hours === null || ts >= Date.now() - hours * 3600 * 1000;
}

/** Alias storico, mantenuto perché il nome compare in molti punti: ora segue la finestra scelta. */
function within24h(ts) {
  return withinRange(ts);
}

function avgRssi(rows) {
  const values = rows.map((r) => r.rssi).filter((v) => typeof v === "number");
  if (!values.length) return null;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

/** Livello di segnale a 4 barre, più leggibile di un dBm negativo per un widget rapido. */
function signalLevel(rssi) {
  if (typeof rssi !== "number") return { bars: 0, label: "N/A" };
  if (rssi >= -50) return { bars: 4, label: "Excellent" };
  if (rssi >= -65) return { bars: 3, label: "Good" };
  if (rssi >= -75) return { bars: 2, label: "Fair" };
  return { bars: 1, label: "Weak" };
}
function signalBarsHtml(rssi) {
  const { bars, label } = signalLevel(rssi);
  const cells = [1, 2, 3, 4].map((i) => `<span class="signal-bar ${i <= bars ? "on" : ""}" style="height:${i * 3 + 3}px"></span>`).join("");
  const title = typeof rssi === "number" ? `${label} (${rssi} dBm)` : "Signal not available";
  return `<span class="signal-bars" title="${escapeHtml(title)}">${cells}</span>`;
}

function formatDuration(ms) {
  if (!Number.isFinite(ms) || ms < 0) return "—";
  const minutes = Math.round(ms / 60000);
  if (minutes < 1) return "< 1 min";
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remMinutes = minutes % 60;
  if (hours < 24) return remMinutes ? `${hours} h ${remMinutes} min` : `${hours} h`;
  const days = Math.floor(hours / 24);
  const remHours = hours % 24;
  return remHours ? `${days} d ${remHours} h` : `${days} d`;
}

function formatRelativeTime(ts) {
  if (ts === null || Number.isNaN(ts)) return "—";
  const minutes = Math.round((Date.now() - ts) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return `${Math.round(hours / 24)} d ago`;
}

/* ---------------------------------------------------------------------- *
 * Paginazione generica per le tabelle: selettore righe per pagina +
 * scorrimento precedente/successiva. Lo stato (pagina, dimensione) vive in
 * state.pagination, chiave per chiave (una per tabella).
 * ---------------------------------------------------------------------- */

const PAGE_SIZE_OPTIONS = [50, 100, 200, 500];

function getPagination(key) {
  if (!state.pagination[key]) state.pagination[key] = { page: 1, pageSize: 50 };
  return state.pagination[key];
}

function paginate(rows, key) {
  const p = getPagination(key);
  const total = rows.length;
  const totalPages = p.pageSize === "all" ? 1 : Math.max(1, Math.ceil(total / p.pageSize));
  if (p.page > totalPages) p.page = totalPages;
  if (p.page < 1) p.page = 1;
  const pageRows = p.pageSize === "all" ? rows : rows.slice((p.page - 1) * p.pageSize, (p.page - 1) * p.pageSize + p.pageSize);
  return { pageRows, total, totalPages, page: p.page, pageSize: p.pageSize };
}

function paginationHtml(key, info) {
  return `<div class="pagination-row">
    <div class="pagination-size">
      <label for="page-size-${key}">Rows per page</label>
      <select class="select-control" id="page-size-${key}" data-page-size="${key}">
        ${PAGE_SIZE_OPTIONS.map((n) => `<option value="${n}" ${info.pageSize === n ? "selected" : ""}>${n}</option>`).join("")}
        <option value="all" ${info.pageSize === "all" ? "selected" : ""}>All</option>
      </select>
    </div>
    <div class="pagination-nav">
      <button class="btn btn-icon" data-page-nav="${key}" data-dir="prev" ${info.page <= 1 ? "disabled" : ""} aria-label="Previous page">${ICON("chevron-left")}</button>
      <span class="pagination-info">Page ${info.page} of ${info.totalPages} · ${info.total} rows</span>
      <button class="btn btn-icon" data-page-nav="${key}" data-dir="next" ${info.page >= info.totalPages ? "disabled" : ""} aria-label="Next page">${ICON("chevron-right")}</button>
    </div>
  </div>`;
}

function wirePagination(scope, key, onChange) {
  scope.querySelectorAll(`[data-page-size="${key}"]`).forEach((sel) => {
    sel.addEventListener("change", (e) => {
      const p = getPagination(key);
      p.pageSize = e.target.value === "all" ? "all" : Number(e.target.value);
      p.page = 1;
      onChange();
    });
  });
  scope.querySelectorAll(`[data-page-nav="${key}"]`).forEach((btn) => {
    btn.addEventListener("click", () => {
      getPagination(key).page += btn.dataset.dir === "next" ? 1 : -1;
      onChange();
    });
  });
}

function statusBadge(status) {
  const labels = { online: "Online", new: "New", offline: "Offline" };
  const label = labels[status] || status;
  return `<span class="badge status-${escapeHtml(status)}"><span class="dot"></span>${escapeHtml(label)}</span>`;
}

function compareIp(a, b) {
  const toParts = (ip) => String(ip ?? "").split(".").map((n) => Number(n) || 0);
  const pa = toParts(a), pb = toParts(b);
  for (let i = 0; i < 4; i++) {
    if (pa[i] !== pb[i]) return (pa[i] || 0) - (pb[i] || 0);
  }
  return 0;
}

function sortRows(rows, key, dir) {
  return [...rows].sort((a, b) => {
    if (key === "last_seen" || key === "timestamp" || key === "_ts") {
      return ((a._ts ?? 0) - (b._ts ?? 0)) * dir;
    }
    if (key === "rssi") {
      return ((Number(a.rssi) || 0) - (Number(b.rssi) || 0)) * dir;
    }
    if (key === "ip") {
      return (compareIp(a.ip, b.ip)) * dir;
    }
    return String(a[key] ?? "").localeCompare(String(b[key] ?? "")) * dir;
  });
}

/** <th> ordinabile con freccia ▲/▼ quando è la colonna attualmente in ordinamento — senza, l'unico
 * modo per capire come è ordinata una tabella è osservare l'ordine delle righe dopo il click. */
function sortableTh(label, key, sortState) {
  const arrow = sortState.key === key ? (sortState.dir === 1 ? " ▲" : " ▼") : "";
  return `<th data-sort="${key}">${escapeHtml(label)}${arrow}</th>`;
}

/** Wiring comune per gli header ordinabili di una tabella (Network Discovery, log grezzi WiFi/BLE):
 * click su un data-sort th cambia chiave/verso dell'ordinamento e richiama onChange per
 * ri-renderizzare — le tre tabelle duplicavano lo stesso blocco identico prima di questo helper. */
function wireSortableHeaders(theadEl, sortState, onChange) {
  theadEl.querySelectorAll("th[data-sort]").forEach((th) => {
    th.addEventListener("click", () => {
      const key = th.dataset.sort;
      if (sortState.key === key) sortState.dir *= -1;
      else { sortState.key = key; sortState.dir = 1; }
      onChange();
    });
  });
}

/** Aggiorna solo la freccia ▲/▼ sugli header di una tabella il cui <thead> è markup statico,
 * ricostruito una sola volta (log grezzi WiFi/BLE: solo il tbody viene ri-renderizzato ad ogni
 * ordinamento/ricerca/paginazione) — a differenza di sortableTh(), che invece va bene quando è
 * l'intero <thead> ad essere rigenerato ogni volta (Network Discovery). Il testo "pulito" della
 * colonna viene letto e memorizzato al primo giro, per non accumulare frecce sui giri successivi. */
function updateSortArrows(theadEl, sortState) {
  theadEl.querySelectorAll("th[data-sort]").forEach((th) => {
    const key = th.dataset.sort;
    if (!th.dataset.sortLabel) th.dataset.sortLabel = th.textContent;
    th.textContent = th.dataset.sortLabel + (sortState.key === key ? (sortState.dir === 1 ? " ▲" : " ▼") : "");
  });
}

/** Latest known row per MAC, from the LAN discovery log. */
function latestLanByMac(rows) {
  const byMac = new Map();
  for (const row of rows) {
    const ts = parseTs(row.timestamp);
    if (ts === null) continue;
    const prev = byMac.get(row.mac);
    if (!prev || ts >= prev._ts) byMac.set(row.mac, { ...row, _ts: ts });
  }
  return [...byMac.values()];
}

/** Mappa mac -> fingerprint più recente (da fingerprint_discovery.jsonl, se il modulo --fingerprint è attivo). */
function latestFingerprintByMac(rows) {
  const byMac = new Map();
  for (const row of rows) {
    const ts = parseTs(row.timestamp);
    if (ts === null) continue;
    const prev = byMac.get(row.mac);
    if (!prev || ts >= prev._ts) byMac.set(row.mac, { ...row, _ts: ts });
  }
  return byMac;
}

function sightingsForMac(mac) {
  return state.lanRows.filter((r) => r.mac === mac).sort((a, b) => (parseTs(a.timestamp) || 0) - (parseTs(b.timestamp) || 0));
}
function firstSeenTs(mac) {
  const s = sightingsForMac(mac);
  return s.length ? s[0].timestamp : null;
}

/** Ricostruisce le sessioni online/offline di un device dalle transizioni di stato già nel log LAN
 * (new/online aprono, offline chiude): nessun dato nuovo da raccogliere, solo un modo diverso di
 * guardare quello già scritto da ogni ciclo di scan. Se l'ultima riga non è "offline" la sessione
 * resta aperta ("ongoing") fino ad ora, non necessariamente perché il device è online adesso — solo
 * perché i dati caricati non coprono ancora un evento "offline" successivo. */
function computeUptimeSessions(mac) {
  const rows = sightingsForMac(mac);
  const sessions = [];
  let openStart = null;
  for (const r of rows) {
    const ts = parseTs(r.timestamp);
    if (ts === null) continue;
    if (r.status === "offline") {
      if (openStart !== null) {
        sessions.push({ start: openStart, end: ts });
        openStart = null;
      }
    } else if (openStart === null) {
      openStart = ts;
    }
  }
  if (openStart !== null) sessions.push({ start: openStart, end: null });
  return sessions;
}

/** % di tempo online nel periodo coperto dalla history caricata per questo MAC (dal primo evento ad ora). */
function computeUptimeSummary(mac) {
  const sessions = computeUptimeSessions(mac);
  if (!sessions.length) return null;
  const periodStart = sessions[0].start;
  const periodEnd = Date.now();
  const totalPeriod = periodEnd - periodStart;
  if (totalPeriod <= 0) return null;
  const onlineMs = sessions.reduce((sum, s) => sum + ((s.end ?? periodEnd) - s.start), 0);
  return { pct: Math.round((onlineMs / totalPeriod) * 100), sessions, periodStart, periodEnd };
}

/** Da dove si è arrivati a un profilo, per farci tornare indietro davvero: prima il pulsante
 * "back" riportava sempre a Network Discovery, anche arrivandoci da Avvisi, Timeline, Who's home
 * o dalla ricerca — il punto in cui l'app "dimenticava" il percorso dell'utente. */
function rememberOrigin() {
  const hash = window.location.hash || "#/dashboard";
  if (hash.startsWith("#/device/") || hash.startsWith("#/network/")) return; // profilo -> profilo: si tiene l'origine iniziale
  const route = getRouteById(hash.replace(/^#\/?/, "").split("/")[0]);
  state.profileOrigin = { hash, label: route.label };
}

function backToOriginHtml() {
  const origin = state.profileOrigin;
  return `<div class="page-section" style="margin-bottom:10px;">
    <button class="btn btn-icon" id="profile-back" title="Back to ${escapeHtml(origin ? origin.label : "Network Discovery")}">${ICON("arrow-left")}</button>
  </div>`;
}

function wireBackToOrigin(container) {
  container.querySelector("#profile-back")?.addEventListener("click", () => {
    const target = state.profileOrigin?.hash || "#/host";
    if (window.location.hash === target) onRouteChange();
    else window.location.hash = target;
  });
}

function goToDevice(mac) {
  rememberOrigin();
  window.location.hash = `#/device/${encodeURIComponent(mac)}`;
}

function goToNetwork(bssid) {
  rememberOrigin();
  window.location.hash = `#/network/${encodeURIComponent(bssid)}`;
}

/* ---------------------------------------------------------------------- *
 * Etichette device: nome personalizzato e stato "fidato", persistiti in
 * localStorage (per MAC). Un device fidato riduce il rumore — punteggio di
 * rischio più basso, severità degli alert attenuata — senza nascondere
 * nulla: resta comunque visibile ovunque, solo con priorità minore.
 * ---------------------------------------------------------------------- */

const DEVICE_LABELS_KEY = "hs.deviceLabels";

function getDeviceLabels() {
  try { return JSON.parse(localStorage.getItem(DEVICE_LABELS_KEY) || "{}"); } catch { return {}; }
}
function saveDeviceLabels(labels) { localStorage.setItem(DEVICE_LABELS_KEY, JSON.stringify(labels)); }

/* Raggruppamento multi-MAC: più MAC (WiFi+Ethernet dello stesso device, o MAC
 * randomizzati) possono essere collegati come "stesso device fisico" così
 * condividono nome/trusted. hs.deviceGroups mappa mac -> mac canonico
 * (un solo salto, mai una catena: linkDeviceIdentity ripunta sempre ogni
 * alias esistente al nuovo canonico, vedi sotto) — deliberatamente manuale:
 * indovinare da soli quali MAC sono lo stesso device non è mai certo al
 * 100%, quindi la dashboard può solo suggerire (stesso hostname), mai unire
 * automaticamente. */
const DEVICE_GROUPS_KEY = "hs.deviceGroups";

function getDeviceGroups() {
  try { return JSON.parse(localStorage.getItem(DEVICE_GROUPS_KEY) || "{}"); } catch { return {}; }
}
function saveDeviceGroups(groups) { localStorage.setItem(DEVICE_GROUPS_KEY, JSON.stringify(groups)); }

/** MAC canonico di un'identità: se `mac` è stato collegato ad un altro MAC come "stesso device", quello; altrimenti `mac` stesso. */
function canonicalMac(mac) {
  const groups = getDeviceGroups();
  return groups[mac] || mac;
}

/** Tutti i MAC della stessa identità di `mac` (incluso mac stesso), canonico per primo. */
function macsInIdentity(mac) {
  const canonical = canonicalMac(mac);
  const groups = getDeviceGroups();
  const linked = Object.entries(groups).filter(([, c]) => c === canonical).map(([m]) => m);
  return [canonical, ...linked.filter((m) => m !== canonical)];
}

/** Collega `mac` all'identità di `targetMac` ("stesso device fisico"): da qui condividono nome/trusted.
 * Se `mac` aveva già un'etichetta propria e il target no, la eredita invece di perderla silenziosamente. */
function linkDeviceIdentity(mac, targetMac) {
  if (!mac || !targetMac || mac === targetMac) return;
  const canonicalTarget = canonicalMac(targetMac);
  if (canonicalTarget === mac) return; // già collegati (o creerebbe un ciclo A->B->A)

  const existing = getDeviceLabel(mac);
  const targetLabel = getDeviceLabel(canonicalTarget);
  if ((existing.trusted || existing.name) && !(targetLabel.trusted || targetLabel.name)) {
    setDeviceLabel(canonicalTarget, existing);
  }

  const groups = getDeviceGroups();
  // Ogni MAC che puntava a `mac` come canonico va ripuntato al nuovo canonico:
  // canonicalMac fa un solo salto, non segue catene.
  for (const [m, c] of Object.entries(groups)) {
    if (c === mac) groups[m] = canonicalTarget;
  }
  groups[mac] = canonicalTarget;
  saveDeviceGroups(groups);

  const labels = getDeviceLabels();
  delete labels[mac];
  saveDeviceLabels(labels);
}

/** Scioglie il collegamento tra due MAC della stessa identità (torna ciascuno un'identità a sé stante).
 * Uno solo dei due è l'alias nella mappa (mai entrambi, vedi l'invariante mantenuto da linkDeviceIdentity):
 * accetta i due MAC in qualunque ordine invece di richiedere di sapere quale dei due lo sia. */
function unlinkDeviceIdentity(macA, macB) {
  const groups = getDeviceGroups();
  let changed = false;
  if (macA in groups) { delete groups[macA]; changed = true; }
  if (macB in groups) { delete groups[macB]; changed = true; }
  if (changed) saveDeviceGroups(groups);
}

function getDeviceLabel(mac) {
  const labels = getDeviceLabels();
  return labels[canonicalMac(mac)] || { trusted: false, name: "" };
}

function setDeviceLabel(mac, patch) {
  const canonical = canonicalMac(mac);
  const labels = getDeviceLabels();
  const next = { ...getDeviceLabel(canonical), ...patch };
  if (next.trusted || next.name) labels[canonical] = next;
  else delete labels[canonical]; // torna al default: nessuna voce da conservare
  saveDeviceLabels(labels);
}

/** Alias assegnato via file di configurazione del daemon (--config, sezione "devices"), scritto
 * in daemon_config.jsonl: un secondo livello di nome, sotto l'etichetta locale (che vince sempre
 * se impostata) ma sopra al fallback hostname/MAC — utile perché arriva già pronto su qualunque
 * browser/dispositivo apra la dashboard, senza dover rifare a mano l'assegnazione per ognuno. */
function daemonDeviceAlias(mac) {
  const daemonConfig = latestDaemonConfig(state.daemonConfigRows);
  const aliases = daemonConfig && daemonConfig.device_aliases;
  return (aliases && aliases[String(mac).toLowerCase()]) || "";
}

/* ---------------------------------------------------------------------- *
 * Scheda d'inventario di un device (proprietario, stanza, tipo, tag, note).
 * Due livelli, stessa logica dei nomi: quella del file di configurazione del
 * daemon vale per tutti i browser, quella locale la sovrascrive solo qui.
 * Prima esistevano solo nome e "fidato", entrambi in localStorage: nessun
 * posto dove annotare di chi è un device o in che stanza sta.
 * ---------------------------------------------------------------------- */

const DEVICE_CARDS_KEY = "hs.deviceCards";
const INVENTORY_FIELDS = [
  { key: "owner", label: "Owner", placeholder: "e.g. Marco" },
  { key: "room", label: "Room", placeholder: "e.g. Study" },
  { key: "type", label: "Type", placeholder: "e.g. Smartphone" },
  { key: "tags", label: "Tags", placeholder: "comma-separated" },
  { key: "notes", label: "Notes", placeholder: "anything worth remembering" },
];

function getLocalDeviceCards() {
  try { return JSON.parse(localStorage.getItem(DEVICE_CARDS_KEY) || "{}"); } catch { return {}; }
}
function saveLocalDeviceCards(cards) { localStorage.setItem(DEVICE_CARDS_KEY, JSON.stringify(cards)); }

function daemonDeviceCard(mac) {
  const daemonConfig = latestDaemonConfig(state.daemonConfigRows);
  const inventory = daemonConfig && daemonConfig.device_inventory;
  return (inventory && inventory[String(mac).toLowerCase()]) || {};
}

/** Scheda risultante: i campi del daemon, sovrascritti da quelli impostati localmente. */
function getDeviceCard(mac) {
  const canonical = canonicalMac(mac);
  const local = getLocalDeviceCards()[canonical] || {};
  const fromDaemon = daemonDeviceCard(mac);
  const merged = { ...fromDaemon, ...local };
  merged._sources = Object.fromEntries(INVENTORY_FIELDS.map((f) =>
    [f.key, local[f.key] !== undefined && local[f.key] !== "" ? "local" : (fromDaemon[f.key] ? "daemon" : null)]));
  return merged;
}

function setDeviceCardField(mac, key, value) {
  const canonical = canonicalMac(mac);
  const cards = getLocalDeviceCards();
  const card = { ...(cards[canonical] || {}) };
  const trimmed = String(value || "").trim();
  if (trimmed) card[key] = key === "tags" ? trimmed.split(",").map((t) => t.trim()).filter(Boolean) : trimmed;
  else delete card[key];
  if (Object.keys(card).length) cards[canonical] = card;
  else delete cards[canonical];
  saveLocalDeviceCards(cards);
}

function inventoryValueText(card, key) {
  const value = card[key];
  if (Array.isArray(value)) return value.join(", ");
  return value || "";
}

function inventoryEditorHtml(mac) {
  const card = getDeviceCard(mac);
  const hasDaemonCard = Object.keys(daemonDeviceCard(mac)).length > 0;
  return `<div class="inventory-editor">
    <div class="inventory-head">
      <strong>Device card</strong>
      ${hasDaemonCard ? `<span class="source-tag">${ICON("server")}From the daemon's config file</span>` : ""}
    </div>
    <div class="settings-grid">
      ${INVENTORY_FIELDS.map((f) => `<div class="field">
        <label for="inv-${f.key}">${escapeHtml(f.label)}${card._sources[f.key] === "daemon" ? " <span class=\"muted\">(from config)</span>" : ""}</label>
        <input type="text" id="inv-${f.key}" data-inventory-field="${f.key}"
               value="${escapeHtml(inventoryValueText(card, f.key))}" placeholder="${escapeHtml(f.placeholder)}">
      </div>`).join("")}
    </div>
    <p class="field-hint">Set here, these fields live in this browser only. To have them on every browser, add the device to the <code>devices</code> section of the daemon's config file (<code>--config</code>) — a value typed here always wins over the one from the file.</p>
  </div>`;
}

function wireInventoryEditor(container, mac, rerender) {
  container.querySelectorAll("[data-inventory-field]").forEach((input) => {
    input.addEventListener("change", (e) => {
      setDeviceCardField(mac, input.dataset.inventoryField, e.target.value);
      rerender();
    });
  });
}

/** Nome da mostrare per un device: etichetta locale se impostata (propria o ereditata
 * dall'identità collegata), poi l'alias da --config, altrimenti il fallback (hostname/MAC). */
function displayName(mac, fallback) {
  const label = getDeviceLabel(mac);
  return label.name || daemonDeviceAlias(mac) || fallback;
}

/** Rinomina rapida di un device (es. "Marco", "Sonia") senza dover passare dal profilo completo —
 * stessa etichetta salvata da lì (getDeviceLabel/setDeviceLabel), utile in particolare nelle viste
 * di presence dove il MAC da solo non dice chi sia il proprietario del device. `onRenamed` viene
 * richiamato dopo il salvataggio per permettere un re-render immediato senza ricaricare la pagina. */
function promptRenameDevice(mac, onRenamed) {
  const current = getDeviceLabel(mac).name || "";
  const name = prompt("Name for this device (e.g. a person's name):", current);
  if (name === null) return; // annullato
  setDeviceLabel(mac, { name: name.trim() });
  if (onRenamed) onRenamed();
}

/* Suggerimenti di identità: due MAC con lo stesso hostname non ancora
 * collegati potrebbero essere lo stesso device (es. interfaccia WiFi ed
 * Ethernet). Mai applicati automaticamente — solo un suggerimento
 * scartabile, l'unione resta sempre una scelta esplicita dell'utente. */
const IDENTITY_SUGGESTIONS_DISMISSED_KEY = "hs.identitySuggestions.dismissed";

function getDismissedIdentitySuggestions() {
  try { return new Set(JSON.parse(localStorage.getItem(IDENTITY_SUGGESTIONS_DISMISSED_KEY) || "[]")); } catch { return new Set(); }
}
function suggestionKey(macA, macB) { return [macA, macB].sort().join("|"); }
function dismissIdentitySuggestion(macA, macB) {
  const set = getDismissedIdentitySuggestions();
  set.add(suggestionKey(macA, macB));
  localStorage.setItem(IDENTITY_SUGGESTIONS_DISMISSED_KEY, JSON.stringify([...set]));
}
function isIdentitySuggestionDismissed(macA, macB) {
  return getDismissedIdentitySuggestions().has(suggestionKey(macA, macB));
}

/** MAC non ancora collegati a `mac` che condividono lo stesso hostname corrente (non vuoto). */
function suggestedIdentityMatches(mac) {
  const current = latestLanByMac(state.lanRows).find((d) => d.mac === mac);
  const hostname = (current?.hostname || "").trim();
  if (!hostname) return [];
  const alreadyLinked = new Set(macsInIdentity(mac));
  return latestLanByMac(state.lanRows)
    .filter((d) => !alreadyLinked.has(d.mac) && (d.hostname || "").trim() === hostname)
    .map((d) => d.mac)
    .filter((m) => !isIdentitySuggestionDismissed(mac, m));
}

/** MAC suggeriti dal daemon (ble_identity_links.jsonl) come possibile stesso device di `mac` su
 * un indirizzo BLE ruotato (RPA) — mai applicato automaticamente, solo un suggerimento scartabile,
 * stesso principio di suggestedIdentityMatches. */
function suggestedBleIdentityMatches(mac) {
  const alreadyLinked = new Set(macsInIdentity(mac));
  const candidates = new Set();
  for (const link of state.bleIdentityLinksRows) {
    if (link.mac_old === mac && !alreadyLinked.has(link.mac_new)) candidates.add(link.mac_new);
    if (link.mac_new === mac && !alreadyLinked.has(link.mac_old)) candidates.add(link.mac_old);
  }
  return [...candidates].filter((m) => !isIdentitySuggestionDismissed(mac, m));
}

function trustBadgeHtml(mac) {
  if (!getDeviceLabel(mac).trusted) return "";
  return `<span class="badge trust-badge" title="Marked as trusted">${ICON("shield")}Trusted</span>`;
}

/* ---------------------------------------------------------------------- *
 * Risk score: punteggio euristico 0-100 per device, combina porte a
 * rischio esposte, alert collegati e incertezza sul tipo di device (nessun
 * fingerprint disponibile). Non è una valutazione di sicurezza formale,
 * solo un modo per ordinare "cosa guardare per primo". Un device
 * contrassegnato come fidato pesa meno (il rumore si riduce, il dato resta
 * comunque visibile).
 * ---------------------------------------------------------------------- */

function computeRiskScore(device, fingerprint, deviceAlerts) {
  let score = 0;
  const ports = Array.isArray(device?.open_ports) ? device.open_ports : [];
  for (const p of ports) {
    if (p === 23 || p === 3389 || p === 5900) score += 22; // telnet, RDP, VNC
    else if (p === 21 || p === 445) score += 12; // FTP, SMB
    else score += 3;
  }
  for (const a of deviceAlerts || []) {
    if (a.severity === "critical") score += 20;
    else if (a.severity === "serious") score += 10;
    else score += 4;
  }
  if (!fingerprint || !fingerprint.device_type || fingerprint.device_type === "Unknown") score += 5;
  if (device?.mac && getDeviceLabel(device.mac).trusted) score *= 0.4;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function riskLevel(score) {
  if (score >= 70) return { label: "Critical", tone: "critical" };
  if (score >= 40) return { label: "High", tone: "serious" };
  if (score >= 15) return { label: "Medium", tone: "warning" };
  return { label: "Low", tone: "good" };
}

function riskBadgeHtml(score) {
  const level = riskLevel(score);
  return `<span class="badge risk-badge tone-${level.tone}" title="Heuristic risk score 0-100, based on exposed ports and linked alerts">${score} · ${level.label}</span>`;
}

/** Mappa mac -> alert collegati (da computeAlerts(), già calcolato dal chiamante). */
function groupAlertsByMac(alerts) {
  const byMac = new Map();
  for (const a of alerts) {
    if (!a.mac) continue;
    if (!byMac.has(a.mac)) byMac.set(a.mac, []);
    byMac.get(a.mac).push(a);
  }
  return byMac;
}

function bucketRowsByHour(rows) {
  const now = new Date();
  now.setMinutes(0, 0, 0);
  const buckets = Array.from({ length: 24 }, () => []);
  for (const row of rows) {
    const ts = parseTs(row.timestamp);
    if (ts === null) continue;
    const hourFloor = new Date(ts);
    hourFloor.setMinutes(0, 0, 0);
    const hoursAgo = Math.round((now.getTime() - hourFloor.getTime()) / 3600000);
    if (hoursAgo >= 0 && hoursAgo < 24) buckets[23 - hoursAgo].push(row);
  }
  return buckets;
}
function hourlyCounts(rows) { return bucketRowsByHour(rows).map((b) => b.length); }
function hourlyDistinctMac(rows) { return bucketRowsByHour(rows).map((b) => new Set(b.map((r) => r.mac)).size); }

/**
 * Trend storici (settimana/mese): calcolati lato browser sull'intera
 * cronologia già caricata dai file JSONL (che, non essendo ruotati dal
 * daemon, coprono di norma tutta la storia disponibile) — non serve un
 * layer di query separato sullo specchio SQLite del daemon.
 */
function bucketRowsByDay(rows, days) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const buckets = Array.from({ length: days }, () => []);
  for (const row of rows) {
    const ts = parseTs(row.timestamp);
    if (ts === null) continue;
    const dayFloor = new Date(ts);
    dayFloor.setHours(0, 0, 0, 0);
    const daysAgo = Math.round((now.getTime() - dayFloor.getTime()) / 86400000);
    if (daysAgo >= 0 && daysAgo < days) buckets[days - 1 - daysAgo].push(row);
  }
  return buckets;
}
function dailyCounts(rows, days) { return bucketRowsByDay(rows, days).map((b) => b.length); }

function periodDelta(rows, days) {
  const now = Date.now();
  const dayMs = 86400000;
  const curStart = now - days * dayMs;
  const prevStart = now - 2 * days * dayMs;
  let cur = 0, prev = 0;
  for (const row of rows) {
    const ts = parseTs(row.timestamp);
    if (ts === null) continue;
    if (ts >= curStart) cur += 1;
    else if (ts >= prevStart) prev += 1;
  }
  const deltaPct = prev > 0 ? Math.round(((cur - prev) / prev) * 100) : (cur > 0 ? 100 : 0);
  return { cur, prev, deltaPct };
}

function trendSubLabel(d) {
  if (d.prev === 0 && d.cur === 0) return "No events in this period";
  const arrow = d.deltaPct > 0 ? "▲" : d.deltaPct < 0 ? "▼" : "▬";
  return `${arrow} ${Math.abs(d.deltaPct)}% vs previous period`;
}

/* ---------------------------------------------------------------------- *
 * Trend: preferisce il rollup giornaliero del daemon (trend_daily.jsonl,
 * calcolato dal daemon sull'intero storico in SQLite) al posto di ricontare
 * dalle righe JSONL grezze già caricate in pagina — quelle, oltre una certa
 * dimensione, sono solo la coda scaricata dalla dashboard (TAIL_FETCH_BYTES)
 * o quanto non ancora ruotato lato daemon (--max-log-size-mb): su una rete
 * affollata un Trend a 30 giorni calcolato così può risultare tagliato ben
 * prima che i dati siano davvero scomparsi. Il rollup non ha questo limite,
 * ma è un modulo opzionale (richiede lo specchio SQLite lato daemon, attivo
 * di default ma disattivabile con --no-db/--no-trend-rollup): se assente o
 * non ancora popolato per il periodo richiesto, si ricade sul calcolo dalle
 * righe già caricate, come prima.
 * ---------------------------------------------------------------------- */

/** Ultima riga per data dal rollup (il file è append-only e in ordine cronologico: l'ultima vince). */
function latestRollupByDate() {
  const byDate = new Map();
  for (const row of state.trendDailyRows) {
    if (row.date) byDate.set(row.date, row);
  }
  return byDate;
}

function isoDateDaysAgo(daysAgo) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

/** true se il rollup copre almeno una parte degli ultimi `days` giorni (altrimenti meglio il fallback). */
function hasRollupCoverage(days) {
  const byDate = latestRollupByDate();
  if (!byDate.size) return false;
  for (let daysAgo = 0; daysAgo < days; daysAgo++) {
    if (byDate.has(isoDateDaysAgo(daysAgo))) return true;
  }
  return false;
}

function dailyCountsFromRollup(field, days) {
  const byDate = latestRollupByDate();
  const buckets = [];
  for (let daysAgo = days - 1; daysAgo >= 0; daysAgo--) {
    const row = byDate.get(isoDateDaysAgo(daysAgo));
    buckets.push(row ? (row[field] || 0) : 0);
  }
  return buckets;
}

function periodDeltaFromRollup(field, days) {
  const byDate = latestRollupByDate();
  let cur = 0, prev = 0;
  for (let daysAgo = 0; daysAgo < 2 * days; daysAgo++) {
    const row = byDate.get(isoDateDaysAgo(daysAgo));
    const n = row ? (row[field] || 0) : 0;
    if (daysAgo < days) cur += n; else prev += n;
  }
  const deltaPct = prev > 0 ? Math.round(((cur - prev) / prev) * 100) : (cur > 0 ? 100 : 0);
  return { cur, prev, deltaPct };
}

/** Variante di renderBarChart con tick giornalieri invece che orari. */
function renderDayBarChart(container, buckets, days) {
  container.innerHTML = "";
  const total = buckets.reduce((a, b) => a + b, 0);
  if (total === 0) return; // CSS :empty mostra il placeholder

  const max = Math.max(...buckets, 1);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const showEvery = days > 14 ? 5 : days > 7 ? 2 : 1;

  const plot = document.createElement("div");
  plot.className = "bar-plot";
  const ticks = document.createElement("div");
  ticks.className = "bar-ticks";

  buckets.forEach((count, idx) => {
    const daysAgo = days - 1 - idx;
    const date = new Date(now.getTime() - daysAgo * 86400000);
    const dateLabel = date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" });

    const col = document.createElement("div");
    col.className = "bar-col";
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${Math.max((count / max) * 100, count > 0 ? 3 : 0)}%`;
    attachTooltip(bar, `${dateLabel} — ${count} event${count === 1 ? "" : "s"}`);
    col.appendChild(bar);
    plot.appendChild(col);

    const tick = document.createElement("span");
    tick.className = "bar-tick";
    tick.textContent = idx % showEvery === 0 ? dateLabel : "";
    ticks.appendChild(tick);
  });

  container.append(plot, ticks);
}

/* ---------------------------------------------------------------------- *
 * "What changed": confronto fra il periodo corrente e quello precedente.
 * Il Trend risponde a "quanti", questa pagina a "quali" — la domanda che ci
 * si pone davvero riaprendo la dashboard dopo qualche giorno.
 * ---------------------------------------------------------------------- */

/** Stato della rete a una certa data limite: device noti, porte aperte per device, reti viste.
 * Ricostruito dagli eventi già caricati, senza bisogno di snapshot lato daemon. */
function networkSnapshotAt(cutoffMs) {
  const devices = new Map();
  for (const row of state.lanRows) {
    const ts = parseTs(row.timestamp);
    if (ts === null || ts > cutoffMs || !row.mac) continue;
    const prev = devices.get(row.mac);
    if (!prev || ts >= prev.ts) {
      devices.set(row.mac, {
        ts, mac: row.mac, ip: row.ip, hostname: row.hostname || "", status: row.status,
        ports: Array.isArray(row.open_ports) ? [...row.open_ports] : (prev ? prev.ports : []),
      });
    }
  }
  const networks = new Map();
  for (const row of state.wifiNetworksRows) {
    const ts = parseTs(row.timestamp);
    if (ts === null || ts > cutoffMs || !row.bssid) continue;
    networks.set(row.bssid, { bssid: row.bssid, ssid: row.ssid || "", security: row.security });
  }
  return { devices, networks };
}

/** Differenze fra due istantanee: device comparsi/spariti, porte aperte/chiuse, reti nuove o
 * sparite, e cambi di sicurezza di una rete (il più interessante dei tre lato sicurezza). */
function computeNetworkDiff(previousCutoff, currentCutoff) {
  const before = networkSnapshotAt(previousCutoff);
  const now = networkSnapshotAt(currentCutoff);

  const appearedDevices = [...now.devices.values()].filter((d) => !before.devices.has(d.mac));
  const goneDevices = [...before.devices.values()].filter((d) => {
    const current = now.devices.get(d.mac);
    return d.status !== "offline" && (!current || current.status === "offline");
  });

  const portChanges = [];
  for (const [mac, current] of now.devices) {
    const previous = before.devices.get(mac);
    if (!previous) continue;
    const opened = current.ports.filter((p) => !previous.ports.includes(p));
    const closed = previous.ports.filter((p) => !current.ports.includes(p));
    if (opened.length || closed.length) portChanges.push({ mac, hostname: current.hostname, opened, closed });
  }

  const appearedNetworks = [...now.networks.values()].filter((n) => !before.networks.has(n.bssid));
  const goneNetworks = [...before.networks.values()].filter((n) => !now.networks.has(n.bssid));
  const securityChanges = [];
  for (const [bssid, current] of now.networks) {
    const previous = before.networks.get(bssid);
    if (previous && previous.security !== current.security) {
      securityChanges.push({ ...current, from: previous.security, to: current.security });
    }
  }

  return { appearedDevices, goneDevices, portChanges, appearedNetworks, goneNetworks, securityChanges };
}

function diffSectionHtml(title, sub, rows, emptyText) {
  return `<div class="card">
    <div class="card-head"><h2>${escapeHtml(title)}</h2><span class="card-sub">${escapeHtml(sub)}</span></div>
    ${rows.length ? `<div class="diff-list">${rows.join("")}</div>` : `<p class="empty-state">${escapeHtml(emptyText)}</p>`}
  </div>`;
}

function renderWhatChanged(container) {
  const hours = currentRange().hours || 24 * 30;
  const now = Date.now();
  const diff = computeNetworkDiff(now - hours * 3600 * 1000, now);
  const totalChanges = diff.appearedDevices.length + diff.goneDevices.length + diff.portChanges.length
    + diff.appearedNetworks.length + diff.goneNetworks.length + diff.securityChanges.length;

  const deviceRow = (d, tone, verb) => `<div class="diff-row tone-${tone}">
    <button class="link-cell" data-mac-link="${escapeHtml(d.mac)}">${escapeHtml(displayName(d.mac, d.hostname || d.mac))}</button>
    <span class="muted">${escapeHtml(d.ip || "")}</span>
    <span class="diff-verb">${escapeHtml(verb)}</span>
  </div>`;

  container.innerHTML = `
    <div class="page-section kpi-row">
      ${kpiTile({
        label: "Changes in this window", icon: "layers", tone: totalChanges ? "violet" : "good",
        value: totalChanges, sub: `compared with the ${rangeLabel()} before it`,
      })}
      ${kpiTile({
        label: "Devices appeared", icon: "monitor", tone: diff.appearedDevices.length ? "critical" : "good",
        value: diff.appearedDevices.length, sub: diff.appearedDevices.length ? "Not present in the previous window" : "None new",
        subTone: diff.appearedDevices.length ? "critical" : "good",
      })}
      ${kpiTile({
        label: "Ports opened/closed", icon: "shield", tone: diff.portChanges.length ? "critical" : "good",
        value: diff.portChanges.length, sub: "Devices whose open ports changed",
        subTone: diff.portChanges.length ? "critical" : "good",
      })}
      ${kpiTile({
        label: "Network changes", icon: "wifi", tone: diff.securityChanges.length ? "critical" : "blue",
        value: diff.appearedNetworks.length + diff.goneNetworks.length + diff.securityChanges.length,
        sub: `${diff.securityChanges.length} changed security type`,
        subTone: diff.securityChanges.length ? "critical" : undefined,
      })}
    </div>

    <div class="page-section grid-2">
      ${diffSectionHtml("Devices appeared", `${diff.appearedDevices.length} new on the LAN`,
        diff.appearedDevices.map((d) => deviceRow(d, "critical", "first seen " + formatRelativeTime(d.ts))),
        "No device appeared that wasn't already there.")}
      ${diffSectionHtml("Devices gone", `${diff.goneDevices.length} no longer online`,
        diff.goneDevices.map((d) => deviceRow(d, "muted", "last seen " + formatRelativeTime(d.ts))),
        "Nothing that was online has disappeared.")}
    </div>

    <div class="page-section">
      ${diffSectionHtml("Open ports changed", `${diff.portChanges.length} device(s)`,
        diff.portChanges.map((c) => `<div class="diff-row tone-${c.opened.length ? "critical" : "good"}">
          <button class="link-cell" data-mac-link="${escapeHtml(c.mac)}">${escapeHtml(displayName(c.mac, c.hostname || c.mac))}</button>
          ${c.opened.length ? `<span class="diff-verb tone-critical">opened ${c.opened.join(", ")}</span>` : ""}
          ${c.closed.length ? `<span class="diff-verb tone-good">closed ${c.closed.join(", ")}</span>` : ""}
        </div>`),
        "No device opened or closed a port in this window.")}
    </div>

    <div class="page-section grid-2">
      ${diffSectionHtml("WiFi networks appeared", `${diff.appearedNetworks.length} new BSSID(s) nearby`,
        diff.appearedNetworks.map((n) => `<div class="diff-row tone-blue">
          <button class="link-cell" data-bssid-link="${escapeHtml(n.bssid)}">${escapeHtml(n.ssid || "(hidden network)")}</button>
          <span class="muted mono">${escapeHtml(n.bssid)}</span>
          ${wifiSecurityBadgeHtml(n.security)}${homeNetworkBadgeHtml(n.ssid)}
        </div>`),
        "No new WiFi network appeared nearby.")}
      ${diffSectionHtml("Security changed", `${diff.securityChanges.length} network(s)`,
        diff.securityChanges.map((n) => `<div class="diff-row tone-critical">
          <button class="link-cell" data-bssid-link="${escapeHtml(n.bssid)}">${escapeHtml(n.ssid || "(hidden network)")}</button>
          <span class="diff-verb">${escapeHtml(WIFI_SECURITY_META[n.from]?.label || n.from)} → ${escapeHtml(WIFI_SECURITY_META[n.to]?.label || n.to)}</span>
          ${homeNetworkBadgeHtml(n.ssid)}
        </div>`),
        "No network changed its advertised security type.")}
    </div>

    <p class="field-hint">Both windows are reconstructed from the log history already loaded, so a period longer than the retained logs will show fewer changes than really happened. Use the range selector in the top bar to change the comparison window: it always compares the selected window with the one immediately before it.</p>
  `;

  container.querySelectorAll("[data-mac-link]").forEach((btn) => {
    btn.addEventListener("click", () => goToDevice(btn.dataset.macLink));
  });
  container.querySelectorAll("[data-bssid-link]").forEach((btn) => {
    btn.addEventListener("click", () => goToNetwork(btn.dataset.bssidLink));
  });
}

function renderTrend(container) {
  // Il periodo arriva dal controllo globale in topbar invece che da un secondo selettore locale:
  // era l'unica pagina con una nozione di tempo tutta sua, e con due controlli non si capiva
  // quale comandasse cosa.
  const range = rangeDays();
  const useRollup = hasRollupCoverage(range);

  let newDelta, alertDelta, newBuckets, alertBuckets;
  if (useRollup) {
    newDelta = periodDeltaFromRollup("new_devices", range);
    alertDelta = periodDeltaFromRollup("alerts", range);
    newBuckets = dailyCountsFromRollup("new_devices", range);
    alertBuckets = dailyCountsFromRollup("alerts", range);
  } else {
    const newDevices = state.lanRows.filter((r) => r.status === "new");
    const alertRows = computeAlerts().filter((a) => a.ts !== null).map((a) => ({ timestamp: new Date(a.ts).toISOString() }));
    newDelta = periodDelta(newDevices, range);
    alertDelta = periodDelta(alertRows, range);
    newBuckets = dailyCounts(newDevices, range);
    alertBuckets = dailyCounts(alertRows, range);
  }

  container.innerHTML = `
    <div class="page-section kpi-row">
      ${kpiTile({
        label: `New devices (${range}d)`, icon: "monitor", tone: "violet",
        value: newDelta.cur, sub: trendSubLabel(newDelta), subTone: newDelta.deltaPct > 0 ? "critical" : "good",
      })}
      ${kpiTile({
        label: `Alerts generated (${range}d)`, icon: "shield", tone: "critical",
        value: alertDelta.cur, sub: trendSubLabel(alertDelta), subTone: alertDelta.deltaPct > 0 ? "critical" : "good",
      })}
    </div>
    <div class="page-section grid-2">
      <div class="card">
        <div class="card-head"><h2>New devices</h2><span class="card-sub">per day</span></div>
        <div class="bar-chart" id="chart-trend-new" data-empty="No data"></div>
      </div>
      <div class="card">
        <div class="card-head"><h2>Alerts generated</h2><span class="card-sub">per day</span></div>
        <div class="bar-chart" id="chart-trend-alerts" data-empty="No data"></div>
      </div>
    </div>
    <p class="field-hint">${useRollup
      ? `Calculated from the daemon's daily rollup (<code>trend_daily.jsonl</code>, built from the full SQLite history) — accurate over the whole ${range}-day period regardless of how large the raw JSONL logs have grown.`
      : `Calculated in the browser from the log history already loaded — no separate query server needed. The daemon rotates the JSONL files past a certain size (<code>--max-log-size-mb</code>, default 20MB) and, to stay fast, the dashboard only downloads the most recent tail of the largest files (see the warning on the WiFi/BLE page, if shown): over 30 days the trend may therefore not cover the whole period if the log has already rotated or was truncated on load. Enable the daemon's daily rollup (on by default, needs the SQLite mirror) for an accurate trend regardless of log size.`}</p>
  `;

  renderDayBarChart(document.getElementById("chart-trend-new"), newBuckets, range);
  renderDayBarChart(document.getElementById("chart-trend-alerts"), alertBuckets, range);
}

function attachTooltip(el, text) {
  const tooltip = document.getElementById("tooltip");
  el.addEventListener("mouseenter", (e) => { tooltip.textContent = text; tooltip.classList.remove("hidden"); position(e); });
  el.addEventListener("mousemove", position);
  el.addEventListener("mouseleave", () => tooltip.classList.add("hidden"));
  function position(e) {
    tooltip.style.left = `${e.clientX}px`;
    tooltip.style.top = `${e.clientY - 6}px`;
  }
}

/* ---------------------------------------------------------------------- *
 * Small chart widgets
 * ---------------------------------------------------------------------- */

function sparklineSvg(values, colorVar) {
  const w = 100, h = 32;
  const max = Math.max(...values, 1);
  const stepX = values.length > 1 ? w / (values.length - 1) : 0;
  const points = values.map((v, i) => `${(i * stepX).toFixed(1)},${(h - (v / max) * (h - 4) - 2).toFixed(1)}`).join(" ");
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><polyline points="${points}" fill="none" style="stroke:${colorVar}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

/** `navKey`, se passato, rende il tile come un `<button>` cliccabile (`data-kpi-nav="navKey"`)
 * invece di un `<div>` inerte — vedi wireKpiNav per collegarne il click a una destinazione. */
function kpiTile({ label, icon, tone, value, valueSuffix, sub, subTone, sparkValues, sparkColor, navKey }) {
  const tag = navKey ? "button" : "div";
  const openTag = navKey
    ? `<button type="button" class="kpi-tile kpi-tile-clickable" data-kpi-nav="${escapeHtml(navKey)}">`
    : `<div class="kpi-tile">`;
  return `${openTag}
    <div class="kpi-top">
      <span class="kpi-label">${escapeHtml(label)}</span>
      <span class="kpi-icon tone-${tone}">${ICON(icon)}</span>
    </div>
    <div class="kpi-value">${value}${valueSuffix ? ` <small>${escapeHtml(valueSuffix)}</small>` : ""}</div>
    ${sub ? `<div class="kpi-sub ${subTone ? "tone-" + subTone : ""}">${escapeHtml(sub)}</div>` : ""}
    ${sparkValues && sparkValues.length ? `<div class="kpi-spark">${sparklineSvg(sparkValues, sparkColor)}</div>` : ""}
  </${tag}>`;
}

/** Collega il click dei kpiTile() renderizzati con `navKey` dentro `container`: `handlers` mappa
 * navKey -> callback. Stesso pattern di wirePageTabs/wireSortableHeaders (render, poi wire). */
function wireKpiNav(container, handlers) {
  container.querySelectorAll("[data-kpi-nav]").forEach((el) => {
    const handler = handlers[el.dataset.kpiNav];
    if (handler) el.addEventListener("click", handler);
  });
}

function renderBarChart(container, buckets) {
  container.innerHTML = "";
  const total = buckets.reduce((a, b) => a + b, 0);
  if (total === 0) return; // CSS :empty shows the placeholder

  const max = Math.max(...buckets, 1);
  const now = new Date();
  now.setMinutes(0, 0, 0);

  const plot = document.createElement("div");
  plot.className = "bar-plot";
  const ticks = document.createElement("div");
  ticks.className = "bar-ticks";

  buckets.forEach((count, idx) => {
    const hoursAgo = 23 - idx;
    const hourDate = new Date(now.getTime() - hoursAgo * 3600000);

    const col = document.createElement("div");
    col.className = "bar-col";
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${Math.max((count / max) * 100, count > 0 ? 3 : 0)}%`;
    attachTooltip(bar, `${hourDate.getHours()}:00 — ${count} event${count === 1 ? "" : "s"}`);
    col.appendChild(bar);
    plot.appendChild(col);

    const tick = document.createElement("span");
    tick.className = "bar-tick";
    tick.textContent = idx % 4 === 0 ? `${hourDate.getHours()}h` : "";
    ticks.appendChild(tick);
  });

  container.append(plot, ticks);
}

/** Grafico a barre orizzontali per una classifica label -> valore (già ordinata/limitata dal
 * chiamante). `color` è una stringa CSS uniforme per tutte le barre, oppure una funzione
 * `(label, value, index) => stringa CSS` per colorare ogni barra in base al suo significato (es.
 * per severità, vedi computeWifiSecurityBreakdown). */
function renderHBarChart(container, entries, color) {
  container.innerHTML = "";
  if (!entries.length) return; // CSS :empty mostra il placeholder

  const resolveColor = typeof color === "function" ? color
    : Array.isArray(color) ? (_label, _value, index) => color[index]
    : () => color;
  const max = Math.max(...entries.map(([, value]) => value), 1);
  entries.forEach(([label, value], index) => {
    const row = document.createElement("div");
    row.className = "hbar-row";

    const name = document.createElement("span");
    name.className = "hbar-name";
    name.textContent = label;
    name.title = label;

    const track = document.createElement("div");
    track.className = "hbar-track";
    const fill = document.createElement("div");
    fill.className = "hbar-fill";
    fill.style.width = `${Math.max((value / max) * 100, 4)}%`;
    fill.style.background = resolveColor(label, value, index);
    attachTooltip(fill, `${label}: ${value}`);
    track.appendChild(fill);

    const val = document.createElement("span");
    val.className = "hbar-value";
    val.textContent = value;

    row.append(name, track, val);
    container.appendChild(row);
  });
}

/* ---------------------------------------------------------------------- *
 * Derived views: vendor / status distribution, alerts, scan cycles
 * ---------------------------------------------------------------------- */

function riskSegments(devices) {
  const fingerprintByMac = latestFingerprintByMac(state.fingerprintRows);
  const alertsByMac = groupAlertsByMac(computeAlerts());
  const counts = { Low: 0, Medium: 0, High: 0, Critical: 0 };
  for (const d of devices) {
    const score = computeRiskScore(d, fingerprintByMac.get(d.mac), alertsByMac.get(d.mac));
    counts[riskLevel(score).label] += 1;
  }
  return [
    { label: "Low", value: counts.Low, color: "var(--status-good)" },
    { label: "Medium", value: counts.Medium, color: "var(--status-warning)" },
    { label: "High", value: counts.High, color: "var(--status-serious)" },
    { label: "Critical", value: counts.Critical, color: "var(--status-critical)" },
  ];
}

/** Riepilogo compatto della pagina Host (device totali/attivi/offline + distribuzione del rischio),
 * per la pagina Nearby ora che è la home: stessa logica di conteggio già usata dal KPI "Active hosts"
 * e dal donut "Risk distribution" della Dashboard, non una nuova definizione di "attivo". */
function computeHostSummary() {
  const lanCurrent = latestLanByMac(state.lanRows);
  const total = lanCurrent.length;
  const active = lanCurrent.filter((d) => d.status !== "offline").length;
  const segments = riskSegments(lanCurrent);
  return { total, active, offline: total - active, risk: Object.fromEntries(segments.map((s) => [s.label, s.value])) };
}

/** Probe per canale WiFi, ordinati per numero di canale (non per frequenza): si legge come uno spettro. */
function wifiChannelSegments(rows) {
  const counts = new Map();
  for (const r of rows) {
    if (r.channel === null || r.channel === undefined || r.channel === "") continue;
    const key = String(r.channel);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => Number(a[0]) - Number(b[0]));
}

/**
 * Riepilogo per SSID cercato: un nome di rete, una riga. Il campo ssid di
 * un probe request è la rete che il DISPOSITIVO client sta cercando (dalla
 * sua lista di reti salvate) — un device chiede contemporaneamente di
 * decine di reti note, ovunque le abbia usate in passato, indipendentemente
 * da dove si trova ora. Non è quindi un elenco di reti WiFi fisicamente
 * presenti nei dintorni: solo un catalogo di nomi richiesti. Vale lo stesso
 * per il segnale medio, che riflette il device che chiede, non un'ipotetica
 * antenna della rete cercata.
 */
function computeWifiSsidOverview(probeRows) {
  const byKey = new Map();
  for (const r of probeRows) {
    if (!r.ssid || !r.ssid.trim()) continue;
    const key = r.ssid.trim();
    if (!byKey.has(key)) byKey.set(key, { key, macs: new Set(), sightings: 0, rssiSum: 0, rssiCount: 0, lastTs: 0 });
    const e = byKey.get(key);
    e.sightings += 1;
    if (r.mac) e.macs.add(r.mac);
    if (typeof r.rssi === "number") { e.rssiSum += r.rssi; e.rssiCount += 1; }
    const ts = parseTs(r.timestamp) || 0;
    if (ts > e.lastTs) e.lastTs = ts;
  }
  return [...byKey.values()].map((e) => ({ ...e, avgRssi: e.rssiCount ? Math.round(e.rssiSum / e.rssiCount) : null }));
}

/** Elenco completo (tutta la cronologia caricata, non solo le ultime 24h come nel radar della
 * Dashboard) dei device WiFi esterni rilevati via probe request — esclude i MAC già noti sulla
 * LAN, così come il pannello "WiFi devices" del radar, ma senza il tetto di 30 elementi: è la
 * vista di dettaglio completa a cui rimanda quel pannello. */
function computeWifiDeviceOverview() {
  const knownLanMacs = new Set(latestLanByMac(state.lanRows).map((d) => d.mac));
  const byMac = new Map();
  for (const r of state.wifiRows) {
    if (!r.mac || knownLanMacs.has(r.mac)) continue;
    if (!byMac.has(r.mac)) byMac.set(r.mac, { mac: r.mac, vendor: r.vendor || "", sightings: 0, rssiSum: 0, rssiCount: 0, lastTs: 0 });
    const e = byMac.get(r.mac);
    e.sightings += 1;
    if (typeof r.rssi === "number") { e.rssiSum += r.rssi; e.rssiCount += 1; }
    const ts = parseTs(r.timestamp) || 0;
    if (ts > e.lastTs) e.lastTs = ts;
  }
  return [...byMac.values()].map((e) => ({ ...e, avgRssi: e.rssiCount ? Math.round(e.rssiSum / e.rssiCount) : null }));
}

/** Come sopra ma per le reti WiFi adiacenti (wifi_networks.jsonl), raggruppate per BSSID: la
 * vista di dettaglio completa a cui rimanda il pannello "Adjacent networks" del radar. */
function computeWifiApOverview() {
  const byBssid = new Map();
  for (const r of state.wifiNetworksRows || []) {
    if (!r.bssid) continue;
    if (!byBssid.has(r.bssid)) byBssid.set(r.bssid, { bssid: r.bssid, label: "(hidden network)", vendor: r.vendor || "", channel: null, security: "unknown", sightings: 0, rssiSum: 0, rssiCount: 0, lastTs: 0 });
    const e = byBssid.get(r.bssid);
    e.sightings += 1;
    if (r.ssid && r.ssid.trim()) e.label = r.ssid.trim();
    if (typeof r.channel === "number") e.channel = r.channel;
    if (r.security) e.security = r.security;
    if (typeof r.rssi === "number") { e.rssiSum += r.rssi; e.rssiCount += 1; }
    const ts = parseTs(r.timestamp) || 0;
    if (ts > e.lastTs) e.lastTs = ts;
  }
  return [...byBssid.values()].map((e) => ({ ...e, avgRssi: e.rssiCount ? Math.round(e.rssiSum / e.rssiCount) : null }));
}

/** Etichetta/tono badge per il tipo di sicurezza di una rete WiFi adiacente (classificato dal
 * daemon dal beacon: bit Privacy + IE RSN/WPA). "Open" e "WEP" sono evidenziate come rilevanti
 * dal punto di vista della sicurezza (rete non cifrata o con cifratura legacy debole). */
const WIFI_SECURITY_META = {
  open: { label: "Open", tone: "critical" },
  wep: { label: "WEP", tone: "warning" },
  wpa: { label: "WPA", tone: "warning" },
  wpa2_wpa3: { label: "WPA2/WPA3", tone: "good" },
  unknown: { label: "Unknown", tone: "muted" },
};
function wifiSecurityBadgeHtml(security) {
  const meta = WIFI_SECURITY_META[security] || WIFI_SECURITY_META.unknown;
  return `<span class="badge risk-badge tone-${meta.tone}">${meta.label}</span>`;
}

/** Colore per tono, riusato dove un badge non basta (es. le barre di un grafico) — stessa
 * semantica delle classi .tone-* usate ovunque nei badge. */
const TONE_CHART_COLOR = {
  critical: "var(--status-critical)",
  warning: "var(--status-warning)",
  good: "var(--status-good)",
  muted: "var(--status-muted)",
};

/** Conteggio reti adiacenti per tipo di sicurezza, per il grafico della tab Overview — stesso
 * ordine di WIFI_SECURITY_META, categorie senza reti omesse dal grafico. Ritorna sia le entry
 * `[label, count]` sia i colori allineati per indice (severità: Open/WEP in rosso/ambra, WPA2/3
 * in verde), da passare entrambi a renderHBarChart. */
function computeWifiSecurityBreakdown() {
  const nets = computeWifiApOverview();
  const buckets = Object.entries(WIFI_SECURITY_META)
    .map(([key, meta]) => ({ label: meta.label, count: nets.filter((e) => e.security === key).length, tone: meta.tone }))
    .filter((b) => b.count > 0);
  return { entries: buckets.map((b) => [b.label, b.count]), colors: buckets.map((b) => TONE_CHART_COLOR[b.tone]) };
}

/** 2.4GHz: canali 1-14. 5GHz: canali 36 e oltre (36-165 nella pratica). null se canale ignoto. */
function wifiBand(channel) {
  if (typeof channel !== "number") return null;
  return channel <= 14 ? "2.4" : "5";
}

/** Per un SSID richiesto, il dettaglio dei singoli device che l'hanno chiesto: MAC, vendor,
 * numero di probe, segnale medio e ultimo avvistamento (solo per quell'SSID, non l'intera cronologia del device). */
function computeSsidDeviceDetail(ssid) {
  const byMac = new Map();
  for (const r of state.wifiRows) {
    if (!r.ssid || r.ssid.trim() !== ssid || !r.mac) continue;
    if (!byMac.has(r.mac)) byMac.set(r.mac, { mac: r.mac, vendor: r.vendor || "", sightings: 0, rssiSum: 0, rssiCount: 0, lastTs: 0 });
    const e = byMac.get(r.mac);
    e.sightings += 1;
    if (typeof r.rssi === "number") { e.rssiSum += r.rssi; e.rssiCount += 1; }
    const ts = parseTs(r.timestamp) || 0;
    if (ts > e.lastTs) e.lastTs = ts;
  }
  return [...byMac.values()]
    .map((e) => ({ ...e, avgRssi: e.rssiCount ? Math.round(e.rssiSum / e.rssiCount) : null }))
    .sort((a, b) => b.lastTs - a.lastTs);
}

function renderWifiSsidTable(container) {
  container.innerHTML = `
    <div class="card-head">
      <h2>SSIDs requested</h2>
      <span class="card-sub">a summary per network name requested in probes, across all loaded history — click a row to see which devices requested it</span>
      <div class="filter-row" style="margin:0;">
        <div class="search-input">${ICON("search")}<input type="text" id="wifi-ssid-search" placeholder="Search by SSID…"></div>
      </div>
    </div>
    <div class="table-scroll">
      <table class="data-table" id="wifi-ssid-table">
        <thead><tr><th>SSID</th><th>Devices that requested it</th><th>Total probes</th><th>Average signal</th><th>Last seen</th></tr></thead>
        <tbody id="wifi-ssid-body"></tbody>
      </table>
      <p class="empty-state hidden" id="wifi-ssid-empty">No SSIDs requested in probes — check the data source in Settings.</p>
      <div id="wifi-ssid-pagination"></div>
    </div>
    <p class="field-hint"><strong>This is not a list of WiFi networks physically present nearby</strong>: these are network names that devices nearby have requested in probe requests, i.e. the networks they have saved — a phone requests dozens of known networks at once (home, work, past trips) regardless of where it actually is. Only probes that specify an SSID appear here: many modern devices no longer do this for privacy.</p>
  `;
  document.getElementById("wifi-ssid-search").addEventListener("input", () => { getPagination("wifi-ssid").page = 1; renderWifiSsidTableBody(); });
  renderWifiSsidTableBody();
}

function renderWifiSsidTableBody() {
  const searchEl = document.getElementById("wifi-ssid-search");
  const body = document.getElementById("wifi-ssid-body");
  if (!searchEl || !body) return;

  const search = searchEl.value.trim().toLowerCase();
  const all = computeWifiSsidOverview(state.wifiRows);
  const rows = all
    .filter((e) => !search || e.key.toLowerCase().includes(search))
    .sort((a, b) => b.sightings - a.sightings);
  if (state.wifiSsidExpanded && !rows.some((e) => e.key === state.wifiSsidExpanded)) state.wifiSsidExpanded = null;

  const info = paginate(rows, "wifi-ssid");
  body.innerHTML = info.pageRows.map((e) => {
    const expanded = state.wifiSsidExpanded === e.key;
    let html = `<tr class="wifi-ssid-row" data-ssid-row="${escapeHtml(e.key)}">
      <td><span class="expand-caret ${expanded ? "expanded" : ""}">${ICON("chevron-right")}</span>${escapeHtml(e.key)}</td>
      <td>${e.macs.size}</td>
      <td>${e.sightings}</td>
      <td>${e.avgRssi === null ? '<span class="muted">—</span>' : `${e.avgRssi} dBm`}</td>
      <td>${formatTs(e.lastTs)}</td>
    </tr>`;
    if (expanded) {
      const devices = computeSsidDeviceDetail(e.key);
      html += `<tr class="detail-row"><td colspan="5">
        <div class="table-scroll">
          <table class="data-table">
            <thead><tr><th>Device</th><th>Vendor</th><th>Probes</th><th>Avg signal</th><th>Last seen</th></tr></thead>
            <tbody>${devices.map((d) => `<tr>
              <td><button class="link-cell mono" data-mac-link="${escapeHtml(d.mac)}">${escapeHtml(displayName(d.mac, d.mac))}</button></td>
              <td>${escapeHtml(d.vendor) || '<span class="muted">—</span>'}</td>
              <td>${d.sightings}</td>
              <td>${d.avgRssi === null ? '<span class="muted">—</span>' : `${d.avgRssi} dBm`}</td>
              <td>${formatTs(d.lastTs)}</td>
            </tr>`).join("") || '<tr><td colspan="5"><p class="empty-state">No devices found for this SSID.</p></td></tr>'}</tbody>
          </table>
        </div>
      </td></tr>`;
    }
    return html;
  }).join("");
  document.getElementById("wifi-ssid-empty").classList.toggle("hidden", rows.length > 0);
  document.getElementById("wifi-ssid-pagination").innerHTML = rows.length ? paginationHtml("wifi-ssid", info) : "";
  wirePagination(document.getElementById("wifi-ssid-pagination"), "wifi-ssid", renderWifiSsidTableBody);

  body.querySelectorAll("[data-ssid-row]").forEach((row) => {
    row.addEventListener("click", () => {
      const key = row.dataset.ssidRow;
      state.wifiSsidExpanded = state.wifiSsidExpanded === key ? null : key;
      renderWifiSsidTableBody();
    });
  });
  body.querySelectorAll("[data-mac-link]").forEach((btn) => {
    btn.addEventListener("click", (e) => { e.stopPropagation(); goToDevice(btn.dataset.macLink); });
  });
}

/** Tabella di dettaglio completa dei device WiFi esterni (non sulla LAN) rilevati via probe —
 * a cui rimanda il pannello "WiFi devices" del radar nella Dashboard ("View all"). */
function renderWifiDevicesTable(container) {
  container.innerHTML = `
    <div class="card-head">
      <h2>Nearby WiFi devices</h2>
      <span class="card-sub">devices detected via probe requests, not on this LAN, across all loaded history</span>
      <div class="filter-row" style="margin:0;">
        <div class="search-input">${ICON("search")}<input type="text" id="wifi-devices-search" placeholder="Search by MAC, name or vendor…"></div>
        ${inlineExportHtml("wifi-devices")}
      </div>
    </div>
    <div class="table-scroll">
      <table class="data-table">
        <thead><tr><th>Device</th><th>Vendor</th><th>Probes</th><th>Average signal</th><th>Last seen</th><th></th></tr></thead>
        <tbody id="wifi-devices-body"></tbody>
      </table>
      <p class="empty-state hidden" id="wifi-devices-empty">No external WiFi devices detected — check the data source in Settings.</p>
      <div id="wifi-devices-pagination"></div>
    </div>
  `;
  document.getElementById("wifi-devices-search").addEventListener("input", () => { getPagination("wifi-devices").page = 1; renderWifiDevicesTableBody(); });
  renderWifiDevicesTableBody();
}

/** Azioni per riga condivise dalle tabelle device WiFi e BLE: dare un nome e marcare come fidato.
 * Prima erano disponibili solo sui device LAN, quindi un tracker BLE o un device WiFi rumoroso non
 * potevano essere "già valutati" e continuavano a pesare sugli alert per sempre — la promessa
 * "trusted riduce il rumore" valeva solo su un terzo dell'app. */
function deviceRowActionsHtml(mac) {
  const trusted = getDeviceLabel(mac).trusted;
  return `<td class="row-actions">
    <button type="button" class="btn btn-icon" data-rename-mac="${escapeHtml(mac)}" title="Name this device">${ICON("edit")}</button>
    <button type="button" class="btn btn-icon ${trusted ? "is-trusted" : ""}" data-trust-mac="${escapeHtml(mac)}" title="${trusted ? "Trusted — remove" : "Mark as trusted"}">${ICON("shield")}</button>
  </td>`;
}

function wireDeviceRowActions(container, rerender) {
  container.querySelectorAll("[data-rename-mac]").forEach((btn) => {
    btn.addEventListener("click", () => promptRenameDevice(btn.dataset.renameMac, rerender));
  });
  container.querySelectorAll("[data-trust-mac]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const mac = btn.dataset.trustMac;
      setDeviceLabel(mac, { trusted: !getDeviceLabel(mac).trusted });
      rerender();
    });
  });
}

function renderWifiDevicesTableBody() {
  const searchEl = document.getElementById("wifi-devices-search");
  const body = document.getElementById("wifi-devices-body");
  if (!searchEl || !body) return;

  const search = searchEl.value.trim().toLowerCase();
  const rows = computeWifiDeviceOverview()
    .filter((e) => !search || `${e.mac} ${e.vendor}`.toLowerCase().includes(search))
    .sort((a, b) => b.sightings - a.sightings);

  const info = paginate(rows, "wifi-devices");
  body.innerHTML = info.pageRows.map((e) => `<tr>
    <td><button class="link-cell mono" data-mac-link="${escapeHtml(e.mac)}">${escapeHtml(displayName(e.mac, e.mac))}</button></td>
    <td>${escapeHtml(e.vendor) || '<span class="muted">—</span>'}</td>
    <td>${e.sightings}</td>
    <td>${e.avgRssi === null ? '<span class="muted">—</span>' : `${e.avgRssi} dBm`}</td>
    <td>${formatTs(e.lastTs)}</td>
    ${deviceRowActionsHtml(e.mac)}
  </tr>`).join("");
  document.getElementById("wifi-devices-empty").classList.toggle("hidden", rows.length > 0);
  document.getElementById("wifi-devices-pagination").innerHTML = rows.length ? paginationHtml("wifi-devices", info) : "";
  wirePagination(document.getElementById("wifi-devices-pagination"), "wifi-devices", renderWifiDevicesTableBody);

  body.querySelectorAll("[data-mac-link]").forEach((btn) => {
    btn.addEventListener("click", () => goToDevice(btn.dataset.macLink));
  });
  wireDeviceRowActions(body, renderWifiDevicesTableBody);
  const devicesCard = document.getElementById("wifi-devices-mount");
  if (devicesCard) wireInlineExport(devicesCard, "wifi-devices", "wifi_devices", () => rows);
}

/** Tabella di dettaglio completa delle reti WiFi adiacenti (catturate dai loro stessi beacon,
 * wifi_networks.jsonl) — a cui rimanda il pannello "Adjacent networks" del radar ("View all"). */
function renderWifiApsTable(container) {
  container.innerHTML = `
    <div class="card-head">
      <h2>Adjacent networks</h2>
      <span class="card-sub">WiFi networks genuinely detected around you from their own beacon frames, across all loaded history</span>
      <div class="filter-row" style="margin:0;">
        <div class="search-input">${ICON("search")}<input type="text" id="wifi-aps-search" placeholder="Search by SSID, BSSID or vendor…"></div>
        <select class="select-control" id="wifi-aps-security-filter">
          <option value="all">All security types</option>
          <option value="open">Open</option>
          <option value="wep">WEP</option>
          <option value="wpa">WPA</option>
          <option value="wpa2_wpa3">WPA2/WPA3</option>
          <option value="unknown">Unknown</option>
        </select>
        <select class="select-control" id="wifi-aps-band-filter">
          <option value="all">All bands</option>
          <option value="2.4">2.4 GHz</option>
          <option value="5">5 GHz</option>
        </select>
        ${inlineExportHtml("wifi-aps")}
      </div>
    </div>
    <div class="table-scroll">
      <table class="data-table">
        <thead><tr><th>SSID</th><th>BSSID</th><th>Vendor</th><th>Security</th><th>Channel</th><th>Sightings</th><th>Average signal</th><th>Last seen</th></tr></thead>
        <tbody id="wifi-aps-body"></tbody>
      </table>
      <p class="empty-state hidden" id="wifi-aps-empty">No adjacent WiFi networks detected — check the data source in Settings.</p>
      <div id="wifi-aps-pagination"></div>
    </div>
    <p class="field-hint">Security is classified from the beacon's Capability Info and RSN/WPA information elements: <strong>Open</strong> means no encryption at all (anyone can connect and, on many networks, see other clients' traffic) — a real exposure if it's a network you manage. <strong>WEP</strong> is legacy encryption broken for years. Requires <code>--wifi-iface</code> on the daemon; not available if only probe requests are captured.</p>
  `;
  document.getElementById("wifi-aps-search").addEventListener("input", () => { getPagination("wifi-aps").page = 1; renderWifiApsTableBody(); });
  document.getElementById("wifi-aps-security-filter").value = state.wifiApFilters.security;
  document.getElementById("wifi-aps-security-filter").addEventListener("change", (e) => { state.wifiApFilters.security = e.target.value; getPagination("wifi-aps").page = 1; renderWifiApsTableBody(); });
  document.getElementById("wifi-aps-band-filter").value = state.wifiApFilters.band;
  document.getElementById("wifi-aps-band-filter").addEventListener("change", (e) => { state.wifiApFilters.band = e.target.value; getPagination("wifi-aps").page = 1; renderWifiApsTableBody(); });
  renderWifiApsTableBody();
}

function renderWifiApsTableBody() {
  const searchEl = document.getElementById("wifi-aps-search");
  const body = document.getElementById("wifi-aps-body");
  if (!searchEl || !body) return;

  const search = searchEl.value.trim().toLowerCase();
  const rows = computeWifiApOverview()
    .filter((e) => !search || `${e.label} ${e.bssid} ${e.vendor}`.toLowerCase().includes(search))
    .filter((e) => state.wifiApFilters.security === "all" || e.security === state.wifiApFilters.security)
    .filter((e) => state.wifiApFilters.band === "all" || wifiBand(e.channel) === state.wifiApFilters.band)
    .sort((a, b) => b.avgRssi - a.avgRssi);

  const info = paginate(rows, "wifi-aps");
  body.innerHTML = info.pageRows.map((e) => `<tr>
    <td><button class="link-cell" data-bssid-link="${escapeHtml(e.bssid)}">${escapeHtml(displayName(e.bssid, e.label))}</button> ${homeNetworkBadgeHtml(e.label)}</td>
    <td class="mono">${escapeHtml(e.bssid)}</td>
    <td>${escapeHtml(e.vendor) || '<span class="muted">—</span>'}</td>
    <td>${wifiSecurityBadgeHtml(e.security)}</td>
    <td>${e.channel ?? '<span class="muted">—</span>'}</td>
    <td>${e.sightings}</td>
    <td>${e.avgRssi === null ? '<span class="muted">—</span>' : `${e.avgRssi} dBm`}</td>
    <td>${formatTs(e.lastTs)}</td>
  </tr>`).join("");
  document.getElementById("wifi-aps-empty").classList.toggle("hidden", rows.length > 0);
  document.getElementById("wifi-aps-pagination").innerHTML = rows.length ? paginationHtml("wifi-aps", info) : "";
  wirePagination(document.getElementById("wifi-aps-pagination"), "wifi-aps", renderWifiApsTableBody);
  body.querySelectorAll("[data-bssid-link]").forEach((btn) => {
    btn.addEventListener("click", () => goToNetwork(btn.dataset.bssidLink));
  });
  const apsCard = document.getElementById("wifi-aps-mount");
  if (apsCard) wireInlineExport(apsCard, "wifi-aps", "adjacent_networks", () => rows);
}

/** Severity dei rilevatori server-side (low/medium/high) -> classi CSS esistenti (info/serious/critical). */
const DETECTION_SEVERITY_MAP = { low: "info", medium: "serious", high: "critical" };

/** Etichetta e icona per ogni tipo di alert: quelli del daemon (sentinel_detection.py) più i due calcolati lato client. */
const ALERT_TYPE_META = {
  possibile_arp_spoofing: { label: "Possible ARP spoofing", icon: "shield" },
  possibile_rogue_dhcp: { label: "Possible rogue DHCP", icon: "server" },
  possibile_evil_twin: { label: "Possible WiFi evil twin", icon: "wifi" },
  possibile_deauth_flood: { label: "Possible WiFi deauth/disassoc attack", icon: "wifi" },
  possibile_tracker_ble: { label: "Possible BLE tracker (AirTag/Tile/SmartTag)", icon: "bluetooth" },
  possibile_ble_spoofing: { label: "Possible BLE spoofing/clone", icon: "bluetooth" },
  nuova_porta: { label: "New port open on known device", icon: "alert-triangle" },
  nuovo_dispositivo: { label: "New device detected", icon: "monitor" },
  porta_rischio: { label: "Risky port open", icon: "alert-triangle" },
};

function computeAlerts() {
  const lanCurrent = latestLanByMac(state.lanRows);
  const alerts = [];

  for (const row of state.alertsRows) {
    const ts = parseTs(row.timestamp);
    if (ts === null) continue;
    const type = row.type || "";
    const meta = ALERT_TYPE_META[type] || { label: type ? type.replace(/_/g, " ") : "Alert", icon: "shield" };
    alerts.push({
      id: `detect:${type}:${row.mac || row.ip || ""}:${row.timestamp}`,
      type,
      severity: DETECTION_SEVERITY_MAP[row.severity] || "serious",
      title: meta.label,
      icon: meta.icon,
      source: "detect",
      desc: row.message || "",
      mac: row.mac,
      ip: row.ip,
      // Contesto di occupazione al momento dell'alert (--presence-aware-alerts sul daemon):
      // true/false, oppure undefined se il daemon non lo sapeva o è una versione precedente.
      homeOccupied: typeof row.home_occupied === "boolean" ? row.home_occupied : undefined,
      escalated: row.details && row.details.escalated_reason === "home_empty",
      ts,
    });
  }

  for (const row of state.lanRows) {
    if (row.status !== "new") continue;
    const ts = parseTs(row.timestamp);
    if (!within24h(ts)) continue;
    alerts.push({
      id: `new:${row.mac}:${row.timestamp}`,
      type: "nuovo_dispositivo",
      severity: "info",
      title: ALERT_TYPE_META.nuovo_dispositivo.label,
      icon: ALERT_TYPE_META.nuovo_dispositivo.icon,
      desc: `${row.hostname || row.mac} (${row.ip}) seen for the first time on the network.`,
      mac: row.mac,
      ts,
    });
  }

  for (const dev of lanCurrent) {
    if (dev.status === "offline") continue;
    const ports = Array.isArray(dev.open_ports) ? dev.open_ports : [];
    const risky = ports.filter((p) => RISK_PORTS[p]);
    if (!risky.length) continue;
    const isCritical = risky.some((p) => p === 23 || p === 3389 || p === 5900);
    alerts.push({
      id: `port:${dev.mac}`,
      type: "porta_rischio",
      severity: isCritical ? "critical" : "serious",
      title: ALERT_TYPE_META.porta_rischio.label,
      icon: ALERT_TYPE_META.porta_rischio.icon,
      desc: `${dev.hostname || dev.mac} (${dev.ip}) exposes ${risky.map((p) => `${p}/${RISK_PORTS[p]}`).join(", ")}.`,
      mac: dev.mac,
      ts: dev._ts,
    });
  }

  for (const a of alerts) {
    if (a.mac && getDeviceLabel(a.mac).trusted) a.severity = downgradeSeverity(a.severity);
  }

  alerts.sort((a, b) => (b.ts || 0) - (a.ts || 0));
  return alerts;
}

/** Un livello di severità in meno: per gli alert su device contrassegnati come fidati. */
function downgradeSeverity(severity) {
  if (severity === "critical") return "serious";
  if (severity === "serious") return "info";
  return severity;
}

function isDismissed(id) { return state.dismissedAlerts.has(id); }
function toggleDismiss(id) {
  if (state.dismissedAlerts.has(id)) state.dismissedAlerts.delete(id);
  else state.dismissedAlerts.add(id);
  localStorage.setItem(DISMISSED_KEY, JSON.stringify([...state.dismissedAlerts]));
}

/* Snooze: a differenza di Dismiss (nascosto per sempre finché non lo ripristini a mano), un alert
 * snoozato torna da solo tra "Attivi" una volta scaduta la finestra — utile per un alert ricorrente
 * a bassa severità (es. un vicino che scansiona periodicamente) che non vuoi né silenziare per
 * sempre né continuare a vedere ogni giorno. */
const SNOOZED_KEY = "hs.alerts.snoozed";
function getSnoozedMap() {
  try { return JSON.parse(localStorage.getItem(SNOOZED_KEY) || "{}"); } catch { return {}; }
}
function saveSnoozedMap(map) { localStorage.setItem(SNOOZED_KEY, JSON.stringify(map)); }
function snoozedUntil(id) {
  const until = getSnoozedMap()[id];
  return typeof until === "number" ? until : null;
}
function isSnoozed(id) {
  const until = snoozedUntil(id);
  return until !== null && until > Date.now();
}
function snoozeAlert(id, hours) {
  const map = getSnoozedMap();
  map[id] = Date.now() + hours * 3600 * 1000;
  saveSnoozedMap(map);
}
function unsnoozeAlert(id) {
  const map = getSnoozedMap();
  delete map[id];
  saveSnoozedMap(map);
}

/* Notifiche desktop per nuovi alert critici (Notifications API del browser): funzionano solo mentre
 * questa scheda resta aperta (non è una vera push), utile comunque per non dover controllare
 * manualmente la pagina Alerts. Mai attive di default: richiedono un permesso esplicito del browser,
 * concedibile solo a partire da un'azione utente (click) — da qui il toggle in Impostazioni invece
 * di una richiesta automatica all'avvio. */
const NOTIFICATIONS_ENABLED_KEY = "hs.notifications.enabled";
function getNotificationsEnabled() { return localStorage.getItem(NOTIFICATIONS_ENABLED_KEY) === "1"; }
function setNotificationsEnabled(v) { localStorage.setItem(NOTIFICATIONS_ENABLED_KEY, v ? "1" : "0"); }

const NOTIFIED_ALERTS_KEY = "hs.alerts.notified";
function getNotifiedAlertIds() {
  try { return new Set(JSON.parse(localStorage.getItem(NOTIFIED_ALERTS_KEY) || "[]")); } catch { return new Set(); }
}
function markAlertsNotified(ids) {
  const set = getNotifiedAlertIds();
  for (const id of ids) set.add(id);
  let arr = [...set];
  if (arr.length > 500) arr = arr.slice(arr.length - 500); // evita una crescita illimitata nel tempo
  localStorage.setItem(NOTIFIED_ALERTS_KEY, JSON.stringify(arr));
}

/** Richiede il permesso di notifica (deve partire da un click utente) e, se concesso, marca come già
 * notificati tutti gli alert critici già presenti ora: senza questa baseline la prima attivazione
 * spammerebbe una notifica per ogni alert critico di tutto lo storico già caricato. */
async function enableDesktopNotifications() {
  if (typeof Notification === "undefined") return "unsupported";
  const perm = await Notification.requestPermission();
  if (perm === "granted") {
    markAlertsNotified(computeAlerts().filter((a) => a.severity === "critical").map((a) => a.id));
    setNotificationsEnabled(true);
  }
  return perm;
}
function disableDesktopNotifications() { setNotificationsEnabled(false); }

/** Da chiamare ad ogni ciclo di refresh: notifica (una volta sola per alert) i nuovi alert di
 * severità critica non ancora notificati né già scartati con Dismiss. */
function checkAlertNotifications() {
  if (!getNotificationsEnabled()) return;
  if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
  const notified = getNotifiedAlertIds();
  const fresh = computeAlerts().filter((a) => a.severity === "critical" && !isDismissed(a.id) && !notified.has(a.id));
  if (!fresh.length) return;
  for (const a of fresh.slice(0, 5)) { // limite di buon senso: non aprire decine di notifiche in un colpo
    try {
      const n = new Notification(a.title, { body: a.desc, tag: a.id });
      n.onclick = () => { window.focus(); window.location.hash = "#/alerts"; };
    } catch {
      // alcuni browser rifiutano new Notification() in contesti particolari (es. permesso appena
      // revocato in un'altra scheda): non bloccante, si ritenterà al prossimo ciclo di refresh.
    }
  }
  markAlertsNotified(fresh.map((a) => a.id));
}

function computeScanCycles() {
  const rows = state.lanRows.filter((r) => parseTs(r.timestamp) !== null)
    .slice()
    .sort((a, b) => parseTs(a.timestamp) - parseTs(b.timestamp));
  const GAP_MS = 5000;
  const cycles = [];
  let current = null;
  for (const row of rows) {
    const ts = parseTs(row.timestamp);
    if (!current || ts - current.endTs > GAP_MS) {
      current = { startTs: ts, endTs: ts, rows: [] };
      cycles.push(current);
    }
    current.endTs = ts;
    current.rows.push(row);
  }
  return cycles.reverse().map((c) => ({
    startTs: c.startTs,
    deviceCount: new Set(c.rows.map((r) => r.mac)).size,
    newCount: c.rows.filter((r) => r.status === "new").length,
    offlineCount: c.rows.filter((r) => r.status === "offline").length,
  }));
}

/* ---------------------------------------------------------------------- *
 * Timeline: feed cronologico unificato (nuovi/offline LAN, alert,
 * fingerprint) — solo eventi "notevoli", non ogni singolo probe/advertisement
 * (troppo frequenti per essere leggibili in un feed).
 * ---------------------------------------------------------------------- */

function computeTimeline() {
  const events = [];

  for (const row of state.lanRows) {
    if (row.status === "online") continue; // troppo frequente per essere "notevole"
    const ts = parseTs(row.timestamp);
    if (ts === null) continue;
    events.push({
      ts, kind: "lan",
      icon: row.status === "new" ? "monitor" : "x",
      tone: row.status === "new" ? "good" : "muted",
      title: row.status === "new" ? "New device" : "Device offline",
      desc: `${row.hostname || row.mac} (${row.ip})`,
      mac: row.mac,
    });
  }

  for (const a of computeAlerts()) {
    if (a.ts === null) continue;
    const tone = a.severity === "critical" ? "critical" : a.severity === "serious" ? "serious" : "blue";
    events.push({ ts: a.ts, kind: "alert", icon: a.icon, tone, title: a.title, desc: a.desc, mac: a.mac });
  }

  for (const f of state.fingerprintRows) {
    const ts = parseTs(f.timestamp);
    if (ts === null) continue;
    events.push({
      ts, kind: "fingerprint", icon: "search", tone: "blue",
      title: `Device identified: ${f.device_type || "Unknown"}`,
      desc: f.ip || "", mac: f.mac,
    });
  }

  // Presenza: arrivi e uscite di casa. Sono gli eventi più leggibili di tutta l'app — "Marco è
  // tornato" — e per una svista storica erano proprio quelli che il feed "unificato" non
  // mostrava: c'erano solo nel loro riquadro dedicato nelle pagine WiFi/BLE.
  for (const [rows, radio] of [[state.wifiPresenceRows, "WiFi"], [state.blePresenceRows, "BLE"]]) {
    for (const r of rows) {
      const ts = parseTs(r.timestamp);
      if (ts === null) continue;
      const arrived = r.event === "arrived";
      events.push({
        ts, kind: "presence",
        icon: "users", tone: arrived ? "good" : "muted",
        title: `${displayName(r.mac, r.mac)} ${arrived ? "arrived home" : "left home"}`,
        desc: arrived
          ? `detected over ${radio}`
          : `away after ${typeof r.duration_s === "number" ? formatDuration(r.duration_s * 1000) : "an unknown time"} at home (${radio})`,
        mac: r.mac,
      });
    }
  }

  for (const h of state.handshakeRows) {
    const ts = parseTs(h.timestamp);
    if (ts === null) continue;
    events.push({
      ts, kind: "security", icon: "wifi", tone: "blue",
      title: `WPA handshake captured: ${h.ssid || h.bssid || ""}`,
      desc: `${Array.isArray(h.messages) ? `${h.messages.length}/4 messages` : `${h.frame_count || 0} frames`} · station ${h.sta_mac || "?"}`,
      mac: h.sta_mac,
    });
  }

  for (const d of state.deepScanRows) {
    const ts = parseTs(d.timestamp);
    if (ts === null) continue;
    const newPorts = Array.isArray(d.new_ports) ? d.new_ports : [];
    events.push({
      ts, kind: "scan", icon: "radar", tone: newPorts.length ? "serious" : "blue",
      title: newPorts.length ? `Deep scan found ${newPorts.length} new port(s)` : "Deep port scan completed",
      desc: `${d.ip || ""}${newPorts.length ? ` — ${newPorts.join(", ")}` : ""}`,
      mac: d.mac,
    });
  }

  for (const e of state.exposureRows) {
    const ts = parseTs(e.timestamp);
    if (ts === null) continue;
    events.push({
      ts, kind: "security", icon: "shield", tone: "serious",
      title: `Port forward on the router: ${e.external_port} → ${e.internal_ip}:${e.internal_port}`,
      desc: `${e.protocol || ""} ${e.description ? `· ${e.description}` : ""}`.trim(),
    });
  }

  for (const d of state.dhcpEventsRows) {
    const ts = parseTs(d.timestamp);
    if (ts === null) continue;
    events.push({
      ts, kind: "network", icon: "server", tone: "blue",
      title: `DHCP request from ${displayName(d.mac, d.hostname || d.mac)}`,
      desc: d.hostname ? `declared hostname: ${d.hostname}` : "",
      mac: d.mac,
    });
  }

  for (const o of state.osFingerprintRows) {
    const ts = parseTs(o.timestamp);
    if (ts === null) continue;
    events.push({
      ts, kind: "fingerprint", icon: "monitor", tone: "blue",
      title: `OS guess: ${o.os_guess || "unknown"}`,
      desc: o.ip || "", mac: o.mac,
    });
  }

  return events.sort((a, b) => b.ts - a.ts);
}

const TIMELINE_KIND_LABELS = {
  lan: "Devices (new/offline)",
  presence: "Presence (arrivals/departures)",
  alert: "Alerts",
  security: "Security captures",
  scan: "Deep scans",
  network: "DHCP / network",
  fingerprint: "Fingerprint / OS",
};

function timelineItemHtml(e) {
  return `<div class="timeline-item">
    <span class="timeline-icon tone-${e.tone}">${ICON(e.icon)}</span>
    <div class="timeline-body">
      <div class="timeline-title">${escapeHtml(e.title)}</div>
      <div class="timeline-desc">${escapeHtml(e.desc)}${e.mac ? ` — <button class="link-cell" data-mac-link="${escapeHtml(e.mac)}">${escapeHtml(displayName(e.mac, e.mac))}</button>` : ""}</div>
      <div class="timeline-ts">${formatTs(e.ts)}</div>
    </div>
  </div>`;
}

function renderTimeline(container) {
  const events = computeTimeline();
  container.innerHTML = `
    <div class="card">
      <div class="card-head">
        <h2>Event timeline</h2>
        <span class="card-sub">every notable event from every active module, newest first</span>
        <div class="filter-row" style="margin:0;">
          <div class="search-input">${ICON("search")}<input type="text" id="timeline-search" placeholder="Search events…"></div>
          <select class="select-control" id="timeline-kind-filter">
            <option value="all">All events</option>
            ${Object.entries(TIMELINE_KIND_LABELS).map(([kind, label]) =>
              `<option value="${kind}">${escapeHtml(label)}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="timeline" id="timeline-list"></div>
      <div id="timeline-pagination"></div>
    </div>`;

  document.getElementById("timeline-kind-filter").value = state.timelineKindFilter;
  document.getElementById("timeline-kind-filter").addEventListener("change", (e) => {
    state.timelineKindFilter = e.target.value;
    savePersistedUiState({ timelineKindFilter: e.target.value });
    getPagination("timeline").page = 1;
    renderList();
  });
  document.getElementById("timeline-search").addEventListener("input", () => {
    getPagination("timeline").page = 1;
    renderList();
  });
  renderList();

  function renderList() {
    const search = document.getElementById("timeline-search").value.trim().toLowerCase();
    const list = events
      .filter((e) => state.timelineKindFilter === "all" || e.kind === state.timelineKindFilter)
      .filter((e) => !search || `${e.title} ${e.desc} ${e.mac || ""}`.toLowerCase().includes(search));
    const el = document.getElementById("timeline-list");
    const pager = document.getElementById("timeline-pagination");
    if (!list.length) {
      el.innerHTML = '<p class="empty-state">No events in this category.</p>';
      pager.innerHTML = "";
      return;
    }
    // Paginato invece che troncato in silenzio ai primi 300: con presence, handshake, scan e
    // DHCP nel feed il tetto veniva raggiunto in fretta, e nulla lo diceva all'utente.
    const info = paginate(list, "timeline");
    el.innerHTML = info.pageRows.map(timelineItemHtml).join("");
    pager.innerHTML = paginationHtml("timeline", info);
    wirePagination(pager, "timeline", renderList);
    el.querySelectorAll("[data-mac-link]").forEach((btn) => {
      btn.addEventListener("click", () => goToDevice(btn.dataset.macLink));
    });
  }
}

/* ---------------------------------------------------------------------- *
 * Host table (shared by Dashboard + Host page)
 * ---------------------------------------------------------------------- */

function renderHostSection(container) {
  state.hostSelectedMacs = new Set();
  const lanCurrent = latestLanByMac(state.lanRows);
  const fingerprintByMac = latestFingerprintByMac(state.fingerprintRows);

  const typesPresent = [...new Set(lanCurrent.map((d) => fingerprintByMac.get(d.mac)?.device_type).filter(Boolean))].sort((a, b) => a.localeCompare(b, "en"));
  const vendorsPresent = [...new Set(lanCurrent.map((d) => d.vendor).filter((v) => v && v.trim()))].sort((a, b) => a.localeCompare(b, "en"));
  if (!typesPresent.includes(state.hostFilters.type) && !["all", "unknown"].includes(state.hostFilters.type)) state.hostFilters.type = "all";
  if (!vendorsPresent.includes(state.hostFilters.vendor) && !["all", "unknown"].includes(state.hostFilters.vendor)) state.hostFilters.vendor = "all";

  const visibleColumns = getHostVisibleColumns();

  container.innerHTML = `
    <div class="card-head">
      <h2>Hosts on the network <span class="card-sub">(${lanCurrent.length})</span></h2>
      <div class="filter-row" style="margin:0;">
        <div class="search-input">${ICON("search")}<input type="text" id="host-search" placeholder="Search by IP, MAC, hostname, vendor…"></div>
        <select class="select-control" id="host-status-filter">
          <option value="all">All statuses</option>
          <option value="online">Online</option>
          <option value="new">New</option>
          <option value="offline">Offline</option>
        </select>
        <select class="select-control" id="host-type-filter">
          <option value="all">All types</option>
          <option value="unknown">Unknown type</option>
          ${typesPresent.map((t) => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join("")}
        </select>
        <select class="select-control" id="host-vendor-filter">
          <option value="all">All vendors</option>
          <option value="unknown">Unknown vendor</option>
          ${vendorsPresent.map((v) => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join("")}
        </select>
        <select class="select-control" id="host-risk-filter">
          <option value="all">All risk levels</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select class="select-control" id="host-trust-filter">
          <option value="all">Trusted &amp; not</option>
          <option value="trusted">Trusted only</option>
          <option value="untrusted">Not trusted</option>
        </select>
        <select class="select-control" id="host-ports-filter">
          <option value="all">Any ports</option>
          <option value="open">With open ports</option>
          <option value="none">No open ports</option>
        </select>
        <button type="button" class="btn ${state.hostStaleOnly ? "btn-primary" : ""}" id="host-stale-toggle" title="Show only devices offline for more than ${STALE_OFFLINE_DAYS} days">${ICON("clock")}Stale only</button>
        <button type="button" class="btn ${state.hostGroupByIdentity ? "btn-primary" : ""}" id="host-group-toggle" title="Merge MACs linked as the same physical device into one row">${ICON("users")}Group by identity</button>
        <div class="dropdown-wrap host-columns-wrap">
          <button type="button" class="btn" id="host-columns-btn">${ICON("sliders")}Columns</button>
          <div class="host-columns-menu hidden" id="host-columns-menu">
            ${HOST_OPTIONAL_COLUMNS.map((c) => `<label><input type="checkbox" data-column-toggle="${c.key}" ${visibleColumns.has(c.key) ? "checked" : ""}>${escapeHtml(c.label)}</label>`).join("")}
          </div>
        </div>
      </div>
    </div>
    <div class="preset-row" id="host-preset-row"></div>
    <div id="host-bulk-bar"></div>
    <div class="table-scroll table-scroll-tall">
      <table class="data-table" id="host-table">
        <thead id="host-thead"></thead>
        <tbody id="host-table-body"></tbody>
      </table>
      <p class="empty-state hidden" id="host-empty">No devices — check the data sources in Settings.</p>
      <div id="host-pagination"></div>
    </div>`;

  document.getElementById("host-search").addEventListener("input", () => { getPagination("host").page = 1; renderHostTable(); });
  document.getElementById("host-status-filter").addEventListener("change", () => { getPagination("host").page = 1; renderHostTable(); });
  document.getElementById("host-type-filter").value = state.hostFilters.type;
  document.getElementById("host-type-filter").addEventListener("change", (e) => { state.hostFilters.type = e.target.value; getPagination("host").page = 1; renderHostTable(); });
  document.getElementById("host-vendor-filter").value = state.hostFilters.vendor;
  document.getElementById("host-vendor-filter").addEventListener("change", (e) => { state.hostFilters.vendor = e.target.value; getPagination("host").page = 1; renderHostTable(); });
  document.getElementById("host-risk-filter").value = state.hostFilters.risk;
  document.getElementById("host-risk-filter").addEventListener("change", (e) => { state.hostFilters.risk = e.target.value; getPagination("host").page = 1; renderHostTable(); });
  document.getElementById("host-trust-filter").value = state.hostFilters.trust;
  document.getElementById("host-trust-filter").addEventListener("change", (e) => { state.hostFilters.trust = e.target.value; getPagination("host").page = 1; renderHostTable(); });
  document.getElementById("host-ports-filter").value = state.hostFilters.ports;
  document.getElementById("host-ports-filter").addEventListener("change", (e) => { state.hostFilters.ports = e.target.value; getPagination("host").page = 1; renderHostTable(); });
  document.getElementById("host-stale-toggle").addEventListener("click", () => {
    state.hostStaleOnly = !state.hostStaleOnly;
    getPagination("host").page = 1;
    renderHostSection(container);
  });
  document.getElementById("host-group-toggle").addEventListener("click", () => {
    state.hostGroupByIdentity = !state.hostGroupByIdentity;
    getPagination("host").page = 1;
    renderHostSection(container);
  });
  document.getElementById("host-columns-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    document.getElementById("host-columns-menu").classList.toggle("hidden");
  });
  container.querySelectorAll("[data-column-toggle]").forEach((cb) => {
    cb.addEventListener("click", (e) => e.stopPropagation());
    cb.addEventListener("change", () => {
      const cols = getHostVisibleColumns();
      if (cb.checked) cols.add(cb.dataset.columnToggle); else cols.delete(cb.dataset.columnToggle);
      saveHostVisibleColumns(cols);
      renderHostTable();
    });
  });

  renderHostPresetChips();
  renderHostTable();

  function renderHostPresetChips() {
    const presets = getHostPresets();
    const row = document.getElementById("host-preset-row");
    const matches = (p) => p.statusFilter === document.getElementById("host-status-filter").value
      && p.staleOnly === state.hostStaleOnly && p.groupByIdentity === state.hostGroupByIdentity
      && JSON.stringify(p.hostFilters) === JSON.stringify(state.hostFilters);
    row.innerHTML = `
      ${presets.map((p, i) => `<button class="preset-chip ${matches(p) ? "active" : ""}" data-preset="${i}">
        ${escapeHtml(p.name)}<span class="preset-chip-x" data-preset-del="${i}">${ICON("x")}</span>
      </button>`).join("")}
      <button class="preset-chip preset-chip-add" id="host-preset-add">${ICON("monitor")}Save current filter</button>
    `;
    row.querySelectorAll("[data-preset]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        if (e.target.closest("[data-preset-del]")) return;
        const p = presets[Number(btn.dataset.preset)];
        document.getElementById("host-status-filter").value = p.statusFilter;
        state.hostFilters = { ...state.hostFilters, ...p.hostFilters };
        state.hostStaleOnly = !!p.staleOnly;
        state.hostGroupByIdentity = !!p.groupByIdentity;
        getPagination("host").page = 1;
        renderHostSection(container);
      });
    });
    row.querySelectorAll("[data-preset-del]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const list = getHostPresets();
        list.splice(Number(btn.dataset.presetDel), 1);
        saveHostPresets(list);
        renderHostPresetChips();
      });
    });
    document.getElementById("host-preset-add").addEventListener("click", () => {
      const name = prompt('Name for this filter (e.g. "Untrusted with open ports"):');
      if (!name || !name.trim()) return;
      const list = getHostPresets();
      list.push({
        name: name.trim(),
        statusFilter: document.getElementById("host-status-filter").value,
        hostFilters: { ...state.hostFilters },
        staleOnly: state.hostStaleOnly,
        groupByIdentity: state.hostGroupByIdentity,
      });
      saveHostPresets(list);
      renderHostPresetChips();
    });
  }

  function renderHostTable() {
    const search = document.getElementById("host-search").value.trim().toLowerCase();
    const statusFilter = document.getElementById("host-status-filter").value;
    const fingerprintByMac = latestFingerprintByMac(state.fingerprintRows);
    const alertsByMac = groupAlertsByMac(computeAlerts());
    const osFingerprintByMac = latestFingerprintByMac(state.osFingerprintRows);
    const dhcpLeaseByMac = latestFingerprintByMac(state.dhcpLeasesRows);
    const trafficByMac = trafficBytesByMac(state.wifiTrafficRows);
    const maxTraffic = Math.max(1, ...[...trafficByMac.values()]);
    const visibleColumns = getHostVisibleColumns();

    const base = state.hostGroupByIdentity ? groupHostsByIdentity(latestLanByMac(state.lanRows)) : latestLanByMac(state.lanRows).map((d) => ({ ...d, _members: [d] }));

    let rows = base.filter((d) => {
      if (statusFilter !== "all" && d.status !== statusFilter) return false;
      if (state.hostStaleOnly && !isHostStale(d)) return false;
      if (state.hostFilters.type !== "all") {
        const type = fingerprintByMac.get(d.mac)?.device_type || "";
        if (state.hostFilters.type === "unknown" ? !!type : type !== state.hostFilters.type) return false;
      }
      if (state.hostFilters.vendor !== "all") {
        if (state.hostFilters.vendor === "unknown" ? !!(d.vendor && d.vendor.trim()) : d.vendor !== state.hostFilters.vendor) return false;
      }
      if (state.hostFilters.risk !== "all") {
        if (riskLevel(rowRiskScore(d, fingerprintByMac, alertsByMac)).label !== state.hostFilters.risk) return false;
      }
      if (state.hostFilters.trust !== "all") {
        const trusted = getDeviceLabel(d.mac).trusted;
        if (state.hostFilters.trust === "trusted" ? !trusted : trusted) return false;
      }
      if (state.hostFilters.ports !== "all") {
        const hasPorts = Array.isArray(d.open_ports) && d.open_ports.length > 0;
        if (state.hostFilters.ports === "open" ? !hasPorts : hasPorts) return false;
      }
      if (!search) return true;
      return hostSearchText(d).includes(search);
    });
    rows = sortRows(rows, state.lanSort.key, state.lanSort.dir);

    const info = paginate(rows, "host");
    const colCount = 2 + 9 + visibleColumns.size;

    document.getElementById("host-thead").innerHTML = `<tr>
      <th><input type="checkbox" id="host-select-all" ${info.pageRows.length && info.pageRows.every((d) => state.hostSelectedMacs.has(d.mac)) ? "checked" : ""}></th>
      ${sortableTh("Status", "status", state.lanSort)}
      ${sortableTh("IP", "ip", state.lanSort)}
      ${sortableTh("Hostname", "hostname", state.lanSort)}
      ${sortableTh("MAC address", "mac", state.lanSort)}
      ${sortableTh("Vendor", "vendor", state.lanSort)}
      <th>Type</th>
      <th>Risk</th>
      ${sortableTh("Open ports", "open_ports", state.lanSort)}
      ${visibleColumns.has("osGuess") ? "<th>OS guess</th>" : ""}
      ${visibleColumns.has("mdns") ? "<th>mDNS name</th>" : ""}
      ${visibleColumns.has("arp") ? "<th>ARP status</th>" : ""}
      ${visibleColumns.has("uptime") ? "<th>Uptime %</th>" : ""}
      ${visibleColumns.has("traffic") ? `<th>WiFi traffic (${rangeLabel()})</th>` : ""}
      ${sortableTh("Last seen", "last_seen", state.lanSort)}
      <th></th>
    </tr>`;
    wireSortableHeaders(document.getElementById("host-thead"), state.lanSort, renderHostTable);
    document.getElementById("host-select-all").addEventListener("change", (e) => {
      for (const d of info.pageRows) {
        if (e.target.checked) state.hostSelectedMacs.add(d.mac); else state.hostSelectedMacs.delete(d.mac);
      }
      renderHostTable();
    });

    const body = document.getElementById("host-table-body");
    body.innerHTML = info.pageRows.map((d) => hostRowHtml(d, {
      fingerprint: fingerprintByMac.get(d.mac), alerts: alertsByMac.get(d.mac),
      fingerprintByMac, alertsByMac, osFingerprint: osFingerprintByMac.get(d.mac),
      dhcpLease: dhcpLeaseByMac.get(d.mac), trafficBytes: trafficByMac.get(d.mac),
      maxTraffic, visibleColumns, colCount, selected: state.hostSelectedMacs.has(d.mac),
    })).join("");
    document.getElementById("host-empty").classList.toggle("hidden", rows.length > 0);
    document.getElementById("host-pagination").innerHTML = rows.length ? paginationHtml("host", info) : "";
    wirePagination(document.getElementById("host-pagination"), "host", renderHostTable);
    renderHostBulkBar();

    body.querySelectorAll("[data-row-select]").forEach((cb) => {
      cb.addEventListener("change", () => {
        if (cb.checked) state.hostSelectedMacs.add(cb.dataset.rowSelect); else state.hostSelectedMacs.delete(cb.dataset.rowSelect);
        renderHostTable();
      });
    });
    body.querySelectorAll(".kebab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        state.openMenuMac = state.openMenuMac === btn.dataset.mac ? null : btn.dataset.mac;
        renderHostTable();
      });
    });
    body.querySelectorAll('[data-action="copy"]').forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        navigator.clipboard?.writeText(btn.dataset.mac).catch(() => {});
        state.openMenuMac = null;
        renderHostTable();
      });
    });
    body.querySelectorAll('[data-action="details"]').forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        state.expandedMac = state.expandedMac === btn.dataset.mac ? null : btn.dataset.mac;
        state.openMenuMac = null;
        renderHostTable();
      });
    });
    body.querySelectorAll('[data-action="trust"]').forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        setDeviceLabel(btn.dataset.mac, { trusted: !getDeviceLabel(btn.dataset.mac).trusted });
        state.openMenuMac = null;
        renderHostTable();
      });
    });
    body.querySelectorAll("[data-mac-link]").forEach((btn) => {
      btn.addEventListener("click", (e) => { e.stopPropagation(); goToDevice(btn.dataset.macLink); });
    });
  }

  function renderHostBulkBar() {
    const bar = document.getElementById("host-bulk-bar");
    const n = state.hostSelectedMacs.size;
    if (!n) { bar.innerHTML = ""; return; }
    bar.innerHTML = `<div class="host-bulk-bar">
      <span><strong>${n}</strong> selected</span>
      <button type="button" class="btn btn-primary" id="host-bulk-trust">${ICON("shield")}Mark trusted</button>
      <button type="button" class="btn" id="host-bulk-untrust">Remove trust</button>
      <button type="button" class="btn" id="host-bulk-export">${ICON("download")}Export CSV</button>
      <span class="spacer"></span>
      <button type="button" class="btn btn-icon" id="host-bulk-clear" title="Clear selection">${ICON("x")}</button>
    </div>`;
    document.getElementById("host-bulk-trust").addEventListener("click", () => {
      // Solo per una selezione multipla: su un singolo device è la stessa identica azione già
      // disponibile dal menu della riga, senza bisogno di un passaggio di conferma in più.
      if (n > 1 && !confirm(`Mark ${n} devices as trusted?`)) return;
      for (const mac of state.hostSelectedMacs) setDeviceLabel(mac, { trusted: true });
      showToast(`${n} device${n === 1 ? "" : "s"} marked as trusted`);
      renderHostTable();
    });
    document.getElementById("host-bulk-untrust").addEventListener("click", () => {
      if (n > 1 && !confirm(`Remove trust from ${n} devices?`)) return;
      for (const mac of state.hostSelectedMacs) setDeviceLabel(mac, { trusted: false });
      showToast(`Trust removed from ${n} device${n === 1 ? "" : "s"}`);
      renderHostTable();
    });
    document.getElementById("host-bulk-export").addEventListener("click", () => {
      const rows = latestLanByMac(state.lanRows).filter((d) => state.hostSelectedMacs.has(d.mac)).map(stripInternal);
      downloadBlob(toCsvBlob(rows), "hosts_selection.csv");
      showToast(`Exported ${rows.length.toLocaleString("en-GB")} row${rows.length === 1 ? "" : "s"} to hosts_selection.csv`);
    });
    document.getElementById("host-bulk-clear").addEventListener("click", () => {
      state.hostSelectedMacs.clear();
      renderHostTable();
    });
  }
}

function hostRowHtml(d, ctx) {
  const { fingerprint, alerts, fingerprintByMac, alertsByMac, osFingerprint, dhcpLease, trafficBytes, maxTraffic, visibleColumns, colCount, selected } = ctx;
  const menuOpen = state.openMenuMac === d.mac;
  const expanded = state.expandedMac === d.mac;
  const deviceType = fingerprint?.device_type || "";
  const risk = rowRiskScore(d, fingerprintByMac, alertsByMac);
  const trusted = getDeviceLabel(d.mac).trusted;
  const name = displayName(d.mac, d.hostname || d.mac);
  const linkedCount = (d._members || [d]).length - 1;
  const stale = isHostStale(d);

  let html = `<tr class="${stale ? "host-row-stale" : ""}">
    <td><input type="checkbox" data-row-select="${escapeHtml(d.mac)}" ${selected ? "checked" : ""}></td>
    <td>${statusBadge(d.status)}${stale ? `<span class="badge risk-badge tone-muted" title="Offline for more than ${STALE_OFFLINE_DAYS} days — may no longer be present on this network">Stale</span>` : ""}</td>
    <td class="mono">${escapeHtml(d.ip)}</td>
    <td>
      <button class="link-cell" data-mac-link="${escapeHtml(d.mac)}" title="Open device profile">${escapeHtml(name)}</button>
      ${trustBadgeHtml(d.mac)}
    </td>
    <td class="mono">${escapeHtml(d.mac)}${linkedCount > 0 ? `<span class="host-group-chip" title="${linkedCount} other MAC linked as the same physical device">+${linkedCount}</span>` : ""}</td>
    <td>${escapeHtml(d.vendor) || '<span class="muted">—</span>'}</td>
    <td>${escapeHtml(deviceType) || '<span class="muted">—</span>'}</td>
    <td>${riskBadgeHtml(risk)}</td>
    <td>${formatPorts(d.open_ports) || '<span class="muted">—</span>'}</td>
    ${visibleColumns.has("osGuess") ? `<td>${escapeHtml(osFingerprint?.os_guess) || '<span class="muted">—</span>'}</td>` : ""}
    ${visibleColumns.has("mdns") ? `<td>${escapeHtml(fingerprint?.mdns_name) || '<span class="muted">—</span>'}</td>` : ""}
    ${visibleColumns.has("arp") ? `<td>${!dhcpLease ? '<span class="muted">—</span>' : !dhcpLease.arp_confirmed ? `<span class="badge risk-badge tone-warning" title="Seen in the router's DHCP lease table but silent on the last ARP scan — may just be asleep or firewalled">Silent on ARP</span>` : '<span class="badge risk-badge tone-good">Confirmed</span>'}</td>` : ""}
    ${visibleColumns.has("uptime") ? (() => { const u = computeUptimeSummary(d.mac); return `<td>${u ? `${u.pct}%` : '<span class="muted">—</span>'}</td>`; })() : ""}
    ${visibleColumns.has("traffic") ? `<td>${trafficBytes ? `<span class="host-traffic-cell"><span class="host-traffic-bar" style="width:${Math.max((trafficBytes / maxTraffic) * 100, 4)}%"></span>${formatBytes(trafficBytes)}</span>` : '<span class="muted">—</span>'}</td>` : ""}
    <td>${formatTs(d.timestamp)}</td>
    <td>
      <div class="row-menu">
        <button class="kebab-btn" data-mac="${escapeHtml(d.mac)}" aria-label="Actions">${ICON("kebab")}</button>
        ${menuOpen ? `<div class="row-menu-drop">
          <button data-action="details" data-mac="${escapeHtml(d.mac)}">${ICON("eye")}View details</button>
          <button data-mac-link="${escapeHtml(d.mac)}">${ICON("monitor")}Full profile</button>
          <button data-action="trust" data-mac="${escapeHtml(d.mac)}">${ICON("shield")}${trusted ? "Remove trust" : "Mark as trusted"}</button>
          <button data-action="copy" data-mac="${escapeHtml(d.mac)}">${ICON("copy")}Copy MAC</button>
        </div>` : ""}
      </div>
    </td>
  </tr>`;

  if (expanded) {
    const history = sightingsForMac(d.mac).slice(-15).reverse();
    html += `<tr class="detail-row"><td colspan="${colCount}">
      <div class="detail-grid">
        <div><span>Hostname</span>${escapeHtml(d.hostname) || "—"}</div>
        <div><span>Vendor</span>${escapeHtml(d.vendor) || "—"}</div>
        <div><span>Device type</span>${escapeHtml(deviceType) || "—"}</div>
        <div><span>Risk score</span>${riskBadgeHtml(risk)}</div>
        <div><span>Open ports</span>${formatPorts(d.open_ports) || "—"}</div>
        <div><span>First seen</span>${formatTs(firstSeenTs(d.mac))}</div>
        ${linkedCount > 0 ? `<div><span>Linked MACs</span>${(d._members || []).map((m) => escapeHtml(m.mac)).join(", ")}</div>` : ""}
      </div>
      <div class="detail-history">
        ${history.map((h) => `<div class="detail-history-row"><span class="mono">${formatTs(h.timestamp)}</span>${statusBadge(h.status)}<span>${escapeHtml(h.ip)}</span></div>`).join("") || '<p class="muted">No history available.</p>'}
      </div>
    </td></tr>`;
  }
  return html;
}

/* ---------------------------------------------------------------------- *
 * WiFi page (KPI + grafici + tabella grezza)
 * ---------------------------------------------------------------------- */

function renderWifiSection(container) {
  container.innerHTML = `
    <div class="card-head">
      <h2>Raw probe log</h2>
      <span class="card-sub">one probe request per row — for deeper analysis or export</span>
      <div class="filter-row" style="margin:0;">
        <div class="search-input">${ICON("search")}<input type="text" id="wifi-search" placeholder="Search by MAC, SSID, vendor…"></div>
      </div>
    </div>
    <div class="table-scroll table-scroll-tall">
      <table class="data-table" id="wifi-table">
        <thead><tr>
          <th data-sort="timestamp">Timestamp</th>
          <th data-sort="mac">MAC</th>
          <th data-sort="vendor">Vendor</th>
          <th data-sort="ssid">SSID requested</th>
          <th data-sort="rssi">Signal</th>
          <th data-sort="channel">Channel</th>
        </tr></thead>
        <tbody id="wifi-table-body"></tbody>
      </table>
      <p class="empty-state hidden" id="wifi-empty">No probes — check the data source in Settings.</p>
      <div id="wifi-pagination"></div>
    </div>`;

  document.getElementById("wifi-search").addEventListener("input", () => { getPagination("wifi-raw").page = 1; renderWifiTableBody(); });
  const wifiThead = container.querySelector("#wifi-table thead");
  wireSortableHeaders(wifiThead, state.wifiSort, () => { renderWifiTableBody(); updateSortArrows(wifiThead, state.wifiSort); });
  updateSortArrows(wifiThead, state.wifiSort);
  renderWifiTableBody();
}

function renderWifiTableBody() {
  const searchEl = document.getElementById("wifi-search");
  const body = document.getElementById("wifi-table-body");
  if (!searchEl || !body) return;

  const search = searchEl.value.trim().toLowerCase();
  let rows = state.wifiRows
    .filter((r) => !search || `${r.mac} ${r.ssid} ${r.vendor}`.toLowerCase().includes(search))
    .map((r) => ({ ...r, _ts: parseTs(r.timestamp) || 0 }));
  rows = sortRows(rows, state.wifiSort.key, state.wifiSort.dir);

  const info = paginate(rows, "wifi-raw");
  body.innerHTML = info.pageRows.map((r) => `<tr>
    <td>${formatTs(r.timestamp)}</td>
    <td class="mono">${escapeHtml(r.mac)}</td>
    <td>${escapeHtml(r.vendor) || '<span class="muted">—</span>'}</td>
    <td>${escapeHtml(r.ssid) || '<span class="muted">hidden/empty</span>'}</td>
    <td>${signalBarsHtml(r.rssi)}</td>
    <td>${escapeHtml(r.channel)}</td>
  </tr>`).join("");
  document.getElementById("wifi-empty").classList.toggle("hidden", rows.length > 0);
  document.getElementById("wifi-pagination").innerHTML = rows.length ? paginationHtml("wifi-raw", info) : "";
  wirePagination(document.getElementById("wifi-pagination"), "wifi-raw", renderWifiTableBody);
}

/** Sotto-tab persistenti di una pagina (WiFi/BLE): un solo tab attivo, sostituisce il vecchio
 * meccanismo "focus una sezione, nascondi il resto" (wifiFocusSection) — le sezioni ora vivono
 * sempre sotto un tab con un'identità chiara, invece che nascoste finché qualcosa non le richiede
 * esplicitamente da un link della Dashboard. */
function pageTabsHtml(tabs, activeId) {
  return `<div class="page-tabs">${tabs.map((t) => `<button type="button" class="page-tab ${t.id === activeId ? "active" : ""}" data-page-tab="${t.id}">${escapeHtml(t.label)}</button>`).join("")}</div>`;
}
function wirePageTabs(container, stateKey, onChange) {
  container.querySelectorAll("[data-page-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (state[stateKey] === btn.dataset.pageTab) return;
      state[stateKey] = btn.dataset.pageTab;
      savePersistedUiState({ [stateKey]: btn.dataset.pageTab });
      onChange();
    });
  });
}

const WIFI_TABS = [
  { id: "overview", label: "Overview" },
  { id: "networks", label: "Networks" },
  { id: "devices", label: "Devices" },
  { id: "security", label: "Security" },
];

function renderWifiPage(container) {
  const tab = state.wifiTab;
  const wifiLast24h = state.wifiRows.filter((r) => within24h(parseTs(r.timestamp)));
  const wifiStatus = state.sourceStatus.wifi;

  container.innerHTML = `
    <div class="page-section">${pageTabsHtml(WIFI_TABS, tab)}</div>

    ${tab === "overview" && wifiStatus?.truncated ? `
      <div class="page-section info-banner">
        ${ICON("layers")}
        <span>WiFi probe log at ${formatBytes(wifiStatus.totalBytes)}: to stay fast the dashboard only loads the last ${formatBytes(TAIL_FETCH_BYTES)} (the most recent). The views below — including the 24h ones — are correct, but "Trend" over 30 days may not cover the whole period. Set <code>--max-log-size-mb</code>/<code>--log-backup-count</code> on the daemon to keep the file from growing unbounded.</span>
      </div>
    ` : ""}

    ${tab === "overview" ? `
      <div class="page-section">
        <div class="card-head">
          <h2>Adjacent networks</h2>
          <span class="card-sub">Real WiFi networks detected around you from their own beacon frames — click a tile to jump to the matching list</span>
        </div>
      </div>
      <div class="page-section kpi-row">
        ${(() => {
          const nets = computeWifiApOverview();
          const openCount = nets.filter((e) => e.security === "open").length;
          const wpa23Count = nets.filter((e) => e.security === "wpa2_wpa3").length;
          const handshakeCount = state.handshakeRows.length;
          return `
            ${kpiTile({
              label: "Networks detected", icon: "wifi", tone: "violet",
              value: nets.length, sub: "adjacent networks, all time", navKey: "nets-all",
            })}
            ${kpiTile({
              label: "Open networks", icon: "shield", tone: openCount ? "critical" : "good",
              value: openCount, sub: "No encryption at all", subTone: openCount ? "critical" : "good", navKey: "nets-open",
            })}
            ${kpiTile({
              label: "WPA2/WPA3 networks", icon: "shield", tone: "good",
              value: wpa23Count, sub: `of ${nets.length} networks detected total`, navKey: "nets-wpa23",
            })}
            ${kpiTile({
              label: "Handshake captures", icon: "wifi", tone: handshakeCount ? "good" : "blue",
              value: handshakeCount,
              sub: handshakeCount ? "for the home networks in --home-ssid" : "None captured yet (--capture-handshakes)",
              navKey: "handshakes",
            })}
          `;
        })()}
      </div>
      <div class="page-section grid-3">
        <div class="card">
          <div class="card-head"><h2>Networks by security</h2><span class="card-sub">adjacent networks, all time</span></div>
          <div class="hbar-chart" id="chart-wifi-security" data-empty="No data"></div>
        </div>
        <div class="card">
          <div class="card-head"><h2>Probe activity <span class="card-sub">${rangeLabel()}</span></h2></div>
          <div class="bar-chart" id="chart-wifi-activity" data-empty="No data"></div>
        </div>
        <div class="card">
          <div class="card-head"><h2>WiFi channels</h2><span class="card-sub">probes per channel (${rangeLabel()})</span></div>
          <div class="hbar-chart" id="chart-wifi-channel" data-empty="No data"></div>
        </div>
      </div>
    ` : ""}

    ${tab === "networks" ? `
      <div class="page-section card" id="wifi-aps-mount"></div>
      <div class="page-section card" id="wifi-ssid-mount"></div>
    ` : ""}

    ${tab === "devices" ? `
      <div class="page-section card" id="wifi-devices-mount"></div>
      <div class="page-section card" id="wifi-section-mount"></div>
    ` : ""}

    ${tab === "security" ? `
      <div class="page-section card" id="wifi-presence-mount"></div>
      <div class="page-section card" id="wifi-handshakes-mount"></div>
    ` : ""}
  `;

  wirePageTabs(container, "wifiTab", () => renderWifiPage(container));

  if (tab === "overview") {
    renderBarChart(document.getElementById("chart-wifi-activity"), hourlyCounts(state.wifiRows));
    renderHBarChart(document.getElementById("chart-wifi-channel"), wifiChannelSegments(wifiLast24h).map(([ch, n]) => [`Channel ${ch}`, n]), "var(--cat-3)");
    const wifiSecurityBreakdown = computeWifiSecurityBreakdown();
    renderHBarChart(document.getElementById("chart-wifi-security"), wifiSecurityBreakdown.entries, wifiSecurityBreakdown.colors);
    const goToNetworks = (security) => {
      state.wifiApFilters.security = security;
      state.wifiTab = "networks";
      savePersistedUiState({ wifiTab: "networks" });
      renderWifiPage(container);
    };
    wireKpiNav(container, {
      "nets-all": () => goToNetworks("all"),
      "nets-open": () => goToNetworks("open"),
      "nets-wpa23": () => goToNetworks("wpa2_wpa3"),
      "handshakes": () => {
        state.wifiTab = "security";
        savePersistedUiState({ wifiTab: "security" });
        renderWifiPage(container);
      },
    });
  }
  if (tab === "networks") {
    renderWifiApsTable(document.getElementById("wifi-aps-mount"));
    renderWifiSsidTable(document.getElementById("wifi-ssid-mount"));
  }
  if (tab === "devices") {
    renderWifiDevicesTable(document.getElementById("wifi-devices-mount"));
    renderWifiSection(document.getElementById("wifi-section-mount"));
  }
  if (tab === "security") {
    renderPresenceCard(document.getElementById("wifi-presence-mount"), state.wifiPresenceRows, "--wifi-home-macs");
    renderHandshakeCapturesTable(document.getElementById("wifi-handshakes-mount"));
  }
}

/**
 * Handshake EAPOL (WPA/WPA2) catturati passivamente per le reti "di casa" (--capture-handshakes,
 * richiede --home-ssid): solo i metadati sono qui, il file .pcap vero e proprio resta sul
 * filesystem del Pi (percorso mostrato) — va prelevato via scp/sftp per un audit offline con
 * strumenti come aircrack-ng/hashcat, la dashboard non lo apre né lo scarica.
 */
/** Vero solo se i messaggi catturati bastano davvero a un tentativo di cracking offline: serve
 * l'ANonce (da M1, o M3 che lo ripete) insieme a SNonce+MIC (solo in M2) — la stessa condizione
 * che il daemon usa per decidere se salvare la cattura (vedi _has_crackable_pair in
 * sentinel_handshake.py). Una riga più vecchia di quel fix può comunque avere solo un messaggio
 * isolato (es. "1/4 (2)"): utile distinguerla a colpo d'occhio da una davvero pronta per
 * aircrack-ng/hashcat, invece di scoprirlo solo al momento dell'audit. */
function handshakeHasCrackablePair(messages) {
  if (!Array.isArray(messages)) return false;
  return messages.includes(2) && (messages.includes(1) || messages.includes(3));
}

function renderHandshakeCapturesTable(container) {
  const rows = state.handshakeRows.slice().sort((a, b) => (parseTs(b.timestamp) || 0) - (parseTs(a.timestamp) || 0));
  container.innerHTML = `
    <div class="card-head">
      <h2>Handshake captures</h2>
      <span class="card-sub">passive WPA/WPA2 4-way handshake capture for the home networks in <code>--home-ssid</code>, for offline password-strength auditing (aircrack-ng/hashcat) — no password is ever stored in clear text, and no frame is ever sent to trigger this. Rows highlighted in green have a usable message pair (2 with 1 and/or 3); the rest are logged but likely won't crack with aircrack-ng/hashcat.</span>
    </div>
    <div class="table-scroll">
      <table class="data-table">
        <thead><tr><th>Timestamp</th><th>SSID</th><th>BSSID</th><th>Station</th><th>Messages</th><th>Pcap file</th></tr></thead>
        <tbody>${rows.map((r) => {
          const usable = handshakeHasCrackablePair(r.messages);
          return `<tr${usable ? ` class="row-usable" title="Has a usable message pair (2 with 1 and/or 3) — ready for aircrack-ng/hashcat"` : ""}>
          <td>${formatTs(r.timestamp)}</td>
          <td>${escapeHtml(r.ssid) || '<span class="muted">—</span>'}</td>
          <td class="mono">${escapeHtml(r.bssid)}</td>
          <td class="mono">${escapeHtml(r.sta_mac)}</td>
          <td>${Array.isArray(r.messages) && r.messages.length ? `${r.messages.length}/4 (${r.messages.join(",")})` : `${r.frame_count || 0} frame`}</td>
          <td class="mono" title="${escapeHtml(r.pcap_path)}">${escapeHtml((r.pcap_path || "").split("/").pop())}</td>
        </tr>`;
        }).join("") || '<tr><td colspan="6"><p class="empty-state">No handshake captured yet — enable <code>--capture-handshakes</code> (requires <code>--home-ssid</code>) on the daemon, or check the data source in Settings.</p></td></tr>'}</tbody>
      </table>
    </div>`;
}

/* ---------------------------------------------------------------------- *
 * BLE page
 * ---------------------------------------------------------------------- */

const BLE_TABS = [
  { id: "overview", label: "Overview" },
  { id: "devices", label: "Devices" },
  { id: "security", label: "Security" },
];

function renderBlePage(container) {
  const tab = state.bleTab;
  const bleLast24h = state.bleRows.filter((r) => within24h(parseTs(r.timestamp)));
  const distinctMacs = new Set(bleLast24h.map((r) => r.mac));
  const named = bleLast24h.filter((r) => r.name && r.name.trim());
  const avg = avgRssi(bleLast24h);

  container.innerHTML = `
    <div class="page-section">${pageTabsHtml(BLE_TABS, tab)}</div>

    ${tab === "overview" ? `
      <div class="page-section kpi-row">
        ${kpiTile({
          label: `BLE advertisements (${rangeLabel()})`, icon: "bluetooth", tone: "orange",
          value: bleLast24h.length, sub: `${distinctMacs.size} distinct MACs`,
          sparkValues: hourlyCounts(state.bleRows), sparkColor: "var(--cat-2)",
          navKey: "ble-devices",
        })}
        ${kpiTile({
          label: "With advertised name", icon: "eye", tone: "orange",
          value: named.length,
          sub: bleLast24h.length ? `${Math.round((named.length / bleLast24h.length) * 100)}% of total (${rangeLabel()})` : "No data",
        })}
        ${kpiTile({
          label: `Average RSSI (${rangeLabel()})`, icon: "wifi", tone: "orange",
          value: avg === null ? "—" : avg, valueSuffix: avg === null ? "" : "dBm",
          sub: "Closer to 0 = stronger signal",
        })}
        ${kpiTile({
          label: "Known manufacturers", icon: "users", tone: "orange",
          value: new Set(bleLast24h.flatMap((r) => (Array.isArray(r.manufacturer_ids) ? r.manufacturer_ids : []).filter((id) => BLE_COMPANY_IDS[id]))).size,
          sub: "From recognized Bluetooth SIG company IDs",
        })}
        ${(() => {
          const trackerCount = computeBleDeviceOverview(state.bleRows).filter((e) => e.isTracker).length;
          return kpiTile({
            label: "Possible trackers", icon: "shield", tone: trackerCount ? "critical" : "good",
            value: trackerCount,
            sub: trackerCount ? "AirTag/Tile/SmartTag-like advertisement seen" : "None detected",
            subTone: trackerCount ? "critical" : "good",
            navKey: "ble-trackers",
          });
        })()}
      </div>
      <div class="page-section card">
        <div class="card-head"><h2>BLE activity <span class="card-sub">${rangeLabel()}</span></h2></div>
        <div class="bar-chart" id="chart-ble-activity" data-empty="No data"></div>
      </div>
    ` : ""}

    ${tab === "devices" ? `
      <div class="page-section card" id="ble-devices-mount"></div>
      <div class="page-section card" id="ble-section-mount"></div>
    ` : ""}

    ${tab === "security" ? `
      <div class="page-section card" id="ble-presence-mount"></div>
    ` : ""}
  `;

  wirePageTabs(container, "bleTab", () => renderBlePage(container));

  if (tab === "overview") {
    renderBarChart(document.getElementById("chart-ble-activity"), hourlyCounts(state.bleRows));
    const goToBleDevices = (search) => {
      state.bleTab = "devices";
      savePersistedUiState({ bleTab: "devices" });
      renderBlePage(container);
      const input = document.getElementById("ble-devices-search");
      if (input && search) { input.value = search; input.dispatchEvent(new Event("input")); }
    };
    wireKpiNav(container, {
      "ble-devices": () => goToBleDevices(""),
      // I tracker sono già in cima alla tabella device (ordinamento isTracker-first): basta
      // portarci, senza inventare un filtro dedicato che esisterebbe solo per questo KPI.
      "ble-trackers": () => goToBleDevices(""),
    });
  }
  if (tab === "devices") {
    renderBleDevicesTable(document.getElementById("ble-devices-mount"));
    renderBleSection(document.getElementById("ble-section-mount"));
  }
  if (tab === "security") {
    renderPresenceCard(document.getElementById("ble-presence-mount"), state.blePresenceRows, "--ble-home-macs");
  }
}

/**
 * Eventi di presenza/assenza per i MAC "di casa" configurati sul daemon (--ble-home-macs o
 * --wifi-home-macs, stesso principio su entrambe le radio): mostra gli ultimi arrivi/uscite così
 * come sono nel log, la dashboard non conosce quali MAC sono stati configurati lato daemon.
 */
function renderPresenceCard(container, rows, flagName) {
  const sorted = rows.slice().sort((a, b) => (parseTs(b.timestamp) || 0) - (parseTs(a.timestamp) || 0));
  container.innerHTML = `
    <div class="card-head">
      <h2>Presence</h2>
      <span class="card-sub">arrival/departure events for the home MAC addresses configured on the daemon (<code>${flagName}</code>)</span>
    </div>
    ${sorted.length ? `
      <div class="table-scroll">
        <table class="data-table">
          <thead><tr><th>Timestamp</th><th>Device</th><th>Event</th><th>Duration</th><th></th></tr></thead>
          <tbody>${sorted.slice(0, 30).map((r) => `<tr>
            <td>${formatTs(r.timestamp)}</td>
            <td><button class="link-cell" data-mac-link="${escapeHtml(r.mac)}">${escapeHtml(displayName(r.mac, r.mac))}</button></td>
            <td>${r.event === "arrived" ? '<span class="badge status-online"><span class="dot"></span>Arrived</span>' : '<span class="badge status-offline"><span class="dot"></span>Left</span>'}</td>
            <td>${typeof r.duration_s === "number" ? formatDuration(r.duration_s * 1000) : '<span class="muted">—</span>'}</td>
            <td><button type="button" class="btn btn-icon" data-rename-mac="${escapeHtml(r.mac)}" title="Name this device (e.g. a person's name)">${ICON("edit")}</button></td>
          </tr>`).join("")}</tbody>
        </table>
      </div>
    ` : `<p class="empty-state">No presence events — configure <code>${flagName}</code> on the daemon to enable this.</p>`}
  `;
  container.querySelectorAll("[data-mac-link]").forEach((btn) => {
    btn.addEventListener("click", () => goToDevice(btn.dataset.macLink));
  });
  container.querySelectorAll("[data-rename-mac]").forEach((btn) => {
    btn.addEventListener("click", () => promptRenameDevice(btn.dataset.renameMac, () => renderPresenceCard(container, rows, flagName)));
  });
}

/**
 * Riepilogo per device BLE: un MAC, una riga, con nome pubblicizzato,
 * manufacturer, segnale medio, numero di avvistamenti e ultimo avvistamento
 * su tutto lo storico caricato. Sostituisce la vecchia coppia "grafico top
 * manufacturer" (ridondante col KPI "Manufacturer noti" e con la colonna
 * manufacturer già visibile qui e nel log grezzo) + "top 10 per avvistamenti"
 * con un'unica tabella ricercabile e paginata, senza limite ai primi 10.
 */
function computeBleDeviceOverview(rows) {
  const byMac = new Map();
  for (const r of rows) {
    if (!r.mac) continue;
    if (!byMac.has(r.mac)) byMac.set(r.mac, { mac: r.mac, name: "", deviceType: "", rssiSum: 0, rssiCount: 0, sightings: 0, lastTs: 0, manufacturerIds: new Set() });
    const e = byMac.get(r.mac);
    e.sightings += 1;
    if (!e.name && r.name) e.name = r.name;
    if (r.device_type) e.deviceType = r.device_type;
    if (typeof r.rssi === "number") { e.rssiSum += r.rssi; e.rssiCount += 1; }
    const ts = parseTs(r.timestamp) || 0;
    if (ts > e.lastTs) e.lastTs = ts;
    for (const id of (Array.isArray(r.manufacturer_ids) ? r.manufacturer_ids : [])) e.manufacturerIds.add(id);
  }
  return [...byMac.values()].map((e) => ({
    ...e,
    avgRssi: e.rssiCount ? Math.round(e.rssiSum / e.rssiCount) : null,
    manufacturer: e.manufacturerIds.size ? bleCompanyLabel([...e.manufacturerIds][0]) : "",
    isTracker: e.deviceType.startsWith("Possibile tracker"),
  }));
}

function renderBleDevicesTable(container) {
  container.innerHTML = `
    <div class="card-head">
      <h2>BLE devices</h2>
      <span class="card-sub">a summary per MAC — name, manufacturer, signal and sightings, across all loaded history</span>
      <div class="filter-row" style="margin:0;">
        <div class="search-input">${ICON("search")}<input type="text" id="ble-devices-search" placeholder="Search by MAC, name, manufacturer…"></div>
        ${inlineExportHtml("ble-devices")}
      </div>
    </div>
    <div class="table-scroll">
      <table class="data-table">
        <thead><tr><th>Device</th><th>Type</th><th>Manufacturer</th><th>Average signal</th><th>Sightings</th><th>Last seen</th><th></th></tr></thead>
        <tbody id="ble-devices-body"></tbody>
      </table>
      <p class="empty-state hidden" id="ble-devices-empty">No BLE advertisements — check the data source in Settings.</p>
      <div id="ble-devices-pagination"></div>
    </div>`;
  document.getElementById("ble-devices-search").addEventListener("input", () => { getPagination("ble-devices").page = 1; renderBleDevicesTableBody(); });
  renderBleDevicesTableBody();
}

function renderBleDevicesTableBody() {
  const searchEl = document.getElementById("ble-devices-search");
  const body = document.getElementById("ble-devices-body");
  if (!searchEl || !body) return;

  const search = searchEl.value.trim().toLowerCase();
  const all = computeBleDeviceOverview(state.bleRows);
  const rows = all
    .filter((e) => !search || `${e.mac} ${displayName(e.mac, "")} ${e.name} ${e.manufacturer} ${e.deviceType}`.toLowerCase().includes(search))
    .sort((a, b) => (b.isTracker - a.isTracker) || (b.sightings - a.sightings));

  const info = paginate(rows, "ble-devices");
  body.innerHTML = info.pageRows.map((e) => `<tr${e.isTracker ? ' class="row-flagged"' : ""}>
    <td>
      <button class="link-cell" data-mac-link="${escapeHtml(e.mac)}">${escapeHtml(displayName(e.mac, e.name || e.mac))}</button>
      ${trustBadgeHtml(e.mac)}
    </td>
    <td>${e.isTracker ? `<span class="badge risk-badge tone-critical" title="${escapeHtml(e.deviceType)}">${ICON("shield")}Tracker</span>` : escapeHtml(e.deviceType) || '<span class="muted">—</span>'}</td>
    <td>${escapeHtml(e.manufacturer) || '<span class="muted">—</span>'}</td>
    <td>${signalBarsHtml(e.avgRssi)}</td>
    <td>${e.sightings}</td>
    <td>${formatTs(e.lastTs)}</td>
    ${deviceRowActionsHtml(e.mac)}
  </tr>`).join("");
  document.getElementById("ble-devices-empty").classList.toggle("hidden", rows.length > 0);
  document.getElementById("ble-devices-pagination").innerHTML = rows.length ? paginationHtml("ble-devices", info) : "";
  wirePagination(document.getElementById("ble-devices-pagination"), "ble-devices", renderBleDevicesTableBody);
  body.querySelectorAll("[data-mac-link]").forEach((btn) => {
    btn.addEventListener("click", () => goToDevice(btn.dataset.macLink));
  });
  wireDeviceRowActions(body, renderBleDevicesTableBody);
  const bleCard = document.getElementById("ble-devices-mount");
  if (bleCard) wireInlineExport(bleCard, "ble-devices", "ble_devices", () => rows);
}

function renderBleSection(container) {
  container.innerHTML = `
    <div class="card-head">
      <h2>Raw advertisement log</h2>
      <span class="card-sub">one advertisement per row — for deeper analysis or export</span>
      <div class="filter-row" style="margin:0;">
        <div class="search-input">${ICON("search")}<input type="text" id="ble-search" placeholder="Search by MAC, name, manufacturer…"></div>
      </div>
    </div>
    <div class="table-scroll table-scroll-tall">
      <table class="data-table" id="ble-table">
        <thead><tr>
          <th data-sort="timestamp">Timestamp</th>
          <th data-sort="mac">MAC</th>
          <th data-sort="name">Name</th>
          <th>Type</th>
          <th>Manufacturer</th>
          <th data-sort="rssi">Signal</th>
          <th>Services</th>
        </tr></thead>
        <tbody id="ble-table-body"></tbody>
      </table>
      <p class="empty-state hidden" id="ble-empty">No advertisements — enable <code>--ble</code> on the daemon and check the data source in Settings.</p>
      <div id="ble-pagination"></div>
    </div>`;

  document.getElementById("ble-search").addEventListener("input", () => { getPagination("ble-raw").page = 1; renderBleTableBody(); });
  const bleThead = container.querySelector("#ble-table thead");
  wireSortableHeaders(bleThead, state.bleSort, () => { renderBleTableBody(); updateSortArrows(bleThead, state.bleSort); });
  updateSortArrows(bleThead, state.bleSort);
  renderBleTableBody();
}

function renderBleTableBody() {
  const searchEl = document.getElementById("ble-search");
  const body = document.getElementById("ble-table-body");
  if (!searchEl || !body) return;

  const search = searchEl.value.trim().toLowerCase();
  let rows = state.bleRows
    .map((r) => ({
      ...r,
      _ts: parseTs(r.timestamp) || 0,
      _manufacturers: (Array.isArray(r.manufacturer_ids) ? r.manufacturer_ids : []).map(bleCompanyLabel),
    }))
    .filter((r) => !search || `${r.mac} ${r.name} ${r._manufacturers.join(" ")}`.toLowerCase().includes(search));
  rows = sortRows(rows, state.bleSort.key, state.bleSort.dir);

  const info = paginate(rows, "ble-raw");
  body.innerHTML = info.pageRows.map((r) => `<tr${r.device_type && r.device_type.startsWith("Possibile tracker") ? ' class="row-flagged"' : ""}>
    <td>${formatTs(r.timestamp)}</td>
    <td class="mono">${escapeHtml(r.mac)}</td>
    <td>${escapeHtml(r.name) || '<span class="muted">—</span>'}</td>
    <td>${escapeHtml(r.device_type) || '<span class="muted">—</span>'}</td>
    <td>${escapeHtml(r._manufacturers.join(", ")) || '<span class="muted">—</span>'}</td>
    <td>${signalBarsHtml(r.rssi)}</td>
    <td>${Array.isArray(r.service_uuids) && r.service_uuids.length ? r.service_uuids.length : '<span class="muted">—</span>'}</td>
  </tr>`).join("");
  document.getElementById("ble-empty").classList.toggle("hidden", rows.length > 0);
  document.getElementById("ble-pagination").innerHTML = rows.length ? paginationHtml("ble-raw", info) : "";
  wirePagination(document.getElementById("ble-pagination"), "ble-raw", renderBleTableBody);
}

/* ---------------------------------------------------------------------- *
 * Network map
 * ---------------------------------------------------------------------- */

function renderNetworkMap(container) {
  const lanCurrent = latestLanByMac(state.lanRows);
  if (!lanCurrent.length) {
    container.innerHTML = '<p class="empty-state">No devices to show. Run a discovery and reload the data.</p>';
    return;
  }
  const W = 640, H = 440, cx = W / 2, cy = H / 2, R = Math.min(cx, cy) - 70;
  const gatewayLabel = getSetting("netGateway") || getSetting("netLabel") || "Gateway";
  const nodes = lanCurrent.slice(0, 24);
  const n = nodes.length;
  const links = [];
  const nodeEls = [];
  const fingerprintByMac = latestFingerprintByMac(state.fingerprintRows);
  const alertsByMac = groupAlertsByMac(computeAlerts());

  nodes.forEach((dev, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    const x = cx + R * Math.cos(angle);
    const y = cy + R * Math.sin(angle);
    links.push(`<line class="netmap-link" x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`);
    const color = dev.status === "offline" ? "var(--status-muted)" : dev.status === "new" ? "var(--status-warning)" : "var(--status-good)";
    const label = escapeHtml(dev.hostname || dev.vendor || "Device");
    const shortLabel = label.length > 14 ? `${label.slice(0, 13)}…` : label;
    const risk = computeRiskScore(dev, fingerprintByMac.get(dev.mac), alertsByMac.get(dev.mac));
    const level = riskLevel(risk);
    const hasRiskRing = risk >= 15;
    const ringColor = hasRiskRing ? `var(--status-${level.tone})` : "var(--surface)";
    const ringWidth = hasRiskRing ? 3 : 2.5;
    nodeEls.push(`<g class="netmap-node" data-mac="${escapeHtml(dev.mac)}" data-tip="${escapeHtml(dev.hostname || dev.mac)} — ${escapeHtml(dev.ip)} — ${escapeHtml(dev.status)} — Risk: ${risk} (${escapeHtml(level.label)})" transform="translate(${x.toFixed(1)},${y.toFixed(1)})">
      <circle r="9" style="fill:${color}" stroke="${ringColor}" stroke-width="${ringWidth}"/>
      <text y="20" text-anchor="middle">${shortLabel}</text>
      <text class="netmap-ip" y="31" text-anchor="middle">${escapeHtml(dev.ip)}</text>
    </g>`);
  });

  const svg = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    ${links.join("")}
    <circle cx="${cx}" cy="${cy}" r="20" style="fill:var(--brand-wash);stroke:var(--brand)" stroke-width="2"/>
    <text x="${cx}" y="${cy + 4}" text-anchor="middle" style="fill:var(--brand)" font-size="9" font-weight="700">GW</text>
    <text x="${cx}" y="${cy + 34}" text-anchor="middle" style="fill:var(--text-primary)" font-size="11" font-weight="700">${escapeHtml(gatewayLabel)}</text>
    ${nodeEls.join("")}
  </svg>`;

  container.innerHTML = `<div class="netmap-wrap">${svg}</div>
    <div class="netmap-legend">
      <span><span class="dot" style="background:var(--status-good)"></span>Online</span>
      <span><span class="dot" style="background:var(--status-warning)"></span>New</span>
      <span><span class="dot" style="background:var(--status-muted)"></span>Offline</span>
      <span><span class="dot" style="background:var(--status-serious)"></span>Ring = medium/high risk</span>
    </div>
    <p class="field-hint">Click a node to open the device's full profile.</p>`;
  container.querySelectorAll(".netmap-node").forEach((el) => {
    attachTooltip(el, el.dataset.tip);
    el.addEventListener("click", () => goToDevice(el.dataset.mac));
  });
}

/* ---------------------------------------------------------------------- *
 * Dintorni di casa: vista radar isometrica. Non è una vera mappa: la
 * distanza dal centro riflette solo il segnale medio (RSSI) nelle ultime
 * 24h — non una distanza fisica reale — e l'angolo attorno alla casa è
 * puramente decorativo (nessun dato di direzione è disponibile dal
 * daemon). Serve solo a farsi un'idea colpo d'occhio di "quanta roba c'è
 * intorno", non a localizzare alcunché.
 * ---------------------------------------------------------------------- */

const RADAR_LOOKBACK_MS = 24 * 3600 * 1000;
const RADAR_MAX_PER_CATEGORY = 30;

/** Angolo pseudo-casuale ma deterministico (stessa chiave = stesso angolo tra un refresh e l'altro), solo per distribuire i pallini attorno alla casa. */
function radarHashAngle(key) {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return (h % 360) * (Math.PI / 180);
}

/** 3 fasce di segnale (stessa logica di signalLevel, semplificata per il radar). 0 = anello più vicino (segnale forte), 2 = anello più esterno (debole/assente). */
function radarRing(rssi) {
  if (typeof rssi !== "number") return 2;
  if (rssi >= -60) return 0;
  if (rssi >= -75) return 1;
  return 2;
}

function computeHouseRadar() {
  const cutoff = Date.now() - RADAR_LOOKBACK_MS;
  const knownLanMacs = new Set(latestLanByMac(state.lanRows).map((d) => d.mac));
  const networks = new Map();
  const probes = new Map();
  const aps = new Map();
  const ble = new Map();

  for (const r of state.wifiRows) {
    const ts = parseTs(r.timestamp);
    if (ts === null || ts < cutoff) continue;
    const rssi = typeof r.rssi === "number" ? r.rssi : null;

    if (r.ssid && r.ssid.trim()) {
      const key = r.ssid.trim();
      if (!networks.has(key)) networks.set(key, { key, label: key, macs: new Set(), rssiSum: 0, rssiCount: 0, sightings: 0, lastTs: 0 });
      const e = networks.get(key);
      e.sightings += 1;
      e.macs.add(r.mac);
      if (rssi !== null) { e.rssiSum += rssi; e.rssiCount += 1; }
      if (ts > e.lastTs) e.lastTs = ts;
    }

    if (!knownLanMacs.has(r.mac)) {
      if (!probes.has(r.mac)) probes.set(r.mac, { key: r.mac, mac: r.mac, label: displayName(r.mac, "") || r.vendor || r.mac, vendor: r.vendor || "", rssiSum: 0, rssiCount: 0, sightings: 0, lastTs: 0 });
      const e = probes.get(r.mac);
      e.sightings += 1;
      if (rssi !== null) { e.rssiSum += rssi; e.rssiCount += 1; }
      if (ts > e.lastTs) e.lastTs = ts;
    }
  }

  for (const r of state.wifiNetworksRows || []) {
    const ts = parseTs(r.timestamp);
    if (ts === null || ts < cutoff || !r.bssid) continue;
    const rssi = typeof r.rssi === "number" ? r.rssi : null;
    if (!aps.has(r.bssid)) aps.set(r.bssid, { key: r.bssid, bssid: r.bssid, label: (r.ssid && r.ssid.trim()) || "(hidden network)", vendor: r.vendor || "", channel: null, rssiSum: 0, rssiCount: 0, sightings: 0, lastTs: 0 });
    const e = aps.get(r.bssid);
    e.sightings += 1;
    if (r.ssid && r.ssid.trim()) e.label = r.ssid.trim();
    if (typeof r.channel === "number") e.channel = r.channel;
    if (rssi !== null) { e.rssiSum += rssi; e.rssiCount += 1; }
    if (ts > e.lastTs) e.lastTs = ts;
  }

  for (const r of state.bleRows) {
    const ts = parseTs(r.timestamp);
    if (ts === null || ts < cutoff) continue;
    const rssi = typeof r.rssi === "number" ? r.rssi : null;
    if (!ble.has(r.mac)) {
      const ids = Array.isArray(r.manufacturer_ids) ? r.manufacturer_ids : [];
      const vendor = ids.length ? bleCompanyLabel(ids[0]) : "";
      ble.set(r.mac, { key: r.mac, mac: r.mac, label: displayName(r.mac, "") || r.name || vendor || r.mac, vendor, rssiSum: 0, rssiCount: 0, sightings: 0, lastTs: 0 });
    }
    const e = ble.get(r.mac);
    e.sightings += 1;
    if (rssi !== null) { e.rssiSum += rssi; e.rssiCount += 1; }
    if (ts > e.lastTs) e.lastTs = ts;
  }

  const finalize = (map) => [...map.values()]
    .filter((e) => e.rssiCount > 0)
    .map((e) => ({ ...e, avgRssi: Math.round(e.rssiSum / e.rssiCount) }))
    .sort((a, b) => b.avgRssi - a.avgRssi)
    .slice(0, RADAR_MAX_PER_CATEGORY);

  return { networks: finalize(networks), probes: finalize(probes), aps: finalize(aps), ble: finalize(ble) };
}

const RADAR_CATEGORY_META = {
  network: { label: "SSIDs requested", color: "var(--cat-1)", icon: "wifi" },
  probe: { label: "WiFi devices", color: "var(--cat-2)", icon: "wifi" },
  ap: { label: "Adjacent networks", color: "var(--cat-3)", icon: "wifi" },
  ble: { label: "Bluetooth devices", color: "var(--cat-7)", icon: "bluetooth" },
};

const HOUSE_IMAGE_W = 480, HOUSE_IMAGE_H = 333.3; // proporzioni dell'immagine house-isometric.png (900x625)

/** Geometria della casa in stile isometrico (immagine fornita dall'utente, ritagliata a sfondo trasparente): pura decorazione. `routerPoint` (vicino alla scala, punto centrale della pianta) è l'origine visiva delle linee guida e degli anelli di "copertura" — anche questi decorativi, non una vera misura di copertura del segnale. */
function computeHouseGeometry(cx, cy) {
  const imgX = cx - HOUSE_IMAGE_W / 2;
  const imgY = cy - HOUSE_IMAGE_H / 2;
  const routerPoint = { x: imgX + HOUSE_IMAGE_W * 0.48, y: imgY + HOUSE_IMAGE_H * 0.44 };
  return { imgX, imgY, routerPoint };
}

function isoHouseSvg(geo) {
  return `<image href="house-isometric.png" x="${geo.imgX.toFixed(1)}" y="${geo.imgY.toFixed(1)}" width="${HOUSE_IMAGE_W}" height="${HOUSE_IMAGE_H}" class="iso-house-img"/>`;
}

const DINTORNI_PANEL_ROWS = 6;
const DINTORNI_CALLOUTS_TOTAL = 10;

/** Distribuisce `total` elementi tra le categorie attive, il più possibile in parti uguali, ma
 * ridistribuendo le quote non utilizzabili (categoria con meno elementi disponibili della sua quota)
 * verso le altre finché ce n'è capienza — così con una sola categoria attiva se ne mostrano fino a
 * `total`, con più categorie attive la vista resta comunque piena finché la somma disponibile lo
 * consente, invece di fermarsi a una quota fissa per categoria come prima. Un giro "round robin"
 * (un elemento a testa a rotazione, saltando le categorie esaurite) ottiene lo stesso risultato senza
 * dover ricalcolare quote/resti ad ogni iterazione. */
function pickBalanced(categories, total) {
  const picked = categories.map(() => []);
  let remaining = total;
  let i = 0;
  while (remaining > 0 && categories.some((c, idx) => picked[idx].length < c.rows.length)) {
    const idx = i % categories.length;
    if (picked[idx].length < categories[idx].rows.length) {
      picked[idx].push(categories[idx].rows[picked[idx].length]);
      remaining--;
    }
    i++;
  }
  return categories.map((c, idx) => ({ key: c.key, items: picked[idx] }));
}

/** Un modulo opzionale per riga nel pannello "System health": chiave = campo dentro
 * daemon_config.jsonl's "modules", label leggibile, flag da passare per attivarlo (mostrato solo
 * quando il modulo risulta spento, per dire subito cosa serve senza dover cercare nel README).
 * `defaultOn: true` per i moduli attivi di default (il flag qui è quello che li *disattiva*,
 * non quello che li accende — la frase mostrata cambia di conseguenza, vedi renderSystemHealthCard).
 *
 * Le chiavi e il loro ordine devono restare allineati a MODULE_LABELS in home_sentinel.py — è la
 * fonte di verità (chi scrive "modules" in daemon_config.jsonl), non il contrario. Un modulo
 * aggiunto lì e non qui sparirebbe in silenzio da questo pannello pur essendo realmente attivo:
 * è esattamente il tipo di disallineamento successo con presence/IPv6/exposure/wifi-recurrence,
 * introdotti lato daemon senza aggiornare questa lista. */
const MODULE_META = {
  fingerprint: { label: "Device fingerprint", flag: "--fingerprint" },
  os_fingerprint: { label: "OS fingerprint", flag: "--os-fingerprint" },
  dhcp_discovery: { label: "DHCP client discovery", flag: "--dhcp-discovery" },
  detect_rogue_dhcp: { label: "Rogue DHCP detection", flag: "--detect-rogue-dhcp" },
  dhcp_lease_source: { label: "DHCP lease cross-check", flag: "--dhcp-lease-source" },
  deep_port_scan: { label: "Deep port scan", flag: "--deep-port-scan" },
  ipv6_discovery: { label: "IPv6 neighbor discovery", flag: "--ipv6-discovery" },
  exposure_audit: { label: "Internet exposure audit (UPnP)", flag: "--exposure-audit" },
  arp_detection: { label: "ARP spoofing detection", flag: "--no-arp-detection", defaultOn: true },
  trend_rollup: { label: "Daily trend rollup", flag: "--no-trend-rollup (or --no-db)", defaultOn: true },
  ble: { label: "BLE scan", flag: "--ble" },
  ble_tracker_detection: { label: "BLE tracker detection", flag: "--ble (and --no-ble-tracker-detection not passed)" },
  ble_identity_linking: { label: "BLE identity link suggestions", flag: "--ble (and --no-ble-identity-linking not passed)" },
  ble_evil_twin: { label: "BLE evil twin/spoofing", flag: "--ble --ble-watch-names ..." },
  ble_presence: { label: "BLE presence tracking", flag: "--ble --ble-home-macs ... (or devices with ble_mac in --config)" },
  wifi_presence: { label: "WiFi presence tracking", flag: "--wifi-home-macs ... (or devices with wifi_mac in --config)" },
  presence_aware_alerts: { label: "Presence-aware alerting", flag: "--presence-aware-alerts (needs WiFi/BLE home MACs configured)" },
  wifi_networks: { label: "Adjacent WiFi networks", flag: "--wifi-iface (and --no-wifi-networks not passed)" },
  wifi_traffic: { label: "Estimated WiFi traffic", flag: "--wifi-iface (and --no-wifi-traffic not passed)" },
  evil_twin: { label: "WiFi evil twin detection", flag: "--wifi-iface --home-ssid ..." },
  deauth_detection: { label: "Deauth/disassoc flood detection", flag: "--wifi-iface (and --no-deauth-detection not passed)" },
  wifi_recurring_devices: { label: "Recurring unknown WiFi devices", flag: "--wifi-iface --wifi-recurrence-detection" },
  capture_handshakes: { label: "WPA handshake capture", flag: "--wifi-iface --capture-handshakes --home-ssid ..." },
};

/** Pannello "Salute del sistema": stato reale (non dedotto) dei moduli opzionali, letto da
 * daemon_config.jsonl (vedi item 1/4 dell'analisi di armonizzazione) invece della lista sparsa
 * e per-pagina di "Module status" in Settings, che può solo indovinare dallo stato dei dati. */
function renderSystemHealthCard(container) {
  const daemonConfig = latestDaemonConfig(state.daemonConfigRows);
  if (!daemonConfig || !daemonConfig.modules) {
    container.innerHTML = `
      <div class="card-head">
        <h2>System health</h2>
        <span class="card-sub">Which optional modules are active on the daemon</span>
      </div>
      <p class="empty-state">No <code>daemon_config.jsonl</code> loaded yet — update the daemon to a version that writes it, then re-run <code>dashboard/link-logs.sh</code> (or point to it in Settings → Data sources).</p>
    `;
    return;
  }
  const modules = daemonConfig.modules;
  const activeCount = Object.values(modules).filter(Boolean).length;
  const ifaceBits = [
    `LAN: <code>${escapeHtml(daemonConfig.lan_iface || "—")}</code>`,
    daemonConfig.wifi_iface ? `WiFi: <code>${escapeHtml(daemonConfig.wifi_iface)}</code>` : "no WiFi interface",
  ];
  container.innerHTML = `
    <div class="card-head">
      <h2>System health</h2>
      <span class="card-sub">${activeCount} / ${Object.keys(modules).length} optional modules active · ${ifaceBits.join(" · ")}</span>
    </div>
    <div class="module-status-grid">
      ${Object.entries(MODULE_META).map(([key, meta]) => {
        const active = !!modules[key];
        const offText = meta.defaultOn
          ? `Off — disabled with ${escapeHtml(meta.flag)}`
          : `Off — enable with ${escapeHtml(meta.flag)}`;
        return `<div class="module-status-row">
          <span class="module-status-dot tone-${active ? "good" : "muted"}"></span>
          <div><strong>${escapeHtml(meta.label)}</strong><span>${active ? "Active" : offText}</span></div>
        </div>`;
      }).join("")}
    </div>
  `;
}

/** Vista unificata "chi c'è in casa": una riga per MAC "di casa" configurato (BLE e/o WiFi, da
 * daemon_config.jsonl), raggruppate per identità quando l'utente ha esplicitamente collegato un
 * MAC BLE e un MAC WiFi come lo stesso device fisico (macsInIdentity, la stessa funzione usata da
 * "Group by identity" in Host) — senza collegamento restano righe separate, coerentemente col fatto
 * che sono due tracce indipendenti per design (vedi Help, "Known limitations"). "Home" se almeno
 * una delle tracce collegate risulta "arrived" all'ultimo evento noto. */
function computeHomePresence() {
  const daemonConfig = latestDaemonConfig(state.daemonConfigRows);
  // Senza daemon_config.jsonl (daemon non aggiornato) si ricade sui MAC che hanno già generato un
  // evento nei log di presenza, stesso principio di fallback usato da computePresenceSummary.
  const bleHomeMacs = daemonConfig ? daemonConfig.ble_home_macs || [] : [...new Set(state.blePresenceRows.map((r) => r.mac))];
  const wifiHomeMacs = daemonConfig ? daemonConfig.wifi_home_macs || [] : [...new Set(state.wifiPresenceRows.map((r) => r.mac))];

  const latestFor = (rows, mac) => {
    let latest = null;
    for (const r of rows) {
      if (r.mac !== mac) continue;
      const ts = parseTs(r.timestamp) || 0;
      if (!latest || ts > latest.ts) latest = { event: r.event, ts };
    }
    return latest;
  };

  const entries = [
    ...bleHomeMacs.map((mac) => ({ tech: "ble", mac, latest: latestFor(state.blePresenceRows, mac) })),
    ...wifiHomeMacs.map((mac) => ({ tech: "wifi", mac, latest: latestFor(state.wifiPresenceRows, mac) })),
  ];
  if (!entries.length) return [];

  const groups = new Map();
  for (const e of entries) {
    const canonical = canonicalMac(e.mac);
    if (!groups.has(canonical)) groups.set(canonical, { canonical, entries: [] });
    groups.get(canonical).entries.push(e);
  }

  return [...groups.values()].map((g) => {
    const arrivedNow = g.entries.filter((e) => e.latest && e.latest.event === "arrived");
    const home = arrivedNow.length > 0;
    const since = home ? Math.min(...arrivedNow.map((e) => e.latest.ts)) : null;
    return {
      canonical: g.canonical,
      label: displayName(g.canonical, g.canonical),
      home,
      since,
      techs: [...new Set(g.entries.map((e) => e.tech))],
    };
  }).sort((a, b) => (b.home - a.home) || a.label.localeCompare(b.label));
}

/** Ricostruisce gli intervalli presente/assente per MAC dalle coppie arrived/left in ordine
 * cronologico (mac raggruppato per identità canonica, coerente con computeHomePresence). Un
 * "arrived" senza un "left" successivo resta aperto fino ad ora (il device potrebbe essere ancora
 * a casa); un "left" senza un "arrived" precedente nello storico caricato viene ignorato — non si
 * sa quando è iniziata quella presenza (tipicamente il primo evento di un log appena ruotato). */
function presenceIntervals(rows) {
  const byMac = new Map();
  for (const r of rows) {
    const mac = canonicalMac(r.mac);
    if (!byMac.has(mac)) byMac.set(mac, []);
    byMac.get(mac).push(r);
  }
  const intervals = [];
  for (const [mac, events] of byMac) {
    const sorted = events.slice().sort((a, b) => (parseTs(a.timestamp) || 0) - (parseTs(b.timestamp) || 0));
    let openStart = null;
    for (const e of sorted) {
      const ts = parseTs(e.timestamp);
      if (ts === null) continue;
      if (e.event === "arrived") openStart = ts;
      else if (e.event === "left" && openStart !== null) {
        intervals.push({ mac, start: openStart, end: ts });
        openStart = null;
      }
    }
    if (openStart !== null) intervals.push({ mac, start: openStart, end: null });
  }
  return intervals;
}

/** Quanti MAC/identità "di casa" distinti risultano presenti in ciascuna delle ultime 24 ore
 * (bucket orari, stessa convenzione di bucketRowsByHour) — a differenza di hourlyDistinctMac,
 * conta l'intero intervallo di presenza, non solo l'ora in cui è scattato l'evento: un device
 * rimasto a casa per ore senza generare un nuovo evento continua a contare presente in ogni ora
 * intermedia. */
function hourlyPresenceOccupancy(rows) {
  const intervals = presenceIntervals(rows);
  const now = new Date();
  now.setMinutes(0, 0, 0);
  const nowMs = now.getTime();
  const nowExact = Date.now();
  const buckets = Array.from({ length: 24 }, () => new Set());
  for (let i = 0; i < 24; i++) {
    const bucketStart = nowMs - (23 - i) * 3600000;
    const bucketEnd = bucketStart + 3600000;
    for (const iv of intervals) {
      const end = iv.end === null ? nowExact : iv.end;
      if (iv.start < bucketEnd && end > bucketStart) buckets[i].add(iv.mac);
    }
  }
  return buckets.map((s) => s.size);
}

function renderHomePresenceCard(container) {
  const rows = computeHomePresence();
  if (!rows.length) {
    container.innerHTML = `
      <div class="card-head"><h2>Who's home</h2><span class="card-sub">Unified BLE + WiFi presence for your configured home devices</span></div>
      <p class="empty-state">No home MAC configured — set <code>--ble-home-macs</code>/<code>--wifi-home-macs</code> on the daemon to enable this.</p>
    `;
    return;
  }
  const homeCount = rows.filter((r) => r.home).length;
  const occupancy = hourlyPresenceOccupancy([...state.blePresenceRows, ...state.wifiPresenceRows]);
  container.innerHTML = `
    <div class="card-head">
      <h2>Who's home</h2>
      <span class="card-sub">${homeCount} / ${rows.length} present — one row per linked identity (BLE + WiFi merge only if linked via "Group by identity")</span>
    </div>
    <div class="table-scroll">
      <table class="data-table">
        <thead><tr><th>Device</th><th>Status</th><th>Since</th><th>Source</th><th></th></tr></thead>
        <tbody>${rows.map((r) => `<tr>
          <td><button class="link-cell" data-mac-link="${escapeHtml(r.canonical)}">${escapeHtml(r.label)}</button></td>
          <td>${r.home ? '<span class="badge status-online"><span class="dot"></span>Home</span>' : '<span class="badge status-offline"><span class="dot"></span>Away</span>'}</td>
          <td>${r.home && r.since ? formatTs(r.since) : '<span class="muted">—</span>'}</td>
          <td>${r.techs.map((t) => `<span class="badge">${t === "ble" ? "BLE" : "WiFi"}</span>`).join(" ")}</td>
          <td><button type="button" class="btn btn-icon" data-rename-mac="${escapeHtml(r.canonical)}" title="Name this device (e.g. a person's name)">${ICON("edit")}</button></td>
        </tr>`).join("")}</tbody>
      </table>
    </div>
    <div class="card-head" style="margin-top:16px;"><h2>Presence <span class="card-sub">last 24h — home devices present per hour</span></h2></div>
    <div class="bar-chart" id="home-presence-chart" data-empty="No presence history yet"></div>
  `;
  container.querySelectorAll("[data-rename-mac]").forEach((btn) => {
    btn.addEventListener("click", () => promptRenameDevice(btn.dataset.renameMac, () => renderHomePresenceCard(container)));
  });
  container.querySelectorAll("[data-mac-link]").forEach((btn) => {
    btn.addEventListener("click", () => goToDevice(btn.dataset.macLink));
  });
  renderBarChart(document.getElementById("home-presence-chart"), occupancy);
}

/** Banner unico di "primo avvio" quando anche la sorgente obbligatoria (LAN) non è raggiungibile —
 * molto più probabile un problema di setup (daemon mai avviato, dashboard non puntata alla
 * cartella giusta) che un guasto di rete. Senza questo, l'utente vedrebbe la stessa domanda
 * ("perché non vedo niente?") ripetuta come "No data" in ogni singola card della pagina, senza un
 * punto unico che spieghi i passi di setup più comuni. */
function renderOnboardingBanner() {
  return `<div class="page-section card onboarding-banner">
    <div class="card-head"><h2>Not seeing any data yet</h2></div>
    <p>The LAN discovery log itself isn't reachable — the most common reasons:</p>
    <ol>
      <li>The daemon (<code>home_sentinel.py</code>) hasn't been started yet, or has no <code>--subnet</code> configured.</li>
      <li>This dashboard isn't served from a folder with the log symlinks — run <code>dashboard/link-logs.sh</code> from the daemon's log directory, then reload.</li>
      <li>The data source URL in <strong>Settings</strong> doesn't match where the daemon actually writes its logs.</li>
    </ol>
    <p class="field-hint">See <strong>Help</strong> for the full setup guide, or <strong>Settings → Data sources</strong> to point the dashboard at the right files.</p>
  </div>`;
}

function renderHouseRadarPage(container) {
  container.innerHTML = `
    ${state.sourceStatus.lan && !state.sourceStatus.lan.ok ? renderOnboardingBanner() : ""}

    <div class="page-section kpi-row">
      ${topKpiRowHtml()}
    </div>

    <div class="page-section card">
      <div class="card-head">
        <h2>Nearby</h2>
        <span class="card-sub">SSIDs requested, adjacent networks, and WiFi/Bluetooth devices detected in the ${rangeLabel()} window, by signal strength</span>
      </div>
      <div class="radar-legend" id="radar-legend"></div>
      <div class="dintorni-map-wrap" id="radar-mount"></div>
      <div class="dintorni-panels-grid" id="dintorni-panels"></div>
    </div>

    <div class="page-section card" id="home-presence-mount"></div>

    <div class="page-section card" id="system-health-mount"></div>
  `;
  wireKpiNav(container, {
    "dash-hosts": () => { window.location.hash = "#/host"; },
    "dash-presence": () => navigateWithScroll("#/dashboard", "home-presence-mount"),
  });
  renderHomePresenceCard(document.getElementById("home-presence-mount"));
  renderHouseRadarLegend(document.getElementById("radar-legend"));
  renderNearbyAll();
  renderSystemHealthCard(document.getElementById("system-health-mount"));
}

function renderNearbyAll() {
  const data = computeHouseRadar();
  renderNearbyPanels(data);
  renderHouseRadar(document.getElementById("radar-mount"), data);
}

function renderHouseRadarLegend(container) {
  container.innerHTML = Object.entries(RADAR_CATEGORY_META).map(([key, meta]) => `
    <button type="button" class="radar-legend-item ${state.radarFilters[key] ? "active" : ""}" data-radar-toggle="${key}">
      <span class="dot" style="background:${meta.color}"></span>${escapeHtml(meta.label)}
    </button>
  `).join("");
  container.querySelectorAll("[data-radar-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.radarToggle;
      state.radarFilters[key] = !state.radarFilters[key];
      renderHouseRadarLegend(container);
      renderNearbyAll();
    });
  });
}

/** Pannello del radar con le prime righe più un pulsante "View all" che porta alla pagina con
 * l'elenco completo e tutti i dettagli (WiFi/BLE), invece di espandersi sul posto. */
function dintorniPanelHtml({ title, icon, color, rows, rowHtml, emptyText, wifiSection, viewAllHash, viewAllTarget }) {
  const shown = rows.slice(0, DINTORNI_PANEL_ROWS);
  const viewAllBtn = wifiSection
    ? `<button type="button" class="dintorni-panel-more" data-radar-panel-wifi-section="${escapeHtml(wifiSection)}">View all</button>`
    : `<button type="button" class="dintorni-panel-more" data-radar-panel-viewall="${escapeHtml(viewAllHash)}" data-radar-panel-target="${escapeHtml(viewAllTarget)}">View all</button>`;
  return `
    <div class="dintorni-panel">
      <div class="dintorni-panel-head" style="color:${color}">${ICON(icon)}<span>${escapeHtml(title)}</span></div>
      ${shown.length
        ? `<div class="dintorni-panel-rows">${shown.map(rowHtml).join("")}</div>${viewAllBtn}`
        : `<p class="dintorni-panel-empty">${escapeHtml(emptyText)}</p>${viewAllBtn}`}
    </div>`;
}

function renderNearbyPanels(data) {
  const mount = document.getElementById("dintorni-panels");
  if (!mount) return;

  const hostSummary = computeHostSummary();

  mount.innerHTML = [
    `<div class="dintorni-panel">
      <div class="dintorni-panel-head" style="color:var(--brand)">${ICON("radar")}<span>Scan status</span></div>
      <div class="dintorni-status-rows">
        <div class="dintorni-status-row"><span>Last updated</span><strong id="dintorni-last-updated">—</strong></div>
        <div class="dintorni-status-row"><span>SSIDs requested</span><strong>${data.networks.length}</strong></div>
        <div class="dintorni-status-row"><span>WiFi devices</span><strong>${data.probes.length}</strong></div>
        <div class="dintorni-status-row"><span>Adjacent networks</span><strong>${data.aps.length}</strong></div>
        <div class="dintorni-status-row"><span>Bluetooth devices</span><strong>${data.ble.length}</strong></div>
      </div>
      <button type="button" class="btn btn-primary dintorni-refresh" id="dintorni-refresh">${ICON("refresh")}Refresh now</button>
    </div>`,
    `<div class="dintorni-panel">
      <div class="dintorni-panel-head" style="color:var(--brand)">${ICON("monitor")}<span>Network Discovery summary</span></div>
      <div class="dintorni-status-rows">
        <div class="dintorni-status-row"><span>Total hosts</span><strong>${hostSummary.total}</strong></div>
        <div class="dintorni-status-row"><span>Active</span><strong>${hostSummary.active}</strong></div>
        <div class="dintorni-status-row"><span>Offline</span><strong>${hostSummary.offline}</strong></div>
      </div>
      <div class="legend-strip" style="margin:10px 0;gap:8px;">
        <span class="badge risk-badge tone-critical">${hostSummary.risk.Critical || 0} Critical</span>
        <span class="badge risk-badge tone-serious">${hostSummary.risk.High || 0} High</span>
        <span class="badge risk-badge tone-warning">${hostSummary.risk.Medium || 0} Medium</span>
        <span class="badge risk-badge tone-good">${hostSummary.risk.Low || 0} Low</span>
      </div>
      <button type="button" class="dintorni-panel-more" id="dintorni-host-view-all">View all hosts</button>
    </div>`,
    state.radarFilters.network ? dintorniPanelHtml({
      title: "SSIDs requested", icon: "wifi", color: RADAR_CATEGORY_META.network.color,
      rows: data.networks,
      emptyText: `No SSIDs requested in probes in the ${rangeLabel()} window.`,
      wifiSection: "ssid",
      rowHtml: (e) => `<div class="dintorni-row">
        <span class="dot" style="background:${signalTierColor(e.avgRssi)}"></span>
        <span class="dintorni-row-name" title="${escapeHtml(e.label)}">${escapeHtml(e.label)}</span>
        <span class="dintorni-row-meta">${e.macs.size} device</span>
        <span class="badge dintorni-dbm">${e.avgRssi} dBm</span>
      </div>`,
    }) : "",
    state.radarFilters.probe ? dintorniPanelHtml({
      title: "WiFi devices", icon: "wifi", color: RADAR_CATEGORY_META.probe.color,
      rows: data.probes,
      emptyText: `No probes detected in the ${rangeLabel()} window.`,
      wifiSection: "devices",
      rowHtml: (e) => `<button type="button" class="dintorni-row dintorni-row-clickable" data-mac-link="${escapeHtml(e.mac)}">
        <span class="dot" style="background:${signalTierColor(e.avgRssi)}"></span>
        <span class="dintorni-row-name mono" title="${escapeHtml(e.label)}">${escapeHtml(e.label)}</span>
        <span class="dintorni-row-meta" title="${escapeHtml(formatTs(e.lastTs))}">${formatRelativeTime(e.lastTs)}</span>
      </button>`,
    }) : "",
    state.radarFilters.ap ? dintorniPanelHtml({
      title: "Adjacent networks", icon: "wifi", color: RADAR_CATEGORY_META.ap.color,
      rows: data.aps,
      emptyText: `No WiFi network beacons detected in the ${rangeLabel()} window.`,
      wifiSection: "aps",
      rowHtml: (e) => `<div class="dintorni-row">
        <span class="dot" style="background:${signalTierColor(e.avgRssi)}"></span>
        <span class="dintorni-row-name" title="${escapeHtml(e.label)} — BSSID ${escapeHtml(e.bssid)}">${escapeHtml(e.label)}</span>
        <span class="dintorni-row-meta">Ch. ${e.channel ?? "?"}</span>
        <span class="badge dintorni-dbm">${e.avgRssi} dBm</span>
      </div>`,
    }) : "",
    state.radarFilters.ble ? dintorniPanelHtml({
      title: "Bluetooth devices", icon: "bluetooth", color: RADAR_CATEGORY_META.ble.color,
      rows: data.ble,
      emptyText: `No Bluetooth devices detected in the ${rangeLabel()} window.`,
      viewAllHash: "#/ble", viewAllTarget: "ble-devices-mount",
      rowHtml: (e) => `<button type="button" class="dintorni-row dintorni-row-clickable" data-mac-link="${escapeHtml(e.mac)}">
        <span class="dot" style="background:${signalTierColor(e.avgRssi)}"></span>
        <span class="dintorni-row-name" title="${escapeHtml(e.label)}">${escapeHtml(e.label)}</span>
        <span class="badge dintorni-dbm">${e.avgRssi} dBm</span>
      </button>`,
    }) : "",
  ].join("");

  const lastUpdatedEl = document.getElementById("last-updated");
  document.getElementById("dintorni-last-updated").textContent = lastUpdatedEl ? lastUpdatedEl.textContent : "—";
  document.getElementById("dintorni-refresh").addEventListener("click", () => {
    document.getElementById("refresh-now")?.click();
  });
  document.getElementById("dintorni-host-view-all").addEventListener("click", () => {
    navigateWithScroll("#/host", null);
  });
  mount.querySelectorAll("[data-mac-link]").forEach((btn) => {
    btn.addEventListener("click", () => goToDevice(btn.dataset.macLink));
  });
  mount.querySelectorAll("[data-radar-panel-viewall]").forEach((btn) => {
    btn.addEventListener("click", () => {
      navigateWithScroll(btn.dataset.radarPanelViewall, btn.dataset.radarPanelTarget);
    });
  });
  mount.querySelectorAll("[data-radar-panel-wifi-section]").forEach((btn) => {
    btn.addEventListener("click", () => {
      navigateToWifiSection(btn.dataset.radarPanelWifiSection);
    });
  });
}

/** Colore per fascia di segnale (stessa soglia di radarRing), coerente tra pannelli laterali e casa. */
function signalTierColor(rssi) {
  const ring = radarRing(rssi);
  return ["var(--status-good)", "var(--status-warning)", "var(--status-critical)"][ring];
}

function renderHouseRadar(container, data) {
  const W = 900, H = 680, cx = W / 2, cy = 340;
  const geo = computeHouseGeometry(cx, cy);
  const { routerPoint } = geo;

  const activeCategories = [];
  if (state.radarFilters.network) activeCategories.push({ key: "network", rows: data.networks });
  if (state.radarFilters.probe) activeCategories.push({ key: "probe", rows: data.probes });
  if (state.radarFilters.ap) activeCategories.push({ key: "ap", rows: data.aps });
  if (state.radarFilters.ble) activeCategories.push({ key: "ble", rows: data.ble });

  const items = [];
  for (const { key, items: rows } of pickBalanced(activeCategories, DINTORNI_CALLOUTS_TOTAL)) {
    for (const e of rows) items.push({ ...e, category: key });
  }

  const pulseRings = [46, 78, 110].map((r) => `<circle cx="${routerPoint.x.toFixed(1)}" cy="${routerPoint.y.toFixed(1)}" r="${r}" class="radar-pulse"/>`).join("");

  if (!items.length) {
    container.innerHTML = `<div class="radar-wrap"><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
      ${pulseRings}
      ${isoHouseSvg(geo)}
      <circle cx="${routerPoint.x.toFixed(1)}" cy="${routerPoint.y.toFixed(1)}" r="5" class="radar-router-dot"/>
    </svg></div>
    <p class="empty-state">No data in the ${rangeLabel()} window for the selected categories.</p>`;
    return;
  }

  const baseRadii = [250, 300, 350];
  const radiusSquash = 0.7; // rapporto larghezza/altezza dell'immagine della casa, per distribuire i riquadri fuori dai suoi bordi
  const cardW = 106, cardH = 34;
  const lines = [];
  const cards = [];

  // Un solo giro completo diviso per il numero totale di item, indipendentemente
  // dalla fascia di segnale di ciascuno: garantisce a ogni item un settore
  // angolare esclusivo, evitando sovrapposizioni tra item di fasce diverse che
  // altrimenti potrebbero finire vicini sullo stesso raggio visivo.
  const angleStep = (2 * Math.PI) / items.length;
  const baseAngle = radarHashAngle("dintorni-radar-base");

  items.forEach((e, i) => {
    const ring = radarRing(e.avgRssi);
    const angle = baseAngle + i * angleStep;
    const radius = baseRadii[ring] + (i % 2) * 16;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle) * radiusSquash;
    const meta = RADAR_CATEGORY_META[e.category];
    const label = e.label.length > 11 ? `${e.label.slice(0, 10)}…` : e.label;
    const valueText = e.category === "probe" ? formatRelativeTime(e.lastTs)
      : e.category === "ap" ? `Ch.${e.channel ?? "?"} · ${e.avgRssi}dBm`
      : `${e.avgRssi} dBm`;
    // Il tempo assoluto tra parentesi dopo quello relativo: al passaggio del mouse su un
    // "23 h ago" si vuole comunque poter leggere l'orario preciso, non solo la stima.
    const tip = e.category === "network"
      ? `${e.label} — SSID requested by ${e.macs.size} devices — ${e.avgRssi} dBm — ${formatRelativeTime(e.lastTs)} (${formatTs(e.lastTs)})`
      : e.category === "ap"
      ? `${e.label} — BSSID ${e.bssid} — channel ${e.channel ?? "unknown"} — ${e.avgRssi} dBm — ${formatRelativeTime(e.lastTs)} (${formatTs(e.lastTs)})`
      : `${e.label} — ${e.avgRssi} dBm — ${e.sightings} sightings — ${formatRelativeTime(e.lastTs)} (${formatTs(e.lastTs)})`;

    lines.push(`<line x1="${routerPoint.x.toFixed(1)}" y1="${routerPoint.y.toFixed(1)}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" class="radar-callout-line"/>`);
    cards.push(`<g class="radar-callout" data-tip="${escapeHtml(tip)}" ${e.mac ? `data-mac="${escapeHtml(e.mac)}"` : ""} transform="translate(${(x - cardW / 2).toFixed(1)},${(y - cardH / 2).toFixed(1)})">
      <rect width="${cardW}" height="${cardH}" rx="8" class="radar-callout-card" style="--callout-accent:${meta.color}"/>
      <circle cx="14" cy="${cardH / 2}" r="4" style="fill:${meta.color}"/>
      <text x="24" y="16" class="radar-callout-label">${escapeHtml(label)}</text>
      <text x="24" y="29" class="radar-callout-value">${escapeHtml(valueText)}</text>
    </g>`);
  });

  container.innerHTML = `<div class="radar-wrap"><svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
    ${pulseRings}
    ${lines.join("")}
    ${isoHouseSvg(geo)}
    <circle cx="${routerPoint.x.toFixed(1)}" cy="${routerPoint.y.toFixed(1)}" r="5" class="radar-router-dot"/>
    ${cards.join("")}
  </svg></div>`;

  container.querySelectorAll(".radar-callout").forEach((el) => {
    attachTooltip(el, el.dataset.tip);
    if (el.dataset.mac) el.addEventListener("click", () => goToDevice(el.dataset.mac));
  });
}

/* ---------------------------------------------------------------------- *
 * Pages
 * ---------------------------------------------------------------------- */

/** Ultima riga di daemon_config.jsonl (scritta una tantum ad ogni avvio del daemon): snapshot della
 * configurazione effettiva (interfacce, MAC "di casa", quali moduli sono davvero attivi). null se il
 * file non esiste ancora (daemon non aggiornato, o link-logs.sh da rilanciare) — in quel caso
 * computePresenceSummary ricade sul vecchio calcolo e il pannello "Salute del sistema" lo segnala. */
function latestDaemonConfig(rows) {
  if (!rows.length) return null;
  let latest = rows[0];
  let latestTs = parseTs(latest.timestamp) || 0;
  for (const r of rows) {
    const ts = parseTs(r.timestamp) || 0;
    if (ts >= latestTs) { latest = r; latestTs = ts; }
  }
  return latest;
}

/** Ultimo stato presente/assente per ogni MAC "di casa" visto in ble_presence.jsonl/wifi_presence.jsonl.
 * Con homeMacs (l'elenco realmente configurato, da daemon_config.jsonl) il totale è il numero di MAC
 * configurati: un MAC appena aggiunto alla config o mai ancora osservato online conta comunque nel
 * denominatore, semplicemente come assente — altrimenti (daemon non aggiornato, homeMacs assente) si
 * ricade sul vecchio comportamento: l'insieme dei MAC che hanno già generato almeno un evento nel log,
 * che può sottostimare il totale reale. */
function computePresenceSummary(rows, homeMacs) {
  const latestByMac = new Map();
  for (const r of rows) {
    const ts = parseTs(r.timestamp) || 0;
    const prev = latestByMac.get(r.mac);
    if (!prev || ts > prev.ts) latestByMac.set(r.mac, { event: r.event, ts });
  }
  if (homeMacs) {
    let home = 0;
    for (const mac of homeMacs) {
      const v = latestByMac.get(mac);
      if (v && v.event === "arrived") home += 1;
    }
    return { home, total: homeMacs.length };
  }
  let home = 0;
  for (const v of latestByMac.values()) if (v.event === "arrived") home += 1;
  return { home, total: latestByMac.size };
}

/** Riga dei KPI principali in cima alla home (host attivi, presenza BLE+WiFi combinata). */
function topKpiRowHtml() {
  const lanCurrent = latestLanByMac(state.lanRows);
  const online = lanCurrent.filter((d) => d.status !== "offline").length;
  const total = lanCurrent.length;
  const daemonConfig = latestDaemonConfig(state.daemonConfigRows);
  const blePresence = computePresenceSummary(state.blePresenceRows, daemonConfig ? daemonConfig.ble_home_macs : null);
  const wifiPresence = computePresenceSummary(state.wifiPresenceRows, daemonConfig ? daemonConfig.wifi_home_macs : null);
  const presenceTotal = blePresence.total + wifiPresence.total;
  const presenceHome = blePresence.home + wifiPresence.home;

  return `
    ${kpiTile({
      label: "Active devices", icon: "monitor", tone: "good",
      value: online, valueSuffix: `/ ${total}`,
      sub: `${total ? Math.round((online / total) * 100) : 0}% active`,
      sparkValues: hourlyDistinctMac(state.lanRows.filter((r) => r.status !== "offline")), sparkColor: "var(--status-good)",
      navKey: "dash-hosts",
    })}
    ${kpiTile({
      label: "Presence", icon: "home", tone: presenceTotal ? (presenceHome ? "good" : "blue") : "blue",
      value: presenceTotal ? presenceHome : "—", valueSuffix: presenceTotal ? `/ ${presenceTotal}` : "",
      sub: presenceTotal
        ? `${blePresence.home}/${blePresence.total} BLE · ${wifiPresence.home}/${wifiPresence.total} WiFi`
        : "Configure --ble-home-macs/--wifi-home-macs to enable",
      navKey: "dash-presence",
    })}
  `;
}

/* ---------------------------------------------------------------------- *
 * Host page: helpers per le migliorie (KPI, filtri, colonne opzionali,
 * raggruppamento per identità, host "stale", traffico WiFi, preset e
 * azioni bulk).
 * ---------------------------------------------------------------------- */

const HOST_OPTIONAL_COLUMNS = [
  { key: "osGuess", label: "OS guess" },
  { key: "mdns", label: "mDNS name" },
  { key: "arp", label: "ARP status" },
  { key: "uptime", label: "Uptime %" },
  { key: "traffic", label: "WiFi traffic" },
];
const HOST_COLUMNS_KEY = "hs.host.visibleColumns";

function getHostVisibleColumns() {
  try { return new Set(JSON.parse(localStorage.getItem(HOST_COLUMNS_KEY) || "[]")); } catch { return new Set(); }
}
function saveHostVisibleColumns(set) { localStorage.setItem(HOST_COLUMNS_KEY, JSON.stringify([...set])); }

const HOST_PRESETS_KEY = "hs.host.presets";
function getHostPresets() {
  try { return JSON.parse(localStorage.getItem(HOST_PRESETS_KEY) || "[]"); } catch { return []; }
}
function saveHostPresets(list) { localStorage.setItem(HOST_PRESETS_KEY, JSON.stringify(list)); }

/** Un host offline da più di questa soglia è considerato "stale": probabilmente non più presente in rete. */
const STALE_OFFLINE_DAYS = 30;
function isHostStale(d) {
  if (d.status !== "offline") return false;
  const ts = parseTs(d.timestamp);
  return ts !== null && (Date.now() - ts) > STALE_OFFLINE_DAYS * 24 * 3600 * 1000;
}

/** Punteggio di rischio di una riga, che sia un device singolo o un gruppo di identità
 * (in quel caso il peggiore tra i MAC collegati, così un rischio non sparisce raggruppando). */
function rowRiskScore(d, fingerprintByMac, alertsByMac) {
  const members = d._members || [d];
  let max = 0;
  for (const m of members) {
    const score = computeRiskScore(m, fingerprintByMac.get(m.mac), alertsByMac.get(m.mac));
    if (score > max) max = score;
  }
  return max;
}

/** Testo ricercabile di una riga: per un gruppo, l'unione di IP/MAC/hostname/vendor/nome di tutti i MAC collegati. */
function hostSearchText(d) {
  const members = d._members || [d];
  return members.map((m) => `${m.ip} ${m.mac} ${m.hostname} ${m.vendor} ${getDeviceLabel(m.mac).name}`).join(" ").toLowerCase();
}

/** Raggruppa i device correnti per identità (macsInIdentity/canonicalMac): i MAC collegati come
 * "stesso device fisico" diventano una sola riga. Stato = il migliore tra i membri (new > online >
 * offline, per non nascondere che almeno un'interfaccia è attiva), porte = unione, `_members` porta
 * con sé i device originali per rischio/ricerca/dettaglio. Un device non collegato a nessun altro
 * forma semplicemente un gruppo da solo, stesso risultato di prima. */
function groupHostsByIdentity(lanCurrent) {
  const groups = new Map();
  for (const d of lanCurrent) {
    const canonical = canonicalMac(d.mac);
    if (!groups.has(canonical)) groups.set(canonical, []);
    groups.get(canonical).push(d);
  }
  const statusRank = { new: 3, online: 2, offline: 0 };
  return [...groups.values()].map((members) => {
    if (members.length === 1) return { ...members[0], _members: members };
    const sorted = [...members].sort((a, b) => (parseTs(b.timestamp) || 0) - (parseTs(a.timestamp) || 0));
    const primary = sorted[0];
    const bestStatus = members.reduce((best, d) => (statusRank[d.status] > statusRank[best] ? d.status : best), members[0].status);
    const allPorts = [...new Set(members.flatMap((d) => (Array.isArray(d.open_ports) ? d.open_ports : [])))].sort((a, b) => a - b);
    return { ...primary, status: bestStatus, open_ports: allPorts, _members: members };
  });
}

/** Somma byte catturati per MAC nelle ultime 24h (wifi_traffic.jsonl) — indicatore relativo di
 * "chi genera più traffico", non una banda esatta (vedi nota nel daemon). */
function trafficBytesByMac(rows) {
  const cutoff = Date.now() - 24 * 3600 * 1000;
  const map = new Map();
  for (const r of rows) {
    const ts = parseTs(r.timestamp);
    if (ts === null || ts < cutoff) continue;
    map.set(r.mac, (map.get(r.mac) || 0) + (Number(r.bytes) || 0));
  }
  return map;
}

function renderHost(container) {
  container.innerHTML = `
    <div class="page-section kpi-row" id="host-kpi-row"></div>
    <div class="page-section card" id="host-section-mount"></div>
  `;
  renderHostKpiRow(document.getElementById("host-kpi-row"));
  renderHostSection(document.getElementById("host-section-mount"));

  // I KPI in cima portano alla porzione di tabella che li compone, invece di essere numeri
  // inerti: stessa affordance introdotta sulla pagina WiFi, ora coerente ovunque.
  wireKpiNav(container, {
    "host-all": () => applyHostFilters({ status: "all", risk: "all" }),
    "host-new": () => applyHostFilters({ status: "new", risk: "all" }),
    "host-risk": () => applyHostFilters({ status: "all", risk: "high" }),
  });
}

/** Imposta i filtri della tabella Network Discovery (che vivono nei <select> del suo header) e
 * la ridisegna, portando la vista in evidenza. */
function applyHostFilters({ status, risk }) {
  const statusEl = document.getElementById("host-status-filter");
  const riskEl = document.getElementById("host-risk-filter");
  if (!statusEl || !riskEl) return;
  if (status !== undefined) statusEl.value = status;
  if (risk !== undefined) { riskEl.value = risk; state.hostFilters.risk = risk; }
  getPagination("host").page = 1;
  statusEl.dispatchEvent(new Event("change"));
  document.getElementById("host-section-mount")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderHostKpiRow(container) {
  const lanCurrent = latestLanByMac(state.lanRows);
  const total = lanCurrent.length;
  const online = lanCurrent.filter((d) => d.status === "online").length;
  const offline = lanCurrent.filter((d) => d.status === "offline").length;
  const newCount = lanCurrent.filter((d) => d.status === "new").length;
  const segments = riskSegments(lanCurrent);
  const critical = segments.find((s) => s.label === "Critical")?.value || 0;
  const high = segments.find((s) => s.label === "High")?.value || 0;
  const atRisk = critical + high;

  container.innerHTML = `
    ${kpiTile({
      label: "Total devices", icon: "monitor", tone: "blue",
      value: total, sub: `${online} online · ${offline} offline`,
      navKey: "host-all",
    })}
    ${kpiTile({
      label: "New devices", icon: "users", tone: "blue",
      value: newCount, sub: newCount ? "Seen for the first time in this scan" : "None in this scan",
      navKey: "host-new",
    })}
    ${kpiTile({
      label: "At risk (High/Critical)", icon: "shield", tone: atRisk ? "critical" : "good",
      value: atRisk, sub: `${critical} critical · ${high} high`,
      subTone: atRisk ? "critical" : "good",
      navKey: "host-risk",
    })}
  `;
}

function renderNetworkMapPage(container) {
  container.innerHTML = `<div class="card">
    <div class="card-head"><h2>Network map</h2><span class="card-sub">Schematic topology based on known devices</span></div>
    <div id="netmap-mount"></div>
  </div>`;
  renderNetworkMap(document.getElementById("netmap-mount"));
}

/* ---------------------------------------------------------------------- *
 * Device profile: vista unificata LAN + WiFi + BLE + fingerprint + alert
 * per un singolo MAC. Non è una pagina della sidebar: si raggiunge da un
 * link (tabella Host, mappa rete, timeline, avvisi, ricerca globale) via
 * l'hash #/device/<mac>.
 * ---------------------------------------------------------------------- */

/** Gli SSID "di casa" dichiarati al daemon con --home-ssid, letti da daemon_config.jsonl. Il
 * daemon li scriveva già ma nessuno li usava: senza, la propria rete compariva fra le adiacenti
 * come una vicina qualunque, indistinguibile. */
function homeSsids() {
  const daemonConfig = latestDaemonConfig(state.daemonConfigRows);
  return new Set((daemonConfig?.home_ssids || []).map((s) => String(s).toLowerCase()));
}
function isHomeSsid(ssid) {
  return !!ssid && homeSsids().has(String(ssid).toLowerCase());
}
function homeNetworkBadgeHtml(ssid) {
  return isHomeSsid(ssid) ? `<span class="badge risk-badge tone-good" title="This SSID is configured as yours on the daemon (--home-ssid)">${ICON("home")}Your network</span>` : "";
}

/**
 * Profilo di una rete WiFi adiacente (per BSSID). Prima le reti erano l'unica entità dell'app
 * senza vista di dettaglio: righe inerti in tabella, pur avendo una storia vera da raccontare —
 * come è cambiato il segnale, se ha cambiato canale o tipo di sicurezza, quali handshake e quali
 * alert la riguardano.
 */
function renderNetworkProfile(container, bssid) {
  const sightings = state.wifiNetworksRows
    .filter((r) => r.bssid === bssid)
    .map((r) => ({ ...r, _ts: parseTs(r.timestamp) || 0 }))
    .sort((a, b) => b._ts - a._ts);

  if (!sightings.length) {
    container.innerHTML = `${backToOriginHtml()}<div class="card">
      <p class="empty-state">No data for BSSID <span class="mono">${escapeHtml(bssid)}</span>. It may never have been detected, or no longer appear in the loaded logs.</p>
    </div>`;
    wireBackToOrigin(container);
    return;
  }

  const latest = sightings[0];
  const ssid = latest.ssid || "";
  const label = getDeviceLabel(bssid);
  const rssiValues = sightings.map((s) => s.rssi).filter((v) => typeof v === "number");
  const avgRssi = rssiValues.length ? Math.round(rssiValues.reduce((a, b) => a + b, 0) / rssiValues.length) : null;
  const channels = [...new Set(sightings.map((s) => s.channel).filter((c) => typeof c === "number"))];
  const securities = [...new Set(sightings.map((s) => s.security).filter(Boolean))];
  const handshakes = state.handshakeRows.filter((h) => h.bssid === bssid);
  const stations = [...new Set(handshakes.map((h) => h.sta_mac).filter(Boolean))];
  const relatedAlerts = computeAlerts().filter((a) =>
    (a.mac && a.mac === bssid) || (ssid && `${a.desc}`.includes(ssid)));

  container.innerHTML = `
    ${backToOriginHtml()}
    <div class="page-section card device-profile-head">
      <div class="device-profile-title">
        <h2>${escapeHtml(displayName(bssid, ssid || "(hidden network)"))}</h2>
        <span class="mono">${escapeHtml(bssid)}</span>
        ${wifiSecurityBadgeHtml(latest.security)}
        ${homeNetworkBadgeHtml(ssid)}
        ${trustBadgeHtml(bssid)}
        ${channels.length > 1 ? `<span class="badge risk-badge tone-warning" title="Seen on more than one channel: normal for band steering, but also what a cloned AP looks like">Channel changed</span>` : ""}
        ${securities.length > 1 ? `<span class="badge risk-badge tone-critical" title="The advertised security type changed over time — worth a look">Security changed</span>` : ""}
      </div>
      <div class="detail-grid">
        <div><span>SSID</span>${escapeHtml(ssid) || '<span class="muted">hidden</span>'}</div>
        <div><span>Vendor</span>${escapeHtml(latest.vendor) || "—"}</div>
        <div><span>Channel</span>${latest.channel ?? "—"}${wifiBand(latest.channel) ? ` (${wifiBand(latest.channel)} GHz)` : ""}</div>
        <div><span>Security</span>${WIFI_SECURITY_META[latest.security]?.label || "Unknown"}</div>
        <div><span>Average signal</span>${avgRssi === null ? "—" : `${avgRssi} dBm`}</div>
        <div><span>Sightings</span>${sightings.length.toLocaleString("en-GB")}</div>
        <div><span>First seen</span>${formatTs(sightings[sightings.length - 1].timestamp)}</div>
        <div><span>Last seen</span>${formatTs(latest.timestamp)}</div>
      </div>
      <div class="device-label-editor">
        <div class="field">
          <label for="network-name-input">Custom name</label>
          <input type="text" id="network-name-input" value="${escapeHtml(label.name)}" placeholder="e.g. Neighbour upstairs">
        </div>
        <button class="btn ${label.trusted ? "btn-primary" : ""}" id="network-trust-toggle">
          ${ICON("shield")}${label.trusted ? "Trusted — remove" : "Mark as trusted"}
        </button>
      </div>
      <p class="field-hint">Marking a network as trusted works exactly like it does for a device: linked alerts drop one severity level, nothing gets hidden.</p>
    </div>

    <div class="page-section grid-2">
      <div class="card">
        <div class="card-head"><h2>Beacon history</h2><span class="card-sub">${sightings.length} sightings</span></div>
        <div class="table-scroll table-scroll-tall">
          <table class="data-table">
            <thead><tr><th>Timestamp</th><th>Channel</th><th>Security</th><th>Signal</th></tr></thead>
            <tbody>${sightings.slice(0, 200).map((s) => `<tr>
              <td>${formatTs(s.timestamp)}</td>
              <td>${s.channel ?? '<span class="muted">—</span>'}</td>
              <td>${wifiSecurityBadgeHtml(s.security)}</td>
              <td>${signalBarsHtml(s.rssi)}</td>
            </tr>`).join("")}</tbody>
          </table>
        </div>
        ${sightings.length > 200 ? `<p class="field-hint">Showing the 200 most recent of ${sightings.length.toLocaleString("en-GB")} sightings.</p>` : ""}
      </div>
      <div class="card">
        <div class="card-head"><h2>Linked alerts</h2><span class="card-sub">${relatedAlerts.length} total</span></div>
        <div class="alert-list" id="network-alerts">${relatedAlerts.length
          ? relatedAlerts.slice(0, 20).map(alertItemHtml).join("")
          : '<p class="empty-state">No alerts linked to this network.</p>'}</div>
      </div>
    </div>

    <div class="page-section card">
      <div class="card-head">
        <h2>Handshakes captured</h2>
        <span class="card-sub">${handshakes.length} for this BSSID${stations.length ? ` · ${stations.length} station(s) seen connecting` : ""}</span>
      </div>
      ${handshakes.length ? `
        <div class="table-scroll">
          <table class="data-table">
            <thead><tr><th>Timestamp</th><th>Station</th><th>Messages</th><th>Pcap file</th></tr></thead>
            <tbody>${handshakes.map((h) => `<tr>
              <td>${formatTs(h.timestamp)}</td>
              <td><button class="link-cell mono" data-mac-link="${escapeHtml(h.sta_mac)}">${escapeHtml(displayName(h.sta_mac, h.sta_mac))}</button></td>
              <td>${Array.isArray(h.messages) && h.messages.length ? `${h.messages.length}/4 (${h.messages.join(",")})` : `${h.frame_count || 0} frames`}</td>
              <td class="mono" title="${escapeHtml(h.pcap_path)}">${escapeHtml((h.pcap_path || "").split("/").pop())}</td>
            </tr>`).join("")}</tbody>
          </table>
        </div>
      ` : `<p class="empty-state">No handshake captured for this network${isHomeSsid(ssid) ? " yet — it only happens when a device (re)connects while the sniffer is on this channel." : ": capture only runs for the networks listed in --home-ssid, never for networks merely detected nearby."}</p>`}
    </div>
  `;

  wireBackToOrigin(container);
  document.getElementById("network-name-input").addEventListener("change", (e) => {
    setDeviceLabel(bssid, { name: e.target.value.trim() });
    renderNetworkProfile(container, bssid);
  });
  document.getElementById("network-trust-toggle").addEventListener("click", () => {
    setDeviceLabel(bssid, { trusted: !getDeviceLabel(bssid).trusted });
    renderNetworkProfile(container, bssid);
  });
  container.querySelectorAll("[data-mac-link]").forEach((btn) => {
    btn.addEventListener("click", () => goToDevice(btn.dataset.macLink));
  });
}

function renderDeviceProfile(container, mac) {
  const lanCurrent = latestLanByMac(state.lanRows).find((d) => d.mac === mac);
  const history = sightingsForMac(mac);
  const fingerprint = latestFingerprintByMac(state.fingerprintRows).get(mac);
  const wifiHits = state.wifiRows.filter((r) => r.mac === mac).slice().sort((a, b) => (parseTs(b.timestamp) || 0) - (parseTs(a.timestamp) || 0));
  const bleHits = state.bleRows.filter((r) => r.mac === mac).slice().sort((a, b) => (parseTs(b.timestamp) || 0) - (parseTs(a.timestamp) || 0));
  const deviceAlerts = computeAlerts().filter((a) => a.mac === mac);
  const uptimeSummary = computeUptimeSummary(mac);

  // Dati che il daemon raccoglieva già per questo MAC ma che il profilo non mostrava: presenza
  // (l'informazione più leggibile che abbiamo su un device di casa), traffico stimato, SSID
  // richiesti e indirizzi IPv6. Erano visibili solo altrove, ognuno nella sua pagina.
  const presenceEvents = [
    ...state.wifiPresenceRows.filter((r) => r.mac === mac).map((r) => ({ ...r, radio: "WiFi" })),
    ...state.blePresenceRows.filter((r) => r.mac === mac).map((r) => ({ ...r, radio: "BLE" })),
  ].sort((a, b) => (parseTs(b.timestamp) || 0) - (parseTs(a.timestamp) || 0));
  const presenceTotals = {
    homeMs: presenceEvents.reduce((sum, e) => sum + (typeof e.duration_s === "number" ? e.duration_s * 1000 : 0), 0),
  };
  const trafficBytes = state.wifiTrafficRows
    .filter((r) => r.mac === mac && within24h(parseTs(r.timestamp)))
    .reduce((sum, r) => sum + (Number(r.bytes) || 0), 0);
  const requestedSsids = [...new Set(state.wifiRows
    .filter((r) => r.mac === mac && r.ssid && r.ssid.trim())
    .map((r) => r.ssid.trim()))];
  const ipv6ForMac = state.ipv6Rows
    .filter((r) => r.mac === mac)
    .sort((a, b) => (parseTs(b.timestamp) || 0) - (parseTs(a.timestamp) || 0))
    .filter((r, i, arr) => arr.findIndex((x) => x.ipv6 === r.ipv6) === i);

  const backButton = backToOriginHtml();

  if (!lanCurrent && !history.length && !wifiHits.length && !bleHits.length) {
    container.innerHTML = `${backButton}<div class="card">
      <p class="empty-state">No data for MAC <span class="mono">${escapeHtml(mac)}</span>. It may have never been detected, or no longer appears in the loaded logs.</p>
    </div>`;
    wireBackToOrigin(container);
    return;
  }

  const risk = lanCurrent ? computeRiskScore(lanCurrent, fingerprint, deviceAlerts) : null;
  const label = getDeviceLabel(mac);
  const title = displayName(mac, lanCurrent?.hostname || fingerprint?.device_type || mac);
  const linkedMacs = macsInIdentity(mac).filter((m) => m !== mac);
  const identitySuggestions = [
    ...suggestedIdentityMatches(mac).map((m) => ({ mac: m, reason: "hostname" })),
    ...suggestedBleIdentityMatches(mac).map((m) => ({ mac: m, reason: "ble" })),
  ];
  const osFingerprint = latestFingerprintByMac(state.osFingerprintRows).get(mac);
  const latestLease = latestFingerprintByMac(state.dhcpLeasesRows).get(mac);
  const deepScan = latestFingerprintByMac(state.deepScanRows).get(mac);

  container.innerHTML = `
    ${backButton}
    <div class="page-section card device-profile-head">
      <div class="device-profile-title">
        <h2>${escapeHtml(title)}</h2>
        <span class="mono">${escapeHtml(mac)}</span>
        ${lanCurrent ? statusBadge(lanCurrent.status) : '<span class="badge status-offline"><span class="dot"></span>Not on LAN</span>'}
        ${risk !== null ? riskBadgeHtml(risk) : ""}
        ${trustBadgeHtml(mac)}
        ${latestLease && !latestLease.arp_confirmed ? `<span class="badge risk-badge tone-warning" title="Seen in the router's DHCP lease table but silent on the last ARP scan — may just be asleep or firewalled">Silent on ARP</span>` : ""}
      </div>
      <div class="detail-grid">
        <div><span>IP</span>${lanCurrent ? escapeHtml(lanCurrent.ip) : "—"}</div>
        <div><span>Vendor</span>${escapeHtml(lanCurrent?.vendor) || "—"}</div>
        <div><span>Device type</span>${escapeHtml(fingerprint?.device_type || bleHits[0]?.device_type) || "—"}</div>
        <div><span>mDNS name</span>${escapeHtml(fingerprint?.mdns_name) || "—"}</div>
        <div><span>OS guess</span>${escapeHtml(osFingerprint?.os_guess) || "—"}</div>
        <div><span>Open ports</span>${formatPorts(lanCurrent?.open_ports) || "—"}</div>
        <div><span>Deep port scan</span>${deepScan
          ? `${formatTs(deepScan.timestamp)} — ${Array.isArray(deepScan.open_ports) ? deepScan.open_ports.length : 0} open${Array.isArray(deepScan.new_ports) && deepScan.new_ports.length ? `, ${deepScan.new_ports.length} new: ${formatPorts(deepScan.new_ports)}` : ""}`
          : "—"}</div>
        <div><span>First seen</span>${formatTs(firstSeenTs(mac))}</div>
        <div><span>Last LAN activity</span>${lanCurrent ? formatTs(lanCurrent.timestamp) : "—"}</div>
      </div>
      <div class="device-label-editor">
        <div class="field">
          <label for="device-name-input">Custom name</label>
          <input type="text" id="device-name-input" value="${escapeHtml(label.name)}" placeholder="e.g. John's iPhone">
        </div>
        <button class="btn ${label.trusted ? "btn-primary" : ""}" id="device-trust-toggle">
          ${ICON("shield")}${label.trusted ? "Trusted — remove" : "Mark as trusted"}
        </button>
      </div>
      ${inventoryEditorHtml(mac)}
      <div class="device-identity-section">
        <span class="device-identity-heading">Same physical device as</span>
        <div class="device-identity-chips">
          ${linkedMacs.length ? linkedMacs.map((m) => `<span class="badge device-identity-chip">
            <button type="button" class="mono" data-goto-mac="${escapeHtml(m)}">${escapeHtml(m)}</button>
            <button type="button" class="chip-remove" data-unlink-mac="${escapeHtml(m)}" title="Unlink">${ICON("x")}</button>
          </span>`).join("") : '<span class="muted">No other MAC linked yet — e.g. this device\'s WiFi and Ethernet interfaces.</span>'}
        </div>
        <div class="device-identity-add">
          <input type="text" id="device-link-mac-input" class="mono" placeholder="aa:bb:cc:dd:ee:ff">
          <button class="btn" id="device-link-mac-btn">Link as same device</button>
        </div>
        ${identitySuggestions.map((s) => `
          <div class="device-identity-suggestion">
            <span>${s.reason === "ble"
              ? `Possible BLE address rotation to <span class="mono">${escapeHtml(s.mac)}</span> — same advertised name/services seen shortly after this MAC went quiet, could be the same device?`
              : `Same hostname also seen on <span class="mono">${escapeHtml(s.mac)}</span> — could be the same device?`}</span>
            <div class="device-identity-suggestion-actions">
              <button class="btn btn-primary" data-link-suggestion="${escapeHtml(s.mac)}">Same device</button>
              <button class="btn" data-dismiss-suggestion="${escapeHtml(s.mac)}">Not the same</button>
            </div>
          </div>
        `).join("")}
      </div>
    </div>

    <div class="page-section grid-2">
      <div class="card">
        <div class="card-head"><h2>LAN history</h2><span class="card-sub">${history.length} sightings</span></div>
        <div class="table-scroll">
          <table class="data-table"><thead><tr><th>Timestamp</th><th>Status</th><th>IP</th><th>Ports</th></tr></thead>
          <tbody>${history.slice(-30).reverse().map((h) => `<tr>
            <td>${formatTs(h.timestamp)}</td><td>${statusBadge(h.status)}</td>
            <td class="mono">${escapeHtml(h.ip)}</td><td>${formatPorts(h.open_ports) || '<span class="muted">—</span>'}</td>
          </tr>`).join("") || '<tr><td colspan="4"><p class="empty-state">No LAN history.</p></td></tr>'}</tbody></table>
        </div>
      </div>
      <div class="card">
        <div class="card-head"><h2>Linked alerts</h2><span class="card-sub">${deviceAlerts.length} total</span></div>
        <div class="alert-list">${deviceAlerts.length ? deviceAlerts.slice(0, 20).map(alertItemHtml).join("") : '<p class="empty-state">No alerts for this device.</p>'}</div>
      </div>
    </div>

    <div class="page-section card">
      <div class="card-head">
        <h2>Uptime</h2>
        <span class="card-sub">${uptimeSummary ? `${uptimeSummary.pct}% online since ${formatTs(uptimeSummary.periodStart)} (from the loaded history)` : "Not enough history to reconstruct sessions"}</span>
      </div>
      ${uptimeSummary && uptimeSummary.sessions.length ? `
        <div class="table-scroll">
          <table class="data-table"><thead><tr><th>From</th><th>To</th><th>Duration</th></tr></thead>
          <tbody>${uptimeSummary.sessions.slice().reverse().slice(0, 20).map((s) => `<tr>
            <td>${formatTs(s.start)}</td>
            <td>${s.end !== null ? formatTs(s.end) : `<span class="badge status-online"><span class="dot"></span>Ongoing</span>`}</td>
            <td>${formatDuration((s.end ?? Date.now()) - s.start)}</td>
          </tr>`).join("")}</tbody></table>
        </div>
        <p class="field-hint">Reconstructed from the new/online/offline transitions already in the LAN discovery log for this MAC, not a separate measurement. "Ongoing" means no "offline" event has been seen yet for the current session in the loaded history — not necessarily that the device is online right now.</p>
      ` : '<p class="empty-state">Not enough LAN history for this MAC to reconstruct online/offline sessions.</p>'}
    </div>

    <div class="page-section grid-2">
      <div class="card">
        <div class="card-head"><h2>WiFi probes</h2><span class="card-sub">${wifiHits.length} captured</span></div>
        <div class="table-scroll">
          <table class="data-table"><thead><tr><th>Timestamp</th><th>SSID</th><th>RSSI</th><th>Channel</th></tr></thead>
          <tbody>${wifiHits.slice(0, 30).map((r) => `<tr>
            <td>${formatTs(r.timestamp)}</td><td>${escapeHtml(r.ssid) || '<span class="muted">hidden/empty</span>'}</td>
            <td>${r.rssi ?? '<span class="muted">—</span>'}</td><td>${escapeHtml(r.channel)}</td>
          </tr>`).join("") || '<tr><td colspan="4"><p class="empty-state">No WiFi probes for this MAC.</p></td></tr>'}</tbody></table>
        </div>
      </div>
      <div class="card">
        <div class="card-head"><h2>BLE advertisements</h2><span class="card-sub">${bleHits.length} captured</span></div>
        <div class="table-scroll">
          <table class="data-table"><thead><tr><th>Timestamp</th><th>Name</th><th>Type</th><th>RSSI</th></tr></thead>
          <tbody>${bleHits.slice(0, 30).map((r) => `<tr>
            <td>${formatTs(r.timestamp)}</td><td>${escapeHtml(r.name) || '<span class="muted">—</span>'}</td>
            <td>${escapeHtml(r.device_type) || '<span class="muted">—</span>'}</td><td>${r.rssi ?? '<span class="muted">—</span>'}</td>
          </tr>`).join("") || '<tr><td colspan="4"><p class="empty-state">No BLE advertisements for this MAC.</p></td></tr>'}</tbody></table>
        </div>
      </div>
    </div>
    <div class="page-section grid-2">
      <div class="card">
        <div class="card-head">
          <h2>Presence</h2>
          <span class="card-sub">${presenceEvents.length} arrival/departure events${presenceTotals.homeMs ? ` · ${formatDuration(presenceTotals.homeMs)} at home in the loaded history` : ""}</span>
        </div>
        ${presenceEvents.length ? `
          <div class="table-scroll">
            <table class="data-table"><thead><tr><th>Timestamp</th><th>Event</th><th>Radio</th><th>Duration</th></tr></thead>
            <tbody>${presenceEvents.slice(0, 30).map((e) => `<tr>
              <td>${formatTs(e.timestamp)}</td>
              <td>${e.event === "arrived" ? '<span class="badge status-online"><span class="dot"></span>Arrived</span>' : '<span class="badge status-offline"><span class="dot"></span>Left</span>'}</td>
              <td>${e.radio}</td>
              <td>${typeof e.duration_s === "number" ? formatDuration(e.duration_s * 1000) : '<span class="muted">—</span>'}</td>
            </tr>`).join("")}</tbody></table>
          </div>
          ${presenceEvents.length > 30 ? `<p class="field-hint">Showing the 30 most recent of ${presenceEvents.length} events.</p>` : ""}
        ` : `<p class="empty-state">Not tracked for presence. Add this MAC to <code>--wifi-home-macs</code>/<code>--ble-home-macs</code>, or to the <code>devices</code> section of the daemon's config file.</p>`}
      </div>
      <div class="card">
        <div class="card-head">
          <h2>Requested SSIDs &amp; IPv6</h2>
          <span class="card-sub">networks this device asked for, and its IPv6 addresses if seen</span>
        </div>
        <div class="detail-grid">
          <div><span>WiFi traffic (${rangeLabel()})</span>${trafficBytes ? formatBytes(trafficBytes) : "—"}</div>
          <div><span>SSIDs requested</span>${requestedSsids.length || "—"}</div>
        </div>
        ${requestedSsids.length ? `<div class="chip-list">${requestedSsids.slice(0, 20).map((s) =>
          `<span class="badge">${escapeHtml(s)}${isHomeSsid(s) ? " ★" : ""}</span>`).join("")}</div>` : ""}
        ${ipv6ForMac.length ? `
          <div class="table-scroll" style="margin-top:12px;">
            <table class="data-table"><thead><tr><th>IPv6 address</th><th>Scope</th><th>State</th><th>Last seen</th></tr></thead>
            <tbody>${ipv6ForMac.map((r) => `<tr>
              <td class="mono">${escapeHtml(r.ipv6)}</td>
              <td>${escapeHtml(r.scope || "—")}</td>
              <td>${escapeHtml(r.state || "—")}</td>
              <td>${formatTs(r.timestamp)}</td>
            </tr>`).join("")}</tbody></table>
          </div>
        ` : `<p class="field-hint">No IPv6 address seen for this MAC (needs <code>--ipv6-discovery</code> on the daemon, and a dual-stack network).</p>`}
      </div>
    </div>
    <p class="field-hint">MACs in WiFi probes and BLE advertisements are often randomized by modern devices and may not match the LAN interface MAC of the same device: the sections above stay empty in that case, it's not an error.</p>
  `;
  wireBackToOrigin(container);
  wireInventoryEditor(container, mac, () => renderDeviceProfile(container, mac));
  document.getElementById("device-name-input").addEventListener("change", (e) => {
    setDeviceLabel(mac, { name: e.target.value.trim() });
    renderDeviceProfile(container, mac);
  });
  document.getElementById("device-trust-toggle").addEventListener("click", () => {
    setDeviceLabel(mac, { trusted: !getDeviceLabel(mac).trusted });
    renderDeviceProfile(container, mac);
  });
  document.getElementById("device-link-mac-btn").addEventListener("click", () => {
    const input = document.getElementById("device-link-mac-input");
    const target = input.value.trim().toLowerCase();
    if (!target) return;
    linkDeviceIdentity(target, mac);
    renderDeviceProfile(container, mac);
  });
  container.querySelectorAll("[data-goto-mac]").forEach((btn) => {
    btn.addEventListener("click", () => goToDevice(btn.dataset.gotoMac));
  });
  container.querySelectorAll("[data-unlink-mac]").forEach((btn) => {
    btn.addEventListener("click", () => {
      unlinkDeviceIdentity(mac, btn.dataset.unlinkMac);
      renderDeviceProfile(container, mac);
    });
  });
  container.querySelectorAll("[data-link-suggestion]").forEach((btn) => {
    btn.addEventListener("click", () => {
      linkDeviceIdentity(btn.dataset.linkSuggestion, mac);
      renderDeviceProfile(container, mac);
    });
  });
  container.querySelectorAll("[data-dismiss-suggestion]").forEach((btn) => {
    btn.addEventListener("click", () => {
      dismissIdentitySuggestion(mac, btn.dataset.dismissSuggestion);
      renderDeviceProfile(container, mac);
    });
  });
}

function renderScansPage(container) {
  container.innerHTML = `<div class="page-section card" id="scansioni-mount"></div>`;
  renderScansPageBody(document.getElementById("scansioni-mount"));
}

function renderScansPageBody(container) {
  const cycles = computeScanCycles();
  const info = paginate(cycles, "scansioni");
  container.innerHTML = `
    <div class="card-head"><h2>LAN scan history</h2><span class="card-sub">${cycles.length} cycles reconstructed from the discovery log</span></div>
    <div class="table-scroll">
      <table class="data-table">
        <thead><tr><th>Time</th><th>Devices seen</th><th>New</th><th>Offline</th></tr></thead>
        <tbody>
          ${info.pageRows.map((c) => `<tr>
            <td>${formatTs(c.startTs)}</td>
            <td>${c.deviceCount}</td>
            <td>${c.newCount ? `<span class="badge status-new"><span class="dot"></span>${c.newCount}</span>` : '<span class="muted">0</span>'}</td>
            <td>${c.offlineCount ? `<span class="badge status-offline"><span class="dot"></span>${c.offlineCount}</span>` : '<span class="muted">0</span>'}</td>
          </tr>`).join("")}
        </tbody>
      </table>
      ${cycles.length ? "" : '<p class="empty-state">No scan cycles in the loaded log.</p>'}
      <div id="scansioni-pagination"></div>
    </div>
  `;
  document.getElementById("scansioni-pagination").innerHTML = cycles.length ? paginationHtml("scansioni", info) : "";
  wirePagination(document.getElementById("scansioni-pagination"), "scansioni", () => renderScansPageBody(container));
}

function alertItemHtml(a) {
  const dismissed = isDismissed(a.id);
  const snoozed = isSnoozed(a.id);
  // Il MAC di un alert è un device come tutti gli altri: cliccabile e chiamato col suo nome,
  // esattamente come in ogni altra tabella dell'app (prima era testo morto).
  const identifier = a.mac
    ? `<button class="link-cell" data-mac-link="${escapeHtml(a.mac)}">${escapeHtml(displayName(a.mac, a.mac))}</button>`
    : a.ip ? `IP ${escapeHtml(a.ip)}` : null;
  return `<div class="alert-item ${dismissed ? "is-dismissed" : ""} ${snoozed ? "is-snoozed" : ""}">
    <span class="alert-icon sev-${a.severity}">${ICON(a.icon || "alert-triangle")}</span>
    <div class="alert-body">
      <div class="alert-title">
        ${escapeHtml(a.title)}
        ${a.source === "detect" ? `<span class="source-tag">${ICON("shield")}Detected by daemon</span>` : ""}
        ${a.homeOccupied === false ? `<span class="source-tag tone-critical" title="Nobody configured for presence tracking was home when this happened${a.escalated ? " — severity raised one level (--presence-aware-alerts)" : ""}">${ICON("home")}Home empty</span>` : ""}
        ${snoozed ? `<span class="source-tag" title="Snoozed until ${formatTs(snoozedUntil(a.id))}">${ICON("clock")}Snoozed until ${formatTs(snoozedUntil(a.id))}</span>` : ""}
      </div>
      <div class="alert-desc">${escapeHtml(a.desc)}</div>
      <div class="alert-meta"><span>${formatTs(a.ts ? new Date(a.ts).toISOString() : "")}</span>${identifier ? `<span>${identifier}</span>` : ""}</div>
    </div>
    <div class="alert-actions">
      ${snoozed
        ? `<button class="btn btn-icon" data-unsnooze="${escapeHtml(a.id)}" title="Remove snooze">${ICON("refresh")}</button>`
        : `<select class="select-control snooze-select" data-snooze="${escapeHtml(a.id)}" title="Snooze">
             <option value="">Snooze…</option>
             <option value="1">1 hour</option>
             <option value="24">24 hours</option>
             <option value="168">7 days</option>
           </select>`}
      <button class="btn btn-icon" data-dismiss="${escapeHtml(a.id)}" title="${dismissed ? "Restore" : "Dismiss"}">${ICON(dismissed ? "refresh" : "x")}</button>
    </div>
  </div>`;
}

const ALERT_PRESETS_KEY = "hs.alerts.presets";
function getAlertPresets() {
  try { return JSON.parse(localStorage.getItem(ALERT_PRESETS_KEY) || "[]"); } catch { return []; }
}
function saveAlertPresets(list) { localStorage.setItem(ALERT_PRESETS_KEY, JSON.stringify(list)); }

function renderAlertsPage(container) {
  const all = computeAlerts();

  const typesPresent = [...new Set(all.map((a) => a.type).filter(Boolean))]
    .map((type) => ({ type, label: ALERT_TYPE_META[type]?.label || type.replace(/_/g, " ") }))
    .sort((a, b) => a.label.localeCompare(b.label, "en"));
  if (!typesPresent.some((t) => t.type === state.alertsTypeFilter) && state.alertsTypeFilter !== "all") {
    state.alertsTypeFilter = "all"; // the selected type no longer appears among the current alerts
  }

  const active = all.filter((a) => !isDismissed(a.id) && !isSnoozed(a.id));
  const criticalCount = active.filter((a) => a.severity === "critical").length;
  const homeEmptyCount = active.filter((a) => a.homeOccupied === false).length;

  container.innerHTML = `
    <div class="page-section kpi-row">
      ${kpiTile({
        label: "Active alerts", icon: "bell", tone: active.length ? "critical" : "good",
        value: active.length, sub: `${all.length} total, including dismissed and snoozed`,
        navKey: "alerts-active",
      })}
      ${kpiTile({
        label: "Critical", icon: "alert-triangle", tone: criticalCount ? "critical" : "good",
        value: criticalCount, sub: criticalCount ? "Need attention now" : "Nothing critical right now",
        subTone: criticalCount ? "critical" : "good", navKey: "alerts-critical",
      })}
      ${kpiTile({
        label: "While home was empty", icon: "home", tone: homeEmptyCount ? "critical" : "blue",
        value: homeEmptyCount,
        sub: homeEmptyCount ? "Nobody home when these fired" : "None — or presence tracking is off",
        navKey: "alerts-home-empty",
      })}
      ${kpiTile({
        label: "Snoozed / dismissed", icon: "clock", tone: "blue",
        value: all.length - active.length, sub: "Hidden from the active list",
        navKey: "alerts-hidden",
      })}
    </div>

    <div class="card">
      <div class="card-head">
        <h2>Alerts</h2>
        <div class="filter-row" style="margin:0;">
          <div class="search-input">${ICON("search")}<input type="text" id="alerts-search" placeholder="Search alerts, devices…"></div>
          <select class="select-control" id="alerts-severity-filter">
            <option value="all">All severities</option>
            <option value="critical">Critical</option>
            <option value="serious">Serious</option>
            <option value="info">Info</option>
          </select>
          <select class="select-control" id="alerts-type-filter">
            <option value="all">All types</option>
            ${typesPresent.map((t) => `<option value="${escapeHtml(t.type)}">${escapeHtml(t.label)}</option>`).join("")}
          </select>
          <select class="select-control" id="alerts-filter">
            <option value="active">Active</option>
            <option value="all">All</option>
            <option value="snoozed">Snoozed</option>
            <option value="dismissed">Dismissed</option>
          </select>
          ${inlineExportHtml("alerts")}
        </div>
      </div>
      <div class="preset-row" id="preset-row"></div>
      <div class="alert-list" id="alert-list"></div>
    </div>`;

  document.getElementById("alerts-filter").value = state.alertsFilter;
  document.getElementById("alerts-filter").addEventListener("change", (e) => {
    state.alertsFilter = e.target.value;
    renderAlertList();
    renderPresetChips();
  });
  document.getElementById("alerts-type-filter").value = state.alertsTypeFilter;
  document.getElementById("alerts-type-filter").addEventListener("change", (e) => {
    state.alertsTypeFilter = e.target.value;
    renderAlertList();
    renderPresetChips();
  });
  document.getElementById("alerts-severity-filter").value = state.alertsSeverityFilter;
  document.getElementById("alerts-severity-filter").addEventListener("change", (e) => {
    state.alertsSeverityFilter = e.target.value;
    renderAlertList();
  });
  document.getElementById("alerts-search").addEventListener("input", renderAlertList);
  wireKpiNav(container, {
    "alerts-active": () => { setAlertsView({ status: "active", severity: "all", homeEmpty: false }); },
    "alerts-critical": () => { setAlertsView({ status: "active", severity: "critical", homeEmpty: false }); },
    "alerts-home-empty": () => { setAlertsView({ status: "all", severity: "all", homeEmpty: true }); },
    "alerts-hidden": () => { setAlertsView({ status: "dismissed", severity: "all", homeEmpty: false }); },
  });
  wireInlineExport(container, "alerts", "alerts_filtered", () => visibleAlerts().map((a) => ({
    severity: a.severity, type: a.type, title: a.title, desc: a.desc,
    mac: a.mac || "", name: a.mac ? displayName(a.mac, "") : "", home_occupied: a.homeOccupied ?? "",
    timestamp: a.ts ? new Date(a.ts).toISOString() : "",
  })));
  renderAlertList();
  renderPresetChips();

  /** Applica una vista completa (stato + severità + solo "casa vuota") e ridisegna: usata dai KPI
   * cliccabili in cima, così ogni numero mostrato porta esattamente alla lista che lo compone. */
  function setAlertsView({ status, severity, homeEmpty }) {
    state.alertsFilter = status;
    state.alertsSeverityFilter = severity;
    state.alertsHomeEmptyOnly = homeEmpty;
    document.getElementById("alerts-filter").value = status;
    document.getElementById("alerts-severity-filter").value = severity;
    renderAlertList();
    renderPresetChips();
  }

  function visibleAlerts() {
    const search = (document.getElementById("alerts-search")?.value || "").trim().toLowerCase();
    let list = all;
    if (state.alertsFilter === "active") list = list.filter((a) => !isDismissed(a.id) && !isSnoozed(a.id));
    if (state.alertsFilter === "snoozed") list = list.filter((a) => isSnoozed(a.id));
    if (state.alertsFilter === "dismissed") list = list.filter((a) => isDismissed(a.id));
    if (state.alertsTypeFilter !== "all") list = list.filter((a) => a.type === state.alertsTypeFilter);
    if (state.alertsSeverityFilter !== "all") list = list.filter((a) => a.severity === state.alertsSeverityFilter);
    if (state.alertsHomeEmptyOnly) list = list.filter((a) => a.homeOccupied === false);
    if (search) {
      list = list.filter((a) => `${a.title} ${a.desc} ${a.mac || ""} ${a.ip || ""} ${a.mac ? displayName(a.mac, "") : ""}`
        .toLowerCase().includes(search));
    }
    return list;
  }

  function renderAlertList() {
    const list = visibleAlerts();
    const el = document.getElementById("alert-list");
    if (!list.length) { el.innerHTML = '<p class="empty-state">No alerts match these filters.</p>'; return; }
    el.innerHTML = list.map(alertItemHtml).join("");
    el.querySelectorAll("[data-dismiss]").forEach((btn) => {
      btn.addEventListener("click", () => { toggleDismiss(btn.dataset.dismiss); renderAlertList(); updateNavBadge(); });
    });
    el.querySelectorAll("[data-snooze]").forEach((select) => {
      select.addEventListener("change", () => {
        const hours = Number(select.value);
        if (hours) snoozeAlert(select.dataset.snooze, hours);
        renderAlertList();
        updateNavBadge();
      });
    });
    el.querySelectorAll("[data-unsnooze]").forEach((btn) => {
      btn.addEventListener("click", () => { unsnoozeAlert(btn.dataset.unsnooze); renderAlertList(); updateNavBadge(); });
    });
    el.querySelectorAll("[data-mac-link]").forEach((btn) => {
      btn.addEventListener("click", () => goToDevice(btn.dataset.macLink));
    });
  }

  function renderPresetChips() {
    const presets = getAlertPresets();
    const row = document.getElementById("preset-row");
    row.innerHTML = `
      ${presets.map((p, i) => `<button class="preset-chip ${state.alertsFilter === p.statusFilter && state.alertsTypeFilter === p.typeFilter ? "active" : ""}" data-preset="${i}">
        ${escapeHtml(p.name)}<span class="preset-chip-x" data-preset-del="${i}">${ICON("x")}</span>
      </button>`).join("")}
      <button class="preset-chip preset-chip-add" id="preset-add">${ICON("bell")}Save current filter</button>
    `;
    row.querySelectorAll("[data-preset]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        if (e.target.closest("[data-preset-del]")) return;
        const p = presets[Number(btn.dataset.preset)];
        state.alertsFilter = p.statusFilter;
        state.alertsTypeFilter = typesPresent.some((t) => t.type === p.typeFilter) ? p.typeFilter : "all";
        document.getElementById("alerts-filter").value = state.alertsFilter;
        document.getElementById("alerts-type-filter").value = state.alertsTypeFilter;
        renderAlertList();
        renderPresetChips();
      });
    });
    row.querySelectorAll("[data-preset-del]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const list = getAlertPresets();
        list.splice(Number(btn.dataset.presetDel), 1);
        saveAlertPresets(list);
        renderPresetChips();
      });
    });
    document.getElementById("preset-add").addEventListener("click", () => {
      const name = prompt('Name for this filter (e.g. "Active critical only"):');
      if (!name || !name.trim()) return;
      const list = getAlertPresets();
      list.push({ name: name.trim(), statusFilter: state.alertsFilter, typeFilter: state.alertsTypeFilter });
      saveAlertPresets(list);
      renderPresetChips();
    });
  }
}

/** Stato dei moduli daemon, dedotto dai dati effettivamente caricati (non c'è un endpoint di stato dedicato). */
function formatBytes(bytes) {
  if (!bytes) return "";
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

/** Riga di stato di *connettività* di una sorgente dati (il file è raggiungibile da qui?). Da non
 * confondere con "System health" in Dashboard, che dice se il modulo è acceso sul daemon: le due
 * domande sono diverse e prima l'app rispondeva a entrambe con questa sola, deducendola dai dati
 * caricati — ambiguo, perché un file assente può voler dire tanto "modulo spento" quanto
 * "dashboard collegata al posto sbagliato". */
function sourceStatusRow(source) {
  const s = state.sourceStatus[source.key];
  let tone = "muted", text = "Not loaded yet";
  if (s) {
    if (s.ok && s.count > 0) {
      tone = "good";
      text = `Reachable — ${s.count.toLocaleString("en-GB")} rows loaded`;
      if (s.truncated) text += ` (most recent only — ${formatBytes(s.totalBytes)} file, limited to the last ${formatBytes(TAIL_FETCH_BYTES)})`;
    } else if (s.ok && s.count === 0) {
      tone = "warning"; text = "Reachable, no rows yet";
    } else {
      tone = "muted"; text = "Not found (file missing, or the module isn't running on the daemon)";
    }
  }
  const localFile = source.fileKey ? state[source.fileKey] : null;
  return `<div class="module-status-row">
    <span class="module-status-dot tone-${tone}"></span>
    <div>
      <strong>${escapeHtml(source.label)}</strong>
      <span>${escapeHtml(text)} · <code>${escapeHtml(localFile ? `${localFile.name} (local file)` : sourceUrl(source))}</code></span>
    </div>
  </div>`;
}

function renderSettingsPage(container) {
  const themeMode = getSetting("theme");
  const densityMode = getSetting("density");
  container.innerHTML = `
    <div class="page-section card">
      <div class="card-head">
        <h2>Data sources</h2>
        <span class="card-sub">whether each daemon log is reachable from here — <em>not</em> whether the module is on: that answer comes from the daemon itself, in "System health" on the Dashboard</span>
      </div>
      <div class="settings-grid">
        <div class="field">
          <label for="set-log-base">Log folder (base URL or path)</label>
          <input type="text" id="set-log-base" value="${escapeHtml(getSetting("logBase"))}" placeholder="e.g. /logs or http://raspberrypi.local:8080">
        </div>
        <div class="field">
          <label for="set-api-url">Query API (optional, <code>--api</code> on the daemon)</label>
          <input type="text" id="set-api-url" value="${escapeHtml(getSetting("apiUrl"))}" placeholder="http://raspberrypi.local:8099">
        </div>
        <div class="field">
          <label for="set-refresh">Auto-refresh</label>
          <select id="set-refresh" class="select-control">
            <option value="0">Off</option>
            <option value="1000">Every 1s</option>
            <option value="5000">Every 5s</option>
            <option value="15000">Every 15s</option>
            <option value="30000">Every 30s</option>
            <option value="60000">Every 60s</option>
          </select>
        </div>
      </div>
      <p class="field-hint">All the daemon's logs normally live in the same folder (that's what <code>dashboard/link-logs.sh</code> sets up), so setting the folder once is enough — each file below only needs its own entry if you keep it somewhere else. The query API is optional: when set, pages that need the full history use it instead of the truncated tail of the large JSONL files.</p>
      <div class="module-status-list">
        ${DATA_SOURCES.map((s) => sourceStatusRow(s)).join("")}
      </div>
      <details class="source-overrides">
        <summary>Per-source overrides and local files</summary>
        <div class="settings-grid">
          ${DATA_SOURCES.map((s) => `
            <div class="field">
              <label for="set-src-${s.key}">${escapeHtml(s.label)}</label>
              <input type="text" id="set-src-${s.key}" data-source-url="${s.key}" value="${escapeHtml(getSetting(sourceSettingKey(s)))}">
            </div>
            ${s.fileKey ? `<div class="field"><label for="set-file-${s.key}">${escapeHtml(s.label)} — load a local file</label><input type="file" id="set-file-${s.key}" data-source-file="${s.key}" accept=".jsonl,.ndjson,.json,.txt"></div>` : ""}
          `).join("")}
        </div>
      </details>
      <p class="field-hint">If the dashboard is opened as a local file (<code>file://</code>) fetching via URL won't work due to browser security restrictions: use the "load a local file" fields, or serve this folder with <code>python3 -m http.server</code>. With very large logs, 1-5s intervals re-read the whole file every cycle: if you notice slowdowns, increase the interval. Every source except LAN, WiFi and BLE is optional: a missing file just means that module isn't running on the daemon.</p>
    </div>


    <div class="page-section card">
      <div class="card-head"><h2>Notifications</h2><span class="card-sub">desktop notifications for new critical alerts, while this tab stays open</span></div>
      <div class="settings-grid">
        <div class="field">
          <label>Desktop notifications</label>
          ${typeof Notification === "undefined"
            ? `<p class="field-hint" style="margin:0;">This browser doesn't support the Notifications API.</p>`
            : `<div style="display:flex;gap:8px;flex-wrap:wrap;">
                 <button class="btn ${getNotificationsEnabled() && Notification.permission === "granted" ? "btn-primary" : ""}" id="set-notifications-toggle">
                   ${ICON("bell")}${getNotificationsEnabled() && Notification.permission === "granted" ? "Enabled — disable" : "Enable"}
                 </button>
                 ${getNotificationsEnabled() && Notification.permission === "granted"
                   ? `<button class="btn" id="set-notifications-test">Send test notification</button>`
                   : ""}
               </div>`}
        </div>
      </div>
      <p class="field-hint" id="set-notifications-hint"></p>
    </div>

    <div class="page-section card">
      <div class="card-head"><h2>Network information</h2><span class="card-sub">gateway label for the Network map (page currently hidden)</span></div>
      <div class="settings-grid">
        <div class="field"><label for="set-net-label">Network name</label><input type="text" id="set-net-label" value="${escapeHtml(getSetting("netLabel"))}" placeholder="Home_Network"></div>
        <div class="field"><label for="set-net-gateway">Gateway</label><input type="text" id="set-net-gateway" value="${escapeHtml(getSetting("netGateway"))}" placeholder="192.168.1.1"></div>
      </div>
      <p class="field-hint">Home Sentinel doesn't detect these values automatically: enter them manually (e.g. the router's IP). The gateway takes priority over the network name if both are set.</p>
    </div>

    <div class="page-section card">
      <div class="card-head"><h2>Appearance</h2><span class="card-sub">"System" follows the operating system theme</span></div>
      <div class="theme-choice">
        <button type="button" data-theme-choice="light" class="${themeMode === "light" ? "active" : ""}">${ICON("sun")}Light</button>
        <button type="button" data-theme-choice="dark" class="${themeMode === "dark" ? "active" : ""}">${ICON("moon")}Dark</button>
        <button type="button" data-theme-choice="system" class="${themeMode === "system" ? "active" : ""}">${ICON("monitor")}System</button>
      </div>
      <div class="field" style="margin-top:14px;">
        <label>Table row density</label>
        <div class="theme-choice">
          <button type="button" data-density-choice="comfortable" class="${densityMode === "comfortable" ? "active" : ""}">Comfortable</button>
          <button type="button" data-density-choice="compact" class="${densityMode === "compact" ? "active" : ""}">Compact</button>
        </div>
      </div>
    </div>
  `;
  document.getElementById("set-refresh").value = getSetting("refreshMs");

  document.getElementById("set-log-base").addEventListener("change", (e) => { setSetting("logBase", e.target.value.trim()); loadAll(); });
  document.getElementById("set-api-url").addEventListener("change", (e) => { setSetting("apiUrl", e.target.value.trim()); loadAll(); });
  container.querySelectorAll("[data-source-url]").forEach((input) => {
    input.addEventListener("change", (e) => {
      const source = sourceByKey[input.dataset.sourceUrl];
      setSetting(sourceSettingKey(source), e.target.value.trim() || source.file);
      if (source.fileKey) state[source.fileKey] = null; // un URL esplicito ha la meglio sul file locale caricato prima
      loadAll();
    });
  });
  container.querySelectorAll("[data-source-file]").forEach((input) => {
    input.addEventListener("change", (e) => {
      if (!e.target.files[0]) return;
      state[sourceByKey[input.dataset.sourceFile].fileKey] = e.target.files[0];
      loadAll();
    });
  });

  document.getElementById("set-refresh").addEventListener("change", (e) => { setSetting("refreshMs", e.target.value); setupRefreshTimer(); });

  [["set-net-label", "netLabel"], ["set-net-gateway", "netGateway"]].forEach(([id, key]) => {
    document.getElementById(id).addEventListener("change", (e) => { setSetting(key, e.target.value.trim()); });
  });
  container.querySelectorAll("[data-theme-choice]").forEach((btn) => {
    btn.addEventListener("click", () => setThemeMode(btn.dataset.themeChoice));
  });
  container.querySelectorAll("[data-density-choice]").forEach((btn) => {
    btn.addEventListener("click", () => setDensityMode(btn.dataset.densityChoice));
  });

  refreshNotificationsHint();
  document.getElementById("set-notifications-toggle")?.addEventListener("click", async () => {
    const enabledNow = getNotificationsEnabled() && Notification.permission === "granted";
    if (enabledNow) {
      disableDesktopNotifications();
    } else {
      const perm = await enableDesktopNotifications();
      if (perm === "denied") {
        document.getElementById("set-notifications-hint").textContent =
          "Blocked at the browser level — check this site's notification permission in your browser settings to re-allow it.";
      }
    }
    renderSettingsPage(container);
  });
  document.getElementById("set-notifications-test")?.addEventListener("click", () => {
    new Notification("Home Sentinel — test notification", {
      body: "If you can see this, desktop notifications are working correctly.",
    });
  });
}

function refreshNotificationsHint() {
  const hint = document.getElementById("set-notifications-hint");
  if (!hint) return;
  if (typeof Notification === "undefined") { hint.textContent = ""; return; }
  if (Notification.permission === "denied") {
    hint.textContent = "Blocked at the browser level — check this site's notification permission in your browser settings to re-allow it.";
  } else if (getNotificationsEnabled() && Notification.permission === "granted") {
    hint.textContent = "Enabled. You'll get a notification for new critical-severity alerts (ARP spoofing, rogue DHCP, evil twin, deauth flood, BLE tracker/spoofing, critical risky ports...) while this tab is open — not a true push, the tab must stay open.";
  } else {
    hint.textContent = "Off. Enabling asks your browser for permission, then only notifies for critical alerts that appear from that point on — not your entire existing history.";
  }
}

/** `statusKey` collega la card al relativo state.sourceStatus, per segnalare quando l'export non
 * copre l'intero storico ma solo la coda caricata dalla dashboard (log oltre TAIL_FETCH_BYTES, vedi
 * fetchJsonl) — altrimenti un utente potrebbe scaricare un CSV credendolo completo e non esserlo. */
function exportCardHtml(title, sub, key, statusKey) {
  const truncated = statusKey && state.sourceStatus[statusKey]?.truncated;
  return `<div class="card export-card">
    <div>
      <h2 style="margin:0 0 4px;font-size:0.92rem;">${escapeHtml(title)}</h2>
      <p>${escapeHtml(sub)}${truncated ? ` <span class="export-truncated-tag" title="Log larger than ${formatBytes(TAIL_FETCH_BYTES)}: the dashboard only loads the most recent tail, so this export reflects only that">partial history</span>` : ""}</p>
    </div>
    <div class="export-actions">
      <button class="btn" data-export="${key}" data-format="csv">${ICON("download")}CSV</button>
      <button class="btn" data-export="${key}" data-format="json">${ICON("download")}JSON</button>
    </div>
  </div>`;
}

function renderExportPage(container) {
  const lanCurrent = latestLanByMac(state.lanRows);
  const alerts = computeAlerts();
  // Guidato da DATA_SOURCES: ogni sorgente caricata è anche esportabile, senza doversi
  // ricordare di aggiungere a mano una card per ogni modulo nuovo (presence, deep scan e
  // handshake erano rimasti fuori proprio così).
  container.innerHTML = `<div class="export-grid">
    ${exportCardHtml("LAN devices (current status)", `${lanCurrent.length} devices`, "lan-current", "lan")}
    ${DATA_SOURCES.filter((s) => s.exportName).map((s) =>
      exportCardHtml(s.label, `${state[s.rows].length.toLocaleString("en-GB")} rows`, `src:${s.key}`, s.key)).join("")}
    ${exportCardHtml("Alerts (as shown in the app)", `${alerts.length} alerts`, "alerts", "alerts")}
  </div>`;
  container.querySelectorAll("[data-export]").forEach((btn) => {
    btn.addEventListener("click", () => doExport(btn.dataset.export, btn.dataset.format));
  });
}

/** Bottoni CSV/JSON da mettere nell'intestazione di una tabella, per esportare esattamente quello
 * che si sta guardando senza passare dalla pagina Esporta (e senza perdere i filtri applicati). */
function inlineExportHtml(id) {
  return `<div class="inline-export">
    <button class="btn btn-icon" data-inline-export="${id}" data-format="csv" title="Export these rows as CSV">${ICON("download")}CSV</button>
    <button class="btn btn-icon" data-inline-export="${id}" data-format="json" title="Export these rows as JSON">${ICON("download")}JSON</button>
  </div>`;
}

/** Collega i bottoni creati da inlineExportHtml: `rowsProvider` ritorna le righe attualmente
 * visibili (già filtrate/ordinate), così l'export riflette la vista, non la sorgente grezza. */
function wireInlineExport(container, id, filename, rowsProvider) {
  container.querySelectorAll(`[data-inline-export="${id}"]`).forEach((btn) => {
    btn.addEventListener("click", () => {
      const rows = rowsProvider().map(stripInternal);
      downloadBlob(btn.dataset.format === "json" ? toJsonBlob(rows) : toCsvBlob(rows), `${filename}.${btn.dataset.format}`);
      showToast(`Exported ${rows.length.toLocaleString("en-GB")} row${rows.length === 1 ? "" : "s"} to ${filename}.${btn.dataset.format}`);
    });
  });
}

function stripInternal(dev) { const { _ts, ...rest } = dev; return rest; }
function toJsonBlob(rows) { return new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" }); }
/** Un valore che comincia con =, +, - o @ viene interpretato come formula da Excel/LibreOffice/Google
 * Sheets all'apertura del CSV ("CSV/Formula Injection") — un rischio reale qui perché hostname, nomi
 * mDNS/SSDP/BLE ecc. arrivano da device non fidati sulla rete (es. un hostname DHCP scelto ad arte).
 * Prefissare con un apostrofo neutralizza l'interpretazione come formula in tutti e tre i programmi,
 * senza alterare il valore visualizzato (l'apostrofo iniziale non viene mostrato in cella). */
function neutralizeCsvFormula(s) {
  return /^[=+\-@]/.test(s) ? `'${s}` : s;
}

function toCsvBlob(rows) {
  if (!rows.length) return new Blob([""], { type: "text/csv" });
  const headers = Object.keys(rows[0]);
  const esc = (v) => {
    const raw = Array.isArray(v) ? v.join(";") : v;
    const s = neutralizeCsvFormula(String(raw ?? ""));
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))];
  return new Blob([lines.join("\n")], { type: "text/csv" });
}
/** Messaggio transitorio in basso a destra (auto-scompare) — usato per confermare un'azione senza
 * interrompere il flusso con un alert(): export completati, azioni bulk applicate, ecc. Crea il
 * contenitore alla prima chiamata invece di richiedere markup dedicato in index.html. */
function showToast(message) {
  let stack = document.getElementById("toast-stack");
  if (!stack) {
    stack = document.createElement("div");
    stack.id = "toast-stack";
    stack.className = "toast-stack";
    document.body.appendChild(stack);
  }
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = message;
  stack.appendChild(el);
  setTimeout(() => {
    el.classList.add("toast-out");
    setTimeout(() => el.remove(), 250);
  }, 3500);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function doExport(key, format) {
  let rows, filename;
  if (key.startsWith("src:")) {
    // Sorgente del registro: le righe grezze così come caricate dal daemon.
    const source = sourceByKey[key.slice(4)];
    if (!source || !source.exportName) return;
    rows = state[source.rows];
    filename = source.exportName;
  } else if (key === "lan-current") {
    rows = latestLanByMac(state.lanRows).map(stripInternal);
    filename = "lan_devices_current";
  } else if (key === "alerts") {
    rows = computeAlerts().map((a) => ({
      id: a.id, severity: a.severity, title: a.title, desc: a.desc,
      mac: a.mac, name: a.mac ? displayName(a.mac, "") : "",
      timestamp: a.ts ? new Date(a.ts).toISOString() : "",
    }));
    filename = "alerts";
  } else return;
  downloadBlob(format === "json" ? toJsonBlob(rows) : toCsvBlob(rows), `${filename}.${format}`);
  showToast(`Exported ${rows.length.toLocaleString("en-GB")} row${rows.length === 1 ? "" : "s"} to ${filename}.${format}`);
}

function renderHelpPage(container) {
  container.innerHTML = `
    <div class="card help-section">
      <h3>How it works</h3>
      <p>Home Sentinel consists of a Python daemon (<code>home_sentinel.py</code>) that continuously writes JSON Lines files — <code>lan_discovery.jsonl</code> for LAN discovery, <code>wifi_probes.jsonl</code> for WiFi probe requests, <code>wifi_networks.jsonl</code> for adjacent WiFi networks detected from their own beacons, <code>ble_discovery.jsonl</code> for BLE scanning (each row includes a heuristic <code>device_type</code>, e.g. wearable, audio, or a possible tracker), <code>ble_identity_links.jsonl</code> for suggested BLE identity links across a rotated address, <code>ble_presence.jsonl</code> for arrival/departure events of the home BLE MACs configured with <code>--ble-home-macs</code>, <code>fingerprint_discovery.jsonl</code> for detected device types (including, when found, a device's own mDNS name), <code>deep_port_scan.jsonl</code> for the optional weekly deep port scan (all 65535 TCP ports, vs. the common-ports set scanned normally), <code>handshake_captures.jsonl</code> for the optional passive WPA/WPA2 handshake capture metadata (the actual <code>.pcap</code> files stay on the Pi's filesystem), <code>dhcp_events.jsonl</code> for DHCP client discovery, <code>os_fingerprint.jsonl</code> for the OS heuristic (passive listening plus an immediate active probe on newly discovered devices), <code>dhcp_leases.jsonl</code> for the router lease cross-check, <code>trend_daily.jsonl</code> for the daily rollup behind the Trend page, and <code>alerts_detection.jsonl</code> for detection module alerts (one JSON object per line, all optional except LAN; they write by default to <code>/var/log/home-sentinel/</code>) — and this static dashboard that reads and displays them. Configure the sources in <strong>Settings</strong>.</p>
      <p class="field-hint">LAN discovery finding fewer hosts than a tool like <code>nmap</code>? The daemon's ARP scan already retries hosts that don't answer the first broadcast (<code>--arp-retries</code>, default 2 — collisions are common on WiFi when many hosts reply at once); if some are still missing, two optional fallbacks can be enabled on the daemon: <code>--icmp-fallback</code> (a direct ping) and, as a last resort, <code>--tcp-fallback</code> (a SYN probe to a few common ports, for hosts whose firewall blocks ping but not TCP). Neither is a dashboard setting — see the README for the full explanation and when each one helps.</p>
    </div>
    <div class="card help-section">
      <h3>Device status</h3>
      <div class="legend-strip">
        <span>${statusBadge("online")} detected in the last scan cycle</span>
        <span>${statusBadge("new")} seen for the first time</span>
        <span>${statusBadge("offline")} not currently responding</span>
      </div>
    </div>
    <div class="card help-section">
      <h3>Pages</h3>
      <ul>
        <li><strong>Dashboard</strong> (home) — active hosts and unified BLE+WiFi presence at the top, then "Nearby": a large isometric house at the center with cards connected by guide lines for SSIDs requested in probes, adjacent networks detected from their own beacons, and WiFi/Bluetooth devices detected in the last 24h (closer = stronger signal, not actual position — a purely illustrative view, not a real map or physical distance). The house always shows up to 10 cards, distributed across whichever categories are active in the filters at the top (hiding a category redistributes its slots to the others). Below the house: scan status, a Network Discovery summary (totals, active/offline, risk distribution) and panels with a quick preview for each category — a "View all" button on each jumps to the corresponding page (Network Discovery, WiFi or BLE) with the complete, searchable list and full details, opening the right tab directly. "SSIDs requested" are networks saved on devices nearby, not necessarily networks present here; "Adjacent networks" are genuinely detected around you (BSSID/SSID/channel from their beacons). Click a card or a row for details. Then "Who's home" (one row per configured home MAC, or per linked identity if a BLE and a WiFi MAC have been explicitly linked as the same physical device via "Group by identity") and, last, "System health" (which optional daemon modules are actually active, read from <code>daemon_config.jsonl</code>, with the flag to enable any that's off).</li>
        <li><strong>Any WiFi network</strong> also has its own profile (click a row in "Adjacent networks"): beacon history, channel and security changes over time, handshakes captured for it and linked alerts. Your own network — the SSID configured with <code>--home-ssid</code> on the daemon — is marked "Your network" everywhere it appears, instead of looking like just another neighbour.</li>
        <li><strong>Network Discovery</strong> — KPI row (total hosts, new devices, at-risk count), then the full list of known LAN devices with device type and risk score (0-100, based on exposed ports and linked alerts); the hostname is a link to the device's full profile. Filter by status, type, vendor, risk level, trust and open ports, or toggle "Stale only" to surface devices offline for more than 30 days. "Columns" adds OS guess, mDNS name, ARP status (silent on the router's DHCP lease table), Uptime % and WiFi traffic (24h) — hidden by default to keep the table compact. "Group by identity" merges MACs linked as the same physical device into one row — the same link Dashboard's "Who's home" and the WiFi/BLE presence cards use to unify a device's BLE and WiFi MAC. Save recurring filter combinations as presets, or select rows with the checkboxes to trust or export several devices at once. From a row's action menu you can assign a custom name and mark a device as trusted (reduces noise: lower risk score, less severe linked alerts). A device's full profile also shows its last optional deep port scan (<code>--deep-port-scan</code>), if any, with how many ports it found beyond the regular scan.</li>
        <li><strong>WiFi</strong> — four tabs. <strong>Overview</strong>: a KPI row for adjacent networks (total detected, open, WPA2/WPA3, plus handshake captures) — click any tile to jump straight to the matching filtered list — a "Networks by security" breakdown chart, and probe activity/channel distribution charts for the last 24h. <strong>Networks</strong>: "Adjacent networks" (WiFi networks genuinely detected around you from their own beacons, filterable by security type — Open/WEP/WPA/WPA2-WPA3 — and by band, 2.4 vs 5 GHz; security is classified from the beacon itself and requires <code>--wifi-iface</code>) and "SSIDs requested" (a summary per network name requested in probes, not a list of physically present networks; click a row to see which devices requested it). <strong>Devices</strong>: "Nearby WiFi devices" (external devices detected via probes, one row per MAC) and the raw probe log for row-by-row analysis. <strong>Security</strong>: a "Presence" card with arrival/departure events for the home MAC addresses configured with <code>--wifi-home-macs</code> — fed by both the regular LAN/ARP scan (works even without <code>--wifi-iface</code>) and, if active, probe requests — and a "Handshake captures" card for the WPA/WPA2 handshakes captured for the home networks in <code>--home-ssid</code> when <code>--capture-handshakes</code> is active (metadata only, the actual <code>.pcap</code> file to run through aircrack-ng/hashcat stays on the Pi). Estimated WiFi traffic per device is not shown here: it's an optional column on the Network Discovery page, and it also remains in the CSV export and the periodic email report.</li>
        <li><strong>BLE</strong> — three tabs. <strong>Overview</strong>: KPIs (including a "Possible trackers" count) and 24h activity. <strong>Devices</strong>: the "BLE devices" table — a summary per MAC with a heuristic device type (wearable, audio, possible tracker...), manufacturer, signal and number of sightings, trackers highlighted — and the raw advertisement log for row-by-row analysis. <strong>Security</strong>: a "Presence" card with arrival/departure events for the home MACs configured with <code>--ble-home-macs</code>. From a device's full profile you can also see and act on suggested identity links across a rotated BLE address (same advertised name/services reappearing on a new MAC shortly after the old one went quiet) — a suggestion only, never applied automatically.</li>
        <li><strong>Timeline</strong> — one chronological feed for every module that's running: devices appearing and going offline, presence arrivals and departures, alerts, WPA handshakes captured, deep scans, DHCP requests, OS guesses and router port forwards. Searchable, filterable by category and paginated.</li>
        <li><strong>Scans</strong> — history of LAN discovery cycles.</li>
        <li><strong>Alerts</strong> — a KPI row (active, critical, fired while the home was empty, hidden) where every tile opens the list behind it, then new devices and risky open ports computed by the dashboard, plus alerts from the daemon-side detection modules if active (ARP spoofing, rogue DHCP, WiFi evil twin, deauth/disassoc flood, BLE tracker presence, BLE spoofing, recurring unknown WiFi devices, router port forwards to risky ports, new ports on known devices). Searchable and filterable by severity, type and status (Active/All/Snoozed/Dismissed), with filters savable as presets and an inline CSV/JSON export of exactly what's on screen. A "Home empty" tag marks alerts that fired while nobody tracked for presence was home — with <code>--presence-aware-alerts</code> on the daemon those also come in one severity level higher. The device an alert refers to is a link to its profile. Besides Dismiss (hidden until restored), each active alert can be Snoozed for 1h/24h/7 days. See <strong>Settings</strong> to enable desktop notifications for new critical-severity alerts.</li>
        <li><strong>Trend</strong> — how many new devices and alerts per day, over the window chosen in the top bar (at least 7 days, since a daily chart of 24 hours would be a single bar).</li>
        <li><strong>What changed</strong> — not <em>how many</em> but <em>which</em>: the selected window compared with the one immediately before it. Devices that appeared or went away, devices whose open ports changed, WiFi networks that appeared, and networks that changed their advertised security type.</li>
        <li><strong>Settings</strong> — one folder setting for all the daemon's logs (each file can still be pointed elsewhere individually), the optional query API address, auto-refresh, notifications, theme and row density. The status list here answers "is this file reachable from the browser?"; whether a module is actually running on the daemon is answered by "System health" on the Dashboard, which reads it from the daemon itself.</li>
        <li><strong>Export</strong> — every loaded data source as CSV or JSON, plus the current device list. Large tables also have their own CSV/JSON buttons in the header, which export exactly the filtered rows you're looking at.</li>
      </ul>
      <p class="field-hint">Press <strong>Ctrl+K</strong> (or <strong>⌘K</strong>) at any time for global search across pages, devices and alerts. The "Collapse" button at the bottom of the side menu shrinks it to icons only, for more room on pages with wide tables. On narrower screens the side menu becomes a drawer, opened from the menu button next to the page title.</p>
    </div>
    <div class="card help-section">
      <h3>Time window, and installing the app</h3>
      <p>The selector in the top bar sets one time window for the whole app: KPIs, charts, the Nearby view and the period comparison all follow it, so a number seen on one page always covers the same period as a number on another. It's remembered between reloads.</p>
      <p>The dashboard can be installed as an app (Add to home screen / Install): once installed it opens in its own window and still starts when the Pi is unreachable, showing why instead of a browser error. Data is never served from the cache — only the app itself is — so what you see is always live or nothing at all.</p>
      <p>The status pill next to the refresh button answers two separate questions: whether the logs are reachable from this browser, and whether the daemon that writes them is still alive (it writes a heartbeat file every 30s). A stopped daemon leaves its files in place, so without the heartbeat everything would keep looking fine while the data quietly aged.</p>
    </div>
    <div class="card help-section">
      <h3>Known limitations</h3>
      <ul>
        <li>Estimated WiFi traffic is not real bandwidth (Mbps): the Pi is not the gateway, so it only counts the bytes of data frames captured during channel hopping on a monitor-mode interface — a partial fraction of the real traffic, useful as a relative indicator (who transmits more compared to other devices) but not as an absolute bandwidth measurement.</li>
        <li>WiFi probe MACs and BLE addresses are often randomized by modern devices: they should be read as an indicator of activity nearby, not as a unique identifier over time.</li>
        <li>OS fingerprint's active probe (on by default with <code>--os-fingerprint</code>, <code>--no-os-fingerprint-active-probe</code> to disable) sends a single TCP SYN to each newly discovered LAN device — negligible traffic (comparable to what the regular port scan already generates), but it is genuinely active, unlike the rest of the module's passive listening.</li>
        <li>BLE manufacturer names come from a partial, curated list of the most common Bluetooth SIG company IDs: an unrecognized ID is shown as "ID 0x...".</li>
        <li>BLE device type, tracker detection and evil-twin/spoofing detection are heuristics based on publicly documented advertisement formats (Apple Find My/Continuity type bytes, Tile/Samsung service UUIDs), not a certain identification: a device can be misclassified, and a device manufacturer could in principle mimic these patterns.</li>
        <li>BLE identity link suggestions (address rotation) are a best-effort match on the advertised name/manufacturer/service UUIDs: two different devices with no name and identical service UUIDs (e.g. two earbuds of the same model) could occasionally be suggested as the same device — always a suggestion to confirm, never applied automatically.</li>
        <li>BLE and WiFi presence tracking only report arrival/departure for the MAC addresses explicitly configured with <code>--ble-home-macs</code>/<code>--wifi-home-macs</code> on the daemon: they have no notion of which devices belong to the household beyond that list, and a MAC that rotates (see above) will look like a departure followed by a new arrival unless it's also linked as the same identity. The two are tracked independently — a phone's BLE and WiFi addresses are normally different random addresses, so the same physical device configured on both counts as two separate "home" entries. WiFi presence has two independent sources that add up instead of competing: a MAC found online by the regular LAN/ARP scan (works even without <code>--wifi-iface</code> — the most reliable of the two, since many devices, iOS in particular, stop sending probe requests for a network once actually connected to it) and, if <code>--wifi-iface</code> is active, probe requests (useful for a device nearby but not yet connected). If a device's MAC address in <code>arp -a</code>/the Network Discovery page doesn't match what you set in <code>--wifi-home-macs</code>, presence won't fire for it — that's the actual MAC to use, not a guessed one.</li>
        <li>The deep port scan (<code>--deep-port-scan</code>) runs at most once every <code>--deep-port-scan-interval</code> (default one week) per device, and a brand-new device's first deep scan is deferred by a full interval rather than run immediately: it's meant to catch a service on an unusual port eventually, not as fast as the regular port scan.</li>
        <li>Handshake capture (<code>--capture-handshakes</code>) is purely passive — it only records EAPOL frames from a handshake that happens on its own (a client (re)connecting), it never sends a deauth to force one — and, like the rest of the WiFi monitor, is subject to channel hopping: a handshake that completes in milliseconds on a channel the sniffer isn't on at that moment can be missed or captured only partially (the "Messages" column shows exactly which of the 4 were caught). With <code>--home-ssid</code> configured, the daemon learns the home network's channel from its beacon and keeps the sniffer parked there most of the time once <code>--capture-handshakes</code> or deauth detection (on by default) are active — see <code>--no-home-channel-priority</code> if you'd rather keep full-spectrum hopping (e.g. your priority is monitoring neighboring networks, not your own). It only captures for the networks listed in <code>--home-ssid</code>, never for networks it merely detects nearby.</li>
        <li>The risk score (the "Risk" column in Network Discovery) is a heuristic based on exposed ports and linked alerts, not a formal security assessment; marking a device as trusted attenuates it (reduced score, linked alerts one level less severe) but doesn't hide it or exclude it from checks.</li>
        <li>Deauth/disassoc flood detection is threshold-based (number of frames in a time window): very crowded WiFi networks or aggressive roaming can generate occasional false positives, and a very slow/distributed attack over time can stay under the threshold.</li>
        <li>"Trend" and "Timeline" are calculated in the browser from the already-loaded JSONL files: automatic log rotation on the daemon (<code>--max-log-size-mb</code>) and the dashboard's "tail only" loading for larger files (>4MB) reduce the available history accordingly, especially beyond 7-30 days.</li>
        <li>The "Nearby" page is purely illustrative: the distance from the center only reflects the average signal (RSSI) in the last 24h, not a real physical distance, and the angle around the house is random (no direction data exists). It's not a location, just an at-a-glance view of "how much is around".</li>
        <li>"SSIDs requested" (in Nearby and the WiFi page) is not a list of WiFi networks physically present nearby: these are network names requested in probe requests by devices nearby, i.e. the networks those devices have saved — a phone can request dozens of known networks at once, regardless of where it has used them in the past or where it is now. The channel of a requested network is never shown: it doesn't exist in the probe request, only the sniffer's own channel at capture time.</li>
      </ul>
    </div>
  `;
}

/* ---------------------------------------------------------------------- *
 * Router / shell
 * ---------------------------------------------------------------------- */

// "mappa" (renderNetworkMapPage/renderNetworkMap) è volutamente esclusa da ROUTES:
// su una rete piatta a singolo segmento la topologia a stella non aggiunge
// informazione reale rispetto alla tabella Host. Il codice resta pronto per
// quando avrà senso (subnet/VLAN multiple, routing reale) — va solo
// riaggiunta qui sotto per riabilitarla in sidebar/ricerca globale.
const ROUTES = [
  { id: "dashboard", label: "Dashboard", icon: "home", title: "Dashboard", subtitle: "Local network overview", render: renderHouseRadarPage },
  { id: "host", label: "Network Discovery", icon: "monitor", title: "Network Discovery", subtitle: "Full list of LAN devices", render: renderHost },
  { id: "wifi", label: "WiFi", icon: "wifi", title: "WiFi", subtitle: "Probe requests, adjacent networks, presence and handshake capture", render: renderWifiPage },
  { id: "ble", label: "BLE", icon: "bluetooth", title: "BLE", subtitle: "Bluetooth Low Energy scan, device tracking and presence", render: renderBlePage },
  { id: "timeline", label: "Timeline", icon: "clock", title: "Timeline", subtitle: "Unified chronological feed of all events", render: renderTimeline },
  { id: "scans", label: "Scans", icon: "radar", title: "Scans", subtitle: "History of LAN discovery cycles", render: renderScansPage },
  { id: "alerts", label: "Alerts", icon: "bell", title: "Alerts", subtitle: "Events that need attention", render: renderAlertsPage },
  { id: "trend", label: "Trend", icon: "trending-up", title: "Trend", subtitle: "Historical trend of devices and alerts", render: renderTrend },
  { id: "changes", label: "What changed", icon: "layers", title: "What changed", subtitle: "This period compared with the one before it", render: renderWhatChanged },
  { id: "settings", label: "Settings", icon: "sliders", title: "Settings", subtitle: "Data sources, network and appearance", render: renderSettingsPage },
  { id: "export", label: "Export", icon: "download", title: "Export", subtitle: "Download the collected data", render: renderExportPage },
  { id: "help", label: "Help", icon: "help", title: "Help", subtitle: "Quick guide to Home Sentinel", render: renderHelpPage },
];

function getRouteById(id) { return ROUTES.find((r) => r.id === id) || ROUTES[0]; }

function renderSidebarNav() {
  const nav = document.getElementById("sidebar-nav");
  nav.innerHTML = ROUTES.map((r) => `<button class="nav-item ${r.id === state.route ? "active" : ""}" data-route="${r.id}" title="${escapeHtml(r.label)}">
    ${ICON(r.icon)}<span>${escapeHtml(r.label)}</span>
    ${r.id === "alerts" ? `<span class="nav-badge hidden" id="nav-badge-avvisi"></span>` : ""}
  </button>`).join("");
  nav.querySelectorAll("[data-route]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.wifiTab = "overview"; state.bleTab = "overview"; // click diretto sul menu: riparti dal tab overview
      const hash = `#/${btn.dataset.route}`;
      if (window.location.hash === hash) onRouteChange(); // stessa pagina: hashchange non scatterebbe da solo
      else window.location.hash = hash;
    });
  });
  updateNavBadge();
}

/* ---------------------------------------------------------------------- *
 * Menu mobile: sotto i 980px .sidebar sparisce (spazio insufficiente per una sidebar fissa),
 * quindi qui diventa un drawer a comparsa aperto dal bottone hamburger in topbar — senza,
 * su smartphone non ci sarebbe alcun modo di cambiare pagina se non con Ctrl+K.
 * ---------------------------------------------------------------------- */

function setMobileNavOpen(open) {
  document.getElementById("app-shell").classList.toggle("mobile-nav-open", open);
}

function initMobileNav() {
  document.getElementById("icon-mobile-nav-open").innerHTML = ICON("menu");
  document.getElementById("mobile-nav-open").addEventListener("click", () => setMobileNavOpen(true));
  document.getElementById("sidebar-backdrop").addEventListener("click", () => setMobileNavOpen(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMobileNavOpen(false);
  });
}

function updateNavBadge() {
  const badge = document.getElementById("nav-badge-avvisi");
  if (!badge) return;
  const count = computeAlerts().filter((a) => !isDismissed(a.id) && !isSnoozed(a.id)).length;
  if (count > 0) { badge.textContent = String(count); badge.classList.remove("hidden"); }
  else { badge.classList.add("hidden"); }
}

/* Sidebar collassabile: solo icone quando chiusa, per lasciare più spazio alle pagine con
 * tabelle larghe (es. Host). Stato persistito in localStorage, non nello state applicativo
 * (è una preferenza di layout, non dati). */
const SIDEBAR_COLLAPSED_KEY = "hs.sidebarCollapsed";

function applySidebarCollapsed(collapsed) {
  document.getElementById("app-shell").classList.toggle("sidebar-collapsed", collapsed);
  const btn = document.getElementById("sidebar-collapse-btn");
  btn.setAttribute("aria-label", collapsed ? "Expand sidebar" : "Collapse sidebar");
  btn.title = collapsed ? "Expand sidebar" : "Collapse sidebar";
  document.getElementById("icon-sidebar-collapse").innerHTML = ICON(collapsed ? "chevron-right" : "chevron-left");
  document.querySelector(".sidebar-collapse-label").textContent = collapsed ? "Expand" : "Collapse";
}

function initSidebarCollapse() {
  const collapsed = localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "1";
  applySidebarCollapsed(collapsed);
  document.getElementById("sidebar-collapse-btn").addEventListener("click", () => {
    const next = !document.getElementById("app-shell").classList.contains("sidebar-collapsed");
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? "1" : "0");
    applySidebarCollapsed(next);
  });
}

function onRouteChange() {
  setMobileNavOpen(false); // qualunque navigazione (menu, cmdk, un link "View all"...) chiude il drawer mobile
  const hash = window.location.hash.replace(/^#\/?/, "") || "dashboard";
  const [id, param] = hash.split("/");
  state.expandedMac = null;
  state.openMenuMac = null;

  if (id === "device" && param) {
    state.route = "device";
    state.deviceProfileMac = decodeURIComponent(param);
    document.querySelectorAll(".nav-item").forEach((el) => el.classList.remove("active"));
    document.getElementById("page-title").textContent = "Device profile";
    document.getElementById("page-subtitle").textContent = displayName(state.deviceProfileMac, state.deviceProfileMac);
    document.getElementById("page-icon").innerHTML = ICON("monitor");
    renderCurrentRoute();
    return;
  }

  if (id === "network" && param) {
    state.route = "network";
    state.networkProfileBssid = decodeURIComponent(param);
    document.querySelectorAll(".nav-item").forEach((el) => el.classList.remove("active"));
    document.getElementById("page-title").textContent = "Network profile";
    document.getElementById("page-subtitle").textContent = state.networkProfileBssid;
    document.getElementById("page-icon").innerHTML = ICON("wifi");
    renderCurrentRoute();
    return;
  }

  const route = getRouteById(id);
  state.route = route.id;

  document.querySelectorAll(".nav-item").forEach((el) => el.classList.toggle("active", el.dataset.route === route.id));
  document.getElementById("page-title").textContent = route.title;
  document.getElementById("page-subtitle").textContent = route.subtitle;
  document.getElementById("page-icon").innerHTML = ICON(route.icon);

  renderCurrentRoute();
}

/** Placeholder mostrato solo per il primissimo giro di caricamento (prima ancora che loadAllOnce()
 * completi una volta): senza, la primissima renderCurrentRoute() (chiamata da onRouteChange() in
 * init(), sincrona e quindi prima che qualunque fetch sia partito) mostrerebbe gli empty-state
 * "No data" di ogni pagina — indistinguibili per l'utente da "il modulo non è configurato". */
function renderInitialLoadingPlaceholder() {
  return `<div class="page-section card initial-loading">
    <span class="spin-loop">${ICON("refresh")}</span>
    <p>Loading Home Sentinel data…</p>
  </div>`;
}

function renderCurrentRoute() {
  const root = document.getElementById("view-root");
  if (!state.initialLoadDone) {
    root.innerHTML = renderInitialLoadingPlaceholder();
    return;
  }
  if (state.route === "device") {
    renderDeviceProfile(root, state.deviceProfileMac);
  } else if (state.route === "network") {
    renderNetworkProfile(root, state.networkProfileBssid);
  } else {
    getRouteById(state.route).render(root);
  }
  updateNavBadge();

  if (state.pageScrollTarget) {
    const targetId = state.pageScrollTarget;
    state.pageScrollTarget = null;
    requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}

/** Naviga a un'altra pagina scorrendo automaticamente fino a una sezione specifica (es. dai
 * pannelli della Dashboard alla tabella di dettaglio corrispondente sulla pagina WiFi/BLE). */
function navigateWithScroll(hash, targetId) {
  state.pageScrollTarget = targetId;
  if (window.location.hash === hash) onRouteChange(); // stessa pagina: hashchange non scatterebbe da solo
  else window.location.hash = hash;
}

/** Naviga alla pagina WiFi selezionando il tab che contiene la sezione richiesta, per i pulsanti
 * "View all" del radar della Dashboard che rimandano lì. */
const WIFI_SECTION_TO_TAB = { ssid: "networks", aps: "networks", devices: "devices" };
function navigateToWifiSection(section) {
  state.wifiTab = WIFI_SECTION_TO_TAB[section] || "overview";
  if (window.location.hash === "#/wifi") onRouteChange();
  else window.location.hash = "#/wifi";
}

/* ---------------------------------------------------------------------- *
 * Topbar: refresh, status pill, theme
 * ---------------------------------------------------------------------- */

function setupTopbar() {
  document.getElementById("refresh-now").addEventListener("click", async () => {
    const btn = document.getElementById("refresh-now");
    const icon = document.getElementById("icon-refresh");
    if (btn.disabled) return; // un fetch è già in corso (loadAll ha comunque il suo guard interno)
    btn.disabled = true;
    icon.classList.remove("spin");
    icon.classList.add("spin-loop");
    try {
      await loadAll();
    } finally {
      icon.classList.remove("spin-loop");
      btn.disabled = false;
    }
  });
  document.getElementById("status-pill").addEventListener("click", (e) => {
    e.stopPropagation();
    document.getElementById("status-dropdown").classList.toggle("hidden");
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".status-pill-wrap")) document.getElementById("status-dropdown").classList.add("hidden");
  });
  document.getElementById("theme-toggle").addEventListener("click", (e) => {
    e.stopPropagation();
    document.getElementById("theme-menu").classList.toggle("hidden");
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".theme-toggle-wrap")) document.getElementById("theme-menu").classList.add("hidden");
  });
}

/** Quanto è "fresco" l'ultimo battito del daemon. Oltre 3 intervalli senza aggiornamenti lo si
 * considera fermo: un margine di due battiti persi (rete lenta, carico) prima di allarmare. */
const HEARTBEAT_STALE_FACTOR = 3;

function daemonLiveness() {
  const beat = state.heartbeatRows[state.heartbeatRows.length - 1];
  if (!beat) return { known: false };
  const ts = parseTs(beat.timestamp);
  if (ts === null) return { known: false };
  const ageMs = Date.now() - ts;
  const intervalMs = (Number(beat.interval_s) || 30) * 1000;
  return {
    known: true,
    alive: ageMs <= intervalMs * HEARTBEAT_STALE_FACTOR,
    ageMs,
    ts,
    uptimeMs: (Number(beat.uptime_s) || 0) * 1000,
    beat,
  };
}

/**
 * Stato in alto a destra. Risponde a due domande diverse, che prima erano confuse in una sola:
 * i file sono raggiungibili da qui (fetch) *e* il daemon che li scrive è ancora vivo (heartbeat).
 * Un daemon fermo lascia i file al loro posto, quindi il solo fetch continuerebbe a dire "Online"
 * mentre i dati invecchiano — che è esattamente il caso in cui si vorrebbe essere avvisati.
 */
function updateStatusPill() {
  const pill = document.getElementById("status-pill");
  const text = document.getElementById("status-pill-text");
  const dropdown = document.getElementById("status-dropdown");
  const ok = state.lastFetchOk;
  const live = daemonLiveness();

  let label, down;
  if (ok === false) { label = "Error"; down = true; }
  else if (ok === null) { label = "Waiting"; down = false; }
  else if (live.known && !live.alive) { label = "Daemon stale"; down = true; }
  else { label = "Online"; down = false; }

  pill.classList.toggle("is-down", down);
  text.textContent = label;
  pill.title = live.known
    ? (live.alive
      ? `Daemon alive — last heartbeat ${formatRelativeTime(live.ts)}`
      : `No heartbeat for ${formatDuration(live.ageMs)}: the daemon may have stopped, the data below is not updating`)
    : "No heartbeat file: enable it on the daemon (it writes one by default) to tell 'quiet network' from 'daemon stopped'";

  const rowsLoaded = DATA_SOURCES
    .filter((s) => state[s.rows].length)
    .map((s) => `${state[s.rows].length.toLocaleString("en-GB")} ${s.label.toLowerCase()}`)
    .join(" · ") || "nothing loaded yet";

  dropdown.innerHTML = `
    <div><strong>Daemon</strong><br>${live.known
      ? `${live.alive ? "alive" : "no heartbeat"} — last beat ${escapeHtml(formatRelativeTime(live.ts))}${live.uptimeMs ? `, up ${escapeHtml(formatDuration(live.uptimeMs))}` : ""}`
      : "heartbeat not available"}</div>
    <div><strong>Log folder</strong><br>${escapeHtml(getSetting("logBase") || "(same folder as this page)")}</div>
    <div><strong>Rows loaded</strong><br>${escapeHtml(rowsLoaded)}</div>
  `;
}

const THEME_OPTIONS = [
  { key: "light", label: "Light", icon: "sun" },
  { key: "dark", label: "Dark", icon: "moon" },
  { key: "system", label: "System", icon: "monitor" },
];

function resolveSystemTheme() {
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}
function currentResolvedTheme() {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}
function applyThemeMode(mode) {
  document.documentElement.dataset.theme = mode === "system" ? resolveSystemTheme() : mode;
  updateThemeControls(mode);
}
function setThemeMode(mode) {
  setSetting("theme", mode);
  applyThemeMode(mode);
  if (state.route === "settings") renderCurrentRoute();
}
function updateThemeControls(mode) {
  document.getElementById("theme-toggle").innerHTML = ICON(currentResolvedTheme() === "dark" ? "moon" : "sun");
  const menu = document.getElementById("theme-menu");
  menu.innerHTML = THEME_OPTIONS.map((o) => `<button type="button" data-theme-mode="${o.key}" class="${mode === o.key ? "active" : ""}">${ICON(o.icon)}<span>${o.label}</span>${mode === o.key ? '<span class="check">✓</span>' : ""}</button>`).join("");
  menu.querySelectorAll("[data-theme-mode]").forEach((btn) => {
    btn.addEventListener("click", () => { setThemeMode(btn.dataset.themeMode); menu.classList.add("hidden"); });
  });
}
function initTheme() {
  applyThemeMode(getSetting("theme"));
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: light)").addEventListener("change", () => {
      if (getSetting("theme") === "system") applyThemeMode("system");
    });
  }
}

/** Densità delle righe nelle tabelle (comfortable/compact) — stesso meccanismo del tema
 * (data-attribute sulla root + persistenza in localStorage), utile per vedere più righe a schermo
 * su tabelle grandi (Network Discovery, log grezzi WiFi/BLE). */
function applyDensityMode(mode) {
  document.documentElement.dataset.density = mode;
}
function setDensityMode(mode) {
  setSetting("density", mode);
  applyDensityMode(mode);
  if (state.route === "settings") renderCurrentRoute();
}
function initDensity() {
  applyDensityMode(getSetting("density"));
}

function setupRefreshTimer() {
  if (state.refreshTimer) clearInterval(state.refreshTimer);
  const ms = Number(getSetting("refreshMs"));
  if (ms > 0) {
    state.refreshTimer = setInterval(() => { if (!document.hidden) loadAll(); }, ms);
  }
}

function readUrlParams() {
  const params = new URLSearchParams(window.location.search);
  if (params.has("lan")) setSetting("lanUrl", params.get("lan"));
  if (params.has("wifi")) setSetting("wifiUrl", params.get("wifi"));
}

/* ---------------------------------------------------------------------- *
 * Command palette (Ctrl+K): ricerca globale su pagine, dispositivi, alert
 * ---------------------------------------------------------------------- */

const CMDK_TYPE_LABELS = { page: "Pages", device: "Devices", network: "WiFi networks", ssid: "Requested SSIDs", alert: "Alerts" };
let cmdkResults = [];
let cmdkActiveIndex = 0;

function computeSearchIndex() {
  const items = [];
  for (const r of ROUTES) {
    items.push({ type: "page", label: r.label, sub: r.subtitle, icon: r.icon, action: () => {
      state.wifiTab = "overview"; state.bleTab = "overview";
      const hash = `#/${r.id}`;
      if (window.location.hash === hash) onRouteChange(); else window.location.hash = hash;
    } });
  }
  const seen = new Set();
  const addDevice = (mac, label, sub, icon, extra) => {
    if (!mac || seen.has(mac)) return;
    seen.add(mac);
    items.push({
      type: "device", label, sub, icon,
      // Il nome assegnato (etichetta locale o alias dal file di configurazione del daemon) fa
      // parte delle chiavi di ricerca: cercare "Marco" deve trovare il device chiamato Marco,
      // che è esattamente il motivo per cui gli si dà un nome.
      keywords: `${mac} ${label} ${sub} ${getDeviceLabel(mac).name || ""} ${daemonDeviceAlias(mac)} ${extra || ""}`,
      action: () => goToDevice(mac),
    });
  };

  for (const d of latestLanByMac(state.lanRows)) {
    addDevice(d.mac, displayName(d.mac, d.hostname || d.mac), `${d.ip} · ${d.vendor || "unknown vendor"}`, "monitor",
      `${d.ip} ${d.hostname || ""} ${d.vendor || ""}`);
  }
  for (const e of computeWifiDeviceOverview()) {
    addDevice(e.mac, displayName(e.mac, e.mac), `WiFi device · ${e.vendor || "unknown vendor"}`, "wifi", e.vendor);
  }
  for (const e of computeBleDeviceOverview(state.bleRows)) {
    addDevice(e.mac, displayName(e.mac, e.name || e.mac), `BLE device · ${e.manufacturer || "unknown manufacturer"}`, "bluetooth",
      `${e.name || ""} ${e.manufacturer || ""} ${e.deviceType || ""}`);
  }

  for (const net of computeWifiApOverview()) {
    items.push({
      type: "network", label: net.label, sub: `${net.bssid} · channel ${net.channel ?? "?"} · ${WIFI_SECURITY_META[net.security]?.label || "Unknown"}`,
      icon: "wifi", keywords: `${net.label} ${net.bssid} ${net.vendor || ""} ${net.security}`,
      action: () => goToNetwork(net.bssid),
    });
  }
  for (const e of computeWifiSsidOverview(state.wifiRows)) {
    items.push({
      type: "ssid", label: e.key, sub: `requested by ${e.macs.size} device(s) in probe requests`,
      icon: "wifi", keywords: e.key,
      action: () => navigateToWifiSection("ssid"),
    });
  }

  for (const a of computeAlerts().slice(0, 100)) {
    items.push({
      type: "alert", label: a.title, sub: a.desc, icon: a.icon,
      keywords: `${a.title} ${a.desc} ${a.mac || ""} ${a.mac ? displayName(a.mac, "") : ""}`,
      action: () => { window.location.hash = "#/alerts"; },
    });
  }
  return items;
}

function openCmdk() {
  state.cmdkOpen = true;
  document.getElementById("cmdk-overlay").classList.remove("hidden");
  const input = document.getElementById("cmdk-input");
  input.value = "";
  renderCmdkResults("");
  setTimeout(() => input.focus(), 0);
}
function closeCmdk() {
  state.cmdkOpen = false;
  document.getElementById("cmdk-overlay").classList.add("hidden");
}

function highlightCmdkIndex(idx) {
  const items = document.querySelectorAll(".cmdk-item");
  items.forEach((it, i) => it.classList.toggle("active", i === idx));
  cmdkActiveIndex = idx;
  items[idx]?.scrollIntoView({ block: "nearest" });
}

function renderCmdkResults(query) {
  const q = query.trim().toLowerCase();
  const index = computeSearchIndex();
  cmdkResults = !q
    ? index.filter((i) => i.type === "page")
    : index.filter((i) => `${i.label} ${i.sub || ""} ${i.keywords || ""}`.toLowerCase().includes(q)).slice(0, 30);

  const el = document.getElementById("cmdk-results");
  if (!cmdkResults.length) { el.innerHTML = '<p class="empty-state">No results.</p>'; return; }

  let lastType = null;
  el.innerHTML = cmdkResults.map((r, i) => {
    const groupHeader = r.type !== lastType ? `<div class="cmdk-group">${CMDK_TYPE_LABELS[r.type]}</div>` : "";
    lastType = r.type;
    return `${groupHeader}<button class="cmdk-item" data-idx="${i}">${ICON(r.icon)}<div>
      <div class="cmdk-item-label">${escapeHtml(r.label)}</div>
      ${r.sub ? `<div class="cmdk-item-sub">${escapeHtml(r.sub)}</div>` : ""}
    </div></button>`;
  }).join("");

  el.querySelectorAll(".cmdk-item").forEach((btn) => {
    btn.addEventListener("click", () => { cmdkResults[Number(btn.dataset.idx)].action(); closeCmdk(); });
  });
  highlightCmdkIndex(0);
}

function setupCmdk() {
  document.getElementById("cmdk-open").addEventListener("click", openCmdk);
  document.getElementById("cmdk-overlay").addEventListener("click", (e) => {
    if (e.target.id === "cmdk-overlay") closeCmdk();
  });
  document.getElementById("cmdk-input").addEventListener("input", (e) => renderCmdkResults(e.target.value));
  document.getElementById("cmdk-input").addEventListener("keydown", (e) => {
    if (!cmdkResults.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); highlightCmdkIndex(Math.min(cmdkActiveIndex + 1, cmdkResults.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); highlightCmdkIndex(Math.max(cmdkActiveIndex - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); cmdkResults[cmdkActiveIndex]?.action(); closeCmdk(); }
  });
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openCmdk();
    } else if (e.key === "Escape" && state.cmdkOpen) {
      closeCmdk();
    }
  });
}

/* ---------------------------------------------------------------------- *
 * Init
 * ---------------------------------------------------------------------- */

/** Selettore di periodo in topbar: una sola scelta valida per tutte le pagine, persistita fra un
 * refresh e l'altro come le altre preferenze di vista. */
function initTimeRange() {
  const el = document.getElementById("time-range");
  el.innerHTML = TIME_RANGES.map((r) => `<option value="${r.id}">${escapeHtml(r.label)}</option>`).join("");
  el.value = state.timeRange;
  el.addEventListener("change", () => {
    state.timeRange = el.value;
    savePersistedUiState({ timeRange: el.value });
    renderCurrentRoute();
  });
}

/**
 * Registra il service worker e mostra il badge quando l'app gira installata. Senza, le notifiche
 * desktop funzionano solo con la scheda aperta (come dice l'Aiuto) e la dashboard non si apre
 * affatto se il Pi non risponde. Fallisce in silenzio dove i service worker non sono disponibili
 * (pagina aperta da file://, browser senza supporto): sono un miglioramento, non un requisito.
 */
function initPwa() {
  if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone) {
    const badge = document.getElementById("pwa-badge");
    badge.innerHTML = `${ICON("home")}installed`;
    badge.classList.remove("hidden");
  }
  if (!("serviceWorker" in navigator) || location.protocol === "file:") return;
  navigator.serviceWorker.register("sw.js").catch(() => {
    // Registrazione fallita (contesto non sicuro, permessi, ...): l'app funziona lo stesso.
  });
}

function init() {
  readUrlParams();
  initTheme();
  initDensity();
  document.getElementById("icon-brand").innerHTML = ICON("wifi");
  document.getElementById("icon-refresh").innerHTML = ICON("refresh");
  document.getElementById("icon-cmdk-open").innerHTML = ICON("search");
  document.getElementById("icon-cmdk").innerHTML = ICON("search");

  renderSidebarNav();
  initSidebarCollapse();
  initMobileNav();
  initTimeRange();
  initPwa();
  setupTopbar();
  setupCmdk();
  updateStatusPill();

  document.addEventListener("click", (e) => {
    if (state.openMenuMac && !e.target.closest(".row-menu")) { state.openMenuMac = null; renderCurrentRoute(); }
    if (!e.target.closest(".host-columns-wrap")) document.getElementById("host-columns-menu")?.classList.add("hidden");
  });
  window.addEventListener("hashchange", onRouteChange);

  onRouteChange();
  setupRefreshTimer();
  loadAll();
}

document.addEventListener("DOMContentLoaded", init);
