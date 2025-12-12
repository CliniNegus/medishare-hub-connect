import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  RefreshCcw,
  BarChart3,
  Target,
  Lightbulb,
  Clock,
  Package,
  Activity,
  Loader2,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Minus,
} from 'lucide-react';
import { useDemandForecast } from '@/hooks/use-demand-forecast';
import { formatDistanceToNow } from 'date-fns';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from 'recharts';

const DemandForecasting = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { forecasts, insights, summary, dataPoints, loading, error, lastUpdated, generateForecast } = useDemandForecast();

  const getDemandLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'normal': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'low': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  const getDemandLevelIcon = (level: string) => {
    switch (level) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'high': return <TrendingUp className="h-4 w-4" />;
      case 'normal': return <Activity className="h-4 w-4" />;
      case 'low': return <TrendingDown className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <ArrowUp className="h-4 w-4 text-green-600" />;
      case 'decreasing': return <ArrowDown className="h-4 w-4 text-red-600" />;
      default: return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const chartData = forecasts.map(f => ({
    name: f.category.length > 15 ? f.category.substring(0, 15) + '...' : f.category,
    fullName: f.category,
    demand: f.predictedDemand,
    confidence: Math.round(f.confidenceScore * 100),
  }));

  const demandLevelDistribution = [
    { name: 'Critical', value: forecasts.filter(f => f.demandLevel === 'critical').length, color: '#ef4444' },
    { name: 'High', value: forecasts.filter(f => f.demandLevel === 'high').length, color: '#f97316' },
    { name: 'Normal', value: forecasts.filter(f => f.demandLevel === 'normal').length, color: '#22c55e' },
    { name: 'Low', value: forecasts.filter(f => f.demandLevel === 'low').length, color: '#3b82f6' },
  ].filter(d => d.value > 0);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              AI Demand Forecasting
            </h1>
            <p className="text-muted-foreground">
              Predictive analytics for equipment needs and resource optimization
            </p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Updated {formatDistanceToNow(lastUpdated, { addSuffix: true })}
              </span>
            )}
            <Button onClick={() => generateForecast()} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Generate Forecast
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{dataPoints?.totalEquipment || 0}</p>
                  <p className="text-xs text-muted-foreground">Total Equipment</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-500/10">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{dataPoints?.categoriesAnalyzed || 0}</p>
                  <p className="text-xs text-muted-foreground">Categories Analyzed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-orange-500/10">
                  <Target className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{insights?.totalDemandScore || 0}</p>
                  <p className="text-xs text-muted-foreground">Demand Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-red-500/10">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{insights?.criticalCategories?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">Critical Categories</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Summary */}
        {summary && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Brain className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">AI Analysis Summary</h3>
                  <p className="text-sm text-muted-foreground">{summary}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="forecasts">Forecasts</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="recommendations">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Demand by Category Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Predicted Demand by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis />
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-background border rounded-lg p-3 shadow-lg">
                                  <p className="font-medium">{payload[0].payload.fullName}</p>
                                  <p className="text-sm text-muted-foreground">Demand: {payload[0].value}</p>
                                  <p className="text-sm text-muted-foreground">Confidence: {payload[0].payload.confidence}%</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="demand" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>Generate a forecast to see demand predictions</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Demand Level Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Demand Level Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  {demandLevelDistribution.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={demandLevelDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {demandLevelDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No demand data available</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="forecasts" className="mt-6">
            {forecasts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">No Forecasts Available</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Click "Generate Forecast" to analyze equipment demand patterns.
                  </p>
                  <Button onClick={() => generateForecast()} disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
                    Generate Now
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {forecasts.map((forecast, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-base">{forecast.category}</CardTitle>
                        </div>
                        <Badge variant="outline" className={getDemandLevelColor(forecast.demandLevel)}>
                          {getDemandLevelIcon(forecast.demandLevel)}
                          <span className="ml-1 capitalize">{forecast.demandLevel}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Predicted Demand</span>
                          <span className="font-medium">{forecast.predictedDemand}%</span>
                        </div>
                        <Progress value={forecast.predictedDemand} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Confidence</span>
                        <span className="font-medium">{Math.round(forecast.confidenceScore * 100)}%</span>
                      </div>

                      {forecast.factors && (
                        <div className="flex items-center gap-3 text-sm">
                          <div className="flex items-center gap-1">
                            {getTrendIcon(forecast.factors.utilizationTrend)}
                            <span className="text-muted-foreground capitalize">
                              {forecast.factors.utilizationTrend}
                            </span>
                          </div>
                          {forecast.factors.supplyGap > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              Gap: {forecast.factors.supplyGap}
                            </Badge>
                          )}
                        </div>
                      )}

                      {forecast.reasoning && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {forecast.reasoning}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="insights" className="mt-6">
            {insights ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      Critical Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {insights.criticalCategories && insights.criticalCategories.length > 0 ? (
                      <div className="space-y-2">
                        {insights.criticalCategories.map((cat, i) => (
                          <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-red-500/10">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span className="font-medium">{cat}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No critical categories identified.</p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Procurement Priorities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {insights.procurementPriorities && insights.procurementPriorities.length > 0 ? (
                      <div className="space-y-3">
                        {insights.procurementPriorities.map((priority, i) => (
                          <div key={i} className="p-3 rounded-lg border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{priority.category}</span>
                              <Badge variant={priority.urgency === 'high' ? 'destructive' : 'secondary'}>
                                {priority.urgency}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                              <span>Quantity: {priority.suggestedQuantity}</span>
                              <span>Budget: KES {priority.estimatedBudget?.toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No procurement priorities at this time.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">No Insights Available</h3>
                  <p className="text-sm text-muted-foreground">
                    Generate a forecast to see AI-powered insights.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="recommendations" className="mt-6">
            {insights?.recommendedActions && insights.recommendedActions.length > 0 ? (
              <div className="space-y-4">
                {insights.recommendedActions.map((action, i) => (
                  <Card key={i}>
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <Lightbulb className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">Recommendation {i + 1}</h3>
                          <p className="text-muted-foreground">{action}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          Take Action
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium mb-2">No Recommendations Yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Generate a forecast to receive actionable recommendations.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default DemandForecasting;
