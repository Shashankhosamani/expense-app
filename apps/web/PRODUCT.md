# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Individual consumers in India who receive bank and UPI transaction SMS on their phone and want their spending tracked without manual entry — inferred from the product mechanism (SMS-in, categorized-expense-out) and the existing landing copy's "Made for UPI & bank SMS" framing. No B2B, household-shared, or business-expense angle is confirmed.

## Product Purpose

Costiq turns bank/UPI transaction SMS into categorized, budgeted expense tracking automatically. A user connects their phone once; every incoming transaction SMS is parsed, categorized, and reflected in budgets and history with no manual entry. Available on web (dashboard) and Android (SMS capture + same dashboard).

## Positioning

Automatic, SMS-native expense capture for the Indian market (UPI + Indian bank SMS formats), positioned against manual-entry trackers and spreadsheets. Confirmed differentiator to surface on the landing page: transaction SMS is decrypted only briefly, specifically for Claude to read the amount/merchant, and that access is kept separate from any other account token — a privacy-by-mechanism story distinct from "we don't read your messages" hand-waving competitors use. (Source: Android sign-in screen copy, `apps/android/.../SignInScreen.kt`.)

## Operating Context

- Web dashboard (`apps/web`) and Android app (`apps/android`) share one Supabase-backed account; data and categories sync across both.
- Ambiguous SMS parses land in a review queue for the user to confirm or discard before they count toward budgets/history.
- Sign-in supports email/password and Google (Credential Manager on Android, OAuth redirect on web).

## Capabilities and Constraints

- Confirmed: real-time SMS capture and categorization, budgets per category, review queue for ambiguous messages, full edit history, web + Android parity.
- Undecided/not yet confirmed: actual pricing plan(s) and amounts, real usage stats (e.g. messages/day), and any real customer testimonials — none of the current landing page's numbers, quotes, or plan pricing are confirmed real facts.

## Brand Commitments

Existing, deliberately-designed visual system already shared across web dashboard, sign-in, and the Android app — confirmed to preserve, not replace, for this redesign:
- Navy `#10222A` (ink/dark surfaces), vermilion `#F43A09` (single saturated accent, used sparingly), mint/success green `#23935C` accents.
- Manrope display typeface.
- Source of truth: `apps/web/app/globals.css` design tokens (explicitly ported from a "Kharcha Screens.dc.html / Kharcha Landing.dc.html" design doc) and the matching token set in `apps/android/.../ui/theme/Color.kt`.
- Brand mark: a ring-with-arc-and-dot logo (`BrandMark.kt` on Android, used in the web `Logo` component) — reuse, don't reinvent.
- Name: Costiq.

## Evidence on Hand

None of the landing page's current stats, testimonials, or pricing are confirmed real — treat all of it (the "40k+ messages parsed daily" stat, the "Ananya R./Rohit S./Meera K." testimonials, the ₹0/₹99 pricing plans) as placeholder content, free to rewrite, restructure, or drop. Do not invent new fake specifics (customer names, hard numbers) to replace them — prefer qualitative/mechanism-driven copy where a real stat isn't available.

## Product Principles

- Automatic over manual: every claim and interaction should reinforce that the user does nothing — no data entry, no categorizing, no reconciling.
- SMS-native for India: built around UPI and Indian bank SMS formats specifically, not a generic global expense tracker.
- Privacy by mechanism, not by promise: the on-device/brief-decryption story is a structural fact to explain, not a trust claim to assert.
- One brand across surfaces: the landing page is Costiq's front door, not a separate marketing identity — it should look like it belongs to the same product as the dashboard and the Android app.
