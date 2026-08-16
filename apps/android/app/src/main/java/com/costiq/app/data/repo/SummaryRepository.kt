package com.costiq.app.data.repo

import com.costiq.app.data.api.CostiqApi
import com.costiq.app.data.api.apiCall
import com.costiq.app.data.api.dto.InsightsResponse
import com.costiq.app.data.api.dto.MonthlySummary
import kotlinx.serialization.json.Json
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SummaryRepository @Inject constructor(
    private val api: CostiqApi,
    private val json: Json,
) {
    suspend fun getMonthlySummary(month: String): MonthlySummary =
        apiCall(json) { api.getMonthlySummary(month) }

    suspend fun getInsights(month: String? = null, months: Int = 6): InsightsResponse =
        apiCall(json) { api.getInsights(month, months) }
}
