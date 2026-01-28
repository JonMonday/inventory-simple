"use client";

import { useQuery } from "@tanstack/react-query";
import { AdminService } from "@/services/admin.service";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Building2, Landmark, MapPin, Users2, ShieldCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ORG_TABS = [
    { id: 'branches', label: 'Branches', icon: Landmark, query: AdminService.getBranches },
    { id: 'departments', label: 'Departments', icon: Building2, query: AdminService.getDepartments },
    { id: 'units', label: 'Units', icon: Users2, query: AdminService.getUnits },
    { id: 'store-locations', label: 'Store Locations', icon: MapPin, query: AdminService.getStoreLocations }
];

export default function OrgStructurePage() {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Organizational Structure"
                subtitle="Manage the global hierarchy including branches, departments, units, and physical store locations."
            />

            <Tabs defaultValue="branches" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 mb-6">
                    {ORG_TABS.map(tab => (
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

                {ORG_TABS.map(tab => (
                    <OrgTabContent key={tab.id} tab={tab} />
                ))}
            </Tabs>
        </div>
    );
}

function OrgTabContent({ tab }: { tab: any }) {
    const { data: list, isLoading } = useQuery({
        queryKey: ["org", tab.id],
        queryFn: tab.query
    });

    if (isLoading) {
        return (
            <div className="h-48 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <TabsContent value={tab.id} className="mt-0 space-y-6">
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Admin</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(Array.isArray(list) ? list : []).map((item: any) => (
                            <TableRow key={item.id}>
                                <TableCell className="font-medium text-sm">{item.name}</TableCell>
                                <TableCell className="font-mono text-[10px] font-bold uppercase">{item.code}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="text-[10px] bg-emerald-500/5 text-emerald-600 border-emerald-500/20">ACTIVE</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <ShieldCheck className="w-4 h-4 ml-auto text-muted-foreground opacity-30" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </TabsContent>
    );
}
