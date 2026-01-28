"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import { canAccessRoute, Permission } from "@/permissions/matrix";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RouteGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { token, permissions, _hasHydrated } = useAuthStore();

    useEffect(() => {
        if (!_hasHydrated) return;

        if (!token && pathname !== "/login") {
            router.push("/login");
        }

        if (token && pathname === "/login") {
            router.push("/");
        }
    }, [token, pathname, router, _hasHydrated]);

    if (!_hasHydrated) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // Public routes
    if (pathname === "/login" || pathname === "/change-password") {
        return <>{children}</>;
    }

    // If not logged in and not on public route, we are redirecting (handled by effect),
    // but return null or loader to prevent flash
    if (!token) {
        return null;
    }

    // Check RBAC
    const hasAccess = canAccessRoute(permissions as Permission[], pathname);

    if (!hasAccess) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4 p-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="p-4 bg-muted rounded-full">
                    <Lock className="h-12 w-12 text-muted-foreground" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Access Denied</h1>
                <p className="text-muted-foreground max-w-sm">
                    You do not have permission to view this page. Please contact your administrator if you believe this is an error.
                </p>
                <Button onClick={() => router.back()} variant="outline">
                    Go Back
                </Button>
            </div>
        );
    }

    return <>{children}</>;
}
