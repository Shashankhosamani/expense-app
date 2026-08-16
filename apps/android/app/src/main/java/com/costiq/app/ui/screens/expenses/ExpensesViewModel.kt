package com.costiq.app.ui.screens.expenses

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.costiq.app.data.api.ApiException
import com.costiq.app.data.api.dto.Transaction
import com.costiq.app.data.repo.TransactionsRepository
import com.costiq.app.util.currentMonth
import com.costiq.app.util.dayGroupKey
import com.costiq.app.util.dayGroupLabel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class DayGroup(val label: String, val total: Double, val transactions: List<Transaction>)

enum class SourceFilter(val apiValue: String?, val label: String) {
    ALL(null, "All"),
    FROM_MESSAGES("sms", "From messages"),
    BY_HAND("manual", "By hand"),
}

data class ExpensesUiState(
    val query: String = "",
    val source: SourceFilter = SourceFilter.ALL,
    val month: String = currentMonth(),
    val groups: List<DayGroup> = emptyList(),
    val total: Int = 0,
    val isLoading: Boolean = true,
    val isLoadingMore: Boolean = false,
    val hasMore: Boolean = true,
    val error: String? = null,
    val page: Int = 1,
)

private const val PAGE_SIZE = 20

@HiltViewModel
class ExpensesViewModel @Inject constructor(
    private val transactionsRepo: TransactionsRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(ExpensesUiState())
    val uiState: StateFlow<ExpensesUiState> = _uiState.asStateFlow()

    private var loadedTransactions: List<Transaction> = emptyList()
    private var searchDebounce: Job? = null

    init {
        load(resetList = true)
    }

    fun onQueryChange(value: String) {
        _uiState.update { it.copy(query = value) }
        searchDebounce?.cancel()
        searchDebounce = viewModelScope.launch {
            delay(350)
            load(resetList = true)
        }
    }

    fun onSourceChange(source: SourceFilter) {
        _uiState.update { it.copy(source = source) }
        load(resetList = true)
    }

    fun loadMore() {
        val state = _uiState.value
        if (state.isLoadingMore || !state.hasMore || state.isLoading) return
        load(resetList = false)
    }

    fun retry() = load(resetList = true)

    private fun load(resetList: Boolean) {
        val state = _uiState.value
        val nextPage = if (resetList) 1 else state.page + 1
        _uiState.update {
            if (resetList) it.copy(isLoading = true, error = null) else it.copy(isLoadingMore = true)
        }
        viewModelScope.launch {
            try {
                val result = transactionsRepo.list(
                    page = nextPage,
                    limit = PAGE_SIZE,
                    month = state.month,
                    source = state.source.apiValue,
                    query = state.query.trim().ifBlank { null },
                )
                loadedTransactions = if (resetList) result.transactions else loadedTransactions + result.transactions
                val groups = groupByDay(loadedTransactions)
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        isLoadingMore = false,
                        groups = groups,
                        total = result.total,
                        page = nextPage,
                        hasMore = loadedTransactions.size < result.total,
                    )
                }
            } catch (e: ApiException) {
                _uiState.update { it.copy(isLoading = false, isLoadingMore = false, error = e.message) }
            } catch (e: Exception) {
                _uiState.update {
                    it.copy(isLoading = false, isLoadingMore = false, error = "Couldn't load your expenses.")
                }
            }
        }
    }

    private fun groupByDay(transactions: List<Transaction>): List<DayGroup> =
        transactions
            .groupBy { dayGroupKey(it.transactionAt) }
            .toSortedMap(compareByDescending { it })
            .map { (_, txns) ->
                val label = dayGroupLabel(txns.first().transactionAt)
                val total = txns.filter { it.type == com.costiq.app.data.api.dto.TransactionType.DEBIT }.sumOf { it.amount }
                DayGroup(label = label, total = total, transactions = txns)
            }
}
