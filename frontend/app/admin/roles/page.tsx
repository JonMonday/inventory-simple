"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminService } from "@/services/admin.service";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Shield, Fingerprint, Lock, ShieldCheck, Info, Plus, ChevronRight, Check } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { PERMISSIONS_META } from "@/permissions/permissions.generated";

export default function RolesPage() {
    const queryClient = useQueryClient();
    const [selectedRole, setSelectedRole] = useState<any | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newRole, setNewRole] = useState({ name: "", code: "", description: "" });

    // Queries
    const { data: roles, isLoading } = useQuery({
        queryKey: ["admin-roles"],
        queryFn: AdminService.getRoles
    });

    const { data: currentRolePerms, isLoading: loadingPerms } = useQuery({
        queryKey: ["role-permissions", selectedRole?.id],
        queryFn: () => AdminService.getRolePermissions(selectedRole.id),
        enabled: !!selectedRole
    });

    // Group permissions from registry for the matrix UI
    const groupedPermissions = PERMISSIONS_META.reduce((acc: any, p: any) => {
        if (!acc[p.group]) acc[p.group] = [];
        acc[p.group].push(p);
        return acc;
    }, {});

    // Mutations
    const createMutation = useMutation({
        mutationFn: AdminService.createRole,
        onSuccess: () => {
            toast.success("Role created");
            setIsCreateOpen(false);
            setNewRole({ name: "", code: "", description: "" });
            queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
        },
        onError: (err: any) => toast.error(err.response?.data?.message || "Failed to create role")
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) => AdminService.updateRole(id, data),
        onSuccess: () => {
            toast.success("Role updated");
            queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
        }
    });

    const togglePermissionMutation = useMutation({
        mutationFn: async ({ roleId, permissionId, action }: { roleId: string, permissionId: string, action: 'add' | 'remove' }) => {
            if (action === 'add') {
                return AdminService.addRolePermission(roleId, permissionId);
            } else {
                return AdminService.removeRolePermission(roleId, permissionId);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["role-permissions", selectedRole?.id] });
            queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
        }
    });

    const isPermEnabled = (key: string) => {
        return currentRolePerms?.some((rp: any) => rp.permission.key === key);
    };

    const handleTogglePerm = (permKey: string) => {
        // We need the ID of the permission to add/remove if the API requires it
        // Actually, looking at the registry, we have keys. 
        // Let's see if we can find the ID from the currentRolePerms or if we need a global permission list
    };

    // Need global permissions list with IDs
    const { data: allPermissions } = useQuery({
        queryKey: ["all-permissions"],
        queryFn: AdminService.getPermissions
    });

    const togglePerm = (permKey: string) => {
        const perm = allPermissions?.find((p: any) => p.key === permKey);
        if (!perm) return;

        const enabled = isPermEnabled(permKey);
        togglePermissionMutation.mutate({
            roleId: selectedRole.id,
            permissionId: perm.id,
            action: enabled ? 'remove' : 'add'
        });
    };

    if (isLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="RBAC Role Management"
                subtitle="Manage system roles and their associated permission sets from the centralized registry."
                action={{
                    label: "Create Role",
                    onClick: () => setIsCreateOpen(true),
                    icon: <Plus className="w-4 h-4" />
                }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {roles?.map((role: any) => (
                    <Card key={role.id} className="cursor-pointer hover:border-primary/40 transition-colors group" onClick={() => setSelectedRole(role)}>
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-sm font-bold uppercase tracking-tight">{role.name}</CardTitle>
                                <Shield className="w-4 h-4 text-primary" />
                            </div>
                            <CardDescription className="text-[10px] font-mono uppercase">{role.code}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Fingerprint className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-xs font-medium">{role.permissions?.length || 0} Permissions</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Create Role Sheet */}
            <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Create New Role</SheetTitle>
                        <SheetDescription>Define a new functional role for the system.</SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4 py-8">
                        <div className="space-y-2">
                            <Label>Role Name</Label>
                            <Input placeholder="Inventory Manager" value={newRole.name} onChange={e => setNewRole({ ...newRole, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Role Code</Label>
                            <Input placeholder="inventory_manager" value={newRole.code} onChange={e => setNewRole({ ...newRole, code: e.target.value.toLowerCase().replace(/\s+/g, '_') })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea placeholder="Brief description of responsibilities..." value={newRole.description} onChange={e => setNewRole({ ...newRole, description: e.target.value })} />
                        </div>
                    </div>
                    <SheetFooter>
                        <Button className="w-full" onClick={() => createMutation.mutate(newRole)} disabled={createMutation.isPending}>
                            {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Role
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Permission Matrix Sheet */}
            <Sheet open={!!selectedRole} onOpenChange={() => setSelectedRole(null)}>
                <SheetContent className="w-[500px] sm:w-[600px]">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                            Role Permission Matrix
                        </SheetTitle>
                        <SheetDescription>
                            Managing permissions for role: <span className="font-bold text-foreground">{selectedRole?.name}</span>
                        </SheetDescription>
                    </SheetHeader>

                    {selectedRole && (
                        <div className="mt-8 space-y-6 overflow-hidden flex flex-col h-[calc(100vh-200px)]">
                            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 flex items-center gap-3">
                                <Info className="w-5 h-5 text-primary" />
                                <div className="text-xs">
                                    <p className="font-bold">Matrix Configuration</p>
                                    <p className="text-muted-foreground text-[10px]">Changes are applied immediately to this role's capability set.</p>
                                </div>
                            </div>

                            <ScrollArea className="flex-1 pr-4">
                                <div className="space-y-8">
                                    {Object.entries(groupedPermissions).map(([group, perms]: [string, any]) => (
                                        <div key={group} className="space-y-3">
                                            <h4 className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground border-b pb-1">{group}</h4>
                                            <div className="grid grid-cols-1 gap-2">
                                                {perms.map((p: any) => {
                                                    const enabled = isPermEnabled(p.key);
                                                    const isPending = togglePermissionMutation.isPending && togglePermissionMutation.variables?.permissionId === allPermissions?.find((x: any) => x.key === p.key)?.id;

                                                    return (
                                                        <div key={p.key} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors group/item">
                                                            <div className="space-y-0.5">
                                                                <p className="font-mono text-[10px] font-bold uppercase">{p.key}</p>
                                                                <p className="text-[10px] text-muted-foreground">{p.label}</p>
                                                            </div>
                                                            <Checkbox
                                                                checked={enabled}
                                                                onCheckedChange={() => togglePerm(p.key)}
                                                                disabled={isPending || selectedRole.code === 'super_admin'}
                                                                className="h-4 w-4"
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>

                            <div className="pt-4 border-t">
                                <Badge variant="outline" className="w-full justify-center py-2 text-[10px] bg-muted/50 border-dashed">
                                    {selectedRole.code === 'super_admin' ? "System Administrator Role Locked" : "Granular Capability Matrix"}
                                </Badge>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
