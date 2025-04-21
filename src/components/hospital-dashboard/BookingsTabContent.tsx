
import React from 'react';
import { EquipmentProps } from '../EquipmentCard';
import { Button } from "@/components/ui/button";

interface BookingsTabContentProps {
  equipmentData: EquipmentProps[];
  onBookEquipment: (id: string) => void;
}

const BookingsTabContent: React.FC<BookingsTabContentProps> = ({
  equipmentData,
  onBookEquipment
}) => (
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
              <Button size="sm" onClick={() => onBookEquipment(equipment.id)}>Book Now</Button>
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
);

export default BookingsTabContent;
