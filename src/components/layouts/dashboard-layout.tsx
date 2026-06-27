"use client";

import { StudentSidebar } from "@/components/layouts/student-sidebar";
import { StudentTopBar } from "@/components/layouts/student-topbar";
import { MobileBottomNav } from "@/components/layouts/mobile-bottom-nav";

// =============================================================================
// Dashboard Layout — Sidebar + TopBar + Content
// =============================================================================
// Desktop: Sidebar (fixed left) + TopBar + scrollable content
// Mobile: TopBar + scrollable content + Bottom nav

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar — hidden on mobile */}
      <div className="hidden lg:block">
        <StudentSidebar />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col min-w-0">
        <StudentTopBar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileBottomNav />
    </div>
  );
}
