
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

const HospitalDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
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
      <div className="flex justify-between items-center mb-6">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-semibold">Available Equipment for Booking</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {equipmentData.map(equipment => (
                  <div key={equipment.id} className="border rounded-lg p-4 bg-white shadow-sm">
                    <h3 className="font-medium text-lg">{equipment.name}</h3>
                    <p className="text-sm text-gray-500 mb-2">${equipment.pricePerUse} per use</p>
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-sm">
                        <span className="font-medium">Current Location:</span> {equipment.location || 'Central Warehouse'}
                      </div>
                      <Button size="sm" onClick={() => handleBookEquipment(equipment.id)}>Book Now</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-medium mb-2">Hospital Cluster Information</h3>
                <div className="border-t pt-2">
                  <h4 className="text-sm font-medium">Your Cluster:</h4>
                  <p className="text-sm">Northwest Medical Network</p>
                  <h4 className="text-sm font-medium mt-2">Member Hospitals:</h4>
                  <ul className="text-sm list-disc list-inside">
                    <li>City General Hospital</li>
                    <li>Memorial Medical Center</li>
                    <li>University Health System</li>
                    <li>County Hospital</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
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

        <TabsContent value="therapy">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4">Therapy as a Service Equipment</h2>
            <p className="text-gray-600 mb-4">Access advanced therapy equipment without capital investment. Pay only for usage.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {equipmentData.slice(0, 3).map(equipment => (
                <div key={equipment.id} className="border rounded-lg p-4 bg-white shadow-sm">
                  <h3 className="font-medium">{equipment.name}</h3>
                  <p className="text-sm text-gray-500 mb-2">Usage-based payment model</p>
                  <p className="text-xs text-gray-500 mb-3">No upfront costs, immediate access</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-medium text-red-600">${equipment.pricePerUse}/use</span>
                    <Button size="sm" variant="outline">Learn More</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="financing">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4">Equipment Financing Options</h2>
            <p className="text-gray-600 mb-4">Connect with investors to finance your medical equipment needs</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {equipmentData.slice(3, 6).map(equipment => (
                <div key={equipment.id} className="border rounded-lg p-4 bg-white shadow-sm">
                  <h3 className="font-medium">{equipment.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">Estimated Cost: ${(equipment.pricePerUse * 100).toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mb-3">Financing term: 36 months</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-medium text-red-600">~${Math.round(equipment.pricePerUse * 3.3)}/month</span>
                    <Button size="sm">Find Investor</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="shop">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h2 className="text-xl font-semibold mb-4">Medical Shop</h2>
            <p className="text-gray-600 mb-4">Purchase disposables and smaller equipment directly</p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              {Array(8).fill(null).map((_, idx) => (
                <div key={idx} className="border rounded-lg p-4 bg-white shadow-sm">
                  <div className="bg-gray-100 h-32 rounded-md mb-3 flex items-center justify-center text-gray-400">
                    Product Image
                  </div>
                  <h3 className="font-medium text-sm">Disposable Item {idx + 1}</h3>
                  <p className="text-xs text-gray-500 mb-3">Pack of 100 units</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-medium text-red-600">${(49 + idx * 10).toFixed(2)}</span>
                    <Button size="sm" variant="outline">Add to Cart</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
