#!/usr/bin/env bash
# Turns on the study notifications (ntfy). Run once on the server; safe to run again (it keeps your topic).
#
#   sudo bash /opt/physics-rpg/deploy/notify-setup.sh                   # random private topic on ntfy.sh
#   sudo bash /opt/physics-rpg/deploy/notify-setup.sh my-topic          # your own topic name
#   sudo bash /opt/physics-rpg/deploy/notify-setup.sh my-topic https://ntfy.example.com   # your own ntfy server
#
# Sends three messages a day at most (morning, midday, evening; Sunday evening is the week in review), only when they
# make sense: nothing at midday if you already studied, nothing in the evening once the daily goal is reached.
# Later: `sudo rpg-notify --slot morning --force` sends a message now, `sudo rpg-notify --slot morning --dry-run` only shows it.
set -euo pipefail
[ "$(id -u)" = 0 ] || exec sudo bash "$(readlink -f "$0")" "$@"
APP=$(dirname "$(dirname "$(readlink -f "$0")")")
ETC=${ETC:-/etc}; BIN=${BIN:-/usr/local/bin}; DATA=${DATA:-/var/lib/physics-rpg}
ENVF=$ETC/physics-rpg/notify.env
[ -f "$APP/deploy/notify.py" ] || { echo "deploy/notify.py not found under $APP"; exit 1; }
command -v python3 >/dev/null || { echo "python3 is needed"; exit 1; }

old() { [ -f "$ENVF" ] && sed -n "s/^$1=//p" "$ENVF" | tail -1 || true; }
TOPIC=${1:-$(old NTFY_TOPIC)}
[ -n "$TOPIC" ] || TOPIC="rpg-$(python3 -c 'import secrets,string; a=string.ascii_lowercase+string.digits; print("".join(secrets.choice(a) for _ in range(18)))')"
case "$TOPIC" in *[!A-Za-z0-9_-]*) echo "The topic may only contain letters, digits, - and _"; exit 1;; esac
URL=${2:-$(old NTFY_URL)}; URL=${URL:-https://ntfy.sh}
TZNAME=$(old NOTIFY_TZ); TZNAME=${TZNAME:-Europe/Zurich}
GAME_URL=$(old GAME_URL)
if [ -z "$GAME_URL" ] && [ -f "$ETC/caddy/physics-rpg.caddy" ]; then GAME_URL="https://$(awk 'NF{print $1; exit}' "$ETC/caddy/physics-rpg.caddy")"; fi

PROFILE=$(old PHYSICS_RPG_PROFILE); PROFILE=${PROFILE:-default}
TOKEN=$(old NTFY_TOKEN)
mkdir -p "$ETC/physics-rpg" "$ETC/systemd/system" "$BIN"; umask 077
{
  echo "NTFY_TOPIC=$TOPIC"; echo "NTFY_URL=$URL"; echo "GAME_URL=$GAME_URL"; echo "NOTIFY_TZ=$TZNAME"
  echo "PHYSICS_RPG_PROFILES=$DATA/profiles"; echo "PHYSICS_RPG_PROFILE=$PROFILE"; echo "NOTIFY_STATE=$DATA/notify-state.json"
  [ -z "$TOKEN" ] || echo "NTFY_TOKEN=$TOKEN"
} >"$ENVF"
umask 022

USERLINE=""; id physics-rpg >/dev/null 2>&1 && USERLINE="User=physics-rpg"
cat >"$ETC/systemd/system/physics-rpg-notify.service" <<UNIT
[Unit]
Description=Physics RPG study notification

[Service]
Type=oneshot
$USERLINE
EnvironmentFile=$ENVF
ExecStart=/usr/bin/env python3 $APP/deploy/notify.py --slot auto
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
PrivateTmp=true
ReadWritePaths=$DATA
UNIT
cat >"$ETC/systemd/system/physics-rpg-notify.timer" <<TIMER
[Unit]
Description=Physics RPG study notifications (morning, midday, evening)

[Timer]
OnCalendar=*-*-* 08:15:00 $TZNAME
OnCalendar=*-*-* 13:15:00 $TZNAME
OnCalendar=*-*-* 19:45:00 $TZNAME
RandomizedDelaySec=120
Persistent=false

[Install]
WantedBy=timers.target
TIMER
printf '#!/bin/sh\nset -a; . %s; set +a\nexec python3 %s/deploy/notify.py "$@"\n' "$ENVF" "$APP" >"$BIN/rpg-notify"; chmod +x "$BIN/rpg-notify"

systemctl daemon-reload
systemctl enable --now physics-rpg-notify.timer

echo
echo "Sending a test message..."
if "$BIN/rpg-notify" --test; then :; else echo "(The test could not be sent. Check the internet connection of the server and the server address $URL.)"; fi
echo
echo "On your phone: install the ntfy app (Google Play or F-Droid), tap +, and subscribe to this topic:"
echo
echo "    $TOPIC            (server: $URL)"
echo
echo "Treat the topic like a password: anyone who knows it can read your messages on a public ntfy server."
echo "Times (${TZNAME}): 08:15, 13:15, 19:45. Config: $ENVF. Next runs: systemctl list-timers physics-rpg-notify"
echo "Try now: sudo rpg-notify --slot morning --force"
