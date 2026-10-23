import { src, derive } from '../../lib.mjs';
import { NOTES } from './lessons-a.mjs';
const r = String.raw;

export const derivesEnt = [
  derive({
    id: 'qm-ent-D1', title: r`The singlet from its defining property (HS21 Q3 (iii))`,
    source: src.exam('HS21', 'Question 3 (iii), 4 pt'),
    goal: r`Show that the state with $S_a|\psi_s\rangle=0$ ($a=x,y,z$) is $\frac1{\sqrt2}(|{\uparrow\downarrow}\rangle-|{\downarrow\uparrow}\rangle)$.`,
    given: [r`$S_a=S_a^{(1)}+S_a^{(2)}$, $S_\pm|j,m\rangle=\sqrt{j(j+1)-m(m\pm1)}\,|j,m\pm1\rangle$ ($\hbar=1$)`, r`ansatz $\alpha|{\uparrow\uparrow}\rangle+\beta|{\uparrow\downarrow}\rangle+\gamma|{\downarrow\uparrow}\rangle+\delta|{\downarrow\downarrow}\rangle$`],
    steps: [
      { prompt: r`(a) Use $S_z|\psi_s\rangle=0$.`, reveal: r`$S_z$ has eigenvalues $+1,0,0,-1$ on the four product states, so $\alpha=\delta=0$: only the $m=0$ states $\beta|{\uparrow\downarrow}\rangle+\gamma|{\downarrow\uparrow}\rangle$ survive.` },
      { prompt: r`(b) Use $S_+|\psi_s\rangle=0$.`, reveal: r`$S_+=S_+^{(1)}+S_+^{(2)}$ with $S_+|{\downarrow}\rangle=|{\uparrow}\rangle$, $S_+|{\uparrow}\rangle=0$: $S_+(\beta|{\uparrow\downarrow}\rangle+\gamma|{\downarrow\uparrow}\rangle)=(\beta+\gamma)|{\uparrow\uparrow}\rangle=0$, so $\gamma=-\beta$. ($S_-$ gives the same condition.)` },
      { prompt: r`(c) Normalise.`, reveal: r`$|\beta|^2+|\gamma|^2=1\Rightarrow\beta=\frac1{\sqrt2}$ (overall phase free): $|\psi_s\rangle=\frac1{\sqrt2}(|{\uparrow\downarrow}\rangle-|{\downarrow\uparrow}\rangle)$.` },
      { prompt: r`(d) Probabilities (iv)-(v).`, reveal: r`$P(S_z^{(1)}=\frac12)=|\beta|^2=\frac12$. After this outcome the state is projected on $|{\uparrow\downarrow}\rangle$, so $P(S_z^{(2)}=\frac12)=0$.` },
    ],
    keyPoints: [r`$S_z\psi=0$ restricts to the $m=0$ sector`, r`$S_+\psi=0$ gives $\gamma=-\beta$`, r`$P(S_z^{(1)}=\frac12)=\frac12$`, r`after the first outcome the second is fixed: probability $0$`],
  }),
  derive({
    id: 'qm-ent-D2', title: r`Spin correlation of the EPR pair: $C=-\vec n_1\cdot\vec n_2$ (script 10.11)`,
    source: src.script('Ch. 10.2, eqs. (10.9)-(10.11)'),
    goal: r`Show $\langle\psi|(\vec\sigma^{(1)}\!\cdot\vec n_1)(\vec\sigma^{(2)}\!\cdot\vec n_2)|\psi\rangle=-\vec n_1\cdot\vec n_2$ for the singlet.`,
    given: [r`$(\vec\sigma^{(1)}+\vec\sigma^{(2)})\cdot\vec v\,|\psi\rangle=0$ for all $\vec v$ (rotation invariance, 10.9)`, r`$(\vec a\cdot\vec\sigma)(\vec b\cdot\vec\sigma)=\vec a\cdot\vec b\,\mathbb 1+i(\vec a\times\vec b)\cdot\vec\sigma$`],
    steps: [
      { prompt: r`(a) Move $\vec\sigma^{(2)}$ to particle 1.`, reveal: r`From (10.9) with $\vec v=\vec n_2$: $\vec\sigma^{(2)}\!\cdot\vec n_2|\psi\rangle=-\vec\sigma^{(1)}\!\cdot\vec n_2|\psi\rangle$. The operators of different particles commute, so $C=-\langle(\vec\sigma^{(1)}\!\cdot\vec n_1)(\vec\sigma^{(1)}\!\cdot\vec n_2)\rangle$.` },
      { prompt: r`(b) Use the Pauli product identity.`, reveal: r`$C=-\vec n_1\cdot\vec n_2\langle\mathbb 1\rangle-i(\vec n_1\times\vec n_2)\cdot\langle\vec\sigma^{(1)}\rangle$.` },
      { prompt: r`(c) Show that $\langle\psi|\vec\sigma^{(1)}\cdot\vec v|\psi\rangle=0$ (10.10).`, reveal: r`Choose the 3-axis along $\vec v$: $\langle\psi|\sigma_3^{(1)}|\psi\rangle=\frac12(\langle{\uparrow\downarrow}|\sigma_3|{\uparrow\downarrow}\rangle+\langle{\downarrow\uparrow}|\sigma_3|{\downarrow\uparrow}\rangle)=\frac12(1-1)=0$.` },
      { prompt: r`(d) Result and checks.`, reveal: r`$C=-\vec n_1\cdot\vec n_2$. Check: $\vec n_1=\vec n_2$ gives $-1$ (perfect anticorrelation), perpendicular axes give $0$ (outcomes independent).` },
    ],
    keyPoints: [r`rotation invariance: $(\vec\sigma^{(1)}+\vec\sigma^{(2)})\cdot\vec v\,\psi=0$`, r`Pauli product identity`, r`$\langle\vec\sigma^{(1)}\rangle=0$ in the singlet`, r`$C=-\vec n_1\cdot\vec n_2$, $=-\cos\theta$`],
  }),
  derive({
    id: 'qm-ent-D3', title: r`The CHSH inequality and its violation by $2\sqrt2$ (script 10.4-10.12)`,
    source: src.script('Ch. 10.2, eqs. (10.4), (10.5), (10.12), Abb. 19'),
    goal: r`Prove $|\langle AB\rangle+\langle A'B\rangle+\langle AB'\rangle-\langle A'B'\rangle|\le2$ for local hidden variables and show that the singlet gives $2\sqrt2$.`,
    given: [r`$A,A',B,B'\in\{\pm1\}$ functions of $\omega$, $\langle X\rangle=\int X(\omega)\,d\rho(\omega)$, locality $(AB)(\omega)=A(\omega)B(\omega)$`, r`$C(\vec n_1,\vec n_2)=-\vec n_1\cdot\vec n_2$ on the singlet`],
    steps: [
      { prompt: r`(a) The pointwise bound.`, reveal: r`For fixed $\omega$: if $A=A'$ then $A+A'=\pm2$ and $A-A'=0$; if $A=-A'$ then $A+A'=0$, $A-A'=\pm2$. Hence $(A+A')B+(A-A')B'=\pm2$ (10.5).` },
      { prompt: r`(b) Average over $\rho$.`, reveal: r`The average of a quantity of modulus 2 has modulus $\le2$: $|\langle AB\rangle+\langle A'B\rangle+\langle AB'\rangle-\langle A'B'\rangle|\le2$ (10.4). Locality entered when factorising $(AB)(\omega)=A(\omega)B(\omega)$.` },
      { prompt: r`(c) Quantum value with $C=-\vec n_1\cdot\vec n_2$.`, reveal: r`The combination is $-[\vec n_1\!\cdot\!\vec n_2+\vec n_1'\!\cdot\!\vec n_2+\vec n_1\!\cdot\!\vec n_2'-\vec n_1'\!\cdot\!\vec n_2']$ (10.12).` },
      { prompt: r`(d) Choose the axes of figure 19.`, reveal: r`In a plane: $\vec n_1$ at angle $0$, $\vec n_2$ at $\frac\pi4$, $\vec n_1'$ at $\frac\pi2$, $\vec n_2'$ at $-\frac\pi4$. Then $\vec n_1\!\cdot\!\vec n_2=\vec n_1'\!\cdot\!\vec n_2=\vec n_1\!\cdot\!\vec n_2'=\cos\frac\pi4$ and $\vec n_1'\!\cdot\!\vec n_2'=\cos\frac{3\pi}4$. Sum: $3\frac{\sqrt2}2+\frac{\sqrt2}2=2\sqrt2>2$.` },
      { prompt: r`(e) General Bob angles (check).`, reveal: r`With Alice at $0,\frac\pi2$ and Bob at $\varphi,-\varphi$ the value is $2|\cos\varphi+\sin\varphi|=2\sqrt2|\cos(\varphi-\frac\pi4)|$, maximal at $\varphi=\frac\pi4$.` },
    ],
    keyPoints: [r`pointwise value $\pm2$ because $A=\pm A'$`, r`averaging keeps the bound 2; uses locality $(AB)(\omega)=A(\omega)B(\omega)$`, r`QM: $C=-\vec n_1\cdot\vec n_2$`, r`coplanar $\frac\pi4$ steps give $2\sqrt2$`],
  }),
  derive({
    id: 'qm-ent-D4', title: r`Reduced density matrix, purity and measurement on one part (FS16 D.4-D.6)`,
    source: src.exam('FS16', 'Aufgabe D.4, D.5, D.6 (German), 8 pt'),
    goal: r`For $\rho_{AB}=|\Phi^+\rangle\langle\Phi^+|$ find the Bell-basis probabilities and $\rho_A$ if $B$'s result is unknown or equal to $|1\rangle$.`,
    given: [r`$\rho_{AB}=\frac12\begin{pmatrix}1&0&0&1\\0&0&0&0\\0&0&0&0\\1&0&0&1\end{pmatrix}$ in the basis $|00\rangle,|01\rangle,|10\rangle,|11\rangle$`, r`$P_{x_i}=\langle x_i|\rho_{AB}|x_i\rangle$, $\rho_A=\mathrm{tr}_B\rho_{AB}$`],
    steps: [
      { prompt: r`(a) Pure or mixed? Find the state.`, reveal: r`$\rho^2=\rho$, $\mathrm{tr}\rho^2=1$ (eigenvalues $1,0,0,0$), the nonzero eigenvector is $\frac1{\sqrt2}(|00\rangle+|11\rangle)=|\Phi^+\rangle=|x_1\rangle$: pure.` },
      { prompt: r`(b) Probabilities in the basis $x_1..x_4$.`, reveal: r`$P_{x_i}=|\langle x_i|\Phi^+\rangle|^2=(1,0,0,0)$ because the $x_i$ are the orthonormal Bell states.` },
      { prompt: r`(c) $\rho_A$ if $B$'s result is not known.`, reveal: r`$\rho_A=\mathrm{tr}_B\rho_{AB}=\frac12(|0\rangle\langle0|+|1\rangle\langle1|)=\frac12\mathbb 1$: the cross terms $|00\rangle\langle11|$ contain $\langle1|0\rangle_B=0$ after the trace. Purity $\frac12$.` },
      { prompt: r`(d) $\rho_A$ if $B$ was found in $|1\rangle$.`, reveal: r`Projection $\tilde\rho=(\mathbb 1\otimes P_1)\rho(\mathbb 1\otimes P_1)=\frac12|11\rangle\langle11|$, normalised $|11\rangle\langle11|$, so $\rho_A=|1\rangle\langle1|$: pure.` },
    ],
    keyPoints: [r`pure iff $\mathrm{tr}\rho^2=1$`, r`$\rho_A=\mathrm{tr}_B\rho_{AB}=\frac12\mathbb 1$ for a Bell state`, r`conditional state after learning $B$'s result is pure`, r`$P_{x_i}=\langle x_i|\rho|x_i\rangle$`],
  }),
  derive({
    id: 'qm-ent-D5', title: r`Quantum teleportation (script 10.3)`,
    source: src.script('Ch. 10.3, pp. 111-113, eqs. (10.13)-(10.15)'),
    goal: r`Show that Alice's Bell measurement on particles $0,1$ plus 2 classical bits lets Bob recover $|\varphi\rangle=a|{\uparrow}\rangle+b|{\downarrow}\rangle$ on particle 2.`,
    given: [r`$|\psi\rangle_{12}=\frac1{\sqrt2}(|{\uparrow\downarrow}\rangle-|{\downarrow\uparrow}\rangle)$ shared by Alice (1) and Bob (2)`, r`$\chi_1=\frac1{\sqrt2}(\uparrow\downarrow-\downarrow\uparrow),\ \chi_2=\frac1{\sqrt2}(\uparrow\downarrow+\downarrow\uparrow),\ \chi_3=\frac1{\sqrt2}(\uparrow\uparrow-\downarrow\downarrow),\ \chi_4=\frac1{\sqrt2}(\uparrow\uparrow+\downarrow\downarrow)$`],
    steps: [
      { prompt: r`(a) Write the three-particle state.`, reveal: r`$|\varphi\rangle\otimes|\psi\rangle=\frac1{\sqrt2}\big(|\varphi,{\uparrow}\rangle|{\downarrow}\rangle-|\varphi,{\downarrow}\rangle|{\uparrow}\rangle\big)$ (10.14); particles $0,1$ are Alice's, $2$ is Bob's.` },
      { prompt: r`(b) Decompose with $\mathbb 1=\sum_iP_i$.`, reveal: r`Expand $|\varphi,{\uparrow}\rangle,|\varphi,{\downarrow}\rangle$ in the Bell basis $\chi_i$ of particles $0,1$. Each term $P_i(|\varphi\rangle|\psi\rangle)=\frac12|\chi_i\rangle\otimes|\text{Bob}_i\rangle$ has weight $\frac14$ since $\| |\text{Bob}_i\rangle\|^2=|a|^2+|b|^2=1$.` },
      { prompt: r`(c) Bob's state for each outcome.`, reveal: r`$i=1$: $-|\varphi\rangle$; $i=2$: $-\sigma_3|\varphi\rangle$ (i.e. $+|{\downarrow}\rangle\langle{\downarrow}|\varphi\rangle-|{\uparrow}\rangle\langle{\uparrow}|\varphi\rangle$); $i=3$: $\sigma_1|\varphi\rangle=a|{\downarrow}\rangle+b|{\uparrow}\rangle$; $i=4$: $a|{\downarrow}\rangle-b|{\uparrow}\rangle=-i\sigma_2|\varphi\rangle$. All four outcomes are equally likely (probability $\frac14$).` },
      { prompt: r`(d) The correction.`, reveal: r`Alice sends $i$ (2 bits). Bob applies $\mathbb 1,\sigma_3,\sigma_1,\sigma_2$ and obtains $-|\varphi\rangle,-|\varphi\rangle,|\varphi\rangle,-i|\varphi\rangle$: the same state up to a global phase. Without the bits Bob's state is $\frac12\mathbb 1$, so no information travels faster than light.` },
    ],
    keyPoints: [r`write $|\varphi\rangle\otimes|\psi\rangle$ and decompose Alice's two particles in the Bell basis`, r`four outcomes with probability $\frac14$`, r`Bob's state is $|\varphi\rangle$ rotated by $\mathbb 1,\sigma_3,\sigma_1,\sigma_2$`, r`two classical bits are needed; no signalling`],
  }),
  derive({
    id: 'qm-ent-D6', title: r`No cloning (supplement, not in the script)`,
    source: src.notes('ch10-entanglement', 'no-cloning supplement'),
    goal: r`Show that no unitary $U$ satisfies $U|\varphi\rangle|0\rangle=|\varphi\rangle|\varphi\rangle$ for all states $|\varphi\rangle$.`,
    given: [r`Unitarity preserves the scalar product: $\langle U\alpha|U\beta\rangle=\langle\alpha|\beta\rangle$`, r`two arbitrary states $|\varphi\rangle,|\chi\rangle$ and a fixed blank $|0\rangle$`],
    steps: [
      { prompt: r`(a) Assume the cloner works for $\varphi$ and $\chi$.`, reveal: r`$U|\varphi\rangle|0\rangle=|\varphi\rangle|\varphi\rangle$ and $U|\chi\rangle|0\rangle=|\chi\rangle|\chi\rangle$.` },
      { prompt: r`(b) Take the scalar product of the two equations.`, reveal: r`Left sides: $\langle\varphi|\chi\rangle\langle0|0\rangle=\langle\varphi|\chi\rangle$ (unitarity). Right sides: $\langle\varphi|\chi\rangle^2$.` },
      { prompt: r`(c) Conclude.`, reveal: r`$z=z^2$ with $z=\langle\varphi|\chi\rangle$ gives $z\in\{0,1\}$: only identical or orthogonal states can be cloned by one device. A superposition cannot be copied.` },
      { prompt: r`(d) Link to entanglement.`, reveal: r`Cloning $\frac1{\sqrt2}(|0\rangle+|1\rangle)$ linearly gives $\frac1{\sqrt2}(|00\rangle+|11\rangle)$, the Bell state, not the product $|{+}{+}\rangle$. This is also why teleportation destroys the original.` },
    ],
    keyPoints: [r`assume the cloner for two states`, r`unitarity preserves $\langle\varphi|\chi\rangle$`, r`$z=z^2\Rightarrow z\in\{0,1\}$`, r`linear cloning of a superposition yields an entangled state`],
  }),
];
