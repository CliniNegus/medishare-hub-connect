import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

interface ManualRecordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface FormData {
  client_name: string;
  date_range: string;
  opening_balance: string;
  invoiced_amount: string;
  amount_paid: string;
  balance_due: string;
}

interface FormErrors {
  client_name?: string;
  date_range?: string;
  opening_balance?: string;
  invoiced_amount?: string;
  amount_paid?: string;
  balance_due?: string;
}

export const ManualRecordModal: React.FC<ManualRecordModalProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<FormData>({
    client_name: '',
    date_range: '',
    opening_balance: '',
    invoiced_amount: '',
    amount_paid: '',
    balance_due: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required field validation
    if (!formData.client_name.trim()) {
      newErrors.client_name = 'Client name is required';
    }

    if (!formData.date_range.trim()) {
      newErrors.date_range = 'Date range is required';
    }

    // Numeric field validation
    const numericFields = [
      'opening_balance',
      'invoiced_amount', 
      'amount_paid',
      'balance_due'
    ] as const;

    numericFields.forEach(field => {
      const value = formData[field].trim();
      if (!value) {
        newErrors[field] = `${field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} is required`;
      } else if (isNaN(Number(value))) {
        newErrors[field] = 'Must be a valid number';
      } else if (Number(value) < 0) {
        newErrors[field] = 'Must be a positive number';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('customer_statements')
        .insert([{
          client_name: formData.client_name.trim(),
          date_range: formData.date_range.trim(),
          opening_balance: Number(formData.opening_balance),
          invoiced_amount: Number(formData.invoiced_amount),
          amount_paid: Number(formData.amount_paid),
          balance_due: Number(formData.balance_due),
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Customer statement record added successfully",
      });

      // Reset form
      setFormData({
        client_name: '',
        date_range: '',
        opening_balance: '',
        invoiced_amount: '',
        amount_paid: '',
        balance_due: '',
      });
      
      setErrors({});
      onOpenChange(false);
      onSuccess();

    } catch (error) {
      console.error('Error creating record:', error);
      toast({
        title: "Error",
        description: "Failed to create customer statement record",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      client_name: '',
      date_range: '',
      opening_balance: '',
      invoiced_amount: '',
      amount_paid: '',
      balance_due: '',
    });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Add New Customer Statement</DialogTitle>
          <DialogDescription>
            Manually create a new customer statement record. All fields are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4">
            {/* Client Name */}
            <div className="space-y-2">
              <Label htmlFor="client_name" className="text-sm font-medium">
                Client Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="client_name"
                type="text"
                placeholder="Enter client name"
                value={formData.client_name}
                onChange={(e) => handleInputChange('client_name', e.target.value)}
                className={errors.client_name ? 'border-destructive' : ''}
              />
              {errors.client_name && (
                <p className="text-sm text-destructive">{errors.client_name}</p>
              )}
            </div>

            {/* Date Range */}
            <div className="space-y-2">
              <Label htmlFor="date_range" className="text-sm font-medium">
                Date Range <span className="text-destructive">*</span>
              </Label>
              <Input
                id="date_range"
                type="text"
                placeholder="e.g., From 01/01/2024 to 31/01/2024"
                value={formData.date_range}
                onChange={(e) => handleInputChange('date_range', e.target.value)}
                className={errors.date_range ? 'border-destructive' : ''}
              />
              {errors.date_range && (
                <p className="text-sm text-destructive">{errors.date_range}</p>
              )}
            </div>

            {/* Financial Fields Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Opening Balance */}
              <div className="space-y-2">
                <Label htmlFor="opening_balance" className="text-sm font-medium">
                  Opening Balance <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="opening_balance"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.opening_balance}
                  onChange={(e) => handleInputChange('opening_balance', e.target.value)}
                  className={errors.opening_balance ? 'border-destructive' : ''}
                />
                {errors.opening_balance && (
                  <p className="text-sm text-destructive">{errors.opening_balance}</p>
                )}
              </div>

              {/* Invoiced Amount */}
              <div className="space-y-2">
                <Label htmlFor="invoiced_amount" className="text-sm font-medium">
                  Invoiced Amount <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="invoiced_amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.invoiced_amount}
                  onChange={(e) => handleInputChange('invoiced_amount', e.target.value)}
                  className={errors.invoiced_amount ? 'border-destructive' : ''}
                />
                {errors.invoiced_amount && (
                  <p className="text-sm text-destructive">{errors.invoiced_amount}</p>
                )}
              </div>

              {/* Amount Paid */}
              <div className="space-y-2">
                <Label htmlFor="amount_paid" className="text-sm font-medium">
                  Amount Paid <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="amount_paid"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount_paid}
                  onChange={(e) => handleInputChange('amount_paid', e.target.value)}
                  className={errors.amount_paid ? 'border-destructive' : ''}
                />
                {errors.amount_paid && (
                  <p className="text-sm text-destructive">{errors.amount_paid}</p>
                )}
              </div>

              {/* Balance Due */}
              <div className="space-y-2">
                <Label htmlFor="balance_due" className="text-sm font-medium">
                  Balance Due <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="balance_due"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.balance_due}
                  onChange={(e) => handleInputChange('balance_due', e.target.value)}
                  className={errors.balance_due ? 'border-destructive' : ''}
                />
                {errors.balance_due && (
                  <p className="text-sm text-destructive">{errors.balance_due}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-primary hover:bg-primary/90"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Save Record'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};