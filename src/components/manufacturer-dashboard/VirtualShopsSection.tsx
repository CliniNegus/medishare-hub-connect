
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, Plus, TrendingUp, MapPin, Package } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { VirtualShop } from './hooks/useManufacturerShops';
import { formatCurrency } from "@/utils/formatters";

interface VirtualShopsSectionProps {
  virtualShops: VirtualShop[];
  loadingShops: boolean;
}

const VirtualShopsSection: React.FC<VirtualShopsSectionProps> = ({ 
  virtualShops, 
  loadingShops 
}) => {
  const navigate = useNavigate();

  if (loadingShops) {
    return (
      <Card className="shadow-lg border-0">
        <CardContent className="p-8">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E02020]"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#E02020] rounded-lg">
              <Store className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl text-[#333333]">Virtual Shops</CardTitle>
              <p className="text-gray-600 text-sm">Manage your global presence</p>
            </div>
          </div>
          <Button
            onClick={() => navigate('/virtual-shops')}
            className="bg-[#E02020] hover:bg-[#c01c1c] text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Shop
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {virtualShops.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Store className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#333333] mb-2">No Virtual Shops Yet</h3>
            <p className="text-gray-600 mb-4">Create your first virtual shop to start reaching global markets</p>
            <Button
              onClick={() => navigate('/virtual-shops')}
              className="bg-[#E02020] hover:bg-[#c01c1c] text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Shop
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {virtualShops.map((shop) => (
              <Card key={shop.id} className="border border-gray-200 hover:border-[#E02020] transition-colors duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#E02020] rounded-lg">
                        <Store className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#333333]">{shop.name}</h3>
                        <p className="text-sm text-gray-600 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {shop.country}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <Package className="h-4 w-4 text-[#E02020] mr-1" />
                      </div>
                      <p className="text-lg font-bold text-[#333333]">{shop.equipment_count}</p>
                      <p className="text-xs text-gray-600">Equipment</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center mb-1">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      </div>
                      <p className="text-lg font-bold text-[#333333]">{formatCurrency(shop.revenue_generated)}</p>
                      <p className="text-xs text-gray-600">Revenue</p>
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    className="w-full border-[#E02020] text-[#E02020] hover:bg-[#E02020] hover:text-white"
                    onClick={() => navigate(`/virtual-shops?shop=${shop.id}`)}
                  >
                    Manage Shop
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VirtualShopsSection;
