from common import *
from extra_common import *

def room():
    c1 = calc('c1', "Noble-gas crystal: argon from the Lennard-Jones potential", 'normal',
      r"Script 1.6.2: $U(R)=4U_0\big[(\sigma/R)^{12}-(\sigma/R)^6\big]$ (eq. 1.43). Argon: $U_0/k_B=121$ K, $\sigma=3.4$ Å (Table 1.1). Model the fcc crystal with nearest neighbours only ($Z=12$), so the energy per atom is $\frac Z2U(R)=6U(R)$ and the volume per atom is $R^3/\sqrt2$.",
      V('kB', U0K=121.0, sigma=3.4e-10),
      [step('Rmin', r"Position of the minimum $R_{\min}=2^{1/6}\sigma$ in Å.", "2**(1/6)*sigma*1e10", "A", ["A", "nm", "A^-1", "K"], 0.01,
            r"$dU/dR=0\Rightarrow(\sigma/R)^6=\frac12$. $1.12\sigma=3.82$ Å, close to the measured nearest-neighbour distance 3.76 Å (Table 1.1). (The script's text and its $R_{\min}$ column say $\approx1.3\sigma$; that does not follow from eq. 1.43.)"),
       step('Umin', r"Depth of the pair potential at the minimum, $U(R_{\min})$, in units of $U_0$.", "4*(0.25-0.5)", "dimensionless", ["dimensionless", "K", "eV", "A"], 0.01,
            r"$(\sigma/R)^{12}=\frac14$, $(\sigma/R)^6=\frac12$: $4(\frac14-\frac12)=-1$. $U_0$ is the well depth."),
       step('Ecoh', r"Cohesive energy per atom $6U_0$ (nearest neighbours only) in meV.", "6*U0K*kB/eV*1e3", "meV", ["meV", "eV", "K", "J"], 0.02,
            r"$6\times121$ K $=726$ K $=63$ meV. Full lattice sums (all shells) give $8.6U_0$; experiment 80 meV. Note $U_0/k_B\approx$ the boiling point (87 K): bonding of this strength melts near $U_0/k_B$."),
       step('B', r"Bulk modulus $B=v\,\frac{d^2E}{dv^2}=\frac{96}{\sqrt2}\frac{U_0}{R_{\min}^3}$ in GPa (from $E=6U(R)$, $v=R^3/\sqrt2$, at the minimum).", "96/sqrt(2)*U0K*kB/(Rmin*1e-10)**3/1e9", "GPa", ["GPa", "Pa", "MPa", "J/m^3 K"], 0.02,
            r"$U''(R_{\min})=72U_0/R_{\min}^2$; $B=\frac{v\,E''(R)}{(dv/dR)^2}$ with $dv/dR=3R^2/\sqrt2$. About 2 GPa (measured 2.7 GPa): van der Waals solids are soft. Copper: 140 GPa.")],
      70)

    c2 = calc('c2', "Ionic crystal: the Madelung energy of NaCl", 'normal',
      r"Script 1.6.3: ignoring the short-range repulsion, the cohesion energy per ion pair is the Madelung energy $U_{\rm coh}=-\frac{e^2\alpha}{4\pi\epsilon_0R_0}$ (eq. 1.47), $\alpha=1.7476$ for NaCl, $R_0=2.82$ Å. A repulsion $\propto1/R^n$ fixes $R_0$ and gives (standard extension, not in the script) $U=-\frac{e^2\alpha}{4\pi\epsilon_0R_0}\big(1-\frac1n\big)$ and the bulk modulus $B=\frac{(n-1)\alpha e^2}{4\pi\epsilon_0\,18R_0^4}$. Measured: $B=24$ GPa.",
      V('e', 'eps0', 'kB', alpha=1.7476, R0=2.82e-10, n=8.0, Bexp=24e9),
      [step('UM', r"Madelung energy per ion pair, $e^2\alpha/(4\pi\epsilon_0R_0)$, in eV.", "e**2*alpha/(4*pi*eps0*R0)/e", "eV", ["eV", "meV", "K", "kJ"], 0.01,
            r"$e^2/4\pi\epsilon_0=14.40$ eV Å: $14.40\times1.7476/2.82=8.9$ eV."),
       step('UMK', r"The same in kelvin ($U/k_B$).", "UM*eV/kB", "K", ["K", "eV", "meV", "J"], 0.01,
            r"$1.04\times10^5$ K per pair. (The script's Table 1.2 lists $1.8\times10^4$ K 'per ion' as computed from eq. 1.47, which does not reproduce: eq. 1.47 gives $5.2\times10^4$ K per ion. Use the formula.)"),
       step('Un', r"Including the repulsion with $n=8$: lattice energy per pair in eV.", "UM*(1-1/n)", "eV", ["eV", "meV", "K", "kJ"], 0.01,
            r"At equilibrium the repulsion is $1/n$ of the attraction: $7.8$ eV. Experimental lattice energy of NaCl: 7.9 eV per pair. The repulsion costs only $\sim12\%$: the cohesion is almost entirely Madelung (script's argument)."),
       step('Bth', r"Bulk modulus for $n=8$ in GPa.", "(n-1)*alpha*e**2/(4*pi*eps0*18*R0**4)/1e9", "GPa", ["GPa", "Pa", "MPa", "eV"], 0.02,
            r"$V=2NR_0^3$ for NaCl; $B=V\,\partial^2U/\partial V^2$ at $R_0$. $\approx25$ GPa against the measured 24 GPa."),
       step('nfit', r"Invert: which $n$ reproduces the measured $B=24$ GPa?", "1+Bexp*4*pi*eps0*18*R0**4/(alpha*e**2)", "dimensionless", ["dimensionless", "GPa", "eV", "A"], 0.02,
            r"$n=1+\frac{72\pi\epsilon_0R_0^4B}{\alpha e^2}\approx7.8$: the repulsion is very steep, as the script says (much faster than Coulomb).")],
      70)

    c3 = calc('c3', "Why van der Waals is weak", 'fermi',
      r"Quick fight (script 1.6.1): two neutral atoms of radius $r_0$ at distance $R$ attract with $U\approx-\frac{e^2r_0^5}{4\pi\epsilon_0R^6}$ (eq. 1.42), while two electrons at the same distance repel with $\frac{e^2}{4\pi\epsilon_0R}$. Compare at $R=2r_0$ and $R=3r_0$ (factor-of-1.3 estimates).",
      dict(),
      [step('r2', r"$|U_{\rm vdW}|/U_{\rm Coulomb}$ at $R=2r_0$.", "(1/2)**5", "dimensionless", ["dimensionless", "eV", "K", "A"], 0.1,
            r"Ratio $=(r_0/R)^5=1/32$: 'two orders of magnitude weaker' in the script's words, roughly.", tolType='log'),
       step('r3', r"Same at $R=3r_0$.", "(1/3)**5", "dimensionless", ["dimensionless", "eV", "K", "A"], 0.1,
            r"$1/243$: two to three orders. The $R^{-6}$ law (fluctuating dipole inducing a dipole) makes van der Waals the weakest bond: noble gases boil at tens of K.", tolType='log')],
      20)

    c4 = calc('c4', "The 1D Madelung constant", 'normal',
      r"An infinite chain of alternating charges $\pm e$ with spacing $R_0$. Madelung's sum for one ion: $\alpha=\sum_{j\ne0}\frac{\pm1}{p_j}$ (eq. 1.46) with $p_j=|j|$ and sign $+$ for opposite charges (attraction counted positive). Sum it.",
      dict(),
      [step('alpha', r"$\alpha=2\big(1-\frac12+\frac13-\frac14+\dots\big)$.", "2*log(2)", "dimensionless", ["dimensionless", "eV", "A", "K"], 0.01,
            r"Two neighbours at each distance $j$, alternating sign: $2\ln2=1.386$. Compare NaCl 1.7476, CsCl 1.7627 (script). The series converges only conditionally: the order of summation matters in 3D, which is why Madelung sums need care."),
       step('partial', r"How large is the partial sum over the first 10 neighbours on each side, as a fraction of the limit?", "2*(1-1/2+1/3-1/4+1/5-1/6+1/7-1/8+1/9-1/10)/(2*log(2))", "dimensionless", ["dimensionless", "eV", "A", "K"], 0.01,
            r"Still off by $\sim7\%$ after 20 ions: the slow, sign-alternating convergence the script warns about.")],
      50)

    L1 = lesson('L1', "Bonding in crystals", 'theory', 15, 20,
      [src(S, "Ch. 1.6, eqs. (1.37)-(1.47), pp. 24-37")],
      [T(r"Five bond types: van der Waals (noble gases, molecular crystals), ionic (NaCl), covalent (diamond, Si), hydrogen (ice), metallic (Na, Cu). All are electrostatic plus quantum mechanics (Pauli repulsion, orbital overlap)."),
       EQ(r"U_{\rm vdW}(R)\approx-\frac{e^2r_0^5}{4\pi\epsilon_0R^6},\qquad U_{LJ}(R)=4U_0\Big[\Big(\frac\sigma R\Big)^{12}-\Big(\frac\sigma R\Big)^6\Big],\quad R_{\min}=2^{1/6}\sigma", "(1.42)-(1.43). The R⁻¹² is Pauli repulsion."),
       EQ(r"U=-N\frac{e^2\alpha}{4\pi\epsilon_0R_0},\qquad \alpha=\sum_{j\ne0}\frac{\pm1}{p_j}\ \ (\text{NaCl }1.7476,\ \text{CsCl }1.7627)", "(1.45)-(1.47): Madelung energy, N ion pairs."),
       I(r"Van der Waals: a fluctuating dipole on one atom polarises the other; energy $\propto\alpha_{\rm pol}p^2/R^6$, always attractive and isotropic, so noble gases pack like spheres (fcc, filling 0.74). Ionic: long-range Coulomb dominates, repulsion only fixes $R_0$. Covalent: a bonding orbital puts charge between the nuclei; directional (diamond tetrahedra). Metallic: a collective band, non-directional."),
       P(r"Covalent bonds are directional and can join different elements (GaAs is partly ionic); ionic bonds join different elements; van der Waals comes from charge fluctuations (HS20 MC (j)). The script's 'R<sub>min</sub> ≈ 1.3σ' and its Table 1.2 cohesion values do not follow from its own eqs. 1.43 and 1.47: compute from the formulas."),
       X(r"No written-exam problem on bonding so far (HS20 MC (j) only); oral protocols asked why ionic crystals are insulators and how van der Waals arises. Low priority, but cheap points: Madelung, Lennard-Jones minimum, bulk modulus as a second derivative.")],
      [Q(r"The minimum of the Lennard-Jones potential lies at", [r"$\sigma$", r"$2^{1/6}\sigma\approx1.12\sigma$", r"$1.3\sigma$", r"$2\sigma$"], 1, r"$dU/dR=0\Rightarrow(\sigma/R)^6=1/2$."),
       Q(r"Which statement is true?", ["covalent bonds occur only between atoms of the same element", "ionic bonds occur only between atoms of the same element", "covalent bonds are generally non-directional", "van der Waals bonds are caused by charge fluctuations"], 3, r"HS20 MC (j).", src(HS20, "MC (j)"))])

    Q1 = quiz('Q1', "Bonding multiple choice", 25, [src(HS20, "MC (j)"), src(S, "Ch. 1.6")],
      [Q(r"Which statement is true?", ["covalent bonds occur only between atoms of the same element", "ionic bonds occur only between atoms of the same element", "covalent bonds are generally non-directional", "van der Waals bonds are caused by charge fluctuations"], 3, r"Fluctuating dipoles induce dipoles.", src(HS20, "MC (j)")),
       Q(r"The van der Waals attraction falls off as", [r"$R^{-1}$", r"$R^{-3}$", r"$R^{-6}$", r"$R^{-12}$"], 2, r"Dipole field $\propto R^{-3}$, induced energy $\propto E^2$."),
       Q(r"The short-range repulsion between closed-shell atoms is mainly due to", ["gravity", "nuclear forces", "the Pauli principle", "magnetic dipoles"], 2, r"Overlapping filled orbitals must be orthogonalised using higher orbitals (script 1.6.2)."),
       Q(r"Noble-gas crystals adopt fcc or hcp because", ["their bonds are directional", "isotropic forces favour densest sphere packing", "they are ionic", "of the Madelung constant"], 1, r"Filling fraction 0.74."),
       Q(r"NaCl is an electrical insulator because", ["it has free electrons", "electron transfer fills the Cl 3p shell: closed shells, a large gap", "it is a van der Waals solid", "the ions are too heavy"], 1, r"Na$^+$ and Cl$^-$ are closed-shell ions; the band gap is about 8.5 eV."),
       Q(r"Why does a NaCl crystal not evaporate as ions at its boiling point despite $U_{\rm coh}/k_B\sim10^5$ K?", ["it does", "it evaporates as neutral atoms/molecules: electron transfer back costs less", "Madelung energy is zero", "the ions are bound by van der Waals forces"], 1, r"Script 1.6.3: ionisation energy of Na minus electron affinity of Cl is regained on neutralisation.")])

    D1 = derive('D1', "Bulk modulus of an ionic crystal", 30, src(S, "Ch. 1.6.3 eq. (1.47) plus a 1/R^n repulsion (standard Born model, not in the script)"),
      r"With $U(R)=N\big[-\frac{\alpha e^2}{4\pi\epsilon_0R}+\frac{C}{R^n}\big]$ for $N$ ion pairs in NaCl structure ($V=2NR^3$), find $R_0$, $U(R_0)$ and $B=V\,\partial^2U/\partial V^2$.",
      [r"$V=2NR^3$ for the rock-salt structure", r"$B=V\frac{\partial^2U}{\partial V^2}$ at equilibrium"],
      [(r"Equilibrium.", r"$\frac{dU}{dR}=0\Rightarrow\frac{\alpha e^2}{4\pi\epsilon_0R_0^2}=\frac{nC}{R_0^{n+1}}$, so $C=\frac{\alpha e^2R_0^{n-1}}{4\pi\epsilon_0n}$."),
       (r"Cohesive energy.", r"$U(R_0)=-N\frac{\alpha e^2}{4\pi\epsilon_0R_0}\big(1-\frac1n\big)$: the repulsion only removes the fraction $1/n$."),
       (r"Convert $d/dV$ to $d/dR$ at the minimum.", r"$\frac{d^2U}{dV^2}=\frac{U''(R)}{(dV/dR)^2}$ (the $U'$ term vanishes), $dV/dR=6NR^2$."),
       (r"Second derivative and result.", r"$U''(R_0)=N\frac{\alpha e^2}{4\pi\epsilon_0R_0^3}(n-1)$, so $B=\frac{2NR_0^3\cdot N\alpha e^2(n-1)}{4\pi\epsilon_0R_0^3\cdot36N^2R_0^4}=\frac{(n-1)\alpha e^2}{72\pi\epsilon_0R_0^4}$; NaCl with $n\approx8$: 25 GPa (measured 24 GPa).")],
      [r"$C$ from $dU/dR=0$", r"$U_0=-\frac{\alpha e^2}{4\pi\epsilon_0R_0}(1-\frac1n)$", r"$d^2U/dV^2=U''/(dV/dR)^2$ at the minimum", r"$B=\frac{(n-1)\alpha e^2}{72\pi\epsilon_0R_0^4}$"])

    boss1 = boss('b1', "Boss: cohesion of rare-gas and ionic crystals (constructed in exam style)",
      dict(file="notes/solid-state/07-bonding.md", where="constructed from script Ch. 1.6 (eqs. 1.42-1.47, Tables 1.1-1.2) and HS20 MC (j); no written exam has a full bonding problem"),
      25, "Written in the style of a Zheludev problem (short parts, numbers at the end). Do it on paper, then enter the numbers.",
      [r"(a) [1 pt] Explain in two sentences why neutral noble-gas atoms attract each other at large distance, and derive the $R$-dependence of the interaction energy.",
       r"(b) [1 pt] For the Lennard-Jones potential $U=4U_0[(\sigma/R)^{12}-(\sigma/R)^6]$ find the equilibrium distance of a pair and the binding energy. For krypton ($U_0/k_B=163$ K, $\sigma=3.65$ Å) give $R_{\min}$.",
       r"(c) [1 pt] Treat solid Kr as fcc with nearest-neighbour bonds only. Give the cohesive energy per atom (in meV) and the bulk modulus.",
       r"(d) [1 pt] For NaCl ($R_0=2.82$ Å, $\alpha=1.7476$) give the Madelung energy per ion pair and explain why the short-range repulsion barely changes it.",
       r"(e) [1 pt] Explain why NaCl boils near 1700 K although its cohesive energy per pair corresponds to $\sim10^5$ K."],
      [fa('Rmin', "(b) $R_{\\min}$ of Kr in Å.", "2**(1/6)*3.65", dict(), 0.01),
       fa('Ecoh', "(c) Cohesive energy per atom (nearest neighbours) in meV.", "6*163*kB/eV*1e3", dict(kB=K['kB']), 0.02),
       fa('B', "(c) Bulk modulus in GPa.", "96/sqrt(2)*163*kB/(2**(1/6)*3.65e-10)**3/1e9", dict(kB=K['kB']), 0.03),
       fa('UM', "(d) Madelung energy of NaCl per ion pair in eV.", "e**2*1.7476/(4*pi*eps0*2.82e-10)/e", dict(e=K['e'], eps0=K['eps0']), 0.01)],
      [r"(a) Fluctuating dipole $p\sim er_0$ gives a field $\sim p/4\pi\epsilon_0R^3$ that induces $p_2=\alpha E$ with $\alpha\sim4\pi\epsilon_0r_0^3$; energy $-p_2E\propto-R^{-6}$, always attractive.",
       r"(b) $R_{\min}=2^{1/6}\sigma$, $U(R_{\min})=-U_0$. Kr: 4.10 Å (measured nearest-neighbour distance 4.01 Å).",
       r"(c) $E/N=\frac{12}{2}U(R_{\min})=-6U_0=-84$ meV; $B=\frac{96}{\sqrt2}U_0/R_{\min}^3\approx2.2$ GPa (nearest neighbours only; measured $\approx3.5$ GPa; lattice sums raise $|E|$ to $8.6U_0$).",
       r"(d) $\frac{e^2\alpha}{4\pi\epsilon_0R_0}=8.9$ eV per pair; the repulsion is so steep ($n\sim8$) that it only subtracts $1/n$ of this.",
       r"(e) Boiling produces neutral atoms, not ions: subtract the cost of moving the electron back from Cl$^-$ to Na$^+$ (ionisation energy of Na minus electron affinity of Cl, $\approx1.5$ eV). The script's balance is per ion with different numbers; check its table against eq. 1.47.",
       r"Units: $e^2/4\pi\epsilon_0=14.40$ eV Å; $1$ eV $=11\,604$ K."],
      80)

    room = dict(file='bonding-grotto', id='ss-bonding-grotto', region="Solid State Crystal Caverns", title="The Bonding Grotto", course="solid-state",
      topics=["van der Waals and Pauli repulsion", "Lennard-Jones potential, noble-gas crystals", "ionic crystals, Madelung constant", "cohesive energy and bulk modulus", "covalent, metallic and hydrogen bonds"],
      sources=[src(S, "Ch. 1.6 (pp. 24–37): eqs. 1.37–1.47, Tables 1.1–1.2"), src(HS20, "MC (j)"),
               src("notes/solid-state/07-bonding.md", "transcription, formulas, two script inconsistencies")],
      links=[dict(course="qm", room="tunneling-bridge", why="Pauli repulsion and the exponential tails of atomic orbitals; the H$_2$ bond is the QM two-level problem (bonding/antibonding)."),
             dict(course="astro", room="degenerate-matter", why="The same Pauli principle that makes atoms repel at short distance holds up white dwarfs.")],
      intro="Why do crystals hold together at all? In the grotto you weigh the four kinds of glue: fluctuating dipoles (van der Waals), Coulomb lattices (ionic), shared orbitals (covalent) and the electron sea (metallic). Compute binding energies and stiffness from two formulas each.",
      encounters=[c1, c2, c3, c4, boss1])
    room['_extras'] = [L1, Q1, D1]
    return room

def extras():
    return room()['_extras']
