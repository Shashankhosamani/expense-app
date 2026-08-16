package com.costiq.app.ui.screens.budget

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.costiq.app.ui.components.BudgetProgressBar
import com.costiq.app.ui.components.CostiqCard
import com.costiq.app.ui.components.ErrorState
import com.costiq.app.ui.components.LoadingState
import com.costiq.app.ui.components.iconFor
import com.costiq.app.ui.theme.CostiqTheme
import com.costiq.app.ui.theme.Ink
import com.costiq.app.ui.theme.Paper
import com.costiq.app.ui.theme.TextBody
import com.costiq.app.ui.theme.Vermilion
import com.costiq.app.util.formatINR

@Composable
fun BudgetScreen(onBack: () -> Unit) {
    val viewModel: BudgetViewModel = hiltViewModel()
    val state by viewModel.uiState.collectAsState()

    Column(Modifier.fillMaxSize().background(Paper)) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(CostiqTheme.extendedColors.card)
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Icon(iconFor("arrow-left"), contentDescription = "Back", tint = TextBody, modifier = Modifier.clickable(onClick = onBack))
            Spacer(Modifier.width(12.dp))
            Text("Budget", style = MaterialTheme.typography.titleLarge, color = Ink, modifier = Modifier.weight(1f))
            if (state.isSaving) {
                CircularProgressIndicator(color = Vermilion, modifier = Modifier.size(20.dp))
            } else {
                Text("Save", style = MaterialTheme.typography.labelLarge, color = Vermilion, modifier = Modifier.clickable(onClick = viewModel::save))
            }
        }

        when {
            state.isLoading -> LoadingState()
            state.error != null -> ErrorState(state.error!!, onRetry = viewModel::load)
            else -> Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
                    .padding(14.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp),
            ) {
                state.status?.let { SummaryPanel(it) }

                CostiqCard {
                    Column {
                        Text(
                            "HOW MUCH PER MONTH",
                            style = MaterialTheme.typography.labelSmall,
                            color = CostiqTheme.extendedColors.textMuted,
                        )
                        Spacer(Modifier.height(9.dp))
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(8.dp))
                                .background(Paper)
                                .border(1.dp, CostiqTheme.extendedColors.borderMedium, RoundedCornerShape(8.dp))
                                .padding(14.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Text("₹", style = MaterialTheme.typography.headlineSmall.copy(fontSize = 22.sp), color = CostiqTheme.extendedColors.textFaint)
                            Spacer(Modifier.width(8.dp))
                            Box(Modifier.weight(1f)) {
                                if (state.limitAmountText.isEmpty()) {
                                    Text("0.00", style = MaterialTheme.typography.headlineSmall.copy(fontSize = 22.sp), color = CostiqTheme.extendedColors.textFaint)
                                }
                                BasicTextField(
                                    value = state.limitAmountText,
                                    onValueChange = viewModel::onLimitChange,
                                    singleLine = true,
                                    textStyle = MaterialTheme.typography.headlineSmall.copy(fontSize = 22.sp, color = Ink, fontWeight = FontWeight.Medium),
                                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                                    cursorBrush = SolidColor(Vermilion),
                                )
                            }
                        }

                        Spacer(Modifier.height(18.dp))
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text("Warn me at", style = MaterialTheme.typography.bodyMedium, color = TextBody)
                            Text(
                                "${state.warningPercent}% · ${formatINR((state.limitAmountText.toDoubleOrNull() ?: 0.0) * state.warningPercent / 100.0)}",
                                style = MaterialTheme.typography.labelLarge,
                                color = Ink,
                            )
                        }
                        Spacer(Modifier.height(10.dp))
                        WarningPercentSlider(percent = state.warningPercent, onChange = viewModel::onWarningPercentChange)

                        Spacer(Modifier.height(6.dp))
                        androidx.compose.material3.HorizontalDivider(color = CostiqTheme.extendedColors.borderHairline)
                        Spacer(Modifier.height(6.dp))

                        ToggleRow("Notify me on this phone", "bell-ring", state.notifyPush, viewModel::onTogglePush)
                        ToggleRow("Show a banner on the web", "layout-panel-top", state.notifyInApp, viewModel::onToggleInApp)
                    }
                }

                if (state.saveError != null) {
                    Text(state.saveError!!, color = CostiqTheme.extendedColors.danger, style = MaterialTheme.typography.bodySmall)
                }
                if (state.justSaved) {
                    Text("Budget saved.", color = CostiqTheme.extendedColors.success, style = MaterialTheme.typography.bodySmall)
                }
            }
        }
    }
}

@Composable
private fun SummaryPanel(status: com.costiq.app.data.api.dto.BudgetStatus) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(Ink)
            .padding(20.dp),
    ) {
        Text(
            "THIS MONTH, SO FAR",
            style = MaterialTheme.typography.labelSmall,
            color = com.costiq.app.ui.theme.DarkTextFaint,
        )
        Spacer(Modifier.height(8.dp))
        Row(verticalAlignment = Alignment.Bottom) {
            Text(formatINR(status.spent), style = com.costiq.app.ui.theme.amountTextStyle(32.sp), color = Color.White)
            Spacer(Modifier.width(8.dp))
            Text(
                "of ${formatINR(status.limitAmount)}",
                style = MaterialTheme.typography.bodyMedium,
                color = com.costiq.app.ui.theme.DarkTextFaint,
                modifier = Modifier.padding(bottom = 3.dp),
            )
        }
        Spacer(Modifier.height(16.dp))
        BudgetProgressBar(
            percentUsed = status.percentUsed,
            warningPercent = status.warningPercentage,
            trackColor = com.costiq.app.ui.theme.DarkInputBorder,
            markerColor = Color.White,
        )
        Spacer(Modifier.height(14.dp))
        BudgetStatRow("Left", formatINR(status.remaining))
        BudgetStatRow("Warning at", formatINR(status.limitAmount * status.warningPercentage / 100.0))
    }
}

@Composable
private fun BudgetStatRow(label: String, value: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
    ) {
        Text(label, style = MaterialTheme.typography.bodySmall, color = com.costiq.app.ui.theme.DarkTextFaint)
        Text(value, style = MaterialTheme.typography.titleSmall, color = Color.White)
    }
}

@Composable
private fun ToggleRow(label: String, iconName: String, checked: Boolean, onToggle: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 11.dp)
            .clickable(onClick = onToggle),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Icon(iconFor(iconName), contentDescription = null, tint = CostiqTheme.extendedColors.textMuted, modifier = Modifier.size(18.dp))
        Spacer(Modifier.width(13.dp))
        Text(label, style = MaterialTheme.typography.bodyMedium, color = Ink, modifier = Modifier.weight(1f))
        Box(
            modifier = Modifier
                .size(width = 40.dp, height = 23.dp)
                .clip(RoundedCornerShape(999.dp))
                .background(if (checked) Vermilion else CostiqTheme.extendedColors.borderMedium)
                .padding(2.dp),
            contentAlignment = if (checked) Alignment.CenterEnd else Alignment.CenterStart,
        ) {
            Box(
                Modifier
                    .size(19.dp)
                    .clip(CircleShape)
                    .background(Color.White),
            )
        }
    }
}

@Composable
private fun WarningPercentSlider(percent: Int, onChange: (Int) -> Unit) {
    androidx.compose.material3.Slider(
        value = percent.toFloat(),
        onValueChange = { onChange(it.toInt()) },
        valueRange = 50f..100f,
        colors = androidx.compose.material3.SliderDefaults.colors(
            thumbColor = Vermilion,
            activeTrackColor = Vermilion,
            inactiveTrackColor = CostiqTheme.extendedColors.trackFill,
        ),
    )
}
