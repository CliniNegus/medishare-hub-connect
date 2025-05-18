
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EquipmentNotFoundProps {
  onBack: () => void;
}

const EquipmentNotFound = ({ onBack }: EquipmentNotFoundProps) => {
  return (
    <>
      <Button variant="ghost" className="mb-6" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-700">Equipment Not Found</h2>
            <p className="mt-2 text-gray-500">The equipment you're looking for doesn't exist or has been removed.</p>
            <Button className="mt-6 bg-red-600 hover:bg-red-700" onClick={onBack}>
              Return to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default EquipmentNotFound;
