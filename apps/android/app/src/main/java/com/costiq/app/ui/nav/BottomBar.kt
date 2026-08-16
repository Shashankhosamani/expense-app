package com.costiq.app.ui.nav

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.outlined.BarChart
import androidx.compose.material.icons.outlined.Dashboard
import androidx.compose.material.icons.outlined.ReceiptLong
import androidx.compose.material.icons.outlined.ReportProblem
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import com.costiq.app.ui.theme.BorderHairline
import com.costiq.app.ui.theme.CostiqTheme
import com.costiq.app.ui.theme.Danger
import com.costiq.app.ui.theme.Ink
import com.costiq.app.ui.theme.Paper
import com.costiq.app.ui.theme.TextMuted
import com.costiq.app.ui.theme.Vermilion

private data class TabSpec(val route: String, val label: String, val icon: ImageVector)

// Matches the design's tabs() data exactly: layout-dashboard / receipt-text /
// plus (fab) / shield-alert (badge) / chart-column.
private val leftTabs = listOf(
    TabSpec(Routes.OVERVIEW, "Overview", Icons.Outlined.Dashboard),
    TabSpec(Routes.EXPENSES, "Expenses", Icons.Outlined.ReceiptLong),
)
private val rightTabs = listOf(
    TabSpec(Routes.REVIEW, "Review", Icons.Outlined.ReportProblem),
    TabSpec(Routes.INSIGHTS, "Insights", Icons.Outlined.BarChart),
)

@Composable
fun CostiqBottomBar(
    currentRoute: String?,
    reviewBadgeCount: Int,
    onTabSelected: (String) -> Unit,
    onAddClick: () -> Unit,
) {
    Surface(color = Paper, contentColor = Ink) {
        Column {
            Box(
                Modifier
                    .fillMaxWidth()
                    .height(1.dp)
                    .background(BorderHairline)
            )
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 6.dp, horizontal = 4.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                leftTabs.forEach { tab ->
                    TabItem(tab, selected = currentRoute == tab.route, badge = 0, onClick = { onTabSelected(tab.route) })
                }
                AddFabItem(onClick = onAddClick)
                rightTabs.forEach { tab ->
                    val badge = if (tab.route == Routes.REVIEW) reviewBadgeCount else 0
                    TabItem(tab, selected = currentRoute == tab.route, badge = badge, onClick = { onTabSelected(tab.route) })
                }
            }
        }
    }
}

@Composable
private fun RowScope.TabItem(tab: TabSpec, selected: Boolean, badge: Int, onClick: () -> Unit) {
    val fg = if (selected) Ink else TextMuted
    val pillColor = if (selected) CostiqTheme.extendedColors.borderHairline.copy(alpha = 0.6f) else Color.Transparent
    Column(
        modifier = Modifier
            .weight(1f)
            .clickable(onClick = onClick),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Box(
            modifier = Modifier
                .size(width = 52.dp, height = 34.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(pillColor),
            contentAlignment = Alignment.Center,
        ) {
            Icon(tab.icon, contentDescription = tab.label, tint = fg, modifier = Modifier.size(20.dp))
            if (badge > 0) {
                Box(
                    Modifier
                        .padding(start = 18.dp, bottom = 14.dp)
                        .size(7.dp)
                        .clip(CircleShape)
                        .background(Danger)
                )
            }
        }
        Text(
            tab.label,
            style = MaterialTheme.typography.labelSmall.copy(letterSpacing = TextUnit.Unspecified),
            color = fg,
        )
    }
}

@Composable
private fun RowScope.AddFabItem(onClick: () -> Unit) {
    Column(
        modifier = Modifier
            .weight(1f)
            .clickable(onClick = onClick),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Box(
            modifier = Modifier
                .size(width = 52.dp, height = 34.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(Vermilion),
            contentAlignment = Alignment.Center,
        ) {
            Icon(Icons.Filled.Add, contentDescription = "Add expense", tint = Color.White, modifier = Modifier.size(20.dp))
        }
        Text(
            "Add",
            style = MaterialTheme.typography.labelSmall.copy(letterSpacing = TextUnit.Unspecified),
            color = TextMuted,
        )
    }
}
