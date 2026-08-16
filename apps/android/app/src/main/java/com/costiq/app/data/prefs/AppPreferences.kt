package com.costiq.app.data.prefs

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

private val Context.dataStore by preferencesDataStore(name = "costiq_prefs")

/**
 * Small local flags that aren't worth a server round-trip: whether the M7
 * SMS-permission rationale screen has already been shown once, so it
 * doesn't reappear on every app launch (matches its "I will add expenses
 * myself" opt-out in the design — a one-time decision, not a nag).
 */
@Singleton
class AppPreferences @Inject constructor(@ApplicationContext private val context: Context) {

    private val smsOnboardingSeenKey = booleanPreferencesKey("sms_onboarding_seen")
    private val budgetAlertNotifiedMonthKey = stringPreferencesKey("budget_alert_notified_month")

    val hasSeenSmsOnboarding: Flow<Boolean> =
        context.dataStore.data.map { it[smsOnboardingSeenKey] ?: false }

    suspend fun markSmsOnboardingSeen() {
        context.dataStore.edit { it[smsOnboardingSeenKey] = true }
    }

    /** Which month (YYYY-MM) the budget-threshold notification last fired for — at most one alert per month. */
    suspend fun budgetAlertNotifiedMonth(): String? =
        context.dataStore.data.map { it[budgetAlertNotifiedMonthKey] }.first()

    suspend fun markBudgetAlertNotified(month: String) {
        context.dataStore.edit { it[budgetAlertNotifiedMonthKey] = month }
    }
}
