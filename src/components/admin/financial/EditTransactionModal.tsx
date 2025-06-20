
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Edit3Icon, 
  DollarSignIcon, 
  CreditCardIcon, 
  InfoIcon,
  UserIcon,
  HashIcon,
  CalendarIcon
} from "lucide-react";

interface Transaction {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  paystack_reference?: string;
  user_id: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

interface EditTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  onTransactionUpdated: () => void;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  open,
  onOpenChange,
  transaction,
  onTransactionUpdated
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reference: '',
    amount: '',
    currency: 'USD',
    status: 'pending',
    paystack_reference: '',
    user_id: '',
    notes: '',
    payment_method: '',
    channel: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    if (transaction) {
      setFormData({
        reference: transaction.reference,
        amount: transaction.amount.toString(),
        currency: transaction.currency,
        status: transaction.status,
        paystack_reference: transaction.paystack_reference || '',
        user_id: transaction.user_id,
        notes: transaction.metadata?.notes || '',
        payment_method: transaction.metadata?.payment_method || '',
        channel: transaction.metadata?.channel || ''
      });
    }
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transaction || !formData.reference || !formData.amount) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          reference: formData.reference,
          amount: parseFloat(formData.amount),
          currency: formData.currency,
          status: formData.status as any,
          paystack_reference: formData.paystack_reference || null,
          user_id: formData.user_id,
          metadata: {
            ...transaction.metadata,
            notes: formData.notes,
            payment_method: formData.payment_method,
            channel: formData.channel
          }
        })
        .eq('id', transaction.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });

      onTransactionUpdated();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error updating transaction:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update transaction",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold text-[#333333] flex items-center">
            <Edit3Icon className="h-6 w-6 mr-3 text-[#E02020]" />
            Edit Transaction
          </DialogTitle>
          <p className="text-sm text-gray-600 mt-1">
            Modify transaction details for #{transaction.reference}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Information Card */}
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

          {/* Payment Information Card */}
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

          {/* Additional Information Card */}
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

          <Separator className="my-4" />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#E02020] hover:bg-[#c01c1c] text-white"
            >
              {loading ? "Updating..." : "Update Transaction"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTransactionModal;
