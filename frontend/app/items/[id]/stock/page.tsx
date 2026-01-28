"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { InventoryService } from "@/services/inventory.service";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Package, AlertCircle, Info } from "lucide-react";
import { TwoColumnLayout } from "@/components/layout/TwoColumnLayout";
import { SummarySidebar, SummaryItem } from "@/components/layout/SummarySidebar";
import { Badge } from "@/components/ui/badge";

export default function ItemStockPage() {
    const { id } = useParams() as { id: string };
    const [stockData, setStockData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [backendPending, setBackendPending] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                setBackendPending(false);

                const data = await InventoryService.getItemStock(id);
                setStockData(data);
            } catch (err: any) {
                if (err.response?.status === 404 || err.response?.status === 501) {
                    setBackendPending(true);
                    setError("Backend endpoint pending: GET /items/:id/stock");
                } else {
                    setError(err.response?.data?.message || "Failed to load item stock");
                }
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

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

    return (
        <div className="space-y-6">
            <PageHeader
                title="Item Stock Distribution"
                subtitle={stockData?.item?.name || `Item ID: ${id}`}
            />

            {backendPending && (
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                        <strong>Backend Pending:</strong> The endpoint GET /items/:id/stock is not yet implemented.
                        This page will show stock distribution across locations once the backend is ready.
                    </AlertDescription>
                </Alert>
            )}

            {error && !backendPending && (
                <div className="h-[40vh] flex flex-col items-center justify-center gap-4">
                    <AlertCircle className="h-12 w-12 text-destructive" />
                    <p className="text-lg font-semibold">Failed to load item stock</p>
                    <p className="text-sm text-muted-foreground">{error}</p>
                    <Button onClick={retry}>Retry</Button>
                </div>
            )}

            {stockData && (
                <TwoColumnLayout
                    sidebar={
                        <SummarySidebar title="Item Summary">
                            <SummaryItem
                                label="Item Code"
                                value={<span className="font-mono font-bold">{stockData.item?.code || "—"}</span>}
                            />
                            <SummaryItem
                                label="Unit of Measure"
                                value={<span className="uppercase">{stockData.item?.unitOfMeasure || "—"}</span>}
                            />
                            <SummaryItem
                                label="Total On Hand"
                                value={<span className="text-2xl font-bold text-primary">{stockData.totalOnHand || 0}</span>}
                            />
                            <SummaryItem
                                label="Locations"
                                value={<Badge variant="secondary">{stockData.locations?.length || 0}</Badge>}
                            />
                        </SummarySidebar>
                    }
                >
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Item Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Item Code</p>
                                    <p className="font-mono font-bold">{stockData.item?.code || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Item Name</p>
                                    <p className="font-semibold">{stockData.item?.name || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Unit of Measure</p>
                                    <p className="font-semibold uppercase">{stockData.item?.unitOfMeasure || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Total On Hand</p>
                                    <p className="text-2xl font-bold text-primary">{stockData.totalOnHand || 0}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {stockData.locations && stockData.locations.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Stock by Location</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Store Location</TableHead>
                                                    <TableHead className="text-right">On Hand</TableHead>
                                                    <TableHead className="text-right">Reserved</TableHead>
                                                    <TableHead className="text-right">Available</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {stockData.locations.map((loc: any) => (
                                                    <TableRow key={loc.storeLocationId}>
                                                        <TableCell className="font-medium">{loc.storeLocation?.name || "Unknown"}</TableCell>
                                                        <TableCell className="text-right font-bold">{loc.onHand || 0}</TableCell>
                                                        <TableCell className="text-right font-bold text-amber-600">{loc.reserved || 0}</TableCell>
                                                        <TableCell className="text-right font-bold text-emerald-600">{loc.available || 0}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TwoColumnLayout>
            )}

            {!stockData && !error && (
                <Card className="bg-muted/30 border-dashed">
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="p-4 bg-background rounded-full mb-4 border shadow-sm">
                            <Package className="w-12 h-12 text-muted-foreground/40" />
                        </div>
                        <h3 className="text-lg font-semibold">No stock data available</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mt-1">
                            Stock distribution data for this item is not available.
                        </p>
                    </div>
                </Card>
            )}
        </div>
    );
}
