"use client";

import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type AuthRouteGuardProps = {
  children: React.ReactNode;
};

export default function AuthRouteGuard({ children }: AuthRouteGuardProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      if (isAuthenticated) {
        router.replace("/chat");
        return;
      }

      try {
        const response = await authService.getCurrentUser();

        if (isMounted) {
          setUser(response.user);
          router.replace("/chat");
        }
      } catch {
        if (isMounted) {
          clearAuth();
          setIsCheckingSession(false);
        }
      }
    }

    void checkSession();

    return () => {
      isMounted = false;
    };
  }, [clearAuth, isAuthenticated, router, setUser]);

  if (isCheckingSession || isAuthenticated) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <p className="text-sm text-muted-foreground">Checking your session…</p>
      </div>
    );
  }

  return <>{children}</>;
}
