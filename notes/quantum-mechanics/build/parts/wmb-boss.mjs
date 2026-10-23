import { src, boss } from '../lib.mjs';
const r = String.raw;

export const bosses = [
  boss({
    id: 'qm-wm-b1', title: 'Particle in the box with the reflection P (FS26 Q2)',
    source: src.exam('FS26', 'Question 2 [Particle in the box, 20 points]'), minutes: 40,
    instructions: r`Solve on paper under the timer. Enter the probabilities and the sum. The statement below is the exam text (formulas shortened where marked).`,
    statement: [
      r`Consider a particle in 1d, confined to a box of length $a$. The Hamiltonian is $H=-\frac{\hbar^2}{2m}\partial_x^2+V(x)$ with $V=0$ for $x\in[0,a]$ and $V=\infty$ else.`,
      r`(i) Find the (normalised) eigenfunctions $\psi_n$ and the associated eigenvalues $E_n$ of the Hamiltonian for the particle in the box. What boundary conditions does the wave function have to satisfy? [5 points]`,
      r`(ii) Consider the operator $P$ which acts as $(P\psi)(x)=\psi(a-x)$. Show that $P$ is a symmetry of the Hamiltonian, and that the eigenfunctions of $H$ are eigenfunctions of $P$. [4 points]`,
      r`Let the wave function of the particle be $\psi(x)=\sqrt{30/a^5}\,x(a-x)$. (iii) We can write it as $\psi(x)=\sum_nc_n\psi_n(x)$. Which $c_n$ are allowed to be non-zero by the symmetry $P$? [3 points]`,
      r`(iv) The energy of the particle in this state is measured. Calculate the probability that one measures the energy $E_n$. Hint: you may use $\int_0^1dy\,y\sin(\pi ny)=\frac{(-1)^{n+1}}{\pi n}$ and $\int_0^1dy\,y^2\sin(\pi ny)=\frac{(-1)^{n+1}}{\pi n}-2\frac{1-(-1)^n}{\pi^3n^3}$. [5 points]`,
      r`(v) Use the previous result to show that $\sum_{l=0}^\infty\frac1{(2l+1)^6}=\frac{\pi^6}{960}$. [3 points]`,
    ],
    finalAnswers: [
      { id: 'p1', prompt: r`(iv) $P_1$, the probability of the ground-state energy $E_1$.`, answer: '960/pi**6', vars: {}, tol: 0.001 },
      { id: 'p3', prompt: r`(iv) $P_3$.`, answer: '960/(3*pi)**6', vars: {}, tol: 0.01 },
      { id: 'podd', prompt: r`(iii)/(v) Sum of $P_n$ over all odd $n$ (what must the symmetry argument give?).`, answer: '1', vars: {}, tol: 0.01 },
      { id: 'sum', prompt: r`(v) The value of $\sum_{l\ge0}(2l+1)^{-6}$ to four digits.`, answer: 'pi**6/960', vars: {}, tol: 0.001 },
      { id: 'e2e1', prompt: r`(i) The ratio $E_2/E_1$.`, answer: '4', vars: {}, tol: 0.01 },
    ],
    keyPoints: [
      r`(i) $\psi(0)=\psi(a)=0$, $\psi_n=\sqrt{2/a}\sin\frac{n\pi x}a$, $E_n=\frac{n^2\pi^2\hbar^2}{2ma^2}$, $n=1,2,\dots$`,
      r`(ii) $V$ is symmetric under $x\to a-x$ and $\partial_x^2$ is invariant, so $[P,H]=0$; $\psi_n(a-x)=(-1)^{n+1}\psi_n(x)$`,
      r`(iii) $\psi$ is symmetric ($P=+1$), so only odd $n$ contribute`,
      r`(iv) $c_n=\sqrt{60}\,a^{-2}\!\int\!\dots$ gives $c_n=\frac{4\sqrt{15}}{\pi^3n^3}$ for odd $n$, so $P_n=\frac{960}{(\pi n)^6}$; $P_1=0.99856$`,
      r`(v) $\sum_nP_n=1$ over odd $n$: $\frac{960}{\pi^6}\sum_l(2l+1)^{-6}=1$`,
    ],
    requires: 'qm-wm-c3',
  }),
  boss({
    id: 'qm-wm-b2', title: 'Particle in a 2d box (FS19 Q1)',
    source: src.exam('FS 19', 'Question 1 [Particle in a 2d box, 21 pt] (English version of Aufgabe 1)'), minutes: 40,
    instructions: r`Solve on paper under the timer. In (ii)-(v) the game fixes $A=\frac12$, $B=\frac i2$, $C=\frac1{\sqrt2}$ (adaptation: the exam keeps $A,B,C$ general with $|A|^2+|B|^2+|C|^2=1$). Energies are in units of $\pi^2\hbar^2/2ma^2$.`,
    statement: [
      r`We consider a particle of mass $m$ moving in a 2-dimensional box of size $a$ with coordinates $0\le x\le a$ and $0\le y\le a$. The potential vanishes inside the box, and the wave function vanishes at the edges.`,
      r`(i) Find the normalised eigenfunctions of the Hamilton operator and the associated energies. [6 pt]`,
      r`(ii) At $t=0$ the system is described by $\Psi(x,y)=\frac{2A}a\sin\frac{2\pi x}a\sin\frac{\pi y}a+\frac{2B}a\sin\frac{\pi x}a\sin\frac{2\pi y}a+\frac{2C}a\sin\frac{\pi x}a\sin\frac{\pi y}a$ with complex $A,B,C$, $|A|^2+|B|^2+|C|^2=1$. Give the wave function for $t>0$. [2 pt]`,
      r`(iii) At $t_1>0$ the energy is measured. What are the possible outcomes and probabilities? In each case describe the wave function immediately after the measurement. [4 pt]`,
      r`(iv) The Hamiltonian commutes with the operator $R$ that exchanges $x$ and $y$, $R\Psi(x,y)=\Psi(y,x)$. Show that $R$ is hermitian and determine its eigenvalues. Find a basis of simultaneous normalised eigenfunctions of $H$ and $R$. [4 pt]`,
      r`(v) At $t_1>0$, $R$ is measured for the state of (ii) (system undisturbed for $0\le t\le t_1$). What values of $R$ can be found, with which probabilities? Describe the wave function directly after the measurement. [5 pt]`,
    ],
    finalAnswers: [
      { id: 'E11', prompt: r`(i) $E_{1,1}$ in units of $\pi^2\hbar^2/2ma^2$.`, answer: '2', vars: {}, tol: 0.01 },
      { id: 'E21', prompt: r`(i) $E_{2,1}=E_{1,2}$ in the same units.`, answer: '5', vars: {}, tol: 0.01 },
      { id: 'P5', prompt: r`(iii) Probability to measure $E=5$ (units above) for the given $A,B,C$.`, answer: '1/4+1/4', vars: {}, tol: 0.01 },
      { id: 'P2', prompt: r`(iii) Probability to measure $E=2$.`, answer: '1/2', vars: {}, tol: 0.01 },
      { id: 'Rp', prompt: r`(v) Probability to find $R=+1$.`, answer: '1/2+1/4', vars: {}, tol: 0.01 },
      { id: 'Rm', prompt: r`(v) Probability to find $R=-1$.`, answer: '1/4', vars: {}, tol: 0.01 },
    ],
    keyPoints: [
      r`(i) $\psi_{n_xn_y}=\frac2a\sin\frac{n_x\pi x}a\sin\frac{n_y\pi y}a$, $E=\frac{\pi^2\hbar^2}{2ma^2}(n_x^2+n_y^2)$`,
      r`(ii) multiply each term by $e^{-iEt/\hbar}$: $E_{21}=E_{12}=5\epsilon$ share the phase, $E_{11}=2\epsilon$`,
      r`(iii) $P(5\epsilon)=|A|^2+|B|^2$ with the projected state $(A\psi_{21}+B\psi_{12})/\sqrt{|A|^2+|B|^2}$; $P(2\epsilon)=|C|^2$ with state $\psi_{11}$`,
      r`(iv) $\langle\Phi|R\Psi\rangle=\langle R\Phi|\Psi\rangle$ by relabelling $x\leftrightarrow y$, $R^2=1$ so $R=\pm1$; basis $\psi_{nn}$, $(\psi_{nm}\pm\psi_{mn})/\sqrt2$`,
      r`(v) $P(+1)=|C|^2+\frac12|A+B|^2$, $P(-1)=\frac12|A-B|^2$; with the game values $\frac34$ and $\frac14$`,
    ],
    requires: 'qm-wm-c3',
  }),
  boss({
    id: 'qm-wm-b3', title: 'Wave mechanics: current and the potential step (FS22 Q1)',
    source: src.exam('FS22', 'Question 1 [Wave mechanics, 17 pt]'), minutes: 35,
    instructions: r`Solve on paper under the timer. For (iii) the game uses $E=2V_0$ and unit incoming amplitude (adaptation: the exam asks for the general solution). Currents are in units of $k/m$ with $k=\sqrt{2mE}$.`,
    statement: [
      r`Let $\Psi(x,t)$ be a solution of the time-dependent Schroedinger equation (one dimension). The probability density is $\rho(x,t)=|\Psi(x,t)|^2$.`,
      r`(i) Show the continuity equation $\partial_t\rho+\partial_xj=0$, where $j$ is the probability current that you should define. [4 pt]`,
      r`(ii) For a free particle of mass $m$ ($V=0$) state the most general (non-normalised) solution of the time-dependent Schroedinger equation with energy $E=\frac{k^2}{2m}$. Determine the probability current of this solution. [4 pt]`,
      r`(iii) Consider $V(x)=0$ for $x<0$ and $V(x)=V_0>0$ for $x>0$. Derive the most general (non-normalised) solution of the time-independent Schroedinger equation with energy $E>V_0$, describing an incoming particle from the left. Determine the probability current of this solution and confirm that the continuity equation holds. [7 pt]`,
      r`(iv) For $E<V_0$, briefly argue that the probability current vanishes. [2 pt]`,
    ],
    finalAnswers: [
      { id: 'jin', prompt: r`(ii) $j$ of $e^{ikx/\hbar}$ in units of $k/m$.`, answer: '1', vars: {}, tol: 0.01 },
      { id: 'kr', prompt: r`(iii) $k'/k=\sqrt{(E-V_0)/E}$ for $E=2V_0$.`, answer: 'sqrt(1/2)', vars: {}, tol: 0.01 },
      { id: 'r', prompt: r`(iii) Reflection amplitude $r=\frac{k-k'}{k+k'}$ for $E=2V_0$.`, answer: '(1-sqrt(1/2))/(1+sqrt(1/2))', vars: {}, tol: 0.01 },
      { id: 'T', prompt: r`(iii) $j_{\text{trans}}$ in units of $k/m$ (equal to $1-|r|^2$ by the continuity equation).`, answer: '4*sqrt(1/2)/(1+sqrt(1/2))**2', vars: {}, tol: 0.01 },
      { id: 'jl', prompt: r`(iii) Total current for $x<0$ in units of $k/m$ (must equal the transmitted one).`, answer: '1-((1-sqrt(1/2))/(1+sqrt(1/2)))**2', vars: {}, tol: 0.01 },
    ],
    keyPoints: [
      r`(i) $\partial_t\rho=\frac{i\hbar}{2m}\partial_x(\Psi^*\Psi'-\Psi\Psi^{*\prime})$, $j=\frac{i\hbar}{2m}(\Psi\Psi^{*\prime}-\Psi^*\Psi')$, real $V$ needed`,
      r`(ii) $\Psi=Ae^{i(kx-Et)/\hbar}+Be^{-i(kx+Et)/\hbar}$, $j=(|A|^2-|B|^2)k/m$`,
      r`(iii) $\psi=e^{ikx/\hbar}+re^{-ikx/\hbar}$ ($x<0$), $te^{ik'x/\hbar}$ ($x>0$); matching $\psi,\psi'$: $r=\frac{k-k'}{k+k'}$, $t=\frac{2k}{k+k'}$; $j_{x<0}=\frac km(1-|r|^2)=\frac{k'}m|t|^2$ is constant`,
      r`(iv) for $E<V_0$ the solution for $x>0$ is real up to a constant phase ($e^{-\kappa x}$), so $\mathrm{Im}(\psi^*\psi')=0$; on the left $|r|=1$`,
    ],
    requires: 'qm-wm-c2',
  }),
];
