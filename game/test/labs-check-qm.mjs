import * as Q from '../src/labs-ext/models-qm.js';
let fails = 0; const ok = (n, c, x = '') => { console.log(`${c ? 'PASS' : 'FAIL'} ${n} ${x}`); if (!c) fails++; };
const near = (a, b, r = 1e-6) => Math.abs(a - b) <= r * Math.max(1, Math.abs(b));
ok('Lande g: s1/2 = 2, p1/2 = 2/3, p3/2 = 4/3, d5/2 = 6/5', near(Q.landeG(0, .5), 2) && near(Q.landeG(1, .5), 2 / 3) && near(Q.landeG(1, 1.5), 4 / 3) && near(Q.landeG(2, 2.5), 6 / 5));
{ const l0 = Q.zeemanLevels(0); const p32 = l0.filter((x) => x.l === 1 && x.E > 1e-6), p12 = l0.filter((x) => x.l === 1 && x.E <= 1e-6), s = l0.filter((x) => x.l === 0);
  ok('B=0: 4 states at 3/2 xi (4.5e-5 eV), 2 at 0 for 2p1/2, 2 at 0 for 2s', p32.length === 4 && p12.length === 2 && s.length === 2 && p32.every((x) => near(x.E, 1.5 * Q.XI_HYD, 1e-9)) && near(1.5 * Q.XI_HYD, 4.5e-5)); }
{ const B = 1e-3, L = Q.zeemanLevels(B), E = (l, mj, hi) => { const a = L.filter((x) => x.l === l && x.mj === mj).map((x) => x.E).sort((p, q) => p - q); return hi ? a[a.length - 1] : a[0]; };
  ok('weak field: 2p3/2 m_j=3/2 line = 3/2 xi + 4/3*(3/2) mu_B B', near(E(1, 1.5), 1.5 * Q.XI_HYD + (4 / 3) * 1.5 * Q.MU_B * B, 1e-4));
  ok('weak field: 2p1/2 m_j=1/2 line = (2/3)(1/2) mu_B B', near(E(1, .5, false), (2 / 3) * .5 * Q.MU_B * B, 1e-3));
  ok('weak field: 2s m_j=-1/2 line = -mu_B B (g=2)', near(E(0, -.5), -Q.MU_B * B, 1e-9)); }
{ const B = 1e4, L = Q.zeemanLevels(B), got = L.map((x) => x.E / (Q.MU_B * B)).sort((a, b) => a - b), want = [-2, -1, -1, 0, 0, 0, 1, 1, 2].filter(() => true);
  const lines = [...new Set(got.map((v) => Math.round(v)))]; ok('strong field: lines at m_l+2m_s in {-2..2}', lines.join() === '-2,-1,0,1,2', lines.join());
  ok('strong field: energy/(mu_B B) of extreme level = +-2 within xi/(mu_B B)', near(got[0], -2, 1e-3) && near(got[7], 2, 1e-3)); }
ok('no avoided crossing violation: same-m_j levels differ', (() => { const L = Q.zeemanLevels(0.5), a = L.filter((x) => x.l === 1 && x.mj === .5).map((x) => x.E); return Math.abs(a[0] - a[1]) > 1e-7; })());
{ const t = Q.cgTable(.5, .5); const r = 1 / Math.SQRT2;
  ok('1/2 x 1/2: triplet and singlet CG = 1/sqrt2 with sign', near(t.cg(.5, -.5, 1, 0), r) && near(t.cg(-.5, .5, 1, 0), r) && near(t.cg(.5, -.5, 0, 0), r) && near(t.cg(-.5, .5, 0, 0), -r)); }
{ const t = Q.cgTable(1, .5); ok('1 x 1/2: <1 0;1/2 1/2|3/2 1/2> = sqrt(2/3), <1 0; 1/2 1/2|1/2 1/2> = sqrt(1/3)', near(t.cg(0, .5, 1.5, .5), Math.sqrt(2 / 3)) && near(t.cg(0, .5, .5, .5), -Math.sqrt(1 / 3)) && near(t.cg(1, -.5, .5, .5), Math.sqrt(2 / 3))); }
{ const t = Q.cgTable(1, 1); ok('1 x 1 singlet: 1/sqrt3 (+,-,+); <1 1;1 -1|2 0> = 1/sqrt6', near(t.cg(1, -1, 0, 0), 1 / Math.sqrt(3)) && near(t.cg(0, 0, 0, 0), -1 / Math.sqrt(3)) && near(t.cg(-1, 1, 0, 0), 1 / Math.sqrt(3)) && near(t.cg(1, -1, 2, 0), 1 / Math.sqrt(6))); }
for (const [a, b] of [[.5, .5], [1, .5], [1, 1], [1.5, .5], [1.5, 1], [1.5, 1.5]]) { const t = Q.cgTable(a, b); let orth = true, norm = true;
  for (let M = -(a + b); M <= a + b + 1e-9; M++) { const Js = t.Js.filter((J) => J >= Math.abs(M) - 1e-9); for (const J of Js) for (const K of Js) { const d = t.states[`${J},${M}`].reduce((s, x, i) => s + x * t.states[`${K},${M}`][i], 0); if (Math.abs(d - (J === K ? 1 : 0)) > 1e-9) orth = false; } }
  ok(`CG (${a},${b}) orthonormal`, orth); ok(`CG (${a},${b}) probabilities sum to 1 for all product states`, (() => { for (let m1 = -a; m1 <= a + 1e-9; m1++) for (let m2 = -b; m2 <= b + 1e-9; m2++) if (Math.abs(Q.cgProbs(a, b, m1, m2).reduce((s, q) => s + q.P, 0) - 1) > 1e-9) return false; return true; })()); }
ok('snapM keeps allowed values', Q.snapM(.5, 1) === 0 || Q.snapM(.5, 1) === 1, String(Q.snapM(.5, 1)));
// CHSH
{ const S = Q.chsh(Q.Esinglet, ...Object.values(Q.CHSH_OPT)); ok('CHSH optimal angles: |S| = 2 sqrt2', near(Math.abs(S), 2 * Math.SQRT2, 1e-9), S.toFixed(4));
  let mq = 0, ml = 0; const g = []; for (let i = 0; i < 16; i++) g.push((i * Math.PI) / 8 - Math.PI); // 22.5 deg grid
  for (const a of g) for (const a2 of g) for (const b of g) for (const b2 of g) { mq = Math.max(mq, Math.abs(Q.chsh(Q.Esinglet, a, a2, b, b2))); ml = Math.max(ml, Math.abs(Q.chsh(Q.Elhv, a, a2, b, b2))); }
  ok('brute force: quantum max = 2 sqrt2 (Tsirelson), never above', near(mq, 2 * Math.SQRT2, 1e-9), mq.toFixed(4)); ok('sawtooth LHV model: max |S| = 2 (classical bound)', near(ml, 2, 1e-9), ml.toFixed(4));
  ok('equal angles: S = -2', near(Q.chsh(Q.Esinglet, 0, 0, 0, 0), -2)); }
// packet
ok('Delta x(t) = sigma sqrt(1+(hbar t/(2 m sigma^2))^2)', near(Q.dxFree(2, 3, 5), 2 * Math.sqrt(1 + (3 * 5 / (2 * 4)) ** 2)) && near(Q.dxFree(1, 1, 0), 1));
ok('large t: Delta x -> hbar t/(2 m sigma)', near(Q.dxFree(1, 1, 1e6) / 1e6, .5, 1e-6));
ok('box: P1 = 0.360, P3 = 0.130, P2 = 1/2', near(Q.pBoxDouble(1), .3602, 1e-3) && near(Q.pBoxDouble(3), .1297, 1e-3) && Q.pBoxDouble(2) === .5 && Q.pBoxDouble(4) === 0);
ok('box: sum rule sum P_n = 1', near([...Array(4000).keys()].reduce((s, i) => s + Q.pBoxDouble(i + 1), 0), 1, 1e-4));
{ // independent numeric overlap check
  const N = 20000, c = (n) => { let s = 0; for (let i = 0; i < N; i++) { const x = (i + .5) / N; s += Math.sqrt(2) * Math.sin(Math.PI * x) * Math.sin(n * Math.PI * x / 2) / 1 / N; } return s; };
  ok('box P_n equals numeric overlap squared', [1, 2, 3, 5].every((n) => near(c(n) ** 2, Q.pBoxDouble(n), 1e-4))); }
console.log(fails ? `${fails} FAILED` : 'all passed'); process.exit(fails ? 1 : 0);
