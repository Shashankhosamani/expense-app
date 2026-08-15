import Link from "next/link";
import type { Transaction } from "@costiq/shared";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { Badge } from "@/components/ui/Badge";
import { categoryStyle } from "@/lib/category-style";
import { formatDate, formatINR, formatTime } from "@/lib/format";

export function TransactionRow({ transaction: t }: { transaction: Transaction }) {
  const style = categoryStyle(t.category_name);

  return (
    <Link
      href={`/expenses/${t.id}`}
      className="flex flex-wrap md:grid md:grid-cols-[112px_1fr_140px_160px_84px_130px] items-center gap-3 md:gap-4.5 px-5 py-3.5 border-t border-border-3 hover:bg-surface"
    >
      <span className="flex flex-col gap-0.5 text-xs whitespace-nowrap">
        <span className="font-medium">{formatDate(t.transaction_at)}</span>
        <span className="text-ink-4">{formatTime(t.transaction_at)}</span>
      </span>
      <span className="flex-1 min-w-0 flex items-center gap-3">
        <CategoryIcon categoryName={t.category_name} size={15} />
        <span className="text-sm font-medium truncate">{t.merchant ?? "Unknown"}</span>
      </span>
      <span className="hidden md:block">
        <span
          className="inline-flex max-w-full truncate rounded-full px-2.5 py-1 text-[0.6875rem] font-medium"
          style={{ background: style.bg, color: style.fg }}
        >
          {t.category_name ?? "Other"}
        </span>
      </span>
      <span className="text-xs text-ink-3 hidden md:block truncate">
        {t.payment_method ?? "—"} {t.bank ? `· ${t.bank}` : ""}
      </span>
      <span className="hidden md:block">
        <Badge tone="neutral" className="normal-case capitalize">
          {t.source}
        </Badge>
      </span>
      <span
        className="w-full md:w-auto text-right text-[0.9375rem] font-medium tabular-nums"
        style={{ color: t.type === "credit" ? "var(--color-success)" : "var(--color-ink)" }}
      >
        {t.type === "credit" ? "+" : "−"}
        {formatINR(t.amount)}
      </span>
    </Link>
  );
}
