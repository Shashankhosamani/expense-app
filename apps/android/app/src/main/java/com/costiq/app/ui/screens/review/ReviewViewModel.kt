package com.costiq.app.ui.screens.review

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.costiq.app.data.api.ApiException
import com.costiq.app.data.api.dto.Category
import com.costiq.app.data.api.dto.ReviewItem
import com.costiq.app.data.repo.CategoryRepository
import com.costiq.app.data.repo.ReviewRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class ReviewUiState(
    val isLoading: Boolean = true,
    val error: String? = null,
    val items: List<ReviewItem> = emptyList(),
    val categories: List<Category> = emptyList(),
    val expandedId: String? = null,
    val selectedCategoryByItem: Map<String, String> = emptyMap(), // itemId -> categoryId
    val actionInProgressId: String? = null,
    val actionError: String? = null,
)

@HiltViewModel
class ReviewViewModel @Inject constructor(
    private val reviewRepo: ReviewRepository,
    private val categoryRepo: CategoryRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(ReviewUiState())
    val uiState: StateFlow<ReviewUiState> = _uiState.asStateFlow()

    init {
        load()
    }

    fun load() {
        _uiState.update { it.copy(isLoading = true, error = null) }
        viewModelScope.launch {
            try {
                val review = reviewRepo.list(page = 1, limit = 50)
                val categories = runCatching { categoryRepo.list() }.getOrDefault(emptyList())
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        items = review.items,
                        categories = categories,
                        // First suspicious item starts expanded, matching the design's default state.
                        expandedId = review.items.firstOrNull { i -> i.suspicious }?.id ?: review.items.firstOrNull()?.id,
                    )
                }
            } catch (e: ApiException) {
                _uiState.update { it.copy(isLoading = false, error = e.message) }
            } catch (e: Exception) {
                _uiState.update { it.copy(isLoading = false, error = "Couldn't load the review queue.") }
            }
        }
    }

    fun toggleExpand(id: String) {
        _uiState.update { it.copy(expandedId = if (it.expandedId == id) null else id) }
    }

    fun selectCategory(itemId: String, categoryId: String) {
        _uiState.update { it.copy(selectedCategoryByItem = it.selectedCategoryByItem + (itemId to categoryId)) }
    }

    fun approve(item: ReviewItem) {
        val categoryId = _uiState.value.selectedCategoryByItem[item.id]
        _uiState.update { it.copy(actionInProgressId = item.id, actionError = null) }
        viewModelScope.launch {
            try {
                reviewRepo.approve(item.id, categoryId)
                removeItem(item.id)
            } catch (e: ApiException) {
                val message = if (e.code == "cannot_approve_incomplete_extraction") {
                    "Some required fields (amount or type) couldn't be read from this message — it can't be approved as-is."
                } else {
                    e.message
                }
                _uiState.update { it.copy(actionInProgressId = null, actionError = message) }
            } catch (e: Exception) {
                _uiState.update { it.copy(actionInProgressId = null, actionError = "Couldn't approve this message.") }
            }
        }
    }

    fun dismiss(item: ReviewItem) {
        _uiState.update { it.copy(actionInProgressId = item.id, actionError = null) }
        viewModelScope.launch {
            try {
                reviewRepo.dismiss(item.id)
                removeItem(item.id)
            } catch (e: ApiException) {
                _uiState.update { it.copy(actionInProgressId = null, actionError = e.message) }
            } catch (e: Exception) {
                _uiState.update { it.copy(actionInProgressId = null, actionError = "Couldn't dismiss this message.") }
            }
        }
    }

    private fun removeItem(id: String) {
        _uiState.update { state ->
            val remaining = state.items.filterNot { it.id == id }
            state.copy(
                items = remaining,
                actionInProgressId = null,
                expandedId = if (state.expandedId == id) remaining.firstOrNull()?.id else state.expandedId,
            )
        }
    }
}
