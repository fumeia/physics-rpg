#!/usr/bin/env bash
# One-time setup of the game on a Debian/Ubuntu server that already runs Caddy (see docs/DEPLOY.md for the details).
#
#   sudo bash /opt/physics-rpg/deploy/setup.sh rpg.example.com [login-name]
#
# - runs game/serve.py as the systemd service "physics-rpg" on 127.0.0.1:$PORT (default 8123)
# - keeps profiles outside the git checkout, in /var/lib/physics-rpg/profiles (seeded once from deploy/seed-profiles/)
# - adds an HTTPS site with a login (basic auth) to Caddy, validating the config before reloading
# - daily backup of the profiles to /var/backups
# Safe to run again: it never overwrites existing profiles or an existing password.
set -euo pipefail

DOMAIN=${1:?usage: sudo bash deploy/setup.sh <domain> [login-name]}
LOGIN=${2:-me}
PORT=${PORT:-8123}
APP=$(cd "$(dirname "$0")/.." && pwd)
DATA=/var/lib/physics-rpg
SNIPPET=/etc/caddy/physics-rpg.caddy
CADDYFILE=/etc/caddy/Caddyfile
LOGINFILE=/root/physics-rpg-login.txt

[ "$(id -u)" = 0 ] || { echo "Run with sudo."; exit 1; }
[ -f "$APP/game/serve.py" ] || { echo "game/serve.py not found under $APP"; exit 1; }
command -v python3 >/dev/null || { apt-get update && apt-get install -y python3; }
if ss -ltn "sport = :$PORT" | grep -q LISTEN && ! systemctl is-active --quiet physics-rpg; then
  echo "Port $PORT is already used by something else. Rerun with: sudo PORT=8124 bash $0 $*"; exit 1
fi

echo "== service user and profiles"
id physics-rpg >/dev/null 2>&1 || useradd --system --home-dir "$DATA" --shell /usr/sbin/nologin physics-rpg
mkdir -p "$DATA/profiles"
if ! ls "$DATA/profiles"/*.json >/dev/null 2>&1; then cp "$APP"/deploy/seed-profiles/*.json "$DATA/profiles/"; echo "   copied your saved profiles"; fi
chown -R physics-rpg: "$DATA"; chmod 700 "$DATA" "$DATA/profiles"

echo "== systemd service"
cat >/etc/systemd/system/physics-rpg.service <<UNIT
[Unit]
Description=Physics RPG
After=network.target

[Service]
User=physics-rpg
WorkingDirectory=$APP/game
Environment=PHYSICS_RPG_PROFILES=$DATA/profiles
ExecStart=/usr/bin/env python3 $APP/game/serve.py --host 127.0.0.1 --port $PORT
Restart=always
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=$DATA
PrivateTmp=true

[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload
systemctl enable --now physics-rpg
systemctl restart physics-rpg
sleep 1
curl -fsS "http://127.0.0.1:$PORT/api/ping" >/dev/null && echo "   game is running on 127.0.0.1:$PORT"

echo "== daily backup"
cat >/etc/cron.daily/physics-rpg-backup <<CRON
#!/bin/sh
tar czf /var/backups/physics-rpg-\$(date +%F).tgz -C $DATA profiles && find /var/backups -name 'physics-rpg-*.tgz' -mtime +30 -delete
CRON
chmod +x /etc/cron.daily/physics-rpg-backup

echo "== caddy"
if ! command -v caddy >/dev/null || [ ! -f "$CADDYFILE" ]; then
  echo "   Caddy is not installed on this machine as a system service (Docker?). Add this site to your Caddy config by hand:"
  echo "   $DOMAIN { basic_auth { $LOGIN <hash from: caddy hash-password> }  reverse_proxy <this host>:$PORT }"
  exit 0
fi
if [ ! -f "$SNIPPET" ]; then
  PASS=$(python3 -c 'import secrets; print(secrets.token_urlsafe(12))')
  HASH=$(caddy hash-password --plaintext "$PASS")
  # the directive is basic_auth since Caddy 2.8 and basicauth before; use whichever this Caddy accepts
  write_site() { cat >"$1" <<SITE
$DOMAIN {
	encode zstd gzip
	$2 {
		$LOGIN $HASH
	}
	reverse_proxy 127.0.0.1:$PORT
}
SITE
  }
  AUTH=
  for name in basic_auth basicauth; do
    write_site /tmp/physics-rpg-test.caddy "$name"
    if caddy validate --config /tmp/physics-rpg-test.caddy --adapter caddyfile >/dev/null 2>&1; then AUTH=$name; break; fi
  done
  rm -f /tmp/physics-rpg-test.caddy
  [ -n "$AUTH" ] || { echo "This Caddy accepts neither basic_auth nor basicauth. Run: caddy version"; exit 1; }
  write_site "$SNIPPET" "$AUTH"
  printf 'https://%s\nuser: %s\npassword: %s\n' "$DOMAIN" "$LOGIN" "$PASS" >"$LOGINFILE"; chmod 600 "$LOGINFILE"
fi
if ! grep -qF "import $SNIPPET" "$CADDYFILE"; then
  cp "$CADDYFILE" "$CADDYFILE.bak-physics-rpg"
  printf '\nimport %s\n' "$SNIPPET" >>"$CADDYFILE"
fi
if ! caddy validate --config "$CADDYFILE" --adapter caddyfile >/tmp/physics-rpg-caddy.log 2>&1; then
  cat /tmp/physics-rpg-caddy.log
  [ -f "$CADDYFILE.bak-physics-rpg" ] && cp "$CADDYFILE.bak-physics-rpg" "$CADDYFILE"
  echo "Caddy rejected the config, your Caddyfile was restored unchanged. Nothing was reloaded."; exit 1
fi
systemctl reload caddy

cp "$APP/deploy/README.md" /root/PHYSICS-RPG-README.md 2>/dev/null || true
echo
echo "Done. Open the game and log in with:"
cat "$LOGINFILE"
echo "(saved in $LOGINFILE; show it again with: sudo cat $LOGINFILE)"
