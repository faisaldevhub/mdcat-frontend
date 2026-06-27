"use client";

import { useSyncExternalStore, useCallback } from "react";

// =============================================================================
// useMediaQuery — Responsive breakpoint hook
// =============================================================================

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", callback);
      return () => media.removeEventListener("change", callback);
    },
    [query]
  );

  const getSnapshot = useCallback(() => {
    return window.matchMedia(query).matches;
  }, [query]);

  const getServerSnapshot = useCallback(() => {
    return false;
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Check if screen is desktop (≥1024px). */
export function useIsDesktop(): boolean {
  return useMediaQuery("(min-width: 1024px)");
}

/** Check if screen is tablet (≥768px). */
export function useIsTablet(): boolean {
  return useMediaQuery("(min-width: 768px)");
}

/** Check if screen is mobile (<768px). */
export function useIsMobile(): boolean {
  return useMediaQuery("(max-width: 767px)");
}
