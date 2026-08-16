package com.costiq.app.data.api.dto

import kotlinx.serialization.Serializable

/** Mirrors apps/web/lib/api-request.ts's ApiErrorBody / ZodFlattenedError. */
@Serializable
data class ApiErrorBody(
    val error: String,
    val details: ZodFlattenedError? = null,
)

@Serializable
data class ZodFlattenedError(
    val formErrors: List<String> = emptyList(),
    val fieldErrors: Map<String, List<String>> = emptyMap(),
)
