"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { ColumnDef } from "@tanstack/react-table";
import { Activity, ArrowRight, ArrowLeft, RefreshCw } from "lucide-react";
import { format } from "date-fns";

export default function MovementsReportPage() {
    const { data: movements, isLoading } = useQuery({
        queryKey: ["ledger"],
        queryFn: async () => {
            const res = await api.get("/ledger");
            return res.data;
        },
    });

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "item.name",
            header: "Item",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium text-xs">{row.original.item.name}</span>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">{row.original.item.code}</span>
                </div>
            ),
        },
        {
            accessorKey: "createdAtUtc",
            header: "Date/Time",
            cell: ({ row }) => format(new Date(row.getValue("createdAtUtc")), "MMM dd, HH:mm"),
        },
        {
            accessorKey: "movementType",
            header: "Type",
            cell: ({ row }) => {
                const type = row.getValue("movementType") as string;
                let badgeType: any = "INFO";
                if (type === "RECEIVE" || type === "RETURN") badgeType = "SUCCESS";
                if (type === "ISSUE") badgeType = "WARNING";
                if (type === "REVERSAL") badgeType = "DANGER";

                return <StatusBadge label={type} type={badgeType} className="text-[10px]" />;
            }
        },
        {
            accessorKey: "quantity",
            header: "Qty",
            cell: ({ row }) => (
                <span className="font-bold flex items-center gap-1">
                    {row.original.movementType === 'ISSUE' ? <ArrowLeft className="h-3 w-3 text-rose-500" /> : <ArrowRight className="h-3 w-3 text-emerald-500" />}
                    {row.getValue("quantity")}
                </span>
            ),
        },
        {
            accessorKey: "locations",
            header: "Locations",
            cell: ({ row }) => (
                <div className="flex flex-col text-[10px]">
                    {row.original.fromLocation && <span>From: {row.original.fromLocation.name}</span>}
                    {row.original.toLocation && <span>To: {row.original.toLocation.name}</span>}
                </div>
            ),
        },
        {
            accessorKey: "createdBy.fullName",
            header: "User",
            cell: ({ row }) => <span className="text-xs">{row.original.createdBy.fullName}</span>,
        },
        {
            accessorKey: "reasonCode.code",
            header: "Reason",
            cell: ({ row }) => (
                <div className="flex flex-col text-[10px]">
                    <span className="font-medium">{row.original.reasonCode.code}</span>
                    <span className="text-muted-foreground truncate max-w-[150px]">{row.original.comments}</span>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Inventory Movements"
                subtitle="Complete audit trail of all stock transactions and adjustments across the system."
            />

            <DataTable
                columns={columns}
                data={movements || []}
                searchKey="item_name"
                searchPlaceholder="Search by item name..."
            />
        </div>
    );
}
