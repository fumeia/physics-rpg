"""More check questions for the astro reading cards (4 per card), Refregier MC style. MORE[id] = [(q, [correct first, ...], why)]."""

MORE = {
 'astro-read-01a': [
  (r'1 pc is about', [r'$3.1\times10^{16}$ m (3.26 ly)', r'$1.5\times10^{11}$ m', r'$9.5\times10^{15}$ m', r'$10^{20}$ m'], r'206265 AU.'),
  (r'A star with parallax $0.1^{\prime\prime}$ is at', [r'10 pc', r'0.1 pc', r'100 pc', r'1 pc'], r'$d=1/p$.'),
  (r'Absolute magnitude is the apparent magnitude at', [r'10 pc', r'1 pc', r'1 AU', r'1 kpc'], r'Definition.'),
  (r'Declination is measured from', [r'the celestial equator', r'the horizon', r'the ecliptic', r'the galactic plane'], r'Equatorial coordinates.')],
 'astro-read-01b': [
  (r'Ground-based optical resolution is usually limited by', [r'atmospheric seeing (~1&#8243;)', r'the diffraction limit always', r'the detector', r'the Moon'], r'Unless adaptive optics.'),
  (r'The atmosphere is transparent in', [r'optical and radio windows', r'X-rays', r'gamma rays', r'far UV'], r'Space needed for the rest.'),
  (r'Doubling the telescope diameter improves the diffraction limit by', [r'a factor 2', r'a factor 4', r'nothing', r'a factor $\sqrt2$'], r'$\theta\propto1/D$.'),
  (r'Doubling the diameter increases the collected light by', [r'4', r'2', r'8', r'1'], r'Area $\propto D^2$.')],
 'astro-read-02a': [
  (r'In empty space along a ray, $I_\nu$', [r'is constant', r'falls as $1/r^2$', r'grows', r'oscillates'], r'Surface brightness conservation.'),
  (r'Optical depth $d\tau_\nu=$', [r'$\alpha_\nu ds$', r'$j_\nu ds$', r'$I_\nu ds$', r'$ds/\alpha_\nu$'], r'Choudhuri 2.2.3.'),
  (r'An optically thick source at constant $S_\nu$ shows $I_\nu\to$', [r'$S_\nu$', r'0', r'$I_\nu(0)$', r'infinity'], r'Formal solution.'),
  (r'The flux is obtained from $I_\nu$ by integrating', [r'$I_\nu\cos\theta\,d\Omega$', r'$I_\nu\,d\Omega$', r'$I_\nu\sin\theta$', r'$I_\nu\,dV$'], r'First moment.')],
 'astro-read-02b': [
  (r'Wien&#8217;s law', [r'$\lambda_{\max}T\approx2.9\times10^{-3}$ m K', r'$\lambda_{\max}=T$', r'$\lambda_{\max}T^4=$ const', r'$\nu_{\max}\propto1/T$'], r'Choudhuri 2.3.'),
  (r'Stefan-Boltzmann constant $\sigma\approx$', [r'$5.67\times10^{-8}$ W m$^{-2}$K$^{-4}$', r'$1.38\times10^{-23}$ J/K', r'$6.6\times10^{-34}$ J s', r'$3\times10^8$ m/s'], r'$L=4\pi R^2\sigma T^4$.'),
  (r'The CMB temperature today', [r'2.7 K', r'27 K', r'0.27 K', r'3000 K'], r'Every exam MC.'),
  (r'A star twice as hot (same radius) is', [r'16 times as luminous', r'2 times', r'4 times', r'8 times'], r'$T^4$.')],
 'astro-read-03a': [
  (r'The effective temperature is defined by', [r'$F=\sigma T_{\rm eff}^4$ at the surface', r'the core temperature', r'the colour', r'the line widths'], r'Blackbody with the same flux.'),
  (r'Limb darkening shows that the temperature', [r'decreases outward', r'increases outward', r'is constant', r'is negative'], r'Eddington-Barbier.'),
  (r'In LTE the source function equals', [r'$B_\nu(T)$', r'$I_\nu$', r'0', r'$j_\nu$'], r'Kirchhoff.'),
  (r'Emission lines form when', [r'the source function increases outward (or optically thin hot gas)', r'temperature decreases outward', r'there is no gas', r'always in stars'], r'E.g. chromospheres, nebulae.')],
 'astro-read-03b': [
  (r'The Rosseland mean opacity weights', [r'$1/\kappa_\nu$ by $\partial B_\nu/\partial T$', r'$\kappa_\nu$ by $B_\nu$', r'nothing', r'only line opacity'], r'Harmonic mean, transparent windows dominate.'),
  (r'The H$^-$ ion dominates the opacity in', [r'the solar photosphere', r'the solar core', r'white dwarfs', r'the corona'], r'Cool atmospheres.'),
  (r'Saha equation describes', [r'ionisation equilibrium', r'hydrostatic equilibrium', r'nuclear rates', r'opacity'], r'Used in spectral classification.'),
  (r'Thomson cross-section $\sigma_T\approx$', [r'$6.65\times10^{-29}$ m$^2$', r'$10^{-20}$ m$^2$', r'$10^{-35}$ m$^2$', r'$6.65\times10^{-25}$ m$^2$'], r'($6.65\times10^{-25}$ cm$^2$).')],
 'astro-read-04a': [
  (r'For a star, the virial theorem gives', [r'$2K+E_G=0$', r'$K=E_G$', r'$K+E_G=0$', r'$K=0$'], r'Choudhuri 3.2.2.'),
  (r'Total energy of a star in equilibrium is', [r'negative ($E=-K$)', r'positive', r'zero', r'$2K$'], r'Bound.'),
  (r'The Kelvin-Helmholtz time of the Sun is about', [r'$3\times10^7$ yr', r'$10^{10}$ yr', r'$10^3$ yr', r'1 yr'], r'$GM^2/(RL)$.'),
  (r'Mass continuity', [r'$dm/dr=4\pi r^2\rho$', r'$dm/dr=\rho$', r'$dm/dr=4\pi r\rho$', r'$dm/dr=0$'], r'Shell mass.')],
 'astro-read-04b': [
  (r'Upper main sequence: luminosity limited by', [r'the Eddington limit', r'the Chandrasekhar limit', r'the Jeans mass', r'nothing'], r'Choudhuri 3.6.1.'),
  (r'Lower end of the main sequence ($\approx0.08M_\odot$) set by', [r'hydrogen ignition (degeneracy below)', r'the Eddington limit', r'radiation pressure', r'rotation'], r'Brown dwarfs below.'),
  (r'Spectral sequence by decreasing temperature', [r'O B A F G K M', r'M K G F A B O', r'A B F G K M O', r'G K M O B A F'], r'Sun is G2.'),
  (r'$L_{\rm Edd}$ scales with mass as', [r'$\propto M$', r'$\propto M^3$', r'$\propto M^{-1}$', r'independent'], r'$4\pi GMc/\kappa$.')],
 'astro-read-05a': [
  (r'The pp chain converts per He nucleus about', [r'26.7 MeV', r'1 MeV', r'938 MeV', r'13.6 eV'], r'0.7% of $4m_p$.'),
  (r'The binding energy per nucleon peaks near', [r'iron (A~56)', r'helium', r'uranium', r'hydrogen'], r'Fusion beyond Fe costs energy.'),
  (r'Gamow energy grows with', [r'the product of the charges squared and the reduced mass', r'temperature', r'density', r'nothing'], r'$E_G\propto(Z_1Z_2)^2\mu$.'),
  (r'Helioseismology probes', [r'the solar interior via surface oscillations', r'the corona', r'sunspots only', r'neutrinos'], r'p-modes.')],
 'astro-read-05b': [
  (r'Helium burning proceeds by', [r'the triple-alpha process', r'the pp chain', r'CNO', r'neutron capture'], r'$3\,{}^4\mathrm{He}\to{}^{12}\mathrm{C}$.'),
  (r'Core-collapse supernovae leave', [r'neutron stars or black holes', r'white dwarfs', r'nothing ever', r'red giants'], r'Massive stars.'),
  (r'Transit method measures', [r'the planet radius relative to the star', r'the planet mass directly', r'the planet temperature', r'the orbital inclination only'], r'Dip depth $\propto(R_p/R_*)^2$.'),
  (r'The Sun will end as', [r'a white dwarf', r'a neutron star', r'a black hole', r'a supernova'], r'Too light.')],
 'astro-read-06a': [
  (r'White-dwarf radius scales as', [r'$M^{-1/3}$', r'$M^{1/3}$', r'$M$', r'independent of $M$'], r'Non-relativistic degeneracy.'),
  (r'Degeneracy pressure arises from', [r'the Pauli principle', r'thermal motion', r'radiation', r'magnetic fields'], r'Choudhuri 5.2.'),
  (r'A typical white dwarf has the size of', [r'the Earth', r'the Sun', r'10 km', r'Jupiter&#8217;s orbit'], r'$\sim10^4$ km.'),
  (r'Non-relativistic degeneracy pressure', [r'$\propto n^{5/3}$', r'$\propto n^{4/3}$', r'$\propto nT$', r'$\propto n^2$'], r'Choudhuri 5.2.')],
 'astro-read-06b': [
  (r'Neutron-star density is about', [r'nuclear density, $\sim10^{17}$ kg/m$^3$', r'$10^9$ kg/m$^3$', r'water', r'$10^{30}$ kg/m$^3$'], r'Choudhuri 5.4.'),
  (r'The binary pulsar tested', [r'gravitational-wave emission of GR', r'neutrino masses', r'dark energy', r'the Chandrasekhar limit'], r'Orbital decay.'),
  (r'Fast spin of pulsars follows from', [r'angular momentum conservation in collapse', r'accretion only', r'magnetic braking', r'nuclear burning'], r'$\Omega\propto R^{-2}$.'),
  (r'X-ray binaries are powered by', [r'accretion onto a compact object', r'fusion on the surface only', r'rotation', r'dark matter'], r'Choudhuri 5.6.')],
 'astro-read-07a': [
  (r'The Sun is about this far from the Galactic centre', [r'8 kpc', r'800 pc', r'80 kpc', r'1 Mpc'], r'Shapley (with globular clusters).'),
  (r'Reddening $E(B-V)$ measures', [r'extinction difference between B and V', r'distance', r'temperature', r'metallicity'], r'Colour excess.'),
  (r'Extinction is largest towards', [r'low galactic latitude (the disk)', r'the galactic poles', r'the halo', r'nowhere'], r'Dust in the disk (HS24 summer Q4).'),
  (r'Oort&#8217;s constants describe', [r'local differential rotation', r'the Hubble flow', r'dark energy', r'stellar ages'], r'Choudhuri 6.2.')],
 'astro-read-07b': [
  (r'The local standard of rest moves', [r'on a circular orbit at the Sun&#8217;s position', r'with the Sun', r'not at all', r'radially'], r'Choudhuri 6.3.2.'),
  (r'Globular clusters belong to', [r'population II (halo)', r'population I', r'the thin disk', r'spiral arms'], r'Old and metal-poor.'),
  (r'Velocity dispersion of old disk stars compared to young ones', [r'larger', r'smaller', r'equal', r'zero'], r'Heating over time.'),
  (r'Metallicity in astronomy means', [r'abundance of elements heavier than He', r'iron content only', r'conductivity', r'hydrogen fraction'], r'$Z$.')],
 'astro-read-08a': [
  (r'HII regions surround', [r'hot O/B stars', r'white dwarfs', r'red giants', r'black holes'], r'Ionising UV.'),
  (r'Strömgren radius scales with density as', [r'$n^{-2/3}$', r'$n^{-1}$', r'$n^{1/3}$', r'independent'], r'$R_S\propto(Q/n^2)^{1/3}$.'),
  (r'Typical temperature of HII regions', [r'~$10^4$ K', r'~100 K', r'~$10^6$ K', r'~10 K'], r'Photoionisation equilibrium.'),
  (r'The hot coronal gas has', [r'$T\sim10^6$ K, low density', r'$T\sim10$ K', r'$T\sim10^4$ K, high density', r'no ionisation'], r'Supernova heated.')],
 'astro-read-08b': [
  (r'Cosmic rays are mostly', [r'protons and nuclei', r'photons', r'neutrinos', r'electrons only'], r'Choudhuri 6.7.'),
  (r'The cosmic-ray energy spectrum is', [r'a power law', r'a blackbody', r'a single line', r'Gaussian'], r'Non-thermal acceleration.'),
  (r'ISM phases coexist roughly in', [r'pressure equilibrium', r'temperature equilibrium', r'density equilibrium', r'no equilibrium'], r'Choudhuri 6.8.'),
  (r'Dispersion measure of a pulsar gives', [r'the column of free electrons', r'the magnetic field', r'the distance only via parallax', r'the mass'], r'$\int n_eds$.')],
 'astro-read-09a': [
  (r'Crossing time of a galaxy is of order', [r'$10^8$ yr', r'$10^{15}$ yr', r'1 yr', r'$10^3$ yr'], r'$R/v$.'),
  (r'Globular clusters ($N\sim10^5$) are', [r'collisional over their age', r'collisionless', r'unbound', r'without stars'], r'Relaxation time ~$10^9$ yr.'),
  (r'The isothermal sphere has', [r'infinite mass', r'finite mass', r'no density', r'negative density'], r'$\rho\propto r^{-2}$ at large $r$.'),
  (r'Virial theorem for a galaxy cluster relates', [r'velocity dispersion, size and mass', r'temperature and colour', r'redshift and distance', r'metallicity and age'], r'$M\sim\sigma^2R/G$.')],
 'astro-read-09b': [
  (r'The collisionless Boltzmann equation says', [r'the phase-space density is conserved along orbits', r'stars collide often', r'energy is not conserved', r'$f$ is constant everywhere'], r'Choudhuri 7.5.'),
  (r'Asymmetric drift: hotter populations', [r'lag behind the circular speed', r'rotate faster', r'do not rotate', r'move radially'], r'Choudhuri 7.6.2.'),
  (r'Velocity anisotropy $\beta$ measures', [r'radial vs tangential dispersion', r'rotation speed', r'metallicity', r'mass'], r'Spherical Jeans equation.'),
  (r'The Plummer potential is', [r'$-GM/\sqrt{r^2+b^2}$', r'$-GM/r$', r'$-GM/r^2$', r'$\frac12\omega^2r^2$'], r'HS25 winter Q4.')],
 'astro-read-09c': [
  (r'The Jeans length scales as', [r'$c_s/\sqrt{G\rho}$', r'$c_s\sqrt{G\rho}$', r'$\sqrt{G\rho}/c_s$', r'$G\rho c_s$'], r'Sound crossing vs free fall.'),
  (r'Free-fall time', [r'$\sim1/\sqrt{G\rho}$', r'$\sim\rho/G$', r'$\sim G\rho$', r'$\sim c_s$'], r'Independent of size.'),
  (r'Jeans mass decreases when', [r'density increases', r'temperature increases', r'sound speed increases', r'never'], r'$M_J\propto T^{3/2}\rho^{-1/2}$.'),
  (r'The Euler equation expresses', [r'momentum balance of a fluid element', r'mass conservation', r'energy conservation only', r'Gauss law'], r'Choudhuri 8.2.')],
 'astro-read-10a': [
  (r'Spiral galaxies have exponential disks with surface brightness', [r'$I\propto e^{-r/r_d}$', r'$I\propto r^{1/4}$', r'$I\propto r^{-2}$', r'constant'], r'De Vaucouleurs for ellipticals.'),
  (r'De Vaucouleurs profile', [r'$\log I\propto-r^{1/4}$', r'$I\propto e^{-r}$', r'$I\propto r^{-3}$', r'$I=$ const'], r'Ellipticals and bulges.'),
  (r'The Hubble tuning fork orders galaxies by', [r'morphology', r'distance', r'age', r'mass only'], r'Not an evolutionary sequence.'),
  (r'Faber-Jackson relates luminosity to', [r'central velocity dispersion', r'rotation speed', r'colour', r'size only'], r'$L\propto\sigma^4$.')],
 'astro-read-10b': [
  (r'Quasars are', [r'very luminous AGN at large distances', r'nearby stars', r'pulsars', r'supernova remnants'], r'Choudhuri 9.4.'),
  (r'Broad emission lines come from', [r'fast gas close to the black hole', r'the host galaxy disk', r'the CMB', r'dust far out'], r'Broad-line region.'),
  (r'Superluminal motion needs', [r'relativistic jets close to the line of sight', r'faster-than-light motion', r'gravitational lensing', r'expansion of the Universe'], r'Light-travel effect.'),
  (r'Accretion efficiency of a black hole thin disk', [r'~0.06-0.4', r'0.007', r'1', r'$10^{-4}$'], r'Spin dependent.')],
 'astro-read-10c': [
  (r'Gravitational lensing measures', [r'the total (dark + luminous) mass', r'only stars', r'only gas', r'temperature'], r'Independent of dynamics.'),
  (r'Cluster gas temperature is typically', [r'$10^7$-$10^8$ K', r'$10^4$ K', r'100 K', r'$10^{12}$ K'], r'Virial temperature.'),
  (r'Gamma-ray bursts are', [r'brief extreme explosions at cosmological distances', r'nearby stellar flares', r'solar events', r'pulsars'], r'Choudhuri 9.7.'),
  (r'Galaxies on large scales form', [r'filaments, walls and voids', r'a uniform distribution', r'a single cluster', r'a sphere'], r'Choudhuri 9.6.')],
 'astro-read-10d': [
  (r'Relativistic beaming concentrates emission into a cone of angle', [r'$\sim1/\gamma$', r'$\sim\gamma$', r'$90^\circ$', r'$\gamma^2$'], r'Choudhuri 8.11.'),
  (r'Synchrotron emission is', [r'polarised and non-thermal', r'unpolarised blackbody', r'line emission', r'thermal bremsstrahlung'], r'Ordered fields.'),
  (r'Bremsstrahlung is also called', [r'free-free emission', r'bound-bound', r'synchrotron', r'Compton'], r'Electron-ion encounters.'),
  (r'The cutoff of the thermal bremsstrahlung spectrum is at', [r'$h\nu\sim k_BT$', r'$h\nu\sim m_ec^2$', r'21 cm', r'no cutoff'], r'$e^{-h\nu/k_BT}$.')],
 'astro-read-11a': [
  (r'Redshift is defined as', [r'$z=(\lambda_{\rm obs}-\lambda_{\rm emit})/\lambda_{\rm emit}$', r'$z=\lambda_{\rm emit}/\lambda_{\rm obs}$', r'$z=v/c$ exactly', r'$z=H_0d$'], r'Choudhuri 9.3.'),
  (r'For small $z$, the recession velocity is', [r'$v\approx cz$', r'$v=c/z$', r'$v=z$', r'$v=cz^2$'], r'Doppler limit.'),
  (r'Type Ia supernovae revealed', [r'the accelerating expansion', r'dark matter in clusters', r'the CMB', r'neutrino masses'], r'1998.'),
  (r'The Hubble constant is about', [r'70 km/s/Mpc', r'7 km/s/Mpc', r'700 km/s/Mpc', r'70 km/s/kpc'], r'Current values 67-73.')],
 'astro-read-11b': [
  (r'The scale factor $a(t)$ describes', [r'how all comoving distances grow', r'the size of galaxies', r'the age of stars', r'the temperature only'], r'FRW.'),
  (r'$k=+1$ means', [r'positively curved (closed) space', r'flat space', r'open space', r'no matter'], r'Choudhuri 10.3.'),
  (r'The Hubble parameter is', [r'$H=\dot a/a$', r'$H=a/\dot a$', r'$H=\ddot a$', r'$H=a$'], r'Definition.'),
  (r'Critical density is about', [r'$10^{-26}$ kg/m$^3$', r'$1$ kg/m$^3$', r'$10^{-10}$ kg/m$^3$', r'$10^{-40}$ kg/m$^3$'], r'$3H^2/8\pi G$.')],
 'astro-read-12a': [
  (r'Matter density scales as', [r'$a^{-3}$', r'$a^{-4}$', r'$a^{-2}$', r'constant'], r'Dilution.'),
  (r'Temperature of the CMB scales as', [r'$1/a$', r'$a$', r'$a^{-4}$', r'constant'], r'Redshifted blackbody stays a blackbody.'),
  (r'Age of a flat matter universe', [r'$\frac2{3H_0}$', r'$\frac1{H_0}$', r'$\frac1{2H_0}$', r'infinite'], r'$a\propto t^{2/3}$.'),
  (r'A closed matter universe', [r'recollapses (big crunch)', r'expands forever accelerating', r'is static', r'has no beginning'], r'Choudhuri 10.6.1 (HS24 winter Q7).')],
 'astro-read-13a': [
  (r'Primordial nucleosynthesis happened about', [r'3 minutes after the big bang', r'380000 yr after', r'1 s before', r'1 Gyr after'], r'BBN.'),
  (r'The neutron-proton ratio freezes out because', [r'weak interactions become slower than the expansion', r'neutrons decay instantly', r'protons decay', r'of gravity'], r'Choudhuri 11.3.'),
  (r'BBN produces mainly', [r'helium-4 plus traces of D, $^3$He, Li', r'carbon and oxygen', r'iron', r'only hydrogen'], r'No stable mass 5 and 8.'),
  (r'The cosmic neutrino background temperature today', [r'about 1.95 K', r'2.7 K', r'0 K', r'3000 K'], r'$(4/11)^{1/3}T_\gamma$.')],
 'astro-read-13b': [
  (r'The Sunyaev-Zeldovich effect is', [r'inverse Compton scattering of CMB photons by hot cluster gas', r'lensing of the CMB', r'a neutrino effect', r'synchrotron from clusters'], r'Choudhuri 11.7.2.'),
  (r'The Ly$\alpha$ forest traces', [r'neutral hydrogen clouds along the line of sight to quasars', r'stars in our Galaxy', r'the CMB', r'dark energy'], r'Choudhuri 11.8.2.'),
  (r'CMB temperature anisotropies are of order', [r'$10^{-5}$', r'$10^{-1}$', r'$1$', r'$10^{-10}$'], r'Seeds of structure.'),
  (r'Baryogenesis must explain', [r'the excess of matter over antimatter', r'dark energy', r'the CMB temperature', r'helium abundance'], r'Choudhuri 11.6.2.')],
}
