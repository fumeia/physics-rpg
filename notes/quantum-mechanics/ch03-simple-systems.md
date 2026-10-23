# QM Ch. 3 — Beispiele einfacher Systeme (script pp. 26–40)

Source: `materials/quantum-mechanics/scripts/QM25.Kap1+...+11.pdf`, read visually (PDF page = printed page).
Lecturer's notation is kept. Sections 3.1–3.5.

## Conventions (watch out, the script switches)
- 3.1–3.2 and 3.5: **wavenumber** convention, $k=\sqrt{2m(E+V)}/\hbar$, $\kappa=\sqrt{-2mE}/\hbar$, wave $e^{ikx}$.
- 3.3 (step) and 3.4: **momentum** convention, $k=\sqrt{2mE}$, wave $e^{ikx/\hbar}$. Then $l=\sqrt{2m(E-V_0)}$.
- Exercise sheet 4 uses $e^{ikx/\hbar}$ (momentum); sheet 5 uses $e^{ikx}$ with $k=\sqrt{2m(E-V)}/\hbar$ (wavenumber).
  Check the convention every time before comparing results.
- Well depth is $V>0$ with $V(x)=-V$ for $|x|\le a$ (width $2a$). Barrier: the script just reuses the well formula with $V<0$.

## 3.1 Particle in the box (p. 26–27)
$V=0$ on $[0,a]$, $\infty$ elsewhere ⇒ $\psi(0)=\psi(a)=0$ (only $\psi$ continuous, not $\psi'$; explained in 3.3).
General solution: $E<0$: cosh/sinh; $E=0$: $A+Bx$; $E>0$: cos/sin. Boundary conditions kill $E\le0$.
$$\psi_n=\sqrt{\tfrac2a}\sin\tfrac{n\pi x}{a},\qquad E_n=\frac{n^2\pi^2\hbar^2}{2ma^2},\quad n=1,2,\dots$$
- Discrete spectrum is a consequence of the boundary conditions; $E=0$ not allowed (compatible with uncertainty relation, ground state energy strictly positive).
- Node rule: $\psi_1$ no node, $\psi_{n+1}$ has $n$ nodes in $(0,a)$.
- Expansion of any state: $\Psi(x,t)=\sum c_n\psi_n e^{-iE_nt/\hbar}$, $c_n=\int_0^a\psi_n^*\Psi(x,0)\,dx$ (Fourier analysis / orthonormality, script eq. 2.48).

## 3.2 Particle in the well: bound states (p. 28–30)
$V(x)=-V$ for $|x|\le a$, $0$ otherwise; bound states need $E<0$ (and $E>-V$).
Outside: $\psi=Ae^{\kappa x}$ ($x<-a$), $De^{-\kappa x}$ ($x>a$). Inside: $Be^{ikx}+Ce^{-ikx}$.
Because $V(-x)=V(x)$, solve even and odd separately.
**Matching** (integrate Schrödinger over $[a-\epsilon,a+\epsilon]$: $E$ and $E+V$ finite, $\psi$ bounded ⇒ $\psi'$ continuous; hence $\psi$ too). Contrast box: infinite $V$ allows a kink.

| | even | odd |
|---|---|---|
| ansatz | $Ae^{\kappa x},\ 2B\cos kx,\ Ae^{-\kappa x}$ | $Ae^{\kappa x},\ 2iB\sin kx,\ -Ae^{-\kappa x}$ |
| matching at $x=-a$ | $Ae^{-\kappa a}=2B\cos ka,\ \kappa Ae^{-\kappa a}=2Bk\sin ka$ | $Ae^{-\kappa a}=-2iB\sin ka,\ \kappa Ae^{-\kappa a}=2iBk\cos ka$ |
| condition | $\kappa=k\tan(ka)$ | $\kappa=-k\cot(ka)$ |

With $\eta=\kappa a$, $\xi=ka$:
$$\eta=\xi\tan\xi\ (\text{even}),\qquad \eta=-\xi\cot\xi\ (\text{odd}),\qquad \xi^2+\eta^2=\frac{2ma^2V}{\hbar^2}.$$
Graphical solution: intersect the circle of radius $\sqrt{2ma^2V}/\hbar$ with the curve in the first quadrant ($\xi,\eta>0$).
- **Even**: always at least one bound state (the $\xi\tan\xi$ branch starts at the origin). Number of even states $N$: $(N-1)^2\pi^2<2ma^2V/\hbar^2\le N^2\pi^2$. For $2ma^2V/\hbar^2\le\pi^2$ exactly one.
- **Odd**: no solution if $2ma^2V/\hbar^2\le\pi^2/4$ (the curve $-\xi\cot\xi$ is negative for $\xi<\pi/2$).
- Total number of bound states $N$: $(N-1)^2\frac{\pi^2}{4}\le\frac{2ma^2V}{\hbar^2}\le N^2\frac{\pi^2}4$ (script eq. 3.65).

**Figure 6 (p. 30):** left panel plots $\eta$ vs $\xi$ for $V=4E_0$ and $V=64E_0$, $E_0=\hbar^2/(8ma^2)$, $a=w/2$. Solid branches of $\xi\tan\xi$, dashed branch of $-\xi\cot\xi$ (starting at $\xi=\pi/2$), two quarter circles of radius 1 and 4 (in units where $\xi^2+\eta^2=2ma^2V/\hbar^2$, i.e. $V=4E_0$ and $V=64E_0$): the small circle meets only the first branch (point 1), the large circle meets three branches (1', 2', 3'). Right: wavefunctions, nodeless for the flat potential; for the deep well 1' even/no node, 2' odd/one node, 3' even/two nodes, with energies rising, tails outside the well.

## 3.3 Step potential (p. 31–33)
$V=0$ for $x<0$, $V_0$ for $x\ge0$; particle from the left, $E>0$, momentum convention $k=\sqrt{2mE}$:
$\psi=Ae^{ikx/\hbar}+Be^{-ikx/\hbar}$ ($x<0$), $R=|B/A|^2$.
- **$E>V_0$**: $\psi=Ce^{ilx/\hbar}$ for $x>0$, $l=\sqrt{2m(E-V_0)}$, continuity of $\psi,\psi'$:
$A+B=C$, $(A-B)k=Cl$ ⇒ $\frac CA=\frac2{1+l/k}$, $\frac BA=\frac{1-l/k}{1+l/k}$.
$$R=\Big(\frac{1-l/k}{1+l/k}\Big)^2,\qquad T=\frac lk\Big|\frac CA\Big|^2=\frac{4l/k}{(1+l/k)^2},\qquad R+T=1.$$
The factor $l/k$ in $T$ comes from the probability current $\propto$ (momentum)·$|\text{amplitude}|^2$. $V_0\gg E$: $R$ grows. Classical: $T=1$ for $E>V_0$, so any $R>0$ is quantum.
- **$E<V_0$**: $\psi=C'e^{-\kappa x/\hbar}$, $\kappa=\sqrt{2m(V_0-E)}$; $\frac{C'}A=\frac2{1+i\kappa/k}$, $\frac BA=\frac{1-i\kappa/k}{1+i\kappa/k}$ ⇒ $R=1$, but $C'\ne0$: the particle penetrates the forbidden region (decays exponentially) and never reaches $\infty$. $V_0\to\infty$: $\kappa\to\infty$, $C'\to0$ (justifies the box boundary conditions).
- "Tunneling" in the strict sense: finite barrier with an allowed region behind it (finite $T$ though classically forbidden).
- **Figure 7 (p. 34):** schematic scanning tunneling microscope (Binnig & Rohrer, IBM): metal tip above a metal surface, piezo crystals move tip in $x,y$ (scanning) and $z$; the tunnel current $I_T$ depends exponentially on tip–surface distance; feedback keeps $I_T$ constant by adjusting the $z$-piezo voltage $V_z(x,y)$, which then is the height map of the surface.

## 3.4 Normalisation and wave packets (p. 33–36)
Plane waves $e^{ikx}$ are not square-integrable (continuous parameter). General solution: wave packet
$$\Psi(x,t)=\frac1{\sqrt{2\pi}}\int dk\,f(k)\,e^{ixk}e^{-iE_kt/\hbar}.$$
Using $\int dx\,e^{ikx}=2\pi\delta(k)$ (Fourier inversion with $\tilde f(p)=\frac1{\sqrt{2\pi}}\int dx\,e^{-ipx}f(x)$): $\int dx|\Psi|^2=\int dk|f(k)|^2$ — normalised iff $f\in L^2$ with norm 1. Continuum orthonormality: $\int dx\,\psi_{k'}^*\psi_k=\delta(k-k')$. Distributions: $\int f\delta=f(0)$, $\int f\delta'=-f'(0)$; a product of two distributions is not well defined in general.
**Gaussian packet:** $f(k)=\frac{\sqrt a}{\pi^{1/4}}e^{-a^2(k-k_0)^2/2}$ (momentum width $\sim1/a$). With $b^2=\frac{a^2}2+i\frac{\hbar t}{2m}$, $c=ix+a^2k_0$:
$$\Psi(x,t)=\frac{\sqrt a}{\sqrt2\,\pi^{1/4}b}\,e^{\left(\frac{a^4}{4b^2}-\frac{a^2}{2}\right)k_0^2}\,e^{-\frac{x^2}{4b^2}+ixk_0\frac{a^2}{2b^2}}$$
Gaussian again, width $\propto2b$; $|b|\sim\sqrt t$ at large $t$ ⇒ the packet spreads. (Transcription of the prefactor from p. 36; re-derive before using in a quest.)

## 3.5 Well with positive energy (p. 36–40)
For $E>0$, $x<-a$: $e^{ikx}+re^{-ikx}$, $-a<x<a$: $Ae^{ilx}+Be^{-ilx}$, $x>a$: $te^{ikx}$ (no wave from the right), $k=\sqrt{2mE}/\hbar$, $l=\sqrt{2m(E+V)}/\hbar$.
$$t=\frac{e^{-2ika}}{\cos 2la-i\frac{l^2+k^2}{2lk}\sin 2la},\qquad T=|t|^2=\frac1{1+\frac{\sin^2(2la)\,V^2}{4E(E+V)}}\ (<1).$$
Even $E>0$ particles are affected by the potential.
**3.5.1 Tunneling again.** Barrier = same formula with $V\to-V_b<0$ and $0<E<V_b$: $l$ imaginary, $|l|=\sqrt{2m(V_b-E)}/\hbar$:
$$T=\frac1{1+\frac{\sinh^2(2|l|a)\,V_b^2}{4E(V_b-E)}}.$$
For $2|l|a\gg1$: $T\approx\frac{16E(V_b-E)}{V_b^2}e^{-4|l|a}=\frac{16E(V_b-E)}{V_b^2}e^{-2\kappa L}$ with barrier width $L=2a$, $\kappa=|l|$ (derived here, the script only says "exponentially in $a$"). This is the STM $e^{-2\kappa L}$ law.
**3.5.2 Resonances.** $T=1$ iff $\sin 2la=0$, i.e. $l=n\pi/2a$: $E_\text{res}=E_0(n\pi)^2-V$, $E_0=\hbar^2/(8ma^2)$ (condition: an integer number of half-wavelengths fits in the width $2a$). Resonances with $E<0$ are only formal; there are exactly as many as bound states, $n=0,\dots,N-1$.
Bound states = poles of $t$: $2\cot 2la=\cot la-\tan la=\frac{ik}l-\frac l{ik}$ ⇒ $\tan la=-ik/l$ (even) or $\cot la=ik/l$ (odd); equals 3.22/3.29 under $k_\text{there}=l_\text{here}$, $\kappa_\text{there}=-ik_\text{here}$.
Near a resonance $E_n$: $e^{2ika}t\simeq\frac{i\Gamma/2}{(E-E_n)+i\Gamma/2}$, so $T\simeq\frac{\Gamma^2/4}{(E-E_n)^2+\Gamma^2/4}$ (Lorentzian of width $\Gamma$, with $\frac4\Gamma=\frac d{dE}\big[(\frac kl+\frac lk)\tan2la\big]_{E_n}$), and the phase $\delta(E)$ of $t=|t|e^{i\delta}$ rises by $\pi$ across the resonance.
**Figure 8 (p. 40):** (a) $|t|^2$ vs $E$: a vertical dashed line (bound state, $E_{n_1}<0$) and a Lorentzian peak of height 1 and width $\Gamma$ at $E_{n_2}>0$. (b) phase $\delta(E)$: a jump of $\pi$ at $E_{n_1}$, a smoothed rise of $\pi$ over width $\Gamma$ around $E_{n_2}$.

## Exam links
- Finite well / half-box with critical depth: HS18 problem 1, FS24 problem 2 (graphical argument for at least one bound state), HS16(b) 4–5 (bound/scattering 1D, existence by dimension). Half-box (infinite wall at 0, $V_0$ for $x>a$) is the odd sector of the well: bound state iff $V_0>\pi^2\hbar^2/(8ma^2)$ (derived by symmetry; compare HS18 solution once read).
- Step/current: FS22 problem 1 (continuity, $E<V_0$ ⇒ $j=0$), HS16 problem 4 (well with step).
- Box with parity operator: HS23 problem 2, FS26 problem 2, FS19 problem 1 (2D box).
