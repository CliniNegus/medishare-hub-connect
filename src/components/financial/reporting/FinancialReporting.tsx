
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Download, Calendar, DollarSign, RefreshCw, FileText } from "lucide-react";
import { useFinancialData } from '@/hooks/useFinancialData';
import { useToast } from '@/hooks/use-toast';

const FinancialReporting: React.FC = () => {
  const { transactions, metrics, loading, refreshData } = useFinancialData();
  const { toast } = useToast();
  const [reportPeriod, setReportPeriod] = useState('current_month');
  const [reportType, setReportType] = useState('overview');

  // Generate chart data from transactions
  const generateChartData = () => {
    const monthlyData = [];
    const last6Months = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      last6Months.push({
        month: monthName,
        revenue: Math.floor(Math.random() * 500000) + 200000, // Mock data for demonstration
        expenses: Math.floor(Math.random() * 200000) + 100000,
        profit: 0
      });
    }
    
    // Calculate profit
    last6Months.forEach(item => {
      item.profit = item.revenue - item.expenses;
    });

    return last6Months;
  };

  const chartData = generateChartData();

  const pieData = [
    { name: 'Equipment Leases', value: 45, color: '#E02020' },
    { name: 'Service Fees', value: 30, color: '#FF6B6B' },
    { name: 'Maintenance', value: 15, color: '#FFA726' },
    { name: 'Other', value: 10, color: '#66BB6A' }
  ];

  const handleExportReport = () => {
    toast({
      title: "Report Generated",
      description: `${reportType.replace('_', ' ').toUpperCase()} report for ${reportPeriod.replace('_', ' ')} has been exported.`,
    });
  };

  const getRecentTransactions = () => {
    return transactions.slice(0, 10).map(transaction => ({
      ...transaction,
      amount_ksh: transaction.amount * (transaction.currency === 'KES' ? 1 : 130)
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-[#E02020]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[#333333]">Financial Reports</h3>
          <p className="text-gray-600">Comprehensive financial analytics and reporting</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current_month">Current Month</SelectItem>
              <SelectItem value="last_3_months">Last 3 Months</SelectItem>
              <SelectItem value="last_6_months">Last 6 Months</SelectItem>
              <SelectItem value="current_year">Current Year</SelectItem>
              <SelectItem value="last_year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="revenue">Revenue Analysis</SelectItem>
              <SelectItem value="expenses">Expense Analysis</SelectItem>
              <SelectItem value="cash_flow">Cash Flow</SelectItem>
              <SelectItem value="profitability">Profitability</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            className="border-[#E02020] text-[#E02020] hover:bg-[#E02020] hover:text-white"
            onClick={handleExportReport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button 
            className="bg-[#E02020] hover:bg-[#c01c1c]"
            onClick={refreshData}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-[#E02020]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#E02020]">
              Ksh {(metrics.totalRevenue * 130).toLocaleString()}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#E02020]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Monthly Recurring Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#E02020]">
              Ksh {(metrics.cashFlow * 130).toLocaleString()}
            </div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#E02020]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Outstanding Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#E02020]">
              Ksh {(metrics.pendingInvoicesAmount * 130).toLocaleString()}
            </div>
            <p className="text-xs text-gray-600">{metrics.pendingInvoices} pending invoices</p>
          </CardContent>
        </Card>

        <Card className="border-[#E02020]/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#E02020]">34.2%</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <Card className="border-[#E02020]/20">
          <CardHeader>
            <CardTitle className="text-[#333333] flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-[#E02020]" />
              Revenue & Profit Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `Ksh ${(value / 1000)}K`} />
                <Tooltip 
                  formatter={(value: any) => [`Ksh ${value.toLocaleString()}`, '']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar dataKey="revenue" fill="#E02020" name="Revenue" />
                <Bar dataKey="profit" fill="#66BB6A" name="Profit" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Distribution */}
        <Card className="border-[#E02020]/20">
          <CardHeader>
            <CardTitle className="text-[#333333] flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-[#E02020]" />
              Revenue Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions Table */}
      <Card className="border-[#E02020]/20">
        <CardHeader>
          <CardTitle className="text-[#333333] flex items-center">
            <FileText className="h-5 w-5 mr-2 text-[#E02020]" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No transactions found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getRecentTransactions().map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.reference}</TableCell>
                    <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium text-[#E02020]">
                      Ksh {transaction.amount_ksh.toLocaleString()}
                    </TableCell>
                    <TableCell>{transaction.currency}</TableCell>
                    <TableCell>
                      <Badge 
                        className={`${
                          transaction.status === 'success' ? 'bg-green-100 text-green-800' :
                          transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}
                      >
                        {transaction.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {transaction.metadata?.payment_method || 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReporting;
