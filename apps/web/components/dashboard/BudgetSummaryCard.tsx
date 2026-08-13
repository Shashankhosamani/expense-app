import Link from "next/link";
import { TrendingDown, TrendingUp } from "lucide-react";
import type { BudgetStatus, MonthlySummary } from "@costiq/shared";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Stat } from "@/components/dashboard/Stat";
import { formatINR } from "@/lib/format";

export function BudgetSummaryCard({ summary, budget }: { summary: MonthlySummary | null; budget: BudgetStatus | null }) {
  const vsLastMonth = summary?.vs_last_month_percent ?? null;

  return (
    <Card className="flex-[1.4] p-6.5 flex flex-col gap-5.5">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-3">Spent so far</span>
          <div className="flex items-end gap-2.5">
            <span className="text-[46px] font-medium tracking-tight tabular-nums">
              {summary ? formatINR(summary.total_spent) : "—"}
            </span>
            {budget && <span className="text-base text-ink-4 pb-1">of {formatINR(budget.limit_amount)}</span>}
          </div>
        </div>
        {vsLastMonth !== null && (
          <span
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs font-medium ${
              vsLastMonth <= 0
                ? "bg-success-tint-2 border-success-tint text-success"
                : "bg-brand-tint border-brand-tint-border text-brand-dark"
            }`}
          >
            {vsLastMonth <= 0 ? <TrendingDown size={13} /> : <TrendingUp size={13} />}
            {Math.abs(vsLastMonth)}% {vsLastMonth <= 0 ? "under" : "over"} last month
          </span>
        )}
      </div>

      {budget ? (
        <div className="flex flex-col gap-2">
          <ProgressBar percent={budget.percent_used} markerPercent={budget.warning_percentage} height={14} />
          <div className="flex items-center justify-between text-xs text-ink-3">
            <span>
              {budget.percent_used}% used · {budget.days_left_in_month} days left in the month
            </span>
            <span>
              alert at {budget.warning_percentage}% · {formatINR((budget.limit_amount * budget.warning_percentage) / 100)}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-sm text-ink-3">
          No budget set yet.{" "}
          <Link href="/budget" className="text-brand font-semibold">
            Set one
          </Link>
          .
        </div>
      )}

      {budget && (
        <div className="border-t border-dashed border-border-2 pt-4.5 flex gap-9">
          <Stat
            label="Remaining"
            value={formatINR(budget.remaining)}
            color={budget.remaining < 0 ? "var(--color-brand)" : "var(--color-ink)"}
          />
          <Stat label="Safe / day" value={formatINR(budget.safe_daily_spend)} color="var(--color-ink)" />
          <Stat label="Days left" value={String(budget.days_left_in_month)} color="var(--color-ink)" />
        </div>
      )}
    </Card>
  );
}
