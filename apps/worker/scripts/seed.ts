// Seeds one demo month of transactions + the worked injection-example review
// row for a given user. Requires SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and
// SEED_USER_EMAIL in the environment (create the user first via Supabase
// Studio or `supabase auth`).
//
// Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... SEED_USER_EMAIL=you@example.com pnpm seed

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SEED_USER_EMAIL = process.env.SEED_USER_EMAIL;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !SEED_USER_EMAIL) {
  console.error("Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or SEED_USER_EMAIL.");
  process.exit(1);
}

const db = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });

async function main() {
  const { data: users, error: userError } = await db.auth.admin.listUsers();
  if (userError) throw userError;
  const user = users.users.find((u) => u.email === SEED_USER_EMAIL);
  if (!user) {
    console.error(`No user with email ${SEED_USER_EMAIL}. Create one first.`);
    process.exit(1);
  }
  const activeUser = user!;

  const { data: categories, error: catError } = await db.from("categories").select("id, name");
  if (catError) throw catError;
  const catId = (name: string) => categories?.find((c) => c.name === name)?.id ?? null;

  const rows = [
    { amount: 642.5, merchant: "Blinkit", category: "Shopping", method: "UPI", ref: "REF10001", at: "2026-08-09T19:14:55+05:30" },
    { amount: 389.0, merchant: "Swiggy", category: "Food", method: "UPI", ref: "REF10002", at: "2026-08-08T20:31:00+05:30" },
    { amount: 214.0, merchant: "Uber", category: "Travel", method: "card", ref: "REF10003", at: "2026-08-08T09:02:00+05:30" },
    { amount: 199.0, merchant: "Netflix", category: "Subscriptions", method: "card", ref: "REF10004", at: "2026-08-07T00:05:00+05:30" },
    { amount: 1284.0, merchant: "Blinkit", category: "Shopping", method: "UPI", ref: "REF10005", at: "2026-08-07T18:55:00+05:30" },
    { amount: 340.0, merchant: "Third Wave Coffee", category: "Food", method: "UPI", ref: null, at: "2026-08-06T20:31:00+05:30" },
  ];

  const { error: insertError } = await db.from("transactions").insert(
    rows.map((r) => ({
      user_id: activeUser.id,
      amount: r.amount,
      currency: "INR",
      type: "debit",
      merchant: r.merchant,
      category_id: catId(r.category),
      bank: "HDFC",
      account_last4: "1233",
      payment_method: r.method,
      transaction_at: r.at,
      reference_id: r.ref,
      source: "sms",
    }))
  );
  if (insertError) throw insertError;

  console.log(`Seeded ${rows.length} transactions for ${SEED_USER_EMAIL}.`);
  console.log(
    "Note: the suspicious review-row + budget demo data need pgcrypto encryption " +
      "and are seeded via supabase/seed.sql instead (run with psql — see supabase/README.md)."
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
