# QM I exercise sheets X-XIV (HS25 set, Gaberdiel), condensed from the official sheets and solutions.
# Style rule: no ASCII apostrophes inside r'...' strings (use ’ in text, ^\prime in math).
from qm_sheet_lib import S, Q

S(10, 'The 3D oscillator the hard way', '2025-11-26', [
 Q(1, 'Harmonic oscillator in spherical coordinates', 'harmonic-oscillator-elevator', ['qm-ho-D6', 'qm-hl-D1', 'qm-ho-L4', 'qm-ho-c4'],
   r'$H=\frac{\vec p^2}{2m}+\frac{m\omega^2}{2}\vec x^2$. (i) Spectrum and degeneracies from what you know. (ii) With $\Psi=\frac{u(r)}rY_{\ell m}$, $-u^{\prime\prime}+\frac{\ell(\ell+1)}{r^2}u+\frac{m^2\omega^2}{\hbar^2}r^2u=\varepsilon u$, $\varepsilon=\frac{2mE}{\hbar^2}$: show $u\sim r^{\ell+1}$ ($r\to0$) and $u\sim e^{-m\omega r^2/2\hbar}$ ($r\to\infty$); contrast with hydrogen. (iii) With $u=e^{-m\omega r^2/2\hbar}\sum_{k\ge\ell+1}c_kr^k$ derive $c_{k+2}=\frac{\frac{m\omega}\hbar(2k+1)-\varepsilon}{(k+2)(k+1)-\ell(\ell+1)}c_k$; which $c_k$ vanish, how many are free? (iv) Square integrability: allowed energies at fixed $\ell$; draw the $(\ell,E)$ spectrum. (v) Recover (i).',
   [('(i) Three 1D oscillators.', r'$E=\hbar\omega(N+\frac32)$, degeneracy $\frac{(N+1)(N+2)}2$ (sheet VII Q3).'),
    ('(ii) Asymptotics.', r'$r\to0$: $u^{\prime\prime}\approx\frac{\ell(\ell+1)}{r^2}u$, $u=r^{\ell+1}$ or $r^{-\ell}$; the second is not square integrable (or, for $\ell=0$, would need a $\delta$ potential). $r\to\infty$: $u=e^S$, $S^{\prime2}\approx\alpha^2r^2$, $S=-\alpha r^2/2$ ($\alpha=m\omega/\hbar$). Hydrogen decays only like $e^{-\kappa r}$; here the confining $r^2$ potential gives a Gaussian and no scattering states: the whole spectrum is discrete.'),
    ('(iii) Recursion.', r'Insert $u=e^{-\alpha r^2/2}f$: $-f^{\prime\prime}+\frac{\ell(\ell+1)}{r^2}f+2\alpha rf^\prime+(\alpha-\varepsilon)f=0$; equate powers of $r$: the stated recursion. Starting from $c_{\ell+1}$ in steps of 2, all $c_k$ with $k-\ell$ even vanish; only $c_{\ell+1}$ is free (normalisation).'),
    ('(iv) Quantisation.', r'If the series does not stop, $c_{k+2}/c_k\to2\alpha/k$ and $f\sim e^{\alpha r^2}$: not normalisable. It stops at $k_{\max}=\ell+1+2n_r$ iff $\varepsilon=\alpha(2k_{\max}+1)$, i.e. $E=\hbar\omega\left(2n_r+\ell+\frac32\right)$. In the $(\ell,E)$ plane: at $E=\hbar\omega(N+\frac32)$ the allowed $\ell=N,N-2,\dots,1$ or 0.'),
    ('(v) Degeneracy.', r'$\sum_{\ell=N,N-2,\dots}(2\ell+1)=\frac{(N+1)(N+2)}{2}$: agrees with (i). Same $N$ for different $\ell$: an accidental degeneracy, explained by the hidden su(3) (sheet IX Q4).')],
   [r'$r^{\ell+1}$ and Gaussian asymptotics', r'recursion from equating powers', r'termination $\Rightarrow E=\hbar\omega(2n_r+\ell+\frac32)$', r'allowed $\ell$ have the parity of $N$', r'degeneracy $\frac{(N+1)(N+2)}2$']),
])

S(11, 'so(4) of hydrogen, spinors, spin addition', '2025-12-03', [
 Q(1, 'More on the dynamical symmetry', 'hydrogen-lamp', ['qm-hl-L2', 'qm-hl-D4', 'qm-hl-b2'],
   r'Pauli-Lenz vector $\vec J=\frac1{2m}(\vec p\wedge\vec L-\vec L\wedge\vec p)-\kappa\frac{\vec x}r$; on a fixed negative energy $\vec S=\frac12(\vec L+a\vec J)$, $\vec D=\frac12(\vec L-a\vec J)$ form su(2) $\oplus$ su(2). (i) The highest weight vector $|\psi\rangle$ (killed by $S_+$, $D_+$) satisfies $J_+|\psi\rangle=L_+|\psi\rangle=0$, so it is a superposition of $|n,l,l\rangle$. (ii) Compute $[L_\pm,J_+]$, $[L_3,J_+]$; show $J_+|n,l,l\rangle\propto|n,l+1,l+1\rangle$ and $|\psi\rangle=|n,n-1,n-1\rangle$. (iii) Check explicitly: $\psi\propto r^{n-1}\sin^{n-1}\theta\,e^{i(n-1)\varphi}e^{-m\kappa r/\hbar^2n}$ and $J_+\psi=0$. (v) Describe the eigenspace with ladder operators and count its dimension.',
   [('(i) Highest weight.', r'$S_+\pm$ and $D_+$ combinations: $S_+|\psi\rangle=D_+|\psi\rangle=0\Leftrightarrow L_+|\psi\rangle=0$ and $J_+|\psi\rangle=0$. $L_+|\psi\rangle=0$ means $m=l$ in each $l$ component: $|\psi\rangle=\sum_lc_l|n,l,l\rangle$.'),
    ('(ii) Commutators.', r'From $[L_j,J_k]=i\hbar\varepsilon_{jkl}J_l$: $[L_+,J_+]=0$, $[L_3,J_+]=\hbar J_+$, $[L_-,J_+]=-2\hbar J_3$. So $J_+|n,l,l\rangle$ has $L_3=\hbar(l+1)$ and is killed by $L_+$: it is a highest weight of spin $l+1$, $\propto|n,l+1,l+1\rangle$. Then $J_+|\psi\rangle=0$ forces $c_l=0$ unless $l$ is maximal: $|\psi\rangle=|n,n-1,n-1\rangle$.'),
    ('(iii) Explicit check.', r'For $l=n-1$, $u_{n,n-1}\propto r^ne^{-r/na_0}$ (no radial nodes) and $Y_{n-1,n-1}\propto\sin^{n-1}\theta e^{i(n-1)\varphi}$, giving the stated $\psi$ with $\frac{m\kappa}{\hbar^2}=\frac1{a_0}$. With $J_+=\frac im(p_3L_+-\hbar p_+-p_+L_3)-\kappa\sin\theta e^{i\varphi}$ and the given $p_+$, $L_+\psi=0$, $L_3\psi=\hbar(n-1)\psi$, the remaining terms cancel: $J_+\psi=0$.'),
    ('(v) The multiplet.', r'$|\psi\rangle$ has $S_3=D_3=\frac{n-1}2$: spin $j=\frac{n-1}2$ for both su(2)s. The eigenspace is spanned by $S_-^aD_-^b|\psi\rangle$, $0\le a,b\le n-1$: dimension $(2j+1)^2=n^2$.')],
   [r'$S_+,D_+$ conditions $\Leftrightarrow$ $L_+,J_+$', r'$[L_3,J_+]=\hbar J_+$, $[L_+,J_+]=0$', r'$J_+$ raises $l$ by one', r'highest weight $|n,n-1,n-1\rangle$', r'$n^2$ from $(2j+1)^2$, $j=\frac{n-1}2$']),
 Q(2, 'Spinors', 'angular-momentum-spin', ['qm-am-D5', 'qm-am-c1', 'qm-am-L2'],
   r'(i) A spin-$\frac12$ state has $\langle\vec\sigma\rangle=\vec e$ (unit vector). Find $|\chi\rangle$. (ii) Probability that $S_z$ gives $+\hbar/2$?',
   [('(i) State.', r'With $\vec e=(\sin\theta\cos\varphi,\sin\theta\sin\varphi,\cos\theta)$: $|\chi\rangle=\binom{\cos\frac\theta2}{e^{i\varphi}\sin\frac\theta2}$ (up to a phase), the $+1$ eigenvector of $\vec e\cdot\vec\sigma$; check $\langle\sigma_3\rangle=\cos^2\frac\theta2-\sin^2\frac\theta2=\cos\theta$.'),
    ('(ii) Probability.', r'$P(S_z=+\frac\hbar2)=\cos^2\frac\theta2=\frac{1+e_z}{2}$.')],
   [r'half angles in the spinor', r'eigenvector of $\vec e\cdot\vec\sigma$', r'$P=\cos^2\frac\theta2$']),
 Q(3, 'Addition of spins', 'spin-addition-stern-gerlach', ['qm-sa-L2', 'qm-sa-D1', 'lab-qm-cgadd'],
   r'Decompose $D_{1/2}\otimes D_1$ into irreducible representations.',
   [('Count and decompose.', r'Dimension $2\times3=6$; total $m$ ranges over $\pm\frac32,\pm\frac12$ with multiplicities $1,2$: $D_{1/2}\otimes D_1=D_{3/2}\oplus D_{1/2}$ ($4+2=6$), as the Clebsch-Gordan series $|j_1-j_2|\le j\le j_1+j_2$ says.')],
   [r'dimension count $6=4+2$', r'$D_{3/2}\oplus D_{1/2}$']),
])

S(12, 'Stern-Gerlach, vectors and tensors, Clebsch-Gordan', '2025-12-10', [
 Q(1, 'Stern-Gerlach experiment', 'spin-addition-stern-gerlach', ['qm-sa-L1', 'qm-sa-b3', 'qm-sa-p1'],
   r'Sketch the screen of Stern-Gerlach experiments with molecules made of (i) two spin-$\frac12$ atoms, (ii) three spin-$\frac12$ atoms.',
   [('(i) Two spins.', r'$D_{1/2}\otimes D_{1/2}=D_1\oplus D_0$; the deflection measures total $m$: three spots $m=+1,0,-1$, intensities $1:2:1$ for unpolarised molecules (the middle spot holds $m=0$ of the triplet and the singlet).'),
    ('(ii) Three spins.', r'$D_{1/2}^{\otimes3}=D_{3/2}\oplus2D_{1/2}$: four spots $m=\pm\frac32,\pm\frac12$ with intensities $1:3:3:1$ (an even number of spots: half-integer total spin).')],
   [r'deflection $\propto$ total $m$', r'$1:2:1$ for two spins', r'$1:3:3:1$ for three spins']),
 Q(2, 'Vectors and tensors', 'angular-momentum-spin', ['qm-am-L4', 'qm-am-L1'],
   r'(i) Show that the so(3) representation of the defining SO(3) action is spin 1 ($M_j=i\frac{d}{d\varphi}R_j(\varphi)|_0$). (ii) Show that $\vec x$ and $\vec p$ transform as vectors under $O\mapsto\hbar^{-1}[L_j,O]$. (iii) Highest and lowest weight components of a vector (spherical basis). (iv) Decompose $S^2D_1$. (v) Combine two vectors $\vec J,\vec K$ symmetrically into a scalar $S$ and a tensor $T$.',
   [('(i) Spin 1.', r'$(M_j)_{kl}=-i\varepsilon_{jkl}$; $M_3$ has eigenvalues $-1,0,1$ and $\vec M^2=2=1(1+1)$: the 3-dimensional irrep $D_1$.'),
    ('(ii) $x$, $p$.', r'$[L_j,x_k]=i\hbar\varepsilon_{jkl}x_l$, $[L_j,p_k]=i\hbar\varepsilon_{jkl}p_l$: exactly the action of $M_j$ (up to the factor $i$ convention): vector operators.'),
    ('(iii) Spherical basis.', r'$J_{\pm1}=\mp\frac1{\sqrt2}(J_1\pm iJ_2)$, $J_0=J_3$: $J_{+1}$ is highest weight ($[L_+,J_{+1}]=0$), $J_{-1}$ lowest.'),
    ('(iv)-(v) Symmetric square.', r'$S^2D_1$ has dimension 6 $=D_2\oplus D_0$ (a tensor and a scalar; the antisymmetric part would be $D_1$). Scalar $S=\vec J\cdot\vec K$; tensor $T_{ij}=\frac12(J_iK_j+J_jK_i)-\frac13\delta_{ij}\vec J\cdot\vec K$ (symmetric, traceless: 5 components).')],
   [r'$M_j$ give spin 1', r'$[L_j,x_k]=i\hbar\varepsilon_{jkl}x_l$', r'spherical components', r'$S^2D_1=D_2\oplus D_0$', r'traceless symmetric $T_{ij}$']),
 Q(3, 'Clebsch-Gordan coefficients', 'spin-addition-stern-gerlach', ['qm-sa-D4', 'qm-sa-c3', 'qm-sa-L4', 'lab-qm-cgadd'],
   r'(i) Prove $\langle l,\frac12,m\mp\frac12,\pm\frac12|l,\frac12,l+\frac12,m\rangle=\sqrt{\frac{l\pm m+\frac12}{2l+1}}$. (ii) For $l=1$ write the states $|j=\frac32,j_z\rangle$ in terms of $|m,s\rangle$.',
   [('(i) Highest state and recursion.', r'$|l+\frac12,l+\frac12\rangle=|l,\uparrow\rangle$ (coefficient 1). Apply $J_-=L_-+S_-$ repeatedly; the recursion relates neighbouring coefficients, $\frac{c(m-1)}{c(m)}=\sqrt{\frac{l+m-\frac12}{l+m+\frac12}}$ for the $\uparrow$ part, which telescopes to $\sqrt{\frac{l+m+\frac12}{2l+1}}$; normalisation (or the other recursion) gives the $\downarrow$ coefficient $\sqrt{\frac{l-m+\frac12}{2l+1}}$.'),
    ('(ii) $l=1$.', r'$|\frac32,\frac32\rangle=|1,\uparrow\rangle$, $|\frac32,\frac12\rangle=\sqrt{\frac23}|0,\uparrow\rangle+\sqrt{\frac13}|1,\downarrow\rangle$, $|\frac32,-\frac12\rangle=\sqrt{\frac13}|-1,\uparrow\rangle+\sqrt{\frac23}|0,\downarrow\rangle$, $|\frac32,-\frac32\rangle=|-1,\downarrow\rangle$ (the $j=\frac12$ states are the orthogonal combinations).')],
   [r'start at the highest weight', r'recursion with $J_-$', r'$\sqrt{(l\pm m+\frac12)/(2l+1)}$', r'explicit $l=1$ quartet']),
])

S(13, 'Time-energy, Zeno, Hardy', '2025-12-17', [
 Q(1, 'Time-energy uncertainty', 'formalism-and-uncertainty', ['qm-fu-L4', 'qm-fu-L3'],
   r'(i) Show $\langle\psi|\psi(t)\rangle=\exp\left[-\frac{it}\hbar\langle H\rangle-\frac{t^2}{2\hbar^2}(\Delta H)^2\right](1+O(|t|^3))$. (ii) Show $P[\text{no change}]=\exp(-(\Delta H)^2t^2/\hbar^2)(1+O(|t|^3))$. (iii) What if $|\psi\rangle$ is an eigenstate of $H$?',
   [('(i) Expand both sides.', r'$\langle\psi|e^{-iHt/\hbar}|\psi\rangle=1-\frac{it}\hbar\langle H\rangle-\frac{t^2}{2\hbar^2}\langle H^2\rangle+O(t^3)$; the exponential gives the same with $\langle H^2\rangle=(\Delta H)^2+\langle H\rangle^2$.'),
    ('(ii)-(iii) Survival probability.', r'$|\langle\psi|\psi(t)\rangle|^2$: the phase drops out, $e^{-(\Delta H)^2t^2/\hbar^2}$: the decay time is $\sim\hbar/\Delta H$. For an eigenstate $P=1$ for all $t$, consistent since $\Delta H=0$.')],
   [r'Taylor expansion to $t^2$', r'$\langle H^2\rangle=(\Delta H)^2+\langle H\rangle^2$', r'time scale $\hbar/\Delta H$']),
 Q(2, 'Quantum Zeno effect', 'formalism-and-uncertainty', ['qm-fu-L2'],
   r'$U_t=e^{-iHt/\hbar}$, $P=|\phi\rangle\langle\phi|$. (i) Show $PU_{t/n}P\cdots U_{t/n}P=\langle\phi|U_{t/n}|\phi\rangle^nP$. (ii) Show $\langle\phi|U_{t/n}|\phi\rangle^n=e^{-i\langle H\rangle t/\hbar}(1+O(t^2/n))$. (iii) Deduce the limit $n\to\infty$ and interpret.',
   [('(i) Projectors.', r'Each $P\,U\,P=|\phi\rangle\langle\phi|U|\phi\rangle\langle\phi|$: $n$ numbers $\langle\phi|U_{t/n}|\phi\rangle$ times $P$.'),
    ('(ii)-(iii) Limit.', r'By Q1, $\langle\phi|U_{t/n}|\phi\rangle=e^{-i\langle H\rangle t/n\hbar}(1+O(t^2/n^2))$; to the power $n$: $(1+O(t^2/n^2))^n=1+O(t^2/n)\to1$. So the limit is $e^{-i\langle H\rangle t/\hbar}P$: continuous measurement freezes the state (watched pot).')],
   [r'$PUP=\langle\phi|U|\phi\rangle P$', r'$(1+O(1/n^2))^n\to1$', r'freezing by repeated measurement']),
 Q(3, 'Hardy’s paradox', 'entanglement-lab', ['qm-ent-L4', 'qm-ent-L1', 'qm-ent-D3'],
   r'$|\psi\rangle=\frac1{\sqrt3}(|++\rangle+|-+\rangle+|--\rangle)$. Alice measures $A_0$ (basis $|\pm\rangle$) or $A_1$ (basis $|\pm\hat n\rangle=\frac1{\sqrt2}(|+\rangle\pm|-\rangle)$), Bob $B_0$ ($|\pm\rangle$) or $B_1$ ($|+\hat m\rangle=\frac1{\sqrt5}(2|+\rangle+|-\rangle)$, $|-\hat m\rangle=\frac1{\sqrt5}(|+\rangle-2|-\rangle)$). (i) Show $|\psi\rangle\propto|+\hat n\rangle(2|+\rangle+|-\rangle)-|-\hat n\rangle|-\rangle$. (ii) Show $P[a_0>b_0]=P[b_0>a_1]=P[a_1>b_1]=0$. (iii) Classically that implies $P[a_0>b_1]=0$. (iv) Show quantum mechanically $P[a_0>b_1]>0$.',
   [('(i) Rewrite.', r'$|\pm\rangle$ in terms of $|\pm\hat n\rangle$: $|\psi\rangle=\frac{1}{\sqrt6}\left[|+\hat n\rangle(2|+\rangle+|-\rangle)-|-\hat n\rangle|-\rangle\right]$.'),
    ('(ii) Three zeros.', r'$a_0=+1$ leaves $|++\rangle$: $b_0=+1$ surely. $a_1=-1$ leaves $|-\hat n\rangle|-\rangle$: $b_0=-1$ surely. $a_1=+1$ leaves $|+\hat n\rangle\propto|+\hat n\rangle|+\hat m\rangle$: $b_1=+1$ surely.'),
    ('(iii)-(iv) The contradiction.', r'Classically $a_0\le b_0\le a_1\le b_1$ always, so $a_0\le b_1$. Quantum: $a_0=+1$ (probability $\frac13$) leaves $|+\rangle$ for Bob, and $|\langle-\hat m|+\rangle|^2=\frac15$: $P[a_0>b_1]=\frac1{15}>0$. The values of non-commuting observables cannot all exist at once (no joint distribution).')],
   [r'rewriting in the $\hat n$ basis', r'post-measurement states for the three zeros', r'classical chain $a_0\le b_0\le a_1\le b_1$', r'$P=1/15$']),
])

S(14, 'Perturbation theory: anharmonic, Stark, spin-orbit and Zeeman', '2025-12-24', [
 Q(1, 'Anharmonic oscillator', 'perturbation-forge', ['qm-ho-c1', 'qm-pf-L1', 'qm-pf-D1', 'qm-ho-L2'],
   r'$H=H_0+\lambda(x/x_0)^4$, $x_0=\sqrt{\hbar/m\omega}$. (i) Write $H$ with $a,a^\dagger$. (ii) Matrix elements of $H_a$ and the first-order shift. (iii) Energies to second order in $\lambda$. (iv) Why does perturbation theory fail for large $n$?',
   [('(i) Ladder operators.', r'$x/x_0=(a+a^\dagger)/\sqrt2$: $H=\hbar\omega(a^\dagger a+\frac12)+\frac\lambda4(a+a^\dagger)^4$.'),
    ('(ii) First order.', r'Non-zero: $\langle n\pm4|$, $\langle n\pm2|$, $\langle n|$. Normal ordering gives $\langle n|(a+a^\dagger)^4|n\rangle=6n^2+6n+3$: $E^{(1)}_n=\frac{3\lambda}4(2n^2+2n+1)$.'),
    ('(iii) Second order.', r'$E_n^{(2)}=\sum_{k=\pm2,\pm4}\frac{|\langle n+k|H_a|n\rangle|^2}{-k\hbar\omega}=-\frac{\lambda^2}{8\hbar\omega}(34n^3+51n^2+59n+21)$; ground state $E_0=\hbar\omega\left[\frac12+\frac34\frac{\lambda}{\hbar\omega}-\frac{21}8\left(\frac{\lambda}{\hbar\omega}\right)^2\right]$.'),
    ('(iv) Large $n$.', r'$E^{(1)}_n/E^{(0)}_n\sim\frac{3\lambda n}{\hbar\omega}$ grows: at large amplitudes $x^4$ dominates $x^2$, so it is no longer a small perturbation (and the series is only asymptotic: for $\lambda<0$ the potential is unbounded).')],
   [r'$H_a=\frac\lambda4(a+a^\dagger)^4$', r'$E^{(1)}=\frac{3\lambda}4(2n^2+2n+1)$', r'second-order sum over $\pm2,\pm4$', r'$-\frac{\lambda^2}{8\hbar\omega}(34n^3+51n^2+59n+21)$', r'why it fails at large $n$']),
 Q(2, 'Stark effect', 'perturbation-forge', ['qm-pf-L2', 'qm-pf-D4', 'qm-pf-c1'],
   r'Hydrogen in a field $\vec E$: $\Delta H=-e\vec E\cdot\vec x$ ($e<0$). Use degenerate perturbation theory for $n=2$: energy shifts and eigenstates to first order.',
   [('Selection rules.', r'Take $\vec E=E\hat z$, $\Delta H=-eEz$. $z$ is odd (parity) and commutes with $L_z$: only $\langle200|z|210\rangle$ survives in the 4-dimensional $n=2$ space.'),
    ('Matrix element.', r'$\langle200|z|210\rangle=-3a_0$ (radial integral with the given $\Psi_{2,0,0}$, $\Psi_{2,1,0}$).'),
    ('Diagonalise.', r'The $2\times2$ block $\begin{pmatrix}0&3eEa_0\\3eEa_0&0\end{pmatrix}$: $\Delta E=\pm3|e|Ea_0$ for $\frac1{\sqrt2}(|200\rangle\mp|210\rangle)$ (signs depend on the convention for $e$); $|21\pm1\rangle$ unshifted. A linear Stark effect, because of the $\ell$ degeneracy of hydrogen.')],
   [r'parity and $L_z$ selection rules', r'$\langle200|z|210\rangle=-3a_0$', r'$\pm3|e|Ea_0$ and mixed states', r'$m=\pm1$ unchanged']),
 Q(3, 'Spin-orbit coupling and Zeeman effect', 'hydrogen-lamp', ['qm-hl-L4', 'qm-hl-D5', 'qm-hl-c3', 'qm-hl-b3', 'lab-qm-zeeman'],
   r'$\Delta H=H_{SO}+H_Z=\frac{1}{2m_e^2c^2}\frac1r\frac{dV}{dr}\vec L\cdot\vec S+\frac{\mu_BB_z}{\hbar}(L_z+2S_z)$. (i) Paschen-Back: $H_Z$ dominates; first-order spin-orbit shift; how large must $B_z$ be? (ii) Both as perturbation: diagonalise the $2\times2$ blocks. (iii) For $B_z=0$ recover spin-orbit; to first order in $B_z$ show $\Delta E=g_{\ell j}\mu_BB_zm_j$ with $g_{\ell,\ell\pm1/2}=\frac{2\ell+1\pm1}{2\ell+1}$.',
   [('(i) Strong field.', r'Basis $|n\ell mm_s\rangle$: $E=\mu_BB_z(m+2m_s)+\xi_{n\ell}\hbar^2mm_s$, with $\xi_{n\ell}=\frac{e^2}{2m_e^2c^2}\langle r^{-3}\rangle$ and $\langle r^{-3}\rangle=\frac{1}{a_0^3n^3\ell(\ell+\frac12)(\ell+1)}$ (only $L_zS_z$ of $\vec L\cdot\vec S$ has diagonal elements). Valid when $\mu_BB\gg$ fine-structure splitting $\sim\alpha^2\mathrm{Ry}/n^3$: of order a tesla or more.'),
    ('(ii) Blocks.', r'$[\vec L^2,\Delta H]=[L_z+S_z,\Delta H]=0$: for fixed $\ell$ and $m_j=m+m_s$ only $|m_j-\frac12,\uparrow\rangle$, $|m_j+\frac12,\downarrow\rangle$ mix; diagonalising each $2\times2$ block gives the Breit-Rabi type formulas interpolating between weak and strong field.'),
    ('(iii) Weak field.', r'$B=0$: $\vec L\cdot\vec S=\frac{\hbar^2}2[j(j+1)-\ell(\ell+1)-\frac34]$. First order in $B$: $\langle L_z+2S_z\rangle=\hbar m_j\left(1+\frac{\langle\vec S\cdot\vec J\rangle}{\hbar^2j(j+1)}\right)$ (projection theorem), giving $g=\frac{2\ell+2}{2\ell+1}$ for $j=\ell+\frac12$ and $\frac{2\ell}{2\ell+1}$ for $j=\ell-\frac12$.')],
   [r'Paschen-Back energies $\mu_BB(m+2m_s)+\xi\hbar^2mm_s$', r'criterion $\mu_BB\gg$ fine structure', r'$2\times2$ blocks at fixed $m_j$', r'Landé factors $g_{\ell,\ell\pm1/2}$']),
])
