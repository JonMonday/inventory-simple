"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { ColumnDef } from "@tanstack/react-table";
import { ClipboardCheck, Plus, Eye, MoreHorizontal, ArrowRight } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { PermissionGate } from "@/components/permission-gate";
import { PERMISSIONS } from "@/permissions/matrix";

export default function StocktakesPage() {
    const router = useRouter();

    const { data: stocktakes, isLoading } = useQuery({
        queryKey: ["stocktakes"],
        queryFn: async () => {
            const res = await api.get("/stocktakes");
            return res.data;
        },
    });

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.getValue("title")}</span>
                    <span className="text-xs text-muted-foreground">{row.original.location?.name}</span>
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const val = row.getValue("status") as string;
                let type: any = "INFO";
                if (val === "APPLIED") type = "SUCCESS";
                if (val === "CANCELLED") type = "DANGER";
                if (val === "IN_PROGRESS" || val === "COUNTING") type = "WARNING";

                return <StatusBadge label={val} type={type} />;
            },
        },
        {
            accessorKey: "createdAt",
            header: "Date Created",
            cell: ({ row }) => format(new Date(row.original.createdAt), "MMM dd, yyyy"),
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const stocktake = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/stocktakes/${stocktake.id}`)}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <PermissionGate permissions={[PERMISSIONS.STOCKTAKE_START_COUNT]}>
                                {stocktake.status === "SCHEDULED" && (
                                    <DropdownMenuItem className="text-primary">
                                        <ArrowRight className="mr-2 h-4 w-4" /> Start Counting
                                    </DropdownMenuItem>
                                )}
                            </PermissionGate>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Inventory Stocktakes"
                subtitle="Perform periodic physical counts to reconcile and adjust system stock levels."
                action={{
                    label: "New Stocktake",
                    onClick: () => router.push("/stocktakes/new"),
                    icon: <Plus className="w-4 h-4" />,
                }}
            />

            <DataTable
                columns={columns}
                data={stocktakes || []}
                searchKey="title"
                searchPlaceholder="Search stocktakes..."
            />
        </div>
    );
}
