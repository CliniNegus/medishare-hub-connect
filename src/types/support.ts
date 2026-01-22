
export type SupportCategory = 'technical' | 'billing' | 'account' | 'equipment' | 'other';
export type SupportStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type SupportPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface SupportRequest {
  id: string;
  user_id: string;
  subject: string;
  message: string;
  created_at: string;
  updated_at: string;
  status: SupportStatus;
  priority: SupportPriority;
  category?: SupportCategory;
  account_type?: string;
  admin_response?: string;
  admin_id?: string;
  resolved_at?: string;
  file_url?: string;
}

export interface SupportMessage {
  id: string;
  support_request_id: string;
  sender_id: string;
  sender_type: 'user' | 'admin';
  message: string;
  created_at: string;
  updated_at: string;
}

export interface SupportRequestWithProfile extends SupportRequest {
  profiles: {
    email: string;
    full_name: string;
    role?: string;
  } | null;
}

export const SUPPORT_CATEGORIES: { value: SupportCategory; label: string }[] = [
  { value: 'technical', label: 'Technical Issue' },
  { value: 'billing', label: 'Billing & Payments' },
  { value: 'account', label: 'Account Management' },
  { value: 'equipment', label: 'Equipment Related' },
  { value: 'other', label: 'Other' },
];

export const SUPPORT_STATUSES: { value: SupportStatus; label: string; color: string }[] = [
  { value: 'open', label: 'Open', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' },
  { value: 'resolved', label: 'Resolved', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
  { value: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
];
