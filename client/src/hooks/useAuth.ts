"use client";

import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/authStore";
import { LoginCredentials } from "@/types/auth";
import { useRouter } from "next/router";
import { useState } from "react";

export function useAuth() {
    const router = useRouter();
    const setUser = useAuthStore((state) => state.setUser);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function login(credentials: LoginCredentials) {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await authService.login(credentials);

            setUser(response.user);
            router.replace("/chat");

            return true;
        } catch (err) {
            const message = 
                err instanceof Error
                    ? err.message
                    : "Unable to log in. Please try again.";
            
            setError(message);
            return false;
        } finally {
            setIsLoading(false);
        }
    }

    async function logout() {
        try {
            await authService.logout();
        } finally {
            clearAuth();
            router.replace("login");
        }
    }

    return {
        login,
        logout,
        isLoading,
        error,
        clearError: () => setError(null),
    }
}