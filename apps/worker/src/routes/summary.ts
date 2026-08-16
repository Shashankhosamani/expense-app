import { Hono } from "hono";
import type { Env } from "../env";
import { serviceClient } from "../db";
import { getInsights, getMonthlySummary } from "../services/summary";

export const summaryRoute = new Hono<{ Bindings: Env; Variables: { userId: string } }>();

const MONTH_RE = /^\d{4}-\d{2}$/;

summaryRoute.get("/insights", async (c) => {
  const month = c.req.query("month") ?? new Date().toISOString().slice(0, 7);
  const range = Number(c.req.query("months") ?? "6");
  if (!MONTH_RE.test(month)) return c.json({ error: "invalid_month" }, 400);

  const db = serviceClient(c.env);
  return getInsights(db, c.get("userId"), month, range).then((result) => c.json(result));
});

summaryRoute.get("/:month", async (c) => {
  const month = c.req.param("month");
  if (!MONTH_RE.test(month)) return c.json({ error: "invalid_month" }, 400);

  const db = serviceClient(c.env);
  return getMonthlySummary(db, c.get("userId"), month).then((result) => c.json(result));
});
