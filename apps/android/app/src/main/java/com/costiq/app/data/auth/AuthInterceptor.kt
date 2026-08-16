package com.costiq.app.data.auth

import okhttp3.Interceptor
import okhttp3.Response
import javax.inject.Inject

/**
 * Attaches the live Supabase session's access token to every worker
 * request, exactly like apps/web/lib/api.ts's useApiClient does with
 * `supabase.auth.getSession()`. Requests made before sign-in (or after
 * sign-out) simply go out without an Authorization header — the worker
 * replies 401 `missing_token`, which the repositories surface as a normal
 * error rather than something this interceptor needs to special-case.
 */
class AuthInterceptor @Inject constructor(
    private val authManager: SupabaseAuthManager,
) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val token = authManager.currentAccessTokenOrNull()
        val request = if (token != null) {
            chain.request().newBuilder()
                .addHeader("Authorization", "Bearer $token")
                .build()
        } else {
            chain.request()
        }
        return chain.proceed(request)
    }
}
