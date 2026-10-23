// Physics models for the interactive labs (pure functions, verified in test/labs-check.mjs).
export const K = { h: 6.62607015e-34, k: 1.380649e-23, c: 2.99792458e8, hbar: 1.054571817e-34, me: 9.1093837015e-31, eV: 1.602176634e-19, G_pc: 4.30091e-3 };

// ---- blackbody: Planck function with a scalable Planck constant ("what if h shrinks")
export const planck = (nu, T, hs = 1) => { const x = (K.h * hs * nu) / (K.k * T); return ((2 * K.h * hs * nu ** 3) / K.c ** 2) / Math.expm1(x); };
export const rayleighJeans = (nu, T) => (2 * K.k * T * nu * nu) / K.c ** 2;
export const wienLambda = (T) => 2.897771955e-3 / T;                 // m
export const planckPeakNu = (T, hs = 1) => (2.821439372 * K.k * T) / (K.h * hs); // Hz (peak of B_nu)

// ---- rotation curve with central mass and an r^-2 halo: M_r = k r + M0 (exam: Winter 2024 Q4)
export const vCirc = (r, M0, k) => Math.sqrt(K.G_pc * (k + M0 / r));   // r in pc, M0 in Msun, k in Msun/pc -> km/s
export const kFromPoint = (v, r, M0) => (v * v) / K.G_pc - M0 / r;

// ---- Friedmann: H0 = 1 units; returns {tau[], a[], age, crunch}
export function friedmann(Om, OL, Or = 0, tauMax = 7) {
  const Ok = 1 - Om - OL - Or;
  let a = 1e-4; const arg0 = Or / (a * a) + Om / a + Ok + OL * a * a;
  if (!(arg0 > 0)) return { tau: [], a: [], age: null, crunch: null, noBigBang: true, Ok };
  let v = Math.sqrt(arg0), tau = 0, age = null, crunch = null, next = 0.004, steps = 0;
  const T = [0], A = [a];
  while (tau < tauMax && steps++ < 2e6) {
    const acc = -Om / (2 * a * a) - Or / (a * a * a) + OL * a;
    // adaptive step: a fraction of the expansion time and of the time on which the velocity changes
    let dt = Math.min(2e-4, (2e-3 * a) / Math.max(Math.abs(v), 1e-9), (0.01 * Math.max(Math.abs(v), 1e-6)) / Math.max(Math.abs(acc), 1e-12));
    dt = Math.max(dt, 1e-10);
    // RK4 step of (a, v): a' = v, v' = acc(a)  (symplectic Euler was not accurate enough at tiny a)
    const f = (aa) => -Om / (2 * aa * aa) - Or / (aa * aa * aa) + OL * aa;
    const k1a = v, k1v = f(a), k2a = v + 0.5 * dt * k1v, k2v = f(a + 0.5 * dt * k1a), k3a = v + 0.5 * dt * k2v, k3v = f(a + 0.5 * dt * k2a), k4a = v + dt * k3v, k4v = f(a + dt * k3a);
    const aNew = a + (dt / 6) * (k1a + 2 * k2a + 2 * k3a + k4a); v += (dt / 6) * (k1v + 2 * k2v + 2 * k3v + k4v);
    if (age === null && a < 1 && aNew >= 1) { age = tau + (dt * (1 - a)) / (aNew - a); T.push(age); A.push(1); }
    a = aNew; tau += dt;
    if (a <= 1e-3 && v < 0) { crunch = tau; T.push(tau); A.push(Math.max(a, 0)); break; }
    if (a > 60) break;
    if (tau >= next) { T.push(tau); A.push(a); next += 0.004; }
  }
  return { tau: T, a: A, age, crunch, Ok, noBigBang: false };
}

// ---- diatomic chain (script 2.2): masses M1, M2, spring constant k, cell length a
export function chainOmega(q, M1, M2, k = 1, a = 1) {
  const s = k * (1 / M1 + 1 / M2), d = Math.sqrt(Math.max(0, s * s * 0 + k * k * ((1 / M1 + 1 / M2) ** 2 - (2 / (M1 * M2)) * (1 - Math.cos(q * a)))));
  return { ac: Math.sqrt(Math.max(0, s - d)), op: Math.sqrt(s + d) };
}
export const chainRatio = (q, M1, M2, k, a, omega) => (2 * k - M1 * omega * omega) / (2 * k * Math.cos((q * a) / 2) || 1e-9); // V/U

// ---- specific heat (per 3Nk): Debye and Einstein
export function debyeC(T, Th) {
  const x = Th / T, n = 400, h = x / n; let s = 0;
  const f = (t) => (t === 0 ? 0 : (t ** 4 * Math.exp(t)) / Math.expm1(t) ** 2);
  for (let i = 0; i <= n; i++) s += f(i * h) * (i === 0 || i === n ? 1 : i % 2 ? 4 : 2);
  return 3 * (T / Th) ** 3 * (s * h / 3);
}
export const einsteinC = (T, Th) => { const x = Th / T; return x * x * Math.exp(x) / Math.expm1(x) ** 2; };

// ---- free-electron gas
export const fermiEnergy = (n) => (K.hbar ** 2 / (2 * K.me)) * (3 * Math.PI ** 2 * n) ** (2 / 3); // J
export const dos = (E) => (K.me ** 1.5 * Math.sqrt(2 * Math.max(E, 0))) / (Math.PI ** 2 * K.hbar ** 3); // both spins, per volume and energy
export function chemPot(n, T) { // chemical potential from the density (numeric), J
  const EF = fermiEnergy(n); if (T <= 0) return EF;
  const kT = K.k * T, N = (mu) => { let s = 0; const emax = Math.max(mu, 0) + 40 * kT, m = 4000, de = emax / m; for (let i = 1; i <= m; i++) { const E = i * de; s += dos(E) / (Math.exp(Math.max(-700, Math.min(700, (E - mu) / kT))) + 1) * de; } return s; };
  let lo = -50 * kT - EF, hi = 2 * EF + 5 * kT; for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (N(mid) < n) lo = mid; else hi = mid; } return (lo + hi) / 2;
}

// ---- harmonic oscillator (hbar = m = omega = 1): eigenfunctions by recurrence
export function hoFunctions(x, nmax) {
  const psi = [Math.PI ** -0.25 * Math.exp((-x * x) / 2)]; if (nmax > 0) psi.push(Math.SQRT2 * x * psi[0]);
  for (let n = 1; n < nmax; n++) psi.push(Math.sqrt(2 / (n + 1)) * x * psi[n] - Math.sqrt(n / (n + 1)) * psi[n - 1]);
  return psi;
}
export function hoState(coeffs, xs, t) { // coeffs: [{n, re, im}] -> {re[], im[], dens[], xmean}
  const nmax = Math.max(...coeffs.map((c) => c.n)), re = new Array(xs.length).fill(0), im = new Array(xs.length).fill(0);
  xs.forEach((x, i) => { const f = hoFunctions(x, nmax); for (const c of coeffs) { const ph = -(c.n + 0.5) * t, cr = c.re * Math.cos(ph) - c.im * Math.sin(ph), ci = c.re * Math.sin(ph) + c.im * Math.cos(ph); re[i] += cr * f[c.n]; im[i] += ci * f[c.n]; } });
  const dx = xs[1] - xs[0], dens = re.map((r, i) => r * r + im[i] * im[i]); let xm = 0, nrm = 0; dens.forEach((d, i) => { xm += d * xs[i] * dx; nrm += d * dx; });
  return { re, im, dens, xmean: xm / nrm, norm: nrm };
}
export const coherentCoeffs = (alpha, phi, nmax = 28) => { const out = []; let fact = 1; const pre = Math.exp(-(alpha * alpha) / 2); for (let n = 0; n <= nmax; n++) { if (n > 0) fact *= Math.sqrt(n); const m = (pre * alpha ** n) / fact; out.push({ n, re: m * Math.cos(n * phi), im: m * Math.sin(n * phi) }); } return out; };

// ---- two-level system: H = [[-D/2, V],[V, D/2]]
export const twoLevel = (D, V) => ({ exact: [-0.5 * Math.hypot(D, 2 * V), 0.5 * Math.hypot(D, 2 * V)], second: [-D / 2 - (V * V) / D, D / 2 + (V * V) / D] });

// ---- 2D lattice, reciprocal lattice, first Brillouin zone (half-plane clipping), structure factor of a 2-atom basis
export function lattice2d(a, b, gammaDeg) {
  const g = (gammaDeg * Math.PI) / 180, a1 = [a, 0], a2 = [b * Math.cos(g), b * Math.sin(g)], A = a1[0] * a2[1] - a1[1] * a2[0];
  const b1 = [(2 * Math.PI * a2[1]) / A, (-2 * Math.PI * a2[0]) / A], b2 = [(-2 * Math.PI * a1[1]) / A, (2 * Math.PI * a1[0]) / A];
  return { a1, a2, A: Math.abs(A), b1, b2 };
}
export function voronoiCell(vecs, R = 1e3) { // cell around the origin: intersection of half-planes |p|^2 >= 2 p.v/2 ... p.v <= |v|^2/2
  let poly = [[-R, -R], [R, -R], [R, R], [-R, R]];
  for (const v of vecs) {
    const c = (v[0] * v[0] + v[1] * v[1]) / 2, out = [];
    for (let i = 0; i < poly.length; i++) {
      const P = poly[i], Q = poly[(i + 1) % poly.length], dp = P[0] * v[0] + P[1] * v[1] - c, dq = Q[0] * v[0] + Q[1] * v[1] - c;
      if (dp <= 0) out.push(P);
      if ((dp < 0 && dq > 0) || (dp > 0 && dq < 0)) { const t = dp / (dp - dq); out.push([P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1])]); }
    }
    poly = out; if (!poly.length) break;
  }
  return poly;
}
export const polyArea = (p) => { let s = 0; for (let i = 0; i < p.length; i++) { const q = p[(i + 1) % p.length]; s += p[i][0] * q[1] - q[0] * p[i][1]; } return Math.abs(s) / 2; };
export const intensity2 = (h, k, f1, f2) => f1 * f1 + f2 * f2 + 2 * f1 * f2 * ((h + k) % 2 === 0 ? 1 : -1); // basis (0,0) and (1/2,1/2)

// ================================================================== batch 2 models
const Gn = 6.674e-11, Msun = 1.989e30, Lsun = 3.828e26, mH = 1.6735e-27;
export const K2 = { G: Gn, Msun, Lsun, mH, mu0: 4e-7 * Math.PI, muB: 9.2740100783e-24, e: 1.602176634e-19 };

// ---- constant-density star: hydrostatic equilibrium, ideal gas or radiation pressure, eps ~ T^n
export const starR = (M, rho) => Math.cbrt((3 * M) / (4 * Math.PI * rho));
export const hydroP = (x, rho, R) => ((2 * Math.PI) / 3) * Gn * rho * rho * R * R * (1 - x * x);          // P(r), x = r/R
export const tempProfile = (x, rho, R, mu, rad = false) => {                                                 // T(r)
  const P = hydroP(x, rho, R); if (!rad) return (mu * mH * P) / (rho * K.k);
  const a = (4 * 5.670374419e-8) / K.c; return Math.pow((3 * P) / a, 0.25);                                  // P = a T^4 / 3
};
export const epsRatio = (x, n, rad = false) => Math.pow(Math.max(0, 1 - x * x), rad ? n / 4 : n);          // eps(r)/eps_c
export const radiusAtFraction = (f, n, rad = false) => Math.sqrt(1 - Math.pow(f, (rad ? 4 : 1) / n));      // r/R where eps = f eps_c

// ---- Eddington luminosity vs mass-luminosity relation (L in Lsun, M in Msun, kappa in m^2/kg)
export const eddington = (M, kappa) => (4 * Math.PI * K.c * Gn * M * Msun) / kappa / Lsun;
export const eddCross = (kappa, alpha) => Math.pow(eddington(1, kappa), 1 / (alpha - 1));   // M where M^alpha = L_Edd

// ---- Bloch-Gruneisen resistivity: rho_ph = A (T/Th)^5 * 4 J5(Th/T) so that rho_ph -> A T/Th for T >> Th
export function bgJ(y) { const n = 400, h = y / n, f = (x) => (x < 1e-6 ? x ** 3 : (x ** 5) / (Math.expm1(x) * (1 - Math.exp(-x)))); let s = f(0) + f(y); for (let i = 1; i < n; i++) s += f(i * h) * (i % 2 ? 4 : 2); return (s * h) / 3; }
export const rhoPhonon = (T, Th, A) => 4 * A * Math.pow(T / Th, 5) * bgJ(Th / T);
export const rhoTotal = (T, rho0, Th, A) => rho0 + rhoPhonon(T, Th, A);        // Matthiessen
export const hallCoeff = (n) => -1 / (n * K2.e);
export const drudeTau = (n, rho) => (K.me) / (n * K2.e * K2.e * rho);

// ---- 1D cosine bands (spin degeneracy 2), energies in eV, a in m, T in K
export const bandC = (k, a, EG, tc) => EG - 2 * tc * (Math.cos(k * a) - 1);
export const bandV = (k, a, tv) => 2 * tv * (Math.cos(k * a) - 1);
export const effMass = (t, a) => (K.hbar * K.hbar) / (2 * t * K2.e * a * a);             // kg
const fermi = (x) => 1 / (Math.exp(Math.max(-700, Math.min(700, x))) + 1);
export function carriers1d(mu, T, a, EG, tc, tv, N = 1500) {                                // densities per length (1/m)
  const kT = (K.k * T) / K2.e, dk = Math.PI / a / N; let n = 0, p = 0;
  for (let i = 0; i < N; i++) { const k = (i + 0.5) * dk; n += fermi((bandC(k, a, EG, tc) - mu) / kT); p += fermi((mu - bandV(k, a, tv)) / kT); }
  const pref = (2 * 2 * dk) / (2 * Math.PI); return { n: n * pref, p: p * pref };
}
export function muIntrinsic(T, a, EG, tc, tv) { let lo = -1, hi = EG + 1; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2, c = carriers1d(m, T, a, EG, tc, tv, 600); if (c.n > c.p) hi = m; else lo = m; } return (lo + hi) / 2; }

// ---- Curie-Weiss from exchange (H = -sum J S_i.S_j, J in meV, z neighbours): mean-field Weiss temperature in K
export const weissT = (S, J1, J2, z1 = 6, z2 = 12) => ((2 * S * (S + 1)) / (3 * K.k)) * (z1 * J1 + z2 * J2) * 1e-3 * K2.e;
export const curieC = (S, n = 1e28, g = 2) => (K2.mu0 * n * g * g * K2.muB * K2.muB * S * (S + 1)) / (3 * K.k);   // K
export const chiInv = (T, S, Tw, n = 1e28) => (T - Tw) / curieC(S, n);

// ---- spin 1/2 in a field: <S>/(hbar/2) precesses about n with angular velocity w = gamma B (Rodrigues rotation by angle -w t)
export function spinExp(theta, phi, w, nvec, t) {
  const v = [Math.sin(theta) * Math.cos(phi), Math.sin(theta) * Math.sin(phi), Math.cos(theta)], a = -w * t, c = Math.cos(a), s = Math.sin(a);
  const [nx, ny, nz] = nvec, cr = [ny * v[2] - nz * v[1], nz * v[0] - nx * v[2], nx * v[1] - ny * v[0]], dt = nx * v[0] + ny * v[1] + nz * v[2];
  return [0, 1, 2].map((i) => v[i] * c + cr[i] * s + nvec[i] * dt * (1 - c));
}
