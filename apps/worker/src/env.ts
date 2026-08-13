export interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  // Placeholder for demo review-queue rows only — see supabase/migrations/0004_review_rpc.sql.
  // Real SMS encryption (§6) is deferred along with the rest of the MCP pipeline.
  SMS_DEMO_DECRYPT_KEY: string;
}
