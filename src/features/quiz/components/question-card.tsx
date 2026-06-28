"use client";

import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/features/quiz/types";

// =============================================================================
// Question Card — Displays a single question with options
// =============================================================================
// No instant feedback: options don't show correct/incorrect during quiz.
// Answer is auto-saved immediately after selection.

interface QuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedOption: string | null;
  isSaving: boolean;
  onSelectOption: (option: string) => void;
}

const OPTION_LABELS: Record<string, string> = {
  a: "A",
  b: "B",
  c: "C",
  d: "D",
};

const OPTION_KEYS = ["a", "b", "c", "d"] as const;

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  isSaving,
  onSelectOption,
}: QuestionCardProps) {
  const getOptionText = (key: string): string => {
    return question.options[key as keyof typeof question.options] || "";
  };

  return (
    <div className="space-y-6">
      {/* Question header */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center h-7 px-2.5 rounded-md bg-primary/10 text-primary text-xs font-semibold">
            Q{questionNumber}/{totalQuestions}
          </span>
        </div>
        <h2 className="text-lg font-semibold leading-relaxed text-foreground">
          {question.question}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {OPTION_KEYS.map((key) => {
          const isSelected = selectedOption === key;
          const optionText = getOptionText(key);

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectOption(key)}
              disabled={isSaving}
              className={cn(
                "w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-150",
                "hover:border-primary/50 hover:bg-primary/5",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                isSelected
                  ? "border-primary bg-primary/10 shadow-sm"
                  : "border-border bg-card",
                isSaving && "opacity-60 cursor-not-allowed"
              )}
            >
              <span
                className={cn(
                  "flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {OPTION_LABELS[key]}
              </span>
              <span className="text-sm leading-relaxed pt-1 flex-1">
                {optionText}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
