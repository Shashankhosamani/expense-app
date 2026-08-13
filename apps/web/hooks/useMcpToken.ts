"use client";

import useSWR from "swr";
import { useApiClient } from "@/lib/api";
import { MCP_TOKEN_PATH, getMcpTokenStatus, issueMcpToken, revokeMcpToken } from "@/lib/services/mcpToken";

export function useMcpToken() {
  const api = useApiClient();
  const { data, error, isLoading, mutate } = useSWR(MCP_TOKEN_PATH, () => getMcpTokenStatus(api));

  function issue() {
    return issueMcpToken(api).then((result) => mutate().then(() => result));
  }

  function revoke() {
    return revokeMcpToken(api).then(() => mutate()).then(() => undefined);
  }

  return { status: data ?? null, isLoading, error, issue, revoke };
}
