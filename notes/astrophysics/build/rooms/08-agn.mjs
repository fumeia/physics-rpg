// New room: The Quasar Beacon (galaxies, radiation processes, AGN, clusters).
// Choudhuri 8.10-8.12 (particle acceleration, synchrotron, bremsstrahlung), 9.2 (normal galaxies), 9.4 (AGN), 9.5-9.6 (clusters, LSS).
import { t, pick, S, exam, choud, P, EQ, INT, PIT, FIG, EXQ, MC } from '../lib.mjs';

const room = {
  id: 'astro-active-galaxies', region: 'Astro Observatory Ship', title: 'The Quasar Beacon', course: 'astrophysics',
  topics: ['Hubble sequence', 'spirals vs ellipticals', 'Tully–Fisher and Faber–Jackson', 'synchrotron radiation', 'bremsstrahlung', 'AGN and quasars', 'superluminal motion', 'galaxy clusters', 'large-scale structure'],
  sources: [
    choud('Ch. 8.10 (power-law particle spectra), 8.11 (synchrotron, s = (p−1)/2, eq. 8.69), 8.12 (bremsstrahlung 8.70-8.71), 9.2 (de Vaucouleurs 9.2, exponential disk 9.3, Faber–Jackson 9.4, Tully–Fisher 9.8), 9.4 (AGN, superluminal 9.21), 9.5 (clusters), 9.6 (large-scale structure)'),
    exam('w24', 'open Q5 (spiral vs elliptical), Q6 (quasar variability), MC 12, 13'), exam('w25', 'MC 11; open Q5 (cluster bremsstrahlung)'), exam('s24', 'MC 11, 12'), exam('p25', 'MC 9, 14, 15'),
  ],
  intro: t`Beyond the Milky Way: galaxies of two great families, nuclei that outshine their whole galaxy from a region the size of the Solar System, jets that seem to move faster than light, and clusters filled with $10^8$ K gas. Radiation processes (synchrotron, bremsstrahlung) are the tools for reading all of them.`,
  encounters: [],
};

const lessons = [
  {
    type: 'lesson', id: 'L1', title: 'Spirals and ellipticals: the Hubble sequence', tier: 'intuition', minutes: 12, xp: 15,
    source: [choud('§9.2, Fig. 9.4, eqs. (9.2)-(9.8)'), exam('w24', 'open Q5'), exam('p25', 'MC 9')],
    blocks: [
      FIG(t`Hubble's tuning fork: ellipticals E0 (round) to E7 (flattened) on the handle; then S0 (lenticular, disk without arms) at the fork; then two prongs, normal spirals Sa → Sb → Sc and barred spirals SBa → SBc, with smaller bulges and more open, clumpier arms towards c. Irregulars off the end. It is a classification, not an evolutionary sequence.`),
      P(t`<b>Ellipticals vs spirals</b> (HS24 winter Q5 asks for three): morphology (smooth ellipsoid vs disk + bulge + arms); dynamics (random motions vs rotation); colour (red vs blue); stellar population (old, no star formation vs young, active star formation); gas (little cold gas vs a lot); environment (common in dense clusters vs in the field); surface brightness ($I\propto\exp[-7.67((r/r_e)^{1/4}-1)]$, de Vaucouleurs vs exponential disk $I_0e^{-r/r_d}$).`),
      EQ(t`\sigma\approx220\left(\frac{L}{L_*}\right)^{1/4}\mathrm{km\,s^{-1}}\ \text{(Faber–Jackson, ellipticals)},\qquad v_c\approx220\left(\frac{L}{L_*}\right)^{0.22}\mathrm{km\,s^{-1}}\ \text{(Tully–Fisher, spirals)}`, '(9.4), (9.8). Measure a velocity, get the luminosity, compare with the flux: a distance.'),
      INT(t`Both scaling relations are the virial theorem in disguise: $v^2\sim GM/R$, and if all galaxies have similar surface brightness ($L/R^2$) and mass-to-light ratio, then $L\propto v^4$.`),
      PIT(t`Spiral <b>disks</b> are bluer and younger than ellipticals (HS25 practice MC9). The bulges of spirals look like small ellipticals (old, red).`),
    ],
    check: [
      MC(t`Compared with ellipticals, spiral disks are`, ['redder, older population', 'redder, younger', 'bluer, older', 'bluer, younger population'], 3, 'Active star formation.', exam('p25', 'MC 9')),
    ],
  },
  {
    type: 'lesson', id: 'L2', title: 'Synchrotron and bremsstrahlung: reading non-thermal and thermal light', tier: 'theory', minutes: 15, xp: 20,
    source: [choud('§8.10-8.12, eqs. (8.60)-(8.71)'), exam('w25', 'MC 11, open Q5'), exam('s24', 'MC 11'), exam('w24', 'MC 12')],
    blocks: [
      P(t`<b>Synchrotron:</b> relativistic electrons spiralling around magnetic field lines. Relativistic beaming confines each electron's emission to a cone of angle $\sim1/\gamma$; the observer sees short pulses and the spectrum peaks near $\nu\sim\gamma^2\nu_g$, with $\nu_g=eB/(2\pi m_e)=28\,\mathrm{GHz}\,(B/1\,\mathrm T)$. Shock acceleration gives a power law of electron energies, and the sum is a power law:`),
      EQ(t`N(E)\propto E^{-p}\ \Rightarrow\ f(\nu)\propto\nu^{-s},\qquad s=\frac{p-1}{2}`, 'Choudhuri (8.65)-(8.69). p ≈ 2.6 gives s ≈ 0.8, typical of radio sources.'),
      P(t`Derivation in two lines: an electron of energy $E$ radiates power $\propto E^2$ at frequency $\nu\propto E^2$. Then $f(\nu)d\nu\propto E^2E^{-p}dE$ with $E\propto\nu^{1/2}$, $dE\propto\nu^{-1/2}d\nu$: $f\propto\nu^{(2-p)/2}\nu^{-1/2}=\nu^{-(p-1)/2}$.`),
      P(t`<b>Thermal bremsstrahlung</b> (free–free): electrons deflected by ions in a hot plasma. Emissivity (8.70)-(8.71):`),
      EQ(t`\epsilon_\nu\propto\frac{n_en_iZ^2}{\sqrt T}e^{-h\nu/k_BT},\qquad\epsilon=\int\epsilon_\nu d\nu=1.4\times10^{-40}\sqrt T\,n_en_iZ^2g\ \ \mathrm{W\,m^{-3}}`),
      INT(t`Two fingerprints. Synchrotron: power law, polarised, needs B and relativistic electrons (radio galaxies, supernova remnants, the Crab, the Galactic radio background). Bremsstrahlung: flat spectrum with an exponential cut-off at $h\nu\sim k_BT$ (so the cut-off measures $T$), unpolarised, $\propto n^2$ (two-body process). A cluster with $T=10^8$ K glows in X-rays ($k_BT\approx9$ keV), concentrated where the gas is densest.`),
      PIT(t`Spectrum index sign: $p=2$ gives $f\propto\nu^{-1/2}$ (HS25 winter MC11), not $\nu^{-1}$. Bremsstrahlung goes as $\rho_{\rm gas}^2$, not $\rho$ (HS24 winter MC12).`),
    ],
    check: [
      MC(t`Electrons with $N(E)\propto E^{-2}$ emit a synchrotron spectrum`, [t`$\nu^{-1/2}$`, t`$\nu^{-1}$`, t`$\nu^{-3/2}$`, t`$\nu^{-2}$`], 0, t`$s=(p-1)/2=1/2$.`, exam('w25', 'MC 11')),
      MC(t`Synchrotron radiation is produced by`, ['neutrinos changing flavour', 'self-gravitating particles', 'dark matter virialising', 'free electrons spiralling around magnetic field lines'], 3, 'Relativistic electrons in B.', exam('s24', 'MC 11')),
      MC(t`X-ray bremsstrahlung from an isothermal cluster atmosphere is`, [t`concentrated in dense regions ($\propto\rho_{\rm gas}^2$)`, 'linear in density', 'concentrated in low-density regions', 'independent of density'], 0, t`$\epsilon\propto n_en_p$.`, exam('w24', 'MC 12')),
    ],
  },
  {
    type: 'lesson', id: 'L3', title: 'Active galactic nuclei: black-hole engines', tier: 'theory', minutes: 15, xp: 20,
    source: [choud('§9.4, eq. (9.21)'), exam('w24', 'open Q6'), exam('s24', 'MC 12'), exam('w25', 'open Q6')],
    blocks: [
      P(t`<b>Seyfert galaxies</b> (1943): spirals with an unusually bright, point-like nucleus and strong emission lines (Seyfert 1: broad + narrow lines; Seyfert 2: only narrow). <b>Radio galaxies</b>: mostly ellipticals with giant radio lobes fed by jets. <b>Quasars</b>: the most luminous, often outshining the host 100×, seen to high redshift. <b>Blazars</b>: a jet pointing at us.`),
      P(t`<b>Size from variability:</b> a source cannot vary coherently faster than light crosses it, $R\lesssim c\,\Delta t$. Quasars vary in days: $R\lesssim10^{-3}$ pc, smaller than the Solar System, yet $L\sim10^{39}$–$10^{40}$ W. Only accretion onto a supermassive black hole ($\eta\sim0.1$) delivers that: if $R\gtrsim r_s=2GM/c^2$, $M\lesssim Rc^2/2G$.`),
      P(t`<b>Unified model:</b> a black hole with an accretion disk (thermal UV/optical "big blue bump"), fast clouds close in (broad lines), a dusty torus, slower clouds further out (narrow lines), and sometimes two jets. Seen face-on: Seyfert 1 / quasar; edge-on through the torus: Seyfert 2; down the jet: blazar.`),
      EQ(t`v_\perp=\frac{v\sin\theta}{1-(v/c)\cos\theta},\qquad v_{\perp,\max}=\gamma v\ \ \text{at}\ \cos\theta=v/c`, 'Superluminal motion (9.21): a blob moving at v at angle θ to our line of sight.'),
      INT(t`Superluminal motion is a light-travel-time illusion: the blob almost catches up with its own light, so the arrival times are compressed while the sideways displacement is not. Nothing moves faster than $c$.`),
      PIT(t`The Eddington limit caps the AGN luminosity: $L\le L_{Edd}=1.3\times10^{31}(M/M_\odot)$ W, which gives a <b>lower</b> limit on the black-hole mass, while variability gives an <b>upper</b> limit on the size and, via $r_s$, on the mass (HS24 winter Q6).`),
    ],
    check: [
      MC(t`Seyfert galaxies are`, ['spirals with a bright nucleus and strong emission lines', 'spirals with a bright nucleus, no strong lines', 'ellipticals with a bright nucleus and strong lines', 'ellipticals, no strong lines'], 0, 'Seyfert 1943.', exam('s24', 'MC 12')),
      MC(t`A quasar varies in brightness on a timescale of 1 day. The emitting region is smaller than about`, ['1 light-second', '1 light-day', '1 light-year', '1 kpc'], 1, t`$R\lesssim c\Delta t$.`),
    ],
  },
  {
    type: 'lesson', id: 'L4', title: 'Clusters of galaxies and the cosmic web', tier: 'intuition', minutes: 10, xp: 15,
    source: [choud('§9.5-9.6'), exam('w24', 'MC 13'), exam('p25', 'MC 14, 15'), exam('w25', 'open Q5')],
    blocks: [
      P(t`A rich cluster: $\gtrsim100$ (up to thousands of) galaxies bound in a $\sim10^{15}M_\odot$ halo a few Mpc across. Mass budget: galaxies a few %, hot intracluster gas (ICM) ~15 %, dark matter ~80 %. Zwicky (1933) first found the "missing mass" from the virial theorem applied to the Coma cluster.`),
      P(t`The ICM falls into the deep potential well and is shock-heated to the virial temperature, $k_BT\sim\mu m_p\sigma^2\approx10^8$ K for $\sigma\approx1000$ km/s: it shines in X-rays by bremsstrahlung. Scaling (HS25 winter Q5): $T\propto M/R\propto M^{2/3}$, $L_X\propto M^{4/3}$. It also scatters CMB photons to higher energy (Sunyaev–Zel'dovich effect). Gravitational lensing measures the total mass directly.`),
      INT(t`Three independent scales: galaxy velocities (virial), X-ray gas temperature (hydrostatic) and lensing (geometry) all give the same, dark-matter-dominated cluster mass. On larger scales galaxies form filaments, walls and voids (the cosmic web); only above $\sim100\,h^{-1}$ Mpc does the Universe look statistically homogeneous and isotropic (HS25 practice MC15).`),
    ],
    check: [
      MC(t`The typical temperature of the intracluster gas is`, [t`$10^4$ K`, t`$100$ K`, t`$10^{12}$ K`, t`$10^8$ K`], 3, 'Virial temperature of a 10¹⁵ M☉ halo.', exam('p25', 'MC 14')),
      MC(t`A galaxy cluster typically contains`, ['2 galaxies', '≳100 galaxies', '5-10 galaxies (that is a group)', 'only galaxies above 10¹³ M☉'], 1, 'Up to ~1000.', exam('w24', 'MC 13')),
      MC(t`The matter distribution is statistically homogeneous and isotropic`, [t`below $\sim10\,h^{-1}$ Mpc`, t`above $\sim100\,h^{-1}$ Mpc`, t`within 1 $h^{-1}$ Mpc of the Local Group`, 'only on the scale of the observable Universe'], 1, 'Cosmological principle on large scales.', exam('p25', 'MC 15')),
    ],
  },
];

const quiz = {
  type: 'quiz', id: 'Q1', title: 'Quasar Beacon multiple choice', xp: 30, passMark: 0.75,
  source: [exam('w25', 'MC'), exam('s24', 'MC'), exam('w24', 'MC'), exam('p25', 'MC')],
  questions: [
    MC(t`Seyfert galaxies are`, ['spirals, bright nucleus, strong emission lines', 'spirals, bright nucleus, no strong lines', 'ellipticals with strong lines', 'ellipticals without strong lines'], 0, 'Definition.', exam('s24', 'MC 12')),
    MC(t`$N(E)\propto E^{-2}$ gives a synchrotron spectrum`, [t`$\nu^{-1/2}$`, t`$\nu^{-1}$`, t`$\nu^{-3/2}$`, t`$\nu^{-2}$`], 0, t`$(p-1)/2$.`, exam('w25', 'MC 11')),
    MC(t`Synchrotron radiation comes from`, ['neutrino oscillations', 'self-gravitating particles', 'virialising dark matter', 'electrons spiralling in magnetic fields'], 3, 'Relativistic electrons.', exam('s24', 'MC 11')),
    MC(t`ICM X-ray emission from bremsstrahlung (constant T)`, [t`is concentrated in dense regions ($\rho^2$)`, 'is linear in density', t`is concentrated in low-density regions ($\rho^{-2}$)`, 'depends only on T'], 0, 'Two-body process.', exam('w24', 'MC 12')),
    MC(t`A galaxy cluster is typically made of`, ['2 galaxies', '≳100 galaxies', '5-10 galaxies', 'only massive galaxies'], 1, '~10¹⁵ M☉ halo.', exam('w24', 'MC 13')),
    MC(t`ICM temperature`, ['10⁴ K', '100 K', '10¹² K', '10⁸ K'], 3, 'X-ray gas.', exam('p25', 'MC 14')),
    MC(t`Spiral disks vs ellipticals:`, ['redder, older', 'redder, younger', 'bluer, older', 'bluer, younger'], 3, 'Star formation.', exam('p25', 'MC 9')),
    MC(t`Homogeneity and isotropy hold`, ['below 10 h⁻¹ Mpc', 'above ~100 h⁻¹ Mpc', 'within the Local Group', 'only at the horizon scale'], 1, 'Cosmic web below that.', exam('p25', 'MC 15')),
  ],
};

const derivations = [
  {
    type: 'derive', id: 'D1', title: 'Synchrotron spectral index from the electron spectrum', xp: 25,
    source: choud('§8.11, eqs. (8.65)-(8.69)'),
    goal: t`Electrons with $N(E)dE\propto E^{-p}dE$ each radiate power $\propto E^2$ at frequency $\nu=CE^2$. Show $f(\nu)\propto\nu^{-(p-1)/2}$.`,
    given: [t`$\nu=CE^2$`],
    steps: [
      { prompt: 'Relate dE to dν.', reveal: t`$E=\sqrt{\nu/C}$, $dE=\frac{d\nu}{2\sqrt{C\nu}}$.` },
      { prompt: 'Power emitted in dν.', reveal: t`$f(\nu)d\nu\propto E^2\cdot E^{-p}dE\propto\nu\cdot\nu^{-p/2}\cdot\nu^{-1/2}d\nu=\nu^{(1-p)/2}d\nu$.` },
      { prompt: 'Result.', reveal: t`$s=(p-1)/2$; e.g. $p=2.6\Rightarrow s=0.8$, $p=2\Rightarrow s=0.5$.` },
    ],
    keyPoints: ['$\\nu\\propto E^2$ and Jacobian', 'power $\\propto E^2$', '$s=(p-1)/2$'],
  },
  {
    type: 'derive', id: 'D2', title: 'Superluminal motion', xp: 30,
    source: choud('§9.4.2, eq. (9.21)'),
    goal: t`A blob moves at speed $v$ at angle $\theta$ to the line of sight towards us. Derive the apparent transverse speed $v_\perp$ and its maximum over $\theta$.`,
    given: [t`Distance to observer $D\gg v\delta t$`],
    steps: [
      { prompt: 'Arrival times of signals emitted at A (t = 0) and at B (t = δt).', reveal: t`$t_A=D/c$, $t_B=\delta t+(D-v\delta t\cos\theta)/c$, so $\Delta t_{\rm obs}=\delta t(1-\beta\cos\theta)$, $\beta=v/c$.` },
      { prompt: 'Apparent speed.', reveal: t`Transverse displacement $v\delta t\sin\theta$: $v_\perp=\frac{v\sin\theta}{1-\beta\cos\theta}$.` },
      { prompt: 'Maximise.', reveal: t`$\frac{d}{d\theta}$: $\cos\theta(1-\beta\cos\theta)-\beta\sin^2\theta=0\Rightarrow\cos\theta=\beta$. Then $v_\perp=\frac{v\sqrt{1-\beta^2}}{1-\beta^2}=\gamma v$, which exceeds $c$ for $\beta>1/\sqrt2$.` },
    ],
    keyPoints: ['light-travel-time difference', '$v_\\perp$ formula', 'maximum $\\gamma v$ at $\\cos\\theta=\\beta$'],
  },
  {
    type: 'derive', id: 'D3', title: 'Three differences between spirals and ellipticals (exam explain question)', xp: 20,
    source: exam('w24', 'open Q5 [6 pt]'),
    goal: t`Briefly explain three differences in the properties of spiral and elliptical galaxies, describing how each property is exhibited in both types.`,
    given: [],
    steps: [
      { prompt: 'Write three on paper (2 pt each: name the property and state it for BOTH types). Then reveal a model list.', reveal: t`Morphology (smooth ellipsoid vs disk with bulge, arms, bar); dynamics (random motions vs rotation of the disk); colour (red vs blue); stars (old, little star formation vs young, active star formation); gas (little cold gas vs much); environment (clusters vs field); clustering (stronger vs weaker); surface brightness ($r^{1/4}$ law vs exponential disk).` },
      { prompt: 'Check that each of your answers says something about both types.', reveal: t`"Ellipticals are red" alone is half an answer; "ellipticals are red because their stars are old, spirals are bluer because young massive stars are still forming in their gas-rich disks" is a full one.` },
    ],
    keyPoints: ['three distinct properties', 'each stated for both types', 'brief physical reason'],
  },
];

const calcs = [
  {
    type: 'calc', id: 'c1', title: 'Synchrotron in the Galactic magnetic field', fight: 'normal', xp: 30,
    problem: t`Radio emission at $\nu=1$ GHz from electrons in a field $B=10^{-9}$ T (10 µG). Use $\nu\approx\gamma^2\nu_g$ with $\nu_g=eB/(2\pi m_e)$. Electrons have $N(E)\propto E^{-2.6}$.`,
    vars: { ...pick('me', 'eV', 'c'), B: 1e-9, nu: 1e9, p: 2.6, e: 1.602176634e-19 },
    steps: [
      S('nug', t`Non-relativistic gyrofrequency $\nu_g$ in Hz.`, 'e*B/(2*pi*me)', 'Hz', ['Hz', 'GHz', 'rad', 'T'], 0.02, t`$28$ GHz per tesla: $28$ Hz here.`),
      S('gam', t`Lorentz factor $\gamma=\sqrt{\nu/\nu_g}$.`, 'sqrt(nu/nug)', 'dimensionless', ['dimensionless', 'GeV', 'Hz', 'T'], 0.02, t`About 6000.`),
      S('E', t`Electron energy $\gamma m_ec^2$ in GeV.`, 'gam*me*c^2/eV/1e9', 'GeV', ['GeV', 'MeV', 'TeV', 'Hz'], 0.02, t`$m_ec^2=0.511$ MeV.`),
      S('s', t`Spectral index $s$ of the radio spectrum $f\propto\nu^{-s}$.`, '(p-1)/2', 'dimensionless', ['dimensionless', 'GeV', 'Hz', 'T'], 0.01, t`$(2.6-1)/2$.`),
    ],
  },
  {
    type: 'calc', id: 'c2', title: 'Superluminal jet', fight: 'normal', xp: 25,
    problem: t`A jet blob moves at $\beta=v/c=0.99$. Use $v_\perp=v\sin\theta/(1-\beta\cos\theta)$.`,
    vars: { b: 0.99, th: 20 },
    steps: [
      S('vmax', t`Maximum apparent speed in units of $c$.`, 'b/sqrt(1-b^2)', 'c', ['c', 'km/s', 'rad', 'deg'], 0.02, t`$\gamma\beta=0.99/\sqrt{1-0.98}$.`),
      S('thmax', t`Angle (degrees) at which it is reached.`, String(Math.acos(0.99) * 180 / Math.PI), 'deg', ['deg', 'rad', 'arcmin', 'c'], 0.02, t`$\cos\theta=\beta$: about 8°.`),
      S('v20', t`Apparent speed at $\theta=20^\circ$ in units of $c$.`, 'b*sin(th*pi/180)/(1-b*cos(th*pi/180))', 'c', ['c', 'km/s', 'rad', 'deg'], 0.02, t`Still superluminal: about $5c$.`),
    ],
  },
  {
    type: 'calc', id: 'c3', title: 'Weighing a cluster and its gas', fight: 'normal', xp: 30,
    problem: t`A cluster has line-of-sight velocity dispersion $\sigma=1000$ km/s and radius $R=1$ Mpc. Use $\langle v^2\rangle=3\sigma^2=GM/(2R)$ and $k_BT\approx\mu m_p\sigma^2$ with $\mu=0.6$.`,
    vars: { ...pick('G', 'Msun', 'pc', 'mp', 'kB'), sig: 1000, R: 1, mu: 0.6 },
    steps: [
      S('M', t`Virial mass in $10^{15}M_\odot$.`, '6*(sig*1e3)^2*R*1e6*pc/G/Msun/1e15', '10^15 M_sun', ['10^15 M_sun', 'kg', 'M_sun/pc', 'Mpc'], 0.02, t`$M=6\sigma^2R/G$.`),
      S('T', t`Gas temperature in $10^7$ K.`, 'mu*mp*(sig*1e3)^2/kB/1e7', '10^7 K', ['10^7 K', 'keV', 'K', 'eV'], 0.02, t`About $7\times10^7$ K: X-ray hot.`),
      S('kT', t`$k_BT$ in keV.`, 'mu*mp*(sig*1e3)^2/1.602176634e-16', 'keV', ['keV', 'eV', 'MeV', 'K'], 0.02, t`$1$ keV $=1.602\times10^{-16}$ J. About 6 keV: bremsstrahlung cut-off in the X-ray band.`),
    ],
  },
];

const boss = {
  type: 'boss', id: 'b1', title: 'Boss: quasar variability and black-hole mass (exam problem)', xp: 100, minutes: 15,
  source: exam('w24', 'Open Question 6 [8 pt]'),
  instructions: 'Solve on paper under the timer, then enter the final numbers.',
  statement: [
    t`Quasars are often observed to exhibit variability with typical timescales on the order of a few days.`,
    t`(a) [4 pt] Assuming variability of a quasar is observed on a characteristic timescale of 3 days, obtain an approximate limit on the length scale of the region responsible for this emission. How does this length scale compare to the typical size of a galaxy like the Milky Way?`,
    t`(b) [4 pt] From the result of question (a), derive an approximate upper limit for the mass of the supermassive black hole which powers the AGN. Express your answer in solar masses. Hint: relate $D$ (the solution to part (a)) to the Schwarzschild radius.`,
  ],
  finalAnswers: [
    { id: 'D', prompt: t`(a): $D$ in units of $10^{-3}$ pc.`, answer: 'c*3*86400/pc*1e3', vars: { ...pick('c', 'pc') }, tol: 0.02 },
    { id: 'M', prompt: t`(b): upper mass limit in $10^{10}M_\odot$.`, answer: 'c*3*86400*c**2/(2*G)/Msun/1e10', vars: { ...pick('c', 'G', 'Msun') }, tol: 0.02 },
  ],
  keyPoints: [
    t`(a) Causality: $D\lesssim c\Delta t=3\times10^5$ km/s $\times3\times86400$ s $=7.8\times10^{10}$ km $=2.5\times10^{-3}$ pc, about $10^{-7}$ of a 10 kpc galaxy.`,
    t`(b) $r_s=2GM/c^2\lesssim D\Rightarrow M\lesssim Dc^2/2G=5.3\times10^{40}$ kg $=2.6\times10^{10}M_\odot$.`,
  ],
};

room.encounters.push(...lessons, quiz, ...derivations, ...calcs, boss);
export const rooms = { 'active-galaxies': room };
export const codex = [
  { id: 'fj', group: 'Galaxies and dynamics', title: 'Faber–Jackson and Tully–Fisher', tex: t`\sigma\approx220(L/L_*)^{1/4}\,\mathrm{km/s},\ v_c\approx220(L/L_*)^{0.22}\,\mathrm{km/s}`, meaning: 'Velocity → luminosity → distance.', source: 'Choudhuri (9.4), (9.8)' },
  { id: 'devauc', group: 'Galaxies and dynamics', title: 'Surface-brightness profiles', tex: t`I=I_e\exp\{-7.67[(r/r_e)^{1/4}-1]\},\ I=I_0e^{-r/r_d}`, meaning: 'Ellipticals (de Vaucouleurs) vs spiral disks.', source: 'Choudhuri (9.2)-(9.3)' },
  { id: 'synch', group: 'Radiation processes', title: 'Synchrotron', tex: t`\nu\sim\gamma^2\frac{eB}{2\pi m_e},\ N\propto E^{-p}\Rightarrow f\propto\nu^{-(p-1)/2}`, meaning: 'Power law, polarised.', source: 'Choudhuri (8.69)' },
  { id: 'brems', group: 'Radiation processes', title: 'Thermal bremsstrahlung', tex: t`\epsilon_\nu\propto n_en_iT^{-1/2}e^{-h\nu/k_BT},\ \epsilon=1.4\times10^{-40}\sqrt Tn_en_iZ^2g`, meaning: '∝ n², cut-off at hν ~ kT.', source: 'Choudhuri (8.70)-(8.71)' },
  { id: 'Lx', group: 'Radiation processes', title: 'Cluster scaling', tex: t`L_X\propto\int\rho_g^2T^{1/2}dV,\ T\propto M^{2/3},\ L_X\propto M^{4/3}`, meaning: 'Virial + bremsstrahlung, M ∝ R³.', source: 'HS25 winter Q5' },
  { id: 'var', group: 'Radiation processes', title: 'Variability size limit', tex: t`R\lesssim c\Delta t,\ M\lesssim\frac{Rc^2}{2G}`, meaning: 'Upper limit on the size and black-hole mass.', source: 'HS24 winter Q6' },
  { id: 'superl', group: 'Radiation processes', title: 'Superluminal motion', tex: t`v_\perp=\frac{v\sin\theta}{1-\beta\cos\theta},\ v_{\perp,\max}=\gamma v`, meaning: 'Light-travel-time effect.', source: 'Choudhuri (9.21)' },
];
