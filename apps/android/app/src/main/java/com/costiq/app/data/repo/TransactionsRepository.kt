package com.costiq.app.data.repo

import com.costiq.app.data.api.CostiqApi
import com.costiq.app.data.api.apiCall
import com.costiq.app.data.api.dto.ManualTransactionInput
import com.costiq.app.data.api.dto.Transaction
import com.costiq.app.data.api.dto.TransactionCorrectionInput
import com.costiq.app.data.api.dto.TransactionCorrectionListResponse
import com.costiq.app.data.api.dto.TransactionListResponse
import com.costiq.app.data.api.throwIfNotSuccessful
import kotlinx.serialization.json.Json
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class TransactionsRepository @Inject constructor(
    private val api: CostiqApi,
    private val json: Json,
) {
    suspend fun list(
        page: Int = 1,
        limit: Int = 20,
        month: String? = null,
        categoryId: String? = null,
        bank: String? = null,
        merchant: String? = null,
        source: String? = null,
        query: String? = null,
    ): TransactionListResponse = apiCall(json) {
        api.listTransactions(page, limit, month, categoryId, bank, merchant, source, query)
    }

    suspend fun createManual(input: ManualTransactionInput): Transaction =
        apiCall(json) { api.createManualTransaction(input) }

    suspend fun get(id: String): Transaction = apiCall(json) { api.getTransaction(id) }

    suspend fun correct(id: String, input: TransactionCorrectionInput): Transaction =
        apiCall(json) { api.correctTransaction(id, input) }

    suspend fun corrections(id: String, page: Int = 1, limit: Int = 20): TransactionCorrectionListResponse =
        apiCall(json) { api.getTransactionCorrections(id, page, limit) }

    suspend fun delete(id: String) = apiCall(json) { api.deleteTransaction(id).throwIfNotSuccessful(json) }
}
