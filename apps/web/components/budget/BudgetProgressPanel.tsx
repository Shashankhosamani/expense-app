import type { BudgetStatus } from "@costiq/shared";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatINR } from "@/lib/format";

export function BudgetProgressPanel({ status }: { status: BudgetStatus | null }) {
  const monthLabel = new Date().toLocaleDateString("en-IN", { month: "long" });

  return (
    <div className="bg-navy rounded-xl p-6.5 flex flex-col gap-5">
      <span className="text-xl font-medium text-surface">{monthLabel}, so far</span>
      {status ? (
        <>
          <div className="flex items-end gap-2">
            <span className="text-[2rem] font-medium text-surface tabular-nums">{formatINR(status.spent)}</span>
            <span className="text-sm text-[#AFC8D1] pb-1">of {formatINR(status.limit_amount)}</span>
          </div>
          <ProgressBar
            percent={status.percent_used}
            markerPercent={status.warning_percentage}
            height={10}
            trackClassName="bg-[#1E3742]"
          />
          <div className="flex items-center justify-between text-xs text-[#AFC8D1]">
            <span>{status.percent_used}% used</span>
            <span>{status.days_left_in_month} days left</span>
          </div>
          <div className="border-t border-[#1E3742] pt-4 flex justify-between">
            <span className="text-xs text-[#AFC8D1]">Safe to spend / day</span>
            <span className="text-sm font-medium text-surface tabular-nums">{formatINR(status.safe_daily_spend)}</span>
          </div>
        </>
      ) : (
        <span className="text-sm text-[#AFC8D1]">Save a budget to see progress here.</span>
      )}
    </div>
  );
}
