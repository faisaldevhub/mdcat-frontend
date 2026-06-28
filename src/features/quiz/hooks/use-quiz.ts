import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { quizService } from "@/services/quiz.service";
import { queryKeys } from "@/constants/query-keys";

// =============================================================================
// Quiz React Query Hooks
// =============================================================================
// Follows the same pattern as use-dashboard.ts.
// Mutations auto-save answers; queries cache questions at staleTime: Infinity.

/**
 * Start a new quiz attempt.
 * Returns mutation that resolves with { attempt_id, total_questions, ... }.
 */
export function useStartQuiz() {
  return useMutation({
    mutationFn: (collectionId: number) => quizService.startQuiz(collectionId),
  });
}

/**
 * Load questions for an active attempt.
 * staleTime: Infinity — questions never change during an attempt.
 */
export function useQuizQuestions(attemptId: number) {
  return useQuery({
    queryKey: queryKeys.quiz.questions(attemptId),
    queryFn: () => quizService.getQuestions(attemptId),
    enabled: attemptId > 0,
    staleTime: Infinity,
  });
}

/**
 * Submit an answer for a single question. Auto-saves on selection.
 * Does NOT show instant feedback (per design decision).
 */
export function useAnswerQuestion(attemptId: number) {
  return useMutation({
    mutationFn: ({
      questionId,
      selectedOption,
    }: {
      questionId: number;
      selectedOption: string;
    }) => quizService.saveAnswer(attemptId, questionId, selectedOption),
  });
}

/**
 * Complete a quiz attempt. Invalidates dashboard + quiz caches on success.
 */
export function useCompleteQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (attemptId: number) => quizService.completeQuiz(attemptId),
    onSuccess: () => {
      // Invalidate caches so dashboard and history reflect the new completion
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.quiz.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.gamification.all });
    },
  });
}

/**
 * Fetch the result of a completed attempt.
 */
export function useQuizResult(attemptId: number) {
  return useQuery({
    queryKey: queryKeys.quiz.result(attemptId),
    queryFn: () => quizService.getResult(attemptId),
    enabled: attemptId > 0,
  });
}

/**
 * Fetch the full post-completion review.
 */
export function useQuizReview(attemptId: number) {
  return useQuery({
    queryKey: queryKeys.quiz.review(attemptId),
    queryFn: () => quizService.getReview(attemptId),
    enabled: attemptId > 0,
  });
}

/**
 * Fetch paginated quiz history.
 */
export function useQuizHistory(page: number = 1, perPage: number = 20) {
  return useQuery({
    queryKey: queryKeys.quiz.history(page, perPage),
    queryFn: () => quizService.getHistory(page, perPage),
    staleTime: 60_000, // 1 minute
  });
}

/**
 * Toggle bookmark on a question during review.
 * Invalidates both revision and quiz review caches.
 */
export function useToggleBookmark(attemptId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionId: number) => quizService.toggleBookmark(questionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.quiz.review(attemptId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.revision.all,
      });
    },
  });
}
