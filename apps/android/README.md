# Costiq — Android

Kotlin + Jetpack Compose client. Implements the M0–M7 screens from the
Claude Design project (`Kharcha Screens.dc.html`) against the real
`apps/worker` API — see `../../ANDROID_PLAN.md` at the repo root for the
full plan, screen-to-endpoint mapping, and known gaps.

## Setup

1. **Android Studio** (Ladybug/2024.2+ recommended) — open this `apps/android/` directory directly (not the repo root).
2. Let Gradle sync. If prompted about a missing wrapper, let Android Studio generate one (this repo doesn't commit the wrapper jar).
3. Copy `local.properties.example` → `local.properties` and fill in:
   - `SUPABASE_URL` / `SUPABASE_ANON_KEY` — same Supabase project as `apps/web` (see `apps/web/.env.local`'s `NEXT_PUBLIC_SUPABASE_*` values; the anon key is public-safe by design).
   - `API_BASE_URL` — defaults to `http://10.0.2.2:8787` (the emulator's alias for your host machine), matching `pnpm worker` running locally. For a physical device on the same LAN, use your machine's LAN IP instead, and add that IP to `app/src/debug/res/xml/network_security_config_debug.xml` (cleartext HTTP is only allowlisted for specific hosts, not by default).
4. Run `pnpm worker` from the repo root so something is actually listening on `:8787`.
5. Run the `app` configuration on an emulator or device (API 26+).

## What's real vs. stubbed

Wired to live endpoints today (same auth as the web dashboard — Supabase
session JWT, `apps/worker/src/auth.ts`'s `requireUser`):

- Sign in (Supabase Auth)
- Overview, Expenses, Review, Add-by-hand, Budget, Insights — all hit the
  actual `apps/worker` REST routes.

SMS ingestion is now live too — `data/sms/SmsClassifier.kt` (Stage 0 regex
classifier, unit-tested in `app/src/test/`), the Room upload queue,
`SmsReceiver`, and `SmsUploadWorker` upload to the real
`apps/worker/src/routes/sms.ts` endpoint. Parsing pending SMS into
transactions happens separately, via a connected MCP client
(`apps/worker/src/routes/mcp.ts`) calling `get_pending_sms`/
`save_transaction` — the worker itself never calls an LLM.

## Known simplifications

- **Manrope** isn't bundled (see `ui/theme/Type.kt` for why and how to add
  it) — layout, weights, and sizes match the design; the platform default
  typeface is used until real font files are dropped in.
- **Review bottom-bar badge** is hardcoded to 0 in `CostiqNavGraph.kt` — a
  real count would need a shared, app-scoped state holder rather than the
  per-screen ViewModel each tab currently uses.
- **"Edit first"** on the Review screen is implemented as a category picker
  inline in the expanded card, not a separate edit mode — `POST
  /api/review/:id/approve` only accepts a `category_id` correction, so
  that's the only field actually editable pre-approval today.
- No FCM / server push — budget-threshold alerts are a local
  `NotificationCompat` notification driven by a periodic `WorkManager` job
  (`data/notify/BudgetAlertWorker.kt`) plus an opportunistic check whenever
  Overview loads, not a server-triggered push (the worker has no
  push-sending code).

## Testing

- `SmsClassifierTest` (`app/src/test/`) checks the Stage-0 classifier
  against the real examples cited in `ARCHITECTURE_2.md` §7/§13, including
  the worked prompt-injection example — run it via Android Studio or
  `./gradlew testDebugUnitTest` once the Gradle wrapper is generated.
- Everything else needs manual verification in Android Studio — this was
  built in an environment without a JDK/Android SDK available, so none of
  it has been compiled or run yet. Treat first-build errors as expected,
  not a sign the whole approach is wrong — most likely candidates are
  library API drift (see the version-sensitive spots flagged in code
  comments: `RootViewModel.kt`'s `SessionStatus` mapping, `IconMap.kt`'s
  extended-icon names) rather than structural issues.
