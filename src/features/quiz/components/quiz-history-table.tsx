"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import type { QuizHistoryItem, QuizHistoryResponse } from "@/features/quiz/types";

// =============================================================================
// Quiz History Table — List of past attempts
// =============================================================================

interface QuizHistoryTableProps {
  data: QuizHistoryResponse;
  page: number;
  onPageChange: (page: number) => void;
}

export function QuizHistoryTable({
  data,
  page,
  onPageChange,
}: QuizHistoryTableProps) {
  if (data.items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Attempt cards */}
      <div className="space-y-3">
        {data.items.map((item) => (
          <HistoryCard key={item.attempt_id} item={item} />
        ))}
      </div>

      {/* Pagination */}
      {data.pagination.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground px-3">
            Page {page} of {data.pagination.total_pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= data.pagination.total_pages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Individual history card
// ---------------------------------------------------------------------------

function HistoryCard({ item }: { item: QuizHistoryItem }) {
  const scoreColor =
    item.score >= 80
      ? "text-emerald-600 dark:text-emerald-400"
      : item.score >= 60
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400";

  const date = formatDate(item.completed_at);

  return (
    <Card className="hover:border-primary/30 transition-colors">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Collection info */}
          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="font-semibold text-sm truncate">
              {item.collection_title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {item.subject_name} → {item.chapter_name}
            </p>
            <p className="text-xs text-muted-foreground">{date}</p>
          </div>

          {/* Right: Score + Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-right">
              <p className={cn("text-xl font-bold", scoreColor)}>
                {Math.round(item.score)}%
              </p>
              <p className="text-xs text-muted-foreground">
                {item.correct_answers}/{item.total_questions}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <Button variant="outline" size="sm" render={<Link href={ROUTES.QUIZ_RESULT(item.attempt_id)} />}>
                Result
              </Button>
              <Button variant="ghost" size="sm" render={<Link href={ROUTES.QUIZ_REVIEW(item.attempt_id)} />}>
                Review
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Date formatter
// ---------------------------------------------------------------------------

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}
