# The Light Deck

*Astro Observatory Ship. Topics: magnitudes, angular size, Wien law, main-sequence scaling, blackbody, Rayleigh-Jeans, CMB.*

The Light Deck is where every number on the ship starts: how bright is a star, how far away, how hot, and what colour. Every Refregier exam opens with magnitudes and blackbody radiation, so these doors must be fast and automatic. Constants come from the exam table: use SI.

**Sources:** Astro_I_2025_Winter_Session_with_Solutions.pdf (Open Q1 (magnitudes, eye resolution), Q2 (CMB vs dust), Q3 (10 Msun star), MC 1-4); Astro_I_2024_Summer_Session_with_Solutions.pdf (Open Q1 (SN Ia in Andromeda), Q2 (CMB, Rayleigh-Jeans, bolometer, dT)); Choudhuri_Textbook.pdf (Ch. 1.3-1.4 (magnitudes, parallax), Ch. 2.2-2.3 (radiative transfer, blackbody), Ch. 3.5 (main sequence)); 01-light-and-radiation.md (transcription, formulas and checks); Astro_I_2024_Winter_Session_with_Solutions.pdf (HS24 winter: MC 1-2); Astro_I_2025_Practice_Exam_with_Solutions.pdf (HS25 practice: MC 1, 5; open Q1)

## 📖 Scales of the sky: AU, parsec, parallax (intuition)

Astronomy measures almost nothing directly except <b>angles</b> and <b>fluxes</b>. Distances, sizes, masses and luminosities are all inferred. The first skill is to move between angles and lengths with the small-angle approximation $\theta\simeq D/d$ (radians).

$$1\,\mathrm{AU}=1.496\times10^{11}\,\mathrm m,\qquad 1\,\mathrm{pc}=\frac{1\,\mathrm{AU}}{1''}=206\,265\,\mathrm{AU}=3.086\times10^{16}\,\mathrm m\approx3.26\,\mathrm{ly}$$  
*The parsec is the distance at which 1 AU subtends 1 arcsecond.*

$$d\,[\mathrm{pc}]=\frac{1}{p\,['']}$$  
*Parallax: p is half the yearly back-and-forth shift of a nearby star against the distant background.*

💡 **Intuition.** Ladder of sizes to keep in your head: Sun $7\times10^8$ m; Earth–Sun 1 AU; nearest star (Proxima) 1.3 pc; Sun–Galactic centre 8 kpc; Milky Way disk radius ~15 kpc; Andromeda 0.77 Mpc; a rich cluster ~2 Mpc across; observable Universe ~$10^4$ Mpc. Each step is roughly a factor of $10^3$–$10^5$.

Angles you will need: $1^\circ=\pi/180$ rad, $1'=1^\circ/60$, $1''=1'/60=4.85\times10^{-6}$ rad. A telescope of diameter $D$ resolves at best $\theta\simeq1.22\lambda/D$ (Rayleigh criterion, diffraction limit); the eye resolves about $1'$.

⚠️ **Pitfall.** Parallax halves when distance doubles: $p\propto1/d$ (HS24 summer MC1: four times further means $p/4$, not $p/16$). And for "how far away is a star at $l=180^\circ$" draw the picture: longitude $180^\circ$ points away from the Galactic centre, so distances add.

📝 **How the exam asks it.** MC: parallax to distance, Galactic geometry. Open: "how far away would the Sun no longer be resolved" (HS25 winter Q1), "is the Moon resolved by a 6 m CMB telescope at 150 GHz" (HS25 practice Q1).

### Check yourself

**1.** Barnard's Star has a parallax of 547 milliarcseconds. Its distance is about

- A) 1.8 pc
- B) 18 pc
- C) 180 pc
- D) 0.55 pc

<details><summary>Answer</summary>

**A**. $d=1/p=1/0.547''\approx1.8$ pc. *(HS25 winter: MC 2)*

</details>

**2.** A telescope with a 6 m mirror observes at $\lambda=2$ mm. Its resolution is about

- A) 1.4 arcsec
- B) 1.4 arcmin
- C) 1.4 degree
- D) 0.5 degree

<details><summary>Answer</summary>

**B**. $1.22\lambda/D=4.1\times10^{-4}$ rad $=1.4'$. The Moon ($30'$) is resolved. *(HS25 practice: open Q1)*

</details>

## 📖 Magnitudes: a backwards logarithmic scale

The eye responds roughly logarithmically, so Hipparchus' brightness classes became a logarithmic scale. Five magnitudes are <b>exactly</b> a factor 100 in flux; a <b>larger</b> magnitude means <b>fainter</b>.

$$m_1-m_2=-2.5\log_{10}\frac{F_1}{F_2}\qquad\Longleftrightarrow\qquad\frac{F_1}{F_2}=10^{-0.4(m_1-m_2)}$$  
*Apparent magnitude compares fluxes. 1 mag = factor 2.512.*

The <b>absolute magnitude</b> $M$ is the apparent magnitude the object would have at 10 pc. Since $F\propto L/d^2$, comparing the same object at $d$ and at 10 pc gives the distance modulus. Interstellar dust adds an extinction $A_\lambda>0$ (in magnitudes).

$$m-M=5\log_{10}\frac{d}{10\,\mathrm{pc}}+A_\lambda$$  
*Distance modulus with extinction.*

A <b>colour index</b> is a difference of magnitudes in two filters, e.g. $B-V=m_B-m_V$. Small (or negative) $B-V$ means relatively more flux in the bluer $B$ band, i.e. a hotter star. The colour does not depend on distance (both bands dim equally), so it measures temperature, not brightness.

💡 **Intuition.** Memorise anchors: $\Delta m=5\Rightarrow100\times$, $\Delta m=2.5\Rightarrow10\times$, $\Delta m=1\Rightarrow2.5\times$, $\Delta m=4\Rightarrow40\times$. The Sun is $m=-26.8$, the faintest naked-eye stars $m\approx6$–$7$. The Sun's absolute magnitude is $M\approx4.8$: a very ordinary star.

⚠️ **Pitfall.** Two traps: (1) the sign: brighter = smaller $m$; (2) flux goes as $d^{-2}$, so distance enters with $5\log_{10}$, not $2.5\log_{10}$. Extinction makes $m$ larger (fainter): $m=M+5\log_{10}(d/10\,\mathrm{pc})+A$.

📝 **How the exam asks it.** Every exam: flux ratio from $\Delta m$ (MC), distance from $m$ and $M$ (MC), SN Ia apparent magnitude (HS24 summer Q1), limiting distance for the naked eye (HS25 winter Q1b).

### Check yourself

**1.** Two stars have $m_1=9$ and $m_2=13$. $F_1/F_2\approx$

- A) 5
- B) 15
- C) 20
- D) 40

<details><summary>Answer</summary>

**D**. $10^{0.4\cdot4}=10^{1.6}=39.8$. *(HS25 winter: MC 1)*

</details>

**2.** $M=1.0$, $d=100$ pc, extinction $A=0.2$. Apparent magnitude?

- A) 5.2
- B) 6.2
- C) 6.7
- D) 7.2

<details><summary>Answer</summary>

**B**. $m=1+5\log_{10}(10)+0.2=6.2$. *(HS25 practice: MC 1)*

</details>

**3.** Star S1 has $B-V=0.5$, star S2 has $B-V=1.0$. Which must be true?

- A) S1 emits relatively more short-wavelength light than S2
- B) S2 emits relatively more short-wavelength light
- C) S1 is brighter than S2
- D) S2 is more distant

<details><summary>Answer</summary>

**A**. Smaller $B-V$: relatively brighter in $B$ (blue). Colour says nothing about distance or total brightness. *(HS24 winter: MC 2)*

</details>

## 📖 Blackbody radiation: Planck, Wien, Stefan–Boltzmann

A blackbody is matter in thermal equilibrium with its radiation: it absorbs everything and emits a spectrum fixed by $T$ alone. Its specific intensity is the Planck function (Choudhuri (2.6)).

$$B_\nu(T)=\frac{2h\nu^3}{c^2}\,\frac{1}{e^{h\nu/k_BT}-1}\qquad[\mathrm{W\,m^{-2}\,Hz^{-1}\,sr^{-1}}]$$

Three limits/integrals you must be able to state and use:

$$\text{Rayleigh–Jeans }(h\nu\ll k_BT):\ B_\nu\simeq\frac{2k_BT\nu^2}{c^2}\qquad\text{Wien }(h\nu\gg k_BT):\ B_\nu\simeq\frac{2h\nu^3}{c^2}e^{-h\nu/k_BT}$$

$$\lambda_{\max}T=b=2.898\times10^{-3}\,\mathrm{m\,K},\qquad u=a_BT^4,\qquad F=\sigma_{SB}T^4,\qquad L=4\pi R^2\sigma_{SB}T_{\rm eff}^4$$  
*Wien displacement, energy density, emergent flux, luminosity. The last one defines the effective temperature of a star.*

💡 **Intuition.** Increase $T$ and the whole curve moves <b>up and to the right</b>: $\partial B_\nu/\partial T>0$ at every $\nu$ (HS25 winter Q2a), so blackbody curves of different temperature never cross. Hotter stars are brighter at every wavelength and bluer. The RJ tail is linear in $T$: that is why radio astronomers quote brightness as a temperature.

🖼️ **Picture it.** Plot $\log B_\nu$ against $\log\nu$: a rising straight line of slope 2 (RJ), a peak at $h\nu\approx2.8k_BT$, then an exponential cliff (Wien). The CMB (2.73 K) peaks near 160 GHz (mm waves), the Sun (5770 K) near 500 nm in $\lambda$.

⚠️ **Pitfall.** $\lambda_{\max}$ from $B_\lambda$ and $\nu_{\max}$ from $B_\nu$ are <b>not</b> related by $\lambda=c/\nu$: the two distributions have different peaks because $d\nu\neq d\lambda$. Use $\lambda_{\max}T=2.898$ mm K only for wavelength peaks. And RJ requires $\nu\ll k_BT/h$ (57 GHz for the CMB), so at 100 GHz you must use the full Planck formula.

📝 **How the exam asks it.** MC: $u\propto T^4$, colour vs temperature. Open: derive RJ by expanding $e^x\approx1+x$ (HS24 summer Q2a), CMB power on a bolometer, temperature fluctuation from $\partial B/\partial T$, dust vs CMB (HS25 winter Q2), Wien peak of a 10 $M_\odot$ star (Q3).

### Check yourself

**1.** The total energy density of blackbody radiation scales as

- A) $T$
- B) $T^2$
- C) $T^{-1}$
- D) $T^4$

<details><summary>Answer</summary>

**D**. $U=\int U_\nu d\nu=a_BT^4$ with $a_B=8\pi^5k_B^4/(15c^3h^3)$. *(HS25 winter: MC 4)*

</details>

**2.** Hotter stars appear bluer because

- A) their spectrum peaks at higher $\nu_{\max}$
- B) their spectrum peaks at lower $\nu_{\max}$
- C) they are closer
- D) they have more metals

<details><summary>Answer</summary>

**A**. Wien: $\nu_{\max}\propto T$. *(HS24 summer: MC 6)*

</details>

**3.** In the Rayleigh–Jeans regime, doubling $T$ multiplies $B_\nu$ by

- A) 2
- B) 4
- C) 16
- D) $e^2$

<details><summary>Answer</summary>

**A**. $B_\nu\simeq2k_BT\nu^2/c^2$ is linear in $T$.

</details>

## ❓ Quiz: Light Deck multiple choice

*Exam-style multiple choice (3 pt each in the real exam).*

**1.** Star S1 has parallax $0.25''$. Star S2 is four times further away. Parallax of S2?

- A) $1.00''$
- B) $0.50''$
- C) $0.0625''$
- D) $0.125''$

<details><summary>Answer</summary>

**C**. $p\propto1/d$: $0.25''/4$. *(HS24 summer: MC 1)*

</details>

**2.** The Sun is 8 kpc from the Galactic centre. A star 10 kpc from us at $l=180^\circ$, $b=0^\circ$ is how far from the centre?

- A) 2 kpc
- B) 8 kpc
- C) 10 kpc
- D) 18 kpc

<details><summary>Answer</summary>

**D**. $l=180^\circ$ is the anticentre direction: $8+10$ kpc. *(HS24 summer: MC 2)*

</details>

**3.** Naked-eye limit $m=6.5$. Out to what distance is a star with $M=4$ visible (no extinction)?

- A) ~10 pc
- B) ~30 pc
- C) ~50 pc
- D) ~100 pc

<details><summary>Answer</summary>

**B**. $5\log_{10}(d/10)<2.5\Rightarrow d<10^{1.5}\cdot10=32$ pc. *(HS24 winter: MC 1)*

</details>

**4.** In terms of spectral classification, the Sun is a

- A) class O main-sequence star
- B) class G main-sequence star
- C) white dwarf
- D) class M red giant

<details><summary>Answer</summary>

**B**. OBAFGKM from hot to cool; the Sun is G2V. *(HS25 practice: MC 5)*

</details>

**5.** Which pairs a radiative quantity with a <b>wrong</b> SI unit?

- A) $I_\nu$: W m$^{-2}$ sr$^{-1}$ Hz$^{-1}$
- B) $F_\nu$: W m$^{-2}$
- C) $j_\nu$: W m$^{-3}$ sr$^{-1}$ Hz$^{-1}$
- D) none of the above

<details><summary>Answer</summary>

**B**. Specific flux is per Hz: W m$^{-2}$ Hz$^{-1}$ (= Jy $\times10^{26}$). *(HS24 summer: MC 4)*

</details>

**6.** A 21 cm line is observed at 700 MHz. Redshift of emission?

- A) $z\approx0.3$
- B) $z\approx0.5$
- C) $z\approx1$
- D) $z\approx2$

<details><summary>Answer</summary>

**C**. $\lambda_{obs}=c/700\,$MHz$=43$ cm; $1+z=43/21\approx2$. *(HS25 winter: MC 14)*

</details>

## ✍️ Derivation: Rayleigh–Jeans limit of the Planck law

*HS24 summer: open Q2(a) [3 pt]*

**Goal:** Starting from $B_\nu(T)=\frac{2h\nu^3}{c^2}\frac{1}{e^{h\nu/k_BT}-1}$, derive $B_{\nu,RJ}=\frac{2k_BT}{c^2}\nu^2$ for $h\nu\ll k_BT$, and give the limiting frequency for the CMB ($T=2.725$ K) in GHz.

**Given:** $h=6.626\times10^{-34}$ J s; $k_B=1.381\times10^{-23}$ J/K

1. Introduce a dimensionless variable that makes the small parameter visible.

   <details><summary>Reveal</summary>

   $x=h\nu/k_BT$, so $B_\nu=\frac{2k_B^3T^3}{h^2c^2}\frac{x^3}{e^x-1}$.

   </details>

2. Expand the denominator for $xll1$.

   <details><summary>Reveal</summary>

   $e^x-1=x+O(x^2)$, so $\frac{x^3}{e^x-1}\simeq x^2$.

   </details>

3. Substitute back.

   <details><summary>Reveal</summary>

   $B_\nu\simeq\frac{2k_B^3T^3}{h^2c^2}\frac{h^2\nu^2}{k_B^2T^2}=\frac{2k_BT\nu^2}{c^2}$. Planck's constant drops out: RJ is the classical (equipartition) result.

   </details>

4. Limit for the CMB.

   <details><summary>Reveal</summary>

   $\nu\ll k_BT/h=1.381\times10^{-23}\cdot2.725/6.626\times10^{-34}=5.7\times10^{10}$ Hz $=57$ GHz.

   </details>

**Full marks needs:** dimensionless $x$ · first-order expansion of $e^x$ · clean final form without $h$ · 57 GHz with units

## ✍️ Derivation: Why specific intensity is conserved in empty space

*HS25 practice: MC 2 (solution) and Choudhuri §2.2.2 eq. (2.10)*

**Goal:** Show that $I_\nu$ is the same at both ends of a ray in vacuum, and explain why a distant resolved galaxy has the same surface brightness as a nearby one.

**Given:** $dE=I_\nu\,dA\,d\Omega\,d\nu\,dt$

1. Take two small areas $dA_1$, $dA_2$ perpendicular to the ray, a distance $R$ apart. Write the energy through both, seen from each end.

   <details><summary>Reveal</summary>

   $I_{\nu1}dA_1d\Omega_1\,d\nu\,dt=I_{\nu2}dA_2d\Omega_2\,d\nu\,dt$, where $d\Omega_1$ is the solid angle of $dA_2$ seen from $dA_1$ and vice versa.

   </details>

2. Express the solid angles through the areas.

   <details><summary>Reveal</summary>

   $d\Omega_1=dA_2/R^2$, $d\Omega_2=dA_1/R^2$. Then both sides contain $dA_1dA_2/R^2$, so $I_{\nu1}=I_{\nu2}$: $dI_\nu/ds=0$.

   </details>

3. Interpret.

   <details><summary>Reveal</summary>

   Flux falls as $R^{-2}$ but so does the solid angle of the source; their ratio (surface brightness) is constant. Unresolved stars still look dimmer because their image size is set by diffraction/seeing, not by their true angular size.

   </details>

**Full marks needs:** energy balance through two areas · solid angles $dA/R^2$ · flux and solid angle both $\propto R^{-2}$

## 🔢 Calculation: How far can you still see the Sun?

The Sun has radius $R_\odot=6.957\times10^8$ m and apparent magnitude $m_\odot=-26.8$ at $1$ AU ($=1.495\times10^{11}$ m). The naked eye resolves $1$ arcmin and detects sources down to $m\sim7$. Ignore extinction and expansion.

1. Angular resolution of the eye in radians, $1' = \frac{1}{60}\frac{\pi}{180}$. *[rad]*

   <details><summary>Hint</summary>

   $1^\circ=\pi/180$ rad and $1^\circ=60'$. The result is about $2.9\times10^{-4}$.

   </details>

2. Distance at which the Sun (diameter $2R_\odot$) shrinks to $1'$: $\theta\simeq 2R_\odot/d$. Give it in AU. *[AU]*

   <details><summary>Hint</summary>

   Small-angle approximation $\theta\simeq D/d$ with $D=2R_\odot$. Then divide by $1\,\text{AU}$.

   </details>

3. Distance at which the Sun fades to $m=7$. From $m_\odot-m = 2.5\log_{10}(F/F_\odot)=5\log_{10}(1\,\text{AU}/d)$. Give it in parsec. *[pc]*

   <details><summary>Hint</summary>

   Flux $\propto d^{-2}$, so $\Delta m = 5\log_{10}(d/1\,\text{AU})$. Solve for $d$: $d=1\,\text{AU}\cdot10^{(7-m_\odot)/5}$, then divide by $3.0857\times10^{16}$ m/pc.

   </details>

## 🔢 Calculation: A 10 solar-mass star: colour and temperature

On the main sequence $L\propto M^3$ and $L\propto T_{\rm eff}^6$ (Refregier's scalings). A star has $M=10\,M_\odot$. Take $T_{\rm eff,\odot}=5770$ K and Wien's law $\lambda_{\max}T=b=2.898\times10^{-3}$ m K.

1. Surface temperature of the star: eliminate $L$, $T_{\rm eff}\propto M^{1/2}$. *[K]*

   <details><summary>Hint</summary>

   $M^3\propto T^6\Rightarrow T\propto M^{1/2}$.

   </details>

2. Peak wavelength of the star in nm. *[nm]*

   <details><summary>Hint</summary>

   Wien: $\lambda_{\max}=b/T$; multiply by $10^9$ for nm. Sun: 502 nm.

   </details>

3. Ratio $\lambda_{\max,\star}/\lambda_{\max,\odot}$. (Below 1 means the star looks bluer.) *[dimensionless]*

   <details><summary>Hint</summary>

   Equals $T_\odot/T_\star=M^{-1/2}$.

   </details>

## 🔢 Calculation: A supernova in Andromeda

A Type Ia supernova (peak absolute magnitude $M=-19.3$) explodes in Andromeda at $d=765$ kpc. Ignore extinction. Proxima Centauri has $m=11$.

1. Apparent magnitude from the distance modulus $m-M=5\log_{10}(d/10\,\text{pc})$. *[mag]*

   <details><summary>Hint</summary>

   $d/10\,\text{pc}=7.65\times10^4$, so the modulus is $24.4$.

   </details>

2. Flux ratio $F_{\rm SN}/F_{\rm Proxima}$ with $\Delta m = 2.5\log_{10}(F_1/F_2)$. *[dimensionless]*

   <details><summary>Hint</summary>

   Fainter objects have the bigger magnitude: $F_{\rm SN}/F_{\rm P}=10^{0.4(m_P-m_{SN})}$. Expect a few hundred.

   </details>

## 🔢 Calculation: CMB in the Rayleigh-Jeans window

The CMB has $T=2.725$ K. A telescope with $A=3\,\text{m}^2$ sees $\Omega=0.5\,\text{deg}^2$ of sky in the K-band $18$-$27$ GHz, uniformly sensitive. Use $B_\nu=\frac{2h\nu^3}{c^2}\frac{1}{e^{h\nu/k_BT}-1}$.

1. The Rayleigh-Jeans limit holds for $\nu\ll k_BT/h$. Compute $k_BT/h$ in GHz. *[GHz]*

   <details><summary>Hint</summary>

   Expand $e^x-1\approx x$ with $x=h\nu/k_BT$. The limit frequency is $k_BT/h\approx57$ GHz.

   </details>

2. Power on the sensor in pW: $P=\frac{2k_BT}{c^2}\frac{\nu_2^3-\nu_1^3}{3}A\,\Omega$, with $\Omega$ in sr. *[pW]*

   <details><summary>Hint</summary>

   RJ: $B_\nu=2k_BT\nu^2/c^2$. Integrate $\int\nu^2d\nu=\Delta(\nu^3)/3$. Convert $\text{deg}^2$ to sr with $(\pi/180)^2$. Expect about $1.8$ pW. (The printed official key says $2.5$ pW, but it does not follow from its own prefactor $3.83\times10^{-43}$: see notes.)

   </details>

3. At $\nu=100$ GHz, RJ is no longer valid. Compute $x=h\nu/k_BT$. *[dimensionless]*

   <details><summary>Hint</summary>

   $x=h\nu/(k_BT)\approx1.76$ (order unity: far from $x\ll1$).

   </details>

4. The 100 GHz intensity fluctuation $\delta I_\nu=0.05$ MJy/sr corresponds to what $\delta T_{\rm CMB}$ in µK? Use $\partial B_\nu/\partial T=\frac{2h\nu^3}{c^2T}\frac{xe^x}{(e^x-1)^2}$ and $1\,\text{Jy}=10^{-26}$ W m$^{-2}$Hz$^{-1}$. *[µK]*

   <details><summary>Hint</summary>

   Invert: $\delta T=\delta I_\nu\big/\frac{\partial B_\nu}{\partial T}$. Expect a couple of hundred µK.

   </details>

## 🔢 Calculation: Is the Moon a good calibrator for a CMB telescope?

A CMB telescope with a mirror of diameter $D=6$ m observes at $150$ GHz. The Moon spans $0.5^\circ$. Use the Rayleigh criterion $\theta\simeq1.22\lambda/D$.

1. Observing wavelength in mm. *[mm]*

   <details><summary>Hint</summary>

   $\lambda=c/\nu$.

   </details>

2. Resolution in arcmin. *[arcmin]*

   <details><summary>Hint</summary>

   $\theta=1.22\lambda/D$ in rad, times $180/\pi$ for degrees, times 60 for arcmin.

   </details>

3. How many resolution elements fit across the Moon? ($30'/\theta$) *[dimensionless]*

   <details><summary>Hint</summary>

   About 21: the Moon is well resolved, so it is not a point-source calibrator.

   </details>

## 🔢 Quick fight: Quick fight: how far can the eye see a Sun-like star?

The naked eye sees stars with $m<6.5$. A star with absolute magnitude $M=4$ (a bit brighter than the Sun) is visible out to which distance? No extinction. Within 25 %.

1. Limiting distance in pc. *[pc]*

   <details><summary>Hint</summary>

   $m-M=5\log_{10}(d/10\,\mathrm{pc})$.

   </details>

## 🔢 Calculation: The Sun as a blackbody

Treat the Sun as a blackbody with $R_\odot=6.957\times10^8$ m and $T_{\rm eff}=5772$ K. $\sigma_{SB}=5.670\times10^{-8}$ W m$^{-2}$ K$^{-4}$.

1. Luminosity $L=4\pi R^2\sigma_{SB}T^4$ in units of $10^{26}$ W. *[10^26 W]*

   <details><summary>Hint</summary>

   $\approx3.83\times10^{26}$ W: this is how $L_\odot$ is defined in practice.

   </details>

2. Solar constant: flux at 1 AU, in W/m$^2$. *[W m^-2]*

   <details><summary>Hint</summary>

   $F=L/4\pi d^2$ with $d=1$ AU: about 1360 W/m$^2$.

   </details>

## 👹 Boss: CMB versus thermal dust (exam problem)

*Open Question 2 [CMB and thermal dust, 10 pt], HS25 winter session, 20 min.*

In cosmological observations of fluctuations in the cosmic microwave background (CMB), thermal dust emission in our galaxy can act as a systematic foreground.

(a) [4 pt] The specific intensity $I_\nu$ of thermal emission of an optically thick object depends only on its temperature $T$ and is given by $B_\nu(T)=\frac{2h}{c^2}\frac{\nu^3}{e^{h\nu/k_BT}-1}$. Show that for all frequencies $\nu$ this specific intensity increases as the temperature increases.

(b) [4 pt] The CMB is observed as a near perfect blackbody of temperature $T_{\rm CMB}=2.73$ K. A typical CMB intensity fluctuation has amplitude $10^{-5}B_\nu(T_{\rm CMB})$. Dust in our galaxy is observed at $T_d=20$ K. Assuming this dust emission is also optically thick everywhere, show that at $\nu=100$ GHz the dust emission would be $\sim1.8\times10^6$ times brighter than the CMB fluctuation.

(c) [2 pt] The dust is not optically thick but a modified blackbody (greybody): $I_\nu=\tau_\nu B_\nu(T_d)$ with $\tau_\nu=\tau_{353}(\nu/353\,\text{GHz})^\beta$. With $T_d=20$ K and $\beta=1.6$, for what values of $\tau_{353}$ would the CMB fluctuation be brighter than the dust at $\nu=100$ GHz?

<details><summary>Key points of a full-marks solution</summary>

- (a) Differentiate: $\partial B_\nu/\partial T=\frac{2h^2\nu^4}{c^2k_BT^2}\frac{e^{h\nu/k_BT}}{(e^{h\nu/k_BT}-1)^2}>0$ since both exponentials are positive.
- (b) Only the temperature-dependent factor matters: $h\nu/k_BT_d=0.24$ gives $1/(e^{0.24}-1)=3.7$; $h\nu/k_BT_{CMB}=1.76$ gives $0.21$. Ratio $3.7/(0.21\times10^{-5})\simeq1.8\times10^6$.
- (c) Require $\tau_{100}=\tau_{353}(100/353)^{1.6}<1/(1.8\times10^6)$, so $\tau_{353}\lesssim4.2\times10^{-6}$.

</details>
