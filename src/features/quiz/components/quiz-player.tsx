"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { useQuizQuestions, useAnswerQuestion, useCompleteQuiz } from "@/features/quiz/hooks/use-quiz";
import { useQuizSession } from "@/features/quiz/hooks/use-quiz-session";
import { QuestionCard } from "./question-card";
import { QuestionPalette } from "./question-palette";
import { QuizTimer } from "./quiz-timer";
import { QuizProgress } from "./quiz-progress";
import { QuizSubmitDialog } from "./quiz-submit-dialog";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import type { QuizStartResponse } from "@/features/quiz/types";

// =============================================================================
// Quiz Player — Main composite quiz interface
// =============================================================================

interface QuizPlayerProps {
  attemptId: number;
  startData: QuizStartResponse;
}

export function QuizPlayer({ attemptId, startData }: QuizPlayerProps) {
  const router = useRouter();
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const autoSubmitTriggeredRef = useRef(false);

  // Load questions
  const {
    data: questionsData,
    isLoading,
    error,
    refetch,
  } = useQuizQuestions(attemptId);

  // Mutations
  const answerMutation = useAnswerQuestion(attemptId);
  const completeMutation = useCompleteQuiz();

  // Session state
  const { state: session, actions, computed } = useQuizSession();

  // Initialize session when questions load
  // NOTE: `actions.init` is a stable useCallback ref — do NOT depend on `actions`
  // (which is a new object literal every render, causing infinite re-init).
  useEffect(() => {
    if (questionsData?.questions.length) {
      actions.init(questionsData.questions.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionsData]);

  // Get current question
  const questions = questionsData?.questions || [];
  const currentQuestion = questions[session.currentIndex];
  const questionIds = questions.map((q) => q.id);
  const currentQuestionId = currentQuestion?.id;
  const selectedOption = currentQuestionId
    ? session.answers[currentQuestionId] || null
    : null;

  // Auto-save answer on selection
  const handleSelectOption = useCallback(
    (option: string) => {
      if (!currentQuestion || session.isCompleted) return;

      actions.selectAnswer(currentQuestion.id, option);

      // Auto-save to backend
      answerMutation.mutate(
        { questionId: currentQuestion.id, selectedOption: option },
        {
          onSuccess: () => {
            actions.markSaved(currentQuestion.id);
          },
        }
      );
    },
    [currentQuestion, session.isCompleted, actions, answerMutation]
  );

  // Submit quiz
  const handleSubmitQuiz = useCallback(() => {
    if (session.isSubmitting || session.isCompleted) return;

    actions.setSubmitting(true);
    setShowSubmitDialog(false);

    completeMutation.mutate(attemptId, {
      onSuccess: () => {
        actions.complete();
        router.push(ROUTES.QUIZ_RESULT(attemptId));
      },
      onError: () => {
        actions.setSubmitting(false);
      },
    });
  }, [session.isSubmitting, session.isCompleted, attemptId, actions, completeMutation, router]);

  // Auto-submit on timer expiry
  const handleTimeExpired = useCallback(() => {
    if (autoSubmitTriggeredRef.current) return;
    autoSubmitTriggeredRef.current = true;
    handleSubmitQuiz();
  }, [handleSubmitQuiz]);

  // Loading state
  if (isLoading) {
    return <LoadingState message="Loading questions..." />;
  }

  // Error state
  if (error || !questionsData || questions.length === 0) {
    return (
      <ErrorState
        title="Unable to load questions"
        message="There was a problem loading your quiz questions. Please try again."
        onRetry={refetch}
      />
    );
  }

  if (!currentQuestion) {
    return (
      <ErrorState
        title="Question not found"
        message="The current question could not be loaded."
      />
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Top bar: progress + timer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <QuizProgress
          answered={computed.answeredCount}
          total={session.totalQuestions}
          className="flex-1 w-full sm:max-w-sm"
        />
        <div className="flex items-center gap-2">
          <QuizTimer
            totalMinutes={startData.total_time}
            startedAt={startData.started_at}
            onTimeExpired={handleTimeExpired}
          />
          {/* Mobile palette toggle */}
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setShowPalette(!showPalette)}
          >
            <GridIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main question area */}
        <div className="flex-1 min-w-0">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <QuestionCard
                question={currentQuestion}
                questionNumber={session.currentIndex + 1}
                totalQuestions={session.totalQuestions}
                selectedOption={selectedOption}
                isSaving={answerMutation.isPending}
                onSelectOption={handleSelectOption}
              />
            </CardContent>
          </Card>

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              onClick={actions.prev}
              disabled={computed.isFirstQuestion}
            >
              <ChevronLeftIcon className="h-4 w-4 mr-1" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {computed.isLastQuestion ? (
                <Button
                  onClick={() => setShowSubmitDialog(true)}
                  disabled={session.isSubmitting || session.isCompleted}
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button onClick={actions.next}>
                  Next
                  <ChevronRightIcon className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Desktop sidebar palette */}
        <div className="hidden lg:block w-52 flex-shrink-0">
          <Card>
            <CardContent className="p-4">
              <QuestionPalette
                totalQuestions={session.totalQuestions}
                currentIndex={session.currentIndex}
                answers={session.answers}
                questionIds={questionIds}
                onJump={actions.goTo}
              />
              <div className="mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowSubmitDialog(true)}
                  disabled={session.isSubmitting || session.isCompleted}
                >
                  Submit Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile palette drawer */}
      {showPalette && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-y-0 right-0 w-64 bg-card border-l shadow-lg p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Questions</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPalette(false)}
              >
                ✕
              </Button>
            </div>
            <QuestionPalette
              totalQuestions={session.totalQuestions}
              currentIndex={session.currentIndex}
              answers={session.answers}
              questionIds={questionIds}
              onJump={(index) => {
                actions.goTo(index);
                setShowPalette(false);
              }}
            />
            <div className="mt-4 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  setShowPalette(false);
                  setShowSubmitDialog(true);
                }}
                disabled={session.isSubmitting || session.isCompleted}
              >
                Submit Quiz
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Submit confirmation dialog */}
      <QuizSubmitDialog
        open={showSubmitDialog}
        onOpenChange={setShowSubmitDialog}
        answeredCount={computed.answeredCount}
        totalQuestions={session.totalQuestions}
        isSubmitting={session.isSubmitting}
        onConfirm={handleSubmitQuiz}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline icons (avoids importing all of lucide-react)
// ---------------------------------------------------------------------------

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}
