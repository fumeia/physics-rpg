// Pure QM lab models (no DOM). Used by qm.js and test/labs-check-qm.mjs.
export const MU_B = 5.7883818e-5; // eV/T
export const XI_HYD = 3.0e-5;      // eV, hydrogen n=2 spin-orbit constant: E(2p3/2)-E(2p1/2) = 3/2 xi = 4.5e-5 eV

// symmetric eigenproblem (Jacobi), returns ascending eigenvalues and eigenvectors (columns of V)
export function jacobi(A0) {
  const n = A0.length, A = A0.map((r) => r.slice()), V = A.map((_, i) => A.map((__, j) => (i === j ? 1 : 0)));
  for (let sweep = 0; sweep < 60; sweep++) {
    let off = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] ** 2;
    if (off < 1e-30) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(A[p][q]) < 1e-300) continue;
      const th = (A[q][q] - A[p][p]) / (2 * A[p][q]), t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const kp = A[k][p], kq = A[k][q]; A[k][p] = c * kp - s * kq; A[k][q] = s * kp + c * kq; }
      for (let k = 0; k < n; k++) { const pk = A[p][k], qk = A[q][k]; A[p][k] = c * pk - s * qk; A[q][k] = s * pk + c * qk; }
      for (let k = 0; k < n; k++) { const kp = V[k][p], kq = V[k][q]; V[k][p] = c * kp - s * kq; V[k][q] = s * kp + c * kq; }
    }
  }
  const idx = A.map((_, i) => i).sort((a, b) => A[a][a] - A[b][b]);
  return { vals: idx.map((i) => A[i][i]), vecs: idx.map((i) => V.map((r) => r[i])) };
}

// ---------------- hydrogen n=2 in a magnetic field: H = xi L.S (l=1 only; 2s1/2 and 2p1/2 degenerate in Dirac theory) + mu_B B (Lz + 2 Sz)
export const landeG = (l, j, s = 0.5) => (j === 0 ? 0 : 1 + (j * (j + 1) + s * (s + 1) - l * (l + 1)) / (2 * j * (j + 1)));
// all n=2 levels (eV, measured from 2p1/2 at B=0). Returns [{l, mj, E}] (8 entries). xi = 0 switches spin-orbit off.
export function zeemanLevels(Bt, xi = XI_HYD) {
  const out = [];
  for (const l of [0, 1]) {
    const basis = []; for (let ml = -l; ml <= l; ml++) for (const ms of [-0.5, 0.5]) basis.push({ ml, ms, mj: ml + ms });
    const mjs = [...new Set(basis.map((b) => b.mj))].sort((a, b) => a - b);
    for (const mj of mjs) {
      const bl = basis.filter((b) => b.mj === mj), n = bl.length, H = Array.from({ length: n }, () => Array(n).fill(0));
      bl.forEach((b, i) => {
        H[i][i] += MU_B * Bt * (b.ml + 2 * b.ms) + (l === 1 ? xi * (1 + b.ml * b.ms) : 0); // +xi shifts 2p1/2 to 0
        if (l === 1) { // xi/2 (L+S- + L-S+): |ml,up> <-> |ml+1,down>
          bl.forEach((c, k) => { if (b.ms === 0.5 && c.ms === -0.5 && c.ml === b.ml + 1) { const el = 0.5 * xi * Math.sqrt(l * (l + 1) - c.ml * (c.ml - 1)); H[i][k] += el; H[k][i] += el; } });
        }
      });
      jacobi(H).vals.forEach((E) => out.push({ l, mj, E }));
    }
  }
  return out;
}
export const fineStructureLevels = () => zeemanLevels(0); // reference at B=0

// ---------------- Clebsch-Gordan by the lowering-operator recursion (Condon-Shortley phases)
export function cgTable(j1, j2) {
  const n1 = Math.round(2 * j1 + 1), n2 = Math.round(2 * j2 + 1), idx = (m1, m2) => Math.round(j1 - m1) * n2 + Math.round(j2 - m2), dim = n1 * n2;
  const mOf = (k) => [j1 - Math.floor(k / n2), j2 - (k % n2)];
  const lower = (v) => { const w = Array(dim).fill(0); for (let k = 0; k < dim; k++) { if (!v[k]) continue; const [m1, m2] = mOf(k);
    if (m1 > -j1) w[idx(m1 - 1, m2)] += v[k] * Math.sqrt(j1 * (j1 + 1) - m1 * (m1 - 1));
    if (m2 > -j2) w[idx(m1, m2 - 1)] += v[k] * Math.sqrt(j2 * (j2 + 1) - m2 * (m2 - 1)); } return w; };
  const states = {}; // `${J},${M}` -> vector over product basis
  const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
  for (let J = j1 + j2; J >= Math.abs(j1 - j2) - 1e-9; J--) {
    let v = Array(dim).fill(0); v[idx(j1, J - j1 >= -j2 ? J - j1 : -j2)] = 1; // highest-m1 product state with M=J
    for (let Jp = J + 1; Jp <= j1 + j2 + 1e-9; Jp++) { const u = states[`${Jp},${J}`]; if (u) { const c = dot(v, u); v = v.map((x, i) => x - c * u[i]); } }
    const nrm = Math.sqrt(dot(v, v)); v = v.map((x) => x / nrm); states[`${J},${J}`] = v;
    for (let M = J; M > -J + 1e-9; M--) { const w = lower(states[`${J},${M}`]), f = Math.sqrt(J * (J + 1) - M * (M - 1)); states[`${J},${M - 1}`] = w.map((x) => x / f); }
  }
  return { j1, j2, states, mOf, idx, dim,
    cg: (m1, m2, J, M) => { const v = states[`${J},${M}`]; return v && Math.abs(m1 + m2 - M) < 1e-9 && Math.abs(m1) <= j1 && Math.abs(m2) <= j2 ? v[idx(m1, m2)] : 0; },
    Js: Array.from({ length: Math.round(j1 + j2 - Math.abs(j1 - j2)) + 1 }, (_, i) => j1 + j2 - i) };
}
export const snapM = (m, j) => Math.max(-j, Math.min(j, j - Math.round(j - m)));
// probabilities of the total J for product state |m1 m2>
export function cgProbs(j1, j2, m1, m2) { const t = cgTable(j1, j2), M = m1 + m2; return t.Js.filter((J) => J >= Math.abs(M) - 1e-9).map((J) => ({ J, M, c: t.cg(m1, m2, J, M), P: t.cg(m1, m2, J, M) ** 2 })); }

// ---------------- CHSH
export const Esinglet = (a, b) => -Math.cos(a - b);
export const Elhv = (a, b) => { let d = Math.abs(a - b) % (2 * Math.PI); if (d > Math.PI) d = 2 * Math.PI - d; return -1 + (2 * d) / Math.PI; }; // sawtooth from a deterministic hidden-axis model
export const chsh = (E, a, a2, b, b2) => E(a, b) - E(a, b2) + E(a2, b) + E(a2, b2);
export const CHSH_OPT = { a: 0, a2: Math.PI / 2, b: -3 * Math.PI / 4, b2: -Math.PI / 4 };

// ---------------- free Gaussian packet and box expansion
export const dxFree = (dx0, hbarOverM, t) => dx0 * Math.sqrt(1 + (hbarOverM * t / (2 * dx0 * dx0)) ** 2);
export const pBoxDouble = (n) => (n === 2 ? 0.5 : n % 2 === 0 ? 0 : 32 / (Math.PI ** 2 * (4 - n * n) ** 2));
