import { cn } from "@/lib/utils";

// =============================================================================
// Empty State — Displayed when a list or section has no data
// =============================================================================

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6",
        className
      )}
    >
      {icon && (
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-muted mb-4">
          <div className="text-muted-foreground">{icon}</div>
        </div>
      )}
      <h3 className="text-lg font-heading font-semibold text-foreground">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
