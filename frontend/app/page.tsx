'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { LayoutDashboard, TrendingDown, Package, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const { data: items } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const res = await api.get('/items');
      return res.data;
    },
  });

  const lowStockCount = items?.filter((item: any) => {
    const stock = item.snapshots?.reduce((acc: number, s: any) => acc + s.quantity, 0) || 0;
    return stock <= item.reorderLevel;
  }).length || 0;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your inventory control center.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-card border rounded-xl shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Total SKUs</h3>
            <Package className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl font-bold">{items?.length || 0}</p>
        </div>

        <div className="p-6 bg-card border rounded-xl shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Low Stock Alerts</h3>
            <AlertCircle className="w-4 h-4 text-destructive" />
          </div>
          <p className="text-2xl font-bold text-destructive">{lowStockCount}</p>
        </div>

        <div className="p-6 bg-card border rounded-xl shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Active Forecasts</h3>
            <TrendingDown className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold">12 Items</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="p-6 bg-card border rounded-xl shadow-sm min-h-[300px]">
          <h3 className="font-semibold mb-4 text-lg">Inventory Valuation Trend</h3>
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm italic">
            Chart component would go here...
          </div>
        </div>
      </div>
    </div>
  );
}
