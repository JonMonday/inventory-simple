"use client";

import { useState, useEffect } from "react";
import { ReportsService } from "@/services/reports.service";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingUp, Search, AlertCircle, Download } from "lucide-react";
import { toast } from "sonner";

export default function RequestKPIsReportPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const reportData = await ReportsService.getKPIs();
                setData(reportData);
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to load request KPIs");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

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

    const kpis = data?.kpis || [];
    const filtered = kpis.filter((kpi: any) => {
        const searchLower = search.toLowerCase();
        return (
            kpi.label?.toLowerCase().includes(searchLower) ||
            kpi.description?.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Request KPIs"
                    subtitle="Key performance indicators for requisition workflow."
                />
                <Button variant="outline" onClick={handleExport}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{data?.totalRequests || 0}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-amber-600">{data?.inProgress || 0}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold text-emerald-600">{data?.completed || 0}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Cycle Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{data?.avgCycleTime || 0}</p>
                        <p className="text-xs text-muted-foreground uppercase mt-1">days</p>
                    </CardContent>
                </Card>
            </div>

            {data?.byStatus && data.byStatus.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Requests by Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Count</TableHead>
                                    <TableHead className="text-right">Percentage</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data.byStatus.map((row: any, idx: number) => (
                                    <TableRow key={idx}>
                                        <TableCell>
                                            <Badge variant="outline">{row.status || "Unknown"}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-bold">{row.count || 0}</TableCell>
                                        <TableCell className="text-right text-muted-foreground">
                                            {row.percentage ? `${row.percentage}%` : "N/A"}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {filtered.length > 0 && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Additional Metrics</CardTitle>
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search metrics..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Metric</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Value</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((kpi: any, idx: number) => (
                                    <TableRow key={idx}>
                                        <TableCell className="font-medium">{kpi.label || "Unknown"}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {kpi.description || "No description"}
                                        </TableCell>
                                        <TableCell className="text-right font-bold">{kpi.value || 0}</TableCell>
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
