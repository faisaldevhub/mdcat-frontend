import { cn } from "@/lib/utils";

// =============================================================================
// Section Heading — Section titles within a page
// =============================================================================

interface SectionHeadingProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function SectionHeading({
  title,
  description,
  children,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4",
        className
      )}
    >
      <div>
        <h2 className="text-lg sm:text-xl font-heading font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
    </div>
  );
}
