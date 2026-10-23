// Solid-state content check: every answer expression evaluates through src/expr.js, every unit is listed, and the numbers
// match (a) the values printed in the exam solutions (HS20 Ensslin; HS23 Zheludev Jan + Aug 2024), (b) literature values,
// (c) independent numerical checks (quadrature, root finding, energy minimisation) coded below without the content formulas.
import { readFileSync } from 'node:fs';
import { evaluate, withinTolerance } from '../src/expr.js';

const dir = new URL('../content/solid-state/', import.meta.url);
const index = JSON.parse(readFileSync(new URL('index.json', dir)));
let fails = 0;
const ok = (name, cond, extra = '') => { console.log(`${cond ? 'PASS' : 'FAIL'} ${name} ${extra}`); if (!cond) fails++; };
const near = (a, b, r = 0.01) => Math.abs(a / b - 1) < r;

const got = {}, boss = {}, allIds = new Set();
const R = { bond: 'bonding-grotto', lattice: 'lattice-gate', phonon: 'phonon-halls', fermi: 'fermi-sea', drift: 'drift-corridor', semi: 'semiconductor-forge', magnet: 'magnet-vault', deg: 'degenerate-core' };
ok('index lists all 8 rooms', Object.values(R).every((r) => index.rooms.includes(r)) && index.rooms.length === 8);

for (const id of index.rooms) {
  const room = JSON.parse(readFileSync(new URL(id + '.json', dir)));
  ok(`${id}: has >= 2 sources`, room.sources?.length >= 2);
  ok(`${id}: sources have file+where`, room.sources.every((s) => s.file && s.where));
  ok(`${id}: course/intro/topics`, room.course === 'solid-state' && !!room.intro && room.topics.length >= 3);
  ok(`${id}: has a boss`, room.encounters.some((e) => e.type === 'boss'));
  const seen = new Set();
  for (const enc of room.encounters) {
    const key = `${id}/${enc.id}`;
    ok(`${key}: unique id`, !seen.has(enc.id)); seen.add(enc.id);
    ok(`${key}: namespaced id`, /^ss-[a-z]{3}-[A-Za-z0-9]+$/.test(enc.id) && !allIds.has(enc.id)); allIds.add(enc.id);
    ok(`${key}: known type`, ['lesson', 'quiz', 'derive', 'calc', 'boss'].includes(enc.type));
    if (enc.type === 'lesson') {
      ok(`${key}: lesson blocks`, enc.blocks.length >= 4 && enc.blocks.every((x) => ['text', 'eq', 'intuition', 'pitfall', 'figure', 'exam'].includes(x.kind) && (x.html || x.tex)) && enc.blocks.some((x) => x.kind === 'eq'));
      ok(`${key}: lesson checks`, enc.check.length >= 2 && enc.check.every((q) => q.options.length >= 3 && q.correct >= 0 && q.correct < q.options.length && q.explain));
      ok(`${key}: lesson source`, enc.source.length >= 1 && enc.source.every((x) => x.file && x.where));
    }
    if (enc.type === 'quiz') {
      ok(`${key}: quiz >= 5 questions, valid answers`, enc.questions.length >= 5 && enc.questions.every((q) => q.options.length === 4 && q.correct >= 0 && q.correct < 4 && q.explain));
      ok(`${key}: quiz passMark`, enc.passMark > 0 && enc.passMark <= 1);
      ok(`${key}: no duplicate options`, enc.questions.every((q) => new Set(q.options).size === q.options.length));
    }
    if (enc.type === 'derive') ok(`${key}: derive`, enc.steps.length >= 3 && enc.steps.every((x) => x.prompt && x.reveal) && enc.keyPoints.length >= 3 && enc.source?.file && enc.goal);
    if (enc.type === 'calc') {
      ok(`${key}: fight kind`, enc.fight === 'normal' || enc.fight === 'fermi');
      const scope = { ...enc.vars }; got[key] = {};
      for (const s of enc.steps) {
        let v; try { v = evaluate(s.answer, scope); } catch (e) { v = NaN; console.log('   ', e.message); }
        got[key][s.id] = v; scope[s.id] = v;
        ok(`${key}.${s.id} evaluates`, Number.isFinite(v), String(v));
        ok(`${key}.${s.id} unit listed`, s.units.includes(s.unit));
        ok(`${key}.${s.id} own tolerance`, withinTolerance(v, v, s));
        ok(`${key}.${s.id} has hint`, s.hint && s.hint.length > 20);
      }
      ok(`${key}: >=1 required step`, enc.steps.some((s) => !s.bonus));
    }
    if (enc.type === 'boss') {
      boss[key] = {};
      for (const f of enc.finalAnswers) { let v; try { v = evaluate(f.answer, f.vars); } catch (e) { v = NaN; } boss[key][f.id] = v; ok(`${key}.${f.id} evaluates`, Number.isFinite(v), String(v)); }
      ok(`${key}: keyPoints >= 5`, enc.keyPoints.length >= 5);
      ok(`${key}: has source`, !!enc.source?.file && !!enc.source?.where);
    }
  }
}
const SHORT = { bond: 'bon', lattice: 'lat', phonon: 'pho', fermi: 'fer', drift: 'dri', semi: 'sem', magnet: 'mag', deg: 'deg' };
const g = (room, enc) => got[`${R[room]}/ss-${SHORT[room]}-${enc}`];
const b = (room, enc) => boss[`${R[room]}/ss-${SHORT[room]}-${enc}`];
const kB = 1.380649e-23, e = 1.602176634e-19, hbar = 1.054571817e-34, me = 9.1093837015e-31, NA = 6.02214076e23;

// ---------------- Room 1: lattices (keys: HS23 Jan/Aug solutions) ----------------
ok('Jan boss b2: areas 24, 1.645, 12, 3.29; k 2.66', near(b('lattice', 'b2').A, 24, 1e-9) && near(b('lattice', 'b2').ABZ, 1.645, 1e-3) && near(b('lattice', 'b2').A1, 12, 1e-9) && near(b('lattice', 'b2').ABZ1, 3.29, 1e-3) && near(b('lattice', 'b2').k, 2.66, 3e-3));
ok('Jan boss b2: theta 29.47/20.73 (key), 2theta 58.9, I ratio 1/9 and 0', near(b('lattice', 'b2').th21, 29.47, 2e-3) && near(b('lattice', 'b2').th11, 20.73, 3e-3) && near(b('lattice', 'b2').tt21, 58.9, 1e-3) && near(b('lattice', 'b2').Ij, 1 / 9, 1e-9) && b('lattice', 'b2').Ik === 4);
ok('Aug boss b3: areas 10, 3.95, 20, 1.97; theta 39.5/22.2; ratio 4', near(b('lattice', 'b3').A1, 10, 1e-9) && near(b('lattice', 'b3').ABZ1, 3.95, 2e-3) && near(b('lattice', 'b3').A2, 20, 1e-9) && near(b('lattice', 'b3').ABZ2, 1.97, 3e-3) && near(b('lattice', 'b3').th21, 39.5, 2e-3) && near(b('lattice', 'b3').th11, 22.2, 2e-3) && near(b('lattice', 'b3').Io, 4, 1e-6), JSON.stringify(b('lattice', 'b3')));
ok('Jan P1: A = 24 A^2', g('lattice', 'c1').A === 24);
ok('Jan P1: A* = 1.64 (key 1.64)', near(g('lattice', 'c1').ABZ, 1.64, 4e-3));
ok('Jan P1: |k| = 2.66 (key)', near(g('lattice', 'c1').k, 2.66, 3e-3));
ok('Jan P1: theta(2,1) = 29.47 deg (key)', near(g('lattice', 'c1').th21, 29.47, 1e-3));
ok('Jan P1: theta(1,1) = 20.73 deg (key)', near(g('lattice', 'c1').th11, 20.73, 3e-3), String(g('lattice', 'c1').th11));
ok('Jan P1: I ratio = 1/9 (key (1/3)^2)', near(g('lattice', 'c1').ratio, 1 / 9, 1e-9));
ok('Jan P1: 2 theta = angle between ki and kf', near(g('lattice', 'c1').th21x2, 2 * 29.47, 1e-3));
ok('Aug P1: primitive cell of centred lattice 10 A^2, BZ 3.95', g('lattice', 'c2').A1 === 10 && near(g('lattice', 'c2').BZ1, 3.95, 3e-3));
ok('Aug P1: second configuration BZ = 1.97 (key)', near(g('lattice', 'c2').BZ2, 1.97, 3e-3));
ok('Aug P1: theta(2,1) = 39.5, theta(1,1) = 22.2 (key)', near(g('lattice', 'c2').th21, 39.5, 2e-3) && near(g('lattice', 'c2').th11, 22.2, 2e-3));
ok('Aug P1: I(2,1)/I(1,1) = 4 (key)', near(g('lattice', 'c2').ratio, 4, 1e-9));
// independent: structure factor with explicit complex arithmetic for d = (1/3,1/3)
const F2 = (h, k) => { const ph = 2 * Math.PI * (h + k) / 3; return (1 + Math.cos(ph)) ** 2 + Math.sin(ph) ** 2; };
ok('Aug P1 independent |F|^2 ratio = 4', near(F2(2, 1) / F2(1, 1), 4, 1e-9));
// independent: two-atom basis f1 at 0, f2 at (1/2,1/2), f1 = 2 f2
const F1 = (h, k) => { const ph = Math.PI * (h + k); return (2 + Math.cos(ph)) ** 2 + Math.sin(ph) ** 2; };
ok('Jan P1 independent |F|^2 ratio = 1/9', near(F1(2, 1) / F1(1, 1), 1 / 9, 1e-9));
// reciprocal lattice points inside the Ewald limiting sphere: count integers
let cnt = 0; { const nmax = Math.ceil(2 * 5 / 1.54) + 1, r2 = (2 * 5 / 1.54) ** 2; for (let x = -nmax; x <= nmax; x++) for (let y = -nmax; y <= nmax; y++) for (let z = -nmax; z <= nmax; z++) if (x * x + y * y + z * z <= r2) cnt++; }
ok('Ewald sphere count by brute force ~ estimate', near(g('lattice', 'c3').N, cnt, 0.05), `estimate ${g('lattice', 'c3').N.toFixed(0)} vs counted ${cnt}`);
// BaTiO3 structure factor by explicit complex sum (HS20 key: S(110) = 8 fO, ratio I(200)/I(110) = 2.25)
const S = (h, k, l) => { const atoms = [[5, 0, 0, 0], [4, .5, .5, .5], [1, .5, .5, 0], [1, .5, 0, .5], [1, 0, .5, .5]]; let re = 0, im = 0; for (const [f, x, y, z] of atoms) { const ph = 2 * Math.PI * (h * x + k * y + l * z); re += f * Math.cos(ph); im += f * Math.sin(ph); } return Math.hypot(re, im); };
ok('BaTiO3 S(110) = 8 (HS20 key)', near(b('lattice', 'b1').S110, 8, 1e-9) && near(S(1, 1, 0), 8, 1e-9));
ok('BaTiO3 S(200) = 12', near(b('lattice', 'b1').S200, 12, 1e-9) && near(S(2, 0, 0), 12, 1e-9));
ok('BaTiO3 I ratio 2.25 (HS20 key)', near(b('lattice', 'b1').Iratio, 2.25, 1e-9) && near((S(2, 0, 0) / S(1, 1, 0)) ** 2, 2.25, 1e-9));
ok('BaTiO3 S(100) = 0 for fBa=5,fTi=4,fO=1', S(1, 0, 0) < 1e-9);
ok('BaTiO3 (110) Bragg angle 15.8 deg', near(b('lattice', 'b1').th110, 15.8, 2e-3));
ok('BaTiO3 BZ volume (2 pi/a)^3 = 3.876', near(b('lattice', 'b1').VBZ, 3.876, 1e-3));

// ---------------- Room 2: phonons ----------------
{
  const u = 1.66053906660e-27, M1 = 22.99 * u, M2 = 35.45 * u, k = 15;
  const w = (q, a, sign) => { const s = k * (1 / M1 + 1 / M2); return Math.sqrt(s + sign * Math.sqrt(s * s - (2 * k * k / (M1 * M2)) * (1 - Math.cos(q * a)))); };
  const a = 5.64e-10, nu = (om) => om / (2 * Math.PI) / 1e12;
  ok('chain: optical q=0 from full dispersion', near(g('phonon', 'c1').nuopt0, nu(w(0, a, 1)), 1e-6));
  ok('chain: acoustic top q=pi/a from full dispersion', near(g('phonon', 'c1').nuac, nu(w(Math.PI / a, a, -1)), 1e-6));
  ok('chain: optical bottom q=pi/a from full dispersion', near(g('phonon', 'c1').nuop, nu(w(Math.PI / a, a, 1)), 1e-6));
  const q = 1e-4 * Math.PI / a, vnum = w(q, a, -1) / q;
  ok('chain: sound velocity from numerical slope', near(g('phonon', 'c1').v, vnum, 1e-4), `${g('phonon', 'c1').v.toFixed(1)} vs ${vnum.toFixed(1)}`);
  // group velocity vanishes at the zone edge (numerical derivative)
  const dq = 1e-3 * Math.PI / a, vg = (w(Math.PI / a + dq, a, -1) - w(Math.PI / a - dq, a, -1)) / (2 * dq);
  ok('chain: group velocity 0 at pi/a', Math.abs(vg) < 1e-3 * g('phonon', 'c1').v);
  ok('chain: 1 THz = 4.136 meV (hbar w for nu_opt0)', near(g('phonon', 'c1').hbarw, g('phonon', 'c1').nuopt0 * 4.1357, 1e-3));
  // boss: M2 = 3 M1 in units sqrt(k/M)
  const s3 = 1 + 1 / 3; const ww = (q2, sign) => Math.sqrt(s3 + sign * Math.sqrt(s3 * s3 - (2 / 3) * (1 - Math.cos(q2))));
  ok('boss chain: acoustic edge sqrt(2/3)', near(b('phonon', 'b1').wac, ww(Math.PI, -1), 1e-9));
  ok('boss chain: optical edge sqrt(2)', near(b('phonon', 'b1').wop, ww(Math.PI, 1), 1e-9));
  ok('boss chain: optical q=0', near(b('phonon', 'b1').wop0, ww(0, 1), 1e-9));
  const qq = 1e-4, vs = ww(qq, -1) / qq; // a = 1
  ok('boss chain: sound velocity in a sqrt(k/M)', near(b('phonon', 'b1').vs, vs, 1e-4));
}
// Copper: literature gamma = 0.505 mJ/mol/K^2 (free electron), Debye coefficient 1944/theta^3 J/mol/K^4
{
  const n = 8.47e28, c = g('phonon', 'c2'), nmol = n / NA;
  ok('Cu: free-electron E_F = 7.0 eV', near(c.EF, 7.0, 5e-3));
  ok('Cu: gamma_free = 0.505 mJ/mol K^2', near(c.gam / nmol * 1e3, 0.505, 5e-3), String(c.gam / nmol * 1e3));
  ok('Cu: beta = 1944/343^3 J/mol K^4', near(c.beta / nmol, 1943.8 / 343 ** 3, 2e-3));
  ok('Cu: crossover about 3.2 K', near(c.Tx, Math.sqrt(0.505e-3 / (1943.8 / 343 ** 3)), 3e-3));
  ok('Cu: Dulong-Petit = 3 R per mole', near(c.DP / nmol, 3 * 8.314462618, 1e-4));
}
// Debye function by numerical quadrature
{
  const debye = (t) => { const X = 1 / t, N = 20000; let s = 0; for (let i = 1; i <= N; i++) { const y = X * (i - 0.5) / N; s += y ** 4 * Math.exp(y) / (Math.exp(y) - 1) ** 2; } return 3 * t ** 3 * s * X / N; }; // C_V/(3 N kB) = 3 t^3 int y^4 e^y/(e^y-1)^2 dy
  ok('Debye integral at T/theta=0.05 = (4 pi^4/5) t^3 (script 2.79 / Dulong-Petit)', near(g('phonon', 'c3').fD2, debye(0.05), 5e-3), `${g('phonon', 'c3').fD2.toFixed(5)} vs ${debye(0.05).toFixed(5)}`);
  ok('Debye integral at high T -> 1', near(debye(10), 1, 2e-3));
  const fE = (x) => x * x * Math.exp(x) / (Math.exp(x) - 1) ** 2;
  ok('Einstein x=3: 0.4963', near(g('phonon', 'c3').fE1, fE(3), 1e-9) && near(fE(3), 0.4963, 1e-3));
  ok('Einstein x=20: ~ x^2 e^-x', near(g('phonon', 'c3').fE2, 400 * Math.exp(-20), 1e-6));
}
ok('neutron lambda 2.36 A -> 14.7 meV (81.8/lam^2)', near(g('phonon', 'c4').En, 81.81 / 2.36 ** 2, 3e-3));
ok('X-ray 2.36 A -> 5.25 keV (12.398/lam)', near(g('phonon', 'c4').Ex, 12.398 / 2.36, 1e-3));

// ---------------- Room 3: electrons ----------------
ok('metals A/B: S_A/S_B = 2^(-2/3) (Jan key)', near(g('fermi', 'c1').SAB, 2 ** (-2 / 3), 1e-9));
ok('metals A/B: nu_A/nu_B = 2^(-1/3) (Jan key)', near(g('fermi', 'c1').nuAB, 2 ** (-1 / 3), 1e-9));
ok('metals A/B: c_V,A/c_V,B = 2^(-1/3) (Jan key)', near(g('fermi', 'c1').cvAB, 2 ** (-1 / 3), 1e-9));
ok('Cu k_F = 1.36 A^-1 (Ashcroft-Mermin 1.36)', near(g('fermi', 'c1').kFA, 1.36, 3e-3));
ok('Cu E_F = 7.00 eV (Ashcroft-Mermin 7.00)', near(g('fermi', 'c1').EFA, 7.0, 5e-3));
ok('c_V(10 K) = gamma T', near(g('fermi', 'c1').cvA, 70.71 * 10, 2e-3));
ok('HS20 MC (m): E_F(5e22 cm^-3) = 4.95 eV', near(g('fermi', 'c2').EF, 4.95, 1e-3));
ok('E_F of 5e22 cm^-3 is not any decoy 3.118 eV', Math.abs(g('fermi', 'c2').EF - 3.118) > 1);
ok('tight binding: m*/me = 3.81/(B a^2)', near(g('fermi', 'c3').mstar, 3.80998 / (1.0 * 9), 1e-3));
ok('NFE: gap = 2|U_G|', g('fermi', 'c3').Eg === 1);
// independent: numerical diagonalisation of the 1D central equation with 2 plane waves at the zone boundary, and 4 waves at M in 2D (HS20 key E+- = hbar^2 pi^2/(m a^2) +- U0, Eg = 2 U0)
{
  const a = 4.0e-10, U0 = 0.5, E0 = hbar ** 2 * Math.PI ** 2 / (me * a * a) / e;
  // 4 plane waves at M: 0, (1,0), (0,1), (1,1) times 2pi/a; U couples states differing by (+-1,+-1)
  const k = (m, n) => { const kx = Math.PI / a * (1 - 2 * m), ky = Math.PI / a * (1 - 2 * n); return hbar ** 2 * (kx * kx + ky * ky) / (2 * me) / e; };
  const st = [[0, 0], [1, 0], [0, 1], [1, 1]];
  const H = st.map((s) => st.map((t) => (s === t ? k(...s) : (Math.abs(s[0] - t[0]) === 1 && Math.abs(s[1] - t[1]) === 1 ? U0 : 0))));
  // Jacobi eigenvalues of a symmetric 4x4
  const A = H.map((r) => r.slice()); const nn = 4;
  for (let sweep = 0; sweep < 60; sweep++) for (let p = 0; p < nn; p++) for (let qd = p + 1; qd < nn; qd++) {
    if (Math.abs(A[p][qd]) < 1e-15) continue;
    const th = 0.5 * Math.atan2(2 * A[p][qd], A[qd][qd] - A[p][p]), c = Math.cos(th), s = Math.sin(th);
    for (let i = 0; i < nn; i++) { const x = A[i][p], y = A[i][qd]; A[i][p] = c * x - s * y; A[i][qd] = s * x + c * y; }
    for (let i = 0; i < nn; i++) { const x = A[p][i], y = A[qd][i]; A[p][i] = c * x - s * y; A[qd][i] = s * x + c * y; }
  }
  const ev = [0, 1, 2, 3].map((i) => A[i][i]).sort((x, y) => x - y);
  ok('M-point: 4x4 eigenvalues are E0-U0 (x2), E0+U0 (x2)', near(ev[0], E0 - U0, 1e-6) && near(ev[1], E0 - U0, 1e-6) && near(ev[2], E0 + U0, 1e-6) && near(ev[3], E0 + U0, 1e-6), ev.map((x) => x.toFixed(4)).join(' '));
  ok('M-point boss: E+ and E- and gap', near(b('fermi', 'b1').Ep, E0 + U0, 1e-6) && near(b('fermi', 'b1').Em, E0 - U0, 1e-6) && near(b('fermi', 'b1').Eg, 2 * U0, 1e-9));
}

// ---------------- Room 4: transport ----------------
{
  const c = g('drift', 'c1');
  ok('Cu: tau = 25 fs', near(c.tau, 2.5e-14, 0.02));
  ok('Cu: v_F = 1.57e6 m/s (Ashcroft-Mermin 1.57)', near(c.vF, 1.57e6, 3e-3));
  ok('Cu: mean free path ~ 39 nm', near(c.ell, 39, 0.02));
  ok('Cu: Lorenz number pi^2/3 (kB/e)^2 = 2.44e-8', near(Math.PI ** 2 / 3 * (kB / e) ** 2, 2.443e-8, 1e-3) && near(c.kappa, 2.443e-8 * 300 / 1.7e-8, 1e-3));
  ok('Cu: R_H = -7.4e-11 (Ashcroft-Mermin: -0.74e-10)', near(c.RH, -7.4e-11, 5e-3));
}
ok('Jan 2b d): rho_A/rho_B = 2', g('drift', 'c2').r1 === 2);
ok('Jan 2b e): rho_A/rho_B = 4 (key)', g('drift', 'c2').r2 === 4);
ok('Jan 2b f): tau_A/tau_B = 1 (key)', near(g('drift', 'c2').tauratio, 1, 1e-9));
ok('Jan 2b g): n_d,A/n_d,B = 2^(1/3) (key)', near(g('drift', 'c2').ndratio, 2 ** (1 / 3), 1e-9));
ok('Jan 2b h): kappa_A/kappa_B = 1/2 (key)', g('drift', 'c2').kratio === 0.5);
// independent consistency: tau ~ 1/(vF nd) and rho = m/(n e^2 tau)
{
  const nr = 2, nd = 2 ** (1 / 3), tauR = 1 / (nr ** (-1 / 3) * nd) /* tau_A/tau_B = vF_B nd_B/(vF_A nd_A) */;
  const vFratioAB = nr ** (-1 / 3); // vF_A / vF_B
  const tauAB = 1 / (vFratioAB * nd);
  const rhoAB = nr / tauAB; // rho ~ 1/(n tau): rho_A/rho_B = n_B tau_B/(n_A tau_A)
  ok('defect scattering chain closes: rho_A/rho_B = 2', near(rhoAB, 2, 1e-9) && near(tauAB, 1, 1e-9) && tauR > 0);
}
{
  const c = g('drift', 'c3');
  ok('Hall: n = 5e21 m^-3 recovered', near(c.n, 5e21, 1e-3));
  ok('Hall: R_H negative (electrons)', c.RH < 0);
  ok('Hall: mu = 0.1 m^2/Vs', near(c.mu, 0.0999, 2e-3));
  ok('Hall: Cu Hall voltage 0.37 nV', near(c.UHcu, 0.368, 3e-3));
}
ok('RRR 1000: tau grows 1000x', near(g('drift', 'c4').tau0, 1000 * g('drift', 'c1').tau, 1e-9));
// pressure boss (HS23 Aug keys): 1.23, 1.23, 1.11, 1.11; 1.37; v 1.39; Theta 154 K; rho ratios 1 and 1.54
{
  const B = b('drift', 'b1');
  ok('Aug 2a: E_FB/E_FA = 1.23 (key)', near(B.EF, 1.23, 5e-3));
  ok('Aug 2a: nu_B/nu_A = 1/0.9 (key)', near(B.nu, 1 / 0.9, 1e-9));
  ok('Aug 2a: c_V,B/c_V,A = 1/0.9 (key)', near(B.cv, 1 / 0.9, 1e-9));
  ok('Aug 2b e): nu_ph ratio (1/0.9)^3', near(B.nuph, 1 / 0.729, 1e-9));
  ok('Aug 2b f): rho_B/rho_A = 1 (key)', near(B.rho, 1, 1e-9));
  ok('Aug 2b g): v_B/v_A = 1.39 (key)', near(B.v, 1.39, 3e-3));
  ok('Aug 2b h): Theta_D,B = 154 K (key)', near(B.Th, 154, 3e-3));
  ok('Aug 2b i): rho_A/rho_B = 1.54 (key)', near(B.rhoi, 1.54, 3e-3));
  // independent: k_F ~ 1/a, E_F ~ k_F^2, nu ~ m k_F / (pi^2 hbar^2), rho ~ 1/(kF^2 nu tau) with tau^-1 ~ 1/V0
  const kF = (a) => (3 * Math.PI ** 2 / a ** 3) ** (1 / 3);
  ok('free-electron scalings numerically', near(kF(0.9) / kF(1), 1 / 0.9, 1e-12) && near((kF(0.9) / kF(1)) ** 2, B.EF, 1e-9));
}

// ---------------- Room 5: semiconductors ----------------
{
  const c = g('semi', 'c1');
  ok('GaAs: E_g = 1.42 eV (key)', near(c.Eg, 1.42, 4e-3));
  ok('GaAs: Boltzmann factor ~ 2e-25 (key)', near(c.p, 2e-25, 0.1));
  ok('GaAs: B_e = 1.1 kT, B_h = 7.2 kT (key)', near(c.Be, 1.1e3, 0.03) && near(c.Bh, 7.2, 0.01));
  ok('GaAs: n_i ~ 2.15e12 m^-3 (key for 1.42 eV)', near(c.ni, 2.15e12, 0.06), c.ni.toExponential(3));
  ok('GaAs: mu - mid-gap = 36.9 meV (key)', near(c.mu, 36.9, 2e-3));
  ok('GaAs: sigma_i ~ 689 nS/m (key for 1.42 eV)', near(c.sig, 689e-9, 0.07), c.sig.toExponential(3));
  const d = g('semi', 'c2');
  ok('donor: E_d = 5.5 meV (key)', near(d.Ed, 5.5, 5e-3));
  ok('donor: r_d = 10.2 nm (key)', near(d.rd, 10.2, 2e-3));
  ok('donor: r_d/a ~ 18 (key)', near(d.ratio, 18, 5e-3));
}
// 1D semiconductor: numerical Fermi-Dirac integrals with the 1D DOS, root-find mu for n_e = n_h (Jan 2024 variant)
{
  const kT = kB * 300 / e, t = 0.5, tcb = t, tvb = t / 2, EG = 0.30, a = 4e-10;
  // substitution E = EG + s^2 : nu dE = 2 ds /(pi a sqrt(t))
  const integ = (f, smax = 12, N = 40000) => { let s = 0; const h = smax / N; for (let i = 0; i < N; i++) { const x = (i + 0.5) * h; s += f(x) * h; } return s; };
  const fd = (x) => 1 / (Math.exp(x) + 1);
  const ne = (mu) => integ((s) => 2 / (Math.PI * a * Math.sqrt(tcb)) * fd((EG + (s * Math.sqrt(kT)) ** 2 - mu) / kT) * Math.sqrt(kT), 10);
  const nh = (mu) => integ((s) => 2 / (Math.PI * a * Math.sqrt(tvb)) * fd((mu + (s * Math.sqrt(kT)) ** 2) / kT) * Math.sqrt(kT), 10);
  let lo = 0, hi = EG; for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2; if (ne(mid) > nh(mid)) hi = mid; else lo = mid; }
  const mu = (lo + hi) / 2, shift = (mu - EG / 2) * 1e3;
  ok('1D semi: intrinsic mu shift by FD root-finding = (kT/4) ln2', near(shift, g('semi', 'c3').dmu, 5e-3), `FD: ${shift.toFixed(3)} meV, formula ${g('semi', 'c3').dmu.toFixed(3)} meV (key text would give ${(2 * g('semi', 'c3').dmu).toFixed(3)})`);
  ok('1D semi: n_e analytic vs quadrature at mid-gap', near(ne(EG / 2), g('semi', 'c3').ne * 1, 0.02), `${ne(EG / 2).toExponential(3)} vs ${g('semi', 'c3').ne.toExponential(3)}`);
  ok('1D semi: n_h/n_e = sqrt(2) at mid-gap', near(g('semi', 'c3').nh / g('semi', 'c3').ne, Math.SQRT2, 1e-9));
  ok('1D semi: m* = hbar^2/(2 t a^2): 0.476 / 0.952', near(g('semi', 'c3').mcb, 0.476, 2e-3) && near(g('semi', 'c3').mvb, 0.952, 2e-3));
  // effective mass from finite differences of the cosine band
  const Ecb = (k) => EG - 2 * tcb * (Math.cos(k * a) - 1), dk = 1e7;
  const d2 = (Ecb(dk) - 2 * Ecb(0) + Ecb(-dk)) / dk ** 2 * e;
  ok('1D semi: m* from numerical curvature', near(hbar ** 2 / d2 / me, g('semi', 'c3').mcb, 1e-3));
}
{
  const B = b('semi', 'b1');
  ok('Aug P3: m_cb* = 0.381, m_vb* = 0.190 (hbar^2/(2 t a^2), t_vb = 2t)', near(B.mcb, 0.381, 2e-3) && near(B.mvb, 0.1905, 2e-3));
  ok('Aug P3: tau_e/tau_h = sqrt(2) at mid-gap (key: sqrt2 exp((EG-2mu)/kT))', near(B.tau, Math.SQRT2, 1e-9));
  ok('Aug P3: n_e/n_h = sqrt(t_vb/t_cb) = sqrt2', near(B.ne / B.nh, Math.SQRT2, 1e-9));
  // sigma = n e^2 tau/m*: with the printed tau_e/tau_h the two conductivities are equal
  ok('Aug P3: sigma_e/sigma_h = (n_e/n_h)(tau_e/tau_h)(m_h*/m_e*) = 1', near((B.ne / B.nh) * B.tau * (B.mvb / B.mcb), 1, 1e-3));
}
{
  const c = g('semi', 'c4');
  ok('Si: N_c = 2.8e19 cm^-3', near(c.Nc, 2.8e25, 0.03), c.Nc.toExponential(3));
  ok('Si: N_v = 1.04e19 cm^-3', near(c.Nv, 1.04e25, 0.03));
  ok('p-n: V ~ 0.8 V', near(c.V0, 0.79, 0.02));
  ok('p-n: d ~ 0.34 um (script quotes 1e2-1e4 A)', c.d > 0.01 && c.d < 1 && near(c.d, 0.336, 0.01));
  // independent: solve Poisson (piecewise) -> V = e/(2 eps)[Nd dn^2 + Na dp^2], Nd dn = Na dp
  const eps = 11.7 * 8.8541878128e-12, Na = 1e22, Nd = 1e23, d = c.d * 1e-6, dn = d * Na / (Na + Nd), dp = d * Nd / (Na + Nd);
  ok('p-n: widths satisfy Poisson (eq. 5.43) and neutrality (5.44)', near(e / (2 * eps) * (Nd * dn * dn + Na * dp * dp), c.V0, 1e-3) && near(Nd * dn, Na * dp, 1e-9));
  ok('p-n: d_p/d_n = N_d/N_a = 10', c.dpdn === 10);
}
{
  const c = g('semi', 'c5');
  ok('LED: 2.70 eV -> 459 nm', near(c.lam, 459.2, 1e-3));
  ok('LED: GaAs -> 873 nm', near(c.lamGaAs, 873, 2e-3));
  ok('LED: Sun Wien peak 502 nm -> Eg = 2.47 eV (astro room: 502 nm)', near(c.EgSun, 1239.84 / 502, 2e-3));
}

// ---------------- Room 6: magnetism ----------------
{
  const c = g('magnet', 'c1');
  ok('Na: E_F = 3.24 eV (Ashcroft-Mermin 3.24)', near(c.EF, 3.24, 2e-3));
  ok('chi_Pauli ~ 8e-6 (SI)', near(c.chiP, 8.3e-6, 0.02));
  ok('chi_Curie/chi_Pauli = 2 E_F/(3 kB T)', near(c.ratio, 2 * c.EF * e / (3 * kB * 300), 1e-9));
}
ok('Weiss T (honeycomb, J1=2, J2=-1.5, S=1) = -7.74 K', near(g('magnet', 'c2').TW, -1.0e-3 * e * 2 / (3 * kB), 1e-6));
ok('Weiss T (triangular) = 2 x honeycomb', near(g('magnet', 'c2').TWtri, 2 * g('magnet', 'c2').TW, 1e-9));
ok('Curie-Weiss chi/chi0 at 50 K', near(g('magnet', 'c2').chi, 50 / (50 + 7.7364), 1e-4));
// saturation field: independent numerical minimisation of the classical energy per spin and the exact two-spin quantum crossing
{
  const muB = 9.2740100783e-24, g_ = 2, S = 1, JAFmeV = 3.0, gmu = g_ * muB / e * 1e3; // meV/T
  const Esat = (B, JAF) => { // energy per spin E(theta) = -(1/2) JAF S^2 cos 2theta - g muB B S sin theta, minimise on a fine grid
    let best = 1e9, th = 0; for (let i = 0; i <= 20000; i++) { const t = (Math.PI / 2) * i / 20000; const E = -0.5 * JAF * S * S * Math.cos(2 * t) - gmu * B * S * Math.sin(t); if (E < best) { best = E; th = t; } } return th; };
  const findSat = (JAF) => { let lo = 1, hi = 400; for (let i = 0; i < 50; i++) { const mid = (lo + hi) / 2; if (Esat(mid, JAF) > Math.PI / 2 - 2e-4) hi = mid; else lo = mid; } return hi; };
  ok('classical canting minimisation: honeycomb saturation field', near(findSat(JAFmeV), g('magnet', 'c3').Hh, 2e-3), `${findSat(JAFmeV).toFixed(2)} T vs ${g('magnet', 'c3').Hh.toFixed(2)} T`);
  ok('classical canting minimisation: triangular saturation field', near(findSat(2 * JAFmeV), g('magnet', 'c3').Ht, 2e-3));
  // exact quantum: two S=1/2 spins, H = J S1.S2 - gmuB B (S1z+S2z) ; singlet -3J/4, triplet(m=1) J/4 - gmuB B -> crossing at gmuB B = J
  const J = 1.0; ok('exact two-spin crossing at g muB B = J: 8.64 T', near(J / gmu, g('magnet', 'c3').dimer, 1e-4));
  // known exact result: S=1/2 Heisenberg AF chain (Z=2) saturates at h = 2J = 2 Z J S  ->  formula 2*JAF*S with JAF = Z J
  ok('formula 2 Z J S reproduces the exact S=1/2 chain value 2J and square lattice 4J', near(2 * (2 * J) * 0.5, 2 * J, 1e-12) && near(2 * (4 * J) * 0.5, 4 * J, 1e-12));
  ok('printed key (8 J2 S, 16 J2 S) is exactly twice this result', near(8 * 1.5 * 1 / gmu, 2 * g('magnet', 'c3').Hh, 1e-3) && near(16 * 1.5 * 1 / gmu, 2 * g('magnet', 'c3').Ht, 1e-3));
}
ok('Fe: J = 16.9 meV from T_C = 1043 K (Z=8, S=1)', near(g('magnet', 'c4').J, 16.85, 3e-3));
{
  const B = b('magnet', 'b1');
  ok('Aug P4 (c): T_W = -(2J1+4J2) S(S+1)/(3kB) = 23.2 K', near(B.TWc, 23.21, 2e-3));
  ok('Aug P4 (e): T_W = -17.4 K (antiferromagnetic net)', near(B.TWe, -17.41, 2e-3));
  ok('Aug P4 (d): ground state energy per spin', near(B.E0, -3.15, 1e-9));
  ok('Aug P4 (f): H_sat = 8 J2 S/(g muB) = 51.8 T', near(B.Hsat, 51.83, 2e-3));
}

// ---------------- Room 7: degenerate core ----------------
{
  const c = g('deg', 'c1');
  ok('WD: n_e = 3.0e35 m^-3', near(c.ne, 2.99e35, 2e-3));
  ok('WD: E_F ~ 163 keV, = 7.03 eV x (n/nCu)^(2/3)', near(c.EF, 7.0328e-3 * (c.ne / 8.47e28) ** (2 / 3), 1e-3));
  ok('WD: T_F/T ~ 190 (degenerate)', near(c.deg, 189, 5e-3) && c.deg > 100);
  ok('WD: p_F/(m c) ~ 0.8 (mildly relativistic)', near(c.x, 0.8, 5e-3));
  // numerical check of the relativistic parameter via E_F relation: exact degenerate energy density transition
  ok('Choudhuri Fig 5.1: relativity sets in near 1e9 kg/m^3', c.x > 0.3 && c.x < 2);
}
{
  const c = g('deg', 'c2');
  ok('Cu degeneracy pressure 38 GPa and bulk modulus 64 GPa (free-electron literature 63.8)', near(c.PCu, 38.2, 5e-3) && near(c.BCu, 63.8, 5e-3));
  ok('Choudhuri (5.10): K1 = 1.00e7 / mu_e^(5/3) (1 % rounding)', near(c.K1, 1.00e7 / 2 ** (5 / 3), 0.02), String(c.K1));
  const n = 1e9 / (2 * 1.6735575e-27), EF = hbar ** 2 * (3 * Math.PI ** 2 * n) ** (2 / 3) / (2 * me);
  ok('WD pressure K1 rho^(5/3) = (2/5) n E_F', near(c.PWD, 0.4 * n * EF, 1e-6));
  ok('P ratio WD/Cu ~ (n ratio)^(5/3)', near(c.ratio, (n / 8.47e28) ** (5 / 3), 1e-2));
}
{
  const c = g('deg', 'c3');
  ok('WD: N = 3.6e56 electrons for 0.6 Msun', near(c.N, 3.56e56, 5e-3));
  ok('WD radius ~ 8.5e3 km, within 3 % of real 0.6 Msun WD (8700 km)', near(c.R, 8700, 0.03), String(c.R));
  ok('WD: dE/dR = 0 at the radius found (numerical derivative)', (() => { const E = (r) => c.A / r ** 2 - c.B / r, r = c.R * 1e3, h = r * 1e-6; return Math.abs((E(r + h) - E(r - h)) / (2 * h)) < 1e-6 * Math.abs(c.B / r ** 2); })());
  ok('WD: R is the minimum of E(R)', (() => { const E = (r) => c.A / r ** 2 - c.B / r, r = c.R * 1e3; return E(r) < E(0.9 * r) && E(r) < E(1.1 * r); })());
  ok('WD: R ~ M^(-1/3): 1.2 Msun radius', near(c.R12, c.R * 2 ** (-1 / 3), 1e-9));
  ok('WD: mean density ~ 5e8 kg/m^3', near(c.rhoWD, 4.7e8, 0.03));
}
{
  const c = g('deg', 'c4');
  ok('Chandrasekhar estimate within 20 % of exact 1.44', near(c.MCh, 1.44, 0.2), String(c.MCh));
  ok('Choudhuri (5.27) evaluates to 1.43-1.46 Msun', c.MChex > 1.42 && c.MChex < 1.47, String(c.MChex));
  // independent check: M_Ch = sqrt(3 pi)/2 * omega3 (hbar c/G)^(3/2) / (mu_e m_H)^2, omega3 = 2.018
  const G = 6.6743e-11, cc = 299792458, mH = 1.6735575e-27;
  ok('M_Ch from the Chandrasekhar form sqrt(3pi)/2*2.018*(hbar c/G)^1.5/(mu_e mH)^2', near(c.MChex, Math.sqrt(3 * Math.PI) / 2 * 2.018 * (hbar * cc / G) ** 1.5 / (2 * mH) ** 2 / 1.9884e30, 1e-3));
}
{
  const c = g('deg', 'c5');
  ok('radiation constant 7.566e-16', near(c.arad, 7.5657e-16, 1e-3));
  ok('CMB energy density 4.17e-14 J/m^3 (astro: 0.26 eV/cm^3)', near(c.ucmb, 4.172e-14, 2e-3) && near(c.ucmb / 1.602e-19 * 1e-6, 0.26, 0.01));
  ok('Cu mean sound velocity from Theta_D ~ 2.6 km/s', near(c.vs, 2620, 3e-3));
  ok('phonon c = 4u/T equals Debye beta T^3 (6.77 x 1000)', near(c.cph, 6.7748 * 1000, 1e-3));
  ok('phonon/photon heat capacity ratio = (3/2)(c/v)^3', near(c.R, 1.5 * (299792458 / c.vs) ** 3, 1e-9));
}
{
  const B = b('deg', 'b1');
  ok('boss: Cu T_F = 8.2e4 K', near(B.TF, 8.16e4, 3e-3));
  ok('boss: matches room values', near(B.EFWD, g('deg', 'c1').EF, 1e-9) && near(B.R, g('deg', 'c3').R, 1e-9) && near(B.MCh, g('deg', 'c4').MCh, 1e-9));
}

// ---------------- Room 1b: bonding ----------------
{
  const U = (R) => 4 * ((1 / R) ** 12 - (1 / R) ** 6); // sigma = 1, U0 = 1
  let lo = 0.9, hi = 2; for (let i = 0; i < 200; i++) { const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3; if (U(m1) < U(m2)) hi = m2; else lo = m1; }
  const Rm = (lo + hi) / 2;
  ok('LJ minimum by numerical minimisation = 2^(1/6) sigma (not 1.3 sigma)', near(g('bond', 'c1').Rmin, Rm * 3.4, 1e-6) && near(Rm, 1.1225, 1e-4));
  ok('LJ well depth -U0', near(U(Rm), -1, 1e-9) && g('bond', 'c1').Umin === -1);
  // bulk modulus by numerical second derivative of E(v) = 6 U(R), v = R^3/sqrt2
  const kB_ = 1.380649e-23, U0 = 121 * kB_, sig = 3.4e-10, E = (v) => 6 * U0 * U((Math.SQRT2 * v) ** (1 / 3) / sig);
  const v0 = (Rm * sig) ** 3 / Math.SQRT2, h = v0 * 1e-4, Bnum = v0 * (E(v0 + h) - 2 * E(v0) + E(v0 - h)) / h ** 2;
  ok('Ar bulk modulus = numerical v E\'\'(v)', near(g('bond', 'c1').B * 1e9, Bnum, 1e-4), `${(Bnum / 1e9).toFixed(3)} GPa`);
  ok('Ar cohesive 6 U0 = 63 meV (exp. 80 meV, lattice sums 8.6 U0)', near(g('bond', 'c1').Ecoh, 62.56, 1e-3));
  // NaCl Madelung constant by Evjen's method (cube of side 2L+1 with fractional edge charges)
  const evjen = (L) => { let a = 0; for (let x = -L; x <= L; x++) for (let y = -L; y <= L; y++) for (let z = -L; z <= L; z++) { if (!x && !y && !z) continue; const w = (Math.abs(x) === L ? 0.5 : 1) * (Math.abs(y) === L ? 0.5 : 1) * (Math.abs(z) === L ? 0.5 : 1); a += -((x + y + z) % 2 ? -1 : 1) * w / Math.hypot(x, y, z); } return a; };
  ok('NaCl Madelung constant by Evjen sum = 1.7476', near(evjen(10), 1.7476, 1e-3), evjen(10).toFixed(5));
  ok('NaCl Madelung energy 8.92 eV/pair (14.40 eV A x 1.7476/2.82)', near(g('bond', 'c2').UM, 14.3996 * 1.7476 / 2.82, 1e-4));
  ok('script Table 1.2 value 1.8e4 K does not follow from eq. 1.47', g('bond', 'c2').UMK / 2 > 2.5 * 1.8e4);
  // bulk modulus of the Born model by numerical second derivative
  const e_ = 1.602176634e-19, eps0 = 8.8541878128e-12, k = e_ * e_ / (4 * Math.PI * eps0), a = 1.7476, R0 = 2.82e-10, n = 8, C = a * k * R0 ** (n - 1) / n;
  const Up = (V) => { const R = (V / 2) ** (1 / 3); return -a * k / R + C / R ** n; }; // one pair, V = 2 R^3
  const V0 = 2 * R0 ** 3, hv = V0 * 1e-4, BB = V0 * (Up(V0 + hv) - 2 * Up(V0) + Up(V0 - hv)) / hv ** 2;
  ok('NaCl Born bulk modulus = numerical V U\'\'(V)', near(g('bond', 'c2').Bth * 1e9, BB, 1e-4), `${(BB / 1e9).toFixed(2)} GPa`);
  ok('NaCl lattice energy with n=8 is 7.8 eV (exp. 7.9)', near(g('bond', 'c2').Un, 7.81, 2e-3));
  let s1 = 0; for (let j = 1; j <= 2e6; j++) s1 += 2 * (j % 2 ? 1 : -1) / j;
  ok('1D Madelung sum = 2 ln 2', near(g('bond', 'c4').alpha, s1, 1e-5));
  ok('Kr boss: R_min 4.10 A, B 2.2 GPa', near(b('bond', 'b1').Rmin, 4.097, 1e-3) && near(b('bond', 'b1').B, 2.22, 0.01));
}

// ---------------- numbers quoted in lessons and quizzes ----------------
{
  const debye = (t) => { const X = 1 / t, N = 20000; let s = 0; for (let i = 1; i <= N; i++) { const y = X * (i - 0.5) / N; s += y ** 4 * Math.exp(y) / (Math.exp(y) - 1) ** 2; } return 3 * t ** 3 * s * X / N; };
  ok('lesson: T^3 law at T_D/10 = 0.078, exact Debye ~0.07', near(4 * Math.PI ** 4 / 5 * 1e-3, 0.078, 0.01) && Math.abs(debye(0.1) - 0.07) < 0.01, `exact ${debye(0.1).toFixed(4)}`);
  ok('lesson: BZ of 3x2 A rectangle = 6.6 A^-2', near((2 * Math.PI) ** 2 / 6, 6.58, 1e-3));
  ok('quiz: 460 nm -> 2.70 eV', near(1239.84 / 460, 2.70, 2e-3));
  ok('quiz: GaAs donor 13.6*0.067/12.9^2 = 5.5 meV', near(13.6057 * 0.067 / 12.9 ** 2 * 1e3, 5.5, 0.01));
  ok('quiz: Cu free-electron bulk modulus 64 GPa', near(g('deg', 'c2').BCu, 64, 0.01));
  ok('lesson: WD/Cu Fermi energy ratio ~2.3e4', near(g('deg', 'c1').EF * 1e3 / 7.03, 2.3e4, 0.02));
  ok('quiz: phonon/photon heat capacity ~1e15', g('deg', 'c5').R > 1e15 && g('deg', 'c5').R < 1e16);
  ok('quiz: pressure a -> 0.9a: E_F x1.23', near(1 / 0.81, 1.23, 4e-3));
}
console.log(fails ? `\n${fails} FAILED` : '\nall solid-state content checks passed');
process.exit(fails ? 1 : 0);
