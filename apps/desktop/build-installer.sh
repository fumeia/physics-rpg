#!/bin/bash
# Builds game/downloads/physics-rpg-desktop-install.sh: one self-contained installer (the app code is packed inside).
# The Electron runtime is not packed: the installer downloads the pinned version from GitHub and checks its SHA-256.
set -euo pipefail; cd "$(dirname "$0")"
OUT=../../game/downloads/physics-rpg-desktop-install.sh
{ sed -n '1,/^__APP__$/p' install.sh; tar -C app -czf - --dereference . | base64 -w 120; } > "$OUT"; chmod +x "$OUT"
echo "built $OUT ($(du -h "$OUT" | cut -f1))"
