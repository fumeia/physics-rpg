import * as LM from './labmodels.js';
import { M } from './math.js';
import { EXT } from './labs-ext/index.js';

// Interactive labs ("what happens if this changes or disappears"). A lab encounter is
// { type: 'lab', id, title, widget, intro, tasks[], source[], xp }. Models live in labmodels.js.
const W = 640, H = 340;
const fmt = (v, d = 3) => (v !== 0 && (Math.abs(v) < 1e-2 || Math.abs(v) >= 1e5) ? v.toExponential(d - 1) : Number(v.toPrecision(d)).toString());

// ---- tiny plotting helper: axes with (log) scales; returns coordinate mappers
function axes(ctx, o) {
  const L = o.pad?.l ?? 56, R = 14, T = 14, B = 36, fx = o.xlog ? Math.log10 : (v) => v, fy = o.ylog ? Math.log10 : (v) => v;
  const x0 = fx(o.xr[0]), x1 = fx(o.xr[1]), y0 = fy(o.yr[0]), y1 = fy(o.yr[1]);
  const X = (x) => L + ((fx(x) - x0) / (x1 - x0)) * (W - L - R), Y = (y) => H - B - ((fy(y) - y0) / (y1 - y0)) * (H - T - B);
  ctx.fillStyle = '#0b1220'; ctx.fillRect(0, 0, W, H);
  ctx.font = '11px system-ui'; ctx.fillStyle = '#7f8aa6'; ctx.strokeStyle = '#1e2a40'; ctx.lineWidth = 1;
  const ticks = (lo, hi, log) => { if (log) { const out = []; for (let d = Math.ceil(lo); d <= Math.floor(hi); d++) out.push(d); return out; } const span = hi - lo, step = Math.pow(10, Math.floor(Math.log10(span / 5))) * ([1, 2, 5].find((m) => span / (Math.pow(10, Math.floor(Math.log10(span / 5))) * m) <= 6) || 10); const out = []; for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) out.push(+v.toFixed(10)); return out; };
  for (const t of ticks(x0, x1, o.xlog)) { const xv = o.xlog ? Math.pow(10, t) : t, px = X(xv); ctx.beginPath(); ctx.moveTo(px, T); ctx.lineTo(px, H - B); ctx.stroke(); ctx.textAlign = 'center'; ctx.fillText(o.xlog ? `1e${t}` : fmt(xv, 3), px, H - B + 14); }
  for (const t of ticks(y0, y1, o.ylog)) { const yv = o.ylog ? Math.pow(10, t) : t, py = Y(yv); ctx.beginPath(); ctx.moveTo(L, py); ctx.lineTo(W - R, py); ctx.stroke(); ctx.textAlign = 'right'; ctx.fillText(o.ylog ? `1e${t}` : fmt(yv, 3), L - 6, py + 4); }
  ctx.strokeStyle = '#3a4a6a'; ctx.strokeRect(L, T, W - L - R, H - T - B);
  ctx.fillStyle = '#9fb0d0'; ctx.textAlign = 'center'; if (o.xlabel) ctx.fillText(o.xlabel, (L + W - R) / 2, H - 6);
  ctx.save(); ctx.translate(12, (T + H - B) / 2); ctx.rotate(-Math.PI / 2); if (o.ylabel) ctx.fillText(o.ylabel, 0, 0); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.rect(L, T, W - L - R, H - T - B); ctx.restore();
  return { X, Y, L, R, T, B, clip: () => { ctx.save(); ctx.beginPath(); ctx.rect(L, T, W - L - R, H - T - B); ctx.clip(); }, unclip: () => ctx.restore() };
}
function curve(ctx, ax, f, xs, color, width = 2, dash = []) {
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.setLineDash(dash); ctx.beginPath(); let pen = false;
  for (const x of xs) { const y = f(x); if (!Number.isFinite(y)) { pen = false; continue; } const px = ax.X(x), py = ax.Y(y); if (pen) ctx.lineTo(px, py); else { ctx.moveTo(px, py); pen = true; } }
  ctx.stroke(); ctx.restore();
}
const lin = (a, b, n) => Array.from({ length: n }, (_, i) => a + ((b - a) * i) / (n - 1));
const logsp = (a, b, n) => lin(Math.log10(a), Math.log10(b), n).map((v) => Math.pow(10, v));
const label = (ctx, text, x, y, color = '#cfe0ff', align = 'left') => { ctx.fillStyle = color; ctx.font = '12px system-ui'; ctx.textAlign = align; ctx.fillText(text, x, y); };

// ================================================================== the labs
export const LABS = {
  // ---------------------------------------------------------------- astro: blackbody (what if h shrinks?)
  blackbody: {
    controls: [
      { id: 'T', label: 'temperature $T$ (K)', min: 0.4, max: 4.6, step: 0.01, value: Math.log10(5800), log: true },
      { id: 'hs', label: 'Planck constant $h$ scaled by', min: -4, max: 0, step: 0.05, value: 0, log: true },
      { id: 'rj', label: 'show Rayleigh–Jeans line', type: 'toggle', value: true },
      { id: 'cmb', label: 'show the CMB (2.725 K)', type: 'toggle', value: false },
    ],
    draw(ctx, p) {
      const nus = logsp(1e8, 1e17, 240), best = Math.max(...nus.map((n) => LM.planck(n, p.T, p.hs)), p.cmb ? 1e-20 : 0, p.rj ? 0 : 0);
      const ymax = Math.pow(10, Math.ceil(Math.log10(Math.max(best, LM.rayleighJeans(1e9, p.T)) * 3))), ax = axes(ctx, { xr: [1e8, 1e17], yr: [ymax * 1e-20, ymax], xlog: true, ylog: true, xlabel: 'frequency ν (Hz)', ylabel: 'B_ν (W m⁻² Hz⁻¹ sr⁻¹)' });
      ax.clip();
      if (p.rj) curve(ctx, ax, (n) => LM.rayleighJeans(n, p.T), nus, '#ff8a5b', 1.5, [6, 4]);
      if (p.cmb) curve(ctx, ax, (n) => LM.planck(n, 2.725, p.hs), nus, '#7dffb0', 2);
      curve(ctx, ax, (n) => LM.planck(n, p.T, p.hs), nus, '#6cb6ff', 2.6);
      const pk = LM.planckPeakNu(p.T, p.hs); if (pk > 1e8 && pk < 1e17) { ctx.strokeStyle = '#ffd86b'; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(ax.X(pk), ax.T); ctx.lineTo(ax.X(pk), H - ax.B); ctx.stroke(); ctx.setLineDash([]); }
      // visible band
      ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(ax.X(3.9e14), ax.T, ax.X(7.7e14) - ax.X(3.9e14), H - ax.T - ax.B);
      ax.unclip();
      label(ctx, 'blue: Planck B_ν(T)   orange dashed: Rayleigh–Jeans   yellow: peak   grey band: visible light', ax.L + 6, ax.T + 14, '#9fb0d0');
    },
    info: (p) => `Peak at $\\nu_{\\max}=2.82\\,k_BT/h=${fmt(LM.planckPeakNu(p.T, p.hs) / 1e9)}$ GHz, i.e. $\\lambda_{\\max}=${fmt(LM.wienLambda(p.T) * 1e9)}$ nm (Wien, for the real $h$). Total flux $F=\\sigma_{SB}T^4$ ${p.hs < 0.9 ? 'would change with h: with h→0 the Rayleigh–Jeans law holds at all ν and the integral diverges (ultraviolet catastrophe)' : ''}.`,
  },
  // ---------------------------------------------------------------- astro: rotation curve with BH and r^-2 halo
  rotation: {
    controls: [
      { id: 'M0', label: 'central black hole mass $M_0$ ($M_\\odot$)', min: 4, max: 9, step: 0.05, value: Math.log10(4e6), log: true },
      { id: 'k', label: 'halo mass per length $k$ ($M_\\odot$/pc), $\\rho\\propto r^{-2}$', min: 3, max: 8, step: 0.05, value: Math.log10(8.13e5), log: true },
      { id: 'bh', label: 'black hole present', type: 'toggle', value: true },
      { id: 'halo', label: 'halo present', type: 'toggle', value: true },
    ],
    draw(ctx, p) {
      const M0 = p.bh ? p.M0 : 0, k = p.halo ? p.k : 0, rs = logsp(0.1, 1e4, 200);
      const vmax = Math.max(100, ...rs.map((r) => LM.vCirc(r, M0 || 1e-9, k)).filter((v) => Number.isFinite(v)).map((v) => Math.min(v, 2000)));
      const ax = axes(ctx, { xr: [0.1, 1e4], yr: [0, Math.min(2000, vmax * 1.1)], xlog: true, xlabel: 'radius r (pc)', ylabel: 'v_c (km/s)' }); ax.clip();
      curve(ctx, ax, (r) => LM.vCirc(r, p.M0, 0), rs, '#ff8a5b', 1.5, [6, 4]); curve(ctx, ax, (r) => LM.vCirc(r, 1e-9, p.k), rs, '#7dffb0', 1.5, [6, 4]);
      curve(ctx, ax, (r) => LM.vCirc(r, M0 || 1e-9, k), rs, '#6cb6ff', 2.8);
      ctx.fillStyle = '#ffd86b'; ctx.beginPath(); ctx.arc(ax.X(2), ax.Y(110), 5, 0, 7); ctx.fill(); ax.unclip();
      label(ctx, 'blue: total   orange dashed: black hole alone (Kepler)   green dashed: halo alone (flat)   yellow dot: exam data point (110 km/s at 2 pc)', ax.L + 6, ax.T + 14, '#9fb0d0');
    },
    info: (p) => `$v_c=\\sqrt{G(k+M_0/r)}$ (from $M_r=kr+M_0$). Far out $v_c\\to\\sqrt{Gk}=${fmt(Math.sqrt(LM.K.G_pc * (p.halo ? p.k : 0)))}$ km/s; close in the black hole wins ($v\\propto r^{-1/2}$). The exam point (110 km/s at 2 pc, $M_0=4\\times10^6\\,M_\\odot$) needs $k=${fmt(LM.kFromPoint(110, 2, 4e6))}\\ M_\\odot$/pc.`,
  },
  // ---------------------------------------------------------------- astro: Friedmann a(t)
  friedmann: {
    controls: [
      { id: 'Om', label: 'matter $\\Omega_m$', min: 0, max: 3, step: 0.01, value: 0.3 },
      { id: 'OL', label: 'dark energy $\\Omega_\\Lambda$', min: -0.5, max: 2, step: 0.01, value: 0.7 },
      { id: 'rad', label: 'include radiation ($\\Omega_r=9\\times10^{-5}$)', type: 'toggle', value: false },
      { id: 'noL', label: 'remove $\\Lambda$ (set $\\Omega_\\Lambda=0$)', type: 'toggle', value: false },
      { id: 'noM', label: 'remove matter (set $\\Omega_m=0$)', type: 'toggle', value: false },
    ],
    draw(ctx, p) {
      const Om = p.noM ? 0 : p.Om, OL = p.noL ? 0 : p.OL, f = LM.friedmann(Om, OL, p.rad ? 9e-5 : 0, 8);
      const amax = Math.min(6, Math.max(2, ...f.a)), ax = axes(ctx, { xr: [-1.2, 4], yr: [0, amax], xlabel: 'H₀ (t − t_today)', ylabel: 'scale factor a' });
      if (f.noBigBang) { label(ctx, 'no expanding solution from a = 0 for these parameters (a "bounce" or static case)', ax.L + 10, 60, '#ff8a5b'); return; }
      ax.clip(); const age = f.age ?? 0;
      ctx.strokeStyle = '#6cb6ff'; ctx.lineWidth = 2.6; ctx.beginPath(); f.tau.forEach((t, i) => { const px = ax.X(t - age), py = ax.Y(f.a[i]); if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); }); ctx.stroke();
      ctx.strokeStyle = '#ffd86b'; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(ax.X(0), ax.T); ctx.lineTo(ax.X(0), H - ax.B); ctx.moveTo(ax.L, ax.Y(1)); ctx.lineTo(W - ax.R, ax.Y(1)); ctx.stroke(); ctx.setLineDash([]);
      // reference: Einstein-de Sitter
      ax.unclip(); label(ctx, 'blue: your universe   yellow: today (a = 1)', ax.L + 6, ax.T + 14, '#9fb0d0');
    },
    info: (p) => { const Om = p.noM ? 0 : p.Om, OL = p.noL ? 0 : p.OL, f = LM.friedmann(Om, OL, p.rad ? 9e-5 : 0, 8), Ok = 1 - Om - OL - (p.rad ? 9e-5 : 0);
      if (f.noBigBang) return 'No big bang for these parameters.';
      return `Curvature $\\Omega_k=1-\\Omega_m-\\Omega_\\Lambda=${fmt(Ok)}$ → ${Math.abs(Ok) < 1e-3 ? 'flat' : Ok > 0 ? 'open (negative curvature)' : 'closed (positive curvature)'}. Age $t_0=${fmt(f.age)}\\,H_0^{-1}=${fmt(f.age * 977.8 / 70)}$ Gyr (for $H_0=70$). ${f.crunch ? `It recollapses: big crunch at $H_0t=${fmt(f.crunch - f.age)}$ from today.` : 'It expands for ever.'}`; },
  },
  // ---------------------------------------------------------------- solid state: diatomic chain
  chain: {
    animated: true,
    controls: [
      { id: 'ratio', label: 'mass ratio $M_2/M_1$', min: 1, max: 12, step: 0.1, value: 3 },
      { id: 'qa', label: 'wave number $qa/\\pi$ (marked on the dispersion)', min: 0.02, max: 1, step: 0.01, value: 0.35 },
      { id: 'branch', label: 'show the optical branch motion (else acoustic)', type: 'toggle', value: false },
      { id: 'equal', label: 'make the masses equal', type: 'toggle', value: false },
    ],
    draw(ctx, p, t) {
      const r = p.equal ? 1 : p.ratio, qs = lin(-Math.PI, Math.PI, 200), top = LM.chainOmega(Math.PI, 1, r).op * 1.05 + 0.05;
      const ax = axes(ctx, { xr: [-Math.PI, Math.PI], yr: [0, Math.max(top, LM.chainOmega(0, 1, r).op * 1.05)], xlabel: 'q a  (first Brillouin zone from −π to π)', ylabel: 'ω / √(k/M₁)' });
      ax.clip(); curve(ctx, ax, (q) => LM.chainOmega(q, 1, r).ac, qs, '#6cb6ff', 2.4); curve(ctx, ax, (q) => LM.chainOmega(q, 1, r).op, qs, '#ffa94d', 2.4); ax.unclip();
      const q = p.qa * Math.PI, e = LM.chainOmega(q, 1, r), w = p.branch ? e.op : e.ac;
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ax.X(q), ax.Y(w), 5, 0, 7); ctx.fill();
      label(ctx, 'blue: acoustic   orange: optical   gap at the zone edge: ω² = 2k/M_heavy and 2k/M_light', ax.L + 6, ax.T + 14, '#9fb0d0');
      // atoms: displacement pattern of the chosen mode
      const V = LM.chainRatio(q, 1, r, 1, 1, w), n = 12, y0 = H - 62; ctx.fillStyle = 'rgba(11,18,32,0.9)'; ctx.fillRect(ax.L + 1, y0 - 24, W - ax.L - ax.R - 2, 50);
      for (let i = 0; i < n; i++) {
        const light = i % 2 === 0, cell = Math.floor(i / 2), phase = light ? q * cell : q * (cell + 0.5), amp = (light ? 1 : V) * 10, x = ax.L + 20 + i * ((W - ax.L - ax.R - 40) / (n - 1)) + amp * Math.cos(phase - 2.4 * t);
        ctx.fillStyle = light ? '#6cb6ff' : '#ffa94d'; ctx.beginPath(); ctx.arc(x, y0, light ? 7 : Math.min(13, 7 + 2 * Math.log(r + 1)), 0, 7); ctx.fill();
      }
    },
    info: (p) => { const r = p.equal ? 1 : p.ratio, q = p.qa * Math.PI, e = LM.chainOmega(q, 1, r), edge = LM.chainOmega(Math.PI, 1, r); return `At $qa=${fmt(q)}$: $\\omega_{ac}=${fmt(e.ac)}$, $\\omega_{op}=${fmt(e.op)}$. Zone edge: $\\omega_{ac}=\\sqrt{2k/M_{heavy}}=${fmt(edge.ac)}$, $\\omega_{op}=\\sqrt{2k/M_{light}}=${fmt(edge.op)}$, gap ${fmt(edge.op - edge.ac)}$ ${p.equal ? '(equal masses: the gap closes and the chain is a monatomic one, folded)' : ''}. The group velocity $d\\omega/dq$ vanishes at the zone edge (standing waves).`; },
  },
  // ---------------------------------------------------------------- solid state: Debye vs Einstein
  debye: {
    controls: [
      { id: 'Th', label: 'Debye temperature $\\Theta_D$ (K)', min: 1.5, max: 3.2, step: 0.01, value: Math.log10(400), log: true },
      { id: 'ratio', label: 'Einstein temperature $/\\Theta_D$', min: 0.4, max: 1.2, step: 0.01, value: 0.75 },
      { id: 'dp', label: 'show the Dulong–Petit limit', type: 'toggle', value: true },
      { id: 't3', label: 'show the $T^3$ law', type: 'toggle', value: true },
      { id: 'ein', label: 'show the Einstein model', type: 'toggle', value: true },
    ],
    draw(ctx, p) {
      const Ts = lin(0.01, 2.2, 160).map((x) => x * p.Th), ax = axes(ctx, { xr: [0, 2.2 * p.Th], yr: [0, 1.1], xlabel: 'temperature T (K)', ylabel: 'C_V / (3Nk_B)' }); ax.clip();
      if (p.dp) { ctx.strokeStyle = '#7f8aa6'; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(ax.L, ax.Y(1)); ctx.lineTo(W - ax.R, ax.Y(1)); ctx.stroke(); ctx.setLineDash([]); }
      if (p.t3) curve(ctx, ax, (T) => (4 * Math.PI ** 4 / 5) * (T / p.Th) ** 3, Ts, '#7dffb0', 1.5, [6, 4]);
      if (p.ein) curve(ctx, ax, (T) => LM.einsteinC(T, p.ratio * p.Th), Ts, '#ffa94d', 2.2);
      curve(ctx, ax, (T) => LM.debyeC(T, p.Th), Ts, '#6cb6ff', 2.8); ax.unclip();
      label(ctx, 'blue: Debye   orange: Einstein   green dashed: T³ law   grey: Dulong–Petit', ax.L + 6, ax.T + 14, '#9fb0d0');
    },
    info: (p) => `At $T=\\Theta_D/10$: Debye $C_V/3Nk=${fmt(LM.debyeC(p.Th / 10, p.Th))}$ (T³ law: ${fmt((4 * Math.PI ** 4 / 5) * 0.001)}), Einstein ${fmt(LM.einsteinC(p.Th / 10, p.ratio * p.Th))} (exponentially frozen out). At $T=\\Theta_D$ Debye gives ${fmt(LM.debyeC(p.Th, p.Th))}. Debye's linear acoustic branch gives the $T^3$; Einstein's single frequency cannot.`,
  },
  // ---------------------------------------------------------------- solid state: Fermi gas, Pauli on/off
  fermi: {
    controls: [
      { id: 'n', label: 'electron density $n$ (m$^{-3}$)', min: 26.5, max: 29.5, step: 0.02, value: Math.log10(8.47e28), log: true },
      { id: 'T', label: 'temperature $T$ (K)', min: 1, max: 6, step: 0.02, value: Math.log10(300), log: true },
      { id: 'pauli', label: 'Pauli exclusion principle on', type: 'toggle', value: true },
    ],
    draw(ctx, p) {
      const EF = LM.fermiEnergy(p.n), kT = LM.K.k * p.T, emax = Math.max(2 * EF, 12 * kT), Es = lin(0, emax, 300), mu = LM.chemPot(p.n, p.T);
      const g = (E) => LM.dos(E), occ = (E) => 1 / (Math.exp(Math.max(-700, Math.min(700, (E - mu) / kT))) + 1);
      let A = 0; { const m = 4000, de = emax / m; let s = 0; for (let i = 1; i <= m; i++) s += g(i * de) * Math.exp(-(i * de) / kT) * de; A = p.n / s; }
      const f = p.pauli ? (E) => g(E) * occ(E) : (E) => g(E) * A * Math.exp(-E / kT), ymax = g(emax) * 1.05;
      const ax = axes(ctx, { xr: [0, emax / LM.K.eV], yr: [0, ymax], xlabel: 'energy E (eV)', ylabel: 'states per energy (g f)', pad: { l: 40 } });
      ax.clip(); const eV = LM.K.eV;
      curve(ctx, ax, (e) => g(e * eV), Es.map((e) => e / eV), '#4a5d85', 1.5, [5, 4]);
      ctx.fillStyle = p.pauli ? 'rgba(108,182,255,0.35)' : 'rgba(255,138,91,0.4)'; ctx.beginPath(); ctx.moveTo(ax.X(0), ax.Y(0)); Es.forEach((E) => ctx.lineTo(ax.X(E / eV), ax.Y(f(E)))); ctx.lineTo(ax.X(emax / eV), ax.Y(0)); ctx.fill();
      curve(ctx, ax, (e) => f(e * eV), Es.map((e) => e / eV), p.pauli ? '#6cb6ff' : '#ff8a5b', 2.4);
      ctx.strokeStyle = '#ffd86b'; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(ax.X(EF / eV), ax.T); ctx.lineTo(ax.X(EF / eV), H - ax.B); ctx.stroke(); ctx.setLineDash([]); ax.unclip();
      label(ctx, 'dashed grey: density of states ∝ √E   filled: occupied states   yellow: Fermi energy', ax.L + 6, ax.T + 14, '#9fb0d0');
    },
    info: (p) => { const EF = LM.fermiEnergy(p.n), TF = EF / LM.K.k, mean = p.pauli ? 0.6 * EF : 1.5 * LM.K.k * p.T; return `$E_F=${fmt(EF / LM.K.eV)}$ eV, $T_F=E_F/k_B=${fmt(TF)}$ K. Mean energy per electron ${fmt(mean / LM.K.eV)} eV ${p.pauli ? `(3/5 $E_F$: almost all electrons are frozen; only a fraction $\\sim T/T_F=${fmt(p.T / TF)}$ can be excited, hence $C_V=\\frac{\\pi^2}{2}Nk_B\\,T/T_F$)` : `(classical $\\frac32k_BT$: without the Pauli principle all electrons would share the thermal energy and $C_V=\\frac32Nk_B$, which metals do not show)`}.`; },
  },
  // ---------------------------------------------------------------- QM: oscillator, eigenstate superpositions and coherent states
  ho: {
    animated: true,
    controls: [
      { id: 'coh', label: 'coherent state (else two eigenstates)', type: 'toggle', value: false },
      { id: 'alpha', label: 'coherent amplitude $\\alpha$', min: 0, max: 3, step: 0.05, value: 1.5 },
      { id: 'n1', label: 'eigenstate $n_1$', min: 0, max: 6, step: 1, value: 0 },
      { id: 'n2', label: 'eigenstate $n_2$', min: 0, max: 6, step: 1, value: 1 },
      { id: 'mix', label: 'weight of $n_2$', min: 0, max: 1, step: 0.05, value: 0.5 },
    ],
    draw(ctx, p, t) {
      const xs = lin(-7, 7, 281), co = p.coh ? LM.coherentCoeffs(p.alpha, 0) : [{ n: p.n1, re: Math.sqrt(1 - p.mix), im: 0 }, ...(p.n2 !== p.n1 || p.mix > 0 ? [{ n: p.n2, re: Math.sqrt(p.mix), im: 0 }] : [])];
      const s = LM.hoState(co, xs, t), ax = axes(ctx, { xr: [-7, 7], yr: [0, 0.9], xlabel: 'position x / √(ħ/mω)', ylabel: '|ψ(x,t)|²' });
      ax.clip(); ctx.strokeStyle = '#33425f'; ctx.beginPath(); xs.forEach((x, i) => { const px = ax.X(x), py = ax.Y(Math.min(0.9, 0.18 * x * x / 1.0 * 0 + (x * x) / 2 / 20)); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }); ctx.stroke();
      ctx.fillStyle = 'rgba(108,182,255,0.3)'; ctx.beginPath(); ctx.moveTo(ax.X(-7), ax.Y(0)); xs.forEach((x, i) => ctx.lineTo(ax.X(x), ax.Y(Math.min(0.9, s.dens[i])))); ctx.lineTo(ax.X(7), ax.Y(0)); ctx.fill();
      curve(ctx, ax, (x) => s.dens[Math.round((x + 7) / 14 * 280)], xs, '#6cb6ff', 2.4);
      ctx.fillStyle = '#ffd86b'; ctx.beginPath(); ctx.arc(ax.X(s.xmean), ax.Y(0.03), 6, 0, 7); ctx.fill(); ax.unclip();
      label(ctx, 'blue: probability density   yellow dot: ⟨x⟩   grey: parabolic potential (scaled)', ax.L + 6, ax.T + 14, '#9fb0d0');
    },
    info: (p) => p.coh ? `Coherent state $|\\alpha\\rangle$: $\\langle x\\rangle=\\sqrt2\\,\\alpha\\cos\\omega t$, the packet keeps its shape and swings like a classical particle, $\\Delta x\\,\\Delta p=\\hbar/2$.` : (p.n1 === p.n2 ? 'One eigenstate: $|\\psi|^2$ does not depend on time and $\\langle x\\rangle=0$.' : Math.abs(p.n1 - p.n2) % 2 === 0 ? `$n_1,n_2$ have the same parity: $\\langle x\\rangle=0$ at all times (the matrix element $\\langle n_1|x|n_2\\rangle$ vanishes), but the density breathes at frequency $${Math.abs(p.n1 - p.n2)}\\omega$.` : `$\\langle x\\rangle$ oscillates at frequency $\\omega|n_1-n_2|=${Math.abs(p.n1 - p.n2)}\\omega$ because $\\langle n|x|m\\rangle\\ne0$ only for $m=n\\pm1$ (here $|n_1-n_2|$ is odd; it is fully harmonic only for neighbours).`),
  },
  // ---------------------------------------------------------------- QM: two-level system / avoided crossing and perturbation theory
  avoided: {
    controls: [
      { id: 'V', label: 'coupling $V$', min: 0.02, max: 1.2, step: 0.01, value: 0.3 },
      { id: 'pt2', label: 'show 2nd-order perturbation theory', type: 'toggle', value: true },
      { id: 'ex', label: 'show the exact eigenvalues', type: 'toggle', value: true },
      { id: 'off', label: 'switch the coupling off ($V=0$)', type: 'toggle', value: false },
    ],
    draw(ctx, p) {
      const V = p.off ? 0 : p.V, Ds = lin(-3, 3, 400), ax = axes(ctx, { xr: [-3, 3], yr: [-2.2, 2.2], xlabel: 'unperturbed splitting Δ = ε₂ − ε₁', ylabel: 'energy' }); ax.clip();
      curve(ctx, ax, (D) => -D / 2, Ds, '#4a5d85', 1.5, [6, 4]); curve(ctx, ax, (D) => D / 2, Ds, '#4a5d85', 1.5, [6, 4]);
      if (p.pt2 && V > 0) { curve(ctx, ax, (D) => (Math.abs(D) > 2.2 * V ? LM.twoLevel(D, V).second[0] : NaN), Ds, '#7dffb0', 2, [3, 3]); curve(ctx, ax, (D) => (Math.abs(D) > 2.2 * V ? LM.twoLevel(D, V).second[1] : NaN), Ds, '#7dffb0', 2, [3, 3]); }
      if (p.ex) { curve(ctx, ax, (D) => LM.twoLevel(D, V).exact[0], Ds, '#6cb6ff', 2.8); curve(ctx, ax, (D) => LM.twoLevel(D, V).exact[1], Ds, '#6cb6ff', 2.8); }
      ax.unclip(); label(ctx, 'grey dashed: unperturbed levels   green dashed: 2nd order (breaks down at Δ ≈ 2V)   blue: exact', ax.L + 6, ax.T + 14, '#9fb0d0');
    },
    info: (p) => `Exact $E_\\pm=\\pm\\frac12\\sqrt{\\Delta^2+4V^2}$. Non-degenerate PT: $E_1\\approx\\varepsilon_1-V^2/\\Delta$, valid only for $|\\Delta|\\gg V$. At $\\Delta=0$ the levels are degenerate and the first-order shift is already $\\pm V$ (degenerate PT); the levels never cross: minimum gap $2V=${fmt(2 * (p.off ? 0 : p.V))}$.`,
  },
  // ---------------------------------------------------------------- solid state: 2D lattice, reciprocal lattice, Brillouin zone, Bragg peaks (HS23 problem 1)
  lattice2d: {
    controls: [
      { id: 'a', label: 'lattice constant $a$ (Å)', min: 3, max: 9, step: 0.1, value: 6 },
      { id: 'b', label: 'lattice constant $b$ (Å)', min: 3, max: 9, step: 0.1, value: 4 },
      { id: 'g', label: 'angle $\\gamma$ (°)', min: 60, max: 120, step: 1, value: 90 },
      { id: 'f2', label: 'second atom scattering amplitude $f_2/f_1$ (basis at ½,½)', min: 0, max: 2, step: 0.05, value: 1 },
      { id: 'lam', label: 'neutron wavelength $\\lambda$ (Å)', min: 1, max: 5, step: 0.05, value: 2.36 },
    ],
    draw(ctx, p) {
      const lat = LM.lattice2d(p.a, p.b, p.g); ctx.fillStyle = '#0b1220'; ctx.fillRect(0, 0, W, H);
      // left panel: real space
      const sc = 22, ox = 150, oy = H / 2 + 30;
      const P = (v, panel) => [ox + v[0] * sc, oy - v[1] * sc];
      ctx.strokeStyle = '#1e2a40'; ctx.strokeRect(6, 6, 300, H - 12); ctx.strokeRect(314, 6, 320, H - 12);
      for (let i = -4; i <= 4; i++) for (let j = -4; j <= 4; j++) {
        const R = [i * lat.a1[0] + j * lat.a2[0], i * lat.a1[1] + j * lat.a2[1]], c = P(R); if (c[0] < 12 || c[0] > 300 || c[1] < 12 || c[1] > H - 12) continue;
        ctx.fillStyle = '#6cb6ff'; ctx.beginPath(); ctx.arc(c[0], c[1], 5, 0, 7); ctx.fill();
        const B = [R[0] + 0.5 * (lat.a1[0] + lat.a2[0]), R[1] + 0.5 * (lat.a1[1] + lat.a2[1])], cb = P(B);
        if (cb[0] > 12 && cb[0] < 300 && cb[1] > 12 && cb[1] < H - 12 && p.f2 > 0) { ctx.fillStyle = '#ffa94d'; ctx.beginPath(); ctx.arc(cb[0], cb[1], 3 + 3 * Math.min(p.f2, 1.5), 0, 7); ctx.fill(); }
      }
      const O = P([0, 0]), A1 = P(lat.a1), A2 = P(lat.a2), A12 = P([lat.a1[0] + lat.a2[0], lat.a1[1] + lat.a2[1]]);
      ctx.strokeStyle = '#7dffb0'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(...O); ctx.lineTo(...A1); ctx.lineTo(...A12); ctx.lineTo(...A2); ctx.closePath(); ctx.stroke();
      const rv = []; for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) if (i || j) rv.push([i * lat.a1[0] + j * lat.a2[0], i * lat.a1[1] + j * lat.a2[1]]);
      const ws = LM.voronoiCell(rv); ctx.strokeStyle = '#ffd86b'; ctx.setLineDash([4, 3]); ctx.beginPath(); ws.forEach((q, i) => { const c = P(q); i ? ctx.lineTo(...c) : ctx.moveTo(...c); }); ctx.closePath(); ctx.stroke(); ctx.setLineDash([]);
      label(ctx, 'real space: cell (green), Wigner–Seitz cell (yellow)', 14, 22, '#9fb0d0');
      // right panel: reciprocal lattice with structure-factor intensities and the first Brillouin zone
      const rs = 17 / (2 * Math.PI / Math.max(p.a, p.b)) * 0.5, rx = 474, ry = H / 2 + 20, Q = (g) => [rx + g[0] * rs * 6.2, ry - g[1] * rs * 6.2];
      const peaks = [];
      for (let h = -4; h <= 4; h++) for (let k = -4; k <= 4; k++) {
        const G = [h * lat.b1[0] + k * lat.b2[0], h * lat.b1[1] + k * lat.b2[1]], I = LM.intensity2(h, k, 1, p.f2), c = Q(G); if (c[0] < 322 || c[0] > 626 || c[1] < 14 || c[1] > H - 14) continue;
        ctx.fillStyle = I > 1e-9 ? '#ff8a5b' : '#33415f'; ctx.beginPath(); ctx.arc(c[0], c[1], I > 1e-9 ? 2 + 4.5 * Math.sqrt(I / (1 + p.f2) ** 2) : 2, 0, 7); ctx.fill();
        const Gm = Math.hypot(...G), k0 = (2 * Math.PI) / p.lam; if ((h || k) && I > 1e-9 && Gm <= 2 * k0) peaks.push({ h, k, Gm, phi: (2 * Math.asin(Gm / (2 * k0)) * 180) / Math.PI, I });
      }
      const rvecs = []; for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) if (i || j) rvecs.push([i * lat.b1[0] + j * lat.b2[0], i * lat.b1[1] + j * lat.b2[1]]);
      const bz = LM.voronoiCell(rvecs); ctx.strokeStyle = '#7dffb0'; ctx.lineWidth = 2; ctx.beginPath(); bz.forEach((q, i) => { const c = Q(q); i ? ctx.lineTo(...c) : ctx.moveTo(...c); }); ctx.closePath(); ctx.stroke();
      label(ctx, 'reciprocal lattice: dot size ∝ |F|², first Brillouin zone (green)', 322, 22, '#9fb0d0');
      this._peaks = peaks.sort((x, y) => x.Gm - y.Gm).filter((q, i, a) => a.findIndex((z) => Math.abs(z.Gm - q.Gm) < 1e-6 && z.I === q.I) === i).slice(0, 4); this._bz = bz; this._lat = lat;
    },
    info(p) {
      const lat = LM.lattice2d(p.a, p.b, p.g), bzA = LM.polyArea(LM.voronoiCell((() => { const v = []; for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) if (i || j) v.push([i * lat.b1[0] + j * lat.b2[0], i * lat.b1[1] + j * lat.b2[1]]); return v; })()));
      const pk = (this._peaks || []).map((q) => `(${q.h},${q.k}): $|G|=${fmt(q.Gm)}$ Å$^{-1}$, scattering angle $\\varphi=${fmt(q.phi)}^\\circ$, $I\\propto${fmt(q.I)}$`).join('; ');
      return `Cell area $A=${fmt(lat.A)}$ Å², Brillouin-zone area $(2\\pi)^2/A=${fmt(bzA)}$ Å$^{-2}$. With $\\vec K=\\vec G$, $|G|=2k\\sin(\\varphi/2)$ and $k=2\\pi/\\lambda=${fmt(2 * Math.PI / p.lam)}$ Å$^{-1}$. First peaks: ${pk || 'none (wavelength too long)'}. Basis: $F=f_1+f_2e^{i\\pi(h+k)}$ so for $f_2=f_1$ all reflections with $h+k$ odd are extinct (the cell is really centred).`;
    },
  },
  // ---------------------------------------------------------------- astro: uniform-density star, hydrostatic equilibrium, eps ~ T^n (Winter 2024 open Q1)
  stellar: {
    controls: [
      { id: 'n', label: 'temperature exponent $n$ in $\\varepsilon\\propto T^{n}$ (pp ≈ 4, CNO ≈ 16–20)', min: 1, max: 20, step: 0.5, value: 4 },
      { id: 'rho', label: 'constant density $\\rho$ (kg/m$^3$), mass fixed to $1\\,M_\\odot$', min: 2, max: 6, step: 0.02, value: Math.log10(1410), log: true },
      { id: 'f', label: 'fraction $\\varepsilon/\\varepsilon_c$ to look for', min: -3, max: -0.1, step: 0.02, value: -1, log: true },
      { id: 'rad', label: 'radiation pressure instead of ideal-gas pressure', type: 'toggle', value: false },
      { id: 'noeps', label: 'remove the temperature dependence (n = 0: energy released uniformly)', type: 'toggle', value: false },
    ],
    draw(ctx, p) {
      const n = p.noeps ? 0 : p.n, xs = lin(0, 1, 120), ax = axes(ctx, { xr: [0, 1], yr: [0, 1.05], xlabel: 'r / R', ylabel: 'value / central value' }), rad = p.rad;
      ax.clip();
      curve(ctx, ax, (x) => 1 - x * x, xs, '#7dffb0', 1.8, [6, 4]);
      curve(ctx, ax, (x) => (rad ? Math.pow(1 - x * x, 0.25) : 1 - x * x), xs, '#ffa94d', 2.2);
      curve(ctx, ax, (x) => LM.epsRatio(x, n, rad), xs, '#6cb6ff', 2.8);
      const xf = LM.radiusAtFraction(p.f, n || 1e-9, rad);
      ctx.strokeStyle = '#ffd86b'; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(ax.L, ax.Y(p.f)); ctx.lineTo(W - ax.R, ax.Y(p.f)); if (n > 0) { ctx.moveTo(ax.X(xf), ax.T); ctx.lineTo(ax.X(xf), H - ax.B); } ctx.stroke(); ctx.setLineDash([]);
      ax.unclip(); label(ctx, 'green dashed: P(r)/P_c   orange: T(r)/T_c   blue: ε(r)/ε_c   yellow: chosen fraction and its radius', ax.L + 6, ax.T + 14, '#9fb0d0');
    },
    info(p) {
      const n = p.noeps ? 0 : p.n, rho = p.rho, R = LM.starR(LM.K2.Msun, rho), Pc = LM.hydroP(0, rho, R), Tc = LM.tempProfile(0, rho, R, 0.6, p.rad), xf = LM.radiusAtFraction(p.f, n || 1e-9, p.rad);
      return `$R=(3M/4\\pi\\rho)^{1/3}=${fmt(R / 6.957e8)}\\,R_\\odot$, $P_c=\\frac{2\\pi}{3}G\\rho^2R^2=${fmt(Pc)}$ Pa, $T_c=${fmt(Tc)}$ K (${p.rad ? 'from $P=aT^4/3$' : '$\\mu=0.6$, $T=\\mu m_HP/\\rho k_B$'}). ${p.rad ? '$T\\propto(R^2-r^2)^{1/4}$, so $\\varepsilon\\propto(1-r^2/R^2)^{n/4}$' : '$T\\propto R^2-r^2$, so $\\varepsilon/\\varepsilon_c=(1-r^2/R^2)^{n}$'}. ${n > 0 ? `$\\varepsilon=${fmt(p.f)}\\,\\varepsilon_c$ at $r/R=\\sqrt{1-f^{${p.rad ? '4/n' : '1/n'}}}=${fmt(xf)}$.` : 'With n = 0 the fraction is never reached.'} A large $n$ concentrates the burning in the core: the core is ~${fmt(xf)} of the radius for the chosen fraction.`;
    },
  },
  // ---------------------------------------------------------------- astro: Eddington luminosity vs mass-luminosity relation
  eddington: {
    controls: [
      { id: 'kap', label: 'opacity $\\chi$ (m$^2$/kg); electron scattering: 0.04', min: -3, max: -0.5, step: 0.02, value: Math.log10(0.04), log: true },
      { id: 'alpha', label: 'mass–luminosity exponent $\\alpha$ in $L\\propto M^{\\alpha}$', min: 2, max: 4.5, step: 0.05, value: 3 },
      { id: 'es', label: 'electron scattering present (off: opacity drops 100×, only bound-free left)', type: 'toggle', value: true },
    ],
    draw(ctx, p) {
      const kap = p.es ? p.kap : p.kap / 100, Ms = logsp(1, 1000, 120), ax = axes(ctx, { xr: [1, 1000], yr: [1, 1e9], xlog: true, ylog: true, xlabel: 'mass M (M☉)', ylabel: 'luminosity L (L☉)' });
      ax.clip(); curve(ctx, ax, (M) => LM.eddington(M, kap), Ms, '#ff8a5b', 2.6); curve(ctx, ax, (M) => Math.pow(M, p.alpha), Ms, '#6cb6ff', 2.6);
      const Mx = LM.eddCross(kap, p.alpha); if (Mx >= 1 && Mx <= 1000) { ctx.fillStyle = '#ffd86b'; ctx.beginPath(); ctx.arc(ax.X(Mx), ax.Y(Math.pow(Mx, p.alpha)), 6, 0, 7); ctx.fill(); }
      ax.unclip(); label(ctx, 'orange: Eddington limit (linear in M)   blue: main sequence L ∝ M^α   yellow: crossing', ax.L + 6, ax.T + 14, '#9fb0d0');
    },
    info(p) { const kap = p.es ? p.kap : p.kap / 100, Mx = LM.eddCross(kap, p.alpha); return `$L_{Edd}=\\frac{4\\pi cGM}{\\chi}=${fmt(LM.eddington(1, kap))}\\,L_\\odot\\,(M/M_\\odot)$ for $\\chi=${fmt(kap)}$ m$^2$/kg. Setting $M^{\\alpha}=L_{Edd}$ gives $M^{\\alpha-1}=${fmt(LM.eddington(1, kap))}$, i.e. $M=${fmt(Mx)}\\,M_\\odot$ — heavier stars would exceed the limit and blow off their envelopes. With $\\alpha=3$ and $\\chi=0.04$: $M^2=3.3\\times10^4$, $M\\approx180\\,M_\\odot$. Halving the opacity doubles $L_{Edd}$.`; },
  },
  // ---------------------------------------------------------------- solid state: Drude / Matthiessen / Hall (HS23 problem 2b)
  drude: {
    controls: [
      { id: 'r0', label: 'residual resistivity $\\rho_0$ from defects (nΩ·m)', min: -1, max: 2.5, step: 0.02, value: Math.log10(3), log: true },
      { id: 'A', label: 'phonon strength: $\\rho_{ph}\\to A\\,T/\\Theta_D$ for $T\\gg\\Theta_D$ (nΩ·m)', min: 0.5, max: 3, step: 0.02, value: Math.log10(20), log: true },
      { id: 'Th', label: 'Debye temperature $\\Theta_D$ (K)', min: 1.7, max: 2.9, step: 0.02, value: Math.log10(343), log: true },
      { id: 'n', label: 'electron density $n$ (m$^{-3}$)', min: 27.5, max: 29.7, step: 0.02, value: Math.log10(8.47e28), log: true },
      { id: 'def', label: 'defects / impurities present', type: 'toggle', value: true },
      { id: 'ph', label: 'phonons present', type: 'toggle', value: true },
    ],
    draw(ctx, p) {
      const r0 = p.def ? p.r0 : 0, ph = (T) => (p.ph ? LM.rhoPhonon(T, p.Th, p.A) : 0), Ts = lin(0.5, 400, 200), top = Math.max(r0 + ph(400), 1) * 1.1;
      const ax = axes(ctx, { xr: [0, 400], yr: [0, top], xlabel: 'temperature T (K)', ylabel: 'ρ(T) (nΩ·m)', pad: { l: 46 } }); ax.clip();
      ctx.strokeStyle = '#ff8a5b'; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(ax.L, ax.Y(r0)); ctx.lineTo(W - ax.R, ax.Y(r0)); ctx.stroke(); ctx.setLineDash([]);
      curve(ctx, ax, ph, Ts, '#7dffb0', 1.8, [5, 4]); curve(ctx, ax, (T) => r0 + ph(T), Ts, '#6cb6ff', 2.8);
      ctx.strokeStyle = '#ffd86b'; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(ax.X(p.Th), ax.T); ctx.lineTo(ax.X(p.Th), H - ax.B); ctx.stroke(); ctx.setLineDash([]); ax.unclip();
      label(ctx, 'blue: ρ(T) total   orange: ρ₀ (defects)   green: phonons (T⁵ → linear)   yellow: Θ_D', ax.L + 6, ax.T + 14, '#9fb0d0');
    },
    info(p) { const r0 = p.def ? p.r0 : 0, rt = (r0 + (p.ph ? LM.rhoPhonon(300, p.Th, p.A) : 0)) * 1e-9, RH = LM.hallCoeff(p.n);
      return `Matthiessen: $\\rho=\\rho_0+\\rho_{ph}(T)$ — scattering rates add. At 300 K: $\\rho=${fmt(rt * 1e9)}$ nΩ·m ${rt > 0 ? `→ $\\tau=m/(ne^2\\rho)=${fmt(LM.drudeTau(p.n, rt))}$ s` : '(no scattering: infinite τ)'}. Hall coefficient $R_H=-1/(ne)=${fmt(RH)}$ m$^3$/C (independent of scattering!), Hall mobility $\\mu=|R_H|/\\rho=${rt > 0 ? fmt(Math.abs(RH) / rt * 1e4) : '∞'}$ cm$^2$/Vs. At $T\\to0$ only $\\rho_0=${fmt(r0)}$ nΩ·m remains; phonons give $T^5$ below and a linear rise above $\\Theta_D$.`; },
  },
  // ---------------------------------------------------------------- solid state: 1D cosine bands, effective masses, carrier densities (HS23 problem 3)
  semi1d: {
    controls: [
      { id: 'EG', label: 'band gap $E_G$ (eV)', min: 0.3, max: 3, step: 0.05, value: 1.5 },
      { id: 'tc', label: 'conduction-band hopping $t_c$ (eV): $m_c^*=\\hbar^2/2t_ca^2$', min: 0.2, max: 4, step: 0.05, value: 1 },
      { id: 'tv', label: 'valence-band hopping $t_v$ (eV): $m_v^*=\\hbar^2/2t_va^2$', min: 0.2, max: 4, step: 0.05, value: 2 },
      { id: 'T', label: 'temperature $T$ (K)', min: 1.7, max: 3.3, step: 0.02, value: Math.log10(300), log: true },
      { id: 'mu', label: 'chemical potential $\\mu$ (eV, zero at the valence-band top)', min: -0.3, max: 3.3, step: 0.01, value: 0.75 },
      { id: 'intr', label: 'put $\\mu$ at its intrinsic value (n = p)', type: 'toggle', value: false },
      { id: 'eq', label: 'equal band curvature ($t_v=t_c$)', type: 'toggle', value: false },
    ],
    draw(ctx, p) {
      const a = 5e-10, tv = p.eq ? p.tc : p.tv, mu = p.intr ? LM.muIntrinsic(p.T, a, p.EG, p.tc, tv) : p.mu, kT = (LM.K.k * p.T) / LM.K2.e, ks = lin(-Math.PI, Math.PI, 160);
      const ax = axes(ctx, { xr: [-1, 1], yr: [-4 * tv - 0.3, p.EG + 4 * p.tc + 0.3], xlabel: 'k a / π', ylabel: 'E (eV)', pad: { l: 46 } }); ax.clip();
      ax.unclip(); ax.clip();
      const ks1 = lin(-1, 1, 160), Ec = (x) => LM.bandC(x * Math.PI, 1, p.EG, p.tc), Ev = (x) => LM.bandV(x * Math.PI, 1, tv), occ = (E) => 1 / (Math.exp(Math.max(-700, Math.min(700, (E - mu) / kT))) + 1);
      ctx.fillStyle = 'rgba(108,182,255,0.12)'; ctx.fillRect(ax.L, ax.Y(p.EG + 4 * p.tc), W - ax.L - ax.R, ax.Y(p.EG) - ax.Y(p.EG + 4 * p.tc)); ctx.fillStyle = 'rgba(255,169,77,0.12)'; ctx.fillRect(ax.L, ax.Y(0), W - ax.L - ax.R, ax.Y(-4 * tv) - ax.Y(0));
      curve(ctx, ax, Ec, ks1, '#6cb6ff', 2.6); curve(ctx, ax, Ev, ks1, '#ffa94d', 2.6);
      for (let i = 0; i < ks1.length; i += 2) { const x = ks1[i]; ctx.fillStyle = `rgba(108,182,255,${Math.min(1, 2.5 * occ(Ec(x)))})`; if (occ(Ec(x)) > 0.01) { ctx.beginPath(); ctx.arc(ax.X(x), ax.Y(Ec(x)), 3.5, 0, 7); ctx.fill(); } const h = 1 - occ(Ev(x)); if (h > 0.01) { ctx.fillStyle = `rgba(255,120,120,${Math.min(1, 2.5 * h)})`; ctx.beginPath(); ctx.arc(ax.X(x), ax.Y(Ev(x)), 3.5, 0, 7); ctx.fill(); } }
      ctx.strokeStyle = '#ffd86b'; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(ax.L, ax.Y(mu)); ctx.lineTo(W - ax.R, ax.Y(mu)); ctx.stroke(); ctx.setLineDash([]); ax.unclip();
      label(ctx, 'blue: conduction band (blue dots: electrons)   orange: valence band (red dots: holes)   yellow: μ', ax.L + 6, ax.T + 14, '#9fb0d0');
    },
    info(p) {
      const a = 5e-10, tv = p.eq ? p.tc : p.tv, mi = LM.muIntrinsic(p.T, a, p.EG, p.tc, tv), mu = p.intr ? mi : p.mu, c = LM.carriers1d(mu, p.T, a, p.EG, p.tc, tv), kT = (LM.K.k * p.T) / LM.K2.e;
      return `$m_c^*=${fmt(LM.effMass(p.tc, a) / LM.K.me)}\\,m_e$, $m_v^*=${fmt(LM.effMass(tv, a) / LM.K.me)}\\,m_e$ (curvature at $k=0$, $a=0.5$ nm). $\\mu_{intr}=E_G/2+\\frac{k_BT}{4}\\ln(m_v^*/m_c^*)=${fmt(mi)}$ eV (band-gap middle ${fmt(p.EG / 2)} eV). At $\\mu=${fmt(mu)}$ eV, $k_BT=${fmt(kT * 1000)}$ meV: $n=${fmt(c.n * a)}$ and $p=${fmt(c.p * a)}$ per cell (per length: ${fmt(c.n)}, ${fmt(c.p)} m$^{-1}$). Mass action: $np\\propto e^{-E_G/k_BT}$ independent of $\\mu$ while non-degenerate; $E_G/k_BT=${fmt(p.EG / kT)}$. ${p.eq ? 'Equal curvature: $\\mu_{intr}$ sits exactly at mid-gap.' : ''}`;
    },
  },
  // ---------------------------------------------------------------- solid state: Curie-Weiss law and exchange (mean-field Weiss temperature)
  curie: {
    controls: [
      { id: 'S', label: 'spin $S$', min: 0.5, max: 4, step: 0.5, value: 2.5 },
      { id: 'J1', label: 'nearest-neighbour exchange $J_1$ (meV), $z_1=6$ ($J>0$ ferro, $J<0$ antiferro)', min: -3, max: 3, step: 0.05, value: 0.5 },
      { id: 'J2', label: 'next-nearest exchange $J_2$ (meV), $z_2=12$', min: -3, max: 3, step: 0.05, value: 0 },
      { id: 'off', label: 'switch the exchange off (pure Curie paramagnet)', type: 'toggle', value: false },
    ],
    draw(ctx, p) {
      const Tw = p.off ? 0 : LM.weissT(p.S, p.J1, p.J2), C = LM.curieC(p.S), lo = (-200 - Tw) / C, hi = (600 - Tw) / C, ax = axes(ctx, { xr: [-200, 600], yr: [Math.min(lo, -50 / C), Math.max(hi, 50 / C)], xlabel: 'temperature T (K)', ylabel: '1/χ  (SI)', pad: { l: 56 } });
      ax.clip(); const Ts = lin(-200, 600, 200); curve(ctx, ax, (T) => LM.chiInv(T, p.S, 0), Ts, '#7f8aa6', 1.5, [5, 4]);
      curve(ctx, ax, (T) => LM.chiInv(T, p.S, Tw), Ts, '#6cb6ff', 1.5, [3, 4]); curve(ctx, ax, (T) => (T >= Math.max(Tw, 0) ? LM.chiInv(T, p.S, Tw) : NaN), Ts, '#6cb6ff', 2.8);
      ctx.strokeStyle = '#33425f'; ctx.beginPath(); ctx.moveTo(ax.X(0), ax.T); ctx.lineTo(ax.X(0), H - ax.B); ctx.moveTo(ax.L, ax.Y(0)); ctx.lineTo(W - ax.R, ax.Y(0)); ctx.stroke();
      ctx.fillStyle = '#ffd86b'; ctx.beginPath(); ctx.arc(ax.X(Tw), ax.Y(0), 6, 0, 7); ctx.fill(); ax.unclip();
      label(ctx, 'solid: 1/χ above the transition   dashed blue: extrapolation to 1/χ = 0   grey: pure Curie   yellow: T_W', ax.L + 6, ax.T + 14, '#9fb0d0');
    },
    info(p) { const Tw = p.off ? 0 : LM.weissT(p.S, p.J1, p.J2), C = LM.curieC(p.S);
      return `Weiss temperature (mean field, $H=-\\sum_{i<j}J_{ij}\\vec S_i\\cdot\\vec S_j$): $T_W=\\frac{2S(S+1)}{3k_B}\\sum_j zJ=${fmt(Tw)}$ K, Curie constant (for $n=10^{28}$ m$^{-3}$, $g=2$) $C=\\frac{\\mu_0 n g^2\\mu_B^2S(S+1)}{3k_B}=${fmt(C)}$ K. $\\chi=C/(T-T_W)$. ${p.off ? 'No exchange: $T_W=0$, pure Curie law, 1/χ passes through the origin.' : Tw > 1 ? `$T_W>0$: ferromagnet, 1/χ hits zero at $T_C\\approx T_W$ and the paramagnetic law fails below.` : Tw < -1 ? '$T_W<0$ (antiferromagnet): the straight line meets the T axis at negative T; the order sets in at the Néel temperature $T_N>0$ where $\\chi$ has a cusp.' : '$T_W\\approx0$: ferro and antiferro contributions cancel.'} Slope of 1/χ gives $S$, intercept gives the exchange.`; },
  },
  // ---------------------------------------------------------------- QM: spin-1/2 precession (Larmor), Bloch vector
  spin12: {
    animated: true,
    controls: [
      { id: 'th', label: 'initial polar angle of $\\langle\\vec S\\rangle$ from $z$ (°)', min: 0, max: 180, step: 1, value: 90 },
      { id: 'w', label: 'Larmor frequency $\\omega=\\gamma B$ (relative; animation speed)', min: 0.1, max: 3, step: 0.05, value: 1 },
      { id: 'tilt', label: 'angle of $\\vec B$ from the $z$-axis, towards $x$ (°)', min: 0, max: 90, step: 1, value: 0 },
      { id: 'on', label: 'magnetic field switched on', type: 'toggle', value: true },
    ],
    draw(ctx, p, t) {
      const th = (p.th * Math.PI) / 180, tl = (p.tilt * Math.PI) / 180, n = [Math.sin(tl), 0, Math.cos(tl)], w = p.on ? 1 : 0, tau = p.on ? p.w * t : 0;
      const taus = lin(0, 4 * Math.PI, 200), ax = axes(ctx, { xr: [0, 4 * Math.PI], yr: [-1.1, 1.1], xlabel: 'ω t (rad)', ylabel: '', pad: { l: 330 } });
      const S = (tt) => LM.spinExp(th, 0, w, n, tt); ax.clip();
      curve(ctx, ax, (tt) => S(tt)[0], taus, '#ff8a5b', 2.4); curve(ctx, ax, (tt) => S(tt)[1], taus, '#7dffb0', 2.4); curve(ctx, ax, (tt) => S(tt)[2], taus, '#6cb6ff', 2.4);
      const tm = tau % (4 * Math.PI); ctx.strokeStyle = '#ffd86b'; ctx.beginPath(); ctx.moveTo(ax.X(tm), ax.T); ctx.lineTo(ax.X(tm), H - ax.B); ctx.stroke(); ax.unclip();
      label(ctx, '⟨S_x⟩ orange   ⟨S_y⟩ green   ⟨S_z⟩ blue   (in units of ħ/2)', ax.L + 6, ax.T + 14, '#9fb0d0');
      // Bloch sphere on the left
      const cx = 150, cy = 170, R = 105, P = (v) => [cx + R * (v[0] + 0.4 * v[1]), cy - R * (v[2] + 0.25 * v[1])];
      ctx.fillStyle = '#0b1220'; ctx.fillRect(0, 0, 276, H); ctx.strokeStyle = '#3a4a6a'; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
      const axisLine = (v, c, name) => { const q = P(v), o = P([0, 0, 0]); ctx.strokeStyle = c; ctx.beginPath(); ctx.moveTo(...o); ctx.lineTo(...q); ctx.stroke(); label(ctx, name, q[0] + 4, q[1] - 4, c); };
      axisLine([1, 0, 0], '#ff8a5b', 'x'); axisLine([0, 1, 0], '#7dffb0', 'y'); axisLine([0, 0, 1], '#6cb6ff', 'z');
      if (p.on) { const q = P(n); ctx.strokeStyle = '#ffd86b'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(...P([0, 0, 0])); ctx.lineTo(q[0] * 1.0, q[1]); ctx.stroke(); ctx.lineWidth = 1; label(ctx, 'B', q[0] + 6, q[1] - 6, '#ffd86b'); }
      ctx.strokeStyle = 'rgba(207,224,255,0.35)'; ctx.setLineDash([3, 3]); ctx.beginPath(); lin(0, 2 * Math.PI, 90).forEach((tt, i) => { const q = P(S(tt)); i ? ctx.lineTo(...q) : ctx.moveTo(...q); }); ctx.stroke(); ctx.setLineDash([]);
      const s = S(tau), q = P(s); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(...P([0, 0, 0])); ctx.lineTo(...q); ctx.stroke(); ctx.lineWidth = 1; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(q[0], q[1], 5, 0, 7); ctx.fill();
      label(ctx, 'Bloch vector ⟨S⟩ (white) precesses about B (yellow)', 10, 20, '#9fb0d0');
    },
    info(p) { const th = (p.th * Math.PI) / 180, tl = (p.tilt * Math.PI) / 180; const ang = p.on ? `The vector precesses on a cone about $\\vec B$ with $\\omega_L=\\gamma B$ ($=eB/m_e=1.76\\times10^{11}\\,\\text{rad/s per tesla}$ for an electron, $g=2$); the angle to $\\vec B$ and $|\\langle\\vec S\\rangle|=\\hbar/2$ are constant.` : 'Field off: $H=0$, the state does not evolve and $\\langle\\vec S\\rangle$ is constant.';
      return `Start: $\\langle S_z\\rangle=\\frac\\hbar2\\cos\\theta=${fmt(Math.cos(th))}\\,\\hbar/2$. For $\\vec B\\parallel\\hat z$: $\\langle S_z\\rangle$ is constant, $\\langle S_x\\rangle=\\frac\\hbar2\\sin\\theta\\cos\\omega t$, $\\langle S_y\\rangle=-\\frac\\hbar2\\sin\\theta\\sin\\omega t$ (for $H=-\\gamma BS_z$). ${ang} ${p.tilt > 0 && p.on ? `With $\\vec B$ tilted by ${p.tilt}° $\\langle S_z\\rangle$ oscillates as well (the cone axis is $\\vec B$, not $\\hat z$); the energy splitting is still $\\hbar\\gamma B$.` : ''}`; },
  },
};

// widgets from the extension modules (src/labs-ext/)
const KIT = { axes, curve, lin, logsp, label, fmt, W, H, LM };
for (const make of EXT) Object.assign(LABS, make(KIT));

// ================================================================== mounting
export function mountLab(enc, el, env, helpers) {
  env.previewBanner(enc);
  const spec = LABS[enc.widget]; if (!spec) { el.innerHTML = `<p class="msg bad">Unknown lab widget ${enc.widget}</p>`; return; }
  const p = {}, valueOf = (c) => (c.log ? Math.pow(10, c.value) : c.value);
  spec.controls.forEach((c) => { p[c.id] = c.type === 'toggle' ? c.value : valueOf(c); });
  el.innerHTML = M(`<h2>${enc.title} <span class="src">(experiment)</span></h2>${helpers.sourceHtml(enc.source)}<p>${enc.intro}</p>
    <canvas class="labcv" width="${W}" height="${H}"></canvas>
    <div class="labctl">${spec.controls.map((c) => c.type === 'toggle'
      ? `<label class="labrow"><input type="checkbox" data-c="${c.id}" ${c.value ? 'checked' : ''}> ${c.label}</label>`
      : `<div class="labrow"><span>${c.label} = <b data-v="${c.id}"></b></span><input type="range" data-c="${c.id}" min="${c.min}" max="${c.max}" step="${c.step}" value="${c.value}"></div>`).join('')}</div>
    <div class="labinfo" id="labinfo"></div><h3>Try this (predict first, then check)</h3><ol class="labtasks">${enc.tasks.map((t) => `<li>${t}</li>`).join('')}</ol>
    <button class="go" id="labdone">I explored it: mark done (+${enc.xp} XP)</button><div id="result"></div>`);
  const cv = el.querySelector('canvas'), ctx = cv.getContext('2d'), info = el.querySelector('#labinfo');
  let t0 = performance.now(), raf = 0, infoKey = '';
  const readInputs = () => { for (const c of spec.controls) { const inp = el.querySelector(`[data-c="${c.id}"]`); if (c.type === 'toggle') p[c.id] = inp.checked; else { const v = +inp.value; p[c.id] = c.log ? Math.pow(10, v) : v; const out = el.querySelector(`[data-v="${c.id}"]`); if (out) out.textContent = fmt(p[c.id]); } } };
  const render = (t) => { spec.draw.call(spec, ctx, p, t); const html = spec.info.call(spec, p); if (html !== infoKey) { infoKey = html; info.innerHTML = M(html); } };
  const loop = () => { render((performance.now() - t0) / 1000); raf = requestAnimationFrame(loop); };
  el.querySelectorAll('[data-c]').forEach((i) => { i.oninput = () => { readInputs(); if (!spec.animated) render(0); }; i.onchange = i.oninput; });
  readInputs(); render(0); if (spec.animated) loop();
  el.querySelector('#labdone').onclick = () => {
    el.querySelector('#labdone').disabled = true; env.flash(true);
    el.querySelector('#result').innerHTML = M(`<p class="msg good">Experiment logged. +${enc.xp} XP</p>${helpers.nextBtn(env)}`); helpers.wireNext(env);
    helpers.finish(enc, true, enc.xp); env.onChange();
  };
  return () => cancelAnimationFrame(raf);
}
