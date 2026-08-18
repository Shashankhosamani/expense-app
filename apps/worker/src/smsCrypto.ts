// SMS encryption key + dedup hash helpers, ARCHITECTURE_2.md §6/§11.
//
// userKey = HKDF(SMS_MASTER_KEY, user_id) — derived fresh per request, never
// stored. Limits the blast radius of any single derived key to one user;
// the master key itself never leaves this Worker (env.SMS_MASTER_KEY,
// a `wrangler secret`, never touches Supabase). Passed to pgcrypto's
// pgp_sym_encrypt/pgp_sym_decrypt as a hex-string passphrase.
const HKDF_SALT = "costiq-sms-v1";

export async function deriveUserKey(masterKey: string, userId: string): Promise<string> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(masterKey), "HKDF", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "HKDF", hash: "SHA-256", salt: enc.encode(HKDF_SALT), info: enc.encode(userId) },
    keyMaterial,
    256
  );
  return [...new Uint8Array(bits)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function normalizeBody(body: string): string {
  return body.trim().replace(/\s+/g, " ").toLowerCase();
}

function roundToMinute(iso: string): string {
  const d = new Date(iso);
  d.setSeconds(0, 0);
  return d.toISOString();
}

// message_hash — reference_id isn't known pre-parse at ingestion time, so
// this is always the fallback scheme from §11: sender + normalized body +
// received_at rounded to the minute.
export function smsMessageHash(sender: string, rawMessage: string, receivedAt: string): Promise<string> {
  return sha256Hex(`${sender}|${normalizeBody(rawMessage)}|${roundToMinute(receivedAt)}`);
}
