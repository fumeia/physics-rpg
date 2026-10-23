# Ch. 4-5 Formalism, measurement, commutators, uncertainty, time evolution (QM25 script, pp. 41-58)

Notes for the room `formalism-and-uncertainty` (lecturer's notation; sources in the lessons).

## Hilbert space and operators (script 4.1-4.4)
Inner product linear in the second argument: $\langle\psi|\chi\rangle=\overline{\langle\chi|\psi\rangle}$. Adjoint: $\langle f|Bg\rangle=\langle B^\dagger f|g\rangle$; $(AB)^\dagger=B^\dagger A^\dagger$. Hermitian: $A=A^\dagger$, real eigenvalues, orthogonal eigenvectors of different eigenvalues. Cauchy-Schwarz $|\langle\varphi|\psi\rangle|^2\le\langle\varphi|\varphi\rangle\langle\psi|\psi\rangle$.

## Spectral decomposition and measurement (4.5-4.6)
$A=\sum_n\lambda_nP_n$, $P_n=|\psi_n\rangle\langle\psi_n|$, $P_n^2=P_n$, $\sum P_n=\mathbb 1$. Probability $W(\lambda)=\langle\psi|P_\lambda|\psi\rangle$, collapse $\psi\to P_\lambda\psi/\|P_\lambda\psi\|$. Spectrum for infinite dimensions.

## Commutators and uncertainty (5.1-5.3)
$(\Delta A)^2=\langle A^2\rangle-\langle A\rangle^2$; $\Delta A\Delta B\ge\frac12|\langle[A,B]\rangle|$. Stronger: $(\Delta A)^2(\Delta B)^2\ge\frac14\langle i[A,B]\rangle^2+\frac14\langle\{\hat A,\hat B\}\rangle^2$ (HS18 Q2(iv)). Oscillator: $\Delta x\Delta p=\hbar(n+\frac12)$.

## Time evolution
Schrodinger: $i\hbar\partial_tU=HU$. Heisenberg: $A_H=U^\dagger AU$, $\dot A_H=\frac i\hbar[H,A_H]+(\partial_tA)_H$. Ehrenfest: $\frac d{dt}\langle x\rangle=\langle p\rangle/m$, $\frac d{dt}\langle p\rangle=-\langle V'\rangle$.

## Exam problems used
HS18 Q2 (uncertainty, 18 pt), HS18 Q3 (Heisenberg picture and conservation laws, 22 pt), HS22 B.1 (QM in finite dimensions, 20 pt), HS22 part A items A2, A3, A4, A7 as quiz questions. HS22 A6 as printed has typos (the second line defines $(\Delta x)^2_t$ with $p$ inside); not used.
