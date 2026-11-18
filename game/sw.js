// Service worker: makes the page installable, the game playable offline, and every load after the first one fast on a phone.
// The server lists every file the game needs with its modification time (/api/precache). The worker keeps a copy of all of them
// and, whenever it is online, refreshes only the files whose time changed (an update costs only what changed, not 7 MB).
// Pages and files are served from the copy; /api/ requests always go to the network (sync.js handles being offline).
// Older servers without /api/precache: falls back to the version check of before (/api/version empties the copy on change).
const CACHE = 'rpg-static-v2', MKEY = '/__rpg_manifest__', VKEY = '/__rpg_version__';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil((async () => { for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k); await self.clients.claim(); refreshAll(); })()));

let running = null, invalidated = Promise.resolve();
// compare the server's file list with the copy: drop changed and removed files now, fetch the missing ones in the background
async function refreshAll() {
  if (running) return running;
  let done; invalidated = new Promise((r) => (done = r));
  running = (async () => {
    try {
      const r = await fetch('/api/precache', { cache: 'no-store' });
      if (!r.ok) { await legacyVersion(); return; }
      const files = (await r.json()).files || {}, c = await caches.open(CACHE), oldRes = await c.match(MKEY), old = oldRes ? await oldRes.json() : {};
      for (const [p, t] of Object.entries(old)) if (files[p] !== t) await c.delete(p);
      await c.put(MKEY, new Response(JSON.stringify(Object.fromEntries(Object.entries(old).filter(([p, t]) => files[p] === t)))));
      done();
      const have = { ...Object.fromEntries(Object.entries(old).filter(([p, t]) => files[p] === t)) }, todo = Object.keys(files).filter((p) => !(p in have));
      for (let i = 0; i < todo.length; i += 8) {
        await Promise.all(todo.slice(i, i + 8).map(async (p) => { try { const res = await fetch(p, { cache: 'reload' }); if (res.ok) { await c.put(p, res); have[p] = files[p]; } } catch { /* offline again: next time */ } }));
        await c.put(MKEY, new Response(JSON.stringify(have)));
      }
      if (files['/index.html']) { const idx = await c.match('/index.html'); if (idx) await c.put('/', idx.clone()); }
    } catch { /* offline: keep the copy */ } finally { done(); running = null; }
  })();
  return running;
}
async function legacyVersion() {
  try {
    const r = await fetch('/api/version', { cache: 'no-store' }); if (!r.ok) return;
    const v = (await r.json()).version; if (!v) return;
    const c = await caches.open(CACHE), old = await c.match(VKEY), was = old ? await old.text() : null;
    if (was !== v) { await caches.delete(CACHE); const n = await caches.open(CACHE); await n.put(VKEY, new Response(v)); }
  } catch { /* offline */ }
}
async function cacheFirst(req) {
  const c = await caches.open(CACHE), hit = await c.match(req, { ignoreSearch: false }) || await c.match(new URL(req.url).pathname);
  if (hit) return hit;
  const res = await fetch(req); if (res.ok && res.type === 'basic') c.put(req, res.clone()).catch(() => {});
  return res;
}
// a page load: online, first bring the copy up to date (quick: it only drops changed files) and load fresh; offline, the copy
async function navigate(req) {
  try {
    await Promise.race([refreshQuick(), new Promise((r) => setTimeout(r, 2500))]);
    const res = await fetch(req); if (res.ok) return res; throw new Error(String(res.status));
  } catch {
    const c = await caches.open(CACHE);
    return (await c.match(req, { ignoreSearch: true })) || (await c.match('/index.html')) || (await c.match('/')) || Response.error();
  }
}
// on page load only the invalidation has to happen before the page is served; the downloads go on in the background
function refreshQuick() { refreshAll(); return invalidated; }
self.addEventListener('fetch', (e) => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/') || url.pathname.startsWith('/downloads/')) return;
  if (req.mode === 'navigate') { e.respondWith(navigate(req)); e.waitUntil(refreshAll()); return; }
  e.respondWith(cacheFirst(req).catch(() => fetch(req)));
});
self.addEventListener('message', (e) => { if (e.data === 'refresh') e.waitUntil(refreshAll()); });
