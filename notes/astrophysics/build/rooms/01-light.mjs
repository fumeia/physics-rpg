// Light Deck additions: theory/intuition lessons, exam multiple choice, derivations (Choudhuri Ch. 1, 2.2-2.3).
import { t, pick, S, exam, choud, P, EQ, INT, PIT, FIG, EXQ, MC } from '../lib.mjs';

const lessons = [
  {
    type: 'lesson', id: 'L1', title: 'Scales of the sky: AU, parsec, parallax', tier: 'intuition', minutes: 6, xp: 10,
    source: [choud('§1.1 (mass, length and time scales), §1.3 (coordinates, parallax)')],
    blocks: [
      P(t`Astronomy measures almost nothing directly except <b>angles</b> and <b>fluxes</b>. Distances, sizes, masses and luminosities are all inferred. The first skill is to move between angles and lengths with the small-angle approximation $\theta\simeq D/d$ (radians).`),
      EQ(t`1\,\mathrm{AU}=1.496\times10^{11}\,\mathrm m,\qquad 1\,\mathrm{pc}=\frac{1\,\mathrm{AU}}{1''}=206\,265\,\mathrm{AU}=3.086\times10^{16}\,\mathrm m\approx3.26\,\mathrm{ly}`, 'The parsec is the distance at which 1 AU subtends 1 arcsecond.'),
      EQ(t`d\,[\mathrm{pc}]=\frac{1}{p\,['']}`, 'Parallax: p is half the yearly back-and-forth shift of a nearby star against the distant background.'),
      INT(t`Ladder of sizes to keep in your head: Sun $7\times10^8$ m; Earth–Sun 1 AU; nearest star (Proxima) 1.3 pc; Sun–Galactic centre 8 kpc; Milky Way disk radius ~15 kpc; Andromeda 0.77 Mpc; a rich cluster ~2 Mpc across; observable Universe ~$10^4$ Mpc. Each step is roughly a factor of $10^3$–$10^5$.`),
      P(t`Angles you will need: $1^\circ=\pi/180$ rad, $1'=1^\circ/60$, $1''=1'/60=4.85\times10^{-6}$ rad. A telescope of diameter $D$ resolves at best $\theta\simeq1.22\lambda/D$ (Rayleigh criterion, diffraction limit); the eye resolves about $1'$.`),
      PIT(t`Parallax halves when distance doubles: $p\propto1/d$ (HS24 summer MC1: four times further means $p/4$, not $p/16$). And for "how far away is a star at $l=180^\circ$" draw the picture: longitude $180^\circ$ points away from the Galactic centre, so distances add.`),
      EXQ(t`MC: parallax to distance, Galactic geometry. Open: "how far away would the Sun no longer be resolved" (HS25 winter Q1), "is the Moon resolved by a 6 m CMB telescope at 150 GHz" (HS25 practice Q1).`),
    ],
    check: [
      MC(t`Barnard's Star has a parallax of 547 milliarcseconds. Its distance is about`, ['1.8 pc', '18 pc', '180 pc', '0.55 pc'], 0, t`$d=1/p=1/0.547''\approx1.8$ pc.`, exam('w25', 'MC 2')),
      MC(t`A telescope with a 6 m mirror observes at $\lambda=2$ mm. Its resolution is about`, ['1.4 arcsec', '1.4 arcmin', '1.4 degree', '0.5 degree'], 1, t`$1.22\lambda/D=4.1\times10^{-4}$ rad $=1.4'$. The Moon ($30'$) is resolved.`, exam('p25', 'open Q1')),
    ],
  },
  {
    type: 'lesson', id: 'L2', title: 'Magnitudes: a backwards logarithmic scale', tier: 'theory', minutes: 10, xp: 15,
    source: [choud('§1.4 Magnitude scale'), exam('w25', 'MC 1'), exam('w24', 'MC 1-2'), exam('p25', 'MC 1')],
    blocks: [
      P(t`The eye responds roughly logarithmically, so Hipparchus' brightness classes became a logarithmic scale. Five magnitudes are <b>exactly</b> a factor 100 in flux; a <b>larger</b> magnitude means <b>fainter</b>.`),
      EQ(t`m_1-m_2=-2.5\log_{10}\frac{F_1}{F_2}\qquad\Longleftrightarrow\qquad\frac{F_1}{F_2}=10^{-0.4(m_1-m_2)}`, 'Apparent magnitude compares fluxes. 1 mag = factor 2.512.'),
      P(t`The <b>absolute magnitude</b> $M$ is the apparent magnitude the object would have at 10 pc. Since $F\propto L/d^2$, comparing the same object at $d$ and at 10 pc gives the distance modulus. Interstellar dust adds an extinction $A_\lambda>0$ (in magnitudes).`),
      EQ(t`m-M=5\log_{10}\frac{d}{10\,\mathrm{pc}}+A_\lambda`, 'Distance modulus with extinction.'),
      P(t`A <b>colour index</b> is a difference of magnitudes in two filters, e.g. $B-V=m_B-m_V$. Small (or negative) $B-V$ means relatively more flux in the bluer $B$ band, i.e. a hotter star. The colour does not depend on distance (both bands dim equally), so it measures temperature, not brightness.`),
      INT(t`Memorise anchors: $\Delta m=5\Rightarrow100\times$, $\Delta m=2.5\Rightarrow10\times$, $\Delta m=1\Rightarrow2.5\times$, $\Delta m=4\Rightarrow40\times$. The Sun is $m=-26.8$, the faintest naked-eye stars $m\approx6$–$7$. The Sun's absolute magnitude is $M\approx4.8$: a very ordinary star.`),
      PIT(t`Two traps: (1) the sign: brighter = smaller $m$; (2) flux goes as $d^{-2}$, so distance enters with $5\log_{10}$, not $2.5\log_{10}$. Extinction makes $m$ larger (fainter): $m=M+5\log_{10}(d/10\,\mathrm{pc})+A$.`),
      EXQ(t`Every exam: flux ratio from $\Delta m$ (MC), distance from $m$ and $M$ (MC), SN Ia apparent magnitude (HS24 summer Q1), limiting distance for the naked eye (HS25 winter Q1b).`),
    ],
    check: [
      MC(t`Two stars have $m_1=9$ and $m_2=13$. $F_1/F_2\approx$`, ['5', '15', '20', '40'], 3, t`$10^{0.4\cdot4}=10^{1.6}=39.8$.`, exam('w25', 'MC 1')),
      MC(t`$M=1.0$, $d=100$ pc, extinction $A=0.2$. Apparent magnitude?`, ['5.2', '6.2', '6.7', '7.2'], 1, t`$m=1+5\log_{10}(10)+0.2=6.2$.`, exam('p25', 'MC 1')),
      MC(t`Star S1 has $B-V=0.5$, star S2 has $B-V=1.0$. Which must be true?`, ['S1 emits relatively more short-wavelength light than S2', 'S2 emits relatively more short-wavelength light', 'S1 is brighter than S2', 'S2 is more distant'], 0, t`Smaller $B-V$: relatively brighter in $B$ (blue). Colour says nothing about distance or total brightness.`, exam('w24', 'MC 2')),
    ],
  },
  {
    type: 'lesson', id: 'L3', title: 'Blackbody radiation: Planck, Wien, Stefan–Boltzmann', tier: 'theory', minutes: 12, xp: 15,
    source: [choud('§2.2.1 eq. (2.1), (2.6); §2.3'), exam('w25', 'MC 4, open Q2-Q3'), exam('s24', 'open Q2')],
    blocks: [
      P(t`A blackbody is matter in thermal equilibrium with its radiation: it absorbs everything and emits a spectrum fixed by $T$ alone. Its specific intensity is the Planck function (Choudhuri (2.6)).`),
      EQ(t`B_\nu(T)=\frac{2h\nu^3}{c^2}\,\frac{1}{e^{h\nu/k_BT}-1}\qquad[\mathrm{W\,m^{-2}\,Hz^{-1}\,sr^{-1}}]`),
      P(t`Three limits/integrals you must be able to state and use:`),
      EQ(t`\text{Rayleigh–Jeans }(h\nu\ll k_BT):\ B_\nu\simeq\frac{2k_BT\nu^2}{c^2}\qquad\text{Wien }(h\nu\gg k_BT):\ B_\nu\simeq\frac{2h\nu^3}{c^2}e^{-h\nu/k_BT}`),
      EQ(t`\lambda_{\max}T=b=2.898\times10^{-3}\,\mathrm{m\,K},\qquad u=a_BT^4,\qquad F=\sigma_{SB}T^4,\qquad L=4\pi R^2\sigma_{SB}T_{\rm eff}^4`, 'Wien displacement, energy density, emergent flux, luminosity. The last one defines the effective temperature of a star.'),
      INT(t`Increase $T$ and the whole curve moves <b>up and to the right</b>: $\partial B_\nu/\partial T>0$ at every $\nu$ (HS25 winter Q2a), so blackbody curves of different temperature never cross. Hotter stars are brighter at every wavelength and bluer. The RJ tail is linear in $T$: that is why radio astronomers quote brightness as a temperature.`),
      FIG(t`Plot $\log B_\nu$ against $\log\nu$: a rising straight line of slope 2 (RJ), a peak at $h\nu\approx2.8k_BT$, then an exponential cliff (Wien). The CMB (2.73 K) peaks near 160 GHz (mm waves), the Sun (5770 K) near 500 nm in $\lambda$.`),
      PIT(t`$\lambda_{\max}$ from $B_\lambda$ and $\nu_{\max}$ from $B_\nu$ are <b>not</b> related by $\lambda=c/\nu$: the two distributions have different peaks because $d\nu\neq d\lambda$. Use $\lambda_{\max}T=2.898$ mm K only for wavelength peaks. And RJ requires $\nu\ll k_BT/h$ (57 GHz for the CMB), so at 100 GHz you must use the full Planck formula.`),
      EXQ(t`MC: $u\propto T^4$, colour vs temperature. Open: derive RJ by expanding $e^x\approx1+x$ (HS24 summer Q2a), CMB power on a bolometer, temperature fluctuation from $\partial B/\partial T$, dust vs CMB (HS25 winter Q2), Wien peak of a 10 $M_\odot$ star (Q3).`),
    ],
    check: [
      MC(t`The total energy density of blackbody radiation scales as`, [t`$T$`, t`$T^2$`, t`$T^{-1}$`, t`$T^4$`], 3, t`$U=\int U_\nu d\nu=a_BT^4$ with $a_B=8\pi^5k_B^4/(15c^3h^3)$.`, exam('w25', 'MC 4')),
      MC(t`Hotter stars appear bluer because`, [t`their spectrum peaks at higher $\nu_{\max}$`, t`their spectrum peaks at lower $\nu_{\max}$`, 'they are closer', 'they have more metals'], 0, t`Wien: $\nu_{\max}\propto T$.`, exam('s24', 'MC 6')),
      MC(t`In the Rayleigh–Jeans regime, doubling $T$ multiplies $B_\nu$ by`, ['2', '4', '16', t`$e^2$`], 0, t`$B_\nu\simeq2k_BT\nu^2/c^2$ is linear in $T$.`),
    ],
  },
];

const quiz = {
  type: 'quiz', id: 'Q1', title: 'Light Deck multiple choice', xp: 30, passMark: 0.75,
  source: [exam('w25', 'MC'), exam('s24', 'MC'), exam('w24', 'MC'), exam('p25', 'MC')],
  questions: [
    MC(t`Star S1 has parallax $0.25''$. Star S2 is four times further away. Parallax of S2?`, [t`$1.00''$`, t`$0.50''$`, t`$0.0625''$`, t`$0.125''$`], 2, t`$p\propto1/d$: $0.25''/4$.`, exam('s24', 'MC 1')),
    MC(t`The Sun is 8 kpc from the Galactic centre. A star 10 kpc from us at $l=180^\circ$, $b=0^\circ$ is how far from the centre?`, ['2 kpc', '8 kpc', '10 kpc', '18 kpc'], 3, t`$l=180^\circ$ is the anticentre direction: $8+10$ kpc.`, exam('s24', 'MC 2')),
    MC(t`Naked-eye limit $m=6.5$. Out to what distance is a star with $M=4$ visible (no extinction)?`, ['~10 pc', '~30 pc', '~50 pc', '~100 pc'], 1, t`$5\log_{10}(d/10)<2.5\Rightarrow d<10^{1.5}\cdot10=32$ pc.`, exam('w24', 'MC 1')),
    MC(t`In terms of spectral classification, the Sun is a`, ['class O main-sequence star', 'class G main-sequence star', 'white dwarf', 'class M red giant'], 1, t`OBAFGKM from hot to cool; the Sun is G2V.`, exam('p25', 'MC 5')),
    MC(t`Which pairs a radiative quantity with a <b>wrong</b> SI unit?`, [t`$I_\nu$: W m$^{-2}$ sr$^{-1}$ Hz$^{-1}$`, t`$F_\nu$: W m$^{-2}$`, t`$j_\nu$: W m$^{-3}$ sr$^{-1}$ Hz$^{-1}$`, 'none of the above'], 1, t`Specific flux is per Hz: W m$^{-2}$ Hz$^{-1}$ (= Jy $\times10^{26}$).`, exam('s24', 'MC 4')),
    MC(t`A 21 cm line is observed at 700 MHz. Redshift of emission?`, [t`$z\approx0.3$`, t`$z\approx0.5$`, t`$z\approx1$`, t`$z\approx2$`], 2, t`$\lambda_{obs}=c/700\,$MHz$=43$ cm; $1+z=43/21\approx2$.`, exam('w25', 'MC 14')),
  ],
};

const derivations = [
  {
    type: 'derive', id: 'D1', title: 'Rayleigh–Jeans limit of the Planck law', xp: 25,
    source: exam('s24', 'open Q2(a) [3 pt]'),
    goal: t`Starting from $B_\nu(T)=\frac{2h\nu^3}{c^2}\frac{1}{e^{h\nu/k_BT}-1}$, derive $B_{\nu,RJ}=\frac{2k_BT}{c^2}\nu^2$ for $h\nu\ll k_BT$, and give the limiting frequency for the CMB ($T=2.725$ K) in GHz.`,
    given: [t`$h=6.626\times10^{-34}$ J s`, t`$k_B=1.381\times10^{-23}$ J/K`],
    steps: [
      { prompt: 'Introduce a dimensionless variable that makes the small parameter visible.', reveal: t`$x=h\nu/k_BT$, so $B_\nu=\frac{2k_B^3T^3}{h^2c^2}\frac{x^3}{e^x-1}$.` },
      { prompt: 'Expand the denominator for $x\ll1$.', reveal: t`$e^x-1=x+O(x^2)$, so $\frac{x^3}{e^x-1}\simeq x^2$.` },
      { prompt: 'Substitute back.', reveal: t`$B_\nu\simeq\frac{2k_B^3T^3}{h^2c^2}\frac{h^2\nu^2}{k_B^2T^2}=\frac{2k_BT\nu^2}{c^2}$. Planck's constant drops out: RJ is the classical (equipartition) result.` },
      { prompt: 'Limit for the CMB.', reveal: t`$\nu\ll k_BT/h=1.381\times10^{-23}\cdot2.725/6.626\times10^{-34}=5.7\times10^{10}$ Hz $=57$ GHz.` },
    ],
    keyPoints: ['dimensionless $x$', 'first-order expansion of $e^x$', 'clean final form without $h$', '57 GHz with units'],
  },
  {
    type: 'derive', id: 'D2', title: 'Why specific intensity is conserved in empty space', xp: 20,
    source: exam('p25', 'MC 2 (solution) and Choudhuri §2.2.2 eq. (2.10)'),
    goal: t`Show that $I_\nu$ is the same at both ends of a ray in vacuum, and explain why a distant resolved galaxy has the same surface brightness as a nearby one.`,
    given: [t`$dE=I_\nu\,dA\,d\Omega\,d\nu\,dt$`],
    steps: [
      { prompt: 'Take two small areas $dA_1$, $dA_2$ perpendicular to the ray, a distance $R$ apart. Write the energy through both, seen from each end.', reveal: t`$I_{\nu1}dA_1d\Omega_1\,d\nu\,dt=I_{\nu2}dA_2d\Omega_2\,d\nu\,dt$, where $d\Omega_1$ is the solid angle of $dA_2$ seen from $dA_1$ and vice versa.` },
      { prompt: 'Express the solid angles through the areas.', reveal: t`$d\Omega_1=dA_2/R^2$, $d\Omega_2=dA_1/R^2$. Then both sides contain $dA_1dA_2/R^2$, so $I_{\nu1}=I_{\nu2}$: $dI_\nu/ds=0$.` },
      { prompt: 'Interpret.', reveal: t`Flux falls as $R^{-2}$ but so does the solid angle of the source; their ratio (surface brightness) is constant. Unresolved stars still look dimmer because their image size is set by diffraction/seeing, not by their true angular size.` },
    ],
    keyPoints: ['energy balance through two areas', 'solid angles $dA/R^2$', 'flux and solid angle both $\\propto R^{-2}$'],
  },
];

const calcs = [
  {
    type: 'calc', id: 'c5', title: 'Is the Moon a good calibrator for a CMB telescope?', fight: 'normal', xp: 25,
    problem: t`A CMB telescope with a mirror of diameter $D=6$ m observes at $150$ GHz. The Moon spans $0.5^\circ$. Use the Rayleigh criterion $\theta\simeq1.22\lambda/D$.`,
    vars: { ...pick('c'), nu: 150e9, D: 6 },
    steps: [
      S('lam', t`Observing wavelength in mm.`, 'c/nu*1e3', 'mm', ['mm', 'm', 'µm', 'GHz'], 0.02, t`$\lambda=c/\nu$.`),
      S('th', t`Resolution in arcmin.`, '1.22*lam*1e-3/D*180/pi*60', 'arcmin', ['arcmin', 'arcsec', 'deg', 'rad'], 0.02, t`$\theta=1.22\lambda/D$ in rad, times $180/\pi$ for degrees, times 60 for arcmin.`),
      S('ratio', t`How many resolution elements fit across the Moon? ($30'/\theta$)`, '30/th', 'dimensionless', ['dimensionless', 'arcmin', 'deg', 'rad'], 0.03, t`About 21: the Moon is well resolved, so it is not a point-source calibrator.`),
    ],
  },
  {
    type: 'calc', id: 'c6', title: 'Quick fight: how far can the eye see a Sun-like star?', fight: 'fermi', xp: 15,
    problem: t`The naked eye sees stars with $m<6.5$. A star with absolute magnitude $M=4$ (a bit brighter than the Sun) is visible out to which distance? No extinction. Within 25 %.`,
    vars: { m: 6.5, M: 4 },
    steps: [S('d', t`Limiting distance in pc.`, '10*10^((m-M)/5)', 'pc', ['pc', 'kpc', 'AU', 'ly'], 0.1, t`$m-M=5\log_{10}(d/10\,\mathrm{pc})$.`, { tolType: 'log' })],
  },
  {
    type: 'calc', id: 'c7', title: 'The Sun as a blackbody', fight: 'normal', xp: 25,
    problem: t`Treat the Sun as a blackbody with $R_\odot=6.957\times10^8$ m and $T_{\rm eff}=5772$ K. $\sigma_{SB}=5.670\times10^{-8}$ W m$^{-2}$ K$^{-4}$.`,
    vars: { ...pick('Rsun', 'sigSB', 'AU'), T: 5772 },
    steps: [
      S('L', t`Luminosity $L=4\pi R^2\sigma_{SB}T^4$ in units of $10^{26}$ W.`, '4*pi*Rsun^2*sigSB*T^4/1e26', '10^26 W', ['10^26 W', 'W m^-2', 'J', 'erg'], 0.02, t`$\approx3.83\times10^{26}$ W: this is how $L_\odot$ is defined in practice.`),
      S('F', t`Solar constant: flux at 1 AU, in W/m$^2$.`, 'L*1e26/(4*pi*AU^2)', 'W m^-2', ['W m^-2', 'W', 'W m^-2 Hz^-1', 'Jy'], 0.02, t`$F=L/4\pi d^2$ with $d=1$ AU: about 1360 W/m$^2$.`),
    ],
  },
];

const codex = [
  { id: 'pc', group: 'Distances and angles', title: 'Parallax and parsec', tex: t`d[\mathrm{pc}]=1/p[''],\ 1\,\mathrm{pc}=206265\,\mathrm{AU}=3.086\times10^{16}\,\mathrm m`, meaning: 'Distance from the yearly parallax angle.', source: 'Choudhuri §1.3' },
  { id: 'rayleigh', group: 'Distances and angles', title: 'Diffraction limit', tex: t`\theta\simeq1.22\,\lambda/D`, meaning: 'Smallest resolvable angle of a circular aperture.', when: 'telescope resolution questions', source: 'HS25 practice Q1' },
  { id: 'mag', group: 'Photometry', title: 'Magnitudes', tex: t`m_1-m_2=-2.5\log_{10}(F_1/F_2)`, meaning: '5 mag = factor 100; larger m = fainter.', source: 'Choudhuri §1.4' },
  { id: 'dmod', group: 'Photometry', title: 'Distance modulus', tex: t`m-M=5\log_{10}(d/10\,\mathrm{pc})+A_\lambda`, meaning: 'M = magnitude at 10 pc; A = extinction in mag.', source: 'Choudhuri §1.4' },
  { id: 'ext', group: 'Photometry', title: 'Extinction as a flux ratio', tex: t`F_{\rm ext}/F_0=10^{-A/2.5}`, meaning: 'Dimming by dust.', source: 'HS24 summer Q4' },
  { id: 'planck', group: 'Radiation', title: 'Planck function', tex: t`B_\nu=\frac{2h\nu^3}{c^2}\frac{1}{e^{h\nu/k_BT}-1}`, meaning: 'Specific intensity of a blackbody.', source: 'Choudhuri (2.6)' },
  { id: 'dBdT', group: 'Radiation', title: 'Temperature derivative of Planck', tex: t`\frac{\partial B_\nu}{\partial T}=\frac{2h\nu^3}{c^2T}\frac{xe^x}{(e^x-1)^2},\ x=\frac{h\nu}{k_BT}`, meaning: 'Converts intensity fluctuations to temperature fluctuations; always > 0.', source: 'HS24 summer Q2c' },
  { id: 'rj', group: 'Radiation', title: 'Rayleigh–Jeans limit', tex: t`B_\nu\simeq2k_BT\nu^2/c^2\quad(h\nu\ll k_BT)`, meaning: 'Classical limit, linear in T. CMB: valid below 57 GHz.', source: 'HS24 summer Q2a' },
  { id: 'wien', group: 'Radiation', title: 'Wien displacement', tex: t`\lambda_{\max}T=2.898\times10^{-3}\,\mathrm{m\,K}`, meaning: 'Peak wavelength of B_λ.', source: 'HS25 winter Q3' },
  { id: 'sb', group: 'Radiation', title: 'Stefan–Boltzmann', tex: t`u=a_BT^4,\ F=\sigma_{SB}T^4=\tfrac{c}{4}a_BT^4,\ L=4\pi R^2\sigma_{SB}T_{\rm eff}^4`, meaning: 'Energy density, emergent flux, stellar luminosity (defines T_eff).', source: 'Choudhuri §2.2' },
  { id: 'Lfd', group: 'Photometry', title: 'Flux from luminosity', tex: t`F=\frac{L}{4\pi d^2}`, meaning: 'Inverse-square law (no extinction, no cosmology).' },
];

export const extend = { 'photometry-radiation': [...lessons, quiz, ...derivations, ...calcs] };
export const sources = { 'photometry-radiation': [exam('w24', 'MC 1-2'), exam('p25', 'MC 1, 5; open Q1')] };
export { codex };
