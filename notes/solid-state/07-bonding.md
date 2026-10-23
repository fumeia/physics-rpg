# Solid State 07: bonding (script 1.6)

Sources: script Ch. 1.6 (pp. 24–37), eqs. 1.37–1.47, Tables 1.1–1.2 (page 29 read visually: eq. 1.47 is missing from the text extract);
HS20 MC (j). Game room `bonding-grotto.json`. Low exam weight (one MC item so far), but quick to learn.

## Formulas
- Van der Waals (1.37–1.42): fluctuating dipole $\langle p^2\rangle\sim e^2r_0^2$, field $E\sim p/4\pi\epsilon_0R^3$, polarisability $\alpha\sim4\pi\epsilon_0r_0^3$,
  $U(R)\approx-\frac{e^2r_0^5}{4\pi\epsilon_0R^6}$. At $R=2r_0$: $1/32$ of the Coulomb energy of two charges; at $3r_0$: $1/243$.
- Lennard-Jones (1.43): $U=4U_0[(\sigma/R)^{12}-(\sigma/R)^6]$, minimum at $R_{\min}=2^{1/6}\sigma=1.12\sigma$, depth $U_0$.
  Noble gases (Table 1.1): Ne 36 K/2.74 Å, Ar 121 K/3.4 Å, Kr 163 K/3.65 Å, Xe 231 K/3.98 Å; boiling temperature $\approx U_0/k_B$.
  fcc with nearest neighbours: $E/N=6U(R)$, $v=R^3/\sqrt2$, $E/N=-6U_0$, $B=\frac{96}{\sqrt2}U_0/R_{\min}^3$ (Ar: 63 meV, 2.0 GPa; measured 80 meV, 2.7 GPa).
- Ionic (1.44–1.47): $U=-N\frac{e^2\alpha}{4\pi\epsilon_0R_0}$, Madelung $\alpha$: NaCl 1.7476, CsCl 1.7627, 1D chain $2\ln2$. NaCl: 8.9 eV per pair.
  Born repulsion $C/R^n$ (standard extension): $U=-\frac{e^2\alpha}{4\pi\epsilon_0R_0}(1-\frac1n)$, $B=\frac{(n-1)\alpha e^2}{72\pi\epsilon_0R_0^4}$; NaCl $n\approx8$: 7.8 eV, 25 GPa (measured 7.9 eV, 24 GPa).
- Covalent (1.6.4): H$_2$ bonding/antibonding orbitals, charge between the nuclei, directional. Hydrogen bond (1.6.5), metallic (1.6.6): collective band.

## Script inconsistencies (checked numerically in the content check)
1. Text and Table 1.1 say $R_{\min}\approx1.3\sigma$ (Ar: 4.7 Å). Eq. 1.43 has its minimum at $2^{1/6}\sigma=1.12\sigma$ (Ar: 3.82 Å), which is what matches $R_{\rm crystal}$ (3.76 Å).
2. Table 1.2 lists NaCl cohesion "per ion computed using eq. 1.47" as $1.80\times10^4$ K. Eq. 1.47 with $R_0=2.82$ Å gives $1.04\times10^5$ K per pair ($5.2\times10^4$ K per ion).
   The boiling-energy balance that follows in the text relies on the table value. Learn the formula, not the table.

## Connections
- QM: Pauli principle (repulsion), orbital overlap and the two-level bonding/antibonding problem (H$_2$), exponential tails of bound states.
- Astro: Pauli pressure again (white dwarfs); van der Waals forces hold interstellar dust grains and ices together.
