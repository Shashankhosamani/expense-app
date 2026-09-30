package com.costiq.app.ui.screens.addexpense

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.costiq.app.data.api.ApiException
import com.costiq.app.data.api.dto.Category
import com.costiq.app.data.api.dto.ManualTransactionInput
import com.costiq.app.data.api.dto.TransactionCorrectionInput
import com.costiq.app.data.api.dto.TransactionType
import com.costiq.app.data.repo.CategoryRepository
import com.costiq.app.data.repo.TransactionsRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.time.OffsetDateTime
import javax.inject.Inject

data class AddExpenseUiState(
    val amountText: String = "",
    val type: TransactionType = TransactionType.DEBIT,
    val merchant: String = "",
    val categories: List<Category> = emptyList(),
    val selectedCategoryId: String? = null,
    val transactionAt: OffsetDateTime = OffsetDateTime.now(),
    val note: String = "",
    val isSaving: Boolean = false,
    val error: String? = null,
    val saved: Boolean = false,
    val isEditing: Boolean = false,
)

@HiltViewModel
class AddExpenseViewModel @Inject constructor(
    private val transactionsRepo: TransactionsRepository,
    private val categoryRepo: CategoryRepository,
    savedStateHandle: SavedStateHandle,
) : ViewModel() {

    /** Set when opened via Routes.EDIT_EXPENSE — the screen then edits this transaction instead of creating one. */
    private val transactionId: String? = savedStateHandle["id"]

    private val _uiState = MutableStateFlow(AddExpenseUiState(isEditing = transactionId != null))
    val uiState: StateFlow<AddExpenseUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            val categories = runCatching { categoryRepo.list() }.getOrDefault(emptyList())
            _uiState.update { it.copy(categories = categories) }
        }
        if (transactionId != null) viewModelScope.launch {
            try {
                val txn = transactionsRepo.get(transactionId)
                _uiState.update {
                    it.copy(
                        amountText = txn.amount.toBigDecimal().stripTrailingZeros().toPlainString(),
                        type = txn.type,
                        merchant = txn.merchant.orEmpty(),
                        selectedCategoryId = txn.categoryId,
                        transactionAt = OffsetDateTime.parse(txn.transactionAt),
                    )
                }
            } catch (e: Exception) {
                _uiState.update { it.copy(error = "Couldn't load this transaction.") }
            }
        }
    }

    fun onAmountChange(value: String) {
        if (value.isEmpty() || value.matches(Regex("^\\d{0,9}(\\.\\d{0,2})?$"))) {
            _uiState.update { it.copy(amountText = value, error = null) }
        }
    }

    fun onTypeChange(type: TransactionType) = _uiState.update { it.copy(type = type) }
    fun onMerchantChange(value: String) = _uiState.update { it.copy(merchant = value) }
    fun onCategorySelected(categoryId: String) =
        _uiState.update { it.copy(selectedCategoryId = if (it.selectedCategoryId == categoryId) null else categoryId) }
    fun onDateTimeChange(dateTime: OffsetDateTime) = _uiState.update { it.copy(transactionAt = dateTime) }
    fun onNoteChange(value: String) = _uiState.update { it.copy(note = value) }

    fun save() {
        val state = _uiState.value
        val amount = state.amountText.toDoubleOrNull()
        if (amount == null || amount <= 0.0) {
            _uiState.update { it.copy(error = "Enter an amount greater than zero.") }
            return
        }
        _uiState.update { it.copy(isSaving = true, error = null) }
        viewModelScope.launch {
            try {
                if (transactionId != null) transactionsRepo.correct(
                    transactionId,
                    // ponytail: explicitNulls=false drops nulls, so clearing merchant/category isn't sent; send JsonNull if that's needed
                    TransactionCorrectionInput(
                        amount = amount,
                        type = state.type,
                        merchant = state.merchant.trim().ifBlank { null },
                        categoryId = state.selectedCategoryId,
                        transactionAt = state.transactionAt.toString(),
                    )
                ) else transactionsRepo.createManual(
                    ManualTransactionInput(
                        amount = amount,
                        type = state.type,
                        merchant = state.merchant.trim().ifBlank { null },
                        categoryId = state.selectedCategoryId,
                        transactionAt = state.transactionAt.toString(),
                        note = state.note.trim().ifBlank { null },
                    )
                )
                _uiState.update { it.copy(isSaving = false, saved = true) }
            } catch (e: ApiException) {
                _uiState.update { it.copy(isSaving = false, error = e.message) }
            } catch (e: Exception) {
                _uiState.update { it.copy(isSaving = false, error = "Couldn't save this expense. Try again.") }
            }
        }
    }
}
