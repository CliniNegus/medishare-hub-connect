-- Add category and account_type columns to support_requests
ALTER TABLE public.support_requests 
ADD COLUMN IF NOT EXISTS category text DEFAULT 'other',
ADD COLUMN IF NOT EXISTS account_type text;

-- Create index for filtering
CREATE INDEX IF NOT EXISTS idx_support_requests_category ON public.support_requests(category);
CREATE INDEX IF NOT EXISTS idx_support_requests_account_type ON public.support_requests(account_type);
CREATE INDEX IF NOT EXISTS idx_support_requests_status ON public.support_requests(status);

-- Update RLS to allow users to add follow-up messages
DROP POLICY IF EXISTS "Users can insert their own conversations" ON public.support_conversations;
CREATE POLICY "Users can insert their own conversations"
ON public.support_conversations
FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND 
  EXISTS (
    SELECT 1 FROM public.support_requests sr 
    WHERE sr.id = support_request_id 
    AND (sr.user_id = auth.uid() OR is_admin())
    AND sr.status != 'closed'
  )
);

-- Allow admins to insert conversations
DROP POLICY IF EXISTS "Admins can insert conversations" ON public.support_conversations;
CREATE POLICY "Admins can insert conversations"
ON public.support_conversations
FOR INSERT
WITH CHECK (is_admin());

-- Users can view their own ticket conversations
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.support_conversations;
CREATE POLICY "Users can view their own conversations"
ON public.support_conversations
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.support_requests sr 
    WHERE sr.id = support_request_id 
    AND sr.user_id = auth.uid()
  )
);

-- Admins can view all conversations
DROP POLICY IF EXISTS "Admins can view all conversations" ON public.support_conversations;
CREATE POLICY "Admins can view all conversations"
ON public.support_conversations
FOR SELECT
USING (is_admin());

-- Function to notify admin on new support ticket
CREATE OR REPLACE FUNCTION public.notify_admin_new_support_ticket()
RETURNS TRIGGER AS $$
DECLARE
  admin_record RECORD;
BEGIN
  -- Create notification for all admins
  FOR admin_record IN 
    SELECT id FROM public.profiles WHERE role = 'admin'
  LOOP
    INSERT INTO public.notifications (user_id, title, message, type, action_url)
    VALUES (
      admin_record.id,
      'New Support Ticket',
      format('New support ticket: %s', NEW.subject),
      'info',
      '/admin'
    );
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new support ticket notification
DROP TRIGGER IF EXISTS on_support_ticket_created ON public.support_requests;
CREATE TRIGGER on_support_ticket_created
AFTER INSERT ON public.support_requests
FOR EACH ROW
EXECUTE FUNCTION public.notify_admin_new_support_ticket();

-- Function to notify user on admin response
CREATE OR REPLACE FUNCTION public.notify_user_support_response()
RETURNS TRIGGER AS $$
DECLARE
  request_record RECORD;
BEGIN
  -- Only notify if admin sent the message
  IF NEW.sender_type = 'admin' THEN
    SELECT sr.user_id, sr.subject INTO request_record
    FROM public.support_requests sr
    WHERE sr.id = NEW.support_request_id;
    
    IF request_record.user_id IS NOT NULL THEN
      INSERT INTO public.notifications (user_id, title, message, type, action_url)
      VALUES (
        request_record.user_id,
        'Support Response',
        format('Admin responded to: %s', request_record.subject),
        'info',
        '/help'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for support response notification
DROP TRIGGER IF EXISTS on_support_response ON public.support_conversations;
CREATE TRIGGER on_support_response
AFTER INSERT ON public.support_conversations
FOR EACH ROW
EXECUTE FUNCTION public.notify_user_support_response();

-- Function to notify user on status change
CREATE OR REPLACE FUNCTION public.notify_user_ticket_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status AND NEW.user_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, title, message, type, action_url)
    VALUES (
      NEW.user_id,
      'Ticket Status Updated',
      format('Your ticket "%s" status changed to: %s', NEW.subject, NEW.status),
      CASE 
        WHEN NEW.status = 'resolved' THEN 'success'
        WHEN NEW.status = 'closed' THEN 'warning'
        ELSE 'info'
      END,
      '/help'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for status change notification
DROP TRIGGER IF EXISTS on_ticket_status_change ON public.support_requests;
CREATE TRIGGER on_ticket_status_change
AFTER UPDATE OF status ON public.support_requests
FOR EACH ROW
EXECUTE FUNCTION public.notify_user_ticket_status_change();