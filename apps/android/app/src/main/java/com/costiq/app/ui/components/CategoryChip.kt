package com.costiq.app.ui.components

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import com.costiq.app.ui.theme.CostiqTheme
import com.costiq.app.ui.theme.Danger
import com.costiq.app.ui.theme.DangerBg
import com.costiq.app.ui.theme.DangerBorder
import com.costiq.app.ui.theme.TextBody

/** Selectable pill chip — category picker on Add Expense (M4), filter chips on Expenses (M2). */
@Composable
fun CategoryChip(
    label: String,
    selected: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val bg = if (selected) DangerBg else CostiqTheme.extendedColors.paper
    val borderColor = if (selected) DangerBorder else CostiqTheme.extendedColors.borderMedium
    val fg = if (selected) Danger else TextBody
    val shape = RoundedCornerShape(999.dp)

    Text(
        label,
        style = MaterialTheme.typography.bodyMedium,
        color = fg,
        modifier = modifier
            .clip(shape)
            .background(bg)
            .border(BorderStroke(1.dp, borderColor), shape)
            .clickable(onClick = onClick)
            .padding(horizontal = 15.dp, vertical = 11.dp),
    )
}
