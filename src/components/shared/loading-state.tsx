import { cn } from "@/lib/utils";
import { Spinner } from "@/components/shared/spinner";

// =============================================================================
// Loading State — Full-area loading indicator
// =============================================================================

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "Loading...",
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-20 px-6",
        className
      )}
    >
      <Spinner size="lg" />
      <p className="text-sm text-muted-foreground mt-4">{message}</p>
    </div>
  );
}
