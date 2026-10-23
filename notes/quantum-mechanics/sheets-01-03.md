# QM exercise sheets I–III (weeks 1–3)

Sources: `exercises/Exercises 1–3.pdf`, `solutions/Solutions 1–3.pdf` (Gaberdiel HS25, same sheets as this year).
Script chapters: Ch. 1 (history), Ch. 2 (wave mechanics), Ch. 3.1 (box). Solutions read via text extraction; the
results below were re-derived or checked numerically where stated.

## Sheet I

### Q1 Compton effect
(i) **Thomson scattering** (classical light): $m\ddot x=-eE(x,t)$ with $E=\varepsilon E_0\cos(kx-\omega t)$, electron initially at rest ⇒ $x(t)$ oscillates at the driving frequency $\omega$ (after the constant offset from the initial conditions); the emitted dipole radiation has **the same frequency $\omega$**.
(ii) **Compton**: photon $(cp_1,\vec p_1)$ off an electron at rest, scattered by $\theta$. 4-momentum conservation, eliminating the electron's $p,\varphi$ by squaring:
$$\lambda_2=\lambda_1+\frac h{mc}(1-\cos\theta),\qquad \lambda_C=\frac h{mc}\approx2.42\times10^{-12}\ \text{m}.$$
Key steps: $p_2\sin\theta=p\sin\varphi$, $p_1-p_2\cos\theta=p\cos\varphi$ ⇒ $p^2=p_1^2-2p_1p_2\cos\theta+p_2^2$; energy: $c(p_1-p_2)+mc^2=c\sqrt{m^2c^2+p^2}$ ⇒ $2p_1p_2(1-\cos\theta)=2mc(p_1-p_2)$; divide by $p_1p_2$.
(iii) Thomson is the limit $\lambda\gg h/mc$ (relative shift $|\lambda'-\lambda|/\lambda\ll1$). Visible light ($10^{-7}$ m) shows no Compton effect; hard X-rays and γ-rays do.

### Q2 Bohr atom and de Broglie
$m v_nr_n=n\hbar$, $r_n=n^2\hbar^2/(me^2)$ (Gaussian units in the sheet).
(i) $\lambda/r_n=h/(p\,r_n)=2\pi\hbar/(mv_nr_n)=2\pi/n$: the wave fits around the orbit, $2\pi r_n=n\lambda$.
(ii) $v_n=e^2/(n\hbar)$, $v_1=2.19\times10^6$ m/s $\ll c$ (that is $\alpha c$): non-relativistic treatment is justified.
(iii) Emitted wavelength $\lambda_{nm}=hc/[\text{Ry}(1/m^2-1/n^2)]\ge\lambda_{\infty1}=hc/\text{Ry}\approx91$ nm $\gg a_0\approx5.29\times10^{-11}$ m (checked: $hc=1239.84$ eV nm, Ry $=13.606$ eV ⇒ 91.1 nm).

### Q3 Galilean invariance
If $\Psi(x,t)$ solves the free Schrödinger equation, so does $\Psi_u(x,t)=\Psi(x-ut,t)\exp\!\big[\tfrac{im}{\hbar}(ux-\tfrac12u^2t)\big]$. Proof: compute $i\hbar\partial_t\Psi_u$ and $-\frac{\hbar^2}{2m}\partial_x^2\Psi_u$; the cross terms $-i\hbar u\,\partial_x\Psi$ and the $\frac m2u^2\Psi$ terms match on both sides and the rest is the original equation at $(x-ut,t)$. (The phase factor is the Galilean boost; $|\Psi_u|^2$ is just the boosted density.)

## Sheet II

### Q1 Ehrenfest theorem
$m\,\dfrac{d^2}{dt^2}\langle x\rangle=-\langle V'(x)\rangle$.
Route: $\frac d{dt}\langle x\rangle=\frac{i\hbar}{2m}\int x\,\partial_x(\Psi^*\partial_x\Psi-\Psi\partial_x\Psi^*)\,dx=-\frac{i\hbar}{2m}\int(\Psi^*\partial_x\Psi-\Psi\partial_x\Psi^*)\,dx$ (integration by parts, boundary terms vanish); differentiate again, use the Schrödinger equation and its conjugate; the kinetic terms cancel by integration by parts and the potential term gives $-\langle\partial_xV\rangle/m$.
### Q2 Reality of $\langle H\rangle$
$\langle H\rangle-\langle H\rangle^*=-\frac{\hbar^2}{2m}\int(\Psi^*\Psi''-\Psi^{*\prime\prime}\Psi)\,dx=0$ after two integrations by parts ($V$ real).
### Q3 Probability current of a superposition
$\Psi_k=(Ae^{ikx/\hbar}+Be^{-ikx/\hbar})e^{-iE_kt/\hbar}$ solves the free equation for $E_k=k^2/2m$ (each term does, superposition principle) and
$$j=\frac{i\hbar}{2m}(\Psi\partial_x\Psi^*-\Psi^*\partial_x\Psi)=(|A|^2-|B|^2)\frac km$$
(momentum convention for $k$; right-mover minus left-mover).

## Sheet III

### Q1 Gaussian wavefunction $\Psi=Ae^{-\lambda x^2/2}$
(i) $A=(\lambda/\pi)^{1/4}$ (the solution writes $|A|=\sqrt{\pi\lambda}$ in one place, a typo).
(ii) It solves the stationary equation for $V(x)=\frac{\hbar^2\lambda^2}{2m}x^2$ with $E=\frac{\hbar^2\lambda}{2m}$: the harmonic oscillator ground state ($\lambda=m\omega/\hbar$ ⇒ $E=\hbar\omega/2$).
(iii) $\langle x\rangle=0$, $\langle x^2\rangle=1/(2\lambda)$ ⇒ $\Delta x=1/\sqrt{2\lambda}$; $\langle p\rangle=0$, $\langle p^2\rangle=\hbar^2\lambda/2$ ⇒ $\Delta p=\hbar\sqrt{\lambda/2}$; $\Delta x\,\Delta p=\hbar/2$ (saturates the uncertainty relation).
(iv) Better position control ⇒ larger $\lambda$ (steeper trap) ⇒ larger $\Delta p$ and $E=\hbar^2\lambda/2m\to\infty$ as $\Delta x\to0$: perfect localisation costs infinite energy.
### Q2 Particle in a box I
$\Psi(x,0)=1/\sqrt a$ on $[0,a]$, $\psi_n=\sqrt{2/a}\sin(n\pi x/a)$, $E_n=\frac{n^2\pi^2\hbar^2}{2ma^2}$.
$c_n=\frac{\sqrt2}{n\pi}\,[1-(-1)^n]$ ⇒ $p_n=|c_n|^2=\dfrac8{n^2\pi^2}$ for odd $n$, $0$ for even $n$ (the state is even about the centre, so only the even-parity eigenstates contribute).
Normalisation $\sum p_n=1$ ⇒ $\sum_{m\ge1}\frac1{(2m-1)^2}=\frac{\pi^2}8$; with $\zeta(2)=\frac{\zeta(2)}4+\frac{\pi^2}8$ ⇒ $\zeta(2)=\frac{\pi^2}6$.
### Q3 Box II: moments in the $n$-th state
$\langle x\rangle=a/2$, $\langle x^2\rangle=\frac{a^2}3-\frac{a^2}{2\pi^2n^2}$, hence
$$(\Delta x)^2=\frac{a^2}{12}\Big(1-\frac6{n^2\pi^2}\Big)\xrightarrow{n\to\infty}\frac{a^2}{12},$$
the uniform classical distribution ($\langle x^2\rangle_\text{cl}=a^2/3$).
### Q4 Box III: the wall moves suddenly from $a$ to $2a$
Initial state $\psi_1=\sqrt{2/a}\sin(\pi x/a)$ on $[0,a]$ (zero on $[a,2a]$); new eigenstates on $[0,2a]$: $\phi_n=\frac1{\sqrt a}\sin\frac{n\pi x}{2a}$, $E_n=\frac{n^2\pi^2\hbar^2}{8ma^2}$ (the sheet's eq. 6).
Coefficients (derived here, solution not transcribed): $c_2=1/\sqrt2$, $c_{n\text{ even}\ne2}=0$, $c_{n\text{ odd}}=\dfrac{4\sqrt2\,\sin(n\pi/2)}{\pi(4-n^2)}$, so $P_n=\dfrac{32}{\pi^2(4-n^2)^2}$ for odd $n$ ($P_1=0.360$, $P_3=0.130$, $P_5=0.0074$; the odd $n$ add up to $1/2$).
$P(\text{energy unchanged})=P_2=\tfrac12$ because the old energy $E=\pi^2\hbar^2/2ma^2$ equals the new $E_2$ ($=4\pi^2\hbar^2/8ma^2$). Classical intuition: a sudden expansion does no work on the particle (the wall moved while the particle was far from it or not at all), so the energy stays; quantum mechanically only half of the probability keeps it.
$\Psi(x,t)=\sum_nc_n\phi_n(x)e^{-iE_nt/\hbar}$.

## Exam links
- Gaussian/uncertainty: HS18 problem 2 (uncertainty), Ehrenfest: HS21 problem 1, FS19 problem 2, FS22 problem 1 (current).
- Box with projection onto eigenstates: FS26 problem 2, FS19 problem 1 (2D box), HS16/FS16 short questions.
- Sudden change of the box is the same idea as the HS25 problem 2(v) (sudden change of the nuclear charge).
