
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InfoIcon, CalendarIcon } from "lucide-react";
import { Transaction, TransactionFormData } from './types';

interface AdditionalInformationSectionProps {
  transaction: Transaction;
  formData: TransactionFormData;
  setFormData: (data: TransactionFormData) => void;
}

const AdditionalInformationSection: React.FC<AdditionalInformationSectionProps> = ({
  transaction,
  formData,
  setFormData
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardHeader className="bg-gray-50/50 border-b border-gray-200 pb-3">
        <CardTitle className="text-lg font-semibold text-[#333333] flex items-center">
          <InfoIcon className="h-5 w-5 mr-2 text-gray-600" />
          Additional Information
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="notes" className="text-sm font-medium text-gray-700">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="mt-1 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
              placeholder="Add any additional notes about this transaction..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-gray-50 p-3 rounded-lg border">
              <div className="text-xs text-gray-500 flex items-center mb-1">
                <CalendarIcon className="h-3 w-3 mr-1" />
                Created
              </div>
              <div className="text-sm font-medium text-gray-700">
                {formatDate(transaction.created_at)}
              </div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border">
              <div className="text-xs text-gray-500 flex items-center mb-1">
                <CalendarIcon className="h-3 w-3 mr-1" />
                Last Updated
              </div>
              <div className="text-sm font-medium text-gray-700">
                {formatDate(transaction.updated_at)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdditionalInformationSection;
