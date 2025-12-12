-- Create demand_forecasts table for AI predictions
CREATE TABLE public.demand_forecasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hospital_id UUID,
  cluster_id UUID REFERENCES public.hospital_clusters(id) ON DELETE SET NULL,
  equipment_category TEXT NOT NULL,
  forecast_date DATE NOT NULL,
  predicted_demand INTEGER NOT NULL DEFAULT 0,
  confidence_score NUMERIC DEFAULT 0.8,
  demand_level TEXT DEFAULT 'normal',
  factors JSONB DEFAULT '{}',
  ai_reasoning TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_demand_level CHECK (demand_level IN ('low', 'normal', 'high', 'critical'))
);

-- Create usage_patterns table for historical data
CREATE TABLE public.usage_patterns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hospital_id UUID,
  equipment_id UUID REFERENCES public.equipment(id) ON DELETE CASCADE,
  equipment_category TEXT,
  date_recorded DATE NOT NULL DEFAULT CURRENT_DATE,
  usage_hours NUMERIC DEFAULT 0,
  booking_count INTEGER DEFAULT 0,
  patient_volume INTEGER DEFAULT 0,
  seasonal_factor NUMERIC DEFAULT 1.0,
  day_of_week INTEGER,
  is_holiday BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create demand_aggregations table for cluster-level insights
CREATE TABLE public.demand_aggregations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cluster_id UUID REFERENCES public.hospital_clusters(id) ON DELETE CASCADE,
  equipment_category TEXT NOT NULL,
  aggregation_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_demand INTEGER DEFAULT 0,
  available_supply INTEGER DEFAULT 0,
  supply_gap INTEGER DEFAULT 0,
  recommended_action TEXT,
  procurement_suggestion JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.demand_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demand_aggregations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for demand_forecasts
CREATE POLICY "Users can view forecasts for their hospital or cluster"
ON public.demand_forecasts FOR SELECT
USING (
  auth.uid() = hospital_id 
  OR is_admin()
  OR EXISTS (
    SELECT 1 FROM hospital_clusters hc
    WHERE hc.id = demand_forecasts.cluster_id
  )
);

CREATE POLICY "Admins can manage forecasts"
ON public.demand_forecasts FOR ALL
USING (is_admin());

-- RLS Policies for usage_patterns
CREATE POLICY "Users can view their usage patterns"
ON public.usage_patterns FOR SELECT
USING (auth.uid() = hospital_id OR is_admin());

CREATE POLICY "Users can insert their usage patterns"
ON public.usage_patterns FOR INSERT
WITH CHECK (auth.uid() = hospital_id OR is_admin());

CREATE POLICY "Admins can manage all usage patterns"
ON public.usage_patterns FOR ALL
USING (is_admin());

-- RLS Policies for demand_aggregations
CREATE POLICY "Users can view aggregations"
ON public.demand_aggregations FOR SELECT
USING (true);

CREATE POLICY "Admins can manage aggregations"
ON public.demand_aggregations FOR ALL
USING (is_admin());

-- Create indexes
CREATE INDEX idx_demand_forecasts_date ON public.demand_forecasts(forecast_date);
CREATE INDEX idx_demand_forecasts_category ON public.demand_forecasts(equipment_category);
CREATE INDEX idx_usage_patterns_date ON public.usage_patterns(date_recorded);
CREATE INDEX idx_usage_patterns_hospital ON public.usage_patterns(hospital_id);
CREATE INDEX idx_demand_aggregations_cluster ON public.demand_aggregations(cluster_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE demand_forecasts;
ALTER PUBLICATION supabase_realtime ADD TABLE demand_aggregations;

-- Create triggers
CREATE TRIGGER update_demand_forecasts_updated_at
  BEFORE UPDATE ON public.demand_forecasts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_demand_aggregations_updated_at
  BEFORE UPDATE ON public.demand_aggregations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();