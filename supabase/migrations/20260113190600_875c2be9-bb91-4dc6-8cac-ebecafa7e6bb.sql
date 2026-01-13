-- Fix NOT NULL constraints on columns that use ON DELETE SET NULL
-- support_requests.user_id must be nullable for ON DELETE SET NULL to work
ALTER TABLE public.support_requests ALTER COLUMN user_id DROP NOT NULL;

-- Also check and fix sender_id in system_messages (it's NOT NULL in schema)
ALTER TABLE public.system_messages ALTER COLUMN sender_id DROP NOT NULL;

-- Also fix support_conversations.sender_id 
ALTER TABLE public.support_conversations ALTER COLUMN sender_id DROP NOT NULL;