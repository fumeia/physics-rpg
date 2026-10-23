# The Expansion Engine

*Astro Observatory Ship. Topics: Friedmann equation, radiation era, BBN, Hubble law, redshift, black hole growth, Salpeter time.*

Every recent Refregier exam closes with a Friedmann-equation problem. In the Expansion Engine you derive how a(t) depends on what fills the universe, date nucleosynthesis, and let a black hole feed at the Eddington rate.

**Sources:** Astro_I_2025_Winter_Session_with_Solutions.pdf (Open Q6 (BH accretion, Salpeter time), Q7 (radiation-dominated universe, BBN), MC 13-15); Astro_I_2024_Summer_Session_with_Solutions.pdf (Open Q7 (Friedmann equation with equation of state w), MC 14-15); Choudhuri_Textbook.pdf (Ch. 10.3-10.7 (FRW, Friedmann, eras), Ch. 11.2-11.3 (BBN), Ch. 9.4 (accretion)); 04-cosmos-and-accretion.md (transcription, formulas and checks); Astro_I_2024_Winter_Session_with_Solutions.pdf (HS24 winter: open Q7, MC 14-15); Astro_I_2025_Practice_Exam_with_Solutions.pdf (HS25 practice: open Q7); Astro_I_2024_Summer_Session_with_Solutions.pdf (HS24 summer: MC 14); Choudhuri_Textbook.pdf (Choudhuri Ch. 9.3 (Hubble law), 10.3-10.7 (FRW metric, Friedmann, contents, matter and radiation eras))

## 📖 Hubble's law and redshift (intuition)

$$v=H_0d,\qquad 1+z=\frac{\lambda_{\rm obs}}{\lambda_{\rm em}}=\frac{a_0}{a(t_{\rm em})},\qquad v\approx cz\ (z\ll1)$$  
*Hubble law and cosmological redshift.*

$H_0\approx70$ km s$^{-1}$Mpc$^{-1}$ (often written $100h$ with $h\approx0.7$). Its inverse, the <b>Hubble time</b> $1/H_0=977.8/H_0[\mathrm{km/s/Mpc}]$ Gyr $\approx14$ Gyr, sets the age scale of the Universe.

💡 **Intuition.** Redshift is not a Doppler shift through space: the wavelength of light is stretched together with space, $\lambda\propto a$. That is why $1+z$ is exactly the factor by which the Universe has grown since the light left. Every observer sees the same Hubble law (no centre): stretch a rubber sheet with dots on it and every dot sees the others recede with $v\propto d$.

<b>Cosmological principle:</b> on large scales ($\gtrsim100\,h^{-1}$ Mpc) the Universe is homogeneous and isotropic. Then the only freedom is a single scale factor $a(t)$ and a constant spatial curvature $k\in\{-1,0,+1\}$: the Robertson–Walker metric.

⚠️ **Pitfall.** $v=cz$ only for $z\ll1$. For $z\sim1$ use $1+z=a_0/a$ and do not quote a velocity. Frequencies: $1+z=\nu_{\rm em}/\nu_{\rm obs}$ (HS25 winter MC14: 1420 MHz seen at 700 MHz is $z\approx1$).

### Check yourself

**1.** A galaxy has $z=0.024$; $H_0=72$ km/s/Mpc. Its distance is about

- A) 10 Mpc
- B) 100 Mpc
- C) 300 Mpc
- D) 720 Mpc

<details><summary>Answer</summary>

**B**. $cz/H_0=7195/72$. *(HS25 winter: MC 13)*

</details>

## 📖 Curvature: closed, flat, open (intuition)

A 2D picture: a sphere (positive curvature, $k=+1$: triangle angles sum to more than 180°, parallel lines meet, finite area), a plane ($k=0$: 180°), a saddle (negative curvature, $k=-1$: less than 180°, infinite).

$$\frac{kc^2}{a^2H^2}=\Omega-1,\qquad\Omega=\frac{\rho}{\rho_c},\quad\rho_c=\frac{3H^2}{8\pi G}$$  
*(10.30)-(10.31): the density decides the geometry.*

💡 **Intuition.** $\Omega>1$: more than enough mass, space closes on itself like a sphere and (without $\Lambda$) the expansion eventually reverses. $\Omega=1$: flat, the "escape velocity" case. $\Omega<1$: open, expands forever. Observations (CMB) say our Universe is very nearly flat: $\Omega_{\rm tot}=1$ to within ~0.5 %.

⚠️ **Pitfall.** Triangle angle sum $>180^\circ$ means <b>positive</b> curvature (HS24 summer MC14), and $\Omega_{\rm tot}>1$ means <b>closed</b>, $k=+1$ (HS25 winter MC15). Never "cylindrical": a cylinder has zero intrinsic curvature.

### Check yourself

**1.** If $\Omega_{\rm tot}>1$ the spatial geometry is

- A) flat
- B) open/hyperbolic
- C) closed/spherical
- D) cylindrical

<details><summary>Answer</summary>

**C**. $k=+1$. *(HS25 winter: MC 15)*

</details>

**2.** If the angles of every small triangle on a 2D surface sum to more than 180°, the surface has

- A) curvature −1
- B) negative curvature
- C) zero curvature
- D) positive curvature

<details><summary>Answer</summary>

**D**. Like a sphere. *(HS24 summer: MC 14)*

</details>

## 📖 The Friedmann equation from a Newtonian shell

Take a sphere of radius $a$ in a uniform universe of density $\rho$. A test mass on its surface feels only the mass inside, $M=\frac43\pi a^3\rho$ (shell theorem). Energy conservation: $\frac12\dot a^2-\frac{GM}{a}=E$, i.e. $\dot a^2-\frac{8\pi G}{3}\rho a^2=2E$. General relativity gives the same equation with $2E=-kc^2$ (Choudhuri (10.25)-(10.27)):

$$\left(\frac{\dot a}{a}\right)^2=\frac{8\pi G}{3}\rho-\frac{kc^2}{a^2},\qquad H=\frac{\dot a}{a}$$  
*Friedmann equation.*

How $\rho$ depends on $a$ follows from the first law for an expanding volume $a^3$ with pressure $P=w\rho c^2$: $d(\rho c^2a^3)+P\,d(a^3)=0$:

$$\rho\propto a^{-3(1+w)}:\quad\text{matter }(w=0)\ \rho\propto a^{-3};\quad\text{radiation }(w=\tfrac13)\ \rho\propto a^{-4};\quad\Lambda\ (w=-1)\ \rho=\text{const}$$  
*(10.37)-(10.40).*

💡 **Intuition.** Matter is diluted ($n\propto a^{-3}$). Radiation is diluted AND each photon is redshifted ($E\propto a^{-1}$): $a^{-4}$. Vacuum energy is a property of space, so it does not dilute. Hence the history: radiation dominated early, matter later (after $z_{eq}\approx3400$), and dark energy today.

Numbers: $\rho_{c,0}=\frac{3H_0^2}{8\pi G}=1.88\times10^{-26}h^2$ kg m$^{-3}$ (10.29), about 5 protons per cubic metre. Today $\Omega_M\approx0.3$, $\Omega_\Lambda\approx0.7$, $\Omega_R\approx9\times10^{-5}$.

⚠️ **Pitfall.** $k$ is only a sign ($-1,0,1$); the radius of curvature is in $a$. For $k=0$ the Friedmann equation is just $\dot a/a=\sqrt{8\pi G\rho/3}$: separate variables (exam hint: $a$-terms with $da$ on the left).

### Check yourself

**1.** The energy density of radiation scales as

- A) $a^{-3}$
- B) $a^{-2}$
- C) $a^{-4}$
- D) constant

<details><summary>Answer</summary>

**C**. Dilution and redshift. *(HS24 winter: MC 15)*

</details>

**2.** In our Universe

- A) radiation dominates early, matter later
- B) matter dominates early, radiation later
- C) radiation always dominates
- D) matter always dominates

<details><summary>Answer</summary>

**A**. $\rho_R/\rho_M\propto1/a$. *(HS24 winter: MC 14)*

</details>

## 📖 Solutions: how the Universe grows

$$k=0:\quad a\propto t^{\frac{2}{3(1+w)}}\ \Rightarrow\ \text{matter }a\propto t^{2/3},\ \text{radiation }a\propto t^{1/2};\qquad\Lambda:\ a\propto e^{Ht},\ H=\sqrt{8\pi G\rho_\Lambda/3}$$

$$k=+1,\ \text{matter}:\ \frac{a}{a_0}=\frac{\Omega_0}{2(\Omega_0-1)}(1-\cos\eta),\quad H_0t=\frac{\Omega_0}{2(\Omega_0-1)^{3/2}}(\eta-\sin\eta)$$  
*Closed universe (cycloid): Big Bang at η = 0, turnaround at η = π, Big Crunch at η = 2π.*

🖼️ **Picture it.** Choudhuri Fig. 10.5: $a(t)$ for $k=+1$ rises from zero, bends over and falls back (a cycloid arch); $k=0$ grows as $t^{2/3}$ forever; $k=-1$ grows faster and approaches $a\propto t$ (coasting). All three curves start together at the Big Bang with infinite slope; near $t=0$ curvature does not matter.

💡 **Intuition.** Age: for a flat matter universe $H=\frac{2}{3t}$, so $t_0=\frac23H_0^{-1}\approx9.3$ Gyr, younger than the oldest stars (12–13 Gyr): one of the hints that dark energy exists. With $\Lambda$ the expansion accelerates (SN Ia distances, 1998) and the age becomes 13.8 Gyr.

⚠️ **Pitfall.** For $H=\alpha/t$ (power law) the age is $\alpha/H$, not $1/H$. In a closed universe the present time must be before turnaround if we see expansion: $t_\odot<t_{\rm ta}$ gives an upper limit on $H_0$ (HS24 winter Q7c).

📝 **How the exam asks it.** Every exam ends with Friedmann: radiation era and BBN (HS25 winter Q7), general $w$ (HS24 summer Q7), cosmological constant (HS25 practice Q7), closed universe lifetime (HS24 winter Q7).

### Check yourself

**1.** A flat universe with $w=0$ expands as

- A) $t^{1/2}$
- B) $t^{2/3}$
- C) $t$
- D) $e^{Ht}$

<details><summary>Answer</summary>

**B**. $\alpha=2/(3(1+w))$.

</details>

**2.** A flat $\Lambda$-dominated universe has a Hubble parameter that

- A) grows
- B) decreases as 1/t
- C) is constant
- D) oscillates

<details><summary>Answer</summary>

**C**. $H^2=8\pi G\rho_\Lambda/3$ = const. *(HS25 practice: open Q7b)*

</details>

## ❓ Quiz: Expansion Engine multiple choice

*Exam-style multiple choice (3 pt each in the real exam).*

**1.** $z=0.024$, $H_0=72$ km/s/Mpc: distance

- A) 10 Mpc
- B) 100 Mpc
- C) 300 Mpc
- D) 720 Mpc

<details><summary>Answer</summary>

**B**. $cz/H_0$. *(HS25 winter: MC 13)*

</details>

**2.** 21 cm line observed at 700 MHz: $z\approx$

- A) 0.3
- B) 0.5
- C) 1
- D) 2

<details><summary>Answer</summary>

**C**. $1420/700-1$. *(HS25 winter: MC 14)*

</details>

**3.** $\Omega_{\rm tot}>1$:

- A) flat
- B) open
- C) closed
- D) cylindrical

<details><summary>Answer</summary>

**C**. $k=+1$. *(HS25 winter: MC 15)*

</details>

**4.** Triangles with angle sum > 180°:

- A) curvature −1
- B) negative
- C) zero
- D) positive

<details><summary>Answer</summary>

**D**. Sphere-like. *(HS24 summer: MC 14)*

</details>

**5.** Epochs in our Universe:

- A) radiation then matter
- B) matter then radiation
- C) always radiation
- D) always matter

<details><summary>Answer</summary>

**A**. $\rho_R\propto a^{-4}$, $\rho_M\propto a^{-3}$. *(HS24 winter: MC 14)*

</details>

**6.** $\rho_R\propto$

- A) $a^{-3}$
- B) $a^{-2}$
- C) $a^{-4}$
- D) const

<details><summary>Answer</summary>

**C**. Number dilution × redshift. *(HS24 winter: MC 15)*

</details>

**7.** The critical density today is about

- A) 5 protons per m³
- B) 5 protons per cm³
- C) 1 g per cm³
- D) $10^{-3}$ kg m$^{-3}$

<details><summary>Answer</summary>

**A**. $\rho_c=9.2\times10^{-27}$ kg m$^{-3}$ for $h=0.7$.

</details>

## ✍️ Derivation: Power-law expansion for a fluid with equation of state w

*HS24 summer: open Q7 [11 pt]*

**Goal:** Flat universe, $\rho=\rho_0(a_0/a)^{3(1+w)}$, $w>-1$. From $(\dot a/a)^2=\frac{8\pi G}{3}\rho-\frac{kc^2}{a^2}$ show $a\propto t^\alpha$ with $\alpha=\frac{2}{3(1+w)}$, and give the matter and radiation cases.

**Given:** $k=0$, $a(0)=0$

1. (a) Differential equation.

   <details><summary>Reveal</summary>

   $\frac{da}{dt}=\sqrt{\frac{8\pi G\rho_0a_0^{3(1+w)}}{3}}\,a^{-\frac12(1+3w)}$.

   </details>

2. (b) Separate and integrate from 0.

   <details><summary>Reveal</summary>

   $\int_0^aa'^{\frac12(1+3w)}da'=\frac{a^{\frac32(1+w)}}{\frac32(1+w)}=\sqrt{\frac{8\pi G\rho_0a_0^{3(1+w)}}{3}}\,t$, so $a\propto t^{\frac{2}{3(1+w)}}$.

   </details>

3. (c) Special cases.

   <details><summary>Reveal</summary>

   Matter $w=0$: $a\propto t^{2/3}$. Radiation $w=1/3$: $a\propto t^{1/2}$.

   </details>

**Full marks needs:** correct exponent of $a$ in $\dot a$ · separation and integration with $a(0)=0$ · $\alpha=2/(3(1+w))$ · both special cases

## ✍️ Derivation: A universe dominated by a cosmological constant

*HS25 practice: open Q7 [12 pt]*

**Goal:** Flat universe with only dark energy of constant density $\rho_\Lambda$. Show that $H$ is constant and $a\propto e^{Ht}$.

**Given:** $\dot a^2/a^2=\frac{8\pi G}{3}\rho-\frac{kc^2}{a^2}$

1. (a) Friedmann equation.

   <details><summary>Reveal</summary>

   $\frac{\dot a^2}{a^2}=\frac{8\pi G}{3}\rho_\Lambda$.

   </details>

2. (b) In terms of H.

   <details><summary>Reveal</summary>

   $H^2=\frac{8\pi G}{3}\rho_\Lambda$: constant in time since $\rho_\Lambda$ is.

   </details>

3. (c)-(d) Solve.

   <details><summary>Reveal</summary>

   $\frac{da}{dt}=aH\Rightarrow d\ln a=H\,dt\Rightarrow a\propto e^{Ht}$, with $H=\sqrt{8\pi G\rho_\Lambda/3}$ in the exponent.

   </details>

**Full marks needs:** Friedmann with ρ_Λ only · H constant · exponential solution with coefficient H

## 🔢 Calculation: Light from the last scattering

The CMB temperature today is $T_0=2.725$ K and scales as $T\propto a^{-1}\propto1+z$. Recombination happens at $T_{\rm rec}\approx3000$ K. Wien's constant is $b=2.898\times10^{-3}$ m K.

1. Redshift of recombination $z_{\rm rec}=T_{\rm rec}/T_0-1$. *[dimensionless]*

   <details><summary>Hint</summary>

   $1+z=a_0/a=T/T_0$.

   </details>

2. Peak wavelength of the radiation at recombination in nm. *[nm]*

   <details><summary>Hint</summary>

   Wien: $\lambda_{\max}=b/T$. Near-infrared.

   </details>

3. Peak wavelength today in mm. (It is stretched by $1+z$.) *[mm]*

   <details><summary>Hint</summary>

   Same Wien law at $T_0$, equal to $\lambda_{\rm rec}(1+z)$.

   </details>

## 🔢 Calculation: Growing a quasar: the Salpeter time

A black hole accretes at the Eddington rate with radiative efficiency $\eta=0.1$: $L=\eta\dot M_{\rm acc}c^2$, $\dot M_{BH}=(1-\eta)\dot M_{\rm acc}$, $L_{\rm Edd}=4\pi GM_{BH}m_pc/\sigma_T$. Then $M_{BH}(t)=M_{BH}(0)e^{t/t_S}$ with $t_S=\frac{\eta}{1-\eta}\frac{c\sigma_T}{4\pi Gm_p}$.

1. Salpeter time in units of $10^7$ yr. *[10^7 yr]*

   <details><summary>Hint</summary>

   Insert $G,\,m_p,\,\sigma_T,\,c$ in SI. The result is $5.0\times10^7$ yr.

   </details>

2. Doubling time $t_S\ln2$ in $10^7$ yr. *[10^7 yr]*

   <details><summary>Hint</summary>

   $2=e^{t/t_S}\Rightarrow t=t_S\ln2\approx3.5\times10^7$ yr.

   </details>

3. Time to grow by a factor $10^8$ (a $10\,M_\odot$ seed to $10^9\,M_\odot$) in Gyr. *[Gyr]*

   <details><summary>Hint</summary>

   $t=t_S\ln(10^8)=18.4\,t_S\approx0.9$ Gyr. This is why $z>7$ quasars are a puzzle.

   </details>

## 🔢 Calculation: Friedmann universe with equation of state $w$

Flat universe with $\rho\propto a^{-3(1+w)}$: $\dot a/a=\sqrt{8\pi G\rho/3}$ gives $a\propto t^{\alpha}$ with $\alpha=\frac{2}{3(1+w)}$. Then $H=\dot a/a=\alpha/t$, so the age is $t_0=\alpha/H_0$. Take $H_0=70$ km/s/Mpc, $1/H_0=13.97$ Gyr.

1. Exponent $\alpha$ for non-relativistic matter ($w=0$). *[dimensionless]*

   <details><summary>Hint</summary>

   $\rho\propto a^{-3}$: $a\propto t^{2/3}$.

   </details>

2. Age of a flat matter-only universe $t_0=\alpha/H_0$ in Gyr. *[Gyr]*

   <details><summary>Hint</summary>

   $t_0=\frac23\cdot13.97\,\text{Gyr}\approx9.3$ Gyr (younger than the oldest stars: one reason for $\Lambda$).

   </details>

3. Exponent for a fluid with $w=0.5$. *[dimensionless]*

   <details><summary>Hint</summary>

   $\alpha=2/(3\times1.5)=0.444$.

   </details>

## 🔢 Quick fight: Quick fire: Hubble law and the 21 cm line

A galaxy at redshift $z=0.024$, $H_0=72$ km/s/Mpc, and $v\approx cz$. Separately, the $21$ cm line (rest frequency $1420.4$ MHz) is received at $700$ MHz. Estimate each within about 25 %.

1. Distance $d=cz/H_0$ in Mpc. *[Mpc]*

   <details><summary>Hint</summary>

   $cz=7195$ km/s, divide by $72$ km/s/Mpc.

   </details>

2. Redshift of emission of the 21 cm line seen at 700 MHz: $1+z=\nu_{\rm em}/\nu_{\rm obs}$. *[dimensionless]*

   <details><summary>Hint</summary>

   Frequencies scale inversely to wavelengths: $1+z=\lambda_{\rm obs}/\lambda_{\rm em}=\nu_{\rm em}/\nu_{\rm obs}\approx2$.

   </details>

## 🔢 Calculation: Critical density and Hubble time

$H_0=70$ km s$^{-1}$ Mpc$^{-1}$, $1$ Mpc $=3.0857\times10^{19}$ km.

1. $H_0$ in s$^{-1}$ (enter e.g. 2.3e-18). *[s^-1]*

   <details><summary>Hint</summary>

   Divide km/s/Mpc by km per Mpc.

   </details>

2. Hubble time $1/H_0$ in Gyr. *[Gyr]*

   <details><summary>Hint</summary>

   $\approx14$ Gyr.

   </details>

3. Critical density $3H_0^2/(8\pi G)$ in $10^{-27}$ kg m$^{-3}$. *[10^-27 kg m^-3]*

   <details><summary>Hint</summary>

   $1.88\times10^{-26}h^2$ with $h=0.7$.

   </details>

4. Equivalent number of protons per m$^3$. *[m^-3]*

   <details><summary>Hint</summary>

   About 5.5: the Universe is very empty.

   </details>

## 🔢 Calculation: Life and death of a closed universe

Matter-only closed universe with $\Omega_{M,0}=2$ and $H_0=70$ km/s/Mpc ($1/H_0=13.97$ Gyr). Use $H_0t=\frac{\Omega_0}{2(\Omega_0-1)^{3/2}}(\eta-\sin\eta)$ (HS24 winter Q7).

1. Turnaround time ($\eta=\pi$) in Gyr. *[Gyr]*

   <details><summary>Hint</summary>

   $\frac{\pi}{H_0}\frac{\Omega}{2(\Omega-1)^{3/2}}$.

   </details>

2. Total lifetime Big Bang to Big Crunch ($\eta=2\pi$) in Gyr. *[Gyr]*

   <details><summary>Hint</summary>

   Symmetric cycloid: twice the turnaround time.

   </details>

3. Age today: today $a=a_0$, so $1-\cos\eta_0=2(\Omega-1)/\Omega=1$, $\eta_0=\pi/2$. Age in Gyr. *[Gyr]*

   <details><summary>Hint</summary>

   $H_0t_0=\frac{2}{2}(\frac\pi2-1)=0.571$: only 8 Gyr, younger than the flat case.

   </details>

## 🔢 Calculation: When did matter take over from radiation?

Use $\rho_\gamma=a_BT_0^4/c^2$ with $T_0=2.725$ K, $a_B=7.566\times10^{-16}$ J m$^{-3}$K$^{-4}$, total radiation $\rho_R=1.68\rho_\gamma$ (photons + neutrinos, Choudhuri (10.47)), and $\rho_M=\Omega_M\rho_c$ with $\Omega_M=0.3$, $\rho_c=9.20\times10^{-27}$ kg m$^{-3}$.

1. Photon mass density today in $10^{-31}$ kg m$^{-3}$. *[10^-31 kg m^-3]*

   <details><summary>Hint</summary>

   $\Omega_\gamma\approx5\times10^{-5}$.

   </details>

2. Redshift of equality $1+z_{eq}=\rho_{M,0}/\rho_{R,0}$; enter $z_{eq}$. *[dimensionless]*

   <details><summary>Hint</summary>

   $\rho_M/\rho_R\propto a$; Choudhuri (10.52): $2.3\times10^4\Omega_Mh^2$.

   </details>

3. CMB temperature at equality in K. *[K]*

   <details><summary>Hint</summary>

   $T\propto1+z$: about $10^4$ K ($\approx0.8$ eV).

   </details>

## 🔢 Calculation: The far future: a Λ-dominated universe

When matter has thinned out, only $\rho_\Lambda=0.7\rho_{c,0}$ is left. Then $H_\Lambda=\sqrt{8\pi G\rho_\Lambda/3}=\sqrt{0.7}\,H_0$. Take $H_0=70$ km/s/Mpc.

1. $H_\Lambda$ in km/s/Mpc. *[km/s/Mpc]*

   <details><summary>Hint</summary>

   $\sqrt{0.7}\times70$.

   </details>

2. Doubling time of the scale factor, $\ln2/H_\Lambda$, in Gyr. *[Gyr]*

   <details><summary>Hint</summary>

   $1/H$ in Gyr is $977.8/H[\mathrm{km/s/Mpc}]$.

   </details>

## 👹 Boss: the radiation-dominated universe (exam problem)

*Open Question 7 [Radiation era and BBN, 12 pt], HS25 winter session, 20 min.*

The early universe was hot, dense and dominated by radiation. Consider a spatially flat ($k=0$) universe containing only radiation.

(a) [4 pt] The energy density of radiation scales as $\rho\propto a^{-4}$. Starting from the Friedmann equation $(\dot a/a)^2=\frac{8\pi G}{3}\rho$, show that $a(t)\propto t^{1/2}$. Assume $a(0)=0$ at $t=0$.

(b) [4 pt] The energy density of blackbody radiation is related to the temperature by $\rho\propto T^4$. Using (a), show that $T(t)\propto t^{-1/2}$.

(c) [4 pt] Big Bang Nucleosynthesis took place when the universe had cooled to $T_{BBN}\approx10^9$ K. Assuming radiation domination throughout, and given $T\approx1.5\times10^{10}$ K at $t=1$ s, estimate the age $t_{BBN}$.

<details><summary>Key points of a full-marks solution</summary>

- (a) $\rho=\rho_0(a_0/a)^4\Rightarrow\dot a/a=C/a^2\Rightarrow a\,\dot a=C\Rightarrow a\,da=C\,dt\Rightarrow a^2=2Ct$ with $a(0)=0$; so $a\propto t^{1/2}$.
- (b) $T^4\propto\rho\propto a^{-4}\Rightarrow T\propto a^{-1}\propto t^{-1/2}$.
- (c) $T_{BBN}/T_{1s}=(t_{BBN}/1\,\text{s})^{-1/2}\Rightarrow t_{BBN}=1\,\text{s}\cdot(1.5\times10^{10}/10^9)^2=225$ s, about 4 minutes.

</details>

## 👹 Boss: the closed universe (exam problem)

*HS24 winter: Open Question 7 [12 pt], 25 min.*

For a matter-dominated closed universe, the solution of the Friedmann equation is $\frac{a}{a_0}=\frac{\Omega_{M,0}}{2(\Omega_{M,0}-1)}(1-\cos\eta)$, $H_0t=\frac{\Omega_{M,0}}{2(\Omega_{M,0}-1)^{3/2}}(\eta-\sin\eta)$, where $a_0$, $\Omega_{M,0}$ and $H_0$ are the scale factor, matter density parameter and Hubble parameter today, and $\eta$ is the conformal time.

(a) [4 pt] Describe in words the evolution of the closed universe. Sketch $a$ vs $t$. Mark the Big Bang, turnaround and Big Crunch, and give the corresponding values of $\eta$.

(b) [4 pt] Derive an expression for the total lifetime $t_{\rm univ}$ (Big Bang to Big Crunch) in terms of $H_0$ and $\Omega_{M,0}$.

(c) [4 pt] Assume that the universe is closed and expanding today. Derive an upper limit for $H_0$ using the fact that the current age of the Sun is $t_\odot$. Write this limit in terms of $\Omega_{M,0}$ and $t_\odot$.

<details><summary>Key points of a full-marks solution</summary>

- (a) Big Bang $a=0$ at $\eta=0$; expansion slows; maximum (turnaround) at $\eta=\pi$; contraction to the Big Crunch $a=0$ at $\eta=2\pi$. Sketch: symmetric arch (cycloid), labelled points.
- (b) $t_{\rm univ}=H_0^{-1}\frac{\Omega}{2(\Omega-1)^{3/2}}(2\pi-\sin2\pi)=\frac{\pi}{H_0}\frac{\Omega}{(\Omega-1)^{3/2}}$.
- (c) $t_{\rm ta}=\frac{\pi}{H_0}\frac{\Omega}{2(\Omega-1)^{3/2}}$; expanding today needs $t_\odot<t_0<t_{\rm ta}$, so $H_0<\frac{\pi}{t_\odot}\frac{\Omega}{2(\Omega-1)^{3/2}}$.

</details>
