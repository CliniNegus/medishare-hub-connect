
import { useState } from 'react';
import { addMonths, format, subMonths } from 'date-fns';

export interface MonthlyDataItem {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface ExpenseCategory {
  name: string;
  value: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: string;
}

export interface FinancialReportingData {
  monthlyData: MonthlyDataItem[];
  expenseCategories: ExpenseCategory[];
  recentTransactions: Transaction[];
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  profitMargin: number;
  colors: {
    revenue: string;
    expenses: string;
    profit: string;
    pieColors: string[];
  };
}

export const useFinancialReporting = () => {
  const [reportType, setReportType] = useState<string>("revenue");
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subMonths(new Date(), 5),
    to: new Date()
  });
  const [exportFormat, setExportFormat] = useState<string>("pdf");
  
  // Generate mock financial data
  const generateMonthlyData = (): MonthlyDataItem[] => {
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
  const expenseCategories: ExpenseCategory[] = [
    { name: 'Equipment Leasing', value: 12500 },
    { name: 'Maintenance', value: 7500 },
    { name: 'Staff & Labor', value: 25000 },
    { name: 'Utilities', value: 5000 },
    { name: 'Insurance', value: 8000 },
    { name: 'Other', value: 4000 }
  ];
  
  // Mock transaction data for table
  const recentTransactions: Transaction[] = [
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

  return {
    reportType,
    setReportType,
    dateRange,
    setDateRange,
    exportFormat,
    setExportFormat,
    monthlyData,
    expenseCategories,
    recentTransactions,
    totalRevenue,
    totalExpenses,
    totalProfit,
    profitMargin,
    colors,
    handleExportReport
  };
};
