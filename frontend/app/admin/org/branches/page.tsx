"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OrgService } from "@/services/org.service";
import { PageHeader } from "@/components/shared/page-header";
import { GenericCRUDList } from "@/components/admin/generic-crud-list";
import { EntityDialog } from "@/components/admin/entity-dialog";
import { toast } from "sonner";

export default function BranchesPage() {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const { data: branches, isLoading, error, refetch } = useQuery({
        queryKey: ["branches-list"],
        queryFn: () => OrgService.branches.list()
    });

    const selectedEntity = branches?.find((b: any) => b.id === selectedId);

    const mutation = useMutation({
        mutationFn: (values: any) => {
            const dto = { ...values };
            delete dto.parentId; // Branches don't have parents in this schema

            if (selectedId) {
                return OrgService.branches.update(selectedId, dto);
            }
            return OrgService.branches.create(dto);
        },
        onSuccess: () => {
            toast.success(selectedId ? "Branch updated" : "Branch created");
            setIsDialogOpen(false);
            queryClient.invalidateQueries({ queryKey: ["branches-list"] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Operation failed");
        }
    });

    const activateMutation = useMutation({
        mutationFn: OrgService.branches.activate,
        onSuccess: () => {
            toast.success("Branch activated");
            queryClient.invalidateQueries({ queryKey: ["branches-list"] });
        }
    });

    const deactivateMutation = useMutation({
        mutationFn: OrgService.branches.deactivate,
        onSuccess: () => {
            toast.success("Branch deactivated");
            queryClient.invalidateQueries({ queryKey: ["branches-list"] });
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
                title="Branches"
                subtitle="Manage organizational branches and locations."
            />

            <GenericCRUDList
                title="Branches"
                data={branches || []}
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
                    { key: 'description', label: 'Description', render: (item) => <span className="text-xs text-muted-foreground">{item.description || "No description"}</span> },
                ]}
            />

            <EntityDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                title={selectedId ? "Edit Branch" : "Create Branch"}
                loading={mutation.isPending}
                onSubmit={mutation.mutate}
                initialData={selectedEntity}
            />
        </div>
    );
}
