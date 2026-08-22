"use strict";

/* ---------------------------------------------------------------------- *
 * State
 * ---------------------------------------------------------------------- */

const state = {
  lanRows: [],       // parsed rows from lan_discovery.csv
  wifiRows: [],       // parsed rows from wifi_probes.csv
  lanSort: { key: "last_seen", dir: -1 },
  wifiSort: { key: "timestamp", dir: -1 },
  refreshTimer: null,
};

const WIFI_TABLE_LIMIT = 300;

/* ---------------------------------------------------------------------- *
 * CSV parsing (RFC4180-ish: handles quoted fields, embedded commas/quotes)
 * ---------------------------------------------------------------------- */

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else { inQuotes = false; }
      } else {
        field += c;
      }
      continue;
    }
    if (c === '"') { inQuotes = true; }
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c === "\r") { /* skip */ }
    else { field += c; }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  if (!rows.length) return [];

  const header = rows[0];
  return rows.slice(1)
    .filter((r) => r.length === header.length && r.some((v) => v !== ""))
    .map((r) => Object.fromEntries(header.map((key, idx) => [key, r[idx]])));
}

/* ---------------------------------------------------------------------- *
 * Data loading
 * ---------------------------------------------------------------------- */

async function fetchCsv(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status} su ${url}`);
  return parseCsv(await res.text());
}

function readCsvFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(parseCsv(String(reader.result)));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

async function loadAll() {
  hideError();
  const lanFile = document.getElementById("lan-file").files[0];
  const wifiFile = document.getElementById("wifi-file").files[0];
  const errors = [];

  try {
    state.lanRows = lanFile ? await readCsvFile(lanFile) : await fetchCsv(document.getElementById("lan-url").value.trim());
  } catch (err) {
    errors.push(`LAN: ${err.message}`);
  }

  try {
    state.wifiRows = wifiFile ? await readCsvFile(wifiFile) : await fetchCsv(document.getElementById("wifi-url").value.trim());
  } catch (err) {
    errors.push(`WiFi: ${err.message}`);
  }

  if (errors.length) showError(errors.join(" — "));
  document.getElementById("last-updated").textContent = `Aggiornato alle ${new Date().toLocaleTimeString("it-IT")}`;

  renderAll();
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
 * Derived data
 * ---------------------------------------------------------------------- */

function parseTs(value) {
  const t = Date.parse(value);
  return Number.isNaN(t) ? null : t;
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

function within24h(ts) {
  return ts !== null && ts >= Date.now() - 24 * 3600 * 1000;
}

/* ---------------------------------------------------------------------- *
 * Rendering: stats
 * ---------------------------------------------------------------------- */

function renderStats(lanCurrent, lanRows, wifiRows) {
  const online = lanCurrent.filter((d) => d.status !== "offline").length;
  const newLast24h = lanRows.filter((r) => r.status === "new" && within24h(parseTs(r.timestamp))).length;

  const wifiLast24h = wifiRows.filter((r) => within24h(parseTs(r.timestamp)));
  const macSet = new Set(wifiLast24h.map((r) => r.mac));

  document.getElementById("stat-online").textContent = online;
  document.getElementById("stat-total").textContent = lanCurrent.length;
  document.getElementById("stat-new").textContent = newLast24h;
  document.getElementById("stat-wifi-mac").textContent = macSet.size;
  document.getElementById("stat-wifi-probes").textContent = wifiLast24h.length;
}

/* ---------------------------------------------------------------------- *
 * Rendering: hourly bar charts (last 24h)
 * ---------------------------------------------------------------------- */

function hourlyBuckets(rows) {
  const buckets = new Array(24).fill(0);
  const now = new Date();
  now.setMinutes(0, 0, 0);
  for (const row of rows) {
    const ts = parseTs(row.timestamp);
    if (ts === null) continue;
    const hoursAgo = Math.floor((now.getTime() - new Date(ts).setMinutes(0, 0, 0)) / 3600000);
    if (hoursAgo >= 0 && hoursAgo < 24) buckets[23 - hoursAgo]++;
  }
  return buckets;
}

function renderBarChart(containerId, buckets) {
  const container = document.getElementById(containerId);
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
 * Rendering: top vendor horizontal bar chart
 * ---------------------------------------------------------------------- */

function renderVendorChart(wifiRows) {
  const container = document.getElementById("chart-vendor");
  container.innerHTML = "";

  const counts = new Map();
  for (const row of wifiRows) {
    const vendor = (row.vendor || "").trim() || "Sconosciuto";
    counts.set(vendor, (counts.get(vendor) || 0) + 1);
  }
  if (counts.size === 0) return;

  const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  const max = Math.max(...top.map(([, c]) => c), 1);

  for (const [vendor, count] of top) {
    const row = document.createElement("div");
    row.className = "hbar-row";

    const name = document.createElement("span");
    name.className = "hbar-name";
    name.textContent = vendor;
    name.title = vendor;

    const track = document.createElement("div");
    track.className = "hbar-track";
    const fill = document.createElement("div");
    fill.className = "hbar-fill";
    fill.style.width = `${Math.max((count / max) * 100, 4)}%`;
    attachTooltip(fill, `${vendor}: ${count}`);
    track.appendChild(fill);

    const value = document.createElement("span");
    value.className = "hbar-value";
    value.textContent = count;

    row.append(name, track, value);
    container.appendChild(row);
  }
}

/* ---------------------------------------------------------------------- *
 * Tooltip (shared, for chart marks)
 * ---------------------------------------------------------------------- */

function attachTooltip(el, text) {
  const tooltip = document.getElementById("tooltip");
  el.addEventListener("mouseenter", (e) => {
    tooltip.textContent = text;
    tooltip.classList.remove("hidden");
    positionTooltip(e);
  });
  el.addEventListener("mousemove", positionTooltip);
  el.addEventListener("mouseleave", () => tooltip.classList.add("hidden"));

  function positionTooltip(e) {
    tooltip.style.left = `${e.clientX}px`;
    tooltip.style.top = `${e.clientY - 6}px`;
  }
}

/* ---------------------------------------------------------------------- *
 * Rendering: LAN devices table
 * ---------------------------------------------------------------------- */

function statusBadge(status) {
  const labels = { online: "Online", new: "Nuovo", offline: "Offline" };
  const label = labels[status] || status;
  return `<span class="badge status-${status}"><span class="dot"></span>${label}</span>`;
}

function sortRows(rows, key, dir) {
  return [...rows].sort((a, b) => {
    const av = a[key] ?? "";
    const bv = b[key] ?? "";
    if (key === "last_seen" || key === "timestamp" || key === "_ts") {
      return ((a._ts ?? 0) - (b._ts ?? 0)) * dir;
    }
    if (key === "rssi") {
      return ((Number(av) || 0) - (Number(bv) || 0)) * dir;
    }
    return String(av).localeCompare(String(bv)) * dir;
  });
}

function renderLanTable(lanCurrent) {
  const search = document.getElementById("lan-search").value.trim().toLowerCase();
  const statusFilter = document.getElementById("lan-status-filter").value;

  let rows = lanCurrent.filter((d) => {
    if (statusFilter !== "all" && d.status !== statusFilter) return false;
    if (!search) return true;
    const haystack = `${d.ip} ${d.mac} ${d.hostname} ${d.vendor}`.toLowerCase();
    return haystack.includes(search);
  });

  rows = sortRows(rows, state.lanSort.key, state.lanSort.dir);

  const body = document.getElementById("lan-table-body");
  body.innerHTML = rows.map((d) => `
    <tr>
      <td>${statusBadge(d.status)}</td>
      <td>${escapeHtml(d.ip)}</td>
      <td>${escapeHtml(d.hostname) || "<span class=\"muted\">—</span>"}</td>
      <td>${escapeHtml(d.mac)}</td>
      <td>${escapeHtml(d.vendor) || "<span class=\"muted\">—</span>"}</td>
      <td>${escapeHtml(d.open_ports) || "<span class=\"muted\">—</span>"}</td>
      <td>${formatTs(d.timestamp)}</td>
    </tr>
  `).join("");

  document.getElementById("lan-empty").classList.toggle("hidden", rows.length > 0);
}

/* ---------------------------------------------------------------------- *
 * Rendering: WiFi probes table
 * ---------------------------------------------------------------------- */

function renderWifiTable(wifiRows) {
  const search = document.getElementById("wifi-search").value.trim().toLowerCase();

  let rows = wifiRows.filter((r) => {
    if (!search) return true;
    const haystack = `${r.mac} ${r.ssid} ${r.vendor}`.toLowerCase();
    return haystack.includes(search);
  }).map((r) => ({ ...r, _ts: parseTs(r.timestamp) || 0 }));

  rows = sortRows(rows, state.wifiSort.key, state.wifiSort.dir).slice(0, WIFI_TABLE_LIMIT);

  const body = document.getElementById("wifi-table-body");
  body.innerHTML = rows.map((r) => `
    <tr>
      <td>${formatTs(r.timestamp)}</td>
      <td>${escapeHtml(r.mac)}</td>
      <td>${escapeHtml(r.vendor) || "<span class=\"muted\">—</span>"}</td>
      <td>${escapeHtml(r.ssid) || "<span class=\"muted\">nascosto/vuoto</span>"}</td>
      <td>${escapeHtml(r.rssi) || "<span class=\"muted\">—</span>"}</td>
      <td>${escapeHtml(r.channel)}</td>
    </tr>
  `).join("");

  document.getElementById("wifi-empty").classList.toggle("hidden", rows.length > 0);
}

/* ---------------------------------------------------------------------- *
 * Helpers
 * ---------------------------------------------------------------------- */

function escapeHtml(value) {
  if (value === undefined || value === null) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatTs(value) {
  const ts = parseTs(value);
  if (ts === null) return escapeHtml(value);
  return new Date(ts).toLocaleString("it-IT");
}

/* ---------------------------------------------------------------------- *
 * Orchestration
 * ---------------------------------------------------------------------- */

function renderAll() {
  const lanCurrent = latestLanByMac(state.lanRows);
  renderStats(lanCurrent, state.lanRows, state.wifiRows);
  renderBarChart("chart-lan", hourlyBuckets(state.lanRows));
  renderBarChart("chart-wifi", hourlyBuckets(state.wifiRows));
  renderVendorChart(state.wifiRows);
  renderLanTable(lanCurrent);
  renderWifiTable(state.wifiRows);
}

function setupSorting(tableId, sortState, rerender) {
  document.querySelectorAll(`#${tableId} thead th`).forEach((th) => {
    th.addEventListener("click", () => {
      const key = th.dataset.sort;
      if (sortState.key === key) sortState.dir *= -1;
      else { sortState.key = key; sortState.dir = 1; }
      rerender();
    });
  });
}

function setupRefreshTimer() {
  if (state.refreshTimer) clearInterval(state.refreshTimer);
  const ms = Number(document.getElementById("refresh-interval").value);
  if (ms > 0) {
    state.refreshTimer = setInterval(() => {
      if (!document.hidden) loadAll();
    }, ms);
  }
}

function setupTheme() {
  const btn = document.getElementById("theme-toggle");
  const stored = localStorage.getItem("hs-theme");
  if (stored) document.documentElement.dataset.theme = stored;

  btn.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme
      || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("hs-theme", next);
  });
}

function readUrlParams() {
  const params = new URLSearchParams(window.location.search);
  if (params.has("lan")) document.getElementById("lan-url").value = params.get("lan");
  if (params.has("wifi")) document.getElementById("wifi-url").value = params.get("wifi");
}

function init() {
  setupTheme();
  readUrlParams();

  document.getElementById("refresh-now").addEventListener("click", loadAll);
  document.getElementById("refresh-interval").addEventListener("change", setupRefreshTimer);
  document.getElementById("lan-file").addEventListener("change", loadAll);
  document.getElementById("wifi-file").addEventListener("change", loadAll);
  document.getElementById("lan-search").addEventListener("input", () => renderLanTable(latestLanByMac(state.lanRows)));
  document.getElementById("lan-status-filter").addEventListener("change", () => renderLanTable(latestLanByMac(state.lanRows)));
  document.getElementById("wifi-search").addEventListener("input", () => renderWifiTable(state.wifiRows));

  setupSorting("lan-table", state.lanSort, () => renderLanTable(latestLanByMac(state.lanRows)));
  setupSorting("wifi-table", state.wifiSort, () => renderWifiTable(state.wifiRows));

  setupRefreshTimer();
  loadAll();
}

document.addEventListener("DOMContentLoaded", init);
