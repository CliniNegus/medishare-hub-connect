
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SettingsTab: React.FC = () => {
  return (
    <TabsContent value="settings" className="mt-6 sm:mt-8">
      <Card>
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="text-base sm:text-lg font-semibold text-[#333333]">Equipment Settings</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h4 className="font-medium mb-3 sm:mb-4 text-[#333333] text-sm sm:text-base">Monitoring Preferences</h4>
              <div className="space-y-2 sm:space-y-3">
                <label className="flex items-center space-x-2 sm:space-x-3">
                  <input type="checkbox" className="mr-1 sm:mr-2 text-[#E02020]" defaultChecked />
                  <span className="text-xs sm:text-sm">Real-time data collection</span>
                </label>
                <label className="flex items-center space-x-2 sm:space-x-3">
                  <input type="checkbox" className="mr-1 sm:mr-2 text-[#E02020]" defaultChecked />
                  <span className="text-xs sm:text-sm">Alert notifications</span>
                </label>
                <label className="flex items-center space-x-2 sm:space-x-3">
                  <input type="checkbox" className="mr-1 sm:mr-2 text-[#E02020]" />
                  <span className="text-xs sm:text-sm">Predictive maintenance</span>
                </label>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3 sm:mb-4 text-[#333333] text-sm sm:text-base">Data Retention</h4>
              <select className="w-full p-2 sm:p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E02020] focus:border-transparent text-xs sm:text-sm">
                <option>30 days</option>
                <option>90 days</option>
                <option>1 year</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default SettingsTab;
