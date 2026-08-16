"use client";

import useSWR from "swr";
import type { ManualTransactionInput, TransactionCorrectionInput, TransactionListQuery } from "@costiq/shared";
import { useApiClient } from "@/lib/api";
import {
  correctTransaction,
  createManualTransaction,
  deleteTransaction,
  getTransaction,
  getTransactionCorrections,
  listTransactions,
  transactionCorrectionsKey,
  transactionKey,
  transactionsKey,
} from "@/lib/services/transactions";
import { revalidate } from "@/lib/swr";

const RELATED_PATHS = ["/api/transactions", "/api/summary", "/api/budgets", "/api/review"];

export function useTransactions(query: Partial<TransactionListQuery> = {}) {
  const api = useApiClient();
  const { data, error, isLoading, mutate } = useSWR(transactionsKey(query), () => listTransactions(api, query));

  return {
    transactions: data?.transactions ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? query.page ?? 1,
    limit: data?.limit ?? query.limit ?? 20,
    isLoading,
    error,
    refresh: () => mutate(),
  };
}

export function useTransaction(id: string) {
  const api = useApiClient();
  const { data, error, isLoading, mutate } = useSWR(transactionKey(id), () => getTransaction(api, id));
  return { transaction: data, isLoading, error, refresh: () => mutate() };
}

export function useTransactionCorrections(id: string) {
  const api = useApiClient();
  const { data, error, isLoading, mutate } = useSWR(transactionCorrectionsKey(id), () =>
    getTransactionCorrections(api, id)
  );
  return { corrections: data?.corrections ?? [], isLoading, error, refresh: () => mutate() };
}

export function useCreateManualTransaction() {
  const api = useApiClient();
  return (input: ManualTransactionInput) =>
    createManualTransaction(api, input).then((txn) => revalidate(RELATED_PATHS).then(() => txn));
}

export function useCorrectTransaction(id: string) {
  const api = useApiClient();
  return (input: TransactionCorrectionInput) =>
    correctTransaction(api, id, input).then((txn) =>
      revalidate([...RELATED_PATHS, transactionCorrectionsKey(id)]).then(() => txn)
    );
}

export function useDeleteTransaction() {
  const api = useApiClient();
  return (id: string) => deleteTransaction(api, id).then(() => revalidate(RELATED_PATHS)).then(() => undefined);
}
