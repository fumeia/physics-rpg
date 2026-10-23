# Harmonic oscillator: script Ch. 6, sheets 6 (Q3), 7, 9 (Q1, Q4), 10 (Q1), 14 (Q1), exams

Sources: `scripts/QM25...pdf` Ch. 6 (pp. 59-66); `exercises|solutions/ 6, 7, 9, 10, 14`; exams HS25 Q3, HS23 Q4, FS19 Q2 + Q4, FS26/FS24/FS22 (see `perturbation-theory.md`).
Read from the text layer and cross-checked against the solutions; formulas below were re-derived or checked numerically
(`game/test/content-check-qm.mjs`).

## Conventions (lecturer's notation wins)
- Script (6.3): dimensionless $x=\sqrt{m\omega/\hbar}\,q$, $p=-i\sqrt{m\hbar\omega}\,\partial_x$, so $H=\frac{\hbar\omega}{2}(-\partial_x^2+x^2)$.
- Ladder operators (6.14): $a=\frac1{\sqrt2}(x+\partial_x)=\sqrt{\tfrac{m\omega}{2\hbar}}\,q+\tfrac{i}{\sqrt{2m\hbar\omega}}\,p$, $\ a^\dagger=\frac1{\sqrt2}(x-\partial_x)$, $[a,a^\dagger]=1$.
- Inverse: $q=\sqrt{\tfrac{\hbar}{2m\omega}}(a+a^\dagger)$, $\ p=i\sqrt{\tfrac{m\hbar\omega}{2}}(a^\dagger-a)$ (HS25 Q3, FS19 Q2 write the same thing as $p=-i\sqrt{\hbar m\omega/2}\,(a-a^\dagger)$). The exams (Renner HS23) call the position operator $\hat X$ and write $\hat a^*$ for $a^\dagger$.
- $H=\hbar\omega(a^\dagger a+\tfrac12)=\frac{\hbar\omega}2(aa^\dagger+a^\dagger a)$, $N=a^\dagger a$.

## 1. The algebraic solution (script 6.1.2)
- $[N,a^\dagger]=a^\dagger$, $[N,a]=-a$ $\Rightarrow$ $a^\dagger|n\rangle$ and $a|n\rangle$ are eigenvectors of $N$ with eigenvalue $n\pm1$.
- Normalisation (6.25): $\langle n|a^\dagger a|n\rangle=n$, $\langle n|aa^\dagger|n\rangle=n+1$, so $a|n\rangle=\sqrt n|n-1\rangle$, $a^\dagger|n\rangle=\sqrt{n+1}|n+1\rangle$.
- Spectrum: $n=\|a|n\rangle\|^2\ge0$ and $a^k|n\rangle\propto|n-k\rangle$ has eigenvalue $n-k$; the chain can only stop if it hits $a|0\rangle=0$, so $n\in\{0,1,2,\dots\}$. $E_n=\hbar\omega(n+\tfrac12)$, $|n\rangle=\frac{(a^\dagger)^n}{\sqrt{n!}}|0\rangle$.
- Wave functions: $a|0\rangle=0\Leftrightarrow(x+\partial_x)\psi_0=0\Rightarrow\psi_0=\pi^{-1/4}e^{-x^2/2}$; $\psi_n=\frac{1}{\sqrt{2^nn!\sqrt\pi}}H_n(x)e^{-x^2/2}$, $H_0=1,H_1=2x,H_2=4x^2-2,H_3=8x^3-12x$ (6.33). In $q$: $\langle q|n\rangle=\sqrt{\tfrac{m\omega}{\pi\hbar}}\frac{1}{\sqrt{2^nn!}}H_n(\sqrt{m\omega/\hbar}\,q)e^{-m\omega q^2/2\hbar}$ (6.34).
- Series solution (script 6.1.1): $\psi=H(x)e^{-x^2/2}$, $H''-2xH'+(\lambda-1)H=0$, $\lambda=2E/\hbar\omega$; recursion $(s+n+2)(s+n+1)a_{n+2}=(2s+2n+1-\lambda)a_n$; $a_{n+2}/a_n\to2/n$ gives $e^{x^2}$, so the series must terminate: $\lambda_n=2n+1$.
- Classical limit (6.2): $W_{cl}(q)=\frac{1}{\pi q_0\sqrt{1-(q/q_0)^2}}$, $E=\tfrac12m\omega^2q_0^2$; $|\psi_{10}|^2$ averaged over the fast oscillations follows it (Fig. 11).

## 2. Matrix elements, Heisenberg picture (HS23 Q4, HS25 Q3, FS19 Q2)
- $\langle n|\hat X|m\rangle=\sqrt{\tfrac\hbar{2m\omega}}(\sqrt{m+1}\,\delta_{n,m+1}+\sqrt m\,\delta_{n,m-1})$, $\langle n|\hat P|m\rangle=i\sqrt{\tfrac{m\hbar\omega}2}(\sqrt{m+1}\,\delta_{n,m+1}-\sqrt m\,\delta_{n,m-1})$.
- $\langle x^2\rangle_n=\frac{\hbar}{2m\omega}(2n+1)$, $\langle p^2\rangle_n=\frac{m\hbar\omega}2(2n+1)$, $\Delta x\Delta p=\hbar(n+\frac12)\ge\hbar/2$; $\langle T\rangle=\langle V\rangle=E_n/2$ (virial).
- Heisenberg picture: $\frac{d}{dt}\hat O_H=\frac1{i\hbar}[\hat O_H,\hat H]+(\partial_t\hat O)_H$. For $H=P^2/2m+\frac12m\omega^2X^2$: $\dot X_H=P_H/m$, $\dot P_H=-m\omega^2X_H$, so
  $X_H(t)=X\cos\omega t+\frac{P}{m\omega}\sin\omega t$, $P_H(t)=P\cos\omega t-m\omega X\sin\omega t$ and $a_H(t)=a\,e^{-i\omega t}$. (HS23 Q4(c), 8 pt; the proof uses $U^\dagger[X,P^2]U$ and the fact that $U$ commutes with $H$.)
- $|\psi\rangle=\exp(rP/i\hbar)|0\rangle$ = ground state translated by $+r$ (generator of translations), $\langle X_H(t)\rangle=r\cos\omega t$ (HS23 Q4(d)): $r$ is the classical amplitude (release from rest at $x=r$).
- FS19 Q2(iv)-(v): in a stationary state $\langle x\rangle$ is constant (=0) hence $\langle p\rangle=m\,d\langle x\rangle/dt=0$; for $\Psi=A\Psi_0+B\Psi_1$ ($A,B$ real): $\langle x\rangle=2AB\sqrt{\hbar/2m\omega}\cos\omega t$, $\langle p\rangle=-2AB\sqrt{m\hbar\omega/2}\sin\omega t$; with $\Psi_2$ instead of $\Psi_1$ the cross term $\langle0|x|2\rangle=0$ and $\langle x\rangle=0$ (selection rule $\Delta n=\pm1$, parity).

## 3. Coherent states (sheet 7 Q2)
- $a|\alpha\rangle=\alpha|\alpha\rangle$, $\langle\alpha|\alpha\rangle=1$. Recurrence $\alpha c_n=\sqrt{n+1}c_{n+1}\Rightarrow c_n=\frac{\alpha^n}{\sqrt{n!}}c_0$, $|c_0|=e^{-|\alpha|^2/2}$: $|\alpha\rangle=e^{-|\alpha|^2/2}e^{\alpha a^\dagger}|0\rangle$. Photon-number distribution is Poisson, $P_n=e^{-|\alpha|^2}|\alpha|^{2n}/n!$, $\langle N\rangle=|\alpha|^2$.
- Time evolution: $|\alpha\rangle(t)=e^{-i\omega t/2}|\alpha e^{-i\omega t}\rangle$: stays coherent; the phase of $\alpha$ rotates (the global phase $e^{-i\omega t/2}$ is unphysical, the phase of $\alpha$ is physical).
- $\langle x\rangle(t)=\sqrt{2\hbar/m\omega}\,\mathrm{Re}\,\alpha(t)=\sqrt{2\hbar/m\omega}\,|\alpha|\cos(\omega t-\varphi_0)$, $\langle p\rangle(t)=-\sqrt{2m\hbar\omega}\,|\alpha|\sin(\omega t-\varphi_0)$ (the classical orbit; Ehrenfest + $\langle V'\rangle=V'(\langle x\rangle)$).
- $\langle x^2\rangle=\frac\hbar{2m\omega}(1+2|\alpha|^2+\alpha^2+\bar\alpha^2)$ etc. $\Rightarrow(\Delta x)^2=\hbar/2m\omega$, $(\Delta p)^2=m\hbar\omega/2$, $\Delta x\Delta p=\hbar/2$ for all $\alpha$ and all $t$.
- Completeness: $\int\frac{d\alpha^*d\alpha}{2\pi i}|\alpha\rangle\langle\alpha|=\mathbb 1$ with $d\alpha^*d\alpha=2i\,d(\mathrm{Re}\alpha)d(\mathrm{Im}\alpha)$, i.e. $\int\frac{d^2\alpha}{\pi}|\alpha\rangle\langle\alpha|=\mathbb 1$ (polar coordinates and $\int_0^\infty e^{-u}u^ndu=n!$). The $|\alpha\rangle$ are overcomplete (not orthogonal).
- $\langle x|\alpha\rangle\propto\exp[-\frac{m\omega}{2\hbar}(x-\sqrt{2\hbar/m\omega}\,\alpha)^2]$: a Gaussian of the ground-state width centred at $\sqrt{2\hbar/m\omega}\,\alpha$ (complex $\alpha$ = also a momentum kick).

## 4. 2D and 3D oscillators, degeneracy, hidden symmetry (sheets 7 Q1, Q3; 8 Q3; 9 Q4; 10 Q1)
- 2D: $H=\hbar\omega(a^\dagger a+b^\dagger b+1)$, $|m,n\rangle=\frac{(a^\dagger)^m(b^\dagger)^n}{\sqrt{m!n!}}|0,0\rangle$, $E=\hbar\omega(m+n+1)$, vacuum $\psi_0(x,y)=\pi^{-1/2}e^{-(x^2+y^2)/2}$.
- Rotation of the ladder operators $(a,b)\to R(\varphi)(a,b)$ leaves $H$ invariant ($R^TR=1$) and rotates $(x,y)$ by the same matrix. Generator $J=a^\dagger b-b^\dagger a$ ($[J,a]=-b$, $[J,b]=a$), anti-Hermitian: $J=iL_z/\hbar$. $[H,J]=0$. On $E\le2\hbar\omega$: $J|1,0\rangle=-|0,1\rangle$, $J|0,1\rangle=|1,0\rangle$; eigenvectors $|0,0\rangle$ ($J=0$), $\frac1{\sqrt2}(|1,0\rangle\pm i|0,1\rangle)$ with $J=\pm i$, i.e. $L_z=\pm\hbar$.
- Schwinger construction (sheet 8 Q3): $J_3=\frac12(a^\dagger a-b^\dagger b)$, $J_+=a^\dagger b$, $J_-=b^\dagger a$ satisfy $[J_3,J_\pm]=\pm J_\pm$, $[J_+,J_-]=2J_3$; $\vec J^2=\frac N2(\frac N2+1)$ with $N=N_a+N_b$; $j=(n_a+n_b)/2$, $m=(n_a-n_b)/2$, $|j,m\rangle=\frac{(a^\dagger)^{j+m}(b^\dagger)^{j-m}}{\sqrt{(j+m)!(j-m)!}}|0\rangle$. Level $N$ of the 2D oscillator is the spin-$N/2$ irrep: degeneracy $N+1$.
- Counting (sheet 7 Q3): $F^k(s)=\sum_nD^k_ns^n=(1-s)^{-k}$ (product of $k$ geometric series), $D^k_n=\binom{n+k-1}{n}$. 2D: $n+1$; 3D: $\binom{n+2}{2}=\frac{(n+1)(n+2)}2$.
- 3D (sheet 9 Q4): $J_{ij}=a_i^\dagger a_j$ commute with $H=\hbar\omega(\sum a_i^\dagger a_i+\frac32)$ and form $u(3)$. Cartan $h_1=E_{11}-E_{22}$, $h_2=E_{22}-E_{33}$; positive roots $(2,-1),(1,1),(-1,2)$. Level $N$ = symmetric tensors = irrep with highest weight $|N,0,0\rangle$, $\lambda(h_1)=N$, $\lambda(h_2)=0$, dimension $\frac{(N+1)(N+2)}2$.
- Spherical coordinates (sheet 10 Q1): $\Psi=\frac{u(r)}rY_{\ell m}$; $-u''+[\ell(\ell+1)/r^2+(m\omega/\hbar)^2r^2]u=\epsilon u$, $\epsilon=2mE/\hbar^2$. $u\sim r^{\ell+1}$ ($r\to0$, the $r^{-\ell}$ solution is not square integrable; for $\ell=0$ it would need a $\delta$-potential), $u\sim e^{-m\omega r^2/2\hbar}$ ($r\to\infty$; unlike hydrogen $e^{-\kappa r}$: the potential grows, no scattering states). Ansatz $u=e^{-\alpha r^2/2}\sum_{k\ge\ell+1}c_kr^k$, $\alpha=m\omega/\hbar$: $c_{k+2}=\frac{\alpha(2k+1)-\epsilon}{(k+2)(k+1)-\ell(\ell+1)}c_k$, $c_{\ell+2}=0$, so only $k-\ell$ odd. Termination at $k=\ell+1+2n_r$: $E=\hbar\omega(2n_r+\ell+\tfrac32)$. Degeneracy of level $N=2n_r+\ell$: $\sum_{\ell=N,N-2,\dots}(2\ell+1)=\frac{(N+1)(N+2)}2$, same as Cartesian.

## 5. SUSY factorisation: sech$^2$ potential (sheet 9 Q1)
$V=-\frac{\hbar^2}m\mathrm{sech}^2x$, $\epsilon=2mE/\hbar^2$. With $A=\partial_x+\tanh x$, $A^\dagger=-\partial_x+\tanh x$: $A^\dagger A=-\partial_x^2+\tanh^2x-\mathrm{sech}^2x=-\partial_x^2+1-2\,\mathrm{sech}^2x$, so $H\psi=E\psi\Leftrightarrow A^\dagger A\psi=(\epsilon+1)\psi$. $A^\dagger A\ge0$ (as $\langle\chi|A^\dagger A\chi\rangle=\|A\chi\|^2$) $\Rightarrow\epsilon\ge-1$; saturated by $A\psi_0=0$: $\psi_0'=-\tanh x\,\psi_0\Rightarrow\psi_0=\frac1{\sqrt2\cosh x}$, $E_0=-\hbar^2/2m$. Same idea as $a|0\rangle=0$: factorise $H$, positivity bounds the spectrum, the zero mode is the ground state.

## 6. Other results
- Sheet 6 Q3: $\langle E\rangle=\frac{\langle p\rangle^2+(\Delta p)^2}{2m}+\frac k2(\langle x\rangle^2+(\Delta x)^2)\ge\frac{(\Delta p)^2}{2m}+\frac k2(\Delta x)^2\ge2\sqrt{\frac{k}{4m}}\Delta x\Delta p\ge\frac\hbar2\sqrt{k/m}$ (AM-GM: $A+B\ge2\sqrt{AB}$), equality for the oscillator ground state.
- Sheet 9 Q2: $Z(\beta)=\mathrm{tr}\,e^{-\beta H}<\infty\Rightarrow$ discrete spectrum; Golden-Thompson $\mathrm{tr}\,e^{A+B}\le\mathrm{tr}\,e^Ae^B$ gives $Z(\beta)\le Z_{cl}(\beta)=(2\pi\hbar)^{-d}\int d^dq\,d^dp\,e^{-\beta H}$; a sufficient condition is $\int d^dq\,e^{-\beta V}<\infty\ \forall\beta>0$, true for $V=\nu\|q\|^\alpha$ (substitute $t=\beta\nu r^\alpha$: $\frac1\alpha(\beta\nu)^{-d/\alpha}\Gamma(d/\alpha)$).
- Sheet 14 Q1 (anharmonic $H_a=\lambda(x/x_0)^4$, $x_0=\sqrt{\hbar/m\omega}$): $H_a=\frac\lambda4(a+a^\dagger)^4$; non-zero matrix elements $\Delta n=0,\pm2,\pm4$:
  $\langle n|H_a|n\rangle=\frac\lambda4(6n^2+6n+3)$, $\langle n+2|H_a|n\rangle=\frac\lambda4\sqrt{(n+1)(n+2)}(4n+6)$, $\langle n+4|H_a|n\rangle=\frac\lambda4\sqrt{(n+1)(n+2)(n+3)(n+4)}$.
  $E_n=\hbar\omega(n+\tfrac12)+\frac{3\lambda}4(2n^2+2n+1)-\frac{\lambda^2}{8\hbar\omega}(34n^3+51n^2+59n+21)+O(\lambda^3)$ (the printed S.13 is garbled in the text layer; the closed form was checked by exact diagonalisation in the tests). Relative corrections grow like $n$ (first order) and $n^2$ (second order): $x^4$ beats $x^2$ at large $x$, perturbation theory breaks down for high $n$.
- HS25 Q3 (quadratic perturbation $\lambda\hbar\omega(a^2+a^{\dagger2})$): $E^{(1)}_n=0$; $|\Psi^{(1)}_n\rangle=\frac\lambda2\big(\sqrt{n(n-1)}|n-2\rangle-\sqrt{(n+1)(n+2)}|n+2\rangle\big)$; $E^{(2)}_n=-2\lambda^2\hbar\omega(n+\tfrac12)$. Check: $a^2+a^{\dagger2}=\frac{m\omega}\hbar q^2-\frac{p^2}{m\hbar\omega}$, so $H=(1-2\lambda)\frac{p^2}{2m}+(1+2\lambda)\frac12m\omega^2q^2$ is again an oscillator of frequency $\omega\sqrt{1-4\lambda^2}$ and $E_n=\hbar\omega\sqrt{1-4\lambda^2}(n+\frac12)=\hbar\omega(n+\frac12)(1-2\lambda^2+\dots)$ reproduces $E^{(2)}$.

## Exam map
HO + ladder: HS25 Q3 (19), HS23 Q4 (34), FS24 Q4 (30, 2D), FS22 Q4 (15, 3D degenerate PT), FS19 Q2 (24), HS22 A (short), HS16, FS16 C, HS14 D (variational HO).
