import type { BudgetStatus } from "@costiq/shared";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatINR } from "@/lib/format";

function daysInMonth(monthStr: string): number {
  const [y, m] = monthStr.split("-").map(Number);
  return new Date(y, m, 0).getDate();
}

function StatRow({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex items-baseline justify-between pb-3 border-b border-dashed border-[#1E3742] last:border-b-0 last:pb-0">
      <span className="text-xs text-[#7B96A1]">{label}</span>
      <span className="text-sm font-medium tabular-nums text-surface" style={color ? { color } : undefined}>
        {value}
      </span>
    </div>
  );
}

export function BudgetProgressPanel({ status }: { status: BudgetStatus | null }) {
  const monthLabel = new Date().toLocaleDateString("en-IN", { month: "long" });

  if (!status) {
    return (
      <div className="bg-navy rounded-xl p-6.5 flex flex-col gap-5">
        <span className="text-xl font-medium text-surface">{monthLabel}, so far</span>
        <span className="text-sm text-[#AFC8D1]">Save a budget to see progress here.</span>
      </div>
    );
  }

  const totalDays = daysInMonth(status.month);
  const daysElapsed = Math.max(1, totalDays - status.days_left_in_month);
  const projectedFinish = (status.spent / daysElapsed) * totalDays;
  const warningAmount = (status.limit_amount * status.warning_percentage) / 100;

  return (
    <div className="bg-navy rounded-xl p-6.5 flex flex-col gap-5">
      <span className="text-xl font-medium text-surface">{monthLabel}, so far</span>
      <div className="flex items-end gap-2">
        <span className="text-[1.5rem] md:text-[2rem] font-medium text-surface tabular-nums">{formatINR(status.spent)}</span>
        <span className="text-xs md:text-sm text-[#AFC8D1] pb-1">of {formatINR(status.limit_amount)}</span>
      </div>
      <ProgressBar
        percent={status.percent_used}
        markerPercent={status.warning_percentage}
        height={10}
        trackClassName="bg-[#1E3742]"
      />
      <div className="flex flex-col gap-3 pt-1">
        <StatRow label="Spent" value={formatINR(status.spent)} />
        <StatRow label="Left" value={formatINR(status.remaining)} />
        <StatRow label="Warning at" value={formatINR(warningAmount)} color="var(--color-brand)" />
        <StatRow label="On track to finish at" value={formatINR(projectedFinish)} />
      </div>
    </div>
  );
}
