
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  inventoryItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    type: 'hospital' | 'clinic';
    cluster: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: 'credit' | 'invoice' | 'wallet';
  dateCreated: string;
  dateUpdated: string;
  shippingAddress: string;
  trackingNumber?: string;
  notes?: string;
}
