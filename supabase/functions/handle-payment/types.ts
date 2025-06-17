
export interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface PaymentRequest {
  amount: number;
  email: string;
  metadata: {
    reference: string;
    user_id: string;
    equipment_id?: string;
    equipment_name?: string;
    cart_items?: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
      total: number;
    }>;
    shipping_address?: string;
    notes?: string;
    item_count?: number;
    order_type?: string;
  };
}
