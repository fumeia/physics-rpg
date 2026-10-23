// New room: The Fog Chamber (radiative transfer, Choudhuri Ch. 2.2-2.8). MC on this appears in every exam.
import { t, pick, S, exam, choud, P, EQ, INT, PIT, FIG, EXQ, MC } from '../lib.mjs';

const room = {
  id: 'astro-radiative-transfer', region: 'Astro Observatory Ship', title: 'The Fog Chamber', course: 'astrophysics',
  topics: ['specific intensity', 'radiative transfer equation', 'optical depth', 'source function', 'Kirchhoff law', 'LTE', 'grey atmosphere', 'limb darkening', 'opacity', 'photon diffusion'],
  sources: [
    choud('Ch. 2.2 (radiative transfer, eqs. 2.2-2.19), 2.3 (LTE, Kirchhoff 2.26), 2.4 (grey atmosphere 2.62-2.70), 2.5-2.6 (Rosseland, Kramers 2.79, Thomson 2.85), 2.8 (photon diffusion), exercises 2.5, 2.7'),
    exam('w24', 'MC 3, 4, 9'), exam('p25', 'MC 2, 3, 4'), exam('s24', 'MC 3, 4'), exam('w25', 'MC 3'),
  ],
  intro: t`The ship's observation chamber is full of fog. How much starlight gets through depends on one number, the optical depth $\tau$, and on what the fog emits itself, the source function $S_\nu$. This is the language of every spectrum you will ever read, and every exam has multiple-choice questions on it.`,
  encounters: [],
};

const lessons = [
  {
    type: 'lesson', id: 'L1', title: 'What specific intensity is, and what is derived from it', tier: 'theory', minutes: 10, xp: 15,
    source: [choud('§2.2.1, eqs. (2.2)-(2.9)')],
    blocks: [
      P(t`The most complete description of a radiation field is the <b>specific intensity</b> $I_\nu(\mathbf r,\hat n)$: energy per time, per area perpendicular to the ray, per solid angle, per frequency (Choudhuri (2.2)):`),
      EQ(t`dE_\nu=I_\nu\cos\theta\,dA\,dt\,d\Omega\,d\nu\qquad[I_\nu]=\mathrm{W\,m^{-2}\,Hz^{-1}\,sr^{-1}}`),
      P(t`Everything else is an angular moment of $I_\nu$:`),
      EQ(t`F_\nu=\oint I_\nu\cos\theta\,d\Omega,\qquad U_\nu=\frac1c\oint I_\nu\,d\Omega,\qquad P_\nu=\frac1c\oint I_\nu\cos^2\theta\,d\Omega`, 'Flux, energy density, radiation pressure.'),
      P(t`For isotropic radiation: $F_\nu=0$ (as much goes up as down), $U_\nu=4\pi I_\nu/c$ and $P_\nu=U_\nu/3$. Inside a star the field is <i>almost</i> isotropic; the tiny anisotropy carries the whole luminosity.`),
      INT(t`$I_\nu$ is <b>surface brightness</b>. Flux is "how much light lands on my detector"; intensity is "how bright does the surface look". Walk away from a street lamp: the flux drops as $d^{-2}$ but the lamp's surface looks just as bright, it only gets smaller. In vacuum $dI_\nu/ds=0$.`),
      PIT(t`Units are a favourite MC: $I_\nu$ has sr$^{-1}$ and Hz$^{-1}$; $F_\nu$ has Hz$^{-1}$ but no sr$^{-1}$; $F$ (bolometric) has neither. 1 Jy $=10^{-26}$ W m$^{-2}$ Hz$^{-1}$ is a unit of $F_\nu$; MJy/sr is a unit of $I_\nu$.`),
    ],
    check: [
      MC(t`In empty space $I_\nu$ is constant along a ray because`, ['the energy density is conserved', 'both the received flux and the solid angle of the source fall as the inverse square of distance', 'the radiation field is isotropic', 'the flux averaged over directions is zero'], 1, t`Ratio of two quantities that both scale as $d^{-2}$.`, exam('w25', 'MC 3')),
      MC(t`For an isotropic radiation field the radiation pressure is`, [t`$U$`, t`$U/3$`, t`$U/2$`, '0'], 1, t`$\langle\cos^2\theta\rangle=1/3$ over the sphere.`),
    ],
  },
  {
    type: 'lesson', id: 'L2', title: 'The transfer equation, optical depth and the source function', tier: 'theory', minutes: 15, xp: 20,
    source: [choud('§2.2.2-2.2.3, eqs. (2.12)-(2.19)'), exam('w24', 'MC 4')],
    blocks: [
      P(t`Along a ray through matter, emission adds intensity and absorption removes a fraction proportional to what is there:`),
      EQ(t`\frac{dI_\nu}{ds}=j_\nu-\alpha_\nu I_\nu`, 'Radiative transfer equation (2.12). jν: emission coefficient, αν: absorption coefficient [m⁻¹].'),
      P(t`Measure path length in units of the mean free path, $d\tau_\nu=\alpha_\nu ds$, and define the source function $S_\nu=j_\nu/\alpha_\nu$. Then`),
      EQ(t`\frac{dI_\nu}{d\tau_\nu}=-I_\nu+S_\nu\quad\Rightarrow\quad I_\nu(\tau_\nu)=I_\nu(0)\,e^{-\tau_\nu}+S_\nu\left(1-e^{-\tau_\nu}\right)\ \ (S_\nu\ \text{const.})`),
      INT(t`Read the solution as a tug of war: the background $I_\nu(0)$ is extinguished by $e^{-\tau}$, and the medium "pulls" the intensity towards its own $S_\nu$. Optically <b>thick</b> ($\tau\gg1$): you see $I_\nu\to S_\nu$, only the surface layer ($\tau\lesssim1$), nothing behind. Optically <b>thin</b> ($\tau\ll1$): $I_\nu\approx I_\nu(0)+S_\nu\tau_\nu$, every atom along the line of sight contributes.`),
      P(t`The opacity $\chi$ (per mass, m$^2$/kg) relates to the absorption coefficient by $\alpha=\chi\rho$. So $\tau=\int\chi\rho\,ds$: what matters is the <b>column</b> $\int\rho\,ds$, not the density or length separately.`),
      PIT(t`Do not mix the thick/thin limits up: thick $\Rightarrow I\simeq S$ (independent of $\tau$); thin $\Rightarrow I\simeq S\tau$. And emission lines vs absorption lines: looking at a hot background through a cooler layer ($S<I(0)$) gives absorption lines; a hot thin gas against a dark sky gives emission lines.`),
      EXQ(t`HS24 winter MC4 (thick/thin limits), HS24 summer MC3 (two clouds, compare $\tau$), HS25 practice MC3 (an optically thick cloud can only be studied at its surface).`),
    ],
    check: [
      MC(t`For matter with constant properties, the relation between $I_\nu$ and $S_\nu$ is`, [t`$I\simeq S$ if thick, $I\simeq S\tau$ if thin`, t`$I\simeq S$ if thin, $I\simeq S\tau$ if thick`, t`$I\simeq S$ always`, t`$I\simeq Se^{-\tau}$ always`], 0, t`$I=S(1-e^{-\tau})$; expand for small $\tau$.`, exam('w24', 'MC 4')),
      MC(t`Cloud 1: density $\rho_0$, diameter $D$. Cloud 2: $2\rho_0$, $D/2$. Same opacity. Through the centre,`, [t`$\tau_1=\tau_2$`, t`$\tau_1=\tau_2/2$`, t`$\tau_1=2\tau_2$`, t`$\tau_1=4\tau_2$`], 0, t`$\tau=\chi\rho L$ is the same column.`, exam('s24', 'MC 3')),
      MC(t`A dust cloud with very large optical depth at the observed frequency can be studied`, ['not at all', 'only in its core', 'without any effect of the optical depth', 'only at its surface'], 3, t`We see down to $\tau\sim1$.`, exam('p25', 'MC 3')),
    ],
  },
  {
    type: 'lesson', id: 'L3', title: 'Thermodynamic equilibrium, LTE and Kirchhoff', tier: 'intuition', minutes: 8, xp: 10,
    source: [choud('§2.3.1-2.3.3, eqs. (2.26)-(2.29)'), exam('w24', 'MC 3')],
    blocks: [
      P(t`In full thermodynamic equilibrium four laws hold at one temperature $T$: Maxwell velocities, Boltzmann level populations $n_2/n_1\propto e^{-\Delta E/k_BT}$, Saha ionisation, and Planck radiation. A star is not in global equilibrium (it is hot inside, cool outside), but if particles and photons travel only a short distance (mean free path $l$) compared with the scale $L$ over which $T$ changes, each small region has its own well-defined $T$: <b>local thermodynamic equilibrium</b> (LTE).`),
      EQ(t`\text{LTE:}\quad l\ll L,\qquad S_\nu=\frac{j_\nu}{\alpha_\nu}=B_\nu(T)\quad\text{(Kirchhoff's law (2.26))}`),
      INT(t`Kirchhoff says good absorbers are good emitters. If a gas in LTE absorbs strongly at a line frequency, it emits strongly there too, in exactly the ratio that would keep a blackbody field in balance.`),
      PIT(t`Kirchhoff's law does not hold for scattering (Thomson scattering redirects photons, it does not thermally emit them). In the exam: "local but not global equilibrium" = variables depend on position and/or time AND $l\ll L$.`),
      FIG(t`Saha equation (2.29): $\frac{x^2}{1-x}=\frac{(2\pi m_e)^{3/2}(k_BT)^{5/2}}{h^3P}e^{-\chi/k_BT}$. Plotting the ionised fraction $x$ against $T$ for hydrogen gives a steep S-curve whose position depends on density (pressure). At a stellar-photosphere density ($\rho\sim10^{-4}$ kg m$^{-3}$) hydrogen is half ionised at about $13\,500$ K, i.e. at $k_BT\approx\chi/11$, far below $\chi=13.6$ eV: there are so many more free states (phase space) than bound ones that ionisation wins long before typical photons carry 13.6 eV. (Checked numerically with (2.29); at the higher density of air, half ionisation needs ~$44\,000$ K.) The same argument explains why cosmic recombination happens at only ~3000 K.`),
    ],
    check: [
      MC(t`A system of size $L$ with mean free path $l$ is in local but not global thermal equilibrium if $T$ and $P$`, [t`are constant and $l\gg L$`, t`are constant and $l\ll L$`, t`depend on time and/or position and $l\gg L$`, t`depend on time and/or position and $l\ll L$`], 3, t`Local: frequent collisions ($l\ll L$). Not global: gradients exist.`, exam('w24', 'MC 3')),
    ],
  },
  {
    type: 'lesson', id: 'L4', title: 'Stellar atmospheres: why the Sun has a sharp edge and a dark limb', tier: 'theory', minutes: 12, xp: 15,
    source: [choud('§2.4.1-2.4.2, eqs. (2.62)-(2.70), Fig. 2.6')],
    blocks: [
      P(t`In a plane-parallel atmosphere we measure depth by the vertical optical depth $\tau$ (zero at the top, growing inwards) and directions by $\mu=\cos\theta$. For a grey atmosphere ($\alpha$ independent of $\nu$) with constant flux $F$ and the <b>Eddington approximation</b> $P=U/3$ everywhere, Choudhuri derives`),
      EQ(t`S(\tau)=\frac{3F}{4\pi}\left(\tau+\frac23\right),\qquad T^4=\frac34T_{\rm eff}^4\left(\tau+\frac23\right)`, '(2.68)-(2.69): the temperature equals T_eff at τ = 2/3.'),
      EQ(t`\frac{I(0,\mu)}{I(0,1)}=\frac35\left(\mu+\frac23\right)`, '(2.70) limb-darkening law: at the limb (μ = 0) the intensity is 40 % of the disk centre.'),
      INT(t`You can see about one optical depth into any gas. At the disk centre your line of sight goes straight down and reaches $\tau=1$ deep, where it is hot. Near the limb you look in obliquely and reach $\tau=1$ (vertical depth $\mu$) much higher up, where it is cooler: the limb is darker and redder. The "surface" of the Sun is just the layer where $\tau\approx2/3$; because opacity rises steeply with depth this layer is only a few hundred km thick, so the edge looks sharp.`),
      P(t`Spectral lines: at a line frequency $\alpha_\nu$ is larger, so $\tau_\nu=1$ is reached higher up, where it is cooler, and $S_\nu=B_\nu(T)$ is smaller: an absorption line. The <b>equivalent width</b> $W$ (the width of a rectangle of zero intensity with the same area as the line) measures line strength. The <b>curve of growth</b> is $W$ against the column density of absorbers: linear when the line is thin, then saturating (flat), then $\propto\sqrt N$ when the damping wings take over.`),
      PIT(t`The curve of growth relates <b>equivalent width</b> and <b>column density</b> (HS24 winter MC9), not perturbation amplitude vs time, not AGN mass vs luminosity.`),
    ],
    check: [
      MC(t`The "curve of growth" relates`, ['the equivalent width of a line and the column density of absorbers', 'perturbation amplitude and time', 'Einstein coefficients and the level spacing', 'AGN luminosity and black-hole mass'], 0, t`Used to measure abundances from absorption lines.`, exam('w24', 'MC 9')),
      MC(t`In the Eddington grey atmosphere, the temperature equals $T_{\rm eff}$ at optical depth`, ['0', '1/3', '2/3', '1'], 2, t`$T^4=\frac34T_{\rm eff}^4(\tau+\frac23)$.`),
    ],
  },
  {
    type: 'lesson', id: 'L5', title: 'Energy transport in the interior: diffusion, opacity, convection', tier: 'theory', minutes: 12, xp: 15,
    source: [choud('§2.5 (Rosseland mean 2.76-2.78), §2.6 (Kramers 2.79, Thomson 2.84-2.85), §2.8 (photon diffusion), §3.2.4 (convection)'), exam('p25', 'MC 4, open Q2(c)')],
    blocks: [
      P(t`Deep inside a star the radiation field is nearly isotropic and the flux is driven by the gradient of radiation pressure, $F=-\frac{c}{\alpha}\frac{dP_{\rm rad}}{dr}$ (with $\alpha=\chi\rho$, $\chi$ the Rosseland mean opacity). With $P_{\rm rad}=\frac13a_BT^4$ and $F=L_r/4\pi r^2$:`),
      EQ(t`\frac{dT}{dr}=-\frac{3}{4a_Bc}\,\frac{\chi\rho}{T^3}\,\frac{L_r}{4\pi r^2}`, 'Radiative temperature gradient (as given in the HS25 practice exam Q2c).'),
      P(t`Opacity laws you need: electron (Thomson) scattering, $\chi_T=n_e\sigma_T/\rho=\sigma_T/m_H=0.04$ m$^2$/kg for ionised hydrogen, independent of $T$ and $\rho$; bound-free and free-free absorption follow <b>Kramers' law</b> $\chi\propto\rho\,T^{-3.5}$.`),
      INT(t`A photon in the Sun travels only ~1 cm before it is absorbed and re-emitted in a random direction. After $N$ steps of length $l$ it has moved $\sqrt N\,l$. To get out ($R_\odot=7\times10^8$ m) it needs $N=(R/l)^2\sim10^{22}$ steps: a path of $10^{20}$ m, i.e. $10^4$ years or more of travel for a trip light would do in 2 s in vacuum.`),
      P(t`When the radiative gradient becomes too steep (high opacity, or huge energy generation in a small core), a rising blob of gas stays hotter and lighter than its surroundings and keeps rising: <b>convection</b>. The Schwarzschild criterion for stability against convection is`),
      EQ(t`\left|\frac{dT}{dr}\right|<\left(1-\frac1\gamma\right)\frac TP\left|\frac{dP}{dr}\right|`, 'Stable (no convection) when the actual temperature gradient is shallower than the adiabatic one.'),
      PIT(t`The Schwarzschild condition as written in the exam ($dT/dr<(1-1/\gamma)(T/P)\,dP/dr$ written with magnitudes of the gradients, HS25 practice MC4) describes material that is <b>stable</b> against convection: energy is then carried by radiation. The Sun is radiative inside $0.7R_\odot$ and convective outside.`),
    ],
    check: [
      MC(t`When the Schwarzschild criterion holds, the stellar material is`, ['stable against convection', 'unable to transport energy radiatively', 'stable to conduction', 'efficiently convective'], 0, t`The criterion is the condition for convective stability.`, exam('p25', 'MC 4')),
      MC(t`Kramers' opacity scales as`, [t`$\rho T^{-3.5}$`, t`$\rho^{-1}T^{3.5}$`, t`independent of $\rho$ and $T$`, t`$T^4$`], 0, t`Bound-free and free-free absorption; Thomson scattering is the constant one.`),
    ],
  },
];

const quiz = {
  type: 'quiz', id: 'Q1', title: 'Fog Chamber multiple choice', xp: 30, passMark: 0.75,
  source: [exam('w24', 'MC'), exam('p25', 'MC'), exam('s24', 'MC'), exam('w25', 'MC')],
  questions: [
    MC(t`The specific intensity of a source seen by an observer at a large distance $R$ (no matter in between)`, [t`is independent of $R$`, t`decreases linearly with $R$`, t`increases linearly with $R$`, t`decreases as $1/R^2$`], 0, t`$I_{\nu1}dA_1d\Omega_1=I_{\nu2}dA_2d\Omega_2$ with $d\Omega=dA/R^2$.`, exam('p25', 'MC 2')),
    MC(t`For radiative transfer through matter with constant properties and optical depth $\tau_\nu$,`, [t`$I\simeq S$ thick, $I\simeq S\tau$ thin`, t`$I\simeq S$ thin, $I\simeq S\tau$ thick`, t`$I\simeq S$ always`, t`$I\simeq Se^{-\tau}$ always`], 0, t`$I=S(1-e^{-\tau})$.`, exam('w24', 'MC 4')),
    MC(t`Which unit is <b>wrong</b>?`, [t`$I_\nu$: W m$^{-2}$ sr$^{-1}$ Hz$^{-1}$`, t`$F_\nu$: W m$^{-2}$`, t`$j_\nu$: W m$^{-3}$ sr$^{-1}$ Hz$^{-1}$`, 'none'], 1, t`$F_\nu$ is per Hz.`, exam('s24', 'MC 4')),
    MC(t`Thomson scattering opacity of fully ionised hydrogen is about`, [t`$4\times10^{-2}$ m$^2$/kg`, t`$4\times10^{-29}$ m$^2$/kg`, t`$40$ m$^2$/kg`, t`$4\times10^{-5}$ m$^2$/kg`], 0, t`$\sigma_T/m_H=6.65\times10^{-29}/1.67\times10^{-27}=0.040$ m$^2$/kg (Choudhuri (2.85)).`),
    MC(t`Limb darkening of the Sun is observed because near the limb we see`, ['higher, cooler layers', 'deeper, hotter layers', 'more sunspots', 'Thomson-scattered light'], 0, t`An oblique line of sight reaches $\tau\sim1$ at smaller vertical depth.`),
    MC(t`A photon random-walks with step $l$. After $N$ steps its typical distance from the start is`, [t`$Nl$`, t`$\sqrt N\,l$`, t`$l$`, t`$N^2l$`], 1, t`$\langle L^2\rangle=Nl^2$ (cross terms average to zero), Choudhuri (2.92).`),
  ],
};

const derivations = [
  {
    type: 'derive', id: 'D1', title: 'Formal solution of the transfer equation', xp: 25,
    source: choud('§2.2.3, eqs. (2.17)-(2.21)'),
    goal: t`Solve $dI_\nu/d\tau_\nu=-I_\nu+S_\nu$ for constant $S_\nu$ and discuss the optically thick and thin limits.`,
    given: [t`$d\tau_\nu=\alpha_\nu ds$`, t`$S_\nu=j_\nu/\alpha_\nu$`],
    steps: [
      { prompt: 'Multiply by an integrating factor.', reveal: t`$\frac{d}{d\tau}(I e^{\tau})=S e^{\tau}$.` },
      { prompt: 'Integrate from 0 to τ.', reveal: t`$I(\tau)e^{\tau}-I(0)=S(e^{\tau}-1)$, so $I(\tau)=I(0)e^{-\tau}+S(1-e^{-\tau})$.` },
      { prompt: 'Limits.', reveal: t`$\tau\gg1$: $I\to S$, the background is invisible. $\tau\ll1$: $I\simeq I(0)(1-\tau)+S\tau$; with no background $I\simeq S\tau=j_\nu L$: every emitter counts.` },
    ],
    keyPoints: ['integrating factor $e^\\tau$', 'correct boundary term', 'both limits with interpretation'],
  },
  {
    type: 'derive', id: 'D2', title: 'A glowing gas cloud seen thin and thick (Choudhuri exercise 2.5)', xp: 30,
    source: choud('exercise 2.5'),
    goal: t`A distant spherical cloud of radius $R$ has uniform temperature $T$. How does its brightness depend on the projected distance $b$ from its centre if (a) it is optically thin, (b) optically thick?`,
    given: [t`LTE: $S_\nu=B_\nu(T)$`],
    steps: [
      { prompt: 'Path length through the cloud at impact parameter b.', reveal: t`$L(b)=2\sqrt{R^2-b^2}$.` },
      { prompt: 'Optically thin case.', reveal: t`$I_\nu\simeq S_\nu\tau_\nu=B_\nu(T)\,\alpha_\nu\,2\sqrt{R^2-b^2}$: brightest at the centre, falling to zero at the edge (limb-darkened disc, like a ball of glowing fog).` },
      { prompt: 'Optically thick case.', reveal: t`$I_\nu=B_\nu(T)$ independent of $b$: a uniformly bright disc with a sharp edge, like a star without temperature gradient. Its effective temperature is $T$.` },
    ],
    keyPoints: ['chord length $2\\sqrt{R^2-b^2}$', 'thin: $I\\propto$ path length', 'thick: uniform $B_\\nu(T)$'],
  },
];

const calcs = [
  {
    type: 'calc', id: 'c1', title: 'Looking through a foggy cloud', fight: 'normal', xp: 25,
    problem: t`A background source of intensity $I_0$ is seen through a uniform cloud with source function $S=0.3\,I_0$ and optical depth $\tau=2$.`,
    vars: { I0: 1, Sf: 0.3, tau: 2 },
    steps: [
      S('tr', t`Fraction of the background that is transmitted, $e^{-\tau}$.`, 'exp(-tau)', 'dimensionless', ['dimensionless', 'm^-1', 'sr^-1', 'Jy'], 0.02, t`At $\tau=1$ only 37 % gets through; at $\tau=2$ about 14 %.`),
      S('I', t`Observed intensity in units of $I_0$.`, 'I0*tr+Sf*(1-tr)', 'I_0', ['I_0', 'W', 'm^-1', 'sr'], 0.02, t`$I=I_0e^{-\tau}+S(1-e^{-\tau})$. Since $S<I_0$, the cloud darkens the source (absorption).`),
      S('Ithick', t`Same cloud made very thick ($\tau\to\infty$): intensity in units of $I_0$.`, 'Sf', 'I_0', ['I_0', 'W', 'm^-1', 'sr'], 0.02, t`Thick: $I\to S$.`),
    ],
  },
  {
    type: 'calc', id: 'c2', title: 'Why air would be opaque if it were ionised (Choudhuri ex. 2.7)', fight: 'normal', xp: 30,
    problem: t`Fully ionised hydrogen with the density of air, $\rho=1.29$ kg m$^{-3}$. Light is attenuated only by Thomson scattering ($\sigma_T=6.652\times10^{-29}$ m$^2$).`,
    vars: { ...pick('mp', 'sigT'), rho: 1.29 },
    steps: [
      S('ne', t`Electron density $n_e=\rho/m_p$ in m$^{-3}$ (enter e.g. 7.7e26).`, 'rho/mp', 'm^-3', ['m^-3', 'kg m^-3', 'm^-2', 'm^3'], 0.02, t`One electron per proton.`),
      S('alpha', t`Absorption coefficient $\alpha=n_e\sigma_T$ in m$^{-1}$.`, 'ne*sigT', 'm^-1', ['m^-1', 'm^2', 'm^2/kg', 'm'], 0.02, t`Dimension check: m$^{-3}\cdot$m$^2$.`),
      S('Lhalf', t`Path length over which the intensity halves, in m.`, 'log(2)/alpha', 'm', ['m', 'km', 'm^-1', 'pc'], 0.02, t`$e^{-\alpha L}=1/2\Rightarrow L=\ln2/\alpha\approx14$ m. This is why the Universe became transparent only when electrons were locked into atoms (recombination).`),
    ],
  },
  {
    type: 'calc', id: 'c3', title: 'Grey atmosphere of the Sun', fight: 'normal', xp: 25,
    problem: t`Use the Eddington grey atmosphere: $T^4=\frac34T_{\rm eff}^4(\tau+\frac23)$ and $I(0,\mu)/I(0,1)=\frac35(\mu+\frac23)$, with $T_{\rm eff}=5772$ K.`,
    vars: { Te: 5772, mu: 0.5 },
    steps: [
      S('T0', t`Temperature at the very top, $\tau=0$, in K.`, 'Te*(0.75*2/3)^0.25', 'K', ['K', 'eV', 'K^4', 'dimensionless'], 0.02, t`$T(0)=2^{-1/4}T_{\rm eff}=0.84\,T_{\rm eff}$.`),
      S('T1', t`Temperature at $\tau=1$, in K.`, 'Te*(0.75*(1+2/3))^0.25', 'K', ['K', 'eV', 'K^4', 'dimensionless'], 0.02, t`$(\frac34\cdot\frac53)^{1/4}=1.057$.`),
      S('limb', t`Intensity at $\mu=0.5$ (60° from disk centre) relative to the centre.`, '0.6*(mu+2/3)', 'dimensionless', ['dimensionless', 'K', 'sr', 'W m^-2'], 0.02, t`$\frac35(0.5+0.667)=0.70$.`),
    ],
  },
  {
    type: 'calc', id: 'c4', title: 'Quick fight: how old is sunlight?', fight: 'fermi', xp: 15,
    problem: t`Photons random-walk out of the Sun with mean free path $l=1/(\chi\rho)$, $\chi\approx0.1$ m$^2$/kg and $\rho\approx10^3$ kg m$^{-3}$ (Choudhuri §2.8). Estimate the escape time in years (within a factor of about 1.3).`,
    vars: { ...pick('Rsun', 'c', 'yr'), chi: 0.1, rho: 1e3 },
    steps: [S('t', t`Diffusion time in years.`, '(Rsun*chi*rho)^2/(chi*rho)/c/yr', 'yr', ['yr', 's', 'Myr', 'Gyr'], 0.1, t`$l=1$ cm, $N=(R/l)^2$, path $Nl=R^2/l$, time $R^2/(lc)\approx5\times10^3$ yr (Choudhuri rounds to $10^4$ yr).`, { tolType: 'log' })],
  },
];

room.encounters.push(...lessons, quiz, ...derivations, ...calcs);
export const rooms = { 'radiative-transfer': room };
export const codex = [
  { id: 'Inu', group: 'Radiative transfer', title: 'Moments of the intensity', tex: t`F_\nu=\oint I_\nu\cos\theta\,d\Omega,\ U_\nu=\tfrac1c\oint I_\nu d\Omega,\ P_\nu=\tfrac1c\oint I_\nu\cos^2\theta\,d\Omega`, meaning: 'Isotropic: F = 0, P = U/3.', source: 'Choudhuri (2.3)-(2.9)' },
  { id: 'rte', group: 'Radiative transfer', title: 'Transfer equation and solution', tex: t`\frac{dI_\nu}{d\tau_\nu}=S_\nu-I_\nu,\ I=I_0e^{-\tau}+S(1-e^{-\tau})`, meaning: 'dτ = α ds, S = j/α. Thick: I → S; thin: I ≈ I0 + Sτ.', source: 'Choudhuri (2.12)-(2.19)' },
  { id: 'kirch', group: 'Radiative transfer', title: 'Kirchhoff (LTE)', tex: t`S_\nu=j_\nu/\alpha_\nu=B_\nu(T)`, meaning: 'Valid when the mean free path is much smaller than the scale of gradients; not for scattering.', source: 'Choudhuri (2.26)' },
  { id: 'grey', group: 'Radiative transfer', title: 'Grey atmosphere (Eddington)', tex: t`T^4=\tfrac34T_{\rm eff}^4(\tau+\tfrac23),\ \frac{I(0,\mu)}{I(0,1)}=\tfrac35(\mu+\tfrac23)`, meaning: 'T = T_eff at τ = 2/3; limb at 40 % of centre.', source: 'Choudhuri (2.69)-(2.70)' },
  { id: 'opac', group: 'Radiative transfer', title: 'Opacities', tex: t`\alpha=\chi\rho,\ \chi_T=\sigma_T/m_H=0.04\,\mathrm{m^2/kg},\ \chi_{\rm Kramers}\propto\rho T^{-3.5}`, meaning: 'Thomson scattering (hot, ionised); bound-free/free-free (Kramers).', source: 'Choudhuri (2.79), (2.85)' },
  { id: 'raddiff', group: 'Stellar structure', title: 'Radiative temperature gradient', tex: t`\frac{dT}{dr}=-\frac{3\chi\rho}{4a_BcT^3}\frac{L_r}{4\pi r^2}`, meaning: 'Energy transport by photon diffusion.', source: 'HS25 practice Q2c' },
  { id: 'schw', group: 'Stellar structure', title: 'Schwarzschild criterion', tex: t`\left|\tfrac{dT}{dr}\right|<\left(1-\tfrac1\gamma\right)\tfrac TP\left|\tfrac{dP}{dr}\right|`, meaning: 'Stable against convection when true.', source: 'HS25 practice MC4' },
  { id: 'rw', group: 'Radiative transfer', title: 'Random walk', tex: t`L=\sqrt N\,l,\ t_{\rm diff}\sim R^2/(lc)`, meaning: 'Photon diffusion time out of a star (~10⁴ yr for the Sun).', source: 'Choudhuri §2.8' },
];
