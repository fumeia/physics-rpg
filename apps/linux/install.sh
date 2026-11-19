#!/bin/bash
# Installs the Physics RPG desktop app for the current user (Zorin OS 17/18, Ubuntu 22.04/24.04 and relatives).
#   bash install.sh            # install or update
#   bash install.sh --remove   # uninstall (your progress stays on the server; the local copy in ~/.local/share/physics-rpg is removed)
# Alternative: sudo apt install ./physics-rpg_1.2_all.deb (from https://<your server>/downloads/).
set -e
cd "$(dirname "$0")"
APPDIR=$HOME/.local/share/physics-rpg/app; BIN=$HOME/.local/bin
if [ "${1:-}" = "--remove" ]; then
  rm -rf "$APPDIR" "$HOME/.local/share/physics-rpg/web" "$HOME/.cache/physics-rpg" "$BIN/physics-rpg-desktop" "$HOME/.local/share/applications/physics-rpg.desktop" "$HOME/.local/share/icons/hicolor/512x512/apps/physics-rpg.png"
  echo "Removed (settings in ~/.config/physics-rpg kept)."; exit 0
fi
API=4.1; apt-cache show gir1.2-webkit2-4.1 >/dev/null 2>&1 || API=4.0
if ! /usr/bin/python3 -c "import gi; gi.require_version('WebKit2', '$API'); from gi.repository import WebKit2" 2>/dev/null; then
  echo "Installing GTK WebKit for Python (asks for your password once)…"
  sudo apt-get install -y python3-gi gir1.2-gtk-3.0 gir1.2-webkit2-$API
fi
mkdir -p "$APPDIR" "$BIN" "$HOME/.local/share/applications" "$HOME/.local/share/icons/hicolor/512x512/apps"
sed "s/gi.require_version('WebKit2', '4.1')/gi.require_version('WebKit2', '$API')/" physics-rpg-desktop > "$APPDIR/physics-rpg-desktop"; chmod +x "$APPDIR/physics-rpg-desktop"
cp icon.png "$APPDIR/icon.png"; cp icon.png "$HOME/.local/share/icons/hicolor/512x512/apps/physics-rpg.png"
ln -sf "$APPDIR/physics-rpg-desktop" "$BIN/physics-rpg-desktop"
sed "s|^Exec=physics-rpg-desktop|Exec=$APPDIR/physics-rpg-desktop|" physics-rpg.desktop > "$HOME/.local/share/applications/physics-rpg.desktop"
update-desktop-database "$HOME/.local/share/applications" 2>/dev/null || true
gtk-update-icon-cache -q "$HOME/.local/share/icons/hicolor" 2>/dev/null || true
echo "Installed. Start it from the app menu (Physics RPG) or with: physics-rpg-desktop"
