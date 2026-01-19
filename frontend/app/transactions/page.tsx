'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useMemo } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { ColDef } from 'ag-grid-community';
import { format } from 'date-fns';

export default function TransactionsPage() {
    const { data: ledger } = useQuery({
        queryKey: ['ledger'],
        queryFn: async () => {
            const res = await api.get('/ledger');
            return res.data;
        },
    });

    const columnDefs = useMemo<ColDef[]>(() => [
        { field: 'createdAt', headerName: 'Timestamp', valueFormatter: (params) => format(new Date(params.value), 'yyyy-MM-dd HH:mm:ss') },
        { field: 'item.sku', headerName: 'SKU' },
        { field: 'movementType', headerName: 'Action' },
        { field: 'quantity', headerName: 'Qty' },
        { field: 'referenceNo', headerName: 'Ref #' },
        { field: 'createdBy.name', headerName: 'By' },
    ], []);

    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <ArrowLeftRight className="w-6 h-6" />
                    Transactions
                </h1>
                <p className="text-muted-foreground">Detailed log of all system transactions.</p>
            </div>

            <div className="ag-theme-alpine h-[600px] w-full border rounded-lg overflow-hidden shadow-sm">
                <AgGridReact
                    rowData={ledger}
                    columnDefs={columnDefs}
                    animateRows={true}
                    pagination={true}
                    paginationPageSize={50}
                />
            </div>
        </div>
    );
}
