package com.costiq.app.data.sms

import android.content.Context
import androidx.hilt.work.HiltWorker
import androidx.work.BackoffPolicy
import androidx.work.Constraints
import androidx.work.CoroutineWorker
import androidx.work.ExistingWorkPolicy
import androidx.work.NetworkType
import androidx.work.OneTimeWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkRequest
import androidx.work.WorkerParameters
import androidx.work.workDataOf
import com.costiq.app.data.api.ApiException
import com.costiq.app.data.api.CostiqApi
import com.costiq.app.data.api.apiCall
import com.costiq.app.data.api.dto.SmsIngestInput
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject
import kotlinx.serialization.json.Json
import java.util.concurrent.TimeUnit

/**
 * Uploads one queued SMS (already Stage-0-classified — see SmsReceiver) to
 * POST /api/sms (apps/worker/src/routes/sms.ts). A 5xx or network failure
 * is treated as transient and retried; a 4xx (e.g. rate-limited) is
 * permanent for this item.
 */
@HiltWorker
class SmsUploadWorker @AssistedInject constructor(
    @Assisted context: Context,
    @Assisted params: WorkerParameters,
    private val pendingSmsDao: PendingSmsDao,
    private val api: CostiqApi,
    private val json: Json,
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        val id = inputData.getString(KEY_PENDING_SMS_ID) ?: return Result.failure()
        val entity = pendingSmsDao.getById(id) ?: return Result.success()

        return try {
            apiCall(json) {
                api.submitSms(
                    SmsIngestInput(sender = entity.sender, rawMessage = entity.rawMessage, receivedAt = entity.receivedAt)
                )
            }
            pendingSmsDao.updateStatus(id, PendingSmsStatus.UPLOADED)
            Result.success()
        } catch (e: ApiException) {
            val transient = e.status in 500..599 || e.status == -1
            pendingSmsDao.updateStatus(id, if (transient) PendingSmsStatus.PENDING else PendingSmsStatus.FAILED, e.message)
            if (transient) Result.retry() else Result.failure()
        } catch (e: Exception) {
            pendingSmsDao.updateStatus(id, PendingSmsStatus.PENDING, e.message)
            Result.retry()
        }
    }

    companion object {
        private const val KEY_PENDING_SMS_ID = "pending_sms_id"

        fun enqueue(workManager: WorkManager, pendingSmsId: String) {
            val request = OneTimeWorkRequestBuilder<SmsUploadWorker>()
                .setInputData(workDataOf(KEY_PENDING_SMS_ID to pendingSmsId))
                .setBackoffCriteria(BackoffPolicy.EXPONENTIAL, WorkRequest.MIN_BACKOFF_MILLIS, TimeUnit.MILLISECONDS)
                .setConstraints(Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build())
                .build()
            workManager.enqueueUniqueWork("sms_upload_$pendingSmsId", ExistingWorkPolicy.KEEP, request)
        }
    }
}
