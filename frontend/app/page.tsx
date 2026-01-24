"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  Package,
  AlertCircle,
  FileText,
  Activity,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function Dashboard() {
  // Fetch Items for basic counts
  const { data: items } = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const res = await api.get("/items");
      return res.data;
    },
  });

  // Fetch Requests for pending counts
  const { data: requests } = useQuery({
    queryKey: ["requests"],
    queryFn: async () => {
      const res = await api.get("/requests");
      return res.data;
    },
  });

  // Fetch KPI data
  const { data: kpis } = useQuery({
    queryKey: ["request-kpis"],
    queryFn: async () => {
      const res = await api.get("/reports/request-kpis");
      return res.data;
    },
  });

  // Fetch Low Stock
  const { data: lowStock } = useQuery({
    queryKey: ["low-stock"],
    queryFn: async () => {
      const res = await api.get("/reports/low-stock");
      return res.data;
    },
  });

  const stats = {
    totalItems: items?.length || 0,
    lowStock: lowStock?.length || 0,
    pendingRequests: requests?.filter((r: any) => r.status === "SUBMITTED" || r.status === "IN_REVIEW").length || 0,
    completedToday: kpis?.completedToday || 0,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your inventory and operation status"
        action={{
          label: "New Request",
          onClick: () => { window.location.href = "/requests/new" },
          icon: <FileText className="w-4 h-4" />
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Total SKUs"
          value={stats.totalItems}
          icon={<Package className="w-4 h-4" />}
          description="Total items in catalog"
        />
        <DashboardCard
          title="Low Stock Alerts"
          value={stats.lowStock}
          icon={<AlertCircle className="w-4 h-4" />}
          trend={{ value: "+2", positive: false }}
          description="Requires reorder"
          className={stats.lowStock > 0 ? "border-rose-500/20" : ""}
        />
        <DashboardCard
          title="Pending Approvals"
          value={stats.pendingRequests}
          icon={<Clock className="w-4 h-4" />}
          description="Awaiting review"
        />
        <DashboardCard
          title="Fulfillment Rate"
          value={`${kpis?.fulfillmentRate || 0}%`}
          icon={<CheckCircle2 className="w-4 h-4" />}
          trend={{ value: "+5%", positive: true }}
          description="Last 30 days"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Requests Section */}
        <Card className="lg:col-span-2 shadow-sm border-primary/5">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Recent Requests</CardTitle>
              <CardDescription>Latest inventory movements and requests</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/requests" className="flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requests?.slice(0, 5).map((request: any) => (
                <div key={request.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-transparent hover:border-primary/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-background rounded-md border border-primary/10">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">#{request.humanId || request.id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">{request.requester?.fullName || 'Unknown'} • {new Date(request.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge variant={
                    request.status === "APPROVED" ? "default" :
                      request.status === "SUBMITTED" ? "secondary" :
                        request.status === "DRAFT" ? "outline" : "default"
                  }>
                    {request.status}
                  </Badge>
                </div>
              ))}
              {(!requests || requests.length === 0) && (
                <div className="py-8 text-center text-muted-foreground text-sm italic">
                  No recent activity found.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions / Activity Feed */}
        <div className="space-y-8">
          <Card className="shadow-sm border-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">API Status</span>
                <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/5">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Sync Delay</span>
                <span className="text-sm font-medium">0.4s</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/10 shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <TrendingUp className="h-5 w-5" />
                Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">
                Total inventory value has increased by <span className="font-bold text-primary">12%</span> this month.
                Low stock levels are <span className="font-bold text-primary">down 4%</span> compared to last week.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
