"use client";

import { useQuery } from "@tanstack/react-query";
import { ReportsService } from "@/services/reports.service";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, SlidersHorizontal, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

export default function AdjustmentsReportPage() {
    const { data: adjustments, isLoading } = useQuery({
        queryKey: ["reports-adjustments"],
        queryFn: ReportsService.getAdjustmentsSummary
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
                title="Adjustments Summary"
                subtitle="High-level audit of manual stock corrections, discrepancies, and wastage."
            />

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Item</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead className="text-right">Correction</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {adjustments?.map((a: any) => (
                            <TableRow key={a.id}>
                                <TableCell className="text-xs text-muted-foreground">
                                    {format(new Date(a.createdAtUtc), "MMM dd, yyyy")}
                                </TableCell>
                                <TableCell>
                                    <p className="font-semibold text-sm">{a.item.name}</p>
                                    <p className="text-[10px] text-muted-foreground font-mono">{a.item.code}</p>
                                </TableCell>
                                <TableCell className="text-xs">{a.storeLocation.name}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                                        <span className="text-xs">{a.reasonCode.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className={`text-right font-bold ${a.quantity < 0 ? "text-rose-600" : "text-emerald-600"}`}>
                                    {a.quantity > 0 ? "+" : ""}{a.quantity}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
