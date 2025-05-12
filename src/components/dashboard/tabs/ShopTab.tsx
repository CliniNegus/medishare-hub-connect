
import React, { useState } from 'react';
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShopSearch from '@/components/shop/ShopSearch';
import TrendingProducts from '@/components/shop/TrendingProducts';
import ProductCard from '@/components/shop/ProductCard';
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
      
      <TrendingProducts products={products} />
      
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
          {products
            .filter(product => 
              (!selectedCategory || product.category === selectedCategory) &&
              (!searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </div>
      
      <ShopFeatures />
    </div>
  );
};

export default ShopTab;
