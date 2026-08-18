import { Hono } from "hono";
import { smsIngestInputSchema } from "@costiq/shared";
import type { Env } from "../env";
import { serviceClient } from "../db";
import { ingestSms, RateLimitedError } from "../services/sms";

export const smsRoute = new Hono<{ Bindings: Env; Variables: { userId: string } }>();

smsRoute.post("/", async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = smsIngestInputSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: "invalid_body", details: parsed.error.flatten() }, 400);

  const db = serviceClient(c.env);
  try {
    const result = await ingestSms(db, c.get("userId"), c.env, parsed.data);
    return c.json(result, 201);
  } catch (err) {
    if (err instanceof RateLimitedError) return c.json({ error: "rate_limited" }, 429);
    throw err;
  }
});
