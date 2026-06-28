"use client";

import { use, useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { quizService } from "@/services/quiz.service";
import { ROUTES } from "@/constants/routes";
import type { QuizStartResponse } from "@/features/quiz/types";

// =============================================================================
// Quiz Start Page — /quiz/start/[collectionId]
// =============================================================================
// Entry point from the collection detail page. Calls POST /quiz/start, then
// redirects to the quiz player page with the new attempt ID.
//
// Implementation note:
// This page calls the quiz start API directly via quizService instead of
// useMutation to avoid a React Strict Mode issue where the useRef guard
// prevents the second mount from firing the mutation, while the first
// mount's mutation result updates the unmounted component instance.

interface QuizStartPageProps {
  params: Promise<{ collectionId: string }>;
}

export default function QuizStartPage({ params }: QuizStartPageProps) {
  const resolvedParams = use(params);
  const collectionId = parseInt(resolvedParams.collectionId, 10);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const abortRef = useRef(false);

  const startQuiz = useCallback(async () => {
    if (isNaN(collectionId) || collectionId <= 0) {
      setErrorMessage("Invalid collection ID.");
      return;
    }

    setErrorMessage(null);

    try {
      const data: QuizStartResponse =
        await quizService.startQuiz(collectionId);

      // If the component was unmounted (strict mode cleanup), do nothing.
      if (abortRef.current) return;

      // Cache start data for the quiz player page
      try {
        sessionStorage.setItem(
          `quiz_start_${data.attempt_id}`,
          JSON.stringify(data)
        );
      } catch {
        // sessionStorage may not be available
      }

      router.replace(ROUTES.QUIZ_ATTEMPT(data.attempt_id));
    } catch (error: unknown) {
      if (abortRef.current) return;

      setErrorMessage(
        (error as { message?: string })?.message ||
          "There was a problem starting the quiz. Please try again."
      );
    }
  }, [collectionId, router]);

  useEffect(() => {
    abortRef.current = false;

    // Schedule the async call so setState is not synchronous within the effect
    const timer = setTimeout(() => {
      startQuiz();
    }, 0);

    return () => {
      abortRef.current = true;
      clearTimeout(timer);
    };
  }, [startQuiz]);

  if (errorMessage) {
    return (
      <DashboardLayout>
        <div className="flex w-full flex-col items-center justify-center min-h-[60vh]">
          <ErrorState
            title="Unable to start quiz"
            message={errorMessage}
            onRetry={startQuiz}
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex w-full flex-col items-center justify-center min-h-[60vh]">
        <LoadingState message="Preparing your quiz..." />
      </div>
    </DashboardLayout>
  );
}
