
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
import { CreditCard, DollarSign, FileText, User, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentName: string;
  price: number;
  location?: string;
  onConfirmPurchase: () => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({
  isOpen,
  onClose,
  equipmentName,
  price,
  location,
  onConfirmPurchase
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatCardNumber = (value: string) => {
    // Remove non-digits
    const digitsOnly = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    return digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = formatCardNumber(e.target.value);
    handleInputChange(e);
  };

  const formatExpiryDate = (value: string) => {
    // Remove non-digits
    const digitsOnly = value.replace(/\D/g, '');
    // Format as MM/YY
    if (digitsOnly.length > 2) {
      return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}`;
    }
    return digitsOnly;
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = formatExpiryDate(e.target.value);
    handleInputChange(e);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.fullName || !formData.email || !formData.cardNumber || 
        !formData.expiryDate || !formData.cvv) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate processing
    setTimeout(() => {
      onConfirmPurchase();
      setIsSubmitting(false);
      setFormData({
        fullName: "",
        email: "",
        address: "",
        city: "",
        zipCode: "",
        cardNumber: "",
        expiryDate: "",
        cvv: ""
      });
      
      toast({
        title: "Purchase successful!",
        description: `You have successfully purchased ${equipmentName}`,
      });
      
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl">
            <span className="text-[#E02020] font-bold">Purchase</span>
            <span className="ml-2">{equipmentName}</span>
          </DialogTitle>
          <DialogDescription>
            Complete your purchase to own this equipment
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="py-4">
          {/* Equipment Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="bg-[#E0202010] p-2 rounded-full">
                <MapPin className="h-5 w-5 text-[#E02020]" />
              </div>
              <div>
                <h4 className="font-medium text-[#333333]">Equipment Details</h4>
                <div className="mt-1 space-y-1">
                  <p className="text-sm text-gray-600">Located at <span className="font-medium">{location || 'Main Location'}</span></p>
                  <p className="text-sm text-gray-600">
                    Price: <span className="font-medium text-[#E02020]">${price?.toLocaleString() || '0'}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Buyer Information */}
            <div>
              <h3 className="text-lg font-medium mb-4">Buyer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input 
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="pl-10"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Shipping Address</Label>
                  <Input 
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main St"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input 
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="New York"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input 
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      placeholder="10001"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Payment Information */}
            <div>
              <h3 className="text-lg font-medium mb-4">Payment Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input 
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleCardNumberChange}
                      className="pl-10"
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input 
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleExpiryDateChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input 
                      id="cvv"
                      name="cvv"
                      value={formData.cvv}
                      onChange={(e) => {
                        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
                        handleInputChange(e);
                      }}
                      placeholder="123"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h4 className="font-medium text-[#333333] mb-3">Order Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Equipment:</span>
                  <span className="font-medium">{equipmentName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${price?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (7%):</span>
                  <span>${((price || 0) * 0.07).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex justify-between font-bold text-[#E02020]">
                  <span>Total:</span>
                  <span>${((price || 0) * 1.07).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-6 flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-[#E02020] hover:bg-[#c01010] flex-1 sm:flex-none"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Complete Purchase (${((price || 0) * 1.07).toFixed(2)})
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseModal;
