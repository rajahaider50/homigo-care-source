# Homigo Care — Android APK

The Capacitor app shell loads the live Homigo Care website at `https://homigo-care-source.vercel.app`; an internet connection is required. The Homigo Care badge opens that website in the Android system browser/Custom Tab. On desktop web it opens a new tab.

## Build and download the debug APK

The native Android project is checked in at `android/`. In the private GitHub repository, open **Actions → Build Android APK → Run workflow**. When the run succeeds, download the `homigo-care-debug-apk` artifact. The artifact contains `app-debug.apk`, which can be installed on an Android device after allowing installs from that download source.

## Local build

Requirements: Node.js 22+, Bun 1.4.4+, JDK 21, Android SDK Platform 36 and Build-Tools 36.0.0.

```sh
bun install --frozen-lockfile
bunx cap sync android
cd android
./gradlew --no-daemon assembleDebug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`.

The project uses Capacitor 8.6.2 and `@capacitor/browser` 8.0.5. Re-run `bunx cap sync android` after Capacitor config or native-plugin changes. The debug APK is for testing/sideloading; Play Store distribution requires a signed release build and a keystore.
