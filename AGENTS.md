# Haider-Ai Project Notes

- Never rewrite published Git history. Do not force-push, rebase, amend, or squash commits that have already been pushed.
- Keep the main branch buildable; validate relevant changes before pushing.
- Do not edit files identified as automatically generated unless the task specifically requires regenerating them.
- Keep secrets out of source code, browser bundles, logs, and commits. Use the project's secret store for credentials.
- Do not change database schema or migrations as part of unrelated UI or branding work.
- Mobile app shell (header, tab bar, cards, buttons) lives in `src/components/app/shell.tsx`; each screen is its own route so it works as both web app and wrapped native app.
- Android packaging uses Capacitor with `server.url` pointing to the published app (see `ANDROID_APK.md`), because pages are server-rendered.
