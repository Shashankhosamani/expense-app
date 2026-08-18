import { z } from "zod";
import { transactionTypeSchema } from "./transaction.js";
import type { SmsStatus } from "./review.js";

// POST /api/sms — Android → Worker ingestion, ARCHITECTURE_2.md §15.
// Field-for-field match with apps/android SmsIngestDto.kt.
export const smsIngestInputSchema = z.object({
  sender: z.string().min(1),
  raw_message: z.string().min(1),
  received_at: z.string(),
});
export type SmsIngestInput = z.infer<typeof smsIngestInputSchema>;

export interface SmsIngestResponse {
  id: string;
  status: SmsStatus;
}

// MCP tool contracts, ARCHITECTURE_2.md §8. user_id is never a field here —
// every tool resolves it server-side from the caller's MCP bearer token.

export interface PendingSmsItem {
  sms_id: string;
  sender: string;
  raw_message: string;
  received_at: string;
}

export interface PendingSmsResponse {
  pending_sms: PendingSmsItem[];
  count: number;
}

export const saveTransactionInputSchema = z.object({
  sms_id: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().default("INR"),
  type: transactionTypeSchema,
  merchant: z.string().nullable(),
  category: z.string().nullable(), // Claude's suggestion; Worker maps to category_id
  bank: z.string().nullable(),
  account_last4: z.string().nullable(),
  payment_method: z.string().nullable(),
  transaction_at: z.string(),
  reference_id: z.string().nullable(),
  suspicious: z.boolean(),
});
export type SaveTransactionInput = z.infer<typeof saveTransactionInputSchema>;

export const markSmsFailedInputSchema = z.object({
  sms_id: z.string().uuid(),
  reason: z.string().min(1),
});
export type MarkSmsFailedInput = z.infer<typeof markSmsFailedInputSchema>;

export const markSmsNotTransactionInputSchema = z.object({
  sms_id: z.string().uuid(),
});
export type MarkSmsNotTransactionInput = z.infer<typeof markSmsNotTransactionInputSchema>;
