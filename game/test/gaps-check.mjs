// Script-gap lessons and quizzes (content/solid-state/script-gaps.json): rooms exist, ids unique, keys valid, LaTeX renders.
import { readFileSync } from 'node:fs';
import katex from '../vendor/katex/katex.mjs';
let fails = 0, n = 0; const ok = (m, c, x = '') => { if (!c) { fails++; console.log(`FAIL ${m} ${x}`); } };
const C = (p) => JSON.parse(readFileSync(new URL('../content/solid-state/' + p, import.meta.url)));
const idx = C('index.json'), ids = new Set(); for (const r of idx.rooms) for (const e of C(r + '.json').encounters) ids.add(e.id);
ok('listed in extras', idx.extras.includes('script-gaps.json'));
const tex = (t, k, display = false) => { try { katex.renderToString(t, { throwOnError: true, strict: 'ignore', displayMode: display }); } catch (e) { ok(`${k}: LaTeX`, false, `${t.slice(0, 50)} -> ${e.message.slice(0, 70)}`); } };
const walk = (o, k) => { if (typeof o === 'string') { ok(`${k}: balanced $`, (o.match(/\$/g) || []).length % 2 === 0, o.slice(0, 50)); for (const m of o.matchAll(/\$([^$]+)\$/g)) tex(m[1], k); } else if (Array.isArray(o)) o.forEach((x) => walk(x, k)); else if (o && typeof o === 'object') for (const [kk, v] of Object.entries(o)) kk === 'tex' ? tex(v, k, true) : walk(v, k); };
for (const { room, enc } of C('script-gaps.json').items) {
  n++; ok(`${enc.id}: room`, idx.rooms.includes(room)); ok(`${enc.id}: unique`, !ids.has(enc.id)); ids.add(enc.id);
  for (const q of enc.check || enc.questions || []) ok(`${enc.id}: key`, q.correct >= 0 && q.correct < q.options.length && new Set(q.options).size === q.options.length);
  walk(enc, enc.id);
}
console.log(`${n} gap items checked`); console.log(fails ? `${fails} FAILED` : 'ALL OK'); process.exit(fails ? 1 : 0);
