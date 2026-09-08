package com.costiq.app.data.sms

import org.junit.Assert.assertEquals
import org.junit.Test

/**
 * Covers the query-window math behind the SMS-provider readback (see
 * SmsReceiver.onReceive): it must span every PDU timestamp in the broadcast,
 * not just the first one, or a genuine second message in the same broadcast
 * falls outside the window and gets missed again.
 */
class SmsReceiverTest {

    @Test
    fun `single timestamp pads both sides by the window`() {
        val (from, to) = SmsReceiver.queryWindow(listOf(1_000L))
        assertEquals(1_000L - 2_000L, from)
        assertEquals(1_000L + 2_000L, to)
    }

    @Test
    fun `two distinct timestamps produce a window spanning both`() {
        val (from, to) = SmsReceiver.queryWindow(listOf(5_000L, 8_000L))
        assertEquals(5_000L - 2_000L, from)
        assertEquals(8_000L + 2_000L, to)
    }
}
