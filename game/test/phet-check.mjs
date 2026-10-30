// PhET band-structure exercises (solid state extras): every answer evaluates, matches the sim's solver values noted
// in notes/solid-state/build/phet/README.md, and all LaTeX renders. Usage: node test/phet-check.mjs
import { readFileSync } from 'node:fs';
import katex from '../vendor/katex/katex.mjs';
import { evaluate } from '../src/expr.js';
const { items } = JSON.parse(readFileSync(new URL('../content/solid-state/phet-band-structure.json', import.meta.url)));
let fails = 0; const ok = (n, c, x = '') => { console.log(`${c ? 'PASS' : 'FAIL'} ${n} ${x}`); if (!c) fails++; };
const near = (a, b, r = 0.01) => Math.abs(a / b - 1) < r;
const got = {};
for (const { room, enc } of items) {
  ok(`${enc.id} in fermi-sea, has sim`, room === 'fermi-sea' && enc.sim?.url?.startsWith('https://phet.colorado.edu/') && enc.sim.setup);
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
console.log(fails ? `${fails} FAILED` : 'ALL PASS'); process.exit(fails ? 1 : 0);
