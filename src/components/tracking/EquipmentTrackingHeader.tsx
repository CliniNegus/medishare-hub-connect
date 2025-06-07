
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Settings } from "lucide-react";

interface EquipmentTrackingHeaderProps {
  onRefresh: () => void;
}

const EquipmentTrackingHeader: React.FC<EquipmentTrackingHeaderProps> = ({ onRefresh }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#333333] mb-2">Equipment Tracking</h1>
        <p className="text-sm sm:text-base text-gray-600">Monitor your equipment performance and usage in real-time</p>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <Button 
          onClick={onRefresh} 
          variant="outline" 
          size="sm" 
          className="border-[#E02020] text-[#E02020] hover:bg-[#E02020] hover:text-white text-xs sm:text-sm"
        >
          <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden xs:inline">Refresh</span>
        </Button>
        <Button variant="outline" size="sm" className="text-xs sm:text-sm">
          <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span className="hidden xs:inline">Settings</span>
        </Button>
      </div>
    </div>
  );
};

export default EquipmentTrackingHeader;
