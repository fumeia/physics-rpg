import { src, derive } from '../lib.mjs';
const r = String.raw;

export const derives = [
  derive({
    id: 'qm-fu-D1', title: r`Hermitian operators: i[A,B] and {A,B}, real eigenvalues`,
    source: src.exam('HS18 (EN)', 'Question 2 (i), 2 pt (plus script 4.27)'),
    goal: r`Show that $i[A,B]$ and $\{A,B\}=AB+BA$ are hermitian for hermitian $A,B$, and that the eigenvalues of a hermitian operator are real with orthogonal eigenvectors for different eigenvalues.`,
    given: [r`$A^\dagger=A$, $B^\dagger=B$`, r`$(XY)^\dagger=Y^\dagger X^\dagger$, $(cX)^\dagger=\bar cX^\dagger$`],
    steps: [
      { prompt: r`(a) Compute $(AB)^\dagger$ and $(i[A,B])^\dagger$.`, reveal: r`$(AB)^\dagger=B^\dagger A^\dagger=BA$. Hence $[A,B]^\dagger=BA-AB=-[A,B]$ (anti-hermitian) and $(i[A,B])^\dagger=-i\cdot(-[A,B])=i[A,B]$.` },
      { prompt: r`(b) Compute $\{A,B\}^\dagger$.`, reveal: r`$\{A,B\}^\dagger=(AB)^\dagger+(BA)^\dagger=BA+AB=\{A,B\}$.` },
      { prompt: r`(c) Eigenvalue equation $A\psi_n=\lambda_n\psi_n$: take $\langle\psi_m|A\psi_n\rangle$ in two ways.`, reveal: r`$\langle\psi_m|A\psi_n\rangle=\lambda_n\langle\psi_m|\psi_n\rangle$ and, by hermiticity, $=\langle A\psi_m|\psi_n\rangle=\bar\lambda_m\langle\psi_m|\psi_n\rangle$ (inner product antilinear in the first argument).` },
      { prompt: r`(d) Conclude for $m=n$ and for $\lambda_m\neq\lambda_n$.`, reveal: r`$m=n$: $(\lambda_n-\bar\lambda_n)\|\psi_n\|^2=0\Rightarrow\lambda_n\in\mathbb R$. Then $(\lambda_n-\lambda_m)\langle\psi_m|\psi_n\rangle=0$, so $\langle\psi_m|\psi_n\rangle=0$ for $\lambda_m\neq\lambda_n$.` },
    ],
    keyPoints: [r`dagger reverses the order of products and conjugates numbers`, r`commutator of hermitian operators is anti-hermitian, so $i[A,B]$ is hermitian`, r`reality of eigenvalues from $m=n$; orthogonality from $m\neq n$`],
  }),
  derive({
    id: 'qm-fu-D2', title: r`The Heisenberg uncertainty relation (HS18 Q2 (ii), 4 pt)`,
    source: src.exam('HS18 (EN)', 'Question 2 (ii), 4 pt; script 5.3'),
    goal: r`Prove $\Delta A\,\Delta B\ge\frac12|\langle i[A,B]\rangle|$ for hermitian $A,B$ in a normalised state $\psi$.`,
    given: [r`$\hat A=A-\langle A\rangle$, $\hat B=B-\langle B\rangle$ (hermitian), $(\Delta A)^2=\langle\hat A^2\rangle$`, r`Cauchy-Schwarz $\|\varphi\|^2\|\chi\|^2\ge|\langle\varphi|\chi\rangle|^2$`],
    steps: [
      { prompt: r`(a) Define the vectors for Cauchy-Schwarz and express the norms.`, reveal: r`$|\psi_A\rangle=\hat A|\psi\rangle$, $|\psi_B\rangle=\hat B|\psi\rangle$. Then $\|\psi_A\|^2=\langle\psi|\hat A^2|\psi\rangle=(\Delta A)^2$ and $\|\psi_B\|^2=(\Delta B)^2$.` },
      { prompt: r`(b) Write the inner product $\langle\psi_A|\psi_B\rangle$.`, reveal: r`$\langle\psi_A|\psi_B\rangle=\langle\psi|\hat A\hat B|\psi\rangle$ (using $\hat A^\dagger=\hat A$).` },
      { prompt: r`(c) Decompose $\hat A\hat B$ into hermitian and anti-hermitian parts.`, reveal: r`$\hat A\hat B=\frac12[\hat A,\hat B]+\frac12\{\hat A,\hat B\}$. Since $[\hat A,\hat B]=[A,B]$, $\langle\hat A\hat B\rangle=-\frac i2\langle i[A,B]\rangle+\frac12\langle\{\hat A,\hat B\}\rangle$ with both expectation values real.` },
      { prompt: r`(d) Take the modulus squared and drop the non-negative anticommutator term.`, reveal: r`$|\langle\hat A\hat B\rangle|^2=\frac14\langle i[A,B]\rangle^2+\frac14\langle\{\hat A,\hat B\}\rangle^2\ge\frac14\langle i[A,B]\rangle^2$. With Cauchy-Schwarz: $(\Delta A)^2(\Delta B)^2\ge\frac14\langle i[A,B]\rangle^2$; take the square root.` },
    ],
    keyPoints: [r`Cauchy-Schwarz applied to $\hat A\psi$ and $\hat B\psi$`, r`real part = anticommutator, imaginary part = commutator (real/imaginary parts of the same complex number)`, r`$[\hat A,\hat B]=[A,B]$: shifts by numbers do not change commutators`, r`the bound depends on the state unless $[A,B]$ is a number`],
  }),
  derive({
    id: 'qm-fu-D3', title: r`The stronger uncertainty relation (HS18 Q2 (iv), 4 pt)`,
    source: src.exam('HS18 (EN)', 'Question 2 (iv), 4 pt, eq. (15)'),
    goal: r`Prove $(\Delta A)^2(\Delta B)^2\ge\frac14\langle i[A,B]\rangle^2+\frac14\langle\{\hat A,\hat B\}\rangle^2$ and state when it is an equality.`,
    given: [r`$|\psi_A\rangle=\hat A|\psi\rangle$, $|\psi_B\rangle=\hat B|\psi\rangle$`, r`for $z=\langle\psi_A|\psi_B\rangle$: $|z|^2=(\mathrm{Re}\,z)^2+(\mathrm{Im}\,z)^2$`],
    steps: [
      { prompt: r`(a) Real and imaginary part of $z=\langle\hat A\hat B\rangle$.`, reveal: r`$\bar z=\langle\hat B\hat A\rangle$ (hermitian operators). So $\mathrm{Re}\,z=\frac12\langle\hat A\hat B+\hat B\hat A\rangle=\frac12\langle\{\hat A,\hat B\}\rangle$ and $\mathrm{Im}\,z=\frac1{2i}\langle[A,B]\rangle=-\frac12\langle i[A,B]\rangle$ (the commutator is anti-hermitian, its expectation value purely imaginary).` },
      { prompt: r`(b) Insert into $|z|^2$.`, reveal: r`$|z|^2=\frac14\langle\{\hat A,\hat B\}\rangle^2+\frac14\langle i[A,B]\rangle^2$ (the sign of the imaginary part drops out).` },
      { prompt: r`(c) Use Cauchy-Schwarz.`, reveal: r`$(\Delta A)^2(\Delta B)^2=\|\psi_A\|^2\|\psi_B\|^2\ge|z|^2$, which is eq. (15).` },
      { prompt: r`(d) Equality?`, reveal: r`Equality in Cauchy-Schwarz iff $\hat B\psi=\mu\hat A\psi$. For $\hat x,\hat p$ and $\mu=-i\kappa$ purely imaginary the anticommutator term vanishes: minimal-uncertainty (Gaussian) states.` },
    ],
    keyPoints: [r`real part of $z$ is the anticommutator, imaginary part the commutator`, r`the extra term $\frac14\langle\{\hat A,\hat B\}\rangle^2$ is the covariance`, r`for $\psi_n$ of the oscillator: $\langle\{\hat x,\hat p\}\rangle=0$, so (15) reads $(n+\frac12)^2\hbar^2\ge\hbar^2/4$`],
  }),
  derive({
    id: 'qm-fu-D4', title: r`Oscillator: $\Delta x\,\Delta p=\hbar(n+\frac12)$ (HS18 Q2 (iii), 5 pt)`,
    source: src.exam('HS18 (EN)', 'Question 2 (iii), 5 pt'),
    goal: r`Show $(\Delta x)_{\psi_n}(\Delta p)_{\psi_n}=\hbar(n+\frac12)$ with the ladder operators and say what is special at $n=0$.`,
    given: [r`$x=\sqrt{\hbar/2m\omega}\,(a+a^\dagger)$, $p=-\sqrt{\hbar m\omega/2}\,i(a-a^\dagger)$`, r`$a|n\rangle=\sqrt n|n-1\rangle$, $a^\dagger|n\rangle=\sqrt{n+1}|n+1\rangle$`],
    steps: [
      { prompt: r`(a) Expectation values $\langle x\rangle$, $\langle p\rangle$.`, reveal: r`$a$ and $a^\dagger$ change $n$ by $\pm1$, so $\langle n|a|n\rangle=\langle n|a^\dagger|n\rangle=0$: $\langle x\rangle=\langle p\rangle=0$.` },
      { prompt: r`(b) $\langle x^2\rangle$: which terms of $(a+a^\dagger)^2$ survive?`, reveal: r`$a^2,(a^\dagger)^2$ change $n$ by $\pm2$ and vanish. $\langle aa^\dagger+a^\dagger a\rangle=(n+1)+n=2n+1$, so $\langle x^2\rangle=\frac{\hbar}{2m\omega}(2n+1)$.` },
      { prompt: r`(c) $\langle p^2\rangle$.`, reveal: r`$p^2=-\frac{\hbar m\omega}2(a-a^\dagger)^2=\frac{\hbar m\omega}2(aa^\dagger+a^\dagger a-a^2-a^{\dagger2})$, so $\langle p^2\rangle=\frac{m\hbar\omega}2(2n+1)$.` },
      { prompt: r`(d) Multiply and discuss $n=0$.`, reveal: r`$\Delta x\Delta p=\sqrt{\frac{\hbar}{2m\omega}\frac{m\hbar\omega}{2}}(2n+1)=\frac\hbar2(2n+1)=\hbar(n+\frac12)$. For $n=0$: $\hbar/2$, the minimum of the uncertainty relation (ground state is the Gaussian).` },
    ],
    keyPoints: [r`odd/even changes of $n$ kill $\langle x\rangle,\langle p\rangle$ and the $a^2$ terms`, r`$\langle aa^\dagger+a^\dagger a\rangle=2n+1$`, r`only $n=0$ saturates $\Delta x\Delta p\ge\hbar/2$`],
  }),
  derive({
    id: 'qm-fu-D5', title: r`Heisenberg picture: equation of motion (HS18 Q3 (i)-(iii), FS22 Q3)`,
    source: src.exam('HS18 (EN)', 'Question 3 (i)-(iii), 10 pt; FS22 Question 3 (Heisenberg picture)'),
    goal: r`Define $U$, the Heisenberg operator $A_H(t)$, derive $\dot A_H=\frac i\hbar[H,A_H]+(\partial_tA)_H$ and the condition for conservation.`,
    given: [r`$i\hbar\partial_t\Psi=H\Psi$, $\Psi(t)=U(t,t_0)\Psi(t_0)$`, r`$H$ time independent for the formal solution`],
    steps: [
      { prompt: r`(a) Differential equation and formal solution for $U$.`, reveal: r`$i\hbar\partial_tU=HU$, $U(t_0,t_0)=\mathbb 1$. For time-independent $H$: $U=e^{-iH(t-t_0)/\hbar}$ (in general a time-ordered exponential). $U$ is unitary since $H=H^\dagger$.` },
      { prompt: r`(b) Define the Heisenberg picture.`, reveal: r`Choose $\Psi_H=\Psi(t_0)$ constant and $A_H(t)=U^\dagger AU$ so that $\langle\Psi(t)|A\Psi(t)\rangle=\langle\Psi_H|A_H(t)\Psi_H\rangle$ for all states.` },
      { prompt: r`(c) Differentiate $A_H(t)$.`, reveal: r`$\partial_tU=-\frac i\hbar HU$ and $\partial_tU^\dagger=\frac i\hbar U^\dagger H$. So $\dot A_H=\frac i\hbar U^\dagger HAU-\frac i\hbar U^\dagger AHU+U^\dagger\partial_tAU=\frac i\hbar[H_H,A_H]+(\partial_tA)_H$ with $H_H=U^\dagger HU=H$.` },
      { prompt: r`(d) Conservation law.`, reveal: r`If $\partial_tA=0$ then $\dot A_H=0$ iff $[H,A]=0$: $A$ is a constant of motion. Also, then $\langle A\rangle$ and the whole distribution of outcomes is time independent.` },
    ],
    keyPoints: [r`$i\hbar\dot U=HU$ and unitarity`, r`$A_H=U^\dagger AU$ and $\dot A_H=\frac i\hbar[H,A_H]$ (sign check with $A=x$)`, r`conserved iff $[H,A]=0$ and no explicit $t$ dependence`],
  }),
  derive({
    id: 'qm-fu-D6', title: r`$[x,p]=i\hbar$ is impossible in finite dimensions (HS22 B.1 e)`,
    source: src.exam('HS22', 'B.1 e), 3 pt'),
    goal: r`Show that no finite matrices $\hat x,\hat p$ satisfy $[\hat x,\hat p]=i\hbar\mathbb 1$.`,
    given: [r`$\mathrm{tr}(MN)=\mathrm{tr}(NM)$ for finite matrices`, r`$\dim\mathcal H=N<\infty$`],
    steps: [
      { prompt: r`(a) Take the trace of the commutator.`, reveal: r`$\mathrm{tr}[\hat x,\hat p]=\mathrm{tr}(\hat x\hat p)-\mathrm{tr}(\hat p\hat x)=0$ by cyclicity.` },
      { prompt: r`(b) Take the trace of the right-hand side.`, reveal: r`$\mathrm{tr}(i\hbar\mathbb 1)=i\hbar N\neq0$.` },
      { prompt: r`(c) Conclude and say what changes in infinite dimensions.`, reveal: r`Contradiction, so $N$ must be infinite. In $L^2$ the operators are unbounded, $xp$ and $px$ have no trace, and cyclicity fails; this is why the uncertainty bound $\frac\hbar2$ cannot be applied for the 3-point model of HS22 B.1 d).` },
    ],
    keyPoints: [r`cyclicity of the trace`, r`$\mathrm{tr}\,\mathbb 1=N$`, r`finite-dimensional models have no canonical pair; position and momentum need infinite dimensions`],
  }),
];
