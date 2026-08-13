"use client";

import { useState } from "react";
import { useMcpToken } from "@/hooks/useMcpToken";
import { ClaudeKeyCard } from "@/components/settings/ClaudeKeyCard";
import { ConnectSnippet } from "@/components/settings/ConnectSnippet";
import { KeyScopesList } from "@/components/settings/KeyScopesList";

export default function SettingsPage() {
  const { status, issue, revoke } = useMcpToken();
  const [rawToken, setRawToken] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleIssue() {
    setBusy(true);
    try {
      const result = await issue();
      setRawToken(result.token);
      setVisible(true);
    } finally {
      setBusy(false);
    }
  }

  async function handleRevoke() {
    if (!confirm("Turn off the current key? Claude will lose access immediately.")) return;
    setBusy(true);
    try {
      await revoke();
      setRawToken(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-5.5 items-start max-w-[1100px]">
      <div className="flex-[1.15] flex flex-col gap-5.5 w-full">
        <h1 className="text-[30px] font-medium tracking-tight">Settings</h1>
        <ClaudeKeyCard
          status={status}
          rawToken={rawToken}
          visible={visible}
          busy={busy}
          onToggleVisible={() => setVisible((v) => !v)}
          onIssue={handleIssue}
          onRevoke={handleRevoke}
        />
        <ConnectSnippet rawToken={rawToken} />
      </div>

      <div className="flex-1 w-full pt-0 lg:pt-19">
        <KeyScopesList />
      </div>
    </div>
  );
}
