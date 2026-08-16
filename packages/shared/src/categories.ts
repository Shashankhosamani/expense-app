import type { z } from "zod";
import { paginationQuerySchema } from "./pagination.js";

// Seed list per ARCHITECTURE_2.md §10.
export const CATEGORY_NAMES = [
  "Food",
  "Shopping",
  "Travel",
  "Bills",
  "Subscriptions",
  "Entertainment",
  "Health",
  "Other",
] as const;

export type CategoryName = (typeof CATEGORY_NAMES)[number];

export interface Category {
  id: string;
  name: string;
}

export const categoryListQuerySchema = paginationQuerySchema;
export type CategoryListQuery = z.infer<typeof categoryListQuerySchema>;

export interface CategoryListResponse {
  categories: Category[];
  total: number;
  page: number;
  limit: number;
}
