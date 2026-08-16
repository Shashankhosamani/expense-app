package com.costiq.app.ui.screens.overview

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.costiq.app.data.api.ApiException
import com.costiq.app.data.api.dto.BudgetStatus
import com.costiq.app.data.api.dto.MonthlySummary
import com.costiq.app.data.api.dto.Transaction
import com.costiq.app.data.notify.BudgetAlertNotifier
import com.costiq.app.data.repo.BudgetRepository
import com.costiq.app.data.repo.ReviewRepository
import com.costiq.app.data.repo.SummaryRepository
import com.costiq.app.data.repo.TransactionsRepository
import com.costiq.app.util.currentMonth
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class OverviewUiState(
    val isLoading: Boolean = true,
    val error: String? = null,
    val month: String = currentMonth(),
    val summary: MonthlySummary? = null,
    val budgetStatus: BudgetStatus? = null,
    val recentTransactions: List<Transaction> = emptyList(),
    val reviewCount: Int = 0,
    val reviewHasSuspicious: Boolean = false,
)

@HiltViewModel
class OverviewViewModel @Inject constructor(
    private val summaryRepo: SummaryRepository,
    private val transactionsRepo: TransactionsRepository,
    private val reviewRepo: ReviewRepository,
    private val budgetRepo: BudgetRepository,
    private val budgetAlertNotifier: BudgetAlertNotifier,
) : ViewModel() {

    private val _uiState = MutableStateFlow(OverviewUiState())
    val uiState: StateFlow<OverviewUiState> = _uiState.asStateFlow()

    init {
        load()
    }

    fun load() {
        val month = currentMonth()
        _uiState.update { it.copy(isLoading = true, error = null, month = month) }
        viewModelScope.launch {
            try {
                coroutineScope {
                    val summaryDeferred = async { summaryRepo.getMonthlySummary(month) }
                    val recentDeferred = async { transactionsRepo.list(page = 1, limit = 6, month = month) }
                    val reviewDeferred = async { reviewRepo.list(page = 1, limit = 20) }
                    // 404 ("no budget set yet") is a normal, expected outcome here — see BudgetRepository.getStatus.
                    val budgetDeferred = async { budgetRepo.getStatus(month) }

                    val summary = summaryDeferred.await()
                    val recent = recentDeferred.await()
                    val review = reviewDeferred.await()
                    val budget = budgetDeferred.await()

                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            summary = summary,
                            recentTransactions = recent.transactions,
                            reviewCount = review.total,
                            reviewHasSuspicious = review.items.any { item -> item.suspicious },
                            budgetStatus = budget,
                        )
                    }
                    // Best-effort, opportunistic — the periodic BudgetAlertWorker
                    // is the real delivery mechanism for when the app isn't open.
                    budgetAlertNotifier.checkAndNotify(month)
                }
            } catch (e: ApiException) {
                _uiState.update { it.copy(isLoading = false, error = e.message) }
            } catch (e: Exception) {
                _uiState.update { it.copy(isLoading = false, error = "Something went wrong loading your overview.") }
            }
        }
    }
}
