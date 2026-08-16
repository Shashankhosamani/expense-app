package com.costiq.app.data.api.dto

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

// Mirrors packages/shared/src/budget.ts.

@Serializable
data class NotifyChannels(
    val push: Boolean = true,
    val email: Boolean = false,
    @SerialName("in_app") val inApp: Boolean = true,
)

/** PUT /api/budgets/:month body. */
@Serializable
data class BudgetUpsertInput(
    @SerialName("limit_amount") val limitAmount: Double,
    val currency: String = "INR",
    @SerialName("warning_percentage") val warningPercentage: Int = 90,
    @SerialName("notify_channels") val notifyChannels: NotifyChannels? = null,
)

@Serializable
data class Budget(
    val id: String,
    @SerialName("user_id") val userId: String,
    val month: String, // YYYY-MM-01
    @SerialName("limit_amount") val limitAmount: Double,
    val currency: String,
    @SerialName("warning_percentage") val warningPercentage: Int,
    @SerialName("notify_channels") val notifyChannels: NotifyChannels,
    @SerialName("created_at") val createdAt: String,
    @SerialName("updated_at") val updatedAt: String,
)

/** GET /api/budgets/:month response — Budget plus computed status fields. */
@Serializable
data class BudgetStatus(
    val id: String,
    @SerialName("user_id") val userId: String,
    val month: String,
    @SerialName("limit_amount") val limitAmount: Double,
    val currency: String,
    @SerialName("warning_percentage") val warningPercentage: Int,
    @SerialName("notify_channels") val notifyChannels: NotifyChannels,
    @SerialName("created_at") val createdAt: String,
    @SerialName("updated_at") val updatedAt: String,
    val spent: Double,
    val remaining: Double,
    @SerialName("percent_used") val percentUsed: Double,
    @SerialName("days_left_in_month") val daysLeftInMonth: Int,
    @SerialName("safe_daily_spend") val safeDailySpend: Double,
    @SerialName("vs_last_month_percent") val vsLastMonthPercent: Double? = null,
)
