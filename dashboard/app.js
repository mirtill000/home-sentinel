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
};

function ICON(name) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICON_PATHS[name] || ""}</svg>`;
}

/* ---------------------------------------------------------------------- *
 * Settings (persisted in localStorage)
 * ---------------------------------------------------------------------- */

const SETTINGS_KEYS = {
  lanUrl: "hs.lanUrl", wifiUrl: "hs.wifiUrl", refreshMs: "hs.refreshMs", theme: "hs.theme",
  netLabel: "hs.net.label", netSubnet: "hs.net.subnet", netGateway: "hs.net.gateway", netDns: "hs.net.dns",
};
const SETTINGS_DEFAULTS = {
  lanUrl: "lan_discovery.jsonl", wifiUrl: "wifi_probes.jsonl", refreshMs: "30000", theme: "dark",
  netLabel: "", netSubnet: "", netGateway: "", netDns: "",
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
const WIFI_TABLE_LIMIT = 300;

/* ---------------------------------------------------------------------- *
 * State
 * ---------------------------------------------------------------------- */

const state = {
  lanRows: [],
  wifiRows: [],
  lanFile: null,
  wifiFile: null,
  lanSort: { key: "last_seen", dir: -1 },
  wifiSort: { key: "timestamp", dir: -1 },
  route: "dashboard",
  refreshTimer: null,
  lastFetchOk: null,
  openMenuMac: null,
  expandedMac: null,
  alertsFilter: "active",
  dismissedAlerts: new Set(JSON.parse(localStorage.getItem(DISMISSED_KEY) || "[]")),
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

async function fetchJsonl(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status} su ${url}`);
  return parseJsonl(await res.text());
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
    state.lanRows = state.lanFile ? await readJsonlFile(state.lanFile) : await fetchJsonl(getSetting("lanUrl"));
  } catch (err) {
    errors.push(`LAN: ${err.message}`);
    state.lanRows = state.lanRows || [];
  }

  try {
    state.wifiRows = state.wifiFile ? await readJsonlFile(state.wifiFile) : await fetchJsonl(getSetting("wifiUrl"));
  } catch (err) {
    errors.push(`WiFi: ${err.message}`);
    state.wifiRows = state.wifiRows || [];
  }

  state.lastFetchOk = errors.length === 0;
  if (errors.length) showError(errors.join(" — "));
  document.getElementById("last-updated").textContent = new Date().toLocaleTimeString("it-IT");

  updateStatusPill();
  updateNetworkCard();
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

function sightingsForMac(mac) {
  return state.lanRows.filter((r) => r.mac === mac).sort((a, b) => (parseTs(a.timestamp) || 0) - (parseTs(b.timestamp) || 0));
}
function firstSeenTs(mac) {
  const s = sightingsForMac(mac);
  return s.length ? s[0].timestamp : null;
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

function computeAlerts() {
  const lanCurrent = latestLanByMac(state.lanRows);
  const alerts = [];

  for (const row of state.lanRows) {
    if (row.status !== "new") continue;
    const ts = parseTs(row.timestamp);
    if (!within24h(ts)) continue;
    alerts.push({
      id: `new:${row.mac}:${row.timestamp}`,
      severity: "info",
      title: "Nuovo dispositivo rilevato",
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
      severity: isCritical ? "critical" : "serious",
      title: "Porta a rischio aperta",
      desc: `${dev.hostname || dev.mac} (${dev.ip}) espone ${risky.map((p) => `${p}/${RISK_PORTS[p]}`).join(", ")}.`,
      mac: dev.mac,
      ts: dev._ts,
    });
  }

  alerts.sort((a, b) => (b.ts || 0) - (a.ts || 0));
  return alerts;
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
          <th data-sort="open_ports">Porte aperte</th>
          <th data-sort="last_seen">Ultima attività</th>
          <th></th>
        </tr></thead>
        <tbody id="host-table-body"></tbody>
      </table>
      <p class="empty-state hidden" id="host-empty">Nessun dispositivo — controlla le sorgenti dati in Impostazioni.</p>
    </div>`;

  document.getElementById("host-search").addEventListener("input", renderHostTableBody);
  document.getElementById("host-status-filter").addEventListener("change", renderHostTableBody);
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
    return `${d.ip} ${d.mac} ${d.hostname} ${d.vendor}`.toLowerCase().includes(search);
  });
  rows = sortRows(rows, state.lanSort.key, state.lanSort.dir);

  body.innerHTML = rows.map(hostRowHtml).join("");
  document.getElementById("host-empty").classList.toggle("hidden", rows.length > 0);

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
}

function hostRowHtml(d) {
  const menuOpen = state.openMenuMac === d.mac;
  const expanded = state.expandedMac === d.mac;
  let html = `<tr>
    <td>${statusBadge(d.status)}</td>
    <td class="mono">${escapeHtml(d.ip)}</td>
    <td>${escapeHtml(d.hostname) || '<span class="muted">—</span>'}</td>
    <td class="mono">${escapeHtml(d.mac)}</td>
    <td>${escapeHtml(d.vendor) || '<span class="muted">—</span>'}</td>
    <td>${formatPorts(d.open_ports) || '<span class="muted">—</span>'}</td>
    <td>${formatTs(d.timestamp)}</td>
    <td>
      <div class="row-menu">
        <button class="kebab-btn" data-mac="${escapeHtml(d.mac)}" aria-label="Azioni">${ICON("kebab")}</button>
        ${menuOpen ? `<div class="row-menu-drop">
          <button data-action="details" data-mac="${escapeHtml(d.mac)}">${ICON("eye")}Vedi dettagli</button>
          <button data-action="copy" data-mac="${escapeHtml(d.mac)}">${ICON("copy")}Copia MAC</button>
        </div>` : ""}
      </div>
    </td>
  </tr>`;

  if (expanded) {
    const history = sightingsForMac(d.mac).slice(-15).reverse();
    html += `<tr class="detail-row"><td colspan="8">
      <div class="detail-grid">
        <div><span>Hostname</span>${escapeHtml(d.hostname) || "—"}</div>
        <div><span>Vendor</span>${escapeHtml(d.vendor) || "—"}</div>
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
 * WiFi probes table (Scansioni page)
 * ---------------------------------------------------------------------- */

function renderWifiSection(container) {
  container.innerHTML = `
    <div class="card-head">
      <h2>Probe WiFi recenti</h2>
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
          <th data-sort="rssi">RSSI</th>
          <th data-sort="channel">Canale</th>
        </tr></thead>
        <tbody id="wifi-table-body"></tbody>
      </table>
      <p class="empty-state hidden" id="wifi-empty">Nessun probe — controlla la sorgente dati in Impostazioni.</p>
    </div>`;

  document.getElementById("wifi-search").addEventListener("input", renderWifiTableBody);
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
  rows = sortRows(rows, state.wifiSort.key, state.wifiSort.dir).slice(0, WIFI_TABLE_LIMIT);

  body.innerHTML = rows.map((r) => `<tr>
    <td>${formatTs(r.timestamp)}</td>
    <td class="mono">${escapeHtml(r.mac)}</td>
    <td>${escapeHtml(r.vendor) || '<span class="muted">—</span>'}</td>
    <td>${escapeHtml(r.ssid) || '<span class="muted">nascosto/vuoto</span>'}</td>
    <td>${escapeHtml(r.rssi) || '<span class="muted">—</span>'}</td>
    <td>${escapeHtml(r.channel)}</td>
  </tr>`).join("");
  document.getElementById("wifi-empty").classList.toggle("hidden", rows.length > 0);
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

  nodes.forEach((dev, i) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    const x = cx + R * Math.cos(angle);
    const y = cy + R * Math.sin(angle);
    links.push(`<line class="netmap-link" x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}"/>`);
    const color = dev.status === "offline" ? "var(--status-muted)" : dev.status === "new" ? "var(--status-warning)" : "var(--status-good)";
    const label = escapeHtml(dev.hostname || dev.vendor || "Dispositivo");
    const shortLabel = label.length > 14 ? `${label.slice(0, 13)}…` : label;
    nodeEls.push(`<g class="netmap-node" data-tip="${escapeHtml(dev.hostname || dev.mac)} — ${escapeHtml(dev.ip)} — ${escapeHtml(dev.status)}" transform="translate(${x.toFixed(1)},${y.toFixed(1)})">
      <circle r="9" style="fill:${color}" stroke="var(--surface)" stroke-width="2.5"/>
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
    </div>`;
  container.querySelectorAll(".netmap-node").forEach((el) => attachTooltip(el, el.dataset.tip));
}

/* ---------------------------------------------------------------------- *
 * Pages
 * ---------------------------------------------------------------------- */

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
        label: "Avvisi attivi", icon: "alert-triangle", tone: "critical",
        value: activeAlerts.length,
        sub: activeAlerts.length ? "Richiede attenzione" : "Nessun avviso",
        subTone: activeAlerts.length ? "critical" : undefined,
      })}
    </div>

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

    <div class="page-section card" id="host-section-mount"></div>
  `;

  renderDonut(document.getElementById("donut-vendor"), vendorSegments(lanCurrent), "Totale");
  renderDonut(document.getElementById("donut-status"), statusSegments(lanCurrent), "Totale");
  renderBarChart(document.getElementById("chart-lan-activity"), hourlyCounts(state.lanRows));
  renderHostSection(document.getElementById("host-section-mount"));
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

function renderScansioni(container) {
  const cycles = computeScanCycles().slice(0, 150);
  container.innerHTML = `
    <div class="page-section card">
      <div class="card-head"><h2>Cronologia scansioni LAN</h2><span class="card-sub">${cycles.length} cicli ricostruiti dal log di discovery</span></div>
      <div class="table-scroll">
        <table class="data-table">
          <thead><tr><th>Orario</th><th>Dispositivi visti</th><th>Nuovi</th><th>Offline</th></tr></thead>
          <tbody>
            ${cycles.map((c) => `<tr>
              <td>${formatTs(new Date(c.startTs).toISOString())}</td>
              <td>${c.deviceCount}</td>
              <td>${c.newCount ? `<span class="badge status-new"><span class="dot"></span>${c.newCount}</span>` : '<span class="muted">0</span>'}</td>
              <td>${c.offlineCount ? `<span class="badge status-offline"><span class="dot"></span>${c.offlineCount}</span>` : '<span class="muted">0</span>'}</td>
            </tr>`).join("")}
          </tbody>
        </table>
        ${cycles.length ? "" : '<p class="empty-state">Nessun ciclo di scansione nel log caricato.</p>'}
      </div>
    </div>
    <div class="card" id="wifi-section-mount"></div>
  `;
  renderWifiSection(document.getElementById("wifi-section-mount"));
}

function alertItemHtml(a) {
  const dismissed = isDismissed(a.id);
  return `<div class="alert-item ${dismissed ? "is-dismissed" : ""}">
    <span class="alert-icon sev-${a.severity}">${ICON("alert-triangle")}</span>
    <div class="alert-body">
      <div class="alert-title">${escapeHtml(a.title)}</div>
      <div class="alert-desc">${escapeHtml(a.desc)}</div>
      <div class="alert-meta"><span>${formatTs(a.ts ? new Date(a.ts).toISOString() : "")}</span><span>MAC ${escapeHtml(a.mac || "—")}</span></div>
    </div>
    <div class="alert-actions">
      <button class="btn btn-icon" data-dismiss="${escapeHtml(a.id)}" title="${dismissed ? "Ripristina" : "Ignora"}">${ICON(dismissed ? "refresh" : "x")}</button>
    </div>
  </div>`;
}

function renderAvvisi(container) {
  const all = computeAlerts();
  container.innerHTML = `
    <div class="card">
      <div class="card-head">
        <h2>Avvisi</h2>
        <select class="select-control" id="alerts-filter">
          <option value="active">Attivi</option>
          <option value="all">Tutti</option>
          <option value="dismissed">Ignorati</option>
        </select>
      </div>
      <div class="alert-list" id="alert-list"></div>
    </div>`;

  document.getElementById("alerts-filter").value = state.alertsFilter;
  document.getElementById("alerts-filter").addEventListener("change", (e) => {
    state.alertsFilter = e.target.value;
    renderAlertList();
  });
  renderAlertList();

  function renderAlertList() {
    let list = all;
    if (state.alertsFilter === "active") list = all.filter((a) => !isDismissed(a.id));
    if (state.alertsFilter === "dismissed") list = all.filter((a) => isDismissed(a.id));
    const el = document.getElementById("alert-list");
    if (!list.length) { el.innerHTML = '<p class="empty-state">Nessun avviso in questa categoria.</p>'; return; }
    el.innerHTML = list.map(alertItemHtml).join("");
    el.querySelectorAll("[data-dismiss]").forEach((btn) => {
      btn.addEventListener("click", () => { toggleDismiss(btn.dataset.dismiss); renderAlertList(); updateNavBadge(); });
    });
  }
}

function renderImpostazioni(container) {
  const themeMode = getSetting("theme");
  container.innerHTML = `
    <div class="page-section card">
      <div class="card-head"><h2>Sorgenti dati</h2></div>
      <div class="settings-grid">
        <div class="field"><label for="set-lan-url">Log discovery LAN (.jsonl)</label><input type="text" id="set-lan-url" value="${escapeHtml(getSetting("lanUrl"))}"></div>
        <div class="field"><label for="set-lan-file">Oppure carica file locale</label><input type="file" id="set-lan-file" accept=".jsonl,.ndjson,.json,.txt"></div>
        <div class="field"><label for="set-wifi-url">Log probe WiFi (.jsonl)</label><input type="text" id="set-wifi-url" value="${escapeHtml(getSetting("wifiUrl"))}"></div>
        <div class="field"><label for="set-wifi-file">Oppure carica file locale</label><input type="file" id="set-wifi-file" accept=".jsonl,.ndjson,.json,.txt"></div>
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
      <p class="field-hint">Se la dashboard è aperta come file locale (<code>file://</code>) il fetch via URL non funziona per motivi di sicurezza del browser: usa i campi "carica file locale", oppure servi questa cartella con <code>python3 -m http.server</code>. Con log molto grandi, intervalli di 1-5s rileggono l'intero file ad ogni ciclo: se noti rallentamenti, alza l'intervallo.</p>
    </div>

    <div class="page-section card">
      <div class="card-head"><h2>Informazioni rete</h2><span class="card-sub">mostrate nella sidebar, inserite manualmente</span></div>
      <div class="settings-grid">
        <div class="field"><label for="set-net-label">Nome rete</label><input type="text" id="set-net-label" value="${escapeHtml(getSetting("netLabel"))}" placeholder="Casa_Network"></div>
        <div class="field"><label for="set-net-subnet">Subnet</label><input type="text" id="set-net-subnet" value="${escapeHtml(getSetting("netSubnet"))}" placeholder="192.168.1.0/24"></div>
        <div class="field"><label for="set-net-gateway">Gateway</label><input type="text" id="set-net-gateway" value="${escapeHtml(getSetting("netGateway"))}" placeholder="192.168.1.1"></div>
        <div class="field"><label for="set-net-dns">DNS</label><input type="text" id="set-net-dns" value="${escapeHtml(getSetting("netDns"))}" placeholder="1.1.1.1"></div>
      </div>
      <p class="field-hint">Home Sentinel non rileva automaticamente questi valori: usa la stessa subnet passata a <code>home_sentinel.py --subnet</code>.</p>
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
  document.getElementById("set-refresh").addEventListener("change", (e) => { setSetting("refreshMs", e.target.value); setupRefreshTimer(); });

  [["set-net-label", "netLabel"], ["set-net-subnet", "netSubnet"], ["set-net-gateway", "netGateway"], ["set-net-dns", "netDns"]].forEach(([id, key]) => {
    document.getElementById(id).addEventListener("change", (e) => { setSetting(key, e.target.value.trim()); updateNetworkCard(); });
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
      <p>Home Sentinel è composto da un daemon Python (<code>home_sentinel.py</code>) che scrive due file JSON Lines in continuo — <code>lan_discovery.jsonl</code> per la discovery LAN e <code>wifi_probes.jsonl</code> per i probe request WiFi (un oggetto JSON per riga) — e da questa dashboard statica che li legge e li visualizza. Configura le sorgenti in <strong>Impostazioni</strong>.</p>
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
        <li><strong>Host</strong> — elenco completo dei dispositivi LAN noti, con dettaglio e cronologia per singolo MAC.</li>
        <li><strong>Mappa rete</strong> — rappresentazione schematica della rete attorno al gateway configurato.</li>
        <li><strong>Scansioni</strong> — cronologia dei cicli di discovery LAN e dei probe WiFi grezzi.</li>
        <li><strong>Avvisi</strong> — nuovi dispositivi e porte potenzialmente a rischio aperte, generati dai dati reali.</li>
        <li><strong>Impostazioni</strong> — sorgenti dati (JSON Lines), informazioni di rete mostrate in sidebar, tema.</li>
        <li><strong>Esporta</strong> — scarica i dati correnti in CSV o JSON.</li>
      </ul>
    </div>
    <div class="card help-section">
      <h3>Limiti da conoscere</h3>
      <ul>
        <li>Nessun dato di traffico (Mbps): il daemon attuale misura solo presenza e porte aperte, non banda.</li>
        <li>I MAC dei probe WiFi sono spesso randomizzati dai dispositivi moderni: vanno letti come indicatore di attività nei dintorni, non come identificativo univoco.</li>
        <li>"Mappa rete" è una rappresentazione schematica (a stella attorno al gateway), non una topologia rilevata automaticamente.</li>
      </ul>
    </div>
  `;
}

/* ---------------------------------------------------------------------- *
 * Router / shell
 * ---------------------------------------------------------------------- */

const ROUTES = [
  { id: "dashboard", label: "Dashboard", icon: "grid", title: "Dashboard", subtitle: "Panoramica della rete locale", render: renderDashboard },
  { id: "host", label: "Host", icon: "monitor", title: "Host", subtitle: "Elenco completo dei dispositivi LAN", render: renderHost },
  { id: "mappa", label: "Mappa rete", icon: "network", title: "Mappa rete", subtitle: "Topologia schematica della rete", render: renderMappa },
  { id: "scansioni", label: "Scansioni", icon: "radar", title: "Scansioni", subtitle: "Cronologia dei cicli di discovery", render: renderScansioni },
  { id: "avvisi", label: "Avvisi", icon: "bell", title: "Avvisi", subtitle: "Eventi che richiedono attenzione", render: renderAvvisi },
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
  const id = window.location.hash.replace(/^#\/?/, "") || "dashboard";
  const route = getRouteById(id);
  state.route = route.id;
  state.expandedMac = null;
  state.openMenuMac = null;

  document.querySelectorAll(".nav-item").forEach((el) => el.classList.toggle("active", el.dataset.route === route.id));
  document.getElementById("page-title").textContent = route.title;
  document.getElementById("page-subtitle").textContent = route.subtitle;
  document.getElementById("page-icon").innerHTML = ICON(route.icon);

  renderCurrentRoute();
}

function renderCurrentRoute() {
  getRouteById(state.route).render(document.getElementById("view-root"));
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
    <div><strong>Righe caricate</strong><br>${state.lanRows.length} LAN · ${state.wifiRows.length} WiFi</div>
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

function updateNetworkCard() {
  document.getElementById("net-label").textContent = getSetting("netLabel") || "—";
  document.getElementById("net-subnet").textContent = getSetting("netSubnet") || "—";
  document.getElementById("net-gateway").textContent = getSetting("netGateway") || "—";
  document.getElementById("net-dns").textContent = getSetting("netDns") || "—";
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
 * Init
 * ---------------------------------------------------------------------- */

function init() {
  readUrlParams();
  initTheme();
  document.getElementById("icon-brand").innerHTML = ICON("wifi");
  document.getElementById("icon-wifi-small").innerHTML = ICON("wifi");
  document.getElementById("icon-refresh").innerHTML = ICON("refresh");

  renderSidebarNav();
  setupTopbar();
  updateStatusPill();
  updateNetworkCard();

  document.addEventListener("click", (e) => {
    if (state.openMenuMac && !e.target.closest(".row-menu")) { state.openMenuMac = null; renderHostTableBody(); }
  });
  window.addEventListener("hashchange", onRouteChange);

  onRouteChange();
  setupRefreshTimer();
  loadAll();
}

document.addEventListener("DOMContentLoaded", init);
