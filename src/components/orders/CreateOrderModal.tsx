
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: (orderData: any) => void;
}

const CreateOrderModal = ({ isOpen, onClose, onOrderCreated }: CreateOrderModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    equipmentName: '',
    customerName: '',
    email: '',
    amount: 0,
    quantity: 1,
    paymentMethod: 'credit_card',
    shippingAddress: '',
    notes: '',
    estimatedDelivery: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create an order.",
          variant: "destructive",
        });
        return;
      }

      const orderData = {
        user_id: user.id,
        amount: formData.amount,
        payment_method: formData.paymentMethod,
        shipping_address: formData.shippingAddress,
        notes: formData.notes,
        status: 'pending'
      };

      const { data, error } = await supabase.functions.invoke('create-order', {
        body: orderData
      });

      if (error) throw error;

      const createdOrder = data?.[0];
      
      // Prepare data for email confirmation
      const emailData = {
        id: createdOrder?.id,
        equipmentName: formData.equipmentName,
        customerName: formData.customerName,
        email: formData.email,
        amount: formData.amount,
        quantity: formData.quantity,
        shippingAddress: formData.shippingAddress,
        estimatedDelivery: formData.estimatedDelivery
      };

      toast({
        title: "Order created successfully!",
        description: "Your order has been placed and is being processed.",
      });

      // Call the callback with order data
      onOrderCreated(emailData);
      
      // Reset form and close modal
      setFormData({
        equipmentName: '',
        customerName: '',
        email: '',
        amount: 0,
        quantity: 1,
        paymentMethod: 'credit_card',
        shippingAddress: '',
        notes: '',
        estimatedDelivery: ''
      });
      onClose();
    } catch (error: any) {
      console.error('Error creating order:', error);
      toast({
        title: "Error creating order",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="equipmentName">Equipment Name</Label>
              <Input
                id="equipmentName"
                value={formData.equipmentName}
                onChange={(e) => setFormData(prev => ({ ...prev, equipmentName: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Customer Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="amount">Amount (KES)</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={formData.paymentMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="mobile_money">Mobile Money</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="shippingAddress">Shipping Address</Label>
            <Textarea
              id="shippingAddress"
              value={formData.shippingAddress}
              onChange={(e) => setFormData(prev => ({ ...prev, shippingAddress: e.target.value }))}
              required
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="estimatedDelivery">Estimated Delivery Date</Label>
            <Input
              id="estimatedDelivery"
              type="date"
              value={formData.estimatedDelivery}
              onChange={(e) => setFormData(prev => ({ ...prev, estimatedDelivery: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              placeholder="Any special instructions or notes..."
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-[#E02020] hover:bg-[#c01010] text-white"
            >
              {loading ? 'Creating...' : 'Create Order'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrderModal;
