
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
    <div className="min-h-screen bg-background overflow-x-hidden w-full max-w-full">
      {/* Hero Section with Gradient Background */}
      <div className="relative bg-gradient-to-r from-[#E02020] to-[#c01c1c] text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10 px-2 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6">
          <div className="w-full max-w-7xl mx-auto">
            <div className="flex flex-col gap-3 sm:gap-4">
              <div className="w-full">
                <div className="flex flex-col gap-2 mb-2">
                  <div className="flex flex-col xs:flex-row xs:items-center gap-2">
                    <h1 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold truncate">Hospital Dashboard</h1>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30 w-fit">
                      <Sparkles className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                </div>
                <div className="space-y-1">
                  {profile && (
                    <p className="text-white/90 text-sm sm:text-base truncate">
                      Welcome back, {profile.full_name || user?.email?.split('@')[0]}
                    </p>
                  )}
                  {profile?.organization && (
                    <p className="text-white/75 flex items-center text-xs sm:text-sm truncate">
                      <Building2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{profile.organization}</span>
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 w-full">
                {/* Theme Toggle */}
                <ThemeToggleButton />
                
                {/* Notifications */}
                <div className="text-white [&>button]:text-white [&>button:hover]:bg-white/10 [&_svg]:text-white [&_.bg-\\[\\#E02020\\]]:bg-white [&_.bg-\\[\\#E02020\\]]:text-[#E02020]">
                  <NotificationDropdown />
                </div>
                
                {/* Account Settings */}
                <Button 
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-[#E02020] transition-all duration-200 backdrop-blur-sm text-xs sm:text-sm px-2 sm:px-3"
                  onClick={() => setAccountTypeModalOpen(true)}
                >
                  <UserCog className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden xs:inline">Account Settings</span>
                  <span className="xs:hidden">Settings</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-full px-2 sm:px-4 md:px-6 -mt-2 sm:-mt-4 relative z-20">
        <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6">
          {/* Quick Stats Overview - Now functional with real data */}
          <DashboardStatsSection />

          {/* Recent Activity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <RecentBookingsSection />
            <RecentOrdersSection />
          </div>

          {/* Dashboard Tabs */}
          <Card className="shadow-lg border-0 w-full max-w-full">
            <CardContent className="p-0 overflow-hidden">
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
