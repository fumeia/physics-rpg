// Stellar Forge additions: stellar structure theory (Choudhuri Ch. 3), virial theorem, scalings, HR diagram.
import { t, pick, S, exam, choud, P, EQ, INT, PIT, FIG, EXQ, MC } from '../lib.mjs';

const lessons = [
  {
    type: 'lesson', id: 'L1', title: 'Hydrostatic equilibrium: weighing the inside of the Sun', tier: 'theory', minutes: 12, xp: 15,
    source: [choud('§3.2.1, eqs. (3.1)-(3.6)'), exam('s24', 'open Q3(a)'), exam('w24', 'open Q1')],
    blocks: [
      P(t`A star is a self-gravitating ball of gas. Take a thin shell of area $dA$ and thickness $dr$ at radius $r$. The pressure below pushes up with $P(r)dA$, the pressure above pushes down with $P(r+dr)dA$, and gravity pulls the shell's mass $\rho\,dA\,dr$ inwards with $GM_r/r^2$. Balance gives the first two structure equations:`),
      EQ(t`\frac{dM_r}{dr}=4\pi r^2\rho,\qquad\frac{dP}{dr}=-\frac{GM_r\rho}{r^2}`, 'Mass continuity (3.1) and hydrostatic equilibrium (3.2). Boundary conditions: M_r(0) = 0, P(R) = 0.'),
      P(t`Order-of-magnitude use (Choudhuri's favourite tool): replace $dP/dr$ by $-P_c/R$ and $M_r$, $r$ by $M/2$, $R/2$. Then $P_c\approx GM^2/(R^4)\times\frac{3}{2\pi}\approx6\times10^{14}$ Pa for the Sun. With the ideal gas $P=\frac{\rho k_BT}{\mu m_H}$ ($\mu=1/2$ for ionised hydrogen: one proton plus one electron per $m_H$) you get $T_c\approx10^7$ K.`),
      EQ(t`P=\frac{k_B}{\mu m_H}\rho T,\qquad\mu=\left(2X+\tfrac34Y+\tfrac12Z\right)^{-1}`, 'Ideal gas with mean molecular weight (3.23)-(3.24). X, Y, Z: mass fractions of H, He, metals.'),
      INT(t`Every layer must carry the weight of everything above it. That is why pressure (and with an ideal gas, temperature) must rise steeply towards the centre, and why the centre of the Sun is hot enough for fusion: gravity, not fusion, sets the central temperature. Fusion only keeps it there.`),
      PIT(t`Sign: $dP/dr<0$. When you integrate "from $r$ to $R$" (HS24 winter Q1), $P(R)-P(r)=-\int_r^R\frac{GM_{r'}\rho}{r'^2}dr'$ and $P(R)=0$, so $P(r)$ comes out positive. Write the boundary condition explicitly: it is a grading point.`),
      EXQ(t`HS24 summer Q3a (derive the equation from a volume element, 4 pt), HS24 winter Q1 (constant-density star: $P(r)$, $T(r)$), HS25 practice Q2 (scaling $P\propto M^2/R^4$).`),
    ],
    check: [
      MC(t`For fully ionised hydrogen the mean molecular weight $\mu$ is`, ['1', '1/2', '2', '4/3'], 1, t`$X=1$: $\mu=1/2$, two particles per $m_H$.`),
      MC(t`Replacing $dP/dr\to-P_c/R$, $M_r\to M$, $r\to R$, $\rho\to M/R^3$ gives`, [t`$P_c\propto M^2/R^4$`, t`$P_c\propto M/R^2$`, t`$P_c\propto M^2/R^2$`, t`$P_c\propto M/R^4$`], 0, t`$P/R\sim(M/R^2)(M/R^3)$.`, exam('p25', 'open Q2a')),
    ],
  },
  {
    type: 'lesson', id: 'L2', title: 'The virial theorem: stars have negative heat capacity', tier: 'intuition', minutes: 10, xp: 15,
    source: [choud('§3.2.2, eqs. (3.7)-(3.14)'), exam('w24', 'MC 10'), exam('p25', 'open Q3')],
    blocks: [
      P(t`Multiply hydrostatic equilibrium by $4\pi r^3$ and integrate over the star (by parts). The left side becomes $-3\int P\,dV$, which for an ideal monatomic gas is $-2E_T$ (thermal energy); the right side is the gravitational energy $E_G$:`),
      EQ(t`2E_T+E_G=0,\qquad E=E_T+E_G=\tfrac12E_G=-E_T<0`, 'Virial theorem for a star in equilibrium (3.10)-(3.12). Same form 2K + V = 0 for stellar systems.'),
      INT(t`A star that radiates energy away (E decreases) must <b>contract and heat up</b>: $E_T=-E$ grows. Half of the released gravitational energy heats the gas, the other half is radiated. This is the engine that heats a protostar until fusion ignites, and that re-heats a core when it runs out of fuel. Stars act like a thermostat: if fusion runs too fast, the core expands and cools, slowing it.`),
      EQ(t`|E_G|\approx\frac{GM^2}{R}\approx4\times10^{41}\,\mathrm J,\qquad\tau_{KH}\approx\frac{|E_G|}{2L}\approx10^7\,\mathrm{yr}`, 'Kelvin–Helmholtz time (3.13)-(3.14): how long the Sun could shine by contraction alone. Too short for geology: hence nuclear energy.'),
      PIT(t`Total energy in virial equilibrium is $E=\frac12\bar V$ (negative), or equivalently $E=-\bar K$. Not $2K$, not $K/2$ (HS24 winter MC10). For a uniform sphere $E_G=-\frac35GM^2/R$; order-of-magnitude estimates may drop the 3/5 (HS25 practice Q3 uses $GM^2/2R$).`),
      EXQ(t`HS25 practice Q3: thermal energy of the Sun ($\frac32Nk_BT$ with $N=2M/m_p$, $T=10^7$ K) is of the same order as $GM^2/2R$: both $\sim10^{41}$ J.`),
    ],
    check: [
      MC(t`For a self-gravitating system in steady state, the total energy is`, [t`$\bar E=2\bar K$`, t`$\bar E=\frac12\bar K$`, t`$\bar E=2\bar V$`, t`$\bar E=\frac12\bar V$`], 3, t`$2\bar K+\bar V=0\Rightarrow\bar E=\bar K+\bar V=\frac12\bar V$.`, exam('w24', 'MC 10')),
      MC(t`A star without nuclear burning loses energy by radiation. Its interior`, ['cools and expands', 'heats up and contracts', 'stays at the same temperature', 'cools and contracts'], 1, t`$E_T=-E$ increases as $E$ decreases.`),
    ],
  },
  {
    type: 'lesson', id: 'L3', title: 'Four equations, and the scaling laws that follow', tier: 'theory', minutes: 15, xp: 20,
    source: [choud('§3.3 eqs. (3.25)-(3.28), §3.4 eqs. (3.33)-(3.41)'), exam('p25', 'open Q2'), exam('w25', 'MC 5, open Q3')],
    blocks: [
      EQ(t`\frac{dM_r}{dr}=4\pi r^2\rho,\quad\frac{dP}{dr}=-\frac{GM_r\rho}{r^2},\quad\frac{dL_r}{dr}=4\pi r^2\rho\varepsilon,\quad\frac{dT}{dr}=-\frac{3\chi\rho}{4a_BcT^3}\frac{L_r}{4\pi r^2}`, 'The four stellar structure equations (3.25)-(3.28), with ε the nuclear energy release per mass and time. In convective zones the last one is replaced by the adiabatic gradient.'),
      P(t`Choudhuri's "drastic" scaling (§3.4): replace every derivative $d/dr$ by $1/R$, $M_r$ by $M$, $\rho$ by $M/R^3$, assume constant opacity.`),
      EQ(t`P\propto\frac{M^2}{R^4},\quad P\propto\rho T\Rightarrow T\propto\frac MR,\quad\frac TR\propto\frac{\rho L}{T^3R^2}\Rightarrow L\propto\frac{(TR)^4}{M}\propto M^3`, 'Mass–luminosity relation (3.37).'),
      EQ(t`L=4\pi R^2\sigma T_{\rm eff}^4\ \Rightarrow\ M\propto T^2,\quad L\propto T_{\rm eff}^6,\quad R\propto M^{1/2},\quad\tau_{MS}\propto\frac ML\propto M^{-2}`, 'Main-sequence scalings used in Refregier\'s exams.'),
      INT(t`Notice that the luminosity of a star does <b>not</b> depend on how fusion works: it is set by how fast radiation can leak out ($L\propto M^3/\chi$). Fusion adjusts itself (via the virial thermostat) to supply exactly that. Massive stars are hugely more luminous and burn through their fuel much faster: a $10M_\odot$ star lives ~100 times shorter than the Sun.`),
      PIT(t`These are scalings, not equations: never put numbers into $L\propto M^3$ without a reference star ($L/L_\odot=(M/M_\odot)^3$). Real stars have $L\propto M^{3-4}$; the exam uses 3. Lifetime ratio for masses differing by 4: $4^2=16$ (HS25 winter MC5), not 4 or 64.`),
    ],
    check: [
      MC(t`Two main-sequence stars differ in mass by a factor of 4. The lower-mass star lives longer by about`, ['4', '8', '16', '64'], 2, t`$\tau\propto M^{-2}$.`, exam('w25', 'MC 5')),
      MC(t`A star more massive than the Sun is, on the main sequence,`, ['less luminous, hotter, shorter-lived', 'more luminous, hotter, shorter-lived', 'more luminous, cooler, shorter-lived', 'more luminous, hotter, longer-lived'], 1, t`$L\propto M^3$, $T\propto M^{1/2}$, $\tau\propto M^{-2}$.`, exam('s24', 'MC 5')),
    ],
  },
  {
    type: 'lesson', id: 'L4', title: 'Reading the HR diagram', tier: 'intuition', minutes: 10, xp: 15,
    source: [choud('§3.5 (stellar data, spectral classes), §3.6 (main sequence, red giants, white dwarfs), §4.5 (evolution)'), exam('w24', 'MC 5'), exam('p25', 'MC 5')],
    blocks: [
      FIG(t`The HR diagram plots luminosity (up) against effective temperature, which increases to the <b>left</b> (historical: spectral type O B A F G K M runs left to right). About 90 % of stars sit on the <b>main sequence</b>, a diagonal band from hot luminous O stars (top left, $\sim40\,000$ K, $10^5L_\odot$) to cool faint M dwarfs (bottom right, $\sim3000$ K, $10^{-3}L_\odot$). Red giants and supergiants lie top right (cool but huge), white dwarfs bottom left (hot but tiny). Lines of constant radius run diagonally, because $L\propto R^2T^4$.`),
      P(t`Spectral classes are a temperature sequence read from absorption lines: O (ionised He), B (neutral He), A (strongest Balmer lines, ~10 000 K), F, G (Sun, 5800 K, Ca II), K, M (molecular TiO bands). The Balmer lines peak at A because hydrogen must be excited to $n=2$ (needs hot) but not ionised (Saha). Mnemonic: "Oh Be A Fine Girl/Guy, Kiss Me".`),
      INT(t`The main sequence is not an evolutionary track: it is a <b>mass sequence</b>. Stars sit there for most of their life burning hydrogen in the core; where they sit is fixed by mass. When the core hydrogen runs out the core contracts and heats, the envelope expands enormously: the star moves up and right to become a red giant (cooler surface, larger, more luminous).`),
      P(t`Star clusters: all stars have the same age and distance. The most massive stars leave the main sequence first, so the <b>turn-off point</b> moves down the main sequence with time: its mass tells the cluster's age ($\tau\propto M^{-2}$). Globular clusters have turn-offs below $1M_\odot$: ages above 10 Gyr.`),
      PIT(t`"Red giant" means lower $T_{\rm eff}$ AND higher $L$ (HS24 winter MC5): the radius grows by a factor ~100. Mass is (nearly) unchanged.`),
    ],
    check: [
      MC(t`When a star leaves the main sequence to become a red giant it becomes`, ['less massive and hotter', 'cooler and less luminous', 'cooler and more luminous', 'cooler and smaller'], 2, t`Up and to the right in the HR diagram.`, exam('w24', 'MC 5')),
      MC(t`The upper mass limit of main-sequence stars is due to`, ['the small optical depth of the interior', 'hydrogen depletion in the core', 'cosmic rays', 'radiation pressure overcoming gravity'], 3, t`Eddington limit: $L\propto M^3$ grows faster than $L_{Edd}\propto M$.`, exam('w25', 'MC 6')),
    ],
  },
];

const quiz = {
  type: 'quiz', id: 'Q1', title: 'Stellar Forge multiple choice', xp: 30, passMark: 0.75,
  source: [exam('w25', 'MC'), exam('s24', 'MC'), exam('w24', 'MC'), exam('p25', 'MC')],
  questions: [
    MC(t`Two main-sequence stars differ in mass by a factor 4. Lifetime ratio?`, ['4', '8', '16', '64'], 2, t`$\tau\propto M^{-2}$.`, exam('w25', 'MC 5')),
    MC(t`The upper mass limit of main-sequence stars comes from`, ['small optical depth', 'hydrogen depletion', 'cosmic rays', 'radiation pressure beating gravity'], 3, 'Eddington luminosity.', exam('w25', 'MC 6')),
    MC(t`A main-sequence star more massive than the Sun is`, ['less luminous, hotter, shorter-lived', 'more luminous, hotter, shorter-lived', 'more luminous, cooler, shorter-lived', 'more luminous, hotter, longer-lived'], 1, t`$L\propto M^3$, $M\propto T^2$, $\tau\propto M^{-2}$.`, exam('s24', 'MC 5')),
    MC(t`Leaving the main sequence for the red-giant branch, a star becomes`, ['less massive, hotter', 'cooler, less luminous', 'cooler, more luminous', 'cooler, smaller'], 2, 'Envelope expands.', exam('w24', 'MC 5')),
    MC(t`For a virialised self-gravitating system the total energy is`, [t`$2\bar K$`, t`$\bar K/2$`, t`$2\bar V$`, t`$\bar V/2$`], 3, t`$2\bar K+\bar V=0$.`, exam('w24', 'MC 10')),
    MC(t`The Sun's spectral class is`, ['O', 'B', 'G', 'M'], 2, 'G2V.', exam('p25', 'MC 5')),
    MC(t`The Kelvin–Helmholtz timescale of the Sun is about`, [t`$10^3$ yr`, t`$10^7$ yr`, t`$10^{10}$ yr`, t`$10^{13}$ yr`], 1, t`$|E_G|/2L\approx4\times10^{41}/(8\times10^{26})$ s $\approx10^7$ yr (Choudhuri (3.13)).`),
  ],
};

const derivations = [
  {
    type: 'derive', id: 'D1', title: 'Mass–luminosity relation from three equations', xp: 35,
    source: exam('p25', 'open Q2 [10 pt]'),
    goal: t`For a star in hydrostatic equilibrium with radiative transport and constant opacity, derive $L\propto M^3$ by scaling arguments.`,
    given: [t`$\frac{dP}{dr}=-\frac{GM_r\rho}{r^2}$`, t`$P\propto\rho T$`, t`$\frac{dT}{dr}=-\frac{3}{4a_Bc}\frac{\chi\rho L_r}{T^3 4\pi r^2}$`],
    steps: [
      { prompt: '(a) Hydrostatic equilibrium as a scaling relation for P.', reveal: t`$\frac PR\propto\frac{M}{R^2}\frac{M}{R^3}\Rightarrow P\propto\frac{M^2}{R^4}$.` },
      { prompt: '(b) Ideal gas: temperature.', reveal: t`$P\propto\rho T\propto\frac{M}{R^3}T\Rightarrow T\propto\frac{PR^3}{M}\propto\frac MR$.` },
      { prompt: '(c) Radiative transport: luminosity.', reveal: t`$\frac TR\propto\frac{\rho L}{T^3R^2}\propto\frac{ML}{R^5T^3}\Rightarrow L\propto\frac{(TR)^4}{M}$.` },
      { prompt: 'Combine.', reveal: t`$TR\propto M\Rightarrow L\propto M^4/M=M^3$. The radius drops out.` },
    ],
    keyPoints: ['$P\\propto M^2/R^4$', '$T\\propto M/R$', '$L\\propto(TR)^4/M$', '$L\\propto M^3$'],
  },
  {
    type: 'derive', id: 'D2', title: 'Virial theorem for N stars and the velocity dispersion', xp: 30,
    source: exam('p25', 'open Q5 [7 pt]; HS24 summer Q5 (harmonic radius version)'),
    goal: t`For $N$ stars of mass $m$ (total $M$) with mean separation $\langle R\rangle$ in virial equilibrium, show $\langle v^2\rangle=GM/(2\langle R\rangle)$.`,
    given: [t`$2\bar K+\bar V=0$`],
    steps: [
      { prompt: 'Kinetic energy.', reveal: t`$\bar K=\frac12mN\langle v^2\rangle=\frac12M\langle v^2\rangle$.` },
      { prompt: 'Potential energy: count the pairs.', reveal: t`$N(N-1)/2$ pairs, each $-Gm^2/\langle R\rangle$: $\bar V\simeq-\frac{N^2}{2}\frac{Gm^2}{\langle R\rangle}=-\frac{GM^2}{2\langle R\rangle}$ for large $N$.` },
      { prompt: 'Apply the virial theorem.', reveal: t`$M\langle v^2\rangle=\frac{GM^2}{2\langle R\rangle}\Rightarrow\langle v^2\rangle=\frac{GM}{2\langle R\rangle}\propto\frac{Nm}{\langle R\rangle}$.` },
    ],
    keyPoints: ['$\\bar K=\\frac12M\\langle v^2\\rangle$', 'pair counting $N(N-1)/2$', 'large-N limit', 'final result'],
  },
];

const calcs = [
  {
    type: 'calc', id: 'c5', title: 'Thermal versus gravitational energy of the Sun', fight: 'normal', xp: 30,
    problem: t`Model the Sun as fully ionised hydrogen at $T\sim10^7$ K with thermal energy $\frac32k_BT$ per particle (HS25 practice Q3). Compare with $|U_V|\simeq GM_\odot^2/(2R_\odot)$ and $L_\odot=3.828\times10^{26}$ W.`,
    vars: { ...pick('G', 'kB', 'mp', 'Msun', 'Rsun', 'Lsun', 'yr'), T: 1e7 },
    steps: [
      S('N', t`Number of particles $N=2M_\odot/m_p$ (protons plus electrons). Enter e.g. 2.4e57.`, '2*Msun/mp', 'dimensionless', ['dimensionless', 'kg', 'mol', 'm^-3'], 0.02, t`Each hydrogen atom gives two particles.`),
      S('UT', t`Thermal energy in units of $10^{41}$ J.`, '1.5*N*kB*T/1e41', '10^41 J', ['10^41 J', 'W', 'J/kg', 'K'], 0.02, t`$\frac32Nk_BT\approx4.9\times10^{41}$ J.`),
      S('UV', t`$GM_\odot^2/(2R_\odot)$ in units of $10^{41}$ J.`, 'G*Msun^2/(2*Rsun)/1e41', '10^41 J', ['10^41 J', 'W', 'J/kg', 'K'], 0.02, t`$\approx1.9\times10^{41}$ J: same order, as the virial theorem demands.`),
      S('tKH', t`Kelvin–Helmholtz time $|U_V|/L_\odot$ in Myr.`, 'UV*1e41/Lsun/yr/1e6', 'Myr', ['Myr', 'Gyr', 'yr', 's'], 0.03, t`About 16 Myr: the Sun cannot be powered by contraction for 4.6 Gyr.`),
    ],
  },
  {
    type: 'calc', id: 'c6', title: 'The nuclear timescale of the Sun', fight: 'normal', xp: 25,
    problem: t`Hydrogen burning releases 0.7 % of the rest mass ($4m_p\to$ He). Only the inner ~10 % of the Sun's mass is hot enough to burn. Estimate the main-sequence lifetime $\tau=0.007\times0.1\,M_\odot c^2/L_\odot$.`,
    vars: { ...pick('c', 'Msun', 'Lsun', 'yr'), eff: 0.007, fcore: 0.1 },
    steps: [
      S('E', t`Available nuclear energy in units of $10^{44}$ J.`, 'eff*fcore*Msun*c^2/1e44', '10^44 J', ['10^44 J', 'W', 'kg', 'J/kg'], 0.02, t`$0.0007\times1.99\times10^{30}\times(3\times10^8)^2$.`),
      S('tau', t`Lifetime in Gyr.`, 'E*1e44/Lsun/yr/1e9', 'Gyr', ['Gyr', 'Myr', 'yr', 's'], 0.03, t`About 10 Gyr: the Sun is middle-aged (4.6 Gyr).`),
    ],
  },
  {
    type: 'calc', id: 'c7', title: 'Constant-density Sun: central temperature', fight: 'normal', xp: 25,
    problem: t`For a constant-density star of fully ionised hydrogen, HS24 winter Q1 gives $T(r)=\frac{\pi}{3}\frac{m_HG\rho}{k_B}(R^2-r^2)$. Apply it to the Sun ($\rho=\bar\rho_\odot$, take $m_H=m_p$).`,
    vars: { ...pick('G', 'kB', 'mp', 'Msun', 'Rsun') },
    steps: [
      S('rho', t`Mean density of the Sun in kg m$^{-3}$.`, 'Msun/(4/3*pi*Rsun^3)', 'kg m^-3', ['kg m^-3', 'g cm^-3', 'kg', 'm^-3'], 0.02, t`$M/(\frac43\pi R^3)\approx1410$ kg m$^{-3}$, like water.`),
      S('Tc', t`Central temperature in units of $10^7$ K.`, 'pi/3*mp*G*rho/kB*Rsun^2/1e7', '10^7 K', ['10^7 K', 'K', 'eV', 'MK'], 0.02, t`$\approx5.8\times10^6$ K. The real centre is $1.57\times10^7$ K: a real star is centrally concentrated ($\rho_c\approx100\bar\rho$), so a uniform model underestimates $T_c$ by a factor ~3, but gets the order of magnitude right.`),
      S('r01', t`Radius (in units of $R$) where $\varepsilon\propto T^4$ drops to 10 % of its central value.`, '(1-0.1^0.25)^0.5', 'R', ['R', 'm', 'K', 'pc'], 0.02, t`$\varepsilon/\varepsilon_c=(1-r^2/R^2)^4=0.1\Rightarrow r/R=\sqrt{1-0.1^{1/4}}=0.66$.`),
    ],
  },
];

const boss = {
  type: 'boss', id: 'b2', title: 'Boss: the constant-density star (exam problem)', xp: 120, minutes: 25,
  source: exam('w24', 'Open Question 1 [constant-density star, 12 pt]'),
  instructions: 'Solve on paper under the timer, then enter the final numbers. Derivations are graded by you against the key points.',
  statement: [
    t`Consider a hypothetical star of radius $R$ with density $\rho$ that is constant, independent of the radial distance $r$ from the centre. The star is composed of a classical, non-relativistic, ideal gas of fully ionised hydrogen.`,
    t`(a) [4 pt] Using the hydrostatic equilibrium equation with the boundary condition $P(R)=0$, show that the pressure profile is $P(r)=\frac{2\pi}{3}G\rho^2(R^2-r^2)$. Hint: integrate from $r$ to $R$.`,
    t`(b) [4 pt] Using the equation of state, find the temperature profile $T(r)$.`,
    t`(c) [4 pt] Assume that the nuclear energy production rate depends on temperature as $\epsilon\propto T^4$. At what radius does $\epsilon$ decrease to 0.1 of its central value?`,
  ],
  finalAnswers: [
    { id: 'r', prompt: t`(c): $r/R$ where $\epsilon=0.1\epsilon_c$.`, answer: '(1-0.1**0.25)**0.5', vars: {}, tol: 0.02 },
    { id: 'Pc', prompt: t`(a) with numbers: central pressure for $R=R_\odot$, $\rho=1410$ kg m$^{-3}$, in units of $10^{14}$ Pa.`, answer: '2*pi/3*G*rho**2*R**2/1e14', vars: { ...pick('G'), rho: 1410, R: 6.957e8 }, tol: 0.03 },
  ],
  keyPoints: [
    t`(a) $M_r=\frac43\pi r^3\rho$; $\int_{P(r)}^{P(R)}dP=-\frac{4\pi}{3}G\rho^2\int_r^Rr'dr'$; $P(R)=0$ gives $P=\frac{2\pi}{3}G\rho^2(R^2-r^2)$.`,
    t`(b) $P=\frac{2\rho}{m_H}k_BT$ (two particles per $m_H$), so $T=\frac{\pi}{3}\frac{m_HG\rho}{k_B}(R^2-r^2)$.`,
    t`(c) $\epsilon/\epsilon_c=(1-r^2/R^2)^4=\alpha\Rightarrow r/R=(1-\alpha^{1/4})^{1/2}=0.66$ for $\alpha=0.1$.`,
  ],
};

export const extend = { 'stellar-forge': [...lessons, quiz, ...derivations, ...calcs, boss] };
export const sources = { 'stellar-forge': [exam('w24', 'open Q1, MC 5, 10'), exam('p25', 'open Q2, Q3, Q5; MC 4-5'), choud('Ch. 3.2-3.6')] };
export const codex = [
  { id: 'hse', group: 'Stellar structure', title: 'Structure equations', tex: t`\frac{dM_r}{dr}=4\pi r^2\rho,\ \frac{dP}{dr}=-\frac{GM_r\rho}{r^2},\ \frac{dL_r}{dr}=4\pi r^2\rho\varepsilon`, meaning: 'Mass continuity, hydrostatic equilibrium, energy generation; plus the radiative gradient.', source: 'Choudhuri (3.25)-(3.28)' },
  { id: 'eos', group: 'Stellar structure', title: 'Ideal gas', tex: t`P=\frac{\rho k_BT}{\mu m_H},\ \mu=(2X+\tfrac34Y+\tfrac12Z)^{-1}`, meaning: 'μ = 1/2 for ionised hydrogen.', source: 'Choudhuri (3.23)-(3.24)' },
  { id: 'virial', group: 'Stellar structure', title: 'Virial theorem', tex: t`2E_T+E_G=0,\ E=\tfrac12E_G`, meaning: 'Stars heat up when they lose energy.', source: 'Choudhuri (3.10)-(3.12)' },
  { id: 'kh', group: 'Stellar structure', title: 'Kelvin–Helmholtz time', tex: t`\tau_{KH}\approx\frac{GM^2}{2RL}\approx10^7\,\mathrm{yr}\ (\odot)`, meaning: 'Shining by contraction alone.', source: 'Choudhuri (3.13)' },
  { id: 'scal', group: 'Stellar structure', title: 'Main-sequence scalings', tex: t`P\propto\frac{M^2}{R^4},\ T\propto\frac MR,\ L\propto M^3,\ L\propto T_{\rm eff}^6,\ \tau\propto M^{-2}`, meaning: 'Homology-type estimates with constant opacity.', source: 'Choudhuri (3.33)-(3.41)' },
  { id: 'Ledd', group: 'Stellar structure', title: 'Eddington luminosity', tex: t`L_{Edd}=\frac{4\pi cGM}{\chi}=\frac{4\pi GMm_pc}{\sigma_T}\approx3.3\times10^4L_\odot\frac{M}{M_\odot}`, meaning: 'Radiation pressure balances gravity.', source: 'HS24 summer Q3' },
  { id: 'nuct', group: 'Stellar structure', title: 'Nuclear timescale', tex: t`\tau_{\rm nuc}\approx\frac{0.007\cdot0.1\,Mc^2}{L}\approx10^{10}\,\mathrm{yr}\ (\odot)`, meaning: '0.7 % mass defect of H → He, 10 % of the mass burns.' },
];
