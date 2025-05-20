
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { DollarSign, MapPin, ShoppingCart, CreditCard } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/integrations/supabase/client';

interface PurchaseModalProps {
  isOpen: boolean;
  equipmentName: string;
  equipmentPrice: number;
  onClose: () => void;
  onConfirm: (paymentMethod: string, shippingAddress: string, notes: string) => void;
  location?: string;
  manufacturer?: string;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  equipmentName,
  equipmentPrice,
  onClose,
  onConfirm,
  location = "Not specified",
  manufacturer = "Not specified"
}) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("credit-card");
  const [shippingAddress, setShippingAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handleConfirm = () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to purchase equipment",
        variant: "destructive",
      });
      return;
    }
    
    if (!shippingAddress) {
      toast({
        title: "Shipping address required",
        description: "Please enter a shipping address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      onConfirm(paymentMethod, shippingAddress, notes);
      // Reset form values
      setPaymentMethod("credit-card");
      setShippingAddress("");
      setNotes("");
    } catch (error) {
      console.error('Error during purchase confirmation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDialogClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl text-[#333333] flex items-center">
            <span className="text-[#E02020] font-bold">Purchase</span>
            <span className="ml-2">{equipmentName}</span>
          </DialogTitle>
          <DialogDescription>
            Complete your purchase of this medical equipment
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {/* Equipment Information Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="bg-[#E0202010] p-2 rounded-full">
                <MapPin className="h-5 w-5 text-[#E02020]" />
              </div>
              <div>
                <h4 className="font-medium text-[#333333]">Equipment Details</h4>
                <div className="mt-1 space-y-1">
                  <p className="text-sm text-gray-600">Made by <span className="font-medium">{manufacturer}</span></p>
                  <p className="text-sm text-gray-600">Located at <span className="font-medium">{location}</span></p>
                  <div className="flex items-center mt-2">
                    <DollarSign className="h-4 w-4 text-[#E02020] mr-1" />
                    <span className="text-lg font-bold">${equipmentPrice?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Purchase Form */}
          <Tabs 
            defaultValue="details" 
            value={activeTab}
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="w-full mb-4">
              <TabsTrigger value="details" className="flex-1">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Purchase Details
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex-1">
                <CreditCard className="mr-2 h-4 w-4" />
                Payment
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 mt-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shipping-address" className="text-[#333333] font-medium">Shipping Address</Label>
                  <Textarea
                    id="shipping-address"
                    placeholder="Enter your full shipping address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="min-h-[100px] border-gray-300 bg-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-[#333333] font-medium">Special Requirements or Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any special requirements or additional information"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[100px] border-gray-300 bg-white"
                  />
                </div>
                
                <Button 
                  type="button" 
                  className="w-full mt-4 bg-[#E02020] hover:bg-[#c01010]"
                  onClick={() => setActiveTab("payment")}
                >
                  Continue to Payment
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="payment" className="space-y-4 mt-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[#333333] font-medium">Payment Method</Label>
                  <div className="grid grid-cols-1 gap-2">
                    <div
                      className={`flex items-center p-3 border rounded-md cursor-pointer ${
                        paymentMethod === "credit-card" ? "border-[#E02020] bg-red-50" : "border-gray-200"
                      }`}
                      onClick={() => setPaymentMethod("credit-card")}
                    >
                      <div className="bg-[#E0202010] p-2 rounded-full mr-3">
                        <CreditCard className="h-4 w-4 text-[#E02020]" />
                      </div>
                      <div>
                        <div className="font-medium">Credit/Debit Card</div>
                        <div className="text-sm text-gray-500">Visa, Mastercard, AMEX</div>
                      </div>
                    </div>
                    
                    <div
                      className={`flex items-center p-3 border rounded-md cursor-pointer ${
                        paymentMethod === "bank-transfer" ? "border-[#E02020] bg-red-50" : "border-gray-200"
                      }`}
                      onClick={() => setPaymentMethod("bank-transfer")}
                    >
                      <div className="bg-[#E0202010] p-2 rounded-full mr-3">
                        <DollarSign className="h-4 w-4 text-[#E02020]" />
                      </div>
                      <div>
                        <div className="font-medium">Bank Transfer</div>
                        <div className="text-sm text-gray-500">Direct bank payment</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mt-6">
                  <h3 className="font-medium text-[#333333] mb-3">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Equipment:</span>
                      <span className="font-medium">{equipmentName}</span>
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Equipment Price:</span>
                      <span className="font-medium">${equipmentPrice?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-medium">Free</span>
                    </div>
                    <div className="flex justify-between font-bold text-[#E02020]">
                      <span>Total price:</span>
                      <span>${equipmentPrice?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => setActiveTab("details")}
                  >
                    Back
                  </Button>
                  <Button 
                    className="flex-1 bg-[#E02020] hover:bg-[#c01010]"
                    onClick={handleConfirm}
                    disabled={!shippingAddress || isSubmitting}
                  >
                    {isSubmitting ? "Processing..." : "Complete Purchase"}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseModal;
