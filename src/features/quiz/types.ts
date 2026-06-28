// =============================================================================
// Quiz Feature Types
// =============================================================================
// Matches the response shapes from the 7 backend quiz endpoints.
// See: PHASE_2_RESOURCE_APIS.md §3 (Quiz APIs)

// ---------------------------------------------------------------------------
// POST /quiz/start → Response
// ---------------------------------------------------------------------------

export interface QuizStartResponse {
  attempt_id: number;
  total_questions: number;
  /** Total time in minutes. 0 = untimed quiz. */
  total_time: number;
  status: "in_progress";
  started_at: string;
}

// ---------------------------------------------------------------------------
// GET /quiz/{id}/questions → Response
// ---------------------------------------------------------------------------

export interface QuizQuestion {
  id: number;
  /** The question text. Backend field name is `question`. */
  question: string;
  /** Nested options keyed by a/b/c/d. */
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  difficulty: string;
}

export interface QuizQuestionsResponse {
  attempt_id: number;
  collection_id: number;
  questions: QuizQuestion[];
}

// ---------------------------------------------------------------------------
// POST /quiz/{id}/answer → Response
// ---------------------------------------------------------------------------

export interface AnswerResponse {
  attempt_id: number;
  question_id: number;
  selected_option: string;
  is_correct: boolean;
  answered_at: string;
}

// ---------------------------------------------------------------------------
// POST /quiz/{id}/complete → Response
// GET  /quiz/{id}/result  → Response (same shape)
// ---------------------------------------------------------------------------

export interface QuizResult {
  attempt_id: number;
  collection_id: number;
  total_questions: number;
  answered_questions: number;
  correct_answers: number;
  wrong_answers: number;
  /** Percentage score (0–100). */
  score: number;
  status: string;
  /** Time taken in seconds. */
  time_taken: number;
  completed_at: string | null;
}

/**
 * The completion response may include gamification data appended
 * by the `mdcat_quiz_completion_response` WordPress filter.
 */
export interface QuizCompletionResult extends QuizResult {
  /** XP earned from this quiz (appended by gamification filter). */
  xp_earned?: number;
  /** Badges unlocked (appended by gamification filter). */
  badges_earned?: Array<{
    slug: string;
    name: string;
    icon: string;
  }>;
  /** Achievements unlocked (appended by gamification filter). */
  achievements_earned?: Array<{
    slug: string;
    name: string;
    description: string;
  }>;
  /** Streak update (appended by gamification filter). */
  streak?: {
    current_streak: number;
    is_new_streak: boolean;
  };
}

// ---------------------------------------------------------------------------
// GET /quiz/{id}/review → Response
// ---------------------------------------------------------------------------

export interface ReviewQuestion {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  selected_option: string | null;
  is_correct: boolean;
  explanation: string | null;
  is_bookmarked: boolean;
}

export interface QuizReview {
  attempt_id: number;
  collection_title: string;
  chapter_name: string;
  subject_name: string;
  score: number;
  questions: ReviewQuestion[];
}

// ---------------------------------------------------------------------------
// GET /quiz/history → Response
// ---------------------------------------------------------------------------

export interface QuizHistoryItem {
  attempt_id: number;
  collection_id: number;
  collection_title: string;
  chapter_name: string;
  subject_name: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  status: string;
  completed_at: string;
}

export interface QuizHistoryResponse {
  items: QuizHistoryItem[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

// ---------------------------------------------------------------------------
// Option key type — used in answer selection
// ---------------------------------------------------------------------------

export type OptionKey = "a" | "b" | "c" | "d";
