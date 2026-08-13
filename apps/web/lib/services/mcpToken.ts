import type { McpTokenIssueResponse, McpTokenStatus } from "@costiq/shared";
import type { ApiClient } from "@/lib/api";

export const MCP_TOKEN_PATH = "/api/mcp-token";

export function getMcpTokenStatus(api: ApiClient): Promise<McpTokenStatus> {
  return api.get<McpTokenStatus>(MCP_TOKEN_PATH);
}

export function issueMcpToken(api: ApiClient): Promise<McpTokenIssueResponse> {
  return api.post<McpTokenIssueResponse>(MCP_TOKEN_PATH);
}

export function revokeMcpToken(api: ApiClient): Promise<null> {
  return api.del<null>(MCP_TOKEN_PATH);
}
