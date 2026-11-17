# Brief for the next session (written 2026-11-16)

Read `CLAUDE.md`, `docs/CONTENT.md`, `docs/HOW_THE_GAME_WORKS.md` and this file first. Exams are mid-January 2027
(QM, solid state, astrophysics). The user is busy with weekly exercise sheets and currently does **not** play the game.
**Goal: the game replaces working through the script and the exercise sheets.** Everything below serves that goal.
Each finished piece is committed and pushed to `claude/game-server-website-migration-ikz0nf`; the user deploys with `rpg-update`.

## Hard rules
- **Never delete or weaken content** (lessons, exercises, labs, sims, sheets, links, progress data). Reorganise, hide behind
  menus, restyle: yes. Remove: no. If something seems redundant, ask.
- Physics must be correct and in the lecturer's notation (the QM and solid-state scripts are German). Cite the source file and
  page or problem number in every content item. Check numbers against the official solutions.
- Never write into `materials/`. **Never commit the big PDFs, slides, videos or notebooks into git** (size limits: 100 MB/file,
  repo should stay well under 1 GB). Keep them outside the repo or in a git-ignored folder; commit only derived notes
  (`notes/<course>/...`, `notes/extracted/*.txt`) and game content.
- Run targeted tests for what you change (`game/test/run-tests.sh quick` is about a minute). Don't push red tests.

## Inputs
- **Solid state:** the user uploads all exercise sheets, solutions and course aids (lecture slides, animations, notebooks) as
  assets of a GitHub **release** in `fumeia/physics-rpg`. List them with the GitHub tools (get_latest_release / list_releases),
  download into a scratch folder, unpack, and work from there. If a download is blocked, read the environment docs
  (`read_documentation`) and tell the user what to change instead of guessing.
- **QM:** complete. All 14 sheets and solutions are in `notes/extracted/quantum-mechanics_{exercises,solutions}_*.txt` and in
  the game (`game/content/qm/sheets.json`, built from `notes/quantum-mechanics/build/sheets/`).
- **Astrophysics:** no exercise sheets needed. The lecture copies its exercises from Choudhuri, and all 89 Choudhuri exercises
  are already in the game (`game/content/astrophysics/choudhuri-exercises.json`). Treat those as the astro "sheets".

## Priorities (in this order; finish and push each before starting the next)
1. **Solid-state sheets in the game**, exactly like the QM ones: every question as a sheet encounter in its room, official
   solution as reveal steps, key points, two-way links to the related lessons/exercises, due dates in the Sheets tab.
   Generalise the QM builder (`qm_sheet_lib.py`, `build.py`) instead of copying it. Use the slides/notebooks/animations to
   improve the matching lessons and labs (cite them), don't just store them.
2. **Hints on every sheet question** (QM and solid state, and the Choudhuri exercises): 2–3 graded hints per part
   (nudge → method → key step), revealed one at a time, costing a little XP like the existing hint system. They must lead the
   user to the solution without giving it away.
3. **"Theory first" primers for all sheet questions.** The style is approved: copy the format of
   `notes/quantum-mechanics/build/sheets/qm_primers.py` (sheet 9 is the template: question in plain words, picture, the few
   formulas with their meaning, tiny example, what the sheet needs, exact script section/pages/equation numbers). QM sheets 10
   onwards first (current ones), then 1–8, then solid state. Then the most exam-relevant Choudhuri exercises.
4. **Exam readiness.** Per course, a clear view of: script chapter → lesson → sheet questions → old-exam questions, with what
   is done, weak, and due. Old exams as timed bosses already exist; make sure every exam topic (see `notes/syllabus.md`,
   frequency in old exams) has practice, and say which topics have none.
5. **Declutter and navigation.** The HUD and menus are crowded and hard to find things in. Make the start screen answer
   "what do I do now?": this week's sheets, due reviews, one exam-style problem. Fewer, clearer buttons, everything else one
   level deeper. Keep keyboard shortcuts. Light and dark theme both must look right (`?theme=light`).
6. **Look and feel.** Make it nicer to look at and more enjoyable (cohesive art style, lighting, transitions, feedback,
   rewards), but **lightweight**: the user's laptop is ~10 years old with 4 GB RAM. Add a graphics quality setting with an
   automatic low mode (lower resolution, no shadows/post-processing, fps cap, fewer holograms) and measure memory and fps in
   low mode. Higher settings may upscale for better machines.
7. **Native Linux app (optional, time-boxed).** The user asked for a Rust Linux release that syncs with their server.
   Do **not** rewrite the game in Rust: that would take weeks and risk the content. If anything, wrap the existing web build
   in Tauri (Rust shell, small footprint), syncing progress with the server like the website does. On Linux, Tauri uses
   WebKitGTK, whose WebGL can be slower than Chromium on old hardware, so first compare it with simply installing the site as
   an app from Chromium. If the wrapper isn't clearly better, say so and recommend the website. Never let this delay 1–5.

## Working style
- Studying comes first. The user reviews content on the phone; keep reports short and say exactly where to find new things.
- Ask the user before big design changes (navigation, layout, art style): a screenshot or two plus a yes/no question.


---
## Status after the session of 2026-11-16/17 (branch `claude/affectionate-babbage-d862tl`)

**Done**
- Priority 1: solid-state problem sets 1–9 (27 questions, figures, links, numbers checked) and 74 lecture concept questions from the
  slides (`notes/solid-state/build/sheets/`, `.../slides/`; see `notes/solid-state/README.md`). One shared builder: `notes/build/sheetlib.py`.
- Game layer (the user asked for "a real game", not a menu collection; nothing was deleted):
  - **Campaign** (`C`, `src/campaign.js` logic, `src/campaignui.js` screen, `content/campaign.json` schedule): a tile per lecture week and
    course, weeks behind "the ghost" (lecture pace), placement on first use, weeks done on paper can be marked.
  - **Today's run** (`G`): warm-up, theory then its exercise for the course furthest behind, forks ("take the risk" for bonus XP),
    summary, honest run streak (one forgiven day a week), weekly chest, weekly bosses (the sheet due next; its theory is its armour).
  - **Fights with stakes** (`src/battle.js`): every exercise has an enemy with HP, a focus bar, combos and a grade. It only watches the
    panel (like `feedback.js`); it never decides whether an exercise is passed. Setting `fights: 'off'` in `settings` disables it.
  - **Compact top bar** (run, campaign, menu); the full row is one tap away in the menu, every shortcut still works. Tests keep the full
    row unless the URL has `hud=compact`.
  - **Graphics governor** (`src/quality.js`): auto / high / medium / low / minimal (resolution scale and fps cap), and the 3D view idles
    at 12 fps while an exercise is only being read. Measured on software rendering at 1366x768: 8.5 / 12 / 17 frames per second for
    high / low / minimal, JS heap 14–32 MB.

**Open, in the order of the brief**
- Priority 2, hints: the engine is ready. A sheet or book step may carry `hints: [nudge, method, key step]`; they are shown one at a
  time for 2 XP each (`STEP_HINT_COST`). For sheets put them in `ss_hints.py` / `qm_hints.py` as `HINTS = {(sheet, q): [[h1, h2, h3], ...]}`
  (one list per part, in part order; the builders already import these files if they exist). For Choudhuri add `hints` to the steps in
  `notes/astrophysics/build/choudhuri/`. Add a check that no hint contains the final result.
- Priority 3, primers: unchanged format (`qm_primers.py`); the solid-state builder imports `ss_primers.py` (`PRIMERS = {(sheet, q): html}`).
- Solid state: when the user uploads Problem Sets 1–2 and Solution Set 9, replace the reconstructed statements and our own solution of
  sheet 9 (both are flagged in the sources). The **ISSP Test Exam HS26** (scanned, 11 pages, in the release zip) is not in the game yet:
  it should become boss encounters (read it visually, it has no text layer). The script summary PDFs are scans too.
- Priority 4: an exam-readiness view per topic is still missing (the campaign shows weeks, not exam topics).
- Game ideas agreed with the user and not built yet: formula cards as loot, the exam as a final dungeon from mid-December, more
  "juice" (sounds are off by default), rooms that look overrun until their week is cleared.

**Running the tests here**: `game/node_modules/playwright-core` must link to the installed package and `CHROMIUM=/opt/pw-browsers/chromium`.
Run with `JOBS=1` (three browsers in parallel were killed for memory in the cloud container).


---
## Added on 2026-11-17 (second half): game features, mostly NOT browser-tested
The user asked to stop spending usage on tests and to have another model test and fix. Each item below was syntax-checked
(`node --check`), the pure logic has Node tests (`campaign-check`, `memory-check`, `quality-check`), and one boot check showed the
campaign rendering with all sections. `test/campaign-smoke.mjs` was being adapted to the practice stops when testing stopped: it has
not been run since; run it first and fix it or the code.

| Feature | Where | To verify |
|---|---|---|
| Hand-ins first per course (default on unless more than 3 weeks behind) | `campaignui.js` `handIn`, `dueSoon` | toggle in the course header rebuilds an unstarted run |
| Catch-up date from the measured pace (needs 3 finished runs) | `campaignui.js` `pace` | `runLog[].gain` is written at the end of a run |
| Compact menu (6 buttons), gear = settings, practice hub with 5 tabs + More, map with Nexus and connections | `main.js` `compactMenuHtml`, `settingsHtml`, `renderStudy`, `mapHtml` | phone layout; the long menu is still used when the top bar is set to "all buttons" (tests) |
| Memory model: passes fade, rooms get overrun again, fading week tiles, defend stops | `memory.js`, `main.js` (`mem` flag, `setThreat`), `campaign.js` `defend` | retention numbers, that defend stops reappear sensibly |
| Triage: "only skim this week" (done when theory is read), exam weight from `content/radar.json` | `campaign.js` `weekStatus(…, skim)`, `campaignui.js` `weekWeight` | skim excludes the week's exercises from the run |
| Grade forecast per course (1–6) | `memory.js` `forecast`, `campaignui.js` `grades` | the formula is a rough invention: calibrate against the exam hall's real grades |
| Scout stop (first lesson of the coming week when nearly level) | `campaignui.js` `freshRun` | |
| Practice stops: blitz (drills), mistake hunt, explain-it (Feynman): count as done once opened | `campaignui.js` `doAction`, `stopState` | better: mark done only when the tab's activity was really completed |
| Resonance bonus (+15 XP when two stops of a run are linked by `links.json`) | `campaignui.js` `onProgress` | "show the connection" button |
| Bonus goals = the daily missions shown inside the campaign; ghost report for the week | `campaignui.js` `weekHtmlRow` | |
| Nemesis: an open mistake on the exercise shows on the enemy; 3 wins close the mistake | `battle.js` | closing mistakes automatically: confirm the user wants that |
| Formula cards: lesson equations as loot, play in fights (wears 3 charges, counts like a hint for the grade), recharge by cold recall | `cards.js`, `battle.js` drawer, `main.js` | KaTeX in the drawer, phone layout |
| Rematch ladder: fights won with grade B/C come back after 7 days as defend stops | `battle.js` `gradeBook`, `campaignui.js` `rematchIds` | |
| Exam dungeon: 3 old-exam problems, timed, hints/cards/primers hidden (`body.dungeon`), +40 XP each; armour per exam topic with holes | `campaignui.js` `armour`, `enterDungeon`, `dungeonHtml` | the timer is only displayed, not enforced; boss panels have their own timer |

Known rough edges: the run's minute estimate grows with practice stops; `fights: 'off'` has no switch in the settings screen yet;
the battle bar's first-try detection is heuristic; action stops are not in the "Next →" queue (G continues the run).


## Added 2026-11-17 (third part): exam-aid rules. QM has no aids; solid state and astro allow a five-page summary. Untested in the browser except one boot check.
| Feature | Where | To verify / improve |
|---|---|---|
| **Forge** (Practice → Forge): write a QM formula from memory, reveal, self-check; per-formula memory (`flags.forge`); "Rebuild it" chains; "All formulas" | `content/qm/forge.json` (16 formulas, standard forms: **check notation against the QM25 script**), `src/forgeui.js`, `test/forge-check.mjs` | add more formulas; the run adds a `@forge` stop when formulas are due |
| **Blank page**: one QM room, ten-minute timer, then a checklist of that room's lesson equations (`flags.blankLog`) | `forgeui.js` `blankHtml` | the checklist uses raw lesson equations; curated lists per chapter would be better |
| **My summary** (Practice → My summary): pin earned formula cards to five pages (34 per page), notes per page, print to PDF (`flags.summary`) | `forgeui.js` `renderSummary` | the print window, KaTeX fonts in print, phone layout |
| **Sheet-only fights**: in solid-state and astro fights the Cards button is "My summary" (only pinned formulas, free to use; adding a missing one counts like a hint) | `main.js` (battle cards for `cid !== 'qm'`), `battle.js` `drawSummary` | |
| Notifications follow the campaign (`flags.campaignStat` → `deploy/notify.py` `campaign_message`); `?suggest=run`, `?run=1` | `campaignui.js` `stat`, `notify.py`, `serve.py` | add tests to `deploy/test_notify.py` for the four campaign slots |
Not built: formula locks on QM doors (needs the door logic in `world.js`/`main.js`; do it with a Forge card, not typed LaTeX).

## Derivations screen (Practice → Derivations), 2026-11-17
Ten QM derivations the old exams ask most (`notes/quantum-mechanics/build/derivations/build.py` → `game/content/qm/derivations.json`,
priority from `content/radar.json`), each with: ladder (order the lines → fill the gaps → write from the moves → blank page, one rung per
visit, `flags.derivs`), moves, "why is this step allowed?", a variant with one assumption changed, backwards, and a two-minute outline.
The run adds a `@deriv` stop (runs of 40 minutes or more). `node game/test/derivs-check.mjs` checks the content and LaTeX.
To do: check the notation against the QM25 script; add more derivations (time evolution of spin in a field, 3D oscillator, hydrogen
radial equation, Clebsch–Gordan for 1⊗½, golden rule); the ladder's "order" rung was only boot-checked.

## 2026-11-17: QM sheet 10 and the chapter 7 pack
- QM sheets now due on this year's Mondays (dueShiftDays 362). Sheet 10 Q2 (projective representations of Z2xZ2) added with
  our own solution (cocycle verified numerically on all 16 pairs; official solution not out yet: compare once it is).
- `game/content/qm/ch7-reading.json`: lessons qm-sym-L1..L3 (script 7.1-7.8), derivations qm-sym-D1..D4, quiz qm-sym-Q1, and the
  map of encounters to the lecturer's explainers. Engine: `enc.read` strip in encounters.js mount(), HEAD probe in main.js.
- To test: strip appears only with game/private/ch7 installed (deploy/ch7pack.py); links open in a new tab; phone layout.

## 2026-11-17 (later): content round
- Astro coverage map (`notes/astrophysics/coverage.md`) and gap lessons (`astrophysics/gaps.json`).
- Solid-state test exam HS26 as quiz + 2 bosses (`solid-state/test-exam.json`), Miller figure cropped from the scan.
- Run fix: "Next encounter" follows the run queue (main.js openEncounter, campaignui startRun(skipId)).

## 2026-11-17 (later still): guided reading of the scripts
- `notes/solid-state/build/reading/build.py` -> `game/content/solid-state/reading.json`: 26 guided-reading cards (lesson, tier
  'reading', `reading: true`, `week`), one per script section group, with before / read (pages) / think (answer in <details>) /
  slip blocks and two checks. Slips flagged: summary 4.3.1 (T^2 vs linear), (5.51)-(5.53) exponent, E_d, J sign convention.
- campaign.js: weeks get a `reading` bucket (never counts for week completion); buildRun adds the next unread card as a `read`
  stop before the week's lessons, and `reread` stops from the optional second pass (flag `reread` {course: {from, since, done}}).
- campaignui.js: second-pass control per course track ("from week N"), counter, listing in the week panel; trimming order puts
  the second pass above the Forge/derivation extras. Tests: campaign-check (bucket, reread), reading-smoke (browser).
- Next: the same reading cards for QM (chapters 8-11 first) and, once slides exist, astro.
