"use client";

import useSWR from "swr";
import { useApiClient } from "@/lib/api";
import { categoriesKey, listCategories } from "@/lib/services/categories";

// Categories rarely change — treat the list as effectively static for the
// lifetime of the tab (no revalidate-on-focus/reconnect churn).
export function useCategories() {
  const api = useApiClient();
  const { data, error, isLoading } = useSWR(categoriesKey(), () => listCategories(api), {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });
  return { categories: data?.categories ?? [], isLoading, error };
}
