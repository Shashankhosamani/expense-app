import type { Context, Next } from "hono";
import type { Env } from "./env";
import { serviceClient } from "./db";

// user_id is always resolved server-side from the verified Supabase session
// JWT — never trusted from a request body or query param (§2, §14).
export async function requireUser(c: Context<{ Bindings: Env; Variables: { userId: string } }>, next: Next) {
  const authHeader = c.req.header("authorization");
  const token = authHeader?.match(/^Bearer (.+)$/)?.[1];
  if (!token) {
    return c.json({ error: "missing_token" }, 401);
  }

  const supabase = serviceClient(c.env);
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return c.json({ error: "invalid_token" }, 401);
  }

  c.set("userId", data.user.id);
  await next();
}
