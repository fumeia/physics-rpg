# QM exercise sheets IV and V — scattering, bound states, tunneling

Sources: `exercises/Exercises 4,5.pdf`, `solutions/Solutions 4,5.pdf` (Gaberdiel HS25, same sheets as this year's course).
Solutions read via text extraction, equations cross-checked by hand. Script chapter: Ch. 3, see `ch03-simple-systems.md`.
Convention note: sheet IV uses $e^{ikx/\hbar}$ with $k=\sqrt{2mE}$ (momentum), sheet V uses $e^{ikx}$ with $k=\sqrt{2m(E-V)}/\hbar$ (wavenumber).

## Sheet IV (week 4)

### Q1 δ-function potential $V(x)=V\delta(x)$, incoming from the left
Ansatz $\psi=e^{ikx/\hbar}+Re^{-ikx/\hbar}$ ($x<0$), $Te^{ikx/\hbar}$ ($x>0$), $E=k^2/2m$.
- Continuity: $1+R=T$. Jump of $\psi'$ (integrate the equation over $[-\epsilon,\epsilon]$; $\int E\psi\to0$ since $\psi$ bounded):
$\psi'(0^+)-\psi'(0^-)=\frac{2m}{\hbar^2}V\psi(0)$.
- Result: $R=\dfrac{-imV}{\hbar k+imV}$, $T=\dfrac{\hbar k}{\hbar k+imV}$, $|R|^2+|T|^2=\dfrac{m^2V^2+\hbar^2k^2}{\hbar^2k^2+m^2V^2}=1$.
- Checks: $V\to0$ ⇒ $R=0,T=1$; $V\to\infty$ ⇒ $R\to-1,T\to0$ (hard wall). Same $R,T$ for $V<0$ (|R| unchanged): no classical-quantum difference in sign here.
- Pitfall: $\hbar k$ appears because $k$ is a momentum here; in wavenumber convention $R=-im V/(\hbar^2k+imV)$.

### Q2 Deep, narrow square well → δ-well
$V=-V_0$ for $|x|<a$, $V_0\to\infty$, $a\to0$ with $V_0a$ fixed. Ground state is even: $\psi=Ne^{-\kappa|x|}$ outside, $Nb\cos kx$ inside; matching $e^{-\kappa a}=b\cos ka$, $\kappa e^{-\kappa a}=bk\sin ka$. Since $k\sim\sqrt{V_0}$, $ka\to0$ ⇒ $b\to1$, $\kappa=bk^2a$ and $k^2a\to\frac{2m}{\hbar^2}V_0a$ ⇒
$$\kappa=\frac{2mV_0a}{\hbar^2},\qquad E_0=-\frac{\hbar^2\kappa^2}{2m}=-\frac{2m}{\hbar^2}(V_0a)^2.$$
Equivalent: potential $\to-2V_0a\,\delta(x)$ (area preserved), jump $\psi'(0^+)-\psi'(0^-)=-2\kappa\psi(0)=\frac{2m}{\hbar^2}(-2V_0a)\psi(0)$ (same result, one unique bound state). Finite, negative, no divergence.

### Q3 General 1D potentials
(i) Stationary state ⇒ $|\psi|^2$ time independent ⇒ continuity equation gives $\partial_xj=0$: $j$ is constant in $x$. With $\chi=e^{ikx}+Ae^{-ikx}$ ($x\ll0$), $Be^{ikx}$ ($x\gg0$): $j=\frac{\hbar k}m(1-|A|^2)$ (left), $\frac{\hbar k}m|B|^2$ (right) ⇒ $|A|^2+|B|^2=1$ (every particle is reflected or transmitted).
(ii) $\langle T\rangle=\frac{\hbar^2}{2m}\int|\partial_x\psi|^2dx\ge0$ (integrate by parts, no boundary terms), strict for a bound state (otherwise $\psi$ constant, not normalisable). ⇒ $\langle V+T\rangle>V_\min$: ground state energy of any well lies above the bottom of the well. Scattering states have $E>V(\pm\infty)$, so only bound states matter.

### Q4 Deuteron — 3D spherical well, s-wave
$V(r)=-V$ for $r<a$, $0$ outside. With $\chi=r\psi$: $-\frac{\hbar^2}{2m}\chi''+V(r)\chi=E\chi$ — the 1D well equation on the half line. Regularity at $r=0$ requires $\chi(0)=0$ ⇒ only the **odd** (sine) solutions: $\chi=2iB\sin kr$ ($r<a$), $-Ae^{-\kappa r}$ ($r\ge a$), $k=\sqrt{2m(E+V)}/\hbar$, $\kappa=\sqrt{-2mE}/\hbar$.
Matching at $r=a$: $\eta=-\xi\cot\xi$, $\xi^2+\eta^2=2ma^2V/\hbar^2$ ($\xi=ka,\eta=\kappa a$). Need $\xi>\pi/2$ for a positive $\eta$ ⇒
$$\text{bound state exists}\iff\frac{2ma^2V}{\hbar^2}>\frac{\pi^2}4.$$
So **no**, a bound state does not always exist in 3D (unlike the even states in 1D, which always exist). Figure 1 in the solution: first-quadrant curve $-\xi\cot\xi$ (starting at $\pi/2$) and circles for a small and a large $V$: only the larger circle meets the curve.

## Sheet V (week 5)

### Q1 Transfer-matrix method
$\psi_L=A_Le^{ikx}+B_Le^{-ikx}$, $\psi_R=A_Re^{iqx}+B_Re^{-iqx}$, $k=\sqrt{2m(E-V_L)}/\hbar$, $q=\sqrt{2m(E-V_R)}/\hbar$ (real or imaginary), $E\ne V_{L,R}$.
(i) **Step at $x=0$**: $A_L+B_L=A_R+B_R$, $k(A_L-B_L)=q(A_R-B_R)$. With $\eta=q/k$:
$$\begin{pmatrix}A_L\\B_L\end{pmatrix}=M\begin{pmatrix}A_R\\B_R\end{pmatrix},\qquad M=\frac12\begin{pmatrix}1+\eta&1-\eta\\1-\eta&1+\eta\end{pmatrix}.$$
(ii) **Propagation** over length $\ell=x_2-x_1$ at constant $k$ (coordinates relative to the edges): $N=\begin{pmatrix}e^{-ik\ell}&0\\0&e^{ik\ell}\end{pmatrix}$.
(iii) Piecewise constant potential with steps $M_{i,j}$ (with $\eta=k_i/k_j$... i.e. $M_{i,j}=\frac12\begin{pmatrix}1+k_i/k_j&1-k_i/k_j\\1-k_i/k_j&1+k_i/k_j\end{pmatrix}$) and propagation $N_j$ (with $e^{\mp i\ell_jk_j}$):
$$\begin{pmatrix}A_L\\B_L\end{pmatrix}=M_{n+1,n}N_nM_{n,n-1}\cdots N_2M_{2,1}N_1M_{1,0}\begin{pmatrix}A_R\\B_R\end{pmatrix}.$$
(iv) **Square well** $V=-V$ for $|x|<\ell/2$: $M_\text{full}=M^{-1}NM$ with $k=\sqrt{2mE}/\hbar$, $q=\sqrt{2m(E+V)}/\hbar$, $\eta=k/q$ ($M$ = step from the right). Entries (solution S.13):
$M_\text{full}=\begin{pmatrix}\cos q\ell-\frac i2\frac{1+\eta^2}{\eta}\sin q\ell&\frac i2\frac{1-\eta^2}{\eta}\sin q\ell\\-\frac i2\frac{1-\eta^2}{\eta}\sin q\ell&\cos q\ell+\frac i2\frac{1+\eta^2}{\eta}\sin q\ell\end{pmatrix}$.
$N=I$ iff $q\ell=2\pi n$ ⇒ $M_\text{full}=I$: perfect transmission, a resonance in which the wave "fits" into the well. (Perfect transmission, $T=1$, already happens for $q\ell=n\pi$ (script eq. 3.64, $\sin q\ell=0$): then $N=(-1)^nI$, so $M_\text{full}=(-1)^nI$ and $|t|=1$. The sheet's "$N=I$" case $q\ell=2\pi n$ is the even-$n$ subset.)
(v) **Barrier** $V>E>0$, $q=i\kappa$, $\kappa=\sqrt{2m(V-E)}/\hbar$, $\alpha=k/\kappa=\sqrt{E/(V-E)}$, boundary $A_L=1$, $B_R=0$:
$|B_L|^2+|A_R|^2=1$ (probability conservation), and
$$T=|A_R|^2=\frac1{1+\frac{(1+\alpha^2)^2}{4\alpha^2}\sinh^2\kappa\ell}=\frac1{1+\frac{V^2}{4E(V-E)}\sinh^2\kappa\ell},\qquad R=|B_L|^2=1-T.$$
Nonzero $T$ although classically $T=0$, $R=1$: tunneling. $\kappa\ell\gg1$ ⇒ $T\approx\frac{16E(V-E)}{V^2}e^{-2\kappa\ell}$ (STM exponential law). I checked $(1+\alpha^2)^2/\alpha^2=V^2/[E(V-E)]$: S.20 follows from S.19.
Cross-check with script eq. (3.63): same formula with $\ell=2a$, $|l|=\kappa$. ✓.

### Q2 Rays in $\mathbb C^2$
Vectors $|\Psi'\rangle=\mu|\Psi\rangle$ describe the same state: probability $|\langle\Phi|\Psi\rangle|^2/(\langle\Phi|\Phi\rangle\langle\Psi|\Psi\rangle)$ is scale independent. Every state except $\propto|2\rangle$ is $|1\rangle+z|2\rangle$, $z\in\mathbb C$, distinct $z$ ⇒ distinct states; $z\to\infty$ gives $|2\rangle$. State space = $\mathbb C\cup\{\infty\}$ ≅ sphere $S^2$ (Bloch sphere / $\mathbb{CP}^1$).

### Q3 Commutators
(i) $(iAB)^\dagger=-iB^\dagger A^\dagger$; for self-adjoint $A,B$: $i[A,B]$ is self-adjoint.
(ii) From $[x,p]=i\hbar$: $p^nx=xp^n-ni\hbar p^{n-1}$ ⇒ $e^{iap/\hbar}x\,e^{-iap/\hbar}=x+a$ (translation operator).
(iii) For power series $f$: $e^{iap/\hbar}f(x)e^{-iap/\hbar}=f(x+a)$; with $f=e^{ibx/\hbar}$ get **Weyl's form** $e^{iap/\hbar}e^{ibx/\hbar}=e^{iba/\hbar}e^{ibx/\hbar}e^{iap/\hbar}$.
(Rest of the solution, S.29 onwards, not transcribed; the steps are as above.)

## Quest ideas from these sheets (tunneling bridge, week 4–5 priority)
- Predict: electron of energy $E$ hits a barrier $V>E$: reflected? partly transmitted? Then compute $T$ with the exact formula above and the exponential approximation; check dimensions of $\kappa\ell$.
- Quick Fermi estimate: STM current changes by a factor $e^{2\kappa\,\Delta z}$ for a $1$ Å change in tip distance with $\kappa=\sqrt{2m\phi}/\hbar$ ($\phi\approx4$ eV ⇒ $\kappa\approx1.0$ Å$^{-1}$, factor $e^{2\kappa\Delta z}\approx7.8$ with $\kappa=1.025$ Å$^{-1}$; one order of magnitude per ~1.1 Å; checked numerically).
- Boss-level sheet-5-style problem: three-region transfer matrix chain, resonances $q\ell=n\pi$.
