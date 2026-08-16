package com.costiq.app.ui.components

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.TrendingDown
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.ChevronLeft
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material.icons.filled.NotificationsActive
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material.icons.outlined.AutoAwesome
import androidx.compose.material.icons.outlined.BarChart
import androidx.compose.material.icons.outlined.ChatBubbleOutline
import androidx.compose.material.icons.outlined.Circle
import androidx.compose.material.icons.outlined.Dashboard
import androidx.compose.material.icons.outlined.Delete
import androidx.compose.material.icons.outlined.DirectionsCar
import androidx.compose.material.icons.outlined.Download
import androidx.compose.material.icons.outlined.Email
import androidx.compose.material.icons.outlined.HelpOutline
import androidx.compose.material.icons.outlined.Lock
import androidx.compose.material.icons.outlined.MonitorHeart
import androidx.compose.material.icons.outlined.Movie
import androidx.compose.material.icons.outlined.Notifications
import androidx.compose.material.icons.outlined.PersonOff
import androidx.compose.material.icons.outlined.RadioButtonUnchecked
import androidx.compose.material.icons.outlined.Receipt
import androidx.compose.material.icons.outlined.ReceiptLong
import androidx.compose.material.icons.outlined.ReportProblem
import androidx.compose.material.icons.outlined.Restaurant
import androidx.compose.material.icons.outlined.Schedule
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material.icons.outlined.ShoppingCart
import androidx.compose.material.icons.outlined.Smartphone
import androidx.compose.material.icons.outlined.Storefront
import androidx.compose.material.icons.outlined.Tv
import androidx.compose.material.icons.outlined.VerifiedUser
import androidx.compose.material.icons.outlined.ViewAgenda
import androidx.compose.material.icons.outlined.Visibility
import androidx.compose.material.icons.outlined.VisibilityOff
import androidx.compose.ui.graphics.vector.ImageVector

/**
 * Maps the design's Lucide icon names (data-driven — category icons, KPI
 * icons, review-row icons; see Kharcha Screens.dc.html's `data-lucide="…"`
 * attributes and apps/web/lib/icon.ts's equivalent pascal-case lookup for
 * lucide-react) onto the closest androidx.compose.material:material-icons-extended
 * equivalent. Not every name below is guaranteed present in every extended-icons
 * release — if one fails to resolve, swap it for the nearest match in
 * Icons.Outlined/Filled from the actually-resolved dependency version.
 */
fun iconFor(lucideName: String): ImageVector = when (lucideName) {
    "mail" -> Icons.Outlined.Email
    "lock" -> Icons.Outlined.Lock
    "eye" -> Icons.Outlined.Visibility
    "eye-off" -> Icons.Outlined.VisibilityOff
    "check" -> Icons.Filled.Check
    "smartphone" -> Icons.Outlined.Smartphone
    "search" -> Icons.Outlined.Search
    "plus" -> Icons.Filled.Add
    "x" -> Icons.Filled.Close
    "chevron-left" -> Icons.Filled.ChevronLeft
    "chevron-right" -> Icons.Filled.ChevronRight
    "chevron-up" -> Icons.Filled.KeyboardArrowUp
    "chevron-down" -> Icons.Filled.KeyboardArrowDown
    "shield-alert" -> Icons.Outlined.ReportProblem
    "shield-check" -> Icons.Outlined.VerifiedUser
    "trending-down" -> Icons.AutoMirrored.Filled.TrendingDown
    "download" -> Icons.Outlined.Download
    "sliders-horizontal" -> Icons.Filled.Tune
    "arrow-left" -> Icons.AutoMirrored.Filled.ArrowBack
    "calendar-clock" -> Icons.Outlined.Schedule
    "store" -> Icons.Outlined.Storefront
    "bell" -> Icons.Outlined.Notifications
    "bell-ring" -> Icons.Filled.NotificationsActive
    "message-square" -> Icons.Outlined.ChatBubbleOutline
    "message-square-lock" -> Icons.Outlined.Lock
    "sparkles" -> Icons.Outlined.AutoAwesome
    "circle-help" -> Icons.Outlined.HelpOutline
    "user-x" -> Icons.Outlined.PersonOff
    "refresh-cw" -> Icons.Filled.Refresh
    "layout-dashboard" -> Icons.Outlined.Dashboard
    "receipt-text" -> Icons.Outlined.ReceiptLong
    "chart-column" -> Icons.Outlined.BarChart
    "layout-panel-top" -> Icons.Outlined.ViewAgenda
    "trash-2" -> Icons.Outlined.Delete
    "utensils" -> Icons.Outlined.Restaurant
    "shopping-cart" -> Icons.Outlined.ShoppingCart
    "car" -> Icons.Outlined.DirectionsCar
    "receipt" -> Icons.Outlined.Receipt
    "tv" -> Icons.Outlined.Tv
    "clapperboard" -> Icons.Outlined.Movie
    "heart-pulse" -> Icons.Outlined.MonitorHeart
    "circle-dashed" -> Icons.Outlined.RadioButtonUnchecked
    else -> Icons.Outlined.Circle
}
