// New room: The Examination Hall. Complete multiple-choice parts of the four Refregier exams (15 x 3 pt each, in exam
// order) and the open questions that are not bosses elsewhere. For full mock exams: 45 min MC + the open questions.
import { t, pick, exam, P, MC } from '../lib.mjs';

const mcExam = (k, id, title, qs) => ({
  type: 'quiz', id, title, xp: 60, passMark: 0.6, source: [exam(k, 'Multiple Choice, questions 1-15 (45 pt)')],
  questions: qs.map((q, i) => ({ ...q, source: exam(k, `MC ${i + 1}`) })),
});

const w25 = mcExam('w25', 'MC-W25', 'Mock exam: HS25 winter (4 Feb 2026), multiple choice', [
  MC(t`Two stars have $m_1=9.0$ and $m_2=13.0$. $F_1/F_2\approx$`, ['5', '15', '20', '40'], 3, t`$10^{0.4\cdot4}=39.8$.`),
  MC(t`Barnard's Star has a parallax of 547 mas. How far away is it?`, ['1.8 pc', '18 pc', '180 pc', '1800 pc'], 0, t`$d=1/p$.`),
  MC(t`In empty space, $I_\nu$ along a ray remains constant because`, ['the radiation energy density is conserved along the ray', 'both the received flux and the solid angle of the source decrease as the inverse square of distance', 'the radiation field is isotropic in empty space', 'the flux is zero averaged over all directions'], 1, 'Surface brightness is conserved.'),
  MC(t`According to Stefan–Boltzmann, the energy density $U$ of blackbody radiation scales as`, [t`$T$`, t`$T^2$`, t`$T^{-1}$`, t`$T^4$`], 3, t`$U=a_BT^4$.`),
  MC(t`Two main-sequence stars differ in mass by a factor 4. How much longer does the lower-mass star live?`, ['4', '8', '16', '64'], 2, t`$\tau\propto M^{-2}$.`),
  MC(t`The upper mass limit of main-sequence stars is due to`, ['small optical depth in the interior', 'depletion of hydrogen in the core', 'cosmic rays', 'outward radiation pressure overcoming gravity'], 3, 'Eddington limit.'),
  MC(t`The physical origin of the 21 cm line is`, ['recombination in ionised hydrogen', 'rotational transitions of CO', 'hyperfine splitting of the ground state of neutral hydrogen', 'synchrotron radiation of cosmic rays'], 2, 'Spin flip.'),
  MC(t`Population II stars are`, ['young, metal-rich, in the disk', 'old, metal-poor, in the halo and bulge', 'forming in molecular clouds in spiral arms', 'exclusively white dwarfs'], 1, 'Formed before enrichment.'),
  MC(t`Galaxies ($N\approx10^{11}$) are collisionless because`, ['stellar radii are large compared with separations', 'the time for encounters to change velocities is much longer than the age of the Universe', 'the dark-matter halo suppresses random motions', 'stars have coherent circular velocities'], 1, t`$T_{\rm rel}\sim10^{15}$ yr.`),
  MC(t`For a virialised cluster of $N$ stars of mass $m$ and radius $\langle R\rangle$, $\langle v^2\rangle\propto$`, [t`$Nm/\langle R\rangle$`, t`$N\langle R\rangle/m$`, t`$m/(N\langle R\rangle)$`, t`$m/\langle R\rangle^2$`], 0, t`$\langle v^2\rangle=GNm/2\langle R\rangle$.`),
  MC(t`Electrons with $N(E)\propto E^{-2}$ emit synchrotron with spectrum`, [t`$\nu^{-1/2}$`, t`$\nu^{-1}$`, t`$\nu^{-3/2}$`, t`$\nu^{-2}$`], 0, t`$s=(p-1)/2$.`),
  MC(t`A flat rotation curve implies the enclosed mass scales as`, ['const', t`$\sqrt r$`, t`$r$`, t`$r^2$`], 2, t`$M_r=v_c^2r/G$.`),
  MC(t`$z=0.024$, $H_0=72$ km s$^{-1}$Mpc$^{-1}$: distance?`, ['10 Mpc', '100 Mpc', '300 Mpc', '720 Mpc'], 1, t`$cz/H_0$.`),
  MC(t`The 21 cm line is observed at 700 MHz. Emission redshift?`, ['0.3', '0.5', '1', '2'], 2, t`$1420/700-1\approx1$.`),
  MC(t`If $\Omega_{\rm tot}>1$, the spatial geometry is`, ['flat', 'open/hyperbolic', 'closed/spherical', 'cylindrical'], 2, t`$k=+1$.`),
]);

const s24 = mcExam('s24', 'MC-S24', 'Mock exam: HS24 summer (21 Aug 2025), multiple choice', [
  MC(t`S1 has parallax $0.25''$; S2 is four times further. Parallax of S2?`, [t`$1.00''$`, t`$0.50''$`, t`$0.0625''$`, t`$0.125''$`], 2, t`$p\propto1/d$.`),
  MC(t`The Sun is 8 kpc from the Galactic centre. A star 10 kpc away at $l=180^\circ$, $b=0^\circ$ is how far from the centre?`, ['2 kpc', '8 kpc', '10 kpc', '18 kpc'], 3, 'Anticentre: distances add.'),
  MC(t`Cloud C1: $\rho_0$, diameter $D$; C2: $2\rho_0$, $D/2$; same opacity. Through the centres,`, [t`$\tau_1=\tau_2$`, t`$\tau_1=\frac12\tau_2$`, t`$\tau_1=2\tau_2$`, t`$\tau_1=4\tau_2$`], 0, t`$\tau=\chi\rho L$.`),
  MC(t`Which pairs a radiative quantity with an incorrect SI unit?`, [t`$I_\nu$: W m$^{-2}$sr$^{-1}$Hz$^{-1}$`, t`$F_\nu$: W m$^{-2}$`, t`$j_\nu$: W m$^{-3}$sr$^{-1}$Hz$^{-1}$`, 'none of the above'], 1, t`$F_\nu$ is per Hz.`),
  MC(t`A main-sequence star more massive than the Sun is relatively`, ['less luminous, hotter, shorter-lived', 'more luminous, hotter, shorter-lived', 'more luminous, cooler, shorter-lived', 'more luminous, hotter, longer-lived'], 1, t`$L\propto M^3$, $M\propto T^2$, $\tau\propto M^{-2}$.`),
  MC(t`Relationship between colour and $T_{\rm eff}$:`, [t`hotter stars peak at higher $\nu_{\max}$ and are bluer`, t`cooler stars peak at lower $\nu_{\max}$ and are bluer`, t`cooler stars peak at higher $\nu_{\max}$ and are redder`, t`hotter stars peak at lower $\nu_{\max}$ and are bluer`], 0, t`$\nu_{\max}\propto T$.`),
  MC(t`Relative to disk stars, halo and bulge stars are predominantly`, ['younger Pop I, more metals', 'older Pop I, fewer metals', 'younger Pop II, fewer metals', 'older Pop II, fewer metals'], 3, 'Formed before enrichment.'),
  MC(t`Molecular clouds are the birthplace of stars because`, ['they are dense and cold', 'they are hot enough for spontaneous fusion', 'they are hot enough for fission', 'they are the only places with ionised hydrogen'], 0, 'Small Jeans mass.'),
  MC(t`Dynamical friction on a massive particle is directed`, ['backwards, from enhanced density in its wake', 'forwards, from enhanced density in its wake', 'backwards, from reduced density in its wake', 'forwards, from reduced density in its wake'], 0, 'The wake pulls it back.'),
  MC(t`In the Jeans analysis (non-expanding fluid) a mode with $\lambda<\lambda_J$ will`, ['grow or decay exponentially', 'grow or decay logarithmically', 'oscillate', 'remain constant'], 2, 'Pressure wins.'),
  MC(t`Synchrotron radiation is produced by`, ['neutrinos changing flavour', 'self-gravitating particles', 'dark matter during virialisation', 'free electrons spiralling about magnetic field lines'], 3, 'Relativistic electrons.'),
  MC(t`Seyfert galaxies are`, ['spirals with a bright nucleus and strong emission lines', 'spirals with a bright nucleus, no strong lines', 'ellipticals with a bright nucleus and strong lines', 'ellipticals with a bright nucleus, no strong lines'], 0, 'Definition.'),
  MC(t`In the flat part of a rotation curve the density scales as`, [t`$r^2$`, t`$r$`, t`$r^{-1}$`, t`$r^{-2}$`], 3, t`$dM/dr\propto$ const.`),
  MC(t`If small triangles on a 2D surface have angle sums $>180^\circ$, the surface has`, ['curvature −1', 'negative curvature', 'zero curvature', 'positive curvature'], 3, 'Sphere-like.'),
  MC(t`Recombination occurred at an energy scale of`, ['about 1 GeV', 'about 1 MeV', 'about 1 eV', 'about 0.01 eV'], 2, 'Many photons per baryon.'),
]);

const w24 = mcExam('w24', 'MC-W24', 'Mock exam: HS24 winter (29 Jan 2025), multiple choice', [
  MC(t`Naked-eye limit $m<6.5$. Out to what distance is a star with $M=4$ visible?`, ['~10 pc', '~30 pc', '~50 pc', '~100 pc'], 1, t`$d<10^{1.5}$ pc.`),
  MC(t`S1 has $B-V=0.5$, S2 has $B-V=1.0$. Which must be true?`, ['S1 emits more short-wavelength light than S2', 'S2 emits more short-wavelength light than S1', 'S1 must be brighter than S2', 'S2 must be more distant'], 0, 'Smaller B−V is bluer.'),
  MC(t`Local but not global thermal equilibrium (size $L$, mean free path $l$) if $T$, $P$`, [t`are constant and $l\gg L$`, t`are constant and $l\ll L$`, t`depend on time/location and $l\gg L$`, t`depend on time/location and $l\ll L$`], 3, 'Collisions frequent, gradients present.'),
  MC(t`Constant-property medium, optical depth $\tau_\nu$:`, [t`$I\simeq S$ thick, $I\simeq S\tau$ thin`, t`$I\simeq S$ thin, $I\simeq S\tau$ thick`, t`$I\simeq S$ always`, t`$I\simeq Se^{-\tau}$ always`], 0, t`$I=S(1-e^{-\tau})$.`),
  MC(t`Leaving the main sequence to become a red giant, a star becomes`, ['less massive, hotter', 'cooler, less luminous', 'cooler, more luminous', 'cooler, smaller'], 2, 'Up and to the right.'),
  MC(t`Neutrino oscillations are indicated because we detect`, ['no neutrinos', t`one third of the predicted $\nu_e$`, t`three times the predicted $\nu_e$`, t`only $\nu_\mu$ and $\nu_\tau$`], 1, 'Flavour change.'),
  MC(t`As a main-sequence star the Sun generates energy primarily through`, ['fusion of He into C', 'fission of heavy elements', 'fusion of H into He', 'gravitational contraction'], 2, 'pp chain.'),
  MC(t`Molecular clouds are`, ['regions of ionised hydrogen', 'hot diffuse regions where stars are born', 'cool dense regions where stars are born', 'regions where stars cannot form'], 2, 'Cold and dense.'),
  MC(t`The "curve of growth" relates`, ['equivalent width of a line and column density', 'perturbation amplitude and time', 'Einstein coefficients and level spacing', 'AGN luminosity and black-hole mass'], 0, 'Abundance analysis.'),
  MC(t`For a self-gravitating system in steady state, $\bar E=$`, [t`$2\bar K$`, t`$\frac12\bar K$`, t`$2\bar V$`, t`$\frac12\bar V$`], 3, t`$2\bar K+\bar V=0$.`),
  MC(t`Self-gravitating stellar systems`, ['relax via collisions to thermal equilibrium', 'relax via collisions, not to thermal equilibrium', 'relax via other processes to thermal equilibrium', 'relax via other processes, not to thermal equilibrium'], 3, 'Violent relaxation.'),
  MC(t`X-ray bremsstrahlung from an ICM with constant $T$`, [t`is concentrated in high-density regions ($\rho^2$)`, 'is linear in density', t`is concentrated in low-density regions ($\rho^{-2}$)`, 'depends only on T'], 0, t`$\propto n_en_p$.`),
  MC(t`A galaxy cluster typically consists of`, ['2 galaxies', '≳100 galaxies', '5-10 galaxies', 'only galaxies above 10¹³ M☉'], 1, 'Up to ~1000.'),
  MC(t`In our Universe`, ['radiation dominates early, matter later', 'matter dominates early, radiation later', 'radiation always dominates', 'matter always dominates'], 0, t`$\rho_R/\rho_M\propto1/a$.`),
  MC(t`The energy density of radiation scales as`, [t`$a^{-3}$`, t`$a^{-2}$`, t`$a^{-4}$`, 'constant'], 2, 'Dilution and redshift.'),
]);

const p25 = mcExam('p25', 'MC-P25', 'Mock exam: HS25 practice exam, multiple choice', [
  MC(t`$M=1.0$, $d=100$ pc, extinction $A_\lambda=0.2$. Apparent magnitude?`, ['5.2', '6.2', '6.7', '7.2'], 1, t`$1+5+0.2$.`),
  MC(t`$I_\nu$ of a source seen from a large distance $R$ (vacuum)`, [t`is independent of $R$`, t`decreases linearly with $R$`, t`increases linearly with $R$`, t`decreases as $1/R^2$`], 0, 'Conserved along rays.'),
  MC(t`Observing a dust cloud of high optical depth, direct studies are`, ['impossible', 'limited to its core', 'unaffected by τ', 'limited to its surface'], 3, t`We see to $\tau\sim1$.`),
  MC(t`When the Schwarzschild criterion holds, the material is`, ['stable to convection', 'unable to transport energy radiatively', 'stable to conduction', 'efficiently convective'], 0, 'Stability criterion.'),
  MC(t`The Sun is a`, ['class O main-sequence star', 'class G main-sequence star', 'white dwarf', 'class M red giant'], 1, 'G2V.'),
  MC(t`For the Sun ($T\sim10^7$ K)`, ['pp and CNO contribute equally', 'CNO dominates', 'neither contributes significantly', 'pp chains dominate'], 3, 'CNO above ~1.3 M☉.'),
  MC(t`BBN occurred at an energy scale of`, ['about 10 GeV', 'about 1 GeV', 'about 1 MeV', 'about 1 eV'], 2, 'Nuclear binding energies.'),
  MC(t`Milky Way components are supported by`, ['disk and bulge random motions, halo rotation', 'halo and disk rotation, bulge random motion', 'halo and bulge random motions, disk rotation', 'halo and bulge rotation, disk random motion'], 2, 'Only the disk rotates.'),
  MC(t`Compared with ellipticals, the disks of spirals are`, ['redder, older', 'redder, younger', 'bluer, older', 'bluer, younger'], 3, 'Star formation.'),
  MC(t`In contrast to an HI cloud, an HII region is`, ['ionised and ~100× hotter', 'neutral and ~100× hotter', 'ionised and ~100× cooler', 'similar T but ionised'], 0, '80 K vs ≳6000 K.'),
  MC(t`Comparing violent relaxation, collisional relaxation and crossing times:`, [t`$T_{rel}\simeq T_{VR}\simeq T_{cr}$`, t`$T_{rel}\simeq T_{VR}\gg T_{cr}$`, t`$T_{cr}\gg T_{rel}\simeq T_{VR}$`, t`$T_{rel}\gg T_{VR}\gtrsim T_{cr}$`], 3, 'Violent relaxation is fast.'),
  MC(t`The singular isothermal sphere ($\rho\propto r^{-2}$) has $\langle v^2\rangle$`, ['independent of r', t`$\propto r$`, t`$\propto1/r$`, t`$\propto1/r^2$`], 0, 'Isothermal.'),
  MC(t`Pressure dominates over gravity, preventing collapse, where`, [t`$|k|<k_J$, $M<M_J$`, t`$|k|>k_J$, $M<M_J$`, t`$|k|<k_J$, $M>M_J$`, t`$|k|\simeq k_J$, $M\simeq M_J$`], 1, 'Small scales oscillate.'),
  MC(t`Typical temperature of the ICM in clusters:`, ['10⁴ K', '100 K', '10¹² K', '10⁸ K'], 3, 'Virial temperature.'),
  MC(t`Matter is statistically homogeneous and isotropic`, ['below ~10 h⁻¹ Mpc', 'above ~100 h⁻¹ Mpc', 'within 1 h⁻¹ Mpc of the Local Group', 'only on the scale of the observable Universe'], 1, 'Cosmological principle.'),
]);

const lesson = {
  type: 'lesson', id: 'L1', title: 'How the Refregier exam works (and how to use this hall)', tier: 'intuition', minutes: 4, xp: 5,
  source: [exam('w25', 'cover page and instructions'), { file: 'notes/syllabus.md', where: '§3 Astrophysics I: format and topic weights' }],
  blocks: [
    P(t`Format (identical in all four recent exams): <b>15 multiple-choice questions × 3 pt = 45 pt</b> and <b>7 open questions ≈ 64–68 pt</b>, total ≈ 110 pt. Allowed: 4 A4 pages of notes (your formula codex), a non-programmable calculator, the constants table (G, k_B, h, c, m_p, M☉, R☉, pc, Jy, σ_T). Write down intermediate steps.`),
    P(t`The open questions are always: one photometry/angles question, one radiation (blackbody/CMB) question, one stellar-structure or Eddington question, one or two galaxy dynamics questions (virial, rotation curves, tidal, Plummer), one AGN/cluster question, and a Friedmann question at the end.`),
    { kind: 'exam', html: t`Mock-exam routine: do one MC set in 30 minutes without hints, then 2-3 open questions (bosses) under their timers. Two official keys contain arithmetic errors (HS24 summer Q2b: 1.77 pW, not 2.5 pW; HS25 practice Q6c: $2.2\times10^{11}M_\odot$, not $9.8\times10^{11}$): trust your own calculation.` },
  ],
  check: [],
};

const bosses = [
  {
    type: 'boss', id: 'b1', title: 'Exam boss: thermal bremsstrahlung and the cluster L_X–M relation', xp: 110, minutes: 20,
    source: exam('w25', 'Open Question 5 [11 pt]'),
    instructions: 'Derivation problem: solve on paper, then compare with the key points and enter the two exponents.',
    statement: [
      t`Consider the total X-ray luminosity due to thermal bremsstrahlung from the ionised intracluster plasma at temperature $T$. We derive an approximate scaling relation between this luminosity and the total cluster mass.`,
      t`(a) [3 pt] Given $\epsilon_\nu\propto n_en_pT^{-1/2}e^{-h\nu/k_BT}$ (Gaunt factor constant), show $L_X=\int dV\int_0^\infty\epsilon_\nu d\nu\propto\int\rho_g^2T^{1/2}dV$. Use $n_e=n_p$ and $\rho_g=\mu_en_em_p$ with constant $\mu_e$.`,
      t`(b) [3 pt] Assuming virial equilibrium with thermal support, derive a scaling relation for $T$ in terms of $M$ and $\langle R\rangle$. Take $\bar V\propto-GM^2/\langle R\rangle$, kinetic energy per particle $\propto k_BT$, $N$ particles of mass $\mu_em_p$ making up $M_g=f_gM$.`,
      t`(c) [2 pt] Show that with $M\propto\langle R\rangle^3$, $T\propto M^{2/3}$.`,
      t`(d) [3 pt] Approximating $L_X\propto\rho_g^2T^{1/2}\langle R\rangle^3$, derive $L_X\propto M^{4/3}$.`,
    ],
    finalAnswers: [
      { id: 'aT', prompt: t`Exponent of $M$ in $T\propto M^a$.`, answer: '2/3', vars: {}, tol: 0.01 },
      { id: 'aL', prompt: t`Exponent of $M$ in $L_X\propto M^b$.`, answer: '4/3', vars: {}, tol: 0.01 },
    ],
    keyPoints: [
      t`(a) $\int_0^\infty e^{-h\nu/k_BT}d\nu=k_BT/h$, so $\int\epsilon_\nu d\nu\propto n_e^2T^{1/2}\propto\rho_g^2T^{1/2}$.`,
      t`(b) $\bar K\propto Nk_BT=\frac{f_gM}{\mu_em_p}k_BT\propto MT$; $\bar K\propto-\bar V$ gives $T\propto M/\langle R\rangle$.`,
      t`(c)-(d) $\langle R\rangle\propto M^{1/3}\Rightarrow T\propto M^{2/3}$; $\rho_g\propto M/\langle R\rangle^3$ = const, so $L_X\propto M^{1/3}\cdot M=M^{4/3}$.`,
    ],
  },
  {
    type: 'boss', id: 'b2', title: 'Exam boss: black-hole growth at the Eddington limit', xp: 90, minutes: 15,
    source: exam('w25', 'Open Question 6 [8 pt]'),
    instructions: 'Solve on paper, then enter the numbers.',
    statement: [
      t`A black hole of mass $M_{BH}(t)$ accretes at rate $\dot M_{\rm acc}$. A fraction $\eta=0.1$ of the rest-mass energy is radiated, $L=\eta\dot M_{\rm acc}c^2$; the rest is added to the black hole. Assume it radiates at the Eddington luminosity $L_{Edd}=4\pi GM_{BH}m_pc/\sigma_T$.`,
      t`(a) [6 pt] Write a differential equation for $M_{BH}(t)$ in terms of $\eta$, $L_{Edd}$ and constants. Substitute $L_{Edd}$ and show $M_{BH}(t)=M_{BH}(0)e^{t/t_S}$. Give the Salpeter time $t_S$ and show $t_S\simeq5.0\times10^7$ yr.`,
      t`(b) [2 pt] Estimate the time for the black hole to double its mass.`,
    ],
    finalAnswers: [
      { id: 'tS', prompt: t`$t_S$ in $10^7$ yr.`, answer: 'eta/(1-eta)*c*sigT/(4*pi*G*mp)/yr/1e7', vars: { ...pick('G', 'c', 'mp', 'sigT', 'yr'), eta: 0.1 }, tol: 0.02 },
      { id: 'td', prompt: t`Doubling time in $10^7$ yr.`, answer: 'log(2)*eta/(1-eta)*c*sigT/(4*pi*G*mp)/yr/1e7', vars: { ...pick('G', 'c', 'mp', 'sigT', 'yr'), eta: 0.1 }, tol: 0.02 },
    ],
    keyPoints: [
      t`$\dot M_{\rm acc}=L_{Edd}/\eta c^2$, $\dot M_{BH}=(1-\eta)\dot M_{\rm acc}=\frac{1-\eta}{\eta}\frac{4\pi Gm_p}{\sigma_Tc}M_{BH}$.`,
      t`Exponential solution with $t_S=\frac{\eta}{1-\eta}\frac{c\sigma_T}{4\pi Gm_p}=5.0\times10^7$ yr.`,
      t`$t_{dbl}=t_S\ln2=3.5\times10^7$ yr.`,
    ],
  },
  {
    type: 'boss', id: 'b3', title: 'Exam boss: tidal disruption of galaxies', xp: 100, minutes: 15,
    source: exam('s24', 'Open Question 6 [10 pt]'),
    instructions: 'Solve on paper, then enter the number for (c).',
    statement: [
      t`Consider a galaxy of mass $m$ and radius $r$ at distance $d$ from a more massive galaxy of mass $M$.`,
      t`(a) [4 pt] The tidal acceleration is $a_{\rm tidal}=a_{\rm grav}(d)-a_{\rm grav}(d+r)$. Show $a_{\rm tidal}\simeq2GMr/d^3$ for $r\ll d$.`,
      t`(b) [3 pt] The small galaxy is disrupted if its surface acceleration $a_g\simeq Gm/r^2$ is smaller than the tidal acceleration. Show that they are equal at $d_{\rm limit}=(2M/m)^{1/3}r$.`,
      t`(c) [3 pt] How close can a Milky-Way-like spiral ($m\approx10^{12}M_\odot$, $r\approx10$ kpc) come to a cD galaxy ($M\approx10^{14}M_\odot$) without being disrupted? Answer in kpc.`,
    ],
    finalAnswers: [{ id: 'd', prompt: t`$d_{\rm limit}$ in kpc.`, answer: '(2*M/m)**(1/3)*r', vars: { M: 1e14, m: 1e12, r: 10 }, tol: 0.02 }],
    keyPoints: [
      t`(a) $GM[d^{-2}-(d+r)^{-2}]=\frac{GM}{d^2}[1-(1+r/d)^{-2}]\simeq\frac{GM}{d^2}\frac{2r}{d}$.`,
      t`(b) $2GMr/d^3=Gm/r^2\Rightarrow d=(2M/m)^{1/3}r$.`,
      t`(c) $200^{1/3}\times10$ kpc $=58.5$ kpc.`,
    ],
  },
  {
    type: 'boss', id: 'b4', title: 'Exam boss: extinction towards the Galactic centre', xp: 120, minutes: 25,
    source: exam('s24', 'Open Question 4 [12 pt]'),
    instructions: 'Solve on paper (draw the geometry), then enter the numbers for (b).',
    statement: [
      t`Visual extinction is taken proportional to the hydrogen column, $A_V\propto N_H=\int_0^\infty n_H\,ds$, along the line of sight to an extragalactic object at infinity. The Sun is at $d=8$ kpc from the Galactic centre; the line of sight has latitude $b$ at $l=0^\circ$.`,
      t`(a) [8 pt] Using the cosine rule, find the distance $r(s)$ from the Galactic centre of a point at distance $s$ along the line of sight. For $n_H\propto\exp(-(r/r_0)^2)$ and $A_V(b=0)\approx30$, show $A_V(b)=30\exp\left[\frac{d^2}{r_0^2}(\cos^2b-1)\right]$ (use $\int e^{-(ax^2+bx+c)}dx\approx\sqrt{\pi/a}\,e^{b^2/4a-c}$).`,
      t`(b) [4 pt] Compute $A_V$ and the flux ratio with/without extinction for $l=0^\circ$, $b=15^\circ$, $r_0=1.2$ kpc.`,
    ],
    finalAnswers: [
      { id: 'AV', prompt: t`$A_V(15^\circ)$.`, answer: '30*exp(d**2/r0**2*(cos(b*pi/180)**2-1))', vars: { d: 8, r0: 1.2, b: 15 }, tol: 0.03 },
      { id: 'F', prompt: t`$F_{\rm ext}/F_0$.`, answer: '10**(-30*exp(d**2/r0**2*(cos(b*pi/180)**2-1))/2.5)', vars: { d: 8, r0: 1.2, b: 15 }, tol: 0.04 },
    ],
    keyPoints: [
      t`$r(s)=\sqrt{d^2+s^2-2ds\cos b}$.`,
      t`Exponent $-\frac{1}{r_0^2}(s^2-2ds\cos b+d^2)$; Gaussian integral gives $N_H\propto r_0\sqrt\pi\exp[\frac{d^2}{r_0^2}(\cos^2b-1)]$; ratio to $b=0$ gives the formula.`,
      t`$A_V=1.53$, $F_{\rm ext}/F_0=10^{-0.61}=0.24$.`,
    ],
  },
  {
    type: 'boss', id: 'b5', title: 'Exam boss: virial theorem with the harmonic radius', xp: 90, minutes: 15,
    source: exam('s24', 'Open Question 5 [9 pt]'),
    instructions: 'Derivation: solve on paper, compare with the key points, enter the number.',
    statement: [
      t`A collisionless self-gravitating system of total mass $M$ and $N$ particles of identical mass $m$ is in virial equilibrium.`,
      t`(a) [3 pt] Show the total kinetic energy is $K=\frac12M\sigma_v^2$ with $\sigma_v^2=\frac1N\sum v_i^2$.`,
      t`(b) [3 pt] Show that for large $N$, $V\simeq-GM^2/(2r_H)$, where $r_H^{-1}=\frac{2}{N(N-1)}\sum_{i>j}r_{ij}^{-1}$.`,
      t`(c) [3 pt] Show $\sigma_v^2=GM/(2r_H)$.`,
    ],
    finalAnswers: [{ id: 'sig', prompt: t`Numbers: $M=10^{12}M_\odot$, $r_H=100$ kpc. $\sigma_v$ in km/s.`, answer: 'sqrt(G*M*Msun/(2*rH*1e3*pc))/1e3', vars: { ...pick('G', 'Msun', 'pc'), M: 1e12, rH: 100 }, tol: 0.02 }],
    keyPoints: [
      t`(a) $K=\sum\frac12mv_i^2=\frac12mN\sigma_v^2=\frac12M\sigma_v^2$.`,
      t`(b) $V=-\sum_{i>j}\frac{Gm^2}{r_{ij}}=-Gm^2\frac{N(N-1)}{2}r_H^{-1}\simeq-\frac{GM^2}{2r_H}$.`,
      t`(c) $2K+V=0\Rightarrow\sigma_v^2=GM/(2r_H)$.`,
    ],
  },
  {
    type: 'boss', id: 'b6', title: 'Exam boss: the Milky Way\'s escape velocity and mass', xp: 140, minutes: 25,
    source: exam('p25', 'Open Question 6 [15 pt]'),
    instructions: 'Solve on paper, then enter the numbers for (c). Note: the official key misprints the mass (see hint in the Dynamics Bay).',
    statement: [
      t`In the solar neighbourhood the Milky Way has a flat rotation curve $v(r)=v_c$, implying $\rho\propto r^{-2}$.`,
      t`(a) [3 pt] For a flat rotation curve with a cut-off radius $R$ beyond which the density is zero, derive $M_r$.`,
      t`(b) [6 pt] Show that the escape velocity from any $r<R$ is $v_{esc}^2=2v_c^2(1+\ln(R/r))$, starting from $\frac12mv_{esc}^2\equiv-\int_\infty^r\frac{GM_{r'}m}{r'^2}dr'$.`,
      t`(c) [6 pt] The largest velocity of any star near $r\approx8$ kpc is 440 km/s. Assuming it is bound, find lower limits on $R$ (kpc) and on the mass of the galaxy ($M_\odot$). Take $v_c=230$ km/s.`,
    ],
    finalAnswers: [
      { id: 'R', prompt: t`Lower limit on $R$ in kpc.`, answer: 'r*exp(v**2/(2*vc**2)-1)', vars: { r: 8, v: 440, vc: 230 }, tol: 0.02 },
      { id: 'M', prompt: t`Lower limit on the total mass in $10^{11}M_\odot$.`, answer: '(vc*1e3)**2*r*exp(v**2/(2*vc**2)-1)*1e3*pc/G/Msun/1e11', vars: { ...pick('G', 'Msun', 'pc'), r: 8, v: 440, vc: 230 }, tol: 0.02 },
    ],
    keyPoints: [
      t`(a) $M_r=Mr/R$ ($r<R$), $M$ ($r\ge R$).`,
      t`(b) Split the integral at $R$: $\frac{GM}{R}(1+\ln\frac Rr)$, and $v_c^2=GM/R$.`,
      t`(c) $R>8e^{(440/230)^2/2-1}=18.3$ kpc; $M=v_c^2R/G>2.2\times10^{11}M_\odot$ (the key's $9.8\times10^{11}$ is an arithmetic slip).`,
    ],
  },
];

export const rooms = {
  'exam-hall': {
    id: 'astro-exam-hall', region: 'Astro Observatory Ship', title: 'The Examination Hall', course: 'astrophysics',
    topics: ['full multiple-choice sets of HS24-HS25', 'remaining open exam questions', 'mock exams'],
    sources: [exam('w25', 'complete MC and open Q5, Q6'), exam('s24', 'complete MC and open Q4-Q6'), exam('w24', 'complete MC'), exam('p25', 'complete MC and open Q6')],
    intro: t`The final deck before the exam. Every multiple-choice question Refregier has set (60 of them, in exam order) and the open questions not fought elsewhere. Come here once the theory rooms are done, and run full mock exams under time pressure.`,
    encounters: [lesson, w25, s24, w24, p25, ...bosses],
  },
};
export const codex = [];
