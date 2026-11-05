#!/usr/bin/env bash
# Updates the Questboard server on THIS server straight from GitHub, without the laptop (tools/deploy-server.sh in the
# questboard repository does the same from the laptop). Run on the server; safe to run again:
#   sudo bash /opt/physics-rpg/deploy/questboard-server-update.sh
# Later it is also installed as the shortcut: sudo qb-server-update
#
# Questboard is a private repository, so the first run creates a read-only "deploy key" and asks you to add it on GitHub
# (phone browser works). Your token, Notion secret and data (~/questboard-server/.env and data/) are never touched;
# the old program files are kept in ~/questboard-server/old-<date>/.
set -euo pipefail
[ "$(id -u)" = 0 ] || exec sudo bash "$(readlink -f "$0")" "$@"
BIN=${BIN:-/usr/local/bin}; SRC=${QB_SRC:-/opt/questboard-src}; REPO=${QB_REPO:-fumeia/questboard}; BRANCH=${QB_BRANCH:-main}
KEY=/root/.ssh/questboard-deploy; HOST=github-questboard

DIR=${QB_DIR:-}
if [ -z "$DIR" ]; then for d in /root/questboard-server /home/*/questboard-server; do [ -f "$d/.env" ] && { DIR=$d; break; }; done; fi
[ -n "$DIR" ] && [ -f "$DIR/.env" ] || { echo "Questboard's folder (questboard-server with a .env) was not found. Give it: sudo QB_DIR=/path bash $0"; exit 1; }
echo "Questboard folder: $DIR"

# 1. read access to the private repository
mkdir -p /root/.ssh && chmod 700 /root/.ssh
[ -f "$KEY" ] || ssh-keygen -q -t ed25519 -N "" -C "questboard-server" -f "$KEY"
if ! grep -q "^Host $HOST\$" /root/.ssh/config 2>/dev/null; then
  printf '\nHost %s\n    HostName github.com\n    User git\n    IdentityFile %s\n    IdentitiesOnly yes\n    StrictHostKeyChecking accept-new\n' "$HOST" "$KEY" >>/root/.ssh/config
  chmod 600 /root/.ssh/config
fi
URL=${QB_GIT_URL:-"git@$HOST:$REPO.git"}
until git ls-remote -q "$URL" >/dev/null 2>&1; do
  echo
  echo "Once only: add this key on GitHub (phone browser works): github.com/$REPO > Settings > Deploy keys > Add deploy key."
  echo "Title: server. Paste the line below. Leave 'Allow write access' OFF. Save."
  echo
  cat "$KEY.pub"
  echo
  read -r -p "Press Enter once it is saved (Ctrl+C to stop)... " _
done

# 2. newest code
if [ -d "$SRC/.git" ]; then git -C "$SRC" fetch -q origin "$BRANCH" && git -C "$SRC" checkout -q -B "$BRANCH" "origin/$BRANCH"
else git clone -q --branch "$BRANCH" "$URL" "$SRC"; fi
echo "Questboard code: $(git -C "$SRC" log -1 --format='%h %s')"

# 3. replace the program files only (never .env or data/)
FILES="qb_server.py notion_sync.py notion.json Dockerfile docker-compose.yml docker-compose.network.yml"
OLD="$DIR/old-$(date +%F-%H%M%S)"; mkdir -p "$OLD"
for f in $FILES; do
  if [ -f "$DIR/$f" ]; then cp -p "$DIR/$f" "$OLD/"; fi
  if [ -f "$SRC/server/$f" ]; then install -m 644 "$SRC/server/$f" "$DIR/$f"; fi
done
owner=$(stat -c %U:%G "$DIR"); chown "$owner" "$DIR"/*.py "$DIR"/*.json "$DIR"/Dockerfile "$DIR"/*.yml "$OLD" 2>/dev/null || true
for o in $(ls -d "$DIR"/old-* | sort | head -n -3); do rm -rf "$o"; done   # keep the last 3 copies

# 4. rebuild and restart the container (same compose files as deploy-server.sh)
envv() { sed -n "s/^$1=//p" "$DIR/.env" | tail -1; }
FILES_ARG="-f docker-compose.yml"; if [ -n "$(envv QB_DOCKER_NETWORK)" ]; then FILES_ARG="$FILES_ARG -f docker-compose.network.yml"; fi
cd "$DIR"
if docker compose version >/dev/null 2>&1; then docker compose $FILES_ARG up -d --build; else docker-compose $FILES_ARG up -d --build; fi

bind=$(envv QB_BIND); case "${bind:-0.0.0.0}" in 0.0.0.0) bind=127.0.0.1;; esac; port=$(envv QB_PORT_HOST)
for i in $(seq 40); do curl -sf "http://$bind:${port:-8787}/api/health" >/dev/null && { up=1; break; }; sleep 1; done
if [ -z "${up:-}" ]; then echo "Questboard did not come back. Look at: docker logs questboard   (old files: $OLD)"; exit 1; fi
echo "Questboard server is up again (http://$bind:${port:-8787})."

printf '#!/bin/sh\nexec bash %s "$@"\n' "$(readlink -f "$0")" >"$BIN/qb-server-update"; chmod +x "$BIN/qb-server-update"
if command -v rpg-questboard >/dev/null; then echo; echo "Physics RPG link:"; rpg-questboard >/dev/null 2>&1 || true; rpg-questboard --check || true; fi
echo
echo "Next time: sudo qb-server-update"
