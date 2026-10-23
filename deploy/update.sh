#!/usr/bin/env bash
# Pull the latest game from GitHub and restart it. Profiles live in /var/lib/physics-rpg and are never touched.
#   rpg-update          (the shortcut this script installs on its first run)
#   bash /opt/physics-rpg/deploy/update.sh
set -euo pipefail
SELF=$(readlink -f "$0"); APP=$(dirname "$(dirname "$SELF")")
[ "$(id -u)" = 0 ] || exec sudo bash "$SELF" "$@"
cd "$APP"
rm -f /usr/local/bin/rpg-update; printf '#!/bin/sh\nexec bash %s "$@"\n' "$SELF" >/usr/local/bin/rpg-update; chmod +x /usr/local/bin/rpg-update

before=$(git rev-parse HEAD)
if ! git pull --ff-only -q; then
  echo "Could not pull from GitHub."
  echo " - If the repository is private now, run once: sudo bash $APP/deploy/deploy-key.sh"
  echo " - If you changed files in $APP by hand, tell Claude what 'git status' shows."
  exit 1
fi
after=$(git rev-parse HEAD)
systemctl restart physics-rpg
if [ "$before" = "$after" ]; then
  echo "Already up to date ($(git log -1 --format='%h %s'))."
else
  echo "Updated. What changed:"; git log --format='  %h %s' "$before..$after" | head -15
fi
echo "Reload the game page on your phone to get the new version."
