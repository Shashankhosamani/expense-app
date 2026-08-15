import type { InsightsResponse } from "@costiq/shared";
import { formatINR } from "@/lib/format";

export function MonthlyBarChart({ months }: { months: InsightsResponse["months"] }) {
  const maxSpent = Math.max(1, ...months.map((m) => m.total_spent));

  return (
    <div className="bg-surface-raised border border-border rounded-xl p-6.5 flex flex-col gap-5">
      <span className="text-xl font-medium">Month by month</span>
      <div className="flex items-end gap-4 sm:gap-6.5 h-52.5 pt-2.5 overflow-x-auto">
        {months.map((m) => (
          <div
            key={m.month}
            className="flex-1 min-w-14 shrink-0 flex flex-col items-center gap-2.5 h-full justify-end"
          >
            <span className="text-[0.8125rem] font-medium tabular-nums text-ink-2 whitespace-nowrap">
              {formatINR(m.total_spent)}
            </span>
            <div
              className="w-full rounded-t-md bg-brand"
              style={{ height: `${Math.max(4, (m.total_spent / maxSpent) * 160)}px` }}
            />
            <span className="text-xs text-ink-3">{m.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
