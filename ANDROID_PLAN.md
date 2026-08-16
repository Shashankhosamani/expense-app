# Costiq Android App — Implementation Plan

## Context

`ARCHITECTURE_2.md` specifies Kotlin + Jetpack Compose for the Android client (§16), and a design has been produced in a Claude Design project (`Kharcha Screens.dc.html`, imported via the `claude_design` MCP). That doc contains 10 web screens (S1–S10, out of scope here) plus **8 Android mobile screens (M0–M7)** rendered through the `android-frame.jsx` Material-3 device-frame component, at 412×892.

The backend (`apps/worker`) already implements every REST endpoint needed for 7 of the 8 screens — verified by reading `apps/worker/src/routes/*.ts` and `packages/shared/src/*.ts`:

| Endpoint | Status |
|---|---|
| Supabase Auth (email/password) | done — same project as web |
| `GET/POST/PATCH/DELETE /api/transactions`, `POST /api/transactions/manual` | done |
| `GET /api/summary/:month`, `GET /api/summary/insights` | done |
| `GET/PUT /api/budgets/:month` | done |
| `GET /api/review`, `POST /api/review/:id/approve`, `POST /api/review/:id/dismiss` | done |
| `GET /api/categories` | done |
| `POST /api/sms` (ingestion) + device-key auth | **not built** — `apps/worker/src/index.ts` marks this "deferred" |

All existing `/api/*` routes are gated by `requireUser` (`apps/worker/src/auth.ts`), which only checks a Supabase session JWT — there is no device-key path today. So Android authenticates the exact same way the web dashboard does: Supabase Auth → JWT → `Authorization: Bearer` on every worker call.

I will build the SMS capture pipeline (receiver, on-device Stage-0 classifier, local queue, uploader) now, against the documented `POST /api/sms` contract from §15 — it'll start working the day that endpoint ships. The upload call is marked clearly as pointing at a not-yet-implemented endpoint. The Supabase anon key was read from `apps/web/.env.local` (public-safe, already shipped in the web bundle) — nothing else from that file was touched.

**Environment note:** this shell has no Java/Android SDK (`java`, `ANDROID_HOME` both absent), so compiling, running, or screenshotting the app isn't possible here. This plan produces a structurally complete, idiomatic Gradle/Compose project, but you'll need Android Studio to build and visually verify it — that's a real gap, not a formality.

## Tech stack

- **Kotlin + Jetpack Compose**, Material 3 (per §16)
- **minSdk 26 / target-compile 34** — 26 is required for notification channels and covers the SMS broadcast APIs cleanly
- **Navigation:** `androidx.navigation.compose`, bottom nav with 5 destinations (Overview, Expenses, Add[FAB], Review, Insights) — matches the design's `tabs()` data (`layout-dashboard`, `receipt-text`, `plus`, `shield-alert` w/ badge, `chart-column`). Budget (M5) is reached from the Overview budget card, not a tab, matching the design (it's absent from `tabs()`).
- **DI:** Hilt
- **Networking:** Retrofit + OkHttp + kotlinx.serialization, mirroring `apps/web/lib/api-request.ts`'s shape 1:1 (same JSON field names — no server-side changes needed)
- **Auth:** `supabase-kt` (Auth plugin only) against the same Supabase project as web (`https://nyfvtdqpasvxtaygzllz.supabase.co`); an OkHttp `Authenticator`/interceptor attaches the live session's access token to every worker request, refreshing via supabase-kt when expired
- **Local storage:** DataStore (session/theme prefs), Room (SMS capture queue only — `pending_sms` table mirroring the on-device side of `sms_messages`)
- **Background work:** `BroadcastReceiver` for `SMS_RECEIVED`, pure-Kotlin Stage-0 classifier (regex/keyword, no network — port of the decision table in ARCHITECTURE_2.md §7), `WorkManager` for queued upload with retry/backoff
- **Notifications:** local `NotificationCompat` channel for budget-threshold alerts, computed client-side from the already-fetched `BudgetStatus` (no FCM — the worker has no push-sending code yet, so a server-push implementation would be unverifiable fiction)
- **Fonts/icons:** Manrope bundled as `res/font/*.ttf` (same family as web); each Lucide icon name in the design mapped to the closest `androidx.compose.material.icons.extended` equivalent (e.g. `shield-alert`→`ReportProblem`, `receipt-text`→`Receipt`, `layout-dashboard`→`Dashboard`, `chart-column`→`BarChart`, `store`→`Storefront`, `calendar-clock`→`Schedule`, `message-square-lock`→`Lock` inside a rounded tile matching the design's icon-in-a-box treatment)
- **Design tokens** (from the `.dc.html`, dark variant used on Sign-in/Budget headers): ink `#10222A`, vermilion accent `#F43A09`, paper `#FAFDFE`/card `#FBFDFE`, hairline borders `#CDE6EE`/`#E0F2F7`, muted text `#5B7885`/`#63838E`, success `#23935C`, warning `#A9670A`, danger `#C22B04` — encoded as a Compose `ColorScheme` + a small `CostiqColors` object for the non-Material extras (tints, dashed-rule color, etc.)

## Screens (M0–M7 from the design) → data source

| # | Screen | Backing calls |
|---|---|---|
| M0 | Sign in | Supabase Auth `signInWith(Email)` |
| M1 | Overview | `GET /api/summary/:month`, `GET /api/transactions?limit=6`, `GET /api/review` (for the banner/count) |
| M2 | Expenses (grouped by day, filters, search) | `GET /api/transactions` (month/category/source/q filters, paginated) |
| M3 | Review (suspicious/held SMS, approve/dismiss/edit) | `GET /api/review`, `POST /api/review/:id/approve`, `POST /api/review/:id/dismiss` |
| M4 | Add an expense by hand | `POST /api/transactions/manual` |
| M5 | Budget (spent/left/warning, monthly limit editor, alert toggles) | `GET/PUT /api/budgets/:month` |
| M6 | Insights (month-by-month bar chart, by-category breakdown) | `GET /api/summary/insights` |
| M7 | "Let Costiq read your bank messages" (SMS permission rationale) | native `READ_SMS`/`RECEIVE_SMS` runtime permission request; on Allow, registers the receiver described below |

## Project structure

New Gradle project at `apps/android/` (sibling to `apps/web`, `apps/worker` — pnpm-workspace glob `apps/*` only matches directories with `package.json`, so this won't collide with the pnpm workspace):

```
apps/android/
  settings.gradle.kts, build.gradle.kts, gradle.properties
  local.properties.example        (SUPABASE_URL / SUPABASE_ANON_KEY / API_BASE_URL placeholders)
  app/build.gradle.kts
  app/src/main/AndroidManifest.xml
  app/src/main/java/com/costiq/app/
    CostiqApplication.kt                 (Hilt entrypoint)
    MainActivity.kt
    ui/theme/{Color,Type,Theme}.kt
    ui/nav/{CostiqNavGraph,BottomBar}.kt
    ui/screens/signin/SignInScreen.kt (+ ViewModel)
    ui/screens/overview/...
    ui/screens/expenses/...
    ui/screens/review/...
    ui/screens/addexpense/...
    ui/screens/budget/...
    ui/screens/insights/...
    ui/screens/smsonboarding/...
    data/api/CostiqApi.kt, dto/*.kt      (mirrors packages/shared/src/*.ts field-for-field)
    data/auth/SupabaseAuthManager.kt, AuthInterceptor.kt
    data/repo/{Transactions,Summary,Review,Budget,Category}Repository.kt
    data/sms/{SmsReceiver,SmsClassifier,PendingSmsEntity,PendingSmsDao,CostiqDatabase,SmsUploadWorker}.kt
    data/notify/BudgetAlertNotifier.kt
    di/{NetworkModule,AuthModule,DatabaseModule}.kt
  app/src/main/res/font/manrope_*.ttf
```

Retrofit DTOs and repository method signatures will match `packages/shared/src/transaction.ts`, `budget.ts`, `review.ts`, `summary.ts`, `categories.ts` exactly (same field names, same enums: `debit`/`credit`, `sms`/`manual`, the 6 `SMS_STATUSES`) — no backend changes needed, no drift between clients.

The Stage-0 `SmsClassifier` is a direct Kotlin port of the decision table in ARCHITECTURE_2.md §7 (hard-exclude OTP/admin patterns → sender-shape check → currency+verb → currency XOR verb → discard), kept as a small pure function so it's easy to unit-test against the same fixtures implied by `parser_evals.json` (§13).

## What I will not build

- FCM/server push (no backend support exists to trigger it — see notifications note above)
- Any change to `apps/worker` or `packages/shared` (out of scope; this is a client-only task)
- MCP token management screen (§16 explicitly keeps this web-only)

## Verification

- Kotlin/Gradle compilation can't be run in this shell (no JDK/Android SDK) — the code will be written to be correct, but it's unverified-by-me until built.
- The `SmsClassifier` logic should be checked by inspection against the §7 examples already in the architecture doc and the `parser_evals.json`-style fixture, written as a local Kotlin test file to run once Android Studio is available.
- Remaining manual steps: open `apps/android/` in Android Studio, let Gradle sync, copy `local.properties.example` → `local.properties` with the Supabase URL/anon key, point `API_BASE_URL` at the running worker (`10.0.2.2:8787` for an emulator against `pnpm worker`), and run on an emulator/device to visually compare against the design.
