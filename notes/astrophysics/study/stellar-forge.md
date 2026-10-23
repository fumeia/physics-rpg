# The Stellar Forge

*Astro Observatory Ship. Topics: hydrostatic equilibrium, Eddington luminosity, main-sequence scaling, virial theorem, tidal disruption.*

Gravity pulls in, pressure pushes out. In the forge you balance the two, find out why stars cannot grow beyond a few hundred solar masses, and use the virial theorem on everything from clusters to galaxies.

**Sources:** Astro_I_2024_Summer_Session_with_Solutions.pdf (Open Q3 (hydrostatic equilibrium, Eddington), Q5 (virial theorem), Q6 (tidal disruption)); Astro_I_2025_Winter_Session_with_Solutions.pdf (MC 5, 6, 10 (lifetime scaling, upper mass limit, virial)); Choudhuri_Textbook.pdf (Ch. 3.2 (hydrostatic equilibrium, virial theorem), Ch. 3.6.1 (Eddington), Ch. 7.2); 02-stars-and-virial.md (transcription, formulas and checks); Astro_I_2024_Winter_Session_with_Solutions.pdf (HS24 winter: open Q1, MC 5, 10); Astro_I_2025_Practice_Exam_with_Solutions.pdf (HS25 practice: open Q2, Q3, Q5; MC 4-5); Choudhuri_Textbook.pdf (Choudhuri Ch. 3.2-3.6)

## 📖 Hydrostatic equilibrium: weighing the inside of the Sun

A star is a self-gravitating ball of gas. Take a thin shell of area $dA$ and thickness $dr$ at radius $r$. The pressure below pushes up with $P(r)dA$, the pressure above pushes down with $P(r+dr)dA$, and gravity pulls the shell's mass $\rho\,dA\,dr$ inwards with $GM_r/r^2$. Balance gives the first two structure equations:

$$\frac{dM_r}{dr}=4\pi r^2\rho,\qquad\frac{dP}{dr}=-\frac{GM_r\rho}{r^2}$$  
*Mass continuity (3.1) and hydrostatic equilibrium (3.2). Boundary conditions: M_r(0) = 0, P(R) = 0.*

Order-of-magnitude use (Choudhuri's favourite tool): replace $dP/dr$ by $-P_c/R$ and $M_r$, $r$ by $M/2$, $R/2$. Then $P_c\approx GM^2/(R^4)\times\frac{3}{2\pi}\approx6\times10^{14}$ Pa for the Sun. With the ideal gas $P=\frac{\rho k_BT}{\mu m_H}$ ($\mu=1/2$ for ionised hydrogen: one proton plus one electron per $m_H$) you get $T_c\approx10^7$ K.

$$P=\frac{k_B}{\mu m_H}\rho T,\qquad\mu=\left(2X+\tfrac34Y+\tfrac12Z\right)^{-1}$$  
*Ideal gas with mean molecular weight (3.23)-(3.24). X, Y, Z: mass fractions of H, He, metals.*

💡 **Intuition.** Every layer must carry the weight of everything above it. That is why pressure (and with an ideal gas, temperature) must rise steeply towards the centre, and why the centre of the Sun is hot enough for fusion: gravity, not fusion, sets the central temperature. Fusion only keeps it there.

⚠️ **Pitfall.** Sign: $dP/dr<0$. When you integrate "from $r$ to $R$" (HS24 winter Q1), $P(R)-P(r)=-\int_r^R\frac{GM_{r'}\rho}{r'^2}dr'$ and $P(R)=0$, so $P(r)$ comes out positive. Write the boundary condition explicitly: it is a grading point.

📝 **How the exam asks it.** HS24 summer Q3a (derive the equation from a volume element, 4 pt), HS24 winter Q1 (constant-density star: $P(r)$, $T(r)$), HS25 practice Q2 (scaling $P\propto M^2/R^4$).

### Check yourself

**1.** For fully ionised hydrogen the mean molecular weight $\mu$ is

- A) 1
- B) 1/2
- C) 2
- D) 4/3

<details><summary>Answer</summary>

**B**. $X=1$: $\mu=1/2$, two particles per $m_H$.

</details>

**2.** Replacing $dP/dr\to-P_c/R$, $M_r\to M$, $r\to R$, $\rho\to M/R^3$ gives

- A) $P_c\propto M^2/R^4$
- B) $P_c\propto M/R^2$
- C) $P_c\propto M^2/R^2$
- D) $P_c\propto M/R^4$

<details><summary>Answer</summary>

**A**. $P/R\sim(M/R^2)(M/R^3)$. *(HS25 practice: open Q2a)*

</details>

## 📖 The virial theorem: stars have negative heat capacity (intuition)

Multiply hydrostatic equilibrium by $4\pi r^3$ and integrate over the star (by parts). The left side becomes $-3\int P\,dV$, which for an ideal monatomic gas is $-2E_T$ (thermal energy); the right side is the gravitational energy $E_G$:

$$2E_T+E_G=0,\qquad E=E_T+E_G=\tfrac12E_G=-E_T<0$$  
*Virial theorem for a star in equilibrium (3.10)-(3.12). Same form 2K + V = 0 for stellar systems.*

💡 **Intuition.** A star that radiates energy away (E decreases) must <b>contract and heat up</b>: $E_T=-E$ grows. Half of the released gravitational energy heats the gas, the other half is radiated. This is the engine that heats a protostar until fusion ignites, and that re-heats a core when it runs out of fuel. Stars act like a thermostat: if fusion runs too fast, the core expands and cools, slowing it.

$$|E_G|\approx\frac{GM^2}{R}\approx4\times10^{41}\,\mathrm J,\qquad\tau_{KH}\approx\frac{|E_G|}{2L}\approx10^7\,\mathrm{yr}$$  
*Kelvin–Helmholtz time (3.13)-(3.14): how long the Sun could shine by contraction alone. Too short for geology: hence nuclear energy.*

⚠️ **Pitfall.** Total energy in virial equilibrium is $E=\frac12\bar V$ (negative), or equivalently $E=-\bar K$. Not $2K$, not $K/2$ (HS24 winter MC10). For a uniform sphere $E_G=-\frac35GM^2/R$; order-of-magnitude estimates may drop the 3/5 (HS25 practice Q3 uses $GM^2/2R$).

📝 **How the exam asks it.** HS25 practice Q3: thermal energy of the Sun ($\frac32Nk_BT$ with $N=2M/m_p$, $T=10^7$ K) is of the same order as $GM^2/2R$: both $\sim10^{41}$ J.

### Check yourself

**1.** For a self-gravitating system in steady state, the total energy is

- A) $\bar E=2\bar K$
- B) $\bar E=\frac12\bar K$
- C) $\bar E=2\bar V$
- D) $\bar E=\frac12\bar V$

<details><summary>Answer</summary>

**D**. $2\bar K+\bar V=0\Rightarrow\bar E=\bar K+\bar V=\frac12\bar V$. *(HS24 winter: MC 10)*

</details>

**2.** A star without nuclear burning loses energy by radiation. Its interior

- A) cools and expands
- B) heats up and contracts
- C) stays at the same temperature
- D) cools and contracts

<details><summary>Answer</summary>

**B**. $E_T=-E$ increases as $E$ decreases.

</details>

## 📖 Four equations, and the scaling laws that follow

$$\frac{dM_r}{dr}=4\pi r^2\rho,\quad\frac{dP}{dr}=-\frac{GM_r\rho}{r^2},\quad\frac{dL_r}{dr}=4\pi r^2\rho\varepsilon,\quad\frac{dT}{dr}=-\frac{3\chi\rho}{4a_BcT^3}\frac{L_r}{4\pi r^2}$$  
*The four stellar structure equations (3.25)-(3.28), with ε the nuclear energy release per mass and time. In convective zones the last one is replaced by the adiabatic gradient.*

Choudhuri's "drastic" scaling (§3.4): replace every derivative $d/dr$ by $1/R$, $M_r$ by $M$, $\rho$ by $M/R^3$, assume constant opacity.

$$P\propto\frac{M^2}{R^4},\quad P\propto\rho T\Rightarrow T\propto\frac MR,\quad\frac TR\propto\frac{\rho L}{T^3R^2}\Rightarrow L\propto\frac{(TR)^4}{M}\propto M^3$$  
*Mass–luminosity relation (3.37).*

$$L=4\pi R^2\sigma T_{\rm eff}^4\ \Rightarrow\ M\propto T^2,\quad L\propto T_{\rm eff}^6,\quad R\propto M^{1/2},\quad\tau_{MS}\propto\frac ML\propto M^{-2}$$  
*Main-sequence scalings used in Refregier's exams.*

💡 **Intuition.** Notice that the luminosity of a star does <b>not</b> depend on how fusion works: it is set by how fast radiation can leak out ($L\propto M^3/\chi$). Fusion adjusts itself (via the virial thermostat) to supply exactly that. Massive stars are hugely more luminous and burn through their fuel much faster: a $10M_\odot$ star lives ~100 times shorter than the Sun.

⚠️ **Pitfall.** These are scalings, not equations: never put numbers into $L\propto M^3$ without a reference star ($L/L_\odot=(M/M_\odot)^3$). Real stars have $L\propto M^{3-4}$; the exam uses 3. Lifetime ratio for masses differing by 4: $4^2=16$ (HS25 winter MC5), not 4 or 64.

### Check yourself

**1.** Two main-sequence stars differ in mass by a factor of 4. The lower-mass star lives longer by about

- A) 4
- B) 8
- C) 16
- D) 64

<details><summary>Answer</summary>

**C**. $\tau\propto M^{-2}$. *(HS25 winter: MC 5)*

</details>

**2.** A star more massive than the Sun is, on the main sequence,

- A) less luminous, hotter, shorter-lived
- B) more luminous, hotter, shorter-lived
- C) more luminous, cooler, shorter-lived
- D) more luminous, hotter, longer-lived

<details><summary>Answer</summary>

**B**. $L\propto M^3$, $T\propto M^{1/2}$, $\tau\propto M^{-2}$. *(HS24 summer: MC 5)*

</details>

## 📖 Reading the HR diagram (intuition)

🖼️ **Picture it.** The HR diagram plots luminosity (up) against effective temperature, which increases to the <b>left</b> (historical: spectral type O B A F G K M runs left to right). About 90 % of stars sit on the <b>main sequence</b>, a diagonal band from hot luminous O stars (top left, $\sim40\,000$ K, $10^5L_\odot$) to cool faint M dwarfs (bottom right, $\sim3000$ K, $10^{-3}L_\odot$). Red giants and supergiants lie top right (cool but huge), white dwarfs bottom left (hot but tiny). Lines of constant radius run diagonally, because $L\propto R^2T^4$.

Spectral classes are a temperature sequence read from absorption lines: O (ionised He), B (neutral He), A (strongest Balmer lines, ~10 000 K), F, G (Sun, 5800 K, Ca II), K, M (molecular TiO bands). The Balmer lines peak at A because hydrogen must be excited to $n=2$ (needs hot) but not ionised (Saha). Mnemonic: "Oh Be A Fine Girl/Guy, Kiss Me".

💡 **Intuition.** The main sequence is not an evolutionary track: it is a <b>mass sequence</b>. Stars sit there for most of their life burning hydrogen in the core; where they sit is fixed by mass. When the core hydrogen runs out the core contracts and heats, the envelope expands enormously: the star moves up and right to become a red giant (cooler surface, larger, more luminous).

Star clusters: all stars have the same age and distance. The most massive stars leave the main sequence first, so the <b>turn-off point</b> moves down the main sequence with time: its mass tells the cluster's age ($\tau\propto M^{-2}$). Globular clusters have turn-offs below $1M_\odot$: ages above 10 Gyr.

⚠️ **Pitfall.** "Red giant" means lower $T_{\rm eff}$ AND higher $L$ (HS24 winter MC5): the radius grows by a factor ~100. Mass is (nearly) unchanged.

### Check yourself

**1.** When a star leaves the main sequence to become a red giant it becomes

- A) less massive and hotter
- B) cooler and less luminous
- C) cooler and more luminous
- D) cooler and smaller

<details><summary>Answer</summary>

**C**. Up and to the right in the HR diagram. *(HS24 winter: MC 5)*

</details>

**2.** The upper mass limit of main-sequence stars is due to

- A) the small optical depth of the interior
- B) hydrogen depletion in the core
- C) cosmic rays
- D) radiation pressure overcoming gravity

<details><summary>Answer</summary>

**D**. Eddington limit: $L\propto M^3$ grows faster than $L_{Edd}\propto M$. *(HS25 winter: MC 6)*

</details>

## ❓ Quiz: Stellar Forge multiple choice

*Exam-style multiple choice (3 pt each in the real exam).*

**1.** Two main-sequence stars differ in mass by a factor 4. Lifetime ratio?

- A) 4
- B) 8
- C) 16
- D) 64

<details><summary>Answer</summary>

**C**. $\tau\propto M^{-2}$. *(HS25 winter: MC 5)*

</details>

**2.** The upper mass limit of main-sequence stars comes from

- A) small optical depth
- B) hydrogen depletion
- C) cosmic rays
- D) radiation pressure beating gravity

<details><summary>Answer</summary>

**D**. Eddington luminosity. *(HS25 winter: MC 6)*

</details>

**3.** A main-sequence star more massive than the Sun is

- A) less luminous, hotter, shorter-lived
- B) more luminous, hotter, shorter-lived
- C) more luminous, cooler, shorter-lived
- D) more luminous, hotter, longer-lived

<details><summary>Answer</summary>

**B**. $L\propto M^3$, $M\propto T^2$, $\tau\propto M^{-2}$. *(HS24 summer: MC 5)*

</details>

**4.** Leaving the main sequence for the red-giant branch, a star becomes

- A) less massive, hotter
- B) cooler, less luminous
- C) cooler, more luminous
- D) cooler, smaller

<details><summary>Answer</summary>

**C**. Envelope expands. *(HS24 winter: MC 5)*

</details>

**5.** For a virialised self-gravitating system the total energy is

- A) $2\bar K$
- B) $\bar K/2$
- C) $2\bar V$
- D) $\bar V/2$

<details><summary>Answer</summary>

**D**. $2\bar K+\bar V=0$. *(HS24 winter: MC 10)*

</details>

**6.** The Sun's spectral class is

- A) O
- B) B
- C) G
- D) M

<details><summary>Answer</summary>

**C**. G2V. *(HS25 practice: MC 5)*

</details>

**7.** The Kelvin–Helmholtz timescale of the Sun is about

- A) $10^3$ yr
- B) $10^7$ yr
- C) $10^{10}$ yr
- D) $10^{13}$ yr

<details><summary>Answer</summary>

**B**. $|E_G|/2L\approx4\times10^{41}/(8\times10^{26})$ s $\approx10^7$ yr (Choudhuri (3.13)).

</details>

## ✍️ Derivation: Mass–luminosity relation from three equations

*HS25 practice: open Q2 [10 pt]*

**Goal:** For a star in hydrostatic equilibrium with radiative transport and constant opacity, derive $L\propto M^3$ by scaling arguments.

**Given:** $\frac{dP}{dr}=-\frac{GM_r\rho}{r^2}$; $P\propto\rho T$; $\frac{dT}{dr}=-\frac{3}{4a_Bc}\frac{\chi\rho L_r}{T^3 4\pi r^2}$

1. (a) Hydrostatic equilibrium as a scaling relation for P.

   <details><summary>Reveal</summary>

   $\frac PR\propto\frac{M}{R^2}\frac{M}{R^3}\Rightarrow P\propto\frac{M^2}{R^4}$.

   </details>

2. (b) Ideal gas: temperature.

   <details><summary>Reveal</summary>

   $P\propto\rho T\propto\frac{M}{R^3}T\Rightarrow T\propto\frac{PR^3}{M}\propto\frac MR$.

   </details>

3. (c) Radiative transport: luminosity.

   <details><summary>Reveal</summary>

   $\frac TR\propto\frac{\rho L}{T^3R^2}\propto\frac{ML}{R^5T^3}\Rightarrow L\propto\frac{(TR)^4}{M}$.

   </details>

4. Combine.

   <details><summary>Reveal</summary>

   $TR\propto M\Rightarrow L\propto M^4/M=M^3$. The radius drops out.

   </details>

**Full marks needs:** $P\propto M^2/R^4$ · $T\propto M/R$ · $L\propto(TR)^4/M$ · $L\propto M^3$

## ✍️ Derivation: Virial theorem for N stars and the velocity dispersion

*HS25 practice: open Q5 [7 pt]; HS24 summer Q5 (harmonic radius version)*

**Goal:** For $N$ stars of mass $m$ (total $M$) with mean separation $\langle R\rangle$ in virial equilibrium, show $\langle v^2\rangle=GM/(2\langle R\rangle)$.

**Given:** $2\bar K+\bar V=0$

1. Kinetic energy.

   <details><summary>Reveal</summary>

   $\bar K=\frac12mN\langle v^2\rangle=\frac12M\langle v^2\rangle$.

   </details>

2. Potential energy: count the pairs.

   <details><summary>Reveal</summary>

   $N(N-1)/2$ pairs, each $-Gm^2/\langle R\rangle$: $\bar V\simeq-\frac{N^2}{2}\frac{Gm^2}{\langle R\rangle}=-\frac{GM^2}{2\langle R\rangle}$ for large $N$.

   </details>

3. Apply the virial theorem.

   <details><summary>Reveal</summary>

   $M\langle v^2\rangle=\frac{GM^2}{2\langle R\rangle}\Rightarrow\langle v^2\rangle=\frac{GM}{2\langle R\rangle}\propto\frac{Nm}{\langle R\rangle}$.

   </details>

**Full marks needs:** $\bar K=\frac12M\langle v^2\rangle$ · pair counting $N(N-1)/2$ · large-N limit · final result

## 🔢 Calculation: The Eddington limit and the upper mass of stars

Radiation pressure balances gravity at the surface when $L_{\rm Edd}=4\pi cGM/\chi$ (Refregier's result, hydrostatic equilibrium plus $F=-\frac{c}{\alpha}\frac{dP}{dr}$, $\alpha=\chi\rho$). For electron scattering $\chi=\sigma_T/m_p$. Use $L_\odot=3.828\times10^{26}$ W and a $10\,M_\odot$ star.

1. Electron-scattering opacity $\chi=\sigma_T/m_p$ in m$^2$/kg. *[m^2/kg]*

   <details><summary>Hint</summary>

   Thomson cross-section per proton mass (fully ionised hydrogen). Roughly $0.04$ m$^2$/kg.

   </details>

2. Eddington luminosity of the $10\,M_\odot$ star, in $L_\odot$. *[L_sun]*

   <details><summary>Hint</summary>

   $L_{\rm Edd}=4\pi cGM/\chi$. Divide by $L_\odot$ at the end. Rule of thumb: $3.3\times10^4\,L_\odot(M/M_\odot)$.

   </details>

3. Using $L=L_\odot(M/M_\odot)^3$, the mass at which $L=L_{\rm Edd}$: give $M$ in $M_\odot$. *[M_sun]*

   <details><summary>Hint</summary>

   $(M/M_\odot)^3=33000\,(M/M_\odot)\Rightarrow M^2=3.3\times10^4$. A crude upper mass limit of main-sequence stars.

   </details>

## 🔢 Quick fight: Burning bright, dying young

The Sun lives $\tau_\odot\approx10^{10}$ yr on the main sequence. With $\tau\propto M^{-2}$ (from $\tau\propto M/L$ and $L\propto M^3$), estimate the main-sequence lifetime of a $10\,M_\odot$ star in Myr (within a factor of 1.3).

1. Lifetime in Myr. *[Myr]*

   <details><summary>Hint</summary>

   Fuel $\propto M$, burn rate $\propto L\propto M^3$, so $\tau\propto M^{-2}$: a factor 100 shorter for $M=10$.

   </details>

## 🔢 Calculation: Virial velocity of a globular cluster

A virialised system of $N\gg1$ equal-mass particles has $K=\frac12M\sigma_v^2$ and $V\simeq-GM^2/(2r_H)$ with the harmonic radius $r_H^{-1}=\frac{2}{N(N-1)}\sum_{i>j}r_{ij}^{-1}$. The virial theorem is $2K+V=0$. Take a globular cluster with $M=10^5\,M_\odot$, $r_H=5$ pc.

1. From $2K+V=0$ the squared dispersion $\sigma_v^2=GM/(2r_H)$, in (m/s)$^2$. *[m^2/s^2]*

   <details><summary>Hint</summary>

   $2\cdot\frac12M\sigma^2=GM^2/(2r_H)\Rightarrow\sigma^2=GM/(2r_H)$. Convert $M_\odot$ and pc to SI.

   </details>

2. Velocity dispersion $\sigma_v$ in km/s. *[km/s]*

   <details><summary>Hint</summary>

   Square root, then divide by 1000.

   </details>

3. Crossing time $t=r_H/\sigma_v$ in Myr. *[Myr]*

   <details><summary>Hint</summary>

   About $0.75$ Myr; compare the age of $\sim10$ Gyr: the cluster has crossed itself thousands of times, hence virialised.

   </details>

## 🔢 Calculation: How close can the Milky Way get to a cD galaxy?

Tidal acceleration $a_{\rm tidal}\simeq2GMr/d^3$ (Taylor expansion of $GM/d^2-GM/(d+r)^2$). A small galaxy of mass $m$, radius $r$ is disrupted when $a_{\rm tidal}>Gm/r^2$. Milky Way: $m=10^{12}M_\odot$, $r=10$ kpc; cD galaxy $M=10^{14}M_\odot$.

1. Mass ratio factor $2M/m$. *[dimensionless]*

   <details><summary>Hint</summary>

   Both masses in $M_\odot$, so the ratio is just $200$.

   </details>

2. Disruption distance $d_{\rm limit}=(2M/m)^{1/3}r$ in kpc. *[kpc]*

   <details><summary>Hint</summary>

   Set $2GMr/d^3=Gm/r^2$, so $d^3=2Mr^3/m$.

   </details>

## 🔢 Calculation: Thermal versus gravitational energy of the Sun

Model the Sun as fully ionised hydrogen at $T\sim10^7$ K with thermal energy $\frac32k_BT$ per particle (HS25 practice Q3). Compare with $|U_V|\simeq GM_\odot^2/(2R_\odot)$ and $L_\odot=3.828\times10^{26}$ W.

1. Number of particles $N=2M_\odot/m_p$ (protons plus electrons). Enter e.g. 2.4e57. *[dimensionless]*

   <details><summary>Hint</summary>

   Each hydrogen atom gives two particles.

   </details>

2. Thermal energy in units of $10^{41}$ J. *[10^41 J]*

   <details><summary>Hint</summary>

   $\frac32Nk_BT\approx4.9\times10^{41}$ J.

   </details>

3. $GM_\odot^2/(2R_\odot)$ in units of $10^{41}$ J. *[10^41 J]*

   <details><summary>Hint</summary>

   $\approx1.9\times10^{41}$ J: same order, as the virial theorem demands.

   </details>

4. Kelvin–Helmholtz time $|U_V|/L_\odot$ in Myr. *[Myr]*

   <details><summary>Hint</summary>

   About 16 Myr: the Sun cannot be powered by contraction for 4.6 Gyr.

   </details>

## 🔢 Calculation: The nuclear timescale of the Sun

Hydrogen burning releases 0.7 % of the rest mass ($4m_p\to$ He). Only the inner ~10 % of the Sun's mass is hot enough to burn. Estimate the main-sequence lifetime $\tau=0.007\times0.1\,M_\odot c^2/L_\odot$.

1. Available nuclear energy in units of $10^{44}$ J. *[10^44 J]*

   <details><summary>Hint</summary>

   $0.0007\times1.99\times10^{30}\times(3\times10^8)^2$.

   </details>

2. Lifetime in Gyr. *[Gyr]*

   <details><summary>Hint</summary>

   About 10 Gyr: the Sun is middle-aged (4.6 Gyr).

   </details>

## 🔢 Calculation: Constant-density Sun: central temperature

For a constant-density star of fully ionised hydrogen, HS24 winter Q1 gives $T(r)=\frac{\pi}{3}\frac{m_HG\rho}{k_B}(R^2-r^2)$. Apply it to the Sun ($\rho=\bar\rho_\odot$, take $m_H=m_p$).

1. Mean density of the Sun in kg m$^{-3}$. *[kg m^-3]*

   <details><summary>Hint</summary>

   $M/(\frac43\pi R^3)\approx1410$ kg m$^{-3}$, like water.

   </details>

2. Central temperature in units of $10^7$ K. *[10^7 K]*

   <details><summary>Hint</summary>

   $\approx5.8\times10^6$ K. The real centre is $1.57\times10^7$ K: a real star is centrally concentrated ($\rho_c\approx100\bar\rho$), so a uniform model underestimates $T_c$ by a factor ~3, but gets the order of magnitude right.

   </details>

3. Radius (in units of $R$) where $\varepsilon\propto T^4$ drops to 10 % of its central value. *[R]*

   <details><summary>Hint</summary>

   $\varepsilon/\varepsilon_c=(1-r^2/R^2)^4=0.1\Rightarrow r/R=\sqrt{1-0.1^{1/4}}=0.66$.

   </details>

## 👹 Boss: hydrostatic equilibrium to the Eddington limit (exam problem)

*Open Question 3 [Stability of a star, 10 pt], HS24 summer session, 20 min.*

The stability of a star relies on the balance between gravity and pressure within its material.

(a) [4 pt] By considering a differential volume element at radius $r$ in a spherical star, derive the condition for hydrostatic equilibrium, $\frac{dP}{dr}=-\frac{GM_r\rho}{r^2}$, where $P$ and $\rho$ are pressure and density at radius $r$ and $M_r$ is the enclosed mass.

(b) [4 pt] Using this and assuming the pressure is dominated by radiation pressure with absorption coefficient $\alpha=\chi\rho$ for some opacity $\chi$, derive the radiative luminosity required to perfectly balance gravitation at the surface $r=R$. Express the answer in terms of the opacity $\chi$. Hint: use $F=-\frac{c}{\alpha}\frac{dP}{dr}$.

(c) [2 pt] What is the name of this luminosity limit?

<details><summary>Key points of a full-marks solution</summary>

- (a) Slab of area $dA$, thickness $dr$: pressure force $-dP\,dA$, gravity $-\frac{GM_r\rho}{r^2}dA\,dr$; set the sum to zero.
- (b) $F=L/4\pi R^2=-\frac{c}{\chi\rho}\frac{dP}{dr}$ and $\frac{dP}{dr}|_R=-\frac{GM\rho}{R^2}$, so $\frac{\chi\rho}{c}\frac{L}{4\pi R^2}=\frac{GM\rho}{R^2}\Rightarrow L=\frac{4\pi cGM}{\chi}$. Density and radius cancel.
- (c) Eddington luminosity (limit): above it radiation pressure expels the envelope.

</details>

## 👹 Boss: the constant-density star (exam problem)

*HS24 winter: Open Question 1 [constant-density star, 12 pt], 25 min.*

Consider a hypothetical star of radius $R$ with density $\rho$ that is constant, independent of the radial distance $r$ from the centre. The star is composed of a classical, non-relativistic, ideal gas of fully ionised hydrogen.

(a) [4 pt] Using the hydrostatic equilibrium equation with the boundary condition $P(R)=0$, show that the pressure profile is $P(r)=\frac{2\pi}{3}G\rho^2(R^2-r^2)$. Hint: integrate from $r$ to $R$.

(b) [4 pt] Using the equation of state, find the temperature profile $T(r)$.

(c) [4 pt] Assume that the nuclear energy production rate depends on temperature as $\epsilon\propto T^4$. At what radius does $\epsilon$ decrease to 0.1 of its central value?

<details><summary>Key points of a full-marks solution</summary>

- (a) $M_r=\frac43\pi r^3\rho$; $\int_{P(r)}^{P(R)}dP=-\frac{4\pi}{3}G\rho^2\int_r^Rr'dr'$; $P(R)=0$ gives $P=\frac{2\pi}{3}G\rho^2(R^2-r^2)$.
- (b) $P=\frac{2\rho}{m_H}k_BT$ (two particles per $m_H$), so $T=\frac{\pi}{3}\frac{m_HG\rho}{k_B}(R^2-r^2)$.
- (c) $\epsilon/\epsilon_c=(1-r^2/R^2)^4=\alpha\Rightarrow r/R=(1-\alpha^{1/4})^{1/2}=0.66$ for $\alpha=0.1$.

</details>
