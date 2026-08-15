"use client";

import { useState } from "react";
import { useReviewQueue } from "@/hooks/useReviewQueue";
import { ReviewItemCard } from "@/components/review/ReviewItemCard";
import { Loading, EmptyState } from "@/components/ui/Loading";

export default function ReviewPage() {
  const { items, total, isLoading, approve, dismiss } = useReviewQueue();
  // undefined = no explicit choice yet -> default to the first item, derived
  // during render instead of an effect that mirrors `items` into state.
  const [selectedId, setSelectedId] = useState<string | null | undefined>(undefined);
  const expandedId = selectedId === undefined ? (items[0]?.id ?? null) : selectedId;
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleApprove(id: string, categoryId?: string) {
    setBusyId(id);
    try {
      await approve(id, categoryId);
    } finally {
      setBusyId(null);
    }
  }

  async function handleDismiss(id: string) {
    setBusyId(id);
    try {
      await dismiss(id);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4.5">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-1.5 max-w-[45rem]">
          <h1 className="text-[1.875rem] font-medium tracking-tight">Review</h1>
          <span className="text-[0.8125rem] leading-5 text-ink-3 text-wrap-pretty">
            Nothing on this page has been added to your expenses. A message waits here when it looks like it is
            trying to give instructions, when the sender isn&apos;t a bank Costiq recognizes, or when a field
            couldn&apos;t be read.
          </span>
        </div>
        {total > 0 && (
          <span className="text-[0.6875rem] font-semibold tracking-wider text-brand-dark bg-brand-tint border border-brand-tint-border rounded-full px-3 py-2">
            {total} HELD
          </span>
        )}
      </div>

      {isLoading && <Loading />}
      {!isLoading && items.length === 0 && <EmptyState label="Nothing waiting for review right now." />}

      {items.map((item) => (
        <ReviewItemCard
          key={item.id}
          item={item}
          expanded={expandedId === item.id}
          busy={busyId === item.id}
          onToggle={() => setSelectedId(expandedId === item.id ? null : item.id)}
          onApprove={(categoryId) => handleApprove(item.id, categoryId)}
          onDismiss={() => handleDismiss(item.id)}
        />
      ))}
    </div>
  );
}
