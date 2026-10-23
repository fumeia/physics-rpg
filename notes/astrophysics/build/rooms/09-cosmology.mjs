// Expansion Engine additions: Hubble law, FRW geometry, Friedmann equation, fluid equation, solutions (Choudhuri Ch. 9.3, 10).
import { t, pick, S, exam, choud, P, EQ, INT, PIT, FIG, EXQ, MC } from '../lib.mjs';

const lessons = [
  {
    type: 'lesson', id: 'L1', title: 'Hubble\'s law and redshift', tier: 'intuition', minutes: 10, xp: 15,
    source: [choud('§9.3 (expansion), §10.3 eqs. (10.22)-(10.24)'), exam('w25', 'MC 13, 14')],
    blocks: [
      EQ(t`v=H_0d,\qquad 1+z=\frac{\lambda_{\rm obs}}{\lambda_{\rm em}}=\frac{a_0}{a(t_{\rm em})},\qquad v\approx cz\ (z\ll1)`, 'Hubble law and cosmological redshift.'),
      P(t`$H_0\approx70$ km s$^{-1}$Mpc$^{-1}$ (often written $100h$ with $h\approx0.7$). Its inverse, the <b>Hubble time</b> $1/H_0=977.8/H_0[\mathrm{km/s/Mpc}]$ Gyr $\approx14$ Gyr, sets the age scale of the Universe.`),
      INT(t`Redshift is not a Doppler shift through space: the wavelength of light is stretched together with space, $\lambda\propto a$. That is why $1+z$ is exactly the factor by which the Universe has grown since the light left. Every observer sees the same Hubble law (no centre): stretch a rubber sheet with dots on it and every dot sees the others recede with $v\propto d$.`),
      P(t`<b>Cosmological principle:</b> on large scales ($\gtrsim100\,h^{-1}$ Mpc) the Universe is homogeneous and isotropic. Then the only freedom is a single scale factor $a(t)$ and a constant spatial curvature $k\in\{-1,0,+1\}$: the Robertson–Walker metric.`),
      PIT(t`$v=cz$ only for $z\ll1$. For $z\sim1$ use $1+z=a_0/a$ and do not quote a velocity. Frequencies: $1+z=\nu_{\rm em}/\nu_{\rm obs}$ (HS25 winter MC14: 1420 MHz seen at 700 MHz is $z\approx1$).`),
    ],
    check: [
      MC(t`A galaxy has $z=0.024$; $H_0=72$ km/s/Mpc. Its distance is about`, ['10 Mpc', '100 Mpc', '300 Mpc', '720 Mpc'], 1, t`$cz/H_0=7195/72$.`, exam('w25', 'MC 13')),
    ],
  },
  {
    type: 'lesson', id: 'L2', title: 'Curvature: closed, flat, open', tier: 'intuition', minutes: 8, xp: 10,
    source: [choud('§10.3 (metric, eq. 10.19), §10.4 (10.30)-(10.31)'), exam('s24', 'MC 14'), exam('w25', 'MC 15')],
    blocks: [
      P(t`A 2D picture: a sphere (positive curvature, $k=+1$: triangle angles sum to more than 180°, parallel lines meet, finite area), a plane ($k=0$: 180°), a saddle (negative curvature, $k=-1$: less than 180°, infinite).`),
      EQ(t`\frac{kc^2}{a^2H^2}=\Omega-1,\qquad\Omega=\frac{\rho}{\rho_c},\quad\rho_c=\frac{3H^2}{8\pi G}`, '(10.30)-(10.31): the density decides the geometry.'),
      INT(t`$\Omega>1$: more than enough mass, space closes on itself like a sphere and (without $\Lambda$) the expansion eventually reverses. $\Omega=1$: flat, the "escape velocity" case. $\Omega<1$: open, expands forever. Observations (CMB) say our Universe is very nearly flat: $\Omega_{\rm tot}=1$ to within ~0.5 %.`),
      PIT(t`Triangle angle sum $>180^\circ$ means <b>positive</b> curvature (HS24 summer MC14), and $\Omega_{\rm tot}>1$ means <b>closed</b>, $k=+1$ (HS25 winter MC15). Never "cylindrical": a cylinder has zero intrinsic curvature.`),
    ],
    check: [
      MC(t`If $\Omega_{\rm tot}>1$ the spatial geometry is`, ['flat', 'open/hyperbolic', 'closed/spherical', 'cylindrical'], 2, t`$k=+1$.`, exam('w25', 'MC 15')),
      MC(t`If the angles of every small triangle on a 2D surface sum to more than 180°, the surface has`, ['curvature −1', 'negative curvature', 'zero curvature', 'positive curvature'], 3, 'Like a sphere.', exam('s24', 'MC 14')),
    ],
  },
  {
    type: 'lesson', id: 'L3', title: 'The Friedmann equation from a Newtonian shell', tier: 'theory', minutes: 12, xp: 20,
    source: [choud('§10.4, eqs. (10.25)-(10.29); §10.5 eqs. (10.36)-(10.40)')],
    blocks: [
      P(t`Take a sphere of radius $a$ in a uniform universe of density $\rho$. A test mass on its surface feels only the mass inside, $M=\frac43\pi a^3\rho$ (shell theorem). Energy conservation: $\frac12\dot a^2-\frac{GM}{a}=E$, i.e. $\dot a^2-\frac{8\pi G}{3}\rho a^2=2E$. General relativity gives the same equation with $2E=-kc^2$ (Choudhuri (10.25)-(10.27)):`),
      EQ(t`\left(\frac{\dot a}{a}\right)^2=\frac{8\pi G}{3}\rho-\frac{kc^2}{a^2},\qquad H=\frac{\dot a}{a}`, 'Friedmann equation.'),
      P(t`How $\rho$ depends on $a$ follows from the first law for an expanding volume $a^3$ with pressure $P=w\rho c^2$: $d(\rho c^2a^3)+P\,d(a^3)=0$:`),
      EQ(t`\rho\propto a^{-3(1+w)}:\quad\text{matter }(w=0)\ \rho\propto a^{-3};\quad\text{radiation }(w=\tfrac13)\ \rho\propto a^{-4};\quad\Lambda\ (w=-1)\ \rho=\text{const}`, '(10.37)-(10.40).'),
      INT(t`Matter is diluted ($n\propto a^{-3}$). Radiation is diluted AND each photon is redshifted ($E\propto a^{-1}$): $a^{-4}$. Vacuum energy is a property of space, so it does not dilute. Hence the history: radiation dominated early, matter later (after $z_{eq}\approx3400$), and dark energy today.`),
      P(t`Numbers: $\rho_{c,0}=\frac{3H_0^2}{8\pi G}=1.88\times10^{-26}h^2$ kg m$^{-3}$ (10.29), about 5 protons per cubic metre. Today $\Omega_M\approx0.3$, $\Omega_\Lambda\approx0.7$, $\Omega_R\approx9\times10^{-5}$.`),
      PIT(t`$k$ is only a sign ($-1,0,1$); the radius of curvature is in $a$. For $k=0$ the Friedmann equation is just $\dot a/a=\sqrt{8\pi G\rho/3}$: separate variables (exam hint: $a$-terms with $da$ on the left).`),
    ],
    check: [
      MC(t`The energy density of radiation scales as`, [t`$a^{-3}$`, t`$a^{-2}$`, t`$a^{-4}$`, 'constant'], 2, 'Dilution and redshift.', exam('w24', 'MC 15')),
      MC(t`In our Universe`, ['radiation dominates early, matter later', 'matter dominates early, radiation later', 'radiation always dominates', 'matter always dominates'], 0, t`$\rho_R/\rho_M\propto1/a$.`, exam('w24', 'MC 14')),
    ],
  },
  {
    type: 'lesson', id: 'L4', title: 'Solutions: how the Universe grows', tier: 'theory', minutes: 15, xp: 20,
    source: [choud('§10.6 (matter-dominated, 10.53-10.64, Fig. 10.5), §10.7 (radiation, 10.65)'), exam('s24', 'open Q7'), exam('p25', 'open Q7'), exam('w24', 'open Q7'), exam('w25', 'open Q7')],
    blocks: [
      EQ(t`k=0:\quad a\propto t^{\frac{2}{3(1+w)}}\ \Rightarrow\ \text{matter }a\propto t^{2/3},\ \text{radiation }a\propto t^{1/2};\qquad\Lambda:\ a\propto e^{Ht},\ H=\sqrt{8\pi G\rho_\Lambda/3}`),
      EQ(t`k=+1,\ \text{matter}:\ \frac{a}{a_0}=\frac{\Omega_0}{2(\Omega_0-1)}(1-\cos\eta),\quad H_0t=\frac{\Omega_0}{2(\Omega_0-1)^{3/2}}(\eta-\sin\eta)`, 'Closed universe (cycloid): Big Bang at η = 0, turnaround at η = π, Big Crunch at η = 2π.'),
      FIG(t`Choudhuri Fig. 10.5: $a(t)$ for $k=+1$ rises from zero, bends over and falls back (a cycloid arch); $k=0$ grows as $t^{2/3}$ forever; $k=-1$ grows faster and approaches $a\propto t$ (coasting). All three curves start together at the Big Bang with infinite slope; near $t=0$ curvature does not matter.`),
      INT(t`Age: for a flat matter universe $H=\frac{2}{3t}$, so $t_0=\frac23H_0^{-1}\approx9.3$ Gyr, younger than the oldest stars (12–13 Gyr): one of the hints that dark energy exists. With $\Lambda$ the expansion accelerates (SN Ia distances, 1998) and the age becomes 13.8 Gyr.`),
      PIT(t`For $H=\alpha/t$ (power law) the age is $\alpha/H$, not $1/H$. In a closed universe the present time must be before turnaround if we see expansion: $t_\odot<t_{\rm ta}$ gives an upper limit on $H_0$ (HS24 winter Q7c).`),
      EXQ(t`Every exam ends with Friedmann: radiation era and BBN (HS25 winter Q7), general $w$ (HS24 summer Q7), cosmological constant (HS25 practice Q7), closed universe lifetime (HS24 winter Q7).`),
    ],
    check: [
      MC(t`A flat universe with $w=0$ expands as`, [t`$t^{1/2}$`, t`$t^{2/3}$`, t`$t$`, t`$e^{Ht}$`], 1, t`$\alpha=2/(3(1+w))$.`),
      MC(t`A flat $\Lambda$-dominated universe has a Hubble parameter that`, ['grows', 'decreases as 1/t', 'is constant', 'oscillates'], 2, t`$H^2=8\pi G\rho_\Lambda/3$ = const.`, exam('p25', 'open Q7b')),
    ],
  },
];

const quiz = {
  type: 'quiz', id: 'Q1', title: 'Expansion Engine multiple choice', xp: 30, passMark: 0.75,
  source: [exam('w25', 'MC'), exam('w24', 'MC'), exam('s24', 'MC')],
  questions: [
    MC(t`$z=0.024$, $H_0=72$ km/s/Mpc: distance`, ['10 Mpc', '100 Mpc', '300 Mpc', '720 Mpc'], 1, t`$cz/H_0$.`, exam('w25', 'MC 13')),
    MC(t`21 cm line observed at 700 MHz: $z\approx$`, ['0.3', '0.5', '1', '2'], 2, t`$1420/700-1$.`, exam('w25', 'MC 14')),
    MC(t`$\Omega_{\rm tot}>1$:`, ['flat', 'open', 'closed', 'cylindrical'], 2, t`$k=+1$.`, exam('w25', 'MC 15')),
    MC(t`Triangles with angle sum > 180°:`, ['curvature −1', 'negative', 'zero', 'positive'], 3, 'Sphere-like.', exam('s24', 'MC 14')),
    MC(t`Epochs in our Universe:`, ['radiation then matter', 'matter then radiation', 'always radiation', 'always matter'], 0, t`$\rho_R\propto a^{-4}$, $\rho_M\propto a^{-3}$.`, exam('w24', 'MC 14')),
    MC(t`$\rho_R\propto$`, [t`$a^{-3}$`, t`$a^{-2}$`, t`$a^{-4}$`, 'const'], 2, 'Number dilution × redshift.', exam('w24', 'MC 15')),
    MC(t`The critical density today is about`, ['5 protons per m³', '5 protons per cm³', '1 g per cm³', t`$10^{-3}$ kg m$^{-3}$`], 0, t`$\rho_c=9.2\times10^{-27}$ kg m$^{-3}$ for $h=0.7$.`),
  ],
};

const derivations = [
  {
    type: 'derive', id: 'D1', title: 'Power-law expansion for a fluid with equation of state w', xp: 35,
    source: exam('s24', 'open Q7 [11 pt]'),
    goal: t`Flat universe, $\rho=\rho_0(a_0/a)^{3(1+w)}$, $w>-1$. From $(\dot a/a)^2=\frac{8\pi G}{3}\rho-\frac{kc^2}{a^2}$ show $a\propto t^\alpha$ with $\alpha=\frac{2}{3(1+w)}$, and give the matter and radiation cases.`,
    given: [t`$k=0$, $a(0)=0$`],
    steps: [
      { prompt: '(a) Differential equation.', reveal: t`$\frac{da}{dt}=\sqrt{\frac{8\pi G\rho_0a_0^{3(1+w)}}{3}}\,a^{-\frac12(1+3w)}$.` },
      { prompt: '(b) Separate and integrate from 0.', reveal: t`$\int_0^aa'^{\frac12(1+3w)}da'=\frac{a^{\frac32(1+w)}}{\frac32(1+w)}=\sqrt{\frac{8\pi G\rho_0a_0^{3(1+w)}}{3}}\,t$, so $a\propto t^{\frac{2}{3(1+w)}}$.` },
      { prompt: '(c) Special cases.', reveal: t`Matter $w=0$: $a\propto t^{2/3}$. Radiation $w=1/3$: $a\propto t^{1/2}$.` },
    ],
    keyPoints: ['correct exponent of $a$ in $\\dot a$', 'separation and integration with $a(0)=0$', '$\\alpha=2/(3(1+w))$', 'both special cases'],
  },
  {
    type: 'derive', id: 'D2', title: 'A universe dominated by a cosmological constant', xp: 30,
    source: exam('p25', 'open Q7 [12 pt]'),
    goal: t`Flat universe with only dark energy of constant density $\rho_\Lambda$. Show that $H$ is constant and $a\propto e^{Ht}$.`,
    given: [t`$\dot a^2/a^2=\frac{8\pi G}{3}\rho-\frac{kc^2}{a^2}$`],
    steps: [
      { prompt: '(a) Friedmann equation.', reveal: t`$\frac{\dot a^2}{a^2}=\frac{8\pi G}{3}\rho_\Lambda$.` },
      { prompt: '(b) In terms of H.', reveal: t`$H^2=\frac{8\pi G}{3}\rho_\Lambda$: constant in time since $\rho_\Lambda$ is.` },
      { prompt: '(c)-(d) Solve.', reveal: t`$\frac{da}{dt}=aH\Rightarrow d\ln a=H\,dt\Rightarrow a\propto e^{Ht}$, with $H=\sqrt{8\pi G\rho_\Lambda/3}$ in the exponent.` },
    ],
    keyPoints: ['Friedmann with ρ_Λ only', 'H constant', 'exponential solution with coefficient H'],
  },
];

const calcs = [
  {
    type: 'calc', id: 'c5', title: 'Critical density and Hubble time', fight: 'normal', xp: 25,
    problem: t`$H_0=70$ km s$^{-1}$ Mpc$^{-1}$, $1$ Mpc $=3.0857\times10^{19}$ km.`,
    vars: { ...pick('G', 'mp', 'yr'), H0: 70, Mpckm: 3.085677581e19 },
    steps: [
      S('H', t`$H_0$ in s$^{-1}$ (enter e.g. 2.3e-18).`, 'H0/Mpckm', 's^-1', ['s^-1', 'km/s/Mpc', 'Gyr', 'm/s'], 0.02, t`Divide km/s/Mpc by km per Mpc.`),
      S('tH', t`Hubble time $1/H_0$ in Gyr.`, '1/H/yr/1e9', 'Gyr', ['Gyr', 's', 'Myr', 's^-1'], 0.02, t`$\approx14$ Gyr.`),
      S('rhoc', t`Critical density $3H_0^2/(8\pi G)$ in $10^{-27}$ kg m$^{-3}$.`, '3*H^2/(8*pi*G)/1e-27', '10^-27 kg m^-3', ['10^-27 kg m^-3', 'kg', 'm^-3', 'g cm^-3'], 0.02, t`$1.88\times10^{-26}h^2$ with $h=0.7$.`),
      S('np', t`Equivalent number of protons per m$^3$.`, 'rhoc*1e-27/mp', 'm^-3', ['m^-3', 'cm^-3', 'kg m^-3', 'dimensionless'], 0.02, t`About 5.5: the Universe is very empty.`),
    ],
  },
  {
    type: 'calc', id: 'c6', title: 'Life and death of a closed universe', fight: 'normal', xp: 30,
    problem: t`Matter-only closed universe with $\Omega_{M,0}=2$ and $H_0=70$ km/s/Mpc ($1/H_0=13.97$ Gyr). Use $H_0t=\frac{\Omega_0}{2(\Omega_0-1)^{3/2}}(\eta-\sin\eta)$ (HS24 winter Q7).`,
    vars: { Om: 2, H0inv: 977.8 / 70 },
    steps: [
      S('tta', t`Turnaround time ($\eta=\pi$) in Gyr.`, 'H0inv*Om/(2*(Om-1)^1.5)*pi', 'Gyr', ['Gyr', 'Myr', 'yr', 'km/s/Mpc'], 0.02, t`$\frac{\pi}{H_0}\frac{\Omega}{2(\Omega-1)^{3/2}}$.`),
      S('tlife', t`Total lifetime Big Bang to Big Crunch ($\eta=2\pi$) in Gyr.`, '2*tta', 'Gyr', ['Gyr', 'Myr', 'yr', 'km/s/Mpc'], 0.02, t`Symmetric cycloid: twice the turnaround time.`),
      S('t0', t`Age today: today $a=a_0$, so $1-\cos\eta_0=2(\Omega-1)/\Omega=1$, $\eta_0=\pi/2$. Age in Gyr.`, 'H0inv*Om/(2*(Om-1)^1.5)*(pi/2-1)', 'Gyr', ['Gyr', 'Myr', 'yr', 'km/s/Mpc'], 0.02, t`$H_0t_0=\frac{2}{2}(\frac\pi2-1)=0.571$: only 8 Gyr, younger than the flat case.`),
    ],
  },
  {
    type: 'calc', id: 'c7', title: 'When did matter take over from radiation?', fight: 'normal', xp: 30,
    problem: t`Use $\rho_\gamma=a_BT_0^4/c^2$ with $T_0=2.725$ K, $a_B=7.566\times10^{-16}$ J m$^{-3}$K$^{-4}$, total radiation $\rho_R=1.68\rho_\gamma$ (photons + neutrinos, Choudhuri (10.47)), and $\rho_M=\Omega_M\rho_c$ with $\Omega_M=0.3$, $\rho_c=9.20\times10^{-27}$ kg m$^{-3}$.`,
    vars: { ...pick('aB', 'c'), T0: 2.725, Om: 0.3, rhoc: 9.204e-27 },
    steps: [
      S('rg', t`Photon mass density today in $10^{-31}$ kg m$^{-3}$.`, 'aB*T0^4/c^2/1e-31', '10^-31 kg m^-3', ['10^-31 kg m^-3', 'J m^-3', 'kg', 'K'], 0.02, t`$\Omega_\gamma\approx5\times10^{-5}$.`),
      S('zeq', t`Redshift of equality $1+z_{eq}=\rho_{M,0}/\rho_{R,0}$; enter $z_{eq}$.`, 'Om*rhoc/(1.68*rg*1e-31)-1', 'dimensionless', ['dimensionless', 'K', 'yr', 'Mpc'], 0.03, t`$\rho_M/\rho_R\propto a$; Choudhuri (10.52): $2.3\times10^4\Omega_Mh^2$.`),
      S('Teq', t`CMB temperature at equality in K.`, 'T0*(1+zeq)', 'K', ['K', 'eV', 'MeV', 'dimensionless'], 0.03, t`$T\propto1+z$: about $10^4$ K ($\approx0.8$ eV).`),
    ],
  },
  {
    type: 'calc', id: 'c8', title: 'The far future: a Λ-dominated universe', fight: 'normal', xp: 20,
    problem: t`When matter has thinned out, only $\rho_\Lambda=0.7\rho_{c,0}$ is left. Then $H_\Lambda=\sqrt{8\pi G\rho_\Lambda/3}=\sqrt{0.7}\,H_0$. Take $H_0=70$ km/s/Mpc.`,
    vars: { H0: 70, fL: 0.7 },
    steps: [
      S('HL', t`$H_\Lambda$ in km/s/Mpc.`, 'sqrt(fL)*H0', 'km/s/Mpc', ['km/s/Mpc', 'Gyr', 's^-1', 'Mpc'], 0.02, t`$\sqrt{0.7}\times70$.`),
      S('td', t`Doubling time of the scale factor, $\ln2/H_\Lambda$, in Gyr.`, 'log(2)*977.8/HL', 'Gyr', ['Gyr', 'km/s/Mpc', 'Myr', 's'], 0.02, t`$1/H$ in Gyr is $977.8/H[\mathrm{km/s/Mpc}]$.`),
    ],
  },
];

const boss = {
  type: 'boss', id: 'b2', title: 'Boss: the closed universe (exam problem)', xp: 130, minutes: 25,
  source: exam('w24', 'Open Question 7 [12 pt]'),
  instructions: 'Solve on paper under the timer (sketch included), then enter the final numbers.',
  statement: [
    t`For a matter-dominated closed universe, the solution of the Friedmann equation is $\frac{a}{a_0}=\frac{\Omega_{M,0}}{2(\Omega_{M,0}-1)}(1-\cos\eta)$, $H_0t=\frac{\Omega_{M,0}}{2(\Omega_{M,0}-1)^{3/2}}(\eta-\sin\eta)$, where $a_0$, $\Omega_{M,0}$ and $H_0$ are the scale factor, matter density parameter and Hubble parameter today, and $\eta$ is the conformal time.`,
    t`(a) [4 pt] Describe in words the evolution of the closed universe. Sketch $a$ vs $t$. Mark the Big Bang, turnaround and Big Crunch, and give the corresponding values of $\eta$.`,
    t`(b) [4 pt] Derive an expression for the total lifetime $t_{\rm univ}$ (Big Bang to Big Crunch) in terms of $H_0$ and $\Omega_{M,0}$.`,
    t`(c) [4 pt] Assume that the universe is closed and expanding today. Derive an upper limit for $H_0$ using the fact that the current age of the Sun is $t_\odot$. Write this limit in terms of $\Omega_{M,0}$ and $t_\odot$.`,
  ],
  finalAnswers: [
    { id: 'tu', prompt: t`(b) with numbers: $\Omega_{M,0}=1.5$, $1/H_0=13.97$ Gyr. Lifetime in Gyr.`, answer: 'pi*H0inv*Om/(Om-1)**1.5', vars: { Om: 1.5, H0inv: 977.8 / 70 }, tol: 0.02 },
    { id: 'Hmax', prompt: t`(c) with numbers: $\Omega_{M,0}=1.5$, $t_\odot=4.6$ Gyr. Upper limit on $H_0$ in km/s/Mpc.`, answer: 'pi/tsun*Om/(2*(Om-1)**1.5)*977.8', vars: { Om: 1.5, tsun: 4.6 }, tol: 0.02 },
  ],
  keyPoints: [
    t`(a) Big Bang $a=0$ at $\eta=0$; expansion slows; maximum (turnaround) at $\eta=\pi$; contraction to the Big Crunch $a=0$ at $\eta=2\pi$. Sketch: symmetric arch (cycloid), labelled points.`,
    t`(b) $t_{\rm univ}=H_0^{-1}\frac{\Omega}{2(\Omega-1)^{3/2}}(2\pi-\sin2\pi)=\frac{\pi}{H_0}\frac{\Omega}{(\Omega-1)^{3/2}}$.`,
    t`(c) $t_{\rm ta}=\frac{\pi}{H_0}\frac{\Omega}{2(\Omega-1)^{3/2}}$; expanding today needs $t_\odot<t_0<t_{\rm ta}$, so $H_0<\frac{\pi}{t_\odot}\frac{\Omega}{2(\Omega-1)^{3/2}}$.`,
  ],
};

export const extend = { 'expanding-universe': [...lessons, quiz, ...derivations, ...calcs, boss] };
export const sources = { 'expanding-universe': [exam('w24', 'open Q7, MC 14-15'), exam('p25', 'open Q7'), exam('s24', 'MC 14'), choud('Ch. 9.3 (Hubble law), 10.3-10.7 (FRW metric, Friedmann, contents, matter and radiation eras)')] };
export const codex = [
  { id: 'hubble', group: 'Cosmology', title: 'Hubble law and redshift', tex: t`v=H_0d,\ 1+z=\frac{a_0}{a}=\frac{\lambda_{\rm obs}}{\lambda_{\rm em}},\ \frac{1}{H_0}=\frac{977.8}{H_0[\mathrm{km/s/Mpc}]}\,\mathrm{Gyr}`, meaning: 'v ≈ cz only for z ≪ 1.', source: 'Choudhuri (10.22)-(10.24)' },
  { id: 'fried', group: 'Cosmology', title: 'Friedmann equation', tex: t`\left(\frac{\dot a}{a}\right)^2=\frac{8\pi G}{3}\rho-\frac{kc^2}{a^2}`, meaning: 'Newtonian shell energy with 2E = −kc².', source: 'Choudhuri (10.27)' },
  { id: 'rhoc', group: 'Cosmology', title: 'Critical density, Ω, curvature', tex: t`\rho_c=\frac{3H^2}{8\pi G}=1.88\times10^{-26}h^2\,\mathrm{kg\,m^{-3}},\ \frac{kc^2}{a^2H^2}=\Omega-1`, meaning: 'Ω > 1 closed, = 1 flat, < 1 open.', source: 'Choudhuri (10.29)-(10.31)' },
  { id: 'fluid', group: 'Cosmology', title: 'Equation of state', tex: t`P=w\rho c^2\Rightarrow\rho\propto a^{-3(1+w)}`, meaning: 'Matter w = 0 (a^{-3}), radiation 1/3 (a^{-4}), Λ −1 (const).', source: 'Choudhuri (10.36)-(10.40)' },
  { id: 'sols', group: 'Cosmology', title: 'Flat solutions', tex: t`a\propto t^{2/(3(1+w))},\ \text{matter }t^{2/3},\ \text{rad. }t^{1/2},\ \Lambda:\ e^{Ht}`, meaning: 'Age = α/H for a power law.', source: 'HS24 summer Q7, HS25 practice Q7' },
  { id: 'closed', group: 'Cosmology', title: 'Closed matter universe', tex: t`\frac{a}{a_0}=\frac{\Omega_0(1-\cos\eta)}{2(\Omega_0-1)},\ H_0t=\frac{\Omega_0(\eta-\sin\eta)}{2(\Omega_0-1)^{3/2}}`, meaning: 'Turnaround η = π, crunch η = 2π; lifetime πΩ/(H0(Ω−1)^{3/2}).', source: 'HS24 winter Q7' },
  { id: 'eq', group: 'Cosmology', title: 'Matter–radiation equality', tex: t`1+z_{eq}=\frac{\rho_{M,0}}{\rho_{R,0}}\approx2.3\times10^4\Omega_Mh^2`, meaning: 'ρ_R = 1.68 ρ_γ (photons + neutrinos).', source: 'Choudhuri (10.47)-(10.52)' },
];
