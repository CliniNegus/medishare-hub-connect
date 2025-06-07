
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import IoTUsageTracker from "../IoTUsageTracker";

interface IoTTabProps {
  equipmentId: string;
}

const IoTTab: React.FC<IoTTabProps> = ({ equipmentId }) => {
  return (
    <TabsContent value="iot" className="mt-6 sm:mt-8">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        <div className="min-w-0">
          <IoTUsageTracker 
            equipmentId={equipmentId}
            pricePerUse={50}
          />
        </div>
        <div className="min-w-0">
          <Card>
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-base sm:text-lg font-semibold text-[#333333]">Device Sensors</CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <span className="text-xs sm:text-sm font-medium text-[#333333]">Temperature</span>
                  <span className="text-xs sm:text-sm text-green-600 font-medium">Normal (22°C)</span>
                </div>
                <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <span className="text-xs sm:text-sm font-medium text-[#333333]">Vibration</span>
                  <span className="text-xs sm:text-sm text-green-600 font-medium">Normal</span>
                </div>
                <div className="flex justify-between items-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <span className="text-xs sm:text-sm font-medium text-[#333333]">Power Draw</span>
                  <span className="text-xs sm:text-sm text-blue-600 font-medium">85W</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TabsContent>
  );
};

export default IoTTab;
