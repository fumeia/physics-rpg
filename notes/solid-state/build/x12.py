from extra_common import *

def lattice():
    L1 = lesson('L1', "Lattice, basis and the reciprocal lattice", 'theory', 15, 20,
      [src(S, "Ch. 1.2-1.3, eqs. (1.3)-(1.10), pp. 5-12")],
      [T(r"A crystal is a <b>Bravais lattice</b> $\vec R=n_1\vec a+n_2\vec b+n_3\vec c$ plus a <b>basis</b>: the atoms of one primitive cell, at fractional coordinates $\vec r_j=x_1\vec a+x_2\vec b+x_3\vec c$. A <b>primitive cell</b> contains exactly one lattice point; its volume is $V=\vec a\cdot(\vec b\times\vec c)$. The <b>Wigner–Seitz cell</b> (bisectors to all neighbours) is a primitive cell with the full point symmetry."),
       EQ(r"\vec a^*=\frac{2\pi}{V}\,\vec b\times\vec c,\quad \vec b^*=\frac{2\pi}{V}\,\vec c\times\vec a,\quad \vec c^*=\frac{2\pi}{V}\,\vec a\times\vec b", "(1.4): so a·a* = 2π and a·b* = 0."),
       EQ(r"\vec G=h\vec a^*+k\vec b^*+l\vec c^*,\qquad e^{i\vec G\cdot\vec R}=1,\qquad V^*=\frac{(2\pi)^3}{V}", "(1.6)-(1.10). 2D: A* = (2π)²/A."),
       T(r"The <b>first Brillouin zone</b> is the Wigner–Seitz cell of the reciprocal lattice. All zones have the same volume $(2\pi)^3/V$. Reciprocal of sc is sc, of bcc is fcc, of fcc is bcc."),
       I(r"$\vec G$ are exactly the wavevectors of plane waves $e^{i\vec G\cdot\vec r}$ that have the periodicity of the lattice. Anything periodic in the crystal (density, potential) is a Fourier sum over $\vec G$ only. Bigger cell in real space means denser reciprocal lattice and smaller Brillouin zone."),
       P(r"Build the reciprocal lattice from the <b>primitive</b> vectors. A centred cell (two lattice points) gives a reciprocal grid with too many points, half of which carry zero intensity. Count lattice points, not atoms: two different atoms in a rectangle = primitive cell with a 2-atom basis; two identical atoms at corner and centre = centred lattice, primitive area $ab/2$."),
       X(r"Every written exam so far (HS23 Jan and Aug, Problem 1) asks in sequence: primitive cell? its area? basis in fractional coordinates? Wigner–Seitz cell and area? reciprocal lattice sketch, first BZ, its area $(2\pi)^2/A$. Then a change of basis (atoms made identical or shifted) and the same again.")],
      [Q(r"A rectangular lattice has primitive vectors of length 3 Å and 2 Å. The area of its first Brillouin zone is", [r"$6$ Å$^{-2}$", r"$(2\pi)^2/6\approx6.6$ Å$^{-2}$", r"$2\pi/6$ Å$^{-2}$", r"$(2\pi)^2\times6$ Å$^{-2}$"], 1, r"$A^*=(2\pi)^2/A$ with $A=6$ Å$^2$."),
       Q(r"The reciprocal lattice of a bcc lattice is", ["sc", "bcc", "fcc", "hexagonal"], 2, r"Script 1.3.1 (iv): bcc and fcc are reciprocal to each other."),
       Q(r"Identical atoms sit at the corners and at the centre of an $a\times b$ rectangle. The primitive cell area is", [r"$ab$", r"$ab/2$", r"$2ab$", r"$ab/4$"], 1, r"Two lattice points per $a\times b$ cell: it is a centred rectangular lattice (HS23 Jan P1 second part, Aug P1 first part).", src(JAN, "Problem 1 (l),(m)"))])

    L2 = lesson('L2', "Diffraction: where the peaks are and how bright", 'theory', 15, 20,
      [src(S, "Ch. 1.5, eqs. (1.22)-(1.34), pp. 15-23")],
      [T(r"Scattering from a periodic density gives the amplitude $\sum_{\vec R}e^{i\vec K\cdot\vec R}\,F(\vec K)$ with $\vec K=\vec k_f-\vec k_i$. The lattice sum vanishes unless $\vec K$ is a reciprocal lattice vector:"),
       EQ(r"I(\vec K)\propto N^2|F(\vec K)|^2\ \text{if}\ \vec K=\vec G,\qquad F(\vec G)=\sum_j f_j\,e^{i\vec G\cdot\vec r_j}=\sum_j f_j\,e^{2\pi i(hx_j+ky_j+lz_j)}", "(1.29)-(1.33): Laue condition and structure factor."),
       EQ(r"|\vec k_i|=|\vec k_f|=\frac{2\pi}{\lambda},\qquad |\vec G|=\frac{4\pi\sin\theta}{\lambda}\ \Leftrightarrow\ 2d_{hkl}\sin\theta=n\lambda", "(1.34): scattering angle 2θ between k_i and k_f."),
       I(r"The <b>lattice</b> decides <i>where</i> peaks can appear; the <b>basis</b> decides <i>how bright</i> each one is. Identical atoms at special positions cancel some peaks completely (extinction): bcc keeps only $h+k+l$ even, fcc only all-even or all-odd."),
       P(r"$\theta$ versus $2\theta$: the angle between $\vec k_i$ and $\vec k_f$ is $2\theta$. The Zheludev key calls $\theta$ the 'scattering angle'. Write both. And intensities go as $|F|^2$, not $F$."),
       T(r"Ewald construction: a sphere of radius $k$ through the origin of reciprocal space; peaks where it passes through $\vec G$. Rotating a crystal (or using a powder) sweeps it: all $\vec G$ with $|\vec G|\le2k$ are reachable. Debye–Scherrer powder: rings."),
       X(r"HS23: neutrons $\lambda=2.36$ Å, $|\vec k|=2.66$ Å$^{-1}$, angles of the $(2,1)$ and $(1,1)$ peaks, intensity ratio from $F$. HS20: structure factor of BaTiO$_3$, $I(200)/I(110)=9/4$; MC on Laue patterns of sc/fcc/bcc and Debye–Scherrer.")],
      [Q(r"In a bcc crystal (cubic cell, atoms at $(0,0,0)$ and $(\frac12,\frac12,\frac12)$), which reflection is absent?", [r"$(110)$", r"$(200)$", r"$(100)$", r"$(211)$"], 2, r"$F=f(1+e^{i\pi(h+k+l)})=0$ for $h+k+l$ odd."),
       Q(r"Neutrons with $\lambda=2.36$ Å have an energy of about", ["1.5 meV", "15 meV", "150 meV", "5 keV"], 1, r"$E=h^2/(2m_n\lambda^2)=81.8/\lambda^2$ meV $=14.7$ meV: the scale of phonons. X-rays of the same $\lambda$ have 5.3 keV.")])

    Q1 = quiz('Q1', "Crystal Gate multiple choice (HS20 style)", 25,
      [src(HS20, "Task 1 MC (e),(f),(g),(h),(k); key in solutions/... HS20 (Solution).pdf"), src(S, "Ch. 1")],
      [Q(r"Which regular polygon can be the unit cell of a 2D crystal lattice (lattice points at its corners)?", ["regular pentagon", "regular hexagon", "regular heptagon", "regular octagon"], 1, r"Only 1-, 2-, 3-, 4- and 6-fold rotations are compatible with translations. Regular hexagons tile the plane (the hexagon is the Wigner–Seitz cell of the triangular lattice); 5-, 7- and 8-gons cannot.", src(HS20, "MC (f)")),
       Q(r"In the Debye–Scherrer method (powder, monochromatic $\lambda_0=2\pi/|\vec k_0|$) one observes, in the Ewald picture,", [r"all reflections on a sphere of radius $|\vec k_0|$ about the origin", r"all reflections on a sphere of radius $|\vec k_0|$ about the point $\vec k_0$", r"all reflections on a sphere of radius $2|\vec k_0|$ about the origin", r"all reflections inside a sphere of radius $2|\vec k_0|$ about the origin"], 3, r"Powder = all crystal orientations, so every $\vec G$ with $|\vec G|\le2k_0$ satisfies Laue for some grain.", src(HS20, "MC (h)")),
       Q(r"If the volume of a crystal is halved (same material), then", ["the structure factor changes", "the electronic specific heat per volume changes", "the number of phonon branches changes", "none of these changes"], 3, r"$F$ depends on the basis, $c_V/V$ on the density of states per volume, the branch count on the atoms per cell: all intensive.", src(HS20, "MC (k)")),
       Q(r"Laue pattern of an fcc crystal: which reflections survive?", [r"all $(hkl)$", r"$h+k+l$ even", r"$h,k,l$ all even or all odd", r"$h+k+l$ odd"], 2, r"$F=f[1+e^{i\pi(h+k)}+e^{i\pi(h+l)}+e^{i\pi(k+l)}]$ is $4f$ for unmixed and 0 for mixed parity. This is how the HS20 MC (g) patterns distinguish bcc and fcc.", src(HS20, "MC (g)")),
       Q(r"The conventional cubic cell of fcc contains how many lattice points?", ["1", "2", "4", "8"], 2, r"$8\times\frac18$ corners $+6\times\frac12$ faces $=4$; the primitive cell has volume $a^3/4$."),
       Q(r"Shifting half of the atoms of a centred rectangular crystal so that the $a\times b$ rectangle becomes the primitive cell makes the first Brillouin zone", ["twice as large", "unchanged", "half as large", "four times as large"], 2, r"Primitive area doubles from $ab/2$ to $ab$, so $A^*=(2\pi)^2/A$ halves (HS23 Aug: 3.95 to 1.97 Å$^{-2}$).", src(AUG, "Problem 1 (f),(l)"))])

    D1 = derive('D1', "Laue condition is Bragg's law", 30, src(S, "Ch. 1.3.2 (planes, d_hkl) and 1.5.2 eq. (1.34)"),
      r"Show that the Laue condition $\vec k_f-\vec k_i=\vec G_{hkl}$ for elastic scattering is equivalent to $2d\sin\theta=n\lambda$, where $d$ is the spacing of the lattice planes perpendicular to $\vec G$.",
      [r"$\vec G_{hkl}$ is perpendicular to the planes $(hkl)$ and the shortest such vector has $|\vec G_{hkl}|=2\pi/d_{hkl}$", r"$|\vec k_i|=|\vec k_f|=2\pi/\lambda$"],
      [(r"Draw $\vec k_i$, $\vec k_f$ and $\vec K=\vec k_f-\vec k_i$ for elastic scattering by an angle $2\theta$. What is $|\vec K|$?", r"Isosceles triangle with sides $k,k$ and opening angle $2\theta$: $|\vec K|=2k\sin\theta$, and $\vec K$ bisects the two beams, i.e. the beams make equal angles $\theta$ with the plane perpendicular to $\vec K$ (specular 'reflection')."),
       (r"Use Laue: $\vec K=\vec G=n\,\vec G_{hkl}^{\min}$.", r"$2k\sin\theta=n\frac{2\pi}{d}\Rightarrow2\frac{2\pi}{\lambda}\sin\theta=\frac{2\pi n}{d}\Rightarrow2d\sin\theta=n\lambda$."),
       (r"Why must the planes be perpendicular to $\vec G$ for the picture to work?", r"$e^{i\vec G\cdot\vec r}$ is constant on planes $\vec G\cdot\vec r=$ const spaced by $2\pi/|\vec G|$: those are the lattice planes; reflection from them is the grating picture of Fig. 1.8."),
       (r"Apply: HS23 Aug, $\lambda=2.36$ Å, $(2,1)$ of a $4\times5$ Å rectangle. $d$ and $\theta$?", r"$1/d=\sqrt{(2/4)^2+(1/5)^2}=0.539$ Å$^{-1}$, $d=1.86$ Å; $\sin\theta=\lambda/2d=0.636$, $\theta=39.5^\circ$ (key).")],
      [r"$|\vec K|=2k\sin\theta$ from the elastic triangle", r"$|\vec G|=2\pi n/d$ with $\vec G\perp$ planes", r"$2d\sin\theta=n\lambda$", r"scattering angle is $2\theta$"])
    return [L1, L2, Q1, D1]

def phonon():
    L1 = lesson('L1', "Lattice vibrations: chains, branches, phonons", 'theory', 15, 20,
      [src(S, "Ch. 2.2-2.3, eqs. (2.19)-(2.39), pp. 40-58")],
      [T(r"Atoms in a crystal are coupled harmonic oscillators. Plane-wave ansatz $u_n\propto e^{i(qna-\omega t)}$ turns Newton's equations into an eigenvalue problem of the dynamical matrix $D(q)$; its eigenvalues are $\omega^2$. With $m$ atoms per cell there are $3m$ branches: 3 acoustic ($\omega\to0$ for $q\to0$), $3(m-1)$ optical."),
       EQ(r"\text{monatomic: }\ \omega(q)=2\sqrt{\frac{k}{M}}\left|\sin\frac{qa}{2}\right|,\qquad v_s=a\sqrt{\frac kM}", "Nearest-neighbour springs k, mass M, spacing a."),
       EQ(r"\text{diatomic: }\ \omega^2=k\Big(\tfrac1{M_1}+\tfrac1{M_2}\Big)\pm k\sqrt{\Big(\tfrac1{M_1}+\tfrac1{M_2}\Big)^2-\tfrac{2}{M_1M_2}(1-\cos qa)}", "(2.37); gap at q = π/a between √(2k/M_heavy) and √(2k/M_light)."),
       I(r"Acoustic: neighbouring atoms move together (sound). Optical: the two atoms of a cell move against each other, so in an ionic crystal the mode has an oscillating dipole and couples to infrared light. At the zone edge $d\omega/dq=0$: standing waves, the phonon is Bragg-reflected by the lattice just like an electron."),
       T(r"Quantisation: each normal mode is a harmonic oscillator, $E=\hbar\omega(n+\frac12)$; the quantum $\hbar\omega$ is a <b>phonon</b>, a boson with $\langle n\rangle=1/(e^{\hbar\omega/k_BT}-1)$. Crystal momentum $\hbar q$ is defined modulo $\hbar G$. Inelastic neutron scattering measures $\omega(q)$ directly."),
       P(r"Branch counting is in 3D: NaCl (2 atoms/cell) has 3 acoustic + 3 optical branches, not 1D's 1+1 (HS20 MC (i)). And $q$ only runs over the first BZ: $q$ and $q+G$ are the same vibration.")],
      [Q(r"Group velocity of both diatomic branches at $q=\pi/a$:", ["maximal", "equal to the sound velocity", "zero", "infinite"], 2, r"$\omega(q)=\omega(-q)$ and periodicity force $d\omega/dq=0$ at the zone edge."),
       Q(r"Number of phonon branches of a crystal with 3 atoms per primitive cell:", ["3", "6", "9", "27"], 2, r"$3m=9$: 3 acoustic, 6 optical.")])

    L2 = lesson('L2', "Heat capacity: Dulong–Petit, Einstein, Debye", 'theory', 15, 20,
      [src(S, "Ch. 2.1 and 2.4, eqs. (2.60)-(2.80), pp. 38-65")],
      [EQ(r"U=\int d\epsilon\,\nu(\epsilon)\,\frac{\epsilon}{e^{\epsilon/k_BT}-1},\qquad C_V=\frac{\partial U}{\partial T}", "(2.75)-(2.76), ν per unit volume."),
       EQ(r"\nu_{\rm Debye}(\epsilon)=\frac{9m}{V_0(\hbar\omega_D)^3}\,\epsilon^2\,\Theta(\hbar\omega_D-\epsilon),\qquad T_D=\frac{\hbar\omega_D}{k_B}", "(2.73): ε² from the linear acoustic dispersion, cutoff holds 3mN modes."),
       EQ(r"C_V\xrightarrow{T\ll T_D}\frac{12\pi^4}{5}\frac{mk_B}{V_0}\Big(\frac{T}{T_D}\Big)^3,\qquad C_V\xrightarrow{T\gtrsim T_D}\frac{3mk_B}{V_0}", "(2.79), (2.80): T³ law and Dulong–Petit."),
       T(r"Einstein: all modes at one $\omega_E$, $C/3Nk_B=x^2e^x/(e^x-1)^2$ with $x=\Theta_E/T$. Correct at high $T$ (Dulong–Petit), exponentially too small at low $T$; good for flat optical branches."),
       I(r"'Active modes': at temperature $T$ only modes with $\hbar\omega\lesssim k_BT$ are excited, each classically ($k_B$). For acoustic phonons these fill a sphere of radius $q=k_BT/\hbar v$ in $q$-space: number $\propto T^3$. That is the whole $T^3$ law (2.40-2.41); the same counting with photons gives Stefan–Boltzmann."),
       P(r"Fraction of Dulong–Petit at low $T$: $\frac{4\pi^4}{5}(T/T_D)^3=77.9\,(T/T_D)^3$, not $\frac{12\pi^4}5(\ldots)$. And in metals add the electronic $\gamma T$: $C=\gamma T+\beta T^3$."),
       X(r"HS20 MC (l): Einstein assumes a <i>flat</i> dispersion ($\delta$-function DOS), not a linear one. Aug 2024 2b: Debye DOS $\propto1/(V_0\omega_D^3)$, number of phonons at high $T$ $\propto T/\Theta_D$.")],
      [Q(r"At $T=T_D/10$ the Debye low-temperature formula gives $C_V$ as a fraction of $3Nk_B$ of about", ["0.0078", "0.078", "0.23", "0.78"], 1, r"$77.9\times10^{-3}=0.078$ (the exact Debye function at $T_D/10$ is a bit lower, 0.07, as the $T^3$ law starts to fail)."),
       Q(r"Why does the Einstein model fail at low temperature?", ["it ignores quantisation", "its density of states has a gap: no modes below ħω_E", "it overcounts modes", "it uses Boltzmann statistics"], 1, r"Real crystals have gapless acoustic phonons, so some modes are always excitable: power law instead of $e^{-\Theta_E/T}$.")])

    Q1 = quiz('Q1', "Phonon Halls multiple choice", 25,
      [src(HS20, "Task 1 MC (i),(l)"), src(S, "Ch. 2")],
      [Q(r"How many phonon branches does the dispersion of the NaCl lattice have?", ["2 acoustic and 1 optical", "0 acoustic and 1 optical", "1 acoustic and 0 optical", "3 acoustic and 3 optical"], 3, r"Two atoms per primitive cell, three dimensions.", src(HS20, "MC (i)")),
       Q(r"Which statement about the Einstein model is FALSE?", ["it gives good values of c(T) at high T", "at high T it agrees with Dulong–Petit", "the density of states is a δ-function", "it assumes a linear dispersion so all modes have the same velocity"], 3, r"Einstein's modes have one frequency: a flat dispersion with zero group velocity.", src(HS20, "MC (l)")),
       Q(r"In an optical mode at $q=0$ of a diatomic chain the centre of mass of each cell", ["moves with the sound velocity", "is at rest", "oscillates at twice the frequency", "moves opposite to the neighbouring cell"], 1, r"$M_1u_1+M_2u_2=0$: the two atoms move against each other."),
       Q(r"Which material has the highest Debye temperature?", ["lead", "copper", "aluminium", "diamond"], 3, r"Light and stiff: diamond 2240 K; Pb 105 K, Cu 343 K, Al 428 K (script 2.4.2)."),
       Q(r"For $M_1\to M_2$ the gap at the zone boundary of the diatomic chain", ["grows", "closes, and the BZ effectively doubles", "stays the same", "becomes infinite"], 1, r"Identical atoms: the true period is $a/2$, one branch in a twice larger zone (Fig. 2.2)."),
       Q(r"The low-temperature heat capacity of an insulator goes as", [r"$T$", r"$T^2$", r"$T^3$", r"$e^{-\Theta/T}$"], 2, r"Debye; a metal adds $\gamma T$ from the electrons.")])

    D1 = derive('D1', "Dispersion of the monatomic chain", 30, src(S, "Ch. 2.2.3-2.2.4; oral protocol HS05 (materials/solid-state/old-exams/HS05.pdf)"),
      r"Atoms of mass $M$ at $x_n=na$, nearest-neighbour springs $k$. Derive $\omega(q)$, its long-wavelength limit and the group velocity, and explain why $q$ can be restricted to the first Brillouin zone.",
      [r"potential energy $\Phi=\frac k2\sum_n(u_{n+1}-u_n)^2$"],
      [(r"Equation of motion for $u_n$.", r"$M\ddot u_n=-\partial\Phi/\partial u_n=k(u_{n+1}-2u_n+u_{n-1})$."),
       (r"Insert $u_n=Ae^{i(qna-\omega t)}$.", r"$-M\omega^2=k(e^{iqa}-2+e^{-iqa})=-2k(1-\cos qa)=-4k\sin^2\frac{qa}2$, so $\omega=2\sqrt{k/M}\,|\sin\frac{qa}2|$."),
       (r"Long wavelength $qa\ll1$ and group velocity.", r"$\omega\approx a\sqrt{k/M}\,q$: sound with $v_s=a\sqrt{k/M}$. $v_g=d\omega/dq=a\sqrt{k/M}\cos\frac{qa}2$, zero at $q=\pm\pi/a$."),
       (r"Why only $-\pi/a<q\le\pi/a$?", r"$q\to q+2\pi/a$ changes $e^{iqna}$ by $e^{2\pi in}=1$: the displacements of the atoms are identical. Only $N$ distinct $q$ exist for $N$ atoms (periodic boundary conditions): one per atom per direction.")],
      [r"$M\ddot u_n=k(u_{n+1}+u_{n-1}-2u_n)$", r"$\omega=2\sqrt{k/M}|\sin(qa/2)|$", r"$v_s=a\sqrt{k/M}$, $v_g=0$ at the zone edge", r"$q$ defined modulo $2\pi/a$: N states in the first BZ"])
    return [L1, L2, Q1, D1]
