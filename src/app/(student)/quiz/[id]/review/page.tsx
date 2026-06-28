"use client";

import { use } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { ReviewPanel } from "@/features/quiz/components/review-panel";
import { useQuizReview } from "@/features/quiz/hooks/use-quiz";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

// =============================================================================
// Quiz Review Page — /quiz/[id]/review
// =============================================================================

interface QuizReviewPageProps {
  params: Promise<{ id: string }>;
}

export default function QuizReviewPage({ params }: QuizReviewPageProps) {
  const resolvedParams = use(params);
  const attemptId = parseInt(resolvedParams.id, 10);
  const { data: review, isLoading, error, refetch } = useQuizReview(attemptId);

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
          <LoadingState message="Loading review..." />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !review) {
    return (
      <DashboardLayout>
        <div className="flex w-full flex-col items-center justify-center min-h-[60vh]">
          <ErrorState
            title="Unable to load review"
            message="There was a problem loading the quiz review."
            onRetry={refetch}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full pb-10 pt-4 space-y-6">
        <ReviewPanel review={review} />

        <div className="flex justify-center gap-3">
          <Button variant="outline" render={<Link href={ROUTES.QUIZ_RESULT(attemptId)} />}>
            Back to Result
          </Button>
          <Button variant="outline" render={<Link href={ROUTES.DASHBOARD} />}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
