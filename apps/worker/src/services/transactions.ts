import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  ManualTransactionInput,
  Transaction,
  TransactionCorrectionInput,
  TransactionCorrectionListQuery,
  TransactionCorrectionListResponse,
  TransactionListQuery,
  TransactionListResponse,
  TransactionSource,
  TransactionType,
} from "@costiq/shared";

interface TransactionCategoryRef {
  name: string;
}

interface TransactionRow {
  id: string;
  user_id: string;
  sms_id: string | null;
  amount: string | number;
  currency: string;
  type: TransactionType;
  merchant: string | null;
  category_id: string | null;
  categories: TransactionCategoryRef | null;
  bank: string | null;
  account_last4: string | null;
  payment_method: string | null;
  transaction_at: string;
  reference_id: string | null;
  source: TransactionSource;
  note: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface TransactionCorrectionRow {
  id: string;
  transaction_id: string;
  field_name: string;
  old_value: string | null;
  new_value: string | null;
  corrected_at: string;
}

function mapRow(row: TransactionRow): Transaction {
  return {
    id: row.id,
    user_id: row.user_id,
    sms_id: row.sms_id,
    amount: Number(row.amount),
    currency: row.currency,
    type: row.type,
    merchant: row.merchant,
    category_id: row.category_id,
    category_name: row.categories?.name ?? null,
    bank: row.bank,
    account_last4: row.account_last4,
    payment_method: row.payment_method,
    transaction_at: row.transaction_at,
    reference_id: row.reference_id,
    source: row.source,
    note: row.note,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  };
}

export function listTransactions(
  db: SupabaseClient,
  userId: string,
  query: TransactionListQuery
): Promise<TransactionListResponse> {
  let q = db
    .from("transactions")
    .select("*, categories(name)", { count: "exact" })
    .eq("user_id", userId)
    .is("deleted_at", null)
    .order("transaction_at", { ascending: false });

  if (query.month) {
    const start = `${query.month}-01`;
    const [y, m] = query.month.split("-").map(Number);
    const nextMonth = m === 12 ? `${y + 1}-01-01` : `${y}-${String(m + 1).padStart(2, "0")}-01`;
    q = q.gte("transaction_at", start).lt("transaction_at", nextMonth);
  }
  if (query.category_id) q = q.eq("category_id", query.category_id);
  if (query.bank) q = q.eq("bank", query.bank);
  if (query.source) q = q.eq("source", query.source);
  if (query.merchant) q = q.ilike("merchant", `%${query.merchant}%`);
  if (query.q) q = q.ilike("merchant", `%${query.q}%`);

  const from = (query.page - 1) * query.limit;
  const to = from + query.limit - 1;

  return Promise.resolve(q.range(from, to).returns<TransactionRow[]>()).then(({ data, error, count }) => {
      if (error) throw error;
      return {
        transactions: (data ?? []).map(mapRow),
        total: count ?? 0,
        page: query.page,
        limit: query.limit,
      };
    });
}

export function createManualTransaction(
  db: SupabaseClient,
  userId: string,
  input: ManualTransactionInput
): Promise<Transaction> {
  return Promise.resolve(
    db
      .from("transactions")
      .insert({
        user_id: userId,
        sms_id: null,
        amount: input.amount,
        currency: input.currency,
        type: input.type,
        merchant: input.merchant ?? null,
        category_id: input.category_id ?? null,
        bank: input.bank ?? null,
        payment_method: input.payment_method ?? null,
        transaction_at: input.transaction_at,
        reference_id: input.reference_id ?? null,
        note: input.note ?? null,
        source: "manual",
      })
      .select("*, categories(name)")
      .returns<TransactionRow[]>()
      .single()
  ).then(({ data, error }) => {
    if (error) throw error;
    return mapRow(data);
  });
}

interface TransactionUpdatePayload {
  amount?: number;
  type?: TransactionType;
  merchant?: string | null;
  category_id?: string | null;
  bank?: string | null;
  payment_method?: string | null;
  transaction_at?: string;
  reference_id?: string | null;
  updated_at?: string;
}

interface CorrectionDraft {
  field_name: string;
  old_value: string | null;
  new_value: string | null;
}

function stringifyValue(value: string | number | null | undefined): string | null {
  return value === null || value === undefined ? null : String(value);
}

// Unrolled per-field (rather than looped over a keyof union) so each
// assignment stays narrowed to its own concrete type — no `any`/`unknown`
// bridge needed to satisfy TransactionUpdatePayload's heterogeneous fields.
function diffTransactionFields(
  existing: TransactionRow,
  input: TransactionCorrectionInput
): { updates: TransactionUpdatePayload; corrections: CorrectionDraft[] } {
  const updates: TransactionUpdatePayload = {};
  const corrections: CorrectionDraft[] = [];

  if (input.amount !== undefined) {
    const oldValue = Number(existing.amount);
    if (stringifyValue(oldValue) !== stringifyValue(input.amount)) {
      updates.amount = input.amount;
      corrections.push({ field_name: "amount", old_value: stringifyValue(oldValue), new_value: stringifyValue(input.amount) });
    }
  }
  if (input.type !== undefined) {
    if (stringifyValue(existing.type) !== stringifyValue(input.type)) {
      updates.type = input.type;
      corrections.push({ field_name: "type", old_value: stringifyValue(existing.type), new_value: stringifyValue(input.type) });
    }
  }
  if (input.merchant !== undefined) {
    if (stringifyValue(existing.merchant) !== stringifyValue(input.merchant)) {
      updates.merchant = input.merchant ?? null;
      corrections.push({ field_name: "merchant", old_value: stringifyValue(existing.merchant), new_value: stringifyValue(input.merchant) });
    }
  }
  if (input.category_id !== undefined) {
    if (stringifyValue(existing.category_id) !== stringifyValue(input.category_id)) {
      updates.category_id = input.category_id ?? null;
      corrections.push({
        field_name: "category_id",
        old_value: stringifyValue(existing.category_id),
        new_value: stringifyValue(input.category_id),
      });
    }
  }
  if (input.bank !== undefined) {
    if (stringifyValue(existing.bank) !== stringifyValue(input.bank)) {
      updates.bank = input.bank ?? null;
      corrections.push({ field_name: "bank", old_value: stringifyValue(existing.bank), new_value: stringifyValue(input.bank) });
    }
  }
  if (input.payment_method !== undefined) {
    if (stringifyValue(existing.payment_method) !== stringifyValue(input.payment_method)) {
      updates.payment_method = input.payment_method ?? null;
      corrections.push({
        field_name: "payment_method",
        old_value: stringifyValue(existing.payment_method),
        new_value: stringifyValue(input.payment_method),
      });
    }
  }
  if (input.transaction_at !== undefined) {
    if (stringifyValue(existing.transaction_at) !== stringifyValue(input.transaction_at)) {
      updates.transaction_at = input.transaction_at;
      corrections.push({
        field_name: "transaction_at",
        old_value: stringifyValue(existing.transaction_at),
        new_value: stringifyValue(input.transaction_at),
      });
    }
  }
  if (input.reference_id !== undefined) {
    if (stringifyValue(existing.reference_id) !== stringifyValue(input.reference_id)) {
      updates.reference_id = input.reference_id ?? null;
      corrections.push({
        field_name: "reference_id",
        old_value: stringifyValue(existing.reference_id),
        new_value: stringifyValue(input.reference_id),
      });
    }
  }

  return { updates, corrections };
}

export function correctTransaction(
  db: SupabaseClient,
  userId: string,
  id: string,
  input: TransactionCorrectionInput
): Promise<Transaction> {
  return Promise.resolve(
    db.from("transactions").select("*").eq("id", id).eq("user_id", userId).returns<TransactionRow[]>().single()
  ).then(({ data: existing, error: fetchError }) => {
    if (fetchError) throw fetchError;

    const { updates, corrections } = diffTransactionFields(existing, input);

    const applyUpdate: Promise<void> =
      Object.keys(updates).length > 0
        ? Promise.resolve(
            db
              .from("transactions")
              .update({ ...updates, updated_at: new Date().toISOString() })
              .eq("id", id)
              .eq("user_id", userId)
          ).then(({ error }) => {
            if (error) throw error;
          })
        : Promise.resolve();

      return applyUpdate
        .then(() =>
          corrections.length > 0
            ? db
                .from("transaction_corrections")
                .insert(corrections.map((c) => ({ ...c, transaction_id: id })))
                .then(({ error }) => {
                  if (error) throw error;
                })
            : Promise.resolve()
        )
        .then(() =>
          db
            .from("transactions")
            .select("*, categories(name)")
            .eq("id", id)
            .eq("user_id", userId)
            .returns<TransactionRow[]>()
            .single()
        )
        .then(({ data: updated, error: refetchError }) => {
          if (refetchError) throw refetchError;
          return mapRow(updated);
        });
    });
}

export function softDeleteTransaction(db: SupabaseClient, userId: string, id: string): Promise<void> {
  return Promise.resolve(
    db.from("transactions").update({ deleted_at: new Date().toISOString() }).eq("id", id).eq("user_id", userId)
  ).then(({ error }) => {
    if (error) throw error;
  });
}

export function getTransaction(db: SupabaseClient, userId: string, id: string): Promise<Transaction | null> {
  return Promise.resolve(
    db
      .from("transactions")
      .select("*, categories(name)")
      .eq("id", id)
      .eq("user_id", userId)
      .returns<TransactionRow[]>()
      .maybeSingle()
  ).then(({ data, error }) => {
    if (error) throw error;
    return data ? mapRow(data) : null;
  });
}

export function getTransactionCorrections(
  db: SupabaseClient,
  transactionId: string,
  query: TransactionCorrectionListQuery
): Promise<TransactionCorrectionListResponse> {
  const from = (query.page - 1) * query.limit;
  const to = from + query.limit - 1;

  return Promise.resolve(
    db
      .from("transaction_corrections")
      .select("*", { count: "exact" })
      .eq("transaction_id", transactionId)
      .order("corrected_at", { ascending: false })
      .range(from, to)
      .returns<TransactionCorrectionRow[]>()
  ).then(({ data, error, count }) => {
    if (error) throw error;
    return { corrections: data ?? [], total: count ?? 0, page: query.page, limit: query.limit };
  });
}
