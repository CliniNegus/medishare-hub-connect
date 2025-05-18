
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import ShopHeader from '@/components/shop/ShopHeader';
import ShopFilters from '@/components/shop/ShopFilters';
import ProductGrid from '@/components/shop/ProductGrid';
import { CartProvider } from '@/contexts/CartContext';
import CartSidebar from '@/components/shop/CartSidebar';
import TrendingProducts from '@/components/shop/TrendingProducts';
import ShopFeatures from '@/components/shop/ShopFeatures';
import { supabase } from '@/integrations/supabase/client';

const MedicalShop = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [productType, setProductType] = useState("all");
  const [uniqueCategories, setUniqueCategories] = useState<string[]>(["all"]);
  
  // Fetch unique categories
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .not('category', 'is', null);
      
      if (!error && data) {
        const categories = [...new Set(data.map(item => item.category))];
        setUniqueCategories(["all", ...categories]);
      }
    };
    
    fetchCategories();
  }, []);
  
  return (
    <CartProvider>
      <Layout>
        <div className="p-6 max-w-7xl mx-auto">
          <ShopHeader />
          
          <ShopFilters 
            searchTerm={searchTerm}
            category={category}
            productType={productType}
            uniqueCategories={uniqueCategories}
            onSearchChange={setSearchTerm}
            onCategoryChange={setCategory}
            onProductTypeChange={setProductType}
          />
          
          <TrendingProducts />

          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">All Products</h2>
            <ProductGrid 
              category={category}
              searchTerm={searchTerm}
            />
          </div>
          
          <ShopFeatures />
          
          <CartSidebar />
        </div>
      </Layout>
    </CartProvider>
  );
};

export default MedicalShop;
