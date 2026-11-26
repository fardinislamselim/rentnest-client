import { ApiRequestError } from "@/lib/api-error";
import type { IApiErrorSource, IApiResponse } from "@/types/api";

/**
 * Fetcher for the current user's account mutations, routed through
 * `app/api/account/[...path]` so the bearer token is attached server-side.
 */

/** Sentinel status for "the request never landed" (offline, DNS, CORS). */
const NETWORK_STATUS = 0;

const patch = async <T>(path: string, body: unknown): Promise<T> => {
  const isFormData = body instanceof FormData;
  let response: Response;

  try {
    response = await fetch(`/api/account/${path}`, {
      method: "PATCH",
      headers: isFormData ? undefined : { "Content-Type": "application/json" },
      body: isFormData ? body : JSON.stringify(body),
    });
  } catch {
    throw new ApiRequestError(NETWORK_STATUS);
  }

  let payload: (Partial<IApiResponse<T>> & { errorSources?: IApiErrorSource[] }) | null = null;

  try {
    payload = (await response.json()) as Partial<IApiResponse<T>> & {
      errorSources?: IApiErrorSource[];
    };
  } catch {
    payload = null;
  }

  if (!response.ok || !payload?.success) {
    throw new ApiRequestError(
      response.status,
      payload?.message,
      payload?.errorSources,
    );
  }

  return payload.data as T;
};

export const accountApi = { patch };
