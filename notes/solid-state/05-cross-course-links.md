# Cross-course links (Solid State ↔ QM ↔ Astro)

Used by the room `degenerate-core.json` and by the `links` fields of every solid-state room. Each link below is also implemented as a calculation that is
checked numerically in `game/test/content-check-solid-state.mjs`.

| Idea | QM | Solid State | Astro |
|---|---|---|---|
| Particle in a box, $\vec k$ states $(2\pi)^3/V$, Pauli | sheet 3 (box) | Fermi sea (3.1): $k_F=(3\pi^2n)^{1/3}$, $\epsilon_F$, $\nu(\epsilon_F)$ | white-dwarf electrons, Choudhuri §5.2 (5.2),(5.8) |
| Degeneracy pressure | counting states | $P=\frac25n\epsilon_F$, $B=\frac53P$ (Cu: 38, 64 GPa) | $P=K_1\rho^{5/3}$ ($K_1=1.0\times10^7/\mu_e^{5/3}$ SI), $R\propto M^{-1/3}$ |
| Relativistic limit | – | $E=pc$ vs $p^2/2m$ | Chandrasekhar mass $\approx1.44(2/\mu_e)^2M_\odot$ |
| Harmonic oscillator | ladder operators, $E=\hbar\omega(n+\frac12)$ | phonon = oscillator quantum; Einstein, Debye | – |
| Boson gas $\omega=vq$ | – | phonons: $c_V\propto T^3$ (Debye) | photons: $u=aT^4$, CMB |
| Hydrogen atom scaling | Bohr radius, Rydberg | donors: $E_d=\mathrm{Ry}\,m^*/(m_e\epsilon_r^2)$, $r_d=a_0\epsilon_rm_e/m^*$ | – |
| de Broglie $\lambda=h/p$ | wave mechanics | neutron diffraction, $E=81.8/\lambda^2$ meV | – |
| Reflection at a periodic potential | transfer matrix (sheet 5) | Bloch theorem, gaps $2|U_G|$ | – |
| Degenerate perturbation theory | Stark, sheet 14 | NFE gap: $2\times2$ determinant | – |
| Spin-$\frac12$ in a field, $S(S+1)$ | Zeeman, Stern–Gerlach | Curie, Pauli, Weiss | 21 cm line, stellar fields |
| Wien's law / photon energy | blackbody | LED colour, solar-cell gap | $\lambda_{\max}T=b$; Sun 502 nm ↔ 2.47 eV |
| Tunnelling | $T\sim e^{-2\kappa a}$ | STM, $\kappa=\sqrt{2m\phi}/\hbar$ | – |

## Worked numbers (all verified in the content check)
- Copper: $\epsilon_F=7.03$ eV, $T_F=8.2\times10^4$ K, $P_e=38$ GPa, $B_e=64$ GPa (measured 140 GPa), $\gamma=0.505$ mJ/mol K², $T_\times=3.2$ K.
- White dwarf core ($\rho=10^9$ kg/m³, $\mu_e=2$): $n_e=3.0\times10^{35}$ m$^{-3}$, $\epsilon_F=163$ keV, $T_F/T=190$ at $10^7$ K, $p_F/m_ec=0.8$, $P=3.1\times10^{21}$ Pa.
- White-dwarf radius from $E=A/R^2-B/R$: $0.6M_\odot\to8.5\times10^3$ km; $M_{\rm Ch}\approx1.7M_\odot$ (uniform sphere), exact Lane–Emden 1.43–1.46 (Choudhuri 5.27–5.28).
- Photon vs phonon gas: $a=7.566\times10^{-16}$ J m$^{-3}$K$^{-4}$, CMB $u=4.17\times10^{-14}$ J/m³; Cu $v_s=2.6$ km/s from $T_D=343$ K; $c_{\rm ph}/c_{\rm photon}=\frac32(c/v)^3\approx2\times10^{15}$.

## Mnemonic: three ways to count states
Box in QM (integers $n_x,n_y,n_z$) → Fermi sea in a metal (sphere in $\vec k$, factor 2 spin) → star (same sphere, $p_F^3\propto\rho$). Same counting gives, with $\omega=vq$ and
Bose statistics instead of Fermi, the phonon and photon gases. Learn the counting once.
