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
import { smsRoute } from "./routes/sms";
import { mcpRoute } from "./routes/mcp";

const app = new Hono<{ Bindings: Env; Variables: { userId: string } }>();

app.use(
  "*",
  cors({
    origin: (origin) => origin ?? "*",
    credentials: true,
  })
);

app.get("/health", (c) => c.json({ ok: true }));

// Data + ingestion group, ARCHITECTURE_2.md §15 — Supabase session JWT,
// same as the dashboard. The MCP tool group (below) is separate: Claude
// authenticates with profiles.mcp_token_hash, not a Supabase session.
app.use("/api/*", requireUser);
app.route("/api/transactions", transactionsRoute);
app.route("/api/summary", summaryRoute);
app.route("/api/budgets", budgetsRoute);
app.route("/api/review", reviewRoute);
app.route("/api/mcp-token", mcpTokenRoute);
app.route("/api/categories", categoriesRoute);
app.route("/api/sms", smsRoute);

// MCP (Claude → Worker), ARCHITECTURE_2.md §8/§15. Bearer-token-gated inside
// mcpRoute itself, not by the /api/* requireUser middleware above.
app.route("/mcp", mcpRoute);

app.onError((err, c) => {
  console.error(err);
  const origin = c.req.header("origin");
  if (origin) {
    c.header("Access-Control-Allow-Origin", origin);
    c.header("Access-Control-Allow-Credentials", "true");
    c.header("Vary", "Origin");
  }
  return c.json({ error: "internal_error" }, 500);
});

export default app;
