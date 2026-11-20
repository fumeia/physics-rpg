// Profile persistence: progress lives in localStorage (fast, works offline) and is mirrored to a JSON file by serve.py (safe).
// Offline-first and cross-device: every device plays on its own copy and syncs whenever the server is reachable (at start, after
// each save, when the device comes back online or the app comes back to the front, and every 45 s while visible). If the server
// copy changed since this device last synced, both are merged (src/merge.js: nothing done on either device is lost) instead of
// one overwriting the other. The server refuses a save that was not based on its current copy (409), so two devices never clobber
// each other. Without the save server (plain static hosting) the game still works; export/import is the fallback.
import { store, setSaveHook, profileName } from './store.js';
import { mergeSaves } from './merge.js';

const state = { available: false, status: 'browser only', last: 0, token: null, offline: false };
export const sync = state;
const listeners = new Set();
export const onSyncStatus = (fn) => listeners.add(fn);
const emit = () => listeners.forEach((f) => f(state));
export const headers = () => (localStorage.getItem('physics-rpg-token') ? { 'X-Token': localStorage.getItem('physics-rpg-token') } : {});
const api = (path, opt = {}) => fetch(path, { ...opt, headers: { ...headers(), ...(opt.headers || {}) }, cache: 'no-store' });
const url = () => `/api/profile/${encodeURIComponent(profileName())}`;

// the server copy this device last agreed with: the base of the next merge
const BASE_KEY = () => `physics-rpg-base:${profileName()}`;
function loadBase() { try { const s = localStorage.getItem(BASE_KEY()); return s ? JSON.parse(s) : null; } catch { return null; } }
function saveBase(st) { try { localStorage.setItem(BASE_KEY(), JSON.stringify(st)); } catch { try { localStorage.setItem(BASE_KEY(), JSON.stringify({ updated: st.updated, state: null })); } catch { /* full */ } } }
const clone = (x) => JSON.parse(JSON.stringify(x));
// a merge or a newer copy from another device replaced the progress in memory: main.js redraws
const replaced = () => window.dispatchEvent(new CustomEvent('store-replaced'));

const setStatus = (s, offline = false) => { state.status = s; state.offline = offline; emit(); };
let everReached = false;

export async function initSync() {
  try {
    let r = await api('/api/ping');
    if (r.status === 401) { const t = prompt('This server needs the access token (PHYSICS_RPG_TOKEN):'); if (t) { localStorage.setItem('physics-rpg-token', t.trim()); r = await api('/api/ping'); } }
    const j = r.ok ? await r.json().catch(() => ({})) : {}; if (!j.ok) throw new Error('no save server');
    state.available = true; everReached = true;
  } catch {
    // offline (or a plain static host): play on the copy of this device; if a save server was used before, keep trying
    state.available = !!loadBase(); setSaveHook(schedule); setStatus(state.available ? 'offline: saved on this device, syncs when online' : 'browser only (no save server)', state.available); watch(); return state;
  }
  await syncNow();
  setSaveHook(schedule); watch(); return state;
}

let busy = null, again = false;
// one round: fetch the server copy, decide adopt / push / merge, push with the base it was built on; repeats on a 409
export function syncNow() {
  if (!state.available) return Promise.resolve();
  if (busy) { again = true; return busy; }
  busy = (async () => {
    for (let round = 0; round < 4; round++) {
      again = false;
      try {
        const base = loadBase(), before = store.updated;
        // a profile the server does not know yet: create it (the listing avoids a 404 that the browser would log as an error)
        if (!base) { const l = await api('/api/profiles'); if (l.ok && !((await l.json()).profiles || []).some((x) => x.name === profileName())) { if (await put(store.snapshot, 0)) break; continue; } }
        const r = await api(url());
        if (r.status === 404) { if (await put(store.snapshot, 0)) break; continue; }
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const remote = await r.json(), ru = remote.updated || 0, bu = base?.updated ?? -1;
        everReached = true;
        if (store.updated !== before) { round--; continue; } // saved meanwhile: start over with the newest local copy
        if (store.updated === ru) { if (remote.state) saveBase({ ...remote.state, updated: ru }); setStatus('saved to disk'); break; } // already the same copy (e.g. an answer to a save got lost)
        const localChanged = store.updated !== bu, remoteChanged = ru !== bu;
        if (!remoteChanged && !localChanged) { setStatus('saved to disk'); break; }
        if (remoteChanged && !localChanged) { if (remote.state) { store.adopt(remote.state); saveBase({ ...remote.state, updated: ru }); replaced(); } setStatus('saved to disk'); break; }
        if (!remoteChanged && localChanged) { if (await put(store.snapshot, ru)) break; continue; }
        // both changed (offline on two devices, or two open at once): merge, adopt, push
        const merged = mergeSaves(base && base.flags ? base : null, clone(store.snapshot), remote.state || {});
        store.adopt(merged); replaced();
        if (await put(store.snapshot, ru)) { setStatus(base ? 'merged with your other device · saved' : 'saved to disk'); break; }
      } catch {
        setStatus(everReached || loadBase() ? 'offline: saved on this device, syncs when online' : 'sync error', true); break;
      }
    }
    busy = null; if (again) setTimeout(syncNow, 50);
  })();
  return busy;
}

// PUT with the version it was based on; true when the server took it, false on a conflict (the caller merges again)
async function put(st, baseVersion) {
  const body = JSON.stringify({ updated: st.updated || Date.now(), profile: profileName(), base: baseVersion, state: st });
  const r = await api(url(), { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body });
  if (r.status === 409) return false;
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  saveBase(clone(st)); state.last = Date.now(); setStatus('saved to disk'); return true;
}

let timer = 0;
function schedule() { clearTimeout(timer); if (!state.available) return; setStatus(state.offline ? 'offline: saved on this device, syncs when online' : 'saving…', state.offline); timer = setTimeout(syncNow, 700); }
export const push = () => syncNow();

let watching = false;
function watch() {
  if (watching) return; watching = true;
  const kick = () => { if (!state.available) { initSync(); return; } syncNow(); };
  window.addEventListener('online', kick);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') kick(); });
  setInterval(() => { if (document.visibilityState === 'visible') kick(); }, 45000);
}

export async function listProfiles() { try { const r = await api('/api/profiles'); return r.ok ? (await r.json()).profiles : []; } catch { return []; } }
export function switchProfile(name) { localStorage.setItem('physics-rpg-profile', name); location.reload(); }
// last save when the tab closes: only taken if nothing changed on the server since (otherwise the next start merges it)
window.addEventListener('pagehide', () => {
  if (!state.available || state.offline || !store.updated) return; const base = loadBase();
  if (base && base.updated === store.updated) return;
  try { navigator.sendBeacon?.(url(), new Blob([JSON.stringify({ updated: store.updated, base: base?.updated ?? 0, state: store.snapshot })], { type: 'application/json' })); } catch { /* ignore */ }
});
