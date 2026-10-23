import * as S from './models-solid-state.js';
export default (kit) => {
  const { axes, curve, lin, logsp, label, fmt, W, H } = kit;
  const col = { b: '#6cb6ff', a: '#ff8a5b', g: '#7dffb0', y: '#ffd86b', m: '#9fb0d0' };
  return {
    // ------------------------------------------------------------ covalent bond: two-site tight binding
    bonddw: {
      controls: [
        { id: 'd', label: 'interatomic distance $d$ (Å)', min: 0.8, max: 3, step: 0.01, value: 1.8 },
        { id: 'ion', label: 'unequal atoms (ionic bond)', type: 'toggle', value: false },
        { id: 'D', label: 'level mismatch $\\Delta=\\epsilon_1-\\epsilon_2$ (eV), used if unequal', min: 0, max: 8, step: 0.1, value: 3 },
        { id: 'tot', label: 'show total energy of 2 electrons (with core repulsion)', type: 'toggle', value: true },
      ],
      draw(ctx, p) {
        const D = p.ion ? p.D : 0, ds = lin(0.8, 3, 160), ax = axes(ctx, { xr: [0.8, 3], yr: [-8, 12], xlabel: 'distance d (Å)', ylabel: 'energy (eV), isolated level at 0' });
        ax.clip();
        ctx.strokeStyle = '#3a4a6a'; ctx.beginPath(); ctx.moveTo(ax.L, ax.Y(0)); ctx.lineTo(W - ax.R, ax.Y(0)); ctx.stroke();
        curve(ctx, ax, (d) => S.twoSite(S.hop(d), D).Ea, ds, col.a, 2.2); curve(ctx, ax, (d) => S.twoSite(S.hop(d), D).Eb, ds, col.b, 2.2);
        if (p.tot) { curve(ctx, ax, (d) => S.bondEnergy(d, D), ds, col.g, 2.6); const de = S.equilibrium(D); ctx.fillStyle = col.y; ctx.beginPath(); ctx.arc(ax.X(de), ax.Y(S.bondEnergy(de, D)), 5, 0, 7); ctx.fill(); }
        ctx.strokeStyle = col.y; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(ax.X(p.d), ax.T); ctx.lineTo(ax.X(p.d), H - ax.B); ctx.stroke(); ctx.setLineDash([]);
        ax.unclip();
        const m = S.twoSite(S.hop(p.d), D), bx0 = 330, bx1 = W - 20, by = 62, X = (x) => bx0 + (x / 6 + 0.5) * (bx1 - bx0); // inset: densities along the bond, x in Å
        ctx.fillStyle = 'rgba(11,18,32,0.92)'; ctx.fillRect(bx0 - 8, 16, bx1 - bx0 + 16, 84);
        const phi = (x, c) => Math.exp(-Math.abs(x - c) / 0.45), x1 = -p.d / 2, x2 = p.d / 2;
        for (const [v, c, lab] of [[m.vb, col.b, 'bonding'], [m.va, col.a, 'antibonding']]) {
          ctx.strokeStyle = c; ctx.lineWidth = 1.8; ctx.beginPath();
          for (let i = 0; i <= 120; i++) { const x = -3 + 6 * i / 120, psi = v[0] * phi(x, x1) + v[1] * phi(x, x2) * (lab === 'bonding' ? 1 : 1), r = psi * psi; const px = X(x), py = by + 36 - r * 34 * (lab === 'bonding' ? 1 : 1); if (i) ctx.lineTo(px, py); else ctx.moveTo(px, py); }
          ctx.stroke();
        }
        ctx.lineWidth = 1; ctx.fillStyle = col.y; for (const x of [x1, x2]) { ctx.beginPath(); ctx.arc(X(x), by + 40, 3, 0, 7); ctx.fill(); }
        label(ctx, '|ψ|² along the bond: blue bonding, orange antibonding', bx0, 28, col.m);
        label(ctx, 'blue/orange: E_bond, E_anti   green: total energy   yellow: equilibrium', 62, H - 44, col.m);
      },
      info(p) {
        const D = p.ion ? p.D : 0, t = S.hop(p.d), m = S.twoSite(t, D), de = S.equilibrium(D), tail = p.ion ? ` Charge transfer (ionicity) $=${fmt(m.ionicity, 2)}$ electrons toward the lower level: $\\Delta\\gg t$ gives an ionic bond, $\\Delta=0$ a purely covalent one.` : '';
        return `Two atoms, one orbital each at $\\epsilon$. Overlap makes the electron hop with amplitude $t(d)\\propto e^{-d/\\lambda}$ (it falls quickly as the atoms separate). The level splits into $E_\\mp=\\epsilon\\mp\\sqrt{t^2+\\Delta^2/4}$: here $t=${fmt(t, 3)}$ eV, $E_{\\rm bond}=${fmt(m.Eb, 3)}$ eV, $E_{\\rm anti}=${fmt(m.Ea, 3)}$ eV, splitting $=${fmt(m.split, 3)}$ eV. Two electrons (spin up and down) both occupy the bonding level, gaining $2\\sqrt{t^2+\\Delta^2/4}$; a repulsive core $\\propto e^{-d/\\rho}$ with $\\rho<\\lambda$ stops the collapse, giving the equilibrium bond length $d_0=${fmt(de, 3)}$ Å (toy numbers, not a real molecule).${tail}`;
      },
    },
    // ------------------------------------------------------------ one Fermi gas, three systems
    fermitrio: {
      controls: [
        { id: 'n', label: 'electron density $n$ (m$^{-3}$)', min: 26, max: 46, step: 0.05, value: Math.log10(8.47e28), log: true },
        { id: 'T', label: 'temperature $T$ (K)', min: 0, max: 10, step: 0.05, value: Math.log10(300), log: true },
        { id: 'rel', label: 'show relativistic kinetic energy', type: 'toggle', value: true },
      ],
      draw(ctx, p) {
        const ns = logsp(1e26, 1e46, 200), ax = axes(ctx, { xr: [1e26, 1e46], yr: [1e-2, 1e10], xlog: true, ylog: true, xlabel: 'density n (m⁻³)', ylabel: 'E_F or k_B T (eV)' });
        const eV = (J) => J / S.K.eV; ax.clip();
        curve(ctx, ax, (n) => eV(S.fermiEnergy(n)), ns, col.a, 1.6, [6, 4]);
        if (p.rel) curve(ctx, ax, (n) => eV(S.fermiEnergyRel(n)), ns, col.b, 2.6);
        const nc = S.nCross(); ctx.strokeStyle = col.y; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(ax.X(nc), ax.T); ctx.lineTo(ax.X(nc), H - ax.B); ctx.stroke(); ctx.setLineDash([]);
        ctx.strokeStyle = col.g; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(ax.L, ax.Y(Math.max(1e-2, S.K.kB * p.T / S.K.eV))); ctx.lineTo(W - ax.R, ax.Y(Math.max(1e-2, S.K.kB * p.T / S.K.eV))); ctx.stroke();
        for (const s of S.SYSTEMS) { const ef = eV(S.fermiEnergyRel(s.n, s.m)); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ax.X(s.n), ax.Y(ef), 5, 0, 7); ctx.fill(); label(ctx, s.id, ax.X(s.n) + 7, ax.Y(ef) - 6, '#fff'); ctx.fillStyle = col.g; ctx.fillRect(ax.X(s.n) - 3, ax.Y(S.K.kB * s.T / S.K.eV) - 3, 6, 6); }
        ctx.strokeStyle = '#fff'; ctx.beginPath(); ctx.moveTo(ax.X(p.n), ax.T); ctx.lineTo(ax.X(p.n), H - ax.B); ctx.stroke();
        ax.unclip();
        label(ctx, 'orange dashed: ħ²k_F²/2m   blue: relativistic   yellow: p_F = mc   green line: k_BT   white dots: systems (electron curve; NS uses m_n)', ax.L + 4, ax.T + 12, col.m);
      },
      info(p) {
        const n = p.n, EF = S.fermiEnergy(n), TF = S.fermiT(n), x = S.xRel(n), P = S.pressure(n), r = p.T / TF;
        const sys = S.SYSTEMS.map((s) => `${s.name}: $n=${fmt(s.n, 2)}$ m$^{-3}$, $E_F=${fmt(S.fermiEnergyRel(s.n, s.m) / S.K.eV, 3)}$ eV, $T_F=${fmt(S.fermiEnergy(s.n, s.m) / S.K.kB, 2)}$ K, $T/T_F=${fmt(s.T / S.fermiT(s.n, s.m), 2)}$`).join('; ');
        return `At density $n$ the Fermi gas fills states up to $k_F=(3\\pi^2n)^{1/3}=${fmt(S.kF(n), 3)}$ m$^{-1}$, i.e. $E_F=\\hbar^2k_F^2/2m=${fmt(EF / S.K.eV, 3)}$ eV and $T_F=E_F/k_B=${fmt(TF, 3)}$ K. With your $T=${fmt(p.T, 3)}$ K, $T/T_F=${fmt(r, 2)}$: ${r < 0.1 ? 'degenerate (Pauli principle dominates; thermal motion is a small smearing)' : r < 1 ? 'partly degenerate' : 'classical gas (Maxwell–Boltzmann)'}. Degeneracy pressure $P=\\tfrac25 nE_F=${fmt(S.pressureNR(n), 3)}$ Pa (non-relativistic), exact value $P=${fmt(P, 3)}$ Pa. $x=p_F/mc=${fmt(x, 3)}$: ${x < 0.3 ? 'non-relativistic, $P\\propto n^{5/3}$' : x > 3 ? 'ultra-relativistic, $P\\propto n^{4/3}$ (Chandrasekhar limit)' : 'crossover'}. ${sys}.`;
      },
    },
    // ------------------------------------------------------------ nearly free electrons
    nfe: {
      controls: [
        { id: 'U', label: 'potential strength $|U_G|$ (eV): Fourier component of the lattice potential', min: 0, max: 4, step: 0.05, value: 1 },
        { id: 'a', label: 'lattice constant $a$ (Å)', min: 2, max: 8, step: 0.05, value: 4 },
        { id: 'Ne', label: 'valence electrons per primitive cell', min: 1, max: 4, step: 1, value: 2 },
        { id: 'fold', label: 'folded (reduced-zone) picture', type: 'toggle', value: true },
      ],
      draw(ctx, p) {
        const ge = Math.PI / p.a, e0 = S.edgeEnergy(p.a), ks = lin(-ge, ge, 160), ymax = Math.max(4 * e0, 2.6 * e0 + 2 * p.U);
        const ax = axes(ctx, { xr: [-ge * 1.6, ge * 1.6], yr: [0, ymax], xlabel: 'wave vector k (1/Å);  zone edges at ±π/a', ylabel: 'E (eV)' }); ax.clip();
        const kk = lin(-ge * 1.6, ge * 1.6, 240);
        curve(ctx, ax, S.freeE, kk, col.m, 1.4, [5, 4]);
        if (p.fold) { for (let b = 0; b < 4; b++) curve(ctx, ax, (k) => S.nfeBands(k, p.a, p.U)[b], ks, [col.b, col.a, col.g, col.y][b], 2.4); }
        else for (let b = 0; b < 4; b++) curve(ctx, ax, (k) => S.nfeBands(Math.abs(k) > ge ? k - Math.sign(k) * 2 * ge : k, p.a, p.U)[b], kk, col.b, 1.2);
        ctx.strokeStyle = '#3a4a6a'; for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(ax.X(s * ge), ax.T); ctx.lineTo(ax.X(s * ge), H - ax.B); ctx.stroke(); }
        const kf = Math.PI * p.Ne / (2 * p.a), ef = S.freeE(kf); ctx.strokeStyle = '#fff'; ctx.setLineDash([2, 3]); ctx.beginPath(); ctx.moveTo(ax.L, ax.Y(ef)); ctx.lineTo(W - ax.R, ax.Y(ef)); ctx.stroke(); ctx.setLineDash([]);
        ax.unclip();
        label(ctx, 'grey dashed: free parabola   colours: bands with U_G   white dotted: free-electron E_F for this filling', ax.L + 4, ax.T + 12, col.m);
      },
      info(p) {
        const e0 = S.edgeEnergy(p.a), mr = S.nfeMassRatio(p.a, p.U), bands = S.nfeBands(Math.PI / p.a, p.a, p.U), g = bands[1] - bands[0], filled = p.Ne / 2;
        const verdict = p.U < 0.01 ? 'with $U_G=0$ there is no gap: always a metal' : Number.isInteger(filled) ? `${p.Ne} electrons fill exactly ${filled} band(s) (2 per band, spin): in 1D this is an insulator, the gap is above the top` : `${p.Ne} electrons leave a band half or partly filled: a metal`;
        return `A weak periodic potential $V(x)=2U_G\\cos(Gx)$, $G=2\\pi/a$, mixes the plane waves $k$ and $k-G$. At the zone edge $k=\\pi/a$ they are degenerate (free energy $E_0=\\hbar^2\\pi^2/2ma^2=${fmt(e0, 3)}$ eV), the 2x2 problem gives $E_\\pm=E_0\\pm|U_G|$, so the gap is $2|U_G|=${fmt(2 * p.U, 3)}$ eV (numerical check: ${fmt(g, 3)}$ eV). Effective mass at the band edge (2-wave model): upper band $m^*/m=1/(1+2E_0/|U_G|)=${p.U > 0.01 ? fmt(mr.upper, 3) : '0'}$, lower band $m^*/m=-1/(2E_0/|U_G|-1)=${p.U > 0.01 ? fmt(mr.lower, 3) : '0'}$ (small gap gives a light carrier). Filling: ${verdict}. In 3D bands may overlap in energy, so an even electron count is necessary but not sufficient for an insulator.`;
      },
    },
    // ------------------------------------------------------------ Ewald construction (2D)
    ewald: {
      controls: [
        { id: 'lam', label: 'wavelength $\\lambda$ (in units of $a$)', min: 0.2, max: 2.5, step: 0.01, value: 0.8 },
        { id: 'phi', label: 'direction of the incident wave $\\mathbf k$ (degrees from the $x$ axis)', min: 0, max: 360, step: 1, value: 110 },
        { id: 'rect', label: 'rectangular lattice $b=1.5a$ (otherwise square, $b=a$)', type: 'toggle', value: false },
      ],
      draw(ctx, p) {
        const b = p.rect ? 1.5 : 1, e = S.ewald(1, b, p.lam, p.phi * Math.PI / 180), R = Math.max(2 * e.k * 1.1, 14), cx = W / 2, cy = H / 2, sc = (H / 2 - 12) / R;
        const X = (x) => cx + x * sc, Y = (y) => cy - y * sc;
        ctx.fillStyle = '#0b1220'; ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = col.b; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.arc(X(-e.kx), Y(-e.ky), e.k * sc, 0, 7); ctx.stroke(); // Ewald circle, centre at -k
        ctx.strokeStyle = col.y; ctx.beginPath(); ctx.moveTo(X(-e.kx), Y(-e.ky)); ctx.lineTo(X(0), Y(0)); ctx.stroke();
        label(ctx, 'k (incident)', X(-e.kx / 2) + 4, Y(-e.ky / 2) - 4, col.y);
        for (const q of e.pts) {
          const x = X(q.Gx), y = Y(q.Gy); if (x < 0 || x > W || y < 0 || y > H) continue;
          ctx.fillStyle = q.hit ? col.g : '#5a6a8a'; ctx.beginPath(); ctx.arc(x, y, q.hit ? 5 : 2.2, 0, 7); ctx.fill();
          if (q.hit) { ctx.strokeStyle = col.g; ctx.beginPath(); ctx.moveTo(X(-e.kx), Y(-e.ky)); ctx.lineTo(x, y); ctx.stroke(); label(ctx, `(${q.h},${q.l}) 2θ=${(q.twoTheta * 180 / Math.PI).toFixed(1)}°`, x + 7, y - 6, '#fff'); }
        }
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(X(0), Y(0), 3.5, 0, 7); ctx.fill();
        label(ctx, 'blue circle |k′|=|k|, centre at −k   white: origin G=0   green: Laue condition met (within 2%)', 8, 14, col.m);
      },
      info(p) {
        const b = p.rect ? 1.5 : 1, e = S.ewald(1, b, p.lam, p.phi * Math.PI / 180), hits = e.pts.filter((q) => q.hit);
        const list = hits.length ? hits.map((q) => `$(${q.h},${q.l})$: $2\\theta=${(q.twoTheta * 180 / Math.PI).toFixed(1)}^\\circ$`).join('; ') : 'none: no reciprocal-lattice point lies on the circle, so there is no Bragg peak (rotate the crystal or change $\\lambda$)';
        return `A wave $\\mathbf k$ ($|k|=2\\pi/\\lambda$) scatters elastically to $\\mathbf k'=\\mathbf k+\\mathbf G$ with $|\\mathbf k'|=|\\mathbf k|$: draw the circle of radius $|k|$ around the tip... around $-\\mathbf k$; every reciprocal-lattice point $\\mathbf G$ on it gives a peak (Laue condition, equivalent to $2d\\sin\\theta=n\\lambda$ with $d=2\\pi n/|G|$). Slider $\\lambda$ sets the circle radius (shorter wavelength: bigger circle, more peaks); the angle slider turns the crystal relative to the beam. Reflections: ${list}.`.replace('around the tip... around', 'centred at');
      },
    },
  };
};
