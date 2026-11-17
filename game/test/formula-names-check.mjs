// Every formula card (eq block of a lesson) has a readable name in content/formula-names.json, so loot, fights and the
// summary builder never show a bare reference like "script (11.98)". node test/formula-names-check.mjs
import fs from 'node:fs';
globalThis.localStorage = { getItem: () => null, setItem() {}, removeItem() {} };
const { deck, setNames } = await import('../src/cards.js');
const root = new URL('../content/', import.meta.url).pathname, names = JSON.parse(fs.readFileSync(root + 'formula-names.json')).names;
setNames(names);
const catalog = [];
for (const c of ['qm', 'solid-state', 'astrophysics']) {
  const idx = JSON.parse(fs.readFileSync(`${root}${c}/index.json`)); const rooms = idx.rooms.map((r) => ({ slug: r, ...JSON.parse(fs.readFileSync(`${root}${c}/${r}.json`)) }));
  for (const f of idx.extras || []) { const x = JSON.parse(fs.readFileSync(`${root}${c}/${f}`)); for (const it of x.items || []) { const r = rooms.find((y) => y.slug === it.room); if (r && it.enc) r.encounters.push(it.enc); } }
  catalog.push({ id: c, rooms });
}
const d = deck(catalog, () => true), missing = d.filter((c) => !names[c.key]), stale = Object.keys(names).filter((k) => !d.some((c) => c.key === k));
if (missing.length) console.log('FAIL no name for', missing.map((c) => c.key).join(', '));
if (stale.length) console.log('note: names for cards that no longer exist:', stale.join(', '));
console.log(`${d.length} formula cards, ${d.length - missing.length} named`); console.log(missing.length ? `${missing.length} FAILED` : 'ALL OK'); process.exit(missing.length ? 1 : 0);
