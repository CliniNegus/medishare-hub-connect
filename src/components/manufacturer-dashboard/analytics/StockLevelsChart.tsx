import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import type { StockLevel } from "@/hooks/use-manufacturer-analytics";

interface StockLevelsChartProps {
  data: StockLevel[];
  loading?: boolean;
}

const StockLevelsChart: React.FC<StockLevelsChartProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Inventory Stock Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  const getBarColor = (stock: number) => {
    if (stock < 10) return '#ef4444'; // red
    if (stock < 20) return '#f59e0b'; // amber
    return '#10b981'; // green
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[#333333]">Inventory Stock Levels</CardTitle>
        <p className="text-sm text-gray-600">Current stock by product (lowest first)</p>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            No inventory data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                stroke="#666"
                style={{ fontSize: '11px' }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis 
                stroke="#666"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`${value} units`, 'Stock']}
              />
              <Bar dataKey="stock" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.stock)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
        <div className="flex items-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#ef4444]"></div>
            <span>Critical (&lt;10)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#f59e0b]"></div>
            <span>Low (&lt;20)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-[#10b981]"></div>
            <span>Healthy (≥20)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockLevelsChart;
