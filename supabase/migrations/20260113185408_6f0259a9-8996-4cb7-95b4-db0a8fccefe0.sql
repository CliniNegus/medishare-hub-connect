-- Fix foreign key constraints that prevent user deletion
-- These tables need ON DELETE SET NULL or ON DELETE CASCADE

-- support_requests
ALTER TABLE public.support_requests DROP CONSTRAINT IF EXISTS support_requests_user_id_fkey;
ALTER TABLE public.support_requests ADD CONSTRAINT support_requests_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.support_requests DROP CONSTRAINT IF EXISTS support_requests_admin_id_fkey;
ALTER TABLE public.support_requests ADD CONSTRAINT support_requests_admin_id_fkey 
  FOREIGN KEY (admin_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.support_requests DROP CONSTRAINT IF EXISTS support_requests_assigned_admin_id_fkey;
ALTER TABLE public.support_requests ADD CONSTRAINT support_requests_assigned_admin_id_fkey 
  FOREIGN KEY (assigned_admin_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- audit_logs - set null since we want to keep audit trail
ALTER TABLE public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_user_id_fkey;
ALTER TABLE public.audit_logs ADD CONSTRAINT audit_logs_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- security_audit_log - set null to keep security logs
ALTER TABLE public.security_audit_log DROP CONSTRAINT IF EXISTS security_audit_log_user_id_fkey;
ALTER TABLE public.security_audit_log ADD CONSTRAINT security_audit_log_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- archived_data
ALTER TABLE public.archived_data DROP CONSTRAINT IF EXISTS archived_data_archived_by_fkey;
ALTER TABLE public.archived_data ADD CONSTRAINT archived_data_archived_by_fkey 
  FOREIGN KEY (archived_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- data_backups
ALTER TABLE public.data_backups DROP CONSTRAINT IF EXISTS data_backups_created_by_fkey;
ALTER TABLE public.data_backups ADD CONSTRAINT data_backups_created_by_fkey 
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- email_templates
ALTER TABLE public.email_templates DROP CONSTRAINT IF EXISTS email_templates_created_by_fkey;
ALTER TABLE public.email_templates ADD CONSTRAINT email_templates_created_by_fkey 
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- bookings
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_user_id_fkey;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- system_messages
ALTER TABLE public.system_messages DROP CONSTRAINT IF EXISTS system_messages_sender_id_fkey;
ALTER TABLE public.system_messages ADD CONSTRAINT system_messages_sender_id_fkey 
  FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.system_messages DROP CONSTRAINT IF EXISTS system_messages_recipient_id_fkey;
ALTER TABLE public.system_messages ADD CONSTRAINT system_messages_recipient_id_fkey 
  FOREIGN KEY (recipient_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- system_settings
ALTER TABLE public.system_settings DROP CONSTRAINT IF EXISTS system_settings_created_by_fkey;
ALTER TABLE public.system_settings ADD CONSTRAINT system_settings_created_by_fkey 
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- transactions
ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_user_id_fkey;
ALTER TABLE public.transactions ADD CONSTRAINT transactions_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- support_conversations
ALTER TABLE public.support_conversations DROP CONSTRAINT IF EXISTS support_conversations_sender_id_fkey;
ALTER TABLE public.support_conversations ADD CONSTRAINT support_conversations_sender_id_fkey 
  FOREIGN KEY (sender_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- wishlists
ALTER TABLE public.wishlists DROP CONSTRAINT IF EXISTS wishlists_user_id_fkey;
ALTER TABLE public.wishlists ADD CONSTRAINT wishlists_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- user_mfa
ALTER TABLE public.user_mfa DROP CONSTRAINT IF EXISTS user_mfa_user_id_fkey;
ALTER TABLE public.user_mfa ADD CONSTRAINT user_mfa_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;