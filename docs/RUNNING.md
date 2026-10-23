# Running the game on your PC

You need: **Python 3** (any version from 3.8; check with `python3 --version`) and a browser (Chromium, Chrome or Firefox).
Nothing else: no npm, no internet (Three.js and KaTeX are inside `game/vendor/`).

## Start

```sh
cd /path/to/physics-rpg/game      # the folder that contains serve.py and index.html
python3 serve.py
```

Open **http://127.0.0.1:8123** in the browser. Stop the server with `Ctrl+C`.
Click the start screen, press **P** once to create your profile (or keep "default"), then **F1** for the controls.

Shortcut: `./run.sh` starts the same server and opens a Chromium app window (without browser bars).

## Where your progress is

- Every profile is a file: `game/profiles/<name>.json` (plus the 5 latest backups `<name>.json.bak1` ... `.bak5`).
- The browser also keeps a copy (localStorage). If you clear cookies, the game restores from the file at the next start.
- The top bar shows `<profile> · saved` when the file is up to date; `browser only` means the page was opened
  without `serve.py` (for example by double-clicking `index.html` or with `python3 -m http.server`). Then use
  P -> "export progress file" and "import" to move your progress by hand.
- **Back up** by copying the `game/profiles/` folder. Moving to another PC: copy that folder into the new `game/`.
- Several people or devices can use one server: make one profile per person.

## Useful options

```sh
python3 serve.py --port 9000                 # another port if 8123 is taken
python3 serve.py --host 0.0.0.0              # reachable from other devices in your network (phone, laptop)
PHYSICS_RPG_TOKEN=secret python3 serve.py --host 0.0.0.0   # requires a token; see below
PHYSICS_RPG_PROFILES=/home/you/rpg-saves python3 serve.py  # keep the save files in another folder
```

With `--host 0.0.0.0` open `http://<IP of your PC>:8123` on the other device. Without a token anybody in the same network
can read and overwrite your profiles, so use it only at home or set a token. Enter the token once in the browser
console of that device: `localStorage.setItem('physics-rpg-token','secret')`, then reload.

## Moving to a real server later

Copy the `game/` folder to the server, run `PHYSICS_RPG_TOKEN=... python3 serve.py --host 127.0.0.1 --port 8123`
behind a reverse proxy with HTTPS (nginx or Caddy), and copy your `profiles/` folder along. Nothing else changes.

## If something does not work

| Problem | Fix |
|---|---|
| `Address already in use` | Another program uses the port: `python3 serve.py --port 8124` |
| Blank page or `Failed to start` | Press F12 -> Console and read the first red error; reload with Ctrl+Shift+R (old cached files) |
| Top bar says `browser only` | You are not on the address printed by `serve.py`; open http://127.0.0.1:8123 |
| 3D is slow | P -> graphics "fast (lower resolution)"; close other tabs; enable hardware acceleration in the browser |
| Mouse look does not work | Click the 3D view once; Esc frees the mouse |
| Lost progress | Look in `game/profiles/` (the `.bak` files), or P -> import a file you exported earlier |

## Tests (optional, for development)

```sh
cd game && npm install            # only once, installs the headless-browser driver
node test/exam-check.mjs && node test/content-check-qm.mjs   # quick logic checks, no browser
node test/rooms-smoke.mjs         # loads every room in a headless browser (needs Chromium)
```
