
import React, { useState } from 'react';
import { EquipmentProps } from '../EquipmentCard';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CreditCard, FileText, Download, DollarSign } from "lucide-react";
import PaymentProcessing from '../financial/PaymentProcessing';
import FinancialReporting from '../financial/reporting/FinancialReporting';
import InvoiceGeneration from '../financial/InvoiceGeneration';

interface FinancingTabContentProps {
  equipmentData: EquipmentProps[];
}

const FinancingTabContent: React.FC<FinancingTabContentProps> = ({ equipmentData }) => {
  const [activeFinanceTab, setActiveFinanceTab] = useState("payment");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-red-600">Financial Management</h2>
          <p className="text-gray-600">Manage payments, invoices, and financial reports</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
          <Button className="bg-red-600 hover:bg-red-700">
            <CreditCard className="h-4 w-4 mr-2" />
            Manage Payments
          </Button>
        </div>
      </div>

      <Tabs value={activeFinanceTab} onValueChange={setActiveFinanceTab} className="w-full">
        <TabsList className="bg-white border border-gray-200">
          <TabsTrigger value="payment" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment Processing
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            <DollarSign className="h-4 w-4 mr-2" />
            Financial Reports
          </TabsTrigger>
          <TabsTrigger value="invoices" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            <FileText className="h-4 w-4 mr-2" />
            Invoice Generation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="payment" className="mt-4 shadow-sm rounded-lg">
          <PaymentProcessing equipmentData={equipmentData} />
        </TabsContent>

        <TabsContent value="reports" className="mt-4 shadow-sm rounded-lg">
          <FinancialReporting />
        </TabsContent>

        <TabsContent value="invoices" className="mt-4 shadow-sm rounded-lg">
          <InvoiceGeneration equipmentData={equipmentData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancingTabContent;
