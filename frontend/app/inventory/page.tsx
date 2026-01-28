"use client";

import { useQuery } from "@tanstack/react-query";
import { InventoryService } from "@/services/inventory.service";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Package, Lock, MapPin } from "lucide-react";
import { useState } from "react";

export default function InventoryPage() {
    const [search, setSearch] = useState("");

    const { data: snapshots, isLoading } = useQuery({
        queryKey: ["stock-snapshots"],
        queryFn: InventoryService.getSnapshots
    });

    const filtered = snapshots?.filter((s: any) =>
        s.item.name.toLowerCase().includes(search.toLowerCase()) ||
        s.item.code.toLowerCase().includes(search.toLowerCase()) ||
        s.storeLocation.name.toLowerCase().includes(search.toLowerCase())
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
                title="Stock Snapshots"
                subtitle="Real-time visibility into available balances and reserved quantities across the store network."
            />

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search items or locations..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>On Hand</TableHead>
                            <TableHead>Reserved</TableHead>
                            <TableHead>Available</TableHead>
                            <TableHead>Last Updated</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered?.map((s: any) => {
                            const available = s.quantityOnHand - s.reservedQuantity;
                            return (
                                <TableRow key={`${s.itemId}-${s.storeLocationId}`}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/5 rounded border text-primary">
                                                <Package className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">{s.item.name}</p>
                                                <p className="text-[10px] text-muted-foreground font-mono uppercase">{s.item.code}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin className="h-3 w-3 text-muted-foreground" />
                                            {s.storeLocation.name}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium">{s.quantityOnHand}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Lock className="h-3 w-3 text-amber-600" />
                                            <span className={s.reservedQuantity > 0 ? "text-amber-600 font-medium" : "text-muted-foreground"}>
                                                {s.reservedQuantity}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={available > 0 ? "outline" : "destructive"} className={available > 0 ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : ""}>
                                            {available}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-[10px] text-muted-foreground uppercase font-medium">
                                        {new Date(s.lastUpdatedAt).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
