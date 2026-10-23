# The Dynamics Bay

*Astro Observatory Ship. Topics: rotation curves, dark matter, Plummer sphere, extinction, cluster scaling relations, bremsstrahlung.*

Stars in a galaxy never collide: they move in the smooth potential of everyone else. Here you read a rotation curve, build a Plummer sphere from its distribution function, and use scaling arguments to weigh a galaxy cluster from its X-rays.

**Sources:** Astro_I_2025_Winter_Session_with_Solutions.pdf (Open Q4 (Plummer sphere), Q5 (bremsstrahlung and cluster scaling), MC 12); Astro_I_2024_Summer_Session_with_Solutions.pdf (Open Q4 (extinction towards the Galactic centre), MC 13 (flat rotation curve density)); Choudhuri_Textbook.pdf (Ch. 6.1-6.3 (Galactic structure), Ch. 7.3-7.6 (stellar dynamics), Ch. 9.5 (clusters), Ch. 8.11 (bremsstrahlung)); 03-galaxies-dynamics.md (transcription, formulas and checks); Astro_I_2024_Winter_Session_with_Solutions.pdf (HS24 winter: open Q4, MC 11); Astro_I_2025_Practice_Exam_with_Solutions.pdf (HS25 practice: open Q6, MC 8, 11, 12); Astro_I_2024_Summer_Session_with_Solutions.pdf (HS24 summer: MC 7, 9); Choudhuri_Textbook.pdf (Choudhuri Ch. 6.2-6.4 (rotation, Oort constants, populations), Ch. 7.2-7.6 (relaxation, collisionless Boltzmann, Jeans equations))

## 📖 Anatomy of the Milky Way (intuition)

🖼️ **Picture it.** Edge-on, the Galaxy is a thin <b>disk</b> (radius ~15 kpc, thickness a few hundred pc, gas, dust, young stars, spiral arms) around a central <b>bulge</b> (a few kpc, old stars, a bar, and a $4\times10^6M_\odot$ black hole, Sgr A*), embedded in a nearly spherical <b>stellar halo</b> (globular clusters, old metal-poor stars) and a much larger <b>dark-matter halo</b>. The Sun sits in the disk about 8 kpc from the centre, moving at ~220 km/s, one orbit per ~230 Myr.

<b>Population I:</b> young, metal-rich stars in the disk, formed from gas enriched by earlier generations. <b>Population II:</b> old, metal-poor stars in the halo and bulge (and globular clusters), formed early before the gas was enriched.

<b>Dynamical support:</b> the disk is supported by <b>rotation</b> (stars on nearly circular orbits, small random velocities); the bulge and halo are supported by <b>random motions</b> (like a hot gas: velocity dispersion balances gravity via the virial theorem).

💡 **Intuition.** Metallicity is a clock: each generation of stars returns heavy elements to the ISM, so later stars are born metal-richer. Shapley (1918) located the centre of the Galaxy by noting that globular clusters (halo objects) are concentrated towards Sagittarius: the Sun is not at the centre.

⚠️ **Pitfall.** Population numbering is "historical": Pop I = young and metal-rich (disk), Pop II = old and metal-poor (halo/bulge). Exams ask exactly this in MC every year.

### Check yourself

**1.** Population II stars are

- A) young, metal-rich, in the disk
- B) old, metal-poor, in the halo and bulge
- C) forming now in molecular clouds
- D) exclusively white dwarfs

<details><summary>Answer</summary>

**B**. Formed before the gas was enriched. *(HS25 winter: MC 8)*

</details>

**2.** The Milky Way components are supported against collapse by

- A) disk and bulge random motions, halo rotation
- B) halo and disk rotation, bulge random motions
- C) halo and bulge random motions, disk rotation
- D) halo and bulge rotation, disk random motions

<details><summary>Answer</summary>

**C**. Only the disk rotates coherently. *(HS25 practice: MC 8)*

</details>

## 📖 Galactic rotation and the case for dark matter

$$\frac{v_c^2}{r}=\frac{GM_r}{r^2}\quad\Rightarrow\quad v_c(r)=\sqrt{\frac{GM_r}{r}}$$  
*Circular velocity from the enclosed mass (spherical approximation).*

If all the mass were the visible stars, concentrated in the inner few kpc, $v_c$ would fall as $r^{-1/2}$ (Keplerian) outside. 21 cm observations show <b>flat rotation curves</b> far beyond the visible disk: $v_c\approx$ const, so $M_r\propto r$ and $\rho\propto r^{-2}$. Most of the mass is dark.

$$v_c=\text{const}\ \Rightarrow\ M_r=\frac{v_c^2r}{G},\quad\rho=\frac{v_c^2}{4\pi Gr^2},\qquad v_{esc}^2(r)=2v_c^2\left(1+\ln\frac Rr\right)$$  
*Flat rotation curve, its density, and the escape speed for a halo truncated at R (HS25 practice Q6).*

Near the Sun, differential rotation shows up in the radial and tangential velocities of nearby stars: $v_R=Ad\sin2l$, $v_T=Ad\cos2l+Bd$ with the <b>Oort constants</b> $A=14.8$, $B=-12.4$ km s$^{-1}$kpc$^{-1}$; $v_c(R_0)=(A-B)R_0$.

💡 **Intuition.** A flat rotation curve is the signature of a singular isothermal sphere (next lesson): a halo whose "particles" (dark matter) have the same velocity dispersion everywhere. The extra mass keeps the outer stars on fast orbits that visible matter alone could not hold.

⚠️ **Pitfall.** Keep $M_r\propto r$ (flat curve) and $\rho\propto r^{-2}$ apart: MC asks both (HS25 winter MC12: $M_r\propto r$; HS24 summer MC13: $\rho\propto r^{-2}$). With a central black hole plus an $r^{-2}$ halo, $M_r=kr+M_0$ and $v^2=G(k+M_0/r)$ (HS24 winter Q4).

### Check yourself

**1.** A flat rotation curve implies the enclosed mass scales as

- A) constant
- B) $\sqrt r$
- C) $r$
- D) $r^2$

<details><summary>Answer</summary>

**C**. $M_r=v_c^2r/G$. *(HS25 winter: MC 12)*

</details>

**2.** In the flat part of the rotation curve the density scales as

- A) $r^2$
- B) $r$
- C) $r^{-1}$
- D) $r^{-2}$

<details><summary>Answer</summary>

**D**. $4\pi r^2\rho=dM/dr=$ const. *(HS24 summer: MC 13)*

</details>

## 📖 Why galaxies are collisionless: relaxation times

A "collision" between stars is an encounter that changes a star's velocity by order itself. That needs an impact parameter $b\approx Gm/v^2$ (7.10). The time between such encounters:

$$T_{\rm rel}\approx\frac{1}{\pi b^2vn}=\frac{v^3}{\pi nG^2m^2}\approx10^{10}\,\mathrm{yr}\;\frac{(v/\mathrm{km\,s^{-1}})^3}{n/\mathrm{pc^{-3}}}$$  
*Collisional relaxation time (7.11)-(7.12), m = M_sun.*

$$\frac{T_{\rm rel}}{T_{\rm cross}}\approx N\quad(\text{virialised},\ T_{\rm cross}=R/v)$$  
*(7.14). Binney & Tremaine refine this to N/(8 ln N).*

Galaxy: $v\approx100$ km/s, $n\approx0.1$ pc$^{-3}$ gives $T_{\rm rel}\sim10^{17}$ yr: collisions are irrelevant; stars move in the smooth mean potential (collisionless). Globular clusters ($v\approx10$, $n\approx10^3$): $10^{10}$ yr, partially relaxed. Yet galaxies look relaxed: during formation the potential changes violently and stars exchange energy with the changing field (<b>violent relaxation</b>, Lynden-Bell 1967) within a few crossing times: $T_{\rm rel}\gg T_{VR}\gtrsim T_{\rm cross}$.

<b>Dynamical friction:</b> a massive body moving through a sea of stars pulls them towards itself; by the time they gather it has moved on, leaving an overdense wake <b>behind</b> it, whose gravity slows it down. This makes satellite galaxies and globular clusters spiral inwards.

💡 **Intuition.** Self-gravitating systems never reach true thermodynamic equilibrium: a Maxwell–Boltzmann distribution in a self-consistent potential needs $\rho\propto r^{-2}$ at large $r$, i.e. infinite mass (Choudhuri §7.4). They relax by other (collective) processes to states that are not thermal equilibrium (HS24 winter MC11).

### Check yourself

**1.** Galaxies are called collisionless because

- A) stars are large compared with their separations
- B) the time for encounters to change velocities is much longer than the age of the Universe
- C) dark matter suppresses random motions
- D) stars all move on circular orbits

<details><summary>Answer</summary>

**B**. $T_{\rm rel}\sim10^{15-17}$ yr. *(HS25 winter: MC 9)*

</details>

**2.** Ordering of timescales for galaxies and globular clusters:

- A) $T_{\rm rel}\simeq T_{VR}\simeq T_{\rm cross}$
- B) $T_{\rm rel}\simeq T_{VR}\gg T_{\rm cross}$
- C) $T_{\rm cross}\gg T_{\rm rel}\simeq T_{VR}$
- D) $T_{\rm rel}\gg T_{VR}\gtrsim T_{\rm cross}$

<details><summary>Answer</summary>

**D**. Violent relaxation works in a few crossing times. *(HS25 practice: MC 11)*

</details>

**3.** Dynamical friction on a massive body is directed

- A) backwards, from the enhanced density in its wake
- B) forwards, from the enhanced density in its wake
- C) backwards, from a deficit in its wake
- D) forwards, from a deficit in its wake

<details><summary>Answer</summary>

**A**. The wake pulls it back. *(HS24 summer: MC 9)*

</details>

## 📖 Distribution functions, Jeans equations and the isothermal sphere

A collisionless system is described by a distribution function $f(\mathbf x,\mathbf v,t)$ (stars per $d^3x\,d^3v$). Stars are conserved and move smoothly in phase space, so $f$ is constant along orbits: the <b>collisionless Boltzmann</b> (Vlasov) equation

$$\frac{\partial f}{\partial t}+\mathbf v\cdot\nabla_{\mathbf x}f-\nabla\Phi\cdot\nabla_{\mathbf v}f=0,\qquad\rho=m\int f\,d^3v,\qquad\nabla^2\Phi=4\pi G\rho$$

<b>Jeans theorem:</b> any function of the integrals of motion (energy $\mathcal E=\frac12v^2+\Phi$, angular momentum) solves it in a steady state. Choose $f(\mathcal E)$ and you have a model: e.g. $f\propto(-\mathcal E)^{7/2}$ gives the Plummer sphere $\rho\propto(-\Phi)^5$ (boss of this room).

Taking velocity moments gives the <b>Jeans equations</b>, the stellar analogue of hydrostatic equilibrium with "pressure" $\rho\sigma^2$. Spherical, isotropic: $\frac{d(\rho\sigma^2)}{dr}=-\rho\frac{GM_r}{r^2}$. With $\sigma$ constant (isothermal) a solution is the <b>singular isothermal sphere</b>:

$$\rho(r)=\frac{\sigma^2}{2\pi Gr^2},\qquad v_c^2=2\sigma^2=\text{const}$$  
*Flat rotation curve; ⟨v²⟩ = 3σ² is independent of r (HS25 practice MC12).*

💡 **Intuition.** The isothermal sphere is literally an isothermal self-gravitating gas: "temperature" = velocity dispersion. It explains flat rotation curves with one number $\sigma$, but its mass diverges ($M_r\propto r$), so real halos must be truncated (HS25 practice Q6) or steepen (NFW profiles).

### Check yourself

**1.** The singular isothermal sphere ($\rho\propto r^{-2}$) has a mean square velocity

- A) independent of r
- B) proportional to r
- C) $\propto1/r$
- D) $\propto1/r^2$

<details><summary>Answer</summary>

**A**. Hence "isothermal". *(HS25 practice: MC 12)*

</details>

## ❓ Quiz: Dynamics Bay multiple choice

*Exam-style multiple choice (3 pt each in the real exam).*

**1.** Relative to disk stars, halo and bulge stars are predominantly

- A) younger Pop I, more metals
- B) older Pop I, fewer metals
- C) younger Pop II, fewer metals
- D) older Pop II, fewer metals

<details><summary>Answer</summary>

**D**. Formed before enrichment. *(HS24 summer: MC 7)*

</details>

**2.** Galaxies ($N\sim10^{11}$) are collisionless because

- A) close encounters are frequent
- B) encounters need far longer than the age of the Universe to change velocities
- C) dark matter suppresses motions
- D) orbits are circular

<details><summary>Answer</summary>

**B**. Relaxation time ~10¹⁵⁻¹⁷ yr. *(HS25 winter: MC 9)*

</details>

**3.** For a virialised cluster of N stars of mass m and radius ⟨R⟩, ⟨v²⟩ is proportional to

- A) $Nm/\langle R\rangle$
- B) $N\langle R\rangle/m$
- C) $m/(N\langle R\rangle)$
- D) $m/\langle R\rangle^2$

<details><summary>Answer</summary>

**A**. $\langle v^2\rangle=GNm/(2\langle R\rangle)$. *(HS25 winter: MC 10)*

</details>

**4.** Self-gravitating stellar systems relax

- A) via collisions to thermal equilibrium
- B) via collisions, not to thermal equilibrium
- C) via other processes to thermal equilibrium
- D) via other processes, not to thermal equilibrium

<details><summary>Answer</summary>

**D**. Violent relaxation; no true equilibrium. *(HS24 winter: MC 11)*

</details>

**5.** Flat rotation curve: the enclosed mass scales as

- A) const
- B) $\sqrt r$
- C) $r$
- D) $r^2$

<details><summary>Answer</summary>

**C**. $M_r=v_c^2r/G$. *(HS25 winter: MC 12)*

</details>

**6.** Flat rotation curve: density scales as

- A) $r^2$
- B) $r$
- C) $r^{-1}$
- D) $r^{-2}$

<details><summary>Answer</summary>

**D**. Isothermal sphere. *(HS24 summer: MC 13)*

</details>

**7.** Dynamical friction force is

- A) backwards, overdense wake
- B) forwards, overdense wake
- C) backwards, underdense wake
- D) forwards, underdense wake

<details><summary>Answer</summary>

**A**. Wake pulls back. *(HS24 summer: MC 9)*

</details>

**8.** Milky Way support:

- A) disk+bulge random, halo rotation
- B) halo+disk rotation, bulge random
- C) halo+bulge random, disk rotation
- D) halo+bulge rotation, disk random

<details><summary>Answer</summary>

**C**. Only the disk rotates. *(HS25 practice: MC 8)*

</details>

**9.** Timescale ordering:

- A) $T_{rel}\simeq T_{VR}\simeq T_{cr}$
- B) $T_{rel}\simeq T_{VR}\gg T_{cr}$
- C) $T_{cr}\gg T_{rel}\simeq T_{VR}$
- D) $T_{rel}\gg T_{VR}\gtrsim T_{cr}$

<details><summary>Answer</summary>

**D**. Violent relaxation is fast. *(HS25 practice: MC 11)*

</details>

**10.** Singular isothermal sphere: ⟨v²⟩ is

- A) independent of r
- B) $\propto r$
- C) $\propto1/r$
- D) $\propto1/r^2$

<details><summary>Answer</summary>

**A**. Isothermal. *(HS25 practice: MC 12)*

</details>

## ✍️ Derivation: Escape velocity from a truncated flat-rotation-curve halo

*HS25 practice: open Q6(a)-(b) [9 pt]*

**Goal:** For $\rho\propto r^{-2}$ out to a cut-off radius $R$ (zero beyond), show that $v_{esc}^2=2v_c^2\left(1+\ln\frac Rr\right)$ for $r<R$.

**Given:** $\frac12mv_{esc}^2=-\int_\infty^r\frac{GM_{r'}m}{r'^2}dr'$

1. Enclosed mass.

   <details><summary>Reveal</summary>

   $M_r=M\,r/R$ for $r<R$, $M_r=M$ for $r\ge R$ ($M$ = total mass).

   </details>

2. Split the integral at R.

   <details><summary>Reveal</summary>

   $\frac12v_{esc}^2=\int_r^R\frac{GM}{Rr'}dr'+\int_R^\infty\frac{GM}{r'^2}dr'=\frac{GM}{R}\ln\frac Rr+\frac{GM}{R}$.

   </details>

3. Use v_c.

   <details><summary>Reveal</summary>

   $v_c^2=GM_r/r=GM/R$ is constant, so $v_{esc}^2=2v_c^2\left(1+\ln\frac Rr\right)$.

   </details>

**Full marks needs:** $M_r$ piecewise · integral split at $R$ · $GM/R=v_c^2$ · final form

## ✍️ Derivation: Singular isothermal sphere from the Jeans equation

*Choudhuri §7.6 (spherical isotropic Jeans equation) and HS25 practice MC12*

**Goal:** With $\frac{d(\rho\sigma^2)}{dr}=-\rho\frac{GM_r}{r^2}$ and constant $\sigma$, show that $\rho=\frac{\sigma^2}{2\pi Gr^2}$ is a solution and that $v_c^2=2\sigma^2$.

**Given:** $M_r=4\pi\int_0^r\rho r'^2dr'$

1. Try ρ = A/r².

   <details><summary>Reveal</summary>

   $M_r=4\pi Ar$. Left side: $\sigma^2\frac{d}{dr}\frac{A}{r^2}=-\frac{2\sigma^2A}{r^3}$. Right side: $-\frac{A}{r^2}\frac{G4\pi Ar}{r^2}=-\frac{4\pi GA^2}{r^3}$.

   </details>

2. Solve for A.

   <details><summary>Reveal</summary>

   $2\sigma^2=4\pi GA\Rightarrow A=\frac{\sigma^2}{2\pi G}$.

   </details>

3. Circular velocity.

   <details><summary>Reveal</summary>

   $v_c^2=GM_r/r=4\pi GA=2\sigma^2$: flat.

   </details>

**Full marks needs:** power-law ansatz · match both sides · $v_c^2=2\sigma^2$

## 🔢 Calculation: Weighing the Galaxy with a flat rotation curve

The rotation curve is flat at $v_c=220$ km/s. Equating centripetal and gravitational acceleration, $v_c^2=GM_r/r$. Evaluate at $r=8$ kpc ($1$ kpc $=10^3$ pc).

1. Enclosed mass $M_r=v_c^2r/G$ in $M_\odot$. *[M_sun]*

   <details><summary>Hint</summary>

   $v$ in m/s, $r$ in metres ($8000\times3.0857\times10^{16}$ m).

   </details>

2. Mass density $\rho=v_c^2/(4\pi Gr^2)$ (from $M_r=4\pi\int r^2\rho\,dr\propto r$, i.e. $\rho\propto r^{-2}$) in $M_\odot/\text{pc}^3$. *[M_sun/pc^3]*

   <details><summary>Hint</summary>

   Differentiate $M_r=v_c^2r/G$: $dM/dr=4\pi r^2\rho=v_c^2/G$. Then convert kg/m$^3$ to $M_\odot$/pc$^3$ with $pc^3/M_\odot$.

   </details>

## 🔢 Calculation: Dust towards the Galactic centre

Toy model $n_H\propto\exp[-(r/r_0)^2]$, $r(s)=\sqrt{d^2+s^2-2ds\cos b}$ with $d=8$ kpc, $r_0=1.2$ kpc, and $A_V(b=0)=30$. The Gaussian integral gives $A_V(b)=30\exp\left[\frac{d^2}{r_0^2}(\cos^2b-1)\right]$.

1. Visual extinction at $l=0^\circ$, $b=15^\circ$. *[mag]*

   <details><summary>Hint</summary>

   $\cos^2 15^\circ=0.933$; the exponent is $44.4\times(-0.067)$.

   </details>

2. Flux ratio $F_{\rm ext}/F_0$ with $A_V=m_{\rm ext}-m_0=2.5\log_{10}(F_0/F_{\rm ext})$. *[dimensionless]*

   <details><summary>Hint</summary>

   Extinction dims the object: $F_{\rm ext}/F_0=10^{-A_V/2.5}\approx0.24$.

   </details>

## 🔢 Calculation: Scaling a galaxy cluster from its X-rays

Thermal bremsstrahlung: $L_X\propto\int\rho_g^2T^{1/2}dV$. Virial equilibrium with thermal support gives $T\propto M/\langle R\rangle$; with $M\propto\langle R\rangle^3$ and $M_g=f_gM$ this gives $T\propto M^{2/3}$ and $L_X\propto M^{4/3}$. A cluster is 8 times more massive than another with the same gas fraction.

1. Ratio of gas temperatures $T_2/T_1=k^{2/3}$. *[dimensionless]*

   <details><summary>Hint</summary>

   $T\propto M^{2/3}$, $8^{2/3}=4$.

   </details>

2. Ratio of X-ray luminosities $L_2/L_1=k^{4/3}$. *[dimensionless]*

   <details><summary>Hint</summary>

   $\rho_g^2\propto R^{-6}M^2=M^0$ (constant), times $T^{1/2}\propto M^{1/3}$, times volume $\propto M$: $L_X\propto M^{4/3}$. $8^{4/3}=16$.

   </details>

## 🔢 Calculation: Oort constants: the Sun's orbit

Choudhuri (6.23)-(6.24): $A=14.8$, $B=-12.4$ km s$^{-1}$ kpc$^{-1}$. Take $R_0=8$ kpc and $1$ kpc $=3.0857\times10^{16}$ km.

1. Circular speed of the Sun $v_c=(A-B)R_0$ in km/s. *[km/s]*

   <details><summary>Hint</summary>

   $(14.8+12.4)\times8$.

   </details>

2. Orbital period $2\pi R_0/v_c$ in Myr. *[Myr]*

   <details><summary>Hint</summary>

   Convert kpc to km; about 230 Myr: the Sun has orbited ~20 times.

   </details>

3. Local slope $dv_c/dR=-(A+B)$ in km/s/kpc. *[km/s/kpc]*

   <details><summary>Hint</summary>

   From (6.21)-(6.22), $A+B=-dv_c/dR$. $-2.4$: almost flat.

   </details>

## 🔢 Calculation: Escape speed and the size of the halo

HS25 practice Q6(c): the fastest star in the solar neighbourhood ($r=8$ kpc) moves at 440 km/s and is assumed bound. $v_c=230$ km/s. Use $v_{esc}^2=2v_c^2(1+\ln(R/r))$.

1. Lower limit on the cut-off radius $R$ in kpc. *[kpc]*

   <details><summary>Hint</summary>

   $R/r=\exp(v^2/2v_c^2-1)=e^{0.83}$.

   </details>

2. Mass within 8 kpc, $v_c^2r/G$, in $10^{10}M_\odot$. *[10^10 M_sun]*

   <details><summary>Hint</summary>

   $\approx9.8\times10^{10}M_\odot$.

   </details>

3. Lower limit on the total mass $M=M_8\,R/r$ in $10^{10}M_\odot$. *[10^10 M_sun]*

   <details><summary>Hint</summary>

   $9.8\times10^{10}\times18.3/8\approx2.2\times10^{11}M_\odot$. <b>Note:</b> the official key prints $9.8\times10^{11}M_\odot$, which does not follow from its own expression $9.8\times10^{10}\times(18/8)$; the correct value is $2.2\times10^{11}M_\odot$.

   </details>

## 🔢 Calculation: Relaxation times: galaxy vs globular cluster

Use $T_{\rm rel}\approx v^3/(\pi nG^2m^2)$ with $m=M_\odot$ (Choudhuri (7.11)).

1. Galaxy: $v=100$ km/s, $n=0.1$ pc$^{-3}$. $T_{\rm rel}$ in years (enter e.g. 2e17). *[yr]*

   <details><summary>Hint</summary>

   Convert $n$ to m$^{-3}$ ($1\,\mathrm{pc}^3=2.94\times10^{49}$ m$^3$).

   </details>

2. Globular cluster: $v=10$ km/s, $n=10^3$ pc$^{-3}$. $T_{\rm rel}$ in Gyr. *[Gyr]*

   <details><summary>Hint</summary>

   Of order the age: partially relaxed (mass segregation, core collapse happen).

   </details>

## 👹 Boss: the Plummer sphere (exam problem)

*Open Question 4 [Plummer sphere, 14 pt], HS25 winter session, 30 min.*

A Plummer sphere is a collisionless stellar system of self-gravitating particles of mass $m$, spherically symmetric, with distribution function $f(\mathcal{E})=f_0(-\mathcal{E})^{7/2}$ for $\mathcal{E}<0$ and $0$ for $\mathcal{E}\ge0$, where $\mathcal{E}=v^2/2+\Phi(r)$ is the energy per unit mass.

(a) [6 pt] Show that the mass density $\rho(\Phi)\propto(-\Phi)^5$. Hints: $\rho(r)=4\pi m\int_0^{v_{\max}}f_0(-\mathcal{E})^{7/2}v^2dv$; relate $v_{\max}$ to $\Phi$; define $x=v^2/(-2\Phi)$; note $\int_0^1x^{1/2}(1-x)^{7/2}dx=7\pi/256$.

(b) [4 pt] With $\Phi(r)=-GM/\sqrt{r^2+a^2}$ (no derivation needed), find the circular velocity profile $v_c(r)$.

(c) [4 pt] With the Poisson equation $\frac{1}{r^2}\frac{d}{dr}(r^2\frac{d\Phi}{dr})=4\pi G\rho$, derive $\rho(r)$ and the central density.

<details><summary>Key points of a full-marks solution</summary>

- (a) $\mathcal{E}<0\Leftrightarrow v<v_{\max}=\sqrt{-2\Phi}$. With $x=v^2/(-2\Phi)$: $-\mathcal{E}=-\Phi(1-x)$, $v=\sqrt{-2\Phi x}$, $dv=\sqrt{-\Phi/2}\,x^{-1/2}dx$. Then $\rho=4\sqrt2\pi mf_0(-\Phi)^5\int_0^1x^{1/2}(1-x)^{7/2}dx=\frac{7\pi^2\sqrt2\,mf_0}{64}(-\Phi)^5$. Powers of $(-\Phi)$: $7/2+3/2=5$.
- (b) $v_c^2/r=d\Phi/dr=GMr/(r^2+a^2)^{3/2}$, so $v_c=\sqrt{GM}\,r/(r^2+a^2)^{3/4}$.
- (c) $r^2\Phi'=GMr^3/(r^2+a^2)^{3/2}$; derivative: $3GMa^2r^2/(r^2+a^2)^{5/2}$. Hence $\rho=\frac{3M}{4\pi a^3}(1+r^2/a^2)^{-5/2}$, $\rho(0)=\frac{3M}{4\pi a^3}$. Consistent with (a): $\rho\propto(r^2+a^2)^{-5/2}\propto(-\Phi)^5$.

</details>

## 👹 Boss: a black hole inside an r⁻² halo (exam problem)

*HS24 winter: Open Question 4 [12 pt], 20 min.*

Let us build a simple model of a spherically symmetric galaxy. Assume that a point mass (a black hole) of mass $M_0=4\times10^6M_\odot$ is located at the centre of the galaxy ($r=0$) and that the remainder of the mass has a density profile that decays as $r^{-2}$, where $r$ is the radial distance from the galaxy centre.

(a) [4 pt] Show that the enclosed mass within a spherical region of radius $r$ can be expressed as $M_r=kr+M_0$, where $k$ is a constant to be determined later.

(b) [4 pt] Assuming circular motion and Newtonian gravity, show that the orbital velocity of a star at radius $r$ is $v=\left[G\left(k+\frac{M_0}{r}\right)\right]^{1/2}$.

(c) [4 pt] If the orbital velocity is 110 km s$^{-1}$ at 2 pc, determine the value of $k$ in units of $M_\odot$ pc$^{-1}$.

<details><summary>Key points of a full-marks solution</summary>

- (a) $M_r=M_0+4\pi\int_0^r\rho_s r'^2dr'$ with $\rho_s\propto r'^{-2}$ gives $M_r=M_0+kr$.
- (b) $v^2/r=GM_r/r^2\Rightarrow v=\sqrt{G(kr+M_0)/r}=\sqrt{G(k+M_0/r)}$.
- (c) $k=v^2/G-M_0/r=1.81\times10^{20}$ kg/m $-2\times10^6M_\odot$/pc $=(2.82-2)\times10^6=8.2\times10^5M_\odot$/pc.

</details>
