#!/usr/bin/env bash
# Change the password of the game website (the login Caddy asks for). Asks for the new password, nothing is shown while you type.
#   sudo bash /opt/physics-rpg/deploy/set-password.sh
# Only the password changes (the user name stays). Caddy checks the new settings before it reloads; if it refuses, nothing changes.
set -euo pipefail
[ "$(id -u)" = 0 ] || exec sudo bash "$(readlink -f "$0")" "$@"
ETC=${ETC:-/etc}; SNIPPET=$ETC/caddy/physics-rpg.caddy; CADDYFILE=$ETC/caddy/Caddyfile
[ -f "$SNIPPET" ] || { echo "$SNIPPET not found: run deploy/setup.sh first"; exit 1; }
read -rs -p "New password (8 to 70 characters): " P; echo
read -rs -p "Again: " P2; echo
[ "$P" = "$P2" ] || { echo "The two entries differ. Nothing changed."; exit 1; }
[ "${#P}" -ge 8 ] && [ "${#P}" -le 70 ] || { echo "Use 8 to 70 characters. Nothing changed."; exit 1; }
HASH=$(caddy hash-password --plaintext "$P")
[ "${#HASH}" -eq 60 ] || { echo "Could not make the password hash. Nothing changed."; exit 1; }
cp "$SNIPPET" "$SNIPPET.bak"
sed -i -E "s|^(\t\t[^ ]+ ).*|\1$HASH|" "$SNIPPET"
if caddy validate --config "$CADDYFILE" --adapter caddyfile >/dev/null 2>&1; then
  systemctl reload caddy && echo "Password changed. Log in with the new one (private tab to test)."
else
  cp "$SNIPPET.bak" "$SNIPPET"; echo "Caddy did not accept it, the old password is still active."; exit 1
fi
