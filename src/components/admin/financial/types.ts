
export interface Transaction {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  status: string;
  paystack_reference?: string;
  user_id: string;
  metadata?: any;
  created_at: string;
  updated_at: string;
  user_email?: string;
  user_name?: string;
}

export interface TransactionFormData {
  reference: string;
  amount: string;
  currency: string;
  status: string;
  paystack_reference: string;
  user_id: string;
  notes: string;
  payment_method: string;
  channel: string;
}
