
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Activity, DollarSign } from "lucide-react";

interface AnalyticsData {
  id: string;
  equipment_id: string;
  usage_hours: number;
  downtime_hours: number;
  revenue_generated: number;
  date_recorded: string;
  last_location: string;
}

interface RealTimeMetricsProps {
  analytics: AnalyticsData[];
  equipmentName: string;
}

const RealTimeMetrics: React.FC<RealTimeMetricsProps> = ({ analytics, equipmentName }) => {
  const chartData = analytics.slice(0, 7).reverse().map(item => ({
    date: new Date(item.date_recorded).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    usage: item.usage_hours,
    downtime: item.downtime_hours,
    revenue: item.revenue_generated,
    efficiency: item.usage_hours / (item.usage_hours + item.downtime_hours) * 100 || 0
  }));

  const totalUsage = analytics.reduce((sum, item) => sum + item.usage_hours, 0);
  const totalRevenue = analytics.reduce((sum, item) => sum + item.revenue_generated, 0);
  const averageEfficiency = chartData.length > 0 
    ? chartData.reduce((sum, item) => sum + item.efficiency, 0) / chartData.length 
    : 0;

  const currentEfficiency = chartData.length > 0 ? chartData[chartData.length - 1].efficiency : 0;
  const previousEfficiency = chartData.length > 1 ? chartData[chartData.length - 2].efficiency : 0;
  const efficiencyTrend = currentEfficiency - previousEfficiency;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-[#E02020]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Usage</p>
                <p className="text-2xl font-bold text-[#333333]">{totalUsage}h</p>
              </div>
              <Activity className="h-8 w-8 text-[#E02020]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Efficiency</p>
                <div className="flex items-center space-x-1">
                  <p className="text-2xl font-bold text-[#333333]">{averageEfficiency.toFixed(1)}%</p>
                  {efficiencyTrend > 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-[#333333]">${totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-semibold text-green-600">Online</p>
              </div>
              <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#333333]">Usage Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E02020',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="usage" 
                    stroke="#E02020" 
                    fill="#E02020" 
                    fillOpacity={0.1}
                    strokeWidth={2}
                    name="Usage Hours"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-[#333333]">Efficiency Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E02020',
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [`${Number(value).toFixed(1)}%`, 'Efficiency']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="efficiency" 
                    stroke="#E02020" 
                    strokeWidth={3}
                    dot={{ fill: '#E02020', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#E02020', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeMetrics;
