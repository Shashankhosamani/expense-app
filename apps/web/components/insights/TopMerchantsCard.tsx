import type { MonthlySummary } from "@costiq/shared";
import { formatINR } from "@/lib/format";

export function TopMerchantsCard({ merchants }: { merchants: MonthlySummary["top_merchants"] }) {
  return (
    <div className="bg-surface-raised border border-border rounded-xl p-6.5 flex flex-col gap-4">
      <span className="text-xl font-medium">Most spent at</span>
      {merchants.map((m, i) => (
        <div key={m.merchant} className="flex items-center gap-3.5 pb-2.5 border-b border-border-3">
          <span className="w-4.5 text-xs text-ink-4">{i + 1}</span>
          <span className="flex-1 text-[0.8125rem]">{m.merchant}</span>
          <span className="w-23 text-right text-[0.8125rem] font-medium tabular-nums">{formatINR(m.amount)}</span>
        </div>
      ))}
    </div>
  );
}
