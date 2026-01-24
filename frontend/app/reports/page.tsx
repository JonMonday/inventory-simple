"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    LineChart,
    Line
} from "recharts";
import {
    FileDown,
    TrendingUp,
    AlertTriangle,
    PackageCheck,
    ArrowRight,
    Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

export default function ReportsPage() {
    const router = useRouter();
    const { data: stockOnHand } = useQuery({
        queryKey: ["report-stock"],
        queryFn: async () => {
            const res = await api.get("/reports/stock-on-hand");
            return res.data;
        },
    });

    const { data: lowStock } = useQuery({
        queryKey: ["report-low-stock"],
        queryFn: async () => {
            const res = await api.get("/reports/low-stock");
            return res.data;
        },
    });

    const { data: kpis } = useQuery({
        queryKey: ["report-kpis"],
        queryFn: async () => {
            const res = await api.get("/reports/request-kpis");
            return res.data;
        },
    });

    // Prepare data for Category Pie Chart
    const categoryData = stockOnHand?.reduce((acc: any[], item: any) => {
        const catName = item.item.category?.name || "Uncategorized";
        const existing = acc.find(a => a.name === catName);
        if (existing) {
            existing.value += item.quantityOnHand;
        } else {
            acc.push({ name: catName, value: item.quantityOnHand });
        }
        return acc;
    }, []) || [];

    const handleExport = async (type: string) => {
        // In a real app, this would trigger a download from the API
        window.open(`${process.env.NEXT_PUBLIC_API_URL}/reports/${type}?export=csv`, "_blank");
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Inventory Analytics"
                subtitle="Deep-dive insights into stock levels, consumption trends, and operational efficiency."
                action={
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleExport("stock-on-hand")}>
                            <FileDown className="mr-2 h-4 w-4" /> Export Stock
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleExport("movements")}>
                            <FileDown className="mr-2 h-4 w-4" /> Export Ledger
                        </Button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-primary/5 border-primary/10">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-primary/70 font-semibold uppercase text-[10px] tracking-wider">Fulfillment Rate</CardDescription>
                        <CardTitle className="text-2xl">{kpis?.fulfillmentRate || "0"}%</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                            <TrendingUp className="h-3 w-3" />
                            <span>Target: 95%</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription className="uppercase text-[10px] font-semibold tracking-wider">Low Stock SKUs</CardDescription>
                        <CardTitle className="text-2xl text-rose-500">{lowStock?.length || 0}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <AlertTriangle className="h-3 w-3" />
                            <span>Requires restock</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription className="uppercase text-[10px] font-semibold tracking-wider">Total SKUs</CardDescription>
                        <CardTitle className="text-2xl">{stockOnHand?.length || 0}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <PackageCheck className="h-3 w-3" />
                            <span>Unique items in store</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardDescription className="uppercase text-[10px] font-semibold tracking-wider">Active Requests</CardDescription>
                        <CardTitle className="text-2xl">14</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                            <TrendingUp className="h-3 w-3" />
                            <span>+2 since yesterday</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Inventory Distribution</CardTitle>
                            <CardDescription>Stock quantity by product category</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm">
                            <Filter className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle>Low Stock Alert</CardTitle>
                        <CardDescription>Top priorities for replenishment</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {lowStock?.slice(0, 5).map((item: any) => (
                            <div key={item.item.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold">{item.item.name}</span>
                                    <span className="text-[10px] text-muted-foreground uppercase font-mono">{item.item.code}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-bold text-rose-500">{item.quantityOnHand} {item.item.unitOfMeasure}</span>
                                    <span className="text-[10px] text-muted-foreground">Min: {item.item.reorderLevel}</span>
                                </div>
                            </div>
                        ))}
                        {lowStock?.length > 5 && (
                            <Button variant="link" className="w-full text-xs" onClick={() => router.push("/items")}>
                                View all low stock <ArrowRight className="ml-2 h-3 w-3" />
                            </Button>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
