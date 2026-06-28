"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { QuizHistoryTable } from "@/features/quiz/components/quiz-history-table";
import { useQuizHistory } from "@/features/quiz/hooks/use-quiz";

// =============================================================================
// Quiz History Page — /quiz/history
// =============================================================================

export default function QuizHistoryPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useQuizHistory(page);

  return (
    <DashboardLayout>
      <div className="w-full max-w-4xl mx-auto pb-10 space-y-6">
        <PageHeader
          title="Quiz History"
          description="Review your past quiz attempts and track your progress."
        />

        {isLoading ? (
          <LoadingState message="Loading quiz history..." />
        ) : error ? (
          <ErrorState
            title="Unable to load history"
            message="There was a problem loading your quiz history."
            onRetry={refetch}
          />
        ) : !data || data.items.length === 0 ? (
          <EmptyState
            title="No quiz attempts yet"
            description="Start a quiz to begin learning. Your completed quizzes will appear here."
          />
        ) : (
          <QuizHistoryTable
            data={data}
            page={page}
            onPageChange={setPage}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
