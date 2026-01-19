'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useMemo, useState } from 'react';
import { ClipboardList, Plus, Search, CheckCircle, XCircle, Clock } from 'lucide-react';
import { ColDef } from 'ag-grid-community';
import { format } from 'date-fns';

export default function RequestsPage() {
    const queryClient = useQueryClient();
    const { data: requests, isLoading } = useQuery({
        queryKey: ['requests'],
        queryFn: async () => {
            const res = await api.get('/requests');
            return res.data;
        },
    });

    const approveMutation = useMutation({
        mutationFn: async (id: string) => {
            return api.patch(`/requests/${id}`, { status: 'APPROVED' });
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['requests'] }),
    });

    const columnDefs = useMemo<ColDef[]>(() => [
        { field: 'id', headerName: 'ID', width: 100 },
        {
            field: 'type',
            headerName: 'Type',
            cellRenderer: (params: any) => (
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${params.value === 'PROCUREMENT' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                    {params.value}
                </span>
            )
        },
        { field: 'item.name', headerName: 'Item', flex: 1 },
        { field: 'quantity', headerName: 'Qty', width: 80 },
        { field: 'requester.name', headerName: 'Requester', width: 150 },
        {
            field: 'status',
            headerName: 'Status',
            cellRenderer: (params: any) => {
                const status = params.value;
                return (
                    <div className="flex items-center gap-2">
                        {status === 'PENDING' && <Clock className="w-4 h-4 text-amber-500" />}
                        {status === 'APPROVED' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                        {status === 'REJECTED' && <XCircle className="w-4 h-4 text-destructive" />}
                        <span className="capitalize">{status.toLowerCase()}</span>
                    </div>
                );
            }
        },
        {
            field: 'createdAt',
            headerName: 'Date',
            valueFormatter: (params) => format(new Date(params.value), 'MMM dd, yyyy HH:mm')
        },
    ], []);

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <ClipboardList className="w-6 h-6" />
                        Inventory Requests
                    </h1>
                    <p className="text-muted-foreground">Manage procurement and internal reassignment requests.</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium hover:opacity-90 transition-opacity">
                        <Plus className="w-4 h-4" />
                        New Request
                    </button>
                </div>
            </div>

            <div className="ag-theme-alpine flex-1 h-[600px] w-full border rounded-lg overflow-hidden shadow-sm">
                <AgGridReact
                    rowData={requests}
                    columnDefs={columnDefs}
                    animateRows={true}
                    rowSelection="single"
                    pagination={true}
                    paginationPageSize={20}
                />
            </div>
        </div>
    );
}
