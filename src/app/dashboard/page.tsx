"use client";

import { useAuthStore } from "@/stores/auth.store";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { toast } from "@/components/shared/toaster";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";

import { deleteRefreshTokenCookie } from "@/lib/auth-cookies";

export default function DashboardPage() {
  const { user, clearAuth } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed on server, proceeding with local logout", error);
    } finally {
      // Clear cookie and store regardless of server response
      deleteRefreshTokenCookie();
      clearAuth();
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
        variant: "default",
      });
      
      router.push("/login");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex w-full max-w-4xl flex-col space-y-6">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Welcome back to your MDCAT preparation platform.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
            <CardDescription>
              Minimal temporary dashboard to verify successful login.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium">Logged in as:</p>
              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <p><strong className="text-foreground">Name:</strong> {user?.display_name || "Unknown"}</p>
                <p><strong className="text-foreground">Email:</strong> {user?.email || "Unknown"}</p>
                <p><strong className="text-foreground">Role:</strong> {user?.role || "Unknown"}</p>
              </div>
            </div>
            
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
