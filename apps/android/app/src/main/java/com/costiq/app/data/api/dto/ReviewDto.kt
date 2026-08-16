package com.costiq.app.data.api.dto

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

// Mirrors packages/shared/src/review.ts.

@Serializable
enum class SmsStatus {
    PENDING,
    PROCESSING,
    PROCESSED,
    FAILED,
    PENDING_REVIEW,
    NOT_A_TRANSACTION,
}

@Serializable
data class ExtractedFields(
    val amount: Double? = null,
    val type: TransactionType? = null,
    val merchant: String? = null,
    val bank: String? = null,
    @SerialName("account_last4") val accountLast4: String? = null,
    @SerialName("payment_method") val paymentMethod: String? = null,
    @SerialName("transaction_at") val transactionAt: String? = null,
    @SerialName("reference_id") val referenceId: String? = null,
    @SerialName("suggested_category") val suggestedCategory: String? = null,
)

@Serializable
data class ReviewItem(
    val id: String,
    val sender: String,
    @SerialName("raw_message") val rawMessage: String,
    val suspicious: Boolean,
    val status: SmsStatus,
    @SerialName("received_at") val receivedAt: String,
    @SerialName("hold_reasons") val holdReasons: List<String> = emptyList(),
    val extracted: ExtractedFields? = null,
)

/** POST /api/review/:id/approve body. */
@Serializable
data class ReviewApproveInput(
    @SerialName("category_id") val categoryId: String? = null,
)

@Serializable
data class ReviewListResponse(
    val items: List<ReviewItem>,
    val total: Int,
    val page: Int,
    val limit: Int,
)
