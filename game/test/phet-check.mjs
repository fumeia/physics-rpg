// PhET band-structure exercises (solid state extras): every answer evaluates, matches the sim's solver values noted
// in notes/solid-state/build/phet/README.md, and all LaTeX renders. Usage: node test/phet-check.mjs
import { readFileSync } from 'node:fs';
import katex from '../vendor/katex/katex.mjs';
import { evaluate } from '../src/expr.js';
const load = (f) => JSON.parse(readFileSync(new URL('../content/' + f, import.meta.url))).items;
const items = ['solid-state/phet-band-structure.json', 'solid-state/phet-sims.json', 'qm/phet-sims.json', 'astrophysics/phet-sims.json'].flatMap(load);
const rooms = Object.fromEntries(['qm', 'solid-state', 'astrophysics'].map((c) => [c, JSON.parse(readFileSync(new URL(`../content/${c}/index.json`, import.meta.url))).rooms]));
let fails = 0; const ok = (n, c, x = '') => { console.log(`${c ? 'PASS' : 'FAIL'} ${n} ${x}`); if (!c) fails++; };
const near = (a, b, r = 0.01) => Math.abs(a / b - 1) < r;
const got = {};
for (const { room, enc } of items) {
  ok(`${enc.id} room exists, has sim`, Object.values(rooms).some((r) => r.includes(room)) && enc.sim?.url?.startsWith('https://phet.colorado.edu/') && enc.sim.setup);
  const scope = {}; got[enc.id] = {};
  for (const s of enc.steps) {
    if (s.kind === 'choice') { ok(`${enc.id}.${s.id} choice valid`, s.correct >= 0 && s.correct < s.options.length && Object.keys(s.why).length === s.options.length - 1); continue; }
    const v = evaluate(s.answer, scope); scope[s.id] = v; got[enc.id][s.id] = v;
    ok(`${enc.id}.${s.id} evaluates`, Number.isFinite(v), String(v)); ok(`${enc.id}.${s.id} unit listed, hint`, s.units.includes(s.unit) && s.hint.length > 20);
  }
  const strs = [enc.title, enc.problem, enc.sim.setup, ...enc.steps.flatMap((s) => [s.prompt, s.hint, s.after, ...(s.options || []), ...Object.values(s.why || {})])].filter(Boolean);
  for (const t of strs) for (const m of t.matchAll(/\$([^$]+)\$/g)) { try { katex.renderToString(m[1], { throwOnError: true }); } catch (e) { ok(`${enc.id} LaTeX ${m[1].slice(0, 40)}`, false, e.message.slice(0, 80)); } }
}
// independent checks (values from the sim's solver, README; physics cross-checks)
ok('one-well ground state 0.967 eV', near(got['ss-fer-p1'].e1, 0.9668, 0.002));
ok('5-well band width 0.272 eV', near(got['ss-fer-p1'].w1, 0.2717));
ok('B from 2 wells = 0.0737 eV', near(got['ss-fer-p2'].B, 0.0737));
ok('TB 5-well width within 10% of the sim (0.272)', near(got['ss-fer-p2'].W5, 0.2717, 0.1));
ok('TB 4B within 2% of the 10-well sim width (0.294)', near(got['ss-fer-p2'].Winf, 1.0997 - 0.8056, 0.02));
ok('tunnelling prediction matches the measured width ratio within 3%', near(got['ss-fer-p3'].pred, got['ss-fer-p3'].r, 0.03));
ok('10-well gap with 2 e/well = 2.09 eV', near(got['ss-fer-p5'].g2, 2.0932));
const g = (e, s) => got[e][s];
ok('HO zero point 0.329 eV, n=5 at omega 2: 7.238 eV (sim solver)', near(g('qm-ho-p1', 'E0'), 0.3290) && near(g('qm-ho-p1', 'E5'), 7.2380));
ok('square well: 6 states, E1 0.2996, 3 states at 0.5 nm', g('qm-wm-p1', 'n') === 6 && near(g('qm-wm-p1', 'E1'), 0.2996) && g('qm-wm-p1', 'n05') === 3);
ok('Coulomb -13.6016 / -6.8008 eV, H-alpha 656 nm', near(g('qm-hl-p1', 'E1'), -13.6016) && near(g('qm-hl-p1', 'Eps'), -6.8008) && near(g('qm-hl-p1', 'lam'), 656.3, 0.003));
ok('barrier T = 0.32467, 0.03856, 0.00397, R(0.6 eV) = 0.50960 (sim SingleBarrierSolver)', near(g('qm-tunnel-p1', 'T1'), 0.32467, 1e-3) && near(g('qm-tunnel-p1', 'T2'), 0.03856, 2e-3) && near(g('qm-tunnel-p1', 'T3'), 0.00397, 3e-3) && near(g('qm-tunnel-p1', 'R6'), 0.50960, 1e-3));
ok('resonance energy 0.876 eV (sim: T = 1.00000)', near(g('qm-tunnel-p1', 'Eres'), 0.876, 2e-3));
ok('SG custom 0.75 / 0.933', near(g('qm-sa-p1', 'pz'), 0.75) && near(g('qm-sa-p1', 'px'), 0.9330, 2e-3));
ok('Ar r_min 422 pm, f about 0.69 THz', near(g('ss-bon-p1', 'rmin'), 422.0, 3e-3) && near(g('ss-bon-p1', 'f'), 0.69, 0.02));
ok('Sirius peak 0.291 um, Earth 11.6 um, L_sun 3.9e26 W', near(g('astro-light-p1', 'lamS'), 0.2912, 3e-3) && near(g('astro-light-p1', 'lamE'), 11.59, 3e-3) && near(g('astro-light-p1', 'L'), 3.9e26, 0.02));
console.log(fails ? `${fails} FAILED` : 'ALL PASS'); process.exit(fails ? 1 : 0);
