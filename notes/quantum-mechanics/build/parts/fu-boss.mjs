import { src, boss } from '../lib.mjs';
const r = String.raw;

export const bosses = [
  boss({
    id: 'qm-fu-b1', title: 'Heisenberg uncertainty relation (HS18 Q2, 18 pt)',
    source: src.exam('HS18 (EN)', 'Question 2 [Heisenberg Uncertainty Relation, 18 pt]'), minutes: 36,
    instructions: r`Solve on paper under the timer (2 min per point). Enter the final numbers with $\hbar=1$ for the instances below (the exam asks for general $n$; here you evaluate your general results).`,
    statement: [
      r`Suppose $A$ and $B$ are two self-adjoint operators acting on a Hilbert space. We define the variance of $A$ via $(\Delta A)_\psi\equiv\sqrt{\langle(A-\langle A\rangle_\psi)^2\rangle_\psi}$, where the expectation value is taken with respect to some state $\psi$ in the Hilbert space.`,
      r`(i) Prove that $i[A,B]$ and $\{A,B\}\equiv AB+BA$ are hermitian operators. [2 pt]`,
      r`(ii) Prove the Heisenberg uncertainty relation $(\Delta A)_\psi(\Delta B)_\psi\ge\frac12|\langle i[A,B]\rangle_\psi|$. [4 pt]`,
      r`(iii) Consider the one-dimensional harmonic oscillator with mass $m$ in the eigenstate $\psi_n$ of energy $E=\hbar\omega(n+\frac12)$. Show that for all $n$: $(\Delta x)_{\psi_n}(\Delta p)_{\psi_n}=(n+\frac12)\hbar$. What is special about the case $n=0$? [5 pt] [Hint: $x=\sqrt{\hbar/2m\omega}\,(a+a^\dagger)$, $p=-\sqrt{\hbar m\omega/2}\,i(a-a^\dagger)$]`,
      r`(iv) There exists a slightly stronger version, $(\Delta A)^2_\psi(\Delta B)^2_\psi\ge\big(\frac12\langle i[A,B]\rangle_\psi\big)^2+\big(\frac12\langle\{\hat A,\hat B\}\rangle_\psi\big)^2$ with $\hat A=A-\langle A\rangle_\psi$, $\hat B=B-\langle B\rangle_\psi$. Prove it by considering the Cauchy-Schwarz inequality for the vectors $|\psi_A\rangle=\hat A|\psi\rangle$ and $|\psi_B\rangle=\hat B|\psi\rangle$. [Hint: write $|\langle\psi_A|\psi_B\rangle|^2$ in terms of real and imaginary parts.] [4 pt]`,
      r`(v) Confirm the stronger inequality for the position and momentum operators in the eigenstates $\psi_n$. [3 pt]`,
    ],
    finalAnswers: [
      { id: 'dxdp2', prompt: r`(iii) $\Delta x\,\Delta p$ for $n=2$, in units of $\hbar$.`, answer: '5/2', vars: {}, tol: 0.01 },
      { id: 'lhs3', prompt: r`(v) Left side $(\Delta x)^2(\Delta p)^2$ for $n=3$, in units of $\hbar^2$.`, answer: '49/4', vars: {}, tol: 0.01 },
      { id: 'anti', prompt: r`(v) $\langle\{\hat x,\hat p\}\rangle$ in $\psi_n$ (any $n$), in units of $\hbar$.`, answer: '0', vars: {}, tol: 0.01 },
      { id: 'rhs', prompt: r`(v) Right side of the stronger inequality, in units of $\hbar^2$ (any $n$).`, answer: '1/4', vars: {}, tol: 0.01 },
    ],
    keyPoints: [
      r`(i) $(i[A,B])^\dagger=-i[B,A]=i[A,B]$, $\{A,B\}^\dagger=BA+AB$`,
      r`(ii) Cauchy-Schwarz for $\hat A\psi,\hat B\psi$; $\hat A\hat B=\frac12[A,B]+\frac12\{\hat A,\hat B\}$; imaginary part gives the commutator`,
      r`(iii) $\langle x\rangle=\langle p\rangle=0$, $\langle x^2\rangle=\frac\hbar{2m\omega}(2n+1)$, $\langle p^2\rangle=\frac{m\hbar\omega}2(2n+1)$, product $\hbar(n+\frac12)$; $n=0$ saturates the bound (Gaussian)`,
      r`(iv) $|z|^2=(\mathrm{Re}\,z)^2+(\mathrm{Im}\,z)^2$ with $\mathrm{Re}\,z=\frac12\langle\{\hat A,\hat B\}\rangle$, $\mathrm{Im}\,z=-\frac12\langle i[A,B]\rangle$`,
      r`(v) $xp+px\propto i(a^{\dagger2}-a^2)$ changes $n$ by $\pm2$, so $\langle\{\hat x,\hat p\}\rangle=0$ and $\langle x\rangle=\langle p\rangle=0$, so $(n+\frac12)^2\hbar^2\ge\frac{\hbar^2}4$`,
    ],
  }),
  boss({
    id: 'qm-fu-b2', title: 'Heisenberg picture and conservation laws (HS18 Q3, 22 pt)',
    source: src.exam('HS18 (EN)', 'Question 3 [Heisenberg picture and conservation laws, 22 pt]'), minutes: 44,
    instructions: r`Solve on paper under the timer. The final answers ask for one concrete instance of (vi): $l=1$, $s=\frac12$, energy shifts of $\kappa\vec L\cdot\vec S$ in units of $\kappa\hbar^2$.`,
    statement: [
      r`(i) State the time-dependent Schrodinger equation, and write down the solution with initial state $\Psi(t_0)$ as $\Psi(t)=U(t,t_0)\Psi(t_0)$. Deduce the differential equation the propagator $U(t,t_0)$ has to solve, and construct its (formal) solution. [5 pt]`,
      r`(ii) Explain how to define the Heisenberg picture, and deduce the equations of motion of an operator in the Heisenberg picture. [3 pt]`,
      r`(iii) Determine the condition for an observable $A$ that does not depend explicitly on time, to be conserved. [2 pt]`,
      r`(iv) Consider a Hamiltonian of the form $H_0\equiv H_0(r,\vec L^2,\vec S^2)$, where $r$ is the radial coordinate, while $\vec L$ and $\vec S$ describe the orbital angular momentum and spin operators. Write the components of $\vec L$ in terms of differential operators, and calculate $[\vec L,r]$. Using $[L_x,L_y]=i\hbar L_z$ (and cyclic), show also that $[\vec L,\vec L^2]=0$. Deduce that if $H_0$ describes the Hamiltonian of the system, $\vec L$ is conserved. [5 pt]`,
      r`(v) Suppose the eigenstates of $H_0$ are $H_0|n,l,m,s,m_s\rangle=E(n,l,m,s,m_s)|n,l,m,s,m_s\rangle$. On which of these quantum numbers do the eigenvalues of $H_0$ actually not depend? Justify. [2 pt]`,
      r`(vi) Now consider $H_1=H_0+\kappa\,\vec L\cdot\vec S$. What are the eigenvalues of $H_1$ on the space spanned by the states $|n,l,m,s,m_s\rangle$? On which combination of quantum numbers do the eigenvalues of $H_1$ not depend? [5 pt]`,
    ],
    finalAnswers: [
      { id: 'j32', prompt: r`(vi) Shift of the $j=\frac32$ level of $l=1,s=\frac12$ in units of $\kappa\hbar^2$.`, answer: '1/2', vars: {}, tol: 0.01 },
      { id: 'j12', prompt: r`(vi) Shift of the $j=\frac12$ level in units of $\kappa\hbar^2$.`, answer: '-1', vars: {}, tol: 0.01 },
      { id: 'dim', prompt: r`(vi) Dimension of the space for fixed $n,l=1,s=\frac12$ (number of states $|m,m_s\rangle$).`, answer: '6', vars: {}, tol: 0.01 },
      { id: 'trace', prompt: r`(vi) Sum of all six shifts (with degeneracy), in units of $\kappa\hbar^2$ (check: $\mathrm{tr}\,\vec L\cdot\vec S=0$).`, answer: '4*(1/2)+2*(-1)', vars: {}, tol: 0.01 },
    ],
    keyPoints: [
      r`(i) $i\hbar\partial_t\Psi=H\Psi$; $i\hbar\partial_tU=HU$, $U(t_0,t_0)=\mathbb 1$; $U=e^{-iH(t-t_0)/\hbar}$ (time-ordered exponential in general); unitary`,
      r`(ii) $A_H=U^\dagger AU$, $\Psi_H=\Psi(t_0)$; $\dot A_H=\frac i\hbar[H,A_H]+(\partial_tA)_H$`,
      r`(iii) $[H,A]=0$ (with $\partial_tA=0$)`,
      r`(iv) $\vec L=-i\hbar\,\vec r\times\nabla$; $[L_i,r]=0$ because $r$ is a function of $\vec r^2$ and $L_i$ is a derivative along rotations; $[L_i,\vec L^2]=0$ from $[L_x,L_y^2]=[L_x,L_y]L_y+L_y[L_x,L_y]=i\hbar(L_zL_y+L_yL_z)$ and the cyclic partners cancelling; $[H_0,\vec L]=0$`,
      r`(v) $H_0$ is a function of $r,\vec L^2,\vec S^2$ only: no dependence on $m$ and $m_s$ (rotational invariance, degeneracy $(2l+1)(2s+1)$)`,
      r`(vi) $\vec L\cdot\vec S=\frac12(\vec J^2-\vec L^2-\vec S^2)$ with $\vec J=\vec L+\vec S$: eigenvalues $\frac{\kappa\hbar^2}2[j(j+1)-l(l+1)-s(s+1)]$ for $j=l\pm\frac12$; independent of $m_j$ (not of $m$ and $m_s$ separately)`,
    ],
    requires: 'qm-fu-c2',
  }),
  boss({
    id: 'qm-fu-b3', title: 'QM in finite dimensions (HS22 B.1, 20 pt)',
    source: src.exam('HS22', 'B.1 - QM in finite dimensions [20 points]'), minutes: 40,
    instructions: r`Solve on paper under the timer. Enter the final numbers with $\hbar=1$: a matrix element of $T$ and the moments of $\hat p$ in the state $|0\rangle$.`,
    statement: [
      r`a) [1p] Imagine that the space of positions is discrete, consisting of only three points. The corresponding position eigenstates $|x\rangle\in|0\rangle,|1\rangle,|2\rangle$ satisfy $\hat x|x\rangle=x|x\rangle$. Construct a matrix representation of the position operator $\hat x$ in the $|x\rangle$-basis and show that it is hermitian.`,
      r`b) [3p] Show that for an invertible matrix $S$, one has $e^{SAS^{-1}}=Se^AS^{-1}$ for any matrix $A$.`,
      r`c) [7p] Consider the operator $\hat p=S\hat xS^{-1}$ obtained by applying the discrete Fourier transform $S=\frac1{\sqrt3}\begin{pmatrix}1&1&1\\1&\omega&\omega^*\\1&\omega^*&\omega\end{pmatrix}$, $\omega=e^{2\pi i/3}$, to the position operator. Show that $S$ is unitary and determine the matrix representation of $T=\omega^{\hat p}=e^{2\pi i\hat p/3}$ in the basis $|x\rangle\in|0\rangle,|1\rangle,|2\rangle$. What is the action of $T$ on a position eigenstate? Use this to deduce the physical meaning of $\hat p$. [Hint: express everything in terms of $\omega$.]`,
      r`d) [6p] Calculate the uncertainty of the momentum and position of a particle that is in the state $|0\rangle$. Is the relation of the "uncertainty principle" for positions and momenta satisfied?`,
      r`e) [3p] Prove that $[\hat x,\hat p]=i\hbar$ cannot hold when $\hat x$ and $\hat p$ are operators on a Hilbert space in finite dimensions. [Hint: recall that for a finite-dimensional Hilbert space the trace is finite.]`,
    ],
    finalAnswers: [
      { id: 'p0', prompt: r`d) $\langle0|\hat p|0\rangle$.`, answer: '1', vars: {}, tol: 0.01 },
      { id: 'dp', prompt: r`d) $\Delta p$ in the state $|0\rangle$.`, answer: 'sqrt(2/3)', vars: {}, tol: 0.01 },
      { id: 'dx', prompt: r`d) $\Delta x$ in the state $|0\rangle$.`, answer: '0', vars: {}, tol: 0.01 },
      { id: 'T01', prompt: r`c) The matrix element $T_{01}=\langle0|T|1\rangle$ (shift operator: $T|1\rangle=|0\rangle$ means 1).`, answer: '1', vars: {}, tol: 0.01 },
    ],
    keyPoints: [
      r`a) $\hat x=\mathrm{diag}(0,1,2)$ real symmetric, hence hermitian`,
      r`b) $(SAS^{-1})^n=SA^nS^{-1}$ term by term in the exponential series`,
      r`c) $S^\dagger S=\mathbb 1$ (columns orthonormal: $\sum_k\omega^{(j-l)k}=3\delta_{jl}$); $T=S\,\mathrm{diag}(1,\omega,\omega^*)S^\dagger$ is a cyclic shift, $T|x\rangle=|x-1\bmod3\rangle$: $\hat p$ generates translations (momentum)`,
      r`d) $\Delta x=0$ ($|0\rangle$ is an eigenstate of $\hat x$); $\langle p\rangle=1$, $\langle p^2\rangle=\frac53$, $\Delta p=\sqrt{2/3}$; product $0$ is not a violation because $[\hat x,\hat p]\ne i\hbar$ in $\mathbb C^3$ (see e)`,
      r`e) $\mathrm{tr}[\hat x,\hat p]=0$ but $\mathrm{tr}(i\hbar\mathbb 1)=i\hbar N\ne0$`,
    ],
  }),
];
