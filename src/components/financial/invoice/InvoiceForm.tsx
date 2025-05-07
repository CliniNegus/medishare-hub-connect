
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, DollarSign } from "lucide-react";

interface InvoiceFormProps {
  invoiceDate: string;
  setInvoiceDate: (date: string) => void;
  dueDate: string;
  setDueDate: (date: string) => void;
  taxRate: number;
  setTaxRate: (rate: number) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  customerEmail: string;
  setCustomerEmail: (email: string) => void;
  customerAddress: string;
  setCustomerAddress: (address: string) => void;
  notes: string;
  setNotes: (notes: string) => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  invoiceDate,
  setInvoiceDate,
  dueDate,
  setDueDate,
  taxRate,
  setTaxRate,
  customerName,
  setCustomerName,
  customerEmail,
  setCustomerEmail,
  customerAddress,
  setCustomerAddress,
  notes,
  setNotes
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="invoice-date">Invoice Date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
              id="invoice-date" 
              type="date" 
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="due-date">Due Date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
              id="due-date" 
              type="date" 
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="tax-rate">Tax Rate (%)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input 
              id="tax-rate" 
              type="number" 
              value={taxRate * 100}
              onChange={(e) => setTaxRate(Number(e.target.value) / 100)}
              className="pl-10"
              min="0"
              max="100"
              step="0.1"
            />
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="customer-name">Customer Name</Label>
          <Input 
            id="customer-name" 
            placeholder="Enter customer name" 
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="customer-email">Customer Email</Label>
          <Input 
            id="customer-email" 
            type="email" 
            placeholder="customer@example.com" 
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="customer-address">Customer Address</Label>
          <Textarea 
            id="customer-address" 
            placeholder="Enter customer address" 
            value={customerAddress}
            onChange={(e) => setCustomerAddress(e.target.value)}
            className="h-[76px]"
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
