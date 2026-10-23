# Ch. 10 Entanglement, EPR, Bell (script pp. 108-113), HS21 Q3, FS19 Q3, FS16 D, HS14 E, sheet 13 Q3

Sources: script Ch. 10.1 (EPR paradox, singlet 10.1), 10.2 (Bell inequality, eqs. 10.2-10.12, figure 19), 10.3 (teleportation, 10.13-10.15 and the correction table); Ch. 9.1-9.3 for tensor products and the Bell/triplet states; exams HS21 Q3 [12 pt], FS 19 Q3 [18 pt], FS16 Aufgabe D [18 pt], HS14 E.3-E.5; sheet 13 Q3 (Hardy). No-cloning is not in the script (supplement).

## Product vs entangled
$|\Psi\rangle=\sum c_{ij}|ij\rangle$ is a product iff $\det C=c_{00}c_{11}-c_{01}c_{10}=0$. FS16 D.3: $|11\rangle$ product, $|10\rangle-|01\rangle$ entangled, $|11\rangle+|00\rangle$ entangled, $|10\rangle+|11\rangle=|1\rangle(|0\rangle+|1\rangle)$ product.
Bell basis: $\Phi^\pm=\frac1{\sqrt2}(\uparrow\uparrow\pm\downarrow\downarrow)$, $\Psi^\pm=\frac1{\sqrt2}(\uparrow\downarrow\pm\downarrow\uparrow)$; singlet $=\Psi^-=|0,0\rangle$ (script 10.1), $\Psi^+=|1,0\rangle$.

## Density matrices (FS16 D.4-D.7, HS14 E.3, E.5)
$\rho=\frac12(\mathbb 1+\vec b\cdot\vec\sigma)$, $\mathrm{tr}\rho^2=\frac12(1+|\vec b|^2)$, pure iff $|\vec b|=1$. $\rho_A=\mathrm{tr}_B\rho_{AB}$. $\rho_{AB}=|\Phi^+\rangle\langle\Phi^+|$: Bell-basis probabilities $(1,0,0,0)$; $\rho_A=\frac12\mathbb 1$ if $B$'s result is unknown, $|1\rangle\langle1|$ if $B$ found $|1\rangle$. FS16 D.7: $\rho_1=\frac12\mathbb 1$ mixed ($\vec b=0$), $\rho_2=\frac12(\mathbb 1+\sigma_x)$ pure ($\vec b=\hat x$). HS14 E.5: after complete decoherence $\frac14\mathbb 1$ (product state) and $\frac12(|\uparrow\uparrow\rangle\langle\uparrow\uparrow|+|\downarrow\downarrow\rangle\langle\downarrow\downarrow|)$ (Bell state).

## EPR pair
$S_a\psi_s=0$ $\Rightarrow$ $\psi_s=\frac1{\sqrt2}(\uparrow\downarrow-\downarrow\uparrow)$ (HS21 Q3 iii). $P(S_z^{(1)}=\frac12)=\frac12$; given that result $P(S_z^{(2)}=\frac12)=0$ (iv, v). $[S_z,S_\pm]=\pm S_\pm$, $[S_+,S_-]=2S_z$ (i, ii).
Spin 1 (FS19 Q3): $D_1\otimes D_1=D_2\oplus D_1\oplus D_0$, singlet $\frac1{\sqrt3}(|1;-1\rangle-|0;0\rangle+|-1;1\rangle)$; Alice $P(m=1)=\frac13$, same for Bob; after Alice's $m=1$, Bob $m=-1$ with probability 1.
Correlation $C(\vec n_1,\vec n_2)=-\vec n_1\cdot\vec n_2$ (10.11), $P_{++}=\frac14(1-\cos\theta)$.

## Bell-CHSH
Local hidden variables: $|\langle AB\rangle+\langle A'B\rangle+\langle AB'\rangle-\langle A'B'\rangle|\le2$ since $(A+A')B+(A-A')B'=\pm2$. QM, figure 19 (all four axes in one plane: $\vec n_1$ at $0$, $\vec n_2$ at $\pi/4$, $\vec n_1'$ at $\pi/2$, $\vec n_2'$ at $-\pi/4$): $3\cos\frac\pi4-\cos\frac{3\pi}4=2\sqrt2$. Maximum $2\sqrt2$ (Tsirelson, supplement): $S^2=4-[A,A'][B,B']$.
Figure 19 in words: four unit vectors in a plane; $\vec n_1$ is the reference, $\vec n_2$ and $\vec n_2'$ lie $\pi/4$ on either side of it, $\vec n_1'$ is $\pi/4$ beyond $\vec n_2$, so that $\vec n_1'$ and $\vec n_2'$ are $3\pi/4$ apart.

## Hardy (sheet 13 Q3)
$\psi=\frac1{\sqrt3}(|{+}{+}\rangle+|{-}{+}\rangle+|{-}{-}\rangle)$; $P[a_0>b_0]=P[b_0>a_1]=P[a_1>b_1]=0$ would force $a_0\le b_1$, but $P[a_0>b_1]=\frac1{15}$.

## Teleportation (10.3)
$|\varphi\rangle|\psi\rangle$ decomposed in $\chi_1..\chi_4$; Bob's state $-\varphi$, $-\sigma_3\varphi$, $\sigma_1\varphi$, $-i\sigma_2\varphi$ (before correction), each outcome probability $\frac14$; corrections $\mathbb 1,\sigma_3,\sigma_1,\sigma_2$, 2 classical bits.

## No-cloning (supplement)
$\langle\varphi|\chi\rangle=\langle\varphi|\chi\rangle^2$ $\Rightarrow$ $\langle\varphi|\chi\rangle\in\{0,1\}$.
