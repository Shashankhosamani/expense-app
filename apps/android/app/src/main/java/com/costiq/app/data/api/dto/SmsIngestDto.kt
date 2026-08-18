package com.costiq.app.data.api.dto

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

/**
 * POST /api/sms request/response — mirrors
 * packages/shared/src/sms.ts's smsIngestInputSchema / SmsIngestResponse.
 * The worker computes message_hash and does the encrypt-at-rest itself
 * (ARCHITECTURE_2.md §6/§11); this DTO only carries what the device knows.
 */
@Serializable
data class SmsIngestInput(
    val sender: String,
    @SerialName("raw_message") val rawMessage: String,
    @SerialName("received_at") val receivedAt: String, // ISO-8601
)

@Serializable
data class SmsIngestResponse(
    val id: String,
    val status: SmsStatus,
)
