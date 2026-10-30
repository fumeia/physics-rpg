// Choudhuri book exercises: every item lands in an existing astro room, is a well-formed book derivation, cites the exercise,
// and all its LaTeX renders. Usage: node test/book-check.mjs
import { readFileSync } from 'node:fs';
import katex from '../vendor/katex/katex.mjs';
const dir = new URL('../content/astrophysics/', import.meta.url);
const index = JSON.parse(readFileSync(new URL('index.json', dir)));
let fails = 0; const ok = (n, c, x = '') => { if (!c) { fails++; console.log(`FAIL ${n} ${x}`); } };
const rooms = new Set(index.rooms), ids = new Set();
for (const f of index.rooms) for (const e of JSON.parse(readFileSync(new URL(f + '.json', dir))).encounters) ids.add(e.id);
const { items } = JSON.parse(readFileSync(new URL('choudhuri-exercises.json', dir)));
const tex = (s, where) => { for (const m of String(s).matchAll(/\$([^$]+)\$/g)) { try { katex.renderToString(m[1], { throwOnError: true, strict: 'ignore' }); } catch (err) { ok(`${where}: LaTeX renders`, false, `${m[1].slice(0, 80)} -> ${err.message.slice(0, 100)}`); } } ok(`${where}: balanced $`, (String(s).match(/\$/g) || []).length % 2 === 0, String(s).slice(0, 80)); ok(`${where}: no placeholder or raw quote`, !/<<|\\'/.test(s)); };
const seen = new Set();
for (const { room, enc: e } of items) {
  const k = e.id; ok(`${k}: room exists`, rooms.has(room), room); ok(`${k}: unique id`, !ids.has(k) && !seen.has(k)); seen.add(k);
  ok(`${k}: book derive`, e.type === 'derive' && e.book === true && e.steps.length >= 2 && e.keyPoints.length >= 2 && e.goal && /Exercise \d+\.\d+/.test(e.source?.where || ''));
  for (const s of [e.title, e.goal, ...e.given, ...e.steps.flatMap((x) => [x.prompt, x.reveal]), ...e.keyPoints]) tex(s, k);
}
// every exercise of the book: chapter -> number of exercises
const COUNT = { 1: 3, 2: 7, 3: 7, 4: 6, 5: 9, 6: 7, 7: 4, 8: 8, 9: 5, 10: 5, 11: 6, 12: 7, 13: 7, 14: 8 };
const want = Object.entries(COUNT).flatMap(([ch, n]) => Array.from({ length: n }, (_, i) => `astro-book-${ch}-${i + 1}`));
const missing = want.filter((id) => !seen.has(id));
console.log(`${items.length} book exercises, ${missing.length} of ${want.length} missing${missing.length ? ': ' + missing.join(' ') : ''}`);
if (process.argv.includes('--complete')) ok('all exercises present', missing.length === 0);
console.log(fails ? `${fails} FAILED` : 'ALL OK'); process.exit(fails ? 1 : 0);
