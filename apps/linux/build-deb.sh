#!/bin/bash
# Builds physics-rpg_<version>_all.deb (installs to /opt/physics-rpg, a menu entry and an icon; apt pulls in GTK WebKit).
set -e; cd "$(dirname "$0")"; V=${VERSION:-1.0}; OUT=${1:-build/physics-rpg_${V}_all.deb}; R=build/deb; rm -rf "$R"; mkdir -p "$R/DEBIAN" "$R/opt/physics-rpg" "$R/usr/bin" "$R/usr/share/applications" "$R/usr/share/icons/hicolor/512x512/apps" "$(dirname "$OUT")"
cp physics-rpg-desktop icon.png "$R/opt/physics-rpg/"; chmod 755 "$R/opt/physics-rpg/physics-rpg-desktop"; ln -s /opt/physics-rpg/physics-rpg-desktop "$R/usr/bin/physics-rpg-desktop"
cp physics-rpg.desktop "$R/usr/share/applications/"; cp icon.png "$R/usr/share/icons/hicolor/512x512/apps/physics-rpg.png"
cat > "$R/DEBIAN/control" <<CTL
Package: physics-rpg
Version: $V
Architecture: all
Maintainer: Physics RPG <noreply@localhost>
Depends: python3, python3-gi, gir1.2-gtk-3.0, gir1.2-webkit2-4.1
Section: education
Priority: optional
Description: Physics RPG desktop app
 A window around the Physics RPG study game on your own server, with offline play and sync.
CTL
dpkg-deb --root-owner-group --build "$R" "$OUT" >/dev/null && echo "built $OUT"
