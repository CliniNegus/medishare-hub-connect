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
        <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-x-hidden">
          <AdminAppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <SidebarInset>
            <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
              <div className="flex h-16 items-center px-4 gap-4">
                <SidebarTrigger />
                <div className="flex-1">
                  <AdminHeader />
                </div>
              </div>
            </header>
            
            <main className="flex-1 p-4 md:p-6">
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
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-x-hidden">
        <AdminAppSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <SidebarInset>
          <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
            <div className="flex h-16 items-center px-4 gap-4">
              <SidebarTrigger />
              <div className="flex-1">
                <AdminHeader />
              </div>
            </div>
          </header>
          
          <main className="flex-1 p-4 md:p-6">
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