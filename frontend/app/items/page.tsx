"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Plus, Eye, Edit, Trash2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PermissionGate } from "@/components/permission-gate";
import { PERMISSIONS } from "@/permissions/matrix";
import { useRouter } from "next/navigation";

export default function ItemsPage() {
    const router = useRouter();
    const { data: items, isLoading } = useQuery({
        queryKey: ["items"],
        queryFn: async () => {
            const res = await api.get("/items");
            return res.data;
        },
    });

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "code",
            header: "SKU",
            cell: ({ row }) => <span className="font-mono text-xs font-semibold">{row.getValue("code")}</span>,
        },
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.getValue("name")}</span>
                    <span className="text-xs text-muted-foreground">{row.original.category?.name || "No Category"}</span>
                </div>
            ),
        },
        {
            accessorKey: "stock",
            header: "Total Stock",
            cell: ({ row }) => {
                const stock = row.original.stockSnapshots?.reduce((acc: number, s: any) => acc + s.quantityOnHand, 0) || 0;
                const reorderLevel = row.original.reorderLevel || 0;
                const isLow = stock <= reorderLevel;

                return (
                    <div className="flex items-center gap-2">
                        <span className={isLow ? "text-rose-500 font-bold" : ""}>{stock}</span>
                        {isLow && <StatusBadge label="Low" type="DANGER" className="scale-75 origin-left" />}
                    </div>
                );
            },
        },
        {
            accessorKey: "reorderLevel",
            header: "Reorder",
        },
        {
            accessorKey: "unitOfMeasure",
            header: "UOM",
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                return (
                    <StatusBadge
                        label={status}
                        type={status === "ACTIVE" ? "SUCCESS" : "NEUTRAL"}
                    />
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const item = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/items/${item.id}`)}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <PermissionGate permissions={[PERMISSIONS.ITEMS_UPDATE]}>
                                <DropdownMenuItem onClick={() => router.push(`/items/${item.id}/edit`)}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit Item
                                </DropdownMenuItem>
                            </PermissionGate>
                            <DropdownMenuSeparator />
                            <PermissionGate permissions={[PERMISSIONS.ITEMS_DELETE]}>
                                <DropdownMenuItem className="text-rose-500 focus:text-rose-500">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete Item
                                </DropdownMenuItem>
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
                title="Inventory Items"
                subtitle="Manage your master inventory data, categories, and stock levels."
                action={{
                    label: "New Item",
                    onClick: () => router.push("/items/new"),
                    icon: <Plus className="w-4 h-4" />,
                }}
            />

            <DataTable
                columns={columns}
                data={items || []}
                searchKey="name"
                searchPlaceholder="Filter items by name..."
            />
        </div>
    );
}
