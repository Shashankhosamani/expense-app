import type { z } from "zod";
import { paginationQuerySchema } from "./pagination.js";

// sms_messages.status per ARCHITECTURE_2.md §10.
export const SMS_STATUSES = [
  "PENDING",
  "PROCESSING",
  "PROCESSED",
  "FAILED",
  "PENDING_REVIEW",
  "NOT_A_TRANSACTION",
] as const;
export type SmsStatus = (typeof SMS_STATUSES)[number];

export interface ReviewItem {
  id: string;
  sender: string;
  raw_message: string;
  suspicious: boolean;
  status: SmsStatus;
  received_at: string;
  hold_reasons: string[];
  extracted: {
    amount: number | null;
    type: "debit" | "credit" | null;
    merchant: string | null;
    bank: string | null;
    account_last4: string | null;
    payment_method: string | null;
    transaction_at: string | null;
    reference_id: string | null;
    suggested_category: string | null;
  } | null;
}

export interface ReviewApproveInput {
  category_id?: string;
}

export const reviewListQuerySchema = paginationQuerySchema;
export type ReviewListQuery = z.infer<typeof reviewListQuerySchema>;

export interface ReviewListResponse {
  items: ReviewItem[];
  total: number;
  page: number;
  limit: number;
}
