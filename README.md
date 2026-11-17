# Homigo Care — by Haider-Ai

Homigo Care brings home nursing, doctor consultations, lab services, medicine reminders, and family health records together in one place.

## Development

Requirements: Node.js 22+ and Bun 1.4.4+.

```sh
git clone <repository-url>
cd homigo-care-source
bun install --frozen-lockfile
bun run dev
```

## Build and checks

```sh
bun run build
bun test
bun run lint
```

## Technology

- TanStack Start and React
- TypeScript
- Tailwind CSS
- Capacitor for the Android app shell
- Vercel for production hosting

Android packaging and installation instructions are in [ANDROID_APK.md](./ANDROID_APK.md).
