import { ApiRequestError } from "@/lib/api-error";

/**
 * Fetcher for the current user's account mutations, routed through
 * `app/api/account/[...path]` so the bearer token is attached server-side.
 *
 * Failures are raised as `ApiRequestError`, which carries only the status code —
 * the backend's own message is intentionally dropped here so it can never reach
 * a toast or the DOM. Call sites turn the status into copy with `friendlyError`.
 */

interface Envelope<T> {
  success: boolean;
  message: string;
  data: T;
}

/** Sentinel status for "the request never landed" (offline, DNS, CORS). */
const NETWORK_STATUS = 0;

const patch = async <T>(path: string, body: unknown): Promise<T> => {
  let response: Response;

  try {
    response = await fetch(`/api/account/${path}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiRequestError(NETWORK_STATUS);
  }

  let payload: Envelope<T> | null = null;

  try {
    payload = (await response.json()) as Envelope<T>;
  } catch {
    payload = null;
  }

  if (!response.ok || !payload?.success) {
    throw new ApiRequestError(response.status);
  }

  return payload.data;
};

export const accountApi = { patch };
