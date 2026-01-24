"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { Separator } from "@/components/ui/separator";
import {
    Loader2,
    CheckCircle2,
    XSquare,
    Send,
    Truck,
    Clock,
    User,
    Building,
    FileText,
    History,
    Plus,
} from "lucide-react";
import { format } from "date-fns";
import { PermissionGate } from "@/components/permission-gate";
import { PERMISSIONS } from "@/permissions/matrix";
import { toast } from "sonner";

export default function RequestDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { data: request, isLoading } = useQuery({
        queryKey: ["request", id],
        queryFn: async () => {
            const res = await api.get(`/requests/${id}`);
            return res.data;
        },
    });

    const mutate = useMutation({
        mutationFn: async (action: string) => {
            let res;
            if (action === "submit") res = await api.post(`/requests/${id}/submit`);
            else if (action === "approve") res = await api.post(`/requests/${id}/approve`);
            else if (action === "reject") res = await api.post(`/requests/${id}/reject`);
            else if (action === "fulfill") res = await api.post(`/requests/${id}/fulfill`);
            else if (action === "cancel") res = await api.post(`/requests/${id}/cancel`);
            return res?.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["request", id] });
            toast.success("Action performed successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Action failed");
        },
    });

    if (isLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!request) return <div>Request not found</div>;

    const statusType: any =
        request.status === "APPROVED" || request.status === "FULFILLED" ? "SUCCESS" :
            request.status === "REJECTED" || request.status === "CANCELLED" ? "DANGER" :
                request.status === "SUBMITTED" || request.status === "IN_REVIEW" ? "WARNING" : "INFO";

    return (
        <div className="space-y-6">
            <PageHeader
                title={`Request #${request.readableId}`}
                subtitle="View requisition details, approval status, and fulfillment history."
                action={request.status === "DRAFT" ? {
                    label: "Submit Request",
                    onClick: () => mutate.mutate("submit"),
                    icon: <Send className="w-4 h-4" />
                } : undefined}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Requested Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {request.lines.map((line: any) => (
                                    <div key={line.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-background rounded-md border text-primary">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="font-semibold">{line.item.name}</p>
                                                <p className="text-xs text-muted-foreground font-mono uppercase">{line.item.code}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold">{line.quantity}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase">{line.item.unitOfMeasure}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Timeline & Events</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-muted">
                                {request.events.map((event: any, i: number) => (
                                    <div key={event.id} className="relative pl-10">
                                        <div className={`absolute left-0 top-0 w-9 h-9 rounded-full border bg-background flex items-center justify-center z-10 ${i === 0 ? "border-primary text-primary" : "text-muted-foreground"
                                            }`}>
                                            {event.type === 'CREATED' ? <Plus className="h-4 w-4" /> :
                                                event.type === 'SUBMITTED' ? <Send className="h-4 w-4" /> :
                                                    event.type === 'APPROVED' ? <CheckCircle2 className="h-4 w-4" /> :
                                                        <Clock className="h-4 w-4" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">{event.description}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] text-muted-foreground font-medium uppercase">{format(new Date(event.createdAt), "MMM dd, yyyy HH:mm")}</span>
                                                <span className="text-muted-foreground">•</span>
                                                <span className="text-[10px] font-bold text-primary uppercase">{event.user?.fullName}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Status Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <StatusBadge label={request.status} type={statusType} />
                            </div>
                            <Separator />
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                    <User className="h-4 w-4" /> Requester
                                </div>
                                <p className="font-semibold">{request.requester.fullName}</p>
                                <p className="text-xs text-muted-foreground">{request.requester.email}</p>
                            </div>
                            <Separator />
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                    <Building className="h-4 w-4" /> Origin
                                </div>
                                <p className="font-semibold">{request.department?.name || "No Department"}</p>
                                <p className="text-xs text-muted-foreground">Location: {request.location?.name || "N/A"}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {request.issueFrom && (
                        <Card className="border-primary/20 bg-primary/5">
                            <CardHeader>
                                <CardTitle className="text-sm font-bold flex items-center gap-2">
                                    <Truck className="h-4 w-4" /> Fulfillment Source
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="font-semibold">{request.issueFrom.name}</p>
                                <p className="text-xs text-muted-foreground">Stock will be issued from this location.</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
