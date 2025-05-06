
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, Plus, Package } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface VirtualShop {
  id: string;
  name: string;
  country: string;
  equipment_count: number;
  revenue_generated: number;
}

interface VirtualShopsSectionProps {
  virtualShops: VirtualShop[];
  loadingShops: boolean;
}

const VirtualShopsSection = ({ virtualShops, loadingShops }: VirtualShopsSectionProps) => {
  const navigate = useNavigate();

  return (
    <Card className="mb-8 border-red-100">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg flex items-center">
              <Store className="h-5 w-5 mr-2 text-red-600" />
              Virtual Shops
            </CardTitle>
            <CardDescription>
              Manage your equipment across different countries
            </CardDescription>
          </div>
          <Button 
            onClick={() => navigate('/virtual-shops')}
            className="bg-red-600 hover:bg-red-700"
          >
            View All Shops
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loadingShops ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          </div>
        ) : virtualShops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {virtualShops.map(shop => (
              <Card key={shop.id} className="border border-gray-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-md">{shop.name}</CardTitle>
                  <CardDescription>{shop.country}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-between items-center mb-2 mt-2">
                    <div>
                      <p className="text-sm text-gray-500">Equipment</p>
                      <p className="font-semibold">{shop.equipment_count}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Revenue</p>
                      <p className="font-semibold text-red-600">
                        ${shop.revenue_generated.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-2 border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => navigate(`/products?shop=${shop.id}`)}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Manage Equipment
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Store className="h-12 w-12 mx-auto text-gray-300 mb-3" />
            <h3 className="text-lg font-medium mb-2">No Virtual Shops Yet</h3>
            <p className="text-gray-500 mb-4">Create your first virtual shop to start managing your equipment globally</p>
            <Button 
              onClick={() => navigate('/virtual-shops')}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Shop
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VirtualShopsSection;
