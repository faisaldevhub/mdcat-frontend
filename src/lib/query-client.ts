import { QueryClient } from "@tanstack/react-query";

// =============================================================================
// TanStack Query Client Configuration
// =============================================================================
// Global defaults for all queries and mutations.

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 30 seconds by default.
        // Feature hooks override this per-query as needed.
        staleTime: 30 * 1000,

        // Cached data is garbage collected after 5 minutes.
        gcTime: 5 * 60 * 1000,

        // Retry 3 times for server/network errors.
        // Do not retry for 4xx client errors.
        retry: (failureCount, error) => {
          const status = (error as unknown as Record<string, unknown>)?.status;
          if (typeof status === "number" && status >= 400 && status < 500) {
            return false;
          }
          return failureCount < 3;
        },

        // Refetch when the browser tab regains focus.
        refetchOnWindowFocus: true,

        // Do not refetch on reconnect by default.
        refetchOnReconnect: "always",
      },

      mutations: {
        // Mutations do not retry by default.
        retry: false,
      },
    },
  });
}

// Singleton for client-side usage.
let browserQueryClient: QueryClient | undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    // Server: always create a new client to avoid cross-request data leaks.
    return makeQueryClient();
  }

  // Browser: reuse the same client across renders.
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
