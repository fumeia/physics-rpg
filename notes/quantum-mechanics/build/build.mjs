// node notes/quantum-mechanics/build/build.mjs : writes game/content/qm/<slug>.json for every room module and updates index.json.
import { readdirSync, writeFileSync, readFileSync } from 'node:fs';
const dir = new URL('./rooms/', import.meta.url), out = new URL('../../../game/content/qm/', import.meta.url);
const ORDER = ['harmonic-oscillator-elevator', 'angular-momentum-spin', 'perturbation-forge', 'hydrogen-lamp', 'spin-addition-stern-gerlach', 'formalism-and-uncertainty', 'entanglement-lab', 'wave-mechanics-basics', 'qm-exam-hall'];
const slugs = readdirSync(dir).filter((f) => f.endsWith('.mjs')).map((f) => f.replace('.mjs', ''));
for (const slug of slugs) {
  const mod = await import(new URL(slug + '.mjs', dir));
  const r = mod.default;
  if (r.id !== 'qm-' + slug) throw new Error(`room id ${r.id} != qm-${slug}`);
  writeFileSync(new URL(slug + '.json', out), JSON.stringify(r, null, 1) + '\n');
  console.log(slug, r.encounters.length, 'encounters');
}
const idx = JSON.parse(readFileSync(new URL('index.json', out)));
const rooms = ['tunneling-bridge', ...ORDER.filter((s) => slugs.includes(s)), ...slugs.filter((s) => !ORDER.includes(s))];
idx.rooms = rooms; writeFileSync(new URL('index.json', out), JSON.stringify(idx, null, 2) + '\n');
console.log('index:', rooms.join(', '));
