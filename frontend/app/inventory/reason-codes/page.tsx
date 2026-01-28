"use client";

import { useQuery } from "@tanstack/react-query";
import { InventoryService } from "@/services/inventory.service";
import { PageHeader } from "@/components/shared/page-header";
import { GenericCRUDList } from "@/components/admin/generic-crud-list";

export default function InventoryReasonCodesPage() {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["inventory-reason-codes-list"],
        queryFn: InventoryService.getReasonCodes
    });

    return (
        <div className="space-y-6">
            <PageHeader
                title="Reason Codes"
                subtitle="View available reason codes for inventory adjustments and transfers."
            />

            <GenericCRUDList
                title="Reason Codes"
                data={data || []}
                loading={isLoading}
                error={error ? (error as any).message : null}
                onRetry={refetch}
                // Read-only here, admin uses /admin/catalog/reason-codes
                canCreate={false}
                canEdit={false}
                canManage={false}
                emptyMessage="No reason codes defined yet."
                columns={[
                    { key: 'code', label: 'Code', render: (item) => <span className="font-mono text-[10px] font-bold uppercase">{item.code}</span> },
                    { key: 'name', label: 'Name', render: (item) => <span className="font-medium text-sm">{item.name}</span> },
                    { key: 'description', label: 'Description', render: (item) => <span className="text-xs text-muted-foreground">{item.description || "No description provided."}</span> },
                ]}
            />
        </div>
    );
}
