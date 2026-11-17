"""Guided reading for the solid-state script (Degen, Script-2026): one card per script section group, used by the campaign
run as the first stop of a week (and by the optional second pass through the script).

Each card: questions to keep in mind (before), the exact pages to read (read), questions to answer on paper after reading
with the answer behind a click (think), notes where the script is unclear or slips (slip), and two checks that pass the card.
Notation follows the script: nu(eps) density of states per volume, T_D Debye temperature, K wave-vector transfer,
q phonon wave vector, tau relaxation time, chi_P Pauli susceptibility, U V_0 nu(eps_F) > 2 Stoner.
Page numbers from the script's table of contents and section headings (notes/extracted, page markers).
Writes game/content/solid-state/reading.json: {items: [{room, enc}], weeks: {n: [ids]}}. Run: python3 build.py"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '../../../../game/content/solid-state/reading.json')
SCRIPT = 'materials/solid-state/scripts/Script-2026 2026-09-01.pdf'


def card(id, week, room, sec, pages, title, before, look, think, checks, slips=(), minutes=None):
    blocks = [{'kind': 'before', 'html': '<ul>' + ''.join(f'<li>{q}</li>' for q in before) + '</ul>'},
              {'kind': 'read', 'html': f'<b>Script {sec}, pp. {pages}.</b> ' + look}]
    for q, a in think:
        blocks.append({'kind': 'think', 'html': f'{q}<details><summary>Show the answer</summary>{a}</details>'})
    for s in slips: blocks.append({'kind': 'slip', 'html': s})
    lo, hi = (int(x) for x in pages.split('–'))
    enc = {'type': 'lesson', 'tier': 'reading', 'reading': True, 'week': week, 'id': id, 'title': f'Read {sec}: {title}',
           'minutes': minutes or max(15, min(45, 4 * (hi - lo + 1))), 'xp': 15, 'pages': pages,
           'source': [{'file': SCRIPT, 'where': f'{sec}, pp. {pages}'}], 'blocks': blocks,
           'check': [{'q': q, 'options': o, 'correct': 0, 'explain': e} for q, o, e in checks]}
    return {'room': room, 'enc': enc}


C = []
# ------------------------------------------------------------------ chapter 1: crystals
C.append(card('ss-read-01', 1, 'lattice-gate', '1.1–1.2', '3–10', 'crystal lattices and symmetry',
  ['What exactly is the difference between a lattice and a crystal structure?', 'When is a set of translations called primitive, and is the choice unique?', 'Why are only 1-, 2-, 3-, 4- and 6-fold rotations compatible with a lattice?'],
  'Look for: lattice + basis, primitive vs conventional cell, the Wigner-Seitz construction, point symmetries, the 14 Bravais lattices and the 7 crystal systems.',
  [(r'A 2D square lattice has a basis of two different atoms. Is the crystal structure still square, and what is the primitive cell?', r'The Bravais lattice is still square; the primitive cell is the square cell containing one atom of each kind. The basis can lower the point symmetry of the crystal (fewer mirror lines, for example) but not the translation symmetry.'),
   (r'Why is a 5-fold rotation impossible in a periodic lattice?', r'A rotation maps lattice vectors onto lattice vectors, so in a lattice basis its matrix has integer entries and integer trace $1+2\cos\varphi$ (3D). Only $\cos\varphi\in\{1,\frac12,0,-\frac12,-1\}$ work: $\varphi=360^\circ,60^\circ,90^\circ,120^\circ,180^\circ$.'),
   (r'Why is the Wigner-Seitz cell a &#8220;reliable&#8221; primitive cell?', r'It is unique and has the full point symmetry of the lattice: all points closer to one lattice point than to any other. Its volume equals that of any primitive cell (one lattice point per cell).')],
  [(r'How many Bravais lattices exist in 3D?', [r'14', r'7', r'32', r'230'], r'14 lattices in 7 crystal systems; 32 point groups and 230 space groups count the basis symmetry too.'),
   (r'A crystal structure is fully defined by', [r'the lattice (three primitive translations) and the basis', r'the lattice alone', r'the basis alone', r'the point group'], r'Script summary 1.4.')]))
C.append(card('ss-read-02', 2, 'lattice-gate', '1.3–1.4', '11–14', 'reciprocal lattice, Miller indices, Brillouin zones',
  ['Why do we need a second, &#8220;reciprocal&#8221; lattice at all?', 'What do Miller indices measure, and why are they integers?', 'What is the Brillouin zone a Wigner-Seitz cell of?'],
  'Look for: the definition $\\mathbf a_i\\cdot\\mathbf b_j=2\\pi\\delta_{ij}$, the reciprocal cell volume $(2\\pi)^3/V$, the simple scalar product (1.15), planes and their normals, the first Brillouin zone.',
  [(r'Show that $e^{i\mathbf G\cdot\mathbf R}=1$ for every lattice vector $\mathbf R$ and reciprocal vector $\mathbf G$.', r'With $\mathbf R=\sum n_i\mathbf a_i$, $\mathbf G=\sum m_j\mathbf b_j$: $\mathbf G\cdot\mathbf R=2\pi\sum n_im_i$, an integer multiple of $2\pi$. This is why the $\mathbf G$ label the Fourier components of anything lattice-periodic.'),
   (r'How is the spacing $d_{hkl}$ of the planes $(hkl)$ related to the reciprocal lattice?', r'$\mathbf G_{hkl}$ is normal to the planes and $d_{hkl}=2\pi/|\mathbf G_{hkl}|$. For a cubic lattice $d=a/\sqrt{h^2+k^2+l^2}$.'),
   (r'What is the reciprocal lattice of FCC with cube side $a$?', r'BCC with cube side $4\pi/a$ (and vice versa). So the first Brillouin zone of FCC is a truncated octahedron.')],
  [(r'The volume of the reciprocal unit cell is', [r'$(2\pi)^3/V$', r'$V$', r'$1/V$', r'$2\pi/V$'], r'Script summary 1.4.'),
   (r'Miller indices of a plane are', [r'reciprocal-lattice coordinates of its normal', r'its intercepts with the axes', r'the coordinates of a point in the plane', r'always positive'], r'Reciprocals of the intercepts, cleared of fractions: they give $\mathbf G_{hkl}$.')]))
C.append(card('ss-read-03', 2, 'lattice-gate', '1.5', '15–23', 'diffraction',
  ['What does a diffraction experiment actually measure: positions or Fourier components?', 'Why must the wavelength be comparable to the lattice spacing?', 'Which radiation sees which part of the atom?'],
  'Look for: the scattering amplitude as a Fourier transform of the scattering density, the Laue condition $\\mathbf K=\\mathbf G$, Bragg&#8217;s law, the structure factor and systematic absences (1.5.3), direct and Laue geometry, X-rays vs neutrons vs electrons.',
  [(r'Derive Bragg&#8217;s law from the Laue condition.', r'Elastic: $|\mathbf k^\prime|=|\mathbf k|=2\pi/\lambda$, so $|\mathbf K|=2k\sin\theta$. With $\mathbf K=\mathbf G_{hkl}$ and $|\mathbf G_{hkl}|=2\pi n/d$: $2d\sin\theta=n\lambda$.'),
   (r'For BCC described as a simple cubic lattice with a two-atom basis, which reflections vanish?', r'$F\propto1+e^{i\pi(h+k+l)}$: zero when $h+k+l$ is odd. So $(100)$ is absent, $(110)$ and $(200)$ are seen.'),
   (r'Why are neutrons better than X-rays to locate hydrogen?', r'X-rays scatter from the electron density, so the intensity grows with $Z^2$ and hydrogen is almost invisible. Neutrons scatter from the nuclei with a scattering length that does not grow with $Z$.')],
  [(r'Bragg peaks occur when the wave-vector transfer $\mathbf K$', [r'equals a reciprocal-lattice vector', r'is perpendicular to $\mathbf k$', r'is zero', r'equals $\mathbf k$'], r'Laue condition, script summary 1.5.7.'),
   (r'Electron beams are used mostly for', [r'surfaces (they do not penetrate deep)', r'light elements in the bulk', r'magnetic structure', r'phonons only'], r'Script summary 1.5.7.')], minutes=40))
C.append(card('ss-read-04', 3, 'bonding-grotto', '1.6.1–1.6.3', '24–29', 'van der Waals, Lennard-Jones, ionic crystals',
  ['Two neutral spherical atoms attract each other. Where can that force come from?', 'Why must there be a repulsion at short distance, and what produces it?', 'What sets the cohesive energy of an ionic crystal?'],
  'Look for: the fluctuating-dipole picture ($\\propto r^{-6}$), the Lennard-Jones potential and its equilibrium distance, Pauli repulsion, the Madelung constant.',
  [(r'Why does the van der Waals attraction fall off as $r^{-6}$?', r'A fluctuating dipole $p_1$ gives a field $\propto p_1/r^3$ at the other atom, which induces $p_2=\alpha E\propto p_1/r^3$; the energy $-p_2E\propto-p_1^2/r^6$ does not average to zero.'),
   (r'Find the equilibrium distance of $U=4\varepsilon[(\sigma/r)^{12}-(\sigma/r)^6]$.', r'$dU/dr=0$: $r_0=2^{1/6}\sigma\approx1.12\sigma$, with depth $U(r_0)=-\varepsilon$.'),
   (r'What is the Madelung constant, and why does it depend only on the geometry?', r'The lattice sum $\alpha=\sum_j\pm r_0/r_j$ over all other ions with alternating signs: the Coulomb energy per ion pair is $-\alpha e^2/(4\pi\varepsilon_0r_0)$. Only the arrangement enters (NaCl: $\alpha\approx1.748$).')],
  [(r'The short-range repulsion between atoms comes mainly from', [r'the Pauli principle (overlapping filled shells)', r'gravity', r'the van der Waals force', r'magnetic dipoles'], r'Filled shells cannot overlap without promoting electrons to higher states.'),
   (r'Noble-gas crystals are held together by', [r'van der Waals forces', r'covalent bonds', r'metallic bonding', r'hydrogen bonds'], r'Script summary 1.6.7.')]))
C.append(card('ss-read-05', 3, 'bonding-grotto', '1.6.4–1.6.7', '29–37', 'covalent, hydrogen and metallic bonds',
  ['Why does sharing two electrons between two nuclei lower the energy?', 'Why is diamond tetrahedral?', 'In what sense is a metal a &#8220;collective covalent bond&#8221;?'],
  'Look for: bonding and antibonding molecular orbitals, the H$_2$ picture, sp$^3$ hybrids and the diamond structure, mixed ionic/covalent bonds, hydrogen bonds, the metallic bond and the summary 1.6.7.',
  [(r'Sketch the bonding and antibonding combination of two s orbitals. Which one has more charge between the nuclei?', r'Bonding $\psi_A+\psi_B$: charge piles up between the nuclei, attracted by both (energy lowered). Antibonding $\psi_A-\psi_B$: a node between them (energy raised). Two electrons with opposite spins fill the bonding orbital.'),
   (r'Why do covalent bonds have directions while metallic bonds do not?', r'Covalent bonds use specific orbitals (sp$^3$ hybrids point to the corners of a tetrahedron). In a metal the valence electrons are delocalised over all atoms (bands), so the bonding is non-directional and close packing is favoured.'),
   (r'Order van der Waals, hydrogen, ionic/covalent bonds by strength.', r'van der Waals (meV to 0.1 eV) < hydrogen bond (~0.1 eV) < ionic and covalent (a few eV per bond).')],
  [(r'The covalent bond is of', [r'purely quantum-mechanical origin', r'magnetic origin', r'gravitational origin', r'classical electrostatic origin only'], r'Script summary 1.6.7.'),
   (r'Graphite sheets hold together by', [r'van der Waals forces', r'covalent bonds', r'ionic bonds', r'metallic bonds'], r'Script summary 1.6.7.')]))
# ------------------------------------------------------------------ chapter 2: lattice dynamics
C.append(card('ss-read-06', 4, 'phonon-halls', '2.1', '38–40', 'Dulong-Petit and Einstein',
  ['Why does a classical solid have $C=3Nk_B$?', 'What did Einstein assume, and where does his model fail?'],
  'Look for: equipartition for 3N oscillators, Einstein&#8217;s single frequency $\\omega_E$, the exponential freeze-out at low $T$.',
  [(r'Derive Dulong-Petit.', r'$N$ atoms = $3N$ one-dimensional oscillators, each with two quadratic terms: $\langle E\rangle=3N\cdot2\cdot\frac12k_BT$, so $C_V=3Nk_B$.'),
   (r'Why does the Einstein model give $C\propto e^{-\hbar\omega_E/k_BT}$ at low $T$, and why is that wrong?', r'All modes share one gap $\hbar\omega_E$; at $k_BT\ll\hbar\omega_E$ excitations are exponentially rare. Real solids have acoustic modes with arbitrarily low frequency, which gives $T^3$.')],
  [(r'Dulong-Petit predicts per mole', [r'$3R\approx25$ J/(mol K)', r'$\frac32R$', r'$R$', r'zero'], r'$3N_Ak_B=3R$.'),
   (r'The Einstein model fails at', [r'low temperatures', r'high temperatures', r'all temperatures', r'no temperature'], r'Exponential instead of $T^3$.')], minutes=15))
C.append(card('ss-read-07', 4, 'phonon-halls', '2.2', '41–49', 'normal modes and the diatomic chain',
  ['Why can the vibrations of $10^{23}$ coupled atoms be split into independent modes?', 'Why is the wave vector restricted to the first Brillouin zone?', 'How many branches does a crystal with $p$ atoms per cell have?'],
  'Look for: harmonic expansion of the potential, the equation of motion with plane-wave ansatz, the role of the Brillouin zone (2.2.4), the diatomic chain (2.2.5), the counting of allowed $q$ and the summary 2.2.6.',
  [(r'Monatomic chain: derive $\omega(q)$.', r'$M\ddot u_n=C(u_{n+1}+u_{n-1}-2u_n)$, $u_n\propto e^{i(qna-\omega t)}$: $\omega=2\sqrt{C/M}\,|\sin(qa/2)|$. Linear at small $q$ (sound velocity $a\sqrt{C/M}$), flat at the zone boundary (group velocity zero).'),
   (r'Why does $q$ and $q+2\pi/a$ describe the same vibration?', r'The displacements exist only at the atoms $x=na$: $e^{i(q+2\pi/a)na}=e^{iqna}$. All physically different modes lie in the first zone.'),
   (r'Diatomic chain: frequencies at $q=0$ and at the zone boundary?', r'Acoustic: $0$ and $\sqrt{2C/M}$ (heavy atoms move). Optical: $\sqrt{2C(1/M+1/m)}$ at $q=0$ (neighbours against each other) and $\sqrt{2C/m}$ at the boundary (light atoms move). Gap between $\sqrt{2C/M}$ and $\sqrt{2C/m}$.'),
   (r'How many allowed $q$ in the first zone for a sample of $N$ cells?', r'Exactly $N$ (periodic boundary conditions), each occupying $(2\pi)^3/V$: total branches $\times N$ = $3pN$ modes = number of degrees of freedom.')],
  [(r'A crystal with 2 atoms per primitive cell has', [r'3 acoustic and 3 optical branches', r'6 acoustic branches', r'2 branches', r'3 branches'], r'$3p$ branches, always exactly 3 acoustic.'),
   (r'The sound velocity is', [r'the slope $d\omega/dq$ of the acoustic branches at $q\to0$', r'$\omega/q$ at the zone boundary', r'the optical frequency', r'$\sqrt{M/C}$'], r'Script summary 2.2.6.')], minutes=40))
C.append(card('ss-read-08', 5, 'phonon-halls', '2.3', '50–58', 'phonons and inelastic scattering',
  ['What is a phonon: a particle, or a bookkeeping device for a mode&#8217;s energy level?', 'What is conserved when a neutron creates a phonon?', 'Why do phonons have a finite lifetime?'],
  'Look for: the quantised oscillator per mode, phonon number, quasi-momentum $\\hbar\\mathbf q$ conserved up to $\\hbar\\mathbf G$, energy-loss and energy-gain scattering, anharmonic decay, the summary 2.3.5.',
  [(r'Write the conservation laws for a neutron that creates one phonon.', r'$E-E^\prime=\hbar\omega(\mathbf q)$ and $\mathbf k-\mathbf k^\prime=\mathbf q+\mathbf G$. Scanning energy transfer at fixed $\mathbf K$ gives a peak at $\hbar\omega(\mathbf q)$.'),
   (r'Why is $\hbar\mathbf q$ called quasi-momentum and not momentum?', r'It is only defined modulo $\hbar\mathbf G$: the lattice can absorb any $\hbar\mathbf G$ (umklapp). A phonon does not move the centre of mass of the crystal.'),
   (r'What does the width of a phonon peak tell you?', r'The inverse lifetime: anharmonic terms let a phonon decay into two or more phonons (script summary 2.3.5).')],
  [(r'The ground state of a crystal in the phonon language is', [r'the phonon vacuum (zero-point motion remains)', r'one phonon per mode', r'all atoms at rest classically', r'undefined'], r'Script summary 2.3.5.'),
   (r'Phonon dispersion curves are measured with', [r'inelastic neutron (or X-ray) scattering', r'elastic X-ray diffraction', r'the Hall effect', r'ARPES'], r'Energy and momentum transfer together.')]))
C.append(card('ss-read-09', 5, 'phonon-halls', '2.4', '59–65', 'phonon gas, Debye model, specific heat',
  ['Why does the number of phonons depend only on $\\hbar\\omega$ and $T$?', 'What is the Debye cutoff for, and is it physical?', 'Where does $T^3$ come from?'],
  'Look for: Bose-Einstein occupation (2.81), the density of states $\\nu(\\varepsilon)\\propto\\varepsilon^2/v^3$, the Debye cutoff $\\omega_D$ fixed by $3N$ modes, $C_V\\propto(T/T_D)^3$ (2.82) and Dulong-Petit at $T\\gg T_D$.',
  [(r'Why is $\nu(\varepsilon)\propto\varepsilon^2$ for acoustic phonons?', r'States fill $q$-space uniformly with density $V/(2\pi)^3$; with $\varepsilon=\hbar vq$ the number below $\varepsilon$ is $\propto q^3\propto\varepsilon^3$, so $\nu\propto\varepsilon^2/v^3$ (per branch).'),
   (r'Give the scaling argument for $C_V\propto T^3$.', r'Only modes with $\hbar\omega\lesssim k_BT$ are excited, i.e. $q\lesssim k_BT/\hbar v$: their number $\propto T^3$, each with energy $\sim k_BT$, so $E\propto T^4$ and $C\propto T^3$.'),
   (r'Which has the higher $T_D$, diamond or lead, and why?', r'Diamond (~2200 K vs ~100 K): light atoms and stiff bonds give high sound velocity and high $\omega_D$.')],
  [(r'Phonons obey', [r'Bose-Einstein statistics with zero chemical potential', r'Fermi-Dirac statistics', r'Boltzmann statistics only', r'no statistics'], r'Their number is not conserved.'),
   (r'At $T\ll T_D$ the lattice specific heat goes as', [r'$T^3$', r'$T$', r'$e^{-T_D/T}$', r'constant'], r'(2.82).')]))
# ------------------------------------------------------------------ chapter 3: metals
C.append(card('ss-read-10', 6, 'fermi-sea', '3.1.1–3.1.3', '66–72', 'free electrons and the Fermi-Dirac distribution',
  ['Why do the allowed $\\mathbf k$ form a grid, and how fine is it?', 'What fixes the Fermi energy?', 'Why is $\\epsilon_F$ of a metal so large compared to $k_BT$?'],
  'Look for: the electron in a box with periodic boundary conditions, $(2\\pi)^3/V$ per $\\mathbf k$ (3.34), two spin states, the density of states $\\nu(\\varepsilon)$, the Fermi function (3.35) and the Fermi sphere.',
  [(r'Derive $k_F=(3\pi^2n)^{1/3}$.', r'$2\cdot\frac{V}{(2\pi)^3}\cdot\frac43\pi k_F^3=N$ (factor 2 for spin), so $k_F^3=3\pi^2N/V$.'),
   (r'Derive $\nu(\varepsilon)$ for free electrons in 3D.', r'$N(\varepsilon)/V=\frac{k^3}{3\pi^2}$ with $k=\sqrt{2m\varepsilon}/\hbar$: $\nu=\frac{d}{d\varepsilon}\frac{(2m\varepsilon)^{3/2}}{3\pi^2\hbar^3}=\frac{m^{3/2}\sqrt{2\varepsilon}}{\pi^2\hbar^3}$. At $\epsilon_F$: $\nu(\epsilon_F)=\frac{3n}{2\epsilon_F}$.'),
   (r'Silver: $n=5.9\times10^{28}\ {\rm m^{-3}}$. Estimate $\epsilon_F$ and $T_F$.', r'$k_F=1.2$ Å$^{-1}$, $\epsilon_F=5.5$ eV, $T_F=6.4\times10^4$ K (test exam HS26 problem 3).')],
  [(r'Each allowed $\mathbf k$ occupies a $k$-space volume of', [r'$(2\pi)^3/V$', r'$V/(2\pi)^3$', r'$2\pi/L$', r'$\pi^3/V$'], r'(3.34).'),
   (r'The Fermi function depends on', [r'the energy of the state only', r'the wave vector only', r'the spin only', r'the volume'], r'Script summary 3.1.6.')], minutes=30))
C.append(card('ss-read-11', 6, 'fermi-sea', '3.1.4–3.1.6', '73–76', 'electronic specific heat and electron-electron scattering',
  ['Why do only a few electrons take part in thermal properties?', 'Why does electron-electron scattering die out at low $T$?'],
  'Look for: the thin shell $\\pm k_BT$ around $\\epsilon_F$, $C_V=\\frac{\\pi^2}3\\nu(\\epsilon_F)k_B^2T$ (Sommerfeld coefficient), the Pauli argument for $\\tau_{ee}^{-1}\\propto T^2$, the summary 3.1.6.',
  [(r'Give the estimate that leads to $C_V\propto T$.', r'Excited electrons: $\sim\nu(\epsilon_F)k_BT$ per volume, each gaining $\sim k_BT$: $E\sim\nu(\epsilon_F)(k_BT)^2$, so $C\sim\nu(\epsilon_F)k_B^2T$. The exact prefactor is $\pi^2/3$.'),
   (r'How do you separate electron and phonon contributions in a measurement?', r'$C=\gamma T+\beta T^3$: plot $C/T$ against $T^2$. Intercept $\gamma=\frac{\pi^2}3\nu(\epsilon_F)k_B^2$, slope $\beta$ from the phonons.'),
   (r'Why is the rate of electron-electron scattering $\propto T^2$?', r'Both the electron and its partner must start within $\sim k_BT$ of $\epsilon_F$ and end in empty states there: two factors of $k_BT/\epsilon_F$.')],
  [(r'The electronic specific heat of a metal is a direct measure of', [r'$\nu(\epsilon_F)$', r'$\epsilon_F$ alone', r'the number of atoms', r'$T_D$'], r'Script summary 3.1.6.'),
   (r'At low $T$, which dominates the specific heat of a metal?', [r'the electrons ($\propto T$)', r'the phonons ($\propto T^3$)', r'both equally', r'neither'], r'$T$ beats $T^3$ as $T\to0$.')], minutes=20))
C.append(card('ss-read-12', 7, 'fermi-sea', '3.2.1–3.2.2', '77–81', 'Bloch theorem and nearly free electrons',
  ['When does an electron &#8220;feel&#8221; the periodic potential? Compare its wavelength to the lattice spacing.', 'What is periodic in a Bloch function, and what is not?', 'Why do gaps open exactly at the zone boundaries?'],
  'Look for: $U(\\mathbf r+\\mathbf R)=U(\\mathbf r)$ (3.36), Bloch&#8217;s theorem, crystal momentum, the reduced zone scheme, the gap $2|U_{\\mathbf G}|$ from mixing $\\mathbf k$ and $\\mathbf k-\\mathbf G$.',
  [(r'State Bloch&#8217;s theorem in two equivalent forms.', r'$\psi_{\mathbf k}(\mathbf r)=e^{i\mathbf k\cdot\mathbf r}u_{\mathbf k}(\mathbf r)$ with $u_{\mathbf k}$ lattice periodic; equivalently $\psi_{\mathbf k}(\mathbf r+\mathbf R)=e^{i\mathbf k\cdot\mathbf R}\psi_{\mathbf k}(\mathbf r)$.'),
   (r'Explain the gap at $k=\pi/a$ with standing waves.', r'The two degenerate plane waves $e^{\pm i\pi x/a}$ mix into $\cos(\pi x/a)$ (charge on the ions, lower energy for an attractive potential) and $\sin(\pi x/a)$ (charge between the ions, higher). Splitting $2|U_G|$ with $U_G$ the Fourier component of the potential.'),
   (r'Why is the second gap usually smaller than the first?', r'It is set by the next Fourier component $U_{2G}$, normally smaller (a pure sine potential has none, so no second gap in first order).')],
  [(r'In the nearly free electron model the gap at the zone boundary is', [r'$2|U_{\mathbf G}|$', r'$|U_{\mathbf G}|/2$', r'$\epsilon_F$', r'$\hbar^2G^2/2m$'], r'Degenerate perturbation theory between $\mathbf k$ and $\mathbf k-\mathbf G$.'),
   (r'The crystal momentum $\hbar\mathbf k$ of a Bloch state is defined', [r'up to a reciprocal-lattice vector', r'exactly, like a momentum', r'only at $k=0$', r'only in 1D'], r'$\mathbf k$ and $\mathbf k+\mathbf G$ label the same state.')], minutes=30))
C.append(card('ss-read-13', 7, 'fermi-sea', '3.2.3–3.2.4', '82–87', 'tight binding; metals, insulators, semiconductors',
  ['Start from isolated atoms: how does a level become a band when atoms approach?', 'What sets the bandwidth?', 'How do you tell from the electron count whether a crystal is a metal?'],
  'Look for: Bloch sums of atomic orbitals, $\\varepsilon(\\mathbf k)=\\varepsilon_0-\\beta-\\gamma\\sum\\cos(\\mathbf k\\cdot\\boldsymbol\\delta)$-type dispersions, bandwidth vs overlap, filling bands with 2 electrons per cell per band.',
  [(r'1D chain, one orbital per atom, hopping $t$: dispersion and bandwidth?', r'$\varepsilon(k)=\varepsilon_0-2t\cos(ka)$, bandwidth $4t$ (in 3D simple cubic $12t$). More overlap, wider band.'),
   (r'Why are higher atomic levels broadened into wider bands?', r'Their orbitals are more extended, so the overlap with neighbours (and $t$) is larger. Core levels stay nearly flat.'),
   (r'Monovalent atoms, one per cell: metal or insulator? Divalent?', r'Each band holds 2 electrons per cell (spin). One electron per cell fills half a band: metal. Two electrons per cell could fill a band exactly (insulator), unless bands overlap, as in the alkaline-earth metals.')],
  [(r'In tight binding, the bandwidth is proportional to', [r'the overlap (hopping) integral', r'the atomic mass', r'the lattice constant squared', r'the temperature'], r'Test exam HS26 1(d).'),
   (r'A crystal with an odd number of electrons per primitive cell is (in band theory)', [r'a metal', r'an insulator', r'a semiconductor', r'a superconductor'], r'A band can only be completely filled with an even number.')], minutes=30))
C.append(card('ss-read-14', 7, 'fermi-sea', '3.3–3.4', '88–92', 'quasiparticles and ARPES',
  ['Why describe excitations from the Fermi surface instead of from the bottom of the band?', 'What does a photoemission experiment measure?'],
  'Look for: quasielectrons and quasiholes, energies measured from $\\epsilon_F$ (always non-negative), zero chemical potential, ARPES with energy and momentum conservation, the summary 3.4.1.',
  [(r'An electron is removed from a state below $\epsilon_F$. What is the quasiparticle and its energy?', r'A quasihole with the same $\mathbf k$ and spin and energy $\epsilon_F-\varepsilon(\mathbf k)\ge0$.'),
   (r'How does ARPES get $\varepsilon(\mathbf k)$?', r'A photon $\hbar\omega$ ejects an electron; energy conservation gives the binding energy from the kinetic energy (minus work function), and the in-plane momentum is conserved, so the emission angle gives $\mathbf k_\parallel$. It maps occupied states (quasiholes) and the Fermi surface.')],
  [(r'Quasiparticle energies are', [r'always non-negative, zero on the Fermi surface', r'negative below $\epsilon_F$', r'equal to $\varepsilon(\mathbf k)$', r'always $\epsilon_F$'], r'Script summary 3.4.1.'),
   (r'ARPES measures', [r'occupied band dispersions and Fermi surfaces', r'phonon dispersions', r'only the work function', r'magnetic order'], r'Script summary 3.4.1.')], minutes=20))
# ------------------------------------------------------------------ chapter 4: transport
C.append(card('ss-read-15', 9, 'drift-corridor', '4.1', '93–94', 'Drude model and Hall effect',
  ['Which assumptions of Drude are wrong, and why does $\\sigma=ne^2\\tau/m$ still work?', 'What does the sign of the Hall constant tell you?'],
  'Look for: the equation of motion with friction $m\\mathbf v/\\tau$, $\\sigma=ne^2\\tau/m$, the Hall geometry and $R_H=-1/(ne)$.',
  [(r'Derive the Hall constant in the Drude model.', r'Steady state, current along $x$: the transverse force $e(\mathbf E+\mathbf v\times\mathbf B)$ must vanish along $y$, so $E_y=v_xB$ with $j_x=-nev_x$ (electrons): $R_H=E_y/(j_xB)=-1/(ne)$.'),
   (r'Why do some metals (Al, Be) have a positive $R_H$?', r'The carriers are effectively holes: the band is nearly full and the states near $\epsilon_F$ have negative effective mass (section 4.2).')],
  [(r'The Drude conductivity is', [r'$ne^2\tau/m$', r'$ne\tau/m$', r'$m/(ne^2\tau)$', r'$ne^2/m$'], r'Steady state of the friction model.'),
   (r'For free electrons $R_H$ is', [r'$-1/(ne)$', r'$+1/(ne)$', r'zero', r'$ne$'], r'Negative carriers.')], minutes=15))
C.append(card('ss-read-16', 9, 'drift-corridor', '4.2.1–4.2.4', '95–101', 'band electrons: wave packets, effective mass, conductivity',
  ['How fast does a Bloch electron move if its state is a stationary wave?', 'Can an effective mass be negative? What does that mean?', 'Why do only states at the Fermi surface carry the current?'],
  'Look for: group velocity $\\mathbf v=\\frac1\\hbar\\nabla_{\\mathbf k}\\varepsilon$, $\\hbar\\dot{\\mathbf k}=\\mathbf F$, the effective mass tensor, the shifted Fermi sea in a field, conductivity $\\propto\\nu(\\epsilon_F)$.',
  [(r'Derive $1/m^*$ from $\varepsilon(k)$ in 1D.', r'$v=\frac1\hbar\frac{d\varepsilon}{dk}$, $\dot v=\frac1\hbar\frac{d^2\varepsilon}{dk^2}\dot k=\frac1{\hbar^2}\frac{d^2\varepsilon}{dk^2}F$: $\frac1{m^*}=\frac1{\hbar^2}\frac{d^2\varepsilon}{dk^2}$. Near the top of a band the curvature is negative: $m^*<0$.'),
   (r'Why does a completely filled band carry no current?', r'For every $\mathbf k$ there is $-\mathbf k$ with opposite velocity; a field shifts all $\mathbf k$ but the set stays the same (states leaving the zone re-enter at the other side). Net current zero.'),
   (r'Steady state in a field: how far is the Fermi sea shifted?', r'$\delta k=eE\tau/\hbar$, tiny compared to $k_F$. Only states near the Fermi surface change occupation, so $\sigma\propto\nu(\epsilon_F)$; for free electrons this reproduces $ne^2\tau/m$.')],
  [(r'The velocity of a Bloch electron is', [r'$\frac1\hbar\nabla_{\mathbf k}\varepsilon(\mathbf k)$', r'$\hbar\mathbf k/m$ always', r'zero', r'$\varepsilon/\hbar k$'], r'Group velocity of the wave packet.'),
   (r'Near the top of a band the effective mass is', [r'negative', r'positive and small', r'infinite always', r'equal to $m_e$'], r'Negative curvature; these states behave as holes.')], minutes=30))
C.append(card('ss-read-17', 10, 'drift-corridor', '4.2.5', '102–105', 'relaxation and the resistivity $\\rho(T)$',
  ['Which scatterers exist in a metal, and which depend on temperature?', 'Why is the low-temperature law $T^5$ and not $T^3$?'],
  'Look for: impurities (constant), phonons (linear at high $T$), the random-walk argument (4.28) that gives $\\rho\\propto T^5$ for $T\\ll T_D$ (4.29), electron-electron scattering $\\propto T^2$ (4.33), Matthiessen&#8217;s rule.',
  [(r'Why is $\rho\propto T$ at high temperature?', r'The number of phonons per mode is $\approx k_BT/\hbar\omega$: the scattering rate grows linearly with $T$.'),
   (r'Reproduce the $T^5$ argument.', r'Phonon number $\propto T^3$ gives $\tau^{-1}\propto T^3$, but each phonon changes the electron momentum only by $\delta p\propto T$. Reversing $\hbar k_F$ needs a random walk of $n\propto(\hbar k_F/\delta p)^2\propto T^{-2}$ steps, so $\rho\propto T^3\cdot T^2=T^5$.'),
   (r'Draw $\rho(T)$ of a real metal from 0 to room temperature.', r'Residual value $\rho_0$ (impurities) at $T\to0$, then $T^5$, crossing over to linear around $0.2T_D$ (script, after (4.29)). Electron-electron $T^2$ only visible around 1 K in very clean samples.')],
  [(r'The residual resistivity at $T\to0$ comes from', [r'impurities and defects', r'phonons', r'electron-electron scattering', r'the Fermi energy'], r'Temperature independent.'),
   (r'For $T\ll T_D$ the phonon resistivity goes as', [r'$T^5$', r'$T^3$', r'$T$', r'$T^2$'], r'(4.29).')],
  slips=[r'The summary 4.3.1 says the phonon relaxation rate goes &#8220;as $T^2$ for $T\gtrsim\Theta_D$&#8221;. The text (around (4.29)) and the standard result say <b>linear in $T$</b> at high temperature; $T^2$ is the electron-electron law. Use $\rho\propto T$.']))
C.append(card('ss-read-18', 10, 'drift-corridor', '4.3–4.4', '106–112', 'thermal conductivity and screening',
  ['Why do good electrical conductors also conduct heat well?', 'How far does the field of a charge reach inside a metal?'],
  'Look for: the distribution broadened differently on the two sides, $\\kappa\\propto T\\sigma$ (Wiedemann-Franz), the Lorenz number, Thomas-Fermi screening with $r_0^2=\\varepsilon_0/(e^2\\nu(\\epsilon_F))$.',
  [(r'State Wiedemann-Franz and its condition.', r'$\kappa/(\sigma T)=L=\frac{\pi^2}3(k_B/e)^2\approx2.44\times10^{-8}\ {\rm W\Omega/K^2}$, valid when the same (elastic) scattering limits both, i.e. at low $T$ (impurities) and high $T$.'),
   (r'Estimate the Thomas-Fermi length of a metal.', r'With $\nu(\epsilon_F)=3n/(2\epsilon_F)$, $n\sim10^{29}\ {\rm m^{-3}}$, $\epsilon_F\sim5$ eV: $r_0\sim0.5$ Å. Fields of impurity charges die within about one atomic distance.')],
  [(r'The Thomas-Fermi screening length depends on', [r'$\nu(\epsilon_F)$', r'the lattice constant only', r'$T_D$', r'the sample size'], r'Script summary 4.4.1.'),
   (r'Wiedemann-Franz says $\kappa/\sigma$ is proportional to', [r'$T$', r'$T^2$', r'$1/T$', r'a constant'], r'Script summary 4.3.1.')], minutes=30))
# ------------------------------------------------------------------ chapter 5: semiconductors
C.append(card('ss-read-19', 11, 'semiconductor-forge', '5.1', '113–118', 'what is a semiconductor; effective mass; cyclotron resonance',
  ['What separates a semiconductor from an insulator: physics, or just the size of the gap?', 'How can you measure an effective mass?'],
  'Look for: filled valence band and empty conduction band, holes, parabolic band edges with $m^*$, Si, Ge, GaAs (direct vs indirect gaps), cyclotron resonance $\\omega_c=eB/m^*$.',
  [(r'Direct vs indirect gap: why does it matter for LEDs?', r'In a direct gap (GaAs) the band extrema are at the same $\mathbf k$, so a photon (almost no momentum) can create or annihilate an electron-hole pair. In an indirect gap (Si, Ge) a phonon must supply the momentum: weak light emission.'),
   (r'Cyclotron resonance at $B=1$ T absorbs at 24 GHz. What is $m^*/m_e$?', r'$\omega_c=eB/m^*$: $m^*=eB/(2\pi f)=1.6\times10^{-19}/(1.5\times10^{11})\approx1.06\times10^{-30}$ kg, $m^*\approx1.2m_e$.')],
  [(r'Silicon has a gap of about', [r'1.1 eV, indirect', r'1.1 eV, direct', r'0.1 eV', r'5 eV'], r'Ge 0.67 eV indirect, GaAs 1.4 eV direct.'),
   (r'Cyclotron resonance measures', [r'the effective mass', r'the band gap', r'the Fermi energy', r'the mobility only'], r'$\omega_c=eB/m^*$.')], minutes=25))
C.append(card('ss-read-20', 11, 'semiconductor-forge', '5.2', '119–122', 'intrinsic carriers and mobility',
  ['Why can carriers in a semiconductor be treated with Boltzmann statistics?', 'What is the law of mass action, and why does it not depend on $E_F$?'],
  'Look for: $n=N_c e^{-(E_c-E_F)/k_BT}$, $p=N_ve^{-(E_F-E_v)/k_BT}$, $np=N_cN_ve^{-E_g/k_BT}$, $n_i\\propto T^{3/2}e^{-E_g/2k_BT}$, $E_F$ near mid-gap, mobility limited by phonons and defects, the summary 5.2.3.',
  [(r'Derive $n_i$ and the position of $E_F$ in an intrinsic semiconductor.', r'$n=p$ and $np=N_cN_ve^{-E_g/k_BT}$: $n_i=\sqrt{N_cN_v}e^{-E_g/2k_BT}$. Equating $n$ and $p$: $E_F=\frac{E_c+E_v}2+\frac34k_BT\ln(m_h^*/m_e^*)$.'),
   (r'Why does $\sigma(T)$ of an intrinsic semiconductor rise so steeply?', r'$\sigma=e(n\mu_e+p\mu_h)$: the exponential $n_i(T)$ wins over the power law of the mobility.')],
  [(r'The factor 2 in $e^{-E_g/2k_BT}$ appears because', [r'$n=p$ and $np\propto e^{-E_g/k_BT}$', r'of spin', r'of two valleys', r'it is a convention'], r'Law of mass action.'),
   (r'The product $np$ depends on', [r'temperature (and material) only', r'the doping', r'the applied voltage', r'$E_F$'], r'Script summary 5.2.3.')], minutes=20))
C.append(card('ss-read-21', 12, 'semiconductor-forge', '5.3', '123–127', 'doped semiconductors',
  ['Why is the fifth electron of P in Si so weakly bound?', 'Which three regimes does $n(T)$ of a doped sample pass through?'],
  'Look for: donors and acceptors, the hydrogen model with $m^*$ and $\\varepsilon_r$, freeze-out, saturation (exhaustion), intrinsic regime, $E_F(T)$.',
  [(r'Estimate the donor binding energy in Si ($m^*\approx0.26m_e$, $\varepsilon_r\approx11.7$).', r'$E_d=13.6\,{\rm eV}\cdot\frac{m^*/m_e}{\varepsilon_r^2}\approx26$ meV (measured: 45 meV for P). Bohr radius $a_B\varepsilon_r m_e/m^*\approx2.4$ nm, many lattice constants.'),
   (r'Sketch $\ln n$ vs $1/T$ for n-type Si and give the slopes.', r'Low $T$: freeze-out, slope $-E_d/2k_B$ (at low compensation). Middle: saturation $n\approx N_D$ (room temperature). High $T$: intrinsic, slope $-E_g/2k_B$.')],
  [(r'At room temperature, a typically doped Si sample is in the', [r'saturation regime ($n\approx N_D$)', r'freeze-out regime', r'intrinsic regime', r'metallic regime'], r'$E_d\ll$ room temperature scale but $n_i\ll N_D$.'),
   (r'Higher donor doping moves $E_F$', [r'towards the conduction band', r'to mid-gap', r'into the valence band', r'nowhere'], r'$n=N_D=N_ce^{-(E_c-E_F)/k_BT}$.')],
  slips=[r'$E_d$ is used both for the donor <i>level</i> and for the donor <i>binding energy</i> $E_c-E_d$ in parts of this section: check which one a formula needs before using it.']))
C.append(card('ss-read-22', 12, 'semiconductor-forge', '5.4', '128–135', 'the p-n junction',
  ['Why does a potential step build up when p and n regions touch?', 'What sets the width of the depletion zone?', 'Why does the junction rectify?'],
  'Look for: equal Fermi levels in equilibrium, contact potential $eU_D$, Poisson equation with fixed donor and acceptor charges, depletion width, the diode law, devices (5.4.5).',
  [(r'Derive the depletion width for an abrupt junction.', r'Poisson with charge $eN_D$ on $[0,x_n]$ and $-eN_A$ on $[-x_p,0]$, neutrality $N_Ax_p=N_Dx_n$: $w=x_n+x_p=\sqrt{\frac{2\varepsilon\varepsilon_0U_D}e\left(\frac1{N_A}+\frac1{N_D}\right)}$ (with $U_D\to U_D-U$ under forward bias $U$).'),
   (r'Why is the reverse current small and almost voltage independent?', r'It is carried by thermally generated minority carriers that drift down the barrier; their number $\propto n_i^2\propto e^{-E_g/k_BT}$ does not depend on the barrier height. Forward bias lowers the barrier for majority carriers: $I=I_s(e^{eU/k_BT}-1)$.')],
  [(r'More doping on both sides makes the depletion zone', [r'narrower', r'wider', r'unchanged', r'vanish'], r'$w\propto\sqrt{1/N_A+1/N_D}$.'),
   (r'In equilibrium across the junction', [r'the Fermi level is constant', r'the conduction band edge is constant', r'there is no field', r'the carrier density is constant'], r'No net current.')],
  slips=[r'In (5.51)-(5.53) the exponent is printed as $e^{U/k_BT}$; it must be $e^{eU/k_BT}$ (energy over energy). Check the units every time you copy the diode law.'], minutes=35))
# ------------------------------------------------------------------ chapter 6: magnetism
C.append(card('ss-read-23', 13, 'magnet-vault', '6.1–6.2.4', '136–140', 'Pauli paramagnetism and Landau diamagnetism',
  ['Each free spin has $\\chi\\propto1/T$. Why is a metal&#8217;s spin susceptibility temperature independent?', 'Why is there no magnetism in classical physics?'],
  'Look for: $\\mathbf M=\\chi\\mathbf H$ and the sign conventions, Zeeman-split bands (6.19), $\\chi_P=\\mu_0\\frac{(g\\mu_B)^2}4\\nu(\\epsilon_F)$ (6.18), Landau diamagnetism $=-\\frac13\\chi_P$.',
  [(r'Derive $\chi_P$ with split bands.', r'The field shifts spin-up and spin-down bands by $\mp\frac12g\mu_B\mu_0H$; equal Fermi levels move $\frac12\nu(\epsilon_F)\cdot\frac12g\mu_B\mu_0H$ electrons per volume from one spin to the other. $M=\frac12g\mu_B(n_\uparrow-n_\downarrow)=\frac{(g\mu_B)^2}4\mu_0\nu(\epsilon_F)H$.'),
   (r'Explain the temperature independence in one sentence.', r'Only a fraction $\sim k_BT/\epsilon_F$ of the electrons can flip, each with a Curie susceptibility $\propto1/T$: the two factors of $T$ cancel.')],
  [(r'Landau diamagnetism of free electrons is', [r'$-\frac13$ of the Pauli susceptibility', r'equal to it', r'$-3$ times it', r'zero'], r'Script summary 6.2.4.'),
   (r'$\chi_P$ is proportional to', [r'$\nu(\epsilon_F)$', r'$1/T$', r'$T$', r'$n^2$'], r'(6.18).')], minutes=25))
C.append(card('ss-read-24', 13, 'magnet-vault', '6.2.5–6.2.6', '140–145', 'metallic ferromagnetism (Stoner)',
  ['Spins do not interact magnetically strongly enough. Where does ferromagnetism come from?', 'Why only Fe, Co, Ni among the elements?'],
  'Look for: the exchange interaction from Coulomb repulsion plus Pauli (6.33), the mean-field enhancement of $\\chi_P$ (6.34), the Stoner criterion $UV_0\\nu(\\epsilon_F)>2$ (6.35), spontaneously split bands.',
  [(r'Why does Coulomb repulsion favour parallel spins?', r'Electrons with equal spin are kept apart by the Pauli principle, so they feel less Coulomb repulsion; the effective on-site interaction $U\,n_{j\uparrow}n_{j\downarrow}$ acts only between opposite spins.'),
   (r'Read (6.34): what happens as $UV_0\nu(\epsilon_F)\to2$?', r'The denominator of the enhanced susceptibility goes to zero: $\chi$ diverges, and beyond it a spontaneous magnetisation appears. Large $U$ and large $\nu(\epsilon_F)$ (narrow d bands of Fe, Co, Ni) help; Pd is just below.')],
  [(r'The Stoner criterion in the script reads', [r'$UV_0\nu(\epsilon_F)>2$', r'$U<0$', r'$\nu(\epsilon_F)=0$', r'$T>T_C$'], r'(6.35).'),
   (r'The magnetism of Fe is caused by', [r'exchange (Coulomb + Pauli)', r'dipole-dipole forces', r'orbital currents', r'gravity'], r'Script summary 6.2.6.')], minutes=25))
C.append(card('ss-read-25', 14, 'magnet-vault', '6.3.1–6.3.3', '146–152', 'localised moments: exchange and Curie law',
  ['How do two localised spins on neighbouring ions &#8220;know&#8221; about each other?', 'Why does an insulator of free moments give $\\chi=C/T$?'],
  'Look for: Hund&#8217;s rules for $S$, the Heisenberg Hamiltonian $-J\\mathbf S_1\\cdot\\mathbf S_2$ (6.63), the sign of $J$, the Curie law (6.62).',
  [(r'Two spins $\frac12$ with $H=-J\mathbf S_1\cdot\mathbf S_2$: energies of triplet and singlet?', r'$\mathbf S_1\cdot\mathbf S_2=\frac12[S(S+1)-\frac32]$: triplet $+\frac14$, singlet $-\frac34$ (in $\hbar^2$). $J>0$ favours the triplet (ferromagnetic), $J<0$ the singlet.'),
   (r'Why is the Curie susceptibility $\propto1/T$?', r'Each moment aligns against thermal disorder: $\langle\mu_z\rangle\approx\mu^2B/(3k_BT)$ for $\mu B\ll k_BT$. Unlike in a metal, every localised spin contributes.')],
  [(r'Exchange constants fall off with distance', [r'exponentially (overlap of orbitals)', r'as $1/r^3$ like dipoles', r'not at all', r'as $1/r$'], r'Script summary 6.3.3.'),
   (r'In the script&#8217;s convention $H=-J\mathbf S_1\cdot\mathbf S_2$, ferromagnetism needs', [r'$J>0$', r'$J<0$', r'$J=0$', r'any sign'], r'(6.63).')],
  slips=[r'Sign convention: the script writes $H=-J\mathbf S_1\cdot\mathbf S_2$ (so $J>0$ is ferromagnetic). Some old exams use $H=+J\mathbf S_1\cdot\mathbf S_2$, where $J>0$ is antiferromagnetic. Read the sign in the problem first.']))
C.append(card('ss-read-26', 14, 'magnet-vault', '6.3.4–6.3.6', '153–160', 'ferro- and antiferromagnets: Curie-Weiss',
  ['What is the Weiss field, and why does it make $\\chi$ diverge?', 'Why does an antiferromagnet need a bipartite lattice?', 'Why does $\\chi$ of an antiferromagnet depend on the field direction?'],
  'Look for: the mean (Weiss) field $\\propto M$, Curie-Weiss $\\chi=C/(T-T_W)$, $T_C\\approx T_W$, the Néel phase at $T_N\\sim|T_W|$, $\\chi_\\parallel$ and $\\chi_\\perp$ below $T_N$.',
  [(r'Derive Curie-Weiss from the Weiss field.', r'$M=\frac CT(H+\lambda M)$ gives $M=\frac{C}{T-C\lambda}H$: $\chi=\frac C{T-T_W}$ with $T_W=C\lambda$. Positive $T_W$ (ferro): divergence at $T_C\approx T_W$.'),
   (r'Below $T_N$: why is $\chi_\perp$ constant while $\chi_\parallel\to0$?', r'A transverse field cants both sublattices by the same small angle at a cost set by $J$, independent of $T$. A parallel field must flip spins against the ordered, nearly saturated sublattices, which becomes impossible as $T\to0$.')],
  [(r'For an antiferromagnet ($T_W<0$) the susceptibility above $T_N$', [r'follows Curie-Weiss and never diverges', r'diverges at $|T_W|$', r'is zero', r'is negative'], r'Script summary 6.3.6.'),
   (r'Below $T_C$ in zero field, the magnetisation of a ferromagnet', [r'grows on cooling towards saturation', r'is zero', r'decreases on cooling', r'oscillates'], r'Script summary 6.3.6.')], minutes=30))

from more_checks import MORE  # 4 more checks per card
for it in C:
    for q, o, e in MORE.get(it['enc']['id'], []): it['enc']['check'].append({'q': q, 'options': o, 'correct': 0, 'explain': e})
assert all(len(it['enc']['check']) >= 6 for it in C), [it['enc']['id'] for it in C if len(it['enc']['check']) < 6]
weeks = {}
for it in C: weeks.setdefault(str(it['enc']['week']), []).append(it['enc']['id'])
with open(OUT, 'w') as f: json.dump({'about': 'Guided reading of the solid-state script; built by notes/solid-state/build/reading/build.py', 'items': C, 'weeks': weeks}, f, ensure_ascii=False, indent=1)
print(len(C), 'reading cards ->', os.path.relpath(OUT), {k: len(v) for k, v in weeks.items()})
