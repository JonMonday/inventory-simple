'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    History,
    ArrowLeftRight,
    BarChart3,
    Settings,
    ShieldCheck,
    FileUp,
    Boxes
} from 'lucide-react';
import { cn } from '../lib/utils';

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Inventory Items', href: '/items', icon: Package },
    { name: 'Stock on Hand', href: '/stock', icon: Boxes },
    { name: 'Inventory Ledger', href: '/ledger', icon: History },
    { name: 'Transactions', href: '/transactions', icon: ArrowLeftRight },
    { name: 'Bulk Import', href: '/import', icon: FileUp },
    { name: 'Forecasting', href: '/forecasting', icon: BarChart3 },
    { name: 'RBAC & Users', href: '/admin/users', icon: ShieldCheck },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col w-64 border-r bg-muted/30 h-screen sticky top-0">
            <div className="p-6">
                <h1 className="text-xl font-bold tracking-tight">Antigravity INV</h1>
            </div>
            <nav className="flex-1 px-4 space-y-1">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                                isActive
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
