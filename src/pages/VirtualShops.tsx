
import React, { useState, useEffect } from 'react';
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Store, Map, Package, Settings, DollarSign, ChevronRight, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Shop {
  id: string;
  name: string;
  country: string;
  description: string | null;
  logo_url: string | null;
  status: string | null;
  equipment_count: number;
  revenue_total: number;
}

const VirtualShops = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newShop, setNewShop] = useState({
    name: '',
    country: '',
    description: ''
  });
  const countries = ["Kenya", "Rwanda", "Nigeria", "Ghana", "South Africa", "Uganda", "Tanzania", "Ethiopia", "Egypt"];

  const { user } = useAuth();
  const { role } = useUserRole();
  const { toast } = useToast();

  useEffect(() => {
    fetchShops();
  }, [user]);

  const fetchShops = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get shops with equipment count
      const { data: shopsData, error: shopsError } = await supabase
        .from('manufacturer_shops')
        .select('*')
        .eq('manufacturer_id', user.id);

      if (shopsError) throw shopsError;

      // For each shop, count equipment and revenue
      if (shopsData) {
        const shopsWithStats = await Promise.all(
          shopsData.map(async (shop) => {
            const { count: equipmentCount } = await supabase
              .from('equipment')
              .select('*', { count: 'exact', head: true })
              .eq('shop_id', shop.id);

            const { data: revenueData } = await supabase
              .from('equipment')
              .select('revenue_generated')
              .eq('shop_id', shop.id);

            const revenueTotal = revenueData?.reduce((sum, item) => 
              sum + (parseFloat(item.revenue_generated || 0)), 0) || 0;

            return {
              ...shop,
              equipment_count: equipmentCount || 0,
              revenue_total: revenueTotal
            };
          })
        );

        setShops(shopsWithStats);
      }
    } catch (error: any) {
      console.error('Error fetching shops:', error.message);
      toast({
        variant: "destructive",
        title: "Error fetching shops",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateShop = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('manufacturer_shops')
        .insert({
          name: newShop.name,
          country: newShop.country,
          description: newShop.description,
          manufacturer_id: user.id
        })
        .select();

      if (error) throw error;
      
      toast({
        title: "Shop created",
        description: `${newShop.name} has been created successfully.`,
      });
      
      setIsCreateDialogOpen(false);
      setNewShop({ name: '', country: '', description: '' });
      fetchShops();
    } catch (error: any) {
      console.error('Error creating shop:', error.message);
      toast({
        variant: "destructive",
        title: "Error creating shop",
        description: error.message,
      });
    }
  };

  if (role !== 'manufacturer' && role !== 'admin') {
    return (
      <Layout>
        <div className="container mx-auto py-10">
          <Card className="border-red-200">
            <CardContent className="p-6">
              <div className="text-center py-10">
                <Store className="h-16 w-16 text-red-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Manufacturer Access Required</h2>
                <p className="mb-6">You need manufacturer access to view virtual shops.</p>
                <Button>Return to Dashboard</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-red-600">Virtual Manufacturer Shops</h1>
            <p className="text-gray-600">Manage your virtual shops and equipment across different countries</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" /> Create Shop
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Virtual Shop</DialogTitle>
                <DialogDescription>
                  Create a new shop to list and manage medical devices for a specific country.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Shop Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g., Kenya Medical Shop" 
                    value={newShop.name} 
                    onChange={(e) => setNewShop({...newShop, name: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="country">Country</Label>
                  <Select 
                    value={newShop.country} 
                    onValueChange={(value) => setNewShop({...newShop, country: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe what this shop offers" 
                    value={newShop.description} 
                    onChange={(e) => setNewShop({...newShop, description: e.target.value})}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleCreateShop}
                  disabled={!newShop.name || !newShop.country}
                >
                  Create Shop
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : shops.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {shops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} onRefresh={fetchShops} />
            ))}
          </div>
        ) : (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="p-10 text-center">
              <Store className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-medium mb-2">No virtual shops yet</h3>
              <p className="text-gray-500 mb-6">Create your first virtual shop to start managing medical equipment</p>
              <Button 
                className="bg-red-600 hover:bg-red-700"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" /> Create Your First Shop
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

interface ShopCardProps {
  shop: Shop;
  onRefresh: () => void;
}

const ShopCard = ({ shop, onRefresh }: ShopCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loadingEquipment, setLoadingEquipment] = useState(false);
  const { toast } = useToast();
  const navigate = (path: string) => {
    window.location.href = path;
  };

  const loadEquipment = async () => {
    if (!expanded) {
      try {
        setLoadingEquipment(true);
        const { data, error } = await supabase
          .from('equipment')
          .select('*')
          .eq('shop_id', shop.id)
          .limit(5);
        
        if (error) throw error;
        
        setEquipment(data || []);
      } catch (error: any) {
        console.error('Error loading equipment:', error.message);
        toast({
          variant: "destructive",
          title: "Error loading equipment",
          description: error.message,
        });
      } finally {
        setLoadingEquipment(false);
      }
    }
    setExpanded(!expanded);
  };

  return (
    <Card className="border-gray-200 hover:border-red-200 transition-colors">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-red-600 h-10 w-10 rounded-full flex items-center justify-center mr-3">
              <Store className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">{shop.name}</CardTitle>
              <CardDescription>{shop.country}</CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-100 text-green-800 border-green-300">{shop.status || 'Active'}</Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500"
              onClick={loadEquipment}
            >
              {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="grid grid-cols-3 divide-x divide-gray-200 border-b border-gray-200">
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500">Total Equipment</p>
            <p className="text-2xl font-semibold text-black">{shop.equipment_count}</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500">Revenue Generated</p>
            <p className="text-2xl font-semibold text-red-600">${shop.revenue_total.toFixed(2)}</p>
          </div>
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500">Device Status</p>
            <p className="text-lg font-semibold text-black">
              <span className="inline-block h-3 w-3 rounded-full bg-green-500 mr-2"></span>
              {Math.round((shop.equipment_count > 0 ? 85 : 0))}% Online
            </p>
          </div>
        </div>
        
        {expanded && (
          <div className="p-4">
            <div className="mb-4 flex justify-between items-center">
              <h3 className="font-medium">Equipment in this shop</h3>
              <Button 
                variant="outline" 
                size="sm"
                className="text-red-600 border-red-200"
                onClick={() => navigate(`/products?shop=${shop.id}`)}
              >
                View All
              </Button>
            </div>
            
            {loadingEquipment ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
              </div>
            ) : equipment.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {equipment.map((item) => (
                  <div key={item.id} className="py-2 flex justify-between items-center">
                    <div className="flex items-center">
                      <Package className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Badge className={item.status === 'Available' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-amber-100 text-amber-800 border-amber-300'}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-gray-500 mb-4">No equipment in this shop yet</p>
                <Button 
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => navigate(`/products?shop=${shop.id}`)}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Equipment
                </Button>
              </div>
            )}
          </div>
        )}
        
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              className="border-red-200 text-red-600"
              onClick={() => navigate(`/products?shop=${shop.id}`)}
            >
              <Package className="h-4 w-4 mr-2" /> Manage Equipment
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="border-red-200 text-red-600"
              onClick={() => navigate(`/tracking?shop=${shop.id}`)}
            >
              <Map className="h-4 w-4 mr-2" /> View Tracking
            </Button>
          </div>
          <div>
            <Button 
              variant="outline" 
              size="sm"
              className="border-red-200 text-red-600"
              onClick={() => navigate(`/shop-settings?id=${shop.id}`)}
            >
              <Settings className="h-4 w-4 mr-2" /> Shop Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Needed Badge component for this page
const Badge = ({ children, className, ...props }: any) => {
  return (
    <span 
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`} 
      {...props}
    >
      {children}
    </span>
  );
};

export default VirtualShops;
