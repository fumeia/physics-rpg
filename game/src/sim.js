import { fft } from './fft.js';

// 1D time-dependent Schrödinger equation, hbar = m = 1, split-step Fourier.
// NOTE: dx = 0.2, so barrier widths L must be multiples of 0.2 (edges must fall between cells);
// dt = 0.05 verified against the packet-averaged exact T (test/sim-check.mjs). A finer grid needs dt ~ dx^2
// because the sharp barrier edge makes the split-step error grow like kmax^2 dt^2.
// Barrier V0 on [-L/2, L/2]; Gaussian packet starts at x0 < 0 with central
// momentum k0 = sqrt(2E) and position width sigma.
export class TunnelSim {
  constructor({ V0 = 1, EoverV0 = 0.5, L = 2, sigma = 6, x0 = -30, N = 1024, xmax = 102.4, dt = 0.05 }) {
    Object.assign(this, { V0, L, sigma, x0, N, xmax, dt });
    this.E = EoverV0 * V0;
    this.k0 = Math.sqrt(2 * this.E);
    this.dx = (2 * xmax) / N;
    this.x = new Float64Array(N);
    this.V = new Float64Array(N);
    this.re = new Float64Array(N);
    this.im = new Float64Array(N);
    this.kin = new Float64Array(N); // exp(-i k^2 dt/2) as re/im
    this.kinI = new Float64Array(N);
    this.potR = new Float64Array(N); // exp(-i V dt/2)
    this.potI = new Float64Array(N);
    this.t = 0;
    this.tEnd = (Math.abs(x0) + 45) / this.k0;
    for (let i = 0; i < N; i++) {
      const x = -xmax + (i + 0.5) * this.dx; // cell-centred: barrier edges fall between grid cells
      this.x[i] = x;
      this.V[i] = Math.abs(x) <= L / 2 ? V0 : 0;
      const k = (i < N / 2 ? i : i - N) * Math.PI / xmax;
      this.kin[i] = Math.cos(k * k * dt / 2);
      this.kinI[i] = -Math.sin(k * k * dt / 2);
      this.potR[i] = Math.cos(this.V[i] * dt / 2);
      this.potI[i] = -Math.sin(this.V[i] * dt / 2);
      const env = Math.exp(-((x - x0) ** 2) / (4 * sigma * sigma));
      this.re[i] = env * Math.cos(this.k0 * x);
      this.im[i] = env * Math.sin(this.k0 * x);
    }
    this._normalise();
  }
  _normalise() {
    let s = 0;
    for (let i = 0; i < this.N; i++) s += this.re[i] ** 2 + this.im[i] ** 2;
    const f = 1 / Math.sqrt(s * this.dx);
    for (let i = 0; i < this.N; i++) { this.re[i] *= f; this.im[i] *= f; }
  }
  _mul(ar, ai, br, bi) {
    for (let i = 0; i < this.N; i++) {
      const r = ar[i] * br[i] - ai[i] * bi[i];
      ai[i] = ar[i] * bi[i] + ai[i] * br[i];
      ar[i] = r;
    }
  }
  step() {
    this._mul(this.re, this.im, this.potR, this.potI);
    fft(this.re, this.im);
    this._mul(this.re, this.im, this.kin, this.kinI);
    fft(this.re, this.im, true);
    this._mul(this.re, this.im, this.potR, this.potI);
    this.t += this.dt;
  }
  get done() { return this.t >= this.tEnd; }
  density(i) { return this.re[i] ** 2 + this.im[i] ** 2; }
  // Probability right of the barrier, left of the barrier, and inside it.
  probabilities() {
    let T = 0, R = 0, I = 0;
    for (let i = 0; i < this.N; i++) {
      const x = this.x[i], d = this.density(i) * this.dx;
      if (x > this.L / 2) T += d; else if (x < -this.L / 2) R += d; else I += d;
    }
    return { T, R, inside: I };
  }
  // Exact plane-wave transmission (script eq. 3.62/3.63; sheet V Q1(v)) at energy E.
  static transmission(E, V0, L) {
    if (E > V0) {
      const l = Math.sqrt(2 * (E - V0));
      return 1 / (1 + (V0 * V0 * Math.sin(l * L) ** 2) / (4 * E * (E - V0)));
    }
    if (E === V0) return 1 / (1 + V0 * L * L / 2); // limit E -> V0 (m = hbar = 1)
    const kappa = Math.sqrt(2 * (V0 - E));
    return 1 / (1 + (V0 * V0 * Math.sinh(kappa * L) ** 2) / (4 * E * (V0 - E)));
  }
  // Transmission averaged over the packet's momentum distribution: this is what
  // the simulation should reproduce (the plane-wave value only holds at one E).
  packetTransmission() {
    const { sigma, k0, V0, L } = this;
    let num = 0, den = 0;
    const dk = sigma ? 1 / (sigma * 40) : 0.01;
    for (let k = k0 - 6 / (2 * sigma); k <= k0 + 6 / (2 * sigma); k += dk) {
      if (k <= 0) continue;
      const w = Math.exp(-((k - k0) ** 2) * 4 * sigma * sigma / 2);
      num += w * TunnelSim.transmission(k * k / 2, V0, L);
      den += w;
    }
    return num / den;
  }
}
