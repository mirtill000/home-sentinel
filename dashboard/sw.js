/* Service worker della dashboard Home Sentinel.
 *
 * Serve a due cose, entrambe pensate per un'app che gira sulla LAN di casa:
 *   1. renderla installabile (con il manifest) e avviabile anche quando il Pi non risponde —
 *      il guscio dell'app resta in cache, così si apre e spiega cosa non va invece di mostrare
 *      l'errore di rete del browser;
 *   2. non intromettersi mai sui dati: i log JSONL e le chiamate all'API sono sempre presi dalla
 *      rete, mai dalla cache. Una dashboard di monitoraggio che mostra dati vecchi credendoli
 *      freschi sarebbe peggio di una che non si apre.
 */

const SHELL_CACHE = "home-sentinel-shell-v1";
const SHELL_FILES = ["./", "./index.html", "./app.js", "./style.css", "./manifest.webmanifest", "./icon.svg", "./house-isometric.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== SHELL_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin) return;

  // Dati: sempre dalla rete, mai serviti da cache (vedi punto 2 sopra).
  if (url.pathname.endsWith(".jsonl") || url.pathname.startsWith("/api/")) return;

  // Guscio: rete quando c'è (così un aggiornamento dell'app arriva subito), cache come rete di
  // sicurezza quando il server è irraggiungibile.
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(SHELL_CACHE).then((cache) => cache.put(event.request, copy)).catch(() => {});
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html")))
  );
});
