package com.costiq.app.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.costiq.app.ui.theme.CostiqTheme

/** The card treatment used throughout the design: 1dp hairline border, 12dp corners, no shadow. */
@Composable
fun CostiqCard(
    modifier: Modifier = Modifier,
    contentPadding: PaddingValues = PaddingValues(20.dp),
    content: @Composable () -> Unit,
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = CostiqTheme.extendedColors.card),
        border = BorderStroke(1.dp, CostiqTheme.extendedColors.borderMedium),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp),
        shape = RoundedCornerShape(12.dp),
    ) {
        Box(Modifier.padding(contentPadding)) {
            content()
        }
    }
}
