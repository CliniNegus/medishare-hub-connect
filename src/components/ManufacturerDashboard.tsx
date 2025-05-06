
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
      <ManufacturerHeader />
      <DashboardStatsCards {...dashboardStats} />
      <VirtualShopsSection 
        virtualShops={virtualShops} 
        loadingShops={loadingShops} 
      />
      <DashboardTabs />
    </div>
  );
};

export default ManufacturerDashboard;
