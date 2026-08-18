import type { SupabaseClient } from "@supabase/supabase-js";
import type { PendingSmsItem, SaveTransactionInput, SmsIngestInput, SmsIngestResponse, Transaction } from "@costiq/shared";
import type { Env } from "../env";
import { deriveUserKey, smsMessageHash } from "../smsCrypto";
import { assessSuspicion } from "../smsHeuristics";
import { createManualTransaction } from "./transactions";

const RATE_LIMIT_WINDOW_MINUTES = 5;
const RATE_LIMIT_MAX_PER_WINDOW = 30; // per-device in practice: one device per user today (§12)

export class RateLimitedError extends Error {
  constructor() {
    super("rate_limited");
    this.name = "RateLimitedError";
  }
}

export class SmsNotFoundError extends Error {
  constructor() {
    super("sms_not_found");
    this.name = "SmsNotFoundError";
  }
}

export class SmsNotPendingError extends Error {
  constructor(public status: string) {
    super("sms_not_pending");
    this.name = "SmsNotPendingError";
  }
}

interface InsertSmsRow {
  id: string;
  status: SmsIngestResponse["status"];
}

async function checkRateLimit(db: SupabaseClient, userId: string): Promise<void> {
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60_000).toISOString();
  const { count, error } = await db
    .from("sms_messages")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", since);
  if (error) throw error;
  if ((count ?? 0) >= RATE_LIMIT_MAX_PER_WINDOW) throw new RateLimitedError();
}

export async function ingestSms(
  db: SupabaseClient,
  userId: string,
  env: Env,
  input: SmsIngestInput
): Promise<SmsIngestResponse> {
  await checkRateLimit(db, userId);

  const messageHash = await smsMessageHash(input.sender, input.raw_message, input.received_at);
  const { suspicious, hold_reasons } = assessSuspicion(input.sender, input.raw_message);
  const key = await deriveUserKey(env.SMS_MASTER_KEY, userId);

  const { data, error } = await db
    .rpc("insert_sms_message", {
      p_user_id: userId,
      p_sender: input.sender,
      p_message_hash: messageHash,
      p_raw_message: input.raw_message,
      p_key: key,
      p_received_at: input.received_at,
      p_suspicious: suspicious,
      p_hold_reasons: hold_reasons,
    })
    .returns<InsertSmsRow[]>()
    .single();
  if (error) throw error;

  return { id: data.id, status: data.status };
}

export async function getPendingSms(
  db: SupabaseClient,
  userId: string,
  env: Env,
  limit: number
): Promise<PendingSmsItem[]> {
  const key = await deriveUserKey(env.SMS_MASTER_KEY, userId);
  const { data, error } = await db.rpc("pending_sms", {
    p_user_id: userId,
    p_key: key,
    p_limit: limit,
  });
  if (error) throw error;

  const rows = (data ?? []) as { id: string; sender: string; raw_message: string; received_at: string }[];
  return rows.map((row) => ({
    sms_id: row.id,
    sender: row.sender,
    raw_message: row.raw_message,
    received_at: row.received_at,
  }));
}

interface SmsStatusRow {
  status: string;
}

async function requirePendingSms(db: SupabaseClient, userId: string, smsId: string): Promise<void> {
  const { data, error } = await db
    .from("sms_messages")
    .select("status")
    .eq("id", smsId)
    .eq("user_id", userId)
    .returns<SmsStatusRow[]>()
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new SmsNotFoundError();
  if (data.status !== "PENDING") throw new SmsNotPendingError(data.status);
}

async function resolveCategoryId(db: SupabaseClient, categoryName: string | null): Promise<string | undefined> {
  if (!categoryName) return undefined;
  const { data, error } = await db
    .from("categories")
    .select("id")
    .ilike("name", categoryName)
    .returns<{ id: string }[]>()
    .maybeSingle();
  if (error) throw error;
  return data?.id;
}

// MCP save_transaction(...), §8. suspicious=true never creates a
// transaction — it stages the sms row for human review instead (§5 layer 5).
export async function saveTransactionFromSms(
  db: SupabaseClient,
  userId: string,
  input: SaveTransactionInput
): Promise<{ status: "PENDING_REVIEW" } | { status: "PROCESSED"; transaction: Transaction }> {
  await requirePendingSms(db, userId, input.sms_id);

  if (input.suspicious) {
    const { error } = await db
      .from("sms_messages")
      .update({
        status: "PENDING_REVIEW",
        suspicious: true,
        extracted: {
          amount: input.amount,
          type: input.type,
          merchant: input.merchant,
          bank: input.bank,
          account_last4: input.account_last4,
          payment_method: input.payment_method,
          transaction_at: input.transaction_at,
          reference_id: input.reference_id,
          suggested_category: input.category,
        },
      })
      .eq("id", input.sms_id)
      .eq("user_id", userId);
    if (error) throw error;
    return { status: "PENDING_REVIEW" };
  }

  const categoryId = await resolveCategoryId(db, input.category);

  const txn = await createManualTransaction(db, userId, {
    amount: input.amount,
    currency: input.currency,
    type: input.type,
    merchant: input.merchant ?? undefined,
    category_id: categoryId,
    bank: input.bank ?? undefined,
    payment_method: input.payment_method ?? undefined,
    transaction_at: input.transaction_at,
    reference_id: input.reference_id ?? undefined,
  });

  const { error: sourceError } = await db
    .from("transactions")
    .update({ source: "sms", sms_id: input.sms_id })
    .eq("id", txn.id);
  if (sourceError) throw sourceError;

  const { error: statusError } = await db
    .from("sms_messages")
    .update({ status: "PROCESSED", processed_at: new Date().toISOString() })
    .eq("id", input.sms_id)
    .eq("user_id", userId);
  if (statusError) throw statusError;

  return { status: "PROCESSED", transaction: { ...txn, source: "sms", sms_id: input.sms_id } };
}

export async function markSmsFailed(db: SupabaseClient, userId: string, smsId: string, reason: string): Promise<void> {
  await requirePendingSms(db, userId, smsId);
  const { error } = await db
    .from("sms_messages")
    .update({
      status: "FAILED",
      processed_at: new Date().toISOString(),
      hold_reasons: [reason],
    })
    .eq("id", smsId)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function markSmsNotTransaction(db: SupabaseClient, userId: string, smsId: string): Promise<void> {
  await requirePendingSms(db, userId, smsId);
  const { error } = await db
    .from("sms_messages")
    .update({ status: "NOT_A_TRANSACTION", processed_at: new Date().toISOString() })
    .eq("id", smsId)
    .eq("user_id", userId);
  if (error) throw error;
}
