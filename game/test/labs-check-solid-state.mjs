import * as S from '../src/labs-ext/models-solid-state.js';
let fails = 0; const ok = (n, c, x = '') => { console.log(`${c ? 'PASS' : 'FAIL'} ${n} ${x}`); if (!c) fails++; };
const near = (a, b, r = 1e-3) => Math.abs(a / b - 1) < r;
// two-site: direct eigenvalues of [[e,-t],[-t,e]]
{ const m = S.twoSite(1.3, 0, 0.5); ok('two-site: eps -/+ t', near(m.Eb, -0.8, 1e-12) && near(m.Ea, 1.8, 1e-12));
  const D = S.twoSite(1, 2); ok('detuned: trace and det of H', near(D.Eb + D.Ea + 1e-9, 1e-9 + 0, 1) || Math.abs(D.Eb + D.Ea) < 1e-12);
  const tr = D.Eb * D.Ea, det = (1) * (-1) - 1; ok('detuned: det H = -D^2/4 - t^2', near(tr, det, 1e-12)); // eps1 eps2 - t^2 = -1 - 1
  ok('bonding orbital symmetric for D=0', near(m.vb[0], m.vb[1], 1e-9)); ok('ionic: weight on lower level', S.twoSite(0.2, 5).vb[1] ** 2 > 0.9);
  ok('hopping decays exponentially', near(S.hop(2) / S.hop(1), Math.exp(-1 / 0.8), 1e-12));
  const de = S.equilibrium(0), e = (d) => S.bondEnergy(d); ok('equilibrium is a minimum', e(de) < e(de - 0.02) && e(de) < e(de + 0.02), de.toFixed(3)); }
// Fermi gas
ok('Cu E_F = 7.0 eV', near(S.fermiEnergy(8.47e28) / S.K.eV, 7.0, 0.01), (S.fermiEnergy(8.47e28) / S.K.eV).toFixed(3));
ok('Cu T_F ~ 8e4 K', near(S.fermiT(8.47e28), 8.2e4, 0.03), S.fermiT(8.47e28).toExponential(3));
ok('crossover density: p_F = m c', near(S.pF(S.nCross()), S.K.me * S.K.c, 1e-9) && S.nCross() > 1e35 && S.nCross() < 1e36, S.nCross().toExponential(2));
ok('NR limit: exact pressure = 2/5 n E_F (Cu)', near(S.pressure(8.47e28), S.pressureNR(8.47e28), 1e-3));
ok('UR limit: exact pressure -> (hbar c/4)(3pi^2)^{1/3} n^{4/3}', near(S.pressure(1e42), S.pressureUR(1e42), 1e-3));
ok('rel. E_F(kin) -> NR at low n, -> p_F c at high n', near(S.fermiEnergyRel(1e28), S.fermiEnergy(1e28), 1e-4) && near(S.fermiEnergyRel(1e46), S.pF(1e46) * S.K.c, 1e-2));
ok('white dwarf degenerate T/T_F < 0.1, Cu 300K', 1e7 / S.fermiT(3e35) < 0.1 && 300 / S.fermiT(8.47e28) < 0.01);
// NFE: direct plane-wave diagonalisation
{ const a = 4, U = 0.8, ge = Math.PI / a, b = S.nfeBands(ge, a, U), free = S.edgeEnergy(a);
  ok('gap = 2|U_G| at the zone edge', near(b[1] - b[0], 2 * U, 2e-3), (b[1] - b[0]).toFixed(5));
  ok('edges at E0 -/+ U (small corrections from other waves)', near(b[0], free - U, 0.06) && near(b[1], free + U, 0.06));
  ok('U=0: lowest band is the folded free parabola', near(S.nfeBands(0.2, a, 0)[0], S.freeE(0.2), 1e-9) && near(S.nfeBands(ge, a, 0)[0], free, 1e-9));
  const dk = 0.01, E = (k) => S.nfeBands(ge + k, a, U); const d2 = (i) => (E(dk)[i] + E(-dk)[i] - 2 * E(0)[i]) / (dk * dk), mr = (i) => 2 * S.HB2M / d2(i);
  const m = S.nfeMassRatio(a, U); ok('2-wave effective mass, upper band', near(mr(1), m.upper, 0.1), mr(1).toFixed(3) + ' vs ' + m.upper.toFixed(3)); ok('lower band negative', mr(0) < 0 && near(mr(0), m.lower, 0.1), mr(0).toFixed(3) + ' vs ' + m.lower.toFixed(3)); }
// Ewald: circle condition vs Bragg law
{ const a = 1, lam = 0.8, d = a, th = Math.asin(lam / (2 * d)), phi = Math.atan2(Math.cos(th), -Math.sin(th)), e = S.ewald(a, a, lam, phi, 6, 1e-9), h = e.pts.find((q) => q.h === 1 && q.l === 0);
  ok('(1,0) on the Ewald circle at the Bragg angle', h.hit && Math.abs(h.res) < 1e-9);
  ok('printed 2 theta = 2 asin(lambda/2d)', near(h.twoTheta, 2 * th, 1e-9), (h.twoTheta * 180 / Math.PI).toFixed(3));
  const e2 = S.ewald(a, a, lam, phi + 0.3, 6, 1e-4); ok('rotating the crystal switches it off', !e2.pts.find((q) => q.h === 1 && q.l === 0).hit); }
{ const lm = 1.2, db = 1.5, th = Math.asin(lm / (2 * db)), phi = Math.atan2(-Math.sin(th), Math.cos(th)), e = S.ewald(1, 1.5, lm, phi, 8, 1e-9), h = e.pts.find((q) => q.h === 0 && q.l === 1);
  ok('rectangular lattice: (0,1) peak at Bragg angle with d=b', h.hit && near(h.twoTheta, 2 * th, 1e-9)); }
console.log(fails ? `${fails} FAILED` : 'all passed'); process.exit(fails ? 1 : 0);
