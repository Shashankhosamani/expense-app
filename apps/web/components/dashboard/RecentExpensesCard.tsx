import Link from "next/link";
import type { Transaction } from "@costiq/shared";
import { Card, CardHeader } from "@/components/ui/Card";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { formatDateShort, formatINR } from "@/lib/format";

export function RecentExpensesCard({ transactions }: { transactions: Transaction[] }) {
  return (
    <Card className="flex-[1.6] flex flex-col">
      <CardHeader>
        <span className="text-[17px] font-medium">Recent expenses</span>
        <Link href="/expenses" className="text-xs font-semibold text-brand">
          See all
        </Link>
      </CardHeader>
      <div className="flex flex-col">
        {transactions.length === 0 && <div className="px-5.5 py-6 text-sm text-ink-3">No expenses yet.</div>}
        {transactions.map((t) => (
          <Link
            key={t.id}
            href={`/expenses/${t.id}`}
            className="flex items-center gap-3.5 px-5.5 py-3.5 border-b border-border-3 hover:bg-surface"
          >
            <CategoryIcon categoryName={t.category_name} />
            <span className="flex-1 min-w-0 flex flex-col gap-0.5">
              <span className="text-sm font-medium">{t.merchant ?? "Unknown"}</span>
              <span className="text-[11px] text-ink-4">
                {formatDateShort(t.transaction_at)} · {t.bank ?? t.source}
              </span>
            </span>
            <span className="text-[11px] uppercase tracking-wide text-ink-3">{t.category_name ?? "Other"}</span>
            <span
              className="w-[130px] text-right text-[15px] font-medium tabular-nums"
              style={{ color: t.type === "credit" ? "var(--color-success)" : "var(--color-ink)" }}
            >
              {t.type === "credit" ? "+" : "−"}
              {formatINR(t.amount)}
            </span>
          </Link>
        ))}
      </div>
    </Card>
  );
}
