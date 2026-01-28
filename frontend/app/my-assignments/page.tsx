"use client";

import { useState, useEffect } from "react";
import { RequestsService } from "@/services/requests.service";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Loader2, Inbox, ArrowRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function MyAssignmentsPage() {
    const { user } = useAuth();
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            if (!user) return;
            try {
                setLoading(true);

                // Try backend filter first
                try {
                    const myWork = await RequestsService.listAssignedToMe();
                    setAssignments(myWork);
                } catch (err: any) {
                    // Fallback: Client-side filter if backend doesn't support assignedToMe
                    if (err.response?.status === 400 || err.response?.status === 404) {
                        const allRequests = await RequestsService.list();
                        const myWork = allRequests.filter((r: any) =>
                            r.assignments?.some((a: any) => a.assignedToId === user.id && a.isActive)
                        );
                        setAssignments(myWork);
                    } else {
                        throw err;
                    }
                }
            } catch (err) {
                console.error("Failed to load assignments", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [user]);

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
                title="Review Queue"
                subtitle="Manage requests currently assigned to you for review, approval, or fulfillment."
            />

            {assignments.length > 0 ? (
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Requester</TableHead>
                                <TableHead>Stage</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {assignments.map((req) => (
                                <TableRow key={req.id}>
                                    <TableCell className="font-mono font-bold text-primary">{req.readableId}</TableCell>
                                    <TableCell>
                                        <div>
                                            <p className="font-medium text-sm">{req.requester.fullName}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase">{req.department.name}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                            {req.currentStageType?.label || "None"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge
                                            label={req.status?.label || "Unknown"}
                                            type={
                                                req.status?.code === "CONFIRMED" || req.status?.code === "FULFILLED" ? "SUCCESS" :
                                                    req.status?.code === "REJECTED" || req.status?.code === "CANCELLED" ? "DANGER" :
                                                        req.status?.code === "IN_FLOW" ? "WARNING" : "INFO"
                                            }
                                        />
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground">
                                        {format(new Date(req.createdAt), "MMM dd, yyyy")}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button size="sm" variant="ghost" asChild>
                                            <Link href={`/requests/${req.id}`}>
                                                Open <ArrowRight className="ml-2 w-3 h-3" />
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            ) : (
                <Card className="bg-muted/30 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="p-4 bg-background rounded-full mb-4 border shadow-sm">
                            <Inbox className="w-12 h-12 text-muted-foreground/40" />
                        </div>
                        <h3 className="text-lg font-semibold">Your queue is empty</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mt-1">
                            You have no active assignments at this time. New tasks will appear here when requests enter your stage.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
