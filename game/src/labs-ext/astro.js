import * as A from './models-astro.js';
// Astrophysics labs: radiative transfer, Stromgren sphere, Gamow peak, white dwarfs / Chandrasekhar, BBN.
export default (kit) => {
  const { axes, curve, lin, logsp, label, fmt, W, H } = kit;
  const vline = (ctx, ax, x, color, dash = [4, 3]) => { ctx.save(); ctx.strokeStyle = color; ctx.setLineDash(dash); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(ax.X(x), ax.T); ctx.lineTo(ax.X(x), H - ax.B); ctx.stroke(); ctx.restore(); };
  const dot = (ctx, px, py, color = '#ffd86b') => { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(px, py, 5, 0, 7); ctx.fill(); };
  let wdKey = '', wdCurve = null;
  return {
    radtrans: {
      controls: [
        { id: 'tau', label: 'optical depth $\\tau$ (line centre $\\tau_0$ in line view)', min: -2, max: 2, step: 0.02, value: 0, log: true },
        { id: 'S0', label: 'source function $S_0$ (emission of the slab itself)', min: 0, max: 2, step: 0.05, value: 1 },
        { id: 'S1', label: 'slope of source function, $S=S_0+S_1\\tau$', min: -0.3, max: 0.3, step: 0.01, value: 0 },
        { id: 'I0', label: 'background intensity $I_0$ entering the slab', min: 0, max: 2, step: 0.05, value: 0.2 },
        { id: 'line', label: 'frequency view: line profile through the slab (constant $S_0$)', type: 'toggle', value: false },
        { id: 'cog', label: 'curve of growth: equivalent width vs column density', type: 'toggle', value: false },
      ],
      draw(ctx, p) {
        if (p.cog) {
          const ts = logsp(0.01, 1e4, 60), ax = axes(ctx, { xr: [0.01, 1e4], yr: [0.01, 30], xlog: true, ylog: true, xlabel: 'line-centre optical depth τ0 ∝ column density N', ylabel: 'W / Doppler width' });
          ax.clip(); curve(ctx, ax, (t) => A.equivWidth(t), ts, '#6cb6ff', 2.6); curve(ctx, ax, (t) => t * Math.sqrt(Math.PI), logsp(0.01, 1, 20), '#ff8a5b', 1.4, [5, 4]); curve(ctx, ax, (t) => 2 * Math.sqrt(Math.log(t)), logsp(3, 1e4, 40), '#7dffb0', 1.4, [5, 4]); vline(ctx, ax, p.tau, '#ffd86b'); ax.unclip();
          dot(ctx, ax.X(p.tau), ax.Y(Math.min(30, A.equivWidth(p.tau))));
          label(ctx, 'blue: W(τ0)   orange: linear part W=√π τ0   green: flat part W≈2√ln τ0', ax.L + 6, ax.T + 14, '#9fb0d0'); return;
        }
        if (p.line) {
          const xs = lin(-5, 5, 200), I = (x) => A.Itau(A.lineTau(x, p.tau), p.I0, p.S0), ys = xs.map(I), hi = Math.max(1.2, ...ys, p.I0, p.S0) * 1.1, ax = axes(ctx, { xr: [-5, 5], yr: [0, hi], xlabel: 'frequency offset (ν−ν0)/Δν_D', ylabel: 'emergent intensity' });
          ax.clip(); curve(ctx, ax, () => p.I0, xs, '#7f8aa6', 1.2, [5, 4]); curve(ctx, ax, () => p.S0, xs, '#ff8a5b', 1.2, [5, 4]); curve(ctx, ax, I, xs, '#6cb6ff', 2.6); ax.unclip();
          label(ctx, 'blue: I(ν)   grey dashed: background I0   orange dashed: S0   ' + (p.S0 > p.I0 ? 'EMISSION line (S0 > I0)' : p.S0 < p.I0 ? 'ABSORPTION line (S0 < I0)' : 'no line (S0 = I0)'), ax.L + 6, ax.T + 14, '#9fb0d0'); return;
        }
        const xs = lin(0, 6, 200), I = (t) => A.Itau(t, p.I0, p.S0, p.S1), hi = Math.max(1, p.I0, ...xs.map(I), p.S0) * 1.15, lo = Math.min(0, ...xs.map(I));
        const ax = axes(ctx, { xr: [0, 6], yr: [lo, hi], xlabel: 'optical depth τ travelled through the slab', ylabel: 'intensity I' });
        ax.clip(); curve(ctx, ax, (t) => p.I0 + (p.S0 - p.I0) * t, lin(0, 6, 40), '#7dffb0', 1.3, [5, 4]); curve(ctx, ax, (t) => p.S0 + p.S1 * (t - 1), xs, '#ff8a5b', 1.3, [5, 4]); curve(ctx, ax, I, xs, '#6cb6ff', 2.6); vline(ctx, ax, p.tau, '#ffd86b'); ax.unclip();
        dot(ctx, ax.X(Math.min(6, p.tau)), ax.Y(I(Math.min(6, p.tau))));
        label(ctx, 'blue I(τ)   green dashed: optically thin I0+(S0−I0)τ   orange dashed: thick limit S(τ−1) (I follows the source)', ax.L + 6, ax.T + 14, '#9fb0d0');
      },
      info: (p) => { const I = A.Itau(p.tau, p.I0, p.S0, p.S1); return `Formal solution of $dI/d\\tau=S-I$: $I(\\tau)=I_0e^{-\\tau}+\\int_0^\\tau S(t)e^{-(\\tau-t)}dt$. Here $I(\\tau=${fmt(p.tau)})=${fmt(I)}$. $\\tau\\ll1$: $I\\approx I_0+(S-I_0)\\tau$ (the slab hardly matters: thin). $\\tau\\gg1$: $I\\to S(\\tau)$-ish, the slab forgets the background. Absorption vs emission line = sign of $S-I_0$. Line centre $\\tau_0$ gives equivalent width $W=${fmt(A.equivWidth(p.tau))}\\,\\Delta\\nu_D$ (linear in $N$ for $\\tau_0\\lesssim1$, saturates $\\propto\\sqrt{\\ln\\tau_0}$).`; },
    },
    stromgren: {
      controls: [
        { id: 'Q', label: 'ionising photons $Q$ (1/s): B0 star ~1e48, O7 ~1e49, O5 ~5e49', min: 46, max: 51, step: 0.05, value: 49, log: true },
        { id: 'n', label: 'hydrogen density $n_H$ (cm$^{-3}$)', min: -1, max: 4, step: 0.05, value: 2, log: true },
        { id: 'T', label: 'gas temperature $T$ (K), sets $\\alpha_B$', min: 3.7, max: 4.3, step: 0.02, value: 4, log: true },
      ],
      draw(ctx, p) {
        const f = A.stromgrenProfile(p.Q, p.n, p.T), pcm = 3.0857e18, RSpc = f.RS / pcm, rp = f.r.map((r) => r * RSpc);
        const ax = axes(ctx, { xr: [0, 1.4 * RSpc], yr: [0, 1.05], xlabel: 'radius r (pc)', ylabel: 'ionisation fraction x(r)' });
        ax.clip(); curve(ctx, ax, (r) => { const i = Math.min(f.x.length - 1, Math.round((r / RSpc / 1.4) * f.x.length) - 1); return f.x[Math.max(0, i)]; }, lin(0.0, 1.4 * RSpc, 300), '#6cb6ff', 2.6); vline(ctx, ax, RSpc, '#ffd86b'); ax.unclip();
        label(ctx, `HII region (x≈1) inside, neutral HI outside; yellow: R_S = ${fmt(RSpc)} pc`, ax.L + 6, ax.T + 14, '#9fb0d0');
      },
      info: (p) => { const R = A.stromgrenR(p.Q, p.n, p.T), trec = A.recombTime(p.n, p.T) / 3.156e7; return `Photon budget: ionisations balance recombinations in the sphere, $Q=\\tfrac43\\pi R_S^3\\,n^2\\alpha_B$, so $R_S=(3Q/4\\pi\\alpha_Bn^2)^{1/3}=${fmt(R / 3.0857e18)}$ pc with $\\alpha_B=${fmt(A.alphaB(p.T))}\\,$cm$^3$/s. Recombination time $t_{rec}=1/(n\\alpha_B)=${fmt(trec)}$ yr: the HII region adapts to changes of the star this fast. $R_S\\propto Q^{1/3}n^{-2/3}$: 10x denser gas shrinks it by 4.6. The edge is sharp because one neutral-gas mean free path $1/(n\\sigma)$ is tiny compared with $R_S$ (see the dip of $x$).`; },
    },
    gamow: {
      controls: [
        { id: 'T', label: 'temperature $T$ (K)', min: 6.5, max: 9, step: 0.01, value: Math.log10(1.5e7), log: true },
        { id: 'Z1', label: 'charge $Z_1$', min: 1, max: 8, step: 1, value: 1 },
        { id: 'Z2', label: 'charge $Z_2$', min: 1, max: 8, step: 1, value: 1 },
        { id: 'A1', label: 'mass number $A_1$', min: 1, max: 16, step: 1, value: 1 },
        { id: 'A2', label: 'mass number $A_2$', min: 1, max: 16, step: 1, value: 1 },
      ],
      draw(ctx, p) {
        const EG = A.gamowEG(p.Z1, p.Z2, p.A1, p.A2), kT = A.kT_keV(p.T), E0 = A.gamowE0(EG, kT), D = A.gamowWidth(EG, kT), Em = Math.max(12 * kT, E0 + 2.5 * D), Es = lin(Em / 500, Em, 500);
        const mb = (E) => Math.exp(-E / kT), tu = (E) => Math.exp(-Math.sqrt(EG / E)) / Math.exp(-Math.sqrt(EG / Em)), pr = (E) => A.gamowIntegrand(E, EG, kT) / A.gamowIntegrand(E0, EG, kT);
        const ax = axes(ctx, { xr: [0, Em], yr: [0, 1.1], xlabel: 'energy E (keV)', ylabel: 'relative height (each curve normalised)' });
        ax.clip(); curve(ctx, ax, mb, Es, '#6cb6ff', 1.8); curve(ctx, ax, tu, Es, '#ff8a5b', 1.8); curve(ctx, ax, pr, Es, '#ffd86b', 2.8); vline(ctx, ax, E0, '#7dffb0'); ax.unclip();
        ctx.fillStyle = 'rgba(255,216,107,0.12)'; ctx.fillRect(ax.X(Math.max(0, E0 - D / 2)), ax.T, ax.X(E0 + D / 2) - ax.X(Math.max(0, E0 - D / 2)), H - ax.T - ax.B);
        label(ctx, 'blue e^{-E/kT} (Maxwell)   orange e^{-√(E_G/E)} (tunnelling, scaled)   yellow product ×1 (Gamow peak)   green E0', ax.L + 6, ax.T + 14, '#9fb0d0');
      },
      info: (p) => { const EG = A.gamowEG(p.Z1, p.Z2, p.A1, p.A2), kT = A.kT_keV(p.T); return `$kT=${fmt(kT)}$ keV, Gamow energy $E_G=2m_rc^2(\\pi\\alpha Z_1Z_2)^2=${fmt(EG)}$ keV (≫ $kT$: fusion happens deep in the Maxwell tail). Peak $E_0=(E_G(kT)^2/4)^{1/3}=${fmt(A.gamowE0(EG, kT))}$ keV, width $\\Delta=4\\sqrt{E_0kT/3}=${fmt(A.gamowWidth(EG, kT))}$ keV. Rate $\\propto e^{-\\tau}$, $\\tau=3(E_G/4kT)^{1/3}=${fmt(A.gamowTau(EG, kT))}$, so rate $\\propto T^{\\nu}$ with $\\nu=\\tau/3-2/3=${fmt(A.gamowNu(EG, kT))}$. Compare pp ($\\nu\\approx4$ in the Sun) with CNO ($Z_1=7$, $A_1=14$, $Z_2=1$: $\\nu\\approx$ 20): CNO is far more temperature-sensitive.`; },
    },
    chandra: {
      controls: [
        { id: 'mue', label: 'mean molecular weight per electron $\\mu_e$ (C/O: 2, Fe: 2.15)', min: 1.8, max: 2.3, step: 0.01, value: 2 },
        { id: 'rho', label: 'central density $\\rho_c$ (g/cm$^3$)', min: 4, max: 11.2, step: 0.05, value: 6.5, log: true },
      ],
      draw(ctx, p) {
        const key = p.mue.toFixed(3); if (key !== wdKey) { wdKey = key; wdCurve = logsp(0.04, 45, 45).map((x) => ({ x, ...A.whiteDwarf(x, p.mue) })); }
        const Mch = A.chandraMass(p.mue), ax = axes(ctx, { xr: [0, 1.7], yr: [300, 5e4], ylog: true, xlabel: 'mass M (M☉)', ylabel: 'radius R (km)' });
        const c = wdCurve.filter((q) => q.M > 0.02 && q.R > 0), ref = c.find((q) => q.M > 0.25) || c[0];
        ax.clip(); curve(ctx, ax, (M) => ref.R * Math.pow(M / ref.M, -1 / 3), lin(0.05, 1.7, 60), '#ff8a5b', 1.3, [5, 4]); vline(ctx, ax, Mch, '#7dffb0');
        ctx.strokeStyle = '#6cb6ff'; ctx.lineWidth = 2.6; ctx.beginPath(); c.forEach((q, i) => { const px = ax.X(q.M), py = ax.Y(q.R); i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }); ctx.stroke(); ax.unclip();
        const xc = A.xOfRho(p.rho * 1e3, p.mue), w = A.whiteDwarf(xc, p.mue); dot(ctx, ax.X(w.M), ax.Y(w.R));
        label(ctx, 'blue: exact degenerate-gas M(R)   orange: R∝M^(−1/3) (non-relativistic)   green: M_Ch (R→0)', ax.L + 6, ax.T + 14, '#9fb0d0');
      },
      info: (p) => { const xc = A.xOfRho(p.rho * 1e3, p.mue), w = A.whiteDwarf(xc, p.mue); return `Electron degeneracy pressure vs gravity. Fermi momentum $p_F=m_ecx$ with $x_c=${fmt(xc)}$ at your $\\rho_c$ ($x\\gg1$ means relativistic electrons). Result: $M=${fmt(w.M)}\\,M_\\odot$, $R=${fmt(w.R)}$ km. Low mass: $P\\propto\\rho^{5/3}$ ($n=3/2$ polytrope) gives $R\\propto M^{-1/3}$, heavier dwarfs are smaller. High density: $P\\propto\\rho^{4/3}$ ($n=3$) and $R\\to0$ at $M_{Ch}=1.46\\,(2/\\mu_e)^2M_\\odot=${fmt(1.456 * Math.pow(2 / p.mue, 2))}\\,M_\\odot$ (numerical limit shown: ${fmt(A.chandraMass(p.mue))}). Iron cores ($\\mu_e=2.15$) have a lower limit.`; },
    },
    bbn: {
      controls: [
        { id: 'Tf0', label: 'weak freeze-out temperature $T_f$ (MeV) for 3 neutrino species', min: 0.5, max: 1.3, step: 0.01, value: 0.8 },
        { id: 'Nnu', label: 'number of light neutrino species $N_\\nu$ (changes expansion rate)', min: 2, max: 6, step: 0.1, value: 3 },
        { id: 'decay', label: 'free neutron decay ($\\tau_n=880$ s) before nucleosynthesis', type: 'toggle', value: true },
        { id: 'viewY', label: 'show helium fraction $Y$ versus $T_f$ instead', type: 'toggle', value: false },
      ],
      draw(ctx, p) {
        const r = A.bbn(p);
        if (p.viewY) {
          const ts = lin(0.4, 1.3, 90), ax = axes(ctx, { xr: [0.4, 1.3], yr: [0, 0.5], xlabel: 'T_f for 3 species (MeV)', ylabel: 'helium mass fraction Y' });
          ax.clip(); curve(ctx, ax, (t) => A.bbn({ ...p, Tf0: t }).Y, ts, '#6cb6ff', 2.6); curve(ctx, ax, (t) => A.bbn({ ...p, Tf0: t, decay: false }).Y, ts, '#ff8a5b', 1.4, [5, 4]); vline(ctx, ax, p.Tf0, '#ffd86b'); ax.unclip(); dot(ctx, ax.X(p.Tf0), ax.Y(r.Y));
          label(ctx, 'blue: with neutron decay   orange dashed: without   observed Y ≈ 0.25', ax.L + 6, ax.T + 14, '#9fb0d0'); return;
        }
        const ts = logsp(0.1, 1000, 300), TofT = (t) => Math.sqrt(1.32 * Math.sqrt(10.75 / A.gstar(p.Nnu)) / t), f = (t) => (t < r.tf ? A.npEq(TofT(t)) : p.decay ? r.npf * Math.exp(-(t - r.tf) / 880) : r.npf);
        const ax = axes(ctx, { xr: [0.1, 1000], yr: [0.02, 1], xlog: true, ylog: true, xlabel: 'time after big bang t (s)', ylabel: 'neutron/proton ratio n/p' });
        ax.clip(); curve(ctx, ax, (t) => A.npEq(TofT(t)), ts, '#7f8aa6', 1.4, [5, 4]); curve(ctx, ax, f, ts.filter((t) => t <= r.tD), '#6cb6ff', 2.6); vline(ctx, ax, r.tf, '#ff8a5b'); vline(ctx, ax, r.tD, '#7dffb0'); ax.unclip();
        label(ctx, 'grey dashed: equilibrium e^{−Δm/kT}   blue: actual n/p   orange: freeze-out   green: deuterium bottleneck opens', ax.L + 6, ax.T + 14, '#9fb0d0');
      },
      info(p) { const r = A.bbn(p); return `Weak reactions keep $n/p=e^{-\\Delta mc^2/kT}$ ($\\Delta mc^2=1.293$ MeV) until the rate falls below the expansion rate $H\\propto\\sqrt{g_*}T^2$ at $T_f=${fmt(r.Tf)}$ MeV (more neutrino species: larger $g_*$, faster expansion, earlier freeze-out, more neutrons). Then $n/p=${fmt(r.npf)}$. Deuterium survives photodissociation only below $T_D\\approx${fmt(r.TD * 1000)}$ keV, i.e. $t\\approx${fmt(r.tD)}$ s; the free neutrons decay meanwhile to $n/p=${fmt(r.np)}$. All neutrons end up in $^4$He: $Y=2(n/p)/(1+n/p)=${fmt(r.Y)}$ (without decay ${fmt(r.Yno)}).`; },
    },
  };
};
