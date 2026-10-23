# Solid State 03: free electrons, bands, transport

Sources: script Ch. 3.1 (pp. 66–76), 3.2 (pp. 77–87), 4.1–4.3 (pp. 93–110); HS23 Jan/Aug P2a/2b; HS20 MC (a),(d),(m),(n),(o),(p),(q), Task 3 (Hall), Task 5 (M point).
Game rooms `fermi-sea.json`, `drift-corridor.json`. Verified numerically in `content-check-solid-state.mjs`.

## Free-electron gas (script 3.1)
- Periodic boundary conditions: $\vec k$ states occupy $(2\pi)^3/V$, spin gives 2. $N=\frac{2V}{(2\pi)^3}\frac{4\pi}3k_F^3$, so $k_F=(3\pi^2n)^{1/3}$.
  $\epsilon_F=\frac{\hbar^2k_F^2}{2m}$, $\nu(\epsilon)=\frac{m^{3/2}}{\pi^2\hbar^3}\sqrt{2\epsilon}$ (both spins, per volume), $\nu(\epsilon_F)=\frac{3n}{2\epsilon_F}$, Fermi surface area $S_F=4\pi k_F^2$.
- Cu: $n=8.47\times10^{28}$ m$^{-3}$, $k_F=1.36$ Å$^{-1}$, $\epsilon_F=7.0$ eV, $T_F=8.2\times10^4$ K. Handy: $\hbar^2/2m_e=3.81$ eV Å$^2$.
  HS20 MC (m): $n=5.00\times10^{22}$ cm$^{-3}=5\times10^{28}$ m$^{-3}$ gives **4.95 eV** (watch the cm$^{-3}$ conversion).
- Specific heat (3.26–3.33): $C_V=\gamma T+\beta T^3$, $\gamma$-term $c_V=\frac{\pi^2}3\nu(\epsilon_F)k_B^2T=\frac{\pi^2}{2}\frac{nk_B^2T}{\epsilon_F}$ (only $\nu k_BT$ electrons are active).
- Scaling for ratio problems: $\epsilon_F\propto n^{2/3}$, $k_F\propto n^{1/3}\propto1/a$, $S_F\propto n^{2/3}$, $\nu(\epsilon_F)\propto k_F\propto n^{1/3}$, $c_V\propto\nu(\epsilon_F)$.
  Doubling $n$: $S_A/S_B=2^{-2/3}=0.63$, $\nu_A/\nu_B=c_{V,A}/c_{V,B}=2^{-1/3}=0.79$ (HS23 Jan 2a). Lattice constant $a\to0.9a$ (one electron per cell): $E_F$ and $S_F\times1.23$, $\nu,c_V\times1.11$ (Aug 2a).
- Interactions: Landau's argument, excitations near $\epsilon_F$ have long lifetime ($\propto T^{-2}$): non-interacting picture works.

## Bloch theorem, bands (script 3.2)
- $\psi_{\vec k}=u_{\vec k}(\vec r)e^{i\vec k\cdot\vec r}$, $u$ periodic (3.38). $\vec k$ is defined modulo $\vec G$: restrict to the 1st BZ and add a band index $n$. $\epsilon(\vec k)=\epsilon(-\vec k)$ and periodic. $\vec v=\frac1\hbar\nabla_{\vec k}\epsilon$ (3.41). Crystal momentum $\hbar\vec k\ne$ momentum.
- **Nearly free electrons**: $\big(\frac{\hbar^2k^2}{2m}-E\big)C_{\vec k}+\sum_{\vec G}U_{\vec G}C_{\vec k-\vec G}=0$. At a zone boundary $k$ and $k-G$ are degenerate: $2\times2$ determinant, $E_\pm=\epsilon_k\pm|U_G|$, **gap $E_g=2|U_G|$**, $U_G$ the Fourier component of the potential. Standing waves $\cos,\sin$.
  HS20 Task 5 (2D, $U=4U_0\cos\frac{2\pi x}a\cos\frac{2\pi y}a$): $U_{\vec G}=U_0$ for $\vec G=\pm\frac{2\pi}a(1,\pm1)$; at $M=\frac\pi a(1,1)$ four degenerate waves, couplings $0\leftrightarrow\frac{2\pi}a(1,1)$ and $\frac{2\pi}a\hat x\leftrightarrow\frac{2\pi}a\hat y$,
  $E_\pm=\frac{\hbar^2\pi^2}{ma^2}\pm U_0$, $E_g^{(M)}=2U_0$ (numerically checked by diagonalising the $4\times4$ matrix).
- **Tight binding**: $\psi_{\vec k}=\sum_je^{i\vec k\cdot\vec r_j}\phi(\vec r-\vec r_j)$; 1D with nearest-neighbour hopping $E(k)=E_i-A_i-2B_i\cos ka$ (HS20 MC (n)); bandwidth $4B_i$; minimum at $k=0$; $m^*=\hbar^2/(2B_ia^2)$ (so $m^*/m_e=3.81/(B[\mathrm{eV}]a^2[\text{Å}]^2)$).
  Narrow band (small overlap, localised orbitals) means heavy electrons. Each atomic orbital becomes a band.
- Effective mass: $\frac1{m^*}=\frac1{\hbar^2}\frac{\partial^2\epsilon}{\partial k^2}$; negative curvature (valence-band top) = positive-mass holes with $m_h^*=-\hbar^2/\epsilon''$.
- 2D DOS for parabolic bands is a **step function** (constant above the band edge) (HS20 MC (o)); 1D: $\propto1/\sqrt{E-E_0}$; 3D: $\propto\sqrt{E-E_0}$.

## Transport (script 4.1–4.3)
- Drude: $m\dot{\vec v}+m\vec v/\tau=-e(\vec E+\vec v\times\vec B)$. Steady state: $\sigma=ne^2\tau/m$, $\mu=e\tau/m$ (4.4–4.5). Field off: $v\propto e^{-t/\tau}$.
- Cu at 300 K: $\rho=1.7\times10^{-8}\,\Omega$m, $\tau=25$ fs, $v_F=1.57\times10^6$ m/s, $\ell=v_F\tau=39$ nm.
- **Hall** (script 4.1.2 geometry: $I\parallel\hat x$, $B\parallel\hat z$, $V$ along $y$): $R_H=-\frac1{ne}$ (4.9). Exam HS20: current along $y$, $B_z$: $E_x=\pm j_yB_z/ne$, $U_H=dE_x$, $n=\frac{d\,j_yB_z}{e|U_H|}=\frac{IB}{e\,d\,|U_H|}$. Sign of $U_H$ gives carrier type. Cu: $U_H$ is nV (use semiconductors).
- Only inelastic/non-periodic processes give resistance: a perfect lattice does not scatter (HS20 MC (q): ion cores of the exactly periodic lattice do not contribute).
- Matthiessen: $\tau^{-1}=\sum\tau_i^{-1}$, $\rho=\sum\rho_i$. Phonons: $\rho\propto T$ for $T\gg T_D$ ($N_p\propto T$); $\rho\propto T^5$ for $T\ll T_D$ (large-angle scattering needs $n\propto T^{-2}$ steps, random walk argument); transition near $0.2T_D$.
  Defects: $\tau^{-1}=v_Fn_dQ$, $\rho_{\rm def}=\frac{3n_dQ}{e^2v_F\nu(\epsilon_F)}$, constant, residual resistivity (HS20 MC (d): constant due to defects). e–e: $T^2$.
  At high $T$: number of phonons $N_p=\frac{9nk_BT}{2\hbar\omega_DV_0}\propto T/\Theta_D$ (HS23 Jan 2b (e): doubling $\Theta_D$ halves the scattering rate).
- Thermal conduction and Wiedemann–Franz (4.40–4.41): $\kappa=\frac{\pi^2}{9}(k_Bv_F)^2T\tau\,\nu(\epsilon_F)$ (4.40), $\frac{\kappa}{\sigma T}=\frac{\pi^2}{3}\big(\frac{k_B}{e}\big)^2=2.44\times10^{-8}$ W$\Omega$K$^{-2}$.
  **The Aug-2024 key writes $\pi^2k_B^2/2e^2$: the script has $\pi^2/3$.** Only ratios were asked, so the result $\kappa_A/\kappa_B=\rho_B/\rho_A$ is unaffected.

## Ratio problem recipe (HS23 2a/2b)
1. Write each quantity in terms of $n$ (or $a$, $\Theta_D$) with the scaling above. 2. Take the ratio, drop all constants. 3. For resistivity: $\rho\propto1/(k_F^2\nu\tau)\propto n^{-1}\tau^{-1}$ for free electrons, then insert the scattering model.
Results: phonon-limited, same $\Theta_D$, $n_B=2n_A$: $\rho_A/\rho_B=2$; with $\Theta_{D,B}=2\Theta_{D,A}$: 4. Defect-limited with $\rho_A=2\rho_B$: $\tau_A/\tau_B=1$, $n_{d,A}/n_{d,B}=2^{1/3}$, $\kappa_A/\kappa_B=1/2$.
Pressure ($a\to0.9a$, Grüneisen $\gamma=2$): $\Delta V/V=-0.271$, $\omega\times1.54$, $v\times1.39$, $\Theta_D=154$ K, $\rho_B/\rho_A=1$ at fixed $\Theta_D$, $\rho_A/\rho_B=1.54$ with the $\Theta_D$ shift.

## Connections
- QM: the Fermi sea is the box problem with $N\to\infty$ (counting $\vec k$, Pauli); NFE gap = degenerate perturbation theory with a $2\times2$ (sheet 14 Stark); Bloch waves in a lattice are the exact transmission resonances of a periodic potential (transfer matrix, sheet 5).
- Astro: white-dwarf electrons obey the same $\epsilon_F\propto n^{2/3}$, $P=\frac25n\epsilon_F$ (Degenerate Core room).
