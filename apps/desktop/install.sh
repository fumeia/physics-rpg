#!/bin/bash
# Physics RPG for the Linux desktop (Zorin OS, Ubuntu 22.04/24.04, other x86-64 distributions): installs for your user only.
#   bash physics-rpg-desktop-install.sh            install (or repair)
#   bash physics-rpg-desktop-install.sh --remove   uninstall (your progress stays on the server)
# After this one install the app keeps itself up to date from your server (game content and its own code).
set -euo pipefail
EV=44.10.2                                   # Electron (Chromium) runtime, pinned
HOME_DIR=${XDG_DATA_HOME:-$HOME/.local/share}/physics-rpg; BIN=$HOME/.local/bin; APPS=${XDG_DATA_HOME:-$HOME/.local/share}/applications
say() { printf '\033[1;36m==\033[0m %s\n' "$*"; }
if [ "${1:-}" = "--remove" ]; then
  rm -rf "$HOME_DIR/electron" "$HOME_DIR/shell" "$HOME_DIR/core" "$HOME_DIR/game" "$BIN/physics-rpg" "$APPS/physics-rpg.desktop"
  [ -f /etc/apparmor.d/physics-rpg ] && { say "Removing the AppArmor rule (asks for your password)"; sudo rm -f /etc/apparmor.d/physics-rpg; sudo systemctl reload apparmor 2>/dev/null || true; }
  say "Removed. Local settings in ~/.config/physics-rpg-app are kept (delete that folder too for a clean slate)."; exit 0
fi
[ "$(uname -m)" = "x86_64" ] || { echo "This installer is for x86-64 computers."; exit 1; }
command -v curl >/dev/null || { say "Installing curl"; sudo apt-get install -y curl; }
command -v unzip >/dev/null || { say "Installing unzip"; sudo apt-get install -y unzip; }
mkdir -p "$HOME_DIR" "$BIN" "$APPS"
if [ "$(cat "$HOME_DIR/electron/.version" 2>/dev/null)" != "$EV" ]; then
  say "Downloading the runtime (Electron $EV, about 110 MB, once)"
  T=$(mktemp -d); trap 'rm -rf "$T"' EXIT
  Z=electron-v$EV-linux-x64.zip; U=https://github.com/electron/electron/releases/download/v$EV
  curl -fL --progress-bar -o "$T/$Z" "$U/$Z"; curl -fsSL -o "$T/SHASUMS256.txt" "$U/SHASUMS256.txt"
  (cd "$T" && grep " \*\?$Z\$" SHASUMS256.txt | sed 's/ \*/  /' | sha256sum -c --quiet) || { echo "The download is damaged (checksum mismatch). Run the installer again."; exit 1; }
  rm -rf "$HOME_DIR/electron.new"; mkdir -p "$HOME_DIR/electron.new"; unzip -q "$T/$Z" -d "$HOME_DIR/electron.new"; echo "$EV" > "$HOME_DIR/electron.new/.version"
  rm -rf "$HOME_DIR/electron"; mv "$HOME_DIR/electron.new" "$HOME_DIR/electron"
fi
say "Installing the app"
rm -rf "$HOME_DIR/shell.new"; mkdir -p "$HOME_DIR/shell.new"
sed '1,/^__APP__$/d' "$0" | base64 -d | tar -xzf - -C "$HOME_DIR/shell.new"
rm -rf "$HOME_DIR/shell"; mv "$HOME_DIR/shell.new" "$HOME_DIR/shell"
# Chromium's sandbox needs user namespaces; Ubuntu 24.04 only allows them for programs with an AppArmor rule (like Chrome has)
SANDBOX=""
if [ "$(cat /proc/sys/kernel/apparmor_restrict_unprivileged_userns 2>/dev/null || echo 0)" = "1" ]; then
  say "Ubuntu 24.04 needs an AppArmor rule so the app's sandbox can run (asks for your password once)"
  if sudo tee /etc/apparmor.d/physics-rpg >/dev/null <<AA && sudo apparmor_parser -r /etc/apparmor.d/physics-rpg
abi <abi/4.0>,
include <tunables/global>
profile physics-rpg $HOME_DIR/electron/electron flags=(unconfined) {
  userns,
  include if exists <local/physics-rpg>
}
AA
  then :; else echo "   (no rule: the app runs without Chromium's sandbox; it only shows your own game files)"; SANDBOX="--no-sandbox"; fi
fi
cat > "$BIN/physics-rpg" <<SH
#!/bin/sh
exec "$HOME_DIR/electron/electron" $SANDBOX "$HOME_DIR/shell" "\$@"
SH
chmod +x "$BIN/physics-rpg"
cp "$HOME_DIR/shell/icon.png" "$HOME_DIR/icon.png"
cat > "$APPS/physics-rpg.desktop" <<DT
[Desktop Entry]
Type=Application
Name=Physics RPG
Comment=Study game for quantum mechanics, solid state physics and astrophysics
Exec=$BIN/physics-rpg
Icon=$HOME_DIR/icon.png
Terminal=false
Categories=Education;Science;Physics;Game;
StartupWMClass=physics-rpg
DT
update-desktop-database "$APPS" 2>/dev/null || true
if dpkg -s physics-rpg >/dev/null 2>&1; then say "The earlier GTK app is still installed; it is no longer needed: sudo apt remove physics-rpg"; fi
say "Done. Start \"Physics RPG\" from the app menu (or run: physics-rpg). It updates itself from your server from now on."
exit 0
__APP__
