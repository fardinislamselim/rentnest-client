/**
 * Turns anything that was thrown into copy that is safe to show a user.
 *
 * Nothing returned from this module originates from the server, an exception
 * message, or a stack trace. Messages are chosen locally from the HTTP status,
 * which keeps `AxiosError: Request failed with status code 500` strings, Prisma
 * and Zod internals, and raw 500-page HTML out of the UI — and keeps the wording
 * consistent across every flow in the app.
 *
 * Callers that need sharper copy for one specific status (for example, 401 on a
 * change-password form means "wrong current password", not "session expired")
 * pass a `byStatus` override rather than reaching for the server's message.
 */

export const NETWORK_ERROR_MESSAGE =
  "We couldn't reach the server. Check your connection and try again.";

const DEFAULT_MESSAGE = "Something went wrong. Please try again.";

/** Status 0 is the sentinel our fetchers use for "the request never landed". */
const STATUS_COPY: Record<number, string> = {
  0: NETWORK_ERROR_MESSAGE,
  400: "Some of the details you entered aren't valid. Please check them and try again.",
  401: "Your session has expired. Please sign in again.",
  403: "You don't have permission to do that.",
  404: "We couldn't find what you were looking for.",
  409: "That already exists. Please try a different value.",
  413: "That file is too large. Please choose a smaller one.",
  422: "Some of the details you entered aren't valid. Please check them and try again.",
  429: "Too many attempts. Please wait a moment and try again.",
  500: "Something went wrong on our end. Please try again.",
  502: "We couldn't reach the server. Please try again.",
  503: "The service is temporarily unavailable. Please try again shortly.",
  504: "The server took too long to respond. Please try again.",
};

export const messageForStatus = (status: number): string => {
  const copy = STATUS_COPY[status];
  if (copy) return copy;
  if (status >= 500) return STATUS_COPY[500];
  if (status >= 400) return STATUS_COPY[400];
  return DEFAULT_MESSAGE;
};

/**
 * A failed API call, carrying only the status code.
 *
 * The `message` is deliberately the user-facing copy for that status, never the
 * server's. That way even an accidental `{error.message}` render somewhere in
 * the tree shows something safe instead of leaking backend internals.
 */
export class ApiRequestError extends Error {
  readonly status: number;

  constructor(status: number) {
    super(messageForStatus(status));
    this.name = "ApiRequestError";
    this.status = status;
  }
}

/** Reads a status off our own errors or an AxiosError, without importing axios. */
export const getErrorStatus = (error: unknown): number | undefined => {
  if (error instanceof ApiRequestError) return error.status;

  if (typeof error === "object" && error !== null) {
    const status = (error as { response?: { status?: unknown } }).response?.status;
    if (typeof status === "number") return status;
  }

  return undefined;
};

/** A request that never got a response: offline, DNS failure, CORS, abort. */
const isNetworkFailure = (error: unknown): boolean => {
  if (error instanceof TypeError) return true;

  if (typeof error === "object" && error !== null) {
    const code = (error as { code?: unknown }).code;
    if (code === "ERR_NETWORK" || code === "ECONNABORTED") return true;
  }

  return false;
};

export interface FriendlyErrorOptions {
  /** Used when the failure has no status at all and isn't a network failure. */
  fallback?: string;
  /** Per-status copy that beats the shared default for this one call site. */
  byStatus?: Partial<Record<number, string>>;
}

export const friendlyError = (
  error: unknown,
  options: FriendlyErrorOptions = {},
): string => {
  const status = getErrorStatus(error);

  if (status !== undefined) {
    return options.byStatus?.[status] ?? messageForStatus(status);
  }

  if (isNetworkFailure(error)) return NETWORK_ERROR_MESSAGE;

  return options.fallback ?? DEFAULT_MESSAGE;
};
