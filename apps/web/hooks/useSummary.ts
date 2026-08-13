"use client";

import useSWR from "swr";
import { useApiClient } from "@/lib/api";
import { getInsights, getMonthlySummary, insightsKey, summaryKey } from "@/lib/services/summary";

export function useMonthlySummary(month: string) {
  const api = useApiClient();
  const { data, error, isLoading } = useSWR(summaryKey(month), () => getMonthlySummary(api, month));
  return { summary: data ?? null, isLoading, error };
}

export function useInsights(month: string, months: number) {
  const api = useApiClient();
  const { data, error, isLoading } = useSWR(insightsKey(month, months), () => getInsights(api, month, months));
  return { insights: data ?? null, isLoading, error };
}
