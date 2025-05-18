
import React, { useState, useEffect } from 'react';
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import ShopSearch from '@/components/shop/ShopSearch';
import TrendingProducts from '@/components/shop/TrendingProducts';
import ProductGrid from '@/components/shop/ProductGrid';
import ShopFeatures from '@/components/shop/ShopFeatures';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';

const ShopTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { totalItems, setIsOpen } = useCart();
  
  // Mock categories data - will be updated with real data
  const [categories, setCategories] = useState([
    { id: 1, name: "Disposables", count: 0 },
    { id: 2, name: "Instruments", count: 0 },
    { id: 3, name: "Monitoring", count: 0 },
    { id: 4, name: "Diagnostic", count: 0 },
    { id: 5, name: "Surgical", count: 0 },
    { id: 6, name: "First Aid", count: 0 },
    { id: 7, name: "PPE", count: 0 },
    { id: 8, name: "Supplies", count: 0 }
  ]);
  
  // Fetch category counts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Get all products to calculate category counts
        const { data, error } = await supabase
          .from('products')
          .select('category')
          .not('category', 'is', null);
        
        if (error) throw error;
        
        if (data) {
          // Calculate counts for each category
          const categoryCounts = {};
          data.forEach(item => {
            if (item.category) {
              categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
            }
          });
          
          // Update categories with counts
          const updatedCategories = categories.map(cat => {
            return {
              ...cat,
              count: categoryCounts[cat.name] || 0
            };
          });
          
          // Add any new categories not in the original list
          Object.keys(categoryCounts).forEach(categoryName => {
            if (!updatedCategories.some(c => c.name === categoryName)) {
              updatedCategories.push({
                id: updatedCategories.length + 1,
                name: categoryName,
                count: categoryCounts[categoryName]
              });
            }
          });
          
          setCategories(updatedCategories.filter(cat => cat.count > 0));
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

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
        
        <ProductGrid 
          category={selectedCategory}
          searchTerm={searchTerm}
        />
      </div>
      
      <ShopFeatures />
    </div>
  );
};

export default ShopTab;
