# The Nuclear Furnace

*Astro Observatory Ship. Topics: binding energy per nucleon, Gamow peak and tunnelling, pp chain, CNO cycle, solar neutrinos, stellar evolution, supernovae, exoplanets.*

Deep in the engine room, protons collide at a few keV while the Coulomb wall between them stands at a MeV. Classically nothing should burn. That the Sun shines at all is a quantum tunnelling effect: the same physics as the QM Tunneling Bridge, now at $10^7$ K.

**Sources:** Choudhuri_Textbook.pdf (Choudhuri Ch. 4.1 (binding energy, Fig. 4.1, eq. 4.3), 4.2 (reaction rates, Gamow factor 4.7-4.14), 4.3 (pp chain, CNO 4.27, triple alpha), 4.4 (solar neutrinos), 4.5 (evolution), 4.7 (supernovae), 4.9 (exoplanets)); Astro_I_2024_Winter_Session_with_Solutions.pdf (HS24 winter: open Q2 (binding-energy sketch), MC 6, 7); Astro_I_2025_Practice_Exam_with_Solutions.pdf (HS25 practice: MC 6); Astro_I_2024_Summer_Session_with_Solutions.pdf (HS24 summer: open Q1 (SN Ia)); tunneling-bridge.json (QM cross-link: barrier tunnelling T ≈ e^{-2κa})

## 📖 The binding-energy curve: why fusion stops at iron (intuition)

$$E_B=[Zm_p+(A-Z)m_n-m_{\rm nuc}]c^2,\qquad f=E_B/A$$  
*Binding energy and binding energy per nucleon (4.1)-(4.2).*

🖼️ **Picture it.** Sketch (HS24 winter Q2): $f$ against mass number $A$. It shoots up from H ($f=0$) through D (1.1 MeV), has a spike at $^4$He (7.1 MeV, much higher than its neighbours Li, Be), rises slowly to a broad maximum of about 8.8 MeV at Fe/Ni ($A\approx56$–62), then declines slowly to about 7.6 MeV for uranium. Left of the peak: energy from <b>fusion</b> (stars live here: pp, CNO, triple-alpha). Right of the peak: energy from <b>fission</b>.

💡 **Intuition.** Climbing towards iron releases energy; going past iron costs energy. So a massive star burns H, He, C, Ne, O, Si in ever shorter stages and ends with an iron core that cannot burn: the core collapses (core-collapse supernova). Elements heavier than iron are made by neutron capture (s- and r-process), not by fusion.

$$4\,{}^1\mathrm H\to{}^4\mathrm{He}+2e^++2\nu_e+26.7\,\mathrm{MeV},\qquad\frac{\Delta m}{m}=0.007$$  
*Hydrogen burning converts 0.7 % of the rest mass into energy.*

⚠️ **Pitfall.** The H→He step releases by far the most energy per unit mass of all fusion stages (6.7 MeV per nucleon out of the total ~8.8 to iron). That is why the main sequence (H burning) is by far the longest phase of a star's life.

### Check yourself

**1.** Which nucleus has the highest binding energy per nucleon (approximately)?

- A) $^4$He
- B) $^{12}$C
- C) $^{56}$Fe
- D) $^{238}$U

<details><summary>Answer</summary>

**C**. The curve peaks near iron/nickel (~8.8 MeV).

</details>

**2.** As a main-sequence star the Sun generates energy mainly by

- A) fusion of He into C
- B) fission of heavy elements
- C) fusion of H into He
- D) gravitational contraction

<details><summary>Answer</summary>

**C**. pp chain. *(HS24 winter: MC 7)*

</details>

## 📖 Tunnelling through the Coulomb wall: the Gamow peak

Two nuclei must get within $\sim10^{-15}$ m for the strong force to act. The Coulomb barrier there is $Z_1Z_2e^2/(4\pi\epsilon_0r)\approx1.4\,Z_1Z_2$ MeV, but $k_BT\approx1.3$ keV in the solar core: a factor 1000 too small. Classically: no fusion. Quantum mechanically the nuclei <b>tunnel</b>, with probability (Gamow 1928)

$$P_{\rm tunnel}\simeq\exp\left(-\sqrt{\frac{E_G}{E}}\right),\qquad E_G=2mc^2(\pi\alpha Z_1Z_2)^2,\quad m=\frac{m_1m_2}{m_1+m_2}$$  
*Gamow factor; Choudhuri writes it as exp(−b/√E) with b = √E_G. For p+p: E_G = 493 keV.*

💡 **Intuition.** This is the WKB version of the $T\approx e^{-2\kappa a}$ you are computing in QM: the barrier is not a rectangle but $1/r$, and integrating $\kappa(r)=\sqrt{2m(V(r)-E)}/\hbar$ across it gives $\sqrt{E_G/E}$. Higher charge $Z_1Z_2$ means a much thicker wall: that is why heavier elements need far higher temperatures.

The reaction rate needs particles that are both numerous (Maxwell factor $e^{-E/k_BT}$, falling with $E$) and able to tunnel ($e^{-\sqrt{E_G/E}}$, rising with $E$). The product is a narrow peak, the <b>Gamow peak</b>:

$$E_0=\left(\tfrac12\sqrt{E_G}\,k_BT\right)^{2/3},\qquad\tau=\frac{3E_0}{k_BT},\qquad\varepsilon\propto T^{(\tau-2)/3}$$  
*Position of the peak (4.13), its depth (4.14), and the resulting temperature sensitivity.*

🖼️ **Picture it.** Choudhuri Fig. 4.4: a falling exponential (Maxwell tail), a rising curve (tunnelling), and their product, a narrow hump around $E_0\approx6$ keV for p+p in the Sun, about $5k_BT$. Almost all fusion happens in this window, by the rare fast particles in the Maxwell tail.

⚠️ **Pitfall.** Because $\tau$ is large ($\approx14$ for pp in the Sun), the rate is very temperature-sensitive: $\varepsilon_{pp}\propto T^4$, and the CNO cycle (bigger charges, $Z=6$–8) $\propto T^{16-20}$. A small rise in $T_c$ makes CNO dominate: stars above about $1.3\,M_\odot$ burn mostly by CNO.

### Check yourself

**1.** At the centre of the Sun, $k_BT$ compared with the Coulomb barrier between two protons is

- A) about equal
- B) about 1000 times smaller
- C) about 1000 times larger
- D) about 10 times smaller

<details><summary>Answer</summary>

**B**. keV vs MeV.

</details>

**2.** The Gamow peak lies at an energy

- A) well below $k_BT$
- B) exactly $k_BT$
- C) several times $k_BT$
- D) at the barrier height

<details><summary>Answer</summary>

**C**. $E_0\approx5k_BT$ for pp in the Sun.

</details>

## 📖 pp chain, CNO cycle, triple alpha

$${}^1\mathrm H+{}^1\mathrm H\to{}^2\mathrm H+e^++\nu_e,\quad{}^2\mathrm H+{}^1\mathrm H\to{}^3\mathrm{He}+\gamma,\quad{}^3\mathrm{He}+{}^3\mathrm{He}\to{}^4\mathrm{He}+2\,{}^1\mathrm H$$  
*pp I chain (dominant branch in the Sun).*

The first step needs a weak interaction (a proton turns into a neutron while the two protons are in contact). It is so slow that a given proton in the Sun waits ~$10^{10}$ yr: this bottleneck is why the Sun lives 10 Gyr. The CNO cycle uses C, N, O as catalysts; its slowest step is $^{14}$N$+p$. Helium burns by the <b>triple-alpha</b> reaction $3\,{}^4$He$\to\,{}^{12}$C at $T\gtrsim10^8$ K (via unstable $^8$Be).

💡 **Intuition.** Same net result for pp and CNO (4 p → He), different "machinery". Which machine runs is set by temperature: pp for the Sun ($1.5\times10^7$ K), CNO for hotter, more massive stars. CNO's steep $T$ dependence concentrates energy release in a small core, which then becomes convective.

⚠️ **Pitfall.** For the Sun ($T\sim10^7$ K) the <b>pp chain dominates</b> (HS25 practice MC6), not CNO and not "both equally".

### Check yourself

**1.** For the Sun with $T\sim10^7$ K,

- A) pp and CNO contribute equally
- B) CNO dominates
- C) neither contributes significantly
- D) pp chains dominate

<details><summary>Answer</summary>

**D**. CNO takes over above ~$1.3M_\odot$. *(HS25 practice: MC 6)*

</details>

## 📖 Solar neutrinos: the experiment that weighed the neutrino (intuition)

Every He nucleus made in the Sun releases two electron neutrinos, which escape directly from the core (they barely interact). Counting them tests the solar model. Davis' chlorine experiment (from 1968) found only about <b>one third</b> of the predicted $\nu_e$ flux: the solar neutrino problem.

Resolution (SNO, 2002): the total neutrino flux of all flavours agrees with the solar model, but many $\nu_e$ have turned into $\nu_\mu$ and $\nu_\tau$ on the way. Flavour oscillations require neutrinos to have <b>mass</b>.

💡 **Intuition.** Neutrinos are the only way to see the solar core "now"; photons take $\sim10^4$–$10^5$ yr to random-walk out. Helioseismology (sound waves resonating in the Sun) independently confirmed the solar model's interior, which is why physicists blamed the neutrinos, not the Sun.

### Check yourself

**1.** Neutrino oscillations are indicated because detectors observe

- A) no neutrinos at all
- B) one third of the predicted $\nu_e$
- C) three times the predicted $\nu_e$
- D) only $\nu_\mu$ and $\nu_\tau$

<details><summary>Answer</summary>

**B**. The missing $\nu_e$ arrive as other flavours. *(HS24 winter: MC 6)*

</details>

## 📖 Life and death of stars (intuition)

<b>Low-mass star (like the Sun):</b> core H exhausted → inert He core contracts and heats (virial theorem), H burns in a shell → envelope swells: red giant. The He core becomes degenerate; He ignites explosively (helium flash) at ~$10^8$ K. He burning in the core (horizontal branch), then He and H shells (asymptotic giant branch). The envelope is blown off as a planetary nebula; the C/O core remains as a <b>white dwarf</b>.

<b>Massive star ($\gtrsim8M_\odot$):</b> burns H, He, C, Ne, O, Si in successively shorter stages, building an onion of shells around an iron core. Iron cannot release energy by fusion; when the core exceeds the Chandrasekhar mass it collapses in less than a second to a <b>neutron star</b> (or black hole). The infall bounces and, powered by neutrinos, blows the star apart: <b>core-collapse supernova</b> (Type II, with hydrogen lines). SN 1987A's neutrinos confirmed this.

<b>Type Ia supernova:</b> a carbon–oxygen white dwarf in a binary accretes mass until it approaches the Chandrasekhar limit and undergoes thermonuclear runaway. Because they all explode near the same mass, they reach nearly the same peak absolute magnitude $M\approx-19.3$: <b>standard candles</b> (used to discover the accelerating expansion).

💡 **Intuition.** The whole story is the virial theorem plus the binding-energy curve: each time a fuel runs out the core contracts and heats until the next fuel ignites, unless degeneracy pressure stops the contraction first (low mass) or there is no next fuel (iron).

📝 **How the exam asks it.** HS24 summer Q1: apparent magnitude of a SN Ia in Andromeda ($m=5.1$, 225 times brighter than Proxima Centauri). MC: what happens to $L$ and $T_{\rm eff}$ when leaving the main sequence.

### Check yourself

**1.** Type Ia supernovae are useful standard candles because

- A) they all occur in the same galaxy
- B) white dwarfs explode near the same (Chandrasekhar) mass
- C) their neutrinos can be counted
- D) they have hydrogen lines

<details><summary>Answer</summary>

**B**. Similar mass → similar peak luminosity.

</details>

**2.** The end state of the Sun will be

- A) a neutron star
- B) a black hole
- C) a white dwarf
- D) a red dwarf

<details><summary>Answer</summary>

**C**. Too light for core collapse.

</details>

## 📖 Exoplanets: wobbles and dips (intuition)

<b>Radial velocity:</b> star and planet orbit their common centre of mass; the star's line-of-sight velocity oscillates with amplitude $v_\star=(m_p/M_\star)v_p$ (Jupiter makes the Sun wobble at 13 m/s, Earth at 9 cm/s), measured by Doppler shifts. Gives $m_p\sin i$. <b>Transits:</b> the planet blocks a fraction $(R_p/R_\star)^2$ of the starlight (Jupiter: 1 %, Earth: 0.01 %). Gives the radius; with RV, the density.

💡 **Intuition.** Both methods favour big planets close to small stars, which is why "hot Jupiters" were found first.

### Check yourself

**1.** A transiting planet with $R_p=0.1R_\star$ dims the star by

- A) 10 %
- B) 1 %
- C) 0.1 %
- D) 0.01 %

<details><summary>Answer</summary>

**B**. $(R_p/R_\star)^2=0.01$.

</details>

## ❓ Quiz: Nuclear Furnace multiple choice

*Exam-style multiple choice (3 pt each in the real exam).*

**1.** Solar neutrino observations indicate oscillations because we detect

- A) no neutrinos
- B) one third of the predicted $\nu_e$
- C) three times the predicted $\nu_e$
- D) only $\nu_\mu$, $\nu_\tau$

<details><summary>Answer</summary>

**B**. Flavour change en route. *(HS24 winter: MC 6)*

</details>

**2.** As a main-sequence star the Sun generates energy primarily through

- A) He → C fusion
- B) fission
- C) H → He fusion
- D) contraction

<details><summary>Answer</summary>

**C**. pp chain. *(HS24 winter: MC 7)*

</details>

**3.** For the Sun ($T\sim10^7$ K)

- A) pp and CNO equally
- B) CNO dominates
- C) neither
- D) pp dominates

<details><summary>Answer</summary>

**D**. CNO only above ~1.3 solar masses. *(HS25 practice: MC 6)*

</details>

**4.** Fusion in stars occurs despite $k_BT\ll$ Coulomb barrier because of

- A) the strong force at long range
- B) quantum tunnelling
- C) neutrino heating
- D) magnetic fields

<details><summary>Answer</summary>

**B**. Gamow factor.

</details>

**5.** Energy released when four hydrogen atoms fuse into helium-4

- A) 2.2 MeV
- B) 7.1 MeV
- C) 26.7 MeV
- D) 938 MeV

<details><summary>Answer</summary>

**C**. $(4\times1.007825-4.002603)\,u\,c^2=26.7$ MeV.

</details>

**6.** The core of a massive star collapses after building iron because

- A) iron fusion releases too much energy
- B) iron cannot release energy by fusion or fission
- C) iron is radioactive
- D) neutrinos stop

<details><summary>Answer</summary>

**B**. Peak of the binding-energy curve.

</details>

## ✍️ Derivation: The Gamow peak

*Choudhuri §4.2, eqs. (4.10)-(4.14)*

**Goal:** The integrand of the reaction rate is $e^{g(E)}$ with $g(E)=-\frac{E}{k_BT}-\frac{b}{\sqrt E}$. Find the peak energy $E_0$ and $\tau=-g(E_0)$.

**Given:** $b=\sqrt{E_G}$

1. Set dg/dE = 0.

   <details><summary>Reveal</summary>

   $-\frac{1}{k_BT}+\frac{b}{2}E^{-3/2}=0\Rightarrow E_0^{3/2}=\frac{bk_BT}{2}\Rightarrow E_0=\left(\frac{bk_BT}{2}\right)^{2/3}$.

   </details>

2. Evaluate g at the peak.

   <details><summary>Reveal</summary>

   $\frac{b}{\sqrt{E_0}}=\frac{2E_0^{3/2}}{k_BT\sqrt{E_0}}=\frac{2E_0}{k_BT}$, so $\tau=\frac{E_0}{k_BT}+\frac{2E_0}{k_BT}=\frac{3E_0}{k_BT}$.

   </details>

3. Temperature dependence of the rate.

   <details><summary>Reveal</summary>

   $E_0\propto T^{2/3}$, so $\tau\propto T^{-1/3}$ and the rate $\propto T^{-2/3}\,\tau^2e^{-\tau}$ (Gaussian width factor). Locally $d\ln\varepsilon/d\ln T=(\tau-2)/3$: large $\tau$ means extreme temperature sensitivity.

   </details>

**Full marks needs:** $E_0=(bk_BT/2)^{2/3}$ · $\tau=3E_0/k_BT$ · competition of Maxwell tail and tunnelling

## 🔢 Calculation: Gamow peak of the pp reaction in the Sun

Two protons (reduced mass $m=m_p/2$, so $2mc^2=m_pc^2=938.3$ MeV) at $T_c=1.5\times10^7$ K. Fine-structure constant $\alpha=1/137.04$, $k_B=8.617\times10^{-5}$ eV/K.

1. $k_BT$ in keV. *[keV]*

   <details><summary>Hint</summary>

   $8.617\times10^{-5}\times1.5\times10^7$ eV.

   </details>

2. Gamow energy $E_G=2mc^2(\pi\alpha)^2$ in keV. *[keV]*

   <details><summary>Hint</summary>

   $Z_1=Z_2=1$; $938\,272\,\mathrm{keV}\times(\pi/137)^2\approx493$ keV.

   </details>

3. Peak energy $E_0=(\frac12\sqrt{E_G}k_BT)^{2/3}$ in keV. *[keV]*

   <details><summary>Hint</summary>

   Units work: $(\mathrm{keV}^{1/2}\cdot\mathrm{keV})^{2/3}=\mathrm{keV}$. About $4.6\,k_BT$.

   </details>

4. Tunnelling probability at $E_0$, $e^{-\sqrt{E_G/E_0}}$ (enter e.g. 1e-4). *[dimensionless]*

   <details><summary>Hint</summary>

   $\sqrt{493/6}\approx9.1$, $e^{-9.1}\approx10^{-4}$: rare, but there are $10^{56}$ protons.

   </details>

5. Temperature exponent $(\tau-2)/3$ with $\tau=3E_0/k_BT$. *[dimensionless]*

   <details><summary>Hint</summary>

   $\tau\approx14$ gives $\varepsilon\propto T^{4}$: the classic pp temperature dependence.

   </details>

## 🔢 Calculation: Counting the Sun's neutrinos

$4\,{}^1$H atoms ($1.007825$ u each) make one $^4$He atom ($4.002603$ u) and 2 neutrinos; $1\,\mathrm u\,c^2=931.494$ MeV. Ignore the small energy the neutrinos carry away. $L_\odot=3.828\times10^{26}$ W, $1$ AU $=1.495\times10^{11}$ m.

1. Energy released per helium nucleus in MeV. *[MeV]*

   <details><summary>Hint</summary>

   $\Delta m=0.0287$ u.

   </details>

2. Fraction of the rest mass converted. *[dimensionless]*

   <details><summary>Hint</summary>

   $0.0287/4.031=0.0071$.

   </details>

3. Helium nuclei made per second (enter e.g. 9e37). *[s^-1]*

   <details><summary>Hint</summary>

   $L/Q$ with $Q$ in joules.

   </details>

4. Neutrino flux at Earth in cm$^{-2}$ s$^{-1}$ (enter e.g. 6e10). *[cm^-2 s^-1]*

   <details><summary>Hint</summary>

   Two neutrinos per He; divide by $4\pi d^2$; $1\,\mathrm{m}^2=10^4\,\mathrm{cm}^2$. About $6\times10^{10}$ per cm$^2$ per second pass through you.

   </details>

## 🔢 Quick fight: Quick fight: Coulomb barrier for two protons

Estimate $e^2/(4\pi\epsilon_0r)$ at $r=10^{-15}$ m in MeV, using $e^2/(4\pi\epsilon_0)=1.44$ MeV fm. Compare with $k_BT\approx1.3$ keV.

1. Barrier height in MeV. *[MeV]*

   <details><summary>Hint</summary>

   1.44 MeV fm / 1 fm. About 1000 times $k_BT$.

   </details>

## 👹 Boss: binding energy per nucleon (exam sketch question)

*HS24 winter: Open Question 2 [6 pt], 8 min.*

Sketch a rough diagram of the binding energy per nucleon against atomic number, labelling the locations of H, He and Fe. Indicate on your diagram the general types of nuclear reactions and the region that is important for nuclear energy generation in stars.

<details><summary>Key points of a full-marks solution</summary>

- Axes labelled ($E_B/A$ in MeV vs mass or atomic number); H at 0, a steep rise, He-4 as a local spike (~7.1 MeV), broad maximum near Fe-56 (~8.8 MeV), slow decline to ~7.6 MeV for U.
- Left of iron: fusion releases energy (arrow towards Fe). Right of iron: fission releases energy (arrow towards Fe).
- Stellar energy generation: fusion on the left part (pp chain and CNO cycle H→He, then He→C,O...), with H→He giving the largest jump.

</details>
