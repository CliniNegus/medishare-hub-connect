
import React, { useState } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import BookingModal from './BookingModal';
import { equipmentData, clusterNodes, recentTransactions } from './dashboard/data';
import DashboardHeader from './dashboard/DashboardHeader';
import DashboardContent from './dashboard/DashboardContent';
import { EquipmentProps } from './EquipmentCard';

const HospitalDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClusterNode, setSelectedClusterNode] = useState<string | undefined>(undefined);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentProps | null>(null);
  const [activeTab, setActiveTab] = useState("equipment");

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
    </div>
  );
};

export default HospitalDashboard;
