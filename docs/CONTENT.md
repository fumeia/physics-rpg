# Content guide (for anyone adding quests: QM, Solid State, Astro)

Read `/projects/physics-rpg/CLAUDE.md` first (ground rules: exam fidelity, correct physics, cite sources,
studying comes first). This file explains how a quest is written as data so no engine code is needed.

## Where things live
- `materials/`: the user's PDFs. Never modify.
- `notes/<course>/`: transcriptions with LaTeX; `notes/syllabus.md`: topic priorities (read it).
- `game/content/<course>/<room>.json`: one file per room; `game/content/<course>/index.json` lists rooms.
- `game/src/`: engine. Do not edit `encounters.js`, `store.js`, `expr.js`, `player.js` without telling the owner
  (the engine owner is the main Claude session). Per-course 3D scenes go in `game/src/rooms/<course>.js`.

## Room file (`game/content/qm/tunneling-bridge.json` is the reference)
```
{ id, region, title, course, topics[], sources[{file, where}], intro,
  encounters: [ predict-observe | calc | boss ... ] }
```
Every room cites its sources (file + page/problem number): a quest without a citation is rejected.
Strings are HTML with KaTeX math: `$...$` inline, `$$...$$` display. Write LaTeX in the lecturer's notation.

### Encounter types
- `predict-observe`: `{type, id, title, setup, symbols[[sym, meaning]], question, options[], correct, whyWrong{index: html}, explain, derivation[{title, html}], variant{...}}`
  `variant` holds the simulation parameters (QM tunneling: `EoverV0`, `L` multiple of 0.2). New simulations implement the
  `TunnelSim` interface (`src/sim.js`): `step()`, `done`, `probabilities()`, `t`, `tEnd`. **Every wrong option needs a `whyWrong` entry** and
  `derivation` must show where the formula comes from (setup, solution in each region, matching conditions, result, limits, the
  numbers of this run) and define every symbol (`symbols`). A bare formula is not an explanation.
- `calc`: `{type, id, title, fight: "normal"|"fermi", problem, symbols, vars{}, steps[], derivation?, unlocks?, xp}`.
  Train processes and equations first, numbers last. Step kinds (field `kind`, default `numeric`):
  - `choice`: `{prompt, options[], correct, why{index}, after?}` pick the right equation/statement; each distractor is a typical error and gets a `why`.
  - `symbolic`: `{prompt, answer, symbols{name:[min,max]}, constraint?, units[], unit, latex, hint, after?}` the player types an expression;
    it is accepted if equal to `answer` at 6 random points (`checkSymbolic` in `src/expr.js`), so any algebraically equal form passes.
    `unit` is the dimension of the result (pick from `units`), the dimension check.
  - `order`: `{prompt, items[{text, note?, why}], hint}` items are listed in the correct order in the file and shuffled for the player;
    `why` explains why the step cannot come earlier. Use it for derivations.
  - `numeric`: `{prompt, answer(expr), unit, units[], tol, tolType?: "rel"|"log", hint, bonus?}`: keep to one bonus plug-in-the-numbers step.
  `answer` expressions of numeric steps use `vars`, earlier numeric step ids and the constants `me, hbar, eV, pi`
  (add SI constants to `CONSTANTS` in `src/expr.js` when a course needs them) and `sqrt, exp, log, log10, sinh, cosh, sin, cos, tan, abs`.
  Tolerances: 2-5 % for multi-step numerics; log tolerance 0.1 for factors spanning decades.
- `sandbox`: `{type, id, title, intro, symbols, defaults{...}}` free exploration of a simulation with sliders and "guess first" comparisons
  (implemented for the barrier in `mountSandbox`; another course adds its own mount function in `src/encounters.js` via an engine request).
- `boss`: `{type, id, title, source{file, where}, minutes, instructions, statement[], finalAnswers[{id, prompt, answer, vars, tol}], keyPoints[], xp, requires?}`
  A full old-exam problem on paper with a timer; key points are self-graded. Cite the exam.
- Room-level `tutorial: [{title, html, look:{x,z,pitch?}, focus?}]` is shown on the first visit (and via the "? Tutorial" button): what is every object
  in the room and what do the quantities mean. A new room needs its own tutorial.
- Spaced repetition: failed encounters respawn after 1, 3, 7, 16 days (handled by `store.js`).

## Quality bar for a quest (exam fidelity)
1. Match the real exam's level: multi-step, symbolic derivation or numeric with realistic constants.
2. Every number you put in an answer expression has been checked: write a node check in
   `game/test/content-check-<course>.mjs` (see `content-check.mjs`): evaluate all answers and compare to values
   you computed independently (by hand or a script). Run it before declaring the quest done.
3. Use the lecturer's notation and conventions (say when the script changes convention).
4. `explain`, `hint`, `why` and `derivation` teach: state the formula or the idea and where it comes from, not just the result.
5. Validate all KaTeX in your file (every `$...$` must render); the content test of the reference room shows how.

## Adding a room
1. Write notes in `notes/<course>/` (transcribe the relevant script pages and sheets; describe figures in words).
2. Write `game/content/<course>/<room>.json` and add the room id to `index.json`.
3. Write the 3D scene in `game/src/rooms/<course>.js` exporting `buildRoom(world, room)` (see `src/world.js`
   for building blocks: `flat()`, `glow()`, terminals, doors) or reuse the generic hall layout.
4. Test: `node game/test/content-check-<course>.mjs`, then the browser test `node game/test/e2e.mjs`.

## Ownership (to avoid edit conflicts when several Claude sessions run in parallel)
- Engine, QM content: main session. Solid-state content: its own session. Astro content: its own session.
- Each session edits only `game/content/<course>/`, `game/src/rooms/<course>.js`, `notes/<course>/` and its own tests,
  plus shared docs by appending. If the engine needs a change, write it down in `docs/ENGINE_REQUESTS.md`.

## Notes from the Astro session
- Powers in `answer` expressions are `**` (JS `^` is XOR). Constants not in `expr.js` go in each quest's `vars`.
- The HS24 summer key prints 2.5 pW for the K-band bolometer problem; the correct value is 1.77 pW (see
  `notes/astrophysics/01-light-and-radiation.md`). Always re-derive keys before using them as answers.
- Astro rooms are generated from `notes/astrophysics/build/rooms/*.mjs` by `node notes/astrophysics/build/build.mjs`,
  which also writes `codex.json` and markdown study guides. It uses three proposed encounter types (`lesson`, `quiz`,
  `derive`) for theory, intuition and exam multiple choice: the format is in `docs/ENGINE_REQUESTS.md` §3.
