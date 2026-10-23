#!/usr/bin/env bash
# Pull the latest game from GitHub and restart it. Profiles live in /var/lib/physics-rpg and are not touched.
#   sudo bash /opt/physics-rpg/deploy/update.sh
set -euo pipefail
cd "$(dirname "$0")/.."
git pull --ff-only
systemctl restart physics-rpg
echo "Updated to $(git log -1 --format='%h %s')"
