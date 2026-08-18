// One-off migration: moves any sms_messages rows still encrypted under the
// old flat SMS_DEMO_DECRYPT_KEY passphrase (in practice, just the seeded
// worked-injection-example row from supabase/seed.sql) onto the real
// per-user HKDF-derived key from ARCHITECTURE_2.md §6. Safe to re-run —
// rows already on the new key simply won't decrypt under the old one and
// are skipped.
//
// Only reaches PENDING_REVIEW rows (via the existing review_queue RPC,
// which is the only read path that already exists for pre-migration data);
// that's the only status the seeded row is ever in.
//
// Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... SMS_MASTER_KEY=... \
//        SMS_DEMO_DECRYPT_KEY=... pnpm --filter @costiq/worker reencrypt-demo-sms

import { createClient } from "@supabase/supabase-js";
import { deriveUserKey } from "../src/smsCrypto";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SMS_MASTER_KEY = process.env.SMS_MASTER_KEY;
const SMS_DEMO_DECRYPT_KEY = process.env.SMS_DEMO_DECRYPT_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !SMS_MASTER_KEY || !SMS_DEMO_DECRYPT_KEY) {
  console.error("Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SMS_MASTER_KEY, or SMS_DEMO_DECRYPT_KEY.");
  process.exit(1);
}

const db = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });

interface ReviewQueueRow {
  id: string;
}

async function main() {
  const { data: users, error: userError } = await db.auth.admin.listUsers();
  if (userError) throw userError;

  let migrated = 0;
  for (const user of users.users) {
    const { data, error } = await db.rpc("review_queue", { p_user_id: user.id, p_key: SMS_DEMO_DECRYPT_KEY });
    if (error) {
      // pgp_sym_decrypt throws on wrong key — expected for users with
      // nothing still on the old passphrase. Not fatal, just skip.
      continue;
    }
    const rows = (data ?? []) as ReviewQueueRow[];
    if (rows.length === 0) continue;

    const newKey = await deriveUserKey(SMS_MASTER_KEY, user.id);
    for (const row of rows) {
      const { error: reencryptError } = await db.rpc("reencrypt_sms_message", {
        p_id: row.id,
        p_user_id: user.id,
        p_old_key: SMS_DEMO_DECRYPT_KEY,
        p_new_key: newKey,
      });
      if (reencryptError) throw reencryptError;
      migrated += 1;
    }
  }

  console.log(`Re-encrypted ${migrated} row(s) onto the per-user derived key.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
