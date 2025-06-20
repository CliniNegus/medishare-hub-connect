
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCardIcon } from "lucide-react";
import { TransactionFormData } from './types';

interface PaymentInformationSectionProps {
  formData: TransactionFormData;
  setFormData: (data: TransactionFormData) => void;
}

const PaymentInformationSection: React.FC<PaymentInformationSectionProps> = ({
  formData,
  setFormData
}) => {
  return (
    <Card className="border-blue-200/50 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50/50 to-transparent border-b border-blue-200/30 pb-3">
        <CardTitle className="text-lg font-semibold text-[#333333] flex items-center">
          <CreditCardIcon className="h-5 w-5 mr-2 text-blue-600" />
          Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="payment_method" className="text-sm font-medium text-gray-700">Payment Method</Label>
            <Input
              id="payment_method"
              value={formData.payment_method}
              onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
              className="mt-1 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
              placeholder="e.g., Card, Bank Transfer, Cash"
            />
          </div>

          <div>
            <Label htmlFor="channel" className="text-sm font-medium text-gray-700">Payment Channel</Label>
            <Input
              id="channel"
              value={formData.channel}
              onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
              className="mt-1 border-gray-200 focus:border-blue-400 focus:ring-blue-400"
              placeholder="e.g., web, mobile, pos"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentInformationSection;
