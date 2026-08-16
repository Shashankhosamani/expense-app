package com.costiq.app.ui.screens.insights

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.costiq.app.data.api.ApiException
import com.costiq.app.data.api.dto.CategoryBreakdown
import com.costiq.app.data.api.dto.InsightsResponse
import com.costiq.app.data.repo.SummaryRepository
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

data class InsightsUiState(
    val isLoading: Boolean = true,
    val error: String? = null,
    val insights: InsightsResponse? = null,
    val categoryBreakdown: List<CategoryBreakdown> = emptyList(),
    val monthsRange: Int = 6,
)

private val RANGE_OPTIONS = listOf(3, 6, 12)

@HiltViewModel
class InsightsViewModel @Inject constructor(
    private val summaryRepo: SummaryRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(InsightsUiState())
    val uiState: StateFlow<InsightsUiState> = _uiState.asStateFlow()

    init {
        load()
    }

    fun cycleRange() {
        val next = RANGE_OPTIONS[(RANGE_OPTIONS.indexOf(_uiState.value.monthsRange) + 1) % RANGE_OPTIONS.size]
        _uiState.update { it.copy(monthsRange = next) }
        load()
    }

    fun load() {
        val range = _uiState.value.monthsRange
        _uiState.update { it.copy(isLoading = true, error = null) }
        viewModelScope.launch {
            try {
                coroutineScope {
                    val insightsDeferred = async { summaryRepo.getInsights(months = range) }
                    val summaryDeferred = async { summaryRepo.getMonthlySummary(currentMonth()) }
                    val insights = insightsDeferred.await()
                    val summary = summaryDeferred.await()
                    _uiState.update {
                        it.copy(isLoading = false, insights = insights, categoryBreakdown = summary.categoryBreakdown)
                    }
                }
            } catch (e: ApiException) {
                _uiState.update { it.copy(isLoading = false, error = e.message) }
            } catch (e: Exception) {
                _uiState.update { it.copy(isLoading = false, error = "Couldn't load insights.") }
            }
        }
    }
}
