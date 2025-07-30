-- Enhanced maintenance system for hospital management

-- Update maintenance table with additional fields
ALTER TABLE public.maintenance ADD COLUMN IF NOT EXISTS technician_name TEXT;
ALTER TABLE public.maintenance ADD COLUMN IF NOT EXISTS technician_notes TEXT;
ALTER TABLE public.maintenance ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical'));
ALTER TABLE public.maintenance ADD COLUMN IF NOT EXISTS maintenance_type TEXT DEFAULT 'preventive' CHECK (maintenance_type IN ('preventive', 'corrective', 'calibration', 'inspection', 'repair'));
ALTER TABLE public.maintenance ADD COLUMN IF NOT EXISTS estimated_duration INTEGER DEFAULT 2; -- in hours
ALTER TABLE public.maintenance ADD COLUMN IF NOT EXISTS actual_duration INTEGER; -- in hours
ALTER TABLE public.maintenance ADD COLUMN IF NOT EXISTS cost NUMERIC(10,2);
ALTER TABLE public.maintenance ADD COLUMN IF NOT EXISTS is_overdue BOOLEAN DEFAULT FALSE;

-- Create maintenance notifications table
CREATE TABLE IF NOT EXISTS public.maintenance_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  maintenance_id UUID REFERENCES public.maintenance(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('reminder', 'overdue', 'completion')),
  sent_at TIMESTAMP WITH TIME ZONE,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  message TEXT NOT NULL,
  recipient_id UUID,
  is_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on maintenance_notifications
ALTER TABLE public.maintenance_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for maintenance_notifications
CREATE POLICY "Maintenance notifications access" ON public.maintenance_notifications
FOR ALL USING (
  is_admin() OR 
  auth.uid() = recipient_id OR 
  EXISTS (
    SELECT 1 FROM maintenance m 
    WHERE m.id = maintenance_notifications.maintenance_id 
    AND (m.created_by = auth.uid() OR EXISTS (
      SELECT 1 FROM equipment e 
      WHERE e.id = m.equipment_id 
      AND e.owner_id = auth.uid()
    ))
  )
);

-- Create function to automatically mark overdue maintenance
CREATE OR REPLACE FUNCTION public.mark_overdue_maintenance()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.maintenance 
  SET is_overdue = TRUE, updated_at = now()
  WHERE scheduled_date < now() 
    AND status NOT IN ('completed', 'cancelled')
    AND is_overdue = FALSE;
END;
$$;

-- Create function to schedule maintenance notifications
CREATE OR REPLACE FUNCTION public.schedule_maintenance_notifications(maintenance_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  maintenance_record RECORD;
  reminder_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get maintenance details
  SELECT * INTO maintenance_record 
  FROM public.maintenance 
  WHERE id = maintenance_id_param;
  
  IF maintenance_record IS NULL THEN
    RETURN;
  END IF;
  
  -- Schedule reminder 24 hours before
  reminder_date := maintenance_record.scheduled_date - INTERVAL '24 hours';
  
  INSERT INTO public.maintenance_notifications (
    maintenance_id,
    notification_type,
    scheduled_for,
    message,
    recipient_id
  ) VALUES (
    maintenance_id_param,
    'reminder',
    reminder_date,
    'Maintenance scheduled for ' || maintenance_record.equipment_id || ' tomorrow',
    maintenance_record.created_by
  );
  
  -- Schedule overdue notification if needed
  INSERT INTO public.maintenance_notifications (
    maintenance_id,
    notification_type,
    scheduled_for,
    message,
    recipient_id
  ) VALUES (
    maintenance_id_param,
    'overdue',
    maintenance_record.scheduled_date + INTERVAL '1 hour',
    'Maintenance for ' || maintenance_record.equipment_id || ' is overdue',
    maintenance_record.created_by
  );
END;
$$;

-- Create trigger to automatically schedule notifications
CREATE OR REPLACE FUNCTION public.trigger_schedule_maintenance_notifications()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only schedule notifications for new maintenance records
  IF TG_OP = 'INSERT' AND NEW.status = 'scheduled' THEN
    PERFORM public.schedule_maintenance_notifications(NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS schedule_maintenance_notifications_trigger ON public.maintenance;
CREATE TRIGGER schedule_maintenance_notifications_trigger
  AFTER INSERT ON public.maintenance
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_schedule_maintenance_notifications();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_maintenance_scheduled_date ON public.maintenance(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_maintenance_status ON public.maintenance(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_equipment_id ON public.maintenance(equipment_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_overdue ON public.maintenance(is_overdue) WHERE is_overdue = TRUE;
CREATE INDEX IF NOT EXISTS idx_maintenance_notifications_scheduled ON public.maintenance_notifications(scheduled_for) WHERE is_sent = FALSE;