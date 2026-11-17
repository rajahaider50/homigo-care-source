# Homigo Care — Roadmap

The current prototype includes patient, healthcare professional (Doctor/Nurse), and Admin panels. Panel state is stored on the current device; it is not a multi-user or multi-device service yet.

## Healthcare professional panel

- Dashboard, profile, and staged verification (credentials, experience, knowledge questions) with admin review.
- Service requests with accept/decline, double-accept protection, required service notes, and activity history.
- Patient information scoped to active assignments with record-view logging; availability and ratings views.

## Patient panel

- Home, family members, service catalogue, and availability-aware booking with duplicate protection.
- Booking lifecycle, cancellation, chat, family health file, record-view history, ratings, problem reports, and notifications.

## Admin panel

- Dashboard and announcements, verification queue, booking oversight, people/profile review, service controls, ratings moderation, complaints, and audit logs.

## Release

- Production web app: https://homigo-care-source.vercel.app
- Android test APK: run the repository's **Build Android APK** GitHub Actions workflow and download the `homigo-care-debug-apk` artifact.

## Needed before a real multi-user launch

- Real sign-in for each role and a shared online database. Prototype records currently stay on this device.
- Server-side authorization for every rule under `src/lib/pro/`.
- Secure file storage for credential documents; the prototype stores only file names.
