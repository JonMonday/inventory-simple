"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { FileDown, Package, Building, History, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function StockOnHandReportPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const { data: stock, isLoading } = useQuery({
        queryKey: ["report-stock-on-hand"],
        queryFn: async () => {
            const res = await api.get("/reports/stock-on-hand");
            return res.data;
        },
    });

    const handleExport = () => {
        window.open(`${process.env.NEXT_PUBLIC_API_URL}/reports/stock-on-hand?export=csv`, "_blank");
    };

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "item.name",
            header: "Item",
            id: "itemName",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.item.name}</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-mono">{row.original.item.code}</span>
                </div>
            ),
        },
        {
            accessorKey: "location.name",
            header: "Location",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Building className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{row.original.location.name}</span>
                </div>
            ),
        },
        {
            accessorKey: "quantityOnHand",
            header: "On Hand",
            cell: ({ row }) => (
                <span className="font-bold text-primary">
                    {row.original.quantityOnHand.toLocaleString()}
                </span>
            ),
        },
        {
            accessorKey: "reservedQuantity",
            header: "Reserved",
            cell: ({ row }) => (
                <span className="text-muted-foreground">
                    {row.original.reservedQuantity.toLocaleString()}
                </span>
            ),
        },
        {
            id: "available",
            header: "Available",
            cell: ({ row }) => {
                const available = row.original.quantityOnHand - row.original.reservedQuantity;
                return (
                    <span className={available <= row.original.item.reorderLevel ? "font-bold text-rose-500" : "font-semibold text-emerald-600"}>
                        {available.toLocaleString()}
                    </span>
                );
            },
        },
        {
            accessorKey: "lastUpdatedAt",
            header: "Last Update",
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <History className="h-3 w-3" />
                    {format(new Date(row.original.lastUpdatedAt), "MMM d, HH:mm")}
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Stock On Hand"
                subtitle="Detailed breakdown of current inventory levels across all locations."
                action={
                    <Button variant="outline" onClick={handleExport}>
                        <FileDown className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                }
            />

            <DataTable
                columns={columns}
                data={stock || []}
                searchKey="itemName"
                searchPlaceholder="Filter items..."
            />
        </div>
    );
}
