import type { SupabaseClient } from "@supabase/supabase-js";
import type { CategoryBreakdown, InsightsResponse, MonthlySummary, TransactionType } from "@costiq/shared";

interface AmountRow {
  amount: string | number;
}

interface SummaryCategoryRef {
  id: string;
  name: string;
}

interface SummaryTransactionRow {
  amount: string | number;
  type: TransactionType;
  merchant: string | null;
  payment_method: string | null;
  categories: SummaryCategoryRef | null;
}

interface BudgetMonthRow {
  month: string;
  limit_amount: string | number;
}

function monthRange(month: string): [string, string] {
  const [y, m] = month.split("-").map(Number);
  const start = `${month}-01`;
  const end = m === 12 ? `${y + 1}-01-01` : `${y}-${String(m + 1).padStart(2, "0")}-01`;
  return [start, end];
}

function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split("-").map(Number);
  const total = y * 12 + (m - 1) + delta;
  const ny = Math.floor(total / 12);
  const nm = (total % 12) + 1;
  return `${ny}-${String(nm).padStart(2, "0")}`;
}

function spentForMonth(db: SupabaseClient, userId: string, month: string): Promise<number> {
  const [start, end] = monthRange(month);
  return Promise.resolve(
    db
      .from("transactions")
      .select("amount")
      .eq("user_id", userId)
      .eq("type", "debit")
      .is("deleted_at", null)
      .gte("transaction_at", start)
      .lt("transaction_at", end)
      .returns<AmountRow[]>()
  ).then(({ data, error }) => {
    if (error) throw error;
    return (data ?? []).reduce((sum, r) => sum + Number(r.amount), 0);
  });
}

export function getMonthlySummary(db: SupabaseClient, userId: string, month: string): Promise<MonthlySummary> {
  const [start, end] = monthRange(month);

  const transactionsQuery = Promise.resolve(
    db
      .from("transactions")
      .select("amount, type, merchant, payment_method, categories(id, name)")
      .eq("user_id", userId)
      .is("deleted_at", null)
      .gte("transaction_at", start)
      .lt("transaction_at", end)
      .returns<SummaryTransactionRow[]>()
  );

  const messagesCapturedQuery = Promise.resolve(
    db
      .from("sms_messages")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("received_at", start)
      .lt("received_at", end)
  );

  const notTransactionsQuery = Promise.resolve(
    db
      .from("sms_messages")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "NOT_A_TRANSACTION")
      .gte("received_at", start)
      .lt("received_at", end)
  );

  const lastMonthSpentQuery = spentForMonth(db, userId, shiftMonth(month, -1));

  return Promise.all([transactionsQuery, messagesCapturedQuery, notTransactionsQuery, lastMonthSpentQuery]).then(
    ([{ data: txns, error }, { count: messages_captured }, { count: not_transactions }, lastMonthSpent]) => {
      if (error) throw error;

      const rows = txns ?? [];
      const debits = rows.filter((r) => r.type === "debit");
      const totalSpent = debits.reduce((sum, r) => sum + Number(r.amount), 0);
      const totalCredited = rows.filter((r) => r.type === "credit").reduce((sum, r) => sum + Number(r.amount), 0);

      const byCategory = new Map<string, { id: string | null; amount: number }>();
      for (const r of debits) {
        const name = r.categories?.name ?? "Other";
        const entry = byCategory.get(name) ?? { id: r.categories?.id ?? null, amount: 0 };
        entry.amount += Number(r.amount);
        byCategory.set(name, entry);
      }
      const category_breakdown: CategoryBreakdown[] = [...byCategory.entries()]
        .map(([name, v]) => ({
          category_id: v.id,
          category_name: name,
          amount: v.amount,
          percent: totalSpent > 0 ? Math.round((v.amount / totalSpent) * 100) : 0,
        }))
        .sort((a, b) => b.amount - a.amount);

      const byMerchant = new Map<string, number>();
      for (const r of debits) {
        if (!r.merchant) continue;
        byMerchant.set(r.merchant, (byMerchant.get(r.merchant) ?? 0) + Number(r.amount));
      }
      const top_merchants = [...byMerchant.entries()]
        .map(([merchant, amount]) => ({ merchant, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

      const byMethod = new Map<string, number>();
      for (const r of debits) {
        const method = r.payment_method ?? "Unknown";
        byMethod.set(method, (byMethod.get(method) ?? 0) + Number(r.amount));
      }
      const payment_methods = [...byMethod.entries()]
        .map(([method, amount]) => ({
          method,
          amount,
          percent: totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0,
        }))
        .sort((a, b) => b.amount - a.amount);

      const vs_last_month_percent =
        lastMonthSpent > 0 ? Math.round(((totalSpent - lastMonthSpent) / lastMonthSpent) * 100) : null;

      return {
        month,
        total_spent: totalSpent,
        total_credited: totalCredited,
        expense_count: debits.length,
        messages_captured: messages_captured ?? 0,
        not_transactions: not_transactions ?? 0,
        category_breakdown,
        top_merchants,
        payment_methods,
        vs_last_month_percent,
      };
    }
  );
}

export function getInsights(
  db: SupabaseClient,
  userId: string,
  currentMonth: string,
  monthsBack: number
): Promise<InsightsResponse> {
  const monthKeys: string[] = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    monthKeys.push(shiftMonth(currentMonth, -i));
  }

  const spentByMonth = Promise.all(monthKeys.map((month) => spentForMonth(db, userId, month)));

  const budgetsQuery = Promise.resolve(
    db
      .from("budgets")
      .select("month, limit_amount")
      .eq("user_id", userId)
      .in(
        "month",
        monthKeys.map((month) => `${month}-01`)
      )
      .returns<BudgetMonthRow[]>()
  );

  return Promise.all([spentByMonth, budgetsQuery]).then(([spentAmounts, { data: budgetRows, error }]) => {
    if (error) throw error;

    const months = monthKeys.map((month, i) => {
      const [, mm] = month.split("-");
      const label = new Date(Number(month.split("-")[0]), Number(mm) - 1, 1).toLocaleString("en-IN", {
        month: "short",
      });
      return { month, label, total_spent: spentAmounts[i] };
    });

    const average_spent = months.length
      ? Math.round(months.reduce((s, m) => s + m.total_spent, 0) / months.length)
      : 0;

    const limitByMonth = new Map<string, number>();
    for (const b of budgetRows ?? []) {
      limitByMonth.set(b.month.slice(0, 7), Number(b.limit_amount));
    }
    const months_under_budget = months.filter((m) => {
      const limit = limitByMonth.get(m.month);
      return limit !== undefined && m.total_spent <= limit;
    }).length;

    return { months, average_spent, months_under_budget };
  });
}
