"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { ColumnDef } from "@tanstack/react-table";
import {
    ClipboardList,
    Plus,
    Eye,
    MoreHorizontal,
    CheckCircle2,
    XSquare,
    Send,
    Truck
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { PermissionGate } from "@/components/permission-gate";
import { PERMISSIONS } from "@/permissions/matrix";

const statuses = [
    "ALL",
    "DRAFT",
    "SUBMITTED",
    "IN_REVIEW",
    "IN_APPROVAL",
    "APPROVED",
    "FULFILLED",
    "REJECTED"
];

export default function RequestsPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("ALL");

    const { data: requests, isLoading } = useQuery({
        queryKey: ["requests"],
        queryFn: async () => {
            const res = await api.get("/requests");
            return res.data;
        },
    });

    const filteredRequests = requests?.filter((r: any) =>
        activeTab === "ALL" ? true : r.status === activeTab
    ) || [];

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "readableId",
            header: "Request ID",
            cell: ({ row }) => (
                <span className="font-mono text-xs font-semibold uppercase">
                    #{row.original.readableId || row.original.id.slice(0, 8)}
                </span>
            ),
        },
        {
            accessorKey: "requester",
            header: "Requester",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.requester?.fullName || 'Unknown'}</span>
                    <span className="text-xs text-muted-foreground">{row.original.department?.name || row.original.departmentId || "General"}</span>
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.original.status;
                const code = status?.code || "DRAFT";
                const label = status?.label || "Draft";

                let type: any = "INFO";
                if (code === "CONFIRMED" || code === "FULFILLED") type = "SUCCESS";
                if (code === "REJECTED" || code === "CANCELLED") type = "DANGER";
                if (code === "IN_FLOW") type = "WARNING";

                return <StatusBadge label={label} type={type} />;
            },
        },
        {
            accessorKey: "createdAt",
            header: "Created",
            cell: ({ row }) => format(new Date(row.original.createdAt), "MMM dd, yyyy"),
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const request = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/requests/${request.id}`)}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>

                            <PermissionGate permissions={[PERMISSIONS.REQUESTS_APPROVE]}>
                                {request.status === "IN_APPROVAL" && (
                                    <DropdownMenuItem className="text-emerald-500 focus:text-emerald-500">
                                        <CheckCircle2 className="mr-2 h-4 w-4" /> Approve
                                    </DropdownMenuItem>
                                )}
                            </PermissionGate>

                            <PermissionGate permissions={[PERMISSIONS.REQUESTS_ISSUE]}>
                                {request.status === "APPROVED" && (
                                    <DropdownMenuItem className="text-blue-500 focus:text-blue-500">
                                        <Truck className="mr-2 h-4 w-4" /> Fulfill
                                    </DropdownMenuItem>
                                )}
                            </PermissionGate>

                            <DropdownMenuSeparator />
                            <PermissionGate permissions={[PERMISSIONS.REQUESTS_CANCEL]}>
                                <DropdownMenuItem className="text-rose-500 focus:text-rose-500">
                                    <XSquare className="mr-2 h-4 w-4" /> Cancel
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
                title="Inventory Requests"
                subtitle="Track and manage material requests, approvals, and fulfillment."
                action={{
                    label: "Create Request",
                    onClick: () => router.push("/requests/new"),
                    icon: <Plus className="w-4 h-4" />,
                }}
            />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-muted/50 p-1 h-auto flex-wrap justify-start">
                    {statuses.map((status) => (
                        <TabsTrigger
                            key={status}
                            value={status}
                            className="px-4 py-1.5 text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-sm"
                        >
                            {status}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            <DataTable
                columns={columns}
                data={filteredRequests}
                searchKey="readableId"
                searchPlaceholder="Find request #ID..."
            />
        </div>
    );
}
