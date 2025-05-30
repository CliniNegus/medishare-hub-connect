
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, Calendar, Building, Package } from "lucide-react";
import { format } from 'date-fns';

interface Payment {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  equipment_name?: string;
  hospital_name?: string;
}

interface PaymentsTabProps {
  paymentsReceived: Payment[];
}

const PaymentsTab: React.FC<PaymentsTabProps> = ({ paymentsReceived }) => {
  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'paid':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'overdue':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const totalRevenue = paymentsReceived.reduce((sum, payment) => sum + payment.amount, 0);

  if (paymentsReceived.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <DollarSign className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">No Active Payments</h3>
          <p className="text-gray-500 mb-4">You don't have any active lease payments yet.</p>
          <Button 
            variant="outline"
            className="border-[#E02020] text-[#E02020] hover:bg-[#E02020] hover:text-white"
          >
            View All Equipment
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#333333]">Payment Overview</h3>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Total Monthly Revenue: <span className="font-semibold text-[#E02020]">${totalRevenue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {paymentsReceived.map((payment) => (
          <Card key={payment.id} className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium text-[#333333]">
                  ${payment.amount.toLocaleString()}/month
                </CardTitle>
                <Badge className={getStatusBadgeColor(payment.status)}>
                  {payment.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {payment.equipment_name && (
                  <div className="flex items-center text-sm">
                    <Package className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-600">Equipment:</span>
                    <span className="ml-2 font-medium">{payment.equipment_name}</span>
                  </div>
                )}
                {payment.hospital_name && (
                  <div className="flex items-center text-sm">
                    <Building className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-gray-600">Hospital:</span>
                    <span className="ml-2 font-medium">{payment.hospital_name}</span>
                  </div>
                )}
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-gray-600">Started:</span>
                  <span className="ml-2 font-medium">
                    {format(new Date(payment.created_at), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PaymentsTab;
