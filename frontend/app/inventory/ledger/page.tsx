"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LedgerService, LedgerEntry } from "@/services/inventory.service";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, History, RotateCcw, Info, Link as LinkIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/use-permissions";

export default function LedgerPage() {
    const queryClient = useQueryClient();
    const { hasPermission } = usePermissions();
    const [selectedEntry, setSelectedEntry] = useState<LedgerEntry | null>(null);

    const { data: ledger, isLoading } = useQuery({
        queryKey: ["ledger"],
        queryFn: LedgerService.list
    });

    const reverseMutation = useMutation({
        mutationFn: ({ id, reason }: { id: string; reason: string }) => LedgerService.reverse(id, reason),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ledger"] });
            toast.success("Movement reversed successfully");
            setSelectedEntry(null);
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Reversal failed");
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
                title="Inventory Ledger"
                subtitle="Full historical audit trail of all physical stock movements and adjustments."
            />

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Move #</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Item</TableHead>
                            <TableHead>Store</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Detail</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ledger?.map((entry) => (
                            <TableRow key={entry.id} className={entry.reversalOfLedgerId ? "bg-rose-500/5" : ""}>
                                <TableCell className="font-mono text-xs">
                                    {entry.id.slice(0, 8)}
                                    {entry.reversals && entry.reversals.length > 0 && (
                                        <Badge variant="outline" className="ml-2 text-[8px] bg-rose-500/10 text-rose-600 border-rose-500/20">REVERSED</Badge>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="bg-primary/5 text-primary">
                                        {entry.movementType.label}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <p className="font-semibold text-sm">{entry.item.name}</p>
                                    <p className="text-[10px] text-muted-foreground font-mono">{entry.item.code}</p>
                                </TableCell>
                                <TableCell>
                                    <p className="text-sm">{entry.toStore?.name || entry.fromStore?.name || "Global"}</p>
                                </TableCell>
                                <TableCell className="font-bold">
                                    {entry.quantity} <span className="text-[10px] font-normal text-muted-foreground">{entry.item.unitOfMeasure}</span>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                    {format(new Date(entry.createdAtUtc), "MMM dd, HH:mm")}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedEntry(entry)}>
                                        <Info className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            <Sheet open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
                <SheetContent className="w-[400px] sm:w-[500px]">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <History className="w-5 h-5 text-primary" />
                            Movement Detail
                        </SheetTitle>
                        <SheetDescription>
                            Technical audit data for entry {selectedEntry?.id.slice(0, 8)}
                        </SheetDescription>
                    </SheetHeader>

                    {selectedEntry && (
                        <div className="mt-8 space-y-6">
                            <div className="space-y-4 rounded-lg bg-muted/40 p-4 border">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-muted-foreground">Type</label>
                                        <p>{selectedEntry.movementType.label}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-muted-foreground">Reason</label>
                                        <p>{selectedEntry.reasonCode.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-muted-foreground">Reference</label>
                                        <p className="font-mono">{selectedEntry.referenceNo || "N/A"}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-muted-foreground">Quantity</label>
                                        <p className="font-bold">{selectedEntry.quantity}</p>
                                    </div>
                                </div>
                            </div>

                            {selectedEntry.reversalOfLedgerId && (
                                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-md flex items-center gap-3">
                                    <LinkIcon className="w-4 h-4 text-blue-600" />
                                    <div className="text-xs">
                                        <p className="font-bold text-blue-700">Reversal Entry</p>
                                        <p className="text-blue-600/80 italic">Corrects movement: {selectedEntry.reversalOfLedgerId.slice(0, 8)}</p>
                                    </div>
                                </div>
                            )}

                            {hasPermission("ledger.reverse") && !selectedEntry.reversalOfLedgerId && (!selectedEntry.reversals || selectedEntry.reversals.length === 0) && (
                                <div className="pt-6 border-t">
                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                        onClick={() => {
                                            const reason = window.prompt("Reason for reversal?");
                                            if (reason) reverseMutation.mutate({ id: selectedEntry.id, reason });
                                        }}
                                        disabled={reverseMutation.isPending}
                                    >
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        Reverse Movement
                                    </Button>
                                    <p className="text-[10px] text-muted-foreground mt-2 text-center">
                                        Caution: This creates an offsetting movement and restores stock snapshots.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
