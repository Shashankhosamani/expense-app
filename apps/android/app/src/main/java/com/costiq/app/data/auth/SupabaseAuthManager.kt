package com.costiq.app.data.auth

import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.auth.Auth
import io.github.jan.supabase.auth.auth
import io.github.jan.supabase.auth.providers.builtin.Email
import io.github.jan.supabase.auth.status.SessionStatus
import kotlinx.coroutines.flow.StateFlow
import javax.inject.Inject
import javax.inject.Singleton

/**
 * Thin wrapper around supabase-kt's Auth plugin — same Supabase project the
 * web dashboard signs into (apps/web/lib/supabase/client.ts), so a Costiq
 * account works on both clients. The worker's `requireUser` middleware
 * (apps/worker/src/auth.ts) only checks `supabase.auth.getUser(token)`, so
 * this session's access token is a valid Bearer token for every /api/*
 * call — no separate device-key flow exists yet.
 */
@Singleton
class SupabaseAuthManager @Inject constructor(
    private val client: SupabaseClient,
) {
    private val auth get() = client.auth

    /** Authenticated(session) / NotAuthenticated / LoadingFromStorage / RefreshFailure. */
    val sessionStatus: StateFlow<SessionStatus> get() = auth.sessionStatus

    suspend fun signInWithEmail(email: String, password: String) {
        auth.signInWith(Email) {
            this.email = email
            this.password = password
        }
    }

    suspend fun signOut() {
        auth.signOut()
    }

    /**
     * Current access token, if any — supabase-kt's Auth plugin keeps this
     * refreshed in the background (alwaysAutoRefresh, on by default), so this
     * is a cheap, non-blocking read suitable for an OkHttp interceptor.
     */
    fun currentAccessTokenOrNull(): String? = auth.currentAccessTokenOrNull()

    fun currentUserId(): String? = auth.currentUserOrNull()?.id
}
