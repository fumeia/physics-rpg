#!/bin/bash
# Builds the Android app without Gradle (it has no libraries): aapt2 + javac + d8 + zipalign + apksigner from the Android SDK.
#   ANDROID_HOME=~/android-sdk RPG_KEYSTORE=~/.rpg-keys/rpg.jks RPG_KEYSTORE_PASS=... ./build-apk.sh [out.apk]
# Needs: JDK 17+, SDK packages "platforms;android-35" and "build-tools;35.0.0". Gradle (build.gradle) works as well where Maven is reachable.
set -euo pipefail
cd "$(dirname "$0")"
SDK=${ANDROID_HOME:-$HOME/android-sdk}; BT=$SDK/build-tools/35.0.0; JAR=$SDK/platforms/android-35/android.jar
OUT=${1:-build/physics-rpg.apk}; W=build/tmp; rm -rf "$W"; mkdir -p "$W"/{res,classes,dex} "$(dirname "$OUT")"
M=app/src/main
VER=$(grep -o "versionCode [0-9]*" app/build.gradle | grep -o "[0-9]*"); NAME=$(grep -o "versionName '[^']*'" app/build.gradle | cut -d"'" -f2)
"$BT/aapt2" compile --dir $M/res -o "$W/res.zip"
sed 's|<manifest |<manifest package="app.physicsrpg" |' $M/AndroidManifest.xml > "$W/AndroidManifest.xml" # Gradle takes the package from namespace
"$BT/aapt2" link -o "$W/base.apk" -I "$JAR" --manifest "$W/AndroidManifest.xml" "$W/res.zip" --java "$W/gen" \
  --min-sdk-version 26 --target-sdk-version 35 --version-code "$VER" --version-name "$NAME" --rename-manifest-package app.physicsrpg
javac -source 17 -target 17 -nowarn -classpath "$JAR" -d "$W/classes" $(find $M/java "$W/gen" -name '*.java') 2>&1 | grep -v "^Picked up\|warning: \[options\]\|^[0-9] warning" || true
"$BT/d8" --release --min-api 26 --lib "$JAR" --output "$W/dex" $(find "$W/classes" -name '*.class')
cp "$W/base.apk" "$W/unaligned.apk"; (cd "$W/dex" && zip -q -j ../unaligned.apk classes.dex)
"$BT/zipalign" -f -p 4 "$W/unaligned.apk" "$W/aligned.apk"
"$BT/apksigner" sign --ks "${RPG_KEYSTORE:?set RPG_KEYSTORE}" --ks-key-alias rpg --ks-pass "pass:${RPG_KEYSTORE_PASS:?}" --out "$OUT" "$W/aligned.apk"
"$BT/apksigner" verify "$OUT" && echo "built $OUT ($(du -h "$OUT" | cut -f1))"
