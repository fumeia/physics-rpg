// Smoke test of the solid-state 3D showpieces without a browser: every room builds, animates for a few frames and disposes.
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { buildRoom } from '../src/rooms/solid-state.js';

const index = JSON.parse(readFileSync(new URL('../content/solid-state/index.json', import.meta.url)));
let fails = 0;
const ok = (name, cond, extra = '') => { console.log(`${cond ? 'PASS' : 'FAIL'} ${name} ${extra}`); if (!cond) fails++; };
for (const id of index.rooms) {
  const room = JSON.parse(readFileSync(new URL(`../content/solid-state/${id}.json`, import.meta.url)));
  const world = { scene: new THREE.Scene() };
  const r = buildRoom(world, room);
  let nobj = 0; r.group.traverse(() => nobj++);
  ok(`${id}: group added`, world.scene.children.includes(r.group) && nobj > 10, `${nobj} objects`);
  let bad = false;
  for (let i = 0; i < 300; i++) { r.update(0.05); }
  r.group.traverse((o) => { const p = o.position; if (p && !(Number.isFinite(p.x) && Number.isFinite(p.y) && Number.isFinite(p.z))) bad = true; if (o.rotation && !Number.isFinite(o.rotation.z)) bad = true; });
  ok(`${id}: positions finite after 15 s of animation`, !bad);
  const box = new THREE.Box3().setFromObject(r.group);
  ok(`${id}: fits in the chasm volume (x +-10, z -7..1)`, box.min.x > -10 && box.max.x < 10 && box.min.z > -7 && box.max.z < 1, `x ${box.min.x.toFixed(1)}..${box.max.x.toFixed(1)}, z ${box.min.z.toFixed(1)}..${box.max.z.toFixed(1)}`);
  r.dispose();
  ok(`${id}: disposed`, !world.scene.children.includes(r.group));
}
console.log(fails ? `\n${fails} FAILED` : '\nall solid-state scene checks passed');
process.exit(fails ? 1 : 0);
