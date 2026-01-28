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

export default function DepartmentsPage() {
    const queryClient = useQueryClient();
    const [branchId, setBranchId] = useState<string>("all");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Queries
    const { data: branches } = useQuery({
        queryKey: ["branches-options"],
        queryFn: () => OrgService.branches.list()
    });

    const { data: departments, isLoading, error, refetch } = useQuery({
        queryKey: ["departments-list", branchId],
        queryFn: () => OrgService.departments.list(branchId !== "all" ? { branchId } : {})
    });

    const selectedEntity = departments?.find((d: any) => d.id === selectedId);

    // Mutations
    const mutation = useMutation({
        mutationFn: (values: any) => {
            const dto = { ...values, branchId: values.parentId };
            delete dto.parentId;

            if (selectedId) {
                return OrgService.departments.update(selectedId, dto);
            }
            return OrgService.departments.create(dto);
        },
        onSuccess: () => {
            toast.success(selectedId ? "Department updated" : "Department created");
            setIsDialogOpen(false);
            queryClient.invalidateQueries({ queryKey: ["departments-list"] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Operation failed");
        }
    });

    const activateMutation = useMutation({
        mutationFn: OrgService.departments.activate,
        onSuccess: () => {
            toast.success("Department activated");
            queryClient.invalidateQueries({ queryKey: ["departments-list"] });
        }
    });

    const deactivateMutation = useMutation({
        mutationFn: OrgService.departments.deactivate,
        onSuccess: () => {
            toast.success("Department deactivated");
            queryClient.invalidateQueries({ queryKey: ["departments-list"] });
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
                title="Departments"
                subtitle="Manage organization departments and their assignments to branches."
            />

            <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-lg border">
                <div className="flex items-center gap-2">
                    <Label htmlFor="branch-filter" className="text-xs font-bold uppercase text-muted-foreground whitespace-nowrap">Filter by Branch</Label>
                    <Select value={branchId} onValueChange={setBranchId}>
                        <SelectTrigger id="branch-filter" className="w-[200px] h-8 text-xs">
                            <SelectValue placeholder="All Branches" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Branches</SelectItem>
                            {branches?.map((b: any) => (
                                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <GenericCRUDList
                title="Departments"
                data={departments || []}
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
                    { key: 'branch', label: 'Branch', render: (item) => <span className="text-xs text-muted-foreground">{item.branch?.name || "Unassigned"}</span> },
                ]}
            />

            <EntityDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                title={selectedId ? "Edit Department" : "Create Department"}
                loading={mutation.isPending}
                onSubmit={mutation.mutate}
                initialData={selectedEntity}
                parentLabel="Branch"
                parentOptions={branches}
            />
        </div>
    );
}
