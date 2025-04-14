
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calculator, Calendar, CreditCard, DollarSign, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PaymentOptionsDialogProps {
  productType: 'purchase' | 'lease' | 'finance';
  productName: string;
  price: number;
  leaseRate?: number;
  pricePerUse?: number;
  monthlyPayment?: number;
  children: React.ReactNode;
}

const PaymentOptionsDialog: React.FC<PaymentOptionsDialogProps> = ({
  productType,
  productName,
  price,
  leaseRate,
  pricePerUse,
  monthlyPayment,
  children
}) => {
  const { toast } = useToast();
  
  const handlePaymentOption = (option: string) => {
    toast({
      title: "Payment option selected",
      description: `You selected ${option} for ${productName}`,
    });
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{productName}</DialogTitle>
          <DialogDescription>
            {productType === 'purchase' && 'Choose your payment method to complete your purchase.'}
            {productType === 'lease' && 'Choose your leasing options and terms.'}
            {productType === 'finance' && 'Select a financing plan that works for you.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <h3 className="font-medium text-gray-900">Payment Summary</h3>
          
          <div className="mt-2 space-y-2">
            <div className="flex justify-between items-center p-3 rounded-md border border-gray-200">
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 text-green-600 mr-2" />
                <span>Total Price</span>
              </div>
              <span className="font-semibold">${price.toLocaleString()}</span>
            </div>
            
            {productType === 'lease' && leaseRate && (
              <div className="flex justify-between items-center p-3 rounded-md border border-gray-200">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-amber-600 mr-2" />
                  <span>Monthly Lease</span>
                </div>
                <span className="font-semibold">${leaseRate.toLocaleString()}/month</span>
              </div>
            )}
            
            {productType === 'lease' && pricePerUse && (
              <div className="flex justify-between items-center p-3 rounded-md border border-gray-200">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-red-600 mr-2" />
                  <span>Pay Per Use</span>
                </div>
                <span className="font-semibold">${pricePerUse.toLocaleString()}/use</span>
              </div>
            )}
            
            {productType === 'finance' && monthlyPayment && (
              <div className="flex justify-between items-center p-3 rounded-md border border-gray-200">
                <div className="flex items-center">
                  <Calculator className="h-5 w-5 text-purple-600 mr-2" />
                  <span>Monthly Payment</span>
                </div>
                <span className="font-semibold">${monthlyPayment.toLocaleString()}/month</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Payment Options</h3>
          
          {productType === 'purchase' && (
            <div className="grid grid-cols-1 gap-2">
              <Button 
                variant="outline" 
                className="justify-start border-gray-300 hover:bg-gray-50"
                onClick={() => handlePaymentOption('Credit Card')}
              >
                <CreditCard className="h-4 w-4 mr-2 text-blue-600" />
                Credit/Debit Card
              </Button>
              <Button 
                variant="outline" 
                className="justify-start border-gray-300 hover:bg-gray-50"
                onClick={() => handlePaymentOption('Bank Transfer')}
              >
                <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                Bank Transfer
              </Button>
            </div>
          )}
          
          {productType === 'lease' && (
            <div className="grid grid-cols-1 gap-2">
              <Button 
                variant="outline" 
                className="justify-start border-gray-300 hover:bg-gray-50"
                onClick={() => handlePaymentOption('Pay Per Use')}
              >
                <Clock className="h-4 w-4 mr-2 text-red-600" />
                Pay Per Use (${pricePerUse}/use)
              </Button>
              <Button 
                variant="outline" 
                className="justify-start border-gray-300 hover:bg-gray-50"
                onClick={() => handlePaymentOption('12-month lease')}
              >
                <Calendar className="h-4 w-4 mr-2 text-amber-600" />
                12-month lease
              </Button>
              <Button 
                variant="outline" 
                className="justify-start border-gray-300 hover:bg-gray-50"
                onClick={() => handlePaymentOption('24-month lease')}
              >
                <Calendar className="h-4 w-4 mr-2 text-amber-600" />
                24-month lease
              </Button>
              <Button 
                variant="outline" 
                className="justify-start border-gray-300 hover:bg-gray-50"
                onClick={() => handlePaymentOption('36-month lease')}
              >
                <Calendar className="h-4 w-4 mr-2 text-amber-600" />
                36-month lease
              </Button>
            </div>
          )}
          
          {productType === 'finance' && (
            <div className="grid grid-cols-1 gap-2">
              <Button 
                variant="outline" 
                className="justify-start border-gray-300 hover:bg-gray-50"
                onClick={() => handlePaymentOption('12-month financing')}
              >
                <Calculator className="h-4 w-4 mr-2 text-purple-600" />
                12-month financing
              </Button>
              <Button 
                variant="outline" 
                className="justify-start border-gray-300 hover:bg-gray-50"
                onClick={() => handlePaymentOption('24-month financing')}
              >
                <Calculator className="h-4 w-4 mr-2 text-purple-600" />
                24-month financing
              </Button>
              <Button 
                variant="outline" 
                className="justify-start border-gray-300 hover:bg-gray-50"
                onClick={() => handlePaymentOption('36-month financing')}
              >
                <Calculator className="h-4 w-4 mr-2 text-purple-600" />
                36-month financing
              </Button>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
            onClick={() => handlePaymentOption(productType === 'purchase' ? 'Quick Checkout' : productType === 'lease' ? 'Quick Lease Application' : 'Quick Financing Application')}
          >
            {productType === 'purchase' ? 'Proceed to Checkout' : productType === 'lease' ? 'Apply for Leasing' : 'Apply for Financing'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentOptionsDialog;
