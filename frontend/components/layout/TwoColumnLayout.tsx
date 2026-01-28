import { ReactNode } from 'react';

interface TwoColumnLayoutProps {
    children: ReactNode;
    sidebar: ReactNode;
    sidebarPosition?: 'left' | 'right';
    mobileSidebarFirst?: boolean;
}

export function TwoColumnLayout({
    children,
    sidebar,
    sidebarPosition = 'right',
    mobileSidebarFirst = false
}: TwoColumnLayoutProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {sidebarPosition === 'left' && (
                <aside className={`lg:col-span-3 space-y-4 ${mobileSidebarFirst ? 'order-first' : 'order-last lg:order-first'}`}>
                    {sidebar}
                </aside>
            )}

            <main className={`lg:col-span-9 ${mobileSidebarFirst && sidebarPosition === 'right' ? 'order-last' : ''}`}>
                {children}
            </main>

            {sidebarPosition === 'right' && (
                <aside className={`lg:col-span-3 space-y-4 ${mobileSidebarFirst ? 'order-first lg:order-last' : ''}`}>
                    {sidebar}
                </aside>
            )}
        </div>
    );
}
