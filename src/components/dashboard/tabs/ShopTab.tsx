
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search, Filter, Tag, Star, TrendingUp, Package, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const ShopTab: React.FC = () => {
  // Mock product categories
  const categories = [
    { id: 1, name: "Disposables", count: 124 },
    { id: 2, name: "Instruments", count: 87 },
    { id: 3, name: "Monitoring", count: 56 },
    { id: 4, name: "Diagnostic", count: 43 },
    { id: 5, name: "Surgical", count: 38 },
    { id: 6, name: "Emergency", count: 29 }
  ];
  
  // Mock products data
  const products = [
    {
      id: 1,
      name: "Premium Surgical Gloves",
      category: "Disposables",
      price: 24.99,
      image: "/placeholder.svg",
      rating: 4.5,
      inStock: true,
      popular: true
    },
    {
      id: 2,
      name: "Digital Thermometer",
      category: "Diagnostic",
      price: 39.99,
      image: "/placeholder.svg",
      rating: 4.2,
      inStock: true,
      popular: false
    },
    {
      id: 3,
      name: "Stethoscope - Professional",
      category: "Diagnostic",
      price: 89.99,
      image: "/placeholder.svg",
      rating: 4.8,
      inStock: true,
      popular: true
    },
    {
      id: 4,
      name: "Surgical Mask Pack",
      category: "Disposables",
      price: 19.99,
      image: "/placeholder.svg",
      rating: 4.0,
      inStock: true,
      popular: true
    },
    {
      id: 5,
      name: "Blood Pressure Monitor",
      category: "Monitoring",
      price: 79.99,
      image: "/placeholder.svg",
      rating: 4.3,
      inStock: false,
      popular: false
    },
    {
      id: 6,
      name: "Pulse Oximeter",
      category: "Monitoring",
      price: 49.99,
      image: "/placeholder.svg",
      rating: 4.6,
      inStock: true,
      popular: true
    },
    {
      id: 7,
      name: "Surgical Scissors",
      category: "Instruments",
      price: 34.99,
      image: "/placeholder.svg",
      rating: 4.4,
      inStock: true,
      popular: false
    },
    {
      id: 8,
      name: "First Aid Kit - Complete",
      category: "Emergency",
      price: 59.99,
      image: "/placeholder.svg",
      rating: 4.7,
      inStock: true,
      popular: true
    }
  ];

  // Popular trending products
  const trendingProducts = products.filter(product => product.popular);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-red-600">Medical Shop</h2>
          <p className="text-gray-600">Purchase disposables and smaller medical equipment</p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700">
          <ShoppingCart className="h-4 w-4 mr-2" />
          View Cart (0)
        </Button>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search products..." 
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select className="border rounded-md px-3 py-2 bg-white text-sm">
            <option>All Categories</option>
            {categories.map(category => (
              <option key={category.id}>{category.name}</option>
            ))}
          </select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Trending Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-red-600" />
            Trending Products
          </CardTitle>
          <CardDescription>Most popular items purchased by hospitals in your network</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {trendingProducts.map(product => (
              <Card key={product.id} className="border border-gray-200">
                <div className="relative h-40 bg-gray-100 flex items-center justify-center">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="max-h-full max-w-full p-4" 
                  />
                  {product.popular && (
                    <Badge className="absolute top-2 left-2 bg-red-600">Popular</Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm mb-1">{product.name}</h3>
                  <div className="flex items-center mb-2">
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                    <div className="flex items-center ml-2">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs ml-1">{product.rating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="font-bold text-red-600">${product.price}</div>
                    <Button size="sm" className="bg-red-600 hover:bg-red-700">
                      <ShoppingCart className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* All Products */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">All Products</h3>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Sort by:</span>
            <select className="border rounded-md px-3 py-1 bg-white text-sm">
              <option>Popularity</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(product => (
            <Card key={product.id} className="border border-gray-200">
              <div className="relative h-40 bg-gray-100 flex items-center justify-center">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="max-h-full max-w-full p-4" 
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Badge variant="outline" className="text-white border-white">Out of Stock</Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-sm mb-1">{product.name}</h3>
                <div className="flex items-center mb-2">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                  <div className="flex items-center ml-2">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-xs ml-1">{product.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <div className="font-bold text-red-600">${product.price}</div>
                  <Button 
                    size="sm" 
                    className="bg-red-600 hover:bg-red-700"
                    disabled={!product.inStock}
                  >
                    <ShoppingCart className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center mb-3">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <Truck className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-medium text-red-800">Fast Delivery</h3>
                <p className="text-sm text-red-700">Next-day delivery available</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center mb-3">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <Package className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-medium text-red-800">Bulk Discounts</h3>
                <p className="text-sm text-red-700">Special pricing for large orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center mb-3">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <Tag className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-medium text-red-800">Price Match</h3>
                <p className="text-sm text-red-700">We match any competitor pricing</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShopTab;
