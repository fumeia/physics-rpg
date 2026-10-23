// New room: The First Three Minutes (thermal history, Choudhuri Ch. 10.7, 11).
import { t, pick, S, exam, choud, P, EQ, INT, PIT, FIG, EXQ, MC } from '../lib.mjs';

const room = {
  id: 'astro-early-universe', region: 'Astro Observatory Ship', title: 'The First Three Minutes', course: 'astrophysics',
  topics: ['thermal history', 'relativistic gases', 'baryon-to-photon ratio', 'neutrino decoupling', 'Big Bang nucleosynthesis', 'recombination and CMB', 'dark matter', 'inflation', 'structure formation'],
  sources: [
    choud('Ch. 10.7 (T = 1.52e10/√t K, eq. 10.67; T in MeV = 1.31/√t, 10.69; |Ω−1| ∝ t, 10.70), 11.1-11.2 (relativistic gases 11.9-11.19), 11.3 (BBN, n/p 11.20-11.23), 11.4 (neutrino background), 11.5 (dark matter), 11.6 (inflation), 11.7 (recombination, last scattering), 11.9 (structure formation)'),
    exam('w25', 'open Q7 (radiation era, BBN)'), exam('p25', 'MC 7'), exam('s24', 'MC 15'), exam('w24', 'MC 14-15'),
  ],
  intro: t`Run the film backwards: the Universe gets hotter as $T\propto1/a$. At 1 s it is a $10^{10}$ K soup of photons, electrons, positrons and neutrinos with a pinch of neutrons and protons; at 3 minutes helium forms; at 380 000 years atoms form and the CMB is released. Each step is set by one comparison: a reaction rate against the expansion rate $H$.`,
  encounters: [],
};

const lessons = [
  {
    type: 'lesson', id: 'L1', title: 'The cosmic clock: temperature versus time', tier: 'theory', minutes: 10, xp: 15,
    source: [choud('§10.7 eqs. (10.65)-(10.69), §11.1')],
    blocks: [
      P(t`In the radiation era $a\propto t^{1/2}$ and $T\propto1/a$, so $T\propto t^{-1/2}$. Putting in the constants (photons only, Choudhuri (10.66)-(10.69)):`),
      EQ(t`T=\left(\frac{3c^2}{32\pi Ga_B}\right)^{1/4}t^{-1/2}\approx\frac{1.5\times10^{10}\,\mathrm K}{\sqrt{t/1\,\mathrm s}},\qquad k_BT\approx\frac{1.3\,\mathrm{MeV}}{\sqrt{t/1\,\mathrm s}},\qquad1\,\mathrm{eV}\leftrightarrow1.16\times10^4\,\mathrm K`),
      FIG(t`Timeline (energy ↔ time): $\sim10^{-35}$ s inflation (?); $10^{-6}$ s, 1 GeV: quarks bind into protons and neutrons; 1 s, 1 MeV: neutrinos decouple, n/p freezes, then $e^\pm$ annihilate; 3 min, 0.1 MeV: nucleosynthesis (D, He, Li); 50 000 yr, ~1 eV: matter–radiation equality; 380 000 yr, 0.3 eV ($z\approx1100$): recombination, CMB released; then dark ages, first stars at $z\sim20$, reionisation, galaxies.`),
      INT(t`A process "freezes out" when its rate $\Gamma$ drops below the expansion rate $H$: particles can no longer find each other before the Universe has doubled in size. Almost every relic (neutrinos, the n/p ratio, the light elements, the CMB) is a snapshot taken at its own $\Gamma=H$.`),
      PIT(t`Energy scales the MC asks for: BBN at <b>~1 MeV</b> (binding energies of nuclei; HS25 practice MC7) and recombination at <b>~1 eV</b> (just below 13.6 eV because photons vastly outnumber baryons; HS24 summer MC15).`),
    ],
    check: [
      MC(t`Big Bang nucleosynthesis occurred at an energy scale of about`, ['10 GeV', '1 GeV', '1 MeV', '1 eV'], 2, 'Nuclear binding energies.', exam('p25', 'MC 7')),
      MC(t`Recombination occurred at an energy scale of about`, ['1 GeV', '1 MeV', '1 eV', '0.01 eV'], 2, t`Below 13.6 eV because $n_\gamma/n_B\sim10^9$.`, exam('s24', 'MC 15')),
    ],
  },
  {
    type: 'lesson', id: 'L2', title: 'Photons per baryon: the number that runs cosmology', tier: 'theory', minutes: 10, xp: 15,
    source: [choud('§11.2 eqs. (11.9)-(11.19)')],
    blocks: [
      EQ(t`n_\gamma=\frac{2\zeta(3)}{\pi^2}\left(\frac{k_BT}{\hbar c}\right)^3=4.1\times10^8\,\mathrm{m^{-3}}\ (T_0=2.725\,\mathrm K),\qquad\eta=\frac{n_B}{n_\gamma}\approx6\times10^{-10}`, '(11.9), (11.17)-(11.19). Both scale as a^{-3}, so η is constant after e± annihilation.'),
      P(t`For relativistic particles $\rho c^2=g\frac{a_B}{2}T^4$ (bosons) or $\frac78g\frac{a_B}{2}T^4$ (fermions), with $g$ the number of spin states (photons: 2). Non-relativistic species are exponentially suppressed, $n\propto(mT)^{3/2}e^{-mc^2/k_BT}$.`),
      INT(t`There are about $1.6\times10^9$ photons for every proton or neutron. This tiny $\eta$ is why atoms and nuclei form "late": even when $k_BT$ is far below a binding energy, the high-energy tail of so many photons can still break every bound state. It is also the parameter BBN measures (through deuterium).`),
    ],
    check: [
      MC(t`The ratio of baryons to photons is about`, [t`$1$`, t`$10^{-3}$`, t`$6\times10^{-10}$`, t`$10^{-20}$`], 2, t`$\eta\approx6\times10^{-10}$.`),
    ],
  },
  {
    type: 'lesson', id: 'L3', title: 'Big Bang nucleosynthesis: why a quarter of the baryons are helium', tier: 'theory', minutes: 12, xp: 20,
    source: [choud('§11.3 eqs. (11.20)-(11.23), Fig. 11.2'), exam('w25', 'open Q7c')],
    blocks: [
      P(t`While weak reactions ($n+\nu\leftrightarrow p+e^-$, $n+e^+\leftrightarrow p+\bar\nu$) are fast, neutrons and protons are in equilibrium: Boltzmann with $\Delta mc^2=1.29$ MeV. The rate falls as $\Gamma/H\approx(T/0.8\,\mathrm{MeV})^3$ (11.20), so the ratio freezes at $k_BT\approx0.8$ MeV:`),
      EQ(t`\frac{n_n}{n_p}=e^{-1.29/0.8}\approx0.20\ \Rightarrow\ Y=\frac{2n_n}{n_n+n_p}=\frac{2(n_n/n_p)}{1+n_n/n_p}\approx0.33`, '(11.21)-(11.23). Free neutron decay (τ ≈ 880 s) until fusion starts at ~3 min lowers this to n/p ≈ 1/7 and Y ≈ 0.25.'),
      P(t`Fusion must wait for deuterium ($B=2.2$ MeV) to survive photo-dissociation, which happens only at $k_BT\approx0.07$ MeV ($T\approx10^9$ K, $t\approx3$ min; HS25 winter Q7 gives 225 s), again because of the $10^9$ photons per baryon (the "deuterium bottleneck"). Then nearly all neutrons end up in $^4$He.`),
      INT(t`Helium is ~25 % of baryonic mass everywhere we look, even in the oldest, most metal-poor gas: it cannot have been made in stars (they made only a few % since). Deuterium is fragile and only destroyed by stars, and its leftover abundance falls steeply with $\eta$: a cosmic baryometer. It gives $\Omega_b\approx0.05$, far below $\Omega_M\approx0.3$: most dark matter is not baryonic.`),
      PIT(t`Each He nucleus contains 2 neutrons, so $Y=2n_n/(n_n+n_p)$ (mass fraction), not $n_n/(n_n+n_p)$.`),
    ],
    check: [
      MC(t`If the n/p ratio at fusion time is 1/7, the primordial helium mass fraction is`, ['1/7', '1/4', '1/8', '2/7'], 1, t`$2\cdot\frac17/(1+\frac17)=\frac{2}{8}$.`),
      MC(t`The primordial deuterium abundance is a good baryon density probe because`, ['deuterium is made in stars', 'it falls steeply with η: more baryons burn more D into He', 'it is independent of η', 'it equals the helium abundance'], 1, 'Choudhuri Fig. 11.2.'),
    ],
  },
  {
    type: 'lesson', id: 'L4', title: 'The neutrino background', tier: 'intuition', minutes: 6, xp: 10,
    source: [choud('§11.4')],
    blocks: [
      P(t`Neutrinos decouple at ~1 MeV, slightly before electrons and positrons annihilate. The annihilation heats the photons (entropy of $e^\pm$ goes to photons only), so today the neutrinos are colder:`),
      EQ(t`T_\nu=\left(\frac{4}{11}\right)^{1/3}T_\gamma=1.95\,\mathrm K,\qquad\rho_R=\left[1+\tfrac78\cdot3\left(\tfrac4{11}\right)^{4/3}\right]\rho_\gamma=1.68\,\rho_\gamma`, 'Three neutrino species; the factor 1.68 enters the time of matter–radiation equality.'),
      INT(t`There are ~340 relic neutrinos per cm³ around you, never directly detected. Massive neutrinos are hot dark matter: they move too fast to let small structures form, so they can be at most a small fraction of the dark matter.`),
    ],
    check: [
      MC(t`The cosmic neutrino background is colder than the CMB because`, ['neutrinos have mass', 'e± annihilation heated the photons after neutrinos decoupled', 'neutrinos were produced later', 'neutrinos scatter on dust'], 1, t`$(4/11)^{1/3}$.`),
    ],
  },
  {
    type: 'lesson', id: 'L5', title: 'Recombination and the cosmic microwave background', tier: 'theory', minutes: 12, xp: 20,
    source: [choud('§10.5 (CMB spectrum), §11.7 (formation of atoms, last scattering surface)')],
    blocks: [
      P(t`Above ~3000 K hydrogen is ionised and free electrons Thomson-scatter photons constantly (mean free path tiny; recall Choudhuri ex. 2.7: ionised air is opaque within 14 m). At $T\approx3000$ K ($z\approx1100$, $t\approx380\,000$ yr) electrons and protons combine, the electron density drops, and photons stream freely: the <b>last scattering surface</b>. We see it today as the CMB, redshifted to 2.725 K.`),
      EQ(t`T(z)=T_0(1+z),\qquad\frac{\delta T}{T}\sim10^{-5}`, 'A nearly perfect blackbody (COBE/FIRAS); the tiny anisotropies are the seeds of all structure.'),
      INT(t`The spectrum stays a blackbody after decoupling: free streaming in an expanding universe just redshifts every photon by the same factor, which maps a Planck spectrum at $T$ onto a Planck spectrum at $T/(1+z)$. That is why $T\propto1/a$ exactly.`),
      PIT(t`Recombination is <b>not</b> at $k_BT=13.6$ eV (that would be 160 000 K). Because $n_\gamma/n_B\sim10^9$, there are still enough photons above 13.6 eV in the Wien tail until $k_BT\approx0.3$ eV. Same logic as the Saha equation for stellar atmospheres.`),
    ],
    check: [
      MC(t`The CMB was released when`, ['the first stars formed', 'electrons and protons combined into neutral hydrogen', 'nuclei formed', 'neutrinos decoupled'], 1, 'Thomson scattering stops.'),
    ],
  },
  {
    type: 'lesson', id: 'L6', title: 'Dark matter, inflation and the growth of structure', tier: 'intuition', minutes: 12, xp: 15,
    source: [choud('§11.5 (dark matter), §11.6 (inflation, horizon and flatness problems), §11.9 (structure formation); §10.7 eq. (10.70)')],
    blocks: [
      P(t`<b>Dark matter:</b> evidence from rotation curves, cluster virial masses, X-ray gas, lensing, and the CMB. BBN says only $\Omega_b\approx0.05$, so most of $\Omega_M\approx0.3$ is non-baryonic. It must be "cold" (slow) to let small structures form first: weakly interacting massive particles, axions... still unknown.`),
      P(t`<b>Structure growth:</b> in the matter era, overdensities on scales above the Jeans length grow as $\delta\propto a$ (a power law, not exponential, because expansion fights gravity). Baryonic fluctuations of $10^{-5}$ at $z=1100$ would have grown only to $10^{-2}$ today: not enough for galaxies. Dark matter, which does not feel radiation pressure, started growing earlier (from $z_{eq}$), and baryons fell into its potential wells after recombination.`),
      P(t`<b>Inflation</b> (Guth 1981): a brief early phase of exponential expansion. It solves the <b>horizon problem</b> (CMB regions on opposite sides of the sky have the same $T$ to $10^{-5}$ but were never in causal contact without inflation) and the <b>flatness problem</b> ($|\Omega-1|\propto t$ in the radiation era and $\propto t^{2/3}$ in the matter era, so a nearly flat universe today needs extreme fine tuning early on), and its quantum fluctuations seed the $10^{-5}$ perturbations.`),
      INT(t`Flatness is unstable like a pencil balanced on its tip: any deviation from $\Omega=1$ grows. That the Universe is still nearly flat after 13.8 Gyr means it started incredibly close to $\Omega=1$; inflation drives it there naturally by making $a$ huge, $|\Omega-1|\propto1/(aH)^2$.`),
    ],
    check: [
      MC(t`In the matter era, a small density contrast grows as`, [t`$e^{t}$`, t`$a$`, t`$a^{-1}$`, 'it does not grow'], 1, 'Power-law growth.'),
      MC(t`The horizon problem asks why`, ['the sky is dark at night', 'causally disconnected CMB regions have the same temperature', 'the Universe is flat', 'there is more matter than antimatter'], 1, 'Solved by inflation.'),
    ],
  },
];

const quiz = {
  type: 'quiz', id: 'Q1', title: 'First Three Minutes multiple choice', xp: 30, passMark: 0.75,
  source: [exam('p25', 'MC 7'), exam('s24', 'MC 15'), exam('w24', 'MC 14-15')],
  questions: [
    MC(t`BBN occurred at an energy scale of`, ['10 GeV', '1 GeV', '1 MeV', '1 eV'], 2, 'Nuclear binding.', exam('p25', 'MC 7')),
    MC(t`Recombination: energy scale`, ['1 GeV', '1 MeV', '1 eV', '0.01 eV'], 2, 'Below 13.6 eV due to many photons.', exam('s24', 'MC 15')),
    MC(t`Radiation vs matter domination in our Universe:`, ['radiation early, matter late', 'matter early, radiation late', 'radiation always', 'matter always'], 0, t`$\rho_R/\rho_M\propto1/a$.`, exam('w24', 'MC 14')),
    MC(t`$\rho_R\propto$`, [t`$a^{-3}$`, t`$a^{-2}$`, t`$a^{-4}$`, 'const'], 2, 'Dilution and redshift.', exam('w24', 'MC 15')),
    MC(t`The primordial helium mass fraction is about`, ['0.01', '0.25', '0.5', '0.75'], 1, t`From $n/p\approx1/7$.`),
    MC(t`In the radiation era the temperature scales with time as`, [t`$t^{-2/3}$`, t`$t^{-1/2}$`, t`$t^{-1}$`, t`$e^{-Ht}$`], 1, t`$T\propto1/a\propto t^{-1/2}$.`, exam('w25', 'open Q7b')),
  ],
};

const derivations = [
  {
    type: 'derive', id: 'D1', title: 'Helium mass fraction from the frozen n/p ratio', xp: 25,
    source: choud('§11.3 eqs. (11.21)-(11.23)'),
    goal: t`Show that $Y=\frac{2(n_n/n_p)}{1+n_n/n_p}$ if all neutrons end up in $^4$He, and evaluate it for $n_n/n_p=e^{-1.29/0.8}$ and for $1/7$.`,
    given: [t`$\Delta mc^2=1.29$ MeV, freeze-out at 0.8 MeV`],
    steps: [
      { prompt: 'Count the mass in helium.', reveal: t`Each He-4 holds 2 n + 2 p. With $n_n$ neutrons, helium contains $2n_n$ nucleons; total nucleons $n_n+n_p$. $Y=\frac{2n_n}{n_n+n_p}=\frac{2(n_n/n_p)}{1+n_n/n_p}$.` },
      { prompt: 'Freeze-out value.', reveal: t`$e^{-1.29/0.8}=0.20\Rightarrow Y=0.33$.` },
      { prompt: 'With neutron decay.', reveal: t`$n_n/n_p\to1/7\Rightarrow Y=0.25$, as observed.` },
    ],
    keyPoints: ['Boltzmann factor for n/p', 'factor 2 in Y', 'effect of neutron decay'],
  },
  {
    type: 'derive', id: 'D2', title: 'Radiation era: a(t), T(t) and the BBN time', xp: 30,
    source: exam('w25', 'open Q7 [12 pt]'),
    goal: t`Flat, radiation only, $\rho\propto a^{-4}$, $\rho\propto T^4$. Show $a\propto t^{1/2}$, $T\propto t^{-1/2}$, and find $t_{BBN}$ for $T_{BBN}=10^9$ K given $T(1\,\mathrm s)=1.5\times10^{10}$ K.`,
    given: [t`$(\dot a/a)^2=\frac{8\pi G}{3}\rho$`],
    steps: [
      { prompt: '(a)', reveal: t`$\dot a/a=C/a^2\Rightarrow a\,da=C\,dt\Rightarrow a^2=2Ct$.` },
      { prompt: '(b)', reveal: t`$T^4\propto a^{-4}\Rightarrow T\propto a^{-1}\propto t^{-1/2}$.` },
      { prompt: '(c)', reveal: t`$t_{BBN}=1\,\mathrm s\,(1.5\times10^{10}/10^9)^2=225$ s.` },
    ],
    keyPoints: ['separation of variables', '$T\\propto1/a$', '225 s'],
  },
];

const calcs = [
  {
    type: 'calc', id: 'c1', title: 'Counting the CMB photons', fight: 'normal', xp: 30,
    problem: t`$n_\gamma=\frac{2\zeta(3)}{\pi^2}\left(\frac{k_BT}{\hbar c}\right)^3$ with $\zeta(3)=1.202$, $T_0=2.725$ K, $\hbar=1.0546\times10^{-34}$ J s. Baryons: $\Omega_bh^2=0.0224$, $\rho_{c}=1.879\times10^{-26}h^2$ kg m$^{-3}$.`,
    vars: { ...pick('kB', 'c', 'mp'), hbar: 1.054571817e-34, z3: 1.2020569, T0: 2.725, obh2: 0.0224, rch2: 1.8785e-26 },
    steps: [
      S('ng', t`Photon number density in $10^8$ m$^{-3}$.`, '2*z3/pi^2*(kB*T0/(hbar*c))^3/1e8', '10^8 m^-3', ['10^8 m^-3', 'm^-3 K', 'kg m^-3', 'cm^-3'], 0.02, t`$k_BT/\hbar c\approx1190$ m$^{-1}$. About 410 photons per cm³.`),
      S('nb', t`Baryon number density $\Omega_bh^2\rho_c/(h^2m_p)$ in m$^{-3}$.`, 'obh2*rch2/mp', 'm^-3', ['m^-3', '10^8 m^-3', 'kg m^-3', 'cm^-3'], 0.02, t`Choudhuri (11.18): $11.3\,\Omega_bh^2$ m$^{-3}$, a quarter of a proton per m³.`),
      S('eta', t`Baryon-to-photon ratio $\eta$ (enter e.g. 6e-10).`, 'nb/(ng*1e8)', 'dimensionless', ['dimensionless', 'm^-3', 'K', 'eV'], 0.02, t`$\approx6\times10^{-10}$: 1.6 billion photons per baryon.`),
    ],
  },
  {
    type: 'calc', id: 'c2', title: 'Helium from the Big Bang', fight: 'normal', xp: 30,
    problem: t`n/p freezes at $k_BT_f=0.8$ MeV with $\Delta mc^2=1.29$ MeV. Free neutrons then decay with lifetime $\tau_n=880$ s until fusion starts at $t\approx200$ s.`,
    vars: { dm: 1.293, Tf: 0.8, tau: 880, tn: 200 },
    steps: [
      S('r', t`Frozen ratio $n_n/n_p$.`, 'exp(-dm/Tf)', 'dimensionless', ['dimensionless', 'MeV', 's', 'K'], 0.02, t`Boltzmann factor.`),
      S('Y0', t`Helium mass fraction ignoring decay.`, '2*r/(1+r)', 'dimensionless', ['dimensionless', 'MeV', 's', 'K'], 0.02, t`Choudhuri (11.23): 0.33.`),
      S('Xn', t`Neutron fraction $n_n/(n_n+n_p)$ after decay until $t=200$ s.`, 'r/(1+r)*exp(-tn/tau)', 'dimensionless', ['dimensionless', 'MeV', 's', 'K'], 0.02, t`Total baryons are conserved; neutrons fall as $e^{-t/\tau}$.`),
      S('Y', t`Helium mass fraction with decay, $Y=2X_n$.`, '2*Xn', 'dimensionless', ['dimensionless', 'MeV', 's', 'K'], 0.03, t`≈0.26, close to the observed 0.24–0.25.`),
    ],
  },
  {
    type: 'calc', id: 'c3', title: 'The clock of the early Universe', fight: 'normal', xp: 20,
    problem: t`Use $T=1.52\times10^{10}\,\mathrm K/\sqrt{t/\mathrm s}$ (Choudhuri (10.67)), and $k_B=8.617\times10^{-5}$ eV/K.`,
    vars: { A: 1.52e10, kBeV: 8.617333e-5, T1: 1e10, Td: 0.07e6 },
    steps: [
      S('t1', t`Time (s) when $T=10^{10}$ K.`, '(A/T1)^2', 's', ['s', 'min', 'yr', 'K'], 0.02, t`$t=(A/T)^2$.`),
      S('kT1', t`$k_BT$ in MeV at that time.`, 'kBeV*T1/1e6', 'MeV', ['MeV', 'keV', 'eV', 'K'], 0.02, t`$0.86$ MeV: neutrinos just decoupled, n/p freezing.`),
      S('tD', t`Time (in minutes) when $k_BT=0.07$ MeV (deuterium survives).`, '(A*kBeV/Td)^2/60', 'min', ['min', 's', 'hr', 'yr'], 0.03, t`$T=0.07\,\mathrm{MeV}/k_B=8.1\times10^8$ K: about 6 minutes in this photons-only formula (detailed calculations with neutrinos give ~3–4 min).`),
    ],
  },
  {
    type: 'calc', id: 'c4', title: 'Neutrinos, flatness and growth', fight: 'normal', xp: 30,
    problem: t`(i) $T_\nu=(4/11)^{1/3}T_0$, $T_0=2.725$ K. (ii) Flatness: today $|\Omega-1|=0.01$ at $t_0=13.8$ Gyr; $|\Omega-1|\propto t^{2/3}$ back to $t_{eq}=5\times10^4$ yr, then $\propto t$ back to $t=1$ s. (iii) Growth $\delta\propto a$ from $z=1100$ to today, starting at $10^{-5}$.`,
    vars: { T0: 2.725, t0: 13.8e9, teq: 5e4, yr: 3.15576e7, z: 1100 },
    steps: [
      S('Tnu', t`Neutrino temperature today in K.`, '(4/11)^(1/3)*T0', 'K', ['K', 'eV', 'mK', 'dimensionless'], 0.01, t`$0.714\times2.725$.`),
      S('flat', t`$|\Omega-1|$ at $t=1$ s (enter e.g. 1e-18).`, '0.01*(teq/t0)^(2/3)*(1/(teq*yr))', 'dimensionless', ['dimensionless', 's', 'K', 'eV'], 0.05, t`Fine tuning to 18 decimal places: the flatness problem.`),
      S('delta', t`Density contrast today from baryonic growth only.`, '1e-5*(1+z)', 'dimensionless', ['dimensionless', 's', 'K', 'eV'], 0.02, t`$\approx0.01\ll1$: without dark matter no galaxies would exist yet.`),
    ],
  },
];

room.encounters.push(...lessons, quiz, ...derivations, ...calcs);
export const rooms = { 'early-universe': room };
export const codex = [
  { id: 'Tt', group: 'Early Universe', title: 'Temperature–time relation', tex: t`T\approx\frac{1.5\times10^{10}\,\mathrm K}{\sqrt{t/\mathrm s}},\ k_BT\approx\frac{1.3\,\mathrm{MeV}}{\sqrt{t/\mathrm s}},\ 1\,\mathrm{eV}=1.16\times10^4\,\mathrm K`, meaning: 'Radiation era, photons only.', source: 'Choudhuri (10.67)-(10.69)' },
  { id: 'ngam', group: 'Early Universe', title: 'Photon density and η', tex: t`n_\gamma=\frac{2\zeta(3)}{\pi^2}\left(\frac{k_BT}{\hbar c}\right)^3=4.1\times10^8\,\mathrm{m^{-3}},\ \eta=\frac{n_B}{n_\gamma}\approx6\times10^{-10}`, meaning: 'Constant ratio; sets when bound states survive.', source: 'Choudhuri (11.9)-(11.19)' },
  { id: 'np', group: 'Early Universe', title: 'n/p freeze-out and helium', tex: t`\frac{n_n}{n_p}=e^{-1.29/0.8}\approx0.2\to\tfrac17,\ Y=\frac{2(n/p)}{1+n/p}\approx0.25`, meaning: 'Freeze-out at 0.8 MeV, neutron decay until ~3 min.', source: 'Choudhuri (11.20)-(11.23)' },
  { id: 'Tnu', group: 'Early Universe', title: 'Neutrino background', tex: t`T_\nu=(4/11)^{1/3}T_\gamma=1.95\,\mathrm K,\ \rho_R=1.68\rho_\gamma`, meaning: 'e± annihilation heats only photons.', source: 'Choudhuri §11.4, (10.47)' },
  { id: 'rec', group: 'Early Universe', title: 'Recombination', tex: t`T_{\rm rec}\approx3000\,\mathrm K,\ z\approx1100,\ t\approx3.8\times10^5\,\mathrm{yr}`, meaning: 'Last scattering; CMB δT/T ~ 1e-5.', source: 'Choudhuri §11.7' },
  { id: 'flat', group: 'Early Universe', title: 'Flatness problem', tex: t`|\Omega-1|=\frac{c^2}{\dot a^2}\propto t\ (\text{rad.}),\ \propto t^{2/3}\ (\text{matter})`, meaning: 'Ω = 1 is unstable: inflation.', source: 'Choudhuri (10.70)' },
  { id: 'growth', group: 'Early Universe', title: 'Linear growth', tex: t`\delta\propto a\ \text{(matter era)}`, meaning: 'Baryons alone: 1e-5 × 1100 ≈ 0.01 today; needs dark matter.', source: 'Choudhuri §11.9' },
];
