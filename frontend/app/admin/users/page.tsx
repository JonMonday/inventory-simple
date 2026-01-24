"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { ColumnDef } from "@tanstack/react-table";
import {
    Users,
    UserPlus,
    MoreHorizontal,
    ShieldAlert,
    Mail,
    UserCog,
    Ban,
    CheckCircle,
    Building,
    Package
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { PermissionGate } from "@/components/permission-gate";
import { PERMISSIONS } from "@/permissions/matrix";

export default function UsersAdminPage() {
    const router = useRouter();

    const { data: users, isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await api.get("/users");
            return res.data;
        },
    });

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "fullName",
            header: "User",
            cell: ({ row }) => {
                const name = row.getValue("fullName") as string;
                const fallback = name.split(" ").map(n => n[0]).join("").toUpperCase();
                return (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border">
                            <AvatarFallback className="text-[10px] font-bold bg-primary/5 text-primary">{fallback}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-medium">{name}</span>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Mail className="h-3 w-3" />
                                {row.original.email}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "department",
            header: "Dept / Location",
            cell: ({ row }) => (
                <div className="flex flex-col gap-1 text-xs">
                    <div className="flex items-center gap-2">
                        <Building className="h-3 w-3 text-muted-foreground" />
                        <span>{row.original.department?.name || "No Dept"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <Package className="h-3 w-3" />
                        <span>{row.original.location?.name || "No Home Loc"}</span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "roles",
            header: "Roles",
            cell: ({ row }) => (
                <div className="flex flex-wrap gap-1">
                    {row.original.roles?.map((r: any) => (
                        <span key={r.role.id} className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-muted border text-muted-foreground">
                            {r.role.name}
                        </span>
                    ))}
                    {(!row.original.roles || row.original.roles.length === 0) && <span className="text-xs text-muted-foreground">No roles</span>}
                </div>
            ),
        },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }) => (
                <StatusBadge
                    label={row.getValue("isActive") ? "Active" : "Disabled"}
                    type={row.getValue("isActive") ? "SUCCESS" : "DANGER"}
                />
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => router.push(`/admin/users/${user.id}`)}>
                                <UserCog className="mr-2 h-4 w-4" /> Edit Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <ShieldAlert className="mr-2 h-4 w-4" /> Manage Permissions
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <PermissionGate permissions={[PERMISSIONS.USERS_UPDATE]}>
                                {user.isActive ? (
                                    <DropdownMenuItem className="text-rose-500 focus:text-rose-500">
                                        <Ban className="mr-2 h-4 w-4" /> Deactivate User
                                    </DropdownMenuItem>
                                ) : (
                                    <DropdownMenuItem className="text-emerald-500 focus:text-emerald-500">
                                        <CheckCircle className="mr-2 h-4 w-4" /> Reactivate User
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
                title="User Administration"
                subtitle="Manage system users, departments, and access control levels (RBAC)."
                action={{
                    label: "Create User",
                    onClick: () => router.push("/admin/users/new"),
                    icon: <UserPlus className="w-4 h-4" />,
                }}
            />

            <DataTable
                columns={columns}
                data={users || []}
                searchKey="fullName"
                searchPlaceholder="Filter by name or email..."
            />
        </div>
    );
}
