
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { 
  BarChart2, 
  Download, 
  FileText, 
  Calendar as CalendarIcon, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  PieChart,
  Table as TableIcon
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { addMonths, format, subMonths } from 'date-fns';

const FinancialReporting: React.FC = () => {
  const [reportType, setReportType] = useState("revenue");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subMonths(new Date(), 5),
    to: new Date()
  });
  const [exportFormat, setExportFormat] = useState("pdf");

  // Generate mock financial data
  const generateMonthlyData = () => {
    const monthsData = [];
    let currentDate = new Date(dateRange.from);
    
    while (currentDate <= dateRange.to) {
      const month = format(currentDate, 'MMM');
      
      monthsData.push({
        month,
        revenue: 20000 + Math.floor(Math.random() * 15000),
        expenses: 15000 + Math.floor(Math.random() * 10000),
        profit: 0 // Will calculate after
      });
      
      currentDate = addMonths(currentDate, 1);
    }
    
    // Calculate profit
    return monthsData.map(item => ({
      ...item,
      profit: item.revenue - item.expenses
    }));
  };
  
  const monthlyData = generateMonthlyData();
  
  // Mock expense categories data for pie chart
  const expenseCategories = [
    { name: 'Equipment Leasing', value: 12500 },
    { name: 'Maintenance', value: 7500 },
    { name: 'Staff & Labor', value: 25000 },
    { name: 'Utilities', value: 5000 },
    { name: 'Insurance', value: 8000 },
    { name: 'Other', value: 4000 }
  ];
  
  // Mock transaction data for table
  const recentTransactions = [
    { id: 'tx-001', date: '2025-04-15', description: 'MRI Scanner Lease Payment', amount: 5250, type: 'expense' },
    { id: 'tx-002', date: '2025-04-12', description: 'CT Services - University Hospital', amount: 3800, type: 'revenue' },
    { id: 'tx-003', date: '2025-04-10', description: 'Equipment Maintenance', amount: 1250, type: 'expense' },
    { id: 'tx-004', date: '2025-04-08', description: 'MRI Services - Community Clinic', amount: 6500, type: 'revenue' },
    { id: 'tx-005', date: '2025-04-05', description: 'Insurance Premium', amount: 2200, type: 'expense' },
    { id: 'tx-006', date: '2025-04-01', description: 'Ultrasound Services - Medical Center', amount: 4200, type: 'revenue' }
  ];
  
  // Calculate summary statistics
  const totalRevenue = monthlyData.reduce((sum, item) => sum + item.revenue, 0);
  const totalExpenses = monthlyData.reduce((sum, item) => sum + item.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const profitMargin = (totalProfit / totalRevenue) * 100;
  
  // Colors for the charts
  const colors = {
    revenue: '#dc2626',
    expenses: '#2563eb',
    profit: '#16a34a',
    pieColors: ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2']
  };
  
  const handleExportReport = () => {
    // In a real app, this would generate and download the report
    console.log(`Exporting ${reportType} report as ${exportFormat}`);
    
    // Show notification or handle export logic
  };
  
  return (
    <div className="space-y-6">
      <Card className="border-red-200">
        <CardHeader className="bg-red-50 border-b border-red-200 flex flex-row justify-between items-center">
          <CardTitle className="text-red-800">Financial Reporting</CardTitle>
          <div className="flex items-center space-x-2">
            <Select defaultValue={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Export format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
              onClick={handleExportReport}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
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
          
          <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <div className="flex items-center space-x-4">
              <Label className="text-sm font-medium">Report Type:</Label>
              <Tabs defaultValue={reportType} onValueChange={setReportType} className="w-fit">
                <TabsList className="bg-white border border-gray-200 h-9">
                  <TabsTrigger value="revenue" className="h-7 px-3">Revenue</TabsTrigger>
                  <TabsTrigger value="expenses" className="h-7 px-3">Expenses</TabsTrigger>
                  <TabsTrigger value="profit" className="h-7 px-3">Profit</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="flex items-center space-x-4">
              <Label className="text-sm font-medium whitespace-nowrap">Date Range:</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                  </div>
                  <input 
                    type="text" 
                    value={format(dateRange.from, 'MMM yyyy')}
                    readOnly
                    className="pl-10 h-9 w-full rounded-md border border-gray-200 bg-white text-sm shadow-sm outline-none focus:border-gray-300"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                  </div>
                  <input 
                    type="text" 
                    value={format(dateRange.to, 'MMM yyyy')}
                    readOnly
                    className="pl-10 h-9 w-full rounded-md border border-gray-200 bg-white text-sm shadow-sm outline-none focus:border-gray-300"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
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
            </div>
            
            <div>
              <Card className="border-gray-200 h-80">
                <CardContent className="p-4">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <PieChart className="h-5 w-5 mr-2 text-gray-500" />
                    Expense Breakdown
                  </h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <RechartsPieChart>
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
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="mt-6">
            <Card className="border-gray-200">
              <CardContent className="p-4">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <TableIcon className="h-5 w-5 mr-2 text-gray-500" />
                  Recent Transactions
                </h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map(transaction => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>${transaction.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            transaction.type === 'revenue' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.type === 'revenue' ? 'Revenue' : 'Expense'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" className="h-8 border-red-200 text-red-600 hover:bg-red-50">
                            <FileText className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReporting;
