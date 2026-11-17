"""More check questions for the solid-state reading cards (4 per card, on top of the 2 in build.py).
Format: MORE[card id] = [(question, [correct option first, ...distractors], explanation)]; the game shuffles the options."""

MORE = {
 'ss-read-01': [
  (r'The Wigner-Seitz cell of a lattice is', [r'the set of points closer to one lattice point than to any other', r'the conventional cubic cell', r'any parallelogram spanned by two lattice vectors', r'the first Brillouin zone of the lattice itself'], r'It is a primitive cell with the full point symmetry.'),
  (r'The conventional cubic cell of an FCC lattice contains how many lattice points?', [r'4', r'1', r'2', r'8'], r'$8\cdot\frac18+6\cdot\frac12=4$.'),
  (r'Which rotation is NOT compatible with a periodic lattice?', [r'5-fold', r'2-fold', r'4-fold', r'6-fold'], r'Only 1, 2, 3, 4, 6.'),
  (r'A basis of two different atoms on a square lattice can change', [r'the point symmetry, not the Bravais lattice', r'the Bravais lattice', r'the translation vectors', r'nothing'], r'Lattice and basis are independent ingredients.')],
 'ss-read-02': [
  (r'Reciprocal vectors satisfy', [r'$\mathbf a_i\cdot\mathbf b_j=2\pi\delta_{ij}$', r'$\mathbf a_i\cdot\mathbf b_j=\delta_{ij}$', r'$\mathbf a_i\times\mathbf b_j=0$', r'$\mathbf b_j=\mathbf a_j/|\mathbf a_j|^2$ always'], r'Definition in 1.3.1.'),
  (r'The spacing of the $(hkl)$ planes is', [r'$2\pi/|\mathbf G_{hkl}|$', r'$|\mathbf G_{hkl}|$', r'$a(h+k+l)$', r'$2\pi|\mathbf G_{hkl}|$'], r'Script 1.3.2.'),
  (r'The reciprocal lattice of BCC is', [r'FCC', r'BCC', r'simple cubic', r'hexagonal'], r'And vice versa.'),
  (r'In a cubic crystal, $d_{hkl}=$', [r'$a/\sqrt{h^2+k^2+l^2}$', r'$a(h^2+k^2+l^2)$', r'$a/(h+k+l)$', r'$\sqrt{h^2+k^2+l^2}/a$'], r'From $|\mathbf G|=\frac{2\pi}a\sqrt{h^2+k^2+l^2}$.')],
 'ss-read-03': [
  (r'Bragg&#8217;s law', [r'$2d\sin\theta=n\lambda$', r'$d\sin\theta=n\lambda$', r'$2d\cos\theta=n\lambda$', r'$d=n\lambda\sin\theta$'], r'$\theta$ is measured from the planes.'),
  (r'Bragg reflection needs a wavelength', [r'comparable to or shorter than $2d$', r'much longer than $d$', r'equal to the crystal size', r'in the visible'], r'$\sin\theta\le1$.'),
  (r'The structure factor depends on', [r'the basis (atom positions and form factors in the cell)', r'only the lattice constant', r'only the wavelength', r'the sample size'], r'Script 1.5.3.'),
  (r'In BCC (cubic cell with 2-atom basis) the $(100)$ reflection is', [r'absent', r'the strongest', r'present with half intensity', r'only seen with neutrons'], r'$h+k+l$ odd gives $F=0$.')],
 'ss-read-04': [
  (r'The van der Waals attraction falls off as', [r'$r^{-6}$', r'$r^{-1}$', r'$r^{-12}$', r'$e^{-r}$'], r'Induced dipole-dipole.'),
  (r'The minimum of the Lennard-Jones potential lies at', [r'$2^{1/6}\sigma$', r'$\sigma$', r'$2\sigma$', r'$0$'], r'$dU/dr=0$.'),
  (r'The Madelung constant of NaCl is about', [r'1.75', r'1', r'0.5', r'12'], r'Lattice sum of $\pm1/r_j$.'),
  (r'Ionic crystals are typically', [r'insulators (filled shells, large gap)', r'metals', r'superconductors', r'semiconductors with tiny gaps'], r'Electrons are transferred and localised.')],
 'ss-read-05': [
  (r'In the bonding orbital the electron density', [r'increases between the nuclei', r'vanishes between the nuclei', r'is the same as for free atoms', r'is localised far outside'], r'Script 1.6.4.'),
  (r'The diamond structure has coordination number', [r'4 (tetrahedral)', r'6', r'8', r'12'], r'sp$^3$ hybrids.'),
  (r'Typical strength of a hydrogen bond', [r'~0.1 eV', r'~10 eV', r'~1 meV', r'~1 keV'], r'Between van der Waals and covalent.'),
  (r'Metals favour close-packed structures because', [r'metallic bonding is non-directional', r'covalent bonds point along cube edges', r'ions repel', r'of hydrogen bonds'], r'Delocalised valence electrons.')],
 'ss-read-06': [
  (r'Dulong-Petit is the high-temperature limit because', [r'all modes are classically excited ($k_BT\gg\hbar\omega$)', r'phonons freeze out', r'electrons dominate', r'the crystal melts'], r'Equipartition.'),
  (r'In the Einstein model all atoms vibrate', [r'independently with one frequency $\omega_E$', r'as sound waves', r'with a linear dispersion', r'not at all'], r'Script 2.1.2.'),
  (r'Einstein&#8217;s $C_V$ for $k_BT\gg\hbar\omega_E$ tends to', [r'$3Nk_B$', r'0', r'$\frac32Nk_B$', r'infinity'], r'Dulong-Petit.'),
  (r'Diamond has a low $C_V$ at room temperature because', [r'its vibration frequencies are high ($\hbar\omega\gtrsim k_BT$)', r'it has few atoms', r'it is transparent', r'it has no phonons'], r'Historic puzzle explained by Einstein.')],
 'ss-read-07': [
  (r'Group velocity of the monatomic chain at the zone boundary', [r'0', r'the sound velocity', r'infinite', r'$\omega/q$'], r'$d\omega/dq=0$ at $q=\pi/a$.'),
  (r'Monatomic chain: $\omega(q)=$', [r'$2\sqrt{C/M}|\sin(qa/2)|$', r'$\sqrt{C/M}\,qa$ for all $q$', r'$2\sqrt{C/M}\cos(qa)$', r'constant'], r'Script 2.2.3.'),
  (r'In a diatomic chain the gap between branches grows with', [r'the mass ratio $M/m$', r'the lattice constant', r'temperature', r'nothing; there is no gap'], r'Between $\sqrt{2C/M}$ and $\sqrt{2C/m}$.'),
  (r'Number of allowed $q$ in the first zone for $N$ cells', [r'$N$', r'$3N$', r'infinite', r'$N^3$'], r'Script summary 2.2.6.')],
 'ss-read-08': [
  (r'A phonon carries quasi-momentum', [r'$\hbar\mathbf q$, defined up to $\hbar\mathbf G$', r'$M\mathbf v$', r'zero', r'$\hbar\omega/c$'], r'Script summary 2.3.5.'),
  (r'In energy-loss neutron scattering the neutron', [r'creates a phonon', r'absorbs a phonon', r'is unchanged', r'creates a photon'], r'Script 2.3.'),
  (r'The width of a phonon peak in inelastic scattering is', [r'the inverse phonon lifetime', r'the instrument only', r'the phonon energy', r'always zero'], r'Anharmonic decay.'),
  (r'Phonon decay into two phonons requires', [r'anharmonic terms in the potential', r'a perfectly harmonic crystal', r'impurities only', r'an electric field'], r'Harmonic modes are independent.')],
 'ss-read-09': [
  (r'The Debye frequency is fixed by requiring', [r'a total of $3N$ modes', r'$\omega_D=v_s/a$ exactly', r'the melting point', r'the Fermi energy'], r'Script summary 2.4.4.'),
  (r'Typical Debye temperatures are', [r'a few hundred K', r'a few K', r'$10^5$ K', r'1 mK'], r'Script summary 2.4.4.'),
  (r'The phonon occupation $n(\varepsilon)=$', [r'$1/(e^{\varepsilon/k_BT}-1)$', r'$1/(e^{\varepsilon/k_BT}+1)$', r'$e^{-\varepsilon/k_BT}$', r'1'], r'(2.81).'),
  (r'The Debye model is exact at', [r'low $T$ (only acoustic phonons near $q=0$ matter)', r'all temperatures', r'only $T\gg T_D$', r'no temperature'], r'Linear dispersion holds at small $q$.')],
 'ss-read-10': [
  (r'The number of electrons per volume in terms of $k_F$', [r'$n=k_F^3/3\pi^2$', r'$n=k_F^3/6\pi^2$', r'$n=k_F^2/\pi$', r'$n=k_F/2\pi$'], r'Factor 2 for spin included.'),
  (r'At $T=0$ the Fermi function is', [r'a step: 1 below $\epsilon_F$, 0 above', r'a Gaussian', r'1/2 everywhere', r'exponential'], r'Script 3.1.3.'),
  (r'Free electrons in 3D: $\nu(\varepsilon)\propto$', [r'$\sqrt\varepsilon$', r'$\varepsilon$', r'constant', r'$\varepsilon^2$'], r'In 2D constant, in 1D $\propto1/\sqrt\varepsilon$.'),
  (r'In metals $k_F$ is comparable to', [r'the reciprocal lattice spacing', r'$1/$sample size', r'the photon wave vector of light', r'zero'], r'Script summary 3.1.6.')],
 'ss-read-11': [
  (r'The Sommerfeld coefficient $\gamma$ in $C=\gamma T$ is proportional to', [r'$\nu(\epsilon_F)$', r'$T_D$', r'$\epsilon_F^2$', r'$1/\nu(\epsilon_F)$'], r'$\gamma=\frac{\pi^2}3\nu(\epsilon_F)k_B^2$.'),
  (r'Fraction of electrons thermally excited at room temperature in a metal', [r'about $k_BT/\epsilon_F\sim1\%$', r'about 50%', r'all of them', r'none'], r'Pauli blocking.'),
  (r'Plotting $C/T$ against $T^2$ gives', [r'intercept $\gamma$ (electrons), slope $\beta$ (phonons)', r'intercept $\beta$', r'a parabola', r'$T_D$ directly as intercept'], r'$C=\gamma T+\beta T^3$.'),
  (r'Electron-electron scattering rate at low $T$', [r'$\propto T^2$', r'$\propto T$', r'$\propto T^5$', r'constant'], r'Script summary 3.1.6.')],
 'ss-read-12': [
  (r'Which waves form at the zone boundary in the nearly free electron model?', [r'standing waves', r'running plane waves', r'evanescent waves only', r'spherical waves'], r'Bragg reflection of the electron.'),
  (r'With an attractive ionic potential, the lower state at the gap has its charge', [r'on the ions ($\cos$)', r'between the ions ($\sin$)', r'uniform', r'outside the crystal'], r'Script 3.2.2.'),
  (r'Bloch&#8217;s theorem: $\psi_{\mathbf k}(\mathbf r+\mathbf R)=$', [r'$e^{i\mathbf k\cdot\mathbf R}\psi_{\mathbf k}(\mathbf r)$', r'$\psi_{\mathbf k}(\mathbf r)$', r'$-\psi_{\mathbf k}(\mathbf r)$', r'$e^{i\mathbf G\cdot\mathbf R}\psi$'], r'Script 3.2.1.'),
  (r'Electrons at $\epsilon_F$ feel the lattice because', [r'their de Broglie wavelength is comparable to the lattice spacing', r'they are slow', r'they are heavy', r'they do not'], r'Script 3.2 introduction.')],
 'ss-read-13': [
  (r'1D tight binding with hopping $t$: bandwidth', [r'$4t$', r'$2t$', r'$t$', r'$12t$'], r'$\varepsilon_0-2t\cos ka$.'),
  (r'Core-level bands are', [r'very narrow (tiny overlap)', r'very wide', r'always half filled', r'metallic'], r'Localised orbitals.'),
  (r'Each band holds per primitive cell', [r'2 electrons', r'1 electron', r'$N$ electrons', r'8 electrons'], r'Spin degeneracy.'),
  (r'Divalent metals (Mg, Ca) conduct because', [r'bands overlap', r'they have one electron per cell', r'of impurities', r'they do not conduct'], r'Otherwise a full band would make them insulators.')],
 'ss-read-14': [
  (r'Quasiparticles obey Fermi statistics with chemical potential', [r'zero', r'$\epsilon_F$', r'$k_BT$', r'negative'], r'Script summary 3.4.1.'),
  (r'A quasihole has a wave vector', [r'inside the Fermi surface', r'outside the Fermi surface', r'only at $k=0$', r'on the zone boundary'], r'Script summary 3.4.1.'),
  (r'ARPES uses', [r'the photoelectric effect with angle and energy resolution', r'neutron scattering', r'X-ray diffraction', r'the Hall effect'], r'Script 3.4.'),
  (r'The ground state of the electron gas, in quasiparticle language, is', [r'the quasiparticle vacuum', r'one quasielectron per state', r'all holes', r'undefined'], r'Filled Fermi sea.')],
 'ss-read-15': [
  (r'In the Drude model $\tau$ is', [r'the mean time between collisions', r'the time to reach $\epsilon_F$', r'the sample transit time', r'$1/\epsilon_F$'], r'Friction term $m\mathbf v/\tau$.'),
  (r'A positive Hall constant indicates', [r'hole-like carriers', r'electrons', r'no carriers', r'superconductivity'], r'Section 4.2 explains it.'),
  (r'The Hall voltage is proportional to', [r'$IB/(nde)$', r'$IB\,n$', r'$I/B$', r'$n/B$'], r'$R_H=-1/ne$ with thickness $d$.'),
  (r'Drude&#8217;s classical gas fails for', [r'heat capacity and the mean free path ($\propto T$ predictions)', r'Ohm&#8217;s law', r'the form of $\sigma=ne^2\tau/m$', r'the Hall sign of Na'], r'Fermi statistics fixes it.')],
 'ss-read-16': [
  (r'In a field, $\hbar\dot{\mathbf k}=$', [r'$-e\mathbf E$ (electron)', r'$m\mathbf v$', r'0', r'$e\mathbf E/m$'], r'Script 4.2.3.'),
  (r'The effective mass is', [r'$\hbar^2/(d^2\varepsilon/dk^2)$', r'$d\varepsilon/dk$', r'always $m_e$', r'$\hbar k/v$ only for holes'], r'Script 4.2.2.'),
  (r'A completely filled band carries', [r'no current', r'the maximal current', r'half the current', r'a current $\propto n$'], r'$\pm\mathbf k$ cancel.'),
  (r'Conductivity of band electrons is proportional to', [r'$\nu(\epsilon_F)$ (states at the Fermi surface)', r'the number of core electrons', r'the band bottom energy', r'$1/\tau$'], r'Script summary 4.3.1.')],
 'ss-read-17': [
  (r'Matthiessen&#8217;s rule', [r'$\rho=\rho_{\rm imp}+\rho_{\rm ph}(T)$', r'$\rho=\rho_{\rm imp}\rho_{\rm ph}$', r'$\rho\propto T$ always', r'$\sigma=\sigma_1+\sigma_2$'], r'Rates add.'),
  (r'The crossover from $T^5$ to linear occurs around', [r'$0.2\,T_D$ (script)', r'$T_D/100$', r'$10\,T_D$', r'the melting point'], r'Text after (4.29).'),
  (r'Why do small-angle phonon collisions not reverse the current quickly?', [r'each changes $\mathbf k$ only a little: a random walk is needed', r'they are elastic', r'phonons have no momentum', r'they are forbidden'], r'(4.28).'),
  (r'Electron-electron resistivity $\propto T^2$ is visible', [r'only around 1 K in very clean samples', r'at room temperature', r'never', r'above $T_D$'], r'Script 4.2.5.')],
 'ss-read-18': [
  (r'The Lorenz number $L=\kappa/(\sigma T)$ is about', [r'$2.4\times10^{-8}$ W$\Omega$/K$^2$', r'$1$', r'$k_B/e$', r'$10^{-3}$ W/K'], r'$\frac{\pi^2}3(k_B/e)^2$.'),
  (r'In thermal transport the electron distribution is', [r'not shifted but broadened differently on the two sides', r'shifted by $eE\tau/\hbar$', r'unchanged', r'fully excited'], r'Script summary 4.3.1.'),
  (r'Thomas-Fermi screening length in metals is about', [r'0.5 Å', r'1 mm', r'100 nm', r'1 km'], r'Short: metals screen within an atom.'),
  (r'Wiedemann-Franz holds best when scattering is', [r'elastic', r'inelastic small-angle', r'absent', r'electron-electron'], r'Same $\tau$ for charge and heat.')],
 'ss-read-19': [
  (r'Holes behave like', [r'positive charges with positive effective mass', r'electrons with positive charge and negative energy always', r'neutral particles', r'photons'], r'Missing electrons near a band maximum.'),
  (r'GaAs is used for LEDs because its gap is', [r'direct', r'indirect', r'zero', r'very large'], r'Photons need no phonon.'),
  (r'The cyclotron frequency', [r'$eB/m^*$', r'$m^*/eB$', r'$eB m^*$', r'$\sqrt{eB/m^*}$'], r'Script 5.1.3.'),
  (r'Germanium&#8217;s gap is about', [r'0.67 eV', r'1.1 eV', r'3.4 eV', r'0.01 eV'], r'Indirect.')],
 'ss-read-20': [
  (r'Intrinsic carriers obey essentially', [r'Boltzmann statistics (low density)', r'degenerate Fermi statistics', r'Bose statistics', r'no statistics'], r'Script summary 5.2.3.'),
  (r'$N_c$ (effective density of states) depends on', [r'$m_e^*$ and $T$ ($\propto(m^*T)^{3/2}$)', r'$E_g$ only', r'the doping', r'nothing'], r'Band-edge density of states.'),
  (r'Mobility at high $T$ is limited by', [r'phonons', r'impurities', r'nothing', r'the gap'], r'Script summary 5.2.3.'),
  (r'In an intrinsic semiconductor $E_F$ lies', [r'near mid-gap', r'in the conduction band', r'at the valence band edge', r'above the vacuum level'], r'$n=p$.')],
 'ss-read-21': [
  (r'P in Si is a', [r'donor', r'acceptor', r'isoelectronic impurity', r'deep trap'], r'Valence 5.'),
  (r'B in Si is', [r'an acceptor', r'a donor', r'neutral', r'a metal'], r'Valence 3.'),
  (r'Donor binding energy in the hydrogen model scales as', [r'$m^*/\varepsilon_r^2$', r'$\varepsilon_r^2/m^*$', r'$m^*\varepsilon_r$', r'independent of $\varepsilon_r$'], r'Script 5.3.1.'),
  (r'In the intrinsic regime of a doped sample, $n$ is set by', [r'$n_i(T)$', r'$N_D$', r'$E_d$', r'nothing'], r'Then $n_i\gg N_D$.')],
 'ss-read-22': [
  (r'In equilibrium the diffusion current across the junction is', [r'balanced by the drift current', r'zero by itself', r'larger than drift', r'carried by photons'], r'No net current.'),
  (r'Forward bias', [r'lowers the barrier', r'raises the barrier', r'does nothing', r'reverses the doping'], r'Majority carriers can cross.'),
  (r'The depletion zone contains', [r'fixed ionised donors and acceptors, few free carriers', r'many free electrons', r'only holes', r'neutral atoms only'], r'Space charge.'),
  (r'The diode law', [r'$I=I_s(e^{eU/k_BT}-1)$', r'$I=U/R$', r'$I=I_se^{-eU/k_BT}$', r'$I\propto U^2$'], r'Note the $e$ in the exponent.')],
 'ss-read-23': [
  (r'Paramagnets have', [r'$\chi>0$', r'$\chi<0$', r'$\chi=0$', r'$\chi=-1$'], r'Moments align with the field.'),
  (r'In a field the bands of spin up and down shift by', [r'$\mp\frac12g\mu_B\mu_0H$', r'$g\mu_B$ each in the same direction', r'zero', r'$\epsilon_F$'], r'(6.19).'),
  (r'Only electrons within $\sim k_BT$ of $\epsilon_F$', [r'can flip their spin in the field', r'carry charge', r'exist', r'are paired'], r'Script summary 6.2.4.'),
  (r'Free-electron Landau diamagnetism comes from', [r'orbital motion in the field', r'spin', r'the nuclei', r'phonons'], r'$-\frac13\chi_P$.')],
 'ss-read-24': [
  (r'The effective on-site interaction in the script acts between electrons of', [r'opposite spin on the same site', r'equal spin', r'different atoms', r'nuclei'], r'$U n_{j\uparrow}n_{j\downarrow}$.'),
  (r'Near the Stoner instability the susceptibility', [r'is strongly enhanced', r'vanishes', r'becomes negative', r'is unchanged'], r'(6.34).'),
  (r'In a ferromagnetic metal the bands are', [r'spontaneously split by spin', r'unsplit', r'all filled', r'flat'], r'As if in a field.'),
  (r'A large $\nu(\epsilon_F)$ is found in', [r'narrow d bands (Fe, Co, Ni)', r'free-electron s bands', r'insulators', r'noble gases'], r'Stoner.')],
 'ss-read-25': [
  (r'In a magnetic insulator, every localised spin contributes to $\chi$ at', [r'all temperatures ($\chi\propto1/T$)', r'only near $\epsilon_F$', r'only at $T=0$', r'no temperature'], r'Script summary 6.3.3.'),
  (r'The size of the spin of a magnetic ion is set by', [r'Hund&#8217;s rules', r'the Fermi energy', r'the lattice constant', r'the Debye temperature'], r'Script 6.3 introduction.'),
  (r'Two spins $\frac12$, $H=-J\mathbf S_1\cdot\mathbf S_2$, $J<0$: ground state', [r'singlet', r'triplet', r'degenerate quartet', r'no ground state'], r'Antiferromagnetic.'),
  (r'The Heisenberg Hamiltonian originates from', [r'Coulomb repulsion plus Pauli exclusion', r'magnetic dipoles', r'gravity', r'spin-orbit only'], r'Script summary 6.3.3.')],
 'ss-read-26': [
  (r'Curie-Weiss law', [r'$\chi=C/(T-T_W)$', r'$\chi=C/T$', r'$\chi=CT$', r'$\chi=C(T-T_W)$'], r'Weiss field.'),
  (r'An antiferromagnet orders at', [r'$T_N\sim|T_W|$', r'$T_C=T_W>0$', r'never', r'$\epsilon_F/k_B$'], r'Néel temperature.'),
  (r'Above $T_C$ in zero field, the magnetisation of a ferromagnet is', [r'zero', r'saturated', r'negative', r'half saturated'], r'Script summary 6.3.6.'),
  (r'Antiferromagnetic order needs', [r'a bipartite lattice (for simple Néel order)', r'a triangular lattice', r'a metal', r'$J>0$'], r'Script summary 6.3.6.')],
}
