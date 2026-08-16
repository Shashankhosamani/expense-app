package com.costiq.app.ui.screens.smsonboarding

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.costiq.app.data.prefs.AppPreferences
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SmsPermissionViewModel @Inject constructor(
    private val appPreferences: AppPreferences,
) : ViewModel() {

    /** Called after the system permission dialog resolves (granted or denied) or the user opts out — either way, onboarding is "seen". */
    fun acknowledge() {
        viewModelScope.launch { appPreferences.markSmsOnboardingSeen() }
    }
}
