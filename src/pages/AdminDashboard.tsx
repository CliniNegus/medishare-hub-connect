import React, { useState } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import TabContent from '@/components/admin/TabContent';
import { useAdminNotifications } from '@/hooks/useAdminNotifications';
import { useAdminDashboardData } from '@/hooks/useAdminDashboardData';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '@/components/ui/skeleton';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AdminAppSidebar } from '@/components/admin/AdminAppSidebar';

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
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="min-h-screen flex w-full max-w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-x-hidden box-border">
          <AdminAppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <SidebarInset className="w-full max-w-full">
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm w-full">
              <div className="flex h-14 sm:h-16 items-center px-3 sm:px-4 gap-2 sm:gap-4">
                <SidebarTrigger />
                <div className="flex-1 min-w-0">
                  <AdminHeader />
                </div>
              </div>
            </header>
            
            <main className="flex-1 p-3 sm:p-4 md:p-6 w-full max-w-full box-border">
              <div className="space-y-4 sm:space-y-6 w-full max-w-full">
                {/* Loading skeleton for stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-full">
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
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <Skeleton className="h-6 w-48 mb-4" />
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-lg" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen flex w-full max-w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-x-hidden box-border">
        <AdminAppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <SidebarInset className="w-full max-w-full">
          <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm w-full">
            <div className="flex h-14 sm:h-16 items-center px-3 sm:px-4 gap-2 sm:gap-4">
              <SidebarTrigger />
              <div className="flex-1 min-w-0">
                <AdminHeader />
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-3 sm:p-4 md:p-6 w-full max-w-full box-border">
            <TabContent 
              activeTab={activeTab} 
              stats={stats}
              recentEquipment={recentEquipment}
              maintenanceSchedule={maintenanceSchedule}
              recentTransactions={recentTransactions}
            />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminDashboard;