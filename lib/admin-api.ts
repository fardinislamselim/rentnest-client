import type { PaginationMeta } from "@/types/api";

/**
 * Fetcher for the admin endpoints, routed through `app/api/admin/[...path]`.
 *
 * The proxy attaches the bearer token server-side and returns the backend's
 * status code and JSON body verbatim, so what comes back here is exactly the
 * `sendResponse()` envelope the backend emits: `{ success, message, data }`
 * plus `meta` on the paginated list endpoints.
 */

export interface AdminEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

/** Query values are dropped when empty so the backend sees only real filters. */
export type AdminQuery = Record<string, string | number | undefined | null>;

const buildSearch = (query?: AdminQuery): string => {
  if (!query) return "";

  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    params.set(key, String(value));
  }

  const search = params.toString();
  return search ? `?${search}` : "";
};

const request = async <T>(
  path: string,
  init: RequestInit,
  query?: AdminQuery,
): Promise<AdminEnvelope<T>> => {
  const response = await fetch(`/api/admin${path}${buildSearch(query)}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
  });

  let payload: AdminEnvelope<T> | null = null;

  try {
    payload = (await response.json()) as AdminEnvelope<T>;
  } catch {
    payload = null;
  }

  if (!response.ok || !payload?.success) {
    throw new Error(
      payload?.message || `Request failed with status ${response.status}`,
    );
  }

  return payload;
};

export const adminApi = {
  get: <T>(path: string, query?: AdminQuery) =>
    request<T>(path, { method: "GET" }, query),

  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),

  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
