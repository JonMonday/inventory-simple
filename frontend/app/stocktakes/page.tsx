"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StocktakeService } from "@/services/stocktake.service";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, ArrowRight, ClipboardCheck } from "lucide-react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function StocktakesPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: stocktakes, isLoading } = useQuery({
        queryKey: ["stocktakes"],
        queryFn: StocktakeService.list,
    });

    const createMutation = useMutation({
        mutationFn: (storeLocationId: string) => StocktakeService.create(storeLocationId),
        onSuccess: (res: any) => {
            toast.success("Stocktake initiated");
            router.push(`/stocktakes/${res.data.id}`);
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to create stocktake");
        }
    });

    if (isLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Inventory Stocktakes"
                subtitle="Reconcile and adjust system stock levels through periodic physical audits."
                action={{
                    label: "New Audit",
                    onClick: () => {
                        // For simplicity, we create at HQ Main if prompted or use a default
                        const locId = window.prompt("Enter Store Location ID (e.g., HQ-MAIN-S)");
                        if (locId) createMutation.mutate(locId);
                    },
                    icon: <Plus className="w-4 h-4" />,
                }}
            />

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Audit #</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Started</TableHead>
                            <TableHead className="text-right">Manage</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {stocktakes?.map((s) => (
                            <TableRow key={s.id}>
                                <TableCell className="font-mono font-bold text-primary">{s.readableId}</TableCell>
                                <TableCell>{s.storeLocation.name}</TableCell>
                                <TableCell>
                                    <StatusBadge
                                        label={s.status.label}
                                        type={s.status.code === "APPLIED" ? "SUCCESS" : s.status.code === "CANCELLED" ? "DANGER" : "WARNING"}
                                    />
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                    {format(new Date(s.initiatedAt), "MMM dd, HH:mm")}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" variant="ghost" onClick={() => router.push(`/stocktakes/${s.id}`)}>
                                        Open <ArrowRight className="ml-2 w-3 h-3" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
