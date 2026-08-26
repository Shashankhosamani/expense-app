import { z } from "zod";
import { paginationQuerySchema } from "./pagination.js";

export const transactionTypeSchema = z.enum(["debit", "credit"]);
export type TransactionType = z.infer<typeof transactionTypeSchema>;

export const transactionSourceSchema = z.enum(["sms", "manual"]);
export type TransactionSource = z.infer<typeof transactionSourceSchema>;

// Canonical parsed-SMS schema, ARCHITECTURE_2.md §4. Missing fields are null, never guessed.
export const canonicalTransactionSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default("INR"),
  type: transactionTypeSchema,
  merchant: z.string().nullable(),
  payment_method: z.string().nullable(),
  bank: z.string().nullable(),
  account_last4: z.string().nullable(),
  transaction_at: z.string(),
  reference_id: z.string().nullable(),
});
export type CanonicalTransaction = z.infer<typeof canonicalTransactionSchema>;

// POST /api/transactions/manual, ARCHITECTURE_2.md §9.
export const manualTransactionInputSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default("INR"),
  type: transactionTypeSchema,
  merchant: z.string().optional(),
  category_id: z.string().uuid().optional(),
  bank: z.string().optional(),
  payment_method: z.string().optional(),
  transaction_at: z.string(),
  reference_id: z.string().optional(),
  note: z.string().optional(),
  is_reimbursement: z.boolean().optional(),
});
export type ManualTransactionInput = z.infer<typeof manualTransactionInputSchema>;

// PATCH /api/transactions/:id — field-level correction, writes transaction_corrections.
export const transactionCorrectionInputSchema = z.object({
  amount: z.number().positive().optional(),
  type: transactionTypeSchema.optional(),
  merchant: z.string().nullable().optional(),
  category_id: z.string().uuid().nullable().optional(),
  bank: z.string().nullable().optional(),
  payment_method: z.string().nullable().optional(),
  transaction_at: z.string().optional(),
  reference_id: z.string().nullable().optional(),
  // Only meaningful on a credit transaction: is this money paid back to you
  // (a refund, a friend settling a bill you fronted)? A salary credit must
  // stay false or it skews total_spent.
  is_reimbursement: z.boolean().optional(),
});
export type TransactionCorrectionInput = z.infer<typeof transactionCorrectionInputSchema>;

export interface Transaction {
  id: string;
  user_id: string;
  sms_id: string | null;
  amount: number;
  currency: string;
  type: TransactionType;
  merchant: string | null;
  category_id: string | null;
  category_name: string | null;
  bank: string | null;
  account_last4: string | null;
  payment_method: string | null;
  transaction_at: string;
  reference_id: string | null;
  source: TransactionSource;
  note: string | null;
  is_reimbursement: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface TransactionCorrection {
  id: string;
  transaction_id: string;
  field_name: string;
  old_value: string | null;
  new_value: string | null;
  corrected_at: string;
}

export const transactionListQuerySchema = paginationQuerySchema.extend({
  month: z.string().regex(/^\d{4}-\d{2}$/).optional(),
  category_id: z.string().uuid().optional(),
  bank: z.string().optional(),
  merchant: z.string().optional(),
  source: transactionSourceSchema.optional(),
  q: z.string().optional(),
});
export type TransactionListQuery = z.infer<typeof transactionListQuerySchema>;

export interface TransactionListResponse {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
}

export const transactionCorrectionListQuerySchema = paginationQuerySchema;
export type TransactionCorrectionListQuery = z.infer<typeof transactionCorrectionListQuerySchema>;

export interface TransactionCorrectionListResponse {
  corrections: TransactionCorrection[];
  total: number;
  page: number;
  limit: number;
}
