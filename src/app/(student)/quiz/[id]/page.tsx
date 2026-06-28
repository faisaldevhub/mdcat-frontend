"use client";

import { use, useState, useEffect, useMemo } from "react";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { QuizPlayer } from "@/features/quiz/components/quiz-player";
import type { QuizStartResponse } from "@/features/quiz/types";

// =============================================================================
// Active Quiz Page — /quiz/[id]
// =============================================================================
// The main quiz player page. Receives the attempt ID from the URL.
// Requires the start data (total_time, started_at) to be in sessionStorage
// (saved by the start page redirect), or uses a sensible default.

interface QuizPageProps {
  params: Promise<{ id: string }>;
}

export default function QuizPage({ params }: QuizPageProps) {
  const resolvedParams = use(params);
  const attemptId = parseInt(resolvedParams.id, 10);

  // Prevent Next.js hydration mismatch (same pattern as dashboard/page.tsx)
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  // Read start data from sessionStorage after mount
  const startData = useMemo<QuizStartResponse | null>(() => {
    if (!isMounted) return null;

    try {
      const stored = sessionStorage.getItem(`quiz_start_${attemptId}`);
      if (stored) return JSON.parse(stored);
    } catch {
      // sessionStorage may not be available
    }

    // Fallback: create a reasonable default if start data isn't cached
    // This handles the case where the user refreshes the quiz page
    return {
      attempt_id: attemptId,
      total_questions: 0,
      total_time: 0,
      status: "in_progress" as const,
      started_at: new Date().toISOString(),
    };
  }, [isMounted, attemptId]);

  if (!isMounted || !startData) {
    return (
      <DashboardLayout>
        <div className="flex w-full flex-col items-center justify-center min-h-[60vh]">
          <LoadingState message="Loading quiz..." />
        </div>
      </DashboardLayout>
    );
  }

  if (isNaN(attemptId) || attemptId <= 0) {
    return (
      <DashboardLayout>
        <div className="flex w-full flex-col items-center justify-center min-h-[60vh]">
          <ErrorState
            title="Invalid quiz"
            message="The quiz ID is invalid. Please start a new quiz."
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full pb-10">
        <QuizPlayer attemptId={attemptId} startData={startData} />
      </div>
    </DashboardLayout>
  );
}
