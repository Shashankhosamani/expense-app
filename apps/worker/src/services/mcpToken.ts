import type { SupabaseClient } from "@supabase/supabase-js";
import type { McpTokenIssueResponse, McpTokenStatus } from "@costiq/shared";

interface ProfileTokenRow {
  mcp_token_hash: string | null;
  mcp_token_issued_at: string | null;
  mcp_token_revoked_at: string | null;
  mcp_token_last_used_at: string | null;
}

function randomToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  return `kh_live_${hex}`;
}

function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  return crypto.subtle
    .digest("SHA-256", data)
    .then((digest) => [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join(""));
}

export function getMcpTokenStatus(db: SupabaseClient, userId: string): Promise<McpTokenStatus> {
  return Promise.resolve(
    db
      .from("profiles")
      .select("mcp_token_hash, mcp_token_issued_at, mcp_token_revoked_at, mcp_token_last_used_at")
      .eq("id", userId)
      .returns<ProfileTokenRow[]>()
      .maybeSingle()
  ).then(({ data, error }) => {
    if (error) throw error;
    return {
      active: !!data?.mcp_token_hash && !data?.mcp_token_revoked_at,
      issued_at: data?.mcp_token_issued_at ?? null,
      revoked_at: data?.mcp_token_revoked_at ?? null,
      last_used_at: data?.mcp_token_last_used_at ?? null,
    };
  });
}

export function issueMcpToken(db: SupabaseClient, userId: string): Promise<McpTokenIssueResponse> {
  const token = randomToken();
  const issued_at = new Date().toISOString();

  return sha256Hex(token)
    .then((hash) =>
      Promise.resolve(
        db.from("profiles").upsert(
          {
            id: userId,
            mcp_token_hash: hash,
            mcp_token_issued_at: issued_at,
            mcp_token_revoked_at: null,
          },
          { onConflict: "id" }
        )
      )
    )
    .then(({ error }) => {
      if (error) throw error;
      return { token, issued_at };
    });
}

export function revokeMcpToken(db: SupabaseClient, userId: string): Promise<void> {
  return Promise.resolve(
    db.from("profiles").update({ mcp_token_revoked_at: new Date().toISOString() }).eq("id", userId)
  ).then(({ error }) => {
    if (error) throw error;
  });
}
