"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OrgService } from "@/services/org.service";
import { PageHeader } from "@/components/shared/page-header";
import { GenericCRUDList } from "@/components/admin/generic-crud-list";
import { EntityDialog } from "@/components/admin/entity-dialog";
import { toast } from "sonner";

export default function ReasonCodesAdminPage() {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Queries
    const { data: reasonCodes, isLoading, error, refetch } = useQuery({
        queryKey: ["reason-codes-admin-list"],
        queryFn: () => OrgService.reasonCodes.list()
    });

    const selectedEntity = reasonCodes?.find((rc: any) => rc.id === selectedId);

    // Mutations
    const mutation = useMutation({
        mutationFn: (values: any) => {
            const dto = { ...values };
            delete dto.parentId;

            if (selectedId) {
                return OrgService.reasonCodes.update(selectedId, dto);
            }
            return OrgService.reasonCodes.create(dto);
        },
        onSuccess: () => {
            toast.success(selectedId ? "Reason Code updated" : "Reason Code created");
            setIsDialogOpen(false);
            queryClient.invalidateQueries({ queryKey: ["reason-codes-admin-list"] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Operation failed");
        }
    });

    const activateMutation = useMutation({
        mutationFn: OrgService.reasonCodes.activate,
        onSuccess: () => {
            toast.success("Reason Code activated");
            queryClient.invalidateQueries({ queryKey: ["reason-codes-admin-list"] });
        }
    });

    const deactivateMutation = useMutation({
        mutationFn: OrgService.reasonCodes.deactivate,
        onSuccess: () => {
            toast.success("Reason Code deactivated");
            queryClient.invalidateQueries({ queryKey: ["reason-codes-admin-list"] });
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
                title="Code Registry"
                subtitle="Configure system reason codes and movement types."
            />

            <GenericCRUDList
                title="Reason Codes"
                data={reasonCodes || []}
                loading={isLoading}
                error={error ? (error as any).message : null}
                onRetry={refetch}
                onCreate={handleCreate}
                onEdit={handleEdit}
                onActivate={(id) => activateMutation.mutate(id)}
                onDeactivate={(id) => deactivateMutation.mutate(id)}
                columns={[
                    { key: 'code', label: 'Code', render: (item) => <span className="font-mono text-[10px] font-bold uppercase">{item.code}</span> },
                    { key: 'name', label: 'Name', render: (item) => <span className="font-medium text-sm">{item.name}</span> },
                    { key: 'description', label: 'Description', render: (item) => <span className="text-xs text-muted-foreground">{item.description || "No description"}</span> },
                ]}
            />

            <EntityDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                title={selectedId ? "Edit Reason Code" : "Create Reason Code"}
                loading={mutation.isPending}
                onSubmit={mutation.mutate}
                initialData={selectedEntity}
            />
        </div>
    );
}
