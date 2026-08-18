// Claude/MCP auth, ARCHITECTURE_2.md §15 — bearer token from
// profiles.mcp_token_hash, entirely separate from the Supabase-JWT
// requireUser() middleware every other /api/* route uses.
import type { SupabaseClient } from "@supabase/supabase-js";
import { sha256Hex } from "./services/mcpToken";

interface ProfileByTokenRow {
  id: string;
  mcp_token_revoked_at: string | null;
}

export class InvalidMcpTokenError extends Error {
  constructor() {
    super("invalid_mcp_token");
    this.name = "InvalidMcpTokenError";
  }
}

// Resolves user_id from the bearer token server-side — Claude never
// supplies or sees user_id directly (§5 layer 4).
export async function resolveMcpUser(db: SupabaseClient, bearerToken: string): Promise<string> {
  const hash = await sha256Hex(bearerToken);
  const { data, error } = await db
    .from("profiles")
    .select("id, mcp_token_revoked_at")
    .eq("mcp_token_hash", hash)
    .returns<ProfileByTokenRow[]>()
    .maybeSingle();
  if (error) throw error;
  if (!data || data.mcp_token_revoked_at) throw new InvalidMcpTokenError();

  await db.from("profiles").update({ mcp_token_last_used_at: new Date().toISOString() }).eq("id", data.id);

  return data.id;
}
