// Error log: every wrong numeric answer is kept with the expected value and the likely slip, so mistakes can be
// reviewed and turned into a habit ("what I will do differently"). Weak spots are computed from this log and the respawns.
import { store } from './store.js';
const KEY = 'errlog', plain = (s) => String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 220);
export const mistakes = () => store.val(KEY, []) || [];
export function logMistake({ encId, step, prompt, given, expected, diag }) {
  const log = mistakes(), dupe = log.slice(-30).some((m) => m.encId === encId && m.step === step && m.given === String(given));
  if (dupe) return;
  store.setVal(KEY, [...log, { id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`, t: Date.now(), encId, step, prompt: plain(prompt), given: String(given), expected: String(expected), diag: diag || '', note: '', open: true }].slice(-400));
}
export const updateMistake = (id, patch) => store.setVal(KEY, mistakes().map((m) => (m.id === id ? { ...m, ...patch } : m)));
// weak spots: room slug -> score from open mistakes, failed exercises (respawns) and recent exam parts below 60 %
export function weakSpots(encIndex, limit = 6) {
  const score = new Map(), bump = (key, v, why) => { const e = score.get(key) || { key, v: 0, why: {} }; e.v += v; e.why[why] = (e.why[why] || 0) + 1; score.set(key, e); };
  const now = Date.now();
  for (const m of mistakes()) { const ref = encIndex.get(m.encId); if (ref && m.open) bump(`${ref.course}/${ref.roomId}`, Math.max(0.3, 1 - (now - m.t) / (60 * 86400000)), 'open mistakes'); }
  for (const [id, r] of Object.entries(store.snapshot.reviews || {})) { const ref = encIndex.get(id); if (ref) bump(`${ref.course}/${ref.roomId}`, 1 + 0.5 * (r.fails || 1), 'failed exercises'); }
  for (const x of (store.val('exam-hist', []) || []).slice(-8)) for (const p of x.parts || []) if (p.max && p.pts / p.max < 0.6) { const ref = encIndex.get(p.id); if (ref) bump(`${ref.course}/${ref.roomId}`, 1.2 * (1 - p.pts / p.max), 'weak exam parts'); }
  return [...score.values()].sort((a, b) => b.v - a.v).slice(0, limit);
}
