// Astro 3D set pieces: build each room's exhibit into a bare scene (no WebGL needed) and check the physics helpers.
import { readFileSync } from 'node:fs';
import * as THREE from 'three';
import { buildRoom, ROOM_IDS, blackbodyColor, bindingPerNucleon, wdRadius, planck } from '../src/rooms/astrophysics.js';

let fails = 0;
const ok = (name, cond, extra = '') => { console.log(`${cond ? 'PASS' : 'FAIL'} ${name} ${extra}`); if (!cond) fails++; };
const index = JSON.parse(readFileSync(new URL('../content/astrophysics/index.json', import.meta.url)));
const roomIds = index.rooms.map((r) => JSON.parse(readFileSync(new URL(`../content/astrophysics/${r}.json`, import.meta.url))).id);
ok('every room has a set piece', roomIds.every((id) => ROOM_IDS.includes(id)), roomIds.filter((id) => !ROOM_IDS.includes(id)).join(','));
for (const id of roomIds) {
  const world = { scene: new THREE.Scene(), bridge: new THREE.Group(), curtain: new THREE.Group(), reLine: new THREE.Group() };
  world.scene.fog = new THREE.Fog(0, 14, 48);
  let built, err = '';
  try { built = buildRoom(world, { id }); for (let i = 0; i < 30; i++) built.update(0.05); } catch (e) { err = e.stack; }
  let n = 0, bad = 0;
  built?.group.traverse((o) => { n++; if (o.position && !Number.isFinite(o.position.x + o.position.y + o.position.z)) bad++; const p = o.geometry?.attributes?.position; if (p) for (const v of p.array) if (!Number.isFinite(v)) { bad++; break; } });
  ok(`${id} builds and animates`, !!built && !err && n > 3 && bad === 0, err || `${n} objects`);
  ok(`${id} hides the QM bridge`, !world.bridge.visible && !world.curtain.visible);
}
// physics helpers
ok('Wien: B_λ(5800 K) peaks near 500 nm', (() => { let best = 0, lb = 0; for (let l = 200e-9; l < 2e-6; l += 1e-9) { const b = planck(l, 5800); if (b > best) { best = b; lb = l; } } return Math.abs(lb * 5800 - 2.898e-3) < 1e-5; })());
ok('hot star is blue, cool star is red', blackbodyColor(30000).b > blackbodyColor(30000).r && blackbodyColor(3000).r > blackbodyColor(3000).b);
const peak = [...Array(237).keys()].map((i) => i + 4).reduce((a, A) => (bindingPerNucleon(A) > bindingPerNucleon(a) ? A : a), 4);
ok('SEMF peak near A ≈ 56-62 at ~8.8 MeV', peak >= 50 && peak <= 70 && Math.abs(bindingPerNucleon(peak) - 8.75) < 0.2, `A=${peak}, ${bindingPerNucleon(peak).toFixed(3)} MeV`);
ok('SEMF U-238 ≈ 7.6 MeV', Math.abs(bindingPerNucleon(238) - 7.57) < 0.1, bindingPerNucleon(238).toFixed(3));
ok('WD radius decreases with mass and vanishes at M_Ch', wdRadius(0.6) > wdRadius(1.0) && wdRadius(1.0) > wdRadius(1.4) && wdRadius(1.44) === 0);
console.log(fails ? `${fails} FAILED` : 'ALL PASS');
process.exit(fails ? 1 : 0);
