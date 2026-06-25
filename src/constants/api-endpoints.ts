// =============================================================================
// API Endpoint Constants
// =============================================================================
// Maps to the 33 REST endpoints exposed by the WordPress backend.
// Base URL is injected via NEXT_PUBLIC_API_URL environment variable.

export const API_ENDPOINTS = {
  // Auth (4 endpoints)
  AUTH_LOGIN: "/auth/login",
  AUTH_REFRESH: "/auth/refresh",
  AUTH_LOGOUT: "/auth/logout",
  AUTH_ME: "/auth/me",

  // Content (6 endpoints)
  SUBJECTS: "/subjects",
  SUBJECT_DETAIL: (id: number) => `/subjects/${id}`,
  CHAPTERS: "/chapters",
  CHAPTER_DETAIL: (id: number) => `/chapters/${id}`,
  COLLECTIONS: "/collections",
  COLLECTION_DETAIL: (id: number) => `/collections/${id}`,

  // Dashboard (4 endpoints)
  DASHBOARD_STATS: "/dashboard/stats",
  DASHBOARD_PROGRESS: "/dashboard/progress",
  DASHBOARD_CONTINUE_LEARNING: "/dashboard/continue-learning",
  DASHBOARD_STUDY_PLAN: "/dashboard/study-plan",

  // Quiz (7 endpoints)
  QUIZ_START: "/quiz/start",
  QUIZ_QUESTIONS: (id: number) => `/quiz/${id}/questions`,
  QUIZ_ANSWER: (id: number) => `/quiz/${id}/answer`,
  QUIZ_COMPLETE: (id: number) => `/quiz/${id}/complete`,
  QUIZ_RESULT: (id: number) => `/quiz/${id}/result`,
  QUIZ_REVIEW: (id: number) => `/quiz/${id}/review`,
  QUIZ_HISTORY: "/quiz/history",

  // Analytics (1 endpoint)
  ANALYTICS_PERFORMANCE: "/analytics/performance",

  // Revision (3 endpoints)
  REVISION_BOOKMARKS: "/revision/bookmarks",
  REVISION_BOOKMARKS_TOGGLE: "/revision/bookmarks/toggle",
  REVISION_WRONG_QUESTIONS: "/revision/wrong-questions",

  // Gamification (5 endpoints)
  GAMIFICATION_STREAK: "/gamification/streak",
  GAMIFICATION_XP: "/gamification/xp",
  GAMIFICATION_BADGES: "/gamification/badges",
  GAMIFICATION_ACHIEVEMENTS: "/gamification/achievements",
  GAMIFICATION_LEADERBOARD: "/gamification/leaderboard",

  // Notifications (3 endpoints)
  NOTIFICATIONS: "/notifications",
  NOTIFICATION_READ: (id: number) => `/notifications/${id}/read`,
  NOTIFICATIONS_READ_ALL: "/notifications/read-all",
} as const;
