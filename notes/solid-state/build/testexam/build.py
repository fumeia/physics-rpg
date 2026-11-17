"""ISSP Test Exam HS26 (Degen, 10./11. Nov 2026; 19 points) as game content: the best signal of the real exam's style.
Read visually from the scanned PDF (release asset ISSP.zip, "ISSP Test Exam HS26.pdf", 11 pages; no text layer).
No official solution was released with it: the solutions below are our own, numbers checked with python (see CHECK).

Writes game/content/solid-state/test-exam.json (extras): Problem 1 (MC, 4 pt) as a quiz, Problems 2 (FCC, 10 pt) and
3 (silver, 5 pt) as bosses with step reveals in keyPoints. Run: python3 build.py"""
import json, math, os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '../../../../game/content/solid-state/test-exam.json')
SRC = 'ISSP Test Exam HS26.pdf (release ISSP.zip)'

# ---- CHECK: silver, free electrons (rho = 10.5 g/cm^3, A = 107.8 g/mol, one valence electron)
NA, hbar, me, e, kB = 6.02214076e23, 1.054571817e-34, 9.1093837015e-31, 1.602176634e-19, 1.380649e-23
n = 10.5e3 * NA / 107.8e-3
kF = (3 * math.pi ** 2 * n) ** (1 / 3)
EF = hbar ** 2 * kF ** 2 / (2 * me)
assert abs(n - 5.866e28) / 5.866e28 < 1e-3 and abs(kF * 1e-10 - 1.20) < 0.01 and abs(EF / e - 5.51) < 0.02
# ---- CHECK: Miller plane of 1(a): points (0,0,0), (0,1,1/2), (1/3,1,0) -> normal ∝ (3,-1,2)
u, v = (0, 1, .5), (1 / 3, 1, 0)
nrm = (u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0])
assert all(abs(a * -6 - b) < 1e-9 for a, b in zip(nrm, (3, -1, 2)))
# ---- CHECK: FCC structure factor
def F(h, k, l): return abs(sum(complex(math.cos(math.pi * (h * x + k * y + l * z)), math.sin(math.pi * (h * x + k * y + l * z))) for x, y, z in [(0, 0, 0), (1, 1, 0), (1, 0, 1), (0, 1, 1)]))
assert round(F(1, 1, 1)) == 4 and round(F(2, 0, 0)) == 4 and round(F(1, 0, 0)) == 0 and round(F(2, 1, 0)) == 0 and round(F(2, 2, 0)) == 4

quiz = {'type': 'quiz', 'id': 'ss-tx-Q1', 'xp': 20, 'title': 'Test exam HS26, Problem 1: multiple choice (4 pt)',
        'source': {'file': SRC, 'where': 'Problem 1 (a)-(d), pages 2-3; solutions our own (no official key released)'},
        'questions': [
            {'q': r'(a) What is the Miller index of the shaded lattice plane? (Axes: $x$ towards you, $y$ to the right, $z$ up; the plane passes through the hidden back-bottom-left corner, cuts the back-right vertical edge at $\frac12$ and the bottom-right edge at $\frac13$ from the back.)<br><img class="fig" src="content/solid-state/fig/testexam-miller.png" alt="Unit cube with a shaded triangular plane through the hidden corner, the back-right vertical edge at height 1/2 and the bottom-right edge at 1/3">',
             'options': [r'$(1,2,3)$', r'$(3,2,6)$', r'$(\bar3,\bar2,1)$', r'$(3,\bar1,2)$'], 'correct': 3,
             'explain': r'The plane contains the origin, so shift it to $(0,1,0)$: intercepts $x=\frac13$, $y=-1$, $z=\frac12$. Reciprocals $(3,-1,2)$. Check: the normal of the plane through $(0,0,0),(0,1,\frac12),(\frac13,1,0)$ is $\propto(3,-1,2)$.'},
            {'q': r'(b) Normal modes of a diatomic linear chain (heavy atoms large, light atoms small): (a) nothing moves relative to anything (uniform translation, $k=0$); (b) heavy and light neighbours move against each other in every cell; (c) only the light atoms move, alternately, heavy ones at rest; (d) only the heavy atoms move, alternately, light ones at rest. Order by frequency.',
             'options': [r'$\omega_a<\omega_d<\omega_c<\omega_b$', r'$\omega_a<\omega_c=\omega_d<\omega_b$', r'$\omega_a<\omega_c<\omega_d<\omega_b$', r'$\omega_a<\omega_b<\omega_c<\omega_d$'], 'correct': 0,
             'explain': r'(a) acoustic at $k=0$: $\omega=0$. (d) acoustic at the zone boundary: $\sqrt{2C/M}$. (c) optical at the zone boundary: $\sqrt{2C/m}$, larger since $m<M$. (b) optical at $k=0$: $\sqrt{2C(1/m+1/M)}$, the maximum.'},
            {'q': r'(c) Graphene (honeycomb lattice of carbon). Which statement about its phonon dispersion is correct?',
             'options': [r'Graphene only possesses acoustic phonons.', r'The phonon branches are degenerate because of the hexagonal symmetry.', r'Graphene possesses both acoustic and optical phonons.', r'Being 2D, it has only two acoustic branches instead of three.'], 'correct': 2,
             'explain': r'The honeycomb is a triangular Bravais lattice with a 2-atom basis: $3\cdot2=6$ branches, 3 acoustic (LA, TA and the out-of-plane flexural ZA) and 3 optical. Atoms move in 3D, so there are still three acoustic branches.'},
            {'q': r'(d) In the tight-binding model, the energy bands...',
             'options': [r'...always overlap.', r'...cannot overlap.', r'...increase in width with increasing energy.', r'...decrease in width with increasing energy.'], 'correct': 2,
             'explain': r'Bandwidth $\propto$ overlap integral. Higher atomic levels have more extended orbitals, so neighbouring orbitals overlap more and the bands get wider (and may then overlap; low-lying core bands are nearly flat).'},
        ]}

fcc = {'type': 'boss', 'id': 'ss-tx-b2', 'xp': 100, 'minutes': 25,
       'title': 'Test exam boss: crystallography of the FCC lattice (10 pt)',
       'source': {'file': SRC, 'where': 'Problem 2 (a)-(d), pages 4-7; solutions our own (no official key released)'},
       'instructions': 'Solve on paper under the timer (the test exam had about 1 point per 3 minutes). Then enter the numbers.',
       'statement': [
           r'FCC unit cell (cube of side $a$, atoms at the corners and face centres).',
           r'(a) (1 pt) Starting from a simple cubic Bravais lattice with side $a$, write the 4-point basis that generates FCC.',
           r'(b) (3 pt) The structure factor is $F(\mathbf q)=\sum_jf_j(\mathbf q)\,e^{i\mathbf q\cdot\mathbf r_j}$. Find $F$ for the monatomic FCC crystal (form factor $f$) and the conditions on the Miller indices for an observable peak.',
           r'(c) (4 pt) TEM electron diffraction shows a projection of the reciprocal lattice onto the plane perpendicular to the beam. Beam along $\hat z$ (only $h,k$ non-zero). i. Sketch the pattern and label at least two spots. ii. Can this pattern alone tell FCC from BCC or simple cubic? iii. From which direction of incidence would you expect a hexagonal pattern?',
           r'(d) (2 pt) Small angles: find the interplanar spacing $d$ from the wavelength $\lambda$, the distance $R$ between direct and diffracted spot on the detector, and the camera length $L$. <i>Game numbers (not in the exam):</i> $\lambda=2.51$ pm (200 keV electrons), $L=1.00$ m, $R=12.0$ mm.'],
       'finalAnswers': [
           {'id': 'F111', 'prompt': r'(b) $|F|/f$ for the $(111)$ reflection.', 'answer': '4', 'vars': {}, 'tol': 0.01},
           {'id': 'F100', 'prompt': r'(b) $|F|/f$ for $(100)$.', 'answer': '0', 'vars': {}, 'tol': 0.01},
           {'id': 'F210', 'prompt': r'(b) $|F|/f$ for $(210)$.', 'answer': '0', 'vars': {}, 'tol': 0.01},
           {'id': 'r220', 'prompt': r'(c) In the $[001]$ pattern, distance of the $(220)$ spot from the centre divided by that of $(200)$.', 'answer': 'sqrt(2)', 'vars': {}, 'tol': 0.005},
           {'id': 'd', 'prompt': r'(d) $d$ in nm for the game numbers.', 'answer': 'lam*L/R*1e9', 'vars': {'lam': 2.51e-12, 'L': 1.0, 'R': 12.0e-3}, 'tol': 0.01},
       ],
       'keyPoints': [
           r'(a) Basis $\mathbf r_1=0$, $\mathbf r_2=\frac a2(1,1,0)$, $\mathbf r_3=\frac a2(1,0,1)$, $\mathbf r_4=\frac a2(0,1,1)$ on the simple cubic lattice $a(n_1,n_2,n_3)$.',
           r'(b) With $\mathbf q=\mathbf G_{hkl}=\frac{2\pi}a(h,k,l)$: $F=f\left[1+e^{i\pi(h+k)}+e^{i\pi(h+l)}+e^{i\pi(k+l)}\right]$. $F=4f$ if $h,k,l$ are all even or all odd, $F=0$ if mixed. First peaks: $(111),(200),(220),(311),(222)$.',
           r'(c) i. Beam along $z$: spots $(hk0)$ with $h,k$ both even (since $l=0$ is even): a square grid $(200),(020),(\bar200),(0\bar20)$ at distance $\frac{4\pi}a$ and $(220)$-type on the diagonals at $\sqrt2$ times that.',
           r'(c) ii. No: simple cubic [001] gives a square grid of $(100)$-type spots, BCC gives a square grid of $(110)$/$(200)$ spots rotated by $45^\circ$, FCC a square grid of $(200)$/$(220)$. All are square; without knowing $a$ (absolute spacing) they cannot be told apart from this one pattern.',
           r'(c) iii. Along a body diagonal, $[111]$: the reciprocal lattice points perpendicular to it ($(2\bar20)$, $(20\bar2)$, $(02\bar2)$, ...) form a triangular net with sixfold symmetry.',
           r'(d) $\tan2\theta=R/L\approx2\theta$ and Bragg $\lambda=2d\sin\theta\approx2d\theta$: $d=\frac{\lambda L}{R}$. Game numbers: $d=2.51\,{\rm pm}\cdot1\,{\rm m}/12\,{\rm mm}=0.209$ nm.',
       ]}

ag = {'type': 'boss', 'id': 'ss-tx-b3', 'xp': 80, 'minutes': 15,
      'title': 'Test exam boss: electronic and thermal properties of silver (5 pt)',
      'source': {'file': SRC, 'where': 'Problem 3 (a)-(d), pages 8-11; solutions our own (no official key released), numbers checked in build.py'},
      'instructions': 'Solve on paper under the timer (hand calculator only, as in the exam). Enter at least 3 significant digits.',
      'statement': [
           r'Silver: free-electron model (nearly spherical Fermi surface), one valence electron per atom, mass density $10.5\ {\rm g/cm^3}$, atomic mass $107.8$ u.',
           r'(a) (1 pt) Electron density of the valence electrons.',
           r'(b) (2 pt) Radius of the Fermi surface in $\text{Å}^{-1}$.',
           r'(c) (1 pt) Fermi energy and Fermi temperature (in K).',
           r'(d) (1 pt) The melting point is $T_m=1235$ K $\ll T_F$. Why is there no significant heat exchange from these &#8220;hot&#8221; electrons to the lattice?'],
      'finalAnswers': [
           {'id': 'n', 'prompt': r'(a) $n$ in $10^{28}\ {\rm m^{-3}}$.', 'answer': 'rho*NA/A/1e28', 'vars': {'rho': 10.5e3, 'NA': NA, 'A': 107.8e-3}, 'tol': 0.01},
           {'id': 'kF', 'prompt': r'(b) $k_F$ in $\text{Å}^{-1}$.', 'answer': '(3*pi**2*rho*NA/A)**(1/3)*1e-10', 'vars': {'rho': 10.5e3, 'NA': NA, 'A': 107.8e-3}, 'tol': 0.01},
           {'id': 'EF', 'prompt': r'(c) $E_F$ in eV.', 'answer': 'hb**2*(3*pi**2*rho*NA/A)**(2/3)/(2*m)/e', 'vars': {'rho': 10.5e3, 'NA': NA, 'A': 107.8e-3, 'hb': hbar, 'm': me, 'e': e}, 'tol': 0.015},
           {'id': 'TF', 'prompt': r'(c) $T_F$ in $10^4$ K.', 'answer': 'hb**2*(3*pi**2*rho*NA/A)**(2/3)/(2*m)/kB/1e4', 'vars': {'rho': 10.5e3, 'NA': NA, 'A': 107.8e-3, 'hb': hbar, 'm': me, 'kB': kB}, 'tol': 0.015},
      ],
      'keyPoints': [
           r'(a) $n=\frac{\rho N_A}{A}=\frac{10.5\,{\rm g\,cm^{-3}}\cdot6.022\times10^{23}}{107.8\,{\rm g}}=5.87\times10^{22}\ {\rm cm^{-3}}=5.87\times10^{28}\ {\rm m^{-3}}$ (one electron per atom).',
           r'(b) Two spin states per $k$-point: $n=\frac{k_F^3}{3\pi^2}$, so $k_F=(3\pi^2n)^{1/3}=1.20\times10^{10}\ {\rm m^{-1}}=1.20\ \text{Å}^{-1}$.',
           r'(c) $E_F=\frac{\hbar^2k_F^2}{2m}=5.5$ eV, $T_F=E_F/k_B=6.4\times10^4$ K.',
           r'(d) Pauli principle: an electron deep in the Fermi sea cannot lose energy, because all states below it are occupied. Only electrons within $\sim k_BT$ of $E_F$ can exchange energy with the lattice; the electron gas is in equilibrium at the lattice temperature $T$, not at $T_F$.',
           r'(d) Consequence: electronic heat capacity $C_e=\frac{\pi^2}2Nk_B\frac T{T_F}$, only about $T/T_F\approx2\%$ of the classical value even at the melting point.',
      ]}

out = {'about': 'ISSP Test Exam HS26 (Degen); built by notes/solid-state/build/testexam/build.py. Solutions are our own.',
       'items': [{'room': 'lattice-gate', 'enc': quiz}, {'room': 'lattice-gate', 'enc': fcc}, {'room': 'fermi-sea', 'enc': ag}]}
with open(OUT, 'w') as f: json.dump(out, f, ensure_ascii=False, indent=1)
print('n=%.4g kF=%.4g 1/A EF=%.4g eV TF=%.4g K' % (n, kF * 1e-10, EF / e, EF / kB), '->', os.path.relpath(OUT))
