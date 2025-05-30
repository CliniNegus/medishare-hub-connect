
import React, { useState } from 'react';
import { useManufacturerShops } from './manufacturer-dashboard/hooks/useManufacturerShops';
import { useManufacturerStats } from '@/hooks/use-manufacturer-stats';
import { 
  ManufacturerHeader, 
  DashboardStatsCards, 
  VirtualShopsSection, 
  DashboardTabs 
} from './manufacturer-dashboard';
import ChangeAccountTypeModal from './ChangeAccountTypeModal';
import { UserCog, TrendingUp, Activity } from 'lucide-react';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

const ManufacturerDashboard = () => {
  const { virtualShops, loadingShops } = useManufacturerShops();
  const { stats, loading: statsLoading, error } = useManufacturerStats();
  const [accountTypeModalOpen, setAccountTypeModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Gradient Background */}
      <div className="relative bg-gradient-to-r from-[#E02020] to-[#c01c1c] text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10 px-6 py-8">
          <ManufacturerHeader />
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 -mt-4 relative z-20">
        {/* Quick Stats Overview */}
        <Card className="mb-8 shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#333333] flex items-center">
                <Activity className="h-5 w-5 mr-2 text-[#E02020]" />
                Performance Overview
              </h2>
              <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <TrendingUp className="h-4 w-4 mr-1" />
                Real-time data
              </div>
            </div>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                Error loading stats: {error}
              </div>
            )}
            
            <DashboardStatsCards 
              totalEquipment={stats.totalEquipment}
              activeLease={stats.activeLease}
              maintenance={stats.maintenance}
              available={stats.available}
              monthlyRevenue={stats.monthlyRevenue}
              loading={statsLoading}
            />
          </CardContent>
        </Card>

        {/* Virtual Shops Section */}
        <div className="mb-8">
          <VirtualShopsSection 
            virtualShops={virtualShops} 
            loadingShops={loadingShops} 
          />
        </div>

        {/* Management Tabs */}
        <Card className="shadow-lg border-0 mb-8">
          <CardContent className="p-0">
            <DashboardTabs />
          </CardContent>
        </Card>

        {/* Account Settings */}
        <div className="flex justify-end mb-8">
          <Card className="shadow-md border-0">
            <CardContent className="p-4">
              <Button 
                variant="outline" 
                className="border-[#E02020] text-[#E02020] hover:bg-[#E02020] hover:text-white transition-colors duration-200"
                onClick={() => setAccountTypeModalOpen(true)}
              >
                <UserCog className="h-4 w-4 mr-2" />
                Account Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <ChangeAccountTypeModal
        open={accountTypeModalOpen}
        onOpenChange={setAccountTypeModalOpen}
      />
    </div>
  );
};

export default ManufacturerDashboard;
