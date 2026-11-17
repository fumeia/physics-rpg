// Units duel content: four distinct options, a valid key, an explanation, and LaTeX that renders. node test/units-check.mjs
import { readFileSync } from 'node:fs';
import katex from '../vendor/katex/katex.mjs';
let fails = 0; const ok = (n, c, x = '') => { if (!c) { fails++; console.log(`FAIL ${n} ${x}`); } };
const { items, seconds } = JSON.parse(readFileSync(new URL('../content/units-duel.json', import.meta.url)));
const tex = (t, k) => { try { katex.renderToString(t, { throwOnError: true, strict: 'ignore' }); } catch (e) { ok(`${k}: LaTeX`, false, `${t.slice(0, 50)} -> ${e.message.slice(0, 80)}`); } };
ok('more than 30 seconds per question', seconds >= 60);
items.forEach((it, i) => { const k = `#${i} ${it.q.slice(0, 30)}`; ok(`${k}: fields`, ['qm', 'solid-state', 'astrophysics'].includes(it.course) && it.options.length === 4 && new Set(it.options).size === 4 && it.correct >= 0 && it.correct < 4 && it.why.length > 30);
  it.options.forEach((o) => tex(o, k)); tex(`[\\mathrm{${it.unit}}]`, k); for (const s of [it.q, it.why]) { ok(`${k}: balanced $`, (s.match(/\$/g) || []).length % 2 === 0); for (const m of s.matchAll(/\$([^$]+)\$/g)) tex(m[1], k); } });
const { symbols } = JSON.parse(readFileSync(new URL('../content/units-duel.json', import.meta.url)));
items.forEach((it, i) => { ok(`#${i}: symbols listed`, (it.sym || []).length >= 2 && it.sym.every((k) => symbols[k])); for (const k of it.sym || []) if (symbols[k]) { tex(symbols[k][0], `#${i} ${k}`); tex(`[\\mathrm{${symbols[k][1]}}]`, `#${i} ${k}`); } });
items.forEach((it, i) => { ok(`#${i}: meaning hint`, (it.meaning || '').length > 40 && !/\\mathrm|\bunits?\b/.test(it.meaning)); if (it.meaning) { ok(`#${i}: balanced $ in hint`, (it.meaning.match(/\$/g) || []).length % 2 === 0); for (const m of it.meaning.matchAll(/\$([^$]+)\$/g)) tex(m[1], `#${i} hint`); } });
ok('at least 8 per course', ['qm', 'solid-state', 'astrophysics'].every((c) => items.filter((x) => x.course === c).length >= 8));
console.log(`${items.length} duel questions checked`); console.log(fails ? `${fails} FAILED` : 'ALL OK'); process.exit(fails ? 1 : 0);
