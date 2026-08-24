import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

import { env } from "@/config/env";

/**
 * Auth-forwarding proxy for the current user's own account mutations.
 *
 * Same reason the admin proxy exists: the browser holds no backend-readable
 * credential. The access token is an httpOnly cookie on *this* origin, so
 * client JS can't attach it, and `lib/axios.ts` only sets the bearer header
 * server-side. This handler runs on the server, reads that cookie, and forwards
 * to the real backend route with the token attached.
 *
 * Only the three account routes below are reachable; every other path 404s.
 * That keeps this from becoming a general `/user` / `/auth` passthrough — it can
 * update the caller's own profile, avatar and password and nothing else. The
 * backend's own `auth()` guard still authorizes each call.
 */

// Client sub-path (after /api/account) -> real backend path.
const ROUTES: Record<string, string> = {
  profile: "/user/profile",
  "profile/picture": "/user/profile/picture",
  "change-password": "/auth/change-password",
};

const resolveUpstream = (segments: string[]): string | null => {
  const key = segments.join("/");
  return ROUTES[key] ?? null;
};

const forward = async (request: NextRequest, segments: string[]) => {
  const upstreamPath = resolveUpstream(segments);

  if (!upstreamPath) {
    return NextResponse.json(
      { success: false, message: "Not found" },
      { status: 404 },
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

  const body = await request.text();

  let upstream: Response;

  try {
    upstream = await fetch(`${env.apiUrl}${upstreamPath}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
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

  // Pass the backend status through unchanged so the client can map it to
  // user-facing copy; the body is forwarded as-is only for the success payload.
  try {
    return NextResponse.json(JSON.parse(text), { status: upstream.status });
  } catch {
    return NextResponse.json(
      { success: false, message: "Unexpected response from the server" },
      { status: upstream.status },
    );
  }
};

type RouteContext = { params: Promise<{ path: string[] }> };

export async function PATCH(request: NextRequest, ctx: RouteContext) {
  const { path } = await ctx.params;
  return forward(request, path);
}
