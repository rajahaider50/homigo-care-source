# Homigo Care — Android APK (Capacitor + Android Studio)

The app runs server-side pages, so the Android shell loads the published app URL.

1. Publish the app in Lovable and copy the URL.
2. Put that URL in `capacitor.config.json` → `server.url`.
3. Install: Node.js 20+, Android Studio (with Android SDK), Git.
4. In the project folder:
   ```
   npm install
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap add android
   npx cap sync android
   npx cap open android
   ```
5. App icon: Android Studio → right-click `app/res` → New → Image Asset → choose `public/favicon.png` (or the full logo).
6. Debug APK: Build → Build Bundle(s) / APK(s) → Build APK(s). File: `android/app/build/outputs/apk/debug/app-debug.apk`.
7. Play Store: Build → Generate Signed Bundle / APK → create a keystore → choose AAB.

After app changes: publish again. Only re-run `npx cap sync android` if you change `capacitor.config.json`.
