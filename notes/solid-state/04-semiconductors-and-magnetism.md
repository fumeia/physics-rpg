# Solid State 04: semiconductors and magnetism

Sources: script Ch. 5 (pp. 113–135) and Ch. 6 (pp. 136–161); HS23 Jan/Aug P3 and P4; HS20 MC (a),(c),(o),(r),(t), Task 4 (GaAs).
Game rooms `semiconductor-forge.json`, `magnet-vault.json`.

## Semiconductors (script 5)
- Gap $\Delta\sim1$ eV $\gg k_BT$: Boltzmann statistics. $n_e=n_e^{\rm eff}e^{(\epsilon_F-\epsilon_c)/k_BT}$, $n_h=n_h^{\rm eff}e^{(\epsilon_v-\epsilon_F)/k_BT}$, $n^{\rm eff}=2\big(\frac{m^*k_BT}{2\pi\hbar^2}\big)^{3/2}$ (5.9–5.13).
  Mass-action law $n_en_h=n_e^{\rm eff}n_h^{\rm eff}e^{-\Delta/k_BT}$ (5.15); intrinsic $n_i=\sqrt{n_e^{\rm eff}n_h^{\rm eff}}e^{-\Delta/2k_BT}$ (5.16).
  Intrinsic Fermi level $\epsilon_F=\frac{\epsilon_v+\epsilon_c}2+\frac34k_BT\ln(m_h^*/m_e^*)$ (5.14).
- $\sigma=n_ee\mu_e+n_he\mu_h$, $\mu=e\tau/m^*$. Mobility: phonons $\mu\propto T^{-3/2}$, neutral defects $T^{-1/2}$, ionised impurities $T^{3/2}$. Carrier density activated: exponentially small at low $T$, so $\rho$ diverges as $T\to0$ (undoped).
- Cyclotron resonance: $\omega_c=eB/m^*$ gives $m^*$ (script 5.1.3). Check feasibility: matching a 671 nm laser needs $B=2\pi cm^*/e\lambda\approx1.1$ kT (electrons in GaAs): impossible; use microwaves/far IR.
- Direct versus indirect gap: GaAs direct (absorption edge sharp, photon momentum negligible so the edge measures the gap at $k=0$); Si, Ge indirect. Absorption edge 344 THz = 1.42 eV (HS20 Task 4).
- **Donors/acceptors**: hydrogen model $E_d=\frac{e^4m^*}{2(4\pi\epsilon\epsilon_0\hbar)^2}=\mathrm{Ry}\frac{m^*/m_e}{\epsilon_r^2}$, $r_d=\frac{4\pi\epsilon\epsilon_0\hbar^2}{m^*e^2}=a_0\epsilon_r\frac{m_e}{m^*}$ (5.20–5.22). GaAs: 5.5 meV, 10.2 nm $\approx18$ lattice constants: justifies the host $\epsilon_r$.
  Regimes of $n_e(T)$ (5.27 and following): freeze-out $\propto e^{-E_d/2k_BT}$, exhaustion $n_e=N_d$ (flat), intrinsic $\propto e^{-\Delta/2k_BT}$. n-type: $\epsilon_F$ at $T=0$ between donor level and band edge, falls with $T$ to mid-gap. p-type: between valence edge and acceptor level (HS20 MC (c): between valence band and acceptor level).
- **p–n junction** (5.4): $eV=\Delta+k_BT\ln\frac{N_dN_a}{n_e^{\rm eff}n_h^{\rm eff}}\approx\Delta$ (5.36–5.37). Poisson with depletion approximation: $N_dd_n=N_ad_p$, $\frac e{2\epsilon\epsilon_0}(N_dd_n^2+N_ad_p^2)=V$, $d_n+d_p=\sqrt{\frac{2\epsilon\epsilon_0V}{e}\frac{N_a+N_d}{N_aN_d}}$ (5.46); under bias $d(U)=d(0)\sqrt{1-U/V}$; $I=I_{\rm gen}(e^{U/k_BT}-1)$ (rectification). Band diagram: n side lower in electron energy; space charge $+$ on the n side, $-$ on the p side (HS20 MC (t)).
- **1D cosine bands** (HS23 Jan/Aug P3): $E_{cb}$, $E_{vb}$ with hoppings $t_{cb},t_{vb}$. Expand to $O(k^2)$ at the extrema: $E\approx E_G+t_{cb}a^2\delta k^2$, $E\approx-t_{vb}a^2k^2$; $m^*=\hbar^2/(2ta^2)$. DOS per length (two $\pm k$, two spins): $\nu_{cb}=\frac1{\pi a\sqrt{t_{cb}(E-E_G)}}$, $\nu_{vb}=\frac1{\pi a\sqrt{t_{vb}(-E)}}$.
  $n_e=\frac1a\sqrt{\frac{k_BT}{\pi t_{cb}}}e^{(\mu-E_G)/k_BT}$, $n_h=\frac1a\sqrt{\frac{k_BT}{\pi t_{vb}}}e^{-\mu/k_BT}$ (via $\int_0^\infty x^{-1/2}e^{-x}dx=\sqrt\pi$). Intrinsic: $\mu=\frac{E_G}2+\frac{k_BT}4\ln\frac{t_{cb}}{t_{vb}}$.
  **Key discrepancy**: the printed Jan-2024 key states $\frac{k_BT}2\ln2$; solving $e^{(2\mu-E_G)/k_BT}=\sqrt2$ gives $\frac{k_BT}4\ln2$, confirmed by numerical Fermi–Dirac root finding in the content check.
  Equal conductivities $\sigma_e=\sigma_h$: $\frac{\tau_e}{\tau_h}=\frac{m_e^*}{m_h^*}\frac{n_h}{n_e}$ (Aug: $\sqrt2\,e^{(E_G-2\mu)/k_BT}$). Direct gap if the extrema share a $k$ (Jan), indirect if not (Aug: CB minimum at $k=\pi/a$, VB maximum at $k=0$).
- LED: photon energy $\approx E_g$, $\lambda[\mathrm{nm}]=1239.84/E_g[\mathrm{eV}]$; the CB-to-VB recombination is the reverse of absorption.

## Magnetism (script 6)
- $\vec M=\chi\vec H$, $\vec B=\mu_0(\vec H+\vec M)$. Spin moment $\mu=g\mu_B S$, $g\approx2$. Zeeman $\epsilon_\sigma=-\frac{g\mu_B\mu_0H}2\sigma$ (6.5), $\langle\mu\rangle=\frac{g\mu_B}2\tanh\frac{g\mu_B\mu_0H}{2k_BT}$ (6.7).
- **Curie**: $\chi=C/T$, $C=\frac{\mu_0(g\mu_B)^2S(S+1)}{3k_BV_0}$ (6.11, 6.71). **Pauli** (metals): $\chi_P=\mu_0\frac{(g\mu_B)^2}4\nu(\epsilon_F)$ (6.16), $T$-independent, positive; **Landau**: $\chi_L=-\frac13\chi_P$ for free electrons ($\times(m_e/m^*)^2$ in general); core electrons are diamagnetic: Cu is overall diamagnetic.
  Pauli versus Curie for the same density: $\chi_{\rm Curie}/\chi_P=2\epsilon_F/3k_BT\approx80$ at room temperature (Na).
- Metallic ferromagnetism: Hubbard $U$, mean field $\epsilon_\sigma=\epsilon(\vec k)-\sigma M\frac{UV_0}{g\mu_B}$, **Stoner**: $\chi=\chi_P/\big(1-\frac{2UV_0}{\mu_0(g\mu_B)^2}\chi_P\big)$, ferromagnet if the denominator vanishes (6.30).
- Insulators: exchange $H=-J\vec S_1\cdot\vec S_2$ (script 6.63; $J>0$ ferro, $J<0$ antiferro, summed over **bonds once**). Mean field: Weiss field $H_{\rm inter}=\frac{J_{\rm total}}{(g\mu_B)^2\mu_0}V_0M$, $J_{\rm total}=\sum_jJ_{ij}$ (6.52); $\chi=\frac C{T-T_W}$, **$k_BT_W=J_{\rm total}\frac{S(S+1)}3$** (6.60, 6.65). Ferromagnet $T_C=T_W$ (mean field), Néel $T_N=-T_W$ for one $J$ (6.77), generally unrelated.
  **Sign convention warning**: the Zheludev exam sheets write $H=+\sum J\vec S\cdot\vec S$ ($J>0$ antiferromagnetic, $J<0$ ferromagnetic) with $T_W=-(\sum J)S(S+1)/3k_B$. Same physics, opposite sign of $J$. Read the sign from the problem.
- Antiferromagnet (6.73–6.78): Néel state needs a bipartite lattice (triangular lattice is frustrated). $L=M_1-M_2$ normalised to the full volume, $M_1=-M_2=g\mu_BS/2V_0$ at $T=0$. Field **perpendicular** to the Néel axis cants the sublattices by $\theta$:
  $E(\theta)=\mathrm{const}-\frac12J_{\rm AF}S^2\cos2\theta-g\mu_B\mu_0HS\sin\theta$, $J_{\rm AF}=\sum|J|$ over antiferromagnetic neighbours; $\partial_\theta E=0\Rightarrow g\mu_B\mu_0H=2J_{\rm AF}S\sin\theta$; **saturation** at $\theta=\pi/2$: $\mu_0H_{\rm sat}=\frac{2J_{\rm AF}S}{g\mu_B}$ (script form: $H=2\frac{J_{\rm total}}{(g\mu_B)^2\mu_0}2V_0|M_1|\sin\alpha$).
  Exact checks: two $S=\frac12$ spins, $J$: singlet–triplet crossing at $g\mu_B\mu_0H=J$; $S=\frac12$ AF chain: $2J$; square lattice $4J$ (one-magnon softening, $2ZJS$).
  **Key discrepancy**: the printed HS23 keys give $8J_2S/g\mu_B\mu_0$ (brick-wall lattice, $J_{\rm AF}=2J_2$) and $16J_2S$ (triangular lattice, $J_{\rm AF}=4J_2$), exactly twice the result above: their energy per spin counts every bond with weight 1 (ordered pairs), while their $T_W$ counts bonds once. In the exam use the problem's convention consistently and show the energy expression. (Confirmed numerically by canting minimisation in the content check.)
- The two exam lattices: Jan 2024 "honeycomb" is a brick wall with one $J_1$ (solid, ferro) and two $J_2$ (dashed, AF) bonds per site, $J_{\rm total}=J_1+2J_2$, ground state: AF arrangement of ferromagnetic dimers. Aug 2024 triangular lattice: $J_1$ along rows (2 per site), $J_2$ diagonals (4 per site), $J_{\rm total}=2J_1+4J_2$; $J_1<0,J_2>0$ (exam sign): ferro rows, antiparallel between rows.
- Exchange is electrostatic in origin (Coulomb + Pauli), not dipolar: dipoles $\sim0.1$ meV $\sim1$ K, Fe has $T_C=1043$ K.
- No superconductivity chapter in the 2026 script (HS20 MC (b),(s) ask about the BCS gap DOS and $T_c$): ask in lecture.

## Connections
- QM: spin-$\frac12$, Zeeman energy, $S(S+1)$ and singlet/triplet of two spins (sheets 11–14); hydrogen atom scaled to donors (hydrogen lamp room).
- Astro: LED colour vs Wien peak ($b/T$); the 21 cm line is a spin flip; Zeeman effect measures stellar fields.
