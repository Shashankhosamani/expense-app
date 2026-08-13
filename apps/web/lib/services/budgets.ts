import type { BudgetStatus, BudgetUpsertInput } from "@costiq/shared";
import type { ApiClient } from "@/lib/api";

export const BUDGETS_PATH = "/api/budgets";

export function budgetKey(month: string): string {
  return `${BUDGETS_PATH}/${month}`;
}

export function getBudgetStatus(api: ApiClient, month: string): Promise<BudgetStatus | null> {
  return api
    .get<BudgetStatus>(budgetKey(month))
    .catch((err) => (err?.status === 404 ? null : Promise.reject(err)));
}

export function saveBudget(api: ApiClient, month: string, input: BudgetUpsertInput): Promise<BudgetStatus> {
  return api.put<BudgetStatus>(budgetKey(month), input);
}
