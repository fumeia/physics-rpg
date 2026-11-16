// Solid-state problem sets: every number quoted in a reference solution is recomputed here from the givens of the sheet,
// symbolic results are checked numerically (derivatives, eigenvalues, integrals), and every figure file exists.
// Usage: node test/sheets-check-solid-state.mjs
import { readFileSync, existsSync } from 'node:fs';
let fails = 0, n = 0; const ok = (name, c, x = '') => { n++; if (!c) { fails++; console.log(`FAIL ${name} ${x}`); } };
const near = (name, got, want, rel = 0.02) => ok(name, Math.abs(got - want) <= rel * Math.abs(want), `got ${got}, text says ${want}`);
const { sheets } = JSON.parse(readFileSync(new URL('../content/solid-state/sheets.json', import.meta.url)));
const enc = (s, q) => sheets.find((x) => x.n === s).questions.find((x) => x.q === q).enc;
const text = (s, q) => { const e = enc(s, q); return [e.goal, ...e.steps.map((t) => t.reveal), ...e.keyPoints].join(' '); };
const has = (s, q, str) => ok(`s${s}q${q} text has "${str}"`, text(s, q).includes(str));
const hbar = 1.054571817e-34, kB = 1.380649e-23, e = 1.602176634e-19, me = 9.1093837e-31, u = 1.66053907e-27, NA = 6.02214076e23, A = 1e-10;
const d2 = (f, x, h) => (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);
const integ = (f, a, b, N = 200000) => { let s = 0; const h = (b - a) / N; for (let i = 0; i < N; i++) s += f(a + (i + 0.5) * h); return s * h; };

// figures
for (const sh of sheets) for (const q of sh.questions) for (const t of [q.enc.goal, ...q.enc.steps.map((s) => s.reveal)])
  for (const m of t.matchAll(/<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"/g)) { ok(`${q.enc.id}: figure ${m[1]} exists`, existsSync(new URL('../' + m[1], import.meta.url))); ok(`${q.enc.id}: figure has alt text`, m[2].length > 20); }
ok('27 questions in 9 sheets', sheets.length === 9 && sheets.reduce((a, s) => a + s.questions.length, 0) === 27);

// sheet 1 Q1: allowed rotations
{ const allowed = []; for (let nn = 1; nn <= 12; nn++) { const m = 1 - 2 * Math.cos(2 * Math.PI / nn); if (Math.abs(m - Math.round(m)) < 1e-9) allowed.push(nn); } ok('s1q1 n = 1,2,3,4,6', allowed.join() === '1,2,3,4,6', allowed.join()); }
// sheet 2 Q1: BCC primitive cell and reciprocal vectors (a = 1)
{ const a1 = [-.5, .5, .5], a2 = [.5, -.5, .5], a3 = [.5, .5, -.5];
  const cross = (p, q) => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]], dot = (p, q) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
  const V = dot(a1, cross(a2, a3)); near('s2q1 primitive volume a^3/2', V, 0.5, 1e-9);
  const b1 = cross(a2, a3).map((x) => 2 * Math.PI * x / V), b2 = cross(a3, a1).map((x) => 2 * Math.PI * x / V), b3 = cross(a1, a2).map((x) => 2 * Math.PI * x / V);
  ok('s2q1 b1 = 2pi/a (0,1,1)', Math.abs(b1[0]) < 1e-9 && Math.abs(b1[1] - 2 * Math.PI) < 1e-9 && Math.abs(b1[2] - 2 * Math.PI) < 1e-9);
  near('s2q1 BZ volume = (4pi)^3/4', dot(b1, cross(b2, b3)), (4 * Math.PI) ** 3 / 4, 1e-9);
  near('s8q1 |G| = 2 sqrt2 pi / a', Math.hypot(...b1), 2 * Math.SQRT2 * Math.PI, 1e-9);
  // shortest reciprocal vector by brute force, densest planes rho = d / V
  let gmin = 1e9; for (let h = -3; h <= 3; h++) for (let k = -3; k <= 3; k++) for (let l = -3; l <= 3; l++) if (h || k || l) gmin = Math.min(gmin, Math.hypot(...[0, 1, 2].map((i) => h * b1[i] + k * b2[i] + l * b3[i])));
  near('s8q1 shortest G is a primitive one', gmin, Math.hypot(...b1), 1e-9); near('s8q1 rho = sqrt2/a^2', (2 * Math.PI / gmin) / V, Math.SQRT2, 1e-9); }
// sheet 2 Q3
{ const b1 = 13.4, b2 = 18.5, G = (h, k) => Math.hypot(h * b1, k * b2);
  near('s2q3 k = 2pi/lambda', 2 * Math.PI / 0.166, 37.9, 0.005); near('s2q3 G110', G(1, 1), 22.8, 0.005); near('s2q3 G200', G(2, 0), 26.7, 0.005); near('s2q3 G020', G(0, 2), 37.0, 0.005); near('s2q3 G210', G(2, 1), 32.6, 0.005);
  ok('s2q3 (210) before (020)', G(2, 1) < G(0, 2)); near('s2q3 d1', 2 * Math.PI / b1, 0.47, 0.01); near('s2q3 d2', 2 * Math.PI / b2, 0.34, 0.01); }
// sheet 3 Q1: Cr
{ const d200 = 1.5406 / (2 * Math.sin(32 * Math.PI / 180)); near('s3q1 d200', d200, 1.45, 0.005); near('s3q1 a', 2 * d200, 2.9, 0.01); has(3, 1, '1.45');
  const bcc = [[1, 1, 0], [2, 0, 0], [2, 1, 1], [2, 2, 0], [3, 1, 0]].map((v) => v.reduce((s, x) => s + x * x, 0)); ok('s3q1 BCC ratios 1:2:3:4:5', bcc.map((x) => x / bcc[0]).join() === '1,2,3,4,5');
  const two = (v) => 2 * Math.asin(1.5406 * Math.hypot(...v) / (2 * 2.88)) * 180 / Math.PI; near('s3q1 (200) at 2theta = 64', two([2, 0, 0]), 64, 0.02); }
// sheet 3 Q2: Lennard-Jones (eps = sigma = 1)
{ const U = (r) => 4 * (r ** -12 - r ** -6), r0 = 2 ** (1 / 6); near('s3q2 U(r0) = -eps', U(r0), -1, 1e-9); near('s3q2 kappa = 72/2^(1/3)', d2(U, r0, 1e-4), 72 / 2 ** (1 / 3), 1e-5); near('s3q2 kappa = 57', 72 / 2 ** (1 / 3), 57, 0.005); near('s3q2 r0 = 1.12 sigma', r0, 1.12, 0.005); }
// sheet 3 Q3: two delta wells, eigenvalues of the 2x2 matrix (V0 kappa = 1)
{ for (const al of [0.1, 0.5, 0.9]) { const E0 = -(0.5 + al * al), t = al; near(`s3q3 eps+ (alpha=${al})`, E0 - t, -(0.5 + al * al + al), 1e-12); ok('s3q3 bonding below eps0', E0 - t < -0.5 && E0 + t > -0.5); }
  // normalisation of sqrt(kappa) exp(-kappa|x|) and <1|V2|1> = -V0 kappa exp(-2 kappa d)
  near('s3q3 norm', integ((x) => Math.exp(-2 * Math.abs(x)), -30, 30), 1, 1e-4); }
// sheet 4 Q1
{ const M = (69.723 + 74.9216) * u, a = 5.65e-10 / 2, c = 4730; near('s4q1 M', M, 2.40e-25, 0.005); near('s4q1 C1 = 67 N/m', M * c * c / (a * a), 67, 0.01);
  // Fourier coefficient: int w^2 cos(nka) dk = -2 pi C_n / (M a), with C1 = 1, C2 = 0.3, M = a = 1
  const w2 = (k) => 2 * 1 * (1 - Math.cos(k)) + 2 * 0.3 * (1 - Math.cos(2 * k)); near('s4q1 C1 from the dispersion', -integ((k) => w2(k) * Math.cos(k), -Math.PI, Math.PI) / (2 * Math.PI), 1, 1e-6); near('s4q1 C2 from the dispersion', -integ((k) => w2(k) * Math.cos(2 * k), -Math.PI, Math.PI) / (2 * Math.PI), 0.3, 1e-6);
  near('s4q1 c^2 = a^2/M sum C_s s^2', w2(1e-4) / 1e-8, 1 + 0.3 * 4, 1e-6); }
// sheet 4 Q2, Q3: Einstein function limits
{ const f = (x) => x * x * Math.exp(x) / (Math.exp(x) - 1) ** 2; near('s4q2 high T -> 1', f(1e-3), 1, 1e-5); near('s4q2 low T -> x^2 e^-x', f(20), 400 * Math.exp(-20), 1e-6); near('s4q2 35 meV = 420 K', 0.035 * e / kB, 420, 0.04); near('s4q3 sqrt(7/6)', Math.sqrt(7 / 6), 1.08, 0.005); }
// sheet 5
{ near('s5q2 int x^2/(e^x-1) = 2 zeta(3)', integ((x) => x * x / Math.expm1(x), 1e-9, 60), 2.404, 0.001); near('s5q3 int x^3/(e^x-1) = pi^4/15', integ((x) => x ** 3 / Math.expm1(x), 1e-9, 60), Math.PI ** 4 / 15, 1e-5);
  near('s5q4 cos^2 average', integ((t) => Math.cos(t) ** 2 * Math.sin(t), 0, Math.PI) * 2 * Math.PI / (4 * Math.PI), 1 / 3, 1e-6);
  const ex = (1 / 3) * (8 * Math.PI ** 2) * (3 / 100); near('s5q4 exponent 0.79', ex, 0.79, 0.005); near('s5q4 exponent pi^2/12.5', ex, Math.PI ** 2 / 12.5, 1e-12); near('s5q4 D = 0.45', Math.exp(-ex), 0.45, 0.01); }
// sheet 6 Q1: count states on a k grid, 2D free electrons: N(E)/A = m E / (pi hbar^2)  (units hbar = m = 1, L = 400)
{ const L = 400, dk = 2 * Math.PI / L, kF = 1; let N = 0; const m = Math.ceil(kF / dk); for (let i = -m; i <= m; i++) for (let j = -m; j <= m; j++) if ((i * dk) ** 2 + (j * dk) ** 2 <= kF * kF) N += 2;
  near('s6q1 n2D = kF^2/2pi', N / (L * L), 1 / (2 * Math.PI), 0.01); let N1 = 0; for (let i = -m; i <= m; i++) if (Math.abs(i * dk) <= kF) N1 += 2; near('s6q1 n1D = 2kF/pi', N1 / L, 2 / Math.PI, 0.02); }
// sheet 7
{ const kF = Math.sqrt(2 * Math.PI * 3 / (2 * Math.PI ** 2)); near('s7q1 kF', kF, 0.98, 0.005); near('s7q1 kF = sqrt(3/pi)', kF, Math.sqrt(3 / Math.PI), 1e-12); ok('s7q1 circle crosses k1 = 0.5 but not k2 = 1, corners empty', kF > 0.5 && kF < 1 && kF < Math.hypot(0.5, 1)); near('s7q1 corner distance', Math.hypot(0.5, 1), 1.12, 0.005);
  // area check: 3 electrons per atom fill 1.5 zones
  near('s7q1 Fermi circle area = 1.5 zone areas', Math.PI * kF * kF, 1.5 * 2, 1e-9);
  const a = 4.23 * A, kD = 2 * Math.PI / a; near('s7q2 kD', kD, 1.49e10, 0.005); near('s7q2 hbar wD', hbar * kD * 1000 / e * 1000, 9.8, 0.01); const nn = 2 / a ** 3; near('s7q2 n', nn, 2.64e28, 0.005);
  const kf = (3 * Math.PI ** 2 * nn) ** (1 / 3); near('s7q2 kF', kf, 9.2e9, 0.005); near('s7q2 EF', hbar ** 2 * kf ** 2 / (2 * me) / e, 3.2, 0.02); ok('s7q2 kD > kF', kD > kf);
  const t = 1, tp = 0.2, E = (k) => -2 * t * Math.cos(k) - 2 * tp * Math.cos(2 * k); for (const k of [0, 0.7, Math.PI]) near(`s7q3 E'' at k=${k}`, d2(E, k, 1e-4), 2 * t * Math.cos(k) + 8 * tp * Math.cos(2 * k), 1e-5); }
// sheet 8
{ const a = 5.25 * A, r0 = a / Math.SQRT2; near('s8q2 r0', r0 / A, 3.712, 0.0005); const sig = r0 / 2 ** (1 / 6); near('s8q2 sigma', sig / A, 3.307, 0.0005);
  const U0 = 163 * kB, Om0 = a ** 3 / 4, uu = (Om) => { const r = (Math.SQRT2 * Om) ** (1 / 3); return 24 * U0 * ((sig / r) ** 12 - (sig / r) ** 6); };
  near('s8q2 Omega0', Om0, 3.62e-29, 0.005); near('s8q2 U0', U0, 2.25e-21, 0.005); const K = Om0 * d2(uu, Om0, Om0 * 1e-4); near('s8q2 K = 48 U0/Omega0 (numerical second derivative)', K, 48 * U0 / Om0, 1e-4); near('s8q2 K = 3.0 GPa', K, 3.0e9, 0.01);
  // equilibrium really at Omega0
  ok('s8q2 minimum at Omega0', uu(Om0) < uu(Om0 * 1.001) && uu(Om0) < uu(Om0 * 0.999)); }
// sheet 9 (own solution)
{ const nCu = 8960 * NA / 0.06355; near('s9q1 n', nCu, 8.49e28, 0.005); const tau = me / (nCu * e * e * 1.68e-8); near('s9q1 tau', tau, 2.5e-14, 0.01);
  const v = Math.sqrt(3 * kB * 300 / me); near('s9q1 v', v, 1.17e5, 0.005); near('s9q1 lambda', v * tau, 2.9e-9, 0.01);
  const vF = hbar * (3 * Math.PI ** 2 * nCu) ** (1 / 3) / me; near('s9q1 vF', vF, 1.57e6, 0.005); near('s9q1 lambda with vF', vF * tau, 39e-9, 0.01);
  // two-carrier Hall: solve the full linear Drude equations for both carriers with Jy = 0 and compare with the formula (small B)
  const ne = 2e21, nh = 5e21, mue = 0.3, muh = 0.05, B = 1e-4, Ex = 1;
  const vel = (sgn, mu, Ey) => { /* v = sgn mu (E + v x B): vx = s mu (Ex + vy B), vy = s mu (Ey - vx B) */ const s = sgn * mu, den = 1 + (s * B) ** 2; return [s * (Ex + s * B * Ey) / den, s * (Ey - s * B * Ex) / den]; };
  const Jy = (Ey) => -e * ne * vel(-1, mue, Ey)[1] + e * nh * vel(1, muh, Ey)[1]; let lo = -1, hi = 1; for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (Jy(lo) * Jy(mid) <= 0) hi = mid; else lo = mid; }
  const Ey = (lo + hi) / 2, Jx = -e * ne * vel(-1, mue, Ey)[0] + e * nh * vel(1, muh, Ey)[0], RH = Ey / (Jx * B), RHf = (nh * muh ** 2 - ne * mue ** 2) / (e * (nh * muh + ne * mue) ** 2);
  near('s9q2 R_H formula vs full Drude solution', RH, RHf, 1e-6); near('s9q2 Jx = e Ex (ne mue + nh muh)', Jx, e * Ex * (ne * mue + nh * muh), 1e-6); ok('s9q2 sign set by n mu^2 (here negative although nh > ne)', RH < 0 && nh > ne);
  ok('s9q2 both carriers deflected to -y at Ey = 0', vel(-1, mue, 0)[1] < 0 && vel(1, muh, 0)[1] < 0); }
console.log(`${n} checks`); console.log(fails ? `${fails} FAILED` : 'ALL OK'); process.exit(fails ? 1 : 0);
