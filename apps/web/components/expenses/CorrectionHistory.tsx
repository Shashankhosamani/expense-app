import { PencilLine } from "lucide-react";
import type { TransactionCorrection } from "@costiq/shared";
import { formatDateTime } from "@/lib/format";

export function CorrectionHistory({ corrections }: { corrections: TransactionCorrection[] }) {
  if (corrections.length === 0) return null;

  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-4">Changes you have made</span>
      {corrections.map((c) => (
        <div key={c.id} className="flex items-start gap-3 bg-surface border border-border rounded-lg p-3.5">
          <PencilLine size={15} className="text-ink-4 mt-0.5" />
          <span className="flex-1 flex flex-col gap-0.5">
            <span className="text-xs text-ink">{c.field_name}</span>
            <span className="text-[11px] text-ink-3">
              {c.old_value ?? "—"} → {c.new_value ?? "—"}
            </span>
          </span>
          <span className="text-[11px] text-ink-4">{formatDateTime(c.corrected_at)}</span>
        </div>
      ))}
      <p className="text-xs leading-5 text-ink-3 pt-1 border-t border-dashed border-border-2">
        Every change is kept as its own entry, so what the bank originally said is never painted over.
      </p>
    </div>
  );
}
