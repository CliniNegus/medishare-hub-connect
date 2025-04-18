
import React from 'react';
import { BarChart } from "lucide-react";

const AnalyticsTab: React.FC = () => {
  return (
    <div className="h-64 flex items-center justify-center text-gray-500">
      <div className="text-center">
        <BarChart className="h-12 w-12 mx-auto mb-2 text-gray-400" />
        <h3 className="text-lg font-medium mb-1">Analytics Dashboard</h3>
        <p className="text-sm">View detailed analytics of equipment usage and revenue.</p>
      </div>
    </div>
  );
};

export default AnalyticsTab;
