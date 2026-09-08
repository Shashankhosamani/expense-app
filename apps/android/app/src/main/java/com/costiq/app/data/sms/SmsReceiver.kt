package com.costiq.app.data.sms

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.provider.Telephony
import androidx.work.WorkManager
import com.costiq.app.data.prefs.AppPreferences
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch
import java.time.Instant
import javax.inject.Inject

/**
 * Stage 0/1 entry point (ARCHITECTURE_2.md §7). Classification happens here,
 * synchronously, before anything touches disk — DISCARD results (including
 * every OTP) are never written anywhere, not even transiently. Only
 * UPLOAD_HIGH_CONFIDENCE / UPLOAD_LOW_CONFIDENCE results get a Room row and
 * a queued upload (SmsUploadWorker).
 *
 * Uses goAsync() because the Room insert is a suspend call and onReceive()
 * must not return before it completes (the receiver can otherwise be killed
 * mid-write once onReceive returns).
 */
@AndroidEntryPoint
class SmsReceiver : BroadcastReceiver() {

    @Inject lateinit var pendingSmsDao: PendingSmsDao
    @Inject lateinit var appPreferences: AppPreferences

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != Telephony.Sms.Intents.SMS_RECEIVED_ACTION) return

        val messages = Telephony.Sms.Intents.getMessagesFromIntent(intent) ?: return
        if (messages.isEmpty()) return

        val pendingResult = goAsync()
        CoroutineScope(Dispatchers.IO).launch {
            try {
                // Settings-screen kill switch — checked before classification even
                // runs, so "new messages stop being read" is literally true, not
                // just "stop being uploaded".
                if (!appPreferences.smsCaptureEnabled.first()) return@launch

                // getMessagesFromIntent()'s array holds every PDU in this broadcast.
                // For a real multi-part SMS those PDUs are fragments of ONE message
                // and must be joined — but back-to-back separate messages can also
                // land in the same broadcast, and naively joining those merged two
                // texts into one garbled row (only "the latest" survived). The SMS
                // provider already reassembles multi-part PDUs into one row and
                // keeps distinct messages as distinct rows, so read the messages
                // back from there instead of trusting the intent's own grouping.
                val window = queryWindow(messages.map { it.timestampMillis })
                val messagesFromProvider = readMessagesFromProvider(context, window.first, window.second)

                // Provider write can race the broadcast on some OEMs; retry once.
                val resolved = messagesFromProvider.ifEmpty {
                    delay(PROVIDER_RETRY_DELAY_MS)
                    readMessagesFromProvider(context, window.first, window.second)
                }.ifEmpty {
                    // Last resort so a message is never silently dropped.
                    listOf(
                        RawSms(
                            sender = messages.first().originatingAddress ?: "UNKNOWN",
                            body = messages.joinToString(separator = "") { it.messageBody ?: "" },
                            timestampMillis = messages.first().timestampMillis,
                        )
                    )
                }

                for (raw in resolved) {
                    val result = SmsClassifier.classify(raw.sender, raw.body)
                    if (result.classification == Classification.DISCARD) continue

                    val entity = PendingSmsEntity(
                        sender = raw.sender,
                        rawMessage = raw.body,
                        receivedAt = Instant.ofEpochMilli(raw.timestampMillis).toString(),
                        classification = result.classification.name,
                    )
                    pendingSmsDao.insert(entity)
                    SmsUploadWorker.enqueue(WorkManager.getInstance(context), entity.id)
                }
            } finally {
                pendingResult.finish()
            }
        }
    }

    private data class RawSms(val sender: String, val body: String, val timestampMillis: Long)

    private fun readMessagesFromProvider(context: Context, fromMillis: Long, toMillis: Long): List<RawSms> {
        val projection = arrayOf(
            Telephony.Sms.ADDRESS,
            Telephony.Sms.BODY,
            Telephony.Sms.DATE,
        )
        val results = mutableListOf<RawSms>()
        context.contentResolver.query(
            Telephony.Sms.Inbox.CONTENT_URI,
            projection,
            "${Telephony.Sms.DATE} BETWEEN ? AND ?",
            arrayOf(fromMillis.toString(), toMillis.toString()),
            "${Telephony.Sms.DATE} ASC",
        )?.use { cursor ->
            val addressCol = cursor.getColumnIndexOrThrow(Telephony.Sms.ADDRESS)
            val bodyCol = cursor.getColumnIndexOrThrow(Telephony.Sms.BODY)
            val dateCol = cursor.getColumnIndexOrThrow(Telephony.Sms.DATE)
            while (cursor.moveToNext()) {
                results += RawSms(
                    sender = cursor.getString(addressCol) ?: "UNKNOWN",
                    body = cursor.getString(bodyCol) ?: "",
                    timestampMillis = cursor.getLong(dateCol),
                )
            }
        }
        return results
    }

    companion object {
        private const val WINDOW_MS = 2_000L
        private const val PROVIDER_RETRY_DELAY_MS = 300L

        /** Provider query bounds covering every PDU timestamp in this broadcast, padded by [WINDOW_MS]. */
        internal fun queryWindow(timestampsMillis: List<Long>): Pair<Long, Long> =
            (timestampsMillis.min() - WINDOW_MS) to (timestampsMillis.max() + WINDOW_MS)
    }
}
