// The QM formulas to know by heart (content/qm/forge.json): unique ids, a name, a formula and a rebuild chain, all LaTeX renders.
import { readFileSync } from 'node:fs';
import katex from '../vendor/katex/katex.mjs';
let fails = 0; const ok = (n, c, x = '') => { if (!c) { fails++; console.log(`FAIL ${n} ${x}`); } };
const { items } = JSON.parse(readFileSync(new URL('../content/qm/forge.json', import.meta.url))); const ids = new Set();
const tex = (t, k) => { try { katex.renderToString(t, { throwOnError: true, strict: 'ignore', displayMode: true }); } catch (e) { ok(`${k}: LaTeX`, false, `${t.slice(0, 50)} -> ${e.message.slice(0, 80)}`); } };
for (const it of items) { ok(`${it.id}: unique`, !ids.has(it.id)); ids.add(it.id); ok(`${it.id}: fields`, it.name && it.tex && it.anchor && it.steps?.length >= 2); tex(it.tex, it.id);
  for (const s of [it.anchor, ...it.steps]) { ok(`${it.id}: balanced $`, (s.match(/\$/g) || []).length % 2 === 0, s.slice(0, 40)); for (const m of s.matchAll(/\$([^$]+)\$/g)) tex(m[1], it.id); } }
ok('at least 12 formulas', items.length >= 12); console.log(`${items.length} formulas checked`); console.log(fails ? `${fails} FAILED` : 'ALL OK'); process.exit(fails ? 1 : 0);
