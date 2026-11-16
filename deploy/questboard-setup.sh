#!/usr/bin/env bash
# Sends the game's XP to Questboard (one quest per course, topic = the course). Run once on the server; safe to run again.
#
#   sudo bash /opt/physics-rpg/deploy/questboard-setup.sh                        # finds Questboard on this server by itself
#   sudo bash /opt/physics-rpg/deploy/questboard-setup.sh http://127.0.0.1:8787  # or give its address (it then asks for the token)
#
# Topic names (they must match your Questboard/Notion topics exactly) are in /etc/physics-rpg/questboard.env:
# QB_TOPIC_QM, QB_TOPIC_SOLID_STATE, QB_TOPIC_ASTROPHYSICS (default Quantenmechanik, Festkörperphysik, Astrophysik; keep the quotes).
# Later: `sudo rpg-questboard` syncs now, `sudo rpg-questboard --dry-run` only shows what it would send.
set -euo pipefail
[ "$(id -u)" = 0 ] || exec sudo bash "$(readlink -f "$0")" "$@"
APP=$(dirname "$(dirname "$(readlink -f "$0")")")
ETC=${ETC:-/etc}; BIN=${BIN:-/usr/local/bin}; DATA=${DATA:-/var/lib/physics-rpg}
ENVF=$ETC/physics-rpg/questboard.env
command -v python3 >/dev/null || { echo "python3 is needed"; exit 1; }

old() { [ -f "$ENVF" ] && sed -n "s/^$1=//p" "$ENVF" | tail -1 | sed 's/^"\(.*\)"$/\1/' || true; }
URL=${1:-$(old QB_URL)}; TOKEN=$(old QB_TOKEN)

# Questboard's tools/deploy-server.sh puts it in ~/questboard-server of the user who deployed it, with the token in .env
if [ -z "$URL" ] || [ -z "$TOKEN" ]; then
  for f in /root/questboard-server/.env /home/*/questboard-server/.env; do
    [ -f "$f" ] || continue
    t=$(sed -n 's/^QB_TOKEN=//p' "$f" | tail -1); [ -n "$t" ] || continue
    port=$(sed -n 's/^QB_PORT_HOST=//p' "$f" | tail -1); bind=$(sed -n 's/^QB_BIND=//p' "$f" | tail -1)
    case "${bind:-0.0.0.0}" in 0.0.0.0) bind=127.0.0.1;; esac
    [ -n "$URL" ] || URL="http://$bind:${port:-8787}"
    [ -n "$TOKEN" ] || TOKEN=$t
    echo "Found Questboard: $f"; break
  done
fi
if [ -z "$URL" ]; then read -r -p "Questboard address (for example http://127.0.0.1:8787): " URL; fi
if [ -z "$TOKEN" ]; then read -r -s -p "Questboard token (QB_TOKEN in Questboard's .env): " TOKEN; echo; fi
[ -n "$URL" ] && [ -n "$TOKEN" ] || { echo "Need an address and a token."; exit 1; }
URL=${URL%/}

GAME_URL=$(old GAME_URL)
[ -n "$GAME_URL" ] || GAME_URL=$(sed -n 's/^GAME_URL=//p' "$ETC/physics-rpg/notify.env" 2>/dev/null | tail -1 || true)
if [ -z "$GAME_URL" ] && [ -f "$ETC/caddy/physics-rpg.caddy" ]; then GAME_URL="https://$(awk 'NF{print $1; exit}' "$ETC/caddy/physics-rpg.caddy")"; fi
T_QM=$(old QB_TOPIC_QM); T_SS=$(old QB_TOPIC_SOLID_STATE); T_AS=$(old QB_TOPIC_ASTROPHYSICS)
PROFILE=$(old PHYSICS_RPG_PROFILE); PROFILE=${PROFILE:-default}
TZNAME=$(old QB_TZ); TZNAME=${TZNAME:-$(sed -n 's/^NOTIFY_TZ=//p' "$ETC/physics-rpg/notify.env" 2>/dev/null | tail -1 || true)}; TZNAME=${TZNAME:-Europe/Zurich}

mkdir -p "$ETC/physics-rpg" "$ETC/systemd/system" "$BIN"; umask 077
{
  echo "QB_URL=$URL"; echo "QB_TOKEN=$TOKEN"; echo "GAME_URL=$GAME_URL"; echo "QB_TZ=$TZNAME"
  # quoted, so names with spaces work both for systemd and for the rpg-questboard shortcut
  echo "QB_TOPIC_QM=\"${T_QM:-Quantenmechanik}\""; echo "QB_TOPIC_SOLID_STATE=\"${T_SS:-Festkörperphysik}\""; echo "QB_TOPIC_ASTROPHYSICS=\"${T_AS:-Astrophysik}\""
  echo "PHYSICS_RPG_PROFILES=$DATA/profiles"; echo "PHYSICS_RPG_PROFILE=$PROFILE"; echo "QB_SYNC_STATE=$DATA/questboard-state.json"
} >"$ENVF"
umask 022

USERLINE=""; id physics-rpg >/dev/null 2>&1 && USERLINE="User=physics-rpg"
cat >"$ETC/systemd/system/physics-rpg-questboard.service" <<UNIT
[Unit]
Description=Physics RPG: send XP to Questboard
After=network-online.target

[Service]
Type=oneshot
$USERLINE
EnvironmentFile=$ENVF
ExecStart=/usr/bin/env python3 $APP/deploy/questboard_sync.py
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
PrivateTmp=true
ReadWritePaths=$DATA
UNIT
cat >"$ETC/systemd/system/physics-rpg-questboard.timer" <<TIMER
[Unit]
Description=Physics RPG: send XP to Questboard every 3 minutes

[Timer]
OnBootSec=2min
OnUnitActiveSec=3min

[Install]
WantedBy=timers.target
TIMER
printf '#!/bin/sh\nset -a; . %s; set +a\nexec python3 %s/deploy/questboard_sync.py "$@"\n' "$ENVF" "$APP" >"$BIN/rpg-questboard"; chmod +x "$BIN/rpg-questboard"

echo "Testing the connection..."
if ! "$BIN/rpg-questboard" --check; then
  echo "Questboard did not answer. Check the address and token in $ENVF, then run this script again."; exit 1
fi
systemctl daemon-reload
systemctl enable --now physics-rpg-questboard.timer
systemctl start physics-rpg-questboard.service || true
journalctl -u physics-rpg-questboard -n 3 --no-pager -o cat 2>/dev/null | tail -1 || true
echo
echo "Done. Questboard now has the quests \"Physics RPG · ${T_QM:-Quantenmechanik}\", \"· ${T_SS:-Festkörperphysik}\" and \"· ${T_AS:-Astrophysik}\""
echo "(they appear on the desktop and phone with the next sync, within 2 minutes). The game's XP is sent every 3 minutes."
echo "Topic names must match your Questboard topics exactly: edit them in $ENVF, then: sudo rpg-questboard"
