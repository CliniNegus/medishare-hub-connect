
import React, { useState } from 'react';
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShopSearch from '@/components/shop/ShopSearch';
import TrendingProducts from '@/components/shop/TrendingProducts';
import ProductGrid from '@/components/shop/ProductGrid';
import ShopFeatures from '@/components/shop/ShopFeatures';

const ShopTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Mock categories data
  const categories = [
    { id: 1, name: "Disposables", count: 124 },
    { id: 2, name: "Instruments", count: 87 },
    { id: 3, name: "Monitoring", count: 56 },
    { id: 4, name: "Diagnostic", count: 43 },
    { id: 5, name: "Surgical", count: 38 },
    { id: 6, name: "Emergency", count: 29 }
  ];

  return (
    <div className="w-full space-y-6">
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
      
      <ShopSearch 
        categories={categories}
        onSearchChange={setSearchTerm}
        onCategoryChange={setSelectedCategory}
      />
      
      <TrendingProducts />
      
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
        
        <ProductGrid />
      </div>
      
      <ShopFeatures />
    </div>
  );
};

export default ShopTab;
