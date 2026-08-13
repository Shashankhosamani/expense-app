import type { SupabaseClient } from "@supabase/supabase-js";
import type { Budget, BudgetStatus, BudgetUpsertInput, NotifyChannels } from "@costiq/shared";

interface BudgetRow {
  id: string;
  user_id: string;
  month: string;
  limit_amount: string | number;
  currency: string;
  warning_percentage: number;
  notify_channels: NotifyChannels;
  created_at: string;
  updated_at: string;
}

function daysLeftInMonth(month: string): number {
  const [y, m] = month.split("-").map(Number);
  const now = new Date();
  const isCurrentMonth = now.getFullYear() === y && now.getMonth() + 1 === m;
  const lastDay = new Date(y, m, 0).getDate();
  if (!isCurrentMonth) return 0;
  return Math.max(0, lastDay - now.getDate());
}

function mapRow(row: BudgetRow): Budget {
  return {
    id: row.id,
    user_id: row.user_id,
    month: row.month.slice(0, 7),
    limit_amount: Number(row.limit_amount),
    currency: row.currency,
    warning_percentage: row.warning_percentage,
    notify_channels: row.notify_channels,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function getBudgetStatus(
  db: SupabaseClient,
  userId: string,
  month: string,
  spent: number,
  lastMonthSpent: number | null
): Promise<BudgetStatus | null> {
  return Promise.resolve(
    db
      .from("budgets")
      .select("*")
      .eq("user_id", userId)
      .eq("month", `${month}-01`)
      .is("deleted_at", null)
      .returns<BudgetRow[]>()
      .maybeSingle()
  ).then(({ data, error }) => {
    if (error) throw error;
    if (!data) return null;

    const budget = mapRow(data);
    const remaining = budget.limit_amount - spent;
    const percent_used = budget.limit_amount > 0 ? Math.round((spent / budget.limit_amount) * 100) : 0;
    const days_left = daysLeftInMonth(month);
    const safe_daily_spend = days_left > 0 ? Math.max(0, remaining / days_left) : 0;
    const vs_last_month_percent =
      lastMonthSpent && lastMonthSpent > 0 ? Math.round(((spent - lastMonthSpent) / lastMonthSpent) * 100) : null;

    return {
      ...budget,
      spent,
      remaining,
      percent_used,
      days_left_in_month: days_left,
      safe_daily_spend,
      vs_last_month_percent,
    };
  });
}

export function upsertBudget(
  db: SupabaseClient,
  userId: string,
  month: string,
  input: BudgetUpsertInput
): Promise<Budget> {
  return Promise.resolve(
    db
      .from("budgets")
      .upsert(
        {
          user_id: userId,
          month: `${month}-01`,
          limit_amount: input.limit_amount,
          currency: input.currency,
          warning_percentage: input.warning_percentage,
          notify_channels: input.notify_channels ?? { push: true, email: false, in_app: true },
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,month" }
      )
      .select("*")
      .returns<BudgetRow[]>()
      .single()
  ).then(({ data, error }) => {
    if (error) throw error;
    return mapRow(data);
  });
}
