"use client";

import { cn } from "@/lib/utils";

// =============================================================================
// Question Palette — Grid for jumping to any question
// =============================================================================

interface QuestionPaletteProps {
  totalQuestions: number;
  currentIndex: number;
  /** Record of questionId → selected option */
  answers: Record<number, string>;
  /** Ordered array of question IDs matching their index */
  questionIds: number[];
  onJump: (index: number) => void;
  className?: string;
}

export function QuestionPalette({
  totalQuestions,
  currentIndex,
  answers,
  questionIds,
  onJump,
  className,
}: QuestionPaletteProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Questions
      </h3>
      <div className="grid grid-cols-5 gap-1.5">
        {Array.from({ length: totalQuestions }, (_, i) => {
          const isCurrent = i === currentIndex;
          const isAnswered = questionIds[i] != null && answers[questionIds[i]] != null;

          return (
            <button
              key={i}
              type="button"
              onClick={() => onJump(i)}
              className={cn(
                "h-9 w-full rounded-lg text-xs font-semibold transition-all duration-150",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                isCurrent
                  ? "bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/30"
                  : isAnswered
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 pt-2 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-primary" /> Current
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-emerald-100 dark:bg-emerald-900/30" /> Answered
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-muted" /> Unanswered
        </span>
      </div>
    </div>
  );
}
