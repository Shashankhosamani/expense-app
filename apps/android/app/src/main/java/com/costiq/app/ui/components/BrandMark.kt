package com.costiq.app.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.costiq.app.ui.theme.BrandDot
import com.costiq.app.ui.theme.BrandRingArc
import com.costiq.app.ui.theme.BrandRingTrack

/**
 * The header logo used on every screen in the design: a mint ring track, a
 * vermilion arc covering ~64% of it starting rotated 65°, and a small green
 * center dot. Direct port of the inline SVG repeated throughout
 * Kharcha Screens.dc.html:
 * `<circle r=32 stroke #C2EDDA/><circle r=32 stroke #F43A09 dasharray="128.68 201.06" rotate(65)/><circle r=8 fill #23935C/>`
 * — 128.68/201.06 ≈ 64% of the circumference is the visible arc length.
 */
@Composable
fun BrandMark(modifier: Modifier = Modifier, size: Dp = 34.dp) {
    Canvas(modifier = modifier.size(size)) {
        val strokeWidth = this.size.minDimension * 0.16f
        val diameter = this.size.minDimension - strokeWidth
        val topLeft = Offset((this.size.width - diameter) / 2f, (this.size.height - diameter) / 2f)
        val arcSize = Size(diameter, diameter)
        val center = Offset(this.size.width / 2f, this.size.height / 2f)

        drawArc(
            color = BrandRingTrack,
            startAngle = 0f,
            sweepAngle = 360f,
            useCenter = false,
            topLeft = topLeft,
            size = arcSize,
            style = Stroke(width = strokeWidth, cap = StrokeCap.Round),
        )
        drawArc(
            color = BrandRingArc,
            startAngle = -90f + 65f,
            sweepAngle = 360f * (128.68f / 201.06f),
            useCenter = false,
            topLeft = topLeft,
            size = arcSize,
            style = Stroke(width = strokeWidth, cap = StrokeCap.Round),
        )
        drawCircle(color = BrandDot, radius = this.size.minDimension * 0.08f, center = center)
    }
}
