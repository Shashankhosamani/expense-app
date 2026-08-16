package com.costiq.app.data.notify

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import androidx.core.app.NotificationManagerCompat

object NotificationChannels {
    const val BUDGET_ALERTS = "budget_alerts"

    fun ensureCreated(context: Context) {
        val channel = NotificationChannel(
            BUDGET_ALERTS,
            "Budget alerts",
            NotificationManager.IMPORTANCE_DEFAULT,
        ).apply {
            description = "Notifies you once you cross your monthly budget's warning threshold."
        }
        NotificationManagerCompat.from(context).createNotificationChannel(channel)
    }
}
