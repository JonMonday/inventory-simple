import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactNode } from 'react';

interface FilterSidebarProps {
    title?: string;
    children: ReactNode;
}

export function FilterSidebar({ title = 'Filters', children }: FilterSidebarProps) {
    return (
        <Card className="lg:sticky lg:top-6 h-fit">
            <CardHeader className="pb-3">
                <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {children}
            </CardContent>
        </Card>
    );
}
