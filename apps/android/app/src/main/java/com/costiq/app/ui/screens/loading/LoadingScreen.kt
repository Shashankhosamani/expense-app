package com.costiq.app.ui.screens.loading

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.costiq.app.ui.components.BrandMark
import com.costiq.app.ui.theme.DarkTextMuted
import com.costiq.app.ui.theme.Ink

/**
 * Shown while [com.costiq.app.ui.nav.RootViewModel] resolves the initial
 * session (RootStartDestination.LOADING) — same Ink background and BrandMark
 * as the native android:windowSplashScreenBackground/-AnimatedIcon in
 * themes.xml, so there's no visible seam when the OS splash hands off to
 * Compose, and the transition still reads as "loading" if auth resolution
 * takes longer than the OS splash stays up.
 */
@Composable
fun LoadingScreen() {
    Box(
        modifier = Modifier.fillMaxSize().background(Ink),
        contentAlignment = Alignment.Center,
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            BrandMark(size = 56.dp)
            Spacer(Modifier.height(24.dp))
            CircularProgressIndicator(
                modifier = Modifier.size(20.dp),
                color = DarkTextMuted,
                strokeWidth = 2.dp,
            )
        }
    }
}
