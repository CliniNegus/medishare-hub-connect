
import React, { useState } from 'react';
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShopSearch from '@/components/shop/ShopSearch';
import TrendingProducts from '@/components/shop/TrendingProducts';
import ProductGrid from '@/components/shop/ProductGrid';
import ShopFeatures from '@/components/shop/ShopFeatures';
import { useCart } from '@/contexts/CartContext';
import { useProducts } from '@/hooks/use-products';
import ShopFilters from '@/components/shop/ShopFilters';

const ShopTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [productType, setProductType] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const { totalItems, setIsOpen } = useCart();
  
  // Fetch categories using the hook
  const { uniqueCategories } = useProducts();

  return (
    <div className="w-full space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-red-600">Medical Shop</h2>
          <p className="text-gray-600">Purchase disposables and smaller medical equipment</p>
        </div>
        <Button 
          className="bg-red-600 hover:bg-red-700"
          onClick={() => setIsOpen(true)}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          View Cart ({totalItems})
        </Button>
      </div>
      
      <ShopFilters
        searchTerm={searchTerm}
        category={category}
        productType={productType}
        sortBy={sortBy}
        uniqueCategories={uniqueCategories}
        onSearchChange={setSearchTerm}
        onCategoryChange={setCategory}
        onProductTypeChange={setProductType}
        onSortByChange={setSortBy}
      />
      
      <TrendingProducts />
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">All Products</h3>
        </div>
        
        <ProductGrid 
          filterOptions={{
            category: category === 'all' ? undefined : category,
            searchTerm,
            productType: productType as 'all' | 'disposable' | 'reusable',
            sortBy: sortBy as 'popularity' | 'price_low_to_high' | 'price_high_to_low' | 'newest'
          }}
        />
      </div>
      
      <ShopFeatures />
    </div>
  );
};

export default ShopTab;
