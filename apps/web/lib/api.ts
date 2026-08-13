"use client";

import { useCallback, useMemo } from "react";
import type { Session } from "@supabase/supabase-js";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { apiRequest } from "@/lib/api-request";

export { ApiError } from "@/lib/api-request";
export type { ApiErrorBody, ZodFlattenedError } from "@/lib/api-request";

export interface ApiClient {
  get: <T>(path: string) => Promise<T>;
  post: <T>(path: string, body?: object) => Promise<T>;
  patch: <T>(path: string, body?: object) => Promise<T>;
  put: <T>(path: string, body?: object) => Promise<T>;
  del: <T>(path: string) => Promise<T>;
}

// Stable across renders (memoized) so it can be used directly as an effect
// dependency or an SWR fetcher without causing extra revalidation.
export function useApiClient(): ApiClient {
  const supabase = useMemo(() => createBrowserClient(), []);

  const call = useCallback(
    <T>(path: string, init?: RequestInit): Promise<T> =>
      supabase.auth
        .getSession()
        .then(({ data }: { data: { session: Session | null } }) => apiRequest<T>(path, data.session?.access_token, init)),
    [supabase]
  );

  return useMemo(
    () => ({
      get: <T>(path: string) => call<T>(path),
      post: <T>(path: string, body?: object) =>
        call<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
      patch: <T>(path: string, body?: object) =>
        call<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
      put: <T>(path: string, body?: object) =>
        call<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
      del: <T>(path: string) => call<T>(path, { method: "DELETE" }),
    }),
    [call]
  );
}
