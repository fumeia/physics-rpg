from extra_common import *

def fermi():
    L1 = lesson('L1', "The free-electron gas", 'theory', 15, 20,
      [src(S, "Ch. 3.1, eqs. (3.1)-(3.33), pp. 66-76")],
      [T(r"Electrons in a box of volume $V$ with periodic boundary conditions: plane waves, one $\vec k$ per $(2\pi)^3/V$, two spins. At $T=0$ they fill a sphere of radius $k_F$ (the Fermi sea)."),
       EQ(r"n=\frac{k_F^3}{3\pi^2},\qquad \epsilon_F=\frac{\hbar^2k_F^2}{2m},\qquad \nu(\epsilon)=\frac{m^{3/2}}{\pi^2\hbar^3}\sqrt{2\epsilon},\qquad \nu(\epsilon_F)=\frac{3n}{2\epsilon_F}", "ν per volume, both spins."),
       EQ(r"c_V=\frac{\pi^2}{3}\,\nu(\epsilon_F)\,k_B^2\,T=\frac{\pi^2}{2}\,nk_B\,\frac{k_BT}{\epsilon_F}", "(3.33): only electrons within ~k_BT of ε_F can be excited."),
       I(r"Typical metal: $\epsilon_F\sim5$ eV, $T_F\sim6\times10^4$ K. At room temperature the Fermi–Dirac step is smeared over only $k_BT/\epsilon_F\sim0.5\%$ of the sea. Everything thermal or magnetic in a metal (heat capacity, Pauli susceptibility, conduction) is done by the electrons near the Fermi surface."),
       P(r"Units: $n$ in m$^{-3}$ (HS20 gives cm$^{-3}$: multiply by $10^6$). Use $\hbar^2/2m_e=3.81$ eV Å$^2$ to stay in Å and eV. For ratios: $\epsilon_F\propto n^{2/3}$, $S_F\propto n^{2/3}$, $\nu(\epsilon_F)\propto n^{1/3}$; constants cancel."),
       X(r"HS23 Jan/Aug Problem 2a: compare two metals (density doubled, or lattice constant $a\to0.9a$): $S_F$, $\nu(\epsilon_F)$, $c_V$ ratios. HS20 MC (m): $\epsilon_F$ for $5\times10^{22}$ cm$^{-3}$ = 4.95 eV.")],
      [Q(r"Doubling the electron density changes $\nu(\epsilon_F)$ by a factor", [r"$2$", r"$2^{2/3}$", r"$2^{1/3}$", r"$1$"], 2, r"$\nu(\epsilon_F)=3n/2\epsilon_F\propto n/n^{2/3}=n^{1/3}$."),
       Q(r"Why is the electronic $c_V$ of a metal so much smaller than $\frac32nk_B$?", ["electrons are too heavy", "Pauli blocking: only a fraction k_BT/ε_F can change state", "the lattice absorbs all heat", "electrons are bosons"], 1, r"Electrons deep in the sea have no empty states within $k_BT$.")])

    L2 = lesson('L2', "Electrons in a periodic potential: Bloch, gaps, tight binding", 'theory', 15, 20,
      [src(S, "Ch. 3.2, eqs. (3.37)-(3.60), pp. 77-87")],
      [EQ(r"\psi_{n\vec k}(\vec r)=u_{n\vec k}(\vec r)\,e^{i\vec k\cdot\vec r},\qquad u_{n\vec k}(\vec r+\vec R)=u_{n\vec k}(\vec r)", "(3.38) Bloch's theorem: k in the first BZ, band index n."),
       T(r"<b>Nearly free electrons</b>: the potential $U=\sum_{\vec G}U_{\vec G}e^{i\vec G\cdot\vec r}$ couples $\vec k$ to $\vec k-\vec G$. Where $\epsilon_{\vec k}=\epsilon_{\vec k-\vec G}$ (zone boundary) the $2\times2$ problem splits the levels:"),
       EQ(r"\begin{vmatrix}\epsilon_{\vec k}-E & U_{\vec G}\\ U_{\vec G}^* & \epsilon_{\vec k-\vec G}-E\end{vmatrix}=0\ \Rightarrow\ E_\pm=\epsilon\pm|U_{\vec G}|,\qquad E_g=2|U_{\vec G}|", "Gap at the zone boundary."),
       T(r"<b>Tight binding</b>: start from atomic orbitals, let electrons hop between neighbours with amplitude $B$: $E(k)=E_i-A_i-2B_i\cos ka$ in 1D. Bandwidth $4B_i$, effective mass at the bottom $m^*=\hbar^2/(2B_ia^2)$. Each atomic level becomes a band."),
       I(r"Two views of one band structure. NFE: free parabola with small gaps opened by Bragg reflection (standing waves $\cos$, $\sin$ pile charge on or between the ions). Tight binding: sharp atomic levels broadened by overlap. Small overlap = narrow band = heavy electron."),
       P(r"$\hbar\vec k$ is crystal momentum, not momentum. $\epsilon(\vec k)$ is periodic in $\vec G$; $\vec v=\frac1\hbar\nabla_{\vec k}\epsilon$, zero at band extrema and at the zone boundary of a symmetric band. Full bands carry no current: insulators."),
       X(r"HS20 Task 5 (M point of a 2D square lattice, 13 pt) is exactly the $2\times2$ NFE problem; MC (n) asks the tight-binding mass, MC (p) the Bloch theorem.")],
      [Q(r"For $E=E_i-A_i-2B\cos ka$, the effective mass at the band top $k=\pi/a$ is", [r"$+\hbar^2/(2Ba^2)$", r"$-\hbar^2/(2Ba^2)$", r"$\hbar^2/(Ba^2)$", "infinite"], 1, r"$E''(\pi/a)=-2Ba^2$: negative mass; an empty state there behaves as a positive-mass hole."),
       Q(r"In the NFE model the gap at the zone boundary equals", [r"$|U_{\vec G}|$", r"$2|U_{\vec G}|$", r"$U_0$ of the full potential", r"$\hbar^2G^2/2m$"], 1, r"Splitting of the $2\times2$ degenerate problem.")])

    Q1 = quiz('Q1', "Fermi Sea multiple choice", 25,
      [src(HS20, "Task 1 MC (m),(n),(o),(p)"), src(S, "Ch. 3")],
      [Q(r"A metal has an electron density $5.00\times10^{22}$ cm$^{-3}$. Free-electron Fermi energy at $T=0$:", ["310 eV", "0.786 meV", "3.118 eV", "4.95 eV"], 3, r"$k_F=(3\pi^2\cdot5\times10^{28})^{1/3}=1.14$ Å$^{-1}$, $\epsilon_F=3.81\times1.30$ eV.", src(HS20, "MC (m)")),
       Q(r"Tight binding $E(k)=E_i-A_i-2B_i\cos(ka)$: effective mass at the minimum", [r"$\hbar^2/(2B_ia^2)$", r"$\hbar^2/(2B_i^2a)$", r"$B_ia^2$", r"$2B_i$"], 0, r"$m^*=\hbar^2/E''(0)$, $E''(0)=2B_ia^2$.", src(HS20, "MC (n)")),
       Q(r"Isotropic parabolic bands in 2D: the density of states near the band edge is", [r"$\propto\sqrt{E-E_c}$", "constant (a step at the band edge)", r"$\propto1/\sqrt{E-E_c}$", r"$\propto(E-E_c)^2$"], 1, r"In 2D $\nu=m^*/\pi\hbar^2$ (both spins), independent of $E$. 1D: $1/\sqrt{E}$, 3D: $\sqrt E$.", src(HS20, "MC (o)")),
       Q(r"Bloch's theorem", ["describes a plane wave times a lattice-periodic function", "describes the electronic specific heat", "is not used in tight binding", "holds only in 3D with spin degeneracy"], 0, r"$\psi=u_{\vec k}e^{i\vec k\cdot\vec r}$; tight-binding states are Bloch states.", src(HS20, "MC (p)")),
       Q(r"Compressing a free-electron metal so that $a\to0.9a$ multiplies $\epsilon_F$ by", ["0.81", "0.9", "1.11", "1.23"], 3, r"$k_F\propto1/a$, $\epsilon_F\propto1/a^2=1/0.81$.", src(AUG, "Problem 2a (a)")),
       Q(r"The Fermi surface of a metal is", ["the surface of the crystal", "the surface in k-space separating occupied from empty states at T=0", "the surface of the Brillouin zone", "an equipotential surface in real space"], 1, r"For free electrons a sphere of radius $k_F$; area $4\pi k_F^2$.")])

    D1 = derive('D1', "Count the Fermi sea", 30, src(S, "Ch. 3.1.1-3.1.3, eqs. (3.4)-(3.10)"),
      r"From periodic boundary conditions in a cube $L^3$, derive $k_F=(3\pi^2n)^{1/3}$, the density of states $\nu(\epsilon)$ per volume and $\nu(\epsilon_F)=3n/2\epsilon_F$, and the total energy $\frac35N\epsilon_F$.",
      [r"$\psi\propto e^{i\vec k\cdot\vec r}$ with $\psi(\vec r+L\hat x_i)=\psi(\vec r)$", r"two spin states per $\vec k$"],
      [(r"Allowed $\vec k$ and the volume per state.", r"$k_i=2\pi n_i/L$, so each $\vec k$ occupies $(2\pi/L)^3=(2\pi)^3/V$."),
       (r"Number of electrons in the sphere of radius $k_F$.", r"$N=2\cdot\frac{4\pi k_F^3/3}{(2\pi)^3/V}=\frac{Vk_F^3}{3\pi^2}\Rightarrow k_F=(3\pi^2n)^{1/3}$."),
       (r"$N(\epsilon)$ and $\nu(\epsilon)=\frac1V\frac{dN}{d\epsilon}$.", r"$N(\epsilon)=\frac{V}{3\pi^2}\big(\frac{2m\epsilon}{\hbar^2}\big)^{3/2}$, $\nu=\frac{1}{2\pi^2}\big(\frac{2m}{\hbar^2}\big)^{3/2}\sqrt\epsilon=\frac{3}{2}\frac{N/V}{\epsilon}$ at $\epsilon_F$."),
       (r"Total energy.", r"$E=V\int_0^{\epsilon_F}\epsilon\,\nu\,d\epsilon\propto\epsilon_F^{5/2}$, $N\propto\epsilon_F^{3/2}$, so $E/N=\frac35\epsilon_F$; pressure $P=-\partial E/\partial V=\frac25n\epsilon_F$ (the white-dwarf link).")],
      [r"one state per $(2\pi)^3/V$, factor 2 for spin", r"$k_F=(3\pi^2n)^{1/3}$", r"$\nu(\epsilon_F)=3n/2\epsilon_F$", r"$E=\frac35N\epsilon_F$, $P=\frac25n\epsilon_F$"])
    return [L1, L2, Q1, D1]

def drift():
    L1 = lesson('L1', "Drude, mobility and the Hall effect", 'theory', 15, 20,
      [src(S, "Ch. 4.1, eqs. (4.1)-(4.9), pp. 93-95")],
      [EQ(r"m\dot{\vec v}+\frac{m}{\tau}\vec v=-e(\vec E+\vec v\times\vec B),\qquad \sigma=\frac{ne^2\tau}{m},\qquad \mu=\frac{e\tau}{m}", "(4.1)-(4.5): drift in a viscous medium."),
       EQ(r"R_H=\frac{E_y}{j_xB_z}=-\frac{1}{ne}\quad(\text{holes: }+\tfrac1{pe}),\qquad U_H=\frac{IB}{ne\,d}", "(4.9): d = thickness along B."),
       I(r"Hall: the Lorentz force pushes carriers sideways until the transverse field cancels it. Electrons and holes are pushed to the same edge (they drift in opposite directions), so the <i>sign</i> of the Hall voltage reveals the carrier sign while $\sigma\propto e^2$ cannot. The smaller $n$, the bigger $U_H$: semiconductors give mV, metals nV."),
       T(r"Switch off $\vec E$: $\dot v=-v/\tau$, the drift relaxes in $\tau$. More impurities: larger $1/\tau$, smaller $j$ (HS20 Task 3)."),
       P(r"In metals the relevant speed is $v_F\sim10^6$ m/s, not the thermal speed; $\ell=v_F\tau\sim40$ nm in Cu at 300 K, far longer than the ion spacing: the periodic lattice does not scatter. Positive $R_H$ in Al, Zn is a band effect (holes), not explainable by Drude.")],
      [Q(r"Doubling the sample thickness $d$ along $\vec B$ at fixed current changes $U_H$ by a factor", ["2", "1", "1/2", "1/4"], 2, r"$U_H=IB/(ned)$."),
       Q(r"A p-type sample has Hall coefficient", ["negative", "positive", "zero", "it depends on B"], 1, r"$R_H=+1/(pe)$.")])

    L2 = lesson('L2', "What scatters electrons: ρ(T), Matthiessen, Wiedemann–Franz", 'theory', 15, 20,
      [src(S, "Ch. 4.2.5 and 4.3, eqs. (4.23)-(4.41), pp. 102-110")],
      [EQ(r"\frac1\tau=\sum_i\frac1{\tau_i}\ \Rightarrow\ \rho=\rho_0+\rho_{\rm ph}(T)+\ldots", "(4.23)-(4.24) Matthiessen."),
       EQ(r"\rho_{\rm ph}\propto T\ (T\gg T_D),\qquad \rho_{\rm ph}\propto T^5\ (T\ll T_D),\qquad \rho_{\rm def}\simeq\frac{3n_dQ}{e^2v_F\nu(\epsilon_F)},\qquad \rho_{ee}\propto T^2", "(4.26), (4.29), (4.32), (4.33)."),
       EQ(r"\kappa=\frac{\pi^2}{9}(k_Bv_F)^2T\tau\nu(\epsilon_F),\qquad \frac{\kappa}{\sigma T}=\frac{\pi^2}{3}\Big(\frac{k_B}{e}\Big)^2=2.44\times10^{-8}\ \mathrm{W\Omega K^{-2}}", "(4.40)-(4.41)."),
       I(r"High $T$: number of phonons $\propto T/T_D$ (Bose–Einstein $\approx k_BT/\hbar\omega$). Low $T$: only $\propto T^3$ phonons, and each can turn the electron only a little, so $\sim T^{-2}$ collisions are needed to relax the current: $T^5$. Defects: a fixed obstacle density, $T$-independent residual resistivity, measured by the residual resistance ratio."),
       P(r"Wiedemann–Franz holds for elastic scattering (defects, $T\gg T_D$), it fails at intermediate $T$ where small-angle phonon scattering relaxes heat but not charge. The Aug 2024 key writes $\pi^2/2$: the script has $\pi^2/3$."),
       X(r"HS23 Jan 2b: $\rho_A/\rho_B$ with phonon scattering (equal or different $\Theta_D$), then defect scattering at 5 K: $\tau_A/\tau_B$, $n_{d,A}/n_{d,B}$, $\kappa_A/\kappa_B$. HS20 MC (d): $\rho(T\to0)$ constant from defects; MC (q): the periodic lattice does not scatter.")],
      [Q(r"Resistivity of a clean metal well above $T_D$:", [r"$\propto T^5$", r"$\propto T$", r"constant", r"$\propto e^{-T_D/T}$"], 1, r"Number of phonons $\propto T$."),
       Q(r"Two metals have $\rho_A=2\rho_B$ at 4 K. Wiedemann–Franz gives $\kappa_A/\kappa_B=$", ["2", "1", "1/2", "1/4"], 2, r"$\kappa\propto T/\rho$ at the same $T$.")])

    Q1 = quiz('Q1', "Drift Corridor multiple choice", 25,
      [src(HS20, "Task 1 MC (d),(q); Task 3"), src(S, "Ch. 4")],
      [Q(r"The resistance of a metal in the limit $T\to0$ is", ["linear in T due to phonon scattering", "T-independent due to phonon scattering", "linear in T due to impurity scattering", "T-independent due to impurity scattering"], 3, r"Phonons freeze out; residual resistivity from defects.", src(HS20, "MC (d)")),
       Q(r"Which process does NOT contribute to the finite resistance of a solid?", ["scattering by phonons", "scattering by the ion cores of the exactly periodic lattice", "scattering by ionised impurities", "scattering by lattice defects"], 1, r"Bloch states are exact eigenstates of the periodic potential.", src(HS20, "MC (q)")),
       Q(r"After the field is switched off, the Drude drift velocity", ["stays constant", "decays as e^{-t/τ}", "oscillates at the plasma frequency", "reverses"], 1, r"$\dot v=-v/\tau$.", src(HS20, "Task 3 (a)")),
       Q(r"More impurities in an electron gas at fixed field: current density", ["increases", "decreases, because 1/τ grows", "unchanged", "decreases, because n drops"], 1, r"$j=ne^2\tau E/m$.", src(HS20, "Task 3 (c)")),
       Q(r"The Hall effect is mostly measured on semiconductors rather than metals because", ["metals have no Lorentz force", "U_H ∝ 1/n is tiny in metals", "metals have holes", "semiconductors have higher mobility"], 1, r"Cu in a typical geometry: $\sim$nV; a doped semiconductor: mV."),
       Q(r"At $T\ll T_D$ phonon-limited resistivity varies as", [r"$T$", r"$T^2$", r"$T^3$", r"$T^5$"], 3, r"$T^3$ phonons times $T^2$ for the small-angle random walk (Bloch–Grüneisen).")])

    D1 = derive('D1', "Hall coefficient from the Drude equation", 30, src(HS20, "Task 3 (d)-(f); script 4.1.2"),
      r"Current $j_y$ along $y$, field $B_z$ along $z$, cubic sample of edge $d$. Starting from $m\dot{\vec v}+m\vec v/\tau=-e(\vec E+\vec v\times\vec B)$, derive the carrier density from the measured Hall voltage $U_H$.",
      [r"$\vec j=-ne\vec v$", r"steady state, $j_x=0$"],
      [(r"Rewrite the steady state in terms of $\vec j$.", r"$-\frac{m}{\tau ne}\vec j=-e\vec E+\frac1n\vec j\times\vec B$ (insert $\vec v=-\vec j/ne$; note $\vec v\times\vec B=-\frac1{ne}\vec j\times\vec B$)."),
       (r"Take the $x$ component with $j_x=0$.", r"$(\vec j\times\vec B)_x=j_yB_z$, so $0=-eE_x+\frac1nj_yB_z$, $E_x=\frac{j_yB_z}{ne}$."),
       (r"Hall voltage and density.", r"$U_H=dE_x\Rightarrow n=\frac{d\,j_yB_z}{eU_H}=\frac{IB_z}{e\,d\,U_H}$ with $I=j_yd^2$. $R_H=E_x/(j_yB_z)$ here is $+\frac1{ne}$ in this $y$-current geometry; in the script's geometry (current along $x$, $V$ along $y$) the same physics reads $R_H=-\frac1{ne}$."),
       (r"Why does $\tau$ drop out?", r"The transverse balance is between two forces on the same carriers ($eE$ and $evB$): no friction term in $x$ because $j_x=0$. So the Hall effect measures $n$ independent of scattering.")],
      [r"$\vec v=-\vec j/(ne)$", r"$x$-component with $j_x=0$", r"$n=d\,j_yB_z/(eU_H)$", r"$\tau$-independence; sign gives the carrier type"])
    return [L1, L2, Q1, D1]
