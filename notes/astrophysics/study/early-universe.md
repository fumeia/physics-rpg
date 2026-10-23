# The First Three Minutes

*Astro Observatory Ship. Topics: thermal history, relativistic gases, baryon-to-photon ratio, neutrino decoupling, Big Bang nucleosynthesis, recombination and CMB, dark matter, inflation, structure formation.*

Run the film backwards: the Universe gets hotter as $T\propto1/a$. At 1 s it is a $10^{10}$ K soup of photons, electrons, positrons and neutrinos with a pinch of neutrons and protons; at 3 minutes helium forms; at 380 000 years atoms form and the CMB is released. Each step is set by one comparison: a reaction rate against the expansion rate $H$.

**Sources:** Choudhuri_Textbook.pdf (Choudhuri Ch. 10.7 (T = 1.52e10/√t K, eq. 10.67; T in MeV = 1.31/√t, 10.69; |Ω−1| ∝ t, 10.70), 11.1-11.2 (relativistic gases 11.9-11.19), 11.3 (BBN, n/p 11.20-11.23), 11.4 (neutrino background), 11.5 (dark matter), 11.6 (inflation), 11.7 (recombination, last scattering), 11.9 (structure formation)); Astro_I_2025_Winter_Session_with_Solutions.pdf (HS25 winter: open Q7 (radiation era, BBN)); Astro_I_2025_Practice_Exam_with_Solutions.pdf (HS25 practice: MC 7); Astro_I_2024_Summer_Session_with_Solutions.pdf (HS24 summer: MC 15); Astro_I_2024_Winter_Session_with_Solutions.pdf (HS24 winter: MC 14-15)

## 📖 The cosmic clock: temperature versus time

In the radiation era $a\propto t^{1/2}$ and $T\propto1/a$, so $T\propto t^{-1/2}$. Putting in the constants (photons only, Choudhuri (10.66)-(10.69)):

$$T=\left(\frac{3c^2}{32\pi Ga_B}\right)^{1/4}t^{-1/2}\approx\frac{1.5\times10^{10}\,\mathrm K}{\sqrt{t/1\,\mathrm s}},\qquad k_BT\approx\frac{1.3\,\mathrm{MeV}}{\sqrt{t/1\,\mathrm s}},\qquad1\,\mathrm{eV}\leftrightarrow1.16\times10^4\,\mathrm K$$

🖼️ **Picture it.** Timeline (energy ↔ time): $\sim10^{-35}$ s inflation (?); $10^{-6}$ s, 1 GeV: quarks bind into protons and neutrons; 1 s, 1 MeV: neutrinos decouple, n/p freezes, then $e^\pm$ annihilate; 3 min, 0.1 MeV: nucleosynthesis (D, He, Li); 50 000 yr, ~1 eV: matter–radiation equality; 380 000 yr, 0.3 eV ($z\approx1100$): recombination, CMB released; then dark ages, first stars at $z\sim20$, reionisation, galaxies.

💡 **Intuition.** A process "freezes out" when its rate $\Gamma$ drops below the expansion rate $H$: particles can no longer find each other before the Universe has doubled in size. Almost every relic (neutrinos, the n/p ratio, the light elements, the CMB) is a snapshot taken at its own $\Gamma=H$.

⚠️ **Pitfall.** Energy scales the MC asks for: BBN at <b>~1 MeV</b> (binding energies of nuclei; HS25 practice MC7) and recombination at <b>~1 eV</b> (just below 13.6 eV because photons vastly outnumber baryons; HS24 summer MC15).

### Check yourself

**1.** Big Bang nucleosynthesis occurred at an energy scale of about

- A) 10 GeV
- B) 1 GeV
- C) 1 MeV
- D) 1 eV

<details><summary>Answer</summary>

**C**. Nuclear binding energies. *(HS25 practice: MC 7)*

</details>

**2.** Recombination occurred at an energy scale of about

- A) 1 GeV
- B) 1 MeV
- C) 1 eV
- D) 0.01 eV

<details><summary>Answer</summary>

**C**. Below 13.6 eV because $n_\gamma/n_B\sim10^9$. *(HS24 summer: MC 15)*

</details>

## 📖 Photons per baryon: the number that runs cosmology

$$n_\gamma=\frac{2\zeta(3)}{\pi^2}\left(\frac{k_BT}{\hbar c}\right)^3=4.1\times10^8\,\mathrm{m^{-3}}\ (T_0=2.725\,\mathrm K),\qquad\eta=\frac{n_B}{n_\gamma}\approx6\times10^{-10}$$  
*(11.9), (11.17)-(11.19). Both scale as a^{-3}, so η is constant after e± annihilation.*

For relativistic particles $\rho c^2=g\frac{a_B}{2}T^4$ (bosons) or $\frac78g\frac{a_B}{2}T^4$ (fermions), with $g$ the number of spin states (photons: 2). Non-relativistic species are exponentially suppressed, $n\propto(mT)^{3/2}e^{-mc^2/k_BT}$.

💡 **Intuition.** There are about $1.6\times10^9$ photons for every proton or neutron. This tiny $\eta$ is why atoms and nuclei form "late": even when $k_BT$ is far below a binding energy, the high-energy tail of so many photons can still break every bound state. It is also the parameter BBN measures (through deuterium).

### Check yourself

**1.** The ratio of baryons to photons is about

- A) $1$
- B) $10^{-3}$
- C) $6\times10^{-10}$
- D) $10^{-20}$

<details><summary>Answer</summary>

**C**. $\eta\approx6\times10^{-10}$.

</details>

## 📖 Big Bang nucleosynthesis: why a quarter of the baryons are helium

While weak reactions ($n+\nu\leftrightarrow p+e^-$, $n+e^+\leftrightarrow p+\bar\nu$) are fast, neutrons and protons are in equilibrium: Boltzmann with $\Delta mc^2=1.29$ MeV. The rate falls as $\Gamma/H\approx(T/0.8\,\mathrm{MeV})^3$ (11.20), so the ratio freezes at $k_BT\approx0.8$ MeV:

$$\frac{n_n}{n_p}=e^{-1.29/0.8}\approx0.20\ \Rightarrow\ Y=\frac{2n_n}{n_n+n_p}=\frac{2(n_n/n_p)}{1+n_n/n_p}\approx0.33$$  
*(11.21)-(11.23). Free neutron decay (τ ≈ 880 s) until fusion starts at ~3 min lowers this to n/p ≈ 1/7 and Y ≈ 0.25.*

Fusion must wait for deuterium ($B=2.2$ MeV) to survive photo-dissociation, which happens only at $k_BT\approx0.07$ MeV ($T\approx10^9$ K, $t\approx3$ min; HS25 winter Q7 gives 225 s), again because of the $10^9$ photons per baryon (the "deuterium bottleneck"). Then nearly all neutrons end up in $^4$He.

💡 **Intuition.** Helium is ~25 % of baryonic mass everywhere we look, even in the oldest, most metal-poor gas: it cannot have been made in stars (they made only a few % since). Deuterium is fragile and only destroyed by stars, and its leftover abundance falls steeply with $\eta$: a cosmic baryometer. It gives $\Omega_b\approx0.05$, far below $\Omega_M\approx0.3$: most dark matter is not baryonic.

⚠️ **Pitfall.** Each He nucleus contains 2 neutrons, so $Y=2n_n/(n_n+n_p)$ (mass fraction), not $n_n/(n_n+n_p)$.

### Check yourself

**1.** If the n/p ratio at fusion time is 1/7, the primordial helium mass fraction is

- A) 1/7
- B) 1/4
- C) 1/8
- D) 2/7

<details><summary>Answer</summary>

**B**. $2\cdot\frac17/(1+\frac17)=\frac{2}{8}$.

</details>

**2.** The primordial deuterium abundance is a good baryon density probe because

- A) deuterium is made in stars
- B) it falls steeply with η: more baryons burn more D into He
- C) it is independent of η
- D) it equals the helium abundance

<details><summary>Answer</summary>

**B**. Choudhuri Fig. 11.2.

</details>

## 📖 The neutrino background (intuition)

Neutrinos decouple at ~1 MeV, slightly before electrons and positrons annihilate. The annihilation heats the photons (entropy of $e^\pm$ goes to photons only), so today the neutrinos are colder:

$$T_\nu=\left(\frac{4}{11}\right)^{1/3}T_\gamma=1.95\,\mathrm K,\qquad\rho_R=\left[1+\tfrac78\cdot3\left(\tfrac4{11}\right)^{4/3}\right]\rho_\gamma=1.68\,\rho_\gamma$$  
*Three neutrino species; the factor 1.68 enters the time of matter–radiation equality.*

💡 **Intuition.** There are ~340 relic neutrinos per cm³ around you, never directly detected. Massive neutrinos are hot dark matter: they move too fast to let small structures form, so they can be at most a small fraction of the dark matter.

### Check yourself

**1.** The cosmic neutrino background is colder than the CMB because

- A) neutrinos have mass
- B) e± annihilation heated the photons after neutrinos decoupled
- C) neutrinos were produced later
- D) neutrinos scatter on dust

<details><summary>Answer</summary>

**B**. $(4/11)^{1/3}$.

</details>

## 📖 Recombination and the cosmic microwave background

Above ~3000 K hydrogen is ionised and free electrons Thomson-scatter photons constantly (mean free path tiny; recall Choudhuri ex. 2.7: ionised air is opaque within 14 m). At $T\approx3000$ K ($z\approx1100$, $t\approx380\,000$ yr) electrons and protons combine, the electron density drops, and photons stream freely: the <b>last scattering surface</b>. We see it today as the CMB, redshifted to 2.725 K.

$$T(z)=T_0(1+z),\qquad\frac{\delta T}{T}\sim10^{-5}$$  
*A nearly perfect blackbody (COBE/FIRAS); the tiny anisotropies are the seeds of all structure.*

💡 **Intuition.** The spectrum stays a blackbody after decoupling: free streaming in an expanding universe just redshifts every photon by the same factor, which maps a Planck spectrum at $T$ onto a Planck spectrum at $T/(1+z)$. That is why $T\propto1/a$ exactly.

⚠️ **Pitfall.** Recombination is <b>not</b> at $k_BT=13.6$ eV (that would be 160 000 K). Because $n_\gamma/n_B\sim10^9$, there are still enough photons above 13.6 eV in the Wien tail until $k_BT\approx0.3$ eV. Same logic as the Saha equation for stellar atmospheres.

### Check yourself

**1.** The CMB was released when

- A) the first stars formed
- B) electrons and protons combined into neutral hydrogen
- C) nuclei formed
- D) neutrinos decoupled

<details><summary>Answer</summary>

**B**. Thomson scattering stops.

</details>

## 📖 Dark matter, inflation and the growth of structure (intuition)

<b>Dark matter:</b> evidence from rotation curves, cluster virial masses, X-ray gas, lensing, and the CMB. BBN says only $\Omega_b\approx0.05$, so most of $\Omega_M\approx0.3$ is non-baryonic. It must be "cold" (slow) to let small structures form first: weakly interacting massive particles, axions... still unknown.

<b>Structure growth:</b> in the matter era, overdensities on scales above the Jeans length grow as $\delta\propto a$ (a power law, not exponential, because expansion fights gravity). Baryonic fluctuations of $10^{-5}$ at $z=1100$ would have grown only to $10^{-2}$ today: not enough for galaxies. Dark matter, which does not feel radiation pressure, started growing earlier (from $z_{eq}$), and baryons fell into its potential wells after recombination.

<b>Inflation</b> (Guth 1981): a brief early phase of exponential expansion. It solves the <b>horizon problem</b> (CMB regions on opposite sides of the sky have the same $T$ to $10^{-5}$ but were never in causal contact without inflation) and the <b>flatness problem</b> ($|\Omega-1|\propto t$ in the radiation era and $\propto t^{2/3}$ in the matter era, so a nearly flat universe today needs extreme fine tuning early on), and its quantum fluctuations seed the $10^{-5}$ perturbations.

💡 **Intuition.** Flatness is unstable like a pencil balanced on its tip: any deviation from $\Omega=1$ grows. That the Universe is still nearly flat after 13.8 Gyr means it started incredibly close to $\Omega=1$; inflation drives it there naturally by making $a$ huge, $|\Omega-1|\propto1/(aH)^2$.

### Check yourself

**1.** In the matter era, a small density contrast grows as

- A) $e^{t}$
- B) $a$
- C) $a^{-1}$
- D) it does not grow

<details><summary>Answer</summary>

**B**. Power-law growth.

</details>

**2.** The horizon problem asks why

- A) the sky is dark at night
- B) causally disconnected CMB regions have the same temperature
- C) the Universe is flat
- D) there is more matter than antimatter

<details><summary>Answer</summary>

**B**. Solved by inflation.

</details>

## ❓ Quiz: First Three Minutes multiple choice

*Exam-style multiple choice (3 pt each in the real exam).*

**1.** BBN occurred at an energy scale of

- A) 10 GeV
- B) 1 GeV
- C) 1 MeV
- D) 1 eV

<details><summary>Answer</summary>

**C**. Nuclear binding. *(HS25 practice: MC 7)*

</details>

**2.** Recombination: energy scale

- A) 1 GeV
- B) 1 MeV
- C) 1 eV
- D) 0.01 eV

<details><summary>Answer</summary>

**C**. Below 13.6 eV due to many photons. *(HS24 summer: MC 15)*

</details>

**3.** Radiation vs matter domination in our Universe:

- A) radiation early, matter late
- B) matter early, radiation late
- C) radiation always
- D) matter always

<details><summary>Answer</summary>

**A**. $\rho_R/\rho_M\propto1/a$. *(HS24 winter: MC 14)*

</details>

**4.** $\rho_R\propto$

- A) $a^{-3}$
- B) $a^{-2}$
- C) $a^{-4}$
- D) const

<details><summary>Answer</summary>

**C**. Dilution and redshift. *(HS24 winter: MC 15)*

</details>

**5.** The primordial helium mass fraction is about

- A) 0.01
- B) 0.25
- C) 0.5
- D) 0.75

<details><summary>Answer</summary>

**B**. From $n/p\approx1/7$.

</details>

**6.** In the radiation era the temperature scales with time as

- A) $t^{-2/3}$
- B) $t^{-1/2}$
- C) $t^{-1}$
- D) $e^{-Ht}$

<details><summary>Answer</summary>

**B**. $T\propto1/a\propto t^{-1/2}$. *(HS25 winter: open Q7b)*

</details>

## ✍️ Derivation: Helium mass fraction from the frozen n/p ratio

*Choudhuri §11.3 eqs. (11.21)-(11.23)*

**Goal:** Show that $Y=\frac{2(n_n/n_p)}{1+n_n/n_p}$ if all neutrons end up in $^4$He, and evaluate it for $n_n/n_p=e^{-1.29/0.8}$ and for $1/7$.

**Given:** $\Delta mc^2=1.29$ MeV, freeze-out at 0.8 MeV

1. Count the mass in helium.

   <details><summary>Reveal</summary>

   Each He-4 holds 2 n + 2 p. With $n_n$ neutrons, helium contains $2n_n$ nucleons; total nucleons $n_n+n_p$. $Y=\frac{2n_n}{n_n+n_p}=\frac{2(n_n/n_p)}{1+n_n/n_p}$.

   </details>

2. Freeze-out value.

   <details><summary>Reveal</summary>

   $e^{-1.29/0.8}=0.20\Rightarrow Y=0.33$.

   </details>

3. With neutron decay.

   <details><summary>Reveal</summary>

   $n_n/n_p\to1/7\Rightarrow Y=0.25$, as observed.

   </details>

**Full marks needs:** Boltzmann factor for n/p · factor 2 in Y · effect of neutron decay

## ✍️ Derivation: Radiation era: a(t), T(t) and the BBN time

*HS25 winter: open Q7 [12 pt]*

**Goal:** Flat, radiation only, $\rho\propto a^{-4}$, $\rho\propto T^4$. Show $a\propto t^{1/2}$, $T\propto t^{-1/2}$, and find $t_{BBN}$ for $T_{BBN}=10^9$ K given $T(1\,\mathrm s)=1.5\times10^{10}$ K.

**Given:** $(\dot a/a)^2=\frac{8\pi G}{3}\rho$

1. (a)

   <details><summary>Reveal</summary>

   $\dot a/a=C/a^2\Rightarrow a\,da=C\,dt\Rightarrow a^2=2Ct$.

   </details>

2. (b)

   <details><summary>Reveal</summary>

   $T^4\propto a^{-4}\Rightarrow T\propto a^{-1}\propto t^{-1/2}$.

   </details>

3. (c)

   <details><summary>Reveal</summary>

   $t_{BBN}=1\,\mathrm s\,(1.5\times10^{10}/10^9)^2=225$ s.

   </details>

**Full marks needs:** separation of variables · $T\propto1/a$ · 225 s

## 🔢 Calculation: Counting the CMB photons

$n_\gamma=\frac{2\zeta(3)}{\pi^2}\left(\frac{k_BT}{\hbar c}\right)^3$ with $\zeta(3)=1.202$, $T_0=2.725$ K, $\hbar=1.0546\times10^{-34}$ J s. Baryons: $\Omega_bh^2=0.0224$, $\rho_{c}=1.879\times10^{-26}h^2$ kg m$^{-3}$.

1. Photon number density in $10^8$ m$^{-3}$. *[10^8 m^-3]*

   <details><summary>Hint</summary>

   $k_BT/\hbar c\approx1190$ m$^{-1}$. About 410 photons per cm³.

   </details>

2. Baryon number density $\Omega_bh^2\rho_c/(h^2m_p)$ in m$^{-3}$. *[m^-3]*

   <details><summary>Hint</summary>

   Choudhuri (11.18): $11.3\,\Omega_bh^2$ m$^{-3}$, a quarter of a proton per m³.

   </details>

3. Baryon-to-photon ratio $\eta$ (enter e.g. 6e-10). *[dimensionless]*

   <details><summary>Hint</summary>

   $\approx6\times10^{-10}$: 1.6 billion photons per baryon.

   </details>

## 🔢 Calculation: Helium from the Big Bang

n/p freezes at $k_BT_f=0.8$ MeV with $\Delta mc^2=1.29$ MeV. Free neutrons then decay with lifetime $\tau_n=880$ s until fusion starts at $t\approx200$ s.

1. Frozen ratio $n_n/n_p$. *[dimensionless]*

   <details><summary>Hint</summary>

   Boltzmann factor.

   </details>

2. Helium mass fraction ignoring decay. *[dimensionless]*

   <details><summary>Hint</summary>

   Choudhuri (11.23): 0.33.

   </details>

3. Neutron fraction $n_n/(n_n+n_p)$ after decay until $t=200$ s. *[dimensionless]*

   <details><summary>Hint</summary>

   Total baryons are conserved; neutrons fall as $e^{-t/\tau}$.

   </details>

4. Helium mass fraction with decay, $Y=2X_n$. *[dimensionless]*

   <details><summary>Hint</summary>

   ≈0.26, close to the observed 0.24–0.25.

   </details>

## 🔢 Calculation: The clock of the early Universe

Use $T=1.52\times10^{10}\,\mathrm K/\sqrt{t/\mathrm s}$ (Choudhuri (10.67)), and $k_B=8.617\times10^{-5}$ eV/K.

1. Time (s) when $T=10^{10}$ K. *[s]*

   <details><summary>Hint</summary>

   $t=(A/T)^2$.

   </details>

2. $k_BT$ in MeV at that time. *[MeV]*

   <details><summary>Hint</summary>

   $0.86$ MeV: neutrinos just decoupled, n/p freezing.

   </details>

3. Time (in minutes) when $k_BT=0.07$ MeV (deuterium survives). *[min]*

   <details><summary>Hint</summary>

   $T=0.07\,\mathrm{MeV}/k_B=8.1\times10^8$ K: about 6 minutes in this photons-only formula (detailed calculations with neutrinos give ~3–4 min).

   </details>

## 🔢 Calculation: Neutrinos, flatness and growth

(i) $T_\nu=(4/11)^{1/3}T_0$, $T_0=2.725$ K. (ii) Flatness: today $|\Omega-1|=0.01$ at $t_0=13.8$ Gyr; $|\Omega-1|\propto t^{2/3}$ back to $t_{eq}=5\times10^4$ yr, then $\propto t$ back to $t=1$ s. (iii) Growth $\delta\propto a$ from $z=1100$ to today, starting at $10^{-5}$.

1. Neutrino temperature today in K. *[K]*

   <details><summary>Hint</summary>

   $0.714\times2.725$.

   </details>

2. $|\Omega-1|$ at $t=1$ s (enter e.g. 1e-18). *[dimensionless]*

   <details><summary>Hint</summary>

   Fine tuning to 18 decimal places: the flatness problem.

   </details>

3. Density contrast today from baryonic growth only. *[dimensionless]*

   <details><summary>Hint</summary>

   $\approx0.01\ll1$: without dark matter no galaxies would exist yet.

   </details>
