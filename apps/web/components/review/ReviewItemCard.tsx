import { ShieldAlert, ChevronDown, ChevronUp } from "lucide-react";
import type { ReviewItem } from "@costiq/shared";
import { Button } from "@/components/ui/Button";
import { formatDateTime, formatINR } from "@/lib/format";

interface ReviewItemCardProps {
  item: ReviewItem;
  expanded: boolean;
  busy: boolean;
  onToggle: () => void;
  onApprove: () => void;
  onDismiss: () => void;
}

export function ReviewItemCard({ item, expanded, busy, onToggle, onApprove, onDismiss }: ReviewItemCardProps) {
  return (
    <div className="bg-surface-raised border border-brand-tint-border rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3.5 px-5.5 py-4.5 bg-[#FEF0EB] border-b border-brand-tint-border cursor-pointer text-left"
      >
        <ShieldAlert size={20} className="text-brand-dark shrink-0" />
        <span className="flex-1 flex flex-col gap-1 min-w-0">
          <span className="flex items-center gap-2.5 flex-wrap">
            <span className="text-lg font-medium">
              {item.sender}
              {item.extracted?.amount ? ` · ${formatINR(item.extracted.amount)} out` : ""}
            </span>
            {item.suspicious && (
              <span className="text-[0.625rem] font-semibold tracking-wider text-brand-dark bg-brand-tint border border-brand-tint-border rounded-full px-2 py-1">
                SUSPICIOUS
              </span>
            )}
          </span>
          <span className="text-[0.6875rem] text-ink-4">
            sender {item.sender} · arrived {formatDateTime(item.received_at)}
          </span>
        </span>
        {expanded ? <ChevronUp size={18} className="text-ink-3" /> : <ChevronDown size={18} className="text-ink-3" />}
      </button>

      {expanded && (
        <>
          <div className="p-5.5 flex flex-col md:flex-row gap-6">
            <div className="flex-[1.1] flex flex-col gap-3.5">
              <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-ink-4">
                The message, as it arrived
              </span>
              <div className="bg-navy-2 rounded-[0.625rem] p-4.5 text-xs leading-[1.375rem] text-[#C6DDE6] whitespace-pre-wrap break-words">
                {item.raw_message}
              </div>
              <div className="flex flex-col gap-2.5">
                <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-ink-4">Why it is here</span>
                {item.hold_reasons.map((r) => (
                  <div key={r} className="flex items-start gap-2.5">
                    <span className="w-1 h-1 rounded-full bg-brand-dark mt-2 shrink-0" />
                    <span className="text-xs leading-5 text-ink-2">{r}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-3.5">
              <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-ink-4">
                What was read from it
              </span>
              <div className="flex flex-col">
                {item.extracted &&
                  Object.entries(item.extracted).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-3.5 py-2.5 border-b border-border-3">
                      <span className="w-30 text-[0.6875rem] text-ink-4">{k.replace(/_/g, " ")}</span>
                      <span className="flex-1 text-xs font-medium tabular-nums">{v === null ? "—" : String(v)}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="px-5.5 py-4 border-t border-border-3 bg-[#F2FAFC] flex flex-col sm:flex-row sm:items-center gap-2.5">
            <Button
              variant="primary"
              className="order-1 w-full sm:w-auto sm:order-3"
              disabled={busy || !item.extracted?.amount}
              onClick={onApprove}
            >
              {busy ? "Working…" : "Approve"}
            </Button>
            <Button variant="outline" className="order-2 w-full sm:w-auto" disabled={busy} onClick={onDismiss}>
              Not an expense
            </Button>
            <span className="order-3 sm:order-1 sm:flex-1 text-xs text-ink-3 text-center sm:text-left">
              Approving adds one expense with exactly the fields above. Nothing else from the message is kept.
            </span>
          </div>
        </>
      )}
    </div>
  );
}
