
import React from 'react';
import { DollarSign, Calculator, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface EquipmentPricingProps {
  price?: number | null;
  leaseRate?: number | null;
  perUsePrice: number;
}

const EquipmentPricing = ({ price, leaseRate, perUsePrice }: EquipmentPricingProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1">Purchase Price</span>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 mr-1 text-red-500" />
              <span className="text-xl font-bold">${price?.toLocaleString() || 'N/A'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1">Monthly Lease Rate</span>
            <div className="flex items-center">
              <Calculator className="h-5 w-5 mr-1 text-red-500" />
              <span className="text-xl font-bold">${leaseRate?.toLocaleString() || 'N/A'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-1">Per Use Price</span>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-1 text-red-500" />
              <span className="text-xl font-bold">${perUsePrice?.toFixed(2) || 'N/A'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipmentPricing;
