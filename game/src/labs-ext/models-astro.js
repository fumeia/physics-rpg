// Pure physics models for the astrophysics labs (no DOM). SI inside Chandrasekhar; cgs / MeV elsewhere where noted.
const C = { c: 2.99792458e8, h: 6.62607015e-34, G: 6.6743e-11, me: 9.1093837e-31, mu: 1.66053907e-27, Msun: 1.98847e30, pc: 3.0857e16, kB_keV: 8.617333e-8, alpha: 1 / 137.035999, mpc2_keV: 938272.1, mnc2_keV: 939565.4 };
export { C };

// ---------- 1. radiative transfer: dI/dtau = S - I, S = S0 + S1 tau
export const Itau = (tau, I0, S0, S1 = 0) => I0 * Math.exp(-tau) + S0 * (1 - Math.exp(-tau)) + S1 * (tau - 1 + Math.exp(-tau));
// line profile: tau(x) = tau0 exp(-x^2), x = (nu-nu0)/dnu_D ; emergent intensity through a slab with constant S
export const lineTau = (x, tau0) => tau0 * Math.exp(-x * x);
// equivalent width in Doppler widths: W = integral (1 - e^{-tau(x)}) dx  (curve of growth)
export function equivWidth(tau0) { let s = 0; const n = 4000, L = 12; for (let i = 0; i < n; i++) { const x = -L + ((i + 0.5) * 2 * L) / n; s += (1 - Math.exp(-lineTau(x, tau0))) * (2 * L / n); } return s; }

// ---------- 2. Stromgren sphere (cgs)
export const alphaB = (T) => 2.6e-13 * Math.pow(T / 1e4, -0.7); // cm^3/s, case B
export const stromgrenR = (Q, n, T = 1e4) => Math.cbrt((3 * Q) / (4 * Math.PI * alphaB(T) * n * n)); // cm
export const recombTime = (n, T = 1e4) => 1 / (n * alphaB(T)); // s
// ionisation fraction profile x(r) by integrating photon budget + local balance; returns {r[], x[]} with r in units of R_S
export function stromgrenProfile(Q, n, T = 1e4, N = 400) {
  const sig = 6.3e-18, a = alphaB(T), RS = stromgrenR(Q, n, T), r = [], x = [];
  let Qr = Q, tau = 0; const dr = (1.4 * RS) / N;
  for (let i = 1; i <= N; i++) {
    const rr = i * dr, G = (sig * Qr) / (4 * Math.PI * rr * rr) || 0, an = a * n;
    const xi = G > 0 ? (2 * G) / (G + Math.sqrt(G * G + 4 * an * G)) : 0;
    r.push(rr / RS); x.push(xi);
    Qr = Math.max(0, Qr - 4 * Math.PI * rr * rr * n * n * a * xi * xi * dr); tau += n * (1 - xi) * sig * dr;
  }
  return { r, x, RS };
}

// ---------- 3. Gamow peak (energies in keV)
export const gamowEG = (Z1, Z2, A1, A2) => { const mr = (A1 * A2) / (A1 + A2) * C.mpc2_keV; return 2 * mr * Math.pow(Math.PI * C.alpha * Z1 * Z2, 2); };
export const kT_keV = (T) => C.kB_keV * T;
export const gamowE0 = (EG, kT) => Math.cbrt((EG * kT * kT) / 4);
export const gamowWidth = (EG, kT) => 4 * Math.sqrt(gamowE0(EG, kT) * kT / 3); // 1/e full width Delta
export const gamowTau = (EG, kT) => 3 * Math.cbrt(EG / (4 * kT));
export const gamowNu = (EG, kT) => (gamowTau(EG, kT) - 2) / 3; // rate ~ T^nu
export const gamowIntegrand = (E, EG, kT) => Math.exp(-E / kT - Math.sqrt(EG / E));

// ---------- 4. white dwarfs: zero-T degenerate electron gas + hydrostatic equilibrium
const KP = (8 * Math.PI * Math.pow(C.me, 4) * Math.pow(C.c, 5)) / (3 * Math.pow(C.h, 3));
const KR = (8 * Math.PI * Math.pow(C.me * C.c, 3) * C.mu) / (3 * Math.pow(C.h, 3)); // rho = KR mu_e x^3
export const rhoOfX = (x, mue) => KR * mue * x * x * x; // kg/m^3
export const xOfRho = (rho, mue) => Math.cbrt(rho / (KR * mue));
export const rhoGcc = (x, mue) => rhoOfX(x, mue) * 1e-3;
// integrate dm/dr, dx/dr from the centre; returns {M (Msun), R (km)}
export function whiteDwarf(xc, mue) {
  let r = 1e3, x = xc, m = (4 / 3) * Math.PI * r ** 3 * rhoOfX(xc, mue);
  const f = (rr, xx, mm) => [4 * Math.PI * rr * rr * rhoOfX(xx, mue), (-C.G * mm * KR * mue * Math.sqrt(1 + xx * xx)) / (KP * xx * rr * rr)];
  const dr = 2e4;
  for (let i = 0; i < 12000 && x > Math.min(0.02, 0.02 * xc); i++) {
    const [a1, b1] = f(r, x, m), [a2, b2] = f(r + dr / 2, Math.max(x + (dr / 2) * b1, 1e-6), m + (dr / 2) * a1), [a3, b3] = f(r + dr / 2, Math.max(x + (dr / 2) * b2, 1e-6), m + (dr / 2) * a2), [a4, b4] = f(r + dr, Math.max(x + dr * b3, 1e-6), m + dr * a3);
    m += (dr / 6) * (a1 + 2 * a2 + 2 * a3 + a4); x += (dr / 6) * (b1 + 2 * b2 + 2 * b3 + b4); r += dr;
  }
  return { M: m / C.Msun, R: r / 1e3 };
}
export const chandraMass = (mue) => 5.83 / (mue * mue); // Msun, limit x_c -> infinity (n=3 polytrope)
export const wdLimit = (mue) => whiteDwarf(40, mue).M;

// ---------- 5. BBN
export const DELTA_MEV = 1.29333;
export const npEq = (T) => Math.exp(-DELTA_MEV / T); // T in MeV
export const gstar = (Nnu) => 5.5 + 1.75 * Nnu;
export const timeAtT = (T, Nnu = 3) => 1.32 * Math.sqrt(10.75 / gstar(Nnu)) / (T * T); // s
export const TfEff = (Tf0, Nnu) => Tf0 * Math.pow(gstar(Nnu) / 10.75, 1 / 6);
// deuterium bottleneck temperature from Saha: n_D/n_b ~ 1 (eta = baryon/photon)
export function TD(eta = 6.1e-10) {
  const B = 2.2246, mN = 938.9, zeta3 = 1.2020569; let lo = 0.02, hi = 0.3;
  const g = (T) => { const nb = eta * 2 * zeta3 / (Math.PI ** 2) * T ** 3, Xpn = 1, ratio = 0.75 * Math.pow(4 * Math.PI / (mN * T), 1.5) * Math.exp(B / T); return Math.log(Xpn * nb * ratio); };
  for (let i = 0; i < 80; i++) { const mid = (lo + hi) / 2; if (g(mid) > 0) lo = mid; else hi = mid; } return (lo + hi) / 2; // in MeV (natural units: nb*ratio dimensionless)
}
export function bbn({ Tf0 = 0.8, Nnu = 3, decay = true, tauN = 880, eta = 6.1e-10 }) {
  const Tf = TfEff(Tf0, Nnu), npf = npEq(Tf), tf = timeAtT(Tf, Nnu), TDm = TD(eta), tD = timeAtT(TDm, Nnu);
  const np = decay ? npf * Math.exp(-Math.max(0, tD - tf) / tauN) : npf;
  return { Tf, npf, tf, TD: TDm, tD, np, Y: (2 * np) / (1 + np), Yno: (2 * npf) / (1 + npf) };
}
