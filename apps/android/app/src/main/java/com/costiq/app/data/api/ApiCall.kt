package com.costiq.app.data.api

import com.costiq.app.data.api.dto.ApiErrorBody
import kotlinx.serialization.json.Json
import retrofit2.HttpException
import retrofit2.Response
import java.io.IOException

/** Mirrors apps/web/lib/api-request.ts's ApiError — status + server error code + parsed field errors. */
class ApiException(
    val status: Int,
    val code: String,
    override val message: String,
    val fieldErrors: Map<String, List<String>> = emptyMap(),
) : Exception(message)

/**
 * Runs a suspend Retrofit call, translating failures into [ApiException] so
 * every repository/ViewModel has one exception type to catch instead of
 * juggling HttpException/IOException/SerializationException individually.
 */
suspend fun <T> apiCall(json: Json, block: suspend () -> T): T = try {
    block()
} catch (e: HttpException) {
    throw parseHttpException(e, json)
} catch (e: IOException) {
    throw ApiException(status = -1, code = "network_error", message = "Couldn't reach Costiq. Check your connection.")
}

/** For endpoints where a 404 is an expected, meaningful state (e.g. "no budget set yet"). */
fun <T> Response<T>.bodyOrNullOn404(json: Json): T? = when {
    isSuccessful -> body()
    code() == 404 -> null
    else -> throw parseHttpException(HttpException(this), json)
}

/** For 204-No-Content endpoints (delete/dismiss): Response<Unit> doesn't auto-throw on error, so check explicitly. */
fun Response<Unit>.throwIfNotSuccessful(json: Json) {
    if (!isSuccessful) throw parseHttpException(HttpException(this), json)
}

private fun parseHttpException(e: HttpException, json: Json): ApiException {
    val status = e.code()
    val raw = e.response()?.errorBody()?.string()
    val parsed = raw?.let { runCatching { json.decodeFromString(ApiErrorBody.serializer(), it) }.getOrNull() }
    return ApiException(
        status = status,
        code = parsed?.error ?: "http_$status",
        message = parsed?.error?.replace('_', ' ') ?: "Something went wrong (HTTP $status).",
        fieldErrors = parsed?.details?.fieldErrors ?: emptyMap(),
    )
}
