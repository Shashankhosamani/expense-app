package com.costiq.app.ui.screens.budget

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.costiq.app.data.api.ApiException
import com.costiq.app.data.api.dto.BudgetStatus
import com.costiq.app.data.api.dto.BudgetUpsertInput
import com.costiq.app.data.api.dto.NotifyChannels
import com.costiq.app.data.repo.BudgetRepository
import com.costiq.app.util.currentMonth
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class BudgetUiState(
    val month: String = currentMonth(),
    val isLoading: Boolean = true,
    val error: String? = null,
    val status: BudgetStatus? = null,
    val limitAmountText: String = "",
    val warningPercent: Int = 90,
    val notifyPush: Boolean = true,
    val notifyInApp: Boolean = true,
    val isSaving: Boolean = false,
    val saveError: String? = null,
    val justSaved: Boolean = false,
)

@HiltViewModel
class BudgetViewModel @Inject constructor(
    private val budgetRepo: BudgetRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(BudgetUiState())
    val uiState: StateFlow<BudgetUiState> = _uiState.asStateFlow()

    init {
        load()
    }

    fun load() {
        val month = currentMonth()
        _uiState.update { it.copy(isLoading = true, error = null, month = month) }
        viewModelScope.launch {
            try {
                val status = budgetRepo.getStatus(month)
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        status = status,
                        limitAmountText = status?.limitAmount?.let { amt -> "%.2f".format(amt) } ?: it.limitAmountText,
                        warningPercent = status?.warningPercentage ?: it.warningPercent,
                        notifyPush = status?.notifyChannels?.push ?: true,
                        notifyInApp = status?.notifyChannels?.inApp ?: true,
                    )
                }
            } catch (e: ApiException) {
                _uiState.update { it.copy(isLoading = false, error = e.message) }
            } catch (e: Exception) {
                _uiState.update { it.copy(isLoading = false, error = "Couldn't load your budget.") }
            }
        }
    }

    fun onLimitChange(value: String) {
        if (value.isEmpty() || value.matches(Regex("^\\d{0,9}(\\.\\d{0,2})?$"))) {
            _uiState.update { it.copy(limitAmountText = value, saveError = null) }
        }
    }

    fun onWarningPercentChange(percent: Int) = _uiState.update { it.copy(warningPercent = percent.coerceIn(1, 100)) }
    fun onTogglePush() = _uiState.update { it.copy(notifyPush = !it.notifyPush) }
    fun onToggleInApp() = _uiState.update { it.copy(notifyInApp = !it.notifyInApp) }

    fun save() {
        val state = _uiState.value
        val limit = state.limitAmountText.toDoubleOrNull()
        if (limit == null || limit <= 0.0) {
            _uiState.update { it.copy(saveError = "Enter a monthly limit greater than zero.") }
            return
        }
        _uiState.update { it.copy(isSaving = true, saveError = null, justSaved = false) }
        viewModelScope.launch {
            try {
                budgetRepo.upsert(
                    state.month,
                    BudgetUpsertInput(
                        limitAmount = limit,
                        warningPercentage = state.warningPercent,
                        notifyChannels = NotifyChannels(push = state.notifyPush, email = false, inApp = state.notifyInApp),
                    ),
                )
                val refreshed = budgetRepo.getStatus(state.month)
                _uiState.update { it.copy(isSaving = false, justSaved = true, status = refreshed) }
            } catch (e: ApiException) {
                _uiState.update { it.copy(isSaving = false, saveError = e.message) }
            } catch (e: Exception) {
                _uiState.update { it.copy(isSaving = false, saveError = "Couldn't save your budget. Try again.") }
            }
        }
    }
}
