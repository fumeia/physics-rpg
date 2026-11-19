# Physics RPG apps (Android, Linux desktop)

Both are thin windows around the game on **your server**. Content and updates still come from the server (`sudo rpg-update`),
so the apps only need reinstalling when the app shell itself changes, which should be rare.

**Same progress everywhere, also offline.** Browser, phone and desktop use the same profile on the server.
- **Offline copy.** Each device keeps a copy of the whole game through the service worker, so it starts and plays without a network after its first online start.
- **Saving offline.** Progress is saved on the device while offline.
- **Syncing.** Each device syncs when it comes back online, when the app comes to the front, after every save, and every 45 seconds.
- **Merging.** If two devices both changed something while apart, the saves are merged (`game/src/merge.js`, test `game/test/merge-check.mjs`) and nothing is lost:
  - XP and study time from both devices add up.
  - Everything solved on either device stays solved.
  - Logs are joined.
  - A setting changed on one device wins.
- **No overwriting.** The server refuses a save that was not based on its current copy (HTTP 409), so one device can never overwrite another's progress.

## Downloads (served by your game server)
- Android: `https://<your server>/downloads/physics-rpg.apk`
- Linux desktop: `https://<your server>/downloads/physics-rpg-desktop-install.sh` (one-time install, then it updates itself)

## Android
1. Open the APK link on the phone and log in with the server login.
2. Allow "install unknown apps" for the browser when Android asks, then install.
3. On first start, enter the game address, e.g. `https://physics.example.com/`, and the server login (the basic-auth name and password from `deploy/setup.sh`).
4. To change the address later, long-press the app icon and choose **Server settings**.

Notes:
- Back closes the open panel, like Esc. Pressing back twice leaves the app.
- If the server has a `PHYSICS_RPG_TOKEN`, the game asks for it once, exactly as in the browser.

Build: `apps/android/build-apk.sh`. It needs only the Android SDK (platform 35 and build-tools 35.0.0) and a JDK; no Gradle or libraries. `build.gradle` also works with Gradle.

**Signing key.** The key is kept outside the repository. Android only installs an update over the old app when it is signed with the same key. If a future build uses a new key:
1. Open the old app online once, so it syncs.
2. Uninstall it, then install the new one. Your progress comes back from the server.

## Linux desktop (Zorin OS, Ubuntu 22.04/24.04, any x86-64 Linux): `apps/desktop/`
The game **runs on the laptop**: an Electron (Chromium) app with its own copy of all game files, so 3D, speed and offline play
do not depend on the server. Only progress goes over the network, through the game's own sync.
- The sync is offline-first with a three-way merge, and the server refuses stale saves.
- It syncs at start, after each save, when the window gets focus, every 45 s, and once more on quit.

**Updates install themselves.** Every 10 minutes, at start, and after waking from sleep, the app asks the server for its file list
(`/api/manifest`, path → [mtime, size]). It then:
1. Downloads only the changed files into a new version folder. Unchanged files are hard-linked.
2. Checks every file size.
3. Switches to the new version with one atomic rename of the `current` pointer. A half-finished download is never used.

An open window offers "Load it now", and otherwise the new version is used at the next start. The app's own code
(`apps/desktop/app/`, published as `game/downloads/desktop/app`) updates the same way (`/api/manifest?part=desktop`). The
unchanging `loader.js` falls back to the installed copy if an updated version fails to start. So after the one install, a
`git push` to main followed by `sudo rpg-update` on the server is all it takes: the laptop picks it up by itself.

**Install once.** Download `https://<your server>/downloads/physics-rpg-desktop-install.sh` in the browser, then run:
```bash
bash ~/Downloads/physics-rpg-desktop-install.sh
```
The installer:
- downloads Electron 44.10.2 from GitHub (about 110 MB, once) and checks its SHA-256
- installs the app for your user only, in `~/.local/share/physics-rpg`
- adds the menu entry "Physics RPG" and the command `physics-rpg`
- on Ubuntu 24.04, adds the AppArmor rule that Chromium's sandbox needs (asks for the password once)

The first start downloads the game (about 7 MB) and takes over the address and login of the earlier GTK app. Without those, it asks for them. The password is kept encrypted in the GNOME keyring.

Keys:
- F11: full screen
- Ctrl+R: reload
- Ctrl+U: check for updates now
- Ctrl+, (comma): server settings
- Ctrl+Shift+I: developer tools
- Ctrl+Q: sync and quit

Log: `~/.local/share/physics-rpg/app.log`. Uninstall:
```bash
bash physics-rpg-desktop-install.sh --remove
```
The earlier WebKitGTK app (`apps/linux/`, the `.deb`) is superseded. Its WebGL drew broken copies of the screen. Remove it with:
```bash
sudo apt remove physics-rpg
```
Rebuild the installer after changing `apps/desktop/install.sh` with `apps/desktop/build-installer.sh`. Changes to `apps/desktop/app/` need no rebuild, because installed apps fetch them from the server.

## Tests
- `node game/test/merge-check.mjs`: the merge rules.
- `node game/test/offline-sync-smoke.mjs`: two browsers go offline, both play, both come back, and the server has everything. It also checks that the game starts offline and that a stale save gets a 409.
- Desktop app check: `xvfb-run apps/linux/physics-rpg-desktop --url 'http://127.0.0.1:8123/index.html?sw=1' --test 30` prints what loaded, including whether the service worker controls the page.
