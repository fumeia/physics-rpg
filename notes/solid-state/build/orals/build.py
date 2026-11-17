"""Examiner's favourites: the concepts the oral examiners (Ensslin, Batlogg, Pescia; protocols HS04-HS15, FS05 in
materials/solid-state/old-exams, text in notes/extracted) asked again and again, turned into written multiple-choice
questions (all of the user's exams are written). Superconductivity is left out: it is not in Degen's 2026 script.
Answers are our own, standard textbook physics (Kittel / Ibach-Lüth level), numbers from Kittel's tables.
Writes game/content/solid-state/oral-favourites.json (one quiz per room). Run: python3 build.py"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '../../../../game/content/solid-state/oral-favourites.json')
SRC = 'materials/solid-state/old-exams (oral protocols HS04, HS05, HS06, HS10, HS11, HS13, HS14, HS15, FS05)'


def Q(q, opts, correct, explain, asked): return {'q': q, 'options': opts, 'correct': correct, 'explain': explain + f' <span class="src">(asked in: {asked})</span>'}
def quiz(id, room, title, qs):
    return {'room': room, 'enc': {'type': 'quiz', 'id': id, 'xp': 20, 'title': "Examiner's favourites: " + title,
            'source': {'file': SRC, 'where': 'questions the examiners asked repeatedly, rewritten as written multiple choice; answers our own'}, 'questions': qs}}


items = [
 quiz('ss-oral-lat', 'lattice-gate', 'diffraction and Bloch waves', [
  Q(r'Why do X-ray Bragg peaks of a crystal have different heights?', [r'Structure factor (basis), atomic form factor (falls with $|\mathbf G|$) and the Debye-Waller factor', r'Only because of the detector angle', r'All allowed peaks are equally high', r'Because of the photon energy only'], 0,
    r'$I\propto|F_{hkl}|^2$ with $F=\sum_jf_j(\mathbf G)e^{i\mathbf G\cdot\mathbf r_j}$; $f_j$ decreases with $|\mathbf G|$, and thermal vibrations multiply by $e^{-\langle u^2\rangle G^2/3}$.', 'HS14'),
  Q(r'How does the height of a Bragg peak change when the crystal is heated?', [r'It decreases (Debye-Waller factor), most for large $|\mathbf G|$; the width stays sharp', r'It increases', r'The peak broadens and disappears at once', r'It does not change'], 0,
    r'$e^{-\langle u^2\rangle G^2/3}$ with $\langle u^2\rangle\propto T$ at high $T$; the intensity goes into a diffuse background.', 'HS14'),
  Q(r'Thermal neutrons (energy $\approx25$ meV) are ideal to measure', [r'phonon dispersions by inelastic scattering: their energy is comparable to phonon energies', r'band gaps of insulators', r'only crystal structures, never excitations', r'the Fermi energy'], 0,
    r'Moderated to room temperature, $k_BT\approx25$ meV and $\lambda\approx1.8$ Å: both energy and wavelength match phonons.', 'HS05'),
  Q(r'Is a Bloch function $\psi_{\mathbf k}(\mathbf r)=e^{i\mathbf k\cdot\mathbf r}u_{\mathbf k}(\mathbf r)$ periodic in the lattice?', [r'No, only $u_{\mathbf k}$ and $|\psi_{\mathbf k}|^2$ are', r'Yes, always', r'Yes, but only for free electrons', r'Only in 1D'], 0,
    r'$\psi_{\mathbf k}(\mathbf r+\mathbf R)=e^{i\mathbf k\cdot\mathbf R}\psi_{\mathbf k}(\mathbf r)$: periodic only up to a phase (truly periodic at $\mathbf k=0$ or $\mathbf k$ a reciprocal lattice vector).', 'HS14'),
 ]),
 quiz('ss-oral-pho', 'phonon-halls', 'phonons and heat', [
  Q(r'Why is the phonon density of states $\propto\omega^2$ in the Debye model?', [r'Linear dispersion $\omega=v_sk$ in 3D: number of modes $\propto k^3\propto\omega^3$', r'Because of the optical branches', r'It is $\propto\omega$ in every model', r'From the Bose factor'], 0,
    r'$D(\omega)=\frac{3V\omega^2}{2\pi^2v_s^3}$ up to $\omega_D$, fixed by the total $3N$ modes. The real DOS has van Hove singularities and is not $\propto\omega^2$ everywhere; Einstein uses a $\delta$-peak.', 'HS04, HS10, HS14'),
  Q(r'Which has the higher Debye temperature, diamond or lead?', [r'Diamond ($\approx2200$ K vs $\approx100$ K): light atoms and stiff bonds', r'Lead: heavier atoms vibrate faster', r'They are equal', r'It depends only on the lattice type'], 0,
    r'$\omega\sim\sqrt{C/M}$: small $M$ and large spring constant give high frequencies (Kittel: C 2230 K, Pb 105 K).', 'HS14'),
  Q(r'Why do the Debye and Einstein models agree with Dulong-Petit at high $T$?', [r'Each atom is 3 classical oscillators: $6$ quadratic degrees of freedom $\times\frac12k_BT$ gives $3k_B$ per atom', r'Because all phonons freeze out', r'Because $\Theta_D=0$', r'They do not agree'], 0,
    r'Equipartition holds once $k_BT\gg\hbar\omega$ for all modes.', 'HS10, HS14'),
  Q(r'Why does the Einstein model fail at low temperatures?', [r'It predicts an exponential decrease of $C_V$; experiment shows $T^3$ from the low-energy acoustic phonons it ignores', r'It predicts $C_V\propto T^3$, experiment shows $T$', r'It violates Dulong-Petit', r'It does not fail'], 0,
    r'All modes at one frequency $\omega_E$ freeze out together; long-wavelength acoustic modes always remain excitable.', 'HS15'),
  Q(r'Why is diamond an excellent heat conductor although it is an insulator?', [r'Phonons carry the heat, and with its high $\Theta_D$ few umklapp phonons exist at room temperature: long phonon mean free path', r'Free electrons carry the heat', r'Because it is transparent', r'Because of its band gap'], 0,
    r'$\kappa=\frac13Cv\ell$; umklapp scattering $\propto e^{-\Theta_D/bT}$ is weak when $\Theta_D\gg T$.', 'HS06'),
  Q(r'In an optical phonon of a diatomic chain at $k=0$, neighbouring atoms', [r'move against each other (centre of mass of the cell at rest)', r'move in phase', r'do not move', r'move only if they are of the same mass'], 0,
    r'$\omega=\sqrt{2C(1/M_1+1/M_2)}$ at $k=0$; at the zone boundary only one sublattice moves in each branch.', 'HS10, test exam HS26'),
 ]),
 quiz('ss-oral-fer', 'fermi-sea', 'the electron gas', [
  Q(r'Order of magnitude: $E_F$ of a typical metal versus $k_BT$ at room temperature?', [r'a few eV vs $25$ meV', r'$25$ meV vs a few eV', r'both about 1 eV', r'keV vs eV'], 0, r'$T_F\sim10^4$-$10^5$ K $\gg300$ K: the electron gas is highly degenerate.', 'HS14'),
  Q(r'Why is the electronic heat capacity of a metal $\propto T$ and so small?', [r'Only electrons within $\sim k_BT$ of $E_F$ can be excited (Pauli): $C_e=\frac{\pi^2}2Nk_B\frac T{T_F}$', r'All electrons take $\frac32k_BT$', r'Because the electrons are bound', r'It is $\propto T^3$ like phonons'], 0,
    r'Fraction $T/T_F$ of the electrons, each with energy $\sim k_BT$. At low $T$ it beats the phonon $T^3$: plot $C/T$ vs $T^2$.', 'HS11, HS15'),
  Q(r'Why may electron-electron scattering usually be neglected in a metal?', [r'Pauli blocking: few final states are free (rate $\propto(T/T_F)^2$), and the Coulomb interaction is screened', r'Because electrons do not interact', r'Because the electrons are slow', r'Because of the band gap'], 0,
    r'Both partners must end in empty states near $E_F$: phase space $\propto(k_BT)^2$.', 'HS14'),
  Q(r'Is the 3D free-electron density of states mass dependent?', [r'Yes: $D(E)=\frac V{2\pi^2}\left(\frac{2m}{\hbar^2}\right)^{3/2}\sqrt E$', r'No', r'Only in 2D', r'Only at $E_F$'], 0,
    r'Heavier carriers mean a flatter $E(k)$ and more states per energy (in 2D it is mass dependent but energy independent).', 'HS14'),
 ]),
 quiz('ss-oral-dri', 'drift-corridor', 'conduction', [
  Q(r'An electric field is switched on, then off. How does the shifted Fermi sphere return to equilibrium?', [r'Through scattering on phonons and impurities with relaxation time $\tau$; only electrons near the Fermi surface scatter', r'It never returns', r'By electron-electron collisions only', r'By emitting photons'], 0,
    r'The displacement $\delta k=eE\tau/\hbar$ is tiny compared to $k_F$; scattering moves electrons from the front to the back of the sphere.', 'FS05, HS14, HS15'),
  Q(r'Why does the resistivity of a metal grow linearly with $T$ above $\Theta_D$?', [r'The number of phonons (scatterers) grows $\propto T$ ($n_B\approx k_BT/\hbar\omega$)', r'Because $n$ grows with $T$', r'Because $v_F\propto T$', r'Because of impurities'], 0,
    r'$\rho=m/(ne^2\tau)$ with $1/\tau\propto$ number of phonons; $n$ and $v_F$ are $T$-independent in a metal. Below $\Theta_D$: $\rho\propto T^5$ (fewer phonons $\propto T^3$, small-angle scattering $\propto T^2$), then the residual value from impurities.', 'HS13, HS15'),
  Q(r'Why does copper conduct much better than stainless steel?', [r'The alloy is disordered: strong scattering on the random atoms gives a large residual resistivity (Matthiessen)', r'Copper has more electrons per atom', r'Steel has a band gap', r'Copper is lighter'], 0, r'$\rho=\rho_{\rm ph}(T)+\rho_{\rm imp}$; in an alloy $\rho_{\rm imp}$ dominates even at room temperature.', 'HS06'),
  Q(r'Which difference between metal and semiconductor makes their $\rho(T)$ opposite?', [r'In the semiconductor $n(T)$ grows exponentially; in the metal $n$ is fixed and only $\tau$ falls with $T$', r'Only the metal has phonons', r'The semiconductor has no electrons', r'There is no difference'], 0, r'$\sigma=ne\mu$: for semiconductors the activated $n(T)$ wins over the mobility.', 'HS13'),
 ]),
 quiz('ss-oral-sem', 'semiconductor-forge', 'semiconductors and the pn junction', [
  Q(r'Why is there a factor 2 in $n_i\propto T^{3/2}e^{-E_g/2k_BT}$?', [r'$np\propto e^{-E_g/k_BT}$ and $n=p$, so $n=\sqrt{np}$: $E_F$ sits near mid-gap', r'Because of the two spin states', r'Because of two valleys', r'It is a typo, it should be $E_g/k_BT$'], 0, r'Law of mass action; each carrier only needs $E_g/2$ measured from $E_F$.', 'HS13, HS15'),
  Q(r'$\ln n$ vs $1/T$ of an n-doped semiconductor shows (from low to high $T$)', [r'freeze-out (slope $\sim E_d/2k_B$), saturation $n\approx N_D$, intrinsic (slope $E_g/2k_B$)', r'one straight line', r'intrinsic, then freeze-out', r'saturation only'], 0, r'At room temperature a typical doped Si is in saturation.', 'HS06, HS13'),
  Q(r'Why is the donor ionisation energy so small ($\sim10$-$50$ meV) compared to hydrogen ($13.6$ eV)?', [r'Hydrogen model with $m^*$ and screening $\varepsilon_r$: $E_d=13.6\,{\rm eV}\cdot\frac{m^*/m}{\varepsilon_r^2}$', r'Because the donor is a heavy atom', r'Because of the band gap', r'Because of thermal energy'], 0, r'Si: $\varepsilon_r\approx12$, so the orbit is large (many lattice constants) and weakly bound.', 'HS06, HS13'),
  Q(r'With higher doping $N_D$ the Fermi level of an n-type semiconductor (saturation regime)', [r'moves closer to the conduction band edge', r'moves to mid-gap', r'moves into the valence band', r'does not change'], 0, r'$n=N_D=N_{\rm eff}e^{-(E_C-E_F)/k_BT}$.', 'HS13, HS14'),
  Q(r'Higher doping on both sides of a pn junction makes the depletion zone', [r'narrower, $w\propto\sqrt{U_D(1/N_A+1/N_D)}$', r'wider', r'unchanged', r'disappear completely at any doping'], 0, r'More fixed charge per volume is needed to drop the same diffusion voltage.', 'HS04, HS13, HS14'),
  Q(r'How can the reverse (saturation) current of a diode be reduced?', [r'Use a larger-gap material (Si rather than Ge) or cool it: $I_s\propto n_i^2\propto e^{-E_g/k_BT}$', r'Use a smaller-gap material', r'Increase the reverse voltage', r'Heat the diode'], 0, r'$I=I_s(e^{eU/k_BT}-1)$; minority carriers are thermally generated.', 'HS05, HS13'),
  Q(r'Can the diffusion voltage $eU_D$ of a (non-degenerate) pn junction exceed the band gap?', [r'No: it is the difference of the two Fermi levels, both inside the gap', r'Yes, always', r'Only at $T=0$', r'Only for Ge'], 0, r'$eU_D=E_g-(E_C-E_F)_n-(E_F-E_V)_p<E_g$.', 'HS14'),
 ]),
 quiz('ss-oral-mag', 'magnet-vault', 'magnetism', [
  Q(r'What causes ferromagnetism in Fe?', [r'Exchange interaction (Pauli principle + Coulomb), not the magnetic dipole interaction', r'Dipole-dipole interaction of the moments', r'Gravity', r'Spin-orbit coupling alone'], 0, r'Dipolar energies are $\sim1$ K, far too weak for $T_C\approx1000$ K.', 'HS04, HS06'),
  Q(r'Why are Fe, Co, Ni ferromagnets but Pd and Pt not?', [r'Stoner: $I\,D(E_F)>1$; the narrow d bands give a high $D(E_F)$, and in Pd/Pt it is just too small', r'Pd and Pt have no d electrons', r'Fe has more electrons', r'Pd is a superconductor'], 0, r'Pd is a nearly-ferromagnetic, strongly enhanced Pauli paramagnet.', 'HS06'),
  Q(r'Pauli paramagnetism of conduction electrons is', [r'temperature independent, $\chi_P\propto\mu_B^2D(E_F)$', r'$\propto1/T$ (Curie)', r'negative', r'$\propto T$'], 0, r'Only electrons near $E_F$ can flip. Landau diamagnetism of free electrons is $-\frac13\chi_P$.', 'HS13, HS14'),
  Q(r'Is the magnetic moment of the electron parallel to its spin?', [r'No, antiparallel (negative charge): $\boldsymbol\mu=-g\mu_B\mathbf S/\hbar$', r'Yes', r'Perpendicular', r'It has no moment'], 0, r'Same for the orbital moment.', 'FS05, HS13'),
  Q(r'Larmor diamagnetism of closed shells is largest for', [r'big atoms (large $Z\langle r^2\rangle$): go down the periodic table', r'helium', r'hydrogen', r'it is the same for all atoms'], 0, r'$\chi\propto-Z\langle r^2\rangle$.', 'HS14'),
  Q(r'Why does $M$ not vanish at $B=0$ on a hysteresis loop?', [r'Domain walls are pinned at defects; the domain configuration depends on history (remanence)', r'Because of Pauli paramagnetism', r'Because the exchange is switched off', r'It does vanish'], 0, r'A reverse coercive field is needed to move the walls.', 'HS04'),
 ]),
]

with open(OUT, 'w') as f: json.dump({'about': "Examiner's favourites from the oral protocols; built by notes/solid-state/build/orals/build.py", 'items': items}, f, ensure_ascii=False, indent=1)
print(sum(len(i['enc']['questions']) for i in items), 'questions in', len(items), 'quizzes ->', os.path.relpath(OUT))
