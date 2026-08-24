import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

import { env } from "@/config/env";

/**
 * Auth-forwarding proxy for the backend's `/admin/*` endpoints.
 *
 * Why this exists: the browser never holds a backend-readable credential. The
 * access token lives in an httpOnly cookie set on *this* origin by
 * `loginAction`, so client-side JS cannot read it, and the backend's own
 * `Set-Cookie` uses `sameSite:"none"` with `secure:false` — a combination every
 * modern browser drops. `lib/axios.ts` therefore only attaches the bearer token
 * when running on the server (`typeof window === "undefined"`).
 *
 * This handler runs on the server, reads that cookie, and forwards the request
 * to the real backend route unchanged: same method, same path, same query, same
 * body. The backend's `auth(Role.ADMIN)` guard remains the only authority on
 * who may call these endpoints; nothing is authorized here. Status codes and
 * JSON bodies are passed straight through so callers see backend semantics.
 */

const ADMIN_PREFIX = "/admin";

/** Reject traversal and empty segments before rebuilding the upstream path. */
const buildUpstreamPath = (segments: string[]): string | null => {
  if (segments.length === 0) return null;

  for (const segment of segments) {
    if (!segment || segment === "." || segment === "..") return null;
  }

  return `${ADMIN_PREFIX}/${segments.map(encodeURIComponent).join("/")}`;
};

const forward = async (
  request: NextRequest,
  segments: string[],
  method: "GET" | "PATCH" | "DELETE",
) => {
  const upstreamPath = buildUpstreamPath(segments);

  if (!upstreamPath) {
    return NextResponse.json(
      { success: false, message: "Invalid admin endpoint" },
      { status: 400 },
    );
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "You are not authorized" },
      { status: 401 },
    );
  }

  const search = request.nextUrl.search;
  const upstreamUrl = `${env.apiUrl}${upstreamPath}${search}`;

  const headers: HeadersInit = { Authorization: `Bearer ${token}` };
  let body: string | undefined;

  if (method === "PATCH") {
    body = await request.text();
    headers["Content-Type"] = "application/json";
  }

  let upstream: Response;

  try {
    upstream = await fetch(upstreamUrl, {
      method,
      headers,
      body,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not reach the server. Please try again." },
      { status: 502 },
    );
  }

  const text = await upstream.text();

  // Pass the backend payload through untouched when it is JSON, so callers read
  // real backend messages rather than anything invented here.
  try {
    return NextResponse.json(JSON.parse(text), { status: upstream.status });
  } catch {
    return NextResponse.json(
      { success: false, message: text || "Unexpected response from the server" },
      { status: upstream.status },
    );
  }
};

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, ctx: RouteContext) {
  const { path } = await ctx.params;
  return forward(request, path, "GET");
}

export async function PATCH(request: NextRequest, ctx: RouteContext) {
  const { path } = await ctx.params;
  return forward(request, path, "PATCH");
}

export async function DELETE(request: NextRequest, ctx: RouteContext) {
  const { path } = await ctx.params;
  return forward(request, path, "DELETE");
}
