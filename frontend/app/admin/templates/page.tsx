"use client";

import { useQuery } from "@tanstack/react-query";
import { AdminService } from "@/services/admin.service";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Layers, ArrowRight, Settings, Users, Star } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export default function TemplatesPage() {
    const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);

    const { data: templates, isLoading } = useQuery({
        queryKey: ["workflow-templates"],
        queryFn: AdminService.getTemplates
    });

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
                title="Workflow Templates"
                subtitle="Manage step-by-step approval and fulfillment lifecycles for staff requisitions."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates?.map((tpl: any) => (
                    <Card key={tpl.id} className="cursor-pointer hover:border-primary/40 transition-colors group" onClick={() => setSelectedTemplate(tpl)}>
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">{tpl.name}</CardTitle>
                                {tpl.isDefault && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                            </div>
                            <CardDescription className="line-clamp-2 text-xs">{tpl.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Layers className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">{tpl.steps?.length || 0} Steps</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Sheet open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
                <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <Settings className="w-5 h-5 text-primary" />
                            Template Configuration
                        </SheetTitle>
                        <SheetDescription>
                            Technical definition for "{selectedTemplate?.name}"
                        </SheetDescription>
                    </SheetHeader>

                    {selectedTemplate && (
                        <div className="mt-8 space-y-8">
                            <div className="space-y-4">
                                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Workflow Steps Architecture</h4>
                                <div className="space-y-4 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-muted ml-1">
                                    {selectedTemplate.steps?.sort((a: any, b: any) => a.stepOrder - b.stepOrder).map((step: any) => (
                                        <div key={step.id} className="relative pl-12">
                                            <div className="absolute left-0 top-0 w-10 h-10 rounded-full border bg-background flex items-center justify-center font-bold text-sm z-10">
                                                {step.stepOrder}
                                            </div>
                                            <div className="p-4 rounded-lg border bg-muted/30">
                                                <div className="flex justify-between items-start mb-2">
                                                    <p className="font-bold text-sm">{step.name || step.stageType.label}</p>
                                                    <Badge variant="secondary" className="text-[10px] uppercase">{step.stageType.code}</Badge>
                                                </div>
                                                <div className="flex gap-4 mt-3">
                                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                        <Users className="w-3.5 h-3.5" />
                                                        {step.participantRoleType.label}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6 border-t">
                                <Badge variant="outline" className="w-full justify-center py-2 h-auto text-[10px] bg-primary/5 border-dashed">
                                    Step Reordering & Guard Configuration Locked in V4 (Read-Only)
                                </Badge>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}
