"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import type { TransactionSource } from "@costiq/shared";
import { useTransactions } from "@/hooks/useTransactions";
import { useAddExpense } from "@/components/layout/AddExpenseContext";
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
  const { open } = useAddExpense();
  const [source, setSource] = useState<TransactionSource | "all">("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

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
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h1 className="text-[30px] font-medium tracking-tight">Expenses</h1>
          <span className="text-[13px] text-ink-3">{total} total</span>
        </div>
        <div className="flex items-center gap-2.5">
          <SegmentedTabs options={SOURCE_TABS} value={source} onChange={changeSource} />
          <button
            onClick={open}
            className="bg-brand hover:bg-brand-dark text-white rounded-lg px-3.5 py-2.5 text-sm font-medium cursor-pointer"
          >
            Add Expense
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2.5 flex-wrap pb-4 border-b border-border">
        <div className="flex items-center gap-2 border border-border rounded-full bg-surface-raised px-3.5 py-2">
          <Search size={14} className="text-ink-4" />
          <input
            value={q}
            onChange={(e) => changeQuery(e.target.value)}
            placeholder="Search merchant"
            className="bg-transparent outline-none text-xs text-ink w-35"
          />
        </div>
      </div>

      <div className="flex flex-col bg-surface-raised border border-border-2 rounded-xl overflow-hidden">
        <div className="hidden md:flex items-center gap-4.5 px-5 py-3.5 bg-[#EEF6F8] border-b border-border-2 text-[10px] font-semibold uppercase tracking-wider text-ink-4">
          <span className="w-24">Date</span>
          <span className="flex-1">Merchant</span>
          <span className="w-28">Category</span>
          <span className="w-40">Paid with</span>
          <span className="w-16">Source</span>
          <span className="w-31 text-right">Amount</span>
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
