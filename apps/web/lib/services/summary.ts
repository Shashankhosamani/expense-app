import type { InsightsResponse, MonthlySummary } from "@costiq/shared";
import type { ApiClient } from "@/lib/api";

export const SUMMARY_PATH = "/api/summary";

export function summaryKey(month: string): string {
  return `${SUMMARY_PATH}/${month}`;
}

export function insightsKey(month: string, months: number): string {
  return `${SUMMARY_PATH}/insights?month=${month}&months=${months}`;
}

export function getMonthlySummary(api: ApiClient, month: string): Promise<MonthlySummary> {
  return api.get<MonthlySummary>(summaryKey(month));
}

export function getInsights(api: ApiClient, month: string, months: number): Promise<InsightsResponse> {
  return api.get<InsightsResponse>(insightsKey(month, months));
}
