
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { PieChart as PieChartIcon } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface ExpenseCategory {
  name: string;
  value: number;
}

interface ExpensePieChartProps {
  expenseCategories: ExpenseCategory[];
  colors: {
    pieColors: string[];
  };
}

const ExpensePieChart: React.FC<ExpensePieChartProps> = ({ 
  expenseCategories, 
  colors 
}) => {
  return (
    <Card className="border-gray-200 h-80">
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-2 flex items-center">
          <PieChartIcon className="h-5 w-5 mr-2 text-gray-500" />
          Expense Breakdown
        </h3>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={expenseCategories}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {expenseCategories.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors.pieColors[index % colors.pieColors.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`$${value.toLocaleString()}`, null]}
              contentStyle={{ backgroundColor: 'white', borderColor: '#e5e7eb' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ExpensePieChart;
