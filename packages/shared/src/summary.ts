export interface CategoryBreakdown {
  category_id: string | null;
  category_name: string;
  amount: number;
  percent: number;
}

export interface MonthlySummary {
  month: string; // YYYY-MM
  total_spent: number;
  total_credited: number;
  expense_count: number;
  messages_captured: number;
  not_transactions: number;
  category_breakdown: CategoryBreakdown[];
  top_merchants: { merchant: string; amount: number }[];
  payment_methods: { method: string; amount: number; percent: number }[];
  vs_last_month_percent: number | null;
}

export interface InsightsResponse {
  months: {
    month: string;
    label: string;
    total_spent: number;
  }[];
  average_spent: number;
  months_under_budget: number;
}
