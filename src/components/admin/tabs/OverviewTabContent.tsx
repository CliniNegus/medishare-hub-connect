
import React from 'react';
import AdminStatsCards from '../AdminStatsCards';
import QuickActions from '../QuickActions';
import DataTabs from '../data-tabs';
import EquipmentPopularityManager from '../equipment/EquipmentPopularityManager';

interface OverviewTabContentProps {
  stats: {
    hospitals: number;
    manufacturers: number;
    investors: number;
    equipmentItems: number;
    activeLeases: number;
    pendingOrders: number;
    maintenanceAlerts: number;
    totalRevenue: number;
  };
  recentEquipment: any[];
  maintenanceSchedule: any[];
  recentTransactions: any[];
}

const OverviewTabContent: React.FC<OverviewTabContentProps> = ({
  stats,
  recentEquipment,
  maintenanceSchedule,
  recentTransactions
}) => {
  return (
    <div className="space-y-6">
      <AdminStatsCards stats={stats} />
      <QuickActions />
      <EquipmentPopularityManager />
      <DataTabs 
        recentEquipment={recentEquipment}
        maintenanceSchedule={maintenanceSchedule}
        recentTransactions={recentTransactions}
      />
    </div>
  );
};

export default OverviewTabContent;
