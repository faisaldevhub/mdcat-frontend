"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ROUTES } from "@/constants/routes";

// =============================================================================
// Student Top Bar
// =============================================================================

interface StudentTopBarProps {
  className?: string;
}

export function StudentTopBar({ className }: StudentTopBarProps) {
  return (
    <header
      className={cn(
        "flex items-center justify-between h-16 px-6 border-b border-border bg-card",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="lg:hidden" />
      </div>

      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <Button variant="ghost" size="icon" className="relative" render={<Link href={ROUTES.NOTIFICATIONS} />}>
          <BellIcon className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User avatar */}
        <Button variant="ghost" size="icon" className="rounded-full" render={<Link href={ROUTES.PROFILE} />}>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
              MA
            </AvatarFallback>
          </Avatar>
          <span className="sr-only">Profile</span>
        </Button>
      </div>
    </header>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
