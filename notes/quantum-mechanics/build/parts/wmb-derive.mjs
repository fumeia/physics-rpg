import { src, derive } from '../lib.mjs';
const r = String.raw;

export const derives = [
  derive({
    id: 'qm-wm-D1', title: r`Compton scattering: the wavelength shift (sheet I Q1)`,
    source: src.ex(1, 'Question 1 (ii), Compton formula; script Ch. 1.4'),
    goal: r`Derive $\lambda_2-\lambda_1=\frac h{mc}(1-\cos\theta)$ for a photon scattered by an electron at rest.`,
    given: [r`photon $p^\mu=(\hbar k,\hbar\vec k)$ with $k=2\pi/\lambda$ (energy $\hbar kc$), electron initially at rest, relativistic $E_e^2=p_e^2c^2+m^2c^4$`, r`energy and momentum conservation, scattering angle $\theta$ between $\vec k_1$ and $\vec k_2$`],
    steps: [
      { prompt: r`(a) Write both conservation laws.`, reveal: r`Energy: $\hbar k_1c+mc^2=\hbar k_2c+E_e$. Momentum: $\hbar\vec k_1=\hbar\vec k_2+\vec p_e$.` },
      { prompt: r`(b) Eliminate the unknown electron angle: square the momentum law.`, reveal: r`$p_e^2=\hbar^2(\vec k_1-\vec k_2)^2=\hbar^2(k_1^2+k_2^2-2k_1k_2\cos\theta)$.` },
      { prompt: r`(c) Square the energy law solved for $E_e$ and use $E_e^2=p_e^2c^2+m^2c^4$.`, reveal: r`$E_e=\hbar c(k_1-k_2)+mc^2$, so $E_e^2=\hbar^2c^2(k_1-k_2)^2+2mc^2\hbar c(k_1-k_2)+m^2c^4$. Equate with $\hbar^2c^2(k_1^2+k_2^2-2k_1k_2\cos\theta)+m^2c^4$.` },
      { prompt: r`(d) Simplify and convert to wavelengths.`, reveal: r`The $E_e^2$ and $m^2c^4$ terms: the squares $k_1^2,k_2^2$ cancel, leaving $-2k_1k_2\hbar^2c^2+2mc^3\hbar(k_1-k_2)=-2k_1k_2\hbar^2c^2\cos\theta$, i.e. $mc\,(k_1-k_2)=\hbar k_1k_2(1-\cos\theta)$. Divide by $k_1k_2$: $\frac1{k_2}-\frac1{k_1}=\frac\hbar{mc}(1-\cos\theta)$. With $k=2\pi/\lambda$: $\lambda_2-\lambda_1=\frac{2\pi\hbar}{mc}(1-\cos\theta)=\frac h{mc}(1-\cos\theta)$.` },
    ],
    keyPoints: [r`two conservation laws, three unknowns reduce to one by squaring`, r`no electron angle appears in the result`, r`$\lambda_C=h/mc=2.426$ pm sets the scale`, r`maximal shift $2\lambda_C$ at $\theta=\pi$`],
  }),
  derive({
    id: 'qm-wm-D2', title: r`Continuity equation and probability current (FS22 Q1 (i))`,
    source: src.exam('FS22', 'Question 1 (i), 4 pt'),
    goal: r`Show $\partial_t\rho+\partial_xj=0$ with $\rho=|\Psi|^2$ and define $j$.`,
    given: [r`$i\hbar\partial_t\Psi=-\frac{\hbar^2}{2m}\partial_x^2\Psi+V(x)\Psi$ with real $V$`, r`complex conjugate: $-i\hbar\partial_t\Psi^*=-\frac{\hbar^2}{2m}\partial_x^2\Psi^*+V\Psi^*$`],
    steps: [
      { prompt: r`(a) Write $\partial_t\rho$ with the product rule.`, reveal: r`$\partial_t\rho=\Psi^*\partial_t\Psi+\Psi\,\partial_t\Psi^*$.` },
      { prompt: r`(b) Insert both Schroedinger equations.`, reveal: r`$\partial_t\Psi=\frac1{i\hbar}\big(-\frac{\hbar^2}{2m}\Psi''+V\Psi\big)$, $\partial_t\Psi^*=-\frac1{i\hbar}\big(-\frac{\hbar^2}{2m}\Psi^{*\prime\prime}+V\Psi^*\big)$. The $V$ terms cancel because $V$ is real.` },
      { prompt: r`(c) Collect the second-derivative terms as a total derivative.`, reveal: r`$\partial_t\rho=\frac{i\hbar}{2m}\big(\Psi^*\Psi''-\Psi\Psi^{*\prime\prime}\big)=\partial_x\Big[\frac{i\hbar}{2m}\big(\Psi^*\Psi'-\Psi\Psi^{*\prime}\big)\Big]$, since the cross terms $\Psi^{*\prime}\Psi'$ cancel.` },
      { prompt: r`(d) Define $j$ and check a plane wave.`, reveal: r`$j=\frac{i\hbar}{2m}\big(\Psi\,\partial_x\Psi^*-\Psi^*\partial_x\Psi\big)=\frac\hbar m\,\mathrm{Im}(\Psi^*\partial_x\Psi)$ (script 2.16), so $\partial_t\rho+\partial_xj=0$. For $\Psi=Ae^{ikx/\hbar}$: $j=|A|^2k/m$ ($k$ is a momentum).` },
    ],
    keyPoints: [r`real potential makes the $V$ terms cancel`, r`second-derivative terms form a total derivative`, r`$j=\frac\hbar m\mathrm{Im}(\Psi^*\Psi')=\rho v$ for plane waves`, r`complex $V$ would absorb probability`],
  }),
  derive({
    id: 'qm-wm-D3', title: r`Ehrenfest's theorem (HS21 Q1, FS19 Q2 (i))`,
    source: src.exam('HS21', 'Question 1 (ii)-(iv), 5 pt; also FS 19 Aufgabe 2 (i), 5 pt'),
    goal: r`Show $\frac d{dt}\langle x\rangle=\frac1m\langle p\rangle$ and $m\frac{d^2}{dt^2}\langle x\rangle=-\langle V'(x)\rangle$.`,
    given: [r`$i\hbar\partial_t|\psi\rangle=H|\psi\rangle$, $H=\frac{p^2}{2m}+V(x)$, $[x,p]=i\hbar$`, r`$x$ has no explicit time dependence`],
    steps: [
      { prompt: r`(a) Differentiate $\langle x\rangle=\langle\psi|x|\psi\rangle$ and insert the Schroedinger equation and its adjoint.`, reveal: r`$\frac d{dt}\langle x\rangle=\frac{i}{\hbar}\langle\psi|Hx|\psi\rangle-\frac i\hbar\langle\psi|xH|\psi\rangle=\frac i\hbar\langle[H,x]\rangle$.` },
      { prompt: r`(b) Compute $[H,x]$.`, reveal: r`$V$ commutes with $x$; $[p^2,x]=p[p,x]+[p,x]p=-2i\hbar p$. Hence $[H,x]=\frac{1}{2m}(-2i\hbar p)=-\frac{i\hbar}mp$.` },
      { prompt: r`(c) Combine.`, reveal: r`$\frac d{dt}\langle x\rangle=\frac i\hbar\cdot\big(-\frac{i\hbar}m\big)\langle p\rangle=\frac1m\langle p\rangle$.` },
      { prompt: r`(d) Repeat for $p$ and state the classical limit.`, reveal: r`$\frac d{dt}\langle p\rangle=\frac i\hbar\langle[H,p]\rangle$ with $[V(x),p]=i\hbar V'(x)$, so $\frac d{dt}\langle p\rangle=-\langle V'(x)\rangle$ and $m\frac{d^2}{dt^2}\langle x\rangle=-\langle V'(x)\rangle$. This equals Newton's law for $\langle x\rangle$ only if $\langle V'(x)\rangle=V'(\langle x\rangle)$, exactly true for $V$ at most quadratic (harmonic oscillator).` },
    ],
    keyPoints: [r`$\frac d{dt}\langle A\rangle=\frac i\hbar\langle[H,A]\rangle$`, r`$[H,x]=-i\hbar p/m$, $[H,p]=i\hbar V'$`, r`mean values obey Newton only if $\langle V'(x)\rangle=V'(\langle x\rangle)$`, r`for $V=\alpha x^4$: $\langle x^3\rangle\ne\langle x\rangle^3$`],
  }),
  derive({
    id: 'qm-wm-D4', title: r`Free spreading of a Gaussian packet (sheet III Q1)`,
    source: src.ex(3, 'Question 1 (Gaussian wave function); free spreading extends it, script Ch. 2'),
    goal: r`Show $\Delta x(t)^2=\frac1{2\lambda}\big[1+(\hbar\lambda t/m)^2\big]$ for $\Psi(x,0)=(\lambda/\pi)^{1/4}e^{-\lambda x^2/2}$ with $V=0$.`,
    given: [r`$\Delta x_0^2=\frac1{2\lambda}$, momentum space $\tilde\Psi(p)\propto e^{-p^2/2\hbar^2\lambda}$, so $\Delta p^2=\frac{\hbar^2\lambda}2$`, r`free evolution: each momentum component gets the phase $e^{-ip^2t/2m\hbar}$`],
    steps: [
      { prompt: r`(a) Why is $\Delta p$ constant in time?`, reveal: r`$H=p^2/2m$ commutes with $p$, so $|\tilde\Psi(p,t)|^2=|\tilde\Psi(p,0)|^2$ and $\Delta p^2=\hbar^2\lambda/2$ forever.` },
      { prompt: r`(b) Write the Gaussian integral for $\Psi(x,t)$.`, reveal: r`$\Psi(x,t)\propto\int dp\,e^{-p^2(1/2\hbar^2\lambda+it/2m\hbar)+ipx/\hbar}$: a Gaussian with complex width $\frac1{\lambda}\to\frac1\lambda+\frac{i\hbar t}m$.` },
      { prompt: r`(c) Evaluate and read off the width.`, reveal: r`$|\Psi(x,t)|^2\propto\exp\!\big[-\frac{\lambda x^2}{1+(\hbar\lambda t/m)^2}\big]$, a Gaussian with $\Delta x^2=\frac{1+(\hbar\lambda t/m)^2}{2\lambda}$.` },
      { prompt: r`(d) Interpret.`, reveal: r`$\Delta x(t)^2=\Delta x_0^2+(\Delta p\,t/m)^2$: initial width plus the ballistic spread of the momentum distribution. $\Delta x\,\Delta p=\frac\hbar2\sqrt{1+(\hbar\lambda t/m)^2}\ge\hbar/2$, the packet is minimal only at $t=0$.` },
    ],
    keyPoints: [r`$\Delta p$ is conserved for a free particle`, r`complex Gaussian integral gives $\lambda\to\lambda/(1+i\hbar\lambda t/m)$`, r`$\Delta x^2=\Delta x_0^2+(\Delta pt/m)^2$`, r`narrow packets spread faster`],
  }),
  derive({
    id: 'qm-wm-D5', title: r`Sudden wall: box $[0,a]\to[0,2a]$ (sheet III Q4)`,
    source: src.ex(3, 'Question 4, box whose wall is suddenly moved'),
    goal: r`A particle in the ground state of a box of width $a$ finds its wall moved suddenly to $2a$. Find the probabilities $P_n$ of energies of the new box.`,
    given: [r`old: $\psi_1=\sqrt{2/a}\sin(\pi x/a)$ on $[0,a]$; new: $\phi_n=\sqrt{1/a}\sin(n\pi x/2a)$ on $[0,2a]$`, r`sudden change: the wave function does not change, $P_n=|\langle\phi_n|\psi_1\rangle|^2$`],
    steps: [
      { prompt: r`(a) Write the overlap.`, reveal: r`$c_n=\int_0^a\phi_n\psi_1\,dx=\frac{\sqrt2}a\int_0^a\sin\frac{\pi x}a\sin\frac{n\pi x}{2a}dx$ (the old state vanishes for $x>a$).` },
      { prompt: r`(b) The case $n=2$.`, reveal: r`$\sin\frac{2\pi x}{2a}=\sin\frac{\pi x}a$, so $c_2=\frac{\sqrt2}a\int_0^a\sin^2\frac{\pi x}a=\frac{\sqrt2}a\cdot\frac a2=\frac1{\sqrt2}$ and $P_2=\frac12$.` },
      { prompt: r`(c) General $n\ne2$ by product-to-sum.`, reveal: r`$\sin A\sin B=\frac12[\cos(A-B)-\cos(A+B)]$ gives $\int_0^a=\frac a{\pi}\Big[\frac{\sin((n-2)\pi/2)}{n-2}-\frac{\sin((n+2)\pi/2)}{n+2}\Big]$. Even $n\neq2$: both sines vanish. Odd $n$: the sines are equal, so $\int_0^a=\frac{4a}\pi\frac{\sin((n-2)\pi/2)}{n^2-4}$.` },
      { prompt: r`(d) Probabilities and check.`, reveal: r`$P_n=\frac{32}{\pi^2(n^2-4)^2}$ for odd $n$, $P_2=\frac12$, $P_{\text{even}\ne2}=0$. E.g. $P_1=\frac{32}{9\pi^2}=0.360$. Normalisation: $\frac12+\sum_{n\text{ odd}}P_n=1$.` },
    ],
    keyPoints: [r`sudden change: project the old state on the new eigenstates`, r`$P_2=\tfrac12$ (resonant mode)`, r`only odd $n$ besides $n=2$`, r`$P_n=32/[\pi^2(n^2-4)^2]$`],
  }),
];
