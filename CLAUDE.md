# Physics RPG — study game for QM, Solid State, Astrophysics

The user has three university exams in about 3 months (around mid-January 2027):
quantum mechanics, solid state physics and astrophysics. This game exists to help
them **study**. It is not a game project that happens to have physics in it.

## Ground rules
- **Studying comes first.** The user writes or reviews content, which counts as studying.
  Claude builds the engine. Time-box engine work: about 1 week for the MVP. After that,
  only build features that directly serve studying. If feature work starts replacing
  study time, say so gently.
- **Exam fidelity.** Problems must match the level and style of the user's real
  exams and exercise sheets in `materials/`, not easy intuition questions.
  Cite the source (file + page/problem number) in every quest file.
- **Physics must be correct.** Double-check numbers, signs and conventions against the
  user's script (their lecturer's notation wins over textbook notation).
- Testing: run quick, targeted checks of new features only, not a full suite each time.

## materials/
`materials/<course>/{scripts,exercises,old-exams,solutions}/` plus `materials/general/`.
These are the user's PDFs. Read them; never modify or delete them.

**The PDFs are full of math (LaTeX) and figures, so plain text extraction is NOT enough.**
pdftotext garbles equations and drops pictures. Use it only for search/indexing.
- **Primary: read pages visually.** Use the Read tool on the PDF with `pages` (max 20 per call),
  or render pages with `pdftoppm -r 150 -png file.pdf notes/pages/<name>` and Read the PNGs.
  For dense equations or small figures, re-render one page at `-r 250`.
- **Transcribe** what matters into `notes/<course>/*.md`, with equations as proper LaTeX
  (`$...$`, `$$...$$`) using the lecturer's notation, and describe figures in words
  (axes, curves, what the plot shows), because figures carry the physics intuition.
- **Figures for the game:** `pdfimages -png file.pdf notes/figures/<name>` extracts embedded
  images. Vector plots aren't embedded images, so crop them from the rendered page instead.
- **Search index:** `pdftotext -layout` → `notes/extracted/` for grep only. For scanned files,
  run `ocrmypdf -l deu+eng in.pdf out.pdf` first.
- Never write into `materials/`. All derived files go in `notes/`.
- First pass: build `notes/syllabus.md`, the topic list per course mapped to script chapters,
  plus how often each topic appears in old exams (that sets the content priority).
  Work course by course and page-range by page-range; don't try to read everything at once.

## Game design (agreed in brainstorm, 2026-10-13)
**Core loop: predict → observe → explain/calculate.** The player enters an experiment room,
predicts the outcome, the 3D sim runs (and fails visibly if the prediction was wrong), and
then they calculate the quantity that unlocks the door.

**Regions** (one per course):
- QM "Interference Labs": Stern–Gerlach chains, double slit + which-path detector,
  tunneling bridge (T ≈ e^(−2κa), STM side quest), hydrogen lamp/Rydberg + Zeeman
  (perturbation theory), harmonic oscillator elevator (ladder operators).
- Solid State "Crystal Caverns": real/reciprocal lattice, Brillouin zones as dungeon map,
  Bragg gate, unknown-sample detective quest (Hall, resistivity, C(T)), diatomic phonon
  chain, Debye vs Einstein (T³), LED band-gap forge.
- Astro "Observatory Ship": spectral classification/Wien/HR diagram, pilot a star's
  evolution, Jeans/virial/Eddington, redshift and distances.
- Cross-region boss "Degenerate Matter": the Fermi gas as it appears in QM, metals and
  white dwarfs/neutron stars (Chandrasekhar).

**Calculation combat:**
- Normal fights are multi-step problems with checkpoints (numeric with tolerance, or symbolic).
- Quick fights are Fermi estimates.
- Bosses are full old-exam problems: solved on paper under a timer, final answers entered.
- Failed problems respawn on a spaced-repetition schedule. Hints cost XP;
  unit/dimension checks give a bonus.

**Tech:** Three.js web game with low-poly visuals and minimal assets. KaTeX renders LaTeX.
Content is data: one YAML/JSON file per quest/problem, so adding content never needs code.

## Open questions (ask the user if still unanswered)
1. Exam format: written or oral? If oral, add examiner-style "explain" rounds.
2. Textbooks used (Griffiths/Sakurai, Kittel/Ashcroft–Mermin, Carroll & Ostlie?)
3. Content language: German or English?
4. Realistic study hours per day.

## Parallel sessions and content format (added 2026-10-13)
Several Claude sessions may work at the same time (one per course). Read `docs/CONTENT.md` (quest/room file format,
quality bar, ownership of folders) and `docs/PARALLEL_SESSIONS.md` before adding content. The engine lives in `game/src/`
(Three.js first-person hall, KaTeX panel); the reference room is `game/content/qm/tunneling-bridge.json`.
Tests: `node game/test/sim-check.mjs && node game/test/content-check.mjs && node game/test/e2e.mjs`.
