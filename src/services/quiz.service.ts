import apiClient from "./api-client";
import { API_ENDPOINTS } from "@/constants/api-endpoints";
import type { ApiResponse } from "@/types/api";
import type {
  QuizStartResponse,
  QuizQuestionsResponse,
  AnswerResponse,
  QuizCompletionResult,
  QuizResult,
  QuizReview,
  QuizHistoryResponse,
} from "@/features/quiz/types";

// =============================================================================
// Quiz Service
// =============================================================================
// API service layer for the complete quiz lifecycle.
// All calls use the authenticated apiClient.

export const quizService = {
  /**
   * Start a new quiz attempt for a collection.
   */
  startQuiz: async (collectionId: number): Promise<QuizStartResponse> => {
    const { data } = await apiClient.post<ApiResponse<QuizStartResponse>>(
      API_ENDPOINTS.QUIZ_START,
      { collection_id: collectionId }
    );
    return data.data;
  },

  /**
   * Load all questions for an active attempt.
   */
  getQuestions: async (attemptId: number): Promise<QuizQuestionsResponse> => {
    const { data } = await apiClient.get<ApiResponse<QuizQuestionsResponse>>(
      API_ENDPOINTS.QUIZ_QUESTIONS(attemptId)
    );
    return data.data;
  },

  /**
   * Submit an answer for a single question. Auto-saves immediately.
   */
  saveAnswer: async (
    attemptId: number,
    questionId: number,
    selectedOption: string
  ): Promise<AnswerResponse> => {
    const { data } = await apiClient.post<ApiResponse<AnswerResponse>>(
      API_ENDPOINTS.QUIZ_ANSWER(attemptId),
      { question_id: questionId, selected_option: selectedOption }
    );
    return data.data;
  },

  /**
   * Complete a quiz attempt. Triggers gamification hooks on the backend.
   */
  completeQuiz: async (attemptId: number): Promise<QuizCompletionResult> => {
    const { data } = await apiClient.post<ApiResponse<QuizCompletionResult>>(
      API_ENDPOINTS.QUIZ_COMPLETE(attemptId)
    );
    return data.data;
  },

  /**
   * Get the result of a completed attempt.
   */
  getResult: async (attemptId: number): Promise<QuizResult> => {
    const { data } = await apiClient.get<ApiResponse<QuizResult>>(
      API_ENDPOINTS.QUIZ_RESULT(attemptId)
    );
    return data.data;
  },

  /**
   * Get the full post-completion review with correct answers and explanations.
   */
  getReview: async (attemptId: number): Promise<QuizReview> => {
    const { data } = await apiClient.get<ApiResponse<QuizReview>>(
      API_ENDPOINTS.QUIZ_REVIEW(attemptId)
    );
    return data.data;
  },

  /**
   * Get paginated quiz history for the authenticated student.
   */
  getHistory: async (
    page: number = 1,
    perPage: number = 20
  ): Promise<QuizHistoryResponse> => {
    const { data } = await apiClient.get<ApiResponse<QuizHistoryResponse>>(
      API_ENDPOINTS.QUIZ_HISTORY,
      { params: { page, per_page: perPage } }
    );
    return data.data;
  },

  /**
   * Toggle bookmark on a question (used during review).
   */
  toggleBookmark: async (
    questionId: number
  ): Promise<{ question_id: number; is_bookmarked: boolean }> => {
    const { data } = await apiClient.post<
      ApiResponse<{ question_id: number; is_bookmarked: boolean }>
    >(API_ENDPOINTS.REVISION_BOOKMARKS_TOGGLE, { question_id: questionId });
    return data.data;
  },
};
