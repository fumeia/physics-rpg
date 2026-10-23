// Minimal service worker: it only makes the page installable as an app (home screen, full screen). It caches nothing,
// so every load goes to the server and a game update shows up right away.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
