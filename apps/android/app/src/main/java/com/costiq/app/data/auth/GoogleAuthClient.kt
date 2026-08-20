package com.costiq.app.data.auth

import android.content.Context
import androidx.credentials.CredentialManager
import androidx.credentials.CustomCredential
import androidx.credentials.GetCredentialRequest
import com.costiq.app.BuildConfig
import com.google.android.libraries.identity.googleid.GetGoogleIdOption
import com.google.android.libraries.identity.googleid.GoogleIdTokenCredential
import com.google.android.libraries.identity.googleid.GoogleIdTokenParsingException
import java.security.MessageDigest
import java.util.UUID

/** A successful Google sign-in — [rawNonce] must be passed straight through to Supabase's IDToken.Config.nonce. */
data class GoogleIdTokenResult(val idToken: String, val rawNonce: String)

/**
 * Runs Credential Manager's Google Sign-In flow. [context] must be an
 * Activity context — Credential Manager's picker UI is attached to it, an
 * Application context throws.
 */
@OptIn(ExperimentalStdlibApi::class)
suspend fun requestGoogleIdToken(context: Context): GoogleIdTokenResult {
    val rawNonce = UUID.randomUUID().toString()
    val hashedNonce = MessageDigest.getInstance("SHA-256").digest(rawNonce.toByteArray()).toHexString()

    val googleIdOption = GetGoogleIdOption.Builder()
        .setFilterByAuthorizedAccounts(false)
        .setServerClientId(BuildConfig.GOOGLE_WEB_CLIENT_ID)
        .setNonce(hashedNonce)
        .build()

    val request = GetCredentialRequest.Builder()
        .addCredentialOption(googleIdOption)
        .build()

    val credential = CredentialManager.create(context).getCredential(context, request).credential
    if (credential !is CustomCredential || credential.type != GoogleIdTokenCredential.TYPE_GOOGLE_ID_TOKEN_CREDENTIAL) {
        error("Unexpected credential type from Credential Manager: ${credential.type}")
    }
    val idToken = try {
        GoogleIdTokenCredential.createFrom(credential.data).idToken
    } catch (e: GoogleIdTokenParsingException) {
        error("Couldn't parse Google ID token: ${e.message}")
    }
    return GoogleIdTokenResult(idToken, rawNonce)
}
