import { z } from "zod";

// Shared page/limit pagination contract for every listing endpoint.
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export function paginationRange(query: PaginationQuery): { from: number; to: number } {
  const from = (query.page - 1) * query.limit;
  return { from, to: from + query.limit - 1 };
}
