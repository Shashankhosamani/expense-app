package com.costiq.app.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp

/**
 * The design (Kharcha Screens.dc.html) uses Manrope throughout. Two ways to
 * get the real typeface in:
 *
 * 1. Bundle it: download the Manrope static TTFs (400/500/600/700/800) from
 *    fonts.google.com/specimen/Manrope, drop them in app/src/main/res/font/
 *    as manrope_regular.ttf / manrope_medium.ttf / etc., and build a
 *    FontFamily from androidx.compose.ui.text.font.Font(resId, weight).
 * 2. Downloadable Google Fonts provider (androidx.compose.ui:ui-text-google-fonts,
 *    already a dependency) — needs a `com_google_android_gms_fonts_certs`
 *    array resource copied verbatim from Android's official downloadable-fonts
 *    sample (developer.android.com → Downloadable fonts). Deliberately not
 *    hand-typed here: it's a long certificate hash, and a single mistyped
 *    character fails silently at runtime rather than at compile time.
 *
 * Until one of those is wired in, this falls back to the platform default
 * (Roboto on stock Android) so the app builds and every screen is correct in
 * layout, weight, size, and letter-spacing — only the exact glyph shapes
 * differ from the design until real Manrope is dropped in.
 */
val ManropeFontFamily: FontFamily = FontFamily.Default

private fun style(
    size: TextUnit,
    weight: FontWeight,
    lineHeight: TextUnit = TextUnit.Unspecified,
    letterSpacing: TextUnit = TextUnit.Unspecified,
) = TextStyle(
    fontFamily = ManropeFontFamily,
    fontWeight = weight,
    fontSize = size,
    lineHeight = if (lineHeight == TextUnit.Unspecified) size * 1.3f else lineHeight,
    letterSpacing = letterSpacing,
)

// Maps Compose's fixed Typography slots onto the design's actual type scale
// (see Kharcha Screens.dc.html inline `font:` shorthands) rather than
// Material's defaults.
val CostiqTypography = Typography(
    displaySmall = style(30.sp, FontWeight.Medium, 34.sp, (-0.4).sp), // page titles: "Expenses", "August 2026"
    headlineSmall = style(26.sp, FontWeight.Normal, 33.sp, (-0.3).sp), // "Welcome back"
    titleLarge = style(20.sp, FontWeight.Medium, 24.sp), // screen header: "Add an expense"
    titleMedium = style(17.sp, FontWeight.Medium, 22.sp), // section header: "Recent", "By category"
    titleSmall = style(15.sp, FontWeight.Medium, 19.sp), // card titles, list item headlines
    bodyLarge = style(14.sp, FontWeight.Normal, 20.sp),
    bodyMedium = style(13.sp, FontWeight.Normal, 19.sp),
    bodySmall = style(12.sp, FontWeight.Normal, 17.sp), // meta / supporting text
    labelLarge = style(15.sp, FontWeight.Medium, 15.sp), // buttons
    labelMedium = style(12.sp, FontWeight.Medium, 15.sp),
    labelSmall = style(10.sp, FontWeight.Medium, 13.sp, 0.1.em), // uppercase eyebrow labels
)

/** Amount display — tabular figures so digits don't jitter as they change. */
fun amountTextStyle(size: TextUnit, weight: FontWeight = FontWeight.Medium): TextStyle = TextStyle(
    fontFamily = ManropeFontFamily,
    fontWeight = weight,
    fontSize = size,
    letterSpacing = (-0.02).em,
    fontFeatureSettings = "tnum",
)
