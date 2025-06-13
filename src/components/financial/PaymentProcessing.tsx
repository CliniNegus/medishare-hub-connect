
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, Smartphone, Building, CheckCircle, Clock, XCircle, RefreshCw } from "lucide-react";
import { EquipmentProps } from '../EquipmentCard';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useFinancialData } from '@/hooks/useFinancialData';

interface PaymentProcessingProps {
  equipmentData: EquipmentProps[];
}

const PaymentProcessing: React.FC<PaymentProcessingProps> = ({ equipmentData }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { transactions, refreshData } = useFinancialData();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentMethod: '',
    reference: '',
    description: '',
    equipmentId: ''
  });

  const paymentMethods = [
    { id: 'bank_transfer', name: 'Bank Transfer', icon: Building, description: 'Direct bank payment' },
    { id: 'mobile_money', name: 'Mobile Money', icon: Smartphone, description: 'M-Pesa, Airtel Money' },
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setPaymentForm(prev => ({ ...prev, [field]: value }));
  };

  const generateReference = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `PAY-${timestamp}-${random}`;
  };

  const processPayment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to process payments.",
        variant: "destructive",
      });
      return;
    }

    if (!paymentForm.amount || !paymentForm.paymentMethod) {
      toast({
        title: "Missing Information",
        description: "Please fill in amount and payment method.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const reference = paymentForm.reference || generateReference();
      
      // Create transaction record
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          reference: reference,
          amount: parseFloat(paymentForm.amount),
          currency: 'KES',
          status: 'pending',
          metadata: {
            payment_method: paymentForm.paymentMethod,
            description: paymentForm.description,
            equipment_id: paymentForm.equipmentId || null
          }
        });

      if (error) throw error;

      // Simulate payment processing
      setTimeout(async () => {
        // Update transaction status to success
        const { error: updateError } = await supabase
          .from('transactions')
          .update({ status: 'success' })
          .eq('reference', reference);

        if (updateError) {
          console.error('Error updating transaction:', updateError);
        }

        setIsProcessing(false);
        toast({
          title: "Payment Processed",
          description: `Payment of Ksh ${parseFloat(paymentForm.amount).toLocaleString()} has been processed successfully.`,
        });

        // Reset form
        setPaymentForm({
          amount: '',
          paymentMethod: '',
          reference: '',
          description: '',
          equipmentId: ''
        });

        // Refresh data
        refreshData();
      }, 3000);

    } catch (error: any) {
      setIsProcessing(false);
      console.error('Error processing payment:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Payment Form */}
      <Card className="border-[#E02020]/20">
        <CardHeader className="bg-[#E02020]/5 border-b border-[#E02020]/20">
          <CardTitle className="text-[#333333] flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-[#E02020]" />
            Process New Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount (Ksh) *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={paymentForm.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="reference">Reference (Optional)</Label>
              <Input
                id="reference"
                placeholder="Auto-generated if empty"
                value={paymentForm.reference}
                onChange={(e) => handleInputChange('reference', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="paymentMethod">Payment Method *</Label>
            <Select value={paymentForm.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.id} value={method.id}>
                    <div className="flex items-center">
                      <method.icon className="h-4 w-4 mr-2" />
                      <div>
                        <div className="font-medium">{method.name}</div>
                        <div className="text-xs text-gray-500">{method.description}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="equipment">Related Equipment (Optional)</Label>
            <Select value={paymentForm.equipmentId} onValueChange={(value) => handleInputChange('equipmentId', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select equipment" />
              </SelectTrigger>
              <SelectContent>
                {equipmentData.map((equipment) => (
                  <SelectItem key={equipment.id} value={equipment.id}>
                    {equipment.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Payment description or notes"
              value={paymentForm.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>

          <Button 
            className="w-full bg-[#E02020] hover:bg-[#c01c1c]" 
            onClick={processPayment}
            disabled={isProcessing || !paymentForm.amount || !paymentForm.paymentMethod}
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Process Payment
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="border-[#E02020]/20">
        <CardHeader className="bg-[#E02020]/5 border-b border-[#E02020]/20">
          <CardTitle className="text-[#333333]">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CreditCard className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No transactions found</p>
              <p className="text-sm text-gray-400">Processed payments will appear here</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {transactions.slice(0, 10).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    {getStatusIcon(transaction.status)}
                    <div className="ml-3">
                      <p className="font-medium text-[#333333]">{transaction.reference}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.created_at).toLocaleDateString()} • {transaction.currency}
                      </p>
                      {transaction.metadata?.description && (
                        <p className="text-xs text-gray-400 mt-1">{transaction.metadata.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[#E02020]">
                      Ksh {(transaction.amount * (transaction.currency === 'KES' ? 1 : 130)).toLocaleString()}
                    </p>
                    <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>
                      {transaction.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Methods Info */}
      <Card className="border-[#E02020]/20 lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-[#333333]">Available Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {paymentMethods.map((method) => (
              <div key={method.id} className="border rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <method.icon className="h-8 w-8 text-[#E02020] mx-auto mb-2" />
                <h3 className="font-semibold text-[#333333] mb-1">{method.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                <Badge className="bg-green-100 text-green-800">Available</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentProcessing;
