"use client";

import { useState } from "react";
import { useMonthlySummary, useInsights } from "@/hooks/useSummary";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { CategoryBreakdownList } from "@/components/CategoryBreakdownList";
import { MonthlyBarChart } from "@/components/insights/MonthlyBarChart";
import { TopMerchantsCard } from "@/components/insights/TopMerchantsCard";
import { PaymentMethodsCard } from "@/components/insights/PaymentMethodsCard";
import { formatINR, currentMonth } from "@/lib/format";

const RANGES: { label: string; value: "3" | "6" | "12" }[] = [
  { label: "3 months", value: "3" },
  { label: "6 months", value: "6" },
  { label: "A year", value: "12" },
];

export default function InsightsPage() {
  const [range, setRange] = useState<"3" | "6" | "12">("6");
  const month = currentMonth();
  const { summary } = useMonthlySummary(month);
  const { insights } = useInsights(month, Number(range));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-[30px] font-medium tracking-tight">Insights</h1>
          <span className="text-[13px] text-ink-3">
            {insights
              ? `${range}-month average ${formatINR(insights.average_spent)} · under budget ${insights.months_under_budget} of ${insights.months.length} months`
              : "—"}
          </span>
        </div>
        <SegmentedTabs options={RANGES} value={range} onChange={setRange} />
      </div>

      <MonthlyBarChart months={insights?.months ?? []} />

      <div className="flex flex-col lg:flex-row gap-5 items-stretch">
        <div className="flex-[1.3] bg-surface-raised border border-border rounded-xl p-6.5 flex flex-col gap-4.5">
          <span className="text-xl font-medium">By category</span>
          <CategoryBreakdownList
            items={summary?.category_breakdown ?? []}
            amountClassName="w-25.5 text-right text-sm font-medium tabular-nums"
            barHeight={8}
          />
        </div>
        <div className="flex-1 flex flex-col gap-5">
          <TopMerchantsCard merchants={summary?.top_merchants ?? []} />
          <PaymentMethodsCard methods={summary?.payment_methods ?? []} />
        </div>
      </div>
    </div>
  );
}
