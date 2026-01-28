"use client";

import { useQuery } from "@tanstack/react-query";
import { LookupsService } from "@/services/admin.service";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Settings2, Database, ListOrdered, Activity, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LOOKUP_CONFIG = [
    { id: 'request-statuses', label: 'Request Statuses', icon: Activity, description: 'Lifecycle states for staff requisitions.' },
    { id: 'request-stage-types', label: 'Workflow Stages', icon: ListOrdered, description: 'The 6 standard operational steps.' },
    { id: 'movement-types', label: 'Movement Ledger', icon: Database, description: 'Transaction types like Receive, Issue, Return.' },
    { id: 'stocktake-statuses', label: 'Stocktake Statuses', icon: Info, description: 'Stages of the inventory audit process.' },
];

export default function LookupsPage() {
    const { data: registry, isLoading } = useQuery({
        queryKey: ["lookups-registry"],
        queryFn: LookupsService.getRegistry
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
                title="Lookups Registry"
                subtitle="Manage operational constants, status codes, and transactional types across the system."
            />

            <Tabs defaultValue="request-statuses" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 mb-6">
                    {LOOKUP_CONFIG.map(tab => (
                        <TabsTrigger
                            key={tab.id}
                            value={tab.id}
                            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                        >
                            <tab.icon className="w-4 h-4 mr-2" />
                            {tab.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {LOOKUP_CONFIG.map(tab => (
                    <TabsContent key={tab.id} value={tab.id} className="mt-0">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            <div className="lg:col-span-1">
                                <Card className="bg-muted/30">
                                    <CardHeader>
                                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                                            <Settings2 className="w-4 h-4" />
                                            Registry Metadata
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            {tab.description}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground">
                                                <span>Count</span>
                                                <span>{registry?.[tab.id]?.length || 0} Entries</span>
                                            </div>
                                            <Badge variant="outline" className="w-full justify-center">System Managed</Badge>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="lg:col-span-3">
                                <Card>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">Code</TableHead>
                                                <TableHead>Label</TableHead>
                                                <TableHead>Description</TableHead>
                                                <TableHead className="text-right">Admin</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {registry?.[tab.id]?.map((item: any) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-mono text-[10px] font-bold uppercase">{item.code}</TableCell>
                                                    <TableCell className="font-medium text-sm">{item.label}</TableCell>
                                                    <TableCell className="text-xs text-muted-foreground">{item.description || "No description provided."}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Badge variant="secondary" className="bg-primary/5 text-[8px] uppercase">LOCKED</Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
