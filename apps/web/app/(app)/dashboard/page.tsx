"use client";

import { useMonthlySummary } from "@/hooks/useSummary";
import { useBudget } from "@/hooks/useBudget";
import { useTransactions } from "@/hooks/useTransactions";
import { useReviewQueue } from "@/hooks/useReviewQueue";
import { ReviewBanner } from "@/components/dashboard/ReviewBanner";
import { BudgetSummaryCard } from "@/components/dashboard/BudgetSummaryCard";
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { RecentExpensesCard } from "@/components/dashboard/RecentExpensesCard";
import { CategoryBreakdownCard } from "@/components/dashboard/CategoryBreakdownCard";
import { Loading } from "@/components/ui/Loading";
import { currentMonth } from "@/lib/format";

export default function DashboardPage() {
  const month = currentMonth();
  const { summary, isLoading: summaryLoading } = useMonthlySummary(month);
  const { budget } = useBudget(month);
  const { transactions: recent } = useTransactions({ limit: 6 });
  const { total: reviewCount } = useReviewQueue();

  if (summaryLoading) return <Loading fullPage />;

  const monthLabel = new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[1.5rem] md:text-[1.875rem] font-medium tracking-tight">{monthLabel}</h1>
          <span className="text-[0.8125rem] text-ink-3">
            {summary?.expense_count ?? 0} expenses recorded · {summary?.messages_captured ?? 0} messages captured ·{" "}
            {summary?.not_transactions ?? 0} were not transactions
          </span>
        </div>
      </div>

      <ReviewBanner count={reviewCount} />

      <div className="flex flex-col lg:flex-row gap-5 items-stretch">
        <BudgetSummaryCard summary={summary} budget={budget} />
        <KpiGrid summary={summary} />
      </div>

      <div className="flex flex-col lg:flex-row gap-5 items-stretch">
        <RecentExpensesCard transactions={recent} />
        <CategoryBreakdownCard summary={summary} />
      </div>
    </div>
  );
}
