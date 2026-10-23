from extra_common import *

def semi():
    L1 = lesson('L1', "Intrinsic semiconductors: gap, effective mass, carriers", 'theory', 15, 20,
      [src(S, "Ch. 5.1-5.2, eqs. (5.3)-(5.19), pp. 113-122")],
      [T(r"A semiconductor is a band insulator with a small gap $\Delta\sim1$ eV ($\approx40k_BT$ at 300 K). Only the band edges matter: parabolas with effective masses $m_e^*$, $m_h^*$. Direct gap (GaAs): CB minimum and VB maximum at the same $\vec k$; indirect (Si, Ge): different $\vec k$, optical transitions need a phonon."),
       EQ(r"n_e=n_e^{\rm eff}e^{(\epsilon_F-\epsilon_c)/k_BT},\quad n_h=n_h^{\rm eff}e^{(\epsilon_v-\epsilon_F)/k_BT},\quad n^{\rm eff}=2\Big(\frac{m^*k_BT}{2\pi\hbar^2}\Big)^{3/2}", "(5.9)-(5.13), Boltzmann tails of the Fermi function."),
       EQ(r"n_en_h=n_e^{\rm eff}n_h^{\rm eff}e^{-\Delta/k_BT},\qquad \epsilon_F^{\rm intr}=\frac{\epsilon_c+\epsilon_v}{2}+\frac34k_BT\ln\frac{m_h^*}{m_e^*}", "(5.14)-(5.16): mass-action law."),
       EQ(r"\sigma=n_ee\mu_e+n_he\mu_h,\qquad \mu=\frac{e\tau}{m^*}", "(5.17)-(5.19)."),
       I(r"The heavier band has more states near its edge, so to keep $n_e=n_h$ the Fermi level moves away from it: heavy holes push $\epsilon_F$ up. Carrier density is exponential in $T$, mobility only a power law: $\sigma$ of an undoped semiconductor rises steeply with $T$, opposite to a metal."),
       P(r"$\exp(-\Delta/2k_BT)$ in $n_i$ (half the gap), but $\exp(-\Delta/k_BT)$ in the product $n_en_h$ and in the 'probability to excite an electron'. Cyclotron resonance needs $\omega_c=eB/m^*$ in the microwave range: an optical laser line would need kT fields (HS20 Task 4d)."),
       X(r"HS20 Task 4 (GaAs): gap from the absorption edge, Boltzmann factor, cyclotron field, $n_i$, $\epsilon_F$ shift, $\sigma$, donor Bohr radius. HS23 Problem 3: 1D cosine bands, $m^*$, DOS per length, $n_e$, $n_h$, intrinsic $\mu$.")],
      [Q(r"If $m_h^*>m_e^*$, the intrinsic Fermi level lies", ["exactly at mid-gap", "above mid-gap", "below mid-gap", "in the valence band"], 1, r"$+\frac34k_BT\ln(m_h^*/m_e^*)>0$."),
       Q(r"Doping a semiconductor so that $n_e$ rises tenfold (same $T$) changes $n_h$ by", ["×10", "×1", "×0.1", "×0.01"], 2, r"Mass-action law: $n_en_h$ fixed at fixed $T$.")])

    L2 = lesson('L2', "Doping and the p–n junction", 'theory', 15, 20,
      [src(S, "Ch. 5.3-5.4, eqs. (5.20)-(5.52), pp. 123-135")],
      [EQ(r"E_d=\frac{e^4m^*}{2(4\pi\epsilon\epsilon_0\hbar)^2}=\mathrm{Ry}\frac{m^*/m_e}{\epsilon^2},\qquad r_d=\frac{4\pi\epsilon\epsilon_0\hbar^2}{m^*e^2}=a_0\frac{\epsilon}{m^*/m_e}", "(5.20)-(5.21): the donor is a hydrogen atom in a dielectric."),
       T(r"Carrier density of an n-type sample versus $T$: freeze-out $n_e\propto\sqrt{N_d}e^{-E_d/2k_BT}$, exhaustion $n_e\approx N_d$ (flat), intrinsic $n_i\propto e^{-\Delta/2k_BT}$. At $T=0$ the Fermi level sits between donor level and CB edge (p-type: between VB edge and acceptor level) and moves towards mid-gap as $T$ rises."),
       EQ(r"eV=\Delta+k_BT\ln\frac{N_dN_a}{n_e^{\rm eff}n_h^{\rm eff}}\approx\Delta,\qquad d_n+d_p=\sqrt{\frac{2\epsilon\epsilon_0V}{e}\frac{N_a+N_d}{N_aN_d}},\qquad N_dd_n=N_ad_p", "(5.36), (5.44)-(5.46)."),
       EQ(r"d(U)=d(0)\sqrt{1-U/V},\qquad I=I_{\rm gen}\big(e^{eU/k_BT}-1\big)", "(5.48)-(5.52): forward bias U>0 (+ on p)."),
       I(r"When p and n touch, electrons diffuse to p and holes to n, leaving fixed ionised dopants: $+$ on the n side, $-$ on the p side. Their field stops the diffusion when the Fermi levels align; the bands bend by $\approx\Delta$. Forward bias lowers the barrier: the recombination current grows exponentially. Reverse bias only leaves the tiny generation current: rectification."),
       P(r"The lightly doped side carries the wider depletion region. The host's $\epsilon$ (not the donor's) enters $E_d$ because the orbit spans $\sim$20 lattice constants. Typical $E_d$: GaAs 5.5 meV, Si 45 meV (P).")],
      [Q(r"A Si p–n junction with $N_a=10^{16}$ and $N_d=10^{17}$ cm$^{-3}$: where is the depletion layer wider?", ["n side", "p side", "equal", "it has no depletion layer"], 1, r"$d_p/d_n=N_d/N_a=10$."),
       Q(r"For a p-type semiconductor at $T=0$ the Fermi energy lies", ["at the CB edge", "at the VB edge", "between VB and acceptor level", "above the acceptor level"], 2, r"HS20 MC (c).", src(HS20, "MC (c)"))])

    Q1 = quiz('Q1', "Semiconductor Forge multiple choice", 25,
      [src(HS20, "Task 1 MC (a),(c),(t); Task 4"), src(S, "Ch. 5")],
      [Q(r"A carrier density that shows an activated rise at low $T$, a flat plateau, and a second, steeper rise at high $T$ belongs to", ["an insulator", "a doped semiconductor", "an intrinsic semiconductor", "a metal"], 1, r"Freeze-out, exhaustion, intrinsic regimes (the figure of HS20 MC (a)).", src(HS20, "MC (a)")),
       Q(r"Why does an absorption measurement of GaAs measure the gap at $k=0$?", ["photons have large momentum", "the photon momentum is negligible on the BZ scale", "GaAs is indirect", "absorption is phonon-assisted"], 1, r"$2\pi/\lambda\sim10^{-3}$ of $\pi/a$: vertical transitions.", src(HS20, "Task 4 (b)")),
       Q(r"In equilibrium across a p–n junction", ["the Fermi level jumps by Δ", "the Fermi level is constant; the bands bend by ≈ Δ", "the bands are flat", "electrons flow continuously"], 1, r"Script 5.4.1-5.4.2; correct band diagram of HS20 MC (t).", src(HS20, "MC (t)")),
       Q(r"Phonon-limited mobility in a non-degenerate semiconductor scales as", [r"$T^{-3/2}$", r"$T$", r"$T^{3/2}$", r"$T^{-5}$"], 0, r"$1/\tau\propto$ (phonon number $\propto T$)×(thermal speed $\propto\sqrt T$) (script 5.2.2)."),
       Q(r"A blue LED emits at 460 nm. Its gap is about", ["1.4 eV", "2.0 eV", "2.7 eV", "3.4 eV"], 2, r"$1239.8/460=2.70$ eV."),
       Q(r"In the 1D cosine-band semiconductor of HS23 Aug ($E_{cb}=E_G+2t_{cb}[\cos ka+1]$, $E_{vb}=2t_{vb}[\cos ka-1]$) the gap is", ["direct at k = 0", "indirect: CB minimum at k = π/a, VB maximum at k = 0", "direct at k = π/a", "absent"], 1, r"$\cos ka+1=0$ at $\pi/a$.", src(AUG, "Problem 3 (b)"))])

    D1 = derive('D1', "Width of the depletion layer", 30, src(S, "Ch. 5.4.2-5.4.3, eqs. (5.38)-(5.46)"),
      r"Abrupt p–n junction at $x=0$, acceptors $N_a$ for $x<0$, donors $N_d$ for $x>0$, built-in potential $V$. In the depletion approximation derive $d_n$, $d_p$ and $d_n+d_p$.",
      [r"$\rho=+eN_d$ for $0<x<d_n$, $-eN_a$ for $-d_p<x<0$, 0 outside", r"Poisson $\phi''=-\rho/\epsilon\epsilon_0$"],
      [(r"Integrate Poisson on the n side with $\phi'(d_n)=0$, $\phi(d_n)=\phi(\infty)$.", r"$\phi=\phi(\infty)-\frac{eN_d}{2\epsilon\epsilon_0}(x-d_n)^2$."),
       (r"Same on the p side.", r"$\phi=\phi(-\infty)+\frac{eN_a}{2\epsilon\epsilon_0}(x+d_p)^2$."),
       (r"Continuity of $\phi'$ and $\phi$ at $x=0$.", r"$\phi'$: $N_dd_n=N_ad_p$ (neutrality). $\phi$: $\frac{e}{2\epsilon\epsilon_0}(N_dd_n^2+N_ad_p^2)=V$."),
       (r"Solve.", r"$d_n=\sqrt{\frac{2\epsilon\epsilon_0V}{e}\frac{N_a}{N_d(N_a+N_d)}}$, $d_p=\sqrt{\frac{2\epsilon\epsilon_0V}{e}\frac{N_d}{N_a(N_a+N_d)}}$, sum $\sqrt{\frac{2\epsilon\epsilon_0V}{e}\frac{N_a+N_d}{N_aN_d}}$. With bias $V\to V-U$. Si, $10^{16}/10^{17}$ cm$^{-3}$, $V=0.79$ V: $0.34\,\mu$m.")],
      [r"parabolic $\phi$ on each side", r"$N_dd_n=N_ad_p$", r"$\frac{e}{2\epsilon\epsilon_0}(N_dd_n^2+N_ad_p^2)=V$", r"$d\propto\sqrt{V}$, so $d(U)=d\sqrt{1-U/V}$"])
    return [L1, L2, Q1, D1]

def magnet():
    L1 = lesson('L1', "Para- and diamagnetism: Curie, Pauli, Landau", 'theory', 12, 20,
      [src(S, "Ch. 6.1-6.2, eqs. (6.1)-(6.30), pp. 136-146")],
      [EQ(r"\vec M=\chi\vec H,\quad \vec B=\mu_0(\vec H+\vec M),\quad \epsilon_\sigma=-\frac{g\mu_B\mu_0H}{2}\sigma", "(6.2)-(6.5)."),
       EQ(r"\chi_{\rm Curie}=\frac{C}{T},\ \ C=\frac{\mu_0(g\mu_B)^2S(S+1)}{3k_BV_0};\qquad \chi_P=\mu_0\frac{(g\mu_B)^2}{4}\nu(\epsilon_F);\qquad \chi_L=-\tfrac13\chi_P", "(6.11), (6.16), (6.17)."),
       I(r"Free spins align against thermal disorder: $\chi\propto1/T$. In a metal only the $\nu(\epsilon_F)k_BT$ electrons at the Fermi surface can flip, each giving $\propto1/k_BT$: the temperatures cancel, $\chi_P$ is constant and $\sim T/T_F$ times the Curie value. Orbital motion gives Landau diamagnetism, one third of $\chi_P$ for free electrons."),
       T(r"Stoner: an on-site repulsion $U$ acts like an extra field $\propto M$; $\chi=\chi_P/(1-\frac{2UV_0}{\mu_0(g\mu_B)^2}\chi_P)$ diverges when $U\nu$ is large: band ferromagnetism (Fe, Co, Ni)."),
       P(r"Pauli paramagnetism is $T$-independent; a Curie tail in a metal signals magnetic impurities. Cu is overall diamagnetic (core electrons and $(m_e/m^*)^2$).")],
      [Q(r"The spin susceptibility of a simple metal", ["diverges as 1/T", "is nearly temperature independent", "is negative", "vanishes"], 1, r"Pauli."),
       Q(r"For free electrons, Landau diamagnetism equals", [r"$-\chi_P$", r"$-\chi_P/3$", r"$-3\chi_P$", r"0"], 1, r"(6.17).")])

    L2 = lesson('L2', "Exchange, Weiss field, ferro- and antiferromagnets", 'theory', 15, 20,
      [src(S, "Ch. 6.3, eqs. (6.50)-(6.78), pp. 147-161"), src(JAN, "Problem 4"), src(AUG, "Problem 4")],
      [EQ(r"H=-\sum_{\{i,j\}}J_{ij}\,\vec S_i\cdot\vec S_j\quad(\text{each bond once};\ J>0\ \text{ferro})", "(6.51), (6.63): script convention."),
       EQ(r"\chi=\frac{C}{T-T_W},\qquad k_BT_W=J_{\rm total}\frac{S(S+1)}{3},\qquad J_{\rm total}=\sum_jJ_{ij}", "(6.59)-(6.65); T_C = T_W (mean field), T_N = −T_W for a single J."),
       EQ(r"\mu_0H_{\rm sat}=\frac{2J_{\rm AF}S}{g\mu_B},\qquad J_{\rm AF}=\sum_{\rm AF\ neighbours}|J|", "Saturation of a collinear antiferromagnet by a perpendicular field (from E(θ) = −½J_AF S² cos2θ − gμ_Bμ_0HS sinθ)."),
       I(r"Exchange is Coulomb repulsion plus Pauli: two spins in an orbital-overlap region feel a spin-dependent energy far larger (tens of meV) than their dipolar coupling (0.1 meV). In mean field each spin sees the average of its neighbours as an extra 'Weiss field', which turns $C/T$ into $C/(T-T_W)$."),
       P(r"<b>Sign conventions differ.</b> Zheludev's exams: $H=+\sum J\vec S\cdot\vec S$ ($J<0$ ferro) and $T_W=-J_{\rm total}S(S+1)/3k_B$. Both printed keys give saturation fields twice $2J_{\rm AF}S/g\mu_B\mu_0$ because they count each bond twice in the energy per spin; the exact two-spin check ($g\mu_B\mu_0H=J$) supports the formula above. State your convention and keep it."),
       X(r"Jan 2024: brick-wall 'honeycomb' lattice, one $J_1$ and two $J_2$ bonds per site, $J_{\rm total}=J_1+2J_2$. Aug 2024: triangular lattice, two $J_1$ and four $J_2$, $J_{\rm total}=2J_1+4J_2$. Both ask: ground state sketch, $T_W$, saturation field.")],
      [Q(r"A Curie–Weiss fit gives $T_W=-20$ K. The dominant interactions are", ["ferromagnetic", "antiferromagnetic", "absent", "dipolar"], 1, r"$T_W<0$ means $J_{\rm total}<0$ (script convention)."),
       Q(r"On which lattice can all nearest-neighbour antiferromagnetic bonds be satisfied?", ["triangular", "square", "kagome", "fcc"], 1, r"Square is bipartite (Néel state); the others are frustrated.")])

    Q1 = quiz('Q1', "Magnet Vault multiple choice", 25,
      [src(HS20, "Task 1 MC (r)"), src(S, "Ch. 6")],
      [Q(r"The exchange energy $J$ (HS20 convention, $J>0$ favours parallel spins) is", ["J > 0 in a ferromagnet and J > 0 in a diamagnet", "J > 0 in a paramagnet and J < 0 in a ferromagnet", "J > 0 in a ferromagnet and J < 0 in an ordinary metal", "J = 0 in a ferromagnet and J ≠ 0 in a superconductor"], 2, r"Key of HS20 MC (r). Careful: the HS23 exams use the opposite sign.", src(HS20, "MC (r)")),
       Q(r"The microscopic origin of ferromagnetic order in Fe ($T_C=1043$ K) is", ["magnetic dipole interaction", "Coulomb repulsion combined with the Pauli principle", "gravity", "spin–orbit coupling only"], 1, r"Dipolar energies are $\sim0.1$ meV $\sim1$ K."),
       Q(r"Below $T_N$, the susceptibility of an antiferromagnet for a field parallel to the staggered moment", ["diverges", "drops towards 0 as T → 0", "stays constant", "becomes negative"], 1, r"At $T=0$ the sublattices are saturated and a parallel field cannot change them (script 6.3.5); perpendicular $\chi$ stays roughly constant."),
       Q(r"In mean field theory for a single ferromagnetic $J$ with $Z$ neighbours, $T_C$ is", [r"$JZS(S+1)/3k_B$", r"$JS/k_B$", r"$J/(Zk_B)$", r"$3JZ/k_B$"], 0, r"(6.72)."),
       Q(r"Pauli susceptibility is a direct measure of", ["the electron mass", "the density of states at the Fermi level", "the number of phonons", "the Debye temperature"], 1, r"$\chi_P\propto\nu(\epsilon_F)$, like $\gamma$ in $c_V$."),
       Q(r"Two antiferromagnetically coupled spins $\frac12$ ($H=J\vec S_1\cdot\vec S_2$, $J>0$) in a field: the ground state changes from singlet to triplet at", [r"$g\mu_B\mu_0H=J/2$", r"$g\mu_B\mu_0H=J$", r"$g\mu_B\mu_0H=2J$", r"$g\mu_B\mu_0H=4J$"], 1, r"Singlet $-3J/4$, triplet $m=1$: $J/4-g\mu_B\mu_0H$. This fixes the factor in $H_{\rm sat}=2J_{\rm AF}S/g\mu_B\mu_0$ ($Z=1$, $S=\frac12$).")])

    D1 = derive('D1', "Curie–Weiss law from the Weiss field", 30, src(S, "Ch. 6.3.2, eqs. (6.50)-(6.61)"),
      r"Starting from the Heisenberg model and the free-spin Curie law $M=\chi_SH$ with $\chi_S=C/T$, derive $\chi=C/(T-T_W)$ and $k_BT_W=J_{\rm total}S(S+1)/3$.",
      [r"$\vec S_i=\langle\vec S\rangle+\delta\vec S_i$; drop $\delta\vec S_i\cdot\delta\vec S_j$", r"$\vec M=g\mu_B\langle\vec S\rangle/V_0$", r"$C=\mu_0(g\mu_B)^2S(S+1)/(3k_BV_0)$"],
      [(r"Mean-field Hamiltonian of one spin.", r"$H_i^{MF}=-J_{\rm total}\vec S_i\cdot\langle\vec S\rangle=-\frac{J_{\rm total}V_0}{g\mu_B}\vec S_i\cdot\vec M$."),
       (r"Compare with Zeeman $-g\mu_B\mu_0\vec S\cdot\vec H$: effective field.", r"$H_{\rm inter}=\frac{J_{\rm total}V_0}{(g\mu_B)^2\mu_0}M$ (Weiss field)."),
       (r"Self-consistency $M=\chi_S(H+H_{\rm inter})$.", r"$M=\frac{\chi_S}{1-\chi_SJ_{\rm total}V_0/((g\mu_B)^2\mu_0)}H=\frac{C}{T-T_W}H$ with $T_W=\frac{J_{\rm total}V_0C}{(g\mu_B)^2\mu_0}$."),
       (r"Insert $C$.", r"$T_W=J_{\rm total}S(S+1)/3k_B$. Brick-wall lattice: $J_{\rm total}=J_1+2J_2$; triangular: $2J_1+4J_2$. Exact at high $T$: the best way to measure $J$.")],
      [r"Weiss field $\propto M$", r"$\chi=\chi_S/(1-\chi_S\lambda)$", r"$k_BT_W=J_{\rm total}S(S+1)/3$", r"sum $J$ over all neighbours of one spin"])
    return [L1, L2, Q1, D1]

def degenerate():
    L1 = lesson('L1', "One Fermi gas, three courses", 'intuition', 12, 20,
      [src(S, "Ch. 3.1"), src(CH, "Ch. 5.2-5.3, eqs. (5.2)-(5.28), pp. 129-137"), src("materials/quantum-mechanics/exercises/Exercises 3.pdf", "particle in a box")],
      [T(r"QM: a particle in a box has $E\propto n^2/L^2$. Put $N$ fermions in: they stack up to the Fermi energy because each state holds two. Solid state: the conduction electrons of copper are exactly this with $n=8.5\times10^{28}$ m$^{-3}$, $\epsilon_F=7$ eV. Astro: a white dwarf core is the same with $n\sim3\times10^{35}$ m$^{-3}$, $\epsilon_F\sim160$ keV."),
       EQ(r"\epsilon_F=\frac{\hbar^2}{2m}(3\pi^2n)^{2/3},\qquad P=\frac25n\epsilon_F\propto n^{5/3}\ (\text{non-rel.}),\qquad P\propto n^{4/3}\ (\text{ultra-rel.})", "Same formula in metals and white dwarfs (Choudhuri 5.9, 5.11)."),
       EQ(r"E(R)=\frac{A}{R^2}-\frac{B}{R}\Rightarrow R=\frac{2A}{B}\propto M^{-1/3};\qquad \text{rel.: }E=\frac{A'-B}{R}\Rightarrow M_{\rm Ch}\simeq1.4\Big(\frac{2}{\mu_e}\Big)^2M_\odot", "Energy-balance estimate of the mass–radius relation and the limiting mass."),
       I(r"Why electrons and not nuclei? At equal number density electrons and nuclei have the same $p_F$, but pressure is a momentum flux $\sim p_Fv_F=p_F^2/m$, so the light electrons dominate by $m_p/m_e\approx2000$. Nuclei supply the mass (hence $\mu_e$), electrons the pressure."),
       I(r"Bosons with $\omega=vq$: photons ($v=c$, 2 polarisations) give $u=aT^4$ (CMB, stellar interiors); phonons ($v\sim3$ km/s, 3 polarisations) give Debye's $C\propto T^3$. Same integral, the speed enters as $1/v^3$."),
       P(r"Do not use the non-relativistic $\epsilon_F$ when $p_F\gtrsim m_ec$ (white dwarfs above $\sim10^9$ kg/m$^3$). In a metal $\epsilon_F\ll m_ec^2$ always."),
       X(r"Astro (Refregier/Choudhuri): degeneracy pressure, $R\propto M^{-1/3}$, $M_{\rm Ch}$. Solid state (HS23, HS20): $\epsilon_F$, $\nu(\epsilon_F)$, $c_V$ ratios. QM: box states, counting, Pauli. The Degenerate Core boss asks all three in one problem.")],
      [Q(r"The Fermi energy of electrons in a white dwarf core is larger than in copper by about", ["10", "10³", "2×10⁴", "10¹¹"], 2, r"$(n_{WD}/n_{Cu})^{2/3}=(3.5\times10^6)^{2/3}\approx2.3\times10^4$: 7 eV to 160 keV."),
       Q(r"A more massive white dwarf is", ["larger", "smaller", "the same size", "hotter but the same size"], 1, r"$R\propto M^{-1/3}$.")])

    Q1 = quiz('Q1', "Cross-course quiz: Fermi gases, bosons and scaling", 25,
      [src(S, "Ch. 2.4, 3.1"), src(CH, "Ch. 5.2-5.3")],
      [Q(r"Degeneracy pressure of a non-relativistic Fermi gas scales as", [r"$n$", r"$n^{4/3}$", r"$n^{5/3}$", r"$n^2$"], 2, r"$P=\frac25n\epsilon_F$, $\epsilon_F\propto n^{2/3}$."),
       Q(r"The free-electron bulk modulus of copper, $\frac23n\epsilon_F$, is about", ["0.06 GPa", "6 GPa", "64 GPa", "6400 GPa"], 2, r"Measured 140 GPa: Pauli pressure is the right order of magnitude."),
       Q(r"In the ultra-relativistic limit the kinetic and gravitational energies of a white dwarf both scale as", [r"$1/R^2$", r"$1/R$", r"$R$", r"$\ln R$"], 1, r"So the radius drops out and only the mass decides: Chandrasekhar."),
       Q(r"At the same temperature, the heat capacity of the phonon gas in a crystal compared with the photon gas in the same volume is", ["about equal", "larger by ~(c/v)³ ≈ 10¹⁵", "smaller by 10¹⁵", "larger by c/v"], 1, r"$\frac32(c/v)^3$ for $v\approx2.6$ km/s."),
       Q(r"Which particles are degenerate in a white dwarf?", ["the nuclei only", "the electrons only", "both", "neither"], 1, r"Choudhuri §5.2."),
       Q(r"A hydrogenic donor in GaAs ($m^*=0.067m_e$, $\epsilon=12.9$) has a binding energy of about", ["13.6 eV", "0.5 eV", "5.5 meV", "0.05 meV"], 2, r"$13.6\times0.067/12.9^2$ eV: the hydrogen atom of QM, rescaled.")])

    D1 = derive('D1', "Photon gas and phonon gas from one integral", 30, src(S, "Ch. 2.4, eqs. (2.62)-(2.79)"),
      r"For a gas of bosons with dispersion $\omega=vq$, $g$ polarisations and no cutoff, show $u=g\frac{\pi^2(k_BT)^4}{30(\hbar v)^3}$. Recover the Stefan–Boltzmann constant ($g=2$, $v=c$) and Debye's low-$T$ law ($g=3$).",
      [r"$\int_0^\infty\frac{x^3}{e^x-1}dx=\frac{\pi^4}{15}$", r"$\omega_D=v(6\pi^2n)^{1/3}$ (Debye sphere with $N$ modes per polarisation)"],
      [(r"Density of modes per volume.", r"$g\frac{4\pi q^2dq}{(2\pi)^3}=g\frac{\omega^2d\omega}{2\pi^2v^3}$."),
       (r"Energy density.", r"$u=\int g\frac{\omega^2}{2\pi^2v^3}\frac{\hbar\omega}{e^{\hbar\omega/k_BT}-1}d\omega=\frac{g(k_BT)^4}{2\pi^2(\hbar v)^3}\frac{\pi^4}{15}=g\frac{\pi^2(k_BT)^4}{30(\hbar v)^3}$."),
       (r"Photons.", r"$g=2$, $v=c$: $u=aT^4$, $a=\frac{\pi^2k_B^4}{15\hbar^3c^3}=7.57\times10^{-16}$ J m$^{-3}$K$^{-4}$, $\sigma=ac/4$."),
       (r"Phonons: $c_V=4u/T$ with $g=3$, then eliminate $v$ via $\omega_D$.", r"$c_V=\frac{2\pi^2}{5}k_B\big(\frac{k_BT}{\hbar v}\big)^3=\frac{2\pi^2}5k_B\frac{6\pi^2n}{(k_BT_D)^3}(k_BT)^3=\frac{12\pi^4}{5}nk_B\big(\frac T{T_D}\big)^3$: script (2.79).")],
      [r"mode density $g\omega^2/2\pi^2v^3$", r"$u\propto T^4/v^3$", r"photons: Stefan–Boltzmann", r"phonons: Debye $\frac{12\pi^4}5nk_B(T/T_D)^3$"])
    return [L1, Q1, D1]
