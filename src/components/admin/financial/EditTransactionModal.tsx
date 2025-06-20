
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Edit3Icon } from "lucide-react";
import { Transaction, TransactionFormData } from './types';
import TransactionDetailsSection from './TransactionDetailsSection';
import PaymentInformationSection from './PaymentInformationSection';
import AdditionalInformationSection from './AdditionalInformationSection';

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
  const [formData, setFormData] = useState<TransactionFormData>({
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
          <TransactionDetailsSection 
            formData={formData} 
            setFormData={setFormData} 
          />
          
          <PaymentInformationSection 
            formData={formData} 
            setFormData={setFormData} 
          />
          
          <AdditionalInformationSection 
            transaction={transaction}
            formData={formData} 
            setFormData={setFormData} 
          />

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
