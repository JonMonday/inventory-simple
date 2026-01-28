"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StocktakeService } from "@/services/stocktake.service";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import {
    Loader2, Save, CheckCircle2, XCircle,
    ArrowRight, ClipboardList, TrendingUp, TrendingDown
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function StocktakeDetailPage() {
    const { id } = useParams() as { id: string };
    const queryClient = useQueryClient();
    const [counts, setCounts] = useState<Record<string, number>>({});

    const { data: stocktake, isLoading: loadingHeader } = useQuery({
        queryKey: ["stocktake", id],
        queryFn: () => StocktakeService.getById(id)
    });

    const { data: lines, isLoading: loadingLines } = useQuery({
        queryKey: ["stocktake-lines", id],
        queryFn: () => StocktakeService.getLines(id)
    });

    useEffect(() => {
        if (lines) {
            const initialCounts: Record<string, number> = {};
            lines.forEach((l: any) => {
                initialCounts[l.id] = l.countedQuantity || 0;
            });
            setCounts(initialCounts);
        }
    }, [lines]);

    const mutate = useMutation({
        mutationFn: async (action: string) => {
            if (action === "start") return StocktakeService.startCount(id);
            if (action === "save") return StocktakeService.saveCounts(id, Object.entries(counts).map(([lid, qty]) => ({ id: lid, countedQuantity: qty })));
            if (action === "complete") return StocktakeService.completeCount(id);
            if (action === "approve") return StocktakeService.approve(id);
            if (action === "apply") return StocktakeService.apply(id);
            if (action === "cancel") return StocktakeService.cancel(id);
        },
        onSuccess: (_, action) => {
            queryClient.invalidateQueries({ queryKey: ["stocktake", id] });
            queryClient.invalidateQueries({ queryKey: ["stocktake-lines", id] });
            toast.success(`Action ${action} successful`);
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Action failed");
        }
    });

    if (loadingHeader || loadingLines) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!stocktake) return <div>Stocktake not found</div>;

    const status = stocktake.status.code;
    const canCount = status === "COUNTING";
    const canManage = status === "DRAFT";
    const canApprove = status === "COMPLETED";
    const canApply = status === "APPROVED";

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PageHeader
                    title={`Audit #${stocktake.readableId}`}
                    subtitle={`Store Location: ${stocktake.storeLocation.name}`}
                />
                <div className="flex flex-wrap gap-2">
                    {canManage && (
                        <Button onClick={() => mutate.mutate("start")} disabled={mutate.isPending}>
                            Start Count
                        </Button>
                    )}
                    {canCount && (
                        <Button onClick={() => mutate.mutate("complete")} disabled={mutate.isPending} className="bg-amber-600 hover:bg-amber-700">
                            Complete Count
                        </Button>
                    )}
                    {canApprove && (
                        <Button onClick={() => mutate.mutate("approve")} disabled={mutate.isPending} className="bg-emerald-600 hover:bg-emerald-700">
                            Approve Reconciliation
                        </Button>
                    )}
                    {canApply && (
                        <Button onClick={() => mutate.mutate("apply")} disabled={mutate.isPending} className="bg-blue-600 hover:bg-blue-700">
                            Apply to Ledger
                        </Button>
                    )}
                </div>
            </div>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>System Qty</TableHead>
                            <TableHead>Counted Qty</TableHead>
                            <TableHead>Variance</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {lines?.map((line: any) => {
                            const counted = counts[line.id] ?? line.countedQuantity;
                            const variance = counted - line.snapshotQuantity;
                            return (
                                <TableRow key={line.id}>
                                    <TableCell>
                                        <div className="flex flex-col text-sm">
                                            <span className="font-semibold">{line.item.name}</span>
                                            <span className="text-[10px] text-muted-foreground font-mono uppercase">{line.item.code}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{line.snapshotQuantity}</TableCell>
                                    <TableCell className="w-[150px]">
                                        <Input
                                            type="number"
                                            className="h-8 text-sm"
                                            value={counted}
                                            disabled={!canCount}
                                            onChange={(e) => setCounts(prev => ({ ...prev, [line.id]: parseFloat(e.target.value) || 0 }))}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {variance !== 0 ? (
                                            <div className={`flex items-center gap-1.5 text-sm font-bold ${variance > 0 ? "text-emerald-600" : "text-rose-600"}`}>
                                                {variance > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                                {variance > 0 ? "+" : ""}{variance}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">No Discrepancy</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <StatusBadge label={stocktake.status.label} type={status === "APPLIED" ? "SUCCESS" : "WARNING"} />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                {canCount && (
                    <CardFooter className="flex justify-end p-6 bg-muted/30 border-t">
                        <Button size="sm" onClick={() => mutate.mutate("save")} disabled={mutate.isPending}>
                            {mutate.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Technical Counts
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
