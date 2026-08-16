package com.costiq.app.data.repo

import com.costiq.app.data.api.CostiqApi
import com.costiq.app.data.api.apiCall
import com.costiq.app.data.api.bodyOrNullOn404
import com.costiq.app.data.api.dto.Budget
import com.costiq.app.data.api.dto.BudgetStatus
import com.costiq.app.data.api.dto.BudgetUpsertInput
import kotlinx.serialization.json.Json
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class BudgetRepository @Inject constructor(
    private val api: CostiqApi,
    private val json: Json,
) {
    /** Null means "no budget set for this month yet" (worker 404 `no_budget_set`) — a real, expected state. */
    suspend fun getStatus(month: String): BudgetStatus? =
        apiCall(json) { api.getBudgetStatus(month).bodyOrNullOn404(json) }

    suspend fun upsert(month: String, input: BudgetUpsertInput): Budget =
        apiCall(json) { api.upsertBudget(month, input) }
}
