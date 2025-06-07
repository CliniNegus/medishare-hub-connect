
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MetricsTab from './tabs/MetricsTab';
import IoTTab from './tabs/IoTTab';
import AlertsTab from './tabs/AlertsTab';
import SettingsTab from './tabs/SettingsTab';

interface EquipmentAnalytics {
  id: string;
  equipment_id: string;
  usage_hours: number;
  downtime_hours: number;
  revenue_generated: number;
  date_recorded: string;
  last_location: string;
}

interface EquipmentTabsProps {
  analytics: EquipmentAnalytics[];
  equipmentName: string;
  equipmentId: string;
}

const EquipmentTabs: React.FC<EquipmentTabsProps> = ({ analytics, equipmentName, equipmentId }) => {
  return (
    <Tabs defaultValue="metrics" className="w-full">
      <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 bg-gray-50 p-1 rounded-lg h-auto sm:h-12 gap-1 sm:gap-0">
        <TabsTrigger 
          value="metrics" 
          className="data-[state=active]:bg-white data-[state=active]:text-[#E02020] data-[state=active]:shadow-sm font-medium text-xs sm:text-sm py-2 sm:py-3"
        >
          <span className="hidden sm:inline">Real-time Metrics</span>
          <span className="sm:hidden">Metrics</span>
        </TabsTrigger>
        <TabsTrigger 
          value="iot" 
          className="data-[state=active]:bg-white data-[state=active]:text-[#E02020] data-[state=active]:shadow-sm font-medium text-xs sm:text-sm py-2 sm:py-3"
        >
          <span className="hidden sm:inline">IoT Data</span>
          <span className="sm:hidden">IoT</span>
        </TabsTrigger>
        <TabsTrigger 
          value="alerts" 
          className="data-[state=active]:bg-white data-[state=active]:text-[#E02020] data-[state=active]:shadow-sm font-medium text-xs sm:text-sm py-2 sm:py-3"
        >
          Alerts
        </TabsTrigger>
        <TabsTrigger 
          value="settings" 
          className="data-[state=active]:bg-white data-[state=active]:text-[#E02020] data-[state=active]:shadow-sm font-medium text-xs sm:text-sm py-2 sm:py-3"
        >
          Settings
        </TabsTrigger>
      </TabsList>
      
      <MetricsTab analytics={analytics} equipmentName={equipmentName} />
      <IoTTab equipmentId={equipmentId} />
      <AlertsTab />
      <SettingsTab />
    </Tabs>
  );
};

export default EquipmentTabs;
