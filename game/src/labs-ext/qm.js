import * as Q from './models-qm.js';
const COL = ['#6cb6ff', '#ff8a5b', '#7dffb0', '#ffd86b', '#d29bff', '#ff6b9a', '#5be0d6', '#c0c8d8'];
export default (kit) => {
  const { axes, curve, lin, label, fmt, W, H } = kit;
  const jl = (j) => (Number.isInteger(j) ? `${j}` : `${2 * j}/2`);
  const jtex = (j) => (Number.isInteger(j) ? `${j}` : `\\tfrac{${2 * j}}{2}`);
  return {
    // ======================================================= hydrogen n=2 in a magnetic field
    zeeman: {
      controls: [
        { id: 'B', label: 'magnetic field $B$ (T) [log scale]', min: -2, max: 2, step: 0.02, value: -0.5, log: true },
        { id: 'so', label: 'spin-orbit coupling on ($\\xi\\,\\vec L\\cdot\\vec S$)', type: 'toggle', value: true },
      ],
      draw(ctx, p) {
        const xi = p.so ? Q.XI_HYD : 0, Bp = 4 * p.B, U = 1e-5, Bs = lin(0, Bp, 90);
        const lv = Bs.map((B) => Q.zeemanLevels(B, xi).map((l) => l.E / U)), lab = Q.zeemanLevels(0, xi);
        let lo = Infinity, hi = -Infinity; lv.forEach((r) => r.forEach((e) => { lo = Math.min(lo, e); hi = Math.max(hi, e); }));
        const pad = (hi - lo) * 0.08 + 1, ax = axes(ctx, { xr: [0, Bp], yr: [lo - pad, hi + pad], xlabel: 'B (T)', ylabel: 'E - E(2p1/2) (1e-5 eV)', pad: { l: 62 } });
        ax.clip();
        for (let k = 0; k < 8; k++) curve(ctx, ax, (B) => lv[Math.round((B / Bp) * 89)][k], Bs, lab[k].l === 0 ? '#ffd86b' : COL[(lab[k].mj + 1.5) | 0], 2);
        ctx.strokeStyle = '#ffffff'; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(ax.X(p.B), ax.T); ctx.lineTo(ax.X(p.B), H - ax.B); ctx.stroke(); ctx.setLineDash([]);
        ax.unclip();
        const r = Q.MU_B * p.B / Q.XI_HYD;
        label(ctx, p.so ? `white line = chosen B.  mu_B B / xi = ${fmt(r)}  (weak < 0.1, strong > 10).  yellow = 2s1/2, colours = m_j of 2p` : 'spin-orbit OFF: only the Zeeman term mu_B B (m_l + 2 m_s) - levels fan out from one point', ax.L + 6, ax.T + 14, '#9fb0d0');
      },
      info(p) {
        const xi = Q.XI_HYD, e = Q.MU_B * p.B, r = e / xi, reg = !p.so ? 'no spin-orbit: the energies are exactly $\\mu_BB(m_l+2m_s)$, lines $m_l+2m_s\\in\\{-2,\\dots,2\\}$ (here $L_z$ and $S_z$ are conserved separately)' : r < 0.1 ? 'WEAK field (Zeeman $\\ll$ fine structure): $j$ is a good quantum number, $\\Delta E=g_J m_j\\mu_BB$ with $g_J=1+\\frac{j(j+1)+s(s+1)-l(l+1)}{2j(j+1)}$' : r > 10 ? 'STRONG field (Paschen-Back): $\\vec L,\\vec S$ decouple, $E=\\mu_BB(m_l+2m_s)+$ small $\\xi m_lm_s$ correction' : 'INTERMEDIATE field: $\\mu_BB\\sim\\xi$, diagonalise the $2\\times2$ blocks per $m_j$ (levels with equal $m_j$ repel)';
        return `$\\mu_BB=${fmt(e)}$ eV, fine structure $\\tfrac32\\xi=4.5\\times10^{-5}$ eV, ratio $\\mu_BB/\\xi=${fmt(r)}$. ${reg}. Lande factors: $g_{s_{1/2}}=2$, $g_{p_{1/2}}=\\tfrac23$, $g_{p_{3/2}}=\\tfrac43$. Slider = size of the external field; toggle = whether the electron's spin feels its own orbital magnetic field.`;
      },
    },
    // ======================================================= addition of two angular momenta
    cgadd: {
      controls: [
        { id: 'j1', label: 'first angular momentum $j_1$', min: 0.5, max: 1.5, step: 0.5, value: 1 },
        { id: 'j2', label: 'second angular momentum $j_2$', min: 0.5, max: 1.5, step: 0.5, value: 0.5 },
        { id: 'm1', label: 'prepared $m_1$ of particle 1', min: -1.5, max: 1.5, step: 0.5, value: 0 },
        { id: 'm2', label: 'prepared $m_2$ of particle 2', min: -1.5, max: 1.5, step: 0.5, value: 0.5 },
      ],
      draw(ctx, p) {
        const m1 = Q.snapM(p.m1, p.j1), m2 = Q.snapM(p.m2, p.j2), t = Q.cgTable(p.j1, p.j2), M = m1 + m2, pr = Q.cgProbs(p.j1, p.j2, m1, m2);
        ctx.fillStyle = '#0b1220'; ctx.fillRect(0, 0, W, H); ctx.font = '12px system-ui';
        label(ctx, `product state |m1=${jl(m1)}, m2=${jl(m2)}>  has M = ${jl(M)}.  Probability to find total J (|<J,M|m1 m2>|^2):`, 14, 22);
        // bars
        const bx = 20, by = 150, bh = 100, bw = 54;
        t.Js.forEach((J, i) => { const e = pr.find((q) => q.J === J), P = e ? e.P : 0, x = bx + i * (bw + 16);
          ctx.fillStyle = e ? COL[i] : '#2a3550'; ctx.fillRect(x, by - P * bh, bw, P * bh); ctx.strokeStyle = '#3a4a6a'; ctx.strokeRect(x, by - bh, bw, bh);
          label(ctx, `P=${P.toFixed(3)}`, x + bw / 2, by - P * bh - 6, '#cfe0ff', 'center'); label(ctx, e ? `J=${jl(J)}` : `J=${jl(J)} (|M|>J)`, x + bw / 2, by + 16, '#9fb0d0', 'center'); });
        label(ctx, `sum of probabilities = ${pr.reduce((s, q) => s + q.P, 0).toFixed(3)}`, bx, by + 40, '#7dffb0');
        // CG table for this M: rows = product states, columns = J
        const Js = t.Js.filter((J) => J >= Math.abs(M) - 1e-9), rows = []; for (let k = 0; k < t.dim; k++) { const [a, b] = t.mOf(k); if (Math.abs(a + b - M) < 1e-9) rows.push([a, b]); }
        const tx = 340, ty = 70, cw = 70, rh = 26; label(ctx, `CG table <j1 m1; j2 m2 | J ${jl(M)}>`, tx, ty - 24);
        Js.forEach((J, c) => label(ctx, `J=${jl(J)}`, tx + 110 + c * cw, ty, '#9fb0d0', 'center'));
        rows.forEach(([a, b], r) => { const sel = a === m1 && b === m2; if (sel) { ctx.fillStyle = 'rgba(255,216,107,0.15)'; ctx.fillRect(tx - 6, ty + 8 + r * rh, 110 + Js.length * cw, rh - 2); }
          label(ctx, `|${jl(a)},${jl(b)}>`, tx, ty + 26 + r * rh);
          Js.forEach((J, c) => { const v = t.cg(a, b, J, M); ctx.fillStyle = v > 0 ? `rgba(108,182,255,${0.2 + 0.8 * v * v})` : `rgba(255,138,91,${0.2 + 0.8 * v * v})`; ctx.fillRect(tx + 80 + c * cw, ty + 10 + r * rh, 60, rh - 4); label(ctx, v.toFixed(3), tx + 110 + c * cw, ty + 26 + r * rh, '#fff', 'center'); }); });
        label(ctx, 'blue = positive, orange = negative (Condon-Shortley phase); columns are orthonormal', tx - 6, 300, '#9fb0d0');
      },
      info(p) {
        const m1 = Q.snapM(p.m1, p.j1), m2 = Q.snapM(p.m2, p.j2), pr = Q.cgProbs(p.j1, p.j2, m1, m2);
        return `Coupled states $|J,M\\rangle$, $J=|j_1-j_2|,\\dots,j_1+j_2$, are superpositions of product states $|m_1,m_2\\rangle$ with $m_1+m_2=M$; the coefficients are the Clebsch-Gordan coefficients (built here with $J_-=J_{1-}+J_{2-}$ from $|j_1+j_2,j_1+j_2\\rangle=|j_1j_1\\rangle|j_2j_2\\rangle$). Prepared: $|m_1,m_2\\rangle=|${jtex(m1)},${jtex(m2)}\\rangle$, $M=${jtex(m1 + m2)}$. Measuring $\\vec J^{\\,2}$ gives ${pr.map((q) => `$J=${jtex(q.J)}$ with $P=${q.P.toFixed(3)}$`).join(', ')}. The sliders $j_1,j_2$ choose the two spins; $m_1,m_2$ the prepared (e.g. Stern-Gerlach filtered) state, snapped to allowed values.`;
      },
    },
    // ======================================================= CHSH
    chsh: {
      controls: [
        { id: 'a', label: 'Alice angle $a$ (deg)', min: -180, max: 180, step: 5, value: 0 },
        { id: 'a2', label: 'Alice angle $a\'$ (deg)', min: -180, max: 180, step: 5, value: 90 },
        { id: 'b', label: 'Bob angle $b$ (deg)', min: -180, max: 180, step: 5, value: -135 },
        { id: 'b2', label: 'Bob angle $b\'$ (deg)', min: -180, max: 180, step: 5, value: -45 },
        { id: 'opt', label: 'use the optimal angles (overrides sliders)', type: 'toggle', value: false },
        { id: 'lhv', label: 'show a local-hidden-variable model (sawtooth)', type: 'toggle', value: false },
      ],
      draw(ctx, p) {
        const r = Math.PI / 180, o = Q.CHSH_OPT, A = p.opt ? [o.a, o.a2, o.b, o.b2] : [p.a * r, p.a2 * r, p.b * r, p.b2 * r];
        const Sq = Q.chsh(Q.Esinglet, ...A), Sl = Q.chsh(Q.Elhv, ...A), ax = axes(ctx, { xr: [0, Math.PI], yr: [-1.1, 1.1], xlabel: 'angle between detectors |a-b| (rad)', ylabel: 'E(a,b)' });
        ax.clip(); curve(ctx, ax, (d) => Q.Esinglet(d, 0), lin(0, Math.PI, 120), '#6cb6ff', 2.6);
        if (p.lhv) curve(ctx, ax, (d) => Q.Elhv(d, 0), lin(0, Math.PI, 120), '#ff8a5b', 2.2, [6, 4]);
        const pairs = [[A[0], A[2], 1], [A[0], A[3], -1], [A[1], A[2], 1], [A[1], A[3], 1]];
        pairs.forEach(([x, y, s], i) => { let d = Math.abs(x - y) % (2 * Math.PI); if (d > Math.PI) d = 2 * Math.PI - d; ctx.fillStyle = s > 0 ? '#ffd86b' : '#ff6b9a'; ctx.beginPath(); ctx.arc(ax.X(d), ax.Y(Q.Esinglet(d, 0)), 5, 0, 7); ctx.fill(); });
        ax.unclip();
        label(ctx, `S_quantum = ${Sq.toFixed(3)}${p.lhv ? `    S_LHV = ${Sl.toFixed(3)}` : ''}     classical bound 2, Tsirelson 2.828`, ax.L + 8, ax.T + 16, Math.abs(Sq) > 2.0001 ? '#7dffb0' : '#cfe0ff');
        label(ctx, 'dots: the four correlations used (yellow +, pink - sign in S)', ax.L + 8, ax.T + 32, '#9fb0d0');
        const bw = 220, bx = W - 14 - bw - 6, by = ax.T + 8, sc = bw / 3; ctx.fillStyle = '#1e2a40'; ctx.fillRect(bx, by + 6, bw, 12); ctx.fillStyle = '#6cb6ff'; ctx.fillRect(bx, by + 6, Math.min(Math.abs(Sq), 3) * sc, 12);
        ctx.fillStyle = '#fff'; ctx.fillRect(bx + 2 * sc, by, 2, 24); ctx.fillStyle = '#ffd86b'; ctx.fillRect(bx + 2 * Math.SQRT2 * sc, by, 2, 24);
      },
      info(p) {
        const r = Math.PI / 180, o = Q.CHSH_OPT, A = p.opt ? [o.a, o.a2, o.b, o.b2] : [p.a * r, p.a2 * r, p.b * r, p.b2 * r], S = Q.chsh(Q.Esinglet, ...A);
        return `For the singlet, spin measurements along directions at angle $\\theta$ have correlation $E=-\\cos\\theta$. $S=E(a,b)-E(a,b')+E(a',b)+E(a',b')=${fmt(S)}$. Any local hidden-variable theory obeys $|S|\\le2$; quantum mechanics reaches $2\\sqrt2\\approx2.83$ (Tsirelson). The four angles are the orientations of the Stern-Gerlach magnets of Alice ($a,a'$) and Bob ($b,b'$) in one plane; the optimal set has $45^\\circ$ steps. A local model can only give the straight sawtooth $E=-1+2\\theta/\\pi$, which touches the cosine at $0,\\pi/2,\\pi$ but never exceeds $|S|=2$.`;
      },
    },
    // ======================================================= free packet + box wall jump
    wavepacket: {
      animated: true,
      controls: [
        { id: 'hm', label: 'inertia: $\\hbar/m$ in units $\\sigma_0^2/\\tau$ [log scale]', min: -1, max: 1, step: 0.05, value: 0, log: true },
        { id: 'box', label: 'show instead: box width $a\\to2a$, probabilities $P_n$', type: 'toggle', value: false },
      ],
      draw(ctx, p, t) {
        if (p.box) {
          const N = 9, ax = axes(ctx, { xr: [0.5, N + 0.5], yr: [0, 0.6], xlabel: 'new eigenstate n (width 2a)', ylabel: 'P_n' });
          let s = 0; for (let n = 1; n <= N; n++) { const P = Q.pBoxDouble(n); s += P; ctx.fillStyle = n === 2 ? '#ffd86b' : '#6cb6ff'; ctx.fillRect(ax.X(n - 0.35), ax.Y(P), ax.X(n + 0.35) - ax.X(n - 0.35), ax.Y(0) - ax.Y(P)); label(ctx, P.toFixed(3), ax.X(n), ax.Y(P) - 5, '#cfe0ff', 'center'); }
          label(ctx, `P_n = 32/(pi^2 (4-n^2)^2) for odd n, P_2 = 1/2, other even n: 0.  Sum up to n=${N}: ${s.toFixed(4)} (-> 1)`, ax.L + 6, ax.T + 14, '#9fb0d0'); return;
        }
        const T = 10, tt = (t % (T + 2)), ts = Math.min(tt, T), s0 = 1, ax = axes(ctx, { xr: [-12, 12], yr: [0, 0.45], xlabel: 'x / sigma_0', ylabel: '|psi|^2' });
        const D = Q.dxFree(s0, p.hm, ts); ax.clip();
        const g = (sg) => (x) => Math.exp(-x * x / (2 * sg * sg)) / (sg * Math.sqrt(2 * Math.PI));
        curve(ctx, ax, g(s0), lin(-12, 12, 200), '#4a5f8a', 1.5, [4, 4]); curve(ctx, ax, g(D), lin(-12, 12, 200), '#6cb6ff', 2.6); ax.unclip();
        label(ctx, `t = ${ts.toFixed(2)}   Delta x(t) = sigma0 sqrt(1+(hbar t/(2 m sigma0^2))^2) = ${D.toFixed(3)} sigma0   (dashed = t=0)`, ax.L + 6, ax.T + 14, '#9fb0d0');
        const bx = ax.L + 6, by = H - ax.B - 70, bw = 200, bh = 56; ctx.strokeStyle = '#3a4a6a'; ctx.strokeRect(bx, by, bw, bh);
        const tt2 = lin(0, T, 60), mx = Q.dxFree(s0, p.hm, T); ctx.strokeStyle = '#ffd86b'; ctx.beginPath(); tt2.forEach((x, i) => { const px = bx + (x / T) * bw, py = by + bh - (Q.dxFree(s0, p.hm, x) / mx) * bh; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(bx + (ts / T) * bw, by + bh - (D / mx) * bh, 4, 0, 7); ctx.fill();
      },
      info(p) {
        if (p.box) return `A particle in the ground state of a box $[0,a]$, $\\psi=\\sqrt{2/a}\\sin(\\pi x/a)$, suddenly sees the wall jump to $2a$. The state is unchanged, but it is expanded in the new eigenstates $\\varphi_n=\\sqrt{1/a}\\sin(n\\pi x/2a)$: $c_n=\\langle\\varphi_n|\\psi\\rangle$, $P_2=\\tfrac12$, odd $n$: $P_n=\\frac{32}{\\pi^2(4-n^2)^2}$, so $P_1=0.360$, $P_3=0.130$, $P_5=0.0074$, and $\\sum_nP_n=1$. Energies afterwards: $E_n=n^2\\pi^2\\hbar^2/(8ma^2)$.`;
        return `Free Gaussian packet, initial width $\\sigma_0=\\Delta x(0)$, $\\Delta x(t)=\\sigma_0\\sqrt{1+\\big(\\frac{\\hbar t}{2m\\sigma_0^2}\\big)^2}$: the slider is $\\hbar/m$ (large = light particle or strong quantum character, spreads fast; heavy $m$ or $\\hbar\\to0$: no spreading, classical). Now $\\hbar/m=${fmt(p.hm)}$. At large $t$: $\\Delta x\\to\\frac{\\hbar t}{2m\\sigma_0}=\\Delta v\\,t$ with $\\Delta v=\\hbar/(2m\\sigma_0)$, from $\\Delta x\\Delta p=\\hbar/2$.`;
      },
    },
  };
};
