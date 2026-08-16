export interface McpTokenStatus {
  active: boolean;
  issued_at: string | null;
  revoked_at: string | null;
  last_used_at: string | null;
}

// Only returned once, at issue/rotate time — never persisted in plaintext.
export interface McpTokenIssueResponse {
  token: string;
  issued_at: string;
}
