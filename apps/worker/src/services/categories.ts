import type { SupabaseClient } from "@supabase/supabase-js";
import type { Category, CategoryListQuery, CategoryListResponse } from "@costiq/shared";

export function listCategories(db: SupabaseClient, query: CategoryListQuery): Promise<CategoryListResponse> {
  const from = (query.page - 1) * query.limit;
  const to = from + query.limit - 1;

  return Promise.resolve(
    db.from("categories").select("id, name", { count: "exact" }).order("name").range(from, to).returns<Category[]>()
  ).then(({ data, error, count }) => {
    if (error) throw error;
    return { categories: data ?? [], total: count ?? 0, page: query.page, limit: query.limit };
  });
}
