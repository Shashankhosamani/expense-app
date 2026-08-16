package com.costiq.app.ui.screens.review

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
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.costiq.app.data.api.dto.ReviewItem
import com.costiq.app.ui.components.CategoryChip
import com.costiq.app.ui.components.EmptyState
import com.costiq.app.ui.components.ErrorState
import com.costiq.app.ui.components.LoadingState
import com.costiq.app.ui.components.iconFor
import com.costiq.app.ui.theme.CostiqTheme
import com.costiq.app.ui.theme.Danger
import com.costiq.app.ui.theme.DangerBg
import com.costiq.app.ui.theme.DangerBorder
import com.costiq.app.ui.theme.Ink
import com.costiq.app.ui.theme.Paper
import com.costiq.app.ui.theme.Vermilion
import com.costiq.app.ui.theme.WarningText
import com.costiq.app.util.formatDateTime
import com.costiq.app.util.formatINR

@Composable
fun ReviewScreen() {
    val viewModel: ReviewViewModel = hiltViewModel()
    val state by viewModel.uiState.collectAsState()

    Column(Modifier.fillMaxSize().background(Paper)) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(CostiqTheme.extendedColors.card)
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text("Review", style = MaterialTheme.typography.titleLarge, color = Ink, modifier = Modifier.weight(1f))
            if (state.items.isNotEmpty()) {
                Text(
                    "${state.items.size} HELD",
                    style = MaterialTheme.typography.labelSmall,
                    color = Danger,
                    modifier = Modifier
                        .clip(RoundedCornerShape(999.dp))
                        .background(DangerBg)
                        .border(1.dp, DangerBorder, RoundedCornerShape(999.dp))
                        .padding(horizontal = 10.dp, vertical = 6.dp),
                )
            }
        }

        when {
            state.isLoading -> LoadingState()
            state.error != null -> ErrorState(state.error!!, onRetry = viewModel::load)
            state.items.isEmpty() -> EmptyState(
                "Nothing waiting for review. Messages land here only when Costiq isn't confident enough to save them on its own.",
                icon = iconFor("shield-check"),
            )
            else -> LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(14.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                items(state.items, key = { it.id }) { item ->
                    ReviewItemCard(
                        item = item,
                        expanded = state.expandedId == item.id,
                        categories = state.categories,
                        selectedCategoryId = state.selectedCategoryByItem[item.id],
                        actionInProgress = state.actionInProgressId == item.id,
                        onToggle = { viewModel.toggleExpand(item.id) },
                        onSelectCategory = { viewModel.selectCategory(item.id, it) },
                        onApprove = { viewModel.approve(item) },
                        onDismiss = { viewModel.dismiss(item) },
                    )
                }
                if (state.actionError != null) {
                    item {
                        Text(state.actionError!!, color = Danger, style = MaterialTheme.typography.bodySmall)
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun ReviewItemCard(
    item: ReviewItem,
    expanded: Boolean,
    categories: List<com.costiq.app.data.api.dto.Category>,
    selectedCategoryId: String?,
    actionInProgress: Boolean,
    onToggle: () -> Unit,
    onSelectCategory: (String) -> Unit,
    onApprove: () -> Unit,
    onDismiss: () -> Unit,
) {
    val extracted = item.extracted
    val amountLabel = extracted?.amount?.let { amt ->
        val direction = if (extracted.type == com.costiq.app.data.api.dto.TransactionType.CREDIT) "in" else "out"
        "${formatINR(amt)} $direction"
    } ?: "Unreadable amount"

    val borderColor = if (item.suspicious) DangerBorder else CostiqTheme.extendedColors.borderMedium

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(CostiqTheme.extendedColors.card)
            .border(1.dp, borderColor, RoundedCornerShape(12.dp)),
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clickable(onClick = onToggle)
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Icon(
                iconFor(if (item.suspicious) "shield-alert" else "circle-help"),
                contentDescription = null,
                tint = if (item.suspicious) Danger else WarningText,
                modifier = Modifier.size(18.dp),
            )
            Spacer(Modifier.width(11.dp))
            Column(Modifier.weight(1f)) {
                Text("${item.sender} · $amountLabel", style = MaterialTheme.typography.titleSmall, color = Ink)
                Text(
                    "${item.sender} · ${formatDateTime(item.receivedAt)}",
                    style = MaterialTheme.typography.bodySmall,
                    color = CostiqTheme.extendedColors.textFaint,
                )
            }
            Icon(
                iconFor(if (expanded) "chevron-up" else "chevron-down"),
                contentDescription = null,
                tint = CostiqTheme.extendedColors.textMuted,
            )
        }

        if (expanded) {
            Column(Modifier.padding(start = 16.dp, end = 16.dp, bottom = 16.dp)) {
                Text(
                    "THE MESSAGE, AS IT ARRIVED",
                    style = MaterialTheme.typography.labelSmall,
                    color = CostiqTheme.extendedColors.textMuted,
                )
                Spacer(Modifier.height(8.dp))
                Text(
                    item.rawMessage,
                    style = MaterialTheme.typography.bodySmall,
                    color = Color(0xFFC6DDE6),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(8.dp))
                        .background(Color(0xFF0B1A21))
                        .padding(13.dp),
                )
                Spacer(Modifier.height(14.dp))

                if (extracted != null) {
                    ExtractedRow("Merchant", extracted.merchant ?: "—")
                    ExtractedRow("Bank", listOfNotNull(extracted.bank, extracted.accountLast4?.let { "·$it" }).joinToString(" "))
                    ExtractedRow("Reference", extracted.referenceId ?: "—")
                }

                if (item.holdReasons.isNotEmpty()) {
                    Spacer(Modifier.height(10.dp))
                    Text(
                        "WHY IT'S HERE",
                        style = MaterialTheme.typography.labelSmall,
                        color = CostiqTheme.extendedColors.textMuted,
                    )
                    Spacer(Modifier.height(6.dp))
                    item.holdReasons.forEach { reason ->
                        Text("• $reason", style = MaterialTheme.typography.bodySmall, color = com.costiq.app.ui.theme.TextBody)
                    }
                }

                if (categories.isNotEmpty()) {
                    Spacer(Modifier.height(14.dp))
                    Text(
                        "CATEGORY",
                        style = MaterialTheme.typography.labelSmall,
                        color = CostiqTheme.extendedColors.textMuted,
                    )
                    Spacer(Modifier.height(8.dp))
                    FlowRow(horizontalArrangement = Arrangement.spacedBy(7.dp)) {
                        categories.forEach { category ->
                            val effectiveSelected = selectedCategoryId == category.id ||
                                (selectedCategoryId == null && extracted?.suggestedCategory == category.name)
                            CategoryChip(
                                label = category.name,
                                selected = effectiveSelected,
                                onClick = { onSelectCategory(category.id) },
                            )
                        }
                    }
                }

                Spacer(Modifier.height(16.dp))
                if (actionInProgress) {
                    Box(Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
                        CircularProgressIndicator(color = Vermilion, modifier = Modifier.size(22.dp))
                    }
                } else {
                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        OutlinedButton(
                            onClick = onDismiss,
                            modifier = Modifier.weight(1f),
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = com.costiq.app.ui.theme.TextBody),
                        ) {
                            Text("Not an expense")
                        }
                        Button(
                            onClick = onApprove,
                            modifier = Modifier.weight(1f),
                            colors = ButtonDefaults.buttonColors(containerColor = Vermilion, contentColor = Color.White),
                        ) {
                            Text("Approve")
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun ExtractedRow(label: String, value: String) {
    Row(modifier = Modifier.fillMaxWidth().padding(vertical = 5.dp)) {
        Text(label, style = MaterialTheme.typography.bodySmall, color = CostiqTheme.extendedColors.textFaint, modifier = Modifier.width(96.dp))
        Text(value, style = MaterialTheme.typography.bodySmall, color = Ink, modifier = Modifier.weight(1f))
    }
}
