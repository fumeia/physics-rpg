# Ch. 11 Perturbation theory (script pp. 114-130), sheet 14, exams

Sources: script Ch. 11.1 (non-degenerate, p.114), 11.1.1 (perturbed oscillator, p.117), 11.2 (degenerate, p.118), 11.2.4 (Stark, p.123), 11.3 (time dependent, p.124-130);
sheet 14 Q1 (anharmonic oscillator, see oscillator room), Q2 (Stark), HS25 Q3, FS19 Q4 = HS18 Q4, FS22 Q4, FS26 Q4, HS21 Q4.

## Non-degenerate (FS19 Q4 (i), 10 pt)
$H=H_0+\lambda H'$, $H_0\psi_n=E_n\psi_n$, $E_n\ne E_m$. Ansatz $\psi=\sum\lambda^s\psi^{(s)}$, $E=\sum\lambda^sE^{(s)}$, convention $\langle\psi_n|\psi^{(s)}\rangle=0$ for $s\ge1$.
Order $\lambda^s$: $(H_0-E_n)\psi^{(s)}=\sum_{k=1}^{s}(E^{(k)}-\delta_{k1}H')\psi^{(s-k)}$ (for $s=1$: $(H_0-E_n)\psi^{(1)}=(E^{(1)}-H')\psi_n$).
Project on $\langle\psi_n|$: $E^{(1)}=\langle n|H'|n\rangle$, $E^{(2)}=\sum_{m\ne n}\frac{|\langle m|H'|n\rangle|^2}{E_n-E_m}$; $\psi^{(1)}=\sum_{m\ne n}\frac{\langle m|H'|n\rangle}{E_n-E_m}\psi_m$.
Valid if $|\langle m|\lambda H'|n\rangle|\ll|E_n-E_m|$. Two levels: $E_\pm=\frac{\varepsilon_1+\varepsilon_2}2\pm\frac12\sqrt{\Delta^2+4V^2}$, PT gives $\varepsilon_1-V^2/\Delta$.
Ground state: second order always $\le0$ (level repulsion from above).

## p^4 correction of the oscillator (FS19 Q4 = HS18 Q4)
$H'=\alpha p^4$, $\alpha=-(8m^3c^2)^{-1}$, $p=i\sqrt{m\hbar\omega/2}(a^\dagger-a)$, $\epsilon=\hbar\omega/mc^2$: $H'=-\frac{\epsilon\hbar\omega}{32}(a^\dagger-a)^4$.
$(a^\dagger-a)^4|0\rangle=3|0\rangle-6\sqrt2|2\rangle+\sqrt{24}|4\rangle$. So $E^{(1)}=-\frac3{32}\epsilon\hbar\omega$, $E^{(2)}=-\frac{\epsilon^2\hbar\omega}{1024}\left(\frac{72}{2}+\frac{24}{4}\right)=-\frac{21}{512}\epsilon^2\hbar\omega$.
$H''=\beta p^6$, $\beta=(16m^5c^4)^{-1}$: $\langle0|p^6|0\rangle=15(m\hbar\omega/2)^3$ gives $+\frac{15}{128}\epsilon^2\hbar\omega$ at first order, the same order as $E^{(2)}$ of $H'$. Total $\epsilon^2$ coefficient $\frac{15}{128}-\frac{21}{512}=\frac{39}{512}$.

## Degenerate (FS22 Q4)
Degenerate subspace $\{|i\rangle\}$, $E_m$ $g$-fold: $\det(\langle i|H'|j\rangle-E^{(1)}\delta_{ij})=0$. Use symmetry: if $[H',A]=0$ and the states are eigenstates of $A$ with distinct eigenvalues, the matrix is diagonal.
3D oscillator, $E=\frac52\hbar\omega$: $|100\rangle,|010\rangle,|001\rangle$; $L_z=i\hbar(ab^\dagger-a^\dagger b)$ gives $L_z|100\rangle=i\hbar|010\rangle$, $L_z|010\rangle=-i\hbar|100\rangle$, $L_z|001\rangle=0$: $\lambda\omega\hbar\{+1,0,-1\}$ (the $l=1$ multiplet: SO(3) representation theory).

## Stark effect n=2 (sheet 14 Q2, script 11.2.4)
$\Delta H=-e\vec E\cdot\vec x=-eEz$ ($e<0$). $z$: odd parity, $[L_z,z]=0$, so only $\langle200|z|210\rangle=-3a_0$. Matrix $\begin{pmatrix}0&-\varepsilon\\-\varepsilon&0\end{pmatrix}$, $\varepsilon=3|e|Ea_0$: $E=E_2\pm3|e|Ea_0$, states $(|200\rangle\mp|210\rangle)/\sqrt2$; $|21\pm1\rangle$ unshifted. Linear Stark effect (permanent dipole $3ea_0$ in the $n=2$ manifold; $n=1$ only quadratic).

## Relativistic kinetic correction (FS26 Q4, 21 pt)
$T=\sqrt{p^2c^2+m^2c^4}-mc^2=\frac{p^2}{2m}-\frac{p^4}{8m^3c^2}+\dots$; $H'=-p^4/8m^3c^2$ keeps rotations and parity (so $l,m$ good), breaks the hidden SO(4) (Runge-Lenz): $l$ degeneracy lifted.
$p^2=2m(E_n-V)=2m(E_n+e^2/r)$, so $E^{(1)}_{nlm}=-\frac1{2mc^2}\left(E_n^2+2e^2E_n\langle\frac1r\rangle+e^4\langle\frac1{r^2}\rangle\right)$.
$\langle1/r\rangle=\frac1{n^2a}$, $\langle1/r^2\rangle=\frac1{n^3(l+1/2)a^2}$, giving $E^{(1)}=-\frac{E_n^2}{2mc^2}\left(\frac{4n}{l+1/2}-3\right)$. For $n=2$: $\langle1/r\rangle=\frac1{4a}$ for both $l$; $\langle1/r^2\rangle=\frac1{4a^2}$ ($l=0$), $\frac1{12a^2}$ ($l=1$); $E^{(1)}_{2,0}=-\frac{13}{128}mc^2\alpha^4$, $E^{(1)}_{2,1}=-\frac7{384}mc^2\alpha^4$ (both negative, $l=0$ lowest, independent of $m$).

## Time-dependent (HS21 Q4, briefly)
$\Psi_D=U_D\Psi_D(t_0)$, $U_D=U_0^\dagger U$, $i\hbar\dot U_D=\lambda H'_D(t)U_D$, $H'_D=U_0^\dagger H'U_0$. First order: $P_{i\to f}=\frac1{\hbar^2}\left|\int_{t_0}^tdt'\,e^{i(E_f-E_i)t'/\hbar}\langle f|H'(t')|i\rangle\right|^2$. Constant $V$ switched on at 0: $P=\frac{4|V|^2}{\Delta^2}\sin^2\frac{\Delta t}{2\hbar}$, $\Delta=E_f-E_i$.
