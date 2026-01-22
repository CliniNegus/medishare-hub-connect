-- Fix function search paths for security
CREATE OR REPLACE FUNCTION public.notify_admin_new_support_ticket()
RETURNS TRIGGER AS $$
DECLARE
  admin_record RECORD;
BEGIN
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.notify_user_support_response()
RETURNS TRIGGER AS $$
DECLARE
  request_record RECORD;
BEGIN
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;