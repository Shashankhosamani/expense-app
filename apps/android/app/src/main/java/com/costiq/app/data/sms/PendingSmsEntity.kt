package com.costiq.app.data.sms

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.time.OffsetDateTime
import java.util.UUID

object PendingSmsStatus {
    const val PENDING = "PENDING"
    const val UPLOADED = "UPLOADED"
    const val FAILED = "FAILED"
}

/**
 * Local upload queue — only rows that already passed Stage 0 (see
 * SmsClassifier) ever land here. Nothing OTP-shaped is ever written to this
 * table; the classifier runs before any row is created, not after.
 * Server-side encryption (§6) applies once uploaded; this table is this
 * app's own private storage (not exported, not backed up — see
 * AndroidManifest's android:allowBackup="false").
 */
@Entity(tableName = "pending_sms")
data class PendingSmsEntity(
    @PrimaryKey val id: String = UUID.randomUUID().toString(),
    val sender: String,
    val rawMessage: String,
    val receivedAt: String, // ISO-8601
    val classification: String, // Classification.name
    val status: String = PendingSmsStatus.PENDING,
    val attemptCount: Int = 0,
    val lastError: String? = null,
    val createdAt: String = OffsetDateTime.now().toString(),
)
