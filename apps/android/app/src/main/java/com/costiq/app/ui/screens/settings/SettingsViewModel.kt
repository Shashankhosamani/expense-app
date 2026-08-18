package com.costiq.app.ui.screens.settings

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.costiq.app.data.prefs.AppPreferences
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SettingsViewModel @Inject constructor(
    private val appPreferences: AppPreferences,
) : ViewModel() {

    val smsCaptureEnabled: StateFlow<Boolean> = appPreferences.smsCaptureEnabled
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), true)

    /** Only ever flips the local flag — the OS RECEIVE_SMS/READ_SMS grant is untouched (apps can't revoke their own permissions). */
    fun setSmsCaptureEnabled(enabled: Boolean) {
        viewModelScope.launch { appPreferences.setSmsCaptureEnabled(enabled) }
    }
}
