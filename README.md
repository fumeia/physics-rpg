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
Later updates: `sudo bash /opt/physics-rpg/deploy/update.sh`.

The lecture PDFs (`materials/`) are not in git; they are in the `physics-rpg.zip` release.
