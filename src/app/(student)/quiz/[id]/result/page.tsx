"use client";

import { use } from "react";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { ResultSummary } from "@/features/quiz/components/result-summary";
import { useQuizResult } from "@/features/quiz/hooks/use-quiz";
import type { QuizCompletionResult } from "@/features/quiz/types";

// =============================================================================
// Quiz Result Page — /quiz/[id]/result
// =============================================================================

interface QuizResultPageProps {
  params: Promise<{ id: string }>;
}

export default function QuizResultPage({ params }: QuizResultPageProps) {
  const resolvedParams = use(params);
  const attemptId = parseInt(resolvedParams.id, 10);
  const { data, isLoading, error, refetch } = useQuizResult(attemptId);

  if (isNaN(attemptId) || attemptId <= 0) {
    return (
      <DashboardLayout>
        <div className="flex w-full flex-col items-center justify-center min-h-[60vh]">
          <ErrorState
            title="Invalid quiz"
            message="The quiz ID is invalid."
          />
        </div>
      </DashboardLayout>
    );
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex w-full flex-col items-center justify-center min-h-[60vh]">
          <LoadingState message="Loading results..." />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !data) {
    return (
      <DashboardLayout>
        <div className="flex w-full flex-col items-center justify-center min-h-[60vh]">
          <ErrorState
            title="Unable to load results"
            message="There was a problem loading your quiz results."
            onRetry={refetch}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full pb-10 pt-4">
        <ResultSummary result={data as QuizCompletionResult} />
      </div>
    </DashboardLayout>
  );
}
