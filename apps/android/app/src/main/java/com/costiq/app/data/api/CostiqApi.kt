package com.costiq.app.data.api

import com.costiq.app.data.api.dto.Budget
import com.costiq.app.data.api.dto.BudgetStatus
import com.costiq.app.data.api.dto.BudgetUpsertInput
import com.costiq.app.data.api.dto.CategoryListResponse
import com.costiq.app.data.api.dto.InsightsResponse
import com.costiq.app.data.api.dto.ManualTransactionInput
import com.costiq.app.data.api.dto.MonthlySummary
import com.costiq.app.data.api.dto.ReviewApproveInput
import com.costiq.app.data.api.dto.ReviewListResponse
import com.costiq.app.data.api.dto.SmsIngestInput
import com.costiq.app.data.api.dto.SmsIngestResponse
import com.costiq.app.data.api.dto.Transaction
import com.costiq.app.data.api.dto.TransactionCorrectionInput
import com.costiq.app.data.api.dto.TransactionCorrectionListResponse
import com.costiq.app.data.api.dto.TransactionListResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.PATCH
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Query

/**
 * One interface per route file under apps/worker/src/routes/ (transactions,
 * summary, budgets, review, categories) — same paths, same query params,
 * same request/response shapes as each. MCP token management
 * (apps/worker/src/routes/mcpToken.ts) is deliberately omitted:
 * ARCHITECTURE_2.md §16 keeps that screen web-only.
 */
interface CostiqApi {

    // ---- Transactions (apps/worker/src/routes/transactions.ts) ----

    @GET("/api/transactions")
    suspend fun listTransactions(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20,
        @Query("month") month: String? = null,
        @Query("category_id") categoryId: String? = null,
        @Query("bank") bank: String? = null,
        @Query("merchant") merchant: String? = null,
        @Query("source") source: String? = null,
        @Query("q") query: String? = null,
    ): TransactionListResponse

    @POST("/api/transactions/manual")
    suspend fun createManualTransaction(@Body body: ManualTransactionInput): Transaction

    @GET("/api/transactions/{id}")
    suspend fun getTransaction(@Path("id") id: String): Transaction

    @PATCH("/api/transactions/{id}")
    suspend fun correctTransaction(
        @Path("id") id: String,
        @Body body: TransactionCorrectionInput,
    ): Transaction

    @GET("/api/transactions/{id}/corrections")
    suspend fun getTransactionCorrections(
        @Path("id") id: String,
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20,
    ): TransactionCorrectionListResponse

    @DELETE("/api/transactions/{id}")
    suspend fun deleteTransaction(@Path("id") id: String): Response<Unit>

    // ---- Summary (apps/worker/src/routes/summary.ts) ----

    @GET("/api/summary/insights")
    suspend fun getInsights(
        @Query("month") month: String? = null,
        @Query("months") months: Int = 6,
    ): InsightsResponse

    @GET("/api/summary/{month}")
    suspend fun getMonthlySummary(@Path("month") month: String): MonthlySummary

    // ---- Budgets (apps/worker/src/routes/budgets.ts) ----

    @GET("/api/budgets/{month}")
    suspend fun getBudgetStatus(@Path("month") month: String): Response<BudgetStatus>

    @PUT("/api/budgets/{month}")
    suspend fun upsertBudget(
        @Path("month") month: String,
        @Body body: BudgetUpsertInput,
    ): Budget

    // ---- Review (apps/worker/src/routes/review.ts) ----

    @GET("/api/review")
    suspend fun listReview(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20,
    ): ReviewListResponse

    // Returns the DTO directly (not wrapped in Response<T>) so Retrofit
    // auto-throws HttpException on a non-2xx — including the 422
    // "cannot_approve_incomplete_extraction" case from
    // apps/worker/src/services/review.ts's IncompleteExtractionError — which
    // ApiCall.kt's apiCall() then parses into a typed ApiException.
    @POST("/api/review/{id}/approve")
    suspend fun approveReview(
        @Path("id") id: String,
        @Body body: ReviewApproveInput = ReviewApproveInput(),
    ): Transaction

    @POST("/api/review/{id}/dismiss")
    suspend fun dismissReview(@Path("id") id: String): Response<Unit>

    // ---- Categories (apps/worker/src/routes/categories.ts) ----

    @GET("/api/categories")
    suspend fun listCategories(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 100,
    ): CategoryListResponse

    // ---- SMS ingestion — NOT YET LIVE, see SmsIngestDto.kt ----

    @POST("/api/sms")
    suspend fun submitSms(@Body body: SmsIngestInput): SmsIngestResponse
}