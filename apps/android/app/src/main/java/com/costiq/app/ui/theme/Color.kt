package com.costiq.app.ui.theme

import androidx.compose.ui.graphics.Color

// Design tokens ported 1:1 from the Claude Design source
// ("Kharcha Screens.dc.html", langNotes block): Manrope type, #FAFDFE
// canvas / #FBFDFE cards, #F43A09 vermilion accent used sparingly, hairline
// rules with dashed totals, no shadows. Every hex below traces back to a
// specific element in that doc rather than being invented here.

// Ink — primary text, dark surfaces (Sign-in / Budget-summary panels)
val Ink = Color(0xFF10222A)

// Accent — the one saturated color in the palette, used sparingly
val Vermilion = Color(0xFFF43A09)
val VermilionPressed = Color(0xFFC22B04)

// Light surfaces
val Paper = Color(0xFFFAFDFE) // screen background
val Card = Color(0xFFFBFDFE) // card background
val CardAlt = Color(0xFFFFFFFF) // focused-input background

// Borders / rules
val BorderMedium = Color(0xFFCDE6EE)
val BorderHairline = Color(0xFFE0F2F7)
val BorderDashed = Color(0xFFC2DFE9)
val BorderDashedAlt = Color(0xFFC6DDE6)
val TrackFill = Color(0xFFDCEFF5) // progress-bar track

// Text
val TextMuted = Color(0xFF5B7885) // secondary
val TextFaint = Color(0xFF63838E) // tertiary / meta
val TextBody = Color(0xFF33505B)

// Semantic — success
val Success = Color(0xFF23935C)
val SuccessBg = Color(0xFFE4F7EC)
val SuccessBorder = Color(0xFFC2EDDA)

// Semantic — warning
val Warning = Color(0xFFA9670A)
val WarningBg = Color(0xFFFFF1DE)
val WarningBorder = Color(0xFFFFD9AC)
val WarningText = Color(0xFF7A5A14)

// Semantic — danger / suspicious
val Danger = Color(0xFFC22B04)
val DangerBg = Color(0xFFFEEAE3)
val DangerBgAlt = Color(0xFFFEF0EB)
val DangerBorder = Color(0xFFFBD3C6)

// Dark-surface variants (Sign-in / Budget-header dark panels)
val DarkSurface = Ink
val DarkInputBg = Color(0xFF152B34)
val DarkInputBorder = Color(0xFF1E3742)
val DarkTextMuted = Color(0xFF7E9CA7)
val DarkTextFaint = Color(0xFF7B96A1)
val DarkDashedRule = Color(0xFF1E3742)
val DarkSuccessBg = Color(0xFF152B23)
val DarkSuccessBorder = Color(0xFF1E3E2E)
val DarkSuccessFg = Color(0xFF59CE8F)
val DarkSuccessMuted = Color(0xFF9FC2AE)
val DarkAccentMuted = Color(0xFFF49B7E) // "Forgot?" link on dark

// Brand mark (header logo) — ring + arc + dot
val BrandRingTrack = Color(0xFFC2EDDA)
val BrandRingArc = Vermilion
val BrandDot = Success

/**
 * Category → (icon, background tint, foreground, chart-bar color).
 * Source of truth is apps/web/lib/category-style.ts — kept in lock-step so
 * both clients render the same category the same way. The design doc's own
 * sample screens use different ad-hoc colors per mockup (e.g. Shopping is
 * purple in the Insights mockup, green here) because those are static demo
 * fixtures; this mapping is the real, backend-driven one both apps use.
 */
data class CategoryStyle(val icon: String, val bg: Color, val fg: Color, val bar: Color)

val CategoryStyles: Map<String, CategoryStyle> = mapOf(
    "Food" to CategoryStyle("utensils", Color(0xFFFFE9D6), Color(0xFFFFB766), Color(0xFFFFB766)),
    "Shopping" to CategoryStyle("shopping-cart", Color(0xFFC2EDDA), Color(0xFF23935C), Color(0xFF23935C)),
    "Travel" to CategoryStyle("car", Color(0xFFDCEEF5), Color(0xFF2C6E8F), Color(0xFF2C6E8F)),
    "Bills" to CategoryStyle("receipt", Color(0xFFFEEAE3), Vermilion, Vermilion),
    "Subscriptions" to CategoryStyle("tv", Color(0xFFFEEAE3), Vermilion, Vermilion),
    "Entertainment" to CategoryStyle("clapperboard", Color(0xFFEDE4FB), Color(0xFF7C5CC4), Color(0xFF7C5CC4)),
    "Health" to CategoryStyle("heart-pulse", Color(0xFFDCF3EE), Color(0xFF1F9E85), Color(0xFF1F9E85)),
    "Other" to CategoryStyle("circle-dashed", BorderHairline, TextMuted, TextMuted),
)

val DefaultCategoryStyle = CategoryStyles.getValue("Other")

fun categoryStyle(name: String?): CategoryStyle = CategoryStyles[name] ?: DefaultCategoryStyle
