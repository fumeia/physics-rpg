// Formula cards: loot that is physics. Passing a lesson drops its displayed equations as cards. In a fight you may play a
// card of the same course to see that formula; every play wears the card (3 charges). A worn card is recharged by recalling
// it cold (write it down, then compare) or by passing its lesson again. Nothing here changes whether an exercise is passed.
import { store } from './store.js';
const FULL = 3;
const state = () => store.val('cards', {}) || {};
export const keyOf = (lessonId, i) => `${lessonId}#${i}`;
// Readable names: content/formula-names.json for cards whose label is only a reference ("script (11.98)"); otherwise the
// descriptive part of the label ("script Ch. 7.4: the irreducible representation" -> "the irreducible representation").
let NAMES = {};
export function setNames(n) { NAMES = n || {}; }
function nameOf(key, label, lesson) {
  if (NAMES[key]) return NAMES[key];
  const l = String(label || '').trim(), colon = l.match(/^(?:script|choudhuri|[^:]{0,24}\d)[^:]*:\s*(.+)$/i);
  if (colon && colon[1].replace(/\$[^$]*\$/g, '').trim().length >= 4) return colon[1].trim();
  const words = l.replace(/\$[^$]*\$/g, '').replace(/script|choudhuri|ch\.|eqs?\.|kap\.?|pp?\.|§|[\d.,–\-:;()]/gi, '').trim();
  return words.length >= 4 ? l : lesson;
}
// all cards you own: the eq blocks of the lessons you passed. catalog: [{id, rooms: [{slug, title, encounters}]}]
export function deck(catalog, isPassed) {
  const st = state(), out = [];
  for (const c of catalog) for (const r of c.rooms) for (const e of r.encounters) if (e.type === 'lesson' && isPassed(e.id))
    (e.blocks || []).filter((b) => b.kind === 'eq' && b.tex).forEach((b, i) => { const k = keyOf(e.id, i); out.push({ key: k, course: c.id, room: r.slug, roomTitle: r.title, lesson: e.title, tex: b.tex, label: nameOf(k, b.label, e.title), ref: b.label || '', charge: st[k]?.c ?? FULL }); });
  return out;
}
export const namesOf = (enc) => (enc?.type === 'lesson' ? (enc.blocks || []).filter((b) => b.kind === 'eq' && b.tex).map((b, i) => nameOf(keyOf(enc.id, i), b.label, enc.title)) : []);
export const lootOf = (enc) => (enc?.type === 'lesson' ? (enc.blocks || []).filter((b) => b.kind === 'eq' && b.tex).length : 0);
export function play(key) { const st = state(), c = st[key]?.c ?? FULL; if (c <= 0) return false; store.setVal('cards', { ...st, [key]: { c: c - 1, t: Date.now() } }); return true; }
export function recharge(key) { store.setVal('cards', { ...state(), [key]: { c: FULL, t: Date.now() } }); }
export function rechargeLesson(lessonId) { const st = { ...state() }; let n = 0; for (const k of Object.keys(st)) if (k.startsWith(lessonId + '#') && st[k].c < FULL) { st[k] = { c: FULL, t: Date.now() }; n++; } if (n) store.setVal('cards', st); return n; }
export const FULL_CHARGE = FULL;
