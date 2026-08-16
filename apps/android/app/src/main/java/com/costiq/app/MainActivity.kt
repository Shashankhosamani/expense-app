package com.costiq.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import com.costiq.app.ui.nav.CostiqApp
import com.costiq.app.ui.nav.RootStartDestination
import com.costiq.app.ui.nav.RootViewModel
import com.costiq.app.ui.theme.CostiqAppTheme
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    private val rootViewModel: RootViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        val splashScreen = installSplashScreen()
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        splashScreen.setKeepOnScreenCondition {
            rootViewModel.startDestination.value == RootStartDestination.LOADING
        }

        setContent {
            CostiqAppTheme {
                CostiqApp()
            }
        }
    }
}
