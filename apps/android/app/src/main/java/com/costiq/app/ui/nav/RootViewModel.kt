package com.costiq.app.ui.nav

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.costiq.app.data.auth.SupabaseAuthManager
import com.costiq.app.data.prefs.AppPreferences
import dagger.hilt.android.lifecycle.HiltViewModel
import io.github.jan.supabase.auth.status.SessionStatus
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import javax.inject.Inject

enum class RootStartDestination { LOADING, SIGN_IN, SMS_ONBOARDING, MAIN }

@HiltViewModel
class RootViewModel @Inject constructor(
    authManager: SupabaseAuthManager,
    appPreferences: AppPreferences,
) : ViewModel() {

    // SessionStatus's exact subtype names have shifted across supabase-kt
    // major versions (LoadingFromStorage/NetworkError in v1-2 vs
    // Initializing/RefreshFailure in v3, pinned in libs.versions.toml as
    // supabase = "3.0.3"). If this doesn't compile against the version
    // actually resolved, check io.github.jan.supabase.auth.status.SessionStatus
    // for the current sealed-subtype names and adjust the `when` below —
    // the LOADING/SIGN_IN/SMS_ONBOARDING/MAIN mapping itself won't change.
    val startDestination: StateFlow<RootStartDestination> = combine(
        authManager.sessionStatus,
        appPreferences.hasSeenSmsOnboarding,
    ) { session, seenOnboarding ->
        when (session) {
            is SessionStatus.Authenticated -> if (seenOnboarding) RootStartDestination.MAIN else RootStartDestination.SMS_ONBOARDING
            is SessionStatus.NotAuthenticated -> RootStartDestination.SIGN_IN
            is SessionStatus.RefreshFailure -> RootStartDestination.SIGN_IN
            is SessionStatus.Initializing -> RootStartDestination.LOADING
        }
    }.stateIn(viewModelScope, SharingStarted.Eagerly, RootStartDestination.LOADING)
}
