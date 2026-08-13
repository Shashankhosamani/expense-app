import type { MonthlySummary } from "@costiq/shared";
import { Card } from "@/components/ui/Card";
import { CategoryBreakdownList } from "@/components/CategoryBreakdownList";
import { formatINR } from "@/lib/format";

export function CategoryBreakdownCard({ summary }: { summary: MonthlySummary | null }) {
  return (
    <Card className="flex-1 p-6.5 flex flex-col gap-5">
      <span className="text-[17px] font-medium">Where it went</span>
      <CategoryBreakdownList items={summary?.category_breakdown ?? []} />
      <div className="border-t border-dashed border-border-2 pt-3.5 flex items-baseline justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-3">Total</span>
        <span className="text-base font-medium tabular-nums">{summary ? formatINR(summary.total_spent) : "—"}</span>
      </div>
    </Card>
  );
}
