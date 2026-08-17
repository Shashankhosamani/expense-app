"use client";

import { useState } from "react";
import { EyeOff } from "lucide-react";
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
    <div className="flex flex-col gap-5.5">
      <h1 className="text-[1.5rem] md:text-[1.875rem] font-medium tracking-tight">Settings</h1>

      <div className="flex flex-col lg:flex-row gap-5.5 items-start">
        <div className="flex-[1.15] w-full flex flex-col gap-5.5">
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

        <div className="flex-1 w-full flex flex-col gap-5.5">
          <KeyScopesList />

          <div className="bg-warn-tint border border-[#FFD9AC] rounded-xl p-5.5 flex flex-col gap-2.5">
            <div className="flex items-center gap-2.5">
              <EyeOff size={17} className="text-[#A9670A]" />
              <span className="text-[0.9375rem] font-medium text-ink">Only on the web</span>
            </div>
            <span className="text-xs leading-5 text-[#7A5A14]">
              This is the one screen that shows a key in full, and you will touch it maybe once a month. On a
              phone, that is a screenshot waiting to happen for no real gain.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
