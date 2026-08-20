package com.costiq.app.ui.screens.signin

import android.content.Context
import androidx.credentials.exceptions.GetCredentialCancellationException
import androidx.credentials.exceptions.GetCredentialException
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.costiq.app.data.auth.GoogleAuthClient
import com.costiq.app.data.auth.SupabaseAuthManager
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class SignInUiState(
    val email: String = "",
    val password: String = "",
    val staySignedIn: Boolean = true,
    val passwordVisible: Boolean = false,
    val isLoading: Boolean = false,
    val isGoogleLoading: Boolean = false,
    val error: String? = null,
)

@HiltViewModel
class SignInViewModel @Inject constructor(
    private val authManager: SupabaseAuthManager,
    private val googleAuthClient: GoogleAuthClient,
) : ViewModel() {

    private val _uiState = MutableStateFlow(SignInUiState())
    val uiState: StateFlow<SignInUiState> = _uiState.asStateFlow()

    fun onEmailChange(value: String) = _uiState.update { it.copy(email = value, error = null) }
    fun onPasswordChange(value: String) = _uiState.update { it.copy(password = value, error = null) }
    fun onTogglePasswordVisibility() = _uiState.update { it.copy(passwordVisible = !it.passwordVisible) }
    fun onToggleStaySignedIn() = _uiState.update { it.copy(staySignedIn = !it.staySignedIn) }

    fun signIn() {
        val state = _uiState.value
        if (state.email.isBlank() || state.password.isBlank()) {
            _uiState.update { it.copy(error = "Enter your email and password.") }
            return
        }
        _uiState.update { it.copy(isLoading = true, error = null) }
        viewModelScope.launch {
            try {
                authManager.signInWithEmail(state.email.trim(), state.password)
                // No further action needed here — RootViewModel observes
                // SupabaseAuthManager.sessionStatus and swaps the root
                // composable to onboarding/main automatically once this
                // resolves to Authenticated.
                _uiState.update { it.copy(isLoading = false) }
            } catch (e: Exception) {
                _uiState.update { it.copy(isLoading = false, error = "Couldn't sign in. Check your email and password.") }
            }
        }
    }

    fun signInWithGoogle(context: Context) {
        _uiState.update { it.copy(isGoogleLoading = true, error = null) }
        viewModelScope.launch {
            try {
                val result = googleAuthClient.requestIdToken(context)
                authManager.signInWithGoogleIdToken(result.idToken, result.rawNonce)
                _uiState.update { it.copy(isGoogleLoading = false) }
            } catch (e: GetCredentialCancellationException) {
                _uiState.update { it.copy(isGoogleLoading = false) }
            } catch (e: GetCredentialException) {
                _uiState.update { it.copy(isGoogleLoading = false, error = "Couldn't sign in with Google.") }
            } catch (e: Exception) {
                _uiState.update { it.copy(isGoogleLoading = false, error = "Couldn't sign in with Google.") }
            }
        }
    }
}
