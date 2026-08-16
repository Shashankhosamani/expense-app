package com.costiq.app.data.api.dto

import kotlinx.serialization.Serializable

/**
 * POST /api/sms request body — NOT YET IMPLEMENTED on the worker as of this
 * writing (apps/worker/src/index.ts explicitly marks ingestion "deferred").
 * Shape follows ARCHITECTURE_2.md §10/§15/§11: the worker is expected to
 * encrypt `rawMessage` at rest, compute `message_hash` server-side (per §11's
 * fallback scheme — sender + normalized body + receivedAt rounded to the
 * minute, since no reference_id exists before parsing), and enqueue the row
 * as PENDING for later MCP processing. This DTO exists so
 * data/sms/SmsUploadWorker.kt has something concrete to compile against;
 * it will need to be reconciled against whatever the real endpoint ships
 * with, not assumed correct.
 */
@Serializable
data class SmsIngestInput(
    val sender: String,
    val rawMessage: String,
    val receivedAt: String, // ISO-8601
)

@Serializable
data class SmsIngestResponse(
    val id: String,
    val status: SmsStatus,
)
