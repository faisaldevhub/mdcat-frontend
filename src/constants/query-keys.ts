// =============================================================================
// TanStack Query Key Factory
// =============================================================================
// Centralized query keys for cache management and invalidation.
// Follows the factory pattern recommended by TanStack Query docs.

export const queryKeys = {
  // Auth
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },

  // Content
  subjects: {
    all: ["subjects"] as const,
    list: () => [...queryKeys.subjects.all, "list"] as const,
    detail: (id: number) => [...queryKeys.subjects.all, "detail", id] as const,
  },
  chapters: {
    all: ["chapters"] as const,
    list: (subjectId?: number) =>
      [...queryKeys.chapters.all, "list", { subjectId }] as const,
    detail: (id: number) => [...queryKeys.chapters.all, "detail", id] as const,
  },
  collections: {
    all: ["collections"] as const,
    list: (chapterId?: number) =>
      [...queryKeys.collections.all, "list", { chapterId }] as const,
    detail: (id: number) =>
      [...queryKeys.collections.all, "detail", id] as const,
  },

  // Dashboard
  dashboard: {
    all: ["dashboard"] as const,
    stats: () => [...queryKeys.dashboard.all, "stats"] as const,
    progress: () => [...queryKeys.dashboard.all, "progress"] as const,
    continueLearning: () =>
      [...queryKeys.dashboard.all, "continue-learning"] as const,
    studyPlan: () => [...queryKeys.dashboard.all, "study-plan"] as const,
  },

  // Quiz
  quiz: {
    all: ["quiz"] as const,
    questions: (attemptId: number) =>
      [...queryKeys.quiz.all, "questions", attemptId] as const,
    result: (attemptId: number) =>
      [...queryKeys.quiz.all, "result", attemptId] as const,
    review: (attemptId: number) =>
      [...queryKeys.quiz.all, "review", attemptId] as const,
    history: (page?: number, perPage?: number) =>
      [...queryKeys.quiz.all, "history", { page, perPage }] as const,
  },

  // Analytics
  analytics: {
    all: ["analytics"] as const,
    performance: () => [...queryKeys.analytics.all, "performance"] as const,
  },

  // Revision
  revision: {
    all: ["revision"] as const,
    bookmarks: () => [...queryKeys.revision.all, "bookmarks"] as const,
    wrongQuestions: () =>
      [...queryKeys.revision.all, "wrong-questions"] as const,
  },

  // Gamification
  gamification: {
    all: ["gamification"] as const,
    streak: () => [...queryKeys.gamification.all, "streak"] as const,
    xp: () => [...queryKeys.gamification.all, "xp"] as const,
    badges: () => [...queryKeys.gamification.all, "badges"] as const,
    achievements: () =>
      [...queryKeys.gamification.all, "achievements"] as const,
    leaderboard: (type?: string, limit?: number) =>
      [...queryKeys.gamification.all, "leaderboard", { type, limit }] as const,
  },

  // Notifications
  notifications: {
    all: ["notifications"] as const,
    list: (page?: number) =>
      [...queryKeys.notifications.all, "list", { page }] as const,
    unreadCount: () =>
      [...queryKeys.notifications.all, "unread-count"] as const,
  },
} as const;
