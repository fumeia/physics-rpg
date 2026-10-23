# Solid State 06: the HS20 multiple-choice section and concept checklist

Source: Ensslin practice exam HS20, task 1 (30 pt, 20 sub-questions, 1.5 pt each), `materials/solid-state/old-exams/HS20.pdf`, key in
`materials/solid-state/solutions/Einführung in die Festkörperphysik HS20 (Solution).pdf`. The game has no multiple-choice encounter type yet
(see `docs/ENGINE_REQUESTS.md`, item 6), so the questions live here with the reasoning needed to answer them again from first principles. (Figures marked *fig*: described from the key.)

| | Question (short) | Key | Why |
|---|---|---|---|
| a | *fig* carrier density versus $T$ | doped semiconductor | freeze-out, exhaustion plateau ($n=N_d$), then intrinsic rise (script 5.3.2). Metal: flat; insulator/intrinsic: single activation. |
| b | superconductor DOS with gap $\Delta$ | vanishes in the gap, diverges at the gap edge | BCS coherence peaks (not in the 2026 script: ask whether superconductivity is examined) |
| c | p-type at $T=0$: $\epsilon_F$ | between valence band and acceptor level | acceptor level just above $\epsilon_v$ is empty, the valence band is full (script 5.3) |
| d | resistivity of a metal for $T\to0$ | constant (defects) | phonons freeze out ($\propto T^5$), residual resistivity $\propto n_d$ (4.32) |
| e | *fig* primitive translation vectors | $\vec a_1,\vec a_2$ | smallest cell: one lattice point per cell; check that every lattice point is an integer combination |
| f | *fig* which regular polygons are unit cells | the hexagon only | a space-filling tiling needs 2-, 3-, 4-, 6-fold symmetry; no 5, 7, 8 |
| g | *fig* Laue patterns for two of sc, fcc, bcc | (a) bcc, (b) fcc | bcc: $h+k+l$ even; fcc: all even or all odd; sc: nothing extinct |
| h | Debye–Scherrer in terms of the Ewald sphere | all reflections inside a sphere of radius $2k_0$ about the origin | powder = all orientations: every $\vec G$ with $|\vec G|\le2k_0$ gives a ring |
| i | phonon branches of NaCl | 3 acoustic + 3 optical | 2 atoms per cell: $3\times2=6$ branches (not the 1D 2+1) |
| j | which statement is true | van der Waals bonds come from charge fluctuations | covalent bonds are directional and can join different elements, ionic bonds join different elements |
| k | crystal volume halved | structure factor, electronic $c_V$ and number of branches are unchanged | intensive per cell quantities; $F$ depends on the basis, $c_V$ per electron, branches on atoms per cell (extensive quantities scale, intensive ones do not) |
| l | false statement on Einstein's model | "Einstein assumes linear dispersion, so all modes have the same velocity" | Einstein assumes a *flat* dispersion ($\delta$-function DOS), group velocity zero |
| m | $E_F$ for $5.00\times10^{22}$ cm$^{-3}$ | 4.95 eV | $\hbar^2(3\pi^2n)^{2/3}/2m$, with $n=5\times10^{28}$ m$^{-3}$ |
| n | $m^*$ at the minimum of $E_i-A_i-2B_i\cos ka$ | $\hbar^2/(2B_ia^2)$ | $E''(0)=2B_ia^2$ |
| o | *fig* 2D parabolic semiconductor DOS | step function | $\nu_{2D}=m^*/\pi\hbar^2$ per spin pair above the edge |
| p | Bloch theorem | plane wave times lattice-periodic function | holds in any dimension, also used in tight binding |
| q | which scattering gives no resistance | ion cores of the *perfectly periodic* lattice | Bloch states are exact eigenstates: no scattering |
| r | sign of exchange $J$ | $J>0$ in a ferromagnet, $J<0$ in an ordinary metal | HS20 uses the convention where $J>0$ favours parallel spins; careful: opposite sign in the Zheludev exams |
| s | resistance of a superconductor | (b) vanishes below $T_c$ and (d) $\propto T$ above $\Theta_D$ (applies to the normal state) | $T_c\ne\Theta_D$; above $H_c$ the superconductor is normal |
| t | *fig* correct p–n band diagram | (b) | p side: acceptors $-$ and bands higher in electron energy; n side: donors $+$; one common Fermi level; the built-in step is $\approx E_g/e$ |

## Concept checklist (derived from the oral protocols HS04–HS15, useful even for a written exam)
- *Chain dispersion*: assumptions (harmonic, nearest neighbours), ansatz $e^{i(qna-\omega t)}$, $\omega=2\sqrt{k/M}|\sin(qa/2)|$, long-wavelength limit gives the sound velocity $v=a\sqrt{k/M}$; first BZ.
- *Specific heat*: Dulong–Petit, Einstein (activated), Debye ($T^3$); which assumptions and why each fails where it does.
- *Bloch theorem and the band gap*: two plane waves at the zone boundary, gap $2|U_G|$; why $\epsilon(k)$ is periodic.
- *Free electrons*: $k_F$, $E_F$, $\nu$, why only $\sim T/T_F$ of the electrons contribute to $c_V$, $\chi_P$, $\kappa$.
- *Drude and Boltzmann*: only inelastic or non-periodic scattering matters; shifted Fermi sphere $\delta k=eE\tau/\hbar$; Hall coefficient and carrier sign.
- *Semiconductors*: $\epsilon_F(T)$ with doping (freeze-out, exhaustion, intrinsic); effective mass; why the Fermi level shifts up with $\ln(m_h^*/m_e^*)$.
- *p–n junction*: contact potential, depletion layer, rectification (generation vs recombination current).
- *Magnetism*: Pauli (no $T$ dependence), Curie ($1/T$), Curie–Weiss and the Weiss field; ferro vs antiferro; why exchange is not dipolar.

## Cross-course sentence starters (to say aloud)
- "A phonon is a quantum of a harmonic oscillator, so it obeys Bose–Einstein statistics; a photon is the same with $\omega=cq$ and two polarisations."
- "An electron in a metal and an electron in a white dwarf fill a Fermi sphere; only the density differs, by eleven orders of magnitude."
- "A donor is a hydrogen atom in a medium: Rydberg scales with $m^*/\epsilon_r^2$, Bohr radius with $\epsilon_r/m^*$."
