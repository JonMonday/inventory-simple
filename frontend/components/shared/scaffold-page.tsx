"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface ScaffoldPageProps {
    title: string;
    subtitle: string;
    description: string;
}

/**
 * Reusable scaffold page for pending routes.
 * Displays "Backend Pending" banner and standard page header.
 * 
 * Note: Permissions checking is handled by layout/sidebar/middleware,
 * but can be reinforced here if needed.
 */
export function ScaffoldPage({ title, subtitle, description }: ScaffoldPageProps) {
    return (
        <div className="space-y-6">
            <PageHeader
                title={title}
                subtitle={subtitle}
            />

            <Alert className="bg-muted/50 border-dashed">
                <Info className="h-4 w-4" />
                <AlertDescription>
                    <strong>Backend Pending:</strong> {description}
                </AlertDescription>
            </Alert>

            <div className="h-64 rounded-lg border border-dashed flex items-center justify-center text-muted-foreground bg-muted/20">
                <p>Content for {title} will appear here.</p>
            </div>
        </div>
    );
}
