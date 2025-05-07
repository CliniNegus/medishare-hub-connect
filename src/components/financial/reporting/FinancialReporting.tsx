
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useFinancialReporting } from './useFinancialReporting';
import ReportHeader from './ReportHeader';
import FinancialSummaryCards from './FinancialSummaryCards';
import ReportControls from './ReportControls';
import RevenueChart from './RevenueChart';
import ExpensePieChart from './ExpensePieChart';
import TransactionTable from './TransactionTable';

const FinancialReporting: React.FC = () => {
  const {
    reportType,
    setReportType,
    dateRange,
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
  } = useFinancialReporting();
  
  return (
    <div className="space-y-6">
      <Card className="border-red-200">
        <ReportHeader 
          exportFormat={exportFormat}
          setExportFormat={setExportFormat}
          handleExportReport={handleExportReport}
        />
        <CardContent className="p-6">
          <FinancialSummaryCards
            dateRange={dateRange}
            totalRevenue={totalRevenue}
            totalExpenses={totalExpenses}
            totalProfit={totalProfit}
            profitMargin={profitMargin}
          />
          
          <ReportControls
            reportType={reportType}
            setReportType={setReportType}
            dateRange={dateRange}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RevenueChart 
                reportType={reportType}
                monthlyData={monthlyData}
                colors={colors}
              />
            </div>
            
            <div>
              <ExpensePieChart 
                expenseCategories={expenseCategories}
                colors={colors}
              />
            </div>
          </div>
          
          <div className="mt-6">
            <TransactionTable recentTransactions={recentTransactions} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReporting;
