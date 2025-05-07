
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const InvoiceTemplates: React.FC = () => {
  return (
    <Card className="border-red-200 mt-6">
      <CardHeader className="bg-red-50 border-b border-red-200">
        <CardTitle className="text-red-800">Invoice Templates</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
            <div className="font-medium">Standard Invoice</div>
            <div className="text-sm text-gray-500">Basic invoice template with standard terms</div>
          </div>
          <div className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
            <div className="font-medium">Equipment Rental</div>
            <div className="text-sm text-gray-500">Template for equipment rental invoicing</div>
          </div>
          <div className="p-3 border rounded-md hover:bg-gray-50 cursor-pointer">
            <div className="font-medium">Maintenance Service</div>
            <div className="text-sm text-gray-500">For maintenance and service contracts</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceTemplates;
