# The Degenerate Vault

*Astro Observatory Ship. Topics: Fermi gas, degeneracy pressure, white dwarfs, Chandrasekhar mass, neutron stars, pulsars, accretion.*

When fusion ends, gravity wins, unless quantum mechanics stops it. In the Vault you squeeze electrons until the Pauli principle pushes back, find the mass at which even that fails, and spin up a neutron star.

**Sources:** Choudhuri_Textbook.pdf (Choudhuri Ch. 5.2 (degeneracy pressure, eqs. 5.1-5.12, Fig. 5.1), 5.3 (polytropes, Lane–Emden 5.13-5.28, R ∝ M^{-1/3}, M_Ch = 1.46 (2/μe)^2 M_sun), 5.4 (neutron stars), 5.5 (pulsars), 5.6 (accretion disks)); Astro_I_2025_Winter_Session_with_Solutions.pdf (HS25 winter: open Q6 and MC 6 (Eddington, accretion)); syllabus.md (Cross-region: Degenerate Matter boss (QM Ch. 2-3 box counting, SS Ch. 3.1 Fermi gas))

## 📖 Degeneracy pressure: Pauli versus gravity

Electrons are fermions: each phase-space cell of volume $h^3$ holds at most 2 (spin up and down). At high density even at $T=0$ all states up to the Fermi momentum $p_F$ are filled:

$$n_e=\frac{8\pi}{3h^3}p_F^3,\qquad n_e=\frac{\rho}{\mu_em_H},\quad\mu_e=\frac{2}{1+X}$$  
*(5.2), (5.6)-(5.7): μe = 2 for He, C, O (white dwarf matter).*

The pressure is the momentum flux $P=\frac13\int n(p)\,v\,p\,dp$. Two limits:

$$\text{non-rel.: }P=K_1\rho^{5/3},\ K_1=\frac{1.00\times10^7}{\mu_e^{5/3}}\qquad\text{rel.: }P=K_2\rho^{4/3},\ K_2=\frac{1.24\times10^{10}}{\mu_e^{4/3}}\quad(\mathrm{SI})$$  
*(5.9)-(5.12). Relativistic when p_F ≳ m_e c, i.e. ρ ≳ 2×10⁹ kg m⁻³ for μe = 2.*

💡 **Intuition.** Squeeze an electron into a smaller box and its momentum must grow ($\Delta x\Delta p\gtrsim\hbar$, the particle-in-a-box energy $\propto1/L^2$). This "zero-point" motion is a pressure that needs no temperature. It is the same Fermi gas you meet in solid state (electrons in a metal, $E_F\sim$ eV) and in QM (filling box states) — only $10^6$ times denser.

⚠️ **Pitfall.** Degeneracy pressure comes from the <b>electrons</b>: at the same number density they have the same $p_F$ as the nuclei would, but pressure is a momentum flux $\sim p_Fv_F=p_F^2/m$, so the light electrons win by $m_p/m_e\approx2000$. The <b>nuclei</b> provide the mass, hence $\mu_e$ (mass per electron). The pressure does not depend on $T$: a white dwarf can cool forever without shrinking.

### Check yourself

**1.** In the non-relativistic limit, degeneracy pressure scales with density as

- A) $\rho$
- B) $\rho^{4/3}$
- C) $\rho^{5/3}$
- D) $\rho^2$

<details><summary>Answer</summary>

**C**. $P\propto p_F^5/m_e\propto n^{5/3}$.

</details>

**2.** For a carbon–oxygen white dwarf the mean molecular weight per electron $\mu_e$ is

- A) 1
- B) 2
- C) 12
- D) 1/2

<details><summary>Answer</summary>

**B**. Half as many electrons as nucleons.

</details>

## 📖 White dwarfs and the Chandrasekhar limit

With $P=K\rho^{1+1/n}$ (a polytrope) hydrostatic equilibrium plus Poisson becomes the Lane–Emden equation; its scaling gives $R\propto\rho_c^{(1-n)/2n}$ and $M\propto\rho_c^{(3-n)/2n}$ (5.22)-(5.24).

$$n=\tfrac32\ (\text{non-rel.}):\ R\propto M^{-1/3}\qquad n=3\ (\text{rel.}):\ M=M_{Ch}=1.46\left(\frac{2}{\mu_e}\right)^2M_\odot\approx1.4M_\odot$$  
*Mass–radius relation (5.25) and the Chandrasekhar mass (5.27)-(5.28).*

💡 **Intuition.** Quick version: hydrostatic equilibrium needs $P\sim GM^2/R^4$. Non-relativistic degeneracy gives $P\sim K_1M^{5/3}/R^5$: equate, $R\sim K_1/(GM^{1/3})$. <b>More massive white dwarfs are smaller.</b> As $M$ grows the electrons become relativistic and $P\sim K_2M^{4/3}/R^4$: now both sides scale as $R^{-4}$, the radius drops out, and equilibrium is possible for only one mass, $M\sim(K_2/G)^{3/2}$. Above it nothing stops collapse.

🖼️ **Picture it.** Choudhuri Fig. 5.2: radius against mass. The non-relativistic curve $R\propto M^{-1/3}$ continues forever, but the full (relativistic) curve bends down and hits $R=0$ at $M_{Ch}\approx1.4M_\odot$. A $0.6M_\odot$ white dwarf is about the size of the Earth ($\sim10^4$ km).

⚠️ **Pitfall.** The Chandrasekhar limit comes from electrons becoming <b>relativistic</b>, not from neutron formation. It depends on composition through $\mu_e^{-2}$ only.

### Check yourself

**1.** Adding mass to a (non-relativistic) white dwarf makes it

- A) larger
- B) smaller
- C) unchanged in size
- D) hotter and larger

<details><summary>Answer</summary>

**B**. $R\propto M^{-1/3}$.

</details>

**2.** The Chandrasekhar mass exists because, in the relativistic limit,

- A) radiation pressure dominates
- B) degeneracy and gravitational pressure both scale as $R^{-4}$
- C) neutrons appear
- D) the star becomes convective

<details><summary>Answer</summary>

**B**. The radius drops out of the balance.

</details>

## 📖 Neutron stars and pulsars (intuition)

Above about $10^{12}$–$10^{14}$ kg m$^{-3}$ it becomes energetically favourable for electrons to combine with protons ($p+e\to n+\nu$, inverse beta decay): matter turns into neutrons. Neutron degeneracy pressure (and nuclear forces) support a <b>neutron star</b>: $M\approx1.4M_\odot$ in $R\approx10$ km, density $\sim10^{18}$ kg m$^{-3}$, a giant nucleus. Above $\sim2$–3$M_\odot$ nothing can hold: black hole.

<b>Pulsars</b> (Bell & Hewish 1967): radio pulses with periods from 1.4 ms to seconds, extremely regular and slowly lengthening. A rotating object cannot spin faster than breakup, $\Omega^2R<GM/R^2$, so $P>2\pi\sqrt{R^3/GM}$. For a white dwarf that is ~10 s; for a neutron star ~0.5 ms. Only neutron stars can be pulsars. The beam comes from the magnetic poles of a magnetised, rotating neutron star (lighthouse model).

💡 **Intuition.** Collapse conserves angular momentum ($\Omega R^2$) and magnetic flux ($BR^2$): shrink the Sun to 10 km and its rotation goes from a month to milliseconds and its field from $10^{-4}$ T to $10^{8}$ T. The pulsar's radiation is paid for by its rotational energy: $L=-\frac{d}{dt}\frac12I\Omega^2=4\pi^2I\dot P/P^3$. The Crab pulsar's spin-down powers the whole Crab nebula.

### Check yourself

**1.** Why can pulsars with $P\sim1$ ms not be white dwarfs?

- A) white dwarfs have no magnetic field
- B) a white dwarf would be torn apart by rotation that fast
- C) white dwarfs are too hot
- D) white dwarfs do not emit radio waves

<details><summary>Answer</summary>

**B**. Breakup period $2\pi\sqrt{R^3/GM}\sim10$ s for a white dwarf.

</details>

## 📖 Accretion: the most efficient engine (intuition)

$$L_{\rm acc}=\frac{GM\dot M}{R}=\eta\dot Mc^2,\qquad\eta=\frac{GM}{Rc^2}$$  
*Matter falling onto a compact object radiates its potential energy.*

For a neutron star $\eta\approx0.1$–0.2, for a black hole (disk down to the innermost stable orbit) $\eta\approx0.06$–0.4: ten to fifty times more efficient than hydrogen fusion (0.007). Gas with angular momentum cannot fall straight in; it forms an <b>accretion disk</b> where viscosity transports angular momentum out and lets mass spiral in, heating the inner disk to X-ray temperatures.

💡 **Intuition.** Accretion luminosity is capped by the Eddington limit: if $L>L_{Edd}$ radiation pressure stops the infall. So the maximum accretion rate is $\dot M_{Edd}=L_{Edd}/(\eta c^2)$, which sets the maximum growth rate of black holes (Salpeter time, HS25 winter Q6).

### Check yourself

**1.** Compared with hydrogen fusion, accretion onto a neutron star converts rest mass to energy

- A) 10 to 30 times less efficiently
- B) equally efficiently
- C) about 10 to 30 times more efficiently
- D) with 100 % efficiency

<details><summary>Answer</summary>

**C**. $GM/Rc^2\approx0.2$ vs 0.007.

</details>

## ❓ Quiz: Degenerate Vault multiple choice

*Exam-style multiple choice (3 pt each in the real exam).*

**1.** White dwarfs are supported against gravity by

- A) thermal pressure of ions
- B) radiation pressure
- C) electron degeneracy pressure
- D) neutron degeneracy pressure

<details><summary>Answer</summary>

**C**. Fowler 1926.

</details>

**2.** The Chandrasekhar mass for $\mu_e=2$ is about

- A) $0.6M_\odot$
- B) $1.4M_\odot$
- C) $3M_\odot$
- D) $8M_\odot$

<details><summary>Answer</summary>

**B**. $1.46(2/\mu_e)^2M_\odot$.

</details>

**3.** A typical neutron star has radius

- A) 10 m
- B) 10 km
- C) 10⁴ km
- D) 1 R☉

<details><summary>Answer</summary>

**B**. Nuclear density.

</details>

**4.** Pulsar periods slowly increase because

- A) the star accretes mass
- B) rotational energy is radiated away
- C) the magnetic field grows
- D) the star cools

<details><summary>Answer</summary>

**B**. $L=I\Omega|\dot\Omega|$.

</details>

**5.** The upper mass limit of main-sequence stars is due to

- A) small optical depth
- B) H depletion
- C) cosmic rays
- D) radiation pressure beating gravity

<details><summary>Answer</summary>

**D**. Eddington limit. *(HS25 winter: MC 6)*

</details>

## ✍️ Derivation: White dwarf mass–radius relation and the Chandrasekhar mass by scaling

*Choudhuri §5.3 (scaling version of 5.22-5.28)*

**Goal:** Using only $P\sim GM^2/R^4$ (hydrostatic equilibrium), $\rho\sim M/R^3$ and $P=K\rho^{\gamma}$, show $R\propto M^{-1/3}$ for $\gamma=5/3$ and that $\gamma=4/3$ allows only one mass.

**Given:** $P=K_1\rho^{5/3}$ or $K_2\rho^{4/3}$

1. Non-relativistic case.

   <details><summary>Reveal</summary>

   $\frac{GM^2}{R^4}\sim K_1\frac{M^{5/3}}{R^5}\Rightarrow R\sim\frac{K_1}{G}M^{-1/3}$.

   </details>

2. Relativistic case.

   <details><summary>Reveal</summary>

   $\frac{GM^2}{R^4}\sim K_2\frac{M^{4/3}}{R^4}$: $R$ cancels, $M^{2/3}\sim K_2/G$, so $M\sim(K_2/G)^{3/2}$.

   </details>

3. Interpret.

   <details><summary>Reveal</summary>

   If $M<M_{Ch}$ the star shrinks until electrons are partly relativistic and a balance is found; if $M>M_{Ch}$ contraction raises gravity and degeneracy pressure equally fast and never catches up: collapse. The exact Lane–Emden coefficient gives $1.46(2/\mu_e)^2M_\odot$.

   </details>

**Full marks needs:** $R\propto M^{-1/3}$ · radius drops out for $\gamma=4/3$ · $M_{Ch}\sim(K_2/G)^{3/2}$

## 🔢 Calculation: When do white-dwarf electrons go relativistic?

Electrons become relativistic when $p_F\approx m_ec$. Use $n_e=\frac{8\pi}{3h^3}p_F^3$ and $\rho=\mu_em_Hn_e$ with $\mu_e=2$, $m_H\approx m_p$.

1. Electron density at $p_F=m_ec$ in m$^{-3}$ (enter e.g. 5.9e35). *[m^-3]*

   <details><summary>Hint</summary>

   $(m_ec)^3=(2.73\times10^{-22})^3$ kg$^3$m$^3$s$^{-3}$; divide by $h^3$.

   </details>

2. Corresponding density in kg m$^{-3}$ (enter e.g. 2e9). *[kg m^-3]*

   <details><summary>Hint</summary>

   Two nucleon masses per electron: $\approx2\times10^9$ kg m$^{-3}$ (a teaspoon weighs 10 tonnes).

   </details>

## 🔢 Quick fight: Order-of-magnitude white dwarf and Chandrasekhar mass

Use Choudhuri's constants $K_1=1.00\times10^7/\mu_e^{5/3}$, $K_2=1.24\times10^{10}/\mu_e^{4/3}$ (SI), $\mu_e=2$, and the crude balances $R\sim K_1/(GM^{1/3})$ and $M\sim(K_2/G)^{3/2}$. Factor-of-1.3 accuracy expected relative to these formulas.

1. Radius of a $0.6M_\odot$ white dwarf in km. *[km]*

   <details><summary>Hint</summary>

   $K_1=3.15\times10^6$; $(1.19\times10^{30})^{1/3}=1.06\times10^{10}$. Gives a few thousand km: Earth-sized (real value ~$9\times10^3$ km).

   </details>

2. Mass scale $(K_2/G)^{3/2}$ in $M_\odot$. *[M_sun]*

   <details><summary>Hint</summary>

   $\approx0.3M_\odot$: the crude scaling misses the Lane–Emden factor ($\xi_1^2|\theta'|$ etc.) that brings it to $1.46M_\odot$, but the order of magnitude and the physics are right.

   </details>

## 🔢 Calculation: A neutron star up close

Neutron star with $M=1.4M_\odot$, $R=10$ km.

1. Mean density in units of $10^{17}$ kg m$^{-3}$. *[10^17 kg m^-3]*

   <details><summary>Hint</summary>

   $\approx6.6\times10^{17}$ kg m$^{-3}$, about 3 times nuclear density.

   </details>

2. Compactness $GM/(Rc^2)$ (= accretion efficiency). *[dimensionless]*

   <details><summary>Hint</summary>

   $\approx0.21$: relativity matters (Schwarzschild radius 4.1 km).

   </details>

3. Escape velocity in units of $c$. *[c]*

   <details><summary>Hint</summary>

   $\sqrt{2GM/R}/c=\sqrt{2\eta}\approx0.64$.

   </details>

4. Breakup (minimum) rotation period $2\pi\sqrt{R^3/GM}$ in ms. *[ms]*

   <details><summary>Hint</summary>

   $\approx0.46$ ms. The fastest known pulsar spins at 1.4 ms: allowed.

   </details>

## 🔢 Calculation: What powers the Crab Nebula?

The Crab pulsar has $P=33.4$ ms and $\dot P=4.2\times10^{-13}$ s/s. Take the moment of inertia $I=10^{38}$ kg m$^2$.

1. Rotational energy $\frac12I\Omega^2$ in units of $10^{42}$ J. *[10^42 J]*

   <details><summary>Hint</summary>

   $\Omega=2\pi/P=188$ rad/s.

   </details>

2. Spin-down luminosity $4\pi^2I\dot P/P^3$ in units of $10^{31}$ W. *[10^31 W]*

   <details><summary>Hint</summary>

   $L=-\frac{d}{dt}(\frac12I\Omega^2)=I\Omega|\dot\Omega|$ with $\dot\Omega=-2\pi\dot P/P^2$. About $10^5L_\odot$: enough to power the nebula's synchrotron glow.

   </details>

3. Characteristic age $P/(2\dot P)$ in years. *[yr]*

   <details><summary>Hint</summary>

   $\approx1260$ yr. The supernova was seen in 1054: a good match.

   </details>
