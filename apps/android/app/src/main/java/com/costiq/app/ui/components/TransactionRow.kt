package com.costiq.app.ui.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.costiq.app.data.api.dto.TransactionType
import com.costiq.app.ui.theme.CostiqTheme
import com.costiq.app.ui.theme.Ink
import com.costiq.app.ui.theme.categoryStyle

/** One row: category icon tile, merchant + meta, optional trailing label, amount. Used on Overview's "Recent" and the Expenses feed. */
@Composable
fun TransactionRow(
    merchant: String,
    meta: String,
    categoryName: String?,
    amount: Double,
    type: TransactionType,
    modifier: Modifier = Modifier,
    trailingLabel: String? = null,
) {
    val style = categoryStyle(categoryName)
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(vertical = 12.dp, horizontal = 16.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        IconTile(icon = iconFor(style.icon), tint = style.fg, background = style.bg)
        Spacer(Modifier.width(13.dp))
        Column(Modifier.weight(1f)) {
            Text(
                merchant,
                style = MaterialTheme.typography.titleSmall,
                color = Ink,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            Text(
                meta,
                style = MaterialTheme.typography.bodySmall,
                color = CostiqTheme.extendedColors.textFaint,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
        }
        Spacer(Modifier.width(8.dp))
        Column(horizontalAlignment = Alignment.End) {
            AmountText(amount = amount, type = type, fontSize = 14.sp)
            if (trailingLabel != null) {
                Text(trailingLabel, style = MaterialTheme.typography.labelSmall, color = CostiqTheme.extendedColors.textFaint)
            }
        }
    }
}
