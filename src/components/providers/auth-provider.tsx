"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/auth.store";
import { authService } from "@/services/auth.service";
import { Spinner } from "@/components/shared/spinner";

import { getRefreshTokenCookie } from "@/lib/auth-cookies";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isRestoring, setIsRestoring] = useState(true);
  const { setAuth, clearAuth } = useAuthStore();

  useEffect(() => {
    const restoreSession = async () => {
      const hasRefreshToken = !!getRefreshTokenCookie();
      
      if (!hasRefreshToken) {
        setIsRestoring(false);
        return;
      }

      try {
        // Calling me() will trigger 401 if no access token exists yet,
        // which triggers the silent refresh interceptor automatically.
        const user = await authService.me();
        
        // After successful me(), the access token should be in the store 
        // updated by the interceptor.
        const { accessToken } = useAuthStore.getState();
        
        if (accessToken) {
          setAuth(accessToken, user);
        } else {
          clearAuth();
        }
      } catch {
        clearAuth();
      } finally {
        setIsRestoring(false);
      }
    };

    restoreSession();
  }, [setAuth, clearAuth]);

  if (isRestoring) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
        <Spinner size="lg" />
        <p className="mt-4 text-sm text-muted-foreground animate-pulse">Restoring session...</p>
      </div>
    );
  }

  return <>{children}</>;
}
