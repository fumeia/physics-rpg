// New room: The Nuclear Furnace (Choudhuri Ch. 4: binding energy, Gamow tunnelling, pp/CNO, neutrinos, evolution, supernovae).
import { t, pick, S, exam, choud, P, EQ, INT, PIT, FIG, EXQ, MC } from '../lib.mjs';

const room = {
  id: 'astro-nuclear-furnace', region: 'Astro Observatory Ship', title: 'The Nuclear Furnace', course: 'astrophysics',
  topics: ['binding energy per nucleon', 'Gamow peak and tunnelling', 'pp chain', 'CNO cycle', 'solar neutrinos', 'stellar evolution', 'supernovae', 'exoplanets'],
  sources: [
    choud('Ch. 4.1 (binding energy, Fig. 4.1, eq. 4.3), 4.2 (reaction rates, Gamow factor 4.7-4.14), 4.3 (pp chain, CNO 4.27, triple alpha), 4.4 (solar neutrinos), 4.5 (evolution), 4.7 (supernovae), 4.9 (exoplanets)'),
    exam('w24', 'open Q2 (binding-energy sketch), MC 6, 7'), exam('p25', 'MC 6'), exam('s24', 'open Q1 (SN Ia)'),
    { file: 'game/content/qm/tunneling-bridge.json', where: 'QM cross-link: barrier tunnelling T ≈ e^{-2κa}' },
  ],
  intro: t`Deep in the engine room, protons collide at a few keV while the Coulomb wall between them stands at a MeV. Classically nothing should burn. That the Sun shines at all is a quantum tunnelling effect: the same physics as the QM Tunneling Bridge, now at $10^7$ K.`,
  encounters: [],
};

const lessons = [
  {
    type: 'lesson', id: 'L1', title: 'The binding-energy curve: why fusion stops at iron', tier: 'intuition', minutes: 8, xp: 15,
    source: [choud('§4.1, eqs. (4.1)-(4.3), Fig. 4.1'), exam('w24', 'open Q2 [6 pt]')],
    blocks: [
      EQ(t`E_B=[Zm_p+(A-Z)m_n-m_{\rm nuc}]c^2,\qquad f=E_B/A`, 'Binding energy and binding energy per nucleon (4.1)-(4.2).'),
      FIG(t`Sketch (HS24 winter Q2): $f$ against mass number $A$. It shoots up from H ($f=0$) through D (1.1 MeV), has a spike at $^4$He (7.1 MeV, much higher than its neighbours Li, Be), rises slowly to a broad maximum of about 8.8 MeV at Fe/Ni ($A\approx56$–62), then declines slowly to about 7.6 MeV for uranium. Left of the peak: energy from <b>fusion</b> (stars live here: pp, CNO, triple-alpha). Right of the peak: energy from <b>fission</b>.`),
      INT(t`Climbing towards iron releases energy; going past iron costs energy. So a massive star burns H, He, C, Ne, O, Si in ever shorter stages and ends with an iron core that cannot burn: the core collapses (core-collapse supernova). Elements heavier than iron are made by neutron capture (s- and r-process), not by fusion.`),
      EQ(t`4\,{}^1\mathrm H\to{}^4\mathrm{He}+2e^++2\nu_e+26.7\,\mathrm{MeV},\qquad\frac{\Delta m}{m}=0.007`, 'Hydrogen burning converts 0.7 % of the rest mass into energy.'),
      PIT(t`The H→He step releases by far the most energy per unit mass of all fusion stages (6.7 MeV per nucleon out of the total ~8.8 to iron). That is why the main sequence (H burning) is by far the longest phase of a star's life.`),
    ],
    check: [
      MC(t`Which nucleus has the highest binding energy per nucleon (approximately)?`, [t`$^4$He`, t`$^{12}$C`, t`$^{56}$Fe`, t`$^{238}$U`], 2, t`The curve peaks near iron/nickel (~8.8 MeV).`),
      MC(t`As a main-sequence star the Sun generates energy mainly by`, ['fusion of He into C', 'fission of heavy elements', 'fusion of H into He', 'gravitational contraction'], 2, 'pp chain.', exam('w24', 'MC 7')),
    ],
  },
  {
    type: 'lesson', id: 'L2', title: 'Tunnelling through the Coulomb wall: the Gamow peak', tier: 'theory', minutes: 15, xp: 20,
    source: [choud('§4.2, eqs. (4.4)-(4.14), Fig. 4.4')],
    blocks: [
      P(t`Two nuclei must get within $\sim10^{-15}$ m for the strong force to act. The Coulomb barrier there is $Z_1Z_2e^2/(4\pi\epsilon_0r)\approx1.4\,Z_1Z_2$ MeV, but $k_BT\approx1.3$ keV in the solar core: a factor 1000 too small. Classically: no fusion. Quantum mechanically the nuclei <b>tunnel</b>, with probability (Gamow 1928)`),
      EQ(t`P_{\rm tunnel}\simeq\exp\left(-\sqrt{\frac{E_G}{E}}\right),\qquad E_G=2mc^2(\pi\alpha Z_1Z_2)^2,\quad m=\frac{m_1m_2}{m_1+m_2}`, 'Gamow factor; Choudhuri writes it as exp(−b/√E) with b = √E_G. For p+p: E_G = 493 keV.'),
      INT(t`This is the WKB version of the $T\approx e^{-2\kappa a}$ you are computing in QM: the barrier is not a rectangle but $1/r$, and integrating $\kappa(r)=\sqrt{2m(V(r)-E)}/\hbar$ across it gives $\sqrt{E_G/E}$. Higher charge $Z_1Z_2$ means a much thicker wall: that is why heavier elements need far higher temperatures.`),
      P(t`The reaction rate needs particles that are both numerous (Maxwell factor $e^{-E/k_BT}$, falling with $E$) and able to tunnel ($e^{-\sqrt{E_G/E}}$, rising with $E$). The product is a narrow peak, the <b>Gamow peak</b>:`),
      EQ(t`E_0=\left(\tfrac12\sqrt{E_G}\,k_BT\right)^{2/3},\qquad\tau=\frac{3E_0}{k_BT},\qquad\varepsilon\propto T^{(\tau-2)/3}`, 'Position of the peak (4.13), its depth (4.14), and the resulting temperature sensitivity.'),
      FIG(t`Choudhuri Fig. 4.4: a falling exponential (Maxwell tail), a rising curve (tunnelling), and their product, a narrow hump around $E_0\approx6$ keV for p+p in the Sun, about $5k_BT$. Almost all fusion happens in this window, by the rare fast particles in the Maxwell tail.`),
      PIT(t`Because $\tau$ is large ($\approx14$ for pp in the Sun), the rate is very temperature-sensitive: $\varepsilon_{pp}\propto T^4$, and the CNO cycle (bigger charges, $Z=6$–8) $\propto T^{16-20}$. A small rise in $T_c$ makes CNO dominate: stars above about $1.3\,M_\odot$ burn mostly by CNO.`),
    ],
    check: [
      MC(t`At the centre of the Sun, $k_BT$ compared with the Coulomb barrier between two protons is`, ['about equal', 'about 1000 times smaller', 'about 1000 times larger', 'about 10 times smaller'], 1, t`keV vs MeV.`),
      MC(t`The Gamow peak lies at an energy`, [t`well below $k_BT$`, t`exactly $k_BT$`, t`several times $k_BT$`, t`at the barrier height`], 2, t`$E_0\approx5k_BT$ for pp in the Sun.`),
    ],
  },
  {
    type: 'lesson', id: 'L3', title: 'pp chain, CNO cycle, triple alpha', tier: 'theory', minutes: 10, xp: 15,
    source: [choud('§4.3, eqs. (4.20)-(4.28), Fig. 4.5'), exam('p25', 'MC 6')],
    blocks: [
      EQ(t`{}^1\mathrm H+{}^1\mathrm H\to{}^2\mathrm H+e^++\nu_e,\quad{}^2\mathrm H+{}^1\mathrm H\to{}^3\mathrm{He}+\gamma,\quad{}^3\mathrm{He}+{}^3\mathrm{He}\to{}^4\mathrm{He}+2\,{}^1\mathrm H`, 'pp I chain (dominant branch in the Sun).'),
      P(t`The first step needs a weak interaction (a proton turns into a neutron while the two protons are in contact). It is so slow that a given proton in the Sun waits ~$10^{10}$ yr: this bottleneck is why the Sun lives 10 Gyr. The CNO cycle uses C, N, O as catalysts; its slowest step is $^{14}$N$+p$. Helium burns by the <b>triple-alpha</b> reaction $3\,{}^4$He$\to\,{}^{12}$C at $T\gtrsim10^8$ K (via unstable $^8$Be).`),
      INT(t`Same net result for pp and CNO (4 p → He), different "machinery". Which machine runs is set by temperature: pp for the Sun ($1.5\times10^7$ K), CNO for hotter, more massive stars. CNO's steep $T$ dependence concentrates energy release in a small core, which then becomes convective.`),
      PIT(t`For the Sun ($T\sim10^7$ K) the <b>pp chain dominates</b> (HS25 practice MC6), not CNO and not "both equally".`),
    ],
    check: [
      MC(t`For the Sun with $T\sim10^7$ K,`, ['pp and CNO contribute equally', 'CNO dominates', 'neither contributes significantly', 'pp chains dominate'], 3, t`CNO takes over above ~$1.3M_\odot$.`, exam('p25', 'MC 6')),
    ],
  },
  {
    type: 'lesson', id: 'L4', title: 'Solar neutrinos: the experiment that weighed the neutrino', tier: 'intuition', minutes: 6, xp: 10,
    source: [choud('§4.4.2-4.4.3'), exam('w24', 'MC 6')],
    blocks: [
      P(t`Every He nucleus made in the Sun releases two electron neutrinos, which escape directly from the core (they barely interact). Counting them tests the solar model. Davis' chlorine experiment (from 1968) found only about <b>one third</b> of the predicted $\nu_e$ flux: the solar neutrino problem.`),
      P(t`Resolution (SNO, 2002): the total neutrino flux of all flavours agrees with the solar model, but many $\nu_e$ have turned into $\nu_\mu$ and $\nu_\tau$ on the way. Flavour oscillations require neutrinos to have <b>mass</b>.`),
      INT(t`Neutrinos are the only way to see the solar core "now"; photons take $\sim10^4$–$10^5$ yr to random-walk out. Helioseismology (sound waves resonating in the Sun) independently confirmed the solar model's interior, which is why physicists blamed the neutrinos, not the Sun.`),
    ],
    check: [
      MC(t`Neutrino oscillations are indicated because detectors observe`, ['no neutrinos at all', t`one third of the predicted $\nu_e$`, t`three times the predicted $\nu_e$`, t`only $\nu_\mu$ and $\nu_\tau$`], 1, t`The missing $\nu_e$ arrive as other flavours.`, exam('w24', 'MC 6')),
    ],
  },
  {
    type: 'lesson', id: 'L5', title: 'Life and death of stars', tier: 'intuition', minutes: 12, xp: 15,
    source: [choud('§4.5 (evolution, Figs. 4.9-4.10), §4.6 (mass loss), §4.7 (supernovae)'), exam('s24', 'open Q1')],
    blocks: [
      P(t`<b>Low-mass star (like the Sun):</b> core H exhausted → inert He core contracts and heats (virial theorem), H burns in a shell → envelope swells: red giant. The He core becomes degenerate; He ignites explosively (helium flash) at ~$10^8$ K. He burning in the core (horizontal branch), then He and H shells (asymptotic giant branch). The envelope is blown off as a planetary nebula; the C/O core remains as a <b>white dwarf</b>.`),
      P(t`<b>Massive star ($\gtrsim8M_\odot$):</b> burns H, He, C, Ne, O, Si in successively shorter stages, building an onion of shells around an iron core. Iron cannot release energy by fusion; when the core exceeds the Chandrasekhar mass it collapses in less than a second to a <b>neutron star</b> (or black hole). The infall bounces and, powered by neutrinos, blows the star apart: <b>core-collapse supernova</b> (Type II, with hydrogen lines). SN 1987A's neutrinos confirmed this.`),
      P(t`<b>Type Ia supernova:</b> a carbon–oxygen white dwarf in a binary accretes mass until it approaches the Chandrasekhar limit and undergoes thermonuclear runaway. Because they all explode near the same mass, they reach nearly the same peak absolute magnitude $M\approx-19.3$: <b>standard candles</b> (used to discover the accelerating expansion).`),
      INT(t`The whole story is the virial theorem plus the binding-energy curve: each time a fuel runs out the core contracts and heats until the next fuel ignites, unless degeneracy pressure stops the contraction first (low mass) or there is no next fuel (iron).`),
      EXQ(t`HS24 summer Q1: apparent magnitude of a SN Ia in Andromeda ($m=5.1$, 225 times brighter than Proxima Centauri). MC: what happens to $L$ and $T_{\rm eff}$ when leaving the main sequence.`),
    ],
    check: [
      MC(t`Type Ia supernovae are useful standard candles because`, ['they all occur in the same galaxy', 'white dwarfs explode near the same (Chandrasekhar) mass', 'their neutrinos can be counted', 'they have hydrogen lines'], 1, 'Similar mass → similar peak luminosity.'),
      MC(t`The end state of the Sun will be`, ['a neutron star', 'a black hole', 'a white dwarf', 'a red dwarf'], 2, 'Too light for core collapse.'),
    ],
  },
  {
    type: 'lesson', id: 'L6', title: 'Exoplanets: wobbles and dips', tier: 'intuition', minutes: 5, xp: 10,
    source: [choud('§4.9')],
    blocks: [
      P(t`<b>Radial velocity:</b> star and planet orbit their common centre of mass; the star's line-of-sight velocity oscillates with amplitude $v_\star=(m_p/M_\star)v_p$ (Jupiter makes the Sun wobble at 13 m/s, Earth at 9 cm/s), measured by Doppler shifts. Gives $m_p\sin i$. <b>Transits:</b> the planet blocks a fraction $(R_p/R_\star)^2$ of the starlight (Jupiter: 1 %, Earth: 0.01 %). Gives the radius; with RV, the density.`),
      INT(t`Both methods favour big planets close to small stars, which is why "hot Jupiters" were found first.`),
    ],
    check: [
      MC(t`A transiting planet with $R_p=0.1R_\star$ dims the star by`, ['10 %', '1 %', '0.1 %', '0.01 %'], 1, t`$(R_p/R_\star)^2=0.01$.`),
    ],
  },
];

const quiz = {
  type: 'quiz', id: 'Q1', title: 'Nuclear Furnace multiple choice', xp: 30, passMark: 0.75,
  source: [exam('w24', 'MC'), exam('p25', 'MC')],
  questions: [
    MC(t`Solar neutrino observations indicate oscillations because we detect`, ['no neutrinos', t`one third of the predicted $\nu_e$`, t`three times the predicted $\nu_e$`, t`only $\nu_\mu$, $\nu_\tau$`], 1, 'Flavour change en route.', exam('w24', 'MC 6')),
    MC(t`As a main-sequence star the Sun generates energy primarily through`, ['He → C fusion', 'fission', 'H → He fusion', 'contraction'], 2, 'pp chain.', exam('w24', 'MC 7')),
    MC(t`For the Sun ($T\sim10^7$ K)`, ['pp and CNO equally', 'CNO dominates', 'neither', 'pp dominates'], 3, 'CNO only above ~1.3 solar masses.', exam('p25', 'MC 6')),
    MC(t`Fusion in stars occurs despite $k_BT\ll$ Coulomb barrier because of`, ['the strong force at long range', 'quantum tunnelling', 'neutrino heating', 'magnetic fields'], 1, 'Gamow factor.'),
    MC(t`Energy released when four hydrogen atoms fuse into helium-4`, ['2.2 MeV', '7.1 MeV', '26.7 MeV', '938 MeV'], 2, t`$(4\times1.007825-4.002603)\,u\,c^2=26.7$ MeV.`),
    MC(t`The core of a massive star collapses after building iron because`, ['iron fusion releases too much energy', 'iron cannot release energy by fusion or fission', 'iron is radioactive', 'neutrinos stop'], 1, 'Peak of the binding-energy curve.'),
  ],
};

const derivations = [
  {
    type: 'derive', id: 'D1', title: 'The Gamow peak', xp: 30,
    source: choud('§4.2, eqs. (4.10)-(4.14)'),
    goal: t`The integrand of the reaction rate is $e^{g(E)}$ with $g(E)=-\frac{E}{k_BT}-\frac{b}{\sqrt E}$. Find the peak energy $E_0$ and $\tau=-g(E_0)$.`,
    given: [t`$b=\sqrt{E_G}$`],
    steps: [
      { prompt: 'Set dg/dE = 0.', reveal: t`$-\frac{1}{k_BT}+\frac{b}{2}E^{-3/2}=0\Rightarrow E_0^{3/2}=\frac{bk_BT}{2}\Rightarrow E_0=\left(\frac{bk_BT}{2}\right)^{2/3}$.` },
      { prompt: 'Evaluate g at the peak.', reveal: t`$\frac{b}{\sqrt{E_0}}=\frac{2E_0^{3/2}}{k_BT\sqrt{E_0}}=\frac{2E_0}{k_BT}$, so $\tau=\frac{E_0}{k_BT}+\frac{2E_0}{k_BT}=\frac{3E_0}{k_BT}$.` },
      { prompt: 'Temperature dependence of the rate.', reveal: t`$E_0\propto T^{2/3}$, so $\tau\propto T^{-1/3}$ and the rate $\propto T^{-2/3}\,\tau^2e^{-\tau}$ (Gaussian width factor). Locally $d\ln\varepsilon/d\ln T=(\tau-2)/3$: large $\tau$ means extreme temperature sensitivity.` },
    ],
    keyPoints: ['$E_0=(bk_BT/2)^{2/3}$', '$\\tau=3E_0/k_BT$', 'competition of Maxwell tail and tunnelling'],
  },
];

const calcs = [
  {
    type: 'calc', id: 'c1', title: 'Gamow peak of the pp reaction in the Sun', fight: 'normal', xp: 35,
    problem: t`Two protons (reduced mass $m=m_p/2$, so $2mc^2=m_pc^2=938.3$ MeV) at $T_c=1.5\times10^7$ K. Fine-structure constant $\alpha=1/137.04$, $k_B=8.617\times10^{-5}$ eV/K.`,
    vars: { mpc2: 938.272e3, alpha: 1 / 137.036, kBeV: 8.617333e-5, T: 1.5e7 },
    steps: [
      S('kT', t`$k_BT$ in keV.`, 'kBeV*T/1e3', 'keV', ['keV', 'MeV', 'K', 'eV/K'], 0.02, t`$8.617\times10^{-5}\times1.5\times10^7$ eV.`),
      S('EG', t`Gamow energy $E_G=2mc^2(\pi\alpha)^2$ in keV.`, 'mpc2*(pi*alpha)^2', 'keV', ['keV', 'MeV', 'K', 'eV/K'], 0.02, t`$Z_1=Z_2=1$; $938\,272\,\mathrm{keV}\times(\pi/137)^2\approx493$ keV.`),
      S('E0', t`Peak energy $E_0=(\frac12\sqrt{E_G}k_BT)^{2/3}$ in keV.`, '(0.5*sqrt(EG)*kT)^(2/3)', 'keV', ['keV', 'MeV', 'K', 'eV/K'], 0.02, t`Units work: $(\mathrm{keV}^{1/2}\cdot\mathrm{keV})^{2/3}=\mathrm{keV}$. About $4.6\,k_BT$.`),
      S('Pt', t`Tunnelling probability at $E_0$, $e^{-\sqrt{E_G/E_0}}$ (enter e.g. 1e-4).`, 'exp(-sqrt(EG/E0))', 'dimensionless', ['dimensionless', 'keV', 's^-1', 'm^2'], 0.05, t`$\sqrt{493/6}\approx9.1$, $e^{-9.1}\approx10^{-4}$: rare, but there are $10^{56}$ protons.`),
      S('n', t`Temperature exponent $(\tau-2)/3$ with $\tau=3E_0/k_BT$.`, '(3*E0/kT-2)/3', 'dimensionless', ['dimensionless', 'keV', 'K', 'K^-1'], 0.03, t`$\tau\approx14$ gives $\varepsilon\propto T^{4}$: the classic pp temperature dependence.`),
    ],
  },
  {
    type: 'calc', id: 'c2', title: 'Counting the Sun\'s neutrinos', fight: 'normal', xp: 30,
    problem: t`$4\,{}^1$H atoms ($1.007825$ u each) make one $^4$He atom ($4.002603$ u) and 2 neutrinos; $1\,\mathrm u\,c^2=931.494$ MeV. Ignore the small energy the neutrinos carry away. $L_\odot=3.828\times10^{26}$ W, $1$ AU $=1.495\times10^{11}$ m.`,
    vars: { ...pick('Lsun', 'AU'), mH: 1.007825, mHe: 4.002603, uc2: 931.494, MeV: 1.602176634e-13 },
    steps: [
      S('Q', t`Energy released per helium nucleus in MeV.`, '(4*mH-mHe)*uc2', 'MeV', ['MeV', 'keV', 'u', 'J/kg'], 0.01, t`$\Delta m=0.0287$ u.`),
      S('frac', t`Fraction of the rest mass converted.`, '(4*mH-mHe)/(4*mH)', 'dimensionless', ['dimensionless', 'MeV', 'u', '%/s'], 0.02, t`$0.0287/4.031=0.0071$.`),
      S('rate', t`Helium nuclei made per second (enter e.g. 9e37).`, 'Lsun/(Q*MeV)', 's^-1', ['s^-1', 'kg/s', 'W', 'MeV'], 0.02, t`$L/Q$ with $Q$ in joules.`),
      S('flux', t`Neutrino flux at Earth in cm$^{-2}$ s$^{-1}$ (enter e.g. 6e10).`, '2*rate/(4*pi*AU^2)/1e4', 'cm^-2 s^-1', ['cm^-2 s^-1', 'm^-2 s^-1', 's^-1', 'W m^-2'], 0.02, t`Two neutrinos per He; divide by $4\pi d^2$; $1\,\mathrm{m}^2=10^4\,\mathrm{cm}^2$. About $6\times10^{10}$ per cm$^2$ per second pass through you.`),
    ],
  },
  {
    type: 'calc', id: 'c3', title: 'Quick fight: Coulomb barrier for two protons', fight: 'fermi', xp: 15,
    problem: t`Estimate $e^2/(4\pi\epsilon_0r)$ at $r=10^{-15}$ m in MeV, using $e^2/(4\pi\epsilon_0)=1.44$ MeV fm. Compare with $k_BT\approx1.3$ keV.`,
    vars: { e2: 1.44, r: 1 },
    steps: [S('V', t`Barrier height in MeV.`, 'e2/r', 'MeV', ['MeV', 'keV', 'eV', 'J'], 0.1, t`1.44 MeV fm / 1 fm. About 1000 times $k_BT$.`, { tolType: 'log' })],
  },
];

const bossBE = {
  type: 'boss', id: 'b1', title: 'Boss: binding energy per nucleon (exam sketch question)', xp: 60, minutes: 8,
  source: exam('w24', 'Open Question 2 [6 pt]'),
  instructions: 'Draw the sketch on paper in under 8 minutes, then compare with the key points. Enter the two numbers you put on your axes.',
  statement: [
    t`Sketch a rough diagram of the binding energy per nucleon against atomic number, labelling the locations of H, He and Fe. Indicate on your diagram the general types of nuclear reactions and the region that is important for nuclear energy generation in stars.`,
  ],
  finalAnswers: [
    { id: 'fFe', prompt: 'Binding energy per nucleon at the iron peak, in MeV.', answer: '8.8', vars: {}, tol: 0.03 },
    { id: 'fHe', prompt: t`Binding energy per nucleon of $^4$He, in MeV.`, answer: '7.07', vars: {}, tol: 0.03 },
  ],
  keyPoints: [
    t`Axes labelled ($E_B/A$ in MeV vs mass or atomic number); H at 0, a steep rise, He-4 as a local spike (~7.1 MeV), broad maximum near Fe-56 (~8.8 MeV), slow decline to ~7.6 MeV for U.`,
    t`Left of iron: fusion releases energy (arrow towards Fe). Right of iron: fission releases energy (arrow towards Fe).`,
    t`Stellar energy generation: fusion on the left part (pp chain and CNO cycle H→He, then He→C,O...), with H→He giving the largest jump.`,
  ],
};

room.encounters.push(...lessons, quiz, ...derivations, ...calcs, bossBE);
export const rooms = { 'nuclear-furnace': room };
export const codex = [
  { id: 'BE', group: 'Nuclear astrophysics', title: 'Binding energy', tex: t`E_B=[Zm_p+(A-Z)m_n-m_{\rm nuc}]c^2`, meaning: 'Peak of E_B/A ≈ 8.8 MeV at Fe; He-4: 7.1 MeV.', source: 'Choudhuri (4.1)' },
  { id: 'Hburn', group: 'Nuclear astrophysics', title: 'Hydrogen burning', tex: t`4\,{}^1\mathrm H\to{}^4\mathrm{He}+2e^++2\nu_e+26.7\,\mathrm{MeV}`, meaning: '0.7 % of rest mass; pp chain (Sun) or CNO (M > 1.3 M_sun).', source: 'Choudhuri §4.3' },
  { id: 'gamow', group: 'Nuclear astrophysics', title: 'Gamow factor and peak', tex: t`P\simeq e^{-\sqrt{E_G/E}},\ E_G=2mc^2(\pi\alpha Z_1Z_2)^2,\ E_0=(\tfrac12\sqrt{E_G}k_BT)^{2/3}`, meaning: 'Tunnelling through the Coulomb barrier; p+p: E_G = 493 keV, E_0 ≈ 6 keV.', source: 'Choudhuri (4.7)-(4.14)' },
  { id: 'Tsens', group: 'Nuclear astrophysics', title: 'Temperature sensitivity', tex: t`\varepsilon_{pp}\propto T^4,\ \varepsilon_{CNO}\propto T^{16\text{–}20}`, meaning: '(τ−2)/3 with τ = 3E_0/k_BT.' },
  { id: 'transit', group: 'Nuclear astrophysics', title: 'Exoplanet signals', tex: t`\frac{\Delta F}{F}=\left(\frac{R_p}{R_\star}\right)^2,\quad v_\star=\frac{m_p}{M_\star}v_p`, meaning: 'Transit depth and radial-velocity wobble.', source: 'Choudhuri §4.9' },
];
