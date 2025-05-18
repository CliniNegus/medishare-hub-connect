
export interface Booking {
  id: string;
  equipment_id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'in-use' | 'completed' | 'cancelled';
  notes?: string;
  price_paid: number;
  created_at: string;
  updated_at: string;
}
