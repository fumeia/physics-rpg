// Progress: XP, solved encounters and a Leitner-style spaced-repetition queue.
// Uses localStorage when available, falls back to memory (previews, private windows).
// Several profiles per browser: the 'default' profile keeps the original key (older progress stays valid).
const PROFILE_PTR = 'physics-rpg-profile';
export const profileName = () => { try { return localStorage.getItem(PROFILE_PTR) || 'default'; } catch { return 'default'; } };
const KEY = profileName() === 'default' ? 'physics-rpg-v1' : `physics-rpg-v1:${profileName()}`;
let saveHook = null, xpHook = null;
export const setSaveHook = (fn) => { saveHook = fn; };
export const setXpHook = (fn) => { xpHook = fn; }; // called with every XP change (feedback: floating +XP, sound)
const DAY = 86400000;
// local calendar day of a timestamp: 'YYYY-MM-DD' (the same notion of "today" as missions.js)
export const localDate = (ts) => { const d = new Date(ts); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
// ISO-like week id of a 'YYYY-MM-DD' date, weeks starting on Monday: '2026-W43'
export function weekKey(date) {
  const [y, m, d] = date.split('-').map(Number), t = new Date(Date.UTC(y, m - 1, d)), dow = (t.getUTCDay() + 6) % 7; // Monday = 0
  t.setUTCDate(t.getUTCDate() - dow + 3); // the Thursday of this week decides the year
  const y1 = t.getUTCFullYear(), first = new Date(Date.UTC(y1, 0, 4)), wk = 1 + Math.round(((t - first) / DAY - 3 + ((first.getUTCDay() + 6) % 7)) / 7);
  return `${y1}-W${String(wk).padStart(2, '0')}`;
}
export const INTERVALS_DAYS = [1, 3, 7, 16]; // days until the respawn from box 0,1,2,3

function load() {
  try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s); } catch (e) { /* ignore */ }
  return { xp: 0, solved: {}, reviews: {}, flags: {} };
}
let state = load();
function save() { state.updated = Date.now(); try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ } if (saveHook) saveHook(state); }

export const store = {
  get profile() { return profileName(); },
  get snapshot() { return state; },
  get updated() { return state.updated || 0; },
  // adopt a newer state from the save server (same profile)
  adopt(remote) { state = { flags: {}, reviews: {}, solved: {}, xp: 0, ...remote }; try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ } },
  get xp() { return state.xp; },
  addXp(n) {
    state.xp = Math.max(0, state.xp + n);
    if (n) { const day = localDate(Date.now()), log = { ...(state.xpLog || {}) }; log[day] = (log[day] || 0) + n; for (const k of Object.keys(log).sort().slice(0, -60)) delete log[k]; state.xpLog = log; } // net XP per day
    save(); if (xpHook && n) xpHook(n);
  },
  xpOn(date) { return (state.xpLog || {})[date] || 0; },
  // what was done: one entry per finished exercise or mission {t, id, title, type, ok, xp, review}; the last 400, at most 45 days
  logActivity(e) {
    const log = [...(((state.flags || {}).activity) || []), { t: Date.now(), ...e }].filter((x) => x.t > Date.now() - 45 * DAY).slice(-400);
    state.flags = { ...(state.flags || {}), activity: log }; save();
  },
  activityOn(date) { return (((state.flags || {}).activity) || []).filter((x) => localDate(x.t) === date); },
  isSolved(id) { return !!state.solved[id]; },
  // solved without giving up / failing (used to open doors)
  isPassed(id) { return !!state.solved[id] && !state.solved[id].failed; },
  markSolved(id, info = {}) { state.solved[id] = { at: Date.now(), ...info }; save(); },
  // Failed or given up: respawns in INTERVALS_DAYS[0] days. A review solved cleanly moves up a box.
  fail(id) { const r = state.reviews[id]; state.reviews[id] = { box: 0, due: Date.now() + INTERVALS_DAYS[0] * DAY, fails: (r?.fails || 0) + 1 }; save(); },
  reviewPassed(id) {
    const r = state.reviews[id]; if (!r) return;
    const box = r.box + 1;
    if (box >= INTERVALS_DAYS.length) delete state.reviews[id];
    else state.reviews[id] = { ...r, box, due: Date.now() + INTERVALS_DAYS[box] * DAY };
    save();
  },
  reviewFailed(id) { this.fail(id); },
  makeAllDue() { for (const r of Object.values(state.reviews)) r.due = Date.now(); save(); }, // debug
  dueReviews(now = Date.now()) { return Object.entries(state.reviews).filter(([, r]) => r.due <= now).map(([id]) => id); },
  // drop review entries whose exercise no longer exists (renamed or removed content); returns the dropped ids
  pruneReviews(valid) { const gone = Object.keys(state.reviews).filter((id) => !valid.has(id)); if (!gone.length) return []; state.flags = { ...(state.flags || {}), 'dropped-reviews': [...(state.flags?.['dropped-reviews'] || []), ...gone] }; for (const id of gone) delete state.reviews[id]; save(); return gone; },
  hasReview(id) { return !!state.reviews[id]; },
  get last() { return state.last || null; },
  setLast(ref) { state.last = ref; save(); },
  // arbitrary persisted values (e.g. recently seen question ids)
  val(name, d = null) { return (state.flags || {})[name] ?? d; },
  setVal(name, v) { state.flags = { ...(state.flags || {}), [name]: v }; save(); },
  // daily missions and streak
  missionsOf(date) { return (state.missions || {})[date] || { done: {}, xp: 0 }; },
  get streak() { return state.streak || { last: null, count: 0 }; },
  // Streak freeze: one missed day per calendar week is forgiven (the week starts on Monday). It is used automatically when a
  // mission is completed after exactly one missed day.
  freezeAvailable(date) { return (state.freeze?.week || '') !== weekKey(date); },
  get freezeUsed() { return state.freeze || null; },
  // streak as the player should see it today: { count, alive, saved }  (saved: it survives only thanks to the weekly freeze)
  streakNow(today, yesterday, dayBefore) {
    const st = state.streak || { last: null, count: 0 };
    if (st.last === today || st.last === yesterday) return { count: st.count, alive: true, saved: false, today: st.last === today };
    if (st.last === dayBefore && this.freezeAvailable(today)) return { count: st.count, alive: true, saved: true, today: false };
    return { count: 0, alive: false, saved: false, today: false };
  },
  completeMission(date, id, xp, yesterday, dayBefore) {
    state.missions = state.missions || {}; const day = state.missions[date] || { done: {}, xp: 0 };
    if (day.done[id]) return false;
    day.done[id] = true; day.xp += xp; state.missions[date] = day;
    const st = state.streak || { last: null, count: 0 };
    if (st.last !== date) {
      let count = 1;
      if (st.last === yesterday) count = st.count + 1;
      else if (dayBefore && st.last === dayBefore && this.freezeAvailable(date)) { count = st.count + 1; state.freeze = { week: weekKey(date), saved: yesterday }; state.freezeJustUsed = date; }
      state.streak = { last: date, count };
    }
    save(); return true;
  },
  get freezeJustUsed() { return state.freezeJustUsed || null; },
  exportJson() { return JSON.stringify(state, null, 1); },
  importJson(text) { try { const o = JSON.parse(text); if (typeof o.xp !== 'number' || !o.solved) return false; state = { flags: {}, reviews: {}, ...o }; save(); return true; } catch { return false; } },
  flag(name) { return !!(state.flags || {})[name]; },
  setFlag(name, v = true) { state.flags = { ...(state.flags || {}), [name]: v }; save(); },
  reset() { state = { xp: 0, solved: {}, reviews: {}, flags: {} }; save(); },
};
