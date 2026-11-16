"""Exercises with PhET simulations, placed into the rooms of all three courses (extras files).
Every expected answer was checked against the simulation itself:
- Quantum Bound States and Quantum Tunneling (Java/CheerpJ): energies and T from the sims' own solvers
  (jars from phet.colorado.edu, harnesses notes/solid-state/build/phet/Run.java and notes/phet/One.java, T.java);
- Blackbody Spectrum, Atomic Interactions, Quantum Measurement (HTML5): constants read from the sim source and readouts
  checked in a headless browser (e.g. 5800 K: peak 84.46 MW/m^2/um at 0.500 um, intensity 6.42e7 W/m^2).
Run: python3 build_phet.py  (writes game/content/<course>/phet-sims.json)"""
import json, math, os

ROOT = os.path.join(os.path.dirname(__file__), '../../game/content')
SIMS = {
    'bound': dict(url='https://phet.colorado.edu/sims/cheerpj/bound-states/latest/bound-states.html?simulation=bound-states&locale=en', name='PhET Quantum Bound States', java=True),
    'tunnel': dict(url='https://phet.colorado.edu/sims/cheerpj/quantum-tunneling/latest/quantum-tunneling.html?simulation=quantum-tunneling&locale=en', name='PhET Quantum Tunneling and Wave Packets', java=True),
    'measure': dict(url='https://phet.colorado.edu/sims/html/quantum-measurement/latest/quantum-measurement_en.html', name='PhET Quantum Measurement'),
    'blackbody': dict(url='https://phet.colorado.edu/sims/html/blackbody-spectrum/latest/blackbody-spectrum_en.html', name='PhET Blackbody Spectrum'),
    'atomic': dict(url='https://phet.colorado.edu/sims/html/atomic-interactions/latest/atomic-interactions_en.html', name='PhET Atomic Interactions'),
}
CREDIT = 'PhET Interactive Simulations, University of Colorado Boulder (CC-BY).'
E = ['eV', 'meV', 'nm', 'J']; DL = ['dimensionless', 'eV', 'nm', '%']; NM = ['nm', 'um', 'pm', 'eV']; FS = ['fs', 'ps', 's', 'eV']

def num(id, prompt, ans, unit, units, tol, hint, bonus=False):
    d = dict(id=id, prompt=prompt, answer=ans, unit=unit, units=units, tol=tol, hint=hint)
    if bonus: d['bonus'] = True
    return d

def ch(id, prompt, opts, correct, why, after=None):
    d = dict(id=id, kind='choice', prompt=prompt, options=opts, correct=correct, why={str(k): v for k, v in why.items()})
    if after: d['after'] = after
    return d

def calc(room, id, title, sim, setup, problem, steps, xp, where):
    s = dict(SIMS[sim]); s.update(setup=setup, credit=CREDIT)
    return dict(room=room, enc=dict(type='calc', id=id, title=title, fight='normal', sim=s, problem=problem, vars={}, steps=steps, xp=xp,
                                    source=dict(file=s['url'].split('?')[0], where=where)))

hb, m_e = 0.6582, 5.68                  # eV fs, eV fs^2/nm^2 (the Bound States sim's units)
h2m = 0.0381                            # hbar^2/2m_e in eV nm^2

# ================================================================== QM
qm = []
qm.append(calc('harmonic-oscillator-elevator', 'qm-ho-p1', 'PhET: the oscillator ladder', 'bound',
   'Open the <b>One Well</b> tab, choose the <b>Harmonic Oscillator</b> well. Defaults: angular frequency $\\omega=1\\ \\mathrm{fs^{-1}}$, particle mass $1.0\\,m_e$, offset 0. Click a level to see its wave function; the superposition button builds $\\psi_0+\\psi_1$.',
   'Check the spectrum $E_n=\\hbar\\omega(n+\\frac12)$ and the length scale $x_0=\\sqrt{\\hbar/m\\omega}$ of the ladder-operator solution in the simulation ($\\hbar=0.658$ eV fs).',
   [num('E0', 'Ground-state energy at $\\omega=1\\ \\mathrm{fs^{-1}}$ (eV).', '0.658/2', 'eV', E, 0.03, 'Zero-point energy $\\hbar\\omega/2=0.329$ eV: the sim draws the lowest level there, not at the bottom of the parabola.'),
    num('dE', 'Spacing between neighbouring levels (eV).', '0.658', 'eV', E, 0.03, 'Equal spacing $\\hbar\\omega=0.658$ eV: $a^\\dagger$ raises the energy by one quantum. (0.329, 0.987, 1.645, ... in the sim.)'),
    ch('m', 'Move the <b>particle mass</b> slider from 1.0 to 0.5 at fixed $\\omega$. What changes?', ['Only the wave functions get wider; the energies stay', 'The energies double', 'The energies halve', 'Nothing at all'], 0,
       {1: '$E_n=\\hbar\\omega(n+\\frac12)$ contains no mass at fixed $\\omega$ (the sim keeps $\\omega$, so it softens the spring $k=m\\omega^2$).', 2: 'Same reason: no $m$ in $E_n$ at fixed $\\omega$.', 3: 'The width $x_0=\\sqrt{\\hbar/m\\omega}$ grows by $\\sqrt2$.'},
       'Energies fixed by $\\omega$ alone; the length scale $x_0\\propto m^{-1/2}$ changes.'),
    num('x0', 'Oscillator length $x_0=\\sqrt{\\hbar/m_e\\omega}$ for $\\omega=1\\ \\mathrm{fs^{-1}}$, with $m_e=5.68$ eV fs$^2$/nm$^2$ (nm). It is the classical turning point of the ground state.', 'sqrt(0.658/5.68)', 'nm', NM, 0.03, '$\\sqrt{0.658/5.68}=0.34$ nm: where $\\frac12m\\omega^2x^2=\\frac12\\hbar\\omega$. The ground-state wave function visibly extends beyond it (tunnelling into the classically forbidden region).'),
    num('T', 'Superposition $\\psi_0+\\psi_1$: period of the sloshing of $|\\psi|^2$ (fs). Watch the clock.', '2*pi/1', 'fs', FS, 0.05, 'The relative phase evolves with $(E_1-E_0)/\\hbar=\\omega$: period $2\\pi/\\omega=6.28$ fs, the classical period (Ehrenfest).'),
    num('E5', 'Set $\\omega=2\\ \\mathrm{fs^{-1}}$. Energy of the level $n=5$ (eV).', '0.658*2*5.5', 'eV', E, 0.03, '$\\hbar\\omega(5+\\frac12)=1.316\\times5.5=7.24$ eV (sim: 7.238 eV). The level index equals the number of nodes.')],
   70, 'One Well, Harmonic Oscillator; energies from the sim\'s solver: 0.3290, 0.9870, 1.6450 eV ... (omega=1), 7.2380 eV (n=5, omega=2)'))

qm.append(calc('wave-mechanics-basics', 'qm-wm-p1', 'PhET: the finite square well', 'bound',
   'Open the <b>One Well</b> tab, <b>Square</b> well. Defaults: width 1 nm, height 10 eV, offset 0, mass $1.0\\,m_e$ ("Configure Potential..." shows them).',
   'Compare the finite well with the infinite box $E_n^{\\infty}=\\dfrac{n^2\\pi^2\\hbar^2}{2mL^2}$ and count the bound states with $z_0=\\dfrac L2\\dfrac{\\sqrt{2mV_0}}{\\hbar}$ (number of bound states $=\\lceil2z_0/\\pi\\rceil$). Use $\\hbar^2/2m_e=0.0381$ eV nm$^2$.',
   [num('n', 'How many bound states does the default well have?', '6', 'dimensionless', DL, 0.01, '$z_0=0.5\\sqrt{10/0.0381}=8.10$, $2z_0/\\pi=5.16$: 6 states (levels up to 9.81 eV in the sim).'),
    num('Einf', 'Ground state of the <i>infinite</i> box of the same width (eV).', 'pi**2*0.0381/1**2', 'eV', E, 0.02, '$\\pi^2\\times0.0381/1^2=0.376$ eV.'),
    num('E1', 'Ground state of the finite well, read in the sim (eV).', '0.2996', 'eV', E, 0.05, 'The sim shows 0.300 eV: lower than 0.376 eV because the wave function leaks into the walls (effective width larger).'),
    ch('why', 'Which level is shifted most, relative to the infinite box?', ['The highest bound level', 'The ground state', 'All by the same factor', 'None: the levels coincide'], 0,
       {1: 'The ground state is deepest; its decay length $1/\\kappa$ outside is shortest, so the leak is smallest.', 2: 'The shift grows with $n$ as $V_0-E$ shrinks.', 3: 'The finite well is always lower.'},
       'Near the top $\\kappa=\\sqrt{2m(V_0-E)}/\\hbar$ is small: deep penetration, large effective width. Level 6: 9.81 eV vs $36\\times0.376=13.5$ eV in the box.'),
    num('n05', 'Set the width to 0.5 nm. Number of bound states now?', '3', 'dimensionless', DL, 0.01, '$z_0=4.05$, $2z_0/\\pi=2.58$: 3 states (0.967, 3.777, 7.990 eV). A finite 1D well always has at least one.')],
   60, 'One Well, Square; solver: width 1 nm 0.2996 1.1943 2.6696 4.6937 7.1893 9.8102 eV; width 0.5 nm 0.9668 3.7769 7.9898 eV'))

qm.append(calc('hydrogen-lamp', 'qm-hl-p1', 'PhET: hydrogen and positronium', 'bound',
   'Open the <b>One Well</b> tab, choose <b>3D Coulomb (L=0)</b>, offset 0, mass $1.0\\,m_e$. Zoom the energy axis to see the higher levels.',
   'The radial equation for $\\ell=0$ in the Coulomb potential gives $E_n=-\\dfrac{m e^4}{2(4\\pi\\epsilon_0)^2\\hbar^2}\\dfrac1{n^2}=-\\dfrac{13.6\\ \\mathrm{eV}}{n^2}$.',
   [num('E1', 'Ground-state energy (eV).', '-13.6016', 'eV', E, 0.01, 'Rydberg energy: $-13.6$ eV.'),
    num('lam', 'Photon wavelength of the $n=3\\to2$ transition (nm), from the two level energies.', '1239.84/(13.6016*(1/4-1/9))', 'nm', NM, 0.01, '$\\Delta E=13.6(\\frac14-\\frac19)=1.889$ eV, $\\lambda=hc/\\Delta E=1239.8/1.889=656$ nm: H$\\alpha$, the red Balmer line.'),
    ch('nodes', 'Click the $n=3$ level. How many nodes does the plotted ($\\ell=0$) wave function have (not counting $r=0$ and infinity)?', ['2', '3', '0', '9'], 0,
       {1: 'Radial nodes are $n-\\ell-1$.', 2: 'Only the ground state is node-free.', 3: '$n^2=9$ is the degeneracy (all $\\ell$, $m$), not the node count.'},
       '$n-\\ell-1=2$ radial nodes. The sim shows only $\\ell=0$; the other $\\ell<n$ states have the same energy (degeneracy $n^2$).'),
    num('Eps', 'Set the particle mass to 0.5 $m_e$ (the reduced mass of positronium, $e^+e^-$). Ground-state energy now (eV)?', '-13.6016/2', 'eV', E, 0.01, '$E_n\\propto m$: $-6.80$ eV, the positronium ground state. For real hydrogen the reduced mass $m_em_p/(m_e+m_p)$ shifts it by 0.05 %.')],
   60, 'One Well, 3D Coulomb (L=0); solver: -13.6016, -3.4004, -1.5113 eV (mass 1), -6.8008 eV (mass 0.5)'))

def T_barrier(E, V, a):
    if E < V: k = math.sqrt((V - E) / h2m); return 1 / (1 + V * V * math.sinh(k * a) ** 2 / (4 * E * (V - E)))
    k = math.sqrt((E - V) / h2m); return 1 / (1 + V * V * math.sin(k * a) ** 2 / (4 * E * (E - V)))
qm.append(calc('tunneling-bridge', 'qm-tunnel-p1', 'PhET: tunnelling through a barrier', 'tunnel',
   'Choose <b>Potential: barrier/well</b>, <b>plane wave</b>, and tick <b>Show reflection and transmission probabilities</b>. With <b>Configure Energy...</b> enter the exact values of each step: total energy $E$, barrier height $V_0=0.5$ eV, barrier width $a$.',
   'Transmission through a rectangular barrier for $E<V_0$: $T=\\left[1+\\dfrac{V_0^2\\sinh^2\\kappa a}{4E(V_0-E)}\\right]^{-1}$, $\\kappa=\\sqrt{2m(V_0-E)}/\\hbar$; for $E>V_0$ replace $\\sinh\\to\\sin$ and $\\kappa\\to k_2=\\sqrt{2m(E-V_0)}/\\hbar$. $\\hbar^2/2m_e=0.0381$ eV nm$^2$.',
   [num('T1', '$E=0.3$ eV, $a=0.5$ nm: transmission probability $T$.', '1/(1+0.25*sinh(sqrt(0.2/0.0381)*0.5)**2/(4*0.3*0.2))', 'dimensionless', DL, 0.02, '$\\kappa=\\sqrt{0.2/0.0381}=2.29$ nm$^{-1}$, $\\kappa a=1.15$, $T=0.325$ (sim: T = 0.32).'),
    num('T2', 'Same energy, $a=1.0$ nm: $T$.', '1/(1+0.25*sinh(sqrt(0.2/0.0381)*1.0)**2/(4*0.3*0.2))', 'dimensionless', DL, 0.02, '$\\kappa a=2.29$: $T=0.039$. Doubling the width divides $T$ by 8.4.'),
    num('T3', '$a=1.5$ nm: $T$.', '1/(1+0.25*sinh(sqrt(0.2/0.0381)*1.5)**2/(4*0.3*0.2))', 'dimensionless', DL, 0.03, '$\\kappa a=3.44$: $T=0.0040$, another factor 10 down.'),
    num('f', 'Thick-barrier rule $T\\approx\\frac{16E(V_0-E)}{V_0^2}e^{-2\\kappa a}$: predicted factor for each extra 0.5 nm, $e^{-2\\kappa\\cdot0.5\\,\\mathrm{nm}}$. Compare with T3/T2.', 'exp(-2*sqrt(0.2/0.0381)*0.5)', 'dimensionless', DL, 0.03, '$e^{-2.29}=0.101$; the sim gives $T_3/T_2=0.103$ (and $T_2/T_1=0.119$: the rule only holds once $\\kappa a\\gg1$).'),
    num('Eres', 'Above the barrier ($a=1$ nm) $T$ reaches exactly 1 when $k_2a=\\pi$. At which total energy (eV)? Check it in the sim.', '0.5+pi**2*0.0381/1**2', 'eV', E, 0.01, '$E=V_0+\\pi^2\\hbar^2/2ma^2=0.5+0.376=0.876$ eV: the barrier holds a whole half wavelength, reflections from both edges cancel (transmission resonance, the "Ramsauer" effect).'),
    num('R6', 'At $E=0.6$ eV ($a=1$ nm, above the barrier): reflection probability $R$.', '1-1/(1+0.25*sin(sqrt(0.1/0.0381)*1.0)**2/(4*0.6*0.1))', 'dimensionless', DL, 0.02, 'Classically $R=0$ above the barrier; quantum mechanically $R=0.51$ here.')],
   80, 'barrier/well, plane wave; transmission from the sim\'s SingleBarrierSolver: 0.32467, 0.03856, 0.00397 (E 0.3), 1.00000 (E 0.876), R 0.50960 (E 0.6)'))

a2 = 0.75
qm.append(calc('spin-addition-stern-gerlach', 'qm-sa-p1', 'PhET: Stern–Gerlach chains', 'measure',
   'Open the <b>Spin</b> screen. Use the experiment menu (Experiment 1 to 6) and <b>Custom</b>; switch the source to <b>Continuous</b> to collect statistics.',
   'Spin-1/2: a measurement along $\\hat n$ gives $+\\frac\\hbar2$ with probability $|\\langle+_n|\\psi\\rangle|^2$, and leaves the particle in the eigenstate it found. $|+_x\\rangle=\\frac1{\\sqrt2}(|{\\uparrow_z}\\rangle+|{\\downarrow_z}\\rangle)$.',
   [num('p1', 'Prepare $+X$ and run Experiment 1 (one SG$_z$). Fraction found in $|{\\uparrow_z}\\rangle$?', '0.5', 'dimensionless', DL, 0.02, '$|\\langle\\uparrow_z|+_x\\rangle|^2=\\frac12$.'),
    num('p4', 'Prepare $+Z$, Experiment 4 (SG$_z$ then SG$_z$ on the upper beam). Fraction of the upper beam that goes up again?', '1', 'dimensionless', DL, 0.01, 'The first SG$_z$ projected onto $|\\uparrow_z\\rangle$: repeating the same measurement gives the same result with certainty.'),
    num('p5', 'Prepare $+Z$, Experiment 3 (SG$_z$, then SG$_x$ on the upper beam). Fraction of that beam deflected to $+x$?', '0.5', 'dimensionless', DL, 0.02, '$|\\langle+_x|\\uparrow_z\\rangle|^2=\\frac12$: $S_z$ and $S_x$ do not commute; a definite $S_z$ means a completely uncertain $S_x$.'),
    ch('mem', 'Experiment 5 with $+Z$ prepared: SG$_x$ first, then SG$_z$ on the $+x$ beam. What fraction comes out $\\uparrow_z$, although all particles started $\\uparrow_z$?', ['1/2: the $x$ measurement erased the $z$ information', '1: the particles remember they started up', '0', '1/4'], 0,
       {1: 'After SG$_x$ the state is $|+_x\\rangle$, with no memory of the preparation.', 2: '$|\\langle\\uparrow_z|+_x\\rangle|^2=\\frac12$, not 0.', 3: 'The 1/2 of the first stage is already accounted for: within the selected beam it is 1/2.'},
       'Measurement projects the state: the core of the Stern–Gerlach chain.'),
    num('pz', 'Custom: set $|\\alpha|^2=0.75$ (real $\\alpha,\\beta\\ge0$) and use SG$_z$. Probability of $\\uparrow_z$?', str(a2), 'dimensionless', DL, 0.02, 'Directly $|\\alpha|^2=0.75$.'),
    num('px', 'Same state, SG$_x$: probability of $+x$, $|\\langle+_x|\\psi\\rangle|^2=\\frac12(\\alpha+\\beta)^2$.', f'0.5*(sqrt({a2})+sqrt(1-{a2}))**2', 'dimensionless', DL, 0.02, '$\\frac12(0.866+0.5)^2=0.933$. On the Bloch sphere the state is tilted by $\\theta=60^\\circ$ from $z$ towards $x$: $P(+x)=\\cos^2\\frac{90^\\circ-60^\\circ}{2}=0.933$.')],
   70, 'Spin screen, Experiments 1-6 and Custom; probabilities from the projection postulate (exact)'))

# ================================================================== solid state
ss = []
kB, u = 1.380649e-23, 1.66054e-27
def lj(sig_pm, eps_K, mass_u):
    eps = eps_K * kB; sig = sig_pm * 1e-12; k2 = 72 * eps / (2 ** (1 / 3) * sig ** 2); mu = mass_u * u / 2
    return 2 ** (1 / 6) * sig_pm, k2, math.sqrt(k2 / mu) / (2 * math.pi)
rNe, kNe, fNe = lj(308, 35.8, 20.18); rAr, kAr, fAr = lj(376, 111.84, 39.95)
ss.append(calc('bonding-grotto', 'ss-bon-p1', 'PhET: the Lennard-Jones pair', 'atomic',
   'Choose the atom pair in the panel (Neon–Neon, Argon–Argon, ...). Drag the moving atom and release it; open <b>Forces</b> to see attraction and repulsion. The graph marks $\\sigma$ and $\\varepsilon$.',
   'The sim uses $U(r)=4\\varepsilon\\left[(\\sigma/r)^{12}-(\\sigma/r)^6\\right]$ (script eq. 1.43 with $U_0=\\varepsilon$) with Ne: $\\sigma=308$ pm, $\\varepsilon/k_B=35.8$ K; Ar: $\\sigma=376$ pm, $\\varepsilon/k_B=111.8$ K (values from the sim\'s code).',
   [num('rmin', 'Equilibrium distance of the Ar–Ar pair, where the force vanishes (pm).', '2**(1/6)*376', 'pm', ['pm', 'nm', 'A', 'eV'], 0.02, '$dU/dr=0\\Rightarrow r_{\\min}=2^{1/6}\\sigma=1.12\\sigma=422$ pm; there $U=-\\varepsilon$.'),
    ch('rel', 'Release the atom from slightly beyond $r_{\\min}$. Where is the force zero, and what happens?', ['At $r_{\\min}$: the atom oscillates about it (the bond vibration)', 'At $r=\\sigma$: the atom stops there', 'Nowhere: it always flies apart', 'At the inflection point of $U$'], 0,
       {1: 'At $r=\\sigma$ the energy is zero, not the force; the repulsion is already strong.', 2: 'With total energy below 0 the atom is bound.', 3: 'The inflection point is where the restoring force is largest (bond-breaking point).'},
       'Small oscillations about $r_{\\min}$ with spring constant $U\'\'(r_{\\min})=\\dfrac{72\\varepsilon}{2^{1/3}\\sigma^2}=57.1\\,\\varepsilon/\\sigma^2$.'),
    num('f', 'Small-oscillation frequency of Ar–Ar, $f=\\frac1{2\\pi}\\sqrt{U\'\'(r_{\\min})/\\mu}$ with $\\mu=m_{\\rm Ar}/2$, $m_{\\rm Ar}=39.95$ u (THz).', f'{fAr:.6g}/1e12', 'THz', ['THz', 'GHz', 'Hz', 'eV'], 0.03, f'$U\'\'={kAr:.3f}$ N/m, $\\mu=3.32\\times10^{{-26}}$ kg: $f={fAr/1e12:.2f}$ THz, i.e. a phonon-like energy $hf\\approx3$ meV $\\approx k_B\\cdot33$ K, far below $\\varepsilon$.'),
    num('ratio', 'Ratio of the well depths $\\varepsilon_{\\rm Ar}/\\varepsilon_{\\rm Ne}$ in the sim. Compare with the ratio of their triple points (83.8 K / 24.6 K = 3.4).', '111.84/35.8', 'dimensionless', DL, 0.02, '3.1: the melting/boiling temperatures scale with $\\varepsilon/k_B$ (law of corresponding states), as Table 1.1 of the script says ($T_b\\approx U_0/k_B$).'),
    ch('sig', 'The script (Table 1.1) gives $\\sigma_{\\rm Ar}=3.40$ Å and the crystal nearest-neighbour distance is 3.76 Å. The sim uses $\\sigma_{\\rm Ar}=3.76$ Å. Which statement is right?', ['With the script\'s $\\sigma$, $r_{\\min}=2^{1/6}\\sigma=3.82$ Å matches the crystal; the sim\'s value puts the minimum at 4.22 Å, too far', 'The sim is right: $r_{\\min}$ should equal $\\sigma$', 'Both are equivalent, $\\sigma$ is just a label', 'The crystal distance should be $1.3\\sigma$'], 0,
       {1: 'At $r=\\sigma$ the energy crosses zero; the minimum is $2^{1/6}\\sigma$.', 2: 'The equilibrium distance follows from $\\sigma$, so the two parameter sets predict different crystals.', 3: '$1.3\\sigma$ is the misprint discussed in the notes; eq. 1.43 gives $1.12\\sigma$.'},
       'The sim simply took the crystal spacing as $\\sigma$: a model, not data. Exam answers use the script values.')],
   70, 'Atomic Interactions: LjPotentialCalculator (U = 4 eps[(s/r)^12-(s/r)^6], r_min = 2^(1/6) sigma), SigmaTable Ne 308 pm / Ar 376 pm, InteractionStrengthTable Ne 35.8 K / Ar 111.84 K'))

# ================================================================== astrophysics
astro = []
h, c, sig = 6.62607015e-34, 2.99792458e8, 5.670374e-8; b = 2.897771955e-3
def peak(T): l = b / T; return 2 * math.pi * h * c * c / l ** 5 / (math.exp(h * c / (l * kB * T)) - 1) / 1e12
astro.append(calc('photometry-radiation', 'astro-light-p1', 'PhET: Wien and Stefan–Boltzmann on real stars', 'blackbody',
   'Tick <b>Graph Values</b>, <b>Labels</b> and <b>Intensity</b>. Drag the thermometer or click its labels: Earth 250 K, Light Bulb 3000 K, Sun 5800 K, Sirius A 9950 K. Zoom the axes with the magnifiers.',
   'The curve is the spectral exitance $\\pi B_\\lambda(T)$ in MW m$^{-2}\\,\\mu$m$^{-1}$; Wien: $\\lambda_{\\max}T=2.898\\times10^{-3}$ m K; total intensity $\\sigma T^4$.',
   [num('lamS', 'Sirius A (9950 K): wavelength of the peak ($\\mu$m).', f'{b}/9950*1e6', 'um', ['um', 'nm', 'm', 'eV'], 0.01, '$2898\\ \\mu$m K / 9950 K = 0.291 $\\mu$m: ultraviolet. Sirius looks blue-white.'),
    num('IS', 'Intensity of Sirius A relative to the Sun (ratio of the two readouts).', '(9950/5800)**4', 'dimensionless', DL, 0.01, f'$(9950/5800)^4=8.66$: readouts $5.56\\times10^8$ and $6.42\\times10^7$ W m$^{{-2}}$.'),
    num('pk', 'Ratio of the peak heights Sirius A / Sun.', '(9950/5800)**5', 'dimensionless', DL, 0.02, f'The peak value scales as $T^5$ ($B_\\lambda\\propto\\lambda^{{-5}}$ at $\\lambda_{{\\max}}\\propto1/T$): $14.9$; the sim shows {peak(5800):.2f} and {peak(9950):.0f} MW m$^{{-2}}\\mu$m$^{{-1}}$.'),
    num('L', 'From the Sun\'s intensity readout, the solar luminosity $L=4\\pi R_\\odot^2\\sigma T^4$ ($R_\\odot=6.96\\times10^8$ m), in W.', '4*pi*(6.96e8)**2*5.670374e-8*5800**4', 'W', ['W', 'J', 'W/m^2', 'erg/s'], 0.02, '$4\\pi(6.96\\times10^8)^2\\times6.42\\times10^7=3.9\\times10^{26}$ W.'),
    num('lamE', 'Earth (250 K): peak wavelength ($\\mu$m). Zoom out to find it.', f'{b}/250*1e6', 'um', ['um', 'nm', 'm', 'eV'], 0.01, '11.6 $\\mu$m: thermal infrared, where greenhouse gases absorb. Bolometric intensity only 222 W m$^{-2}$.')],
   70, f'Blackbody Spectrum 1.0: presets 250/3000/5800/9950 K; readouts at 5800 K: peak {peak(5800):.2f} MW/m^2/um at 0.500 um, 6.42e7 W/m^2 (checked in the sim)'))

for course, items in (('qm', qm), ('solid-state', ss), ('astrophysics', astro)):
    out = dict(about='Exercises with PhET simulations (CC-BY), placed into rooms. Answers checked against the simulations: notes/phet/build_phet.py.', items=items)
    with open(os.path.join(ROOT, course, 'phet-sims.json'), 'w') as fh: json.dump(out, fh, ensure_ascii=False, indent=1)
    p = os.path.join(ROOT, course, 'index.json')
    with open(p, encoding='utf-8') as fh: idx = json.load(fh)
    ex = idx.get('extras', [])
    if 'phet-sims.json' not in ex: ex.append('phet-sims.json')
    idx['extras'] = ex
    with open(p, 'w') as fh: json.dump(idx, fh, indent=2); fh.write('\n')
    print(course, len(items), 'exercises')
