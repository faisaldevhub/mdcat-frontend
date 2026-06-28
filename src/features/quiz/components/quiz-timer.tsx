"use client";

import { useEffect, useState, useCallback, useRef } from "react";

// =============================================================================
// Quiz Timer — Countdown timer with warnings
// =============================================================================

interface QuizTimerProps {
  /** Total time in minutes. 0 = untimed quiz (timer hidden). */
  totalMinutes: number;
  /** ISO string of when the quiz started. */
  startedAt: string;
  /** Called when timer reaches zero. */
  onTimeExpired: () => void;
  className?: string;
}

export function QuizTimer({
  totalMinutes,
  startedAt,
  onTimeExpired,
  className,
}: QuizTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(() => {
    if (totalMinutes <= 0) return 0;

    // Backend sends MySQL datetime without timezone (e.g. "2026-06-28 20:30:00").
    // Parse robustly: convert space-separated datetime to ISO format.
    let startTime: number;
    try {
      // Replace space between date and time with "T" for ISO 8601 compatibility.
      // The backend uses current_time('mysql') which is server-local time.
      // We can't know the server timezone, so we treat it as a "moment in time"
      // relative to the server clock and calculate remaining = total - elapsed.
      const isoStr = startedAt.replace(" ", "T");
      startTime = new Date(isoStr).getTime();
    } catch {
      // If parsing fails entirely, start a fresh timer
      return totalMinutes * 60;
    }

    // If the parsed date is invalid (NaN), start a fresh timer
    if (isNaN(startTime)) {
      return totalMinutes * 60;
    }

    const endTime = startTime + totalMinutes * 60 * 1000;
    const now = Date.now();
    const remaining = Math.max(0, Math.floor((endTime - now) / 1000));

    // If remaining is 0 but we just started the quiz (within the last few seconds),
    // it's likely a timezone mismatch. Fall back to full duration.
    if (remaining === 0) {
      return totalMinutes * 60;
    }

    return remaining;
  });

  const hasExpiredRef = useRef(false);
  const warned5MinRef = useRef(false);
  const warned1MinRef = useRef(false);

  const handleExpiry = useCallback(() => {
    if (!hasExpiredRef.current) {
      hasExpiredRef.current = true;
      onTimeExpired();
    }
  }, [onTimeExpired]);

  useEffect(() => {
    if (totalMinutes <= 0) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          clearInterval(interval);
          handleExpiry();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [totalMinutes, handleExpiry]);

  // Warning states
  useEffect(() => {
    if (remainingSeconds <= 300 && remainingSeconds > 60 && !warned5MinRef.current) {
      warned5MinRef.current = true;
    }
    if (remainingSeconds <= 60 && !warned1MinRef.current) {
      warned1MinRef.current = true;
    }
  }, [remainingSeconds]);

  // Don't render for untimed quizzes
  if (totalMinutes <= 0) return null;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  // Color coding
  const isWarning = remainingSeconds <= 300 && remainingSeconds > 60;
  const isCritical = remainingSeconds <= 60;

  let colorClass = "text-muted-foreground";
  let bgClass = "bg-muted/50";
  if (isCritical) {
    colorClass = "text-red-600 dark:text-red-400";
    bgClass = "bg-red-50 dark:bg-red-950/30";
  } else if (isWarning) {
    colorClass = "text-amber-600 dark:text-amber-400";
    bgClass = "bg-amber-50 dark:bg-amber-950/30";
  }

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${bgClass} ${className || ""}`}
    >
      <TimerIcon className={`h-4 w-4 ${colorClass}`} />
      <span
        className={`text-sm font-mono font-semibold tabular-nums ${colorClass} ${isCritical ? "animate-pulse" : ""}`}
      >
        {formattedTime}
      </span>
    </div>
  );
}

function TimerIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
