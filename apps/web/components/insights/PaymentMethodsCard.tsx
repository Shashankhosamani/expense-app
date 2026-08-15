import type { MonthlySummary } from "@costiq/shared";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function PaymentMethodsCard({ methods }: { methods: MonthlySummary["payment_methods"] }) {
  return (
    <div className="bg-surface-raised border border-border rounded-xl p-6.5 flex flex-col gap-4">
      <span className="text-xl font-medium">How you paid</span>
      {methods.map((m) => (
        <div key={m.method} className="flex items-center gap-3.5">
          <span className="w-19.5 text-[0.8125rem] text-ink-2 capitalize">{m.method}</span>
          <ProgressBar percent={m.percent} height={8} trackClassName="flex-1" color="var(--color-brand)" />
          <span className="w-10 text-right text-xs text-ink-4">{m.percent}%</span>
        </div>
      ))}
    </div>
  );
}
