package com.costiq.app.ui.screens.expenses

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
import androidx.compose.foundation.lazy.LazyListState
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.derivedStateOf
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.costiq.app.ui.components.EmptyState
import com.costiq.app.ui.components.ErrorState
import com.costiq.app.ui.components.LoadingState
import com.costiq.app.ui.components.TransactionRow
import com.costiq.app.ui.components.iconFor
import com.costiq.app.ui.theme.CostiqTheme
import com.costiq.app.ui.theme.Danger
import com.costiq.app.ui.theme.DangerBg
import com.costiq.app.ui.theme.DangerBorder
import com.costiq.app.ui.theme.Ink
import com.costiq.app.ui.theme.Paper
import com.costiq.app.ui.theme.TextBody
import com.costiq.app.ui.theme.Vermilion
import com.costiq.app.util.formatINR

@Composable
fun ExpensesScreen() {
    val viewModel: ExpensesViewModel = hiltViewModel()
    val state by viewModel.uiState.collectAsState()
    val listState = rememberLazyListState()

    Column(Modifier.fillMaxSize().background(Paper)) {
        TopSection(state, viewModel)

        when {
            state.isLoading -> LoadingState()
            state.error != null -> ErrorState(state.error!!, onRetry = viewModel::retry)
            state.groups.isEmpty() -> EmptyState("No expenses match this filter.")
            else -> ExpenseFeed(state, listState, viewModel)
        }
    }
}

@Composable
private fun TopSection(state: ExpensesUiState, viewModel: ExpensesViewModel) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(CostiqTheme.extendedColors.card)
            .padding(16.dp),
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text("Expenses", style = MaterialTheme.typography.titleLarge, color = Ink, modifier = Modifier.weight(1f))
            Icon(iconFor("sliders-horizontal"), contentDescription = "Filters", tint = CostiqTheme.extendedColors.textMuted)
        }
        Spacer(Modifier.height(13.dp))
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(8.dp))
                .background(Paper)
                .border(1.dp, CostiqTheme.extendedColors.borderMedium, RoundedCornerShape(8.dp))
                .padding(horizontal = 12.dp, vertical = 11.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Icon(iconFor("search"), contentDescription = null, tint = CostiqTheme.extendedColors.textFaint, modifier = Modifier.size(16.dp))
            Spacer(Modifier.width(9.dp))
            Box(Modifier.weight(1f)) {
                if (state.query.isEmpty()) {
                    Text(
                        "Search merchant or amount",
                        style = MaterialTheme.typography.bodyMedium,
                        color = CostiqTheme.extendedColors.textFaint,
                    )
                }
                BasicTextField(
                    value = state.query,
                    onValueChange = viewModel::onQueryChange,
                    singleLine = true,
                    textStyle = MaterialTheme.typography.bodyMedium.copy(color = Ink),
                    cursorBrush = SolidColor(Vermilion),
                )
            }
        }
        Spacer(Modifier.height(10.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(7.dp)) {
            SourceFilter.entries.forEach { filter ->
                val selected = state.source == filter
                Text(
                    filter.label,
                    style = MaterialTheme.typography.bodySmall,
                    color = if (selected) Danger else CostiqTheme.extendedColors.textBody,
                    modifier = Modifier
                        .clip(RoundedCornerShape(999.dp))
                        .background(if (selected) DangerBg else Paper)
                        .border(1.dp, if (selected) DangerBorder else CostiqTheme.extendedColors.borderMedium, RoundedCornerShape(999.dp))
                        .clickable { viewModel.onSourceChange(filter) }
                        .padding(horizontal = 12.dp, vertical = 9.dp),
                )
            }
        }
    }
}

@Composable
private fun ExpenseFeed(state: ExpensesUiState, listState: LazyListState, viewModel: ExpensesViewModel) {
    val shouldLoadMore by remember {
        derivedStateOf {
            val lastVisible = listState.layoutInfo.visibleItemsInfo.lastOrNull()?.index ?: 0
            val totalItems = listState.layoutInfo.totalItemsCount
            totalItems > 0 && lastVisible >= totalItems - 4
        }
    }
    LaunchedEffect(shouldLoadMore) {
        if (shouldLoadMore) viewModel.loadMore()
    }

    LazyColumn(state = listState, modifier = Modifier.fillMaxSize()) {
        state.groups.forEach { group ->
            item(key = "header_${group.label}") {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 10.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                ) {
                    Text(group.label, style = MaterialTheme.typography.titleSmall, color = TextBody)
                    Text(
                        formatINR(group.total),
                        style = MaterialTheme.typography.bodySmall,
                        color = CostiqTheme.extendedColors.textMuted,
                    )
                }
            }
            items(group.transactions, key = { it.id }) { txn ->
                TransactionRow(
                    merchant = txn.merchant ?: "Unknown",
                    meta = listOfNotNull(txn.bank, txn.paymentMethod).joinToString(" · ").ifBlank { txn.categoryName ?: "" },
                    categoryName = txn.categoryName,
                    amount = txn.amount,
                    type = txn.type,
                    trailingLabel = if (txn.source == com.costiq.app.data.api.dto.TransactionSource.MANUAL) "Manual" else "SMS",
                )
            }
        }
        if (state.isLoadingMore) {
            item {
                Box(Modifier.fillMaxWidth().padding(16.dp), contentAlignment = Alignment.Center) {
                    androidx.compose.material3.CircularProgressIndicator(color = Vermilion, modifier = Modifier.size(20.dp))
                }
            }
        }
    }
}
