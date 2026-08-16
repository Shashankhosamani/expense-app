import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./env";
import { requireUser } from "./auth";
import { transactionsRoute } from "./routes/transactions";
import { summaryRoute } from "./routes/summary";
import { budgetsRoute } from "./routes/budgets";
import { reviewRoute } from "./routes/review";
import { mcpTokenRoute } from "./routes/mcpToken";
import { categoriesRoute } from "./routes/categories";

const app = new Hono<{ Bindings: Env; Variables: { userId: string } }>();

app.use(
  "*",
  cors({
    origin: (origin) => origin ?? "*",
    credentials: true,
  })
);

app.get("/health", (c) => c.json({ ok: true }));

// Data group, ARCHITECTURE_2.md §15. Ingestion (POST /api/sms) and the MCP
// tool group are deferred — see the implementation plan.
app.use("/api/*", requireUser);
app.route("/api/transactions", transactionsRoute);
app.route("/api/summary", summaryRoute);
app.route("/api/budgets", budgetsRoute);
app.route("/api/review", reviewRoute);
app.route("/api/mcp-token", mcpTokenRoute);
app.route("/api/categories", categoriesRoute);

app.onError((err, c) => {
  console.error(err);
  return c.json({ error: "internal_error" }, 500);
});

export default app;
