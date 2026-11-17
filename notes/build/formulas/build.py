"""Formula supplements: short lessons whose displayed equations become formula cards (loot, fights, summary builder) for
formulas the exams and sheets need but no lesson displayed yet (found by a coverage check of the deck, 2026-11-17).
Solid state in the script's notation (eq. numbers given); astro in Choudhuri's. QM has no exam aids and gets none.
Writes game/content/solid-state/formula-extras.json and game/content/astrophysics/formula-extras.json and adds the card
names to game/content/formula-names.json. Run: python3 build.py"""
import json, os
HERE = os.path.dirname(os.path.abspath(__file__)); GAME = os.path.join(HERE, '../../../game/content')

def T(h): return {'kind': 'text', 'html': h}
def E(t, l): return {'kind': 'eq', 'tex': t, 'label': l}
def K(q, o, e): return {'q': q, 'options': o, 'correct': 0, 'explain': e}
def L(id, title, src, blocks, checks, names):
    return {'type': 'lesson', 'tier': 'theory', 'minutes': 8, 'xp': 10, 'id': id, 'title': title, 'source': src, 'blocks': blocks, 'check': checks}, names

SS_SCRIPT = 'materials/solid-state/scripts/Script-2026 2026-09-01.pdf'
BOOK = 'materials/astrophysics/scripts/Choudhuri_Textbook.pdf'
SS = [
 ('phonon-halls',) + L('ss-fx-pho', 'Formula cards: Einstein and Debye in numbers', [{'file': SS_SCRIPT, 'where': 'eq. (2.13); 2.4.2-2.4.3'}], [
   T(r'Two formulas for the summary that the lessons only use in words: Einstein&#8217;s heat capacity and the Debye cutoff from counting modes.'),
   E(r'C_V=\frac{3Nk_B}{V}\left(\frac{\hbar\omega}{k_BT}\right)^2\frac{e^{\hbar\omega/k_BT}}{\left(e^{\hbar\omega/k_BT}-1\right)^2}', 'Einstein heat capacity, script (2.13), per volume'),
   E(r'k_D=\left(6\pi^2\frac NV\right)^{1/3},\qquad \omega_D=v_sk_D,\qquad T_D=\frac{\hbar\omega_D}{k_B}', 'Debye wave vector, frequency and temperature (one atom per cell, one sound velocity)'),
   {'kind': 'intuition', 'html': r'$k_D$ is the radius of a sphere with as many $q$-points as atoms: $\frac{V}{(2\pi)^3}\frac43\pi k_D^3=N$. With three branches that gives the $3N$ modes.'}],
   [K(r'Einstein $C_V$ for $k_BT\ll\hbar\omega$ decays as', [r'$e^{-\hbar\omega/k_BT}$ (times a power)', r'$T^3$', r'$T$', r'constant'], r'All modes are gapped.'),
    K(r'$k_D=(6\pi^2N/V)^{1/3}$ follows from', [r'one $q$-point per atom inside the Debye sphere', r'the Fermi sphere with spin', r'the Brillouin zone volume times 2', r'the sound velocity'], r'$\frac{V}{(2\pi)^3}\frac43\pi k_D^3=N$.')],
   ['Einstein heat capacity', 'Debye wave vector, frequency and temperature']),
 ('fermi-sea',) + L('ss-fx-tb', 'Formula card: tight-binding band of a cubic lattice', [{'file': SS_SCRIPT, 'where': 'eqs. (3.59), (3.62)'}], [
   T(r'The tight-binding dispersion in the script&#8217;s notation, with nearest-neighbour hopping $t$ on a simple cubic lattice of constant $a$:'),
   E(r'\varepsilon(\mathbf k)=\varepsilon-t_0-2t\big(\cos ak_x+\cos ak_y+\cos ak_z\big),\qquad W=12t', 'tight binding, script (3.62); bandwidth W'),
   E(r'\varepsilon\approx\varepsilon-t_0-6t+ta^2k^2\ \ (k\to0)\quad\Rightarrow\quad m^*=\frac{\hbar^2}{2ta^2}', 'effective mass at the band bottom'),
   {'kind': 'pitfall', 'html': r'Larger overlap means larger $t$: a wider band and a <i>smaller</i> effective mass. Near the band top ($k=\pi/a$) the curvature is negative: $m^*=-\hbar^2/2ta^2$.'}],
   [K(r'Bandwidth of the simple-cubic tight-binding band', [r'$12t$', r'$4t$', r'$6t$', r'$2t$'], r'From $-6t$ to $+6t$ around $\varepsilon-t_0$.'),
    K(r'Effective mass at the bottom of this band', [r'$\hbar^2/2ta^2$', r'$\hbar^2/ta^2$', r'$m_e$', r'$2ta^2/\hbar^2$'], r'Expand $\cos ak\approx1-a^2k^2/2$.')],
   ['Tight-binding dispersion (simple cubic) and bandwidth', 'Effective mass at the tight-binding band bottom']),
 ('semiconductor-forge',) + L('ss-fx-cyc', 'Formula card: cyclotron resonance', [{'file': SS_SCRIPT, 'where': '5.1.3'}], [
   T(r'In a magnetic field $B$, carriers with effective mass $m^*$ circle with the cyclotron frequency; absorption of microwaves at $\omega_c$ measures $m^*$.'),
   E(r'\omega_c=\frac{eB}{m^*},\qquad \text{resonance condition }\ \omega_c\tau\gg1', 'cyclotron frequency, script 5.1.3'),
   {'kind': 'exam', 'html': r'Numbers: $f=24$ GHz at $B=1$ T gives $m^*=eB/2\pi f\approx1.2\,m_e$.'}],
   [K(r'Cyclotron resonance measures', [r'the effective mass', r'the gap', r'the mobility only', r'the Fermi energy'], r'$\omega_c=eB/m^*$.'),
    K(r'A resonance is only visible if', [r'$\omega_c\tau\gg1$ (cold, clean samples)', r'$\omega_c\tau\ll1$', r'$B=0$', r'$T$ is high'], r'The carrier must complete orbits between collisions.')],
   ['Cyclotron frequency']),
]
AS = [
 ('stellar-forge',) + L('astro-fx-edd', 'Formula card: Eddington luminosity', [{'file': BOOK, 'where': 'Choudhuri 3.6.1'}], [
   T(r'Radiation pressure on electrons (Thomson) balances gravity on the protons they drag along:'),
   E(r'L_{\rm Edd}=\frac{4\pi GMm_pc}{\sigma_T}\approx1.3\times10^{31}\,\mathrm W\,\frac{M}{M_\odot}=3.3\times10^4L_\odot\frac M{M_\odot}', 'Eddington luminosity (pure hydrogen, Thomson opacity)'),
   E(r'\dot M_{\rm Edd}=\frac{L_{\rm Edd}}{\eta c^2},\qquad t_{\rm Edd}=\frac{M}{\dot M_{\rm Edd}}=\frac{\eta\,\sigma_Tc}{4\pi Gm_p}\approx\eta\times4.5\times10^8\,\mathrm{yr}', 'Eddington accretion rate and growth time (HS25 winter Q6)')],
   [K(r'$L_{\rm Edd}$ scales with mass as', [r'$\propto M$', r'$\propto M^2$', r'$\propto M^3$', r'independent of $M$'], r'Gravity and radiation force both $\propto1/r^2$.'),
    K(r'A black hole growing at the Eddington rate grows', [r'exponentially (e-folding time $\propto\eta$)', r'linearly', r'not at all', r'as $t^2$'], r'$\dot M\propto M$.')],
   ['Eddington luminosity', 'Eddington accretion rate and growth time']),
 ('degenerate-matter',) + L('astro-fx-rs', 'Formula cards: Schwarzschild radius and free-fall time', [{'file': BOOK, 'where': 'Choudhuri 5, 8.3, 13 (Schwarzschild)'}], [
   T(r'Two quick scales: the size of a black hole, and how long a pressureless cloud needs to collapse.'),
   E(r'R_S=\frac{2GM}{c^2}\approx3\,\mathrm{km}\,\frac M{M_\odot}', 'Schwarzschild radius'),
   E(r't_{\rm ff}=\sqrt{\frac{3\pi}{32G\rho}}\approx\frac{0.54}{\sqrt{G\rho}}', 'free-fall time of a uniform sphere')],
   [K(r'$R_S$ of a $10^8M_\odot$ black hole', [r'$3\times10^8$ km $\approx2$ AU', r'3 km', r'$3\times10^{12}$ km', r'1 pc'], r'$3\,\mathrm{km}\times10^8$.'),
    K(r'The free-fall time depends on', [r'only the mean density', r'the radius only', r'the temperature', r'the mass only'], r'$t_{\rm ff}\propto1/\sqrt{G\rho}$.')],
   ['Schwarzschild radius', 'Free-fall time']),
 ('galactic-dynamics',) + L('astro-fx-plum', 'Formula cards: Plummer sphere and tidal radius', [{'file': BOOK, 'where': 'Choudhuri 7; HS25 winter Q4 (Plummer), HS24 summer Q6 (tidal disruption)'}], [
   T(r'The Plummer sphere is the standard soft-core model of a star cluster; the tidal radius says where a companion&#8217;s pull wins.'),
   E(r'\Phi(r)=-\frac{GM}{\sqrt{r^2+b^2}},\qquad \rho(r)=\frac{3M}{4\pi b^3}\left(1+\frac{r^2}{b^2}\right)^{-5/2}', 'Plummer potential and density'),
   E(r'r_t\approx R\left(\frac{m}{3M}\right)^{1/3}\ \ (\text{satellite }m\text{ at distance }R),\qquad r_{\rm TD}\approx R_*\left(\frac{M_{\rm BH}}{M_*}\right)^{1/3}', 'tidal radius; tidal-disruption radius of a star')],
   [K(r'At $r\gg b$ the Plummer potential becomes', [r'$-GM/r$ (point mass)', r'constant', r'harmonic', r'$-GM/b$'], r'Soft core only matters inside $b$.'),
    K(r'A star is torn apart by a black hole when it comes closer than about', [r'$R_*(M_{\rm BH}/M_*)^{1/3}$', r'$R_S$ always', r'$R_*$', r'1 pc'], r'Tidal acceleration exceeds the star&#8217;s self-gravity.')],
   ['Plummer potential and density', 'Tidal radius and tidal-disruption radius']),
 ('expanding-universe',) + L('astro-fx-age', 'Formula cards: ages and densities of simple universes', [{'file': BOOK, 'where': 'Choudhuri 10.6-10.7'}], [
   T(r'Flat universes with one component: the age follows from $a\propto t^{2/(3(1+w))}$ and $H=\dot a/a$.'),
   E(r'\text{matter: }t_0=\frac2{3H_0},\qquad \text{radiation: }t=\frac1{2H},\qquad \text{empty (Milne): }t_0=\frac1{H_0}', 'age of flat one-component universes'),
   E(r'\rho_c=\frac{3H_0^2}{8\pi G}\approx9.2\times10^{-27}\,\mathrm{kg\,m^{-3}}\,\Big(\frac{H_0}{70\,\mathrm{km/s/Mpc}}\Big)^2,\qquad \frac1{H_0}\approx14\,\mathrm{Gyr}', 'critical density and Hubble time in numbers')],
   [K(r'The age of a flat matter-dominated universe is', [r'$\frac2{3H_0}$', r'$\frac1{H_0}$', r'$\frac1{2H_0}$', r'$\frac3{2H_0}$'], r'$a\propto t^{2/3}$, $H=\frac2{3t}$.'),
    K(r'The Hubble time for $H_0=70$ km/s/Mpc is about', [r'14 Gyr', r'1.4 Gyr', r'140 Gyr', r'4.5 Gyr'], r'$1/H_0$.')],
   ['Age of flat one-component universes', 'Critical density and Hubble time (numbers)']),
]
names = json.load(open(os.path.join(GAME, 'formula-names.json')))
for course, items in (('solid-state', SS), ('astrophysics', AS)):
    out = []
    for room, enc, nm in items:
        out.append({'room': room, 'enc': enc})
        for i, n in enumerate(nm): names['names'][f"{enc['id']}#{i}"] = n
    json.dump({'about': 'Formula supplements (cards for the summary); built by notes/build/formulas/build.py', 'items': out}, open(os.path.join(GAME, course, 'formula-extras.json'), 'w'), ensure_ascii=False, indent=1)
    idx_p = os.path.join(GAME, course, 'index.json'); idx = json.load(open(idx_p))
    if 'formula-extras.json' not in idx['extras']: idx['extras'].append('formula-extras.json'); json.dump(idx, open(idx_p, 'w'), indent=2)
json.dump(names, open(os.path.join(GAME, 'formula-names.json'), 'w'), ensure_ascii=False, indent=1)
print(len(SS), 'solid-state and', len(AS), 'astro supplement lessons;', len(names['names']), 'card names')
