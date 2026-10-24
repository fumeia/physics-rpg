# Physics RPG on your server: what is installed, how to use it, how to change or undo it

This file lives in the game folder (`/opt/physics-rpg/deploy/README.md`). `rpg-update` also puts a copy at `/root/PHYSICS-RPG-README.md`,
so after logging in: `less /root/PHYSICS-RPG-README.md` (q closes it). How the game itself works: `/opt/physics-rpg/docs/HOW_THE_GAME_WORKS.md`.

Everything below that needs `sudo` can be run as root without it. Run commands **one at a time**, not several pasted together.

## 1. What was set up (and where it lives)

| What | Where | Made by |
|---|---|---|
| The game's code (a clone of the GitHub repository, branch `claude/game-server-website-migration-ikz0nf`) | `/opt/physics-rpg` | `git clone` |
| The game server (a small Python program that serves the pages and saves your progress) | service `physics-rpg`, file `/etc/systemd/system/physics-rpg.service`, listens on `127.0.0.1:8123` (not reachable from outside directly) | `deploy/setup.sh` |
| **Your progress** (one file per profile, plus 5 rolling backups `*.bak1` to `*.bak5`) | `/var/lib/physics-rpg/profiles/` (your profile is `default.json`) | the game saves here |
| Daily backup of the progress, kept 30 days | `/etc/cron.daily/physics-rpg-backup` writes `/var/backups/physics-rpg-DATE.tgz` | `deploy/setup.sh` |
| The website entry: HTTPS, domain, login | `/etc/caddy/physics-rpg.caddy`, pulled in by one line `import /etc/caddy/physics-rpg.caddy` at the end of `/etc/caddy/Caddyfile` (a copy of the original is `Caddyfile.bak-physics-rpg`) | `deploy/setup.sh` |
| The first login (user `me` and the first password) | `/root/physics-rpg-login.txt` (does not change when you change the password) | `deploy/setup.sh` |
| The update shortcut | `rpg-update` (`/usr/local/bin/rpg-update`) | `deploy/update.sh` |
| Study notifications: settings | `/etc/physics-rpg/notify.env` (topic, ntfy address, game address, time zone) | `deploy/notify-setup.sh` |
| Study notifications: schedule | `/etc/systemd/system/physics-rpg-notify.timer` (08:15, 13:15, 19:45) and `.service`; the shortcut `rpg-notify` | `deploy/notify-setup.sh` |
| The game server reading the notification settings (for "remind me later") | `/etc/systemd/system/physics-rpg.service.d/notify.conf` | `deploy/notify-setup.sh` |

The DNS entry (an `A` record `rpg` pointing to the server) is at Spaceship, not on the server.

## 2. Everyday use

| I want to... | Command (on the server) |
|---|---|
| Get the newest version of the game | `rpg-update` (then reload the page on the phone) |
| See if the game is running | `systemctl status physics-rpg` |
| Read its log | `journalctl -u physics-rpg -n 50 --no-pager` |
| Restart it | `systemctl restart physics-rpg` |
| Change the website password | `sudo bash /opt/physics-rpg/deploy/set-password.sh` |
| Send a notification right now | `sudo rpg-notify --slot morning --force` (slots: morning, midday, evening, weekly) |
| Only look at what a notification would say | `sudo rpg-notify --slot evening --dry-run` |
| Send a test message | `sudo rpg-notify --test` |
| See when the notifications run next | `systemctl list-timers physics-rpg-notify` |
| Turn the notifications off (and on again) | `sudo systemctl disable --now physics-rpg-notify.timer` / `sudo systemctl enable --now physics-rpg-notify.timer` |
| See my saved progress files | `ls -la /var/lib/physics-rpg/profiles/` |
| Make a manual backup | `sudo tar czf ~/progress-$(date +%F).tgz -C /var/lib/physics-rpg profiles` |

**Restore an older save:** the game keeps the last 5 versions next to the profile. Stop the game, copy one back, start it, and reload the page:
```
sudo systemctl stop physics-rpg
sudo cp /var/lib/physics-rpg/profiles/default.json.bak1 /var/lib/physics-rpg/profiles/default.json
sudo chown physics-rpg: /var/lib/physics-rpg/profiles/default.json
sudo systemctl start physics-rpg
```
(`.bak1` is the newest backup. The daily archives in `/var/backups` work the same way: unpack with `tar xzf`.) If the page then shows old data, clear the site data once.

## 3. Where do I change what?

| To change... | Do this |
|---|---|
| The password | `sudo bash /opt/physics-rpg/deploy/set-password.sh` |
| The web address (domain) | 1. Add the new `A` record at Spaceship. 2. Change the first line of `/etc/caddy/physics-rpg.caddy`. 3. `caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile` and `sudo systemctl reload caddy`. 4. Change `GAME_URL=` in `/etc/physics-rpg/notify.env` (the links in notifications) |
| The login user name | the line under `basicauth {` in `/etc/caddy/physics-rpg.caddy` (user, then the hash), then validate and reload as above |
| The port or an extra access token of the game server | `/etc/systemd/system/physics-rpg.service` (`--port`, add `Environment=PHYSICS_RPG_TOKEN=...`), then `sudo systemctl daemon-reload && sudo systemctl restart physics-rpg` (if you change the port, change `reverse_proxy` in the Caddy file too) |
| Notification times | edit the three `OnCalendar=` lines in `/etc/systemd/system/physics-rpg-notify.timer`, then `sudo systemctl daemon-reload && sudo systemctl restart physics-rpg-notify.timer` |
| The notification topic or ntfy server | `sudo bash /opt/physics-rpg/deploy/notify-setup.sh NEW-TOPIC [https://your-ntfy-server]` (then subscribe to the new topic in the app, unsubscribe the old) |
| An ntfy access token (private ntfy server) | add a line `NTFY_TOKEN=tk_...` to `/etc/physics-rpg/notify.env`, then `sudo systemctl restart physics-rpg` |
| The time zone of the reminders | `NOTIFY_TZ=` in `/etc/physics-rpg/notify.env` and the timer file's three times (they carry the zone name), then reload as above |
| Which profile the notifications read | `PHYSICS_RPG_PROFILE=` in `/etc/physics-rpg/notify.env` (default `default`) |
| The exam date (countdown, pace) | `EXAM_DATE` at the top of `/opt/physics-rpg/game/src/missions.js` (later `rpg-update` keeps your edit only if it does not clash; better ask Claude to change it in the repository) |
| What counts as studying (for the goal and the notifications) | Time actively working on exercises, or the number of finished exercises; the rules are in `docs/HOW_THE_GAME_WORKS.md` (Daily goal). The goal size is set in the game: Profile > settings |
| Theme, controls, daily goal, sounds | in the game: Menu or Profile (P) > settings. Theme and controls are stored in the phone's browser, the rest in your profile |
| The game's content (exercises) | `/opt/physics-rpg/game/content/` in the repository. Edit it in the repository (GitHub), then `rpg-update` |
| Server access to a **private** repository | `sudo bash /opt/physics-rpg/deploy/deploy-key.sh` (once) |

## 4. How to undo it

Nothing is deleted without a question, and **your progress is kept unless you add `--purge-data`**.

| I want to... | Command |
|---|---|
| Remove only the notifications | `sudo bash /opt/physics-rpg/deploy/uninstall.sh notify` |
| Take the game website down (keeps progress and code) | `sudo bash /opt/physics-rpg/deploy/uninstall.sh site` |
| Remove everything the setup made, keep progress | `sudo bash /opt/physics-rpg/deploy/uninstall.sh all` |
| ...and delete progress and backups too | `sudo bash /opt/physics-rpg/deploy/uninstall.sh all --purge-data` |
| Delete the game's code as well | `sudo rm -rf /opt/physics-rpg` (after the above; also remove the old copy `/opt/physics-rpg.old` if it exists) |
| Install it again | `sudo bash /opt/physics-rpg/deploy/setup.sh rpg.yourdomain.com` |
| Go back to the Caddy file as it was before | `sudo cp /etc/caddy/Caddyfile.bak-physics-rpg /etc/caddy/Caddyfile && sudo systemctl reload caddy` |
| Go back to an older version of the game | `cd /opt/physics-rpg && git log --oneline` to pick a version, `sudo git checkout <id>`, `sudo systemctl restart physics-rpg` (`git checkout claude/game-server-website-migration-ikz0nf` and `rpg-update` return to the newest) |

The uninstall script only touches what the setup scripts made (listed in section 1). It does not remove Caddy, Python or your other sites.

## 5. Something is wrong

| Symptom | Likely cause and fix |
|---|---|
| The page looks old after an update | The browser keeps old files once. Chrome: Settings > Privacy > Delete browsing data > only "Cached images and files". Or open a private tab to check. |
| "502 Bad Gateway" | The game server is not running: `systemctl status physics-rpg`, then `journalctl -u physics-rpg -n 30 --no-pager`; `sudo systemctl restart physics-rpg` |
| The login does not work | `sudo bash /opt/physics-rpg/deploy/set-password.sh`; test in a private tab |
| No certificate / "connection not private" | The `A` record at Spaceship must point to this server (`getent hosts rpg.yourdomain.com`), then `sudo systemctl reload caddy`; `journalctl -u caddy -n 30 --no-pager` |
| No notifications arrive | `sudo rpg-notify --test` (is the app subscribed to the exact topic in `/etc/physics-rpg/notify.env`?). `systemctl list-timers physics-rpg-notify` (timer active?). `journalctl -u physics-rpg-notify -n 20 --no-pager` shows why a slot stayed silent (for example "midday: skipped (already studied today)" or "evening: skipped (daily goal reached)") |
| "Remind me later" says reminders need the server notifications | `sudo bash /opt/physics-rpg/deploy/notify-setup.sh` (it also restarts the game server so it knows the settings) |
| `rpg-update` says it could not pull | Private repository: `sudo bash /opt/physics-rpg/deploy/deploy-key.sh`. Or you edited files in `/opt/physics-rpg` by hand: `cd /opt/physics-rpg && git status` |
| The screen is stuck sideways | Menu > **Let the screen rotate**. The lock only lasts for one visit, so a reload or a new tab frees it too (and with the older version's stored lock: `rpg-update`, then reload). Android's own rotation switch also still applies |
| Stuck in the keyboard layout on the phone | Tap the **Touch view** button (bottom left), or open the game address with `?controls=auto` at the end (for example `https://rpg.yourdomain.com/?controls=auto`); `?theme=dark` does the same for the theme |
| My progress looks empty | Wrong profile in the game (P > Profiles: `default` is yours), or an old browser copy: see "Restore an older save" |
