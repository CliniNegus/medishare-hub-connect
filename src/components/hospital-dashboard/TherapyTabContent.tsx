
import React from 'react';
import { EquipmentProps } from '../EquipmentCard';
import { Button } from "@/components/ui/button";

interface TherapyTabContentProps {
  equipmentData: EquipmentProps[];
}

const TherapyTabContent: React.FC<TherapyTabContentProps> = ({ equipmentData }) => (
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
            <span className="font-medium text-red-600">Ksh {equipment.pricePerUse}/use</span>
            <Button size="sm" variant="outline">Learn More</Button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default TherapyTabContent;
