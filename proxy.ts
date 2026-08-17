import { jwtUtils } from "@/lib/jwt";
import { getNewAccessToken } from "@/service/refreshToken";
import { JwtPayload } from "jsonwebtoken";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_ROUTES = ["/", "/properties", "/about", "/contact"];

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const response = NextResponse.next();

  let accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const accessSecret = process.env.JWT_ACCESS_SECRET || "accesssecret";
  const refreshSecret = process.env.JWT_REFRESH_SECRET || "refreshsecret";

  let decodedAccessToken = accessToken
    ? jwtUtils.verifyToken(accessToken, accessSecret)
    : null;

  const decodedRefreshToken = refreshToken
    ? jwtUtils.verifyToken(refreshToken, refreshSecret)
    : null;

  // Auto refresh access token if expired but refresh token is valid
  if (!decodedAccessToken?.success && decodedRefreshToken?.success && refreshToken) {
    const refreshResult = await getNewAccessToken(refreshToken);

    if (refreshResult.success && refreshResult.data?.accessToken) {
      accessToken = refreshResult.data.accessToken;
      response.cookies.set("accessToken", accessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 1 day
        sameSite: "lax",
        secure: true,
      });

      decodedAccessToken = jwtUtils.verifyToken(accessToken, accessSecret);
    }
  }

  let userRole: string | null = null;

  if (accessToken) {
    const decodedPayload = jwtUtils.decodeToken(accessToken);
    if (decodedPayload && typeof decodedPayload === "object") {
      userRole = (decodedPayload as JwtPayload).role || null;
    }
  }

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  // 1. If logged in user tries to visit login or register, redirect to role-based dashboard
  if (accessToken && isAuthRoute) {
    if (userRole === "LANDLORD") {
      return NextResponse.redirect(new URL("/landlord-dashboard", request.url));
    } else if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin-dashboard", request.url));
    } else {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // 2. Protected routes check: redirect unauthenticated users to login
  if (!accessToken && !isPublicRoute && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Role-based Dashboard routing & Access Control
  if (pathname === "/dashboard") {
    if (userRole === "LANDLORD") {
      return NextResponse.redirect(new URL("/landlord-dashboard", request.url));
    } else if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/admin-dashboard", request.url));
    }
  }

  if (pathname.startsWith("/landlord-dashboard") && userRole !== "LANDLORD" && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  } else if (pathname.startsWith("/admin-dashboard") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/not-found", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.svg$|.*\\.jpg$).*)",
  ],
};