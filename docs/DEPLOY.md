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

Open `https://physics.example.com` on your phone. On a touch screen under 1000 px the game starts in the **phone menu** (no 3D;
missions, study hub, exam hall, rooms and exercises). Add `?lite=0` to force the 3D view or `?lite=1` to force the menu on any device.
Tip: "Add to Home screen" in the phone browser gives it an app icon.

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

Run the `rsync` from step 1 again **without** copying `profiles/` (the `--exclude profiles` does that), then
`sudo systemctl restart physics-rpg`. Your progress stays on the server.

## Moving your progress between PC and server

Profiles are plain JSON: copy `profiles/<name>.json` in either direction. When the game starts, the newer copy of a profile
(by its `updated` timestamp) wins and replaces the older one. If you have played on two devices without a connection to the server in between,
export the profile on the device you want to keep first (Profile -> export progress file).
