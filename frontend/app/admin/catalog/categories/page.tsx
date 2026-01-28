"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { OrgService } from "@/services/org.service";
import { PageHeader } from "@/components/shared/page-header";
import { GenericCRUDList } from "@/components/admin/generic-crud-list";
import { EntityDialog } from "@/components/admin/entity-dialog";
import { toast } from "sonner";

export default function CategoriesPage() {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Queries
    const { data: categories, isLoading, error, refetch } = useQuery({
        queryKey: ["categories-list"],
        queryFn: () => OrgService.categories.list()
    });

    const selectedEntity = categories?.find((c: any) => c.id === selectedId);

    // Mutations
    const mutation = useMutation({
        mutationFn: (values: any) => {
            const dto = { ...values };
            delete dto.parentId; // Categories can have parentCategoryId, but let's keep it simple for now or implement as needed

            if (selectedId) {
                return OrgService.categories.update(selectedId, dto);
            }
            return OrgService.categories.create(dto);
        },
        onSuccess: () => {
            toast.success(selectedId ? "Category updated" : "Category created");
            setIsDialogOpen(false);
            queryClient.invalidateQueries({ queryKey: ["categories-list"] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Operation failed");
        }
    });

    const activateMutation = useMutation({
        mutationFn: OrgService.categories.activate,
        onSuccess: () => {
            toast.success("Category activated");
            queryClient.invalidateQueries({ queryKey: ["categories-list"] });
        }
    });

    const deactivateMutation = useMutation({
        mutationFn: OrgService.categories.deactivate,
        onSuccess: () => {
            toast.success("Category deactivated");
            queryClient.invalidateQueries({ queryKey: ["categories-list"] });
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
                title="Categories"
                subtitle="Manage item categories and hierarchy for the inventory catalog."
            />

            <GenericCRUDList
                title="Categories"
                data={categories || []}
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
                title={selectedId ? "Edit Category" : "Create Category"}
                loading={mutation.isPending}
                onSubmit={mutation.mutate}
                initialData={selectedEntity}
            />
        </div>
    );
}
