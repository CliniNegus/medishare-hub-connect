
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Send, Printer } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface InvoiceActionsProps {
  handleCreateInvoice: () => void;
  handleSendInvoice: () => void;
}

const InvoiceActions: React.FC<InvoiceActionsProps> = ({
  handleCreateInvoice,
  handleSendInvoice
}) => {
  return (
    <div className="flex space-x-3">
      <Button 
        className="bg-red-600 hover:bg-red-700 text-white"
        onClick={handleCreateInvoice}
      >
        <FileText className="h-4 w-4 mr-2" />
        Create Invoice
      </Button>
      <Button 
        variant="outline" 
        className="border-red-200 text-red-600 hover:bg-red-50"
        onClick={handleSendInvoice}
      >
        <Send className="h-4 w-4 mr-2" />
        Send Invoice
      </Button>
      <Button 
        variant="outline" 
        className="border-red-200 text-red-600 hover:bg-red-50"
      >
        <Printer className="h-4 w-4 mr-2" />
        Print Preview
      </Button>
    </div>
  );
};

export default InvoiceActions;
