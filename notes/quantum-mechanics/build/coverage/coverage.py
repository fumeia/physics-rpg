r"""Coverage map: every section of the QM25 script (Gaberdiel, chapters 1-11) against the game's QM content: rooms, exercise
sheets, experiments, the Derivations screen and the Forge. Key concepts are regular expressions in English and German (the script
is German, the game mostly English). Writes notes/quantum-mechanics/coverage.md and game/content/qm/coverage.json.
Run: python3 coverage.py. A mention is not a lesson: this finds gaps, it does not prove depth."""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__)); GAME = os.path.join(HERE, '../../../../game/content')
C = lambda *p: json.load(open(os.path.join(GAME, *p), encoding='utf-8'))
S = [
 ('1.1', 'Planck’s radiation law', 5, {'Planck / blackbody': r'planck|blackbody|black.body|hohlraum|schwarzk|rayleigh'}),
 ('1.2', 'Bohr’s quantum hypothesis', 8, {'Bohr model': r'bohr (model|atom|orbit|radius)|bohr.sche|bohrs'}),
 ('1.3', 'Bohr–Sommerfeld quantisation', 10, {'Bohr–Sommerfeld': r'sommerfeld|\\oint'}),
 ('1.4', 'Photoelectric and Compton effect', 12, {'photoelectric / Compton': r'photoelectric|photoeffekt|compton'}),
 ('1.5', 'de Broglie waves', 13, {'de Broglie': r'broglie'}),
 ('2.1', 'Schrödinger equation', 14, {'time-dependent Schrödinger equation': r'schr(ö|o|\\"o)dinger.(equation|gleichung)|i\\hbar\s*\\partial_t|i\\hbar\\,\\partial_t|i\\hbar\\partial_t'}),
 ('2.2', 'Probability current, continuity', 16, {'probability current / continuity equation': r'probability current|continuity equation|kontinuit|wahrscheinlichkeitsstrom'}),
 ('2.3', 'Ehrenfest theorem', 17, {'Ehrenfest': r'ehrenfest'}),
 ('2.4', 'Reality of observables', 19, {'Hermitian operators, real expectation values': r'hermitian|hermitesch|self.adjoint|selbstadjungiert'}),
 ('2.5–2.6', 'Stationary states, energy eigenstates', 19, {'time-independent equation / stationary states': r'stationary|time.independent|zeitunabh|station(ä|a)r', 'superposition of energy eigenstates': r'superposition'}),
 ('2.7', 'Energy measurement', 22, {'measurement probabilities |c_n|²': r'\|c_n\|\^2|\|c_n\|\^\{2\}|born rule|measurement probabilit|probability to (find|measure)'}),
 ('3.1', 'Particle in a box', 26, {'infinite well': r'infinite (square )?well|\bbox\b|kasten'}),
 ('3.2', 'Particle in a well', 28, {'finite well, bound states': r'finite (square )?well|potential well|potentialtopf|\btopf'}),
 ('3.3', 'Step potential', 31, {'step potential, reflection': r'step potential|potential step|stufen'}),
 ('3.4', 'Normalisation and wave packets', 33, {'wave packets': r'wave.?packet|wellenpaket', 'Gaussian packet spreading': r'gaussian|gauss|spread'}),
 ('3.5', 'Well: positive energies, tunnelling, resonances', 36, {'transmission / tunnelling': r'tunnel|transmission', 'resonances': r'resonan'}),
 ('4.1–4.3', 'Hilbert space, L², separability', 41, {'Hilbert space / inner product': r'hilbert|inner product|skalarprodukt|scalar product', 'orthonormal basis, completeness': r'orthonormal|complete(ness)?\b|vollst(ä|a)ndig'}),
 ('4.4', 'Operators and observables', 44, {'operators, eigenvalues': r'eigenvalue|eigenwert', 'observables': r'observable|observabl'}),
 ('4.5', 'Measurements, expectation values, Dirac notation', 46, {'Dirac notation': r'\\langle|\\rangle|\bket\b|\bbra\b|dirac notation', 'expectation value': r'expectation value|erwartungswert'}),
 ('4.6', 'Continuous spectra (∞-dimensional)', 48, {'continuous spectrum, delta normalisation': r'continuous spectrum|kontinuierlich|delta.normali[sz]|\\delta\(x-x|\\delta\(p-p'}),
 ('4.7', 'Other representations', 50, {'momentum representation': r'momentum (space|representation)|impulsraum|impulsdarstellung|fourier'}),
 ('5.1', 'Non-commuting observables', 52, {'commutators, compatible observables': r'commutator|kommutator|commut|simultaneous eigen'}),
 ('5.2–5.3', 'Uncertainty and the Heisenberg relation', 55, {'uncertainty relation': r'uncertainty|unsch(ä|a)rfe|robertson'}),
 ('6.1.1', 'Oscillator: conventional solution', 60, {'Hermite polynomials / series': r'hermite|power series|potenzreihe'}),
 ('6.1.2', 'Oscillator: ladder operators', 61, {'ladder operators': r'ladder|leiteroperator|creation|annihilation|a\^\\dagger|a\^\{\\dagger\}'}),
 ('6.2', 'Classical limit', 64, {'coherent states / classical limit': r'coherent|koh(ä|a)rent|classical limit|klassischer limes'}),
 ('7.1', 'Unitary representations of symmetries', 66, {'unitary symmetry operators': r'unitary|unit(ä|a)r'}),
 ('7.2', 'SO(3) and its Lie algebra', 67, {'rotation group, generators': r'so\(3\)|rotation group|drehgruppe|generator|lie algebra|lie.algebra'}),
 ('7.3–7.4', 'Irreducible representations of so(3)', 70, {'irreducible representations': r'irreducible|irreduzib', 'spectrum j(j+1), m = −j..j': r'j\(j\+1\)|l\(l\+1\)'}),
 ('7.5–7.6', 'SO(3) vs SU(2), projective representations', 75, {'SU(2), spinors, 4π': r'su\(2\)|spinor|4\\pi|projective|projektiv'}),
 ('7.7', 'Spin of the electron', 78, {'spin ½, Pauli matrices, Stern–Gerlach': r'pauli matri|stern.gerlach|\\sigma_[xyz]'}),
 ('7.8', 'Wigner’s theorem', 80, {'Wigner’s theorem': r'wigner'}),
 ('8.1', 'Relative coordinates', 82, {'reduced mass, centre of mass': r'reduced mass|reduzierte masse|centre of mass|center of mass|schwerpunkt|relative coordinate'}),
 ('8.2', 'Coulomb potential, radial equation', 84, {'radial equation, centrifugal term': r'radial equation|radialgleichung|centrifugal|zentrifugal|effective potential', 'behaviour at r→0 and r→∞, series ends': r'r\^\{?l\+1|r\^\{l\}|terminat|abbrech|laguerre|asymptot'}),
 ('8.3', 'Dynamical symmetry (Runge–Lenz, so(4))', 88, {'Runge–Lenz vector, so(4), n² degeneracy': r'runge|lenz|so\(4\)|accidental|zuf(ä|a)llig'}),
 ('9.1', 'Tensor products', 93, {'tensor product': r'tensor product|tensorprodukt|\\otimes'}),
 ('9.2–9.4', 'Addition of angular momenta, Clebsch–Gordan series', 94, {'j = |j1−j2| … j1+j2': r'j_1\+j_2|j_1-j_2|\|j_1|addition of angular|drehimpulsaddition|\\oplus', 'singlet and triplet': r'singlet|triplet|singulett|triplett'}),
 ('9.5', 'Clebsch–Gordan coefficients', 99, {'Clebsch–Gordan coefficients': r'clebsch'}),
 ('9.6', 'Magnetic moment', 102, {'magnetic moment, Bohr magneton, g-factor': r'magnetic moment|magnetisches moment|magneton|g.factor|land(é|e)'}),
 ('9.7', 'Anomalous Zeeman effect, spin–orbit coupling', 105, {'Zeeman effect': r'zeeman', 'spin–orbit coupling': r'spin.orbit|spin.bahn|\\mathbf l\\cdot\\mathbf s|l\\cdot s|fine structure|feinstruktur'}),
 ('10.1', 'EPR paradox', 108, {'EPR, entanglement': r'\bepr\b|einstein.podolsky|entangle|verschr(ä|a)nk'}),
 ('10.2', 'Bell inequality', 109, {'Bell / CHSH': r'\bbell\b|chsh'}),
 ('10.3', 'Quantum teleportation', 111, {'teleportation': r'teleport'}),
 ('11.1', 'Non-degenerate perturbation theory', 114, {'first and second order corrections': r'perturbation|st(ö|o)rungstheorie|first.order|second.order'}),
 ('11.1.1', 'Perturbed oscillator', 117, {'anharmonic / perturbed oscillator': r'anharmonic|x\^4|x\^3|perturbed (harmonic )?oscillator|gest(ö|o)rter'}),
 ('11.2', 'Degenerate perturbation theory', 118, {'degenerate perturbation theory': r'degenerate perturbation|degenerate level|entartete|secular|s(ä|a)kular'}),
 ('11.2.4', 'Stark effect', 123, {'Stark effect': r'stark'}),
 ('11.3.1', 'The propagator', 124, {'time evolution operator / propagator': r'propagator|time.evolution operator|zeitentwicklungsoperator|e\^\{-i\\hat h|e\^\{-i h'}),
 ('11.3.2', 'Heisenberg picture', 126, {'Heisenberg picture': r'heisenberg picture|heisenbergbild|heisenberg equation'}),
 ('11.3.3', 'Interaction picture', 128, {'interaction picture': r'interaction picture|wechselwirkungsbild|dirac picture'}),
 ('11.3.4', 'First-order time-dependent PT, golden rule', 129, {'transition amplitude / golden rule': r'golden rule|goldene regel|transition (rate|probability|amplitude)|(ü|u)bergang'}),
]
idx = C('qm', 'index.json'); encs = []
for r in idx['rooms']:
    for e in C('qm', r + '.json')['encounters']: encs.append((r, e))
for f in idx.get('extras', []):
    x = C('qm', f)
    for it in x.get('items', []): encs.append((it['room'], it['enc']))
    for sh in x.get('sheets', []):
        for q in sh['questions']: encs.append((q['room'], q['enc']))
for l in C('labs-qm.json')['labs']: encs.append((l['room'].split('/')[1], l['enc']))
for d in C('qm', 'derivations.json')['items']: encs.append((d['room'], {'type': 'derivation', 'id': 'deriv:' + d['id'], **d}))
for f in C('qm', 'forge.json')['items']: encs.append(('forge', {'type': 'forge', 'id': 'forge:' + f['id'], **f}))
def text(o): return ' '.join(text(v) for v in o.values()) if isinstance(o, dict) else ' '.join(text(v) for v in o) if isinstance(o, list) else o if isinstance(o, str) else ''
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
    rows.append({'section': sec, 'title': title, 'page': page, 'status': 'covered' if th and pr else 'thin' if some else 'missing', 'concepts': cs})
json.dump({'about': 'QM25 script sections against the game content; generated by notes/quantum-mechanics/build/coverage/coverage.py', 'rows': rows}, open(os.path.join(GAME, 'qm', 'coverage.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
mark = {'covered': '✅', 'thin': '🟡', 'missing': '❌'}; n = {k: sum(r['status'] == k for r in rows) for k in mark}
md = ['# QM: script coverage map', '', 'Generated by `notes/quantum-mechanics/build/coverage/coverage.py` from the QM25 script (Gaberdiel, chapters 1–11) and the game',
      'content (rooms, exercise sheets, experiments, the Derivations screen, the Forge). Concepts are searched in English and German.',
      '✅ every concept has a lesson **and** practice · 🟡 some concept lacks a lesson or practice · ❌ nothing in the game.',
      'A mention is not a lesson: this map finds gaps; it does not prove that a topic is taught well.', '',
      f"**{n['covered']} covered, {n['thin']} thin, {n['missing']} missing** of {len(rows)} sections.", '',
      '| § | Topic | p. | | Concept | Lessons | Quizzes | Exercises | Sheet Qs |', '|---|---|---|---|---|---|---|---|---|']
for r in rows:
    for i, c in enumerate(r['concepts']):
        md.append(f"| {r['section'] if i == 0 else ''} | {r['title'] if i == 0 else ''} | {r['page'] if i == 0 else ''} | {mark[r['status']] if i == 0 else ''} | {c['concept']} | {c['theory'] or '–'} | {c['quiz'] or '–'} | {c['exercise'] or '–'} | {c['sheet'] or '–'} |")
open(os.path.join(HERE, '../../coverage.md'), 'w', encoding='utf-8').write('\n'.join(md) + '\n')
print(n)
for r in rows:
    if r['status'] != 'covered':
        miss = [c['concept'] + ': ' + ' '.join(x for x, ok in (('no lesson', c['theory']), ('no practice', c['exercise'] + c['sheet'] + c['quiz'])) if not ok) for c in r['concepts'] if not c['theory'] or not (c['exercise'] + c['sheet'] + c['quiz'])]
        print(f"{mark[r['status']]} {r['section']:8} {r['title'][:44]:44} | " + '; '.join(miss))
