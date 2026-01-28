"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { InventoryService } from "@/services/inventory.service";
import { LedgerService } from "@/services/ledger.service";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Package, AlertCircle, Lock, History } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default function StockSnapshotDetailPage() {
    const { iid, sid } = useParams() as { iid: string; sid: string };
    const [snapshot, setSnapshot] = useState<any>(null);
    const [recentMovements, setRecentMovements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);

                const snapData = await InventoryService.getSnapshot(iid, sid);
                setSnapshot(snapData);

                // Try to load recent movements (optional)
                try {
                    const ledgerData = await LedgerService.list();
                    const filtered = ledgerData
                        .filter((entry: any) =>
                            entry.itemId === iid &&
                            (entry.fromStoreLocationId === sid || entry.toStoreLocationId === sid)
                        )
                        .slice(0, 10);
                    setRecentMovements(filtered);
                } catch (ledgerErr) {
                    // Silently fail - movements are optional
                    console.warn("Could not load recent movements", ledgerErr);
                }
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to load stock snapshot");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [iid, sid]);

    const retry = () => {
        setError(null);
        setLoading(true);
        window.location.reload();
    };

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <p className="text-lg font-semibold">Failed to load snapshot</p>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button onClick={retry}>Retry</Button>
            </div>
        );
    }

    if (!snapshot) return <div>Snapshot not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <PageHeader
                    title={`Stock: ${snapshot.item?.name || "Unknown"}`}
                    subtitle={`${snapshot.storeLocation?.name || "Unknown Location"}`}
                />
                <Button variant="outline" asChild>
                    <Link href="/inventory/stock-snapshots">Back to Snapshots</Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">On Hand</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{snapshot.onHand || 0}</p>
                        <p className="text-xs text-muted-foreground uppercase mt-1">
                            {snapshot.item?.unitOfMeasure || "units"}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Reserved</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-amber-600">{snapshot.reserved || 0}</p>
                        <p className="text-xs text-muted-foreground uppercase mt-1">
                            {snapshot.item?.unitOfMeasure || "units"}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Available</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-emerald-600">{snapshot.available || 0}</p>
                        <p className="text-xs text-muted-foreground uppercase mt-1">
                            {snapshot.item?.unitOfMeasure || "units"}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Item Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Item Code</p>
                            <p className="font-mono font-bold">{snapshot.item?.code || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Item Name</p>
                            <p className="font-semibold">{snapshot.item?.name || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Store Location</p>
                            <p className="font-semibold">{snapshot.storeLocation?.name || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Last Updated</p>
                            <p className="text-sm">
                                {snapshot.updatedAt ? format(new Date(snapshot.updatedAt), "MMM dd, yyyy HH:mm") : "N/A"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {snapshot.reservations && snapshot.reservations.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            Active Reservations
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Request ID</TableHead>
                                    <TableHead className="text-right">Quantity</TableHead>
                                    <TableHead>Reserved At</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {snapshot.reservations.map((res: any) => (
                                    <TableRow key={res.id}>
                                        <TableCell className="font-mono font-bold text-primary">
                                            {res.request?.readableId || res.requestId}
                                        </TableCell>
                                        <TableCell className="text-right font-bold">{res.quantity}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {res.createdAt ? format(new Date(res.createdAt), "MMM dd, HH:mm") : "N/A"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {recentMovements.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <History className="h-5 w-5" />
                            Recent Movements
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>From</TableHead>
                                    <TableHead>To</TableHead>
                                    <TableHead className="text-right">Quantity</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentMovements.map((movement) => (
                                    <TableRow key={movement.id}>
                                        <TableCell className="font-medium text-sm">
                                            {movement.movementType?.label || "Unknown"}
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            {movement.fromStore?.name || "-"}
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            {movement.toStore?.name || "-"}
                                        </TableCell>
                                        <TableCell className="text-right font-bold">{movement.quantity}</TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {format(new Date(movement.createdAtUtc), "MMM dd, HH:mm")}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
