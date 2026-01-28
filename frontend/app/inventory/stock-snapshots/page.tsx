"use client";

import { useState, useEffect } from "react";
import { InventoryService } from "@/services/inventory.service";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Package, Search, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function StockSnapshotsPage() {
    const [snapshots, setSnapshots] = useState<any[]>([]);
    const [locations, setLocations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [locationFilter, setLocationFilter] = useState("all");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const [snapshotsData, locationsData] = await Promise.all([
                    InventoryService.getSnapshots(),
                    InventoryService.getLocations()
                ]);
                setSnapshots(snapshotsData);
                setLocations(locationsData);
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to load stock snapshots");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filtered = snapshots.filter((snap) => {
        const searchLower = search.toLowerCase();
        const matchesSearch =
            snap.item?.name?.toLowerCase().includes(searchLower) ||
            snap.item?.code?.toLowerCase().includes(searchLower);
        const matchesLocation = locationFilter === "all" || snap.storeLocationId === locationFilter;
        return matchesSearch && matchesLocation;
    });

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
                <p className="text-lg font-semibold">Failed to load stock snapshots</p>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button onClick={retry}>Retry</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title="Stock Snapshots"
                subtitle="Real-time view of stock levels across all store locations."
            />

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by item code or name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger className="w-full sm:w-[250px]">
                        <SelectValue placeholder="Filter by location" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Locations</SelectItem>
                        {locations.map((loc) => (
                            <SelectItem key={loc.id} value={loc.id}>
                                {loc.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {filtered.length > 0 ? (
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Store Location</TableHead>
                                <TableHead className="text-right">On Hand</TableHead>
                                <TableHead className="text-right">Reserved</TableHead>
                                <TableHead className="text-right">Available</TableHead>
                                <TableHead>Updated At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((snap) => (
                                <TableRow
                                    key={`${snap.itemId}-${snap.storeLocationId}`}
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => window.location.href = `/inventory/stock-snapshots/${snap.itemId}/${snap.storeLocationId}`}
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/10 rounded-md">
                                                <Package className="h-4 w-4 text-primary" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{snap.item?.name || "Unknown"}</p>
                                                <p className="text-[10px] text-muted-foreground font-mono uppercase">
                                                    {snap.item?.code || "N/A"}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm">{snap.storeLocation?.name || "Unknown"}</p>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <p className="text-lg font-bold">{snap.onHand || 0}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase">
                                            {snap.item?.unitOfMeasure || ""}
                                        </p>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <p className="text-lg font-bold text-amber-600">{snap.reserved || 0}</p>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <p className="text-lg font-bold text-emerald-600">{snap.available || 0}</p>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {snap.updatedAt ? format(new Date(snap.updatedAt), "MMM dd, yyyy HH:mm") : "N/A"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            ) : (
                <Card className="bg-muted/30 border-dashed">
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="p-4 bg-background rounded-full mb-4 border shadow-sm">
                            <Package className="w-12 h-12 text-muted-foreground/40" />
                        </div>
                        <h3 className="text-lg font-semibold">No stock snapshots found</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mt-1">
                            {search || locationFilter !== "all"
                                ? "No snapshots match your search criteria."
                                : "There are currently no stock snapshots in the system."}
                        </p>
                    </div>
                </Card>
            )}
        </div>
    );
}
