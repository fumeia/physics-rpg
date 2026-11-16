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
