# Hosting the game 24/7 (Hetzner or any Linux server) and using it on your phone

The game is static files plus `serve.py`, which saves your profiles as JSON files. On a server you want three things:
HTTPS, a password, and a backup. This is the simplest safe setup (Debian/Ubuntu, a domain pointing to the server).

## 1. Copy the game

```sh
# on your PC, from the folder that contains physics-rpg/
rsync -av --exclude node_modules --exclude profiles physics-rpg/game/ you@server:/opt/physics-rpg/
```

(Copy `game/profiles/` too if you want to keep your current progress: `rsync -av physics-rpg/game/profiles/ you@server:/opt/physics-rpg/profiles/`.)

## 2. Run `serve.py` as a service

```sh
sudo useradd -r -m -d /opt/physics-rpg physics 2>/dev/null; sudo chown -R physics /opt/physics-rpg
sudo tee /etc/systemd/system/physics-rpg.service >/dev/null <<'UNIT'
[Unit]
Description=Physics RPG
After=network.target
[Service]
User=physics
WorkingDirectory=/opt/physics-rpg
Environment=PHYSICS_RPG_TOKEN=CHANGE-ME-long-random-string
ExecStart=/usr/bin/python3 /opt/physics-rpg/serve.py --host 127.0.0.1 --port 8123
Restart=always
[Install]
WantedBy=multi-user.target
UNIT
sudo systemctl daemon-reload && sudo systemctl enable --now physics-rpg
```

`serve.py` only listens on 127.0.0.1: the outside world reaches it through the proxy below. The token protects the save API
(`/api/...`): the first time you open the game on a device it asks for the token once.

## 3. HTTPS and a password with Caddy (automatic certificates)

```sh
sudo apt install caddy
sudo tee /etc/caddy/Caddyfile >/dev/null <<'CADDY'
physics.example.com {
    basic_auth {
        you JDJhJDE0$...hash...      # create with: caddy hash-password
    }
    reverse_proxy 127.0.0.1:8123
}
CADDY
sudo systemctl reload caddy
```

Why the extra password (`basic_auth`) when there is already a token: the token protects only the save API. The game files
themselves contain content derived from your lecture scripts and exams (transcriptions, solutions), which you probably should not
publish openly. Basic auth protects everything.

Open `https://physics.example.com` on your phone. On a touch screen the game is the full 3D game with on-screen controls: a **stick** (bottom left) to
walk, **drag** on the 3D view to look, a **big button** (bottom right) that does what E does, and a toolbar at the top (Menu, Formulas, Map, Nexus).
Formulas and an exercise can be open at once: side by side when the phone is held sideways, one above the other when upright; the arrow button of a panel makes it fill
the screen. If the 3D view is too slow on an old phone, Menu > "Switch to the simple menu (no 3D)" gives the lists-only mode (`?lite=1` / `?lite=0` also work;
`?touch=0` turns the touch controls off on a tablet with a keyboard).
Tip: "Add to Home screen" in the phone browser gives it an app icon and full screen.

## 4. Backups

Everything you own is in `/opt/physics-rpg/profiles/` (each profile plus 5 rolling backups). A daily copy is enough:

```sh
sudo tee /etc/cron.daily/physics-rpg-backup >/dev/null <<'CRON'
#!/bin/sh
tar czf /var/backups/physics-rpg-$(date +%F).tgz -C /opt/physics-rpg profiles && find /var/backups -name 'physics-rpg-*.tgz' -mtime +30 -delete
CRON
sudo chmod +x /etc/cron.daily/physics-rpg-backup
```

## 5. Updating the game later

If you used `deploy/setup.sh`, one command does everything: `sudo rpg-update` (or `sudo bash /opt/physics-rpg/deploy/update.sh`). It pulls the new version
from GitHub, restarts the game and shows what changed; then reload the page on the phone. Progress stays on the server. If the repository is private, run
`sudo bash /opt/physics-rpg/deploy/deploy-key.sh` once: it creates a read-only key on the server and tells you where to add it on GitHub.

With the manual setup above, run the `rsync` from step 1 again **without** copying `profiles/` (the `--exclude profiles` does that), then
`sudo systemctl restart physics-rpg`.

## 6. Study notifications on your phone (ntfy)

The server can nudge you: a morning plan, a midday quick win, an evening streak reminder and a Sunday week in review. Each message names the exact
next exercise (from your saved progress: due respawns first, then the next step of the guided route) and tapping it opens that exercise in the game.

```sh
sudo bash /opt/physics-rpg/deploy/notify-setup.sh
```

It prints a private topic name (or pass your own: `... notify-setup.sh my-topic`). On the phone install the **ntfy** app (Google Play or F-Droid), tap **+** and subscribe to that topic;
the setup also sends a test message. Treat the topic like a password. Times are 08:15, 13:15 and 19:45 in `NOTIFY_TZ` (default Europe/Zurich, change it in `/etc/physics-rpg/notify.env`
and run the setup again). Nothing is sent at midday if you already studied (at least 5 minutes working on exercises, or one finished exercise, or a mission), and nothing in the evening once the daily goal is reached (minutes on exercises or number of exercises). Time with the game just open, in menus or in lists never counts as studying. Messages also arrive while you have just been studying; if you would rather have a quiet period after studying, add `NOTIFY_QUIET_MINUTES=60` to `/etc/physics-rpg/notify.env`.

- **Start now or later:** every message has the buttons **Start now**, **In 10 min** (one tap, the notification comes back after 10 minutes) and **Later...**; tapping the message itself opens
  a small chooser in the game: start now, remind me in 5 / 10 / 30 / 60 minutes, or at a time you pick (up to 3 days ahead). The reminder comes back through ntfy, with the same buttons. (The game server needs the
  notification settings for this: `notify-setup.sh` takes care of it. On a PC that runs the game locally without them, the chooser says what is missing.)
- Try one now: `sudo rpg-notify --slot morning --force`. Only show it: `sudo rpg-notify --slot evening --dry-run`.
- Your own ntfy server (or an access token): `notify-setup.sh my-topic https://ntfy.example.com`, and add `NTFY_TOKEN=tk_...` to `/etc/physics-rpg/notify.env`.
- Turn it off: `sudo systemctl disable --now physics-rpg-notify.timer`.
- The tap links are `?open=<exercise id>`, `?quick=1` (quick session) and `?room=<course>/<room>` on your game address.

## Moving your progress between PC and server

Profiles are plain JSON: copy `profiles/<name>.json` in either direction. When the game starts, the newer copy of a profile
(by its `updated` timestamp) wins and replaces the older one. If you have played on two devices without a connection to the server in between,
export the profile on the device you want to keep first (Profile -> export progress file).
