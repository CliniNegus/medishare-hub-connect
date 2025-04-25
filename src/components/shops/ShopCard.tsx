
import React, { useState } from 'react';
import { Store, Package, Map, Settings, ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import ShopBadge from './ShopBadge';
import EquipmentList from './EquipmentList';
import { Shop } from './types';

interface ShopCardProps {
  shop: Shop;
  onRefresh: () => void;
}

const ShopCard: React.FC<ShopCardProps> = ({ shop, onRefresh }) => {
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
            <ShopBadge className="bg-green-100 text-green-800 border-green-300">{shop.status || 'Active'}</ShopBadge>
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
            
            <EquipmentList 
              shopId={shop.id}
              equipment={equipment}
              loadingEquipment={loadingEquipment}
              onNavigate={navigate}
            />
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

export default ShopCard;
