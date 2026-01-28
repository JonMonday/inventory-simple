"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OrgService } from "@/services/org.service";
import { PageHeader } from "@/components/shared/page-header";
import { GenericCRUDList } from "@/components/admin/generic-crud-list";
import { EntityDialog } from "@/components/admin/entity-dialog";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function UnitsPage() {
    const queryClient = useQueryClient();
    const [departmentId, setDepartmentId] = useState<string>("all");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Queries
    const { data: departments } = useQuery({
        queryKey: ["departments-options"],
        queryFn: () => OrgService.departments.list()
    });

    const { data: units, isLoading, error, refetch } = useQuery({
        queryKey: ["units-list", departmentId],
        queryFn: () => OrgService.units.list(departmentId !== "all" ? { departmentId } : {})
    });

    const selectedEntity = units?.find((u: any) => u.id === selectedId);

    // Mutations
    const mutation = useMutation({
        mutationFn: (values: any) => {
            const dto = { ...values, departmentId: values.parentId };
            delete dto.parentId;

            if (selectedId) {
                return OrgService.units.update(selectedId, dto);
            }
            return OrgService.units.create(dto);
        },
        onSuccess: () => {
            toast.success(selectedId ? "Unit updated" : "Unit created");
            setIsDialogOpen(false);
            queryClient.invalidateQueries({ queryKey: ["units-list"] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Operation failed");
        }
    });

    const activateMutation = useMutation({
        mutationFn: OrgService.units.activate,
        onSuccess: () => {
            toast.success("Unit activated");
            queryClient.invalidateQueries({ queryKey: ["units-list"] });
        }
    });

    const deactivateMutation = useMutation({
        mutationFn: OrgService.units.deactivate,
        onSuccess: () => {
            toast.success("Unit deactivated");
            queryClient.invalidateQueries({ queryKey: ["units-list"] });
        }
    });

    const handleCreate = () => {
        setSelectedId(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (id: string) => {
        setSelectedId(id);
        setIsDialogOpen(true);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Units"
                subtitle="Manage organizational units within departments."
            />

            <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-lg border">
                <div className="flex items-center gap-2">
                    <Label htmlFor="dept-filter" className="text-xs font-bold uppercase text-muted-foreground whitespace-nowrap">Filter by Dept</Label>
                    <Select value={departmentId} onValueChange={setDepartmentId}>
                        <SelectTrigger id="dept-filter" className="w-[200px] h-8 text-xs">
                            <SelectValue placeholder="All Departments" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            {departments?.map((d: any) => (
                                <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <GenericCRUDList
                title="Units"
                data={units || []}
                loading={isLoading}
                error={error ? (error as any).message : null}
                onRetry={refetch}
                onCreate={handleCreate}
                onEdit={handleEdit}
                onActivate={(id) => activateMutation.mutate(id)}
                onDeactivate={(id) => deactivateMutation.mutate(id)}
                columns={[
                    { key: 'code', label: 'Code', render: (item) => <span className="font-mono text-xs font-bold uppercase">{item.code}</span> },
                    { key: 'name', label: 'Name', render: (item) => <span className="font-medium text-sm">{item.name}</span> },
                    { key: 'department', label: 'Department', render: (item) => <span className="text-xs text-muted-foreground">{item.department?.name || "Unassigned"}</span> },
                ]}
            />

            <EntityDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                title={selectedId ? "Edit Unit" : "Create Unit"}
                loading={mutation.isPending}
                onSubmit={mutation.mutate}
                initialData={selectedEntity}
                parentLabel="Department"
                parentOptions={departments}
            />
        </div>
    );
}
