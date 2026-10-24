# Physics RPG

Study game for quantum mechanics, solid state physics and astrophysics. The game is in `game/`, study notes in `notes/`,
docs in `docs/` (`RUNNING.md` for a PC, `DEPLOY.md` for a server).

## Server (Hetzner + Caddy)

```sh
sudo git clone https://github.com/fumeia/physics-rpg.git /opt/physics-rpg
sudo bash /opt/physics-rpg/deploy/setup.sh rpg.yourdomain.com
```

Sets up the `physics-rpg` service, adds an HTTPS site with a login to Caddy and prints the password.
Profiles live in `/var/lib/physics-rpg/profiles` (seeded once from `deploy/seed-profiles/`), backed up daily to `/var/backups`.
Later updates: `sudo bash /opt/physics-rpg/deploy/update.sh` (it installs the shortcut `sudo rpg-update`). For a private repository run `sudo bash /opt/physics-rpg/deploy/deploy-key.sh` once.

Everything installed, how to change it and how to undo it: `deploy/README.md` (a copy lands in `/root/PHYSICS-RPG-README.md`). How the game works: `docs/HOW_THE_GAME_WORKS.md`.

Study reminders with the exact next exercise: `sudo bash /opt/physics-rpg/deploy/notify-setup.sh` (ntfy app on the phone, see `docs/DEPLOY.md`).

On phones and tablets the game runs in touch mode (stick, drag to look, action button, formulas and exercise side by side); see `docs/DEPLOY.md`.

The lecture PDFs (`materials/`) are not in git; they are in the `physics-rpg.zip` release.
