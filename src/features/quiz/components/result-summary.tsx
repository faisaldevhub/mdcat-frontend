"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";
import type { QuizCompletionResult } from "@/features/quiz/types";

// =============================================================================
// Result Summary — Score display after quiz completion
// =============================================================================

interface ResultSummaryProps {
  result: QuizCompletionResult;
}

export function ResultSummary({ result }: ResultSummaryProps) {
  const skipped = result.total_questions - result.answered_questions;
  const minutes = Math.floor(result.time_taken / 60);
  const seconds = result.time_taken % 60;
  const timeFormatted =
    minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  // Score color based on performance
  const scoreColor =
    result.score >= 80
      ? "text-emerald-600 dark:text-emerald-400"
      : result.score >= 60
        ? "text-amber-600 dark:text-amber-400"
        : "text-red-600 dark:text-red-400";

  const scoreBg =
    result.score >= 80
      ? "from-emerald-500/10 to-emerald-500/5"
      : result.score >= 60
        ? "from-amber-500/10 to-amber-500/5"
        : "from-red-500/10 to-red-500/5";

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Score hero */}
      <Card className="overflow-hidden">
        <div className={`bg-gradient-to-b ${scoreBg} p-8 sm:p-12 text-center`}>
          <p className="text-sm font-medium text-muted-foreground mb-2">
            Your Score
          </p>
          <p className={`text-6xl sm:text-7xl font-bold ${scoreColor}`}>
            {Math.round(result.score)}%
          </p>
          <p className="text-sm text-muted-foreground mt-3">
            {result.correct_answers} of {result.total_questions} correct
          </p>
        </div>

        <CardContent className="p-6">
          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatBlock
              label="Correct"
              value={result.correct_answers}
              color="text-emerald-600 dark:text-emerald-400"
            />
            <StatBlock
              label="Incorrect"
              value={result.wrong_answers}
              color="text-red-600 dark:text-red-400"
            />
            <StatBlock
              label="Skipped"
              value={skipped}
              color="text-muted-foreground"
            />
            <StatBlock
              label="Time"
              value={timeFormatted}
              color="text-muted-foreground"
            />
          </div>
        </CardContent>
      </Card>

      {/* Gamification rewards */}
      {(result.xp_earned || result.badges_earned?.length || result.streak) && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Rewards Earned
            </h3>

            <div className="flex flex-wrap gap-3">
              {result.xp_earned && result.xp_earned > 0 && (
                <Badge variant="secondary" className="text-sm py-1 px-3">
                  ✨ +{result.xp_earned} XP
                </Badge>
              )}

              {result.streak && (
                <Badge variant="secondary" className="text-sm py-1 px-3">
                  🔥 {result.streak.current_streak} day streak
                  {result.streak.is_new_streak && " (New!)"}
                </Badge>
              )}

              {result.badges_earned?.map((badge) => (
                <Badge
                  key={badge.slug}
                  variant="secondary"
                  className="text-sm py-1 px-3"
                >
                  {badge.icon} {badge.name}
                </Badge>
              ))}

              {result.achievements_earned?.map((achievement) => (
                <Badge
                  key={achievement.slug}
                  variant="secondary"
                  className="text-sm py-1 px-3"
                >
                  🏆 {achievement.name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button render={<Link href={ROUTES.QUIZ_REVIEW(result.attempt_id)} />}>
          Review Answers
        </Button>
        <Button variant="outline" render={<Link href={ROUTES.DASHBOARD} />}>
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Internal stat block
// ---------------------------------------------------------------------------

function StatBlock({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="text-center p-3 rounded-lg bg-muted/50">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}
