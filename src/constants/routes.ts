// =============================================================================
// Route Path Constants
// =============================================================================
// Single source of truth for all route paths used in navigation and middleware.

export const ROUTES = {
  // Public routes
  HOME: "/",
  PRICING: "/pricing",

  // Auth routes
  LOGIN: "/login",

  // Student routes
  DASHBOARD: "/dashboard",
  SUBJECTS: "/subjects",
  CHAPTERS: "/chapters",
  COLLECTIONS: "/collections",
  QUIZ: "/quiz",
  QUIZ_HISTORY: "/quiz/history",
  ANALYTICS: "/analytics",
  BOOKMARKS: "/bookmarks",
  WRONG_QUESTIONS: "/wrong-questions",
  LEADERBOARD: "/leaderboard",
  ACHIEVEMENTS: "/achievements",
  NOTIFICATIONS: "/notifications",
  PROFILE: "/profile",
  SETTINGS: "/settings",
} as const;

/**
 * Protected routes that require authentication.
 * Used by middleware.ts to determine redirect behavior.
 */
export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.QUIZ,
  ROUTES.QUIZ_HISTORY,
  ROUTES.ANALYTICS,
  ROUTES.BOOKMARKS,
  ROUTES.WRONG_QUESTIONS,
  ROUTES.LEADERBOARD,
  ROUTES.ACHIEVEMENTS,
  ROUTES.NOTIFICATIONS,
  ROUTES.PROFILE,
  ROUTES.SETTINGS,
] as const;

/**
 * Auth routes — redirect to dashboard if already authenticated.
 */
export const AUTH_ROUTES = [ROUTES.LOGIN] as const;
