import * as A from '../src/labs-ext/models-astro.js';
let fails = 0; const ok = (n, c, x = '') => { console.log(`${c ? 'PASS' : 'FAIL'} ${n} ${x}`); if (!c) fails++; };
const near = (a, b, r = 1e-3) => Math.abs(a / b - 1) < r;
ok('thin: I ~ I0 + (S-I0) tau', near(A.Itau(1e-4, 0.2, 1) - 0.2, 0.8e-4, 1e-3));
ok('thick: I -> S', near(A.Itau(30, 0.2, 1), 1, 1e-9));
ok('tau=0: I = I0', A.Itau(0, 0.7, 1) === 0.7);
ok('linear S: thick I -> S0+S1(tau-1)', near(A.Itau(30, 0, 1, 0.1), 1 + 0.1 * 29, 1e-9));
ok('curve of growth linear: W ~ sqrt(pi) tau0', near(A.equivWidth(1e-3), Math.sqrt(Math.PI) * 1e-3, 5e-3));
ok('curve of growth flat: W ~ 2 sqrt(ln tau0) for large tau0', near(A.equivWidth(1e4), 2 * Math.sqrt(Math.log(1e4)), 0.08), String(A.equivWidth(1e4)));
const RS = A.stromgrenR(1e49, 100) / 3.0857e18; ok('Stromgren R_S(Q=1e49,n=100,1e4K) ~ 3.1 pc (hand calc 3.15)', near(RS, 3.15, 0.02), RS.toFixed(3));
ok('R_S ~ n^-2/3, Q^1/3', near(A.stromgrenR(1e49, 1000) / A.stromgrenR(1e49, 100), Math.pow(10, -2 / 3), 1e-9) && near(A.stromgrenR(8e49, 100) / A.stromgrenR(1e49, 100), 2, 1e-9));
{ const f = A.stromgrenProfile(1e49, 100), i = f.r.findIndex((v) => v > 0.8), j = f.r.findIndex((v) => v > 1.2); ok('profile ionised inside, neutral outside, sharp edge', f.x[i] > 0.99 && f.x[j] < 0.05, `${f.x[i]} ${f.x[j]}`); const k = f.r.findIndex((v) => v > 1); ok('edge at R_S: x>0.5 at 0.95 R_S, <0.5 at 1.05', f.x[f.r.findIndex((v) => v > 0.95)] > 0.5 && f.x[f.r.findIndex((v) => v > 1.05)] < 0.5, String(f.x[k])); }
ok('recombination time n=1: ~1.2e5 yr', near(A.recombTime(1) / 3.156e7, 1.22e5, 0.03), String(A.recombTime(1) / 3.156e7));
const EG = A.gamowEG(1, 1, 1, 1); ok('E_G(pp) = 493 keV', near(EG, 493, 0.01), String(EG));
const E0 = A.gamowE0(EG, A.kT_keV(1.5e7)); ok('Gamow E_0 for the Sun ~ 6 keV', near(E0, 5.9, 0.03), String(E0));
ok('E_0 is the maximum of the integrand', (() => { const k = A.kT_keV(1.5e7); const f = (E) => A.gamowIntegrand(E, EG, k); return f(E0) > f(E0 * 0.9) && f(E0) > f(E0 * 1.1); })());
ok('nu(pp, Sun) ~ 3.9', near(A.gamowNu(EG, A.kT_keV(1.5e7)), 3.9, 0.04), String(A.gamowNu(EG, A.kT_keV(1.5e7))));
ok('nu(CNO N14+p, 1.5e7 K) ~ 20', A.gamowNu(A.gamowEG(7, 1, 14, 1), A.kT_keV(1.5e7)) > 15);
ok('Gamow width: Delta = 4 sqrt(E0 kT/3)', near(A.gamowWidth(EG, 1.3), 4 * Math.sqrt(A.gamowE0(EG, 1.3) * 1.3 / 3), 1e-9));
ok('white dwarf M_Ch(mu_e=2) = 1.456 within 3% (numerical)', near(A.wdLimit(2), 1.456, 0.03), String(A.wdLimit(2)));
ok('M_Ch ~ (2/mu_e)^2: mu_e=2.15', near(A.wdLimit(2.15) / A.wdLimit(2), (2 / 2.15) ** 2, 0.02));
{ const a = A.whiteDwarf(0.05, 2), b = A.whiteDwarf(0.1, 2); ok('non-relativistic R ~ M^-1/3', near(b.R / a.R, Math.pow(b.M / a.M, -1 / 3), 0.06), `${b.R / a.R} ${Math.pow(b.M / a.M, -1 / 3)}`); }
ok('1 Msun-ish WD radius ~ 5000-10000 km', (() => { const w = A.whiteDwarf(2.5, 2); return w.M > 0.8 && w.M < 1.1 && w.R > 4000 && w.R < 7000; })());
ok('n/p at 0.8 MeV = 0.199', near(A.npEq(0.8), 0.1986, 2e-3));
ok('n/p -> 1 at high T', near(A.npEq(1e3), 1, 2e-3));
{ const r = A.bbn({}); ok('Y ~ 0.25 (decay on)', Math.abs(r.Y - 0.25) < 0.015, String(r.Y)); ok('Y(no decay) = 0.33 at Tf = 0.8', near(r.Yno, 0.331, 5e-3)); ok('T_D in 0.05-0.09 MeV', r.TD > 0.05 && r.TD < 0.09, String(r.TD));
  ok('more neutrino species -> higher Tf and higher Y', A.bbn({ Nnu: 4 }).Tf > r.Tf && A.bbn({ Nnu: 4 }).Y > r.Y); ok('higher Tf -> higher Y', A.bbn({ Tf0: 1.0 }).Y > A.bbn({ Tf0: 0.8 }).Y); ok('g*(3)=10.75, t(1 MeV)=1.32 s', near(A.gstar(3), 10.75, 1e-9) && near(A.timeAtT(1), 1.32, 1e-9)); }
console.log(fails ? `${fails} FAILED` : 'all passed'); process.exit(fails ? 1 : 0);
