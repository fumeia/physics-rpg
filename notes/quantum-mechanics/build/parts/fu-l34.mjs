import { src, qz, T, EQ, I, P, X, lesson } from '../lib.mjs';
const r = String.raw;
const NOTES = src.notes('ch04-formalism');

export const lessons34 = [
  lesson({
    id: 'qm-fu-L3', title: 'Commutators and the generalised uncertainty relation', minutes: 15,
    source: [src.script('Ch. 5.1-5.3 (pp. 52-58)'), src.exam('HS18 (EN)', 'Question 2 (18 pt)'), src.exam('FS22', 'Question 1/2 (v)'), NOTES],
    blocks: [
      T(r`<b>Commutator rules</b> (use them to avoid expanding anything): $[A,B]=-[B,A]$, $[A,BC]=[A,B]C+B[A,C]$, $[AB,C]=A[B,C]+[A,C]B$, Jacobi identity. From $[x,p]=i\hbar$ one gets $[x,p^n]=i\hbar np^{n-1}$, $[x,g(p)]=i\hbar g'(p)$, $[p,h(x)]=-i\hbar h'(x)$. If the commutator $[A,B]=c$ is a number, then $[A,e^{B}]=c\,e^{B}$.`),
      T(r`<b>Variance.</b> $(\Delta A)^2_\psi=\langle(A-\langle A\rangle)^2\rangle_\psi=\langle A^2\rangle-\langle A\rangle^2$ (script 5.2; HS18 eq. (11)). $\Delta A=0$ exactly when $\psi$ is an eigenvector of $A$.`),
      EQ(r`\Delta A\,\Delta B\ \ge\ \tfrac12\big|\langle[A,B]\rangle\big|=\tfrac12\big|\langle i[A,B]\rangle\big|`, 'script 5.3, HS18 Q2(ii) (4 pt)'),
      T(r`<b>Proof idea</b> (you must be able to write it): put $\hat A=A-\langle A\rangle$, $\hat B=B-\langle B\rangle$ and $|\psi_A\rangle=\hat A|\psi\rangle$, $|\psi_B\rangle=\hat B|\psi\rangle$. Cauchy-Schwarz: $\|\psi_A\|^2\|\psi_B\|^2\ge|\langle\psi_A|\psi_B\rangle|^2=|\langle\hat A\hat B\rangle|^2$. Split $\hat A\hat B=\frac12[\hat A,\hat B]+\frac12\{\hat A,\hat B\}$: the first part is anti-hermitian (purely imaginary expectation), the second is hermitian (real expectation), so $|\langle\hat A\hat B\rangle|^2=\frac14\langle i[A,B]\rangle^2+\frac14\langle\{\hat A,\hat B\}\rangle^2$. This is the <b>stronger form</b> (HS18 eq. (15)); dropping the second term gives the textbook inequality.`),
      EQ(r`(\Delta A)^2(\Delta B)^2\ \ge\ \tfrac14\langle i[A,B]\rangle^2+\tfrac14\langle\{\hat A,\hat B\}\rangle^2`, 'HS18 Q2(iv), 4 pt'),
      T(r`<b>Position and momentum.</b> $[x,p]=i\hbar$ gives $\Delta x\Delta p\ge\hbar/2$. Equality needs equality in Cauchy-Schwarz ($\hat B\psi\propto\hat A\psi$ with imaginary coefficient) and a vanishing anticommutator term. Solution: Gaussians, $\psi\propto e^{-(x-x_0)^2/4\sigma^2+ip_0x/\hbar}$ with $\Delta x=\sigma$, $\Delta p=\hbar/2\sigma$. For the oscillator state $|n\rangle$: $\Delta x\Delta p=\hbar(n+\frac12)$ (HS18 Q2(iii), 5 pt), minimal only for $n=0$.`),
      I(r`$\Delta A\Delta B$ is not about measurement disturbance: it constrains the <i>preparation</i>. No state has both a sharp $x$ and a sharp $p$, because $\hat x$ and $\hat p$ do not share eigenvectors.`),
      P(r`The right-hand side depends on the state: for $[A,B]=i\hbar C$ the bound is $\frac\hbar2|\langle C\rangle|$, which vanishes e.g. for $A=L_x,B=L_y$ in a state with $\langle L_z\rangle=0$. Uncertainty relations are state-dependent unless $[A,B]$ is a number.`),
      X(r`HS18 Q2 is the template: (i) hermiticity of $i[A,B]$ and $\{A,B\}$ [2], (ii) the relation [4], (iii) oscillator $\Delta x\Delta p=\hbar(n+\frac12)$ [5], (iv) the stronger form [4], (v) check it for $\psi_n$ [3]. See the boss gate.`),
    ],
    check: [
      qz(r`$[x,p^3]=$`, r`$3i\hbar p^2$`, [[r`$i\hbar p^3$`, r`$[x,p^n]=i\hbar np^{n-1}$; the power drops by one and a factor $n$ appears.`], [r`$3i\hbar x^2$`, r`That is $[p,x^3]$ up to sign and mixes up the roles of $x$ and $p$.`], [r`$0$`, r`$x$ does not commute with $p$.`]], r`Leibniz rule: $[x,p^3]=[x,p]p^2+p[x,p]p+p^2[x,p]=3i\hbar p^2$.`),
      qz(r`In $|n\rangle$ of the oscillator, $\Delta x\Delta p$ equals`, r`$\hbar(n+\frac12)$, so the stronger bound $\frac\hbar2$ is saturated only for $n=0$`, [[r`$\hbar/2$ for all $n$`, r`$\langle x^2\rangle\propto 2n+1$ grows with $n$.`], [r`$\hbar n$`, r`At $n=0$ this would violate the uncertainty relation; the zero-point term $\frac12$ is essential.`], [r`$\hbar(n+\frac12)^2$`, r`Dimension: $\Delta x\Delta p$ is an action; the correct dependence is linear in $n+\frac12$.`]], r`$\langle x^2\rangle=\frac\hbar{2m\omega}(2n+1)$, $\langle p^2\rangle=\frac{m\hbar\omega}2(2n+1)$, $\langle x\rangle=\langle p\rangle=0$.`),
    ],
  }),
  lesson({
    id: 'qm-fu-L4', title: 'Time evolution: Schrodinger vs Heisenberg picture, Ehrenfest', minutes: 15,
    source: [src.script('Ch. 2.3 (Ehrenfest, p. 17) and Ch. 4.5 (postulate ii)'), src.exam('FS22', 'Question 3 (Heisenberg picture, 17 pt)'), src.exam('HS21', 'Question 1 (Ehrenfest, 10 pt)'), src.exam('HS22', 'A4'), NOTES],
    blocks: [
      T(r`<b>Schrodinger picture.</b> States evolve, $i\hbar\partial_t\Psi=H\Psi$, with propagator $\Psi(t)=U(t,s)\Psi(s)$, $i\hbar\partial_tU=HU$. For time-independent $H$: $U=e^{-iH(t-s)/\hbar}$, unitary ($U^\dagger U=\mathbb 1$), and $U$ commutes with $H$. In an eigenstate $H\psi_n=E_n\psi_n$ only a phase $e^{-iE_nt/\hbar}$ appears, so all expectation values of time-independent operators are constant.`),
      T(r`<b>Heisenberg picture.</b> $\Psi_H=\Psi_S(0)$ is constant, and the operators carry the time dependence, $A_H(t)=U^\dagger AU$, so that $\langle\Psi_S(t)|A\Psi_S(t)\rangle=\langle\Psi_H|A_H(t)\Psi_H\rangle$. Differentiating and using the equation for $U$ (FS22 Q3(ii), 6 pt):`),
      EQ(r`\frac{d}{dt}A_H=\frac i\hbar\,[H_H,A_H]+(\partial_tA)_H,\qquad H_H=U^\dagger HU=H\ \ (\text{if }\partial_tH=0)`, 'FS22 eq. (9)'),
      T(r`<b>Consequences.</b> (1) $A$ is conserved if $[H,A]=0$ and $\partial_tA=0$. (2) Commutators are preserved: $[A_H(t),B_H(t)]=U^\dagger[A,B]U$, so a c-number commutator $c$ stays $c$ (HS22 A4, 4 pt). (3) The canonical commutator $[x_H(t),p_H(t)]=i\hbar$ holds at all times.`),
      T(r`<b>Ehrenfest in operator form.</b> Taking the expectation value of the Heisenberg equation (or differentiating $\langle\Psi|A|\Psi\rangle$ with the Schrodinger equation, HS21 Q1(ii), 2 pt):`),
      EQ(r`\frac{d}{dt}\langle A\rangle=\frac i\hbar\langle[H,A]\rangle+\Big\langle\frac{\partial A}{\partial t}\Big\rangle,\quad\frac{d\langle x\rangle}{dt}=\frac{\langle p\rangle}m,\quad\frac{d\langle p\rangle}{dt}=-\langle V'(x)\rangle`, 'for H = p^2/2m + V(x): [H,x] = -i hbar p/m, [H,p] = i hbar V\''),
      T(r`<b>Matrix elements between energy eigenstates.</b> Since $\langle\psi_n|[H,A]|\psi_\ell\rangle=(E_n-E_\ell)\langle\psi_n|A|\psi_\ell\rangle$ (FS22 Q3(iv), 2 pt), choosing $A=\vec r$ and using $[H,\vec r]=-i\hbar\vec p/m$ gives $\langle\psi_n|\vec p|\psi_\ell\rangle=\frac{im}\hbar(E_n-E_\ell)\langle\psi_n|\vec r|\psi_\ell\rangle$ (FS22 Q3(v)). For $\ell=n$ the right side is $0$: <b>in a stationary state $\langle\vec p\rangle=0$</b>, the quantum form of the virial/Ehrenfest argument.`),
      I(r`The two pictures are two bookkeepings of the same physics: either the state rotates in Hilbert space and the operator stays, or the other way round. Heisenberg is the natural one for conservation laws and for the classical limit, where $\dot A=\{A,H\}$ becomes $\frac i\hbar[H,A]$.`),
      P(r`Signs: $\frac{d}{dt}A_H=\frac i\hbar[H,A]$ equals $\frac1{i\hbar}[A,H]$. A common slip is $\frac i\hbar[A,H]$. Check on $A=x$: $[H,x]=-i\hbar p/m$, so $\frac i\hbar\cdot(-i\hbar p/m)=+p/m$ as required.`),
    ],
    check: [
      qz(r`Free particle $H=p^2/2m+Fx$. Then $\frac d{dt}\langle p\rangle=$`, r`$-F$`, [[r`$+F$`, r`$[H,p]=F[x,p]=i\hbar F$ and $\frac i\hbar\cdot i\hbar F=-F$: the force is $-V'$.`], [r`$\langle p\rangle/m$`, r`That is $\frac d{dt}\langle x\rangle$.`], [r`$0$`, r`Momentum is conserved only if $V$ is independent of $x$.`]], r`$\dot p=\frac i\hbar[H,p]=-V'(x)=-F$.`),
      qz(r`$A_H(t)=U^\dagger AU$. If $[A,B]=c\in\mathbb C$ then $[A_H(t),B_H(t)]=$`, r`$c$, for all $t$`, [[r`$c\,e^{-i\omega t}$ with $\omega=E/\hbar$`, r`$U^\dagger\mathbb 1\,c\,U=c$; the phases cancel because $U^\dagger U=\mathbb 1$.`], [r`$0$ for $t>0$`, r`Commutators are preserved by unitary conjugation, otherwise the canonical commutator would decay.`], [r`$c$ only if $[A,H]=0$`, r`$A_H$ and $B_H$ both change with $t$, but $U^\dagger[A,B]U=c$ regardless of $H$.`]], r`$U^\dagger ABU-U^\dagger BAU=U^\dagger[A,B]U$ (HS22 A4).`),
    ],
  }),
];
