package com.costiq.app.data.api.dto

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

// Mirrors packages/shared/src/transaction.ts field-for-field — keep both in
// sync by hand; there's no shared codegen between the TS and Kotlin clients.

@Serializable
enum class TransactionType {
    @SerialName("debit") DEBIT,
    @SerialName("credit") CREDIT,
}

@Serializable
enum class TransactionSource {
    @SerialName("sms") SMS,
    @SerialName("manual") MANUAL,
}

@Serializable
data class Transaction(
    val id: String,
    @SerialName("user_id") val userId: String,
    @SerialName("sms_id") val smsId: String? = null,
    val amount: Double,
    val currency: String,
    val type: TransactionType,
    val merchant: String? = null,
    @SerialName("category_id") val categoryId: String? = null,
    @SerialName("category_name") val categoryName: String? = null,
    val bank: String? = null,
    @SerialName("account_last4") val accountLast4: String? = null,
    @SerialName("payment_method") val paymentMethod: String? = null,
    @SerialName("transaction_at") val transactionAt: String,
    @SerialName("reference_id") val referenceId: String? = null,
    val source: TransactionSource,
    val note: String? = null,
    @SerialName("created_at") val createdAt: String,
    @SerialName("updated_at") val updatedAt: String,
    @SerialName("deleted_at") val deletedAt: String? = null,
)

/** POST /api/transactions/manual body — packages/shared manualTransactionInputSchema. */
@Serializable
data class ManualTransactionInput(
    val amount: Double,
    val currency: String = "INR",
    val type: TransactionType,
    val merchant: String? = null,
    @SerialName("category_id") val categoryId: String? = null,
    val bank: String? = null,
    @SerialName("payment_method") val paymentMethod: String? = null,
    @SerialName("transaction_at") val transactionAt: String,
    @SerialName("reference_id") val referenceId: String? = null,
    val note: String? = null,
)

/** PATCH /api/transactions/:id body — packages/shared transactionCorrectionInputSchema. */
@Serializable
data class TransactionCorrectionInput(
    val amount: Double? = null,
    val type: TransactionType? = null,
    val merchant: String? = null,
    @SerialName("category_id") val categoryId: String? = null,
    val bank: String? = null,
    @SerialName("payment_method") val paymentMethod: String? = null,
    @SerialName("transaction_at") val transactionAt: String? = null,
    @SerialName("reference_id") val referenceId: String? = null,
)

@Serializable
data class TransactionListResponse(
    val transactions: List<Transaction>,
    val total: Int,
    val page: Int,
    val limit: Int,
)

@Serializable
data class TransactionCorrection(
    val id: String,
    @SerialName("transaction_id") val transactionId: String,
    @SerialName("field_name") val fieldName: String,
    @SerialName("old_value") val oldValue: String? = null,
    @SerialName("new_value") val newValue: String? = null,
    @SerialName("corrected_at") val correctedAt: String,
)

@Serializable
data class TransactionCorrectionListResponse(
    val corrections: List<TransactionCorrection>,
    val total: Int,
    val page: Int,
    val limit: Int,
)
