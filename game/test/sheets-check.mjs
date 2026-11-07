// Exercise sheets (content/<course>/sheets.json): every question sits in an existing room, its related links point to
// existing encounters, steps and key points are complete, and all LaTeX renders. Usage: node test/sheets-check.mjs
import { readFileSync, existsSync } from 'node:fs';
import katex from '../vendor/katex/katex.mjs';
let fails = 0; const ok = (n, c, x = '') => { if (!c) { fails++; console.log(`FAIL ${n} ${x}`); } };
const C = (p) => new URL('../content/' + p, import.meta.url);
let total = 0;
for (const course of ['qm', 'solid-state', 'astrophysics']) {
  if (!existsSync(C(`${course}/sheets.json`))) continue;
  const idx = JSON.parse(readFileSync(C(`${course}/index.json`)));
  ok(`${course}: sheets.json listed in extras`, (idx.extras || []).includes('sheets.json'));
  const ids = new Set();
  for (const r of idx.rooms) for (const e of JSON.parse(readFileSync(C(`${course}/${r}.json`))).encounters) ids.add(e.id);
  for (const f of idx.extras || []) { const x = JSON.parse(readFileSync(C(`${course}/${f}`))); for (const it of x.items || []) ids.add(it.enc.id); }
  for (const f of ['labs.json', `labs-${course}.json`]) if (existsSync(C(f))) for (const l of JSON.parse(readFileSync(C(f))).labs) ids.add(l.enc.id);
  const { sheets } = JSON.parse(readFileSync(C(`${course}/sheets.json`)));
  const seen = new Set();
  for (const sh of sheets) for (const q of sh.questions) {
    total++; const e = q.enc, k = e.id;
    ok(`${k}: room exists`, idx.rooms.includes(q.room), q.room);
    ok(`${k}: unique`, !seen.has(k)); seen.add(k);
    ok(`${k}: sheet derive`, e.type === 'derive' && e.sheet === true && e.steps.length >= 1 && e.steps.every((s) => s.prompt && s.reveal) && e.keyPoints.length >= 2 && e.goal && e.source?.file);
    for (const r of q.related) ok(`${k}: related ${r} exists`, ids.has(r));
    ok(`${k}: has related links`, q.related.length >= 1);
    for (const t of [e.title, e.goal, ...(e.given || []), ...e.steps.flatMap((s) => [s.prompt, s.reveal]), ...e.keyPoints]) {
      ok(`${k}: balanced $`, (t.match(/\$/g) || []).length % 2 === 0, t.slice(0, 60));
      for (const m of t.matchAll(/\$([^$]+)\$/g)) { try { katex.renderToString(m[1], { throwOnError: true, strict: 'ignore' }); } catch (err) { ok(`${k}: LaTeX`, false, `${m[1].slice(0, 60)} -> ${err.message.slice(0, 90)}`); } }
    }
  }
}
console.log(`${total} sheet questions checked`); console.log(fails ? `${fails} FAILED` : 'ALL OK'); process.exit(fails ? 1 : 0);
