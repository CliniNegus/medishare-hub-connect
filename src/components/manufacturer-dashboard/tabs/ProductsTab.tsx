
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, DollarSign, MapPin, Settings } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface Product {
  id: string;
  name: string;
  status: string;
  manufacturer?: string;
  category?: string;
  price?: number;
  lease_rate?: number;
  location?: string;
}

interface ProductsTabProps {
  leasedProducts: Product[];
}

const ProductsTab: React.FC<ProductsTabProps> = ({ leasedProducts }) => {
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

  if (leasedProducts.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">No Products Found</h3>
          <p className="text-gray-500 mb-4">You haven't added any equipment yet.</p>
          <Button 
            className="bg-[#E02020] hover:bg-[#c01c1c] text-white"
            onClick={() => navigate('/products')}
          >
            Add Your First Product
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#333333]">Your Equipment Portfolio</h3>
        <Button 
          variant="outline"
          className="border-[#E02020] text-[#E02020] hover:bg-[#E02020] hover:text-white"
          onClick={() => navigate('/products')}
        >
          <Settings className="h-4 w-4 mr-2" />
          Manage All Products
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leasedProducts.map((product) => (
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
              {product.category && (
                <p className="text-sm text-gray-500">{product.category}</p>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {product.price && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600">
                      <DollarSign className="h-3 w-3 mr-1" />
                      Sale Price
                    </span>
                    <span className="font-medium">Ksh {product.price.toLocaleString()}</span>
                  </div>
                )}
                {product.lease_rate && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600">
                      <DollarSign className="h-3 w-3 mr-1" />
                      Lease Rate
                    </span>
                    <span className="font-medium">Ksh {product.lease_rate}/month</span>
                  </div>
                )}
                {product.location && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-gray-600">
                      <MapPin className="h-3 w-3 mr-1" />
                      Location
                    </span>
                    <span className="font-medium truncate">{product.location}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductsTab;
