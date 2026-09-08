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

    // Step 3 — sender shape: DLT-registered shortcodes. Covers the bare 6-char
    // form ("HDFCBK"), the legacy 2-segment form ("VM-HDFCBK"), and the
    // current 3-segment form with a trailing category suffix — T/P/S/G for
    // Transactional/Promotional/Service/Government — e.g. "AD-HDFCBK-S".
    private val shortcodeSenderPattern = Regex(
        "^[A-Z0-9]{6}$" +
            "|^[A-Z]{2}-[A-Z0-9]{2,6}$" +
            "|^[A-Z]{2}-[A-Z0-9]{2,6}-[A-Z]$"
    )

    // Step 3b — sender identity: shortcode-shaped isn't enough on its own (e-commerce,
    // OTAs, wallets, telecom all use DLT shortcodes too). Gate on known Indian bank /
    // payments-bank name fragments actually embedded in real sender IDs
    // (e.g. "HDFCBK", "AD-ICICIB-S", "VM-UNIONB"). Extend this set as new banks surface.
    private val bankSenderTokens = setOf(
        // Private sector
        "HDFC", "ICICI", "AXIS", "KOTAK", "INDUSB", "INDUS", "YESBNK", "RBLBNK", "RBL", "IDFCFB", "IDFC",
        "FEDBNK", "FEDERAL", "SCBLTD", "SCBIND", "HSBCIN", "HSBC", "CITIBK", "CITI", "DBSBNK", "DBS",
        "KVBBNK", "KVB", "DCBBNK", "DCB", "CSBBNK", "CSB", "TMBLTD", "TMB", "SIBLTD", "SIB", "DHANBK", "DHANLAXMI",
        "JKBANK", "JKB", "BANDHN", "BANDHAN", "AUBANK", "AUSFB", "EQUITB", "EQUITAS", "UJJIVN", "UJJIVAN",
        "ESAFBK", "ESAF",
        // Public sector
        "SBIINB", "SBIBNK", "SBIPSG", "SBI", "PNBSMS", "PNB", "BOIIND", "BOI",
        "CANBNK", "CNRBNK", "CNRB", "CANARA", "UNIONB", "UBIN", "UNIONBANK",
        "BOBIBN", "BOBTXN", "BARODA", "IDBIBK", "IDBI", "CENTBK", "CBIN", "CENTRALBANK",
        "UCOBNK", "UCO", "INDBNK", "INDIANBANK", "IOBCHN", "IOB", "PSBIND", "PSB", "MAHABK", "MAHB",
        // Payments / small finance banks
        "PAYTMB", "PAYTM", "AIRBNK", "AIRTEL", "FINOBK", "FINO", "JIOPAY", "NSDLPB", "INDPOST",
    )

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
        val normalizedSender = sender.trim().uppercase()
        if (!shortcodeSenderPattern.matches(normalizedSender)) {
            return ClassificationResult(Classification.DISCARD, "sender_not_shortcode_shaped")
        }
        if (bankSenderTokens.none { normalizedSender.contains(it) }) {
            return ClassificationResult(Classification.DISCARD, "sender_not_known_bank")
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
