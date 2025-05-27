
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
        <div className="relative z-10 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl lg:text-4xl font-bold">Hospital Dashboard</h1>
                  <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
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
              
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
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
      <div className="px-6 -mt-4 relative z-20">
        {/* Quick Stats Overview */}
        <Card className="mb-8 shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-[#333333] flex items-center">
                <Activity className="h-5 w-5 mr-2 text-[#E02020]" />
                Hospital Overview
              </h2>
              <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                <TrendingUp className="h-4 w-4 mr-1" />
                Equipment utilization: 87%
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Available Equipment</p>
                    <p className="text-2xl font-bold text-blue-800">24</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Activity className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 font-medium">Active Bookings</p>
                    <p className="text-2xl font-bold text-green-800">8</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Activity className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Pending Orders</p>
                    <p className="text-2xl font-bold text-purple-800">3</p>
                  </div>
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Activity className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </div>
              <div className="bg-[#E02020]/10 p-4 rounded-lg border border-[#E02020]/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#E02020] font-medium">Monthly Savings</p>
                    <p className="text-2xl font-bold text-[#E02020]">$12.5k</p>
                  </div>
                  <div className="p-2 bg-[#E02020]/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-[#E02020]" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
