
import React from 'react';
import { EquipmentProps } from '../EquipmentCard';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TherapyTabContentProps {
  equipmentData: EquipmentProps[];
}

const TherapyTabContent: React.FC<TherapyTabContentProps> = ({ equipmentData }) => {
  // Filter equipment that has pay per use enabled
  const payPerUseEquipment = equipmentData.filter(equipment => equipment.payPerUseEnabled);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-semibold">Therapy as a Service Equipment</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="h-4 w-4 text-gray-500" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Pay Per Use allows you to access advanced therapy equipment without capital investment. You only pay for actual usage.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <p className="text-gray-600 mb-4">Access advanced therapy equipment without capital investment. Pay only for usage.</p>
      
      {payPerUseEquipment.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {payPerUseEquipment.slice(0, 3).map(equipment => (
            <div key={equipment.id} className="border rounded-lg p-4 bg-white shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{equipment.name}</h3>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Zap className="w-3 h-3 mr-1" />
                  Pay Per Use
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mb-2">Usage-based payment model</p>
              <p className="text-xs text-gray-500 mb-3">No upfront costs, immediate access</p>
              <div className="flex justify-between items-center mt-4">
                <span className="font-medium text-red-600">
                  Ksh {equipment.payPerUsePrice?.toLocaleString() || equipment.pricePerUse}/day
                </span>
                <Button size="sm" variant="outline">Learn More</Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Zap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>No Pay Per Use equipment available at the moment.</p>
          <p className="text-sm">Check back later for new options.</p>
        </div>
      )}
    </div>
  );
};

export default TherapyTabContent;
