import { z } from "zod";

// budgets table, ARCHITECTURE_2.md §10, plus notify_channels (added in migration 0003 —
// not in the literal §10 schema, needed for the S6 alert-channel toggles).
export const notifyChannelsSchema = z.object({
  push: z.boolean().default(true),
  email: z.boolean().default(false),
  in_app: z.boolean().default(true),
});
export type NotifyChannels = z.infer<typeof notifyChannelsSchema>;

export const budgetUpsertInputSchema = z.object({
  limit_amount: z.number().positive(),
  currency: z.string().default("INR"),
  warning_percentage: z.number().int().min(1).max(100).default(90),
  notify_channels: notifyChannelsSchema.optional(),
});
export type BudgetUpsertInput = z.infer<typeof budgetUpsertInputSchema>;

export interface Budget {
  id: string;
  user_id: string;
  month: string; // YYYY-MM-01
  limit_amount: number;
  currency: string;
  warning_percentage: number;
  notify_channels: NotifyChannels;
  created_at: string;
  updated_at: string;
}

export interface BudgetStatus extends Budget {
  spent: number;
  remaining: number;
  percent_used: number;
  days_left_in_month: number;
  safe_daily_spend: number;
  vs_last_month_percent: number | null;
}
