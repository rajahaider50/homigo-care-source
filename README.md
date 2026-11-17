# Homigo Care — by Haider-Ai

Homigo Care is a mobile-first care prototype with patient, healthcare professional, and admin panels. It includes appointment booking, family health files, professional verification, service requests, messaging, notifications, and admin audit/booking workflows. Prototype data is stored on the current device; a shared production backend and real role sign-in are not configured yet.

## Development

Requirements: Node.js 22+ and Bun 1.4.4+.

```sh
bun install --frozen-lockfile
bun run dev
```

## Build and checks

```sh
bun run build
bun run test
bun run lint
```

## Android testing

The checked-in Capacitor Android project loads the published Homigo Care website. Use GitHub Actions → **Build Android APK** → **Run workflow**, then download the `homigo-care-debug-apk` artifact. See [ANDROID_APK.md](./ANDROID_APK.md).

## Main routes

- `/`: choose Patient, Doctor, Nurse, or Admin
- `/patient`, `/book`, `/bookings`, `/file`, `/messages`: patient workflows
- `/pro`, `/pro/requests`, `/pro/messages`, `/pro/profile`, `/upload`: healthcare professional workflows
- `/admin`, `/admin/verify`, `/admin/bookings`, `/admin/people`, `/admin/messages`, `/admin/audit`: administration workflows
