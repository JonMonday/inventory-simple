'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useMemo } from 'react';
import { Boxes } from 'lucide-react';
import { ColDef } from 'ag-grid-community';

export default function StockPage() {
    const { data: items } = useQuery({
        queryKey: ['items'],
        queryFn: async () => {
            const res = await api.get('/items');
            return res.data;
        },
    });

    const rowData = useMemo(() => {
        if (!items) return [];
        const flatStock: any[] = [];
        items.forEach((item: any) => {
            item.snapshots?.forEach((snap: any) => {
                flatStock.push({
                    sku: item.sku,
                    name: item.name,
                    category: item.category?.name,
                    location: snap.location?.name || snap.locationId,
                    quantity: snap.quantity,
                    uom: item.uom?.name
                });
            });
        });
        return flatStock;
    }, [items]);

    const columnDefs = useMemo<ColDef[]>(() => [
        { field: 'sku', headerName: 'SKU', sortable: true, filter: true },
        { field: 'name', headerName: 'Item Name', flex: 1, filter: true },
        { field: 'location', headerName: 'Location', sortable: true, filter: true },
        { field: 'quantity', headerName: 'Quantity', width: 120, sortable: true },
        { field: 'uom', headerName: 'UOM', width: 100 },
    ], []);

    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Boxes className="w-6 h-6" />
                    Stock on Hand
                </h1>
                <p className="text-muted-foreground">Current inventory levels across all locations.</p>
            </div>

            <div className="ag-theme-alpine h-[600px] w-full border rounded-lg overflow-hidden shadow-sm">
                <AgGridReact
                    rowData={rowData}
                    columnDefs={columnDefs}
                    animateRows={true}
                    pagination={true}
                    paginationPageSize={50}
                />
            </div>
        </div>
    );
}
