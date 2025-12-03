import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Package, Search, TrendingUp, 
  BarChart3, Target, AlertTriangle, RefreshCw,
  PieChart, LineChart
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/formatters';
import { Line, LineChart as RechartsLineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

const InvestorEquipmentView = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [investedEquipment, setInvestedEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');

  useEffect(() => {
    fetchInvestedEquipment();
  }, [user]);

  // Fetch revenue from completed orders for given equipment IDs
  const fetchEquipmentRevenue = async (equipmentIds: string[]): Promise<Record<string, number>> => {
    if (equipmentIds.length === 0) return {};
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('equipment_id, amount')
        .eq('status', 'completed')
        .in('equipment_id', equipmentIds);
      
      if (error) {
        console.error('Error fetching order revenue:', error);
        return {};
      }
      
      const revenueMap: Record<string, number> = {};
      (data || []).forEach(order => {
        if (order.equipment_id) {
          revenueMap[order.equipment_id] = (revenueMap[order.equipment_id] || 0) + (order.amount || 0);
        }
      });
      
      return revenueMap;
    } catch (err) {
      console.error('Error calculating equipment revenue:', err);
      return {};
    }
  };

  const fetchInvestedEquipment = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch equipment that the investor has invested in
      const { data: investments, error: investmentsError } = await supabase
        .from('investments')
        .select(`
          id,
          amount,
          roi,
          status,
          date,
          term,
          equipment:equipment_id (
            id,
            name,
            category,
            status,
            location,
            image_url,
            usage_hours,
            price,
            lease_rate
          ),
          hospitals:hospital_id (
            name
          )
        `)
        .eq('investor_id', user.id);

      if (investmentsError) throw investmentsError;

      // Get equipment IDs for revenue lookup
      const equipmentIds = (investments || [])
        .map(inv => inv.equipment?.id)
        .filter(Boolean) as string[];
      
      // Fetch real revenue from completed orders
      const revenueMap = await fetchEquipmentRevenue(equipmentIds);

      // Transform the data to include investment metrics with real revenue
      const formattedEquipment = (investments || []).map(investment => ({
        ...investment.equipment,
        revenue_generated: revenueMap[investment.equipment?.id] || 0,
        investment: {
          id: investment.id,
          amount: investment.amount,
          roi: investment.roi,
          status: investment.status,
          date: investment.date,
          term: investment.term,
          hospital_name: investment.hospitals?.name || 'Unknown Hospital'
        }
      })).filter(item => item.id); // Filter out null equipment

      setInvestedEquipment(formattedEquipment);
    } catch (error) {
      console.error('Error fetching invested equipment:', error);
      toast({
        title: 'Error',
        description: 'Failed to load invested equipment',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredEquipment = investedEquipment.filter(item => {
    const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.investment?.hospital_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Calculate investment statistics
  const stats = {
    totalInvested: investedEquipment.reduce((sum, item) => sum + (item.investment?.amount || 0), 0),
    totalEquipment: investedEquipment.length,
    activeInvestments: investedEquipment.filter(item => item.investment?.status === 'active').length,
    totalRevenue: investedEquipment.reduce((sum, item) => sum + (item.revenue_generated || 0), 0),
    totalUsageHours: investedEquipment.reduce((sum, item) => sum + (item.usage_hours || 0), 0),
    averageROI: investedEquipment.length > 0 
      ? investedEquipment.reduce((sum, item) => sum + (item.investment?.roi || 0), 0) / investedEquipment.length 
      : 0
  };

  // Generate chart data from actual investments
  const equipmentTypeData = React.useMemo(() => {
    const categoryGroups = investedEquipment.reduce((acc, item) => {
      const category = item.category || 'Other';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const colors = ['#E02020', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];
    return Object.entries(categoryGroups).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
  }, [investedEquipment]);

  // Generate revenue trend data from actual investments (aggregated by investment date)
  const revenueData = React.useMemo(() => {
    if (investedEquipment.length === 0) {
      return [];
    }
    
    const monthlyData: Record<string, { revenue: number; usage: number }> = {};
    investedEquipment.forEach(item => {
      const date = new Date(item.investment?.date || Date.now());
      const monthKey = date.toLocaleString('default', { month: 'short' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { revenue: 0, usage: 0 };
      }
      monthlyData[monthKey].revenue += (item.revenue_generated || 0);
      monthlyData[monthKey].usage += (item.usage_hours || 0);
    });
    
    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      revenue: data.revenue,
      usage: data.usage
    }));
  }, [investedEquipment]);

  const getInvestmentStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'completed':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E02020]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#E02020] to-[#c01c1c] text-white rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Investment Portfolio</h1>
            <p className="text-white/90">Monitor your equipment investments and ROI performance</p>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-3">
            <h3 className="font-semibold">Total Invested</h3>
            <p className="text-2xl font-bold">{formatCurrency(stats.totalInvested)}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <h3 className="font-semibold">Equipment Count</h3>
            <p className="text-2xl font-bold">{stats.totalEquipment}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <h3 className="font-semibold">Average ROI</h3>
            <p className="text-2xl font-bold">{stats.averageROI.toFixed(1)}%</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <h3 className="font-semibold">Total Revenue</h3>
            <p className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</p>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {revenueData.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              Revenue & Usage Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? formatCurrency(Number(value)) : `${value}h`,
                    name === 'revenue' ? 'Revenue' : 'Usage Hours'
                  ]}
                />
                <Line type="monotone" dataKey="revenue" stroke="#E02020" strokeWidth={2} />
                <Line type="monotone" dataKey="usage" stroke="#10B981" strokeWidth={2} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Revenue & Usage Trends
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground">
              No data available yet
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Equipment Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={equipmentTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {equipmentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search equipment or hospital..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Investment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <Badge className={getInvestmentStatusColor(item.investment?.status)}>
                  {item.investment?.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{item.category}</p>
              <p className="text-xs text-gray-500">{item.investment?.hospital_name}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {item.image_url && (
                <img 
                  src={item.image_url} 
                  alt={item.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
              )}
              
              {/* Investment Metrics */}
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Investment:</span>
                  <span className="font-medium">{formatCurrency(item.investment?.amount || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current ROI:</span>
                  <span className={`font-medium ${(item.investment?.roi || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(item.investment?.roi || 0).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Usage Hours:</span>
                  <span className="font-medium">{item.usage_hours || 0}h</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Revenue Generated:</span>
                  <span className="font-medium text-green-600">{formatCurrency(item.revenue_generated || 0)}</span>
                </div>
              </div>

              {/* Performance Indicators */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Utilization Rate:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#E02020] h-2 rounded-full" 
                        style={{ width: `${Math.min(100, (item.usage_hours || 0) / 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium">{Math.min(100, (item.usage_hours || 0) / 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>

              {/* Investment Details */}
              <div className="text-xs text-gray-500 space-y-1">
                <div className="flex justify-between">
                  <span>Investment Date:</span>
                  <span>{item.investment?.date ? new Date(item.investment.date).toLocaleDateString() : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Term:</span>
                  <span>{item.investment?.term || 'N/A'}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Details
                </Button>
                <Button variant="outline" size="sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <Card className="p-12 text-center">
          <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Equipment Investments Found</h3>
          <p className="text-gray-500">
            {investedEquipment.length === 0 
              ? "You haven't made any equipment investments yet." 
              : "Try adjusting your search criteria"
            }
          </p>
        </Card>
      )}
    </div>
  );
};

export default InvestorEquipmentView;