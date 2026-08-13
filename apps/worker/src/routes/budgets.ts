import { Hono } from "hono";
import { budgetUpsertInputSchema } from "@costiq/shared";
import type { Env } from "../env";
import { serviceClient } from "../db";
import { getBudgetStatus, upsertBudget } from "../services/budgets";
import { getMonthlySummary } from "../services/summary";

export const budgetsRoute = new Hono<{ Bindings: Env; Variables: { userId: string } }>();

const MONTH_RE = /^\d{4}-\d{2}$/;

function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split("-").map(Number);
  const total = y * 12 + (m - 1) + delta;
  const ny = Math.floor(total / 12);
  const nm = (total % 12) + 1;
  return `${ny}-${String(nm).padStart(2, "0")}`;
}

budgetsRoute.get("/:month", async (c) => {
  const month = c.req.param("month");
  if (!MONTH_RE.test(month)) return c.json({ error: "invalid_month" }, 400);

  const db = serviceClient(c.env);
  const userId = c.get("userId");

  return Promise.all([getMonthlySummary(db, userId, month), getMonthlySummary(db, userId, shiftMonth(month, -1))])
    .then(([summary, lastMonthSummary]) =>
      getBudgetStatus(db, userId, month, summary.total_spent, lastMonthSummary.total_spent)
    )
    .then((status) => (status ? c.json(status) : c.json({ error: "no_budget_set" }, 404)));
});

budgetsRoute.put("/:month", async (c) => {
  const month = c.req.param("month");
  if (!MONTH_RE.test(month)) return c.json({ error: "invalid_month" }, 400);

  return c.req
    .json()
    .catch(() => null)
    .then(async (body) => {
      const parsed = budgetUpsertInputSchema.safeParse(body);
      if (!parsed.success) return c.json({ error: "invalid_body", details: parsed.error.flatten() }, 400);

      const db = serviceClient(c.env);
      return upsertBudget(db, c.get("userId"), month, parsed.data).then((budget) => c.json(budget));
    });
});
