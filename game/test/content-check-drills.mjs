// Drills: content/<course>/drills.json = { spot: [], limits: [], sketch: [] }; content/radar.json = topic frequency data.
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import katex from '../vendor/katex/katex.mjs';
const courses = ['qm', 'solid-state', 'astrophysics'], only = process.argv[2];
let fails = 0, n = { spot: 0, limits: 0, sketch: 0 }; const bad = (m) => { console.log('FAIL', m); fails++; };
const rendersOk = (t) => { if (typeof t !== 'string') return false; const p = t.split('$'); if (p.length % 2 === 0) return false; try { p.forEach((s, i) => { if (i % 2) katex.renderToString(s, { throwOnError: true, strict: 'ignore' }); }); return true; } catch { return false; } };
const txt = (id, k, t, min = 8, max = 900) => { if (typeof t !== 'string' || t.length < min || t.length > max) bad(`${id}.${k}: bad length ${t?.length}`); else if (!rendersOk(t)) bad(`${id}.${k}: KaTeX/dollar problem: ${t.slice(0, 60)}`); };
for (const c of courses) {
  if (only && c !== only) continue;
  const rooms = new Set(JSON.parse(readFileSync(`content/${c}/index.json`)).rooms), f = `content/${c}/drills.json`;
  if (!existsSync(f)) { bad(`${c}: drills.json missing`); continue; }
  const d = JSON.parse(readFileSync(f)), ids = new Set();
  for (const kind of ['spot', 'limits', 'sketch']) {
    if (!Array.isArray(d[kind]) || d[kind].length < (kind === 'sketch' ? 5 : kind === 'spot' ? 8 : 12)) bad(`${c}.${kind}: too few items (${d[kind]?.length})`);
    for (const it of d[kind] || []) {
      n[kind]++; const id = it.id || '?';
      if (!/^drill-[a-z-]+-(spot|lim|sk)-\d+$/.test(id) || ids.has(id)) bad(`${id}: id format/duplicate`); ids.add(id);
      if (!rooms.has(it.room)) bad(`${id}: unknown room ${it.room}`);
      if (!it.source?.file || !it.source?.where) bad(`${id}: source {file, where} missing`);
      txt(id, 'title', it.title, 5, 120);
      if (kind === 'spot') {
        txt(id, 'intro', it.intro, 20); if (!Array.isArray(it.steps) || it.steps.length < 4 || it.steps.length > 9) bad(`${id}: 4-9 steps needed`); else it.steps.forEach((s, i) => txt(id, `step${i}`, s, 5, 400));
        if (!Number.isInteger(it.error) || it.error < 0 || it.error >= (it.steps?.length || 0)) bad(`${id}: error index`); txt(id, 'why', it.why, 30); txt(id, 'fix', it.fix, 10, 400);
      } else if (kind === 'limits') {
        txt(id, 'prompt', it.prompt, 20, 500); if (it.formula) txt(id, 'formula', it.formula, 3, 300); if (!Array.isArray(it.options) || it.options.length < 3 || it.options.length > 4) bad(`${id}: 3-4 options`); else it.options.forEach((o, i) => txt(id, `opt${i}`, o, 3, 260));
        if (!Number.isInteger(it.correct) || it.correct < 0 || it.correct >= (it.options?.length || 0)) bad(`${id}: correct index`); txt(id, 'explain', it.explain, 40);
      } else {
        txt(id, 'task', it.task, 20, 500); for (const a of ['x', 'y']) { const ax = it[a]; if (!ax || typeof ax.label !== 'string' || !(ax.max > ax.min) || (ax.log && ax.min <= 0)) bad(`${id}.${a}: axis {label,min,max,log?}`); }
        const curves = it.curves; if (!Array.isArray(curves) || !curves.length) bad(`${id}: curves needed`); else for (const cu of curves) { if (!cu.label || !Array.isArray(cu.points) || cu.points.length < 8) bad(`${id}: curve needs label and 8+ points`); else for (const [x, y] of cu.points) if (!(x >= it.x.min * 0.999 && x <= it.x.max * 1.001 && y >= it.y.min * 0.999 && y <= it.y.max * 1.001) || ![x, y].every(Number.isFinite)) { bad(`${id}: point (${x},${y}) outside the axes`); break; } }
        if (!Array.isArray(it.features) || it.features.length < 3) bad(`${id}: 3+ features to self-check`); else it.features.forEach((s, i) => txt(id, `feat${i}`, s, 8, 300));
      }
    }
  }
}
if (!only) { // exam radar data
  if (!existsSync('content/radar.json')) bad('radar.json missing'); else {
    const r = JSON.parse(readFileSync('content/radar.json')); if (!Array.isArray(r.topics) || r.topics.length < 30) bad('radar: 30+ topics needed');
    for (const t of r.topics || []) { const idx = courses.includes(t.course) ? JSON.parse(readFileSync(`content/${t.course}/index.json`)).rooms : []; if (!t.label || !(t.count >= 0) || !(t.of > 0) || t.count > t.of || !t.rooms?.length || !t.rooms.every((s) => idx.includes(s))) bad(`radar topic ${t.label}: label/count/of/rooms invalid`); }
  }
}
console.log(fails ? `${fails} FAILED` : `OK: ${n.spot} spot-the-error, ${n.limits} limiting-case, ${n.sketch} sketch items`); process.exit(fails ? 1 : 0);
