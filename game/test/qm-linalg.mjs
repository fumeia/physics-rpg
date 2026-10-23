// Tiny dense linear algebra for the QM checks (independent of the game code): Jacobi eigenvalues for real symmetric matrices,
// Hermitian matrices via the real 2n x 2n embedding, matrix helpers.
export const zeros = (n, m = n) => Array.from({ length: n }, () => new Array(m).fill(0));
export const eye = (n) => { const a = zeros(n); for (let i = 0; i < n; i++) a[i][i] = 1; return a; };
export const mul = (A, B) => { const n = A.length, m = B[0].length, k = B.length, C = zeros(n, m); for (let i = 0; i < n; i++) for (let l = 0; l < k; l++) { const a = A[i][l]; if (a !== 0) for (let j = 0; j < m; j++) C[i][j] += a * B[l][j]; } return C; };
export const add = (A, B, s = 1) => A.map((r, i) => r.map((v, j) => v + s * B[i][j]));
export const scale = (A, s) => A.map((r) => r.map((v) => v * s));
export const T = (A) => A[0].map((_, j) => A.map((r) => r[j]));
export function jacobi(Ain, tol = 1e-13) {
  const n = Ain.length, A = Ain.map((r) => r.slice()), V = eye(n);
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] ** 2;
    if (off < tol * tol) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(A[p][q]) < 1e-300) continue;
      const th = (A[q][q] - A[p][p]) / (2 * A[p][q]), t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const akp = A[k][p], akq = A[k][q]; A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq; }
      for (let k = 0; k < n; k++) { const apk = A[p][k], aqk = A[q][k]; A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk; }
      for (let k = 0; k < n; k++) { const vkp = V[k][p], vkq = V[k][q]; V[k][p] = c * vkp - s * vkq; V[k][q] = s * vkp + c * vkq; }
    }
  }
  const vals = A.map((r, i) => r[i]), idx = vals.map((_, i) => i).sort((a, b) => vals[a] - vals[b]);
  return { values: idx.map((i) => vals[i]), vectors: idx.map((i) => V.map((r) => r[i])) }; // vectors[k] = k-th eigenvector
}
// Hermitian matrix given as {re, im} (n x n arrays) -> sorted eigenvalues
export function eigHermitian(re, im) {
  const n = re.length, M = zeros(2 * n);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { M[i][j] = re[i][j]; M[i + n][j + n] = re[i][j]; M[i][j + n] = -im[i][j]; M[i + n][j] = im[i][j]; }
  const v = jacobi(M).values; return v.filter((_, k) => k % 2 === 0);
}
// Oscillator ladder operator in a truncated number basis (a|n> = sqrt(n)|n-1>)
export const ladder = (N) => { const a = zeros(N); for (let n = 1; n < N; n++) a[n - 1][n] = Math.sqrt(n); return a; };
export const kron = (A, B) => { const n = A.length, m = B.length, C = zeros(n * m); for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < m; k++) for (let l = 0; l < m; l++) C[i * m + k][j * m + l] = A[i][j] * B[k][l]; return C; };
