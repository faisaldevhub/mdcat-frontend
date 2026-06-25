"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";

// =============================================================================
// Global Providers
// =============================================================================
// Wraps the entire application with required client-side providers.
// - TanStack Query for server state management.
// - Zustand stores are global singletons and do not need providers.

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
