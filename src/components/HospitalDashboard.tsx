
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

const HospitalDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClusterNode, setSelectedClusterNode] = useState<string | undefined>(undefined);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentProps | null>(null);
  const [activeTab, setActiveTab] = useState("equipment");
  const [accountTypeModalOpen, setAccountTypeModalOpen] = useState(false);
  const { profile } = useUserRole();

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hospital Dashboard</h1>
        
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
        <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <TabsContent value="equipment" className="mt-0">
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
        
        <TabsContent value="bookings">
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
        
        <TabsContent value="analytics">
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
      </Tabs>
      
      {/* Booking Modal */}
      {selectedEquipment && (
        <BookingModal 
          isOpen={bookingModalOpen}
          equipmentName={selectedEquipment.name}
          pricePerUse={selectedEquipment.pricePerUse}
          onClose={() => setBookingModalOpen(false)}
          onConfirm={handleConfirmBooking}
        />
      )}
      
      {/* Account Type Change Modal */}
      <ChangeAccountTypeModal 
        open={accountTypeModalOpen}
        onOpenChange={setAccountTypeModalOpen}
      />
    </div>
  );
};

export default HospitalDashboard;
