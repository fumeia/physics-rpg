# Syllabus — QM, Solid State, Astrophysics

Built offline from `pdftotext` extracts (`notes/extracted/`), script tables of contents and the
exam texts. **Weighting rules (user):** all three exams in the user's year are **written**.
- **Astro:** only the recent Refregier exams (HS24–HS25) matter. The professor follows
  Choudhuri closely but teaches only about half of it, so knowing all of Choudhuri is the safe target.
- **QM and Solid State:** use *all* available exams (old ones too), not just 2022–26.
- **QM:** the weekly exercise sheets (and solutions) are the primary guide to what the course
  teaches and when; the user is in **week 4** and has so far only worked on tunneling/scattering
  (sheets 4–5).
Equations/figures have not been checked visually yet; before writing a quest from a topic,
read the actual pages.

## Who sets this year's exams

| Course | This year's lecturer | Past-exam evidence in `materials/` |
|---|---|---|
| QM I | **new professor** (no past exams of theirs). The 14 exercise sheets in `materials/` are labelled HS 2025, Gaberdiel | 16 exams HS14–FS26: use all of them. Gaberdiel-style 4-problem exams FS19–FS26 are the closest; HS14–HS16/FS16 are an older short-question format |
| Solid State | **Degen** (no past exams of theirs) | Written: Zheludev HS23 (Jan + Aug 2024, English) and Ensslin HS20 practice exam. Oral protocols HS00–HS15 (Ensslin, Batlogg, Pescia) show which concepts examiners probe. The 2026 script is the best signal of Degen's selection |
| Astro I | **Refregier** | Refregier written exams: HS24 summer + winter, HS25 practice + winter (all with solutions) are the only ones that matter. Older oral protocols are background |

Consequence: for QM and Solid State the exam style is a guess, so the script's chapters
(weighted by how much space each takes) matter as much as the exams. For astro, the exam
structure is known and stable.

## Materials caveats
- Scanned (no text layer): QM `old-exams/FS21`, `HS 20` and their solutions. Garbled: SS `HS00`, `HS02`. Both are old; low priority.
- Duplicates: QM HS18 DE/EN/`HS 18` are one exam; astro zip duplicates the 8 `Astro_I_*` PDFs. QM `HS16 (1)` is a different session than `HS16`.
- No astro lecture slides yet (Refregier publishes during the term). Choudhuri is the stand-in; his selection will be inferred from exams.
- Languages: QM script German, exercises/recent exams English; SS script English; astro English.

---

## 1. Quantum Mechanics I

**Course pacing (exercise sheets, all 14; in `materials/quantum-mechanics/exercises/`).** The
sheets are labelled *HS 2025, Prof. Gaberdiel* (return dates Sep–Dec 2025). The user's course is
this autumn (HS26) with a new professor, who uses the **same sheets** as Gaberdiel (confirmed by the
user). Week 4 = sheet 4–5 (scattering/tunneling), so the sheets are the exact map of what is taught.
The course is mathematically heavy (Lie algebras, representation theory, SO(4), su(3)), more
than a typical Griffiths-level course. Script: `QM25...Kap1-11.pdf`, German.

| Sheet | Topics | Script ch. | Done? |
|---|---|---|---|
| 1 | Compton (Thomson limit), Bohr atom + de Broglie, Galilean invariance of the Schrödinger eq. | 1, 2 | week 1 |
| 2 | Ehrenfest theorem, reality of ⟨H⟩, probability current of plane waves | 2 | week 2 |
| 3 | Gaussian wavefunction (Δx·Δp), box I–III (⟨x⟩, variance, classical limit, **sudden expansion of the box**, ζ(2) from the box) | 3.1 | week 3 |
| 4 | **δ-potential scattering R, T**; δ-limit of a deep narrow well; general potentials (|A|²+|B|²=1, ⟨T⟩≥0); **deuteron = 3D spherical well, existence of bound state** | 3.2–3.3 | week 4, current |
| 5 | **Transfer matrix method** (step, propagation, square well, barrier tunneling); rays in C² (Bloch sphere idea); commutators, e^{iap/ħ} translation, Weyl relations | 3.3, 3.5, 4 | week 5 |
| 6 | δ-well in momentum space (Fourier, convolution); Δx·Δp in the box; ⟨E⟩ ≥ ħ√(k/m)/2 via uncertainty | 4, 5 | |
| 7 | 2D HO with ladder ops and rotation symmetry J; **coherent states** (completeness, Gaussian, minimal uncertainty); degeneracy counting by generating function | 6 | |
| 8 | L algebra [Li,Lj]=iħεLk, ⟨L₁²⟩=⟨L₂²⟩; **so(4)≅su(2)⊕su(2)**; su(2) from two oscillators (Schwinger) | 7 | |
| 9 | sech² potential via A†A factorization (SUSY QM); discreteness of spectrum via partition function (Golden–Thompson); Pauli matrices and finite rotations; **3D HO and su(3) highest weights** | 6, 7 | |
| 10 | 3D HO in spherical coordinates (radial equation, recursion, degeneracy); **projective representations**, covering group of Z₂×Z₂ | 7.6, 8 | |
| 11 | **Pauli–Lenz vector / so(4) of hydrogen** (highest weight |n,n−1,n−1⟩); spinor ⟨σ⟩=e; D½⊗D₁ | 8.3, 9 | |
| 12 | Stern–Gerlach with composite spins; vector/tensor operators (spherical basis, S²D¹ = scalar + tensor); **Clebsch–Gordan** l⊗½ and j=3/2 for l=1 | 9 | |
| 13 | Time–energy uncertainty (survival probability); **quantum Zeno**; Hardy's paradox | 10 | |
| 14 | Anharmonic oscillator (λx⁴, 2nd-order PT); **Stark effect n=2 (degenerate PT)**; spin–orbit + Zeeman, Paschen–Back, g_ℓj | 9.7, 11 | |

Solutions 1–14 are in `solutions/` (not yet read; read them when writing quests so the quest
answers use the lecturer's results and conventions).

### Exams (all of them, 14 distinct), grouped by what they test
The older exams (HS14, FS16, HS16 ×2) come from a different, more **conceptual short-question** format with a wider scope (S-matrix, Lippmann–Schwinger, Born approximation, density matrices, partial waves, Fermi's golden rule, gauge transformations). The Gaberdiel-era exams (FS19, HS18, HS21–FS26) are 4 long problems that follow the same sheets as above. Weight both, but expect the new professor's own style to be unknown.

| Exam | Problems (pt) |
|---|---|
| FS26 | angular momentum j=1, measurement, uncertainty (20) · box with parity P (20) · rotational symmetry, L closing on a function space (19) · fine structure, degenerate PT (21) |
| HS25 | circular well, L in polar coords, Bessel (18) · hydrogenic ground state, symmetries, variational, sudden change of Z (20) · HO + quadratic perturbation (19) · spin-1⊗spin-1 addition and time evolution (21) |
| FS24 | foundations (20) · symmetric finite well, graphical bound-state argument (25) · spin systems, two-spin total J (25) · 2D HO + perturbation (30) |
| HS23 | postulates, Heisenberg picture of the free particle (24) · 1D wave mechanics, parity, well (37) · angular momentum, two-particle states (24) · HO matrix elements, anharmonic perturbation (34) |
| HS22 | A: 7 short questions (nodes, [x,f]=iħf, HO eigenstate, Heisenberg-picture commutator, spin 3/2⊗1/2, so(3)^N degeneracy) · B.1 finite-dim QM (20) · B.2 WKB (18) |
| FS22 | continuity eq. and step current (17) · angular momentum (15) · Heisenberg picture/propagator (17) · degenerate PT, 3D HO (15) |
| HS21 | Ehrenfest (10) · 3D wave mechanics, l=0 radial well (15) · spin-1 EPR singlet (12) · time-dependent PT, charged particle in a box (18) |
| FS19 | 2D box + exchange operator R (21) · Ehrenfest + HO coherent-type state (24) · SO(3) D¹ reps, spin-1 EPR pair, Alice's reduced measurement (18) · time-indep. PT (21) |
| HS18 | half-box / finite well, critical depth (19) · Heisenberg uncertainty proof + stronger Schrödinger–Robertson form (18) · Heisenberg picture, conservation laws (22) · time-indep. PT (20) |
| HS16 (a) | 10 short Q (self-adjoint, L commutators, Zeeman, HO, Brillouin–Wigner vs RS, gauge, Feynman–Hellmann, spin-½ rotation) · 3D HO radial (5) · spin-1 in B-field (7) · well with step (8) · rigid rotor (9) |
| HS16 (b) | short Q (symmetries/generators, Stern–Gerlach, CG, tunneling, coherent states, variational, Wigner theorem, EPR) · spin-1 in B (8) · PT (7) · bound + scattering states 1D (7) · central potential, bound-state existence by dimension (10) |
| FS16 | A eigenvalue problems (Gaussian packet, ring, translation generator) · B scattering (S-matrix, Lippmann–Schwinger, Born, Green function, partial waves) · C HO + PT, Schrödinger vs Heisenberg picture, 2D HO · D spin, density matrices (D.1–D.7) |
| HS14 | A single-particle 1–3D · B 1D scattering (S, transfer matrix, Lippmann–Schwinger) · C 3D, hydrogen, hard-sphere phase shift · D formalism, Heisenberg picture, golden rule, variational HO · E spins, density matrices (13 pt each) |
| HS20, FS21 | scanned PDFs, not yet read |

### Topic weights across all exams (counts of exams, ~16 distinct)
| Topic | Exams | Notes |
|---|---|---|
| Harmonic oscillator (ladder, coherent, perturbed, 2D/3D) | ~12 | Every year |
| Angular momentum algebra, spin-½/1, rotation reps | ~12 | |
| Perturbation theory (non-degenerate, degenerate, time-dep.) | ~11 | PT problem in nearly every Gaberdiel exam |
| 1D box/well, parity, bound-state existence | ~10 | Sheets 3–5 |
| Heisenberg picture, commutators, uncertainty proofs | ~9 | Sheets 5–6 |
| Spin addition, EPR, CG | ~9 | Sheet 11–12 |
| Scattering: δ/step/barrier, transfer matrix, S-matrix, reflection/transmission | ~6 (**all** the old-format exams + FS22) | Directly matches the current weeks: this is the most examinable part of the present material |
| Tunneling | HS16, FS16, HS14 (via S-matrix); sheet 5 | Not a headline problem in recent exams but part of the 1D scattering block |
| Ehrenfest, continuity | ~6 | Sheet 2, short proof tasks |
| Density matrices | HS14, FS16 | Only in old-format exams; ask whether the new course has them |
| Hydrogen (spectrum, so(4), fine structure, Stark/Zeeman) | ~8 | Sheets 11, 14 |
| WKB, Lippmann–Schwinger, Born, partial waves, golden rule | HS22 (WKB), old format | Depends on the new prof; low priority until syllabus known |

### QM priority list
1. **Right now (weeks 4–5):** 1D scattering with δ, step, square well/barrier via transfer matrix, current conservation, bound-state existence (sheets 4–5, Ch. 3).
2. HO + ladder operators + coherent states, then perturbation theory on it (Ch. 6, 11).
3. Angular momentum algebra, su(2) reps, spin addition/CG (Ch. 7, 9).
4. Degenerate PT, Stark, Zeeman, fine structure (Ch. 11, sheet 14).
5. Hydrogen and symmetry arguments (so(4)), Heisenberg picture, uncertainty proofs.
6. EPR/Bell, time-energy/Zeno, density matrices, WKB, Lippmann–Schwinger only if the course covers them.

**Game mapping:** tunneling bridge → sheet 4–5 (transfer matrix, T for a barrier; STM side quest); Stern–Gerlach chains → sheet 12 and Ch. 7, 9; double slit/which-path → Ch. 1, 10, sheet 13 (Zeno/Hardy); hydrogen lamp/Zeeman → sheet 11, 14; HO elevator → sheet 7, Ch. 6.

---

## 2. Solid State Physics (Degen)

**Format guess:** written, ~5 problems. HS23 has 5 problems with many small parts (a)–(r), mostly ratio/estimate-style calculations; HS20 practice had 30 pt multiple choice (18 sub-questions) + 4 problems (81 pt). Formula sheet allowed (5 A4 in Jan 2024, 10 A4 in HS20): confirm Degen's rules.

### Written exams (best style evidence)
| Problem | Zheludev Jan 2024 | Zheludev Aug 2024 | Ensslin HS20 |
|---|---|---|---|
| 1 | 2D crystals: primitive cell, basis, Wigner–Seitz, reciprocal lattice, BZ, area, neutron diffraction angles + intensity (structure factor, f₁=2f₂) | 2D crystal; atom shift → new basis; WS, BZ; Bragg angles and intensity ratio | MC (30 pt, 18 sub-questions): carrier density T-dependence, SC density of states, p-type Fermi level, ρ(T→0), primitive vectors, unit-cell shapes, Laue patterns sc/fcc/bcc, Debye–Scherrer/Ewald, NaCl phonon branches, bonding, Einstein model, E_F number (5×10²² cm⁻³), tight-binding m*, 2D DOS, Bloch theorem, scattering processes, exchange J |
| 2 | Free-electron metals A,B (n_B=2n_A): S_F, DOS(E_F), C_V; phonon vs defect scattering of ρ, τ, κ | Same under pressure (a→0.9a): E_F, S_F, DOS, C_V, Debye DOS, ρ, Grüneisen γ=2 → sound velocity, Θ_D | BaTiO₃ crystal structure (14) |
| 3 | 1D semiconductor with cosine bands: effective masses, DOS/length, n and p, intrinsic μ | + direct/indirect gap, σ equality → τ_e/τ_h | Hall effect (12) |
| 4 | Heisenberg magnet on honeycomb lattice (J₁ ferro, J₂ antiferro): ground state, Weiss temperature, saturation field ⊥ | ferromagnetic J₁≠J₂ lattice | Semiconductor band structure (12) · gap at M point in 2D lattice (13) |

### Oral protocols (HS00–HS15): concepts examiners probe
Even though the user's exam is written, these show what a thorough understanding looks like.
- **Phonons / specific heat (most frequent):** monoatomic and diatomic chain dispersion, acoustic vs optical, v_G=0 at the zone edge, Debye model assumptions, T³ vs Dulong–Petit and why classical limit saturates at 3rN k_B, Einstein model, inelastic neutron scattering to measure ω(q) (energies ~25 meV).
- **Bands:** Bloch theorem and periodicity of u_k and E(k), nearly-free-electron gap ΔE=2|V_G|, tight binding (core levels, nearest-neighbour overlap, bandwidth), why gold is described by free electrons for transport but TB for core levels.
- **Metals/transport:** Drude (equation of motion, τ), Boltzmann view (shifted Fermi sphere, δk=eτE/ħ), only inelastic processes relax; ρ(T) of metals (constant + T⁵/T³ + linear), Wiedemann–Franz, why copper pans vs stainless steel (alloy scattering), Hall effect.
- **Semiconductors:** band gaps (Si 1.1, Ge 0.67, InSb 0.17 eV), E_F position vs DOS, n-doping donor level, T-dependence of E_F (freeze-out, exhaustion at ~50 K), p–n junction.
- **Crystal structure/diffraction:** definition of crystal, allowed rotations (1,2,3,4,6), 230 space groups / 14 Bravais, scattering from a lattice, Ewald sphere, ionic bonding and insulating character.
- **Magnetism and superconductivity:** dia/para/ferro, Curie–Weiss; superconductors (DOS gap in HS20 MC). The 2026 script has **no superconductivity chapter**: check with the lecture.

### Topic weights (all exams)
| Topic | Script ch. (pages) | Evidence | Weight |
|---|---|---|---|
| Real/reciprocal lattice, WS cell, BZ, basis, 2D counting | 1.2–1.3 (5–14) | Problem 1 in all 3 written exams; oral too | **very high** |
| Diffraction: Bragg/Laue/Ewald, structure factor | 1.5 (15–23) | Problem 1 (HS23 ×2), MC g,h,k (HS20), oral | **very high** |
| Phonons: chain dispersion, acoustic/optical, neutron scattering | 2.1–2.3 (38–58) | HS20 MC i; oral: most frequent topic | **very high** |
| Thermodynamics: Debye, Einstein, C(T) | 2.4 (59–65) | MC l (HS20), HS23 2b (Debye Θ, Grüneisen), oral | **very high** |
| Free-electron gas (E_F, S_F, DOS, C_V∝T) | 3.1 (66–76) | Problem 2a in all HS23; MC m (HS20) | **very high** |
| Bloch theorem, nearly-free electrons, tight binding | 3.2 (77–87) | HS20 MC n,p + task 5; oral | high |
| Transport: Drude, ρ(T), scattering, thermal conduction, Hall | 4.1–4.3 (93–110) | 2b (HS23 ×2), HS20 task 3 + MC d,q; oral | high |
| Semiconductors: bands, m*, DOS, n/p, doping, p–n | 5 (113–135) | Problem 3 (all), HS20 MC a,c,o + task 4; oral | **very high** |
| Magnetism: exchange J, Weiss T, saturation field | 6 (136–161) | Problem 4 (HS23 ×2), HS20 MC r | high |
| Bonding types | 1.6 (24–37) | HS20 MC j; oral | low–medium |
| Quasiparticles, ARPES, screening | 3.3–3.4, 4.4 | none | low |
| Superconductivity | not in script | HS20 MC b; oral | ask |

Exam style: heavy on **ratio/scaling reasoning** ("compare A and B") plus standard derivations.

**Game mapping:** Crystal Caverns → Ch. 1; Bragg gate → 1.5 (2D neutron scattering as in HS23 P1); phonon chain → 2.2; Debye vs Einstein → 2.4; unknown-sample detective → Ch. 3/4/5 (Hall, resistivity, C(T)); LED forge → Ch. 5.

---

## 3. Astrophysics I (Refregier)

**Scope rule (user):** the professor follows Choudhuri closely but teaches only about half of it, and slides appear during the term. Goal: know and be able to use everything in Choudhuri chapters 1–11, with exam-driven emphasis from HS24–HS25 below. Chapters 12–13 (tensors/GR) are unlikely beyond FRW/Friedmann and Schwarzschild basics (Ch. 10 covers what the exams used). Re-trim once the slides exist.

**Format (all 4 recent exams, identical):** 15 multiple-choice (3 pt = 45) + 7 open questions (≈64–68 pt), total ≈113. 4 A4 pages of notes.

### Open questions by exam
| Exam | Open questions (pt) |
|---|---|
| **Winter 2025** (4 Feb 2026) | magnitudes + eye resolution (6) · CMB blackbody, Rayleigh–Jeans (10) · MS star T_eff, Wien peak (7) · Plummer sphere (14) · thermal bremsstrahlung cluster L_X via virial (11) · BH accretion growth, Eddington time (8) · radiation era, T(a), BBN (12) |
| **Practice 2025** | angular size/telescope (6) · radiative stellar structure, hydrostatic + ideal gas (10) · thermal energy of the Sun (8) · HII region, ionizing photon balance (6) · virial ⟨v²⟩ (7) · flat rotation curve, escape velocity (15) · Friedmann, a(t) (12) |
| **Winter 2024** | constant-density star, hydrostatic, T(r) (12) · binding energy per nucleon sketch (6) · star counts N(F>F₀)∝F^(-3/2) (12) · galaxy with BH + r⁻² halo, v(r) (12) · spiral vs elliptical (6) · quasar variability → BH mass bound (8) · closed universe, lifetime (12) |
| **Summer 2024** | SN Ia magnitude (4) · CMB: RJ limit, bolometer power, δT (12) · hydrostatic → Eddington luminosity (10) · extinction vs Galactic latitude (12) · virial theorem for N-body (9) · tidal disruption (10) · Friedmann with w, a∝t^α (11) |

### Choudhuri coverage: what recent exams used → section to study first
| Topic | Choudhuri § | Evidence 2024–25 | Priority |
|---|---|---|---|
| Magnitudes, parallax, flux, angular size, coordinates | 1.3–1.4 | every exam (MC + open) | A |
| Radiative transfer: I_ν, τ, S_ν, Kirchhoff, LTE; units | 2.2–2.3 | MC every exam (specific intensity, optical depth, units) | A |
| Blackbody, Wien, Stefan–Boltzmann, RJ, CMB temperature | 2.3, 10.5, 11.7 | 3/4 open, MC | A |
| Hydrostatic equilibrium, ideal-gas/radiative structure, scaling M–L–T, MS lifetime | 3.2–3.4 | 4/4 open | A |
| Eddington luminosity, accretion growth of BHs | 3.6.1, 5.6, 9.4 | 3/4 | A |
| Virial theorem (stars, clusters, galaxies) | 3.2.2, 7.2 | 4/4 | A |
| HR diagram, spectral class, evolution, clusters | 3.5–3.6, 4.5 | MC every exam | A |
| Nucleosynthesis, pp/CNO, binding energy curve | 4.1–4.3 | open (WS24), MC | B |
| Solar neutrinos, helioseismology, SN, exoplanets | 4.4, 4.7, 4.9 | MC (neutrino oscillations), SN Ia open | B |
| WDs, Chandrasekhar, neutron stars, pulsars | 5.2–5.5 | none in 2024–25 | B (needed for boss) |
| Galaxy structure, rotation curve, extinction, populations, ISM (HI, HII, 21 cm, molecular clouds) | 6.1–6.6 | 4/4 (open + 3–4 MC each) | A |
| Stellar dynamics: relaxation, Jeans eq., dynamical friction, Plummer/isothermal | 7.2–7.6 | 4/4 | A |
| Jeans instability, bremsstrahlung, synchrotron | 8.3, 8.11–8.12 | MC + one open (bremsstrahlung) | B |
| Galaxy morphology, AGN, clusters, DM | 9.2–9.5 | 4/4 | A |
| FRW, Friedmann, matter/radiation eras, curvature, age | 10.3–10.7 | 4/4 | A |
| BBN, recombination, DM nature, structure formation | 11.2–11.9 | open + MC | A |
| Inflation, baryogenesis, SZ effect | 11.6, 11.7.2 | MC only (1 per exam at most) | C |
| Tensors, GR, BH | 12–13 | none | skip until slides |

A = every recent exam, B = occasional, C = rare.

**Game mapping:** spectral classification/Wien/HR → Ch. 1–3; pilot a star → Ch. 3–5; Jeans/virial/Eddington → Ch. 3, 7, 8.3; redshift/distances → Ch. 1, 9, 10. Add "AGN accretion" and "Friedmann universe" rooms since both show up in nearly every exam.

---

## Cross-region: Degenerate Matter boss
QM Ch. 2–3 (box states, counting), SS Ch. 3.1 (E_F, DOS, C ∝ T) — both strongly examined —
and astro Ch. 5.2–5.3 (weakly examined recently).

## Open items
- Allowed aids per exam, new QM professor's scope (WKB? density matrices? Lippmann–Schwinger? time-dependent PT?).
- Degen's SS exam may emphasise different chapters; re-weight when his lecture notes/exercises appear. Superconductivity is not in his script.
- Astro: re-weight when Refregier's slides appear.
- Not yet read: QM solutions 1–14, SS solutions (HS20, HS23), QM HS20 and FS21 (scanned), astro solutions. Everything also needs a visual pass before quests are written.

## Next steps
1. Transcribe by priority into `notes/<course>/`: QM Ch. 3 + sheets 4–5 first (current weeks), then Ch. 6, 7, 11; SS Ch. 1, 2, 3.1, 5; Astro Choudhuri §3, 6, 7, 9, 10 (A-topics).
2. Build per-exam solution notes for the recent exams (FS26, HS25 for QM; HS23 for SS; the four Refregier exams) since those become boss fights.
