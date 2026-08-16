package com.costiq.app.data.api.dto

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

// Mirrors packages/shared/src/summary.ts.

@Serializable
data class CategoryBreakdown(
    @SerialName("category_id") val categoryId: String? = null,
    @SerialName("category_name") val categoryName: String,
    val amount: Double,
    val percent: Double,
)

@Serializable
data class TopMerchant(
    val merchant: String,
    val amount: Double,
)

@Serializable
data class PaymentMethodBreakdown(
    val method: String,
    val amount: Double,
    val percent: Double,
)

@Serializable
data class MonthlySummary(
    val month: String, // YYYY-MM
    @SerialName("total_spent") val totalSpent: Double,
    @SerialName("total_credited") val totalCredited: Double,
    @SerialName("expense_count") val expenseCount: Int,
    @SerialName("messages_captured") val messagesCaptured: Int,
    @SerialName("not_transactions") val notTransactions: Int,
    @SerialName("category_breakdown") val categoryBreakdown: List<CategoryBreakdown>,
    @SerialName("top_merchants") val topMerchants: List<TopMerchant>,
    @SerialName("payment_methods") val paymentMethods: List<PaymentMethodBreakdown>,
    @SerialName("vs_last_month_percent") val vsLastMonthPercent: Double? = null,
)

@Serializable
data class InsightsMonth(
    val month: String,
    val label: String,
    @SerialName("total_spent") val totalSpent: Double,
)

@Serializable
data class InsightsResponse(
    val months: List<InsightsMonth>,
    @SerialName("average_spent") val averageSpent: Double,
    @SerialName("months_under_budget") val monthsUnderBudget: Int,
)
