// Service worker: makes the page installable, and makes every load after the first one fast on a phone.
// Static files (code, content, fonts) are served from a cache. On every page load the worker first asks the server for the
// game's version (/api/version, newest file time); if it changed, the cache is emptied, so an update shows up on the next load.
// Without a version (offline, or an old server) the cache is used as it is. /api/ requests always go to the network.
const CACHE = 'rpg-static-v1', VKEY = '/__rpg_version__';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
async function syncVersion() {
  try {
    const r = await fetch('/api/version', { cache: 'no-store' }); if (!r.ok) return;
    const v = (await r.json()).version; if (!v) return;
    const c = await caches.open(CACHE), old = await c.match(VKEY), was = old ? await old.text() : null;
    if (was !== v) { await caches.delete(CACHE); const n = await caches.open(CACHE); await n.put(VKEY, new Response(v)); }
  } catch { /* offline: keep the cache */ }
}
async function cacheFirst(req) {
  const c = await caches.open(CACHE), hit = await c.match(req, { ignoreSearch: false });
  if (hit) return hit;
  const res = await fetch(req); if (res.ok && res.type === 'basic') c.put(req, res.clone()).catch(() => {});
  return res;
}
self.addEventListener('fetch', (e) => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;
  if (req.mode === 'navigate') { e.respondWith(syncVersion().then(() => fetch(req)).catch(() => caches.match(req).then((r) => r || Response.error()))); return; }
  e.respondWith(cacheFirst(req).catch(() => fetch(req)));
});
