"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import type { TransactionSource } from "@costiq/shared";
import { useTransactions } from "@/hooks/useTransactions";
import { SegmentedTabs } from "@/components/ui/SegmentedTabs";
import { Pagination } from "@/components/ui/Pagination";
import { Loading, EmptyState } from "@/components/ui/Loading";
import { TransactionRow } from "@/components/expenses/TransactionRow";

const SOURCE_TABS: { label: string; value: TransactionSource | "all" }[] = [
  { label: "All", value: "all" },
  { label: "From messages", value: "sms" },
  { label: "By hand", value: "manual" },
];

const LIMIT = 8;

export default function ExpensesPage() {
  return (
    <Suspense fallback={<Loading fullPage />}>
      <ExpensesPageContent />
    </Suspense>
  );
}

function ExpensesPageContent() {
  const searchParams = useSearchParams();
  const [source, setSource] = useState<TransactionSource | "all">("all");
  const [q, setQ] = useState(() => searchParams.get("q") ?? "");
  const [page, setPage] = useState(1);

  const urlQuery = searchParams.get("q") ?? "";
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);
  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    setQ(urlQuery);
    setPage(1);
  }

  const { transactions, total, limit, isLoading } = useTransactions({
    page,
    limit: LIMIT,
    source: source === "all" ? undefined : source,
    q: q || undefined,
  });

  function changeSource(value: TransactionSource | "all") {
    setSource(value);
    setPage(1);
  }

  function changeQuery(value: string) {
    setQ(value);
    setPage(1);
  }

  return (
    <div className="flex flex-col gap-4.5">
      <div className="flex flex-col gap-1">
        <h1 className="text-[1.875rem] font-medium tracking-tight">Expenses</h1>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 border border-border rounded-full bg-surface-raised px-3.5 py-2 w-full sm:w-auto">
          <Search size={14} className="text-ink-4 shrink-0" />
          <input
            value={q}
            onChange={(e) => changeQuery(e.target.value)}
            placeholder="Search merchant"
            className="bg-transparent outline-none text-xs text-ink w-full sm:w-44"
          />
        </div>
        <SegmentedTabs options={SOURCE_TABS} value={source} onChange={changeSource} />
      </div>

      <div className="flex flex-col bg-surface-raised border border-border-2 rounded-xl overflow-hidden">
        <div className="hidden md:grid grid-cols-[112px_1fr_140px_160px_84px_130px] items-center gap-4.5 px-5 py-3.5 bg-[#EEF6F8] border-b border-border-2 text-[0.625rem] font-semibold uppercase tracking-wider text-ink-4">
          <span>Date</span>
          <span>Merchant</span>
          <span>Category</span>
          <span>Paid with</span>
          <span>Source</span>
          <span className="text-right">Amount</span>
        </div>

        {isLoading && (
          <div className="px-5 py-8">
            <Loading />
          </div>
        )}
        {!isLoading && transactions.length === 0 && (
          <div className="p-5">
            <EmptyState label="No expenses match these filters." />
          </div>
        )}

        {transactions.map((t) => (
          <TransactionRow key={t.id} transaction={t} />
        ))}

        <Pagination page={page} limit={limit} total={total} onPageChange={setPage} />
      </div>
    </div>
  );
}
