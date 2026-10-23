// Dynamics Bay additions: Galactic structure and rotation (Choudhuri 6.1-6.4), stellar dynamics (Ch. 7).
import { t, pick, S, exam, choud, P, EQ, INT, PIT, FIG, EXQ, MC } from '../lib.mjs';

const lessons = [
  {
    type: 'lesson', id: 'L1', title: 'Anatomy of the Milky Way', tier: 'intuition', minutes: 10, xp: 15,
    source: [choud('§6.1 (shape and size), §6.4 (stellar populations)'), exam('w25', 'MC 8'), exam('s24', 'MC 7'), exam('p25', 'MC 8')],
    blocks: [
      FIG(t`Edge-on, the Galaxy is a thin <b>disk</b> (radius ~15 kpc, thickness a few hundred pc, gas, dust, young stars, spiral arms) around a central <b>bulge</b> (a few kpc, old stars, a bar, and a $4\times10^6M_\odot$ black hole, Sgr A*), embedded in a nearly spherical <b>stellar halo</b> (globular clusters, old metal-poor stars) and a much larger <b>dark-matter halo</b>. The Sun sits in the disk about 8 kpc from the centre, moving at ~220 km/s, one orbit per ~230 Myr.`),
      P(t`<b>Population I:</b> young, metal-rich stars in the disk, formed from gas enriched by earlier generations. <b>Population II:</b> old, metal-poor stars in the halo and bulge (and globular clusters), formed early before the gas was enriched.`),
      P(t`<b>Dynamical support:</b> the disk is supported by <b>rotation</b> (stars on nearly circular orbits, small random velocities); the bulge and halo are supported by <b>random motions</b> (like a hot gas: velocity dispersion balances gravity via the virial theorem).`),
      INT(t`Metallicity is a clock: each generation of stars returns heavy elements to the ISM, so later stars are born metal-richer. Shapley (1918) located the centre of the Galaxy by noting that globular clusters (halo objects) are concentrated towards Sagittarius: the Sun is not at the centre.`),
      PIT(t`Population numbering is "historical": Pop I = young and metal-rich (disk), Pop II = old and metal-poor (halo/bulge). Exams ask exactly this in MC every year.`),
    ],
    check: [
      MC(t`Population II stars are`, ['young, metal-rich, in the disk', 'old, metal-poor, in the halo and bulge', 'forming now in molecular clouds', 'exclusively white dwarfs'], 1, 'Formed before the gas was enriched.', exam('w25', 'MC 8')),
      MC(t`The Milky Way components are supported against collapse by`, ['disk and bulge random motions, halo rotation', 'halo and disk rotation, bulge random motions', 'halo and bulge random motions, disk rotation', 'halo and bulge rotation, disk random motions'], 2, 'Only the disk rotates coherently.', exam('p25', 'MC 8')),
    ],
  },
  {
    type: 'lesson', id: 'L2', title: 'Galactic rotation and the case for dark matter', tier: 'theory', minutes: 12, xp: 20,
    source: [choud('§6.2 (Oort constants 6.19-6.24), §9.2.2 (rotation curves)'), exam('w25', 'MC 12'), exam('s24', 'MC 13'), exam('p25', 'open Q6'), exam('w24', 'open Q4')],
    blocks: [
      EQ(t`\frac{v_c^2}{r}=\frac{GM_r}{r^2}\quad\Rightarrow\quad v_c(r)=\sqrt{\frac{GM_r}{r}}`, 'Circular velocity from the enclosed mass (spherical approximation).'),
      P(t`If all the mass were the visible stars, concentrated in the inner few kpc, $v_c$ would fall as $r^{-1/2}$ (Keplerian) outside. 21 cm observations show <b>flat rotation curves</b> far beyond the visible disk: $v_c\approx$ const, so $M_r\propto r$ and $\rho\propto r^{-2}$. Most of the mass is dark.`),
      EQ(t`v_c=\text{const}\ \Rightarrow\ M_r=\frac{v_c^2r}{G},\quad\rho=\frac{v_c^2}{4\pi Gr^2},\qquad v_{esc}^2(r)=2v_c^2\left(1+\ln\frac Rr\right)`, 'Flat rotation curve, its density, and the escape speed for a halo truncated at R (HS25 practice Q6).'),
      P(t`Near the Sun, differential rotation shows up in the radial and tangential velocities of nearby stars: $v_R=Ad\sin2l$, $v_T=Ad\cos2l+Bd$ with the <b>Oort constants</b> $A=14.8$, $B=-12.4$ km s$^{-1}$kpc$^{-1}$; $v_c(R_0)=(A-B)R_0$.`),
      INT(t`A flat rotation curve is the signature of a singular isothermal sphere (next lesson): a halo whose "particles" (dark matter) have the same velocity dispersion everywhere. The extra mass keeps the outer stars on fast orbits that visible matter alone could not hold.`),
      PIT(t`Keep $M_r\propto r$ (flat curve) and $\rho\propto r^{-2}$ apart: MC asks both (HS25 winter MC12: $M_r\propto r$; HS24 summer MC13: $\rho\propto r^{-2}$). With a central black hole plus an $r^{-2}$ halo, $M_r=kr+M_0$ and $v^2=G(k+M_0/r)$ (HS24 winter Q4).`),
    ],
    check: [
      MC(t`A flat rotation curve implies the enclosed mass scales as`, ['constant', t`$\sqrt r$`, t`$r$`, t`$r^2$`], 2, t`$M_r=v_c^2r/G$.`, exam('w25', 'MC 12')),
      MC(t`In the flat part of the rotation curve the density scales as`, [t`$r^2$`, t`$r$`, t`$r^{-1}$`, t`$r^{-2}$`], 3, t`$4\pi r^2\rho=dM/dr=$ const.`, exam('s24', 'MC 13')),
    ],
  },
  {
    type: 'lesson', id: 'L3', title: 'Why galaxies are collisionless: relaxation times', tier: 'theory', minutes: 12, xp: 20,
    source: [choud('§7.3, eqs. (7.10)-(7.14), Table 7.1; violent relaxation; dynamical friction §7.4'), exam('w25', 'MC 9'), exam('p25', 'MC 11'), exam('s24', 'MC 9'), exam('w24', 'MC 11')],
    blocks: [
      P(t`A "collision" between stars is an encounter that changes a star's velocity by order itself. That needs an impact parameter $b\approx Gm/v^2$ (7.10). The time between such encounters:`),
      EQ(t`T_{\rm rel}\approx\frac{1}{\pi b^2vn}=\frac{v^3}{\pi nG^2m^2}\approx10^{10}\,\mathrm{yr}\;\frac{(v/\mathrm{km\,s^{-1}})^3}{n/\mathrm{pc^{-3}}}`, 'Collisional relaxation time (7.11)-(7.12), m = M_sun.'),
      EQ(t`\frac{T_{\rm rel}}{T_{\rm cross}}\approx N\quad(\text{virialised},\ T_{\rm cross}=R/v)`, '(7.14). Binney & Tremaine refine this to N/(8 ln N).'),
      P(t`Galaxy: $v\approx100$ km/s, $n\approx0.1$ pc$^{-3}$ gives $T_{\rm rel}\sim10^{17}$ yr: collisions are irrelevant; stars move in the smooth mean potential (collisionless). Globular clusters ($v\approx10$, $n\approx10^3$): $10^{10}$ yr, partially relaxed. Yet galaxies look relaxed: during formation the potential changes violently and stars exchange energy with the changing field (<b>violent relaxation</b>, Lynden-Bell 1967) within a few crossing times: $T_{\rm rel}\gg T_{VR}\gtrsim T_{\rm cross}$.`),
      P(t`<b>Dynamical friction:</b> a massive body moving through a sea of stars pulls them towards itself; by the time they gather it has moved on, leaving an overdense wake <b>behind</b> it, whose gravity slows it down. This makes satellite galaxies and globular clusters spiral inwards.`),
      INT(t`Self-gravitating systems never reach true thermodynamic equilibrium: a Maxwell–Boltzmann distribution in a self-consistent potential needs $\rho\propto r^{-2}$ at large $r$, i.e. infinite mass (Choudhuri §7.4). They relax by other (collective) processes to states that are not thermal equilibrium (HS24 winter MC11).`),
    ],
    check: [
      MC(t`Galaxies are called collisionless because`, ['stars are large compared with their separations', 'the time for encounters to change velocities is much longer than the age of the Universe', 'dark matter suppresses random motions', 'stars all move on circular orbits'], 1, t`$T_{\rm rel}\sim10^{15-17}$ yr.`, exam('w25', 'MC 9')),
      MC(t`Ordering of timescales for galaxies and globular clusters:`, [t`$T_{\rm rel}\simeq T_{VR}\simeq T_{\rm cross}$`, t`$T_{\rm rel}\simeq T_{VR}\gg T_{\rm cross}$`, t`$T_{\rm cross}\gg T_{\rm rel}\simeq T_{VR}$`, t`$T_{\rm rel}\gg T_{VR}\gtrsim T_{\rm cross}$`], 3, 'Violent relaxation works in a few crossing times.', exam('p25', 'MC 11')),
      MC(t`Dynamical friction on a massive body is directed`, ['backwards, from the enhanced density in its wake', 'forwards, from the enhanced density in its wake', 'backwards, from a deficit in its wake', 'forwards, from a deficit in its wake'], 0, 'The wake pulls it back.', exam('s24', 'MC 9')),
    ],
  },
  {
    type: 'lesson', id: 'L4', title: 'Distribution functions, Jeans equations and the isothermal sphere', tier: 'theory', minutes: 15, xp: 20,
    source: [choud('§7.5 (collisionless Boltzmann 7.21-7.25), §7.6 (Jeans equations 7.26-7.34)'), exam('w25', 'open Q4'), exam('p25', 'MC 12')],
    blocks: [
      P(t`A collisionless system is described by a distribution function $f(\mathbf x,\mathbf v,t)$ (stars per $d^3x\,d^3v$). Stars are conserved and move smoothly in phase space, so $f$ is constant along orbits: the <b>collisionless Boltzmann</b> (Vlasov) equation`),
      EQ(t`\frac{\partial f}{\partial t}+\mathbf v\cdot\nabla_{\mathbf x}f-\nabla\Phi\cdot\nabla_{\mathbf v}f=0,\qquad\rho=m\int f\,d^3v,\qquad\nabla^2\Phi=4\pi G\rho`),
      P(t`<b>Jeans theorem:</b> any function of the integrals of motion (energy $\mathcal E=\frac12v^2+\Phi$, angular momentum) solves it in a steady state. Choose $f(\mathcal E)$ and you have a model: e.g. $f\propto(-\mathcal E)^{7/2}$ gives the Plummer sphere $\rho\propto(-\Phi)^5$ (boss of this room).`),
      P(t`Taking velocity moments gives the <b>Jeans equations</b>, the stellar analogue of hydrostatic equilibrium with "pressure" $\rho\sigma^2$. Spherical, isotropic: $\frac{d(\rho\sigma^2)}{dr}=-\rho\frac{GM_r}{r^2}$. With $\sigma$ constant (isothermal) a solution is the <b>singular isothermal sphere</b>:`),
      EQ(t`\rho(r)=\frac{\sigma^2}{2\pi Gr^2},\qquad v_c^2=2\sigma^2=\text{const}`, 'Flat rotation curve; ⟨v²⟩ = 3σ² is independent of r (HS25 practice MC12).'),
      INT(t`The isothermal sphere is literally an isothermal self-gravitating gas: "temperature" = velocity dispersion. It explains flat rotation curves with one number $\sigma$, but its mass diverges ($M_r\propto r$), so real halos must be truncated (HS25 practice Q6) or steepen (NFW profiles).`),
    ],
    check: [
      MC(t`The singular isothermal sphere ($\rho\propto r^{-2}$) has a mean square velocity`, ['independent of r', 'proportional to r', t`$\propto1/r$`, t`$\propto1/r^2$`], 0, 'Hence "isothermal".', exam('p25', 'MC 12')),
    ],
  },
];

const quiz = {
  type: 'quiz', id: 'Q1', title: 'Dynamics Bay multiple choice', xp: 35, passMark: 0.75,
  source: [exam('w25', 'MC'), exam('s24', 'MC'), exam('w24', 'MC'), exam('p25', 'MC')],
  questions: [
    MC(t`Relative to disk stars, halo and bulge stars are predominantly`, ['younger Pop I, more metals', 'older Pop I, fewer metals', 'younger Pop II, fewer metals', 'older Pop II, fewer metals'], 3, 'Formed before enrichment.', exam('s24', 'MC 7')),
    MC(t`Galaxies ($N\sim10^{11}$) are collisionless because`, ['close encounters are frequent', 'encounters need far longer than the age of the Universe to change velocities', 'dark matter suppresses motions', 'orbits are circular'], 1, 'Relaxation time ~10¹⁵⁻¹⁷ yr.', exam('w25', 'MC 9')),
    MC(t`For a virialised cluster of N stars of mass m and radius ⟨R⟩, ⟨v²⟩ is proportional to`, [t`$Nm/\langle R\rangle$`, t`$N\langle R\rangle/m$`, t`$m/(N\langle R\rangle)$`, t`$m/\langle R\rangle^2$`], 0, t`$\langle v^2\rangle=GNm/(2\langle R\rangle)$.`, exam('w25', 'MC 10')),
    MC(t`Self-gravitating stellar systems relax`, ['via collisions to thermal equilibrium', 'via collisions, not to thermal equilibrium', 'via other processes to thermal equilibrium', 'via other processes, not to thermal equilibrium'], 3, 'Violent relaxation; no true equilibrium.', exam('w24', 'MC 11')),
    MC(t`Flat rotation curve: the enclosed mass scales as`, ['const', t`$\sqrt r$`, t`$r$`, t`$r^2$`], 2, t`$M_r=v_c^2r/G$.`, exam('w25', 'MC 12')),
    MC(t`Flat rotation curve: density scales as`, [t`$r^2$`, t`$r$`, t`$r^{-1}$`, t`$r^{-2}$`], 3, 'Isothermal sphere.', exam('s24', 'MC 13')),
    MC(t`Dynamical friction force is`, ['backwards, overdense wake', 'forwards, overdense wake', 'backwards, underdense wake', 'forwards, underdense wake'], 0, 'Wake pulls back.', exam('s24', 'MC 9')),
    MC(t`Milky Way support:`, ['disk+bulge random, halo rotation', 'halo+disk rotation, bulge random', 'halo+bulge random, disk rotation', 'halo+bulge rotation, disk random'], 2, 'Only the disk rotates.', exam('p25', 'MC 8')),
    MC(t`Timescale ordering:`, [t`$T_{rel}\simeq T_{VR}\simeq T_{cr}$`, t`$T_{rel}\simeq T_{VR}\gg T_{cr}$`, t`$T_{cr}\gg T_{rel}\simeq T_{VR}$`, t`$T_{rel}\gg T_{VR}\gtrsim T_{cr}$`], 3, 'Violent relaxation is fast.', exam('p25', 'MC 11')),
    MC(t`Singular isothermal sphere: ⟨v²⟩ is`, ['independent of r', t`$\propto r$`, t`$\propto1/r$`, t`$\propto1/r^2$`], 0, 'Isothermal.', exam('p25', 'MC 12')),
  ],
};

const derivations = [
  {
    type: 'derive', id: 'D1', title: 'Escape velocity from a truncated flat-rotation-curve halo', xp: 35,
    source: exam('p25', 'open Q6(a)-(b) [9 pt]'),
    goal: t`For $\rho\propto r^{-2}$ out to a cut-off radius $R$ (zero beyond), show that $v_{esc}^2=2v_c^2\left(1+\ln\frac Rr\right)$ for $r<R$.`,
    given: [t`$\frac12mv_{esc}^2=-\int_\infty^r\frac{GM_{r'}m}{r'^2}dr'$`],
    steps: [
      { prompt: 'Enclosed mass.', reveal: t`$M_r=M\,r/R$ for $r<R$, $M_r=M$ for $r\ge R$ ($M$ = total mass).` },
      { prompt: 'Split the integral at R.', reveal: t`$\frac12v_{esc}^2=\int_r^R\frac{GM}{Rr'}dr'+\int_R^\infty\frac{GM}{r'^2}dr'=\frac{GM}{R}\ln\frac Rr+\frac{GM}{R}$.` },
      { prompt: 'Use v_c.', reveal: t`$v_c^2=GM_r/r=GM/R$ is constant, so $v_{esc}^2=2v_c^2\left(1+\ln\frac Rr\right)$.` },
    ],
    keyPoints: ['$M_r$ piecewise', 'integral split at $R$', '$GM/R=v_c^2$', 'final form'],
  },
  {
    type: 'derive', id: 'D2', title: 'Singular isothermal sphere from the Jeans equation', xp: 30,
    source: choud('§7.6 (spherical isotropic Jeans equation) and HS25 practice MC12'),
    goal: t`With $\frac{d(\rho\sigma^2)}{dr}=-\rho\frac{GM_r}{r^2}$ and constant $\sigma$, show that $\rho=\frac{\sigma^2}{2\pi Gr^2}$ is a solution and that $v_c^2=2\sigma^2$.`,
    given: [t`$M_r=4\pi\int_0^r\rho r'^2dr'$`],
    steps: [
      { prompt: 'Try ρ = A/r².', reveal: t`$M_r=4\pi Ar$. Left side: $\sigma^2\frac{d}{dr}\frac{A}{r^2}=-\frac{2\sigma^2A}{r^3}$. Right side: $-\frac{A}{r^2}\frac{G4\pi Ar}{r^2}=-\frac{4\pi GA^2}{r^3}$.` },
      { prompt: 'Solve for A.', reveal: t`$2\sigma^2=4\pi GA\Rightarrow A=\frac{\sigma^2}{2\pi G}$.` },
      { prompt: 'Circular velocity.', reveal: t`$v_c^2=GM_r/r=4\pi GA=2\sigma^2$: flat.` },
    ],
    keyPoints: ['power-law ansatz', 'match both sides', '$v_c^2=2\\sigma^2$'],
  },
];

const calcs = [
  {
    type: 'calc', id: 'c4', title: 'Oort constants: the Sun\'s orbit', fight: 'normal', xp: 25,
    problem: t`Choudhuri (6.23)-(6.24): $A=14.8$, $B=-12.4$ km s$^{-1}$ kpc$^{-1}$. Take $R_0=8$ kpc and $1$ kpc $=3.0857\times10^{16}$ km.`,
    vars: { A: 14.8, B: -12.4, R0: 8, kpckm: 3.085677581e16, yr: 3.15576e7 },
    steps: [
      S('v0', t`Circular speed of the Sun $v_c=(A-B)R_0$ in km/s.`, '(A-B)*R0', 'km/s', ['km/s', 'km/s/kpc', 'kpc', 'Myr'], 0.02, t`$(14.8+12.4)\times8$.`),
      S('P', t`Orbital period $2\pi R_0/v_c$ in Myr.`, '2*pi*R0*kpckm/v0/yr/1e6', 'Myr', ['Myr', 'Gyr', 'yr', 's'], 0.02, t`Convert kpc to km; about 230 Myr: the Sun has orbited ~20 times.`),
      S('slope', t`Local slope $dv_c/dR=-(A+B)$ in km/s/kpc.`, '-(A+B)', 'km/s/kpc', ['km/s/kpc', 'km/s', 'kpc', 'Myr^-1'], 0.05, t`From (6.21)-(6.22), $A+B=-dv_c/dR$. $-2.4$: almost flat.`),
    ],
  },
  {
    type: 'calc', id: 'c5', title: 'Escape speed and the size of the halo', fight: 'normal', xp: 35,
    problem: t`HS25 practice Q6(c): the fastest star in the solar neighbourhood ($r=8$ kpc) moves at 440 km/s and is assumed bound. $v_c=230$ km/s. Use $v_{esc}^2=2v_c^2(1+\ln(R/r))$.`,
    vars: { ...pick('G', 'Msun', 'pc'), r: 8, vmax: 440, vc: 230 },
    steps: [
      S('R', t`Lower limit on the cut-off radius $R$ in kpc.`, 'r*exp(vmax^2/(2*vc^2)-1)', 'kpc', ['kpc', 'pc', 'Mpc', 'km/s'], 0.02, t`$R/r=\exp(v^2/2v_c^2-1)=e^{0.83}$.`),
      S('M8', t`Mass within 8 kpc, $v_c^2r/G$, in $10^{10}M_\odot$.`, '(vc*1e3)^2*r*1e3*pc/G/Msun/1e10', '10^10 M_sun', ['10^10 M_sun', 'kg', 'M_sun/pc', 'kpc'], 0.02, t`$\approx9.8\times10^{10}M_\odot$.`),
      S('Mtot', t`Lower limit on the total mass $M=M_8\,R/r$ in $10^{10}M_\odot$.`, 'M8*R/r', '10^10 M_sun', ['10^10 M_sun', 'kg', 'M_sun/pc', 'kpc'], 0.02, t`$9.8\times10^{10}\times18.3/8\approx2.2\times10^{11}M_\odot$. <b>Note:</b> the official key prints $9.8\times10^{11}M_\odot$, which does not follow from its own expression $9.8\times10^{10}\times(18/8)$; the correct value is $2.2\times10^{11}M_\odot$.`),
    ],
  },
  {
    type: 'calc', id: 'c6', title: 'Relaxation times: galaxy vs globular cluster', fight: 'normal', xp: 30,
    problem: t`Use $T_{\rm rel}\approx v^3/(\pi nG^2m^2)$ with $m=M_\odot$ (Choudhuri (7.11)).`,
    vars: { ...pick('G', 'Msun', 'pc', 'yr'), v1: 100, n1: 0.1, v2: 10, n2: 1e3, N: 1e5 },
    steps: [
      S('T1', t`Galaxy: $v=100$ km/s, $n=0.1$ pc$^{-3}$. $T_{\rm rel}$ in years (enter e.g. 2e17).`, '(v1*1e3)^3/(pi*n1/pc^3*G^2*Msun^2)/yr', 'yr', ['yr', 's', 'Gyr', 'Myr'], 0.03, t`Convert $n$ to m$^{-3}$ ($1\,\mathrm{pc}^3=2.94\times10^{49}$ m$^3$).`),
      S('T2', t`Globular cluster: $v=10$ km/s, $n=10^3$ pc$^{-3}$. $T_{\rm rel}$ in Gyr.`, '(v2*1e3)^3/(pi*n2/pc^3*G^2*Msun^2)/yr/1e9', 'Gyr', ['Gyr', 'yr', 's', 'Myr'], 0.03, t`Of order the age: partially relaxed (mass segregation, core collapse happen).`),
    ],
  },
];

const boss = {
  type: 'boss', id: 'b2', title: 'Boss: a black hole inside an r⁻² halo (exam problem)', xp: 120, minutes: 20,
  source: exam('w24', 'Open Question 4 [12 pt]'),
  instructions: 'Solve on paper under the timer, then enter the final number for (c). Parts (a)-(b) are graded by you against the key points.',
  statement: [
    t`Let us build a simple model of a spherically symmetric galaxy. Assume that a point mass (a black hole) of mass $M_0=4\times10^6M_\odot$ is located at the centre of the galaxy ($r=0$) and that the remainder of the mass has a density profile that decays as $r^{-2}$, where $r$ is the radial distance from the galaxy centre.`,
    t`(a) [4 pt] Show that the enclosed mass within a spherical region of radius $r$ can be expressed as $M_r=kr+M_0$, where $k$ is a constant to be determined later.`,
    t`(b) [4 pt] Assuming circular motion and Newtonian gravity, show that the orbital velocity of a star at radius $r$ is $v=\left[G\left(k+\frac{M_0}{r}\right)\right]^{1/2}$.`,
    t`(c) [4 pt] If the orbital velocity is 110 km s$^{-1}$ at 2 pc, determine the value of $k$ in units of $M_\odot$ pc$^{-1}$.`,
  ],
  finalAnswers: [
    { id: 'k', prompt: t`(c): $k$ in units of $10^5M_\odot$/pc.`, answer: '((v*1e3)**2/G*pc/Msun - M0/r)/1e5', vars: { ...pick('G', 'Msun', 'pc'), v: 110, r: 2, M0: 4e6 }, tol: 0.03 },
  ],
  keyPoints: [
    t`(a) $M_r=M_0+4\pi\int_0^r\rho_s r'^2dr'$ with $\rho_s\propto r'^{-2}$ gives $M_r=M_0+kr$.`,
    t`(b) $v^2/r=GM_r/r^2\Rightarrow v=\sqrt{G(kr+M_0)/r}=\sqrt{G(k+M_0/r)}$.`,
    t`(c) $k=v^2/G-M_0/r=1.81\times10^{20}$ kg/m $-2\times10^6M_\odot$/pc $=(2.82-2)\times10^6=8.2\times10^5M_\odot$/pc.`,
  ],
};

export const extend = { 'galactic-dynamics': [...lessons, quiz, ...derivations, ...calcs, boss] };
export const sources = { 'galactic-dynamics': [exam('w24', 'open Q4, MC 11'), exam('p25', 'open Q6, MC 8, 11, 12'), exam('s24', 'MC 7, 9'), choud('Ch. 6.2-6.4 (rotation, Oort constants, populations), Ch. 7.2-7.6 (relaxation, collisionless Boltzmann, Jeans equations)')] };
export const codex = [
  { id: 'vc', group: 'Galaxies and dynamics', title: 'Circular velocity', tex: t`v_c^2=\frac{GM_r}{r}`, meaning: 'Flat curve: M ∝ r, ρ ∝ r^{-2}.', source: 'HS25 winter MC12' },
  { id: 'oort', group: 'Galaxies and dynamics', title: 'Oort constants', tex: t`v_R=Ad\sin2l,\ v_T=Ad\cos2l+Bd,\ v_c(R_0)=(A-B)R_0`, meaning: 'A = 14.8, B = −12.4 km/s/kpc.', source: 'Choudhuri (6.19)-(6.24)' },
  { id: 'vesc', group: 'Galaxies and dynamics', title: 'Escape velocity, truncated flat halo', tex: t`v_{esc}^2=2v_c^2(1+\ln(R/r))`, meaning: 'Bound fastest star gives a lower limit on the halo size.', source: 'HS25 practice Q6' },
  { id: 'trel', group: 'Galaxies and dynamics', title: 'Relaxation time', tex: t`T_{\rm rel}\approx\frac{v^3}{\pi nG^2m^2}\approx10^{10}\,\mathrm{yr}\frac{v_{\rm km/s}^3}{n_{\rm pc^{-3}}},\ \frac{T_{\rm rel}}{T_{\rm cross}}\approx N`, meaning: 'Galaxies: 10^17 yr (collisionless).', source: 'Choudhuri (7.11)-(7.14)' },
  { id: 'cbe', group: 'Galaxies and dynamics', title: 'Collisionless Boltzmann', tex: t`\partial_tf+\mathbf v\cdot\nabla f-\nabla\Phi\cdot\partial_{\mathbf v}f=0,\ \rho=m\int f\,d^3v`, meaning: 'Jeans theorem: f(E, L) is a steady solution.', source: 'Choudhuri (7.25)' },
  { id: 'sis', group: 'Galaxies and dynamics', title: 'Singular isothermal sphere', tex: t`\rho=\frac{\sigma^2}{2\pi Gr^2},\ v_c^2=2\sigma^2`, meaning: 'Flat rotation curve; ⟨v²⟩ independent of r.', source: 'HS25 practice MC12' },
  { id: 'plummer', group: 'Galaxies and dynamics', title: 'Plummer sphere', tex: t`\Phi=-\frac{GM}{\sqrt{r^2+a^2}},\ \rho=\frac{3M}{4\pi a^3}\left(1+\frac{r^2}{a^2}\right)^{-5/2}`, meaning: 'From f ∝ (−E)^{7/2}.', source: 'HS25 winter Q4' },
  { id: 'tidal', group: 'Galaxies and dynamics', title: 'Tidal disruption', tex: t`a_{\rm tid}\simeq\frac{2GMr}{d^3},\ d_{\rm lim}=\left(\frac{2M}{m}\right)^{1/3}r`, meaning: 'Satellite torn apart inside d_lim.', source: 'HS24 summer Q6' },
  { id: 'vir2', group: 'Galaxies and dynamics', title: 'Virial velocity dispersion', tex: t`\sigma_v^2=\frac{GM}{2r_H},\ \langle v^2\rangle=\frac{GM}{2\langle R\rangle}`, meaning: 'Weighing clusters and galaxies.', source: 'HS24 summer Q5, HS25 practice Q5' },
];
