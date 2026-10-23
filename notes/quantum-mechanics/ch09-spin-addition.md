# Ch. 9 Addition of angular momenta (script pp. 93-107), sheets 11 Q2-3, 12 Q1/Q3, HS25 Q4, FS24 Q3

Sources: script Ch. 9.1 (tensor products), 9.2-9.3 (addition, two spin-1/2), 9.4 (Clebsch-Gordan series), 9.5 (CG coefficients, example 9.5.1); sheets 11 Q2 (spinors), Q3 ($D_{1/2}\otimes D_1$), 12 Q1 (Stern-Gerlach with molecules), 12 Q3 (CG for $l\otimes\frac12$); HS25 Q4 (spin-1 addition, 21 pt); FS24 Q3 (spin systems, 25 pt, German).

## Series and highest weights
$D_{j_1}\otimes D_{j_2}=\bigoplus_{j=|j_1-j_2|}^{j_1+j_2}D_j$, $m=m_1+m_2$. Method: top state $|j_1;j_2\rangle$ is the top of $j_1+j_2$; $S_-=S_{1-}+S_{2-}$ builds the multiplet; the orthogonal state with the highest remaining $m$ is the top of the next $j$ (annihilated by $S_+$).
Two spin-1/2: triplet $|\uparrow\uparrow\rangle$, $\frac1{\sqrt2}(\uparrow\downarrow+\downarrow\uparrow)$, $|\downarrow\downarrow\rangle$; singlet $\frac1{\sqrt2}(\uparrow\downarrow-\downarrow\uparrow)$. $\vec S_1\cdot\vec S_2=\frac12(S^2-S_1^2-S_2^2)$: $\frac{\hbar^2}4$, $-\frac{3\hbar^2}4$.
Stern-Gerlach: $N$ spin-1/2 atoms give $N+1$ beams, binomial weights ($1:2:1$, $1:3:3:1$).

## Spin 1 x spin 1 (HS25 Q4)
$|2,2\rangle=|1;1\rangle$; $|2,1\rangle=\frac1{\sqrt2}(|1;0\rangle+|0;1\rangle)$; $|2,0\rangle=\frac1{\sqrt6}(|1;-1\rangle+2|0;0\rangle+|-1;1\rangle)$; $|1,1\rangle=\frac1{\sqrt2}(|1;0\rangle-|0;1\rangle)$; $|1,0\rangle=\frac1{\sqrt2}(|1;-1\rangle-|-1;1\rangle)$; $|0,0\rangle=\frac1{\sqrt3}(|1;-1\rangle-|0;0\rangle+|-1;1\rangle)$.
$H=\frac\omega\hbar\vec S_1\cdot\vec S_2$: $E_\sigma=\frac{\hbar\omega}2[\sigma(\sigma+1)-4]=\hbar\omega,-\hbar\omega,-2\hbar\omega$ (5,3,1).
$|0;0\rangle=\frac2{\sqrt6}|2,0\rangle-\frac1{\sqrt3}|0,0\rangle$, $|\psi(t)\rangle=\frac{e^{-i\omega t}}3[(1-e^{3i\omega t})(|1;-1\rangle+|-1;1\rangle)+(2+e^{3i\omega t})|0;0\rangle]$, $P(0;0)=\frac{5+4\cos3\omega t}9$.

## l x 1/2 (sheet 12 Q3)
$|l+\frac12,m\rangle=\sqrt{\frac{l+m+1/2}{2l+1}}|m-\frac12\rangle|\uparrow\rangle+\sqrt{\frac{l-m+1/2}{2l+1}}|m+\frac12\rangle|\downarrow\rangle$. $l=1$: $|\frac32,\frac12\rangle=\sqrt{\frac23}|0\rangle\uparrow+\sqrt{\frac13}|1\rangle\downarrow$.

## FS24 Q3
(a) $\pm\frac\hbar2$ with $\frac12$, mean 0. (b) $U^\dagger P_\pm(\vec e_z)U=P_\pm(R(\vec n,-\theta)\vec e_z)$ so Alice = Bob. (c) $P_\pm=\frac12(1\pm\vec e'\cdot\hat x)$. (e) $S^2\in\{0,2,6\}\hbar^2$. (f) $|1,1\rangle|1,1\rangle$ has $S^2=6\hbar^2$. (g) unique singlet $\frac1{\sqrt3}(|1;-1\rangle-|0;0\rangle+|-1;1\rangle)$.
