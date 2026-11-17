# Haider-Ai Project Notes

- Never rewrite published Git history. Do not force-push, rebase, amend, or squash commits that have already been pushed.
- Keep the main branch buildable; validate relevant changes before pushing.
- Do not edit generated files except when regenerating them as part of the task.
- Keep secrets out of source code, browser bundles, logs, and commits. Use the project's secret store for credentials.
- Do not change database schema or migrations as part of unrelated UI or branding work.
- Mobile shell, navigation, cards and controls live in `src/components/app/shell.tsx`; each screen is a TanStack route under `src/routes/`.
- Patient, professional and admin prototype state is local to this device in `src/lib/pro/store.ts`; do not imply cross-device syncing until an authenticated shared backend is configured.
- Android packaging uses the checked-in Capacitor project and GitHub Actions workflow; the app loads the published URL from `capacitor.config.json`.
- The dismissible Homigo Care website badge is `src/components/app/brand-badge.tsx`; preserve its system-browser behavior in the native app.
