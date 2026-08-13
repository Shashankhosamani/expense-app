import Link from "next/link";
import type { Transaction } from "@costiq/shared";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { formatDate, formatINR, formatTime } from "@/lib/format";

export function TransactionRow({ transaction: t }: { transaction: Transaction }) {
  return (
    <Link
      href={`/expenses/${t.id}`}
      className="flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-4.5 px-5 py-3.5 border-t border-border-3 hover:bg-surface"
    >
      <span className="w-24 flex items-baseline gap-1.5 text-xs">
        <span className="font-medium">{formatDate(t.transaction_at)}</span>
        <span className="text-ink-4">{formatTime(t.transaction_at)}</span>
      </span>
      <span className="flex-1 min-w-0 flex items-center gap-3">
        <CategoryIcon categoryName={t.category_name} size={15} />
        <span className="text-sm font-medium truncate">{t.merchant ?? "Unknown"}</span>
      </span>
      <span className="w-28 text-xs text-ink-2 hidden md:block">{t.category_name ?? "Other"}</span>
      <span className="w-40 text-xs text-ink-3 hidden md:block">
        {t.payment_method ?? "—"} {t.bank ? `· ${t.bank}` : ""}
      </span>
      <span className="w-16 text-[11px] text-ink-4 hidden md:block capitalize">{t.source}</span>
      <span
        className="w-full md:w-31 text-right text-[15px] font-medium tabular-nums"
        style={{ color: t.type === "credit" ? "var(--color-success)" : "var(--color-ink)" }}
      >
        {t.type === "credit" ? "+" : "−"}
        {formatINR(t.amount)}
      </span>
    </Link>
  );
}
