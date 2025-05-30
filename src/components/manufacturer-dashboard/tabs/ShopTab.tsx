
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Store, Package, DollarSign, TrendingUp } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface ShopProduct {
  id: string;
  name: string;
  shop_name: string;
  stock: number;
  revenue: number;
  status: string;
}

interface ShopTabProps {
  shopProducts: ShopProduct[];
}

const ShopTab: React.FC<ShopTabProps> = ({ shopProducts }) => {
  const navigate = useNavigate();

  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'leased':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const totalRevenue = shopProducts.reduce((sum, product) => sum + product.revenue, 0);
  const totalStock = shopProducts.reduce((sum, product) => sum + product.stock, 0);

  if (shopProducts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Store className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">No Shop Products</h3>
          <p className="text-gray-500 mb-4">You don't have any products in your virtual shops yet.</p>
          <Button 
            className="bg-[#E02020] hover:bg-[#c01c1c] text-white"
            onClick={() => navigate('/virtual-shops')}
          >
            Manage Virtual Shops
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#333333]">Virtual Shop Management</h3>
        <Button 
          variant="outline"
          className="border-[#E02020] text-[#E02020] hover:bg-[#E02020] hover:text-white"
          onClick={() => navigate('/virtual-shops')}
        >
          <Store className="h-4 w-4 mr-2" />
          Manage All Shops
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-[#E02020] mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-[#333333]">{shopProducts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-[#E02020] mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Stock</p>
                <p className="text-2xl font-bold text-[#333333]">{totalStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-[#E02020] mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-[#333333]">${totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {shopProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium text-[#333333] truncate">
                  {product.name}
                </CardTitle>
                <Badge className={getStatusBadgeColor(product.status)}>
                  {product.status}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 flex items-center">
                <Store className="h-3 w-3 mr-1" />
                {product.shop_name}
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Stock:</span>
                  <span className="ml-2 font-medium">{product.stock}</span>
                </div>
                <div>
                  <span className="text-gray-600">Revenue:</span>
                  <span className="ml-2 font-medium text-[#E02020]">${product.revenue.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ShopTab;
