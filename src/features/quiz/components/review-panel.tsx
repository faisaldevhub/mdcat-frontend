"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToggleBookmark } from "@/features/quiz/hooks/use-quiz";
import type { ReviewQuestion, QuizReview } from "@/features/quiz/types";

// =============================================================================
// Review Panel — Post-quiz question-by-question review
// =============================================================================

interface ReviewPanelProps {
  review: QuizReview;
}

const OPTION_LABELS: Record<string, string> = {
  a: "A",
  b: "B",
  c: "C",
  d: "D",
};

const OPTION_KEYS = ["a", "b", "c", "d"] as const;

export function ReviewPanel({ review }: ReviewPanelProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filter, setFilter] = useState<"all" | "correct" | "incorrect" | "skipped">("all");
  const bookmarkMutation = useToggleBookmark(review.attempt_id);

  // Track bookmark state optimistically
  const [bookmarkOverrides, setBookmarkOverrides] = useState<Record<number, boolean>>({});

  const filteredQuestions = review.questions.filter((q) => {
    switch (filter) {
      case "correct":
        return q.is_correct;
      case "incorrect":
        return q.selected_option !== null && !q.is_correct;
      case "skipped":
        return q.selected_option === null;
      default:
        return true;
    }
  });

  const question = filteredQuestions[currentIndex];
  const totalFiltered = filteredQuestions.length;

  const handleBookmark = useCallback(
    (questionId: number, currentState: boolean) => {
      // Optimistic update
      setBookmarkOverrides((prev) => ({
        ...prev,
        [questionId]: !currentState,
      }));

      bookmarkMutation.mutate(questionId, {
        onError: () => {
          // Revert optimistic update
          setBookmarkOverrides((prev) => ({
            ...prev,
            [questionId]: currentState,
          }));
        },
      });
    },
    [bookmarkMutation]
  );

  const getBookmarkState = (q: ReviewQuestion): boolean => {
    return bookmarkOverrides[q.id] ?? q.is_bookmarked;
  };

  if (totalFiltered === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg font-medium">No questions match this filter.</p>
        <Button variant="ghost" className="mt-2" onClick={() => setFilter("all")}>
          Show All Questions
        </Button>
      </div>
    );
  }

  if (!question) {
    setCurrentIndex(0);
    return null;
  }

  const isBookmarked = getBookmarkState(question);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Review header with context */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            {review.subject_name} → {review.chapter_name}
          </p>
          <h2 className="text-lg font-semibold">{review.collection_title}</h2>
        </div>
        <Badge variant="secondary" className="text-sm">
          Score: {Math.round(review.score)}%
        </Badge>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            { key: "all", label: `All (${review.questions.length})` },
            {
              key: "correct",
              label: `Correct (${review.questions.filter((q) => q.is_correct).length})`,
            },
            {
              key: "incorrect",
              label: `Incorrect (${review.questions.filter((q) => q.selected_option !== null && !q.is_correct).length})`,
            },
            {
              key: "skipped",
              label: `Skipped (${review.questions.filter((q) => q.selected_option === null).length})`,
            },
          ] as const
        ).map(({ key, label }) => (
          <Button
            key={key}
            variant={filter === key ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setFilter(key);
              setCurrentIndex(0);
            }}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Question card */}
      <Card>
        <CardContent className="p-6 sm:p-8 space-y-6">
          {/* Question header */}
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center justify-center h-7 px-2.5 rounded-md bg-primary/10 text-primary text-xs font-semibold">
                  Q{currentIndex + 1}/{totalFiltered}
                </span>
                {question.is_correct ? (
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    ✓ Correct
                  </Badge>
                ) : question.selected_option === null ? (
                  <Badge variant="secondary">— Skipped</Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    ✗ Incorrect
                  </Badge>
                )}
              </div>
              <h3 className="text-lg font-semibold leading-relaxed">
                {question.question_text}
              </h3>
            </div>

            {/* Bookmark button */}
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "flex-shrink-0",
                isBookmarked && "text-amber-500"
              )}
              onClick={() => handleBookmark(question.id, isBookmarked)}
              disabled={bookmarkMutation.isPending}
            >
              {isBookmarked ? "★" : "☆"}
            </Button>
          </div>

          {/* Options with correct/incorrect highlighting */}
          <div className="space-y-3">
            {OPTION_KEYS.map((key) => {
              const optionText = getOptionText(question, key);
              const isCorrect = question.correct_option === key;
              const isStudentAnswer = question.selected_option === key;
              const isWrong = isStudentAnswer && !isCorrect;

              return (
                <div
                  key={key}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-xl border-2 transition-colors",
                    isCorrect
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                      : isWrong
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : "border-border bg-card"
                  )}
                >
                  <span
                    className={cn(
                      "flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold",
                      isCorrect
                        ? "bg-emerald-500 text-white"
                        : isWrong
                          ? "bg-red-500 text-white"
                          : "bg-muted text-muted-foreground"
                    )}
                  >
                    {OPTION_LABELS[key]}
                  </span>
                  <span className="text-sm leading-relaxed pt-1 flex-1">
                    {optionText}
                  </span>
                  {isCorrect && (
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 pt-1.5">
                      Correct
                    </span>
                  )}
                  {isWrong && (
                    <span className="text-xs font-medium text-red-600 dark:text-red-400 pt-1.5">
                      Your Answer
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Explanation */}
          {question.explanation && (
            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">
                Explanation
              </p>
              <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
                {question.explanation}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
        >
          ← Previous
        </Button>

        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} of {totalFiltered}
        </span>

        <Button
          variant="outline"
          onClick={() =>
            setCurrentIndex((i) => Math.min(totalFiltered - 1, i + 1))
          }
          disabled={currentIndex >= totalFiltered - 1}
        >
          Next →
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

function getOptionText(q: ReviewQuestion, key: string): string {
  switch (key) {
    case "a": return q.option_a;
    case "b": return q.option_b;
    case "c": return q.option_c;
    case "d": return q.option_d;
    default: return "";
  }
}
