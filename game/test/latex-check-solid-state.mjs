// Every $...$ and $$...$$ segment in the solid-state room files must parse in KaTeX (the game renders them with it).
import { readFileSync } from 'node:fs';
import katex from 'katex';

const dir = new URL('../content/solid-state/', import.meta.url);
const index = JSON.parse(readFileSync(new URL('index.json', dir)));
let total = 0, bad = 0;
const strings = (o, path, out) => { if (typeof o === 'string') out.push([path, o]); else if (Array.isArray(o)) o.forEach((x, i) => strings(x, `${path}[${i}]`, out)); else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) strings(v, `${path}.${k}`, out); return out; };
for (const id of index.rooms) {
  const room = JSON.parse(readFileSync(new URL(id + '.json', dir)));
  for (const [path, s] of strings(room, id, [])) {
    if (path.endsWith('.answer') || path.includes('.vars')) continue;
    if (path.endsWith('.tex')) { total++; try { katex.renderToString(s, { throwOnError: true, displayMode: true }); } catch (e) { bad++; console.log(`FAIL ${path}: ${e.message.slice(0, 100)}`); } continue; }
    const dollars = (s.match(/\$/g) || []).length;
    if (dollars % 2) { bad++; console.log(`FAIL odd number of $ in ${path}: ${s.slice(0, 90)}`); }
    for (const m of s.matchAll(/\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g)) {
      total++;
      try { katex.renderToString(m[1] ?? m[2], { throwOnError: true, displayMode: !!m[1] }); }
      catch (e) { bad++; console.log(`FAIL ${path}: ${(m[1] ?? m[2]).slice(0, 80)} -> ${e.message.slice(0, 100)}`); }
    }
  }
}
console.log(bad ? `${bad} problems in ${total} math segments` : `all ${total} math segments parse`);
process.exit(bad ? 1 : 0);
