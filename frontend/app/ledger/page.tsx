'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useMemo } from 'react';
import { History } from 'lucide-react';
import { ColDef } from 'ag-grid-community';
import { format } from 'date-fns';

export default function LedgerPage() {
    const { data: ledger, isLoading } = useQuery({
        queryKey: ['ledger'],
        queryFn: async () => {
            const res = await api.get('/ledger');
            return res.data;
        },
    });

    const columnDefs = useMemo<ColDef[]>(() => [
        {
            field: 'createdAt',
            headerName: 'Date',
            sortable: true,
            filter: 'agDateColumnFilter',
            valueFormatter: (params) => format(new Date(params.value), 'yyyy-MM-dd HH:mm'),
            pinned: 'left'
        },
        { field: 'item.sku', headerName: 'Item No.', filter: true },
        { field: 'item.name', headerName: 'Item Name', flex: 1, filter: true },
        {
            field: 'movementType',
            headerName: 'Type',
            cellStyle: (params) => {
                if (params.value === 'RECEIVE') return { color: 'green', fontWeight: 'bold' };
                if (params.value === 'ISSUE') return { color: 'blue', fontWeight: 'bold' };
                return null;
            }
        },
        { field: 'quantity', headerName: 'Quantity', width: 100 },
        { field: 'fromLocation.name', headerName: 'From' },
        { field: 'toLocation.name', headerName: 'To' },
        { field: 'reasonCode.code', headerName: 'Reason' },
        { field: 'referenceNo', headerName: 'Reference' },
        { field: 'createdBy.name', headerName: 'User' },
    ], []);

    const defaultColDef = useMemo(() => ({
        resizable: true,
    }), []);

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <History className="w-6 h-6" />
                        Inventory Ledger
                    </h1>
                    <p className="text-muted-foreground">Full audit trail of all inventory movements.</p>
                </div>
            </div>

            <div className="ag-theme-alpine h-[600px] w-full border rounded-lg overflow-hidden shadow-sm">
                <AgGridReact
                    rowData={ledger}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    animateRows={true}
                    pagination={true}
                    paginationPageSize={50}
                />
            </div>
        </div>
    );
}
