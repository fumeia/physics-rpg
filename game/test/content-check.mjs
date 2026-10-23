// Logic checks without a browser: every quest answer evaluates and matches independently computed
// values; symbolic references are equivalent to the physics formulas; choices/orders are well formed.
import { readFileSync } from 'node:fs';
import { evaluate, parseNumber, withinTolerance, checkSymbolic } from '../src/expr.js';
import { TunnelSim } from '../src/sim.js';

const room = JSON.parse(readFileSync(new URL('../content/qm/tunneling-bridge.json', import.meta.url)));
let fails = 0;
const ok = (name, cond, extra = '') => { console.log(`${cond ? 'PASS' : 'FAIL'} ${name} ${extra}`); if (!cond) fails++; };
const near = (a, b, r = 1e-3) => Math.abs(a / b - 1) < r;
const enc = (id) => room.encounters.find((e) => e.id === id);
const step = (e, id) => enc(e).steps.find((s) => s.id === id);

// ---- structure
for (const e of room.encounters) {
  if (e.type === 'predict-observe') {
    ok(`${e.id}: correct index in range`, e.correct >= 0 && e.correct < e.options.length);
    ok(`${e.id}: derivation present`, e.derivation?.length >= 4);
    ok(`${e.id}: explanation for every wrong option`, e.options.every((_, k) => k === e.correct || e.whyWrong?.[k]));
    ok(`${e.id}: symbols defined`, e.symbols?.length >= 8);
  }
  if (e.type === 'calc') {
    for (const s of e.steps) {
      const kind = s.kind || 'numeric';
      if (kind === 'choice') ok(`${e.id}.${s.id} choice: correct in range, why for wrong ones`, s.correct < s.options.length && s.options.every((_, k) => k === s.correct || s.why?.[k]));
      if (kind === 'order') ok(`${e.id}.${s.id} order: every item explains why it cannot come early`, s.items.every((it) => it.why) && s.items.length >= 4);
      if (kind === 'symbolic') {
        const spec = { symbols: s.symbols, constraint: s.constraint ? new Function('v', `return (${s.constraint});`) : null };
        ok(`${e.id}.${s.id} symbolic: reference accepts itself`, checkSymbolic(s.answer, s.answer, spec).ok);
        ok(`${e.id}.${s.id} symbolic: unit listed`, s.units.includes(s.unit));
      }
    }
  }
}

// ---- symbolic references equal the physics (independent evaluation at a point)
{
  const v = { m: 1, V0: 1, E: 0.5, hbar: 1 };
  ok('kappa reference = 1 for m=V0=hbar=1, E=0.5', near(evaluate(step('qm-tunnel-c1', 's2').answer, v), 1));
  const spec2 = { symbols: step('qm-tunnel-c1', 's2').symbols, constraint: (x) => x.V0 > x.E };
  ok('kappa: expanded form accepted', checkSymbolic('sqrt(2*m*V0-2*m*E)/hbar', step('qm-tunnel-c1', 's2').answer, spec2).ok);
  ok('kappa: wrong sign rejected', !checkSymbolic('sqrt(2*m*(V0+E))/hbar', step('qm-tunnel-c1', 's2').answer, spec2).ok);
  ok('kappa: missing hbar rejected', !checkSymbolic('sqrt(2*m*(V0-E))', step('qm-tunnel-c1', 's2').answer, spec2).ok);
  const thick = evaluate(step('qm-tunnel-c1', 's5').answer, { E: 0.5, V0: 1, kappa: 1, L: 2 });
  ok('thick-barrier formula = 4 e^-4 for E=V0/2, kappa=1, L=2', near(thick, 4 * Math.exp(-4)));
  ok('thick-barrier vs exact plane-wave T (10 %)', near(thick, TunnelSim.transmission(0.5, 1, 2), 0.1), `${thick.toFixed(4)} vs ${TunnelSim.transmission(0.5, 1, 2).toFixed(4)}`);
  ok('STM kappa symbolic at m=1,phi=2,hbar=1 is 2', near(evaluate(step('qm-tunnel-c2', 'q2').answer, { m: 1, phi: 2, hbar: 1 }), 2));
  ok('STM factor symbolic', near(evaluate(step('qm-tunnel-c2', 'q3').answer, { kappa: 1, dd: 1 }), Math.exp(2)));
}

// ---- numeric steps
{
  const s7 = step('qm-tunnel-c1', 's7'), a = evaluate(s7.answer, enc('qm-tunnel-c1').vars);
  ok('c1 bonus T = 5.376e-4 (electron, 2 eV, 5 eV, 0.5 nm)', near(a, 5.3761e-4, 1e-3), String(a));
  const approx = (16 * 2 * 3) / 25 * Math.exp(-2 * 4.43679);
  ok('c1 bonus agrees with exponential approximation (<0.5 %)', near(a, approx, 5e-3));
  const q5 = evaluate(step('qm-tunnel-c2', 'q5').answer, enc('qm-tunnel-c2').vars);
  ok('STM factor 7.76', near(q5, 7.762, 1e-3), String(q5));
}

// ---- boss
{
  const v = {};
  for (const f of enc('qm-tunnel-b1').finalAnswers) v[f.id] = evaluate(f.answer, f.vars);
  ok('boss j = 1.5', near(v.j2, 1.5));
  ok('boss R = 0.02944', near(v.R, 0.029437, 2e-3));
  ok('boss T = 0.97056', near(v.Tt, 0.97056, 1e-3));
  ok('boss R + T = 1', Math.abs(v.R + v.Tt - 1) < 1e-12);
  ok('boss requires the door lock', enc('qm-tunnel-b1').requires === 'qm-tunnel-c1');
}

// ---- lessons, quiz, derivations (QM)
{
  const ids = room.encounters.map((e) => e.id);
  ok('encounter ids unique and namespaced', new Set(ids).size === ids.length && ids.every((i) => i.startsWith('qm-tunnel-')));
  for (const e of room.encounters) {
    if (e.type === 'lesson') ok(`${e.id}: lesson has blocks, sources and checks`, e.blocks.length >= 6 && e.source?.length && e.check?.length >= 2 && e.check.every((q) => q.correct < q.options.length && q.explain));
    if (e.type === 'quiz') ok(`${e.id}: quiz well-formed`, e.questions.length >= 6 && e.questions.every((q) => q.options.length === 4 && q.correct < 4 && q.explain) && e.passMark > 0);
    if (e.type === 'derive') ok(`${e.id}: derive well-formed`, e.steps.length >= 4 && e.keyPoints.length >= 3 && e.source?.file && e.goal);
  }
  // numbers used in the lesson checks
  const nStates = (xi0) => Math.ceil(xi0 / (Math.PI / 2) - 1e-12); // (N-1) pi/2 < xi0 <= N pi/2
  ok('radius 4 => 3 bound states', nStates(4) === 3);
  // independent check by counting intersections numerically: even eta=xi tan(xi), odd eta=-xi cot(xi), circle radius 4
  let count = 0; const xi0 = 4;
  for (const f of [(x) => x * Math.tan(x), (x) => -x / Math.tan(x)]) {
    let prev = null;
    for (let x = 1e-4; x < xi0; x += 1e-4) { const g = f(x); const d = Math.sqrt(Math.max(0, xi0 * xi0 - x * x)); if (g < 0 || !Number.isFinite(g)) { prev = null; continue; } const s = g - d; if (prev !== null && prev < 0 && s >= 0) count++; prev = s; }
  }
  ok('numerical intersection count for radius 4 is 3', count === 3, String(count));
  const k = 3, l = 1;
  ok('step k=3l: R=1/4, T=3/4', near(((k - l) / (k + l)) ** 2, 0.25) && near((4 * k * l) / (k + l) ** 2, 0.75));
  ok('deuteron threshold pi^2/4 = 2.467 > 2', Math.PI ** 2 / 4 > 2);
  ok('STM factor e^2 ~ 7.4-7.8 for 2*kappa*dz = 2.05', near(Math.exp(2.0492), 7.76, 0.01));
}

// ---- tutorial
ok('tutorial has 8 steps with titles and text', room.tutorial?.length === 8 && room.tutorial.every((s) => s.title && s.html));

ok('parseNumber sci', parseNumber('5.4×10^-4') === 0.00054 && parseNumber('5,4e-4') === 0.00054 && Number.isNaN(parseNumber('abc')));
ok('rel tolerance', withinTolerance(8.9, 8.87, { tol: 0.02 }) && !withinTolerance(9.5, 8.87, { tol: 0.02 }));
ok('log tolerance', withinTolerance(1.5e-4, 1.4e-4, { tolType: 'log', tol: 0.1 }) && !withinTolerance(1e-3, 1.4e-4, { tolType: 'log', tol: 0.1 }));
console.log(fails ? `${fails} FAILED` : 'ALL PASS');
process.exit(fails ? 1 : 0);
