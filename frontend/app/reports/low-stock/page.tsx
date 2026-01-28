"use client";

import { useState, useEffect } from "react";
import { ReportsService } from "@/services/reports.service";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, AlertTriangle, Search, AlertCircle, Download } from "lucide-react";
import { toast } from "sonner";

export default function LowStockReportPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const reportData = await ReportsService.getLowStock();
                setData(reportData);
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to load low stock report");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filtered = data.filter((row) => {
        const searchLower = search.toLowerCase();
        return (
            row.item?.name?.toLowerCase().includes(searchLower) ||
            row.item?.code?.toLowerCase().includes(searchLower) ||
            row.storeLocation?.name?.toLowerCase().includes(searchLower)
        );
    });

    const handleExport = () => {
        toast.info("Export functionality pending backend implementation");
    };

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
                <p className="text-lg font-semibold">Failed to load report</p>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button onClick={retry}>Retry</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Low Stock Report"
                    subtitle="Items below minimum stock levels requiring attention."
                />
                <Button variant="outline" onClick={handleExport}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                </Button>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by item or location..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                />
            </div>

            {filtered.length > 0 ? (
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Store Location</TableHead>
                                <TableHead className="text-right">Current Stock</TableHead>
                                <TableHead className="text-right">Min Level</TableHead>
                                <TableHead className="text-right">Deficit</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((row, idx) => {
                                const deficit = (row.minLevel || 0) - (row.currentStock || 0);
                                const severity = deficit > (row.minLevel || 0) * 0.5 ? "critical" : "warning";

                                return (
                                    <TableRow key={idx}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium text-sm">{row.item?.name || "Unknown"}</p>
                                                <p className="text-[10px] text-muted-foreground font-mono uppercase">
                                                    {row.item?.code || "N/A"}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{row.storeLocation?.name || "Unknown"}</TableCell>
                                        <TableCell className="text-right font-bold text-destructive">
                                            {row.currentStock || 0}
                                        </TableCell>
                                        <TableCell className="text-right">{row.minLevel || 0}</TableCell>
                                        <TableCell className="text-right font-bold text-amber-600">
                                            {deficit > 0 ? deficit : 0}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={severity === "critical" ? "destructive" : "outline"}
                                                className={severity === "warning" ? "bg-amber-50 text-amber-700 border-amber-200" : ""}
                                            >
                                                {severity === "critical" ? "Critical" : "Low"}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Card>
            ) : (
                <Card className="bg-muted/30 border-dashed">
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="p-4 bg-background rounded-full mb-4 border shadow-sm">
                            <AlertTriangle className="w-12 h-12 text-muted-foreground/40" />
                        </div>
                        <h3 className="text-lg font-semibold">No low stock items</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mt-1">
                            {search
                                ? "No records match your search criteria."
                                : "All items are currently above minimum stock levels."}
                        </p>
                    </div>
                </Card>
            )}
        </div>
    );
}
