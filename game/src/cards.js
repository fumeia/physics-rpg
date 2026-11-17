// Formula cards: loot that is physics. Passing a lesson drops its displayed equations as cards. In a fight you may play a
// card of the same course to see that formula; every play wears the card (3 charges). A worn card is recharged by recalling
// it cold (write it down, then compare) or by passing its lesson again. Nothing here changes whether an exercise is passed.
import { store } from './store.js';
const FULL = 3;
const state = () => store.val('cards', {}) || {};
export const keyOf = (lessonId, i) => `${lessonId}#${i}`;
// all cards you own: the eq blocks of the lessons you passed. catalog: [{id, rooms: [{slug, title, encounters}]}]
export function deck(catalog, isPassed) {
  const st = state(), out = [];
  for (const c of catalog) for (const r of c.rooms) for (const e of r.encounters) if (e.type === 'lesson' && isPassed(e.id))
    (e.blocks || []).filter((b) => b.kind === 'eq' && b.tex).forEach((b, i) => { const k = keyOf(e.id, i); out.push({ key: k, course: c.id, room: r.slug, roomTitle: r.title, lesson: e.title, tex: b.tex, label: b.label || e.title, charge: st[k]?.c ?? FULL }); });
  return out;
}
export const lootOf = (enc) => (enc?.type === 'lesson' ? (enc.blocks || []).filter((b) => b.kind === 'eq' && b.tex).length : 0);
export function play(key) { const st = state(), c = st[key]?.c ?? FULL; if (c <= 0) return false; store.setVal('cards', { ...st, [key]: { c: c - 1, t: Date.now() } }); return true; }
export function recharge(key) { store.setVal('cards', { ...state(), [key]: { c: FULL, t: Date.now() } }); }
export function rechargeLesson(lessonId) { const st = { ...state() }; let n = 0; for (const k of Object.keys(st)) if (k.startsWith(lessonId + '#') && st[k].c < FULL) { st[k] = { c: FULL, t: Date.now() }; n++; } if (n) store.setVal('cards', st); return n; }
export const FULL_CHARGE = FULL;
