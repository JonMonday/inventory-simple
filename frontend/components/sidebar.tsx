"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    LayoutDashboard,
    Package,
    FileText,
    Download,
    Upload,
    ClipboardCheck,
    BarChart3,
    Activity,
    Users,
    Settings,
    LogOut,
    ChevronRight,
    Menu,
} from "lucide-react";
import { useAuthStore } from "@/store/use-auth-store";
import { APP_ROUTES, canAccessRoute } from "@/permissions/matrix";
import { ThemeToggle } from "@/components/theme-toggle"; // We need to create this
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const icons: Record<string, React.ComponentType<any>> = {
    LayoutDashboard,
    Package,
    FileText,
    Download,
    Upload,
    ClipboardCheck,
    BarChart3,
    Activity,
    Users,
    Settings,
};

export function Sidebar() {
    const pathname = usePathname();
    const permissions = useAuthStore((state) => state.permissions);
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

    // Group routes by navGroup
    const groupedRoutes = APP_ROUTES.reduce((acc, route) => {
        if (!canAccessRoute(permissions, route.href)) return acc;
        if (!acc[route.navGroup]) acc[route.navGroup] = [];
        acc[route.navGroup].push(route);
        return acc;
    }, {} as Record<string, typeof APP_ROUTES>);

    const NavContent = () => (
        <div className="flex flex-col h-full bg-sidebar border-r">
            <div className="h-14 flex items-center px-4 border-b font-semibold text-lg">
                Inventory<span className="text-primary">Sys</span>
            </div>

            <ScrollArea className="flex-1 py-4">
                <div className="space-y-6 px-3">
                    {Object.entries(groupedRoutes).map(([group, routes]) => (
                        <div key={group}>
                            <h4 className="mb-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                {group}
                            </h4>
                            <div className="space-y-1">
                                {routes.map((route) => {
                                    const Icon = icons[route.icon || ""] || Package;
                                    const isActive = pathname === route.href;

                                    return (
                                        <Button
                                            key={route.href}
                                            variant="ghost"
                                            className={cn(
                                                "w-full justify-start font-normal h-9",
                                                isActive && "bg-accent text-accent-foreground font-medium"
                                            )}
                                            asChild
                                        >
                                            <Link href={route.href}>
                                                <Icon className="mr-2 h-4 w-4" />
                                                {route.label}
                                            </Link>
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <div className="p-4 border-t space-y-4">
                {user && (
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase" title={user.fullName}>
                            {user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium truncate">{user.fullName}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between px-1">
                    <ThemeToggle />
                    <Button variant="ghost" size="icon" onClick={() => logout()} title="Logout">
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50 bg-background">
                <NavContent />
            </aside>

            {/* Mobile Sidebar */}
            <div className="md:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="md:hidden fixed top-3 left-3 z-50">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        <NavContent />
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}
