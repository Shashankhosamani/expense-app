import { Hono } from "hono";
import { z } from "zod";
import { reviewListQuerySchema } from "@costiq/shared";
import type { Env } from "../env";
import { serviceClient } from "../db";
import { IncompleteExtractionError, approveReviewItem, dismissReviewItem, listReviewQueue } from "../services/review";

export const reviewRoute = new Hono<{ Bindings: Env; Variables: { userId: string } }>();

const approveSchema = z.object({ category_id: z.string().uuid().optional() });

reviewRoute.get("/", async (c) => {
  const parsed = reviewListQuerySchema.safeParse(Object.fromEntries(new URL(c.req.url).searchParams));
  if (!parsed.success) return c.json({ error: "invalid_query", details: parsed.error.flatten() }, 400);

  const db = serviceClient(c.env);
  return listReviewQueue(db, c.get("userId"), c.env, parsed.data).then((result) => c.json(result));
});

reviewRoute.post("/:id/approve", async (c) =>
  c.req
    .json()
    .catch(() => ({}))
    .then(async (body) => {
      const parsed = approveSchema.safeParse(body);
      if (!parsed.success) return c.json({ error: "invalid_body" }, 400);

      const db = serviceClient(c.env);
      return approveReviewItem(db, c.get("userId"), c.req.param("id"), parsed.data.category_id)
        .then((txn) => c.json(txn))
        .catch((err) => {
          if (err instanceof IncompleteExtractionError) {
            return c.json({ error: "cannot_approve_incomplete_extraction" }, 422);
          }
          throw err;
        });
    })
);

reviewRoute.post("/:id/dismiss", async (c) => {
  const db = serviceClient(c.env);
  return dismissReviewItem(db, c.get("userId"), c.req.param("id")).then(() => c.body(null, 204));
});
