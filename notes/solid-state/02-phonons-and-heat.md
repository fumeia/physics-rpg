# Solid State 02: phonons and the specific heat of crystals

Sources: script Ch. 2 (pp. 38–65): 2.1 Einstein (Dulong–Petit), 2.2.5 diatomic chain, 2.3 phonons, 2.4 thermodynamics; HS20 MC (i),(k),(l); HS23 Aug P2b (Debye, Grüneisen);
oral protocols HS04, HS05, HS14 (concepts examiners probe). Game room `phonon-halls.json` (and the pressure boss in `drift-corridor.json`).

## Key formulas (lecturer's notation)
- **Diatomic chain** (script 2.32–2.37): cell $a$, masses $M_1,M_2$ at $0$ and $a/2$, spring $k$ between nearest neighbours.
  $D_{11}=\frac{2k}{M_1}$, $D_{22}=\frac{2k}{M_2}$, $D_{12}=-\frac{k}{\sqrt{M_1M_2}}(1+e^{iqa})$. $\det(D-\omega^2)=0$:
  $$\omega^2=k\Big(\frac1{M_1}+\frac1{M_2}\Big)\pm k\sqrt{\Big(\frac1{M_1}+\frac1{M_2}\Big)^2-\frac{2}{M_1M_2}(1-\cos qa)}.$$
  $q=0$: acoustic 0, optical $\sqrt{2k(1/M_1+1/M_2)}$. $q=\pi/a$: acoustic $\sqrt{2k/M_{\max}}$, optical $\sqrt{2k/M_{\min}}$, gap $\propto|1/\sqrt{M_1}-1/\sqrt{M_2}|$.
  $d\omega/dq=0$ at $q=\pi/a$ because $\omega(q)=\omega(-q)=\omega(q+2\pi/a)$. Sound velocity $v=a\sqrt{k/2(M_1+M_2)}$.
  Branch counting: 3 acoustic + $3(m-1)$ optical for $m$ atoms/cell (HS20 MC (i): NaCl has 3 acoustic + 3 optical, not "2+1"). $M_1=M_2$: gap closes, zone folds (Fig. 2.2).
- Phonon number: Bose–Einstein $\langle n\rangle=1/(e^{\hbar\omega/k_BT}-1)$ (2.60); energy $U=\int d\epsilon\,\nu(\epsilon)\epsilon\,n(\epsilon)$ (2.75), $\nu$ per unit volume (2.66).
- Acoustic DOS $\nu(\epsilon)=\frac{\epsilon^2}{2\pi^2(\hbar v)^3}$ per branch (2.68). **Debye**: $\nu(\epsilon)=\frac{9m}{V_0(\hbar\omega_D)^3}\epsilon^2\Theta(\hbar\omega_D-\epsilon)$ (2.73), $T_D=\hbar\omega_D/k_B$ (script writes $T_D$, the exams write $\Theta_D$).
  $C_V=\frac{9mk_B}{V_0}\big(\frac T{T_D}\big)^3\int_0^{T_D/T}\frac{y^4e^y}{(e^y-1)^2}dy$ (2.78). $T\ll T_D$: $C_V=\frac{12\pi^4}{5}\frac{mk_B}{V_0}\big(\frac T{T_D}\big)^3$ (2.79, "per volume"); $T\gtrsim T_D$: $C_V=3mk_B/V_0$ (Dulong–Petit, 2.80).
  As a fraction of Dulong–Petit the $T^3$ law reads $\frac{4\pi^4}{5}(T/T_D)^3=77.9\,(T/T_D)^3$ (a plain mistake to quote $12\pi^4/5$ as that fraction; caught by the numeric check).
  $T^3$ law valid roughly below $T_D/50$ (Cu: below 7 K).
- **Einstein**: all $3N$ modes at $\omega_E$: $C/3Nk_B=x^2e^x/(e^x-1)^2$, $x=\Theta_E/T$; exponentially activated at low $T$ (too fast), right for flat optical branches (2.74).
- Typical $T_D$: Pb 100 K, Cu 343 K, Al 428 K, diamond 2240 K.
- Anharmonicity: phonons decay, finite lifetime = peak width in inelastic scattering. Thermal expansion and Grüneisen: $\Delta\omega/\omega=-\gamma\,\Delta V/V$.
- Inelastic neutron scattering: thermal neutrons ($\lambda\sim2$ Å, $E\sim15$ meV) match both $\hbar\omega$ and $q$. Powder at large $Q$ gives the DOS (script 2.4.2).

## Frequently probed (oral protocols) and how to answer
- *Why does $C_V\propto T^3$?* Only acoustic modes with $\hbar\omega<k_BT$ are excited: number $\propto(k_BT/\hbar v)^3$, each $\sim k_B$ (script 2.40-2.41, "active modes" argument).
- *Why does the classical limit saturate at $3Nk_B$?* Finite number $3mN$ of modes, each classical for $k_BT\gg\hbar\omega_{\max}$.
- *Why did Einstein fail at low $T$?* Gap at $\hbar\omega_E$; real solids have gapless acoustic phonons.
- *Why zero group velocity at the zone edge?* Standing waves / Bragg reflection of the phonon.

## Electrons versus phonons in $C_V$
$C=\gamma T+\beta T^3$, $\gamma=\frac{\pi^2}{3}\nu(\epsilon_F)k_B^2$. Plot $C/T$ against $T^2$: intercept $\gamma$, slope $\beta$. Cu: $\gamma=0.505$ mJ mol$^{-1}$K$^{-2}$ (free electron value), $\beta=1944/T_D^3=4.8\times10^{-5}$ J mol$^{-1}$K$^{-4}$: equal at $T_\times=\sqrt{\gamma/\beta}=3.2$ K.

## Connections
- QM: each mode is a harmonic oscillator, $E=\hbar\omega(n+\frac12)$ (HO elevator, ladder operators create/annihilate phonons).
- Astro: **photons and phonons**: boson gas $\omega=vq$, $g$ polarisations: $u=g\pi^2(k_BT)^4/30(\hbar v)^3$; photons $g=2,v=c$ give $aT^4$ (Stefan–Boltzmann, CMB), phonons $g=3$ give the Debye $T^3$ law. Verified numerically in the Degenerate Core room.
