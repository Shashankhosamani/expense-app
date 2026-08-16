package com.costiq.app.data.notify

import android.content.Context
import androidx.hilt.work.HiltWorker
import androidx.work.Constraints
import androidx.work.CoroutineWorker
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.NetworkType
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import com.costiq.app.util.currentMonth
import dagger.assisted.Assisted
import dagger.assisted.AssistedInject
import java.util.concurrent.TimeUnit

/** Periodic check so a budget-threshold alert can fire even if the app isn't open. */
@HiltWorker
class BudgetAlertWorker @AssistedInject constructor(
    @Assisted context: Context,
    @Assisted params: WorkerParameters,
    private val notifier: BudgetAlertNotifier,
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        notifier.checkAndNotify(currentMonth())
        return Result.success()
    }

    companion object {
        private const val UNIQUE_WORK_NAME = "budget_alert_check"

        fun schedule(workManager: WorkManager) {
            val request = PeriodicWorkRequestBuilder<BudgetAlertWorker>(6, TimeUnit.HOURS)
                .setConstraints(Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build())
                .build()
            workManager.enqueueUniquePeriodicWork(UNIQUE_WORK_NAME, ExistingPeriodicWorkPolicy.KEEP, request)
        }
    }
}
