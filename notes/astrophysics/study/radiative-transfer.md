# The Fog Chamber

*Astro Observatory Ship. Topics: specific intensity, radiative transfer equation, optical depth, source function, Kirchhoff law, LTE, grey atmosphere, limb darkening, opacity, photon diffusion.*

The ship's observation chamber is full of fog. How much starlight gets through depends on one number, the optical depth $\tau$, and on what the fog emits itself, the source function $S_\nu$. This is the language of every spectrum you will ever read, and every exam has multiple-choice questions on it.

**Sources:** Choudhuri_Textbook.pdf (Choudhuri Ch. 2.2 (radiative transfer, eqs. 2.2-2.19), 2.3 (LTE, Kirchhoff 2.26), 2.4 (grey atmosphere 2.62-2.70), 2.5-2.6 (Rosseland, Kramers 2.79, Thomson 2.85), 2.8 (photon diffusion), exercises 2.5, 2.7); Astro_I_2024_Winter_Session_with_Solutions.pdf (HS24 winter: MC 3, 4, 9); Astro_I_2025_Practice_Exam_with_Solutions.pdf (HS25 practice: MC 2, 3, 4); Astro_I_2024_Summer_Session_with_Solutions.pdf (HS24 summer: MC 3, 4); Astro_I_2025_Winter_Session_with_Solutions.pdf (HS25 winter: MC 3)

## 📖 What specific intensity is, and what is derived from it

The most complete description of a radiation field is the <b>specific intensity</b> $I_\nu(\mathbf r,\hat n)$: energy per time, per area perpendicular to the ray, per solid angle, per frequency (Choudhuri (2.2)):

$$dE_\nu=I_\nu\cos\theta\,dA\,dt\,d\Omega\,d\nu\qquad[I_\nu]=\mathrm{W\,m^{-2}\,Hz^{-1}\,sr^{-1}}$$

Everything else is an angular moment of $I_\nu$:

$$F_\nu=\oint I_\nu\cos\theta\,d\Omega,\qquad U_\nu=\frac1c\oint I_\nu\,d\Omega,\qquad P_\nu=\frac1c\oint I_\nu\cos^2\theta\,d\Omega$$  
*Flux, energy density, radiation pressure.*

For isotropic radiation: $F_\nu=0$ (as much goes up as down), $U_\nu=4\pi I_\nu/c$ and $P_\nu=U_\nu/3$. Inside a star the field is <i>almost</i> isotropic; the tiny anisotropy carries the whole luminosity.

💡 **Intuition.** $I_\nu$ is <b>surface brightness</b>. Flux is "how much light lands on my detector"; intensity is "how bright does the surface look". Walk away from a street lamp: the flux drops as $d^{-2}$ but the lamp's surface looks just as bright, it only gets smaller. In vacuum $dI_\nu/ds=0$.

⚠️ **Pitfall.** Units are a favourite MC: $I_\nu$ has sr$^{-1}$ and Hz$^{-1}$; $F_\nu$ has Hz$^{-1}$ but no sr$^{-1}$; $F$ (bolometric) has neither. 1 Jy $=10^{-26}$ W m$^{-2}$ Hz$^{-1}$ is a unit of $F_\nu$; MJy/sr is a unit of $I_\nu$.

### Check yourself

**1.** In empty space $I_\nu$ is constant along a ray because

- A) the energy density is conserved
- B) both the received flux and the solid angle of the source fall as the inverse square of distance
- C) the radiation field is isotropic
- D) the flux averaged over directions is zero

<details><summary>Answer</summary>

**B**. Ratio of two quantities that both scale as $d^{-2}$. *(HS25 winter: MC 3)*

</details>

**2.** For an isotropic radiation field the radiation pressure is

- A) $U$
- B) $U/3$
- C) $U/2$
- D) 0

<details><summary>Answer</summary>

**B**. $\langle\cos^2\theta\rangle=1/3$ over the sphere.

</details>

## 📖 The transfer equation, optical depth and the source function

Along a ray through matter, emission adds intensity and absorption removes a fraction proportional to what is there:

$$\frac{dI_\nu}{ds}=j_\nu-\alpha_\nu I_\nu$$  
*Radiative transfer equation (2.12). jν: emission coefficient, αν: absorption coefficient [m⁻¹].*

Measure path length in units of the mean free path, $d\tau_\nu=\alpha_\nu ds$, and define the source function $S_\nu=j_\nu/\alpha_\nu$. Then

$$\frac{dI_\nu}{d\tau_\nu}=-I_\nu+S_\nu\quad\Rightarrow\quad I_\nu(\tau_\nu)=I_\nu(0)\,e^{-\tau_\nu}+S_\nu\left(1-e^{-\tau_\nu}\right)\ \ (S_\nu\ \text{const.})$$

💡 **Intuition.** Read the solution as a tug of war: the background $I_\nu(0)$ is extinguished by $e^{-\tau}$, and the medium "pulls" the intensity towards its own $S_\nu$. Optically <b>thick</b> ($\tau\gg1$): you see $I_\nu\to S_\nu$, only the surface layer ($\tau\lesssim1$), nothing behind. Optically <b>thin</b> ($\tau\ll1$): $I_\nu\approx I_\nu(0)+S_\nu\tau_\nu$, every atom along the line of sight contributes.

The opacity $\chi$ (per mass, m$^2$/kg) relates to the absorption coefficient by $\alpha=\chi\rho$. So $\tau=\int\chi\rho\,ds$: what matters is the <b>column</b> $\int\rho\,ds$, not the density or length separately.

⚠️ **Pitfall.** Do not mix the thick/thin limits up: thick $\Rightarrow I\simeq S$ (independent of $\tau$); thin $\Rightarrow I\simeq S\tau$. And emission lines vs absorption lines: looking at a hot background through a cooler layer ($S<I(0)$) gives absorption lines; a hot thin gas against a dark sky gives emission lines.

📝 **How the exam asks it.** HS24 winter MC4 (thick/thin limits), HS24 summer MC3 (two clouds, compare $\tau$), HS25 practice MC3 (an optically thick cloud can only be studied at its surface).

### Check yourself

**1.** For matter with constant properties, the relation between $I_\nu$ and $S_\nu$ is

- A) $I\simeq S$ if thick, $I\simeq S\tau$ if thin
- B) $I\simeq S$ if thin, $I\simeq S\tau$ if thick
- C) $I\simeq S$ always
- D) $I\simeq Se^{-\tau}$ always

<details><summary>Answer</summary>

**A**. $I=S(1-e^{-\tau})$; expand for small $\tau$. *(HS24 winter: MC 4)*

</details>

**2.** Cloud 1: density $\rho_0$, diameter $D$. Cloud 2: $2\rho_0$, $D/2$. Same opacity. Through the centre,

- A) $\tau_1=\tau_2$
- B) $\tau_1=\tau_2/2$
- C) $\tau_1=2\tau_2$
- D) $\tau_1=4\tau_2$

<details><summary>Answer</summary>

**A**. $\tau=\chi\rho L$ is the same column. *(HS24 summer: MC 3)*

</details>

**3.** A dust cloud with very large optical depth at the observed frequency can be studied

- A) not at all
- B) only in its core
- C) without any effect of the optical depth
- D) only at its surface

<details><summary>Answer</summary>

**D**. We see down to $\tau\sim1$. *(HS25 practice: MC 3)*

</details>

## 📖 Thermodynamic equilibrium, LTE and Kirchhoff (intuition)

In full thermodynamic equilibrium four laws hold at one temperature $T$: Maxwell velocities, Boltzmann level populations $n_2/n_1\propto e^{-\Delta E/k_BT}$, Saha ionisation, and Planck radiation. A star is not in global equilibrium (it is hot inside, cool outside), but if particles and photons travel only a short distance (mean free path $l$) compared with the scale $L$ over which $T$ changes, each small region has its own well-defined $T$: <b>local thermodynamic equilibrium</b> (LTE).

$$\text{LTE:}\quad l\ll L,\qquad S_\nu=\frac{j_\nu}{\alpha_\nu}=B_\nu(T)\quad\text{(Kirchhoff's law (2.26))}$$

💡 **Intuition.** Kirchhoff says good absorbers are good emitters. If a gas in LTE absorbs strongly at a line frequency, it emits strongly there too, in exactly the ratio that would keep a blackbody field in balance.

⚠️ **Pitfall.** Kirchhoff's law does not hold for scattering (Thomson scattering redirects photons, it does not thermally emit them). In the exam: "local but not global equilibrium" = variables depend on position and/or time AND $l\ll L$.

🖼️ **Picture it.** Saha equation (2.29): $\frac{x^2}{1-x}=\frac{(2\pi m_e)^{3/2}(k_BT)^{5/2}}{h^3P}e^{-\chi/k_BT}$. Plotting the ionised fraction $x$ against $T$ for hydrogen gives a steep S-curve whose position depends on density (pressure). At a stellar-photosphere density ($\rho\sim10^{-4}$ kg m$^{-3}$) hydrogen is half ionised at about $13\,500$ K, i.e. at $k_BT\approx\chi/11$, far below $\chi=13.6$ eV: there are so many more free states (phase space) than bound ones that ionisation wins long before typical photons carry 13.6 eV. (Checked numerically with (2.29); at the higher density of air, half ionisation needs ~$44\,000$ K.) The same argument explains why cosmic recombination happens at only ~3000 K.

### Check yourself

**1.** A system of size $L$ with mean free path $l$ is in local but not global thermal equilibrium if $T$ and $P$

- A) are constant and $l\gg L$
- B) are constant and $l\ll L$
- C) depend on time and/or position and $l\gg L$
- D) depend on time and/or position and $l\ll L$

<details><summary>Answer</summary>

**D**. Local: frequent collisions ($l\ll L$). Not global: gradients exist. *(HS24 winter: MC 3)*

</details>

## 📖 Stellar atmospheres: why the Sun has a sharp edge and a dark limb

In a plane-parallel atmosphere we measure depth by the vertical optical depth $\tau$ (zero at the top, growing inwards) and directions by $\mu=\cos\theta$. For a grey atmosphere ($\alpha$ independent of $\nu$) with constant flux $F$ and the <b>Eddington approximation</b> $P=U/3$ everywhere, Choudhuri derives

$$S(\tau)=\frac{3F}{4\pi}\left(\tau+\frac23\right),\qquad T^4=\frac34T_{\rm eff}^4\left(\tau+\frac23\right)$$  
*(2.68)-(2.69): the temperature equals T_eff at τ = 2/3.*

$$\frac{I(0,\mu)}{I(0,1)}=\frac35\left(\mu+\frac23\right)$$  
*(2.70) limb-darkening law: at the limb (μ = 0) the intensity is 40 % of the disk centre.*

💡 **Intuition.** You can see about one optical depth into any gas. At the disk centre your line of sight goes straight down and reaches $\tau=1$ deep, where it is hot. Near the limb you look in obliquely and reach $\tau=1$ (vertical depth $\mu$) much higher up, where it is cooler: the limb is darker and redder. The "surface" of the Sun is just the layer where $\tau\approx2/3$; because opacity rises steeply with depth this layer is only a few hundred km thick, so the edge looks sharp.

Spectral lines: at a line frequency $\alpha_\nu$ is larger, so $\tau_\nu=1$ is reached higher up, where it is cooler, and $S_\nu=B_\nu(T)$ is smaller: an absorption line. The <b>equivalent width</b> $W$ (the width of a rectangle of zero intensity with the same area as the line) measures line strength. The <b>curve of growth</b> is $W$ against the column density of absorbers: linear when the line is thin, then saturating (flat), then $\propto\sqrt N$ when the damping wings take over.

⚠️ **Pitfall.** The curve of growth relates <b>equivalent width</b> and <b>column density</b> (HS24 winter MC9), not perturbation amplitude vs time, not AGN mass vs luminosity.

### Check yourself

**1.** The "curve of growth" relates

- A) the equivalent width of a line and the column density of absorbers
- B) perturbation amplitude and time
- C) Einstein coefficients and the level spacing
- D) AGN luminosity and black-hole mass

<details><summary>Answer</summary>

**A**. Used to measure abundances from absorption lines. *(HS24 winter: MC 9)*

</details>

**2.** In the Eddington grey atmosphere, the temperature equals $T_{\rm eff}$ at optical depth

- A) 0
- B) 1/3
- C) 2/3
- D) 1

<details><summary>Answer</summary>

**C**. $T^4=\frac34T_{\rm eff}^4(\tau+\frac23)$.

</details>

## 📖 Energy transport in the interior: diffusion, opacity, convection

Deep inside a star the radiation field is nearly isotropic and the flux is driven by the gradient of radiation pressure, $F=-\frac{c}{\alpha}\frac{dP_{\rm rad}}{dr}$ (with $\alpha=\chi\rho$, $\chi$ the Rosseland mean opacity). With $P_{\rm rad}=\frac13a_BT^4$ and $F=L_r/4\pi r^2$:

$$\frac{dT}{dr}=-\frac{3}{4a_Bc}\,\frac{\chi\rho}{T^3}\,\frac{L_r}{4\pi r^2}$$  
*Radiative temperature gradient (as given in the HS25 practice exam Q2c).*

Opacity laws you need: electron (Thomson) scattering, $\chi_T=n_e\sigma_T/\rho=\sigma_T/m_H=0.04$ m$^2$/kg for ionised hydrogen, independent of $T$ and $\rho$; bound-free and free-free absorption follow <b>Kramers' law</b> $\chi\propto\rho\,T^{-3.5}$.

💡 **Intuition.** A photon in the Sun travels only ~1 cm before it is absorbed and re-emitted in a random direction. After $N$ steps of length $l$ it has moved $\sqrt N\,l$. To get out ($R_\odot=7\times10^8$ m) it needs $N=(R/l)^2\sim10^{22}$ steps: a path of $10^{20}$ m, i.e. $10^4$ years or more of travel for a trip light would do in 2 s in vacuum.

When the radiative gradient becomes too steep (high opacity, or huge energy generation in a small core), a rising blob of gas stays hotter and lighter than its surroundings and keeps rising: <b>convection</b>. The Schwarzschild criterion for stability against convection is

$$\left|\frac{dT}{dr}\right|<\left(1-\frac1\gamma\right)\frac TP\left|\frac{dP}{dr}\right|$$  
*Stable (no convection) when the actual temperature gradient is shallower than the adiabatic one.*

⚠️ **Pitfall.** The Schwarzschild condition as written in the exam ($dT/dr<(1-1/\gamma)(T/P)\,dP/dr$ written with magnitudes of the gradients, HS25 practice MC4) describes material that is <b>stable</b> against convection: energy is then carried by radiation. The Sun is radiative inside $0.7R_\odot$ and convective outside.

### Check yourself

**1.** When the Schwarzschild criterion holds, the stellar material is

- A) stable against convection
- B) unable to transport energy radiatively
- C) stable to conduction
- D) efficiently convective

<details><summary>Answer</summary>

**A**. The criterion is the condition for convective stability. *(HS25 practice: MC 4)*

</details>

**2.** Kramers' opacity scales as

- A) $\rho T^{-3.5}$
- B) $\rho^{-1}T^{3.5}$
- C) independent of $\rho$ and $T$
- D) $T^4$

<details><summary>Answer</summary>

**A**. Bound-free and free-free absorption; Thomson scattering is the constant one.

</details>

## ❓ Quiz: Fog Chamber multiple choice

*Exam-style multiple choice (3 pt each in the real exam).*

**1.** The specific intensity of a source seen by an observer at a large distance $R$ (no matter in between)

- A) is independent of $R$
- B) decreases linearly with $R$
- C) increases linearly with $R$
- D) decreases as $1/R^2$

<details><summary>Answer</summary>

**A**. $I_{\nu1}dA_1d\Omega_1=I_{\nu2}dA_2d\Omega_2$ with $d\Omega=dA/R^2$. *(HS25 practice: MC 2)*

</details>

**2.** For radiative transfer through matter with constant properties and optical depth $\tau_\nu$,

- A) $I\simeq S$ thick, $I\simeq S\tau$ thin
- B) $I\simeq S$ thin, $I\simeq S\tau$ thick
- C) $I\simeq S$ always
- D) $I\simeq Se^{-\tau}$ always

<details><summary>Answer</summary>

**A**. $I=S(1-e^{-\tau})$. *(HS24 winter: MC 4)*

</details>

**3.** Which unit is <b>wrong</b>?

- A) $I_\nu$: W m$^{-2}$ sr$^{-1}$ Hz$^{-1}$
- B) $F_\nu$: W m$^{-2}$
- C) $j_\nu$: W m$^{-3}$ sr$^{-1}$ Hz$^{-1}$
- D) none

<details><summary>Answer</summary>

**B**. $F_\nu$ is per Hz. *(HS24 summer: MC 4)*

</details>

**4.** Thomson scattering opacity of fully ionised hydrogen is about

- A) $4\times10^{-2}$ m$^2$/kg
- B) $4\times10^{-29}$ m$^2$/kg
- C) $40$ m$^2$/kg
- D) $4\times10^{-5}$ m$^2$/kg

<details><summary>Answer</summary>

**A**. $\sigma_T/m_H=6.65\times10^{-29}/1.67\times10^{-27}=0.040$ m$^2$/kg (Choudhuri (2.85)).

</details>

**5.** Limb darkening of the Sun is observed because near the limb we see

- A) higher, cooler layers
- B) deeper, hotter layers
- C) more sunspots
- D) Thomson-scattered light

<details><summary>Answer</summary>

**A**. An oblique line of sight reaches $\tau\sim1$ at smaller vertical depth.

</details>

**6.** A photon random-walks with step $l$. After $N$ steps its typical distance from the start is

- A) $Nl$
- B) $\sqrt N\,l$
- C) $l$
- D) $N^2l$

<details><summary>Answer</summary>

**B**. $\langle L^2\rangle=Nl^2$ (cross terms average to zero), Choudhuri (2.92).

</details>

## ✍️ Derivation: Formal solution of the transfer equation

*Choudhuri §2.2.3, eqs. (2.17)-(2.21)*

**Goal:** Solve $dI_\nu/d\tau_\nu=-I_\nu+S_\nu$ for constant $S_\nu$ and discuss the optically thick and thin limits.

**Given:** $d\tau_\nu=\alpha_\nu ds$; $S_\nu=j_\nu/\alpha_\nu$

1. Multiply by an integrating factor.

   <details><summary>Reveal</summary>

   $\frac{d}{d\tau}(I e^{\tau})=S e^{\tau}$.

   </details>

2. Integrate from 0 to τ.

   <details><summary>Reveal</summary>

   $I(\tau)e^{\tau}-I(0)=S(e^{\tau}-1)$, so $I(\tau)=I(0)e^{-\tau}+S(1-e^{-\tau})$.

   </details>

3. Limits.

   <details><summary>Reveal</summary>

   $\tau\gg1$: $I\to S$, the background is invisible. $\tau\ll1$: $I\simeq I(0)(1-\tau)+S\tau$; with no background $I\simeq S\tau=j_\nu L$: every emitter counts.

   </details>

**Full marks needs:** integrating factor $e^\tau$ · correct boundary term · both limits with interpretation

## ✍️ Derivation: A glowing gas cloud seen thin and thick (Choudhuri exercise 2.5)

*Choudhuri exercise 2.5*

**Goal:** A distant spherical cloud of radius $R$ has uniform temperature $T$. How does its brightness depend on the projected distance $b$ from its centre if (a) it is optically thin, (b) optically thick?

**Given:** LTE: $S_\nu=B_\nu(T)$

1. Path length through the cloud at impact parameter b.

   <details><summary>Reveal</summary>

   $L(b)=2\sqrt{R^2-b^2}$.

   </details>

2. Optically thin case.

   <details><summary>Reveal</summary>

   $I_\nu\simeq S_\nu\tau_\nu=B_\nu(T)\,\alpha_\nu\,2\sqrt{R^2-b^2}$: brightest at the centre, falling to zero at the edge (limb-darkened disc, like a ball of glowing fog).

   </details>

3. Optically thick case.

   <details><summary>Reveal</summary>

   $I_\nu=B_\nu(T)$ independent of $b$: a uniformly bright disc with a sharp edge, like a star without temperature gradient. Its effective temperature is $T$.

   </details>

**Full marks needs:** chord length $2\sqrt{R^2-b^2}$ · thin: $I\propto$ path length · thick: uniform $B_\nu(T)$

## 🔢 Calculation: Looking through a foggy cloud

A background source of intensity $I_0$ is seen through a uniform cloud with source function $S=0.3\,I_0$ and optical depth $\tau=2$.

1. Fraction of the background that is transmitted, $e^{-\tau}$. *[dimensionless]*

   <details><summary>Hint</summary>

   At $\tau=1$ only 37 % gets through; at $\tau=2$ about 14 %.

   </details>

2. Observed intensity in units of $I_0$. *[I_0]*

   <details><summary>Hint</summary>

   $I=I_0e^{-\tau}+S(1-e^{-\tau})$. Since $S<I_0$, the cloud darkens the source (absorption).

   </details>

3. Same cloud made very thick ($\tau\to\infty$): intensity in units of $I_0$. *[I_0]*

   <details><summary>Hint</summary>

   Thick: $I\to S$.

   </details>

## 🔢 Calculation: Why air would be opaque if it were ionised (Choudhuri ex. 2.7)

Fully ionised hydrogen with the density of air, $\rho=1.29$ kg m$^{-3}$. Light is attenuated only by Thomson scattering ($\sigma_T=6.652\times10^{-29}$ m$^2$).

1. Electron density $n_e=\rho/m_p$ in m$^{-3}$ (enter e.g. 7.7e26). *[m^-3]*

   <details><summary>Hint</summary>

   One electron per proton.

   </details>

2. Absorption coefficient $\alpha=n_e\sigma_T$ in m$^{-1}$. *[m^-1]*

   <details><summary>Hint</summary>

   Dimension check: m$^{-3}\cdot$m$^2$.

   </details>

3. Path length over which the intensity halves, in m. *[m]*

   <details><summary>Hint</summary>

   $e^{-\alpha L}=1/2\Rightarrow L=\ln2/\alpha\approx14$ m. This is why the Universe became transparent only when electrons were locked into atoms (recombination).

   </details>

## 🔢 Calculation: Grey atmosphere of the Sun

Use the Eddington grey atmosphere: $T^4=\frac34T_{\rm eff}^4(\tau+\frac23)$ and $I(0,\mu)/I(0,1)=\frac35(\mu+\frac23)$, with $T_{\rm eff}=5772$ K.

1. Temperature at the very top, $\tau=0$, in K. *[K]*

   <details><summary>Hint</summary>

   $T(0)=2^{-1/4}T_{\rm eff}=0.84\,T_{\rm eff}$.

   </details>

2. Temperature at $\tau=1$, in K. *[K]*

   <details><summary>Hint</summary>

   $(\frac34\cdot\frac53)^{1/4}=1.057$.

   </details>

3. Intensity at $\mu=0.5$ (60° from disk centre) relative to the centre. *[dimensionless]*

   <details><summary>Hint</summary>

   $\frac35(0.5+0.667)=0.70$.

   </details>

## 🔢 Quick fight: Quick fight: how old is sunlight?

Photons random-walk out of the Sun with mean free path $l=1/(\chi\rho)$, $\chi\approx0.1$ m$^2$/kg and $\rho\approx10^3$ kg m$^{-3}$ (Choudhuri §2.8). Estimate the escape time in years (within a factor of about 1.3).

1. Diffusion time in years. *[yr]*

   <details><summary>Hint</summary>

   $l=1$ cm, $N=(R/l)^2$, path $Nl=R^2/l$, time $R^2/(lc)\approx5\times10^3$ yr (Choudhuri rounds to $10^4$ yr).

   </details>
