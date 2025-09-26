-- Add popularity fields to equipment table
ALTER TABLE public.equipment 
ADD COLUMN IF NOT EXISTS popularity_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS booking_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_popularity_update TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_equipment_popularity ON public.equipment(popularity_score DESC, is_featured DESC);

-- Create function to update popularity score based on bookings
CREATE OR REPLACE FUNCTION public.update_equipment_popularity_score(equipment_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  booking_count_val INTEGER;
  usage_hours_val INTEGER;
  calculated_score INTEGER;
BEGIN
  -- Count bookings for this equipment
  SELECT COUNT(*) INTO booking_count_val
  FROM public.bookings 
  WHERE equipment_id = equipment_id_param AND status != 'cancelled';
  
  -- Get usage hours (if available)
  SELECT COALESCE(usage_hours, 0) INTO usage_hours_val
  FROM public.equipment 
  WHERE id = equipment_id_param;
  
  -- Calculate popularity score (bookings * 10 + usage_hours)
  calculated_score := (booking_count_val * 10) + usage_hours_val;
  
  -- Update equipment with new score and booking count
  UPDATE public.equipment 
  SET 
    popularity_score = calculated_score,
    booking_count = booking_count_val,
    last_popularity_update = NOW()
  WHERE id = equipment_id_param;
END;
$function$;

-- Create function to get top popular equipment
CREATE OR REPLACE FUNCTION public.get_top_popular_equipment(limit_count INTEGER DEFAULT 5)
RETURNS TABLE(
  id UUID,
  name TEXT,
  manufacturer TEXT,
  category TEXT,
  status TEXT,
  location TEXT,
  image_url TEXT,
  popularity_score INTEGER,
  is_featured BOOLEAN,
  booking_count INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.name,
    e.manufacturer,
    e.category,
    e.status,
    e.location,
    e.image_url,
    e.popularity_score,
    e.is_featured,
    e.booking_count
  FROM public.equipment e
  WHERE e.status = 'Available'
  ORDER BY 
    e.is_featured DESC,
    e.popularity_score DESC,
    e.created_at DESC
  LIMIT limit_count;
END;
$function$;

-- Create trigger to update popularity when bookings change
CREATE OR REPLACE FUNCTION public.trigger_update_equipment_popularity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    PERFORM public.update_equipment_popularity_score(NEW.equipment_id);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.update_equipment_popularity_score(OLD.equipment_id);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;

-- Create trigger on bookings table
DROP TRIGGER IF EXISTS bookings_popularity_update ON public.bookings;
CREATE TRIGGER bookings_popularity_update
  AFTER INSERT OR UPDATE OR DELETE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_update_equipment_popularity();