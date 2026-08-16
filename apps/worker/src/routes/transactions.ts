import { Hono } from "hono";
import {
  manualTransactionInputSchema,
  transactionCorrectionInputSchema,
  transactionCorrectionListQuerySchema,
  transactionListQuerySchema,
} from "@costiq/shared";
import type { Env } from "../env";
import { serviceClient } from "../db";
import {
  correctTransaction,
  createManualTransaction,
  getTransaction,
  getTransactionCorrections,
  listTransactions,
  softDeleteTransaction,
} from "../services/transactions";

export const transactionsRoute = new Hono<{ Bindings: Env; Variables: { userId: string } }>();

transactionsRoute.get("/", async (c) => {
  const parsed = transactionListQuerySchema.safeParse(Object.fromEntries(new URL(c.req.url).searchParams));
  if (!parsed.success) return c.json({ error: "invalid_query", details: parsed.error.flatten() }, 400);

  const db = serviceClient(c.env);
  return listTransactions(db, c.get("userId"), parsed.data).then((result) => c.json(result));
});

transactionsRoute.post("/manual", async (c) =>
  c.req
    .json()
    .catch(() => null)
    .then(async (body) => {
      const parsed = manualTransactionInputSchema.safeParse(body);
      if (!parsed.success) return c.json({ error: "invalid_body", details: parsed.error.flatten() }, 400);

      const db = serviceClient(c.env);
      return createManualTransaction(db, c.get("userId"), parsed.data).then((txn) => c.json(txn, 201));
    })
);

transactionsRoute.get("/:id", async (c) => {
  const db = serviceClient(c.env);
  return getTransaction(db, c.get("userId"), c.req.param("id")).then((txn) =>
    txn ? c.json(txn) : c.json({ error: "not_found" }, 404)
  );
});

transactionsRoute.patch("/:id", async (c) =>
  c.req
    .json()
    .catch(() => null)
    .then(async (body) => {
      const parsed = transactionCorrectionInputSchema.safeParse(body);
      if (!parsed.success) return c.json({ error: "invalid_body", details: parsed.error.flatten() }, 400);

      const db = serviceClient(c.env);
      return correctTransaction(db, c.get("userId"), c.req.param("id"), parsed.data).then((txn) => c.json(txn));
    })
);

transactionsRoute.get("/:id/corrections", async (c) => {
  const parsed = transactionCorrectionListQuerySchema.safeParse(Object.fromEntries(new URL(c.req.url).searchParams));
  if (!parsed.success) return c.json({ error: "invalid_query", details: parsed.error.flatten() }, 400);

  const db = serviceClient(c.env);
  return getTransactionCorrections(db, c.req.param("id"), parsed.data).then((result) => c.json(result));
});

transactionsRoute.delete("/:id", async (c) => {
  const db = serviceClient(c.env);
  return softDeleteTransaction(db, c.get("userId"), c.req.param("id")).then(() => c.body(null, 204));
});
