package com.costiq.app.ui.nav

/** Route constants — see ANDROID_PLAN.md's screen table for the M0–M7 design mapping. */
object Routes {
    const val SIGN_IN = "sign_in" // M0
    const val SMS_PERMISSION = "sms_permission" // M7
    const val OVERVIEW = "overview" // M1
    const val EXPENSES = "expenses" // M2
    const val REVIEW = "review" // M3
    const val ADD_EXPENSE = "add_expense" // M4
    const val BUDGET = "budget" // M5
    const val INSIGHTS = "insights" // M6
    const val SETTINGS = "settings"
}

/** Routes that show the bottom navigation bar (the design's tabs() set, minus the Add action item). */
val BottomBarRoutes = setOf(Routes.OVERVIEW, Routes.EXPENSES, Routes.REVIEW, Routes.INSIGHTS)
