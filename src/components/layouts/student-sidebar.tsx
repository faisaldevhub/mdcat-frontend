"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

// =============================================================================
// Student Sidebar — Matches Stitch dashboard sidebar design
// =============================================================================

const navItems = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: DashboardIcon },
  { label: "Q-Bank", href: ROUTES.SUBJECTS, icon: QBankIcon },
  { label: "Bookmarks", href: ROUTES.BOOKMARKS, icon: BookmarkIcon },
  { label: "Wrong Questions", href: ROUTES.WRONG_QUESTIONS, icon: WrongIcon },
  { label: "Rankings", href: ROUTES.LEADERBOARD, icon: RankingsIcon },
  { label: "Analytics", href: ROUTES.ANALYTICS, icon: AnalyticsIcon },
  { label: "Achievements", href: ROUTES.ACHIEVEMENTS, icon: AchievementsIcon },
];

interface StudentSidebarProps {
  collapsed?: boolean;
  className?: string;
}

export function StudentSidebar({ collapsed, className }: StudentSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-sidebar border-r border-sidebar-border",
        collapsed ? "w-[68px]" : "w-[240px]",
        "transition-all duration-200",
        className
      )}
    >
      {/* Logo */}
      <div className="p-4 pb-2">
        <Logo size="md" showText={!collapsed} />
      </div>

      {/* User profile pill */}
      <div className={cn("px-3 py-3", collapsed && "px-2")}>
        <div
          className={cn(
            "flex items-center gap-2.5 rounded-lg p-2",
            collapsed && "justify-center"
          )}
        >
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
              MA
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-sidebar-foreground truncate">
                Medical Aspirant
              </p>
              <p className="text-xs text-muted-foreground truncate">
                Pre-Medical Track
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Start Quiz CTA */}
      <div className="p-3 mt-auto">
        <Button
          render={<Link href={ROUTES.SUBJECTS} />}
          className={cn(
            "w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold",
            collapsed && "px-2"
          )}
        >
          <PlayIcon className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Start Quiz</span>}
        </Button>
      </div>
    </aside>
  );
}

// =============================================================================
// Inline SVG Icons
// =============================================================================

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}
function QBankIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
      <path d="M8 7h6" /><path d="M8 11h8" />
    </svg>
  );
}
function BookmarkIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}
function WrongIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
function RankingsIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M8 21v-6" /><path d="M12 21V9" /><path d="M16 21v-4" />
    </svg>
  );
}
function AnalyticsIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 16V8" /><path d="M12 16v-4" /><path d="M16 16v-7" />
    </svg>
  );
}
function AchievementsIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 22V8a2 2 0 1 0-4 0v1" /><path d="M14 22V8a2 2 0 1 1 4 0v1" />
    </svg>
  );
}
function PlayIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}
