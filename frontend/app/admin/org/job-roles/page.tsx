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

export default function JobRolesPage() {
    const queryClient = useQueryClient();
    const [unitId, setUnitId] = useState<string>("all");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Queries
    const { data: units } = useQuery({
        queryKey: ["units-options"],
        queryFn: () => OrgService.units.list()
    });

    const { data: jobRoles, isLoading, error, refetch } = useQuery({
        queryKey: ["job-roles-list", unitId],
        queryFn: () => OrgService.jobRoles.list(unitId !== "all" ? { unitId } : {})
    });

    const selectedEntity = jobRoles?.find((jr: any) => jr.id === selectedId);

    // Mutations
    const mutation = useMutation({
        mutationFn: (values: any) => {
            const dto = { ...values, unitId: values.parentId };
            delete dto.parentId;

            if (selectedId) {
                return OrgService.jobRoles.update(selectedId, dto);
            }
            return OrgService.jobRoles.create(dto);
        },
        onSuccess: () => {
            toast.success(selectedId ? "Job Role updated" : "Job Role created");
            setIsDialogOpen(false);
            queryClient.invalidateQueries({ queryKey: ["job-roles-list"] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Operation failed");
        }
    });

    const activateMutation = useMutation({
        mutationFn: OrgService.jobRoles.activate,
        onSuccess: () => {
            toast.success("Job Role activated");
            queryClient.invalidateQueries({ queryKey: ["job-roles-list"] });
        }
    });

    const deactivateMutation = useMutation({
        mutationFn: OrgService.jobRoles.deactivate,
        onSuccess: () => {
            toast.success("Job Role deactivated");
            queryClient.invalidateQueries({ queryKey: ["job-roles-list"] });
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
                title="Job Roles"
                subtitle="Manage professional roles and designations within organizational units."
            />

            <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-lg border">
                <div className="flex items-center gap-2">
                    <Label htmlFor="unit-filter" className="text-xs font-bold uppercase text-muted-foreground whitespace-nowrap">Filter by Unit</Label>
                    <Select value={unitId} onValueChange={setUnitId}>
                        <SelectTrigger id="unit-filter" className="w-[200px] h-8 text-xs">
                            <SelectValue placeholder="All Units" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Units</SelectItem>
                            {units?.map((u: any) => (
                                <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <GenericCRUDList
                title="Job Roles"
                data={jobRoles || []}
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
                    { key: 'unit', label: 'Unit', render: (item) => <span className="text-xs text-muted-foreground">{item.unit?.name || "Unassigned"}</span> },
                ]}
            />

            <EntityDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                title={selectedId ? "Edit Job Role" : "Create Job Role"}
                loading={mutation.isPending}
                onSubmit={mutation.mutate}
                initialData={selectedEntity}
                parentLabel="Unit"
                parentOptions={units}
            />
        </div>
    );
}
