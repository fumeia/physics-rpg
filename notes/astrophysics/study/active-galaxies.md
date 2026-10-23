# The Quasar Beacon

*Astro Observatory Ship. Topics: Hubble sequence, spirals vs ellipticals, Tully–Fisher and Faber–Jackson, synchrotron radiation, bremsstrahlung, AGN and quasars, superluminal motion, galaxy clusters, large-scale structure.*

Beyond the Milky Way: galaxies of two great families, nuclei that outshine their whole galaxy from a region the size of the Solar System, jets that seem to move faster than light, and clusters filled with $10^8$ K gas. Radiation processes (synchrotron, bremsstrahlung) are the tools for reading all of them.

**Sources:** Choudhuri_Textbook.pdf (Choudhuri Ch. 8.10 (power-law particle spectra), 8.11 (synchrotron, s = (p−1)/2, eq. 8.69), 8.12 (bremsstrahlung 8.70-8.71), 9.2 (de Vaucouleurs 9.2, exponential disk 9.3, Faber–Jackson 9.4, Tully–Fisher 9.8), 9.4 (AGN, superluminal 9.21), 9.5 (clusters), 9.6 (large-scale structure)); Astro_I_2024_Winter_Session_with_Solutions.pdf (HS24 winter: open Q5 (spiral vs elliptical), Q6 (quasar variability), MC 12, 13); Astro_I_2025_Winter_Session_with_Solutions.pdf (HS25 winter: MC 11; open Q5 (cluster bremsstrahlung)); Astro_I_2024_Summer_Session_with_Solutions.pdf (HS24 summer: MC 11, 12); Astro_I_2025_Practice_Exam_with_Solutions.pdf (HS25 practice: MC 9, 14, 15)

## 📖 Spirals and ellipticals: the Hubble sequence (intuition)

🖼️ **Picture it.** Hubble's tuning fork: ellipticals E0 (round) to E7 (flattened) on the handle; then S0 (lenticular, disk without arms) at the fork; then two prongs, normal spirals Sa → Sb → Sc and barred spirals SBa → SBc, with smaller bulges and more open, clumpier arms towards c. Irregulars off the end. It is a classification, not an evolutionary sequence.

<b>Ellipticals vs spirals</b> (HS24 winter Q5 asks for three): morphology (smooth ellipsoid vs disk + bulge + arms); dynamics (random motions vs rotation); colour (red vs blue); stellar population (old, no star formation vs young, active star formation); gas (little cold gas vs a lot); environment (common in dense clusters vs in the field); surface brightness ($I\propto\exp[-7.67((r/r_e)^{1/4}-1)]$, de Vaucouleurs vs exponential disk $I_0e^{-r/r_d}$).

$$\sigma\approx220\left(\frac{L}{L_*}\right)^{1/4}\mathrm{km\,s^{-1}}\ \text{(Faber–Jackson, ellipticals)},\qquad v_c\approx220\left(\frac{L}{L_*}\right)^{0.22}\mathrm{km\,s^{-1}}\ \text{(Tully–Fisher, spirals)}$$  
*(9.4), (9.8). Measure a velocity, get the luminosity, compare with the flux: a distance.*

💡 **Intuition.** Both scaling relations are the virial theorem in disguise: $v^2\sim GM/R$, and if all galaxies have similar surface brightness ($L/R^2$) and mass-to-light ratio, then $L\propto v^4$.

⚠️ **Pitfall.** Spiral <b>disks</b> are bluer and younger than ellipticals (HS25 practice MC9). The bulges of spirals look like small ellipticals (old, red).

### Check yourself

**1.** Compared with ellipticals, spiral disks are

- A) redder, older population
- B) redder, younger
- C) bluer, older
- D) bluer, younger population

<details><summary>Answer</summary>

**D**. Active star formation. *(HS25 practice: MC 9)*

</details>

## 📖 Synchrotron and bremsstrahlung: reading non-thermal and thermal light

<b>Synchrotron:</b> relativistic electrons spiralling around magnetic field lines. Relativistic beaming confines each electron's emission to a cone of angle $\sim1/\gamma$; the observer sees short pulses and the spectrum peaks near $\nu\sim\gamma^2\nu_g$, with $\nu_g=eB/(2\pi m_e)=28\,\mathrm{GHz}\,(B/1\,\mathrm T)$. Shock acceleration gives a power law of electron energies, and the sum is a power law:

$$N(E)\propto E^{-p}\ \Rightarrow\ f(\nu)\propto\nu^{-s},\qquad s=\frac{p-1}{2}$$  
*Choudhuri (8.65)-(8.69). p ≈ 2.6 gives s ≈ 0.8, typical of radio sources.*

Derivation in two lines: an electron of energy $E$ radiates power $\propto E^2$ at frequency $\nu\propto E^2$. Then $f(\nu)d\nu\propto E^2E^{-p}dE$ with $E\propto\nu^{1/2}$, $dE\propto\nu^{-1/2}d\nu$: $f\propto\nu^{(2-p)/2}\nu^{-1/2}=\nu^{-(p-1)/2}$.

<b>Thermal bremsstrahlung</b> (free–free): electrons deflected by ions in a hot plasma. Emissivity (8.70)-(8.71):

$$\epsilon_\nu\propto\frac{n_en_iZ^2}{\sqrt T}e^{-h\nu/k_BT},\qquad\epsilon=\int\epsilon_\nu d\nu=1.4\times10^{-40}\sqrt T\,n_en_iZ^2g\ \ \mathrm{W\,m^{-3}}$$

💡 **Intuition.** Two fingerprints. Synchrotron: power law, polarised, needs B and relativistic electrons (radio galaxies, supernova remnants, the Crab, the Galactic radio background). Bremsstrahlung: flat spectrum with an exponential cut-off at $h\nu\sim k_BT$ (so the cut-off measures $T$), unpolarised, $\propto n^2$ (two-body process). A cluster with $T=10^8$ K glows in X-rays ($k_BT\approx9$ keV), concentrated where the gas is densest.

⚠️ **Pitfall.** Spectrum index sign: $p=2$ gives $f\propto\nu^{-1/2}$ (HS25 winter MC11), not $\nu^{-1}$. Bremsstrahlung goes as $\rho_{\rm gas}^2$, not $\rho$ (HS24 winter MC12).

### Check yourself

**1.** Electrons with $N(E)\propto E^{-2}$ emit a synchrotron spectrum

- A) $\nu^{-1/2}$
- B) $\nu^{-1}$
- C) $\nu^{-3/2}$
- D) $\nu^{-2}$

<details><summary>Answer</summary>

**A**. $s=(p-1)/2=1/2$. *(HS25 winter: MC 11)*

</details>

**2.** Synchrotron radiation is produced by

- A) neutrinos changing flavour
- B) self-gravitating particles
- C) dark matter virialising
- D) free electrons spiralling around magnetic field lines

<details><summary>Answer</summary>

**D**. Relativistic electrons in B. *(HS24 summer: MC 11)*

</details>

**3.** X-ray bremsstrahlung from an isothermal cluster atmosphere is

- A) concentrated in dense regions ($\propto\rho_{\rm gas}^2$)
- B) linear in density
- C) concentrated in low-density regions
- D) independent of density

<details><summary>Answer</summary>

**A**. $\epsilon\propto n_en_p$. *(HS24 winter: MC 12)*

</details>

## 📖 Active galactic nuclei: black-hole engines

<b>Seyfert galaxies</b> (1943): spirals with an unusually bright, point-like nucleus and strong emission lines (Seyfert 1: broad + narrow lines; Seyfert 2: only narrow). <b>Radio galaxies</b>: mostly ellipticals with giant radio lobes fed by jets. <b>Quasars</b>: the most luminous, often outshining the host 100×, seen to high redshift. <b>Blazars</b>: a jet pointing at us.

<b>Size from variability:</b> a source cannot vary coherently faster than light crosses it, $R\lesssim c\,\Delta t$. Quasars vary in days: $R\lesssim10^{-3}$ pc, smaller than the Solar System, yet $L\sim10^{39}$–$10^{40}$ W. Only accretion onto a supermassive black hole ($\eta\sim0.1$) delivers that: if $R\gtrsim r_s=2GM/c^2$, $M\lesssim Rc^2/2G$.

<b>Unified model:</b> a black hole with an accretion disk (thermal UV/optical "big blue bump"), fast clouds close in (broad lines), a dusty torus, slower clouds further out (narrow lines), and sometimes two jets. Seen face-on: Seyfert 1 / quasar; edge-on through the torus: Seyfert 2; down the jet: blazar.

$$v_\perp=\frac{v\sin\theta}{1-(v/c)\cos\theta},\qquad v_{\perp,\max}=\gamma v\ \ \text{at}\ \cos\theta=v/c$$  
*Superluminal motion (9.21): a blob moving at v at angle θ to our line of sight.*

💡 **Intuition.** Superluminal motion is a light-travel-time illusion: the blob almost catches up with its own light, so the arrival times are compressed while the sideways displacement is not. Nothing moves faster than $c$.

⚠️ **Pitfall.** The Eddington limit caps the AGN luminosity: $L\le L_{Edd}=1.3\times10^{31}(M/M_\odot)$ W, which gives a <b>lower</b> limit on the black-hole mass, while variability gives an <b>upper</b> limit on the size and, via $r_s$, on the mass (HS24 winter Q6).

### Check yourself

**1.** Seyfert galaxies are

- A) spirals with a bright nucleus and strong emission lines
- B) spirals with a bright nucleus, no strong lines
- C) ellipticals with a bright nucleus and strong lines
- D) ellipticals, no strong lines

<details><summary>Answer</summary>

**A**. Seyfert 1943. *(HS24 summer: MC 12)*

</details>

**2.** A quasar varies in brightness on a timescale of 1 day. The emitting region is smaller than about

- A) 1 light-second
- B) 1 light-day
- C) 1 light-year
- D) 1 kpc

<details><summary>Answer</summary>

**B**. $R\lesssim c\Delta t$.

</details>

## 📖 Clusters of galaxies and the cosmic web (intuition)

A rich cluster: $\gtrsim100$ (up to thousands of) galaxies bound in a $\sim10^{15}M_\odot$ halo a few Mpc across. Mass budget: galaxies a few %, hot intracluster gas (ICM) ~15 %, dark matter ~80 %. Zwicky (1933) first found the "missing mass" from the virial theorem applied to the Coma cluster.

The ICM falls into the deep potential well and is shock-heated to the virial temperature, $k_BT\sim\mu m_p\sigma^2\approx10^8$ K for $\sigma\approx1000$ km/s: it shines in X-rays by bremsstrahlung. Scaling (HS25 winter Q5): $T\propto M/R\propto M^{2/3}$, $L_X\propto M^{4/3}$. It also scatters CMB photons to higher energy (Sunyaev–Zel'dovich effect). Gravitational lensing measures the total mass directly.

💡 **Intuition.** Three independent scales: galaxy velocities (virial), X-ray gas temperature (hydrostatic) and lensing (geometry) all give the same, dark-matter-dominated cluster mass. On larger scales galaxies form filaments, walls and voids (the cosmic web); only above $\sim100\,h^{-1}$ Mpc does the Universe look statistically homogeneous and isotropic (HS25 practice MC15).

### Check yourself

**1.** The typical temperature of the intracluster gas is

- A) $10^4$ K
- B) $100$ K
- C) $10^{12}$ K
- D) $10^8$ K

<details><summary>Answer</summary>

**D**. Virial temperature of a 10¹⁵ M☉ halo. *(HS25 practice: MC 14)*

</details>

**2.** A galaxy cluster typically contains

- A) 2 galaxies
- B) ≳100 galaxies
- C) 5-10 galaxies (that is a group)
- D) only galaxies above 10¹³ M☉

<details><summary>Answer</summary>

**B**. Up to ~1000. *(HS24 winter: MC 13)*

</details>

**3.** The matter distribution is statistically homogeneous and isotropic

- A) below $\sim10\,h^{-1}$ Mpc
- B) above $\sim100\,h^{-1}$ Mpc
- C) within 1 $h^{-1}$ Mpc of the Local Group
- D) only on the scale of the observable Universe

<details><summary>Answer</summary>

**B**. Cosmological principle on large scales. *(HS25 practice: MC 15)*

</details>

## ❓ Quiz: Quasar Beacon multiple choice

*Exam-style multiple choice (3 pt each in the real exam).*

**1.** Seyfert galaxies are

- A) spirals, bright nucleus, strong emission lines
- B) spirals, bright nucleus, no strong lines
- C) ellipticals with strong lines
- D) ellipticals without strong lines

<details><summary>Answer</summary>

**A**. Definition. *(HS24 summer: MC 12)*

</details>

**2.** $N(E)\propto E^{-2}$ gives a synchrotron spectrum

- A) $\nu^{-1/2}$
- B) $\nu^{-1}$
- C) $\nu^{-3/2}$
- D) $\nu^{-2}$

<details><summary>Answer</summary>

**A**. $(p-1)/2$. *(HS25 winter: MC 11)*

</details>

**3.** Synchrotron radiation comes from

- A) neutrino oscillations
- B) self-gravitating particles
- C) virialising dark matter
- D) electrons spiralling in magnetic fields

<details><summary>Answer</summary>

**D**. Relativistic electrons. *(HS24 summer: MC 11)*

</details>

**4.** ICM X-ray emission from bremsstrahlung (constant T)

- A) is concentrated in dense regions ($\rho^2$)
- B) is linear in density
- C) is concentrated in low-density regions ($\rho^{-2}$)
- D) depends only on T

<details><summary>Answer</summary>

**A**. Two-body process. *(HS24 winter: MC 12)*

</details>

**5.** A galaxy cluster is typically made of

- A) 2 galaxies
- B) ≳100 galaxies
- C) 5-10 galaxies
- D) only massive galaxies

<details><summary>Answer</summary>

**B**. ~10¹⁵ M☉ halo. *(HS24 winter: MC 13)*

</details>

**6.** ICM temperature

- A) 10⁴ K
- B) 100 K
- C) 10¹² K
- D) 10⁸ K

<details><summary>Answer</summary>

**D**. X-ray gas. *(HS25 practice: MC 14)*

</details>

**7.** Spiral disks vs ellipticals:

- A) redder, older
- B) redder, younger
- C) bluer, older
- D) bluer, younger

<details><summary>Answer</summary>

**D**. Star formation. *(HS25 practice: MC 9)*

</details>

**8.** Homogeneity and isotropy hold

- A) below 10 h⁻¹ Mpc
- B) above ~100 h⁻¹ Mpc
- C) within the Local Group
- D) only at the horizon scale

<details><summary>Answer</summary>

**B**. Cosmic web below that. *(HS25 practice: MC 15)*

</details>

## ✍️ Derivation: Synchrotron spectral index from the electron spectrum

*Choudhuri §8.11, eqs. (8.65)-(8.69)*

**Goal:** Electrons with $N(E)dE\propto E^{-p}dE$ each radiate power $\propto E^2$ at frequency $\nu=CE^2$. Show $f(\nu)\propto\nu^{-(p-1)/2}$.

**Given:** $\nu=CE^2$

1. Relate dE to dν.

   <details><summary>Reveal</summary>

   $E=\sqrt{\nu/C}$, $dE=\frac{d\nu}{2\sqrt{C\nu}}$.

   </details>

2. Power emitted in dν.

   <details><summary>Reveal</summary>

   $f(\nu)d\nu\propto E^2\cdot E^{-p}dE\propto\nu\cdot\nu^{-p/2}\cdot\nu^{-1/2}d\nu=\nu^{(1-p)/2}d\nu$.

   </details>

3. Result.

   <details><summary>Reveal</summary>

   $s=(p-1)/2$; e.g. $p=2.6\Rightarrow s=0.8$, $p=2\Rightarrow s=0.5$.

   </details>

**Full marks needs:** $\nu\propto E^2$ and Jacobian · power $\propto E^2$ · $s=(p-1)/2$

## ✍️ Derivation: Superluminal motion

*Choudhuri §9.4.2, eq. (9.21)*

**Goal:** A blob moves at speed $v$ at angle $\theta$ to the line of sight towards us. Derive the apparent transverse speed $v_\perp$ and its maximum over $\theta$.

**Given:** Distance to observer $D\gg v\delta t$

1. Arrival times of signals emitted at A (t = 0) and at B (t = δt).

   <details><summary>Reveal</summary>

   $t_A=D/c$, $t_B=\delta t+(D-v\delta t\cos\theta)/c$, so $\Delta t_{\rm obs}=\delta t(1-\beta\cos\theta)$, $\beta=v/c$.

   </details>

2. Apparent speed.

   <details><summary>Reveal</summary>

   Transverse displacement $v\delta t\sin\theta$: $v_\perp=\frac{v\sin\theta}{1-\beta\cos\theta}$.

   </details>

3. Maximise.

   <details><summary>Reveal</summary>

   $\frac{d}{d\theta}$: $\cos\theta(1-\beta\cos\theta)-\beta\sin^2\theta=0\Rightarrow\cos\theta=\beta$. Then $v_\perp=\frac{v\sqrt{1-\beta^2}}{1-\beta^2}=\gamma v$, which exceeds $c$ for $\beta>1/\sqrt2$.

   </details>

**Full marks needs:** light-travel-time difference · $v_\perp$ formula · maximum $\gamma v$ at $\cos\theta=\beta$

## ✍️ Derivation: Three differences between spirals and ellipticals (exam explain question)

*HS24 winter: open Q5 [6 pt]*

**Goal:** Briefly explain three differences in the properties of spiral and elliptical galaxies, describing how each property is exhibited in both types.

1. Write three on paper (2 pt each: name the property and state it for BOTH types). Then reveal a model list.

   <details><summary>Reveal</summary>

   Morphology (smooth ellipsoid vs disk with bulge, arms, bar); dynamics (random motions vs rotation of the disk); colour (red vs blue); stars (old, little star formation vs young, active star formation); gas (little cold gas vs much); environment (clusters vs field); clustering (stronger vs weaker); surface brightness ($r^{1/4}$ law vs exponential disk).

   </details>

2. Check that each of your answers says something about both types.

   <details><summary>Reveal</summary>

   "Ellipticals are red" alone is half an answer; "ellipticals are red because their stars are old, spirals are bluer because young massive stars are still forming in their gas-rich disks" is a full one.

   </details>

**Full marks needs:** three distinct properties · each stated for both types · brief physical reason

## 🔢 Calculation: Synchrotron in the Galactic magnetic field

Radio emission at $\nu=1$ GHz from electrons in a field $B=10^{-9}$ T (10 µG). Use $\nu\approx\gamma^2\nu_g$ with $\nu_g=eB/(2\pi m_e)$. Electrons have $N(E)\propto E^{-2.6}$.

1. Non-relativistic gyrofrequency $\nu_g$ in Hz. *[Hz]*

   <details><summary>Hint</summary>

   $28$ GHz per tesla: $28$ Hz here.

   </details>

2. Lorentz factor $\gamma=\sqrt{\nu/\nu_g}$. *[dimensionless]*

   <details><summary>Hint</summary>

   About 6000.

   </details>

3. Electron energy $\gamma m_ec^2$ in GeV. *[GeV]*

   <details><summary>Hint</summary>

   $m_ec^2=0.511$ MeV.

   </details>

4. Spectral index $s$ of the radio spectrum $f\propto\nu^{-s}$. *[dimensionless]*

   <details><summary>Hint</summary>

   $(2.6-1)/2$.

   </details>

## 🔢 Calculation: Superluminal jet

A jet blob moves at $\beta=v/c=0.99$. Use $v_\perp=v\sin\theta/(1-\beta\cos\theta)$.

1. Maximum apparent speed in units of $c$. *[c]*

   <details><summary>Hint</summary>

   $\gamma\beta=0.99/\sqrt{1-0.98}$.

   </details>

2. Angle (degrees) at which it is reached. *[deg]*

   <details><summary>Hint</summary>

   $\cos\theta=\beta$: about 8°.

   </details>

3. Apparent speed at $\theta=20^\circ$ in units of $c$. *[c]*

   <details><summary>Hint</summary>

   Still superluminal: about $5c$.

   </details>

## 🔢 Calculation: Weighing a cluster and its gas

A cluster has line-of-sight velocity dispersion $\sigma=1000$ km/s and radius $R=1$ Mpc. Use $\langle v^2\rangle=3\sigma^2=GM/(2R)$ and $k_BT\approx\mu m_p\sigma^2$ with $\mu=0.6$.

1. Virial mass in $10^{15}M_\odot$. *[10^15 M_sun]*

   <details><summary>Hint</summary>

   $M=6\sigma^2R/G$.

   </details>

2. Gas temperature in $10^7$ K. *[10^7 K]*

   <details><summary>Hint</summary>

   About $7\times10^7$ K: X-ray hot.

   </details>

3. $k_BT$ in keV. *[keV]*

   <details><summary>Hint</summary>

   $1$ keV $=1.602\times10^{-16}$ J. About 6 keV: bremsstrahlung cut-off in the X-ray band.

   </details>

## 👹 Boss: quasar variability and black-hole mass (exam problem)

*HS24 winter: Open Question 6 [8 pt], 15 min.*

Quasars are often observed to exhibit variability with typical timescales on the order of a few days.

(a) [4 pt] Assuming variability of a quasar is observed on a characteristic timescale of 3 days, obtain an approximate limit on the length scale of the region responsible for this emission. How does this length scale compare to the typical size of a galaxy like the Milky Way?

(b) [4 pt] From the result of question (a), derive an approximate upper limit for the mass of the supermassive black hole which powers the AGN. Express your answer in solar masses. Hint: relate $D$ (the solution to part (a)) to the Schwarzschild radius.

<details><summary>Key points of a full-marks solution</summary>

- (a) Causality: $D\lesssim c\Delta t=3\times10^5$ km/s $\times3\times86400$ s $=7.8\times10^{10}$ km $=2.5\times10^{-3}$ pc, about $10^{-7}$ of a 10 kpc galaxy.
- (b) $r_s=2GM/c^2\lesssim D\Rightarrow M\lesssim Dc^2/2G=5.3\times10^{40}$ kg $=2.6\times10^{10}M_\odot$.

</details>
