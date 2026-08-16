package com.costiq.app.ui.screens.signin

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.composed
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.costiq.app.ui.components.BrandMark
import com.costiq.app.ui.components.iconFor
import com.costiq.app.ui.theme.DarkAccentMuted
import com.costiq.app.ui.theme.DarkInputBg
import com.costiq.app.ui.theme.DarkInputBorder
import com.costiq.app.ui.theme.DarkSuccessBg
import com.costiq.app.ui.theme.DarkSuccessBorder
import com.costiq.app.ui.theme.DarkSuccessFg
import com.costiq.app.ui.theme.DarkSuccessMuted
import com.costiq.app.ui.theme.DarkTextMuted
import com.costiq.app.ui.theme.Ink
import com.costiq.app.ui.theme.Vermilion

@Composable
fun SignInScreen(onSignedIn: () -> Unit) {
    val viewModel: SignInViewModel = hiltViewModel()
    val state by viewModel.uiState.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Ink)
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 24.dp, vertical = 36.dp),
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            BrandMark(size = 30.dp)
            Spacer(Modifier.width(11.dp))
            Text("Costiq", style = MaterialTheme.typography.titleLarge, color = Color.White)
        }

        Spacer(Modifier.height(56.dp))

        Text("Welcome back", style = MaterialTheme.typography.headlineSmall, color = Color.White)
        Spacer(Modifier.height(8.dp))
        Text(
            "Sign in with the account paired to this phone.",
            style = MaterialTheme.typography.bodyLarge,
            color = DarkTextMuted,
        )

        Spacer(Modifier.height(28.dp))

        DarkField(
            label = "Email",
            value = state.email,
            onValueChange = viewModel::onEmailChange,
            iconName = "mail",
            keyboardType = KeyboardType.Email,
        )
        Spacer(Modifier.height(14.dp))
        DarkField(
            label = "Password",
            value = state.password,
            onValueChange = viewModel::onPasswordChange,
            iconName = "lock",
            keyboardType = KeyboardType.Password,
            focused = true,
            visualTransformation = if (state.passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
            trailingIconName = if (state.passwordVisible) "eye-off" else "eye",
            onTrailingIconClick = viewModel::onTogglePasswordVisibility,
        )

        Row(
            modifier = Modifier.fillMaxWidth().padding(top = 14.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    Modifier
                        .size(16.dp)
                        .clip(RoundedCornerShape(4.dp))
                        .background(Color.White)
                        .noRippleClickable(viewModel::onToggleStaySignedIn),
                    contentAlignment = Alignment.Center,
                ) {
                    if (state.staySignedIn) {
                        Icon(Icons.Filled.Check, contentDescription = null, tint = Ink, modifier = Modifier.size(11.dp))
                    }
                }
                Spacer(Modifier.width(9.dp))
                Text(
                    "Stay signed in",
                    style = MaterialTheme.typography.bodyMedium,
                    color = Color(0xFFB9CCD3),
                    modifier = Modifier.noRippleClickable(viewModel::onToggleStaySignedIn),
                )
            }
            Text("Forgot?", style = MaterialTheme.typography.bodyMedium, color = DarkAccentMuted)
        }

        Spacer(Modifier.height(20.dp))

        if (state.error != null) {
            Text(state.error!!, color = DarkAccentMuted, style = MaterialTheme.typography.bodySmall)
            Spacer(Modifier.height(10.dp))
        }

        Button(
            onClick = viewModel::signIn,
            enabled = !state.isLoading,
            modifier = Modifier.fillMaxWidth().height(50.dp),
            shape = RoundedCornerShape(8.dp),
            colors = ButtonDefaults.buttonColors(containerColor = Vermilion, contentColor = Color.White),
        ) {
            Text(if (state.isLoading) "Signing in…" else "Sign In", style = MaterialTheme.typography.labelLarge)
        }

        Spacer(Modifier.height(24.dp))

        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(8.dp))
                .background(DarkSuccessBg)
                .border(1.dp, DarkSuccessBorder, RoundedCornerShape(8.dp))
                .padding(12.dp),
        ) {
            Icon(iconFor("smartphone"), contentDescription = null, tint = DarkSuccessFg, modifier = Modifier.size(15.dp))
            Spacer(Modifier.width(10.dp))
            Text(
                // Adjusted from the design's literal copy ("pairs with a
                // device key") — that mechanism is part of ARCHITECTURE_2.md
                // §15 but not yet built; today this account's session token
                // is what's used, same as the web dashboard.
                "Signing in here uses your Costiq account, kept separate from any token Claude uses to read your data.",
                style = MaterialTheme.typography.bodySmall,
                color = DarkSuccessMuted,
            )
        }
    }
}

@Composable
private fun DarkField(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    iconName: String,
    keyboardType: KeyboardType,
    modifier: Modifier = Modifier,
    focused: Boolean = false,
    visualTransformation: VisualTransformation = VisualTransformation.None,
    trailingIconName: String? = null,
    onTrailingIconClick: (() -> Unit)? = null,
) {
    Column(modifier) {
        Text(label.uppercase(), style = MaterialTheme.typography.labelSmall, color = DarkTextMuted)
        Spacer(Modifier.height(6.dp))
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(8.dp))
                .background(DarkInputBg)
                .border(1.dp, if (focused) Vermilion else DarkInputBorder, RoundedCornerShape(8.dp))
                .padding(horizontal = 14.dp, vertical = 13.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Icon(iconFor(iconName), contentDescription = null, tint = DarkTextMuted, modifier = Modifier.size(17.dp))
            Spacer(Modifier.width(10.dp))
            Box(Modifier.weight(1f)) {
                BasicTextField(
                    value = value,
                    onValueChange = onValueChange,
                    singleLine = true,
                    textStyle = MaterialTheme.typography.bodyLarge.copy(color = Color.White),
                    visualTransformation = visualTransformation,
                    keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
                    cursorBrush = SolidColor(Vermilion),
                )
            }
            if (trailingIconName != null) {
                Icon(
                    iconFor(trailingIconName),
                    contentDescription = null,
                    tint = DarkTextMuted,
                    modifier = Modifier
                        .size(17.dp)
                        .noRippleClickable { onTrailingIconClick?.invoke() },
                )
            }
        }
    }
}

private fun Modifier.noRippleClickable(onClick: () -> Unit): Modifier = composed {
    clickable(
        indication = null,
        interactionSource = remember { MutableInteractionSource() },
        onClick = onClick,
    )
}
