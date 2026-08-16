package com.costiq.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color

/**
 * The semantic tokens Material3's ColorScheme has no slot for (success /
 * warning / danger triads, dashed-rule colors, the dark sign-in-panel
 * variants). Read via `CostiqTheme.extendedColors` inside any composable.
 */
data class ExtendedColors(
    val paper: Color,
    val card: Color,
    val cardAlt: Color,
    val borderMedium: Color,
    val borderHairline: Color,
    val borderDashed: Color,
    val borderDashedAlt: Color,
    val trackFill: Color,
    val textMuted: Color,
    val textFaint: Color,
    val textBody: Color,
    val success: Color,
    val successBg: Color,
    val successBorder: Color,
    val warning: Color,
    val warningBg: Color,
    val warningBorder: Color,
    val warningText: Color,
    val danger: Color,
    val dangerBg: Color,
    val dangerBgAlt: Color,
    val dangerBorder: Color,
    val darkSurface: Color,
    val darkInputBg: Color,
    val darkInputBorder: Color,
    val darkTextMuted: Color,
    val darkTextFaint: Color,
    val darkDashedRule: Color,
    val darkSuccessBg: Color,
    val darkSuccessBorder: Color,
    val darkSuccessFg: Color,
    val darkSuccessMuted: Color,
    val darkAccentMuted: Color,
)

private val LightExtendedColors = ExtendedColors(
    paper = Paper,
    card = Card,
    cardAlt = CardAlt,
    borderMedium = BorderMedium,
    borderHairline = BorderHairline,
    borderDashed = BorderDashed,
    borderDashedAlt = BorderDashedAlt,
    trackFill = TrackFill,
    textMuted = TextMuted,
    textFaint = TextFaint,
    textBody = TextBody,
    success = Success,
    successBg = SuccessBg,
    successBorder = SuccessBorder,
    warning = Warning,
    warningBg = WarningBg,
    warningBorder = WarningBorder,
    warningText = WarningText,
    danger = Danger,
    dangerBg = DangerBg,
    dangerBgAlt = DangerBgAlt,
    dangerBorder = DangerBorder,
    darkSurface = DarkSurface,
    darkInputBg = DarkInputBg,
    darkInputBorder = DarkInputBorder,
    darkTextMuted = DarkTextMuted,
    darkTextFaint = DarkTextFaint,
    darkDashedRule = DarkDashedRule,
    darkSuccessBg = DarkSuccessBg,
    darkSuccessBorder = DarkSuccessBorder,
    darkSuccessFg = DarkSuccessFg,
    darkSuccessMuted = DarkSuccessMuted,
    darkAccentMuted = DarkAccentMuted,
)

private val LocalExtendedColors = staticCompositionLocalOf { LightExtendedColors }

// The design is a single, deliberately light-only theme (no dark-mode
// variants in the .dc.html source) — Costiq follows suit rather than
// inventing a dark palette nobody designed.
private val CostiqColorScheme = lightColorScheme(
    primary = Vermilion,
    onPrimary = Color.White,
    primaryContainer = DangerBg,
    onPrimaryContainer = VermilionPressed,
    secondary = Ink,
    onSecondary = Paper,
    background = Paper,
    onBackground = Ink,
    surface = Card,
    onSurface = Ink,
    surfaceVariant = BorderHairline,
    onSurfaceVariant = TextMuted,
    outline = BorderMedium,
    outlineVariant = BorderHairline,
    error = Danger,
    onError = Color.White,
    errorContainer = DangerBg,
    onErrorContainer = Danger,
)

object CostiqTheme {
    val extendedColors: ExtendedColors
        @Composable get() = LocalExtendedColors.current
}

@Composable
fun CostiqAppTheme(content: @Composable () -> Unit) {
    // isSystemInDarkTheme() intentionally unused for color selection (see
    // note above) — kept as a documented, deliberate decision rather than a
    // silent omission.
    isSystemInDarkTheme()

    CompositionLocalProvider(LocalExtendedColors provides LightExtendedColors) {
        MaterialTheme(
            colorScheme = CostiqColorScheme,
            typography = CostiqTypography,
            content = content,
        )
    }
}
