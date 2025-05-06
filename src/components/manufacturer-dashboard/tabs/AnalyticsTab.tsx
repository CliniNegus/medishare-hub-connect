
import React from 'react';
import { BarChart2 } from "lucide-react";

const AnalyticsTab = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Analytics Dashboard</h2>
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="text-center">
          <BarChart2 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Analytics charts would be displayed here in a real implementation.</p>
          <p className="text-gray-500 text-sm mt-2">Including revenue trends, leased equipment distribution, and maintenance statistics.</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
