# Physics RPG: study game for QM, solid state and astrophysics

Run (progress is saved to a JSON file per profile):

    cd game && python3 serve.py          # http://127.0.0.1:8123, profiles in game/profiles/<name>.json
    python3 serve.py --port 9000 --host 0.0.0.0   # on a server; set PHYSICS_RPG_TOKEN=secret to require a token

`./run.sh` starts the same server and opens an app window if Chromium exists. Any static server also works
(then progress is kept in the browser only; use P -> export/import). Keys: F1 in the game.

- Profiles: P in the game. Progress lives in localStorage and is mirrored to `profiles/<name>.json` (atomic, 5 backups);
  after clearing the browser or moving to a server (copy the `profiles` folder) nothing is lost.
- Exam hall (X): per course mock exams (timer, points, Swiss grade 4.0 at 50 %, 6.0 at 82.5 %, history chart).
- Nexus (start room), guide route, daily missions (T), formula drawer (B), connections (K), labs, "What if?" explorer after every fight.
- Content is data: `content/<course>/*.json` (see `../docs/CONTENT.md`), rooms in `src/rooms/`, models in `src/labmodels.js`.

Touch screens: the full 3D game with an on-screen stick, drag-to-look and an action button (E); formulas and the exercise can be open together
(`?touch=0` off, `?lite=1` for the old lists-only phone menu). Tests: `node test/touch-smoke.mjs`, `node test/theme-smoke.mjs`, `node test/features-smoke.mjs`, `node test/store-check.mjs`, `node test/notify-parity.mjs` (the notifier in `deploy/notify.py` agrees with the game), `node test/remind-smoke.mjs` (start now / remind me later), `node test/desktop-smoke.mjs` (the PC experience), `node test/start-smoke.mjs` (start screen, one tap); Python: `python3 deploy/test_notify.py`.

Study habit features: daily goal in minutes (Profile > settings), streak with one free missed day per week, Quick session (Menu or Missions), This week (Study hub), sounds and vibration for right answers.
Light theme ("white room") and the controls mode (touch / keyboard and mouse): Menu or Profile > settings.

Run the tests side by side: `test/run-tests.sh` (all, about 2 minutes), `test/run-tests.sh quick` (about 30 seconds) or `test/run-tests.sh touch desktop-smoke` (just those).

Tests (node, plus headless Chromium via `test/setup-chromium.sh`):

    node test/labs-check.mjs && node test/missions-check.mjs && node test/explorer-check.mjs
    node test/content-check.mjs && node test/content-check-qm.mjs && node test/content-check-solid-state.mjs
    node test/content-check-astrophysics.mjs && node test/content-check-blitz.mjs && node test/content-check-links.mjs
    node test/exam-check.mjs           # grade scale, mock exam builder
    node test/exam-smoke.mjs           # exam hall in the browser
    node test/pile-smoke.mjs           # the "look later" pile
    node test/rooms-smoke.mjs          # loads every room, opens every encounter, drives every lab
    node test/e2e.mjs                  # plays through the game (about 6 minutes)
