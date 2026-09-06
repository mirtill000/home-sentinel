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
};

function ICON(name) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICON_PATHS[name] || ""}</svg>`;
}

/* ---------------------------------------------------------------------- *
 * Settings (persisted in localStorage)
 * ---------------------------------------------------------------------- */

const SETTINGS_KEYS = {
  lanUrl: "hs.lanUrl", wifiUrl: "hs.wifiUrl", bleUrl: "hs.bleUrl", refreshMs: "hs.refreshMs", theme: "hs.theme",
  netLabel: "hs.net.label", netGateway: "hs.net.gateway",
  alertsUrl: "hs.alertsUrl", fingerprintUrl: "hs.fingerprintUrl", wifiTrafficUrl: "hs.wifiTrafficUrl",
  wifiNetworksUrl: "hs.wifiNetworksUrl",
  dhcpEventsUrl: "hs.dhcpEventsUrl", osFingerprintUrl: "hs.osFingerprintUrl", dhcpLeasesUrl: "hs.dhcpLeasesUrl",
  trendDailyUrl: "hs.trendDailyUrl",
  bleIdentityLinksUrl: "hs.bleIdentityLinksUrl", blePresenceUrl: "hs.blePresenceUrl",
  deepScanUrl: "hs.deepScanUrl", handshakeUrl: "hs.handshakeUrl", wifiPresenceUrl: "hs.wifiPresenceUrl",
};
const SETTINGS_DEFAULTS = {
  lanUrl: "lan_discovery.jsonl", wifiUrl: "wifi_probes.jsonl", bleUrl: "ble_discovery.jsonl", refreshMs: "30000", theme: "dark",
  netLabel: "", netGateway: "",
  alertsUrl: "alerts_detection.jsonl", fingerprintUrl: "fingerprint_discovery.jsonl", wifiTrafficUrl: "wifi_traffic.jsonl",
  wifiNetworksUrl: "wifi_networks.jsonl",
  dhcpEventsUrl: "dhcp_events.jsonl", osFingerprintUrl: "os_fingerprint.jsonl", dhcpLeasesUrl: "dhcp_leases.jsonl",
  trendDailyUrl: "trend_daily.jsonl",
  bleIdentityLinksUrl: "ble_identity_links.jsonl", blePresenceUrl: "ble_presence.jsonl",
  deepScanUrl: "deep_port_scan.jsonl", handshakeUrl: "handshake_captures.jsonl",
  wifiPresenceUrl: "wifi_presence.jsonl",
};

function getSetting(key) {
  const raw = localStorage.getItem(SETTINGS_KEYS[key]);
  return raw === null ? SETTINGS_DEFAULTS[key] : raw;
}
function setSetting(key, value) {
  localStorage.setItem(SETTINGS_KEYS[key], value);
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
  lanRows: [],
  wifiRows: [],
  bleRows: [],
  alertsRows: [],
  fingerprintRows: [],
  wifiTrafficRows: [],
  wifiNetworksRows: [],
  dhcpEventsRows: [],
  osFingerprintRows: [],
  dhcpLeasesRows: [],
  trendDailyRows: [],
  bleIdentityLinksRows: [],
  blePresenceRows: [],
  deepScanRows: [],
  handshakeRows: [],
  wifiPresenceRows: [],
  lanFile: null,
  wifiFile: null,
  bleFile: null,
  lanSort: { key: "last_seen", dir: -1 },
  wifiSort: { key: "timestamp", dir: -1 },
  bleSort: { key: "timestamp", dir: -1 },
  route: "dashboard",
  refreshTimer: null,
  lastFetchOk: null,
  openMenuMac: null,
  expandedMac: null,
  alertsFilter: "active",
  alertsTypeFilter: "all",
  dismissedAlerts: new Set(JSON.parse(localStorage.getItem(DISMISSED_KEY) || "[]")),
  sourceStatus: {},
  cmdkOpen: false,
  trendRangeDays: 7,
  deviceProfileMac: null,
  timelineKindFilter: "all",
  radarFilters: { network: true, probe: true, ap: true, ble: true },
  hostFilters: { type: "all", vendor: "all", risk: "all", trust: "all", ports: "all" },
  hostStaleOnly: false,
  hostGroupByIdentity: false,
  hostSelectedMacs: new Set(),
  wifiSsidExpanded: null,
  wifiApFilters: { security: "all", band: "all" },
  wifiFocusSection: null,
  pageScrollTarget: null,
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

  try {
    if (state.lanFile) {
      state.lanRows = await readJsonlFile(state.lanFile);
      state.sourceStatus.lan = { ok: true, count: state.lanRows.length, truncated: false };
    } else {
      const r = await fetchJsonl(getSetting("lanUrl"));
      state.lanRows = r.rows;
      state.sourceStatus.lan = { ok: true, count: r.rows.length, truncated: r.truncated, totalBytes: r.totalBytes };
    }
  } catch (err) {
    errors.push(`LAN: ${err.message}`);
    state.lanRows = state.lanRows || [];
    state.sourceStatus.lan = { ok: false, count: 0, truncated: false };
  }

  try {
    if (state.wifiFile) {
      state.wifiRows = await readJsonlFile(state.wifiFile);
      state.sourceStatus.wifi = { ok: true, count: state.wifiRows.length, truncated: false };
    } else {
      const r = await fetchJsonl(getSetting("wifiUrl"));
      state.wifiRows = r.rows;
      state.sourceStatus.wifi = { ok: true, count: r.rows.length, truncated: r.truncated, totalBytes: r.totalBytes };
    }
  } catch (err) {
    errors.push(`WiFi: ${err.message}`);
    state.wifiRows = state.wifiRows || [];
    state.sourceStatus.wifi = { ok: false, count: 0, truncated: false };
  }

  try {
    if (state.bleFile) {
      state.bleRows = await readJsonlFile(state.bleFile);
      state.sourceStatus.ble = { ok: true, count: state.bleRows.length, truncated: false };
    } else {
      const r = await fetchJsonl(getSetting("bleUrl"));
      state.bleRows = r.rows;
      state.sourceStatus.ble = { ok: true, count: r.rows.length, truncated: r.truncated, totalBytes: r.totalBytes };
    }
  } catch (err) {
    errors.push(`BLE: ${err.message}`);
    state.bleRows = state.bleRows || [];
    state.sourceStatus.ble = { ok: false, count: 0, truncated: false };
  }

  // Alert/fingerprint sono generati dai moduli di detection opzionali del
  // daemon: possono legittimamente non esistere ancora (feature non
  // abilitata, o versione del daemon precedente alla loro introduzione),
  // quindi un fallimento qui resta silenzioso invece di comparire come
  // errore di caricamento (ma viene comunque tracciato per il pannello
  // "Stato moduli" in Impostazioni).
  try {
    const r = await fetchJsonl(getSetting("alertsUrl"));
    state.alertsRows = r.rows;
    state.sourceStatus.alerts = { ok: true, count: r.rows.length, truncated: r.truncated, totalBytes: r.totalBytes };
  } catch {
    state.alertsRows = state.alertsRows || [];
    state.sourceStatus.alerts = { ok: false, count: 0, truncated: false };
  }
  try {
    const r = await fetchJsonl(getSetting("fingerprintUrl"));
    state.fingerprintRows = r.rows;
    state.sourceStatus.fingerprint = { ok: true, count: r.rows.length, truncated: r.truncated, totalBytes: r.totalBytes };
  } catch {
    state.fingerprintRows = state.fingerprintRows || [];
    state.sourceStatus.fingerprint = { ok: false, count: 0, truncated: false };
  }
  try {
    const r = await fetchJsonl(getSetting("wifiTrafficUrl"));
    state.wifiTrafficRows = r.rows;
    state.sourceStatus.wifiTraffic = { ok: true, count: r.rows.length, truncated: r.truncated, totalBytes: r.totalBytes };
  } catch {
    state.wifiTrafficRows = state.wifiTrafficRows || [];
    state.sourceStatus.wifiTraffic = { ok: false, count: 0, truncated: false };
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

  state.lastFetchOk = errors.length === 0;
  if (errors.length) showError(errors.join(" — "));
  document.getElementById("last-updated").textContent = new Date().toLocaleTimeString("en-GB");

  updateStatusPill();
  checkAlertNotifications();
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
  const t = Date.parse(value);
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

function within24h(ts) {
  return ts !== null && ts >= Date.now() - 24 * 3600 * 1000;
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

function goToDevice(mac) {
  window.location.hash = `#/device/${encodeURIComponent(mac)}`;
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

/** Nome da mostrare per un device: personalizzato se impostato (proprio o ereditato dall'identità collegata), altrimenti il fallback (hostname/MAC). */
function displayName(mac, fallback) {
  const label = getDeviceLabel(mac);
  return label.name || fallback;
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

function renderTrend(container) {
  const range = state.trendRangeDays || 7;
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
    <div class="page-section">
      <div class="filter-row" style="margin:0;">
        <select class="select-control" id="trend-range">
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
        </select>
      </div>
    </div>
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

  document.getElementById("trend-range").value = String(range);
  document.getElementById("trend-range").addEventListener("change", (e) => {
    state.trendRangeDays = Number(e.target.value);
    renderTrend(container);
  });
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

function kpiTile({ label, icon, tone, value, valueSuffix, sub, subTone, sparkValues, sparkColor }) {
  return `<div class="kpi-tile">
    <div class="kpi-top">
      <span class="kpi-label">${escapeHtml(label)}</span>
      <span class="kpi-icon tone-${tone}">${ICON(icon)}</span>
    </div>
    <div class="kpi-value">${value}${valueSuffix ? ` <small>${escapeHtml(valueSuffix)}</small>` : ""}</div>
    ${sub ? `<div class="kpi-sub ${subTone ? "tone-" + subTone : ""}">${escapeHtml(sub)}</div>` : ""}
    ${sparkValues && sparkValues.length ? `<div class="kpi-spark">${sparklineSvg(sparkValues, sparkColor)}</div>` : ""}
  </div>`;
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

/** Grafico a barre orizzontali per una classifica label -> valore (già ordinata/limitata dal chiamante). */
function renderHBarChart(container, entries, color) {
  container.innerHTML = "";
  if (!entries.length) return; // CSS :empty mostra il placeholder

  const max = Math.max(...entries.map(([, value]) => value), 1);
  for (const [label, value] of entries) {
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
    fill.style.background = color;
    attachTooltip(fill, `${label}: ${value}`);
    track.appendChild(fill);

    const val = document.createElement("span");
    val.className = "hbar-value";
    val.textContent = value;

    row.append(name, track, val);
    container.appendChild(row);
  }
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
      <td>${formatTs(new Date(e.lastTs).toISOString())}</td>
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
              <td>${formatTs(new Date(d.lastTs).toISOString())}</td>
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
        <div class="search-input">${ICON("search")}<input type="text" id="wifi-devices-search" placeholder="Search by MAC or vendor…"></div>
      </div>
    </div>
    <div class="table-scroll">
      <table class="data-table">
        <thead><tr><th>Device</th><th>Vendor</th><th>Probes</th><th>Average signal</th><th>Last seen</th></tr></thead>
        <tbody id="wifi-devices-body"></tbody>
      </table>
      <p class="empty-state hidden" id="wifi-devices-empty">No external WiFi devices detected — check the data source in Settings.</p>
      <div id="wifi-devices-pagination"></div>
    </div>
  `;
  document.getElementById("wifi-devices-search").addEventListener("input", () => { getPagination("wifi-devices").page = 1; renderWifiDevicesTableBody(); });
  renderWifiDevicesTableBody();
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
    <td>${formatTs(new Date(e.lastTs).toISOString())}</td>
  </tr>`).join("");
  document.getElementById("wifi-devices-empty").classList.toggle("hidden", rows.length > 0);
  document.getElementById("wifi-devices-pagination").innerHTML = rows.length ? paginationHtml("wifi-devices", info) : "";
  wirePagination(document.getElementById("wifi-devices-pagination"), "wifi-devices", renderWifiDevicesTableBody);

  body.querySelectorAll("[data-mac-link]").forEach((btn) => {
    btn.addEventListener("click", () => goToDevice(btn.dataset.macLink));
  });
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
    <td>${escapeHtml(e.label)}</td>
    <td class="mono">${escapeHtml(e.bssid)}</td>
    <td>${escapeHtml(e.vendor) || '<span class="muted">—</span>'}</td>
    <td>${wifiSecurityBadgeHtml(e.security)}</td>
    <td>${e.channel ?? '<span class="muted">—</span>'}</td>
    <td>${e.sightings}</td>
    <td>${e.avgRssi === null ? '<span class="muted">—</span>' : `${e.avgRssi} dBm`}</td>
    <td>${formatTs(new Date(e.lastTs).toISOString())}</td>
  </tr>`).join("");
  document.getElementById("wifi-aps-empty").classList.toggle("hidden", rows.length > 0);
  document.getElementById("wifi-aps-pagination").innerHTML = rows.length ? paginationHtml("wifi-aps", info) : "";
  wirePagination(document.getElementById("wifi-aps-pagination"), "wifi-aps", renderWifiApsTableBody);
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

  return events.sort((a, b) => b.ts - a.ts);
}

const TIMELINE_KIND_LABELS = { lan: "Devices (new/offline)", alert: "Alert", fingerprint: "Fingerprint" };

function timelineItemHtml(e) {
  return `<div class="timeline-item">
    <span class="timeline-icon tone-${e.tone}">${ICON(e.icon)}</span>
    <div class="timeline-body">
      <div class="timeline-title">${escapeHtml(e.title)}</div>
      <div class="timeline-desc">${escapeHtml(e.desc)}${e.mac ? ` — <button class="link-cell" data-mac-link="${escapeHtml(e.mac)}">${escapeHtml(e.mac)}</button>` : ""}</div>
      <div class="timeline-ts">${formatTs(new Date(e.ts).toISOString())}</div>
    </div>
  </div>`;
}

function renderTimeline(container) {
  const events = computeTimeline().slice(0, 300);
  container.innerHTML = `
    <div class="card">
      <div class="card-head">
        <h2>Event timeline</h2>
        <select class="select-control" id="timeline-kind-filter">
          <option value="all">All events</option>
          <option value="lan">${TIMELINE_KIND_LABELS.lan}</option>
          <option value="alert">${TIMELINE_KIND_LABELS.alert}</option>
          <option value="fingerprint">${TIMELINE_KIND_LABELS.fingerprint}</option>
        </select>
      </div>
      <div class="timeline" id="timeline-list"></div>
    </div>`;

  document.getElementById("timeline-kind-filter").value = state.timelineKindFilter;
  document.getElementById("timeline-kind-filter").addEventListener("change", (e) => {
    state.timelineKindFilter = e.target.value;
    renderList();
  });
  renderList();

  function renderList() {
    const list = state.timelineKindFilter === "all" ? events : events.filter((e) => e.kind === state.timelineKindFilter);
    const el = document.getElementById("timeline-list");
    if (!list.length) { el.innerHTML = '<p class="empty-state">No events in this category.</p>'; return; }
    el.innerHTML = list.map(timelineItemHtml).join("");
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
    <div class="table-scroll">
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
      <th data-sort="status">Status</th>
      <th data-sort="ip">IP</th>
      <th data-sort="hostname">Hostname</th>
      <th data-sort="mac">MAC address</th>
      <th data-sort="vendor">Vendor</th>
      <th>Type</th>
      <th>Risk</th>
      <th data-sort="open_ports">Open ports</th>
      ${visibleColumns.has("osGuess") ? "<th>OS guess</th>" : ""}
      ${visibleColumns.has("mdns") ? "<th>mDNS name</th>" : ""}
      ${visibleColumns.has("arp") ? "<th>ARP status</th>" : ""}
      ${visibleColumns.has("uptime") ? "<th>Uptime %</th>" : ""}
      ${visibleColumns.has("traffic") ? "<th>WiFi traffic (24h)</th>" : ""}
      <th data-sort="last_seen">Last seen</th>
      <th></th>
    </tr>`;
    document.getElementById("host-thead").querySelectorAll("th[data-sort]").forEach((th) => {
      th.addEventListener("click", () => {
        const key = th.dataset.sort;
        if (state.lanSort.key === key) state.lanSort.dir *= -1;
        else { state.lanSort.key = key; state.lanSort.dir = 1; }
        renderHostTable();
      });
    });
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
      for (const mac of state.hostSelectedMacs) setDeviceLabel(mac, { trusted: true });
      renderHostTable();
    });
    document.getElementById("host-bulk-untrust").addEventListener("click", () => {
      for (const mac of state.hostSelectedMacs) setDeviceLabel(mac, { trusted: false });
      renderHostTable();
    });
    document.getElementById("host-bulk-export").addEventListener("click", () => {
      const rows = latestLanByMac(state.lanRows).filter((d) => state.hostSelectedMacs.has(d.mac)).map(stripInternal);
      downloadBlob(toCsvBlob(rows), "hosts_selection.csv");
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
    <div class="table-scroll">
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
  container.querySelectorAll("#wifi-table thead th[data-sort]").forEach((th) => {
    th.addEventListener("click", () => {
      const key = th.dataset.sort;
      if (state.wifiSort.key === key) state.wifiSort.dir *= -1;
      else { state.wifiSort.key = key; state.wifiSort.dir = 1; }
      renderWifiTableBody();
    });
  });
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

/** Etichetta leggibile per ogni sezione "focalizzabile" della pagina WiFi (vedi wifiFocusSection). */
const WIFI_FOCUS_LABELS = { ssid: "SSIDs requested", devices: "Nearby WiFi devices", aps: "Adjacent networks" };

function renderWifiPage(container) {
  const focus = state.wifiFocusSection; // null (tutta la pagina) oppure "ssid" | "devices" | "aps"
  const showAll = !focus;
  const wifiLast24h = state.wifiRows.filter((r) => within24h(parseTs(r.timestamp)));
  const wifiStatus = state.sourceStatus.wifi;

  container.innerHTML = `
    ${focus ? `
      <div class="page-section focus-banner">
        ${ICON("layers")}
        <span>Showing only <strong>${escapeHtml(WIFI_FOCUS_LABELS[focus])}</strong>, as linked from the Dashboard.</span>
        <button type="button" class="dintorni-panel-more" id="wifi-focus-clear">Show all WiFi data</button>
      </div>
    ` : ""}
    ${showAll && wifiStatus?.truncated ? `
      <div class="page-section info-banner">
        ${ICON("layers")}
        <span>WiFi probe log at ${formatBytes(wifiStatus.totalBytes)}: to stay fast the dashboard only loads the last ${formatBytes(TAIL_FETCH_BYTES)} (the most recent). The views below — including the 24h ones — are correct, but "Trend" over 30 days may not cover the whole period. Set <code>--max-log-size-mb</code>/<code>--log-backup-count</code> on the daemon to keep the file from growing unbounded.</span>
      </div>
    ` : ""}
    ${showAll ? `
      <div class="page-section kpi-row">
        ${(() => {
          const nets = computeWifiApOverview();
          const openCount = nets.filter((e) => e.security === "open").length;
          const wpa23Count = nets.filter((e) => e.security === "wpa2_wpa3").length;
          const handshakeCount = state.handshakeRows.length;
          return `
            ${kpiTile({
              label: "Open networks", icon: "shield", tone: openCount ? "critical" : "good",
              value: openCount, sub: "No encryption at all", subTone: openCount ? "critical" : "good",
            })}
            ${kpiTile({
              label: "WPA2/WPA3 networks", icon: "shield", tone: "good",
              value: wpa23Count, sub: `${nets.length} networks detected total`,
            })}
            ${kpiTile({
              label: "Handshake captures", icon: "wifi", tone: handshakeCount ? "good" : "blue",
              value: handshakeCount,
              sub: handshakeCount ? "for the home networks in --home-ssid" : "None captured yet (--capture-handshakes)",
            })}
          `;
        })()}
      </div>
    ` : ""}

    ${showAll || focus === "aps" ? `<div class="page-section card" id="wifi-aps-mount"></div>` : ""}

    ${showAll ? `
      <div class="page-section grid-2">
        <div class="card">
          <div class="card-head"><h2>Probe activity <span class="card-sub">last 24h</span></h2></div>
          <div class="bar-chart" id="chart-wifi-activity" data-empty="No data"></div>
        </div>
        <div class="card">
          <div class="card-head"><h2>WiFi channels</h2><span class="card-sub">probes per channel (24h)</span></div>
          <div class="hbar-chart" id="chart-wifi-channel" data-empty="No data"></div>
        </div>
      </div>
    ` : ""}

    ${showAll || focus === "ssid" ? `<div class="page-section card" id="wifi-ssid-mount"></div>` : ""}

    ${showAll || focus === "devices" ? `<div class="page-section card" id="wifi-devices-mount"></div>` : ""}

    ${showAll ? `<div class="page-section card" id="wifi-presence-mount"></div>` : ""}

    ${showAll ? `<div class="page-section card" id="wifi-handshakes-mount"></div>` : ""}

    ${showAll ? `<div class="page-section card" id="wifi-section-mount"></div>` : ""}
  `;

  if (showAll || focus === "aps") renderWifiApsTable(document.getElementById("wifi-aps-mount"));
  if (showAll) {
    renderBarChart(document.getElementById("chart-wifi-activity"), hourlyCounts(state.wifiRows));
    renderHBarChart(document.getElementById("chart-wifi-channel"), wifiChannelSegments(wifiLast24h).map(([ch, n]) => [`Channel ${ch}`, n]), "var(--cat-3)");
    renderPresenceCard(document.getElementById("wifi-presence-mount"), state.wifiPresenceRows, "--wifi-home-macs");
    renderHandshakeCapturesTable(document.getElementById("wifi-handshakes-mount"));
    renderWifiSection(document.getElementById("wifi-section-mount"));
  }
  if (showAll || focus === "ssid") renderWifiSsidTable(document.getElementById("wifi-ssid-mount"));
  if (showAll || focus === "devices") renderWifiDevicesTable(document.getElementById("wifi-devices-mount"));

  document.getElementById("wifi-focus-clear")?.addEventListener("click", () => {
    state.wifiFocusSection = null;
    renderCurrentRoute();
  });
}

/**
 * Handshake EAPOL (WPA/WPA2) catturati passivamente per le reti "di casa" (--capture-handshakes,
 * richiede --home-ssid): solo i metadati sono qui, il file .pcap vero e proprio resta sul
 * filesystem del Pi (percorso mostrato) — va prelevato via scp/sftp per un audit offline con
 * strumenti come aircrack-ng/hashcat, la dashboard non lo apre né lo scarica.
 */
function renderHandshakeCapturesTable(container) {
  const rows = state.handshakeRows.slice().sort((a, b) => (parseTs(b.timestamp) || 0) - (parseTs(a.timestamp) || 0));
  container.innerHTML = `
    <div class="card-head">
      <h2>Handshake captures</h2>
      <span class="card-sub">passive WPA/WPA2 4-way handshake capture for the home networks in <code>--home-ssid</code>, for offline password-strength auditing (aircrack-ng/hashcat) — no password is ever stored in clear text, and no frame is ever sent to trigger this</span>
    </div>
    <div class="table-scroll">
      <table class="data-table">
        <thead><tr><th>Timestamp</th><th>SSID</th><th>BSSID</th><th>Station</th><th>Messages</th><th>Pcap file</th></tr></thead>
        <tbody>${rows.map((r) => `<tr>
          <td>${formatTs(r.timestamp)}</td>
          <td>${escapeHtml(r.ssid) || '<span class="muted">—</span>'}</td>
          <td class="mono">${escapeHtml(r.bssid)}</td>
          <td class="mono">${escapeHtml(r.sta_mac)}</td>
          <td>${Array.isArray(r.messages) && r.messages.length ? `${r.messages.length}/4 (${r.messages.join(",")})` : `${r.frame_count || 0} frame`}</td>
          <td class="mono" title="${escapeHtml(r.pcap_path)}">${escapeHtml((r.pcap_path || "").split("/").pop())}</td>
        </tr>`).join("") || '<tr><td colspan="6"><p class="empty-state">No handshake captured yet — enable <code>--capture-handshakes</code> (requires <code>--home-ssid</code>) on the daemon, or check the data source in Settings.</p></td></tr>'}</tbody>
      </table>
    </div>`;
}

/* ---------------------------------------------------------------------- *
 * BLE page
 * ---------------------------------------------------------------------- */

function renderBlePage(container) {
  const bleLast24h = state.bleRows.filter((r) => within24h(parseTs(r.timestamp)));
  const distinctMacs = new Set(bleLast24h.map((r) => r.mac));
  const named = bleLast24h.filter((r) => r.name && r.name.trim());
  const avg = avgRssi(bleLast24h);

  container.innerHTML = `
    <div class="page-section kpi-row">
      ${kpiTile({
        label: "BLE advertisements (24h)", icon: "bluetooth", tone: "orange",
        value: bleLast24h.length, sub: `${distinctMacs.size} distinct MACs`,
        sparkValues: hourlyCounts(state.bleRows), sparkColor: "var(--cat-2)",
      })}
      ${kpiTile({
        label: "With advertised name", icon: "eye", tone: "orange",
        value: named.length,
        sub: bleLast24h.length ? `${Math.round((named.length / bleLast24h.length) * 100)}% of total (24h)` : "No data",
      })}
      ${kpiTile({
        label: "Average RSSI (24h)", icon: "wifi", tone: "orange",
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
        });
      })()}
    </div>

    <div class="page-section card">
      <div class="card-head"><h2>BLE activity <span class="card-sub">last 24h</span></h2></div>
      <div class="bar-chart" id="chart-ble-activity" data-empty="No data"></div>
    </div>

    <div class="page-section card" id="ble-devices-mount"></div>

    <div class="page-section card" id="ble-presence-mount"></div>

    <div class="page-section card" id="ble-section-mount"></div>
  `;

  renderBarChart(document.getElementById("chart-ble-activity"), hourlyCounts(state.bleRows));
  renderBleDevicesTable(document.getElementById("ble-devices-mount"));
  renderPresenceCard(document.getElementById("ble-presence-mount"), state.blePresenceRows, "--ble-home-macs");
  renderBleSection(document.getElementById("ble-section-mount"));
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
          <thead><tr><th>Timestamp</th><th>Device</th><th>Event</th><th>Duration</th></tr></thead>
          <tbody>${sorted.slice(0, 30).map((r) => `<tr>
            <td>${formatTs(r.timestamp)}</td>
            <td><button class="link-cell" data-mac-link="${escapeHtml(r.mac)}">${escapeHtml(displayName(r.mac, r.mac))}</button></td>
            <td>${r.event === "arrived" ? '<span class="badge status-online"><span class="dot"></span>Arrived</span>' : '<span class="badge status-offline"><span class="dot"></span>Left</span>'}</td>
            <td>${typeof r.duration_s === "number" ? formatDuration(r.duration_s * 1000) : '<span class="muted">—</span>'}</td>
          </tr>`).join("")}</tbody>
        </table>
      </div>
    ` : `<p class="empty-state">No presence events — configure <code>${flagName}</code> on the daemon to enable this.</p>`}
  `;
  container.querySelectorAll("[data-mac-link]").forEach((btn) => {
    btn.addEventListener("click", () => goToDevice(btn.dataset.macLink));
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
      </div>
    </div>
    <div class="table-scroll">
      <table class="data-table">
        <thead><tr><th>Device</th><th>Type</th><th>Manufacturer</th><th>Average signal</th><th>Sightings</th><th>Last seen</th></tr></thead>
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
    <td>${formatTs(new Date(e.lastTs).toISOString())}</td>
  </tr>`).join("");
  document.getElementById("ble-devices-empty").classList.toggle("hidden", rows.length > 0);
  document.getElementById("ble-devices-pagination").innerHTML = rows.length ? paginationHtml("ble-devices", info) : "";
  wirePagination(document.getElementById("ble-devices-pagination"), "ble-devices", renderBleDevicesTableBody);
  body.querySelectorAll("[data-mac-link]").forEach((btn) => {
    btn.addEventListener("click", () => goToDevice(btn.dataset.macLink));
  });
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
    <div class="table-scroll">
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
  container.querySelectorAll("#ble-table thead th[data-sort]").forEach((th) => {
    th.addEventListener("click", () => {
      const key = th.dataset.sort;
      if (state.bleSort.key === key) state.bleSort.dir *= -1;
      else { state.bleSort.key = key; state.bleSort.dir = 1; }
      renderBleTableBody();
    });
  });
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

function renderHouseRadarPage(container) {
  container.innerHTML = `
    <div class="page-section kpi-row">
      ${topKpiRowHtml()}
    </div>

    <div class="page-section card">
      <div class="card-head">
        <h2>Nearby</h2>
        <span class="card-sub">SSIDs requested, adjacent networks, and WiFi/Bluetooth devices detected in the last 24h, by signal strength</span>
      </div>
      <div class="radar-legend" id="radar-legend"></div>
      <div class="dintorni-map-wrap" id="radar-mount"></div>
      <div class="dintorni-panels-grid" id="dintorni-panels"></div>
    </div>
  `;
  renderHouseRadarLegend(document.getElementById("radar-legend"));
  renderDintorniAll();
}

function renderDintorniAll() {
  const data = computeHouseRadar();
  renderDintorniPanels(data);
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
      renderDintorniAll();
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

function renderDintorniPanels(data) {
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
      <div class="dintorni-panel-head" style="color:var(--brand)">${ICON("monitor")}<span>Host summary</span></div>
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
      emptyText: "No SSIDs requested in probes in the last 24h.",
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
      emptyText: "No probes detected in the last 24h.",
      wifiSection: "devices",
      rowHtml: (e) => `<button type="button" class="dintorni-row dintorni-row-clickable" data-mac-link="${escapeHtml(e.mac)}">
        <span class="dot" style="background:${signalTierColor(e.avgRssi)}"></span>
        <span class="dintorni-row-name mono" title="${escapeHtml(e.label)}">${escapeHtml(e.label)}</span>
        <span class="dintorni-row-meta">${formatRelativeTime(e.lastTs)}</span>
      </button>`,
    }) : "",
    state.radarFilters.ap ? dintorniPanelHtml({
      title: "Adjacent networks", icon: "wifi", color: RADAR_CATEGORY_META.ap.color,
      rows: data.aps,
      emptyText: "No WiFi network beacons detected in the last 24h.",
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
      emptyText: "No Bluetooth devices detected in the last 24h.",
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
    <p class="empty-state">No data in the last 24h for the selected categories.</p>`;
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
    const tip = e.category === "network"
      ? `${e.label} — SSID requested by ${e.macs.size} devices — ${e.avgRssi} dBm — ${formatRelativeTime(e.lastTs)}`
      : e.category === "ap"
      ? `${e.label} — BSSID ${e.bssid} — channel ${e.channel ?? "unknown"} — ${e.avgRssi} dBm — ${formatRelativeTime(e.lastTs)}`
      : `${e.label} — ${e.avgRssi} dBm — ${e.sightings} sightings — ${formatRelativeTime(e.lastTs)}`;

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

/** Ultimo stato presente/assente per ogni MAC "di casa" (--ble-home-macs e/o --wifi-home-macs)
 * visto in ble_presence.jsonl/wifi_presence.jsonl, e quanti risultano attualmente presenti — le
 * due sorgenti sono unite perché per l'utente "chi c'è in casa" è un unico concetto, a prescindere
 * da quale radio l'abbia rilevato. La dashboard non conosce quali MAC sono stati configurati sul
 * daemon: usa semplicemente l'insieme dei MAC già comparsi in uno dei due log. */
function computePresenceSummary(rows) {
  const latestByMac = new Map();
  for (const r of rows) {
    const ts = parseTs(r.timestamp) || 0;
    const prev = latestByMac.get(r.mac);
    if (!prev || ts > prev.ts) latestByMac.set(r.mac, { event: r.event, ts });
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
  const presence = computePresenceSummary([...state.blePresenceRows, ...state.wifiPresenceRows]);

  return `
    ${kpiTile({
      label: "Active hosts", icon: "monitor", tone: "good",
      value: online, valueSuffix: `/ ${total}`,
      sub: `${total ? Math.round((online / total) * 100) : 0}% active`,
      sparkValues: hourlyDistinctMac(state.lanRows.filter((r) => r.status !== "offline")), sparkColor: "var(--status-good)",
    })}
    ${kpiTile({
      label: "Presence", icon: "home", tone: presence.total ? (presence.home ? "good" : "blue") : "blue",
      value: presence.total ? presence.home : "—", valueSuffix: presence.total ? `/ ${presence.total}` : "",
      sub: presence.total ? "home devices present (BLE + WiFi)" : "Configure --ble-home-macs/--wifi-home-macs to enable",
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
  { key: "traffic", label: "WiFi traffic (24h)" },
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
      label: "Total hosts", icon: "monitor", tone: "blue",
      value: total, sub: `${online} online · ${offline} offline`,
    })}
    ${kpiTile({
      label: "New devices", icon: "users", tone: "blue",
      value: newCount, sub: newCount ? "Seen for the first time in this scan" : "None in this scan",
    })}
    ${kpiTile({
      label: "At risk (High/Critical)", icon: "shield", tone: atRisk ? "critical" : "good",
      value: atRisk, sub: `${critical} critical · ${high} high`,
      subTone: atRisk ? "critical" : "good",
    })}
  `;
}

function renderMappa(container) {
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

function renderDeviceProfile(container, mac) {
  const lanCurrent = latestLanByMac(state.lanRows).find((d) => d.mac === mac);
  const history = sightingsForMac(mac);
  const fingerprint = latestFingerprintByMac(state.fingerprintRows).get(mac);
  const wifiHits = state.wifiRows.filter((r) => r.mac === mac).slice().sort((a, b) => (parseTs(b.timestamp) || 0) - (parseTs(a.timestamp) || 0));
  const bleHits = state.bleRows.filter((r) => r.mac === mac).slice().sort((a, b) => (parseTs(b.timestamp) || 0) - (parseTs(a.timestamp) || 0));
  const deviceAlerts = computeAlerts().filter((a) => a.mac === mac);
  const uptimeSummary = computeUptimeSummary(mac);

  const backButton = `<div class="page-section" style="margin-bottom:10px;">
    <button class="btn btn-icon" id="device-back" title="Back to Host">${ICON("arrow-left")}</button>
  </div>`;

  if (!lanCurrent && !history.length && !wifiHits.length && !bleHits.length) {
    container.innerHTML = `${backButton}<div class="card">
      <p class="empty-state">No data for MAC <span class="mono">${escapeHtml(mac)}</span>. It may have never been detected, or no longer appears in the loaded logs.</p>
    </div>`;
    document.getElementById("device-back").addEventListener("click", () => { window.location.hash = "#/host"; });
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
        <span class="card-sub">${uptimeSummary ? `${uptimeSummary.pct}% online since ${formatTs(new Date(uptimeSummary.periodStart).toISOString())} (from the loaded history)` : "Not enough history to reconstruct sessions"}</span>
      </div>
      ${uptimeSummary && uptimeSummary.sessions.length ? `
        <div class="table-scroll">
          <table class="data-table"><thead><tr><th>From</th><th>To</th><th>Duration</th></tr></thead>
          <tbody>${uptimeSummary.sessions.slice().reverse().slice(0, 20).map((s) => `<tr>
            <td>${formatTs(new Date(s.start).toISOString())}</td>
            <td>${s.end !== null ? formatTs(new Date(s.end).toISOString()) : `<span class="badge status-online"><span class="dot"></span>Ongoing</span>`}</td>
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
    <p class="field-hint">MACs in WiFi probes and BLE advertisements are often randomized by modern devices and may not match the LAN interface MAC of the same device: the sections above stay empty in that case, it's not an error.</p>
  `;
  document.getElementById("device-back").addEventListener("click", () => { window.location.hash = "#/host"; });
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

function renderScansioni(container) {
  container.innerHTML = `<div class="page-section card" id="scansioni-mount"></div>`;
  renderScansioniBody(document.getElementById("scansioni-mount"));
}

function renderScansioniBody(container) {
  const cycles = computeScanCycles();
  const info = paginate(cycles, "scansioni");
  container.innerHTML = `
    <div class="card-head"><h2>LAN scan history</h2><span class="card-sub">${cycles.length} cycles reconstructed from the discovery log</span></div>
    <div class="table-scroll">
      <table class="data-table">
        <thead><tr><th>Time</th><th>Devices seen</th><th>New</th><th>Offline</th></tr></thead>
        <tbody>
          ${info.pageRows.map((c) => `<tr>
            <td>${formatTs(new Date(c.startTs).toISOString())}</td>
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
  wirePagination(document.getElementById("scansioni-pagination"), "scansioni", () => renderScansioniBody(container));
}

function alertItemHtml(a) {
  const dismissed = isDismissed(a.id);
  const snoozed = isSnoozed(a.id);
  const identifier = a.mac ? `MAC ${escapeHtml(a.mac)}` : a.ip ? `IP ${escapeHtml(a.ip)}` : null;
  return `<div class="alert-item ${dismissed ? "is-dismissed" : ""} ${snoozed ? "is-snoozed" : ""}">
    <span class="alert-icon sev-${a.severity}">${ICON(a.icon || "alert-triangle")}</span>
    <div class="alert-body">
      <div class="alert-title">
        ${escapeHtml(a.title)}
        ${a.source === "detect" ? `<span class="source-tag">${ICON("shield")}Detected by daemon</span>` : ""}
        ${snoozed ? `<span class="source-tag" title="Snoozed until ${formatTs(new Date(snoozedUntil(a.id)).toISOString())}">${ICON("clock")}Snoozed until ${formatTs(new Date(snoozedUntil(a.id)).toISOString())}</span>` : ""}
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

function renderAvvisi(container) {
  const all = computeAlerts();

  const typesPresent = [...new Set(all.map((a) => a.type).filter(Boolean))]
    .map((type) => ({ type, label: ALERT_TYPE_META[type]?.label || type.replace(/_/g, " ") }))
    .sort((a, b) => a.label.localeCompare(b.label, "en"));
  if (!typesPresent.some((t) => t.type === state.alertsTypeFilter) && state.alertsTypeFilter !== "all") {
    state.alertsTypeFilter = "all"; // the selected type no longer appears among the current alerts
  }

  container.innerHTML = `
    <div class="card">
      <div class="card-head">
        <h2>Alerts</h2>
        <div class="filter-row" style="margin:0;">
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
  renderAlertList();
  renderPresetChips();

  function renderAlertList() {
    let list = all;
    if (state.alertsFilter === "active") list = list.filter((a) => !isDismissed(a.id) && !isSnoozed(a.id));
    if (state.alertsFilter === "snoozed") list = list.filter((a) => isSnoozed(a.id));
    if (state.alertsFilter === "dismissed") list = list.filter((a) => isDismissed(a.id));
    if (state.alertsTypeFilter !== "all") list = list.filter((a) => a.type === state.alertsTypeFilter);
    const el = document.getElementById("alert-list");
    if (!list.length) { el.innerHTML = '<p class="empty-state">No alerts in this category.</p>'; return; }
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

function moduleStatusRow(label, key) {
  const s = state.sourceStatus[key];
  let tone = "muted", text = "Not loaded yet";
  if (s) {
    if (s.ok && s.count > 0) {
      tone = "good";
      text = `Active — ${s.count} rows loaded`;
      if (s.truncated) text += ` (most recent only — ${formatBytes(s.totalBytes)} file, limited to the last ${formatBytes(TAIL_FETCH_BYTES)})`;
    } else if (s.ok && s.count === 0) {
      tone = "warning"; text = "Source reachable, no rows yet";
    } else {
      tone = "muted"; text = "Not detected (file missing or module not active on the daemon)";
    }
  }
  return `<div class="module-status-row">
    <span class="module-status-dot tone-${tone}"></span>
    <div><strong>${escapeHtml(label)}</strong><span>${escapeHtml(text)}</span></div>
  </div>`;
}

function renderImpostazioni(container) {
  const themeMode = getSetting("theme");
  container.innerHTML = `
    <div class="page-section card">
      <div class="card-head"><h2>Module status</h2><span class="card-sub">inferred from the data actually loaded, not from a status endpoint</span></div>
      <div class="module-status-list">
        ${moduleStatusRow("LAN discovery", "lan")}
        ${moduleStatusRow("WiFi probes (--wifi-iface)", "wifi")}
        ${moduleStatusRow("BLE scan (--ble)", "ble")}
        ${moduleStatusRow("Fingerprinting (--fingerprint)", "fingerprint")}
        ${moduleStatusRow("Estimated WiFi traffic", "wifiTraffic")}
        ${moduleStatusRow("Adjacent WiFi networks (beacons)", "wifiNetworks")}
        ${moduleStatusRow("DHCP client discovery (--dhcp-discovery)", "dhcpEvents")}
        ${moduleStatusRow("OS fingerprint (--os-fingerprint)", "osFingerprint")}
        ${moduleStatusRow("DHCP lease cross-check (--dhcp-lease-source)", "dhcpLeases")}
        ${moduleStatusRow("Daily trend rollup (--no-trend-rollup to disable)", "trendDaily")}
        ${moduleStatusRow("BLE identity link suggestions (--no-ble-identity-linking to disable)", "bleIdentityLinks")}
        ${moduleStatusRow("BLE presence tracking (--ble-home-macs)", "blePresence")}
        ${moduleStatusRow("Deep port scan (--deep-port-scan)", "deepScan")}
        ${moduleStatusRow("Handshake capture (--capture-handshakes)", "handshake")}
        ${moduleStatusRow("WiFi presence tracking (--wifi-home-macs)", "wifiPresence")}
        ${moduleStatusRow("Detection alerts", "alerts")}
      </div>
      <p class="field-hint">Missing hosts that a tool like <code>nmap</code> does find? LAN discovery already retries hosts that don't answer the first ARP request (<code>--arp-retries</code>, default 2); two more fallbacks — <code>--icmp-fallback</code> and <code>--tcp-fallback</code> — can be enabled on the daemon for hosts still missing after that. These are daemon flags, not dashboard settings: see the README for details.</p>
    </div>

    <div class="page-section card">
      <div class="card-head"><h2>Data sources</h2></div>
      <div class="settings-grid">
        <div class="field"><label for="set-lan-url">LAN discovery log (.jsonl)</label><input type="text" id="set-lan-url" value="${escapeHtml(getSetting("lanUrl"))}"></div>
        <div class="field"><label for="set-lan-file">Or load a local file</label><input type="file" id="set-lan-file" accept=".jsonl,.ndjson,.json,.txt"></div>
        <div class="field"><label for="set-wifi-url">WiFi probe log (.jsonl)</label><input type="text" id="set-wifi-url" value="${escapeHtml(getSetting("wifiUrl"))}"></div>
        <div class="field"><label for="set-wifi-file">Or load a local file</label><input type="file" id="set-wifi-file" accept=".jsonl,.ndjson,.json,.txt"></div>
        <div class="field"><label for="set-ble-url">BLE scan log (.jsonl)</label><input type="text" id="set-ble-url" value="${escapeHtml(getSetting("bleUrl"))}"></div>
        <div class="field"><label for="set-ble-file">Or load a local file</label><input type="file" id="set-ble-file" accept=".jsonl,.ndjson,.json,.txt"></div>
        <div class="field"><label for="set-alerts-url">Detection alert log (.jsonl)</label><input type="text" id="set-alerts-url" value="${escapeHtml(getSetting("alertsUrl"))}"></div>
        <div class="field"><label for="set-fingerprint-url">Device fingerprint log (.jsonl)</label><input type="text" id="set-fingerprint-url" value="${escapeHtml(getSetting("fingerprintUrl"))}"></div>
        <div class="field"><label for="set-wifi-traffic-url">WiFi traffic log (.jsonl)</label><input type="text" id="set-wifi-traffic-url" value="${escapeHtml(getSetting("wifiTrafficUrl"))}"></div>
        <div class="field"><label for="set-wifi-networks-url">Adjacent WiFi networks log (.jsonl)</label><input type="text" id="set-wifi-networks-url" value="${escapeHtml(getSetting("wifiNetworksUrl"))}"></div>
        <div class="field"><label for="set-dhcp-events-url">DHCP client discovery log (.jsonl)</label><input type="text" id="set-dhcp-events-url" value="${escapeHtml(getSetting("dhcpEventsUrl"))}"></div>
        <div class="field"><label for="set-os-fingerprint-url">OS fingerprint log (.jsonl)</label><input type="text" id="set-os-fingerprint-url" value="${escapeHtml(getSetting("osFingerprintUrl"))}"></div>
        <div class="field"><label for="set-dhcp-leases-url">DHCP lease cross-check log (.jsonl)</label><input type="text" id="set-dhcp-leases-url" value="${escapeHtml(getSetting("dhcpLeasesUrl"))}"></div>
        <div class="field"><label for="set-trend-daily-url">Daily trend rollup log (.jsonl)</label><input type="text" id="set-trend-daily-url" value="${escapeHtml(getSetting("trendDailyUrl"))}"></div>
        <div class="field"><label for="set-ble-identity-links-url">BLE identity link suggestions log (.jsonl)</label><input type="text" id="set-ble-identity-links-url" value="${escapeHtml(getSetting("bleIdentityLinksUrl"))}"></div>
        <div class="field"><label for="set-ble-presence-url">BLE presence log (.jsonl)</label><input type="text" id="set-ble-presence-url" value="${escapeHtml(getSetting("blePresenceUrl"))}"></div>
        <div class="field"><label for="set-deep-scan-url">Deep port scan log (.jsonl)</label><input type="text" id="set-deep-scan-url" value="${escapeHtml(getSetting("deepScanUrl"))}"></div>
        <div class="field"><label for="set-handshake-url">Handshake capture log (.jsonl)</label><input type="text" id="set-handshake-url" value="${escapeHtml(getSetting("handshakeUrl"))}"></div>
        <div class="field"><label for="set-wifi-presence-url">WiFi presence log (.jsonl)</label><input type="text" id="set-wifi-presence-url" value="${escapeHtml(getSetting("wifiPresenceUrl"))}"></div>
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
      <p class="field-hint">If the dashboard is opened as a local file (<code>file://</code>) fetching via URL won't work due to browser security restrictions: use the "load a local file" fields, or serve this folder with <code>python3 -m http.server</code>. With very large logs, 1-5s intervals re-read the whole file every cycle: if you notice slowdowns, increase the interval. The alert/fingerprint/traffic/adjacent-networks logs are optional: if the corresponding detection modules aren't active on the daemon, the missing file doesn't cause errors.</p>
    </div>

    <div class="page-section card">
      <div class="card-head"><h2>Notifications</h2><span class="card-sub">desktop notifications for new critical alerts, while this tab stays open</span></div>
      <div class="settings-grid">
        <div class="field">
          <label>Desktop notifications</label>
          ${typeof Notification === "undefined"
            ? `<p class="field-hint" style="margin:0;">This browser doesn't support the Notifications API.</p>`
            : `<button class="btn ${getNotificationsEnabled() && Notification.permission === "granted" ? "btn-primary" : ""}" id="set-notifications-toggle">
                 ${ICON("bell")}${getNotificationsEnabled() && Notification.permission === "granted" ? "Enabled — disable" : "Enable"}
               </button>`}
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
    </div>
  `;
  document.getElementById("set-refresh").value = getSetting("refreshMs");

  document.getElementById("set-lan-url").addEventListener("change", (e) => { setSetting("lanUrl", e.target.value.trim() || SETTINGS_DEFAULTS.lanUrl); state.lanFile = null; loadAll(); });
  document.getElementById("set-wifi-url").addEventListener("change", (e) => { setSetting("wifiUrl", e.target.value.trim() || SETTINGS_DEFAULTS.wifiUrl); state.wifiFile = null; loadAll(); });
  document.getElementById("set-lan-file").addEventListener("change", (e) => { if (e.target.files[0]) { state.lanFile = e.target.files[0]; loadAll(); } });
  document.getElementById("set-wifi-file").addEventListener("change", (e) => { if (e.target.files[0]) { state.wifiFile = e.target.files[0]; loadAll(); } });
  document.getElementById("set-ble-url").addEventListener("change", (e) => { setSetting("bleUrl", e.target.value.trim() || SETTINGS_DEFAULTS.bleUrl); state.bleFile = null; loadAll(); });
  document.getElementById("set-ble-file").addEventListener("change", (e) => { if (e.target.files[0]) { state.bleFile = e.target.files[0]; loadAll(); } });
  document.getElementById("set-alerts-url").addEventListener("change", (e) => { setSetting("alertsUrl", e.target.value.trim() || SETTINGS_DEFAULTS.alertsUrl); loadAll(); });
  document.getElementById("set-fingerprint-url").addEventListener("change", (e) => { setSetting("fingerprintUrl", e.target.value.trim() || SETTINGS_DEFAULTS.fingerprintUrl); loadAll(); });
  document.getElementById("set-wifi-traffic-url").addEventListener("change", (e) => { setSetting("wifiTrafficUrl", e.target.value.trim() || SETTINGS_DEFAULTS.wifiTrafficUrl); loadAll(); });
  document.getElementById("set-wifi-networks-url").addEventListener("change", (e) => { setSetting("wifiNetworksUrl", e.target.value.trim() || SETTINGS_DEFAULTS.wifiNetworksUrl); loadAll(); });
  document.getElementById("set-dhcp-events-url").addEventListener("change", (e) => { setSetting("dhcpEventsUrl", e.target.value.trim() || SETTINGS_DEFAULTS.dhcpEventsUrl); loadAll(); });
  document.getElementById("set-os-fingerprint-url").addEventListener("change", (e) => { setSetting("osFingerprintUrl", e.target.value.trim() || SETTINGS_DEFAULTS.osFingerprintUrl); loadAll(); });
  document.getElementById("set-dhcp-leases-url").addEventListener("change", (e) => { setSetting("dhcpLeasesUrl", e.target.value.trim() || SETTINGS_DEFAULTS.dhcpLeasesUrl); loadAll(); });
  document.getElementById("set-trend-daily-url").addEventListener("change", (e) => { setSetting("trendDailyUrl", e.target.value.trim() || SETTINGS_DEFAULTS.trendDailyUrl); loadAll(); });
  document.getElementById("set-ble-identity-links-url").addEventListener("change", (e) => { setSetting("bleIdentityLinksUrl", e.target.value.trim() || SETTINGS_DEFAULTS.bleIdentityLinksUrl); loadAll(); });
  document.getElementById("set-ble-presence-url").addEventListener("change", (e) => { setSetting("blePresenceUrl", e.target.value.trim() || SETTINGS_DEFAULTS.blePresenceUrl); loadAll(); });
  document.getElementById("set-deep-scan-url").addEventListener("change", (e) => { setSetting("deepScanUrl", e.target.value.trim() || SETTINGS_DEFAULTS.deepScanUrl); loadAll(); });
  document.getElementById("set-handshake-url").addEventListener("change", (e) => { setSetting("handshakeUrl", e.target.value.trim() || SETTINGS_DEFAULTS.handshakeUrl); loadAll(); });
  document.getElementById("set-wifi-presence-url").addEventListener("change", (e) => { setSetting("wifiPresenceUrl", e.target.value.trim() || SETTINGS_DEFAULTS.wifiPresenceUrl); loadAll(); });
  document.getElementById("set-refresh").addEventListener("change", (e) => { setSetting("refreshMs", e.target.value); setupRefreshTimer(); });

  [["set-net-label", "netLabel"], ["set-net-gateway", "netGateway"]].forEach(([id, key]) => {
    document.getElementById(id).addEventListener("change", (e) => { setSetting(key, e.target.value.trim()); });
  });
  container.querySelectorAll("[data-theme-choice]").forEach((btn) => {
    btn.addEventListener("click", () => setThemeMode(btn.dataset.themeChoice));
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
    renderImpostazioni(container);
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

function exportCardHtml(title, sub, key) {
  return `<div class="card export-card">
    <div><h2 style="margin:0 0 4px;font-size:0.92rem;">${escapeHtml(title)}</h2><p>${escapeHtml(sub)}</p></div>
    <div class="export-actions">
      <button class="btn" data-export="${key}" data-format="csv">${ICON("download")}CSV</button>
      <button class="btn" data-export="${key}" data-format="json">${ICON("download")}JSON</button>
    </div>
  </div>`;
}

function renderEsporta(container) {
  const lanCurrent = latestLanByMac(state.lanRows);
  const alerts = computeAlerts();
  container.innerHTML = `<div class="export-grid">
    ${exportCardHtml("LAN devices (current status)", `${lanCurrent.length} devices`, "lan-current")}
    ${exportCardHtml("Full LAN discovery log", `${state.lanRows.length} rows`, "lan-log")}
    ${exportCardHtml("WiFi probes", `${state.wifiRows.length} rows`, "wifi")}
    ${exportCardHtml("BLE scan", `${state.bleRows.length} rows`, "ble")}
    ${exportCardHtml("Device fingerprints", `${state.fingerprintRows.length} rows`, "fingerprint")}
    ${exportCardHtml("Estimated WiFi traffic", `${state.wifiTrafficRows.length} rows`, "wifi-traffic")}
    ${exportCardHtml("Adjacent WiFi networks", `${state.wifiNetworksRows.length} rows`, "wifi-networks")}
    ${exportCardHtml("DHCP client discovery", `${state.dhcpEventsRows.length} rows`, "dhcp-events")}
    ${exportCardHtml("OS fingerprint", `${state.osFingerprintRows.length} rows`, "os-fingerprint")}
    ${exportCardHtml("DHCP lease cross-check", `${state.dhcpLeasesRows.length} rows`, "dhcp-leases")}
    ${exportCardHtml("Daily trend rollup", `${state.trendDailyRows.length} rows`, "trend-daily")}
    ${exportCardHtml("Alerts", `${alerts.length} alerts`, "alerts")}
  </div>`;
  container.querySelectorAll("[data-export]").forEach((btn) => {
    btn.addEventListener("click", () => doExport(btn.dataset.export, btn.dataset.format));
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
  if (key === "lan-current") { rows = latestLanByMac(state.lanRows).map(stripInternal); filename = "lan_devices_current"; }
  else if (key === "lan-log") { rows = state.lanRows; filename = "lan_discovery_log"; }
  else if (key === "wifi") { rows = state.wifiRows; filename = "wifi_probes"; }
  else if (key === "ble") { rows = state.bleRows; filename = "ble_discovery"; }
  else if (key === "fingerprint") { rows = state.fingerprintRows; filename = "fingerprint_discovery"; }
  else if (key === "wifi-traffic") { rows = state.wifiTrafficRows; filename = "wifi_traffic"; }
  else if (key === "wifi-networks") { rows = state.wifiNetworksRows; filename = "wifi_networks"; }
  else if (key === "dhcp-events") { rows = state.dhcpEventsRows; filename = "dhcp_events"; }
  else if (key === "os-fingerprint") { rows = state.osFingerprintRows; filename = "os_fingerprint"; }
  else if (key === "dhcp-leases") { rows = state.dhcpLeasesRows; filename = "dhcp_leases"; }
  else if (key === "trend-daily") { rows = state.trendDailyRows; filename = "trend_daily"; }
  else if (key === "alerts") {
    rows = computeAlerts().map((a) => ({ id: a.id, severity: a.severity, title: a.title, desc: a.desc, mac: a.mac, timestamp: a.ts ? new Date(a.ts).toISOString() : "" }));
    filename = "alerts";
  } else return;
  downloadBlob(format === "json" ? toJsonBlob(rows) : toCsvBlob(rows), `${filename}.${format}`);
}

function renderAiuto(container) {
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
        <li><strong>Dashboard</strong> (home) — active hosts at the top, then a large isometric house at the center with cards connected by guide lines for SSIDs requested in probes, adjacent networks detected from their own beacons, and WiFi/Bluetooth devices detected in the last 24h (closer = stronger signal, not actual position — a purely illustrative view, not a real map or physical distance). The house always shows up to 10 cards, distributed across whichever categories are active in the filters at the top (hiding a category redistributes its slots to the others). Below the house: scan status, a Host summary (totals, active/offline, risk distribution) and panels with a quick preview for each category — a "View all" button on each jumps to the corresponding page (Host, WiFi or BLE) with the complete, searchable list and full details; for the three WiFi-related categories it shows only that one table, not the whole WiFi page ("Show all WiFi data" returns to the full page). "SSIDs requested" are networks saved on devices nearby, not necessarily networks present here; "Adjacent networks" are genuinely detected around you (BSSID/SSID/channel from their beacons). Click a card or a row for details.</li>
        <li><strong>Host</strong> — KPI row (total hosts, new devices, at-risk count), then the full list of known LAN devices with device type and risk score (0-100, based on exposed ports and linked alerts); the hostname is a link to the device's full profile. Filter by status, type, vendor, risk level, trust and open ports, or toggle "Stale only" to surface devices offline for more than 30 days. "Columns" adds OS guess, mDNS name, ARP status (silent on the router's DHCP lease table), Uptime % and WiFi traffic (24h) — hidden by default to keep the table compact. "Group by identity" merges MACs linked as the same physical device into one row. Save recurring filter combinations as presets, or select rows with the checkboxes to trust or export several devices at once. From a row's action menu you can assign a custom name and mark a device as trusted (reduces noise: lower risk score, less severe linked alerts). A device's full profile also shows its last optional deep port scan (<code>--deep-port-scan</code>), if any, with how many ports it found beyond the regular scan.</li>
        <li><strong>WiFi</strong> — 802.11 probe requests nearby: probe activity and channel distribution charts at the top, then three tables (each searchable and paginated, across all loaded history) — "SSIDs requested" (a summary per network name requested in probes, not a list of physically present networks; click a row to see which devices requested it), "Nearby WiFi devices" (external devices detected via probes, one row per MAC) and "Adjacent networks" (WiFi networks genuinely detected around you from their own beacons, filterable by security type — Open/WEP/WPA/WPA2-WPA3 — and by band, 2.4 vs 5 GHz; security is classified from the beacon itself and requires <code>--wifi-iface</code>). A KPI row at the top counts Open and WPA2/WPA3 networks and total handshake captures. A "Presence" card lists arrival/departure events for the home MAC addresses configured with <code>--wifi-home-macs</code> — same principle as the BLE page's, deduced from probe requests instead of advertisements. A "Handshake captures" card lists the WPA/WPA2 handshakes captured for the home networks in <code>--home-ssid</code> when <code>--capture-handshakes</code> is active — metadata only, the actual <code>.pcap</code> file to run through aircrack-ng/hashcat stays on the Pi. At the bottom, the raw probe log for row-by-row analysis. Estimated WiFi traffic per device is not shown here: it's an optional column on the Host page, and it also remains in the CSV export and the periodic email report.</li>
        <li><strong>BLE</strong> — Bluetooth Low Energy activity nearby: KPIs (including a "Possible trackers" count) and 24h activity at the top, then the "BLE devices" table — a summary per MAC with a heuristic device type (wearable, audio, possible tracker...), manufacturer, signal and number of sightings, trackers highlighted — a "Presence" card with arrival/departure events for the home MACs configured with <code>--ble-home-macs</code>, and at the bottom the raw advertisement log for row-by-row analysis. From a device's full profile you can also see and act on suggested identity links across a rotated BLE address (same advertised name/services reappearing on a new MAC shortly after the old one went quiet) — a suggestion only, never applied automatically.</li>
        <li><strong>Timeline</strong> — unified chronological feed of all notable events (new/offline, alerts, fingerprint), filterable by category.</li>
        <li><strong>Scans</strong> — history of LAN discovery cycles.</li>
        <li><strong>Alerts</strong> — new devices and risky open ports (computed by the dashboard), plus alerts from the daemon-side detection modules if active (ARP spoofing, rogue DHCP, WiFi evil twin, possible deauth/disassoc flood, BLE tracker presence, possible BLE spoofing, new ports on known devices); filterable by type and status (Active/All/Snoozed/Dismissed), with filters savable as presets. Besides Dismiss (hidden until restored), each active alert can be Snoozed for 1h/24h/7 days — it reappears among Active on its own once the snooze expires, without needing to remember to restore it. See <strong>Settings</strong> to enable desktop notifications for new critical-severity alerts.</li>
        <li><strong>Trend</strong> — trend of new devices and alerts over the last 7/30 days, calculated from the already-loaded history.</li>
        <li><strong>Settings</strong> — daemon module status (inferred from loaded data), data sources (JSON Lines), theme.</li>
        <li><strong>Export</strong> — download the current data as CSV or JSON.</li>
      </ul>
      <p class="field-hint">Press <strong>Ctrl+K</strong> (or <strong>⌘K</strong>) at any time for global search across pages, devices and alerts. The "Collapse" button at the bottom of the side menu shrinks it to icons only, for more room on pages with wide tables. On narrower screens the side menu becomes a drawer, opened from the menu button next to the page title.</p>
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
        <li>BLE and WiFi presence tracking only report arrival/departure for the MAC addresses explicitly configured with <code>--ble-home-macs</code>/<code>--wifi-home-macs</code> on the daemon: they have no notion of which devices belong to the household beyond that list, and a MAC that rotates (see above) will look like a departure followed by a new arrival unless it's also linked as the same identity. The two are tracked independently — a phone's BLE and WiFi addresses are normally different random addresses, so the same physical device configured on both counts as two separate "home" entries. WiFi presence in particular depends on the device actually sending probe requests, which varies a lot by OS and power state — expect it to be less prompt/reliable than BLE's.</li>
        <li>The deep port scan (<code>--deep-port-scan</code>) runs at most once every <code>--deep-port-scan-interval</code> (default one week) per device, and a brand-new device's first deep scan is deferred by a full interval rather than run immediately: it's meant to catch a service on an unusual port eventually, not as fast as the regular port scan.</li>
        <li>Handshake capture (<code>--capture-handshakes</code>) is purely passive — it only records EAPOL frames from a handshake that happens on its own (a client (re)connecting), it never sends a deauth to force one — and, like the rest of the WiFi monitor, is subject to channel hopping: a handshake that completes in milliseconds on a channel the sniffer isn't on at that moment can be missed or captured only partially (the "Messages" column shows exactly which of the 4 were caught). It only captures for the networks listed in <code>--home-ssid</code>, never for networks it merely detects nearby.</li>
        <li>The risk score (the "Risk" column in Host) is a heuristic based on exposed ports and linked alerts, not a formal security assessment; marking a device as trusted attenuates it (reduced score, linked alerts one level less severe) but doesn't hide it or exclude it from checks.</li>
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

// "mappa" (renderMappa/renderNetworkMap) è volutamente esclusa da ROUTES:
// su una rete piatta a singolo segmento la topologia a stella non aggiunge
// informazione reale rispetto alla tabella Host. Il codice resta pronto per
// quando avrà senso (subnet/VLAN multiple, routing reale) — va solo
// riaggiunta qui sotto per riabilitarla in sidebar/ricerca globale.
const ROUTES = [
  { id: "dashboard", label: "Dashboard", icon: "home", title: "Dashboard", subtitle: "Local network overview", render: renderHouseRadarPage },
  { id: "host", label: "Host", icon: "monitor", title: "Host", subtitle: "Full list of LAN devices", render: renderHost },
  { id: "wifi", label: "WiFi", icon: "wifi", title: "WiFi probes", subtitle: "802.11 probe requests detected nearby", render: renderWifiPage },
  { id: "ble", label: "BLE", icon: "bluetooth", title: "BLE devices", subtitle: "Passive Bluetooth Low Energy scan nearby", render: renderBlePage },
  { id: "timeline", label: "Timeline", icon: "clock", title: "Timeline", subtitle: "Unified chronological feed of all events", render: renderTimeline },
  { id: "scans", label: "Scans", icon: "radar", title: "Scans", subtitle: "History of LAN discovery cycles", render: renderScansioni },
  { id: "alerts", label: "Alerts", icon: "bell", title: "Alerts", subtitle: "Events that need attention", render: renderAvvisi },
  { id: "trend", label: "Trend", icon: "trending-up", title: "Trend", subtitle: "Historical trend of devices and alerts", render: renderTrend },
  { id: "settings", label: "Settings", icon: "sliders", title: "Settings", subtitle: "Data sources, network and appearance", render: renderImpostazioni },
  { id: "export", label: "Export", icon: "download", title: "Export", subtitle: "Download the collected data", render: renderEsporta },
  { id: "help", label: "Help", icon: "help", title: "Help", subtitle: "Quick guide to Home Sentinel", render: renderAiuto },
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
      state.wifiFocusSection = null; // click diretto sul menu: mostra sempre la pagina intera
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
    document.getElementById("page-subtitle").textContent = state.deviceProfileMac;
    document.getElementById("page-icon").innerHTML = ICON("monitor");
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

function renderCurrentRoute() {
  if (state.route === "device") {
    renderDeviceProfile(document.getElementById("view-root"), state.deviceProfileMac);
  } else {
    getRouteById(state.route).render(document.getElementById("view-root"));
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

/** Naviga alla pagina WiFi mostrando SOLO la sezione richiesta (non l'intera pagina), per i
 * pulsanti "View all" del radar della Dashboard che rimandano lì. A differenza di
 * navigateWithScroll, non serve scorrere: la sezione richiesta è l'unico contenuto della pagina. */
function navigateToWifiSection(section) {
  state.wifiFocusSection = section;
  if (window.location.hash === "#/wifi") onRouteChange();
  else window.location.hash = "#/wifi";
}

/* ---------------------------------------------------------------------- *
 * Topbar: refresh, status pill, theme
 * ---------------------------------------------------------------------- */

function setupTopbar() {
  document.getElementById("refresh-now").addEventListener("click", () => {
    const icon = document.getElementById("icon-refresh");
    icon.classList.add("spin");
    setTimeout(() => icon.classList.remove("spin"), 600);
    loadAll();
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

function updateStatusPill() {
  const pill = document.getElementById("status-pill");
  const text = document.getElementById("status-pill-text");
  const dropdown = document.getElementById("status-dropdown");
  const ok = state.lastFetchOk;
  pill.classList.toggle("is-down", ok === false);
  text.textContent = ok === false ? "Error" : ok === true ? "Online" : "Waiting";
  dropdown.innerHTML = `
    <div><strong>LAN source</strong><br>${escapeHtml(state.lanFile ? `${state.lanFile.name} (local file)` : getSetting("lanUrl"))}</div>
    <div><strong>WiFi source</strong><br>${escapeHtml(state.wifiFile ? `${state.wifiFile.name} (local file)` : getSetting("wifiUrl"))}</div>
    <div><strong>BLE source</strong><br>${escapeHtml(state.bleFile ? `${state.bleFile.name} (local file)` : getSetting("bleUrl"))}</div>
    <div><strong>Rows loaded</strong><br>${state.lanRows.length} LAN · ${state.wifiRows.length} WiFi · ${state.bleRows.length} BLE · ${state.alertsRows.length} alerts · ${state.fingerprintRows.length} fingerprints</div>
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

const CMDK_TYPE_LABELS = { page: "Pages", device: "Devices", alert: "Alerts" };
let cmdkResults = [];
let cmdkActiveIndex = 0;

function computeSearchIndex() {
  const items = [];
  for (const r of ROUTES) {
    items.push({ type: "page", label: r.label, sub: r.subtitle, icon: r.icon, action: () => {
      state.wifiFocusSection = null;
      const hash = `#/${r.id}`;
      if (window.location.hash === hash) onRouteChange(); else window.location.hash = hash;
    } });
  }
  for (const d of latestLanByMac(state.lanRows)) {
    items.push({
      type: "device", label: d.hostname || d.mac, sub: `${d.ip} · ${d.vendor || "unknown vendor"}`, icon: "monitor",
      keywords: `${d.ip} ${d.mac} ${d.hostname || ""} ${d.vendor || ""}`, action: () => goToDevice(d.mac),
    });
  }
  for (const a of computeAlerts().slice(0, 100)) {
    items.push({
      type: "alert", label: a.title, sub: a.desc, icon: a.icon,
      keywords: `${a.title} ${a.desc} ${a.mac || ""}`, action: () => { window.location.hash = "#/alerts"; },
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

function init() {
  readUrlParams();
  initTheme();
  document.getElementById("icon-brand").innerHTML = ICON("wifi");
  document.getElementById("icon-refresh").innerHTML = ICON("refresh");
  document.getElementById("icon-cmdk-open").innerHTML = ICON("search");
  document.getElementById("icon-cmdk").innerHTML = ICON("search");

  renderSidebarNav();
  initSidebarCollapse();
  initMobileNav();
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
