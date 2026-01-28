import { ReactNode } from 'react';

interface FormGridProps {
    children: ReactNode;
    className?: string;
}

export function FormGrid({ children, className = '' }: FormGridProps) {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
            {children}
        </div>
    );
}

interface FullRowProps {
    children: ReactNode;
    className?: string;
}

export function FullRow({ children, className = '' }: FullRowProps) {
    return (
        <div className={`md:col-span-2 ${className}`}>
            {children}
        </div>
    );
}
