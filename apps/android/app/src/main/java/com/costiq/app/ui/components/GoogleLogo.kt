package com.costiq.app.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asComposePath
import androidx.compose.ui.graphics.drawscope.withTransform
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.core.graphics.PathParser

private const val ViewBoxSize = 18f

// Direct port of apps/web/components/icons/GoogleIcon.tsx's four path/color
// pairs (Google's official "G" mark, viewBox 0 0 18 18).
private val GooglePaths = listOf(
    "M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62Z" to Color(0xFF4285F4),
    "M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.95v2.33A9 9 0 0 0 9 18Z" to Color(0xFF34A853),
    "M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.95A9 9 0 0 0 0 9c0 1.45.35 2.83.95 4.03l3-2.33Z" to Color(0xFFFBBC05),
    "M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .95 4.97l3 2.33C4.66 5.17 6.65 3.58 9 3.58Z" to Color(0xFFEA4335),
)

@Composable
fun GoogleLogo(modifier: Modifier = Modifier, size: Dp = 18.dp) {
    val paths = remember {
        GooglePaths.map { (data, color) -> PathParser.createPathFromPathData(data).asComposePath() to color }
    }
    Canvas(modifier.size(size)) {
        val scale = this.size.minDimension / ViewBoxSize
        withTransform({ scale(scale, scale, pivot = Offset.Zero) }) {
            paths.forEach { (path, color) -> drawPath(path, color = color) }
        }
    }
}
