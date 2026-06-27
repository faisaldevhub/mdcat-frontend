// =============================================================================
// Auth Cookies Utility
// =============================================================================
// Centralized utility for managing the refresh token cookie on the client side.
// The refresh token must be stored in a cookie (rather than localStorage) 
// so that Next.js Edge Middleware can read it to protect routes.

const REFRESH_TOKEN_KEY = "mdcat_refresh_token";
const COOKIE_MAX_AGE = 2592000; // 30 days in seconds

/**
 * Retrieves the refresh token from the client's cookies.
 */
export function getRefreshTokenCookie(): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${REFRESH_TOKEN_KEY}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
  return null;
}

/**
 * Sets the refresh token in the client's cookies.
 * Does not use HttpOnly because that requires the backend to set it via the Set-Cookie header.
 */
export function setRefreshTokenCookie(token: string): void {
  if (typeof document !== "undefined") {
    document.cookie = `${REFRESH_TOKEN_KEY}=${token}; max-age=${COOKIE_MAX_AGE}; path=/; SameSite=Lax`;
  }
}

/**
 * Removes the refresh token from the client's cookies.
 */
export function deleteRefreshTokenCookie(): void {
  if (typeof document !== "undefined") {
    document.cookie = `${REFRESH_TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
}
