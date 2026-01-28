"use client";

import { useQuery } from "@tanstack/react-query";
import { ReportsService } from "@/services/reports.service";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Filter } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { TwoColumnLayout } from "@/components/layout/TwoColumnLayout";
import { FilterSidebar } from "@/components/layout/FilterSidebar";

export default function MovementsReportPage() {
    const [search, setSearch] = useState("");

    const { data: movements, isLoading } = useQuery({
        queryKey: ["reports-movements"],
        queryFn: ReportsService.getMovements
    });

    const filtered = movements?.filter((m: any) =>
        m.item.name.toLowerCase().includes(search.toLowerCase()) ||
        m.referenceNo?.toLowerCase().includes(search.toLowerCase())
    );

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
                title="Movement History"
                subtitle="Consolidated audit trail of all physical inventory transactions across the GRA network."
            />

            <TwoColumnLayout
                sidebarPosition="left"
                mobileSidebarFirst={true}
                sidebar={
                    <FilterSidebar title="Search & Filter">
                        <div className="space-y-2">
                            <Label htmlFor="search">Search Movements</Label>
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="search"
                                    placeholder="Search by item or reference..."
                                    className="pl-9"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </FilterSidebar>
                }
            >
                <div className="overflow-x-auto">
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Move Type</TableHead>
                                    <TableHead>From</TableHead>
                                    <TableHead>To</TableHead>
                                    <TableHead className="text-right">Quantity</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered?.map((m: any) => (
                                    <TableRow key={m.id}>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {format(new Date(m.createdAtUtc), "MMM dd, HH:mm")}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-sm">{m.item.name}</span>
                                                <span className="text-[10px] text-muted-foreground font-mono uppercase">{m.item.code}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-primary/5 text-primary">
                                                {m.movementType.label}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            {m.fromStore?.name || <span className="text-muted-foreground italic">External</span>}
                                        </TableCell>
                                        <TableCell className="text-xs">
                                            {m.toStore?.name || <span className="text-muted-foreground italic">External</span>}
                                        </TableCell>
                                        <TableCell className="text-right font-bold">
                                            {m.quantity} <span className="text-[10px] font-normal text-muted-foreground">{m.item.unitOfMeasure}</span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </div>
            </TwoColumnLayout>
        </div>
    );
}
