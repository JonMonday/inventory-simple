"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { RouteGuard } from "@/components/route-guard";
import { cn } from "@/lib/utils";

export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";

    if (isLoginPage) {
        return <RouteGuard>{children}</RouteGuard>;
    }

    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar />
            <main className="flex-1 lg:pl-64 flex flex-col min-h-screen transition-all duration-300 ease-in-out">
                <div className="container py-6 md:p-8 max-w-7xl mx-auto space-y-8">
                    <div className="md:hidden h-12" /> {/* Spacer for mobile menu button */}
                    <RouteGuard>{children}</RouteGuard>
                </div>
            </main>
        </div>
    );
}
