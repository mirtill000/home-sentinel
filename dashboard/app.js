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
};
const SETTINGS_DEFAULTS = {
  lanUrl: "lan_discovery.jsonl", wifiUrl: "wifi_probes.jsonl", bleUrl: "ble_discovery.jsonl", refreshMs: "30000", theme: "dark",
  netLabel: "", netGateway: "",
  alertsUrl: "alerts_detection.jsonl", fingerprintUrl: "fingerprint_discovery.jsonl", wifiTrafficUrl: "wifi_traffic.jsonl",
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
const CAT_COLORS = ["var(--cat-1)", "var(--cat-2)", "var(--cat-3)", "var(--cat-4)", "var(--cat-5)", "var(--cat-6)", "var(--cat-7)", "var(--cat-8)"];

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
  if (!res.ok) throw new Error(`HTTP ${res.status} su ${url}`);
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

  state.lastFetchOk = errors.length === 0;
  if (errors.length) showError(errors.join(" — "));
  document.getElementById("last-updated").textContent = new Date().toLocaleTimeString("it-IT");

  updateStatusPill();
  renderCurrentRoute();
}

function showError(msg) {
  const el = document.getElementById("error-banner");
  el.textContent = `Impossibile caricare i dati. ${msg}`;
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
  return new Date(ts).toLocaleString("it-IT");
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
  if (typeof rssi !== "number") return { bars: 0, label: "N/D" };
  if (rssi >= -50) return { bars: 4, label: "Ottimo" };
  if (rssi >= -65) return { bars: 3, label: "Buono" };
  if (rssi >= -75) return { bars: 2, label: "Discreto" };
  return { bars: 1, label: "Debole" };
}
function signalBarsHtml(rssi) {
  const { bars, label } = signalLevel(rssi);
  const cells = [1, 2, 3, 4].map((i) => `<span class="signal-bar ${i <= bars ? "on" : ""}" style="height:${i * 3 + 3}px"></span>`).join("");
  const title = typeof rssi === "number" ? `${label} (${rssi} dBm)` : "Segnale non disponibile";
  return `<span class="signal-bars" title="${escapeHtml(title)}">${cells}</span>`;
}

function formatRelativeTime(ts) {
  if (ts === null || Number.isNaN(ts)) return "—";
  const minutes = Math.round((Date.now() - ts) / 60000);
  if (minutes < 1) return "adesso";
  if (minutes < 60) return `${minutes} min fa`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h fa`;
  return `${Math.round(hours / 24)} g fa`;
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
      <label for="page-size-${key}">Righe per pagina</label>
      <select class="select-control" id="page-size-${key}" data-page-size="${key}">
        ${PAGE_SIZE_OPTIONS.map((n) => `<option value="${n}" ${info.pageSize === n ? "selected" : ""}>${n}</option>`).join("")}
        <option value="all" ${info.pageSize === "all" ? "selected" : ""}>Tutte</option>
      </select>
    </div>
    <div class="pagination-nav">
      <button class="btn btn-icon" data-page-nav="${key}" data-dir="prev" ${info.page <= 1 ? "disabled" : ""} aria-label="Pagina precedente">${ICON("chevron-left")}</button>
      <span class="pagination-info">Pagina ${info.page} di ${info.totalPages} · ${info.total} righe</span>
      <button class="btn btn-icon" data-page-nav="${key}" data-dir="next" ${info.page >= info.totalPages ? "disabled" : ""} aria-label="Pagina successiva">${ICON("chevron-right")}</button>
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
  const labels = { online: "Online", new: "Nuovo", offline: "Offline" };
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

function getDeviceLabel(mac) {
  const labels = getDeviceLabels();
  return labels[mac] || { trusted: false, name: "" };
}

function setDeviceLabel(mac, patch) {
  const labels = getDeviceLabels();
  const next = { ...getDeviceLabel(mac), ...patch };
  if (next.trusted || next.name) labels[mac] = next;
  else delete labels[mac]; // torna al default: nessuna voce da conservare
  saveDeviceLabels(labels);
}

/** Nome da mostrare per un device: personalizzato se impostato, altrimenti il fallback (hostname/MAC). */
function displayName(mac, fallback) {
  const label = getDeviceLabel(mac);
  return label.name || fallback;
}

function trustBadgeHtml(mac) {
  if (!getDeviceLabel(mac).trusted) return "";
  return `<span class="badge trust-badge" title="Contrassegnato come fidato">${ICON("shield")}Fidato</span>`;
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
  if (!fingerprint || !fingerprint.device_type || fingerprint.device_type === "Sconosciuto") score += 5;
  if (device?.mac && getDeviceLabel(device.mac).trusted) score *= 0.4;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function riskLevel(score) {
  if (score >= 70) return { label: "Critico", tone: "critical" };
  if (score >= 40) return { label: "Alto", tone: "serious" };
  if (score >= 15) return { label: "Medio", tone: "warning" };
  return { label: "Basso", tone: "good" };
}

function riskBadgeHtml(score) {
  const level = riskLevel(score);
  return `<span class="badge risk-badge tone-${level.tone}" title="Punteggio di rischio euristico 0-100, su porte esposte e alert collegati">${score} · ${level.label}</span>`;
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
  if (d.prev === 0 && d.cur === 0) return "Nessun evento nel periodo";
  const arrow = d.deltaPct > 0 ? "▲" : d.deltaPct < 0 ? "▼" : "▬";
  return `${arrow} ${Math.abs(d.deltaPct)}% vs periodo precedente`;
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
    const dateLabel = date.toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit" });

    const col = document.createElement("div");
    col.className = "bar-col";
    const bar = document.createElement("div");
    bar.className = "bar";
    bar.style.height = `${Math.max((count / max) * 100, count > 0 ? 3 : 0)}%`;
    attachTooltip(bar, `${dateLabel} — ${count} evento${count === 1 ? "" : "i"}`);
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
  const newDevices = state.lanRows.filter((r) => r.status === "new");
  const alertRows = computeAlerts().filter((a) => a.ts !== null).map((a) => ({ timestamp: new Date(a.ts).toISOString() }));

  const newDelta = periodDelta(newDevices, range);
  const alertDelta = periodDelta(alertRows, range);

  container.innerHTML = `
    <div class="page-section">
      <div class="filter-row" style="margin:0;">
        <select class="select-control" id="trend-range">
          <option value="7">Ultimi 7 giorni</option>
          <option value="30">Ultimi 30 giorni</option>
        </select>
      </div>
    </div>
    <div class="page-section kpi-row">
      ${kpiTile({
        label: `Nuovi device (${range}g)`, icon: "monitor", tone: "violet",
        value: newDelta.cur, sub: trendSubLabel(newDelta), subTone: newDelta.deltaPct > 0 ? "critical" : "good",
      })}
      ${kpiTile({
        label: `Alert generati (${range}g)`, icon: "shield", tone: "critical",
        value: alertDelta.cur, sub: trendSubLabel(alertDelta), subTone: alertDelta.deltaPct > 0 ? "critical" : "good",
      })}
    </div>
    <div class="page-section grid-2">
      <div class="card">
        <div class="card-head"><h2>Nuovi dispositivi</h2><span class="card-sub">per giorno</span></div>
        <div class="bar-chart" id="chart-trend-new" data-empty="Nessun dato"></div>
      </div>
      <div class="card">
        <div class="card-head"><h2>Alert generati</h2><span class="card-sub">per giorno</span></div>
        <div class="bar-chart" id="chart-trend-alerts" data-empty="Nessun dato"></div>
      </div>
    </div>
    <p class="field-hint">Calcolato lato browser sulla cronologia già caricata dai file di log — non richiede un server di query separato. Il daemon ruota i JSONL oltre una certa dimensione (<code>--max-log-size-mb</code>, default 20MB) e la dashboard, per restare veloce, scarica solo la coda più recente dei file più grandi (vedi eventuale avviso nella pagina WiFi/BLE): su 30 giorni il trend potrebbe quindi non coprire l'intero periodo se il log ha già ruotato o è stato troncato al caricamento.</p>
  `;

  document.getElementById("trend-range").value = String(range);
  document.getElementById("trend-range").addEventListener("change", (e) => {
    state.trendRangeDays = Number(e.target.value);
    renderTrend(container);
  });
  renderDayBarChart(document.getElementById("chart-trend-new"), dailyCounts(newDevices, range), range);
  renderDayBarChart(document.getElementById("chart-trend-alerts"), dailyCounts(alertRows, range), range);
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

function renderDonut(container, segments, centerSub) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  if (total === 0) {
    container.innerHTML = `<p class="empty-state">Nessun dato</p>`;
    return;
  }
  const R = 50, C = 2 * Math.PI * R;
  let offset = 0;
  const circles = segments.filter((s) => s.value > 0).map((seg) => {
    const len = (seg.value / total) * C;
    const gap = Math.min(2.5, len * 0.12);
    const visible = Math.max(len - gap, 0.001);
    const html = `<circle class="donut-seg" cx="60" cy="60" r="${R}" fill="none" style="stroke:${seg.color}" stroke-width="14" stroke-dasharray="${visible.toFixed(2)} ${(C - visible).toFixed(2)}" stroke-dashoffset="${(-offset).toFixed(2)}" data-tip="${escapeHtml(seg.label)}: ${seg.value}"></circle>`;
    offset += len;
    return html;
  }).join("");

  const legend = segments.map((seg) => {
    const pct = total ? Math.round((seg.value / total) * 100) : 0;
    return `<div class="donut-legend-row"><span class="swatch" style="background:${seg.color}"></span><span class="name">${escapeHtml(seg.label)}</span><span class="value">${seg.value}</span><span class="pct">${pct}%</span></div>`;
  }).join("");

  container.innerHTML = `
    <div class="donut-body">
      <div class="donut-svg-wrap">
        <svg viewBox="0 0 120 120"><g transform="rotate(-90 60 60)">${circles}</g></svg>
        <div class="donut-center"><strong>${total}</strong><span>${escapeHtml(centerSub || "Totale")}</span></div>
      </div>
      <div class="donut-legend">${legend}</div>
    </div>`;
  container.querySelectorAll(".donut-seg").forEach((el) => attachTooltip(el, el.dataset.tip));
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
    attachTooltip(bar, `${hourDate.getHours()}:00 — ${count} evento${count === 1 ? "" : "i"}`);
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

function vendorSegments(devices) {
  const counts = new Map();
  for (const d of devices) {
    const v = (d.vendor || "").trim() || "Sconosciuto";
    counts.set(v, (counts.get(v) || 0) + 1);
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const top = sorted.slice(0, 5);
  const rest = sorted.slice(5).reduce((sum, [, c]) => sum + c, 0);
  const segs = top.map(([label, value], i) => ({ label, value, color: CAT_COLORS[i] }));
  if (rest > 0) segs.push({ label: "Altro", value: rest, color: "var(--status-muted)" });
  return segs;
}

function statusSegments(devices) {
  return [
    { label: "Online", value: devices.filter((d) => d.status === "online").length, color: "var(--status-good)" },
    { label: "Nuovo", value: devices.filter((d) => d.status === "new").length, color: "var(--status-warning)" },
    { label: "Offline", value: devices.filter((d) => d.status === "offline").length, color: "var(--status-muted)" },
  ];
}

function riskSegments(devices) {
  const fingerprintByMac = latestFingerprintByMac(state.fingerprintRows);
  const alertsByMac = groupAlertsByMac(computeAlerts());
  const counts = { Basso: 0, Medio: 0, Alto: 0, Critico: 0 };
  for (const d of devices) {
    const score = computeRiskScore(d, fingerprintByMac.get(d.mac), alertsByMac.get(d.mac));
    counts[riskLevel(score).label] += 1;
  }
  return [
    { label: "Basso", value: counts.Basso, color: "var(--status-good)" },
    { label: "Medio", value: counts.Medio, color: "var(--status-warning)" },
    { label: "Alto", value: counts.Alto, color: "var(--status-serious)" },
    { label: "Critico", value: counts.Critico, color: "var(--status-critical)" },
  ];
}

function bleManufacturerSegments(rows) {
  const counts = new Map();
  for (const r of rows) {
    const ids = Array.isArray(r.manufacturer_ids) ? r.manufacturer_ids : [];
    if (!ids.length) {
      counts.set("Sconosciuto", (counts.get("Sconosciuto") || 0) + 1);
      continue;
    }
    for (const id of ids) {
      const label = bleCompanyLabel(id);
      counts.set(label, (counts.get(label) || 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
}

function wifiVendorSegments(rows) {
  const counts = new Map();
  for (const r of rows) {
    const v = (r.vendor || "").trim() || "Sconosciuto";
    counts.set(v, (counts.get(v) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
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
 * Top device per traffico WiFi stimato (wifi_traffic.jsonl, se il daemon
 * gira con --wifi-iface e senza --no-wifi-traffic). È una stima grezza dai
 * frame dati catturati durante il channel hopping — non è banda esatta, si
 * vede solo la frazione di traffico transitata mentre si era fermi su quel
 * canale.
 */
function computeWifiTrafficTop(rows, limit = 10) {
  const totals = new Map();
  for (const r of rows) {
    if (!r.mac) continue;
    if (!totals.has(r.mac)) totals.set(r.mac, { mac: r.mac, bytes: 0, frames: 0 });
    const e = totals.get(r.mac);
    e.bytes += Number(r.bytes) || 0;
    e.frames += Number(r.frames) || 0;
  }
  return [...totals.values()].sort((a, b) => b.bytes - a.bytes).slice(0, limit);
}

function renderWifiTrafficWidget(container) {
  const top = computeWifiTrafficTop(state.wifiTrafficRows, 10);
  container.innerHTML = `
    <div class="card-head"><h2>Traffico WiFi stimato</h2><span class="card-sub">top 10 per byte catturati, su tutto lo storico caricato</span></div>
    ${top.length ? `<div class="table-scroll"><table class="data-table">
      <thead><tr><th>#</th><th>Dispositivo</th><th>Traffico stimato</th><th>Frame catturati</th></tr></thead>
      <tbody>${top.map((d, i) => `<tr>
        <td class="mono">${i + 1}</td>
        <td>
          <button class="link-cell" data-mac-link="${escapeHtml(d.mac)}">${escapeHtml(displayName(d.mac, d.mac))}</button>
          ${trustBadgeHtml(d.mac)}
        </td>
        <td>${formatBytes(d.bytes) || "—"}</td>
        <td>${d.frames}</td>
      </tr>`).join("")}</tbody>
    </table></div>` : '<p class="empty-state">Nessun dato di traffico WiFi. Attivo di default con --wifi-iface sul daemon, salvo --no-wifi-traffic.</p>'}
    <p class="field-hint">Stima indicativa dai frame dati catturati durante il channel hopping: si vede solo la frazione di traffico transitata mentre si era fermi sul canale in quel momento, non è una misura di banda esatta.</p>
  `;
  container.querySelectorAll("[data-mac-link]").forEach((btn) => {
    btn.addEventListener("click", () => goToDevice(btn.dataset.macLink));
  });
}

/* ---------------------------------------------------------------------- *
 * Dispositivi nei dintorni (euristica: segnale forte + presenza ripetuta,
 * incrociando probe WiFi e advertisement BLE. Non è una localizzazione
 * reale: è solo un'indicazione di possibile prossimità fisica.)
 * ---------------------------------------------------------------------- */

const NEARBY_RSSI_THRESHOLD = -70; // dBm, più vicino a 0 = segnale più forte
const NEARBY_MIN_SIGHTINGS = 3;
const NEARBY_LOOKBACK_MS = 24 * 3600 * 1000;

function computeNearbyDevices() {
  const cutoff = Date.now() - NEARBY_LOOKBACK_MS;
  const knownLanMacs = new Set(latestLanByMac(state.lanRows).map((d) => d.mac));
  const groups = new Map(); // `${source}:${mac}` -> { source, mac, name, vendor, rssiSum, rssiCount, sightings, lastTs }

  function addRow(source, mac, name, vendor, rssi, ts) {
    if (ts === null || ts < cutoff) return;
    const key = `${source}:${mac}`;
    if (!groups.has(key)) groups.set(key, { source, mac, name: "", vendor: "", rssiSum: 0, rssiCount: 0, sightings: 0, lastTs: 0 });
    const g = groups.get(key);
    g.sightings += 1;
    if (typeof rssi === "number") { g.rssiSum += rssi; g.rssiCount += 1; }
    if (ts > g.lastTs) g.lastTs = ts;
    if (!g.name && name) g.name = name;
    if (!g.vendor && vendor) g.vendor = vendor;
  }

  for (const r of state.wifiRows) {
    if (knownLanMacs.has(r.mac)) continue; // è un tuo dispositivo, non un "esterno"
    addRow("wifi", r.mac, "", r.vendor || "", typeof r.rssi === "number" ? r.rssi : null, parseTs(r.timestamp));
  }
  for (const r of state.bleRows) {
    const ids = Array.isArray(r.manufacturer_ids) ? r.manufacturer_ids : [];
    const vendor = ids.length ? bleCompanyLabel(ids[0]) : "";
    addRow("ble", r.mac, r.name || "", vendor, typeof r.rssi === "number" ? r.rssi : null, parseTs(r.timestamp));
  }

  return [...groups.values()]
    .filter((g) => g.rssiCount > 0 && g.sightings >= NEARBY_MIN_SIGHTINGS && g.rssiSum / g.rssiCount >= NEARBY_RSSI_THRESHOLD)
    .map((g) => ({ ...g, avgRssi: Math.round(g.rssiSum / g.rssiCount) }))
    .sort((a, b) => b.avgRssi - a.avgRssi);
}

function nearbyCardHtml(d) {
  return `<div class="nearby-card">
    <span class="nearby-icon">${ICON(d.source === "ble" ? "bluetooth" : "wifi")}</span>
    <div class="nearby-body">
      <div class="nearby-title">${escapeHtml(d.name || d.vendor || "Dispositivo sconosciuto")}</div>
      <div class="nearby-meta">
        ${signalBarsHtml(d.avgRssi)}
        <span>${d.sightings} avvistamenti</span>
        <span>${formatRelativeTime(d.lastTs)}</span>
      </div>
    </div>
  </div>`;
}

function renderNearbySection(container) {
  const all = computeNearbyDevices();
  const shown = all.slice(0, 10);

  container.innerHTML = `
    <div class="card-head">
      <h2>Dispositivi nei dintorni</h2>
      <span class="card-sub">segnale forte e presenza ripetuta nelle ultime 24h${all.length > shown.length ? ` — mostrati i ${shown.length} più vicini su ${all.length}` : ""}</span>
    </div>
    ${shown.length
      ? `<div class="nearby-grid">${shown.map(nearbyCardHtml).join("")}</div>`
      : `<p class="empty-state">Nessun dispositivo esterno rilevato in prossimità nelle ultime 24h.</p>`}
    <p class="field-hint">Stima euristica su segnale forte e presenza ripetuta nei probe WiFi/BLE, non una vera localizzazione; esclude i dispositivi già noti sulla LAN. I MAC sono spesso randomizzati dai device moderni e volutamente non mostrati qui: nome/vendor e persistenza nel tempo sono indicatori più utili, ma non sempre affidabili al 100%.</p>
  `;
}

/** Severity dei rilevatori server-side (low/medium/high) -> classi CSS esistenti (info/serious/critical). */
const DETECTION_SEVERITY_MAP = { low: "info", medium: "serious", high: "critical" };

/** Etichetta e icona per ogni tipo di alert: quelli del daemon (sentinel_detection.py) più i due calcolati lato client. */
const ALERT_TYPE_META = {
  possibile_arp_spoofing: { label: "Possibile ARP spoofing", icon: "shield" },
  possibile_rogue_dhcp: { label: "Possibile rogue DHCP", icon: "server" },
  possibile_evil_twin: { label: "Possibile evil twin WiFi", icon: "wifi" },
  possibile_deauth_flood: { label: "Possibile attacco deauth/disassoc WiFi", icon: "wifi" },
  nuova_porta: { label: "Nuova porta aperta su device noto", icon: "alert-triangle" },
  nuovo_dispositivo: { label: "Nuovo dispositivo rilevato", icon: "monitor" },
  porta_rischio: { label: "Porta a rischio aperta", icon: "alert-triangle" },
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
      desc: `${row.hostname || row.mac} (${row.ip}) visto per la prima volta sulla rete.`,
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
      desc: `${dev.hostname || dev.mac} (${dev.ip}) espone ${risky.map((p) => `${p}/${RISK_PORTS[p]}`).join(", ")}.`,
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
      title: row.status === "new" ? "Nuovo dispositivo" : "Dispositivo offline",
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
      title: `Device identificato: ${f.device_type || "Sconosciuto"}`,
      desc: f.ip || "", mac: f.mac,
    });
  }

  return events.sort((a, b) => b.ts - a.ts);
}

const TIMELINE_KIND_LABELS = { lan: "Dispositivi (nuovi/offline)", alert: "Alert", fingerprint: "Fingerprint" };

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
        <h2>Timeline eventi</h2>
        <select class="select-control" id="timeline-kind-filter">
          <option value="all">Tutti gli eventi</option>
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
    if (!list.length) { el.innerHTML = '<p class="empty-state">Nessun evento in questa categoria.</p>'; return; }
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
  const lanCurrent = latestLanByMac(state.lanRows);
  container.innerHTML = `
    <div class="card-head">
      <h2>Host sulla rete <span class="card-sub">(${lanCurrent.length})</span></h2>
      <div class="filter-row" style="margin:0;">
        <div class="search-input">${ICON("search")}<input type="text" id="host-search" placeholder="Cerca per IP, MAC, hostname, vendor…"></div>
        <select class="select-control" id="host-status-filter">
          <option value="all">Tutti gli stati</option>
          <option value="online">Online</option>
          <option value="new">Nuovi</option>
          <option value="offline">Offline</option>
        </select>
      </div>
    </div>
    <div class="table-scroll">
      <table class="data-table" id="host-table">
        <thead><tr>
          <th data-sort="status">Stato</th>
          <th data-sort="ip">IP</th>
          <th data-sort="hostname">Nome host</th>
          <th data-sort="mac">Indirizzo MAC</th>
          <th data-sort="vendor">Produttore</th>
          <th>Tipo</th>
          <th>Rischio</th>
          <th data-sort="open_ports">Porte aperte</th>
          <th data-sort="last_seen">Ultima attività</th>
          <th></th>
        </tr></thead>
        <tbody id="host-table-body"></tbody>
      </table>
      <p class="empty-state hidden" id="host-empty">Nessun dispositivo — controlla le sorgenti dati in Impostazioni.</p>
      <div id="host-pagination"></div>
    </div>`;

  document.getElementById("host-search").addEventListener("input", () => { getPagination("host").page = 1; renderHostTableBody(); });
  document.getElementById("host-status-filter").addEventListener("change", () => { getPagination("host").page = 1; renderHostTableBody(); });
  container.querySelectorAll("#host-table thead th[data-sort]").forEach((th) => {
    th.addEventListener("click", () => {
      const key = th.dataset.sort;
      if (state.lanSort.key === key) state.lanSort.dir *= -1;
      else { state.lanSort.key = key; state.lanSort.dir = 1; }
      renderHostTableBody();
    });
  });
  renderHostTableBody();
}

function renderHostTableBody() {
  const searchEl = document.getElementById("host-search");
  const body = document.getElementById("host-table-body");
  if (!searchEl || !body) return; // section not mounted on the current page

  const search = searchEl.value.trim().toLowerCase();
  const statusFilter = document.getElementById("host-status-filter").value;
  const lanCurrent = latestLanByMac(state.lanRows);

  let rows = lanCurrent.filter((d) => {
    if (statusFilter !== "all" && d.status !== statusFilter) return false;
    if (!search) return true;
    return `${d.ip} ${d.mac} ${d.hostname} ${d.vendor} ${getDeviceLabel(d.mac).name}`.toLowerCase().includes(search);
  });
  rows = sortRows(rows, state.lanSort.key, state.lanSort.dir);
  const fingerprintByMac = latestFingerprintByMac(state.fingerprintRows);
  const alertsByMac = groupAlertsByMac(computeAlerts());

  const info = paginate(rows, "host");
  body.innerHTML = info.pageRows.map((d) => hostRowHtml(d, fingerprintByMac.get(d.mac), alertsByMac.get(d.mac))).join("");
  document.getElementById("host-empty").classList.toggle("hidden", rows.length > 0);
  document.getElementById("host-pagination").innerHTML = rows.length ? paginationHtml("host", info) : "";
  wirePagination(document.getElementById("host-pagination"), "host", renderHostTableBody);

  body.querySelectorAll(".kebab-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      state.openMenuMac = state.openMenuMac === btn.dataset.mac ? null : btn.dataset.mac;
      renderHostTableBody();
    });
  });
  body.querySelectorAll('[data-action="copy"]').forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      navigator.clipboard?.writeText(btn.dataset.mac).catch(() => {});
      state.openMenuMac = null;
      renderHostTableBody();
    });
  });
  body.querySelectorAll('[data-action="details"]').forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      state.expandedMac = state.expandedMac === btn.dataset.mac ? null : btn.dataset.mac;
      state.openMenuMac = null;
      renderHostTableBody();
    });
  });
  body.querySelectorAll('[data-action="trust"]').forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      setDeviceLabel(btn.dataset.mac, { trusted: !getDeviceLabel(btn.dataset.mac).trusted });
      state.openMenuMac = null;
      renderHostTableBody();
    });
  });
  body.querySelectorAll("[data-mac-link]").forEach((btn) => {
    btn.addEventListener("click", (e) => { e.stopPropagation(); goToDevice(btn.dataset.macLink); });
  });
}

function hostRowHtml(d, fingerprint, alerts) {
  const menuOpen = state.openMenuMac === d.mac;
  const expanded = state.expandedMac === d.mac;
  const deviceType = fingerprint?.device_type || "";
  const risk = computeRiskScore(d, fingerprint, alerts);
  const trusted = getDeviceLabel(d.mac).trusted;
  const name = displayName(d.mac, d.hostname || d.mac);
  let html = `<tr>
    <td>${statusBadge(d.status)}</td>
    <td class="mono">${escapeHtml(d.ip)}</td>
    <td>
      <button class="link-cell" data-mac-link="${escapeHtml(d.mac)}" title="Apri profilo dispositivo">${escapeHtml(name)}</button>
      ${trustBadgeHtml(d.mac)}
    </td>
    <td class="mono">${escapeHtml(d.mac)}</td>
    <td>${escapeHtml(d.vendor) || '<span class="muted">—</span>'}</td>
    <td>${escapeHtml(deviceType) || '<span class="muted">—</span>'}</td>
    <td>${riskBadgeHtml(risk)}</td>
    <td>${formatPorts(d.open_ports) || '<span class="muted">—</span>'}</td>
    <td>${formatTs(d.timestamp)}</td>
    <td>
      <div class="row-menu">
        <button class="kebab-btn" data-mac="${escapeHtml(d.mac)}" aria-label="Azioni">${ICON("kebab")}</button>
        ${menuOpen ? `<div class="row-menu-drop">
          <button data-action="details" data-mac="${escapeHtml(d.mac)}">${ICON("eye")}Vedi dettagli</button>
          <button data-mac-link="${escapeHtml(d.mac)}">${ICON("monitor")}Profilo completo</button>
          <button data-action="trust" data-mac="${escapeHtml(d.mac)}">${ICON("shield")}${trusted ? "Rimuovi fiducia" : "Segna come fidato"}</button>
          <button data-action="copy" data-mac="${escapeHtml(d.mac)}">${ICON("copy")}Copia MAC</button>
        </div>` : ""}
      </div>
    </td>
  </tr>`;

  if (expanded) {
    const history = sightingsForMac(d.mac).slice(-15).reverse();
    html += `<tr class="detail-row"><td colspan="10">
      <div class="detail-grid">
        <div><span>Hostname</span>${escapeHtml(d.hostname) || "—"}</div>
        <div><span>Vendor</span>${escapeHtml(d.vendor) || "—"}</div>
        <div><span>Tipo dispositivo</span>${escapeHtml(deviceType) || "—"}</div>
        <div><span>Punteggio di rischio</span>${riskBadgeHtml(risk)}</div>
        <div><span>Porte aperte</span>${formatPorts(d.open_ports) || "—"}</div>
        <div><span>Prima rilevazione</span>${formatTs(firstSeenTs(d.mac))}</div>
      </div>
      <div class="detail-history">
        ${history.map((h) => `<div class="detail-history-row"><span class="mono">${formatTs(h.timestamp)}</span>${statusBadge(h.status)}<span>${escapeHtml(h.ip)}</span></div>`).join("") || '<p class="muted">Nessuna cronologia disponibile.</p>'}
      </div>
    </td></tr>`;
  }
  return html;
}

/* ---------------------------------------------------------------------- *
 * WiFi page (KPI + grafici + tabella grezza)
 * ---------------------------------------------------------------------- */

/** Per ogni MAC, i SSID specifici cercati (probe con SSID non vuoto) con relativo conteggio. */
function computeWifiSsidCorrelation(rows) {
  const byMac = new Map();
  for (const r of rows) {
    if (!r.ssid || !r.ssid.trim()) continue;
    if (!byMac.has(r.mac)) byMac.set(r.mac, { mac: r.mac, vendor: r.vendor || "", ssids: new Map(), total: 0, lastTs: 0 });
    const entry = byMac.get(r.mac);
    if (!entry.vendor && r.vendor) entry.vendor = r.vendor;
    entry.ssids.set(r.ssid, (entry.ssids.get(r.ssid) || 0) + 1);
    entry.total += 1;
    const ts = parseTs(r.timestamp) || 0;
    if (ts > entry.lastTs) entry.lastTs = ts;
  }
  return [...byMac.values()]
    .map((e) => ({ ...e, ssidList: [...e.ssids.entries()].sort((a, b) => b[1] - a[1]) }))
    .sort((a, b) => b.lastTs - a.lastTs);
}

function renderWifiCorrelation(container) {
  container.innerHTML = `
    <div class="card-head">
      <h2>Dispositivi che cercano una rete specifica</h2>
      <span class="card-sub">MAC che hanno pubblicizzato l'SSID cercato nei probe (aggregato)</span>
      <div class="filter-row" style="margin:0;">
        <div class="search-input">${ICON("search")}<input type="text" id="wifi-corr-search" placeholder="Cerca per MAC, vendor, SSID…"></div>
      </div>
    </div>
    <div class="table-scroll">
      <table class="data-table">
        <thead><tr><th>MAC</th><th>Vendor</th><th>SSID cercati</th><th>Probe totali</th><th>Ultimo avvistamento</th></tr></thead>
        <tbody id="wifi-corr-body"></tbody>
      </table>
      <p class="empty-state hidden" id="wifi-corr-empty">Nessun probe con SSID specifico nel log caricato: molti device moderni non lo trasmettono più per privacy, quindi è normale che questa lista sia corta o vuota.</p>
      <div id="wifi-corr-pagination"></div>
    </div>`;

  document.getElementById("wifi-corr-search").addEventListener("input", () => { getPagination("wifi-corr").page = 1; renderWifiCorrelationBody(); });
  renderWifiCorrelationBody();
}

function renderWifiCorrelationBody() {
  const searchEl = document.getElementById("wifi-corr-search");
  const body = document.getElementById("wifi-corr-body");
  if (!searchEl || !body) return;

  const search = searchEl.value.trim().toLowerCase();
  const all = computeWifiSsidCorrelation(state.wifiRows);
  const rows = all.filter((e) => {
    if (!search) return true;
    const ssidText = e.ssidList.map(([s]) => s).join(" ");
    return `${e.mac} ${e.vendor} ${ssidText}`.toLowerCase().includes(search);
  });

  const info = paginate(rows, "wifi-corr");
  body.innerHTML = info.pageRows.map((e) => `<tr>
    <td class="mono">${escapeHtml(e.mac)}</td>
    <td>${escapeHtml(e.vendor) || '<span class="muted">—</span>'}</td>
    <td>${e.ssidList.map(([ssid, count]) => `${escapeHtml(ssid)} (${count})`).join(", ")}</td>
    <td>${e.total}</td>
    <td>${formatTs(new Date(e.lastTs).toISOString())}</td>
  </tr>`).join("");
  document.getElementById("wifi-corr-empty").classList.toggle("hidden", rows.length > 0);
  document.getElementById("wifi-corr-pagination").innerHTML = rows.length ? paginationHtml("wifi-corr", info) : "";
  wirePagination(document.getElementById("wifi-corr-pagination"), "wifi-corr", renderWifiCorrelationBody);
}

function renderWifiSection(container) {
  container.innerHTML = `
    <div class="card-head">
      <h2>Log probe grezzo</h2>
      <span class="card-sub">un probe request per riga — per approfondimento o export</span>
      <div class="filter-row" style="margin:0;">
        <div class="search-input">${ICON("search")}<input type="text" id="wifi-search" placeholder="Cerca per MAC, SSID, vendor…"></div>
      </div>
    </div>
    <div class="table-scroll">
      <table class="data-table" id="wifi-table">
        <thead><tr>
          <th data-sort="timestamp">Timestamp</th>
          <th data-sort="mac">MAC</th>
          <th data-sort="vendor">Vendor</th>
          <th data-sort="ssid">SSID cercato</th>
          <th data-sort="rssi">Segnale</th>
          <th data-sort="channel">Canale</th>
        </tr></thead>
        <tbody id="wifi-table-body"></tbody>
      </table>
      <p class="empty-state hidden" id="wifi-empty">Nessun probe — controlla la sorgente dati in Impostazioni.</p>
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
    <td>${escapeHtml(r.ssid) || '<span class="muted">nascosto/vuoto</span>'}</td>
    <td>${signalBarsHtml(r.rssi)}</td>
    <td>${escapeHtml(r.channel)}</td>
  </tr>`).join("");
  document.getElementById("wifi-empty").classList.toggle("hidden", rows.length > 0);
  document.getElementById("wifi-pagination").innerHTML = rows.length ? paginationHtml("wifi-raw", info) : "";
  wirePagination(document.getElementById("wifi-pagination"), "wifi-raw", renderWifiTableBody);
}

function renderWifiPage(container) {
  const wifiLast24h = state.wifiRows.filter((r) => within24h(parseTs(r.timestamp)));
  const distinctMacs = new Set(wifiLast24h.map((r) => r.mac));
  const withSsid = wifiLast24h.filter((r) => r.ssid && r.ssid.trim());
  const avg = avgRssi(wifiLast24h);
  const knownVendors = new Set(wifiLast24h.map((r) => r.vendor).filter((v) => v && v.trim()));
  const wifiStatus = state.sourceStatus.wifi;

  container.innerHTML = `
    ${wifiStatus?.truncated ? `
      <div class="page-section info-banner">
        ${ICON("layers")}
        <span>Log probe WiFi da ${formatBytes(wifiStatus.totalBytes)}: per restare veloce la dashboard carica solo gli ultimi ${formatBytes(TAIL_FETCH_BYTES)} (i più recenti). Le viste sotto — comprese le 24h — sono corrette, ma "Trend" su 30 giorni potrebbe non coprire l'intero periodo. Imposta <code>--max-log-size-mb</code>/<code>--log-backup-count</code> sul daemon per contenere la crescita del file.</span>
      </div>
    ` : ""}
    <div class="page-section kpi-row">
      ${kpiTile({
        label: "Probe WiFi (24h)", icon: "wifi", tone: "blue",
        value: wifiLast24h.length, sub: `${distinctMacs.size} MAC distinti`,
        sparkValues: hourlyCounts(state.wifiRows), sparkColor: "var(--series-blue)",
      })}
      ${kpiTile({
        label: "SSID pubblicizzati", icon: "search", tone: "blue",
        value: withSsid.length,
        sub: wifiLast24h.length ? `${Math.round((withSsid.length / wifiLast24h.length) * 100)}% del totale (24h)` : "Nessun dato",
      })}
      ${kpiTile({
        label: "RSSI medio (24h)", icon: "radar", tone: "blue",
        value: avg === null ? "—" : avg, valueSuffix: avg === null ? "" : "dBm",
        sub: "Più vicino a 0 = segnale più forte",
      })}
      ${kpiTile({
        label: "Vendor noti", icon: "users", tone: "blue",
        value: knownVendors.size, sub: "Da OUI del MAC (24h)",
      })}
    </div>

    <div class="page-section grid-3">
      <div class="card">
        <div class="card-head"><h2>Attività probe <span class="card-sub">ultime 24h</span></h2></div>
        <div class="bar-chart" id="chart-wifi-activity" data-empty="Nessun dato"></div>
      </div>
      <div class="card">
        <div class="card-head"><h2>Canali WiFi</h2><span class="card-sub">probe per canale (24h)</span></div>
        <div class="hbar-chart" id="chart-wifi-channel" data-empty="Nessun dato"></div>
      </div>
      <div class="card">
        <div class="card-head"><h2>Top vendor</h2><span class="card-sub">da OUI del MAC</span></div>
        <div class="hbar-chart" id="chart-wifi-vendor" data-empty="Nessun dato"></div>
      </div>
    </div>

    <div class="page-section card" id="wifi-traffic-mount"></div>

    <div class="page-section card" id="wifi-corr-mount"></div>

    <div class="page-section card" id="wifi-section-mount"></div>
  `;

  renderBarChart(document.getElementById("chart-wifi-activity"), hourlyCounts(state.wifiRows));
  renderHBarChart(document.getElementById("chart-wifi-channel"), wifiChannelSegments(wifiLast24h).map(([ch, n]) => [`Canale ${ch}`, n]), "var(--cat-3)");
  renderHBarChart(document.getElementById("chart-wifi-vendor"), wifiVendorSegments(wifiLast24h), "var(--series-blue)");
  renderWifiTrafficWidget(document.getElementById("wifi-traffic-mount"));
  renderWifiCorrelation(document.getElementById("wifi-corr-mount"));
  renderWifiSection(document.getElementById("wifi-section-mount"));
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
        label: "Advertisement BLE (24h)", icon: "bluetooth", tone: "orange",
        value: bleLast24h.length, sub: `${distinctMacs.size} MAC distinti`,
        sparkValues: hourlyCounts(state.bleRows), sparkColor: "var(--cat-2)",
      })}
      ${kpiTile({
        label: "Con nome pubblicizzato", icon: "eye", tone: "orange",
        value: named.length,
        sub: bleLast24h.length ? `${Math.round((named.length / bleLast24h.length) * 100)}% del totale (24h)` : "Nessun dato",
      })}
      ${kpiTile({
        label: "RSSI medio (24h)", icon: "wifi", tone: "orange",
        value: avg === null ? "—" : avg, valueSuffix: avg === null ? "" : "dBm",
        sub: "Più vicino a 0 = segnale più forte",
      })}
      ${kpiTile({
        label: "Manufacturer noti", icon: "users", tone: "orange",
        value: new Set(bleLast24h.flatMap((r) => (Array.isArray(r.manufacturer_ids) ? r.manufacturer_ids : []).filter((id) => BLE_COMPANY_IDS[id]))).size,
        sub: "Su company ID Bluetooth SIG riconosciuti",
      })}
    </div>

    <div class="page-section grid-2">
      <div class="card">
        <div class="card-head"><h2>Attività BLE <span class="card-sub">ultime 24h</span></h2></div>
        <div class="bar-chart" id="chart-ble-activity" data-empty="Nessun dato"></div>
      </div>
      <div class="card">
        <div class="card-head"><h2>Top manufacturer</h2><span class="card-sub">da company ID annunciati</span></div>
        <div class="hbar-chart" id="chart-ble-manufacturer" data-empty="Nessun dato"></div>
      </div>
    </div>

    <div class="page-section card" id="ble-top-mount"></div>

    <div class="page-section card" id="ble-section-mount"></div>
  `;

  renderBarChart(document.getElementById("chart-ble-activity"), hourlyCounts(state.bleRows));
  renderHBarChart(document.getElementById("chart-ble-manufacturer"), bleManufacturerSegments(bleLast24h), "var(--cat-2)");
  renderBleTopDevices(document.getElementById("ble-top-mount"));
  renderBleSection(document.getElementById("ble-section-mount"));
}

/** Top 10 device BLE per numero di avvistamenti, su tutto lo storico caricato. */
function computeBleTopDevices(rows, limit = 10) {
  const byMac = new Map();
  for (const r of rows) {
    if (!byMac.has(r.mac)) byMac.set(r.mac, { mac: r.mac, name: "", rssiSum: 0, rssiCount: 0, sightings: 0, lastTs: 0, manufacturerIds: new Set() });
    const e = byMac.get(r.mac);
    e.sightings += 1;
    if (!e.name && r.name) e.name = r.name;
    if (typeof r.rssi === "number") { e.rssiSum += r.rssi; e.rssiCount += 1; }
    const ts = parseTs(r.timestamp) || 0;
    if (ts > e.lastTs) e.lastTs = ts;
    for (const id of (Array.isArray(r.manufacturer_ids) ? r.manufacturer_ids : [])) e.manufacturerIds.add(id);
  }
  return [...byMac.values()]
    .map((e) => ({
      ...e,
      avgRssi: e.rssiCount ? Math.round(e.rssiSum / e.rssiCount) : null,
      manufacturer: e.manufacturerIds.size ? bleCompanyLabel([...e.manufacturerIds][0]) : "",
    }))
    .sort((a, b) => b.sightings - a.sightings)
    .slice(0, limit);
}

function renderBleTopDevices(container) {
  const top = computeBleTopDevices(state.bleRows, 10);
  container.innerHTML = `
    <div class="card-head"><h2>Dispositivi più ricorrenti</h2><span class="card-sub">top 10 per numero di avvistamenti, su tutto lo storico caricato</span></div>
    ${top.length ? `<div class="table-scroll"><table class="data-table">
      <thead><tr><th>#</th><th>Dispositivo</th><th>Manufacturer</th><th>Segnale medio</th><th>Avvistamenti</th><th>Ultimo avvistamento</th></tr></thead>
      <tbody>${top.map((d, i) => `<tr>
        <td class="mono">${i + 1}</td>
        <td>${escapeHtml(d.name) || `<span class="mono muted">${escapeHtml(d.mac)}</span>`}</td>
        <td>${escapeHtml(d.manufacturer) || '<span class="muted">—</span>'}</td>
        <td>${signalBarsHtml(d.avgRssi)}</td>
        <td>${d.sightings}</td>
        <td>${formatTs(new Date(d.lastTs).toISOString())}</td>
      </tr>`).join("")}</tbody>
    </table></div>` : '<p class="empty-state">Nessun advertisement BLE nel log caricato.</p>'}
  `;
}

function renderBleSection(container) {
  container.innerHTML = `
    <div class="card-head">
      <h2>Log advertisement grezzo</h2>
      <span class="card-sub">un advertisement per riga — per approfondimento o export</span>
      <div class="filter-row" style="margin:0;">
        <div class="search-input">${ICON("search")}<input type="text" id="ble-search" placeholder="Cerca per MAC, nome, manufacturer…"></div>
      </div>
    </div>
    <div class="table-scroll">
      <table class="data-table" id="ble-table">
        <thead><tr>
          <th data-sort="timestamp">Timestamp</th>
          <th data-sort="mac">MAC</th>
          <th data-sort="name">Nome</th>
          <th>Manufacturer</th>
          <th data-sort="rssi">Segnale</th>
          <th>Servizi</th>
        </tr></thead>
        <tbody id="ble-table-body"></tbody>
      </table>
      <p class="empty-state hidden" id="ble-empty">Nessun advertisement — abilita <code>--ble</code> sul daemon e controlla la sorgente dati in Impostazioni.</p>
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
  body.innerHTML = info.pageRows.map((r) => `<tr>
    <td>${formatTs(r.timestamp)}</td>
    <td class="mono">${escapeHtml(r.mac)}</td>
    <td>${escapeHtml(r.name) || '<span class="muted">—</span>'}</td>
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
    container.innerHTML = '<p class="empty-state">Nessun dispositivo da mostrare. Esegui una discovery e ricarica i dati.</p>';
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
    const label = escapeHtml(dev.hostname || dev.vendor || "Dispositivo");
    const shortLabel = label.length > 14 ? `${label.slice(0, 13)}…` : label;
    const risk = computeRiskScore(dev, fingerprintByMac.get(dev.mac), alertsByMac.get(dev.mac));
    const level = riskLevel(risk);
    const hasRiskRing = risk >= 15;
    const ringColor = hasRiskRing ? `var(--status-${level.tone})` : "var(--surface)";
    const ringWidth = hasRiskRing ? 3 : 2.5;
    nodeEls.push(`<g class="netmap-node" data-mac="${escapeHtml(dev.mac)}" data-tip="${escapeHtml(dev.hostname || dev.mac)} — ${escapeHtml(dev.ip)} — ${escapeHtml(dev.status)} — Rischio: ${risk} (${escapeHtml(level.label)})" transform="translate(${x.toFixed(1)},${y.toFixed(1)})">
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
      <span><span class="dot" style="background:var(--status-warning)"></span>Nuovo</span>
      <span><span class="dot" style="background:var(--status-muted)"></span>Offline</span>
      <span><span class="dot" style="background:var(--status-serious)"></span>Anello = rischio medio/alto</span>
    </div>
    <p class="field-hint">Clicca su un nodo per aprire il profilo completo del dispositivo.</p>`;
  container.querySelectorAll(".netmap-node").forEach((el) => {
    attachTooltip(el, el.dataset.tip);
    el.addEventListener("click", () => goToDevice(el.dataset.mac));
  });
}

/* ---------------------------------------------------------------------- *
 * Pages
 * ---------------------------------------------------------------------- */

function renderRecentAlertsWidget(container) {
  const alerts = computeAlerts().filter((a) => !isDismissed(a.id)).slice(0, 5);
  container.innerHTML = `
    <div class="card-head">
      <h2>Ultimi avvisi</h2>
      <button class="btn btn-icon" id="recent-alerts-all" title="Vedi tutti gli avvisi" aria-label="Vedi tutti gli avvisi">${ICON("bell")}</button>
    </div>
    <div class="alert-list">${alerts.length ? alerts.map(alertItemHtml).join("") : '<p class="empty-state">Nessun avviso attivo.</p>'}</div>
  `;
  document.getElementById("recent-alerts-all").addEventListener("click", () => { window.location.hash = "#/avvisi"; });
  container.querySelectorAll("[data-dismiss]").forEach((btn) => {
    btn.addEventListener("click", () => { toggleDismiss(btn.dataset.dismiss); renderRecentAlertsWidget(container); updateNavBadge(); });
  });
}

function renderDashboard(container) {
  const lanCurrent = latestLanByMac(state.lanRows);
  const online = lanCurrent.filter((d) => d.status !== "offline").length;
  const total = lanCurrent.length;
  const newLast24h = state.lanRows.filter((r) => r.status === "new" && within24h(parseTs(r.timestamp))).length;
  const wifiLast24h = state.wifiRows.filter((r) => within24h(parseTs(r.timestamp)));
  const activeAlerts = computeAlerts().filter((a) => !isDismissed(a.id));

  container.innerHTML = `
    <div class="page-section kpi-row">
      ${kpiTile({
        label: "Host attivi", icon: "monitor", tone: "good",
        value: online, valueSuffix: `/ ${total}`,
        sub: `${total ? Math.round((online / total) * 100) : 0}% attivi`,
        sparkValues: hourlyDistinctMac(state.lanRows.filter((r) => r.status !== "offline")), sparkColor: "var(--status-good)",
      })}
      ${kpiTile({
        label: "Probe WiFi (24h)", icon: "wifi", tone: "blue",
        value: wifiLast24h.length,
        sub: `${new Set(wifiLast24h.map((r) => r.mac)).size} MAC distinti`,
        sparkValues: hourlyCounts(state.wifiRows), sparkColor: "var(--series-blue)",
      })}
      ${kpiTile({
        label: "Dispositivi nuovi", icon: "users", tone: "violet",
        value: newLast24h, sub: "Nelle ultime 24h",
        sparkValues: hourlyCounts(state.lanRows.filter((r) => r.status === "new")), sparkColor: "var(--series-violet)",
      })}
      ${kpiTile({
        label: "Alert attivi", icon: "shield", tone: "critical",
        value: activeAlerts.length,
        sub: activeAlerts.length ? "Richiedono attenzione" : "Nessun avviso attivo",
        subTone: activeAlerts.length ? "critical" : "good",
      })}
    </div>

    <div class="page-section grid-2">
      <div class="card">
        <div class="card-head"><h2>Distribuzione per rischio</h2><span class="card-sub">su porte esposte e alert collegati</span></div>
        <div id="donut-risk"></div>
      </div>
      <div class="card" id="recent-alerts-mount"></div>
    </div>

    <div class="page-section card" id="nearby-section-mount"></div>

    <div class="page-section card" id="host-section-mount"></div>

    <div class="page-section grid-3">
      <div class="card">
        <div class="card-head"><h2>Distribuzione per vendor</h2></div>
        <div id="donut-vendor"></div>
      </div>
      <div class="card">
        <div class="card-head"><h2>Stato host</h2></div>
        <div id="donut-status"></div>
      </div>
      <div class="card">
        <div class="card-head"><h2>Attività rete <span class="card-sub">ultime 24h</span></h2></div>
        <div class="bar-chart" id="chart-lan-activity" data-empty="Nessun dato"></div>
      </div>
    </div>
  `;

  renderDonut(document.getElementById("donut-risk"), riskSegments(lanCurrent), "Dispositivi");
  renderRecentAlertsWidget(document.getElementById("recent-alerts-mount"));
  renderNearbySection(document.getElementById("nearby-section-mount"));
  renderHostSection(document.getElementById("host-section-mount"));
  renderDonut(document.getElementById("donut-vendor"), vendorSegments(lanCurrent), "Totale");
  renderDonut(document.getElementById("donut-status"), statusSegments(lanCurrent), "Totale");
  renderBarChart(document.getElementById("chart-lan-activity"), hourlyCounts(state.lanRows));
}

function renderHost(container) {
  container.innerHTML = `<div class="card" id="host-section-mount"></div>`;
  renderHostSection(document.getElementById("host-section-mount"));
}

function renderMappa(container) {
  container.innerHTML = `<div class="card">
    <div class="card-head"><h2>Mappa rete</h2><span class="card-sub">Topologia schematica basata sui dispositivi noti</span></div>
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

  const backButton = `<div class="page-section" style="margin-bottom:10px;">
    <button class="btn btn-icon" id="device-back" title="Torna a Host">${ICON("arrow-left")}</button>
  </div>`;

  if (!lanCurrent && !history.length && !wifiHits.length && !bleHits.length) {
    container.innerHTML = `${backButton}<div class="card">
      <p class="empty-state">Nessun dato per il MAC <span class="mono">${escapeHtml(mac)}</span>. Potrebbe non essere mai stato rilevato, oppure non comparire più nei log caricati.</p>
    </div>`;
    document.getElementById("device-back").addEventListener("click", () => { window.location.hash = "#/host"; });
    return;
  }

  const risk = lanCurrent ? computeRiskScore(lanCurrent, fingerprint, deviceAlerts) : null;
  const label = getDeviceLabel(mac);
  const title = displayName(mac, lanCurrent?.hostname || fingerprint?.device_type || mac);

  container.innerHTML = `
    ${backButton}
    <div class="page-section card device-profile-head">
      <div class="device-profile-title">
        <h2>${escapeHtml(title)}</h2>
        <span class="mono">${escapeHtml(mac)}</span>
        ${lanCurrent ? statusBadge(lanCurrent.status) : '<span class="badge status-offline"><span class="dot"></span>Non su LAN</span>'}
        ${risk !== null ? riskBadgeHtml(risk) : ""}
        ${trustBadgeHtml(mac)}
      </div>
      <div class="detail-grid">
        <div><span>IP</span>${lanCurrent ? escapeHtml(lanCurrent.ip) : "—"}</div>
        <div><span>Vendor</span>${escapeHtml(lanCurrent?.vendor) || "—"}</div>
        <div><span>Tipo dispositivo</span>${escapeHtml(fingerprint?.device_type) || "—"}</div>
        <div><span>Porte aperte</span>${formatPorts(lanCurrent?.open_ports) || "—"}</div>
        <div><span>Prima rilevazione</span>${formatTs(firstSeenTs(mac))}</div>
        <div><span>Ultima attività LAN</span>${lanCurrent ? formatTs(lanCurrent.timestamp) : "—"}</div>
      </div>
      <div class="device-label-editor">
        <div class="field">
          <label for="device-name-input">Nome personalizzato</label>
          <input type="text" id="device-name-input" value="${escapeHtml(label.name)}" placeholder="es. iPhone di Marco">
        </div>
        <button class="btn ${label.trusted ? "btn-primary" : ""}" id="device-trust-toggle">
          ${ICON("shield")}${label.trusted ? "Fidato — rimuovi" : "Segna come fidato"}
        </button>
      </div>
    </div>

    <div class="page-section grid-2">
      <div class="card">
        <div class="card-head"><h2>Cronologia LAN</h2><span class="card-sub">${history.length} rilevazioni</span></div>
        <div class="table-scroll">
          <table class="data-table"><thead><tr><th>Timestamp</th><th>Stato</th><th>IP</th><th>Porte</th></tr></thead>
          <tbody>${history.slice(-30).reverse().map((h) => `<tr>
            <td>${formatTs(h.timestamp)}</td><td>${statusBadge(h.status)}</td>
            <td class="mono">${escapeHtml(h.ip)}</td><td>${formatPorts(h.open_ports) || '<span class="muted">—</span>'}</td>
          </tr>`).join("") || '<tr><td colspan="4"><p class="empty-state">Nessuna cronologia LAN.</p></td></tr>'}</tbody></table>
        </div>
      </div>
      <div class="card">
        <div class="card-head"><h2>Alert collegati</h2><span class="card-sub">${deviceAlerts.length} totali</span></div>
        <div class="alert-list">${deviceAlerts.length ? deviceAlerts.slice(0, 20).map(alertItemHtml).join("") : '<p class="empty-state">Nessun alert per questo dispositivo.</p>'}</div>
      </div>
    </div>

    <div class="page-section grid-2">
      <div class="card">
        <div class="card-head"><h2>Probe WiFi</h2><span class="card-sub">${wifiHits.length} catturati</span></div>
        <div class="table-scroll">
          <table class="data-table"><thead><tr><th>Timestamp</th><th>SSID</th><th>RSSI</th><th>Canale</th></tr></thead>
          <tbody>${wifiHits.slice(0, 30).map((r) => `<tr>
            <td>${formatTs(r.timestamp)}</td><td>${escapeHtml(r.ssid) || '<span class="muted">nascosto/vuoto</span>'}</td>
            <td>${r.rssi ?? '<span class="muted">—</span>'}</td><td>${escapeHtml(r.channel)}</td>
          </tr>`).join("") || '<tr><td colspan="4"><p class="empty-state">Nessun probe WiFi per questo MAC.</p></td></tr>'}</tbody></table>
        </div>
      </div>
      <div class="card">
        <div class="card-head"><h2>Advertisement BLE</h2><span class="card-sub">${bleHits.length} catturati</span></div>
        <div class="table-scroll">
          <table class="data-table"><thead><tr><th>Timestamp</th><th>Nome</th><th>RSSI</th></tr></thead>
          <tbody>${bleHits.slice(0, 30).map((r) => `<tr>
            <td>${formatTs(r.timestamp)}</td><td>${escapeHtml(r.name) || '<span class="muted">—</span>'}</td><td>${r.rssi ?? '<span class="muted">—</span>'}</td>
          </tr>`).join("") || '<tr><td colspan="3"><p class="empty-state">Nessun advertisement BLE per questo MAC.</p></td></tr>'}</tbody></table>
        </div>
      </div>
    </div>
    <p class="field-hint">I MAC dei probe WiFi e degli advertisement BLE sono spesso randomizzati dai dispositivi moderni e possono non coincidere con il MAC dell'interfaccia LAN dello stesso device: le sezioni sopra restano vuote in quel caso, non è un errore.</p>
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
}

function renderScansioni(container) {
  container.innerHTML = `<div class="page-section card" id="scansioni-mount"></div>`;
  renderScansioniBody(document.getElementById("scansioni-mount"));
}

function renderScansioniBody(container) {
  const cycles = computeScanCycles();
  const info = paginate(cycles, "scansioni");
  container.innerHTML = `
    <div class="card-head"><h2>Cronologia scansioni LAN</h2><span class="card-sub">${cycles.length} cicli ricostruiti dal log di discovery</span></div>
    <div class="table-scroll">
      <table class="data-table">
        <thead><tr><th>Orario</th><th>Dispositivi visti</th><th>Nuovi</th><th>Offline</th></tr></thead>
        <tbody>
          ${info.pageRows.map((c) => `<tr>
            <td>${formatTs(new Date(c.startTs).toISOString())}</td>
            <td>${c.deviceCount}</td>
            <td>${c.newCount ? `<span class="badge status-new"><span class="dot"></span>${c.newCount}</span>` : '<span class="muted">0</span>'}</td>
            <td>${c.offlineCount ? `<span class="badge status-offline"><span class="dot"></span>${c.offlineCount}</span>` : '<span class="muted">0</span>'}</td>
          </tr>`).join("")}
        </tbody>
      </table>
      ${cycles.length ? "" : '<p class="empty-state">Nessun ciclo di scansione nel log caricato.</p>'}
      <div id="scansioni-pagination"></div>
    </div>
  `;
  document.getElementById("scansioni-pagination").innerHTML = cycles.length ? paginationHtml("scansioni", info) : "";
  wirePagination(document.getElementById("scansioni-pagination"), "scansioni", () => renderScansioniBody(container));
}

function alertItemHtml(a) {
  const dismissed = isDismissed(a.id);
  const identifier = a.mac ? `MAC ${escapeHtml(a.mac)}` : a.ip ? `IP ${escapeHtml(a.ip)}` : null;
  return `<div class="alert-item ${dismissed ? "is-dismissed" : ""}">
    <span class="alert-icon sev-${a.severity}">${ICON(a.icon || "alert-triangle")}</span>
    <div class="alert-body">
      <div class="alert-title">${escapeHtml(a.title)}${a.source === "detect" ? `<span class="source-tag">${ICON("shield")}Rilevato dal daemon</span>` : ""}</div>
      <div class="alert-desc">${escapeHtml(a.desc)}</div>
      <div class="alert-meta"><span>${formatTs(a.ts ? new Date(a.ts).toISOString() : "")}</span>${identifier ? `<span>${identifier}</span>` : ""}</div>
    </div>
    <div class="alert-actions">
      <button class="btn btn-icon" data-dismiss="${escapeHtml(a.id)}" title="${dismissed ? "Ripristina" : "Ignora"}">${ICON(dismissed ? "refresh" : "x")}</button>
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
    .sort((a, b) => a.label.localeCompare(b.label, "it"));
  if (!typesPresent.some((t) => t.type === state.alertsTypeFilter) && state.alertsTypeFilter !== "all") {
    state.alertsTypeFilter = "all"; // il tipo selezionato non compare più tra gli alert correnti
  }

  container.innerHTML = `
    <div class="card">
      <div class="card-head">
        <h2>Avvisi</h2>
        <div class="filter-row" style="margin:0;">
          <select class="select-control" id="alerts-type-filter">
            <option value="all">Tutte le tipologie</option>
            ${typesPresent.map((t) => `<option value="${escapeHtml(t.type)}">${escapeHtml(t.label)}</option>`).join("")}
          </select>
          <select class="select-control" id="alerts-filter">
            <option value="active">Attivi</option>
            <option value="all">Tutti</option>
            <option value="dismissed">Ignorati</option>
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
    if (state.alertsFilter === "active") list = list.filter((a) => !isDismissed(a.id));
    if (state.alertsFilter === "dismissed") list = list.filter((a) => isDismissed(a.id));
    if (state.alertsTypeFilter !== "all") list = list.filter((a) => a.type === state.alertsTypeFilter);
    const el = document.getElementById("alert-list");
    if (!list.length) { el.innerHTML = '<p class="empty-state">Nessun avviso in questa categoria.</p>'; return; }
    el.innerHTML = list.map(alertItemHtml).join("");
    el.querySelectorAll("[data-dismiss]").forEach((btn) => {
      btn.addEventListener("click", () => { toggleDismiss(btn.dataset.dismiss); renderAlertList(); updateNavBadge(); });
    });
  }

  function renderPresetChips() {
    const presets = getAlertPresets();
    const row = document.getElementById("preset-row");
    row.innerHTML = `
      ${presets.map((p, i) => `<button class="preset-chip ${state.alertsFilter === p.statusFilter && state.alertsTypeFilter === p.typeFilter ? "active" : ""}" data-preset="${i}">
        ${escapeHtml(p.name)}<span class="preset-chip-x" data-preset-del="${i}">${ICON("x")}</span>
      </button>`).join("")}
      <button class="preset-chip preset-chip-add" id="preset-add">${ICON("bell")}Salva filtro attuale</button>
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
      const name = prompt('Nome per questo filtro (es. "Solo critici attivi"):');
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
  let tone = "muted", text = "Non ancora caricato";
  if (s) {
    if (s.ok && s.count > 0) {
      tone = "good";
      text = `Attivo — ${s.count} righe caricate`;
      if (s.truncated) text += ` (solo le più recenti — file da ${formatBytes(s.totalBytes)}, limitate le ultime ${formatBytes(TAIL_FETCH_BYTES)})`;
    } else if (s.ok && s.count === 0) {
      tone = "warning"; text = "Sorgente raggiungibile, nessuna riga ancora";
    } else {
      tone = "muted"; text = "Non rilevato (file assente o modulo non attivo sul daemon)";
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
      <div class="card-head"><h2>Stato moduli</h2><span class="card-sub">dedotto dai dati effettivamente caricati, non da un endpoint di stato</span></div>
      <div class="module-status-list">
        ${moduleStatusRow("Discovery LAN", "lan")}
        ${moduleStatusRow("Probe WiFi (--wifi-iface)", "wifi")}
        ${moduleStatusRow("Scan BLE (--ble)", "ble")}
        ${moduleStatusRow("Fingerprinting (--fingerprint)", "fingerprint")}
        ${moduleStatusRow("Traffico WiFi stimato", "wifiTraffic")}
        ${moduleStatusRow("Alert di detection", "alerts")}
      </div>
    </div>

    <div class="page-section card">
      <div class="card-head"><h2>Sorgenti dati</h2></div>
      <div class="settings-grid">
        <div class="field"><label for="set-lan-url">Log discovery LAN (.jsonl)</label><input type="text" id="set-lan-url" value="${escapeHtml(getSetting("lanUrl"))}"></div>
        <div class="field"><label for="set-lan-file">Oppure carica file locale</label><input type="file" id="set-lan-file" accept=".jsonl,.ndjson,.json,.txt"></div>
        <div class="field"><label for="set-wifi-url">Log probe WiFi (.jsonl)</label><input type="text" id="set-wifi-url" value="${escapeHtml(getSetting("wifiUrl"))}"></div>
        <div class="field"><label for="set-wifi-file">Oppure carica file locale</label><input type="file" id="set-wifi-file" accept=".jsonl,.ndjson,.json,.txt"></div>
        <div class="field"><label for="set-ble-url">Log scan BLE (.jsonl)</label><input type="text" id="set-ble-url" value="${escapeHtml(getSetting("bleUrl"))}"></div>
        <div class="field"><label for="set-ble-file">Oppure carica file locale</label><input type="file" id="set-ble-file" accept=".jsonl,.ndjson,.json,.txt"></div>
        <div class="field"><label for="set-alerts-url">Log alert di detection (.jsonl)</label><input type="text" id="set-alerts-url" value="${escapeHtml(getSetting("alertsUrl"))}"></div>
        <div class="field"><label for="set-fingerprint-url">Log fingerprint device (.jsonl)</label><input type="text" id="set-fingerprint-url" value="${escapeHtml(getSetting("fingerprintUrl"))}"></div>
        <div class="field"><label for="set-wifi-traffic-url">Log traffico WiFi (.jsonl)</label><input type="text" id="set-wifi-traffic-url" value="${escapeHtml(getSetting("wifiTrafficUrl"))}"></div>
        <div class="field">
          <label for="set-refresh">Auto-refresh</label>
          <select id="set-refresh" class="select-control">
            <option value="0">Disattivato</option>
            <option value="1000">Ogni 1s</option>
            <option value="5000">Ogni 5s</option>
            <option value="15000">Ogni 15s</option>
            <option value="30000">Ogni 30s</option>
            <option value="60000">Ogni 60s</option>
          </select>
        </div>
      </div>
      <p class="field-hint">Se la dashboard è aperta come file locale (<code>file://</code>) il fetch via URL non funziona per motivi di sicurezza del browser: usa i campi "carica file locale", oppure servi questa cartella con <code>python3 -m http.server</code>. Con log molto grandi, intervalli di 1-5s rileggono l'intero file ad ogni ciclo: se noti rallentamenti, alza l'intervallo. I log di alert/fingerprint sono opzionali: se i moduli di detection corrispondenti non sono attivi sul daemon, l'assenza del file non genera errori.</p>
    </div>

    <div class="page-section card">
      <div class="card-head"><h2>Informazioni rete</h2><span class="card-sub">etichetta del gateway per la Mappa rete (pagina momentaneamente nascosta)</span></div>
      <div class="settings-grid">
        <div class="field"><label for="set-net-label">Nome rete</label><input type="text" id="set-net-label" value="${escapeHtml(getSetting("netLabel"))}" placeholder="Casa_Network"></div>
        <div class="field"><label for="set-net-gateway">Gateway</label><input type="text" id="set-net-gateway" value="${escapeHtml(getSetting("netGateway"))}" placeholder="192.168.1.1"></div>
      </div>
      <p class="field-hint">Home Sentinel non rileva automaticamente questi valori: inseriscili manualmente (es. l'IP del router). Il gateway ha priorità sul nome rete se sono entrambi impostati.</p>
    </div>

    <div class="page-section card">
      <div class="card-head"><h2>Aspetto</h2><span class="card-sub">"Sistema" segue il tema del sistema operativo</span></div>
      <div class="theme-choice">
        <button type="button" data-theme-choice="light" class="${themeMode === "light" ? "active" : ""}">${ICON("sun")}Chiaro</button>
        <button type="button" data-theme-choice="dark" class="${themeMode === "dark" ? "active" : ""}">${ICON("moon")}Scuro</button>
        <button type="button" data-theme-choice="system" class="${themeMode === "system" ? "active" : ""}">${ICON("monitor")}Sistema</button>
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
  document.getElementById("set-refresh").addEventListener("change", (e) => { setSetting("refreshMs", e.target.value); setupRefreshTimer(); });

  [["set-net-label", "netLabel"], ["set-net-gateway", "netGateway"]].forEach(([id, key]) => {
    document.getElementById(id).addEventListener("change", (e) => { setSetting(key, e.target.value.trim()); });
  });
  container.querySelectorAll("[data-theme-choice]").forEach((btn) => {
    btn.addEventListener("click", () => setThemeMode(btn.dataset.themeChoice));
  });
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
    ${exportCardHtml("Dispositivi LAN (stato attuale)", `${lanCurrent.length} dispositivi`, "lan-current")}
    ${exportCardHtml("Log completo discovery LAN", `${state.lanRows.length} righe`, "lan-log")}
    ${exportCardHtml("Probe WiFi", `${state.wifiRows.length} righe`, "wifi")}
    ${exportCardHtml("Scan BLE", `${state.bleRows.length} righe`, "ble")}
    ${exportCardHtml("Fingerprint device", `${state.fingerprintRows.length} righe`, "fingerprint")}
    ${exportCardHtml("Traffico WiFi stimato", `${state.wifiTrafficRows.length} righe`, "wifi-traffic")}
    ${exportCardHtml("Avvisi", `${alerts.length} avvisi`, "alerts")}
  </div>`;
  container.querySelectorAll("[data-export]").forEach((btn) => {
    btn.addEventListener("click", () => doExport(btn.dataset.export, btn.dataset.format));
  });
}

function stripInternal(dev) { const { _ts, ...rest } = dev; return rest; }
function toJsonBlob(rows) { return new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" }); }
function toCsvBlob(rows) {
  if (!rows.length) return new Blob([""], { type: "text/csv" });
  const headers = Object.keys(rows[0]);
  const esc = (v) => {
    const raw = Array.isArray(v) ? v.join(";") : v;
    const s = String(raw ?? "");
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
  else if (key === "alerts") {
    rows = computeAlerts().map((a) => ({ id: a.id, severity: a.severity, title: a.title, desc: a.desc, mac: a.mac, timestamp: a.ts ? new Date(a.ts).toISOString() : "" }));
    filename = "alerts";
  } else return;
  downloadBlob(format === "json" ? toJsonBlob(rows) : toCsvBlob(rows), `${filename}.${format}`);
}

function renderAiuto(container) {
  container.innerHTML = `
    <div class="card help-section">
      <h3>Come funziona</h3>
      <p>Home Sentinel è composto da un daemon Python (<code>home_sentinel.py</code>) che scrive file JSON Lines in continuo — <code>lan_discovery.jsonl</code> per la discovery LAN, <code>wifi_probes.jsonl</code> per i probe request WiFi, <code>ble_discovery.jsonl</code> per lo scan BLE, <code>fingerprint_discovery.jsonl</code> per il tipo di device rilevato e <code>alerts_detection.jsonl</code> per gli alert dei moduli di detection (un oggetto JSON per riga, tutti opzionali tranne LAN; scrivono di default in <code>/var/log/home-sentinel/</code>) — e da questa dashboard statica che li legge e li visualizza. Configura le sorgenti in <strong>Impostazioni</strong>.</p>
    </div>
    <div class="card help-section">
      <h3>Stato dei dispositivi</h3>
      <div class="legend-strip">
        <span>${statusBadge("online")} rilevato nell'ultimo ciclo di scan</span>
        <span>${statusBadge("new")} visto per la prima volta</span>
        <span>${statusBadge("offline")} non risponde più al momento</span>
      </div>
    </div>
    <div class="card help-section">
      <h3>Pagine</h3>
      <ul>
        <li><strong>Dashboard</strong> — panoramica: host attivi, probe WiFi, dispositivi nuovi, avvisi, distribuzione per vendor e stato, attività 24h.</li>
        <li><strong>Host</strong> — elenco completo dei dispositivi LAN noti, con tipo di device e punteggio di rischio (0-100, su porte esposte e alert collegati); il nome host è un link al profilo completo del dispositivo. Da lì, o dal menu azioni di una riga, puoi assegnare un nome personalizzato e contrassegnare un device come fidato (riduce il rumore: punteggio di rischio più basso, alert collegati meno severi).</li>
        <li><strong>Scansioni</strong> — cronologia dei cicli di discovery LAN.</li>
        <li><strong>Timeline</strong> — feed cronologico unificato di tutti gli eventi notevoli (nuovi/offline, alert, fingerprint), filtrabile per categoria.</li>
        <li><strong>WiFi</strong> — probe request 802.11 nei dintorni: MAC/SSID/vendor visti, RSSI medio, distribuzione per canale, top vendor, traffico WiFi stimato per device, elenco probe grezzi.</li>
        <li><strong>BLE</strong> — attività Bluetooth Low Energy nei dintorni: device visti, manufacturer riconosciuti, RSSI medio, elenco advertisement grezzi.</li>
        <li><strong>Avvisi</strong> — nuovi dispositivi e porte a rischio aperte (calcolati dalla dashboard), più gli alert dei moduli di detection lato daemon se attivi (ARP spoofing, rogue DHCP, evil twin WiFi, possibile deauth/disassoc flood, nuove porte su device noti); filtrabili per tipologia e stato, con filtri salvabili come preset.</li>
        <li><strong>Trend</strong> — andamento di nuovi dispositivi e alert negli ultimi 7/30 giorni, calcolato sulla cronologia già caricata.</li>
        <li><strong>Impostazioni</strong> — stato dei moduli del daemon (dedotto dai dati caricati), sorgenti dati (JSON Lines), tema.</li>
        <li><strong>Esporta</strong> — scarica i dati correnti in CSV o JSON.</li>
      </ul>
      <p class="field-hint">Premi <strong>Ctrl+K</strong> (o <strong>⌘K</strong>) in qualsiasi momento per la ricerca globale su pagine, dispositivi e avvisi.</p>
    </div>
    <div class="card help-section">
      <h3>Limiti da conoscere</h3>
      <ul>
        <li>Il traffico WiFi stimato non è banda reale (Mbps): il Pi non è il gateway, quindi conta solo i byte dei frame dati catturati durante il channel hopping su un'interfaccia in monitor mode — una frazione parziale del traffico reale, utile come indicatore relativo (chi trasmette di più rispetto agli altri device) ma non come misura di banda assoluta.</li>
        <li>I MAC dei probe WiFi e gli indirizzi BLE sono spesso randomizzati dai dispositivi moderni: vanno letti come indicatore di attività nei dintorni, non come identificativo univoco nel tempo.</li>
        <li>I nomi dei manufacturer BLE derivano da un elenco parziale e curato dei company ID Bluetooth SIG più comuni: un ID non riconosciuto viene mostrato come "ID 0x...".</li>
        <li>Il punteggio di rischio (colonna "Rischio" in Host) è un'euristica su porte esposte e alert collegati, non una valutazione di sicurezza formale; contrassegnare un device come fidato lo attenua (punteggio ridotto, alert collegati un livello meno severo) ma non lo nasconde né lo esclude dai controlli.</li>
        <li>Il rilevamento di deauth/disassoc flood è a soglia (numero di frame in una finestra temporale): reti WiFi molto affollate o con roaming aggressivo possono generare falsi positivi occasionali, e un attacco molto lento/distribuito nel tempo può restare sotto soglia.</li>
        <li>"Trend" e "Timeline" sono calcolati lato browser sui file JSONL già caricati: la rotazione automatica dei log sul daemon (<code>--max-log-size-mb</code>) e il caricamento "solo coda" della dashboard sui file più grandi (>4MB) riducono di conseguenza la cronologia disponibile, specie oltre i 7-30 giorni.</li>
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
  { id: "dashboard", label: "Dashboard", icon: "grid", title: "Dashboard", subtitle: "Panoramica della rete locale", render: renderDashboard },
  { id: "host", label: "Host", icon: "monitor", title: "Host", subtitle: "Elenco completo dei dispositivi LAN", render: renderHost },
  { id: "scansioni", label: "Scansioni", icon: "radar", title: "Scansioni", subtitle: "Cronologia dei cicli di discovery LAN", render: renderScansioni },
  { id: "timeline", label: "Timeline", icon: "clock", title: "Timeline", subtitle: "Feed cronologico unificato di tutti gli eventi", render: renderTimeline },
  { id: "wifi", label: "WiFi", icon: "wifi", title: "Probe WiFi", subtitle: "Probe request 802.11 rilevati nei dintorni", render: renderWifiPage },
  { id: "ble", label: "BLE", icon: "bluetooth", title: "Dispositivi BLE", subtitle: "Scan passivo Bluetooth Low Energy nei dintorni", render: renderBlePage },
  { id: "avvisi", label: "Avvisi", icon: "bell", title: "Avvisi", subtitle: "Eventi che richiedono attenzione", render: renderAvvisi },
  { id: "trend", label: "Trend", icon: "trending-up", title: "Trend", subtitle: "Andamento storico di dispositivi e alert", render: renderTrend },
  { id: "impostazioni", label: "Impostazioni", icon: "sliders", title: "Impostazioni", subtitle: "Sorgenti dati, rete e aspetto", render: renderImpostazioni },
  { id: "esporta", label: "Esporta", icon: "download", title: "Esporta", subtitle: "Scarica i dati raccolti", render: renderEsporta },
  { id: "aiuto", label: "Aiuto", icon: "help", title: "Aiuto", subtitle: "Guida rapida a Home Sentinel", render: renderAiuto },
];

function getRouteById(id) { return ROUTES.find((r) => r.id === id) || ROUTES[0]; }

function renderSidebarNav() {
  const nav = document.getElementById("sidebar-nav");
  nav.innerHTML = ROUTES.map((r) => `<button class="nav-item ${r.id === state.route ? "active" : ""}" data-route="${r.id}">
    ${ICON(r.icon)}<span>${escapeHtml(r.label)}</span>
    ${r.id === "avvisi" ? `<span class="nav-badge hidden" id="nav-badge-avvisi"></span>` : ""}
  </button>`).join("");
  nav.querySelectorAll("[data-route]").forEach((btn) => {
    btn.addEventListener("click", () => { window.location.hash = `#/${btn.dataset.route}`; });
  });
  updateNavBadge();
}

function updateNavBadge() {
  const badge = document.getElementById("nav-badge-avvisi");
  if (!badge) return;
  const count = computeAlerts().filter((a) => !isDismissed(a.id)).length;
  if (count > 0) { badge.textContent = String(count); badge.classList.remove("hidden"); }
  else { badge.classList.add("hidden"); }
}

function onRouteChange() {
  const hash = window.location.hash.replace(/^#\/?/, "") || "dashboard";
  const [id, param] = hash.split("/");
  state.expandedMac = null;
  state.openMenuMac = null;

  if (id === "device" && param) {
    state.route = "device";
    state.deviceProfileMac = decodeURIComponent(param);
    document.querySelectorAll(".nav-item").forEach((el) => el.classList.remove("active"));
    document.getElementById("page-title").textContent = "Profilo dispositivo";
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
  text.textContent = ok === false ? "Errore" : ok === true ? "Online" : "In attesa";
  dropdown.innerHTML = `
    <div><strong>Sorgente LAN</strong><br>${escapeHtml(state.lanFile ? `${state.lanFile.name} (file locale)` : getSetting("lanUrl"))}</div>
    <div><strong>Sorgente WiFi</strong><br>${escapeHtml(state.wifiFile ? `${state.wifiFile.name} (file locale)` : getSetting("wifiUrl"))}</div>
    <div><strong>Sorgente BLE</strong><br>${escapeHtml(state.bleFile ? `${state.bleFile.name} (file locale)` : getSetting("bleUrl"))}</div>
    <div><strong>Righe caricate</strong><br>${state.lanRows.length} LAN · ${state.wifiRows.length} WiFi · ${state.bleRows.length} BLE · ${state.alertsRows.length} alert · ${state.fingerprintRows.length} fingerprint</div>
  `;
}

const THEME_OPTIONS = [
  { key: "light", label: "Chiaro", icon: "sun" },
  { key: "dark", label: "Scuro", icon: "moon" },
  { key: "system", label: "Sistema", icon: "monitor" },
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
  if (state.route === "impostazioni") renderCurrentRoute();
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

const CMDK_TYPE_LABELS = { page: "Pagine", device: "Dispositivi", alert: "Avvisi" };
let cmdkResults = [];
let cmdkActiveIndex = 0;

function computeSearchIndex() {
  const items = [];
  for (const r of ROUTES) {
    items.push({ type: "page", label: r.label, sub: r.subtitle, icon: r.icon, action: () => { window.location.hash = `#/${r.id}`; } });
  }
  for (const d of latestLanByMac(state.lanRows)) {
    items.push({
      type: "device", label: d.hostname || d.mac, sub: `${d.ip} · ${d.vendor || "vendor sconosciuto"}`, icon: "monitor",
      keywords: `${d.ip} ${d.mac} ${d.hostname || ""} ${d.vendor || ""}`, action: () => goToDevice(d.mac),
    });
  }
  for (const a of computeAlerts().slice(0, 100)) {
    items.push({
      type: "alert", label: a.title, sub: a.desc, icon: a.icon,
      keywords: `${a.title} ${a.desc} ${a.mac || ""}`, action: () => { window.location.hash = "#/avvisi"; },
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
  if (!cmdkResults.length) { el.innerHTML = '<p class="empty-state">Nessun risultato.</p>'; return; }

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
  setupTopbar();
  setupCmdk();
  updateStatusPill();

  document.addEventListener("click", (e) => {
    if (state.openMenuMac && !e.target.closest(".row-menu")) { state.openMenuMac = null; renderHostTableBody(); }
  });
  window.addEventListener("hashchange", onRouteChange);

  onRouteChange();
  setupRefreshTimer();
  loadAll();
}

document.addEventListener("DOMContentLoaded", init);
