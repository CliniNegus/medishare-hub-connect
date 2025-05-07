
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, PieChart } from 'lucide-react';
import { format } from 'date-fns';

interface FinancialSummaryCardsProps {
  dateRange: {
    from: Date;
    to: Date;
  };
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  profitMargin: number;
}

const FinancialSummaryCards: React.FC<FinancialSummaryCardsProps> = ({
  dateRange,
  totalRevenue,
  totalExpenses,
  totalProfit,
  profitMargin
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
      <Card className="border-red-100 bg-red-50">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-red-600">${totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Period: {format(dateRange.from, 'MMM yyyy')} - {format(dateRange.to, 'MMM yyyy')}</p>
            </div>
            <div className="bg-white p-2 rounded-full">
              <DollarSign className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-blue-100 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Total Expenses</p>
              <p className="text-2xl font-bold text-blue-600">${totalExpenses.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Period: {format(dateRange.from, 'MMM yyyy')} - {format(dateRange.to, 'MMM yyyy')}</p>
            </div>
            <div className="bg-white p-2 rounded-full">
              <TrendingDown className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-green-100 bg-green-50">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Net Profit</p>
              <p className="text-2xl font-bold text-green-600">${totalProfit.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Period: {format(dateRange.from, 'MMM yyyy')} - {format(dateRange.to, 'MMM yyyy')}</p>
            </div>
            <div className="bg-white p-2 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-yellow-100 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">Profit Margin</p>
              <p className="text-2xl font-bold text-yellow-600">{profitMargin.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-1">
                {profitMargin > 20 ? 'Excellent' : profitMargin > 10 ? 'Good' : 'Needs improvement'}
              </p>
            </div>
            <div className="bg-white p-2 rounded-full">
              <PieChart className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialSummaryCards;
