
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

const EmptyEquipmentState: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-8 sm:p-16 text-center">
        <div className="text-gray-400 mb-4 sm:mb-6">
          <Zap className="h-16 w-16 sm:h-20 sm:w-20 mx-auto" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-[#333333] mb-2 sm:mb-3">No Equipment Found</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto">
          You don't have any equipment registered for tracking yet.
        </p>
        <Button className="bg-[#E02020] hover:bg-[#c01c1c] text-white">
          Add Equipment
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyEquipmentState;
