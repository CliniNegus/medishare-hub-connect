
import React, { useState } from 'react';
import { dashboardStats } from './manufacturer-dashboard/data/dashboardData';
import { useManufacturerShops } from './manufacturer-dashboard/hooks/useManufacturerShops';
import { 
  ManufacturerHeader, 
  DashboardStatsCards, 
  VirtualShopsSection, 
  DashboardTabs 
} from './manufacturer-dashboard';
import ChangeAccountTypeModal from './ChangeAccountTypeModal';
import { UserCog } from 'lucide-react';
import { Button } from "./ui/button";

const ManufacturerDashboard = () => {
  const { virtualShops, loadingShops } = useManufacturerShops();
  const [accountTypeModalOpen, setAccountTypeModalOpen] = useState(false);

  return (
    <div className="w-full">
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
      
      <div className="flex justify-end mb-6">
        <Button 
          variant="outline" 
          className="flex items-center space-x-2 border-red-600 text-red-600 hover:bg-red-50"
          onClick={() => setAccountTypeModalOpen(true)}
        >
          <UserCog className="h-4 w-4 mr-2" />
          <span>Change Account Type</span>
        </Button>
      </div>
      
      <DashboardTabs />
      
      <ChangeAccountTypeModal
        open={accountTypeModalOpen}
        onOpenChange={setAccountTypeModalOpen}
      />
    </div>
  );
};

export default ManufacturerDashboard;
