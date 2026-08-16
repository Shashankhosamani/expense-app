package com.costiq.app.data.repo

import com.costiq.app.data.api.CostiqApi
import com.costiq.app.data.api.apiCall
import com.costiq.app.data.api.dto.Category
import kotlinx.serialization.json.Json
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class CategoryRepository @Inject constructor(
    private val api: CostiqApi,
    private val json: Json,
) {
    suspend fun list(): List<Category> = apiCall(json) { api.listCategories(page = 1, limit = 100) }.categories
}
