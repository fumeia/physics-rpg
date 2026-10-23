# Solid State: content status (Crystal Caverns)

Written by the solid-state content session. Engine files were not touched (requests in `docs/ENGINE_REQUESTS.md`).

**Build**: the room JSON is generated: `python3 notes/solid-state/build/build.py` (sources `r1.py`..`r7.py` = calc fights and bosses,
`x12.py`, `x34.py`, `x567.py` = lessons, quizzes, derivations). Do not hand-edit `game/content/solid-state/*.json`.
Each room runs lessons → quiz → derive → calc → boss (same format as the astro session's proposal). Encounter ids are namespaced
`ss-<room>-<id>` (`lat, bon, pho, fer, dri, sem, mag, deg`) so progress in `store.js` cannot collide with QM (`c1`, `b1`) or astro.
Totals (8 rooms): 14 lessons, 8 quizzes (48 questions, including all text-answerable HS20 MC items), 8 derivations,
32 calc fights, 8 bosses.

## What exists
| Notes | Game room (`game/content/solid-state/`) | Encounters | Based on |
|---|---|---|---|
| `01-crystals-and-diffraction.md` | `lattice-gate` | 2 calc, 1 quick, boss BaTiO3 (HS20 T2) | script 1.2–1.5; HS23 Jan/Aug P1; HS20 |
| `07-bonding.md` | `bonding-grotto` | 1 lesson, quiz, derive, 3 calc, 1 quick, boss (constructed) | script 1.6; HS20 MC (j) |
| `02-phonons-and-heat.md` | `phonon-halls` | 3 calc, 1 quick, boss (constructed chain problem) | script 2; HS20 MC; oral protocols |
| `03-electrons-and-transport.md` | `fermi-sea`, `drift-corridor` | 2+1 quick+boss M-point (HS20 T5); 3+1 quick+boss pressure (HS23 Aug 2a/2b) | script 3, 4; HS23 P2; HS20 T3, T5 |
| `04-semiconductors-and-magnetism.md` | `semiconductor-forge`, `magnet-vault` | 4 calc, 1 quick, boss Aug P3; 3 calc, 1 quick, boss Aug P4 | script 5, 6; HS23 P3, P4; HS20 T4 |
| `05-cross-course-links.md` | `degenerate-core` (cross-region boss "Degenerate Matter") | 5 calc, boss | script 2.4, 3.1; Choudhuri §5.2–5.3; QM sheet 3 |
| `06-hs20-multiple-choice-and-concepts.md` | HS20 MC items are in the room quizzes (figure-only ones stay here) | – | HS20 task 1 and its key |

`game/src/rooms/solid-state.js`: seven procedural 3D showpieces (`buildRoom(world, room)`), engine hook requested.

## Tests (run from the repository root)
- `node game/test/content-check-solid-state.mjs`: about 1080 checks. Answers vs the printed keys (HS20, HS23 Jan, HS23 Aug) and vs independent numerics (quadrature of Debye and Fermi–Dirac integrals, Jacobi diagonalisation of the $4\times4$ M-point problem, numerical canting minimisation, brute-force lattice-point count).
- `node game/test/latex-check-solid-state.mjs`: every math segment parses in KaTeX.
- `node game/test/scene-check-solid-state.mjs`: the 3D scenes build, animate and dispose (Node smoke test, no browser).

## Places where the printed keys and the script disagree (flagged inside the rooms)
1. **HS23 Jan and Aug, Problem 4: saturation field.** The keys print $8J_2S/g\mu_B\mu_0$ (brick wall) and $16J_2S/g\mu_B\mu_0$ (triangular). With the script's convention (every bond counted once, as in its $T_W$) the result is half of that: $2J_{\rm AF}S/g\mu_B\mu_0$. Checks: two-spin singlet–triplet crossing, the exact $S=\frac12$ chain ($2J$) and square lattice ($4J$), numerical canting minimisation. If Degen's key convention differs, adapt, but never mix conventions between $T_W$ and $H_{\rm sat}$.
2. **HS23 Jan, Problem 3(f): intrinsic chemical potential.** Key: $\frac{k_BT}2\ln2$; consistent derivation and numerical Fermi–Dirac root finding: $\frac{k_BT}{4}\ln2$.
3. **HS23 Aug Problem 2b: Wiedemann–Franz** printed as $\pi^2k_B^2/2e^2$; script (4.41) has $\pi^2/3$. Only ratios were asked.
4. **Sign of $J$**: the script has $H=-\sum J\vec S\cdot\vec S$ ($J>0$ ferro); Zheludev's exam sheets use $H=+\sum J\vec S\cdot\vec S$ and $T_W=-J_{\rm total}S(S+1)/3k_B$. HS20 MC (r) uses $J>0$ = ferro again.
5. **"Scattering angle"** in the neutron problems: the key gives the Bragg angle $\theta$; the angle between $\vec k_i$ and $\vec k_f$ is $2\theta$ (both are asked for in the game).
6. File mapping: `HS23 (Solution) (1).pdf` is the **Jan 2024** solution (a=6, b=4 Å, honeycomb magnets, direct-gap semiconductor); `HS23 (Solution).pdf` (headed "Exam FS2024" in its text layer) is the **Aug 2024** one (a=4, b=5 Å, triangular magnets, indirect gap).
8. Script Ch. 1.6: $R_{\min}\approx1.3\sigma$ (should be $2^{1/6}\sigma$) and Table 1.2 cohesion energies (eq. 1.47 gives $1.04\times10^5$ K per NaCl pair, not $1.8\times10^4$ K). See `07-bonding.md`.
7. A slip made while building the content and caught by the check: Debye's $T^3$ law as a fraction of Dulong–Petit is $\frac{4\pi^4}{5}(T/T_D)^3$, not $\frac{12\pi^4}{5}(\ldots)$ (the latter is $C_V/Nk_B$).

## Open questions for the user (do not block anything)
- Does Degen's course examine superconductivity (HS20 MC (b),(s); not in the 2026 script) or a magnetism sign convention of its own? Ask in the lecture.
- Which sign convention for $J$ will the exam use? (Content follows the script, bosses follow the exam they come from, and every problem states which.)
- Are the oral-protocol topics (phonon chain derivation, specific heat) still relevant for a written exam? Included as a concept checklist only.
