import { src, boss } from '../../lib.mjs';
const r = String.raw;

export const bossesEnt = [
  boss({
    id: 'qm-ent-b1', title: 'EPR pair (HS21 Q3)',
    source: src.exam('HS21', 'Question 3 [EPR pair, 12 points]'), minutes: 24,
    instructions: r`Solve on paper under the timer (2 min per point). Then enter the numbers.`,
    statement: [
      r`Consider a single particle transforming in the representation $D_j$ of su(2). We choose an orthonormal basis of $D_j$ consisting of the vectors $|j,m\rangle$ that are eigenvectors of $S_z$ with eigenvalue $m$: $S_z|j,m\rangle=m|j,m\rangle$. Furthermore $S_\pm=S_x\pm iS_y$ acts as $S_\pm|j,m\rangle=\sqrt{j(j+1)-m(m\pm1)}\,|j,m\pm1\rangle$.`,
      r`(i) Using $[S_x,S_y]=iS_z$, $[S_y,S_z]=iS_x$, $[S_z,S_x]=iS_y$, deduce the commutation relations $[S_z,S_\pm]$ and $[S_+,S_-]$. [2 points]`,
      r`(ii) Using the formulas for $S_z$ and $S_\pm$ above, but not your result from (i), compute $[S_\pm,S_z]|j,m\rangle$ and $[S_+,S_-]|j,m\rangle$. Show that this agrees with (i). [3 points]`,
      r`Consider now a pair of particles, each transforming in the $j=\frac12$ representation, with generators $\vec S^{(1)}$ and $\vec S^{(2)}$ (components of $\vec S^{(1)}$ commute with those of $\vec S^{(2)}$). The total spin is $\vec S=\vec S^{(1)}+\vec S^{(2)}$. For each of the two $j=\frac12$ representations we write $|{\uparrow}\rangle\equiv|\frac12,+\frac12\rangle$ and $|{\downarrow}\rangle\equiv|\frac12,-\frac12\rangle$; the combined system is described by $|{\uparrow\uparrow}\rangle,|{\uparrow\downarrow}\rangle,|{\downarrow\uparrow}\rangle,|{\downarrow\downarrow}\rangle$. The system is initially in the singlet state $|\psi_s\rangle$ with respect to the total spin, i.e. the state annihilated by $S_a$, $a\in\{x,y,z\}$: $S_a|\psi_s\rangle=0$.`,
      r`(iii) Starting from the defining property of the singlet, derive the explicit state vector of $|\psi_s\rangle$ in the basis $\{|{\uparrow\uparrow}\rangle,|{\uparrow\downarrow}\rangle,|{\downarrow\uparrow}\rangle,|{\downarrow\downarrow}\rangle\}$. [4 points]`,
      r`(iv) When measuring the $S_z^{(1)}$ spin component on the singlet state, what is the probability of finding $S_z^{(1)}=\frac12$? [1 point]`,
      r`(v) Suppose that we measured $S_z^{(1)}$ on the singlet state and obtained $S_z^{(1)}=\frac12$. Subsequently we measure $S_z^{(2)}$. What is the probability of finding $S_z^{(2)}=\frac12$? [2 points]`,
    ],
    finalAnswers: [
      { id: 'cplus', prompt: r`(i) $[S_+,S_-]=c\,S_z$: the number $c$.`, answer: '2', vars: {}, tol: 0.01 },
      { id: 'coef', prompt: r`(iii) Absolute value of the coefficient of $|{\uparrow\downarrow}\rangle$ in $|\psi_s\rangle$.`, answer: '1/sqrt(2)', vars: {}, tol: 0.01 },
      { id: 'p1', prompt: r`(iv) $P(S_z^{(1)}=\frac12)$.`, answer: '1/2', vars: {}, tol: 0.01 },
      { id: 'p2', prompt: r`(v) $P(S_z^{(2)}=\frac12)$ after the first result $S_z^{(1)}=\frac12$.`, answer: '0', vars: {}, tol: 0.01 },
    ],
    keyPoints: [
      r`(i) $[S_z,S_\pm]=\pm S_\pm$, $[S_+,S_-]=2S_z$ from the Cartan-Weyl combination of $[S_x,S_y]=iS_z$ etc.`,
      r`(ii) $S_zS_\pm|j,m\rangle=(m\pm1)S_\pm|j,m\rangle$ so $[S_\pm,S_z]=\mp S_\pm$ on $|j,m\rangle$; $[S_+,S_-]|j,m\rangle=[j(j+1)-m(m-1)-j(j+1)+m(m+1)]|j,m\rangle=2m|j,m\rangle$`,
      r`(iii) $S_z\psi=0$: $\alpha=\delta=0$; $S_+\psi=0$: $\beta+\gamma=0$; normalisation: $\frac1{\sqrt2}(|{\uparrow\downarrow}\rangle-|{\downarrow\uparrow}\rangle)$`,
      r`(iv) $\frac12$; (v) the state collapses to $|{\uparrow\downarrow}\rangle$: probability $0$ (perfect anticorrelation)`,
    ],
  }),
  boss({
    id: 'qm-ent-b2', title: 'Spin-1 EPR pair (FS19 Q3)',
    source: src.exam('FS 19', 'Question 3 [Representations of SO(3) and Spin 1 EPR pair, 18 points] (English version printed after the German)'), minutes: 36,
    instructions: r`Solve on paper under the timer (2 min per point). Then enter the numbers.`,
    statement: [
      r`(i) Consider first a single particle transforming in the $D_1$ representation of SO(3). We choose an orthonormal basis of $D_1$ consisting of the vectors $|1,m\rangle$ that are $J_z$ eigenstates with eigenvalue $m$, $m=0,\pm1$. The operators $J^\pm=J_x\pm iJ_y$ of su(2) act as $J^\pm|j,m\rangle=\sqrt{j(j+1)-m(m\pm1)}\,|j,m\pm1\rangle$ with $j=1$. For a particle in the state $|1,1\rangle$ what is the expectation value for the measurement of $J_x$, $J_y$ and $J_z$? What are the corresponding results for the state $|1,0\rangle$? [4 points]`,
      r`(ii) Consider now two particles, each transforming in the $D_1$ representation of SO(3). By considering the eigenvalues of $J_z$ on the tensor product, determine the representations with respect to the diagonal rotation group SO(3) in which the two-particle system transforms. (You need not identify the explicit basis vectors for all cases, but you must explain how you conclude that these and only these representations appear.) [6 points]`,
      r`(iii) Find an explicit expression for the normalised singlet state in the two-particle system. (This state describes the EPR-like pair.) [3 points]`,
      r`(iv) Now suppose that Alice has only access to the first particle of this EPR-like pair, while Bob only has access to the second particle (and Alice and Bob are far separated from one another). What is the probability that Alice measures $m=+1$ when she measures $J_z$ of her particle? What is the situation for Bob? [2 points]`,
      r`(v) Now suppose Alice has measured $m=+1$ for her particle. What is the probability that Bob measures subsequently $m=+1$, $m=0$ or $m=-1$ for his particle? [3 points]`,
    ],
    finalAnswers: [
      { id: 'Jz11', prompt: r`(i) $\langle J_z\rangle$ in $|1,1\rangle$ (units of $\hbar$).`, answer: '1', vars: {}, tol: 0.01 },
      { id: 'Jx11', prompt: r`(i) $\langle J_x\rangle$ in $|1,1\rangle$.`, answer: '0', vars: {}, tol: 0.01 },
      { id: 'dimsum', prompt: r`(ii) Dimension check: $\dim D_2+\dim D_1+\dim D_0$.`, answer: '5+3+1', vars: {}, tol: 0.01 },
      { id: 'coef', prompt: r`(iii) Absolute value of the coefficient of $|0;0\rangle$ in the singlet.`, answer: '1/sqrt(3)', vars: {}, tol: 0.01 },
      { id: 'pA', prompt: r`(iv) $P(\text{Alice finds }m=+1)$.`, answer: '1/3', vars: {}, tol: 0.01 },
      { id: 'pB', prompt: r`(v) $P(\text{Bob finds }m=-1\mid\text{Alice }m=+1)$.`, answer: '1', vars: {}, tol: 0.01 },
      { id: 'pB0', prompt: r`(v) $P(\text{Bob finds }m=0\mid\text{Alice }m=+1)$.`, answer: '0', vars: {}, tol: 0.01 },
    ],
    keyPoints: [
      r`(i) $|1,1\rangle$: $\langle J_z\rangle=1$, $\langle J_x\rangle=\langle J_y\rangle=0$ (since $J_\pm$ change $m$); $|1,0\rangle$: all three vanish`,
      r`(ii) $m_{tot}=m_1+m_2\in\{-2..2\}$ with multiplicities $1,2,3,2,1$: peel off $D_2$ (5 states), then $D_1$ (3), then $D_0$ (1): $D_1\otimes D_1=D_2\oplus D_1\oplus D_0$, $9=5+3+1$`,
      r`(iii) $\sigma=0$: $\frac1{\sqrt3}(|1;-1\rangle-|0;0\rangle+|-1;1\rangle)$ from $S_+\psi=0$ in the $m=0$ sector`,
      r`(iv) $\frac13$ for Alice and for Bob (marginal probabilities, maximally mixed reduced state)`,
      r`(v) after Alice's $m=+1$ the state is $|1;-1\rangle$: Bob finds $m=-1$ with probability 1, $m=0,+1$ with probability 0`,
    ],
  }),
  boss({
    id: 'qm-ent-b3', title: 'Pair states and density matrices (FS16 D.3-D.7, translated)',
    source: src.exam('FS16', 'Aufgabe D [Spin, Drehimpuls und Dichtematrizen, 18 Punkte], parts D.3-D.7 (13 of 18 points; German original, statement translated)'), minutes: 26,
    instructions: r`Solve on paper under the timer (2 min per point). Parts D.1 and D.2 of the same problem (tritium angular momenta, spin precession) are not part of this boss. The statement is a translation of the German text.`,
    statement: [
      r`D.3 [2] Consider the pair states $|ij\rangle\equiv|i\rangle_A\otimes|j\rangle_B$ with $i,j\in\{0,1\}$. Are the states $|11\rangle$, $(|10\rangle-|01\rangle)$, $(|11\rangle+|00\rangle)$, $(|10\rangle+|11\rangle)$ entangled?`,
      r`D.4 [2] Given the density matrix $\rho_{AB}=\frac12\begin{pmatrix}1&0&0&1\\0&0&0&0\\0&0&0&0\\1&0&0&1\end{pmatrix}$ in the basis $\{|00\rangle,|01\rangle,|10\rangle,|11\rangle\}$, where the first (second) entry refers to system $A$ ($B$). Is this state pure or mixed? Find the wave function or the mixture of states belonging to the density matrix.`,
      r`D.5 [2] We keep the density matrix $\rho_{AB}$ of (1) and perform a measurement in the basis $\{|x_1\rangle,\dots,|x_4\rangle\}$ with $|x_1\rangle=(|00\rangle+|11\rangle)/\sqrt2$, $|x_2\rangle=(|00\rangle-|11\rangle)/\sqrt2$, $|x_3\rangle=(|01\rangle+|10\rangle)/\sqrt2$, $|x_4\rangle=(|01\rangle-|10\rangle)/\sqrt2$. Determine the probabilities $P_{x_i}$ to measure the states $|x_i\rangle$.`,
      r`D.6 [4] Assume a measurement of the system of D.5 gave the state $|x_1\rangle$. We now measure the state of subsystem $B$. Give the density matrix of subsystem $A$ for the following cases: a) we do not know the result of the measurement on $B$; b) $B$ was found in the state $|1\rangle$.`,
      r`D.7 [3] Consider the two density matrices of a two-state system, $\rho_1=\frac12\begin{pmatrix}1&0\\0&1\end{pmatrix}$ and $\rho_2=\frac12\begin{pmatrix}1&1\\1&1\end{pmatrix}$. Which of these systems is pure, which mixed? Determine the representations of $\rho_1$ and $\rho_2$ on/in the Bloch sphere.`,
    ],
    finalAnswers: [
      { id: 'nent', prompt: r`D.3 Number of entangled states among the four.`, answer: '2', vars: {}, tol: 0.01 },
      { id: 'pur4', prompt: r`D.4 $\mathrm{tr}\rho_{AB}^2$.`, answer: '1', vars: {}, tol: 0.01 },
      { id: 'Px1', prompt: r`D.5 $P_{x_1}$.`, answer: '1', vars: {}, tol: 0.01 },
      { id: 'purA', prompt: r`D.6 a) $\mathrm{tr}\rho_A^2$ if the result of $B$ is unknown.`, answer: '1/2', vars: {}, tol: 0.01 },
      { id: 'purAb', prompt: r`D.6 b) $\mathrm{tr}\rho_A^2$ if $B$ was found in $|1\rangle$.`, answer: '1', vars: {}, tol: 0.01 },
      { id: 'b1', prompt: r`D.7 Length $|\vec b|$ of the Bloch vector of $\rho_1$.`, answer: '0', vars: {}, tol: 0.01 },
      { id: 'b2', prompt: r`D.7 Length $|\vec b|$ of the Bloch vector of $\rho_2$.`, answer: '1', vars: {}, tol: 0.01 },
    ],
    keyPoints: [
      r`D.3: rank test $\det C=c_{00}c_{11}-c_{01}c_{10}$: entangled are $|10\rangle-|01\rangle$ and $|11\rangle+|00\rangle$; $|11\rangle$ and $|10\rangle+|11\rangle=|1\rangle(|0\rangle+|1\rangle)$ are products`,
      r`D.4: $\rho^2=\rho$, pure, $\rho_{AB}=|x_1\rangle\langle x_1|$ with $x_1=\frac1{\sqrt2}(|00\rangle+|11\rangle)$`,
      r`D.5: $P_{x_i}=\langle x_i|\rho|x_i\rangle=(1,0,0,0)$`,
      r`D.6: a) $\rho_A=\mathrm{tr}_B\rho=\frac12\mathbb 1$ (mixed); b) after finding $B=|1\rangle$ the state is $|11\rangle$ so $\rho_A=|1\rangle\langle1|$ (pure)`,
      r`D.7: $\rho_1=\frac12\mathbb 1$ mixed, $\vec b=0$ (centre of the sphere); $\rho_2=\frac12(\mathbb 1+\sigma_x)$ pure, $\vec b=(1,0,0)$ on the surface`,
    ],
  }),
];
