
import React, { useState } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import BookingModal from './BookingModal';
import { equipmentData, clusterNodes, recentTransactions } from './dashboard/data';
import DashboardHeader from './dashboard/DashboardHeader';
import DashboardContent from './dashboard/DashboardContent';
import { EquipmentProps } from './EquipmentCard';
import { Button } from "@/components/ui/button";
import { UserCog } from "lucide-react";
import ChangeAccountTypeModal from './ChangeAccountTypeModal';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useAuth } from '@/contexts/AuthContext';
import EquipmentTabContent from './hospital-dashboard/EquipmentTabContent';
import BookingsTabContent from './hospital-dashboard/BookingsTabContent';
import TherapyTabContent from './hospital-dashboard/TherapyTabContent';
import FinancingTabContent from './hospital-dashboard/FinancingTabContent';
import ShopTabContent from './hospital-dashboard/ShopTabContent';

const HospitalDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Available");
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 hospital-dashboard-header">
        <div>
          <h1 className="text-2xl font-bold">Hospital Dashboard</h1>
          {profile && (
            <p className="text-sm text-gray-600">
              {profile.full_name || user?.email} {profile.organization && `• ${profile.organization}`}
            </p>
          )}
        </div>
        
        {profile && profile.role === 'hospital' && (
          <Button 
            onClick={() => setAccountTypeModalOpen(true)}
            variant="outline"
            className="flex items-center bg-white border-red-200 text-red-600 hover:bg-red-50"
          >
            <UserCog className="h-4 w-4 mr-2" />
            Change Account Type
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="equipment" value={activeTab} className="w-full">
        <DashboardHeader 
          title="Hospital Equipment Dashboard" 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
        
        <TabsContent value="equipment" className="mt-0" data-tab="equipment">
          <EquipmentTabContent
            activeTab={activeTab}
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
        </TabsContent>
        
        <TabsContent value="bookings" data-tab="bookings">
          <BookingsTabContent
            equipmentData={equipmentData}
            onBookEquipment={handleBookEquipment}
          />
        </TabsContent>
        
        <TabsContent value="analytics" data-tab="analytics">
          <DashboardContent 
            activeTab={activeTab}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            equipmentData={equipmentData}
            clusterNodes={clusterNodes}
            selectedClusterNode={selectedClusterNode}
            setSelectedClusterNode={setSelectedClusterNode}
            onBookEquipment={handleBookEquipment}
            recentTransactions={recentTransactions}
          />
        </TabsContent>

        <TabsContent value="therapy" data-tab="therapy">
          <TherapyTabContent equipmentData={equipmentData} />
        </TabsContent>

        <TabsContent value="financing" data-tab="financing">
          <FinancingTabContent equipmentData={equipmentData} />
        </TabsContent>

        <TabsContent value="shop" data-tab="shop">
          <ShopTabContent />
        </TabsContent>
      </Tabs>
      
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
