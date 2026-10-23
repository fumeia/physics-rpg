#!/usr/bin/env bash
# Lets the server keep updating from a PRIVATE GitHub repository: creates a read-only "deploy key" on the server
# and points git at it. Run once, after (or before) making the repo private:
#   sudo bash /opt/physics-rpg/deploy/deploy-key.sh
set -euo pipefail
[ "$(id -u)" = 0 ] || exec sudo bash "$(readlink -f "$0")" "$@"
APP=$(dirname "$(dirname "$(readlink -f "$0")")"); cd "$APP"
KEY=/root/.ssh/physics-rpg-deploy; HOST=github-physics-rpg
url=$(git remote get-url origin)
slug=$(printf '%s' "$url" | sed -E 's#^(https://github\.com/|git@[^:]+:)##; s#\.git$##')   # owner/repo
case "$slug" in */*) ;; *) echo "Cannot read the GitHub repository from: $url"; exit 1;; esac

mkdir -p /root/.ssh && chmod 700 /root/.ssh
[ -f "$KEY" ] || ssh-keygen -q -t ed25519 -N "" -C "physics-rpg-server" -f "$KEY"
if ! grep -q "^Host $HOST\$" /root/.ssh/config 2>/dev/null; then
  printf '\nHost %s\n    HostName github.com\n    User git\n    IdentityFile %s\n    IdentitiesOnly yes\n    StrictHostKeyChecking accept-new\n' "$HOST" "$KEY" >>/root/.ssh/config
  chmod 600 /root/.ssh/config
fi

echo
echo "Add this key on GitHub (phone browser works): repository > Settings > Deploy keys > Add deploy key."
echo "Title: server. Paste the line below. Leave 'Allow write access' OFF. Then save."
echo
cat "$KEY.pub"
echo
read -r -p "Press Enter once the key is saved on GitHub... " _

git remote set-url origin "git@$HOST:$slug.git"
if git ls-remote -q origin >/dev/null 2>&1; then
  echo "Works. From now on rpg-update pulls with this key."
else
  git remote set-url origin "$url"
  echo "GitHub did not accept the key yet. Check that it is saved as a deploy key of $slug, then run this script again."
  exit 1
fi
