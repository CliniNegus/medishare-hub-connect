
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Package, CreditCard, MapPin, FileText, DollarSign } from "lucide-react";
import { format } from 'date-fns';

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    equipment_id: string;
    user_id: string;
    amount: number;
    status: string;
    payment_method: string;
    shipping_address: string;
    notes?: string;
    created_at: string;
    updated_at: string;
    equipment?: {
      name: string;
      manufacturer?: string;
    };
  } | null;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ isOpen, onClose, order }) => {
  if (!order) return null;

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP p');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#333333]">
            Order Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#333333]">
                Order #{order.id.slice(0, 8)}...
              </h3>
              <p className="text-sm text-gray-600 flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(order.created_at)}
              </p>
            </div>
            <Badge className={`capitalize ${getStatusColor(order.status)}`}>
              {order.status}
            </Badge>
          </div>

          <Separator />

          {/* Order Items */}
          <div className="space-y-4">
            <h4 className="font-semibold text-[#333333] flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Order Items
            </h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h5 className="font-medium text-[#333333]">
                    {order.equipment?.name || 'Unknown Equipment'}
                  </h5>
                  {order.equipment?.manufacturer && (
                    <p className="text-sm text-gray-600 mt-1">
                      Manufacturer: {order.equipment.manufacturer}
                    </p>
                  )}
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Quantity:</span> 1
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#333333]">
                    Ksh {order.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Unit Price</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Information */}
          <div className="space-y-3">
            <h4 className="font-semibold text-[#333333] flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Payment Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="font-medium text-[#333333] capitalize">
                  {order.payment_method}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="font-semibold text-[#E02020] flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Ksh {order.amount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Delivery Information */}
          {order.shipping_address && (
            <>
              <div className="space-y-3">
                <h4 className="font-semibold text-[#333333] flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Delivery Information
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Shipping Address</p>
                  <p className="font-medium text-[#333333] mt-1">
                    {order.shipping_address}
                  </p>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Order Notes */}
          {order.notes && (
            <>
              <div className="space-y-3">
                <h4 className="font-semibold text-[#333333] flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Order Notes
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-[#333333]">{order.notes}</p>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Order Timeline */}
          <div className="space-y-3">
            <h4 className="font-semibold text-[#333333]">Order Timeline</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Order Created</span>
                <span className="text-sm font-medium text-[#333333]">
                  {formatDate(order.created_at)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm font-medium text-[#333333]">
                  {formatDate(order.updated_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-[#E02020]/5 border border-[#E02020]/20 rounded-lg p-4">
            <h4 className="font-semibold text-[#333333] mb-3">Order Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-[#333333]">Ksh {order.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="text-[#333333]">Ksh 0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-[#333333]">Ksh 0.00</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span className="text-[#333333]">Total</span>
                <span className="text-[#E02020]">Ksh {order.amount.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
