
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { BarChart2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface MonthlyDataItem {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

interface RevenueChartProps {
  reportType: string;
  monthlyData: MonthlyDataItem[];
  colors: {
    revenue: string;
    expenses: string;
    profit: string;
  };
}

const RevenueChart: React.FC<RevenueChartProps> = ({ 
  reportType, 
  monthlyData, 
  colors 
}) => {
  return (
    <Card className="border-gray-200 h-80">
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-2 flex items-center">
          <BarChart2 className="h-5 w-5 mr-2 text-gray-500" />
          {reportType === 'revenue' ? 'Revenue Analysis' : 
            reportType === 'expenses' ? 'Expense Analysis' : 'Profit Analysis'}
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`$${value.toLocaleString()}`, null]}
              contentStyle={{ backgroundColor: 'white', borderColor: '#e5e7eb' }}
            />
            <Legend verticalAlign="top" height={36} />
            {reportType === 'revenue' && (
              <Bar 
                dataKey="revenue" 
                name="Revenue" 
                fill={colors.revenue} 
                radius={[4, 4, 0, 0]}
              />
            )}
            {reportType === 'expenses' && (
              <Bar 
                dataKey="expenses" 
                name="Expenses" 
                fill={colors.expenses} 
                radius={[4, 4, 0, 0]}
              />
            )}
            {reportType === 'profit' && (
              <Bar 
                dataKey="profit" 
                name="Profit" 
                fill={colors.profit} 
                radius={[4, 4, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
