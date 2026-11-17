r"""Coverage map: every subsection of the solid-state script (Script-2026, Degen) against the game's solid-state content.
Each subsection has a few key concepts (regular expressions). For every concept the script counts how many lessons (theory),
quizzes and exercises (calculations, derivations, sheet questions, exam problems, experiments) of the game mention it.
Writes notes/solid-state/coverage.md and game/content/solid-state/coverage.json. Run: python3 coverage.py
A mention is not a lesson: this finds what is missing, it does not prove that something is taught well."""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__)); GAME = os.path.join(HERE, '../../../../game/content')
C = lambda *p: json.load(open(os.path.join(GAME, *p), encoding='utf-8'))
# ---- the script: subsection -> (title, printed page, key concepts)
S = [
 ('1.1', 'Introduction', 3, {'crystal vs. liquid, long-range order': r'long-range order|amorphous|glass'}),
 ('1.2.1', 'Lattice definitions', 5, {'primitive cell / vectors': r'primitive (unit )?(cell|vector)', 'basis': r'\bbasis\b', 'unit cell': r'unit cell'}),
 ('1.2.2', 'Crystallographic symmetries', 7, {'rotation axes (1,2,3,4,6)': r'rotation ax|rotational symmetry|[2346]-fold', 'inversion': r'inversion'}),
 ('1.2.3', 'Types of lattices (Bravais)', 8, {'Bravais lattices': r'bravais', 'BCC / FCC': r'\bbcc\b|\bfcc\b|body.cent|face.cent', 'hexagonal / HCP': r'hexagonal|\bhcp\b'}),
 ('1.3.1', 'Reciprocal lattice: definition', 11, {'reciprocal lattice': r'reciprocal lattice', 'a_i·b_j = 2πδ_ij': r'2\\pi\\delta|2πδ|\\cdot\\mathbf a|a_i\\cdot|\\vec g_i\\cdot|\\mathbf b_1=2\\pi|=2\\pi\\frac'}),
 ('1.3.2', 'Crystallographic planes', 12, {'Miller indices': r'miller|\bhkl\b|\(hkl\)', 'plane spacing d_hkl': r'd_\{?hkl|d_\{?\d\d\d|plane spacing|distance between (neighbouring |adjacent )?(\(hkl\) )?planes'}),
 ('1.3.3', 'Brillouin zones', 13, {'Brillouin zone': r'brillouin zone', 'Wigner–Seitz cell': r'wigner'}),
 ('1.5.1', 'Scattering', 15, {'scattering vector q = k′ − k': r'scattering vector|momentum transfer|k\^\\prime-|k\'-|\\mathbf k\^\\prime-\\mathbf k', 'form factor / scattering length': r'form factor|scattering length'}),
 ('1.5.2', 'Scattering by a periodic structure', 17, {'Laue condition': r'laue', 'Bragg law': r'bragg', 'structure factor': r'structure factor'}),
 ('1.5.3', 'The role of symmetry', 19, {'Friedel’s law': r'friedel', 'systematic absences': r'absen|extinction|missing peak|peaks are missing'}),
 ('1.5.4', 'Diffraction experiments', 20, {'X-rays vs neutrons': r'neutron', 'powder method': r'powder', 'Ewald sphere': r'ewald'}),
 ('1.5.5–6', 'Direct and Laue geometry', 22, {'single-crystal / Laue geometry': r'laue (geometry|method|pattern|photograph)|white beam|polychromatic|rotat\w* the (sample|crystal)|single crystal'}),
 ('1.6.1', 'Van der Waals bonding', 24, {'van der Waals / fluctuating dipoles': r'van der waals|fluctuating dipole|polarizab|polarisab'}),
 ('1.6.2', 'Repulsion, Lennard-Jones', 25, {'Lennard-Jones potential': r'lennard', 'noble-gas crystals': r'noble.gas|argon|krypton|rare.gas'}),
 ('1.6.3', 'Ionic crystals', 27, {'Madelung constant': r'madelung', 'ionic crystal / NaCl': r'ionic|nacl'}),
 ('1.6.4', 'Covalent crystals', 29, {'covalent bond': r'covalent', 'bonding / antibonding orbitals': r'antibonding|anti-bonding', 'H2+ / LCAO / hybrids': r'h_2\^\+|h2\+|lcao|hybrid|sp\^?\{?[23]'}),
 ('1.6.5', 'Hydrogen bond', 36, {'hydrogen bond': r'hydrogen bond'}),
 ('1.6.6', 'Metallic crystals', 36, {'metallic bond': r'metallic bond'}),
 ('2.1.1', 'Dulong–Petit', 38, {'Dulong–Petit': r'dulong'}),
 ('2.1.2', 'Einstein’s solid', 38, {'Einstein model': r'einstein (model|solid|temperature|function)|\\theta_e|\\omega_e'}),
 ('2.2.1–3', 'Normal modes, equation of motion', 41, {'equation of motion / normal modes': r'normal mode|equation of motion', 'phonon dispersion ω(k)': r'dispersion'}),
 ('2.2.4', 'Role of the Brillouin zone', 44, {'k restricted to the 1st BZ, N modes': r'first brillouin zone|1st brillouin|n modes|folded|periodic boundary'}),
 ('2.2.5', 'Diatomic chain', 45, {'diatomic chain': r'diatomic', 'acoustic and optical branches': r'optical (branch|mode|phonon)'}),
 ('2.3.1–2', 'Phonons, inelastic scattering', 50, {'phonon as quasiparticle': r'phonon', 'crystal momentum / Umklapp': r'quasi.?momentum|crystal momentum|umklapp', 'inelastic scattering': r'inelastic'}),
 ('2.3.3', 'Anharmonic lattice', 55, {'anharmonicity (decay, expansion)': r'anharmonic'}),
 ('2.3.4', 'Inelastic scattering techniques', 57, {'triple-axis / monochromator': r'triple.axis|monochromat|analy[sz]er'}),
 ('2.4.1', 'How many phonons?', 59, {'Bose–Einstein occupation': r'bose|planck distribution|n_b'}),
 ('2.4.2', 'Phonon density of states, Debye', 60, {'Debye model': r'debye', 'phonon density of states': r'density of states'}),
 ('2.4.3', 'Specific heat (T³)', 63, {'T³ law / Debye temperature': r't\^3|t\^\{3\}|debye temperature|\\theta_d|t_d'}),
 ('3.1.1–2', 'Electron in a box, DoS', 66, {'free electrons in a box': r'free.electron|electron in a box|particle in a box', 'electronic density of states': r'd\(e\)|g\(\\epsilon|g\(e\)|\\nu\(\\epsilon|density of states'}),
 ('3.1.3', 'Fermi–Dirac, Fermi energy', 68, {'Fermi–Dirac distribution': r'fermi.dirac', 'Fermi energy / k_F': r'fermi energy|k_f|\\epsilon_f|e_f', 'chemical potential': r'chemical potential|\\mu\(t\)|\\mu=\\epsilon_f|\\mu\\approx'}),
 ('3.1.4', 'Electronic specific heat', 73, {'C_el ∝ T': r'\\gamma t|propto t\b|linear in t|electronic (specific )?heat|c_\{?\\?(el|e)\b'}),
 ('3.1.5', 'Interactions', 75, {'electron–electron interactions': r'electron.electron|fermi liquid'}),
 ('3.2.1', 'Bloch’s theorem', 77, {'Bloch theorem / Bloch waves': r'bloch'}),
 ('3.2.2', 'Nearly free electrons', 79, {'nearly free electron model': r'nearly.free', 'gap at the zone boundary': r'gap'}),
 ('3.2.3', 'Tight binding', 82, {'tight-binding model': r'tight.binding', 'hopping t': r'hopping|overlap integral|overlap of'}),
 ('3.2.4', 'Many electrons: metals vs insulators', 84, {'band filling: metal / insulator': r'insulator|filled band|half.filled|band filling'}),
 ('3.3', 'Quasiparticles', 88, {'quasiparticles, quasielectrons/holes': r'quasi.?particle|quasi.?electron|quasi.?hole'}),
 ('3.4', 'ARPES', 91, {'photoemission (ARPES)': r'arpes|photoemission'}),
 ('4.1.1', 'Drude conductivity', 93, {'Drude model': r'drude', 'relaxation time / mobility': r'mobility|relaxation time|scattering time'}),
 ('4.1.2', 'Hall effect', 94, {'Hall effect / coefficient': r'hall'}),
 ('4.2.1–2', 'Wave packets, effective mass', 95, {'group velocity / wave packet': r'group velocity|wave packet', 'effective mass': r'effective mass|m\^\*'}),
 ('4.2.3', 'Band electrons in a field (holes)', 98, {'ħk̇ = force, filled bands carry no current, holes': r'\\hbar\\dot|\\hbar\s*\\dot|filled band|\bholes?\b'}),
 ('4.2.4', 'Conductivity of band electrons', 101, {'shifted Fermi sphere': r'shifted fermi|displaced fermi|fermi (sphere|sea) (is )?(shifted|displaced)'}),
 ('4.2.5', 'Relaxation: what scatters', 102, {'ρ(T): T, T⁵, residual, Matthiessen': r'matthiessen|residual resistiv|t\^5|t\^\{5\}|bloch.gr'}),
 ('4.3', 'Thermal conductivity', 106, {'thermal conductivity': r'thermal conductiv|heat conduct|thermal current', 'Wiedemann–Franz': r'wiedemann|lorenz'}),
 ('4.4', 'Screening', 111, {'Thomas–Fermi screening': r'screening|thomas.fermi'}),
 ('5.1', 'Semiconductors: gap, materials', 113, {'band gap, direct / indirect': r'direct gap|indirect|band gap', 'Si / GaAs, heavy and light holes': r'gaas|silicon|heavy.hole|light.hole'}),
 ('5.1.3', 'Cyclotron resonance', 117, {'cyclotron resonance': r'cyclotron'}),
 ('5.2', 'Intrinsic carriers, mobility', 119, {'intrinsic carrier density, n·p': r'intrinsic', 'mobility in semiconductors': r'mobility'}),
 ('5.3', 'Doped semiconductors', 123, {'donors / acceptors (hydrogen-like)': r'donor|acceptor', 'freeze-out, saturation regimes': r'freeze|saturation regime|extrinsic|ionized donors|ionised donors'}),
 ('5.4.1–3', 'p–n junction, depletion layer', 128, {'p–n junction, built-in voltage': r'p.n junction|built.in|contact potential', 'depletion layer': r'depletion'}),
 ('5.4.4', 'Rectification', 132, {'diode current, forward / reverse bias': r'rectif|diode|forward bias|reverse bias|shockley'}),
 ('5.4.5', 'Devices (LED, solar cell)', 133, {'LED / solar cell / transistor': r'\bled\b|solar cell|photovolta|transistor'}),
 ('6.1', 'Classical magnetism', 136, {'susceptibility, magnetization': r'susceptib|magnetization|magnetisation'}),
 ('6.2.1', 'Paramagnetism of atoms (Curie)', 137, {'Curie law': r'curie'}),
 ('6.2.2', 'Pauli paramagnetism', 138, {'Pauli paramagnetism': r'pauli (para|suscep)'}),
 ('6.2.3', 'Landau diamagnetism', 140, {'Landau diamagnetism': r'landau'}),
 ('6.2.5', 'Metallic ferromagnetism (Stoner)', 141, {'Stoner criterion / itinerant ferromagnetism': r'stoner|itinerant'}),
 ('6.3.1', 'Exchange interactions', 146, {'exchange, Heisenberg model': r'exchange|heisenberg', 'Hund’s rules': r'hund'}),
 ('6.3.2–4', 'Mean field, ferromagnets', 150, {'mean field / Weiss field': r'mean.field|weiss', 'Curie–Weiss, T_C': r'curie.weiss|t_c\b|t_\{?c\}?'}),
 ('6.3.5', 'Antiferromagnets', 156, {'antiferromagnet, Néel, sublattices': r'antiferro|n[ée]el|sublattice'}),
]
# ---- the game: every solid-state encounter, its kind and all its text
idx = C('solid-state', 'index.json'); encs = []
for r in idx['rooms']:
    for e in C('solid-state', r + '.json')['encounters']: encs.append((r, e))
for f in idx.get('extras', []):
    x = C('solid-state', f)
    for it in x.get('items', []): encs.append((it['room'], it['enc']))
    for sh in x.get('sheets', []):
        for q in sh['questions']: encs.append((q['room'], q['enc']))
for l in C('labs-solid-state.json')['labs']: encs.append((l['room'].split('/')[1], l['enc']))
def text(o): return ' '.join(text(v) for v in o.values()) if isinstance(o, dict) else ' '.join(text(v) for v in o) if isinstance(o, list) else str(o) if isinstance(o, str) else ''
def kind(e): return 'theory' if e['type'] == 'lesson' else 'quiz' if e['type'] == 'quiz' else 'sheet' if e.get('sheet') else 'exercise'
items = [(r, e, kind(e), text(e).lower()) for r, e in encs]
rows = []
for sec, title, page, concepts in S:
    cs = []
    for name, pat in concepts.items():
        rx = re.compile(pat, re.I); hit = {'theory': [], 'quiz': [], 'exercise': [], 'sheet': []}
        for r, e, k, t in items:
            if rx.search(t): hit[k].append(e['id'])
        cs.append({'concept': name, **{k: len(v) for k, v in hit.items()}, 'ids': {k: v[:6] for k, v in hit.items()}})
    th = all(c['theory'] for c in cs); pr = all(c['exercise'] + c['sheet'] + c['quiz'] for c in cs); some = any(c['theory'] + c['exercise'] + c['sheet'] + c['quiz'] for c in cs)
    status = 'covered' if th and pr else 'thin' if some else 'missing'
    rows.append({'section': sec, 'title': title, 'page': page, 'status': status, 'concepts': cs})
json.dump({'about': 'Script-2026 subsections against the game content; generated by notes/solid-state/build/coverage/coverage.py', 'rows': rows}, open(os.path.join(GAME, 'solid-state', 'coverage.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
mark = {'covered': '✅', 'thin': '🟡', 'missing': '❌'}
n = {k: sum(r['status'] == k for r in rows) for k in mark}
md = [f'# Solid state: script coverage map', '', f'Generated by `notes/solid-state/build/coverage/coverage.py` from `Script-2026` (Degen) and the game content. For each script',
      'subsection a few key concepts are searched in every solid-state lesson (theory), quiz, exercise (calculation, derivation, exam problem, experiment) and sheet question.',
      '✅ every concept has a lesson **and** practice · 🟡 some concepts missing, or no lesson, or no practice · ❌ nothing in the game.',
      'A mention is not a lesson: this map finds gaps; it does not prove that a topic is taught well.', '',
      f"**{n['covered']} covered, {n['thin']} thin, {n['missing']} missing** of {len(rows)} subsections.", '',
      '| § | Topic | p. | | Concept | Lessons | Quizzes | Exercises | Sheet Qs |', '|---|---|---|---|---|---|---|---|---|']
for r in rows:
    for i, c in enumerate(r['concepts']):
        md.append(f"| {r['section'] if i == 0 else ''} | {r['title'] if i == 0 else ''} | {r['page'] if i == 0 else ''} | {mark[r['status']] if i == 0 else ''} | {c['concept']} | {c['theory'] or '–'} | {c['quiz'] or '–'} | {c['exercise'] or '–'} | {c['sheet'] or '–'} |")
open(os.path.join(HERE, '../../coverage.md'), 'w', encoding='utf-8').write('\n'.join(md) + '\n')
print(n)
for r in rows:
    if r['status'] != 'covered':
        miss = [f"{c['concept']}: " + ('no lesson' if not c['theory'] else '') + (' no practice' if not (c['exercise'] + c['sheet'] + c['quiz']) else '') for c in r['concepts'] if not c['theory'] or not (c['exercise'] + c['sheet'] + c['quiz'])]
        print(f"{mark[r['status']]} {r['section']:8} {r['title'][:38]:38} | " + '; '.join(miss))
