import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ReactNode } from 'react';

interface SummaryItemProps {
    label: string;
    value: ReactNode;
    icon?: ReactNode;
}

export function SummaryItem({ label, value, icon }: SummaryItemProps) {
    return (
        <div className="flex items-start justify-between py-2">
            <div className="flex items-center gap-2">
                {icon && <span className="text-muted-foreground">{icon}</span>}
                <span className="text-sm text-muted-foreground">{label}</span>
            </div>
            <div className="text-sm font-medium text-right">{value}</div>
        </div>
    );
}

interface SummarySidebarProps {
    title: string;
    children: ReactNode;
}

export function SummarySidebar({ title, children }: SummarySidebarProps) {
    return (
        <Card className="sticky top-6">
            <CardHeader className="pb-3">
                <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-4 space-y-1">
                {children}
            </CardContent>
        </Card>
    );
}
