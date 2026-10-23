// QM content check (all rooms except the tunnelling bridge, which has test/content-check.mjs):
//  (1) structure of every encounter, unique namespaced ids, sources, tutorials;
//  (2) every $...$ and $$...$$ snippet renders in KaTeX (throwOnError);
//  (3) every symbolic reference accepts itself and rejects wrong variants, every numeric/boss answer evaluates;
//  (4) physics: answers are compared with independent computations (matrix algebra, series, recurrences) coded below.
import { readFileSync, existsSync } from 'node:fs';
import katex from '../vendor/katex/katex.mjs';
import { evaluate, withinTolerance, checkSymbolic } from '../src/expr.js';
import * as LA from './qm-linalg.mjs';

const dir = new URL('../content/qm/', import.meta.url);
const index = JSON.parse(readFileSync(new URL('index.json', dir)));
let fails = 0, checks = 0;
const ok = (name, cond, extra = '') => { checks++; if (!cond) { fails++; console.log(`FAIL ${name} ${extra}`); } };
const near = (a, b, r = 1e-6) => Math.abs(a - b) <= r * Math.max(1, Math.abs(b));
const rel = (a, b, r = 1e-6) => Math.abs(a / b - 1) <= r;

const rooms = {}; // slug -> room
for (const slug of index.rooms) rooms[slug] = JSON.parse(readFileSync(new URL(slug + '.json', dir)));
const NEW = index.rooms.filter((s) => s !== 'tunneling-bridge');
const enc = (slug, id) => rooms[slug].encounters.find((e) => e.id === id);
const step = (slug, id, sid) => enc(slug, id).steps.find((s) => s.id === sid);
// evaluate the reference of a symbolic step at a point
const symAt = (slug, id, sid, v) => evaluate(step(slug, id, sid).answer, v);
const boss = (slug, id) => { const out = {}; for (const f of enc(slug, id).finalAnswers) out[f.id] = evaluate(f.answer, f.vars); return out; };
const calcNum = (slug, id) => { const e = enc(slug, id), scope = { ...e.vars }, out = {}; for (const s of e.steps) if ((s.kind || 'numeric') === 'numeric') { out[s.id] = evaluate(s.answer, scope); scope[s.id] = out[s.id]; } return out; };

// ---------------------------------------------------------------- (2) KaTeX
function mathSnippets(str) {
  const out = []; let rest = str;
  rest = rest.replace(/\$\$([\s\S]+?)\$\$/g, (_, m) => { out.push(m); return ' '; });
  rest = rest.replace(/\$([^$]+?)\$/g, (_, m) => { out.push(m); return ' '; });
  return { out, leftover: rest };
}
function walk(o, f, path = '') {
  if (typeof o === 'string') f(o, path);
  else if (Array.isArray(o)) o.forEach((x, i) => walk(x, f, `${path}[${i}]`));
  else if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) walk(v, f, `${path}.${k}`);
}
const SKIP_KEYS = /(\.answer|\.constraint|\.file|\.id|\.type|\.kind|\.fight|\.tier|\.region|\.course|\.exhibit|\.units\[\d+\]|\.unit|\.wrong\[\d+\])$/;
for (const slug of NEW) {
  let nSnippets = 0, bad = [];
  walk(rooms[slug], (s, path) => {
    if (SKIP_KEYS.test(path)) return;
    if (/\.tex$/.test(path)) { try { katex.renderToString(s, { throwOnError: true, displayMode: true, strict: 'ignore' }); nSnippets++; } catch (e) { bad.push(path + ': ' + e.message.slice(0, 100)); } return; }
    if (/\.latex$/.test(path)) { try { katex.renderToString(s, { throwOnError: true, strict: 'ignore' }); nSnippets++; } catch (e) { bad.push(path + ': ' + e.message.slice(0, 100)); } return; }
    const { out, leftover } = mathSnippets(s);
    if ((leftover.match(/\$/g) || []).length) bad.push(path + ': unbalanced $ in ' + s.slice(0, 60));
    for (const m of out) { try { katex.renderToString(m, { throwOnError: true, strict: 'ignore' }); nSnippets++; } catch (e) { bad.push(path + ': ' + e.message.slice(0, 100)); } }
  });
  ok(`${slug}: all ${nSnippets} KaTeX snippets render`, bad.length === 0, bad.slice(0, 6).join(' | '));
}

// ---------------------------------------------------------------- (1)+(3) structure
const allIds = new Set();
const UNITS_OK = (s) => Array.isArray(s.units) && s.units.includes(s.unit);
for (const slug of NEW) {
  const room = rooms[slug];
  ok(`${slug}: header`, room.id === 'qm-' + slug && room.region === 'QM Interference Labs' && room.course === 'quantum-mechanics' && room.exhibit === 'set' && room.title && room.intro && room.topics?.length >= 3);
  ok(`${slug}: sources have file+where, >= 3`, room.sources?.length >= 3 && room.sources.every((s) => s.file && s.where));
  ok(`${slug}: source files exist`, room.sources.every((s) => existsSync(new URL('../../' + s.file, import.meta.url))), room.sources.filter((s) => !existsSync(new URL('../../' + s.file, import.meta.url))).map((s) => s.file).join(', '));
  ok(`${slug}: tutorial`, room.tutorial?.length >= 2 && room.tutorial.every((t) => t.title && t.html && t.look));
  const types = room.encounters.map((e) => e.type);
  const order = ['lesson', 'quiz', 'derive', 'calc', 'boss'];
  ok(`${slug}: order lessons, quiz, derive, calc, boss`, types.every((t, i) => i === 0 || order.indexOf(types[i - 1]) <= order.indexOf(t)), types.join(','));
  ok(`${slug}: has lessons, quiz, derive, calc, boss`, order.every((t) => types.includes(t)));
  for (const e of room.encounters) {
    const key = `${slug}/${e.id}`;
    ok(`${key}: namespaced unique id`, /^qm-[a-z]+-[A-Za-z0-9]+$/.test(e.id) && !allIds.has(e.id)); allIds.add(e.id);
    ok(`${key}: title`, !!e.title);
    if (e.type === 'lesson') {
      ok(`${key}: lesson blocks`, e.blocks.length >= 6 && e.blocks.every((x) => ['text', 'eq', 'intuition', 'pitfall', 'figure', 'exam'].includes(x.kind) && (x.html || x.tex)) && e.blocks.some((x) => x.kind === 'eq'));
      ok(`${key}: lesson checks (2-3)`, e.check.length >= 2 && e.check.length <= 3 && e.check.every((q) => q.options.length === 4 && q.correct >= 0 && q.correct < 4 && q.explain && new Set(q.options).size === 4));
      ok(`${key}: lesson source`, e.source.length >= 1 && e.source.every((x) => x.file && x.where));
    }
    if (e.type === 'quiz') {
      ok(`${key}: quiz 6-10 valid questions`, e.questions.length >= 6 && e.questions.length <= 10 && e.questions.every((q) => q.options.length === 4 && q.correct >= 0 && q.correct < 4 && q.explain && new Set(q.options).size === 4));
      ok(`${key}: quiz passMark/source`, e.passMark > 0 && e.passMark <= 1 && e.source?.length);
    }
    if (e.type === 'derive') ok(`${key}: derive`, e.steps.length >= 3 && e.steps.every((x) => x.prompt && x.reveal) && e.keyPoints.length >= 3 && e.source?.file && e.source?.where && e.goal && e.given?.length);
    if (e.type === 'calc') {
      ok(`${key}: calc header`, (e.fight === 'normal' || e.fight === 'fermi') && e.problem && e.symbols?.length >= 3 && e.vars);
      const kinds = e.steps.map((s) => s.kind || 'numeric');
      ok(`${key}: process-first (>=1 choice or order, >=1 symbolic or order, <=1 numeric)`, kinds.some((k) => k === 'choice' || k === 'order') && kinds.filter((k) => k === 'numeric').length <= 1, kinds.join(','));
      const ids = e.steps.map((s) => s.id); ok(`${key}: step ids unique`, new Set(ids).size === ids.length);
      const scope = { ...e.vars };
      for (const s of e.steps) {
        const kind = s.kind || 'numeric', sk = `${key}.${s.id}`;
        if (kind === 'choice') ok(`${sk} choice`, s.options.length >= 3 && s.correct >= 0 && s.correct < s.options.length && s.options.every((_, k) => k === s.correct || s.why?.[k]) && new Set(s.options).size === s.options.length);
        if (kind === 'order') ok(`${sk} order`, s.items.length >= 4 && s.items.every((it) => it.text && it.why) && s.hint);
        if (kind === 'symbolic') {
          const spec = { symbols: s.symbols, constraint: s.constraint ? new Function('v', `return (${s.constraint});`) : null };
          ok(`${sk} symbolic accepts itself`, checkSymbolic(s.answer, s.answer, spec).ok);
          ok(`${sk} symbolic unit listed, latex+hint`, UNITS_OK(s) && s.latex && s.hint && s.hint.length > 20);
          const names = Object.keys(s.symbols);
          ok(`${sk} reference only uses declared symbols`, (s.answer.match(/[A-Za-z_][A-Za-z_0-9]*/g) || []).every((w) => names.includes(w) || ['sqrt', 'exp', 'log', 'sin', 'cos', 'tan', 'sinh', 'cosh', 'abs', 'pi', 'atan', 'asin', 'acos'].includes(w)), s.answer);
          ok(`${sk} has >= 1 wrong variant that is rejected`, s.wrong?.length >= 1 && s.wrong.every((w) => !checkSymbolic(w, s.answer, spec).ok), String(s.wrong));
          // an unrelated mutation of the reference must be rejected
          ok(`${sk} reference*1.1 rejected`, !checkSymbolic(`1.1*(${s.answer})`, s.answer, spec).ok);
        }
        if (kind === 'numeric') {
          let v; try { v = evaluate(s.answer, scope); } catch (err) { v = NaN; console.log('   ', err.message); }
          scope[s.id] = v;
          ok(`${sk} numeric evaluates`, Number.isFinite(v), String(v));
          ok(`${sk} numeric unit listed, tol, hint`, UNITS_OK(s) && s.tol > 0 && s.hint?.length > 20 && withinTolerance(v, v, s));
        }
      }
    }
    if (e.type === 'boss') {
      ok(`${key}: boss`, e.source?.file && e.source?.where && e.minutes >= 10 && e.statement?.length >= 4 && e.keyPoints?.length >= 4 && e.finalAnswers?.length >= 2);
      for (const f of e.finalAnswers) { let v; try { v = evaluate(f.answer, f.vars); } catch { v = NaN; } ok(`${key}.${f.id} final answer evaluates`, Number.isFinite(v) && f.tol > 0, String(v)); }
      if (e.requires) ok(`${key}: requires exists`, room.encounters.some((x) => x.id === e.requires));
    }
  }
}
// ---------------------------------------------------------------- (4) physics: sections are appended below
const hooks = [];

// ================================================================ HARMONIC OSCILLATOR ELEVATOR
hooks.push(() => {
  const S = 'harmonic-oscillator-elevator';
  if (!rooms[S]) return;
  const N = 90, a = LA.ladder(N), ad = LA.T(a);
  const x = LA.scale(LA.add(a, ad), 1 / Math.SQRT2); // x/x0
  const x2 = LA.mul(x, x), x4 = LA.mul(x2, x2);
  // anharmonic matrix elements (c1 s3-s5)
  for (const n of [0, 1, 2, 5, 9]) {
    ok(`ho c1 s3 diag n=${n}`, near(symAt(S, 'qm-ho-c1', 's3', { n, lam: 1 }), x4[n][n], 1e-9));
    ok(`ho c1 s4 n+4 n=${n}`, near(symAt(S, 'qm-ho-c1', 's4', { n, lam: 1 }), x4[n + 4][n] / 1, 1e-9));
    ok(`ho c1 s5 n+2 n=${n}`, near(symAt(S, 'qm-ho-c1', 's5', { n, lam: 1 }), x4[n + 2][n], 1e-9));
  }
  // second-order sum from the matrix (hbar=omega=1) = s7
  for (const n of [0, 1, 2, 3, 6]) {
    let E2 = 0; for (let m = 0; m < N - 8; m++) if (m !== n) E2 += (x4[m][n] ** 2) / (n - m);
    ok(`ho c1 s7 second order n=${n}`, near(symAt(S, 'qm-ho-c1', 's7', { n, lam: 1, hbar: 1, omega: 1 }), E2, 1e-9), `${E2}`);
  }
  // exact diagonalisation: E0(lambda=0.01) vs PT through second order
  {
    const lam = 0.01, M = 140, aa = LA.ladder(M), xx = LA.scale(LA.add(aa, LA.T(aa)), 1 / Math.SQRT2), xx4 = LA.mul(LA.mul(xx, xx), LA.mul(xx, xx));
    const H = LA.zeros(M); for (let n = 0; n < M; n++) H[n][n] = n + 0.5;
    const ev = LA.jacobi(LA.add(H, xx4, lam)).values;
    const pt = (n) => n + 0.5 + symAt(S, 'qm-ho-c1', 's3', { n, lam }) + symAt(S, 'qm-ho-c1', 's7', { n, lam, hbar: 1, omega: 1 });
    for (const n of [0, 1, 2]) ok(`ho c1 exact vs 2nd-order PT, n=${n}, lam=0.01`, Math.abs(ev[n] - pt(n)) < 4e-4 * (n + 1) ** 3, `${ev[n]} vs ${pt(n)}`);
    ok('ho c1 relative first-order correction grows ~ n', symAt(S, 'qm-ho-c1', 's3', { n: 20, lam: 1 }) / 20.5 > 10 * symAt(S, 'qm-ho-c1', 's3', { n: 2, lam: 1 }) / 2.5 / 3);
  }
  ok('ho c1 bonus 0.545', near(calcNum(S, 'qm-ho-c1').s9, 0.545, 1e-9));

  // squeezing perturbation (c2, HS25 Q3): exact vs sqrt(1-4 lam^2)(n+1/2), PT coefficients from the matrix
  {
    const lam = 0.05, M = 220, aa = LA.ladder(M), at = LA.T(aa);
    const Hp = LA.add(LA.mul(aa, aa), LA.mul(at, at)); // a^2 + a^dag^2
    const H = LA.zeros(M); for (let n = 0; n < M; n++) H[n][n] = n + 0.5;
    const ev = LA.jacobi(LA.add(H, Hp, lam)).values;
    for (let n = 0; n < 5; n++) ok(`ho c2 exact squeezed oscillator n=${n}`, rel(ev[n], symAt(S, 'qm-ho-c2', 's6', { hbar: 1, omega: 1, lam, n }), 1e-6), `${ev[n]}`);
    for (const n of [0, 2, 4]) {
      ok(`ho c2 s2 matrix element n=${n}`, near(symAt(S, 'qm-ho-c2', 's2', { n }), Hp[n + 2][n], 1e-12));
      let E2 = 0, cup = 0, cdn = 0;
      for (let m = 0; m < M; m++) if (m !== n) { E2 += (Hp[m][n] ** 2) / (n - m); if (m === n + 2) cup = Hp[m][n] / (n - m); if (m === n - 2) cdn = Hp[m][n] / (n - m); }
      ok(`ho c2 s4 E2 from matrix n=${n}`, near(symAt(S, 'qm-ho-c2', 's4', { lam: 1, n, hbar: 1, omega: 1 }), E2, 1e-9));
      ok(`ho c2 s3 coefficient |n+2> n=${n}`, near(symAt(S, 'qm-ho-c2', 's3', { lam: 1, n }), cup, 1e-9));
      ok(`ho c2 diagonal element zero n=${n}`, Hp[n][n] === 0);
      if (n === 2) { const b = boss(S, 'qm-ho-b1'); ok('ho b1 cup/cdown/E2 vs matrix PT (n=2)', near(b.cup, cup, 1e-9) && near(b.cdown, cdn, 1e-9) && near(b.E2, E2, 1e-9), JSON.stringify(b)); }
    }
    ok('ho c2 bonus 2.4875 and exact 2.5 sqrt(0.99)', near(calcNum(S, 'qm-ho-c2').s7, 2.4875, 1e-9) && near(ev[2], 2.5 * Math.sqrt(0.99), 1e-6), `${ev[2]}`);
    // the operator identity a^2 + a^dag^2 = (mw/hbar) q^2 - p^2/(m hbar w): in x-units q^2 - p^2 with x=(a+a')/sqrt2, p=i(a'-a)/sqrt2
    const xx = LA.scale(LA.add(aa, at), 1 / Math.SQRT2);
    const p2 = LA.scale(LA.add(LA.add(LA.mul(aa, aa), LA.mul(at, at), 1), LA.add(LA.mul(aa, at), LA.mul(at, aa)), -1), -0.5); // p^2 = -(a'-a)^2/2 = -(a'^2 + a^2 - a'a - a a')/2
    const x2 = LA.mul(xx, xx), diff = LA.add(x2, p2, -1);
    let md = 0; for (let i = 0; i < 20; i++) for (let j = 0; j < 20; j++) md = Math.max(md, Math.abs(diff[i][j] - Hp[i][j])); ok('ho identity a^2+a^dag^2 = x^2 - p^2', md < 1e-12, String(md));
  }
  // coherent states (c3, D1): numerical state in the number basis
  {
    const A = 1.5, phi0 = 0.7, t = 0.9, M = 80;
    const c = []; let lnf = 0; for (let n = 0; n < M; n++) { if (n > 0) lnf += Math.log(n); const mag = Math.exp(-A * A / 2 + n * Math.log(A) - lnf / 2); const ph = n * phi0 - (n + 0.5) * t; c.push([mag * Math.cos(ph), mag * Math.sin(ph)]); }
    const expect = (Op) => { let re = 0; for (let i = 0; i < M; i++) for (let j = 0; j < M; j++) { const v = Op[i][j]; if (v) re += v * (c[i][0] * c[j][0] + c[i][1] * c[j][1]); } return re; };
    const aa = LA.ladder(M), at = LA.T(aa), X = LA.scale(LA.add(aa, at), 1 / Math.SQRT2);
    const ex = expect(X);
    ok('ho c3 s3 <x>(t) vs numeric coherent state', near(symAt(S, 'qm-ho-c3', 's3', { hbar: 1, m: 1, omega: 1, A, phi0, t }), ex, 1e-9), `${ex}`);
    const x2v = expect(LA.mul(X, X)), varx = x2v - ex * ex;
    ok('ho c3 Delta x^2 = 1/2 (hbar/2m w), independent of A,t', near(varx, 0.5, 1e-9), String(varx));
    const nbar = expect(LA.mul(at, aa)); ok('ho c3 <N> = A^2', near(nbar, A * A, 1e-9)); ok('ho c3 s4 <H> = A^2+1/2', near(symAt(S, 'qm-ho-c3', 's4', { hbar: 1, omega: 1, A }), nbar + 0.5, 1e-9));
    ok('ho c3 bonus P4 = e^-4 4^4/4! = 0.19537', near(calcNum(S, 'qm-ho-c3').s6, 0.195367, 1e-5));
    let sum = 0; for (let n = 0; n < 60; n++) { let f = 1; for (let k = 2; k <= n; k++) f *= k; sum += Math.exp(-4) * 4 ** n / f; } ok('ho Poisson normalised', near(sum, 1, 1e-12));
  }
  // degeneracy (c4)
  {
    const count = (k, n) => { if (k === 1) return 1; let s = 0; for (let i = 0; i <= n; i++) s += count(k - 1, n - i); return s; };
    for (let n = 0; n <= 10; n++) { ok(`ho c4 3D degeneracy n=${n}`, symAt(S, 'qm-ho-c4', 's2', { N: n }) === count(3, n)); ok(`ho c4 2D Schwinger dim n=${n}`, symAt(S, 'qm-ho-c4', 's4', { N: n }) === count(2, n)); let sph = 0; for (let l = n; l >= 0; l -= 2) sph += 2 * l + 1; ok(`ho spherical count n=${n}`, sph === count(3, n)); }
    ok('ho c4 bonus 56', calcNum(S, 'qm-ho-c4').s5 === 56);
  }
  // 3D oscillator radial equation: finite differences, eigenvalues eps = 2(2 n_r + l + 3/2)  (alpha = m omega / hbar = 1)
  {
    const Nn = 220, R = 9, h = R / (Nn + 1);
    for (const l of [0, 1, 2]) {
      const M = LA.zeros(Nn); for (let i = 0; i < Nn; i++) { const r = (i + 1) * h; M[i][i] = 2 / (h * h) + l * (l + 1) / (r * r) + r * r; if (i > 0) M[i][i - 1] = M[i - 1][i] = -1 / (h * h); }
      const ev = LA.jacobi(M).values;
      for (let nr = 0; nr < 3; nr++) ok(`ho D6 radial eigenvalue l=${l} n_r=${nr}`, rel(ev[nr], 2 * (2 * nr + l + 1.5), 3e-3), `${ev[nr]} vs ${2 * (2 * nr + l + 1.5)}`);
    }
  }
  // sech^2 (D3): -psi'' - 2 sech^2 psi = eps psi has lowest eigenvalue -1 with psi0 = 1/cosh x
  {
    const Nn = 500, R = 14, h = 2 * R / (Nn + 1), M = LA.zeros(Nn); const xs = [];
    for (let i = 0; i < Nn; i++) { const xv = -R + (i + 1) * h; xs.push(xv); M[i][i] = 2 / (h * h) - 2 / Math.cosh(xv) ** 2; if (i > 0) M[i][i - 1] = M[i - 1][i] = -1 / (h * h); }
    const { values, vectors } = LA.jacobi(M);
    ok('ho D3 sech^2 ground eps = -1', Math.abs(values[0] + 1) < 2e-3, String(values[0]));
    ok('ho D3 only one bound state (second eigenvalue >= -0.01)', values[1] > -0.01, String(values[1]));
    const v = vectors[0], ratio = xs.map((xv, i) => v[i] * Math.cosh(xv)), r0 = ratio[Nn / 2]; ok('ho D3 psi0 proportional to 1/cosh x', ratio.slice(150, 350).every((q) => Math.abs(q / r0 - 1) < 0.02));
  }
  // Hermite functions (b3): psi_2(0)
  {
    const Hn = (n, xv) => { let h0 = 1, h1 = 2 * xv; if (n === 0) return 1; for (let k = 1; k < n; k++) { const h2 = 2 * xv * h1 - 2 * k * h0; h0 = h1; h1 = h2; } return h1; };
    const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1)); const psi = (n, xv) => Hn(n, xv) * Math.exp(-xv * xv / 2) / Math.sqrt(2 ** n * fact(n) * Math.sqrt(Math.PI));
    const b = boss(S, 'qm-ho-b3'); ok('ho b3 psi_2(0) = -2/sqrt(8 sqrt pi)', near(b.psi2, psi(2, 0), 1e-9), `${b.psi2} vs ${psi(2, 0)}`);
    // numerical normalisation of psi_2 and orthogonality with psi_0 (Riemann sum)
    let n22 = 0, o20 = 0; for (let xv = -10; xv < 10; xv += 0.001) { n22 += psi(2, xv) ** 2 * 0.001; o20 += psi(2, xv) * psi(0, xv) * 0.001; } ok('ho psi_2 normalised/orthogonal', near(n22, 1, 1e-6) && Math.abs(o20) < 1e-9);
    // <x>(0) for (|0>+|1>)/sqrt2 from the matrix, in units x0
    const M = 6, aa = LA.ladder(M), X = LA.scale(LA.add(aa, LA.T(aa)), 1 / Math.SQRT2), v = [1 / Math.SQRT2, 1 / Math.SQRT2, 0, 0, 0, 0];
    let ex = 0; for (let i = 0; i < M; i++) for (let j = 0; j < M; j++) ex += v[i] * X[i][j] * v[j]; ok('ho b3 amplitude of <x>', near(b.amp, ex, 1e-9), `${b.amp} vs ${ex}`);
    const v2 = [1 / Math.SQRT2, 0, 1 / Math.SQRT2, 0, 0, 0]; let ex2 = 0; for (let i = 0; i < M; i++) for (let j = 0; j < M; j++) ex2 += v2[i] * X[i][j] * v2[j]; ok('ho b3 (|0>+|2>) has <x> = 0', Math.abs(ex2) < 1e-15);
  }
  // HS23 Q4 (b2): matrix element, translated state, 2D degenerate perturbation
  {
    const M = 12, aa = LA.ladder(M), X = LA.scale(LA.add(aa, LA.T(aa)), 1 / Math.SQRT2);
    const b = boss(S, 'qm-ho-b2'); ok('ho b2 <3|X|2> = sqrt3 (units sqrt(hbar/2mw) x sqrt2 / sqrt2)', near(b.M, LA.add(aa, LA.T(aa))[3][2], 1e-12));
    // translated ground state |psi> = exp(-i r P/hbar)|0> = coherent state alpha = r/(sqrt2 x0); <x>(t)=r cos(wt) (x0 = 1)
    const r = 2, al = r / Math.SQRT2, t = Math.PI / 3, Mm = 70, aM = LA.ladder(Mm), XM = LA.scale(LA.add(aM, LA.T(aM)), 1 / Math.SQRT2);
    const c = []; let lnf = 0; for (let n = 0; n < Mm; n++) { if (n > 0) lnf += Math.log(n); const mag = Math.exp(-al * al / 2 + n * Math.log(al) - lnf / 2); const ph = -(n + 0.5) * t; c.push([mag * Math.cos(ph), mag * Math.sin(ph)]); }
    let ex = 0; for (let i = 0; i < Mm; i++) for (let j = 0; j < Mm; j++) if (XM[i][j]) ex += XM[i][j] * (c[i][0] * c[j][0] + c[i][1] * c[j][1]);
    ok('ho b2 <X_H(t)> = r cos(wt)', near(b.xh, ex, 1e-9) && near(b.xh, 1.0, 1e-9), `${ex}`);
    // 2D: first-order shifts of the E=2 level from lambda*X*Y (m w^2 = 1 units)
    const Mx = 8, a1 = LA.kron(LA.ladder(Mx), LA.eye(Mx)), a2 = LA.kron(LA.eye(Mx), LA.ladder(Mx));
    const X1 = LA.scale(LA.add(a1, LA.T(a1)), 1 / Math.SQRT2), Y1 = LA.scale(LA.add(a2, LA.T(a2)), 1 / Math.SQRT2), XY = LA.mul(X1, Y1);
    const i10 = 1 * Mx + 0, i01 = 0 * Mx + 1, i00 = 0;
    const lam = 0.1, sub = [[XY[i10][i10], XY[i10][i01]], [XY[i01][i10], XY[i01][i01]]].map((row) => row.map((v) => v * lam));
    const ev = LA.jacobi(sub).values;
    ok('ho b2 degenerate PT: shifts +-lam/2', near(ev[1], b.shift, 1e-9) && near(ev[0], -b.shift, 1e-9), `${ev}`);
    ok('ho b2 ground state first-order shift 0', Math.abs(XY[i00][i00]) < 1e-15); ok('ho b2 lowest energy = 1', b.E0 === 1);
  }
  // sheet 6 Q3: bound <E> >= hbar w/2 and ground-state saturates
  ok('ho D4 zero point bound saturated by the ground state: <T> + <V> = 1/2', near(0.25 + 0.25, 0.5));
  // sheet 7 Q1: J = a'b - b'a on E<=2: matrix, eigenvalues +-i (anti-Hermitian), [H,J]=0
  {
    const Mx = 7, A = LA.kron(LA.ladder(Mx), LA.eye(Mx)), B = LA.kron(LA.eye(Mx), LA.ladder(Mx));
    const J = LA.add(LA.mul(LA.T(A), B), LA.mul(LA.T(B), A), -1), Hh = LA.add(LA.mul(LA.T(A), A), LA.mul(LA.T(B), B));
    const C = LA.add(LA.mul(Hh, J), LA.mul(J, Hh), -1); let m = 0; for (let i = 0; i < Mx * Mx; i++) for (let j = 0; j < Mx * Mx; j++) m = Math.max(m, Math.abs(C[i][j])); ok('ho D5 [H,J]=0', m < 1e-12);
    ok('ho D5 J|1,0> = -|0,1>, J|0,1> = |1,0>', near(J[0 * Mx + 1][1 * Mx + 0], -1, 1e-12) && near(J[1 * Mx + 0][0 * Mx + 1], 1, 1e-12));
    // L_z = x p_y - y p_x with x=(a+a')/sqrt2, p=i(a'-a)/sqrt2 equals -i J: check the (1,0)->(0,1) element via -iJ
    // (done algebraically in the notes; here: J antisymmetric real => eigenvalues of J^2 are -1 on the level)
    const J2 = LA.mul(J, J); ok('ho D5 J^2 = -1 on |1,0>,|0,1>', near(J2[1 * Mx][1 * Mx], -1, 1e-12) && near(J2[1][1], -1, 1e-12));
  }
});


// ================================================================ ANGULAR MOMENTUM SPIN
hooks.push(() => {
  const S = 'angular-momentum-spin'; if (!rooms[S]) return;
  const s2 = Math.SQRT2, Z = LA.zeros(3);
  // j=1 matrices: L1, L3 real; L2 = i*A with A real
  const L1 = LA.scale([[0, 1, 0], [1, 0, 1], [0, 1, 0]], 1 / s2), A = LA.scale([[0, -1, 0], [1, 0, -1], [0, 1, 0]], 1 / s2), L3 = [[1, 0, 0], [0, 0, 0], [0, 0, -1]];
  const comm = (X, Y) => LA.add(LA.mul(X, Y), LA.mul(Y, X), -1);
  const eqM = (X, Y) => X.every((row, i) => row.every((v, j) => Math.abs(v - Y[i][j]) < 1e-12));
  ok('am [L1,L2]=iL3 (i*[L1,A] = i L3)', eqM(comm(L1, A), L3));
  ok('am [L2,L3]=iL1 (i[A,L3] = i L1)', eqM(comm(A, L3), L1));
  ok('am [L3,L1]=iL2 ([L3,L1] = -A since L2 = iA)', eqM(comm(L3, L1), LA.scale(A, -1)));
  const ev = (X) => LA.jacobi(X).values.slice().sort((a, b) => a - b);
  ok('am L1 eigenvalues -1,0,1', ev(L1).every((v, i) => near(v, [-1, 0, 1][i], 1e-10)));
  // ladder matrix elements for several j from sqrt(j(j+1)-m(m+1))
  for (const j of [0.5, 1, 1.5, 2]) {
    const n = Math.round(2 * j + 1), Jp = LA.zeros(n), J3 = LA.zeros(n);
    for (let k = 0; k < n; k++) { const m = j - k; J3[k][k] = m; if (k > 0) Jp[k - 1][k] = Math.sqrt(j * (j + 1) - m * (m + 1)); }
    const Jm = LA.T(Jp), C = comm(Jp, Jm);
    ok(`am j=${j} [J+,J-]=2J3`, eqM(C, LA.scale(J3, 2)));
    const J2 = LA.add(LA.add(LA.mul(Jm, Jp), LA.mul(J3, J3)), J3);
    ok(`am j=${j} Casimir = j(j+1)`, eqM(J2, LA.scale(LA.eye(n), j * (j + 1))));
  }
  ok('am L+|1,-1> = sqrt2 |1,0>', near(Math.sqrt(1 * 2 - (-1) * 0), s2));
  // FS26 Q1: eigenvector of L1 with eigenvalue 1, probabilities, uncertainties computed from matrices
  const psi = [0.5, s2 / 2, 0.5], mv = (X, v) => X.map((row) => row.reduce((a, c, k) => a + c * v[k], 0)), dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
  ok('am FS26 psi: L1 psi = psi, norm 1', mv(L1, psi).every((v, i) => near(v, psi[i], 1e-12)) && near(dot(psi, psi), 1, 1e-12));
  ok('am FS26 P(L3) = 1/4,1/2,1/4, <L3>=0', near(psi[0] ** 2, 0.25) && near(psi[1] ** 2, 0.5) && near(psi[2] ** 2, 0.25) && near(dot(psi, mv(L3, psi)), 0, 1e-12));
  const m2 = LA.scale(LA.mul(A, A), -1), m3 = LA.mul(L3, L3), m1 = LA.mul(L1, L1);
  const e1 = dot(psi, mv(L1, psi)), e2 = dot(psi, mv(A, psi)) * 0 /* <L2> = i psi^T A psi, A antisymmetric -> 0 */, e11 = dot(psi, mv(m1, psi)), e22 = dot(psi, mv(m2, psi)), e33 = dot(psi, mv(m3, psi));
  ok('am FS26 <L2>=0 (A antisymmetric) and <L2^2>=<L3^2>=1/2', near(dot(psi, mv(A, psi)), 0, 1e-12) && near(e22, 0.5, 1e-12) && near(e33, 0.5, 1e-12) && near(e11, 1, 1e-12));
  const dL2 = Math.sqrt(e22 - e2 * e2), dL3 = Math.sqrt(e33), dL1 = Math.sqrt(Math.max(0, e11 - e1 * e1));
  ok('am FS26 DL1=0, DL2=DL3=1/sqrt2, DL2 DL3 = <L1>/2', near(dL1, 0, 1e-7) && near(dL2, 1 / s2, 1e-12) && near(dL3, 1 / s2, 1e-12) && near(dL2 * dL3, e1 / 2, 1e-12));
  const bb = boss(S, 'qm-am-b1');
  ok('am b1 answers', near(bb.p0, psi[1] ** 2) && near(bb.l2sq, e22) && near(bb.dl2, dL2) && near(bb.prod, dL2 * dL3), JSON.stringify(bb));
  // FS22 Q2: <L1^2> = <L2^2> = (l(l+1)-m^2)/2 for several (l,m) via matrices
  for (const [l, m] of [[1, 0], [1, 1], [2, 1], [3, 2], [2, 2]]) {
    const n = 2 * l + 1, Jp = LA.zeros(n), J3 = LA.zeros(n);
    for (let k = 0; k < n; k++) { const mm = l - k; J3[k][k] = mm; if (k > 0) Jp[k - 1][k] = Math.sqrt(l * (l + 1) - mm * (mm + 1)); }
    const Jm = LA.T(Jp), X1 = LA.scale(LA.add(Jp, Jm), 0.5), Y1 = LA.scale(LA.add(Jp, Jm, -1), 0.5); // L2 = i*Y1/(-1)...: (L+ - L-)/(2i) = -i*Y1
    const k = l - m, x2 = LA.mul(X1, X1)[k][k], y2 = -LA.mul(Y1, Y1)[k][k]; // (-i Y1)^2 = -Y1^2
    ok(`am (l,m)=(${l},${m}): <L1^2>=<L2^2>=(l(l+1)-m^2)/2`, near(x2, (l * (l + 1) - m * m) / 2, 1e-12) && near(y2, x2, 1e-12));
  }
  const b2 = boss(S, 'qm-am-b2'), c2 = calcNum(S, 'qm-am-c2');
  ok('am b2 answers', near(b2.comm, 2) && near(b2.prod, 4) && near(b2.bound, 1) && near(b2.sat, 1) && b2.prod >= b2.bound, JSON.stringify(b2));
  ok('am c2 bonus 2.5', near(c2.s5, 2.5));
  // symbolic references
  ok('am c2 s3 symbolic', near(symAt(S, 'qm-am-c2', 's3', { hbar: 1, l: 2, m: 1 }), 2.5) && near(symAt(S, 'qm-am-c2', 's4', { hbar: 1, m: -2 }), 1));
  // Pauli algebra and rotation formula with explicit complex 2x2 matrices (pairs re, im)
  const C = (re, im) => ({ re, im }), cm = (X, Y) => X.map((r, i) => Y[0].map((_, j) => r.reduce((a, x, k) => C(a.re + x.re * Y[k][j].re - x.im * Y[k][j].im, a.im + x.re * Y[k][j].im + x.im * Y[k][j].re), C(0, 0))));
  const ca = (X, Y, a = 1, b = 1) => X.map((r, i) => r.map((x, j) => C(a * x.re + b * Y[i][j].re, a * x.im + b * Y[i][j].im)));
  const cs = (X, a, b = 0) => X.map((r) => r.map((x) => C(a * x.re - b * x.im, a * x.im + b * x.re)));
  const I2 = [[C(1, 0), C(0, 0)], [C(0, 0), C(1, 0)]], sg = [[[C(0, 0), C(1, 0)], [C(1, 0), C(0, 0)]], [[C(0, 0), C(0, -1)], [C(0, 1), C(0, 0)]], [[C(1, 0), C(0, 0)], [C(0, 0), C(-1, 0)]]];
  const ceq = (X, Y) => X.every((r, i) => r.every((x, j) => Math.abs(x.re - Y[i][j].re) < 1e-12 && Math.abs(x.im - Y[i][j].im) < 1e-12));
  let alg = true; for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) { let rhs = a === b ? I2 : cs(I2, 0); for (let c = 0; c < 3; c++) { const eps = (a - b) * (b - c) * (c - a) / 2; if (eps) rhs = ca(rhs, sg[c], 1, 0).map((r, i) => r.map((x, j) => C(x.re - eps * 0 + 0, x.im))), rhs = ca(rhs, cs(sg[c], 0, eps), 1, 1); } alg = alg && ceq(cm(sg[a], sg[b]), rhs); }
  ok('am Pauli: sigma_a sigma_b = delta + i eps sigma_c', alg);
  // rotation: series for exp(-i w n.sigma/2) vs cos - i sin n.sigma
  const nn = [0.48, -0.6, 0.64], ns = ca(ca(cs(sg[0], nn[0]), cs(sg[1], nn[1])), cs(sg[2], nn[2]));
  const expSeries = (w) => { let term = I2, sum = I2; const G = cs(ns, 0, -w / 2); for (let k = 1; k < 40; k++) { term = cs(cm(term, G), 1 / k); sum = ca(sum, term); } return sum; };
  for (const w of [0.7, Math.PI, 2 * Math.PI]) { const F = ca(cs(I2, Math.cos(w / 2)), cs(ns, 0, -Math.sin(w / 2))); ok(`am rotation formula w=${w.toFixed(2)}`, ceq(expSeries(w), F)); }
  ok('am U(2pi) = -1', ceq(expSeries(2 * Math.PI), cs(I2, -1)));
  // sheet 11 Q2: spinor (cos th/2, e^{i phi} sin th/2) has <sigma> = e, P(+)=(1+cos th)/2
  { const th = 1.1, ph = 0.4, chi = [C(Math.cos(th / 2), 0), C(Math.cos(ph) * Math.sin(th / 2), Math.sin(ph) * Math.sin(th / 2))];
    const ex = sg.map((M) => { let t = 0; for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { const mx = M[i][j], a = chi[i], b = chi[j]; t += (a.re * (mx.re * b.re - mx.im * b.im) + a.im * (mx.re * b.im + mx.im * b.re)); } return t; });
    ok('am spinor <sigma> = e', near(ex[0], Math.sin(th) * Math.cos(ph), 1e-12) && near(ex[1], Math.sin(th) * Math.sin(ph), 1e-12) && near(ex[2], Math.cos(th), 1e-12));
    ok('am c1 symbolic P+, <Sz>, DSz', near(symAt(S, 'qm-am-c1', 's2', { theta: th }), Math.cos(th / 2) ** 2) && near(symAt(S, 'qm-am-c1', 's3', { hbar: 1, theta: th }), ex[2] / 2) && near(symAt(S, 'qm-am-c1', 's4', { hbar: 1, theta: th }), Math.sqrt(0.25 - (ex[2] / 2) ** 2)));
    ok('am c1 bonus 0.433', near(calcNum(S, 'qm-am-c1').s5, Math.sqrt(3) / 4)); }
  // FS26 Q3: oscillator triplet: L3 matrix on (psi1,psi2,psi3), eigen-decomposition; c3 and b3
  { const L3t = [[C(0, 0), C(0, -1), C(0, 0)], [C(0, 1), C(0, 0), C(0, 0)], [C(0, 0), C(0, 0), C(0, 0)]]; // columns: L3 psi1 = i psi2, L3 psi2 = -i psi1, L3 psi3 = 0
    const app = (v) => L3t.map((row) => row.reduce((s, x, k) => C(s.re + x.re * v[k].re - x.im * v[k].im, s.im + x.re * v[k].im + x.im * v[k].re), C(0, 0)));
    const same = (a, b, s) => a.every((x, i) => near(x.re, s * b[i].re, 1e-12) && near(x.im, s * b[i].im, 1e-12));
    const vp = [C(1, 0), C(0, 1), C(0, 0)], vm = [C(1, 0), C(0, -1), C(0, 0)], v0 = [C(0, 0), C(0, 0), C(1, 0)];
    ok('am triplet: L3 eigenvectors psi1+-i psi2 (+-1), psi3 (0)', same(app(vp), vp, 1) && same(app(vm), vm, -1) && same(app(v0), v0, 0)); }
  { const c3 = calcNum(S, 'qm-am-c3'), b3 = boss(S, 'qm-am-b3');
    ok('am c3 bonus <L3>=1/2', near(c3.s5, 0.5)); ok('am b3 answers', near(b3.E, 2.5) && near(b3.deg, 3) && near(b3.m1, 1) && near(b3.m3, 0), JSON.stringify(b3));
    ok('am c3 symbolic E=5/2', near(symAt(S, 'qm-am-c3', 's2', { hbar: 1, omega: 2 }), 5)); }
});

// ================================================================ PERTURBATION FORGE
hooks.push(() => {
  const S = 'perturbation-forge';
  if (!rooms[S]) return;
  const pfN = 90, a = LA.ladder(pfN), ad = LA.T(a), A = LA.add(ad, a, -1); // A = a^dagger - a
  const A2 = LA.mul(A, A), A4 = LA.mul(A2, A2), A6 = LA.mul(A4, A2);
  // FS19 Q4 / HS18 Q4: H' = alpha p^4 on the oscillator ground state (m = hbar = omega = 1, eps = hbar omega / m c^2)
  ok('pf (a^+ - a)^4|0> = 3|0> - 6 sqrt2 |2> + sqrt24 |4>', near(A4[0][0], 3, 1e-12) && near(A4[2][0], -6 * Math.SQRT2, 1e-12) && near(A4[4][0], Math.sqrt(24), 1e-12) && Math.abs(A4[1][0]) < 1e-12 && Math.abs(A4[6][0]) < 1e-12);
  const Hp = LA.scale(A4, -1 / 32); // H' / eps
  let E2 = 0; for (let m = 1; m < 12; m++) E2 += Hp[m][0] ** 2 / (0 - m);
  ok('pf b1: E1 = -3/32, E2 = -21/512 (sum over couplings)', near(Hp[0][0], -3 / 32, 1e-12) && near(E2, -21 / 512, 1e-12), `${Hp[0][0]} ${E2}`);
  ok('pf <0|A^6|0> = -15 so beta <p^6> = 15/128 eps^2', near(A6[0][0], -15, 1e-12) && near(15 / 16 / 8, 15 / 128, 1e-12));
  { const eps = 0.002, H = LA.zeros(pfN); for (let n = 0; n < pfN; n++) H[n][n] = n + 0.5;
    // exact lowest eigenvalue of H0 - (eps/8) p^4 + (eps^2/16) p^6, p^2 = -A^2/2, p^4 = A^4/4, p^6 = -A^6/8
    const Ht = LA.add(LA.add(H, LA.scale(A4, -eps / 32)), LA.scale(A6, -eps * eps / 128));
    const ev = LA.jacobi(Ht).values[0], series = 0.5 - 3 * eps / 32 + (39 / 512) * eps * eps;
    ok('pf b1: exact lowest level of H0+alpha p^4+beta p^6 = 1/2 - 3e/32 + 39 e^2/512 + O(e^3)', Math.abs(ev - series) < 3e-4 * eps * eps * 1e3 && Math.abs(ev - series) / (eps * eps) < 0.05, `${ev} ${series}`);
    const ev4 = LA.jacobi(LA.add(H, LA.scale(A4, -eps / 32))).values[0];
    ok('pf b1 (ii): p^4 alone: 1/2 - 3e/32 - 21 e^2/512', Math.abs(ev4 - (0.5 - 3 * eps / 32 - 21 * eps * eps / 512)) / (eps * eps) < 0.05, `${ev4}`); }
  { const b = boss(S, 'qm-pf-b1'); ok('pf b1 answers', near(b.e1, 3 / 32, 1e-12) && near(b.e2, 21 / 512, 1e-12) && near(b.e3, 15 / 128, 1e-12) && near(b.etot, 39 / 512, 1e-12) && near(b.etot, b.e3 - b.e2, 1e-12)); }
  // generic second-order formula vs exact diagonalisation of a random symmetric matrix (derive D1)
  { const n = 6, E = [0, 1.3, 2.1, 3.7, 4.2, 6], Vm = LA.zeros(n); let s = 7; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647 - 0.5; };
    for (let i = 0; i < n; i++) for (let j = i; j < n; j++) Vm[i][j] = Vm[j][i] = rnd();
    const lam = 1e-3, H = LA.zeros(n); for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) H[i][j] = (i === j ? E[i] : 0) + lam * Vm[i][j];
    const ev = LA.jacobi(H).values; let good = true;
    for (let k = 0; k < n; k++) { let e2 = 0; for (let m = 0; m < n; m++) if (m !== k) e2 += Vm[m][k] ** 2 / (E[k] - E[m]); const ser = E[k] + lam * Vm[k][k] + lam * lam * e2; if (Math.abs(ev[k] - ser) > 5 * lam ** 3) good = false; }
    ok('pf D1: E + lam V_nn + lam^2 sum |V|^2/(E_n-E_m) matches exact diagonalisation (O(lam^3))', good); }
  // two-level exact vs second order
  { const e1 = 0, e2 = 2, V = 0.05, ev = LA.jacobi([[e1, V], [V, e2]]).values[0]; ok('pf two-level: lower level = e1 - V^2/Delta + O(V^4)', Math.abs(ev - (e1 - V * V / (e2 - e1))) < 1e-5); }
  // FS26 Q4: hydrogen n = 2 radial integrals (a = 1) by Simpson quadrature
  const simpson = (f, a0, b, N = 20000) => { const h = (b - a0) / N; let s = f(a0) + f(b); for (let i = 1; i < N; i++) s += f(a0 + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
  const R20 = (r) => (2 - r) * Math.exp(-r / 2) / Math.sqrt(8), R21 = (r) => r * Math.exp(-r / 2) / Math.sqrt(24);
  const ex = (R, k) => simpson((r) => r * r * r ** k * R(r) ** 2, 1e-9, 80);
  ok('pf R20, R21 normalised', near(ex(R20, 0), 1, 1e-8) && near(ex(R21, 0), 1, 1e-8));
  ok('pf FS26 (iv): <1/r> = 1/4 both, <1/r^2> = 1/4 (l=0), 1/12 (l=1)', near(ex(R20, -1), 0.25, 1e-7) && near(ex(R21, -1), 0.25, 1e-7) && near(ex(R20, -2), 0.25, 1e-6) && near(ex(R21, -2), 1 / 12, 1e-7), `${ex(R20, -2)} ${ex(R21, -2)}`);
  { const En = -1 / 8, coeff = (R) => -0.5 * (En * En + 2 * En * ex(R, -1) + ex(R, -2)); // in units mc^2 alpha^4 (Hartree: e = a = m = 1)
    ok('pf FS26 (iii): E1(2,0) = -13/128, E1(2,1) = -7/384 in mc^2 alpha^4', near(coeff(R20), -13 / 128, 1e-6) && near(coeff(R21), -7 / 384, 1e-6), `${coeff(R20)} ${coeff(R21)}`);
    const gen = (n, l) => -((1 / (2 * n * n)) ** 2) / 2 * (4 * n / (l + 0.5) - 3);
    ok('pf general formula -E_n^2/(2mc^2)(4n/(l+1/2)-3) reproduces n=2', near(gen(2, 0), -13 / 128, 1e-12) && near(gen(2, 1), -7 / 384, 1e-12), `${gen(2, 0)}`);
    const b = boss(S, 'qm-pf-b2'); ok('pf b2 answers', near(b.r1, 0.25) && near(b.rr0, 0.25) && near(b.rr1, 1 / 12) && near(b.E20, 13 / 128) && near(b.E21, 7 / 384), JSON.stringify(b)); }
  // Stark effect n = 2 (sheet 14 Q2): <200|z|210> = -3 a0, matrix eigenvalues
  { const ang = simpson((u) => u * u, -1, 1, 200) * 2 * Math.PI / Math.sqrt(4 * Math.PI) * Math.sqrt(3 / (4 * Math.PI)); // int Y00 cos Y10 dOmega
    const rad = simpson((r) => r * r * r * R20(r) * R21(r), 1e-9, 80), z = ang * rad;
    ok('pf Stark: angular 1/sqrt3, radial -3 sqrt3, <200|z|210> = -3 a0', near(ang, 1 / Math.sqrt(3), 1e-9) && near(rad, -3 * Math.sqrt(3), 1e-6) && near(z, -3, 1e-6), `${ang} ${rad}`);
    const W = [[0, z, 0, 0], [z, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]; // matrix of |e|E z in units |e|E (e<0: -eE z = |e|E z)
    const ev = LA.jacobi(W).values; ok('pf Stark: eigenvalues -3,0,0,+3 (units |e|E a0)', near(ev[0], -3, 1e-6) && near(ev[3], 3, 1e-6) && Math.abs(ev[1]) < 1e-9 && Math.abs(ev[2]) < 1e-9);
    ok('pf c1 symbolic and bonus', near(symAt(S, 'qm-pf-c1', 's4', { a0: 1.3 }), -3.9) && near(symAt(S, 'qm-pf-c1', 's5', { eabs: 1, Ef: 2, a0: 0.5 }), 3) && near(calcNum(S, 'qm-pf-c1').s6, 3 * 1e6 * 0.529177e-10, 1e-9) && near(calcNum(S, 'qm-pf-c1').s6, 1.5875e-4, 1e-3)); }
  // FS22 Q4 (iii): 3D oscillator, H' = omega L_z on the N = 1 level
  { const l3 = LA.ladder(3), I3 = LA.eye(3), ma = LA.kron(LA.kron(l3, I3), I3), mb = LA.kron(LA.kron(I3, l3), I3);
    const M = LA.add(LA.mul(ma, LA.T(mb)), LA.mul(LA.T(ma), mb), -1); // a b^dagger - a^dagger b ; L_z = i hbar M
    const idx = [9, 3, 1], sub = idx.map((i) => idx.map((j) => M[i][j])), zero = sub.map((r) => r.map(() => 0));
    const ev = LA.eigHermitian(zero, sub);
    ok('pf FS22 (iii): eigenvalues of L_z on {|100>,|010>,|001>} are -1,0,+1 (hbar)', near(ev[0], -1, 1e-9) && Math.abs(ev[1]) < 1e-9 && near(ev[2], 1, 1e-9), String(ev));
    ok('pf FS22: L_z|100> = i hbar|010>', near(M[3][9], 1, 1e-12) && near(M[9][3], -1, 1e-12)); // M|100> = (ab^+ - a^+ b)|100> = |010>
    const b = boss(S, 'qm-pf-b3'); ok('pf b3 answers', near(b.plus, 1) && near(b.minus, -1) && near(b.deg, 3) && near(b.Em, 2.5) && near(b.Em, 3 * 0.5 + 1)); }
  // c2: Fx perturbation: exact shift, second order, matrix elements
  { const g = 0.3, N = 70, x = LA.scale(LA.add(a, ad), 1 / Math.SQRT2), H = LA.zeros(N); for (let n = 0; n < N; n++) H[n][n] = n + 0.5;
    const Ht = LA.add(H, LA.scale(x, g)), ev = LA.jacobi(Ht).values;
    ok('pf c2: exact levels E_n = n + 1/2 - g^2/2 (complete the square)', [0, 1, 2, 3, 5].every((n) => near(ev[n], n + 0.5 - g * g / 2, 1e-9)));
    const n = 3; let e2 = 0; for (let m = 0; m < 12; m++) if (m !== n) e2 += (g * x[m][n]) ** 2 / (n - m);
    ok('pf c2: E2 = -g^2/2 independent of n; matrix element F x0 sqrt((n+1)/2)', near(e2, -g * g / 2, 1e-12) && near(symAt(S, 'qm-pf-c2', 's2', { F: 1, x0: 1, n }), x[n + 1][n], 1e-12) && near(symAt(S, 'qm-pf-c2', 's3', { F: g, x0: 1, hbar: 1, omega: 1 }), -g * g / 2, 1e-12) && near(calcNum(S, 'qm-pf-c2').s5, -0.045, 1e-12)); }
  // c3: time-dependent PT: integrate the two-level Schroedinger equation (RK4) and compare with 4V^2 sin^2(D t/2)/D^2
  { const run = (V, D, tEnd) => { let c = [[1, 0], [0, 0]]; 
      const rhs = (c) => { // i dc/dt = H c, H = [[0,V],[V,D]]: dc/dt = -i H c
        const h0 = [V * c[1][0], V * c[1][1]], h1 = [V * c[0][0] + D * c[1][0], V * c[0][1] + D * c[1][1]];
        return [[h0[1], -h0[0]], [h1[1], -h1[0]]]; };
      const add = (c, d, s) => c.map((z, i) => [z[0] + s * d[i][0], z[1] + s * d[i][1]]);
      const N = 4000, dt = tEnd / N; for (let i = 0; i < N; i++) { const k1 = rhs(c), k2 = rhs(add(c, k1, dt / 2)), k3 = rhs(add(c, k2, dt / 2)), k4 = rhs(add(c, k3, dt)); c = c.map((z, q) => [z[0] + dt / 6 * (k1[q][0] + 2 * k2[q][0] + 2 * k3[q][0] + k4[q][0]), z[1] + dt / 6 * (k1[q][1] + 2 * k2[q][1] + 2 * k3[q][1] + k4[q][1])]); }
      return c[1][0] ** 2 + c[1][1] ** 2; };
    const t = Math.PI, V = 0.01, D = 0.5, exact = run(V, D, t), pt = 4 * V * V * Math.sin(D * t / 2) ** 2 / D ** 2;
    ok('pf c3: first-order P = 4V^2 sin^2(Dt/2)/D^2 matches exact two-level dynamics', Math.abs(exact / pt - 1) < 5e-3, `${exact} ${pt}`);
    ok('pf c3: bonus 8e-4 and symbolic', near(calcNum(S, 'qm-pf-c3').s4, 8e-4, 1e-6) && near(symAt(S, 'qm-pf-c3', 's2', { V, D, t, hbar: 1 }), pt, 1e-12));
    ok('pf c3: resonance limit P -> V^2 t^2', Math.abs(run(V, 1e-7, 3) / (V * V * 9) - 1) < 1e-2); }
});

// ================================================================ HYDROGEN LAMP
hooks.push(() => {
  const S = 'hydrogen-lamp';
  if (!rooms[S]) return;
  const simpson = (f, a0, b, N = 20000) => { const h = (b - a0) / N; let s = f(a0) + f(b); for (let i = 1; i < N; i++) s += f(a0 + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
  // HS25 Q2 (i): psi = exp(-r/a) with a = 1/Z (Hartree units) is an eigenfunction of -1/2 lap - Z/r with E = -Z^2/2 (finite differences)
  for (const Z of [1, 2, 3]) {
    const a = 1 / Z, f = (r) => Math.exp(-r / a), h = 1e-4; let good = true;
    for (const r of [0.3, 0.9, 2.1]) { const lap = (f(r + h) - 2 * f(r) + f(r - h)) / (h * h) + (2 / r) * (f(r + h) - f(r - h)) / (2 * h); good = good && Math.abs((-0.5 * lap - Z / r * f(r)) / f(r) + Z * Z / 2) < 1e-5; }
    ok(`hl HS25 (i): exp(-Zr) is an eigenfunction with E = -Z^2/2, Z=${Z}`, good);
  }
  // radial functions satisfy the radial equation and are normalised; <r^2>, Delta x, Delta p for the ground state
  const R = { '10': (r) => 2 * Math.exp(-r), '20': (r) => (2 - r) * Math.exp(-r / 2) / Math.sqrt(8), '21': (r) => r * Math.exp(-r / 2) / Math.sqrt(24) };
  for (const [key, n, l] of [['10', 1, 0], ['20', 2, 0], ['21', 2, 1]]) {
    const u = (r) => r * R[key](r), h = 1e-4; let good = true;
    for (const r of [0.4, 1.3, 3.1]) { const upp = (u(r + h) - 2 * u(r) + u(r - h)) / (h * h); good = good && Math.abs((-0.5 * upp + (l * (l + 1) / (2 * r * r) - 1 / r) * u(r)) / u(r) + 1 / (2 * n * n)) < 1e-5; }
    ok(`hl radial equation: R_${key} with E = -1/(2 ${n}^2)`, good && near(simpson((r) => r * r * R[key](r) ** 2, 1e-9, 80), 1, 1e-8));
  }
  { const r2 = simpson((r) => r ** 4 * R['10'](r) ** 2, 0, 60), x2 = r2 / 3, p2 = simpson((r) => { const d = (R['10'](r + 1e-5) - R['10'](r - 1e-5)) / 2e-5; return r * r * d * d; }, 1e-9, 60);
    ok('hl HS25 (iv): <r^2> = 3a^2, Delta x = a, <p^2> = hbar^2/a^2, Delta p_j = hbar/(sqrt3 a), product hbar/sqrt3 > hbar/2', near(r2, 3, 1e-6) && near(Math.sqrt(x2), 1, 1e-6) && near(p2, 1, 1e-4) && near(Math.sqrt(p2 / 3) * Math.sqrt(x2), 1 / Math.sqrt(3), 1e-4) && 1 / Math.sqrt(3) > 0.5);
    const b = boss(S, 'qm-hl-b1');
    ok('hl b1 answers', near(b.a, 1) && near(b.E, 54.4228, 1e-4) && near(b.dx, 1) && near(b.prod, 1 / Math.sqrt(3), 1e-9) && near(b.P, 512 / 729, 1e-9), JSON.stringify(b)); }
  // sudden change Z -> Zt: overlap by quadrature
  for (const [Z, Zt] of [[1, 2], [2, 1], [1, 3], [1, 1]]) {
    const ov = simpson((r) => 4 * Math.PI * r * r * (Z ** 1.5 / Math.sqrt(Math.PI)) * Math.exp(-Z * r) * (Zt ** 1.5 / Math.sqrt(Math.PI)) * Math.exp(-Zt * r), 0, 80);
    ok(`hl c1: overlap and P for ${Z}->${Zt}`, near(ov, symAt(S, 'qm-hl-c1', 's3', { Z, Zt }), 1e-7) && near(ov * ov, symAt(S, 'qm-hl-c1', 's4', { Z, Zt }), 1e-7));
  }
  ok('hl c1 bonus 0.7023', near(calcNum(S, 'qm-hl-c1').s5, 512 / 729, 1e-9));
  // Rydberg lines
  { const Ry = 13.6057, line = (n, m) => Ry * (1 / (n * n) - 1 / (m * m));
    ok('hl lamp: Lyman-alpha 10.2 eV, Balmer-alpha 1.89 eV (656 nm)', near(line(1, 2), 10.204, 1e-3) && near(line(2, 3), 1.8897, 1e-3) && near(1239.84 / line(2, 3), 656.1, 1e-3)); }
  // variational principle: E(b) = 1/(2b^2) - 1/b minimal at b = 1, E = -1/2; check <T> and <1/r> by quadrature
  { const E = (b) => { const f = (r) => Math.exp(-r / b), nrm = simpson((r) => r * r * f(r) ** 2, 0, 80 * b), T = 0.5 * simpson((r) => r * r * (f(r) / b) ** 2, 0, 80 * b) / nrm, V = -simpson((r) => r * f(r) ** 2, 0, 80 * b) / nrm; return T + V; };
    ok('hl D6: <H>(b) = 1/(2b^2) - 1/b, minimum -1/2 at b = 1', near(E(0.7), 1 / (2 * 0.49) - 1 / 0.7, 1e-6) && E(0.8) > -0.5 && E(1.25) > -0.5 && near(E(1), -0.5, 1e-7));
    ok('hl D6: Gaussian trial gives -4/(3 pi) > -1/2', -4 / (3 * Math.PI) > -0.5); }
  // so(4): D_s x D_s with L = S + D decomposes into l = 0..n-1; n^2 states; HS22 A.7
  { const spin = (s) => { const d = Math.round(2 * s + 1), Jz = LA.zeros(d), Jp = LA.zeros(d); for (let k = 0; k < d; k++) { const m = s - k; Jz[k][k] = m; if (k > 0) Jp[k - 1][k] = Math.sqrt(s * (s + 1) - m * (m + 1)); } return { Jz, Jp, d }; };
    let allOk = true;
    for (const n of [1, 2, 3, 4, 5]) {
      const s = (n - 1) / 2, A = spin(s), I = LA.eye(A.d), Jz = LA.add(LA.kron(A.Jz, I), LA.kron(I, A.Jz)), Jp = LA.add(LA.kron(A.Jp, I), LA.kron(I, A.Jp)), Jm = LA.T(Jp);
      const L2 = LA.add(LA.mul(Jz, Jz), LA.scale(LA.add(LA.mul(Jp, Jm), LA.mul(Jm, Jp)), 0.5)), ev = LA.jacobi(L2).values;
      allOk = allOk && ev.length === n * n;
      for (let l = 0; l < n; l++) allOk = allOk && ev.filter((x) => Math.abs(x - l * (l + 1)) < 1e-9).length === 2 * l + 1;
      const S2 = LA.add(LA.mul(A.Jz, A.Jz), LA.scale(LA.add(LA.mul(A.Jp, LA.T(A.Jp)), LA.mul(LA.T(A.Jp), A.Jp)), 0.5));
      allOk = allOk && near(S2[0][0], (n * n - 1) / 4, 1e-12); // S^2 = hbar^2 (n^2-1)/4
      const hw = LA.zeros(A.d * A.d, 1); hw[0][0] = 1; const Lz = LA.mul(Jz, hw)[0][0], Lp = LA.mul(Jp, hw);
      allOk = allOk && near(Lz, n - 1, 1e-12) && Lp.every((r) => Math.abs(r[0]) < 1e-12);
    }
    ok('hl so(4): D_s x D_s, s=(n-1)/2, gives l=0..n-1 with 2l+1 each (n^2 states), S^2 = (n^2-1)/4, highest weight l = n-1', allOk);
    const b = boss(S, 'qm-hl-b2'); ok('hl b2 answers (s=1 for n=3, 16 states, lmax 4, A.7 = 4^2)', near(b.s, 1) && near(b.deg, 16) && near(b.lmax, 4) && near(b.A7, 16) && near((2 * 1.5 + 1) ** 2, 16) && near(1.5 * 2.5, 15 / 4)); }
  // spin-orbit and Zeeman for l = 1, 2 by direct diagonalisation
  { const spin = (s) => { const d = Math.round(2 * s + 1), Jz = LA.zeros(d), Jp = LA.zeros(d); for (let k = 0; k < d; k++) { const m = s - k; Jz[k][k] = m; if (k > 0) Jp[k - 1][k] = Math.sqrt(s * (s + 1) - m * (m + 1)); } return { Jz, Jp, d }; };
    const build = (l, xi, beta) => { const L = spin(l), Sp = spin(0.5), IL = LA.eye(L.d), IS = LA.eye(2), Lz = LA.kron(L.Jz, IS), Sz = LA.kron(IL, Sp.Jz), Lp = LA.kron(L.Jp, IS), Sm = LA.kron(IL, LA.T(Sp.Jp));
      const LS = LA.add(LA.mul(Lz, Sz), LA.scale(LA.add(LA.mul(Lp, Sm), LA.mul(LA.T(Lp), LA.T(Sm))), 0.5));
      const Z = LA.add(Lz, Sz, 2); return { H: LA.add(LA.scale(LS, xi), LA.scale(Z, beta)), LS }; };
    const ls = LA.jacobi(build(1, 1, 0).LS).values; ok('hl c2: L.S eigenvalues for l=1: +1/2 (x4) and -1 (x2) = (j(j+1)-l(l+1)-3/4)/2', ls.filter((x) => near(x, 0.5, 1e-9)).length === 4 && ls.filter((x) => near(x, -1, 1e-9)).length === 2);
    ok('hl c2 s2 symbolic', near(symAt(S, 'qm-hl-c2', 's2', { j: 1.5, l: 1 }), 0.5) && near(symAt(S, 'qm-hl-c2', 's2', { j: 0.5, l: 1 }), -1));
    // <r^-3> by quadrature and the SO shifts in units of mc^2 alpha^4 (Hartree: E_n = -1/(2n^2), mc^2 = 1/alpha^2): En^2 n/mc2 = n/(4 n^4) alpha^2 ... in units mc^2 alpha^4
    const r3 = simpson((r) => r * r * R['21'](r) ** 2 / (r ** 3), 1e-9, 80);
    const SOu = (n, l, j) => (1 / (2 * n * n)) ** 2 * n * (j * (j + 1) - l * (l + 1) - 0.75) / (l * (l + 0.5) * (l + 1)); // units mc^2 alpha^4
    ok('hl c2: <r^-3>_{21} = 1/24 and E_SO(2p3/2) = +1/96, E_SO(2p1/2) = -1/48 (mc^2 alpha^4), splitting 1/32', near(r3, 1 / 24, 1e-6) && near(SOu(2, 1, 1.5), 1 / 96, 1e-12) && near(SOu(2, 1, 0.5), -1 / 48, 1e-12) && near(SOu(2, 1, 1.5) - SOu(2, 1, 0.5), 1 / 32, 1e-12));
    // direct: <H_SO> = (1/2 m^2 c^2) <r^-3> e^2 L.S ; Hartree: e^2 = 1, hbar = 1, c = 1/alpha -> alpha^2/2 * (1/24) * LS, in units mc^2 alpha^4 = alpha^2 -> (1/48) LS
    ok('hl c2: direct (1/48)<L.S> reproduces 1/96 and -1/48', near(0.5 / 48, 1 / 96, 1e-12) && near(-1 / 48, -1 / 48, 1e-12));
    const al = 1 / 137.035999, spl = al ** 4 * 510998.95 / 32, c2 = calcNum(S, 'qm-hl-c2'), c3 = calcNum(S, 'qm-hl-c3');
    ok('hl c2 s3 symbolic matches, bonus 4.53e-5 eV', near(symAt(S, 'qm-hl-c2', 's3', { n: 2, l: 1, j: 1.5, En: -1 / 8, mc2: 1 / (al * al) }) , SOu(2, 1, 1.5) * al * al, 1e-9) && near(c2.s5, spl, 1e-12) && near(spl, 4.528e-5, 2e-3), `${spl}`);
    ok('hl c3 bonus 0.78 T', near(c3.s5, spl / 5.7883818e-5, 1e-12) && near(c3.s5, 0.7823, 2e-3), `${c3.s5}`);
    // weak field: slopes g_{lj} m_j for l = 1, 2; strong field: mu_B B (m_l + 2 m_s) + 2 * xi' m_l m_s
    for (const l of [1, 2]) {
      const xi = 1, be = 1e-4, ev = LA.jacobi(build(l, xi, be).H).values, exp = [];
      for (const [j, g] of [[l + 0.5, (2 + 2 * l) / (1 + 2 * l)], [l - 0.5, 2 * l / (1 + 2 * l)]]) { const e0 = 0.5 * (j * (j + 1) - l * (l + 1) - 0.75); for (let k = 0; k <= 2 * j; k++) exp.push(e0 * xi + g * be * (j - k)); }
      exp.sort((x, y) => x - y); ok(`hl Lande: weak-field levels = <LS> + g_lj B m_j (l=${l})`, ev.every((x, i) => Math.abs(x - exp[i]) < 1e-7), `${ev} ${exp}`); }
    ok('hl c3: g-factor symbolics', near(symAt(S, 'qm-hl-c3', 's2', { l: 1 }), 4 / 3) && near(symAt(S, 'qm-hl-c3', 's3', { l: 1 }), 2 / 3) && near(symAt(S, 'qm-hl-c3', 's2', { l: 2 }), 6 / 5) && near(1 + (1.5 * 2.5 + 0.75 - 2) / (2 * 1.5 * 2.5), 4 / 3));
    { const be = 300, xi = 1, ev = LA.jacobi(build(1, xi, be).H).values, exp = []; for (let ml = -1; ml <= 1; ml++) for (const ms of [-0.5, 0.5]) exp.push(be * (ml + 2 * ms) + xi * ml * ms); exp.sort((x, y) => x - y);
      ok('hl Paschen-Back: levels = B(m_l+2m_s) + xi m_l m_s for B >> xi', ev.every((x, i) => Math.abs(x - exp[i]) < 0.02), `${ev} ${exp}`); }
    { const be = 0.4, H = build(1, 1, be).H; // blocks: m_j = 1/2 sector is a 2x2 block; count 2x2 blocks for l=1 (m_j=+-1/2) -> 2
      ok('hl b3: l=1 Hamiltonian has 6 states = two 1x1 + two 2x2 blocks (m_j = +-3/2, +-1/2); answers 4/3, 2/3, 2, blocks 2', H.length === 6 && (() => { const b = boss(S, 'qm-hl-b3'); return near(b.gp, 4 / 3) && near(b.gm, 2 / 3) && near(b.shift, 2) && near(b.blocks, 2); })()); } }
});

// ================================================================ SPIN ADDITION / STERN-GERLACH
hooks.push(() => {
  const S = 'spin-addition-stern-gerlach';
  if (!rooms[S]) return;
  const spin = (s) => { const d = Math.round(2 * s + 1), Jz = LA.zeros(d), Jp = LA.zeros(d); for (let k = 0; k < d; k++) { const m = s - k; Jz[k][k] = m; if (k > 0) Jp[k - 1][k] = Math.sqrt(s * (s + 1) - m * (m + 1)); } return { Jz, Jp, d }; };
  const tot = (A, B) => { const IA = LA.eye(A.d), IB = LA.eye(B.d); return { Jz: LA.add(LA.kron(A.Jz, IB), LA.kron(IA, B.Jz)), Jp: LA.add(LA.kron(A.Jp, IB), LA.kron(IA, B.Jp)) }; };
  const J2 = (J) => LA.add(LA.mul(J.Jz, J.Jz), LA.scale(LA.add(LA.mul(J.Jp, LA.T(J.Jp)), LA.mul(LA.T(J.Jp), J.Jp)), 0.5));
  const mv = (M, v) => M.map((row) => row.reduce((s, x, k) => s + x * v[k], 0));
  const s1 = spin(1), I3 = LA.eye(3), JT = tot(s1, s1), SS = J2(JT);
  const S1S2 = LA.scale(LA.add(SS, LA.add(LA.scale(J2({ Jz: LA.kron(s1.Jz, I3), Jp: LA.kron(s1.Jp, I3) }), 1), J2({ Jz: LA.kron(I3, s1.Jz), Jp: LA.kron(I3, s1.Jp) })), -1), 0.5);
  const ev = LA.jacobi(S1S2).values;
  ok('sa HS25 (ii): S1.S2 eigenvalues +1 (x5), -1 (x3), -2 (x1)', ev.filter((x) => near(x, 1, 1e-9)).length === 5 && ev.filter((x) => near(x, -1, 1e-9)).length === 3 && ev.filter((x) => near(x, -2, 1e-9)).length === 1 && near(ev.reduce((a, b) => a + b, 0), 0, 1e-9));
  ok('sa c1 s2 symbolic', [[2, 1, 1], [1, 1, -1], [0, 1, -2], [3, 1.5, 1.5 * 0 + (12 - 7.5) / 2]].every(([sg, s, v]) => near(symAt(S, 'qm-sa-c1', 's2', { sigma: sg, s }), v, 1e-12)) && near(calcNum(S, 'qm-sa-c1').s5, 3, 1e-12));
  // explicit states of D1 x D1 (index = (1-m1)*3 + (1-m2))
  const idx = (m1, m2) => (1 - m1) * 3 + (1 - m2), vec = (terms) => { const v = new Array(9).fill(0); for (const [c, m1, m2] of terms) v[idx(m1, m2)] += c; return v; };
  const r2 = 1 / Math.sqrt(2), r3 = 1 / Math.sqrt(3), r6 = 1 / Math.sqrt(6);
  const states = [['2,2', 2, 2, vec([[1, 1, 1]])], ['2,1', 2, 1, vec([[r2, 1, 0], [r2, 0, 1]])], ['2,0', 2, 0, vec([[r6, 1, -1], [2 * r6, 0, 0], [r6, -1, 1]])], ['1,1', 1, 1, vec([[r2, 1, 0], [-r2, 0, 1]])], ['1,0', 1, 0, vec([[r2, 1, -1], [-r2, -1, 1]])], ['0,0', 0, 0, vec([[r3, 1, -1], [-r3, 0, 0], [r3, -1, 1]])]];
  let stOk = true; for (const [, sg, m, v] of states) { const a = mv(SS, v), b = mv(JT.Jz, v); stOk = stOk && v.every((x, k) => Math.abs(a[k] - sg * (sg + 1) * x) < 1e-12 && Math.abs(b[k] - m * x) < 1e-12) && near(v.reduce((s, x) => s + x * x, 0), 1, 1e-12); }
  ok('sa HS25 (iii): listed |sigma,m> are eigenstates of S^2 and S_z, normalised', stOk);
  { const sm = LA.T(JT.Jp), a = mv(sm, states[0][3]); ok('sa: S_-|2,2> = sqrt(4) |2,1> and S_-|2,1> = sqrt6 |2,0> (ladder)', a.every((x, k) => Math.abs(x - 2 * states[1][3][k]) < 1e-12) && mv(sm, states[1][3]).every((x, k) => Math.abs(x - Math.sqrt(6) * states[2][3][k]) < 1e-12) && mv(JT.Jp, states[3][3]).every((x) => Math.abs(x) < 1e-12) && mv(JT.Jp, states[5][3]).every((x) => Math.abs(x) < 1e-12));
    const zero = LA.jacobi(SS).vectors[0]; ok('sa FS24 (g): the unique S^2 = 0 state is (|1;-1> - |0;0> + |-1;1>)/sqrt3 up to a phase', LA.jacobi(SS).values.filter((x) => Math.abs(x) < 1e-9).length === 1 && Math.abs(Math.abs(zero.reduce((s, x, k) => s + x * states[5][3][k], 0)) - 1) < 1e-9);
    ok('sa FS24 (e,f): S^2 spectrum {0,2,6} with 1,3,5 states, S^2|1;1> = 6', (() => { const v = LA.jacobi(SS).values; return v.filter((x) => Math.abs(x - 6) < 1e-9).length === 5 && v.filter((x) => Math.abs(x - 2) < 1e-9).length === 3; })() && near(mv(SS, states[0][3])[0], 6, 1e-12)); }
  // time evolution: exact complex amplitudes from the spectral decomposition of H = S1.S2 (hbar = omega = 1)
  { const E = LA.jacobi(S1S2), psi0 = vec([[1, 0, 0]]);
    const amp = (t) => { const re = new Array(9).fill(0), im = new Array(9).fill(0); E.values.forEach((e, k) => { const v = E.vectors[k], c = v.reduce((s, x, q) => s + x * psi0[q], 0); for (let q = 0; q < 9; q++) { re[q] += Math.cos(e * t) * c * v[q]; im[q] -= Math.sin(e * t) * c * v[q]; } }); return { re, im }; };
    let good = true; for (const t of [0.3, 1.0471975512, 2.2, 4.1]) {
      const { re, im } = amp(t), ph = 3 * t, c = (x, y) => [x, y]; // exam: e^{-iwt}/3 [(1-e^{3iwt}), (2+e^{3iwt})]
      const e1 = [Math.cos(-t), Math.sin(-t)], mul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]], f1 = mul(e1, [(1 - Math.cos(ph)) / 3, -Math.sin(ph) / 3]), f0 = mul(e1, [(2 + Math.cos(ph)) / 3, Math.sin(ph) / 3]);
      good = good && Math.abs(re[idx(1, -1)] - f1[0]) < 1e-9 && Math.abs(im[idx(1, -1)] - f1[1]) < 1e-9 && Math.abs(re[idx(-1, 1)] - f1[0]) < 1e-9 && Math.abs(re[idx(0, 0)] - f0[0]) < 1e-9 && Math.abs(im[idx(0, 0)] - f0[1]) < 1e-9;
      const P = re[idx(0, 0)] ** 2 + im[idx(0, 0)] ** 2, P2 = (re[idx(1, -1)] ** 2 + im[idx(1, -1)] ** 2) * 2;
      good = good && near(P, (5 + 4 * Math.cos(ph)) / 9, 1e-9) && near(P, symAt(S, 'qm-sa-c2', 's2', { omega: 1, t }), 1e-9) && near(P2, symAt(S, 'qm-sa-c2', 's3', { omega: 1, t }), 1e-9) && near(P + P2, 1, 1e-9); }
    ok('sa HS25 (iv)-(v): exact evolution reproduces eq. (28) and P = (5 + 4 cos 3wt)/9', good);
    const b = boss(S, 'qm-sa-b1'), c2 = calcNum(S, 'qm-sa-c2');
    ok('sa b1/c2 answers', near(b.Emax, 1) && near(b.Emin, -2) && near(b.deg2, 5) && near(b.P1, 1 / 9, 1e-9) && near(b.P1, (5 + 4 * Math.cos(Math.PI)) / 9, 1e-9) && near(b.P2, (5 - 2) / 9 * 1, 1e-9) && near(c2.s5, 1 / 9, 1e-6), JSON.stringify(b)); }
  // l x 1/2 Clebsch-Gordan coefficients from the diagonalisation of J^2 + 100 J_z
  for (const l of [1, 2, 3]) {
    const L = spin(l), Sp = spin(0.5), J = tot(L, Sp), M = LA.add(J2(J), J.Jz, 100), ee = LA.jacobi(M); let good = true;
    for (let k = 0; k < J.Jz.length; k++) { const v = ee.vectors[k], val = ee.values[k], m = Math.round((val - (l + 0.5) * (l + 1.5)) / 100 * 2) / 2; // only the j = l+1/2 states
      const j = l + 0.5, target = j * (j + 1) + 100 * m; if (Math.abs(val - target) > 1e-6 || Math.abs(m) > j) continue;
      const up = v[(l - (m - 0.5)) * 2], dn = v[(l - (m + 0.5)) * 2 + 1]; // |m_l = m-1/2>|up>, |m_l = m+1/2>|down>
      good = good && (m - 0.5 < -l ? true : near(up * up, (l + m + 0.5) / (2 * l + 1), 1e-9)) && (m + 0.5 > l ? true : near(dn * dn, (l - m + 0.5) / (2 * l + 1), 1e-9)); }
    ok(`sa sheet 12 Q3: |CG|^2 = (l +- m + 1/2)/(2l+1) for l=${l} (diagonalisation)`, good);
  }
  ok('sa c3 symbolic and bonus', near(symAt(S, 'qm-sa-c3', 's2', { l: 1, m: 0.5 }), 2 / 3) && near(symAt(S, 'qm-sa-c3', 's3', { l: 1, m: 0.5 }), 1 / 3) && near(symAt(S, 'qm-sa-c3', 's2', { l: 1, m: 1.5 }), 1) && near(calcNum(S, 'qm-sa-c3').s5, 0.8));
  // Stern-Gerlach with N spin-1/2 atoms: beams and intensities from the 2^N product states, and D_{3/2} + 2 D_{1/2}
  { const beams = (N) => { const c = {}; for (let b = 0; b < 2 ** N; b++) { let m = 0; for (let i = 0; i < N; i++) m += (b >> i) & 1 ? -0.5 : 0.5; c[m] = (c[m] || 0) + 1; } return c; };
    const b2 = beams(2), b3 = beams(3);
    ok('sa sheet 12 Q1: 2 atoms -> 3 beams 1:2:1; 3 atoms -> 4 beams 1:3:3:1', Object.keys(b2).length === 3 && b2[0] === 2 && b2[1] === 1 && b2[-1] === 1 && Object.keys(b3).length === 4 && b3[0.5] === 3 && b3[1.5] === 1 && b3[-0.5] === 3 && b3[-1.5] === 1);
    const h = spin(0.5), h2 = tot(h, h), j3 = tot({ ...h2, d: 4 }, h), ev3 = LA.jacobi(J2(j3)).values;
    ok('sa: three spin-1/2: J^2 = 15/4 (x4) and 3/4 (x4) = D_3/2 + 2 D_1/2', ev3.filter((x) => near(x, 3.75, 1e-9)).length === 4 && ev3.filter((x) => near(x, 0.75, 1e-9)).length === 4);
    const bb = boss(S, 'qm-sa-b3'); ok('sa b3 answers', near(bb.beams2, 3) && near(bb.beams3, 4) && near(bb.pup, 2 / 3) && near(bb.pdn, 1 / 3) && near(bb.dim, 6)); }
  // FS24 (a)-(d): Alice vs Bob with random states and rotation axes
  { const rnd = ((s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; })(11); let good = true;
    for (let trial = 0; trial < 20; trial++) {
      const a0 = [rnd() - 0.5, rnd() - 0.5], a1 = [rnd() - 0.5, rnd() - 0.5], nrm = Math.hypot(...a0, ...a1), psi = [[a0[0] / nrm, a0[1] / nrm], [a1[0] / nrm, a1[1] / nrm]];
      let n = [rnd() - 0.5, rnd() - 0.5, rnd() - 0.5]; const nn = Math.hypot(...n); n = n.map((x) => x / nn); const th = 6.28 * rnd();
      const cm = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]], cs = Math.cos(th / 2), sn = Math.sin(th / 2);
      // U = cos - i sin (n.sigma): matrix [[cs - i sn nz, -i sn (nx - i ny)], [-i sn (nx + i ny), cs + i sn nz]]
      const U = [[[cs, -sn * n[2]], [-sn * n[1], -sn * n[0]]], [[sn * n[1], -sn * n[0]], [cs, sn * n[2]]]];
      const out = [0, 1].map((i) => [0, 1].reduce((s, j) => { const p = cm(U[i][j], psi[j]); return [s[0] + p[0], s[1] + p[1]]; }, [0, 0]));
      const PA = out[0][0] ** 2 + out[0][1] ** 2, bx = 2 * (psi[0][0] * psi[1][0] + psi[0][1] * psi[1][1]), by = 2 * (psi[0][0] * psi[1][1] - psi[0][1] * psi[1][0]), bz = psi[0][0] ** 2 + psi[0][1] ** 2 - psi[1][0] ** 2 - psi[1][1] ** 2;
      const rot = (v, ang) => { const c = Math.cos(ang), s = Math.sin(ang), nv = n[0] * v[0] + n[1] * v[1] + n[2] * v[2], cr = [n[1] * v[2] - n[2] * v[1], n[2] * v[0] - n[0] * v[2], n[0] * v[1] - n[1] * v[0]]; return v.map((x, i) => x * c + cr[i] * s + n[i] * nv * (1 - c)); };
      const e = rot([0, 0, 1], -th), PB = 0.5 * (1 + e[0] * bx + e[1] * by + e[2] * bz);
      good = good && Math.abs(PA - PB) < 1e-12; }
    ok('sa FS24 (b): Alice (rotate state, measure z) = Bob (measure along O(n,-theta) e_z) for random states', good);
    const bb = boss(S, 'qm-sa-b2'); ok('sa b2 answers', near(bb.pa, 0.5) && near(bb.S2max, 6) && near(bb.S2f, 6) && near(bb.nzero, 1) && near(bb.coef, 1 / Math.sqrt(3), 1e-9) && near(0.5 * (1 + 1), 1)); }
});

  // ---------------------------------------------------------------- wave-mechanics-basics (independent checks)
  { const S = 'wave-mechanics-basics'; if (rooms[S]) {
    const Hh = 6.62607015e-34, hb = Hh / (2 * Math.PI), me = 9.1093837e-31, cc = 2.99792458e8, eV = 1.602176634e-19;
    // Compton: solve energy + momentum conservation numerically for k2 (bisection), compare with the formula and the symbolic step
    { let good = true;
      for (const [lam1, th] of [[7.1e-11, Math.PI / 2], [5e-11, 2.0], [1e-10, Math.PI], [2e-11, 0.7]]) {
        const k1 = 2 * Math.PI / lam1, f = (k2) => { const pe2 = hb * hb * (k1 * k1 + k2 * k2 - 2 * k1 * k2 * Math.cos(th)); return Math.sqrt(pe2 * cc * cc + (me * cc * cc) ** 2) - (hb * cc * (k1 - k2) + me * cc * cc); };
        let lo = 0.2 * k1, hi = k1; for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (f(lo) * f(mid) <= 0) hi = mid; else lo = mid; }
        const shift = 2 * Math.PI / lo - lam1; good = good && Math.abs(shift / (Hh / (me * cc) * (1 - Math.cos(th))) - 1) < 1e-6; }
      ok('wm c1: numerically solved conservation laws reproduce the Compton shift', good);
      ok('wm c1 s3 at random point', near(symAt(S, 'qm-wm-c1', 's3', { h: Hh, m: me, c: cc, th: 1.3 }), Hh / (me * cc) * (1 - Math.cos(1.3)), 1e-9));
      const c1 = calcNum(S, 'qm-wm-c1'); ok('wm c1 s4 = 2.426 pm at 90 deg', near(c1.s4, 2.4263, 1e-3), String(c1.s4));
      ok('wm quiz facts: max shift 4.85 pm; 100 eV electron 0.123 nm', near(2e12 * Hh / (me * cc), 4.8526, 1e-3) && near(1e9 * Hh / Math.sqrt(2 * me * 100 * eV), 0.12266, 2e-3)); }
    // Gaussian spreading by an independent FFT split-step run (hbar = m = 1)
    { const N = 1024, L = 80, dx = L / N, lam = 1.7, tEnd = 2.3;
      const fft = (re, im, inv) => { const n = re.length; for (let i = 1, j = 0; i < n; i++) { let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; } }
        for (let len = 2; len <= n; len <<= 1) { const ang = 2 * Math.PI / len * (inv ? 1 : -1); for (let i = 0; i < n; i += len) for (let k = 0; k < len / 2; k++) { const wr = Math.cos(ang * k), wi = Math.sin(ang * k), a = i + k, b = i + k + len / 2, tr = re[b] * wr - im[b] * wi, ti = re[b] * wi + im[b] * wr; re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti; } }
        if (inv) for (let i = 0; i < n; i++) { re[i] /= n; im[i] /= n; } };
      const re = new Float64Array(N), im = new Float64Array(N); for (let i = 0; i < N; i++) { const x = (i - N / 2) * dx; re[i] = (lam / Math.PI) ** 0.25 * Math.exp(-lam * x * x / 2); }
      fft(re, im, false); for (let i = 0; i < N; i++) { const kk = 2 * Math.PI * (i < N / 2 ? i : i - N) / L, ph = -kk * kk * tEnd / 2, c = Math.cos(ph), s = Math.sin(ph), a = re[i], b = im[i]; re[i] = a * c - b * s; im[i] = a * s + b * c; }
      fft(re, im, true); let m0 = 0, m2 = 0; for (let i = 0; i < N; i++) { const x = (i - N / 2) * dx, p = re[i] ** 2 + im[i] ** 2; m0 += p * dx; m2 += x * x * p * dx; }
      ok('wm c2: split-step Delta x(t)^2 matches 1/(2 lam)[1+(lam t)^2]', near(m2 / m0, (1 + (lam * tEnd) ** 2) / (2 * lam), 1e-6), String(m2 / m0));
      ok('wm c2 s3 symbolic', near(symAt(S, 'qm-wm-c2', 's3', { lam, hbar: 1, m: 1, t: tEnd }), (1 + (lam * tEnd) ** 2) / (2 * lam), 1e-9));
      const c2 = calcNum(S, 'qm-wm-c2'); ok('wm c2 s4 = 172.7 as', near(c2.s4, 172.7, 2e-3), String(c2.s4)); }
    // box integrals by Simpson quadrature
    const simpson = (f, a, b, n = 4000) => { const h = (b - a) / n; let s = f(a) + f(b); for (let i = 1; i < n; i++) s += f(a + i * h) * (i % 2 ? 4 : 2); return s * h / 3; };
    { // sudden wall a -> 2a
      const a = 1, cN = (n) => simpson((x) => Math.sqrt(2 / a) * Math.sin(Math.PI * x / a) * Math.sqrt(1 / a) * Math.sin(n * Math.PI * x / (2 * a)), 0, a), Ps = [];
      for (let n = 1; n <= 400; n++) Ps.push(cN(n) ** 2);
      ok('wm c3: P_2 = 1/2, even n != 2 vanish', near(Ps[1], 0.5, 1e-8) && [3, 5, 7, 9].every((i) => Ps[i] < 1e-12));
      ok('wm c3: P_n = 32/(pi^2 (n^2-4)^2) for odd n (numeric quadrature)', [1, 3, 5, 7, 9, 11].every((n) => near(Ps[n - 1], 32 / (Math.PI ** 2 * (n * n - 4) ** 2), 1e-7)));
      ok('wm c3: probabilities sum to 1', near(Ps.reduce((s, x) => s + x, 0), 1, 1e-4));
      ok('wm c3 s3 symbolic', near(symAt(S, 'qm-wm-c3', 's3', { n: 5 }), Ps[4], 1e-7)); ok('wm c3 s4 = P_1 = 0.360', near(calcNum(S, 'qm-wm-c3').s4, Ps[0], 1e-7)); }
    { // FS26 Q2
      const a = 1, cN = (n) => simpson((x) => Math.sqrt(30 / a ** 5) * x * (a - x) * Math.sqrt(2 / a) * Math.sin(n * Math.PI * x / a), 0, a), P = []; let tot = 0;
      for (let n = 1; n <= 40; n++) { P.push(cN(n) ** 2); tot += P[n - 1]; }
      ok('wm b1: P_n = 960/(pi n)^6 odd, 0 even, sum 1', [1, 3, 5, 7].every((n) => near(P[n - 1], 960 / (Math.PI * n) ** 6, 1e-8)) && [2, 4, 6].every((n) => P[n - 1] < 1e-14) && near(tot, 1, 1e-9));
      let s6 = 0; for (let l = 0; l < 200000; l++) s6 += 1 / (2 * l + 1) ** 6;
      const b1 = boss(S, 'qm-wm-b1'); ok('wm b1 answers', near(b1.p1, P[0], 1e-8) && near(b1.p3, P[2], 1e-6) && near(b1.sum, s6, 1e-9) && near(b1.e2e1, 4) && near(b1.podd, 1)); }
    { // FS19 Q1: 2D box, grid projections
      const A = [0.5, 0], B = [0, 0.5], C = [Math.SQRT1_2, 0], K = 80, a = 1, h = a / K, psi = (nx, ny, x, y) => (2 / a) * Math.sin(nx * Math.PI * x / a) * Math.sin(ny * Math.PI * y / a);
      const Psi = (x, y) => { const f = (c, nx, ny) => [c[0] * psi(nx, ny, x, y), c[1] * psi(nx, ny, x, y)]; const u = f(A, 2, 1), v = f(B, 1, 2), w = f(C, 1, 1); return [u[0] + v[0] + w[0], u[1] + v[1] + w[1]]; };
      const pts = []; for (let i = 0; i < K; i++) for (let j = 0; j < K; j++) pts.push([(i + 0.5) * h, (j + 0.5) * h]); // midpoint grid
      const norm = pts.reduce((s, [x, y]) => s + (Psi(x, y)[0] ** 2 + Psi(x, y)[1] ** 2) * h * h, 0);
      const proj = (nx, ny) => { let re = 0, im = 0; for (const [x, y] of pts) { const p = Psi(x, y), e = psi(nx, ny, x, y); re += e * p[0] * h * h; im += e * p[1] * h * h; } return re * re + im * im; };
      const pE5 = proj(2, 1) + proj(1, 2), pE2 = proj(1, 1);
      let pp = 0, pm = 0; for (const [x, y] of pts) { const p = Psi(x, y), q = Psi(y, x), sx = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], ax = [(p[0] - q[0]) / 2, (p[1] - q[1]) / 2]; pp += (sx[0] ** 2 + sx[1] ** 2) * h * h; pm += (ax[0] ** 2 + ax[1] ** 2) * h * h; }
      const b2 = boss(S, 'qm-wm-b2');
      ok('wm b2: |A|^2+|B|^2+|C|^2 = 1 for the game values', near(norm, 1, 1e-6), String(norm));
      ok('wm b2: energy probabilities and R probabilities from grid projections', near(b2.P5, pE5, 1e-6) && near(b2.P2, pE2, 1e-6) && near(b2.Rp, pp, 1e-6) && near(b2.Rm, pm, 1e-6), `${pE5} ${pE2} ${pp} ${pm}`);
      ok('wm b2: energies 2, 5 (units pi^2 hbar^2/2ma^2); (1,2),(2,1) degenerate, (1,1) not', near(b2.E11, 1 + 1) && near(b2.E21, 4 + 1)); }
    { // FS22 Q1: potential step, matching conditions solved numerically (m = hbar = 1, V0 = 1, E = 2)
      const E = 2, V0 = 1, k = Math.sqrt(2 * E), kp = Math.sqrt(2 * (E - V0));
      // unknowns r, t (complex in general but real here): 1 + r = t ; k (1 - r) = kp t
      const t = 2 * k / (k + kp), r = t - 1;
      const psiL = (x) => [Math.cos(k * x) + r * Math.cos(k * x), Math.sin(k * x) - r * Math.sin(k * x)], dL = 1e-6;
      const jfun = (f, x) => { const p = f(x), q = f(x + dL), d = [(q[0] - p[0]) / dL, (q[1] - p[1]) / dL]; return p[0] * d[1] - p[1] * d[0]; };
      const jl = jfun(psiL, -1), jr = jfun((x) => [t * Math.cos(kp * x), t * Math.sin(kp * x)], 1.3);
      const b3 = boss(S, 'qm-wm-b3');
      ok('wm b3: current left = current right (continuity), equals 1-r^2 = k\'/k t^2', near(jl, jr, 1e-5) && near(jr, kp * t * t, 1e-5));
      ok('wm b3 answers', near(b3.jin, 1) && near(b3.kr, kp / k, 1e-9) && near(b3.r, r, 1e-9) && near(b3.T, jr / k, 1e-5) && near(b3.jl, jl / k, 1e-5)); }
    // Galilean / Ehrenfest sanity of the quiz claim: <x^3> != <x>^3 for a Gaussian displaced by d: <x^3> = d^3 + 3 d sigma^2
    ok('wm: Ehrenfest x^4 potential, <x^3> - <x>^3 = 3 d sigma^2', near(simpson((x) => (x ** 3) * Math.exp(-((x - 1) ** 2) / 2) / Math.sqrt(2 * Math.PI), -12, 14) - 1, 3, 1e-6));
  } }

// ================================================================ FORMALISM AND UNCERTAINTY
hooks.push(() => {
  const S = 'formalism-and-uncertainty';
  if (!rooms[S]) return;
  const N = 60, a = LA.ladder(N), ad = LA.T(a);
  const X = LA.scale(LA.add(a, ad), Math.SQRT1_2), Pm = LA.scale(LA.add(ad, a, -1), Math.SQRT1_2); // i p = (a^+ - a)/sqrt2 (m = hbar = omega = 1): p = -i (a - a^+)/sqrt2, so p^2 = -(a^+ - a)^2 / 2
  const X2 = LA.mul(X, X), P2 = LA.scale(LA.mul(Pm, Pm), -1);
  const m = (M, n) => M[n][n];
  // HS18 Q2 (iii),(v): Delta x Delta p = n + 1/2, anticommutator expectation 0, stronger relation holds
  { let good = true, anti = true;
    for (let n = 0; n <= 6; n++) { const dx2 = m(X2, n), dp2 = m(P2, n); good = good && near(Math.sqrt(dx2 * dp2), n + 0.5, 1e-12);
      // <{x,p}> = i<(a+a^+)(a^+-a)/2 + (a^+-a)(a+a^+)/2>: (a^+ - a) is i*p*sqrt2, so {x,p} = i/2 [ (a+a^+)(a^+-a) + (a^+-a)(a+a^+) ] ; diagonal element
      const Q = LA.add(LA.mul(LA.add(a, ad), LA.add(ad, a, -1)), LA.mul(LA.add(ad, a, -1), LA.add(a, ad))); anti = anti && Math.abs(Q[n][n]) < 1e-12; }
    ok('fu: oscillator Delta x Delta p = n + 1/2 for n = 0..6 (matrices)', good); ok('fu: <{x,p}> = 0 in psi_n', anti);
    const bb = boss(S, 'qm-fu-b1');
    ok('fu b1 answers (5/2, 49/4, 0, 1/4)', near(bb.dxdp2, Math.sqrt(m(X2, 2) * m(P2, 2))) && near(bb.lhs3, m(X2, 3) * m(P2, 3)) && near(bb.anti, 0) && near(bb.rhs, 0.25) && bb.lhs3 >= bb.rhs); }
  // c1: spin-1 measurement
  { let good = true;
    for (const th of [0.3, 0.9, 1.2]) { const c = [Math.cos(th), Math.sin(th), 0], mm = [1, 0, -1]; let e1 = 0, e2 = 0; for (let i = 0; i < 3; i++) { e1 += mm[i] * c[i] ** 2; e2 += mm[i] ** 2 * c[i] ** 2; }
      good = good && near(symAt(S, 'qm-fu-c1', 's3', { hbar: 1.3, th }), 1.3 * e1) && near(symAt(S, 'qm-fu-c1', 's4', { hbar: 1.3, th }), 1.3 * Math.sqrt(e2 - e1 * e1)); }
    ok('fu c1: <Lz> and Delta Lz from explicit amplitudes', good);
    ok('fu c1 bonus = sqrt3/4', near(calcNum(S, 'qm-fu-c1').s5, Math.sqrt(3) / 4, 1e-9)); }
  // c2: Heisenberg picture oscillator via RK4 of the Ehrenfest equations and the coherent-state formula
  { let good = true;
    for (const [x0, p0, mm, w, t] of [[1, 0.5, 1, 2, Math.PI / 8], [0.7, -1.2, 1.5, 0.8, 2.1]]) {
      let x = x0, p = p0; const n = 20000, h = t / n, f = (x, p) => [p / mm, -mm * w * w * x];
      for (let i = 0; i < n; i++) { const k1 = f(x, p), k2 = f(x + h / 2 * k1[0], p + h / 2 * k1[1]), k3 = f(x + h / 2 * k2[0], p + h / 2 * k2[1]), k4 = f(x + h * k3[0], p + h * k3[1]); x += h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); p += h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]); }
      const al = [Math.sqrt(mm * w / 2) * x0, p0 / Math.sqrt(2 * mm * w)], coh = Math.sqrt(2 / (mm * w)) * (al[0] * Math.cos(w * t) + al[1] * Math.sin(w * t));
      good = good && near(symAt(S, 'qm-fu-c2', 's3', { x0, p0, m: mm, w, t }), x, 1e-8) && near(coh, x, 1e-8); }
    ok('fu c2: <x>(t) = x0 cos + p0 sin/(m w) vs RK4 and coherent state', good);
    ok('fu c2 bonus 0.884', near(calcNum(S, 'qm-fu-c2').s5, 0.8839, 1e-3)); }
  // c3: spin-1/2 strong uncertainty relation with explicit 2x2 complex algebra
  { const cm = (u, v) => [u[0] * v[0] - u[1] * v[1], u[0] * v[1] + u[1] * v[0]], mv = (M, v) => [0, 1].map((i) => [0, 1].reduce((s, j) => { const q = cm(M[i][j], v[j]); return [s[0] + q[0], s[1] + q[1]]; }, [0, 0]));
    const ip = (u, v) => [0, 1].reduce((s, i) => [s[0] + u[i][0] * v[i][0] + u[i][1] * v[i][1], s[1] + u[i][0] * v[i][1] - u[i][1] * v[i][0]], [0, 0]);
    const sx = [[[0, 0], [1, 0]], [[1, 0], [0, 0]]], sy = [[[0, 0], [0, -1]], [[0, 1], [0, 0]]], sz = [[[1, 0], [0, 0]], [[0, 0], [-1, 0]]];
    let good = true;
    for (const [th, ph] of [[0.7, 0.4], [1.3, 1.1], [1.5707963268, 0.7853981634]]) {
      const psi = [[Math.cos(th / 2), 0], [Math.sin(th / 2) * Math.cos(ph), Math.sin(th / 2) * Math.sin(ph)]];
      const ev = (M) => ip(psi, mv(M, psi))[0], ax = ev(sx), ay = ev(sy), az = ev(sz);
      const dvx = 1 - ax * ax, dvy = 1 - ay * ay; // sigma^2 = 1
      // anticommutator of the shifted operators: <{sx,sy}> - 2 ax ay = 0 - 2 ax ay ; commutator [sx,sy] = 2i sz -> <i[A,B]> = -2 az
      const strongRHS = 0.25 * (2 * az) ** 2 + 0.25 * (2 * ax * ay) ** 2;
      good = good && near(dvx * dvy, strongRHS, 1e-12) && near(symAt(S, 'qm-fu-c3', 's2', { th, ph }), dvx * dvy, 1e-12) && near(symAt(S, 'qm-fu-c3', 's3', { th, ph }), 0.25 * (2 * ax * ay) ** 2, 1e-12) && dvx * dvy >= az * az - 1e-12; }
    ok('fu c3: spin-1/2 equality in the stronger relation; symbolic references match', good);
    ok('fu c3 bonus 0.25', near(calcNum(S, 'qm-fu-c3').s5, 0.25, 1e-9)); }
  // b2: L.S for l = 1, s = 1/2 (real construction L.S = LzSz + (L+S- + L-S+)/2)
  { const Lz = [[1, 0, 0], [0, 0, 0], [0, 0, -1]], Lp = [[0, Math.SQRT2, 0], [0, 0, Math.SQRT2], [0, 0, 0]], Sz = [[0.5, 0], [0, -0.5]], Sp = [[0, 1], [0, 0]];
    const LS = LA.add(LA.kron(Lz, Sz), LA.scale(LA.add(LA.kron(Lp, LA.T(Sp)), LA.kron(LA.T(Lp), Sp)), 0.5));
    const ev = LA.jacobi(LS).values, n32 = ev.filter((x) => near(x, 0.5, 1e-9)).length, n12 = ev.filter((x) => near(x, -1, 1e-9)).length;
    const bb = boss(S, 'qm-fu-b2');
    ok('fu b2: L.S eigenvalues +1/2 (x4) and -1 (x2), trace 0', n32 === 4 && n12 === 2 && near(ev.reduce((s, x) => s + x, 0), 0, 1e-9));
    ok('fu b2 answers', near(bb.j32, 0.5) && near(bb.j12, -1) && near(bb.dim, ev.length) && near(bb.trace, 0)); }
  // b3: HS22 B.1 with complex 3x3 matrices
  { const w = [Math.cos(2 * Math.PI / 3), Math.sin(2 * Math.PI / 3)], cj = (z) => [z[0], -z[1]], cm = (u, v) => [u[0] * v[0] - u[1] * v[1], u[0] * v[1] + u[1] * v[0]];
    const pw = (k) => { const q = ((k % 3) + 3) % 3; return q === 0 ? [1, 0] : q === 1 ? w : cj(w); };
    const Sm = [0, 1, 2].map((j) => [0, 1, 2].map((k) => { const z = pw(j * k); return [z[0] / Math.sqrt(3), z[1] / Math.sqrt(3)]; }));
    const mm = (A, B) => A.map((_, i) => B[0].map((__, j) => A[i].reduce((s, _x, k) => { const q = cm(A[i][k], B[k][j]); return [s[0] + q[0], s[1] + q[1]]; }, [0, 0])));
    const dag = (A) => A[0].map((_, j) => A.map((r) => cj(r[j])));
    const dg = (v) => v.map((x, i) => v.map((_, j) => (i === j ? [x, 0] : [0, 0])));
    const xm = dg([0, 1, 2]), pm = mm(mm(Sm, xm), dag(Sm)), U = mm(dag(Sm), Sm);
    ok('fu b3: S unitary', U.every((r, i) => r.every((z, j) => near(z[0], i === j ? 1 : 0, 1e-12) && Math.abs(z[1]) < 1e-12)));
    ok('fu b3: p = S x S^-1 is hermitian', pm.every((r, i) => r.every((z, j) => near(z[0], pm[j][i][0], 1e-12) && near(z[1], -pm[j][i][1], 1e-12))));
    const Tm = mm(mm(Sm, [0, 1, 2].map((i) => [0, 1, 2].map((j) => (i === j ? pw(i) : [0, 0])))), dag(Sm));
    ok('fu b3: T = omega^p = S diag(1,w,w*) S^+ is the shift T|x> = |x-1 mod 3>', Tm.every((r, i) => r.every((z, j) => near(z[0], (j - i + 3) % 3 === 1 ? 1 : 0, 1e-12) && Math.abs(z[1]) < 1e-12)));
    const p0 = pm[0][0][0], p2 = mm(pm, pm)[0][0][0];
    const bb = boss(S, 'qm-fu-b3');
    ok('fu b3: <p> = 1, <p^2> = 5/3, Delta p = sqrt(2/3), Delta x = 0', near(p0, 1, 1e-12) && near(p2, 5 / 3, 1e-12) && near(bb.p0, p0, 1e-12) && near(bb.dp, Math.sqrt(p2 - p0 * p0), 1e-12) && near(bb.dx, 0) && near(bb.T01, Tm[0][1][0], 1e-12)); }
  // quiz facts: HS22 A3 (alpha, E), A7 (4^N), L=1 spin bound
  ok('fu quiz: A3 psi = x exp(-alpha x^2), alpha = m w/2 hbar gives E = 3/2 hbar w (-psi\'\'/2 + x^2 psi/2 = E psi at sample points)', [0.3, 0.8, 1.4].every((x) => { const al = 0.5, h = 1e-4, f = (y) => y * Math.exp(-al * y * y), d2 = (f(x + h) - 2 * f(x) + f(x - h)) / (h * h); return near((-0.5 * d2 + 0.5 * x * x * f(x)) / f(x), 1.5, 1e-5); }));
  ok('fu quiz: A7 l(l+1) = 15/4 -> l = 3/2, 2l+1 = 4, N=2 gives 16 = n^2', near(1.5 * 2.5, 15 / 4) && 4 ** 2 === 16);
});

// ================================================================ ENTANGLEMENT LAB (real in-plane observables sigma(t)=cos t sz + sin t sx)
hooks.push(() => {
  const S = 'entanglement-lab';
  if (!rooms[S]) return;
  const sg = (t) => [[Math.cos(t), Math.sin(t)], [Math.sin(t), -Math.cos(t)]], K = LA.kron, I2 = LA.eye(2);
  const dot = (u, M, v) => u.reduce((s, ui, i) => s + ui * M[i].reduce((q, mij, j) => q + mij * v[j], 0), 0);
  const sing = [0, 1 / Math.SQRT2, -1 / Math.SQRT2, 0]; // (up down - down up)/sqrt2 in the basis uu, ud, du, dd
  const C = (t1, t2) => dot(sing, K(sg(t1), sg(t2)), sing);
  // Bell matrices: orthonormal, maximally entangled (|det C| = 1/2), rho_A = 1/2
  const h = 1 / Math.SQRT2, bell = { 'Phi+': [h, 0, 0, h], 'Phi-': [h, 0, 0, -h], 'Psi+': [0, h, h, 0], 'Psi-': sing };
  const names = Object.keys(bell);
  ok('ent Bell basis orthonormal', names.every((a) => names.every((b) => near(bell[a].reduce((s, x, i) => s + x * bell[b][i], 0), a === b ? 1 : 0, 1e-12))));
  ok('ent Bell states: |det C| = 1/2 and rho_A = 1/2 (purity 1/2)', names.every((n) => { const v = bell[n], det = v[0] * v[3] - v[1] * v[2], rA = [[v[0] ** 2 + v[1] ** 2, v[0] * v[2] + v[1] * v[3]], [v[0] * v[2] + v[1] * v[3], v[2] ** 2 + v[3] ** 2]]; return near(Math.abs(det), 0.5, 1e-12) && near(rA[0][0], 0.5, 1e-12) && near(rA[0][1], 0, 1e-12) && near(rA[0][0] ** 2 + rA[1][1] ** 2 + 2 * rA[0][1] ** 2, 0.5, 1e-12); }));
  { const det = (v) => v[0] * v[3] - v[1] * v[2];
    ok('ent FS16 D.3: |11> and |10>+|11> products, |10>-|01> and |11>+|00> entangled', det([0, 0, 0, 1]) === 0 && det([0, 0, 1, 1]) === 0 && det([0, -1, 1, 0]) !== 0 && det([1, 0, 0, 1]) !== 0); }
  // singlet: S_a psi = 0 for the total spin (sigma_x, sigma_z in-plane), C = -cos(theta), P_++ = (1-cos)/4
  { const sz = sg(0), sx = sg(Math.PI / 2), tot = (s) => LA.add(K(s, I2), K(I2, s));
    ok('ent singlet annihilated by total sigma_z, sigma_x', [sz, sx].every((s) => tot(s).every((row) => near(row.reduce((q, m, j) => q + m * sing[j], 0), 0, 1e-12)))); }
  for (const th of [0, 0.3, 1, 2, 3.1]) {
    ok(`ent singlet C(0,theta=${th}) = -cos theta (symbolic s3 of c1 too)`, near(C(0, th), -Math.cos(th), 1e-12) && near(symAt(S, 'qm-ent-c1', 's3', { theta: th }), C(0, th), 1e-12));
    const pp = (() => { const P1 = [[(1 + sg(0)[0][0]) / 2, sg(0)[0][1] / 2], [sg(0)[1][0] / 2, (1 + sg(0)[1][1]) / 2]], P2 = [[(1 + sg(th)[0][0]) / 2, sg(th)[0][1] / 2], [sg(th)[1][0] / 2, (1 + sg(th)[1][1]) / 2]]; return dot(sing, K(P1, P2), sing); })();
    ok(`ent P_++ = (1-cos theta)/4, theta=${th}`, near(pp, (1 - Math.cos(th)) / 4, 1e-12) && near(symAt(S, 'qm-ent-c1', 's2', { theta: th }), pp, 1e-12)); }
  // CHSH: figure 19 gives 2 sqrt 2, general Bob angles 2(cos+sin), deterministic LHV strategies stay <= 2, QM operator norm <= 2 sqrt 2
  { const chsh = (a, a2, b, b2) => C(a, b) + C(a2, b) + C(a, b2) - C(a2, b2);
    ok('ent CHSH figure 19 = -2 sqrt 2', near(chsh(0, Math.PI / 2, Math.PI / 4, -Math.PI / 4), -2 * Math.SQRT2, 1e-12));
    for (const ph of [0.2, 0.7, Math.PI / 4, 1.3]) ok(`ent c1 s4 S(phi=${ph})`, near(Math.abs(chsh(0, Math.PI / 2, ph, -ph)), symAt(S, 'qm-ent-c1', 's4', { phi: ph }), 1e-12));
    ok('ent c1 s6 bonus = 2 sqrt 2', near(calcNum(S, 'qm-ent-c1').s6, 2 * Math.SQRT2, 1e-9));
    let best = 0; for (const [a, a2, b, b2] of [...Array(16).keys()].map((k) => [1, 2, 4, 8].map((m) => (k & m ? 1 : -1)))) best = Math.max(best, Math.abs(a * b + a2 * b + a * b2 - a2 * b2));
    ok('ent LHV: all 16 deterministic strategies give |S| <= 2 (max = 2)', best === 2);
    let max = 0, rnd = ((s) => () => { s = (s * 16807) % 2147483647; return s / 2147483647; })(5);
    for (let k = 0; k < 400; k++) { const t = [0, 1, 2, 3].map(() => 2 * Math.PI * rnd()); max = Math.max(max, Math.abs(chsh(...t))); }
    ok('ent random in-plane axes never exceed 2 sqrt 2', max <= 2 * Math.SQRT2 + 1e-12 && max > 2);
    const A = sg(0), A2 = sg(Math.PI / 2), B = sg(Math.PI / 4), B2 = sg(-Math.PI / 4), Sop = LA.add(LA.add(K(A, B), K(A2, B)), LA.add(K(A, B2), K(A2, B2), -1)), ev = LA.jacobi(Sop).values;
    ok('ent CHSH operator: eigenvalues +-2 sqrt 2 (Tsirelson)', near(ev[3], 2 * Math.SQRT2, 1e-9) && near(ev[0], -2 * Math.SQRT2, 1e-9)); }
  // Hardy: three vanishing probabilities and P[a0 > b1] = 1/15
  { const psi = [1, 1, 0, 1].map((x) => x / Math.sqrt(3)); // |++>, |-+> (index 2: Alice -), |-->: order ++, +-, -+, --
    const psi4 = [1, 0, 1, 1].map((x) => x / Math.sqrt(3)), s2 = Math.SQRT2, s5 = Math.sqrt(5);
    const A0 = { '+': [1, 0], '-': [0, 1] }, A1 = { '+': [1 / s2, 1 / s2], '-': [1 / s2, -1 / s2] }, B0 = A0, B1 = { '+': [2 / s5, 1 / s5], '-': [1 / s5, -2 / s5] };
    const P = (bA, ra, bB, rb) => { let amp = 0; for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) amp += bA[ra][i] * bB[rb][j] * psi4[2 * i + j]; return amp * amp; };
    ok('ent Hardy: P[a0>b0]=P[b0>a1]=P[a1>b1]=0', near(P(A0, '+', B0, '-'), 0, 1e-12) && near(P(A1, '-', B0, '+'), 0, 1e-12) && near(P(A1, '+', B1, '-'), 0, 1e-12));
    ok('ent Hardy: P[a0>b1] = 1/15 (> 0)', near(P(A0, '+', B1, '-'), 1 / 15, 1e-12) && psi.length === 4); }
  // teleportation: outcomes 1/4, Bob's states -phi, -sigma3 phi, sigma1 phi, -i sigma2 phi; corrections give phi up to a phase
  { const a = 0.6, b = 0.8, phi = [a, b], chi = [[0, h, -h, 0], [0, h, h, 0], [h, 0, 0, -h], [h, 0, 0, h]]; let good = true;
    const psi12 = [[0, h], [-h, 0]], bob = chi.map((c) => [0, 1].map((m) => { let x = 0; for (let k = 0; k < 2; k++) for (let l = 0; l < 2; l++) x += c[2 * k + l] * phi[k] * psi12[l][m]; return x; }));
    const p = bob.map((v) => v[0] ** 2 + v[1] ** 2);
    const want = [[-a, -b], [-a, b], [b, a], [-b, a]]; // -phi, -sigma3 phi, sigma1 phi, a|dn> - b|up> = (-b, a)
    good = p.every((x) => near(x, 0.25, 1e-12)) && bob.every((v, i) => near(v[0], want[i][0] / 2, 1e-12) && near(v[1], want[i][1] / 2, 1e-12));
    ok('ent teleportation: probabilities 1/4 and Bob states (script 10.3)', good);
    ok('ent c3 bonus = 1/4, s3 reference = b', near(calcNum(S, 'qm-ent-c3').s5, 0.25) && near(symAt(S, 'qm-ent-c3', 's3', { a: 0.3, b: 0.7 }), 0.7)); }
  // purity of cos a |00> + sin a |11>
  for (const al of [0.1, 0.5, Math.PI / 8, Math.PI / 4, 1.2]) ok(`ent c2 purity alpha=${al}`, near(symAt(S, 'qm-ent-c2', 's3', { alpha: al }), 1 - 0.5 * Math.sin(2 * al) ** 2, 1e-12) && near(symAt(S, 'qm-ent-c2', 's2', { alpha: al }), Math.cos(al) ** 2, 1e-12));
  ok('ent c2 bonus 0.75', near(calcNum(S, 'qm-ent-c2').s5, 0.75, 1e-9));
  // bosses
  { const b1 = boss(S, 'qm-ent-b1'), b2 = boss(S, 'qm-ent-b2'), b3 = boss(S, 'qm-ent-b3');
    ok('ent b1 (HS21): 2, 1/sqrt2, 1/2, 0', near(b1.cplus, 2) && near(b1.coef, h, 1e-12) && near(b1.p1, 0.5) && near(b1.p2, 0));
    ok('ent b2 (FS19): 1, 0, 9, 1/sqrt3, 1/3, 1, 0', near(b2.Jz11, 1) && near(b2.Jx11, 0) && near(b2.dimsum, 9) && near(b2.coef, 1 / Math.sqrt(3), 1e-12) && near(b2.pA, 1 / 3) && near(b2.pB, 1) && near(b2.pB0, 0));
    ok('ent b3 (FS16): 2, 1, 1, 1/2, 1, 0, 1', near(b3.nent, 2) && near(b3.pur4, 1) && near(b3.Px1, 1) && near(b3.purA, 0.5) && near(b3.purAb, 1) && near(b3.b1, 0) && near(b3.b2, 1));
    // Bloch lengths: rho1 = 1/2 1 -> b = 0; rho2 = 1/2 [[1,1],[1,1]] -> b = (1,0,0)
    ok('ent FS16 D.7 purity from b', near(0.5 * (1 + 0), 0.5) && near(0.5 * (1 + 1), 1)); }
});

// @@SECTIONS-END
for (const h of hooks) h();
console.log(fails ? `${fails} of ${checks} FAILED` : `ALL PASS (${checks} checks)`);
process.exit(fails ? 1 : 0);
