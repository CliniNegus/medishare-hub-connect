
import React, { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminSidebarMobile from '@/components/admin/AdminSidebarMobile';
import AdminHeader from '@/components/admin/AdminHeader';
import TabContent from '@/components/admin/TabContent';
import { useAdminNotifications } from '@/hooks/useAdminNotifications';
import { useAdminDashboardData } from '@/hooks/useAdminDashboardData';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const isMobile = useIsMobile();
  
  // Initialize admin notifications
  useAdminNotifications();

  // Fetch real-time dashboard data
  const {
    stats,
    recentEquipment,
    maintenanceSchedule,
    recentTransactions,
    loading
  } = useAdminDashboardData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="flex">
          <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="ml-64 flex-1">
            <div className="min-h-screen">
              <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
                <AdminHeader />
              </div>
              
              <main className="p-6">
                <div className="space-y-6">
                  {/* Loading skeleton for stats cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-10 w-10 rounded-xl" />
                        </div>
                        <Skeleton className="h-8 w-16 mb-2" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                  
                  {/* Loading skeleton for content */}
                  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <Skeleton className="h-8 w-48 mb-4" />
                    <div className="space-y-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-x-hidden">
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
        
        <div className="w-full lg:ml-64 flex-1">
          {/* Modern content wrapper with subtle animations */}
          <div className="min-h-screen">
            {/* Header with enhanced styling */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
              <div className="flex items-center">
                {/* Mobile Sidebar Toggle */}
                <div className="lg:hidden mr-4">
                  <AdminSidebarMobile activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                <div className="flex-1">
                  <AdminHeader />
                </div>
              </div>
            </div>
            
            {/* Main content area with improved spacing and animations */}
            <main className="p-4 sm:p-6 animate-fade-in">
              <TabContent
                activeTab={activeTab}
                stats={stats}
                recentEquipment={recentEquipment}
                maintenanceSchedule={maintenanceSchedule}
                recentTransactions={recentTransactions}
              />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
