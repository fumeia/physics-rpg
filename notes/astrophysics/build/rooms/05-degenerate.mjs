// New room: Degenerate Matter (Choudhuri Ch. 5): Fermi gas pressure, white dwarfs, Chandrasekhar, neutron stars,
// pulsars, accretion. Also the astro side of the cross-region "Degenerate Matter" boss (QM box counting, SS Fermi gas).
import { t, pick, S, exam, choud, P, EQ, INT, PIT, FIG, EXQ, MC } from '../lib.mjs';

const room = {
  id: 'astro-degenerate-matter', region: 'Astro Observatory Ship', title: 'The Degenerate Vault', course: 'astrophysics',
  topics: ['Fermi gas', 'degeneracy pressure', 'white dwarfs', 'Chandrasekhar mass', 'neutron stars', 'pulsars', 'accretion'],
  sources: [
    choud('Ch. 5.2 (degeneracy pressure, eqs. 5.1-5.12, Fig. 5.1), 5.3 (polytropes, Lane–Emden 5.13-5.28, R ∝ M^{-1/3}, M_Ch = 1.46 (2/μe)^2 M_sun), 5.4 (neutron stars), 5.5 (pulsars), 5.6 (accretion disks)'),
    exam('w25', 'open Q6 and MC 6 (Eddington, accretion)'),
    { file: 'notes/syllabus.md', where: 'Cross-region: Degenerate Matter boss (QM Ch. 2-3 box counting, SS Ch. 3.1 Fermi gas)' },
  ],
  intro: t`When fusion ends, gravity wins, unless quantum mechanics stops it. In the Vault you squeeze electrons until the Pauli principle pushes back, find the mass at which even that fails, and spin up a neutron star.`,
  encounters: [],
};

const lessons = [
  {
    type: 'lesson', id: 'L1', title: 'Degeneracy pressure: Pauli versus gravity', tier: 'theory', minutes: 15, xp: 20,
    source: [choud('§5.2, eqs. (5.2)-(5.12)')],
    blocks: [
      P(t`Electrons are fermions: each phase-space cell of volume $h^3$ holds at most 2 (spin up and down). At high density even at $T=0$ all states up to the Fermi momentum $p_F$ are filled:`),
      EQ(t`n_e=\frac{8\pi}{3h^3}p_F^3,\qquad n_e=\frac{\rho}{\mu_em_H},\quad\mu_e=\frac{2}{1+X}`, '(5.2), (5.6)-(5.7): μe = 2 for He, C, O (white dwarf matter).'),
      P(t`The pressure is the momentum flux $P=\frac13\int n(p)\,v\,p\,dp$. Two limits:`),
      EQ(t`\text{non-rel.: }P=K_1\rho^{5/3},\ K_1=\frac{1.00\times10^7}{\mu_e^{5/3}}\qquad\text{rel.: }P=K_2\rho^{4/3},\ K_2=\frac{1.24\times10^{10}}{\mu_e^{4/3}}\quad(\mathrm{SI})`, '(5.9)-(5.12). Relativistic when p_F ≳ m_e c, i.e. ρ ≳ 2×10⁹ kg m⁻³ for μe = 2.'),
      INT(t`Squeeze an electron into a smaller box and its momentum must grow ($\Delta x\Delta p\gtrsim\hbar$, the particle-in-a-box energy $\propto1/L^2$). This "zero-point" motion is a pressure that needs no temperature. It is the same Fermi gas you meet in solid state (electrons in a metal, $E_F\sim$ eV) and in QM (filling box states) — only $10^6$ times denser.`),
      PIT(t`Degeneracy pressure comes from the <b>electrons</b>: at the same number density they have the same $p_F$ as the nuclei would, but pressure is a momentum flux $\sim p_Fv_F=p_F^2/m$, so the light electrons win by $m_p/m_e\approx2000$. The <b>nuclei</b> provide the mass, hence $\mu_e$ (mass per electron). The pressure does not depend on $T$: a white dwarf can cool forever without shrinking.`),
    ],
    check: [
      MC(t`In the non-relativistic limit, degeneracy pressure scales with density as`, [t`$\rho$`, t`$\rho^{4/3}$`, t`$\rho^{5/3}$`, t`$\rho^2$`], 2, t`$P\propto p_F^5/m_e\propto n^{5/3}$.`),
      MC(t`For a carbon–oxygen white dwarf the mean molecular weight per electron $\mu_e$ is`, ['1', '2', '12', '1/2'], 1, 'Half as many electrons as nucleons.'),
    ],
  },
  {
    type: 'lesson', id: 'L2', title: 'White dwarfs and the Chandrasekhar limit', tier: 'theory', minutes: 12, xp: 20,
    source: [choud('§5.3, eqs. (5.14)-(5.28), Fig. 5.2')],
    blocks: [
      P(t`With $P=K\rho^{1+1/n}$ (a polytrope) hydrostatic equilibrium plus Poisson becomes the Lane–Emden equation; its scaling gives $R\propto\rho_c^{(1-n)/2n}$ and $M\propto\rho_c^{(3-n)/2n}$ (5.22)-(5.24).`),
      EQ(t`n=\tfrac32\ (\text{non-rel.}):\ R\propto M^{-1/3}\qquad n=3\ (\text{rel.}):\ M=M_{Ch}=1.46\left(\frac{2}{\mu_e}\right)^2M_\odot\approx1.4M_\odot`, 'Mass–radius relation (5.25) and the Chandrasekhar mass (5.27)-(5.28).'),
      INT(t`Quick version: hydrostatic equilibrium needs $P\sim GM^2/R^4$. Non-relativistic degeneracy gives $P\sim K_1M^{5/3}/R^5$: equate, $R\sim K_1/(GM^{1/3})$. <b>More massive white dwarfs are smaller.</b> As $M$ grows the electrons become relativistic and $P\sim K_2M^{4/3}/R^4$: now both sides scale as $R^{-4}$, the radius drops out, and equilibrium is possible for only one mass, $M\sim(K_2/G)^{3/2}$. Above it nothing stops collapse.`),
      FIG(t`Choudhuri Fig. 5.2: radius against mass. The non-relativistic curve $R\propto M^{-1/3}$ continues forever, but the full (relativistic) curve bends down and hits $R=0$ at $M_{Ch}\approx1.4M_\odot$. A $0.6M_\odot$ white dwarf is about the size of the Earth ($\sim10^4$ km).`),
      PIT(t`The Chandrasekhar limit comes from electrons becoming <b>relativistic</b>, not from neutron formation. It depends on composition through $\mu_e^{-2}$ only.`),
    ],
    check: [
      MC(t`Adding mass to a (non-relativistic) white dwarf makes it`, ['larger', 'smaller', 'unchanged in size', 'hotter and larger'], 1, t`$R\propto M^{-1/3}$.`),
      MC(t`The Chandrasekhar mass exists because, in the relativistic limit,`, ['radiation pressure dominates', t`degeneracy and gravitational pressure both scale as $R^{-4}$`, 'neutrons appear', 'the star becomes convective'], 1, 'The radius drops out of the balance.'),
    ],
  },
  {
    type: 'lesson', id: 'L3', title: 'Neutron stars and pulsars', tier: 'intuition', minutes: 10, xp: 15,
    source: [choud('§5.4 (neutron drip, 5.29-5.31), §5.5 (pulsars)')],
    blocks: [
      P(t`Above about $10^{12}$–$10^{14}$ kg m$^{-3}$ it becomes energetically favourable for electrons to combine with protons ($p+e\to n+\nu$, inverse beta decay): matter turns into neutrons. Neutron degeneracy pressure (and nuclear forces) support a <b>neutron star</b>: $M\approx1.4M_\odot$ in $R\approx10$ km, density $\sim10^{18}$ kg m$^{-3}$, a giant nucleus. Above $\sim2$–3$M_\odot$ nothing can hold: black hole.`),
      P(t`<b>Pulsars</b> (Bell & Hewish 1967): radio pulses with periods from 1.4 ms to seconds, extremely regular and slowly lengthening. A rotating object cannot spin faster than breakup, $\Omega^2R<GM/R^2$, so $P>2\pi\sqrt{R^3/GM}$. For a white dwarf that is ~10 s; for a neutron star ~0.5 ms. Only neutron stars can be pulsars. The beam comes from the magnetic poles of a magnetised, rotating neutron star (lighthouse model).`),
      INT(t`Collapse conserves angular momentum ($\Omega R^2$) and magnetic flux ($BR^2$): shrink the Sun to 10 km and its rotation goes from a month to milliseconds and its field from $10^{-4}$ T to $10^{8}$ T. The pulsar's radiation is paid for by its rotational energy: $L=-\frac{d}{dt}\frac12I\Omega^2=4\pi^2I\dot P/P^3$. The Crab pulsar's spin-down powers the whole Crab nebula.`),
    ],
    check: [
      MC(t`Why can pulsars with $P\sim1$ ms not be white dwarfs?`, ['white dwarfs have no magnetic field', 'a white dwarf would be torn apart by rotation that fast', 'white dwarfs are too hot', 'white dwarfs do not emit radio waves'], 1, t`Breakup period $2\pi\sqrt{R^3/GM}\sim10$ s for a white dwarf.`),
    ],
  },
  {
    type: 'lesson', id: 'L4', title: 'Accretion: the most efficient engine', tier: 'intuition', minutes: 8, xp: 15,
    source: [choud('§5.6 (binary X-ray sources, accretion disks), §9.4 (AGN)'), exam('w25', 'open Q6')],
    blocks: [
      EQ(t`L_{\rm acc}=\frac{GM\dot M}{R}=\eta\dot Mc^2,\qquad\eta=\frac{GM}{Rc^2}`, 'Matter falling onto a compact object radiates its potential energy.'),
      P(t`For a neutron star $\eta\approx0.1$–0.2, for a black hole (disk down to the innermost stable orbit) $\eta\approx0.06$–0.4: ten to fifty times more efficient than hydrogen fusion (0.007). Gas with angular momentum cannot fall straight in; it forms an <b>accretion disk</b> where viscosity transports angular momentum out and lets mass spiral in, heating the inner disk to X-ray temperatures.`),
      INT(t`Accretion luminosity is capped by the Eddington limit: if $L>L_{Edd}$ radiation pressure stops the infall. So the maximum accretion rate is $\dot M_{Edd}=L_{Edd}/(\eta c^2)$, which sets the maximum growth rate of black holes (Salpeter time, HS25 winter Q6).`),
    ],
    check: [
      MC(t`Compared with hydrogen fusion, accretion onto a neutron star converts rest mass to energy`, ['10 to 30 times less efficiently', 'equally efficiently', 'about 10 to 30 times more efficiently', 'with 100 % efficiency'], 2, t`$GM/Rc^2\approx0.2$ vs 0.007.`),
    ],
  },
];

const quiz = {
  type: 'quiz', id: 'Q1', title: 'Degenerate Vault multiple choice', xp: 25, passMark: 0.75,
  source: [choud('Ch. 5'), exam('w25', 'MC 6')],
  questions: [
    MC(t`White dwarfs are supported against gravity by`, ['thermal pressure of ions', 'radiation pressure', 'electron degeneracy pressure', 'neutron degeneracy pressure'], 2, 'Fowler 1926.'),
    MC(t`The Chandrasekhar mass for $\mu_e=2$ is about`, [t`$0.6M_\odot$`, t`$1.4M_\odot$`, t`$3M_\odot$`, t`$8M_\odot$`], 1, t`$1.46(2/\mu_e)^2M_\odot$.`),
    MC(t`A typical neutron star has radius`, ['10 m', '10 km', '10⁴ km', '1 R☉'], 1, 'Nuclear density.'),
    MC(t`Pulsar periods slowly increase because`, ['the star accretes mass', 'rotational energy is radiated away', 'the magnetic field grows', 'the star cools'], 1, t`$L=I\Omega|\dot\Omega|$.`),
    MC(t`The upper mass limit of main-sequence stars is due to`, ['small optical depth', 'H depletion', 'cosmic rays', 'radiation pressure beating gravity'], 3, 'Eddington limit.', exam('w25', 'MC 6')),
  ],
};

const derivations = [
  {
    type: 'derive', id: 'D1', title: 'White dwarf mass–radius relation and the Chandrasekhar mass by scaling', xp: 35,
    source: choud('§5.3 (scaling version of 5.22-5.28)'),
    goal: t`Using only $P\sim GM^2/R^4$ (hydrostatic equilibrium), $\rho\sim M/R^3$ and $P=K\rho^{\gamma}$, show $R\propto M^{-1/3}$ for $\gamma=5/3$ and that $\gamma=4/3$ allows only one mass.`,
    given: [t`$P=K_1\rho^{5/3}$ or $K_2\rho^{4/3}$`],
    steps: [
      { prompt: 'Non-relativistic case.', reveal: t`$\frac{GM^2}{R^4}\sim K_1\frac{M^{5/3}}{R^5}\Rightarrow R\sim\frac{K_1}{G}M^{-1/3}$.` },
      { prompt: 'Relativistic case.', reveal: t`$\frac{GM^2}{R^4}\sim K_2\frac{M^{4/3}}{R^4}$: $R$ cancels, $M^{2/3}\sim K_2/G$, so $M\sim(K_2/G)^{3/2}$.` },
      { prompt: 'Interpret.', reveal: t`If $M<M_{Ch}$ the star shrinks until electrons are partly relativistic and a balance is found; if $M>M_{Ch}$ contraction raises gravity and degeneracy pressure equally fast and never catches up: collapse. The exact Lane–Emden coefficient gives $1.46(2/\mu_e)^2M_\odot$.` },
    ],
    keyPoints: ['$R\\propto M^{-1/3}$', 'radius drops out for $\\gamma=4/3$', '$M_{Ch}\\sim(K_2/G)^{3/2}$'],
  },
];

const calcs = [
  {
    type: 'calc', id: 'c1', title: 'When do white-dwarf electrons go relativistic?', fight: 'normal', xp: 30,
    problem: t`Electrons become relativistic when $p_F\approx m_ec$. Use $n_e=\frac{8\pi}{3h^3}p_F^3$ and $\rho=\mu_em_Hn_e$ with $\mu_e=2$, $m_H\approx m_p$.`,
    vars: { ...pick('h', 'me', 'c', 'mp'), mue: 2 },
    steps: [
      S('ne', t`Electron density at $p_F=m_ec$ in m$^{-3}$ (enter e.g. 5.9e35).`, '8*pi/(3*h^3)*(me*c)^3', 'm^-3', ['m^-3', 'kg m^-3', 'm^-2', 'm^3'], 0.02, t`$(m_ec)^3=(2.73\times10^{-22})^3$ kg$^3$m$^3$s$^{-3}$; divide by $h^3$.`),
      S('rho', t`Corresponding density in kg m$^{-3}$ (enter e.g. 2e9).`, 'mue*mp*ne', 'kg m^-3', ['kg m^-3', 'm^-3', 'g', 'kg'], 0.02, t`Two nucleon masses per electron: $\approx2\times10^9$ kg m$^{-3}$ (a teaspoon weighs 10 tonnes).`),
    ],
  },
  {
    type: 'calc', id: 'c2', title: 'Order-of-magnitude white dwarf and Chandrasekhar mass', fight: 'fermi', xp: 25,
    problem: t`Use Choudhuri's constants $K_1=1.00\times10^7/\mu_e^{5/3}$, $K_2=1.24\times10^{10}/\mu_e^{4/3}$ (SI), $\mu_e=2$, and the crude balances $R\sim K_1/(GM^{1/3})$ and $M\sim(K_2/G)^{3/2}$. Factor-of-1.3 accuracy expected relative to these formulas.`,
    vars: { ...pick('G', 'Msun'), mue: 2, M: 0.6 },
    steps: [
      S('R', t`Radius of a $0.6M_\odot$ white dwarf in km.`, '1e7/mue^(5/3)/(G*(M*Msun)^(1/3))/1e3', 'km', ['km', 'm', 'R_sun', 'pc'], 0.1, t`$K_1=3.15\times10^6$; $(1.19\times10^{30})^{1/3}=1.06\times10^{10}$. Gives a few thousand km: Earth-sized (real value ~$9\times10^3$ km).`, { tolType: 'log' }),
      S('Mch', t`Mass scale $(K_2/G)^{3/2}$ in $M_\odot$.`, '(1.24e10/mue^(4/3)/G)^1.5/Msun', 'M_sun', ['M_sun', 'kg', 'km', 'L_sun'], 0.1, t`$\approx0.3M_\odot$: the crude scaling misses the Lane–Emden factor ($\xi_1^2|\theta'|$ etc.) that brings it to $1.46M_\odot$, but the order of magnitude and the physics are right.`, { tolType: 'log' }),
    ],
  },
  {
    type: 'calc', id: 'c3', title: 'A neutron star up close', fight: 'normal', xp: 30,
    problem: t`Neutron star with $M=1.4M_\odot$, $R=10$ km.`,
    vars: { ...pick('G', 'Msun', 'c'), M: 1.4, R: 1e4 },
    steps: [
      S('rho', t`Mean density in units of $10^{17}$ kg m$^{-3}$.`, 'M*Msun/(4/3*pi*R^3)/1e17', '10^17 kg m^-3', ['10^17 kg m^-3', 'kg', 'm^-3', 'g'], 0.02, t`$\approx6.6\times10^{17}$ kg m$^{-3}$, about 3 times nuclear density.`),
      S('eta', t`Compactness $GM/(Rc^2)$ (= accretion efficiency).`, 'G*M*Msun/(R*c^2)', 'dimensionless', ['dimensionless', 'm/s', 'J', 'c'], 0.02, t`$\approx0.21$: relativity matters (Schwarzschild radius 4.1 km).`),
      S('vesc', t`Escape velocity in units of $c$.`, 'sqrt(2*eta)', 'c', ['c', 'km/s', 'm', 'm/s'], 0.02, t`$\sqrt{2GM/R}/c=\sqrt{2\eta}\approx0.64$.`),
      S('Pmin', t`Breakup (minimum) rotation period $2\pi\sqrt{R^3/GM}$ in ms.`, '2*pi*sqrt(R^3/(G*M*Msun))*1e3', 'ms', ['ms', 's', 'µs', 'min'], 0.02, t`$\approx0.46$ ms. The fastest known pulsar spins at 1.4 ms: allowed.`),
    ],
  },
  {
    type: 'calc', id: 'c4', title: 'What powers the Crab Nebula?', fight: 'normal', xp: 30,
    problem: t`The Crab pulsar has $P=33.4$ ms and $\dot P=4.2\times10^{-13}$ s/s. Take the moment of inertia $I=10^{38}$ kg m$^2$.`,
    vars: { I: 1e38, Pp: 0.0334, Pdot: 4.2e-13, yr: 3.15576e7 },
    steps: [
      S('Erot', t`Rotational energy $\frac12I\Omega^2$ in units of $10^{42}$ J.`, '0.5*I*(2*pi/Pp)^2/1e42', '10^42 J', ['10^42 J', 'W', 'J s', 'kg m^2'], 0.02, t`$\Omega=2\pi/P=188$ rad/s.`),
      S('L', t`Spin-down luminosity $4\pi^2I\dot P/P^3$ in units of $10^{31}$ W.`, '4*pi^2*I*Pdot/Pp^3/1e31', '10^31 W', ['10^31 W', '10^42 J', 'J s', 'kg m^2'], 0.02, t`$L=-\frac{d}{dt}(\frac12I\Omega^2)=I\Omega|\dot\Omega|$ with $\dot\Omega=-2\pi\dot P/P^2$. About $10^5L_\odot$: enough to power the nebula's synchrotron glow.`),
      S('tau', t`Characteristic age $P/(2\dot P)$ in years.`, 'Pp/(2*Pdot)/yr', 'yr', ['yr', 's', 'Myr', 'Gyr'], 0.02, t`$\approx1260$ yr. The supernova was seen in 1054: a good match.`),
    ],
  },
];

room.encounters.push(...lessons, quiz, ...derivations, ...calcs);
export const rooms = { 'degenerate-matter': room };
export const codex = [
  { id: 'fermi', group: 'Compact objects', title: 'Fermi momentum', tex: t`n_e=\frac{8\pi p_F^3}{3h^3},\ n_e=\frac{\rho}{\mu_em_H},\ \mu_e=\frac{2}{1+X}`, meaning: 'Pauli filling of phase space; μe = 2 for He/C/O.', source: 'Choudhuri (5.2)-(5.8)' },
  { id: 'degP', group: 'Compact objects', title: 'Degeneracy pressure', tex: t`P=K_1\rho^{5/3}\ (\text{non-rel.}),\ P=K_2\rho^{4/3}\ (\text{rel.})`, meaning: 'K1 = 1.00e7/μe^{5/3}, K2 = 1.24e10/μe^{4/3} SI. Relativistic above ~2e9 kg/m³.', source: 'Choudhuri (5.9)-(5.12)' },
  { id: 'MR', group: 'Compact objects', title: 'White dwarf mass–radius and Chandrasekhar', tex: t`R\propto M^{-1/3},\ M_{Ch}=1.46\,(2/\mu_e)^2M_\odot`, meaning: 'More massive WDs are smaller; no WD above ~1.4 M_sun.', source: 'Choudhuri (5.25), (5.28)' },
  { id: 'breakup', group: 'Compact objects', title: 'Breakup period', tex: t`P_{\min}=2\pi\sqrt{R^3/GM}`, meaning: 'WD ~10 s, NS ~0.5 ms: only neutron stars can be ms pulsars.' },
  { id: 'spindown', group: 'Compact objects', title: 'Pulsar spin-down', tex: t`L=4\pi^2I\dot P/P^3,\ \tau_c=P/(2\dot P)`, meaning: 'Rotational energy loss; characteristic age.' },
  { id: 'acc', group: 'Compact objects', title: 'Accretion luminosity', tex: t`L=\frac{GM\dot M}{R}=\eta\dot Mc^2,\ \eta=\frac{GM}{Rc^2}`, meaning: 'NS: η ≈ 0.2; BH: η ≈ 0.1 (exam value).', source: 'Choudhuri §5.6, HS25 winter Q6' },
];
