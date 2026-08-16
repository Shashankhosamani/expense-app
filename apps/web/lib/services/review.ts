import type { ReviewListQuery, ReviewListResponse, Transaction } from "@costiq/shared";
import type { ApiClient } from "@/lib/api";

export const REVIEW_PATH = "/api/review";

export function reviewKey(query: Partial<ReviewListQuery> = {}): string {
  const params = new URLSearchParams();
  if (query.page) params.set("page", String(query.page));
  if (query.limit) params.set("limit", String(query.limit));
  const qs = params.toString();
  return qs ? `${REVIEW_PATH}?${qs}` : REVIEW_PATH;
}

export function listReviewQueue(api: ApiClient, query: Partial<ReviewListQuery> = {}): Promise<ReviewListResponse> {
  return api.get<ReviewListResponse>(reviewKey(query));
}

export function approveReviewItem(api: ApiClient, id: string, categoryId?: string): Promise<Transaction> {
  return api.post<Transaction>(`${REVIEW_PATH}/${id}/approve`, categoryId ? { category_id: categoryId } : {});
}

export function dismissReviewItem(api: ApiClient, id: string): Promise<null> {
  return api.post<null>(`${REVIEW_PATH}/${id}/dismiss`);
}
