"use client";

import { Progress } from "@/components/ui/progress";

// =============================================================================
// Quiz Progress Bar
// =============================================================================

interface QuizProgressProps {
  answered: number;
  total: number;
  className?: string;
}

export function QuizProgress({ answered, total, className }: QuizProgressProps) {
  const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;

  return (
    <div className={`flex items-center gap-3 ${className || ""}`}>
      <Progress value={percentage} className="h-2 flex-1" />
      <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
        {answered}/{total}
      </span>
    </div>
  );
}
