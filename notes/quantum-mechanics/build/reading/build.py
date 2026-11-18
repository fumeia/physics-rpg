"""Guided reading for the QM I script (QM25, Gaberdiel; German) as campaign run stops, chapters 7-11 first, then 1-6.
Cards are in English with the script's notation (Gaussian units in 8-9: e^2/r, mu_B = e hbar / 2 m_e c; Dirac picture with
index D; D_j irreducible representations). Pages and equation numbers from the script (notes/extracted, table of contents).
The week of a card is the week of the exercise sheet that uses the section (campaign week n = sheet n).
Writes game/content/qm/reading.json. Run: python3 build.py"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '../../../build'))
from readinglib import card as _card, write

SCRIPT = 'materials/quantum-mechanics/scripts/QM25.Kap1+2+3+4+5+6+7+8+9+10+11.pdf'
def card(*a, **k): return _card(*a, source_file=SCRIPT, book='Script (German)', **k)
PACK = r' If the lecturer&#8217;s chapter 7 pack is installed, the strip at the top links the explainers for this section.'

C = []
# ------------------------------------------------------------------ chapter 7: symmetries
C.append(card('qm-read-07a', 8, 'angular-momentum-spin', '7.1–7.2', '66–69', 'unitary representations; SO(3) and its Lie algebra',
  ['Why must a symmetry act by unitary operators that compose like the group?', 'How do you get from a rotation group to commutators like $[L_j,L_k]=i\\hbar\\varepsilon_{jkl}L_l$?'],
  'Look for: $U(g_1)U(g_2)=U(g_1g_2)$, rotations $R(\\vec e,\\omega)=e^{\\omega\\Omega(\\vec e)}$, the generators $\\Omega_j$ and their commutators (the Lie algebra so(3)), and how $U(R)=e^{-i\\omega\\vec e\\cdot\\vec L/\\hbar}$ turns them into angular momentum.' + PACK,
  [(r'Why are the generators of rotations in $\mathcal H$ hermitian?', r'$U(R(\vec e,\omega))=e^{-i\omega\vec e\cdot\vec M}$ is unitary for all $\omega$; differentiating $U^\dagger U=\mathbb 1$ at $\omega=0$ gives $M^\dagger=M$.'),
   (r'Which property of rotations makes the Lie algebra non-abelian?', r'Rotations about different axes do not commute; to second order the commutator of two infinitesimal rotations is a rotation about the third axis: $[\Omega_1,\Omega_2]=\Omega_3$, which becomes $[L_1,L_2]=i\hbar L_3$.')],
  [(r'A unitary representation satisfies', [r'$U(g_1)U(g_2)=U(g_1g_2)$ and $U^\dagger=U^{-1}$', r'$U(g)$ hermitian', r'$U(g_1)U(g_2)=U(g_2)U(g_1)$', r'$\det U=0$'], r'Script 7.1.'),
   (r'The generators $L_j$ of rotations satisfy', [r'$[L_j,L_k]=i\hbar\varepsilon_{jkl}L_l$', r'$[L_j,L_k]=0$', r'$\{L_j,L_k\}=0$', r'$L_j^2=1$'], r'so(3), script 7.2.')]))
C.append(card('qm-read-07b', 8, 'angular-momentum-spin', '7.3–7.4', '70–74', 'irreducible representations; the spectrum $j(j+1)$',
  ['What does &#8220;irreducible&#8221; mean, and why does unitarity let you split a representation?', 'Why must $j$ be a half-integer or integer?'],
  'Look for: invariant subspaces and their complements, ladder operators $M_\\pm$, the top state $M_+\\psi_j=0$, the Casimir $\\vec M^2=j(j+1)$, $\\dim\\mathcal D_j=2j+1$.' + PACK,
  [(r'Derive $\vec M^2=j(j+1)$ on the top state.', r'$\vec M^2=M_-M_++M_3^2+M_3$; on $\psi_j$ with $M_+\psi_j=0$, $M_3\psi_j=j\psi_j$: $\vec M^2\psi_j=(j^2+j)\psi_j$. It commutes with all $M_k$, so it is $j(j+1)$ on the whole irreducible space.'),
   (r'Why does the ladder down from $m=j$ have to stop exactly at $m=-j$?', r'$\|M_-\psi_m\|^2=j(j+1)-m(m-1)$ must not be negative; the chain must end with $M_-\psi_{m_0}=0$, i.e. $m_0=-j$. From $j$ to $-j$ in integer steps: $2j$ is an integer.')],
  [(r'$M_\pm|j,m\rangle=$', [r'$\sqrt{j(j+1)-m(m\pm1)}\,|j,m\pm1\rangle$', r'$\sqrt{j\pm m}\,|j,m\pm1\rangle$', r'$m|j,m\pm1\rangle$', r'$|j\pm1,m\rangle$'], r'Script 7.4 ($\hbar=1$ units of the generators).'),
   (r'The irreducible representation $\mathcal D_j$ has dimension', [r'$2j+1$', r'$j$', r'$j(j+1)$', r'$2j$'], r'$m=-j,\dots,j$.')], minutes=25))
C.append(card('qm-read-07c', 9, 'angular-momentum-spin', '7.5–7.7', '75–79', 'SO(3) vs SU(2), projective representations, spin',
  ['How can a rotation by $2\\pi$ act as $-\\mathbb 1$ without contradicting anything measurable?', 'What is the double cover, concretely?'],
  'Look for: $\\tilde x=x^j\\sigma_j$ and $\\tilde x\\mapsto A\\tilde xA^\\dagger$, the kernel $\\{\\pm\\mathbb 1\\}$, $e^{-2\\pi iM_3}=(-1)^{2j}$, the cocycle condition, the spin of the electron on $L^2(\\mathbb R^3)\\otimes\\mathbb C^2$.' + PACK,
  [(r'Compute $e^{-i\pi\sigma_3}$ and interpret it.', r'$\mathrm{diag}(e^{-i\pi},e^{i\pi})=-\mathbb 1$: the rotation by $2\pi$ on spin $\frac12$. The overall sign does not change any probability, so it is allowed: $\mathcal D_{1/2}$ is a projective representation of SO(3), an honest one of SU(2).'),
   (r'Why do the spherical harmonics only have integer $l$?', r'$Y_{lm}\propto e^{im\varphi}$ must be single-valued on the sphere, so $m$ and $l$ are integers. Spin is not a function on the sphere.')],
  [(r'$\mathrm{SO}(3)\cong$', [r'$\mathrm{SU}(2)/\{\pm\mathbb 1\}$', r'$\mathrm{SU}(2)$', r'$\mathrm U(1)$', r'$\mathrm{SU}(2)\times\mathbb Z_2$'], r'Script 7.5.'),
   (r'Half-integer $j$ give', [r'projective representations of SO(3) (honest ones of SU(2))', r'no representations at all', r'honest representations of SO(3)', r'only reducible ones'], r'Script 7.5-7.6.')], minutes=25))
C.append(card('qm-read-07d', 10, 'angular-momentum-spin', '7.8', '80–81', 'Wigner&#8217;s theorem',
  ['What is the weakest thing a symmetry must preserve?', 'Why are rotations represented unitarily and never anti-unitarily?'],
  'Look for: transition probabilities on rays, unitary or anti-unitary, the square argument (Weyl&#8217;s lemma), time reversal as the anti-unitary example.' + PACK,
  [(r'Why does an anti-unitary operator still preserve probabilities?', r'$\langle U\phi|U\psi\rangle=\overline{\langle\phi|\psi\rangle}$ has the same modulus.'),
   (r'Give the argument that every rotation is unitary.', r'$U(g)^2$ is unitary even if $U(g)$ is anti-unitary, so $U(g^2)\propto U(g)^2$ is unitary; every rotation is the square of the rotation by half the angle.')],
  [(r'Wigner: a symmetry is represented by an operator that is', [r'unitary or anti-unitary', r'always unitary', r'hermitian', r'any invertible one'], r'Script 7.8.'),
   (r'Time reversal is', [r'anti-unitary', r'unitary', r'hermitian', r'not a symmetry'], r'Complex conjugation is needed.')], minutes=15))
# ------------------------------------------------------------------ chapter 8: hydrogen
C.append(card('qm-read-08a', 10, 'hydrogen-lamp', '8.1–8.2', '82–87', 'relative coordinates and the Coulomb potential',
  ['Why does a two-body problem become a one-body problem?', 'What do the limits $r\\to0$ and $r\\to\\infty$ tell you before solving anything?'],
  'Look for: centre of mass and reduced mass, separation $\\Psi=\\frac{u(r)}rY_{lm}$, the effective potential with $\\frac{\\hbar^2l(l+1)}{2mr^2}$, the behaviour at $r=0$ (8.2.1) and $r\\to\\infty$ (8.2.2), the terminating series and $E_n=-\\frac{me^4}{2\\hbar^2n^2}$.',
  [(r'Why $u\sim r^{l+1}$ at small $r$?', r'The centrifugal term dominates: $u^{\prime\prime}\approx\frac{l(l+1)}{r^2}u$, so $u=r^{l+1}$ or $r^{-l}$; the second is not allowed (not normalisable for $l\ge1$, and for $l=0$ it would need a $\delta$ source).'),
   (r'Where does the degeneracy $n^2$ come from?', r'$E$ depends only on $n=n_r+l+1$; for given $n$, $l=0,\dots,n-1$ with $2l+1$ values of $m$: $\sum(2l+1)=n^2$. The $l$-degeneracy is the hidden symmetry of 8.3.'),
   (r'How does the radial asymptotics differ from the 3D oscillator (sheet 10)?', r'Hydrogen: $u\sim e^{-\kappa r}$ (exponential), bound states only for $E<0$ and a continuum above. Oscillator: Gaussian $e^{-m\omega r^2/2\hbar}$ and a purely discrete spectrum.')],
  [(r'Bohr radius in the script&#8217;s units', [r'$a=\hbar^2/me^2$', r'$a=e^2/mc^2$', r'$a=\hbar/mc$', r'$a=\hbar^2/e^2$'], r'Gaussian units.'),
   (r'The energies of hydrogen depend on', [r'$n$ only (without fine structure)', r'$n$ and $l$', r'$l$ and $m$', r'$m$ only'], r'$E_n\propto-1/n^2$.')], minutes=25))
C.append(card('qm-read-08b', 11, 'hydrogen-lamp', '8.3', '88–92', 'the dynamical symmetry so(4)',
  ['Rotations explain the $m$-degeneracy. What explains that different $l$ have the same energy?', 'What is conserved besides $\\vec L$?'],
  'Look for: the Pauli-Lenz vector $\\vec J$, its algebra on a fixed energy $E<0$, $\\vec S=\\frac12(\\vec L+a\\vec J)$, $\\vec D=\\frac12(\\vec L-a\\vec J)$ with $a=\\sqrt{-m/2E}$, $\\vec S^2=\\vec D^2$ and the energies from the Casimir.',
  [(r'Why does $\vec S^2=\vec D^2$, and what does it give for the multiplets?', r'$\vec S^2-\vec D^2=a\vec L\cdot\vec J=0$ since $\vec J\perp\vec L$. So both su(2) have the same spin $s$: the eigenspace is $\mathcal D_s\otimes\mathcal D_s$ of dimension $(2s+1)^2=n^2$ with $n=2s+1$.'),
   (r'Which $l$ appear in $\mathcal D_s\otimes\mathcal D_s$?', r'$\vec L=\vec S+\vec D$: $l=0,1,\dots,2s=n-1$, exactly the hydrogen multiplet.')],
  [(r'The Pauli-Lenz vector is perpendicular to', [r'$\vec L$', r'$\vec x$', r'$\vec p$', r'nothing'], r'$\vec J\cdot\vec L=0$.'),
   (r'On the energy $E_n$, $\vec S$ and $\vec D$ both have spin', [r'$s=\frac{n-1}2$', r'$s=n$', r'$s=\frac n2$', r'$s=l$'], r'$n=2s+1$.')], minutes=25))
# ------------------------------------------------------------------ chapter 9: addition
C.append(card('qm-read-09a', 11, 'spin-addition-stern-gerlach', '9.1–9.3', '93–97', 'tensor products; two spins $\\frac12$',
  ['How does a rotation act on a two-particle state?', 'Why do two spins $\\frac12$ give spin 1 and spin 0?'],
  'Look for: $\\mathcal H_1\\otimes\\mathcal H_2$, total generators $\\vec J=\\vec J^{(1)}\\otimes\\mathbb 1+\\mathbb 1\\otimes\\vec J^{(2)}$, the highest-weight method, triplet and singlet.',
  [(r'Build the triplet and the singlet with $S_-=S_-^{(1)}+S_-^{(2)}$.', r'$|1,1\rangle=|\uparrow\uparrow\rangle$, $S_-$ gives $|1,0\rangle=\frac1{\sqrt2}(|\uparrow\downarrow\rangle+|\downarrow\uparrow\rangle)$, $|1,-1\rangle=|\downarrow\downarrow\rangle$. The orthogonal $m=0$ state $\frac1{\sqrt2}(|\uparrow\downarrow\rangle-|\downarrow\uparrow\rangle)$ is killed by $S_+$: the singlet.'),
   (r'Eigenvalues of $\vec S_1\cdot\vec S_2$ on triplet and singlet?', r'$\frac12(S^2-S_1^2-S_2^2)$: $\frac{\hbar^2}2(2-\frac32)=\frac{\hbar^2}4$ and $\frac{\hbar^2}2(0-\frac32)=-\frac34\hbar^2$.')],
  [(r'$\mathcal D_{1/2}\otimes\mathcal D_{1/2}=$', [r'$\mathcal D_1\oplus\mathcal D_0$', r'$\mathcal D_1$', r'$\mathcal D_{1/2}\oplus\mathcal D_{1/2}$', r'$\mathcal D_2$'], r'$2\times2=3+1$.'),
   (r'The singlet is', [r'antisymmetric under exchange', r'symmetric', r'a product state', r'$|\uparrow\uparrow\rangle$'], r'$\frac1{\sqrt2}(\uparrow\downarrow-\downarrow\uparrow)$.')], minutes=20))
C.append(card('qm-read-09b', 12, 'spin-addition-stern-gerlach', '9.4–9.5', '98–101', 'Clebsch-Gordan series and coefficients',
  ['Which total $j$ appear in $\\mathcal D_{j_1}\\otimes\\mathcal D_{j_2}$, and how do you check it?', 'How are Clebsch-Gordan coefficients computed without tables?'],
  'Look for: the series $|j_1-j_2|\\le j\\le j_1+j_2$, counting by $m$ multiplicities and dimensions, the coefficients $\\langle j_1m_1;j_2m_2|j,m\\rangle$ and the simple example 9.5.1.',
  [(r'Check $\mathcal D_1\otimes\mathcal D_1=\mathcal D_2\oplus\mathcal D_1\oplus\mathcal D_0$ by counting.', r'Dimensions $9=5+3+1$; $m$ multiplicities for $m=2,1,0$: $1,2,3$, so one top state each for $j=2,1,0$.'),
   (r'Find $|\frac32,\frac12\rangle$ in $1\otimes\frac12$.', r'Apply $J_-$ to $|1\rangle|\uparrow\rangle$: $J_-|\frac32,\frac32\rangle=\sqrt3|\frac32,\frac12\rangle=\sqrt2|0\rangle|\uparrow\rangle+|1\rangle|\downarrow\rangle$, so $|\frac32,\frac12\rangle=\sqrt{\frac23}|0\rangle\uparrow+\sqrt{\frac13}|1\rangle\downarrow$.')],
  [(r'Clebsch-Gordan coefficients vanish unless', [r'$m=m_1+m_2$', r'$m=m_1-m_2$', r'$j=j_1j_2$', r'$m_1=m_2$'], r'$J_3$ is additive.'),
   (r'$\mathcal D_{1/2}\otimes\mathcal D_1=$', [r'$\mathcal D_{3/2}\oplus\mathcal D_{1/2}$', r'$\mathcal D_{3/2}$', r'$\mathcal D_1\oplus\mathcal D_0$', r'$\mathcal D_2$'], r'Sheet 11 Q3: $6=4+2$.')], minutes=20))
C.append(card('qm-read-09c', 14, 'hydrogen-lamp', '9.6–9.7', '102–107', 'magnetic moment, Zeeman effect, spin-orbit coupling',
  ['Where does a magnetic moment come from in the Hamiltonian?', 'Why does the anomalous Zeeman effect need $g\\approx2$ and $\\vec J=\\vec L+\\vec S$?'],
  'Look for: minimal coupling (9.39), $\\vec M=\\frac q{2mc}\\vec L$ (9.46), $H_Z=-\\vec M\\cdot\\vec B$ (9.47), $\\Delta E_Z=\\mu_BB_zm$ (9.50), spin moment with $g$ (9.52), spin-orbit coupling and $\\vec L\\cdot\\vec S=\\frac12(\\vec J^2-\\vec L^2-\\vec S^2)$.',
  [(r'Why is $\vec L\cdot\vec S$ diagonal in the $|j,m_j\rangle$ basis but not in $|m_l,m_s\rangle$?', r'$\vec L\cdot\vec S=\frac12(\vec J^2-\vec L^2-\vec S^2)$ commutes with $\vec J^2$ and $J_z$, but not with $L_z$ or $S_z$ separately. Eigenvalue $\frac{\hbar^2}2[j(j+1)-l(l+1)-\frac34]$.'),
   (r'Weak field vs strong field (Paschen-Back): which basis?', r'Weak $B$: spin-orbit dominates, $|j,m_j\rangle$ with $\Delta E=g_{lj}\mu_BBm_j$. Strong $B$: Zeeman dominates, $|m_l,m_s\rangle$ with $\Delta E=\mu_BB(m_l+2m_s)$ plus spin-orbit as a small correction.')],
  [(r'For $j=l+\frac12$, the Landé factor is', [r'$g=\frac{2l+2}{2l+1}$', r'$g=2$', r'$g=1$', r'$g=\frac{2l}{2l+1}$'], r'Projection theorem; sheet 14 Q3.'),
   (r'$\vec L\cdot\vec S$ in a state $|l,s=\frac12,j\rangle$ equals', [r'$\frac{\hbar^2}2[j(j+1)-l(l+1)-\frac34]$', r'$\hbar^2lm_s$', r'$0$', r'$\hbar^2j$'], r'Script 9.7.1.')], minutes=25))
# ------------------------------------------------------------------ chapter 10
C.append(card('qm-read-10a', 13, 'entanglement-lab', '10.1–10.2', '108–110', 'EPR and Bell&#8217;s inequality',
  ['What exactly did EPR find paradoxical?', 'What do &#8220;local hidden variables&#8221; assume, and why does it give a bound of 2?'],
  'Look for: the EPR pair (10.1), local hidden-variable expectation values (10.2)-(10.3), the CHSH form (10.4)-(10.8), the quantum correlation $C(\\vec n_1,\\vec n_2)=-\\vec n_1\\cdot\\vec n_2$ (10.11) and the violation.',
  [(r'Prove (10.5) in two lines.', r'If $A=A^\prime$: $A+A^\prime=\pm2$, $A-A^\prime=0$; if $A=-A^\prime$: the reverse. So $(A+A^\prime)B+(A-A^\prime)B^\prime=\pm2$, and averaging gives $|\dots|\le2$.'),
   (r'Find angles where the singlet violates CHSH.', r'With $C=-\cos\theta$: $\vec n_1,\vec n_1^\prime$ at $0^\circ,90^\circ$, $\vec n_2,\vec n_2^\prime$ at $45^\circ,-45^\circ$ give $|C+C+C-C|=4\cos45^\circ=2\sqrt2>2$.')],
  [(r'For the singlet, $C(\vec n_1,\vec n_2)=\langle\sigma^{(1)}_{\vec n_1}\sigma^{(2)}_{\vec n_2}\rangle=$', [r'$-\vec n_1\cdot\vec n_2$', r'$\vec n_1\cdot\vec n_2$', r'$0$', r'$1$'], r'(10.11).'),
   (r'The maximal quantum value of the CHSH combination is', [r'$2\sqrt2$', r'$2$', r'$4$', r'$\sqrt2$'], r'Tsirelson bound.')], minutes=20))
C.append(card('qm-read-10b', 13, 'entanglement-lab', '10.3', '111–113', 'quantum teleportation',
  ['How can a continuous state be transmitted with two bits?', 'Why does this not allow signalling faster than light?'],
  'Look for: the three-particle state (10.14), the Bell-basis projectors $P_i=|\\chi_i\\rangle\\langle\\chi_i|$ (10.15), the four post-measurement states and the table of Bob&#8217;s operations.',
  [(r'Without Alice&#8217;s bits, what state does Bob have?', r'Each outcome has probability $\frac14$ and leaves a unitary image of $|\varphi\rangle$; averaged, Bob holds $\frac12\mathbb 1$: no information.'),
   (r'Verify one row of the table: outcome 3 and $\sigma_1$.', r'Bob holds $|\downarrow\rangle\langle\uparrow|\varphi\rangle+|\uparrow\rangle\langle\downarrow|\varphi\rangle$; $\sigma_1$ swaps $\uparrow$ and $\downarrow$ and gives $|\varphi\rangle$.')],
  [(r'Teleportation needs', [r'an entangled pair and 2 classical bits', r'only classical bits', r'cloning', r'a faster-than-light channel'], r'Script 10.3.'),
   (r'After the protocol, Alice&#8217;s particle 0', [r'no longer carries $|\varphi\rangle$ (no cloning)', r'still carries $|\varphi\rangle$', r'is destroyed physically', r'carries $-|\varphi\rangle$'], r'Her Bell measurement entangles 0 and 1.')], minutes=15))
# ------------------------------------------------------------------ chapter 11
C.append(card('qm-read-11a', 14, 'perturbation-forge', '11.1', '114–117', 'non-degenerate perturbation theory',
  ['What do you expand, and which convention fixes the expansion?', 'When is perturbation theory reliable?'],
  'Look for: $H=H_0+\\lambda H^\\prime$, power series in $\\lambda$ for $\\psi$ and $E$, projecting the order-$\\lambda^s$ equation on $\\psi_n$, $E^{(1)}$, $E^{(2)}$, $\\psi^{(1)}$, the perturbed oscillator (11.1.1).',
  [(r'Derive $E^{(1)}$ and $E^{(2)}$.', r'Order 1: $(H_0-E_n)\psi^{(1)}=(E^{(1)}-H^\prime)\psi_n$; project on $\psi_n$: $E^{(1)}=\langle n|H^\prime|n\rangle$, and $\psi^{(1)}=\sum_{m\ne n}\frac{\langle m|H^\prime|n\rangle}{E_n-E_m}\psi_m$. Order 2 projected: $E^{(2)}=\sum_{m\ne n}\frac{|\langle m|H^\prime|n\rangle|^2}{E_n-E_m}$.'),
   (r'Why is $E^{(2)}$ of the ground state never positive?', r'All $E_0-E_m<0$ and the numerators are non-negative: levels repel, the lowest is pushed down.')],
  [(r'Perturbation theory is valid when', [r'$|\langle m|\lambda H^\prime|n\rangle|\ll|E_n-E_m|$', r'$\lambda=1$', r'$H^\prime$ commutes with $H_0$', r'the levels are degenerate'], r'Small mixing.'),
   (r'$E^{(1)}_n=$', [r'$\langle n|H^\prime|n\rangle$', r'$\sum_m|H^\prime_{mn}|^2$', r'$0$', r'$E_n$'], r'Script 11.1.')], minutes=20))
C.append(card('qm-read-11b', 14, 'perturbation-forge', '11.2', '118–123', 'degenerate perturbation theory and the Stark effect',
  ['Why does the non-degenerate formula break down for degenerate levels?', 'How can a symmetry save you the diagonalisation?'],
  'Look for: diagonalising $H^\\prime$ in the degenerate subspace (11.2.1-11.2.2), lifting at second order (11.2.3), the linear Stark effect of $n=2$ (11.2.4).',
  [(r'Stark effect for $n=2$: why do only $|200\rangle$ and $|210\rangle$ mix?', r'$H^\prime=-eEz$ is odd under parity and commutes with $L_z$: it connects $l=0\leftrightarrow1$ with the same $m$. Only $\langle200|z|210\rangle\ne0$ (magnitude $3a$).'),
   (r'Result for $n=2$?', r'Two levels shift by $\pm3eEa$ (states $(|200\rangle\mp|210\rangle)/\sqrt2$), $|21\pm1\rangle$ stay: a linear Stark effect, possible because of the $l$-degeneracy.')],
  [(r'In a degenerate level the first-order energies are', [r'the eigenvalues of $H^\prime$ restricted to the degenerate subspace', r'the diagonal elements in any basis', r'always zero', r'$E^{(2)}$'], r'Script 11.2.'),
   (r'The ground state of hydrogen has', [r'no linear Stark effect (only quadratic)', r'a linear Stark effect', r'no Stark effect at all', r'a splitting into 3 levels'], r'Non-degenerate and parity even.')], minutes=25))
C.append(card('qm-read-11c', 14, 'perturbation-forge', '11.3', '124–132', 'time-dependent perturbation theory and the golden rule',
  ['How do you organise the time evolution when $H$ depends on time?', 'Why does a transition probability turn into a constant rate?'],
  'Look for: the propagator $U(t,t_0)$ and its time-ordered exponential (11.3.1), the Heisenberg picture (11.3.2), the Dirac picture (11.88)-(11.95), first-order amplitude (11.98), sudden switch-on (11.100), Fermi&#8217;s golden rule (11.106) and its time window (Abb. 23).',
  [(r'Why is time ordering needed in $U(t,t_0)$?', r'$H(t)$ at different times need not commute; the Dyson series orders later times to the left. If $H$ commutes with itself at all times, $U=e^{-\frac i\hbar\int H}$.'),
   (r'For $H^\prime=V\theta(t)$, how does $P_{i\to f}$ behave at $\omega_{if}=0$ and how wide is the peak?', r'Height $|V_{fi}|^2t^2/\hbar^2$, zeros at $\omega_{if}t=2n\pi$, width $\sim2\pi/t$: area $\propto t$, hence a rate $\Gamma=\frac{2\pi}\hbar|V_{fi}|^2\rho(E_f)$.')],
  [(r'In the Dirac picture the state evolves under', [r'$H^\prime_D(t)=e^{iH_0t/\hbar}H^\prime e^{-iH_0t/\hbar}$', r'$H_0$', r'$H_0+H^\prime$', r'nothing'], r'(11.93)-(11.94).'),
   (r'Fermi&#8217;s golden rule: $\Gamma=$', [r'$\frac{2\pi}\hbar|\langle f|V|i\rangle|^2\rho(E_f)$', r'$\frac\hbar{2\pi}|V_{fi}|^2$', r'$|V_{fi}|^2t^2/\hbar^2$', r'$\rho(E_f)/\hbar$'], r'(11.106).')], minutes=35))

# ------------------------------------------------------------------ chapters 1-6 (second batch, added below)
try:
    from part2 import CARDS_1_6
    C += CARDS_1_6(card)
except ImportError:
    pass

# The lecturer's "Related questions" of chapter 7 (reading pack deploy/packs/ch7_page.zip, publishing allowed): every question
# with the link to the explainer paragraph that answers it, added to the chapter 7 reading cards as an 'asked' block.
# The block only shows when the pack is installed on the server (body.has-ch7, set by the probe in main.js).
import html as _html, re as _re, zipfile as _zip
def _asked():
    z = _zip.ZipFile(os.path.join(HERE, '../../../../deploy/packs/ch7_page.zip'))
    ch = next(z.read(n).decode() for n in z.namelist() if n.endswith('.html') and b'<title>7 Symmetries' in z.read(n))
    parts = _re.split(r'<h2 id="sec-7-(\d)"', ch); out = {'0': []}
    def qs(body):
        res = []
        for box in _re.findall(r'<aside class="asked".*?</aside>', body, _re.S):
            for href, q in _re.findall(r'<li><a href="([^"]+)">(.*?)</a></li>', box, _re.S):
                q = _html.unescape(_re.sub(r'<[^>]+>', '', q)).replace(r'\(', '$').replace(r'\)', '$').strip()
                res.append((href, q))
        return res
    out['0'] = qs(parts[0])
    for i in range(1, len(parts), 2): out[parts[i]] = qs(parts[i + 1])
    return out
ASKED = _asked()
SEC_OF = {'qm-read-07a': ['0', '1', '2'], 'qm-read-07b': ['3', '4'], 'qm-read-07c': ['5', '6', '7'], 'qm-read-07d': ['8']}
for it in C:
    secs = SEC_OF.get(it['enc']['id'])
    if not secs: continue
    rows = ''.join(f'<li><a href="private/ch7/{h}" target="_blank" rel="noopener">{q}</a> <span class="src">({"7, intro" if n == "0" else "7." + n})</span></li>' for n in secs for h, q in ASKED.get(n, []))
    if rows:
        it['enc']['blocks'].insert(2, {'kind': 'asked', 'html': f'<p>The lecturer&#8217;s own questions on these pages, each linked to the explainer paragraph that answers it. Try to answer before you open it.</p><ol>{rows}</ol>'})
assert sum(len(v) for v in ASKED.values()) >= 70, sum(len(v) for v in ASKED.values())
sys.path.insert(0, HERE)
from more_checks import MORE  # 4 more checks per card
for it in C:
    for q, o, e in MORE.get(it['enc']['id'], []): it['enc']['check'].append({'q': q, 'options': o, 'correct': 0, 'explain': e})
assert all(len(it['enc']['check']) >= 6 for it in C), [it['enc']['id'] for it in C if len(it['enc']['check']) < 6]
write(os.path.join(HERE, '../../../../game/content/qm/reading.json'), C, 'Guided reading of the QM script; built by notes/quantum-mechanics/build/reading/build.py')
