import { create } from "zustand";
import type { User } from "@/types/user";

// =============================================================================
// Auth Store
// =============================================================================
// Manages JWT access token and user object in memory.
// Access token is intentionally NOT persisted to localStorage (XSS mitigation).
// Refresh token is handled separately via localStorage (fallback).

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  /** Set auth state after login or silent refresh with user data. */
  setAuth: (accessToken: string, user: User) => void;
  /** Update only the access token after silent refresh. */
  updateToken: (accessToken: string) => void;
  /** Clear all auth state on logout. */
  clearAuth: () => void;
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState & AuthActions>()((set) => ({
  ...initialState,

  setAuth: (accessToken, user) =>
    set({
      accessToken,
      user,
      isAuthenticated: true,
    }),

  updateToken: (accessToken) =>
    set({
      accessToken,
      isAuthenticated: true,
    }),

  clearAuth: () => set(initialState),
}));
