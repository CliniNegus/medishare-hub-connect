
import React from 'react';
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ReportHeaderProps {
  exportFormat: string;
  setExportFormat: (value: string) => void;
  handleExportReport: () => void;
}

const ReportHeader: React.FC<ReportHeaderProps> = ({ 
  exportFormat, 
  setExportFormat, 
  handleExportReport 
}) => {
  return (
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
  );
};

export default ReportHeader;
