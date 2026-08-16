"use client";

import useSWR from "swr";
import type { BudgetUpsertInput } from "@costiq/shared";
import { useApiClient } from "@/lib/api";
import { budgetKey, getBudgetStatus, saveBudget } from "@/lib/services/budgets";
import { revalidate } from "@/lib/swr";

export function useBudget(month: string) {
  const api = useApiClient();
  const { data, error, isLoading } = useSWR(budgetKey(month), () => getBudgetStatus(api, month));

  function save(input: BudgetUpsertInput) {
    return saveBudget(api, month, input).then(() => revalidate(["/api/budgets", "/api/summary"])).then(() => undefined);
  }

  return { budget: data ?? null, isLoading, error, save };
}
