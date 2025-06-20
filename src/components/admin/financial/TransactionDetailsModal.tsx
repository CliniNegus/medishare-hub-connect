
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  CalendarIcon, 
  DollarSignIcon, 
  HashIcon, 
  CreditCardIcon, 
  UserIcon,
  ClockIcon,
  InfoIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon
} from "lucide-react";

interface Transaction {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  paystack_reference?: string;
  created_at: string;
  updated_at: string;
  metadata?: any;
  user_id: string;
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
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    if (currency === 'KES') {
      return `Ksh ${amount.toLocaleString()}`;
    }
    return `$${amount.toLocaleString()}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold text-[#333333] flex items-center">
            <InfoIcon className="h-6 w-6 mr-3 text-[#E02020]" />
            Transaction Details
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            Complete information about transaction #{transaction.reference}
          </p>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Transaction Overview Card */}
          <Card className="border-[#E02020]/20 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-[#E02020]/5 to-transparent border-b border-[#E02020]/10 pb-3">
              <CardTitle className="text-lg font-semibold text-[#333333] flex items-center">
                <DollarSignIcon className="h-5 w-5 mr-2 text-[#E02020]" />
                Transaction Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center text-sm font-medium text-gray-600 mb-1">
                      <HashIcon className="h-4 w-4 mr-1" />
                      Transaction ID
                    </div>
                    <p className="font-mono text-sm bg-gray-50 px-2 py-1 rounded border">
                      {transaction.id}
                    </p>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Reference</div>
                    <p className="font-semibold text-[#333333]">{transaction.reference}</p>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">User ID</div>
                    <p className="font-mono text-sm bg-gray-50 px-2 py-1 rounded border">
                      {transaction.user_id}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center text-sm font-medium text-gray-600 mb-1">
                      <DollarSignIcon className="h-4 w-4 mr-1" />
                      Amount
                    </div>
                    <p className="text-2xl font-bold text-[#E02020]">
                      {formatAmount(transaction.amount, transaction.currency)}
                    </p>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Status</div>
                    <Badge className={`${getStatusColor(transaction.status)} font-medium px-3 py-1`}>
                      {transaction.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Currency</div>
                    <Badge variant="outline" className="font-medium border-gray-200 text-gray-700">
                      {transaction.currency}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information Card */}
          {transaction.paystack_reference && (
            <Card className="border-blue-200/50 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50/50 to-transparent border-b border-blue-200/30 pb-3">
                <CardTitle className="text-lg font-semibold text-[#333333] flex items-center">
                  <CreditCardIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center text-sm font-medium text-gray-600 mb-1">
                      <CreditCardIcon className="h-4 w-4 mr-1" />
                      Paystack Reference
                    </div>
                    <p className="font-mono text-sm bg-blue-50 px-2 py-1 rounded border border-blue-200">
                      {transaction.paystack_reference}
                    </p>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Payment Method</div>
                    <p className="text-sm text-gray-900">
                      {transaction.metadata?.payment_method || 'Online Payment via Paystack'}
                    </p>
                  </div>
                  {transaction.metadata?.channel && (
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">Payment Channel</div>
                      <p className="text-sm text-gray-900 capitalize">
                        {transaction.metadata.channel}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timestamps Card */}
          <Card className="border-green-200/50 shadow-sm">
            <CardHeader className="bg-gradient-to-r from-green-50/50 to-transparent border-b border-green-200/30 pb-3">
              <CardTitle className="text-lg font-semibold text-[#333333] flex items-center">
                <ClockIcon className="h-5 w-5 mr-2 text-green-600" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Created</div>
                    <p className="text-sm text-gray-900">{formatDate(transaction.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">Last Updated</div>
                    <p className="text-sm text-gray-900">{formatDate(transaction.updated_at)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information Card */}
          {transaction.metadata?.customer && (
            <Card className="border-purple-200/50 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-purple-50/50 to-transparent border-b border-purple-200/30 pb-3">
                <CardTitle className="text-lg font-semibold text-[#333333] flex items-center">
                  <UserIcon className="h-5 w-5 mr-2 text-purple-600" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {transaction.metadata.customer.email && (
                    <div className="flex items-center space-x-2">
                      <MailIcon className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-xs text-gray-500">Email</div>
                        <p className="text-sm font-medium">{transaction.metadata.customer.email}</p>
                      </div>
                    </div>
                  )}
                  {transaction.metadata.customer.phone && (
                    <div className="flex items-center space-x-2">
                      <PhoneIcon className="h-4 w-4 text-gray-500" />
                      <div>
                        <div className="text-xs text-gray-500">Phone</div>
                        <p className="text-sm font-medium">{transaction.metadata.customer.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Metadata Card */}
          {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50/50 border-b border-gray-200 pb-3">
                <CardTitle className="text-lg font-semibold text-[#333333] flex items-center">
                  <InfoIcon className="h-5 w-5 mr-2 text-gray-600" />
                  Additional Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-auto max-h-32">
                    {JSON.stringify(transaction.metadata, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <Separator className="my-4" />

        <div className="flex justify-end pt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-gray-200 text-gray-600 hover:border-[#E02020] hover:text-[#E02020] transition-colors"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetailsModal;
