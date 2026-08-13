"use client";

import useSWR from "swr";
import type { ReviewListQuery } from "@costiq/shared";
import { useApiClient } from "@/lib/api";
import { approveReviewItem, dismissReviewItem, listReviewQueue, reviewKey } from "@/lib/services/review";
import { revalidate } from "@/lib/swr";

const RELATED_PATHS = ["/api/review", "/api/transactions", "/api/summary", "/api/budgets"];

export function useReviewQueue(query: Partial<ReviewListQuery> = {}) {
  const api = useApiClient();
  const { data, error, isLoading, mutate } = useSWR(reviewKey(query), () => listReviewQueue(api, query));

  function approve(id: string, categoryId?: string) {
    return approveReviewItem(api, id, categoryId).then((txn) => revalidate(RELATED_PATHS).then(() => txn));
  }

  function dismiss(id: string) {
    return dismissReviewItem(api, id).then(() => revalidate(RELATED_PATHS)).then(() => undefined);
  }

  return {
    items: data?.items ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
    refresh: () => mutate(),
    approve,
    dismiss,
  };
}
