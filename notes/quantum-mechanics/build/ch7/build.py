"""Chapter 7 (Symmetries) of QM I, derived from the script and the lecturer's chapter 7 reading pack (HS26).

Writes game/content/qm/ch7-reading.json:
  items     new lessons, derivations and a quiz for script 7.1-7.8 (closes coverage gaps 7.3-7.4, 7.6, 7.8)
  readings  which explainer of the lecturer's pack each encounter links to. The pack itself is NOT in git (it is the
            lecturer's material); deploy/ch7pack.py installs it on the server under game/private/ch7, and the game only
            shows the links when it finds it there.
Written in our own words; notation follows the script / pack (M_j generators with M_3|j,m> = m|j,m>, D_j, c(g,h)).
Run: python3 build.py
"""
import json, os

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '../../../../game/content/qm/ch7-reading.json')
SCRIPT = 'materials/quantum-mechanics/scripts/QM25.Kap1+2+3+4+5+6+7+8+9+10+11.pdf'
PACK = 'lecturer chapter 7 reading pack (HS26), explainer'
ROOM = 'angular-momentum-spin'


def src(where, *explainers):
    s = [{'file': SCRIPT, 'where': where}]
    for e in explainers: s.append({'file': 'game/private/ch7/concepts/' + e + '.html', 'where': PACK + ' (served by the game server, not in git)'})
    return s


def T(h): return {'kind': 'text', 'html': h}
def E(t, l=None): return {'kind': 'eq', 'tex': t, **({'label': l} if l else {})}
def C(kind, h): return {'kind': kind, 'html': h}
def K(q, opts, correct, explain): return {'q': q, 'options': opts, 'correct': correct, 'explain': explain}
def ST(p, r): return {'prompt': p, 'reveal': r}


L1 = {
    'type': 'lesson', 'tier': 'theory', 'minutes': 14, 'xp': 20, 'id': 'qm-sym-L1',
    'title': 'Symmetries as unitary representations: reducible and irreducible (7.1-7.4)',
    'source': src('Ch. 7.1-7.4', 'unitary-representations', 'reducible-irreducible', 'compact-groups', 'why-j-labels-representations'),
    'blocks': [
        T(r'A symmetry group $G$ must act on the Hilbert space $\mathcal H$ in a way that respects superposition (linear) and probabilities (scalar product): by unitary operators $U(g)$ that compose like the group elements.'),
        E(r'U(g_1)\,U(g_2)=U(g_1g_2),\qquad U(e)=\mathbb 1,\qquad U(g)^\dagger=U(g)^{-1}=U(g^{-1})', r'script Ch. 7.1: unitary representation'),
        T(r'<b>Invariant subspace.</b> $K\subset\mathcal H$ with $U(g)K\subset K$ for every $g$: the symmetry never leads out of $K$. The representation is <b>irreducible</b> if the only invariant subspaces are $\{0\}$ and $\mathcal H$, otherwise <b>reducible</b>.'),
        E(r'\psi\in K^\perp,\ \chi\in K:\quad \langle\chi|U(g)\psi\rangle=\langle U(g^{-1})\chi|\psi\rangle=0\ \Rightarrow\ U(g)K^\perp\subset K^\perp', r'script Ch. 7.3: unitarity makes the complement invariant'),
        T(r'So a unitary representation splits, $\mathcal H=K\oplus K^\perp$, with block diagonal $U(g)$; repeating gives a direct sum of irreducibles. For a compact group like SO(3) or SU(2) every finite-dimensional representation can be made unitary (average a scalar product over the group), and every irreducible one is finite-dimensional.'),
        T(r'<b>Which irreducibles exist?</b> Through $U(R(\vec e,\theta))=e^{-i\theta\,\vec e\cdot\vec M}$ each representation gives generators with $[M_j,M_k]=i\varepsilon_{jkl}M_l$. In an irreducible one, the ladder from the top state $M_+\psi_j=0$ spans everything:'),
        E(r'M_3|j,m\rangle=m|j,m\rangle,\quad M_\pm|j,m\rangle=\sqrt{j(j+1)-m(m\pm1)}\,|j,m\pm1\rangle,\quad m=-j,\dots,j', r'script Ch. 7.4: the irreducible representation $\mathcal D_j$, $\dim=2j+1$'),
        C('intuition', r'Irreducible representations are the prime numbers of the theory. Rotations mix the states $|j,m\rangle$ with the same $j$ among themselves but never mix different $j$: that is why $j$ is a good quantum number of every rotation-invariant Hamiltonian, and why each energy level of such an $H$ carries a whole $(2j+1)$-plet.'),
        C('pitfall', r'Complete reducibility needs unitarity. $(\mathbb R,+)$ acting on $\mathbb C^2$ by $U(t)=\begin{pmatrix}1&t\\0&1\end{pmatrix}$ is a representation with the invariant line $\mathrm{span}(e_1)$ but no invariant complement. Also: irreducible means no subspace is invariant under <i>all</i> $g$ at once; each single rotation does preserve its own axis.'),
        C('exam', r'Typical tasks: show $K^\perp$ is invariant (the one line above); state why $j$ labels the irreducibles; decompose a given representation (dimension count, $m$ multiplicities).'),
    ],
    'check': [
        K(r'Which property of $U(g)$ is used to show that $K^\perp$ is invariant when $K$ is?', [r'$U(g)^\dagger=U(g^{-1})$ (unitarity)', r'$U(g)$ is hermitian', r'$G$ is abelian', r'$\dim\mathcal H<\infty$'], 0,
          r'$\langle\chi|U(g)\psi\rangle=\langle U(g^{-1})\chi|\psi\rangle$ and $U(g^{-1})\chi\in K$. Unitary operators preserve orthogonality.'),
        K(r'$\dim\mathcal D_j$ is', [r'$2j+1$', r'$j(j+1)$', r'$2j$', r'$j+1$'], 0, r'$m$ runs from $-j$ to $j$ in integer steps.'),
        K(r'SO(3) acting on $\mathbb R^4$ by $D(R)=\begin{pmatrix}R&0\\0&1\end{pmatrix}$ is', [r'reducible: $\mathbb R^3\oplus\mathbb R$, i.e. $\mathcal D_1\oplus\mathcal D_0$', r'irreducible', r'not a representation', r'$\mathcal D_{3/2}$'], 0,
          r'The first three coordinates rotate among themselves, the fourth is left alone: two invariant subspaces.'),
    ],
}

L2 = {
    'type': 'lesson', 'tier': 'theory', 'minutes': 15, 'xp': 20, 'id': 'qm-sym-L2',
    'title': 'SO(3) versus SU(2), projective representations and spin (7.5-7.7)',
    'source': src('Ch. 7.5-7.7', 'so3-vs-su2', 'projective-representations', 'spin-of-electron'),
    'blocks': [
        T(r'Package a vector as a traceless hermitian matrix and let $g\in\mathrm{SU}(2)$ act by conjugation:'),
        E(r'\tilde x=x^j\sigma_j=\begin{pmatrix}x^3&x^1-ix^2\\x^1+ix^2&-x^3\end{pmatrix},\quad \det\tilde x=-\vec x\cdot\vec x,\quad \tilde x\mapsto g\tilde xg^\dagger', r'script Ch. 7.5'),
        T(r'$g\tilde xg^\dagger$ is again traceless hermitian with the same determinant, so it is a length-preserving linear map $R(g)$ of $\mathbb R^3$, in SO(3) because SU(2) is connected. $g$ and $-g$ give the same rotation and nothing else does: the kernel is $\{\pm\mathbb 1\}$ and'),
        E(r'\mathrm{SO}(3)\cong\mathrm{SU}(2)/\{\pm\mathbb 1\},\qquad e^{-i\varphi\sigma_3/2}\mapsto R(\vec e_3,\varphi),\qquad \varphi=2\pi:\ e^{-i\pi\sigma_3}=-\mathbb 1', 'double cover'),
        T(r'In $\mathcal D_j$ the rotation by $2\pi$ is $e^{-2\pi iM_3}=(-1)^{2j}\mathbb 1$. Integer $j$: honest representations of SO(3). Half-integer $j$: honest representations of SU(2) only; for SO(3) they hold <b>up to a sign</b>.'),
        T(r'<b>Projective representations (7.6).</b> States are rays, so a symmetry only has to compose up to a phase. Associativity of the operator product forces the cocycle condition:'),
        E(r'U(g_1)U(g_2)=c(g_1,g_2)\,U(g_1g_2),\quad |c|=1,\qquad c(g_1,g_2)\,c(g_1g_2,g_3)=c(g_2,g_3)\,c(g_1,g_2g_3)', r'script Ch. 7.6'),
        T(r'Re-phasing $\hat U(g)=c(g)U(g)$ of an honest representation gives the trivial cocycle $c(g,h)=\frac{c(g)c(h)}{c(gh)}$ (a coboundary), which can be removed again. A <b>genuine</b> cocycle cannot. Then the projective representation is an honest one of a covering group: for SO(3) the phases are $\pm1$ and the cover is SU(2).'),
        T(r'<b>Spin of the electron (7.7).</b> $\mathcal H=L^2(\mathbb R^3)\otimes\mathbb C^2$, rotations act on both factors, $U(R)=U_{\rm orb}(R)\otimes e^{-i\theta\,\vec e\cdot\vec\sigma/2}$, generated by $\vec J=\vec L+\vec S$, $\vec S=\frac\hbar2\vec\sigma$.'),
        C('intuition', r'One turn around a closed loop in SO(3) lifts to half a turn in SU(2), ending at $-\mathbb 1$; only a $4\pi$ turn closes. The sign is invisible in any probability, so physics allows it.'),
        C('pitfall', r'Half-integer $j$ never appear in orbital angular momentum: $Y_{lm}\propto e^{im\varphi}$ must be single-valued as a function on the sphere, so $m$ and hence $l$ are integers. Spin is not a function on the sphere; that is how $j=\frac12$ gets in.'),
        C('exam', r'Sheet 10 Q2 is the finite toy model: $\mathbb Z_2\times\mathbb Z_2$ with $\gamma(g)\gamma(h)=-\gamma(h)\gamma(g)$; the cocycle is genuine and the cover is $D_4$.'),
    ],
    'check': [
        K(r'What is the kernel of $\mathrm{SU}(2)\to\mathrm{SO}(3)$, $g\mapsto R(g)$?', [r'$\{\pm\mathbb 1\}$', r'$\{\mathbb 1\}$', r'$\mathrm U(1)$', r'$\{\mathbb 1,\,i\sigma_3\}$'], 0,
          r'$g\tilde xg^\dagger=\tilde x$ for all $\vec x$ means $g$ commutes with all $\sigma_j$, so $g=\lambda\mathbb 1$ with $\det g=\lambda^2=1$.'),
        K(r'$e^{-2\pi iM_3}$ in $\mathcal D_{3/2}$ equals', [r'$-\mathbb 1$', r'$\mathbb 1$', r'$e^{-3\pi i}M_3$', r'depends on $m$'], 0, r'$e^{-2\pi im}=-1$ for every half-integer $m$, so $(-1)^{2j}=-1$.'),
        K(r'When can the cocycle of a projective representation be removed by re-phasing $U(g)\to c(g)U(g)$?', [r'When $c(g,h)=\frac{c(g)c(h)}{c(gh)}$ for some phases $c(g)$', r'Always', r'Never', r'Only for abelian groups'], 0,
          r'That is a coboundary. For an abelian group with anticommuting images (sheet 10 Q2) it cannot be removed.'),
    ],
}

L3 = {
    'type': 'lesson', 'tier': 'theory', 'minutes': 12, 'xp': 20, 'id': 'qm-sym-L3',
    'title': "Wigner's theorem, Weyl's lemma and time reversal (7.8)",
    'source': src('Ch. 7.8', 'wigner-theorem', 'time-reversal'),
    'blocks': [
        T(r'What must a symmetry preserve? Only what can be measured: the transition probabilities between rays,'),
        E(r'P(\phi,\psi)=\frac{|\langle\phi|\psi\rangle|^2}{\langle\phi|\phi\rangle\,\langle\psi|\psi\rangle}', r'script Ch. 7.8'),
        T(r'<b>Wigner&#8217;s theorem.</b> A bijection of the rays that preserves all $P(\phi,\psi)$ is induced by an operator $U$ that is either <b>unitary</b> (linear, $\langle U\phi|U\psi\rangle=\langle\phi|\psi\rangle$) or <b>anti-unitary</b>; $U$ is unique up to a phase, which is where the cocycle of 7.6 comes from.'),
        E(r'\text{anti-unitary:}\quad U(\alpha\psi_1+\beta\psi_2)=\bar\alpha\,U\psi_1+\bar\beta\,U\psi_2,\qquad \langle U\phi|U\psi\rangle=\overline{\langle\phi|\psi\rangle}'),
        T(r'<b>Weyl&#8217;s lemma.</b> $U(g)^2$ is always unitary (two conjugations cancel), so $U(g^2)=c(g,g)^{-1}U(g)^2$ is unitary. Every rotation is a square, $R(\vec e,\varphi)=R(\vec e,\varphi/2)^2$, so rotations (and every element of a connected group) act <b>unitarily</b>. Anti-unitary operators are left for discrete symmetries that reverse time.'),
        T(r'<b>Time reversal.</b> $\Psi(-t,\vec x)$ solves $i\partial_t\Psi=-H\Psi$: the wrong sign, since the equation is first order in $t$. Complex conjugation repairs it for a real $H$:'),
        E(r'(\mathcal T\Psi)(t,\vec x)=\overline{\Psi(-t,\vec x)},\qquad \vec x\to\vec x,\quad \vec p\to-\vec p,\quad \vec L\to-\vec L', 'anti-unitary'),
        C('intuition', r'Running the film backwards: positions stay, velocities and angular momenta flip. A plane wave $e^{ikx}$ becomes $e^{-ikx}$. Bound states of a real $H$ can be chosen real, i.e. $\mathcal T$-invariant.'),
        C('pitfall', r'An anti-unitary symmetry has no hermitian generator ($e^{-i\theta T}$ makes no sense), so time-reversal invariance gives no conserved quantity, only selection rules. For spin $\frac12$, $\mathcal T=-i\sigma_2K$ with $\mathcal T^2=-\mathbb 1$: every level of an odd-electron system without magnetic field is at least doubly degenerate (Kramers).'),
        C('exam', r'Know the statement (unitary <i>or</i> anti-unitary), why rotations are unitary (squares), and the time-reversal example with its action on $\vec x,\vec p,\vec L$.'),
    ],
    'check': [
        K(r'Why must every rotation be represented by a unitary (not anti-unitary) operator?', [r'Every rotation is the square of another rotation, and the square of an anti-unitary operator is unitary', r'Rotations are continuous functions of the angle', r'Rotations commute', r'$\det R=1$'], 0, r'Weyl&#8217;s lemma: $R(\vec e,\varphi)=R(\vec e,\varphi/2)^2$.'),
        K(r'Time reversal maps $\vec L$ to', [r'$-\vec L$', r'$\vec L$', r'$\vec L^*$ only', r'$\vec L+\hbar$'], 0, r'$\vec x$ stays, $\vec p\to-\vec p$, so $\vec x\wedge\vec p\to-\vec x\wedge\vec p$.'),
        K(r'For an anti-unitary $U$, $|\langle U\phi|U\psi\rangle|$ equals', [r'$|\langle\phi|\psi\rangle|$', r'$|\langle\phi|\psi\rangle|^2$', r'$0$', r'$1$'], 0, r'It is the conjugate scalar product: same modulus, so probabilities are preserved.'),
    ],
}

D1 = {'type': 'derive', 'xp': 30, 'id': 'qm-sym-D1', 'title': 'Unitary representations are completely reducible',
      'source': {'file': SCRIPT, 'where': 'Ch. 7.3; lecturer ch7 pack: Reducible and irreducible representations'},
      'goal': r'Show that for a unitary representation an invariant subspace $K$ has an invariant complement, so $\mathcal H$ splits into irreducibles; show where unitarity is essential.',
      'given': [r'$U(g)U(h)=U(gh)$, $U(g)^\dagger=U(g^{-1})$', r'$K$ invariant: $U(g)K\subset K$ for all $g$'],
      'steps': [ST(r'Take $\psi\in K^\perp$, $\chi\in K$. Show $U(g)\psi\perp\chi$.', r'$\langle\chi|U(g)\psi\rangle=\langle U(g)^\dagger\chi|\psi\rangle=\langle U(g^{-1})\chi|\psi\rangle=0$, since $U(g^{-1})\chi\in K$ ($g^{-1}\in G$, $K$ invariant) and $\psi\perp K$.'),
                ST(r'What does this mean for the matrices $U(g)$ in a basis adapted to $K\oplus K^\perp$?', r'Both blocks are invariant, so every $U(g)=\begin{pmatrix}U_K(g)&0\\0&U_{K^\perp}(g)\end{pmatrix}$: two smaller representations.'),
                ST(r'Why does repeating this end in irreducibles (finite dimension)?', r'Each step strictly lowers the dimension of the pieces; when no piece has a non-trivial invariant subspace, all are irreducible: $\mathcal H=\mathcal H_1\oplus\mathcal H_2\oplus\dots$'),
                ST(r'Show that unitarity is essential with $(\mathbb R,+)$ on $\mathbb C^2$, $U(t)=\begin{pmatrix}1&t\\0&1\end{pmatrix}$.', r'$U(t)U(s)=U(t+s)$: a representation. $\mathrm{span}(e_1)$ is invariant. A complement would be a line spanned by $(a,1)$ with $U(t)(a,1)=(a+t,1)$, not on the line for $t\neq0$: no invariant complement. $U(t)$ is not unitary.'),
                ST(r'Why may one assume unitarity for SO(3) anyway?', r'Compact group: average any scalar product, $\langle v,w\rangle_{\rm inv}=\int\langle D(R)v,D(R)w\rangle\,dR$; by invariance of the Haar measure all $D(S)$ are unitary for it.')],
      'keyPoints': [r'$\langle\chi|U(g)\psi\rangle=\langle U(g^{-1})\chi|\psi\rangle$', r'block diagonal form', r'dimension decreases, process stops', r'non-unitary counterexample', r'averaging over a compact group']}

D2 = {'type': 'derive', 'xp': 35, 'id': 'qm-sym-D2', 'title': r'$\mathrm{SU}(2)\to\mathrm{SO}(3)$ is a double cover',
      'source': {'file': SCRIPT, 'where': 'Ch. 7.5; lecturer ch7 pack: SO(3) versus SU(2)'},
      'goal': r'With $\tilde x=x^j\sigma_j$ show that $\tilde x\mapsto g\tilde xg^\dagger$ defines a rotation $R(g)\in\mathrm{SO}(3)$, that the kernel is $\{\pm\mathbb 1\}$, and that $\varphi=2\pi$ lifts to $-\mathbb 1$.',
      'given': [r'$\sigma_j$ hermitian, traceless, $\mathrm{tr}(\sigma_i\sigma_j)=2\delta_{ij}$', r'$g\in\mathrm{SU}(2)$: $g^\dagger g=\mathbb 1$, $\det g=1$'],
      'steps': [ST(r'Show $\tilde x$ is traceless hermitian, recover $\vec x$ from it and compute $\det\tilde x$.', r'Real combination of hermitian traceless matrices. $x^j=\frac12\mathrm{tr}(\tilde x\sigma_j)$. $\det\tilde x=-(x^3)^2-(x^1-ix^2)(x^1+ix^2)=-\vec x\cdot\vec x$.'),
                ST(r'Show $g\tilde xg^\dagger$ is again some $\tilde x^\prime$ and $|\vec x^\prime|=|\vec x|$.', r'$(g\tilde xg^\dagger)^\dagger=g\tilde xg^\dagger$, $\mathrm{tr}(g\tilde xg^\dagger)=\mathrm{tr}\tilde x=0$; linear in $\vec x$. $\det(g\tilde xg^\dagger)=\det\tilde x$, so lengths are preserved: $R(g)\in\mathrm O(3)$.'),
                ST(r'Why $\det R(g)=+1$, and why is $g\mapsto R(g)$ a homomorphism?', r'$R(g_1g_2)$: $g_1g_2\tilde x(g_1g_2)^\dagger=g_1(g_2\tilde xg_2^\dagger)g_1^\dagger$, so $R(g_1g_2)=R(g_1)R(g_2)$. SU(2) is connected and $R(\mathbb 1)=\mathbb 1$; $\det R$ is continuous with values $\pm1$, hence $+1$.'),
                ST(r'Find the kernel.', r'$g\tilde xg^\dagger=\tilde x$ for all $\vec x$ $\Leftrightarrow$ $g\sigma_j=\sigma_jg$ for all $j$ $\Rightarrow$ $g=\lambda\mathbb 1$ (Schur, or by hand), and $\det g=\lambda^2=1$: $g=\pm\mathbb 1$. So two elements of SU(2) sit above every rotation.'),
                ST(r'Compute the rotation of $g=e^{-i\varphi\sigma_3/2}$ and its value at $\varphi=2\pi$.', r'$g=\mathrm{diag}(e^{-i\varphi/2},e^{i\varphi/2})$ gives $x^1+ix^2\mapsto e^{i\varphi}(x^1+ix^2)$: $R(\vec e_3,\varphi)$. At $\varphi=2\pi$, $R=\mathbb 1$ but $g=-\mathbb 1$; $g$ returns to $\mathbb 1$ only at $4\pi$.')],
      'keyPoints': [r'$\det\tilde x=-\vec x\cdot\vec x$', r'conjugation keeps hermitian and traceless', r'connectedness gives SO(3), not O(3)', r'kernel $\{\pm\mathbb 1\}$', r'$2\pi\mapsto-\mathbb 1$']}

D3 = {'type': 'derive', 'xp': 30, 'id': 'qm-sym-D3', 'title': "Weyl's lemma: rotations act unitarily",
      'source': {'file': SCRIPT, 'where': "Ch. 7.8; lecturer ch7 pack: Wigner's theorem and Weyl's lemma"},
      'goal': r'Given Wigner (each $U(g)$ unitary or anti-unitary, $U(g)U(h)=c(g,h)U(gh)$), show that every rotation is represented unitarily.',
      'given': [r'anti-unitary: $\langle U\phi|U\psi\rangle=\overline{\langle\phi|\psi\rangle}$, anti-linear', r'$R(\vec e,\alpha)R(\vec e,\beta)=R(\vec e,\alpha+\beta)$'],
      'steps': [ST(r'Show that $U^2$ is unitary if $U$ is anti-unitary.', r'$U^2$ is linear (two conjugations) and $\langle U^2\phi|U^2\psi\rangle=\overline{\langle U\phi|U\psi\rangle}=\langle\phi|\psi\rangle$. If $U$ is unitary, $U^2$ trivially is.'),
                ST(r'Conclude for $U(g^2)$.', r'$U(g)^2=c(g,g)U(g^2)$, so $U(g^2)=c(g,g)^{-1}U(g)^2$: a phase times a unitary operator, hence unitary.'),
                ST(r'Why is every rotation a square?', r'Same axis: generators commute, $e^{\alpha\Omega(\vec e)}e^{\beta\Omega(\vec e)}=e^{(\alpha+\beta)\Omega(\vec e)}$, so $R(\vec e,\varphi)=R(\vec e,\varphi/2)^2$. Hence $U(R)$ is unitary for every $R$.'),
                ST(r'Which symmetries can then be anti-unitary at all?', r'Only elements that are not squares: in practice the discrete ones that reverse time (time reversal $\mathcal T=K$ on wave functions). For a connected group (rotations, translations) everything is unitary, and Stone&#8217;s theorem gives hermitian generators.')],
      'keyPoints': [r'$U^2$ unitary for anti-unitary $U$', r'$U(g^2)=c(g,g)^{-1}U(g)^2$', r'$R(\vec e,\varphi)=R(\vec e,\varphi/2)^2$', r'anti-unitary only for time-reversing symmetries']}

D4 = {'type': 'derive', 'xp': 30, 'id': 'qm-sym-D4', 'title': 'Time reversal is anti-unitary; Kramers degeneracy',
      'source': {'file': SCRIPT, 'where': 'Ch. 7.8; lecturer ch7 pack: Time reversal'},
      'goal': r'Find the time-reversal operator for $i\hbar\partial_t\Psi=H\Psi$ with real $H$, its action on $\vec x,\vec p,\vec L$, and show $\mathcal T^2=-\mathbb 1$ forces double degeneracy for spin $\frac12$.',
      'given': [r'$H=-\frac{\hbar^2}{2m}\Delta+V(\vec x)$ real', r'spin $\frac12$: $\mathcal T=-i\sigma_2K$'],
      'steps': [ST(r'Try $\Phi(t)=\Psi(-t)$. Which equation does it solve?', r'$i\hbar\partial_t\Phi=-H\Phi$: the wrong sign, because the Schrödinger equation is first order in $t$.'),
                ST(r'Try $\Phi(t,\vec x)=\overline{\Psi(-t,\vec x)}$.', r'$\partial_t\Phi=-\overline{(\partial_t\Psi)(-t)}=-\overline{\tfrac1{i\hbar}H\Psi(-t)}=\tfrac1{i\hbar}H\Phi$ for real $H$: a solution. At fixed $t$ this is complex conjugation $K$, anti-unitary.'),
                ST(r'Action on $\vec x$, $\vec p$, $\vec L$.', r'$K\vec xK=\vec x$, $K(-i\hbar\nabla)K=+i\hbar\nabla=-\vec p$, so $\vec L\to-\vec L$; spin must flip too, $\mathcal T\vec\sigma\mathcal T^{-1}=-\vec\sigma$ with $\mathcal T=-i\sigma_2K$.'),
                ST(r'Compute $\mathcal T^2$ for spin $\frac12$.', r'$-i\sigma_2=\begin{pmatrix}0&-1\\1&0\end{pmatrix}$ is real, so $\mathcal T^2=(-i\sigma_2)\overline{(-i\sigma_2)}=(-i\sigma_2)^2=-\mathbb 1$.'),
                ST(r'Show $\psi\perp\mathcal T\psi$ (Kramers).', r'Anti-unitarity: $\langle\mathcal T\phi|\mathcal T\psi\rangle=\langle\psi|\phi\rangle$. With $\phi=\mathcal T\psi$: $\langle\mathcal T^2\psi|\mathcal T\psi\rangle=\langle\psi|\mathcal T\psi\rangle$, i.e. $-\langle\psi|\mathcal T\psi\rangle=\langle\psi|\mathcal T\psi\rangle=0$. If $[H,\mathcal T]=0$, $\mathcal T\psi$ is a second, orthogonal eigenstate of the same energy.')],
      'keyPoints': [r'conjugation is forced by the first time derivative', r'$\vec p\to-\vec p$, $\vec L\to-\vec L$', r'$\mathcal T^2=-\mathbb 1$ for spin $\frac12$', r'$\langle\psi|\mathcal T\psi\rangle=0$: Kramers pairs']}

QZ = {'type': 'quiz', 'xp': 20, 'id': 'qm-sym-Q1', 'title': 'Chapter 7 check: symmetries and representations',
      'source': {'file': SCRIPT, 'where': 'Ch. 7.1-7.8 (questions in the spirit of the lecturer ch7 pack)'},
      'questions': [
          {'q': r'Why must a symmetry act on $\mathcal H$ by unitary (or anti-unitary) operators rather than any invertible ones?', 'options': [r'It must preserve transition probabilities', r'It must commute with $H$', r'It must be hermitian', r'It must have determinant 1'], 'correct': 0, 'explain': r'Measurable content is $|\langle\phi|\psi\rangle|^2$ on rays; Wigner: only unitary or anti-unitary maps preserve it.'},
          {'q': r'Which $j$ give honest representations of SO(3)?', 'options': [r'$j=0,1,2,\dots$', r'$j=\frac12,\frac32,\dots$', r'all $j\ge0$', r'only $j=1$'], 'correct': 0, 'explain': r'$e^{-2\pi iM_3}=(-1)^{2j}$ must be $\mathbb 1$.'},
          {'q': r'$\mathrm{SU}(2)/\{\pm\mathbb 1\}$ is isomorphic to', 'options': [r'SO(3)', r'U(1)', r'SU(2)', r'O(3)'], 'correct': 0, 'explain': r'Kernel of the conjugation map $\tilde x\mapsto g\tilde xg^\dagger$.'},
          {'q': r'In the cocycle condition, what forces $c(g_1,g_2)c(g_1g_2,g_3)=c(g_2,g_3)c(g_1,g_2g_3)$?', 'options': [r'Associativity of the operator product', r'Unitarity', r'Commutativity of $G$', r'Hermiticity of the generators'], 'correct': 0, 'explain': r'Bracket $U(g_1)U(g_2)U(g_3)$ both ways.'},
          {'q': r'Can a genuinely projective representation of an abelian group have anticommuting operators $U(g)U(h)=-U(h)U(g)$?', 'options': [r'Yes, e.g. $\mathbb Z_2\times\mathbb Z_2$ with $\sigma_3,\sigma_1$ (sheet 10 Q2)', r'No, abelian groups only have 1D irreducibles', r'Only for infinite groups', r'Only if $\dim\mathcal H=1$'], 'correct': 0, 'explain': r'The ratio $c(g,h)/c(h,g)=-1$ survives every re-phasing; honest irreducibles of abelian groups are 1D, projective ones need not be.'},
          {'q': r'Why do the spherical harmonics contain no half-integer $l$?', 'options': [r'$e^{im\varphi}$ must be single-valued on the sphere', r'Half-integer $l$ would give negative energy', r'The Casimir would be negative', r'Parity forbids it'], 'correct': 0, 'explain': r'$\varphi\to\varphi+2\pi$ must give the same function, so $m\in\mathbb Z$.'},
          {'q': r'Time-reversal invariance of $H$ gives', 'options': [r'selection rules and Kramers degeneracy, but no conserved quantity', r'conservation of energy', r'a conserved hermitian operator $T$', r'conservation of parity'], 'correct': 0, 'explain': r'Anti-unitary operators have no hermitian generator.'},
          {'q': r'The Casimir $\vec M^2$ on $\mathcal D_j$ equals', 'options': [r'$j(j+1)\mathbb 1$', r'$j^2\mathbb 1$', r'$(2j+1)\mathbb 1$', r'depends on $m$'], 'correct': 0, 'explain': r'It commutes with all $M_k$, so by irreducibility it is a multiple of $\mathbb 1$; evaluate on the top state: $M_-M_++M_3^2+M_3=j^2+j$.'},
      ]}

READINGS = {
    'qm-am-L1': [('su2-lie-algebra', 'The Lie algebra su(2)'), ('ladder-operators', 'Raising and lowering operators'), ('casimir-operator', 'The Casimir operator')],
    'qm-am-L2': [('pauli-matrices', 'The Pauli matrices'), ('so3-vs-su2', 'SO(3) versus SU(2)'), ('exponential-map', 'The exponential map')],
    'qm-am-L3': [('fundamental-and-adjoint', 'The fundamental and the adjoint representation')],
    'qm-am-L4': [('generators-angular-momentum', 'Generators of rotations = angular momentum'), ('commuting-observables', 'Commuting operators')],
    'qm-am-D1': [('lie-bracket', 'The Lie bracket and the Jacobi identity'), ('generators-angular-momentum', 'Generators = angular momentum')],
    'qm-am-D2': [('ladder-operators', 'Raising and lowering operators'), ('why-j-labels-representations', 'Why j labels the irreducibles')],
    'qm-am-D3': [('exponential-map', 'The exponential map and BCH'), ('so3-vs-su2', 'SO(3) versus SU(2)')],
    'qm-sa-L2': [('reducible-irreducible', 'Reducible and irreducible representations'), ('compact-groups', 'Compact groups and complete reducibility')],
    'qm-pf-L2': [('commuting-observables', 'Commuting operators and common eigenvectors'), ('parity', 'The parity operator')],
    'qm-tunnel-L4': [('parity', 'The parity operator')],
    'qm-ho-L4': [('what-is-a-representation', 'What a representation is')],
    'qm-sheet-s8q3': [('why-j-labels-representations', 'Why j labels the irreducibles'), ('ladder-operators', 'Raising and lowering operators')],
    'qm-sheet-s9q3': [('pauli-matrices', 'The Pauli matrices'), ('so3-vs-su2', 'SO(3) versus SU(2)')],
    'qm-sheet-s10q2': [('projective-representations', 'Projective representations'), ('so3-vs-su2', 'SO(3) versus SU(2)'), ('group-homomorphism', 'Group homomorphisms')],
    'qm-sym-L1': [('unitary-representations', 'Unitary representations'), ('reducible-irreducible', 'Reducible and irreducible'), ('compact-groups', 'Compact groups'), ('why-j-labels-representations', 'Why j labels the irreducibles')],
    'qm-sym-L2': [('so3-vs-su2', 'SO(3) versus SU(2)'), ('projective-representations', 'Projective representations'), ('spin-of-electron', 'The spin of the electron')],
    'qm-sym-L3': [('wigner-theorem', "Wigner's theorem and Weyl's lemma"), ('time-reversal', 'Time reversal')],
    'qm-sym-D1': [('reducible-irreducible', 'Reducible and irreducible representations'), ('compact-groups', 'Compact groups')],
    'qm-sym-D2': [('so3-vs-su2', 'SO(3) versus SU(2)'), ('isomorphism', 'The word "isomorphic", four times')],
    'qm-sym-D3': [('wigner-theorem', "Wigner's theorem and Weyl's lemma")],
    'qm-sym-D4': [('time-reversal', 'Time reversal')],
    'qm-sym-Q1': [('index', 'All chapter 7 explainers')],
    'qm-read-07a': [('unitary-representations', 'Unitary representations'), ('rotation-group-so3', 'The rotation group SO(3)'), ('lie-groups-and-algebras', 'Lie groups and Lie algebras'), ('infinitesimal-rotations', 'Why infinitesimal rotations form a vector space'), ('lie-algebra-representation', 'From a group to a Lie algebra representation'), ('exponential-map', 'The exponential map and BCH'), ('generators-angular-momentum', 'Generators = angular momentum'), ('what-is-a-representation', 'What a representation is'), ('group-homomorphism', 'Group homomorphisms'), ('lie-bracket', 'The Lie bracket and Jacobi')],
    'qm-read-03a': [('parity', 'The parity operator')],
    'qm-read-03b': [('parity', 'The parity operator')],
    'qm-read-05a': [('commuting-observables', 'Commuting operators and common eigenvectors')],
    'qm-read-06a': [('ladder-operators', 'Raising and lowering operators')],
    'qm-read-08a': [('spherical-harmonics', 'Spherical harmonics'), ('commuting-observables', 'Commuting operators')],
    'qm-read-08b': [('su2-lie-algebra', 'The Lie algebra su(2)'), ('casimir-operator', 'The Casimir operator')],
    'qm-read-09a': [('reducible-irreducible', 'Reducible and irreducible representations'), ('fundamental-and-adjoint', 'The fundamental and the adjoint representation')],
    'qm-read-09b': [('why-j-labels-representations', 'Why j labels the irreducibles'), ('equivalent-representations', 'Equivalent representations')],
    'qm-read-07b': [('reducible-irreducible', 'Reducible and irreducible'), ('compact-groups', 'Compact groups and complete reducibility'), ('equivalent-representations', 'Equivalent (isomorphic) representations'), ('su2-lie-algebra', 'The Lie algebra su(2)'), ('why-j-labels-representations', 'Why j labels the irreducibles'), ('casimir-operator', 'The Casimir operator'), ('ladder-operators', 'Raising and lowering operators'), ('isomorphism', 'The word isomorphic, four times')],
    'qm-read-07c': [('so3-vs-su2', 'SO(3) versus SU(2)'), ('projective-representations', 'Projective representations'), ('spin-of-electron', 'The spin of the electron'), ('pauli-matrices', 'The Pauli matrices'), ('spherical-harmonics', 'Spherical harmonics (why no half-integer l)')],
    'qm-read-07d': [('wigner-theorem', "Wigner's theorem and Weyl's lemma"), ('time-reversal', 'Time reversal')],
}

out = {
    'title': 'Chapter 7: symmetries (with the lecturer reading pack)',
    'items': [{'room': ROOM, 'enc': e} for e in (L1, L2, L3, D1, D2, D3, D4, QZ)],
    'readings': {'pack': 'ch7', 'base': 'private/ch7/', 'probe': 'private/ch7/index.html',
                 'label': "Lecturer's chapter 7 explainers",
                 'chapter': 'chapter07.html',
                 'links': {k: [{'path': 'concepts/' + p + '.html', 'label': l} for p, l in v] for k, v in READINGS.items()}},
}
with open(OUT, 'w') as f: json.dump(out, f, ensure_ascii=False, indent=1)
print(len(out['items']), 'encounters,', len(READINGS), 'encounters with readings ->', os.path.relpath(OUT))
