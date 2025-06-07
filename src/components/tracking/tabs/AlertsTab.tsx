
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

const AlertsTab: React.FC = () => {
  return (
    <TabsContent value="alerts" className="mt-6 sm:mt-8">
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-base sm:text-lg font-semibold text-[#333333] flex items-center">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-[#E02020]" />
            Active Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="space-y-4 sm:space-y-6">
            <div className="p-4 sm:p-6 border border-yellow-200 bg-yellow-50 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-yellow-800 mb-1 text-sm sm:text-base">Maintenance Due</p>
                  <p className="text-xs sm:text-sm text-yellow-700">Regular maintenance is scheduled in 3 days</p>
                </div>
                <span className="text-xs bg-yellow-200 text-yellow-800 px-2 sm:px-3 py-1 rounded-full font-medium self-start sm:self-center">
                  Medium
                </span>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 border border-green-200 bg-green-50 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-green-800 mb-1 text-sm sm:text-base">All Systems Normal</p>
                  <p className="text-xs sm:text-sm text-green-700">Equipment is operating within normal parameters</p>
                </div>
                <span className="text-xs bg-green-200 text-green-800 px-2 sm:px-3 py-1 rounded-full font-medium self-start sm:self-center">
                  Info
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default AlertsTab;
