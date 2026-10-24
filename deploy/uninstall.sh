#!/usr/bin/env bash
# Undo what deploy/setup.sh and deploy/notify-setup.sh created. Your progress is kept unless you say --purge-data.
#
#   sudo bash /opt/physics-rpg/deploy/uninstall.sh notify               # only the notifications
#   sudo bash /opt/physics-rpg/deploy/uninstall.sh site                 # the game service and its website entry
#   sudo bash /opt/physics-rpg/deploy/uninstall.sh all                  # both
#   sudo bash /opt/physics-rpg/deploy/uninstall.sh all --purge-data     # both, and delete your progress and the backups
# Add --yes to skip the question. The game's code in /opt/physics-rpg is never deleted by this script.
set -euo pipefail
[ "$(id -u)" = 0 ] || exec sudo bash "$(readlink -f "$0")" "$@"
ETC=${ETC:-/etc}; BIN=${BIN:-/usr/local/bin}; DATA=${DATA:-/var/lib/physics-rpg}; BACKUPS=${BACKUPS:-/var/backups}; ROOTHOME=${ROOTHOME:-/root}
WHAT=${1:-}; shift || true; YES=0; PURGE=0
for a in "$@"; do case "$a" in --yes) YES=1;; --purge-data) PURGE=1;; *) echo "Unknown option $a"; exit 1;; esac; done
case "$WHAT" in notify|site|all) ;; *) sed -n '2,9p' "$0" | sed 's/^# \{0,1\}//'; exit 1;; esac
SNIPPET=$ETC/caddy/physics-rpg.caddy; CADDYFILE=$ETC/caddy/Caddyfile
sysd=$ETC/systemd/system

plan() {
  echo "This will:"
  if [ "$WHAT" != site ]; then echo "  - stop the study notifications (timer, service, rpg-notify, $ETC/physics-rpg/notify.env)"; fi
  if [ "$WHAT" != notify ]; then
    echo "  - stop and remove the game service (physics-rpg), the daily backup job, rpg-update"
    echo "  - remove the website entry from Caddy ($SNIPPET and its import line), then reload Caddy"
  fi
  if [ "$PURGE" = 1 ]; then echo "  - DELETE your progress ($DATA) and the backups ($BACKUPS/physics-rpg-*.tgz)"; else echo "  - keep your progress in $DATA and the backups"; fi
  echo "  - leave the game's code in /opt/physics-rpg alone"
}
plan
if [ "$YES" != 1 ]; then read -r -p "Continue? Type yes: " ans; [ "$ans" = yes ] || { echo "Nothing changed."; exit 0; }; fi

undo_notify() {
  systemctl disable --now physics-rpg-notify.timer 2>/dev/null || true
  rm -f "$sysd/physics-rpg-notify.timer" "$sysd/physics-rpg-notify.service" "$sysd/physics-rpg.service.d/notify.conf" "$BIN/rpg-notify" "$ETC/physics-rpg/notify.env"
  rmdir "$sysd/physics-rpg.service.d" "$ETC/physics-rpg" 2>/dev/null || true
  rm -f "$DATA/notify-state.json"
  systemctl daemon-reload; systemctl restart physics-rpg 2>/dev/null || true
  echo "Notifications removed. (Unsubscribe from the topic in the ntfy app if you like.)"
}
undo_site() {
  systemctl disable --now physics-rpg 2>/dev/null || true
  rm -f "$sysd/physics-rpg.service" "$ETC/cron.daily/physics-rpg-backup" "$BIN/rpg-update" "$ROOTHOME/physics-rpg-login.txt" "$ROOTHOME/PHYSICS-RPG-README.md"
  systemctl daemon-reload
  if [ -f "$CADDYFILE" ]; then
    cp "$CADDYFILE" "$CADDYFILE.bak-uninstall"
    sed -i "\\#^import $SNIPPET\$#d" "$CADDYFILE"; rm -f "$SNIPPET"
    if command -v caddy >/dev/null && ! caddy validate --config "$CADDYFILE" --adapter caddyfile >/dev/null 2>&1; then
      cp "$CADDYFILE.bak-uninstall" "$CADDYFILE"; echo "Caddy rejected the result, your Caddyfile was put back. Nothing was reloaded."; exit 1
    fi
    systemctl reload caddy 2>/dev/null || true
  fi
  echo "Game service and website entry removed."
}
case "$WHAT" in notify) undo_notify;; site) undo_site;; all) undo_notify; undo_site;; esac
if [ "$PURGE" = 1 ]; then rm -rf "$DATA"; rm -f "$BACKUPS"/physics-rpg-*.tgz; id physics-rpg >/dev/null 2>&1 && userdel physics-rpg 2>/dev/null || true; echo "Progress and backups deleted."; fi
echo
echo "Left in place: the code in /opt/physics-rpg$( [ "$PURGE" = 1 ] || echo " and your progress in $DATA"). To delete the code too: sudo rm -rf /opt/physics-rpg"
echo "To install again: sudo bash /opt/physics-rpg/deploy/setup.sh <your domain>"
