
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  InfoIcon,
  UserIcon,
  HashIcon,
  DollarSignIcon,
  CreditCardIcon
} from "lucide-react";
import { TransactionFormData } from './types';

interface TransactionDetailsSectionProps {
  formData: TransactionFormData;
  setFormData: (data: TransactionFormData) => void;
}

const TransactionDetailsSection: React.FC<TransactionDetailsSectionProps> = ({
  formData,
  setFormData
}) => {
  return (
    <Card className="border-[#E02020]/20 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-[#E02020]/5 to-transparent border-b border-[#E02020]/10 pb-3">
        <CardTitle className="text-lg font-semibold text-[#333333] flex items-center">
          <InfoIcon className="h-5 w-5 mr-2 text-[#E02020]" />
          Transaction Details
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="reference" className="text-sm font-medium text-gray-700 flex items-center">
              <HashIcon className="h-4 w-4 mr-1" />
              Transaction Reference*
            </Label>
            <Input
              id="reference"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              className="mt-1 border-gray-200 focus:border-[#E02020] focus:ring-[#E02020]"
              required
            />
          </div>

          <div>
            <Label htmlFor="user_id" className="text-sm font-medium text-gray-700 flex items-center">
              <UserIcon className="h-4 w-4 mr-1" />
              User ID*
            </Label>
            <Input
              id="user_id"
              value={formData.user_id}
              onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
              className="mt-1 border-gray-200 focus:border-[#E02020] focus:ring-[#E02020]"
              required
            />
          </div>

          <div>
            <Label htmlFor="amount" className="text-sm font-medium text-gray-700 flex items-center">
              <DollarSignIcon className="h-4 w-4 mr-1" />
              Amount*
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="mt-1 border-gray-200 focus:border-[#E02020] focus:ring-[#E02020]"
              required
            />
          </div>

          <div>
            <Label htmlFor="currency" className="text-sm font-medium text-gray-700">Currency</Label>
            <Select 
              value={formData.currency} 
              onValueChange={(value) => setFormData({ ...formData, currency: value })}
            >
              <SelectTrigger className="mt-1 border-gray-200 focus:border-[#E02020] focus:ring-[#E02020]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="NGN">NGN</SelectItem>
                <SelectItem value="KES">KES</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status" className="text-sm font-medium text-gray-700">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger className="mt-1 border-gray-200 focus:border-[#E02020] focus:ring-[#E02020]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="paystack_reference" className="text-sm font-medium text-gray-700 flex items-center">
              <CreditCardIcon className="h-4 w-4 mr-1" />
              Paystack Reference
            </Label>
            <Input
              id="paystack_reference"
              value={formData.paystack_reference}
              onChange={(e) => setFormData({ ...formData, paystack_reference: e.target.value })}
              className="mt-1 border-gray-200 focus:border-[#E02020] focus:ring-[#E02020]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionDetailsSection;
