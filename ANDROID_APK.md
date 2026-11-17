# Homigo Care — Android APK

The Capacitor Android app loads the live Homigo Care site at `https://homigo-care-source.vercel.app`; an internet connection is required. The dismissible Homigo Care badge opens the site in a new browser tab on the web and the Android system browser/Custom Tab in the app. The launcher icon uses the Homigo Care logo.

## Build and download a debug APK

1. Open the private GitHub repository and select **Actions → Build Android APK → Run workflow**.
2. Wait for the workflow to finish successfully.
3. Download the `homigo-care-debug-apk` artifact and extract `app-debug.apk`.
4. Install it on Android, allowing installs from the browser or file manager used to download it.

## Local build

Requirements: Node.js 22+, Bun 1.4.4+, JDK 21, Android SDK Platform 36 and Build-Tools 36.0.0.

```sh
bun install --frozen-lockfile
bunx cap sync android
cd android
./gradlew --no-daemon assembleDebug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`.

The project uses Capacitor 8.6.2 and `@capacitor/browser` 8.0.5. Re-run `bunx cap sync android` after Capacitor config or native-plugin changes. The debug APK is for testing/sideloading; Play Store distribution requires a signed release build and a private keystore.
