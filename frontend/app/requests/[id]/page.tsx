"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useRequestAggregate } from "@/hooks/use-request-aggregate";
import { usePermissions } from "@/hooks/use-permissions";
import { getRequestActions } from "@/lib/workflow-guards";
import { RequestsService } from "@/services/requests.service";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Loader2, Send, CheckCircle2, XCircle, User,
    Building, FileText, History, MessageSquare, Lock, Truck, Package, Users, AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TwoColumnLayout } from "@/components/layout/TwoColumnLayout";
import { SummarySidebar } from "@/components/layout/SummarySidebar";

export default function RequestDetailsPage() {
    const { id } = useParams() as { id: string };
    const { data, loading, errors, loadLines, loadEvents, loadComments, loadAssignments, loadParticipants, loadReservations, retry } = useRequestAggregate(id);
    const { permissions, user } = usePermissions();
    const [activeTab, setActiveTab] = useState("lines");

    const actions = data.header ? getRequestActions(data.header, user, permissions) : null;

    const handleAction = async (actionName: string, arg?: string) => {
        try {
            toast.loading(`Performing ${actionName}...`);

            switch (actionName) {
                case "submit":
                    await RequestsService.submit(id);
                    break;
                case "approve":
                    await RequestsService.approve(id);
                    break;
                case "reject":
                    await RequestsService.reject(id, arg || "No reason provided");
                    break;
                case "cancel":
                    await RequestsService.cancel(id);
                    break;
                case "reserve":
                    await RequestsService.reserve(id);
                    break;
                case "issue":
                    await RequestsService.issue(id);
                    break;
                case "confirm":
                    await RequestsService.confirm(id);
                    break;
                case "clone":
                    const cloned = await RequestsService.clone(id);
                    toast.dismiss();
                    toast.success(`Request cloned: ${cloned.data.readableId}`);
                    return;
                case "assign":
                    const ids = (arg || "").split(",").map(u => u.trim());
                    await RequestsService.createAssignments(id, request.currentStageTypeId, ids);
                    break;
            }

            toast.dismiss();
            toast.success(`${actionName.charAt(0).toUpperCase() + actionName.slice(1)} completed`);
            window.location.reload();
        } catch (err: any) {
            toast.dismiss();
            toast.error(err.response?.data?.message || `Failed to ${actionName}`);
        }
    };

    // Lazy load tab data on first open
    const handleTabChange = (value: string) => {
        setActiveTab(value);
        if (value === "lines" && data.lines === null) loadLines();
        if (value === "events" && data.events === null) loadEvents();
        if (value === "comments" && data.comments === null) loadComments();
        if (value === "assignments" && data.assignments === null) loadAssignments();
        if (value === "participants" && data.participants === null) loadParticipants();
        if (value === "reservations" && data.reservations === null) loadReservations();
    };

    if (loading.header) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (errors.header) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <p className="text-lg font-semibold">Failed to load request</p>
                <p className="text-sm text-muted-foreground">{errors.header}</p>
                <Button onClick={() => retry('header')}>Retry</Button>
            </div>
        );
    }

    if (!data.header) return <div>Request not found</div>;

    const request = data.header;
    const statusType: any =
        request.status.code === "CONFIRMED" ? "SUCCESS" :
            request.status.code === "REJECTED" || request.status.code === "CANCELLED" ? "DANGER" :
                request.status.code === "IN_FLOW" ? "WARNING" : "INFO";

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PageHeader
                    title={`Request #${request.readableId}`}
                    subtitle={`Current Stage: ${request.currentStageType?.label || "None"}`}
                />
                <div className="flex flex-wrap gap-2">
                    {actions?.submit.visible && (
                        <Button
                            onClick={() => handleAction("submit")}
                            disabled={actions.submit.disabled}
                            size="sm"
                            title={actions.submit.reason}
                        >
                            <Send className="w-4 h-4 mr-2" /> Submit
                        </Button>
                    )}
                    {actions?.approve.visible && (
                        <Button
                            onClick={() => handleAction("approve")}
                            disabled={actions.approve.disabled}
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700"
                            title={actions.approve.reason}
                        >
                            <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                        </Button>
                    )}
                    {actions?.reject.visible && (
                        <Button
                            onClick={() => {
                                const reason = prompt("Reason for rejection:");
                                if (reason) handleAction("reject", reason);
                            }}
                            disabled={actions.reject.disabled}
                            size="sm"
                            variant="destructive"
                            title={actions.reject.reason}
                        >
                            <XCircle className="w-4 h-4 mr-2" /> Reject
                        </Button>
                    )}
                    {actions?.cancel.visible && (
                        <Button
                            onClick={() => handleAction("cancel")}
                            disabled={actions.cancel.disabled}
                            size="sm"
                            variant="outline"
                            title={actions.cancel.reason}
                        >
                            Cancel
                        </Button>
                    )}
                    {actions?.clone.visible && (
                        <Button
                            onClick={() => handleAction("clone")}
                            disabled={actions.clone.disabled}
                            size="sm"
                            variant="outline"
                            title={actions.clone.reason}
                        >
                            Clone
                        </Button>
                    )}
                    {actions?.manageReviewers.visible && (
                        <Button
                            onClick={() => {
                                const userIds = prompt("Enter User IDs (comma separated) to assign:");
                                if (userIds) handleAction("assign", userIds);
                            }}
                            disabled={actions.manageReviewers.disabled}
                            size="sm"
                            variant="outline"
                            className="border-primary text-primary"
                            title={actions.manageReviewers.reason}
                        >
                            <User className="w-4 h-4 mr-2" /> Assign Reviewers
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                        <TabsList className="w-full justify-start overflow-x-auto">
                            <TabsTrigger value="lines"><FileText className="w-4 h-4 mr-2" /> Lines</TabsTrigger>
                            <TabsTrigger value="events"><History className="w-4 h-4 mr-2" /> Events</TabsTrigger>
                            <TabsTrigger value="comments"><MessageSquare className="w-4 h-4 mr-2" /> Comments</TabsTrigger>
                            <TabsTrigger value="assignments"><User className="w-4 h-4 mr-2" /> Assignments</TabsTrigger>
                            <TabsTrigger value="participants"><Users className="w-4 h-4 mr-2" /> Participants</TabsTrigger>
                            <TabsTrigger value="reservations"><Lock className="w-4 h-4 mr-2" /> Reservations</TabsTrigger>
                        </TabsList>

                        <div className="mt-6">
                            <TabsContent value="lines">
                                <Card>
                                    <CardContent className="pt-6">
                                        {loading.lines ? (
                                            <div className="flex justify-center py-12">
                                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                            </div>
                                        ) : errors.lines ? (
                                            <Alert variant="destructive">
                                                <AlertDescription className="flex items-center justify-between">
                                                    <span>{errors.lines}</span>
                                                    <Button size="sm" variant="outline" onClick={() => retry('lines')}>Retry</Button>
                                                </AlertDescription>
                                            </Alert>
                                        ) : data.lines && data.lines.length > 0 ? (
                                            <div className="space-y-4">
                                                {data.lines.map((line) => (
                                                    <div key={line.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                                                        <div className="flex items-center gap-4">
                                                            <div className="p-2 bg-background rounded-md border text-primary">
                                                                <Package className="h-5 w-5" />
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-sm">{line.item?.name || "Unknown Item"}</p>
                                                                <p className="text-[10px] text-muted-foreground font-mono uppercase">{line.item?.code || "NO_CODE"}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-lg font-bold">{line.quantity}</p>
                                                            <p className="text-[10px] text-muted-foreground uppercase">{line.item?.unitOfMeasure || "UNIT"}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 text-muted-foreground">
                                                <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                                <p>No lines added yet.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="events">
                                <Card>
                                    <CardContent className="pt-6">
                                        {loading.events ? (
                                            <div className="flex justify-center py-12">
                                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                            </div>
                                        ) : errors.events ? (
                                            <Alert variant="destructive">
                                                <AlertDescription className="flex items-center justify-between">
                                                    <span>{errors.events}</span>
                                                    <Button size="sm" variant="outline" onClick={() => retry('events')}>Retry</Button>
                                                </AlertDescription>
                                            </Alert>
                                        ) : data.events && data.events.length > 0 ? (
                                            <ScrollArea className="h-[400px]">
                                                <div className="space-y-6 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-muted ml-2">
                                                    {data.events.map((event, i) => (
                                                        <div key={event.id} className="relative pl-10">
                                                            <div className={`absolute left-0 top-0 w-9 h-9 rounded-full border bg-background flex items-center justify-center z-10 ${i === 0 ? "border-primary text-primary" : "text-muted-foreground"}`}>
                                                                <CheckCircle2 className="h-4 w-4" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-semibold">{event.eventType?.label || "Event"}</p>
                                                                {event.metadata && <p className="text-xs text-muted-foreground mt-1 italic">{event.metadata}</p>}
                                                                <div className="flex items-center gap-2 mt-2">
                                                                    <span className="text-[10px] text-muted-foreground font-medium uppercase">{format(new Date(event.createdAt), "MMM dd, HH:mm")}</span>
                                                                    <span className="text-muted-foreground text-[10px]">•</span>
                                                                    <span className="text-[10px] font-bold text-primary uppercase">{event.actedBy?.fullName || "System"}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        ) : (
                                            <div className="text-center py-12 text-muted-foreground">
                                                <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                                <p>No events recorded.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="comments">
                                <Card>
                                    <CardContent className="pt-6">
                                        {loading.comments ? (
                                            <div className="flex justify-center py-12">
                                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                            </div>
                                        ) : errors.comments ? (
                                            <Alert>
                                                <AlertDescription className="flex items-center justify-between">
                                                    <span>Backend endpoint pending: {errors.comments}</span>
                                                    <Button size="sm" variant="outline" onClick={() => retry('comments')}>Retry</Button>
                                                </AlertDescription>
                                            </Alert>
                                        ) : (
                                            <div className="text-center py-12 text-muted-foreground">
                                                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                                <p>Comments feature pending backend implementation.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="assignments">
                                <Card>
                                    <CardContent className="pt-6">
                                        {loading.assignments ? (
                                            <div className="flex justify-center py-12">
                                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                            </div>
                                        ) : errors.assignments ? (
                                            <Alert variant="destructive">
                                                <AlertDescription className="flex items-center justify-between">
                                                    <span>{errors.assignments}</span>
                                                    <Button size="sm" variant="outline" onClick={() => retry('assignments')}>Retry</Button>
                                                </AlertDescription>
                                            </Alert>
                                        ) : data.assignments && data.assignments.length > 0 ? (
                                            <div className="space-y-4">
                                                {data.assignments.map((as) => (
                                                    <div key={as.id} className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                                                        <div className="flex items-center gap-3">
                                                            <div className={cn("p-2 rounded-full", as.status === 'ACTIVE' ? "bg-amber-500/10 text-amber-600" : "bg-muted text-muted-foreground")}>
                                                                <User className="w-4 h-4" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-semibold">
                                                                    {as.assignmentType === 'POOL' ? (
                                                                        <span className="text-amber-600 font-bold uppercase text-[10px] tracking-wider bg-amber-50 px-1 py-0.5 rounded border border-amber-200">
                                                                            Pool: {as.assignedRoleKey}
                                                                        </span>
                                                                    ) : (
                                                                        as.assignedTo?.fullName || "Unassigned"
                                                                    )}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground">{as.assignedTo?.email || (as.assignmentType === 'POOL' ? 'Reviewer Group' : 'No Email')}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <Badge variant={as.status === 'ACTIVE' ? "default" : "outline"} className={as.status === 'ACTIVE' ? "bg-amber-600" : ""}>
                                                                {as.status}
                                                            </Badge>
                                                            <p className="text-[10px] mt-1 text-muted-foreground uppercase">{format(new Date(as.assignedAt), "MMM dd")}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 text-muted-foreground">
                                                <User className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                                <p>No assignments found.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="participants">
                                <Card>
                                    <CardContent className="pt-6">
                                        {loading.participants ? (
                                            <div className="flex justify-center py-12">
                                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                            </div>
                                        ) : errors.participants ? (
                                            <Alert variant="destructive">
                                                <AlertDescription className="flex items-center justify-between">
                                                    <span>{errors.participants}</span>
                                                    <Button size="sm" variant="outline" onClick={() => retry('participants')}>Retry</Button>
                                                </AlertDescription>
                                            </Alert>
                                        ) : data.participants && data.participants.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {data.participants.map((p) => (
                                                    <div key={p.userId} className="p-3 rounded-lg border flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                                                            {p.user?.fullName?.split(' ').map(n => n[0]).join('') || "U"}
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <p className="text-sm font-semibold truncate">{p.user?.fullName || "Unknown"}</p>
                                                            <p className="text-[10px] text-muted-foreground uppercase">{p.roleType?.label || "Member"}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 text-muted-foreground">
                                                <Users className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                                <p>No participants found.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="reservations">
                                <Card>
                                    <CardContent className="pt-6">
                                        {loading.reservations ? (
                                            <div className="flex justify-center py-12">
                                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                            </div>
                                        ) : errors.reservations ? (
                                            <Alert variant="destructive">
                                                <AlertDescription className="flex items-center justify-between">
                                                    <span>{errors.reservations}</span>
                                                    <Button size="sm" variant="outline" onClick={() => retry('reservations')}>Retry</Button>
                                                </AlertDescription>
                                            </Alert>
                                        ) : data.reservations && data.reservations.length > 0 ? (
                                            <div className="space-y-4">
                                                {data.reservations.map((res) => (
                                                    <div key={res.id} className="flex items-center justify-between p-3 rounded-lg border border-primary/20 bg-primary/5">
                                                        <div className="flex items-center gap-3">
                                                            <Lock className="w-5 h-5 text-primary" />
                                                            <div>
                                                                <p className="text-sm font-semibold">Reserved: {res.item?.name || "Unknown Item"}</p>
                                                                <p className="text-xs text-muted-foreground font-mono uppercase">ID: {res.id?.slice(0, 8) || "N/A"}</p>
                                                            </div>
                                                        </div>
                                                        <p className="text-lg font-bold">{res.quantity}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 text-muted-foreground">
                                                <Lock className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                                <p>No active stock reservations.</p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            {/* Workflow actions card */}
                            {(actions?.reserve.visible || actions?.issue.visible || actions?.confirm.visible) && (
                                <Card className="mt-6">
                                    <CardHeader>
                                        <CardTitle className="text-sm">Fulfillment Actions</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex flex-wrap gap-4">
                                        {actions?.reserve.visible && (
                                            <Button
                                                onClick={() => handleAction("reserve")}
                                                disabled={actions.reserve.disabled}
                                                variant="secondary"
                                                title={actions.reserve.reason}
                                            >
                                                <Lock className="w-4 h-4 mr-2" /> Reserve Stock
                                            </Button>
                                        )}
                                        {actions?.issue.visible && (
                                            <Button
                                                onClick={() => handleAction("issue")}
                                                disabled={actions.issue.disabled}
                                                className="bg-blue-600 hover:bg-blue-700"
                                                title={actions.issue.reason}
                                            >
                                                <Truck className="w-4 h-4 mr-2" /> Issue Items
                                            </Button>
                                        )}
                                        {actions?.confirm.visible && (
                                            <Button
                                                onClick={() => handleAction("confirm")}
                                                disabled={actions.confirm.disabled}
                                                title={actions.confirm.reason}
                                            >
                                                <CheckCircle2 className="w-4 h-4 mr-2" /> Confirm Receipt
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </Tabs>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Request Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <StatusBadge label={request.status.label} type={statusType} />
                            </div>
                            <Separator />
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                    <User className="h-4 w-4" /> Requester
                                </div>
                                <p className="font-semibold text-sm">{request.requester?.fullName || "Unknown"}</p>
                                <p className="text-xs text-muted-foreground">{request.requester?.department?.name || "No Department"}</p>
                            </div>
                            <Separator />
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                    <Building className="h-4 w-4" /> Origin
                                </div>
                                <p className="font-semibold text-sm">{request.department?.name || "General Office"}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold flex items-center gap-2">
                                <History className="h-4 w-4" /> Audit Detail
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Requested</span>
                                <span>{format(new Date(request.createdAt), "MMM dd, yyyy")}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Readable ID</span>
                                <span className="font-mono">{request.readableId}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
