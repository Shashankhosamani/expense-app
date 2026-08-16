package com.costiq.app.ui.screens.overview

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Notifications
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.costiq.app.ui.components.BrandMark
import com.costiq.app.ui.components.BudgetProgressBar
import com.costiq.app.ui.components.CostiqCard
import com.costiq.app.ui.components.ErrorState
import com.costiq.app.ui.components.IconTile
import com.costiq.app.ui.components.LoadingState
import com.costiq.app.ui.components.TransactionRow
import com.costiq.app.ui.components.iconFor
import com.costiq.app.ui.theme.CostiqTheme
import com.costiq.app.ui.theme.Danger
import com.costiq.app.ui.theme.DangerBg
import com.costiq.app.ui.theme.DangerBorder
import com.costiq.app.ui.theme.Ink
import com.costiq.app.ui.theme.Paper
import com.costiq.app.ui.theme.Vermilion
import com.costiq.app.ui.theme.amountTextStyle
import com.costiq.app.util.formatINR
import com.costiq.app.util.formatTime

@Composable
fun OverviewScreen(
    onOpenReview: () -> Unit,
    onOpenBudget: () -> Unit,
    onOpenExpenses: () -> Unit,
) {
    val viewModel: OverviewViewModel = hiltViewModel()
    val state by viewModel.uiState.collectAsState()

    Column(Modifier.fillMaxSize().background(Paper)) {
        Header(monthLabel = monthDisplayLabel(state.month), expenseCount = state.summary?.expenseCount ?: 0)

        when {
            state.isLoading -> LoadingState()
            state.error != null -> ErrorState(state.error!!, onRetry = viewModel::load)
            else -> OverviewBody(state, onOpenReview, onOpenBudget, onOpenExpenses)
        }
    }
}

@Composable
private fun Header(monthLabel: String, expenseCount: Int) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(CostiqTheme.extendedColors.card)
            .padding(horizontal = 16.dp, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        BrandMark(size = 26.dp)
        Spacer(Modifier.width(11.dp))
        Column(Modifier.weight(1f)) {
            Text(monthLabel, style = MaterialTheme.typography.titleMedium, color = Ink)
            Text(
                "$expenseCount expenses",
                style = MaterialTheme.typography.bodySmall,
                color = CostiqTheme.extendedColors.textFaint,
            )
        }
        Box {
            Icon(
                Icons.Outlined.Notifications,
                contentDescription = "Notifications",
                tint = CostiqTheme.extendedColors.textMuted,
            )
        }
    }
}

@Composable
private fun OverviewBody(
    state: OverviewUiState,
    onOpenReview: () -> Unit,
    onOpenBudget: () -> Unit,
    onOpenExpenses: () -> Unit,
) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(14.dp),
        verticalArrangement = Arrangement.spacedBy(13.dp),
    ) {
        if (state.reviewCount > 0) {
            item { ReviewBanner(count = state.reviewCount, onClick = onOpenReview) }
        }
        item { BudgetCard(state, onOpenBudget) }
        item { KpiGrid(state) }
        item { RecentCard(state, onOpenExpenses) }
    }
}

@Composable
private fun ReviewBanner(count: Int, onClick: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(10.dp))
            .background(DangerBg)
            .border(1.dp, DangerBorder, RoundedCornerShape(10.dp))
            .clickable(onClick = onClick)
            .padding(13.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Icon(iconFor("shield-alert"), contentDescription = null, tint = Danger, modifier = Modifier.size(18.dp))
        Spacer(Modifier.width(11.dp))
        Text(
            "$count waiting for you. Nothing saved yet.",
            style = MaterialTheme.typography.bodySmall,
            color = CostiqTheme.extendedColors.textBody,
            modifier = Modifier.weight(1f),
        )
        Icon(iconFor("chevron-right"), contentDescription = null, tint = Danger, modifier = Modifier.size(16.dp))
    }
}

@Composable
private fun BudgetCard(state: OverviewUiState, onOpenBudget: () -> Unit) {
    CostiqCard(modifier = Modifier.fillMaxWidth().clickable(onClick = onOpenBudget), contentPadding = PaddingValues(20.dp)) {
        val budget = state.budgetStatus
        if (budget == null) {
            Column {
                Text(
                    "SPENT SO FAR",
                    style = MaterialTheme.typography.labelSmall,
                    color = CostiqTheme.extendedColors.textMuted,
                )
                Spacer(Modifier.height(8.dp))
                Text(
                    formatINR(state.summary?.totalSpent ?: 0.0),
                    style = amountTextStyle(34.sp),
                    color = Ink,
                )
                Spacer(Modifier.height(10.dp))
                Text(
                    "No budget set for this month yet — tap to set one.",
                    style = MaterialTheme.typography.bodySmall,
                    color = CostiqTheme.extendedColors.textMuted,
                )
            }
        } else {
            Column {
                Text(
                    "SPENT SO FAR",
                    style = MaterialTheme.typography.labelSmall,
                    color = CostiqTheme.extendedColors.textMuted,
                )
                Spacer(Modifier.height(8.dp))
                Row(verticalAlignment = Alignment.Bottom) {
                    Text(formatINR(budget.spent), style = amountTextStyle(34.sp), color = Ink)
                    Spacer(Modifier.width(8.dp))
                    Text(
                        "of ${formatINR(budget.limitAmount)}",
                        style = MaterialTheme.typography.bodyMedium,
                        color = CostiqTheme.extendedColors.textFaint,
                        modifier = Modifier.padding(bottom = 3.dp),
                    )
                }
                Spacer(Modifier.height(14.dp))
                BudgetProgressBar(percentUsed = budget.percentUsed, warningPercent = budget.warningPercentage)
                Spacer(Modifier.height(8.dp))
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text(
                        "${budget.percentUsed.toInt()}% used · ${budget.daysLeftInMonth} days left",
                        style = MaterialTheme.typography.bodySmall,
                        color = CostiqTheme.extendedColors.textMuted,
                    )
                    Text(
                        "${formatINR(budget.safeDailySpend)}/day safe",
                        style = MaterialTheme.typography.bodySmall,
                        color = CostiqTheme.extendedColors.success,
                    )
                }
            }
        }
    }
}

private data class Kpi(val label: String, val value: String, val icon: String, val color: androidx.compose.ui.graphics.Color)

@Composable
private fun KpiGrid(state: OverviewUiState) {
    // The design's mockup KPIs (e.g. "Never left the phone") are demo
    // fixtures with no backing field on MonthlySummary/ReviewListResponse —
    // these four are the real, currently-available equivalents instead of
    // invented numbers.
    val kpis = listOf(
        Kpi("Pending review", state.reviewCount.toString(), "shield-alert", Danger),
        Kpi("Messages captured", (state.summary?.messagesCaptured ?: 0).toString(), "message-square", CostiqTheme.extendedColors.textMuted),
        Kpi("Not a transaction", (state.summary?.notTransactions ?: 0).toString(), "sparkles", CostiqTheme.extendedColors.warning),
        Kpi("Expenses this month", (state.summary?.expenseCount ?: 0).toString(), "receipt", CostiqTheme.extendedColors.success),
    )
    LazyVerticalGrid(
        columns = GridCells.Fixed(2),
        modifier = Modifier.height(180.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        items(kpis) { kpi ->
            CostiqCard(contentPadding = PaddingValues(15.dp)) {
                Column {
                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        Text(
                            kpi.label.uppercase(),
                            style = MaterialTheme.typography.labelSmall,
                            color = CostiqTheme.extendedColors.textMuted,
                            modifier = Modifier.weight(1f),
                        )
                        Icon(iconFor(kpi.icon), contentDescription = null, tint = kpi.color, modifier = Modifier.size(16.dp))
                    }
                    Spacer(Modifier.height(11.dp))
                    Text(kpi.value, style = amountTextStyle(22.sp), color = Ink)
                }
            }
        }
    }
}

@Composable
private fun RecentCard(state: OverviewUiState, onOpenExpenses: () -> Unit) {
    CostiqCard(contentPadding = PaddingValues(0.dp)) {
        Column {
            Row(
                modifier = Modifier.fillMaxWidth().padding(16.dp, 16.dp, 16.dp, 12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Text("Recent", style = MaterialTheme.typography.titleMedium, color = Ink)
                Text(
                    "All ${state.summary?.expenseCount ?: 0}",
                    style = MaterialTheme.typography.labelMedium,
                    color = Vermilion,
                    modifier = Modifier.clickable(onClick = onOpenExpenses),
                )
            }
            if (state.recentTransactions.isEmpty()) {
                Text(
                    "No expenses yet this month.",
                    style = MaterialTheme.typography.bodySmall,
                    color = CostiqTheme.extendedColors.textMuted,
                    modifier = Modifier.padding(16.dp),
                )
            } else {
                state.recentTransactions.forEach { txn ->
                    TransactionRow(
                        merchant = txn.merchant ?: "Unknown",
                        meta = "${txn.categoryName ?: "Uncategorized"} · ${formatTime(txn.transactionAt)}",
                        categoryName = txn.categoryName,
                        amount = txn.amount,
                        type = txn.type,
                    )
                }
            }
        }
    }
}

private fun monthDisplayLabel(month: String): String = try {
    val parts = month.split("-")
    val monthNames = listOf(
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    )
    "${monthNames[parts[1].toInt() - 1]} ${parts[0]}"
} catch (e: Exception) {
    month
}
