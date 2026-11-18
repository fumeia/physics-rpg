# Where each derivation lives: script section, pages (table of contents of QM25) and equation numbers where they are known
# from the transcriptions; the guided-reading card that covers the section; the exercise-sheet question that does it.
# 'note' says it plainly when the script does not derive it. Executed by build.py; adds d['where'].
WHERE = {
    'ho-spectrum': dict(sec='6.1.2', pages='61–63', eqs='(6.14)–(6.33)', read='qm-read-06a', sheet='qm-sheet-s7q1'),
    'am-spectrum': dict(sec='7.4', pages='71–74', eqs='(7.37)–(7.51)', read='qm-read-07b', sheet='qm-sheet-s8q3'),
    'coherent': dict(sec='6.2', pages='64–65', read='qm-read-06b', sheet='qm-sheet-s7q2', note='The script only sketches the classical limit; the full derivation is sheet 7 Q2 (with the official solution).'),
    'box': dict(sec='3.1', pages='26–27', read='qm-read-03a', sheet='qm-sheet-s3q2'),
    'finite-well': dict(sec='3.2', pages='28–30', read='qm-read-03b'),
    'pt-nondeg': dict(sec='11.1', pages='114–117', read='qm-read-11a', sheet='qm-sheet-s14q1'),
    'spin-dot': dict(sec='9.3', pages='95–97', read='qm-read-09a'),
    'virial': dict(sec='2.3', pages='17–19', read='qm-read-02b', note='Not in the script. It uses the same idea as Ehrenfest (2.3): the time derivative of an expectation value vanishes in a stationary state.'),
    'heisenberg-ho': dict(sec='11.3.2', pages='126–128', read='qm-read-11c'),
    'cg-1-half': dict(sec='9.5', pages='99–101', read='qm-read-09b', sheet='qm-sheet-s12q3'),
    'delta': dict(sec='3.2–3.3', pages='28–32', read='qm-read-03b', sheet='qm-sheet-s4q1', note='The delta potential itself is not in the script; it is sheet 4 Q1 (with the official solution). The matching method is the one of 3.2-3.3.'),
    'radial': dict(sec='8.2', pages='84–87', read='qm-read-08a', sheet='qm-sheet-s10q1'),
    'robertson': dict(sec='5.3', pages='56–58', read='qm-read-05a'),
    'ehrenfest': dict(sec='2.3', pages='17–19', read='qm-read-02b', sheet='qm-sheet-s2q1'),
    'continuity': dict(sec='2.2', pages='16–17', read='qm-read-02b'),
    'spin-precession': dict(sec='7.5, 9.6', pages='75–77, 102–104', read='qm-read-07c', note='Not a named section: it combines the spin-1/2 rotation formula (7.5, script (7.60)) with the Zeeman Hamiltonian (9.6).'),
    'golden-rule': dict(sec='11.3.3–11.3.4', pages='128–132', eqs='(11.88)–(11.106)', read='qm-read-11c'),
    'variational': dict(sec='—', pages='', note='Not in the script. Old exams use it (HS14 D.5, HS25 Q2): the proof is one line, expand psi in energy eigenstates.'),
}
for d in DERIVS:
    if d['id'] in WHERE: d['where'] = WHERE[d['id']]
