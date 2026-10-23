// The first four rooms (exam-derived calc fights and bosses). Lessons, quizzes and derivations are added
// to these rooms in their own modules (see build.mjs).
import { K, pick, S } from '../lib.mjs';
const src = (file, where) => ({ file: `materials/astrophysics/old-exams/${file}`, where });
const EX = { w25: 'Astro_I_2025_Winter_Session_with_Solutions.pdf', s24: 'Astro_I_2024_Summer_Session_with_Solutions.pdf' };
const notes = (f) => ({ file: `notes/astrophysics/${f}`, where: 'transcription, formulas and checks' });
const choud = (where) => ({ file: 'materials/astrophysics/scripts/Choudhuri_Textbook.pdf', where });

const rooms = {};

rooms['photometry-radiation'] = {
  id: 'astro-photometry-radiation', region: 'Astro Observatory Ship', title: 'The Light Deck', course: 'astrophysics',
  topics: ['magnitudes', 'angular size', 'Wien law', 'main-sequence scaling', 'blackbody', 'Rayleigh-Jeans', 'CMB'],
  sources: [
    src(EX.w25, 'Open Q1 (magnitudes, eye resolution), Q2 (CMB vs dust), Q3 (10 Msun star), MC 1-4'),
    src(EX.s24, 'Open Q1 (SN Ia in Andromeda), Q2 (CMB, Rayleigh-Jeans, bolometer, dT)'),
    choud('Ch. 1.3-1.4 (magnitudes, parallax), Ch. 2.2-2.3 (radiative transfer, blackbody), Ch. 3.5 (main sequence)'),
    notes('01-light-and-radiation.md'),
  ],
  intro: 'The Light Deck is where every number on the ship starts: how bright is a star, how far away, how hot, and what colour. Every Refregier exam opens with magnitudes and blackbody radiation, so these doors must be fast and automatic. Constants come from the exam table: use SI.',
  encounters: [
    {
      type: 'calc', id: 'c1', title: 'How far can you still see the Sun?', fight: 'normal',
      problem: 'The Sun has radius $R_\\odot=6.957\\times10^8$ m and apparent magnitude $m_\\odot=-26.8$ at $1$ AU ($=1.495\\times10^{11}$ m). The naked eye resolves $1$ arcmin and detects sources down to $m\\sim7$. Ignore extinction and expansion.',
      vars: { ...pick('Rsun', 'AU', 'pc'), msun: -26.8, mlim: 7 },
      steps: [
        S('theta', 'Angular resolution of the eye in radians, $1\' = \\frac{1}{60}\\frac{\\pi}{180}$.', '(1/60)*(pi/180)', 'rad', ['rad', 'deg', 'arcsec', 'dimensionless'], 0.01, '$1^\\circ=\\pi/180$ rad and $1^\\circ=60\'$. The result is about $2.9\\times10^{-4}$.'),
        S('dres', 'Distance at which the Sun (diameter $2R_\\odot$) shrinks to $1\'$: $\\theta\\simeq 2R_\\odot/d$. Give it in AU.', '2*Rsun/theta/AU', 'AU', ['AU', 'pc', 'm', 'R_sun'], 0.03, 'Small-angle approximation $\\theta\\simeq D/d$ with $D=2R_\\odot$. Then divide by $1\\,\\text{AU}$.'),
        S('dvis', 'Distance at which the Sun fades to $m=7$. From $m_\\odot-m = 2.5\\log_{10}(F/F_\\odot)=5\\log_{10}(1\\,\\text{AU}/d)$. Give it in parsec.', 'AU*10^((mlim-msun)/5)/pc', 'pc', ['pc', 'AU', 'kpc', 'ly'], 0.03, 'Flux $\\propto d^{-2}$, so $\\Delta m = 5\\log_{10}(d/1\\,\\text{AU})$. Solve for $d$: $d=1\\,\\text{AU}\\cdot10^{(7-m_\\odot)/5}$, then divide by $3.0857\\times10^{16}$ m/pc.'),
      ],
      xp: 40,
    },
    {
      type: 'calc', id: 'c2', title: 'A 10 solar-mass star: colour and temperature', fight: 'normal',
      problem: 'On the main sequence $L\\propto M^3$ and $L\\propto T_{\\rm eff}^6$ (Refregier\'s scalings). A star has $M=10\\,M_\\odot$. Take $T_{\\rm eff,\\odot}=5770$ K and Wien\'s law $\\lambda_{\\max}T=b=2.898\\times10^{-3}$ m K.',
      vars: { M: 10, Tsun: 5770, b: 2.898e-3 },
      steps: [
        S('Teff', 'Surface temperature of the star: eliminate $L$, $T_{\\rm eff}\\propto M^{1/2}$.', 'Tsun*M^0.5', 'K', ['K', 'eV', 'K^2', 'dimensionless'], 0.02, '$M^3\\propto T^6\\Rightarrow T\\propto M^{1/2}$.'),
        S('lam', 'Peak wavelength of the star in nm.', 'b/Teff*1e9', 'nm', ['nm', 'm', 'Å', 'µm'], 0.02, 'Wien: $\\lambda_{\\max}=b/T$; multiply by $10^9$ for nm. Sun: 502 nm.'),
        S('ratio', 'Ratio $\\lambda_{\\max,\\star}/\\lambda_{\\max,\\odot}$. (Below 1 means the star looks bluer.)', 'lam/(b/Tsun*1e9)', 'dimensionless', ['dimensionless', 'nm', 'K', 'K^-1'], 0.02, 'Equals $T_\\odot/T_\\star=M^{-1/2}$.'),
      ],
      xp: 30,
    },
    {
      type: 'calc', id: 'c3', title: 'A supernova in Andromeda', fight: 'normal',
      problem: 'A Type Ia supernova (peak absolute magnitude $M=-19.3$) explodes in Andromeda at $d=765$ kpc. Ignore extinction. Proxima Centauri has $m=11$.',
      vars: { M: -19.3, dkpc: 765, mprox: 11 },
      steps: [
        S('m', 'Apparent magnitude from the distance modulus $m-M=5\\log_{10}(d/10\\,\\text{pc})$.', '5*log10(dkpc*1000/10)+M', 'mag', ['mag', 'dimensionless', 'pc', 'W m^-2'], 0.02, '$d/10\\,\\text{pc}=7.65\\times10^4$, so the modulus is $24.4$.'),
        S('F', 'Flux ratio $F_{\\rm SN}/F_{\\rm Proxima}$ with $\\Delta m = 2.5\\log_{10}(F_1/F_2)$.', '10^((mprox-m)/2.5)', 'dimensionless', ['dimensionless', 'mag', 'W m^-2', 'pc'], 0.05, 'Fainter objects have the bigger magnitude: $F_{\\rm SN}/F_{\\rm P}=10^{0.4(m_P-m_{SN})}$. Expect a few hundred.'),
      ],
      xp: 30,
    },
    {
      type: 'calc', id: 'c4', title: 'CMB in the Rayleigh-Jeans window', fight: 'normal',
      problem: 'The CMB has $T=2.725$ K. A telescope with $A=3\\,\\text{m}^2$ sees $\\Omega=0.5\\,\\text{deg}^2$ of sky in the K-band $18$-$27$ GHz, uniformly sensitive. Use $B_\\nu=\\frac{2h\\nu^3}{c^2}\\frac{1}{e^{h\\nu/k_BT}-1}$.',
      vars: { ...pick('h', 'kB', 'c'), T: 2.725, A: 3, Om_deg2: 0.5, n1: 18e9, n2: 27e9, n3: 100e9 },
      steps: [
        S('nuRJ', 'The Rayleigh-Jeans limit holds for $\\nu\\ll k_BT/h$. Compute $k_BT/h$ in GHz.', 'kB*T/h*1e-9', 'GHz', ['GHz', 'MHz', 'THz', 'K'], 0.02, 'Expand $e^x-1\\approx x$ with $x=h\\nu/k_BT$. The limit frequency is $k_BT/h\\approx57$ GHz.'),
        S('P', 'Power on the sensor in pW: $P=\\frac{2k_BT}{c^2}\\frac{\\nu_2^3-\\nu_1^3}{3}A\\,\\Omega$, with $\\Omega$ in sr.', '2*kB*T/c^2*(n2^3-n1^3)/3*A*Om_deg2*(pi/180)^2*1e12', 'pW', ['pW', 'nW', 'W', 'W m^-2'], 0.03, 'RJ: $B_\\nu=2k_BT\\nu^2/c^2$. Integrate $\\int\\nu^2d\\nu=\\Delta(\\nu^3)/3$. Convert $\\text{deg}^2$ to sr with $(\\pi/180)^2$. Expect about $1.8$ pW. (The printed official key says $2.5$ pW, but it does not follow from its own prefactor $3.83\\times10^{-43}$: see notes.)'),
        S('x', 'At $\\nu=100$ GHz, RJ is no longer valid. Compute $x=h\\nu/k_BT$.', 'h*n3/(kB*T)', 'dimensionless', ['dimensionless', 'GHz', 'K', 'eV'], 0.02, '$x=h\\nu/(k_BT)\\approx1.76$ (order unity: far from $x\\ll1$).'),
        S('dT', 'The 100 GHz intensity fluctuation $\\delta I_\\nu=0.05$ MJy/sr corresponds to what $\\delta T_{\\rm CMB}$ in µK? Use $\\partial B_\\nu/\\partial T=\\frac{2h\\nu^3}{c^2T}\\frac{xe^x}{(e^x-1)^2}$ and $1\\,\\text{Jy}=10^{-26}$ W m$^{-2}$Hz$^{-1}$.', '0.05e6*1e-26/(2*h*n3^3/(c^2*T)*x*exp(x)/(exp(x)-1)^2)*1e6', 'µK', ['µK', 'mK', 'K', 'MJy/sr'], 0.03, 'Invert: $\\delta T=\\delta I_\\nu\\big/\\frac{\\partial B_\\nu}{\\partial T}$. Expect a couple of hundred µK.'),
      ],
      xp: 60,
    },
    {
      type: 'boss', id: 'b1', title: 'Boss: CMB versus thermal dust (exam problem)',
      source: src(EX.w25, 'Open Question 2 [CMB and thermal dust, 10 pt], HS25 winter session'),
      minutes: 20,
      instructions: 'Solve on paper under the timer, then enter the final answers. Parts (a) and (c) are graded by you against the key points.',
      statement: [
        'In cosmological observations of fluctuations in the cosmic microwave background (CMB), thermal dust emission in our galaxy can act as a systematic foreground.',
        '(a) [4 pt] The specific intensity $I_\\nu$ of thermal emission of an optically thick object depends only on its temperature $T$ and is given by $B_\\nu(T)=\\frac{2h}{c^2}\\frac{\\nu^3}{e^{h\\nu/k_BT}-1}$. Show that for all frequencies $\\nu$ this specific intensity increases as the temperature increases.',
        '(b) [4 pt] The CMB is observed as a near perfect blackbody of temperature $T_{\\rm CMB}=2.73$ K. A typical CMB intensity fluctuation has amplitude $10^{-5}B_\\nu(T_{\\rm CMB})$. Dust in our galaxy is observed at $T_d=20$ K. Assuming this dust emission is also optically thick everywhere, show that at $\\nu=100$ GHz the dust emission would be $\\sim1.8\\times10^6$ times brighter than the CMB fluctuation.',
        '(c) [2 pt] The dust is not optically thick but a modified blackbody (greybody): $I_\\nu=\\tau_\\nu B_\\nu(T_d)$ with $\\tau_\\nu=\\tau_{353}(\\nu/353\\,\\text{GHz})^\\beta$. With $T_d=20$ K and $\\beta=1.6$, for what values of $\\tau_{353}$ would the CMB fluctuation be brighter than the dust at $\\nu=100$ GHz?',
      ],
      finalAnswers: [
        { id: 'ratio', prompt: 'Part (b): the ratio $B_{100}(20\\,\\text{K})/(10^{-5}B_{100}(2.73\\,\\text{K}))$ (enter as e.g. 1.8e6).', answer: '(1/(exp(h*nu/(kB*Td))-1))/(1e-5/(exp(h*nu/(kB*Tc))-1))', vars: { ...pick('h', 'kB'), nu: 1e11, Td: 20, Tc: 2.73 }, tol: 0.05 },
        { id: 'tau', prompt: 'Part (c): the upper bound on $\\tau_{353}$ (enter as e.g. 4.2e-6).', answer: '(1e11/353e9)^(-1.6)/((1/(exp(h*nu/(kB*Td))-1))/(1e-5/(exp(h*nu/(kB*Tc))-1)))', vars: { ...pick('h', 'kB'), nu: 1e11, Td: 20, Tc: 2.73 }, tol: 0.05 },
      ],
      keyPoints: [
        '(a) Differentiate: $\\partial B_\\nu/\\partial T=\\frac{2h^2\\nu^4}{c^2k_BT^2}\\frac{e^{h\\nu/k_BT}}{(e^{h\\nu/k_BT}-1)^2}>0$ since both exponentials are positive.',
        '(b) Only the temperature-dependent factor matters: $h\\nu/k_BT_d=0.24$ gives $1/(e^{0.24}-1)=3.7$; $h\\nu/k_BT_{CMB}=1.76$ gives $0.21$. Ratio $3.7/(0.21\\times10^{-5})\\simeq1.8\\times10^6$.',
        '(c) Require $\\tau_{100}=\\tau_{353}(100/353)^{1.6}<1/(1.8\\times10^6)$, so $\\tau_{353}\\lesssim4.2\\times10^{-6}$.',
      ],
      xp: 120,
    },
  ],
};

rooms['stellar-forge'] = {
  id: 'astro-stellar-forge', region: 'Astro Observatory Ship', title: 'The Stellar Forge', course: 'astrophysics',
  topics: ['hydrostatic equilibrium', 'Eddington luminosity', 'main-sequence scaling', 'virial theorem', 'tidal disruption'],
  sources: [
    src(EX.s24, 'Open Q3 (hydrostatic equilibrium, Eddington), Q5 (virial theorem), Q6 (tidal disruption)'),
    src(EX.w25, 'MC 5, 6, 10 (lifetime scaling, upper mass limit, virial)'),
    choud('Ch. 3.2 (hydrostatic equilibrium, virial theorem), Ch. 3.6.1 (Eddington), Ch. 7.2'),
    notes('02-stars-and-virial.md'),
  ],
  intro: 'Gravity pulls in, pressure pushes out. In the forge you balance the two, find out why stars cannot grow beyond a few hundred solar masses, and use the virial theorem on everything from clusters to galaxies.',
  encounters: [
    {
      type: 'calc', id: 'c1', title: 'The Eddington limit and the upper mass of stars', fight: 'normal',
      problem: 'Radiation pressure balances gravity at the surface when $L_{\\rm Edd}=4\\pi cGM/\\chi$ (Refregier\'s result, hydrostatic equilibrium plus $F=-\\frac{c}{\\alpha}\\frac{dP}{dr}$, $\\alpha=\\chi\\rho$). For electron scattering $\\chi=\\sigma_T/m_p$. Use $L_\\odot=3.828\\times10^{26}$ W and a $10\\,M_\\odot$ star.',
      vars: { ...pick('G', 'c', 'mp', 'sigT', 'Msun'), M: 10, Lsun: 3.828e26 },
      steps: [
        S('chi', 'Electron-scattering opacity $\\chi=\\sigma_T/m_p$ in m$^2$/kg.', 'sigT/mp', 'm^2/kg', ['m^2/kg', 'm^2', 'kg/m^3', 'm^-1'], 0.02, 'Thomson cross-section per proton mass (fully ionised hydrogen). Roughly $0.04$ m$^2$/kg.'),
        S('LEdd', 'Eddington luminosity of the $10\\,M_\\odot$ star, in $L_\\odot$.', '4*pi*c*G*M*Msun/chi/Lsun', 'L_sun', ['L_sun', 'W', 'M_sun', 'W m^-2'], 0.03, '$L_{\\rm Edd}=4\\pi cGM/\\chi$. Divide by $L_\\odot$ at the end. Rule of thumb: $3.3\\times10^4\\,L_\\odot(M/M_\\odot)$.'),
        S('Mup', 'Using $L=L_\\odot(M/M_\\odot)^3$, the mass at which $L=L_{\\rm Edd}$: give $M$ in $M_\\odot$.', 'sqrt(4*pi*c*G*Msun/chi/Lsun)', 'M_sun', ['M_sun', 'L_sun', 'kg', 'dimensionless'], 0.03, '$(M/M_\\odot)^3=33000\\,(M/M_\\odot)\\Rightarrow M^2=3.3\\times10^4$. A crude upper mass limit of main-sequence stars.'),
      ],
      xp: 60,
    },
    {
      type: 'calc', id: 'c2', title: 'Burning bright, dying young', fight: 'fermi',
      problem: 'The Sun lives $\\tau_\\odot\\approx10^{10}$ yr on the main sequence. With $\\tau\\propto M^{-2}$ (from $\\tau\\propto M/L$ and $L\\propto M^3$), estimate the main-sequence lifetime of a $10\\,M_\\odot$ star in Myr (within a factor of 1.3).',
      vars: { tsun: 1e10, M: 10 },
      steps: [
        S('tau', 'Lifetime in Myr.', 'tsun*M^(-2)/1e6', 'Myr', ['Myr', 'Gyr', 'yr', 'kyr'], 0.1, 'Fuel $\\propto M$, burn rate $\\propto L\\propto M^3$, so $\\tau\\propto M^{-2}$: a factor 100 shorter for $M=10$.', { tolType: 'log' }),
      ],
      xp: 20,
    },
    {
      type: 'calc', id: 'c3', title: 'Virial velocity of a globular cluster', fight: 'normal',
      problem: 'A virialised system of $N\\gg1$ equal-mass particles has $K=\\frac12M\\sigma_v^2$ and $V\\simeq-GM^2/(2r_H)$ with the harmonic radius $r_H^{-1}=\\frac{2}{N(N-1)}\\sum_{i>j}r_{ij}^{-1}$. The virial theorem is $2K+V=0$. Take a globular cluster with $M=10^5\\,M_\\odot$, $r_H=5$ pc.',
      vars: { ...pick('G', 'Msun', 'pc', 'yr'), M: 1e5, rH: 5 },
      steps: [
        S('sig2', 'From $2K+V=0$ the squared dispersion $\\sigma_v^2=GM/(2r_H)$, in (m/s)$^2$.', 'G*M*Msun/(2*rH*pc)', 'm^2/s^2', ['m^2/s^2', 'm/s', 'J', 'm^2/s'], 0.02, '$2\\cdot\\frac12M\\sigma^2=GM^2/(2r_H)\\Rightarrow\\sigma^2=GM/(2r_H)$. Convert $M_\\odot$ and pc to SI.'),
        S('sig', 'Velocity dispersion $\\sigma_v$ in km/s.', 'sqrt(sig2)/1000', 'km/s', ['km/s', 'm/s', 'km^2/s^2', 'c'], 0.02, 'Square root, then divide by 1000.'),
        S('tcross', 'Crossing time $t=r_H/\\sigma_v$ in Myr.', 'rH*pc/sqrt(sig2)/yr/1e6', 'Myr', ['Myr', 'yr', 'Gyr', 'kyr'], 0.03, 'About $0.75$ Myr; compare the age of $\\sim10$ Gyr: the cluster has crossed itself thousands of times, hence virialised.'),
      ],
      xp: 40,
    },
    {
      type: 'calc', id: 'c4', title: 'How close can the Milky Way get to a cD galaxy?', fight: 'normal',
      problem: 'Tidal acceleration $a_{\\rm tidal}\\simeq2GMr/d^3$ (Taylor expansion of $GM/d^2-GM/(d+r)^2$). A small galaxy of mass $m$, radius $r$ is disrupted when $a_{\\rm tidal}>Gm/r^2$. Milky Way: $m=10^{12}M_\\odot$, $r=10$ kpc; cD galaxy $M=10^{14}M_\\odot$.',
      vars: { m: 1e12, M: 1e14, r: 10 },
      steps: [
        S('ratio', 'Mass ratio factor $2M/m$.', '2*M/m', 'dimensionless', ['dimensionless', 'M_sun', 'kpc', 'kg'], 0.01, 'Both masses in $M_\\odot$, so the ratio is just $200$.'),
        S('d', 'Disruption distance $d_{\\rm limit}=(2M/m)^{1/3}r$ in kpc.', 'ratio^(1/3)*r', 'kpc', ['kpc', 'Mpc', 'pc', 'dimensionless'], 0.02, 'Set $2GMr/d^3=Gm/r^2$, so $d^3=2Mr^3/m$.'),
      ],
      xp: 35,
    },
    {
      type: 'boss', id: 'b1', title: 'Boss: hydrostatic equilibrium to the Eddington limit (exam problem)',
      source: src(EX.s24, 'Open Question 3 [Stability of a star, 10 pt], HS24 summer session'),
      minutes: 20,
      instructions: 'Solve on paper under the timer, then enter the final numbers. The derivations (a), (b) are graded by you against the key points.',
      statement: [
        'The stability of a star relies on the balance between gravity and pressure within its material.',
        '(a) [4 pt] By considering a differential volume element at radius $r$ in a spherical star, derive the condition for hydrostatic equilibrium, $\\frac{dP}{dr}=-\\frac{GM_r\\rho}{r^2}$, where $P$ and $\\rho$ are pressure and density at radius $r$ and $M_r$ is the enclosed mass.',
        '(b) [4 pt] Using this and assuming the pressure is dominated by radiation pressure with absorption coefficient $\\alpha=\\chi\\rho$ for some opacity $\\chi$, derive the radiative luminosity required to perfectly balance gravitation at the surface $r=R$. Express the answer in terms of the opacity $\\chi$. Hint: use $F=-\\frac{c}{\\alpha}\\frac{dP}{dr}$.',
        '(c) [2 pt] What is the name of this luminosity limit?',
      ],
      finalAnswers: [
        { id: 'LEdd', prompt: 'Evaluate (b) for $M=20\\,M_\\odot$, $\\chi=0.04$ m$^2$/kg: $L$ in watts (enter as e.g. 1.2e31).', answer: '4*pi*c*G*M*Msun/chi', vars: { ...pick('G', 'c', 'Msun'), M: 20, chi: 0.04 }, tol: 0.03 },
        { id: 'Lsol', prompt: 'The same $L$ in units of $L_\\odot=3.828\\times10^{26}$ W.', answer: '4*pi*c*G*M*Msun/chi/3.828e26', vars: { ...pick('G', 'c', 'Msun'), M: 20, chi: 0.04 }, tol: 0.03 },
      ],
      keyPoints: [
        '(a) Slab of area $dA$, thickness $dr$: pressure force $-dP\\,dA$, gravity $-\\frac{GM_r\\rho}{r^2}dA\\,dr$; set the sum to zero.',
        '(b) $F=L/4\\pi R^2=-\\frac{c}{\\chi\\rho}\\frac{dP}{dr}$ and $\\frac{dP}{dr}|_R=-\\frac{GM\\rho}{R^2}$, so $\\frac{\\chi\\rho}{c}\\frac{L}{4\\pi R^2}=\\frac{GM\\rho}{R^2}\\Rightarrow L=\\frac{4\\pi cGM}{\\chi}$. Density and radius cancel.',
        '(c) Eddington luminosity (limit): above it radiation pressure expels the envelope.',
      ],
      xp: 120,
    },
  ],
};

rooms['galactic-dynamics'] = {
  id: 'astro-galactic-dynamics', region: 'Astro Observatory Ship', title: 'The Dynamics Bay', course: 'astrophysics',
  topics: ['rotation curves', 'dark matter', 'Plummer sphere', 'extinction', 'cluster scaling relations', 'bremsstrahlung'],
  sources: [
    src(EX.w25, 'Open Q4 (Plummer sphere), Q5 (bremsstrahlung and cluster scaling), MC 12'),
    src(EX.s24, 'Open Q4 (extinction towards the Galactic centre), MC 13 (flat rotation curve density)'),
    choud('Ch. 6.1-6.3 (Galactic structure), Ch. 7.3-7.6 (stellar dynamics), Ch. 9.5 (clusters), Ch. 8.11 (bremsstrahlung)'),
    notes('03-galaxies-dynamics.md'),
  ],
  intro: 'Stars in a galaxy never collide: they move in the smooth potential of everyone else. Here you read a rotation curve, build a Plummer sphere from its distribution function, and use scaling arguments to weigh a galaxy cluster from its X-rays.',
  encounters: [
    {
      type: 'calc', id: 'c1', title: 'Weighing the Galaxy with a flat rotation curve', fight: 'normal',
      problem: 'The rotation curve is flat at $v_c=220$ km/s. Equating centripetal and gravitational acceleration, $v_c^2=GM_r/r$. Evaluate at $r=8$ kpc ($1$ kpc $=10^3$ pc).',
      vars: { ...pick('G', 'Msun', 'pc'), v: 220, r: 8 },
      steps: [
        S('Mr', 'Enclosed mass $M_r=v_c^2r/G$ in $M_\\odot$.', '(v*1000)^2*r*1000*pc/G/Msun', 'M_sun', ['M_sun', 'kg', 'M_sun/pc^3', 'pc'], 0.03, '$v$ in m/s, $r$ in metres ($8000\\times3.0857\\times10^{16}$ m).'),
        S('rho', 'Mass density $\\rho=v_c^2/(4\\pi Gr^2)$ (from $M_r=4\\pi\\int r^2\\rho\\,dr\\propto r$, i.e. $\\rho\\propto r^{-2}$) in $M_\\odot/\\text{pc}^3$.', '(v*1000)^2/(4*pi*G*(r*1000*pc)^2)*pc^3/Msun', 'M_sun/pc^3', ['M_sun/pc^3', 'kg/m^3', 'M_sun', 'g/cm^3'], 0.04, 'Differentiate $M_r=v_c^2r/G$: $dM/dr=4\\pi r^2\\rho=v_c^2/G$. Then convert kg/m$^3$ to $M_\\odot$/pc$^3$ with $pc^3/M_\\odot$.'),
      ],
      xp: 40,
    },
    {
      type: 'calc', id: 'c2', title: 'Dust towards the Galactic centre', fight: 'normal',
      problem: 'Toy model $n_H\\propto\\exp[-(r/r_0)^2]$, $r(s)=\\sqrt{d^2+s^2-2ds\\cos b}$ with $d=8$ kpc, $r_0=1.2$ kpc, and $A_V(b=0)=30$. The Gaussian integral gives $A_V(b)=30\\exp\\left[\\frac{d^2}{r_0^2}(\\cos^2b-1)\\right]$.',
      vars: { d: 8, r0: 1.2, b: 15 },
      steps: [
        S('AV', 'Visual extinction at $l=0^\\circ$, $b=15^\\circ$.', '30*exp(d^2/r0^2*(cos(b*pi/180)^2-1))', 'mag', ['mag', 'dimensionless', 'kpc', 'W m^-2'], 0.03, '$\\cos^2 15^\\circ=0.933$; the exponent is $44.4\\times(-0.067)$.'),
        S('F', 'Flux ratio $F_{\\rm ext}/F_0$ with $A_V=m_{\\rm ext}-m_0=2.5\\log_{10}(F_0/F_{\\rm ext})$.', '10^(-AV/2.5)', 'dimensionless', ['dimensionless', 'mag', 'kpc', 'W m^-2'], 0.04, 'Extinction dims the object: $F_{\\rm ext}/F_0=10^{-A_V/2.5}\\approx0.24$.'),
      ],
      xp: 40,
    },
    {
      type: 'calc', id: 'c3', title: 'Scaling a galaxy cluster from its X-rays', fight: 'normal',
      problem: 'Thermal bremsstrahlung: $L_X\\propto\\int\\rho_g^2T^{1/2}dV$. Virial equilibrium with thermal support gives $T\\propto M/\\langle R\\rangle$; with $M\\propto\\langle R\\rangle^3$ and $M_g=f_gM$ this gives $T\\propto M^{2/3}$ and $L_X\\propto M^{4/3}$. A cluster is 8 times more massive than another with the same gas fraction.',
      vars: { k: 8 },
      steps: [
        S('Tr', 'Ratio of gas temperatures $T_2/T_1=k^{2/3}$.', 'k^(2/3)', 'dimensionless', ['dimensionless', 'K', 'keV', 'M_sun'], 0.02, '$T\\propto M^{2/3}$, $8^{2/3}=4$.'),
        S('Lr', 'Ratio of X-ray luminosities $L_2/L_1=k^{4/3}$.', 'k^(4/3)', 'dimensionless', ['dimensionless', 'W', 'erg/s', 'M_sun'], 0.02, '$\\rho_g^2\\propto R^{-6}M^2=M^0$ (constant), times $T^{1/2}\\propto M^{1/3}$, times volume $\\propto M$: $L_X\\propto M^{4/3}$. $8^{4/3}=16$.'),
      ],
      xp: 30,
    },
    {
      type: 'boss', id: 'b1', title: 'Boss: the Plummer sphere (exam problem)',
      source: src(EX.w25, 'Open Question 4 [Plummer sphere, 14 pt], HS25 winter session'),
      minutes: 30,
      instructions: 'Solve on paper under the timer, then enter the final numbers. Part (a) is graded by you against the key points.',
      statement: [
        'A Plummer sphere is a collisionless stellar system of self-gravitating particles of mass $m$, spherically symmetric, with distribution function $f(\\mathcal{E})=f_0(-\\mathcal{E})^{7/2}$ for $\\mathcal{E}<0$ and $0$ for $\\mathcal{E}\\ge0$, where $\\mathcal{E}=v^2/2+\\Phi(r)$ is the energy per unit mass.',
        '(a) [6 pt] Show that the mass density $\\rho(\\Phi)\\propto(-\\Phi)^5$. Hints: $\\rho(r)=4\\pi m\\int_0^{v_{\\max}}f_0(-\\mathcal{E})^{7/2}v^2dv$; relate $v_{\\max}$ to $\\Phi$; define $x=v^2/(-2\\Phi)$; note $\\int_0^1x^{1/2}(1-x)^{7/2}dx=7\\pi/256$.',
        '(b) [4 pt] With $\\Phi(r)=-GM/\\sqrt{r^2+a^2}$ (no derivation needed), find the circular velocity profile $v_c(r)$.',
        '(c) [4 pt] With the Poisson equation $\\frac{1}{r^2}\\frac{d}{dr}(r^2\\frac{d\\Phi}{dr})=4\\pi G\\rho$, derive $\\rho(r)$ and the central density.',
      ],
      finalAnswers: [
        { id: 'vc', prompt: 'Part (b): $v_c$ at $r=a$ for $M=10^{11}M_\\odot$, $a=1$ kpc, in km/s.', answer: 'sqrt(G*M*Msun)*(a*1000*pc)/(2*(a*1000*pc)^2)^0.75/1000', vars: { ...pick('G', 'Msun', 'pc'), M: 1e11, a: 1 }, tol: 0.03 },
        { id: 'rho0', prompt: 'Part (c): the central density $3M/(4\\pi a^3)$ for the same $M$, $a$, in $M_\\odot/\\text{pc}^3$.', answer: '3*M/(4*pi*(a*1000)^3)', vars: { M: 1e11, a: 1 }, tol: 0.02 },
        { id: 'rhoa', prompt: 'Density at $r=a$ in units of $\\rho(0)$ (enter 0.xxx).', answer: '2^(-2.5)', vars: {}, tol: 0.02 },
      ],
      keyPoints: [
        '(a) $\\mathcal{E}<0\\Leftrightarrow v<v_{\\max}=\\sqrt{-2\\Phi}$. With $x=v^2/(-2\\Phi)$: $-\\mathcal{E}=-\\Phi(1-x)$, $v=\\sqrt{-2\\Phi x}$, $dv=\\sqrt{-\\Phi/2}\\,x^{-1/2}dx$. Then $\\rho=4\\sqrt2\\pi mf_0(-\\Phi)^5\\int_0^1x^{1/2}(1-x)^{7/2}dx=\\frac{7\\pi^2\\sqrt2\\,mf_0}{64}(-\\Phi)^5$. Powers of $(-\\Phi)$: $7/2+3/2=5$.',
        '(b) $v_c^2/r=d\\Phi/dr=GMr/(r^2+a^2)^{3/2}$, so $v_c=\\sqrt{GM}\\,r/(r^2+a^2)^{3/4}$.',
        '(c) $r^2\\Phi\'=GMr^3/(r^2+a^2)^{3/2}$; derivative: $3GMa^2r^2/(r^2+a^2)^{5/2}$. Hence $\\rho=\\frac{3M}{4\\pi a^3}(1+r^2/a^2)^{-5/2}$, $\\rho(0)=\\frac{3M}{4\\pi a^3}$. Consistent with (a): $\\rho\\propto(r^2+a^2)^{-5/2}\\propto(-\\Phi)^5$.',
      ],
      xp: 150,
    },
  ],
};

rooms['expanding-universe'] = {
  id: 'astro-expanding-universe', region: 'Astro Observatory Ship', title: 'The Expansion Engine', course: 'astrophysics',
  topics: ['Friedmann equation', 'radiation era', 'BBN', 'Hubble law', 'redshift', 'black hole growth', 'Salpeter time'],
  sources: [
    src(EX.w25, 'Open Q6 (BH accretion, Salpeter time), Q7 (radiation-dominated universe, BBN), MC 13-15'),
    src(EX.s24, 'Open Q7 (Friedmann equation with equation of state w), MC 14-15'),
    choud('Ch. 10.3-10.7 (FRW, Friedmann, eras), Ch. 11.2-11.3 (BBN), Ch. 9.4 (accretion)'),
    notes('04-cosmos-and-accretion.md'),
  ],
  intro: 'Every recent Refregier exam closes with a Friedmann-equation problem. In the Expansion Engine you derive how a(t) depends on what fills the universe, date nucleosynthesis, and let a black hole feed at the Eddington rate.',
  encounters: [
    {
      type: 'calc', id: 'c1', title: 'Light from the last scattering', fight: 'normal',
      problem: 'The CMB temperature today is $T_0=2.725$ K and scales as $T\\propto a^{-1}\\propto1+z$. Recombination happens at $T_{\\rm rec}\\approx3000$ K. Wien\'s constant is $b=2.898\\times10^{-3}$ m K.',
      vars: { T0: 2.725, Trec: 3000, b: 2.898e-3 },
      steps: [
        S('z', 'Redshift of recombination $z_{\\rm rec}=T_{\\rm rec}/T_0-1$.', 'Trec/T0-1', 'dimensionless', ['dimensionless', 'K', 'eV', 'Gyr'], 0.02, '$1+z=a_0/a=T/T_0$.'),
        S('lrec', 'Peak wavelength of the radiation at recombination in nm.', 'b/Trec*1e9', 'nm', ['nm', 'mm', 'm', 'µm'], 0.02, 'Wien: $\\lambda_{\\max}=b/T$. Near-infrared.'),
        S('l0', 'Peak wavelength today in mm. (It is stretched by $1+z$.)', 'b/T0*1e3', 'mm', ['mm', 'nm', 'µm', 'm'], 0.02, 'Same Wien law at $T_0$, equal to $\\lambda_{\\rm rec}(1+z)$.'),
      ],
      xp: 30,
    },
    {
      type: 'calc', id: 'c2', title: 'Growing a quasar: the Salpeter time', fight: 'normal',
      problem: 'A black hole accretes at the Eddington rate with radiative efficiency $\\eta=0.1$: $L=\\eta\\dot M_{\\rm acc}c^2$, $\\dot M_{BH}=(1-\\eta)\\dot M_{\\rm acc}$, $L_{\\rm Edd}=4\\pi GM_{BH}m_pc/\\sigma_T$. Then $M_{BH}(t)=M_{BH}(0)e^{t/t_S}$ with $t_S=\\frac{\\eta}{1-\\eta}\\frac{c\\sigma_T}{4\\pi Gm_p}$.',
      vars: { ...pick('G', 'c', 'mp', 'sigT', 'yr'), eta: 0.1, ratio: 1e8 },
      steps: [
        S('tS', 'Salpeter time in units of $10^7$ yr.', 'eta/(1-eta)*c*sigT/(4*pi*G*mp)/yr/1e7', '10^7 yr', ['10^7 yr', 's', '10^9 yr', 'Gyr^-1'], 0.02, 'Insert $G,\\,m_p,\\,\\sigma_T,\\,c$ in SI. The result is $5.0\\times10^7$ yr.'),
        S('tdbl', 'Doubling time $t_S\\ln2$ in $10^7$ yr.', 'tS*log(2)', '10^7 yr', ['10^7 yr', 's', '10^9 yr', 'Gyr^-1'], 0.02, '$2=e^{t/t_S}\\Rightarrow t=t_S\\ln2\\approx3.5\\times10^7$ yr.'),
        S('tgrow', 'Time to grow by a factor $10^8$ (a $10\\,M_\\odot$ seed to $10^9\\,M_\\odot$) in Gyr.', 'tS*log(ratio)*1e7/1e9', 'Gyr', ['Gyr', '10^7 yr', 'Myr', 's'], 0.03, '$t=t_S\\ln(10^8)=18.4\\,t_S\\approx0.9$ Gyr. This is why $z>7$ quasars are a puzzle.'),
      ],
      xp: 50,
    },
    {
      type: 'calc', id: 'c3', title: 'Friedmann universe with equation of state $w$', fight: 'normal',
      problem: 'Flat universe with $\\rho\\propto a^{-3(1+w)}$: $\\dot a/a=\\sqrt{8\\pi G\\rho/3}$ gives $a\\propto t^{\\alpha}$ with $\\alpha=\\frac{2}{3(1+w)}$. Then $H=\\dot a/a=\\alpha/t$, so the age is $t_0=\\alpha/H_0$. Take $H_0=70$ km/s/Mpc, $1/H_0=13.97$ Gyr.',
      vars: { H0inv: 977.8 / 70, w1: 0, w2: 0.5 },
      steps: [
        S('a0', 'Exponent $\\alpha$ for non-relativistic matter ($w=0$).', '2/(3*(1+w1))', 'dimensionless', ['dimensionless', 'Gyr', 'km/s/Mpc', 'K'], 0.01, '$\\rho\\propto a^{-3}$: $a\\propto t^{2/3}$.'),
        S('age', 'Age of a flat matter-only universe $t_0=\\alpha/H_0$ in Gyr.', 'a0*H0inv', 'Gyr', ['Gyr', 'Myr', 'km/s/Mpc', 'dimensionless'], 0.02, '$t_0=\\frac23\\cdot13.97\\,\\text{Gyr}\\approx9.3$ Gyr (younger than the oldest stars: one reason for $\\Lambda$).'),
        S('a2', 'Exponent for a fluid with $w=0.5$.', '2/(3*(1+w2))', 'dimensionless', ['dimensionless', 'Gyr', 'km/s/Mpc', 'K'], 0.01, '$\\alpha=2/(3\\times1.5)=0.444$.'),
      ],
      xp: 40,
    },
    {
      type: 'calc', id: 'c4', title: 'Quick fire: Hubble law and the 21 cm line', fight: 'fermi',
      problem: 'A galaxy at redshift $z=0.024$, $H_0=72$ km/s/Mpc, and $v\\approx cz$. Separately, the $21$ cm line (rest frequency $1420.4$ MHz) is received at $700$ MHz. Estimate each within about 25 %.',
      vars: { z: 0.024, H0: 72, cc: 299792.458, nu0: 1420.4, nuo: 700 },
      steps: [
        S('d', 'Distance $d=cz/H_0$ in Mpc.', 'cc*z/H0', 'Mpc', ['Mpc', 'kpc', 'Gpc', 'km/s'], 0.1, '$cz=7195$ km/s, divide by $72$ km/s/Mpc.', { tolType: 'log' }),
        S('zline', 'Redshift of emission of the 21 cm line seen at 700 MHz: $1+z=\\nu_{\\rm em}/\\nu_{\\rm obs}$.', 'nu0/nuo-1', 'dimensionless', ['dimensionless', 'Mpc', 'MHz', 'km/s'], 0.1, 'Frequencies scale inversely to wavelengths: $1+z=\\lambda_{\\rm obs}/\\lambda_{\\rm em}=\\nu_{\\rm em}/\\nu_{\\rm obs}\\approx2$.', { tolType: 'log' }),
      ],
      xp: 20,
    },
    {
      type: 'boss', id: 'b1', title: 'Boss: the radiation-dominated universe (exam problem)',
      source: src(EX.w25, 'Open Question 7 [Radiation era and BBN, 12 pt], HS25 winter session'),
      minutes: 20,
      instructions: 'Solve on paper under the timer, then enter the final numbers. Parts (a) and (b) are graded by you against the key points.',
      statement: [
        'The early universe was hot, dense and dominated by radiation. Consider a spatially flat ($k=0$) universe containing only radiation.',
        '(a) [4 pt] The energy density of radiation scales as $\\rho\\propto a^{-4}$. Starting from the Friedmann equation $(\\dot a/a)^2=\\frac{8\\pi G}{3}\\rho$, show that $a(t)\\propto t^{1/2}$. Assume $a(0)=0$ at $t=0$.',
        '(b) [4 pt] The energy density of blackbody radiation is related to the temperature by $\\rho\\propto T^4$. Using (a), show that $T(t)\\propto t^{-1/2}$.',
        '(c) [4 pt] Big Bang Nucleosynthesis took place when the universe had cooled to $T_{BBN}\\approx10^9$ K. Assuming radiation domination throughout, and given $T\\approx1.5\\times10^{10}$ K at $t=1$ s, estimate the age $t_{BBN}$.',
      ],
      finalAnswers: [
        { id: 'tbbn', prompt: 'Part (c): $t_{BBN}$ in seconds.', answer: '(T1/Tb)^2', vars: { T1: 1.5e10, Tb: 1e9 }, tol: 0.02 },
        { id: 'tmin', prompt: 'Extension: age in minutes when $T=3\\times10^8$ K.', answer: '(T1/Tn)^2/60', vars: { T1: 1.5e10, Tn: 3e8 }, tol: 0.02 },
      ],
      keyPoints: [
        '(a) $\\rho=\\rho_0(a_0/a)^4\\Rightarrow\\dot a/a=C/a^2\\Rightarrow a\\,\\dot a=C\\Rightarrow a\\,da=C\\,dt\\Rightarrow a^2=2Ct$ with $a(0)=0$; so $a\\propto t^{1/2}$.',
        '(b) $T^4\\propto\\rho\\propto a^{-4}\\Rightarrow T\\propto a^{-1}\\propto t^{-1/2}$.',
        '(c) $T_{BBN}/T_{1s}=(t_{BBN}/1\\,\\text{s})^{-1/2}\\Rightarrow t_{BBN}=1\\,\\text{s}\\cdot(1.5\\times10^{10}/10^9)^2=225$ s, about 4 minutes.',
      ],
      xp: 120,
    },
  ],
};

export default rooms;
