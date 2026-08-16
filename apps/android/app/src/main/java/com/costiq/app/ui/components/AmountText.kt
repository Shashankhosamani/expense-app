package com.costiq.app.ui.components

import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.TextUnit
import com.costiq.app.data.api.dto.TransactionType
import com.costiq.app.ui.theme.CostiqTheme
import com.costiq.app.ui.theme.Ink
import com.costiq.app.ui.theme.amountTextStyle
import com.costiq.app.util.formatINR

/**
 * Amount display with tabular figures. Debits render in ink (the default,
 * "normal" case for an expense tracker); credits render in success green —
 * money moving in is the exception worth highlighting, not every debit
 * being treated as an alarm.
 */
@Composable
fun AmountText(
    amount: Double,
    type: TransactionType,
    fontSize: TextUnit,
    modifier: Modifier = Modifier,
) {
    val color = if (type == TransactionType.CREDIT) CostiqTheme.extendedColors.success else Ink
    Text(formatINR(amount), style = amountTextStyle(fontSize), color = color, modifier = modifier)
}

@Composable
fun AmountText(
    text: String,
    color: Color,
    fontSize: TextUnit,
    modifier: Modifier = Modifier,
) {
    Text(text, style = amountTextStyle(fontSize), color = color, modifier = modifier)
}
