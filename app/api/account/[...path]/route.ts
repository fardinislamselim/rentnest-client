import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

import { env } from "@/config/env";

/**
 * Auth-forwarding proxy for the current user's own account mutations.
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

  const contentType = request.headers.get("content-type") ?? "";
  const isMultipart = contentType.includes("multipart/form-data");

  let upstreamBody: BodyInit;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  if (isMultipart) {
    upstreamBody = await request.formData();
  } else {
    headers["Content-Type"] = "application/json";
    upstreamBody = await request.text();
  }

  let upstream: Response;

  try {
    upstream = await fetch(`${env.apiUrl}${upstreamPath}`, {
      method: "PATCH",
      headers,
      body: upstreamBody,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not reach the server. Please try again." },
      { status: 502 },
    );
  }

  const text = await upstream.text();

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
