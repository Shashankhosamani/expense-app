import type { SupabaseClient } from "@supabase/supabase-js";
import type { ReviewItem, ReviewListQuery, ReviewListResponse, Transaction } from "@costiq/shared";
import type { Env } from "../env";
import { createManualTransaction } from "./transactions";

export class IncompleteExtractionError extends Error {
  constructor() {
    super("cannot_approve_incomplete_extraction");
    this.name = "IncompleteExtractionError";
  }
}

interface ReviewQueueRow {
  id: string;
  sender: string;
  raw_message: string;
  suspicious: boolean;
  status: ReviewItem["status"];
  hold_reasons: string[] | null;
  extracted: ReviewItem["extracted"];
  received_at: string;
}

interface SmsMessageExtractedRow {
  id: string;
  extracted: ReviewItem["extracted"];
}

// review_queue() has no built-in offset/limit (it's a small, per-user result
// set by design — see ARCHITECTURE_2.md scale target), so pagination is
// applied in-process after the RPC call rather than pushed into SQL.
export function listReviewQueue(
  db: SupabaseClient,
  userId: string,
  env: Env,
  query: ReviewListQuery
): Promise<ReviewListResponse> {
  return Promise.resolve(db.rpc("review_queue", { p_user_id: userId, p_key: env.SMS_DEMO_DECRYPT_KEY })).then(
    ({ data, error }) => {
      if (error) throw error;

      const rows = (data ?? []) as ReviewQueueRow[];
      const items = rows.map((row) => ({
        id: row.id,
        sender: row.sender,
        raw_message: row.raw_message,
        suspicious: row.suspicious,
        status: row.status,
        received_at: row.received_at,
        hold_reasons: row.hold_reasons ?? [],
        extracted: row.extracted ?? null,
      }));

      const from = (query.page - 1) * query.limit;
      const paged = items.slice(from, from + query.limit);

      return { items: paged, total: items.length, page: query.page, limit: query.limit };
    }
  );
}

export function approveReviewItem(
  db: SupabaseClient,
  userId: string,
  smsId: string,
  categoryId: string | undefined
): Promise<Transaction> {
  return Promise.resolve(
    db
      .from("sms_messages")
      .select("id, extracted")
      .eq("id", smsId)
      .eq("user_id", userId)
      .eq("status", "PENDING_REVIEW")
      .returns<SmsMessageExtractedRow[]>()
      .single()
  ).then(({ data: sms, error: smsError }) => {
    if (smsError) throw smsError;

    const extracted = sms.extracted;
    if (!extracted || !extracted.amount || !extracted.type) {
      throw new IncompleteExtractionError();
    }

    return createManualTransaction(db, userId, {
      amount: extracted.amount,
      currency: "INR",
      type: extracted.type,
      merchant: extracted.merchant ?? undefined,
      category_id: categoryId,
      bank: extracted.bank ?? undefined,
      payment_method: extracted.payment_method ?? undefined,
      transaction_at: extracted.transaction_at ?? new Date().toISOString(),
      reference_id: extracted.reference_id ?? undefined,
    }).then((txn) =>
      // Approved transactions are sms-sourced, not manual — correct the
      // source set by the shared create helper.
      Promise.resolve(db.from("transactions").update({ source: "sms", sms_id: smsId }).eq("id", txn.id))
        .then(({ error: sourceUpdateError }) => {
          if (sourceUpdateError) throw sourceUpdateError;
          return Promise.resolve(
            db
              .from("sms_messages")
              .update({ status: "PROCESSED", processed_at: new Date().toISOString() })
              .eq("id", smsId)
              .eq("user_id", userId)
          );
        })
        .then(({ error: updateError }) => {
          if (updateError) throw updateError;
          return txn;
        })
    );
  });
}

export function dismissReviewItem(db: SupabaseClient, userId: string, smsId: string): Promise<void> {
  return Promise.resolve(
    db
      .from("sms_messages")
      .update({ status: "NOT_A_TRANSACTION", processed_at: new Date().toISOString() })
      .eq("id", smsId)
      .eq("user_id", userId)
      .eq("status", "PENDING_REVIEW")
  ).then(({ error }) => {
    if (error) throw error;
  });
}
