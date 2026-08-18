export interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  // Master secret for per-user SMS encryption keys (ARCHITECTURE_2.md §6):
  // userKey = HKDF(SMS_MASTER_KEY, user_id). Never touches Supabase; derived
  // keys are computed fresh per request in apps/worker/src/smsCrypto.ts.
  SMS_MASTER_KEY: string;
  // Legacy flat passphrase the original demo review row was encrypted with,
  // before per-user derivation existed. Only used by
  // scripts/reencrypt-demo-sms.ts to migrate old rows onto the real scheme —
  // not read anywhere in the live request path anymore.
  SMS_DEMO_DECRYPT_KEY: string;
}
