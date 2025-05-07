
import React from 'react';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { FileText, Calendar, Download, Send } from "lucide-react";

export interface Invoice {
  id: string;
  date: Date;
  dueDate: Date;
  customer: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  items: {
    id: number;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  notes: string;
}

interface RecentInvoicesProps {
  recentInvoices: Invoice[];
}

const RecentInvoices: React.FC<RecentInvoicesProps> = ({ recentInvoices }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border-red-200">
      <CardHeader className="bg-red-50 border-b border-red-200">
        <CardTitle className="text-red-800">Recent Invoices</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableBody>
            {recentInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="p-4">
                  <div className="flex items-start">
                    <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <div className="font-medium">{invoice.id}</div>
                      <div className="text-sm text-gray-500">
                        {invoice.customer}
                      </div>
                      <div className="text-xs text-gray-400 flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(invoice.dueDate, 'PP')}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="font-medium text-red-600">${invoice.total.toFixed(2)}</div>
                  <div className="mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(invoice.status)}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-end space-x-2">
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500">
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500">
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="p-4 border-t">
          <Button 
            variant="outline" 
            className="w-full border-red-200 text-red-600 hover:bg-red-50"
          >
            View All Invoices
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentInvoices;
