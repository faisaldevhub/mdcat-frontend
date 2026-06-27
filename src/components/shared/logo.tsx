import { cn } from "@/lib/utils";

// =============================================================================
// Logo — MDCAT in Second brand mark
// =============================================================================

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
}

const sizeClasses = {
  sm: "h-7 w-7",
  md: "h-9 w-9",
  lg: "h-12 w-12",
};

const textSizeClasses = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-2xl",
};

export function Logo({ size = "md", className, showText = true }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {/* Logo icon — stylized M */}
      <div
        className={cn(
          "rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-heading font-bold",
          sizeClasses[size]
        )}
      >
        <span className={size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"}>
          M
        </span>
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={cn(
              "font-heading font-bold tracking-tight text-foreground",
              textSizeClasses[size]
            )}
          >
            MDCAT
          </span>
          <span className="text-xs text-muted-foreground font-medium -mt-0.5">
            in Second
          </span>
        </div>
      )}
    </div>
  );
}
