
import React from 'react';
import { EquipmentProps } from '../EquipmentCard';
import { Button } from "@/components/ui/button";

interface FinancingTabContentProps {
  equipmentData: EquipmentProps[];
}

const FinancingTabContent: React.FC<FinancingTabContentProps> = ({ equipmentData }) => (
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
);

export default FinancingTabContent;
