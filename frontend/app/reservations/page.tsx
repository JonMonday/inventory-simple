"use client";

import { useState, useEffect } from "react";
import { ReservationsService } from "@/services/reservations.service";
import { PageHeader } from "@/components/shared/page-header";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Loader2, Lock, Search } from "lucide-react";
import { format } from "date-fns";

export default function ReservationsPage() {
    const [reservations, setReservations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await ReservationsService.getGlobal();
                setReservations(data);
            } catch (err) {
                console.error("Failed to load reservations", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const filtered = reservations.filter((res) => {
        const searchLower = search.toLowerCase();
        return (
            res.request?.readableId?.toLowerCase().includes(searchLower) ||
            res.item?.name?.toLowerCase().includes(searchLower) ||
            res.item?.code?.toLowerCase().includes(searchLower)
        );
    });

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
                title="Stock Reservations"
                subtitle="Global audit of all active stock reservations across requests."
            />

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by request ID or item name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {filtered.length > 0 ? (
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Request ID</TableHead>
                                <TableHead>Item</TableHead>
                                <TableHead>Store Location</TableHead>
                                <TableHead className="text-right">Quantity</TableHead>
                                <TableHead>Reserved At</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filtered.map((res) => (
                                <TableRow key={res.id}>
                                    <TableCell className="font-mono font-bold text-primary">
                                        {res.request?.readableId || "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-sm">{res.item?.name || "Unknown"}</p>
                                            <p className="text-[10px] text-muted-foreground font-mono uppercase">
                                                {res.item?.code || "N/A"}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-sm">{res.storeLocation?.name || "N/A"}</p>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <p className="text-lg font-bold">{res.quantity}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase">
                                            {res.item?.unitOfMeasure || ""}
                                        </p>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {res.createdAt ? format(new Date(res.createdAt), "MMM dd, yyyy HH:mm") : "N/A"}
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
                            <Lock className="w-12 h-12 text-muted-foreground/40" />
                        </div>
                        <h3 className="text-lg font-semibold">No active reservations</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mt-1">
                            {search ? "No reservations match your search criteria." : "There are currently no active stock reservations in the system."}
                        </p>
                    </div>
                </Card>
            )}
        </div>
    );
}
