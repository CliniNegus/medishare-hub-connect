import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ManufacturerOrder, OrderStatus } from '@/hooks/useManufacturerOrders';
import { 
  Check, X, Package, Truck, CheckCircle2, 
  Clock, Mail, Phone, MapPin, Calendar 
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from '@/components/ui/textarea';

interface ManufacturerOrderCardProps {
  order: ManufacturerOrder;
  onUpdateStatus: (orderId: string, status: OrderStatus, reason?: string) => Promise<any>;
  onRefresh: () => void;
}

export const ManufacturerOrderCard = ({ order, onUpdateStatus, onRefresh }: ManufacturerOrderCardProps) => {
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async (newStatus: OrderStatus, reason?: string) => {
    setIsUpdating(true);
    await onUpdateStatus(order.id, newStatus, reason);
    setIsUpdating(false);
    setShowDeclineDialog(false);
    setDeclineReason('');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Review' },
      accepted: { color: 'bg-green-100 text-green-800', label: 'Accepted' },
      declined: { color: 'bg-red-100 text-red-800', label: 'Declined' },
      processing: { color: 'bg-blue-100 text-blue-800', label: 'Processing' },
      shipped: { color: 'bg-purple-100 text-purple-800', label: 'Shipped' },
      completed: { color: 'bg-gray-100 text-gray-800', label: 'Completed' },
    };
    
    const variant = variants[status] || variants.pending;
    return <Badge className={variant.color}>{variant.label}</Badge>;
  };

  const canAccept = order.status === 'pending';
  const canDecline = order.status === 'pending';
  const canProcess = order.status === 'accepted';
  const canShip = order.status === 'processing';
  const canComplete = order.status === 'shipped';

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Equipment Image */}
            <div className="w-full lg:w-48 h-48 flex-shrink-0">
              <img
                src={order.equipment?.image_url || '/placeholder.svg'}
                alt={order.equipment?.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {/* Order Details */}
            <div className="flex-1 space-y-4">
              {/* Header Section */}
              <div className="flex justify-between items-start pb-3 border-b">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-[#333333]">
                      {order.shipping_full_name || order.customer?.full_name || 'Customer'}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500">Order ID: {order.id.slice(0, 8).toUpperCase()}</p>
                </div>
                {getStatusBadge(order.status)}
              </div>

              {/* Product Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Product Ordered</h4>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-[#333333]">{order.equipment?.name || 'Unknown Equipment'}</p>
                    {order.equipment?.manufacturer && (
                      <p className="text-sm text-gray-600">by {order.equipment.manufacturer}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Quantity: 1</p>
                    {order.equipment?.price && (
                      <p className="text-sm text-gray-600">Unit Price: {formatCurrency(order.equipment.price)}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Customer Contact */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-700">Contact Information</h4>
                  <div className="space-y-1.5 text-sm">
                    <p className="flex items-start gap-2">
                      <Mail className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <span className="break-all">{order.shipping_email || order.customer?.email || 'N/A'}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span>{order.shipping_phone_number || order.customer?.phone_number || 'N/A'}</span>
                    </p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-700">Delivery Address</h4>
                  <div className="space-y-1.5 text-sm">
                    <p className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-3">{order.shipping_address}</span>
                    </p>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-700">Order Summary</h4>
                  <div className="space-y-1.5 text-sm">
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span>{format(new Date(order.created_at), 'PPP')}</span>
                    </p>
                    <p className="flex items-center gap-2 text-gray-600">
                      <span className="font-medium">Payment:</span>
                      <span>{order.payment_method}</span>
                    </p>
                    <p className="text-xl font-bold text-[#E02020] mt-2">
                      Total: {formatCurrency(order.amount)}
                    </p>
                  </div>
                </div>
              </div>

              {order.notes && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Notes:</span> {order.notes}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                {canAccept && (
                  <Button
                    onClick={() => handleStatusUpdate('accepted')}
                    disabled={isUpdating}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Accept Order
                  </Button>
                )}
                
                {canDecline && (
                  <Button
                    onClick={() => setShowDeclineDialog(true)}
                    disabled={isUpdating}
                    variant="destructive"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Decline Order
                  </Button>
                )}

                {canProcess && (
                  <Button
                    onClick={() => handleStatusUpdate('processing')}
                    disabled={isUpdating}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Mark as Processing
                  </Button>
                )}

                {canShip && (
                  <Button
                    onClick={() => handleStatusUpdate('shipped')}
                    disabled={isUpdating}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Mark as Shipped
                  </Button>
                )}

                {canComplete && (
                  <Button
                    onClick={() => handleStatusUpdate('completed')}
                    disabled={isUpdating}
                    className="bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark as Completed
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Decline Confirmation Dialog */}
      <AlertDialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Decline Order?</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for declining this order (optional).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Reason for declining (e.g., out of stock, unable to fulfill)..."
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
            className="min-h-[100px]"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleStatusUpdate('declined', declineReason)}
              className="bg-red-600 hover:bg-red-700"
            >
              Decline Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
