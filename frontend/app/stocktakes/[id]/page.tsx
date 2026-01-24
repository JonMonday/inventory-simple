"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { Input } from "@/components/ui/input";
import {
    Loader2,
    CheckCircle2,
    Play,
    ClipboardCheck,
    AlertCircle,
    Info,
} from "lucide-react";
import { useState, useEffect } from "react";
import { PermissionGate } from "@/components/permission-gate";
import { PERMISSIONS } from "@/permissions/matrix";
import { toast } from "sonner";

export default function StocktakeDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [counts, setCounts] = useState<Record<string, number>>({});

    const { data: stocktake, isLoading } = useQuery({
        queryKey: ["stocktake", id],
        queryFn: async () => {
            const res = await api.get(`/stocktakes/${id}`);
            return res.data;
        },
    });

    useEffect(() => {
        if (stocktake?.lines) {
            const initialCounts: Record<string, number> = {};
            stocktake.lines.forEach((line: any) => {
                initialCounts[line.id] = line.countedQuantity ?? line.systemQuantity;
            });
            setCounts(initialCounts);
        }
    }, [stocktake]);

    const mutate = useMutation({
        mutationFn: async ({ action, data }: { action: string; data?: any }) => {
            let res;
            if (action === "start") res = await api.post(`/stocktakes/${id}/start-count`);
            else if (action === "submit") res = await api.post(`/stocktakes/${id}/submit-count`, data);
            else if (action === "approve") res = await api.post(`/stocktakes/${id}/approve`);
            else if (action === "apply") res = await api.post(`/stocktakes/${id}/apply`);
            return res?.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["stocktake", id] });
            toast.success("Action performed successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Action failed");
        },
    });

    if (isLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!stocktake) return <div>Stocktake not found</div>;

    const handleCountChange = (lineId: string, value: string) => {
        setCounts(prev => ({ ...prev, [lineId]: parseInt(value) || 0 }));
    };

    const submitCounts = () => {
        const lines = Object.entries(counts).map(([lineId, countedQuantity]) => ({
            lineId,
            countedQuantity,
        }));
        mutate.mutate({ action: "submit", data: { lines } });
    };

    return (
        <div className="space-y-6 pb-20">
            <PageHeader
                title={stocktake.title}
                subtitle={`Location: ${stocktake.location.name} (${stocktake.location.code})`}
                action={stocktake.status === "SCHEDULED" ? {
                    label: "Start Counting",
                    onClick: () => mutate.mutate({ action: "start" }),
                    icon: <Play className="w-4 h-4" />
                } : undefined}
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Count Sheet</CardTitle>
                        <CardDescription>Enter the physical quantities found during the count.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 border-b">
                                    <tr>
                                        <th className="px-4 py-3 text-left font-medium">SKU / Item</th>
                                        <th className="px-4 py-3 text-right font-medium">System Qty</th>
                                        <th className="px-4 py-3 text-right font-medium w-[150px]">Physical Count</th>
                                        <th className="px-4 py-3 text-right font-medium">Variance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stocktake.lines.map((line: any) => {
                                        const counted = counts[line.id] ?? line.systemQuantity;
                                        const variance = counted - line.systemQuantity;
                                        return (
                                            <tr key={line.id} className="border-b hover:bg-muted/30 transition-colors">
                                                <td className="px-4 py-3">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold">{line.item.name}</span>
                                                        <span className="text-[10px] font-mono text-muted-foreground uppercase">{line.item.code}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-right font-medium">{line.systemQuantity}</td>
                                                <td className="px-4 py-3">
                                                    <Input
                                                        type="number"
                                                        className="h-8 text-right font-bold focus:ring-primary"
                                                        value={counted}
                                                        onChange={(e) => handleCountChange(line.id, e.target.value)}
                                                        disabled={stocktake.status !== "COUNTING" || mutate.isPending}
                                                    />
                                                </td>
                                                <td className={`px-4 py-3 text-right font-bold ${variance > 0 ? "text-emerald-600" : variance < 0 ? "text-rose-600" : "text-muted-foreground"
                                                    }`}>
                                                    {variance > 0 ? `+${variance}` : variance}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                    {stocktake.status === "COUNTING" && (
                        <CardFooter className="flex justify-end bg-muted/20 p-6 border-t">
                            <Button onClick={submitCounts} disabled={mutate.isPending}>
                                {mutate.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Submit Counts for Approval
                            </Button>
                        </CardFooter>
                    )}
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Session Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <StatusBadge label={stocktake.status} type={stocktake.status === "APPLIED" ? "SUCCESS" : "WARNING"} />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Items to Count</span>
                                <span className="font-bold">{stocktake.lines.length}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {stocktake.status === "COUNTING" && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
                            <div className="text-xs text-amber-800 space-y-1">
                                <p className="font-bold">Counting in Progress</p>
                                <p>System stock levels are frozen for this location until counts are submitted.</p>
                            </div>
                        </div>
                    )}

                    {stocktake.status === "APPLIED" && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex gap-3">
                            <Info className="h-5 w-5 text-emerald-600 shrink-0" />
                            <div className="text-xs text-emerald-800 space-y-1">
                                <p className="font-bold">Adjustments Applied</p>
                                <p>The inventory ledger has been updated to reflect these physical counts.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const Save = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" /><path d="M7 3v4a1 1 0 0 0 1 1h7" /></svg>
