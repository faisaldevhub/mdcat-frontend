"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// =============================================================================
// Quiz Submit Dialog — Confirmation before final submission
// =============================================================================

interface QuizSubmitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  answeredCount: number;
  totalQuestions: number;
  isSubmitting: boolean;
  onConfirm: () => void;
}

export function QuizSubmitDialog({
  open,
  onOpenChange,
  answeredCount,
  totalQuestions,
  isSubmitting,
  onConfirm,
}: QuizSubmitDialogProps) {
  const unanswered = totalQuestions - answeredCount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Quiz?</DialogTitle>
          <DialogDescription>
            Please review your progress before submitting.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 p-3 text-center">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {answeredCount}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Answered</p>
            </div>
            <div className="rounded-lg bg-muted p-3 text-center">
              <p className="text-2xl font-bold text-muted-foreground">
                {unanswered}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Unanswered</p>
            </div>
          </div>

          {unanswered > 0 && (
            <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
              You have {unanswered} unanswered{" "}
              {unanswered === 1 ? "question" : "questions"}. Unanswered
              questions will be marked as skipped.
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Go Back
          </Button>
          <Button onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Submitting...
              </span>
            ) : (
              "Submit Quiz"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
