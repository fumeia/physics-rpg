// Profile persistence: progress lives in localStorage (fast) and is mirrored to a JSON file by serve.py (safe).
// Without the save server (plain static hosting) the game still works; export/import is the fallback.
import { store, setSaveHook, profileName } from './store.js';

const state = { available: false, status: 'browser only', last: 0, token: null };
export const sync = state;
const listeners = new Set();
export const onSyncStatus = (fn) => listeners.add(fn);
const emit = () => listeners.forEach((f) => f(state));
export const headers = () => (localStorage.getItem('physics-rpg-token') ? { 'X-Token': localStorage.getItem('physics-rpg-token') } : {});
const api = (path, opt = {}) => fetch(path, { ...opt, headers: { ...headers(), ...(opt.headers || {}) }, cache: 'no-store' });

export async function initSync() {
  try {
    let r = await api('/api/ping');
    if (r.status === 401) { const t = prompt('This server needs the access token (PHYSICS_RPG_TOKEN):'); if (t) { localStorage.setItem('physics-rpg-token', t.trim()); r = await api('/api/ping'); } }
    const j = r.ok ? await r.json().catch(() => ({})) : {}; if (!j.ok) throw new Error('no save server');
    state.available = true; state.status = 'saved to disk';
  } catch { state.available = false; state.status = 'browser only (no save server)'; emit(); return state; }
  // reconcile with the file of this profile: the newer side wins
  try {
    const name = profileName(), have = (await (await api('/api/profiles')).json()).profiles.some((p) => p.name === name); // listing first avoids a 404 on a new profile
    if (!have) await push();
    else { const remote = await (await api(`/api/profile/${encodeURIComponent(name)}`)).json(); if ((remote.updated || 0) > store.updated && remote.state) store.adopt(remote.state); else if (store.updated > (remote.updated || 0)) await push(); }
  } catch { state.status = 'sync error'; }
  setSaveHook(schedule); emit(); return state;
}
let timer = 0;
function schedule() { clearTimeout(timer); state.status = 'saving…'; emit(); timer = setTimeout(push, 700); }
export async function push() {
  if (!state.available) return;
  try {
    const r = await api(`/api/profile/${encodeURIComponent(profileName())}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ updated: store.updated, profile: profileName(), state: store.snapshot }) });
    state.status = r.ok ? 'saved to disk' : `sync error (${r.status})`; state.last = Date.now();
  } catch { state.status = 'sync error'; }
  emit();
}
export async function listProfiles() { try { const r = await api('/api/profiles'); return r.ok ? (await r.json()).profiles : []; } catch { return []; } }
export function switchProfile(name) { localStorage.setItem('physics-rpg-profile', name); location.reload(); }
window.addEventListener('beforeunload', () => { if (state.available && store.updated) { try { navigator.sendBeacon?.(`/api/profile/${encodeURIComponent(profileName())}`, new Blob([JSON.stringify({ updated: store.updated, state: store.snapshot })], { type: 'application/json' })); } catch { /* ignore */ } } });
