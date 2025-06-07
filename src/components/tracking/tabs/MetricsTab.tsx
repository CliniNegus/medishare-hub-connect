
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import RealTimeMetrics from "../RealTimeMetrics";

interface EquipmentAnalytics {
  id: string;
  equipment_id: string;
  usage_hours: number;
  downtime_hours: number;
  revenue_generated: number;
  date_recorded: string;
  last_location: string;
}

interface MetricsTabProps {
  analytics: EquipmentAnalytics[];
  equipmentName: string;
}

const MetricsTab: React.FC<MetricsTabProps> = ({ analytics, equipmentName }) => {
  return (
    <TabsContent value="metrics" className="mt-6 sm:mt-8">
      <RealTimeMetrics 
        analytics={analytics} 
        equipmentName={equipmentName}
      />
    </TabsContent>
  );
};

export default MetricsTab;
