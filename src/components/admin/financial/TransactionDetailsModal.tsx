
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, DollarSignIcon, HashIcon, CreditCardIcon } from "lucide-react";

interface Transaction {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  paystack_reference?: string;
  created_at: string;
  metadata?: any;
}

interface TransactionDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
}

const TransactionDetailsModal: React.FC<TransactionDetailsModalProps> = ({
  open,
  onOpenChange,
  transaction
}) => {
  if (!transaction) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#333333]">Transaction Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <HashIcon className="h-4 w-4 mr-1" />
                Transaction ID
              </div>
              <p className="font-medium">{transaction.id}</p>
            </div>
            <div>
              <div className="flex items-center text-sm text-gray-500 mb-1">
                Status
              </div>
              <Badge className={getStatusColor(transaction.status)}>
                {transaction.status.toUpperCase()}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <DollarSignIcon className="h-4 w-4 mr-1" />
                Amount
              </div>
              <p className="font-medium text-lg">
                {transaction.amount.toLocaleString()} {transaction.currency}
              </p>
            </div>
            <div>
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Date
              </div>
              <p className="font-medium">
                {new Date(transaction.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-1">Reference</div>
            <p className="font-medium">{transaction.reference}</p>
          </div>

          {transaction.paystack_reference && (
            <div>
              <div className="flex items-center text-sm text-gray-500 mb-1">
                <CreditCardIcon className="h-4 w-4 mr-1" />
                Paystack Reference
              </div>
              <p className="font-medium">{transaction.paystack_reference}</p>
            </div>
          )}

          {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
            <div>
              <div className="text-sm text-gray-500 mb-1">Metadata</div>
              <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">
                {JSON.stringify(transaction.metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailsModal;
