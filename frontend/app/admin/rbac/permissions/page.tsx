"use client";

import { useQuery } from "@tanstack/react-query";
import { AdminService } from "@/services/admin.service";
import { PageHeader } from "@/components/shared/page-header";
import { GenericCRUDList } from "@/components/admin/generic-crud-list";

export default function PermissionsPage() {
    const { data: permissions, isLoading, error, refetch } = useQuery({
        queryKey: ["permissions-list"],
        queryFn: AdminService.getPermissions
    });

    return (
        <div className="space-y-6">
            <PageHeader
                title="System Permissions"
                subtitle="Review the 128-route permission registry and system capability nodes."
            />

            <GenericCRUDList
                title="Permissions"
                data={permissions || []}
                loading={isLoading}
                error={error ? (error as any).message : null}
                onRetry={refetch}
                canCreate={false}
                canEdit={false}
                canManage={false}
                emptyMessage="No permissions found in registry. Ensure the system is seeded."
                columns={[
                    { key: 'group', label: 'Group', render: (item) => <span className="text-[10px] font-bold uppercase py-0.5 px-2 bg-muted rounded">{item.group}</span> },
                    { key: 'key', label: 'Constant Key', render: (item) => <span className="font-mono text-[10px] font-bold uppercase">{item.key}</span> },
                    { key: 'label', label: 'Label', render: (item) => <span className="font-medium text-sm">{item.label}</span> },
                    { key: 'description', label: 'Description', render: (item) => <span className="text-xs text-muted-foreground">{item.description || "System assigned constant."}</span> },
                ]}
            />
        </div>
    );
}
