import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Forecast {
  category: string;
  predictedDemand: number;
  demandLevel: 'low' | 'normal' | 'high' | 'critical';
  confidenceScore: number;
  reasoning: string;
  factors: {
    utilizationTrend: string;
    seasonalImpact: string;
    supplyGap: number;
  };
}

interface AggregatedInsights {
  totalDemandScore: number;
  criticalCategories: string[];
  recommendedActions: string[];
  procurementPriorities: {
    category: string;
    urgency: string;
    suggestedQuantity: number;
    estimatedBudget: number;
  }[];
}

interface DemandForecastResult {
  success: boolean;
  forecasts: Forecast[];
  insights: AggregatedInsights;
  summary: string;
  dataPoints: {
    totalEquipment: number;
    totalBookings: number;
    categoriesAnalyzed: number;
  };
}

export const useDemandForecast = () => {
  const [forecasts, setForecasts] = useState<Forecast[]>([]);
  const [insights, setInsights] = useState<AggregatedInsights | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [dataPoints, setDataPoints] = useState<{ totalEquipment: number; totalBookings: number; categoriesAnalyzed: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { toast } = useToast();

  const generateForecast = async (clusterId?: string, category?: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('demand-forecast', {
        body: { action: 'generate', clusterId, category },
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      const result = data as DemandForecastResult;
      
      setForecasts(result.forecasts || []);
      setInsights(result.insights || null);
      setSummary(result.summary || '');
      setDataPoints(result.dataPoints || null);
      setLastUpdated(new Date());

      toast({
        title: 'Forecast Generated',
        description: `Analyzed ${result.dataPoints?.categoriesAnalyzed || 0} equipment categories.`,
      });

      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to generate forecast';
      setError(errorMessage);
      
      toast({
        title: 'Forecast Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchStoredForecasts = async () => {
    try {
      const { data, error } = await supabase
        .from('demand_forecasts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      // Transform to match the Forecast interface
      const transformedForecasts = data?.map((f: any) => ({
        category: f.equipment_category,
        predictedDemand: f.predicted_demand,
        demandLevel: f.demand_level,
        confidenceScore: f.confidence_score,
        reasoning: f.ai_reasoning || '',
        factors: f.factors || {},
      })) || [];

      setForecasts(transformedForecasts);
      if (data && data.length > 0) {
        setLastUpdated(new Date(data[0].created_at));
      }
    } catch (err) {
      console.error('Error fetching stored forecasts:', err);
    }
  };

  useEffect(() => {
    fetchStoredForecasts();
  }, []);

  return {
    forecasts,
    insights,
    summary,
    dataPoints,
    loading,
    error,
    lastUpdated,
    generateForecast,
    refetch: fetchStoredForecasts,
  };
};
