import type {
  ManualTransactionInput,
  Transaction,
  TransactionCorrectionInput,
  TransactionCorrectionListResponse,
  TransactionListQuery,
  TransactionListResponse,
} from "@costiq/shared";
import type { ApiClient } from "@/lib/api";

export const TRANSACTIONS_PATH = "/api/transactions";

export function transactionsKey(query: Partial<TransactionListQuery> = {}): string {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  if (query.month) params.set("month", query.month);
  if (query.category_id) params.set("category_id", query.category_id);
  if (query.bank) params.set("bank", query.bank);
  if (query.merchant) params.set("merchant", query.merchant);
  if (query.source) params.set("source", query.source);
  if (query.q) params.set("q", query.q);
  const qs = params.toString();
  return qs ? `${TRANSACTIONS_PATH}?${qs}` : TRANSACTIONS_PATH;
}

export function transactionKey(id: string): string {
  return `${TRANSACTIONS_PATH}/${id}`;
}

export function transactionCorrectionsKey(id: string): string {
  return `${TRANSACTIONS_PATH}/${id}/corrections`;
}

export function listTransactions(
  api: ApiClient,
  query: Partial<TransactionListQuery> = {}
): Promise<TransactionListResponse> {
  return api.get<TransactionListResponse>(transactionsKey(query));
}

export function getTransaction(api: ApiClient, id: string): Promise<Transaction> {
  return api.get<Transaction>(transactionKey(id));
}

export function getTransactionCorrections(api: ApiClient, id: string): Promise<TransactionCorrectionListResponse> {
  return api.get<TransactionCorrectionListResponse>(transactionCorrectionsKey(id));
}

export function createManualTransaction(api: ApiClient, input: ManualTransactionInput): Promise<Transaction> {
  return api.post<Transaction>(`${TRANSACTIONS_PATH}/manual`, input);
}

export function correctTransaction(
  api: ApiClient,
  id: string,
  input: TransactionCorrectionInput
): Promise<Transaction> {
  return api.patch<Transaction>(transactionKey(id), input);
}

export function deleteTransaction(api: ApiClient, id: string): Promise<null> {
  return api.del<null>(transactionKey(id));
}
