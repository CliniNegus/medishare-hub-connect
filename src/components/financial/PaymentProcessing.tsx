
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Check, Calendar, Lock, DollarSign, User, ClipboardCheck, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { EquipmentProps } from '../EquipmentCard';

interface PaymentProcessingProps {
  equipmentData: EquipmentProps[];
}

interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'bank_transfer' | 'invoice';
  label: string;
  info: string;
  cardNumber?: string;
  expiry?: string;
  cvv?: string;
  name?: string;
}

const PaymentProcessing: React.FC<PaymentProcessingProps> = ({ equipmentData }) => {
  const { toast } = useToast();
  const [selectedEquipment, setSelectedEquipment] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("card_1");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardName, setCardName] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [cvv, setCvv] = useState<string>("");
  const [newCardFormVisible, setNewCardFormVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [saveCard, setSaveCard] = useState<boolean>(false);
  
  // Mock saved payment methods
  const savedPaymentMethods: PaymentMethod[] = [
    { 
      id: 'card_1', 
      type: 'credit_card', 
      label: 'Visa ending in 4242', 
      info: 'Expires 12/25',
      cardNumber: '•••• •••• •••• 4242',
      expiry: '12/25',
      name: 'Hospital Admin'
    },
    { 
      id: 'bank_1', 
      type: 'bank_transfer', 
      label: 'ACH Transfer - Main Account', 
      info: 'Account ending in 9876' 
    },
    { 
      id: 'invoice_1', 
      type: 'invoice', 
      label: 'Monthly Invoice', 
      info: 'Net 30 terms' 
    }
  ];
  
  const handleSubmitPayment = () => {
    if (!selectedEquipment || !amount || (!paymentMethod && !newCardFormVisible)) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (newCardFormVisible && (!cardNumber || !cardName || !expiryDate || !cvv)) {
      toast({
        title: "Missing Card Information",
        description: "Please fill in all card details",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      
      toast({
        title: "Payment Successful",
        description: `Successfully processed payment of $${amount} for ${
          equipmentData.find(eq => eq.id === selectedEquipment)?.name || "equipment"
        }`,
      });
      
      if (newCardFormVisible && saveCard) {
        toast({
          title: "Card Saved",
          description: "Your payment method has been saved for future use",
        });
      }
      
      // Reset form
      setAmount("");
      if (newCardFormVisible) {
        setCardNumber("");
        setCardName("");
        setExpiryDate("");
        setCvv("");
        setNewCardFormVisible(false);
      }
    }, 2000);
  };
  
  const formatCardNumber = (input: string) => {
    // Remove non-digits
    const digitsOnly = input.replace(/\D/g, '');
    
    // Add spaces every 4 digits
    const formatted = digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 ');
    
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.slice(0, 19);
  };
  
  const formatExpiryDate = (input: string) => {
    // Remove non-digits
    const digitsOnly = input.replace(/\D/g, '');
    
    // Format as MM/YY
    if (digitsOnly.length > 2) {
      return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}`;
    }
    
    return digitsOnly;
  };
  
  const getEquipmentAmount = () => {
    const equipment = equipmentData.find(eq => eq.id === selectedEquipment);
    if (!equipment) return "";
    
    // Use pricePerUse * 100 as a mock price
    return (equipment.pricePerUse * 100).toFixed(2);
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="border-red-200">
          <CardHeader className="bg-red-50 border-b border-red-200">
            <CardTitle className="text-red-800">Process a Payment</CardTitle>
            <CardDescription>
              Enter payment details to process a transaction
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="equipment">Equipment</Label>
                  <Select 
                    value={selectedEquipment} 
                    onValueChange={(value) => {
                      setSelectedEquipment(value);
                      setAmount(getEquipmentAmount());
                    }}
                  >
                    <SelectTrigger id="equipment">
                      <SelectValue placeholder="Select equipment" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipmentData.map(equipment => (
                        <SelectItem key={equipment.id} value={equipment.id}>
                          {equipment.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                    <Input 
                      id="amount" 
                      placeholder="0.00" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Payment Description</Label>
                  <Input 
                    id="description" 
                    placeholder="e.g. Equipment rental payment"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Payment Method</Label>
                  <div className="space-y-3 mt-2">
                    {!newCardFormVisible && savedPaymentMethods.map(method => (
                      <div 
                        key={method.id}
                        className={`p-3 border rounded-md ${
                          paymentMethod === method.id ? 'border-red-400 bg-red-50' : 'border-gray-200'
                        } cursor-pointer`}
                        onClick={() => setPaymentMethod(method.id)}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            {method.type === 'credit_card' ? (
                              <CreditCard className="h-5 w-5 text-red-600" />
                            ) : method.type === 'bank_transfer' ? (
                              <DollarSign className="h-5 w-5 text-red-600" />
                            ) : (
                              <FileText className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="font-medium">{method.label}</div>
                            <div className="text-xs text-gray-500">{method.info}</div>
                          </div>
                          {paymentMethod === method.id && (
                            <Check className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                      </div>
                    ))}
                    
                    {!newCardFormVisible && (
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-dashed border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => {
                          setNewCardFormVisible(true);
                          setPaymentMethod('');
                        }}
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Add new payment method
                      </Button>
                    )}
                    
                    {newCardFormVisible && (
                      <div className="border border-red-200 rounded-md p-4 bg-red-50">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium text-red-800">New Credit Card</h4>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 px-2 text-gray-500"
                            onClick={() => {
                              setNewCardFormVisible(false);
                              setPaymentMethod('card_1');
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="card-number">Card Number</Label>
                            <div className="relative">
                              <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                              <Input 
                                id="card-number" 
                                placeholder="0000 0000 0000 0000" 
                                value={cardNumber}
                                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                className="pl-10"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <Label htmlFor="card-name">Cardholder Name</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                              <Input 
                                id="card-name" 
                                placeholder="Name on card" 
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                                className="pl-10"
                              />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="expiry">Expiry Date</Label>
                              <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input 
                                  id="expiry" 
                                  placeholder="MM/YY" 
                                  value={expiryDate}
                                  onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                                  className="pl-10"
                                  maxLength={5}
                                />
                              </div>
                            </div>
                            
                            <div>
                              <Label htmlFor="cvv">CVV</Label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <Input 
                                  id="cvv" 
                                  type="password" 
                                  placeholder="123" 
                                  value={cvv}
                                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                  className="pl-10"
                                  maxLength={4}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 pt-2">
                            <input
                              type="checkbox"
                              id="save-card"
                              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                              checked={saveCard}
                              onChange={() => setSaveCard(!saveCard)}
                            />
                            <Label htmlFor="save-card" className="text-sm">Save this card for future payments</Label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleSubmitPayment}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Process Payment
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <Card className="border-red-200">
          <CardHeader className="bg-red-50 border-b border-red-200">
            <CardTitle className="text-red-800">Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {selectedEquipment ? (
              <>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Equipment</h4>
                  <p className="font-medium">
                    {equipmentData.find(eq => eq.id === selectedEquipment)?.name || "Selected Equipment"}
                  </p>
                </div>
                
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Subtotal</span>
                    <span>{amount ? `$${parseFloat(amount).toFixed(2)}` : '-'}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm">Tax</span>
                    <span>{amount ? `$${(parseFloat(amount) * 0.07).toFixed(2)}` : '-'}</span>
                  </div>
                  <div className="flex justify-between items-center font-medium pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span className="text-red-600">
                      {amount ? `$${(parseFloat(amount) * 1.07).toFixed(2)}` : '-'}
                    </span>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Payment Method</h4>
                  {paymentMethod ? (
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-red-600" />
                      <span>
                        {savedPaymentMethods.find(m => m.id === paymentMethod)?.label || "Selected Method"}
                      </span>
                    </div>
                  ) : newCardFormVisible ? (
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-2 text-red-600" />
                      <span>New Credit Card</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">No payment method selected</span>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Select equipment to see payment summary
              </div>
            )}
            
            <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-4">
              <div className="flex items-start">
                <ClipboardCheck className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                <div className="text-sm text-green-700">
                  This payment will be securely processed. Your payment information is encrypted and protected.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentProcessing;
