import { src, qz, T, EQ, I, P, X, lesson } from '../lib.mjs';
const r = String.raw;
const NOTES = src.notes('ch04-formalism');

export const lessons12 = [
  lesson({
    id: 'qm-fu-L1', title: 'Hilbert space, operators and Dirac notation', minutes: 15,
    source: [src.script('Ch. 4.1-4.4 (pp. 41-46): Hilbertraum, L2, Operatoren und Observable'), src.exam('HS22', 'B.1 a)-c)'), src.exam('HS18 (EN)', 'Question 2(i)'), NOTES],
    blocks: [
      T(r`A <b>Hilbert space</b> $\mathcal H$ is a complex vector space with a positive-definite sesquilinear inner product $\langle\cdot|\cdot\rangle$ (script 4.2-4.4: linear in the <i>second</i> argument, $\langle\psi|\chi\rangle=\overline{\langle\chi|\psi\rangle}$, $\langle\psi|\psi\rangle\ge0$ with equality only for $\psi=0$) such that the induced norm $\|\psi\|=\sqrt{\langle\psi|\psi\rangle}$ is complete. Examples: $\mathbb C^n$ with $\langle x|y\rangle=\sum\bar x_iy_i$, and $L^2(\mathbb R)$ with $\langle f|g\rangle=\int dx\,\bar f(x)g(x)$.`),
      T(r`<b>Cauchy-Schwarz</b> $|\langle\varphi|\psi\rangle|^2\le\langle\varphi|\varphi\rangle\langle\psi|\psi\rangle$ follows from the axioms (script 4.6) and is the engine of the uncertainty relation. A physical state is a <i>ray</i>: normalised vectors $\langle\psi|\psi\rangle=1$ modulo a phase $e^{i\alpha}$.`),
      T(r`<b>Operators.</b> An observable is a linear operator $A:\mathcal H\to\mathcal H$ (e.g. $x\,f(x)=xf(x)$, $p\,f=-i\hbar f'$). The <b>adjoint</b> $A^\dagger$ is defined by $\langle f|Bg\rangle=\langle B^\dagger f|g\rangle$ for all $f,g$ (script 4.23). $A$ is <b>self-adjoint</b> (hermitian) if $A^\dagger=A$. In $\mathbb C^n$ the matrix of $A^\dagger$ is the conjugate transpose, so observables are hermitian matrices: $A_{ij}=\overline{A_{ji}}$.`),
      EQ(r`\langle A\rangle_\Psi=\langle\Psi|A\Psi\rangle\in\mathbb R\ \Longleftrightarrow\ \langle\Psi_1|A\Psi_2\rangle=\langle A\Psi_1|\Psi_2\rangle,\qquad (AB)^\dagger=B^\dagger A^\dagger`, 'script 4.20-4.24: reality of expectation values defines "symmetric"; self-adjoint is slightly stronger (same domain of definition)'),
      T(r`<b>Dirac notation.</b> A vector is a ket $|a\rangle$, an element of the dual space is a bra $\langle a|$, and the inner product is the bracket $\langle a|b\rangle$ (script 4.29-4.31). The outer product $|\alpha\rangle\langle\beta|$ is an operator with matrix elements $C_{ij}=\langle\varphi_i|\alpha\rangle\langle\beta|\varphi_j\rangle$ (HS16 asks exactly this). Insert a complete set as $\mathbb 1=\sum_n|\varphi_n\rangle\langle\varphi_n|$ whenever you need components.`),
      T(r`<b>Eigenvalues of hermitian operators</b> (script 4.27). If $A\psi_n=\lambda_n\psi_n$, then $\lambda_n\langle\psi_m|\psi_n\rangle=\langle\psi_m|A\psi_n\rangle=\langle A\psi_m|\psi_n\rangle=\bar\lambda_m\langle\psi_m|\psi_n\rangle$. For $m=n$: $\lambda_n\in\mathbb R$. For $\lambda_m\ne\lambda_n$: $\langle\psi_m|\psi_n\rangle=0$. Degenerate eigenvectors are orthonormalised with Gram-Schmidt.`),
      I(r`Why hermitian? Because the possible measurement results are eigenvalues and a measured number must be real. A non-hermitian $A$ would have complex "outcomes".`),
      P(r`$[A,B]$ of two hermitian operators is <i>anti</i>-hermitian: $[A,B]^\dagger=[B,A]=-[A,B]$. The combination $i[A,B]$ is hermitian (HS18 Q2(i), 2 pt), and so is $\{A,B\}=AB+BA$. Never say that $AB$ is hermitian unless $[A,B]=0$.`),
      X(r`HS22 B.1(a)-(c): build $\hat x=\mathrm{diag}(0,1,2)$ on a 3-point space, show it is hermitian, show a Fourier matrix is unitary ($S^\dagger S=\mathbb 1$) and use $e^{SAS^{-1}}=Se^AS^{-1}$. The whole problem is Hilbert-space linear algebra in $\mathbb C^3$.`),
    ],
    check: [
      qz(r`$A$ and $B$ are hermitian. Which operator is hermitian for sure?`, r`$i[A,B]$`, [[r`$[A,B]$`, r`$[A,B]^\dagger=[B,A]=-[A,B]$: anti-hermitian.`], [r`$AB$`, r`$(AB)^\dagger=BA\ne AB$ unless they commute.`], [r`$A+iB$`, r`$(A+iB)^\dagger=A-iB$.`]], r`$(i[A,B])^\dagger=-i[B,A]=i[A,B]$ (HS18 Q2(i)).`, src.exam('HS18 (EN)', 'Q2(i)')),
      qz(r`$A\psi_1=\lambda_1\psi_1$, $A\psi_2=\lambda_2\psi_2$ with $A=A^\dagger$ and $\lambda_1\ne\lambda_2$. Then`, r`$\lambda_{1,2}\in\mathbb R$ and $\langle\psi_1|\psi_2\rangle=0$`, [[r`$\lambda_{1,2}$ may be complex, but $\langle\psi_1|\psi_2\rangle=0$`, r`Hermiticity gives $\lambda=\bar\lambda$ from the case $m=n$ of (4.27).`], [r`$\lambda_{1,2}\in\mathbb R$, but the eigenvectors need not be orthogonal`, r`Subtracting $\lambda_n\langle\psi_m|\psi_n\rangle=\bar\lambda_m\langle\psi_m|\psi_n\rangle=\lambda_m\langle\psi_m|\psi_n\rangle$ gives $(\lambda_n-\lambda_m)\langle\psi_m|\psi_n\rangle=0$.`], [r`$\langle\psi_1|\psi_2\rangle=1$`, r`Orthogonal, and in any case normalisation concerns $\langle\psi|\psi\rangle$.`]], r`Script (4.27).`),
    ],
  }),
  lesson({
    id: 'qm-fu-L2', title: 'Spectral decomposition, projectors and the measurement postulate', minutes: 15,
    source: [src.script('Ch. 4.5-4.6 (pp. 46-50)'), src.exam('FS 19', 'Question 1 (iii)-(v): measuring a hermitian R'), src.exam('FS26', 'Question 1 (iii): measurement probabilities'), NOTES],
    blocks: [
      T(r`Let $A=A^\dagger$ on $\mathbb C^N$ with orthonormal eigenvectors $A\psi_n=\lambda_n\psi_n$. The <b>spectral projectors</b> $P_n=|\psi_n\rangle\langle\psi_n|$ satisfy $P_n^\dagger=P_n$, $P_n^2=P_n$, $P_mP_n=0$ ($m\ne n$), $\sum_nP_n=\mathbb 1$ (script 4.32).`),
      EQ(r`A=\sum_n\lambda_nP_n=\sum_n\lambda_n|\psi_n\rangle\langle\psi_n|,\qquad f(A)=\sum_nf(\lambda_n)P_n`, 'spectral decomposition (4.33) and functional calculus (4.42-4.46); e.g. e^{-iHt/hbar}'),
      T(r`<b>Measurement postulate</b> (generalised from script 2.7 to 4.35):`),
      EQ(r`\text{outcomes}\in\{\lambda_n\},\qquad W(\lambda)=\sum_{\lambda_m=\lambda}|\langle\psi_m|\psi\rangle|^2=\langle\psi|P_\lambda|\psi\rangle,\qquad\langle A\rangle_\psi=\sum_n\lambda_n|\langle\psi_n|\psi\rangle|^2=\langle\psi|A|\psi\rangle`, 'script (4.34), (4.35)'),
      T(r`<b>Collapse.</b> After the result $\lambda$ the state is the normalised projection $\psi\to P_\lambda\psi/\|P_\lambda\psi\|$ (for a degenerate eigenvalue the projection onto the whole eigenspace, not onto one vector; FS19 Q1(v), 5 pt). An immediate second measurement of $A$ gives $\lambda$ again with probability $1$.`),
      T(r`<b>Infinite dimensions</b> (4.6): replace "eigenvalues" by the <i>spectrum</i> $\sigma(A)\subset\mathbb R$, and projectors $P_I(A)$ onto an interval $I$ of the spectrum, $W_\psi(I)=\langle\psi|P_I(A)|\psi\rangle=\|P_I(A)\psi\|^2$. Examples: $\sigma(x)=\sigma(p)=\mathbb R$ for a free particle, $\sigma(H)=\mathbb R_+$ free, $\{E_1,\dots,E_N\}\cup\mathbb R_+$ for a finite well, $\{\hbar\omega(n+\frac12)\}$ for the oscillator.`),
      T(r`<b>Compatible observables.</b> If $[A,B]=0$ they have a common eigenbasis (e.g. $\vec L^2$ and $L_z$) and can be measured in any order without disturbing each other. If $[A,B]\ne0$ the order matters (next lesson). A <i>complete set of commuting observables</i> labels the states uniquely.`),
      I(r`Probability = squared length of the projection of $\psi$ on the eigenspace. Expectation value = average of the eigenvalues weighted by these probabilities. A superposition keeps both amplitudes until a measurement picks one.`),
      P(r`Probabilities add as $|c_n|^2$ for <i>different</i> outcomes, amplitudes add only inside one outcome. The relative phase of $c_1,c_2$ drops out of $W(\lambda_n)$ for $A$, but not for another observable $B$ whose eigenvectors mix them.`),
    ],
    check: [
      qz(r`$A$ has eigenvalues $1,3$ with eigenvectors $|a\rangle,|b\rangle$. In $|\psi\rangle=(|a\rangle+2i|b\rangle)/\sqrt5$ the expectation value $\langle A\rangle$ is`, r`$13/5$`, [[r`$2$`, r`That is the plain mean of the eigenvalues; the weights are $1/5$ and $4/5$.`], [r`$(1+6i)/5$`, r`$\langle A\rangle$ of a hermitian operator is real; the weights are $|c_n|^2$.`], [r`$7/5$`, r`$\frac15\cdot1+\frac45\cdot3=\frac{13}5$; $7/5$ would use $\frac45\cdot1+\frac15\cdot3$ (weights swapped).`]], r`$\langle A\rangle=\frac15\cdot1+\frac45\cdot3$.`),
      qz(r`The state after measuring $A$ with outcome $\lambda_n$ (non-degenerate) is`, r`$|\psi_n\rangle$, up to a phase; an immediate repeat gives $\lambda_n$ with certainty`, [[r`unchanged, $|\psi\rangle$: a measurement does not disturb`, r`The measurement postulate projects the state; unchanged only if $\psi$ was already an eigenstate.`], [r`$\sum_k|\psi_k\rangle$ with equal weights`, r`That would be total ignorance, not post-measurement knowledge.`], [r`$A|\psi\rangle$`, r`$A\psi$ is not normalised and not the projection; $P_n\psi=\langle\psi_n|\psi\rangle\psi_n$.`]], r`Projection postulate (script 2.7/4.5).`),
    ],
  }),
];
