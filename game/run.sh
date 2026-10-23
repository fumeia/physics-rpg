#!/bin/sh
# Serve the game locally and open it as a standalone window (no browser chrome) if Chromium exists.
cd "$(dirname "$0")" || exit 1
PORT=${PORT:-8123}
python3 serve.py --port "$PORT" >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null' EXIT
sleep 1
if command -v chromium >/dev/null 2>&1; then
  chromium --app="http://127.0.0.1:$PORT/index.html" --user-data-dir="${TMPDIR:-/tmp}/physics-rpg-profile"
else
  echo "Open http://127.0.0.1:$PORT/index.html in a browser. Ctrl+C to stop."; wait $SERVER
fi
