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

        // Multi-part SMS arrive as multiple PDUs from the same sender — Android
        // returns them in order; concatenate into one logical message rather
        // than classifying (and potentially half-uploading) fragments.
        val sender = messages.first().originatingAddress ?: "UNKNOWN"
        val body = messages.joinToString(separator = "") { it.messageBody ?: "" }
        val receivedAt = Instant.ofEpochMilli(messages.first().timestampMillis).toString()

        val pendingResult = goAsync()
        CoroutineScope(Dispatchers.IO).launch {
            try {
                // Settings-screen kill switch — checked before classification even
                // runs, so "new messages stop being read" is literally true, not
                // just "stop being uploaded".
                if (!appPreferences.smsCaptureEnabled.first()) return@launch

                val result = SmsClassifier.classify(sender, body)
                if (result.classification == Classification.DISCARD) return@launch

                val entity = PendingSmsEntity(
                    sender = sender,
                    rawMessage = body,
                    receivedAt = receivedAt,
                    classification = result.classification.name,
                )
                pendingSmsDao.insert(entity)
                SmsUploadWorker.enqueue(WorkManager.getInstance(context), entity.id)
            } finally {
                pendingResult.finish()
            }
        }
    }
}
