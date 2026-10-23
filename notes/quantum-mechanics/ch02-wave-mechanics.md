# QM Ch. 1-3 — wave mechanics basics (script pp. 5-27, sheets I-III)

Sources: script `QM25...pdf` pp. 12-18 read visually (Compton, de Broglie, Schroedinger equation, current, Ehrenfest); sheets I-III in `sheets-01-03.md`;
Ch. 3.1 in `ch03-simple-systems.md`. Script pp. 5-11 (black body, Bohr) and pp. 19-25 (reality of observables, uncertainty, postulates) were not re-read for this room.

## Lecturer's notation (script Ch. 2)
- de Broglie: $\lambda=2\pi\hbar/p=h/p$, $\omega=E/\hbar$ (2.1); plane wave $\Psi=\Psi(0,0)e^{2\pi i x/\lambda-i\omega t}=\Psi(0,0)e^{ipx/\hbar-iEt/\hbar}$.
- $i\hbar\partial_t\Psi=\big(-\tfrac{\hbar^2}{2m}\partial_x^2+V\big)\Psi$ (2.7), $p=-i\hbar\partial_x$ (2.11), $\int|\Psi|^2dx=1$ (2.8).
- Density $\rho=|\Psi|^2$ (2.12); **current** $j=\dfrac{i\hbar}{2m}\big(\Psi\,\partial_x\Psi^*-\Psi^*\partial_x\Psi\big)$ (2.16); continuity $\partial_t\rho+\partial_xj=0$ (2.15).
  For $\Psi=Ae^{ikx/\hbar}$ this gives $j=|A|^2k/m$ (momentum convention, as in sheet II Q3 and exam FS22 Q1).
- Ehrenfest: $\frac d{dt}\langle x\rangle=\frac1m\langle p\rangle$ (2.25), $m\frac{d^2}{dt^2}\langle x\rangle=-\langle\partial_xV\rangle$ (2.26).
- Compton (1.4): $\lambda_2-\lambda_1=\frac h{mc}(1-\cos\theta)$; photon momentum $p^\mu=(\hbar k,\hbar\vec k)$ (1.23).

## Results used in the room (all re-derived or checked numerically in `game/test/content-check-qm.mjs`)
- Gaussian $\Psi(x,0)=(\lambda/\pi)^{1/4}e^{-\lambda x^2/2}$: $\Delta x_0^2=1/2\lambda$, $\Delta p^2=\hbar^2\lambda/2$; free evolution
  $\Delta x(t)^2=\frac1{2\lambda}\big[1+(\hbar\lambda t/m)^2\big]$ (checked by a split-step numerical run).
- Box: $\psi_n=\sqrt{2/a}\sin(n\pi x/a)$, $E_n=n^2\pi^2\hbar^2/2ma^2$; $\psi=\sqrt{30/a^5}\,x(a-x)$ has $P_n=960/(\pi n)^6$ for odd $n$ (so $P_1=0.99856$), and $\sum_{l\ge0}(2l+1)^{-6}=\pi^6/960$ (FS26 Q2).
- Sudden wall $a\to2a$ (sheet III Q4): $P_2=1/2$, $P_n=32/[\pi^2(4-n^2)^2]$ for odd $n$.
- 2D box (FS19 Q1): $E_{n_xn_y}=\frac{\pi^2\hbar^2}{2ma^2}(n_x^2+n_y^2)$; $R$ eigenvalues $\pm1$; $(2,1)$ and $(1,2)$ are degenerate, $(1,1)$ is not.
