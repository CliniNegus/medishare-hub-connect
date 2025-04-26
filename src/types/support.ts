
export interface SupportRequest {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  created_at: string;
  updated_at: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  admin_response?: string;
  admin_id?: string;
  resolved_at?: string;
}
