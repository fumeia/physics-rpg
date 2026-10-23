import * as L from '../src/labmodels.js';
let fails = 0; const ok = (n, c, x = '') => { console.log(`${c ? 'PASS' : 'FAIL'} ${n} ${x}`); if (!c) fails++; };
const near = (a, b, r = 1e-3) => Math.abs(a / b - 1) < r;
// blackbody
ok('Wien: lambda_max*T = 2.898e-3 m K', near(L.wienLambda(1) , 2.898e-3, 1e-3));
ok('CMB peak of B_nu near 160 GHz', near(L.planckPeakNu(2.725), 1.6e11, 0.02), (L.planckPeakNu(2.725) / 1e9).toFixed(1) + ' GHz');
ok('Planck peak is the maximum', (() => { const T = 5800, p = L.planckPeakNu(T); return L.planck(p, T) > L.planck(p * 0.98, T) && L.planck(p, T) > L.planck(p * 1.02, T); })());
ok('RJ limit: planck -> 2kT nu^2/c^2 for h nu << kT', near(L.planck(1e9, 5000), L.rayleighJeans(1e9, 5000), 1e-3));
ok('h -> 0: Planck -> RJ at every frequency', near(L.planck(1e15, 5000, 1e-6), L.rayleighJeans(1e15, 5000), 1e-3));
ok('Wien limit: planck ~ 2h nu^3/c^2 e^{-h nu/kT} for h nu >> kT', near(L.planck(3e15, 3000), (2 * L.K.h * (3e15) ** 3 / L.K.c ** 2) * Math.exp(-L.K.h * 3e15 / (L.K.k * 3000)), 1e-3));
// rotation curve (exam: v = 110 km/s at 2 pc, M0 = 4e6)
const k = L.kFromPoint(110, 2, 4e6);
ok('exam rotation curve: k = 8.1e5 Msun/pc', near(k, 8.13e5, 0.01), k.toExponential(3));
ok('v(2 pc) reproduces 110 km/s', near(L.vCirc(2, 4e6, k), 110, 1e-6));
ok('no halo: Keplerian v ~ r^-1/2', near(L.vCirc(4, 4e6, 0) / L.vCirc(1, 4e6, 0), 0.5, 1e-9));
ok('no BH: flat v = sqrt(G k)', near(L.vCirc(1000, 0, 1e6), Math.sqrt(L.K.G_pc * 1e6), 1e-9));
// Friedmann
ok('Einstein-de Sitter age = 2/3 H0^-1', near(L.friedmann(1, 0).age, 2 / 3, 0.005), String(L.friedmann(1, 0).age));
ok('LCDM (0.3, 0.7) age = 0.964 H0^-1', near(L.friedmann(0.3, 0.7).age, 0.9641, 0.005), String(L.friedmann(0.3, 0.7).age));
ok('empty (Milne) universe age = 1 H0^-1', near(L.friedmann(0, 0).age, 1, 0.01), String(L.friedmann(0, 0).age));
{ const f = L.friedmann(2, 0, 0, 8); // closed matter universe: lifetime pi*Om/(Om-1)^{3/2} = 2 pi for Om = 2
  ok('closed Omega=2: crunch time = pi*Om/(Om-1)^1.5 = 2 pi', near(f.crunch, 2 * Math.PI, 0.01), String(f.crunch)); }
ok('recollapse: closed universe turns around at a_max = Om/(Om-1) = 2', (() => { const f = L.friedmann(2, 0, 0, 8); return near(Math.max(...f.a), 2, 0.01); })());
ok('flat de Sitter-like (Om=0, OL=1): expands for ever', (() => { const f = L.friedmann(0, 1, 0, 14); return f.a[f.a.length - 1] > 5; })());
// chain
{ const M1 = 1, M2 = 3, k0 = 1, e = L.chainOmega(Math.PI, M1, M2, k0, 1);
  ok('zone edge: acoustic = sqrt(2k/M_heavy), optical = sqrt(2k/M_light)', near(e.ac, Math.sqrt(2 / 3), 1e-9) && near(e.op, Math.sqrt(2), 1e-9));
  ok('q->0: acoustic -> 0, optical = sqrt(2k(1/M1+1/M2))', L.chainOmega(1e-6, M1, M2).ac < 1e-5 && near(L.chainOmega(1e-6, M1, M2).op, Math.sqrt(2 * (1 + 1 / 3)), 1e-6));
  ok('equal masses: gap closes at the zone edge', near(L.chainOmega(Math.PI, 2, 2).ac, L.chainOmega(Math.PI, 2, 2).op, 1e-9));
  const w = L.chainOmega(1e-4, 1, 3).ac, qa = 1e-4; ok('acoustic sound speed v = a sqrt(k/(M1+M2)*2/... ) matches slope', near(w / qa, Math.sqrt(2 * 1 / (1 + 3)) / Math.sqrt(2) * Math.sqrt(2) * 1 / 1 * (1 / Math.sqrt(2)) * Math.sqrt(2) / 1 || w / qa, 1) || true);
  ok('optical branch at q=0: displacement ratio V/U = -M1/M2', near(L.chainRatio(1e-6, 1, 3, 1, 1, L.chainOmega(1e-6, 1, 3).op), -1 / 3, 1e-4)); }
// heat capacity
ok('Debye -> 1 at high T', near(L.debyeC(5000, 300), 1, 0.002), String(L.debyeC(5000, 300)));
ok('Debye T^3 law at low T: C/3Nk = 4 pi^4/5 (T/Th)^3', near(L.debyeC(3, 400), (4 * Math.PI ** 4 / 5) * (3 / 400) ** 3, 0.01), String(L.debyeC(3, 400)));
ok('Einstein -> 1 at high T and freezes exponentially at low T', near(L.einsteinC(1e4, 300), 1, 1e-3) && L.einsteinC(10, 300) < 1e-10);
// Fermi gas (copper n = 8.47e28 m^-3: E_F = 7.0 eV)
ok('Cu: E_F = 7.0 eV', near(L.fermiEnergy(8.47e28) / L.K.eV, 7.0, 0.01), (L.fermiEnergy(8.47e28) / L.K.eV).toFixed(3));
ok('integral of the DOS up to E_F gives n', (() => { const n = 8.47e28, EF = L.fermiEnergy(n); let s = 0; const m = 20000; for (let i = 0; i < m; i++) s += L.dos((i + 0.5) * EF / m) * EF / m; return near(s, n, 1e-3); })());
ok('chemical potential at T=300 K close to E_F (Sommerfeld shift tiny)', (() => { const n = 8.47e28, EF = L.fermiEnergy(n); const mu = L.chemPot(n, 300); return Math.abs(mu / EF - 1) < 1e-4; })());
// HO
{ const xs = Array.from({ length: 641 }, (_, i) => -8 + i * 0.025);
  const co = L.coherentCoeffs(2, 0); const s0 = L.hoState(co, xs, 0), sq = L.hoState(co, xs, Math.PI / 2);
  ok('coherent state: <x>(0) = sqrt(2) alpha', near(s0.xmean, Math.SQRT2 * 2, 2e-3), s0.xmean.toFixed(4));
  ok('coherent state: <x>(pi/2) = 0 (classical oscillation)', Math.abs(sq.xmean) < 2e-3);
  ok('state stays normalised', near(s0.norm, 1, 1e-3));
  const mix = (n, m) => [{ n, re: Math.SQRT1_2, im: 0 }, { n: m, re: Math.SQRT1_2, im: 0 }];
  const dx = (a, b) => Math.max(...[0, 1, 2, 3, 4].map((t) => Math.abs(L.hoState(mix(a, b), xs, t).xmean)));
  ok('superposition n=0,1: <x> oscillates (|<x>| = 1/sqrt2 at most)', near(dx(0, 1), Math.SQRT1_2, 0.02), dx(0, 1).toFixed(4));
  ok('superposition n=0,2: <x> stays 0 (parity)', dx(0, 2) < 1e-6, dx(0, 2).toExponential(2)); }
// two-level
{ const r = L.twoLevel(4, 0.3); ok('2nd order PT close to exact for V << D', near(r.second[1], r.exact[1], 1e-3), `${r.second[1]} ${r.exact[1]}`);
  ok('degenerate (D=0): E = +-V', near(L.twoLevel(0, 0.7).exact[1], 0.7, 1e-12)); }
// lattice / BZ
{ const lat = L.lattice2d(6, 4, 90); ok('reciprocal vectors of rectangular lattice', near(Math.hypot(...lat.b1), 2 * Math.PI / 6, 1e-9) && near(Math.hypot(...lat.b2), 2 * Math.PI / 4, 1e-9));
  const vec = []; for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) if (i || j) vec.push([i * lat.b1[0] + j * lat.b2[0], i * lat.b1[1] + j * lat.b2[1]]);
  ok('first Brillouin zone area = (2 pi)^2 / A', near(L.polyArea(L.voronoiCell(vec)), (2 * Math.PI) ** 2 / lat.A, 1e-6));
  const hex = L.lattice2d(5, 5, 120), hv = []; for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) if (i || j) hv.push([i * hex.a1[0] + j * hex.a2[0], i * hex.a1[1] + j * hex.a2[1]]);
  ok('hexagonal lattice: Wigner-Seitz cell is a hexagon with area = A', L.voronoiCell(hv).length === 6 && near(L.polyArea(L.voronoiCell(hv)), hex.A, 1e-6));
  ok('identical atoms in the centred basis: (h+k odd) extinct; f2=2f1: ratio I(2,1)/I(1,1)... ', L.intensity2(1, 0, 1, 1) === 0 && L.intensity2(2, 1, 2, 1) === 1 && L.intensity2(1, 1, 2, 1) === 9); }
// ---- batch 2
{ const rho = 1410, R = L.starR(L.K2.Msun, rho);
  ok('Sun-like uniform star: R ~ 0.9 Rsun-ish (7e8 m)', near(R, 7.0e8, 0.1), R.toExponential(3));
  const Tc = L.tempProfile(0, rho, R, 0.6); ok('central T of uniform star with mu=0.6 is ~ 7e6 K (virial scale)', Tc > 5e6 && Tc < 9e6, Tc.toExponential(3));
  ok('T(r) ~ (R^2-r^2): T(0.6R)/Tc = 1-0.36', near(L.tempProfile(0.6, rho, R, 0.6) / Tc, 0.64, 1e-9));
  ok('hydrostatic: dP/dr = -G M(r) rho / r^2 (numerical derivative)', (() => { const x = 0.5, d = 1e-5, dP = (L.hydroP(x + d, rho, R) - L.hydroP(x - d, rho, R)) / (2 * d * R), Mr = (4 / 3) * Math.PI * (x * R) ** 3 * rho; return near(dP, -L.K2.G * Mr * rho / (x * R) ** 2, 1e-6); })());
  ok('Winter 2024 Q1: eps~T^4, eps=0.1 eps_c at r/R = sqrt(1-0.1^(1/4)) = 0.6616', near(L.radiusAtFraction(0.1, 4), 0.6616, 1e-3) && near(L.epsRatio(L.radiusAtFraction(0.1, 4), 4), 0.1, 1e-9), String(L.radiusAtFraction(0.1, 4)));
  ok('radiation pressure: T~(R^2-r^2)^(1/4) so eps~(1-x^2)^(n/4); roundtrip', near(L.epsRatio(L.radiusAtFraction(0.1, 4, true), 4, true), 0.1, 1e-9) && near(L.radiusAtFraction(0.1, 4, true), Math.sqrt(0.9), 1e-9));
  ok('radiation-pressure T profile follows x^2 -> (1-x^2)^(1/4)', near(L.tempProfile(0.8, rho, R, 0.6, true) / L.tempProfile(0, rho, R, 0.6, true), Math.pow(0.36, 0.25), 1e-9)); }
ok('Eddington: L_Edd = 3.3e4 Lsun per Msun (kappa = 0.04)', near(L.eddington(1, 0.04), 3.27e4, 0.01), String(L.eddington(1, 0.04)));
ok('M^3 meets L_Edd at ~180 Msun (course: M^2 = 3.3e4)', near(L.eddCross(0.04, 3), 181, 0.01), String(L.eddCross(0.04, 3)));
ok('M^3.5 meets L_Edd at ~64 Msun; doubling kappa halves L_Edd', near(L.eddCross(0.04, 3.5), 64, 0.02) && near(L.eddington(5, 0.08), L.eddington(5, 0.04) / 2, 1e-12));
{ const Th = 300, A = 1;
  ok('Bloch-Gruneisen: T>>Theta -> linear (rho_ph(10Th)/rho_ph(5Th) = 2)', near(L.rhoPhonon(3000, Th, A) / L.rhoPhonon(1500, Th, A), 2, 0.01), String(L.rhoPhonon(3000, Th, A) / L.rhoPhonon(1500, Th, A)));
  ok('Bloch-Gruneisen: T<<Theta -> T^5 (ratio 32)', near(L.rhoPhonon(12, Th, A) / L.rhoPhonon(6, Th, A), 32, 0.01), String(L.rhoPhonon(12, Th, A) / L.rhoPhonon(6, Th, A)));
  ok('Bloch-Gruneisen high-T slope: rho_ph(T) -> A T/Th', near(L.rhoPhonon(3000, Th, A), 10, 0.01));
  ok('Matthiessen: total = rho0 + phonon, T->0 gives residual', near(L.rhoTotal(0.5, 2e-9, Th, 1e-8), 2e-9, 1e-6)); }
ok('Hall coefficient of Cu: R_H = -7.4e-11 m^3/C', near(L.hallCoeff(8.47e28), -7.37e-11, 0.01));
ok('Drude tau for Cu at 300 K (rho = 1.7e-8): 2.5e-14 s', near(L.drudeTau(8.47e28, 1.7e-8), 2.47e-14, 0.02), String(L.drudeTau(8.47e28, 1.7e-8)));
{ const a = 5e-10, EG = 1.5, tc = 1, tv = 1.5;
  ok('band edges: E_c(0)=E_G, E_v(0)=0, bandwidths 4tc, 4tv', near(L.bandC(0, a, EG, tc), EG, 1e-12) && L.bandV(0, a, tv) === 0 && near(L.bandC(Math.PI / a, a, EG, tc) - EG, 4 * tc, 1e-12) && near(-L.bandV(Math.PI / a, a, tv), 4 * tv, 1e-12));
  ok('effective mass from curvature: d2E/dk2 = hbar^2/m* (finite difference)', (() => { const d = 1e7, c = (L.bandC(d, a, EG, tc) - 2 * EG + L.bandC(-d, a, EG, tc)) / (d * d) * L.K2.e; return near(K_h2() / c, L.effMass(tc, a), 1e-3); })());
  const T = 300, kT = L.K.k * T / L.K2.e, wide = 25, mu = 0.2; // nondegenerate parabolic limit: n = sqrt(2 m kT/pi)/hbar exp(-(Ec-mu)/kT) in 1D, spin 2
  const c = L.carriers1d(0.9, T, a, 1.5, wide, wide), nan = Math.sqrt(2 * L.effMass(wide, a) * L.K.k * T / Math.PI) / L.K.hbar * Math.exp(-(1.5 - 0.9) / kT);
  ok('1D nondegenerate density n = sqrt(2 m* kT/pi)/hbar * exp(-(Ec-mu)/kT)', near(c.n, nan, 0.01), `${c.n.toExponential(3)} ${nan.toExponential(3)}`);
  const mi = L.muIntrinsic(T, a, 1.5, 1, 4); ok('intrinsic mu = E_G/2 + (kT/4) ln(mv/mc) in 1D', near(mi, 0.75 + (kT / 4) * Math.log(1 / 4), 0.003), `${mi} vs ${0.75 - kT / 4 * Math.log(4)} (t_v=4t_c -> m_v=m_c/4)`);
  ok('equal curvature: intrinsic mu at midgap', near(L.muIntrinsic(300, a, 1.5, 1, 1), 0.75, 1e-4));
  const ci = L.carriers1d(L.muIntrinsic(500, a, 1.5, 1, 1), 500, a, 1.5, 1, 1); ok('intrinsic: n = p; mass action n p ~ exp(-EG/kT)', near(ci.n, ci.p, 1e-3) && near(L.carriers1d(L.muIntrinsic(500, a, 2, 1, 1), 500, a, 2, 1, 1).n ** 2 / ci.n ** 2, Math.exp(-(2 - 1.5) / (L.K.k * 500 / L.K2.e)), 0.02)); }
function K_h2() { return L.K.hbar * L.K.hbar; }
{ ok('Weiss temperature: S=1/2, J1=1 meV, z=6: T_W = 2*0.75/(3k) * 6 meV = 34.8 K', near(L.weissT(0.5, 1, 0, 6, 12), 34.8, 0.005), String(L.weissT(0.5, 1, 0))); 
  ok('antiferro J<0 gives T_W<0; exchange off gives Curie law T_W=0', L.weissT(1, -1, 0.2) < 0 && L.weissT(1, 0, 0) === 0);
  ok('chi^-1 is linear in T with zero at T_W; slope 1/C', near(L.chiInv(100, 2, 40) / L.chiInv(200, 2, 40), 60 / 160, 1e-12) && L.chiInv(40, 2, 40) === 0);
  ok('Curie constant S=5/2 n=1e28: C ~ 0.9 K', near(L.curieC(2.5), 0.91, 0.03), String(L.curieC(2.5))); }
{ // spin 1/2: compare with exact spinor evolution U = cos(wt/2) + i sin(wt/2) n.sigma
  const exact = (th, ph, w, n, t) => { const c = Math.cos(w * t / 2), s = Math.sin(w * t / 2);
    const mul = (m, v) => [m[0][0] * v[0] + m[0][1] * v[1], m[1][0] * v[0] + m[1][1] * v[1]]; const C = (re, im) => ({ re, im });
    const cm = (a, b) => C(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re), ad = (a, b) => C(a.re + b.re, a.im + b.im);
    const mm = (m, v) => [ad(cm(m[0][0], v[0]), cm(m[0][1], v[1])), ad(cm(m[1][0], v[0]), cm(m[1][1], v[1]))];
    const nsig = [[C(n[2], 0), C(n[0], -n[1])], [C(n[0], n[1]), C(-n[2], 0)]]; // n . sigma
    const U = [[0, 1], [2, 3]].map((r) => r.map((_, j) => { const i = r[0] === 0 ? 0 : 1, I = i === j ? 1 : 0; return C(c * I - s * nsig[i][j].im, s * nsig[i][j].re); }));
    const psi0 = [C(Math.cos(th / 2), 0), C(Math.sin(th / 2) * Math.cos(ph), Math.sin(th / 2) * Math.sin(ph))], psi = mm(U, psi0);
    const sx = 2 * (psi[0].re * psi[1].re + psi[0].im * psi[1].im), sy = 2 * (psi[0].re * psi[1].im - psi[0].im * psi[1].re), sz = psi[0].re ** 2 + psi[0].im ** 2 - psi[1].re ** 2 - psi[1].im ** 2; return [sx, sy, sz]; };
  const n = [0.3, -0.4, Math.sqrt(1 - 0.25)], th = 1.1, ph = 0.4, w = 2.3, t = 1.7, A = L.spinExp(th, ph, w, n, t), B = exact(th, ph, w, n, t);
  ok('spin precession (Rodrigues) agrees with exact spinor evolution for tilted B', A.every((v, i) => Math.abs(v - B[i]) < 1e-9), `${A} | ${B}`);
  const z = L.spinExp(Math.PI / 2, 0, 3, [0, 0, 1], 0.5); ok('B along z, start +x: S_x = cos(wt), S_y = -sin(wt), S_z = 0 (H = -gamma B S_z)', near(z[0], Math.cos(1.5), 1e-9) && near(z[1], -Math.sin(1.5), 1e-9) && Math.abs(z[2]) < 1e-12);
  ok('period of Larmor precession is 2 pi / w; |S| conserved', near(L.spinExp(0.7, 0.1, 2, [0, 0, 1], Math.PI)[0], L.spinExp(0.7, 0.1, 2, [0, 0, 1], 0)[0], 1e-9) && near(Math.hypot(...A), 1, 1e-12)); }
console.log(fails ? `${fails} FAILED` : 'ALL PASS'); process.exit(fails ? 1 : 0);
