package com.costiq.app.data.sms

/**
 * Stage 0 of ARCHITECTURE_2.md §7 — on-device, local, no network. Direct
 * port of the decision table in that section. Deterministic regex/keyword
 * matching only; never an LLM call, never a network round-trip. Runs on
 * every incoming SMS before anything is queued for upload (see
 * SmsReceiver.kt).
 *
 * Asymmetric by design (§7): strict on steps 1–2 (a wrongly-uploaded OTP is
 * unrecoverable exposure), lenient on step 5 (a wrongly-discarded real
 * transaction is a silent, unrecoverable miss — worse than a briefly-stored
 * promo that Claude later resolves as NOT_A_TRANSACTION).
 */
enum class Classification { UPLOAD_HIGH_CONFIDENCE, UPLOAD_LOW_CONFIDENCE, DISCARD }

data class ClassificationResult(val classification: Classification, val reason: String)

object SmsClassifier {

    // Step 1 — hard-exclude: OTP-shaped content. Highest sensitivity: never uploaded, no exceptions.
    private val otpPattern = Regex(
        "otp|one time password|verification code|do not share|cvv|valid for \\d+ min(ute)?s",
        RegexOption.IGNORE_CASE,
    )

    // Step 2 — hard-exclude: administrative/account-management content (transactional-sounding, not an expense event).
    private val adminPattern = Regex(
        "limit (has been )?(updated|increased|decreased|revised)" +
            "|statement (generated|is ready|available)" +
            "|due date" +
            "|minimum (amount )?due" +
            "|autopay (set up|registered|failed)" +
            "|password (has been )?(changed|reset)" +
            "|kyc" +
            "|mandate (registered|approved|rejected)",
        RegexOption.IGNORE_CASE,
    )

    // Step 3 — sender shape: DLT-registered shortcodes, e.g. "HDFCBK", "VM-HDFCBK", "AD-VMPAY".
    private val shortcodeSenderPattern = Regex("^([A-Z]{2}-[A-Z0-9]{6}|[A-Z0-9]{6})$")

    // Step 4/5 — currency markers, tolerant of punctuation/spacing variants banks actually use (Rs., Rs:, RS , rs.).
    private val currencyPattern = Regex("rs\\.?\\s?\\d|inr\\s?\\d|₹\\s?\\d|rs:\\d", RegexOption.IGNORE_CASE)
    private val transactionVerbPattern = Regex(
        "debited|credited|spent|sent|received|withdrawn|paid|transferred|purchase",
        RegexOption.IGNORE_CASE,
    )

    fun classify(sender: String, body: String): ClassificationResult {
        if (otpPattern.containsMatchIn(body)) {
            return ClassificationResult(Classification.DISCARD, "otp_shaped_content")
        }
        if (adminPattern.containsMatchIn(body)) {
            return ClassificationResult(Classification.DISCARD, "administrative_content")
        }
        if (!shortcodeSenderPattern.matches(sender.trim().uppercase())) {
            return ClassificationResult(Classification.DISCARD, "sender_not_shortcode_shaped")
        }

        val hasCurrency = currencyPattern.containsMatchIn(body)
        val hasVerb = transactionVerbPattern.containsMatchIn(body)

        return when {
            hasCurrency && hasVerb -> ClassificationResult(Classification.UPLOAD_HIGH_CONFIDENCE, "currency_and_verb")
            hasCurrency != hasVerb -> ClassificationResult(Classification.UPLOAD_LOW_CONFIDENCE, "currency_xor_verb")
            else -> ClassificationResult(Classification.DISCARD, "no_financial_signal")
        }
    }
}
