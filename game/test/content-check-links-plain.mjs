// Plain-words connection texts: every link has {story, example, remember}, valid KaTeX, readable length.
import { readFileSync } from 'node:fs';
import katex from '../vendor/katex/katex.mjs';
const links = JSON.parse(readFileSync('content/links.json')).links, plain = { ...JSON.parse(readFileSync('content/links-plain-1.json')), ...JSON.parse(readFileSync('content/links-plain-2.json')) };
let fails = 0; const bad = (m) => { console.log('FAIL', m); fails++; };
const ok = (t) => { const p = t.split('$'); if (p.length % 2 === 0) return false; try { p.forEach((s, i) => { if (i % 2) katex.renderToString(s, { throwOnError: true, strict: 'ignore' }); }); return true; } catch { return false; } };
for (const l of links) {
  const p = plain[l.id]; if (!p) { bad(`${l.id}: missing`); continue; }
  for (const [k, min, max] of [['story', 500, 1600], ['example', 150, 900], ['remember', 30, 260]]) { const t = p[k]; if (typeof t !== 'string' || t.length < min || t.length > max) bad(`${l.id}.${k}: length ${t?.length}`); else if (!ok(t)) bad(`${l.id}.${k}: KaTeX/dollar problem`); }
}
for (const id of Object.keys(plain)) if (!links.some((l) => l.id === id)) bad(`unknown link ${id}`);
console.log(fails ? `${fails} FAILED` : `OK: ${links.length} links explained in plain words`); process.exit(fails ? 1 : 0);
