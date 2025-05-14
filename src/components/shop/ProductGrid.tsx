
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, ClipboardList } from 'lucide-react';
import PaymentOptionsDialog from '@/components/PaymentOptionsDialog';
import { useEquipmentData } from '@/hooks/use-equipment-data';
import { Skeleton } from "@/components/ui/skeleton";

const ProductGrid = () => {
  const { equipment: products, loading } = useEquipmentData();

  const getTypeIcon = (type: string) => {
    if (type === "purchase") return "";
    if (type === "lease") return <ClipboardList className="h-4 w-4 mr-1" />;
    if (type === "finance") return <Calculator className="h-4 w-4 mr-1" />;
  };

  const formatPrice = (price: number) => {
    return price >= 1000 ? 
      `$${(price/1000).toFixed(0)}K` : 
      `$${price.toFixed(2)}`;
  };

  const getProductType = (product: any) => {
    if (product.leaseRate && product.leaseRate > 0) return "lease";
    if (product.purchasePrice && product.purchasePrice > 1000) return "finance";
    return "purchase";
  };

  const getActionButton = (product: any) => {
    const productType = getProductType(product);
    
    if (productType === "purchase") {
      return (
        <PaymentOptionsDialog
          productType="purchase"
          productName={product.name}
          price={product.price}
        >
          <Button 
            variant="default" 
            className="bg-red-600 hover:bg-red-700"
            disabled={product.type !== 'available'}
          >
            Buy Now
          </Button>
        </PaymentOptionsDialog>
      );
    } else if (productType === "lease") {
      return (
        <PaymentOptionsDialog
          productType="lease"
          productName={product.name}
          price={product.price}
          leaseRate={product.leaseRate}
        >
          <Button 
            variant="outline" 
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            <ClipboardList className="h-4 w-4 mr-2" />
            Lease Options
          </Button>
        </PaymentOptionsDialog>
      );
    } else if (productType === "finance") {
      return (
        <PaymentOptionsDialog
          productType="finance"
          productName={product.name}
          price={product.price}
          monthlyPayment={product.leaseRate}
        >
          <Button 
            variant="outline" 
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Financing Options
          </Button>
        </PaymentOptionsDialog>
      );
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="overflow-hidden border border-gray-200">
            <Skeleton className="aspect-square" />
            <CardHeader className="p-4 pb-0">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter className="p-4 pt-0 flex items-center justify-between">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-9 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <Card key={product.id} className="overflow-hidden border border-gray-200 hover:shadow-md transition-shadow">
          <div className="aspect-square bg-gray-100 relative">
            <img 
              src={product.image_url} 
              alt={product.name}
              className="object-cover w-full h-full"
            />
            {product.type !== 'available' && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Badge variant="destructive" className="text-sm">Out of Stock</Badge>
              </div>
            )}
            {getProductType(product) !== "purchase" && (
              <Badge 
                className={`absolute top-2 right-2 ${
                  getProductType(product) === "lease" ? "bg-amber-100 text-amber-800 border-amber-300" : 
                  "bg-purple-100 text-purple-800 border-purple-300"
                }`}
              >
                {getTypeIcon(getProductType(product))}
                {getProductType(product) === "lease" ? "Available for Lease" : "Financing Available"}
              </Badge>
            )}
          </div>
          <CardHeader className="p-4 pb-0">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <Badge variant="outline" className="border-red-300 text-red-600">{product.category}</Badge>
            </div>
            <p className="text-sm text-gray-500">{product.manufacturer}</p>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-sm">{product.description}</p>
            {getProductType(product) === "lease" && product.leaseRate && (
              <p className="text-sm font-medium text-amber-700 mt-2">
                Lease Rate: ${product.leaseRate}/month
              </p>
            )}
            {getProductType(product) === "finance" && product.leaseRate && (
              <p className="text-sm font-medium text-purple-700 mt-2">
                Est. Payment: ${product.leaseRate}/month
              </p>
            )}
          </CardContent>
          <CardFooter className="p-4 pt-0 flex items-center justify-between">
            <span className="font-bold">{formatPrice(product.price)}</span>
            {getActionButton(product)}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ProductGrid;
