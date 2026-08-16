package com.costiq.app.ui.screens.addexpense

import android.app.DatePickerDialog
import android.app.TimePickerDialog
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.costiq.app.data.api.dto.TransactionType
import com.costiq.app.ui.components.CategoryChip
import com.costiq.app.ui.components.iconFor
import com.costiq.app.ui.theme.CostiqTheme
import com.costiq.app.ui.theme.Ink
import com.costiq.app.ui.theme.Paper
import com.costiq.app.ui.theme.Vermilion
import com.costiq.app.util.formatDateTime

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun AddExpenseScreen(onDone: () -> Unit) {
    val viewModel: AddExpenseViewModel = hiltViewModel()
    val state by viewModel.uiState.collectAsState()
    val context = LocalContext.current

    LaunchedEffect(state.saved) {
        if (state.saved) onDone()
    }

    Column(Modifier.fillMaxSize().background(Paper)) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(CostiqTheme.extendedColors.card)
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Icon(
                iconFor("x"),
                contentDescription = "Close",
                tint = com.costiq.app.ui.theme.TextBody,
                modifier = Modifier.clickable(onClick = onDone),
            )
            Spacer(Modifier.width(12.dp))
            Text("Add an expense", style = MaterialTheme.typography.titleLarge, color = Ink, modifier = Modifier.weight(1f))
            if (state.isSaving) {
                CircularProgressIndicator(color = Vermilion, modifier = Modifier.size(20.dp))
            } else {
                Text(
                    "Save",
                    style = MaterialTheme.typography.labelLarge,
                    color = Vermilion,
                    modifier = Modifier.clickable(onClick = viewModel::save),
                )
            }
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(18.dp),
        ) {
            if (state.error != null) {
                Text(state.error!!, color = CostiqTheme.extendedColors.danger, style = MaterialTheme.typography.bodySmall)
            }

            FieldLabel("Amount")
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(8.dp))
                    .background(CostiqTheme.extendedColors.cardAlt)
                    .border(1.dp, Vermilion, RoundedCornerShape(8.dp))
                    .padding(15.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text("₹", style = MaterialTheme.typography.headlineSmall.copy(fontSize = 28.sp), color = CostiqTheme.extendedColors.textFaint)
                Spacer(Modifier.width(8.dp))
                Box(Modifier.weight(1f)) {
                    if (state.amountText.isEmpty()) {
                        Text("0.00", style = MaterialTheme.typography.headlineSmall.copy(fontSize = 28.sp), color = CostiqTheme.extendedColors.textFaint)
                    }
                    BasicTextField(
                        value = state.amountText,
                        onValueChange = viewModel::onAmountChange,
                        singleLine = true,
                        textStyle = MaterialTheme.typography.headlineSmall.copy(fontSize = 28.sp, color = Ink, fontWeight = FontWeight.Medium),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                        cursorBrush = SolidColor(Vermilion),
                    )
                }
            }

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(8.dp))
                    .border(1.dp, CostiqTheme.extendedColors.borderMedium, RoundedCornerShape(8.dp)),
            ) {
                TypeToggleButton("Money out", selected = state.type == TransactionType.DEBIT, modifier = Modifier.weight(1f)) {
                    viewModel.onTypeChange(TransactionType.DEBIT)
                }
                TypeToggleButton("Money in", selected = state.type == TransactionType.CREDIT, modifier = Modifier.weight(1f)) {
                    viewModel.onTypeChange(TransactionType.CREDIT)
                }
            }

            Column {
                FieldLabel("Merchant")
                Spacer(Modifier.height(8.dp))
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .background(CostiqTheme.extendedColors.card)
                        .border(1.dp, CostiqTheme.extendedColors.borderMedium, RoundedCornerShape(8.dp))
                        .padding(13.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Icon(iconFor("store"), contentDescription = null, tint = CostiqTheme.extendedColors.textFaint, modifier = Modifier.size(17.dp))
                    Spacer(Modifier.width(10.dp))
                    Box(Modifier.weight(1f)) {
                        if (state.merchant.isEmpty()) {
                            Text("Where did you spend?", style = MaterialTheme.typography.bodyLarge, color = CostiqTheme.extendedColors.textFaint)
                        }
                        BasicTextField(
                            value = state.merchant,
                            onValueChange = viewModel::onMerchantChange,
                            singleLine = true,
                            textStyle = MaterialTheme.typography.bodyLarge.copy(color = Ink),
                            cursorBrush = SolidColor(Vermilion),
                        )
                    }
                }
            }

            if (state.categories.isNotEmpty()) {
                Column {
                    FieldLabel("Category")
                    Spacer(Modifier.height(9.dp))
                    FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        state.categories.forEach { category ->
                            CategoryChip(
                                label = category.name,
                                selected = state.selectedCategoryId == category.id,
                                onClick = { viewModel.onCategorySelected(category.id) },
                            )
                        }
                    }
                }
            }

            Column {
                FieldLabel("When")
                Spacer(Modifier.height(8.dp))
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .background(CostiqTheme.extendedColors.card)
                        .border(1.dp, CostiqTheme.extendedColors.borderMedium, RoundedCornerShape(8.dp))
                        .clickable {
                            showDateTimePicker(context, state.transactionAt) { viewModel.onDateTimeChange(it) }
                        }
                        .padding(13.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Icon(iconFor("calendar-clock"), contentDescription = null, tint = CostiqTheme.extendedColors.textFaint, modifier = Modifier.size(17.dp))
                    Spacer(Modifier.width(10.dp))
                    Text(formatDateTime(state.transactionAt.toString()), style = MaterialTheme.typography.bodyMedium, color = Ink)
                }
            }
        }
    }
}

@Composable
private fun FieldLabel(text: String) {
    Text(text.uppercase(), style = MaterialTheme.typography.labelSmall, color = CostiqTheme.extendedColors.textMuted)
}

@Composable
private fun TypeToggleButton(label: String, selected: Boolean, modifier: Modifier = Modifier, onClick: () -> Unit) {
    Box(
        modifier = modifier
            .background(if (selected) Ink else Paper)
            .clickable(onClick = onClick)
            .padding(vertical = 13.dp),
        contentAlignment = Alignment.Center,
    ) {
        Text(
            label,
            style = MaterialTheme.typography.bodyMedium,
            color = if (selected) Color.White else CostiqTheme.extendedColors.textMuted,
        )
    }
}

private fun showDateTimePicker(
    context: android.content.Context,
    current: java.time.OffsetDateTime,
    onPicked: (java.time.OffsetDateTime) -> Unit,
) {
    DatePickerDialog(
        context,
        { _, year, month, day ->
            TimePickerDialog(
                context,
                { _, hour, minute ->
                    val picked = current
                        .withYear(year)
                        .withMonth(month + 1)
                        .withDayOfMonth(day)
                        .withHour(hour)
                        .withMinute(minute)
                        .withSecond(0)
                        .withNano(0)
                    onPicked(picked)
                },
                current.hour,
                current.minute,
                false,
            ).show()
        },
        current.year,
        current.monthValue - 1,
        current.dayOfMonth,
    ).show()
}
