// =============================================================================
// User & Auth Types
// =============================================================================
// Matches the user shape returned by POST /auth/login and GET /auth/me.

/**
 * Authenticated user profile as returned by the API.
 */
export interface User {
  id: number;
  email: string;
  display_name: string;
  first_name: string;
  last_name: string;
  role: string;
  avatar_url: string | null;
  registered_at: string;
}

/**
 * Token pair returned by POST /auth/login.
 */
export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: "Bearer";
  expires_in: number;
}

/**
 * Full login response from POST /auth/login.
 */
export interface LoginResponse extends AuthTokens {
  user: User;
}

/**
 * Refresh response from POST /auth/refresh.
 */
export interface RefreshResponse {
  access_token: string;
  token_type: "Bearer";
  expires_in: number;
  user_id: number;
}
