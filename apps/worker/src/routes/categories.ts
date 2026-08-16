import { Hono } from "hono";
import { categoryListQuerySchema } from "@costiq/shared";
import type { Env } from "../env";
import { serviceClient } from "../db";
import { listCategories } from "../services/categories";

export const categoriesRoute = new Hono<{ Bindings: Env; Variables: { userId: string } }>();

categoriesRoute.get("/", async (c) => {
  const parsed = categoryListQuerySchema.safeParse(Object.fromEntries(new URL(c.req.url).searchParams));
  if (!parsed.success) return c.json({ error: "invalid_query", details: parsed.error.flatten() }, 400);

  const db = serviceClient(c.env);
  return listCategories(db, parsed.data).then((result) => c.json(result));
});
