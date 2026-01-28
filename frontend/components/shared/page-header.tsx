"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode | {
        label: string;
        onClick: () => void;
        icon?: React.ReactNode;
        variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
    };
    className?: string;
}

export function PageHeader({ title, subtitle, action, className }: PageHeaderProps) {
    const isActionObject = action && typeof action === 'object' && 'label' in action;

    return (
        <div className={cn("flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8", className)}>
            <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                {subtitle && (
                    <p className="text-muted-foreground">{subtitle}</p>
                )}
            </div>
            {action && (
                <div className="md:w-auto w-full">
                    {isActionObject ? (
                        <Button
                            onClick={action.onClick}
                            variant={action.variant || "default"}
                            className="w-full md:w-auto"
                        >
                            {action.icon && <span className="mr-2">{action.icon}</span>}
                            {action.label}
                        </Button>
                    ) : (
                        action
                    )}
                </div>
            )}
        </div>
    );
}
