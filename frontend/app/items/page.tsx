'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useMemo, useState } from 'react';
import { Package, Plus, Search } from 'lucide-react';
import { ColDef } from 'ag-grid-community';

export default function ItemsPage() {
    const { data: items, isLoading } = useQuery({
        queryKey: ['items'],
        queryFn: async () => {
            const res = await api.get('/items');
            return res.data;
        },
    });

    const columnDefs = useMemo<ColDef[]>(() => [
        { field: 'sku', headerName: 'Item No.', sortable: true, filter: true, pinned: 'left' },
        { field: 'name', headerName: 'Item Name', sortable: true, filter: true, flex: 1 },
        { field: 'category.name', headerName: 'Category', sortable: true, filter: true },
        { field: 'uom.name', headerName: 'UOM', width: 100 },
        {
            headerName: 'Total Stock',
            valueGetter: (params) => {
                return params.data.snapshots?.reduce((acc: number, s: any) => acc + s.quantity, 0) || 0;
            },
            cellStyle: (params) => {
                if (params.value <= params.data.reorderLevel) return { color: 'red', fontWeight: 'bold' };
                return null;
            }
        },
        { field: 'reorderLevel', headerName: 'Reorder Level', width: 120 },
        {
            headerName: 'Actions',
            cellRenderer: (params: any) => (
                <button
                    onClick={() => alert(`Reassignment for ${params.data.name} coming soon!\nThis will create a REASSIGNMENT request in the system.`)}
                    className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs hover:opacity-80"
                >
                    Reassign
                </button>
            )
        },
        { field: 'discontinued', headerName: 'Status', cellRenderer: (params: any) => params.value ? 'Discontinued' : 'Active' },
    ], []);

    const defaultColDef = useMemo(() => ({
        resizable: true,
    }), []);

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Package className="w-6 h-6" />
                        Inventory Items
                    </h1>
                    <p className="text-muted-foreground">Manage your master inventory data and reorder levels.</p>
                </div>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium hover:opacity-90 transition-opacity">
                    <Plus className="w-4 h-4" />
                    Add New Item
                </button>
            </div>

            <div className="ag-theme-alpine flex-1 h-[600px] w-full border rounded-lg overflow-hidden shadow-sm">
                <AgGridReact
                    rowData={items}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    animateRows={true}
                    rowSelection="multiple"
                    pagination={true}
                    paginationPageSize={20}
                />
            </div>
        </div>
    );
}
