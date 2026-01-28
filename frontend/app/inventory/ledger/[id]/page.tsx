"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { LedgerService } from "@/services/ledger.service";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, History, AlertCircle, ArrowRight, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";
import { TwoColumnLayout } from "@/components/layout/TwoColumnLayout";
import { SummarySidebar, SummaryItem } from "@/components/layout/SummarySidebar";

export default function LedgerDetailPage() {
    const { id } = useParams() as { id: string };
    const [entry, setEntry] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reversing, setReversing] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);

                // Try direct endpoint first
                try {
                    const data = await LedgerService.getById(id);
                    setEntry(data);
                } catch (directErr: any) {
                    // Fallback: Get all and find by ID
                    if (directErr.response?.status === 404) {
                        const allEntries = await LedgerService.list();
                        const found = allEntries.find((e: any) => e.id === id);
                        if (found) {
                            setEntry(found);
                        } else {
                            setError("Ledger entry not found");
                        }
                    } else {
                        throw directErr;
                    }
                }
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to load ledger entry");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const handleReverse = async () => {
        if (!entry) return;

        const reason = prompt("Please provide a reason for reversing this entry:");
        if (!reason) return;

        const confirmed = confirm(
            "⚠️ WARNING: This will create a reversal entry that negates this movement. This action cannot be undone. Continue?"
        );
        if (!confirmed) return;

        try {
            setReversing(true);
            await LedgerService.reverse(id, reason);
            toast.success("Ledger entry reversed successfully");
            window.location.reload();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to reverse entry");
        } finally {
            setReversing(false);
        }
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
                <p className="text-lg font-semibold">Failed to load ledger entry</p>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button onClick={retry}>Retry</Button>
            </div>
        );
    }

    if (!entry) return <div>Ledger entry not found</div>;

    const isReversed = entry.reversals && entry.reversals.length > 0;
    const isReversal = !!entry.reversalOfLedgerId;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Ledger Entry Detail"
                    subtitle={`Movement Type: ${entry.movementType?.label || "Unknown"}`}
                />
                <div className="flex gap-2">
                    {!isReversed && !isReversal && (
                        <Button
                            variant="destructive"
                            onClick={handleReverse}
                            disabled={reversing}
                        >
                            {reversing ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Reversing...
                                </>
                            ) : (
                                <>
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Reverse Entry
                                </>
                            )}
                        </Button>
                    )}
                    <Button variant="outline" asChild>
                        <Link href="/inventory/ledger">Back to Ledger</Link>
                    </Button>
                </div>
            </div>

            {isReversed && (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        <strong>Reversed:</strong> This entry has been reversed.
                        {entry.reversals && entry.reversals.length > 0 && (
                            <Link
                                href={`/inventory/ledger/${entry.reversals[0].id}`}
                                className="ml-2 underline text-primary"
                            >
                                View reversal entry
                            </Link>
                        )}
                    </AlertDescription>
                </Alert>
            )}

            {isReversal && (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        <strong>Reversal Entry:</strong> This entry reverses a previous movement.
                        <Link
                            href={`/inventory/ledger/${entry.reversalOfLedgerId}`}
                            className="ml-2 underline text-primary"
                        >
                            View original entry
                        </Link>
                    </AlertDescription>
                </Alert>
            )}

            <TwoColumnLayout
                sidebar={
                    <SummarySidebar title="Entry Summary">
                        <SummaryItem
                            label="Movement Type"
                            value={<Badge variant="outline">{entry.movementType?.label || "Unknown"}</Badge>}
                        />
                        <SummaryItem
                            label="Quantity"
                            value={
                                <div className="text-right">
                                    <div className="text-xl font-bold text-primary">{entry.quantity}</div>
                                    <div className="text-xs text-muted-foreground uppercase">{entry.item?.unitOfMeasure || "units"}</div>
                                </div>
                            }
                        />
                        <SummaryItem
                            label="Status"
                            value={
                                isReversed ? (
                                    <Badge variant="destructive">Reversed</Badge>
                                ) : isReversal ? (
                                    <Badge variant="secondary">Reversal</Badge>
                                ) : (
                                    <Badge variant="default">Active</Badge>
                                )
                            }
                        />
                        <SummaryItem
                            label="Created"
                            value={<span className="text-xs">{format(new Date(entry.createdAtUtc), "MMM dd, yyyy")}</span>}
                        />
                    </SummarySidebar>
                }
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <History className="h-5 w-5" />
                                    Movement Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Movement Type</p>
                                    <Badge variant="outline" className="mt-1">{entry.movementType?.label || "Unknown"}</Badge>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-sm text-muted-foreground">Item</p>
                                    <p className="font-semibold">{entry.item?.name || "Unknown"}</p>
                                    <p className="text-xs text-muted-foreground font-mono uppercase">{entry.item?.code || "N/A"}</p>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-sm text-muted-foreground">Quantity</p>
                                    <p className="text-2xl font-bold text-primary">{entry.quantity}</p>
                                    <p className="text-xs text-muted-foreground uppercase">{entry.item?.unitOfMeasure || "units"}</p>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-sm text-muted-foreground">Reason Code</p>
                                    <p className="font-medium">{entry.reasonCode?.name || "N/A"}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Location & Audit</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">From Location</p>
                                    <p className="font-medium">{entry.fromStore?.name || "—"}</p>
                                </div>
                                <div className="flex items-center justify-center">
                                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">To Location</p>
                                    <p className="font-medium">{entry.toStore?.name || "—"}</p>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-sm text-muted-foreground">Reference No</p>
                                    <p className="font-mono text-sm">{entry.referenceNo || "N/A"}</p>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-sm text-muted-foreground">Created At</p>
                                    <p className="text-sm">{format(new Date(entry.createdAtUtc), "MMM dd, yyyy HH:mm:ss")}</p>
                                </div>
                                <Separator />
                                <div>
                                    <p className="text-sm text-muted-foreground">Entry ID</p>
                                    <p className="font-mono text-xs break-all">{entry.id}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {(isReversed || isReversal) && (
                        <Card className="border-amber-200 bg-amber-50/50">
                            <CardHeader>
                                <CardTitle className="text-sm">Reversal Linkage</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {isReversal && (
                                    <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="bg-background">This Entry</Badge>
                                        <ArrowRight className="h-4 w-4" />
                                        <span className="text-sm">Reverses</span>
                                        <ArrowRight className="h-4 w-4" />
                                        <Link
                                            href={`/inventory/ledger/${entry.reversalOfLedgerId}`}
                                            className="text-primary underline font-mono text-xs"
                                        >
                                            {entry.reversalOfLedgerId?.slice(0, 8)}...
                                        </Link>
                                    </div>
                                )}
                                {isReversed && entry.reversals && entry.reversals.map((rev: any) => (
                                    <div key={rev.id} className="flex items-center gap-2">
                                        <Badge variant="outline" className="bg-background">This Entry</Badge>
                                        <ArrowRight className="h-4 w-4" />
                                        <span className="text-sm">Reversed By</span>
                                        <ArrowRight className="h-4 w-4" />
                                        <Link
                                            href={`/inventory/ledger/${rev.id}`}
                                            className="text-primary underline font-mono text-xs"
                                        >
                                            {rev.id.slice(0, 8)}...
                                        </Link>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </TwoColumnLayout>
        </div>
    );
}
