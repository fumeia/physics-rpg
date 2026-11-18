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
- Linux desktop: `https://<your server>/downloads/physics-rpg_1.1_all.deb`

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

## Linux desktop (Zorin OS 17/18, Ubuntu 22.04/24.04)
Install the deb, which pulls in GTK WebKit:
```bash
sudo apt install ./physics-rpg_1.1_all.deb
```
Or install from the repository without root files, into `~/.local`:
```bash
bash apps/linux/install.sh
```
Start **Physics RPG** from the app menu. The first start asks for the game address and the login. Right-click the menu entry and choose **Server settings** to change them.

Keys:
- F11: full screen
- Ctrl+R: reload
- Ctrl+, (comma): server settings
- Ctrl+Q: quit

Local data:
- `~/.local/share/physics-rpg/web`: the offline copy and local progress
- `~/.config/physics-rpg/config.json`: address and login, readable only by you

Uninstall:
```bash
sudo apt remove physics-rpg
```
or
```bash
bash apps/linux/install.sh --remove
```

## Tests
- `node game/test/merge-check.mjs`: the merge rules.
- `node game/test/offline-sync-smoke.mjs`: two browsers go offline, both play, both come back, and the server has everything. It also checks that the game starts offline and that a stale save gets a 409.
- Desktop app check: `xvfb-run apps/linux/physics-rpg-desktop --url 'http://127.0.0.1:8123/index.html?sw=1' --test 30` prints what loaded, including whether the service worker controls the page.
