'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';

const data = [
    { name: 'Jan', stock: 40, demand: 24 },
    { name: 'Feb', stock: 30, demand: 13 },
    { name: 'Mar', stock: 20, demand: 98 },
    { name: 'Apr', stock: 27, demand: 39 },
    { name: 'May', stock: 18, demand: 48 },
    { name: 'Jun', stock: 23, demand: 38 },
];

export default function ForecastingPage() {
    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <BarChart3 className="w-6 h-6" />
                    AI Forecasting
                </h1>
                <p className="text-muted-foreground">Predictive analytics for reorder points and demand trends.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-card border rounded-xl shadow-sm space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        Demand Forecast (Next 6 Months)
                    </h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="demand" stroke="#8884d8" strokeWidth={2} />
                                <Line type="monotone" dataKey="stock" stroke="#82ca9d" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="p-6 bg-card border rounded-xl shadow-sm space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-warning" />
                        Stockout Risks
                    </h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-muted/30 rounded-lg flex justify-between items-center">
                            <span>MacBook Pro 16"</span>
                            <span className="text-destructive font-bold">High Risk</span>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg flex justify-between items-center">
                            <span>Dell UltraSharp 27"</span>
                            <span className="text-amber-500 font-bold">Medium Risk</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
