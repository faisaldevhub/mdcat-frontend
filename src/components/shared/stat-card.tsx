import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

// =============================================================================
// Stat Card — Dashboard metric card matching Stitch design
// =============================================================================
// Matches the "TOTAL ATTEMPTS: 1,248" / "AVG. ACCURACY: 68%" pattern
// from the dashboard designs.

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    positive?: boolean;
  };
  className?: string;
}

export function StatCard({
  label,
  value,
  icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-5">
        {icon && (
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary mb-3">
            {icon}
          </div>
        )}
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="text-2xl sm:text-3xl font-heading font-bold text-foreground mt-1">
          {value}
        </p>
        {trend && (
          <p
            className={cn(
              "text-xs font-medium mt-2 flex items-center gap-1",
              trend.positive ? "text-success" : "text-destructive"
            )}
          >
            <span>{trend.positive ? "↑" : "↓"}</span>
            {trend.value}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
