package com.costiq.app.ui.nav

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavBackStackEntry
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.costiq.app.ui.screens.addexpense.AddExpenseScreen
import com.costiq.app.ui.screens.budget.BudgetScreen
import com.costiq.app.ui.screens.expenses.ExpensesScreen
import com.costiq.app.ui.screens.expenses.ExpensesViewModel
import com.costiq.app.ui.screens.insights.InsightsScreen
import com.costiq.app.ui.screens.loading.LoadingScreen
import com.costiq.app.ui.screens.overview.OverviewScreen
import com.costiq.app.ui.screens.overview.OverviewViewModel
import com.costiq.app.ui.screens.review.ReviewScreen
import com.costiq.app.ui.screens.settings.SettingsScreen
import com.costiq.app.ui.screens.signin.SignInScreen
import com.costiq.app.ui.screens.smsonboarding.SmsPermissionScreen

/**
 * Root composable. Sign-in (M0) and the one-time SMS-permission rationale
 * (M7) are rendered directly, outside any bottom-bar shell — the design has
 * no nav chrome on either. Once RootViewModel's [RootStartDestination] flips
 * to MAIN (session authenticated + onboarding acknowledged), this swaps to
 * the tabbed shell — a reactive swap, not an explicit nav call, since both
 * conditions are observed StateFlows already.
 */
@Composable
fun CostiqApp() {
    val rootViewModel: RootViewModel = hiltViewModel()
    val startDestination by rootViewModel.startDestination.collectAsState()

    when (startDestination) {
        RootStartDestination.LOADING -> LoadingScreen()
        RootStartDestination.SIGN_IN -> SignInScreen(onSignedIn = {})
        RootStartDestination.SMS_ONBOARDING -> SmsPermissionScreen(onDone = {})
        RootStartDestination.MAIN -> MainShell()
    }
}

@Composable
private fun MainShell() {
    val navController = rememberNavController()
    val backStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = backStackEntry?.destination?.route

    Scaffold(
        bottomBar = {
            if (currentRoute in BottomBarRoutes) {
                CostiqBottomBar(
                    currentRoute = currentRoute,
                    reviewBadgeCount = 0, // wired to the real pending count once ReviewViewModel's shared state lands (Task 11)
                    onTabSelected = { route ->
                        navController.navigate(route) {
                            popUpTo(navController.graph.findStartDestination().id) { saveState = true }
                            launchSingleTop = true
                            restoreState = true
                        }
                    },
                    onAddClick = { navController.navigate(Routes.ADD_EXPENSE) },
                )
            }
        },
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Routes.OVERVIEW,
            modifier = Modifier.padding(innerPadding),
        ) {
            val openTransaction: (String) -> Unit = { navController.navigate(Routes.editExpense(it)) }
            composable(Routes.OVERVIEW) { entry ->
                val overviewViewModel: OverviewViewModel = hiltViewModel()
                entry.OnTransactionEdited(overviewViewModel::load)
                OverviewScreen(
                    onOpenReview = { navController.navigate(Routes.REVIEW) },
                    onOpenBudget = { navController.navigate(Routes.BUDGET) },
                    onOpenExpenses = { navController.navigate(Routes.EXPENSES) },
                    onOpenSettings = { navController.navigate(Routes.SETTINGS) },
                    onOpenTransaction = openTransaction,
                )
            }
            composable(Routes.EXPENSES) { entry ->
                val expensesViewModel: ExpensesViewModel = hiltViewModel()
                entry.OnTransactionEdited(expensesViewModel::retry)
                ExpensesScreen(onOpenTransaction = openTransaction)
            }
            composable(Routes.REVIEW) { ReviewScreen() }
            composable(Routes.INSIGHTS) { InsightsScreen() }
            composable(Routes.ADD_EXPENSE) {
                AddExpenseScreen(onDone = { navController.popBackStack() })
            }
            composable(Routes.EDIT_EXPENSE) {
                AddExpenseScreen(onDone = { saved ->
                    if (saved) navController.previousBackStackEntry?.savedStateHandle?.set(TRANSACTION_EDITED, true)
                    navController.popBackStack()
                })
            }
            composable(Routes.BUDGET) {
                BudgetScreen(onBack = { navController.popBackStack() })
            }
            composable(Routes.SETTINGS) {
                SettingsScreen(onBack = { navController.popBackStack() })
            }
        }
    }
}

private const val TRANSACTION_EDITED = "transaction_edited"

/** Reloads a list screen when the edit screen popped back to it after saving. */
@Composable
private fun NavBackStackEntry.OnTransactionEdited(reload: () -> Unit) {
    val edited by savedStateHandle.getStateFlow(TRANSACTION_EDITED, false).collectAsState()
    LaunchedEffect(edited) {
        if (edited) {
            savedStateHandle[TRANSACTION_EDITED] = false
            reload()
        }
    }
}
