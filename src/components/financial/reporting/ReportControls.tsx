
import React from 'react';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon } from "lucide-react";
import { format } from 'date-fns';

interface ReportControlsProps {
  reportType: string;
  setReportType: (value: string) => void;
  dateRange: {
    from: Date;
    to: Date;
  };
}

const ReportControls: React.FC<ReportControlsProps> = ({ 
  reportType, 
  setReportType, 
  dateRange 
}) => {
  return (
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
  );
};

export default ReportControls;
