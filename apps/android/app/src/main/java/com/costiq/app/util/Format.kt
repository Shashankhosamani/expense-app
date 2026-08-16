package com.costiq.app.util

import java.text.NumberFormat
import java.time.LocalDate
import java.time.OffsetDateTime
import java.time.format.DateTimeFormatter
import java.util.Locale
import java.time.YearMonth

// Port of apps/web/lib/format.ts — same rules (en-IN locale, 2 decimal
// places, Indian digit grouping which differs from Western grouping above
// 1,00,000) so amounts read identically on both clients.

private val enIn = Locale("en", "IN")

private val inrFormat: NumberFormat = NumberFormat.getNumberInstance(enIn).apply {
    minimumFractionDigits = 2
    maximumFractionDigits = 2
}

fun formatINR(amount: Double): String = "₹${inrFormat.format(amount)}"

fun formatDate(iso: String): String =
    OffsetDateTime.parse(iso).format(DateTimeFormatter.ofPattern("dd MMM yyyy", enIn))

fun formatDateShort(iso: String): String =
    OffsetDateTime.parse(iso).format(DateTimeFormatter.ofPattern("dd MMM", enIn))

fun formatTime(iso: String): String =
    OffsetDateTime.parse(iso).format(DateTimeFormatter.ofPattern("hh:mm a", enIn))

fun formatDateTime(iso: String): String = "${formatDate(iso)}, ${formatTime(iso)}"

fun currentMonth(): String = YearMonth.now().format(DateTimeFormatter.ofPattern("yyyy-MM"))

/** "Today · 09 Aug" / "Yesterday · 08 Aug" / "07 Aug 2026" — mirrors the day-group headers in the Expenses feed (M2). */
fun dayGroupLabel(iso: String): String {
    val date = OffsetDateTime.parse(iso).toLocalDate()
    val today = LocalDate.now()
    val shortDate = date.format(DateTimeFormatter.ofPattern("dd MMM", enIn))
    return when (date) {
        today -> "Today · $shortDate"
        today.minusDays(1) -> "Yesterday · $shortDate"
        else -> date.format(DateTimeFormatter.ofPattern("dd MMM yyyy", enIn))
    }
}

/** Grouping key — same calendar day, independent of the label wording above. */
fun dayGroupKey(iso: String): LocalDate = OffsetDateTime.parse(iso).toLocalDate()
