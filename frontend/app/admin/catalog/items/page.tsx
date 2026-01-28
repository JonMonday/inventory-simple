"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CatalogService } from "@/services/catalog.service";
import { OrgService } from "@/services/org.service";
import { PageHeader } from "@/components/shared/page-header";
import { GenericCRUDList } from "@/components/admin/generic-crud-list";
import { ItemDialog } from "@/components/admin/item-dialog";
import { toast } from "sonner";

export default function ItemsPage() {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Queries
    const { data: items, isLoading, error, refetch } = useQuery({
        queryKey: ["items-list"],
        queryFn: () => CatalogService.items.list()
    });

    const { data: categories } = useQuery({
        queryKey: ["categories-options"],
        queryFn: () => OrgService.categories.list()
    });

    const selectedEntity = items?.find((i: any) => i.id === selectedId);

    // Mutations
    const mutation = useMutation({
        mutationFn: (values: any) => {
            if (selectedId) {
                return CatalogService.items.update(selectedId, values);
            }
            return CatalogService.items.create(values);
        },
        onSuccess: () => {
            toast.success(selectedId ? "Item updated" : "Item created");
            setIsDialogOpen(false);
            queryClient.invalidateQueries({ queryKey: ["items-list"] });
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Operation failed");
        }
    });

    const activateMutation = useMutation({
        mutationFn: CatalogService.items.activate,
        onSuccess: () => {
            toast.success("Item activated");
            queryClient.invalidateQueries({ queryKey: ["items-list"] });
        }
    });

    const deactivateMutation = useMutation({
        mutationFn: CatalogService.items.deactivate,
        onSuccess: () => {
            toast.success("Item deactivated");
            queryClient.invalidateQueries({ queryKey: ["items-list"] });
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
                title="Items"
                subtitle="Manage inventory items and product catalog."
            />

            <GenericCRUDList
                title="Items"
                data={items || []}
                loading={isLoading}
                error={error ? (error as any).message : null}
                onRetry={refetch}
                onCreate={handleCreate}
                onEdit={handleEdit}
                onActivate={(id) => activateMutation.mutate(id)}
                onDeactivate={(id) => deactivateMutation.mutate(id)}
                columns={[
                    { key: 'code', label: 'Code', render: (item) => <span className="font-mono text-xs font-bold">{item.code}</span> },
                    { key: 'name', label: 'Name', render: (item) => <span className="font-medium">{item.name}</span> },
                    { key: 'category', label: 'Category', render: (item) => <span className="text-sm">{item.category?.name || 'Uncategorized'}</span> },
                    { key: 'unitOfMeasure', label: 'UOM', render: (item) => <span className="text-[10px] bg-muted px-2 py-0.5 rounded font-bold uppercase">{item.unitOfMeasure}</span> },
                    { key: 'reorderLevel', label: 'Min Level', render: (item) => <span className="text-xs font-mono">{item.reorderLevel}</span> },
                ]}
                emptyMessage="No items have been created yet."
            />

            <ItemDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                title={selectedId ? "Edit Item" : "Create Item"}
                loading={mutation.isPending}
                onSubmit={mutation.mutate}
                initialData={selectedEntity}
                categories={categories || []}
            />
        </div>
    );
}
