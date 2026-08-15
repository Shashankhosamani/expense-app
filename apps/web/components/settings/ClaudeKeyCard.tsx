import { KeyRound, Eye, Copy, Ban, RefreshCw } from "lucide-react";
import type { McpTokenStatus } from "@costiq/shared";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/format";

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-ink-4">{label}</span>
      <span className="text-[0.8125rem] text-ink">{value}</span>
    </div>
  );
}

interface ClaudeKeyCardProps {
  status: McpTokenStatus | null;
  rawToken: string | null;
  visible: boolean;
  busy: boolean;
  onToggleVisible: () => void;
  onIssue: () => void;
  onRevoke: () => void;
}

export function ClaudeKeyCard({ status, rawToken, visible, busy, onToggleVisible, onIssue, onRevoke }: ClaudeKeyCardProps) {
  const displayToken = rawToken ?? (status?.active ? "kh_live_••••••••••••••••••••••••" : null);

  return (
    <div className="bg-surface-raised border border-border rounded-xl p-6.5 flex flex-col gap-5.5">
      <div className="flex items-start gap-4">
        <div className="flex-1 flex flex-col gap-1.5">
          <span className="text-xl font-medium">Your Claude key</span>
          <span className="text-[0.8125rem] leading-5 text-ink-3 max-w-[27.5rem]">
            One key per account. Claude uses it to read your waiting messages and save the expenses it finds —
            nothing outside your own account.
          </span>
        </div>
        <span
          className={`text-[0.625rem] font-semibold tracking-wider rounded-full px-2.5 py-1.5 border ${
            status?.active ? "text-success bg-success-tint-2 border-success-tint" : "text-ink-3 bg-border/30 border-border"
          }`}
        >
          {status?.active ? "ACTIVE" : "NOT SET"}
        </span>
      </div>

      {displayToken ? (
        <div className="flex items-center gap-2.5 bg-navy-2 rounded-lg px-3.5 py-3.5">
          <KeyRound size={17} className="text-[#7B96A1]" />
          <span className="flex-1 text-[0.8125rem] text-surface tracking-wide font-mono">
            {visible || rawToken ? displayToken : "kh_live_•••••••••••••••••••••••••••••"}
          </span>
          {rawToken && (
            <button onClick={onToggleVisible} className="text-[#7B96A1] cursor-pointer">
              <Eye size={16} />
            </button>
          )}
          <button
            onClick={() => displayToken && navigator.clipboard.writeText(displayToken)}
            className="text-brand cursor-pointer"
          >
            <Copy size={16} />
          </button>
        </div>
      ) : (
        <div className="text-sm text-ink-3">No key issued yet.</div>
      )}

      {status && (
        <div className="flex gap-10 flex-wrap">
          <Meta label="Issued" value={status.issued_at ? formatDateTime(status.issued_at) : "—"} />
          <Meta label="Last used" value={status.last_used_at ? formatDateTime(status.last_used_at) : "Never"} />
          <Meta label="Status" value={status.active ? "Active" : status.revoked_at ? "Revoked" : "Not set"} />
        </div>
      )}

      <div className="border-t border-dashed border-border-2 pt-5 flex items-center gap-3">
        <span className="flex-1 text-xs text-ink-3">Making a new key switches the old one off straight away.</span>
        <Button variant="danger" disabled={busy || !status?.active} onClick={onRevoke}>
          <Ban size={15} />
          Turn Off
        </Button>
        <Button variant="primary" disabled={busy} onClick={onIssue}>
          <RefreshCw size={15} />
          New Key
        </Button>
      </div>
    </div>
  );
}
