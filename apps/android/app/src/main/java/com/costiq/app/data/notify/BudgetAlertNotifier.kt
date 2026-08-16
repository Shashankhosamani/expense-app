package com.costiq.app.data.notify

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import androidx.core.app.ActivityCompat
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.costiq.app.MainActivity
import com.costiq.app.R
import com.costiq.app.data.api.dto.BudgetStatus
import com.costiq.app.data.prefs.AppPreferences
import com.costiq.app.data.repo.BudgetRepository
import com.costiq.app.util.formatINR
import dagger.hilt.android.qualifiers.ApplicationContext
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Local-only budget-threshold alert (ARCHITECTURE_2.md §16's "Budget
 * threshold notifications" row) — computed from the same BudgetStatus the
 * Overview/Budget screens already fetch, no server push involved. The
 * worker has no push-sending code (see ANDROID_PLAN.md), so this is
 * triggered client-side: once by BudgetAlertWorker on a periodic schedule,
 * and opportunistically after Overview loads fresh budget data.
 */
@Singleton
class BudgetAlertNotifier @Inject constructor(
    @ApplicationContext private val context: Context,
    private val budgetRepo: BudgetRepository,
    private val appPreferences: AppPreferences,
) {
    suspend fun checkAndNotify(month: String) {
        val status = runCatching { budgetRepo.getStatus(month) }.getOrNull() ?: return
        if (!status.notifyChannels.push) return
        if (status.percentUsed < status.warningPercentage) return
        if (appPreferences.budgetAlertNotifiedMonth() == month) return

        notify(status)
        appPreferences.markBudgetAlertNotified(month)
    }

    private fun notify(status: BudgetStatus) {
        if (ActivityCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            return
        }

        val intent = android.content.Intent(context, MainActivity::class.java)
        val pendingIntent = android.app.PendingIntent.getActivity(
            context, 0, intent,
            android.app.PendingIntent.FLAG_UPDATE_CURRENT or android.app.PendingIntent.FLAG_IMMUTABLE,
        )

        val notification = NotificationCompat.Builder(context, NotificationChannels.BUDGET_ALERTS)
            .setSmallIcon(R.drawable.ic_launcher_foreground)
            .setContentTitle("You're at ${status.percentUsed.toInt()}% of your budget")
            .setContentText("${formatINR(status.spent)} of ${formatINR(status.limitAmount)} spent this month.")
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setAutoCancel(true)
            .setContentIntent(pendingIntent)
            .build()

        NotificationManagerCompat.from(context).notify(BUDGET_ALERT_NOTIFICATION_ID, notification)
    }

    companion object {
        private const val BUDGET_ALERT_NOTIFICATION_ID = 1001
    }
}
