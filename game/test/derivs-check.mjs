// QM derivations (content/qm/derivations.json): fields, rooms exist, why-questions point at a line and have a valid key,
// and every bit of LaTeX renders. node test/derivs-check.mjs
import { readFileSync } from 'node:fs';
import katex from '../vendor/katex/katex.mjs';
let fails = 0; const ok = (n, c, x = '') => { if (!c) { fails++; console.log(`FAIL ${n} ${x}`); } };
const { items } = JSON.parse(readFileSync(new URL('../content/qm/derivations.json', import.meta.url))), rooms = JSON.parse(readFileSync(new URL('../content/qm/index.json', import.meta.url))).rooms;
const chk = (s, k) => { ok(`${k}: balanced $`, (s.match(/\$/g) || []).length % 2 === 0, s.slice(0, 50)); for (const m of s.matchAll(/\$([^$]+)\$/g)) { try { katex.renderToString(m[1], { throwOnError: true, strict: 'ignore' }); } catch (e) { ok(`${k}: LaTeX`, false, `${m[1].slice(0, 60)} -> ${e.message.slice(0, 80)}`); } } };
for (const d of items) {
  ok(`${d.id}: fields`, d.title && d.goal && d.lines.length >= 4 && d.moves.length >= 2 && d.whys.length >= 1 && d.variant?.change && d.variant.result && d.exam?.count > 0);
  ok(`${d.id}: room`, rooms.includes(d.room), d.room);
  for (const w of d.whys) ok(`${d.id}: why`, w.at >= 0 && w.at < d.lines.length && w.options.length >= 3 && w.correct >= 0 && w.correct < w.options.length && new Set(w.options).size === w.options.length);
  for (const s of [d.title, d.goal, ...d.lines, ...d.moves, ...d.whys.flatMap((w) => [w.q, w.explain, ...w.options]), ...Object.values(d.variant)]) chk(s, d.id);
}
console.log(`${items.length} derivations checked`); console.log(fails ? `${fails} FAILED` : 'ALL OK'); process.exit(fails ? 1 : 0);
