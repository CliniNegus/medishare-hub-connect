
import React, { useState } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import BookingModal from './BookingModal';
import { equipmentData, clusterNodes, recentTransactions } from './dashboard/data';
import DashboardHeader from './dashboard/DashboardHeader';
import DashboardContent from './dashboard/DashboardContent';
import { EquipmentProps } from './EquipmentCard';
import { Button } from "@/components/ui/button";
import { UserCog, Activity, Building2, TrendingUp, Sparkles } from "lucide-react";
import ChangeAccountTypeModal from './ChangeAccountTypeModal';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useAuth } from '@/contexts/AuthContext';
import EquipmentTabContent from './hospital-dashboard/EquipmentTabContent';
import BookingsTabContent from './hospital-dashboard/BookingsTabContent';
import TherapyTabContent from './hospital-dashboard/TherapyTabContent';
import FinancingTabContent from './hospital-dashboard/FinancingTabContent';
import ShopTabContent from './hospital-dashboard/ShopTabContent';
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import HospitalDashboardTabs from './hospital-dashboard/HospitalDashboardTabs';
import DashboardStatsSection from './hospital-dashboard/DashboardStatsSection';
import RecentBookingsSection from './hospital-dashboard/RecentBookingsSection';
import RecentOrdersSection from './hospital-dashboard/RecentOrdersSection';
import NotificationDropdown from './notifications/NotificationDropdown';
import { ThemeToggleButton } from './ThemeToggle';

const HospitalDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedClusterNode, setSelectedClusterNode] = useState<string | undefined>(undefined);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentProps | null>(null);
  const [activeTab, setActiveTab] = useState("equipment");
  const [accountTypeModalOpen, setAccountTypeModalOpen] = useState(false);
  const { profile } = useUserRole();
  const { user } = useAuth();

  const handleBookEquipment = (id: string) => {
    const equipment = equipmentData.find(eq => eq.id === id);
    if (equipment) {
      setSelectedEquipment(equipment);
      setBookingModalOpen(true);
    }
  };

  const handleConfirmBooking = (date: Date, duration: number, notes: string) => {
    console.log('Booking confirmed:', { equipment: selectedEquipment?.name, date, duration, notes });
    // In a real app, this would send a request to the backend to create a booking
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Hero Section with Gradient Background */}
      <div className="relative bg-gradient-to-r from-[#E02020] to-[#c01c1c] text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10 px-4 sm:px-6 py-6 sm:py-8">
          <div className="container-responsive">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Hospital Dashboard</h1>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30 w-fit">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                </div>
                <div className="space-y-1">
                  {profile && (
                    <p className="text-white/90 text-lg">
                      Welcome back, {profile.full_name || user?.email?.split('@')[0]}
                    </p>
                  )}
                  {profile?.organization && (
                    <p className="text-white/75 flex items-center">
                      <Building2 className="h-4 w-4 mr-1" />
                      {profile.organization}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                {/* Theme Toggle */}
                <ThemeToggleButton />
                
                {/* Notifications */}
                <div className="text-white [&>button]:text-white [&>button:hover]:bg-white/10 [&_svg]:text-white [&_.bg-\\[\\#E02020\\]]:bg-white [&_.bg-\\[\\#E02020\\]]:text-[#E02020]">
                  <NotificationDropdown />
                </div>
                
                {/* Account Settings */}
                <Button 
                  variant="outline"
                  className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-[#E02020] transition-all duration-200 backdrop-blur-sm"
                  onClick={() => setAccountTypeModalOpen(true)}
                >
                  <UserCog className="mr-2 h-4 w-4" />
                  Account Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 -mt-4 relative z-20">
        {/* Quick Stats Overview - Now functional with real data */}
        <DashboardStatsSection />

        {/* Recent Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <RecentBookingsSection />
          <RecentOrdersSection />
        </div>

        {/* Dashboard Tabs */}
        <Card className="shadow-lg border-0 mb-8">
          <CardContent className="p-0">
            <HospitalDashboardTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              equipmentData={equipmentData}
              clusterNodes={clusterNodes}
              selectedClusterNode={selectedClusterNode}
              setSelectedClusterNode={setSelectedClusterNode}
              onBookEquipment={handleBookEquipment}
              recentTransactions={recentTransactions}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
            />
          </CardContent>
        </Card>
      </div>
      
      {selectedEquipment && (
        <BookingModal 
          isOpen={bookingModalOpen}
          equipmentId={selectedEquipment.id}
          equipmentName={selectedEquipment.name}
          pricePerUse={selectedEquipment.pricePerUse}
          onClose={() => setBookingModalOpen(false)}
          onConfirm={handleConfirmBooking}
        />
      )}
      
      <ChangeAccountTypeModal 
        open={accountTypeModalOpen}
        onOpenChange={setAccountTypeModalOpen}
      />
    </div>
  );
};

export default HospitalDashboard;
