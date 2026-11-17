r"""QM derivations for the Derivations screen (game/content/qm/derivations.json): the derivations old QM exams ask most,
each as lines (ladder: order, fill the gaps, moves only, blank page; backwards), its key moves, "why is this step allowed?"
questions on the steps people copy without understanding, a variant with one assumption changed, and the exam topic
(content/radar.json) that sets its priority. Standard notation; check it against the QM25 script (Gaberdiel) where it differs.
Run: python3 build.py.  Style rule: no ASCII apostrophes inside r'...' strings."""
import json, os

def W(at, q, options, explain, correct=0):
    return dict(at=at, q=q, options=options, correct=correct, explain=explain)

def D(id, title, room, topic, goal, lines, moves, whys, variant):
    return dict(id=id, title=title, room=room, topic=topic, goal=goal, lines=lines, moves=moves, whys=whys, variant=variant)

def V(change, task, changed, result):
    return dict(change=change, task=task, changed=changed, result=result)

DERIVS = [
 D('ho-spectrum', 'Oscillator spectrum from the ladder operators', 'harmonic-oscillator-elevator', 'ho-ladder',
   r'$\hat H=\frac{\hat p^2}{2m}+\frac12m\omega^2\hat x^2$ and $\hat a=\sqrt{\frac{m\omega}{2\hbar}}\big(\hat x+\frac{i\hat p}{m\omega}\big)$. Show that the spectrum is $E_n=\hbar\omega(n+\frac12)$, $n=0,1,2,\dots$',
   [r'$[\hat a,\hat a^\dagger]=\frac{m\omega}{2\hbar}\big(-\frac{i}{m\omega}[\hat x,\hat p]+\frac{i}{m\omega}[\hat p,\hat x]\big)=\frac{m\omega}{2\hbar}\cdot\frac{2\hbar}{m\omega}=1$.',
    r'$\hat a^\dagger\hat a=\frac{m\omega}{2\hbar}\big(\hat x^2+\frac{\hat p^2}{m^2\omega^2}+\frac{i}{m\omega}[\hat x,\hat p]\big)=\frac{\hat H}{\hbar\omega}-\frac12$.',
    r'So $\hat H=\hbar\omega(\hat N+\frac12)$ with $\hat N=\hat a^\dagger\hat a$, and $[\hat N,\hat a]=-\hat a$, $[\hat N,\hat a^\dagger]=\hat a^\dagger$.',
    r'If $\hat N|\nu\rangle=\nu|\nu\rangle$, then $\hat N\hat a|\nu\rangle=(\nu-1)\hat a|\nu\rangle$ and $\hat N\hat a^\dagger|\nu\rangle=(\nu+1)\hat a^\dagger|\nu\rangle$.',
    r'$\nu=\langle\nu|\hat a^\dagger\hat a|\nu\rangle=\|\hat a|\nu\rangle\|^2\ge0$.',
    r'Lowering again and again would reach a negative $\nu$; the chain can only stop at $\hat a|0\rangle=0$, so $\nu\in\{0,1,2,\dots\}$.',
    r'$E_n=\hbar\omega(n+\frac12)$, $n=0,1,2,\dots$'],
   [r'Write $\hat H=\hbar\omega(\hat a^\dagger\hat a+\frac12)$ using $[\hat x,\hat p]=i\hbar$',
    r'$[\hat N,\hat a]=-\hat a$, $[\hat N,\hat a^\dagger]=\hat a^\dagger$: they shift the eigenvalue by $\mp1$',
    r'Positivity: $\nu=\|\hat a|\nu\rangle\|^2\ge0$',
    r'The chain must stop at $\hat a|0\rangle=0$: $\nu$ is a non-negative integer'],
   [W(4, r'Why is $\nu\ge0$?', [r'$\nu$ is the squared norm of $\hat a|\nu\rangle$', r'$\hat N$ is Hermitian', 'The energy of a bound state is positive', r'$[\hat a,\hat a^\dagger]=1$'],
      r'Hermiticity only makes $\nu$ real. Non-negative comes from $\langle\nu|\hat a^\dagger\hat a|\nu\rangle=\|\hat a|\nu\rangle\|^2$.'),
    W(5, r'Why must $\nu$ be an integer?', [r'A non-integer $\nu$ never reaches exactly 0, so lowering it often enough gives a negative squared norm', 'The wave function must be single-valued', r'$\hat a^\dagger$ raises by exactly one', 'The boundary conditions quantise the energy'],
      r'Only the state with $\hat a|0\rangle=0$ ends the chain; every other start would run into $\nu<0$, which positivity forbids.')],
   V(r'Two dimensions: $\hat H=\frac{\hat p_x^2+\hat p_y^2}{2m}+\frac12m\omega^2(\hat x^2+\hat y^2)$.', 'Find the spectrum and the degeneracy of each level.',
     r'Two commuting sets of ladder operators $\hat a_x$, $\hat a_y$: $\hat H=\hbar\omega(\hat N_x+\hat N_y+1)$. Each set gives its own non-negative integer.',
     r'$E_n=\hbar\omega(n+1)$ with $n=n_x+n_y$; the pairs $(n_x,n_y)$ with sum $n$ are $n+1$, so the degeneracy is $n+1$.')),

 D('am-spectrum', 'Angular momentum spectrum from the algebra', 'angular-momentum-spin', 'angular-momentum',
   r'From $[\hat J_i,\hat J_j]=i\hbar\epsilon_{ijk}\hat J_k$ alone, show that $\hat{\mathbf J}^2$ has the eigenvalues $\hbar^2j(j+1)$ with $j\in\{0,\frac12,1,\dots\}$, and $\hat J_z$ the eigenvalues $\hbar m$, $m=-j,\dots,j$.',
   [r'$\hat J_\pm=\hat J_x\pm i\hat J_y$ obey $[\hat J_z,\hat J_\pm]=\pm\hbar\hat J_\pm$ and $[\hat{\mathbf J}^2,\hat J_\pm]=0$.',
    r'On common eigenstates $|\lambda,m\rangle$ ($\hat{\mathbf J}^2\to\hbar^2\lambda$, $\hat J_z\to\hbar m$), $\hat J_\pm$ changes $m$ by $\pm1$ and keeps $\lambda$.',
    r'$\hat J_\mp\hat J_\pm=\hat{\mathbf J}^2-\hat J_z^2\mp\hbar\hat J_z$, so $\|\hat J_\pm|\lambda,m\rangle\|^2=\hbar^2[\lambda-m(m\pm1)]\ge0$.',
    r'So $m$ is bounded. At the top $m=j$: $\hat J_+|\lambda,j\rangle=0$ gives $\lambda=j(j+1)$. At the bottom $m=j^\prime$: $\lambda=j^\prime(j^\prime-1)$, so $j^\prime=-j$.',
    r'From $-j$ to $j$ in integer steps: $2j\in\{0,1,2,\dots\}$, i.e. $j=0,\frac12,1,\frac32,\dots$, and $m=-j,-j+1,\dots,j$.'],
   [r'Ladder operators shift $m$ by $\pm1$ and keep $\hat{\mathbf J}^2$',
    r'The squared norm of $\hat J_\pm|\lambda,m\rangle$ is $\hbar^2[\lambda-m(m\pm1)]\ge0$: $m$ is bounded',
    r'Top and bottom of the ladder give $\lambda=j(j+1)$ and $m_{\min}=-j$; integer steps give $2j\in\mathbb N_0$'],
   [W(3, r'Why must the ladder stop at a top value $m=j$?', [r'$\lambda-m(m+1)\ge0$ bounds $m$; if $\hat J_+|\lambda,j\rangle\ne0$ the next state would break the bound', r'$\hat J_z$ is Hermitian', 'The wave function must be single-valued', r'$[\hat J_z,\hat J_+]=\hbar\hat J_+$'],
      r'Single-valuedness is what later forbids half-integer $l$ for orbital angular momentum; the algebra alone allows half-integers.'),
    W(2, r'Where does the $\mp\hbar\hat J_z$ in $\hat J_\mp\hat J_\pm$ come from?', [r'$\pm i[\hat J_x,\hat J_y]=\pm i\cdot i\hbar\hat J_z=\mp\hbar\hat J_z$', r'From $\hat J_z^2$', r'From $[\hat{\mathbf J}^2,\hat J_\pm]=0$', 'It is a convention'],
      r'Multiply out $(\hat J_x\mp i\hat J_y)(\hat J_x\pm i\hat J_y)=\hat J_x^2+\hat J_y^2\pm i[\hat J_x,\hat J_y]$.')],
   V(r'Do not ask for the spectrum: ask for $\langle\hat L_x\rangle$ and $\langle\hat L_x^2\rangle$ in a state $|l,m\rangle$.', 'Compute both.',
     r'$\hat L_x=\frac12(\hat L_++\hat L_-)$ changes $m$, so its diagonal element vanishes; by symmetry $\langle\hat L_x^2\rangle=\langle\hat L_y^2\rangle=\frac12\langle\hat{\mathbf L}^2-\hat L_z^2\rangle$.',
     r'$\langle\hat L_x\rangle=0$ and $\langle\hat L_x^2\rangle=\frac{\hbar^2}2[l(l+1)-m^2]$.')),

 D('box', 'Particle in an infinite well', 'wave-mechanics-basics', 'box-well-parity',
   r'Infinite well on $0<x<a$: find the energies $E_n$ and the normalised $\psi_n$.',
   [r'Inside, $V=0$: $\psi^{\prime\prime}=-k^2\psi$ with $E=\frac{\hbar^2k^2}{2m}$. Outside, $\psi=0$.',
    r'$\psi$ is continuous, so $\psi(0)=0$: $\psi=A\sin kx$.',
    r'$\psi(a)=0$: $ka=n\pi$ with $n=1,2,\dots$ ($n=0$ gives $\psi\equiv0$; negative $n$ repeat the same states).',
    r'$E_n=\frac{\hbar^2\pi^2n^2}{2ma^2}$, and $\int_0^a|A|^2\sin^2\frac{n\pi x}{a}dx=|A|^2\frac a2=1$ gives $\psi_n=\sqrt{\frac2a}\sin\frac{n\pi x}a$.'],
   ['Free particle inside, zero outside', r'The wall at 0 picks $\sin kx$', r'The wall at $a$ quantises $k$', 'Normalise'],
   [W(1, r'Why must $\psi(0)=0$, although $\psi^\prime$ may jump there?', [r'$\psi$ must be continuous; $\psi^\prime$ may jump because the potential jumps by an infinite amount', 'Because the energy is positive', r'Because $\psi$ is even', 'Because of the normalisation'],
      r'A jump in $\psi$ would make $\psi^\prime$ a delta function and the kinetic energy infinite. At an infinite wall only $\psi$ is matched, not $\psi^\prime$.'),
    W(2, r'Why is $n=0$ not a state?', [r'$k=0$ gives $\psi\equiv0$, which cannot be normalised', 'The uncertainty principle forbids zero energy', r'$\sin$ is odd', r'$n$ counts the nodes'],
      r'The uncertainty argument explains why the ground state energy is positive, but the formal reason is simply that $\sin0=0$ everywhere.')],
   V(r'Same width, but the well sits at $-\frac a2<x<\frac a2$.', r'What changes in $E_n$ and $\psi_n$?',
     r'Use parity: even solutions $\cos kx$ need $\cos\frac{ka}2=0$, odd ones $\sin kx$ need $\sin\frac{ka}2=0$.',
     r'The energies are the same, $E_n=\frac{\hbar^2\pi^2n^2}{2ma^2}$. $\psi_n=\sqrt{\frac2a}\cos\frac{n\pi x}a$ for odd $n$ and $\sqrt{\frac2a}\sin\frac{n\pi x}a$ for even $n$: the old states, shifted by $a/2$.')),

 D('pt-nondeg', 'Non-degenerate perturbation theory to second order', 'perturbation-forge', 'pt-nondegenerate',
   r'$\hat H=\hat H_0+\lambda\hat V$ with non-degenerate $\hat H_0|n\rangle=E_n^{(0)}|n\rangle$. Derive $E_n^{(1)}$, $|n^{(1)}\rangle$ and $E_n^{(2)}$.',
   [r'Expand $|n(\lambda)\rangle=|n\rangle+\lambda|n^{(1)}\rangle+\dots$ and $E_n=E_n^{(0)}+\lambda E_n^{(1)}+\lambda^2E_n^{(2)}+\dots$, with the choice $\langle n|n^{(1)}\rangle=0$.',
    r'Order $\lambda$: $(\hat H_0-E_n^{(0)})|n^{(1)}\rangle=(E_n^{(1)}-\hat V)|n\rangle$.',
    r'Project on $\langle n|$: the left side vanishes, so $E_n^{(1)}=\langle n|\hat V|n\rangle$.',
    r'Project on $\langle m|$, $m\ne n$: $\langle m|n^{(1)}\rangle=\frac{\langle m|\hat V|n\rangle}{E_n^{(0)}-E_m^{(0)}}$.',
    r'Order $\lambda^2$, projected on $\langle n|$: $E_n^{(2)}=\langle n|\hat V|n^{(1)}\rangle=\sum_{m\ne n}\frac{|\langle m|\hat V|n\rangle|^2}{E_n^{(0)}-E_m^{(0)}}$.'],
   [r'Expand in $\lambda$ and sort by order', r'Project on $\langle n|$: the $\hat H_0$ term drops, first-order energy', r'Project on $\langle m|$: the state correction', r'Second order is $\langle n|\hat V|n^{(1)}\rangle$'],
   [W(2, r'Why does the left side vanish when you project on $\langle n|$?', [r'$\langle n|(\hat H_0-E_n^{(0)})=0$, because $\hat H_0$ is Hermitian and acts to the left', r'Because $\langle n|n^{(1)}\rangle=0$', r'Because $\hat V$ is small', r'Because $|n\rangle$ is normalised'],
      r'The gauge choice $\langle n|n^{(1)}\rangle=0$ is not needed for this step; Hermiticity alone kills it.'),
    W(4, r'Why is the second-order shift of the ground state never positive?', [r'Every numerator $|\langle m|\hat V|0\rangle|^2$ is $\ge0$ and every denominator $E_0^{(0)}-E_m^{(0)}$ is negative', 'Perturbations always lower energies', r'$\hat V$ is a positive operator', 'By the variational principle applied to first order'],
      r'Only for the ground state are all denominators negative; excited levels can be pushed either way (level repulsion).')],
   V(r'The level $E_n^{(0)}$ is twofold degenerate, with states $|n,1\rangle$ and $|n,2\rangle$.', r'What goes wrong, and what replaces $E_n^{(1)}=\langle n|\hat V|n\rangle$?',
     r'The state correction divides by $E_n^{(0)}-E_m^{(0)}=0$ for the partner state, unless $\langle n,a|\hat V|n,b\rangle=0$ for $a\ne b$.',
     r'Choose the zeroth-order states as the eigenvectors of the $2\times2$ matrix $V_{ab}=\langle n,a|\hat V|n,b\rangle$; the first-order shifts are its eigenvalues, $\det(V_{ab}-E^{(1)}\delta_{ab})=0$.')),

 D('spin-dot', r'Two spins: eigenvalues of $\hat{\mathbf S}_1\cdot\hat{\mathbf S}_2$, triplet and singlet', 'spin-addition-stern-gerlach', 'spin-addition',
   r'Two spins $\frac12$: find the eigenvalues of $\hat{\mathbf S}_1\cdot\hat{\mathbf S}_2$ and the eigenstates.',
   [r'$\hat{\mathbf S}^2=(\hat{\mathbf S}_1+\hat{\mathbf S}_2)^2=\hat{\mathbf S}_1^2+\hat{\mathbf S}_2^2+2\hat{\mathbf S}_1\cdot\hat{\mathbf S}_2$.',
    r'$\hat{\mathbf S}_1\cdot\hat{\mathbf S}_2=\frac12(\hat{\mathbf S}^2-\hat{\mathbf S}_1^2-\hat{\mathbf S}_2^2)=\frac{\hbar^2}2\big[S(S+1)-\frac32\big]$ on states of total spin $S$.',
    r'$\frac12\otimes\frac12$: $S=1$ (three states) or $S=0$ (one state); count: $2\cdot2=3+1$.',
    r'Triplet: $|1,1\rangle=|\!\uparrow\uparrow\rangle$; lowering with $\hat S_-=\hat S_{1-}+\hat S_{2-}$ gives $|1,0\rangle=\frac1{\sqrt2}(|\!\uparrow\downarrow\rangle+|\!\downarrow\uparrow\rangle)$ and $|1,-1\rangle=|\!\downarrow\downarrow\rangle$. Eigenvalue $+\frac{\hbar^2}4$.',
    r'Singlet: the $m=0$ state orthogonal to $|1,0\rangle$, $\frac1{\sqrt2}(|\!\uparrow\downarrow\rangle-|\!\downarrow\uparrow\rangle)$. Eigenvalue $-\frac{3\hbar^2}4$.'],
   [r'Complete the square: $\hat{\mathbf S}^2$', r'Eigenvalues from $S(S+1)$', 'Top state, lower it, then the orthogonal partner'],
   [W(0, r'Why is $(\hat{\mathbf S}_1+\hat{\mathbf S}_2)^2=\hat{\mathbf S}_1^2+\hat{\mathbf S}_2^2+2\hat{\mathbf S}_1\cdot\hat{\mathbf S}_2$, without worrying about the order?', ['Operators of different particles commute', 'Spin operators are Hermitian', r'$\hat{\mathbf S}^2$ is a scalar', r'$[\hat S_x,\hat S_y]=i\hbar\hat S_z$'],
      r'The cross terms are $\hat{\mathbf S}_1\cdot\hat{\mathbf S}_2+\hat{\mathbf S}_2\cdot\hat{\mathbf S}_1$, and these are equal because each component of spin 1 commutes with each component of spin 2.'),
    W(4, r'Why is the singlet the antisymmetric combination?', [r'It must be orthogonal to $|1,0\rangle$ and have $m=0$; only one such state exists', 'Because fermions are antisymmetric', r'Because $\hat S_-$ is antisymmetric', 'By convention'],
      r'Fermion antisymmetry concerns the full state including space; here it is just orthogonality inside the $m=0$ subspace.')],
   V(r'Spin $\frac12$ with orbital angular momentum $l=1$: $\hat{\mathbf L}\cdot\hat{\mathbf S}$ (fine structure).', r'Find the eigenvalues of $\hat{\mathbf L}\cdot\hat{\mathbf S}$ and the multiplets.',
     r'$\hat{\mathbf J}=\hat{\mathbf L}+\hat{\mathbf S}$ and $\hat{\mathbf L}\cdot\hat{\mathbf S}=\frac12(\hat{\mathbf J}^2-\hat{\mathbf L}^2-\hat{\mathbf S}^2)$, with $j=\frac32$ or $\frac12$.',
     r'$j=\frac32$ (four states): $+\frac{\hbar^2}2$. $j=\frac12$ (two states): $-\hbar^2$. Check: $4\cdot\frac12+2\cdot(-1)=0$, the trace of $\hat{\mathbf L}\cdot\hat{\mathbf S}$.')),

 D('virial', 'Virial theorem from a commutator', 'hydrogen-lamp', 'hydrogen',
   r'In a stationary state of $\hat H=\frac{\hat p^2}{2m}+V(\hat x)$, show $2\langle\hat T\rangle=\langle\hat xV^\prime(\hat x)\rangle$.',
   [r'In an eigenstate of $\hat H$, $\langle[\hat H,\hat A]\rangle=0$ for every $\hat A$. Take $\hat A=\hat x\hat p$.',
    r'$\big[\frac{\hat p^2}{2m},\hat x\hat p\big]=\frac1{2m}[\hat p^2,\hat x]\hat p=-\frac{i\hbar}m\hat p^2$.',
    r'$[V(\hat x),\hat x\hat p]=\hat x[V,\hat p]=i\hbar\,\hat xV^\prime(\hat x)$.',
    r'$0=\langle[\hat H,\hat x\hat p]\rangle=-\frac{i\hbar}m\langle\hat p^2\rangle+i\hbar\langle\hat xV^\prime\rangle$, so $2\langle\hat T\rangle=\langle\hat xV^\prime\rangle$.',
    r'For $V\propto|x|^s$: $xV^\prime=sV$, so $2\langle T\rangle=s\langle V\rangle$. Oscillator ($s=2$): $\langle T\rangle=\langle V\rangle=\frac E2$.'],
   [r'Stationary state: $\langle[\hat H,\hat A]\rangle=0$', r'Choose $\hat A=\hat x\hat p$', r'Two commutators: $-\frac{i\hbar}m\hat p^2$ and $i\hbar\,\hat xV^\prime$'],
   [W(0, r'Why is $\langle[\hat H,\hat A]\rangle=0$ in an eigenstate of $\hat H$?', [r'$\langle E|\hat H\hat A-\hat A\hat H|E\rangle=E\langle\hat A\rangle-E\langle\hat A\rangle=0$', r'Because $\hat A$ is Hermitian', r'Because $\hat x\hat p$ commutes with $\hat H$', 'Because energy is conserved'],
      r'$\hat x\hat p$ is not even Hermitian, and the argument does not need it: $\hat H$ acts on the eigenstate to the left and to the right.'),
    W(2, r'Why is $[V(\hat x),\hat p]=i\hbar V^\prime(\hat x)$?', [r'On a test function: $V(-i\hbar f^\prime)+i\hbar(Vf)^\prime=i\hbar V^\prime f$', r'Because $[\hat x,\hat p]=i\hbar$ and $V$ is linear', r'Because $V$ commutes with $\hat x$', 'From the Heisenberg equation'],
      r'It holds for any differentiable $V$; the product rule does the work.')],
   V(r'Three dimensions, hydrogen: $V=-\frac{e^2}{4\pi\epsilon_0r}$ and $\hat A=\hat{\mathbf r}\cdot\hat{\mathbf p}$.', r'Relate $\langle T\rangle$, $\langle V\rangle$ and $E$.',
     r'$\mathbf r\cdot\nabla V=-V$ for $V\propto1/r$ (homogeneous of degree $-1$).',
     r'$2\langle T\rangle=-\langle V\rangle$, so $E=\langle T\rangle+\langle V\rangle=-\langle T\rangle=\frac12\langle V\rangle$. For the ground state: $\langle T\rangle=13.6$ eV, $\langle V\rangle=-27.2$ eV.')),

 D('delta', 'Bound state of the delta well', 'tunneling-bridge', 'scattering-1d',
   r'Bound state of $V(x)=-\alpha\,\delta(x)$, $\alpha>0$: find $E$ and $\psi$.',
   [r'For $x\ne0$: $-\frac{\hbar^2}{2m}\psi^{\prime\prime}=E\psi$ with $E<0$, so $\psi\propto e^{\pm\kappa x}$ with $\kappa=\frac{\sqrt{-2mE}}\hbar$.',
    r'Normalisable and continuous at 0: $\psi=A\,e^{-\kappa|x|}$.',
    r'Integrate the Schrödinger equation from $-\epsilon$ to $\epsilon$: $-\frac{\hbar^2}{2m}\big[\psi^\prime(0^+)-\psi^\prime(0^-)\big]-\alpha\psi(0)=0$.',
    r'With $\psi^\prime(0^+)-\psi^\prime(0^-)=-2\kappa A$ and $\psi(0)=A$: $\kappa=\frac{m\alpha}{\hbar^2}$.',
    r'$E=-\frac{\hbar^2\kappa^2}{2m}=-\frac{m\alpha^2}{2\hbar^2}$ and $A=\sqrt\kappa$.'],
   ['Solve outside the delta: decaying exponentials', r'Normalisable and continuous: $e^{-\kappa|x|}$', r'Integrate across the delta: the kink in $\psi^\prime$ fixes $\kappa$'],
   [W(2, r'Why may the $E\psi$ term be dropped when integrating from $-\epsilon$ to $\epsilon$?', [r'$\psi$ is bounded, so $\int_{-\epsilon}^{\epsilon}E\psi\,dx\to0$; only the delta survives', r'Because $E<0$', r'Because $\psi^\prime$ is continuous', 'Because the delta is even'],
      r'$\psi^\prime$ is exactly what is not continuous here: its jump is the whole point of the step.')],
   V(r'A repulsive delta, $V=+\alpha\,\delta(x)$.', 'Is there a bound state?',
     r'The kink condition flips sign: $\kappa=-\frac{m\alpha}{\hbar^2}<0$.',
     r'$e^{-\kappa|x|}$ with $\kappa<0$ grows at infinity: not normalisable, so there is no bound state.')),

 D('robertson', 'General uncertainty relation', 'formalism-and-uncertainty', 'uncertainty',
   r'For Hermitian $\hat A,\hat B$ and a normalised state, show $\Delta A\,\Delta B\ge\frac12\big|\langle[\hat A,\hat B]\rangle\big|$.',
   [r'Shift to zero mean: $\hat a=\hat A-\langle A\rangle$, $\hat b=\hat B-\langle B\rangle$. Then $\Delta A^2=\langle\hat a^2\rangle=\|\hat a\psi\|^2$ and $[\hat a,\hat b]=[\hat A,\hat B]$.',
    r'Cauchy–Schwarz: $\|\hat a\psi\|^2\,\|\hat b\psi\|^2\ge|\langle\hat a\psi|\hat b\psi\rangle|^2=|\langle\hat a\hat b\rangle|^2$.',
    r'$|z|^2\ge(\mathrm{Im}\,z)^2$, and $\mathrm{Im}\langle\hat a\hat b\rangle=\frac1{2i}\langle\hat a\hat b-\hat b\hat a\rangle$ because $\langle\hat b\hat a\rangle=\langle\hat a\hat b\rangle^*$.',
    r'So $\Delta A^2\,\Delta B^2\ge\frac14|\langle[\hat A,\hat B]\rangle|^2$; take the square root.'],
   ['Shift to zero mean (the commutator does not change)', r'Cauchy–Schwarz on $\hat a\psi$ and $\hat b\psi$', 'Keep only the imaginary part: it is the commutator'],
   [W(1, r'Why is $\langle\hat a\psi|\hat b\psi\rangle=\langle\hat a\hat b\rangle$?', [r'$\hat a$ is Hermitian, so it moves to the other side unchanged', r'Because $\hat a$ and $\hat b$ commute', r'Because $\psi$ is normalised', r'Because $\langle\hat a\rangle=0$'],
      r'$\langle\hat a\psi|\hat b\psi\rangle=\langle\psi|\hat a^\dagger\hat b\psi\rangle$ with $\hat a^\dagger=\hat a$. They do not commute in general: that is the point.'),
    W(2, 'Why may the real part be dropped?', [r'$|z|^2=(\mathrm{Re}\,z)^2+(\mathrm{Im}\,z)^2\ge(\mathrm{Im}\,z)^2$', 'The real part vanishes for Hermitian operators', 'The real part is the anticommutator, which is zero', 'Because the result must be real'],
      r'The real part is $\frac12\langle\{\hat a,\hat b\}\rangle$, a covariance, and it is not zero in general. Dropping it only weakens the bound (keeping it gives the Schrödinger–Robertson relation).')],
   V(r'Take $\hat A=\hat L_x$, $\hat B=\hat L_y$ in a state $|l,m\rangle$.', 'What does the bound say, and when is it saturated?',
     r'$[\hat L_x,\hat L_y]=i\hbar\hat L_z$, and in $|l,m\rangle$: $\Delta L_x^2=\Delta L_y^2=\frac{\hbar^2}2[l(l+1)-m^2]$.',
     r'The bound is $\Delta L_x\Delta L_y\ge\frac{\hbar^2}2|m|$. The product is $\frac{\hbar^2}2[l(l+1)-m^2]$, and $l(l+1)-m^2-|m|=(l-|m|)(l+|m|+1)\ge0$: equality exactly for $|m|=l$.')),

 D('ehrenfest', 'Ehrenfest theorem', 'formalism-and-uncertainty', 'ehrenfest-continuity',
   r'Show $\frac{d}{dt}\langle\hat x\rangle=\frac{\langle\hat p\rangle}m$ and $\frac{d}{dt}\langle\hat p\rangle=-\langle V^\prime(\hat x)\rangle$ for $\hat H=\frac{\hat p^2}{2m}+V(\hat x)$.',
   [r'From $i\hbar\,\partial_t|\psi\rangle=\hat H|\psi\rangle$: $\frac{d}{dt}\langle\hat A\rangle=\frac i\hbar\langle[\hat H,\hat A]\rangle$ for $\hat A$ without explicit time dependence.',
    r'$[\hat H,\hat x]=\frac1{2m}[\hat p^2,\hat x]=\frac1{2m}\big(\hat p[\hat p,\hat x]+[\hat p,\hat x]\hat p\big)=-\frac{i\hbar}m\hat p$.',
    r'$\frac{d}{dt}\langle\hat x\rangle=\frac i\hbar\cdot\big(-\frac{i\hbar}m\big)\langle\hat p\rangle=\frac{\langle\hat p\rangle}m$.',
    r'$[\hat H,\hat p]=[V(\hat x),\hat p]=i\hbar V^\prime(\hat x)$ (act on a test function).',
    r'$\frac{d}{dt}\langle\hat p\rangle=\frac i\hbar\cdot i\hbar\langle V^\prime\rangle=-\langle V^\prime(\hat x)\rangle$.'],
   [r'$\frac{d}{dt}\langle\hat A\rangle=\frac i\hbar\langle[\hat H,\hat A]\rangle$', r'$[\hat p^2,\hat x]=-2i\hbar\hat p$', r'$[V(\hat x),\hat p]=i\hbar V^\prime$ on a test function'],
   [W(0, r'Where does $\frac{d}{dt}\langle\hat A\rangle=\frac i\hbar\langle[\hat H,\hat A]\rangle$ come from?', [r'Product rule on $\langle\psi|\hat A|\psi\rangle$ with $\partial_t|\psi\rangle=-\frac i\hbar\hat H|\psi\rangle$ and $\partial_t\langle\psi|=\frac i\hbar\langle\psi|\hat H$', 'From the classical Poisson bracket', r'From $[\hat x,\hat p]=i\hbar$', 'It is a postulate'],
      r'The bra picks up $+\frac i\hbar\hat H$ because $\hat H$ is Hermitian; the two terms combine to the commutator.')],
   V(r'Compare $V=\frac12m\omega^2x^2$ with $V=\lambda x^4$.', r'When do $\langle x\rangle$ and $\langle p\rangle$ obey Newton’s equations exactly?',
     r'Everything hinges on $\langle V^\prime(\hat x)\rangle$ versus $V^\prime(\langle\hat x\rangle)$.',
     r'Oscillator: $\langle V^\prime\rangle=m\omega^2\langle x\rangle=V^\prime(\langle x\rangle)$, exactly classical. Quartic: $\langle V^\prime\rangle=4\lambda\langle x^3\rangle\ne4\lambda\langle x\rangle^3$ in general. Exactly classical only when $V^\prime$ is at most linear.')),

 D('continuity', 'Probability current and the continuity equation', 'wave-mechanics-basics', 'ehrenfest-continuity',
   r'Show $\partial_t|\psi|^2+\partial_xj=0$ with $j=\frac\hbar m\mathrm{Im}(\psi^*\partial_x\psi)$, for a real potential $V$.',
   [r'$\partial_t\rho=\psi^*\partial_t\psi+\psi\,\partial_t\psi^*$ with $\rho=|\psi|^2$.',
    r'$\partial_t\psi=\frac{i\hbar}{2m}\psi^{\prime\prime}-\frac i\hbar V\psi$ and $\partial_t\psi^*=-\frac{i\hbar}{2m}\psi^{*\prime\prime}+\frac i\hbar V\psi^*$.',
    r'The potential terms cancel: $-\frac i\hbar V|\psi|^2+\frac i\hbar V|\psi|^2=0$.',
    r'$\partial_t\rho=\frac{i\hbar}{2m}\big(\psi^*\psi^{\prime\prime}-\psi\psi^{*\prime\prime}\big)=\frac{i\hbar}{2m}\partial_x\big(\psi^*\psi^\prime-\psi\psi^{*\prime}\big)$.',
    r'$\psi^*\psi^\prime-\psi\psi^{*\prime}=2i\,\mathrm{Im}(\psi^*\psi^\prime)$, so $\partial_t\rho=-\partial_x\big[\frac\hbar m\mathrm{Im}(\psi^*\psi^\prime)\big]$.'],
   [r'Product rule on $\psi^*\psi$', r'Insert the Schrödinger equation and its conjugate: $V$ cancels', 'Write the rest as a total derivative'],
   [W(2, 'Why do the potential terms cancel?', [r'$V$ is real, so the two terms are $\mp\frac i\hbar V|\psi|^2$', r'$V$ is even', r'$V$ commutes with $\hat p$', r'$V$ vanishes at infinity'],
      r'With a complex $V$ they do not cancel: that is how absorption is modelled (see the variant).'),
    W(3, r'Why is $\psi^*\psi^{\prime\prime}-\psi\psi^{*\prime\prime}$ a total derivative?', [r'It equals $\partial_x(\psi^*\psi^\prime-\psi\psi^{*\prime})$: the cross terms $\psi^{*\prime}\psi^\prime$ cancel', r'Because $\psi$ is normalised', 'By integration by parts', 'Because it is purely imaginary'],
      r'Differentiate the bracket: $\psi^{*\prime}\psi^\prime+\psi^*\psi^{\prime\prime}-\psi^\prime\psi^{*\prime}-\psi\psi^{*\prime\prime}$.')],
   V(r'A complex potential $V=V_R-\frac i2\Gamma$ with a constant $\Gamma>0$ (an absorbing region).', 'What replaces the continuity equation?',
     r'The potential terms no longer cancel: each gives $-\frac{\Gamma}{2\hbar}|\psi|^2$.',
     r'$\partial_t\rho+\partial_xj=-\frac\Gamma\hbar\rho$: probability is lost at the rate $\Gamma/\hbar$.')),
]

exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'part2.py'), encoding='utf-8').read())  # more derivations
topics = {t['topic']: t for t in json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../../../game/content/radar.json'), encoding='utf-8'))['topics']}
for d in DERIVS:
    t = topics[d['topic']]; d['exam'] = {'count': t['count'], 'of': t['of'], 'label': t['label']}
    assert all(0 <= w['at'] < len(d['lines']) for w in d['whys']), d['id']
exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'asked.py'), encoding='utf-8').read())  # exam wording per derivation
DERIVS.sort(key=lambda d: -d['exam']['count'])
out = {'about': 'QM derivations the old exams ask most, for the Derivations screen. Generated by notes/quantum-mechanics/build/derivations/build.py.', 'items': DERIVS}
dst = os.path.join(os.path.dirname(__file__), '../../../../game/content/qm/derivations.json')
json.dump(out, open(dst, 'w'), ensure_ascii=False, indent=1)
print(len(DERIVS), 'derivations ->', os.path.normpath(dst))
