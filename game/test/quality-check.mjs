// Graphics governor: starting level from the machine, stepping down on a low frame rate, the frame-rate caps and the
// reading rate. Usage: node test/quality-check.mjs
import { createQuality, LEVELS } from '../src/quality.js';
let fails = 0, n = 0; const ok = (name, c, x = '') => { n++; if (!c) { fails++; console.log(`FAIL ${name} ${x}`); } };
const mk = (mem, cores, dpr = 2) => { const log = []; const q = createQuality({ setPixelRatio: (r) => log.push(r), deviceRatio: () => dpr, memoryGb: () => mem, cores: () => cores }); return { q, log }; };
{ const { q, log } = mk(16, 8); q.setMode('auto'); ok('strong machine starts high', q.level === 'high' && log.at(-1) === 2); }
{ const { q, log } = mk(4, 4); q.setMode('auto'); ok('4 GB laptop starts low: 0.75 resolution, 30 fps', q.level === 'low' && log.at(-1) === 0.75 && q.info().fpsCap === 30); }
{ const { q } = mk(8, 4); q.setMode('auto'); ok('4 cores start medium', q.level === 'medium'); }
{ const { q, log } = mk(16, 8); q.setMode('auto'); let t = 0; for (let i = 0; i < 400; i++) { t += 66; q.sample(t, 66); } ok('15 fps steps down to minimal', q.level === 'minimal' && log.at(-1) === 0.5, q.level); }
{ const { q } = mk(16, 8); q.setMode('auto'); let t = 0; for (let i = 0; i < 400; i++) { t += 17; q.sample(t, 17); } ok('60 fps stays high', q.level === 'high'); }
{ const { q } = mk(4, 4); q.setMode('auto'); let t = 0; for (let i = 0; i < 2000; i++) { t += 33.3; q.sample(t, 33.3); } ok('a slow machine that holds its 30 fps cap may step up, at most twice', ['low', 'medium', 'high'].includes(q.level)); }
{ const { q } = mk(16, 8); q.setMode('low'); let t = 0; for (let i = 0; i < 400; i++) { t += 100; q.sample(t, 100); } ok('a fixed level is not changed by the governor', q.level === 'low'); }
{ const { q } = mk(16, 8); q.setMode('low'); let drawn = 0; for (let t = 0; t < 1000; t += 16.7) if (q.shouldRender(t)) drawn++; ok('low draws about 30 frames a second', drawn >= 28 && drawn <= 32, drawn); }
{ const { q } = mk(16, 8); q.setMode('high'); let drawn = 0; for (let t = 0; t < 1000; t += 16.7) if (q.shouldRender(t)) drawn++; ok('high draws every frame', drawn >= 59); drawn = 0; for (let t = 2000; t < 3000; t += 16.7) if (q.shouldRender(t, { reading: true })) drawn++; ok('while reading an exercise: about 12 frames a second', drawn >= 11 && drawn <= 13, drawn); }
{ const { q } = mk(16, 8); q.setMode('nonsense'); ok('unknown setting means auto', q.mode === 'auto'); ok('four levels', LEVELS.length === 4); }
console.log(`${n} checks`); console.log(fails ? `${fails} FAILED` : 'ALL OK'); process.exit(fails ? 1 : 0);
