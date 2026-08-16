import type { CategoryListResponse } from "@costiq/shared";
import type { ApiClient } from "@/lib/api";

export const CATEGORIES_PATH = "/api/categories";

// Fixed, tiny seed list (§10) — one page comfortably covers all of them.
export function categoriesKey(): string {
  return `${CATEGORIES_PATH}?limit=100`;
}

export function listCategories(api: ApiClient): Promise<CategoryListResponse> {
  return api.get<CategoryListResponse>(categoriesKey());
}
