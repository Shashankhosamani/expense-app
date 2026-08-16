package com.costiq.app.data.repo

import com.costiq.app.data.api.CostiqApi
import com.costiq.app.data.api.apiCall
import com.costiq.app.data.api.dto.ReviewApproveInput
import com.costiq.app.data.api.dto.ReviewListResponse
import com.costiq.app.data.api.dto.Transaction
import com.costiq.app.data.api.throwIfNotSuccessful
import kotlinx.serialization.json.Json
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ReviewRepository @Inject constructor(
    private val api: CostiqApi,
    private val json: Json,
) {
    suspend fun list(page: Int = 1, limit: Int = 20): ReviewListResponse =
        apiCall(json) { api.listReview(page, limit) }

    /**
     * Throws [com.costiq.app.data.api.ApiException] with code
     * "cannot_approve_incomplete_extraction" (HTTP 422) when the extracted
     * fields are missing amount/type — mirrors
     * apps/worker/src/services/review.ts's IncompleteExtractionError, which
     * the "Edit first" action in the design exists to resolve.
     */
    suspend fun approve(id: String, categoryId: String? = null): Transaction =
        apiCall(json) { api.approveReview(id, ReviewApproveInput(categoryId)) }

    suspend fun dismiss(id: String) = apiCall(json) { api.dismissReview(id).throwIfNotSuccessful(json) }
}
