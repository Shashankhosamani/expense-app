const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8787";

export interface ZodFlattenedError {
  formErrors: string[];
  fieldErrors: Record<string, string[] | undefined>;
}

export interface ApiErrorBody {
  error: string;
  details?: ZodFlattenedError;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    public body: ApiErrorBody
  ) {
    super(code);
  }
}

export function apiRequest<T>(path: string, token: string | undefined, init?: RequestInit): Promise<T> {
  return fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
    cache: "no-store",
  }).then((res) => {
    if (!res.ok) {
      return res
        .json()
        .then((body: ApiErrorBody) => body)
        .catch((): ApiErrorBody => ({ error: res.statusText }))
        .then((body) => {
          throw new ApiError(res.status, body.error || res.statusText, body);
        });
    }
    if (res.status === 204) return null as T;
    return res.json().then((body: T) => body);
  });
}
