#!/usr/bin/env bash
# Pull the latest game from GitHub, bring the server wiring up to date and restart. Profiles live in /var/lib/physics-rpg and are never touched.
#   rpg-update          (the shortcut this script installs on its first run)
#   bash /opt/physics-rpg/deploy/update.sh
set -euo pipefail
SELF=$(readlink -f "$0"); APP=$(dirname "$(dirname "$SELF")")
[ "$(id -u)" = 0 ] || exec sudo bash "$SELF" "$@"
cd "$APP"
ETC=${ETC:-/etc}; BIN=${BIN:-/usr/local/bin}
rm -f "$BIN/rpg-update"; printf '#!/bin/sh\nexec bash %s "$@"\n' "$SELF" >"$BIN/rpg-update"; chmod +x "$BIN/rpg-update"

if [ "${1:-}" != "--pulled" ]; then
  before=$(git rev-parse HEAD)
  if ! git pull --ff-only -q; then
    echo "Could not pull from GitHub."
    echo " - If the repository is private now, run once: sudo bash $APP/deploy/deploy-key.sh"
    echo " - If you changed files in $APP by hand, tell Claude what 'git status' shows."
    exit 1
  fi
  exec bash "$SELF" --pulled "$before"   # carry on with the freshly pulled version of this script, so new steps below run on the same update
fi
before=${2:-$(git rev-parse HEAD)}; after=$(git rev-parse HEAD)

# Keep the server wiring in step with the code. The game server must know the notification settings ("remind me later" in the chooser that opens when
# you tap a notification); setups made before that feature lack this link.
ENVF=$ETC/physics-rpg/notify.env; DROP=$ETC/systemd/system/physics-rpg.service.d/notify.conf
if [ -f "$ENVF" ] && ! grep -qs "EnvironmentFile=-$ENVF" "$DROP" 2>/dev/null; then
  mkdir -p "$(dirname "$DROP")"; printf '[Service]\nEnvironmentFile=-%s\n' "$ENVF" >"$DROP"; systemctl daemon-reload
  echo "Connected the game server to your notification settings (\"remind me later\" now works)."
fi
systemctl restart physics-rpg
cp "$APP/deploy/README.md" "${ROOTHOME:-/root}/PHYSICS-RPG-README.md" 2>/dev/null || true   # the guide to everything installed: less /root/PHYSICS-RPG-README.md
if [ "$before" = "$after" ]; then
  echo "Already up to date ($(git log -1 --format='%h %s'))."
else
  echo "Updated. What changed:"; git log --format='  %h %s' "$before..$after" | head -15
fi
echo "Reload the game page on your phone to get the new version. Guide to everything installed: less /root/PHYSICS-RPG-README.md"
