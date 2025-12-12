import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    const { action, clusterId, category } = await req.json();

    // Fetch historical data for analysis
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get booking data
    const { data: bookings } = await supabase
      .from("bookings")
      .select("*, equipment:equipment_id(category, name)")
      .gte("created_at", thirtyDaysAgo.toISOString());

    // Get equipment data
    const { data: equipment } = await supabase
      .from("equipment")
      .select("id, name, category, status, location, booking_count, usage_hours");

    // Get existing usage patterns
    const { data: usagePatterns } = await supabase
      .from("usage_patterns")
      .select("*")
      .gte("date_recorded", thirtyDaysAgo.toISOString().split("T")[0]);

    // Aggregate data by category
    const categoryStats: Record<string, any> = {};
    
    equipment?.forEach((eq) => {
      const cat = eq.category || "Uncategorized";
      if (!categoryStats[cat]) {
        categoryStats[cat] = {
          totalEquipment: 0,
          totalBookings: 0,
          totalUsageHours: 0,
          availableCount: 0,
        };
      }
      categoryStats[cat].totalEquipment++;
      categoryStats[cat].totalBookings += eq.booking_count || 0;
      categoryStats[cat].totalUsageHours += eq.usage_hours || 0;
      if (eq.status === "Available") {
        categoryStats[cat].availableCount++;
      }
    });

    bookings?.forEach((booking) => {
      const cat = booking.equipment?.category || "Uncategorized";
      if (categoryStats[cat]) {
        categoryStats[cat].recentBookings = (categoryStats[cat].recentBookings || 0) + 1;
      }
    });

    // Prepare data summary for AI
    const dataSummary = Object.entries(categoryStats).map(([cat, stats]: [string, any]) => ({
      category: cat,
      totalEquipment: stats.totalEquipment,
      availableEquipment: stats.availableCount,
      utilizationRate: stats.totalEquipment > 0 
        ? ((stats.totalEquipment - stats.availableCount) / stats.totalEquipment * 100).toFixed(1)
        : 0,
      recentBookings: stats.recentBookings || 0,
      avgUsageHours: stats.totalEquipment > 0 
        ? (stats.totalUsageHours / stats.totalEquipment).toFixed(1)
        : 0,
    }));

    const systemPrompt = `You are an AI health demand forecasting specialist for medical equipment in hospitals. 
Analyze the provided equipment usage data and generate demand predictions.

Your task is to:
1. Analyze current utilization patterns
2. Identify equipment categories with high demand
3. Predict future demand levels (low, normal, high, critical)
4. Provide actionable recommendations for procurement and resource allocation
5. Consider seasonal factors and healthcare trends

Always respond with valid JSON in this exact format:
{
  "forecasts": [
    {
      "category": "string",
      "predictedDemand": number (1-100 scale),
      "demandLevel": "low" | "normal" | "high" | "critical",
      "confidenceScore": number (0-1),
      "reasoning": "string explaining the prediction",
      "factors": {
        "utilizationTrend": "increasing" | "stable" | "decreasing",
        "seasonalImpact": "low" | "medium" | "high",
        "supplyGap": number
      }
    }
  ],
  "aggregatedInsights": {
    "totalDemandScore": number,
    "criticalCategories": ["string"],
    "recommendedActions": ["string"],
    "procurementPriorities": [
      {
        "category": "string",
        "urgency": "low" | "medium" | "high",
        "suggestedQuantity": number,
        "estimatedBudget": number
      }
    ]
  },
  "summary": "string with overall analysis"
}`;

    const userPrompt = `Analyze this medical equipment usage data and generate demand forecasts:

Current Equipment Statistics (Last 30 days):
${JSON.stringify(dataSummary, null, 2)}

Total bookings in period: ${bookings?.length || 0}
Total equipment items: ${equipment?.length || 0}
Usage pattern records: ${usagePatterns?.length || 0}

Please provide:
1. Demand forecasts for each equipment category
2. Aggregated insights for procurement planning
3. Recommendations for resource optimization

Focus on identifying supply gaps and predicting which categories will see increased demand.`;

    console.log("Calling AI for demand analysis...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    console.log("AI response received, parsing...");

    // Parse the AI response (handle markdown code blocks)
    let parsedResponse;
    try {
      // Remove markdown code blocks if present
      let cleanContent = content;
      if (content.includes("```json")) {
        cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      } else if (content.includes("```")) {
        cleanContent = content.replace(/```\n?/g, "");
      }
      parsedResponse = JSON.parse(cleanContent.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      // Return a default structure if parsing fails
      parsedResponse = {
        forecasts: dataSummary.map((stat) => ({
          category: stat.category,
          predictedDemand: Math.min(100, Number(stat.utilizationRate) + 20),
          demandLevel: Number(stat.utilizationRate) > 80 ? "high" : Number(stat.utilizationRate) > 50 ? "normal" : "low",
          confidenceScore: 0.7,
          reasoning: "Based on current utilization patterns",
          factors: {
            utilizationTrend: "stable",
            seasonalImpact: "medium",
            supplyGap: Math.max(0, stat.totalEquipment - stat.availableEquipment),
          },
        })),
        aggregatedInsights: {
          totalDemandScore: 65,
          criticalCategories: [],
          recommendedActions: ["Monitor equipment utilization", "Plan preventive maintenance"],
          procurementPriorities: [],
        },
        summary: "Analysis based on current equipment data.",
      };
    }

    // Store forecasts in database
    if (parsedResponse.forecasts && parsedResponse.forecasts.length > 0) {
      const forecastDate = new Date();
      forecastDate.setDate(forecastDate.getDate() + 7); // Forecast for next week

      const forecastRecords = parsedResponse.forecasts.map((forecast: any) => ({
        equipment_category: forecast.category,
        forecast_date: forecastDate.toISOString().split("T")[0],
        predicted_demand: forecast.predictedDemand,
        confidence_score: forecast.confidenceScore,
        demand_level: forecast.demandLevel,
        factors: forecast.factors,
        ai_reasoning: forecast.reasoning,
        cluster_id: clusterId || null,
      }));

      const { error: insertError } = await supabase
        .from("demand_forecasts")
        .insert(forecastRecords);

      if (insertError) {
        console.error("Error storing forecasts:", insertError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        forecasts: parsedResponse.forecasts,
        insights: parsedResponse.aggregatedInsights,
        summary: parsedResponse.summary,
        dataPoints: {
          totalEquipment: equipment?.length || 0,
          totalBookings: bookings?.length || 0,
          categoriesAnalyzed: Object.keys(categoryStats).length,
        },
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Demand forecast error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
