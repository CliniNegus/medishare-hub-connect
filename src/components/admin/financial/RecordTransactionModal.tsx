
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CalendarIcon } from "lucide-react";

interface RecordTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTransactionAdded: () => void;
}

const RecordTransactionModal: React.FC<RecordTransactionModalProps> = ({
  open,
  onOpenChange,
  onTransactionAdded
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reference: '',
    amount: '',
    currency: 'USD',
    paystack_reference: '',
    metadata: {}
  });
  const { toast } = useToast();

  const generateReference = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `TXN-${timestamp}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reference || !formData.amount) {
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
        .insert({
          reference: formData.reference || generateReference(),
          amount: parseFloat(formData.amount),
          currency: formData.currency,
          paystack_reference: formData.paystack_reference || null,
          status: 'success',
          user_id: (await supabase.auth.getUser()).data.user?.id || '',
          metadata: formData.metadata
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction recorded successfully",
      });

      onTransactionAdded();
      onOpenChange(false);
      setFormData({
        reference: '',
        amount: '',
        currency: 'USD',
        paystack_reference: '',
        metadata: {}
      });
    } catch (error: any) {
      console.error('Error recording transaction:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to record transaction",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#333333]">Record New Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="reference">Transaction Reference*</Label>
            <Input
              id="reference"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              placeholder="Enter transaction reference or leave blank to auto-generate"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="amount">Amount*</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              className="mt-1"
              required
            />
          </div>

          <div>
            <Label htmlFor="currency">Currency</Label>
            <Select 
              value={formData.currency} 
              onValueChange={(value) => setFormData({ ...formData, currency: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="NGN">NGN</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="paystack_reference">Paystack Reference (Optional)</Label>
            <Input
              id="paystack_reference"
              value={formData.paystack_reference}
              onChange={(e) => setFormData({ ...formData, paystack_reference: e.target.value })}
              placeholder="Enter Paystack reference if applicable"
              className="mt-1"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary-red"
              disabled={loading}
            >
              {loading ? "Recording..." : "Record Transaction"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RecordTransactionModal;
