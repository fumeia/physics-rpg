// New room: The Nebula Garden (interstellar medium, extinction, star counts, HII regions, 21 cm, Jeans instability).
// Choudhuri 6.1 (star counts, extinction), 6.5-6.8 (ISM phases, diagnostics), 8.3 (Jeans), 8.5 (flux freezing).
import { t, pick, S, exam, choud, P, EQ, INT, PIT, FIG, EXQ, MC } from '../lib.mjs';

const room = {
  id: 'astro-interstellar-medium', region: 'Astro Observatory Ship', title: 'The Nebula Garden', course: 'astrophysics',
  topics: ['extinction and reddening', 'star counts', 'ISM phases', '21 cm line', 'HII regions and Strömgren radius', 'molecular clouds', 'Jeans instability', 'magnetic fields and cosmic rays'],
  sources: [
    choud('Ch. 6.1 (star counts, extinction), 6.5-6.6 (ISM phases, 21 cm, HII regions, molecular clouds), 6.7 (magnetic field, cosmic rays), 6.8, 8.3 (Jeans instability, eqs. 8.20-8.23), 8.5 (flux freezing)'),
    exam('w24', 'open Q3 (star counts), MC 8'), exam('p25', 'open Q4 (Strömgren radius), MC 10, 13'), exam('s24', 'open Q4 (extinction), MC 8, 10'), exam('w25', 'MC 7'),
  ],
  intro: t`Between the stars is not empty space but a thin, layered medium: cold molecular clouds where stars are born, warm atomic hydrogen glowing at 21 cm, bubbles of ionised gas around hot stars, and dust that reddens everything behind it. Every exam asks about at least one of these phases.`,
  encounters: [],
};

const lessons = [
  {
    type: 'lesson', id: 'L1', title: 'Dust: extinction and reddening', tier: 'theory', minutes: 8, xp: 15,
    source: [choud('§6.1.2-6.1.3'), exam('s24', 'open Q4'), exam('p25', 'MC 1')],
    blocks: [
      P(t`Dust grains (~0.1 µm, about 1 % of the ISM mass) absorb and scatter starlight. In magnitudes the dimming is the extinction $A_\lambda=m_{\rm obs}-m_{\rm intrinsic}=1.086\,\tau_\lambda$ (since $2.5\log_{10}e=1.086$). It enters the distance modulus: $m-M=5\log_{10}(d/10\,\mathrm{pc})+A_\lambda$.`),
      EQ(t`A_\lambda=2.5\log_{10}\frac{F_0}{F_{\rm ext}}=1.086\,\tau_\lambda,\qquad E(B-V)=A_B-A_V,\quad A_V\approx3.1\,E(B-V)`, 'Extinction and colour excess (reddening).'),
      INT(t`Grains are comparable in size to optical wavelengths, so they block blue light more than red ($A_\lambda\propto\lambda^{-1}$ roughly): stars behind dust look redder, just like the setting Sun. Infrared and radio pass almost freely, which is why the Galactic centre ($A_V\approx30$ mag, a factor $10^{12}$!) is studied in IR and radio.`),
      P(t`The amount of dust follows the gas: $A_V\propto N_H=\int n_H\,ds$, the hydrogen column. Looking out of the thin disk at Galactic latitude $b$ the column through a uniform slab grows as $1/\sin b$; towards the bulge the HS24 summer exam uses a Gaussian density profile and the cosine rule (boss of the Dynamics Bay).`),
      PIT(t`Extinction always <b>adds</b> magnitudes (fainter). If you forget it you overestimate distances: an unrecognised $A=1$ mag makes you put a star $10^{0.2}=1.6$ times too far away.`),
    ],
    check: [
      MC(t`An extinction $A_V=2.5$ mag means the flux is reduced by a factor of`, ['2.5', '10', '100', t`$e^{2.5}$`], 1, t`$10^{2.5/2.5}=10$.`),
      MC(t`Dust makes background stars look`, ['bluer', 'redder', 'brighter in V', 'unchanged in colour'], 1, 'Blue light is scattered more.'),
    ],
  },
  {
    type: 'lesson', id: 'L2', title: 'Counting stars: the $F^{-3/2}$ law', tier: 'theory', minutes: 8, xp: 15,
    source: [choud('§6.1.1'), exam('w24', 'open Q3')],
    blocks: [
      P(t`If stars of luminosity $L$ are spread uniformly with density $n(L)$, those brighter than flux $F_0$ are the ones closer than $r_0=\sqrt{L/4\pi F_0}$:`),
      EQ(t`N(F>F_0)=n(L)\,\frac43\pi r_0^3=n(L)\,\frac43\pi\left(\frac{L}{4\pi F_0}\right)^{3/2}\propto F_0^{-3/2}`, 'Euclidean number counts. Summing over a luminosity function keeps the same power.'),
      EQ(t`\log_{10}N(<m)=0.6\,m+\mathrm{const}`, 'Same law in magnitudes: each magnitude fainter, 10^0.6 ≈ 4 times more stars.'),
      INT(t`Volume grows as $r^3$, flux falls as $r^{-2}$: so counts grow as $F^{-3/2}$ whatever the luminosities. Herschel and Kapteyn used departures from this law to map the Galaxy: if counts grow more slowly than $F^{-3/2}$ you are either seeing the edge of the stellar system or extinction is hiding the distant stars (Kapteyn's universe was too small and Sun-centred for exactly this reason).`),
      EXQ(t`HS24 winter Q3 (12 pt): (a) derive $N\propto F_0^{-3/2}$; (b) argue it holds for a luminosity distribution; (c) explain a deviation (edge of the Galaxy, extinction, instrumental effects). Boss of this room.`),
    ],
    check: [
      MC(t`In a uniform, transparent, Euclidean distribution of stars, lowering the flux limit by a factor of 4 multiplies the number of stars seen by`, ['4', '8', '16', '2'], 1, t`$4^{3/2}=8$.`),
    ],
  },
  {
    type: 'lesson', id: 'L3', title: 'The phases of the interstellar medium', tier: 'intuition', minutes: 12, xp: 15,
    source: [choud('§6.5-6.6, §6.8'), exam('p25', 'MC 10'), exam('w24', 'MC 8'), exam('s24', 'MC 8')],
    blocks: [
      P(t`The ISM is roughly in pressure balance, $nT\sim10^{9}$–$10^{10}$ K m$^{-3}$, so hotter phases are thinner:`),
      FIG(t`Table of phases (approximate): <b>molecular clouds</b> (H$_2$, traced by CO lines), $T\approx10$–20 K, $n\gtrsim10^{9}$ m$^{-3}$, birthplace of stars. <b>Cold neutral medium / HI clouds</b>, $T\approx80$ K, $n\sim10^{7}$ m$^{-3}$, seen in 21 cm absorption and emission. <b>Warm neutral/ionised medium</b>, $T\approx8000$ K, $n\sim10^{5}$ m$^{-3}$. <b>HII regions</b> around O/B stars, $T\approx10^4$ K, photo-ionised, glowing in H$\alpha$ (recombination lines). <b>Hot coronal gas</b> from supernovae, $T\approx10^6$ K, $n\sim10^{3}$ m$^{-3}$, seen in X-rays and O VI absorption.`),
      INT(t`Spectroscopic notation: HI = neutral hydrogen, HII = ionised hydrogen (the Roman numeral is ionisation stage + 1). An HII region is ionised and ~100 times hotter than an HI cloud (HS25 practice MC10). Stars form in the <b>cold dense</b> molecular clouds because there the Jeans mass is smallest (low $T$, high $\rho$).`),
      P(t`<b>21 cm line:</b> the electron and proton spins in ground-state hydrogen are either parallel (slightly higher energy) or antiparallel. The spin flip emits $\Delta E=5.9\times10^{-6}$ eV, $\nu=1420.4$ MHz, $\lambda=21.1$ cm. Each atom flips only once per ~11 Myr, but there are so many HI atoms along any line of sight that the line is bright, and radio waves pass through dust. Doppler shifts of the 21 cm line map the rotation of the whole Galaxy, including the far side.`),
      PIT(t`The 21 cm line is the hyperfine transition of <b>neutral</b> hydrogen, not recombination in HII regions, not CO rotation, not synchrotron (HS25 winter MC7).`),
    ],
    check: [
      MC(t`The 21 cm line originates from`, ['recombination in ionised hydrogen', 'rotational transitions of CO', 'the hyperfine splitting of the ground state of neutral hydrogen', 'synchrotron radiation'], 2, 'Spin flip of electron relative to proton.', exam('w25', 'MC 7')),
      MC(t`Compared with an HI cloud, an HII region is`, ['ionised and ~100 times hotter', 'neutral and ~100 times hotter', 'ionised and ~100 times cooler', 'of similar temperature but ionised'], 0, t`~80 K vs ≳6000 K.`, exam('p25', 'MC 10')),
      MC(t`Molecular clouds are the birthplace of stars because they are`, ['hot enough for fusion', 'hot enough for fission', 'dense and cold', 'the only ionised regions'], 2, 'Low Jeans mass.', exam('s24', 'MC 8')),
    ],
  },
  {
    type: 'lesson', id: 'L4', title: 'HII regions: the Strömgren sphere', tier: 'theory', minutes: 8, xp: 15,
    source: [choud('§6.6.3'), exam('p25', 'open Q4')],
    blocks: [
      P(t`A hot O/B star emits $N_\gamma$ ionising photons ($h\nu>13.6$ eV) per second. Around it the gas is kept ionised; inside, every recombination is balanced by a photo-ionisation. With recombination coefficient $\alpha$ (recombinations per unit volume per time $=\alpha n_pn_e$), steady state in a sphere of radius $R_s$ gives`),
      EQ(t`\frac43\pi R_s^3\,\alpha n_pn_e=N_\gamma\quad\Rightarrow\quad R_s=\left(\frac{3N_\gamma}{4\pi\alpha n_pn_e}\right)^{1/3}`, 'Strömgren radius (HS25 practice Q4).'),
      INT(t`The edge is sharp: inside, the gas is almost fully ionised and transparent to UV; at $R_s$ the photons are used up within one mean free path of neutral hydrogen (tiny, because the photo-ionisation cross-section is huge). Denser gas recombines faster, so $R_s\propto n^{-2/3}$: an O star in a dense cloud carves a small bubble, in thin gas a huge one.`),
      PIT(t`$n_pn_e=n^2$ for pure hydrogen; do not forget the square. The recombination coefficient $\alpha$ here is a rate coefficient [m$^3$ s$^{-1}$], unrelated to the absorption coefficient of radiative transfer.`),
    ],
    check: [
      MC(t`If the gas density around an O star doubles, the Strömgren radius`, ['doubles', 'halves', t`decreases by $2^{2/3}$`, 'is unchanged'], 2, t`$R_s\propto n^{-2/3}$.`),
    ],
  },
  {
    type: 'lesson', id: 'L5', title: 'Jeans instability: when gravity beats pressure', tier: 'theory', minutes: 12, xp: 20,
    source: [choud('§8.3, eqs. (8.15)-(8.23)'), exam('s24', 'MC 10'), exam('p25', 'MC 13')],
    blocks: [
      P(t`Perturb a uniform, static gas of density $\rho_0$ and sound speed $c_s$ by a small density wave $\propto e^{i(kx-\omega t)}$. Linearising continuity, Euler and Poisson equations gives the dispersion relation`),
      EQ(t`\omega^2=c_s^2\left(k^2-k_J^2\right),\qquad k_J^2=\frac{4\pi G\rho_0}{c_s^2}`, 'Choudhuri (8.20)-(8.21).'),
      P(t`For $k>k_J$ (short waves): $\omega$ real, the perturbation <b>oscillates</b> as a sound wave: pressure wins. For $k<k_J$ (long waves): $\omega=\pm i\alpha$, one mode grows as $e^{\alpha t}$: gravitational collapse. The critical mass is a sphere of diameter $\lambda_J=2\pi/k_J$:`),
      EQ(t`M_J=\frac43\pi\lambda_J^3\rho_0=\frac43\pi^{5/2}\left(\frac{k_BT}{Gm}\right)^{3/2}\frac{1}{\rho_0^{1/2}}\quad(\text{isothermal }c_s^2=k_BT/m)`, '(8.23). Collapse if M > M_J.'),
      INT(t`Compare two times: the sound crossing time $\lambda/c_s$ (how fast pressure can react) and the free-fall time $1/\sqrt{G\rho}$ (how fast gravity pulls). Big clouds cannot communicate pressure fast enough and collapse. Cold (small $c_s$) and dense regions have small Jeans masses: that is why stars form in molecular cloud cores. As a cloud collapses isothermally $\rho$ rises, $M_J$ drops and the cloud fragments into smaller pieces: clusters of stars, not single giants.`),
      PIT(t`Directions: stability (pressure wins, oscillation) is $|k|>k_J$, i.e. $\lambda<\lambda_J$, and $M<M_J$ (HS25 practice MC13). Growth/collapse is $\lambda>\lambda_J$. In an expanding universe the growth becomes a power law in $t$ instead of exponential (structure formation, Ch. 11).`),
    ],
    check: [
      MC(t`In the Jeans analysis (non-expanding fluid) a mode with $\lambda<\lambda_J$`, ['grows or decays exponentially', 'grows or decays logarithmically', 'oscillates', 'remains constant'], 2, 'Pressure wins: sound wave.', exam('s24', 'MC 10')),
      MC(t`Pressure dominates over gravity, preventing collapse, on scales where`, [t`$|k|<k_J$ and $M<M_J$`, t`$|k|>k_J$ and $M<M_J$`, t`$|k|<k_J$ and $M>M_J$`, t`$|k|\simeq k_J$ and $M\simeq M_J$`], 1, t`$M_J\propto\lambda_J^3\propto k_J^{-3}$.`, exam('p25', 'MC 13')),
    ],
  },
  {
    type: 'lesson', id: 'L6', title: 'Magnetic fields and cosmic rays (flux freezing)', tier: 'intuition', minutes: 6, xp: 10,
    source: [choud('§6.7, §8.4-8.5 (induction equation 8.27, magnetic Reynolds number 8.31)')],
    blocks: [
      EQ(t`\frac{\partial\mathbf B}{\partial t}=\nabla\times(\mathbf v\times\mathbf B)+\eta\nabla^2\mathbf B,\qquad R_M\approx\frac{VL}{\eta}`, 'Induction equation and magnetic Reynolds number.'),
      INT(t`Because astrophysical $L$ is enormous, $R_M\gg1$ and diffusion is negligible: the field lines are <b>frozen into</b> the plasma and move with it (Alfvén). A collapsing cloud drags its field along and amplifies it ($B\propto R^{-2}$); this is how neutron stars get $10^8$ T fields. The Galactic field is only a few $\times10^{-10}$ T (a few µG), yet cosmic rays (relativistic protons and electrons, accelerated in supernova shocks) spiral along it, emitting synchrotron radiation (radio).`),
    ],
    check: [
      MC(t`Flux freezing in astrophysical plasmas holds because`, ['the conductivity is zero', 'the magnetic Reynolds number is huge (large length scales)', 'magnetic fields are weak', 'the plasma is neutral'], 1, t`$R_M\propto L$.`),
    ],
  },
];

const quiz = {
  type: 'quiz', id: 'Q1', title: 'Nebula Garden multiple choice', xp: 30, passMark: 0.75,
  source: [exam('w25', 'MC'), exam('w24', 'MC'), exam('p25', 'MC'), exam('s24', 'MC')],
  questions: [
    MC(t`The 21 cm line is due to`, ['recombination in HII', 'CO rotation', 'hyperfine splitting of neutral H ground state', 'synchrotron'], 2, 'Spin flip.', exam('w25', 'MC 7')),
    MC(t`Molecular clouds in the ISM are`, ['regions of ionised hydrogen', 'hot diffuse star-forming regions', 'cool dense star-forming regions', 'regions where stars cannot form'], 2, 'Cold, dense, molecular.', exam('w24', 'MC 8')),
    MC(t`Molecular clouds are birthplaces of stars because they are`, ['dense and cold', 'hot enough for fusion', 'hot enough for fission', 'the only ionised regions'], 0, 'Small Jeans mass.', exam('s24', 'MC 8')),
    MC(t`An HII region, compared with an HI cloud, is`, ['ionised, ~100× hotter', 'neutral, ~100× hotter', 'ionised, ~100× cooler', 'same T, ionised'], 0, '80 K vs ~10⁴ K.', exam('p25', 'MC 10')),
    MC(t`A Jeans-analysis mode with $\lambda<\lambda_J$`, ['grows/decays exponentially', 'grows/decays logarithmically', 'oscillates', 'stays constant'], 2, 'Sound wave.', exam('s24', 'MC 10')),
    MC(t`Pressure prevents collapse where`, [t`$|k|<k_J$, $M<M_J$`, t`$|k|>k_J$, $M<M_J$`, t`$|k|<k_J$, $M>M_J$`, t`$|k|\simeq k_J$`], 1, 'Small scales.', exam('p25', 'MC 13')),
    MC(t`Star counts growing more slowly than $F_0^{-3/2}$ towards faint fluxes indicate`, ['a uniform infinite distribution', 'the edge of the stellar distribution or extinction', 'that all stars have the same luminosity', 'that the Sun is at the centre of the Galaxy'], 1, 'Non-uniform density or absorption.', exam('w24', 'open Q3c')),
  ],
};

const derivations = [
  {
    type: 'derive', id: 'D1', title: 'Strömgren radius from photon balance', xp: 25,
    source: exam('p25', 'open Q4 [6 pt]'),
    goal: t`Derive $R_s=\left(\frac{3N_\gamma}{4\pi\alpha n_pn_e}\right)^{1/3}$ for a spherical steady-state HII region.`,
    given: [t`$\alpha n_pn_e$ = recombinations per unit volume per unit time`, t`$N_\gamma$ = ionising photons per second`],
    steps: [
      { prompt: 'Recombinations per unit time in the whole sphere.', reveal: t`$\frac43\pi R_s^3\,\alpha n_pn_e$.` },
      { prompt: 'Ionisations per unit time.', reveal: t`Every ionising photon is eventually absorbed inside the region: $N_\gamma$.` },
      { prompt: 'Steady state.', reveal: t`Equate and solve: $R_s=\left(\frac{3N_\gamma}{4\pi\alpha n_pn_e}\right)^{1/3}$.` },
    ],
    keyPoints: ['volume times recombination rate density', 'steady state: ionisations = recombinations', 'solve for $R_s$'],
  },
  {
    type: 'derive', id: 'D2', title: 'Jeans dispersion relation', xp: 35,
    source: choud('§8.3, eqs. (8.16)-(8.21)'),
    goal: t`Linearise $\partial_t\rho+\nabla\cdot(\rho\mathbf v)=0$, $\partial_t\mathbf v+(\mathbf v\cdot\nabla)\mathbf v=-\nabla P/\rho-\nabla\Phi$, $\nabla^2\Phi=4\pi G\rho$ about a static uniform background and derive $\omega^2=c_s^2k^2-4\pi G\rho_0$.`,
    given: [t`$P=P(\rho)$ with $dP/d\rho=c_s^2$`, t`Jeans swindle: ignore the background potential`],
    steps: [
      { prompt: 'Write the first-order equations.', reveal: t`$\partial_t\rho_1+\rho_0\nabla\cdot\mathbf v_1=0$, $\partial_t\mathbf v_1=-\frac{c_s^2}{\rho_0}\nabla\rho_1-\nabla\Phi_1$, $\nabla^2\Phi_1=4\pi G\rho_1$.` },
      { prompt: 'Eliminate v and Φ.', reveal: t`Take $\partial_t$ of continuity and the divergence of Euler: $\partial_t^2\rho_1=c_s^2\nabla^2\rho_1+4\pi G\rho_0\rho_1$.` },
      { prompt: 'Insert a plane wave.', reveal: t`$\rho_1\propto e^{i(kx-\omega t)}$: $-\omega^2=-c_s^2k^2+4\pi G\rho_0$, so $\omega^2=c_s^2(k^2-k_J^2)$ with $k_J^2=4\pi G\rho_0/c_s^2$.` },
      { prompt: 'Interpret.', reveal: t`$k>k_J$: sound waves. $k<k_J$: $\omega$ imaginary, exponential growth with rate $\alpha=c_s\sqrt{k_J^2-k^2}\to\sqrt{4\pi G\rho_0}$ for long waves (free-fall rate).` },
    ],
    keyPoints: ['linearised equations', 'wave equation with gravity source term', 'dispersion relation', 'stability criterion'],
  },
];

const calcs = [
  {
    type: 'calc', id: 'c1', title: 'Strömgren sphere around an O star', fight: 'normal', xp: 30,
    problem: t`An O star emits $N_\gamma=10^{49}$ ionising photons per second into hydrogen of density $n=10^7$ m$^{-3}$ (10 cm$^{-3}$). Recombination coefficient $\alpha=2.6\times10^{-19}$ m$^3$ s$^{-1}$.`,
    vars: { ...pick('pc', 'yr'), Ng: 1e49, n: 1e7, al: 2.6e-19 },
    steps: [
      S('Rs', t`Strömgren radius in pc.`, '(3*Ng/(4*pi*al*n^2))^(1/3)/pc', 'pc', ['pc', 'm', 'AU', 'kpc'], 0.02, t`$n_pn_e=n^2=10^{14}$ m$^{-6}$.`),
      S('trec', t`Recombination time $1/(\alpha n)$ in years.`, '1/(al*n)/yr', 'yr', ['yr', 's', 'Myr', 'Gyr'], 0.02, t`$\approx1.2\times10^4$ yr: short compared with the O star's few-Myr life, so the steady state is reached.`),
      S('R2', t`Strömgren radius if the density were $10^9$ m$^{-3}$ (a dense cloud), in pc.`, '(3*Ng/(4*pi*al*(100*n)^2))^(1/3)/pc', 'pc', ['pc', 'm', 'AU', 'kpc'], 0.02, t`$R_s\propto n^{-2/3}$: 100 times denser, $100^{2/3}=21.5$ times smaller.`),
    ],
  },
  {
    type: 'calc', id: 'c2', title: 'Jeans masses of the ISM', fight: 'normal', xp: 30,
    problem: t`$M_J=\frac43\pi^{5/2}\left(\frac{k_BT}{Gm}\right)^{3/2}\rho_0^{-1/2}$ (Choudhuri (8.23)). (a) Diffuse HI: $n=10^6$ m$^{-3}$ of H atoms ($m=m_p$), $T=100$ K. (b) Molecular cloud core: $n=10^{10}$ m$^{-3}$ of particles with $m=2.33\,m_p$ (H$_2$ + He), $T=10$ K.`,
    vars: { ...pick('kB', 'G', 'mp', 'Msun'), n1: 1e6, T1: 100, n2: 1e10, T2: 10, mu2: 2.33 },
    steps: [
      S('MJ1', t`(a) Jeans mass in kg (enter e.g. 8e35).`, '4/3*pi^2.5*(kB*T1/(G*mp))^1.5/sqrt(n1*mp)', 'kg', ['kg', 'M_sun', 'kg m^-3', 'pc'], 0.03, t`Choudhuri's example: $\approx8\times10^{35}$ kg, i.e. $4\times10^5M_\odot$: a whole cluster.`),
      S('MJ1s', t`(a) in solar masses.`, 'MJ1/Msun', 'M_sun', ['M_sun', 'kg', 'kg m^-3', 'pc'], 0.03, t`Divide by $1.99\times10^{30}$ kg.`),
      S('MJ2', t`(b) Jeans mass of the cold core in solar masses.`, '4/3*pi^2.5*(kB*T2/(G*mu2*mp))^1.5/sqrt(n2*mu2*mp)/Msun', 'M_sun', ['M_sun', 'kg', 'kg m^-3', 'pc'], 0.03, t`$T$ 10× lower and $\rho$ $2.3\times10^4$× higher: $M_J$ drops by a factor $\sim2\times10^4$ to about $20M_\odot$; as the core keeps collapsing $\rho$ rises further and it fragments into star-sized pieces.`),
    ],
  },
  {
    type: 'calc', id: 'c3', title: 'Quick fight: star counts', fight: 'fermi', xp: 15,
    problem: t`A survey reaches 3 magnitudes deeper than an older one. In a uniform transparent distribution, by what factor does the number of stars grow? Within 25 %.`,
    vars: { dm: 3 },
    steps: [S('f', t`Factor.`, '10^(0.6*dm)', 'dimensionless', ['dimensionless', 'mag', 'pc', 'W m^-2'], 0.1, t`3 mag = flux factor $10^{1.2}$; counts $\propto F^{-3/2}$: $10^{1.8}\approx63$.`, { tolType: 'log' })],
  },
  {
    type: 'calc', id: 'c4', title: 'The 21 cm line', fight: 'normal', xp: 20,
    problem: t`The hydrogen hyperfine transition has $\nu=1420.406$ MHz. $h=6.626\times10^{-34}$ J s, $1$ eV $=1.602\times10^{-19}$ J.`,
    vars: { ...pick('h', 'c', 'eV', 'kB'), nu: 1420.406e6 },
    steps: [
      S('lam', t`Wavelength in cm.`, 'c/nu*100', 'cm', ['cm', 'm', 'mm', 'nm'], 0.01, t`$c/\nu$.`),
      S('E', t`Photon energy in µeV.`, 'h*nu/eV*1e6', 'µeV', ['µeV', 'eV', 'meV', 'K'], 0.01, t`$\approx5.9$ µeV.`),
      S('T', t`Equivalent temperature $h\nu/k_B$ in K.`, 'h*nu/kB', 'K', ['K', 'mK', 'µeV', 'eV'], 0.01, t`0.068 K: even 10 K gas has both levels populated in the statistical-weight ratio 3:1.`),
    ],
  },
];

const boss = {
  type: 'boss', id: 'b1', title: 'Boss: star counts (exam problem)', xp: 120, minutes: 20,
  source: exam('w24', 'Open Question 3 [12 pt]'),
  instructions: 'Solve on paper under the timer, then enter the final numbers. Parts (b) and (c) are graded by you against the key points.',
  statement: [
    t`Suppose that, in our region of the galaxy, the number density $n(L)$ of stars with a particular luminosity $L$ is independent of position.`,
    t`(a) [6 pt] Show that the number of stars with luminosity $L$ observed to have a flux greater than some flux $F_0$ obeys $N(F>F_0)\propto F_0^{-3/2}$. Hint: $N(F>F_0)$ is proportional to the volume of the sphere centred on us, with a radius at which the flux from a star with luminosity $L$ is $F_0$.`,
    t`(b) [4 pt] Explain why the same behaviour will occur if the stars have a distribution of luminosities.`,
    t`(c) [2 pt] If we observed that $N(F>F_0)$ does not grow with decreasing $F_0$ according to the relation in (a), what could be the reason?`,
  ],
  finalAnswers: [
    { id: 'x10', prompt: t`Using (a): factor by which $N$ grows when $F_0$ is lowered 10 times.`, answer: '10**1.5', vars: {}, tol: 0.02 },
    { id: 'r0', prompt: t`Radius $r_0$ (in pc) out to which a Sun-like star ($L=3.828\times10^{26}$ W) is brighter than $F_0=10^{-12}$ W m$^{-2}$.`, answer: 'sqrt(L/(4*pi*F0))/pc', vars: { L: 3.828e26, F0: 1e-12, pc: 3.085677581e16 }, tol: 0.02 },
  ],
  keyPoints: [
    t`(a) $F=L/4\pi r^2\Rightarrow r_0=(L/4\pi F_0)^{1/2}$; $N=n(L)\frac43\pi r_0^3=n(L)\frac43\pi(L/4\pi F_0)^{3/2}\propto F_0^{-3/2}$.`,
    t`(b) $N=\int dL\,\frac{dn}{dL}\frac43\pi(L/4\pi F_0)^{3/2}\propto F_0^{-3/2}\int dL\frac{dn}{dL}L^{3/2}$: the $F_0$ dependence factors out of the integral.`,
    t`(c) $n(L)$ not independent of position (we reach the edge of the Galaxy/disk), extinction by dust, or observational/instrumental incompleteness.`,
  ],
};

room.encounters.push(...lessons, quiz, ...derivations, ...calcs, boss);
export const rooms = { 'interstellar-medium': room };
export const codex = [
  { id: 'Aext', group: 'Interstellar medium', title: 'Extinction and reddening', tex: t`A_\lambda=1.086\,\tau_\lambda,\ E(B-V)=A_B-A_V,\ A_V\approx3.1E(B-V)`, meaning: 'Dust dims (adds magnitudes) and reddens.', source: 'Choudhuri §6.1' },
  { id: 'counts', group: 'Interstellar medium', title: 'Euclidean star counts', tex: t`N(F>F_0)\propto F_0^{-3/2},\ \log N(<m)=0.6m+\mathrm{const}`, meaning: 'Uniform transparent distribution; deviations mean edges or extinction.', source: 'HS24 winter Q3' },
  { id: 'strom', group: 'Interstellar medium', title: 'Strömgren radius', tex: t`R_s=\left(\frac{3N_\gamma}{4\pi\alpha n_pn_e}\right)^{1/3}`, meaning: 'Size of an HII region; ∝ n^{-2/3}.', source: 'HS25 practice Q4' },
  { id: '21cm', group: 'Interstellar medium', title: '21 cm line', tex: t`\nu=1420.4\,\mathrm{MHz},\ \Delta E=5.9\,\mu\mathrm{eV}`, meaning: 'Hyperfine spin flip of neutral H; maps HI and Galactic rotation.', source: 'HS25 winter MC7' },
  { id: 'jeans', group: 'Interstellar medium', title: 'Jeans criterion', tex: t`\omega^2=c_s^2(k^2-k_J^2),\ k_J^2=\frac{4\pi G\rho_0}{c_s^2},\ M_J=\frac43\pi^{5/2}\left(\frac{k_BT}{Gm}\right)^{3/2}\rho_0^{-1/2}`, meaning: 'λ > λ_J (M > M_J) collapses; smaller scales oscillate.', source: 'Choudhuri (8.20)-(8.23)' },
  { id: 'induct', group: 'Interstellar medium', title: 'Flux freezing', tex: t`R_M=VL/\eta\gg1\Rightarrow B\ \text{moves with the plasma}`, meaning: 'Collapse amplifies B ∝ R^{-2}.', source: 'Choudhuri (8.27), (8.31)' },
];
