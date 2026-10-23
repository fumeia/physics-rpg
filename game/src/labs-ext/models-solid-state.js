// Pure physics models for the solid-state labs (no DOM). SI unless stated; lengths in angstrom where noted.
export const K = { hbar: 1.054571817e-34, me: 9.1093837e-31, mn: 1.67492750e-27, c: 2.99792458e8, kB: 1.380649e-23, eV: 1.602176634e-19, h: 6.62607015e-34 };
export const HB2M = 3.80998; // hbar^2/(2 m_e) in eV angstrom^2

// ---- two-site tight binding / split double well. H = [[eps+D/2, -t],[-t, eps-D/2]], energies in eV
export const hop = (d, t0 = 4, d0 = 1, L = 0.8) => t0 * Math.exp(-(d - d0) / L);        // exponentially decaying overlap
export const repulsion = (d, B = 8, d0 = 1, rho = 0.3) => B * Math.exp(-(d - d0) / rho); // core repulsion
export function twoSite(t, D = 0, eps = 0) {
  const s = Math.sqrt(t * t + D * D / 4), e1 = eps + D / 2, Eb = eps - s, Ea = eps + s;
  const nrm = (v) => { const n = Math.hypot(v[0], v[1]); return [v[0] / n, v[1] / n]; };
  return { Eb, Ea, split: 2 * s, vb: nrm([t, e1 - Eb]), va: nrm([t, e1 - Ea]), ionicity: D / (2 * s) };
}
export const bondEnergy = (d, D = 0) => 2 * twoSite(hop(d), D).Eb + repulsion(d); // two electrons in the bonding level (eps = 0)
export function equilibrium(D = 0) {
  let a = 0.5, b = 5; for (let i = 0; i < 80; i++) { const m1 = a + (b - a) / 3, m2 = b - (b - a) / 3; if (bondEnergy(m1, D) < bondEnergy(m2, D)) b = m2; else a = m1; }
  return (a + b) / 2;
}

// ---- Fermi gas (3D, spin 1/2): density n in m^-3, particle mass m
export const kF = (n) => Math.cbrt(3 * Math.PI ** 2 * n);
export const pF = (n) => K.hbar * kF(n);
export const fermiEnergy = (n, m = K.me) => (K.hbar * kF(n)) ** 2 / (2 * m);                       // J, non-relativistic
export const fermiEnergyRel = (n, m = K.me) => Math.sqrt((pF(n) * K.c) ** 2 + (m * K.c * K.c) ** 2) - m * K.c * K.c; // J, kinetic
export const fermiT = (n, m = K.me) => fermiEnergy(n, m) / K.kB;
export const pressureNR = (n, m = K.me) => 0.4 * n * fermiEnergy(n, m);
export function pressure(n, m = K.me) { // exact degenerate pressure, any x = p_F/(m c)
  const x = pF(n) / (m * K.c), pre = Math.PI * m ** 4 * K.c ** 5 / (3 * K.h ** 3);
  return pre * (x * (2 * x * x - 3) * Math.sqrt(1 + x * x) + 3 * Math.asinh(x));
}
export const pressureUR = (n) => (K.hbar * K.c / 4) * Math.cbrt(3 * Math.PI ** 2) * Math.pow(n, 4 / 3);
export const xRel = (n, m = K.me) => pF(n) / (m * K.c);
export const nCross = (m = K.me) => Math.pow(m * K.c / K.hbar, 3) / (3 * Math.PI ** 2); // p_F = m c
export const SYSTEMS = [
  { id: 'Cu', name: 'copper', n: 8.47e28, T: 300, m: K.me, note: 'conduction electrons, T = 300 K' },
  { id: 'WD', name: 'white dwarf core', n: 3e35, T: 1e7, m: K.me, note: '$\\rho\\sim10^9$ kg/m$^3$, $n_e=\\rho/(2m_u)$, $T\\sim10^7$ K' },
  { id: 'NS', name: 'neutron star core', n: 1e44, T: 1e9, m: K.mn, note: 'neutrons (mass $m_n$!), $T\\sim10^9$ K' },
];

// ---- nearly-free electrons in 1D: V(x) = 2 U cos(G x), G = 2 pi / a. Basis |k + m G>, energies in eV, a in angstrom.
export function jacobi(A) { // eigenvalues of a small symmetric matrix (ascending)
  const n = A.length, M = A.map((r) => r.slice());
  for (let sweep = 0; sweep < 60; sweep++) {
    let off = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += M[i][j] ** 2; if (off < 1e-22) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(M[p][q]) < 1e-300) continue;
      const th = (M[q][q] - M[p][p]) / (2 * M[p][q]), t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const kp = M[k][p], kq = M[k][q]; M[k][p] = c * kp - s * kq; M[k][q] = s * kp + c * kq; }
      for (let k = 0; k < n; k++) { const pk = M[p][k], qk = M[q][k]; M[p][k] = c * pk - s * qk; M[q][k] = s * pk + c * qk; }
    }
  }
  return M.map((r, i) => r[i]).sort((x, y) => x - y);
}
export function nfeBands(k, a, U, M = 5) { // all bands at wave vector k (1/angstrom), via plane-wave diagonalisation
  const G = 2 * Math.PI / a, N = 2 * M + 1, H = Array.from({ length: N }, () => new Array(N).fill(0));
  for (let i = 0; i < N; i++) { H[i][i] = HB2M * (k + (i - M) * G) ** 2; if (i + 1 < N) { H[i][i + 1] = U; H[i + 1][i] = U; } }
  return jacobi(H);
}
export const freeE = (k) => HB2M * k * k;
export const edgeEnergy = (a) => HB2M * (Math.PI / a) ** 2;                    // E_0 = hbar^2 (pi/a)^2 / 2m
export const nfeMassRatio = (a, U) => { const e0 = edgeEnergy(a), u = Math.abs(U); return { upper: 1 / (1 + 2 * e0 / u), lower: -1 / (2 * e0 / u - 1) }; }; // m*/m at the band edges (2-wave model)
export const nfeGap = (U) => 2 * Math.abs(U);

// ---- Ewald construction, 2D. Lattice a (x) and b (y), in the same unit; wave vector k in 1/unit.
export function ewald(a, b, lambda, phi, N = 12, tol = 0.02) {
  const k = 2 * Math.PI / lambda, kx = k * Math.cos(phi), ky = k * Math.sin(phi), pts = [];
  for (let h = -N; h <= N; h++) for (let l = -N; l <= N; l++) {
    const Gx = 2 * Math.PI * h / a, Gy = 2 * Math.PI * l / b, qx = kx + Gx, qy = ky + Gy, kp = Math.hypot(qx, qy);
    const res = (kp - k) / k, hit = h === 0 && l === 0 ? false : Math.abs(res) < tol;
    let tt = null; if (hit) tt = Math.acos(Math.max(-1, Math.min(1, (kx * qx + ky * qy) / (k * kp)))) ; // scattering angle 2 theta
    pts.push({ h, l, Gx, Gy, res, hit, twoTheta: tt });
  }
  return { k, kx, ky, pts };
}
