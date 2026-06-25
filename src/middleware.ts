import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTES, PROTECTED_ROUTES, AUTH_ROUTES } from "@/constants/routes";

// =============================================================================
// Next.js Middleware — Route Protection
// =============================================================================
// Runs on the Edge before every navigation.
// Lightweight auth check: only verifies the existence of a refresh token.
// Full JWT validation happens server-side when the API is called.

const REFRESH_TOKEN_KEY = "mdcat_refresh_token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for refresh token in cookies (preferred) or build redirect URL
  const refreshToken = request.cookies.get(REFRESH_TOKEN_KEY)?.value;

  const isAuthenticated = Boolean(refreshToken);

  // Unauthenticated user trying to access protected route → redirect to login
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated user trying to access auth routes → redirect to dashboard
  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
  }

  return NextResponse.next();
}

// Only run middleware on app routes, not on static files or API routes
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (browser icon)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|fonts|icons|images).*)",
  ],
};
