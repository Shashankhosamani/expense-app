package com.costiq.app.data.api.dto

import kotlinx.serialization.Serializable

// Mirrors packages/shared/src/categories.ts.

@Serializable
data class Category(
    val id: String,
    val name: String,
)

@Serializable
data class CategoryListResponse(
    val categories: List<Category>,
    val total: Int,
    val page: Int,
    val limit: Int,
)
