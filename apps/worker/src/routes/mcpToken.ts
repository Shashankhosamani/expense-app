import { Hono } from "hono";
import type { Env } from "../env";
import { serviceClient } from "../db";
import { getMcpTokenStatus, issueMcpToken, revokeMcpToken } from "../services/mcpToken";

export const mcpTokenRoute = new Hono<{ Bindings: Env; Variables: { userId: string } }>();

mcpTokenRoute.get("/", async (c) => {
  const db = serviceClient(c.env);
  return getMcpTokenStatus(db, c.get("userId")).then((status) => c.json(status));
});

mcpTokenRoute.post("/", async (c) => {
  const db = serviceClient(c.env);
  return issueMcpToken(db, c.get("userId")).then((result) => c.json(result, 201));
});

mcpTokenRoute.delete("/", async (c) => {
  const db = serviceClient(c.env);
  return revokeMcpToken(db, c.get("userId")).then(() => c.body(null, 204));
});
