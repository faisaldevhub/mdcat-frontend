"use client";

import { useContinueLearning } from "../hooks/use-dashboard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlayCircle, BookOpen } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export function ContinueLearningCard() {
  const { data: continueLearning, isLoading, isError } = useContinueLearning();

  if (isLoading) {
    return <Skeleton className="h-48 rounded-xl" />;
  }

  if (isError || !continueLearning) {
    return null;
  }

  const isNewStudent = !continueLearning.collection_id && !continueLearning.curriculum_completed;

  return (
    <Card className="flex flex-col h-full border-primary/20 bg-primary/5 dark:bg-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="size-5 text-primary" />
          Continue Learning
        </CardTitle>
        <CardDescription>
          {isNewStudent
            ? "Start your preparation journey"
            : continueLearning.curriculum_completed
            ? "You have completed the entire curriculum!"
            : "Pick up right where you left off"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-end">
        {continueLearning.curriculum_completed ? (
          <div className="bg-background/50 rounded-lg p-4 text-center">
            <p className="font-medium text-sm">Amazing job!</p>
            <p className="text-xs text-muted-foreground mt-1">
              You&apos;ve conquered all collections. Time to review your weak topics.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-background/60 rounded-lg p-4">
              <p className="text-xs font-medium text-primary mb-1">
                {continueLearning.subject_title || "All Subjects"}
              </p>
              <p className="text-sm font-semibold mb-1">
                {continueLearning.chapter_title || "Introduction"}
              </p>
              <p className="text-sm text-muted-foreground">
                {continueLearning.collection_title || "Your first quiz awaits"}
              </p>
            </div>
            
            <Button 
              render={
                <Link
                  href={
                    continueLearning.collection_id
                      ? ROUTES.QUIZ_START(continueLearning.collection_id)
                      : ROUTES.SUBJECTS
                  }
                />
              } 
              className="w-full gap-2" 
              size="lg"
            >
              <PlayCircle className="size-4" />
              {isNewStudent ? "Start Learning" : "Start Quiz"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
