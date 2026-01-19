'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ShieldCheck, UserPlus } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';

export default function UsersPage() {
    const { data: metadata } = useQuery({
        queryKey: ['metadata'],
        queryFn: async () => {
            const res = await api.get('/metadata');
            return res.data;
        },
    });

    const columnDefs = [
        { field: 'username', headerName: 'Username', flex: 1 },
        { field: 'name', headerName: 'Display Name', flex: 1 },
        {
            field: 'role',
            headerName: 'Role',
            cellRenderer: (params: any) => (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${params.value === 'ADMIN' ? 'bg-red-100 text-red-700' :
                        params.value === 'MANAGER' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                    {params.value}
                </span>
            )
        },
    ];

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6" />
                        RBAC & Users
                    </h1>
                    <p className="text-muted-foreground">Manage system access and roles.</p>
                </div>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium hover:opacity-90 transition-opacity">
                    <UserPlus className="w-4 h-4" />
                    New User
                </button>
            </div>

            <div className="ag-theme-alpine h-[500px] w-full border rounded-lg overflow-hidden shadow-sm">
                <AgGridReact
                    rowData={metadata?.users || []}
                    columnDefs={columnDefs}
                    animateRows={true}
                />
            </div>
        </div>
    );
}
