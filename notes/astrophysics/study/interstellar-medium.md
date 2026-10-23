# The Nebula Garden

*Astro Observatory Ship. Topics: extinction and reddening, star counts, ISM phases, 21 cm line, HII regions and Strömgren radius, molecular clouds, Jeans instability, magnetic fields and cosmic rays.*

Between the stars is not empty space but a thin, layered medium: cold molecular clouds where stars are born, warm atomic hydrogen glowing at 21 cm, bubbles of ionised gas around hot stars, and dust that reddens everything behind it. Every exam asks about at least one of these phases.

**Sources:** Choudhuri_Textbook.pdf (Choudhuri Ch. 6.1 (star counts, extinction), 6.5-6.6 (ISM phases, 21 cm, HII regions, molecular clouds), 6.7 (magnetic field, cosmic rays), 6.8, 8.3 (Jeans instability, eqs. 8.20-8.23), 8.5 (flux freezing)); Astro_I_2024_Winter_Session_with_Solutions.pdf (HS24 winter: open Q3 (star counts), MC 8); Astro_I_2025_Practice_Exam_with_Solutions.pdf (HS25 practice: open Q4 (Strömgren radius), MC 10, 13); Astro_I_2024_Summer_Session_with_Solutions.pdf (HS24 summer: open Q4 (extinction), MC 8, 10); Astro_I_2025_Winter_Session_with_Solutions.pdf (HS25 winter: MC 7)

## 📖 Dust: extinction and reddening

Dust grains (~0.1 µm, about 1 % of the ISM mass) absorb and scatter starlight. In magnitudes the dimming is the extinction $A_\lambda=m_{\rm obs}-m_{\rm intrinsic}=1.086\,\tau_\lambda$ (since $2.5\log_{10}e=1.086$). It enters the distance modulus: $m-M=5\log_{10}(d/10\,\mathrm{pc})+A_\lambda$.

$$A_\lambda=2.5\log_{10}\frac{F_0}{F_{\rm ext}}=1.086\,\tau_\lambda,\qquad E(B-V)=A_B-A_V,\quad A_V\approx3.1\,E(B-V)$$  
*Extinction and colour excess (reddening).*

💡 **Intuition.** Grains are comparable in size to optical wavelengths, so they block blue light more than red ($A_\lambda\propto\lambda^{-1}$ roughly): stars behind dust look redder, just like the setting Sun. Infrared and radio pass almost freely, which is why the Galactic centre ($A_V\approx30$ mag, a factor $10^{12}$!) is studied in IR and radio.

The amount of dust follows the gas: $A_V\propto N_H=\int n_H\,ds$, the hydrogen column. Looking out of the thin disk at Galactic latitude $b$ the column through a uniform slab grows as $1/\sin b$; towards the bulge the HS24 summer exam uses a Gaussian density profile and the cosine rule (boss of the Dynamics Bay).

⚠️ **Pitfall.** Extinction always <b>adds</b> magnitudes (fainter). If you forget it you overestimate distances: an unrecognised $A=1$ mag makes you put a star $10^{0.2}=1.6$ times too far away.

### Check yourself

**1.** An extinction $A_V=2.5$ mag means the flux is reduced by a factor of

- A) 2.5
- B) 10
- C) 100
- D) $e^{2.5}$

<details><summary>Answer</summary>

**B**. $10^{2.5/2.5}=10$.

</details>

**2.** Dust makes background stars look

- A) bluer
- B) redder
- C) brighter in V
- D) unchanged in colour

<details><summary>Answer</summary>

**B**. Blue light is scattered more.

</details>

## 📖 Counting stars: the $F^{-3/2}$ law

If stars of luminosity $L$ are spread uniformly with density $n(L)$, those brighter than flux $F_0$ are the ones closer than $r_0=\sqrt{L/4\pi F_0}$:

$$N(F>F_0)=n(L)\,\frac43\pi r_0^3=n(L)\,\frac43\pi\left(\frac{L}{4\pi F_0}\right)^{3/2}\propto F_0^{-3/2}$$  
*Euclidean number counts. Summing over a luminosity function keeps the same power.*

$$\log_{10}N(<m)=0.6\,m+\mathrm{const}$$  
*Same law in magnitudes: each magnitude fainter, 10^0.6 ≈ 4 times more stars.*

💡 **Intuition.** Volume grows as $r^3$, flux falls as $r^{-2}$: so counts grow as $F^{-3/2}$ whatever the luminosities. Herschel and Kapteyn used departures from this law to map the Galaxy: if counts grow more slowly than $F^{-3/2}$ you are either seeing the edge of the stellar system or extinction is hiding the distant stars (Kapteyn's universe was too small and Sun-centred for exactly this reason).

📝 **How the exam asks it.** HS24 winter Q3 (12 pt): (a) derive $N\propto F_0^{-3/2}$; (b) argue it holds for a luminosity distribution; (c) explain a deviation (edge of the Galaxy, extinction, instrumental effects). Boss of this room.

### Check yourself

**1.** In a uniform, transparent, Euclidean distribution of stars, lowering the flux limit by a factor of 4 multiplies the number of stars seen by

- A) 4
- B) 8
- C) 16
- D) 2

<details><summary>Answer</summary>

**B**. $4^{3/2}=8$.

</details>

## 📖 The phases of the interstellar medium (intuition)

The ISM is roughly in pressure balance, $nT\sim10^{9}$–$10^{10}$ K m$^{-3}$, so hotter phases are thinner:

🖼️ **Picture it.** Table of phases (approximate): <b>molecular clouds</b> (H$_2$, traced by CO lines), $T\approx10$–20 K, $n\gtrsim10^{9}$ m$^{-3}$, birthplace of stars. <b>Cold neutral medium / HI clouds</b>, $T\approx80$ K, $n\sim10^{7}$ m$^{-3}$, seen in 21 cm absorption and emission. <b>Warm neutral/ionised medium</b>, $T\approx8000$ K, $n\sim10^{5}$ m$^{-3}$. <b>HII regions</b> around O/B stars, $T\approx10^4$ K, photo-ionised, glowing in H$\alpha$ (recombination lines). <b>Hot coronal gas</b> from supernovae, $T\approx10^6$ K, $n\sim10^{3}$ m$^{-3}$, seen in X-rays and O VI absorption.

💡 **Intuition.** Spectroscopic notation: HI = neutral hydrogen, HII = ionised hydrogen (the Roman numeral is ionisation stage + 1). An HII region is ionised and ~100 times hotter than an HI cloud (HS25 practice MC10). Stars form in the <b>cold dense</b> molecular clouds because there the Jeans mass is smallest (low $T$, high $\rho$).

<b>21 cm line:</b> the electron and proton spins in ground-state hydrogen are either parallel (slightly higher energy) or antiparallel. The spin flip emits $\Delta E=5.9\times10^{-6}$ eV, $\nu=1420.4$ MHz, $\lambda=21.1$ cm. Each atom flips only once per ~11 Myr, but there are so many HI atoms along any line of sight that the line is bright, and radio waves pass through dust. Doppler shifts of the 21 cm line map the rotation of the whole Galaxy, including the far side.

⚠️ **Pitfall.** The 21 cm line is the hyperfine transition of <b>neutral</b> hydrogen, not recombination in HII regions, not CO rotation, not synchrotron (HS25 winter MC7).

### Check yourself

**1.** The 21 cm line originates from

- A) recombination in ionised hydrogen
- B) rotational transitions of CO
- C) the hyperfine splitting of the ground state of neutral hydrogen
- D) synchrotron radiation

<details><summary>Answer</summary>

**C**. Spin flip of electron relative to proton. *(HS25 winter: MC 7)*

</details>

**2.** Compared with an HI cloud, an HII region is

- A) ionised and ~100 times hotter
- B) neutral and ~100 times hotter
- C) ionised and ~100 times cooler
- D) of similar temperature but ionised

<details><summary>Answer</summary>

**A**. ~80 K vs ≳6000 K. *(HS25 practice: MC 10)*

</details>

**3.** Molecular clouds are the birthplace of stars because they are

- A) hot enough for fusion
- B) hot enough for fission
- C) dense and cold
- D) the only ionised regions

<details><summary>Answer</summary>

**C**. Low Jeans mass. *(HS24 summer: MC 8)*

</details>

## 📖 HII regions: the Strömgren sphere

A hot O/B star emits $N_\gamma$ ionising photons ($h\nu>13.6$ eV) per second. Around it the gas is kept ionised; inside, every recombination is balanced by a photo-ionisation. With recombination coefficient $\alpha$ (recombinations per unit volume per time $=\alpha n_pn_e$), steady state in a sphere of radius $R_s$ gives

$$\frac43\pi R_s^3\,\alpha n_pn_e=N_\gamma\quad\Rightarrow\quad R_s=\left(\frac{3N_\gamma}{4\pi\alpha n_pn_e}\right)^{1/3}$$  
*Strömgren radius (HS25 practice Q4).*

💡 **Intuition.** The edge is sharp: inside, the gas is almost fully ionised and transparent to UV; at $R_s$ the photons are used up within one mean free path of neutral hydrogen (tiny, because the photo-ionisation cross-section is huge). Denser gas recombines faster, so $R_s\propto n^{-2/3}$: an O star in a dense cloud carves a small bubble, in thin gas a huge one.

⚠️ **Pitfall.** $n_pn_e=n^2$ for pure hydrogen; do not forget the square. The recombination coefficient $\alpha$ here is a rate coefficient [m$^3$ s$^{-1}$], unrelated to the absorption coefficient of radiative transfer.

### Check yourself

**1.** If the gas density around an O star doubles, the Strömgren radius

- A) doubles
- B) halves
- C) decreases by $2^{2/3}$
- D) is unchanged

<details><summary>Answer</summary>

**C**. $R_s\propto n^{-2/3}$.

</details>

## 📖 Jeans instability: when gravity beats pressure

Perturb a uniform, static gas of density $\rho_0$ and sound speed $c_s$ by a small density wave $\propto e^{i(kx-\omega t)}$. Linearising continuity, Euler and Poisson equations gives the dispersion relation

$$\omega^2=c_s^2\left(k^2-k_J^2\right),\qquad k_J^2=\frac{4\pi G\rho_0}{c_s^2}$$  
*Choudhuri (8.20)-(8.21).*

For $k>k_J$ (short waves): $\omega$ real, the perturbation <b>oscillates</b> as a sound wave: pressure wins. For $k<k_J$ (long waves): $\omega=\pm i\alpha$, one mode grows as $e^{\alpha t}$: gravitational collapse. The critical mass is a sphere of diameter $\lambda_J=2\pi/k_J$:

$$M_J=\frac43\pi\lambda_J^3\rho_0=\frac43\pi^{5/2}\left(\frac{k_BT}{Gm}\right)^{3/2}\frac{1}{\rho_0^{1/2}}\quad(\text{isothermal }c_s^2=k_BT/m)$$  
*(8.23). Collapse if M > M_J.*

💡 **Intuition.** Compare two times: the sound crossing time $\lambda/c_s$ (how fast pressure can react) and the free-fall time $1/\sqrt{G\rho}$ (how fast gravity pulls). Big clouds cannot communicate pressure fast enough and collapse. Cold (small $c_s$) and dense regions have small Jeans masses: that is why stars form in molecular cloud cores. As a cloud collapses isothermally $\rho$ rises, $M_J$ drops and the cloud fragments into smaller pieces: clusters of stars, not single giants.

⚠️ **Pitfall.** Directions: stability (pressure wins, oscillation) is $|k|>k_J$, i.e. $\lambda<\lambda_J$, and $M<M_J$ (HS25 practice MC13). Growth/collapse is $\lambda>\lambda_J$. In an expanding universe the growth becomes a power law in $t$ instead of exponential (structure formation, Ch. 11).

### Check yourself

**1.** In the Jeans analysis (non-expanding fluid) a mode with $\lambda<\lambda_J$

- A) grows or decays exponentially
- B) grows or decays logarithmically
- C) oscillates
- D) remains constant

<details><summary>Answer</summary>

**C**. Pressure wins: sound wave. *(HS24 summer: MC 10)*

</details>

**2.** Pressure dominates over gravity, preventing collapse, on scales where

- A) $|k|<k_J$ and $M<M_J$
- B) $|k|>k_J$ and $M<M_J$
- C) $|k|<k_J$ and $M>M_J$
- D) $|k|\simeq k_J$ and $M\simeq M_J$

<details><summary>Answer</summary>

**B**. $M_J\propto\lambda_J^3\propto k_J^{-3}$. *(HS25 practice: MC 13)*

</details>

## 📖 Magnetic fields and cosmic rays (flux freezing) (intuition)

$$\frac{\partial\mathbf B}{\partial t}=\nabla\times(\mathbf v\times\mathbf B)+\eta\nabla^2\mathbf B,\qquad R_M\approx\frac{VL}{\eta}$$  
*Induction equation and magnetic Reynolds number.*

💡 **Intuition.** Because astrophysical $L$ is enormous, $R_M\gg1$ and diffusion is negligible: the field lines are <b>frozen into</b> the plasma and move with it (Alfvén). A collapsing cloud drags its field along and amplifies it ($B\propto R^{-2}$); this is how neutron stars get $10^8$ T fields. The Galactic field is only a few $\times10^{-10}$ T (a few µG), yet cosmic rays (relativistic protons and electrons, accelerated in supernova shocks) spiral along it, emitting synchrotron radiation (radio).

### Check yourself

**1.** Flux freezing in astrophysical plasmas holds because

- A) the conductivity is zero
- B) the magnetic Reynolds number is huge (large length scales)
- C) magnetic fields are weak
- D) the plasma is neutral

<details><summary>Answer</summary>

**B**. $R_M\propto L$.

</details>

## ❓ Quiz: Nebula Garden multiple choice

*Exam-style multiple choice (3 pt each in the real exam).*

**1.** The 21 cm line is due to

- A) recombination in HII
- B) CO rotation
- C) hyperfine splitting of neutral H ground state
- D) synchrotron

<details><summary>Answer</summary>

**C**. Spin flip. *(HS25 winter: MC 7)*

</details>

**2.** Molecular clouds in the ISM are

- A) regions of ionised hydrogen
- B) hot diffuse star-forming regions
- C) cool dense star-forming regions
- D) regions where stars cannot form

<details><summary>Answer</summary>

**C**. Cold, dense, molecular. *(HS24 winter: MC 8)*

</details>

**3.** Molecular clouds are birthplaces of stars because they are

- A) dense and cold
- B) hot enough for fusion
- C) hot enough for fission
- D) the only ionised regions

<details><summary>Answer</summary>

**A**. Small Jeans mass. *(HS24 summer: MC 8)*

</details>

**4.** An HII region, compared with an HI cloud, is

- A) ionised, ~100× hotter
- B) neutral, ~100× hotter
- C) ionised, ~100× cooler
- D) same T, ionised

<details><summary>Answer</summary>

**A**. 80 K vs ~10⁴ K. *(HS25 practice: MC 10)*

</details>

**5.** A Jeans-analysis mode with $\lambda<\lambda_J$

- A) grows/decays exponentially
- B) grows/decays logarithmically
- C) oscillates
- D) stays constant

<details><summary>Answer</summary>

**C**. Sound wave. *(HS24 summer: MC 10)*

</details>

**6.** Pressure prevents collapse where

- A) $|k|<k_J$, $M<M_J$
- B) $|k|>k_J$, $M<M_J$
- C) $|k|<k_J$, $M>M_J$
- D) $|k|\simeq k_J$

<details><summary>Answer</summary>

**B**. Small scales. *(HS25 practice: MC 13)*

</details>

**7.** Star counts growing more slowly than $F_0^{-3/2}$ towards faint fluxes indicate

- A) a uniform infinite distribution
- B) the edge of the stellar distribution or extinction
- C) that all stars have the same luminosity
- D) that the Sun is at the centre of the Galaxy

<details><summary>Answer</summary>

**B**. Non-uniform density or absorption. *(HS24 winter: open Q3c)*

</details>

## ✍️ Derivation: Strömgren radius from photon balance

*HS25 practice: open Q4 [6 pt]*

**Goal:** Derive $R_s=\left(\frac{3N_\gamma}{4\pi\alpha n_pn_e}\right)^{1/3}$ for a spherical steady-state HII region.

**Given:** $\alpha n_pn_e$ = recombinations per unit volume per unit time; $N_\gamma$ = ionising photons per second

1. Recombinations per unit time in the whole sphere.

   <details><summary>Reveal</summary>

   $\frac43\pi R_s^3\,\alpha n_pn_e$.

   </details>

2. Ionisations per unit time.

   <details><summary>Reveal</summary>

   Every ionising photon is eventually absorbed inside the region: $N_\gamma$.

   </details>

3. Steady state.

   <details><summary>Reveal</summary>

   Equate and solve: $R_s=\left(\frac{3N_\gamma}{4\pi\alpha n_pn_e}\right)^{1/3}$.

   </details>

**Full marks needs:** volume times recombination rate density · steady state: ionisations = recombinations · solve for $R_s$

## ✍️ Derivation: Jeans dispersion relation

*Choudhuri §8.3, eqs. (8.16)-(8.21)*

**Goal:** Linearise $\partial_t\rho+\nabla\cdot(\rho\mathbf v)=0$, $\partial_t\mathbf v+(\mathbf v\cdot\nabla)\mathbf v=-\nabla P/\rho-\nabla\Phi$, $\nabla^2\Phi=4\pi G\rho$ about a static uniform background and derive $\omega^2=c_s^2k^2-4\pi G\rho_0$.

**Given:** $P=P(\rho)$ with $dP/d\rho=c_s^2$; Jeans swindle: ignore the background potential

1. Write the first-order equations.

   <details><summary>Reveal</summary>

   $\partial_t\rho_1+\rho_0\nabla\cdot\mathbf v_1=0$, $\partial_t\mathbf v_1=-\frac{c_s^2}{\rho_0}\nabla\rho_1-\nabla\Phi_1$, $\nabla^2\Phi_1=4\pi G\rho_1$.

   </details>

2. Eliminate v and Φ.

   <details><summary>Reveal</summary>

   Take $\partial_t$ of continuity and the divergence of Euler: $\partial_t^2\rho_1=c_s^2\nabla^2\rho_1+4\pi G\rho_0\rho_1$.

   </details>

3. Insert a plane wave.

   <details><summary>Reveal</summary>

   $\rho_1\propto e^{i(kx-\omega t)}$: $-\omega^2=-c_s^2k^2+4\pi G\rho_0$, so $\omega^2=c_s^2(k^2-k_J^2)$ with $k_J^2=4\pi G\rho_0/c_s^2$.

   </details>

4. Interpret.

   <details><summary>Reveal</summary>

   $k>k_J$: sound waves. $k<k_J$: $\omega$ imaginary, exponential growth with rate $\alpha=c_s\sqrt{k_J^2-k^2}\to\sqrt{4\pi G\rho_0}$ for long waves (free-fall rate).

   </details>

**Full marks needs:** linearised equations · wave equation with gravity source term · dispersion relation · stability criterion

## 🔢 Calculation: Strömgren sphere around an O star

An O star emits $N_\gamma=10^{49}$ ionising photons per second into hydrogen of density $n=10^7$ m$^{-3}$ (10 cm$^{-3}$). Recombination coefficient $\alpha=2.6\times10^{-19}$ m$^3$ s$^{-1}$.

1. Strömgren radius in pc. *[pc]*

   <details><summary>Hint</summary>

   $n_pn_e=n^2=10^{14}$ m$^{-6}$.

   </details>

2. Recombination time $1/(\alpha n)$ in years. *[yr]*

   <details><summary>Hint</summary>

   $\approx1.2\times10^4$ yr: short compared with the O star's few-Myr life, so the steady state is reached.

   </details>

3. Strömgren radius if the density were $10^9$ m$^{-3}$ (a dense cloud), in pc. *[pc]*

   <details><summary>Hint</summary>

   $R_s\propto n^{-2/3}$: 100 times denser, $100^{2/3}=21.5$ times smaller.

   </details>

## 🔢 Calculation: Jeans masses of the ISM

$M_J=\frac43\pi^{5/2}\left(\frac{k_BT}{Gm}\right)^{3/2}\rho_0^{-1/2}$ (Choudhuri (8.23)). (a) Diffuse HI: $n=10^6$ m$^{-3}$ of H atoms ($m=m_p$), $T=100$ K. (b) Molecular cloud core: $n=10^{10}$ m$^{-3}$ of particles with $m=2.33\,m_p$ (H$_2$ + He), $T=10$ K.

1. (a) Jeans mass in kg (enter e.g. 8e35). *[kg]*

   <details><summary>Hint</summary>

   Choudhuri's example: $\approx8\times10^{35}$ kg, i.e. $4\times10^5M_\odot$: a whole cluster.

   </details>

2. (a) in solar masses. *[M_sun]*

   <details><summary>Hint</summary>

   Divide by $1.99\times10^{30}$ kg.

   </details>

3. (b) Jeans mass of the cold core in solar masses. *[M_sun]*

   <details><summary>Hint</summary>

   $T$ 10× lower and $\rho$ $2.3\times10^4$× higher: $M_J$ drops by a factor $\sim2\times10^4$ to about $20M_\odot$; as the core keeps collapsing $\rho$ rises further and it fragments into star-sized pieces.

   </details>

## 🔢 Quick fight: Quick fight: star counts

A survey reaches 3 magnitudes deeper than an older one. In a uniform transparent distribution, by what factor does the number of stars grow? Within 25 %.

1. Factor. *[dimensionless]*

   <details><summary>Hint</summary>

   3 mag = flux factor $10^{1.2}$; counts $\propto F^{-3/2}$: $10^{1.8}\approx63$.

   </details>

## 🔢 Calculation: The 21 cm line

The hydrogen hyperfine transition has $\nu=1420.406$ MHz. $h=6.626\times10^{-34}$ J s, $1$ eV $=1.602\times10^{-19}$ J.

1. Wavelength in cm. *[cm]*

   <details><summary>Hint</summary>

   $c/\nu$.

   </details>

2. Photon energy in µeV. *[µeV]*

   <details><summary>Hint</summary>

   $\approx5.9$ µeV.

   </details>

3. Equivalent temperature $h\nu/k_B$ in K. *[K]*

   <details><summary>Hint</summary>

   0.068 K: even 10 K gas has both levels populated in the statistical-weight ratio 3:1.

   </details>

## 👹 Boss: star counts (exam problem)

*HS24 winter: Open Question 3 [12 pt], 20 min.*

Suppose that, in our region of the galaxy, the number density $n(L)$ of stars with a particular luminosity $L$ is independent of position.

(a) [6 pt] Show that the number of stars with luminosity $L$ observed to have a flux greater than some flux $F_0$ obeys $N(F>F_0)\propto F_0^{-3/2}$. Hint: $N(F>F_0)$ is proportional to the volume of the sphere centred on us, with a radius at which the flux from a star with luminosity $L$ is $F_0$.

(b) [4 pt] Explain why the same behaviour will occur if the stars have a distribution of luminosities.

(c) [2 pt] If we observed that $N(F>F_0)$ does not grow with decreasing $F_0$ according to the relation in (a), what could be the reason?

<details><summary>Key points of a full-marks solution</summary>

- (a) $F=L/4\pi r^2\Rightarrow r_0=(L/4\pi F_0)^{1/2}$; $N=n(L)\frac43\pi r_0^3=n(L)\frac43\pi(L/4\pi F_0)^{3/2}\propto F_0^{-3/2}$.
- (b) $N=\int dL\,\frac{dn}{dL}\frac43\pi(L/4\pi F_0)^{3/2}\propto F_0^{-3/2}\int dL\frac{dn}{dL}L^{3/2}$: the $F_0$ dependence factors out of the integral.
- (c) $n(L)$ not independent of position (we reach the edge of the Galaxy/disk), extinction by dust, or observational/instrumental incompleteness.

</details>
