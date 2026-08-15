import { cn } from "@/lib/cn";
import type { CategoryBreakdown } from "@costiq/shared";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { categoryStyle } from "@/lib/category-style";
import { formatINR } from "@/lib/format";

interface CategoryBreakdownListProps {
  items: CategoryBreakdown[];
  amountClassName?: string;
  barHeight?: number;
}

// Shared by the dashboard's "Where it went" card and the insights "By
// category" panel — same list-of-bars shape, just different surrounding chrome.
export function CategoryBreakdownList({
  items,
  amountClassName = "text-[0.8125rem] font-medium tabular-nums",
  barHeight = 7,
}: CategoryBreakdownListProps) {
  if (items.length === 0) {
    return <div className="text-sm text-ink-3">Nothing recorded yet.</div>;
  }

  return (
    <div className="flex flex-col gap-3.5">
      {items.map((c) => {
        const style = categoryStyle(c.category_name);
        return (
          <div key={c.category_name} className="flex flex-col gap-1.5">
            <div className="flex items-baseline gap-2.5">
              <span className="flex-1 text-[0.8125rem] text-ink-2">{c.category_name}</span>
              <span className={cn(amountClassName)}>{formatINR(c.amount)}</span>
              <span className="w-11 text-right text-[0.6875rem] text-ink-4">{c.percent}%</span>
            </div>
            <ProgressBar percent={c.percent} color={style.bar} height={barHeight} />
          </div>
        );
      })}
    </div>
  );
}
