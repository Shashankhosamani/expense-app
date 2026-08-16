package com.costiq.app.ui.screens.insights

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.costiq.app.ui.components.CostiqCard
import com.costiq.app.ui.components.ErrorState
import com.costiq.app.ui.components.LoadingState
import com.costiq.app.ui.components.iconFor
import com.costiq.app.ui.theme.CostiqTheme
import com.costiq.app.ui.theme.Ink
import com.costiq.app.ui.theme.Paper
import com.costiq.app.ui.theme.Vermilion
import com.costiq.app.util.formatINR

@Composable
fun InsightsScreen() {
    val viewModel: InsightsViewModel = hiltViewModel()
    val state by viewModel.uiState.collectAsState()

    Column(Modifier.fillMaxSize().background(Paper)) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(CostiqTheme.extendedColors.card)
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text("Insights", style = MaterialTheme.typography.titleLarge, color = Ink, modifier = Modifier.weight(1f))
            Row(
                modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .border(1.dp, CostiqTheme.extendedColors.borderMedium, RoundedCornerShape(8.dp))
                    .clickable(onClick = viewModel::cycleRange)
                    .padding(horizontal = 11.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text("${state.monthsRange} months", style = MaterialTheme.typography.bodySmall, color = Ink)
                Spacer(Modifier.width(6.dp))
                Icon(iconFor("chevron-down"), contentDescription = null, tint = Ink, modifier = Modifier.height(13.dp))
            }
        }

        when {
            state.isLoading -> LoadingState()
            state.error != null -> ErrorState(state.error!!, onRetry = viewModel::load)
            else -> LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(14.dp),
                verticalArrangement = Arrangement.spacedBy(14.dp),
            ) {
                item { MonthByMonthCard(state.insights?.months.orEmpty()) }
                item { ByCategoryCard(state.categoryBreakdown) }
            }
        }
    }
}

@Composable
private fun MonthByMonthCard(months: List<com.costiq.app.data.api.dto.InsightsMonth>) {
    CostiqCard {
        Column {
            Text("Month by month", style = MaterialTheme.typography.titleMedium, color = Ink)
            Spacer(Modifier.height(16.dp))
            if (months.isEmpty()) {
                Text("Not enough history yet.", style = MaterialTheme.typography.bodySmall, color = CostiqTheme.extendedColors.textMuted)
            } else {
                val maxSpent = months.maxOf { it.totalSpent }.coerceAtLeast(1.0)
                Row(
                    modifier = Modifier.fillMaxWidth().height(160.dp),
                    horizontalArrangement = Arrangement.spacedBy(11.dp),
                    verticalAlignment = Alignment.Bottom,
                ) {
                    months.forEach { month ->
                        val heightFraction = (month.totalSpent / maxSpent).coerceIn(0.03, 1.0).toFloat()
                        Column(
                            modifier = Modifier.weight(1f).fillMaxHeight(),
                            horizontalAlignment = Alignment.CenterHorizontally,
                        ) {
                            Box(Modifier.weight(1f), contentAlignment = Alignment.BottomCenter) {
                                Box(
                                    Modifier
                                        .fillMaxWidth()
                                        .fillMaxHeight(heightFraction)
                                        .clip(RoundedCornerShape(topStart = 5.dp, topEnd = 5.dp))
                                        .background(Vermilion),
                                )
                            }
                            Spacer(Modifier.height(7.dp))
                            Text(month.label, style = MaterialTheme.typography.bodySmall, color = CostiqTheme.extendedColors.textMuted)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun ByCategoryCard(categories: List<com.costiq.app.data.api.dto.CategoryBreakdown>) {
    CostiqCard {
        Column {
            Text("By category", style = MaterialTheme.typography.titleMedium, color = Ink)
            Spacer(Modifier.height(15.dp))
            if (categories.isEmpty()) {
                Text("No expenses this month yet.", style = MaterialTheme.typography.bodySmall, color = CostiqTheme.extendedColors.textMuted)
            } else {
                categories.sortedByDescending { it.amount }.forEach { cat ->
                    val style = com.costiq.app.ui.theme.categoryStyle(cat.categoryName)
                    Column(Modifier.padding(bottom = 12.dp)) {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text(cat.categoryName, style = MaterialTheme.typography.bodyMedium, color = Ink, modifier = Modifier.weight(1f))
                            Text(formatINR(cat.amount), style = MaterialTheme.typography.titleSmall, color = Ink)
                        }
                        Spacer(Modifier.height(6.dp))
                        Box(
                            Modifier
                                .fillMaxWidth()
                                .height(7.dp)
                                .clip(RoundedCornerShape(4.dp))
                                .background(CostiqTheme.extendedColors.trackFill),
                        ) {
                            Box(
                                Modifier
                                    .fillMaxWidth((cat.percent / 100.0).toFloat().coerceIn(0f, 1f))
                                    .height(7.dp)
                                    .clip(RoundedCornerShape(4.dp))
                                    .background(style.bar),
                            )
                        }
                    }
                }
            }
        }
    }
}
