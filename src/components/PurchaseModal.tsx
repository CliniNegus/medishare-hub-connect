
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
import { DollarSign, MapPin, ShoppingCart, CreditCard, User, Phone, Mail } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import PaystackPaymentButton from './payment/PaystackPaymentButton';

interface PurchaseModalProps {
  isOpen: boolean;
  equipmentName: string;
  equipmentPrice: number;
  equipmentId: string;
  onClose: () => void;
  onConfirm: (paymentMethod: string, shippingAddress: string, notes: string, shippingInfo: ShippingInfo) => void;
  location?: string;
  manufacturer?: string;
}

interface ShippingInfo {
  fullName: string;
  phoneNumber: string;
  email: string;
  street: string;
  city: string;
  country: string;
  zipCode: string;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  equipmentName,
  equipmentPrice,
  equipmentId,
  onClose,
  onConfirm,
  location = "Not specified",
  manufacturer = "Not specified"
}) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("paystack");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  
  // Shipping information state
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [zipCode, setZipCode] = useState("");
  
  const { user } = useAuth();
  const { toast } = useToast();
  
  const handlePaystackSuccess = (reference: string) => {
    toast({
      title: "Payment Initiated",
      description: "You will be redirected to complete your payment",
    });
    
    const shippingInfo: ShippingInfo = {
      fullName,
      phoneNumber,
      email,
      street,
      city,
      country,
      zipCode
    };
    
    const fullShippingAddress = `${street}, ${city}, ${country} ${zipCode}`.trim();
    onConfirm(paymentMethod, fullShippingAddress, notes, shippingInfo);
    onClose();
  };

  const handlePaystackError = (error: string) => {
    toast({
      title: "Payment Error",
      description: error,
      variant: "destructive",
    });
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
                    <span className="text-lg font-bold">KES {equipmentPrice?.toLocaleString()}</span>
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
                Details
              </TabsTrigger>
              <TabsTrigger value="shipping" className="flex-1">
                <User className="mr-2 h-4 w-4" />
                Shipping
              </TabsTrigger>
              <TabsTrigger value="payment" className="flex-1">
                <CreditCard className="mr-2 h-4 w-4" />
                Payment
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4 mt-2">
              <div className="space-y-4">
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
                  onClick={() => setActiveTab("shipping")}
                >
                  Continue to Shipping
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="space-y-4 mt-2">
              <div className="space-y-4">
                <h3 className="font-medium text-[#333333]">Shipping Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full-name" className="text-[#333333] font-medium">Full Name *</Label>
                    <Input
                      id="full-name"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="border-gray-300 bg-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[#333333] font-medium">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="e.g., +254700000000"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="border-gray-300 bg-white"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#333333] font-medium">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-gray-300 bg-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="street" className="text-[#333333] font-medium">Street Address *</Label>
                  <Input
                    id="street"
                    placeholder="Enter street address"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="border-gray-300 bg-white"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-[#333333] font-medium">City *</Label>
                    <Input
                      id="city"
                      placeholder="Enter city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="border-gray-300 bg-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-[#333333] font-medium">Country *</Label>
                    <Input
                      id="country"
                      placeholder="Enter country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="border-gray-300 bg-white"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="zip-code" className="text-[#333333] font-medium">ZIP Code</Label>
                  <Input
                    id="zip-code"
                    placeholder="Enter ZIP code (optional)"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="border-gray-300 bg-white"
                  />
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
                    onClick={() => setActiveTab("payment")}
                    disabled={!fullName.trim() || !phoneNumber.trim() || !email.trim() || !street.trim() || !city.trim() || !country.trim()}
                  >
                    Continue to Payment
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="payment" className="space-y-4 mt-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[#333333] font-medium">Payment Method</Label>
                  <div className="grid grid-cols-1 gap-2">
                    <div
                      className={`flex items-center p-3 border rounded-md cursor-pointer ${
                        paymentMethod === "paystack" ? "border-[#E02020] bg-red-50" : "border-gray-200"
                      }`}
                      onClick={() => setPaymentMethod("paystack")}
                    >
                      <div className="bg-[#E0202010] p-2 rounded-full mr-3">
                        <CreditCard className="h-4 w-4 text-[#E02020]" />
                      </div>
                      <div>
                        <div className="font-medium">Paystack</div>
                        <div className="text-sm text-gray-500">Secure payment with Visa, Mastercard, Bank Transfer</div>
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
                      <span className="font-medium">KES {equipmentPrice?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-medium">Free</span>
                    </div>
                    <div className="flex justify-between font-bold text-[#E02020]">
                      <span>Total price:</span>
                      <span>KES {equipmentPrice?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1" 
                    onClick={() => setActiveTab("shipping")}
                  >
                    Back
                  </Button>
                  
                  <PaystackPaymentButton
                    amount={equipmentPrice}
                    equipmentId={equipmentId}
                    equipmentName={equipmentName}
                    shippingAddress={`${street}, ${city}, ${country} ${zipCode}`.trim()}
                    notes={notes}
                    fullName={fullName}
                    phoneNumber={phoneNumber}
                    email={email}
                    street={street}
                    city={city}
                    country={country}
                    zipCode={zipCode}
                    onSuccess={handlePaystackSuccess}
                    onError={handlePaystackError}
                    className="flex-1"
                  >
                    Complete Purchase
                  </PaystackPaymentButton>
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
