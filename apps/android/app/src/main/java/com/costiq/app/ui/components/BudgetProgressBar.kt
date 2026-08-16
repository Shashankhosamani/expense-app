package com.costiq.app.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.costiq.app.ui.theme.CostiqTheme
import com.costiq.app.ui.theme.Ink
import com.costiq.app.ui.theme.Vermilion

/**
 * The budget bar repeated on Overview and Budget (M1/M5): a track, a filled
 * portion for percent spent, and a thin marker line at the warning
 * threshold. Fill switches to danger red past 100%. Drawn on a single
 * Canvas for pixel-accurate marker placement rather than nested Box
 * alignment tricks.
 */
@Composable
fun BudgetProgressBar(
    percentUsed: Double,
    warningPercent: Int,
    modifier: Modifier = Modifier,
    height: Dp = 12.dp,
    trackColor: Color = CostiqTheme.extendedColors.trackFill,
    markerColor: Color = Ink,
) {
    val fillFraction = (percentUsed / 100.0).coerceIn(0.0, 1.0).toFloat()
    val fillColor = if (percentUsed >= 100.0) CostiqTheme.extendedColors.danger else Vermilion
    val warningFraction = (warningPercent / 100f).coerceIn(0f, 1f)

    Canvas(modifier = modifier.fillMaxWidth().height(height)) {
        val cornerRadius = CornerRadius(size.height / 2f)
        drawRoundRect(color = trackColor, cornerRadius = cornerRadius)
        if (fillFraction > 0f) {
            drawRoundRect(
                color = fillColor,
                size = size.copy(width = size.width * fillFraction),
                cornerRadius = cornerRadius,
            )
        }
        if (warningPercent in 1..100) {
            val x = size.width * warningFraction
            drawLine(
                color = markerColor,
                start = Offset(x, 0f),
                end = Offset(x, size.height),
                strokeWidth = 2.dp.toPx(),
            )
        }
    }
}
