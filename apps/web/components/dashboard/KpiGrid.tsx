import type { MonthlySummary } from "@costiq/shared";
import { Kpi } from "@/components/dashboard/Kpi";
import { formatINR } from "@/lib/format";

export function KpiGrid({ summary }: { summary: MonthlySummary | null }) {
  const topCategory = summary?.category_breakdown[0] ?? null;

  return (
    <div className="flex-1 grid grid-cols-2 gap-5">
      <Kpi label="Expenses" value={String(summary?.expense_count ?? 0)} icon="Receipt" color="var(--color-brand)" sub="this month" />
      <Kpi
        label="Messages captured"
        value={String(summary?.messages_captured ?? 0)}
        icon="MessageSquare"
        color="var(--color-ink-3)"
        sub="SMS this month"
      />
      <Kpi
        label="Not transactions"
        value={String(summary?.not_transactions ?? 0)}
        icon="ShieldCheck"
        color="var(--color-success)"
        sub="correctly ignored"
      />
      <Kpi
        label="Top category"
        value={topCategory?.category_name ?? "—"}
        icon="PieChart"
        color="var(--color-warn)"
        sub={topCategory ? formatINR(topCategory.amount) : ""}
      />
    </div>
  );
}
