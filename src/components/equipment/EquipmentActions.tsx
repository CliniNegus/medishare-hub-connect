
import React from 'react';
import { Clock, ShoppingCart, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EquipmentActionsProps {
  isAvailable: boolean;
  onBook: () => void;
}

const EquipmentActions = ({ isAvailable, onBook }: EquipmentActionsProps) => {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
      {isAvailable ? (
        <>
          <Button 
            className="bg-red-600 hover:bg-red-700"
            onClick={onBook}
          >
            <Clock className="h-4 w-4 mr-2" />
            Book for Use
          </Button>
          <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Purchase
          </Button>
          <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
            <Calculator className="h-4 w-4 mr-2" />
            Finance
          </Button>
        </>
      ) : (
        <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
          <Clock className="h-4 w-4 mr-2" />
          Check Availability
        </Button>
      )}
    </div>
  );
};

export default EquipmentActions;
