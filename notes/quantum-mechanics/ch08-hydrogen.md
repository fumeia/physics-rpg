# Ch. 8-9.7 Hydrogen atom, so(4), spin-orbit and Zeeman; sheets 10 Q1, 11 Q1, 14 Q3; HS25 Q2

Sources: script Ch. 8.1 (relative coordinates, p.82), 8.2 (Coulomb potential, pp.84-87), 8.3 (dynamical symmetry so(4), pp.88-92), 9.7 (anomalous Zeeman effect, spin-orbit, pp.105-107, eq. 9.7.29 for $\langle r^{-3}\rangle$);
sheet 10 Q1 (3D oscillator by the hydrogen method), sheet 11 Q1 (so(4)), sheet 14 Q3 (spin-orbit + Zeeman), HS25 Q2 (hydrogenic ground state), HS22 A.7 (short question on $N$ commuting su(2)).

## Radial problem
$\Psi=\frac{u(r)}{r}Y_{lm}$: $\big[-\frac{\hbar^2}{2m}\partial_r^2+\frac{\hbar^2l(l+1)}{2mr^2}-\frac{e^2}{r}\big]u=Eu$. Small $r$: $u\sim r^{l+1}$; large $r$: $u\sim e^{-\sqrt{-2mE}r/\hbar}$. Ansatz $u=r^{l+1}e^{-r/na}\sum c_kr^k$: the series must terminate, $n=k_{max}+l+1$.
$E_n=-\frac{me^4}{2\hbar^2n^2}=-\frac{e^2}{2an^2}$, $a=\frac{\hbar^2}{me^2}$, degeneracy $n^2$ ($l=0..n-1$, $m=-l..l$). Rydberg lamp: $\hbar\omega=13.6\,\mathrm{eV}\,(n^{-2}-n'^{-2})$; Lyman-$\alpha$ 10.2 eV, Balmer-$\alpha$ 1.89 eV.
$R_{10}=2a^{-3/2}e^{-r/a}$, $R_{20}=\frac1{\sqrt{8a^3}}(2-\frac ra)e^{-r/2a}$, $R_{21}=\frac1{\sqrt{24a^3}}\frac rae^{-r/2a}$. $\langle1/r\rangle=\frac1{n^2a}$, $\langle1/r^2\rangle=\frac1{n^3(l+1/2)a^2}$, $\langle1/r^3\rangle=\frac1{n^3a^3l(l+1/2)(l+1)}$.
Contrast with the oscillator: $u\sim e^{-mr^2\omega/2\hbar}$ at large $r$ (sheet 10).

## so(4) (sheet 11 Q1)
$\vec J=\frac1{2m}(\vec p\wedge\vec L-\vec L\wedge\vec p)-\kappa\vec x/r$ conserved. $\vec J\cdot\vec L=0$, $\vec J^2=\frac{2H}m(\vec L^2+\hbar^2)+\kappa^2$, $[J_i,J_j]=i\hbar\epsilon_{ijk}(-\frac{2H}m)L_k$. At fixed $E<0$: $\vec S=\frac12(\vec L+a\vec J)$, $\vec D=\frac12(\vec L-a\vec J)$, $a=\sqrt{-m/2E}$: two commuting su(2).
$S^2=D^2=\frac14\big(-\hbar^2-\frac{m\kappa^2}{2E}\big)=\hbar^2s(s+1)$ with $s=\frac{n-1}2$. Space: $D_s\otimes D_s$, dimension $n^2$; $\vec L=\vec S+\vec D$ gives $l=0,\dots,n-1$. Highest weight $|n,n-1,n-1\rangle$: $\psi\propto r^{n-1}\sin^{n-1}\theta\,e^{i(n-1)\phi}e^{-r/na}$, annihilated by $L_+,J_+$.
HS22 A.7: $N=2$, eigenvalue $\frac{15}4\hbar^2$ means $s=\frac32$, $n=4$: $(2s+1)^N=16$ states.

## Hydrogenic ground state (HS25 Q2)
$H=-\frac{\hbar^2}{2m}\nabla^2-\frac{Ze^2}r$, $\psi=\frac1{\sqrt{\pi a^3}}e^{-r/a}$: $\nabla^2\psi=(\frac1{a^2}-\frac2{ar})\psi$, so $a=\frac{\hbar^2}{mZe^2}=\frac{a_0}Z$, $E=-\frac{Z^2e^2}{2a_0}$. $\psi$ is parity-even and $L_j\psi=0$, so $\langle x_i\rangle=0$, $\langle x_i^2\rangle=\frac13\langle r^2\rangle=a^2$ ($\langle r^2\rangle=3a^2$); $\Delta x=a$, $\Delta p=\frac\hbar{\sqrt3a}$, $\Delta x\Delta p=\frac\hbar{\sqrt3}\ge\frac\hbar2$.
Sudden $Z\to\tilde Z$: $P=|\langle\tilde\psi|\psi\rangle|^2=\frac{64(Z\tilde Z)^3}{(Z+\tilde Z)^6}$ ($0.702$ for $1\to2$).
Variational: trial $e^{-r/b}$: $\langle H\rangle=\frac{\hbar^2}{2mb^2}-\frac{e^2}b$, minimum at $b=a$, $E=-\frac{e^2}{2a}$ exact.

## Spin-orbit and Zeeman (sheet 14 Q3)
$H_{SO}=\frac1{2m^2c^2}\frac1r\frac{dV}{dr}\vec L\cdot\vec S=\frac{e^2}{2m^2c^2r^3}\vec L\cdot\vec S$, $H_Z=\frac{\mu_BB_z}\hbar(L_z+2S_z)$, $\mu_B=\frac{e\hbar}{2mc}$.
$\vec L\cdot\vec S=\frac12(J^2-L^2-S^2)=\frac{\hbar^2}2[j(j+1)-l(l+1)-\frac34]$. $E_{SO}=\frac{nE_n^2}{mc^2}\frac{j(j+1)-l(l+1)-3/4}{l(l+1/2)(l+1)}$; $2p$: $j=\frac32$: $+\frac1{96}$, $j=\frac12$: $-\frac1{48}$ in units $mc^2\alpha^4$, splitting $\frac{\alpha^4mc^2}{32}=4.5\times10^{-5}$ eV.
Paschen-Back ($\mu_BB\gg$ splitting): $E=\mu_BB(m_l+2m_s)+\frac{2nE_n^2}{mc^2}\frac{m_lm_s}{l(l+1/2)(l+1)}$. Weak field: $\Delta E=g_{lj}\mu_BBm_j$, $g_{l,l+1/2}=\frac{2+2l}{1+2l}$, $g_{l,l-1/2}=\frac{2l}{1+2l}$ (projection theorem), $g=1+\frac{j(j+1)+s(s+1)-l(l+1)}{2j(j+1)}$.
