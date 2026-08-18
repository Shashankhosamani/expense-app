package com.costiq.app.ui.screens.smsonboarding

import android.Manifest
import android.os.Build
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.costiq.app.ui.components.iconFor
import com.costiq.app.ui.theme.CostiqTheme
import com.costiq.app.ui.theme.DangerBg
import com.costiq.app.ui.theme.DangerBorder
import com.costiq.app.ui.theme.Ink
import com.costiq.app.ui.theme.Paper
import com.costiq.app.ui.theme.TextBody
import com.costiq.app.ui.theme.Vermilion

private data class PermissionPoint(val icon: String, val color: androidx.compose.ui.graphics.Color, val title: String, val sub: String)

// Copy ported verbatim from the design's `permissionPoints` / `discardExamples` fixtures.
private fun points(success: androidx.compose.ui.graphics.Color, muted: androidx.compose.ui.graphics.Color) = listOf(
    PermissionPoint("shield-check", success, "One-time codes are dropped here", "Anything with an OTP or verification code is deleted on the spot and never uploaded."),
    PermissionPoint("lock", success, "Only bank senders get through", "Messages from your contacts are ignored, always."),
    PermissionPoint("eye-off", muted, "Nothing readable is stored", "What is uploaded is locked before it leaves and only opened to read the amount."),
    PermissionPoint("trash-2", muted, "You can turn this off anytime", "Existing expenses stay; new messages stop being read."),
)

private val discardExamples = listOf(
    "Your OTP for login is 4521. Do not share.",
    "Flat 40% off this weekend at …",
    "Amma: reached home?",
)

@Composable
fun SmsPermissionScreen(onDone: () -> Unit) {
    val viewModel: SmsPermissionViewModel = hiltViewModel()

    val permissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestMultiplePermissions(),
    ) {
        // Granted or denied, onboarding is considered "seen" either way — a
        // denial just means SMS capture won't run; manual entry still works.
        viewModel.acknowledge()
        onDone()
    }

    Column(Modifier.fillMaxSize().background(Paper).safeDrawingPadding()) {
        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(22.dp),
            verticalArrangement = Arrangement.spacedBy(24.dp),
        ) {
            Box(
                modifier = Modifier
                    .size(50.dp)
                    .clip(RoundedCornerShape(13.dp))
                    .background(DangerBg)
                    .border(1.dp, DangerBorder, RoundedCornerShape(13.dp)),
                contentAlignment = Alignment.Center,
            ) {
                Icon(iconFor("message-square-lock"), contentDescription = null, tint = Vermilion, modifier = Modifier.size(25.dp))
            }

            Column {
                Text(
                    "Let Costiq read your bank messages",
                    style = MaterialTheme.typography.headlineSmall.copy(fontSize = 26.sp),
                    color = Ink,
                )
                Spacer(Modifier.height(10.dp))
                Text(
                    "It looks for messages about money and ignores the rest. That sorting happens here on your phone, before anything is sent anywhere.",
                    style = MaterialTheme.typography.bodyLarge,
                    color = CostiqTheme.extendedColors.textMuted,
                )
            }

            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                points(CostiqTheme.extendedColors.success, CostiqTheme.extendedColors.textMuted).forEach { point ->
                    Row {
                        Icon(iconFor(point.icon), contentDescription = null, tint = point.color, modifier = Modifier.size(17.dp))
                        Spacer(Modifier.width(13.dp))
                        Column {
                            Text(point.title, style = MaterialTheme.typography.titleSmall, color = Ink)
                            Text(point.sub, style = MaterialTheme.typography.bodySmall, color = CostiqTheme.extendedColors.textMuted)
                        }
                    }
                }
            }

            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(CostiqTheme.extendedColors.card)
                    .border(1.dp, CostiqTheme.extendedColors.borderMedium, RoundedCornerShape(12.dp))
                    .padding(17.dp),
                verticalArrangement = Arrangement.spacedBy(11.dp),
            ) {
                Text(
                    "NEVER LEAVES THIS PHONE",
                    style = MaterialTheme.typography.labelSmall,
                    color = CostiqTheme.extendedColors.textMuted,
                )
                discardExamples.forEach { example ->
                    Row {
                        Icon(iconFor("x"), contentDescription = null, tint = CostiqTheme.extendedColors.danger, modifier = Modifier.size(13.dp))
                        Spacer(Modifier.width(9.dp))
                        Text(example, style = MaterialTheme.typography.bodySmall, color = CostiqTheme.extendedColors.textMuted)
                    }
                }
            }
        }

        Box(Modifier.fillMaxWidth().height(1.dp).background(CostiqTheme.extendedColors.borderHairline))
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(22.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            Button(
                onClick = {
                    val permissions = mutableListOf(Manifest.permission.RECEIVE_SMS, Manifest.permission.READ_SMS)
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                        permissions += Manifest.permission.POST_NOTIFICATIONS
                    }
                    permissionLauncher.launch(permissions.toTypedArray())
                },
                modifier = Modifier.fillMaxWidth().height(50.dp),
                shape = RoundedCornerShape(8.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Vermilion, contentColor = Color.White),
            ) {
                Text("Allow", style = MaterialTheme.typography.labelLarge)
            }
            TextButton(
                onClick = { viewModel.acknowledge(); onDone() },
                modifier = Modifier.fillMaxWidth().height(50.dp),
            ) {
                Text("I will add expenses myself", style = MaterialTheme.typography.bodyMedium, color = TextBody)
            }
        }
    }
}
