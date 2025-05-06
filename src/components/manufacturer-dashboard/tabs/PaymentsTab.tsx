
import React from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileSpreadsheet, Calendar } from "lucide-react";

interface PaymentReceived {
  id: string;
  date: string;
  hospital: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  equipment: string;
}

interface PaymentsTabProps {
  paymentsReceived: PaymentReceived[];
}

const PaymentsTab = ({ paymentsReceived }: PaymentsTabProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Payments Received</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Hospital</TableHead>
            <TableHead>Equipment</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paymentsReceived.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">{payment.id}</TableCell>
              <TableCell>{payment.date}</TableCell>
              <TableCell>{payment.hospital}</TableCell>
              <TableCell>{payment.equipment}</TableCell>
              <TableCell>${payment.amount.toLocaleString()}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-medium
                  ${payment.status === 'paid' ? 'bg-green-100 text-green-800' : 
                    payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'}`}>
                  {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Details</Button>
                  <Button variant="outline" size="sm">Invoice</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentsTab;
