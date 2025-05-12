
import React from 'react';
import { dashboardStats } from './manufacturer-dashboard/data/dashboardData';
import { useManufacturerShops } from './manufacturer-dashboard/hooks/useManufacturerShops';
import { 
  ManufacturerHeader, 
  DashboardStatsCards, 
  VirtualShopsSection, 
  DashboardTabs 
} from './manufacturer-dashboard';

const ManufacturerDashboard = () => {
  const { virtualShops, loadingShops } = useManufacturerShops();

  return (
    <div className="container mx-auto p-6">
      <div className="manufacturer-dashboard-header">
        <ManufacturerHeader />
      </div>
      <div className="stats-cards-section">
        <DashboardStatsCards {...dashboardStats} />
      </div>
      <div className="virtual-shops-section">
        <VirtualShopsSection 
          virtualShops={virtualShops} 
          loadingShops={loadingShops} 
        />
      </div>
      <DashboardTabs />
    </div>
  );
};

export default ManufacturerDashboard;
