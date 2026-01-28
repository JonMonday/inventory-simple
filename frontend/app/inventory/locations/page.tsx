"use client";

import { useQuery } from "@tanstack/react-query";
import { InventoryService } from "@/services/inventory.service";
import { PageHeader } from "@/components/shared/page-header";
import { GenericCRUDList } from "@/components/admin/generic-crud-list";

export default function InventoryLocationsPage() {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["inventory-locations-list"],
        queryFn: InventoryService.getLocations
    });

    return (
        <div className="space-y-6">
            <PageHeader
                title="Location Browser"
                subtitle="Browse and view inventory locations across all branches."
            />

            <GenericCRUDList
                title="Locations"
                data={data || []}
                loading={isLoading}
                error={error ? (error as any).message : null}
                onRetry={refetch}
                // Read-only for inventory staff, admin uses /admin/org/store-locations
                canCreate={false}
                canEdit={false}
                canManage={false}
                emptyMessage="No inventory locations found."
                columns={[
                    { key: 'code', label: 'Code', render: (item) => <span className="font-mono text-xs font-bold uppercase">{item.code}</span> },
                    { key: 'name', label: 'Name', render: (item) => <span className="font-medium text-sm">{item.name}</span> },
                    { key: 'branch', label: 'Branch', render: (item) => <span className="text-xs text-muted-foreground">{item.branch?.name || "System"}</span> },
                    { key: 'type', label: 'Type', render: (item) => <span className="text-[10px] bg-muted px-2 py-0.5 rounded font-bold uppercase">{item.type}</span> },
                ]}
            />
        </div>
    );
}
